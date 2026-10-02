const CACHE_NAME = 'almaty-trip-v8-verified';
const BASE = self.location.pathname.replace(/sw\.js$/, '');
const CORE = [BASE, BASE+'index.html', BASE+'app.js', BASE+'data.js', BASE+'manifest.webmanifest', BASE+'icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE.map(u => new Request(u, {cache:'reload'}))).catch(()=>{})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('almaty-trip-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  // Cache local app files normally. Cache remote photos at runtime after the first successful/opaque response.
  if(url.origin!==self.location.origin){
    if(req.destination==='image' && /wikimedia\.org$/.test(url.hostname)){
      event.respondWith(caches.open(CACHE_NAME).then(async cache=>{const cached=await cache.match(req);if(cached)return cached;try{const res=await fetch(req);if(res&& (res.ok||res.type==='opaque')) await cache.put(req,res.clone());return res}catch(e){return Response.error()}}));
    }
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));}return res;}).catch(()=>caches.match(BASE+'index.html'))));
});
