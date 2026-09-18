import { PrismaService } from './prisma.service';
import { IdentityService } from '../identity/identity.service';
import { SessionStoreService } from '../common/services/session-store.service';
import { AuditService } from '../audit/audit.service';
import { LedgerService } from '../ledger/ledger.service';
import { BankingService } from '../banking/banking.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { BalanceEngineService } from '../ledger/balance-engine.service';

/**
 * ARTHAX RUNTIME PERSISTENCE & FAIL-CLOSED VERIFICATION SUITE
 */
export async function runPersistenceAndFailClosedTests() {
  console.log('=================================================================');
  console.log('  ARTHAX RUNTIME PERSISTENCE & FAIL-CLOSED VERIFICATION SUITE');
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

  // 1. Initialize Prisma and Connect to PostgreSQL
  const prisma = new PrismaService();
  await prisma.onModuleInit();

  assert('PostgreSQL Connection Active', prisma.isConnected === true);

  // 2. Verify 44 Physical Tables in PostgreSQL
  const tableRows: Array<{ table_name: string }> = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  assert('PostgreSQL Schema Table Count (44 tables)', tableRows.length === 44, `Found: ${tableRows.length}`);

  // 3. Verify Seed Entities in PostgreSQL
  const bankCount = await prisma.bank.count();
  const bankAccountCount = await prisma.bankAccount.count();
  const ledgerAccountCount = await prisma.ledgerAccount.count();
  const userCount = await prisma.user.count();
  const shopItemCount = await prisma.shopItem.count();
  const stockCompanyCount = await prisma.stockCompany.count();

  assert('PostgreSQL Seed: 5 Canonical Banks', bankCount === 5, `Found: ${bankCount}`);
  assert('PostgreSQL Seed: Bank Accounts Exist', bankAccountCount >= 5, `Found: ${bankAccountCount}`);
  assert('PostgreSQL Seed: Ledger Accounts Exist', ledgerAccountCount >= 11, `Found: ${ledgerAccountCount}`);
  assert('PostgreSQL Seed: Users Exist', userCount >= 8, `Found: ${userCount}`);
  assert('PostgreSQL Seed: 15 Shop Items', shopItemCount === 15, `Found: ${shopItemCount}`);
  assert('PostgreSQL Seed: 10 Stock Companies', stockCompanyCount === 10, `Found: ${stockCompanyCount}`);

  // 4. Initialize Identity & Auth Services
  const jwtService = new JwtService({
    secret: process.env.JWT_SECRET || 'arthax_dev_jwt_secret_change_in_production_sovereign_key_9841',
  });
  const sessionStore = new SessionStoreService(prisma);
  await sessionStore.onModuleInit();
  const auditService = new AuditService();
  const identityService = new IdentityService(prisma, jwtService, sessionStore, auditService);

  // 5. Test Live User Registration Flow against PostgreSQL
  const testEmail = `persistence.citizen.${Date.now()}@arthax.gov`;
  const testGovPassword = 'GovStrongPassword@2026!';
  const testFinancialPassword = 'FinStrongPassword#2026';

  // Step A: Send OTP
  const otpRes = await identityService.sendEmailOtp({ email: testEmail });
  assert('Registration Step 1: Send OTP to PostgreSQL MfaToken', !!otpRes.code);

  // Step B: Verify OTP
  const verifyRes = await identityService.verifyEmailOtp({ email: testEmail, code: otpRes.code! });
  assert('Registration Step 2: Verify OTP via PostgreSQL', verifyRes.verified === true);

  // Step C: Create GOV ID with Argon2id hash in PostgreSQL
  const govIdRes = await identityService.createGovId({
    email: testEmail,
    otpCode: otpRes.code!,
    govPassword: testGovPassword,
  });
  assert('Registration Step 3: GOV ID Record in PostgreSQL', !!govIdRes.id && govIdRes.govIdNumber.startsWith('GOV-'));

  const govRecordInDb = await prisma.govId.findUnique({ where: { id: govIdRes.id } });
  assert('GOV ID Row Stored in PostgreSQL GovId Table', !!govRecordInDb && govRecordInDb.email === testEmail);

  // Verify Argon2id hash format
  const isGovHashArgon2id = govRecordInDb?.passwordHash.startsWith('$argon2id$');
  assert('GOV Password Stored as Argon2id Hash', isGovHashArgon2id === true);

  // Step D: Establish Isolated Financial Password & Provision User in PostgreSQL
  const setupRes = await identityService.setFinancialPassword(
    govIdRes.id,
    { financialPassword: testFinancialPassword, displayName: 'Persistence Citizen' },
  );
  assert('Registration Step 4: User Provisioned with Financial Credential', !!setupRes.token && !!setupRes.user);

  const userRecordInDb = await prisma.user.findUnique({ where: { id: setupRes.user.id } });
  assert('User Record Stored in PostgreSQL User Table', !!userRecordInDb);

  const isFinHashArgon2id = userRecordInDb?.financialPasswordHash.startsWith('$argon2id$');
  assert('Financial Password Stored as Independent Argon2id Hash', isFinHashArgon2id === true);
  assert('GOV and Financial Hashes are Cryptographically Independent', govRecordInDb?.passwordHash !== userRecordInDb?.financialPasswordHash);

  // Verify 1:1:1 Invariant: BankCustomer and BankAccount auto-provisioned
  const userBankAccount = await prisma.bankAccount.findFirst({
    where: { userId: setupRes.user.id },
    include: { ledgerAccount: true },
  });
  assert('Auto-Provisioned NAVA Bank Account in PostgreSQL', !!userBankAccount && userBankAccount.bankId === 'nava');
  assert('Auto-Provisioned Double-Entry Ledger Account in PostgreSQL', !!userBankAccount?.ledgerAccount);

  // 6. Test Live Login and Session Persistence in PostgreSQL & Redis
  const loginRes = await identityService.login({
    govIdOrEmail: testEmail,
    govPassword: testGovPassword,
  });
  assert('Login: Authenticated via Argon2id against PostgreSQL', !!loginRes.token);

  const sessionInDb = await prisma.session.findFirst({
    where: { userId: setupRes.user.id, revoked: false },
  });
  assert('Session Record Persisted in PostgreSQL Session Table', !!sessionInDb);

  // Verify Redis session rate-limiting
  const rateLimitOk = await sessionStore.checkRateLimit(`test-rl:${setupRes.user.id}`, 10, 60);
  assert('Redis Active for Rate Limiting / Session Infrastructure', rateLimitOk.allowed === true);

  // 7. Test Real Financial Write & Double-Entry Ledger Posting in PostgreSQL
  const balanceEngine = new BalanceEngineService(prisma, auditService);
  const ledgerService = new LedgerService(prisma, auditService, balanceEngine);
  const bankingService = new BankingService(prisma, ledgerService, auditService);

  // Find source account with funds: ARTH-NAVA-001 primary account
  const sourceAcct = await prisma.bankAccount.findFirst({
    where: { accountNumber: 'ARTH-NAVA-001', status: 'ACTIVE' },
    include: { ledgerAccount: true },
  });
  assert('Found Source Account for Transfer Test', !!sourceAcct && !!sourceAcct.ledgerAccount);

  const initialSourceBal = sourceAcct!.ledgerAccount!.balanceSnapshot;
  const initialDestBal = userBankAccount!.ledgerAccount!.balanceSnapshot;
  const transferAmountMinor = 100000n; // 1000.00 ARTH

  // Execute Real Intra-Bank Transfer with Step-Up Financial Password
  const transferRes = await bankingService.executeIntraBankTransfer(
    sourceAcct!.userId,
    {
      sourceAccountId: sourceAcct!.id,
      destinationAccountNumber: userBankAccount!.accountNumber,
      amountMinor: transferAmountMinor.toString(),
      financialPassword: 'FinSecret#2026',
      memo: 'Persistence Verification Transfer',
    },
    `IDEM-TEST-${Date.now()}`,
  );

  assert('Intra-Bank Transfer Committed', transferRes.success === true && !!transferRes.transaction);

  // Query PostgreSQL Transaction and Entries
  const txRecord = await prisma.transaction.findUnique({
    where: { id: transferRes.transaction.id },
    include: { entries: true },
  });
  assert('Transaction Row Persisted in PostgreSQL Transaction Table', !!txRecord && txRecord.status === 'COMPLETED');
  assert('Double-Entry: Exactly 2 Ledger Entries Written', txRecord?.entries.length === 2);

  const debitEntry = txRecord?.entries.find((e) => e.entryType === 'DEBIT');
  const creditEntry = txRecord?.entries.find((e) => e.entryType === 'CREDIT');
  assert('Double-Entry Balance: Debit Exists & Matches Amount', debitEntry?.amountMinor === transferAmountMinor);
  assert('Double-Entry Balance: Credit Exists & Matches Amount', creditEntry?.amountMinor === transferAmountMinor);
  assert('Ledger Invariant: Σ Debits == Σ Credits', debitEntry?.amountMinor === creditEntry?.amountMinor);

  // Verify LedgerAccount Balances in PostgreSQL
  const updatedSourceLedger = await prisma.ledgerAccount.findUnique({ where: { id: sourceAcct!.ledgerAccount!.id } });
  const updatedDestLedger = await prisma.ledgerAccount.findUnique({ where: { id: userBankAccount!.ledgerAccount!.id } });
  assert(
    'Source Ledger Account Balance Decremented in PostgreSQL',
    updatedSourceLedger?.balanceSnapshot === initialSourceBal - transferAmountMinor,
    `Expected: ${initialSourceBal - transferAmountMinor}, Got: ${updatedSourceLedger?.balanceSnapshot}`
  );
  assert(
    'Destination Ledger Account Balance Incremented in PostgreSQL',
    updatedDestLedger?.balanceSnapshot === initialDestBal + transferAmountMinor,
    `Expected: ${initialDestBal + transferAmountMinor}, Got: ${updatedDestLedger?.balanceSnapshot}`
  );

  // 8. Test Simulated API Server Restart Survival
  console.log('\n  Simulating API Server Restart...');
  await prisma.$disconnect();

  // New Prisma instance connecting to PostgreSQL
  const restartedPrisma = new PrismaService();
  await restartedPrisma.onModuleInit();

  assert('Restarted API Re-connected to PostgreSQL', restartedPrisma.isConnected === true);

  const restartedUser = await restartedPrisma.user.findUnique({ where: { id: setupRes.user.id } });
  assert('Restart Survival: User Persists in PostgreSQL', !!restartedUser && restartedUser.displayName === 'Persistence Citizen');

  const restartedDestLedger = await restartedPrisma.ledgerAccount.findUnique({ where: { id: userBankAccount!.ledgerAccount!.id } });
  assert(
    'Restart Survival: Bank Account and New Balance Persist in PostgreSQL',
    restartedDestLedger?.balanceSnapshot === initialDestBal + transferAmountMinor,
  );

  const restartedTx = await restartedPrisma.transaction.findUnique({ where: { id: transferRes.transaction.id } });
  assert('Restart Survival: Completed Transaction Persists in PostgreSQL', !!restartedTx && restartedTx.status === 'COMPLETED');

  // 9. Test Fail-Closed Invariant on PostgreSQL Disconnection
  console.log('\n  Testing Fail-Closed Invariant...');

  // A: PrismaService.assertFinancialWriteSafe throws if isConnected is false
  (restartedPrisma as any).isConnected = false;
  let writeBlocked = false;
  try {
    restartedPrisma.assertFinancialWriteSafe('TestTransfer');
  } catch (err: any) {
    writeBlocked = true;
    assert('Fail-Closed: assertFinancialWriteSafe Rejects Write When DB Disconnected', true, err.message);
  }
  assert('Fail-Closed Enforcement Flag Triggered', writeBlocked);

  // B: SessionStoreService.isSessionRevoked fails closed if DB and Redis are unreachable
  const isolatedSessionStore = new SessionStoreService(restartedPrisma);
  // simulate Redis failure
  (isolatedSessionStore as any).redis = null;
  let sessionFailClosedTriggered = false;
  try {
    await isolatedSessionStore.isSessionRevoked('any-session-id');
  } catch (err: any) {
    sessionFailClosedTriggered = true;
    assert('Fail-Closed: isSessionRevoked Rejects with ServiceUnavailableException When DB & Redis Offline', true, err.message);
  }
  assert('Fail-Closed Session Guard Triggered', sessionFailClosedTriggered);

  // Restore connection
  (restartedPrisma as any).isConnected = true;
  await restartedPrisma.$disconnect();
  await sessionStore.onModuleDestroy();

  console.log('\n=================================================================');
  console.log(`  RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  runPersistenceAndFailClosedTests().catch((err) => {
    console.error('Fatal test runner error:', err);
    process.exit(1);
  });
}
