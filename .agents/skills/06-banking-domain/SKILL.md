---
name: banking-domain
description: Commercial bank portal logic — customer accounts, loan processing, FD schemes, and products, using the same architecture for Bank A/B/C. Use when building or reviewing anything under the Bank Portal or Central Bank Portal's bank-facing features. Distinct from Core Ledger math (skill 04) — this is the operational banking layer that sits on top of it.
---

# Banking Domain (ARTHAX)

## Overview
Three commercial banks (Bank A, B, C) share one codebase and data model — no per-bank forks. The Bank Portal is operational (customers, accounts, loans, FDs, products); the Central Bank Portal is regulatory oversight of these same banks.

## Bank Portal scope
- **Customers**: `BANK_CUSTOMER` records linking a `USER` to a bank.
- **Accounts**: `BANK_ACCOUNT` — created by purpose (Salary/Savings/Investment), each with type/status/limits.
- **Transactions**: bank-scoped view of ledger activity (reads through to Core Ledger, doesn't duplicate it).
- **FDs**: `FD_SCHEME` (product definitions) + `USER_FD` (holdings) + `INTEREST_PAYOUT_LOG`.
- **Loans**: origination, terms, repayment — not detailed in the base entity list yet; model it consistently with FD's scheme/holding split (a `LOAN_PRODUCT` + `USER_LOAN` pattern) rather than inventing a one-off shape.
- **Products**: bank-specific offerings surfaced to users during account creation and the User Portal's "My Banks" flow.

## Central Bank Portal scope (regulatory, not operational)
- Bank registry: Apply/Approve/Suspend/Close a bank.
- Monitoring: health, risk, reports — reads from CLS (skill 05) and ledger aggregates, never writes.
- Rules: interest rates, reserve requirements, transaction limits (delegates to skill 08).
- CLS management, audit trail (delegates to skill 05, skill 11).

## Rules
1. "Same architecture serving Bank A/B/C" means bank identity is a *parameter* (bank_id), never a code fork. If you find yourself writing `if (bank === 'A')` branching logic for anything other than display config, that's a design smell.
2. Interest calculation (FD payouts, loan interest) reads *rates* from skill 08 (Tax & Financial Rules) — Banking Domain doesn't own rate policy, Central Bank does.
3. Every FD/loan operation that moves ARTH must post through the Core Ledger (skill 04) — never maintain a shadow balance on `USER_FD`/`USER_LOAN` that can drift from the ledger.
4. Admin access to Bank Portal and Central Bank Portal is restricted to pre-provisioned, non-public credentials (skill 09/10) — never expose a public signup path for these roles.

## Common mistakes
- Duplicating balance fields on `BANK_ACCOUNT` that aren't reconciled against ledger snapshots.
- Central Bank Portal writing directly to a bank's operational tables instead of going through regulatory-scoped actions (approve/suspend) that the Bank Portal then reacts to.
- Hardcoding one bank's product catalog as "the default" in shared components.

## Handoff
Owned by **Financial Engineer**, built in phase 5 (skill 02) after Core Ledger is solid. Coordinates with **Backend** for the surrounding CRUD/API layer and **Frontend** for the portal UI.
