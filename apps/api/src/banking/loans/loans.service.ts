import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Optional,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { LedgerService } from '../../ledger/ledger.service';
import { AuditService } from '../../audit/audit.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { CreditUnderwritingService } from './credit-underwriting.service';
import { LoanCalculator } from './loan-calculator';
import { SOVEREIGN_SYSTEM_ACCOUNTS } from '../../ledger/ledger-invariants';
import {
  LoanProductDto,
  UserLoanDto,
  LoanRepaymentInstallmentDto,
  LoanCollateralDto,
  LoanStatus,
  CreditAssessmentDto,
  LoanSimulationResultDto,
  TransactionType,
  TransactionScope,
} from '@arthax/types';
import {
  ApplyLoanInput,
  ReviewLoanInput,
  DisburseLoanInput,
  PayLoanEmiInput,
  ForecloseLoanInput,
  LoanSimulationInput,
} from '@arthax/validation';

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);

  // In-memory catalog of canonical loan products across the 5 banks
  private products = new Map<string, LoanProductDto>();

  // In-memory active loans: loanId -> UserLoanDto
  private memoryLoans = new Map<string, UserLoanDto>();

  // In-memory mock balances: accountId -> bigint
  private mockAccountBalances = new Map<string, bigint>();

  // Idempotency registry: key -> { payloadHash: string; result: any }
  private idempotencyRegistry = new Map<string, { payloadHash: string; result: any }>();

  // Collateral lien registry: assetReferenceId -> { loanId: string; locked: boolean }
  private collateralLienRegistry = new Map<string, { loanId: string; locked: boolean }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly ledgerService: LedgerService,
    private readonly auditService: AuditService,
    private readonly underwritingService: CreditUnderwritingService,
    @Optional() private readonly notificationsService?: NotificationsService,
  ) {
    this.initializeCanonicalProducts();
  }

  /**
   * Initializes the 5 canonical commercial loan products across the 5 banks.
   */
  private initializeCanonicalProducts(): void {
    const canonicalProducts: LoanProductDto[] = [
      {
        id: 'prod_nava_personal',
        bankId: 'nava',
        name: 'NAVA Sovereign Personal Credit Facility',
        category: 'PERSONAL',
        description: 'Unsecured sovereign term loan for certified citizens with tiered interest rates.',
        baseInterestRate: 9.5, // 9.50%
        minPrincipalMinor: '1000000', // 10,000.00 ARTH
        maxPrincipalMinor: '20000000', // 200,000.00 ARTH
        minTenureMonths: 6,
        maxTenureMonths: 36,
        processingFeePercent: 0.5,
        collateralRequired: false,
        status: 'ACTIVE',
      },
      {
        id: 'prod_samaya_business',
        bankId: 'samaya',
        name: 'SAMAYA Sovereign Commercial Enterprise Loan',
        category: 'BUSINESS',
        description: 'Working capital and capital expenditure credit facility for sovereign commerce entities.',
        baseInterestRate: 8.5, // 8.50%
        minPrincipalMinor: '5000000', // 50,000.00 ARTH
        maxPrincipalMinor: '100000000', // 1,000,000.00 ARTH
        minTenureMonths: 12,
        maxTenureMonths: 60,
        processingFeePercent: 0.75,
        collateralRequired: true,
        minCollateralRatioPercent: 120,
        status: 'ACTIVE',
      },
      {
        id: 'prod_setu_transit',
        bankId: 'setu',
        name: 'SETU Rapid Transit Micro-Credit Line',
        category: 'COLLATERAL_CREDIT',
        description: 'Sub-second revolving commercial credit buffer tied to transit settlement volumes.',
        baseInterestRate: 10.0, // 10.00%
        minPrincipalMinor: '500000', // 5,000.00 ARTH
        maxPrincipalMinor: '10000000', // 100,000.00 ARTH
        minTenureMonths: 3,
        maxTenureMonths: 24,
        processingFeePercent: 0.25,
        collateralRequired: false,
        status: 'ACTIVE',
      },
      {
        id: 'prod_sthira_mortgage',
        bankId: 'sthira',
        name: 'STHIRA Secured Sovereign Mortgage & Custody Credit',
        category: 'HOUSING',
        description: 'Long-tenure collateral-backed estate development and vault custody credit.',
        baseInterestRate: 7.25, // 7.25%
        minPrincipalMinor: '10000000', // 100,000.00 ARTH
        maxPrincipalMinor: '200000000', // 2,000,000.00 ARTH
        minTenureMonths: 24,
        maxTenureMonths: 240,
        processingFeePercent: 1.0,
        collateralRequired: true,
        minCollateralRatioPercent: 130,
        status: 'ACTIVE',
      },
      {
        id: 'prod_vayu_liquidity',
        bankId: 'vayu',
        name: 'VAYU Instant Liquidity Float Facility',
        category: 'PERSONAL',
        description: 'Ultra-fast low-tenure bridge financing with algorithmic risk assessment.',
        baseInterestRate: 11.5, // 11.50%
        minPrincipalMinor: '100000', // 1,000.00 ARTH
        maxPrincipalMinor: '5000000', // 50,000.00 ARTH
        minTenureMonths: 1,
        maxTenureMonths: 12,
        processingFeePercent: 0.2,
        collateralRequired: false,
        status: 'ACTIVE',
      },
    ];

    for (const prod of canonicalProducts) {
      this.products.set(prod.id, prod);
    }
  }

  /**
   * Helper to seed/credit an account balance in test/mock storage.
   */
  seedAccountBalance(accountId: string, balanceMinor: bigint): void {
    this.mockAccountBalances.set(accountId, balanceMinor);
  }

  /**
   * Retrieves balance of an account from DB or test storage.
   */
  async getAccountBalance(accountId: string): Promise<bigint> {
    if (this.prisma && this.prisma.isConnected) {
      try {
        const acct = await this.prisma.bankAccount.findUnique({
          where: { id: accountId },
          include: { ledgerAccount: true },
        });
        if (acct?.ledgerAccount) {
          return acct.ledgerAccount.balanceSnapshot;
        }
      } catch (err: any) {
        this.logger.debug(`DB balance lookup error for [${accountId}]: ${err.message}`);
      }
    }
    return this.mockAccountBalances.get(accountId) ?? 5000000n; // Default 50,000.00 ARTH
  }

  /**
   * Checks whether an asset (e.g. Fixed Deposit) is currently locked under a loan lien.
   */
  isAssetLienLocked(assetReferenceId: string): boolean {
    const record = this.collateralLienRegistry.get(assetReferenceId);
    return record ? record.locked : false;
  }

  // ===========================================================================
  // 1. LOAN PRODUCT DISCOVERY & SIMULATION
  // ===========================================================================

  async listLoanProducts(bankId?: string): Promise<LoanProductDto[]> {
    const all = Array.from(this.products.values()).filter((p) => p.status === 'ACTIVE');
    if (bankId) {
      return all.filter((p) => p.bankId.toLowerCase() === bankId.toLowerCase());
    }
    return all;
  }

  async getLoanProduct(productId: string): Promise<LoanProductDto> {
    const prod = this.products.get(productId);
    if (!prod) {
      throw new NotFoundException(`Loan product [${productId}] not found`);
    }
    return prod;
  }

  simulateLoan(input: LoanSimulationInput): LoanSimulationResultDto {
    const product = this.products.get(input.productId);
    if (!product) {
      throw new NotFoundException(`Loan product [${input.productId}] not found`);
    }

    const principalMinor = BigInt(input.principalMinor);
    if (principalMinor < BigInt(product.minPrincipalMinor)) {
      throw new BadRequestException(
        `Requested principal (${principalMinor}) is below minimum limit (${product.minPrincipalMinor})`,
      );
    }
    if (principalMinor > BigInt(product.maxPrincipalMinor)) {
      throw new BadRequestException(
        `Requested principal (${principalMinor}) exceeds maximum product limit (${product.maxPrincipalMinor})`,
      );
    }

    if (input.tenureMonths < product.minTenureMonths || input.tenureMonths > product.maxTenureMonths) {
      throw new BadRequestException(
        `Tenure (${input.tenureMonths} months) must be between ${product.minTenureMonths} and ${product.maxTenureMonths} months`,
      );
    }

    const emiMinor = LoanCalculator.calculateMonthlyEmi(
      principalMinor,
      product.baseInterestRate,
      input.tenureMonths,
    );

    const schedule = LoanCalculator.generateAmortizationSchedule(
      principalMinor,
      product.baseInterestRate,
      input.tenureMonths,
    );

    const totalRepaymentMinor = schedule.reduce((sum, inst) => sum + BigInt(inst.totalAmountMinor), 0n);
    const totalInterestMinor = totalRepaymentMinor - principalMinor;
    const processingFeeMinor =
      (principalMinor * BigInt(Math.round(product.processingFeePercent * 100))) / 10000n;

    return {
      requestedPrincipalMinor: principalMinor.toString(),
      annualInterestRate: product.baseInterestRate,
      tenureMonths: input.tenureMonths,
      monthlyEmiMinor: emiMinor.toString(),
      totalInterestMinor: totalInterestMinor.toString(),
      totalRepaymentMinor: totalRepaymentMinor.toString(),
      processingFeeMinor: processingFeeMinor.toString(),
      schedule,
    };
  }

  // ===========================================================================
  // 2. CREDIT UNDERWRITING ASSESSMENT
  // ===========================================================================

  async assessCitizenCredit(
    userId: string,
    requestedPrincipalMinor: string,
    collateralAppraisedValueMinor?: string,
  ): Promise<CreditAssessmentDto> {
    const principal = BigInt(requestedPrincipalMinor);
    const collateralValue = collateralAppraisedValueMinor ? BigInt(collateralAppraisedValueMinor) : undefined;

    // Count user's current active loans
    const userLoans = Array.from(this.memoryLoans.values()).filter(
      (l) => l.userId === userId && (l.status === 'ACTIVE' || l.status === 'OVERDUE' || l.status === 'DELINQUENT'),
    );
    const activeLoanCount = userLoans.length;
    const existingMonthlyEmi = userLoans.reduce((sum, l) => sum + BigInt(l.monthlyEmiMinor), 0n);

    return this.underwritingService.assessApplicant({
      userId,
      requestedPrincipalMinor: principal,
      activeLoanCount,
      existingMonthlyEmiMinor: existingMonthlyEmi,
      collateralAppraisedValueMinor: collateralValue,
    });
  }

  // ===========================================================================
  // 3. APPLICATION WORKFLOW
  // ===========================================================================

  async applyForLoan(
    userId: string,
    input: ApplyLoanInput,
    idempotencyKey?: string,
  ): Promise<UserLoanDto> {
    // 1. Idempotency Check
    if (idempotencyKey) {
      const payloadHash = crypto.createHash('sha256').update(JSON.stringify({ userId, ...input })).digest('hex');
      const existing = this.idempotencyRegistry.get(idempotencyKey);
      if (existing) {
        if (existing.payloadHash === payloadHash) {
          this.logger.log(`Idempotent loan application replay for key [${idempotencyKey}]`);
          return existing.result;
        }
        throw new ConflictException(`Idempotency conflict: Differing loan application for key [${idempotencyKey}]`);
      }
    }

    // 2. Validate Product & Principal Bounds
    const product = await this.getLoanProduct(input.productId);
    const principalMinor = BigInt(input.requestedPrincipalMinor);

    if (principalMinor < BigInt(product.minPrincipalMinor)) {
      throw new BadRequestException(`Requested principal is below minimum limit for [${product.name}]`);
    }
    if (principalMinor > BigInt(product.maxPrincipalMinor)) {
      throw new BadRequestException(`Requested principal exceeds maximum limit for [${product.name}]`);
    }

    if (input.tenureMonths < product.minTenureMonths || input.tenureMonths > product.maxTenureMonths) {
      throw new BadRequestException(`Tenure must be between ${product.minTenureMonths} and ${product.maxTenureMonths} months`);
    }

    // 3. Credit Underwriting Check
    let collateralVal: bigint | undefined;
    if (input.collateralAssetId) {
      // Validate collateral asset isn't already pledged to another active loan
      if (this.isAssetLienLocked(input.collateralAssetId)) {
        throw new BadRequestException(`Collateral asset [${input.collateralAssetId}] is already pledged under an active lien`);
      }
      collateralVal = (principalMinor * 130n) / 100n; // Standard 130% appraised value
    }

    const assessment = await this.assessCitizenCredit(
      userId,
      input.requestedPrincipalMinor,
      collateralVal?.toString(),
    );

    if (!assessment.eligible) {
      throw new BadRequestException(
        `Credit underwriting rejected application: ${assessment.reasons.join('; ')}`,
      );
    }

    // 4. Create Loan in SUBMITTED status
    const loanId = `loan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const contractNumber = `LN-${product.bankId.toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const emiMinor = LoanCalculator.calculateMonthlyEmi(
      principalMinor,
      assessment.recommendedRate,
      input.tenureMonths,
    );

    const schedule = LoanCalculator.generateAmortizationSchedule(
      principalMinor,
      assessment.recommendedRate,
      input.tenureMonths,
    );

    const collaterals: LoanCollateralDto[] = [];
    if (input.collateralType && input.collateralAssetId) {
      collaterals.push({
        id: `col_${Date.now()}`,
        loanId,
        collateralType: input.collateralType,
        assetReferenceId: input.collateralAssetId,
        appraisedValueMinor: (collateralVal || principalMinor).toString(),
        lienStatus: 'ACTIVE',
        lockedAt: new Date().toISOString(),
        releasedAt: null,
      });
      // Register lien lock
      this.collateralLienRegistry.set(input.collateralAssetId, { loanId, locked: true });
    }

    const loanDto: UserLoanDto = {
      id: loanId,
      contractNumber,
      userId,
      bankId: product.bankId,
      productId: product.id,
      productName: product.name,
      disbursementAccountId: input.disbursementAccountId,
      repaymentAccountId: input.repaymentAccountId,
      loanType: product.category,
      status: 'SUBMITTED',
      principalMinor: principalMinor.toString(),
      interestRate: assessment.recommendedRate,
      tenureMonths: input.tenureMonths,
      monthlyEmiMinor: emiMinor.toString(),
      outstandingPrincipalMinor: principalMinor.toString(),
      totalRepaidPrincipalMinor: '0',
      totalRepaidInterestMinor: '0',
      nextPaymentDueDate: schedule[0]?.dueDate || null,
      installments: schedule,
      collaterals,
      appliedAt: new Date().toISOString(),
      approvedAt: null,
      disbursedAt: null,
      closedAt: null,
      rejectionReason: null,
      approvedByStaffId: null,
      overdueDays: 0,
      latePenaltyInterestMinor: '0',
    };

    this.memoryLoans.set(loanId, loanDto);

    if (idempotencyKey) {
      const payloadHash = crypto.createHash('sha256').update(JSON.stringify({ userId, ...input })).digest('hex');
      this.idempotencyRegistry.set(idempotencyKey, { payloadHash, result: loanDto });
    }

    await this.auditService.logEvent({
      eventType: 'BANK_ACTION',
      actorId: userId,
      actorRole: 'USER',
      targetEntity: 'USER_LOAN',
      action: `Citizen applied for loan [${contractNumber}] of ${principalMinor} minor units`,
      severity: 'INFO',
    });

    return loanDto;
  }

  // ===========================================================================
  // 4. BANK OFFICER UNDERWRITING & APPROVAL
  // ===========================================================================

  async reviewLoan(
    staffUserId: string,
    staffBankId: string,
    loanId: string,
    input: ReviewLoanInput,
  ): Promise<UserLoanDto> {
    const loan = this.memoryLoans.get(loanId);
    if (!loan) {
      throw new NotFoundException(`Loan application [${loanId}] not found`);
    }

    // Verify staff bank scope
    if (loan.bankId.toLowerCase() !== staffBankId.toLowerCase()) {
      throw new ForbiddenException(
        `Staff assigned to bank [${staffBankId}] cannot review loans belonging to [${loan.bankId}]`,
      );
    }

    // State machine check: can only review SUBMITTED or UNDER_REVIEW loans
    if (loan.status !== 'SUBMITTED' && loan.status !== 'UNDER_REVIEW') {
      throw new BadRequestException(`Cannot review loan in [${loan.status}] status`);
    }

    if (input.action === 'APPROVE') {
      loan.status = 'APPROVED';
      loan.approvedAt = new Date().toISOString();
      loan.approvedByStaffId = staffUserId;

      if (input.approvedPrincipalMinor) {
        loan.principalMinor = input.approvedPrincipalMinor;
        loan.outstandingPrincipalMinor = input.approvedPrincipalMinor;
      }
      if (input.approvedInterestRate) {
        loan.interestRate = input.approvedInterestRate;
      }

      // Re-generate schedule with approved terms
      const approvedPrincipal = BigInt(loan.principalMinor);
      loan.monthlyEmiMinor = LoanCalculator.calculateMonthlyEmi(
        approvedPrincipal,
        loan.interestRate,
        loan.tenureMonths,
      ).toString();
      loan.installments = LoanCalculator.generateAmortizationSchedule(
        approvedPrincipal,
        loan.interestRate,
        loan.tenureMonths,
      );

      await this.auditService.logEvent({
        eventType: 'BANK_ACTION',
        actorId: staffUserId,
        actorRole: 'BANK_ADMIN',
        targetEntity: 'USER_LOAN',
        action: `Bank Officer approved loan [${loan.contractNumber}] for ${loan.principalMinor} minor units @ ${loan.interestRate}%`,
        severity: 'NOTICE',
      });

      if (this.notificationsService) {
        await this.notificationsService.dispatchNotification({
          userId: loan.userId,
          category: 'LOAN',
          title: `Loan Approved: ${loan.contractNumber}`,
          summary: `Facility of ${loan.principalMinor} minor units approved by ${loan.bankId.toUpperCase()} Bank`,
          content: `Your loan application has been approved. Please accept disbursement to receive funds.`,
          templateCode: 'LOAN_APPROVAL_NOTICE_V1',
          sourceDomain: 'BANKING',
          sourceType: 'LOAN_APPROVAL',
          sourceId: loan.id,
          eventId: `evt_loan_appr_${Date.now()}`,
          metadata: { contractNumber: loan.contractNumber, principalMinor: loan.principalMinor },
        });
      }
    } else if (input.action === 'REJECT') {
      loan.status = 'REJECTED';
      loan.rejectionReason = input.rejectionReason || 'Underwriting credit review declined';

      // Release any pledged collateral
      for (const col of loan.collaterals) {
        col.lienStatus = 'RELEASED';
        col.releasedAt = new Date().toISOString();
        this.collateralLienRegistry.delete(col.assetReferenceId);
      }

      await this.auditService.logEvent({
        eventType: 'BANK_ACTION',
        actorId: staffUserId,
        actorRole: 'BANK_ADMIN',
        targetEntity: 'USER_LOAN',
        action: `Bank Officer rejected loan [${loan.contractNumber}]: ${loan.rejectionReason}`,
        severity: 'INFO',
      });
    }

    return loan;
  }

  // ===========================================================================
  // 5. ATOMIC DISBURSEMENT & CORE LEDGER ROUTING
  // ===========================================================================

  async disburseLoan(
    userId: string,
    loanId: string,
    input: DisburseLoanInput,
    idempotencyKey?: string,
  ): Promise<UserLoanDto> {
    const loan = this.memoryLoans.get(loanId);
    if (!loan) {
      throw new NotFoundException(`Loan facility [${loanId}] not found`);
    }

    if (loan.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own this loan facility');
    }

    // Idempotency check
    if (idempotencyKey) {
      const payloadHash = crypto.createHash('sha256').update(JSON.stringify({ userId, loanId, input })).digest('hex');
      const existing = this.idempotencyRegistry.get(idempotencyKey);
      if (existing) {
        if (existing.payloadHash === payloadHash) {
          this.logger.log(`Idempotent loan disbursement replay for key [${idempotencyKey}]`);
          return existing.result;
        }
        throw new ConflictException(`Idempotency conflict for disbursement key [${idempotencyKey}]`);
      }
    }

    // State machine check: must be APPROVED
    if (loan.status !== 'APPROVED') {
      throw new BadRequestException(`Cannot disburse loan in [${loan.status}] status (must be APPROVED)`);
    }

    // Verify Financial Password with Argon2id
    if (this.prisma && this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.financialPasswordHash) {
        const isPasswordValid = await argon2.verify(user.financialPasswordHash, input.financialPassword);
        if (!isPasswordValid) {
          throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
        }
      }
    }

    const principalMinor = BigInt(loan.principalMinor);
    const targetAccountId = input.disbursementAccountId || loan.disbursementAccountId;

    // Execute Core Double-Entry Ledger Transaction:
    // DEBIT: sys_loan_pool (Principal)
    // CREDIT: targetAccountId (Principal)
    const ledgerReq = {
      referenceNumber: `TX-DISB-${loan.contractNumber}`,
      type: 'LOAN_DISBURSEMENT' as TransactionType,
      scope: 'INTERNAL' as TransactionScope,
      amountMinor: principalMinor,
      initiatedBy: userId,
      sourceAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL,
      destinationAccountId: targetAccountId,
      metadata: { loanId: loan.id, contractNumber: loan.contractNumber },
      entries: [
        {
          ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL,
          entryType: 'DEBIT' as const,
          amountMinor: principalMinor,
        },
        {
          ledgerAccountId: targetAccountId,
          entryType: 'CREDIT' as const,
          amountMinor: principalMinor,
        },
      ],
    };

    await this.ledgerService.recordBalancedTransaction(ledgerReq);

    // Update local account balance
    const currentBal = await this.getAccountBalance(targetAccountId);
    this.mockAccountBalances.set(targetAccountId, currentBal + principalMinor);

    // Transition loan state: DISBURSED -> ACTIVE
    loan.status = 'ACTIVE';
    loan.disbursedAt = new Date().toISOString();
    loan.disbursementAccountId = targetAccountId;

    if (idempotencyKey) {
      const payloadHash = crypto.createHash('sha256').update(JSON.stringify({ userId, loanId, input })).digest('hex');
      this.idempotencyRegistry.set(idempotencyKey, { payloadHash, result: loan });
    }

    // Post-commit notification dispatch
    if (this.notificationsService) {
      await this.notificationsService.dispatchNotification({
        userId,
        category: 'LOAN',
        title: `Loan Disbursed: ${loan.contractNumber}`,
        summary: `${principalMinor} minor units credited to your account`,
        content: `Your loan facility ${loan.contractNumber} of ${principalMinor} minor units has been disbursed. First EMI due on ${loan.nextPaymentDueDate}.`,
        templateCode: 'LOAN_DISBURSEMENT_CONFIRMATION_V1',
        sourceDomain: 'BANKING',
        sourceType: 'LOAN_DISBURSEMENT',
        sourceId: loan.id,
        eventId: `evt_disb_${Date.now()}`,
        metadata: { contractNumber: loan.contractNumber, amountMinor: principalMinor.toString() },
      });
    }

    await this.auditService.logEvent({
      eventType: 'BANK_ACTION',
      actorId: userId,
      actorRole: 'USER',
      targetEntity: 'USER_LOAN',
      action: `Loan [${loan.contractNumber}] disbursed to account [${targetAccountId}] for ${principalMinor} minor units`,
      severity: 'NOTICE',
    });

    return loan;
  }

  // ===========================================================================
  // 6. EMI REPAYMENT ENGINE & SPLIT ACCOUNTING
  // ===========================================================================

  async repayEmi(
    userId: string,
    loanId: string,
    input: PayLoanEmiInput,
    idempotencyKey?: string,
  ): Promise<{ success: boolean; installment: LoanRepaymentInstallmentDto; remainingBalanceMinor: string }> {
    const loan = this.memoryLoans.get(loanId);
    if (!loan) {
      throw new NotFoundException(`Loan facility [${loanId}] not found`);
    }

    if (loan.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own this loan facility');
    }

    if (loan.status !== 'ACTIVE' && loan.status !== 'PAYMENT_DUE' && loan.status !== 'OVERDUE' && loan.status !== 'DELINQUENT') {
      throw new BadRequestException(`Cannot repay EMI for loan in [${loan.status}] status`);
    }

    // Idempotency check
    if (idempotencyKey) {
      const payloadHash = crypto.createHash('sha256').update(JSON.stringify({ userId, loanId, input })).digest('hex');
      const existing = this.idempotencyRegistry.get(idempotencyKey);
      if (existing) {
        if (existing.payloadHash === payloadHash) {
          this.logger.log(`Idempotent EMI repayment replay for key [${idempotencyKey}]`);
          return existing.result;
        }
        throw new ConflictException(`Idempotency conflict for repayment key [${idempotencyKey}]`);
      }
    }

    // Step-up verification
    if (this.prisma && this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.financialPasswordHash) {
        const isPasswordValid = await argon2.verify(user.financialPasswordHash, input.financialPassword);
        if (!isPasswordValid) {
          throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
        }
      }
    }

    const installment = loan.installments.find((i) => i.installmentNumber === input.installmentNumber);
    if (!installment) {
      throw new NotFoundException(`Installment #${input.installmentNumber} not found`);
    }

    if (installment.status === 'PAID') {
      throw new BadRequestException(`Installment #${input.installmentNumber} is already PAID`);
    }

    const principalPart = BigInt(installment.principalMinor);
    const interestPart = BigInt(installment.interestMinor);
    const totalInstallment = principalPart + interestPart;

    // Check customer account balance
    const sourceAccountId = input.sourceAccountId;
    const balance = await this.getAccountBalance(sourceAccountId);
    if (balance < totalInstallment) {
      throw new BadRequestException(`Insufficient funds for EMI repayment. Required: ${totalInstallment}, Available: ${balance}`);
    }

    // Execute Split Core Ledger Transaction:
    // DEBIT: sourceAccountId (Total Installment)
    // CREDIT: sys_loan_pool (Principal Part)
    // CREDIT: sys_bank_interest_income (Interest Part)
    const ledgerReq = {
      referenceNumber: `TX-EMI-${loan.contractNumber}-${installment.installmentNumber}`,
      type: 'LOAN_REPAYMENT' as TransactionType,
      scope: 'INTERNAL' as TransactionScope,
      amountMinor: totalInstallment,
      initiatedBy: userId,
      sourceAccountId,
      destinationAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL,
      metadata: {
        loanId: loan.id,
        installmentNumber: installment.installmentNumber,
        principalMinor: principalPart.toString(),
        interestMinor: interestPart.toString(),
      },
      entries: [
        {
          ledgerAccountId: sourceAccountId,
          entryType: 'DEBIT' as const,
          amountMinor: totalInstallment,
        },
        {
          ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL,
          entryType: 'CREDIT' as const,
          amountMinor: principalPart,
        },
        {
          ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME,
          entryType: 'CREDIT' as const,
          amountMinor: interestPart,
        },
      ],
    };

    const tx = await this.ledgerService.recordBalancedTransaction(ledgerReq);

    // Update customer account balance
    this.mockAccountBalances.set(sourceAccountId, balance - totalInstallment);

    // Update installment status
    installment.status = 'PAID';
    installment.paidAt = new Date().toISOString();
    installment.transactionId = tx.id;

    // Update loan aggregates
    const currentOutstanding = BigInt(loan.outstandingPrincipalMinor);
    const newOutstanding = currentOutstanding > principalPart ? currentOutstanding - principalPart : 0n;
    loan.outstandingPrincipalMinor = newOutstanding.toString();
    loan.totalRepaidPrincipalMinor = (BigInt(loan.totalRepaidPrincipalMinor) + principalPart).toString();
    loan.totalRepaidInterestMinor = (BigInt(loan.totalRepaidInterestMinor) + interestPart).toString();

    // Check if next installment exists
    const nextUnpaid = loan.installments.find((i) => i.status === 'PENDING' || i.status === 'OVERDUE');
    if (nextUnpaid) {
      loan.nextPaymentDueDate = nextUnpaid.dueDate;
    } else {
      loan.nextPaymentDueDate = null;
    }

    // If all installments paid, close loan and release collateral
    if (newOutstanding === 0n) {
      loan.status = 'CLOSED';
      loan.closedAt = new Date().toISOString();

      for (const col of loan.collaterals) {
        col.lienStatus = 'RELEASED';
        col.releasedAt = new Date().toISOString();
        this.collateralLienRegistry.delete(col.assetReferenceId);
      }

      if (this.notificationsService) {
        await this.notificationsService.dispatchNotification({
          userId,
          category: 'LOAN',
          title: `Loan Fully Settled: ${loan.contractNumber}`,
          summary: `Facility closed successfully. Collateral liens released.`,
          content: `All scheduled installments for loan ${loan.contractNumber} have been settled. Clearance certificate issued.`,
          templateCode: 'LOAN_CLOSURE_V1',
          sourceDomain: 'BANKING',
          sourceType: 'LOAN_CLOSURE',
          sourceId: loan.id,
          eventId: `evt_loan_close_${Date.now()}`,
          metadata: { contractNumber: loan.contractNumber },
        });
      }
    }

    const result = {
      success: true,
      installment,
      remainingBalanceMinor: loan.outstandingPrincipalMinor,
    };

    if (idempotencyKey) {
      const payloadHash = crypto.createHash('sha256').update(JSON.stringify({ userId, loanId, input })).digest('hex');
      this.idempotencyRegistry.set(idempotencyKey, { payloadHash, result });
    }

    return result;
  }

  // ===========================================================================
  // 7. EARLY FORECLOSURE & PREPAYMENT
  // ===========================================================================

  async forecloseLoan(
    userId: string,
    loanId: string,
    input: ForecloseLoanInput,
    idempotencyKey?: string,
  ): Promise<UserLoanDto> {
    const loan = this.memoryLoans.get(loanId);
    if (!loan) {
      throw new NotFoundException(`Loan facility [${loanId}] not found`);
    }

    if (loan.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own this loan facility');
    }

    // Idempotency check
    if (idempotencyKey) {
      const payloadHash = crypto.createHash('sha256').update(JSON.stringify({ userId, loanId, input })).digest('hex');
      const existing = this.idempotencyRegistry.get(idempotencyKey);
      if (existing) {
        if (existing.payloadHash === payloadHash) {
          this.logger.log(`Idempotent foreclosure replay for key [${idempotencyKey}]`);
          return existing.result;
        }
        throw new ConflictException(`Idempotency conflict for foreclosure key [${idempotencyKey}]`);
      }
    }

    if (loan.status !== 'ACTIVE' && loan.status !== 'PAYMENT_DUE' && loan.status !== 'OVERDUE') {
      throw new BadRequestException(`Cannot foreclose loan in [${loan.status}] status`);
    }

    // Step-up verification
    if (this.prisma && this.prisma.isConnected) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user?.financialPasswordHash) {
        const isPasswordValid = await argon2.verify(user.financialPasswordHash, input.financialPassword);
        if (!isPasswordValid) {
          throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
        }
      }
    }

    const outstandingPrincipal = BigInt(loan.outstandingPrincipalMinor);
    const { totalPayoffMinor, penaltyMinor } = LoanCalculator.calculateForeclosureAmount(outstandingPrincipal, 0n, 2.0);

    const sourceAccountId = input.sourceAccountId;
    const balance = await this.getAccountBalance(sourceAccountId);
    if (balance < totalPayoffMinor) {
      throw new BadRequestException(
        `Insufficient funds for loan foreclosure. Required: ${totalPayoffMinor}, Available: ${balance}`,
      );
    }

    // Execute Foreclosure Ledger Transaction:
    // DEBIT: sourceAccountId (Total Payoff)
    // CREDIT: sys_loan_pool (Outstanding Principal)
    // CREDIT: sys_bank_interest_income (Foreclosure Penalty)
    const ledgerReq = {
      referenceNumber: `TX-FORECLOSE-${loan.contractNumber}`,
      type: 'LOAN_REPAYMENT' as TransactionType,
      scope: 'INTERNAL' as TransactionScope,
      amountMinor: totalPayoffMinor,
      initiatedBy: userId,
      sourceAccountId,
      destinationAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL,
      metadata: {
        loanId: loan.id,
        outstandingPrincipalMinor: outstandingPrincipal.toString(),
        penaltyMinor: penaltyMinor.toString(),
      },
      entries: [
        {
          ledgerAccountId: sourceAccountId,
          entryType: 'DEBIT' as const,
          amountMinor: totalPayoffMinor,
        },
        {
          ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.LOAN_POOL,
          entryType: 'CREDIT' as const,
          amountMinor: outstandingPrincipal,
        },
        {
          ledgerAccountId: SOVEREIGN_SYSTEM_ACCOUNTS.BANK_INTEREST_INCOME,
          entryType: 'CREDIT' as const,
          amountMinor: penaltyMinor,
        },
      ],
    };

    await this.ledgerService.recordBalancedTransaction(ledgerReq);

    // Update customer account balance
    this.mockAccountBalances.set(sourceAccountId, balance - totalPayoffMinor);

    // Mark remaining installments as WAIVED
    for (const inst of loan.installments) {
      if (inst.status !== 'PAID') {
        inst.status = 'WAIVED';
      }
    }

    loan.outstandingPrincipalMinor = '0';
    loan.status = 'CLOSED';
    loan.closedAt = new Date().toISOString();
    loan.nextPaymentDueDate = null;

    // Release collateral liens
    for (const col of loan.collaterals) {
      col.lienStatus = 'RELEASED';
      col.releasedAt = new Date().toISOString();
      this.collateralLienRegistry.delete(col.assetReferenceId);
    }

    if (idempotencyKey) {
      const payloadHash = crypto.createHash('sha256').update(JSON.stringify({ userId, loanId, input })).digest('hex');
      this.idempotencyRegistry.set(idempotencyKey, { payloadHash, result: loan });
    }

    if (this.notificationsService) {
      await this.notificationsService.dispatchNotification({
        userId,
        category: 'LOAN',
        title: `Loan Foreclosed: ${loan.contractNumber}`,
        summary: `Facility foreclosed. Total payoff: ${totalPayoffMinor} minor units.`,
        content: `Loan ${loan.contractNumber} has been foreclosed early. Clearance certificate issued and collateral released.`,
        templateCode: 'LOAN_FORECLOSURE_V1',
        sourceDomain: 'BANKING',
        sourceType: 'LOAN_FORECLOSURE',
        sourceId: loan.id,
        eventId: `evt_foreclose_${Date.now()}`,
        metadata: { contractNumber: loan.contractNumber, totalPayoffMinor: totalPayoffMinor.toString() },
      });
    }

    await this.auditService.logEvent({
      eventType: 'BANK_ACTION',
      actorId: userId,
      actorRole: 'USER',
      targetEntity: 'USER_LOAN',
      action: `Citizen foreclosed loan [${loan.contractNumber}] with full payoff of ${totalPayoffMinor} minor units`,
      severity: 'NOTICE',
    });

    return loan;
  }

  // ===========================================================================
  // 8. QUERY METHODS
  // ===========================================================================

  async getCitizenLoans(userId: string): Promise<UserLoanDto[]> {
    return Array.from(this.memoryLoans.values()).filter((l) => l.userId === userId);
  }

  async getLoanById(userId: string, loanId: string): Promise<UserLoanDto> {
    const loan = this.memoryLoans.get(loanId);
    if (!loan) {
      throw new NotFoundException(`Loan [${loanId}] not found`);
    }
    if (loan.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own this loan facility');
    }
    return loan;
  }

  async getBankLoansQueue(bankId: string): Promise<UserLoanDto[]> {
    return Array.from(this.memoryLoans.values()).filter(
      (l) => l.bankId.toLowerCase() === bankId.toLowerCase(),
    );
  }
}
