/**
 * ログイン不要の表示確認ページ（/viewer-demo）を表示してよいホストかを判定する。
 *
 * 表示確認ページはサンプル本文だけを表示し、Notion/Dropboxとは通信しないが、
 * 本番環境の利用者が迷い込まないよう、ローカル開発環境とプレビュー環境に限定する。
 *
 * Cloudflare WorkersのPreview URLは次の形式になる。
 * - <VERSION_PREFIX>-<WORKER_NAME>.<SUBDOMAIN>.workers.dev
 * - <ALIAS>-<WORKER_NAME>.<SUBDOMAIN>.workers.dev（ブランチごとのエイリアス）
 * https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/
 *
 * 本番は https://mubook-hon.jser.workers.dev なので、
 * "<何か>-mubook-hon.jser.workers.dev" の形だけを許可し、本番ホストそのものは許可しない。
 * wrangler.toml の [env.preview]（mubook-hon-preview）にデプロイした場合も許可する。
 */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const PREVIEW_WORKER_HOST = "mubook-hon-preview.jser.workers.dev";
const PREVIEW_URL_SUFFIXES = ["-mubook-hon.jser.workers.dev", "-mubook-hon-preview.jser.workers.dev"];

export const isDemoAllowedHost = (hostname: string): boolean => {
    const host = hostname.toLowerCase();
    if (LOCAL_HOSTS.has(host)) {
        return true;
    }
    if (host === PREVIEW_WORKER_HOST) {
        return true;
    }
    return PREVIEW_URL_SUFFIXES.some((suffix) => {
        if (!host.endsWith(suffix)) {
            return false;
        }
        const prefix = host.slice(0, -suffix.length);
        // プレフィックスは1つのDNSラベル（英数字とハイフン）であること
        return /^[a-z0-9][a-z0-9-]*$/.test(prefix);
    });
};
