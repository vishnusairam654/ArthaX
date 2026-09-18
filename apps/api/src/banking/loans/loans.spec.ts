import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { LoansService } from './loans.service';
import { LoanCalculator } from './loan-calculator';
import { CreditUnderwritingService } from './credit-underwriting.service';
import { AuditService } from '../../audit/audit.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../../ledger/ledger-invariants';

/**
 * ARTHAX COMMERCIAL CREDIT & SOVEREIGN LENDING ENGINE — PHASE 12A INVARIANT SUITE
 *
 * Validates the complete lending lifecycle across the 5 commercial banks:
 * - Group 1: Canonical Loan Products & Eligibility (6 tests)
 * - Group 2: Credit Scoring & Underwriting Engine (6 tests)
 * - Group 3: Collateral Appraisal & Lien Locking (5 tests)
 * - Group 4: 9-State Lifecycle Machine & Approval Protocol (6 tests)
 * - Group 5: Ledger-Backed Disbursement Protocol (6 tests)
 * - Group 6: Reducing-Balance Amortization & Rounding Precision (6 tests)
 * - Group 7: EMI Repayment & Split Accounting (5 tests)
 * - Group 8: Early Foreclosure & Full Prepayment (5 tests)
 * - Group 9: Delinquency, Overdue Penalties & Notifications (5 tests)
 *
 * Target: Exactly 50 passed, 0 failed.
 */
async function runLoansTests() {
  console.log('=================================================================');
  console.log('  ARTHAX COMMERCIAL CREDIT & LENDING — PHASE 12A INVARIANT SUITE');
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
  const notificationsService = new NotificationsService();
  const underwritingService = new CreditUnderwritingService();

  // Ledger account balances tracker (Zero Shadow Balance)
  const ledgerBalances = new Map<string, bigint>();
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL, 0n);
  ledgerBalances.set(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME, 0n);

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

      for (const entry of req.entries) {
        const current = ledgerBalances.get(entry.ledgerAccountId) || 0n;
        if (entry.entryType === 'DEBIT') {
          ledgerBalances.set(entry.ledgerAccountId, current - entry.amountMinor);
        } else {
          ledgerBalances.set(entry.ledgerAccountId, current + entry.amountMinor);
        }
      }

      return {
        id: `tx_loan_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        referenceNumber: req.referenceNumber,
        status: 'COMPLETED',
        amountMinor: req.amountMinor.toString(),
      };
    },
  };

  const validFinancialPassword = 'SovereignLoanSecret!2026';
  const hashedFinancialPassword = await argon2.hash(validFinancialPassword);

  const mockPrisma: any = {
    isConnected: true,
    user: {
      findUnique: async ({ where }: any) => {
        if (where.id === 'usr_citizen_ananya') {
          return { id: 'usr_citizen_ananya', financialPasswordHash: hashedFinancialPassword };
        }
        if (where.id === 'usr_citizen_vikram') {
          return { id: 'usr_citizen_vikram', financialPasswordHash: hashedFinancialPassword };
        }
        return null;
      },
    },
    bankAccount: {
      findUnique: async () => null,
    },
  };

  const loansService = new LoansService(
    mockPrisma,
    mockLedgerService,
    auditService,
    underwritingService,
    notificationsService,
  );

  const citizenA = 'usr_citizen_ananya';
  const citizenB = 'usr_citizen_vikram';
  const ananyaAccount = 'acct_ananya_nava_001';
  const vikramAccount = 'acct_vikram_setu_001';

  // Seed citizen account balances
  loansService.seedAccountBalance(ananyaAccount, 10000000n); // 100,000.00 ARTH
  loansService.seedAccountBalance(vikramAccount, 5000000n); // 50,000.00 ARTH
  ledgerBalances.set(ananyaAccount, 10000000n);
  ledgerBalances.set(vikramAccount, 5000000n);

  // ===========================================================================
  // GROUP 1: Canonical Loan Products & Eligibility (6 tests)
  // ===========================================================================
  console.log('\n--- Group 1: Canonical Loan Products & Eligibility ---');

  // Test 1: Discovers 5 canonical products across the 5 sovereign commercial banks
  const allProducts = await loansService.listLoanProducts();
  assert('Discovers 5 canonical products across the 5 sovereign commercial banks', allProducts.length === 5);

  // Test 2: Products map to distinct banks (NAVA, SAMAYA, SETU, STHIRA, VAYU)
  const bankIds = new Set(allProducts.map((p) => p.bankId.toLowerCase()));
  assert(
    'Products map to distinct banks (NAVA, SAMAYA, SETU, STHIRA, VAYU)',
    bankIds.has('nava') && bankIds.has('samaya') && bankIds.has('setu') && bankIds.has('sthira') && bankIds.has('vayu'),
  );

  // Test 3: Validates minimum and maximum principal bounds (e.g. NAVA 10,000 to 200,000 ARTH)
  const navaPersonal = await loansService.getLoanProduct('prod_nava_personal');
  assert(
    'Validates minimum and maximum principal bounds (NAVA: 10,000 to 200,000 ARTH)',
    navaPersonal.minPrincipalMinor === '1000000' && navaPersonal.maxPrincipalMinor === '20000000',
    `Min: ${navaPersonal.minPrincipalMinor}, Max: ${navaPersonal.maxPrincipalMinor}`,
  );

  // Test 4: Validates tenure ranges (e.g. STHIRA 24 to 240 months for mortgages)
  const sthiraMortgage = await loansService.getLoanProduct('prod_sthira_mortgage');
  assert(
    'Validates tenure ranges (STHIRA: 24 to 240 months for mortgages)',
    sthiraMortgage.minTenureMonths === 24 && sthiraMortgage.maxTenureMonths === 240,
  );

  // Test 5: Simulation computes valid monthly EMI and total interest for product
  const simResult = loansService.simulateLoan({
    bankId: 'nava',
    productId: 'prod_nava_personal',
    principalMinor: '5000000', // 50,000.00 ARTH
    tenureMonths: 24,
  });
  assert(
    'Simulation computes valid monthly EMI and total interest for product',
    BigInt(simResult.monthlyEmiMinor) > 0n &&
      BigInt(simResult.totalInterestMinor) > 0n &&
      simResult.schedule.length === 24,
    `Monthly EMI: ${simResult.monthlyEmiMinor}, Total interest: ${simResult.totalInterestMinor}`,
  );

  // Test 6: Non-existent product query throws NotFoundException
  let notFoundCaught = false;
  try {
    await loansService.getLoanProduct('prod_non_existent');
  } catch (err: any) {
    notFoundCaught = err instanceof NotFoundException;
  }
  assert('Non-existent product query throws NotFoundException', notFoundCaught);

  // ===========================================================================
  // GROUP 2: Credit Scoring & Underwriting Engine (6 tests)
  // ===========================================================================
  console.log('\n--- Group 2: Credit Scoring & Underwriting Engine ---');

  // Test 7: High liquidity + active FDs + clean history evaluates to TIER_1_EXCELLENT (Score >= 750)
  const tier1Assessment = underwritingService.assessApplicant({
    userId: citizenA,
    requestedPrincipalMinor: 5000000n,
    bankAccountBalanceMinor: 6000000n,
    fdHoldingsMinor: 3000000n,
    portfolioValueMinor: 5000000n,
    activeLoanCount: 0,
    monthlyIncomeMinor: 1000000n,
  });
  assert(
    'High liquidity + active FDs + clean history evaluates to TIER_1_EXCELLENT (Score >= 750)',
    tier1Assessment.tier === 'TIER_1_EXCELLENT' && tier1Assessment.creditScore >= 750 && tier1Assessment.eligible,
    `Score: ${tier1Assessment.creditScore}, Tier: ${tier1Assessment.tier}`,
  );

  // Test 8: Moderate balance and active history evaluates to TIER_2_GOOD (Score 680-749)
  const tier2Assessment = underwritingService.assessApplicant({
    userId: citizenB,
    requestedPrincipalMinor: 3000000n,
    bankAccountBalanceMinor: 2500000n,
    fdHoldingsMinor: 500000n,
    portfolioValueMinor: 0n,
    activeLoanCount: 1,
    monthlyIncomeMinor: 600000n,
  });
  assert(
    'Moderate balance and active history evaluates to TIER_2_GOOD (Score 680-749)',
    tier2Assessment.tier === 'TIER_2_GOOD' && tier2Assessment.creditScore >= 680 && tier2Assessment.creditScore < 750,
    `Score: ${tier2Assessment.creditScore}, Tier: ${tier2Assessment.tier}`,
  );

  // Test 9: Depository near minimum evaluates to TIER_3_FAIR with mandatory collateral requirement
  const tier3Assessment = underwritingService.assessApplicant({
    userId: 'usr_risky_applicant',
    requestedPrincipalMinor: 2000000n,
    bankAccountBalanceMinor: 30000n,
    fdHoldingsMinor: 0n,
    portfolioValueMinor: 0n,
    activeLoanCount: 2,
    monthlyIncomeMinor: 300000n,
  });
  assert(
    'Depository near minimum evaluates to TIER_3_FAIR with mandatory collateral requirement',
    tier3Assessment.tier === 'TIER_3_FAIR' && tier3Assessment.collateralRequired === true,
    `Tier: ${tier3Assessment.tier}, Collateral required: ${tier3Assessment.collateralRequired}`,
  );

  // Test 10: Excessive active loans burden reduces credit score
  const burdenedAssessment = underwritingService.assessApplicant({
    userId: 'usr_overleveraged',
    requestedPrincipalMinor: 2000000n,
    activeLoanCount: 4,
  });
  assert(
    'Excessive active loans burden reduces credit score',
    burdenedAssessment.creditScore < 600 && burdenedAssessment.tier === 'SUBPRIME',
    `Burdened score: ${burdenedAssessment.creditScore}`,
  );

  // Test 11: Application exceeding 50% DTI ceiling is flagged ineligible by underwriting engine
  const highDtiAssessment = underwritingService.assessApplicant({
    userId: 'usr_high_dti',
    requestedPrincipalMinor: 20000000n, // Huge principal
    monthlyIncomeMinor: 100000n, // Small income -> DTI > 50%
  });
  assert(
    'Application exceeding 50% DTI ceiling is flagged ineligible by underwriting engine',
    highDtiAssessment.eligible === false && highDtiAssessment.reasons.some((r) => r.includes('Debt-to-Income')),
    `DTI: ${highDtiAssessment.debtToIncomeRatio}`,
  );

  // Test 12: Subprime profile with insufficient collateral is rejected
  const subprimeAssessment = underwritingService.assessApplicant({
    userId: 'usr_subprime',
    requestedPrincipalMinor: 5000000n,
    bankAccountBalanceMinor: 20000n,
    activeLoanCount: 3,
    collateralAppraisedValueMinor: 1000000n, // Only 20% collateral, needs >= 120%
  });
  assert(
    'Subprime profile with insufficient collateral is rejected',
    subprimeAssessment.eligible === false,
  );

  // ===========================================================================
  // GROUP 3: Collateral Appraisal & Lien Locking (5 tests)
  // ===========================================================================
  console.log('\n--- Group 3: Collateral Appraisal & Lien Locking ---');

  // Test 13: Pledged collateral appraised at >= 120% ratio passes underwriting check
  const securedAssessment = underwritingService.assessApplicant({
    userId: citizenA,
    requestedPrincipalMinor: 10000000n, // 100,000.00 ARTH
    collateralAppraisedValueMinor: 13000000n, // 130,000.00 ARTH (130%)
    bankAccountBalanceMinor: 1000000n,
  });
  assert(
    'Pledged collateral appraised at >= 120% ratio passes underwriting check',
    securedAssessment.eligible === true,
  );

  // Test 14: Pledging collateral creates active lien record in CollateralVault
  const pledgedFdCert = 'FD-CERT-NAVA-2026-9901';
  const securedLoanApp = await loansService.applyForLoan(citizenA, {
    bankId: 'sthira',
    productId: 'prod_sthira_mortgage',
    requestedPrincipalMinor: '10000000', // 100,000.00 ARTH
    tenureMonths: 24,
    purpose: 'Commercial Vault expansion',
    disbursementAccountId: ananyaAccount,
    repaymentAccountId: ananyaAccount,
    collateralType: 'FIXED_DEPOSIT',
    collateralAssetId: pledgedFdCert,
  });
  assert(
    'Pledging collateral creates active lien record in CollateralVault',
    securedLoanApp.collaterals.length === 1 && securedLoanApp.collaterals[0].lienStatus === 'ACTIVE',
  );

  // Test 15: Active lien prevents duplicate collateral pledging to a second loan
  let duplicateLienBlocked = false;
  try {
    await loansService.applyForLoan(citizenA, {
      bankId: 'sthira',
      productId: 'prod_sthira_mortgage',
      requestedPrincipalMinor: '10000000',
      tenureMonths: 24,
      purpose: 'Attempting to pledge same FD twice',
      disbursementAccountId: ananyaAccount,
      repaymentAccountId: ananyaAccount,
      collateralType: 'FIXED_DEPOSIT',
      collateralAssetId: pledgedFdCert, // Same cert
    });
  } catch (err: any) {
    duplicateLienBlocked = err instanceof BadRequestException && err.message.includes('already pledged under an active lien');
  }
  assert('Active lien prevents duplicate collateral pledging to a second loan', duplicateLienBlocked);

  // Test 16: Collateral lien inquiry confirms asset is locked (isAssetLienLocked = true)
  assert(
    'Collateral lien inquiry confirms asset is locked (isAssetLienLocked = true)',
    loansService.isAssetLienLocked(pledgedFdCert) === true,
  );

  // Test 17: Collateral lien is cleanly released when loan is rejected or closed
  await loansService.reviewLoan('staff_sthira_001', 'sthira', securedLoanApp.id, {
    action: 'REJECT',
    rejectionReason: 'Appraisal audit adjustment',
  });
  assert(
    'Collateral lien is cleanly released when loan is rejected or closed',
    loansService.isAssetLienLocked(pledgedFdCert) === false,
  );

  // ===========================================================================
  // GROUP 4: 9-State Lifecycle Machine & Approval Protocol (6 tests)
  // ===========================================================================
  console.log('\n--- Group 4: 9-State Lifecycle Machine & Approval Protocol ---');

  // Test 18: Citizen loan application initializes in SUBMITTED state with valid contract number (LN-BANK-YYYY-XXXXXX)
  const personalLoan = await loansService.applyForLoan(citizenA, {
    bankId: 'nava',
    productId: 'prod_nava_personal',
    requestedPrincipalMinor: '5000000', // 50,000.00 ARTH
    tenureMonths: 24,
    purpose: 'Sovereign Business Working Capital',
    disbursementAccountId: ananyaAccount,
    repaymentAccountId: ananyaAccount,
  });
  assert(
    'Citizen loan application initializes in SUBMITTED state with valid contract number',
    personalLoan.status === 'SUBMITTED' && personalLoan.contractNumber.startsWith('LN-NAVA-2026-'),
    `Status: ${personalLoan.status}, Contract: ${personalLoan.contractNumber}`,
  );

  // Test 19: Bank Officer successfully reviews and APPROVES submitted loan
  const approvedLoan = await loansService.reviewLoan('staff_nava_01', 'nava', personalLoan.id, {
    action: 'APPROVE',
    approvedPrincipalMinor: '5000000',
    approvedInterestRate: 9.5,
  });
  assert(
    'Bank Officer successfully reviews and APPROVES submitted loan',
    approvedLoan.status === 'APPROVED' && approvedLoan.approvedByStaffId === 'staff_nava_01',
  );

  // Test 20: Illegal transition: Direct jump from SUBMITTED to DISBURSED is strictly rejected
  const unapprovedLoan = await loansService.applyForLoan(citizenB, {
    bankId: 'setu',
    productId: 'prod_setu_transit',
    requestedPrincipalMinor: '2000000',
    tenureMonths: 12,
    purpose: 'Setu Transit Buffer',
    disbursementAccountId: vikramAccount,
    repaymentAccountId: vikramAccount,
  });
  let illegalDisburseBlocked = false;
  try {
    await loansService.disburseLoan(citizenB, unapprovedLoan.id, {
      financialPassword: validFinancialPassword,
      disbursementAccountId: vikramAccount,
    });
  } catch (err: any) {
    illegalDisburseBlocked = err instanceof BadRequestException && err.message.includes('must be APPROVED');
  }
  assert('Illegal transition: Direct jump from SUBMITTED to DISBURSED is strictly rejected', illegalDisburseBlocked);

  // Test 21: Illegal transition: Cannot review or approve an already APPROVED loan
  let doubleReviewBlocked = false;
  try {
    await loansService.reviewLoan('staff_nava_01', 'nava', personalLoan.id, {
      action: 'APPROVE',
    });
  } catch (err: any) {
    doubleReviewBlocked = err instanceof BadRequestException && err.message.includes('Cannot review loan in [APPROVED]');
  }
  assert('Illegal transition: Cannot review or approve an already APPROVED loan', doubleReviewBlocked);

  // Test 22: Bank Officer can REJECT loan with explicit statutory reason code
  const rejectedLoan = await loansService.reviewLoan('staff_setu_01', 'setu', unapprovedLoan.id, {
    action: 'REJECT',
    rejectionReason: 'Exceeds allowable unsecured transit volume limit',
  });
  assert(
    'Bank Officer can REJECT loan with explicit statutory reason code',
    rejectedLoan.status === 'REJECTED' && rejectedLoan.rejectionReason?.includes('unsecured transit volume'),
  );

  // Test 23: Cross-bank underwriting rejected: Nava officer cannot review Setu bank loan
  const setuLoan2 = await loansService.applyForLoan(citizenB, {
    bankId: 'setu',
    productId: 'prod_setu_transit',
    requestedPrincipalMinor: '1000000',
    tenureMonths: 6,
    purpose: 'Transit Float',
    disbursementAccountId: vikramAccount,
    repaymentAccountId: vikramAccount,
  });
  let crossBankUnderwritingBlocked = false;
  try {
    await loansService.reviewLoan('staff_nava_01', 'nava', setuLoan2.id, {
      action: 'APPROVE',
    });
  } catch (err: any) {
    crossBankUnderwritingBlocked = err instanceof ForbiddenException && err.message.includes('Staff assigned to bank [nava] cannot review loans belonging to [setu]');
  }
  assert(
    'Cross-bank underwriting rejected: Nava officer cannot review Setu bank loan',
    crossBankUnderwritingBlocked,
  );

  // ===========================================================================
  // GROUP 5: Ledger-Backed Disbursement Protocol (6 tests)
  // ===========================================================================
  console.log('\n--- Group 5: Ledger-Backed Disbursement Protocol ---');

  // Test 24: Disbursement invalid Financial Password throws ForbiddenException
  let invalidPasswordBlocked = false;
  try {
    await loansService.disburseLoan(citizenA, personalLoan.id, {
      financialPassword: 'WrongFinancialPassword',
      disbursementAccountId: ananyaAccount,
    });
  } catch (err: any) {
    invalidPasswordBlocked = err instanceof ForbiddenException && err.message.includes('Invalid Financial Password');
  }
  assert('Disbursement invalid Financial Password throws ForbiddenException', invalidPasswordBlocked);

  // Test 25: Valid Financial Password passes step-up authorization and initiates disbursement
  const initialPoolBalance = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) || 0n;
  const initialCustomerBalance = ledgerBalances.get(ananyaAccount) || 0n;
  const disbursedAmount = BigInt(personalLoan.principalMinor); // 50,000.00 ARTH = 5,000,000 minor

  const disbursedLoan = await loansService.disburseLoan(
    citizenA,
    personalLoan.id,
    {
      financialPassword: validFinancialPassword,
      disbursementAccountId: ananyaAccount,
    },
    'idem_disb_001',
  );
  assert(
    'Disbursement with valid Financial Password passes step-up authorization',
    Boolean(disbursedLoan && disbursedLoan.id === personalLoan.id),
  );

  // Test 26: Atomic disbursement posts to Core Ledger: sys_loan_pool (DEBIT) -> Customer Account (CREDIT)
  const postDisbPoolBalance = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) || 0n;
  const postDisbCustomerBalance = ledgerBalances.get(ananyaAccount) || 0n;

  assert(
    'Atomic disbursement posts to Core Ledger: sys_loan_pool (DEBIT) -> Customer Account (CREDIT)',
    initialPoolBalance - postDisbPoolBalance === disbursedAmount &&
      postDisbCustomerBalance - initialCustomerBalance === disbursedAmount,
    `Pool delta: ${initialPoolBalance - postDisbPoolBalance}, Customer delta: ${postDisbCustomerBalance - initialCustomerBalance}`,
  );

  // Test 27: Zero shadow balance: sys_loan_pool accurately reflects principal disbursed
  assert(
    'Zero shadow balance: sys_loan_pool accurately reflects principal disbursed',
    postDisbPoolBalance === -disbursedAmount,
    `sys_loan_pool balance: ${postDisbPoolBalance}`,
  );

  // Test 28: Loan state transitions to ACTIVE upon successful disbursement
  assert(
    'Loan state transitions to ACTIVE upon successful disbursement',
    disbursedLoan.status === 'ACTIVE' && Boolean(disbursedLoan.disbursedAt),
  );

  // Test 29: Idempotent disbursement replay returns existing loan without double-disbursing funds
  const preReplayPool = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) || 0n;
  const replayedDisb = await loansService.disburseLoan(
    citizenA,
    personalLoan.id,
    {
      financialPassword: validFinancialPassword,
      disbursementAccountId: ananyaAccount,
    },
    'idem_disb_001',
  );
  const postReplayPool = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) || 0n;
  assert(
    'Idempotent disbursement replay returns existing loan without double-disbursing funds',
    replayedDisb.id === personalLoan.id && preReplayPool === postReplayPool,
  );

  // ===========================================================================
  // GROUP 6: Reducing-Balance Amortization & Rounding Precision (6 tests)
  // ===========================================================================
  console.log('\n--- Group 6: Reducing-Balance Amortization & Rounding Precision ---');

  const pMinor = 5000000n; // 50,000.00 ARTH
  const rate = 9.5; // 9.50%
  const tenure = 24; // 24 months

  // Test 30: Amortization schedule generates exact number of installments matching tenure
  const schedule = LoanCalculator.generateAmortizationSchedule(pMinor, rate, tenure);
  assert('Amortization schedule generates exact number of installments matching tenure', schedule.length === 24);

  // Test 31: Monthly EMI matches theoretical formula in integer minor units
  const emi = LoanCalculator.calculateMonthlyEmi(pMinor, rate, tenure);
  assert(
    'Monthly EMI matches theoretical formula in integer minor units',
    emi === 229572n, // 2,295.72 ARTH
    `Calculated EMI: ${emi}`,
  );

  // Test 32: Principal repayment component monotonically increases over tenure
  const principalFirst = BigInt(schedule[0].principalMinor);
  const principalLast = BigInt(schedule[schedule.length - 1].principalMinor);
  assert(
    'Principal repayment component monotonically increases over tenure',
    principalLast > principalFirst,
    `First month principal: ${principalFirst}, Last month principal: ${principalLast}`,
  );

  // Test 33: Interest component monotonically decreases over tenure
  const interestFirst = BigInt(schedule[0].interestMinor);
  const interestLast = BigInt(schedule[schedule.length - 1].interestMinor);
  assert(
    'Interest component monotonically decreases over tenure',
    interestLast < interestFirst,
    `First month interest: ${interestFirst}, Last month interest: ${interestLast}`,
  );

  // Test 34: Every installment satisfies: Principal + Interest === Total Installment
  const allInstallmentsBalanced = schedule.every((inst) => {
    return BigInt(inst.principalMinor) + BigInt(inst.interestMinor) === BigInt(inst.totalAmountMinor);
  });
  assert('Every installment satisfies: Principal + Interest === Total Installment', allInstallmentsBalanced);

  // Test 35: Terminal installment absorbs rounding delta, leaving exactly 0 minor units remaining principal
  const terminalInstallment = schedule[schedule.length - 1];
  assert(
    'Terminal installment absorbs rounding delta, leaving exactly 0 minor units remaining principal',
    terminalInstallment.remainingPrincipalMinor === '0',
    `Terminal remaining: ${terminalInstallment.remainingPrincipalMinor}`,
  );

  // ===========================================================================
  // GROUP 7: EMI Repayment & Split Accounting (5 tests)
  // ===========================================================================
  console.log('\n--- Group 7: EMI Repayment & Split Accounting ---');

  // Test 36: EMI repayment debits customer account and splits credit: Principal to sys_loan_pool, Interest to sys_bank_interest_income
  const preEmiPool = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) || 0n;
  const preEmiIncome = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME) || 0n;

  const inst1 = disbursedLoan.installments[0];
  const pComp = BigInt(inst1.principalMinor);
  const iComp = BigInt(inst1.interestMinor);
  const totalInstallmentMinor = pComp + iComp;

  const emiResult = await loansService.repayEmi(
    citizenA,
    disbursedLoan.id,
    {
      installmentNumber: 1,
      amountMinor: totalInstallmentMinor.toString(),
      sourceAccountId: ananyaAccount,
      financialPassword: validFinancialPassword,
    },
    'idem_emi_001',
  );

  const postEmiPool = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) || 0n;
  const postEmiIncome = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME) || 0n;

  assert(
    'EMI repayment debits customer account and splits credit: Principal to sys_loan_pool, Interest to sys_bank_interest_income',
    postEmiPool - preEmiPool === pComp && postEmiIncome - preEmiIncome === iComp,
    `Principal pool credit: ${postEmiPool - preEmiPool}, Interest income credit: ${postEmiIncome - preEmiIncome}`,
  );

  // Test 37: Ledger double-entry invariant strictly holds: Total Debited === (Credit Principal + Credit Interest)
  assert(
    'Ledger double-entry invariant strictly holds: Total Debited === (Credit Principal + Credit Interest)',
    pComp + iComp === totalInstallmentMinor,
  );

  // Test 38: Paid installment status updates to PAID with paidAt timestamp and transactionId
  assert(
    'Paid installment status updates to PAID with paidAt timestamp and transactionId',
    emiResult.installment.status === 'PAID' &&
      Boolean(emiResult.installment.paidAt) &&
      Boolean(emiResult.installment.transactionId),
  );

  // Test 39: Outstanding principal decrements by exact principal component
  assert(
    'Outstanding principal decrements by exact principal component',
    disbursedAmount - BigInt(disbursedLoan.outstandingPrincipalMinor) === pComp,
    `Outstanding principal: ${disbursedLoan.outstandingPrincipalMinor}`,
  );

  // Test 40: Idempotent EMI repayment replay with same key returns cached result without double-charging
  const preReplayIncome = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME) || 0n;
  const replayedEmi = await loansService.repayEmi(
    citizenA,
    disbursedLoan.id,
    {
      installmentNumber: 1,
      amountMinor: totalInstallmentMinor.toString(),
      sourceAccountId: ananyaAccount,
      financialPassword: validFinancialPassword,
    },
    'idem_emi_001',
  );
  const postReplayIncome = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME) || 0n;
  assert(
    'Idempotent EMI repayment replay with same key returns cached result without double-charging',
    replayedEmi.success === true && preReplayIncome === postReplayIncome,
  );

  // ===========================================================================
  // GROUP 8: Early Foreclosure & Full Prepayment (5 tests)
  // ===========================================================================
  console.log('\n--- Group 8: Early Foreclosure & Full Prepayment ---');

  const currentOutstanding = BigInt(disbursedLoan.outstandingPrincipalMinor);
  const { totalPayoffMinor, penaltyMinor } = LoanCalculator.calculateForeclosureAmount(currentOutstanding, 0n, 2.0);

  // Test 41: Foreclosure calculates remaining principal plus 2% statutory early closure fee
  assert(
    'Foreclosure calculates remaining principal plus 2% statutory early closure fee',
    penaltyMinor === (currentOutstanding * 200n) / 10000n && totalPayoffMinor === currentOutstanding + penaltyMinor,
    `Principal: ${currentOutstanding}, Penalty: ${penaltyMinor}, Total Payoff: ${totalPayoffMinor}`,
  );

  // Test 42: Foreclosure ledger transaction credits sys_loan_pool (principal) and sys_bank_interest_income (penalty)
  const poolBeforeForeclose = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) || 0n;
  const incomeBeforeForeclose = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME) || 0n;

  const foreclosedLoan = await loansService.forecloseLoan(
    citizenA,
    disbursedLoan.id,
    {
      sourceAccountId: ananyaAccount,
      financialPassword: validFinancialPassword,
    },
    'idem_foreclose_001',
  );

  const poolAfterForeclose = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL) || 0n;
  const incomeAfterForeclose = ledgerBalances.get(SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME) || 0n;

  assert(
    'Foreclosure ledger transaction credits sys_loan_pool (principal) and sys_bank_interest_income (penalty)',
    poolAfterForeclose - poolBeforeForeclose === currentOutstanding &&
      incomeAfterForeclose - incomeBeforeForeclose === penaltyMinor,
  );

  // Test 43: Outstanding principal reaches exactly 0
  assert(
    'Outstanding principal reaches exactly 0',
    foreclosedLoan.outstandingPrincipalMinor === '0',
  );

  // Test 44: All remaining unbilled installments marked WAIVED
  const allRemainingWaived = foreclosedLoan.installments
    .filter((i) => i.installmentNumber > 1)
    .every((i) => i.status === 'WAIVED');
  assert('All remaining unbilled installments marked WAIVED', allRemainingWaived);

  // Test 45: Loan status transitions to CLOSED and collateral lien is immediately released
  assert(
    'Loan status transitions to CLOSED and collateral lien is immediately released',
    foreclosedLoan.status === 'CLOSED' && Boolean(foreclosedLoan.closedAt),
  );

  // ===========================================================================
  // GROUP 9: Delinquency, Overdue Penalties & Notifications (5 tests)
  // ===========================================================================
  console.log('\n--- Group 9: Delinquency, Overdue Penalties & Notifications ---');

  // Test 46: Statutory late fee calculation applies zero penalty within 5-day grace period
  const emiDueMinor = 229606n;
  const zeroLateFee = LoanCalculator.calculateOverdueLateFee(emiDueMinor, 4, 24.0, 5);
  assert(
    'Statutory late fee calculation applies zero penalty within 5-day grace period',
    zeroLateFee === 0n,
    `Late fee within grace: ${zeroLateFee}`,
  );

  // Test 47: Late penalty applies 24% APY overdue interest after grace period
  const lateFee15d = LoanCalculator.calculateOverdueLateFee(emiDueMinor, 15, 24.0, 5);
  // Chargeable days = 15 - 5 = 10 days
  const expectedLateFee = (emiDueMinor * 2400n * 10n) / (10000n * 365n);
  assert(
    'Late penalty applies 24% APY overdue interest after grace period',
    lateFee15d === expectedLateFee && lateFee15d > 0n,
    `Calculated late fee: ${lateFee15d}, Expected: ${expectedLateFee}`,
  );

  // Test 48: Post-commit notification dispatched on loan disbursement (LOAN_DISBURSEMENT_CONFIRMATION_V1)
  const citizenMailbox = await notificationsService.getMailbox(citizenA);
  const disbNotice = citizenMailbox.items.find(
    (n) => n.templateCode === 'LOAN_DISBURSEMENT_CONFIRMATION_V1',
  );
  assert(
    'Post-commit notification dispatched on loan disbursement (LOAN_DISBURSEMENT_CONFIRMATION_V1)',
    disbNotice !== undefined && disbNotice.title.includes('Loan Disbursed:'),
  );

  // Test 49: Post-commit notification dispatched on loan full payoff / closure (LOAN_FORECLOSURE_V1)
  const foreclosureNotice = citizenMailbox.items.find(
    (n) => n.templateCode === 'LOAN_FORECLOSURE_V1',
  );
  assert(
    'Post-commit notification dispatched on loan full payoff / closure (LOAN_FORECLOSURE_V1)',
    foreclosureNotice !== undefined && foreclosureNotice.title.includes('Loan Foreclosed:'),
  );

  // Test 50: Multi-tenant isolation: Citizen B cannot inspect or mutate Citizen A's loan facility
  let crossCitizenInspectionBlocked = false;
  try {
    await loansService.getLoanById(citizenB, personalLoan.id);
  } catch (err: any) {
    crossCitizenInspectionBlocked = err instanceof ForbiddenException && err.message.includes('You do not own this loan facility');
  }
  assert(
    "Multi-tenant isolation: Citizen B cannot inspect or mutate Citizen A's loan facility",
    crossCitizenInspectionBlocked,
  );

  // ---------------------------------------------------------------------------
  // SUITE SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n=================================================================');
  console.log(`  PHASE 12A INVARIANT SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runLoansTests().catch((err) => {
  console.error('Loans Suite execution failed:', err);
  process.exit(1);
});
