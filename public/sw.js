const CACHE_NAME = "productores-agave-v2"
const urlsToCache = [
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
]

// Instala el SW y cachea solo los íconos y el manifest
self.addEventListener("install", (event) => {
  console.log("SW instalado (solo cachea manifest e íconos).");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activa inmediatamente
});

// Activa el nuevo SW y limpia versiones viejas
self.addEventListener("activate", (event) => {
  console.log("SW activado.");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      )
    )
  );
  self.clients.claim();
});

// Solo responde desde cache para los íconos o manifest
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (urlsToCache.includes(new URL(request.url).pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  } else {
    // 🚀 todo lo demás va directo a red (sin cache)
    event.respondWith(fetch(request));
  }
});