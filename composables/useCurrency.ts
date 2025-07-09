import { collection, getDocs, query, where } from "firebase/firestore";
import type { ICurrency } from "~/models/currency";

export default function useCurrency() {
  const { $db } = useNuxtApp();
  const currencies = ref<ICurrency[]>([]);
  const isLoading = ref(false);
  const getCurrency = async () => {
    isLoading.value = true;
    try {
      const useId = localStorage.getItem("userId");
      const q = query(
        collection($db, "currencies"),
        where("userId", "==", useId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        currencies.value = [{
          symbol: "$",
          code: "USD",
        }];
        return;
      }
      currencies.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as ICurrency),
      }));
    } catch (error) {
      currencies.value = [{
        symbol: "$",
        code: "USD",
      }];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    getCurrency,
    currencies,
    isLoading
  };
}
