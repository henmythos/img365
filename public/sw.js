const CACHE_NAME = 'img365-v1';
const STATIC_ASSETS = [
    '/',
    '/convert',
    '/compress',
    '/image-to-pdf',
    '/pdf-to-image',
    '/camera-to-pdf',
    '/background-remover',
    '/merge-pdf',
    '/pdf-to-text',
    '/crop-pdf',
    '/sign-pdf',
    '/image-resize',
    '/image-crop',
    '/image-rotate',
    '/smart-scan',
    '/manifest.json',
    '/favicon.svg'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Network-first for HTML, Cache-first for assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip external requests
    if (url.origin !== location.origin) return;

    // Skip model files (too large to cache)
    if (url.pathname.includes('/models/')) return;

    // For navigation requests (HTML pages): Network first, fallback to cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the response
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request).then((cached) => {
                        return cached || caches.match('/');
                    });
                })
        );
        return;
    }

    // For static assets: Cache first, fallback to network
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|svg|woff2?)$/) ||
        url.pathname.includes('/assets/')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;

                return fetch(request).then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                });
            })
        );
        return;
    }

    // Default: Network with cache fallback
    event.respondWith(
        fetch(request).catch(() => caches.match(request))
    );
});

// Background sync for offline actions (future use)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-pending') {
        // Handle background sync if needed
    }
});

// Push notifications (future use)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png'
        });
    }
});
