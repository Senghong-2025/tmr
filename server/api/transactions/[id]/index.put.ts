import { updateTransaction } from "~/server/services/transactionService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Transaction id is required.",
    });
  }

  const body = await readBody(event);

  return updateTransaction(id, userId, body);
});
