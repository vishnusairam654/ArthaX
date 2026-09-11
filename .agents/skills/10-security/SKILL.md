---
name: security
description: RBAC enforcement, rate limiting, account locks, session hardening, and admin-access restrictions on Central Bank/Bank portals. Use for anything involving guards, role checks, brute-force protection, or locking down admin-only surfaces. Pairs tightly with skill 09 (Identity & Authentication) but is specifically about enforcement, not the identity model itself.
---

# Security (ARTHAX)

## Overview
Security is the enforcement layer on top of Identity (skill 09) — RBAC, rate limiting, account locking, and the hard separation between public user access and admin-only portals.

## RBAC roles (initial)
- **User**: standard individual portal access.
- **Central Bank Admin**: regulatory oversight and settlement management.
- **Bank Admin**: commercial bank operational management (scoped to their own bank — Bank A admin must not see Bank B's customers).

## Responsibilities
1. **Guards**: every controller endpoint (skill 03) that isn't public must have an explicit role/permission guard — no "authenticated therefore authorized" assumption.
2. **Rate limiting**: applied at minimum to login, OTP request/verify, and password reset endpoints; extend to transaction endpoints to blunt automated abuse.
3. **Account locks**: repeated failed login or step-up auth attempts lock the account and require an explicit unlock flow (support/admin action or time-based cooldown) — don't let it be silently bypassable by retrying.
4. **Session hardening**: session tokens scoped correctly (see skill 09's separation between user session and admin session), rotated on privilege escalation (e.g., completing step-up auth), invalidated on logout across all portals since the session is unified.
5. **Admin-access restrictions**: Central Bank and Bank portals use pre-provisioned, non-public credentials — there is no public "become a bank admin" signup path, and this must be enforced server-side, not just hidden in the UI.

## Rules
- Bank Admin's RBAC scope is per-bank, not global — a guard checking "is Bank Admin" is insufficient; it must also check "is Bank Admin *for this bank_id*."
- Rate limiting decisions belong in a shared middleware/interceptor, not duplicated per-controller.
- Never expose whether an email/GOV_ID exists via distinguishable error messages on login/forgot-password (enumeration protection).

## Common mistakes
- A guard that checks role but not resource ownership/scope (Bank Admin seeing another bank's data).
- Rate limiting only the login endpoint and forgetting OTP verify, which is often the more valuable target.
- UI-only hiding of admin routes without a server-side guard behind them.

## Handoff
Owned by **Identity & Security** alongside skill 09. **QA** (skill 19) should include negative-path tests (wrong role, wrong scope, locked account) as first-class test cases, not afterthoughts.
