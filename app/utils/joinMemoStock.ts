export const joinMemoStock = (memos: string[]): string => {
    let result = "";
    for (const memo of memos) {
        let i = 0;
        while (i < memo.length && result.includes(memo.substring(0, i + 1))) {
            i++;
        }
        // check if suffix of result is prefix of memo
        if (result.slice(-i) !== memo.substring(0, i)) {
            result += memo;
            continue;
        }
        result += memo.substring(i);
    }
    return result;
};
