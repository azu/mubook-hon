export const joinMemoStock = (memos: string[]): string => {
    console.log("joinMemoStock", memos);
    let result = "";
    for (const memo of memos) {
        let i = 0;
        while (i < memo.length && result.includes(memo.substring(0, i + 1))) {
            i++;
        }
        result += memo.substring(i);
    }
    console.log("joinMemoStock", result);
    return result;
};
