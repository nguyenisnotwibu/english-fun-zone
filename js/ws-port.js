/* =====================================================================
   WORD STRIKE 3D – 6 KHU CẢNG CONTAINER (Giai đoạn 4 của "Saltline Ops")
   · Đổi tên + màu 6 ải thành 6 khu cảng đêm (data/ws-port.js → window.WS_PORT); sai dữ liệu thì giữ chủ đề cũ + cảnh báo.
   · Container xếp chồng (1–3 tầng, dài 1–2 container) làm chỗ nấp THẬT (va chạm + chặn đạn): thay các khối ngẫu nhiên cũ.
     Khối che vẫn đi qua đường gộp mesh cũ (1 draw call).
   · Trang trí (chỉ mức Cao, tất cả bằng InstancedMesh ≈ 4 draw call): gân + sọc + cửa container, bậc thang + tay vịn trên các dốc,
     khung cần cẩu trên cao, đèn đường + vệt sáng trên sàn, tàu hàng / hải đăng + chùm sáng quét / cần cẩu xa.
   · Sương mù theo khu (mọi mức đồ hoạ).
   Nạp SAU ws-combat.js. Thiết kế: design/quick-specs/saltline-port-phase4-2026-11-15.md
   ===================================================================== */
'use strict';
(function(){
const API=window.WSX_API;
if(typeof STAGES==='undefined'||typeof THREE==='undefined'||!API||!API.DECO||!API.SKY||typeof COVERS==='undefined'||typeof buildArena!=='function'){
  console.warn('[WS port] game chưa sẵn sàng – bỏ qua');return}
const $=id=>document.getElementById(id);

/* ===================== KIỂM ĐỊNH DỮ LIỆU ===================== */
const EXTRA=['water','ship','lighthouse',null],HEXS=/^#[0-9a-f]{6}$/i;
function validate(d){
  const errs=[],E=m=>errs.push(m),isN=v=>typeof v==='number'&&isFinite(v);
  if(!d||!Array.isArray(d.zones)||d.zones.length!==6){E('zones cần đúng 6 khu');return errs}
  d.zones.forEach((z,i)=>{const at='zones['+i+'] ';
    if(!z||typeof z!=='object'){E(at+'không phải đối tượng');return}
    if(typeof z.name!=='string'||!z.name||z.name.length>18)E(at+'name là chữ 1–18 ký tự');
    if(typeof z.sub!=='string'||!z.sub||typeof z.vi!=='string'||!z.vi)E(at+'thiếu sub / vi');
    const th=z.th;
    if(!th)E(at+'thiếu th');
    else{if(!HEXS.test(th.floor||'')||!HEXS.test(th.stud||''))E(at+'th.floor / th.stud phải là #rrggbb');
      if(!Array.isArray(th.sky)||th.sky.length!==4||!th.sky.every(c=>HEXS.test(c)))E(at+'th.sky cần 4 màu #rrggbb');
      for(const k of ['fog','wall','trim'])if(!Number.isInteger(th[k])||th[k]<0||th[k]>0xffffff)E(at+'th.'+k+' phải là số màu 0x000000–0xffffff');
      if(!Array.isArray(th.pal)||th.pal.length!==5||!th.pal.every(c=>Number.isInteger(c)&&c>=0&&c<=0xffffff))E(at+'th.pal cần 5 màu')}
    if(!Array.isArray(z.fog)||z.fog.length!==2||!isN(z.fog[0])||!isN(z.fog[1])||z.fog[0]<5||z.fog[1]<=z.fog[0]||z.fog[1]>300)E(at+'fog = [gần ≥ 5, xa > gần, ≤ 300]');
    const s=z.stacks||{};
    if(!Number.isInteger(s.count)||s.count<3||s.count>16)E(at+'stacks.count nguyên 3–16');
    if(!Array.isArray(s.lv)||s.lv.length!==2||!s.lv.every(n=>Number.isInteger(n)&&n>=1&&n<=3)||s.lv[0]>s.lv[1])E(at+'stacks.lv = [thấp, cao] trong 1–3');
    if(!Array.isArray(s.long)||s.long.length!==2||!s.long.every(n=>Number.isInteger(n)&&n>=1&&n<=2)||s.long[0]>s.long[1])E(at+'stacks.long = [ít, nhiều] trong 1–2');
    if(!isN(s.minR)||s.minR<8||!isN(s.maxR)||s.maxR>27||s.minR>=s.maxR)E(at+'stacks.minR ≥ 8, maxR ≤ 27, minR < maxR (tâm 8 m đầu phải trống)');
    if(!isN(s.gap)||s.gap<2||s.gap>8)E(at+'stacks.gap trong 2–8');
    const l=z.lamps||{};if(!isN(l.every)||l.every<6||l.every>40||!Number.isInteger(l.color)||l.color<0||l.color>0xffffff)E(at+'lamps = {every 6–40, color}');
    if(typeof z.gantry!=='boolean')E(at+'gantry phải là true/false');
    if(!EXTRA.includes(z.extra===undefined?undefined:z.extra))E(at+'extra phải là water / ship / lighthouse / null')});
  return errs}
let D=window.WS_PORT,errs=validate(D);
if(errs.length){console.warn('[WS port] data/ws-port.js lỗi – giữ chủ đề cũ:\n - '+errs.slice(0,8).join('\n - '));
  const w=$('dataWarn');if(w){w.textContent='⚠️ Dữ liệu khu cảng (data/ws-port.js) có lỗi ('+errs.length+') – đang dùng chủ đề cũ. Chi tiết ở Console.';w.classList.remove('hide')}
  window.WSPort={D:null,validate,usingFallback:true,errors:errs};return}

/* ===================== TÊN + MÀU ===================== */
const ORIG=STAGES.map(s=>({name:s.name,th:Object.assign({},s.th)}));
STAGES.forEach((s,i)=>{const z=D.zones[i];s.name=z.name;Object.assign(s.th,z.th);s.th.sky=z.th.sky.slice();s.th.pal=z.th.pal.slice()});

/* ===================== CONTAINER XẾP CHỒNG (vật cản thật) ===================== */
const UL=6,UW=2.4,UH=2.6;
function planStacks(idx){
  const z=D.zones[idx],S=z.stacks,rr=seeded((idx+1)*104729+17),list=[];
  for(let k=0;k<400&&list.length<S.count;k++){
    const ax=rr()<.5?'x':'z',n=S.long[0]+Math.floor(rr()*(S.long[1]-S.long[0]+1)),lv=S.lv[0]+Math.floor(rr()*(S.lv[1]-S.lv[0]+1));
    const a=rr()*Math.PI*2,r=S.minR+rr()*(S.maxR-S.minR),x=Math.cos(a)*r,zz=Math.sin(a)*r,w=ax==='x'?UL*n:UW,d=ax==='x'?UW:UL*n;
    if(Math.abs(x)+w/2>28||Math.abs(zz)+d/2>28)continue;
    if(Math.hypot(Math.max(0,Math.abs(x)-w/2),Math.max(0,Math.abs(zz)-d/2))<S.minR-3)continue;
    if(list.some(o=>Math.abs(o.x-x)<(o.w+w)/2+S.gap&&Math.abs(o.z-zz)<(o.d+d)/2+S.gap))continue;
    list.push({x,z:zz,ax,n,lv,w,d,c:list.length%5})}
  return list}
function stacks(idx,block,th){
  const z=D.zones[idx];if(!z)return false;
  scene.fog.near=z.fog[0];scene.fog.far=z.fog[1];
  for(const s of planStacks(idx)){block(s.x,s.z,s.w,UH*s.lv,s.d,th.pal[s.c%th.pal.length],true);COVERS[COVERS.length-1].port=s}
  return true}
window.WSPORT={stacks};

/* ===================== TRANG TRÍ (mức Cao): InstancedMesh ===================== */
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_e=new THREE.Euler(),_p=new THREE.Vector3(),_s=new THREE.Vector3(),_c=new THREE.Color();
let beam=null;
function shade(hex,k){_c.setHex(hex);return _c.multiplyScalar(k).getHex()}
function dress(g,th,R,idx){
  const z=D.zones[idx],items=[],info={units:0,steps:0,rails:0,gantry:0,extra:0,lamps:0,stacks:0};            /* [x,y,z, sx,sy,sz, color, rotZ] */
  const box=(x,y,zz,sx,sy,sz,col,rz)=>items.push([x,y,zz,sx,sy,sz,col,rz||0]);
  /* container: gân, sọc, cửa */
  for(const c of COVERS){const s=c.port;if(!s)continue;info.stacks++;
    const base=th.pal[s.c%th.pal.length],dark=shade(base,.55),band=th.pal[(s.c+2)%th.pal.length];
    for(let l=0;l<s.lv;l++)for(let u=0;u<s.n;u++){
      info.units++;const off=(u+.5-s.n/2)*UL,cy=l*UH+UH/2,cx=s.ax==='x'?s.x+off:s.x,cz=s.ax==='x'?s.z:s.z+off;
      for(let i=0;i<9;i++){const t=-2.7+i*.675;
        for(const f of [-1,1]){
          if(s.ax==='x')box(cx+t,cy,cz+f*(UW/2+.04),.14,UH-.3,.09,dark);else box(cx+f*(UW/2+.04),cy,cz+t,.09,UH-.3,.14,dark)}}
      for(const f of [-1,1]){
        if(s.ax==='x')box(cx,cy+.7,cz+f*(UW/2+.07),3.4,.34,.07,band);else box(cx+f*(UW/2+.07),cy+.7,cz,.07,.34,3.4,band)}
      for(const f of [-1,1]){   /* cửa hai đầu */
        if(s.ax==='x'){box(cx+f*(UL/2+.04),cy,cz,.09,UH-.3,UW-.3,dark);box(cx+f*(UL/2+.09),cy,cz,.05,UH-.4,.1,shade(base,.8))}
        else{box(cx,cy,cz+f*(UL/2+.04),UW-.3,UH-.3,.09,dark);box(cx,cy,cz+f*(UL/2+.09),.1,UH-.4,.05,shade(base,.8))}}}}
  /* bậc thang + tay vịn trên các dốc */
  const W=window.WSMAP;
  if(W&&W.MAP&&W.MAP.ramps)for(const r of W.MAP.ramps){
    const steps=Math.max(6,Math.round(r.len/.5)),slope=Math.atan2(r.h,r.len);
    for(let i=0;i<steps;i++){const t=(i+.5)/steps;{box(r.lowX+r.dir*r.len*t,r.h*t+.05,r.zc,.2,.07,r.w,0x0b0d0f);info.steps++}}
    const L=Math.hypot(r.len,r.h),rz=r.dir>0?slope:-slope;
    for(const f of [-1,1]){box(r.lowX+r.dir*r.len/2,r.h/2+.95,r.zc+f*(r.w/2+.08),L,.08,.08,th.trim,rz);info.rails++}}
  /* khung cần cẩu trên cao */
  if(z.gantry){info.gantry=1;
    for(const sx of [-30,30])for(const sz of [-33,33])box(sx,5.8,sz,1.1,11.6,1.1,0x39424d);
    for(const sz of [-33,33])box(0,11.7,sz,62,1.1,1.1,0x39424d);
    box(-8,12.4,0,1.3,1.3,66,0x39424d);box(-8,10.9,-6,2.8,1.6,2.8,0xd9a441);box(-8,8.2,-6,.12,6,.12,0x8d9aa3)}
  /* cảnh nền xa */
  if(z.extra)info.extra=1;
  if(z.extra==='water'){for(let i=0;i<4;i++){const x=-60+i*40;for(const sx of [-6,6])box(x+sx,11,-84,1.4,22,1.4,0x1d2733);box(x,22.5,-84,16,1.4,1.4,0x1d2733);box(x,20,-84,3,2,3,0x2c5f8a)}}
  if(z.extra==='ship'){
    box(66,5,0,64,10,24,0x2c2f35);box(66,10.4,0,64,.8,24,0x4a4743);box(78,16,0,14,12,16,0xe8e4da);box(78,23,0,10,3,12,0x39424d);
    for(let i=0;i<5;i++)for(let l=0;l<2;l++)box(46+i*6.4,12+l*2.7,(i%2?-5:5),6,2.6,2.4,th.pal[(i+l)%th.pal.length])}
  if(z.extra==='lighthouse'){
    const tx=-62,tz=-62;box(tx,6,tz,12,12,12,0x39424d);
    for(let i=0;i<6;i++)box(tx,12+i*5+2.5,tz,9-i*.7,5,9-i*.7,i%2?0xc0392b:0xe8e4da);
    box(tx,44,tz,6,5,6,0x1b1f33)}
  /* đèn đường dọc tường */
  const lamps=[],pools=[];
  for(let t=-26;t<=26;t+=z.lamps.every){for(const [x,zz] of [[t,-29.2],[t,29.2],[-29.2,t],[29.2,t]]){box(x,3.2,zz,.26,6.4,.26,0x2a2f35);lamps.push([x,6.5,zz]);pools.push([x*.93,zz*.93]);info.lamps++}}
  /* ---- 1: hộp có màu theo thể hiện (Lambert) ---- */
  const cap=Math.min(items.length,2600),im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({color:0xffffff}),cap);
  for(let i=0;i<cap;i++){const it=items[i];_p.set(it[0],it[1],it[2]);_s.set(it[3],it[4],it[5]);_q.setFromEuler(_e.set(0,0,it[7]));im.setMatrixAt(i,_m.compose(_p,_q,_s));im.setColorAt(i,_c.setHex(it[6]))}
  im.frustumCulled=false;im.castShadow=false;g.add(im);g.userData.portItems=cap;g.userData.portInfo=info;
  /* ---- 2: đầu đèn phát sáng (+ ngọn hải đăng) ---- */
  const hn=lamps.length+(z.extra==='lighthouse'?1:0),hm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffffff}),hn);
  lamps.forEach((l,i)=>{_p.set(l[0],l[1],l[2]);_s.set(.9,.3,.9);hm.setMatrixAt(i,_m.compose(_p,_q.identity(),_s));hm.setColorAt(i,_c.setHex(z.lamps.color))});
  if(z.extra==='lighthouse'){_p.set(-62,44,-62);_s.set(4,3,4);hm.setMatrixAt(lamps.length,_m.compose(_p,_q.identity(),_s));hm.setColorAt(lamps.length,_c.setHex(0xffe9a8))}
  hm.frustumCulled=false;g.add(hm);
  /* ---- 3: vệt sáng đèn trên sàn (cộng sáng) ---- */
  const pg=new THREE.CircleGeometry(5,20);pg.rotateX(-Math.PI/2);
  const pm=new THREE.InstancedMesh(pg,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false}),pools.length);
  pools.forEach((p,i)=>{_p.set(p[0],.05,p[1]);_s.set(1,1,1);pm.setMatrixAt(i,_m.compose(_p,_q.identity(),_s));pm.setColorAt(i,_c.setHex(z.lamps.color))});
  pm.frustumCulled=false;g.add(pm);
  /* ---- 4: chùm sáng hải đăng quét ---- */
  beam=null;
  if(z.extra==='lighthouse'){
    const bg=new THREE.BoxGeometry(110,2.2,2.2);bg.translate(55,0,0);
    beam=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:0xffe9a8,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));
    beam.position.set(-62,44,-62);beam.frustumCulled=false;g.add(beam)}}
{const DECO=API.DECO,SKY=API.SKY;
  for(let i=0;i<6;i++)DECO[i]=(g,th,R)=>dress(g,th,R,i);
  const SK=[[46,80,130,5,22],[54,80,130,5,24],[30,90,135,8,26],[40,80,130,6,20],[34,85,135,6,22],[36,85,135,6,24]];
  for(let i=0;i<6;i++)SKY[i]=SK[i]}
/* chùm sáng hải đăng quay */
let lt=performance.now();
(function spin(){requestAnimationFrame(spin);const n=performance.now(),dt=Math.min(.1,(n-lt)/1000);lt=n;if(beam&&beam.parent&&beam.parent.visible)beam.rotation.y+=dt*.9})();
/* nền menu dựng lại với bối cảnh cảng */
try{buildMenu()}catch(e){}                                  /* thẻ chọn ải hiện tên khu mới */
try{buildArena(STAGES[0],0)}catch(e){console.warn('[WS port] dựng lại nền menu lỗi:',e)}

window.WSPort={D,validate,usingFallback:false,errors:[],planStacks,zone:i=>D.zones[i],orig:ORIG,get beam(){return beam},
  stats(){let n=0;for(const c of COVERS)if(c.port)n++;return{stacks:n}}};
console.log('[WS port] đã nạp: 6 khu cảng container');
})();
