import { query } from "~/server/database/pool";

export interface TransactionRecord {
  id: string;
  userId: string;
  title: string;
  category: string;
  amount: string;
  currency: string;
  type: string;
  date: string;
  note: string;
  createdOn: string;
  modifiedOn: string;
}

interface TransactionRow {
  id: string;
  user_id: string;
  title: string;
  category: string;
  amount: string;
  currency: string;
  type: string;
  date: string;
  note: string;
  created_on: Date;
  modified_on: Date | null;
}

function mapTransaction(row: TransactionRow): TransactionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    category: row.category,
    amount: row.amount,
    currency: row.currency,
    type: row.type,
    date: row.date,
    note: row.note,
    createdOn: row.created_on.toISOString(),
    modifiedOn: row.modified_on?.toISOString() ?? "",
  };
}

export async function createTransaction(payload: {
  userId: string;
  title: string;
  category: string;
  amount: string;
  currency: string;
  type: string;
  date: string;
  note: string;
}) {
  const result = await query<TransactionRow>(
    `
      INSERT INTO transactions (
        user_id,
        title,
        category,
        amount,
        currency,
        type,
        date,
        note
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        user_id,
        title,
        category,
        amount::text,
        currency,
        type,
        date,
        note,
        created_on,
        modified_on
    `,
    [
      payload.userId,
      payload.title,
      payload.category,
      payload.amount,
      payload.currency,
      payload.type,
      payload.date,
      payload.note,
    ]
  );

  return mapTransaction(result.rows[0]);
}

export async function getTransactionById(id: string, userId: string) {
  const result = await query<TransactionRow>(
    `
      SELECT
        id,
        user_id,
        title,
        category,
        amount::text,
        currency,
        type,
        date,
        note,
        created_on,
        modified_on
      FROM transactions
      WHERE id = $1
        AND user_id = $2
      LIMIT 1
    `,
    [id, userId]
  );

  return result.rows[0] ? mapTransaction(result.rows[0]) : null;
}

export async function listTransactions(payload: {
  userId: string;
  limit: number;
  offset: number;
}) {
  const result = await query<TransactionRow>(
    `
      SELECT
        id,
        user_id,
        title,
        category,
        amount::text,
        currency,
        type,
        date,
        note,
        created_on,
        modified_on
      FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC, created_on DESC, id DESC
      LIMIT $2 OFFSET $3
    `,
    [payload.userId, payload.limit, payload.offset]
  );

  return result.rows.map(mapTransaction);
}

export async function updateTransaction(
  id: string,
  userId: string,
  payload: {
    title: string;
    category: string;
    amount: string;
    currency: string;
    type: string;
    date: string;
    note: string;
  }
) {
  const result = await query<TransactionRow>(
    `
      UPDATE transactions
      SET title = $3,
          category = $4,
          amount = $5,
          currency = $6,
          type = $7,
          date = $8,
          note = $9,
          modified_on = now()
      WHERE id = $1
        AND user_id = $2
      RETURNING
        id,
        user_id,
        title,
        category,
        amount::text,
        currency,
        type,
        date,
        note,
        created_on,
        modified_on
    `,
    [
      id,
      userId,
      payload.title,
      payload.category,
      payload.amount,
      payload.currency,
      payload.type,
      payload.date,
      payload.note,
    ]
  );

  return result.rows[0] ? mapTransaction(result.rows[0]) : null;
}

export async function deleteTransaction(id: string, userId: string) {
  const result = await query<{ id: string }>(
    `
      DELETE FROM transactions
      WHERE id = $1
        AND user_id = $2
      RETURNING id
    `,
    [id, userId]
  );

  return Boolean(result.rowCount);
}

export async function getMonthlyTransactionTotal(userId: string, month: string) {
  const result = await query<{ total: string | null }>(
    `
      SELECT COALESCE(
        SUM(
          CASE
            WHEN upper(currency) = 'USD' THEN amount
            WHEN upper(currency) = 'KHR' THEN amount / 4000
            ELSE 0
          END
        ),
        0
      )::text AS total
      FROM transactions
      WHERE user_id = $1
        AND date LIKE $2
    `,
    [userId, `${month}%`]
  );

  return Number(result.rows[0]?.total ?? 0);
}
