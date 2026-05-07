import { getMonthlyTotal } from "~/server/services/transactionService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event);
  const query = getQuery(event);
  const total = await getMonthlyTotal(
    userId,
    typeof query.month === "string" ? query.month : undefined
  );

  return { total };
});
