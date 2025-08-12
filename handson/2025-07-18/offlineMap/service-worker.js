// service-worker.js
const CACHE_NAME = 'offline-map-v4';
const STATIC_CACHE = 'static-v4';

// 静的リソース
const staticAssets = [
    './',
    './index.html',
    'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js',
    'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css'
];

self.addEventListener('install', event => {
    console.log('Service Worker インストール中...');
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.addAll(staticAssets);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker 有効化');
    event.waitUntil(
        clients.claim().then(() => {
            // 古いキャッシュを削除
            return caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== STATIC_CACHE && name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            });
        })
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // タイルのリクエストを処理
    if (url.hostname === 'tile.openstreetmap.org' || url.hostname === 'tile.openstreetmap.jp') {
        event.respondWith(
            (async () => {
                // まずIndexedDBを確認
                try {
                    const db = await openDB();
                    const tx = db.transaction(['tiles'], 'readonly');
                    const store = tx.objectStore('tiles');
                    const tileData = await store.get(event.request.url);
                    
                    if (tileData && tileData.blob) {
                        console.log('Service Worker: IndexedDBからタイルを提供:', event.request.url);
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
                
                // IndexedDBになければネットワークから
                try {
                    const response = await fetch(event.request);
                    return response;
                } catch (err) {
                    // オフライン時は透明な画像を返す
                    console.log('タイル取得失敗（オフライン）:', event.request.url);
                    const transparentPng = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
                    return new Response(transparentPng, {
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

// IndexedDBヘルパー
async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('OfflineSurveyDB', 2);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}