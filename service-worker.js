const CACHE_NAME = "slide-mem-cache-v9"; // bumped

const CORE_ASSETS = [
  "index.html",
  "learn.html",
  "offline.html",
  "css/main.css",
  "css/learn.css",
  "css/nav.css",
  "js/data.js",
  "js/learn.js",
  "js/nav.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// helper: quick check for common image file extensions
function looksLikeImagePath(pathname) {
  return /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(pathname);
}

// --------------------------------------------------------
// FETCH HANDLER — network first, but DO NOT CACHE IMAGES
// --------------------------------------------------------
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Handle navigation (page reloads) separately
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch (err) {
          const cache = await caches.open(CACHE_NAME);
          const cachedPage = await cache.match(req.url);
          if (cachedPage) return cachedPage;

          const url = new URL(req.url);
          const page = url.pathname.split("/").pop();

          if (page !== "index.html" && page !== "learn.html") {
            return cache.match("offline.html");
          }
          return cache.match("index.html");
        }
      })()
    );
    return;
  }

  // Non-navigation requests
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);

        // Only attempt to cache GET successes
        if (req.method === "GET" && res && res.status === 200) {
          // Determine whether response is an image:
          // 1) check pathname extension
          // 2) check response Content-Type header
          // 3) treat opaque responses with image extension as image
          const urlObj = new URL(req.url);
          const pathLooksImage = looksLikeImagePath(urlObj.pathname);

          const contentType = res.headers.get("content-type") || "";
          const isImageByContent = contentType.startsWith("image/");

          const isOpaque = res.type === "opaque"; // cross-origin opaque response
          const isImage = isImageByContent || pathLooksImage || (isOpaque && pathLooksImage);

          if (!isImage) {
            const clone = res.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(req, clone);
          } else {
            // skip caching images (we expect images to be stored only in IndexedDB)
          }
        }

        return res;
      } catch (err) {
        // Network failed — try cache
        const cached = await caches.match(req);
        if (cached) return cached;
        return new Response(null, { status: 404 });
      }
    })()
  );
});
