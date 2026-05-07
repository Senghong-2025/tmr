import { listTransactions } from "~/server/services/transactionService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event);

  return listTransactions(userId, getQuery(event));
});
