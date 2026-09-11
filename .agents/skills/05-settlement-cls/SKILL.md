---
name: settlement-cls
description: The Central Settlement Layer — inter-bank routing, debit/credit processing, reconciliation, and failed-settlement handling. Use whenever a transaction crosses bank boundaries (Bank A to Bank B), or when reasoning about clearing, reconciliation jobs, or settlement failure/retry logic. Distinct from the Core Ledger itself — settlement is the state between banks, not the entry-level bookkeeping.
---

# Settlement / CLS (ARTHAX)

## Overview
CLS (Central Settlement Layer) sits above the Core Ledger and handles the specifically inter-bank part of money movement: routing a transfer between Bank A and Bank B, tracking its clearing state, and reconciling.

## Responsibilities
- **Inter-bank routing**: determine the path for a transaction that crosses bank boundaries.
- **Debit/credit processing**: coordinate the debit leg at the source bank and credit leg at the destination bank so they settle atomically from the user's perspective, even if internally staged.
- **Settlement records**: `INTERBANK_CLEARING` entries distinct from `TRANSACTIONS`/`LEDGER_ENTRY` — settlement is a reconciliation record, not a duplicate of the ledger entry.
- **Failed-settlement handling**: a failed settlement must trigger a REVERSED transaction state in the ledger (skill 04), never leave a dangling half-completed transfer.
- **Reconciliation**: periodic (or on-demand) verification that CLS records agree with the ledger's entry stream.

## Rules
1. Settlement is a *state*, not a *transaction type* — don't conflate `INTERBANK_CLEARING` rows with `TRANSACTION_BATCH`/`LEDGER_ENTRY` rows.
2. A settlement failure at any stage must be handled by moving the underlying transaction to FAILED or REVERSED (skill 04's state machine) — CLS never silently drops a failed transfer.
3. Central Bank Portal's oversight view (skill 06) reads from CLS records for monitoring, not from raw ledger entries.
4. Use hold-and-settle patterns for cross-bank transfers where appropriate: hold funds at source, confirm at destination, then release — this bounds the blast radius of a failure mid-transfer.

## Common mistakes
- Treating a same-bank transfer and a cross-bank transfer with the same code path — same-bank transfers don't need CLS at all, just Core Ledger entries.
- Retrying a failed settlement without idempotency — always key retries off the transaction ID so a retry can't double-credit.
- Building reconciliation as an afterthought instead of a first-class scheduled job.

## Handoff
Owned by **Financial Engineer** alongside skill 04. Central Bank Portal's monitoring features (skill 06, skill 08) consume CLS state; **Financial Auditor** (skill 11/20) independently verifies reconciliation correctness.
