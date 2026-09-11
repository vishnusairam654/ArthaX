---
name: observability
description: Logging, monitoring, and alerting — especially for settlement failures, ledger anomalies, and security events once ARTHAX is running somewhere real. Use when designing what to log/monitor/alert on for a production or production-like deployment, distinct from skill 11's audit log *data model* — this is the operational monitoring layer.
---

# Observability (ARTHAX)

## Overview
Once ARTHAX runs somewhere real (not just local dev), the things that most need visibility are exactly the things skill 04/05/10 identify as highest-risk: settlement failures, ledger anomalies, and security events.

## What to monitor
- **Settlement failures (skill 05)**: alert on any transaction entering FAILED/REVERSED state from SETTLING, especially in volume — a spike here signals a systemic CLS problem, not isolated user error.
- **Ledger anomalies (skill 04)**: automated periodic check that Total Debits = Total Credits system-wide; alert immediately on any imbalance, since this should structurally never happen and its occurrence means a serious bug.
- **Security events (skill 10/11)**: spikes in failed logins, account locks, permission-denied events — potential brute-force or credential-stuffing activity.
- **Latency/error rate**: standard API observability (p50/p95/p99 latency, error rate) per NestJS module (skill 03), with ledger/settlement endpoints held to tighter SLOs given their criticality.

## Rules
1. Ledger balance monitoring is a *scheduled job*, not just a dashboard someone has to remember to check — it should page someone on imbalance.
2. Alert thresholds distinguish "one user hit their rate limit" (noise) from "settlement failure rate crossed 5% in 10 minutes" (signal) — tune for actionability, not just raw event volume.
3. This skill consumes the audit log data model (skill 11) but adds the *alerting* layer on top — skill 11 defines what's captured, this skill defines what triggers a human response.

## Common mistakes
- Logging everything but alerting on nothing, so anomalies sit unnoticed in log volume.
- Alert fatigue from un-tuned thresholds causing the team to ignore alerts, including the ones that matter.
- No dashboard for ledger balance/imbalance — treating skill 20's manual verification as the only line of defense instead of automated continuous monitoring.

## Handoff
Owned by **DevOps** alongside skill 22. Becomes especially relevant "once this is running somewhere real" — build it before any real deployment, not after an incident.
