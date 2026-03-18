import { eachDayOfInterval, endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import datetimeHelper from "~/helpers/datetimeHelper";
import type { IBarChart, IPieChart } from "~/models/chart";

export default function useChart() {
    const { getTransaction, transactions, transactionGroups, isLoading } = useTransaction();
    const { getMonthAndDate } = datetimeHelper;
    type TRangePreset = "thisWeek" | "lastWeek" | "last7Days" | "thisMonth" | "lastMonth";

    const toLocalDateInputValue = (date: Date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const parseLocalDateInput = (value: string) => new Date(`${value}T00:00:00`);
    const weekOptions = { weekStartsOn: 1 as const };
    const getToday = () => startOfDay(new Date());
    const selectedPreset = ref<TRangePreset>("thisWeek");
    const rangePresets: { id: TRangePreset; label: string; }[] = [
        { id: "thisWeek", label: "This week" },
        { id: "lastWeek", label: "Last week" },
        { id: "last7Days", label: "Last 7 days" },
        { id: "thisMonth", label: "This month" },
        { id: "lastMonth", label: "Last month" },
    ];

    const chartBarProperties = ref<IBarChart>({
        label: [],
        data: [],
        title: "Balance",
    });
    const chartPieProperties = ref<IPieChart>({
        label: [],
        data: [],
        description: "",
    });

    const getDateRange = (preset = selectedPreset.value) => {
        const today = getToday();

        switch (preset) {
            case "thisWeek":
                return {
                    start: startOfWeek(today, weekOptions),
                    end: endOfDay(today),
                };
            case "lastWeek": {
                const lastWeek = subWeeks(today, 1);
                return {
                    start: startOfWeek(lastWeek, weekOptions),
                    end: endOfWeek(lastWeek, weekOptions),
                };
            }
            case "last7Days":
                return {
                    start: startOfDay(subDays(today, 6)),
                    end: endOfDay(today),
                };
            case "thisMonth":
                return {
                    start: startOfMonth(today),
                    end: endOfDay(today),
                };
            case "lastMonth": {
                const lastMonth = subMonths(today, 1);
                return {
                    start: startOfMonth(lastMonth),
                    end: endOfMonth(lastMonth),
                };
            }
        }
    };

    const selectedRangeLabel = computed(() => {
        const { start, end } = getDateRange();
        return `${getMonthAndDate(start)} - ${getMonthAndDate(end)}`;
    });

    const selectedPresetLabel = computed(() => rangePresets.find((preset) => preset.id === selectedPreset.value)?.label ?? "");

    const chartBarMapping = () => {
        const { start, end } = getDateRange();
        const daysInRange = eachDayOfInterval({ start, end });
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
        chartBarProperties.value.title = `${selectedPresetLabel.value} balance`;

        for (const day of daysInRange) {
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
        chartPieProperties.value.description = `Outcome transactions for ${selectedPresetLabel.value.toLowerCase()}.`;
    };

    const applyPreset = (preset: TRangePreset) => {
        selectedPreset.value = preset;
        chartBarMapping();
        chartPieMapping();
    };

    return {
        chartBarProperties,
        chartPieProperties,
        chartBarMapping,
        chartPieMapping,
        getTransaction,
        transactions,
        isLoading,
        applyPreset,
        rangePresets,
        selectedPreset,
        selectedPresetLabel,
        selectedRangeLabel,
    }
};
