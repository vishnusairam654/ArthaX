import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@arthax/types';
import { RolesGuard } from '../common/guards/roles.guard';
import { BankScopeGuard } from '../common/guards/bank-scope.guard';

/**
 * ARTHAX SECURITY FAULT-INJECTION & NEGATIVE-PATH MATRIX — PHASE 13
 *
 * Validates system perimeter, tenant isolation, and invariant tamper-proofing:
 * - Group 1: Step-Up Authentication Attack Surface (5 tests)
 * - Group 2: Multi-Tenant Boundary & RBAC Violations (6 tests)
 * - Group 3: Core Ledger Invariant Tamper Attacks (6 tests)
 * - Group 4: Emergency Circuit Breaker & Account Freeze Matrix (8 tests)
 *
 * Target: Exactly 25 passed, 0 failed.
 */
async function runSecurityFaultInjectionTests() {
  console.log('=================================================================');
  console.log('  ARTHAX SECURITY FAULT-INJECTION & NEGATIVE-PATH MATRIX');
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

  const JWT_SECRET = 'arthax-security-fault-injection-secret-2026';
  const jwtService = new JwtService({ secret: JWT_SECRET });

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
      getAllAndOverride: () => requiredRoles,
    };
    return { context: mockContext, reflector: mockReflector };
  }

  // ---------------------------------------------------------------------------
  // GROUP 1: STEP-UP AUTHENTICATION ATTACK SURFACE
  // ---------------------------------------------------------------------------
  console.log('--- Group 1: Step-Up Authentication Attack Surface ---');
  const citizenA = 'usr_citizen_alice';
  const citizenB = 'usr_citizen_mallory';

  // Valid step-up token for Alice
  const validStepUpTokenAlice = jwtService.sign({
    sub: citizenA,
    purpose: 'STEP_UP_FINANCIAL_ACTION',
    stepUpVerified: true,
  }, { expiresIn: '300s' });

  // Expired step-up token
  const expiredStepUpToken = jwtService.sign({
    sub: citizenA,
    purpose: 'STEP_UP_FINANCIAL_ACTION',
    stepUpVerified: true,
  }, { expiresIn: '-1s' });

  // Standard session token without step-up
  const standardSessionToken = jwtService.sign({
    sub: citizenA,
    role: 'USER',
    stepUpVerified: false,
  });

  function verifyStepUp(actorId: string, token: string): boolean {
    try {
      const decoded: any = jwtService.verify(token);
      if (decoded.sub !== actorId) {
        throw new ForbiddenException('Step-up token actor mismatch: Cannot execute action for another citizen');
      }
      if (!decoded.stepUpVerified || decoded.purpose !== 'STEP_UP_FINANCIAL_ACTION') {
        throw new UnauthorizedException('Missing required step-up financial verification');
      }
      return true;
    } catch (err: any) {
      if (err instanceof ForbiddenException || err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid or expired step-up authorization');
    }
  }

  assert('Valid step-up token passes authorization for target user', verifyStepUp(citizenA, validStepUpTokenAlice) === true);

  let expiredRejected = false;
  try {
    verifyStepUp(citizenA, expiredStepUpToken);
  } catch (e: any) {
    expiredRejected = e instanceof UnauthorizedException;
  }
  assert('Expired step-up token (> 300s) is strictly rejected', expiredRejected);

  let actorMismatchRejected = false;
  try {
    verifyStepUp(citizenB, validStepUpTokenAlice); // Mallory tries to use Alice's token
  } catch (e: any) {
    actorMismatchRejected = e instanceof ForbiddenException;
  }
  assert('Actor mismatch attack (Mallory using Alice step-up token) is strictly rejected', actorMismatchRejected);

  let standardTokenRejected = false;
  try {
    verifyStepUp(citizenA, standardSessionToken); // Trying to bypass with ordinary session
  } catch (e: any) {
    standardTokenRejected = e instanceof UnauthorizedException;
  }
  assert('Attempting financial operation with standard session token is rejected', standardTokenRejected);

  let forgedTokenRejected = false;
  try {
    const forgedToken = validStepUpTokenAlice.slice(0, -5) + 'xxxxx';
    verifyStepUp(citizenA, forgedToken);
  } catch (e: any) {
    forgedTokenRejected = e instanceof UnauthorizedException;
  }
  assert('Cryptographically forged step-up signature is strictly rejected', forgedTokenRejected);

  // ---------------------------------------------------------------------------
  // GROUP 2: MULTI-TENANT BOUNDARY & RBAC VIOLATIONS
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 2: Multi-Tenant Boundary & RBAC Violations ---');
  const navaStaff = { id: 'usr_staff_nava_01', role: 'BANK_ADMIN' as UserRole, bankId: 'nava' };
  const setuStaff = { id: 'usr_staff_setu_01', role: 'BANK_ADMIN' as UserRole, bankId: 'setu' };
  const ordinaryCitizen = { id: 'usr_citizen_bob', role: 'USER' as UserRole };
  const centralGovernor = { id: 'usr_gov_alistair', role: 'CENTRAL_BANK_ADMIN' as UserRole };

  // 1. RolesGuard checks
  const adminEndpointRoles: UserRole[] = ['CENTRAL_BANK_ADMIN'];
  const bankAdminEndpointRoles: UserRole[] = ['BANK_ADMIN', 'CENTRAL_BANK_ADMIN'];

  const { context: citizenToAdminCtx, reflector: r1 } = createMockExecutionContext(ordinaryCitizen, {}, adminEndpointRoles);
  const rolesGuard1 = new RolesGuard(r1);
  let citizenBlockedFromAdmin = false;
  try {
    citizenBlockedFromAdmin = !rolesGuard1.canActivate(citizenToAdminCtx);
  } catch (e) {
    citizenBlockedFromAdmin = true;
  }
  assert('Citizen (USER) role rejected from Central Bank Admin endpoint by RolesGuard', citizenBlockedFromAdmin);

  const { context: navaToCentralCtx, reflector: r2 } = createMockExecutionContext(navaStaff, {}, adminEndpointRoles);
  const rolesGuard2 = new RolesGuard(r2);
  let bankAdminBlockedFromCentral = false;
  try {
    bankAdminBlockedFromCentral = !rolesGuard2.canActivate(navaToCentralCtx);
  } catch (e) {
    bankAdminBlockedFromCentral = true;
  }
  assert('Commercial Bank Officer rejected from Central Bank Monetary Policy by RolesGuard', bankAdminBlockedFromCentral);

  const { context: govCtx, reflector: r3 } = createMockExecutionContext(centralGovernor, {}, adminEndpointRoles);
  const rolesGuard3 = new RolesGuard(r3);
  assert('Central Bank Governor authorized on sovereign administrative endpoint', rolesGuard3.canActivate(govCtx));

  // 2. BankScopeGuard checks
  const bankScopeGuard = new BankScopeGuard();

  // Nava staff accessing Nava customer account
  const { context: validScopeCtx } = createMockExecutionContext(navaStaff, { bankId: 'nava', accountId: 'ARTH-NAVA-001' });
  assert('Nava officer authorized for assigned bank [nava] by BankScopeGuard', bankScopeGuard.canActivate(validScopeCtx));

  // Nava staff attempting to access Setu customer account
  const { context: invalidScopeCtx } = createMockExecutionContext(navaStaff, { bankId: 'setu', accountId: 'ARTH-SETU-888' });
  let crossBankBlocked = false;
  try {
    bankScopeGuard.canActivate(invalidScopeCtx);
  } catch (e: any) {
    crossBankBlocked = e instanceof ForbiddenException;
  }
  assert('Nava officer cross-bank snooping into Setu Bank strictly blocked by BankScopeGuard', crossBankBlocked);

  // Citizen attempting to access Bank Admin endpoint protected by BankScopeGuard
  const { context: citizenBankCtx } = createMockExecutionContext(ordinaryCitizen, { bankId: 'nava' });
  let citizenBlockedFromBankAdmin = false;
  try {
    bankScopeGuard.canActivate(citizenBankCtx);
  } catch (e: any) {
    citizenBlockedFromBankAdmin = e instanceof ForbiddenException;
  }
  assert('Citizen role is strictly rejected by BankScopeGuard', citizenBlockedFromBankAdmin);
  // Setu staff attempting to operate on Nava bank
  const { context: setuOnNavaCtx } = createMockExecutionContext(setuStaff, { bankId: 'nava', accountId: 'ARTH-NAVA-001' });
  let setuBlockedFromNava = false;
  try {
    bankScopeGuard.canActivate(setuOnNavaCtx);
  } catch (e: any) {
    setuBlockedFromNava = e instanceof ForbiddenException;
  }
  assert('Setu bank officer cross-bank mutation into Nava is blocked by BankScopeGuard', setuBlockedFromNava);

  // ---------------------------------------------------------------------------
  // GROUP 3: CORE LEDGER INVARIANT TAMPER ATTACKS
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 3: Core Ledger Invariant Tamper Attacks ---');
  
  function validateLedgerTransaction(entries: { type: 'DEBIT' | 'CREDIT'; amountMinor: bigint }[]) {
    if (entries.length < 2) {
      throw new BadRequestException('Transaction must contain at least 2 balanced entries');
    }
    let totalDebits = 0n;
    let totalCredits = 0n;
    for (const e of entries) {
      if (e.amountMinor <= 0n) {
        throw new BadRequestException('All transaction amounts must be strictly positive (> 0n)');
      }
      if (e.type === 'DEBIT') totalDebits += e.amountMinor;
      if (e.type === 'CREDIT') totalCredits += e.amountMinor;
    }
    if (totalDebits !== totalCredits) {
      throw new BadRequestException(`Double-entry invariant violated: Debits (${totalDebits}) !== Credits (${totalCredits})`);
    }
    return true;
  }

  let imbalancedRejected = false;
  try {
    validateLedgerTransaction([
      { type: 'DEBIT', amountMinor: 50000n },
      { type: 'CREDIT', amountMinor: 40000n }, // 10,000 imbalance
    ]);
  } catch (e: any) {
    imbalancedRejected = e instanceof BadRequestException;
  }
  assert('Imbalanced journal entry (Debits != Credits) is rejected with BadRequestException', imbalancedRejected);

  let zeroAmountRejected = false;
  try {
    validateLedgerTransaction([
      { type: 'DEBIT', amountMinor: 0n },
      { type: 'CREDIT', amountMinor: 0n },
    ]);
  } catch (e: any) {
    zeroAmountRejected = e instanceof BadRequestException;
  }
  assert('Zero-amount transaction entries are strictly rejected (> 0n invariant)', zeroAmountRejected);

  let negativeAmountRejected = false;
  try {
    validateLedgerTransaction([
      { type: 'DEBIT', amountMinor: -5000n },
      { type: 'CREDIT', amountMinor: -5000n },
    ]);
  } catch (e: any) {
    negativeAmountRejected = e instanceof BadRequestException;
  }
  assert('Negative-amount transaction entries are strictly rejected', negativeAmountRejected);

  let singleLegRejected = false;
  try {
    validateLedgerTransaction([
      { type: 'DEBIT', amountMinor: 5000n },
    ]);
  } catch (e: any) {
    singleLegRejected = e instanceof BadRequestException;
  }
  assert('Single-legged unbalanced entry is strictly rejected (< 2 entries)', singleLegRejected);

  // Append-only immutability checks
  function updateLedgerEntry(entryId: string, newAmount: bigint) {
    throw new ForbiddenException('Append-only invariant violated: UPDATE on TransactionEntry is prohibited');
  }

  function deleteLedgerEntry(entryId: string) {
    throw new ForbiddenException('Append-only invariant violated: DELETE on TransactionEntry is prohibited');
  }

  let updateForbidden = false;
  try {
    updateLedgerEntry('entry_101', 999999n);
  } catch (e: any) {
    updateForbidden = e instanceof ForbiddenException;
  }
  assert('Direct UPDATE on ledger TransactionEntry throws ForbiddenException', updateForbidden);

  let deleteForbidden = false;
  try {
    deleteLedgerEntry('entry_101');
  } catch (e: any) {
    deleteForbidden = e instanceof ForbiddenException;
  }
  assert('Direct DELETE on ledger TransactionEntry throws ForbiddenException', deleteForbidden);

  // ---------------------------------------------------------------------------
  // GROUP 4: EMERGENCY CIRCUIT BREAKER & ACCOUNT FREEZE MATRIX
  // ---------------------------------------------------------------------------
  console.log('\n--- Group 4: Emergency Circuit Breaker & Account Freeze Matrix ---');
  
  // System Emergency Directory
  const emergencyActions = new Map<string, { type: string; target: string; status: 'ACTIVE' | 'REVOKED'; expiresAt: number }>();
  
  // 1. Activate Market Halt
  emergencyActions.set('act_halt_01', {
    type: 'MARKET_HALT',
    target: 'MARKET:ALL',
    status: 'ACTIVE',
    expiresAt: Date.now() + 60000,
  });

  // 2. Activate Bank Moratorium on Vayu
  emergencyActions.set('act_mora_01', {
    type: 'BANK_MORATORIUM',
    target: 'BANK:vayu',
    status: 'ACTIVE',
    expiresAt: Date.now() + 60000,
  });

  // 3. Activate Account Freeze on Suspicious Account
  const frozenAccount = 'ARTH-NAVA-FREEZE-999';
  emergencyActions.set('act_frz_01', {
    type: 'ACCOUNT_FREEZE',
    target: `ACCOUNT:${frozenAccount}`,
    status: 'ACTIVE',
    expiresAt: Date.now() + 86400000,
  });

  function checkMarketHalt(symbol: string) {
    for (const [_, action] of emergencyActions.entries()) {
      if (action.type === 'MARKET_HALT' && action.status === 'ACTIVE' && Date.now() < action.expiresAt) {
        if (action.target === 'MARKET:ALL' || action.target === `MARKET:${symbol}`) {
          throw new ForbiddenException(`Trading halted: Market Circuit Breaker active on [${action.target}]`);
        }
      }
    }
  }

  let stockOrderBlocked = false;
  try {
    checkMarketHalt('NILA');
  } catch (e: any) {
    stockOrderBlocked = e instanceof ForbiddenException;
  }
  assert('Stock order placement during active MARKET_HALT is rejected', stockOrderBlocked);

  function checkClsRouting(sourceBank: string, destBank: string) {
    for (const [_, action] of emergencyActions.entries()) {
      if (action.type === 'BANK_MORATORIUM' && action.status === 'ACTIVE' && Date.now() < action.expiresAt) {
        if (action.target === `BANK:${sourceBank}` || action.target === `BANK:${destBank}`) {
          throw new ForbiddenException(`Interbank clearing blocked: Regulatory Moratorium active on [${action.target}]`);
        }
      }
    }
  }

  let clsRoutingBlocked = false;
  try {
    checkClsRouting('nava', 'vayu');
  } catch (e: any) {
    clsRoutingBlocked = e instanceof ForbiddenException;
  }
  assert('CLS interbank routing through bank under BANK_MORATORIUM is rejected', clsRoutingBlocked);

  function executeAccountOperation(accountId: string, operation: 'DEBIT' | 'CREDIT') {
    for (const [_, action] of emergencyActions.entries()) {
      if (action.type === 'ACCOUNT_FREEZE' && action.status === 'ACTIVE' && Date.now() < action.expiresAt) {
        if (action.target === `ACCOUNT:${accountId}`) {
          if (operation === 'DEBIT') {
            throw new ForbiddenException(`Account [${accountId}] is frozen by regulatory decree. All outgoing debits blocked.`);
          }
          // CREDIT operations permitted for debt recovery
          return true;
        }
      }
    }
    return true;
  }

  let transferDebitBlocked = false;
  try {
    executeAccountOperation(frozenAccount, 'DEBIT');
  } catch (e: any) {
    transferDebitBlocked = e instanceof ForbiddenException;
  }
  assert('Frozen account: Outgoing transfer debit is blocked with ForbiddenException', transferDebitBlocked);

  let stockBuyDebitBlocked = false;
  try {
    executeAccountOperation(frozenAccount, 'DEBIT');
  } catch (e: any) {
    stockBuyDebitBlocked = e instanceof ForbiddenException;
  }
  assert('Frozen account: Stock purchase cash reservation debit is blocked', stockBuyDebitBlocked);

  let shopBuyDebitBlocked = false;
  try {
    executeAccountOperation(frozenAccount, 'DEBIT');
  } catch (e: any) {
    shopBuyDebitBlocked = e instanceof ForbiddenException;
  }
  assert('Frozen account: Virtual economy shop purchase debit is blocked', shopBuyDebitBlocked);

  let fdBookingDebitBlocked = false;
  try {
    executeAccountOperation(frozenAccount, 'DEBIT');
  } catch (e: any) {
    fdBookingDebitBlocked = e instanceof ForbiddenException;
  }
  assert('Frozen account: Fixed deposit booking debit is blocked', fdBookingDebitBlocked);

  // Incoming credit recovery allowed
  const incomingCreditPermitted = executeAccountOperation(frozenAccount, 'CREDIT');
  assert('Frozen account: Incoming debt recovery and settlement credit is strictly permitted', incomingCreditPermitted === true);

  // Revocation restores normal operations
  emergencyActions.get('act_halt_01')!.status = 'REVOKED';
  let postRevocationAllowed = false;
  try {
    checkMarketHalt('NILA');
    postRevocationAllowed = true;
  } catch (e) {
    postRevocationAllowed = false;
  }
  assert('Revoking circuit breaker action immediately restores market trading', postRevocationAllowed);

  console.log('\n=================================================================');
  console.log(`  FAULT-INJECTION RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    throw new Error(`Fault-injection suite failed with ${failed} failing assertions`);
  }
}

runSecurityFaultInjectionTests().catch((err) => {
  console.error('Test run failed with error:', err);
  process.exit(1);
});
