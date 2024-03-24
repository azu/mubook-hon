import { describe, it } from "node:test";
import { joinMemoStock } from "./joinMemoStock";
import assert from "node:assert/strict";

describe("joinMemoStock", () => {
    it("should return a string with the memo and stock joined", () => {
        const memos = [
            `複数の部門が影響するKPIを前進させる最善の方法は、自律`,
            `自律的なクロスファンクショナル（機能横断的）チームを組織し、実行力を持たせることだ。`
        ];
        const expected = `複数の部門が影響するKPIを前進させる最善の方法は、自律的なクロスファンクショナル（機能横断的）チームを組織し、実行力を持たせることだ。`;
        assert.strictEqual(joinMemoStock(memos), expected);
    });
    it("should return a string with 3+ strings", () => {
        const memos = [`This is dup`, `duplicated text, long`, `long text`];
        const expected = `This is duplicated text, long text`;
        assert.strictEqual(joinMemoStock(memos), expected);
    });
    it("should return a string with 2 strings", () => {
        const memos = [
            `背もたれはびくともしない。彼女は客室乗`,
            `務員を呼び、乗務員はビーチに固定具を外すよう頼んだ。`,
            `頼んだけど、これはどうなの?`
        ];
        const expected = `背もたれはびくともしない。彼女は客室乗務員を呼び、乗務員はビーチに固定具を外すよう頼んだ。頼んだけど、これはどうなの?`;
        assert.strictEqual(joinMemoStock(memos), expected);
    });
});
