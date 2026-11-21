// INFINITUS Mathematics Club — Offline Service Worker
const CACHE_NAME = 'infinitus-pwa-v1';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/brand/icon-192.png',
  '/brand/icon-512.png',
  '/brand/infinitus-og.png',
  '/icon.png',
  '/apple-icon.png',
];

// Install: pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[PWA SW install precache error]', err))
  );
});

// Activate: clean up obsolete cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: Network-first for HTML pages; Stale-While-Revalidate for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests or browser extension protocols
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // HTML page navigations -> Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match('/');
          if (fallback) return fallback;
          return new Response(
            '<html><head><title>Offline - INFINITUS</title></head><body style="background:#090A10;color:#FFF;font-family:sans-serif;text-align:center;padding:50px;"><h1>You are offline</h1><p>Please check your connection and refresh.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Static assets (images, fonts, scripts, css) -> Cache-first with network revalidation
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => null);

      return cached || fetchPromise;
    })
  );
});
