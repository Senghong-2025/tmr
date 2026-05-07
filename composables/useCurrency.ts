import type { ICurrency } from "~/models/currency";

export default function useCurrency() {
  const currencies = ref<ICurrency[]>([]);
  const isLoading = ref(false);

  const getCurrency = async () => {
    isLoading.value = true;

    try {
      currencies.value = await $fetch<ICurrency[]>("/api/currencies", {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error("Error fetching currencies:", error);
      currencies.value = [
        {
          symbol: "$",
          code: "USD",
        },
      ];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    getCurrency,
    currencies,
    isLoading,
  };
}
