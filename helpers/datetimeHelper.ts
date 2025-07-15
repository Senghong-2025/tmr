import { format } from "date-fns";

const convertDate = (date: string | Date): string => {
    const d = new Date(date);
    return format(d, "yyyy-MMMM-dd");
}
const convertDateTime = (date: string | Date): string => {
    const d = new Date(date);
    return format(d, "yyyy-MMMM-dd hh:mm:ss a");
}
const converTimeOnly = (date: string | Date): string => {
    const d = new Date(date);
    return format(d, "hh:mm:ss a");
}

const getMonthOnly = (date: string | Date): string => {
    const d = new Date(date);
    return format(d, "MMMM");
}

const getMonthAndDate = (date: string | Date): string => {
    const d = new Date(date);
    return format(d, "MMMM dd");
}

export default {
    convertDate,
    convertDateTime,
    converTimeOnly,
    getMonthOnly,
    getMonthAndDate,
}