import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import {
  TransactionType,
  TransactionScope,
  TransactionDto,
} from '@arthax/types';
import { PrismaService } from '../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { BalanceEngineService } from './balance-engine.service';
import { LedgerStateMachine } from './ledger-state-machine';
import {
  assertDoubleEntryBalance,
  assertNonNegativeBalance,
  PostEntryInstruction,
} from './ledger-invariants';

export interface PostTransactionRequest {
  idempotencyKey?: string;
  referenceNumber?: string;
  type: TransactionType;
  scope: TransactionScope;
  amountMinor: bigint;
  feesMinor?: bigint;
  taxMinor?: bigint;
  initiatedBy?: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  metadata?: Record<string, unknown>;
  entries: PostEntryInstruction[];
}

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly balanceEngine: BalanceEngineService,
  ) {}

  /**
   * Asserts that persistent database is available.
   * INVARIANT: Financial writes MUST fail safely if PostgreSQL is unavailable.
   * No fallback to transient memory is permitted for the sovereign ledger.
   */
  private assertDatabasePersistence(): void {
    if (!this.prisma.isConnected) {
      this.logger.error('Financial write rejected: Sovereign PostgreSQL database is offline.');
      throw new ServiceUnavailableException(
        'Financial write rejected: Sovereign PostgreSQL database is unavailable. Ledger transactions require durable ACID persistence and cannot be executed in transient memory.',
      );
    }
  }

  /**
   * Controlled atomic execution of a double-entry journal transaction.
   * Invariant: SUM(Debits) === SUM(Credits).
   * All external domains (Banking, Stocks, Shop, Rewards) must post through this service.
   */
  async recordBalancedTransaction(request: PostTransactionRequest): Promise<TransactionDto> {
    this.assertDatabasePersistence();

    const { entries, amountMinor } = request;

    // 1. Double-entry mathematical check
    if (amountMinor <= 0n) {
      throw new BadRequestException('Transaction principal amount must be positive');
    }
    assertDoubleEntryBalance(entries);

    const ref =
      request.referenceNumber ||
      request.idempotencyKey ||
      `TX-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // 2. Idempotency verification
    const existing = await this.prisma.transaction.findUnique({
      where: { referenceNumber: ref },
      include: { entries: true },
    });

    if (existing) {
      // Check for identical payload replay
      const isSameAmount = existing.amountMinor === amountMinor;
      const isSameType = existing.type === request.type;
      const isSameEntriesCount = existing.entries.length === entries.length;

      if (isSameAmount && isSameType && isSameEntriesCount) {
        this.logger.log(`Idempotent transaction replay returned for ref [${ref}]`);
        return this.mapToTransactionDto(existing);
      }

      throw new ConflictException(
        `Idempotency conflict: A transaction with reference/key [${ref}] already exists with differing parameters.`,
      );
    }

    // 3. Atomic execution inside a single database transaction
    return await this.prisma.$transaction(async (tx) => {
      // Step A: PENDING state creation
      const createdTx = await tx.transaction.create({
        data: {
          referenceNumber: ref,
          type: request.type,
          status: 'PENDING',
          scope: request.scope,
          amountMinor: amountMinor,
          feesMinor: request.feesMinor || 0n,
          taxMinor: request.taxMinor || 0n,
          initiatedBy: request.initiatedBy,
          sourceAccountId: request.sourceAccountId,
          destinationAccountId: request.destinationAccountId,
          metadata: (request.metadata as any) || null,
        },
      });

      // Step B: Advance to VALIDATING
      LedgerStateMachine.assertTransition('PENDING', 'VALIDATING');
      await tx.transaction.update({
        where: { id: createdTx.id },
        data: { status: 'VALIDATING' },
      });

      // Validate accounts and non-negative balance constraints
      const accountDeltas = new Map<string, bigint>();
      for (const entry of entries) {
        const currentDelta = accountDeltas.get(entry.ledgerAccountId) || 0n;
        const entryDelta = entry.entryType === 'CREDIT' ? entry.amountMinor : -entry.amountMinor;
        accountDeltas.set(entry.ledgerAccountId, currentDelta + entryDelta);
      }

      for (const [acctId, delta] of accountDeltas.entries()) {
        const ledgerAcct = await tx.ledgerAccount.findUnique({
          where: { id: acctId },
        });

        if (!ledgerAcct) {
          throw new NotFoundException(`Referenced ledger account [${acctId}] does not exist.`);
        }

        // If delta is negative, verify account has sufficient balance
        if (delta < 0n) {
          const requiredDebit = -delta;
          assertNonNegativeBalance(ledgerAcct.balanceSnapshot, requiredDebit, acctId);
        }
      }

      // Step C: Advance to AUTHORIZED
      LedgerStateMachine.assertTransition('VALIDATING', 'AUTHORIZED');
      await tx.transaction.update({
        where: { id: createdTx.id },
        data: { status: 'AUTHORIZED' },
      });

      // Step D: Advance to PROCESSING and create immutable entries
      LedgerStateMachine.assertTransition('AUTHORIZED', 'PROCESSING');
      await tx.transaction.update({
        where: { id: createdTx.id },
        data: { status: 'PROCESSING' },
      });

      const createdEntries = [];
      for (const entry of entries) {
        const createdEntry = await tx.transactionEntry.create({
          data: {
            transactionId: createdTx.id,
            ledgerAccountId: entry.ledgerAccountId,
            entryType: entry.entryType,
            amountMinor: entry.amountMinor,
          },
        });
        createdEntries.push(createdEntry);
      }

      // Step E: Advance to SETTLING and update balance snapshots
      LedgerStateMachine.assertTransition('PROCESSING', 'SETTLING');
      await tx.transaction.update({
        where: { id: createdTx.id },
        data: { status: 'SETTLING' },
      });

      for (const [acctId, delta] of accountDeltas.entries()) {
        await tx.ledgerAccount.update({
          where: { id: acctId },
          data: {
            balanceSnapshot: { increment: delta },
            snapshotAt: new Date(),
          },
        });
      }

      // Step F: Advance to FINALIZING
      LedgerStateMachine.assertTransition('SETTLING', 'FINALIZING');
      await tx.transaction.update({
        where: { id: createdTx.id },
        data: { status: 'FINALIZING' },
      });

      // Step G: Advance to COMPLETED
      LedgerStateMachine.assertTransition('FINALIZING', 'COMPLETED');
      const completedTx = await tx.transaction.update({
        where: { id: createdTx.id },
        data: { status: 'COMPLETED' },
      });

      // Step H: Audit event
      await this.auditService.logEvent({
        eventType: 'MONETARY_EVENT',
        actorId: request.initiatedBy || 'LEDGER_ENGINE',
        actorRole: 'SYSTEM',
        targetEntity: `TRANSACTION:${completedTx.id}`,
        action: `Double-entry journal posted: Ref ${ref} | Type ${request.type} | Amount ${amountMinor} minor units`,
        severity: 'INFO',
      });

      this.logger.log(
        `[LEDGER POST COMPLETED] Ref: ${ref} | Type: ${request.type} | Amount: ${amountMinor.toString()} minor units`,
      );

      return this.mapToTransactionDto({
        ...completedTx,
        entries: createdEntries,
      });
    });
  }

  /**
   * Reverses a previously COMPLETED transaction.
   * INVARIANT: Historical entries are NEVER mutated. Reversal creates equal and opposite
   * contra-balancing entries, and transitions the original transaction to REVERSED.
   */
  async reverseTransaction(transactionId: string, reason: string): Promise<TransactionDto> {
    this.assertDatabasePersistence();

    return await this.prisma.$transaction(async (tx) => {
      const originalTx = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: { entries: true },
      });

      if (!originalTx) {
        throw new NotFoundException(`Transaction [${transactionId}] not found`);
      }

      if (originalTx.status === 'REVERSED') {
        throw new BadRequestException(`Transaction [${transactionId}] is already reversed.`);
      }

      if (originalTx.status !== 'COMPLETED') {
        throw new BadRequestException(
          `Only COMPLETED transactions can be reversed. Current status: [${originalTx.status}]`,
        );
      }

      // Generate equal and opposite contra-entries
      const contraEntries: PostEntryInstruction[] = originalTx.entries.map((entry) => ({
        ledgerAccountId: entry.ledgerAccountId,
        entryType: entry.entryType === 'DEBIT' ? 'CREDIT' : 'DEBIT',
        amountMinor: entry.amountMinor,
      }));

      assertDoubleEntryBalance(contraEntries);

      const reversalRef = `REV-${originalTx.referenceNumber}`;

      // Create reversing transaction
      const reversalTx = await tx.transaction.create({
        data: {
          referenceNumber: reversalRef,
          type: 'REVERSAL',
          status: 'COMPLETED',
          scope: originalTx.scope,
          amountMinor: originalTx.amountMinor,
          feesMinor: 0n,
          taxMinor: 0n,
          initiatedBy: 'REVERSAL_SYSTEM',
          sourceAccountId: originalTx.destinationAccountId,
          destinationAccountId: originalTx.sourceAccountId,
          failureReason: null,
          metadata: {
            reversedTransactionId: originalTx.id,
            reversalReason: reason,
          },
        },
      });

      // Insert immutable contra-entries
      const insertedContraEntries = [];
      for (const ce of contraEntries) {
        const created = await tx.transactionEntry.create({
          data: {
            transactionId: reversalTx.id,
            ledgerAccountId: ce.ledgerAccountId,
            entryType: ce.entryType,
            amountMinor: ce.amountMinor,
          },
        });
        insertedContraEntries.push(created);

        // Adjust snapshot
        const delta = ce.entryType === 'CREDIT' ? ce.amountMinor : -ce.amountMinor;
        await tx.ledgerAccount.update({
          where: { id: ce.ledgerAccountId },
          data: {
            balanceSnapshot: { increment: delta },
            snapshotAt: new Date(),
          },
        });
      }

      // Transition original transaction status to REVERSED
      LedgerStateMachine.assertTransition('COMPLETED', 'REVERSED');
      await tx.transaction.update({
        where: { id: originalTx.id },
        data: {
          status: 'REVERSED',
          failureReason: `Reversed by [${reversalTx.id}]: ${reason}`,
        },
      });

      await this.auditService.logEvent({
        eventType: 'MONETARY_EVENT',
        actorId: 'REVERSAL_ENGINE',
        actorRole: 'SYSTEM',
        targetEntity: `TRANSACTION:${originalTx.id}`,
        action: `Transaction [${originalTx.referenceNumber}] reversed via contra-transaction [${reversalRef}]. Reason: ${reason}`,
        severity: 'CRITICAL',
      });

      return this.mapToTransactionDto({
        ...reversalTx,
        entries: insertedContraEntries,
      });
    });
  }

  /**
   * Fetches full transaction details including balanced entries and lifecycle status.
   */
  async getTransaction(idOrRef: string): Promise<TransactionDto> {
    this.assertDatabasePersistence();

    const tx = await this.prisma.transaction.findFirst({
      where: {
        OR: [{ id: idOrRef }, { referenceNumber: idOrRef }],
      },
      include: { entries: true },
    });

    if (!tx) {
      throw new NotFoundException(`Transaction [${idOrRef}] not found`);
    }

    return this.mapToTransactionDto(tx);
  }

  /**
   * Fetches account balance: both cached snapshot and verified raw calculation.
   */
  async getAccountBalance(ledgerAccountId: string): Promise<{
    ledgerAccountId: string;
    balanceSnapshotMinor: string;
    rawBalanceMinor: string;
    isReconciled: boolean;
  }> {
    this.assertDatabasePersistence();

    const account = await this.prisma.ledgerAccount.findUnique({
      where: { id: ledgerAccountId },
    });

    if (!account) {
      throw new NotFoundException(`Ledger account [${ledgerAccountId}] not found`);
    }

    const rawBalance = await this.balanceEngine.calculateRawBalance(ledgerAccountId);
    const isReconciled = rawBalance === account.balanceSnapshot;

    return {
      ledgerAccountId,
      balanceSnapshotMinor: account.balanceSnapshot.toString(),
      rawBalanceMinor: rawBalance.toString(),
      isReconciled,
    };
  }

  private mapToTransactionDto(tx: any): TransactionDto {
    return {
      id: tx.id,
      referenceNumber: tx.referenceNumber,
      type: tx.type,
      status: tx.status,
      scope: tx.scope,
      amountMinor: tx.amountMinor.toString(),
      feesMinor: tx.feesMinor ? tx.feesMinor.toString() : '0',
      taxMinor: tx.taxMinor ? tx.taxMinor.toString() : '0',
      initiatedBy: tx.initiatedBy,
      sourceAccountId: tx.sourceAccountId,
      destinationAccountId: tx.destinationAccountId,
      settlementId: tx.settlementId,
      failureReason: tx.failureReason,
      metadata: tx.metadata,
      entries: tx.entries?.map((e: any) => ({
        id: e.id,
        transactionId: e.transactionId,
        ledgerAccountId: e.ledgerAccountId,
        entryType: e.entryType,
        amountMinor: e.amountMinor.toString(),
        createdAt: e.createdAt?.toISOString ? e.createdAt.toISOString() : new Date().toISOString(),
      })),
      createdAt: tx.createdAt?.toISOString ? tx.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: tx.updatedAt?.toISOString ? tx.updatedAt.toISOString() : new Date().toISOString(),
    };
  }
}
