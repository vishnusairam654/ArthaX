/**
 * Core financial ledger types.
 *
 * Invariant: every JournalEntry satisfies sum(debits) === sum(credits).
 * Money is never created or destroyed outside of explicit issuance/redemption
 * by the Central Bank.
 */
import type { ArthMinor } from "./currency";

export const TRANSACTION_STATES = [
  "PENDING",
  "VALIDATING",
  "AUTHORIZED",
  "PROCESSING",
  "SETTLING",
  "COMPLETED",
  "FAILED",
  "REVERSED",
  "CANCELLED",
] as const;

export type TransactionState = (typeof TRANSACTION_STATES)[number];

export type PostingSide = "DEBIT" | "CREDIT";

export interface LedgerPosting {
  id: string;
  journalEntryId: string;
  ledgerAccountId: string;
  side: PostingSide;
  amount: ArthMinor;
}

export interface JournalEntry {
  id: string;
  transactionId: string;
  state: TransactionState;
  postings: LedgerPosting[];
  createdAt: string;
}

export function isBalanced(entry: Pick<JournalEntry, "postings">): boolean {
  let net = 0n;
  for (const p of entry.postings) {
    net += p.side === "DEBIT" ? p.amount : -p.amount;
  }
  return net === 0n;
}
