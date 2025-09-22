const CACHE_NAME = "productores-agave-v2"
const urlsToCache = [
  "/login",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/agave-field-plantation.png",
  "/_next/static/css/app/layout.css",
  "/_next/static/css/app/globals.css",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.log("Cache addAll failed:", error)
      })
    }),
  )
  self.skipWaiting()
})

self.addEventListener("fetch", (event) => {
  // Skip caching for API routes and dynamic content
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("/_next/webpack-hmr") ||
    event.request.method !== "GET"
  ) {
    return
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            // Don't cache if not a valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== "basic") {
              return fetchResponse
            }

            // Clone the response
            const responseToCache = fetchResponse.clone()

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return fetchResponse
          })
        )
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === "document") {
          return caches.match("/login")
        }
      }),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      ),
    ),
  )
  self.clients.claim()
})
