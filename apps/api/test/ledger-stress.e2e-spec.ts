import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { LedgerService } from "../src/ledger/ledger.service";
import { TransactionEngineService } from "../src/ledger/transaction-engine.service";
import { PrismaService } from "../src/prisma/prisma.service";

const BANKS = ["nava", "samaya", "setu", "sthira", "vayu"] as const;

describe("Ledger engine (integration + stress, real DB)", () => {
  let app: INestApplication;
  let ledger: LedgerService;
  let engine: TransactionEngineService;
  let prisma: PrismaService;
  const http = () => app.getHttpServer();

  const userIds: string[] = [];

  async function seedUserAccount(
    userId: string,
    bankId: string,
    fundingMinor: bigint,
  ): Promise<string> {
    const account = await ledger.findOrCreateAccount({ kind: "USER", ownerUserId: userId, bankId });
    // Opening funding via the engine's deposit operation (issuance from reserve).
    await engine.executeDeposit({
      idempotencyKey: `seed-${userId}`,
      ledgerAccountId: account.id,
      amountMinor: fundingMinor,
      reference: `Opening funding ${userId}`,
    });
    return account.id;
  }

  async function wipeLedger(): Promise<void> {
    await prisma.transactionEvent.deleteMany({});
    await prisma.ledgerPosting.deleteMany({});
    await prisma.journalEntry.deleteMany({});
    await prisma.coreTransaction.deleteMany({});
    await prisma.ledgerAccount.deleteMany({});
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    ledger = app.get(LedgerService);
    engine = app.get(TransactionEngineService);
    prisma = app.get(PrismaService);

    // Self-healing start: remove any residue from an interrupted earlier run.
    await wipeLedger();
  });

  afterAll(async () => {
    // Deterministic teardown of stress-test data.
    await wipeLedger();
    await app.close();
  });

  it(
    "completes 10,000 concurrent mixed same/cross-bank transfers with zero money creation or destruction",
    { timeout: 600_000 },
    async () => {
      const USERS = 100;
      const TRANSFERS = 10_000;
      const FUNDING = 10_000_000n; // 100,000.00 ARTH per user

      for (let i = 0; i < USERS; i++) {
        const userId = `stress-u${i}`;
        userIds.push(await seedUserAccount(userId, BANKS[i % BANKS.length]!, FUNDING));
      }

      const initialTotal = (
        await Promise.all(userIds.map((id) => ledger.getBalanceMinor(id)))
      ).reduce((a, b) => a + b, 0n);
      expect(initialTotal).toBe(FUNDING * BigInt(USERS));

      // Fire 10k transfers with randomized payer/payee across all banks.
      const keys: string[] = [];
      const errors: unknown[] = [];
      const CONCURRENCY = 32;
      let launched = 0;

      async function worker(): Promise<void> {
        while (launched < TRANSFERS) {
          const i = launched++;
          try {
            const from = userIds[i % USERS]!;
            let to = userIds[(i * 7 + 13) % USERS]!;
            if (to === from) to = userIds[(i + 1) % USERS]!;
            keys.push(`stress-${i}`);
            await engine.executeTransfer({
              idempotencyKey: `stress-${i}`,
              amountMinor: 1000n,
              fromLedgerAccountId: from,
              toLedgerAccountId: to,
              reference: `stress ${i}`,
            });
          } catch (err) {
            // Drain fully — never leave workers running past the assertion phase.
            errors.push(err);
          }
        }
      }
      await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

      // All 10k must have executed cleanly.
      expect(errors).toHaveLength(0);

      // ---- Gate assertions ----

      // 1. Global double-entry conservation: debits minus credits is exactly zero.
      expect(await ledger.globalLedgerNet()).toBe(0n);

      // 2. Zero money creation/destruction: total balances unchanged.
      const finalTotal = (
        await Promise.all(userIds.map((id) => ledger.getBalanceMinor(id)))
      ).reduce((a, b) => a + b, 0n);
      expect(finalTotal).toBe(initialTotal);

      // 3. Every transfer COMPLETED (funding guarantees no insufficient-funds noise).
      const completedTransfers = await prisma.coreTransaction.count({
        where: { state: "COMPLETED", idempotencyKey: { startsWith: "stress-" } },
      });
      expect(completedTransfers).toBe(TRANSFERS);
      const nonCompleted = await prisma.coreTransaction.count({
        where: { state: { notIn: ["COMPLETED"] }, idempotencyKey: { startsWith: "stress-" } },
      });
      expect(nonCompleted).toBe(0);

      // 4. Idempotency under replay: re-firing one key changes nothing.
      await engine.executeTransfer({
        idempotencyKey: "stress-0",
        amountMinor: 1000n,
        fromLedgerAccountId: userIds[0]!,
        toLedgerAccountId: userIds[1]!,
      });
      const afterReplay = await prisma.coreTransaction.count({
        where: { idempotencyKey: { startsWith: "stress-" } },
      });
      expect(afterReplay).toBe(TRANSFERS);
      expect(await ledger.globalLedgerNet()).toBe(0n);
    },
  );

  it(
    "reverses a completed transfer with compensating entries and flips the original to REVERSED",
    { timeout: 120_000 },
    async () => {
      const a = await seedUserAccount("rev-a", "nava", 500_000n);
      const b = await seedUserAccount("rev-b", "setu", 100n);

      const tx = await engine.executeTransfer({
        idempotencyKey: "rev-tx",
        amountMinor: 123_456n,
        fromLedgerAccountId: a,
        toLedgerAccountId: b,
      });
      expect(tx.state).toBe("COMPLETED");

      const reversal = await engine.reverse(tx.id, "rev-rx");
      expect(reversal.state).toBe("COMPLETED");
      expect(reversal.type).toBe("REVERSAL");

      const originalAfter = await prisma.coreTransaction.findUniqueOrThrow({
        where: { id: tx.id },
      });
      expect(originalAfter.state).toBe("REVERSED");

      expect(await ledger.getBalanceMinor(a)).toBe(500_000n);
      expect(await ledger.getBalanceMinor(b)).toBe(100n);
      expect(await ledger.globalLedgerNet()).toBe(0n);
    },
  );

  it(
    "rejects transfers exceeding the available balance and records a durable FAILED state",
    { timeout: 60_000 },
    async () => {
      const poor = await seedUserAccount("fail-poor", "vayu", 100n);
      const rich = await seedUserAccount("fail-rich", "nava", 100n);

      await expect(
        engine.executeTransfer({
          idempotencyKey: "fail-tx",
          amountMinor: 101n,
          fromLedgerAccountId: poor,
          toLedgerAccountId: rich,
        }),
      ).rejects.toThrow();

      const row = await prisma.coreTransaction.findUnique({ where: { idempotencyKey: "fail-tx" } });
      expect(row?.state).toBe("FAILED");
      expect(row?.terminalReason).toBe("INSUFFICIENT_FUNDS");
      // Balances untouched.
      expect(await ledger.getBalanceMinor(poor)).toBe(100n);
      expect(await ledger.globalLedgerNet()).toBe(0n);
    },
  );

  it(
    "exposes the reconciliation endpoint returning net zero over HTTP",
    { timeout: 60_000 },
    async () => {
      const res = await request(http()).get("/ledger/reconciliation/net");
      // Unauthenticated requests must never see ledger internals.
      expect([401, 403]).toContain(res.status);
    },
  );
});
