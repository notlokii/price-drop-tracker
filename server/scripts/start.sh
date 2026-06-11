#!/bin/sh

echo "========================================"
echo "[start] PriceDrop API starting..."
echo "[start] PORT=${PORT:-5001}"
if [ -n "$DATABASE_URL" ]; then echo "[start] DATABASE_URL=set"; else echo "[start] DATABASE_URL=MISSING"; fi
if [ -n "$DIRECT_URL" ]; then echo "[start] DIRECT_URL=set"; else echo "[start] DIRECT_URL=MISSING"; fi
if [ -n "$JWT_SECRET" ]; then echo "[start] JWT_SECRET=set"; else echo "[start] JWT_SECRET=MISSING"; fi
echo "========================================"

if [ -z "$DATABASE_URL" ]; then
  echo "[start] FATAL: DATABASE_URL is not set — add it in Railway → Variables"
  exit 1
fi

# Run migrations in background so /test responds before health check times out
(
  echo "[start] Running database migrations (background)..."
  if npx prisma migrate deploy; then
    echo "[start] Migrations complete"
  else
    echo "[start] WARNING: migrations failed — check DIRECT_URL and Supabase access"
  fi
) &

echo "[start] Starting API server on 0.0.0.0:${PORT:-5001}..."
exec node src/index.js
