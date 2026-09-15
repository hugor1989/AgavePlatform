// Service worker mínimo: solo existe para que Chrome/Android considere la
// app "instalable" (uno de los requisitos de instalabilidad es tener un SW
// registrado con un listener de fetch). No cachea nada por ahora.
self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", () => {
  // passthrough — sin caché por el momento
})
