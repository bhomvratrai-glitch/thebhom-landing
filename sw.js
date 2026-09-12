// ============================================================
// TheBhom.in — Progressive Web App (PWA) Service Worker
// Cache Version: v2026.09.12
// ============================================================

const CACHE_NAME = 'thebhom-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/wallpapers.html',
  '/ebooks.html',
  '/magazines.html',
  '/templates.html',
  '/cards.html',
  '/shared.css',
  '/shared.js',
  '/data.js',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// 1. Install Event: Cache Core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First for HTML, Stale-While-Revalidate for Assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET, analytics, ads, and chrome-extension requests
  if (req.method !== 'GET') return;
  if (url.origin.includes('google') || url.origin.includes('gstatic') || url.origin.includes('pagead2')) return;

  // For HTML documents: Network first with Cache fallback
  if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => caches.match(req).then((cachedRes) => cachedRes || caches.match('/index.html')))
    );
    return;
  }

  // For static assets: Cache first / Stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
