import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import type { TInputMode, TInputType } from "~/models/form";
import type { ICreateTransaction, ITransaction, ITransactionGroupDisplay } from "~/models/transaction";
import { notify } from "~/composables/useNotification";

interface IFormField {
  label: string;
  model: keyof ICreateTransaction;
  placeholder?: string;
  type?: TInputType;
  mode?: TInputMode;
}

export default function useTransaction() {
  const { $db } = useNuxtApp();
  const isLoading = ref<boolean>(false);
  const transactions = ref<ITransaction[]>([]);
  const { categories, getCategory } = useCategory();

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
      mode: "decimal",
    },
    { label: "Currency", model: "currency", placeholder: "Currency ID" },
    { label: "Type", model: "type", placeholder: "Income / Outcome" },
    { label: "Date", model: "date", type: "datetime-local" },
    { label: "Note", model: "note", placeholder: "Optional note" },
  ];

  const requiredFields: (keyof ICreateTransaction)[] = [
    "title",
    "category",
    "amount",
    "currency",
    "type",
    "date",
  ];

  const addTranscation = async () => {
    const userId = localStorage.getItem("userId");
    isLoading.value = true;
    try {
      validateRequiredFields(model, requiredFields);
      if (userId) {
        model.userId = userId;
        model.createdOn = new Date().toISOString();
        const response = await addDoc(collection($db, "transactions"), {
          ...toRaw(model),
        });
        if (response && response.id) {
          notify("Transaction added successfully.", "success");
          navigateTo("/transaction");
        }
      }
    } catch (error) {
      console.error("Error", error);
      notify(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
        "error"
      );
    } finally {
      isLoading.value = false;
    }
  };

  function goToTransaction(id: string) {
    navigateTo(`/transaction/${id}`);
  }

  const updateTransaction = async (id: string) => {
    isLoading.value = true;
    try {
      validateRequiredFields(model, requiredFields);
      const userId = localStorage.getItem("userId");
      if (userId) {
        model.userId = userId;
        model.createdOn = new Date().toISOString();
        const transactionRef = doc($db, "transactions", id);
        await updateDoc(transactionRef, {
          ...toRaw(model),
        });
        notify("Transaction updated successfully.", "success");
        navigateTo("/transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      notify(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
        "error"
      );
    } finally {
      isLoading.value = false;
    }
  };

  const transactionGroups = ref<ITransactionGroupDisplay[]>([]);
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
      // Order by date descending
      const txs = response.docs
        .map((doc) => {
          const { id, ...data } = doc.data() as ITransaction;
          return {
            id: doc.id,
            ...data,
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Group by date (YYYY-MM-DD)
      const grouped: Record<string, ITransaction[]> = {};
      txs.forEach((tx) => {
        const dateKey = tx.date.split("T")[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(tx);
      });

      // Convert to array of blocks: [{ date: string, transactions: ITransaction[], totalAmount: number }]
      transactionGroups.value = Object.entries(grouped).map(([date, txs]) => ({
        date,
        transactions: txs,
        totalAmount: txs.reduce((sum, tx) => sum + Number(tx.amount), 0),
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteTransaction = async (id: string) => {
    isLoading.value = true;
    try {
      const transactionRef = doc($db, "transactions", id);
      await deleteDoc(transactionRef);
      notify("Transaction deleted successfully.", "success");
      await getTranscation();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      notify(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
        "error"
      );
    } finally {
      isLoading.value = false;
      navigateTo("/transaction");
    }
  };

  return {
    formFields,
    model,
    addTranscation,
    transactions,
    getTranscation,
    isLoading,
    categories,
    getCategory,
    updateTransaction,
    goToTransaction,
    deleteTransaction,
    transactionGroups
  };
}
