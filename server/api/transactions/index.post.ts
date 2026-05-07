import { createTransaction } from "~/server/services/transactionService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event);
  const body = await readBody(event);

  return createTransaction(userId, body);
});
