#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SQL_INPUT=${SQL_INPUT:-${SQL_FILE:-server/database/sql}}

cd "$ROOT_DIR"

show_usage() {
  cat <<'USAGE'
Usage: sh scripts/build-and-publish-sql.sh [options]

Build the Nuxt app, then publish the SQL schema files.

Options:
  --dry-run       Validate the SQL publisher without changing the database.
  --skip-build    Publish SQL without running the app build.
  --sql-file PATH Publish a different SQL file or directory. Defaults to server/database/sql.
  -h, --help      Show this help message.

Environment:
  DATABASE_URL    PostgreSQL connection string. Can be exported or defined in .env.
  SQL_INPUT       Default SQL file or directory path when --sql-file is not provided.
  SQL_FILE        Backward-compatible alias for SQL_INPUT.
USAGE
}

DRY_RUN=0
SKIP_BUILD=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --skip-build)
      SKIP_BUILD=1
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
    *)
      echo "Unknown option: $1" >&2
      show_usage >&2
      exit 1
      ;;
  esac
done

if [ "$SKIP_BUILD" -eq 0 ]; then
  echo "Building app..."
  npm run build
fi

if [ "$DRY_RUN" -eq 1 ]; then
  echo "Validating SQL publish..."
  npm run db:publish:dry -- "$SQL_INPUT"
else
  echo "Publishing SQL..."
  npm run db:publish -- "$SQL_INPUT"
fi
