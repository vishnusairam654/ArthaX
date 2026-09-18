# ADR-003: Central Settlement Layer (CLS) Two-Legged RTGS Architecture

**Status**: ACCEPTED / INVARIANT  
**Date**: 2026-08-18  
**Deciders**: Settlement Architect, Banking Domain Lead  

---

## Context
Commercial banks in ARTHAX operate as autonomous tenant entities (e.g. Neo Bank, Royal Bank, Apex Bank, Vanguard, Horizon). When a customer at Bank A transfers funds to a customer at Bank B:
- A naive 1-legged debit/credit approach directly moves funds from Customer A to Customer B, which obscures inter-bank liquidity balances and violates institutional boundaries.
- Alternatively, a deferred net settlement (DNS) batch leaves banks exposed to intraday credit risks and insolvency cascades.

---

## Decision
ARTHAX routes all inter-bank transfers through a centralized **Real-Time Gross Settlement (RTGS)** engine via the Central Settlement Layer (`ClsService`):
1. **Two-Legged Settlement Structure**:
   - **Leg 1 (Outbound Debit)**: Customer A is debited; Bank A's institutional transit pool is credited.
   - **Clearing Hub**: Funds transfer through the Central Bank clearing account (`sys_cls_clearing`).
   - **Leg 2 (Inbound Credit)**: Bank B's institutional transit pool is debited; Customer B is credited.
2. **Atomic Rollback Contra-Entries**:
   - If Leg 2 fails (e.g. beneficiary account frozen or nonexistent), Leg 1 is atomically refunded via an automated contra-entry: `DEBIT sys_cls_clearing` / `CREDIT customer_source_account`.
   - The transaction state transitions cleanly: `VALIDATING` $\rightarrow$ `PROCESSING` $\rightarrow$ `SETTLING` $\rightarrow$ `REVERSED`.
3. **Statutory Bank Moratoriums**:
   - Transfers to or from a commercial bank under active Central Bank moratorium are immediately blocked before Leg 1 execution.

---

## Consequences
### Positive
- **Zero Inter-Bank Counterparty Risk**: Transfers settle gross in real time without deferred settlement exposure.
- **Auditable Inter-Bank Positions**: Central Bank can inspect real-time institutional exposure between commercial banks at any millisecond.

### Negative / Trade-Offs
- **Increased Entry Volume**: A single inter-bank payment generates 4 journal entries rather than 2.
- **Latency**: Two-phase multi-tenant routing introduces modest coordination overhead.
