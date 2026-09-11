---
name: financial-ledger
description: The single source of truth for ARTHAX's double-entry ledger — transaction lifecycle, balance snapshots, and the debits-equal-credits invariant. Use this any time you write, review, or reason about anything that moves ARTH currency, creates a TRANSACTION or LEDGER_ENTRY, or touches balances. This is the highest-stakes skill in the system — trigger it proactively, don't wait to be asked.
---

# Financial Ledger (ARTHAX)

## Overview
The Core Ledger is the single source of truth for all money movement — Banking, Stocks, Shop, and Rewards all share the same ledger. There is exactly one currency: ARTH.

## Key components
- **Ledger Accounts**: internal identifiers for every money-holding entity — User, Bank, Market, Tax Authority.
- **Transactions**: the business event (`USER_TRANSFER`, `STOCK_BUY`, etc.)
- **Transaction Entries**: atomic double-entry records (Debits/Credits). A transaction may have many entries; they must balance.
- **Settlements**: distinct from transactions — inter-bank reconciliation/clearing state (see skill 05).
- **Balance Snapshots**: fast-access cached balances, rebuilt/reconciled from the ledger — never treated as the source of truth themselves.

## Transaction lifecycle (strict state machine)
```
PENDING → VALIDATING → AUTHORIZED → PROCESSING → SETTLING → COMPLETED
                                                            → FAILED
                                                            → REVERSED
                                                            → CANCELLED
```
- No state may be skipped.
- Every non-COMPLETED terminal state (FAILED/REVERSED/CANCELLED) must leave the ledger balanced — a reversal is a new, opposite-sign entry, never a mutation of the original entry.

## Architectural rules (non-negotiable)
1. **Single Source of Truth**: never create a second ledger system for Stocks, Shop, or Rewards. Everything posts through the Core Ledger.
2. **Double-Entry Integrity**: Total Debits = Total Credits, enforced at the database/transaction level, not just in application code — assume application-level checks will eventually be bypassed by a bug and design the schema so an imbalance is structurally hard to create (e.g., a DB trigger or a single atomic multi-row insert with a CHECK constraint on the aggregate).
3. **Separation**: ledger logic is distinct from UI and from bank-specific tables. Bank/Stock/Shop services call the ledger's service interface; they never write ledger rows directly.
4. **Immutability**: ledger entries are append-only. Corrections are new entries, never UPDATE/DELETE on posted entries.

## Common mistakes
- Letting Backend or Frontend write directly to `LEDGER_ENTRY` for convenience.
- Treating a balance snapshot as authoritative during a dispute — always reconcile against the entry stream.
- Allowing a transaction to move from PENDING straight to COMPLETED without passing through VALIDATING/AUTHORIZED/PROCESSING/SETTLING.
- Rounding/precision bugs in ARTH amounts (use integer minor units or a fixed-precision decimal type, never floating point).

## Testing
Pair with skill 20 (Financial Verification) — every ledger change needs an independent correctness check from **Financial Auditor**, who is deliberately never the same agent that wrote the code.

## Handoff
Owned by **Financial Engineer**. This is the deepest, highest-risk skill in ARTHAX — build it before Banking, Stocks, or Shop touch it (see skill 02, phase 3).
