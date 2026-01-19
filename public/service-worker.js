// Simple service worker for caching the app shell and runtime requests.
// Place this file next to app.html (public/service-worker.js).
const CACHE_NAME = 'calendar-cache-v1';
const APP_SHELL = [
  './app.html',
  './manifest.json'
  // If you vendor files, add them here, e.g. './vendor/bootstrap.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => {
        console.warn('SW install: cache addAll failed', err);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./app.html').then((cached) =>
        cached || fetch(request).then(networkResp => {
          caches.open(CACHE_NAME).then(cache => cache.put(request, networkResp.clone()));
          return networkResp;
        }).catch(() => cached)
      )
    );
    return;
  }

  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then(networkResp => {
          if (networkResp && networkResp.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              try { cache.put(request, networkResp.clone()); } catch(e) {}
            });
          }
          return networkResp;
        }).catch(() => caches.match('./app.html'));
      })
    );
    return;
  }

  event.respondWith(
    fetch(request).then(networkResp => networkResp).catch(() => caches.match(request))
  );
});
