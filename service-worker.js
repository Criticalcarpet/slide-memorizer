// -----------------------------
// Service Worker - Slide Memorizer
// -----------------------------

const CACHE_NAME = "slide-memorizer-cache-v14";

const CORE_ASSETS = [
  "index.html",
  "learn.html",
  "offline.html",
  "css/learn.css",
  "css/main.css",
  "css/nav.css",
  "js/data.js",
  "js/learn.js",
  "js/nav.js"
];

// INSTALL: pre-cache core assets only
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
});

// ACTIVATE: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH: network-first for everything
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only Cache Storage for core assets (HTML, JS, CSS)
  if (CORE_ASSETS.includes(new URL(request.url).pathname.slice(1))) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok && request.method === "GET") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // All images handled via IndexedDB in learn.js
  // For other requests (optional), fallback to network only
});
