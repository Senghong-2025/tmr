import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import type { TInputMode, TInputType } from "~/models/form";
import type { ICreateTransaction, ITransaction, ITransactionGroupDisplay } from "~/models/transaction";
import { notify } from "~/composables/useNotification";
import { is, tr } from "date-fns/locale";

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

  const transactionGroups = useState<ITransactionGroupDisplay[]>(
    'transactionGroups',
    () => []
  );

  const transactionLoad = useState<boolean>('transactionLoad', () => false);

  const getTranscation = async () => {
    if(transactionLoad.value) return;
    transactionLoad.value = true;
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('User ID not found in localStorage');
        return;
      }

      const q = query(
        collection($db, 'transactions'),
        where('userId', '==', userId)
      );

      const response = await getDocs(q);

      const txs = response.docs
        .map((doc) => {
          const data = doc.data() as Omit<ITransaction, "id">;
          return {
            id: doc.id,
            ...data,
          };
        })
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      // Group transactions by date (YYYY-MM-DD)
      const grouped: Record<string, ITransaction[]> = {};

      txs.forEach((tx) => {
        const dateKey = tx.date.split('T')[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(tx);
      });

      // Transform to array with total amounts
      transactionGroups.value = Object.entries(grouped).map(
        ([date, transactions]) => ({
          date,
          transactions,
          totalAmount: transactions.reduce(
            (sum, tx) =>
              sum +
              (tx.currency === 'USD'
                ? Number(tx.amount)
                : Number(tx.amount) / 4000),
            0
          ),
          totalAmountKhr: transactions.reduce(
            (sum, tx) =>
              sum +
              (tx.currency === 'KHR'
                ? Number(tx.amount)
                : Number(tx.amount) * 4000),
            0
          ),
        })
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      transactionLoad.value = false;
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

  let total = ref<number>(0);
  const getTotalTransactionByMonth = async (month?: string) => {
    isLoading.value = true;
    const userId = localStorage.getItem('userId');
    if (!userId) return 0;

    const now = new Date();
    const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const q = query(
      collection($db, 'transactions'),
      where('userId', '==', userId)
    );

    const response = await getDocs(q);

    total.value = response.docs
      .map((doc) => doc.data() as ITransaction)
      .filter((tx) => tx.date.startsWith(targetMonth))
      .reduce((sum, tx) => {
      if (tx.currency.toUpperCase() === "USD") {
        return sum + Number(tx.amount);
      } else if (tx.currency.toUpperCase() === "KHR") {
        return sum + Number(tx.amount) / 4000;
      }
      return sum;
      }, 0);
      isLoading.value = false;
  }

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
    transactionGroups,
    transactionLoad,
    getTotalTransactionByMonth,
    total,
  };
}
