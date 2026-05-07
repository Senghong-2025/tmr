import { listCurrencies } from "~/server/repositories/currencyRepository";

export async function getCurrencies(userId: string) {
  return listCurrencies(userId);
}
