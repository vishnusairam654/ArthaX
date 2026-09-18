import { PrismaService } from '../database/prisma.service';
import { IdentityService } from './identity.service';
import { SessionStoreService } from '../common/services/session-store.service';
import { AuditService } from '../audit/audit.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

/**
 * ARTHAX Identity & Real Database Auth Verification Suite
 */
async function runIdentityTests() {
  console.log('=================================================================');
  console.log('  ARTHAX IDENTITY & REAL DB AUTH VERIFICATION SUITE');
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

  const prisma = new PrismaService();
  await prisma.onModuleInit();

  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'arthax_dev_jwt_secret_change_in_production_sovereign_key_9841',
  });

  const sessionStore = new SessionStoreService(prisma);
  await sessionStore.onModuleInit();

  const auditService = new AuditService();
  const identityService = new IdentityService(prisma, jwtService, sessionStore, auditService);

  const testEmail = `test.citizen.${Date.now()}@arthax.gov`;
  const testGovPassword = 'GovStrongPassword@2026!';
  const testFinancialPassword = 'FinStrongPassword#2026';
  let verifiedTicket: string = '';
  let createdGovIdNumber: string = '';
  let createdGovIdUuid: string = '';
  let createdUserId: string = '';

  try {
    // ---------------------------------------------------------------------------
    // TEST GROUP 1: Database & Redis Connection Invariants
    // ---------------------------------------------------------------------------
    console.log('--- TEST GROUP 1: Database & Redis Connection Invariants ---');

    assert('PostgreSQL connection is active', prisma.isConnected === true);
    assert('Redis session store connection is active', sessionStore.isRedisConnected === true);

    // ---------------------------------------------------------------------------
    // TEST GROUP 2: OTP Generation, Storage & Verification
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 2: OTP Pipeline & PostgreSQL MfaToken ---');

    const sendRes = await identityService.sendEmailOtp({ email: testEmail });
    assert('sendEmailOtp returns 300s expiry', sendRes.expirySeconds === 300);
    assert('sendEmailOtp outputs verification code in dev', !!sendRes.code);

    const mfaRecord = await prisma.mfaToken.findFirst({
      where: { email: testEmail, purpose: 'EMAIL_VERIFY', consumed: false },
    });
    assert('MfaToken record exists in PostgreSQL', !!mfaRecord);
    assert('MfaToken consumed is false', mfaRecord?.consumed === false);

    const codeMatches = mfaRecord ? await argon2.verify(mfaRecord.codeHash, sendRes.code!) : false;
    assert('MfaToken codeHash in PostgreSQL verifies against raw code', codeMatches);

    // Verify rejection of bad OTP
    let badOtpRejected = false;
    try {
      await identityService.verifyEmailOtp({ email: testEmail, code: '000000' });
    } catch {
      badOtpRejected = true;
    }
    assert('Bad OTP code (000000) rejected with exception', badOtpRejected);

    // Verify valid OTP
    const verifyRes = await identityService.verifyEmailOtp({
      email: testEmail,
      code: sendRes.code!,
    });
    assert('Valid OTP code accepted', verifyRes.verified === true);
    assert('Registration ticket issued', !!verifyRes.registrationTicket);
    verifiedTicket = verifyRes.registrationTicket;

    const consumedToken = await prisma.mfaToken.findUnique({ where: { id: mfaRecord!.id } });
    assert('MfaToken marked consumed in PostgreSQL after verification', consumedToken?.consumed === true);

    // ---------------------------------------------------------------------------
    // TEST GROUP 3: GOV ID Creation & Argon2id Password Storage
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 3: GOV ID Creation & Argon2id Persistence ---');

    const govRes = await identityService.createGovId({
      email: testEmail,
      otpCode: '123456',
      govPassword: testGovPassword,
    });

    assert('GOV ID format is valid sequential GOV-XXXX-XXXX', /^GOV-\d{4}-\d{4}$/.test(govRes.govIdNumber));
    assert('Setup token issued for financial password phase', !!govRes.setupToken);

    createdGovIdNumber = govRes.govIdNumber;
    createdGovIdUuid = govRes.id;

    const dbGov = await prisma.govId.findUnique({ where: { id: createdGovIdUuid } });
    assert('GovId row persists in PostgreSQL', !!dbGov);
    assert('GovId status is ACTIVE', dbGov?.status === 'ACTIVE');

    const govPasswordMatches = dbGov ? await argon2.verify(dbGov.passwordHash, testGovPassword) : false;
    assert('GovId passwordHash in PostgreSQL validates with Argon2id', govPasswordMatches);

    // Duplicate registration rejected
    let duplicateRejected = false;
    try {
      await identityService.createGovId({
        email: testEmail,
        otpCode: '123456',
        govPassword: testGovPassword,
      });
    } catch {
      duplicateRejected = true;
    }
    assert('Duplicate GOV ID creation for same email rejected', duplicateRejected);

    // ---------------------------------------------------------------------------
    // TEST GROUP 4: Financial Password Isolation & User Provisioning
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 4: Financial Password Isolation & Account Provisioning ---');

    const authRes = await identityService.setFinancialPassword(createdGovIdUuid, {
      financialPassword: testFinancialPassword,
      displayName: 'Test Sovereign Citizen',
    });

    assert('setFinancialPassword returns auth session token', !!authRes.token);
    assert('setFinancialPassword returns user profile', !!authRes.user.id);
    createdUserId = authRes.user.id;

    const dbUser = await prisma.user.findUnique({ where: { id: createdUserId } });
    assert('User row persists in PostgreSQL', !!dbUser);
    assert('User role is USER', dbUser?.role === 'USER');

    const finPwMatches = dbUser ? await argon2.verify(dbUser.financialPasswordHash, testFinancialPassword) : false;
    assert('Financial password hash in PostgreSQL validates with Argon2id', finPwMatches);

    const govOnFinMatches = dbUser ? await argon2.verify(dbUser.financialPasswordHash, testGovPassword) : false;
    assert('GOV Password CANNOT validate Financial Password hash (strict isolation)', !govOnFinMatches);

    // Verify NAVA bank account provisioned in PostgreSQL
    const bankCust = await prisma.bankCustomer.findFirst({
      where: { userId: createdUserId, bankId: 'nava' },
    });
    assert('NAVA Bank customer relationship provisioned in PostgreSQL', !!bankCust);

    const bankAcct = await prisma.bankAccount.findFirst({
      where: { userId: createdUserId, bankId: 'nava' },
    });
    assert('NAVA Primary savings account provisioned in PostgreSQL', !!bankAcct);

    const ledgerAcct = bankAcct
      ? await prisma.ledgerAccount.findFirst({ where: { bankAccountId: bankAcct.id } })
      : null;
    assert('Ledger account linked to bank account provisioned in PostgreSQL', !!ledgerAcct);

    // ---------------------------------------------------------------------------
    // TEST GROUP 5: Login & Authentication Challenges
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 5: Real PostgreSQL Login Authentication ---');

    // Login via email
    const loginEmail = await identityService.login({
      govIdOrEmail: testEmail,
      govPassword: testGovPassword,
    });
    assert('Login succeeds via registered email address', !!loginEmail.token);
    assert('Login returns correct user email', loginEmail.user.email === testEmail);

    // Login via GOV ID
    const loginGovId = await identityService.login({
      govIdOrEmail: createdGovIdNumber,
      govPassword: testGovPassword,
    });
    assert('Login succeeds via sequential GOV ID number', !!loginGovId.token);
    assert('Login returns correct GOV ID number', loginGovId.user.govIdNumber === createdGovIdNumber);

    // Login with invalid password fails
    let wrongPwFailed = false;
    try {
      await identityService.login({
        govIdOrEmail: testEmail,
        govPassword: 'WrongPassword999!',
      });
    } catch {
      wrongPwFailed = true;
    }
    assert('Login fails with incorrect password', wrongPwFailed);

    // ---------------------------------------------------------------------------
    // TEST GROUP 6: Step-Up Auth
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 6: Step-Up Auth & Credential Separation ---');

    let wrongFinFailed = false;
    try {
      await identityService.verifyStepUp(createdUserId, {
        financialPassword: 'WrongFinancialPassword#1',
      });
    } catch {
      wrongFinFailed = true;
    }
    assert('Step-up verification rejects wrong financial password', wrongFinFailed);

    const stepUpRes = await identityService.verifyStepUp(createdUserId, {
      financialPassword: testFinancialPassword,
    });
    assert('Step-up verification accepts correct financial password', stepUpRes.verified === true);
    assert('Step-up token issued with 300s validity', stepUpRes.expiresInSeconds === 300);

    // ---------------------------------------------------------------------------
    // TEST GROUP 7: Session Persistence, Revocation & Killswitch
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 7: Session Persistence, Revocation & Killswitch ---');

    const sessions = await identityService.getActiveSessions(createdUserId);
    assert('getActiveSessions returns active sessions from PostgreSQL', sessions.length > 0);

    const targetSessionId = sessions[0].id;
    await identityService.revokeSession(createdUserId, targetSessionId);

    const dbRevokedSession = await prisma.session.findUnique({ where: { id: targetSessionId } });
    assert('Session marked revoked=true in PostgreSQL table', dbRevokedSession?.revoked === true);

    const isRevoked = await sessionStore.isSessionRevoked(targetSessionId);
    assert('Session store recognizes session as revoked', isRevoked === true);

    // Emergency killswitch
    await identityService.emergencyKillswitch(createdUserId);
    const remainingActive = await prisma.session.findMany({
      where: { userId: createdUserId, revoked: false },
    });
    assert('Emergency killswitch invalidates all user sessions in PostgreSQL', remainingActive.length === 0);

    // ---------------------------------------------------------------------------
    // TEST GROUP 8: Seed Citizen Authentication
    // ---------------------------------------------------------------------------
    console.log('\n--- TEST GROUP 8: Seeded Demo Citizen Verification ---');

    const citizenLogin = await identityService.login({
      govIdOrEmail: 'citizen@arthax.gov',
      govPassword: 'GovSovereign@2026!',
    });
    assert('Seeded citizen (citizen@arthax.gov) authenticates against PostgreSQL', !!citizenLogin.token);
    assert('Citizen display name is Aarav Vance', citizenLogin.user.displayName === 'Aarav Vance');
    assert('Citizen role is USER', citizenLogin.user.role === 'USER');

    const citizenStepUp = await identityService.verifyStepUp(citizenLogin.user.id, {
      financialPassword: 'FinSecret#2026',
    });
    assert('Citizen step-up with FinSecret#2026 succeeds against PostgreSQL', citizenStepUp.verified === true);

  } finally {
    // Cleanup created test records
    try {
      if (createdUserId) {
        await prisma.session.deleteMany({ where: { userId: createdUserId } });
        await prisma.bankAccount.deleteMany({ where: { userId: createdUserId } });
        await prisma.bankCustomer.deleteMany({ where: { userId: createdUserId } });
        await prisma.userLoadout.deleteMany({ where: { userId: createdUserId } });
        await prisma.user.deleteMany({ where: { id: createdUserId } });
      }
      if (testEmail) {
        await prisma.mfaToken.deleteMany({ where: { email: testEmail } });
        await prisma.govId.deleteMany({ where: { email: testEmail } });
      }
    } catch {
      // Ignored
    }

    await sessionStore.onModuleDestroy();
    await prisma.onModuleDestroy();
  }

  console.log('\n=================================================================');
  console.log(`  RESULT: ${passed} PASSED / ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runIdentityTests().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
