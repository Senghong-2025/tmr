import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { TInputType } from "~/models/form";
import type { ICreateTransaction, ITransaction } from "~/models/transaction";

interface IFormField {
  label: string;
  model: keyof ICreateTransaction;
  placeholder?: string;
  type?: TInputType;
}

export default function useTransaction() {
  const { $db } = useNuxtApp();
  const isLoading = ref<boolean>(false);
  const transactions = ref<ITransaction[]>([]);

  const model = reactive<ICreateTransaction>({
    userId: "",
    category: "",
    amount: "",
    currency: "",
    date: "",
    note: "",
    createdOn: "",
    title: "",
    type: "Outcome",
  });

  const formFields: IFormField[] = [
    { label: "Title", model: "title", placeholder: "Transaction Title" },
    {
      label: "Category",
      model: "category",
      placeholder: "Category Name",
    },
    {
      label: "Amount",
      model: "amount",
      placeholder: "Enter amount",
      type: "number",
    },
    { label: "Currency", model: "currency", placeholder: "Currency ID" },
    { label: "Type", model: "type", placeholder: "Income / Outcome" },
    { label: "Date", model: "date", type: "date" },
    { label: "Note", model: "note", placeholder: "Optional note" },
  ];

  const addTranscation = async () => {
    const userId = localStorage.getItem("userId");

    try {
      console.log("user", userId);
      if (userId) {
        model.userId = userId;
        model.createdOn = new Date().toISOString();
        await addDoc(collection($db, "transactions"), {
          ...toRaw(model),
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const getTranscation = async () => {
    isLoading.value = true;
    try {
      const userId = localStorage.getItem("userId");
      const q = query(
        collection($db, "transactions"),
        where("userId", "==", userId)
      );
      const response = await getDocs(q);
      transactions.value = response.docs.map((doc) => {
        const { id, ...data } = doc.data() as ITransaction;
        return {
          id: doc.id,
          ...data,
        };
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    formFields,
    model,
    addTranscation,
    transactions,
    getTranscation,
    isLoading,
  };
}
