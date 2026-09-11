---
name: identity-authentication
description: GOV_ID / ARTHAX User model, OTP flow, GOV password vs Financial password separation, unified cross-portal session, and step-up auth. Use for anything involving registration, login, session handling, password flows, or the identity data model. Trigger this before writing any auth-adjacent code, even "simple" ones like a password reset — the two-password separation is easy to violate accidentally.
---

# Identity & Authentication (ARTHAX)

## Overview
ARTHAX has a strict identity hierarchy: Email → GOV_ID → ARTHAX User → Bank Customer → Bank Account, each a 1:1 or 1:many relationship, never reversed.

## Identity hierarchy
- 1 Email ↔ 1 GOV_ID
- 1 GOV_ID ↔ 1 ARTHAX User
- 1 ARTHAX User ↔ Many bank accounts

## Entities
- **GOV_ID**: gov_id, email, password_hash, email_verified, status.
- **USER**: user_id, gov_id, financial_password_hash, status.
- **BANK_CUSTOMER**: user_id, bank_id, customer_id, joined_at.
- **BANK_ACCOUNT**: account_id, user_id, bank_id, account_type, purpose, status.

## Authentication flows
1. **Registration**: Email verification (OTP) → GOV ID creation → GOV password.
2. **Main account setup**: post-registration, user sets a **Financial Password** (separate credential from GOV password) and selects an initial banking purpose (Salary/Savings/Investment), which drives bank recommendations.
3. **Session**: one unified session persists across User, Bank, Stocks, and Shop portals. Central Bank/Bank admin portals use separate, pre-provisioned, non-public credentials (skill 10).
4. **Step-up auth**: Financial Password + OTP/MFA required for sensitive actions — transfers, stock trades, FD creation, shop/gift purchases with real value.

## Rules — credential separation is load-bearing
1. **GOV Password** authenticates identity and general account access (viewing, navigation). It must never authorize a money-moving action on its own.
2. **Financial Password** is required exclusively for high-value operations. A session authenticated only with GOV password can browse but cannot transact.
3. Forgot-password flows must be built separately for GOV password and Financial password — resetting one must never silently reset or weaken the other.
4. Step-up auth (Financial Password + OTP/MFA) is re-checked per sensitive action or per short-lived elevated session, not granted once and cached indefinitely.

## Common mistakes
- Treating "logged in" as sufficient for a transfer endpoint instead of checking for a fresh step-up assertion.
- One password reset flow that resets both GOV and Financial passwords together.
- Storing financial_password_hash and password_hash with the same salt/derivation reused across both (each must be independently salted).
- Letting a Central Bank/Bank Admin session share cookie/session scope with the regular user session.

## Handoff
Owned by **Identity & Security**, built in phase 2 (skill 02) alongside Database. Every other domain's guards (skill 10) and step-up checks (skill 04's transaction validation) depend on this being correct first.
