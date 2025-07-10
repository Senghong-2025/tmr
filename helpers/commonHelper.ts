import { format } from "date-fns";

const convertDate = (date: string | Date): string => {
    const d = new Date(date);
    return format(d, "yyyy-MMMM-dd");
}
const convertDateTime = (date: string | Date): string => {
    const d = new Date(date);
    return format(d, "yyyy-MMMM-dd hh:mm:ss a");
}
export default {
    convertDate,
    convertDateTime,
}