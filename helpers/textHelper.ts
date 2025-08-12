const convertAmountWithoutRouteUp = (amount: number , decimals: number = 2) => {
    if (isNaN(amount) || amount === null) return '';
    const factor = Math.pow(10, decimals);
    return (Math.trunc(amount * factor) / factor).toFixed(decimals);
};

export default {
    convertAmountWithoutRouteUp
}