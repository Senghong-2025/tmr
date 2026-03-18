import datetimeHelper from "~/helpers/datetimeHelper";
import type { IBarChart, IPieChart } from "~/models/chart";

export default function useChart() {
    const { getTransaction, transactions, transactionGroups, isLoading } = useTransaction();
    const { getMonthAndDate } = datetimeHelper;
    const toLocalDateInputValue = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const parseLocalDateInput = (value: string) => new Date(`${value}T00:00:00`);
    const getToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };
    const getLatestStartDate = () => {
        const latest = getToday();
        latest.setDate(latest.getDate() - 6);
        return latest;
    };
    const latestStartDate = computed(() => toLocalDateInputValue(getLatestStartDate()));
    const startDate = ref<string>(latestStartDate.value);

    const chartBarProperties = ref<IBarChart>({
        label: [],
        data: [],
    });
    const chartPieProperties = ref<IPieChart>({
        label: [],
        data: [],
    });

    const getDateRange = () => {
        const start = parseLocalDateInput(startDate.value);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    };

    const selectedRangeLabel = computed(() => {
        const { start, end } = getDateRange();
        return `${getMonthAndDate(start)} - ${getMonthAndDate(end)}`;
    });

    const canShiftForward = computed(() => startDate.value < latestStartDate.value);

    const chartBarMapping = () => {
        const { start, end } = getDateRange();

        const grouped: Record<string, number> = {};

        transactionGroups.value.forEach((tx) => {
            const txDate = parseLocalDateInput(tx.date);
            txDate.setHours(0, 0, 0, 0);

            if (txDate >= start && txDate <= end) {
                const key = toLocalDateInputValue(txDate);
                grouped[key] = (grouped[key] || 0) + Number(tx.totalAmount);
            }
        });

        chartBarProperties.value.label = [];
        chartBarProperties.value.data = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);

            const key = toLocalDateInputValue(day);
            const label = getMonthAndDate(day);

            chartBarProperties.value.label.push(label);
            chartBarProperties.value.data.push(grouped[key] ?? 0);
        }
    };

    const chartPieMapping = () => {
        const { start, end } = getDateRange();
        const grouped: Record<string, number> = {};

        transactions.value.forEach((tx) => {
            const txDate = new Date(tx.date);
            if (txDate < start || txDate > end || tx.type !== "Outcome") return;

            const amountInUsd = tx.currency === "USD" ? Number(tx.amount) : Number(tx.amount) / 4000;
            grouped[tx.category] = (grouped[tx.category] || 0) + amountInUsd;
        });

        const sortedEntries = Object.entries(grouped).sort(([, left], [, right]) => right - left);
        chartPieProperties.value.label = sortedEntries.map(([label]) => label);
        chartPieProperties.value.data = sortedEntries.map(([, amount]) => Number(amount.toFixed(2)));
    };

    const onChangeDate = () => {
        chartBarMapping();
        chartPieMapping();
    };

    const setLast7Days = () => {
        startDate.value = latestStartDate.value;
        onChangeDate();
    };

    const shiftRange = (days: number) => {
        const current = parseLocalDateInput(startDate.value);
        current.setHours(0, 0, 0, 0);
        current.setDate(current.getDate() + days);

        const latest = getLatestStartDate();
        if (current > latest) {
            startDate.value = toLocalDateInputValue(latest);
        } else {
            startDate.value = toLocalDateInputValue(current);
        }
        onChangeDate();
    };

    return {
        chartBarProperties,
        chartPieProperties,
        chartBarMapping,
        chartPieMapping,
        canShiftForward,
        getTransaction,
        transactions,
        isLoading,
        latestStartDate,
        onChangeDate,
        selectedRangeLabel,
        setLast7Days,
        shiftRange,
        startDate,
    }
};
