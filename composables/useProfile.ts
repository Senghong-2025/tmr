import datetimeHelper from "~/helpers/datetimeHelper";
import type { IUser } from "~/models/user";

export default function useProfile() {

    const user = ref<IUser | null>(null);
    const { logout } = useAuth();
    const { getMonthOnly } = datetimeHelper;
    const { getTotalTransactionByMonth, total, isLoading } = useTransaction();

    const now = new Date();
    const selectedMonth = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);

    const onChangeDate = async () => {
        if (!selectedMonth.value) return;
        const date = new Date(selectedMonth.value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const formattedMonth = `${year}-${month}`;
        await getTotalTransactionByMonth(formattedMonth);
    };

    return {
        user,
        getTotalTransactionByMonth,
        onChangeDate,
        isLoading,
        total,
        logout,
        getMonthOnly,
        selectedMonth,
    }
};