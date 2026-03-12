#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="${1:-main}"

echo "Step 1/5: Backup database"
bash ./scripts/backup-db.sh

echo "Step 2/5: Pull latest code"
git pull origin "$BRANCH"

echo "Step 3/5: Stop containers (keep DB volume)"
docker compose down --remove-orphans

echo "Step 4/5: Start updated stack"
docker compose up -d --build

echo "Step 5/5: Health check"
sleep 3
docker compose ps
curl -fsS http://localhost:3000/health || true
echo
