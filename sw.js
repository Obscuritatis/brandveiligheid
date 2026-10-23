// Network first, so updates show right away; the cached copy is used when there is no connection.
// cache:'no-cache' makes the browser check with GitHub every time instead of using its own 10-minute copy.
const CACHE='brandveiligheid-v3';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const fresh=r.mode==='navigate'?new Request(r.url,{cache:'no-cache',credentials:'same-origin'}):new Request(r,{cache:'no-cache'});
  e.respondWith(fetch(fresh).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./'))));
});
