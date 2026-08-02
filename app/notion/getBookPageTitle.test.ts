import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getBookPageTitle } from "./getBookPageTitle";

describe("getBookPageTitle", () => {
    it("removes a PDF extension", () => {
        assert.strictEqual(getBookPageTitle("Example Book.pdf"), "Example Book");
    });

    it("removes an EPUB extension", () => {
        assert.strictEqual(getBookPageTitle("Example Book.epub"), "Example Book");
    });

    it("removes only the last extension", () => {
        assert.strictEqual(getBookPageTitle("Learning.Node.js.epub"), "Learning.Node.js");
    });

    it("keeps a filename without an extension", () => {
        assert.strictEqual(getBookPageTitle("Example Book"), "Example Book");
    });

    it("keeps a dotfile and a filename ending with a dot", () => {
        assert.strictEqual(getBookPageTitle(".example"), ".example");
        assert.strictEqual(getBookPageTitle("Example Book."), "Example Book.");
    });
});
