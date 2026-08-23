-- CreateEnum
CREATE TYPE "LedgerAccountKind" AS ENUM ('USER', 'BANK_TREASURY', 'CLS_SETTLEMENT', 'CENTRAL_RESERVE', 'SYSTEM_INCOME');

-- CreateEnum
CREATE TYPE "PostingSide" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "TransactionState" AS ENUM ('PENDING', 'VALIDATING', 'AUTHORIZED', 'PROCESSING', 'SETTLING', 'COMPLETED', 'FAILED', 'REVERSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'FD_OPEN', 'FD_CLOSE', 'FD_INTEREST', 'TRADE_BUY', 'TRADE_SELL', 'SHOP_PURCHASE', 'TAX', 'FEE', 'REVERSAL');

-- CreateEnum
CREATE TYPE "TerminalReason" AS ENUM ('INSUFFICIENT_FUNDS', 'VALIDATION_FAILED', 'CANCELLED_BY_USER', 'SYSTEM_ERROR', 'NONE');

-- CreateTable
CREATE TABLE "LedgerAccount" (
    "id" TEXT NOT NULL,
    "kind" "LedgerAccountKind" NOT NULL,
    "ownerUserId" TEXT,
    "bankId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'ARTH',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerPosting" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "side" "PostingSide" NOT NULL,
    "amountMinor" BIGINT NOT NULL,

    CONSTRAINT "LedgerPosting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoreTransaction" (
    "id" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "state" "TransactionState" NOT NULL DEFAULT 'PENDING',
    "amountMinor" BIGINT NOT NULL,
    "fromAccountId" TEXT,
    "toAccountId" TEXT,
    "feeMinor" BIGINT NOT NULL DEFAULT 0,
    "terminalReason" "TerminalReason" NOT NULL DEFAULT 'NONE',
    "reversalOfId" TEXT,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoreTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionEvent" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "fromState" "TransactionState",
    "toState" "TransactionState" NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LedgerAccount_ownerUserId_idx" ON "LedgerAccount"("ownerUserId");

-- CreateIndex
CREATE INDEX "LedgerAccount_bankId_kind_idx" ON "LedgerAccount"("bankId", "kind");

-- CreateIndex
CREATE INDEX "JournalEntry_transactionId_idx" ON "JournalEntry"("transactionId");

-- CreateIndex
CREATE INDEX "LedgerPosting_accountId_idx" ON "LedgerPosting"("accountId");

-- CreateIndex
CREATE INDEX "LedgerPosting_journalEntryId_idx" ON "LedgerPosting"("journalEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "CoreTransaction_idempotencyKey_key" ON "CoreTransaction"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "CoreTransaction_reversalOfId_key" ON "CoreTransaction"("reversalOfId");

-- CreateIndex
CREATE INDEX "CoreTransaction_state_idx" ON "CoreTransaction"("state");

-- CreateIndex
CREATE INDEX "CoreTransaction_fromAccountId_idx" ON "CoreTransaction"("fromAccountId");

-- CreateIndex
CREATE INDEX "CoreTransaction_toAccountId_idx" ON "CoreTransaction"("toAccountId");

-- CreateIndex
CREATE INDEX "TransactionEvent_transactionId_idx" ON "TransactionEvent"("transactionId");

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "CoreTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerPosting" ADD CONSTRAINT "LedgerPosting_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerPosting" ADD CONSTRAINT "LedgerPosting_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "LedgerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoreTransaction" ADD CONSTRAINT "CoreTransaction_reversalOfId_fkey" FOREIGN KEY ("reversalOfId") REFERENCES "CoreTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionEvent" ADD CONSTRAINT "TransactionEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "CoreTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
