const CACHE="almaty-trip-v2";
const ASSETS=["./","./index.html","./app.js","./data.js","./manifest.webmanifest","./icons/icon-192.svg","./icons/icon-512.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(e.request.method==="GET" && res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res}).catch(()=>caches.match("./index.html"))))});
