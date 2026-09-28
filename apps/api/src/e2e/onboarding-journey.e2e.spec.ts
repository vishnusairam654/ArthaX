import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service';
import { SessionStoreService } from '../common/services/session-store.service';
import { AuditService } from '../audit/audit.service';
import { IdentityService } from '../identity/identity.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

/**
 * ARTHAX AUTHENTICATION & IDENTITY ONBOARDING E2E ACCEPTANCE SUITE
 *
 * Validates the sovereign citizen onboarding journey from initial GOV Portal contact
 * through dual-credential generation, atomic banking provisioning, Redis session lifecycle,
 * step-up financial authorization, session revocation on logout, and fail-closed security invariants.
 *
 * PRIMARY ACCEPTANCE JOURNEY:
 * GOV Portal
 * → Email
 * → OTP
 * → GOV Password
 * → atomic GOV ID generation
 * → ARTHAX User
 * → Financial Password
 * → NAVA customer/account/ledger provisioning
 * → ARTHAX login using GOV ID + GOV password
 * → Redis-backed session
 * → User Portal
 * → Financial step-up
 * → Logout
 * → revoked session rejected
 * → re-login succeeds
 */

async function runOnboardingJourneyE2E() {
  console.log('=================================================================');
  console.log('  ARTHAX IDENTITY ONBOARDING & AUTHENTICATION E2E JOURNEY');
  console.log('=================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details ? '- ' + details : ''}`);
      failed++;
    }
  }

  function createMockExecutionContext(authHeader?: string): any {
    const req: any = {
      headers: {
        authorization: authHeader,
      },
    };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    };
  }

  // ---------------------------------------------------------------------------
  // INFRASTRUCTURE INITIALIZATION
  // ---------------------------------------------------------------------------
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  const sessionStore = new SessionStoreService(prisma);
  await sessionStore.onModuleInit();

  const auditService = new AuditService();
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'arthax_dev_jwt_secret_change_in_production_sovereign_key_9841',
  });

  const identityService = new IdentityService(
    prisma,
    jwtService,
    sessionStore,
    auditService,
  );

  const jwtAuthGuard = new JwtAuthGuard(jwtService, sessionStore);

  // Track created entities for deterministic cleanup
  const createdUserIds: string[] = [];
  const createdGovIds: string[] = [];
  const registeredEmails: string[] = [];

  const timestamp = Date.now();
  const citizenEmail = `unseeded.citizen.${timestamp}@arthax.gov`;
  const citizenGovPassword = `GovSovereign#Pass${timestamp}!`;
  const citizenFinancialPassword = `FinSec#Pin${timestamp}!`;

  try {
    // -------------------------------------------------------------------------
    // STAGE 1: GOV PORTAL EMAIL INITIATION & OTP DISPATCH
    // -------------------------------------------------------------------------
    console.log('--- STAGE 1: GOV Portal Email Initiation & OTP Invariants ---');

    // Invariant 12: Production OTP exposure check
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const prodOtpResult = await identityService.sendEmailOtp({ email: `prod.test.${timestamp}@arthax.gov` });
    assert(
      'Development OTP exposure is disabled when NODE_ENV=production (code is undefined)',
      prodOtpResult.code === undefined,
    );
    process.env.NODE_ENV = originalEnv;

    // Send OTP for unseeded citizen in test environment
    const otpResult = await identityService.sendEmailOtp({ email: citizenEmail });
    assert('OTP dispatch succeeds for valid sovereign email', !!otpResult.message);
    assert('OTP has strict 300s (5-minute) statutory expiry', otpResult.expirySeconds === 300);
    assert('OTP code is issued in non-production environment', typeof otpResult.code === 'string' && otpResult.code.length === 6);
    registeredEmails.push(citizenEmail);

    const citizenOtpCode = otpResult.code!;

    // -------------------------------------------------------------------------
    // STAGE 2: OTP VERIFICATION & REPLAY GUARDS
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 2: OTP Verification & Single-Use Guards ---');

    // Wrong OTP verification rejected
    let wrongOtpRejected = false;
    try {
      await identityService.verifyEmailOtp({ email: citizenEmail, code: '000000' });
    } catch (err: any) {
      wrongOtpRejected = err instanceof BadRequestException;
    }
    assert('Incorrect OTP code is rejected with BadRequestException', wrongOtpRejected);

    // Expired OTP simulation
    const expiredEmail = `expired.otp.${timestamp}@arthax.gov`;
    registeredEmails.push(expiredEmail);
    const expResult = await identityService.sendEmailOtp({ email: expiredEmail });
    // Force token expiration in database
    await prisma.mfaToken.updateMany({
      where: { email: expiredEmail, consumed: false },
      data: { expiresAt: new Date(Date.now() - 10000) },
    });
    let expiredOtpRejected = false;
    try {
      await identityService.verifyEmailOtp({ email: expiredEmail, code: expResult.code! });
    } catch (err: any) {
      expiredOtpRejected = err instanceof BadRequestException;
    }
    assert('Expired OTP token is strictly rejected by verification engine', expiredOtpRejected);

    // Legitimate OTP verification produces signed registration ticket
    const verifyResult = await identityService.verifyEmailOtp({ email: citizenEmail, code: citizenOtpCode });
    assert('OTP verification succeeds for valid citizen code', verifyResult.verified === true);
    assert('Single-use registration ticket issued upon OTP verification', !!verifyResult.registrationTicket);

    const decodedTicket: any = jwtService.decode(verifyResult.registrationTicket!);
    assert('Registration ticket is purpose-bound to REGISTRATION stage GOV_ID_CREATION', decodedTicket.purpose === 'REGISTRATION' && decodedTicket.stage === 'GOV_ID_CREATION');
    assert('Registration ticket is bound to citizen email', decodedTicket.email === citizenEmail);

    // Replay guard: Same OTP cannot be verified twice
    let otpReplayRejected = false;
    try {
      await identityService.verifyEmailOtp({ email: citizenEmail, code: citizenOtpCode });
    } catch (err: any) {
      otpReplayRejected = err instanceof BadRequestException;
    }
    assert('Consumed OTP code cannot be replayed (single-use invariant)', otpReplayRejected);

    // -------------------------------------------------------------------------
    // STAGE 3: GOV PASSWORD & CONCURRENCY-SAFE ATOMIC GOV ID GENERATION
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 3: Atomic GOV ID Sequence & Concurrency Safety ---');

    // Unverified registration rejected without verified ticket/OTP
    let unverifiedRegRejected = false;
    try {
      await identityService.createGovId({
        email: `unverified.${timestamp}@arthax.gov`,
        govPassword: citizenGovPassword,
      });
    } catch (err: any) {
      unverifiedRegRejected = err instanceof BadRequestException;
    }
    assert('Unverified email cannot create sovereign GOV ID', unverifiedRegRejected);

    // Concurrency-safe atomic GOV ID generation (Invariant 2)
    const concurrentEmails = [
      `conc.seq.1.${timestamp}@arthax.gov`,
      `conc.seq.2.${timestamp}@arthax.gov`,
      `conc.seq.3.${timestamp}@arthax.gov`,
    ];
    for (const em of concurrentEmails) {
      registeredEmails.push(em);
      const s = await identityService.sendEmailOtp({ email: em });
      await identityService.verifyEmailOtp({ email: em, code: s.code! });
    }

    const concurrentResults = await Promise.all(
      concurrentEmails.map((em) =>
        identityService.createGovId({
          email: em,
          govPassword: citizenGovPassword,
        }),
      ),
    );

    for (const cr of concurrentResults) {
      createdGovIds.push(cr.id);
    }

    const govIdNumbers = concurrentResults.map((r) => r.govIdNumber);
    const uniqueGovIdNumbers = new Set(govIdNumbers);
    assert(
      'Concurrent GOV ID sequence generation produces zero collisions (3/3 distinct)',
      uniqueGovIdNumbers.size === 3,
    );
    assert(
      'All concurrent IDs match sovereign sequential GOV-XXXX-XXXX format',
      govIdNumbers.every((id) => /^GOV-\d{4}-\d{4}$/.test(id)),
    );

    // Register our primary citizen GOV ID
    const govRecord = await identityService.createGovId({
      email: citizenEmail,
      govPassword: citizenGovPassword,
      registrationTicket: verifyResult.registrationTicket,
    });
    createdGovIds.push(govRecord.id);

    assert('Citizen GOV ID record generated successfully', !!govRecord.id);
    assert('Citizen GOV ID matches sequential GOV-XXXX-XXXX format', /^GOV-\d{4}-\d{4}$/.test(govRecord.govIdNumber));
    assert('Setup token issued for financial onboarding stage', !!govRecord.setupToken);

    // Duplicate email registration rejected (Invariant 1)
    let duplicateEmailRejected = false;
    try {
      await identityService.sendEmailOtp({ email: citizenEmail });
    } catch (err: any) {
      duplicateEmailRejected = err instanceof BadRequestException;
    }
    assert('Duplicate email registration is strictly rejected (One Email = One GOV ID)', duplicateEmailRejected);

    // -------------------------------------------------------------------------
    // STAGE 4: FINANCIAL PASSWORD & ATOMIC BANKING PROVISIONING
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 4: Financial Password & Atomic Banking Provisioning ---');

    // Invariant 3: User + NAVA customer + NAVA account + LedgerAccount provisioning occurs atomically
    const onboardingAuth = await identityService.setFinancialPassword(govRecord.id, {
      financialPassword: citizenFinancialPassword,
      displayName: 'Sovereign Citizen Alpha',
    });

    createdUserIds.push(onboardingAuth.user.id);

    assert('setFinancialPassword creates ARTHAX User profile', !!onboardingAuth.user.id);
    assert('User profile links 1:1 to sovereign GOV ID record', onboardingAuth.user.govId === govRecord.id);
    assert('Initial session token returned for seamless transition', !!onboardingAuth.token);

    // Verify atomic database provisioning across all 4 tables in PostgreSQL
    const dbUser = await prisma.user.findUnique({ where: { id: onboardingAuth.user.id } });
    assert('User row persisted in PostgreSQL with ACTIVE status', dbUser?.status === 'ACTIVE');

    const dbCustomer = await prisma.bankCustomer.findFirst({
      where: { userId: onboardingAuth.user.id, bankId: 'nava' },
    });
    assert('NAVA Bank customer relationship provisioned in PostgreSQL', !!dbCustomer);

    const dbAccount = await prisma.bankAccount.findFirst({
      where: { userId: onboardingAuth.user.id, bankId: 'nava', type: 'SAVINGS' },
    });
    assert('NAVA primary savings account provisioned with ACTIVE status', dbAccount?.status === 'ACTIVE');

    const dbLedgerAccount = await prisma.ledgerAccount.findFirst({
      where: { bankAccountId: dbAccount?.id },
    });
    assert('Double-entry LedgerAccount linked to bank account provisioned atomically', !!dbLedgerAccount);
    assert('LedgerAccount initial balance is strictly 0n minor units', dbLedgerAccount?.balanceSnapshot === 0n);

    // Duplicate user initialization rejected
    let duplicateUserRejected = false;
    try {
      await identityService.setFinancialPassword(govRecord.id, {
        financialPassword: citizenFinancialPassword,
      });
    } catch (err: any) {
      duplicateUserRejected = err instanceof BadRequestException;
    }
    assert('Duplicate user creation for same GOV ID rejected (One GOV ID = One User)', duplicateUserRejected);

    // -------------------------------------------------------------------------
    // STAGE 5: ARGON2ID DUAL-PASSWORD SEPARATION
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 5: Strict Argon2id Password Separation ---');

    const govIdInDb = await prisma.govId.findUnique({ where: { id: govRecord.id } });
    const userInDb = await prisma.user.findUnique({ where: { id: onboardingAuth.user.id } });

    // Validate independent Argon2id hashes (Invariant 5)
    assert(
      'GOV Password hash validates against GOV password',
      await argon2.verify(govIdInDb!.passwordHash, citizenGovPassword),
    );
    assert(
      'Financial Password hash validates against Financial password',
      await argon2.verify(userInDb!.financialPasswordHash, citizenFinancialPassword),
    );

    // Cross-credential resistance (Invariant 6 & 7)
    assert(
      'GOV Password CANNOT validate Financial Password hash (strict credential isolation)',
      !(await argon2.verify(userInDb!.financialPasswordHash, citizenGovPassword)),
    );
    assert(
      'Financial Password CANNOT validate GOV Password hash (strict credential isolation)',
      !(await argon2.verify(govIdInDb!.passwordHash, citizenFinancialPassword)),
    );

    // -------------------------------------------------------------------------
    // STAGE 6: ARTHAX LOGIN USING GOV ID + GOV PASSWORD & 5-ATTEMPT LOCKOUT
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 6: Sovereign Login, Redis Session & 5-Attempt Lockout ---');

    // Failed login test
    let badPasswordRejected = false;
    try {
      await identityService.login({
        govIdOrEmail: govRecord.govIdNumber,
        govPassword: 'CompletelyWrongPassword#999',
      });
    } catch (err: any) {
      badPasswordRejected = err instanceof UnauthorizedException;
    }
    assert('Login with wrong password rejected with UnauthorizedException', badPasswordRejected);

    // 5-attempt account lockout verification
    const lockoutTargetEmail = `lockout.e2e.${timestamp}@arthax.gov`;
    registeredEmails.push(lockoutTargetEmail);
    const lockOtp = await identityService.sendEmailOtp({ email: lockoutTargetEmail });
    await identityService.verifyEmailOtp({ email: lockoutTargetEmail, code: lockOtp.code! });
    const lockGov = await identityService.createGovId({ email: lockoutTargetEmail, govPassword: citizenGovPassword });
    createdGovIds.push(lockGov.id);
    const lockAuth = await identityService.setFinancialPassword(lockGov.id, { financialPassword: citizenFinancialPassword });
    createdUserIds.push(lockAuth.user.id);

    for (let i = 0; i < 5; i++) {
      try {
        await identityService.login({ govIdOrEmail: lockoutTargetEmail, govPassword: 'InvalidAttempt!' });
      } catch {
        // Expected failed login
      }
    }

    let lockoutEnforced = false;
    try {
      await identityService.login({ govIdOrEmail: lockoutTargetEmail, govPassword: citizenGovPassword });
    } catch (err: any) {
      if (err instanceof UnauthorizedException && err.message.includes('locked')) {
        lockoutEnforced = true;
      }
    }
    assert('5 consecutive failed login attempts trigger 15-minute account lockout', lockoutEnforced);

    // Legitimate login with GOV ID + GOV Password
    const loginResult = await identityService.login({
      govIdOrEmail: govRecord.govIdNumber,
      govPassword: citizenGovPassword,
    });
    assert('Login succeeds with sequential GOV ID and GOV Password', !!loginResult.token);
    assert('Login response returns correct citizen profile', loginResult.user.govIdNumber === govRecord.govIdNumber);

    const loginToken = loginResult.token;
    const decodedLogin: any = jwtService.decode(loginToken);
    const citizenSessionId = decodedLogin.jti;
    assert('JWT contains unique session jti', !!citizenSessionId);

    // Verify session mirrored in Redis sovereign cache
    const isRevokedInStore = await sessionStore.isSessionRevoked(citizenSessionId);
    assert('Session registered as active in Redis store (not revoked)', isRevokedInStore === false);

    // -------------------------------------------------------------------------
    // STAGE 7: USER PORTAL SESSION GUARD & LOCALSTORAGE SHORTCUT REJECTION
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 7: Session Guard Enforcement & Token Authorization ---');

    // Invariant 9: No frontend/localStorage state may grant authentication
    let unauthenticatedRejected = false;
    try {
      await jwtAuthGuard.canActivate(createMockExecutionContext(undefined));
    } catch (err: any) {
      unauthenticatedRejected = err instanceof UnauthorizedException;
    }
    assert('Requests without Authorization header strictly rejected (Invariant 9)', unauthenticatedRejected);

    let fakeTokenRejected = false;
    try {
      await jwtAuthGuard.canActivate(createMockExecutionContext('Bearer fake-client-generated-token'));
    } catch (err: any) {
      fakeTokenRejected = err instanceof UnauthorizedException;
    }
    assert('Fabricated client token rejected by backend authentication authority', fakeTokenRejected);

    // Valid authenticated token passes JwtAuthGuard
    const guardContext = createMockExecutionContext(`Bearer ${loginToken}`);
    const guardPassed = await jwtAuthGuard.canActivate(guardContext);
    assert('Valid sovereign JWT token passes JwtAuthGuard', guardPassed === true);

    // -------------------------------------------------------------------------
    // STAGE 8: FINANCIAL STEP-UP AUTHORIZATION
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 8: Financial Step-Up Verification ---');

    // Wrong financial password rejected
    let wrongStepUpRejected = false;
    try {
      await identityService.verifyStepUp(onboardingAuth.user.id, {
        financialPassword: 'WrongFinancialPassword#1',
      });
    } catch (err: any) {
      wrongStepUpRejected = err instanceof UnauthorizedException;
    }
    assert('Step-up verification rejects incorrect Financial Password', wrongStepUpRejected);

    // GOV password rejected for financial step-up (Invariant 7)
    let govPasswordStepUpRejected = false;
    try {
      await identityService.verifyStepUp(onboardingAuth.user.id, {
        financialPassword: citizenGovPassword,
      });
    } catch (err: any) {
      govPasswordStepUpRejected = err instanceof UnauthorizedException;
    }
    assert('GOV password cannot satisfy Financial step-up challenge (Invariant 7)', govPasswordStepUpRejected);

    // Valid financial step-up succeeds and returns 300s step-up token
    const stepUpResult = await identityService.verifyStepUp(onboardingAuth.user.id, {
      financialPassword: citizenFinancialPassword,
    });
    assert('Step-up verification succeeds with correct Financial Password', stepUpResult.verified === true);
    assert('Step-up authorization token issued', !!stepUpResult.stepUpToken);

    const decodedStepUp: any = jwtService.decode(stepUpResult.stepUpToken!);
    assert('Step-up token carries stepUp: true authorization payload', decodedStepUp.stepUp === true && decodedStepUp.sub === onboardingAuth.user.id);

    // -------------------------------------------------------------------------
    // STAGE 9: LOGOUT & SESSION REVOCATION ACROSS REDIS & POSTGRESQL
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 9: Logout & Instant Session Revocation ---');

    // Invariant 10: Logout revokes session in Redis and PostgreSQL
    await identityService.revokeSession(onboardingAuth.user.id, citizenSessionId);

    const isRevokedAfterLogout = await sessionStore.isSessionRevoked(citizenSessionId);
    assert('Session marked revoked in Redis and PostgreSQL store (Invariant 10)', isRevokedAfterLogout === true);

    const pgSession = await prisma.session.findUnique({ where: { id: citizenSessionId } });
    assert('PostgreSQL Session row has revoked=true', pgSession?.revoked === true);

    // Invariant 11: Old JWT must fail immediately after revocation
    let revokedJwtRejected = false;
    try {
      await jwtAuthGuard.canActivate(createMockExecutionContext(`Bearer ${loginToken}`));
    } catch (err: any) {
      revokedJwtRejected = err instanceof UnauthorizedException;
    }
    assert('Revoked JWT rejected immediately by JwtAuthGuard (Invariant 11)', revokedJwtRejected);

    // -------------------------------------------------------------------------
    // STAGE 10: RE-LOGIN AFTER LOGOUT
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 10: Re-Login After Logout ---');

    // Re-login succeeds with GOV ID + GOV Password
    const reLoginResult = await identityService.login({
      govIdOrEmail: govRecord.govIdNumber,
      govPassword: citizenGovPassword,
    });
    assert('Re-login succeeds after previous session logout', !!reLoginResult.token);

    const decodedReLogin: any = jwtService.decode(reLoginResult.token);
    const newSessionId = decodedReLogin.jti;
    assert('Re-login issues fresh distinct session ID', newSessionId !== citizenSessionId);

    // New token passes JwtAuthGuard
    const reLoginGuardPassed = await jwtAuthGuard.canActivate(
      createMockExecutionContext(`Bearer ${reLoginResult.token}`),
    );
    assert('Fresh re-login token validates successfully via JwtAuthGuard', reLoginGuardPassed === true);

    // -------------------------------------------------------------------------
    // STAGE 11: FAIL-CLOSED RESILIENCY ON REDIS FAILURE
    // -------------------------------------------------------------------------
    console.log('\n--- STAGE 11: Redis Failure Fail-Closed Resilience ---');

    // Invariant 8: Redis failure must fail closed for authenticated session validation
    const offlineRedisPrisma = { isConnected: true, session: { findUnique: async () => ({ id: 'sess_1', revoked: false, expiresAt: new Date(Date.now() + 10000) }) } } as any;
    const failClosedStore = new SessionStoreService(offlineRedisPrisma);
    (failClosedStore as any).isRedisConnected = true;
    (failClosedStore as any).redis = {
      get: async () => {
        throw new Error('ECONNREFUSED: Redis sovereign node unreachable');
      },
    };

    let redisFailureFailClosed = false;
    try {
      await failClosedStore.isSessionRevoked('sess_active_candidate');
    } catch (err: any) {
      redisFailureFailClosed = err instanceof ServiceUnavailableException;
    }
    assert(
      'Session validation fails closed with ServiceUnavailableException when Redis errors (Invariant 8)',
      redisFailureFailClosed,
    );

    const failClosedGuard = new JwtAuthGuard(jwtService, failClosedStore);
    let guardFailClosed = false;
    try {
      await failClosedGuard.canActivate(createMockExecutionContext(`Bearer ${reLoginResult.token}`));
    } catch (err: any) {
      guardFailClosed = err instanceof UnauthorizedException;
    }
    assert('JwtAuthGuard denies access when underlying session store fails closed', guardFailClosed);

  } finally {
    // Deterministic teardown of test records
    try {
      for (const uid of createdUserIds) {
        const accts = await prisma.bankAccount.findMany({ where: { userId: uid } });
        for (const ba of accts) {
          await prisma.ledgerAccount.deleteMany({ where: { bankAccountId: ba.id } });
        }
        await prisma.session.deleteMany({ where: { userId: uid } });
        await prisma.bankAccount.deleteMany({ where: { userId: uid } });
        await prisma.bankCustomer.deleteMany({ where: { userId: uid } });
        await prisma.userLoadout.deleteMany({ where: { userId: uid } });
        await prisma.user.deleteMany({ where: { id: uid } });
      }

      for (const gid of createdGovIds) {
        await prisma.govId.deleteMany({ where: { id: gid } });
      }

      for (const em of registeredEmails) {
        await prisma.mfaToken.deleteMany({ where: { email: em } });
      }
    } catch (err) {
      console.warn('Test cleanup warning:', (err as Error).message);
    }

    await sessionStore.onModuleDestroy();
    await prisma.onModuleDestroy();
  }

  console.log('\n=================================================================');
  console.log(`  E2E ONBOARDING RESULT: ${passed} PASSED / ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runOnboardingJourneyE2E().catch((err) => {
  console.error('Fatal E2E Onboarding Test Error:', err);
  process.exit(1);
});
