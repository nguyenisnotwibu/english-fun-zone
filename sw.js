/* Service worker: chạy offline + cập nhật nhanh.
   - HTML/CSS/JS: ưu tiên mạng (luôn mới), mất mạng thì dùng bản đã lưu.
   - data/*.js (đề thi): ưu tiên bản đã lưu, cập nhật ngầm ở nền. */
const VER='efz-v1';
const CORE=['./','index.html','css/app.css','js/data-loader.js','js/app.js','js/a11y.js','manifest.webmanifest','icon.svg'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VER).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;               // font, API ngoài: để trình duyệt tự xử lý
  const isData=u.pathname.includes('/data/');
  e.respondWith(caches.open(VER).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>null);
    if(isData&&hit){net.catch(()=>{});return hit}      // stale-while-revalidate
    const res=await net;
    return res||hit||new Response('Offline',{status:503,statusText:'Offline'});
  }));
});
