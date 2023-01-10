export const toCodeSequence = (str: string) => {
    if (str === "") {
        return "";
    }
    return Array.from(str)
        .map((char) => {
            return char.codePointAt(0)?.toString(16);
        })
        .join("_");
};
export const fromCodeSequence = (str: string) => {
    if (str === "") {
        return "";
    }
    return str
        .split("_")
        .map((code) => {
            return String.fromCodePoint(parseInt(code, 16));
        })
        .join("");
};
