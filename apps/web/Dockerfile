# ==============================================================================
# ARTHAX SOVEREIGN FINANCIAL ECOSYSTEM — PRODUCTION WEB DOCKERFILE
# Multi-Stage Standalone Build: Deps -> Builder -> Hardened Minimal Runner
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
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/tokens/package.json ./packages/tokens/
COPY packages/validation/package.json ./packages/validation/

RUN pnpm install --frozen-lockfile

# ------------------------------------------------------------------------------
# Stage 2: Next.js Standalone Build
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.3.4 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

# Environment variables for build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV BUILD_STANDALONE=true

# Compile shared packages and Next.js static / server pages
RUN pnpm --filter @arthax/types build || true
RUN pnpm --filter @arthax/tokens build || true
RUN pnpm --filter @arthax/validation build || true
RUN pnpm --filter web build

# ------------------------------------------------------------------------------
# Stage 3: Hardened Production Runner
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
RUN apk add --no-cache dumb-init curl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone server bundle
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

# Healthcheck targeting the web server port
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "apps/web/server.js"]
