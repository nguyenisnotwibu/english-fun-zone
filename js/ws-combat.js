/* =====================================================================
   WORD STRIKE 3D – QUÁI KIỂU SALTLINE + BĂNG ĐẠN + NẠP NHANH BẰNG CÂU HỎI (Giai đoạn 3 của "Saltline Ops")
   · GULL (drone bay, từ vựng) · HOUND (chạy, ngữ pháp) · HEAVY (nặng, câu khó). Mọi kỹ năng đều có DẤU HIỆU BÁO TRƯỚC (vạch đỏ / vòng đỏ).
   · Băng đạn cho cả 4 súng; R = nạp. Nạp CHẬM bình thường; trong lúc nạp hiện câu hỏi 5 giây: ĐÚNG → nạp ngay + băng đạn XUYÊN GIÁP; sai/bỏ qua → nạp chậm.
   · Voice Blast chuyển sang phím V (R dành cho nạp đạn).
   · Dữ liệu ở data/ws-combat.js (window.WS_COMBAT). Thiết kế: design/quick-specs/saltline-combat-phase3-2026-11-15.md
   Nạp SAU ws-relay.js.
   ===================================================================== */
'use strict';
(function(){
if(typeof S==='undefined'||typeof WEPS==='undefined'||typeof KINDS==='undefined'||typeof makeBot!=='function'||typeof updBot!=='function'||typeof fire!=='function'||!window.WSX_API){
  console.warn('[WS combat] game chưa sẵn sàng – bỏ qua');return}
const API=window.WSX_API,$=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ===================== KIỂM ĐỊNH DỮ LIỆU ===================== */
const DEF={version:1,
  kinds:{gull:{s:.85,hp:1,spd:1,dmg:9,hover:3.2,bob:.45,keep:11,range:32,shotEvery:[3,4.2],tele:.9,bullet:13},hound:{s:.82,hp:1,spd:1.55,dmg:11,lungeRange:8.5,tele:1,lungeSpeed:15,lungeTime:.5,lungeCd:3.2},heavy:{s:1.28,hp:2,spd:.62,dmg:20,armor:true,slamRange:4.5,tele:1.3,slamCd:5}},
  carrier:{gap:{hound:.75,grunt:.25},error:{hound:.6,shooter:.4},order:{hound:.7,grunt:.3},vocab:{gull:.75,grunt:.25},spell:{gull:.75,grunt:.25},hard:{heavy:1}},
  hostile:{gull:.3,hound:.4,heavy:.15,grunt:.15},mag:[30,8,3,2],reload:[3.2,3.6,4,4.5],quick:{sec:5,choices:3,types:['vocab','spell']}};
const KNOWN=['grunt','runner','tank','shooter','gull','hound','heavy'],QTYPES_OK=['gap','vocab','spell','order','error','hard'];
function validate(d){
  const errs=[],E=m=>errs.push(m),isN=v=>typeof v==='number'&&isFinite(v),rng=(o,k,lo,hi,at)=>{const v=o&&o[k];if(!isN(v)||v<lo||v>hi)E((at||'')+k+' phải trong '+lo+'–'+hi+' (đang là '+v+')')};
  if(!d||typeof d!=='object'){E('thiếu window.WS_COMBAT');return errs}
  const K=d.kinds||{};
  for(const k of ['gull','hound','heavy']){const o=K[k];if(!o){E('thiếu kinds.'+k);continue}const at='kinds.'+k+'.';rng(o,'s',.5,2,at);rng(o,'hp',1,6,at);rng(o,'spd',.3,3,at);rng(o,'dmg',1,40,at);rng(o,'tele',.8,2.5,at)}
  if(K.gull){rng(K.gull,'hover',1.5,6,'kinds.gull.');rng(K.gull,'bob',0,1,'kinds.gull.');rng(K.gull,'keep',6,20,'kinds.gull.');rng(K.gull,'range',12,50,'kinds.gull.');rng(K.gull,'bullet',6,30,'kinds.gull.');
    if(!Array.isArray(K.gull.shotEvery)||K.gull.shotEvery.length!==2||!(K.gull.shotEvery[0]>=1.5)||!(K.gull.shotEvery[1]>=K.gull.shotEvery[0]))E('kinds.gull.shotEvery = [nhanh, chậm], nhanh ≥ 1.5 giây')}
  if(K.hound){rng(K.hound,'lungeRange',4,16,'kinds.hound.');rng(K.hound,'lungeSpeed',6,24,'kinds.hound.');rng(K.hound,'lungeTime',.2,1,'kinds.hound.');rng(K.hound,'lungeCd',1.5,12,'kinds.hound.')}
  if(K.heavy){rng(K.heavy,'slamRange',2.5,8,'kinds.heavy.');rng(K.heavy,'slamCd',2,15,'kinds.heavy.')}
  const wts=(o,at)=>{if(!o||typeof o!=='object'){E(at+' phải là bảng trọng số');return}let s=0;for(const k in o){if(!KNOWN.includes(k))E(at+': loại quái lạ "'+k+'"');if(!isN(o[k])||o[k]<0)E(at+'.'+k+' phải ≥ 0');else s+=o[k]}if(!(s>0))E(at+' phải có ít nhất 1 trọng số > 0')};
  for(const t of QTYPES_OK)wts(d.carrier&&d.carrier[t],'carrier.'+t);
  wts(d.hostile,'hostile');
  if(!Array.isArray(d.mag)||d.mag.length!==4||!d.mag.every(n=>Number.isInteger(n)&&n>=1&&n<=100))E('mag cần 4 số nguyên 1–100 (Blaster, Scatter, Railgun, Nova)');
  if(!Array.isArray(d.reload)||d.reload.length!==4||!d.reload.every(n=>isN(n)&&n>=.8&&n<=12))E('reload cần 4 số 0,8–12 giây');
  const q=d.quick||{};rng(q,'sec',2,10,'quick.');rng(q,'choices',2,4,'quick.');
  if(!Array.isArray(q.types)||!q.types.length||!q.types.every(t=>['vocab','spell','gap','error'].includes(t)))E('quick.types chỉ gồm vocab / spell / gap / error');
  return errs}
let D=window.WS_COMBAT,errs=validate(D);
if(errs.length){console.warn('[WS combat] data/ws-combat.js lỗi – dùng mặc định:\n - '+errs.slice(0,8).join('\n - '));
  const w=$('dataWarn');if(w){w.textContent='⚠️ Dữ liệu quái/băng đạn (data/ws-combat.js) có lỗi ('+errs.length+') – đang dùng giá trị mặc định. Chi tiết ở Console.';w.classList.remove('hide')}
  D=DEF}
const CK=D.kinds;

/* ===================== LOẠI QUÁI MỚI ===================== */
KINDS.gull={s:CK.gull.s,hp:CK.gull.hp,spd:CK.gull.spd,dmg:CK.gull.dmg,ranged:true};
KINDS.hound={s:CK.hound.s,hp:CK.hound.hp,spd:CK.hound.spd,dmg:CK.hound.dmg};
KINDS.heavy={s:CK.heavy.s,hp:CK.heavy.hp,spd:CK.heavy.spd,dmg:CK.heavy.dmg,armor:!!CK.heavy.armor};
const _mb=makeBot;
makeBot=function(word,kind,color,scale){
  const b=_mb(word,kind,color,scale),K=CK[kind];
  if(K){const u=b.userData;u.skill=kind;u.cd=1+Math.random()*1.5;u.tele=0;u.act=null;
    if(kind==='gull'){u.fly=true;u.shotCd=1e9;u.base=u.base||b.scale.x}}   /* nhịp bắn của gull do ws-combat điều khiển (có báo trước) */
  return b};
const _wp=wpick;
wpick=function(obj){
  if(S.mode!=='mission'&&S.q&&S.q.type&&D.carrier[S.q.type]&&typeof STAGES!=='undefined'&&STAGES[S.stage]&&obj===STAGES[S.stage].enemies)return _wp(D.carrier[S.q.type]);
  return _wp(obj)};
const pickHostile=()=>_wp(D.hostile);

/* ===================== HÀNH VI + BÁO TRƯỚC ===================== */
const _vA=new THREE.Vector3(),_vB=new THREE.Vector3(),RED=0xff5a40;
const rnd2=(a,b)=>a+Math.random()*(b-a);
function startTele(b,u,K,dx,dz,d){
  u.tele=K.tele;u.teleDir={x:dx/d,z:dz/d};u.teleMax=K.tele;
  if(u.skill==='heavy'){shock(b.position,RED,CK.heavy.slamRange);u.slamPing=false}}
function drawTele(b,u,K,p){
  if(u.skill==='hound'){const L=K.lungeSpeed*K.lungeTime;_vA.set(b.position.x,.2,b.position.z);_vB.set(b.position.x+u.teleDir.x*L,.2,b.position.z+u.teleDir.z*L);tracer(_vA,_vB,RED,.09)}
  else if(u.skill==='gull'){_vA.set(b.position.x,b.position.y+1.5,b.position.z);_vB.set(p.x,p.y-.5,p.z);tracer(_vA,_vB,RED,.09)}
  else if(u.skill==='heavy'&&!u.slamPing&&u.tele<u.teleMax*.5){u.slamPing=true;shock(b.position,RED,CK.heavy.slamRange)}
  u.flash=.1}
function execTele(b,u,K,p,dx,dz,d){
  if(u.skill==='hound'){u.act={type:'lunge',t:K.lungeTime,dx:u.teleDir.x,dz:u.teleDir.z,hit:false};u.cd=K.lungeCd}
  else if(u.skill==='gull'){_vA.set(b.position.x,b.position.y+1.5,b.position.z);_vB.set(p.x-_vA.x,p.y-.5-_vA.y,p.z-_vA.z).normalize().multiplyScalar(K.bullet);spawnProj(_vA,_vB,'enemy',0xff3355);SFX.enemyShot&&SFX.enemyShot();u.cd=rnd2(K.shotEvery[0],K.shotEvery[1])}
  else if(u.skill==='heavy'){shock(b.position,RED,K.slamRange);SFX.boom&&SFX.boom();
    if(Math.hypot(p.x-b.position.x,p.z-b.position.z)<K.slamRange&&p.y-1.7<.9){hurt(K.dmg,b.position);S.combo=0}   /* nhảy lên là tránh được */
    u.cd=K.slamCd}}
const _ub=updBot;
updBot=function(b,dt){
  const u=b.userData,K=u.skill&&CK[u.skill];
  if(!K||u.dying||u.isBoss||u.frozen)return _ub(b,dt);
  const slowF=S.slow>0?.35:1,sdt=dt*slowF,p=yawObj.position,dx=p.x-b.position.x,dz=p.z-b.position.z,d=Math.hypot(dx,dz)||1;
  const base=_ub,hover=()=>{if(u.fly)b.position.y=K.hover+Math.sin(u.t*2.2)*K.bob};   /* độ cao đặt SAU các lớp khác (bản đồ kéo quái xuống sàn) */
  const _ubH=(bb,t)=>{const r=base(bb,t);hover();return r};
  /* đang lao (HOUND) */
  if(u.act&&u.act.type==='lunge'){
    u.t+=dt;const a=u.act,sp=K.lungeSpeed*sdt,nx=b.position.x+a.dx*sp,nz=b.position.z+a.dz*sp;
    if(!blocked(nx,b.position.z,.6))b.position.x=nx;if(!blocked(b.position.x,nz,.6))b.position.z=nz;
    b.position.x=clamp(b.position.x,-ARENA+1,ARENA-1);b.position.z=clamp(b.position.z,-ARENA+1,ARENA-1);
    b.rotation.y=Math.atan2(a.dx,a.dz);u.arms[0].rotation.x=u.arms[1].rotation.x=-1.4;
    if(!a.hit&&Math.hypot(p.x-b.position.x,p.z-b.position.z)<1.4&&Math.abs(p.y-1.7-b.position.y)<2.2){a.hit=true;hurt(K.dmg,b.position);SFX.hurt();S.combo=0}
    a.t-=sdt;if(a.t<=0)u.act=null;return}
  /* đang báo trước */
  if(u.tele>0){u.tele-=sdt;u.stun=Math.max(u.stun,.05);drawTele(b,u,K,p);
    if(u.tele<=0){u.tele=0;execTele(b,u,K,p,dx,dz,d)}
    return _ubH(b,dt)}
  /* hồi chiêu + điều kiện bắt đầu */
  u.cd-=sdt;
  if(u.cd<=0&&u.stun<=0){
    if(u.skill==='hound'&&d<K.lungeRange&&d>1.5)startTele(b,u,K,dx,dz,d);
    else if(u.skill==='gull'&&d<K.range)startTele(b,u,K,dx,dz,d);
    else if(u.skill==='heavy'&&d<K.slamRange+1.5)startTele(b,u,K,dx,dz,d)}
  return _ubH(b,dt)};

/* ===================== BĂNG ĐẠN + NẠP ===================== */
const active=()=>S.running&&!S.paused&&!S.modal&&!S.ended&&Array.isArray(S.mag);
function initMag(){S.mag=WEPS.map((w,i)=>D.mag[i]||10);S.reload=null;S.ap=0;S.noMagT=0;hideQuick();drawAmmo()}
function drawAmmo(){
  if(!Array.isArray(S.mag)||!$('ammoN'))return;
  const W=WEPS[S.wep],mag=S.mag[S.wep],size=D.mag[S.wep],r=S.reload&&S.reload.w===S.wep?S.reload:null;
  $('ammoL').textContent=W.name+(S.ap>0?' · AP':'');
  $('ammoN').textContent=r?'--':String(mag);$('ammoN').classList.toggle('dim',!!r||mag<=Math.max(1,Math.round(size*.2)));
  $('ammoS').textContent=r?'RELOADING '+Math.min(100,Math.round(r.t/r.total*100))+'% · Đang nạp':mag<=0?'PRESS R · Bấm R để nạp':(W.energy?'MAG '+size+' · ENERGY '+S.energy+' (cost '+W.energy+')':'MAG '+size+' · R to reload')}
/* câu hỏi nạp nhanh */
const qr=document.createElement('div');qr.id='qr';qr.className='hud hide';
qr.innerHTML='<div class="qh"><b>QUICK RELOAD</b><span>Nạp nhanh — đúng: nạp ngay + đạn xuyên giáp</span><i><u id="qrT"></u></i></div><div class="qq" id="qrQ"></div><div class="qc" id="qrC"></div><div class="qm" id="qrM"></div>';
$('hudAll').appendChild(qr);
const css=document.createElement('style');
css.textContent=`#qr{left:50%;bottom:196px;transform:translateX(-50%);width:min(520px,70vw);background:var(--panel);border:1px solid var(--acc);border-left:3px solid var(--acc);padding:7px 12px 9px;pointer-events:auto;z-index:6}
#qr .qh{display:flex;gap:10px;align-items:baseline;font:500 10.5px var(--f-m);letter-spacing:.14em;text-transform:uppercase;color:var(--acc)}#qr .qh span{color:var(--mut);letter-spacing:.04em;text-transform:none;font:500 12px var(--f-l)}
#qr .qh i{flex:1;height:4px;background:rgba(232,228,218,.15);align-self:center}#qr .qh u{display:block;height:100%;width:100%;background:var(--acc);text-decoration:none}
#qr .qq{font:600 clamp(16px,2vw,21px) var(--f-l);margin:5px 0 6px}
#qr .qc{display:flex;gap:6px;flex-wrap:wrap}#qr .qc button{flex:1;min-width:110px;min-height:40px;cursor:pointer;background:var(--ink-2);border:1px solid var(--line);color:var(--txt);font:600 15px var(--f-l);letter-spacing:.05em;text-transform:uppercase;padding:6px 10px}
#qr .qc button:hover{border-color:var(--acc)}#qr .qc button[disabled]{opacity:.4;cursor:default}
#qr .qm{min-height:16px;font:500 12.5px var(--f-l);color:var(--mut)}
#reloadB{position:absolute;pointer-events:auto;right:196px;bottom:34px;width:50px;height:50px;border-radius:50%;border:1px solid var(--line);color:var(--txt);font:600 14px var(--f-l);background:rgba(11,13,15,.6)}
body.touchui #qr{bottom:178px;width:min(560px,56vw)}`;
document.head.appendChild(css);
function makeQuick(){
  const type=D.quick.types[(Math.random()*D.quick.types.length)|0],q=makeQ(type),n=Math.min(D.quick.choices,q.choices.length);
  const wrong=q.choices.filter(c=>c!==q.ans),pickW=shuffle(wrong).slice(0,n-1);q.choices=shuffle([q.ans,...pickW]);return q}
function renderQuick(){
  const r=S.reload;if(!r||!r.q){hideQuick();return}
  $('qrQ').innerHTML=r.q.html(false);$('qrC').innerHTML=r.q.choices.map((c,i)=>`<button data-i="${i}" ${r.answered?'disabled':''}>${i+1}. ${esc(c)}</button>`).join('');
  $('qrM').textContent=r.answered?'✖ '+r.q.explain+' — nạp chậm tiếp tục':'';qr.classList.remove('hide')}
function hideQuick(){qr.classList.add('hide')}
function startReload(){
  if(!active()||S.reload)return false;
  const w=S.wep;if(S.mag[w]>=D.mag[w]){const n=performance.now();if(n-(S.noMagT||0)>900){S.noMagT=n;toast('MAG FULL · Băng đạn đầy','info',900)}return false}
  S.reload={w,t:0,total:D.reload[w],qt:Math.min(D.quick.sec,D.reload[w]),q:null,answered:false,expired:false};
  S.reload.q=makeQuick();renderQuick();try{ac();tone(500,.06,'square',.04,300)}catch(e){}drawAmmo();return true}
function cancelReload(){if(S.reload){S.reload=null;hideQuick();drawAmmo()}}
function quickAnswer(i){
  const r=S.reload;if(!r||r.answered||r.expired||!r.q)return null;const w=r.q.choices[i];if(w===undefined)return null;
  if(r.q.isOk(w)){const wi=r.w;S.mag[wi]=D.mag[wi];S.ap=D.mag[wi];S.reload=null;hideQuick();SFX.ok();toast('⚡ QUICK RELOAD · ARMOR-PIERCING MAG · Đạn xuyên giáp','ok',1800);drawAmmo();S.hudDirty=true;return 'ok'}
  r.answered=true;S.mistakes.push({review:r.q.review,pick:w,explain:r.q.explain});if(API.addReview)API.addReview(r.q);SFX.bad();renderQuick();return 'wrong'}
qr.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&!b.disabled)quickAnswer(+b.dataset.i)});
qr.addEventListener('pointerdown',e=>e.stopPropagation());
/* phím */
addEventListener('keydown',e=>{
  if(e.target&&e.target.tagName==='INPUT')return;
  const r=S.reload;
  if(r&&!r.answered&&!r.expired&&r.q){const m=e.code.match(/^(?:Digit|Numpad)([1-4])$/);if(m&&+m[1]<=r.q.choices.length){e.stopImmediatePropagation();e.preventDefault();quickAnswer(+m[1]-1);return}}
  if(e.code==='KeyR'&&!e.repeat&&active())startReload()},true);
(function(){const t=$('touch');if(!t)return;const b=document.createElement('button');b.id='reloadB';b.textContent='R';b.setAttribute('aria-label','Reload');t.appendChild(b);
  b.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();startReload()},{passive:false});b.addEventListener('click',e=>{e.stopPropagation();startReload()})})();
/* bắn: trừ đạn, hết thì nạp */
const _fire=fire;
fire=function(){
  if(!active())return _fire.apply(this,arguments);
  if(S.reload)return;
  const w=S.wep;if(S.mag[w]<=0){startReload();return}
  const had=S.fireCd<=0&&S.swapT<=0;
  _fire.apply(this,arguments);
  if(had&&S.fireCd>0){S.mag[w]--;if(S.ap>0)S.ap--;S.hudDirty=true;drawAmmo();if(S.mag[w]<=0)startReload()}};
if(window.__WS)window.__WS.fire=fire;
const _sw=setWep;
setWep=function(i){const prev=S.wep;_sw(i);if(S.wep!==prev)cancelReload();drawAmmo()};
const _ss=startStage;
startStage=function(i){const r=_ss.apply(this,arguments);initMag();return r};
const _tm=toMenu;
toMenu=function(){hideQuick();return _tm.apply(this,arguments)};
/* vòng lặp nạp */
let lastT=performance.now();
function tick(){
  requestAnimationFrame(tick);
  const now=performance.now(),dt=Math.min(.05,(now-lastT)/1000);lastT=now;
  if(!active()){return}
  const r=S.reload;if(!r)return;
  r.t+=dt;
  if(!r.answered&&!r.expired&&r.t>=r.qt){r.expired=true;hideQuick()}
  const bar=$('qrT');if(bar&&!r.expired)bar.style.width=Math.max(0,(1-r.t/r.qt)*100)+'%';
  if(r.t>=r.total){S.mag[r.w]=D.mag[r.w];S.ap=0;S.reload=null;hideQuick();try{ac();tone(900,.05,'square',.04,1200)}catch(e){}S.hudDirty=true}
  drawAmmo()}
requestAnimationFrame(tick);

window.WSCombat={D,validate,kinds:CK,pickHostile,drawAmmo,startReload,cancelReload,quickAnswer,initMag,
  get reload(){return S.reload},get usingFallback(){return errs.length>0},get errors(){return errs},
  tele(b){return b.userData.tele>0}};
console.log('[WS combat] đã nạp: GULL · HOUND · HEAVY · băng đạn '+D.mag.join('/')+(errs.length?' (dùng mặc định do lỗi dữ liệu)':''));
})();
