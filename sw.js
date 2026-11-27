// Offline-cache: appen fungerar efter första besöket, även utan nät.
const CACHE = 'marre-schackskolan-v5';
const ASSETS = ["sma-ljud.js", "kotten.js", "ai.js", "app.js", "art.js", "art2.js", "cards.js", "icon-180.png", "icon-192.png", "icon-512.png", "index.html", "lessons.js", "loop.js", "menu.js", "probe.html", "rules.js", "screener.html", "ui.js"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return r;
    }).catch(() => caches.match(req).then((r) => r || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r && r.ok) {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
    }
    return r;
  })));
});
