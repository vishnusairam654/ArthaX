# ArthaX — Sovereign Financial Ecosystem

ArthaX is a full-stack, institutional-grade sovereign financial ecosystem featuring an immutable double-entry ledger, multi-bank clearance & settlement (CLS), commercial banking, a real-time stock exchange, sovereign lending, and interactive citizen & governor portals.

---

## 🏛️ Ecosystem Architecture & Portals

- **Central Bank Portal**: Monetary policy corridor, CRR/SLR/CAR prudential supervision, dual-control Maker-Checker issuance (>1M ARTH), and systemic emergency circuit breakers.
- **Commercial Bank Portals**: Retail and commercial banking operations across 5 chartered banks (*Nava, Samaya, Setu, Sthira, Vayu*).
- **User Portal**: Personal banking, multi-account switching, two-legged transfers, Fixed Deposits, and loan contracts.
- **Stock Exchange Portal**: Live order book, DvP trade execution, 10 listed sovereign tickers, and profit-only 15% Capital Gains Tax deduction.
- **Shop & Rewards Portal**: Sovereign companion virtual economy with direct ledger debiting and financial modifiers.
- **CLS (Central Settlement Layer)**: Real-Time Gross Settlement (RTGS) engine with automated contra-reversal rollbacks.

---

## 🛡️ Core Financial & Security Invariants

1. **Double-Entry Balance Invariant**: Every journal entry strictly enforces $\sum \text{Debits} \equiv \sum \text{Credits}$ at runtime and database triggers.
2. **Integer Minor Units**: All monetary calculations are performed strictly in integer minor units ($1\text{ ARTH} = 100\text{ minor units}$). Floating-point currency math is prohibited.
3. **Dual Base Money ($M0$) Invariant**: Macroeconomic money supply satisfies $M0_{\text{current}} \equiv M0_{\text{initial}} + \sum \text{Mints} - \sum \text{Burns}$.
4. **Strict Dual-Password Isolation**: GOV Password authenticates citizen identity; independent Financial Password authorizes state-altering money movement.
5. **Active Observability Watcher**: Autonomous background service continuously monitors ledger integrity and dispatches critical paging alerts on any discrepancy.

---

## 🧪 Master Invariant Test Matrix

The entire monorepo is protected by a non-skippable financial invariant test matrix executing across 15 suites:

```bash
# Execute master regression matrix across all 15 suites
pnpm test:all
```

| Phase | Domain Name | Invariants Verified | Status |
|:---|:---|:---:|:---:|
| **Phase 2A** | Identity & Real Database Auth | 48 | ✔ PASSED |
| **Phase 2B** | Runtime Persistence & Fail-Closed | 35 | ✔ PASSED |
| **Phase 4** | Core Double-Entry Ledger | 33 | ✔ PASSED |
| **Phase 5** | Commercial Banking Domain | 24 | ✔ PASSED |
| **Phase 6** | Central Settlement Layer (CLS) | 36 | ✔ PASSED |
| **Phase 7** | Stock Market & Tax Engine | 50 | ✔ PASSED |
| **Phase 8** | Shop & Virtual Economy | 53 | ✔ PASSED |
| **Phase 9** | Notifications & Mailbox | 51 | ✔ PASSED |
| **Phase 10** | Fixed Deposits & Yield Engine | 50 | ✔ PASSED |
| **Phase 11** | ARTHAX World Integration | 51 | ✔ PASSED |
| **Phase 12A** | Commercial Credit & Lending | 51 | ✔ PASSED |
| **Phase 12B** | Central Bank Policy & Governance | 52 | ✔ PASSED |
| **Phase 13** | Cross-Portal End-to-End Journey | 35 | ✔ PASSED |
| **Phase 13** | Concurrency & Race Conditions | 21 | ✔ PASSED |
| **Phase 13** | Security Fault-Injection Matrix | 27 | ✔ PASSED |
| **Phase 13** | WCAG 2.1 AA Accessibility Audit | 22 | ✔ PASSED |
| **Phase 14** | DevOps & Production Hardening | 25 | ✔ PASSED |
| **TOTAL** | **17 Master Suites** | **664 PASSED** | **0 FAILED** |

---

## 🚀 Quickstart & Production Operations

### Development Mode
```bash
# 1. Install workspace dependencies
pnpm install

# 2. Configure environment
cp .env.example .env

# 3. Launch local PostgreSQL & Redis
pnpm docker:up

# 4. Generate Prisma client & seed canonical accounts
pnpm --filter @arthax/api run prisma:generate
pnpm --filter @arthax/api run prisma:seed

# 5. Start development servers
pnpm dev
```

### Production Deployment
```bash
# Build and launch complete production container stack (Postgres, Redis, API, Web, Nginx)
docker compose -f config/docker/docker-compose.prod.yml up -d --build

# Verify cluster health
curl -f http://localhost/api/v1/health/liveness
curl -f http://localhost/api/v1/health/readiness
curl -f http://localhost/api/v1/health/ledger-integrity
```

---

## 📚 Architectural Decision Records & Operational Runbooks

- [Disaster Recovery Runbook](config/docs/disaster-recovery-runbook.md): Escalation protocols, cold ledger reconstruction, and snapshot re-anchoring.
- [Production Deployment Guide](config/docs/production-deployment-guide.md): Secrets management, rotation procedures, and deployment checklist.
- [ADR-001: Immutable Append-Only Double-Entry Ledger](config/docs/adr/ADR-001-double-entry-ledger.md)
- [ADR-002: Strict Dual-Password Isolation](config/docs/adr/ADR-002-dual-password-auth.md)
- [ADR-003: CLS Two-Legged RTGS Architecture](config/docs/adr/ADR-003-central-settlement.md)
- [ADR-004: Dual Macroeconomic Invariants & Maker-Checker](config/docs/adr/ADR-004-sovereign-invariants.md)
- [ADR-005: Loan Amortization with Residual Absorption](config/docs/adr/ADR-005-loan-amortization.md)
