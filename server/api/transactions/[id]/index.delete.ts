import { deleteTransaction } from "~/server/services/transactionService";
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

  await deleteTransaction(id, userId);

  return { ok: true };
});
