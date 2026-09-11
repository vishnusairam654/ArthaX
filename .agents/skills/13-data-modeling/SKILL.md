---
name: data-modeling
description: Entity relationships across the whole system — GOV_ID to User to Bank Customer to Bank Account to Ledger to Transactions — plus the @arthax/types DB-to-UI type safety contract. Use when reasoning about how entities relate, adding a new entity, or keeping shared TypeScript types in sync with the schema. This is the conceptual layer; skill 12 is the execution layer (actual migrations).
---

# Data Modeling (ARTHAX)

## Overview
The core relationship chain, and it is intentionally linear and directional:

```
GOV Identity → ARTHAX User → Bank Customer → Bank Account → Ledger → Transactions
```

## Tables by domain (Section 7.1)
- **Identity**: GOV_ID, USER, SESSION, MFA_TOKEN
- **Banking**: BANK, BANK_CUSTOMER, BANK_ACCOUNT, BENEFICIARY
- **Ledger**: LEDGER_ENTRY, TRANSACTION_BATCH, INTERNAL_SETTLEMENT
- **Fixed Deposits**: FD_SCHEME, USER_FD, INTEREST_PAYOUT_LOG
- **Central Bank**: REGULATORY_POLICY, INTERBANK_CLEARING, TAX_RULE
- **Stocks**: STOCK_TICKER, ORDER_BOOK, USER_PORTFOLIO, TRADE_HISTORY
- **Shop**: SHOP_ITEM, USER_INVENTORY, TRANSACTION_SHOP
- **Rewards**: REWARD_CAMPAIGN, USER_POINTS, REDEMPTION_LOG
- **Communication**: NOTIFICATION, OTP_LOG, IN_APP_MESSAGE
- **Audit**: SYSTEM_LOG, COMPLIANCE_REPORT, SECURITY_EVENT

## Rules
1. Every entity's relationship to the core chain above should be traceable — if a new table can't be located relative to GOV_ID → USER → BANK_CUSTOMER → BANK_ACCOUNT → LEDGER → TRANSACTIONS, question whether it belongs in the domain model as designed or needs a new documented relationship.
2. `@arthax/types` mirrors the schema shape exactly for anything the frontend consumes. When a schema field changes, `@arthax/types` changes in the same PR — never let it drift and get "fixed later."
3. Relationships stated as 1:1 (Email↔GOV_ID, GOV_ID↔User) must be enforced with unique constraints, not just convention.
4. `TRANSACTION_SHOP`, `TRADE_HISTORY`, etc. reference the Core Ledger's `TRANSACTIONS`/`LEDGER_ENTRY` rather than re-implementing amount/status fields that could drift from the ledger's own record.

## Common mistakes
- A domain table (e.g., `USER_PORTFOLIO`) storing a `balance` field that isn't derived/reconciled from `LEDGER_ENTRY`, allowing drift.
- `@arthax/types` interfaces hand-written and out of sync with the actual Prisma/Drizzle schema.
- Modeling `BENEFICIARY` or `USER_INVENTORY` without a clear foreign key back to `USER`/`BANK_ACCOUNT`.

## Handoff
Owned by **Database** alongside skill 12. Consumed by **Frontend** (via `@arthax/types`) and central to **Integration**'s job of making six portals feel like one backbone.
