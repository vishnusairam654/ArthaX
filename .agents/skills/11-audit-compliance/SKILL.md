---
name: audit-compliance
description: SYSTEM_LOG / COMPLIANCE_REPORT / SECURITY_EVENT structures and what the Central Bank's audit trail actually requires. Use when designing logging schemas, building the Central Bank's audit views, or reasoning about what must be captured for a compliance report. Distinct from skill 20 (Financial Verification), which checks that the money is *correct* — this skill checks that the *trail* exists and is trustworthy.
---

# Audit & Compliance (ARTHAX)

## Overview
The Oversight Layer (last in the DB creation order, skill 02) captures what happened across the system: `SYSTEM_LOG`, `COMPLIANCE_REPORT`, `SECURITY_EVENT`.

## What must be captured
- **SYSTEM_LOG**: logins, transfers, admin actions, system events — enough detail to reconstruct "who did what, when, from where" for any sensitive action.
- **SECURITY_EVENT**: failed logins, account locks, step-up auth failures, permission-denied events — the security-relevant subset, queryable independently of general system logs for fast incident response.
- **COMPLIANCE_REPORT**: aggregated/derived reports the Central Bank Portal surfaces — bank health, risk indicators, regulatory adherence — built from SYSTEM_LOG/SECURITY_EVENT plus ledger/CLS data (skill 04/05), not a separate freeform log.

## Rules
1. Audit logs are append-only, same discipline as the ledger (skill 04) — no UPDATE/DELETE on posted log entries, ever.
2. Every sensitive action (transfer, trade, FD creation, admin approve/suspend, step-up auth attempt) must produce a log entry *synchronously with* the action, not as a best-effort async afterthought that can silently fail and leave a gap.
3. Log entries must reference the actor (user_id or admin_id), the resource affected, and enough context to be useful in an actual investigation — "transaction failed" without the transaction_id is not an audit log, it's noise.
4. COMPLIANCE_REPORT generation must be reproducible: given the same log/ledger data, regenerating a report should produce the same output, since Financial Auditor (skill 20) will need to independently validate it.

## Common mistakes
- Logging only successes and skipping failed/denied attempts, which is exactly the data an incident investigation needs most.
- Fire-and-forget async logging with no monitoring for dropped log writes (coordinate with skill 23, Observability).
- Central Bank's audit trail UI querying raw ledger/CLS tables directly instead of the purpose-built audit structures.

## Handoff
Owned by **Financial Auditor** alongside skill 20, but the *logging infrastructure itself* is built earlier by Backend/DevOps — Financial Auditor defines requirements, doesn't necessarily write the logging middleware.
