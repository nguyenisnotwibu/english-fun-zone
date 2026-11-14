/* =====================================================================
   WORD STRIKE 3D – HỆ TRANG PHỤC + TỦ ĐỒ
   · Dữ liệu ở data/ws-outfits.js (window.WS_OUTFITS): thêm bộ mới chỉ cần thêm một mục, không sửa code.
   · CHỈ ĐỔI NGOẠI HÌNH: mũ/tóc, thân, phụ kiện lưng (gắn vào nhân vật khối của ws-avatar.js), vệt sáng khi chạy, hiệu ứng khi hạ quái.
   · Mua thẳng bằng xu (giá theo độ hiếm); mix & match từng món giữa các bộ đã sở hữu; lưu trong ws_x1 (X.skin.outfit, X.mods['o_'+id]).
   · Tủ đồ trong menu: xem trước nhân vật xoay 3D (renderer riêng, tạo khi mở, giải phóng khi đóng), mặc thử từng món hoặc nguyên bộ.
   · Dữ liệu được kiểm định khi nạp; sai thì dùng bộ mặc định và hiện cảnh báo (#dataWarn).
   Nạp SAU ws-avatar.js. Phong cách và giới hạn: design/art/art-bible.md, design/quick-specs/outfit-wardrobe-2026-11-14.md.
   ===================================================================== */
'use strict';
(function(){
if(typeof S==='undefined'||typeof THREE==='undefined'||!window.WSX_API||!window.WSAvatar){console.warn('[WS outfits] game chưa sẵn sàng – bỏ qua');return}
const API=window.WSX_API,X=API.X,AV=window.WSAvatar;

/* ===================== KIỂM ĐỊNH DỮ LIỆU ===================== */
const SLOTS=['hat','body','back','trail','killfx'];
const SLOT_NAME={hat:'Mũ / tóc',body:'Thân',back:'Lưng',trail:'Vệt sáng',killfx:'Hạ quái'};
const ATTACH={hat:['head'],body:['torso','armL','armR','legL','legR'],back:['back']};
const RARS=['common','rare','epic','legendary'];
const SHAPES=['box','star','leaf','line'],KINDS=['burst','ring','rain','bolt'],MARK={square:'◼',diamond:'◆',star:'★'};
const FORBID=/^(hp|maxhp|speed|spd|dmg|damage|cd|cooldown|range|armor|energy|power|stat|stats|boost|bonus)$/i;
const HEX=/^#[0-9a-f]{6}$/i,LIM={boxes:14,side:1.2,halfW:1.2,height:2.6};
const DEF_RAR={common:{name:'Thường',color:'#eef2ff',dots:0,shape:'square',price:400},rare:{name:'Hiếm',color:'#3d8bff',dots:1,shape:'square',price:850},
  epic:{name:'Sử thi',color:'#a56bff',dots:2,shape:'diamond',price:2350},legendary:{name:'Huyền thoại',color:'#ffa733',dots:3,shape:'star',price:5150}};
const FALLBACK={version:1,rarity:DEF_RAR,sets:[{id:'hoc_sinh',name:'Học sinh',rarity:'common',icon:'🎒',default:true,hat:null,body:null,
  back:[['back',.4,.5,.2,0,-.05,.28,'#3d8bff'],['back',.3,.12,.22,0,.12,.28,'#ffc83d']],trail:null,killfx:null}]};
function validate(d){
  const errs=[],E=m=>errs.push(m);
  if(!d||typeof d!=='object'){E('thiếu window.WS_OUTFITS');return errs}
  const walk=(o,at)=>{if(o&&typeof o==='object')for(const k of Object.keys(o)){if(FORBID.test(k))E(at+': khoá chỉ số "'+k+'" bị cấm (trang phục chỉ đổi ngoại hình)');walk(o[k],at+'.'+k)}};
  walk(d,'WS_OUTFITS');
  for(const r of RARS){const o=d.rarity&&d.rarity[r];
    if(!o){E('thiếu rarity.'+r);continue}
    if(typeof o.name!=='string'||!o.name)E('rarity.'+r+'.name');
    if(!HEX.test(o.color||''))E('rarity.'+r+'.color phải là #rrggbb');
    if(!Number.isInteger(o.dots)||o.dots<0||o.dots>3)E('rarity.'+r+'.dots phải là 0–3');
    if(!MARK[o.shape])E('rarity.'+r+'.shape phải là square/diamond/star');
    if(!Number.isInteger(o.price)||o.price<0)E('rarity.'+r+'.price phải là số nguyên ≥ 0')}
  if(!Array.isArray(d.sets)||!d.sets.length){E('sets rỗng');return errs}
  const ids=new Set();let defaults=0;
  d.sets.forEach((s,i)=>{const at='sets['+i+']'+(s&&s.id?' ('+s.id+')':'');
    if(!s||typeof s!=='object'){E(at+' không phải đối tượng');return}
    if(!/^[a-z0-9_]+$/.test(s.id||''))E(at+': id phải là chữ thường/số/gạch dưới');else if(ids.has(s.id))E(at+': trùng id');else ids.add(s.id);
    if(!RARS.includes(s.rarity))E(at+': rarity lạ');
    if(typeof s.name!=='string'||!s.name)E(at+': thiếu name');
    if(typeof s.icon!=='string'||!s.icon)E(at+': thiếu icon');
    if(s.default){defaults++;if(s.rarity!=='common')E(at+': bộ mặc định phải là Thường')}
    for(const sl of ['hat','body','back']){const L=s[sl];if(L==null)continue;
      if(!Array.isArray(L)||!L.length||L.length>LIM.boxes){E(at+'.'+sl+': cần 1–'+LIM.boxes+' hộp');continue}
      L.forEach((b,j)=>{const bt=at+'.'+sl+'['+j+']';
        if(!Array.isArray(b)||b.length!==8){E(bt+': hộp phải có 8 phần tử [on,w,h,d,x,y,z,màu]');return}
        const [on,w,h,dd,x,y,z,c]=b;
        if(!ATTACH[sl].includes(on)){E(bt+': on="'+on+'" không hợp lệ cho món '+sl);return}
        if(![w,h,dd].every(v=>typeof v==='number'&&v>0&&v<=LIM.side))E(bt+': w,h,d phải trong (0, '+LIM.side+']');
        if(![x,y,z].every(v=>typeof v==='number'&&isFinite(v)))E(bt+': x,y,z phải là số');
        if(!HEX.test(c||''))E(bt+': màu phải là #rrggbb');
        const pv=AV.PIV[on];
        if(pv&&[x,y,z].every(isFinite)&&[w,h,dd].every(isFinite)){
          if(Math.abs(pv[0]+x)+w/2>LIM.halfW+1e-6||Math.abs(pv[2]+z)+dd/2>LIM.halfW+1e-6)E(bt+': vượt khung ngang ±'+LIM.halfW+' m');
          if(pv[1]+y+h/2>LIM.height+1e-6)E(bt+': vượt chiều cao '+LIM.height+' m');
          if(pv[1]+y-h/2<-.05)E(bt+': chìm dưới mặt đất')}})}
    if(s.trail!=null){const t=s.trail;if(!t||!HEX.test(t.color||'')||!SHAPES.includes(t.shape)||!(t.size>=.05&&t.size<=.3))E(at+'.trail: cần {color #rrggbb, shape '+SHAPES.join('|')+', size 0.05–0.3}')}
    if(s.killfx!=null){const k=s.killfx;if(!k||!Array.isArray(k.colors)||k.colors.length<1||k.colors.length>3||!k.colors.every(c=>HEX.test(c))||!KINDS.includes(k.kind))E(at+'.killfx: cần {colors 1–3 màu #rrggbb, kind '+KINDS.join('|')+'}')}});
  if(defaults!==1)E('cần đúng 1 bộ mặc định (default:true), đang có '+defaults);
  return errs}
let D=window.WS_OUTFITS;const errs=validate(D);
if(errs.length){
  console.warn('[WS outfits] data/ws-outfits.js lỗi – dùng bộ mặc định:\n - '+errs.slice(0,8).join('\n - '));
  const w=document.getElementById('dataWarn');if(w){w.textContent='⚠️ Dữ liệu trang phục (data/ws-outfits.js) có lỗi ('+errs.length+') – đang dùng bộ mặc định. Chi tiết ở Console.';w.classList.remove('hide')}
  D=FALLBACK}
const SETS=D.sets,BYID={};SETS.forEach(s=>{BYID[s.id]=s});
const DEFAULT_ID=(SETS.find(s=>s.default)||SETS[0]).id,RAR=D.rarity;
const priceOf=s=>s.default?0:RAR[s.rarity].price;
const owned=id=>!!BYID[id]&&(BYID[id].default||!!X.mods['o_'+id]);

/* ===================== TRẠNG THÁI: ĐANG MẶC ===================== */
function sanitize(o){
  const r={};for(const sl of SLOTS){const id=o&&o[sl];r[sl]=(BYID[id]&&owned(id))?id:DEFAULT_ID}return r}
X.skin.outfit=sanitize(X.skin.outfit);
let cur=null;                                        /* cấu hình đang áp dụng: {extra, trail, killfx} */
function buildExtra(sel){
  const extra={head:[],torso:[],armL:[],armR:[],legL:[],legR:[],back:[]};
  for(const sl of ['hat','body','back']){const s=BYID[sel[sl]];if(!s||!s[sl])continue;
    for(const [on,w,h,d,x,y,z,c] of s[sl])extra[on].push({s:[w,h,d],p:[x,y,z],c});}
  return extra}
function conf(sel){const t=BYID[sel.trail],k=BYID[sel.killfx];return{extra:buildExtra(sel),trail:t&&t.trail||null,killfx:k&&k.killfx||null}}
function apply(){cur=conf(X.skin.outfit);window.__WSOutfit=cur.extra;AV.build(cur.extra);clearTrail()}
function equip(sel){X.skin.outfit=sanitize(sel);API.save();apply()}

/* ===================== VỆT SÁNG KHI CHẠY (1 InstancedMesh) ===================== */
const TR_N=24;let trailIM=null,parts=[],spawnT=0,lx=0,lz=0,lastOk=false;
const _o3=new THREE.Object3D(),_c3=new THREE.Color();
function ensureTrail(){
  if(trailIM)return;
  trailIM=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffffff}),TR_N);
  trailIM.frustumCulled=false;trailIM.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  for(let i=0;i<TR_N;i++)trailIM.setColorAt(i,_c3.set(0xffffff));      /* tạo mảng màu khi count còn đầy đủ */
  trailIM.count=0;trailIM.visible=false;scene.add(trailIM)}
function clearTrail(){parts.length=0;lastOk=false;if(trailIM){trailIM.count=0;trailIM.visible=false}}
function trailTick(dt){
  const t=cur&&cur.trail,p=yawObj.position;
  if(!lastOk){lx=p.x;lz=p.z;lastOk=true}
  const sp=dt>0?Math.hypot(p.x-lx,p.z-lz)/dt:0;lx=p.x;lz=p.z;
  if(!t&&!parts.length)return;
  ensureTrail();
  spawnT-=dt;
  if(t&&sp>2.5&&spawnT<=0&&parts.length<TR_N&&p.y-1.7<.5){spawnT=.05;
    parts.push({x:p.x+(Math.random()-.5)*.3,y:p.y-1.7+.12+Math.random()*.25,z:p.z+(Math.random()-.5)*.3,age:0,life:.7,col:t.color,shape:t.shape,size:t.size,rot:Math.random()*6,yaw:yawObj.rotation.y})}
  let n=0;
  for(let i=0;i<parts.length;i++){const q=parts[i];q.age+=dt;if(q.age>=q.life)continue;parts[n++]=q;
    const k=1-q.age/q.life,s=q.size*k;let sx=s,sy=s,sz=s;
    if(q.shape==='leaf'){sx=s*1.6;sy=s*.25}else if(q.shape==='star'){sy=s*.3}else if(q.shape==='line'){sx=s*.5;sy=s*.5;sz=s*3}
    _o3.position.set(q.x,q.y+q.age*.4,q.z);_o3.rotation.set(0,q.shape==='line'?q.yaw:q.rot+q.age*3,0);_o3.scale.set(sx,sy,sz);_o3.updateMatrix();
    trailIM.setMatrixAt(n-1,_o3.matrix);trailIM.setColorAt(n-1,_c3.set(q.col))}
  parts.length=n;trailIM.count=n;trailIM.visible=n>0;
  trailIM.instanceMatrix.needsUpdate=true;if(trailIM.instanceColor)trailIM.instanceColor.needsUpdate=true}
const _mp=movePlayer;movePlayer=function(dt){_mp(dt);trailTick(dt)};
const _ss=startStage;startStage=function(i){clearTrail();return _ss(i)};
const _tm=toMenu;toMenu=function(){clearTrail();return _tm()};

/* ===================== HIỆU ỨNG KHI HẠ QUÁI ===================== */
const hex=c=>parseInt(c.slice(1),16);
function killFx(pos,k){
  const cs=k.colors.map(hex),p={x:pos.x,y:pos.y+1.3,z:pos.z};
  try{
    if(k.kind==='burst'){cs.forEach(c=>burst(p,c,12,7))}
    else if(k.kind==='ring'){shock(p,cs[0],6);burst(p,cs[cs.length-1],16,5)}
    else if(k.kind==='rain'){const q={x:p.x,y:p.y+1.2,z:p.z};cs.forEach(c=>burst(q,c,14,2.5))}
    else if(k.kind==='bolt'){cs.forEach(c=>burst(p,c,12,10));shock(p,cs[0],4)}
  }catch(e){}}
const _kb=killBot;
killBot=function(b,good){
  const fresh=b&&b.userData&&!b.userData.dying,pos=b&&b.position?{x:b.position.x,y:b.position.y,z:b.position.z}:null;
  const r=_kb(b,good);
  if(fresh&&pos&&cur&&cur.killfx&&X.skin.fx==='fx:default')killFx(pos,cur.killfx);   /* skin "Hạ gục" đã mua trong Chợ ưu tiên hơn */
  return r};

/* ===================== MUA / MẶC ===================== */
function buy(id){
  const s=BYID[id];if(!s||owned(id))return{ok:false,msg:'Bạn đã có bộ này'};
  const price=priceOf(s);if(X.coins<price)return{ok:false,msg:'Thiếu '+(price-X.coins)+' xu'};
  X.coins-=price;X.mods['o_'+id]=1;API.save();return{ok:true,msg:'Đã mua "'+s.name+'" – '+price+' xu'}}

/* ===================== TỦ ĐỒ (giao diện) ===================== */
const el=id=>document.getElementById(id);
const css=document.createElement('style');
css.textContent=`#xwardrobe{z-index:23}
.xwlay{display:grid;grid-template-columns:290px 1fr;gap:16px;margin-top:8px}
.xwprev{display:flex;flex-direction:column;align-items:center;gap:8px;background:rgba(10,16,40,.6);border:1px solid var(--line);border-radius:18px;padding:12px}
#xwCanvas{width:260px;height:340px;border-radius:14px;background:radial-gradient(circle at 50% 30%,#2a2f6b,#0b1026);touch-action:none;cursor:grab}
.xwright{min-width:0;max-height:70vh;overflow:auto;padding-right:4px}
.xrb{display:inline-flex;align-items:center;gap:4px;font:800 12px Nunito;border:1.5px solid;border-radius:20px;padding:1px 8px;white-space:nowrap}
.xwcard{position:relative;border:1px solid var(--line);border-radius:14px;padding:10px;background:rgba(255,255,255,.05);text-align:center;display:flex;flex-direction:column;gap:5px;align-items:center}
.xwcard.sel{outline:2px solid var(--acc)}.xwcard.owned{border-color:var(--ok)}
.xwcard .ic{font-size:30px;line-height:1}.xwcard .nm{font:800 15px Nunito;color:#fff}
.xwrow{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:6px 0}.xwrow b{min-width:78px;font:800 13px Nunito;color:var(--mut)}
.xchip{cursor:pointer;border:1px solid var(--line);background:#1d2656;color:#fff;border-radius:10px;padding:5px 9px;font:800 13px Nunito}
.xchip.sel{background:linear-gradient(90deg,#7c5cff,#ff6bd6);border-color:transparent}.xchip.lock{opacity:.7}
#xwMsg{min-height:22px;font-weight:800;color:#ffd34d;margin:6px 0}
@media (max-width:760px){.xwlay{grid-template-columns:1fr}.xwprev{flex-direction:row;flex-wrap:wrap;justify-content:center}#xwCanvas{width:200px;height:260px}.xwright{max-height:none}}`;
document.head.appendChild(css);
const wd=document.createElement('div');wd.id='xwardrobe';wd.className='ov hide';
wd.innerHTML=`<div class="card" style="max-width:1020px"><div class="xhead"><h3 style="margin:0">👕 Tủ đồ</h3><span class="xcoin" id="xwCoin"></span></div>
<div class="sub" style="margin:4px 0 0">Chỉ đổi <b>ngoại hình</b> – không tăng sức mạnh. Bấm bộ để mặc thử; đã sở hữu thì mix &amp; match từng món.</div>
<div class="xwlay"><div class="xwprev"><canvas id="xwCanvas" width="260" height="340" aria-label="Xem trước nhân vật"></canvas><div id="xwName" style="font:800 16px 'Baloo 2'"></div>
<div class="row" style="justify-content:center"><button class="btn" id="xwEquip">Mặc bộ đang thử</button><button class="btn sec" id="xwReset">Về bộ đang mặc</button></div></div>
<div class="xwright"><div class="xtabs" id="xwTabs"></div><div class="xgrid" id="xwSets" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))"></div>
<h3 style="margin:14px 0 4px">Chọn từng món</h3><div id="xwSlots"></div></div></div>
<div id="xwMsg" role="status" aria-live="polite"></div><div class="row" style="justify-content:center"><button class="btn sec" id="xwClose">Đóng</button></div></div>`;
document.body.appendChild(wd);
let tryOn=null,filter='all',pv=null;
const badge=r=>{const o=RAR[r];return`<span class="xrb" style="color:${o.color};border-color:${o.color}" title="${o.name}">${MARK[o.shape]} ${o.dots?'●'.repeat(o.dots)+' ':''}${o.name}</span>`};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function say(m){el('xwMsg').textContent=m||''}
function renderWardrobe(){
  el('xwCoin').textContent=X.coins+' 🪙';
  el('xwTabs').innerHTML=['all',...RARS].map(f=>`<button data-f="${f}" class="${filter===f?'on':''}">${f==='all'?'Tất cả':RAR[f].name}</button>`).join('');
  const list=SETS.filter(s=>filter==='all'||s.rarity===filter);
  el('xwSets').innerHTML=list.map(s=>{const o=owned(s.id),sel=SLOTS.every(sl=>tryOn[sl]===s.id),pr=priceOf(s);
    return`<div class="xwcard ${o?'owned':''} ${sel?'sel':''}"><div class="ic">${esc(s.icon)}</div><div class="nm">${esc(s.name)}</div>${badge(s.rarity)}
      <div style="font-size:12px;color:var(--mut)">${o?'✔ Đã sở hữu':pr+' 🪙'}</div>
      <div class="row" style="justify-content:center;gap:4px"><button class="btn sec" data-try="${s.id}" style="padding:4px 10px">Thử</button>${o?`<button class="btn" data-wear="${s.id}" style="padding:4px 10px">Mặc</button>`:`<button class="btn" data-buy="${s.id}" style="padding:4px 10px">Mua</button>`}</div></div>`}).join('');
  el('xwSlots').innerHTML=SLOTS.map(sl=>{
    const chips=SETS.filter(s=>!!s[sl]).map(s=>`<button class="xchip ${tryOn[sl]===s.id?'sel':''} ${owned(s.id)?'':'lock'}" data-slot="${sl}" data-id="${s.id}" title="${esc(s.name)}">${owned(s.id)?'':'🔒 '}${esc(s.icon)} ${esc(s.name)}</button>`).join('');
    const none=`<button class="xchip ${!BYID[tryOn[sl]]||!BYID[tryOn[sl]][sl]?'sel':''}" data-slot="${sl}" data-id="${DEFAULT_ID}">Mặc định</button>`;
    return`<div class="xwrow"><b>${SLOT_NAME[sl]}</b>${none}${chips}</div>`}).join('');
  const names=[...new Set(SLOTS.map(sl=>tryOn[sl]))].map(id=>BYID[id].name);
  el('xwName').textContent=names.length===1?names[0]:'Phối: '+names.join(' + ')}
function showPreview(){
  if(!pv)return;
  if(pv.rig){pv.scene.remove(pv.rig.group);pv.rig.dispose();pv.rig=null}
  const rig=AV.createRig(buildExtra(tryOn),(typeof HERO!=='undefined'&&HERO&&HERO.col)?_c3.set(HERO.col).getHex():0x00d2ff);
  rig.parts.armR.rotation.x=Math.PI/2;              /* tay phải giơ súng như trong game */
  pv.scene.add(rig.group);pv.rig=rig}
function openPreview(){
  closePreview();
  try{
    const cv=el('xwCanvas'),r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
    r.setPixelRatio(Math.min(devicePixelRatio||1,2));r.setSize(cv.clientWidth||260,cv.clientHeight||340,false);
    const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0x9fb8ff,0x2a1840,.95));const dl=new THREE.DirectionalLight(0xfff0dd,1);dl.position.set(2,4,3);sc.add(dl);
    const cam=new THREE.PerspectiveCamera(32,(cv.clientWidth||260)/(cv.clientHeight||340),.1,50);cam.position.set(0,1.45,6.2);cam.lookAt(0,1.1,0);
    const ped=new THREE.Mesh(new THREE.BoxGeometry(1.1,.1,1.1),new THREE.MeshLambertMaterial({color:0x2a2f6b}));ped.position.y=-.05;sc.add(ped);
    pv={renderer:r,scene:sc,camera:cam,ped,rig:null,rot:.5,drag:null,raf:0,last:performance.now()};
    const loop=()=>{if(!pv)return;pv.raf=requestAnimationFrame(loop);const now=performance.now(),dt=Math.min(.05,(now-pv.last)/1000);pv.last=now;
      if(!pv.drag)pv.rot+=dt*.8;if(pv.rig)pv.rig.group.rotation.y=pv.rot;r.render(sc,cam)};
    cv.onpointerdown=e=>{pv&&(pv.drag={x:e.clientX,rot:pv.rot});try{cv.setPointerCapture(e.pointerId)}catch(x){}};
    cv.onpointermove=e=>{if(pv&&pv.drag)pv.rot=pv.drag.rot+(e.clientX-pv.drag.x)*.012};
    cv.onpointerup=cv.onpointercancel=()=>{if(pv)pv.drag=null};
    showPreview();loop()}
  catch(e){console.warn('[WS outfits] không tạo được khung xem trước:',e);pv=null;say('Không mở được khung xem trước 3D trên máy này – vẫn dùng được tủ đồ.')}}
function closePreview(){
  if(!pv)return;cancelAnimationFrame(pv.raf);
  if(pv.rig)pv.rig.dispose();pv.ped.geometry.dispose();pv.ped.material.dispose();
  try{pv.renderer.dispose();pv.renderer.forceContextLoss()}catch(e){}pv=null}
function openWardrobe(){
  if(S.running&&!S.ended&&!S.paused)return;
  tryOn=Object.assign({},X.skin.outfit);filter='all';say('');
  wd.classList.remove('hide');renderWardrobe();openPreview()}
function closeWardrobe(){wd.classList.add('hide');closePreview();try{buildMenu()}catch(e){}}
wd.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.dataset.f){filter=t.dataset.f;renderWardrobe();return}
  if(t.dataset.try){const s=BYID[t.dataset.try];for(const sl of SLOTS)tryOn[sl]=s.id;showPreview();renderWardrobe();say(owned(s.id)?'Đang thử "'+s.name+'"':'Đang thử "'+s.name+'" – cần mua để mặc');return}
  if(t.dataset.wear){const s=BYID[t.dataset.wear];const sel={};for(const sl of SLOTS)sel[sl]=s.id;tryOn=sel;equip(sel);showPreview();renderWardrobe();say('✔ Đã mặc "'+s.name+'"');return}
  if(t.dataset.buy){const r=buy(t.dataset.buy);say(r.msg);if(r.ok){const s=BYID[t.dataset.buy],sel={};for(const sl of SLOTS)sel[sl]=s.id;tryOn=sel;equip(sel);showPreview()}renderWardrobe();return}
  if(t.dataset.slot){tryOn[t.dataset.slot]=t.dataset.id;showPreview();renderWardrobe();return}
  if(t.id==='xwEquip'){const lack=[...new Set(SLOTS.map(sl=>tryOn[sl]))].filter(id=>!owned(id)).map(id=>BYID[id].name);
    if(lack.length){say('Bạn chưa sở hữu: '+lack.join(', ')+'. Hãy mua bộ đó trước.');return}
    equip(tryOn);say('✔ Đã mặc bộ đang thử');renderWardrobe();return}
  if(t.id==='xwReset'){tryOn=Object.assign({},X.skin.outfit);showPreview();renderWardrobe();say('');return}
  if(t.id==='xwClose')closeWardrobe()});
document.addEventListener('keydown',e=>{if(e.code==='Escape'&&!wd.classList.contains('hide'))closeWardrobe()});
/* nút ở menu, ngay sau nút Chợ */
(function(){const shop=el('xmenuShop');if(!shop)return;
  const b=document.createElement('button');b.id='xmenuWard';b.className='btn sec';b.textContent='👕 Tủ đồ';shop.after(b);b.onclick=openWardrobe})();

apply();
/* ===================== DÙNG CHO TEST ===================== */
window.WSOutfits={sets:SETS,rarity:RAR,SLOTS,validate,owned,priceOf,buy,equip,sanitize,buildExtra,open:openWardrobe,close:closeWardrobe,
  get current(){return cur},get equipped(){return X.skin.outfit},get previewOn(){return !!pv},get usingFallback(){return errs.length>0},get errors(){return errs},
  get trailCount(){return trailIM?trailIM.count:0},get trailMesh(){return trailIM},killFx};
console.log('[WS outfits] đã nạp: '+SETS.length+' bộ trang phục'+(errs.length?' (dùng bộ mặc định do lỗi dữ liệu)':''));
})();
