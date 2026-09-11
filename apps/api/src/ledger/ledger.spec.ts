import { BadRequestException, ConflictException, ForbiddenException, ServiceUnavailableException } from '@nestjs/common';
import {
  assertDoubleEntryBalance,
  assertNonNegativeBalance,
  toMinorUnits,
  fromMinorUnits,
  PostEntryInstruction,
} from './ledger-invariants';
import { LedgerStateMachine } from './ledger-state-machine';
import { LedgerService } from './ledger.service';
import { BalanceEngineService } from './balance-engine.service';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';

/**
 * ARTHAX Phase 4: Core Ledger Invariant Verification Suite
 */
async function runLedgerTests() {
  console.log('=================================================================');
  console.log('  ARTHAX CORE LEDGER — PHASE 4 INVARIANT VERIFICATION SUITE');
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
  // TEST GROUP 1: Double-Entry Mathematical Invariants (1 ARTH = 100 minor units)
  // ---------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Double-Entry Math Invariants ---');

  // Test 1.1: Minor unit math conversions
  assert(
    '1 ARTH = 100 minor units conversion',
    toMinorUnits('1.00') === 100n && toMinorUnits('142.50') === 14250n,
  );
  assert(
    'Formatting minor units to decimal string',
    fromMinorUnits(14250n) === '142.50' && fromMinorUnits(50n) === '0.50',
  );

  // Test 1.2: Balanced entries pass
  const balancedEntries: PostEntryInstruction[] = [
    { ledgerAccountId: 'acct_alice', entryType: 'DEBIT', amountMinor: 5000n },
    { ledgerAccountId: 'acct_bob', entryType: 'CREDIT', amountMinor: 4500n },
    { ledgerAccountId: 'acct_fee_pool', entryType: 'CREDIT', amountMinor: 500n },
  ];
  try {
    const result = assertDoubleEntryBalance(balancedEntries);
    assert(
      'Balanced entries pass (Debits: 5000 === Credits: 5000)',
      result.totalDebits === 5000n && result.totalCredits === 5000n,
    );
  } catch (e) {
    assert('Balanced entries pass', false, (e as Error).message);
  }

  // Test 1.3: Imbalanced entries fail
  const imbalancedEntries: PostEntryInstruction[] = [
    { ledgerAccountId: 'acct_alice', entryType: 'DEBIT', amountMinor: 5000n },
    { ledgerAccountId: 'acct_bob', entryType: 'CREDIT', amountMinor: 4000n },
  ];
  try {
    assertDoubleEntryBalance(imbalancedEntries);
    assert('Imbalanced entries rejected', false, 'Should have thrown BadRequestException');
  } catch (e) {
    assert(
      'Imbalanced entries rejected (Debits: 5000 != Credits: 4000)',
      e instanceof BadRequestException && e.message.includes('Double-entry invariant violation'),
    );
  }

  // Test 1.4: Non-positive amounts fail
  const nonPositiveEntries: PostEntryInstruction[] = [
    { ledgerAccountId: 'acct_alice', entryType: 'DEBIT', amountMinor: 0n },
    { ledgerAccountId: 'acct_bob', entryType: 'CREDIT', amountMinor: 0n },
  ];
  try {
    assertDoubleEntryBalance(nonPositiveEntries);
    assert('Zero amount rejected', false, 'Should have thrown BadRequestException');
  } catch (e) {
    assert(
      'Zero or negative amounts strictly rejected (> 0n invariant)',
      e instanceof BadRequestException && e.message.includes('positive integer minor units'),
    );
  }

  // Test 1.5: Fewer than 2 entries fail
  try {
    assertDoubleEntryBalance([
      { ledgerAccountId: 'acct_alice', entryType: 'DEBIT', amountMinor: 1000n },
    ]);
    assert('Single entry rejected', false, 'Should have thrown BadRequestException');
  } catch (e) {
    assert(
      'Single entry rejected (must contain at least 2 entries)',
      e instanceof BadRequestException && e.message.includes('at least 2 entries'),
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Non-Negative Balance & Overdraft Prevention
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Non-Negative Balance Protection ---');

  // Test 2.1: Sufficient funds pass
  try {
    assertNonNegativeBalance(10000n, 5000n, 'acct_alice');
    assert('Sufficient balance passes (Balance: 10000 >= Debit: 5000)', true);
  } catch (e) {
    assert('Sufficient balance passes', false, (e as Error).message);
  }

  // Test 2.2: Insufficient funds rejected
  try {
    assertNonNegativeBalance(4000n, 5000n, 'acct_alice');
    assert('Overdraft rejected', false, 'Should have thrown BadRequestException');
  } catch (e) {
    assert(
      'Overdraft rejected (Balance: 4000 < Debit: 5000)',
      e instanceof BadRequestException && e.message.includes('Insufficient funds'),
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: 9-State Transaction Lifecycle Machine
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: 9-State Transaction Lifecycle Machine ---');

  // Test 3.1: Sequential linear progression
  const pipeline = LedgerStateMachine.LINEAR_PIPELINE;
  let pipelineValid = true;
  for (let i = 0; i < pipeline.length - 1; i++) {
    const from = pipeline[i];
    const to = pipeline[i + 1];
    if (!LedgerStateMachine.canTransition(from, to)) {
      pipelineValid = false;
      break;
    }
  }
  assert('Sequential progression (PENDING -> ... -> COMPLETED) is valid', pipelineValid);

  // Test 3.2: Illegal state jumps rejected
  assert(
    'Illegal jump (PENDING -> COMPLETED) rejected',
    !LedgerStateMachine.canTransition('PENDING', 'COMPLETED'),
  );
  assert(
    'Illegal jump (PENDING -> PROCESSING) rejected',
    !LedgerStateMachine.canTransition('PENDING', 'PROCESSING'),
  );
  assert(
    'Illegal jump (AUTHORIZED -> COMPLETED) rejected',
    !LedgerStateMachine.canTransition('AUTHORIZED', 'COMPLETED'),
  );

  // Test 3.3: Terminal states cannot transition
  assert(
    'Terminal FAILED cannot transition',
    !LedgerStateMachine.canTransition('FAILED', 'PENDING'),
  );
  assert(
    'Terminal CANCELLED cannot transition',
    !LedgerStateMachine.canTransition('CANCELLED', 'VALIDATING'),
  );
  assert(
    'Terminal REVERSED cannot transition',
    !LedgerStateMachine.canTransition('REVERSED', 'COMPLETED'),
  );

  // Test 3.4: Reversal only permitted from COMPLETED
  assert(
    'Reversal allowed from COMPLETED',
    LedgerStateMachine.canTransition('COMPLETED', 'REVERSED'),
  );
  assert(
    'Reversal disallowed from PENDING',
    !LedgerStateMachine.canTransition('PENDING', 'REVERSED'),
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Database Persistence & Safe Failure (No Memory Fallback)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Mandatory PostgreSQL Persistence ---');

  const mockPrismaDisconnected = {
    isConnected: false,
    transaction: {
      findUnique: jestFn(),
      findFirst: jestFn(),
    },
    $transaction: jestFn(),
  } as unknown as PrismaService;

  const mockAudit = {
    logEvent: async () => ({ id: 'AUD-001' } as any),
  } as unknown as AuditService;

  const mockBalanceEngine = {} as unknown as BalanceEngineService;

  const offlineLedgerService = new LedgerService(
    mockPrismaDisconnected,
    mockAudit,
    mockBalanceEngine,
  );

  // Test 4.1: Financial writes fail safely if database is offline
  try {
    await offlineLedgerService.recordBalancedTransaction({
      type: 'TRANSFER',
      scope: 'INTERNAL',
      amountMinor: 5000n,
      entries: balancedEntries,
    });
    assert('Offline DB fails safely', false, 'Should have thrown ServiceUnavailableException');
  } catch (e) {
    assert(
      'Financial writes fail safely with ServiceUnavailableException when DB is offline',
      e instanceof ServiceUnavailableException && e.message.includes('PostgreSQL database is unavailable'),
    );
  }

  // Test 4.2: Reversal fails safely if database is offline
  try {
    await offlineLedgerService.reverseTransaction('tx_123', 'Customer dispute');
    assert('Offline reversal fails safely', false, 'Should have thrown ServiceUnavailableException');
  } catch (e) {
    assert(
      'Reversal fails safely with ServiceUnavailableException when DB is offline',
      e instanceof ServiceUnavailableException,
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: Idempotency & Conflict Detection
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Idempotency & Conflict Detection ---');

  const existingTx = {
    id: 'tx_existing_001',
    referenceNumber: 'IDEM-KEY-001',
    type: 'TRANSFER',
    status: 'COMPLETED',
    scope: 'INTERNAL',
    amountMinor: 5000n,
    feesMinor: 0n,
    taxMinor: 0n,
    entries: [
      { id: 'e1', ledgerAccountId: 'a1', entryType: 'DEBIT', amountMinor: 5000n },
      { id: 'e2', ledgerAccountId: 'a2', entryType: 'CREDIT', amountMinor: 5000n },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaConnected = {
    isConnected: true,
    transaction: {
      findUnique: async ({ where }: any) => {
        if (where.referenceNumber === 'IDEM-KEY-001') return existingTx;
        return null;
      },
    },
    $transaction: async (fn: any) => fn(mockPrismaConnected),
  } as unknown as PrismaService;

  const connectedLedgerService = new LedgerService(
    mockPrismaConnected,
    mockAudit,
    mockBalanceEngine,
  );

  // Test 5.1: Identical request returns existing transaction
  const identicalRequest = {
    idempotencyKey: 'IDEM-KEY-001',
    type: 'TRANSFER' as const,
    scope: 'INTERNAL' as const,
    amountMinor: 5000n,
    entries: [
      { ledgerAccountId: 'a1', entryType: 'DEBIT' as const, amountMinor: 5000n },
      { ledgerAccountId: 'a2', entryType: 'CREDIT' as const, amountMinor: 5000n },
    ],
  };
  const replayed = await connectedLedgerService.recordBalancedTransaction(identicalRequest);
  assert(
    'Identical request replay returns existing transaction (Idempotent)',
    replayed.id === 'tx_existing_001' && replayed.referenceNumber === 'IDEM-KEY-001',
  );

  // Test 5.2: Differing payload with same idempotency key throws ConflictException
  const conflictingRequest = {
    idempotencyKey: 'IDEM-KEY-001',
    type: 'TRANSFER' as const,
    scope: 'INTERNAL' as const,
    amountMinor: 8000n, // Different amount!
    entries: [
      { ledgerAccountId: 'a1', entryType: 'DEBIT' as const, amountMinor: 8000n },
      { ledgerAccountId: 'a2', entryType: 'CREDIT' as const, amountMinor: 8000n },
    ],
  };
  try {
    await connectedLedgerService.recordBalancedTransaction(conflictingRequest);
    assert('Conflicting idempotency key rejected', false, 'Should have thrown ConflictException');
  } catch (e) {
    assert(
      'Conflicting payload with same idempotency key rejected (ConflictException)',
      e instanceof ConflictException && e.message.includes('Idempotency conflict'),
    );
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: Append-Only Protection (Immutability Invariant)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Append-Only Protection ---');

  const livePrismaService = new PrismaService();

  // Test 6.1: Update is rejected on TransactionEntry
  try {
    livePrismaService.assertAppendOnly('update', 'TransactionEntry');
    assert('Update rejected on TransactionEntry', false, 'Should have thrown ForbiddenException');
  } catch (e) {
    assert(
      'UPDATE rejected on TransactionEntry (ForbiddenException)',
      e instanceof ForbiddenException && e.message.includes('strictly append-only'),
    );
  }

  // Test 6.2: Delete is rejected on TransactionEntry
  try {
    livePrismaService.assertAppendOnly('delete', 'TransactionEntry');
    assert('Delete rejected on TransactionEntry', false, 'Should have thrown ForbiddenException');
  } catch (e) {
    assert(
      'DELETE rejected on TransactionEntry (ForbiddenException)',
      e instanceof ForbiddenException && e.message.includes('strictly append-only'),
    );
  }

  // Test 6.3: Create / Insert is allowed
  try {
    livePrismaService.assertAppendOnly('create', 'TransactionEntry');
    assert('INSERT / CREATE allowed on TransactionEntry', true);
  } catch (e) {
    assert('INSERT / CREATE allowed', false, (e as Error).message);
  }

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: Reversal Mechanism & Balanced Contra-Entries
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Reversal Mechanism & Contra-Entries ---');

  const completedOriginalTx = {
    id: 'tx_orig_001',
    referenceNumber: 'TX-260910-001',
    type: 'TRANSFER',
    status: 'COMPLETED',
    scope: 'INTERNAL',
    amountMinor: 5000n,
    entries: [
      { id: 'e1', ledgerAccountId: 'acct_alice', entryType: 'DEBIT', amountMinor: 5000n },
      { id: 'e2', ledgerAccountId: 'acct_bob', entryType: 'CREDIT', amountMinor: 5000n },
    ],
  };

  let originalStatusUpdatedTo = '';
  let reversalCreatedWith: any = null;
  const createdContraEntries: any[] = [];

  const mockTxContext = {
    transaction: {
      findUnique: async () => completedOriginalTx,
      create: async ({ data }: any) => {
        reversalCreatedWith = data;
        return { ...data, id: 'tx_rev_001', createdAt: new Date(), updatedAt: new Date() };
      },
      update: async ({ data }: any) => {
        originalStatusUpdatedTo = data.status;
        return { ...completedOriginalTx, ...data };
      },
    },
    transactionEntry: {
      create: async ({ data }: any) => {
        createdContraEntries.push(data);
        return { ...data, id: `ce_${createdContraEntries.length}`, createdAt: new Date() };
      },
    },
    ledgerAccount: {
      update: async () => ({}),
    },
  };

  const mockPrismaForReversal = {
    isConnected: true,
    $transaction: async (fn: any) => fn(mockTxContext),
  } as unknown as PrismaService;

  const reversalService = new LedgerService(
    mockPrismaForReversal,
    mockAudit,
    mockBalanceEngine,
  );

  const reversalResult = await reversalService.reverseTransaction('tx_orig_001', 'Erroneous charge');

  assert(
    'Reversal sets original transaction status to REVERSED',
    originalStatusUpdatedTo === 'REVERSED',
  );
  assert(
    'Reversal transaction created with status COMPLETED and type REVERSAL',
    reversalCreatedWith.type === 'REVERSAL' && reversalCreatedWith.status === 'COMPLETED',
  );
  assert(
    'Reversal creates exactly 2 contra-entries',
    createdContraEntries.length === 2,
  );
  assert(
    'Original DEBIT became contra CREDIT on Alice',
    createdContraEntries.find((e) => e.ledgerAccountId === 'acct_alice')?.entryType === 'CREDIT',
  );
  assert(
    'Original CREDIT became contra DEBIT on Bob',
    createdContraEntries.find((e) => e.ledgerAccountId === 'acct_bob')?.entryType === 'DEBIT',
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 8: Balance Calculation & Snapshot Reconciliation
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 8: Balance Engine & Snapshot Reconciliation ---');

  const rawEntries = [
    { entryType: 'CREDIT', amountMinor: 10000n },
    { entryType: 'DEBIT', amountMinor: 2000n },
    { entryType: 'CREDIT', amountMinor: 500n },
    { entryType: 'DEBIT', amountMinor: 1500n },
  ];

  const mockPrismaForBalance = {
    transactionEntry: {
      findMany: async () => rawEntries,
    },
    ledgerAccount: {
      findUnique: async () => ({
        id: 'acct_test',
        balanceSnapshot: 7000n, // Correct: 10000 - 2000 + 500 - 1500 = 7000
      }),
      update: async () => ({}),
    },
  } as unknown as PrismaService;

  const balanceEngine = new BalanceEngineService(mockPrismaForBalance, mockAudit);
  const rawCalculated = await balanceEngine.calculateRawBalance('acct_test');

  assert(
    'Raw balance calculated from entry stream: (10000 - 2000 + 500 - 1500 === 7000)',
    rawCalculated === 7000n,
  );

  const reconciliation = await balanceEngine.reconcileAccount('acct_test');
  assert(
    'Snapshot matches raw calculation (isReconciled: true, delta: 0)',
    reconciliation.isReconciled === true && reconciliation.deltaMinor === '0',
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 9: Global Macroeconomic Double-Entry Balance
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 9: Global Macroeconomic Balance ---');

  const globalEntries = [
    { entryType: 'DEBIT', amountMinor: 1000000n },
    { entryType: 'CREDIT', amountMinor: 800000n },
    { entryType: 'CREDIT', amountMinor: 150000n },
    { entryType: 'CREDIT', amountMinor: 50000n },
  ];

  const mockPrismaGlobal = {
    transactionEntry: {
      findMany: async () => globalEntries,
    },
  } as unknown as PrismaService;

  const globalEngine = new BalanceEngineService(mockPrismaGlobal, mockAudit);
  const globalResult = await globalEngine.verifyGlobalLedgerIntegrity();

  assert(
    'Global ledger integrity: Total Debits (1000000) === Total Credits (1000000)',
    globalResult.isBalanced === true && globalResult.imbalanceMinor === '0',
  );

  // ---------------------------------------------------------------------------
  // Final Scoreboard
  // ---------------------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

function jestFn() {
  return async () => null;
}

runLedgerTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
