#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

ENV_FILE="${ENV_FILE:-.env}"
BACKUP_DIR="${BACKUP_DIR:-backups}"
SERVICE_NAME="${SERVICE_NAME:-mysql}"
OUTPUT_GZIP="${OUTPUT_GZIP:-true}"
KEEP_DAYS="${KEEP_DAYS:-30}"
UPLOADS_DIR="${UPLOADS_DIR:-data/uploads}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed." >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  DOCKER_COMPOSE=(docker-compose)
else
  echo "Docker Compose is not installed." >&2
  exit 1
fi

read_env_value() {
  local key="$1"
  local file="$2"
  local line
  line="$(grep -E "^${key}=" "$file" | tail -n 1 || true)"
  if [[ -z "$line" ]]; then
    return 1
  fi
  printf '%s' "${line#*=}"
}

db_user="${DB_USER:-weblab}"
db_pass="${DB_PASS:-weblab_pass}"
db_name="${DB_NAME:-weblab_f11}"

if [[ -f "$ENV_FILE" ]]; then
  db_user="$(read_env_value DB_USER "$ENV_FILE" || printf '%s' "$db_user")"
  db_pass="$(read_env_value DB_PASS "$ENV_FILE" || printf '%s' "$db_pass")"
  db_name="$(read_env_value DB_NAME "$ENV_FILE" || printf '%s' "$db_name")"
fi

mkdir -p "$BACKUP_DIR"
stamp="$(date +%Y%m%d_%H%M%S)"
out="$BACKUP_DIR/mysql_${db_name}_${stamp}.sql"
uploads_out="$BACKUP_DIR/uploads_${stamp}.tar.gz"

echo "Creating backup: $out"
"${DOCKER_COMPOSE[@]}" exec -T "$SERVICE_NAME" sh -lc "mysqldump -u${db_user} -p${db_pass} --single-transaction --quick --no-tablespaces ${db_name}" > "$out"
if [[ "$OUTPUT_GZIP" == "true" ]]; then
  gzip -f "$out"
  out="${out}.gz"
fi
if [[ -d "$UPLOADS_DIR" ]]; then
  echo "Creating uploads backup: $uploads_out"
  tar -czf "$uploads_out" -C "$(dirname "$UPLOADS_DIR")" "$(basename "$UPLOADS_DIR")"
fi
find "$BACKUP_DIR" -type f -name "mysql_${db_name}_*.sql*" -mtime +"$KEEP_DAYS" -delete
find "$BACKUP_DIR" -type f -name "uploads_*.tar.gz" -mtime +"$KEEP_DAYS" -delete
echo "Backup complete: $out"
