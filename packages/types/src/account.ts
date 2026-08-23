/** Bank account domain types. */

export const ACCOUNT_PURPOSES = [
  "salary",
  "savings",
  "daily_spending",
  "business",
  "fixed_deposit",
] as const;

export type AccountPurpose = (typeof ACCOUNT_PURPOSES)[number];

export interface BankAccount {
  id: string;
  bankId: string;
  ownerUserId: string;
  purpose: AccountPurpose;
  /** Ledger account reference — balances never live on this record. */
  ledgerAccountId: string;
  openedAt: string;
}

export type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED";
