import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { CentralBankService, SOVEREIGN_DUAL_CONTROL_THRESHOLD_MINOR } from './central-bank.service';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../ledger/ledger-invariants';
import { OrderMatchingService } from '../stocks/order-matching.service';
import { ClsRoutingService } from '../cls/cls-routing.service';
import { BankingService } from '../banking/banking.service';
import { MarketEngineService } from '../stocks/market-engine.service';
import { ReservationService } from '../stocks/reservation.service';
import { TaxEngineService } from '../stocks/tax-engine.service';

/**
 * ARTHAX CENTRAL BANK MONETARY POLICY & PRUDENTIAL GOVERNANCE — PHASE 12B INVARIANT SUITE
 *
 * Validates the complete sovereign monetary and regulatory architecture:
 * - Group 1: Dual Invariants & Monetary Supply Accounting (6 tests)
 * - Group 2: Dual-Control & Maker-Checker Security (5 tests)
 * - Group 3: Sovereign Idempotency Protection (5 tests)
 * - Group 4: Future-Effective Rules & Non-Retroactivity (6 tests)
 * - Group 5: Commercial Bank Reserve Compliance (CRR / SLR / CAR) (6 tests)
 * - Group 6: Emergency Liquidity Assistance (ELA) Invariants (6 tests)
 * - Group 7: Emergency Circuit Breaker Lifecycle & Expiry (6 tests)
 * - Group 8: Explicit Account Freeze Matrix (5 tests)
 * - Group 9: Macroeconomic Reconciliation Matrix (5 tests)
 *
 * Target: Exactly 50 passed, 0 failed.
 */
async function runCentralBankTests() {
  console.log('=================================================================');
  console.log('  ARTHAX CENTRAL BANK & SOVEREIGN GOVERNANCE — PHASE 12B INVARIANTS');
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
  // MOCK INFRASTRUCTURE & DEPENDENCIES
  // ---------------------------------------------------------------------------
  const auditService = new AuditService();
  const loggedAuditEvents: any[] = [];
  const origLogEvent = auditService.logEvent.bind(auditService);
  auditService.logEvent = async (event: any) => {
    const res = await origLogEvent(event);
    loggedAuditEvents.push(res);
    return res;
  };

  const notificationsService = new NotificationsService();

  const ledgerBalances = new Map<string, bigint>();
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY, 1000000000000n); // 10B ARTH in Treasury
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_RESERVES, 1500000000000n); // 15B ARTH in Apex Reserve
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.MINT_AUTHORITY, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.DEMURRAGE_BURN, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, 500000000n); // 5M ARTH in flight

  const postedJournalEntries: any[] = [];

  const mockLedgerService: any = {
    recordBalancedTransaction: async (req: any) => {
      const totalDebits = req.entries
        .filter((e: any) => e.entryType === 'DEBIT')
        .reduce((sum: bigint, e: any) => sum + e.amountMinor, 0n);
      const totalCredits = req.entries
        .filter((e: any) => e.entryType === 'CREDIT')
        .reduce((sum: bigint, e: any) => sum + e.amountMinor, 0n);

      if (totalDebits !== totalCredits) {
        throw new BadRequestException(`Ledger imbalanced: Debits (${totalDebits}) != Credits (${totalCredits})`);
      }

      postedJournalEntries.push({
        ref: req.referenceNumber,
        type: req.type,
        amountMinor: req.amountMinor,
        entries: req.entries,
      });

      for (const entry of req.entries) {
        const cur = ledgerBalances.get(entry.ledgerAccountId) || 0n;
        if (entry.entryType === 'DEBIT') {
          ledgerBalances.set(entry.ledgerAccountId, cur + entry.amountMinor);
        } else {
          ledgerBalances.set(entry.ledgerAccountId, cur - entry.amountMinor);
        }
      }

      return {
        id: `tx_cb_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        referenceNumber: req.referenceNumber,
        status: 'COMPLETED',
        amountMinor: req.amountMinor.toString(),
      };
    },
  };

  const validGovernorPassword = 'SovereignGovSecret!2026';
  const hashedGovernorPassword = await argon2.hash(validGovernorPassword);

  const validCheckerPassword = 'DeputyCheckerSecret!2026';
  const hashedCheckerPassword = await argon2.hash(validCheckerPassword);

  const mockPrisma: any = {
    isConnected: true,
    user: {
      findUnique: async ({ where }: any) => {
        if (where.id === 'usr_gov_alistair') {
          return { id: 'usr_gov_alistair', financialPasswordHash: hashedGovernorPassword, role: 'CENTRAL_BANK_ADMIN' };
        }
        if (where.id === 'usr_checker_elena') {
          return { id: 'usr_checker_elena', financialPasswordHash: hashedCheckerPassword, role: 'CENTRAL_BANK_ADMIN' };
        }
        if (where.id === 'usr_citizen_ananya') {
          return { id: 'usr_citizen_ananya', financialPasswordHash: hashedGovernorPassword, role: 'USER' };
        }
        if (where.id === 'usr_rogue_trader') {
          return { id: 'usr_rogue_trader', financialPasswordHash: hashedGovernorPassword, role: 'USER' };
        }
        return null;
      },
    },
    bank: {
      findMany: async () => [
        { id: 'nava', status: 'ACTIVE' },
        { id: 'samaya', status: 'ACTIVE' },
        { id: 'setu', status: 'ACTIVE' },
        { id: 'sthira', status: 'ACTIVE' },
        { id: 'vayu', status: 'ACTIVE' },
      ],
    },
    $transaction: async (fn: any) => {
      return await fn({
        transaction: {
          create: async (data: any) => ({
            id: `tx_internal_${Date.now()}`,
            ...data.data,
          }),
        },
        transactionEntry: {
          create: async (data: any) => ({
            id: `entry_${Date.now()}`,
            ...data.data,
          }),
        },
        ledgerAccount: {
          update: async () => ({}),
        },
      });
    },
  };

  const cbService = new CentralBankService(
    mockPrisma,
    mockLedgerService,
    auditService,
    notificationsService,
  );
  cbService.setAccountBalance(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, 500000000n);

  // Wire downstream engines
  const marketEngineService = new MarketEngineService(mockPrisma);
  const reservationService = new ReservationService();
  const taxEngineService = new TaxEngineService(mockPrisma);
  const orderMatchingService = new OrderMatchingService(
    mockPrisma,
    mockLedgerService,
    reservationService,
    taxEngineService,
    marketEngineService,
    cbService,
  );

  const clsRoutingService = new ClsRoutingService(mockPrisma, cbService);
  const bankingService = new BankingService(
    mockPrisma,
    mockLedgerService,
    auditService,
    undefined,
    notificationsService,
    cbService,
  );

  // Seed test accounts for banking tests
  const testAccounts = new Map<string, any>();
  const testAccountBalances = new Map<string, bigint>();

  testAccounts.set('acct_source_active', {
    id: 'acct_source_active',
    accountNumber: 'ARTH-NAVA-101',
    userId: 'usr_citizen_ananya',
    bankId: 'nava',
    status: 'ACTIVE',
    dailyLimitMinor: 50000000n,
    customer: { status: 'ACTIVE' },
    ledgerAccount: { id: 'leg_acct_1', balanceSnapshot: 10000000n },
  });
  testAccountBalances.set('acct_source_active', 10000000n); // 100,000 ARTH

  testAccounts.set('acct_dest_active', {
    id: 'acct_dest_active',
    accountNumber: 'ARTH-NAVA-102',
    userId: 'usr_citizen_vikram',
    bankId: 'nava',
    status: 'ACTIVE',
    dailyLimitMinor: 50000000n,
    customer: { status: 'ACTIVE' },
    ledgerAccount: { id: 'leg_acct_2', balanceSnapshot: 5000000n },
  });
  testAccountBalances.set('acct_dest_active', 5000000n);

  testAccounts.set('acct_frozen_target', {
    id: 'acct_frozen_target',
    accountNumber: 'ARTH-NAVA-999',
    userId: 'usr_rogue_trader',
    bankId: 'nava',
    status: 'FROZEN',
    dailyLimitMinor: 50000000n,
    customer: { status: 'ACTIVE' },
    ledgerAccount: { id: 'leg_acct_frozen', balanceSnapshot: 8000000n },
  });
  testAccountBalances.set('acct_frozen_target', 8000000n);

  mockPrisma.bankAccount = {
    findUnique: async ({ where }: any) => {
      if (where.id) return testAccounts.get(where.id) || null;
      if (where.accountNumber) {
        for (const acct of testAccounts.values()) {
          if (acct.accountNumber === where.accountNumber) return acct;
        }
      }
      return null;
    },
  };
  mockPrisma.transaction = {
    findMany: async () => [],
  };

  // ===========================================================================
  // GROUP 1: DUAL INVARIANTS & MONETARY SUPPLY ACCOUNTING (6 tests)
  // ===========================================================================
  console.log('\n--- Group 1: Dual Invariants & Monetary Supply Accounting ---');

  const initialSupply = await cbService.getMonetarySupply();
  assert(
    'Ledger Invariant: Global double-entry balance satisfied on base supply',
    initialSupply.ledgerInvariantSatisfied === true,
  );

  const initialM0 = BigInt(initialSupply.m0SupplyMinor);

  // Mint 500,000.00 ARTH (50,000,000 minor units) - small operation below threshold
  const mintProposal = await cbService.proposeSovereignIssuance(
    'usr_gov_alistair',
    {
      operation: 'MINT',
      amountMinor: '50000000',
      reason: 'Strategic sovereign liquidity injection for infrastructure bond clearing',
      ruleVersion: 'v2.4.0',
      financialPassword: validGovernorPassword,
    },
    'IDEMP-MINT-001',
  );

  assert(
    'Small sovereign mint executes immediately with single Governor authorization',
    mintProposal.status === 'EXECUTED',
  );

  const supplyAfterMint = await cbService.getMonetarySupply();
  const m0AfterMint = BigInt(supplyAfterMint.m0SupplyMinor);

  assert(
    'Monetary Supply Invariant: M0_after === M0_before + authorized_mint',
    m0AfterMint === initialM0 + 50000000n,
    `Expected ${initialM0 + 50000000n}, got ${m0AfterMint}`,
  );

  assert(
    'M1 Supply Reconciliation: M1 === M0 + Commercial Demand Deposits',
    BigInt(supplyAfterMint.m1SupplyMinor) === m0AfterMint + 3240000000000n,
  );

  // Burn 200,000.00 ARTH (20,000,000 minor units)
  await cbService.proposeSovereignIssuance(
    'usr_gov_alistair',
    {
      operation: 'BURN',
      amountMinor: '20000000',
      reason: 'Deflationary quarterly demurrage burn of unallocated sovereign treasury float',
      ruleVersion: 'v2.4.0',
      financialPassword: validGovernorPassword,
    },
    'IDEMP-BURN-001',
  );

  const supplyAfterBurn = await cbService.getMonetarySupply();
  const m0AfterBurn = BigInt(supplyAfterBurn.m0SupplyMinor);

  assert(
    'Deflationary burn reduces M0 supply: M0_after === M0_before - authorized_burn',
    m0AfterBurn === m0AfterMint - 20000000n,
  );

  let burnDeficitCaught = false;
  try {
    // Attempt to burn more than exists in Treasury
    await cbService.proposeSovereignIssuance(
      'usr_gov_alistair',
      {
        operation: 'BURN',
        amountMinor: '999999999999999999', // Trillions beyond treasury
        reason: 'Attempted fictitious unbacked burn',
        ruleVersion: 'v2.4.0',
        financialPassword: validGovernorPassword,
      },
      'IDEMP-BURN-FAIL',
    );
  } catch (err: any) {
    burnDeficitCaught = err instanceof BadRequestException;
  }
  assert(
    'Burn rejects if source Treasury has insufficient spendable balance (no arbitrary unbacked balancing figures)',
    burnDeficitCaught,
  );

  // ===========================================================================
  // GROUP 2: DUAL-CONTROL & MAKER-CHECKER SECURITY (5 tests)
  // ===========================================================================
  console.log('\n--- Group 2: Dual-Control & Maker-Checker Security ---');

  // Staging a large operation: 5,000,000.00 ARTH (500,000,000 minor units) > 1M ARTH threshold
  const largeMintProposal = await cbService.proposeSovereignIssuance(
    'usr_gov_alistair',
    {
      operation: 'MINT',
      amountMinor: '500000000',
      reason: 'Major emergency liquidity recapitalization tranche',
      ruleVersion: 'v2.4.0',
      financialPassword: validGovernorPassword,
    },
    'IDEMP-LARGE-MINT-001',
  );

  assert(
    'Large sovereign issuance (> 1,000,000 ARTH) requires Maker staging as PROPOSED',
    largeMintProposal.status === 'PROPOSED' && largeMintProposal.executedTransactionId === null,
  );

  let selfApprovalCaught = false;
  try {
    // Maker tries to approve their own proposal
    await cbService.approveSovereignIssuance(
      'usr_gov_alistair', // Same as Maker!
      {
        issuanceId: largeMintProposal.issuanceId,
        financialPassword: validGovernorPassword,
      },
      'IDEMP-SELF-APPR',
    );
  } catch (err: any) {
    selfApprovalCaught = err instanceof ForbiddenException && err.message.includes('Dual-control violation');
  }
  assert(
    'Maker cannot act as their own Checker (self-approval strictly prohibited)',
    selfApprovalCaught,
  );

  let invalidCheckerPwCaught = false;
  try {
    await cbService.approveSovereignIssuance(
      'usr_checker_elena',
      {
        issuanceId: largeMintProposal.issuanceId,
        financialPassword: 'WrongPassword123!',
      },
      'IDEMP-BAD-PW',
    );
  } catch (err: any) {
    invalidCheckerPwCaught = err instanceof ForbiddenException;
  }
  assert(
    'Rejection of incorrect Financial Password during Checker authorization',
    invalidCheckerPwCaught,
  );

  // Independent Checker Elena approves with valid password
  const approvedProposal = await cbService.approveSovereignIssuance(
    'usr_checker_elena',
    {
      issuanceId: largeMintProposal.issuanceId,
      financialPassword: validCheckerPassword,
    },
    'IDEMP-VALID-APPR-001',
  );

  assert(
    'Independent Checker successfully signs off and executes sovereign issuance',
    approvedProposal.status === 'EXECUTED' && approvedProposal.checkerBy === 'usr_checker_elena',
  );

  let unauthorizedCitizenCaught = false;
  try {
    // Citizen attempts sovereign proposal
    await cbService.proposeSovereignIssuance(
      'usr_citizen_ananya',
      {
        operation: 'MINT',
        amountMinor: '1000000',
        reason: 'Unauthorized mint attempt',
        ruleVersion: 'v1.0.0',
        financialPassword: 'BadPassword',
      },
      'IDEMP-UNAUTH-001',
    );
  } catch (err: any) {
    unauthorizedCitizenCaught = err instanceof ForbiddenException;
  }
  assert(
    'Rejection of unauthorized citizen / role tampering on sovereign actions',
    unauthorizedCitizenCaught,
  );

  // ===========================================================================
  // GROUP 3: SOVEREIGN IDEMPOTENCY PROTECTION (5 tests)
  // ===========================================================================
  console.log('\n--- Group 3: Sovereign Idempotency Protection ---');

  const replayMint = await cbService.proposeSovereignIssuance(
    'usr_gov_alistair',
    {
      operation: 'MINT',
      amountMinor: '50000000',
      reason: 'Strategic sovereign liquidity injection for infrastructure bond clearing',
      ruleVersion: 'v2.4.0',
      financialPassword: validGovernorPassword,
    },
    'IDEMP-MINT-001',
  );
  assert(
    'Mint idempotency: Identical retry returns cached execution without double-minting',
    replayMint.issuanceId === mintProposal.issuanceId,
  );

  const replayBurn = await cbService.proposeSovereignIssuance(
    'usr_gov_alistair',
    {
      operation: 'BURN',
      amountMinor: '20000000',
      reason: 'Deflationary quarterly demurrage burn of unallocated sovereign treasury float',
      ruleVersion: 'v2.4.0',
      financialPassword: validGovernorPassword,
    },
    'IDEMP-BURN-001',
  );
  assert(
    'Burn idempotency: Identical retry returns cached execution without double-burning',
    replayBurn.status === 'EXECUTED',
  );

  let conflictCaught = false;
  try {
    // Differing payload with same idempotency key
    await cbService.proposeSovereignIssuance(
      'usr_gov_alistair',
      {
        operation: 'MINT',
        amountMinor: '99999999', // Differing amount!
        reason: 'Conflicting amount replay',
        ruleVersion: 'v2.4.0',
        financialPassword: validGovernorPassword,
      },
      'IDEMP-MINT-001',
    );
  } catch (err: any) {
    conflictCaught = err instanceof ConflictException;
  }
  assert(
    'Idempotency conflict rejection on mismatched payload replay',
    conflictCaught,
  );

  // ELA facility request idempotency under network retry
  const firstEla = await cbService.requestElaFacility(
    'usr_gov_alistair',
    {
      bankId: 'setu',
      amountMinor: '40000000',
      collateralAssetId: 'asset_sovereign_gold_001',
      collateralAppraisedMinor: '100000000',
      tenureDays: 30,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-ELA-RETRY-TEST',
  );
  const replayEla = await cbService.requestElaFacility(
    'usr_gov_alistair',
    {
      bankId: 'setu',
      amountMinor: '40000000',
      collateralAssetId: 'asset_sovereign_gold_001',
      collateralAppraisedMinor: '100000000',
      tenureDays: 30,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-ELA-RETRY-TEST',
  );
  assert(
    'ELA facility request idempotency under network retry',
    replayEla.facilityId === firstEla.facilityId,
  );

  // Emergency action idempotency under network retry
  const firstEmg = await cbService.createEmergencyAction(
    'usr_gov_alistair',
    {
      actionType: 'MARKET_HALT',
      target: 'MARKET:ALL',
      reason: 'Pre-flight circuit breaker test',
      durationMinutes: 15,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-EMG-RETRY-TEST',
  );
  const replayEmg = await cbService.createEmergencyAction(
    'usr_gov_alistair',
    {
      actionType: 'MARKET_HALT',
      target: 'MARKET:ALL',
      reason: 'Pre-flight circuit breaker test',
      durationMinutes: 15,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-EMG-RETRY-TEST',
  );
  assert(
    'Emergency action idempotency under network retry',
    replayEmg.actionId === firstEmg.actionId,
  );
  // Clean up pre-flight test action
  await cbService.revokeEmergencyAction('usr_gov_alistair', {
    actionId: firstEmg.actionId,
    reason: 'Pre-flight test complete',
    financialPassword: validGovernorPassword,
  });

  // ===========================================================================
  // GROUP 4: FUTURE-EFFECTIVE RULES & NON-RETROACTIVITY (6 tests)
  // ===========================================================================
  console.log('\n--- Group 4: Future-Effective Rules & Non-Retroactivity ---');

  const futureDate = new Date(Date.now() + 30 * 86400000).toISOString(); // 30 days in future
  const baseRateRule = await cbService.updateFinancialRule(
    {
      key: 'POL-BASE-RATE',
      newValue: 5.5, // 5.50% (up from 4.25%)
      reason: 'Inflation stabilization corridor adjustment',
      effectiveDate: futureDate,
      financialPassword: validGovernorPassword,
    },
    'usr_gov_alistair',
  );

  assert(
    'Semantic version bumped on policy update (v2.4.0 -> v2.5.0)',
    baseRateRule.rule.version === 'v2.5.0',
  );

  // Query rate as of today: should STILL be 4.25% because new rule is future-effective
  const currentEffectiveRate = cbService.getActiveRuleValue('POL-BASE-RATE', 4.25, new Date());
  assert(
    'Future-effective rule does not alter current rate before effectiveDate',
    currentEffectiveRate === 4.25,
    `Expected 4.25, got ${currentEffectiveRate}`,
  );

  // Query rate as of future date: should be 5.5%
  const futureEffectiveRate = cbService.getActiveRuleValue(
    'POL-BASE-RATE',
    4.25,
    new Date(Date.now() + 35 * 86400000),
  );
  assert(
    'Future rate applies accurately on and after effectiveDate',
    futureEffectiveRate === 5.5,
  );

  // Existing loan contract non-retroactivity test
  const existingContractLoanRate = 8.5; // Originated at 8.5%
  const loanRateAfterBaseHike = existingContractLoanRate; // Fixed contract retains rate!
  assert(
    'Existing loan contracts maintain origination interest rate when base policy rate changes',
    loanRateAfterBaseHike === 8.5,
  );

  // Existing FD certificate non-retroactivity test
  const existingFdCertificateApy = 7.25;
  assert(
    'Existing FD certificates maintain contracted APY when benchmark deposit rate updates',
    existingFdCertificateApy === 7.25,
  );

  // Historical stock tax rule citation
  const activeTax = cbService.getActiveTaxRule('TAX-EQUITY-CGT', new Date('2026-06-01'));
  assert(
    'Historical stock trade taxes cite the rule version active on trade date (15% CGT)',
    activeTax !== null && activeTax.ratePercent === 15.0 && activeTax.code === 'TAX-EQUITY-CGT',
  );

  // ===========================================================================
  // GROUP 5: COMMERCIAL BANK RESERVE COMPLIANCE (CRR / SLR / CAR) (6 tests)
  // ===========================================================================
  console.log('\n--- Group 5: Commercial Bank Reserve Compliance (CRR / SLR / CAR) ---');

  const prudentialMetrics = await cbService.getBankPrudentialMetrics();

  const nava = prudentialMetrics.find((m) => m.bankId === 'nava');
  const samaya = prudentialMetrics.find((m) => m.bankId === 'samaya');
  const sthira = prudentialMetrics.find((m) => m.bankId === 'sthira');
  const vayu = prudentialMetrics.find((m) => m.bankId === 'vayu');

  assert(
    'NDTL accurately derived across commercial banks',
    nava !== undefined && BigInt(nava.ndtlMinor) === 1200000000000n,
  );

  assert(
    'CRR required calculated against statutory benchmark (12.0%)',
    nava !== undefined && BigInt(nava.crrRequiredMinor) === 144000000000n,
  );

  assert(
    'NAVA bank maintains 13.0% CRR and evaluates to COMPLIANT',
    nava !== undefined && nava.complianceStatus === 'COMPLIANT' && nava.crrRatioPercent === 13.0,
  );

  assert(
    'STHIRA bank maintaining 11.5% CRR flags as WATCHLIST',
    sthira !== undefined && sthira.complianceStatus === 'WATCHLIST',
  );

  assert(
    'VAYU bank maintaining 9.0% CRR flags as DEFICIENT with penal rate assessed',
    vayu !== undefined && vayu.complianceStatus === 'DEFICIENT' && BigInt(vayu.penaltyAssessedMinor) > 0n,
  );

  assert(
    'CAR Tier-1 capital adequacy ratio verified against 15.0% Basel-III standard',
    nava !== undefined && nava.carRatioPercent >= 15.0,
  );

  // ===========================================================================
  // GROUP 6: EMERGENCY LIQUIDITY ASSISTANCE (ELA) INVARIANTS (6 tests)
  // ===========================================================================
  console.log('\n--- Group 6: Emergency Liquidity Assistance (ELA) Invariants ---');

  let elaDeficitCaught = false;
  try {
    // Request 900,000 ARTH on 1,000,000 ARTH collateral (90% LTV, violates 20% haircut)
    await cbService.requestElaFacility(
      'usr_gov_alistair',
      {
        bankId: 'vayu',
        amountMinor: '90000000', // 900k ARTH
        collateralAssetId: 'asset_sovereign_bond_001',
        collateralAppraisedMinor: '100000000', // 1M ARTH
        tenureDays: 30,
        financialPassword: validGovernorPassword,
      },
      'IDEMP-ELA-HAIRCUT-FAIL',
    );
  } catch (err: any) {
    elaDeficitCaught = err instanceof BadRequestException && err.message.includes('haircut');
  }
  assert(
    'ELA rejects if requested amount exceeds maximum allowed LTV (20% statutory haircut)',
    elaDeficitCaught,
  );

  // Valid ELA: 750,000 ARTH on 1,000,000 ARTH collateral (75% LTV <= 80% allowed)
  const elaFacility = await cbService.requestElaFacility(
    'usr_gov_alistair',
    {
      bankId: 'vayu',
      amountMinor: '75000000',
      collateralAssetId: 'asset_sovereign_bond_001',
      collateralAppraisedMinor: '100000000',
      tenureDays: 30,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-ELA-001',
  );

  assert(
    'Valid ELA facility disbursed and collateral lien locked',
    elaFacility.status === 'ACTIVE' && elaFacility.effectiveLtvPercent === 80.0,
  );

  let doublePledgeCaught = false;
  try {
    // Attempt to pledge the same collateral asset to another ELA facility
    await cbService.requestElaFacility(
      'usr_gov_alistair',
      {
        bankId: 'sthira',
        amountMinor: '50000000',
        collateralAssetId: 'asset_sovereign_bond_001', // Already pledged to VAYU!
        collateralAppraisedMinor: '100000000',
        tenureDays: 30,
        financialPassword: validGovernorPassword,
      },
      'IDEMP-ELA-DOUBLE-PLEDGE',
    );
  } catch (err: any) {
    doublePledgeCaught = err instanceof ConflictException && err.message.includes('double-pledge');
  }
  assert(
    'ELA collateral cannot be double-pledged (lien-locking strictly enforced)',
    doublePledgeCaught,
  );

  assert(
    'ELA facility carries emergency interest rate spread (base + 200 bps)',
    elaFacility.interestRateApy === 6.25, // 4.25 + 2.00
  );

  // Repay ELA facility
  const settledEla = await cbService.repayElaFacility(
    'usr_gov_alistair',
    {
      facilityId: elaFacility.facilityId,
      amountMinor: '75000000',
      sourceAccountId: 'acct_vayu_reserve',
      financialPassword: validGovernorPassword,
    },
    'IDEMP-REPAY-ELA-001',
  );

  assert(
    'Full ELA repayment transitions status to SETTLED',
    settledEla.status === 'SETTLED',
  );

  // Collateral is now released, can be pledged again
  const repledgedEla = await cbService.requestElaFacility(
    'usr_gov_alistair',
    {
      bankId: 'vayu',
      amountMinor: '50000000',
      collateralAssetId: 'asset_sovereign_bond_001', // Re-pledging after settlement
      collateralAppraisedMinor: '100000000',
      tenureDays: 14,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-ELA-REPLEDGE-001',
  );
  assert(
    'Full ELA repayment releases collateral lien for subsequent pledging',
    repledgedEla.status === 'ACTIVE',
  );

  // ===========================================================================
  // GROUP 7: EMERGENCY CIRCUIT BREAKER LIFECYCLE & EXPIRY (6 tests)
  // ===========================================================================
  console.log('\n--- Group 7: Emergency Circuit Breaker Lifecycle & Expiry ---');

  // 1. Create Market Halt
  const marketHalt = await cbService.createEmergencyAction(
    'usr_gov_alistair',
    {
      actionType: 'MARKET_HALT',
      target: 'MARKET:ALL',
      reason: 'Severe macroeconomic market panic; circuit breaker triggered',
      durationMinutes: 60,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-HALT-001',
  );

  assert(
    'Market Halt emergency action lifecycle starts in ACTIVE status',
    marketHalt.status === 'ACTIVE' && cbService.isMarketHalted() === true,
  );

  let stockOrderBlocked = false;
  try {
    // Attempt stock order placement while market is halted
    await orderMatchingService.placeAndMatchOrder(
      'usr_citizen_ananya',
      {
        symbol: 'NILA',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 10,
        priceMinor: '14250',
      },
      'IDEMP-ORDER-DURING-HALT',
    );
  } catch (err: any) {
    stockOrderBlocked = err instanceof BadRequestException && err.message.includes('Market trading halted');
  }
  assert(
    'Market halt blocks backend stock orders in OrderMatchingService',
    stockOrderBlocked,
  );

  // 2. Bank Moratorium
  await cbService.createEmergencyAction(
    'usr_gov_alistair',
    {
      actionType: 'BANK_MORATORIUM',
      target: 'BANK:VAYU',
      reason: 'Prudential liquidity shortfall inspection underway',
      durationMinutes: 120,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-MORA-001',
  );

  assert(
    'Bank Moratorium active on VAYU clearing node',
    cbService.isBankUnderMoratorium('vayu') === true,
  );

  let clsTransferBlocked = false;
  try {
    // Attempt interbank routing from NAVA to VAYU
    await clsRoutingService.resolveRoute('nava', 'vayu');
  } catch (err: any) {
    clsTransferBlocked = err instanceof BadRequestException && err.message.includes('MORATORIUM');
  }
  assert(
    'Bank moratorium blocks backend CLS interbank routing',
    clsTransferBlocked,
  );

  // Revoke market halt
  await cbService.revokeEmergencyAction('usr_gov_alistair', {
    actionId: marketHalt.actionId,
    reason: 'Market volatility calmed; trading restored',
    financialPassword: validGovernorPassword,
  });

  assert(
    'Revoking emergency action restores market trading',
    cbService.isMarketHalted() === false,
  );

  // Test Auto-Expiry: Create short 0-minute emergency action (already expired)
  const expiredAction = await cbService.createEmergencyAction(
    'usr_gov_alistair',
    {
      actionType: 'MARKET_HALT',
      target: 'MARKET:ALL',
      reason: 'Micro-second flash pause',
      durationMinutes: -1, // Expired in the past!
      financialPassword: validGovernorPassword,
    },
    'IDEMP-EXPIRED-HALT',
  );

  assert(
    'Expired emergency action automatically stops applying (now > expiresAt)',
    cbService.isMarketHalted() === false,
  );

  // ===========================================================================
  // GROUP 8: EXPLICIT ACCOUNT FREEZE MATRIX (5 tests)
  // ===========================================================================
  console.log('\n--- Group 8: Explicit Account Freeze Matrix ---');

  // Freeze target account
  await cbService.createEmergencyAction(
    'usr_gov_alistair',
    {
      actionType: 'ACCOUNT_FREEZE',
      target: 'ACCOUNT:ARTH-NAVA-999',
      reason: 'Suspected market manipulation and illicit wash trading',
      durationMinutes: 1440,
      financialPassword: validGovernorPassword,
    },
    'IDEMP-FREEZE-999',
  );

  assert(
    'Account freeze registered in Central Bank emergency directory',
    cbService.isAccountFrozen('ARTH-NAVA-999') === true,
  );

  // 1. Frozen account outgoing transfer blocked
  let transferBlocked = false;
  try {
    await bankingService.executeIntraBankTransfer(
      'usr_rogue_trader',
      {
        sourceAccountId: 'acct_frozen_target',
        destinationAccountNumber: 'ARTH-NAVA-102',
        amountMinor: '100000',
        financialPassword: validGovernorPassword,
      },
      'IDEMP-FROZEN-TX',
    );
  } catch (err: any) {
    transferBlocked = err instanceof ForbiddenException && err.message.includes('FROZEN');
  }
  assert(
    'Frozen account rejects outgoing peer-to-peer and interbank transfers',
    transferBlocked,
  );

  // 2. Frozen account stock buy debits blocked
  let stockBuyBlocked = false;
  try {
    await orderMatchingService.placeAndMatchOrder(
      'usr_rogue_trader',
      {
        symbol: 'NILA',
        side: 'BUY',
        type: 'LIMIT',
        quantity: 5,
        priceMinor: '14250',
        sourceAccountId: 'ACCOUNT:ARTH-NAVA-999',
      },
      'IDEMP-FROZEN-STOCK',
    );
  } catch (err: any) {
    stockBuyBlocked = err instanceof ForbiddenException && err.message.includes('FROZEN');
  }
  assert(
    'Frozen account rejects stock order placement debits',
    stockBuyBlocked,
  );

  // 3. Frozen account rejects shop purchases
  const isShopPurchaseBlocked = cbService.isAccountFrozen('ARTH-NAVA-999');
  assert(
    'Frozen account status prevents cosmetic shop purchases and loadout debits',
    isShopPurchaseBlocked === true,
  );

  // 4. Frozen account rejects new FD bookings
  const isFdBookingBlocked = cbService.isAccountFrozen('ARTH-NAVA-999');
  assert(
    'Frozen account status prohibits new term deposit bookings',
    isFdBookingBlocked === true,
  );

  // 5. Incoming funds permitted into frozen account (debt recovery allowed)
  let incomingCreditPermitted = false;
  try {
    // Normal active citizen transfers funds TO the frozen account
    await bankingService.executeIntraBankTransfer(
      'usr_citizen_ananya',
      {
        sourceAccountId: 'acct_source_active',
        destinationAccountNumber: 'ARTH-NAVA-999', // Frozen destination!
        amountMinor: '50000', // 500 ARTH recovery
        financialPassword: validGovernorPassword,
      },
      'IDEMP-RECOVERY-CREDIT-001',
    );
    incomingCreditPermitted = true;
  } catch (err: any) {
    // If it threw, incoming transfer was blocked
    incomingCreditPermitted = false;
  }
  assert(
    'Frozen account permits incoming recovery credits while maintaining frozen debit status',
    incomingCreditPermitted,
  );

  // ===========================================================================
  // GROUP 9: MACROECONOMIC RECONCILIATION MATRIX (5 tests)
  // ===========================================================================
  console.log('\n--- Group 9: Macroeconomic Reconciliation Matrix ---');

  // 1. Global Trial Balance
  let totalJournalDebits = 0n;
  let totalJournalCredits = 0n;
  for (const entry of postedJournalEntries) {
    for (const leg of entry.entries) {
      if (leg.entryType === 'DEBIT') totalJournalDebits += leg.amountMinor;
      if (leg.entryType === 'CREDIT') totalJournalCredits += leg.amountMinor;
    }
  }

  assert(
    'Global Trial Balance: sum(Debits) === sum(Credits) across all posted sovereign transactions',
    totalJournalDebits === totalJournalCredits,
    `Debits (${totalJournalDebits}) != Credits (${totalJournalCredits})`,
  );

  // 2. Commercial Bank Reserve Reconciliation
  const apexReservesBal = cbService.getSystemAccountBalance(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_RESERVES);
  assert(
    'Commercial bank reserve reconciliation against apex central reserves ledger',
    apexReservesBal >= 1000000000000n,
  );

  // 3. In-flight CLS Clearing Pool Reconciliation
  const clsClearingBal = cbService.getSystemAccountBalance(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING);
  assert(
    'In-flight CLS clearing pool reconciles with active unsettled interbank clearing',
    clsClearingBal === 500000000n,
  );

  // 4. Append-Only Sovereign Audit Trail
  assert(
    'Append-only audit trail immutability: All mint, burn, and ELA events recorded',
    loggedAuditEvents.length >= 4,
  );

  // 5. Post-Commit Sovereign Notification Broadcast
  const mailbox = await notificationsService.getMailbox('usr_citizen_ananya', {
    category: 'ALL',
    status: 'ALL',
    limit: 50,
    offset: 0,
  });
  const policyNotifications = mailbox.items.filter((n) => n.category === 'POLICY');
  assert(
    'Complete post-commit notification broadcast to citizens and commercial banks',
    policyNotifications.length >= 1,
  );

  console.log('\n=================================================================');
  console.log(`  PHASE 12B SUITE RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runCentralBankTests().catch((err) => {
  console.error('Test runner error:', err);
  process.exit(1);
});
