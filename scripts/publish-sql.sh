#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SQL_INPUT=${SQL_INPUT:-${SQL_FILE:-server/database/sql}}
DRY_RUN=0

cd "$ROOT_DIR"

show_usage() {
  cat <<'USAGE'
Usage: sh scripts/publish-sql.sh [options] [sql-file-or-directory]

Publish ordered SQL schema files with psql.

Options:
  --dry-run       Run the SQL inside a transaction and roll it back.
  --sql-file PATH Publish a different SQL file or directory. Defaults to server/database/sql.
  -h, --help      Show this help message.

Environment:
  DATABASE_URL    PostgreSQL connection string. Can be exported or defined in .env.
  SQL_INPUT       Default SQL file or directory path when --sql-file is not provided.
  SQL_FILE        Backward-compatible alias for SQL_INPUT.
USAGE
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --sql-file)
      if [ "$#" -lt 2 ]; then
        echo "Missing value for --sql-file" >&2
        exit 1
      fi
      SQL_INPUT=$2
      shift 2
      ;;
    -h|--help)
      show_usage
      exit 0
      ;;
    --*)
      echo "Unknown option: $1" >&2
      show_usage >&2
      exit 1
      ;;
    *)
      SQL_INPUT=$1
      shift
      ;;
  esac
done

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required to publish SQL." >&2
  exit 1
fi

if [ -z "${DATABASE_URL:-}" ] && [ -f .env ]; then
  DATABASE_URL=$(
    sed -n '/^[[:space:]]*DATABASE_URL[[:space:]]*=/ {
      s/^[^=]*=[[:space:]]*//
      s/^["'\'']//
      s/["'\'']$//
      p
      q
    }' .env
  )
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required. Add it to .env or export it before running this script." >&2
  exit 1
fi

if [ ! -e "$SQL_INPUT" ]; then
  echo "SQL input not found: $SQL_INPUT" >&2
  exit 1
fi

SQL_FILES=$(mktemp)
SQL_SCRIPT=$(mktemp)
trap 'rm -f "$SQL_FILES" "$SQL_SCRIPT"' EXIT HUP INT TERM

if [ -f "$SQL_INPUT" ]; then
  case "$SQL_INPUT" in
    *.sql) printf '%s\n' "$SQL_INPUT" > "$SQL_FILES" ;;
    *)
      echo "SQL input must be a .sql file or directory: $SQL_INPUT" >&2
      exit 1
      ;;
  esac
elif [ -d "$SQL_INPUT" ]; then
  find "$SQL_INPUT" -type f -name '*.sql' | sort > "$SQL_FILES"
else
  echo "SQL input must be a .sql file or directory: $SQL_INPUT" >&2
  exit 1
fi

FILE_COUNT=$(wc -l < "$SQL_FILES" | tr -d ' ')

if [ "$FILE_COUNT" -eq 0 ]; then
  echo "No SQL files found in $SQL_INPUT" >&2
  exit 1
fi

echo "SQL input: $SQL_INPUT"
echo "SQL files: $FILE_COUNT"

if [ "$DRY_RUN" -eq 1 ]; then
  echo "Validating SQL in a rollback transaction..."
else
  echo "Publishing SQL..."
fi

echo "BEGIN;" > "$SQL_SCRIPT"
while IFS= read -r sql_file; do
  {
    echo
    echo "-- $sql_file"
    cat "$sql_file"
    echo
  } >> "$SQL_SCRIPT"
done < "$SQL_FILES"

if [ "$DRY_RUN" -eq 1 ]; then
  echo "ROLLBACK;" >> "$SQL_SCRIPT"
else
  echo "COMMIT;" >> "$SQL_SCRIPT"
fi

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SQL_SCRIPT"

if [ "$DRY_RUN" -eq 1 ]; then
  echo "Dry run complete. No SQL was published."
else
  echo "SQL publish complete."
fi
