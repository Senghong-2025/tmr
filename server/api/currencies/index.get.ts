import { getCurrencies } from "~/server/services/currencyService";
import { requireAuth } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const { userId } = await requireAuth(event);

  return getCurrencies(userId);
});
