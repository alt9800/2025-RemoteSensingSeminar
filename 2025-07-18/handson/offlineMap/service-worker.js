const CACHE_NAME = 'offline-map-v3';
const STATIC_CACHE = 'static-v3';

// 静的リソース
const staticAssets = [
    './',
    './index.html',
    'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js',
    'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.addAll(staticAssets);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // OpenStreetMapタイルの処理
    if (url.hostname === 'tile.openstreetmap.org' || url.hostname === 'tile.openstreetmap.jp') {
        event.respondWith(
            // まずIndexedDBから探す
            (async () => {
                try {
                    // IndexedDBを開く
                    const db = await openDB();
                    const tx = db.transaction(['tiles'], 'readonly');
                    const store = tx.objectStore('tiles');
                    const tileData = await store.get(event.request.url);
                    
                    if (tileData && tileData.blob) {
                        console.log('Service Worker: タイルをIndexedDBから提供:', event.request.url);
                        return new Response(tileData.blob, {
                            headers: {
                                'Content-Type': 'image/png',
                                'Cache-Control': 'public, max-age=31536000'
                            }
                        });
                    }
                } catch (err) {
                    console.error('IndexedDB読み込みエラー:', err);
                }
                
                // IndexedDBになければネットワークから取得
                try {
                    const response = await fetch(event.request);
                    return response;
                } catch (err) {
                    console.error('タイル取得エラー:', err);
                    // 透明な1x1のPNG画像を返す（エラー回避）
                    const transparentPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
                    return new Response(atob(transparentPng), {
                        headers: { 'Content-Type': 'image/png' }
                    });
                }
            })()
        );
        return;
    }
    
    // 静的リソースの処理
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            if (event.request.destination === 'document') {
                return caches.match('./index.html');
            }
        })
    );
});

// IndexedDBを開くヘルパー関数
async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('OfflineSurveyDB', 2);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}