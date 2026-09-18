# ADR-002: Strict Dual-Password Isolation (GOV Identity vs. Financial Authorization)

**Status**: ACCEPTED / INVARIANT  
**Date**: 2026-08-14  
**Deciders**: Chief Security Officer, Identity Architect  

---

## Context
In monolithic web applications, a single user password or session token grants access to all system functions, from browsing user profiles to initiating irreversible fund transfers. If a user's session token is intercepted, or their credentials are compromised via phishing, their entire net worth can be extracted immediately.

---

## Decision
ARTHAX enforces strict physical and cryptographic separation between two independent credential tiers:
1. **GOV Identity Password**:
   - Used solely to authenticate identity, issue initial JWT session tokens, and access non-monetary portals.
   - Hashed using Argon2id with identity salt.
   - Cannot authorize monetary movements under any circumstance.
2. **Financial Password**:
   - Required for step-up verification on all state-altering monetary operations (fund transfers, loan applications, fixed deposit creation, and sovereign issuances).
   - Hashed using Argon2id with a separate system-wide secret pepper (`FINANCIAL_PEPPER`).
   - Verified via short-lived ephemeral step-up tokens (valid for 5 minutes, single-use, nonces bound).
   - `autocomplete="off"` enforced in all client forms; inputs are never logged in application or web server traces.
   - GOV password and Financial password never share visual UI styling or appear on screen simultaneously outside account security settings.

---

## Consequences
### Positive
- **Defense in Depth**: Compromise of a bearer token or identity credential does not allow unauthorized money movement.
- **Zero Accidental Transfers**: Requires deliberate conscious input by the citizen for every financial commitment.

### Negative / Trade-Offs
- **User Friction**: Users must remember and enter two distinct credentials.
- **Form Complexity**: Workflows require an explicit step-up modal dialog prior to execution.
