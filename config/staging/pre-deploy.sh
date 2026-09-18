#!/bin/sh
set -e

echo "===================================================="
echo "  ARTHAX STAGING PRE-DEPLOY: PRISMA MIGRATE DEPLOY  "
echo "===================================================="

echo "▶ Applying pending database migrations to Managed PostgreSQL..."
npx prisma migrate deploy --schema=config/database/schema.prisma

echo "✔ Schema migration completed successfully."
