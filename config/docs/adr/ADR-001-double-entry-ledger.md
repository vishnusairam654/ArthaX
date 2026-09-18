# ADR-001: Immutable Append-Only Double-Entry Ledger Architecture

**Status**: ACCEPTED / INVARIANT  
**Date**: 2026-08-10  
**Deciders**: Chief Architect, Financial Systems Lead  

---

## Context
A financial software system can track customer account balances in one of two fundamental ways:
1. **Mutable Balance Updates**: Directly modifying an `account.balance` column via `UPDATE accounts SET balance = balance - amount`.
2. **Double-Entry Ledger Journaling**: Treating balances as derived views from an immutable append-only stream of `DEBIT` and `CREDIT` entries where every posting satisfies $\sum \text{Debits} \equiv \sum \text{Credits}$.

Mutable balance columns are vulnerable to race conditions, lost updates, unobservable discrepancies, and undetectable insider tampering.

---

## Decision
ARTHAX adopts an **immutable, append-only double-entry ledger** as the sole source of monetary truth:
1. Direct updates or deletions on `TransactionEntry` or `Transaction` tables are forbidden at the database trigger, ORM, and domain layers.
2. Every transaction must post at least one debit and one credit of equal magnitude ($\sum \text{Debits} - \sum \text{Credits} = 0$).
3. Account balances (`balanceSnapshot`) are cached projections strictly re-derivable from $\sum \text{Credits} - \sum \text{Debits}$ of completed transactions.
4. Corrective actions are achieved solely by posting compensating contra-transactions, never by editing past records.

---

## Consequences
### Positive
- **Complete Auditability**: Every ARTH minor unit can be mathematically traced from genesis issuance to current holder.
- **Race Condition Resistance**: Append-only inserts eliminate row-level update lock deadlocks on balance tables.
- **Tamper Detection**: An attacker cannot quietly alter a balance without causing a detectable discrepancy against the entry stream.

### Negative / Trade-Offs
- **Storage Growth**: Journal entries grow monotonically with transaction volume. Mitigated through periodic balance snapshots.
- **Implementation Rigor**: Every internal transfer requires balanced multi-legged debit/credit construction.
