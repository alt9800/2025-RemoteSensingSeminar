const CACHE_NAME = 'offline-map-v1';
const urlsToCache = [
    './',  // index.html
    'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js',
    'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});