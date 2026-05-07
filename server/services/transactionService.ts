import * as transactionRepository from "~/server/repositories/transactionRepository";

const defaultPageSize = 25;
const maxPageSize = 100;

function validateTransaction(payload: {
  title?: string;
  category?: string;
  amount?: string | number;
  currency?: string;
  type?: string;
  date?: string;
  note?: string;
}) {
  const title = payload.title?.trim() || "";
  const category = payload.category?.trim() || "";
  const amount = String(payload.amount ?? "").trim();
  const currency = payload.currency?.trim() || "";
  const type = payload.type?.trim() || "";
  const date = payload.date?.trim() || "";
  const note = payload.note?.trim() || "";

  if (!title || !category || !amount || !currency || !type || !date) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title, category, amount, currency, type, and date are required.",
    });
  }

  if (!["Income", "Outcome"].includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Transaction type must be Income or Outcome.",
    });
  }

  if (!Number.isFinite(Number(amount))) {
    throw createError({
      statusCode: 400,
      statusMessage: "Amount must be a valid number.",
    });
  }

  return {
    title,
    category,
    amount,
    currency,
    type,
    date,
    note,
  };
}

export async function createTransaction(userId: string, payload: any) {
  return transactionRepository.createTransaction({
    userId,
    ...validateTransaction(payload),
  });
}

export async function getTransactionById(id: string, userId: string) {
  const transaction = await transactionRepository.getTransactionById(id, userId);

  if (!transaction) {
    throw createError({
      statusCode: 404,
      statusMessage: "Transaction not found.",
    });
  }

  return transaction;
}

export async function listTransactions(userId: string, query: Record<string, any>) {
  const requestedLimit = Number(query.limit ?? defaultPageSize);
  const requestedOffset = Number(query.offset ?? 0);
  const limit = Math.min(
    Math.max(Number.isFinite(requestedLimit) ? requestedLimit : defaultPageSize, 1),
    maxPageSize
  );
  const offset = Math.max(Number.isFinite(requestedOffset) ? requestedOffset : 0, 0);
  const items = await transactionRepository.listTransactions({ userId, limit, offset });

  return {
    items,
    nextOffset: items.length === limit ? offset + limit : null,
  };
}

export async function updateTransaction(id: string, userId: string, payload: any) {
  const transaction = await transactionRepository.updateTransaction(
    id,
    userId,
    validateTransaction(payload)
  );

  if (!transaction) {
    throw createError({
      statusCode: 404,
      statusMessage: "Transaction not found.",
    });
  }

  return transaction;
}

export async function deleteTransaction(id: string, userId: string) {
  const deleted = await transactionRepository.deleteTransaction(id, userId);

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: "Transaction not found.",
    });
  }
}

export async function getMonthlyTotal(userId: string, month?: string) {
  const now = new Date();
  const targetMonth =
    month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  if (!/^\d{4}-\d{2}$/.test(targetMonth)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Month must use YYYY-MM format.",
    });
  }

  return transactionRepository.getMonthlyTransactionTotal(userId, targetMonth);
}
