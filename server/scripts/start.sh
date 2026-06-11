#!/bin/sh
set -e

echo "[start] PORT=${PORT:-5001}"
echo "[start] Running database migrations..."

if [ -z "$DATABASE_URL" ]; then
  echo "[start] ERROR: DATABASE_URL is not set"
  exit 1
fi

if [ -z "$DIRECT_URL" ]; then
  echo "[start] WARNING: DIRECT_URL is not set — migrations may fail with Supabase"
fi

npx prisma migrate deploy
echo "[start] Migrations complete"

echo "[start] Starting API server..."
exec node src/index.js
