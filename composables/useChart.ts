import datetimeHelper from "~/helpers/datetimeHelper";
import type { IBarChart } from "~/models/chart";

export default function useChart() {
    const { getTranscation, transactions, transactionGroups, isLoading } = useTransaction();
    const { convertDate } = datetimeHelper;
    const chartBarProperties = ref<IBarChart>({
        label: [],
        data: [],
    });

    const chartBarMapping = () => {
        isLoading.value = true;
        const now = new Date()
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(now.getDate() - 6)

        chartBarProperties.value = {
            label: [],
            data: [],
        }

        const filtered = transactionGroups.value
            .filter((tx) => {
                const txDate = new Date(tx.date)
                return txDate >= sevenDaysAgo && txDate <= now
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        filtered.forEach((tx) => {
            const txDate = new Date(tx.date)
            const label = convertDate(txDate);
            chartBarProperties.value.label.push(label)
            chartBarProperties.value.data.push(Number(tx.totalAmount))
        })
        isLoading.value = false;
    }

    return {
        chartBarProperties,
        chartBarMapping,
        getTranscation,
        transactions,
        isLoading
    }
};