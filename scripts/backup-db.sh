#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ENV_FILE:-.env}"
BACKUP_DIR="${BACKUP_DIR:-backups}"
CONTAINER_NAME="${CONTAINER_NAME:-weblab-mysql}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed." >&2
  exit 1
fi

db_user="${DB_USER:-weblab}"
db_pass="${DB_PASS:-weblab_pass}"
db_name="${DB_NAME:-weblab_f11}"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC2046
  export $(grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$ENV_FILE" | xargs)
  db_user="${DB_USER:-$db_user}"
  db_pass="${DB_PASS:-$db_pass}"
  db_name="${DB_NAME:-$db_name}"
fi

mkdir -p "$BACKUP_DIR"
stamp="$(date +%Y%m%d_%H%M%S)"
out="$BACKUP_DIR/mysql_${db_name}_${stamp}.sql"

echo "Creating backup: $out"
docker exec "$CONTAINER_NAME" sh -lc "mysqldump -u${db_user} -p${db_pass} --single-transaction --quick ${db_name}" > "$out"
echo "Backup complete: $out"
