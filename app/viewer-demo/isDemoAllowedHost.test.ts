import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isDemoAllowedHost } from "./isDemoAllowedHost";

describe("isDemoAllowedHost", () => {
    it("ローカル開発環境は許可する", () => {
        assert.equal(isDemoAllowedHost("localhost"), true);
        assert.equal(isDemoAllowedHost("127.0.0.1"), true);
    });
    it("Workersのプレビュー環境は許可する", () => {
        assert.equal(isDemoAllowedHost("claude-project-thread-y4qfx9-mubook-hon.jser.workers.dev"), true);
        assert.equal(isDemoAllowedHost("4f1a2b3c-mubook-hon.jser.workers.dev"), true);
        assert.equal(isDemoAllowedHost("mubook-hon-preview.jser.workers.dev"), true);
        assert.equal(isDemoAllowedHost("abc123-mubook-hon-preview.jser.workers.dev"), true);
    });
    it("本番環境は許可しない", () => {
        assert.equal(isDemoAllowedHost("mubook-hon.jser.workers.dev"), false);
        assert.equal(isDemoAllowedHost("MUBOOK-HON.jser.workers.dev"), false);
    });
    it("似ているが別のホストは許可しない", () => {
        assert.equal(isDemoAllowedHost("evil.example.com"), false);
        assert.equal(isDemoAllowedHost("-mubook-hon.jser.workers.dev"), false);
        assert.equal(isDemoAllowedHost("a.b-mubook-hon.jser.workers.dev"), false);
        assert.equal(isDemoAllowedHost("x-mubook-hon.jser.workers.dev.example.com"), false);
        assert.equal(isDemoAllowedHost("x-mubook-hon.other.workers.dev"), false);
    });
});
