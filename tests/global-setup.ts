import { setupServer } from "msw/node";
import { dropboxHandlers } from "./mocks/dropbox-handlers";
import { notionHandlers } from "./mocks/notion-handlers";

const server = setupServer(...dropboxHandlers, ...notionHandlers);

export default async function globalSetup() {
    server.listen({ onUnhandledRequest: "warn" });

    // テスト用の環境変数を設定
    process.env.DROPBOX_TEST_MODE = "true";

    return async () => {
        server.close();
    };
}
