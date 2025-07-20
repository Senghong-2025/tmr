import datetimeHelper from "~/helpers/datetimeHelper";
import type { IBarChart } from "~/models/chart";

export default function useChart() {
    const { getTranscation, transactions, transactionGroups, isLoading } = useTransaction();
    const { getMonthAndDate } = datetimeHelper;
    const past7Days = new Date();
    past7Days.setDate(past7Days.getDate() - 6);
    const startDate = ref<string>(past7Days.toISOString().split('T')[0]);

    const chartBarProperties = ref<IBarChart>({
        label: [],
        data: [],
    });

    const chartBarMapping = () => {
        const start = new Date(startDate.value);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(0, 0, 0, 0);

        const grouped: Record<string, number> = {};

        transactionGroups.value.forEach((tx) => {
            const txDate = new Date(tx.date);
            txDate.setHours(0, 0, 0, 0);

            if (txDate >= start && txDate <= end) {
                const key = txDate.toISOString().split('T')[0];
                grouped[key] = (grouped[key] || 0) + Number(tx.totalAmount);
            }
        });

        chartBarProperties.value.label = [];
        chartBarProperties.value.data = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);

            const key = day.toISOString().split('T')[0];
            const label = getMonthAndDate(day);

            chartBarProperties.value.label.push(label);
            chartBarProperties.value.data.push(grouped[key] ?? 0);
        }
    };

    const onChangeDate = () => chartBarMapping();

    return {
        chartBarProperties,
        chartBarMapping,
        getTranscation,
        transactions,
        isLoading,
        startDate,
        onChangeDate,
    }
};