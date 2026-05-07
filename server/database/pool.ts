import {
  neon,
  type FullQueryResults,
  type QueryResultRow,
} from "@neondatabase/serverless";
import type { Pool as PgPool, QueryResult } from "pg";

type QueryResultWithRows<T extends QueryResultRow> = {
  rows: T[];
  rowCount: number | null;
};

let neonSql: ReturnType<typeof neon<false, true>> | null = null;
let pgPool: PgPool | null = null;

function getRuntimeEnv(name: string) {
  const cloudflareEnv = (
    globalThis as typeof globalThis & {
      __env__?: Record<string, string | undefined>;
    }
  ).__env__;

  return cloudflareEnv?.[name] || process.env[name];
}

function getConnectionString() {
  const config = useRuntimeConfig();
  const connectionString = config.databaseUrl || getRuntimeEnv("DATABASE_URL");

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for PostgreSQL access.");
  }

  return connectionString;
}

function shouldUseNeonHttp(connectionString: string) {
  const config = useRuntimeConfig();
  const driver = config.databaseDriver || getRuntimeEnv("DATABASE_DRIVER");

  if (driver === "neon") return true;
  if (driver === "pg") return false;

  try {
    return new URL(connectionString).hostname.endsWith("neon.tech");
  } catch {
    return false;
  }
}

function getNeonSql(connectionString: string) {
  if (neonSql) return neonSql;

  neonSql = neon<false, true>(connectionString, {
    fullResults: true,
  });

  return neonSql;
}

async function getPgPool(connectionString: string) {
  if (pgPool) return pgPool;

  const { Pool } = await import("pg");

  pgPool = new Pool({
    connectionString,
  });

  return pgPool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResultWithRows<T>> {
  const connectionString = getConnectionString();

  if (shouldUseNeonHttp(connectionString)) {
    return getNeonSql(connectionString).query(text, params) as Promise<
      FullQueryResults<false> & { rows: T[] }
    >;
  }

  return (await getPgPool(connectionString)).query(text, params) as Promise<
    QueryResult<T>
  >;
}
