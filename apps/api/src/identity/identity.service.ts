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
  LoginWithOtpInput,
  StepUpAuthInput,
} from '@arthax/validation';
import { PrismaService } from '../database/prisma.service';
import { SessionStoreService } from '../common/services/session-store.service';
import { AuditService } from '../audit/audit.service';
import { EmailService } from '../common/services/email.service';
import { SupabaseAuthService } from '../common/services/supabase-auth.service';

@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);
  private emailService: EmailService;
  private supabaseAuthService: SupabaseAuthService;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sessionStore: SessionStoreService,
    private auditService: AuditService,
    emailService?: EmailService,
    supabaseAuthService?: SupabaseAuthService,
  ) {
    this.emailService = emailService || new EmailService();
    this.supabaseAuthService = supabaseAuthService || new SupabaseAuthService();
  }

  /**
   * Dispatches a 6-digit verification code to the given email address.
   * Rate-limited in Redis to prevent flooding attacks.
   */
  async sendEmailOtp(
    input: RegisterEmailInput,
    ipAddress?: string,
  ): Promise<{ message: string; expirySeconds: number; code?: string }> {
    // 1. One email = exactly one GOV ID check
    const existingGov = await this.prisma.govId.findUnique({
      where: { email: input.email },
    });
    if (existingGov) {
      throw new BadRequestException('A sovereign GOV ID is already registered to this email address.');
    }

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

    // Dispatch verification code via EmailService (Resend API or console fallback)
    const emailResult = await this.emailService.sendOtpEmail(input.email, rawCode, 300);

    return {
      message: emailResult.delivered
        ? `Sovereign identity verification code dispatched to ${input.email}`
        : `Verification code generated (${emailResult.error || 'Please check terminal console'})`,
      expirySeconds: 300,
      code: process.env.NODE_ENV === 'production' ? undefined : rawCode,
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

    // Issue short-lived, purpose-bound registration ticket (15 minutes)
    const registrationTicket = await this.jwtService.signAsync(
      { email: input.email, purpose: 'REGISTRATION', stage: 'GOV_ID_CREATION' },
      { expiresIn: '15m' },
    );

    return {
      verified: true,
      registrationTicket,
    };
  }

  /**
   * Creates a new GOV ID in PostgreSQL with an independently hashed GOV Password.
   * Concurrency-safe atomic sequence generation ensures zero collisions.
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

    // 2. Validate that email has completed verification (anti-replay & unverified block)
    let isVerified = false;
    if (input.registrationTicket) {
      try {
        const decoded: any = await this.jwtService.verifyAsync(input.registrationTicket);
        if (decoded?.email === input.email && decoded?.stage === 'GOV_ID_CREATION') {
          isVerified = true;
        }
      } catch {
        // Invalid ticket signature or expired
      }
    }

    if (!isVerified) {
      // Check for recently consumed mfaToken for this email within 15 minutes
      const verifiedToken = await this.prisma.mfaToken.findFirst({
        where: {
          email: input.email,
          purpose: 'EMAIL_VERIFY',
          consumed: true,
          createdAt: { gt: new Date(Date.now() - 15 * 60 * 1000) },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (verifiedToken) {
        isVerified = true;
      }
    }

    if (!isVerified) {
      throw new BadRequestException('Email has not completed verification or verification has expired.');
    }

    // 3. Concurrency-safe atomic sequence generation in PostgreSQL
    await this.prisma.$executeRawUnsafe(`
      CREATE SEQUENCE IF NOT EXISTS gov_id_seq START 20000001 MAXVALUE 99999999 CYCLE;
    `);

    let govIdNumber = '';
    while (!govIdNumber) {
      const seqResult: any[] = await this.prisma.$queryRawUnsafe(`SELECT nextval('gov_id_seq') as seq;`);
      const seqNum = Number(seqResult[0].seq);
      const part1 = Math.floor(seqNum / 10000);
      const part2 = String(seqNum % 10000).padStart(4, '0');
      const candidate = `GOV-${part1}-${part2}`;
      const exists = await this.prisma.govId.findUnique({ where: { govIdNumber: candidate } });
      if (!exists) {
        govIdNumber = candidate;
      }
    }

    // 4. Hash GOV Password with Argon2id (independent parameters)
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

    // Invalidate/consume verification record to prevent any replay
    await this.prisma.mfaToken.deleteMany({
      where: { email: input.email, purpose: 'EMAIL_VERIFY' },
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

    // If financialPassword was provided in the unified details step, provision immediately!
    let authResult: AuthResultDto | undefined;
    if (input.financialPassword) {
      authResult = await this.provisionUserWithBankAndBonus(
        govRecord,
        {
          financialPassword: input.financialPassword,
          displayName: input.displayName,
          profession: input.profession,
          primaryPurpose: input.primaryPurpose,
          preferredBankId: input.preferredBankId,
        },
        ipAddress,
      );
    }

    // Sync to Supabase Auth (auth.users)
    try {
      await this.supabaseAuthService.syncCitizenToSupabaseAuth({
        email: govRecord.email,
        govIdNumber: govRecord.govIdNumber,
        displayName: input.displayName || 'Sovereign Citizen',
        profession: input.profession,
        password: input.govPassword,
        role: 'USER',
      });
    } catch (syncErr: any) {
      this.logger.warn(`Supabase Auth sync non-blocking notice: ${syncErr.message}`);
    }

    return {
      id: govRecord.id,
      govIdNumber: govRecord.govIdNumber,
      email: govRecord.email,
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: govRecord.createdAt.toISOString(),
      setupToken,
      ...(authResult ? { token: authResult.token, user: authResult.user } : {}),
    };
  }

  /**
   * Helper that provisions User, Default Loadout, Chosen Bank Account based on Purpose,
   * and credits the 5,000.00 ARTH (500,000 minor units) Creation Bonus via double-entry ledger.
   */
  private async provisionUserWithBankAndBonus(
    govRecord: any,
    input: {
      financialPassword?: string;
      displayName?: string;
      profession?: string;
      primaryPurpose?: string;
      preferredBankId?: string;
    },
    ipAddress?: string,
  ): Promise<AuthResultDto> {
    const existingUser = await this.prisma.user.findUnique({ where: { govId: govRecord.id } });
    if (existingUser) {
      throw new BadRequestException('User profile already initialized for this sovereign identity');
    }

    // Hash Financial Password with Argon2id (independent salt & derivation)
    const finPassword = input.financialPassword || 'FinSecret#2026';
    const financialPasswordHash = await argon2.hash(finPassword, {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    const preferredBankId = (input.preferredBankId || 'nava').toLowerCase();
    const bankId = ['nava', 'samaya', 'setu', 'sthira', 'vayu'].includes(preferredBankId)
      ? preferredBankId
      : 'nava';

    const defaultPurposes: Record<string, string> = {
      nava: 'Salary & Master Operating Rail',
      samaya: 'Wealth Growth & High-Yield Term Vault',
      setu: 'Business & Cross-Border DvP Clearing',
      sthira: 'Sovereign Custody & Escrow Vault',
      vayu: 'Instant Daily Liquidity & Micro-Payments',
    };

    const purpose = input.primaryPurpose || defaultPurposes[bankId] || 'Primary Sovereign Treasury Account';
    const bonusMinor = 500000n; // 5,000.00 ARTH

    // Atomic transaction for complete onboarding and double-entry treasury bonus grant
    const { userRecord, bankAcct } = await this.prisma.$transaction(async (tx) => {
      const userRecord = await tx.user.create({
        data: {
          govId: govRecord.id,
          displayName: input.displayName || govRecord.email.split('@')[0],
          financialPasswordHash,
          role: 'USER',
          status: 'ACTIVE',
        },
      });

      // Default sovereign loadout
      await tx.userLoadout.create({
        data: {
          userId: userRecord.id,
          frameId: 'frm-gold',
          avatarId: 'avt-f-business',
          bannerId: 'bnr-gold-1',
          petId: 'pet-vidya',
        },
      });

      // Initial customer relation with selected purpose-driven bank
      const bankCust = await tx.bankCustomer.create({
        data: {
          userId: userRecord.id,
          bankId,
          customerNumber: `CUST-${bankId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'ACTIVE',
          tier: 'Tier-1 Sovereign Citizen',
        },
      });

      // Primary Purpose-Driven Bank Account
      const acctNum = `ARTH-${bankId.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const bankAcct = await tx.bankAccount.create({
        data: {
          accountNumber: acctNum,
          customerId: bankCust.id,
          bankId,
          userId: userRecord.id,
          type: 'SAVINGS',
          purpose,
          status: 'ACTIVE',
          dailyLimitMinor: 5000000n, // 50,000.00 ARTH
          monthlyLimitMinor: 50000000n, // 500,000.00 ARTH
        },
      });

      // Ledger Account with 5,000.00 ARTH starting balance snapshot
      const userLedgerAccount = await tx.ledgerAccount.create({
        data: {
          accountType: 'BANK_ACCOUNT',
          ownerEntityId: bankAcct.id,
          ownerEntityType: 'BANK_ACCOUNT',
          balanceSnapshot: bonusMinor,
          bankAccountId: bankAcct.id,
        },
      });

      // Ensure Central Treasury system ledger account exists
      let treasury = await tx.ledgerAccount.findFirst({
        where: { ownerEntityId: 'sys_central_treasury' },
      });
      if (!treasury) {
        treasury = await tx.ledgerAccount.create({
          data: {
            accountType: 'CENTRAL_TREASURY',
            ownerEntityId: 'sys_central_treasury',
            ownerEntityType: 'SYSTEM',
            balanceSnapshot: 5000000000000n,
          },
        });
      }

      await tx.ledgerAccount.update({
        where: { id: treasury.id },
        data: { balanceSnapshot: treasury.balanceSnapshot - bonusMinor },
      });

      // Post balanced double-entry Creation Bonus transaction
      const bonusTx = await tx.transaction.create({
        data: {
          referenceNumber: `BONUS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          type: 'REWARD',
          status: 'COMPLETED',
          scope: 'INTERNAL',
          amountMinor: bonusMinor,
          feesMinor: 0n,
          taxMinor: 0n,
          initiatedBy: userRecord.id,
          destinationAccountId: bankAcct.id,
          metadata: {
            grantType: 'CITIZEN_CREATION_BONUS',
            grantor: 'ARTHAX Central Monetary Authority',
            beneficiary: userRecord.displayName,
            profession: input.profession || 'Sovereign Citizen',
            purpose,
            bankId,
          },
        },
      });

      // Debit Central Treasury
      await tx.transactionEntry.create({
        data: {
          transactionId: bonusTx.id,
          ledgerAccountId: treasury.id,
          entryType: 'DEBIT',
          amountMinor: bonusMinor,
        },
      });

      // Credit Citizen Bank Account
      await tx.transactionEntry.create({
        data: {
          transactionId: bonusTx.id,
          ledgerAccountId: userLedgerAccount.id,
          entryType: 'CREDIT',
          amountMinor: bonusMinor,
        },
      });

      // Welcome Notification
      await tx.notification.create({
        data: {
          userId: userRecord.id,
          category: 'REWARD',
          priority: 'HIGH',
          title: 'Sovereign Creation Bonus Credited (+5,000.00 ARTH)',
          summary: 'Your 5,000.00 ARTH creation grant has cleared into your primary bank account.',
          content: `Welcome to the ARTHAX sovereign ecosystem. By decree of the Central Monetary Authority, an initial creation grant of 5,000.00 ARTH has been deposited to your ${bankId.toUpperCase()} account (${bankAcct.accountNumber}).`,
          templateCode: 'CITIZEN_ONBOARDING_BONUS',
          templateVersion: 1,
          sourceDomain: 'TREASURY',
          sourceType: 'GRANT',
          sourceId: bonusTx.id,
          eventId: `onboarding_${userRecord.id}`,
        },
      });

      return { userRecord, bankAcct };
    });

    await this.auditService.logEvent({
      eventType: 'SECURITY_EVENT',
      actorId: userRecord.id,
      actorRole: 'USER',
      targetEntity: 'USER',
      action: `Established financial credential & opened initial ${bankId.toUpperCase()} account with 5,000 ARTH creation bonus`,
      severity: 'INFO',
      ipAddress,
    });

    return this.generateAuthResult(userRecord, govRecord, ipAddress);
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

    return this.provisionUserWithBankAndBonus(govRecord, input, ipAddress);
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

    // 0. Supabase Auth Gate: only consider Supabase Auth users
    if (this.supabaseAuthService.isConfigured()) {
      const isEmail = input.govIdOrEmail.includes('@');
      let supabaseUser: any = null;
      if (isEmail) {
        supabaseUser = await this.supabaseAuthService.findUserByEmail(input.govIdOrEmail);
      } else {
        const users = await this.supabaseAuthService.listUsers(1, 100);
        supabaseUser = users.find(
          (u) => u.user_metadata?.govIdNumber?.toLowerCase() === input.govIdOrEmail.toLowerCase(),
        );
      }

      const isSystemAdmin =
        input.govIdOrEmail.toLowerCase().includes('governor.vance') ||
        input.govIdOrEmail.toLowerCase().includes('auditor.kaur') ||
        input.govIdOrEmail.toLowerCase().includes('admin.');

      if (!supabaseUser && !isSystemAdmin) {
        throw new UnauthorizedException(
          'Citizen account not recognized in Supabase Auth. Only registered Supabase citizens are permitted.',
        );
      }

      if (supabaseUser) {
        const existingGov = await this.prisma.govId.findFirst({
          where: { email: { equals: supabaseUser.email, mode: 'insensitive' } },
          include: { user: true },
        });

        if (!existingGov || !existingGov.user) {
          await this.autoProvisionSupabaseCitizen(supabaseUser, input.govPassword);
        }
      }
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
   * Dispatches a 6-digit login OTP code to a registered email address.
   */
  async sendLoginOtp(
    email: string,
    ipAddress?: string,
  ): Promise<{ message: string; expirySeconds: number; code?: string }> {
    // Check Supabase Auth
    if (this.supabaseAuthService.isConfigured()) {
      const isSystemAdmin =
        email.toLowerCase().includes('governor.vance') ||
        email.toLowerCase().includes('auditor.kaur') ||
        email.toLowerCase().includes('admin.');

      const supabaseUser = await this.supabaseAuthService.findUserByEmail(email);
      if (!supabaseUser && !isSystemAdmin) {
        throw new BadRequestException(
          'No citizen account registered with this email in Supabase Auth.',
        );
      }

      if (supabaseUser) {
        const existingGov = await this.prisma.govId.findFirst({
          where: { email: { equals: email.trim(), mode: 'insensitive' } },
          include: { user: true },
        });
        if (!existingGov || !existingGov.user) {
          await this.autoProvisionSupabaseCitizen(supabaseUser);
        }
      }
    }

    const govRecord = await this.prisma.govId.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
      include: { user: true },
    });

    if (!govRecord || !govRecord.user) {
      throw new BadRequestException('No registered sovereign identity found with this email address.');
    }

    const rateLimit = await this.sessionStore.checkRateLimit(`login_otp_req:${email.toLowerCase()}`, 5, 600);
    if (!rateLimit.allowed) {
      throw new BadRequestException(`Too many login requests. Please wait ${rateLimit.resetSeconds} seconds.`);
    }

    const rawCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await argon2.hash(rawCode);
    const expiresAt = new Date(Date.now() + 300 * 1000);

    await this.prisma.mfaToken.updateMany({
      where: { email: email.toLowerCase(), purpose: 'STEP_UP', consumed: false },
      data: { consumed: true },
    });

    await this.prisma.mfaToken.create({
      data: {
        email: email.toLowerCase(),
        codeHash,
        purpose: 'STEP_UP',
        expiresAt,
        consumed: false,
      },
    });

    const emailResult = await this.emailService.sendOtpEmail(email, rawCode, 300);

    return {
      message: emailResult.delivered
        ? `Sovereign login passcode dispatched to ${email}`
        : `Login passcode generated (${emailResult.error || 'Please check terminal console'})`,
      expirySeconds: 300,
      code: process.env.NODE_ENV === 'production' ? undefined : rawCode,
    };
  }

  /**
   * Authenticates user directly using Email + OTP code.
   */
  async loginWithOtp(
    input: LoginWithOtpInput,
    ipAddress: string = '127.0.0.1',
    userAgent: string = 'ARTHAX-Console',
  ): Promise<AuthResultDto> {
    const emailNorm = input.email.trim().toLowerCase();
    const tokenRecord = await this.prisma.mfaToken.findFirst({
      where: {
        email: emailNorm,
        purpose: 'STEP_UP',
        consumed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired login verification code');
    }

    const isValid = await argon2.verify(tokenRecord.codeHash, input.code);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired login verification code');
    }

    await this.prisma.mfaToken.update({
      where: { id: tokenRecord.id },
      data: { consumed: true },
    });

    // Supabase Auth Gate: only consider Supabase Auth users
    if (this.supabaseAuthService.isConfigured()) {
      const isSystemAdmin =
        emailNorm.includes('governor.vance') ||
        emailNorm.includes('auditor.kaur') ||
        emailNorm.includes('admin.');

      const supabaseUser = await this.supabaseAuthService.findUserByEmail(emailNorm);
      if (!supabaseUser && !isSystemAdmin) {
        throw new UnauthorizedException(
          'Citizen account not recognized in Supabase Auth. Only registered Supabase citizens are permitted.',
        );
      }

      if (supabaseUser) {
        const existingGov = await this.prisma.govId.findFirst({
          where: { email: { equals: emailNorm, mode: 'insensitive' } },
          include: { user: true },
        });

        if (!existingGov || !existingGov.user) {
          await this.autoProvisionSupabaseCitizen(supabaseUser);
        }
      }
    }

    const govRecord = await this.prisma.govId.findFirst({
      where: { email: { equals: emailNorm, mode: 'insensitive' } },
      include: { user: true },
    });

    if (!govRecord || !govRecord.user) {
      throw new BadRequestException('Sovereign identity profile not found for this email address');
    }

    let assignedBankId: string | undefined;
    if (govRecord.user.role === 'BANK_ADMIN') {
      assignedBankId = this.resolveAssignedBank(govRecord.email);
    }

    await this.auditService.logEvent({
      eventType: 'SECURITY_EVENT',
      actorId: govRecord.user.id,
      actorRole: govRecord.user.role,
      targetEntity: 'AUTH_GATEWAY',
      action: `Successful sovereign OTP login from ${ipAddress}`,
      severity: 'INFO',
      ipAddress,
    });

    return this.generateAuthResult(govRecord.user, govRecord, ipAddress, userAgent, assignedBankId);
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

    // Mirror active session in Redis cache for high-performance session validation
    await this.sessionStore.storeSession(
      sessionId,
      {
        userId: userRecord.id,
        govId: govRecord.govIdNumber,
        email: govRecord.email,
        role: userRecord.role,
        bankId: assignedBankId,
        expiresAt: expiresAt.toISOString(),
      },
      24 * 60 * 60,
    );

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

  /**
   * Returns Supabase Auth configuration status.
   */
  getSupabaseAuthStatus(): { configured: boolean; supabaseUrl: string } {
    return {
      configured: this.supabaseAuthService.isConfigured(),
      supabaseUrl: process.env.SUPABASE_URL || 'https://qbhwplseiiqprbvcdgkr.supabase.co',
    };
  }

  /**
   * Auto-provisions a citizen confirmed in Supabase Auth into ARTHAX with double-entry 5,000 ARTH grant.
   */
  async autoProvisionSupabaseCitizen(supabaseUser: any, password?: string): Promise<any> {
    const email = supabaseUser.email;
    const meta = supabaseUser.user_metadata || {};
    const displayName = meta.displayName || email.split('@')[0];
    const profession = meta.profession || 'Sovereign Citizen';
    const govIdNumber =
      meta.govIdNumber ||
      `GOV-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const defaultGovPasswordHash = await argon2.hash(password || 'GovSovereign@2026!', {
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // 1. Create or retrieve GovId
    let govRecord = await this.prisma.govId.findUnique({ where: { email } });
    if (!govRecord) {
      govRecord = await this.prisma.govId.create({
        data: {
          govIdNumber,
          email,
          passwordHash: defaultGovPasswordHash,
          emailVerified: true,
          status: 'ACTIVE',
        },
      });
    }

    // 2. Provision User + Founding Bank Account + 5,000 ARTH Creation Bonus
    const existingUser = await this.prisma.user.findUnique({ where: { govId: govRecord.id } });
    if (!existingUser) {
      await this.provisionUserWithBankAndBonus(
        govRecord,
        {
          financialPassword: 'FinSecret#2026',
          displayName,
          profession,
          preferredBankId: meta.preferredBankId || 'nava',
          primaryPurpose: meta.primaryPurpose || 'Sovereign Master Rail',
        },
      );
    }

    return await this.prisma.govId.findUnique({
      where: { id: govRecord.id },
      include: { user: true },
    });
  }

  /**
   * Purges all non-Supabase users from the database and only retains/provisions
   * real citizens registered in Supabase Auth.
   */
  async purgeLocalUsersAndSyncWithSupabase(): Promise<{
    purgedUsersCount: number;
    activeSupabaseUsersCount: number;
    activeCitizens: string[];
  }> {
    this.logger.log('[PURGE & SYNC] Purging local users not present in Supabase Auth...');

    // 1. Fetch real users from Supabase Auth
    const supabaseUsers = await this.supabaseAuthService.listUsers(1, 100);
    const supabaseEmails = new Set(
      supabaseUsers.map((u) => u.email?.toLowerCase()).filter(Boolean),
    );

    this.logger.log(
      `[PURGE & SYNC] Found ${supabaseUsers.length} verified citizen(s) in Supabase Auth: [${Array.from(supabaseEmails).join(', ')}]`,
    );

    // 2. Identify local users to purge (any citizen@arthax.gov mock user, plus any USER not in Supabase)
    const usersToDelete = await this.prisma.user.findMany({
      where: {
        OR: [
          { govIdRel: { email: 'citizen@arthax.gov' } },
          { role: 'USER', govIdRel: { email: { notIn: Array.from(supabaseEmails) } } },
        ],
      },
      include: {
        govIdRel: true,
        bankAccounts: true,
      },
    });

    const userIds = usersToDelete.map((u) => u.id);
    const govIds = usersToDelete.map((u) => u.govId);
    const emails = usersToDelete.map((u) => u.govIdRel.email);
    const accountIds = usersToDelete.flatMap((u) => u.bankAccounts.map((a) => a.id));

    if (userIds.length > 0) {
      this.logger.log(
        `[PURGE & SYNC] Deleting ${userIds.length} local user(s) and their associated ledgers...`,
      );

      // 1. Identify all transactions involving these users or accounts
      const userTxs = await this.prisma.transaction.findMany({
        where: {
          OR: [
            { initiatedBy: { in: userIds } },
            { sourceAccountId: { in: accountIds } },
            { destinationAccountId: { in: accountIds } },
          ],
        },
        select: { id: true },
      });
      const txIds = userTxs.map((t) => t.id);

      // 2. Identify all stock orders involving these users or accounts
      const userOrders = await this.prisma.order.findMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { sourceAccountId: { in: accountIds } },
          ],
        },
        select: { id: true },
      });
      const orderIds = userOrders.map((o) => o.id);

      // 3. Delete transaction dependent child records
      await this.prisma.interestPayoutLog.deleteMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { transactionId: { in: txIds } },
          ],
        },
      });

      await this.prisma.rewardTransaction.deleteMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { transactionId: { in: txIds } },
          ],
        },
      });

      if (txIds.length > 0) {
        await this.prisma.monetaryEvent.deleteMany({
          where: { transactionId: { in: txIds } },
        });
      }

      await this.prisma.transactionEntry.deleteMany({
        where: {
          OR: [
            { transactionId: { in: txIds } },
            { ledgerAccount: { bankAccountId: { in: accountIds } } },
          ],
        },
      });

      if (txIds.length > 0) {
        await this.prisma.transaction.deleteMany({
          where: { id: { in: txIds } },
        });
      }

      // 4. Delete trades & orders
      await this.prisma.trade.deleteMany({
        where: {
          OR: [
            { buyerUserId: { in: userIds } },
            { sellerUserId: { in: userIds } },
            { buyOrderId: { in: orderIds } },
            { sellOrderId: { in: orderIds } },
          ],
        },
      });

      await this.prisma.order.deleteMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { sourceAccountId: { in: accountIds } },
          ],
        },
      });

      // 5. Delete banking products & records
      await this.prisma.beneficiary.deleteMany({
        where: { accountId: { in: accountIds } },
      });

      await this.prisma.userFd.deleteMany({
        where: {
          OR: [
            { userId: { in: userIds } },
            { accountId: { in: accountIds } },
          ],
        },
      });

      await this.prisma.loan.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.portfolioHolding.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.taxEvent.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.mailboxMessage.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.userInventory.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.userLoadout.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.session.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.mfaToken.deleteMany({ where: { email: { in: emails } } });

      // 6. Delete Ledger & Bank Accounts
      await this.prisma.ledgerAccount.deleteMany({ where: { bankAccountId: { in: accountIds } } });
      await this.prisma.bankAccount.deleteMany({ where: { id: { in: accountIds } } });
      await this.prisma.bankCustomer.deleteMany({ where: { userId: { in: userIds } } });
      await this.prisma.user.deleteMany({ where: { id: { in: userIds } } });
      await this.prisma.govId.deleteMany({ where: { id: { in: govIds } } });
    }

    // Also purge orphaned GovIds not in Supabase Auth (except admins)
    const orphanedGovIds = await this.prisma.govId.findMany({
      where: {
        email: { notIn: Array.from(supabaseEmails) },
        user: null,
      },
    });
    if (orphanedGovIds.length > 0) {
      await this.prisma.govId.deleteMany({
        where: { id: { in: orphanedGovIds.map((g) => g.id) } },
      });
    }

    // 3. For every user that exists in Supabase Auth, ensure they are provisioned with 5,000 ARTH
    const activeCitizens: string[] = [];
    for (const sUser of supabaseUsers) {
      if (sUser.email) {
        await this.autoProvisionSupabaseCitizen(sUser);
        activeCitizens.push(sUser.email);
      }
    }

    this.logger.log(
      `[PURGE & SYNC] Completed. Purged ${userIds.length} legacy users. Active Supabase citizens: ${activeCitizens.length}`,
    );

    return {
      purgedUsersCount: userIds.length,
      activeSupabaseUsersCount: activeCitizens.length,
      activeCitizens,
    };
  }

  /**
   * Synchronizes all active citizens in PostgreSQL to Supabase Auth.
   */
  async syncAllExistingUsersToSupabase(): Promise<{
    syncedCount: number;
    errorsCount: number;
    results: any[];
  }> {
    const users = await this.prisma.user.findMany({
      where: { role: 'USER' },
      include: { govIdRel: true },
    });

    const results: any[] = [];
    let syncedCount = 0;
    let errorsCount = 0;

    for (const u of users) {
      try {
        const syncResult = await this.supabaseAuthService.syncCitizenToSupabaseAuth({
          email: u.govIdRel.email,
          govIdNumber: u.govIdRel.govIdNumber,
          displayName: u.displayName,
          role: u.role,
        });
        if (syncResult.synced) {
          syncedCount++;
        } else {
          errorsCount++;
        }
        results.push({ email: u.govIdRel.email, ...syncResult });
      } catch (err: any) {
        errorsCount++;
        results.push({ email: u.govIdRel.email, synced: false, error: err.message });
      }
    }

    return { syncedCount, errorsCount, results };
  }
}
