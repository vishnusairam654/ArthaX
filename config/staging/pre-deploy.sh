#!/bin/sh
set -e

echo "===================================================="
echo "  ARTHAX STAGING PRE-DEPLOY: MIGRATION & SEEDING   "
echo "===================================================="

echo "▶ Executing Prisma Migrate Deploy against Managed PostgreSQL..."
npx prisma migrate deploy --schema=config/database/schema.prisma

if [ "$SEED_DATABASE" = "true" ]; then
  echo "▶ Executing Deterministic Staging Seeding..."
  npx ts-node --transpile-only -P tsconfig.json config/database/seeds/seed.ts
fi

echo "✔ Pre-deploy database migration and verification completed."
