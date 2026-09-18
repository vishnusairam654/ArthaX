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

### Step 6: Execute Prisma Staging Migration (Automatic on Every Deploy)
The pre-deploy command configured in Step 4 automatically executes on every deployment before traffic shifts:
```bash
npx prisma migrate deploy --schema=config/database/schema.prisma
```
This applies `config/database/migrations/20260918000000_init/migration.sql` to the managed PostgreSQL database, ensuring all 44 physical tables and the `_prisma_migrations` ledger are up to date before the API service starts.

### Step 7: Deterministic Staging Seed (Run Once During Initial Setup)
To protect persistent staging data from being overwritten on future deploys, seeding is decoupled from the deployment lifecycle. Run the seed **once** after your initial deployment:
```bash
# Option A: Via Railway CLI
railway run sh config/staging/seed-staging.sh

# Option B: Via Railway Console -> api service -> Settings -> Run Command
sh config/staging/seed-staging.sh
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
| `API_INTERNAL_URL` | `http://${{api.RAILWAY_PRIVATE_DOMAIN}}:3001/api/v1` | Internal SSR route resolution & runtime proxy target across Railway private VPC |
| `NEXT_PUBLIC_API_URL` | *(Leave completely empty)* | Enforces same-origin `/api/v1` browser routing through Next.js proxy |

> [!IMPORTANT]
> **Clean Same-Origin Reverse Proxy Architecture:**
> Do **not** bake or set the public API URL into `NEXT_PUBLIC_API_URL`. Setting `NEXT_PUBLIC_API_URL` causes browser requests to bypass the Next.js proxy and hit the public API directly.
> Leaving `NEXT_PUBLIC_API_URL` empty instructs the browser to use the same-origin `/api/v1/...` route. Next.js (`apps/web/next.config.mjs`) then proxies requests over Railway's private service mesh directly to `API_INTERNAL_URL`:
> ```text
> https://web-domain/api/v1/...
>         ↓
> Next.js (apps/web)
>         ↓ (Railway Private VPC)
> NestJS API (apps/api:3001)
> ```
> This gives you the cleanest zero-CORS deployment, isolates backend services, and avoids public URL baking.

### Step 10: Configure Public Domains & TLS
1. Under `web` $\rightarrow$ **Settings** $\rightarrow$ **Networking**:
   - Click **Generate Domain** or assign custom domain (e.g., `staging.arthax.gov` or `*.up.railway.app`).
   - Railway automatically provisions an edge TLS certificate (Let's Encrypt).
2. Under `api` $\rightarrow$ **Settings** $\rightarrow$ **Networking**:
   - Click **Generate Domain** (e.g., `api-staging.arthax.gov` or `*.up.railway.app`).
   - Copy the Web domain into `api` service's `CORS_ORIGIN` (e.g., `https://${{web.RAILWAY_PUBLIC_DOMAIN}}`).
   - Ensure `NEXT_PUBLIC_API_URL` on `web` remains empty.

### Step 11: Execute Staging Verification Harness
Run the standalone verification harness against the newly deployed staging services:
```bash
# Pass staging citizen credentials as temporary environment variables (never commit to git!)
STAGING_GOV_ID="GOV-8419-2041" \
STAGING_GOV_PASSWORD="[ONE_TIME_STAGING_PASSWORD]" \
STAGING_FINANCIAL_PASSWORD="[ONE_TIME_FINANCIAL_PASSWORD]" \
node config/staging/verify-staging.js https://[YOUR_API_DOMAIN] https://[YOUR_WEB_DOMAIN]
```

The verification harness executes 7 sequential verification stages:
1. **Liveness & Readiness:** Confirms API, PostgreSQL 16, and Redis 7 health probes.
2. **Double-Entry Invariant:** Probes `/api/v1/health/detailed` to confirm global balance (`imbalanceMinor = 0`).
3. **Database Seed Check:** Confirms 5 banks (NAVA, SAMAYA, SETU, STHIRA, VAYU) and 10 exchange companies.
4. **Citizen Authentication:** Verifies Argon2id login, session issuance, and active status with credentials/tokens strictly redacted.
5. **Live Inter-Bank Transfer:** Executes a real CLS transfer of 100.00 ARTH from NAVA to SETU.
6. **Explicit Idempotency Verification:** Replays the transfer with the exact same `Idempotency-Key` and asserts:
   - Request #1 $\rightarrow$ transfer succeeds $\rightarrow$ returns transaction ID.
   - Request #2 $\rightarrow$ returns identical transaction ID $\rightarrow$ **NO second debit**, **NO second credit**.
   - Exactly 1 transaction record exists in the ledger (zero duplicate rows).
7. **Same-Origin Proxy Check:** Verifies Next.js SSR routes (`/`, `/bank`) and same-origin `/api/v1` reverse proxy.

### Step 12: Controlled Persistence & Fail-Closed Drills

#### 1. API Restart Persistence Drill
- Record citizen balances in NAVA and SETU.
- Restart the Railway `api` service.
- Re-run verification / login: verify the user, ledger balances, and transaction history remain intact.

#### 2. PostgreSQL Fail-Closed Integrity Drill
> [!CAUTION]
> **Drill Precondition:**
> Only perform this drill when **no other staging workloads or tests depend on that database**.

The critical assertion is that a database failure must fail closed with zero corruption:
```text
PostgreSQL unavailable
        ↓
Financial write rejected
        ↓
HTTP 503 Service Unavailable
        ↓
PostgreSQL restored
        ↓
NO transaction created
NO ledger entries created
NO balance mutation
NO partial transfer state
```

**Step-by-step drill procedure:**
1. Record baseline source and destination account balances via `/api/v1/banks/user/accounts`.
2. In Railway Console, temporarily pause/stop the `Postgres` service.
3. Attempt a transfer:
   ```bash
   curl -i -X POST https://[YOUR_API_DOMAIN]/api/v1/banks/transfers \
     -H "Authorization: Bearer $TOKEN" \
     -H "idempotency-key: $(uuidgen)" \
     -H "Content-Type: application/json" \
     -d '{"sourceAccountId":"...","destinationAccountNumber":"...","amountMinor":"10000","financialPassword":"..."}'
   ```
4. **Assert HTTP 503:** The API immediately rejects the financial write with HTTP 503 Service Unavailable.
5. In Railway Console, resume the `Postgres` service.
6. Run the post-drill integrity check:
   ```bash
   node config/staging/verify-staging.js https://[YOUR_API_DOMAIN] --failclosed-verify
   ```
7. Re-query account balances and verify all 4 invariants:
   - **NO transaction created:** Querying `/api/v1/banks/accounts/:id/transactions` shows no new transaction record.
   - **NO ledger entries created:** Journal entry count remains unchanged.
   - **NO balance mutation:** Source and destination balances match baseline down to the exact minor unit.
   - **NO partial transfer state:** `/api/v1/health/detailed` confirms `imbalanceMinor: 0` and status `BALANCED`.

---

## Staging Security & Secret Management

1. **Zero Public Exposure for Databases:** PostgreSQL and Redis must NEVER have public domains generated in Railway. All access occurs strictly over Railway's private service mesh.
2. **Secret Management:** Secrets (`JWT_SECRET`, `FINANCIAL_PEPPER`) must only be entered via Railway's encrypted environment variable dashboard and NEVER checked into git.
3. **Staging Credential Hygiene & Rotation:** Staging passwords and test seeds must be treated as staging secrets. Never commit them into repository files or use them as reusable credentials. Rotate staging credentials immediately after completing validation.
4. **Log Sanitization:** Verification scripts and CI pipelines must never print passwords, session tokens, JWTs, or financial passwords into CI logs or stdout.

