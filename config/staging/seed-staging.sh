#!/bin/sh
set -e

echo "===================================================="
echo "  ARTHAX STAGING: ONE-TIME INITIAL SEED SCRIPT     "
echo "===================================================="

echo "▶ Seeding canonical banks, system accounts, and sovereign rules..."
npx ts-node --transpile-only -P tsconfig.json config/database/seeds/seed.ts

echo "✔ One-time staging seeding completed successfully."
