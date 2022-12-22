export function formatBalance(balance, minimumFractionDigits, maximumFractionDigits) {
    maximumFractionDigits = maximumFractionDigits || 16
    minimumFractionDigits = minimumFractionDigits || 0
    return balance.toLocaleString('en-US', {
        maximumFractionDigits: maximumFractionDigits,
        minimumFractionDigits: minimumFractionDigits
    })
}