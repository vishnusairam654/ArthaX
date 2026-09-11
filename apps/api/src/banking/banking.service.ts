import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
  Optional,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { AuditService } from '../audit/audit.service';
import { ClsService } from '../cls/cls.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationTemplates } from '../notifications/notification-templates';
import {
  TransferRequestInput,
  OpenAccountInput,
  UpdateCustomerStatusInput,
  UpdateAccountStatusInput,
  UpdateAccountLimitsInput,
} from '@arthax/validation';
import {
  BankAccountDto,
  BankCustomerDto,
  BankDto,
  BankProductDto,
  BankAdminOverviewDto,
  TransactionDto,
} from '@arthax/types';

@Injectable()
export class BankingService {
  private readonly logger = new Logger(BankingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ledgerService: LedgerService,
    private readonly auditService: AuditService,
    @Optional() private readonly clsService?: ClsService,
    @Optional() private readonly notificationsService?: NotificationsService,
  ) {}

  // ===========================================================================
  // 1. BANK MANAGEMENT & 5 CANONICAL BANKS
  // ===========================================================================

  async listBanks(): Promise<BankDto[]> {
    if (this.prisma.isConnected) {
      try {
        const banks = await this.prisma.bank.findMany({
          orderBy: { id: 'asc' },
        });
        if (banks && banks.length > 0) {
          return banks.map((b) => ({
            id: b.id,
            name: b.name,
            shortName: b.shortName,
            tagline: b.tagline,
            logoPath: b.logoPath,
            licenseNumber: b.licenseNumber,
            establishedDate: b.establishedDate.toISOString().split('T')[0],
            accentColor: b.accentColor,
            status: b.status as any,
            ownership: b.ownership,
            governingDirector: b.governingDirector,
          }));
        }
      } catch (err) {
        this.logger.warn(`Could not read banks from DB: ${(err as Error).message}`);
      }
    }

    // Canonical 5 Banks definition
    return [
      {
        id: 'nava',
        name: 'NAVA Sovereign Commercial Bank',
        shortName: 'NAVA',
        tagline: 'The Primary Sovereign Clearing Node',
        logoPath: '/assets/banks/nava_bank.png',
        licenseNumber: 'SCB-2024-001-NV',
        establishedDate: '2024-01-15',
        accentColor: '#1E3A5F',
        status: 'ACTIVE',
        ownership: '100% Sovereign State Charter',
        governingDirector: 'Devendra Sen',
      },
      {
        id: 'samaya',
        name: 'SAMAYA Term Deposit Depository',
        shortName: 'SAMAYA',
        tagline: 'High-Yield Sovereign Term Vaults',
        logoPath: '/assets/banks/samaya_bank.png',
        licenseNumber: 'SCB-2024-002-SM',
        establishedDate: '2024-02-01',
        accentColor: '#A8742A',
        status: 'ACTIVE',
        ownership: 'Cooperative Sovereign Trust',
        governingDirector: 'Meera Nambiar',
      },
      {
        id: 'setu',
        name: 'SETU Clearing & Depository Bank',
        shortName: 'SETU',
        tagline: 'Sub-Second Real-Time Rail & Depository Gateway',
        logoPath: '/assets/banks/setu_bank.png',
        licenseNumber: 'SCB-2024-003-STU',
        establishedDate: '2024-03-10',
        accentColor: '#287A55',
        status: 'ACTIVE',
        ownership: 'Central Depository & Retail Rail Federation',
        governingDirector: 'Vikramaditya Joshi',
      },
      {
        id: 'sthira',
        name: 'STHIRA Prudential Custody Bank',
        shortName: 'STHIRA',
        tagline: 'Institutional Reserve Custodian',
        logoPath: '/assets/banks/sthira_bank.png',
        licenseNumber: 'SCB-2024-004-ST',
        establishedDate: '2024-04-18',
        accentColor: '#7C3AED',
        status: 'ACTIVE',
        ownership: 'Inter-Bank Reserve Consortium',
        governingDirector: 'Sunita Rao',
      },
      {
        id: 'vayu',
        name: 'VAYU Digital Liquidity Bank',
        shortName: 'VAYU',
        tagline: 'Algorithmic Liquidity Routing',
        logoPath: '/assets/banks/vayu_bank.png',
        licenseNumber: 'SCB-2024-005-VY',
        establishedDate: '2024-05-22',
        accentColor: '#0EA5E9',
        status: 'ACTIVE',
        ownership: 'Sovereign FinTech Guild',
        governingDirector: 'Kavita Menon',
      },
    ];
  }

  async getBank(bankId: string): Promise<BankDto> {
    const banks = await this.listBanks();
    const bank = banks.find((b) => b.id.toLowerCase() === bankId.toLowerCase());
    if (!bank) {
      throw new NotFoundException(`Bank [${bankId}] not found`);
    }
    return bank;
  }

  async listBankProducts(bankId: string): Promise<BankProductDto[]> {
    const canonicalProducts: Record<string, BankProductDto[]> = {
      nava: [
        {
          id: 'prod_nava_savings',
          bankId: 'nava',
          name: 'Sovereign Primary Savings Account',
          category: 'SAVINGS',
          description: 'Master treasury account with zero minimum balance and instant settlement.',
          minBalanceMinor: '0',
          features: { instantRail: true, directClearing: true },
          active: true,
        },
        {
          id: 'prod_nava_current',
          bankId: 'nava',
          name: 'NAVA Sovereign Commercial Account',
          category: 'CURRENT',
          description: 'High-volume commercial account with 500,000 ARTH daily limit.',
          minBalanceMinor: '100000',
          features: { commercialCredits: true, priorityClearing: true },
          active: true,
        },
      ],
      samaya: [
        {
          id: 'prod_samaya_term',
          bankId: 'samaya',
          name: 'SAMAYA Compound Term Vault',
          category: 'SAVINGS',
          description: 'High-yield sovereign savings vehicle with tiered interest accrual.',
          minBalanceMinor: '50000',
          features: { compoundInterest: true, monthlyPayout: true },
          active: true,
        },
      ],
      setu: [
        {
          id: 'prod_setu_transit',
          bankId: 'setu',
          name: 'SETU Rapid Transit Rail Account',
          category: 'CURRENT',
          description: 'Sub-second inter-account transit buffer for sovereign commerce.',
          minBalanceMinor: '0',
          features: { subSecondClearing: true, autoSweep: true },
          active: true,
        },
      ],
      sthira: [
        {
          id: 'prod_sthira_custody',
          bankId: 'sthira',
          name: 'STHIRA Safe Custody Vault',
          category: 'SAVINGS',
          description: 'HSM-backed collateral custody account with enhanced audit verification.',
          minBalanceMinor: '500000',
          features: { hsmProtected: true, multiSignature: true },
          active: true,
        },
      ],
      vayu: [
        {
          id: 'prod_vayu_float',
          bankId: 'vayu',
          name: 'VAYU Instant Liquidity Float',
          category: 'CURRENT',
          description: 'Zero-balance algorithmic liquidity routing account.',
          minBalanceMinor: '0',
          features: { zeroBalanceSweep: true, microTransfers: true },
          active: true,
        },
      ],
    };

    return canonicalProducts[bankId.toLowerCase()] || [];
  }

  // ===========================================================================
  // 2. CUSTOMER RELATIONSHIPS
  // ===========================================================================

  async joinBank(userId: string, bankId: string): Promise<BankCustomerDto> {
    const bank = await this.getBank(bankId);
    if (bank.status !== 'ACTIVE') {
      throw new BadRequestException(`Bank [${bank.name}] is currently ${bank.status}; cannot join.`);
    }

    const existing = await this.prisma.bankCustomer.findUnique({
      where: {
        userId_bankId: {
          userId,
          bankId: bank.id,
        },
      },
      include: {
        accounts: {
          include: { ledgerAccount: true },
        },
      },
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        throw new BadRequestException(`You are already an active customer of ${bank.name}.`);
      }
      if (existing.status === 'SUSPENDED') {
        throw new ForbiddenException(
          `Your relationship with ${bank.name} is suspended. Please contact bank administration.`,
        );
      }
      if (existing.status === 'CLOSED') {
        // Re-open customer relationship
        const reopened = await this.prisma.bankCustomer.update({
          where: { id: existing.id },
          data: { status: 'ACTIVE' },
        });
        return this.mapCustomerDto(reopened);
      }
    }

    // Atomic creation of Customer + Primary Savings Account + LedgerAccount
    return await this.prisma.$transaction(async (tx) => {
      const custNumber = `CUST-${bank.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const customer = await tx.bankCustomer.create({
        data: {
          userId,
          bankId: bank.id,
          customerNumber: custNumber,
          status: 'ACTIVE',
          tier: 'Tier-1 Sovereign Citizen',
        },
      });

      const acctNumber = `ARTH-${bank.id.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const account = await tx.bankAccount.create({
        data: {
          accountNumber: acctNumber,
          customerId: customer.id,
          bankId: bank.id,
          userId,
          type: 'SAVINGS',
          purpose: 'Primary Sovereign Savings',
          status: 'ACTIVE',
          dailyLimitMinor: 5000000n, // 50,000.00 ARTH
          monthlyLimitMinor: 50000000n, // 500,000.00 ARTH
        },
      });

      // Exactly 1 matching LedgerAccount with opening balance = 0n
      await tx.ledgerAccount.create({
        data: {
          accountType: 'BANK_ACCOUNT',
          ownerEntityId: account.id,
          ownerEntityType: 'BANK_ACCOUNT',
          balanceSnapshot: 0n,
          bankAccountId: account.id,
        },
      });

      await this.auditService.logEvent({
        eventType: 'BANK_ACTION',
        actorId: userId,
        actorRole: 'USER',
        targetEntity: `BANK_CUSTOMER:${customer.id}`,
        action: `Citizen joined ${bank.name}. Customer Number: ${custNumber}, Primary Account: ${acctNumber}`,
        severity: 'INFO',
      });

      this.logger.log(`Citizen [${userId}] joined Bank [${bank.id}] with account [${acctNumber}]`);

      return this.mapCustomerDto(customer, [account]);
    });
  }

  async updateCustomerStatus(
    assignedBankId: string,
    customerId: string,
    input: UpdateCustomerStatusInput,
  ): Promise<BankCustomerDto> {
    const customer = await this.prisma.bankCustomer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer [${customerId}] not found`);
    }

    // Defense-in-depth: enforce bank ownership inside service layer
    this.assertBankOwnership(assignedBankId, customer.bankId, 'Customer');

    const updated = await this.prisma.bankCustomer.update({
      where: { id: customerId },
      data: { status: input.status },
    });

    await this.auditService.logEvent({
      eventType: 'BANK_ACTION',
      actorId: `ADMIN_${assignedBankId.toUpperCase()}`,
      actorRole: 'BANK_ADMIN',
      targetEntity: `BANK_CUSTOMER:${customerId}`,
      action: `Customer status updated to [${input.status}] for [${customer.customerNumber}]`,
      severity: input.status === 'SUSPENDED' ? 'WARNING' : 'INFO',
    });

    return this.mapCustomerDto(updated);
  }

  // ===========================================================================
  // 3. ACCOUNT MANAGEMENT
  // ===========================================================================

  async openAccount(userId: string, input: OpenAccountInput): Promise<BankAccountDto> {
    const bank = await this.getBank(input.bankId);
    if (bank.status !== 'ACTIVE') {
      throw new BadRequestException(`Bank [${bank.name}] is ${bank.status}; cannot open accounts.`);
    }

    // Verify user and step-up financial password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const isPasswordValid = await argon2.verify(
      user.financialPasswordHash,
      input.financialPassword,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
    }

    // Customer relation check
    const customer = await this.prisma.bankCustomer.findUnique({
      where: {
        userId_bankId: {
          userId,
          bankId: bank.id,
        },
      },
    });

    if (!customer) {
      throw new BadRequestException(
        `You must establish a customer relationship with ${bank.name} before opening accounts.`,
      );
    }

    if (customer.status === 'SUSPENDED') {
      throw new ForbiddenException(
        'Your customer status is SUSPENDED. Opening new accounts is prohibited.',
      );
    }

    if (customer.status === 'CLOSED') {
      throw new ForbiddenException(
        'Your customer status is CLOSED. Opening new accounts is prohibited.',
      );
    }

    // Atomic creation of BankAccount + LedgerAccount (Invariant: opening balance = 0n)
    return await this.prisma.$transaction(async (tx) => {
      const acctNumber = `ARTH-${bank.id.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const newAccount = await tx.bankAccount.create({
        data: {
          accountNumber: acctNumber,
          customerId: customer.id,
          bankId: bank.id,
          userId,
          type: input.accountType,
          purpose: input.purpose,
          status: 'ACTIVE',
          dailyLimitMinor: 5000000n, // 50,000.00 ARTH default
          monthlyLimitMinor: 50000000n, // 500,000.00 ARTH default
        },
      });

      const ledgerAccount = await tx.ledgerAccount.create({
        data: {
          accountType: 'BANK_ACCOUNT',
          ownerEntityId: newAccount.id,
          ownerEntityType: 'BANK_ACCOUNT',
          balanceSnapshot: 0n,
          bankAccountId: newAccount.id,
        },
      });

      await this.auditService.logEvent({
        eventType: 'BANK_ACTION',
        actorId: userId,
        actorRole: 'USER',
        targetEntity: `BANK_ACCOUNT:${newAccount.id}`,
        action: `New ${input.accountType} account [${acctNumber}] opened at ${bank.name}. Purpose: ${input.purpose}`,
        severity: 'INFO',
      });

      this.logger.log(`Account [${acctNumber}] created for user [${userId}] at [${bank.id}]`);

      return this.mapAccountDto(newAccount, ledgerAccount);
    });
  }

  async listUserAccounts(userId: string, bankId?: string): Promise<BankAccountDto[]> {
    const whereClause: any = { userId };
    if (bankId) {
      whereClause.bankId = bankId.toLowerCase();
    }

    const accounts = await this.prisma.bankAccount.findMany({
      where: whereClause,
      include: { ledgerAccount: true },
      orderBy: { createdAt: 'desc' },
    });

    return accounts.map((a) => this.mapAccountDto(a, a.ledgerAccount));
  }

  async getAccountDetails(userId: string, accountId: string): Promise<BankAccountDto> {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: accountId },
      include: { ledgerAccount: true },
    });

    if (!account) {
      throw new NotFoundException(`Account [${accountId}] not found`);
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied: You do not own this account.');
    }

    return this.mapAccountDto(account, account.ledgerAccount);
  }

  async getAccountTransactions(userId: string, accountId: string): Promise<TransactionDto[]> {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException(`Account [${accountId}] not found`);
    }

    if (account.userId !== userId) {
      throw new ForbiddenException('Access denied: You do not own this account.');
    }

    const txs = await this.prisma.transaction.findMany({
      where: {
        OR: [{ sourceAccountId: accountId }, { destinationAccountId: accountId }],
        status: 'COMPLETED',
      },
      include: { entries: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return txs.map((t) => ({
      id: t.id,
      referenceNumber: t.referenceNumber,
      type: t.type,
      status: t.status,
      scope: t.scope,
      amountMinor: t.amountMinor.toString(),
      feesMinor: t.feesMinor.toString(),
      taxMinor: t.taxMinor.toString(),
      initiatedBy: t.initiatedBy || undefined,
      sourceAccountId: t.sourceAccountId || undefined,
      destinationAccountId: t.destinationAccountId || undefined,
      metadata: (t.metadata as Record<string, unknown>) || undefined,
      entries: t.entries.map((e) => ({
        id: e.id,
        transactionId: e.transactionId,
        ledgerAccountId: e.ledgerAccountId,
        entryType: e.entryType,
        amountMinor: e.amountMinor.toString(),
        createdAt: e.createdAt.toISOString(),
      })),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));
  }

  // ===========================================================================
  // 4. INTRA-BANK TRANSFERS (STRICT ATOMIC PIPELINE)
  // ===========================================================================

  async executeIntraBankTransfer(
    userId: string,
    input: TransferRequestInput,
    idempotencyKey?: string,
  ): Promise<{ success: boolean; transaction: TransactionDto }> {
    const amountMinor = BigInt(input.amountMinor);
    if (amountMinor <= 0n) {
      throw new BadRequestException('Transfer amount must be strictly greater than zero');
    }

    // 1. Verify User & Step-Up Financial Password
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await argon2.verify(
      user.financialPasswordHash,
      input.financialPassword,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid Financial Password. Step-up authorization failed.');
    }

    // 2. Validate Source Account & Ownership
    const sourceAccount = await this.prisma.bankAccount.findUnique({
      where: { id: input.sourceAccountId },
      include: { customer: true, ledgerAccount: true },
    });

    if (!sourceAccount) {
      throw new NotFoundException(`Source account [${input.sourceAccountId}] not found`);
    }

    if (sourceAccount.userId !== userId) {
      throw new ForbiddenException('Unauthorized: You do not own the source account');
    }

    if (sourceAccount.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Source account is currently ${sourceAccount.status}; transfers are prohibited.`,
      );
    }

    // 3. Customer Status Effect Invariant
    if (sourceAccount.customer.status === 'SUSPENDED') {
      throw new ForbiddenException(
        'Your customer relationship is SUSPENDED; new transfers are blocked.',
      );
    }
    if (sourceAccount.customer.status === 'CLOSED') {
      throw new ForbiddenException(
        'Your customer relationship is CLOSED; financial operations are blocked.',
      );
    }

    // 4. Validate Destination Account
    const destAccount = await this.prisma.bankAccount.findUnique({
      where: { accountNumber: input.destinationAccountNumber },
      include: { customer: true, ledgerAccount: true },
    });

    if (!destAccount) {
      throw new NotFoundException(
        `Destination account [${input.destinationAccountNumber}] not found in ARTHAX registry.`,
      );
    }

    if (destAccount.id === sourceAccount.id) {
      throw new BadRequestException('Cannot transfer funds to the same account.');
    }

    if (destAccount.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Destination account is currently ${destAccount.status}; cannot receive funds.`,
      );
    }

    if (destAccount.customer.status === 'CLOSED') {
      throw new BadRequestException('Destination customer relationship is CLOSED; cannot receive funds.');
    }

    // 5. Cumulative Daily Limit Check (Atomic calculation across today's completed debits)
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const todayTxs = await this.prisma.transaction.findMany({
      where: {
        sourceAccountId: sourceAccount.id,
        status: 'COMPLETED',
        createdAt: { gte: startOfDay },
      },
      select: { amountMinor: true },
    });

    const todayTotalDebits = todayTxs.reduce((sum, tx) => sum + tx.amountMinor, 0n);
    if (todayTotalDebits + amountMinor > sourceAccount.dailyLimitMinor) {
      throw new BadRequestException(
        `Cumulative daily limit exceeded. Limit: ${sourceAccount.dailyLimitMinor} minor units, Transferred today: ${todayTotalDebits} minor units, Attempted: ${amountMinor} minor units.`,
      );
    }

    // 6. ROUTING: INTRA-BANK (PHASE 5) VS INTER-BANK CLS CLEARING (PHASE 6)
    if (sourceAccount.bankId.toLowerCase() !== destAccount.bankId.toLowerCase()) {
      if (!this.clsService) {
        throw new BadRequestException(
          `Inter-bank clearing transfer (${sourceAccount.bankId.toUpperCase()} -> ${destAccount.bankId.toUpperCase()}) requires Central Settlement Layer (CLS).`,
        );
      }

      this.logger.log(
        `Cross-bank transfer detected: [${sourceAccount.bankId}] -> [${destAccount.bankId}]. Delegating to Central Settlement Layer (CLS).`,
      );

      const settlement = await this.clsService.initiateInterbankSettlement({
        sourceAccountId: sourceAccount.id,
        sourceBankId: sourceAccount.bankId,
        destinationAccountId: destAccount.id,
        destinationBankId: destAccount.bankId,
        amountMinor,
        initiatedByUserId: userId,
        idempotencyKey,
        executionMode: 'RTGS',
        purpose: input.memo || 'Inter-bank transfer via CLS',
      });

      return {
        success: settlement.stage === 'COMPLETED',
        transaction: {
          id: settlement.id,
          referenceNumber: settlement.reference,
          type: 'TRANSFER',
          status: settlement.stage === 'COMPLETED' ? 'COMPLETED' : 'PROCESSING',
          scope: 'INTER_BANK',
          amountMinor: settlement.amountMinor,
          feesMinor: settlement.feeLevyMinor,
          taxMinor: '0',
          initiatedBy: userId,
          sourceAccountId: sourceAccount.id,
          destinationAccountId: destAccount.id,
          metadata: {
            clsSettlementId: settlement.id,
            clsReference: settlement.reference,
            clearingLatencyMs: settlement.clearingLatencyMs,
          },
          entries: [],
          createdAt: settlement.createdAt,
          updatedAt: settlement.updatedAt,
        },
      };
    }

    // 7. Balance & Double-Entry Post via Core Ledger
    if (!sourceAccount.ledgerAccount || !destAccount.ledgerAccount) {
      throw new BadRequestException('Matching ledger accounts not provisioned for transfer participants.');
    }

    const txRef =
      input.idempotencyKey ||
      idempotencyKey ||
      `TX-${sourceAccount.bankId.toUpperCase()}-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const ledgerTx = await this.ledgerService.recordBalancedTransaction({
      idempotencyKey: txRef,
      referenceNumber: txRef,
      type: 'TRANSFER',
      scope: 'INTERNAL',
      amountMinor,
      feesMinor: 0n,
      taxMinor: 0n,
      initiatedBy: userId,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destAccount.id,
      metadata: {
        memo: input.memo || 'Intra-bank transfer',
        sourceAccountNumber: sourceAccount.accountNumber,
        destinationAccountNumber: destAccount.accountNumber,
        bankId: sourceAccount.bankId,
      },
      entries: [
        {
          ledgerAccountId: sourceAccount.ledgerAccount.id,
          entryType: 'DEBIT',
          amountMinor,
        },
        {
          ledgerAccountId: destAccount.ledgerAccount.id,
          entryType: 'CREDIT',
          amountMinor,
        },
      ],
    });

    await this.auditService.logEvent({
      eventType: 'MONETARY_EVENT',
      actorId: userId,
      actorRole: 'USER',
      targetEntity: `TRANSACTION:${ledgerTx.id}`,
      action: `Intra-bank transfer completed: ${sourceAccount.accountNumber} -> ${destAccount.accountNumber} [${amountMinor} minor units] at Bank [${sourceAccount.bankId.toUpperCase()}]`,
      severity: 'INFO',
    });

    // 8. Post-Commit Sovereign Notification Dispatch
    if (this.notificationsService) {
      // Direct Credit Notice to Recipient
      try {
        const creditTemplate = NotificationTemplates.BANK_TRANSFER_RECEIVED_V1.render({
          amountMinor,
          senderBank: sourceAccount.bankId.toUpperCase(),
          txId: ledgerTx.id,
          targetAccount: destAccount.accountNumber,
        });
        await this.notificationsService.dispatchNotification({
          userId: destAccount.userId,
          category: creditTemplate.category,
          priority: creditTemplate.priority,
          title: creditTemplate.title,
          summary: creditTemplate.summary,
          content: creditTemplate.content,
          templateCode: creditTemplate.templateCode,
          templateVersion: creditTemplate.templateVersion,
          sourceDomain: 'BANKING',
          sourceType: 'TRANSFER_RECEIVED',
          sourceId: ledgerTx.id,
          eventId: `tx-recv-${ledgerTx.id}`,
          metadata: {
            amountMinor: amountMinor.toString(),
            sourceBank: sourceAccount.bankId,
            txId: ledgerTx.id,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Post-commit recipient notification dispatch skipped/failed: ${err.message}`);
      }

      // Direct Debit Notice to Sender
      try {
        const debitTemplate = NotificationTemplates.BANK_TRANSFER_SENT_V1.render({
          amountMinor,
          recipientBank: destAccount.bankId.toUpperCase(),
          txId: ledgerTx.id,
          sourceAccount: sourceAccount.accountNumber,
        });
        await this.notificationsService.dispatchNotification({
          userId,
          category: debitTemplate.category,
          priority: debitTemplate.priority,
          title: debitTemplate.title,
          summary: debitTemplate.summary,
          content: debitTemplate.content,
          templateCode: debitTemplate.templateCode,
          templateVersion: debitTemplate.templateVersion,
          sourceDomain: 'BANKING',
          sourceType: 'TRANSFER_SENT',
          sourceId: ledgerTx.id,
          eventId: `tx-sent-${ledgerTx.id}`,
          metadata: {
            amountMinor: amountMinor.toString(),
            destinationBank: destAccount.bankId,
            txId: ledgerTx.id,
          },
        });
      } catch (err: any) {
        this.logger.warn(`Post-commit sender notification dispatch skipped/failed: ${err.message}`);
      }
    }

    return {
      success: true,
      transaction: ledgerTx,
    };
  }

  // ===========================================================================
  // 5. BANK ADMIN OPERATIONS (/bank PORTAL)
  // ===========================================================================

  async getBankAdminOverview(assignedBankId: string): Promise<BankAdminOverviewDto> {
    const bank = await this.getBank(assignedBankId);

    const [customerCount, accounts] = await Promise.all([
      this.prisma.bankCustomer.count({
        where: { bankId: assignedBankId },
      }),
      this.prisma.bankAccount.findMany({
        where: { bankId: assignedBankId },
        include: { ledgerAccount: true },
      }),
    ]);

    const activeAccountsCount = accounts.filter((a) => a.status === 'ACTIVE').length;
    const totalDeposits = accounts.reduce(
      (sum, a) => sum + (a.ledgerAccount?.balanceSnapshot || 0n),
      0n,
    );

    // Today's volume
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const todayTxs = await this.prisma.transaction.findMany({
      where: {
        createdAt: { gte: startOfDay },
        status: 'COMPLETED',
        OR: [
          { sourceAccount: { bankId: assignedBankId } },
          { destinationAccount: { bankId: assignedBankId } },
        ],
      },
      select: { amountMinor: true },
    });

    const todayVolume = todayTxs.reduce((sum, tx) => sum + tx.amountMinor, 0n);

    return {
      bankId: bank.id,
      bankName: bank.name,
      totalAssetsMinor: (totalDeposits * 12n / 10n).toString(), // Assets projection
      totalDepositsMinor: totalDeposits.toString(),
      customerCount,
      activeAccountsCount,
      todayTransactionCount: todayTxs.length,
      todayVolumeMinor: todayVolume.toString(),
      status: bank.status,
    };
  }

  async listBankAdminCustomers(assignedBankId: string): Promise<BankCustomerDto[]> {
    const customers = await this.prisma.bankCustomer.findMany({
      where: { bankId: assignedBankId },
      include: {
        accounts: {
          include: { ledgerAccount: true },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    return customers.map((c) => this.mapCustomerDto(c, c.accounts));
  }

  async getBankAdminCustomer(assignedBankId: string, customerId: string): Promise<BankCustomerDto> {
    const customer = await this.prisma.bankCustomer.findUnique({
      where: { id: customerId },
      include: {
        accounts: {
          include: { ledgerAccount: true },
        },
      },
    });

    if (!customer) throw new NotFoundException(`Customer [${customerId}] not found`);
    this.assertBankOwnership(assignedBankId, customer.bankId, 'Customer');

    return this.mapCustomerDto(customer, customer.accounts);
  }

  async listBankAdminAccounts(assignedBankId: string): Promise<BankAccountDto[]> {
    const accounts = await this.prisma.bankAccount.findMany({
      where: { bankId: assignedBankId },
      include: { ledgerAccount: true },
      orderBy: { createdAt: 'desc' },
    });

    return accounts.map((a) => this.mapAccountDto(a, a.ledgerAccount));
  }

  async updateBankAccountStatus(
    assignedBankId: string,
    accountId: string,
    input: UpdateAccountStatusInput,
  ): Promise<BankAccountDto> {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: accountId },
      include: { ledgerAccount: true },
    });

    if (!account) throw new NotFoundException(`Account [${accountId}] not found`);
    this.assertBankOwnership(assignedBankId, account.bankId, 'Account');

    const updated = await this.prisma.bankAccount.update({
      where: { id: accountId },
      data: { status: input.status },
      include: { ledgerAccount: true },
    });

    await this.auditService.logEvent({
      eventType: 'BANK_ACTION',
      actorId: `ADMIN_${assignedBankId.toUpperCase()}`,
      actorRole: 'BANK_ADMIN',
      targetEntity: `BANK_ACCOUNT:${accountId}`,
      action: `Account status updated to [${input.status}] for account [${account.accountNumber}]`,
      severity: input.status === 'FROZEN' ? 'WARNING' : 'INFO',
    });

    return this.mapAccountDto(updated, updated.ledgerAccount);
  }

  async updateBankAccountLimits(
    assignedBankId: string,
    accountId: string,
    input: UpdateAccountLimitsInput,
  ): Promise<BankAccountDto> {
    const account = await this.prisma.bankAccount.findUnique({
      where: { id: accountId },
      include: { ledgerAccount: true },
    });

    if (!account) throw new NotFoundException(`Account [${accountId}] not found`);
    this.assertBankOwnership(assignedBankId, account.bankId, 'Account');

    const updateData: any = {};
    if (input.dailyLimitMinor) updateData.dailyLimitMinor = BigInt(input.dailyLimitMinor);
    if (input.monthlyLimitMinor) updateData.monthlyLimitMinor = BigInt(input.monthlyLimitMinor);

    const updated = await this.prisma.bankAccount.update({
      where: { id: accountId },
      data: updateData,
      include: { ledgerAccount: true },
    });

    await this.auditService.logEvent({
      eventType: 'BANK_ACTION',
      actorId: `ADMIN_${assignedBankId.toUpperCase()}`,
      actorRole: 'BANK_ADMIN',
      targetEntity: `BANK_ACCOUNT:${accountId}`,
      action: `Limits modified for account [${account.accountNumber}]: Daily=${input.dailyLimitMinor || 'unchanged'}, Monthly=${input.monthlyLimitMinor || 'unchanged'}`,
      severity: 'INFO',
    });

    return this.mapAccountDto(updated, updated.ledgerAccount);
  }

  async listBankAdminTransactions(assignedBankId: string): Promise<TransactionDto[]> {
    const txs = await this.prisma.transaction.findMany({
      where: {
        OR: [
          { sourceAccount: { bankId: assignedBankId } },
          { destinationAccount: { bankId: assignedBankId } },
        ],
      },
      include: { entries: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return txs.map((t) => ({
      id: t.id,
      referenceNumber: t.referenceNumber,
      type: t.type,
      status: t.status,
      scope: t.scope,
      amountMinor: t.amountMinor.toString(),
      feesMinor: t.feesMinor.toString(),
      taxMinor: t.taxMinor.toString(),
      initiatedBy: t.initiatedBy || undefined,
      sourceAccountId: t.sourceAccountId || undefined,
      destinationAccountId: t.destinationAccountId || undefined,
      metadata: (t.metadata as Record<string, unknown>) || undefined,
      entries: t.entries.map((e) => ({
        id: e.id,
        transactionId: e.transactionId,
        ledgerAccountId: e.ledgerAccountId,
        entryType: e.entryType,
        amountMinor: e.amountMinor.toString(),
        createdAt: e.createdAt.toISOString(),
      })),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));
  }

  // ===========================================================================
  // INTERNAL HELPERS & INVARIANT ENFORCEMENT
  // ===========================================================================

  /**
   * Defense-in-depth: enforces bank ownership inside service layer.
   * Prevents cross-bank access even if a controller guard is misconfigured.
   */
  private assertBankOwnership(assignedBankId: string, entityBankId: string, entityName: string): void {
    if (assignedBankId.toLowerCase() !== entityBankId.toLowerCase()) {
      throw new ForbiddenException(
        `Cross-bank authorization rejected. Administrator is assigned to [${assignedBankId.toUpperCase()}], cannot operate on ${entityName} belonging to [${entityBankId.toUpperCase()}].`,
      );
    }
  }

  private mapAccountDto(account: any, ledgerAccount?: any): BankAccountDto {
    return {
      id: account.id,
      accountNumber: account.accountNumber,
      customerId: account.customerId,
      bankId: account.bankId,
      userId: account.userId,
      type: account.type,
      purpose: account.purpose,
      status: account.status,
      balanceMinor: ledgerAccount?.balanceSnapshot ? ledgerAccount.balanceSnapshot.toString() : '0',
      dailyLimitMinor: account.dailyLimitMinor ? account.dailyLimitMinor.toString() : '5000000',
      monthlyLimitMinor: account.monthlyLimitMinor ? account.monthlyLimitMinor.toString() : '50000000',
      createdAt: account.createdAt?.toISOString ? account.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: account.updatedAt?.toISOString ? account.updatedAt.toISOString() : new Date().toISOString(),
    };
  }

  private mapCustomerDto(customer: any, accounts?: any[]): BankCustomerDto {
    return {
      id: customer.id,
      userId: customer.userId,
      bankId: customer.bankId,
      customerNumber: customer.customerNumber,
      status: customer.status,
      tier: customer.tier,
      joinedAt: customer.joinedAt?.toISOString ? customer.joinedAt.toISOString() : new Date().toISOString(),
      accounts: accounts?.map((a) => this.mapAccountDto(a, a.ledgerAccount)),
    };
  }
}
