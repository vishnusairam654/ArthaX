# ==============================================================================
# ARTHAX SOVEREIGN FINANCIAL ECOSYSTEM — PRODUCTION API DOCKERFILE
# Multi-Stage Build: Deps -> Builder -> Hardened Minimal Runner
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependency Extraction
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Enable corepack for pnpm management
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate

# Copy monorepo manifests
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/tokens/package.json ./packages/tokens/
COPY packages/validation/package.json ./packages/validation/
COPY packages/database/package.json ./packages/database/

RUN pnpm install --frozen-lockfile

# ------------------------------------------------------------------------------
# Stage 2: Compilation & Prisma Generation
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.3.4 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .

# Generate Prisma Client for Sovereign Schema
RUN cd config/database && npx prisma generate --schema=schema.prisma || true

# Build shared packages and NestJS API
RUN pnpm --filter @arthax/types build || true
RUN pnpm --filter @arthax/validation build || true
RUN pnpm --filter @arthax/database build || true
RUN pnpm --filter @arthax/api build

# ------------------------------------------------------------------------------
# Stage 3: Hardened Production Runner
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
RUN apk add --no-cache dumb-init curl
WORKDIR /app

ENV NODE_ENV=production
ENV API_PORT=3001

# Create non-root system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 arthax

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/config/database ./config/database

# Enforce non-root ownership
RUN chown -R arthax:nodejs /app

USER arthax

EXPOSE 3001

# Healthcheck targeting the active liveness probe
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/api/v1/health/liveness || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "apps/api/dist/main"]
