import { collection, getDocs, query, where } from "firebase/firestore";
import type { ICurrency } from "~/models/currency";

export default function useCurrency() {
  const { $db } = useNuxtApp();
  const currencies = ref<ICurrency[]>([]);
  const getCurrency = async () => {
    const useId = localStorage.getItem("userId");
    const q = query(
      collection($db, "currencies"),
      where("userId", "==", useId)
    );
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty) {
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

    console.log(currencies.value);
  };

  return {
    getCurrency,
    currencies
  };
}
