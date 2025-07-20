import datetimeHelper from "~/helpers/datetimeHelper";
import type { IBarChart } from "~/models/chart";

export default function useChart() {
    const { getTranscation, transactions, transactionGroups, isLoading } = useTransaction();
    const { getMonthAndDate } = datetimeHelper;
    const chartBarProperties = ref<IBarChart>({
        label: [],
        data: [],
    });

    const chartBarMapping = () => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(now.getDate() - 6)

        const grouped: Record<string, number> = {}

        transactionGroups.value.forEach((tx) => {
            const txDate = new Date(tx.date)
            txDate.setHours(0, 0, 0, 0)

            if (txDate >= sevenDaysAgo && txDate <= now) {
                const key = txDate.toISOString().split('T')[0]
                grouped[key] = (grouped[key] || 0) + Number(tx.totalAmount)
            }
        })

        for (let i = 0; i < 7; i++) {
            const day = new Date(sevenDaysAgo)
            day.setDate(sevenDaysAgo.getDate() + i)

            const key = day.toISOString().split('T')[0]
            const label = getMonthAndDate(day)

            chartBarProperties.value.label.push(label)
            chartBarProperties.value.data.push(grouped[key] ?? 0)
        }
    }

    return {
        chartBarProperties,
        chartBarMapping,
        getTranscation,
        transactions,
        isLoading
    }
};