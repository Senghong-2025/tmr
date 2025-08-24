import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import type { TInputMode, TInputType } from "~/models/form";
import { Transaction, type ICreateTransaction, type ITransaction, type ITransactionGroupDisplay } from "~/models/transaction";
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
  const transactions = ref<Transaction[]>([]);
  const { categories, getCategory } = useCategory();
  const { isLoading, setLoading } = useLoading();

  const model = reactive<ICreateTransaction>({
    userId: "",
    category: "",
    amount: "",
    currency: "",
    date: "",
    note: "",
    createdOn: "",
    modifiedOn: "",
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
    setLoading("add", true);
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
      setLoading("add", false);
    }
  };

  function goToTransaction(id: string) {
    navigateTo(`/transaction/${id}`);
  }

  const updateTransaction = async (id: string) => {
    setLoading("update", true);
    try {
      validateRequiredFields(model, requiredFields);
      const userId = localStorage.getItem("userId");
      if (userId) {
        model.userId = userId;
        model.modifiedOn = new Date().toISOString();
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
      setLoading("update", false);
    }
  };

  const transactionGroups = useState<ITransactionGroupDisplay[]>(
    'transactionGroups',
    () => []
  );

  const searchModel = reactive<Partial<ICreateTransaction>>({
    title: "",
    category: "",
    amount: "",
    date: "",
  });
  const filteredTransactionGroups = ref<typeof transactionGroups.value>([]);

  const transactionRef = ref<HTMLElement | null>(null);
  const pastDays = ref(25);
  const handleScroll = async () => {
    if (!transactionRef.value) return;
    const { scrollTop, scrollHeight, clientHeight } = transactionRef.value;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 0; // tolerance
    if (isAtBottom) {
      await getTranscation();
    }
  };

  const lastVisible = ref();
  const allTransactions = ref<any[]>([]);
  const isFinnal = ref(false);
  const fetchTransactions = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("User ID not found in localStorage");
      return;
    }
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - pastDays.value);

    let q;
    if (lastVisible.value) {
      q = query(
        collection($db, "transactions"),
        where("userId", "==", userId),
        where("date", ">=", twoWeeksAgo.toISOString()),
        orderBy("date", "desc"),
        startAfter(lastVisible.value),
        limit(25)
      );
    } else {
      q = query(
        collection($db, "transactions"),
        where("userId", "==", userId),
        where("date", ">=", twoWeeksAgo.toISOString()),
        orderBy("date", "desc"),
        limit(25)
      );
    }
    const response = await getDocs(q);
    lastVisible.value = response.docs[response.docs.length - 1];
    const newTransactions = response.docs;
    allTransactions.value.push(...newTransactions);
    if (newTransactions.length < 25) {
      isFinnal.value = true;
    }
  };
  const getTranscation = async () => {
    if (isFinnal.value) return;
    setLoading("get", true);
    try {
      await fetchTransactions();
      const result = allTransactions.value
        .map((doc) => {
          const data = doc.data() as Omit<ITransaction, "id">;
          return {
            id: doc.id,
            ...data,
          };
        });
      transactions.value = result.map((item) => new Transaction(item));
      const grouped: Record<string, Transaction[]> = {};

      transactions.value.forEach((tx) => {
        const dateKey = tx.date.split('T')[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(tx);
      });

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
      setLoading("get", false)
      filteredTransactionGroups.value = transactionGroups.value;
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading("delete", true);
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
      setLoading("delete", false);
      navigateTo("/transaction");
    }
  };

  let total = ref<number>(0);
  const getTotalTransactionByMonth = async (month?: string) => {
    setLoading("get", true);
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
    setLoading("get", false);
  }

  const onSearch = () => {
    // filteredTransactionGroups.value = transactionGroups.value;
  };

  const isShowClearBtn = computed(() => false);
  const onClear = () => {
    // searchModel.value = "";
    onSearch();
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
    transactionGroups,
    getTotalTransactionByMonth,
    total,
    searchModel,
    onSearch,
    filteredTransactionGroups,
    onClear,
    isShowClearBtn,
    handleScroll,
    transactionRef,
    isFinnal,
  };
}
