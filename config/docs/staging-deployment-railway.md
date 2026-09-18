# ARTHAX Sovereign Financial Ecosystem — Railway Staging Deployment Runbook

This document specifies the exact, step-by-step rollout procedure for deploying ARTHAX to a managed cloud staging environment on **Railway**, conforming to all sovereign financial isolation, zero-downtime migration, and dual-password security invariants.

---

## Architecture Topology

```text
                                 INTERNET
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        Next.js 14 Standalone                 NestJS API Gateway
        [apps/web Dockerfile]                [apps/api Dockerfile]
        Port: 3000                           Port: 3001
        Health: /                            Health: /api/v1/health/liveness
                  │                                   │
                  │ (HTTP / JSON API)                 │
                  └───────────────────────────────────┤
                                                      │ (Private VPC Mesh)
                                            ┌─────────┴─────────┐
                                            ▼                   ▼
                                   Railway Managed     Railway Managed
                                     PostgreSQL 16         Redis 7
                                   [Private Network]   [Private Network]
                                   (44 Tables + PITR)  (Auth & Sessions)
```

---

## 12-Step Rollout Sequence

### Step 1: Create Railway Project
1. Log in to your [Railway Console](https://railway.com/).
2. Click **New Project** $\rightarrow$ **Empty Project**.
3. Rename the project to `arthax-staging`.

### Step 2: Provision Managed PostgreSQL 16
1. In the project canvas, click **Create** $\rightarrow$ **Database** $\rightarrow$ **Add PostgreSQL**.
2. Railway automatically spins up a dedicated PostgreSQL 16 container inside the private project network.
3. Keep the service named `Postgres`.
4. Note that Railway automatically injects `DATABASE_URL` as a service variable.
5. **CRITICAL:** Do NOT enable public networking for PostgreSQL. It must remain strictly accessible only via the private mesh.

### Step 3: Provision Managed Redis 7
1. In the project canvas, click **Create** $\rightarrow$ **Database** $\rightarrow$ **Add Redis**.
2. Railway automatically spins up a dedicated Redis 7 container inside the private project network.
3. Keep the service named `Redis`.
4. Note that Railway automatically injects `REDIS_URL` as a service variable.
5. **CRITICAL:** Do NOT enable public networking for Redis.

### Step 4: Deploy NestJS API Service
1. Click **Create** $\rightarrow$ **GitHub Repo** $\rightarrow$ Select `vishnusairam654/ArthaX`.
2. Name the service `api`.
3. In service **Settings**:
   - **Source Directory:** `/` (repo root)
   - **Build Method:** Dockerfile
   - **Dockerfile Path:** `apps/api/Dockerfile`
   - **Pre-deploy Command:** `sh config/staging/pre-deploy.sh`
   - **Healthcheck Path:** `/api/v1/health/liveness`
   - **Healthcheck Timeout:** `15` seconds
   - **Restart Policy:** On Failure (10 retries)

### Step 5: Configure API Environment Variables
Under the `api` service **Variables** tab, configure:

| Variable Name | Value / Railway Reference | Purpose |
|---|---|---|
| `NODE_ENV` | `staging` | Staging runtime flag |
| `API_PORT` | `3001` | NestJS internal listening port |
| `PORT` | `3001` | Railway port mapping |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Private dynamic reference to PostgreSQL |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Private dynamic reference to Redis |
| `JWT_SECRET` | *(Generate 64+ char hex string)* | HS256 JWT signing secret |
| `FINANCIAL_PEPPER` | *(Generate 64+ char hex string)* | Argon2id financial password pepper |
| `SEED_DATABASE` | `true` (first run, then `false`) | Triggers deterministic baseline seed |
| `CORS_ORIGIN` | `https://${{web.RAILWAY_PUBLIC_DOMAIN}}` | Enforces browser CORS origin isolation |

### Step 6: Execute Prisma Staging Migration
The pre-deploy command configured in Step 4 automatically executes:
```bash
npx prisma migrate deploy --schema=config/database/schema.prisma
```
This applies `config/database/migrations/20260918000000_init/migration.sql` to the managed PostgreSQL database, creating all 44 physical tables and the `_prisma_migrations` tracking table before the API service begins accepting live traffic.

### Step 7: Deterministic Staging Seed
When `SEED_DATABASE=true` is set, `config/staging/pre-deploy.sh` invokes:
```bash
npx ts-node --transpile-only -P tsconfig.json config/database/seeds/seed.ts
```
This populates:
- 5 Canonical Banks (NAVA, SAMAYA, SETU, STHIRA, VAYU)
- Central Monetary Authority charter & officials
- 10 Listed Companies on the Sovereign Equities Exchange
- 45 Shop Customization items with modest perks
- Statutory Monetary Policy benchmarks & Tax rules
- Test Citizen (`citizen@arthax.gov`) with partitioned bank accounts

### Step 8: Deploy Next.js Web Service
1. Click **Create** $\rightarrow$ **GitHub Repo** $\rightarrow$ Select `vishnusairam654/ArthaX`.
2. Name the service `web`.
3. In service **Settings**:
   - **Source Directory:** `/` (repo root)
   - **Build Method:** Dockerfile
   - **Dockerfile Path:** `apps/web/Dockerfile`
   - **Healthcheck Path:** `/`
   - **Restart Policy:** On Failure

### Step 9: Configure Web Environment Variables
Under the `web` service **Variables** tab, configure:

| Variable Name | Value / Railway Reference | Purpose |
|---|---|---|
| `NODE_ENV` | `production` | Next.js production optimization |
| `PORT` | `3000` | Web server listening port |
| `NEXT_PUBLIC_API_URL` | `https://${{api.RAILWAY_PUBLIC_DOMAIN}}/api/v1` | Public API endpoint for browser calls |
| `API_INTERNAL_URL` | `http://${{api.RAILWAY_PRIVATE_DOMAIN}}:3001/api/v1` | Internal SSR route resolution |

### Step 10: Configure Public Domains & TLS
1. Under `web` $\rightarrow$ **Settings** $\rightarrow$ **Networking**:
   - Click **Generate Domain** or assign custom domain (e.g., `staging.arthax.gov` or `*.up.railway.app`).
   - Railway automatically provisions an edge TLS certificate (Let's Encrypt).
2. Under `api` $\rightarrow$ **Settings** $\rightarrow$ **Networking**:
   - Click **Generate Domain** (e.g., `api-staging.arthax.gov` or `*.up.railway.app`).
   - Copy the domain into `CORS_ORIGIN` and `NEXT_PUBLIC_API_URL`.

### Step 11: Real Staging Verification & Health Checks
Verify all healthcheck probes:
1. **API Liveness Probe:**
   ```bash
   curl -i https://[YOUR_API_DOMAIN]/api/v1/health/liveness
   # HTTP 200 OK: {"status":"healthy","uptime":...}
   ```
2. **API Readiness Probe (Verifies PostgreSQL + Redis connectivity):**
   ```bash
   curl -i https://[YOUR_API_DOMAIN]/api/v1/health/readiness
   # HTTP 200 OK: {"status":"ready","database":"connected","redis":"connected"}
   ```
3. **API Detailed Ledger Integrity Probe:**
   ```bash
   curl -i https://[YOUR_API_DOMAIN]/api/v1/health/detailed
   # HTTP 200 OK: {"ledgerStatus":"BALANCED","imbalanceMinor":0}
   ```

### Step 12: Real Staging E2E & Persistence Drills
1. **Persistence Cycle:**
   - Register a new citizen via `https://[YOUR_WEB_DOMAIN]/register`.
   - Submit OTP code and configure GOV password.
   - Set separate Financial Password.
   - Transfer 100.00 ARTH from NAVA to SETU.
   - Restart the Railway `api` service.
   - Log back in: verify the user, ledger balances, and transaction history remain intact.
2. **Fail-Closed Verification:**
   - Temporarily pause the `Postgres` service in Railway.
   - Attempt a financial transfer.
   - Verify the request fails closed with an HTTP 503 error, and no partial or corrupt ledger entries are created.
   - Resume `Postgres`.

---

## Staging Security Guidelines

1. **Zero Public Exposure for Databases:** PostgreSQL and Redis must NEVER have public domains generated in Railway. All access occurs over Railway's private service mesh.
2. **Secret Management:** Secrets (`JWT_SECRET`, `FINANCIAL_PEPPER`) must only be entered via Railway's encrypted environment variable dashboard and NEVER checked into git.
3. **No Production Reuse:** Staging passwords and test seeds must never be reused in production environments.
