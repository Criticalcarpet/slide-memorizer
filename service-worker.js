// -----------------------------
// Service Worker - Network-First for Everything
// -----------------------------

const CACHE_NAME = 'slide-memorizer-cache-v6'; // increment version for updates
const urlsToCache = [
  'index.html',
  'learn.html',
  'help.html',
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
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// -----------------------------
// Activate: clean old caches
// -----------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// -----------------------------
// Fetch: network-first for everything
// -----------------------------
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response if successful GET
        if (response && response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Network failed → try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          // Offline fallback for HTML pages
          if (event.request.destination === 'document') {
            return caches.match('offline.html');
          }
        });
      })
  );
});
