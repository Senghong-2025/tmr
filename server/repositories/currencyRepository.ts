import { query } from "~/server/database/pool";

export interface CurrencyRecord {
  id?: string;
  symbol: string;
  code: string;
}

interface CurrencyRow {
  id: string;
  symbol: string;
  code: string;
}

const defaultCurrencies: CurrencyRecord[] = [
  { symbol: "៛", code: "KHR" },
  { symbol: "$", code: "USD" },
];

export async function listCurrencies(userId: string) {
  const result = await query<CurrencyRow>(
    `
      SELECT id, symbol, code
      FROM currencies
      WHERE user_id = $1
      ORDER BY code ASC
    `,
    [userId]
  );

  if (result.rows.length === 0) {
    return defaultCurrencies;
  }

  return result.rows.map((row) => ({
    id: row.id,
    symbol: row.symbol,
    code: row.code,
  }));
}
