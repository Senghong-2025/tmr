import type { TInputMode, TInputType } from "~/models/form";
import {
  Transaction,
  type ICreateTransaction,
  type ITransaction,
  type ITransactionGroupDisplay,
} from "~/models/transaction";
import { notify } from "~/composables/useNotification";

interface IFormField {
  label: string;
  model: keyof ICreateTransaction;
  placeholder?: string;
  type?: TInputType;
  mode?: TInputMode;
}

export default function useTransaction() {
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
      type: "text",
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

  const buildPayload = () => ({
    title: model.title,
    category: model.category,
    amount: model.amount,
    currency: model.currency,
    date: model.date,
    note: model.note,
    type: model.type,
  });

  const addTranscation = async () => {
    setLoading("add", true);

    try {
      validateRequiredFields(model, requiredFields);
      const response = await $fetch<ITransaction>("/api/transactions", {
        method: "POST",
        headers: getAuthHeaders(),
        body: buildPayload(),
      });

      if (response?.id) {
        notify("Transaction added successfully.", "success");
        navigateTo("/transaction");
      }
    } catch (error) {
      console.error("Error", error);
      notify(
        error instanceof Error
          ? getApiErrorMessage(error, error.message)
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

  const getTransactionById = async (id: string) => {
    try {
      return await $fetch<ITransaction>(`/api/transactions/${id}`, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.error("Get error with: ", error);
    }
  };

  const updateTransaction = async (id: string) => {
    setLoading("update", true);

    try {
      validateRequiredFields(model, requiredFields);
      await $fetch(`/api/transactions/${id}`, {
        method: "PUT" as any,
        headers: getAuthHeaders(),
        body: buildPayload(),
      });

      notify("Transaction updated successfully.", "success");
      navigateTo("/transaction");
    } catch (error) {
      console.error("Error updating transaction:", error);
      notify(
        error instanceof Error
          ? getApiErrorMessage(error, error.message)
          : "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading("update", false);
    }
  };

  const transactionGroups = useState<ITransactionGroupDisplay[]>(
    "transactionGroups",
    () => []
  );

  const searchModel = reactive({
    title: "",
    category: "",
    amount: "",
    date: "",
  });
  const filteredTransactionGroups = ref<typeof transactionGroups.value>([]);

  const buildTransactionGroups = (items: Transaction[]) => {
    const grouped: Record<string, Transaction[]> = {};

    items.forEach((tx) => {
      const dateKey = tx.date.split("T")[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(tx);
    });

    return Object.entries(grouped).map(([date, transactions]) => ({
      date,
      transactions,
      totalAmount: transactions.reduce((sum, tx) => {
        const amount =
          tx.currency === "USD" ? Number(tx.amount) : Number(tx.amount) / 4000;
        return tx.type === "Outcome" ? sum - amount : sum + amount;
      }, 0),
      totalAmountKhr: transactions.reduce((sum, tx) => {
        const amount =
          tx.currency === "KHR" ? Number(tx.amount) : Number(tx.amount) * 4000;
        return tx.type === "Outcome" ? sum - amount : sum + amount;
      }, 0),
    }));
  };

  const applyTransactionFilters = () => {
    const normalizedCategory = searchModel.category?.trim().toLowerCase();
    const filteredTransactions = normalizedCategory
      ? transactions.value.filter(
          (tx) => tx.category.trim().toLowerCase() === normalizedCategory
        )
      : transactions.value;

    filteredTransactionGroups.value = buildTransactionGroups(filteredTransactions);
  };

  const transactionRef = ref<HTMLElement | null>(null);
  const handleScroll = async () => {
    if (!transactionRef.value || isLoading("get") || isFinnal.value) return;
    const { scrollTop, scrollHeight, clientHeight } = transactionRef.value;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isAtBottom) {
      await getTransaction();
    }
  };

  const nextOffset = ref<number | null>(0);
  const allTransactions = ref<ITransaction[]>([]);
  const isFinnal = ref(false);

  const fetchTransactions = async () => {
    if (nextOffset.value === null) {
      isFinnal.value = true;
      return;
    }

    const response = await $fetch<{
      items: ITransaction[];
      nextOffset: number | null;
    }>("/api/transactions", {
      headers: getAuthHeaders(),
      query: {
        limit: 25,
        offset: nextOffset.value,
      },
    });

    nextOffset.value = response.nextOffset;

    const existingIds = new Set(allTransactions.value.map((transaction) => transaction.id));
    const uniqueNew = response.items.filter((transaction) => !existingIds.has(transaction.id));

    allTransactions.value.push(...uniqueNew);

    if (response.nextOffset === null) {
      isFinnal.value = true;
    }
  };

  const getTransaction = async () => {
    if (isFinnal.value || isLoading("get")) return;

    setLoading("get", true);

    try {
      await fetchTransactions();

      transactions.value = allTransactions.value.map((item) => new Transaction(item));
      transactionGroups.value = buildTransactionGroups(transactions.value);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading("get", false);
      applyTransactionFilters();
    }
  };

  const deleteTransaction = async (id: string) => {
    setLoading("delete", true);

    try {
      await $fetch(`/api/transactions/${id}`, {
        method: "DELETE" as any,
        headers: getAuthHeaders(),
      });
      notify("Transaction deleted successfully.", "success");

      allTransactions.value = allTransactions.value.filter(
        (transaction) => transaction.id !== id
      );
      transactions.value = allTransactions.value.map((item) => new Transaction(item));
      transactionGroups.value = buildTransactionGroups(transactions.value);
      applyTransactionFilters();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      notify(
        error instanceof Error
          ? getApiErrorMessage(error, error.message)
          : "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading("delete", false);
      navigateTo("/transaction");
    }
  };

  const total = ref<number>(0);
  const getTotalTransactionByMonth = async (month?: string) => {
    setLoading("get", true);

    try {
      const response = await $fetch<{ total: number }>(
        "/api/transactions/monthly-total",
        {
          headers: getAuthHeaders(),
          query: month ? { month } : undefined,
        }
      );

      total.value = response.total;
    } catch (error) {
      console.error("Error fetching monthly total:", error);
      total.value = 0;
    } finally {
      setLoading("get", false);
    }
  };

  const onSearch = () => {
    applyTransactionFilters();
  };

  const isShowClearBtn = computed(() => Boolean(searchModel.category?.trim()));
  const onClear = () => {
    searchModel.category = "";
    onSearch();
  };

  return {
    formFields,
    model,
    addTranscation,
    transactions,
    getTransaction,
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
    allTransactions,
    getTransactionById,
  };
}
