/* Service worker: chạy offline + cập nhật nhanh.
   - HTML/CSS/JS: ưu tiên mạng (luôn mới), mất mạng thì dùng bản đã lưu.
   - data/*.js (đề thi): ưu tiên bản đã lưu, cập nhật ngầm ở nền. */
const VER='efz-v5';
const CORE=['./','index.html','css/app.css','js/data-loader.js','js/app.js','js/a11y.js','manifest.webmanifest','icon.svg','icons/icon-192.png'];
/* Phần tải theo yêu cầu + trang Ngữ Pháp Master: lưu sẵn ở nền để dùng được offline, không chặn lần mở đầu. */
const LAZY=['js/chunks/grades.js','js/chunks/grammar.js','js/chunks/games.js','js/chunks/td.js','js/chunks/ielts.js','grammar.html',
  /* Word Strike 3D: trang game + script mở rộng + three.js r128 (local) để chơi offline */
  'word-strike-3d.html','js/ws-extras.js',
  'js/vendor/three/three.min.js','js/vendor/three/CopyShader.js','js/vendor/three/LuminosityHighPassShader.js',
  'js/vendor/three/EffectComposer.js','js/vendor/three/RenderPass.js','js/vendor/three/ShaderPass.js','js/vendor/three/UnrealBloomPass.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VER).then(c=>Promise.allSettled(CORE.map(u=>c.add(u))).then(()=>{Promise.allSettled(LAZY.map(u=>c.add(u)))})).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  if(r.headers.has('range'))return;                  // mp3 bài nghe: để trình duyệt tự tải từng đoạn               // font, API ngoài: để trình duyệt tự xử lý
  const isData=u.pathname.includes('/data/');
  e.respondWith(caches.open(VER).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&res.status===200)c.put(r,res.clone()).catch(()=>{});return res}).catch(()=>null);
    if(isData&&hit){net.catch(()=>{});return hit}      // stale-while-revalidate
    const res=await net;
    return res||hit||new Response('Offline',{status:503,statusText:'Offline'});
  }));
});
