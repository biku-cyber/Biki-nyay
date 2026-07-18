const CACHE = 'nyaysetu-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/base.css',
  './css/theme.css',
  './css/layout.css',
  './css/reader.css',
  './css/components.css',
  './js/utils.js',
  './js/storage.js',
  './js/theme.js',
  './js/speech.js',
  './js/bookmark.js',
  './js/search.js',
  './js/reader.js',
  './js/settings.js',
  './js/router.js',
  './js/app.js',
  './data/constitution.json',
  './data/bns.json',
  './data/bnss.json',
  './data/bsa.json',
  './data/ipc.json',
  './data/crpc.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
