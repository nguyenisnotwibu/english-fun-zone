/* =====================================================================
   WORD STRIKE 3D – CHẾ ĐỘ MISSION (Giai đoạn 2 của "Saltline Ops"): Relay + Rút lui + Bộ đàm
   · Dữ liệu ở data/ws-relay.js (window.WS_RELAY); sai thì dùng mặc định + cảnh báo (#dataWarn).
   · MISSION: sửa 3–4 Relay (giữ E → trả lời câu hỏi) → tới điểm Rút lui → giữ vị trí 30 s khi quái tràn vào → qua ải.
     HOLDOUT: chế độ cũ (các đợt quái + Boss), không đổi.
   · Bộ đàm giao lệnh bằng tiếng Anh theo cấp độ (KIDS ngắn → IELTS dài) + phụ đề Việt bật/tắt; hướng và khoảng cách tính THẬT.
   · Quái "hostile": bắn trúng là hạ, không cần đáp án, không bị phạt. Thiết kế: design/quick-specs/saltline-relay-phase2-2026-11-15.md
   Nạp SAU ws-hud.js.
   ===================================================================== */
'use strict';
(function(){
if(typeof S==='undefined'||typeof THREE==='undefined'||!window.WSX_API||!window.WSHUD||typeof startStage!=='function'||typeof makeBot!=='function'||typeof onHitTarget!=='function'){
  console.warn('[WS relay] game chưa sẵn sàng – bỏ qua');return}
const API=window.WSX_API,HUD=window.WSHUD,$=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LVLS=['kids','toeic','ielts'],ROLES=['intro','relay','hold','ok','alarm','extract','extracting','done'];

/* ===================== KIỂM ĐỊNH DỮ LIỆU ===================== */
const DEF_LINE=(en,vi)=>[{en,vi}];
const DEF_LVL=()=>({intro:DEF_LINE('Restore every relay at {loc}.','Khôi phục mọi trạm ở {loc}.'),relay:DEF_LINE('Relay {n} is to the {dir}, {rel}.','Trạm số {n} ở {dir}, {rel}.'),hold:DEF_LINE('Hold E.','Giữ E.'),
  ok:DEF_LINE('Relay {n} is on.','Trạm số {n} đã bật.'),alarm:DEF_LINE('Wrong! Hostiles are coming.','Sai! Quái đang tới.'),extract:DEF_LINE('Go to the {dir}, {rel}. Hold for {sec} seconds.','Đi về {dir}, {rel}. Giữ {sec} giây.'),
  extracting:DEF_LINE('{sec} seconds left.','Còn {sec} giây.'),done:DEF_LINE('Mission complete.','Hoàn thành.')});
const DEF={version:1,defaultMode:'mission',relay:{counts:[3,3,3,4,4,4],range:3,holdSec:2,lockSec:15,coins:15,score:100,hp:10,revealDist:24},
  spots:[0,1,2,3,4,5].map(()=>[{x:-4,z:-26},{x:25,z:5},{x:-23,z:14},{x:12,z:24}]),
  extract:{points:[0,1,2,3,4,5].map(()=>({x:-18,z:20})),radius:6,holdSec:30,spawnEvery:2.6,maxHostile:8,coins:40},alarm:{hostiles:[3,3,4,4,5,5]},ambient:{startAfter:8,every:14,max:3},
  locations:[0,1,2,3,4,5].map(i=>({en:'SECTOR '+(i+1),sub:'PORT',vi:'Khu '+(i+1)})),
  radio:{callsign:'SALT CONTROL',dirs:{N:{en:'north',vi:'phía bắc'},NE:{en:'north-east',vi:'đông bắc'},E:{en:'east',vi:'phía đông'},SE:{en:'south-east',vi:'đông nam'},S:{en:'south',vi:'phía nam'},SW:{en:'south-west',vi:'tây nam'},W:{en:'west',vi:'phía tây'},NW:{en:'north-west',vi:'tây bắc'}},
    rels:{ahead:{en:'ahead of you',vi:'phía trước'},right:{en:'on your right',vi:'bên phải'},behind:{en:'behind you',vi:'phía sau'},left:{en:'on your left',vi:'bên trái'}},near:{near:{en:'near',vi:'gần'},far:{en:'far',vi:'xa'},nearDist:28},
    kids:DEF_LVL(),toeic:DEF_LVL(),ielts:DEF_LVL()}};
function validate(d){
  const errs=[],E=m=>errs.push(m),isN=v=>typeof v==='number'&&isFinite(v),rng=(o,k,lo,hi,int)=>{const v=o&&o[k];if(!isN(v)||v<lo||v>hi||(int&&!Number.isInteger(v)))E(k+' phải '+(int?'nguyên ':'')+'trong '+lo+'–'+hi+' (đang là '+v+')')};
  if(!d||typeof d!=='object'){E('thiếu window.WS_RELAY');return errs}
  if(d.defaultMode!=='mission'&&d.defaultMode!=='holdout')E('defaultMode phải là mission hoặc holdout');
  const r=d.relay||{};rng(r,'range',1.5,6);rng(r,'holdSec',.5,10);rng(r,'lockSec',3,60);rng(r,'coins',0,200,true);rng(r,'score',0,1000,true);rng(r,'hp',0,100,true);rng(r,'revealDist',8,60);
  if(!Array.isArray(r.counts)||r.counts.length!==6||!r.counts.every(n=>Number.isInteger(n)&&n>=2&&n<=5))E('relay.counts cần 6 số nguyên 2–5');
  if(!Array.isArray(d.spots)||d.spots.length!==6)E('spots cần 6 ải');
  else d.spots.forEach((L,i)=>{if(!Array.isArray(L)||!L.every(p=>p&&isN(p.x)&&isN(p.z)&&Math.abs(p.x)<=29&&Math.abs(p.z)<=29))E('spots['+i+'] cần các điểm {x,z} trong ±29');
    else if(Array.isArray(r.counts)&&L.length<r.counts[i])E('spots['+i+'] có '+L.length+' điểm, cần ≥ '+r.counts[i])});
  const x=d.extract||{};rng(x,'radius',3,12);rng(x,'holdSec',5,120);rng(x,'spawnEvery',.5,20);rng(x,'maxHostile',1,12,true);rng(x,'coins',0,300,true);
  if(!Array.isArray(x.points)||x.points.length!==6||!x.points.every(p=>p&&isN(p.x)&&isN(p.z)&&Math.abs(p.x)<=29&&Math.abs(p.z)<=29))E('extract.points cần 6 điểm {x,z} trong ±29');
  if(!d.alarm||!Array.isArray(d.alarm.hostiles)||d.alarm.hostiles.length!==6||!d.alarm.hostiles.every(n=>Number.isInteger(n)&&n>=1&&n<=8))E('alarm.hostiles cần 6 số nguyên 1–8');
  const a=d.ambient||{};rng(a,'startAfter',0,120);rng(a,'every',3,120);rng(a,'max',0,8,true);
  if(!Array.isArray(d.locations)||d.locations.length!==6||!d.locations.every(l=>l&&l.en&&l.sub&&l.vi))E('locations cần 6 mục {en,sub,vi}');
  const rd=d.radio;if(!rd||typeof rd!=='object'){E('thiếu radio');return errs}
  for(const k of ['N','NE','E','SE','S','SW','W','NW'])if(!rd.dirs||!rd.dirs[k]||!rd.dirs[k].en||!rd.dirs[k].vi)E('radio.dirs.'+k+' cần en+vi');
  for(const k of ['ahead','right','behind','left'])if(!rd.rels||!rd.rels[k]||!rd.rels[k].en||!rd.rels[k].vi)E('radio.rels.'+k+' cần en+vi');
  if(!rd.near||!rd.near.near||!rd.near.far||!isN(rd.near.nearDist))E('radio.near cần near, far, nearDist');
  for(const l of LVLS)for(const role of ROLES){const L=rd[l]&&rd[l][role];if(!Array.isArray(L)||!L.length||!L.every(m=>m&&typeof m.en==='string'&&m.en&&typeof m.vi==='string'&&m.vi))E('radio.'+l+'.'+role+' cần ≥ 1 mục {en,vi}')}
  return errs}
let D=window.WS_RELAY,errs=validate(D);
if(errs.length){console.warn('[WS relay] data/ws-relay.js lỗi – dùng mặc định:\n - '+errs.slice(0,8).join('\n - '));
  const w=$('dataWarn');if(w){w.textContent='⚠️ Dữ liệu chế độ Mission (data/ws-relay.js) có lỗi ('+errs.length+') – đang dùng giá trị mặc định. Chi tiết ở Console.';w.classList.remove('hide')}
  D=DEF}
const RD=D.radio,RC=D.relay;

/* ===================== CHẾ ĐỘ + PHỤ ĐỀ (lưu localStorage) ===================== */
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
let mode=ls.get('ws_mode');if(mode!=='mission'&&mode!=='holdout')mode=D.defaultMode;
let subOn=ls.get('ws_sub')!=='0';

/* ===================== CSS ===================== */
const css=document.createElement('style');
css.textContent=`#modeRow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:16px}
#modeRow .lbl{margin:0 6px 0 0}
.modeB{opacity:.7}.modeB.on{opacity:1;border-color:var(--acc);box-shadow:inset 0 -3px 0 var(--acc);color:var(--txt)}
#radio{background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--steel);padding:7px 12px 8px;display:none}
#radio.on{display:block}
#radio .rh{font:500 10.5px var(--f-m);letter-spacing:.2em;color:var(--steel);text-transform:uppercase;display:flex;justify-content:space-between}
#radio .rh i{font-style:normal;color:var(--acc)}#radio.live .rh i{animation:rlive 1s steps(2) infinite}
@keyframes rlive{50%{opacity:.2}}
#radio .rt{font:500 clamp(14px,1.5vw,17px) var(--f-l);letter-spacing:.02em;line-height:1.3;margin-top:3px}
#radio .vi{font-size:.86em}
#locCard{position:fixed;left:50%;bottom:26%;transform:translateX(-50%);text-align:center;pointer-events:none;z-index:6;opacity:0;transition:opacity .6s;border-top:1px solid var(--acc);border-bottom:1px solid var(--acc);padding:10px 34px;background:linear-gradient(90deg,transparent,rgba(11,13,15,.78) 20%,rgba(11,13,15,.78) 80%,transparent)}
#locCard.on{opacity:1}
#locCard .l1{font:900 clamp(26px,5vw,52px) var(--f-d);letter-spacing:.14em;text-transform:uppercase;line-height:1}
#locCard .l2{font:500 clamp(11px,1.4vw,14px) var(--f-m);letter-spacing:.3em;color:var(--acc);text-transform:uppercase;margin-top:4px}
#locCard .l3{font:500 13px var(--f-l);color:var(--mut);margin-top:3px}
#rlAct{position:fixed;left:50%;bottom:176px;transform:translateX(-50%);z-index:8;display:none;align-items:center;gap:12px;background:rgba(11,13,15,.9);border:1px solid var(--acc);padding:7px 16px 7px 8px;color:var(--txt);font:600 15px var(--f-l);letter-spacing:.1em;text-transform:uppercase;cursor:pointer;pointer-events:auto;user-select:none;touch-action:none}
#rlAct.on{display:flex}#rlAct.lock{border-color:var(--alarm);color:var(--alarm)}
#rlAct .ring{width:34px;height:34px;border-radius:50%;background:conic-gradient(var(--acc) calc(var(--p,0)*1%),rgba(232,228,218,.15) 0);position:relative}
#rlAct .ring:after{content:"E";position:absolute;inset:5px;border-radius:50%;background:#0b0d0f;display:grid;place-items:center;font:700 14px var(--f-m);color:var(--txt)}
#rlAct .vi{font-size:.82em;letter-spacing:.02em}
body.touchui #rlAct{bottom:190px}
#rlTimer{top:50px;left:50%;transform:translateX(-50%);width:min(420px,60vw);text-align:center;display:none}
#rlTimer.on{display:block}
#rlTimer .t{font:600 14px var(--f-m);letter-spacing:.16em;color:var(--acc);text-transform:uppercase;text-shadow:var(--shadow)}
#rlTimer .b{height:5px;background:rgba(232,228,218,.15);margin-top:4px}#rlTimer .b i{display:block;height:100%;width:0;background:var(--acc)}
#rlTimer.out .t{color:var(--alarm)}#rlTimer.out .b i{background:var(--alarm)}
body.mmode #xword{top:auto;bottom:260px;left:16px}
body.touchui.mmode #xword{top:auto;bottom:158px;left:10px;right:auto}
body.touchui #rlTimer{left:auto;right:100px;transform:none;top:50px;width:30vw;white-space:nowrap}body.touchui #rlTimer .t{font-size:11px;letter-spacing:.08em}
#rlq{z-index:21}#rlq .q{font:600 clamp(18px,3vw,26px) var(--f-l);text-align:center;margin:10px 0 14px;line-height:1.35}
#rlq .ch{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px}
#rlq .ch .btn[disabled]{opacity:.35}
#rlq .res{text-align:center;font-weight:600;margin-top:12px;min-height:44px}
body.touchui #rlq .card{padding:12px}`;
document.head.appendChild(css);

/* ===================== DOM ===================== */
const topcol=$('topcol'),hudAll=$('hudAll');
const radio=document.createElement('div');radio.id='radio';radio.innerHTML='<div class="rh"><span id="rCall"></span><i>● LIVE</i></div><div class="rt" id="rTxt"></div>';topcol.insertBefore(radio,$('toast'));
$('rCall').textContent='📻 '+RD.callsign;
const loc=document.createElement('div');loc.id='locCard';document.body.appendChild(loc);
const act=document.createElement('div');act.id='rlAct';act.innerHTML='<div class="ring"></div><div id="rlActT"></div>';document.body.appendChild(act);
const tim=document.createElement('div');tim.id='rlTimer';tim.className='hud';tim.innerHTML='<div class="t" id="rlTT"></div><div class="b"><i id="rlTB"></i></div>';hudAll.appendChild(tim);
const qel=document.createElement('div');qel.id='rlq';qel.className='ov hide';
qel.innerHTML='<div class="card" style="max-width:660px"><div class="lbl" id="rlqL" style="text-align:center"></div><div class="q" id="rlqQ"></div><div class="ch" id="rlqC"></div><div class="res" id="rlqR" role="status" aria-live="polite"></div><div class="row" style="justify-content:center;margin-top:6px"><button class="btn sec" id="rlqX" type="button">Step back<span class="vi">Quay lại</span></button></div></div>';
document.body.appendChild(qel);
/* chọn chế độ ở menu */
(function(){const row=document.createElement('div');row.id='modeRow';
  row.innerHTML='<span class="lbl">MODE · Chế độ</span><button class="btn sec modeB" data-m="mission" type="button">MISSION<span class="vi">Sửa trạm Relay rồi rút lui</span></button><button class="btn sec modeB" data-m="holdout" type="button">HOLDOUT<span class="vi">Giữ vị trí qua các đợt</span></button>';
  const first=$('menu').querySelector('h3');first.parentElement.insertBefore(row,first);
  row.onclick=e=>{const b=e.target.closest('.modeB');if(b)setMode(b.dataset.m)}})();
/* phụ đề Việt trong Cài đặt */
(function(){const set=$('pbSet');if(!set)return;const r=document.createElement('div');r.className='pr';r.innerHTML='<span>Radio subtitles<span class="vi">Phụ đề tiếng Việt cho bộ đàm</span></span><button class="btn sec" id="pSub" type="button">ON</button>';set.appendChild(r);
  $('pSub').onclick=()=>{setSub(!subOn)}})();
function setMode(m){if(m!=='mission'&&m!=='holdout')return;mode=m;ls.set('ws_mode',m);syncMode()}
function syncMode(){document.querySelectorAll('.modeB').forEach(b=>b.classList.toggle('on',b.dataset.m===mode))}
function setSub(v){subOn=!!v;ls.set('ws_sub',subOn?'1':'0');if($('pSub'))$('pSub').textContent=subOn?'ON':'OFF';renderRadio();renderObjective()}
syncMode();if($('pSub'))$('pSub').textContent=subOn?'ON':'OFF';

/* ===================== TRẠNG THÁI ===================== */
const M={active:false,phase:'idle',stage:0,relays:[],idx:0,extract:null,prog:0,holding:false,hold:0,lockLeft:0,ambT:0,spawnT:0,q:null,qr:null,radio:null,log:[],objective:null,locShown:null,t:0,exMile:0,
  group:null,lastNear:null};
const wrap=a=>{a%=360;if(a<-180)a+=360;if(a>180)a-=360;return a};
const pick=(L,i)=>L[Math.abs(i|0)%L.length];
const lvl=()=>(typeof TRK!=='undefined'&&RD[TRK])?TRK:'toeic';
const fmt=(tpl,v)=>tpl.replace(/\{(\w+)\}/g,(m,k)=>v[k]===undefined?m:v[k]);
function say(role,vars,idx){
  const L=RD[lvl()][role],m=pick(L,idx===undefined?M.log.length:idx),v=Object.assign({loc:D.locations[M.stage].en,sec:RC.lockSec},vars||{});
  const msg={role,en:fmt(m.en,v),vi:fmt(m.vi,v)};M.radio=msg;M.log.push(msg);renderRadio(true);
  try{ac();tone(1500,.04,'square',.03);setTimeout(()=>tone(1000,.05,'square',.03),50)}catch(e){}
  return msg}
function renderRadio(blip){const m=M.radio;if(!m||!M.active){radio.classList.remove('on','live');return}
  $('rTxt').innerHTML=esc(m.en)+(subOn?`<span class="vi">${esc(m.vi)}</span>`:'');radio.classList.add('on');
  if(blip){radio.classList.add('live');clearTimeout(renderRadio.t);renderRadio.t=setTimeout(()=>radio.classList.remove('live'),5000)}}
function setObjective(en,vi,tag){M.objective={en,vi,tag};renderObjective()}
function renderObjective(){const o=M.objective;if(!o||!M.active)return;$('mtag').textContent=o.tag;$('sentence').innerHTML=esc(o.en)+(subOn?`<span class="vi">${esc(o.vi)}</span>`:'')}

/* ===================== HƯỚNG / KHOẢNG CÁCH THẬT ===================== */
function describe(x,z){
  const p=yawObj.position,dist=Math.hypot(x-p.x,z-p.z),bear=HUD.bearingTo(x,z),head=HUD.heading(),r=wrap(bear-head);
  const k8=['N','NE','E','SE','S','SW','W','NW'],k4=['N','E','S','W'];
  const card=lvl()==='kids'?k4[Math.round(bear/90)%4]:k8[Math.round(bear/45)%8];
  const rel=Math.abs(r)<=45?'ahead':Math.abs(r)>=135?'behind':r>0?'right':'left';
  const nr=dist<=RD.near.nearDist?'near':'far',d=Math.max(5,Math.round(dist/5)*5);
  return{card,rel,dist:d,real:dist,bear,near:nr,
    vars:{dir:RD.dirs[card].en,rel:RD.rels[rel].en,dist:d,near:RD.near[nr].en},
    varsVi:{dir:RD.dirs[card].vi,rel:RD.rels[rel].vi,dist:d,near:RD.near[nr].vi}}}
function orderLine(role,x,z,extra,idx){
  const L=RD[lvl()][role],m=pick(L,idx===undefined?M.log.length:idx),d=describe(x,z),base=Object.assign({loc:D.locations[M.stage].en,sec:RC.lockSec},extra||{});
  return{role,card:d.card,rel:d.rel,dist:d.dist,en:fmt(m.en,Object.assign({},base,d.vars)),vi:fmt(m.vi,Object.assign({},base,d.varsVi))}}
function sayOrder(role,x,z,extra){const m=orderLine(role,x,z,extra);M.radio=m;M.log.push(m);renderRadio(true);try{ac();tone(1500,.04,'square',.03);setTimeout(()=>tone(1000,.05,'square',.03),50)}catch(e){}return m}

/* ===================== VỊ TRÍ HỢP LỆ ===================== */
function groundOk(x,z){
  if(Math.abs(x)>ARENA-3||Math.abs(z)>ARENA-3)return false;
  if(blocked(x,z,2.4))return false;
  const W=window.WSMAP;if(W&&W.on&&W.on()){if(W.holeAt&&W.holeAt(x,z))return false;if(W.floorY&&W.floorY(x,z,9)>.3)return false}
  return true}
function freeSpot(x,z){
  if(groundOk(x,z))return{x,z};
  for(let r=1.5;r<=18;r+=1.5)for(let k=0;k<12;k++){const a=k/12*Math.PI*2,nx=x+Math.cos(a)*r,nz=z+Math.sin(a)*r;if(groundOk(nx,nz))return{x:nx,z:nz}}
  return{x,z}}

/* đặt gần điểm dữ liệu nhất mà vẫn trống VÀ cách các điểm đã đặt ≥ minD (vật cản ngẫu nhiên có thể đẩy điểm lệch) */
function placeApart(pt,others,minD){
  const cands=[{x:pt.x,z:pt.z}];
  for(const r of [3,6,9,12,15,18])for(let k=0;k<12;k++){const a=k/12*Math.PI*2;cands.push({x:pt.x+Math.cos(a)*r,z:pt.z+Math.sin(a)*r})}
  let best=null,bd=-1;
  for(const c of cands){if(!groundOk(c.x,c.z))continue;const m=others.length?Math.min(...others.map(o=>Math.hypot(o.x-c.x,o.z-c.z))):1e9;if(m>=minD)return c;if(m>bd){bd=m;best=c}}
  return best||freeSpot(pt.x,pt.z)}

/* ===================== MESH ===================== */
const poleMat=new THREE.MeshLambertMaterial({color:0x2a2f35}),baseMat=new THREE.MeshLambertMaterial({color:0x14181b});
const baseG=new THREE.BoxGeometry(1.7,.35,1.7),poleG=new THREE.BoxGeometry(.32,3,.32),headG=new THREE.BoxGeometry(.95,.55,.95);
const ringG=new THREE.RingGeometry(1,1.12,40);ringG.rotateX(-Math.PI/2);
const COL={down:0xe8e4da,locked:0xff5a40,on:0x8fd19e};
function buildRelay(i,spot){
  const g=new THREE.Group(),y=(window.WSMAP&&WSMAP.on&&WSMAP.on()&&WSMAP.floorY)?WSMAP.floorY(spot.x,spot.z,9):0;
  const b=new THREE.Mesh(baseG,baseMat);b.position.y=.17;const p=new THREE.Mesh(poleG,poleMat);p.position.y=1.85;
  const hm=new THREE.MeshBasicMaterial({color:COL.down}),h=new THREE.Mesh(headG,hm);h.position.y=3.6;
  g.add(b,p,h);g.position.set(spot.x,y,spot.z);scene.add(g);
  return{i,x:spot.x,z:spot.z,y,state:'down',lockT:0,group:g,head:h,mat:hm}}
function buildExtract(pt,radius){
  const m=new THREE.MeshBasicMaterial({color:0xffb347,transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide}),r=new THREE.Mesh(ringG,m);
  r.scale.set(radius,1,radius);const y=(window.WSMAP&&WSMAP.on&&WSMAP.on()&&WSMAP.floorY)?WSMAP.floorY(pt.x,pt.z,9):0;r.position.set(pt.x,y+.08,pt.z);scene.add(r);
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,14,6,1,true),new THREE.MeshBasicMaterial({color:0xffb347,transparent:true,opacity:.35,depthWrite:false}));beam.position.set(pt.x,y+7,pt.z);scene.add(beam);
  return{x:pt.x,z:pt.z,y,ring:r,beam,mat:m,radius}}
function clearMeshes(){
  for(const r of M.relays)if(r.group){scene.remove(r.group);r.mat.dispose()}
  if(M.extract){scene.remove(M.extract.ring);scene.remove(M.extract.beam);M.extract.mat.dispose();M.extract.ring.geometry!==ringG&&M.extract.ring.geometry.dispose();M.extract.beam.geometry.dispose();M.extract.beam.material.dispose()}
  M.relays=[];M.extract=null}

/* ===================== QUÁI "HOSTILE" ===================== */
const hostiles=()=>BOTS.filter(b=>b.userData.hostile&&!b.userData.dying);
function spawnHostile(near){
  const en=STAGES[M.stage].enemies,kind=wpick(en),col=BOTCOL[(Math.random()*BOTCOL.length)|0];
  const b=makeBot(kind.toUpperCase(),kind,col);b.userData.hostile=true;
  const [x,z]=spawnPos(near?12:18,near?20:28);b.position.set(x,0,z);scene.add(b);BOTS.push(b);_v.set(x,1.5,z);burst(_v,0xff5a40,10,5);rebuildHits();return b}
function alarm(n){let k=0;for(let i=0;i<n&&BOTS.length<36;i++){spawnHostile(true);k++}return k}
const _oht=onHitTarget;
onHitTarget=function(root,dmg){
  const u=root&&root.userData;
  if(u&&u.hostile){if(u.dying)return;hitMark('w');u.hp-=dmg;u.flash=.12;SFX.hit();
    if(u.hp>.001){setLabel(u.label,u.label.userData.state,u.hp);return}
    S.score+=20;S.hudDirty=true;killBot(root,false);return}
  return _oht(root,dmg)};

/* ===================== VÒNG ĐỜI NHIỆM VỤ ===================== */
const DUMMY_Q=()=>({type:'gap',step:0,choices:[],ans:null,explain:'',review:'',raw:null,isOk:()=>false,html:()=>''});
function begin(i){
  M.active=true;M.stage=i;M.phase='relays';M.idx=0;M.prog=0;M.holding=false;M.hold=0;M.lockLeft=0;M.t=0;M.ambT=D.ambient.startAfter;M.spawnT=0;M.exMile=0;M.log=[];M.radio=null;
  const n=RC.counts[i];
  const placed=[];M.relays=D.spots[i].slice(0,n).map((p,k)=>{const s=placeApart(p,placed,12);placed.push(s);return buildRelay(k,s)});
  M.extract=buildExtract(placeApart(D.extract.points[i],placed,14),D.extract.radius);
  S.q=DUMMY_Q();S.boss=false;document.body.classList.add('mmode');
  showLocation(i);
  setObjective('Restore relay 1 of '+n,'Khôi phục trạm số 1 trên '+n,'MISSION '+(i+1)+' · RELAYS 0/'+n+' · FIND THE SIGNAL');
  setTimeout(()=>{if(M.active&&M.phase==='relays'&&M.stage===i&&S.running){say('intro')}},900);
  setTimeout(()=>{if(M.active&&M.phase==='relays'&&M.stage===i&&S.running&&M.idx===0&&M.log.length<=1)orderNext()},4200)}
function orderNext(){
  const r=M.relays[M.idx];if(!r)return;
  sayOrder('relay',r.x,r.z,{n:M.idx+1});
  const n=M.relays.length;
  setObjective('Restore relay '+(M.idx+1)+' of '+n,'Khôi phục trạm số '+(M.idx+1)+' trên '+n,'MISSION '+(M.stage+1)+' · RELAYS '+M.idx+'/'+n+' · '+(r.state==='locked'?'LOCKED':'FIND THE SIGNAL'))}
function showLocation(i){
  const L=D.locations[i];loc.innerHTML=`<div class="l1">${esc(L.en)}</div><div class="l2">${esc(L.sub)}</div><div class="l3">${esc(L.vi)}</div>`;M.locShown=L.en;
  loc.classList.add('on');clearTimeout(showLocation.t);showLocation.t=setTimeout(()=>loc.classList.remove('on'),3400)}
function endMission(){
  M.active=false;M.phase='idle';clearMeshes();act.classList.remove('on','lock');tim.classList.remove('on');radio.classList.remove('on','live');loc.classList.remove('on');qel.classList.add('hide');
  document.body.classList.remove('mmode')}

/* ===================== GIỮ E / CÂU HỎI ===================== */
function curRelay(){return M.phase==='relays'?M.relays[M.idx]:null}
function nearCur(){
  if(!M.active||M.phase!=='relays'||!S.running||S.paused||S.modal||S.ended)return null;
  const r=curRelay();if(!r)return null;const p=yawObj.position;
  return Math.hypot(p.x-r.x,p.z-r.z)<RC.range&&Math.abs(p.y-1.7-r.y)<2.2?r:null}
function openQuestion(r){
  r=r||curRelay();if(!r||M.q)return null;
  S.modal=true;mouseHeld=false;M.holding=false;M.prog=0;if(document.pointerLockElement)document.exitPointerLock();
  const st=STAGES[M.stage],q=makeQ(st.type);M.q=q;M.qr=r;q.relayDone=false;
  $('rlqL').textContent='RELAY '+(r.i+1)+' · RESTORE THE LINK · Khôi phục liên kết';$('rlqR').textContent='';
  renderQ2();qel.classList.remove('hide');return q}
function renderQ2(){
  const q=M.q;$('rlqQ').innerHTML=q.html(false);
  $('rlqC').innerHTML=q.choices.map((c,i)=>`<button class="btn sec" data-i="${i}" ${q.used&&q.used.includes(i)?'disabled':''}>${String.fromCharCode(65+i)}. ${esc(c)}</button>`).join('')}
function answer(i){
  const q=M.q;if(!q||q.relayDone)return null;const w=q.choices[i];
  if(q.isOk(w)){
    if(q.seq){q.step++;(q.used=q.used||[]).push(i);if(q.step<q.seq.length){renderQ2();return 'step'}}
    return success()}
  return fail(w)}
function success(){
  const q=M.q,r=M.qr;q.relayDone=true;r.state='on';
  S.ok++;S.combo++;S.score+=RC.score;S.hp=Math.min(S.maxHp,S.hp+RC.hp);S.perks.push('📡');S.hudDirty=true;
  const R=window.__WSX&&window.__WSX.R;if(R){if(!R.waveHurt)R.cleanWaves++;R.waveHurt=false}
  API.addCoins(RC.coins,null);SFX.ok();$('rlqQ').innerHTML=q.html(true);
  $('rlqR').innerHTML='<span style="color:var(--ok)">✔ '+esc(q.explain||'')+' · +'+RC.coins+' 🪙</span>';
  M.idx++;const n=M.relays.length;say('ok',{n:r.i+1});
  setTimeout(closeQ,1300);
  if(M.idx>=n){M.phase='extract';M.hold=0;M.spawnT=D.extract.spawnEvery;
    setTimeout(()=>{if(!M.active)return;sayOrder('extract',M.extract.x,M.extract.z,{sec:D.extract.holdSec});banner('RELAYS ONLINE','Go to the extraction point · Tới điểm rút lui');
      setObjective('Reach the extraction point','Tới điểm rút lui','MISSION '+(M.stage+1)+' · RELAYS '+n+'/'+n+' · EXTRACT')},1500)}
  else setTimeout(()=>{if(M.active&&M.phase==='relays')orderNext()},1800);
  return 'ok'}
function fail(w){
  const q=M.q,r=M.qr;q.relayDone=true;r.state='locked';r.lockT=RC.lockSec;
  S.bad++;S.combo=0;S.hudDirty=true;S.mistakes.push({review:q.review,pick:w,explain:q.explain});SFX.bad();
  $('rlqR').innerHTML='<span style="color:#ff8a78">✖ '+esc(q.explain||'')+'</span>';
  const n=alarm(D.alarm.hostiles[M.stage]);say('alarm',{lock:RC.lockSec});banner('ALARM','Relay locked '+RC.lockSec+'s · Trạm bị khoá');
  setTimeout(closeQ,1900);return 'fail:'+n}
function closeQ(){
  qel.classList.add('hide');M.q=null;M.qr=null;
  if(M.active&&S.running&&!S.ended){S.modal=false;try{lockReq()}catch(e){}}}
$('rlqC').onclick=e=>{const b=e.target.closest('button');if(b&&!b.disabled)answer(+b.dataset.i)};
$('rlqX').onclick=()=>{if(M.q&&!M.q.relayDone){M.q=null;M.qr=null;qel.classList.add('hide');S.modal=false;try{lockReq()}catch(e){}}};

/* phím E (giữ) – chặn kỹ năng E của anh hùng khi đứng gần Relay */
addEventListener('keydown',e=>{if(e.code!=='KeyE')return;const r=nearCur();if(!r)return;e.stopImmediatePropagation();e.preventDefault();if(!e.repeat&&r.state==='down')M.holding=true},true);
addEventListener('keyup',e=>{if(e.code==='KeyE')M.holding=false},true);
act.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const r=nearCur();if(r&&r.state==='down')M.holding=true});
['pointerup','pointercancel','pointerleave'].forEach(ev=>act.addEventListener(ev,()=>{M.holding=false}));

/* ===================== VÒNG LẶP ===================== */
let lastT=performance.now();
function tick(){
  requestAnimationFrame(tick);
  const now=performance.now(),dt=Math.min(.05,(now-lastT)/1000);lastT=now;
  if(!M.active||!S.running||S.ended)return;
  if(S.paused||S.modal)return;
  step(dt)}
function step(dt){
  M.t+=dt;
  /* hiệu ứng Relay */
  for(const r of M.relays){
    if(r.state==='locked'){r.lockT-=dt;if(r.lockT<=0){r.state='down';r.lockT=0;toast('📡 RELAY '+(r.i+1)+' READY · Trạm đã mở khoá','info',1800);if(M.phase==='relays'&&M.relays[M.idx]===r)setObjective('Restore relay '+(r.i+1)+' of '+M.relays.length,'Khôi phục trạm số '+(r.i+1)+' trên '+M.relays.length,'MISSION '+(M.stage+1)+' · RELAYS '+M.idx+'/'+M.relays.length+' · FIND THE SIGNAL')}}
    const blink=r.state==='down'?(Math.sin(M.t*4)>0?1:.35):r.state==='locked'?(Math.sin(M.t*10)>0?1:.4):1;
    r.mat.color.setHex(COL[r.state]);r.mat.color.multiplyScalar(blink)}
  /* quái nền khi đang đi sửa Relay */
  if(M.phase==='relays'){M.ambT-=dt;if(M.ambT<=0){M.ambT=D.ambient.every;if(hostiles().length<D.ambient.max)spawnHostile(false)}}
  /* giữ E */
  const near=nearCur();
  if(near){
    if(near.state==='down'){
      if(M.holding){M.prog+=dt/RC.holdSec;if(M.prog>=1){M.prog=0;M.holding=false;openQuestion(near)}}
      else M.prog=Math.max(0,M.prog-dt*2)}
    else{M.prog=0}
    act.classList.add('on');act.classList.toggle('lock',near.state==='locked');
    $('rlActT').innerHTML=near.state==='locked'?'LOCKED '+Math.ceil(near.lockT)+'s<br><span class="vi">Trạm bị khoá</span>':'HOLD E · RELAY '+(near.i+1)+'<br><span class="vi">Giữ E để sửa trạm</span>';
    act.style.setProperty('--p',0);act.querySelector('.ring').style.setProperty('--p',Math.min(100,M.prog*100))}
  else{M.prog=0;M.holding=false;act.classList.remove('on','lock')}
  /* điểm rút lui */
  if(M.phase==='extract'&&M.extract){
    const E=M.extract,p=yawObj.position,inside=Math.hypot(p.x-E.x,p.z-E.z)<E.radius;
    E.mat.opacity=.55+Math.sin(M.t*3)*.3;
    tim.classList.add('on');tim.classList.toggle('out',!inside);
    if(inside){M.hold+=dt;M.spawnT-=dt;if(M.spawnT<=0){M.spawnT=D.extract.spawnEvery;if(hostiles().length<D.extract.maxHostile)spawnHostile(true)}
      const left=Math.max(0,Math.ceil(D.extract.holdSec-M.hold));
      if(Math.floor(M.hold/10)>M.exMile&&left>0){M.exMile=Math.floor(M.hold/10);say('extracting',{sec:left})}
      if(M.hold>=D.extract.holdSec){completeExtract();return}}
    $('rlTT').textContent=inside?'HOLD POSITION · '+Math.floor(M.hold)+' / '+D.extract.holdSec+'s':'RETURN TO THE ZONE';
    $('rlTB').style.width=Math.min(100,M.hold/D.extract.holdSec*100)+'%';
    setObjective(inside?'Hold position':'Return to the zone',inside?'Giữ vị trí':'Quay lại vòng rút lui','MISSION '+(M.stage+1)+' · EXTRACT · '+Math.floor(M.hold)+'/'+D.extract.holdSec+'s')}}
function completeExtract(){
  M.phase='done';tim.classList.remove('on');API.addCoins(D.extract.coins,null);say('done');banner('EXTRACTED','Mission complete · Hoàn thành nhiệm vụ');SFX.boom&&SFX.boom();
  setTimeout(()=>{if(M.active&&S.running&&!S.ended)endStage(true)},1200)}
requestAnimationFrame(tick);

/* ===================== NỐI VÀO VÒNG CHƠI CŨ ===================== */
const _ss=startStage;
startStage=function(i){
  if(M.active)endMission();
  S.mode=mode;_ss(i);
  showLocation(i);
  if(mode==='mission'){const b=$('banner');b.style.opacity=0;begin(i)}else{M.stage=i;M.active=false}};
const _sw=startWave;
startWave=function(){if(S.mode==='mission'&&M.active)return;return _sw.apply(this,arguments)};
const _sb=startBoss;
startBoss=function(){if(S.mode==='mission'&&M.active)return;return _sb.apply(this,arguments)};
const _tm=toMenu;
toMenu=function(){endMission();return _tm.apply(this,arguments)};
const _es=endStage;
endStage=function(win){
  const was=M.active&&S.mode==='mission'&&!S.ended;
  const r=_es.apply(this,arguments);
  if(was&&S.ended){const n=M.relays.filter(x=>x.state==='on').length,tot=M.relays.length,ex=M.phase==='done';
    $('esub').textContent=(win?'Extracted from ':'Lost at ')+D.locations[M.stage].en+' · Relays '+n+'/'+tot+(ex?' · Extraction complete':'')+' · '+(typeof TR!=='undefined'?TR.name:'')+(typeof HERO!=='undefined'?' · '+HERO.name:'');
    endMission()}
  return r};

/* ===================== NGUỒN KIM CƯƠNG CHO LA BÀN ===================== */
HUD.sources.push(()=>{
  if(!M.active)return[];const out=[],p=yawObj.position;
  if(M.phase==='relays'){const r=curRelay();if(r){const d=Math.hypot(r.x-p.x,r.z-p.z);if(d<=RC.revealDist)out.push({x:r.x,y:r.y+4.3,z:r.z,label:r.state==='locked'?'RELAY '+(r.i+1)+' LOCKED '+Math.ceil(r.lockT)+'S':'RELAY '+(r.i+1),kind:'relay'})}}
  else if(M.phase==='extract'&&M.extract){const E=M.extract,d=Math.hypot(E.x-p.x,E.z-p.z);if(d<=RC.revealDist)out.push({x:E.x,y:E.y+3,z:E.z,label:'EXTRACT',kind:'extract'})}
  return out});

window.WSRelay={D,validate,get mode(){return mode},setMode,get subOn(){return subOn},setSub,get active(){return M.active},get phase(){return M.phase},get relays(){return M.relays},get idx(){return M.idx},get extract(){return M.extract},
  get prog(){return M.prog},get holding(){return M.holding},get q(){return M.q},get radio(){return M.radio},get log(){return M.log},get objective(){return M.objective},get hold(){return M.hold},
  hostiles,near:nearCur,openQuestion,answer,describe,orderLine,orderNext,fmt,step,alarm,spawnHostile,freeSpot,lvl,get usingFallback(){return errs.length>0},get errors(){return errs},
  fillHold(){const r=nearCur();if(r&&r.state==='down'){M.prog=0;openQuestion(r);return true}return false},closeQ,end:endMission};
console.log('[WS relay] đã nạp: chế độ '+mode+' · '+RC.counts.join('/')+' Relay mỗi ải'+(errs.length?' (dùng mặc định do lỗi dữ liệu)':''));
})();
