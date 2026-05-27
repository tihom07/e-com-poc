export const formatINR = (value, options = {}) => {
    const amount = Number(value) || 0;
    const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;

    return `Rs. ${amount.toLocaleString('en-IN', {
        minimumFractionDigits,
        maximumFractionDigits,
    })}`;
};
