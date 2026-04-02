const CACHE_NAME = "xavier-os-v2";

/* =========================
   📦 FILES TO CACHE
========================= */
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json"
];

/* =========================
   🚀 INSTALL
========================= */
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

/* =========================
   🔄 ACTIVATE (CLEAN OLD)
========================= */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* =========================
   🌐 FETCH STRATEGY
========================= */
self.addEventListener("fetch", (event) => {

  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {

      // 1️⃣ Serve from cache if exists
      if (cached) return cached;

      // 2️⃣ Otherwise fetch + cache
      return fetch(event.request)
        .then((response) => {

          // Skip bad responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const clone = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });

          return response;
        })
        .catch(() => {
          // 3️⃣ Offline fallback
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
