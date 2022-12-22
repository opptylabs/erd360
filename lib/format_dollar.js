export function formatDollar(num, token) {
    try {
        let p = num.toFixed(2).split(".");
        return ["$", p[0].split("").reverse().reduce(function(acc, num, i) {
            return num + (i && !(i % 3) ? "," : "") + acc;
        }, "."), p[1]].join("");
    } catch (e) {
        return '0.00'
    }
}