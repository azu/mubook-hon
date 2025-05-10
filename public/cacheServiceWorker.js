/* eslint-disable */
// ---------------------------------------------------------------------------
// アプリ専用 Service Worker
// - 先に「オフライン対応」のイベントを登録
// - 最後に importScripts で MSW 生成の mockServiceWorker.js を読み込む
//   これにより fetch イベントが “条件分岐” で共存する
// ---------------------------------------------------------------------------
const STATIC_CACHE = "mubookhon-static-v1";
const RUNTIME_CACHE = "mubookhon-runtime-v1";

const BIBI_ROOT = "/bibi/";
const NEXT_STATIC_PREFIX = "/_next/static/";
// オフラインでも必ず欲しいファイル一覧
const PRECACHE_ASSETS = [
    "/", // HTML
    "/viewer" // ルート (必要なら調整)
];

// ----- install --------------------------------------------------------------
self.addEventListener("install", (event) => {
    // エラーが出てもアプリが止まらないよう try/catch
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(STATIC_CACHE);
                await cache.addAll(PRECACHE_ASSETS);
            } catch (err) {
                // 失敗はコンソールに出し、処理自体は継続
                console.error("[SW] precache 失敗", err);
            }
        })()
    );
    self.skipWaiting(); // 即時有効化
});

// ----- activate -------------------------------------------------------------
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            try {
                const keys = await caches.keys();
                // 古いキャッシュを削除
                await Promise.all(
                    keys.filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key)).map((key) => caches.delete(key))
                );
            } catch (err) {
                console.error("[SW] activate エラー", err);
            }
        })()
    );
    self.clients.claim();
});

// ----- fetch ---------------------------------------------------------------
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 0) bibi 以下と Next.js ランタイムはすべて Cache First --------------
    if (url.pathname.startsWith(BIBI_ROOT) || url.pathname.startsWith(NEXT_STATIC_PREFIX)) {
        event.respondWith(cacheFirst(request));
        return; // MSW には委譲しない
    }
    // -----------------------------------------------------------------------

    // 1) 必須静的アセット: Cache First
    if (PRECACHE_ASSETS.includes(url.pathname)) {
        event.respondWith(cacheFirst(request));
        return; // MSW には委譲しない
    }

    // 2) EPUB 本体や Dropbox: Stale-While-Revalidate
    if (url.hostname.endsWith("dropboxusercontent.com")) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    // 3) それ以外は MSW へ委譲
});

// --- 戦略関数 --------------------------------------------------------------
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached; // キャッシュ HIT

    try {
        const res = await fetch(request); // ネット取得
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, res.clone()).catch(() => {});
        return res;
    } catch (err) {
        console.error("[SW] cacheFirst フェッチ失敗", err);
        // オフラインでキャッシュ無し →エラー応答
        return Response.error();
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request)
        .then((res) => {
            cache.put(request, res.clone()).catch(() => {});
            return res;
        })
        .catch(() => null);

    // キャッシュがあれば即返す。無ければネット結果を待つ
    return cached || fetchPromise || Response.error();
}

// ---------------------------------------------------------------------------
// 最後に MSW の生成ファイルを読み込む。
// これ以降で宣言された fetch リスナーは「後勝ち」になる。
importScripts("/mockServiceWorker.js");
