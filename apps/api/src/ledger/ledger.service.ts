import { Injectable } from "@nestjs/common";
import type { LedgerAccount, LedgerAccountKind, PostingSide, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface AccountSpec {
  kind: LedgerAccountKind;
  ownerUserId?: string;
  bankId?: string;
}

/**
 * Ledger account management. Balances are ALWAYS derived from postings —
 * there is no stored balance field to drift out of sync.
 */
@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateAccount(spec: AccountSpec): Promise<LedgerAccount> {
    const existing = await this.prisma.ledgerAccount.findFirst({
      where: {
        kind: spec.kind,
        ownerUserId: spec.ownerUserId ?? null,
        bankId: spec.bankId ?? null,
      },
    });
    if (existing) return existing;
    return this.prisma.ledgerAccount.create({
      data: {
        kind: spec.kind,
        ownerUserId: spec.ownerUserId,
        bankId: spec.bankId,
      },
    });
  }

  async getAccount(id: string): Promise<LedgerAccount | null> {
    return this.prisma.ledgerAccount.findUnique({ where: { id } });
  }

  /** Balance in ARTH minor units: credits minus debits. */
  async getBalanceMinor(accountId: string): Promise<bigint> {
    const rows = await this.prisma.ledgerPosting.groupBy({
      by: ["side"],
      where: { accountId },
      _sum: { amountMinor: true },
    });
    let balance = 0n;
    for (const row of rows) {
      const sum = row._sum.amountMinor ?? 0n;
      balance += row.side === "CREDIT" ? sum : -sum;
    }
    return balance;
  }

  /** Global conservation check: sum(debits) + sum(credits) must cancel to zero. */
  async globalLedgerNet(): Promise<bigint> {
    const rows = await this.prisma.ledgerPosting.groupBy({
      by: ["side"],
      _sum: { amountMinor: true },
    });
    let net = 0n;
    for (const row of rows) {
      const sum = row._sum.amountMinor ?? 0n;
      net += row.side === "DEBIT" ? sum : -sum;
    }
    return net;
  }

  /**
   * Locks the given accounts (SELECT ... FOR UPDATE) inside the caller's
   * interactive transaction, preventing concurrent double-spend.
   */
  async lockAccounts(tx: Prisma.TransactionClient, accountIds: string[]): Promise<void> {
    const unique = [...new Set(accountIds)];
    const placeholders = unique.map((_, i) => `$${i + 1}`).join(", ");
    await tx.$queryRawUnsafe(
      `SELECT "id" FROM "LedgerAccount" WHERE "id" IN (${placeholders}) FOR UPDATE`,
      ...unique,
    );
  }

  /** Balance computed from postings inside a locked interactive transaction. */
  async balanceWithin(tx: Prisma.TransactionClient, accountId: string): Promise<bigint> {
    const rows = (await tx.$queryRawUnsafe(
      `SELECT "side", SUM("amountMinor") AS "total"
       FROM "LedgerPosting"
       WHERE "accountId" = $1
       GROUP BY "side"`,
      accountId,
    )) as Array<{ side: PostingSide; total: bigint }>;
    let balance = 0n;
    for (const row of rows) {
      balance += row.side === "CREDIT" ? BigInt(row.total) : -BigInt(row.total);
    }
    return balance;
  }
}
