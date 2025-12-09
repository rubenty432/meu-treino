/**
 * Service Worker para suporte offline e caching
 */
const CACHE_NAME = 'meu-treino-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/treino1.html',
    '/habitos.html',
    '/stats.html',
    '/treino.css',
    '/habitos.css',
    '/script.min.js',
    '/stats.js',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch(() => {
                console.log('Alguns assets não puderam ser cacheados durante install');
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Network first para API calls, cache first para assets
    if (event.request.method !== 'GET') {
        return event.respondWith(fetch(event.request));
    }
    
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response.status === 200) {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                }
                return response;
            })
            .catch(() => {
                // Offline - try cache
                return caches.match(event.request).then((response) => {
                    return response || new Response('Offline - página não disponível', { status: 503 });
                });
            })
    );
});
