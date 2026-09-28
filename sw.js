const CACHE_NAME = "almaty-trip-v3-1";
const CORE = [
  "./",
  "./index.html",
  "./app.js",
  "./data.js",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE).catch(()=>{})));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith("almaty-trip-") && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  event.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match(req).then(r=>r || caches.match("./index.html")))
  );
});
