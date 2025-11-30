// -----------------------------
// Service Worker for Slide Memorizer
// -----------------------------

const CACHE_NAME = 'slide-memorizer-cache-v3'; // increment for updates
const urlsToCache = [
  'index.html',
  'learn.html',
  'offline.html',
  'css/learn.css',
  'css/main.css',
  'css/nav.css',
  'js/data.js',
  'js/learn.js',
  'js/nav.js'
];

// -----------------------------
// Install: cache essential assets
// -----------------------------
self.addEventListener('install', (event) => {
  self.skipWaiting(); // activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// -----------------------------
// Activate: clean old caches
// -----------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // take control immediately
});

// -----------------------------
// Fetch: network-first with cache fallback
// -----------------------------
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful GET requests
        if (response && response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed → try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          // Fallback for HTML pages
          if (event.request.destination === 'document') {
            return caches.match('offline.html');
          }
        });
      })
  );
});

// -----------------------------
// Optional: dynamic caching of GitHub raw images
// -----------------------------
// Images from GitHub raw URLs in data.js will be cached on first fetch automatically
