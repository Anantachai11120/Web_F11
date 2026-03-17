#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ $# -lt 1 ]]; then
  echo "Usage: bash ./scripts/restore-db.sh <backup.sql|backup.sql.gz>" >&2
  exit 1
fi

ENV_FILE="${ENV_FILE:-.env}"
SERVICE_NAME="${SERVICE_NAME:-mysql}"
INPUT_FILE="$1"
UPLOADS_ARCHIVE="${2:-}"
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

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Backup file not found: $INPUT_FILE" >&2
  exit 1
fi

if [[ -z "$UPLOADS_ARCHIVE" ]]; then
  base_name="$(basename "$INPUT_FILE")"
  stamp="$(printf '%s' "$base_name" | sed -E 's/^mysql_[^_]+_([0-9]{8}_[0-9]{6})\.sql(\.gz)?$/\1/')"
  guessed_archive="$(dirname "$INPUT_FILE")/uploads_${stamp}.tar.gz"
  if [[ -f "$guessed_archive" ]]; then
    UPLOADS_ARCHIVE="$guessed_archive"
  fi
fi

echo "Restoring database ${db_name} from $INPUT_FILE"
if [[ "$INPUT_FILE" == *.gz ]]; then
  gunzip -c "$INPUT_FILE" | "${DOCKER_COMPOSE[@]}" exec -T "$SERVICE_NAME" sh -lc "mysql -u${db_user} -p${db_pass} ${db_name}"
else
  cat "$INPUT_FILE" | "${DOCKER_COMPOSE[@]}" exec -T "$SERVICE_NAME" sh -lc "mysql -u${db_user} -p${db_pass} ${db_name}"
fi
if [[ -n "$UPLOADS_ARCHIVE" && -f "$UPLOADS_ARCHIVE" ]]; then
  echo "Restoring uploads from $UPLOADS_ARCHIVE"
  mkdir -p "$(dirname "$UPLOADS_DIR")"
  rm -rf "$UPLOADS_DIR"
  tar -xzf "$UPLOADS_ARCHIVE" -C "$(dirname "$UPLOADS_DIR")"
fi
echo "Restore complete."
