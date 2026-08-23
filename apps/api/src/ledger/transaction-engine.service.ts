import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import type { CoreTransaction, LedgerAccount, TransactionState } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { LedgerService } from "./ledger.service";
import { assertTransition } from "./state-machine";

export interface TransferCommand {
  idempotencyKey: string;
  amountMinor: bigint;
  fromLedgerAccountId: string;
  toLedgerAccountId: string;
  reference?: string;
}

interface JournalLine {
  accountId: string;
  side: "DEBIT" | "CREDIT";
  amountMinor: bigint;
}

/** Internal sentinel: rolls back the attempt so recordFailure() can persist durably. */
class InsufficientFundsError extends Error {
  constructor() {
    super("Insufficient funds");
    this.name = "InsufficientFundsError";
  }
}

const TX_OPTIONS = { maxWait: 15000, timeout: 60000 };

/**
 * The double-entry transaction engine.
 *
 * Guarantees:
 * - Every executed transaction produces journal entries where sum(debits) == sum(credits).
 * - Idempotency: the same idempotencyKey never executes twice; the original
 *   result is returned.
 * - Concurrency safety: involved accounts are row-locked (FOR UPDATE) for the
 *   duration of validation + posting, preventing double-spending races.
 * - Money is never created or destroyed: postings only move value between accounts.
 */
@Injectable()
export class TransactionEngineService {
  private readonly logger = new Logger(TransactionEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
  ) {}

  async executeTransfer(cmd: TransferCommand): Promise<CoreTransaction> {
    this.assertAmount(cmd.amountMinor);

    // Idempotency fast path (unique constraint backstops any race).
    const existing = await this.prisma.coreTransaction.findUnique({
      where: { idempotencyKey: cmd.idempotencyKey },
    });
    if (existing) return existing;

    const [from, to] = await Promise.all([
      this.ledger.getAccount(cmd.fromLedgerAccountId),
      this.ledger.getAccount(cmd.toLedgerAccountId),
    ]);
    if (!from || !to) throw new NotFoundException("Ledger account not found");

    return this.runStateMachine(cmd, from, to);
  }

  /**
   * Deposit (issuance into circulation): credits the target account against
   * the Central Bank reserve. Used for opening balances and cash-in flows.
   */
  async executeDeposit(cmd: {
    idempotencyKey: string;
    ledgerAccountId: string;
    amountMinor: bigint;
    reference?: string;
  }): Promise<CoreTransaction> {
    this.assertAmount(cmd.amountMinor);
    const existing = await this.prisma.coreTransaction.findUnique({
      where: { idempotencyKey: cmd.idempotencyKey },
    });
    if (existing) return existing;

    const account = await this.ledger.getAccount(cmd.ledgerAccountId);
    if (!account) throw new NotFoundException("Ledger account not found");

    try {
      return await this.prisma.$transaction(async (tx) => {
        const raced = await tx.coreTransaction.findUnique({
          where: { idempotencyKey: cmd.idempotencyKey },
        });
        if (raced) return raced;

        const reserve = await this.ledger.findOrCreateAccount({ kind: "CENTRAL_RESERVE" });

        const txRow = await tx.coreTransaction.create({
          data: {
            idempotencyKey: cmd.idempotencyKey,
            type: "DEPOSIT",
            state: "PENDING",
            amountMinor: cmd.amountMinor,
            toAccountId: account.id,
            reference: cmd.reference,
          },
        });

        await this.transition(tx, txRow.id, "PENDING", "VALIDATING");
        await this.transition(tx, txRow.id, "VALIDATING", "AUTHORIZED");
        await this.transition(tx, txRow.id, "AUTHORIZED", "PROCESSING");

        await this.writeBalancedEntry(tx, txRow.id, `Deposit ${cmd.reference ?? ""}`.trim(), [
          { accountId: reserve.id, side: "DEBIT", amountMinor: cmd.amountMinor },
          { accountId: account.id, side: "CREDIT", amountMinor: cmd.amountMinor },
        ]);

        await this.transition(tx, txRow.id, "PROCESSING", "COMPLETED");
        return tx.coreTransaction.findUniqueOrThrow({ where: { id: txRow.id } });
      }, TX_OPTIONS);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const winner = await this.prisma.coreTransaction.findUnique({
          where: { idempotencyKey: cmd.idempotencyKey },
        });
        if (winner) return winner;
      }
      throw err;
    }
  }

  async getTransactionDetail(id: string) {
    return this.prisma.coreTransaction.findUnique({
      where: { id },
      include: {
        journalEntries: { include: { postings: true } },
        events: true,
      },
    });
  }

  /**
   * Compensating reversal: writes opposite postings in a new transaction and
   * flips the original to REVERSED. History is never mutated or deleted.
   */
  async reverse(originalId: string, idempotencyKey: string): Promise<CoreTransaction> {
    const original = await this.prisma.coreTransaction.findUnique({
      where: { id: originalId },
      include: { journalEntries: { include: { postings: true } } },
    });
    if (!original) throw new NotFoundException("Transaction not found");
    if (original.state !== "COMPLETED") {
      throw new ConflictException("Only COMPLETED transactions can be reversed");
    }
    if (original.type === "REVERSAL") {
      throw new BadRequestException("Cannot reverse a reversal");
    }

    const existing = await this.prisma.coreTransaction.findUnique({
      where: { idempotencyKey },
    });
    if (existing) return existing;

    return this.prisma.$transaction(async (tx) => {
      const locked = await tx.coreTransaction.findUnique({
        where: { id: originalId },
        select: { state: true },
      });
      if (locked?.state !== "COMPLETED") {
        throw new ConflictException("Transaction no longer reversible");
      }

      const reversal = await tx.coreTransaction.create({
        data: {
          idempotencyKey,
          type: "REVERSAL",
          state: "PENDING",
          amountMinor: original.amountMinor,
          fromAccountId: original.toAccountId,
          toAccountId: original.fromAccountId,
          reversalOfId: original.id,
          reference: `Reversal of ${original.id}`,
        },
      });

      const accountIds = [
        ...new Set(original.journalEntries.flatMap((e) => e.postings.map((p) => p.accountId))),
      ];
      await this.ledger.lockAccounts(tx, accountIds);

      await this.transition(tx, reversal.id, "PENDING", "VALIDATING");
      await this.transition(tx, reversal.id, "VALIDATING", "AUTHORIZED");
      await this.transition(tx, reversal.id, "AUTHORIZED", "PROCESSING");

      for (const entry of original.journalEntries) {
        const lines: JournalLine[] = entry.postings.map((p) => ({
          accountId: p.accountId,
          side: p.side === "DEBIT" ? "CREDIT" : "DEBIT",
          amountMinor: p.amountMinor,
        }));
        await this.writeBalancedEntry(tx, reversal.id, `Reversal: ${entry.description}`, lines);
      }

      await this.transition(tx, reversal.id, "PROCESSING", "COMPLETED");
      await tx.coreTransaction.update({
        where: { id: original.id },
        data: { state: "REVERSED" },
      });
      await tx.transactionEvent.create({
        data: {
          transactionId: original.id,
          fromState: "COMPLETED",
          toState: "REVERSED",
          detail: `By ${reversal.id}`,
        },
      });

      return tx.coreTransaction.findUniqueOrThrow({ where: { id: reversal.id } });
    }, TX_OPTIONS);
  }

  // ---------- internals ----------

  private assertAmount(amountMinor: bigint): void {
    if (amountMinor <= 0n) {
      throw new BadRequestException("Amount must be a positive ARTH minor-unit integer");
    }
  }

  private async runStateMachine(
    cmd: TransferCommand,
    from: LedgerAccount,
    to: LedgerAccount,
  ): Promise<CoreTransaction> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // Re-check idempotency under the write lock to close the race window.
        const raced = await tx.coreTransaction.findUnique({
          where: { idempotencyKey: cmd.idempotencyKey },
        });
        if (raced) return raced;

        const txRow = await tx.coreTransaction.create({
          data: {
            idempotencyKey: cmd.idempotencyKey,
            type: "TRANSFER",
            state: "PENDING",
            amountMinor: cmd.amountMinor,
            fromAccountId: from.id,
            toAccountId: to.id,
            reference: cmd.reference,
          },
        });

        // Lock both accounts before validating balances (deadlock-safe order).
        await this.ledger.lockAccounts(tx, [from.id, to.id].sort());

        await this.transition(tx, txRow.id, "PENDING", "VALIDATING");

        const fromBalance = await this.ledger.balanceWithin(tx, from.id);
        if (fromBalance < cmd.amountMinor) {
          // Throwing rolls the transaction (and its provisional row) back;
          // the durable FAILED record is written by recordFailure() below.
          throw new InsufficientFundsError();
        }

        await this.transition(tx, txRow.id, "VALIDATING", "AUTHORIZED");
        await this.transition(tx, txRow.id, "AUTHORIZED", "PROCESSING");

        let state: TransactionState = "PROCESSING";

        // Primary movement: payer -> payee.
        const lines: JournalLine[] = [
          { accountId: from.id, side: "DEBIT", amountMinor: cmd.amountMinor },
          { accountId: to.id, side: "CREDIT", amountMinor: cmd.amountMinor },
        ];
        await this.writeBalancedEntry(
          tx,
          txRow.id,
          `Transfer ${cmd.reference ?? ""}`.trim(),
          lines,
        );

        // CLS leg: cross-bank movements additionally flow through settlement
        // accounts so inter-bank obligations are visible and auditable.
        if (this.isCrossBank(from, to)) {
          await this.transition(tx, txRow.id, "PROCESSING", "SETTLING");
          state = "SETTLING";
          await this.writeClsLegs(tx, txRow.id, from.bankId!, to.bankId!, cmd.amountMinor);
        }

        await this.transition(tx, txRow.id, state, "COMPLETED");

        return tx.coreTransaction.findUniqueOrThrow({ where: { id: txRow.id } });
      }, TX_OPTIONS);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        // Lost an idempotency-key race — return the winner's result.
        const winner = await this.prisma.coreTransaction.findUnique({
          where: { idempotencyKey: cmd.idempotencyKey },
        });
        if (winner) return winner;
      }
      if (err instanceof InsufficientFundsError) {
        await this.recordFailure(cmd, "INSUFFICIENT_FUNDS");
        throw new ConflictException("Insufficient funds");
      }
      throw err;
    }
  }

  /**
   * Durably records a FAILED outcome outside the rolled-back transaction.
   * The provisional row from the aborted attempt no longer exists in the DB,
   * so a FAILED tombstone is recreated for the audit trail.
   */
  private async recordFailure(
    cmd: TransferCommand,
    reason: "INSUFFICIENT_FUNDS" | "VALIDATION_FAILED" | "SYSTEM_ERROR",
  ): Promise<void> {
    const updated = await this.prisma.coreTransaction.updateMany({
      where: { idempotencyKey: cmd.idempotencyKey, state: { notIn: ["COMPLETED", "REVERSED"] } },
      data: { state: "FAILED", terminalReason: reason },
    });
    if (updated.count === 0) {
      await this.prisma.coreTransaction.upsert({
        where: { idempotencyKey: cmd.idempotencyKey },
        update: { state: "FAILED", terminalReason: reason },
        create: {
          idempotencyKey: cmd.idempotencyKey,
          type: "TRANSFER",
          state: "FAILED",
          amountMinor: cmd.amountMinor,
          fromAccountId: cmd.fromLedgerAccountId,
          toAccountId: cmd.toLedgerAccountId,
          reference: cmd.reference,
          terminalReason: reason,
        },
      });
    }
    const row = await this.prisma.coreTransaction.findUnique({
      where: { idempotencyKey: cmd.idempotencyKey },
    });
    if (row) {
      await this.prisma.transactionEvent.create({
        data: { transactionId: row.id, fromState: "VALIDATING", toState: "FAILED", detail: reason },
      });
    }
  }

  /** True when the two accounts belong to different commercial banks. */
  private isCrossBank(from: LedgerAccount, to: LedgerAccount): boolean {
    return (
      !!from.bankId &&
      !!to.bankId &&
      from.bankId !== to.bankId &&
      from.kind === "USER" &&
      to.kind === "USER"
    );
  }

  /**
   * CLS settlement legs (balanced among themselves):
   *   DEBIT  Settlement_X, CREDIT Settlement_Y — inter-bank obligation flows
   *   through the settlement hub so netting/audit is possible later.
   */
  private async writeClsLegs(
    tx: Prisma.TransactionClient,
    transactionId: string,
    fromBankId: string,
    toBankId: string,
    amountMinor: bigint,
  ): Promise<void> {
    const [settleFrom, settleTo] = await Promise.all([
      this.ledger.findOrCreateAccount({ kind: "CLS_SETTLEMENT", bankId: fromBankId }),
      this.ledger.findOrCreateAccount({ kind: "CLS_SETTLEMENT", bankId: toBankId }),
    ]);
    const lines: JournalLine[] = [
      { accountId: settleFrom.id, side: "DEBIT", amountMinor },
      { accountId: settleTo.id, side: "CREDIT", amountMinor },
    ];
    await this.writeBalancedEntry(
      tx,
      transactionId,
      `CLS settlement ${fromBankId} -> ${toBankId}`,
      lines,
    );
  }

  /** Writes one journal entry; throws if the lines do not balance to zero. */
  private async writeBalancedEntry(
    tx: Prisma.TransactionClient,
    transactionId: string,
    description: string,
    lines: JournalLine[],
  ): Promise<void> {
    let net = 0n;
    for (const l of lines) net += l.side === "DEBIT" ? l.amountMinor : -l.amountMinor;
    if (net !== 0n) {
      throw new Error(`Unbalanced journal entry rejected (net=${net}): ${description}`);
    }

    const entry = await tx.journalEntry.create({
      data: { transactionId, description },
    });
    await tx.ledgerPosting.createMany({
      data: lines.map((l) => ({
        journalEntryId: entry.id,
        accountId: l.accountId,
        side: l.side,
        amountMinor: l.amountMinor,
      })),
    });
  }

  private async transition(
    tx: Prisma.TransactionClient,
    transactionId: string,
    fromState: TransactionState,
    toState: TransactionState,
  ): Promise<void> {
    assertTransition(fromState, toState);
    const updated = await tx.coreTransaction.updateMany({
      where: { id: transactionId, state: fromState },
      data: { state: toState },
    });
    if (updated.count !== 1) {
      throw new Error(
        `Concurrent transition conflict on ${transactionId}: ${fromState}->${toState}`,
      );
    }
    await tx.transactionEvent.create({
      data: { transactionId, fromState, toState },
    });
  }
}
