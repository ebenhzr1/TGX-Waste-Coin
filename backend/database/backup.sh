#!/bin/bash
# TGX Waste Coin - Database Backup Script (Bash/Linux)
# Usage: ./database/backup.sh
# Requires: pg_dump

set -euo pipefail

DATABASE_URL="${DATABASE_URL:-}"
BACKUP_DIR="$(dirname "$0")/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/tgx_backup_${TIMESTAMP}.sql"

if [[ -z "$DATABASE_URL" || "$DATABASE_URL" == *"ISI_CONNECTION"* ]]; then
  echo "ERROR: DATABASE_URL not set."
  exit 1
fi

mkdir -p "$BACKUP_DIR"
echo "Starting backup -> $BACKUP_FILE"

pg_dump "$DATABASE_URL" --no-owner --no-acl --clean --if-exists -f "$BACKUP_FILE"

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "Backup SUCCESS: $BACKUP_FILE ($SIZE)"

# Keep last 30 backups
ls -t "$BACKUP_DIR"/tgx_backup_*.sql | tail -n +31 | xargs -r rm --
echo "Retention: kept last 30 backups."
