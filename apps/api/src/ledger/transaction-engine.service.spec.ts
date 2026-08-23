import { BadRequestException, ConflictException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionEngineService } from "./transaction-engine.service";
import type { LedgerService } from "./ledger.service";

/**
 * Unit tests run the engine against an in-memory fake of the interactive
 * Prisma transaction, verifying the double-entry and idempotency guarantees
 * without a database.
 */

interface FakeRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

function makeFakePrisma() {
  const transactions = new Map<string, FakeRow>();
  const entries: FakeRow[] = [];
  const postings: FakeRow[] = [];
  const events: FakeRow[] = [];
  const balances = new Map<string, bigint>();
  const locked = new Set<string>();

  const prisma = {
    coreTransaction: {
      findUnique: vi.fn(
        async ({ where }: { where: { idempotencyKey?: string; id?: string } }) =>
          transactions.get(where.idempotencyKey ?? where.id ?? "") ?? null,
      ),
      create: vi.fn(async ({ data }: { data: FakeRow }) => {
        if (transactions.has(data.idempotencyKey)) {
          throw Object.assign(new Error("unique"), { code: "P2002" });
        }
        const row = { id: `tx-${transactions.size + 1}`, state: "PENDING", ...data };
        transactions.set(data.idempotencyKey, row);
        return row;
      }),
      updateMany: vi.fn(
        async ({
          where,
          data,
        }: {
          where: { idempotencyKey?: string; id?: string };
          data: Partial<FakeRow>;
        }) => {
          const row =
            transactions.get(where.idempotencyKey ?? "") ??
            [...transactions.values()].find((t) => t.id === where.id);
          if (!row) return { count: 0 };
          Object.assign(row, data);
          return { count: 1 };
        },
      ),
      upsert: vi.fn(
        async ({
          where,
          update,
          create,
        }: {
          where: { idempotencyKey: string };
          update?: FakeRow;
          create?: FakeRow;
        }) => {
          const existing = transactions.get(where.idempotencyKey);
          if (existing) {
            Object.assign(existing, update);
            return existing;
          }
          const row = { id: `tx-${transactions.size + 1}`, ...create };
          transactions.set(where.idempotencyKey, row);
          return row;
        },
      ),
      findUniqueOrThrow: vi.fn(
        async ({ where }: { where: { idempotencyKey?: string; id?: string } }) => {
          const row =
            [...transactions.values()].find((t) => t.id === where.id) ??
            transactions.get(where.idempotencyKey ?? "");
          if (!row) throw new Error("not found");
          return row;
        },
      ),
    },
    journalEntry: {
      create: vi.fn(async ({ data }: { data: FakeRow }) => {
        const row = { id: `je-${entries.length + 1}`, ...data };
        entries.push(row);
        return row;
      }),
    },
    ledgerPosting: {
      createMany: vi.fn(async ({ data }: { data: FakeRow[] }) => {
        postings.push(...data);
        for (const p of data) {
          const cur = balances.get(p.accountId) ?? 0n;
          balances.set(
            p.accountId,
            p.side === "CREDIT" ? cur + p.amountMinor : cur - p.amountMinor,
          );
        }
        return { count: data.length };
      }),
    },
    transactionEvent: {
      create: vi.fn(async ({ data }: { data: FakeRow }) => {
        events.push({ id: `ev-${events.length + 1}`, ...data });
        return data;
      }),
    },
    $transaction: vi.fn(async (fn) =>
      fn({
        coreTransaction: prisma.coreTransaction,
        journalEntry: prisma.journalEntry,
        ledgerPosting: prisma.ledgerPosting,
        transactionEvent: prisma.transactionEvent,
        $queryRawUnsafe: vi.fn(async (_sql: string, ...ids: string[]) => {
          for (const id of ids) locked.add(id);
          return ids.map((id) => ({ id }));
        }),
      }),
    ),
  };

  return { prisma, transactions, entries, postings, events, balances };
}

function makeEngine(fake: ReturnType<typeof makeFakePrisma>) {
  const ledger = {
    getAccount: vi.fn(async (id: string) => ({
      id,
      kind: "USER",
      // acct-A and same-* live at bankX; everything else at bankY.
      bankId: id === "acct-A" || id.startsWith("same-") ? "bankX" : "bankY",
      ownerUserId: null,
      currency: "ARTH",
      createdAt: new Date(),
    })),
    lockAccounts: async (
      tx: { $queryRawUnsafe: (...args: unknown[]) => Promise<unknown> },
      ids: string[],
    ) => tx.$queryRawUnsafe("", ...ids),
    balanceWithin: async (_tx: unknown, accountId: string) => fake.balances.get(accountId) ?? 0n,
    findOrCreateAccount: vi.fn(async ({ bankId }: { bankId?: string }) => ({
      id: `settle-${bankId}`,
      kind: "CLS_SETTLEMENT",
      bankId,
      ownerUserId: null,
      currency: "ARTH",
      createdAt: new Date(),
    })),
  } as unknown as LedgerService;
  return new TransactionEngineService(fake.prisma as never, ledger);
}

const baseCmd = (key: string, amount: bigint, from = "acct-A", to = "acct-B") => ({
  idempotencyKey: key,
  amountMinor: amount,
  fromLedgerAccountId: from,
  toLedgerAccountId: to,
});

describe("TransactionEngine (unit)", () => {
  let fake: ReturnType<typeof makeFakePrisma>;
  let engine: TransactionEngineService;

  beforeEach(() => {
    fake = makeFakePrisma();
    engine = makeEngine(fake);
  });

  it("rejects non-positive amounts", async () => {
    await expect(engine.executeTransfer(baseCmd("k1", 0n))).rejects.toThrow(BadRequestException);
    await expect(engine.executeTransfer(baseCmd("k1", -5n))).rejects.toThrow(BadRequestException);
  });

  it("fails with INSUFFICIENT_FUNDS when the payer cannot cover the transfer", async () => {
    await expect(engine.executeTransfer(baseCmd("k2", 100n))).rejects.toThrow(ConflictException);
    const tx = fake.transactions.get("k2");
    expect(tx?.state).toBe("FAILED");
    expect(tx?.terminalReason).toBe("INSUFFICIENT_FUNDS");
    expect(fake.postings).toHaveLength(0);
  });

  it("executes same-bank transfer as one balanced entry", async () => {
    fake.balances.set("same-payer", 500n);
    const result = await engine.executeTransfer(baseCmd("k3", 200n, "same-payer", "same-payee"));
    expect(result.state).toBe("COMPLETED");

    // One primary entry only — no CLS legs inside a single bank.
    expect(fake.entries).toHaveLength(1);
    const lines = fake.postings.filter((p) => p.journalEntryId === fake.entries[0]!.id);
    const net = lines.reduce(
      (acc, p) => acc + (p.side === "DEBIT" ? p.amountMinor : -p.amountMinor),
      0n,
    );
    expect(net).toBe(0n);
    expect(fake.balances.get("same-payer")).toBe(300n);
    expect(fake.balances.get("same-payee")).toBe(200n);
  });

  it("routes cross-bank transfers through CLS settlement accounts", async () => {
    fake.balances.set("acct-A", 1000n);
    const result = await engine.executeTransfer(baseCmd("k4", 400n));
    expect(result.state).toBe("COMPLETED");
    // Primary leg + CLS leg.
    expect(fake.entries).toHaveLength(2);

    const clsEntry = fake.entries[1]!;
    const clsLines = fake.postings.filter((p) => p.journalEntryId === clsEntry.id);
    const net = clsLines.reduce(
      (acc, p) => acc + (p.side === "DEBIT" ? p.amountMinor : -p.amountMinor),
      0n,
    );
    expect(net).toBe(0n);
    expect(clsLines.every((l) => l.accountId.startsWith("settle"))).toBe(true);

    // State walk included SETTLING for cross-bank movement.
    const states = fake.events.filter((e) => e.transactionId === result.id).map((e) => e.toState);
    expect(states).toContain("SETTLING");
  });

  it("is idempotent: replaying a key returns the original result without new postings", async () => {
    fake.balances.set("acct-A", 500n);
    const first = await engine.executeTransfer(baseCmd("k5", 100n));
    const count = fake.postings.length;
    const second = await engine.executeTransfer(baseCmd("k5", 100n));
    expect(second.id).toBe(first.id);
    expect(fake.postings.length).toBe(count);
  });
});
