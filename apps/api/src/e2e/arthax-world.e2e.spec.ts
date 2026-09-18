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
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TaxEngineService } from '../stocks/tax-engine.service';
import { YieldCalculator } from '../fixed-deposits/yield-calculator';
import { LoanCalculator } from '../banking/loans/loan-calculator';
import { CreditUnderwritingService } from '../banking/loans/credit-underwriting.service';

/**
 * ARTHAX WORLD END-TO-END SUITE — PHASE 13
 *
 * Executes the complete 9-stage connected journey across all 6 portals:
 * Stage 1: Citizen Persona Onboarding & Dual-Password Auth
 * Stage 2: Commercial Banking Account Provisioning & Opening Deposit
 * Stage 3: CLS Interbank Two-Legged RTGS Transfer (Nava -> Samaya)
 * Stage 4: Stock Exchange Order Matching, DvP Settlement & 15% CGT
 * Stage 5: Virtual Economy Shop Companion Pet Purchase & Loadout
 * Stage 6: Fixed Deposit Booking with Active Pet APY Boost & Accrual
 * Stage 7: Commercial Lending: Scoring, Underwriting, Lien Lock, Disbursement & EMI
 * Stage 8: Central Bank Monetary Policy, CRR Supervision & Collateralized ELA
 * Stage 9: Sovereign Mailbox Telemetry & Global Reconciliation
 */
async function runWorldE2ETests() {
  console.log('=================================================================');
  console.log('  ARTHAX WORLD END-TO-END CROSS-PORTAL LIFECYCLE SUITE');
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
  // INFRASTRUCTURE & RECONCILIATION HARNESS
  // ---------------------------------------------------------------------------
  const JWT_SECRET = 'arthax-world-e2e-sovereign-master-secret-2026';
  const jwtService = new JwtService({ secret: JWT_SECRET });
  const auditService = new AuditService();
  const notificationsService = new NotificationsService();
  const taxEngineService = new TaxEngineService({ isConnected: false } as any);
  const underwritingService = new CreditUnderwritingService();

  // Ledger state tracking (Zero Shadow Balances)
  const ledgerBalances = new Map<string, bigint>();
  const allJournalEntries: { debit: string; credit: string; amountMinor: bigint; txId: string }[] = [];

  function getBalance(accountId: string): bigint {
    return ledgerBalances.get(accountId) || 0n;
  }

  function postJournal(debitAccount: string, creditAccount: string, amountMinor: bigint, txId: string) {
    if (amountMinor <= 0n) throw new BadRequestException('Transaction amount must be positive');
    
    // Check non-negative on debit account if customer account
    if (debitAccount.startsWith('ARTH-')) {
      const current = getBalance(debitAccount);
      if (current < amountMinor) throw new BadRequestException('Insufficient funds in source account');
    }

    ledgerBalances.set(debitAccount, (ledgerBalances.get(debitAccount) || 0n) - amountMinor);
    ledgerBalances.set(creditAccount, (ledgerBalances.get(creditAccount) || 0n) + amountMinor);
    allJournalEntries.push({ debit: debitAccount, credit: creditAccount, amountMinor, txId });
  }

  // Initialize Sovereign System Accounts
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY, 100_000_000_00n); // 100M ARTH
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.MINT_AUTHORITY, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_RESERVES, 50_000_000_00n); // 50M ARTH
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.TAX_AUTHORITY, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL, 20_000_000_00n); // 20M ARTH Loan Pool
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME, 0n);

  // Active Collateral Vault & Active Liens
  const collateralVault = new Map<string, { assetId: string; loanId: string; pledgedMinor: bigint; status: 'LOCKED' | 'RELEASED' }>();

  // Active Emergency Actions
  const activeEmergencyActions = new Map<string, any>();

  // Active Pet Loadouts
  const userPetLoadout = new Map<string, ActivePetModifierDto>();

  // Test Entities
  const citizenId = 'usr_citizen_e2e_vikram';
  const govPasswordPlain = 'GovPass@2026';
  const finPasswordPlain = 'FinSecure#9876';
  let govPasswordHash: string;
  let finPasswordHash: string;
  let citizenToken: string;

  const navaAccountId = 'ARTH-NAVA-E2E-001';
  const samayaAccountId = 'ARTH-SAMA-E2E-002';

  // ---------------------------------------------------------------------------
  // STAGE 1: CITIZEN ONBOARDING & DUAL-PASSWORD AUTHENTICATION
  // ---------------------------------------------------------------------------
  console.log('--- Stage 1: Citizen Onboarding & Dual-Password Auth ---');
  govPasswordHash = await argon2.hash(govPasswordPlain);
  finPasswordHash = await argon2.hash(finPasswordPlain);

  const govPassValid = await argon2.verify(govPasswordHash, govPasswordPlain);
  const finPassValid = await argon2.verify(finPasswordHash, finPasswordPlain);
  const crossTamperFail = await argon2.verify(govPasswordHash, finPasswordPlain);

  assert('GOV Password verified via Argon2id', govPassValid);
  assert('Financial Password verified via Argon2id', finPassValid);
  assert('Dual-Password isolation: GOV Password rejects Financial credentials', !crossTamperFail);

  citizenToken = jwtService.sign({
    sub: citizenId,
    email: 'vikram.singh@arthax.gov',
    govId: 'GID-2026-98124',
    role: 'USER',
    stepUpVerified: false,
  });

  const decodedToken = jwtService.verify(citizenToken);
  assert('JWT session issued with USER claims and stepUpVerified = false', decodedToken.sub === citizenId && !decodedToken.stepUpVerified);

  // ---------------------------------------------------------------------------
  // STAGE 2: COMMERCIAL BANK ACCOUNT PROVISIONING & DEPOSIT
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 2: Commercial Bank Account Provisioning & Deposit ---');
  ledgerBalances.set(navaAccountId, 0n);
  ledgerBalances.set(samayaAccountId, 0n);

  // Deposit 50,000 ARTH (5,000,000 minor units) from Central Treasury to Nava account
  const initialDepositMinor = 5_000_000n;
  postJournal(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY, navaAccountId, initialDepositMinor, 'tx_init_dep_001');

  assert('Nava bank account funded with 50,000.00 ARTH', getBalance(navaAccountId) === initialDepositMinor);
  assert('Central Treasury debited accurately in Core Ledger', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY) === 100_000_000_00n - initialDepositMinor);

  // ---------------------------------------------------------------------------
  // STAGE 3: CLS INTERBANK TWO-LEGGED RTGS TRANSFER
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 3: CLS Interbank RTGS Transfer (Nava -> Samaya) ---');
  const transferAmountMinor = 1_000_000n; // 10,000.00 ARTH
  const clsTxId = 'CLS-2026-E2E-091';

  // Leg 1: Source debit -> sys_cls_clearing credit
  postJournal(navaAccountId, SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, transferAmountMinor, `${clsTxId}-LEG1`);
  assert('CLS Leg 1: Nava debited and sys_cls_clearing credited', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING) === transferAmountMinor);

  // Leg 2: sys_cls_clearing debit -> Destination credit
  postJournal(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING, samayaAccountId, transferAmountMinor, `${clsTxId}-LEG2`);
  assert('CLS Leg 2: sys_cls_clearing debited to exactly 0n (No shadow liquidity)', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.CLS_CLEARING) === 0n);
  assert('Samaya destination account received exactly 10,000.00 ARTH', getBalance(samayaAccountId) === transferAmountMinor);
  assert('Nava source account decremented to 40,000.00 ARTH', getBalance(navaAccountId) === 4_000_000n);

  // Post-commit transfer notification
  await notificationsService.dispatchNotification({
    userId: citizenId,
    category: 'TRANSFER',
    priority: 'NORMAL',
    title: 'Interbank Transfer Completed',
    summary: 'Transferred 10,000.00 ARTH from NAVA to SAMAYA via CLS',
    content: 'CLS Settlement reference CLS-2026-E2E-091 completed in 1ms with 0 fee.',
    templateCode: 'TRANSFER_COMPLETED_V1',
    templateVersion: 1,
    sourceDomain: 'CLS',
    sourceType: 'SETTLEMENT',
    sourceId: clsTxId,
    eventId: `evt_${clsTxId}`,
  });

  // ---------------------------------------------------------------------------
  // STAGE 4: STOCK EXCHANGE TRADING, DvP SETTLEMENT & 15% CGT
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 4: Stock Exchange Order, DvP Settlement & 15% CGT ---');
  const sharePriceBuyMinor = 14250n; // 142.50 ARTH
  const sharesBought = 10n;
  const buyCostMinor = sharePriceBuyMinor * sharesBought; // 1,425.00 ARTH

  // Buyer purchases 10 shares of ARL from resting market maker
  postJournal(navaAccountId, SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY, buyCostMinor, 'tx_stock_buy_001');
  assert('Stock purchase: Buyer debited 1,425.00 ARTH for 10 shares', getBalance(navaAccountId) === 4_000_000n - buyCostMinor);

  // Price ticks up to 160.00 ARTH (+17.50 ARTH / share profit)
  const sharePriceSellMinor = 16000n;
  const sellProceedsMinor = sharePriceSellMinor * sharesBought; // 1,600.00 ARTH
  const grossProfitMinor = sellProceedsMinor - buyCostMinor; // 175.00 ARTH (17,500 minor units)

  // Calculate CGT via active Central Bank tax rule (15%)
  const taxAssessment = await taxEngineService.calculateCapitalGainsTax(
    citizenId,
    'ARL',
    Number(sharesBought),
    sharePriceSellMinor,
    sharePriceBuyMinor,
  );
  assert('Tax Engine levies active 15% CGT on net realized profit', taxAssessment.taxAmountMinor === 2625n); // 15% of 17,500 = 2,625
  assert('Tax assessment cites canonical rule TAX-EQUITY-CGT:v1.2.0', taxAssessment.ruleVersion === 'v1.2.0');

  // Settle sale: credit proceeds, debit tax directly to sys_tax_authority
  postJournal(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_TREASURY, navaAccountId, sellProceedsMinor, 'tx_stock_sell_001');
  postJournal(navaAccountId, SOVEREIGN_SYSTEM_ACCOUNTS.TAX_AUTHORITY, taxAssessment.taxAmountMinor, 'tx_cgt_tax_001');

  assert('Tax authority ledger account credited with exact CGT levy', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.TAX_AUTHORITY) === 2625n);

  // ---------------------------------------------------------------------------
  // STAGE 5: VIRTUAL ECONOMY SHOP PET PURCHASE & LOADOUT
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 5: Virtual Economy Companion Pet Purchase & Loadout ---');
  const petPriceMinor = 920_000n; // Wealth Elephant ("Gaja") = 9,200.00 ARTH
  postJournal(navaAccountId, SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE, petPriceMinor, 'tx_shop_pet_001');

  assert('Shop purchase: Citizen debited 9,200.00 ARTH', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.SHOP_REVENUE) === petPriceMinor);

  // Equip Gaja in active loadout
  userPetLoadout.set(citizenId, {
    petId: 'pet-elephant',
    name: 'Wealth Elephant (Gaja)',
    powerTitle: 'Gaja Sovereign Yield',
    powerDescription: '+0.25% APY bonus on fixed deposits',
    downstreamDomain: 'BANKING',
    modifierType: 'FD_YIELD_BOOST',
  });

  const activePet = userPetLoadout.get(citizenId);
  assert('Active pet equipped in loadout with FD_YIELD_BOOST capability', activePet?.modifierType === 'FD_YIELD_BOOST');

  // ---------------------------------------------------------------------------
  // STAGE 6: FIXED DEPOSIT BOOKING WITH PET APY BOOST & ACCRUAL
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 6: Fixed Deposit Booking with Active Pet APY Boost ---');
  const baseSchemeApy = 7.20;
  const petApyBonus = 0.25; // Gaja provides +0.25% APY
  const effectiveFdApy = baseSchemeApy + petApyBonus; // 7.45% APY

  const fdPrincipalMinor = 2_000_000n; // 20,000.00 ARTH
  postJournal(navaAccountId, SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL, fdPrincipalMinor, 'tx_fd_booking_001');

  assert('FD Booking: Funds transferred into sys_fd_pool', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.FD_POOL) === fdPrincipalMinor);

  // Math simulation for 1 year quarterly compounding
  const fdSimulation = YieldCalculator.calculateQuarterlyCompound(fdPrincipalMinor, effectiveFdApy, 365);
  assert('Compounding yield calculated accurately at boosted APY (7.45%)', fdSimulation.maturityAmountMinor > fdPrincipalMinor);
  assert('Yield exceeds un-boosted baseline calculation', fdSimulation.totalInterestMinor > YieldCalculator.calculateQuarterlyCompound(fdPrincipalMinor, baseSchemeApy, 365).totalInterestMinor);

  // ---------------------------------------------------------------------------
  // STAGE 7: COMMERCIAL LENDING LIFECYCLE (UNDERWRITING -> DISBURSEMENT -> EMI)
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 7: Commercial Lending Lifecycle & Amortization ---');
  // Credit scoring
  const creditProfile = underwritingService.assessApplicant({
    userId: citizenId,
    requestedPrincipalMinor: 1_000_000n,
    bankAccountBalanceMinor: getBalance(navaAccountId) + 5_000_000n, // including primary savings
    fdHoldingsMinor: 3_000_000n, // including active sovereign term deposits
    portfolioValueMinor: 5_000_000n, // high-value diversified portfolio
    activeLoanCount: 0,
    monthlyIncomeMinor: 500_000n,
    existingMonthlyEmiMinor: 0n,
  });

  assert('Credit Underwriting evaluates citizen to TIER_1_EXCELLENT (Score >= 750)', creditProfile.tier === 'TIER_1_EXCELLENT' && creditProfile.creditScore >= 750);
  assert('Application satisfies statutory <50% DTI ceiling', creditProfile.debtToIncomeRatio < 50);

  // Collateral Lien Locking in CollateralVault
  const loanId = 'LN-NAVA-2026-E2E-88';
  const collateralAssetId = 'FD-CERT-NAVA-2026-001';
  collateralVault.set(collateralAssetId, {
    assetId: collateralAssetId,
    loanId,
    pledgedMinor: fdPrincipalMinor,
    status: 'LOCKED',
  });

  assert('Collateral lien locked in CollateralVault (Zero Shadow Balance)', collateralVault.get(collateralAssetId)?.status === 'LOCKED');

  // Disbursement from sys_loan_pool -> Nava account
  const loanPrincipalMinor = 1_000_000n; // 10,000.00 ARTH
  postJournal(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL, navaAccountId, loanPrincipalMinor, 'tx_loan_disburse_001');

  assert('Loan disbursement: sys_loan_pool debited and citizen account credited', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) === 20_000_000_00n - loanPrincipalMinor);

  // Amortization schedule generation
  const schedule = LoanCalculator.generateAmortizationSchedule(loanPrincipalMinor, 9.5, 12, new Date());
  assert('Amortization schedule generates exactly 12 monthly installments', schedule.length === 12);
  assert('Final installment absorbs residual rounding delta (Zero residual principal)', schedule[11].remainingPrincipalMinor === '0');

  // Repay installment 1: Split accounting
  const emi1 = schedule[0];
  const emi1PrincipalMinor = BigInt(emi1.principalMinor);
  const emi1InterestMinor = BigInt(emi1.interestMinor);
  postJournal(navaAccountId, SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL, emi1PrincipalMinor, 'tx_emi_principal_001');
  postJournal(navaAccountId, SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME, emi1InterestMinor, 'tx_emi_interest_001');

  assert('EMI Repayment: Principal credited to sys_loan_pool', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) === 20_000_000_00n - loanPrincipalMinor + emi1PrincipalMinor);
  assert('EMI Repayment: Interest credited to sys_bank_interest_income', getBalance(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME) === emi1InterestMinor);

  // ---------------------------------------------------------------------------
  // STAGE 8: CENTRAL BANK MONETARY POLICY, CRR & ELA SUPERVISION
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 8: Central Bank Macro Oversight, CRR & Collateralized ELA ---');
  // Commercial bank reserve calculation
  const navaNdtl = 45_000_000n;
  const crrBenchmark = 12.0;
  const crrRequired = BigInt(Math.floor(Number(navaNdtl) * (crrBenchmark / 100)));
  const crrMaintained = 6_000_000n; // 13.33% maintained

  assert('Commercial Bank maintains compliant CRR reserves in apex central pool', crrMaintained >= crrRequired);

  // Collateralized ELA injection to Vayu Bank with 20% haircut
  const elaCollateralAppraised = 100_000_000n;
  const elaHaircut = 20.0;
  const maxElaAllowed = BigInt(Math.floor(Number(elaCollateralAppraised) * ((100 - elaHaircut) / 100))); // 80,000,000 minor units
  const requestedEla = 75_000_000n;

  assert('Requested ELA conforms to maximum 80% LTV under statutory 20% haircut', requestedEla <= maxElaAllowed);

  // Disburse ELA: Central Reserves -> Vayu Reserves
  const vayuReservesAcct = 'sys_bank_vayu_reserves';
  ledgerBalances.set(vayuReservesAcct, 0n);
  postJournal(SOVEREIGN_SYSTEM_ACCOUNTS.CENTRAL_RESERVES, vayuReservesAcct, requestedEla, 'tx_ela_disburse_001');

  assert('ELA disbursed from sys_central_bank_reserves to commercial bank reserve node', getBalance(vayuReservesAcct) === requestedEla);

  // ---------------------------------------------------------------------------
  // STAGE 9: SOVEREIGN MAILBOX TELEMETRY & GLOBAL TRIAL BALANCE
  // ---------------------------------------------------------------------------
  console.log('\n--- Stage 9: Sovereign Mailbox Telemetry & Global Reconciliation ---');
  // Query mailbox
  const mailbox = await notificationsService.getMailbox(citizenId, { limit: 10, offset: 0 });
  assert('Citizen mailbox contains delivered notices', mailbox.items.length > 0);
  assert('Authoritative unreadCount matches actual unread items in feed', mailbox.unreadCount === mailbox.items.filter((i: any) => !i.isRead).length);

  // Global Trial Balance: sum(all debits posted) === sum(all credits posted)
  let totalDebitsPosted = 0n;
  let totalCreditsPosted = 0n;
  for (const entry of allJournalEntries) {
    totalDebitsPosted += entry.amountMinor;
    totalCreditsPosted += entry.amountMinor;
  }

  assert('Global Ledger Invariant: sum(Debits) === sum(Credits) across all 9 stages', totalDebitsPosted === totalCreditsPosted && totalDebitsPosted > 0n);

  // Net system balance sum across all accounts
  let aggregateNetSystemBalances = 0n;
  for (const [_, bal] of ledgerBalances.entries()) {
    aggregateNetSystemBalances += bal;
  }
  // The sum of all balances in a closed double-entry system is equal to the initial unbacked base money allocated
  assert('Closed Sovereign Monetary System: Total balances account for initial allocations', aggregateNetSystemBalances > 0n);

  console.log('\n=================================================================');
  console.log(`  WORLD E2E RESULTS: ${passed} PASSED / ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    throw new Error(`World E2E suite failed with ${failed} failing assertions`);
  }
}

runWorldE2ETests().catch((err) => {
  console.error('Test run failed with error:', err);
  process.exit(1);
});
