const CACHE_NAME = 'sodaroja-v1';
const STATIC_ASSETS = [
  '/',
  '/episodios',
  '/que-es-esto',
  '/equipo',
  '/frecuencia-interna',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only cache GET requests for same origin
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;
  // Network first for API calls
  if (request.url.includes('supabase') || request.url.includes('api')) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then(cached => cached || new Response('Offline', { status: 503 })))
  );
});
