# ARTHAX Sovereign Financial Ecosystem — Production Deployment Guide

**Target Runtime**: Docker Compose / Kubernetes (Linux x86_64, Alpine 3.19+)  
**Node.js Version**: 20 LTS  
**PostgreSQL Version**: 16 Alpine  
**Redis Version**: 7 Alpine  

---

## 1. Secrets Management & Environment Isolation

All sensitive keys must be injected as environment variables at container launch. **Never hardcode or commit production secrets.**

| Variable | Description | Security Requirements |
|:---|:---|:---|
| `POSTGRES_PASSWORD` | Master password for PostgreSQL database | $\ge 32$ high-entropy random characters |
| `REDIS_PASSWORD` | Access token for Redis caching & locks | $\ge 32$ high-entropy random characters |
| `JWT_SECRET` | Primary HMAC-SHA256 signature key for bearer tokens | $\ge 64$ random alphanumeric characters |
| `FINANCIAL_PEPPER` | Argon2id secret salt for financial passwords | $\ge 64$ random hexadecimal characters |
| `API_PORT` | Listening port for NestJS API | Default: `3001` |
| `PORT` | Listening port for Next.js Web Portals | Default: `3000` |
| `CORS_ORIGIN` | Allowed web origins | Specific domain whitelist; never `*` in production |

### Secrets Rotation Protocol
1. **JWT Secret Rotation**: Generate secondary key `JWT_SECRET_PREV`. Support dual-token verification during a 24-hour transition window before revoking the deprecated key.
2. **Financial Pepper**: Immutable per environment epoch. Any change requires a sovereign re-hashing migration across all citizen accounts.

---

## 2. Pre-Flight Verification Checklist

Before exposing the ARTHAX cluster to transactional traffic, the operator must execute the following validation steps:

- [ ] **Step 1: Run Financial Invariant Regression Matrix**:
  ```powershell
  pnpm test:all
  ```
  *Requirement: 575+ passed, 0 failed.*
- [ ] **Step 2: Run Clean Next.js Build**:
  ```powershell
  pnpm --filter web build
  ```
  *Requirement: All 47 routes successfully prerendered / compiled.*
- [ ] **Step 3: Verify Append-Only Schema Migrations**:
  ```bash
  cd apps/api && pnpm prisma:migrate
  ```
- [ ] **Step 4: Seed Canonical Ledger Accounts**:
  ```bash
  cd apps/api && pnpm prisma:seed
  ```

---

## 3. Deployment Execution via Docker Compose

### 1. Build and Launch Containers
```bash
docker compose -f config/docker/docker-compose.prod.yml up -d --build
```

### 2. Verify Container Health Status
```bash
docker compose -f config/docker/docker-compose.prod.yml ps
```
All containers (`arthax-prod-postgres`, `arthax-prod-redis`, `arthax-prod-api`, `arthax-prod-web`, `arthax-prod-nginx`) must report `healthy`.

### 3. Post-Deployment Invariant Health Audit
Execute curl queries against the public gateway:

```bash
# 1. Process Liveness
curl -i http://localhost/api/v1/health/liveness

# 2. Database & Cache Readiness
curl -i http://localhost/api/v1/health/readiness

# 3. Cryptographic Ledger Balance Check
curl -i http://localhost/api/v1/health/ledger-integrity
```

The response for `ledger-integrity` must return:
```json
{
  "status": "HEALTHY",
  "imbalanceMinor": "0",
  "m0DiscrepancyMinor": "0",
  "stalledSettlementsCount": 0,
  "negativeAccountsCount": 0
}
```

---

## 4. Disaster Recovery & Rollback

In the event of a critical deployment failure:
1. Revert to previous image tag:
   ```bash
   docker compose -f config/docker/docker-compose.prod.yml stop api web
   docker tag arthax-api:previous arthax-api:latest
   docker compose -f config/docker/docker-compose.prod.yml up -d
   ```
2. For database rollbacks, refer to [Disaster Recovery Runbook](./disaster-recovery-runbook.md).
