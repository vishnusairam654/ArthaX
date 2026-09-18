import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import {
  AuthResultDto,
  GovIdDto,
  UserDto,
  AuthSessionPayload,
  SessionInfoDto,
  StepUpResultDto,
} from '@arthax/types';
import {
  RegisterEmailInput,
  VerifyOtpInput,
  CreateGovIdInput,
  SetFinancialPasswordInput,
  LoginInput,
  StepUpAuthInput,
} from '@arthax/validation';
import { PrismaService } from '../database/prisma.service';
import { SessionStoreService } from '../common/services/session-store.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sessionStore: SessionStoreService,
    private auditService: AuditService,
  ) {}

  /**
   * Dispatches a 6-digit verification code to the given email address.
   * Rate-limited in Redis to prevent flooding attacks.
   */
  async sendEmailOtp(
    input: RegisterEmailInput,
    ipAddress?: string,
  ): Promise<{ message: string; expirySeconds: number; code?: string }> {
    const rateLimit = await this.sessionStore.checkRateLimit(
      `otp_req:${input.email}`,
      5,
      600, // 5 requests per 10 minutes
    );

    if (!rateLimit.allowed) {
      throw new BadRequestException(
        `Too many OTP requests. Please wait ${rateLimit.resetSeconds} seconds before requesting a new code.`,
      );
    }

    // Generate 6-digit numeric OTP code
    const rawCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await argon2.hash(rawCode);
    const expiresAt = new Date(Date.now() + 300 * 1000); // 5 minutes

    // Invalidate any existing unused tokens for this email
    await this.prisma.mfaToken.updateMany({
      where: { email: input.email, purpose: 'EMAIL_VERIFY', consumed: false },
      data: { consumed: true },
    });

    await this.prisma.mfaToken.create({
      data: {
        email: input.email,
        codeHash,
        purpose: 'EMAIL_VERIFY',
        expiresAt,
        consumed: false,
      },
    });

    // In development mode, log the code to console so local developers can verify
    this.logger.log(
      `[SOVEREIGN EMAIL GATEWAY] Target: ${input.email} | Verification Code: ${rawCode} | TTL: 300s`,
    );

    return {
      message: `Sovereign identity verification code dispatched to ${input.email}`,
      expirySeconds: 300,
      code: process.env.NODE_ENV === 'development' ? rawCode : undefined,
    };
  }

  /**
   * Verifies the provided 6-digit OTP code against the hashed token in PostgreSQL.
   */
  async verifyEmailOtp(
    input: VerifyOtpInput,
  ): Promise<{ verified: boolean; registrationTicket: string }> {
    const rateLimit = await this.sessionStore.checkRateLimit(
      `otp_verify:${input.email}`,
      5,
      600,
    );

    if (!rateLimit.allowed) {
      throw new BadRequestException(
        `Too many failed attempts. Please request a new verification code.`,
      );
    }

    const tokenRecord = await this.prisma.mfaToken.findFirst({
      where: {
        email: input.email,
        purpose: 'EMAIL_VERIFY',
        consumed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    if (tokenRecord.attempts >= 3) {
      await this.prisma.mfaToken.update({
        where: { id: tokenRecord.id },
        data: { consumed: true },
      });
      throw new BadRequestException('Verification code expired due to maximum attempts');
    }

    const isValid = await argon2.verify(tokenRecord.codeHash, input.code);

    if (!isValid) {
      await this.prisma.mfaToken.update({
        where: { id: tokenRecord.id },
        data: { attempts: tokenRecord.attempts + 1 },
      });
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.prisma.mfaToken.update({
      where: { id: tokenRecord.id },
      data: { consumed: true },
    });

    // Issue short-lived registration ticket (15 minutes)
    const registrationTicket = await this.jwtService.signAsync(
      { email: input.email, stage: 'GOV_ID_CREATION' },
      { expiresIn: '15m' },
    );

    return {
      verified: true,
      registrationTicket,
    };
  }

  /**
   * Creates a new GOV ID in PostgreSQL with an independently hashed GOV Password.
   */
  async createGovId(
    input: CreateGovIdInput,
    ipAddress?: string,
  ): Promise<GovIdDto & { setupToken: string }> {
    // 1. Check if email already has an active GOV ID
    const existingGov = await this.prisma.govId.findUnique({
      where: { email: input.email },
    });
    if (existingGov) {
      throw new BadRequestException('A sovereign GOV ID is already registered to this email address.');
    }

    // 2. Generate sequential sovereign identifier: GOV-XXXX-XXXX
    const num1 = Math.floor(1000 + Math.random() * 9000);
    const num2 = Math.floor(1000 + Math.random() * 9000);
    const govIdNumber = `GOV-${num1}-${num2}`;

    // 3. Hash GOV Password with Argon2id
    const passwordHash = await argon2.hash(input.govPassword, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const govRecord = await this.prisma.govId.create({
      data: {
        govIdNumber,
        email: input.email,
        passwordHash,
        emailVerified: true,
        status: 'ACTIVE',
      },
    });

    await this.auditService.logEvent({
      eventType: 'SECURITY_EVENT',
      actorId: govRecord.govIdNumber,
      actorRole: 'SOVEREIGN_CITIZEN',
      targetEntity: 'GOV_ID',
      action: `Created new sovereign identity: ${govIdNumber}`,
      severity: 'INFO',
      ipAddress,
    });

    // Issue temporary setup token for Step 2 (setting financial password)
    const setupToken = await this.jwtService.signAsync(
      { sub: govRecord.id, govId: govRecord.id, email: input.email, stage: 'FINANCIAL_PASSWORD_SETUP' },
      { expiresIn: '30m' },
    );

    return {
      id: govRecord.id,
      govIdNumber: govRecord.govIdNumber,
      email: govRecord.email,
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: govRecord.createdAt.toISOString(),
      setupToken,
    };
  }

  /**
   * Completes registration by establishing the independently isolated Financial Password
   * and creating the ARTHAX User linked 1:1 to the GOV ID in PostgreSQL.
   */
  async setFinancialPassword(
    govId: string,
    input: SetFinancialPasswordInput,
    ipAddress?: string,
  ): Promise<AuthResultDto> {
    const govRecord = await this.prisma.govId.findUnique({ where: { id: govId } });

    if (!govRecord) {
      throw new BadRequestException('Associated GOV ID record not found');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { govId: govRecord.id } });
    if (existingUser) {
      throw new BadRequestException('User profile already initialized for this sovereign identity');
    }

    // Hash Financial Password with Argon2id (independent salt & derivation)
    const financialPasswordHash = await argon2.hash(input.financialPassword, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const userRecord = await this.prisma.user.create({
      data: {
        govId: govRecord.id,
        displayName: input.displayName || govRecord.email.split('@')[0],
        financialPasswordHash,
        role: 'USER',
        status: 'ACTIVE',
      },
    });

    // Default loadout
    await this.prisma.userLoadout.create({
      data: {
        userId: userRecord.id,
        frameId: 'frm-gold',
        avatarId: 'avt-f-business',
        bannerId: 'bnr-gold-1',
        petId: 'pet-vidya',
      },
    });

    // Initial customer relation with NAVA Bank
    const navaCust = await this.prisma.bankCustomer.create({
      data: {
        userId: userRecord.id,
        bankId: 'nava',
        customerNumber: `CUST-NAVA-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'ACTIVE',
        tier: 'Tier-1 Sovereign Citizen',
      },
    });

    // Primary NAVA Savings Account
    const acctNum = `ARTH-NAVA-${Math.floor(100 + Math.random() * 900)}`;
    const bankAcct = await this.prisma.bankAccount.create({
      data: {
        accountNumber: acctNum,
        customerId: navaCust.id,
        bankId: 'nava',
        userId: userRecord.id,
        type: 'SAVINGS',
        purpose: 'Primary Sovereign Treasury Account',
        status: 'ACTIVE',
      },
    });

    await this.prisma.ledgerAccount.create({
      data: {
        accountType: 'BANK_ACCOUNT',
        ownerEntityId: bankAcct.id,
        ownerEntityType: 'BANK_ACCOUNT',
        balanceSnapshot: 0n,
        bankAccountId: bankAcct.id,
      },
    });

    await this.auditService.logEvent({
      eventType: 'SECURITY_EVENT',
      actorId: userRecord.id,
      actorRole: 'USER',
      targetEntity: 'USER',
      action: 'Established isolated financial credential & opened default NAVA account',
      severity: 'INFO',
      ipAddress,
    });

    return this.generateAuthResult(userRecord, govRecord, ipAddress);
  }

  /**
   * Authenticates identity credentials (GOV ID + GOV Password).
   * Enforces brute-force rate limiting and 15-minute account lockouts in Redis.
   */
  async login(
    input: LoginInput,
    ipAddress: string = '127.0.0.1',
    userAgent: string = 'ARTHAX-Console',
  ): Promise<AuthResultDto> {
    const lockoutKey = input.govIdOrEmail.toLowerCase();
    const lockoutStatus = await this.sessionStore.isAccountLocked(lockoutKey);

    if (lockoutStatus.locked) {
      throw new UnauthorizedException(
        `Account temporarily locked due to repeated failed challenges. Please wait ${lockoutStatus.retryAfterSeconds} seconds.`,
      );
    }

    const govRecord = await this.prisma.govId.findFirst({
      where: {
        OR: [
          { email: { equals: input.govIdOrEmail, mode: 'insensitive' } },
          { govIdNumber: { equals: input.govIdOrEmail, mode: 'insensitive' } },
        ],
      },
      include: { user: true },
    });

    if (!govRecord || !govRecord.user) {
      await this.handleFailedLogin(lockoutKey, input.govIdOrEmail, ipAddress);
    }

    const passwordValid = await argon2.verify(govRecord.passwordHash, input.govPassword);
    if (!passwordValid) {
      await this.handleFailedLogin(lockoutKey, input.govIdOrEmail, ipAddress);
    }

    const userRecord = govRecord.user;

    // Reset failed authentication counter on success
    await this.sessionStore.resetFailedAuth(lockoutKey);

    // Resolve assigned bank for BANK_ADMIN
    let assignedBankId: string | undefined;
    if (userRecord.role === 'BANK_ADMIN') {
      assignedBankId = this.resolveAssignedBank(govRecord.email);
    }

    await this.auditService.logEvent({
      eventType: 'SECURITY_EVENT',
      actorId: userRecord.id,
      actorRole: userRecord.role,
      targetEntity: 'AUTH_GATEWAY',
      action: `Successful sovereign authentication challenge passed from ${ipAddress}`,
      severity: 'INFO',
      ipAddress,
    });

    return this.generateAuthResult(userRecord, govRecord, ipAddress, userAgent, assignedBankId);
  }

  /**
   * Verifies Financial Password challenge for sensitive money-moving operations.
   */
  async verifyStepUp(
    userId: string,
    input: StepUpAuthInput,
    ipAddress?: string,
  ): Promise<StepUpResultDto> {
    const rateLimit = await this.sessionStore.checkRateLimit(
      `stepup:${userId}`,
      5,
      300,
    );

    if (!rateLimit.allowed) {
      throw new BadRequestException(
        `Too many failed step-up challenges. Please wait ${rateLimit.resetSeconds}s.`,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User account not found');
    }

    const isValid = await argon2.verify(user.financialPasswordHash, input.financialPassword);

    if (!isValid) {
      await this.auditService.logEvent({
        eventType: 'SECURITY_EVENT',
        actorId: userId,
        actorRole: 'USER',
        targetEntity: 'STEP_UP_CHALLENGE',
        action: 'Failed step-up financial password verification',
        severity: 'WARNING',
        ipAddress,
      });
      throw new UnauthorizedException('Financial password verification failed');
    }

    // Issue short-lived step-up authorization token valid for 300 seconds
    const stepUpToken = await this.jwtService.signAsync(
      { sub: userId, stepUp: true },
      { expiresIn: '300s' },
    );

    return {
      verified: true,
      stepUpToken,
      expiresInSeconds: 300,
    };
  }

  /**
   * Lists active sessions for the current user from PostgreSQL.
   */
  async getActiveSessions(userId: string): Promise<SessionInfoDto[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId, revoked: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      ipAddress: s.ipAddress || undefined,
      userAgent: s.userAgent || undefined,
      expiresAt: s.expiresAt.toISOString(),
      createdAt: s.createdAt.toISOString(),
    }));
  }

  /**
   * Revokes a specific session by ID in both PostgreSQL and Redis.
   */
  async revokeSession(userId: string, sessionId: string): Promise<{ success: boolean }> {
    await this.sessionStore.revokeSession(sessionId);

    await this.prisma.session.updateMany({
      where: { id: sessionId, userId },
      data: { revoked: true },
    });

    return { success: true };
  }

  /**
   * Emergency Killswitch: Immediately terminates all active sessions for the user across PostgreSQL & Redis.
   */
  async emergencyKillswitch(userId: string): Promise<{ success: boolean; message: string }> {
    const sessions = await this.prisma.session.findMany({
      where: { userId, revoked: false },
    });

    for (const s of sessions) {
      await this.sessionStore.revokeSession(s.id);
    }

    await this.prisma.session.updateMany({
      where: { userId },
      data: { revoked: true },
    });

    await this.auditService.logEvent({
      eventType: 'SECURITY_EVENT',
      actorId: userId,
      actorRole: 'USER',
      targetEntity: 'EMERGENCY_KILLSWITCH',
      action: 'Emergency killswitch invoked. All user sessions invalidated across all portals.',
      severity: 'CRITICAL',
    });

    return {
      success: true,
      message: 'Emergency killswitch activated. All sessions invalidated across all portals.',
    };
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private async handleFailedLogin(
    lockoutKey: string,
    identifier: string,
    ipAddress: string,
  ): Promise<never> {
    const result = await this.sessionStore.recordFailedAuth(lockoutKey, 5, 900);

    await this.auditService.logEvent({
      eventType: 'SECURITY_EVENT',
      actorId: identifier,
      actorRole: 'UNAUTHORIZED_ATTEMPT',
      targetEntity: 'AUTH_GATEWAY',
      action: `Failed login challenge from ${ipAddress}. Remaining attempts: ${result.remainingAttempts}`,
      severity: result.locked ? 'CRITICAL' : 'WARNING',
      ipAddress,
    });

    if (result.locked) {
      throw new UnauthorizedException(
        'Account locked for 15 minutes due to 5 consecutive failed authentication challenges.',
      );
    }

    // Generic error protects against user enumeration
    throw new UnauthorizedException('Invalid sovereign credentials');
  }

  private resolveAssignedBank(email: string): string {
    const lower = email.toLowerCase();
    if (lower.includes('nava')) return 'nava';
    if (lower.includes('samaya')) return 'samaya';
    if (lower.includes('setu')) return 'setu';
    if (lower.includes('sthira')) return 'sthira';
    if (lower.includes('vayu')) return 'vayu';
    return 'nava';
  }

  private async generateAuthResult(
    userRecord: any,
    govRecord: any,
    ipAddress?: string,
    userAgent?: string,
    assignedBankId?: string,
  ): Promise<AuthResultDto> {
    const sessionId = `sess_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const payload: AuthSessionPayload & { jti: string } = {
      sub: userRecord.id,
      govId: govRecord.govIdNumber,
      email: govRecord.email,
      role: userRecord.role,
      bankId: assignedBankId,
      jti: sessionId,
    };

    const token = await this.jwtService.signAsync(payload);

    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId: userRecord.id,
        tokenHash: await argon2.hash(token.slice(-32)),
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt,
        revoked: false,
      },
    });

    const user: UserDto = {
      id: userRecord.id,
      govId: govRecord.id,
      govIdNumber: govRecord.govIdNumber,
      email: govRecord.email,
      displayName: userRecord.displayName,
      role: userRecord.role,
      status: userRecord.status,
      createdAt: userRecord.createdAt?.toISOString ? userRecord.createdAt.toISOString() : new Date().toISOString(),
    };

    return {
      token,
      user,
      sessionExpiresAt: expiresAt.toISOString(),
    };
  }
}
