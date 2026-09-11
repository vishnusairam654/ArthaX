---
name: tax-financial-rules
description: Central Bank monetary policy — interest rates, reserve requirements, transaction limits, tax rules, and investment rules. Use whenever defining or reading a rate, limit, or rule that Banking (skill 06) or Investment/Market (skill 07) depends on. This skill owns policy; it does not execute transactions itself.
---

# Tax & Financial Rules (ARTHAX)

## Overview
Central Bank policy is the rule layer that Banking Domain and Investment/Market read from — `REGULATORY_POLICY`, `TAX_RULE`, and related tables under Central Bank's domain in the schema (skill 13).

## Scope
- **Interest rates**: base rates that FD schemes (skill 06) reference rather than hardcode.
- **Reserve requirements**: constraints on commercial banks, enforced/monitored via Central Bank Portal oversight.
- **Transaction limits**: per-transaction and cumulative limits, enforced at the point of transaction validation (skill 04's VALIDATING state) — this is where limits actually get checked, not as an afterthought in the UI.
- **Tax rules**: rates and brackets applied to realized trade profit (skill 07) and potentially interest income.
- **Investment rules**: market-level constraints (e.g., trading hours, position limits) that Investment/Market enforces.

## Rules
1. Rules are *data*, not code. A rate or limit change should be a `REGULATORY_POLICY`/`TAX_RULE` row update, not a deploy — this is what makes Central Bank Portal's "Rules" screen meaningful rather than cosmetic.
2. Rule changes need an effective-from timestamp/version so historical transactions can be re-evaluated against the rule that was active at the time, not the current rule — critical for Financial Auditor (skill 20) doing period reconciliation.
3. Transaction limit enforcement happens in the Core Ledger's VALIDATING step (skill 04), reading current policy — it is a ledger-layer check, not a UI-layer check, even though the UI should also give early feedback.
4. Tax calculation (skill 07) must be able to cite which rule version it applied.

## Common mistakes
- Hardcoding a tax rate or interest rate as a constant in application code instead of a policy row.
- Applying today's rate to a historical transaction during recalculation instead of the rate that was active when it occurred.
- Letting the UI be the only place transaction limits are checked, which makes them trivially bypassable via direct API calls.

## Handoff
Owned by **Financial Engineer**. Central Bank Portal's Rules UI (skill 06) is Frontend/Backend work on top of this data; Financial Auditor (skill 11/20) verifies rule application was correct.
