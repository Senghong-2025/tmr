import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type { ICreateTransaction, ITransaction } from "~/models/transaction";

interface IFormField {
  label: string;
  model: keyof ICreateTransaction;
  placeholder?: string;
  type?: string;
}

export default function useTransaction() {
  const { $db } = useNuxtApp();
  const isLoading = ref<boolean>(false);
  const transactions = ref<ITransaction[]>([]);

  const model = reactive<ICreateTransaction>({
    userId: "",
    categoryId: "",
    amount: "",
    currecyId: "",
    date: "",
    note: "",
    createdOn: "",
  });

  const formFields: IFormField[] = [
    {
      label: "Category Id",
      model: "categoryId",
      placeholder: "Category Name",
    },
    {
      label: "Amount",
      model: "amount",
      placeholder: "Enter amount",
      type: "number",
    },
    { label: "Currency", model: "currecyId", placeholder: "Currency ID" },
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

        console.log(model);
        await addDoc(collection($db, "transactions"), {
          ...toRaw(model),
        });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const getTranscation = async () => {
    const userId = localStorage.getItem("userId");

    const q = query(
      collection($db, "transactions"),
      where("userId", "==", userId)
    );
    const response = await getDocs(q);
    transactions.value = response.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ITransaction),
    }));
  };

  return {
    formFields,
    model,
    addTranscation,
    transactions,
    getTranscation,
  };
}
