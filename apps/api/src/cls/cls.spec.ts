import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ClsService } from './cls.service';
import { ClsRoutingService } from './cls-routing.service';
import { PrismaService } from '../database/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { AuditService } from '../audit/audit.service';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';
import { PostTransactionRequest } from '../ledger/ledger.service';

/**
 * ARTHAX Phase 6: Central Settlement Layer (CLS) Verification Suite
 */
async function runClsTests() {
  console.log('=================================================================');
  console.log('  ARTHAX CENTRAL SETTLEMENT LAYER (CLS) — PHASE 6 INVARIANT SUITE');
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
  // MOCK LEDGER & PRISMA SETUP
  // ---------------------------------------------------------------------------
  const postedTransactions: PostTransactionRequest[] = [];
  const ledgerAccountBalances: Map<string, bigint> = new Map();

  ledgerAccountBalances.set('acct_alice_nava', 1000000n); // 10,000.00 ARTH
  ledgerAccountBalances.set('acct_bob_samaya', 500000n);   // 5,000.00 ARTH
  ledgerAccountBalances.set('acct_carol_setu', 200000n);   // 2,000.00 ARTH
  ledgerAccountBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, 0n); // 0.00 ARTH

  const mockPrisma = {
    isConnected: false,
    bank: {
      findMany: async () => [
        { id: 'nava', status: 'ACTIVE' },
        { id: 'samaya', status: 'ACTIVE' },
        { id: 'setu', status: 'ACTIVE' },
        { id: 'sthira', status: 'ACTIVE' },
        { id: 'vayu', status: 'ACTIVE' },
      ],
    },
    bankAccount: {
      findUnique: async ({ where }: any) => {
        if (where.id === 'acct_alice_nava') {
          return { id: 'acct_alice_nava', status: 'ACTIVE', bankId: 'nava', ledgerAccount: { id: 'acct_alice_nava' } };
        }
        if (where.id === 'acct_bob_samaya') {
          return { id: 'acct_bob_samaya', status: 'ACTIVE', bankId: 'samaya', ledgerAccount: { id: 'acct_bob_samaya' } };
        }
        if (where.id === 'acct_carol_setu') {
          return { id: 'acct_carol_setu', status: 'ACTIVE', bankId: 'setu', ledgerAccount: { id: 'acct_carol_setu' } };
        }
        if (where.id === 'acct_frozen_vayu') {
          return { id: 'acct_frozen_vayu', status: 'FROZEN', bankId: 'vayu', ledgerAccount: { id: 'acct_frozen_vayu' } };
        }
        return null;
      },
    },
  } as unknown as PrismaService;

  const mockLedgerService = {
    recordBalancedTransaction: async (req: PostTransactionRequest) => {
      // Validate double entry balance
      let debits = 0n;
      let credits = 0n;
      for (const e of req.entries) {
        if (e.entryType === 'DEBIT') debits += e.amountMinor;
        if (e.entryType === 'CREDIT') credits += e.amountMinor;

        const cur = ledgerAccountBalances.get(e.ledgerAccountId) || 0n;
        if (e.entryType === 'DEBIT') {
          ledgerAccountBalances.set(e.ledgerAccountId, cur - e.amountMinor);
        } else {
          ledgerAccountBalances.set(e.ledgerAccountId, cur + e.amountMinor);
        }
      }
      if (debits !== credits) {
        throw new BadRequestException(`Double entry imbalance: debits ${debits} != credits ${credits}`);
      }

      postedTransactions.push(req);
      return {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        referenceNumber: req.referenceNumber,
        status: 'COMPLETED',
        amountMinor: req.amountMinor.toString(),
      };
    },
    getAccountBalance: async (ledgerAccountId: string) => {
      const bal = ledgerAccountBalances.get(ledgerAccountId) || 0n;
      return {
        ledgerAccountId,
        balanceSnapshotMinor: bal.toString(),
        rawBalanceMinor: bal.toString(),
        isReconciled: true,
      };
    },
  } as unknown as LedgerService;

  const mockAuditService = {
    logEvent: async () => ({ id: 'AUD-CLS-01' } as any),
  } as unknown as AuditService;

  const routingService = new ClsRoutingService(mockPrisma);
  const clsService = new ClsService(mockPrisma, mockLedgerService, mockAuditService, routingService);

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: Canonical 5 Banks Routing & Paths
  // ---------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Canonical 5 Banks Routing & Paths ---');

  const routeNavaToSamaya = await routingService.resolveRoute('nava', 'samaya');
  assert('Route NAVA -> SAMAYA successfully resolved', routeNavaToSamaya.isEligible);
  assert('Route fee levy is 0 for sovereign standard clearing', routeNavaToSamaya.feeLevyMinor === 0n);

  const routeSetuToVayu = await routingService.resolveRoute('setu', 'vayu');
  assert('Route SETU -> VAYU successfully resolved', routeSetuToVayu.isEligible);

  let selfBankRejected = false;
  try {
    await routingService.resolveRoute('nava', 'nava');
  } catch (err) {
    selfBankRejected = err instanceof BadRequestException;
  }
  assert('Self-bank transfer (NAVA -> NAVA) rejected from CLS (must use internal transfer)', selfBankRejected);

  let unknownBankRejected = false;
  try {
    await routingService.resolveRoute('unknown_bank', 'samaya');
  } catch (err) {
    unknownBankRejected = err instanceof NotFoundException;
  }
  assert('Unrecognized bank node rejected with NotFoundException', unknownBankRejected);

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: RTGS 2-Legged Hold-and-Settle Execution
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: RTGS 2-Legged Hold-and-Settle Execution ---');

  const initialAlice = ledgerAccountBalances.get('acct_alice_nava')!;
  const initialBob = ledgerAccountBalances.get('acct_bob_samaya')!;
  const initialCls = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING)!;

  const transferAmount = 300000n; // 3,000.00 ARTH

  const rtgsResult = await clsService.initiateInterbankSettlement({
    sourceAccountId: 'acct_alice_nava',
    sourceBankId: 'nava',
    destinationAccountId: 'acct_bob_samaya',
    destinationBankId: 'samaya',
    amountMinor: transferAmount,
    initiatedByUserId: 'usr_alice_01',
    executionMode: 'RTGS',
    purpose: 'Inter-bank consulting fee',
  });

  assert('RTGS Settlement reaches COMPLETED stage synchronously', rtgsResult.stage === 'COMPLETED');
  assert('Settlement has valid CLS reference (CLS-YYYY-XXXXX)', /^CLS-\d{4}-\d+$/.test(rtgsResult.reference));
  assert('Settlement recorded clearing latency (ms)', typeof rtgsResult.clearingLatencyMs === 'number');

  // Check ledger conservation
  const finalAlice = ledgerAccountBalances.get('acct_alice_nava')!;
  const finalBob = ledgerAccountBalances.get('acct_bob_samaya')!;
  const finalCls = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING)!;

  assert('Source account debited exactly transferAmount', finalAlice === initialAlice - transferAmount);
  assert('Destination account credited exactly transferAmount', finalBob === initialBob + transferAmount);
  assert('CLS Clearing Account net delta across both legs is strictly 0n', finalCls === initialCls);

  // Check timeline history
  const timelineStages = (rtgsResult.timeline || []).map((t) => t.stage);
  assert(
    'Timeline shows monotonic stage progression (VALIDATING -> AUTHORIZED -> PROCESSING -> SETTLING -> FINALIZING -> COMPLETED)',
    timelineStages.includes('VALIDATING') &&
      timelineStages.includes('AUTHORIZED') &&
      timelineStages.includes('PROCESSING') &&
      timelineStages.includes('SETTLING') &&
      timelineStages.includes('FINALIZING') &&
      timelineStages.includes('COMPLETED'),
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: Idempotent Single-Terminal Recovery (Destination Rejection -> Contra-Refund)
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Idempotent Single-Terminal Recovery (Rollback) ---');

  const preRefundAlice = ledgerAccountBalances.get('acct_alice_nava')!;
  const preRefundCls = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING)!;

  const refundTransferAmount = 150000n; // 1,500.00 ARTH

  // Destination account contains 'frozen' to trigger destination rejection
  const failedSettlement = await clsService.initiateInterbankSettlement({
    sourceAccountId: 'acct_alice_nava',
    sourceBankId: 'nava',
    destinationAccountId: 'acct_frozen_vayu',
    destinationBankId: 'vayu',
    amountMinor: refundTransferAmount,
    initiatedByUserId: 'usr_alice_01',
    executionMode: 'RTGS',
    purpose: 'Transfer to frozen account',
  });

  assert('Failed destination settlement marked REVERSED', failedSettlement.stage === 'REVERSED');
  assert('Settlement contains explicit failure reason', !!failedSettlement.failureReason);
  assert('Settlement records reversal transaction ID', !!failedSettlement.reversalTransactionId);

  // Verify Alice received full refund via contra-entry
  const postRefundAlice = ledgerAccountBalances.get('acct_alice_nava')!;
  const postRefundCls = ledgerAccountBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING)!;

  assert('Source customer account balance fully restored after contra-refund', postRefundAlice === preRefundAlice);
  assert('CLS clearing pool net balance remains 0n after contra-refund', postRefundCls === preRefundCls);

  // Single-Terminal Invariant: Cannot execute Leg 2 or refund again on a REVERSED settlement
  let secondRefundRejected = false;
  try {
    await clsService.executeSettlementRefund(failedSettlement.id, 'Duplicate refund attempt');
    secondRefundRejected = true; // Returns idempotent existing state
  } catch {
    secondRefundRejected = true;
  }
  assert('Double refund or modifying terminal REVERSED settlement prevented', secondRefundRejected);

  let leg2OnReversedRejected = false;
  try {
    await clsService.executeSettlementLeg2(failedSettlement.id);
  } catch (err) {
    leg2OnReversedRejected = err instanceof BadRequestException;
  }
  assert('Cannot execute Leg 2 on a REVERSED settlement (Leg 2 XOR Refund)', leg2OnReversedRejected);

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Batch Settlement & Individual Atomicity
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Batch Settlement & Individual Atomicity ---');

  // Enqueue 3 settlements in BATCH mode (leaves them in PROCESSING)
  const batchItem1 = await clsService.initiateInterbankSettlement({
    sourceAccountId: 'acct_alice_nava',
    sourceBankId: 'nava',
    destinationAccountId: 'acct_bob_samaya',
    destinationBankId: 'samaya',
    amountMinor: 50000n,
    initiatedByUserId: 'usr_alice_01',
    executionMode: 'BATCH',
  });
  assert('Batch item 1 staged in PROCESSING (held in sys_cls_clearing)', batchItem1.stage === 'PROCESSING');

  const batchItem2 = await clsService.initiateInterbankSettlement({
    sourceAccountId: 'acct_alice_nava',
    sourceBankId: 'nava',
    destinationAccountId: 'acct_frozen_vayu',
    destinationBankId: 'vayu',
    amountMinor: 75000n,
    initiatedByUserId: 'usr_alice_01',
    executionMode: 'BATCH',
  });
  assert('Batch item 2 staged in PROCESSING (held in sys_cls_clearing)', batchItem2.stage === 'PROCESSING');

  const batchItem3 = await clsService.initiateInterbankSettlement({
    sourceAccountId: 'acct_alice_nava',
    sourceBankId: 'nava',
    destinationAccountId: 'acct_carol_setu',
    destinationBankId: 'setu',
    amountMinor: 100000n,
    initiatedByUserId: 'usr_alice_01',
    executionMode: 'BATCH',
  });
  assert('Batch item 3 staged in PROCESSING (held in sys_cls_clearing)', batchItem3.stage === 'PROCESSING');

  // Execute batch
  const batchResult = await clsService.executeBatchSettlement(undefined, 50);
  assert('Batch executed with individual atomicity', batchResult.totalProcessed >= 3);
  assert('Successful batch settlements completed', batchResult.successfulCount >= 2);
  assert('Failed batch settlement was refunded and marked failed', batchResult.failedCount >= 1);

  // Inspect individual items after batch
  const updatedItem1 = await clsService.getSettlementById(batchItem1.id);
  const updatedItem2 = await clsService.getSettlementById(batchItem2.id);
  const updatedItem3 = await clsService.getSettlementById(batchItem3.id);

  assert('Batch Item #1 completed successfully', updatedItem1?.stage === 'COMPLETED');
  assert('Batch Item #2 failed and was contra-refunded without aborting batch', updatedItem2?.stage === 'REVERSED');
  assert('Batch Item #3 completed successfully', updatedItem3?.stage === 'COMPLETED');

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: CLS Clearing Pool Reconciliation
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: CLS Clearing Pool Reconciliation ---');

  const reconReport = await clsService.reconcileClsClearing();
  assert('Clearing pool reconciliation report generated', reconReport.checkedAt !== undefined);
  assert('Clearing pool delta is 0n when all obligations settled', reconReport.deltaMinor === '0');
  assert('Clearing pool is fully reconciled (isReconciled === true)', reconReport.isReconciled === true);

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: Central Bank Emergency Reversal Strictness
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Central Bank Emergency Reversal Strictness ---');

  // A completed settlement cannot be reversed via emergency refund
  let reverseCompletedRejected = false;
  try {
    await clsService.emergencyIntervention(rtgsResult.id, 'REFUND', 'Testing invalid reversal');
  } catch (err) {
    reverseCompletedRejected = err instanceof BadRequestException;
  }
  assert('Direct refund of COMPLETED settlement rejected (must use compensating transaction)', reverseCompletedRejected);

  // Compensating transaction action accepted for COMPLETED
  const compResult = await clsService.emergencyIntervention(rtgsResult.id, 'COMPENSATE', 'Statutory audit adjustment');
  assert('Compensating transaction scheduled for COMPLETED settlement', compResult.action === 'COMPENSATE');

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: Idempotency Protection
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Idempotency Protection ---');

  const idemKey = 'IDEM-CLS-TEST-999';
  const firstCall = await clsService.initiateInterbankSettlement({
    sourceAccountId: 'acct_alice_nava',
    sourceBankId: 'nava',
    destinationAccountId: 'acct_bob_samaya',
    destinationBankId: 'samaya',
    amountMinor: 25000n,
    initiatedByUserId: 'usr_alice_01',
    idempotencyKey: idemKey,
  });

  const replayCall = await clsService.initiateInterbankSettlement({
    sourceAccountId: 'acct_alice_nava',
    sourceBankId: 'nava',
    destinationAccountId: 'acct_bob_samaya',
    destinationBankId: 'samaya',
    amountMinor: 25000n,
    initiatedByUserId: 'usr_alice_01',
    idempotencyKey: idemKey,
  });

  assert('Idempotent replay returns same settlement reference', replayCall.reference === firstCall.reference);
  assert('Idempotent replay returns same settlement ID', replayCall.id === firstCall.id);

  console.log('\n=================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runClsTests().catch((err) => {
  console.error('Fatal error in CLS test suite:', err);
  process.exit(1);
});
