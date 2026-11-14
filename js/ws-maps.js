/* =====================================================================
   WORD STRIKE 3D – BẢN ĐỒ TƯƠNG TÁC CHO CẢ 6 ẢI
   Chung cho mọi ải: sàn cao + dốc + bệ nhảy · thùng phá được · trạm trả lời + trụ súng
   · chữ cái ghép từ (từ lấy từ ngân hàng của cấp độ đang chơi) · sự kiện mỗi wave.
   Cơ chế RIÊNG mỗi ải:
     Ải 2 Cyber Docks   : băng chuyền đẩy người/quái + container di động làm chỗ nấp động
     Ải 3 Sky Lab       : vùng trọng lực thấp (nhảy cao) + cổng dịch chuyển hai đầu bản đồ
     Ải 4 Frozen Archive: sàn băng trơn trượt + kệ sách đổ khi bị bắn, chặn đường quái
     Ải 5 Glitch Core   : ô sàn glitch biến mất/hiện lại + bức tường laser quét ngang (nhảy qua)
     Ải 6 Grammar Throne: sàn băng + trọng lực thấp + sàn Boss sụp từng mảng theo giai đoạn Boss
   Nạp SAU ws-extras.js (dùng window.WSX_API). File lỗi thì game vẫn chạy như cũ.
   Số liệu: MAP (mặc định chung, tên kết thúc bằng Cfg là tham số cơ chế) và STAGE_MAPS (bố cục từng ải).
   Hiệu năng: mọi vật động dùng chung 3 InstancedMesh (hộp · đĩa · trạm) → không thêm draw call.
   Đồ hoạ Thấp/Siêu nhẹ: tắt phần trang trí (vùng nhịp nhạc, biển neon) nhưng VẪN giữ mọi tương tác.
   ===================================================================== */
'use strict';
(function(){
if(typeof S==='undefined'||typeof THREE==='undefined'||!window.WSX_API||typeof buildArena!=='function'||typeof blocked!=='function'){
  console.warn('[WS maps] game chưa sẵn sàng – bỏ qua');return}
const API=window.WSX_API;

/* ===================== CẤU HÌNH CHUNG ===================== */
const MAP={
  step:.7,                                   /* bước chân tối đa leo được (m) */
  padVy:13, padRadius:1.3, padCooldown:.6,   /* bệ nhảy: bật lên ≈ 4,7 m (sàn cao 3 m) */
  crates:{max:6,hp:2,coinChance:.55,coin:15,potionHp:25,pickRadius:1.5},
  terminal:{range:3.2,turretSec:15,fireEvery:1.1,turretRange:40},
  letters:{pickRadius:1.6,chestCoins:120,maxToCollect:8,shortest:6},   /* từ dài hơn maxToCollect chữ được tặng sẵn các chữ đầu */
  events:{delay:[8,14],blackoutSec:10,meteors:5,meteorGap:.9,warnSec:1.5,radius:2.6,dmg:15,blackoutLight:.06},
  beatZones:6,
  conveyorSpeed:3.5,                         /* Ải 2: m/s đẩy người/quái trên băng chuyền */
  lowGravity:.35, portalRadius:1.6, portalCooldown:1.5,   /* Ải 3: trọng lực còn 35% → nhảy cao ≈ 2,9 m; cổng dịch chuyển */
  iceCfg:{gain:.06},                         /* Ải 4: càng nhỏ càng trơn */
  shelfCfg:{L:4.6,T:.9,H:3.5,fall:.6},       /* kệ sách dài×dày×cao; đổ xuống thành tường cao T (nhảy qua được) */
  glitchCfg:{size:6,n:4,period:2.4,warn:.8,grace:4,dmg:10},   /* Ải 5: ô glitch, grace = giây đầu ải chưa có hố */
  laserCfg:{speed:4.5,h:.6,th:.35,dmg:10,cool:1.2},           /* Ải 5: tường laser cao h (nhảy qua) */
  collapseCfg:{perHit:2,maxTiles:6,warn:1.5,dmg:12}           /* Ải 6: số ô sụp mỗi lần Boss mất 1 khiên */
};
const CAND0=[[-4,-12],[6,-8],[12,-18],[-14,8],[-20,18],[2,18],[26,-4],[-26,2],[8,26],[-10,-4],[16,-6],[-24,-6],[0,10],[14,24],[-22,-20],[21,17],[-20,-22],[22,24]];
const BEAT0=[[-2,-4],[8,-12],[-12,14],[12,2],[-20,4],[2,22]];
/* bố cục từng ải (chỉ số 0..5) */
const STAGE_MAPS=[
 /* 0 Neon Plaza: 2 sàn cao, 2 dốc, 2 bệ nhảy, 2 trạm */
 {decks:[{x0:-27,x1:-15,z0:-27,z1:-13,h:3},{x0:15,x1:27,z0:11,z1:27,h:3}],
  ramps:[{lowX:-7,dir:-1,len:8,zc:-21,w:3,h:3},{lowX:7,dir:1,len:8,zc:18,w:3,h:3}],
  pads:[{x:-21,z:-10.5},{x:21,z:8.5}],
  stations:[{x:-9,z:5,tx:-5.8,tz:5},{x:21,z:22,tx:24,tz:22}],cand:CAND0,beat:BEAT0},
 /* 1 Cyber Docks: băng chuyền + container di động */
 {decks:[{x0:15,x1:27,z0:-27,z1:-14,h:3}],ramps:[{lowX:7,dir:1,len:8,zc:-20.5,w:3,h:3}],pads:[{x:21,z:-10.5}],
  stations:[{x:-8,z:14,tx:-4.8,tz:14}],cand:CAND0,beat:BEAT0,
  conveyors:[{x0:-13,x1:13,z0:-8,z1:-5,dx:1,dz:0},{x0:-13,x1:13,z0:4,z1:7,dx:-1,dz:0},{x0:-26,x1:-22,z0:-18,z1:4,dx:0,dz:1}],
  movers:[{x:-15,z:-13.5,hx:2.6,hz:1.4,h:2.6,ax:'x',min:-23,max:-5,speed:2.8,ph:0},{x:12,z:12,hx:1.4,hz:2.6,h:2.6,ax:'z',min:3,max:22,speed:2.4,ph:1}]},
 /* 2 Sky Lab: trọng lực thấp + cổng dịch chuyển */
 {decks:[{x0:-27,x1:-15,z0:11,z1:27,h:3}],ramps:[{lowX:-7,dir:-1,len:8,zc:18,w:3,h:3}],pads:[{x:-21,z:8.5}],
  stations:[{x:6,z:-12,tx:9.2,tz:-12}],cand:CAND0,beat:BEAT0,
  lowg:[{x:-12,z:-10,r:8},{x:14,z:8,r:8}],portals:[{x:-26,z:-2},{x:26,z:2}]},
 /* 3 Frozen Archive: sàn băng + kệ sách đổ */
 {decks:[{x0:-27,x1:-15,z0:-27,z1:-14,h:3}],ramps:[{lowX:-7,dir:-1,len:8,zc:-20.5,w:3,h:3}],pads:[{x:-21,z:-10.5}],
  stations:[{x:12,z:-14,tx:15.2,tz:-14}],cand:CAND0,beat:BEAT0,
  ice:[{x:0,z:0,r:11},{x:-17,z:15,r:7},{x:18,z:-8,r:7}],
  shelves:[{x:-9,z:-3,ax:'z'},{x:9,z:3,ax:'z'},{x:3,z:-10,ax:'x'},{x:-3,z:10,ax:'x'}]},
 /* 4 Glitch Core: ô sàn glitch + tường laser */
 {decks:[{x0:15,x1:27,z0:-27,z1:-14,h:3}],ramps:[{lowX:7,dir:1,len:8,zc:-20.5,w:3,h:3}],pads:[{x:21,z:-10.5}],
  stations:[{x:-14,z:16,tx:-10.8,tz:16}],cand:CAND0,beat:BEAT0,
  glitch:{x0:-12,z0:-12},laser:{}},
 /* 5 Grammar Throne: tổng hợp + sàn Boss sụp từng mảng (lưới 3×3 ô 8 m, ô giữa không bao giờ sụp) */
 {decks:[{x0:-27,x1:-15,z0:11,z1:27,h:3}],ramps:[{lowX:-7,dir:-1,len:8,zc:18,w:3,h:3}],pads:[{x:-21,z:8.5}],
  stations:[{x:14,z:-14,tx:17.2,tz:-14}],cand:CAND0,beat:BEAT0,
  ice:[{x:16,z:14,r:6}],lowg:[{x:-14,z:-14,r:7}],collapse:{x0:-12,z0:-12,n:3,size:8}}
];
const ARR_KEYS=['decks','ramps','pads','stations','cand','beat','conveyors','movers','lowg','portals','ice','shelves'],OBJ_KEYS=['glitch','laser','collapse'];
function applyStage(idx){
  const c=STAGE_MAPS[idx]||{};
  ARR_KEYS.forEach(k=>{MAP[k]=c[k]||[]});OBJ_KEYS.forEach(k=>{MAP[k]=c[k]||null});MAP.stageIdx=idx}

/* ===================== TRẠNG THÁI ===================== */
let mapOn=false,curFeet=0,shotId=0;
let crates=[],pickups=[],letters=[],word=null,wordMeaning='',slots=[],chest=null;
let stations=[],turret={t:0,fire:0,si:-1},ev={type:null,t:0,timer:0,done:false,meteors:[],saved:null};
let boxesIM=null,discsIM=null,stationIM=null,lettersPts=null,arenaRef=null,proxies=[],padCool=0;
/* cơ chế riêng */
let belts=[],movers=[],shelves=[],lowg=[],portals=[],ice=[],tiles=[],laser=null,dyn=[],dynProxies=[];
let iceV={x:0,z:0},portalCool=0,laserCool=0,fallCool=0,lastSafe={x:0,z:0,y:1.7},safeT=0,graceT=0,collapsed=0,tClock=0;
let nextBox=21,nextDisc=13;
const BOXCAP=120,DISCCAP=24;
const isHigh=()=>qLevel==='high';
const rr=(a,b)=>a+Math.random()*(b-a);
const _tmp=new THREE.Object3D(),_col=new THREE.Color();
const _m1=new THREE.Matrix4(),_mw=new THREE.Matrix4();

/* ===================== ĐỘ CAO SÀN / VA CHẠM ===================== */
const inRect=(r,x,z,m)=>x>r.x0-m&&x<r.x1+m&&z>r.z0-m&&z<r.z1+m;
const rampRect=r=>({x0:Math.min(r.lowX,r.lowX+r.dir*r.len),x1:Math.max(r.lowX,r.lowX+r.dir*r.len),z0:r.zc-r.w,z1:r.zc+r.w});
const rampH=(r,x)=>r.h*Math.min(1,Math.max(0,(x-r.lowX)*r.dir/r.len));
function floorY(x,z,feet){
  if(!mapOn)return 0;let best=0;
  for(const d of MAP.decks)if(inRect(d,x,z,0)&&d.h<=feet+MAP.step)best=Math.max(best,d.h);
  for(const r of MAP.ramps){if(!inRect(rampRect(r),x,z,0))continue;const h=rampH(r,x);if(h<=feet+MAP.step)best=Math.max(best,h)}
  return best}
window.wsFloorY=floorY;
function deckBlocked(x,z,r,feet){for(const d of MAP.decks)if(inRect(d,x,z,r)&&feet+MAP.step<d.h)return true;return false}
/* vật cản động (container, kệ sách): chặn người/quái thấp hơn đỉnh của nó */
function dynBlocked(x,z,r,feet){for(const d of dyn)if(d.on&&Math.abs(x-d.cx)<d.hx+r&&Math.abs(z-d.cz)<d.hz+r&&feet+MAP.step<d.h)return true;return false}
const _blocked=blocked;
blocked=function(x,z,r,fy){
  if(_blocked(x,z,r))return true;
  if(!mapOn)return false;const f=fy===undefined?curFeet:fy;
  return deckBlocked(x,z,r,f)||dynBlocked(x,z,r,f)};

const inCirc=(a,x,z)=>a.some(c=>Math.hypot(x-c.x,z-c.z)<c.r);
const inIce=(x,z)=>mapOn&&inCirc(ice,x,z);
const inLowG=(x,z)=>mapOn&&inCirc(lowg,x,z);
const beltAt=(x,z)=>belts.find(b=>x>b.x0&&x<b.x1&&z>b.z0&&z<b.z1);
const tileAt=(x,z,st)=>tiles.some(t=>t.state===st&&Math.abs(x-t.cx)<t.hs&&Math.abs(z-t.cz)<t.hs);
const holeAt=(x,z)=>tileAt(x,z,'hole'),warnAt=(x,z)=>tileAt(x,z,'warn');
const tryMove=(o,dx,dz,r,feet)=>{
  const nx=o.x+dx,nz=o.z+dz;
  if(!blocked(nx,o.z,r,feet))o.x=nx;
  if(!blocked(o.x,nz,r,feet))o.z=nz};
const _p3={x:0,z:0};

const _movePlayer=movePlayer;
movePlayer=function(dt){
  const p=yawObj.position;curFeet=p.y-1.7;
  const x0=p.x,z0=p.z,onG=curFeet-floorY(x0,z0,curFeet)<.05&&S.vy<=0;
  try{_movePlayer(dt)}finally{curFeet=0}
  if(!mapOn)return;
  const feet=p.y-1.7,dxIn=p.x-x0,dzIn=p.z-z0,idt=Math.max(dt,.001);
  /* băng trơn: giữ quán tính, đổi hướng chậm */
  if(onG&&inIce(x0,z0)){
    const k=Math.min(1,MAP.iceCfg.gain*dt*60);
    iceV.x+=(dxIn/idt-iceV.x)*k;iceV.z+=(dzIn/idt-iceV.z)*k;
    p.x=x0;p.z=z0;_p3.x=x0;_p3.z=z0;
    const nx=x0+iceV.x*dt,nz=z0+iceV.z*dt;
    if(!blocked(nx,z0,.4,feet))_p3.x=nx;else iceV.x=0;
    if(!blocked(_p3.x,nz,.4,feet))_p3.z=nz;else iceV.z=0;
    p.x=Math.max(-29.4,Math.min(29.4,_p3.x));p.z=Math.max(-29.4,Math.min(29.4,_p3.z))}
  else{iceV.x=dxIn/idt;iceV.z=dzIn/idt}
  /* băng chuyền */
  if(onG){const b=beltAt(p.x,p.z);if(b){_p3.x=p.x;_p3.z=p.z;tryMove(_p3,b.dx*MAP.conveyorSpeed*dt,b.dz*MAP.conveyorSpeed*dt,.4,feet);p.x=_p3.x;p.z=_p3.z}}
  /* trọng lực thấp: trong vùng, khi đang ở trên không thì trả lại phần trọng lực đã bị trừ */
  if(inLowG(p.x,p.z)&&feet-floorY(p.x,p.z,feet)>.02)S.vy+=18*dt*(1-MAP.lowGravity)};
const _updBot=updBot;
updBot=function(b,dt){
  if(!mapOn)return _updBot(b,dt);
  curFeet=b.position.y;try{_updBot(b,dt)}finally{curFeet=0}
  if(b.userData.dying)return;
  const bt=beltAt(b.position.x,b.position.z);
  if(bt&&b.position.y<.3){_p3.x=b.position.x;_p3.z=b.position.z;tryMove(_p3,bt.dx*MAP.conveyorSpeed*dt,bt.dz*MAP.conveyorSpeed*dt,.6,b.position.y);b.position.x=_p3.x;b.position.z=_p3.z}
  const t=floorY(b.position.x,b.position.z,b.position.y),d=t-b.position.y;b.position.y=Math.abs(d)<.02?t:b.position.y+d*Math.min(1,dt*12)};
/* quái đi vòng tới dốc khi người chơi đứng ở tầng cao */
window.wsSteer=function(b,dx,dz){
  if(!mapOn)return null;
  const pf=yawObj.position.y-1.7,bf=b.position.y;if(pf-bf<1.5)return null;
  let best=null,bd=1e9;
  for(const r of MAP.ramps){if(Math.abs(r.h-pf)>1.3)continue;const d=Math.hypot(b.position.x-r.lowX,b.position.z-r.zc);if(d<bd){bd=d;best=r}}
  if(!best)return null;
  const onRamp=inRect(rampRect(best),b.position.x,b.position.z,0)&&bf>.1||bd<2.3;
  const tx=onRamp?best.lowX+best.dir*(best.len+2.5):best.lowX,ex=tx-b.position.x,ez=best.zc-b.position.z,el=Math.hypot(ex,ez)||1;
  return[ex/el,ez/el]};

/* ===================== HÌNH HỌC ===================== */
function wedge(L,H,w){
  const A=[0,0,w],B=[L,H,w],C=[L,H,-w],D=[0,0,-w],E=[L,0,w],G=[L,H,-w],Hh=[L,0,-w],P=[L,0,-w],Q=[L,0,w];
  const tris=[[A,B,C],[A,C,D],[E,G,B],[E,Hh,G],[D,P,Q],[D,Q,A],[A,Q,B],[D,C,P]];
  const pos=[],idx=[];tris.forEach((t,i)=>{t.forEach(v=>pos.push(...v));idx.push(i*3,i*3+1,i*3+2)});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
const boxM=(w,h,d,x,y,z,mat,cs)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=!!cs;return m};

/* Gọi từ ws-extras.consolidateBase: gỡ khối che trùng chỗ, trả về mesh tĩnh cần GỘP */
API.preConsolidate=function(lb){
  mapOn=lb.idx>=0&&lb.idx<STAGE_MAPS.length;if(!mapOn)return[];
  applyStage(lb.idx);
  const th=lb.stg.th,res=[];
  MAP.decks.forEach(d=>res.push({...d,m:2.5}));MAP.pads.forEach(p=>res.push({x0:p.x-2.5,x1:p.x+2.5,z0:p.z-2.5,z1:p.z+2.5,m:0}));
  MAP.stations.forEach(s=>res.push({x0:Math.min(s.x,s.tx)-2,x1:Math.max(s.x,s.tx)+2,z0:s.z-2,z1:s.z+2,m:0}));
  MAP.ramps.forEach(r=>res.push({...rampRect(r),m:2}));
  MAP.conveyors.forEach(b=>res.push({x0:b.x0,x1:b.x1,z0:b.z0,z1:b.z1,m:1}));
  MAP.movers.forEach(m=>res.push(m.ax==='x'?{x0:m.min-m.hx,x1:m.max+m.hx,z0:m.z-m.hz,z1:m.z+m.hz,m:1}:{x0:m.x-m.hx,x1:m.x+m.hx,z0:m.min-m.hz,z1:m.max+m.hz,m:1}));
  MAP.portals.forEach(p=>res.push({x0:p.x-3,x1:p.x+3,z0:p.z-3,z1:p.z+3,m:0}));
  MAP.shelves.forEach(s=>res.push({x0:s.x-4,x1:s.x+4,z0:s.z-4,z1:s.z+4,m:0}));
  if(MAP.glitch){const g=MAP.glitch,span=MAP.glitchCfg.size*MAP.glitchCfg.n;res.push({x0:g.x0,x1:g.x0+span,z0:g.z0,z1:g.z0+span,m:0})}
  if(MAP.collapse){const c=MAP.collapse,span=c.size*c.n;res.push({x0:c.x0,x1:c.x0+span,z0:c.z0,z1:c.z0+span,m:0})}
  for(let i=COVERS.length-1;i>=0;i--){
    const c=COVERS[i],b=c.box;
    if(res.some(r=>b.max.x>r.x0-r.m&&b.min.x<r.x1+r.m&&b.max.z>r.z0-r.m&&b.min.z<r.z1+r.m)){
      const m=c.mesh;
      arena.children.filter(o=>o.geometry&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height===.12&&Math.abs(o.position.x-m.position.x)<.01&&Math.abs(o.position.z-m.position.z)<.01).forEach(o=>{arena.remove(o);o.geometry.dispose()});
      arena.remove(m);m.geometry.dispose();COVERS.splice(i,1)}}
  const body=lam(th.wall),top=lam(th.pal[0]),slope=lam(th.pal[1]),extra=[];
  for(const d of MAP.decks){const w=d.x1-d.x0,l=d.z1-d.z0,cx=(d.x0+d.x1)/2,cz=(d.z0+d.z1)/2;
    extra.push(boxM(w,d.h-.2,l,cx,(d.h-.2)/2,cz,body,false),boxM(w,.2,l,cx,d.h-.1,cz,top,true))}
  for(const r of MAP.ramps){const g=wedge(r.len,r.h,r.w),m=new THREE.Mesh(g,slope);m.position.set(r.lowX,0,r.zc);m.rotation.y=r.dir>0?0:Math.PI;m.castShadow=true;extra.push(m)}
  return extra};

/* ===================== DỰNG ĐỐI TƯỢNG ĐỘNG (sau khi gộp) ===================== */
const allocBox=n=>{const s=nextBox;nextBox+=n;if(nextBox>BOXCAP)throw new Error('hết ô hộp');return s};
const allocDisc=n=>{const s=nextDisc;nextDisc+=n;if(nextDisc>DISCCAP)throw new Error('hết ô đĩa');return s};
function addDyn(o){
  const d={on:true,...o},m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({visible:false}));
  m.visible=false;arena.add(m);dynProxies.push(m);d.proxy=m;dyn.push(d);return d}
function build(th){
  arenaRef=arena;proxies=[];dynProxies=[];crates=[];pickups=[];letters=[];chest=null;stations=[];turret={t:0,fire:0,si:-1};endEvent(true);
  belts=[];movers=[];shelves=[];lowg=[];portals=[];ice=[];tiles=[];laser=null;dyn=[];iceV={x:0,z:0};portalCool=0;laserCool=0;fallCool=0;collapsed=0;
  graceT=MAP.glitch?MAP.glitchCfg.grace:0;nextBox=21;nextDisc=13;
  const hid=new THREE.MeshBasicMaterial({visible:false});
  for(const d of MAP.decks){const m=boxM(d.x1-d.x0,d.h,d.z1-d.z0,(d.x0+d.x1)/2,d.h/2,(d.z0+d.z1)/2,hid,false);m.visible=false;arena.add(m);m.updateMatrixWorld();proxies.push(m)}
  for(const r of MAP.ramps){const m=new THREE.Mesh(wedge(r.len,r.h,r.w),hid);m.position.set(r.lowX,0,r.zc);m.rotation.y=r.dir>0?0:Math.PI;m.visible=false;arena.add(m);m.updateMatrixWorld();proxies.push(m)}
  /* 1 InstancedMesh hộp: thùng 0-5 · rương 6 · nhặt 7-14 · thiên thạch 15-20 · rồi các vật của cơ chế riêng */
  boxesIM=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({color:0xffffff}),BOXCAP);
  boxesIM.frustumCulled=false;boxesIM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for(let i=0;i<BOXCAP;i++){boxesIM.setColorAt(i,_col.setHex(0xffffff));_tmp.position.set(0,-99,0);_tmp.scale.setScalar(.001);_tmp.rotation.set(0,0,0);_tmp.updateMatrix();boxesIM.setMatrixAt(i,_tmp.matrix)}
  arena.add(boxesIM);
  /* 1 InstancedMesh đĩa phẳng: bệ nhảy 0-1 · vùng nhịp 2-7 · vòng thiên thạch 8-12 · vùng trọng lực/băng/cổng 13+ */
  const dg=new THREE.CircleGeometry(1,28);dg.rotateX(-Math.PI/2);
  discsIM=new THREE.InstancedMesh(dg,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.8,depthWrite:false,blending:THREE.AdditiveBlending}),DISCCAP);
  discsIM.frustumCulled=false;discsIM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for(let i=0;i<DISCCAP;i++){discsIM.setColorAt(i,_col.setHex(0x00e5ff));_tmp.position.set(0,-99,0);_tmp.scale.setScalar(.001);_tmp.updateMatrix();discsIM.setMatrixAt(i,_tmp.matrix)}
  arena.add(discsIM);
  /* trạm trả lời: kiosk + cột sáng + trụ súng gộp thành 1 geometry */
  const sg=[];const add=(w,h,d,x,y,z)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y,z);sg.push(g)};
  add(1.3,1.6,.9,0,.8,0);add(1.0,.5,.15,0,1.45,.5);add(.14,7,.14,0,3.5,0);
  const tg=new THREE.CylinderGeometry(.35,.45,2.2,10);tg.translate(3.2,1.1,0);sg.push(tg);add(1.2,.5,.5,3.2,2.45,0);
  stationIM=new THREE.InstancedMesh(API.mergeGeos(sg),new THREE.MeshBasicMaterial({color:0xffffff}),Math.max(1,MAP.stations.length));stationIM.frustumCulled=false;
  stationIM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);arena.add(stationIM);
  MAP.stations.forEach((s,i)=>{const y=floorY(s.x,s.z,9);stations.push({...s,y,ready:true,i});
    const ang=Math.atan2(-(s.tz-s.z),s.tx-s.x);
    _tmp.position.set(s.x,y,s.z);_tmp.rotation.set(0,ang,0);_tmp.scale.setScalar(1);_tmp.updateMatrix();stationIM.setMatrixAt(i,_tmp.matrix)});
  stationIM.instanceMatrix.needsUpdate=true;paintStations();
  discsIM.userData.bz=MAP.beat;
  buildMech();
  hudWord();newWord();spawnCrates();spawnLetterPoints();
}
/* ---- cơ chế riêng của từng ải ---- */
function buildMech(){
  const sc=(im,i,hex)=>im.setColorAt(i,_col.setHex(hex));
  /* Ải 2: băng chuyền (nền + 8 mũi tên chạy) và container di động (vật cản động) */
  belts=MAP.conveyors.map(b=>{const o={...b,L:b.dx?b.x1-b.x0:b.z1-b.z0,base:allocBox(1),arrows:allocBox(8)};sc(boxesIM,o.base,0x2a3a55);for(let i=0;i<8;i++)sc(boxesIM,o.arrows+i,0x00e5ff);return o});
  movers=MAP.movers.map(m=>{const d=addDyn({kind:'mover',cx:m.x,cz:m.z,hx:m.hx,hz:m.hz,h:m.h}),i=allocBox(1);sc(boxesIM,i,0xff7f50);return{...m,d,i,pos:m.ax==='x'?m.x:m.z}});
  /* Ải 3: vùng trọng lực thấp (đĩa tím) + cổng dịch chuyển (đĩa + cột sáng) */
  lowg=MAP.lowg.map(z=>{const i=allocDisc(1);sc(discsIM,i,0x7c5cff);return{...z,i}});
  portals=MAP.portals.map((p,k)=>{const i=allocDisc(1),bx=allocBox(1),hex=k?0xff6bd6:0x00e5ff;sc(discsIM,i,hex);sc(boxesIM,bx,hex);return{...p,i,bx,k}});
  /* Ải 4: sàn băng (đĩa xanh nhạt) + kệ sách */
  ice=MAP.ice.map(z=>{const i=allocDisc(1);sc(discsIM,i,0x8fd8ff);return{...z,i}});
  const {L,T,H}=MAP.shelfCfg;
  shelves=MAP.shelves.map((s,k)=>{
    const d=addDyn({kind:'shelf',cx:s.x,cz:s.z,hx:s.ax==='x'?L/2:T/2,hz:s.ax==='x'?T/2:L/2,h:H}),i=allocBox(1);sc(boxesIM,i,0xb5835a);d.proxy.userData.shelf=k;
    return{...s,d,i,state:'up',t:0,sg:1}});
  /* Ải 5: ô glitch + laser ; Ải 6: ô sụp (lưới ô vuông, mỗi ô 1 hộp phẳng) */
  const mkTiles=(x0,z0,n,size,kind)=>{for(let iz=0;iz<n;iz++)for(let ix=0;ix<n;ix++){const i=allocBox(1);sc(boxesIM,i,0x05050a);
    tiles.push({kind,ix,iz,i,idx:iz*n+ix,cx:x0+size*(ix+.5),cz:z0+size*(iz+.5),hs:size/2-.05,size,state:'solid',timer:0})}};
  if(MAP.glitch)mkTiles(MAP.glitch.x0,MAP.glitch.z0,MAP.glitchCfg.n,MAP.glitchCfg.size,'glitch');
  MAP.collapseOrder=[];
  if(MAP.collapse){const c=MAP.collapse;mkTiles(c.x0,c.z0,c.n,c.size,'collapse');
    const order=tiles.filter(t=>t.kind==='collapse'&&!(t.ix===1&&t.iz===1));
    for(let i=order.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[order[i],order[j]]=[order[j],order[i]]}
    MAP.collapseOrder=order}
  if(MAP.laser){const i=allocBox(1);sc(boxesIM,i,0xff2e2e);laser={i,z:-27,dir:1}}
  if(boxesIM.instanceColor)boxesIM.instanceColor.needsUpdate=true;if(discsIM.instanceColor)discsIM.instanceColor.needsUpdate=true}
function paintStations(){
  if(!stationIM)return;
  stations.forEach(s=>{const c=turret.t>0&&turret.si===s.i?0xffe14d:(s.ready?0x00e5ff:0xff4d6d);stationIM.setColorAt(s.i,_col.setHex(c))});
  if(stationIM.instanceColor)stationIM.instanceColor.needsUpdate=true}

/* ===================== THÙNG PHÁ ĐƯỢC ===================== */
const shuffle2=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const freeSpot=(x,z,y,m)=>{if(_blocked(x,z,m))return false;if(MAP.pads.some(p=>Math.hypot(p.x-x,p.z-z)<2.6))return false;if(stations.some(s=>Math.hypot(s.x-x,s.z-z)<3.2||Math.hypot(s.tx-x,s.tz-z)<2))return false;
  if(MAP.ramps.some(r=>inRect(rampRect(r),x,z,1)))return false;
  if(dynBlocked(x,z,m+.5,0))return false;
  if(portals.some(p=>Math.hypot(p.x-x,p.z-z)<3))return false;
  if(MAP.collapse&&tiles.some(t=>t.kind==='collapse'&&Math.abs(x-t.cx)<t.hs&&Math.abs(z-t.cz)<t.hs&&!(t.ix===1&&t.iz===1)))return false;   /* nơi sẽ sụp: không đặt đồ */
  return true};
function spawnCrates(){
  crates.forEach(c=>{if(c.proxy){arenaRef.remove(c.proxy)}});crates=[];
  const pf=yawObj.position,spots=shuffle2(MAP.cand).filter(p=>freeSpot(p[0],p[1],0,1)&&Math.hypot(p[0]-pf.x,p[1]-pf.z)>3).slice(0,MAP.crates.max);
  spots.forEach((p,i)=>{const y=floorY(p[0],p[1],9);
    const px=new THREE.Mesh(new THREE.BoxGeometry(1.3,1.3,1.3),new THREE.MeshBasicMaterial({visible:false}));px.position.set(p[0],y+.65,p[1]);px.visible=false;px.userData.crate=i;arenaRef.add(px);px.updateMatrixWorld();
    crates.push({i,x:p[0],y,z:p[1],hp:MAP.crates.hp,alive:true,lastShot:-1,hit:0,proxy:px})});
  rebuildHits()}
function hitCrate(i){
  const c=crates[i];if(!c||!c.alive||c.lastShot===shotId)return;c.lastShot=shotId;c.hp--;c.hit=.25;_v.set(c.x,c.y+.7,c.z);burst(_v,0xffc83d,6,3);
  if(c.hp>0)return;
  c.alive=false;arenaRef.remove(c.proxy);rebuildHits();burst(_v,0xffc83d,28,7);shock(_v,0xffc83d,4);SFX.boom();
  pickups.push({x:c.x,y:c.y,z:c.z,kind:Math.random()<MAP.crates.coinChance?'coin':'potion',t:0})}
/* kệ sách bị bắn trúng → đổ theo hướng đạn (vuông góc với trục dài), thành tường thấp chặn quái */
function hitShelf(i){
  const s=shelves[i];if(!s||s.state!=='up')return;
  const yaw=yawObj.rotation.y,dx=-Math.sin(yaw),dz=-Math.cos(yaw);
  s.sg=(s.ax==='x'?dz:dx)>=0?1:-1;s.state='fall';s.t=0;SFX.boom();API.shake(.25);_v.set(s.x,1.5,s.z);burst(_v,0xb5835a,14,5)}
function shelfCollider(s){
  const {L,T,H}=MAP.shelfCfg;
  if(s.state==='down'){const o=s.sg*(T/2+H/2);s.d.hx=s.ax==='x'?L/2:H/2;s.d.hz=s.ax==='x'?H/2:L/2;s.d.cx=s.ax==='x'?s.x:s.x+o;s.d.cz=s.ax==='x'?s.z+o:s.z;s.d.h=T}
  else{s.d.hx=s.ax==='x'?L/2:T/2;s.d.hz=s.ax==='x'?T/2:L/2;s.d.cx=s.x;s.d.cz=s.z;s.d.h=H}}
const _castFrom=castFrom;
castFrom=function(sx,sy,list){const r=_castFrom(sx,sy,list);if(mapOn&&r.length){const u=r[0].object.userData;if(u){if(u.crate!==undefined)hitCrate(u.crate);else if(u.shelf!==undefined)hitShelf(u.shelf)}}return r};
const _fire=fire;fire=function(){shotId++;return _fire()};
const _rebuildHits=rebuildHits;
rebuildHits=function(){_rebuildHits();if(mapOn){HIT_ALL=HIT_ALL.concat(proxies,dynProxies,crates.filter(c=>c.alive).map(c=>c.proxy))}};

/* ===================== CHỮ CÁI GHÉP TỪ + RƯƠNG ===================== */
const atlas=(()=>{const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');g.font="800 44px 'Baloo 2',Nunito,sans-serif";g.textAlign='center';g.textBaseline='middle';
  for(let i=0;i<26;i++){const x=(i%8)*64+32,y=((i/8)|0)*64+34;g.shadowColor='#00e5ff';g.shadowBlur=10;g.fillStyle='#fff';g.fillText(String.fromCharCode(65+i),x,y)}
  const t=new THREE.CanvasTexture(c);t.flipY=false;return t})();
/* mỗi ải một từ riêng (theo chỉ số ải) lấy từ ngân hàng "voice" của cấp độ đang chơi (TR) */
function newWord(){
  const pool=(TR.voice||[]).filter(w=>/^[a-z]{4,}$/i.test(w[0])).sort((a,b)=>a[0].length-b[0].length||(a[0]<b[0]?-1:1)).slice(0,MAP.letters.shortest);
  const w=pool.length?pool[(MAP.stageIdx|0)%pool.length]:['plaza','quảng trường'];
  word=w[0].toUpperCase();wordMeaning=w[1];
  const reveal=Math.max(0,word.length-MAP.letters.maxToCollect);
  slots=word.split('').map((c,i)=>i<reveal?c:'');hudWord()}
function spawnLetterPoints(){
  letters=[];const spots=shuffle2(MAP.cand).filter(p=>freeSpot(p[0],p[1],0,.8));
  word.split('').filter((c,i)=>!slots[i]).forEach((ch,i)=>{const p=spots[i%spots.length];letters.push({ch,x:p[0]+rr(-1,1),z:p[1]+rr(-1,1),y:floorY(p[0],p[1],9),ph:Math.random()*6})});
  buildLetterPoints()}
function buildLetterPoints(){
  if(lettersPts){arenaRef.remove(lettersPts);lettersPts.geometry.dispose();lettersPts=null}
  if(!letters.length)return;
  const pos=new Float32Array(letters.length*3),idx=new Float32Array(letters.length);letters.forEach((l,i)=>{idx[i]=l.ch.charCodeAt(0)-65});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aIdx',new THREE.BufferAttribute(idx,1));
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTex:{value:atlas},uScale:{value:360},uSize:{value:1.7}},
    vertexShader:'attribute float aIdx;varying float vI;uniform float uScale;uniform float uSize;void main(){vI=aIdx;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=uSize*uScale/-mv.z;gl_Position=projectionMatrix*mv;}',
    fragmentShader:'uniform sampler2D uTex;varying float vI;void main(){float c=mod(vI,8.);float r=floor(vI/8.);vec2 uv=vec2((c+gl_PointCoord.x)/8.,(r+gl_PointCoord.y)/4.);vec4 t=texture2D(uTex,uv);float d=length(gl_PointCoord-.5);float glow=smoothstep(.5,.0,d)*.45;gl_FragColor=vec4(vec3(.2,.9,1.)*glow+t.rgb,max(t.a,glow));}'});
  lettersPts=new THREE.Points(g,m);lettersPts.frustumCulled=false;arenaRef.add(lettersPts)}
function pickLetter(i){
  const l=letters[i];const k=slots.findIndex((s,j)=>!s&&word[j]===l.ch);if(k>=0)slots[k]=l.ch;letters.splice(i,1);buildLetterPoints();
  _v.set(l.x,l.y+1.2,l.z);burst(_v,0x00e5ff,14,5);SFX.ok();API.popup('🔤 '+l.ch,'#8fe3ff');hudWord();
  if(slots.every(Boolean))openChest()}
function openChest(){
  const p=yawObj.position,yaw=yawObj.rotation.y,x=p.x-Math.sin(yaw)*3,z=p.z-Math.cos(yaw)*3;
  const cx=Math.max(-28,Math.min(28,x)),cz=Math.max(-28,Math.min(28,z));
  chest={x:cx,z:cz,y:floorY(cx,cz,p.y-1.7),t:0,opened:false};banner('🎁 ĐỦ CHỮ: '+word,wordMeaning+' · rương thưởng xuất hiện!');SFX.wave()}
function chestOpen(){
  chest.opened=true;_v.set(chest.x,chest.y+1,chest.z);burst(_v,0xffd34d,60,10);shock(_v,0xffd34d,9);SFX.boom();API.shake(.4);
  API.addCoins(MAP.letters.chestCoins,_v.clone(),true);
  const C=window.__WSX&&window.__WSX.CONS;if(C){const c=C[Math.random()*C.length|0];API.X.inv[c.id]=Math.min(9,(API.X.inv[c.id]|0)+1);API.popup(c.icon+' +1 '+c.name,'#2ed573');API.save()}
  API.bookAdd(word,wordMeaning);toast('📒 Đã ghi "'+word+'" vào Sổ từ: '+wordMeaning,'ok',3500)}

/* ===================== HUD: CHỮ + TRỤ SÚNG, NÚT TƯƠNG TÁC ===================== */
const css=document.createElement('style');css.textContent=`
#xword{position:fixed;left:16px;top:176px;z-index:5;pointer-events:none;background:rgba(14,20,48,.72);border:1px solid var(--line);border-radius:14px;padding:8px 14px;font:800 14px Nunito;backdrop-filter:blur(6px);display:none;max-width:260px}
#xword .w{font:800 22px 'Baloo 2';letter-spacing:.18em;color:#8fe3ff}
#xword .t{color:#ffe14d}
body.touchui #xword{top:156px;left:10px;padding:5px 10px;font-size:12px;max-width:200px}body.touchui #xword .w{font-size:17px}
#xact{position:fixed;left:50%;bottom:158px;transform:translateX(-50%);z-index:8;display:none;pointer-events:auto;cursor:pointer;border:2px solid #00e5ff;background:rgba(8,20,44,.92);color:#fff;border-radius:14px;padding:8px 16px;font:800 15px Nunito;box-shadow:0 0 18px rgba(0,229,255,.5)}
body.touchui #xact{bottom:190px;font-size:17px;padding:10px 18px}
#xterm{z-index:21}
#xterm .q{font:800 clamp(18px,3vw,26px) 'Baloo 2';text-align:center;margin:10px 0 14px}`;
document.head.appendChild(css);
const hudAll=document.getElementById('hudAll');
const wordBox=document.createElement('div');wordBox.id='xword';hudAll.appendChild(wordBox);
const actBtn=document.createElement('button');actBtn.id='xact';document.body.appendChild(actBtn);
const termEl=document.createElement('div');termEl.id='xterm';termEl.className='ov hide';
termEl.innerHTML='<div class="card" style="max-width:640px"><div class="lbl" style="text-align:center;color:#8fe3ff">💬 TRẠM TRẢ LỜI · ĐÚNG → TRỤ SÚNG BẬT 15 GIÂY · SAI → KHOÁ TỚI WAVE SAU</div><div class="q" id="xtq"></div><div id="xto" class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))"></div><div id="xtr" style="text-align:center;font-weight:800;margin-top:12px;min-height:24px"></div><div class="row" style="justify-content:center;margin-top:8px"><button class="btn sec" id="xtx">Thoát</button></div></div>';
document.body.appendChild(termEl);
let _hw='';
const MECH_LABEL=['','🚚 Băng chuyền đẩy người và quái · container cẩu di động','🌌 Vùng trọng lực thấp (nhảy cao) · cổng dịch chuyển','🧊 Sàn băng trơn · bắn kệ sách cho đổ chặn quái','⚡ Ô sàn glitch biến mất · laser quét (nhảy qua)','👑 Sàn Boss sụp từng mảng theo giai đoạn'];
function hudWord(){
  if(!mapOn||!S.running||S.ended){if(wordBox.style.display!=='none')wordBox.style.display='none';return}
  const t=turret.t>0?`<div class="t">🔫 Trụ súng: ${Math.ceil(turret.t)} giây</div>`:'';
  const evt=ev.type&&ev.t>0?`<div class="t">${ev.type==='blackout'?'⚡ MẤT ĐIỆN':'☄️ MƯA THIÊN THẠCH'}</div>`:'';
  const ml=MECH_LABEL[MAP.stageIdx|0]?`<div style="font-size:11px;color:var(--mut)">${MECH_LABEL[MAP.stageIdx|0]}</div>`:'';
  const html=`<div>🔤 TỪ CẦN GHÉP · ${esc(wordMeaning||'')}</div><div class="w">${slots.map(s=>s||'_').join(' ')}</div>${t}${evt}${ml}`;
  if(html!==_hw){_hw=html;wordBox.innerHTML=html}if(wordBox.style.display!=='block')wordBox.style.display='block'}

/* ===================== TRẠM TRẢ LỜI + TRỤ SÚNG ===================== */
function nearStation(){
  if(!mapOn||!S.running||S.paused||S.modal||S.ended)return null;
  const p=yawObj.position;let best=null,bd=1e9;
  for(const s of stations){const d=Math.hypot(p.x-s.x,p.z-s.z);if(d<MAP.terminal.range&&Math.abs(p.y-1.7-s.y)<2&&d<bd){bd=d;best=s}}
  return best}
function interact(){
  const s=nearStation();if(!s)return false;
  if(!s.ready){toast('🔒 Trạm đã khoá/đã dùng – mở lại ở wave sau','info',1600);return true}
  openTerminal(s);return true}
let termQ=null,termS=null;
function openTerminal(s){
  termS=s;S.modal=true;mouseHeld=false;if(document.pointerLockElement)document.exitPointerLock();
  termQ=makeQ('hard');document.getElementById('xtq').innerHTML=termQ.html(false);document.getElementById('xtr').textContent='';
  const o=document.getElementById('xto');o.innerHTML=termQ.choices.map((c,i)=>`<button class="btn sec xtopt" data-i="${i}">${String.fromCharCode(65+i)}. ${esc(c)}</button>`).join('');
  o.querySelectorAll('.xtopt').forEach(b=>b.onclick=()=>answerTerminal(termQ.choices[+b.dataset.i]));
  termEl.classList.remove('hide')}
function closeTerminal(){termEl.classList.add('hide');S.modal=false;termQ=null;try{lockReq()}catch(e){}}
function answerTerminal(pick){
  if(!termQ||termQ.done)return;termQ.done=true;const ok=termQ.isOk(pick),r=document.getElementById('xtr');
  termS.ready=false;
  if(ok){r.innerHTML='<span style="color:#2ed573">✔ Chính xác! Trụ súng bật '+MAP.terminal.turretSec+' giây. '+esc(termQ.explain||'')+'</span>';
    turret={t:MAP.terminal.turretSec,fire:.4,si:termS.i};SFX.ok();banner('🔫 TRỤ SÚNG BẬT','Tự bắn quái SAI trong '+MAP.terminal.turretSec+' giây')}
  else{r.innerHTML='<span style="color:#ff8a95">✖ Sai! Đáp án: <b>'+esc(termQ.ans||'')+'</b>. Trạm khoá tới wave sau.</span>';SFX.bad()}
  paintStations();setTimeout(closeTerminal,1300)}
document.getElementById('xtx').onclick=()=>{if(termS&&termQ&&!termQ.done)closeTerminal()};
actBtn.onclick=e=>{e.stopPropagation();interact()};
actBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();interact()},{passive:false});
addEventListener('keydown',e=>{if(e.code==='KeyF'&&!e.repeat&&nearStation()){e.stopImmediatePropagation();e.preventDefault();interact()}},true);
function turretTick(dt){
  if(turret.t<=0)return;turret.t-=dt;turret.fire-=dt;
  if(turret.t<=0){turret.si=-1;paintStations();return}
  if(turret.fire>0)return;turret.fire=MAP.terminal.fireEvery;
  const s=stations[turret.si],tx=s.tx,tz=s.tz,ty=s.y+2.5;let best=null,bd=MAP.terminal.turretRange;
  if(S.q)for(const b of BOTS){if(b.userData.dying)continue;if(S.q.isOk(b.userData.word))continue;const d=Math.hypot(b.position.x-tx,b.position.z-tz);if(d<bd){bd=d;best=b}}
  if(!best)return;
  _v.set(tx,ty,tz);_v2.set(best.position.x,best.position.y+1.3,best.position.z);tracer(_v,_v2,0xffe14d,.2);burst(_v2,0xffe14d,12,5);SFX.blaster();killBot(best,false)}

/* ===================== SỰ KIỆN MỖI WAVE ===================== */
function startEvent(type){
  ev.type=type;ev.done=true;
  if(type==='blackout'){ev.t=MAP.events.blackoutSec;ev.saved=[hemi.intensity,sun.intensity];hemi.intensity=MAP.events.blackoutLight;sun.intensity=MAP.events.blackoutLight;
    banner('⚡ MẤT ĐIỆN','Chỉ nhãn chữ còn sáng · '+MAP.events.blackoutSec+' giây')}
  else{const n=MAP.events.meteors,p=yawObj.position;ev.meteors=[];
    for(let i=0;i<n;i++){const a=Math.random()*6.28,r=rr(0,i%2?6:1.5);ev.meteors.push({x:Math.max(-28,Math.min(28,p.x+Math.cos(a)*r)),z:Math.max(-28,Math.min(28,p.z+Math.sin(a)*r)),t0:i*MAP.events.meteorGap,done:false})}
    ev.t=n*MAP.events.meteorGap+MAP.events.warnSec+.5;ev.age=0;banner('☄️ MƯA THIÊN THẠCH','Tránh vòng đỏ trên sàn!')}
  SFX.wave()}
function endEvent(hard){
  if(ev.type==='blackout'&&ev.saved){hemi.intensity=ev.saved[0];sun.intensity=ev.saved[1]}
  ev.saved=null;ev.type=null;ev.t=0;ev.meteors=[];if(hard){ev.timer=0;ev.done=false}}
function eventTick(dt){
  if(!ev.done&&ev.timer>0&&!S.boss){ev.timer-=dt;if(ev.timer<=0)startEvent(Math.random()<.5?'blackout':'meteor')}
  if(!ev.type)return;ev.t-=dt;
  if(ev.type==='meteor'){ev.age+=dt;const w=MAP.events.warnSec;
    for(const m of ev.meteors){if(m.done)continue;const a=ev.age-m.t0;if(a<w)continue;m.done=true;
      const y=floorY(m.x,m.z,9);_v.set(m.x,y+.5,m.z);burst(_v,0xff7f50,36,9);shock(_v,0xff4d4d,7);SFX.boom();API.shake(.35);
      const p=yawObj.position;if(Math.hypot(p.x-m.x,p.z-m.z)<MAP.events.radius&&Math.abs(p.y-1.7-y)<2.5){hurt(MAP.events.dmg);API.popup('☄️ -'+MAP.events.dmg,'#ff6b81')}}}
  if(ev.t<=0)endEvent(false)}
const _startWave=startWave;
startWave=function(){_startWave();if(!mapOn)return;
  stations.forEach(s=>{s.ready=true});turret={t:0,fire:0,si:-1};paintStations();spawnCrates();
  endEvent(true);ev.timer=rr(MAP.events.delay[0],MAP.events.delay[1])};
const _endStage=endStage;endStage=function(w){endEvent(true);return _endStage(w)};
const _toMenu=toMenu;toMenu=function(){endEvent(true);return _toMenu()};

/* ===================== CƠ CHẾ RIÊNG: CẬP NHẬT MỖI KHUNG ===================== */
const pingpong=(x,L)=>{const m=((x%(2*L))+2*L)%(2*L);return L-Math.abs(m-L)};
function collapseNext(n){
  let k=0;
  for(const tl of (MAP.collapseOrder||[])){if(k>=n)break;if(tl.state!=='solid')continue;tl.state='warn';tl.timer=MAP.collapseCfg.warn;k++;collapsed++}
  if(k){banner('👑 SÀN SỤP','Các ô sàn đang nứt – tránh xa!');SFX.boom();API.shake(.3)}}
function mechTick(dt,t,live){
  const p=yawObj.position,feet=p.y-1.7;
  /* container di động: ping-pong theo thời gian; đẩy người chơi khỏi đường đi của nó */
  for(const m of movers){
    const L=m.max-m.min,pos=m.min+pingpong(t*m.speed+m.ph*L/2,L),old=m.pos;m.pos=pos;
    const dx=m.ax==='x'?pos-old:0,dz=m.ax==='z'?pos-old:0;
    if(m.ax==='x')m.d.cx=pos;else m.d.cz=pos;
    if(live&&feet<m.h-.3&&Math.abs(p.x-m.d.cx)<m.hx+.4&&Math.abs(p.z-m.d.cz)<m.hz+.4){p.x+=dx*1.6;p.z+=dz*1.6}}
  /* kệ sách đang đổ */
  for(const s of shelves)if(s.state==='fall'){s.t+=dt;if(s.t>=MAP.shelfCfg.fall){s.state='down';shelfCollider(s)}}
  /* ô glitch: chu kỳ cố định; 3 ô trong 4 luôn đứng được; giây đầu ải chưa có hố */
  if(MAP.glitch){
    if(live)graceT=Math.max(0,graceT-dt);
    const G=MAP.glitchCfg,gb=Math.floor(t/G.period),f=(t/G.period)%1;
    for(const tl of tiles){if(tl.kind!=='glitch')continue;
      tl.state=graceT>0?'solid':(((gb+tl.idx)%4===0)?'hole':((((gb+1)+tl.idx)%4===0&&f>1-G.warn/G.period)?'warn':'solid'))}}
  /* ô sụp (Ải 6): nứt rồi thành hố; số ô theo số khiên Boss đã mất */
  if(MAP.collapse){
    for(const tl of tiles){if(tl.kind==='collapse'&&tl.state==='warn'){tl.timer-=dt;if(tl.timer<=0)tl.state='hole'}}
    if(live&&S.boss&&BOSS){const want=Math.min(MAP.collapseCfg.maxTiles,Math.max(0,(bossQ()-BOSS.userData.hp)*MAP.collapseCfg.perHit));if(want>collapsed)collapseNext(want-collapsed)}}
  /* laser quét ngang (Ải 5): nhảy qua được vì chỉ cao laserCfg.h */
  if(laser&&live){const C=MAP.laserCfg;laser.z+=laser.dir*C.speed*dt;if(laser.z>27){laser.z=27;laser.dir=-1}if(laser.z<-27){laser.z=-27;laser.dir=1}
    laserCool=Math.max(0,laserCool-dt);
    if(laserCool<=0&&feet<C.h&&Math.abs(p.z-laser.z)<C.th/2+.35){hurt(C.dmg);laserCool=C.cool;API.popup('⚡ -'+C.dmg+' (nhảy qua!)','#ff6b81');API.shake(.3)}}
  if(!live)return;
  /* rơi xuống hố (ô glitch / ô sụp) → về chỗ an toàn gần nhất, mất máu */
  fallCool=Math.max(0,fallCool-dt);safeT-=dt;
  const grounded=feet-floorY(p.x,p.z,feet)<.12&&S.vy<=0;
  if(grounded&&holeAt(p.x,p.z)&&fallCool<=0){
    const dmg=MAP.collapse?MAP.collapseCfg.dmg:MAP.glitchCfg.dmg;fallCool=1.5;p.x=lastSafe.x;p.z=lastSafe.z;p.y=lastSafe.y;S.vy=0;iceV.x=iceV.z=0;
    _v.set(p.x,p.y,p.z);burst(_v,0xff2e63,24,6);API.popup('🕳️ Rơi xuống hố! -'+dmg,'#ff6b81');hurt(dmg)}
  else if(grounded&&safeT<=0&&!holeAt(p.x,p.z)&&!warnAt(p.x,p.z)&&!beltAt(p.x,p.z)){safeT=.2;lastSafe={x:p.x,z:p.z,y:p.y}}
  /* cổng dịch chuyển (Ải 3): sang cổng kia, đặt người chơi cách cổng 3,2 m về phía giữa bản đồ */
  portalCool=Math.max(0,portalCool-dt);
  if(portals.length===2&&portalCool<=0)for(const pt of portals){
    if(Math.hypot(p.x-pt.x,p.z-pt.z)<MAP.portalRadius&&feet<1.2){const o=portals[1-pt.k],d=Math.hypot(o.x,o.z)||1;
      _v.set(pt.x,feet+1,pt.z);burst(_v,pt.k?0xff6bd6:0x00e5ff,26,6);
      p.x=o.x-o.x/d*3.2;p.z=o.z-o.z/d*3.2;p.y=1.7+floorY(p.x,p.z,0);S.vy=0;portalCool=MAP.portalCooldown;iceV.x=iceV.z=0;
      _v.set(p.x,p.y,p.z);burst(_v,o.k?0xff6bd6:0x00e5ff,26,6);SFX.skill();API.popup('🌀 Dịch chuyển','#8fe3ff');break}}}

/* ===================== VÒNG CẬP NHẬT ===================== */
const dropC={coin:0xffd34d,potion:0x2ed573};
let _lt=performance.now();
(function mloop(){
  requestAnimationFrame(mloop);
  const now=performance.now(),dt=Math.min(.1,(now-_lt)/1000);_lt=now;
  if(!mapOn||!boxesIM||!arenaRef||boxesIM.parent!==arenaRef){hudWord();actBtn.style.display='none';return}
  const live=S.running&&!S.paused&&!S.modal&&!S.ended;
  if(live)tClock+=dt;const t=tClock;   /* đồng hồ cơ chế chỉ chạy khi đang chơi (tạm dừng thì cơ chế dừng) */
  const p=yawObj.position;
  if(live){
    padCool=Math.max(0,padCool-dt);
    const feet=p.y-1.7,ground=feet-floorY(p.x,p.z,feet)<.08&&S.vy<=0;
    if(ground&&padCool<=0)for(const pd of MAP.pads)if(Math.hypot(p.x-pd.x,p.z-pd.z)<MAP.padRadius&&feet<.5){S.vy=MAP.padVy;padCool=MAP.padCooldown;_v.set(pd.x,.3,pd.z);burst(_v,0x00e5ff,22,6);SFX.skill();break}
    for(let i=letters.length-1;i>=0;i--){const l=letters[i];if(Math.hypot(p.x-l.x,p.z-l.z)<MAP.letters.pickRadius&&Math.abs(feet-l.y)<2.4)pickLetter(i)}
    for(let i=pickups.length-1;i>=0;i--){const k=pickups[i];if(Math.hypot(p.x-k.x,p.z-k.z)<MAP.crates.pickRadius&&Math.abs(feet-k.y)<2.4){
      _v.set(k.x,k.y+.8,k.z);if(k.kind==='coin'){API.addCoins(MAP.crates.coin,_v.clone())}else{S.hp=Math.min(S.maxHp,S.hp+MAP.crates.potionHp);S.hudDirty=true;API.popup('🧪 +'+MAP.crates.potionHp+' HP','#2ed573',_v.clone())}
      SFX.ok();burst(_v,dropC[k.kind],10,4);pickups.splice(i,1)}}
    if(chest){chest.t+=dt;if(!chest.opened&&chest.t>1.2)chestOpen();if(chest.opened&&chest.t>3.2)chest=null}
    turretTick(dt);eventTick(dt)}
  mechTick(live?dt:0,t,live);
  /* hộp */
  const setBox=(i,x,y,z,sx,sy,sz,rot,color)=>{_tmp.position.set(x,y,z);_tmp.rotation.set(0,rot||0,0);_tmp.scale.set(sx,sy,sz);_tmp.updateMatrix();boxesIM.setMatrixAt(i,_tmp.matrix);if(color!==undefined)boxesIM.setColorAt(i,_col.setHex(color))};
  const hideBox=i=>setBox(i,0,-99,0,.001,.001,.001);
  for(let i=0;i<6;i++){const c=crates[i];if(c&&c.alive){c.hit=Math.max(0,c.hit-dt);const s=1.2+c.hit*.6;setBox(i,c.x,c.y+s/2,c.z,s,s,s,c.hit>0?Math.sin(t*60)*.1:0,c.hp<MAP.crates.hp?0xd98c3a:0xffb84d)}else hideBox(i)}
  if(chest){const o=chest.opened?Math.min(1,(chest.t-1.2)*2):0;setBox(6,chest.x,chest.y+.55,chest.z,1.5,1.1-o*.5,1.1,0,0xffd34d)}else hideBox(6);
  for(let i=0;i<8;i++){const k=pickups[i];if(k)setBox(7+i,k.x,k.y+.6+Math.sin(t*4+i)*.15,k.z,.5,.5,.5,t*2,dropC[k.kind]);else hideBox(7+i)}
  for(let i=0;i<6;i++){const m=ev.type==='meteor'?ev.meteors[i]:null;
    if(m&&!m.done){const a=ev.age-m.t0,w=MAP.events.warnSec;if(a>w-.35&&a<w){const f=(a-(w-.35))/.35,y=floorY(m.x,m.z,9);setBox(15+i,m.x,y+22*(1-f)+.6,m.z,1.4,1.4,1.4,t*8,0xff7f50);continue}}
    hideBox(15+i)}
  /* băng chuyền: nền + mũi tên chạy theo chiều đẩy */
  for(const b of belts){const w=b.x1-b.x0,d=b.z1-b.z0;setBox(b.base,(b.x0+b.x1)/2,.04,(b.z0+b.z1)/2,w,.08,d,0);
    for(let k=0;k<8;k++){const u=((k/8)+t*MAP.conveyorSpeed/b.L)%1;
      if(b.dx)setBox(b.arrows+k,b.dx>0?b.x0+u*w:b.x1-u*w,.1,(b.z0+b.z1)/2,.7,.05,d*.5,0);else setBox(b.arrows+k,(b.x0+b.x1)/2,.1,b.dz>0?b.z0+u*d:b.z1-u*d,w*.5,.05,.7,0)}}
  /* container di động */
  for(const m of movers){setBox(m.i,m.d.cx,m.h/2,m.d.cz,m.hx*2,m.h,m.hz*2,0);m.d.proxy.position.set(m.d.cx,m.h/2,m.d.cz);m.d.proxy.scale.set(m.hx*2,m.h,m.hz*2);m.d.proxy.updateMatrixWorld()}
  /* kệ sách: xoay quanh mép chân phía đổ */
  for(const s of shelves){
    const {L,T,H}=MAP.shelfCfg,a=s.state==='up'?0:(s.state==='down'?Math.PI/2:Math.min(1,s.t/MAP.shelfCfg.fall)*Math.PI/2),sg=s.sg;
    _mw.makeTranslation(s.x,0,s.z);
    _m1.makeRotationY(s.ax==='z'?Math.PI/2:0);_mw.multiply(_m1);
    _m1.makeTranslation(0,0,sg*T/2);_mw.multiply(_m1);
    _m1.makeRotationX(sg*a);_mw.multiply(_m1);
    _m1.makeTranslation(0,H/2,-sg*T/2);_mw.multiply(_m1);
    _m1.makeScale(L,H,T);_mw.multiply(_m1);
    boxesIM.setMatrixAt(s.i,_mw);
    s.d.proxy.position.set(s.d.cx,s.d.h/2,s.d.cz);s.d.proxy.scale.set(s.d.hx*2,s.d.h,s.d.hz*2);s.d.proxy.updateMatrixWorld()}
  /* tường laser */
  if(laser)setBox(laser.i,0,MAP.laserCfg.h/2,laser.z,56,MAP.laserCfg.h,MAP.laserCfg.th,0,Math.sin(t*30)>0?0xff2e2e:0xff7a7a);
  /* ô glitch / ô sụp: nứt (nhấp nháy) và hố (đen) */
  for(const tl of tiles){
    if(tl.state==='hole')setBox(tl.i,tl.cx,.05,tl.cz,tl.size-.1,.1,tl.size-.1,0,0x05050a);
    else if(tl.state==='warn')setBox(tl.i,tl.cx,.06,tl.cz,tl.size-.1,.1,tl.size-.1,0,Math.sin(t*22)>0?(tl.kind==='collapse'?0xff9f43:0xff2ea6):0x2a1030);
    else hideBox(tl.i)}
  for(const pt of portals)setBox(pt.bx,pt.x,3,pt.z,.5,6,.5,t,pt.k?0xff6bd6:0x00e5ff);
  boxesIM.instanceMatrix.needsUpdate=true;if(boxesIM.instanceColor)boxesIM.instanceColor.needsUpdate=true;
  /* đĩa: bệ nhảy · vùng nhịp nhạc (chỉ Cao) · vòng báo thiên thạch · trọng lực · băng · cổng */
  const beat=API.beat();
  MAP.pads.forEach((pd,i)=>{const y=floorY(pd.x,pd.z,0);_tmp.position.set(pd.x,y+.06,pd.z);_tmp.rotation.set(0,0,0);_tmp.scale.setScalar(MAP.padRadius*(1+Math.sin(t*5)*.06));_tmp.updateMatrix();discsIM.setMatrixAt(i,_tmp.matrix)});
  for(let i=MAP.pads.length;i<2;i++){_tmp.position.set(0,-99,0);_tmp.scale.setScalar(.001);_tmp.updateMatrix();discsIM.setMatrixAt(i,_tmp.matrix)}
  const bz=discsIM.userData.bz||[],hi=isHigh();
  for(let i=0;i<MAP.beatZones;i++){const z=bz[i];if(z&&hi){_tmp.position.set(z[0],.04,z[1]);_tmp.scale.setScalar(2.2+beat*1.2);_tmp.updateMatrix();discsIM.setMatrixAt(2+i,_tmp.matrix);
      discsIM.setColorAt(2+i,_col.setHSL(((i*.17+t*.05)%1),1,.35+beat*.3))}else{_tmp.position.set(0,-99,0);_tmp.scale.setScalar(.001);_tmp.updateMatrix();discsIM.setMatrixAt(2+i,_tmp.matrix)}}
  for(let i=0;i<5;i++){const m=ev.type==='meteor'?ev.meteors[i]:null;
    if(m&&!m.done&&ev.age-m.t0>=0){const a=ev.age-m.t0,w=MAP.events.warnSec,y=floorY(m.x,m.z,9);_tmp.position.set(m.x,y+.08,m.z);_tmp.scale.setScalar(MAP.events.radius*(.55+.45*a/w));_tmp.updateMatrix();discsIM.setMatrixAt(8+i,_tmp.matrix);discsIM.setColorAt(8+i,_col.setHex(Math.sin(a*14)>0?0xff2e2e:0xff8a3d))}
    else{_tmp.position.set(0,-99,0);_tmp.scale.setScalar(.001);_tmp.updateMatrix();discsIM.setMatrixAt(8+i,_tmp.matrix)}}
  const zone=(z,y,pulse)=>{_tmp.position.set(z.x,y,z.z);_tmp.rotation.set(0,0,0);_tmp.scale.setScalar((z.r||MAP.portalRadius)*(1+pulse));_tmp.updateMatrix();discsIM.setMatrixAt(z.i,_tmp.matrix)};
  for(const z of lowg)zone(z,.05,Math.sin(t*2)*.03);
  for(const z of ice)zone(z,.03,0);
  for(const z of portals)zone(z,.08,Math.sin(t*6)*.08);
  discsIM.instanceMatrix.needsUpdate=true;if(discsIM.instanceColor)discsIM.instanceColor.needsUpdate=true;
  if(lettersPts){const pa=lettersPts.geometry.attributes.position.array;letters.forEach((l,i)=>{pa[i*3]=l.x;pa[i*3+1]=l.y+1.2+Math.sin(t*2.5+l.ph)*.25;pa[i*3+2]=l.z});lettersPts.geometry.attributes.position.needsUpdate=true;
    lettersPts.material.uniforms.uScale.value=renderer.domElement.height/2}
  const ns=nearStation();
  if(ns){actBtn.textContent=ns.ready?(isTouch?'💬 Trạm trả lời':'💬 Trạm trả lời · bấm F'):'🔒 Trạm đã khoá – chờ wave sau';if(actBtn.style.display!=='block')actBtn.style.display='block'}
  else if(actBtn.style.display!=='none')actBtn.style.display='none';
  hudWord()
})();

/* ===================== DỰNG LẠI KHI VÀO ẢI ===================== */
const _ba=buildArena;
buildArena=function(stg,idx){
  mapOn=idx>=0&&idx<STAGE_MAPS.length;_ba(stg,idx);   /* ws-extras gọi API.preConsolidate bên trong */
  if(mapOn){try{build(stg.th)}catch(e){console.warn('[WS maps] lỗi dựng bản đồ:',e);mapOn=false}}
  else{endEvent(true);boxesIM=discsIM=stationIM=lettersPts=null;crates=[];pickups=[];letters=[];proxies=[];dynProxies=[];dyn=[];hudWord()}
  rebuildHits()};

/* ===================== DÙNG CHO TEST ===================== */
window.WSMAP={MAP,STAGE_MAPS,on:()=>mapOn,floorY,blocked,inIce,inLowG,holeAt,beltAt,get crates(){return crates},get pickups(){return pickups},get letters(){return letters},get stations(){return stations},get slots(){return slots},
  get word(){return word},get turret(){return turret},get ev(){return ev},get chest(){return chest},runEvent:startEvent,interact,nearStation,answerTerminal,pickLetter,hitCrate,
  get shot(){return shotId},get termQ(){return termQ},get belts(){return belts},get movers(){return movers},get shelves(){return shelves},get tiles(){return tiles},get laser(){return laser},
  get portals(){return portals},get lowg(){return lowg},get ice(){return ice},get dyn(){return dyn},get iceV(){return iceV},hitShelf,collapseNext,get collapsed(){return collapsed},
  get graceT(){return graceT},set graceT(v){graceT=v},get clock(){return tClock}};
buildArena(STAGES[0],0);   /* dựng lại nền menu cùng bản đồ */
console.log('[WS maps] đã nạp: bản đồ tương tác 6 ải');
})();
