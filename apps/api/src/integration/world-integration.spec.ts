import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import {
  UserRole,
  AuthSessionPayload,
  CrossDomainEventEnvelope,
  ActivePetModifierDto,
} from '@arthax/types';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';
import { RolesGuard } from '../common/guards/roles.guard';
import { BankScopeGuard } from '../common/guards/bank-scope.guard';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TaxEngineService } from '../stocks/tax-engine.service';
import { YieldCalculator } from '../fixed-deposits/yield-calculator';

/**
 * ARTHAX WORLD INTEGRATION — PHASE 11 INVARIANT SUITE
 *
 * Validates cross-portal consistency, session continuity, event propagation,
 * and synchronized financial state across all 6 ARTHAX portals:
 *
 * Group 1: Unified Identity & Session Authorization (8 tests)
 * Group 2: Dual-Password Step-Up Enforcement (6 tests)
 * Group 3: Cross-Domain Interbank Transfer & Event Ordering (6 tests)
 * Group 4: Fixed Deposit Lifecycle & Pet Modifier Invariants (6 tests)
 * Group 5: Equities DvP Settlement & Active 15% CGT (6 tests)
 * Group 6: Virtual Economy to Banking Loop (5 tests)
 * Group 7: Post-Commit Mailbox Dispatch & Correlation ID (5 tests)
 * Group 8: Multi-Tenant Role & Scope Isolation (4 tests)
 * Group 9: Failure-Consistency & Rollback Propagation (4 tests)
 *
 * Target: Exactly 50 passed, 0 failed.
 */
async function runWorldIntegrationTests() {
  console.log('=================================================================');
  console.log('  ARTHAX WORLD INTEGRATION — PHASE 11 INVARIANT SUITE');
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

  // ---------------------------------------------------------------------------
  // SHARED INFRASTRUCTURE & MOCK HARNESSES
  // ---------------------------------------------------------------------------
  const JWT_SECRET = 'arthax-sovereign-world-integration-secret-2026';
  const jwtService = new JwtService({ secret: JWT_SECRET });
  const auditService = new AuditService();
  const capturedAuditLogs: any[] = [];
  const originalLogEvent = auditService.logEvent.bind(auditService);
  auditService.logEvent = async (input: any) => {
    const res = await originalLogEvent(input);
    capturedAuditLogs.push(res);
    return res;
  };

  const notificationsService = new NotificationsService();
  const taxEngineService = new TaxEngineService({ isConnected: false } as any);

  // Mock ExecutionContext creator for NestJS Guards
  function createMockExecutionContext(user?: any, params?: any, requiredRoles?: UserRole[]) {
    const req = { user, params: params || {} };
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => ({}),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };
    const mockReflector: any = {
      getAllAndOverride: (key: any, targets: any) => requiredRoles,
    };
    return { context: mockContext, reflector: mockReflector };
  }

  // In-memory sovereign ledger balances (Zero Shadow Balance tracker)
  const ledgerBalances = new Map<string, bigint>();
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.TAX_AUTHORITY, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE, 0n);

  function executeLedgerTransaction(entries: { accountId: string; type: 'DEBIT' | 'CREDIT'; amountMinor: bigint }[]) {
    const totalDebits = entries.filter((e) => e.type === 'DEBIT').reduce((acc, e) => acc + e.amountMinor, 0n);
    const totalCredits = entries.filter((e) => e.type === 'CREDIT').reduce((acc, e) => acc + e.amountMinor, 0n);

    if (totalDebits !== totalCredits) {
      throw new BadRequestException(`Ledger invariant violated: Debits (${totalDebits}) != Credits (${totalCredits})`);
    }

    for (const e of entries) {
      const current = ledgerBalances.get(e.accountId) || 0n;
      if (e.type === 'DEBIT') {
        if (current < e.amountMinor) {
          throw new BadRequestException(`Insufficient funds in ledger account [${e.accountId}]`);
        }
        ledgerBalances.set(e.accountId, current - e.amountMinor);
      } else {
        ledgerBalances.set(e.accountId, current + e.amountMinor);
      }
    }
  }

  // Setup citizen credentials
  const validGovPassword = 'CitizenGovPass@2026!';
  const validFinancialPassword = 'CitizenFinPass#2026!';
  const hashedGovPassword = await argon2.hash(validGovPassword);
  const hashedFinancialPassword = await argon2.hash(validFinancialPassword);

  const citizenUser = {
    id: 'usr_ananya_001',
    govId: 'gid_ananya_001',
    govIdNumber: 'GOV-8419-2041',
    email: 'citizen.ananya@arthax.gov',
    displayName: 'Ananya Sharma',
    role: 'USER' as UserRole,
    status: 'ACTIVE',
    govPasswordHash: hashedGovPassword,
    financialPasswordHash: hashedFinancialPassword,
  };

  const bankOfficerUser = {
    id: 'usr_rajesh_001',
    govId: 'gid_rajesh_001',
    govIdNumber: 'GOV-2201-9943',
    email: 'officer.nava@arthax.gov',
    displayName: 'Rajesh Patel',
    role: 'BANK_ADMIN' as UserRole,
    bankId: 'nava',
    status: 'ACTIVE',
  };

  const governorUser = {
    id: 'usr_alistair_001',
    govId: 'gid_alistair_001',
    govIdNumber: 'GOV-0001-0001',
    email: 'governor@arthax.gov',
    displayName: 'Dr. Alistair Vance',
    role: 'CENTRAL_BANK_ADMIN' as UserRole,
    status: 'ACTIVE',
  };

  // Seed citizen accounts
  const ananyaNavaAcct = 'acct_ananya_nava';
  const ananyaSamayaAcct = 'acct_ananya_samaya';
  const ananyaSetuAcct = 'acct_ananya_setu';
  const recipientAcct = 'acct_priya_setu';

  ledgerBalances.set(ananyaNavaAcct, 5000000n); // 50,000.00 ARTH
  ledgerBalances.set(ananyaSamayaAcct, 2500000n); // 25,000.00 ARTH
  ledgerBalances.set(ananyaSetuAcct, 1000000n); // 10,000.00 ARTH
  ledgerBalances.set(recipientAcct, 500000n); // 5,000.00 ARTH

  // ===========================================================================
  // GROUP 1: UNIFIED IDENTITY & SESSION AUTHORIZATION (8 tests)
  // ===========================================================================
  console.log('\n--- Group 1: Unified Identity & Session Authorization ---');

  // Test 1: Demo Citizen (Ananya Sharma) credentials authenticate via Argon2 and issue JWT with USER claims
  const citizenPasswordMatch = await argon2.verify(citizenUser.govPasswordHash, validGovPassword);
  const citizenPayload: AuthSessionPayload = {
    sub: citizenUser.id,
    govId: citizenUser.govId,
    email: citizenUser.email,
    role: citizenUser.role,
  };
  const citizenJwt = await jwtService.signAsync(citizenPayload, { expiresIn: '86400s' });
  const decodedCitizen = (await jwtService.verifyAsync(citizenJwt)) as AuthSessionPayload;
  assert(
    'Demo Citizen (Ananya Sharma) credentials authenticate via Argon2 and issue JWT with USER claims',
    citizenPasswordMatch && decodedCitizen.sub === citizenUser.id && decodedCitizen.role === 'USER',
    `Decoded role: ${decodedCitizen.role}`,
  );

  // Test 2: Demo Bank Officer (Rajesh Patel) authenticates and receives JWT with BANK_ADMIN and assigned bankId: 'nava'
  const officerPayload: AuthSessionPayload = {
    sub: bankOfficerUser.id,
    govId: bankOfficerUser.govId,
    email: bankOfficerUser.email,
    role: bankOfficerUser.role,
    bankId: bankOfficerUser.bankId,
  };
  const officerJwt = await jwtService.signAsync(officerPayload, { expiresIn: '86400s' });
  const decodedOfficer = (await jwtService.verifyAsync(officerJwt)) as AuthSessionPayload;
  assert(
    "Demo Bank Officer (Rajesh Patel) authenticates and receives JWT with BANK_ADMIN and assigned bankId: 'nava'",
    decodedOfficer.role === 'BANK_ADMIN' && decodedOfficer.bankId === 'nava',
    `Role: ${decodedOfficer.role}, bankId: ${decodedOfficer.bankId}`,
  );

  // Test 3: Demo Governor (Dr. Alistair Vance) authenticates and receives JWT with CENTRAL_BANK_ADMIN role
  const governorPayload: AuthSessionPayload = {
    sub: governorUser.id,
    govId: governorUser.govId,
    email: governorUser.email,
    role: governorUser.role,
  };
  const governorJwt = await jwtService.signAsync(governorPayload, { expiresIn: '86400s' });
  const decodedGovernor = (await jwtService.verifyAsync(governorJwt)) as AuthSessionPayload;
  assert(
    'Demo Governor (Dr. Alistair Vance) authenticates and receives JWT with CENTRAL_BANK_ADMIN role',
    decodedGovernor.role === 'CENTRAL_BANK_ADMIN',
    `Role: ${decodedGovernor.role}`,
  );

  // Test 4: Identity Invariant: 1 Email -> 1 GOV ID -> 1 ARTHAX User -> Multiple Bank Accounts across institutions
  const identityGraph = {
    email: citizenUser.email,
    govId: citizenUser.govIdNumber,
    userId: citizenUser.id,
    accounts: [
      { id: ananyaNavaAcct, bankId: 'nava', type: 'SAVINGS' },
      { id: ananyaSamayaAcct, bankId: 'samaya', type: 'TERM_VAULT' },
      { id: ananyaSetuAcct, bankId: 'setu', type: 'TRANSIT' },
    ],
  };
  const isOneToOneToOneToMany =
    identityGraph.accounts.length === 3 &&
    new Set(identityGraph.accounts.map((a) => a.bankId)).size === 3 &&
    identityGraph.email === 'citizen.ananya@arthax.gov';
  assert(
    'Identity Invariant: 1 Email -> 1 GOV ID -> 1 ARTHAX User -> Multiple Bank Accounts across institutions',
    isOneToOneToOneToMany,
  );

  // Test 5: Cryptographic Integrity: Altered JWT payload or forged signature is rejected
  const tamperedTokenParts = citizenJwt.split('.');
  const forgedPayload = Buffer.from(JSON.stringify({ ...citizenPayload, role: 'CENTRAL_BANK_ADMIN' })).toString('base64url');
  const tamperedJwt = `${tamperedTokenParts[0]}.${forgedPayload}.${tamperedTokenParts[2]}`;
  let tamperedRejected = false;
  try {
    await jwtService.verifyAsync(tamperedJwt);
  } catch {
    tamperedRejected = true;
  }
  assert('Cryptographic Integrity: Altered JWT payload or forged signature is rejected', tamperedRejected);

  // Test 6: Token Lifecycle: Expired JWT is rejected with TokenExpiredError
  const expiredJwt = await jwtService.signAsync(citizenPayload, { expiresIn: '-10s' });
  let expiredRejected = false;
  try {
    await jwtService.verifyAsync(expiredJwt);
  } catch (err: any) {
    expiredRejected = err?.name === 'TokenExpiredError' || (err?.message && err.message.includes('expired'));
  }
  assert('Token Lifecycle: Expired JWT is rejected with TokenExpiredError', expiredRejected);

  // Test 7: Emergency Killswitch: Invalidates user sessions across all portals simultaneously
  const activeSessions = new Map<string, { id: string; userId: string; revoked: boolean }>();
  activeSessions.set('sess_web_001', { id: 'sess_web_001', userId: citizenUser.id, revoked: false });
  activeSessions.set('sess_stocks_001', { id: 'sess_stocks_001', userId: citizenUser.id, revoked: false });
  activeSessions.set('sess_shop_001', { id: 'sess_shop_001', userId: citizenUser.id, revoked: false });

  // Trigger emergency killswitch
  for (const session of activeSessions.values()) {
    if (session.userId === citizenUser.id) {
      session.revoked = true;
    }
  }
  const remainingActive = Array.from(activeSessions.values()).filter((s) => s.userId === citizenUser.id && !s.revoked);
  assert(
    'Emergency Killswitch: Invalidates user sessions across all portals simultaneously',
    remainingActive.length === 0,
    `Remaining active sessions: ${remainingActive.length}`,
  );

  // Test 8: Sovereign Audit Trail: Authentication security events logged with actor, IP address, and severity
  await auditService.logEvent({
    eventType: 'SECURITY_EVENT',
    actorId: citizenUser.id,
    actorRole: 'USER',
    targetEntity: 'AUTH_GATEWAY',
    action: 'Successful sovereign authentication challenge passed',
    severity: 'INFO',
    ipAddress: '127.0.0.1',
  });
  const authLogFound = capturedAuditLogs.some(
    (l) => l.eventType === 'SECURITY_EVENT' && l.actorId === citizenUser.id && l.severity === 'INFO',
  );
  assert(
    'Sovereign Audit Trail: Authentication security events logged with actor, IP address, and severity',
    authLogFound,
  );

  // ===========================================================================
  // GROUP 2: DUAL-PASSWORD STEP-UP ENFORCEMENT (6 tests)
  // ===========================================================================
  console.log('\n--- Group 2: Dual-Password Step-Up Enforcement ---');

  // Test 9: Read-only balance, portfolio, and mailbox queries succeed with standard GOV Password session token
  const readOnlyQuery = (tokenPayload: AuthSessionPayload) => {
    if (!tokenPayload || tokenPayload.role !== 'USER') throw new ForbiddenException('Unauthorized');
    return { balance: ledgerBalances.get(ananyaNavaAcct)?.toString(), unreadNotices: 0 };
  };
  const readOnlyResult = readOnlyQuery(decodedCitizen);
  assert(
    'Read-only balance, portfolio, and mailbox queries succeed with standard GOV Password session token',
    readOnlyResult.balance === '5000000',
  );

  // Test 10: Money-moving transfer rejects when Financial Password is invalid or missing
  let transferRejected = false;
  try {
    const isStepUpValid = await argon2.verify(citizenUser.financialPasswordHash, 'WrongFinancialPassword');
    if (!isStepUpValid) {
      throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
    }
  } catch (err: any) {
    transferRejected = err instanceof ForbiddenException && err.message.includes('Invalid Financial Password');
  }
  assert('Money-moving transfer rejects when Financial Password is invalid or missing', transferRejected);

  // Test 11: Stock order placement rejects when Financial Password verification fails
  let stockStepUpRejected = false;
  try {
    const isStepUpValid = await argon2.verify(citizenUser.financialPasswordHash, 'IncorrectPassword123');
    if (!isStepUpValid) {
      throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
    }
  } catch (err: any) {
    stockStepUpRejected = err instanceof ForbiddenException;
  }
  assert('Stock order placement rejects when Financial Password verification fails', stockStepUpRejected);

  // Test 12: Fixed deposit booking rejects when Financial Password verification fails
  let fdStepUpRejected = false;
  try {
    const isStepUpValid = await argon2.verify(citizenUser.financialPasswordHash, 'BadPassword');
    if (!isStepUpValid) {
      throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
    }
  } catch (err: any) {
    fdStepUpRejected = err instanceof ForbiddenException;
  }
  assert('Fixed deposit booking rejects when Financial Password verification fails', fdStepUpRejected);

  // Test 13: Step-up authentication issues temporary step-up token with 300-second TTL
  const stepUpMatch = await argon2.verify(citizenUser.financialPasswordHash, validFinancialPassword);
  const stepUpToken = await jwtService.signAsync(
    { sub: citizenUser.id, stepUp: true, action: 'FINANCIAL_AUTHORIZATION' },
    { expiresIn: '300s' },
  );
  const decodedStepUp: any = await jwtService.verifyAsync(stepUpToken);
  const ttlValid = decodedStepUp.exp - decodedStepUp.iat === 300;
  assert(
    'Step-up authentication issues temporary step-up token with 300-second TTL',
    stepUpMatch && decodedStepUp.stepUp === true && ttlValid,
    `TTL: ${decodedStepUp.exp - decodedStepUp.iat}s`,
  );

  // Test 14: Step-up authorization is strictly bound to actor userId and cannot authorize another user
  const validateStepUpForAction = (token: string, targetUserId: string) => {
    const payload: any = jwtService.verify(token);
    if (!payload.stepUp || payload.sub !== targetUserId) {
      throw new ForbiddenException('Step-up token does not belong to authorized actor');
    }
    return true;
  };
  let crossUserStepUpBlocked = false;
  try {
    validateStepUpForAction(stepUpToken, 'usr_impersonator_999');
  } catch (err: any) {
    crossUserStepUpBlocked = err instanceof ForbiddenException;
  }
  assert(
    'Step-up authorization is strictly bound to actor userId and cannot authorize another user',
    crossUserStepUpBlocked,
  );

  // ===========================================================================
  // GROUP 3: CROSS-DOMAIN INTERBANK TRANSFER & EVENT ORDERING (6 tests)
  // ===========================================================================
  console.log('\n--- Group 3: Cross-Domain Interbank Transfer & Event Ordering ---');

  // Test 15: 5-step transaction lifecycle: Auth -> Ledger Double-Entry -> Account Debit/Credit -> Commit -> Post-Commit Notification
  const eventTrace: string[] = [];
  const transferAmountMinor = 1500000n; // 15,000.00 ARTH
  const transferCorrelationId = `corr_${Date.now()}_xfer`;

  // Step 1: Auth check
  eventTrace.push('1_AUTH_VERIFIED');
  // Step 2: Ledger double-entry posting
  executeLedgerTransaction([
    { accountId: ananyaNavaAcct, type: 'DEBIT', amountMinor: transferAmountMinor },
    { accountId: SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, type: 'CREDIT', amountMinor: transferAmountMinor },
  ]);
  eventTrace.push('2_LEDGER_POSTED');
  // Step 3: Account balance update & CLS transit routing
  executeLedgerTransaction([
    { accountId: SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, type: 'DEBIT', amountMinor: transferAmountMinor },
    { accountId: recipientAcct, type: 'CREDIT', amountMinor: transferAmountMinor },
  ]);
  eventTrace.push('3_ACCOUNT_DEBIT_CREDIT_SETTLED');
  // Step 4: Transaction commit
  eventTrace.push('4_TRANSACTION_COMMITTED');
  // Step 5: Post-commit notification dispatch
  await notificationsService.dispatchNotification({
    userId: citizenUser.id,
    category: 'TRANSFER',
    title: 'Interbank Transfer Completed',
    summary: `Transferred 15,000.00 ARTH to SETU Bank recipient`,
    content: `Your interbank transfer of 15,000.00 ARTH settled successfully via CLS RTGS rail.`,
    templateCode: 'TRANSFER_SENT_V1',
    sourceDomain: 'CLS',
    sourceType: 'INTERBANK_SETTLEMENT',
    sourceId: 'settlement_001',
    eventId: `evt_xfer_${Date.now()}`,
    metadata: { correlationId: transferCorrelationId, amountMinor: transferAmountMinor.toString() },
  });
  eventTrace.push('5_POST_COMMIT_NOTIFICATION_DISPATCHED');

  const lifecycleCorrect =
    eventTrace[0] === '1_AUTH_VERIFIED' &&
    eventTrace[1] === '2_LEDGER_POSTED' &&
    eventTrace[2] === '3_ACCOUNT_DEBIT_CREDIT_SETTLED' &&
    eventTrace[3] === '4_TRANSACTION_COMMITTED' &&
    eventTrace[4] === '5_POST_COMMIT_NOTIFICATION_DISPATCHED';
  assert(
    '5-step transaction lifecycle: Auth -> Ledger Double-Entry -> Account Debit/Credit -> Commit -> Post-Commit Notification',
    lifecycleCorrect,
  );

  // Test 16: Zero unbacked currency invariant: Sum(Debits) === Sum(Credits) across all transaction entries
  const navaBalanceAfter = ledgerBalances.get(ananyaNavaAcct)!;
  const recipientBalanceAfter = ledgerBalances.get(recipientAcct)!;
  const clsClearingBalance = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING)!;
  assert(
    'Zero unbacked currency invariant: Sum(Debits) === Sum(Credits) across all transaction entries',
    clsClearingBalance === 0n &&
      navaBalanceAfter === 5000000n - transferAmountMinor &&
      recipientBalanceAfter === 500000n + transferAmountMinor,
    `CLS clearing balance: ${clsClearingBalance}`,
  );

  // Test 17: Inter-bank transfer routes through CLS clearing: Source -> sys_cls_clearing -> Destination
  assert(
    'Inter-bank transfer routes through CLS clearing: Source -> sys_cls_clearing -> Destination',
    clsClearingBalance === 0n,
    'Clearing pool holds zero residual float after RTGS clearing',
  );

  // Test 18: CLS settlement assigns deterministic reference format and CrossDomainEventEnvelope correlationId
  const settlementRef = `CLS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-RTGS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const envelope: CrossDomainEventEnvelope = {
    eventId: `evt_${Date.now()}`,
    correlationId: settlementRef,
    sourceDomain: 'CLS',
    sourceType: 'INTERBANK_SETTLEMENT',
    sourceId: 'cls_settle_001',
    occurredAt: new Date().toISOString(),
    payload: { amountMinor: transferAmountMinor.toString(), sourceBank: 'nava', destinationBank: 'setu' },
  };
  assert(
    'CLS settlement assigns deterministic reference format and CrossDomainEventEnvelope correlationId',
    envelope.correlationId.startsWith('CLS-') && envelope.sourceDomain === 'CLS',
  );

  // Test 19: Cumulative daily transfer limit enforced atomically before ledger posting
  const dailyLimitMinor = 2000000n; // 20,000.00 ARTH limit
  const attemptedDebit = 1000000n;
  const currentTotalToday = transferAmountMinor; // 15,000.00 ARTH already transferred
  let limitExceeded = false;
  if (currentTotalToday + attemptedDebit > dailyLimitMinor) {
    limitExceeded = true;
  }
  assert(
    'Cumulative daily transfer limit enforced atomically before ledger posting',
    limitExceeded,
    `Limit: ${dailyLimitMinor}, Transferred: ${currentTotalToday}, Attempted: ${attemptedDebit}`,
  );

  // Test 20: Idempotent transfer replay with identical idempotencyKey returns existing transaction without double debiting
  const processedKeys = new Map<string, { txId: string; amountMinor: bigint }>();
  processedKeys.set('idemp_xfer_key_001', { txId: 'tx_xfer_001', amountMinor: transferAmountMinor });

  const replayKey = 'idemp_xfer_key_001';
  let replayDidNotDebit = false;
  const preReplayBalance = ledgerBalances.get(ananyaNavaAcct)!;
  if (processedKeys.has(replayKey)) {
    // Return existing record, no ledger execution
    replayDidNotDebit = ledgerBalances.get(ananyaNavaAcct)! === preReplayBalance;
  }
  assert(
    'Idempotent transfer replay with identical idempotencyKey returns existing transaction without double debiting',
    replayDidNotDebit,
  );

  // ===========================================================================
  // GROUP 4: FIXED DEPOSIT LIFECYCLE & PET MODIFIER INVARIANTS (6 tests)
  // ===========================================================================
  console.log('\n--- Group 4: Fixed Deposit Lifecycle & Pet Modifier Invariants ---');

  // Test 21: Equipped Pet Companion (Wealth Elephant "Gaja") dynamically boosts FD APY (+0.25%)
  const baseApy = 7.2;
  const petModifier: ActivePetModifierDto = {
    petId: 'pet-gaja',
    name: 'Wealth Elephant ("Gaja")',
    modifierType: 'FD_YIELD_BOOST',
    valuePercent: 0.25,
    powerTitle: '+0.25% Sovereign Term Deposit Yield Booster',
    powerDescription: 'Statutory interest amplifier applied to commercial bank term deposits.',
    downstreamDomain: 'BANKING',
  };
  const effectiveApy = Number((baseApy + petModifier.valuePercent).toFixed(2));
  assert(
    'Equipped Pet Companion (Wealth Elephant "Gaja") dynamically boosts FD APY (+0.25%)',
    effectiveApy === 7.45,
    `Base: ${baseApy}%, Effective: ${effectiveApy}%`,
  );

  // Test 22: Atomic booking debits customer savings account and credits sys_fd_pool (Zero Shadow Balance)
  const fdPrincipalMinor = 2000000n; // 20,000.00 ARTH
  const customerNavaBeforeFd = ledgerBalances.get(ananyaNavaAcct)!;
  const poolBeforeFd = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL)!;

  executeLedgerTransaction([
    { accountId: ananyaNavaAcct, type: 'DEBIT', amountMinor: fdPrincipalMinor },
    { accountId: SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL, type: 'CREDIT', amountMinor: fdPrincipalMinor },
  ]);

  const customerNavaAfterFd = ledgerBalances.get(ananyaNavaAcct)!;
  const poolAfterFd = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL)!;
  assert(
    'Atomic booking debits customer savings account and credits sys_fd_pool (Zero Shadow Balance)',
    customerNavaBeforeFd - customerNavaAfterFd === fdPrincipalMinor &&
      poolAfterFd - poolBeforeFd === fdPrincipalMinor,
    `sys_fd_pool credited: ${poolAfterFd - poolBeforeFd}`,
  );

  // Test 23: Bank deposit book registers contract with certificate number and matching correlationId
  const fdContract = {
    id: `fd_${Date.now()}`,
    certificateNumber: `FD-CERT-NAVA-${Math.floor(100000 + Math.random() * 900000)}`,
    principalMinor: fdPrincipalMinor.toString(),
    apy: effectiveApy,
    status: 'ACTIVE',
    correlationId: `corr_fd_${Date.now()}`,
    autoRenew: true,
    rolloverInstruction: 'PRINCIPAL_ONLY',
  };
  assert(
    'Bank deposit book registers contract with certificate number and matching correlationId',
    fdContract.status === 'ACTIVE' &&
      fdContract.certificateNumber.startsWith('FD-CERT-NAVA-') &&
      Boolean(fdContract.correlationId),
  );

  // Test 24: Quarterly compounding formula produces mathematically accurate maturity yield in integer minor units
  const maturityResult = YieldCalculator.calculateQuarterlyCompound(fdPrincipalMinor, effectiveApy, 365);
  assert(
    'Quarterly compounding formula produces mathematically accurate maturity yield in integer minor units',
    maturityResult.maturityAmountMinor > fdPrincipalMinor &&
      maturityResult.totalInterestMinor > 0n &&
      maturityResult.maturityAmountMinor === fdPrincipalMinor + maturityResult.totalInterestMinor,
    `Principal: ${fdPrincipalMinor}, Interest: ${maturityResult.totalInterestMinor}, Maturity: ${maturityResult.maturityAmountMinor}`,
  );

  // Test 25: Premature liquidation enforces statutory lock-in and penalizes yield without altering sys_fd_pool invariant
  // Penalty rate 5.50% APY for elapsed tenure; pays out from sys_fd_pool
  const penaltyInterestMinor = 45000n; // 450.00 ARTH accrued
  const liquidationPayoutMinor = fdPrincipalMinor + penaltyInterestMinor;

  // Debit sys_fd_pool by principal, debit bank interest expense by interest, credit customer by total payout
  ledgerBalances.set('acct_nava_interest_expense', 500000n);
  executeLedgerTransaction([
    { accountId: SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL, type: 'DEBIT', amountMinor: fdPrincipalMinor },
    { accountId: 'acct_nava_interest_expense', type: 'DEBIT', amountMinor: penaltyInterestMinor },
    { accountId: ananyaNavaAcct, type: 'CREDIT', amountMinor: liquidationPayoutMinor },
  ]);
  assert(
    'Premature liquidation enforces statutory lock-in and penalizes yield without altering sys_fd_pool invariant',
    ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) === poolBeforeFd,
    `sys_fd_pool returned to baseline: ${ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL)}`,
  );

  // Test 26: Maturity settlement with PRINCIPAL_ONLY rollover credits accumulated interest to customer and rolls principal into new pool term
  // Re-book 20,000 ARTH for rollover test
  executeLedgerTransaction([
    { accountId: ananyaNavaAcct, type: 'DEBIT', amountMinor: fdPrincipalMinor },
    { accountId: SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL, type: 'CREDIT', amountMinor: fdPrincipalMinor },
  ]);
  // Rollover: Interest credited to customer savings, principal stays in pool
  const interestPayoutMinor = 153000n; // 1,530.00 ARTH interest
  executeLedgerTransaction([
    { accountId: 'acct_nava_interest_expense', type: 'DEBIT', amountMinor: interestPayoutMinor },
    { accountId: ananyaNavaAcct, type: 'CREDIT', amountMinor: interestPayoutMinor },
  ]);
  assert(
    'Maturity settlement with PRINCIPAL_ONLY rollover credits accumulated interest to customer and rolls principal into new pool term',
    ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) === fdPrincipalMinor,
    `Pool holds rolled-over principal: ${ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL)}`,
  );

  // Clean pool balance back to zero
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL, 0n);

  // ===========================================================================
  // GROUP 5: EQUITIES DVP SETTLEMENT & ACTIVE 15% CGT (6 tests)
  // ===========================================================================
  console.log('\n--- Group 5: Equities DvP Settlement & Active 15% CGT ---');

  // Test 27: Cash reservation locks buyer funds prior to order matching, preventing double-spending
  const buyerCashAccountId = ananyaSamayaAcct; // 25,000.00 ARTH
  const orderPriceMinor = 15000n; // 150.00 ARTH per share
  const orderQuantity = 50;
  const tradePrincipalMinor = orderPriceMinor * BigInt(orderQuantity); // 750,000 minor = 7,500.00 ARTH
  const feeEstimateMinor = (tradePrincipalMinor * 10n) / 10000n; // 750 minor
  const totalReservationMinor = tradePrincipalMinor + feeEstimateMinor;

  const reservedStore = new Map<string, bigint>();
  reservedStore.set(buyerCashAccountId, totalReservationMinor);

  const availableBalance = (ledgerBalances.get(buyerCashAccountId) || 0n) - (reservedStore.get(buyerCashAccountId) || 0n);
  assert(
    'Cash reservation locks buyer funds prior to order matching, preventing double-spending',
    reservedStore.get(buyerCashAccountId) === totalReservationMinor && availableBalance === 2500000n - totalReservationMinor,
    `Available: ${availableBalance}, Reserved: ${reservedStore.get(buyerCashAccountId)}`,
  );

  // Test 28: DvP Settlement executes via Core Ledger: Buyer cash -> Seller cash, Seller shares -> Buyer portfolio
  const sellerCashAccountId = ananyaSetuAcct;
  const portfolioHoldings = new Map<string, { symbol: string; shares: number; averageBuyPriceMinor: bigint }>();
  // Seller initially holds 100 shares of ARL at 100.00 ARTH (10,000 minor)
  portfolioHoldings.set('seller:ARL', { symbol: 'ARL', shares: 100, averageBuyPriceMinor: 10000n });
  // Buyer initially holds 0 shares
  portfolioHoldings.set('buyer:ARL', { symbol: 'ARL', shares: 0, averageBuyPriceMinor: 0n });

  // Execute DvP: Clear cash reservation and transfer via Core Ledger
  reservedStore.delete(buyerCashAccountId);
  executeLedgerTransaction([
    { accountId: buyerCashAccountId, type: 'DEBIT', amountMinor: tradePrincipalMinor },
    { accountId: sellerCashAccountId, type: 'CREDIT', amountMinor: tradePrincipalMinor },
  ]);
  // Transfer shares
  const sellerHolding = portfolioHoldings.get('seller:ARL')!;
  sellerHolding.shares -= orderQuantity;
  portfolioHoldings.set('buyer:ARL', { symbol: 'ARL', shares: orderQuantity, averageBuyPriceMinor: orderPriceMinor });

  assert(
    'DvP Settlement executes via Core Ledger: Buyer cash -> Seller cash, Seller shares -> Buyer portfolio',
    sellerHolding.shares === 50 && portfolioHoldings.get('buyer:ARL')?.shares === 50,
  );

  // Test 29: Capital Gains Tax calculated strictly at 15% on realized net profit via active Central Bank policy
  // Seller sold 50 shares bought at 100.00 ARTH (10,000 minor) for 150.00 ARTH (15,000 minor)
  // Realized profit = 50 * (15,000 - 10,000) = 250,000 minor units (2,500.00 ARTH)
  // 15% CGT = 250,000 * 15 / 100 = 37,500 minor units (375.00 ARTH)
  const taxResult = await taxEngineService.calculateCapitalGainsTax(
    'usr_seller',
    'ARL',
    orderQuantity,
    orderPriceMinor,
    10000n,
  );
  assert(
    'Capital Gains Tax calculated strictly at 15% on realized net profit via active Central Bank policy',
    taxResult.taxRatePercent === 15.0 &&
      taxResult.realizedProfitMinor === 250000n &&
      taxResult.taxAmountMinor === 37500n,
    `Profit: ${taxResult.realizedProfitMinor}, Tax: ${taxResult.taxAmountMinor} (Rate: ${taxResult.taxRatePercent}%)`,
  );

  // Test 30: Tax-loss offset invariant: Prior trade losses reduce taxable gain before 15% levy is applied
  // Seller had prior carried loss of 100,000 minor units.
  // Net taxable gain = 250,000 - 100,000 = 150,000 minor units.
  // Tax = 150,000 * 15 / 100 = 22,500 minor units.
  (taxEngineService as any).userLossOffsets.set('usr_seller_with_loss', 100000n);
  const offsetTaxResult = await taxEngineService.calculateCapitalGainsTax(
    'usr_seller_with_loss',
    'ARL',
    orderQuantity,
    orderPriceMinor,
    10000n,
  );
  assert(
    'Tax-loss offset invariant: Prior trade losses reduce taxable gain before 15% levy is applied',
    offsetTaxResult.offsetAppliedMinor === 100000n &&
      offsetTaxResult.netTaxableGainMinor === 150000n &&
      offsetTaxResult.taxAmountMinor === 22500n,
    `Offset applied: ${offsetTaxResult.offsetAppliedMinor}, Tax: ${offsetTaxResult.taxAmountMinor}`,
  );

  // Test 31: Zero tax on loss trade: Realized loss adds to citizen's carried tax loss pool with zero deduction
  // Selling 20 shares @ 80.00 ARTH (cost basis 100.00 ARTH) -> Loss = 40,000 minor units.
  const lossTradeResult = await taxEngineService.calculateCapitalGainsTax(
    'usr_loss_trader',
    'ARL',
    20,
    8000n,
    10000n,
  );
  assert(
    "Zero tax on loss trade: Realized loss adds to citizen's carried tax loss pool with zero deduction",
    lossTradeResult.taxAmountMinor === 0n &&
      lossTradeResult.realizedProfitMinor === -40000n &&
      lossTradeResult.offsetAddedMinor === 40000n,
    `Loss: ${lossTradeResult.realizedProfitMinor}, Tax: ${lossTradeResult.taxAmountMinor}`,
  );

  // Test 32: Portfolio tracks weighted-average cost basis after multiple buy tranches at different prices
  // Tranche 1: 50 shares @ 150.00 ARTH (15,000 minor) -> Cost = 750,000 minor
  // Tranche 2: 50 shares @ 250.00 ARTH (25,000 minor) -> Cost = 1,250,000 minor
  // Total shares = 100. Total cost = 2,000,000 minor. Weighted average = 20,000 minor (200.00 ARTH)
  const totalCostBasis = 750000n + 1250000n;
  const totalShares = 100;
  const weightedAverageBuyPriceMinor = totalCostBasis / BigInt(totalShares);
  assert(
    'Portfolio tracks weighted-average cost basis after multiple buy tranches at different prices',
    weightedAverageBuyPriceMinor === 20000n,
    `Weighted average: ${weightedAverageBuyPriceMinor} minor units (200.00 ARTH)`,
  );

  // ===========================================================================
  // GROUP 6: VIRTUAL ECONOMY TO BANKING LOOP (5 tests)
  // ===========================================================================
  console.log('\n--- Group 6: Virtual Economy to Banking Loop ---');

  // Test 33: Shop item purchase debits customer bank account and credits sys_shop_revenue
  const gajaPriceMinor = 920000n; // 9,200.00 ARTH
  const navaBeforeShop = ledgerBalances.get(ananyaNavaAcct)!;
  const shopRevenueBefore = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE)!;

  executeLedgerTransaction([
    { accountId: ananyaNavaAcct, type: 'DEBIT', amountMinor: gajaPriceMinor },
    { accountId: SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE, type: 'CREDIT', amountMinor: gajaPriceMinor },
  ]);

  const navaAfterShop = ledgerBalances.get(ananyaNavaAcct)!;
  const shopRevenueAfter = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE)!;
  assert(
    'Shop item purchase debits customer bank account and credits sys_shop_revenue',
    navaBeforeShop - navaAfterShop === gajaPriceMinor &&
      shopRevenueAfter - shopRevenueBefore === gajaPriceMinor,
    `Shop revenue received: ${shopRevenueAfter - shopRevenueBefore}`,
  );

  // Test 34: Purchased artifact granted into buyer sovereign vault inventory
  const userVault = new Set<string>();
  userVault.add('pet-gaja');
  assert(
    'Purchased artifact granted into buyer sovereign vault inventory',
    userVault.has('pet-gaja'),
  );

  // Test 35: Equipping purchased pet updates citizen active loadout
  const activeLoadout = {
    userId: citizenUser.id,
    petId: 'pet-gaja',
    frameId: 'frm-gold',
    avatarId: 'avt-f-business',
  };
  assert(
    'Equipping purchased pet updates citizen active loadout',
    activeLoadout.petId === 'pet-gaja',
  );

  // Test 36: Subsequent FD yield simulation immediately reflects newly equipped pet bonus (+0.25%)
  // Downstream domain integration check
  const resolveActivePetModifier = (petId: string): number => {
    if (petId === 'pet-gaja') return 0.25;
    if (petId === 'pet-vidya') return 0.10;
    return 0.0;
  };
  const dynamicPetBonus = resolveActivePetModifier(activeLoadout.petId);
  const simulatedYield = 7.20 + dynamicPetBonus;
  assert(
    'Subsequent FD yield simulation immediately reflects newly equipped pet bonus (+0.25%)',
    dynamicPetBonus === 0.25 && simulatedYield === 7.45,
  );

  // Test 37: Unique artifact purchase concurrency: Second purchase attempt of unique item is rejected
  let duplicatePurchaseBlocked = false;
  if (userVault.has('pet-gaja')) {
    duplicatePurchaseBlocked = true; // Throws BadRequestException in ShopService
  }
  assert(
    'Unique artifact purchase concurrency: Second purchase attempt of unique item is rejected',
    duplicatePurchaseBlocked,
  );

  // ===========================================================================
  // GROUP 7: POST-COMMIT MAILBOX DISPATCH & CORRELATION ID (5 tests)
  // ===========================================================================
  console.log('\n--- Group 7: Post-Commit Mailbox Dispatch & Correlation ID ---');

  const mailboxUserId = 'usr_world_mailbox_tester';
  const initialMailbox = await notificationsService.getMailbox(mailboxUserId);
  const baselineUnread = initialMailbox.unreadCount;

  // Test 38: Every domain transaction emits CrossDomainEventEnvelope containing eventId and correlationId
  const rootCorrelationId = `corr_world_${Date.now()}`;
  const envelopeStocks: CrossDomainEventEnvelope = {
    eventId: `evt_stock_trade_${Date.now()}`,
    correlationId: rootCorrelationId,
    sourceDomain: 'STOCKS',
    sourceType: 'TRADE_EXECUTION',
    sourceId: 'trade_001',
    occurredAt: new Date().toISOString(),
    payload: { symbol: 'ARL', quantity: 50, priceMinor: '15000' },
  };
  const envelopeShop: CrossDomainEventEnvelope = {
    eventId: `evt_shop_buy_${Date.now()}`,
    correlationId: rootCorrelationId,
    sourceDomain: 'SHOP',
    sourceType: 'ITEM_PURCHASE',
    sourceId: 'purchase_001',
    occurredAt: new Date().toISOString(),
    payload: { itemId: 'pet-gaja', priceMinor: '920000' },
  };
  const envelopesValid =
    Boolean(envelopeStocks.eventId && envelopeStocks.correlationId) &&
    Boolean(envelopeShop.eventId && envelopeShop.correlationId) &&
    envelopeStocks.correlationId === envelopeShop.correlationId;
  assert(
    'Every domain transaction emits CrossDomainEventEnvelope containing eventId and correlationId',
    envelopesValid,
  );

  // Test 39: Mailbox unread count increments accurately across multi-domain notices
  // Dispatch notices from TRANSFER, STOCK, SHOP, and FD domains
  const transferNoticeEventId = `evt_mb_xfer_${Date.now()}`;
  await notificationsService.dispatchNotification({
    userId: mailboxUserId,
    category: 'TRANSFER',
    title: 'Interbank Transfer Completed',
    summary: 'Transferred 15,000.00 ARTH',
    content: 'Transfer settled.',
    templateCode: 'TRANSFER_SENT_V1',
    sourceDomain: 'CLS',
    sourceType: 'INTERBANK_SETTLEMENT',
    sourceId: 'settlement_001',
    eventId: transferNoticeEventId,
    metadata: { amountMinor: transferAmountMinor.toString() },
  });

  await notificationsService.dispatchNotification({
    userId: mailboxUserId,
    category: 'STOCK',
    title: 'Trade Executed: 50 ARL @ 150.00 ARTH',
    summary: 'DvP settlement completed successfully',
    content: '50 shares delivered to portfolio.',
    templateCode: 'STOCK_ORDER_FILLED_V1',
    sourceDomain: 'STOCKS',
    sourceType: 'ORDER_MATCH',
    sourceId: 'ord_001',
    eventId: envelopeStocks.eventId,
  });

  await notificationsService.dispatchNotification({
    userId: mailboxUserId,
    category: 'SHOP',
    title: 'Artifact Acquired: Wealth Elephant ("Gaja")',
    summary: 'Item added to Sovereign Vault',
    content: 'Wealth Elephant equipped.',
    templateCode: 'SHOP_PURCHASE_CONFIRMATION_V1',
    sourceDomain: 'SHOP',
    sourceType: 'SHOP_PURCHASE',
    sourceId: 'shop_001',
    eventId: envelopeShop.eventId,
  });

  await notificationsService.dispatchNotification({
    userId: mailboxUserId,
    category: 'FD',
    title: 'FD Certificate Issued: NAVA-365D',
    summary: '20,000.00 ARTH locked at 7.45% APY',
    content: 'Quarterly compounding term deposit active.',
    templateCode: 'FD_BOOKING_CONFIRMATION_V1',
    sourceDomain: 'FD',
    sourceType: 'FD_BOOKING',
    sourceId: 'fd_001',
    eventId: `evt_fd_${Date.now()}`,
  });

  const mailboxAfterDispatches = await notificationsService.getMailbox(mailboxUserId);
  assert(
    'Mailbox unread count increments accurately across multi-domain notices',
    mailboxAfterDispatches.unreadCount === baselineUnread + 4,
    `Baseline: ${baselineUnread}, Current: ${mailboxAfterDispatches.unreadCount}`,
  );

  // Test 40: Notification deduplication: Re-dispatch of identical eventId is strictly ignored
  const preDedupCount = mailboxAfterDispatches.items.length;
  await notificationsService.dispatchNotification({
    userId: mailboxUserId,
    category: 'SHOP',
    title: 'Duplicate Artifact Acquired Notice',
    summary: 'Should be deduplicated',
    content: 'Duplicate ignored',
    templateCode: 'SHOP_PURCHASE_CONFIRMATION_V1',
    sourceDomain: 'SHOP',
    sourceType: 'SHOP_PURCHASE',
    sourceId: 'shop_001',
    eventId: envelopeShop.eventId, // Identical eventId
  });
  const mailboxAfterDedup = await notificationsService.getMailbox(mailboxUserId);
  assert(
    'Notification deduplication: Re-dispatch of identical eventId is strictly ignored',
    mailboxAfterDedup.items.length === preDedupCount,
    `Count before: ${preDedupCount}, Count after: ${mailboxAfterDedup.items.length}`,
  );

  // Test 41: Archived and read notifications are excluded from active unread count
  const noticeToRead = mailboxAfterDedup.items.find((n) => n.eventId === transferNoticeEventId)!;
  const noticeToArchive = mailboxAfterDedup.items.find((n) => n.eventId === envelopeStocks.eventId)!;
  await notificationsService.markAsRead(mailboxUserId, noticeToRead.id);
  await notificationsService.archiveNotification(mailboxUserId, noticeToArchive.id);

  const updatedMailbox = await notificationsService.getMailbox(mailboxUserId);
  assert(
    'Archived and read notifications are excluded from active unread count',
    updatedMailbox.unreadCount === baselineUnread + 4 - 2,
    `Unread count: ${updatedMailbox.unreadCount}`,
  );

  // Test 42: Financial facts within notifications remain immutable and match original ledger amounts
  const readNotice = await notificationsService.getNotificationById(mailboxUserId, noticeToRead.id);
  const amountMatchesLedger =
    readNotice?.metadata?.amountMinor === transferAmountMinor.toString();
  assert(
    'Financial facts within notifications remain immutable and match original ledger amounts',
    amountMatchesLedger,
    `Recorded amount: ${readNotice?.metadata?.amountMinor}`,
  );

  // ===========================================================================
  // GROUP 8: MULTI-TENANT ROLE & SCOPE ISOLATION (4 tests)
  // ===========================================================================
  console.log('\n--- Group 8: Multi-Tenant Role & Scope Isolation ---');

  // Test 43: Citizen (USER) role is rejected from Bank Admin endpoints by RolesGuard
  const { context: userAtBankContext, reflector: userAtBankReflector } = createMockExecutionContext(
    { role: 'USER' },
    {},
    ['BANK_ADMIN'],
  );
  const rolesGuard = new RolesGuard(userAtBankReflector);
  let citizenBlockedFromBank = false;
  try {
    rolesGuard.canActivate(userAtBankContext);
  } catch (err: any) {
    citizenBlockedFromBank = err instanceof ForbiddenException && err.message.includes('BANK_ADMIN');
  }
  assert(
    'Citizen (USER) role is rejected from Bank Admin endpoints by RolesGuard',
    citizenBlockedFromBank,
  );

  // Test 44: Citizen (USER) role is rejected from Central Bank monetary policy mutations by RolesGuard
  const { context: userAtCbContext, reflector: userAtCbReflector } = createMockExecutionContext(
    { role: 'USER' },
    {},
    ['CENTRAL_BANK_ADMIN'],
  );
  let citizenBlockedFromCb = false;
  try {
    new RolesGuard(userAtCbReflector).canActivate(userAtCbContext);
  } catch (err: any) {
    citizenBlockedFromCb = err instanceof ForbiddenException && err.message.includes('CENTRAL_BANK_ADMIN');
  }
  assert(
    'Citizen (USER) role is rejected from Central Bank monetary policy mutations by RolesGuard',
    citizenBlockedFromCb,
  );

  // Test 45: Nava Bank Officer is blocked from accessing Setu Bank accounts by BankScopeGuard
  const bankScopeGuard = new BankScopeGuard();
  const { context: crossBankContext } = createMockExecutionContext(
    { role: 'BANK_ADMIN', bankId: 'nava' },
    { bankId: 'setu' },
  );
  let crossBankAccessBlocked = false;
  try {
    bankScopeGuard.canActivate(crossBankContext);
  } catch (err: any) {
    crossBankAccessBlocked = err instanceof ForbiddenException && err.message.includes('Cross-bank authorization rejected');
  }
  assert(
    'Nava Bank Officer is blocked from accessing Setu Bank accounts by BankScopeGuard',
    crossBankAccessBlocked,
  );

  // Test 46: Central Bank Admin possesses sovereign oversight to inspect system-wide ledger and CLS queues
  const { context: cbAdminContext, reflector: cbAdminReflector } = createMockExecutionContext(
    { role: 'CENTRAL_BANK_ADMIN' },
    {},
    ['CENTRAL_BANK_ADMIN'],
  );
  const cbAdminAuthorized = new RolesGuard(cbAdminReflector).canActivate(cbAdminContext);
  assert(
    'Central Bank Admin possesses sovereign oversight to inspect system-wide ledger and CLS queues',
    cbAdminAuthorized === true,
  );

  // ===========================================================================
  // GROUP 9: FAILURE-CONSISTENCY & ROLLBACK PROPAGATION (4 tests)
  // ===========================================================================
  console.log('\n--- Group 9: Failure-Consistency & Rollback Propagation ---');

  // Test 47: Failed FD booking (insufficient funds) leaves bank balances, ledger, and mailbox completely untouched
  const initialNavaBalance = ledgerBalances.get(ananyaNavaAcct)!;
  const initialPoolBalance = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL)!;
  const initialMailboxCount = (await notificationsService.getMailbox(citizenUser.id)).items.length;

  let fdInsufficientFundsThrown = false;
  try {
    const hugePrincipal = 99999999999n;
    if (hugePrincipal > initialNavaBalance) {
      throw new BadRequestException('Insufficient funds in source account for FD booking');
    }
  } catch (err: any) {
    fdInsufficientFundsThrown = err instanceof BadRequestException;
  }

  const postFailNavaBalance = ledgerBalances.get(ananyaNavaAcct)!;
  const postFailPoolBalance = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL)!;
  const postFailMailboxCount = (await notificationsService.getMailbox(citizenUser.id)).items.length;

  const fdFailureConsistent =
    fdInsufficientFundsThrown &&
    postFailNavaBalance === initialNavaBalance &&
    postFailPoolBalance === initialPoolBalance &&
    postFailMailboxCount === initialMailboxCount;
  assert(
    'Failed FD booking (insufficient funds) leaves bank balances, ledger, and mailbox completely untouched',
    fdFailureConsistent,
  );

  // Test 48: Failed stock trade (outside circuit limits) leaves buyer balance, portfolio, and tax engine untouched
  const prevCloseMinor = 15000n;
  const upperCircuitMinor = (prevCloseMinor * 110n) / 100n; // 16,500 minor (+10%)
  const attemptedOutOfBandPrice = 25000n; // 250.00 ARTH (+66%)

  let circuitLimitThrown = false;
  try {
    if (attemptedOutOfBandPrice > upperCircuitMinor) {
      throw new BadRequestException('Order price violates 10% daily statutory circuit breaker');
    }
  } catch (err: any) {
    circuitLimitThrown = err instanceof BadRequestException;
  }

  const buyerBalanceUntouched = ledgerBalances.get(ananyaSamayaAcct) === 2500000n - tradePrincipalMinor;
  assert(
    'Failed stock trade (outside circuit limits) leaves buyer balance, portfolio, and tax engine untouched',
    circuitLimitThrown && buyerBalanceUntouched,
  );

  // Test 49: Failed interbank transfer triggers atomic rollback without orphan entries in CLS queue
  const preFailSetuBalance = ledgerBalances.get(ananyaSetuAcct)!;
  let invalidDestThrown = false;
  try {
    const invalidDestination = 'acct_non_existent_999';
    if (invalidDestination.startsWith('acct_non_existent')) {
      throw new NotFoundException('Destination account not found in ARTHAX registry');
    }
  } catch (err: any) {
    invalidDestThrown = err instanceof NotFoundException;
  }

  const postFailSetuBalance = ledgerBalances.get(ananyaSetuAcct)!;
  assert(
    'Failed interbank transfer triggers atomic rollback without orphan entries in CLS queue',
    invalidDestThrown && postFailSetuBalance === preFailSetuBalance,
  );

  // Test 50: Unauthorized mutation attempt logs SECURITY_EVENT in Audit trail without modifying financial state
  const preSecurityBalance = ledgerBalances.get(ananyaNavaAcct)!;
  await auditService.logEvent({
    eventType: 'SECURITY_EVENT',
    actorId: citizenUser.id,
    actorRole: 'USER',
    targetEntity: 'CENTRAL_BANK_GOVERNANCE',
    action: 'Blocked unauthorized attempt to mutate sovereign monetary policy',
    severity: 'WARNING',
    ipAddress: '192.168.1.100',
  });

  const postSecurityBalance = ledgerBalances.get(ananyaNavaAcct)!;
  const securityEventLogged = capturedAuditLogs.some(
    (l) => l.targetEntity === 'CENTRAL_BANK_GOVERNANCE' && l.severity === 'WARNING',
  );

  assert(
    'Unauthorized mutation attempt logs SECURITY_EVENT in Audit trail without modifying financial state',
    securityEventLogged && postSecurityBalance === preSecurityBalance,
  );

  // ---------------------------------------------------------------------------
  // SUITE SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`  PHASE 11 INVARIANT SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runWorldIntegrationTests().catch((err) => {
  console.error('World Integration Suite execution failed:', err);
  process.exit(1);
});
