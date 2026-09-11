# ArthaX — Sovereign Financial Ecosystem

ArthaX is a full-stack, institutional-grade simulated sovereign financial ecosystem featuring a double-entry ledger, multi-bank clearance & settlement (CLS), commercial banking, a real-time stock exchange, and interactive portals.

## Portals & Modules

- **Central Bank Portal**: Monetary policy, reserve ratios, audit logs, and systemic oversight.
- **Commercial Bank Portals**: Core retail and commercial banking operations.
- **User Portal**: Personal banking, accounts, transfers, and transactions.
- **Stock Exchange Portal**: Live order book, trade execution, and portfolio analytics.
- **Shop & Rewards Portal**: Sovereign gamification, rewards, and customization.
- **CLS (Central Settlement Layer)**: Inter-bank clearing and double-entry transaction settlement.

## Tech Stack

- **Monorepo**: Turborepo, pnpm
- **Backend**: NestJS, PostgreSQL 16 (Double-entry ledger), Redis 7
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, GSAP, Anime.js
- **Shared Packages**: `@arthax/types`, `@arthax/validation`, `@arthax/tokens`

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (PostgreSQL 16 & Redis 7)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Start infrastructure
docker compose up -d

# Run migrations & seed database
pnpm db:migrate
pnpm db:seed

# Start development servers
pnpm dev
```

## Security & Architectural Invariants

- **Single Double-Entry Ledger**: Every journal entry strictly enforces $\Sigma \text{ debits} = \Sigma \text{ credits}$.
- **Integer Minor Units**: All monetary values are handled in integer minor units (1 ARTH = 100 minor units). Floats are strictly prohibited in ledger math.
- **Dual-Password Isolation**: GOV Password for identity authentication; isolated Financial Password for money movement.
- **Zero Secret Exposure**: `.env` and sensitive credentials are never committed.
