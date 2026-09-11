---
name: financial-verification
description: Independent correctness checks on ledger math, settlement outcomes, and interest/tax calculations — domain-expert verification of money moving correctly, distinct from QA's code-path coverage. Use this any time a ledger, settlement, interest, or tax calculation needs to be independently re-derived and checked, never by the same agent/session that built it.
---

# Financial Verification (ARTHAX)

## Overview
This is domain-expert sign-off on financial correctness, not test-coverage QA (skill 19). The critical rule: **Financial Auditor is never the same agent that wrote the ledger.** Independence is the point.

## What gets verified
- **Ledger math (skill 04)**: for a sample (or full set, depending on scale) of transactions, re-derive Total Debits = Total Credits independently from the raw entry stream, not by trusting a cached balance snapshot.
- **Settlement outcomes (skill 05)**: reconcile CLS/`INTERBANK_CLEARING` records against the ledger's transaction states — every SETTLING transaction should have a matching settlement record, and every COMPLETED cross-bank transaction should have a corresponding cleared settlement.
- **Interest/tax calculations (skill 08)**: re-derive FD interest payouts and stock trade profit/tax using the rule version that was actually in effect at the time (skill 08's versioning rule), and flag any mismatch.

## Method
1. Never trust the system's own "it balanced" flag — pull raw entries and recompute independently.
2. Sample-based verification is acceptable for scale, but any high-value transaction (above a defined threshold) or any transaction that touched a FAILED/REVERSED state should get 100% verification, not sampling.
3. Findings go into `COMPLIANCE_REPORT` (skill 11) with enough detail to be actionable — which transaction, which expected vs. actual value, which rule version was applied.
4. This is continuous from phase 10 onward (skill 02), not a one-time pre-launch check.

## Common mistakes
- Verifying against the same code path that produced the number in the first place (that's not independent verification, that's re-running the bug).
- Skipping verification on REVERSED/FAILED transactions because "they didn't complete anyway" — these are exactly the states most likely to leave the ledger unbalanced if the reversal logic has a bug.
- Treating financial verification as a one-time launch gate instead of an ongoing practice.

## Handoff
Owned by **Financial Auditor**, deliberately separate from **Financial Engineer**. First full pass is phase 10 (skill 02); continuous afterward.
