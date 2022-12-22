export function truncate (fullStr,
                         strLen = 8,
                         separator = "...",
                         frontChars = 10,
                         backChars = 10) {
    if (fullStr.length <= strLen) return fullStr;

    return (
        fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars)
    );
}
