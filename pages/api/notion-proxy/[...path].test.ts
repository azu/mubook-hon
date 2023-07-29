import { test } from "node:test";
import handler from "./[...path]";
import assert from "node:assert/strict";

test("handler should not include console.log", () => {
    assert.doesNotMatch(handler.toString(), /console\.log/);
});
