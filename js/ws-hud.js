/* =====================================================================
   WORD STRIKE 3D – HUD KIỂU SALTLINE (Giai đoạn 1 của "Saltline Ops")
   · La bàn băng trên cùng (N = hướng −Z) + kim cương cam đánh dấu mục tiêu bản đồ.
   · Kim cương mục tiêu trong thế giới 3D (DOM, không thêm draw call) kèm khoảng cách.
   · Cung đỏ báo hướng bị bắn (window.WSHUD.damageFrom({x,z})).
   · Bảng Cài đặt / Điều khiển trượt từ phải (#panel).
   · WSHUD.sources: danh sách hàm trả mục tiêu [{x,y,z,label,kind}] – giai đoạn 2 (Relay) chỉ cần thêm một nguồn.
   Nạp SAU ws-gacha.js. Phong cách: design/quick-specs/saltline-ui-phase1-2026-11-15.md
   ===================================================================== */
'use strict';
(function(){
if(typeof S==='undefined'||typeof THREE==='undefined'||typeof yawObj==='undefined'||typeof camera==='undefined'||!window.WSX_API){console.warn('[WS hud] game chưa sẵn sàng – bỏ qua');return}
const $=id=>document.getElementById(id),TAU=Math.PI*2;

/* ===================== MỤC TIÊU ===================== */
const sources=[
  /* trạm trả lời + chữ cái của bản đồ (ws-maps.js) */
  ()=>{const M=window.WSMAP;if(!M||!M.on||!M.on())return[];const out=[];
    for(const s of M.stations||[])if(s.ready!==false)out.push({x:s.x,y:(s.y||0)+2.2,z:s.z,label:'TERMINAL',kind:'terminal'});
    for(const l of M.letters||[])out.push({x:l.x,y:(l.y||0)+1.2,z:l.z,label:l.ch?String(l.ch).toUpperCase():'LETTER',kind:'letter'});
    return out}
];
const objectives=()=>{const r=[];for(const f of sources){try{for(const o of f())r.push(o)}catch(e){}}return r};

/* ===================== LA BÀN ===================== */
const cv=$('compCv'),cx=cv&&cv.getContext('2d');
const SPAN=90,CARD={0:'N',90:'E',180:'S',270:'W'};
const norm=a=>{a%=360;return a<0?a+360:a},wrap=a=>{a=norm(a);return a>180?a-360:a};
/* hướng nhìn (độ, theo chiều kim đồng hồ từ Bắc = −Z) */
const heading=()=>norm(-yawObj.rotation.y*180/Math.PI);
const bearingTo=(x,z)=>norm(Math.atan2(x-yawObj.position.x,-(z-yawObj.position.z))*180/Math.PI);
let lastDraw='';
function drawCompass(objs){
  if(!cx)return;const W=cv.width,H=cv.height,hd=heading(),pp=W/(SPAN*2);
  const key=hd.toFixed(1)+'|'+objs.map(o=>bearingTo(o.x,o.z).toFixed(0)).join(',');if(key===lastDraw)return;lastDraw=key;
  cx.clearRect(0,0,W,H);cx.font='500 20px "IBM Plex Mono",monospace';cx.textAlign='center';cx.textBaseline='middle';
  for(let d=-SPAN;d<=SPAN;d+=5){const ang=Math.round((hd+d)/5)*5,off=wrap(ang-hd),x=W/2+off*pp;if(Math.abs(off)>SPAN)continue;
    const a5=norm(ang),major=a5%15===0;cx.strokeStyle='rgba(232,228,218,'+(major?.7:.32)+')';cx.lineWidth=2;cx.beginPath();cx.moveTo(x,major?H-26:H-16);cx.lineTo(x,H-6);cx.stroke();
    if(CARD[a5]!==undefined){cx.fillStyle=a5===0?'#ffb347':'#e8e4da';cx.font='700 26px "Big Shoulders Display",sans-serif';cx.fillText(CARD[a5],x,16)}
    else if(a5%45===0){cx.fillStyle='rgba(232,228,218,.55)';cx.font='500 17px "IBM Plex Mono",monospace';cx.fillText(String(a5),x,16)}}
  /* kim chỉ giữa */
  cx.fillStyle='#e8e4da';cx.beginPath();cx.moveTo(W/2,H-1);cx.lineTo(W/2-6,H-10);cx.lineTo(W/2+6,H-10);cx.closePath();cx.fill();
  /* mục tiêu */
  for(const o of objs){const off=wrap(bearingTo(o.x,o.z)-hd);if(Math.abs(off)>SPAN)continue;const x=W/2+off*pp;
    cx.save();cx.translate(x,H-30);cx.rotate(Math.PI/4);cx.fillStyle='rgba(11,13,15,.8)';cx.strokeStyle='#ffb347';cx.lineWidth=3;cx.fillRect(-7,-7,14,14);cx.strokeRect(-7,-7,14,14);cx.restore()}}

/* ===================== KIM CƯƠNG TRONG THẾ GIỚI ===================== */
const wp=$('wp'),dms=[],_v=new THREE.Vector3();
function updWorld(objs){
  if(!wp)return;
  while(dms.length<objs.length){const d=document.createElement('div');d.className='dm';d.innerHTML='<i></i><b></b>';wp.appendChild(d);dms.push(d)}
  for(let i=0;i<dms.length;i++){const d=dms[i],o=objs[i];
    if(!o){d.style.display='none';continue}
    _v.set(o.x,o.y===undefined?1.5:o.y,o.z);const dist=Math.hypot(o.x-yawObj.position.x,o.z-yawObj.position.z);
    _v.project(camera);
    if(_v.z>1||Math.abs(_v.x)>1.05||Math.abs(_v.y)>1.05){d.style.display='none';continue}
    d.style.display='';d.style.transform='translate('+((_v.x*.5+.5)*innerWidth-7)+'px,'+((-_v.y*.5+.5)*innerHeight-10)+'px)';
    const t=(o.label||'')+' '+Math.round(dist)+'M';if(d.lastT!==t){d.lastT=t;d.lastElementChild.textContent=t}}}

/* ===================== CUNG ĐỎ BÁO HƯỚNG BỊ BẮN ===================== */
function damageFrom(src){
  const a=$('dmgArc');if(!a||!src)return;
  const rel=wrap(bearingTo(src.x,src.z)-heading());   /* 0° = phía trước, + = bên phải */
  a.style.setProperty('--r',rel+'deg');a.classList.remove('go');void a.offsetWidth;a.classList.add('go');a.dataset.rel=rel.toFixed(1)}

/* ===================== VÒNG LẶP (chỉ khi đang chơi) ===================== */
function loop(){
  requestAnimationFrame(loop);
  if(!S.running||S.ended||document.hidden)return;
  const objs=objectives();drawCompass(objs);updWorld(objs)}
requestAnimationFrame(loop);

/* ===================== BẢNG CÀI ĐẶT / ĐIỀU KHIỂN ===================== */
const panel=$('panel'),shade=$('panelShade');
function syncPanel(){
  const X=window.WSX_API.X;$('pMusic').textContent=X.music?'ON':'OFF';
  $('pView').textContent=(window.WSAvatar&&window.WSAvatar.view==='tp')||X.view==='tp'?'3RD':'1ST'}
function openPanel(tab){syncPanel();setTab(tab||'set');panel.classList.add('open');shade.classList.add('open');panel.setAttribute('aria-hidden','false');try{$('panelX').focus()}catch(e){}}
function closePanel(){panel.classList.remove('open');shade.classList.remove('open');panel.setAttribute('aria-hidden','true')}
function setTab(t){$('ptSet').classList.toggle('on',t==='set');$('ptCtl').classList.toggle('on',t==='ctl');$('pbSet').classList.toggle('hide',t!=='set');$('pbCtl').classList.toggle('hide',t!=='ctl')}
$('settingsB').onclick=()=>openPanel('set');
$('pSettingsB').onclick=()=>openPanel('set');
$('panelX').onclick=closePanel;shade.onclick=closePanel;
$('ptSet').onclick=()=>setTab('set');$('ptCtl').onclick=()=>setTab('ctl');
$('pMusic').onclick=()=>{const b=$('xmusic');if(b)b.click();syncPanel()};
$('pView').onclick=()=>{if(window.WSAvatar&&window.WSAvatar.toggle)window.WSAvatar.toggle();syncPanel()};
$('pGuide').onclick=()=>{closePanel();const g=$('guideB')||$('pGuideB');if(g)g.click()};
document.addEventListener('keydown',e=>{if(e.code==='Escape'&&panel.classList.contains('open')){e.stopPropagation();closePanel()}},true);

window.WSHUD={sources,objectives,heading,bearingTo,damageFrom,drawCompass,openPanel,closePanel,
  get panelOpen(){return panel.classList.contains('open')},get arcRel(){const a=$('dmgArc');return a&&a.dataset.rel!==undefined?+a.dataset.rel:null}};
console.log('[WS hud] đã nạp: la bàn · kim cương mục tiêu · cung báo hướng · bảng Cài đặt');
})();
