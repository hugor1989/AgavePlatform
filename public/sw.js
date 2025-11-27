// public/sw.js
// Service Worker para PWA - NO cachea peticiones API

const CACHE_NAME = 'productores-agave-v2';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// Instalar
self.addEventListener('install', (event) => {
  console.log('[SW v2] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v2] Cacheando assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('[SW v2] Error cacheando:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activar
self.addEventListener('activate', (event) => {
  console.log('[SW v2] Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW v2] Eliminando caché viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch - LO MÁS IMPORTANTE
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // ⚠️ NUNCA cachear:
  // 1. Peticiones a API
  // 2. Peticiones que no sean GET
  // 3. Peticiones a otros dominios
  if (
    url.pathname.startsWith('/api') || 
    url.hostname !== self.location.hostname ||
    event.request.method !== 'GET'
  ) {
    // Pasar directo al servidor SIN interceptar
    return;
  }
  
  // Solo cachear los assets estáticos definidos
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      }).catch(() => {
        // Si falla, dejar que pase al servidor
        return fetch(event.request);
      })
    );
  }
  
  // Todo lo demás: directo a la red
});

console.log('[SW v2] Service Worker cargado');