import { defineConfig } from "cf/config";

/**
 * `cf deploy --mode preview` で mubook-hon-preview にデプロイする
 * Wrangler environments are selected through ctx.mode and the cf --mode flag.
 * @see https://developers.cloudflare.com/workers/wrangler/environments/
 */

export default defineConfig((ctx) => {
    switch (ctx.mode) {
        case "preview": {
            return {
                worker: {
                    name: "mubook-hon-preview",
                    compatibilityDate: "2024-12-01",
                    entrypoint: "src/worker/index.ts"
                }
            };
        }
        default: {
            return {
                worker: {
                    name: "mubook-hon",
                    compatibilityDate: "2024-12-01",
                    entrypoint: "src/worker/index.ts"
                }
            };
        }
    }
});
