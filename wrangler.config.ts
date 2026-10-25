import { defineWranglerConfig } from "wrangler/experimental-config";

// Next.jsのStatic Export出力（./out）を静的アセットとして提供
// /notion/v1/* へのリクエストはワーカーで処理（Notion APIプロキシ）
export default defineWranglerConfig((ctx) => {
    switch (ctx.mode) {
        case "preview": {
            return {
                assetsDirectory: "./out"
            };
        }
        default: {
            return {
                assetsDirectory: "./out"
            };
        }
    }
});
