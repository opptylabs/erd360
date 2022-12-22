export function fixBalance(balance, decimals) {
    decimals = decimals || 1
    let divider = '1'
    for (let i = 0; i < decimals; i++) {
        divider += '0';
    }
    return balance / parseInt(divider)
}