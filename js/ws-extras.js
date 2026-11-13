/* =====================================================================
   WORD STRIKE 3D – EXTRAS
   Shop · Túi đồ · Sổ từ · Nhiệm vụ & thử thách ngày · Boss 2 giai đoạn
   Hiệu ứng (hit-stop, rung màn hình, số bay, slow-mo, nhạc động)
   Bối cảnh 3D riêng cho 6 ải · UI bóng bẩy
   Nạp SAU script chính của game; nếu file này lỗi, game gốc vẫn chạy.
   Mọi con số cân bằng nằm ở nhóm CONFIG ngay bên dưới.
   ===================================================================== */
'use strict';
(function(){
if(typeof S==='undefined'||typeof THREE==='undefined'||typeof WEPS==='undefined'||typeof questionDone!=='function'){
  console.warn('[WS extras] game chưa sẵn sàng – bỏ qua');return}

/* ===================== CONFIG ===================== */
const CFG={
  startCoins:60,
  coinPerQ:10, coinPerCombo:2, comboCap:10, coinGolden:25, coinBoss:60,
  clearBonus:50, starBonus:25, missionReward:40, allMissionsBonus:80, dailyBonus:120,
  invCap:9,
  hitStop:.06, slowMo:.35,
  musicVol:1
};
/* Vật phẩm dùng 1 lần – phím 5 6 7 8 */
const CONS=[
 {id:'heal',  icon:'🧪',name:'Bình hồi máu',desc:'+40 HP ngay lập tức',price:45,
  use(){S.hp=Math.min(S.maxHp,S.hp+40);S.hudDirty=true;tint('rgba(46,213,115,.2)',.6);burst(yawObj.position,0x2ed573,24,4);popup('+40 HP','#2ed573');return true}},
 {id:'shield',icon:'🛡️',name:'Khiên 8 giây',desc:'Giảm 80% sát thương trong 8 giây',price:60,
  use(){S.shieldT=Math.max(S.shieldT,8);tint('rgba(255,165,2,.16)',8);banner('🛡️ KHIÊN','-80% sát thương 8 giây');return true}},
 {id:'freeze',icon:'❄️',name:'Đóng băng',desc:'Toàn bộ quái chậm 65% trong 6 giây',price:70,
  use(){S.slow=Math.max(S.slow,6);tint('rgba(120,200,255,.2)',6);banner('❄️ ĐÓNG BĂNG','Quái chậm 65% trong 6 giây');return true}},
 {id:'hint',  icon:'💡',name:'Gợi ý',desc:'Lộ 1 đáp án sai (xếp câu: chỉ từ kế tiếp)',price:50,
  use(){return SKILL.scan()!==false}}
];
/* Nâng cấp vĩnh viễn – mua 1 lần */
const BASE={armor:WEPS[0].armorMul,pellets:WEPS[1].pellets,railCd:WEPS[2].cd,splash:WEPS[3].splash};
const MODS=[
 {id:'pierce',icon:'🔫',name:'Đạn xuyên giáp',desc:'Blaster hết yếu với Tank có giáp',price:220,apply(){WEPS[0].armorMul=1}},
 {id:'pellet',icon:'💥',name:'Nòng loe',desc:'Scatter bắn thêm 2 viên đạn',price:240,apply(){WEPS[1].pellets=BASE.pellets+2}},
 {id:'rail',  icon:'⚡',name:'Tụ điện',desc:'Railgun nạp nhanh hơn 20%',price:270,apply(){WEPS[2].cd=BASE.railCd*.8}},
 {id:'blast', icon:'🚀',name:'Đầu nổ lan',desc:'Nova Launcher nổ rộng hơn 35%',price:270,apply(){WEPS[3].splash=BASE.splash*1.35}},
 {id:'armor', icon:'❤️',name:'Giáp nano',desc:'+15 máu tối đa mỗi ải',price:210,apply(){S.maxHp+=15;S.hp=S.maxHp}},
 {id:'magnet',icon:'🧲',name:'Nam châm xu',desc:'+25% Lexi Coin kiếm được',price:180,apply(){}}
];
/* Mỹ phẩm */
const SKINS=[
 {id:'hud:violet', icon:'🟣',name:'HUD Tím neon',desc:'Mặc định',price:0,css:'#7c5cff'},
 {id:'hud:emerald',icon:'🟢',name:'HUD Lục bảo',desc:'Khung giao diện xanh lục',price:150,css:'#2ed573'},
 {id:'hud:ember',  icon:'🟠',name:'HUD Lửa',desc:'Khung giao diện cam lửa',price:150,css:'#ff7a3d'},
 {id:'hud:ice',    icon:'🔵',name:'HUD Băng',desc:'Khung giao diện xanh băng',price:150,css:'#4fd8ff'},
 {id:'fx:default', icon:'✨',name:'Hạ gục: Mặc định',desc:'Tia sáng theo màu quái',price:0},
 {id:'fx:confetti',icon:'🎉',name:'Hạ gục: Pháo hoa',desc:'Nổ nhiều màu rực rỡ',price:200},
 {id:'fx:gold',    icon:'🪙',name:'Hạ gục: Mưa vàng',desc:'Mọi vụ nổ đều ánh vàng',price:200}
];
/* Nhiệm vụ mỗi ải: [loại, tham số...]
   acc: chính xác ≥ N% · combo: đạt combo N · perk: nhận N phần thưởng thử thách · ult: dùng Voice Blast
   clean: N đợt không mất máu · kind: quét N quái loại X · wep: hạ N quái bằng súng #i */
const MIS=[
 [['acc',80],['combo',6],['perk',1]],
 [['acc',80],['kind','runner',8],['ult',1]],
 [['clean',2],['wep',2,3],['perk',2]],
 [['acc',85],['kind','tank',4],['combo',9]],
 [['clean',2],['kind','shooter',4],['ult',1]],
 [['acc',90],['wep',3,4],['combo',12]]
];
/* Thử thách hôm nay (đổi theo ngày) */
const DAILY=[
 {id:'blaster',name:'Chỉ dùng Blaster',desc:'Các súng khác bị khoá'},
 {id:'swift',  name:'Quái nhanh ×1.4',desc:'Mọi quái chạy nhanh hơn 40%'},
 {id:'fragile',name:'Máu chỉ còn 60%',desc:'Mỗi sai lầm đều đắt giá'}
];
const MILESTONES=[{n:10,c:60},{n:25,c:120},{n:50,c:220},{n:100,c:400},{n:200,c:800}];

/* ===================== SAVE ===================== */
const KEY='ws_x1';
let X={};try{X=JSON.parse(store.get(KEY)||'{}')||{}}catch(e){X={}}
X.coins=X.coins|0;X.inv=X.inv||{};X.mods=X.mods||{};X.skin=X.skin||{};X.words=X.words||{};
X.mis=X.mis||{};X.daily=X.daily||{};X.ms=X.ms||{};
if(!X.init){X.init=1;X.coins+=CFG.startCoins;X.inv.heal=1}
if(X.music===undefined)X.music=true;
X.skin.hud=X.skin.hud||'hud:violet';X.skin.fx=X.skin.fx||'fx:default';
const save=()=>store.set(KEY,JSON.stringify(X));
const css=h=>'#'+h.toString(16).padStart(6,'0');
const $$=s=>document.querySelector(s);
const today=()=>new Date().toISOString().slice(0,10);
const dailyRule=()=>DAILY[Math.floor(Date.now()/864e5)%DAILY.length];

/* ===================== TRẠNG THÁI MỖI LẦN CHƠI ===================== */
function newRun(){return{coins:0,maxCombo:0,golden:0,ult:0,kind:{},wk:{},cleanWaves:0,waveHurt:false,lastWave:0,daily:null,list:[],p2:false}}
let R=newRun(),pendingDaily=null;

/* ===================== CSS ===================== */
const st=document.createElement('style');
st.textContent=`
.card{backdrop-filter:blur(10px);position:relative}
.card:before{content:"";position:absolute;inset:0;border-radius:24px;padding:1.5px;background:linear-gradient(120deg,#00d2ff,#a66bff,#ff6bd6,#00d2ff);background-size:300% 300%;animation:xborder 7s linear infinite;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;opacity:.75}
@keyframes xborder{to{background-position:300% 0}}
h1{background-size:200% 100%;animation:xtitle 5s ease-in-out infinite alternate}
@keyframes xtitle{to{background-position:100% 0}}
.pick{transform-style:preserve-3d;transform:perspective(700px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .12s,box-shadow .2s;position:relative;overflow:hidden}
.pick:hover{transform:perspective(700px) translateY(-3px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));box-shadow:0 14px 32px rgba(0,0,0,.45)}
.pick:after,.xitem:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--mx,50%) var(--my,0%),rgba(255,255,255,.28),transparent 55%);opacity:0;transition:opacity .2s;pointer-events:none}
.pick:hover:after,.xitem:hover:after{opacity:1}
#stats{background:linear-gradient(135deg,rgba(14,20,48,.72),rgba(30,20,70,.55));border:1px solid var(--line);border-radius:14px;padding:8px 14px;backdrop-filter:blur(6px);box-shadow:0 6px 22px rgba(0,0,0,.35)}
#mission{background:linear-gradient(180deg,rgba(24,30,74,.9),rgba(12,16,40,.88));border-color:color-mix(in srgb,var(--acc) 60%,transparent);box-shadow:0 10px 30px rgba(0,0,0,.35),0 0 24px color-mix(in srgb,var(--acc) 30%,transparent)}
#hp{box-shadow:0 0 12px rgba(46,213,115,.55)}
.slot{backdrop-filter:blur(4px);transition:transform .12s,box-shadow .12s}
.slot:hover{transform:translateY(-3px);box-shadow:0 0 14px var(--acc)}
#xitems .slot.empty{opacity:.35}
#xitems .slot .t{right:3px;left:auto;bottom:0;font-size:12px;color:#ffd34d}
#xcoins{color:#ffd34d;font-size:15px}
#xmusic{pointer-events:auto;cursor:pointer;background:rgba(14,20,48,.7);border:1px solid var(--line);color:#fff;border-radius:8px;font:800 11px Nunito;padding:1px 8px;margin-top:4px}
#xedge{position:fixed;inset:0;pointer-events:none;opacity:0;transition:opacity .4s;z-index:4}
body.xhot #xedge{opacity:1;box-shadow:inset 0 0 120px 10px rgba(255,107,214,.35)}
body.xfire #xedge{opacity:1;box-shadow:inset 0 0 170px 30px rgba(255,150,40,.55);animation:xflick .5s infinite alternate}
@keyframes xflick{to{opacity:.65}}
body.xhot #combo{font-size:20px;text-shadow:0 0 12px #ff6bd6}
body.xfire #combo{font-size:26px;color:#ffb347;text-shadow:0 0 16px #ff7a3d}
#xpop{position:fixed;inset:0;pointer-events:none;z-index:7;overflow:hidden}
.xp{position:absolute;font:800 20px 'Baloo 2',Nunito;text-shadow:0 2px 8px #000,0 0 12px currentColor;animation:xfloat .95s ease-out forwards;white-space:nowrap}
@keyframes xfloat{0%{opacity:0;transform:translate(-50%,-30%) scale(.6)}15%{opacity:1;transform:translate(-50%,-60%) scale(1.25)}100%{opacity:0;transform:translate(-50%,-190%) scale(1)}}
#xmis{position:fixed;top:146px;right:14px;width:214px;background:rgba(14,20,48,.72);border:1px solid var(--line);border-radius:14px;padding:8px 12px;font:700 12.5px Nunito;z-index:5;pointer-events:none;backdrop-filter:blur(6px)}
#xmis .h{font:800 11px Nunito;letter-spacing:.1em;color:var(--mut);margin-bottom:4px}
#xmis div.m{display:flex;justify-content:space-between;gap:6px;line-height:1.5}
#xmis .m.ok{color:var(--ok)}
body.touchui #xmis{display:none}
@media (max-width:760px){#xmis{display:none}}
#xshop{z-index:22}
.xhead{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.xcoin{font:800 22px 'Baloo 2';background:rgba(255,211,77,.12);border:1px solid rgba(255,211,77,.5);border-radius:14px;padding:4px 16px;color:#ffd34d;box-shadow:0 0 18px rgba(255,211,77,.2)}
.xtabs{display:flex;gap:8px;margin:12px 0}
.xtabs button{cursor:pointer;border:1px solid var(--line);background:#1d2656;color:#fff;border-radius:12px;padding:8px 16px;font:800 15px Nunito}
.xtabs button.on{background:linear-gradient(90deg,#7c5cff,#ff6bd6);border-color:transparent}
.xgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
.xitem{position:relative;overflow:hidden;background:linear-gradient(160deg,rgba(40,48,110,.85),rgba(18,22,56,.9));border:1px solid var(--line);border-radius:18px;padding:14px;text-align:center;transform:perspective(700px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .12s,box-shadow .2s;box-shadow:0 10px 24px rgba(0,0,0,.35)}
.xitem:hover{box-shadow:0 16px 34px rgba(0,0,0,.5),0 0 20px color-mix(in srgb,var(--acc) 40%,transparent)}
.xitem.owned{border-color:var(--ok)}
.xico{font-size:46px;line-height:1.1;animation:xspin 4s ease-in-out infinite;display:inline-block;filter:drop-shadow(0 6px 10px rgba(0,0,0,.5))}
@keyframes xspin{0%,100%{transform:rotateY(-25deg) translateY(0)}50%{transform:rotateY(25deg) translateY(-5px)}}
.xn{font:800 17px 'Baloo 2';margin-top:4px}
.xd{font:700 12.5px Nunito;color:#c7cff7;min-height:34px;margin:2px 0 8px}
.xbuy{padding:7px 12px;font-size:14px;border-radius:10px;width:100%}
.xbuy[disabled]{opacity:.45;cursor:not-allowed;box-shadow:none}
.xcnt{position:absolute;top:8px;right:10px;font:800 13px Nunito;background:rgba(0,0,0,.45);border-radius:10px;padding:1px 8px;color:#ffd34d}
.xrow{display:flex;justify-content:space-between;gap:8px;padding:8px 12px;border:1px solid var(--line);border-radius:12px;margin-top:6px;font-weight:700;font-size:14px}
.xrow .b{color:#ff8a95}.xrow .g{color:var(--ok)}
#xrew{margin:6px 0 10px;padding:10px 14px;border:1px solid rgba(255,211,77,.4);background:rgba(255,211,77,.07);border-radius:14px;font-weight:700;font-size:14px;line-height:1.7}
#xrew b{color:#ffd34d}
`;
document.head.appendChild(st);

/* ===================== DOM PHỤ ===================== */
const hudAll=$('hudAll');
const mkEl=(tag,id,cls,html,parent)=>{const e=document.createElement(tag);if(id)e.id=id;if(cls)e.className=cls;if(html)e.innerHTML=html;(parent||document.body).appendChild(e);return e};
const popBox=mkEl('div','xpop');
mkEl('div','xedge','hud','',hudAll);
const misBox=mkEl('div','xmis','hud','',hudAll);
$('stats').insertAdjacentHTML('beforeend','<br><span id="xcoins"></span><br><button id="xmusic"></button>');
const xitems=mkEl('div','xitems','row2');$('dock').insertBefore(xitems,$('weps'));
const shop=mkEl('div','xshop','ov hide',`
 <div class="card"><div class="xhead"><h1>🛒 NEON MARKET</h1><div class="xcoin">🪙 <span id="xbal">0</span></div></div>
 <div class="sub" id="xsub"></div>
 <div class="xtabs"><button data-tab="shop">🛒 Cửa hàng</button><button data-tab="bag">🎒 Túi đồ</button><button data-tab="book">📒 Sổ từ</button></div>
 <div id="xbody"></div>
 <div class="row" style="margin-top:16px"><button class="btn" id="xgo">Tiếp tục ▶</button></div></div>`);
$('end').querySelector('.st').insertAdjacentHTML('afterend','<div id="xrew" class="hide"></div>');
$('nextB').insertAdjacentHTML('afterend','<button class="btn sec" id="xshopB">🛒 Chợ</button>');

/* ===================== COIN · POPUP · FX ===================== */
const _pv=new THREE.Vector3();
function popup(text,color,pos){
  let x=innerWidth/2+(Math.random()-.5)*120,y=innerHeight*.42+(Math.random()-.5)*40;
  if(pos){_pv.copy(pos).project(camera);if(_pv.z>1)return;x=(_pv.x*.5+.5)*innerWidth;y=(-_pv.y*.5+.5)*innerHeight}
  if(popBox.childElementCount>16)popBox.firstChild.remove();
  const e=document.createElement('div');e.className='xp';e.textContent=text;e.style.cssText=`left:${x}px;top:${y}px;color:${color||'#fff'}`;
  e.addEventListener('animationend',()=>e.remove());popBox.appendChild(e)}
function coinHud(){const e=$('xcoins');if(e)e.textContent='🪙 '+X.coins+(R.coins?`  (+${R.coins})`:'')}
function addCoins(n,pos,raw){
  if(!raw&&X.mods.magnet)n=Math.round(n*1.25);
  if(!raw&&R.daily)n*=2;
  X.coins+=n;R.coins+=n;save();coinHud();
  if(pos)popup('+'+n+' 🪙','#ffd34d',pos)}
/* thời gian: hit-stop / slow-mo qua clock.getDelta */
const TS={v:1,tgt:1,hold:0};
const _gd=clock.getDelta.bind(clock);clock.getDelta=()=>_gd()*TS.v;
function timeFx(scale,dur){if(dur>=TS.hold||scale<TS.tgt){TS.tgt=scale;TS.hold=dur}}
/* rung màn hình qua renderer.render */
const sh={amp:0};
function shake(a){sh.amp=Math.min(.9,Math.max(sh.amp,a))}
const _render=renderer.render.bind(renderer);
renderer.render=function(sc,cam){
  if(sh.amp>.002){const ox=(Math.random()-.5)*sh.amp*.5,oy=(Math.random()-.5)*sh.amp*.5;cam.position.x+=ox;cam.position.y+=oy;_render(sc,cam);cam.position.x-=ox;cam.position.y-=oy}
  else _render(sc,cam)};

/* ===================== INVENTORY (ô nhanh 5-8) ===================== */
function renderSlots(){
  xitems.innerHTML=CONS.map((c,i)=>`<div class="slot small ${X.inv[c.id]?'':'empty'}" data-i="${i}" title="${esc(c.name+': '+c.desc)}"><span class="k">${5+i}</span>${c.icon}<span class="t">${X.inv[c.id]|0}</span></div>`).join('')}
xitems.onclick=e=>{const s=e.target.closest('.slot');if(!s)return;e.stopPropagation();useItem(+s.dataset.i)};
function useItem(i){
  if(!S.running||S.paused||S.modal||S.ended)return;
  const c=CONS[i];if(!c)return;
  if(!(X.inv[c.id]>0)){toast(`${c.icon} Hết ${c.name} – mua thêm ở Chợ giữa các ải`,'info',1500);return}
  if(c.use()===false){toast('Không dùng được lúc này','info',1200);return}
  X.inv[c.id]--;save();renderSlots();SFX.skill()}
addEventListener('keydown',e=>{
  if(e.target&&e.target.tagName==='INPUT')return;
  if(e.code==='KeyM'){X.music=!X.music;save();musicBtn();return}
  if(!S.running||S.paused||S.modal||S.ended)return;
  const m=e.code.match(/^(?:Digit|Numpad)([5-8])$/);if(m)useItem(+m[1]-5)});
function musicBtn(){$('xmusic').textContent=X.music?'🎵 Nhạc: BẬT (M)':'🔇 Nhạc: TẮT (M)'}
$('xmusic').onclick=e=>{e.stopPropagation();X.music=!X.music;save();musicBtn()};

/* ===================== MODS / SKINS ===================== */
function applyMods(){
  WEPS[0].armorMul=BASE.armor;WEPS[1].pellets=BASE.pellets;WEPS[2].cd=BASE.railCd;WEPS[3].splash=BASE.splash;
  for(const m of MODS)if(X.mods[m.id])m.apply();S.hudDirty=true}
function applySkin(){
  const s=SKINS.find(k=>k.id===X.skin.hud);document.documentElement.style.setProperty('--acc',(s&&s.css)||'#7c5cff')}
const CONF=[0xff4757,0xffc83d,0x2ed573,0x1e90ff,0xa55eea,0xff6bd6,0x00e5ff];
const _burst=burst;
burst=function(p,color,n,spd){
  const fx=X.skin.fx;
  if(n>=14&&fx==='fx:confetti'){const k=Math.ceil(n/3);for(let i=0;i<3;i++)_burst(p,CONF[(Math.random()*CONF.length)|0],k,spd);return}
  if(n>=14&&fx==='fx:gold')return _burst(p,0xffd34d,n,spd);
  return _burst(p,color,n,spd)};

/* ===================== SỔ TỪ ===================== */
const BOOKQ={gap:1,vocab:1,spell:1,hard:1};
function noteWord(ok){
  const q=S.q;if(!q||q.seq||!q.ans||!BOOKQ[q.type])return;
  const w=X.words[q.ans]||(X.words[q.ans]={ok:0,bad:0,ex:String(q.explain||'').slice(0,90)});
  if(ok)w.ok++;else w.bad++;
  if(ok&&w.ok===1)checkMilestones()}
function learned(){return Object.values(X.words).filter(w=>w.ok>0).length}
function checkMilestones(){
  const n=learned();
  for(const m of MILESTONES)if(n>=m.n&&!X.ms[m.n]){X.ms[m.n]=1;addCoins(m.c,null,true);toast(`📒 Đã học ${m.n} từ! Thưởng +${m.c} 🪙`,'ok',3500);popup(`📒 ${m.n} TỪ! +${m.c}🪙`,'#ffd34d')}
  save()}

/* ===================== NHIỆM VỤ ===================== */
const KN={runner:'Runner',tank:'Tank',shooter:'Sniper',grunt:'Grunt'};
const pct=()=>S.ok+S.bad?Math.round(S.ok/(S.ok+S.bad)*100):0;
function mkMission(sp){
  const [t,a,b]=sp;
  if(t==='acc')  return{txt:`Chính xác ≥ ${a}%`,prog:()=>pct()+'%',ok:()=>S.ok+S.bad>0&&pct()>=a};
  if(t==='combo')return{txt:`Đạt combo x${a}`,prog:()=>`${R.maxCombo}/${a}`,ok:()=>R.maxCombo>=a};
  if(t==='perk') return{txt:`Nhận ${a} phần thưởng thử thách`,prog:()=>`${S.perks.length}/${a}`,ok:()=>S.perks.length>=a};
  if(t==='ult')  return{txt:'Dùng Voice Blast (đọc to) 1 lần',prog:()=>`${R.ult}/1`,ok:()=>R.ult>=1};
  if(t==='clean')return{txt:`${a} đợt không mất máu`,prog:()=>`${R.cleanWaves}/${a}`,ok:()=>R.cleanWaves>=a};
  if(t==='kind') return{txt:`Quét ${b} quái ${KN[a]}`,prog:()=>`${R.kind[a]|0}/${b}`,ok:()=>(R.kind[a]|0)>=b};
  if(t==='wep')  return{txt:`Hạ ${b} quái bằng ${WEPS[a].name}`,prog:()=>`${R.wk[a]|0}/${b}`,ok:()=>(R.wk[a]|0)>=b};
  return{txt:'?',prog:()=>'',ok:()=>false}}
function genMissions(i){R.list=(MIS[i]||MIS[MIS.length-1]).map(mkMission)}
function renderMis(){
  if(!S.running||S.ended||!R.list.length){misBox.style.display='none';return}
  misBox.style.display='';
  misBox.innerHTML='<div class="h">🎯 NHIỆM VỤ ẢI'+(R.daily?' · 📅':'')+'</div>'+R.list.map(m=>{const ok=m.ok();return`<div class="m ${ok?'ok':''}"><span>${ok?'✔':'○'} ${m.txt}</span><span>${m.prog()}</span></div>`}).join('')}
setInterval(renderMis,500);

/* ===================== WRAP: LUỒNG GAME ===================== */
const _startStage=startStage;
startStage=function(i){
  const d=pendingDaily;pendingDaily=null;
  _startStage(i);
  R=newRun();R.daily=d;
  applyMods();
  if(d==='blaster'){S.wepCount=1;S.wep=0}
  if(d==='fragile'){S.maxHp=Math.round(S.maxHp*.6);S.hp=S.maxHp}
  S.hudDirty=true;genMissions(i);renderSlots();coinHud();renderMis();musicBtn();
  setTimeout(()=>{if(S.running&&!S.ended)toast('🎯 Nhiệm vụ ải: xem khung bên phải · Túi đồ: phím 5-8','info',4200)},4200);
  if(d){const r=DAILY.find(x=>x.id===d);setTimeout(()=>{if(S.running&&!S.ended)banner('📅 THỬ THÁCH HÔM NAY',r.name+' · xu ×2')},1200)}};

const _qd=questionDone;
questionDone=function(root){
  const gold=!!(S.q&&S.q.golden),wasBoss=S.boss;
  const s0=S.score;_pv.set(0,0,0);
  const pos=root?root.getWorldPosition(new THREE.Vector3()):null;if(pos)pos.y+=2;
  _qd(root);
  R.maxCombo=Math.max(R.maxCombo,S.combo);if(gold)R.golden++;
  noteWord(true);
  const got=S.score-s0;if(got>0)popup('+'+got,gold?'#ffd34d':'#8fe3ff',pos);
  addCoins(CFG.coinPerQ+Math.min(S.combo,CFG.comboCap)*CFG.coinPerCombo+(gold?CFG.coinGolden:0),pos);
  timeFx(CFG.slowMo,.32);shake(gold?.22:.12);
  if(wasBoss){
    if(!BOSS){addCoins(CFG.coinBoss,null);shake(.9);timeFx(.22,.9);popup('👹 BOSS HẠ GỤC! +'+CFG.coinBoss+'🪙','#ffd34d')}
    else bossPhase2()}};
function bossPhase2(){
  const u=BOSS.userData;
  if(u.p2||u.hp<=0||u.hp>Math.ceil(bossQ()/2)||bossQ()<4)return;
  u.p2=true;R.p2=true;u.speed*=1.3;u.dmg+=6;u.ranged=true;u.shotCd=Math.min(u.shotCd||3,1);
  try{u.shield.material.color.setHex(0xff2e63)}catch(e){}
  banner('🔥 GIAI ĐOẠN 2','Boss nổi giận: nhanh hơn, bắn rát hơn!');SFX.wave();shake(.7);
  _pv.copy(BOSS.position);_pv.y=1.5;shock(_pv,0xff2e63,26);burst(_pv,0xff2e63,50,10)}

const _oht=onHitTarget;
onHitTarget=function(root,dmg){
  const u=root&&root.userData;if(!u)return _oht(root,dmg);
  const was=!!u.dying,bad0=S.bad;
  _oht(root,dmg);
  if(S.bad>bad0){noteWord(false);const p=root.getWorldPosition(new THREE.Vector3());p.y+=2;popup('✖','#ff6b81',p)}
  if(!was&&u.dying&&!u.isOrb&&!u.isBoss){R.wk[S.wep]=(R.wk[S.wep]|0)+1;if(TS.hold<=0)timeFx(.12,CFG.hitStop)}};

const _kb=killBot;
killBot=function(b,good){
  const u=b&&b.userData;
  if(u&&!u.dying&&!u.isOrb&&!u.isBoss&&u.kind)R.kind[u.kind]=(R.kind[u.kind]|0)+1;
  return _kb(b,good)};

const _hurt=hurt;
hurt=function(n){
  const h0=S.hp;_hurt(n);
  const d=h0-S.hp;if(d>0){R.waveHurt=true;shake(Math.min(.55,.14+d*.02));popup('-'+Math.round(d),'#ff6b81')}};

const _aq=afterQuestion;
afterQuestion=function(){
  _aq();
  if(!S.boss&&S.waveIdx>R.lastWave){if(!R.waveHurt)R.cleanWaves++;R.waveHurt=false;R.lastWave=S.waveIdx}};

const _vs=voiceSuccess;
voiceSuccess=function(){R.ult++;_vs()};

const _fire=fire;
fire=function(){const c=S.fireCd;_fire();if(S.fireCd>c){shake(S.wep>=2?.1:.035)}};

const _mb=makeBot;
makeBot=function(w,k,c,s){const g=_mb(w,k,c,s);if(R.daily==='swift')g.userData.speed*=1.4;return g};

const _bm=buildMenu;
buildMenu=function(){
  _bm();
  document.querySelectorAll('#stages .pick').forEach((el,i)=>{
    const b=X.mis[TRK+'_'+i]|0;const s=el.querySelector('.stars');if(s)s.insertAdjacentHTML('beforeend',`<span style="margin-left:8px;color:#8fe3ff">🎯 ${b}/3</span>`)});
  const mc=$('xmenuCoin');if(mc)mc.textContent=X.coins};

/* kết thúc ải: thưởng + màn hình */
const _end=endStage;
endStage=function(win){
  const was=S.ended;_end(win);if(was)return;
  const lines=[];let total=0;
  const acc=S.ok+S.bad?S.ok/(S.ok+S.bad):0,stars=win?(acc>=.9?3:acc>=.7?2:1):0;
  if(win){total+=CFG.clearBonus+CFG.starBonus*stars;lines.push(`🏁 Qua ải: <b>+${CFG.clearBonus}</b> · ${stars}★: <b>+${CFG.starBonus*stars}</b>`)}
  let okN=0;const ml=R.list.map(m=>{const ok=win&&m.ok();if(ok)okN++;return`<div>${ok?'✔':'✖'} ${m.txt}</div>`}).join('');
  if(R.list.length){
    total+=okN*CFG.missionReward;
    lines.push(`🎯 Nhiệm vụ ${okN}/${R.list.length}: <b>+${okN*CFG.missionReward}</b>${ml}`);
    if(win&&okN===R.list.length){total+=CFG.allMissionsBonus;const c=CONS[Math.random()*CONS.length|0];X.inv[c.id]=Math.min(CFG.invCap,(X.inv[c.id]|0)+1);lines.push(`🌟 Đủ 3 nhiệm vụ: <b>+${CFG.allMissionsBonus}</b> và 1 ${c.icon} ${c.name}`)}
    const k=TRK+'_'+S.stage;if(win)X.mis[k]=Math.max(X.mis[k]|0,okN)}
  if(R.daily){
    if(win&&X.daily.last!==today()){X.daily.last=today();total+=CFG.dailyBonus;lines.push(`📅 Thử thách hôm nay: <b>+${CFG.dailyBonus}</b>`)}
    else if(win)lines.push('📅 Thử thách hôm nay (đã nhận thưởng ngày)')}
  if(total)addCoins(total,null,true);
  const box=$('xrew');
  box.innerHTML=`🪙 Trong ải: <b>+${R.coins-total}</b>${lines.length?'<br>'+lines.join('<br>'):''}<br>Số dư: <b>${X.coins}</b> 🪙`;
  box.classList.remove('hide');save();coinHud();
  $('xshopB').textContent='🛒 Chợ ('+X.coins+'🪙)'};

/* ===================== SHOP UI ===================== */
let shopNext=null,tab='shop';
function openShop(next){
  shopNext=next||null;tab='shop';
  $('xgo').textContent=next?'Tiếp tục ▶ Ải kế tiếp':'Đóng';
  $('xsub').textContent=next?'Mua sắm trước khi vào ải tiếp theo. Xu kiếm được khi trả lời đúng, hạ boss và hoàn thành nhiệm vụ.':'Chợ & Túi đồ – dùng xu kiếm được khi chơi.';
  shop.classList.remove('hide');renderShop();try{ac()}catch(e){}}
function closeShop(){shop.classList.add('hide');const n=shopNext;shopNext=null;buildMenu();if(n)n()}
function itemCard(it,o){
  return`<div class="xitem ${o.owned?'owned':''}"><div class="xico">${it.icon}</div>${o.cnt!==undefined?`<div class="xcnt">×${o.cnt}</div>`:''}<div class="xn">${esc(it.name)}</div><div class="xd">${esc(it.desc)}</div>
  <button class="btn xbuy ${o.sec?'sec':''}" data-act="${o.act}" data-id="${it.id}" ${o.dis?'disabled':''}>${o.label}</button></div>`}
function renderShop(){
  $('xbal').textContent=X.coins;
  shop.querySelectorAll('.xtabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
  const body=$('xbody');
  if(tab==='shop'){
    body.innerHTML=`<h3>Vật phẩm dùng 1 lần (phím 5-8 trong ải)</h3><div class="xgrid">${CONS.map(c=>{const n=X.inv[c.id]|0,full=n>=CFG.invCap;
      return itemCard(c,{cnt:n,act:'buyc',dis:full||X.coins<c.price,label:full?'Đầy túi':`Mua · ${c.price} 🪙`})}).join('')}</div>
    <h3>Nâng cấp vĩnh viễn</h3><div class="xgrid">${MODS.map(m=>{const has=!!X.mods[m.id];
      return itemCard(m,{owned:has,act:'buym',dis:has||X.coins<m.price,label:has?'✔ Đã sở hữu':`Mua · ${m.price} 🪙`})}).join('')}</div>
    <h3>Giao diện & hiệu ứng</h3><div class="xgrid">${SKINS.map(k=>{const grp=k.id.split(':')[0],own=k.price===0||X.mods['s_'+k.id],eq=X.skin[grp]===k.id;
      return itemCard(k,{owned:eq,sec:own&&!eq,act:own?'equip':'buys',dis:eq||(!own&&X.coins<k.price),label:eq?'✔ Đang dùng':own?'Dùng':`Mua · ${k.price} 🪙`})}).join('')}</div>`}
  if(tab==='bag'){
    body.innerHTML=`<h3>Ô nhanh trong ải (phím 5 · 6 · 7 · 8)</h3><div class="xgrid">${CONS.map((c,i)=>`<div class="xitem ${X.inv[c.id]?'owned':''}"><div class="xico">${c.icon}</div><div class="xcnt">×${X.inv[c.id]|0}</div><div class="xn">Phím ${5+i} · ${esc(c.name)}</div><div class="xd">${esc(c.desc)}</div></div>`).join('')}</div>
    <h3>Nâng cấp đang có</h3>${MODS.filter(m=>X.mods[m.id]).map(m=>`<div class="xrow"><span>${m.icon} ${esc(m.name)}</span><span class="g">${esc(m.desc)}</span></div>`).join('')||'<div class="sub">Chưa có – mua ở tab Cửa hàng.</div>'}
    <h3>Thử thách hôm nay</h3><div class="xrow"><span>📅 ${esc(dailyRule().name)}</span><span>${X.daily.last===today()?'✔ đã nhận thưởng':'thưởng +'+CFG.dailyBonus+' 🪙 · xu ×2'}</span></div>`}
  if(tab==='book'){
    const ws=Object.entries(X.words),n=learned();
    const need=ws.filter(([,w])=>w.bad>0&&w.bad>=w.ok).sort((a,b)=>b[1].bad-a[1].bad).slice(0,14);
    const nxt=MILESTONES.find(m=>!X.ms[m.n]);
    body.innerHTML=`<div class="st" style="grid-template-columns:repeat(3,1fr)"><div><b>${n}</b>Từ đã đúng</div><div><b>${need.length}</b>Cần ôn</div><div><b>${nxt?nxt.n:'MAX'}</b>Mốc kế tiếp${nxt?` (+${nxt.c}🪙)`:''}</div></div>
    <h3>Từ hay sai – ôn lại ngay</h3>${need.map(([w,v])=>`<div class="xrow"><span><b>${esc(w)}</b> <span class="b">✖${v.bad}</span> <span class="g">✔${v.ok}</span></span><span style="color:#c7cff7">${esc(v.ex)}</span></div>`).join('')||'<div class="sub">Chưa có từ nào cần ôn – tuyệt vời! Chơi thêm để sổ tự ghi lại.</div>'}`}
}
shop.querySelector('.xtabs').onclick=e=>{const b=e.target.closest('button');if(b){tab=b.dataset.tab;renderShop()}};
$('xbody').onclick=e=>{
  const b=e.target.closest('[data-act]');if(!b||b.disabled)return;
  const id=b.dataset.id,act=b.dataset.act;try{ac()}catch(e){}
  if(act==='buyc'){const c=CONS.find(x=>x.id===id);if(X.coins>=c.price&&(X.inv[id]|0)<CFG.invCap){X.coins-=c.price;X.inv[id]=(X.inv[id]|0)+1}}
  if(act==='buym'){const m=MODS.find(x=>x.id===id);if(X.coins>=m.price&&!X.mods[id]){X.coins-=m.price;X.mods[id]=1}}
  if(act==='buys'){const k=SKINS.find(x=>x.id===id);if(X.coins>=k.price&&!X.mods['s_'+id]){X.coins-=k.price;X.mods['s_'+id]=1;X.skin[id.split(':')[0]]=id}}
  if(act==='equip'){X.skin[id.split(':')[0]]=id}
  save();applySkin();SFX.ok();renderShop();coinHud()};
$('xgo').onclick=closeShop;
$('xshopB').onclick=()=>openShop(null);
$('nextB').onclick=()=>openShop(()=>startStage(S.stage+1));

/* nút ở menu */
(function(){
  const row=$('startB').parentElement,sub=$('menu').querySelector('.sub');
  sub.insertAdjacentHTML('afterend','<div class="sub">🪙 Lexi Coin: <b id="xmenuCoin" style="color:#ffd34d"></b> · Kiếm xu khi trả lời đúng, mua đồ ở Chợ giữa các ải · 🎯 mỗi ải có 3 nhiệm vụ</div>');
  const sb=mkEl('button','xmenuShop','btn sec','🛒 Chợ & Túi đồ',row);$('startB').after(sb);sb.onclick=()=>openShop(null);
  const d=dailyRule(),db=mkEl('button','xdaily','btn sec',`📅 Hôm nay: ${d.name}`,row);sb.after(db);
  db.title=d.desc+' · xu ×2 · thưởng +'+CFG.dailyBonus+' 🪙 một lần/ngày';
  db.onclick=()=>{pendingDaily=d.id;startStage(STG)};
})();

/* ===================== COMBO FX + NHẠC ĐỘNG ===================== */
setInterval(()=>{
  const on=S.running&&!S.ended;
  document.body.classList.toggle('xhot',on&&S.combo>=5&&S.combo<8);
  document.body.classList.toggle('xfire',on&&S.combo>=8)},150);
const SCALES=[[0,3,5,7,10],[0,2,4,7,9],[0,2,3,7,8],[0,3,5,6,10],[0,1,5,7,8],[0,2,4,6,9]];
const ROOTS=[110,98,123.47,87.31,103.83,116.54];
let mStep=0;
function musicTick(){
  let next=230;
  try{
    if(X.music&&typeof AC!=='undefined'&&AC&&AC.state==='running'&&S.running&&!S.paused&&!S.modal&&!S.ended){
      const i=S.stage%6,sc=SCALES[i],root=ROOTS[i],V=CFG.musicVol;
      const fq=(n,o)=>root*o*Math.pow(2,sc[((n%sc.length)+sc.length)%sc.length]/12);
      next=225-Math.min(S.combo,10)*7-(S.boss?25:0);
      const bass=[0,0,3,0,4,0,3,2][mStep%8];
      tone(fq(bass,.5),.2,'triangle',.05*V);
      if(mStep%4===0)tone(130,.12,'sine',.06*V,45);
      if(S.combo>=3||S.boss)tone(fq((mStep*3)%7,2),.11,'square',.016*V);
      if(S.combo>=6)noise(.03,.02*V,7000);
      if(S.boss&&mStep%8===0)tone(root,.9,'sawtooth',.012*V);
      if(S.hp<S.maxHp*.35&&(mStep%8===0||mStep%8===3))tone(55,.2,'sine',.08*V,38);
      mStep++}
  }catch(e){}
  setTimeout(musicTick,next)}
musicTick();

/* ===================== BỐI CẢNH 3D MỖI ẢI ===================== */
const ANIM=[];
function glowTex(hex){
  const k=new THREE.Color(hex),c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
  const rgb=`${k.r*255|0},${k.g*255|0},${k.b*255|0}`,gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,`rgba(${rgb},1)`);gr.addColorStop(.3,`rgba(${rgb},.55)`);gr.addColorStop(1,`rgba(${rgb},0)`);
  g.fillStyle=gr;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
function textTex(text,o){
  o=o||{};const w=o.w||256,h=o.h||128,c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
  g.font=o.font||"800 70px 'Baloo 2',Nunito,sans-serif";g.textAlign='center';g.textBaseline='middle';
  if(o.glow){g.shadowColor=o.glow;g.shadowBlur=20}
  g.fillStyle=o.color||'#fff';g.fillText(text,w/2,h/2);g.fillText(text,w/2,h/2);return new THREE.CanvasTexture(c)}
function winTex(col){
  const c=document.createElement('canvas');c.width=64;c.height=128;const g=c.getContext('2d');g.fillStyle='#0b0e22';g.fillRect(0,0,64,128);
  for(let y=4;y<124;y+=8)for(let x=4;x<60;x+=8)if(Math.random()<.42){g.fillStyle=Math.random()<.18?'#ffffff':col;g.globalAlpha=.5+Math.random()*.5;g.fillRect(x,y,4,5)}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function skyline(g,th,R,count,rMin,rMax,hMin,hMax){
  const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({map:winTex(css(th.trim))}),count);
  const d=new THREE.Object3D(),col=new THREE.Color(),wall=new THREE.Color(th.wall),fog=new THREE.Color(th.fog);
  for(let i=0;i<count;i++){
    const a=i/count*Math.PI*2+R()*.08,r=rMin+R()*(rMax-rMin),h=hMin+R()*(hMax-hMin),w=7+R()*11,dd=7+R()*11;
    d.position.set(Math.cos(a)*r,h/2-3,Math.sin(a)*r);d.rotation.set(0,-a+R()*.4,0);d.scale.set(w,h,dd);d.updateMatrix();
    im.setMatrixAt(i,d.matrix);col.copy(wall).lerp(fog,.2+R()*.4).multiplyScalar(1.6);im.setColorAt(i,col)}
  im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.frustumCulled=false;g.add(im);return im}
const boxG=new THREE.BoxGeometry(1,1,1);
const mesh=(geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);return m};
const bas=(c,o)=>new THREE.MeshBasicMaterial(Object.assign({color:c},o||{}));
const hideOut=g=>{const o=arena.children.find(x=>x.geometry&&x.geometry.parameters&&x.geometry.parameters.width===500);if(o)o.visible=false};
function orbit(m,r,y,sp,ph,bob){let a=ph;ANIM.push((dt,t)=>{a+=sp*dt;m.position.set(Math.cos(a)*r,y+(bob?Math.sin(t*.8+ph)*bob:0),Math.sin(a)*r);m.rotation.y=-a})}

const PROPS=[
/* 0 Neon Plaza: phố đêm, biển hiệu, xe bay */
(g,th,R)=>{
  skyline(g,th,R,70,78,128,28,100);
  ['OPEN','LEXI','WORD','24H','STRIKE','NEON'].forEach((w,i)=>{
    const a=i/6*Math.PI*2+.3,tex=textTex(w,{glow:css(th.pal[i%5]),color:'#fff',font:"800 80px 'Baloo 2',Nunito,sans-serif"});
    const m=mesh(new THREE.PlaneGeometry(15,7.5),bas(0xffffff,{map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false}),Math.cos(a)*42,11+R()*6,Math.sin(a)*42);
    m.lookAt(0,m.position.y,0);g.add(m);ANIM.push((dt,t)=>{m.material.opacity=.72+Math.sin(t*3+i*2)*.28})});
  for(let i=0;i<7;i++){
    const car=new THREE.Group();car.add(mesh(boxG,bas(th.pal[i%5]),0,0,0));car.children[0].scale.set(3.4,.8,1.5);
    const l1=mesh(boxG,bas(0xffffff),1.8,0,.4),l2=mesh(boxG,bas(0xff2e63),-1.8,0,.4);l1.scale.set(.2,.3,.3);l2.scale.set(.2,.3,.3);car.add(l1,l2);
    g.add(car);let a=R()*6.28;const r=48+R()*26,y=14+R()*14,sp=(.12+R()*.1)*(i%2?1:-1);
    ANIM.push(dt=>{a+=sp*dt;car.position.set(Math.cos(a)*r,y,Math.sin(a)*r);car.rotation.y=-a+(sp>0?0:Math.PI)})}
},
/* 1 Cyber Docks: cảng, container, cần cẩu, mặt nước */
(g,th,R)=>{
  skyline(g,th,R,36,95,135,22,60);hideOut();
  const wc=document.createElement('canvas');wc.width=wc.height=128;const wg=wc.getContext('2d');wg.fillStyle='#0b3d47';wg.fillRect(0,0,128,128);
  wg.strokeStyle='rgba(120,240,230,.35)';wg.lineWidth=2;for(let y=8;y<128;y+=16){wg.beginPath();for(let x=0;x<=128;x+=8)wg.lineTo(x,y+Math.sin(x/10+y)*3);wg.stroke()}
  const wt=new THREE.CanvasTexture(wc);wt.wrapS=wt.wrapT=THREE.RepeatWrapping;wt.repeat.set(50,50);
  const water=mesh(new THREE.PlaneGeometry(500,500),bas(0xffffff,{map:wt}),0,-.01,0);water.rotation.x=-Math.PI/2;g.add(water);
  ANIM.push(dt=>{wt.offset.x+=dt*.02;wt.offset.y+=dt*.012});
  for(let i=0;i<26;i++){const a=R()*6.28,r=38+R()*16,n=1+(R()*3|0);
    for(let k=0;k<n;k++){const m=mesh(boxG,lam(th.pal[(i+k)%5]),Math.cos(a)*r,1.6+k*3.2,Math.sin(a)*r);m.scale.set(12,3,3.6);m.rotation.y=-a+Math.PI/2;g.add(m)}}
  for(let i=0;i<4;i++){const a=i/4*6.28+.4,r=58,cx=Math.cos(a)*r,cz=Math.sin(a)*r,crane=new THREE.Group();
    const dark=bas(0x1c2a33);[-6,6].forEach(o=>{const l=mesh(boxG,dark,o,22,0);l.scale.set(1.2,44,1.2);crane.add(l)});
    const beam=mesh(boxG,dark,0,44,0);beam.scale.set(34,2,2);crane.add(beam);
    const lamp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(0xff3b3b),blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));lamp.scale.set(8,8,1);lamp.position.set(-16,46,0);crane.add(lamp);
    crane.position.set(cx,0,cz);crane.rotation.y=-a+Math.PI/2;g.add(crane);ANIM.push((dt,t)=>{lamp.material.opacity=.5+.5*Math.sin(t*2+i)})}
},
/* 2 Sky Lab: phòng thí nghiệm trên mây, tháp kính, vòng quay */
(g,th,R)=>{
  hideOut();
  const sea=mesh(new THREE.PlaneGeometry(500,500),bas(0xe8f4ff),0,-14,0);sea.rotation.x=-Math.PI/2;g.add(sea);
  const ct=glowTex(0xffffff);
  for(let i=0;i<38;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:ct,transparent:true,opacity:.75,depthWrite:false,fog:false}));
    const a=R()*6.28,r=48+R()*95;s.position.set(Math.cos(a)*r,-8+R()*34,Math.sin(a)*r);const sc=22+R()*36;s.scale.set(sc*1.8,sc*.7,1);g.add(s);
    ANIM.push(dt=>{s.position.x+=dt*.6;if(s.position.x>150)s.position.x=-150})}
  for(let i=0;i<9;i++){const a=i/9*6.28+R()*.3,r=52+R()*22,h=26+R()*34;
    const t=mesh(boxG,bas(th.pal[1],{transparent:true,opacity:.32,depthWrite:false}),Math.cos(a)*r,h/2-2,Math.sin(a)*r);t.scale.set(9,h,9);g.add(t);
    const e=new THREE.LineSegments(new THREE.EdgesGeometry(boxG),new THREE.LineBasicMaterial({color:th.trim}));e.position.copy(t.position);e.scale.copy(t.scale);g.add(e)}
  for(let i=0;i<3;i++){const ring=mesh(new THREE.TorusGeometry(38+i*9,.35,6,72),bas(th.trim),0,30+i*7,0);ring.rotation.x=Math.PI/2+.25*(i-1);g.add(ring);
    ANIM.push((dt)=>{ring.rotation.z+=dt*(.12+i*.05)*(i%2?-1:1)})}
},
/* 3 Frozen Archive: băng tuyết, sách bay */
(g,th,R)=>{
  skyline(g,th,R,28,100,140,18,46);
  const ice=bas(th.pal[1],{transparent:true,opacity:.5,depthWrite:false});
  for(let i=0;i<22;i++){const a=R()*6.28,r=38+R()*30,h=8+R()*20,c=mesh(new THREE.ConeGeometry(2+R()*3,h,6),ice,Math.cos(a)*r,h/2-1,Math.sin(a)*r);c.rotation.z=(R()-.5)*.25;g.add(c)}
  for(let i=0;i<18;i++){const b=new THREE.Group(),cover=mesh(boxG,lam(th.pal[i%5]),0,0,0);cover.scale.set(2.2,.5,3);const pg=mesh(boxG,bas(0xffffff),0,.05,0);pg.scale.set(2,.42,2.8);b.add(cover,pg);g.add(b);
    orbit(b,34+R()*18,8+R()*16,.06+R()*.06,R()*6.28,1.5);ANIM.push((dt,t)=>{b.rotation.z=Math.sin(t+i)*.4;b.rotation.x+=dt*.5})}
  const N=520,pos=new Float32Array(N*3);for(let i=0;i<N;i++){pos[i*3]=(R()-.5)*100;pos[i*3+1]=R()*34;pos[i*3+2]=(R()-.5)*100}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  g.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.45,transparent:true,opacity:.85,fog:false})));
  ANIM.push(dt=>{const p=sg.attributes.position.array;for(let i=0;i<N;i++){p[i*3+1]-=dt*(2+(i%5)*.4);p[i*3]+=Math.sin(i+p[i*3+1])*dt*.4;if(p[i*3+1]<0)p[i*3+1]=34}sg.attributes.position.needsUpdate=true})
},
/* 4 Glitch Core: lõi dữ liệu vỡ, tia đỏ, mưa số */
(g,th,R)=>{
  skyline(g,th,R,40,90,135,25,80);
  const cubes=[];
  for(let i=0;i<22;i++){const cu=new THREE.Group(),s=2+R()*5;
    const ed=new THREE.LineSegments(new THREE.EdgesGeometry(boxG),new THREE.LineBasicMaterial({color:th.pal[i%3]}));ed.scale.setScalar(s);
    const so=mesh(boxG,bas(th.pal[i%3],{transparent:true,opacity:.12,depthWrite:false}),0,0,0);so.scale.setScalar(s);cu.add(ed,so);
    const a=R()*6.28,r=40+R()*40;cu.position.set(Math.cos(a)*r,6+R()*28,Math.sin(a)*r);g.add(cu);cubes.push(cu)}
  let jt=0;ANIM.push((dt,t)=>{jt+=dt;cubes.forEach((c,i)=>{c.rotation.x+=dt*(.2+i%3*.1);c.rotation.y+=dt*.3;if(jt>.12&&Math.random()<.08){c.position.x+=(Math.random()-.5)*2.4;c.visible=Math.random()>.12}});if(jt>.12)jt=0});
  for(let i=0;i<8;i++){const a=i/8*6.28,r=46+R()*18,b=mesh(new THREE.CylinderGeometry(.3,.3,90,6),bas(th.trim,{transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}),Math.cos(a)*r,40,Math.sin(a)*r);g.add(b);
    ANIM.push((dt,t)=>{b.material.opacity=.2+.25*Math.abs(Math.sin(t*1.7+i))})}
  const rc=document.createElement('canvas');rc.width=64;rc.height=256;const rg=rc.getContext('2d');rg.font='700 14px monospace';
  for(let y=10;y<256;y+=16)for(let x=4;x<64;x+=14){rg.fillStyle=`rgba(255,${60+R()*100|0},${100+R()*120|0},${.25+R()*.75})`;rg.fillText(R()<.5?'0':'1',x,y)}
  const rt=new THREE.CanvasTexture(rc);rt.wrapS=rt.wrapT=THREE.RepeatWrapping;rt.repeat.set(3,2);
  for(let i=0;i<10;i++){const a=i/10*6.28+.2,p=mesh(new THREE.PlaneGeometry(14,48),bas(0xffffff,{map:rt,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}),Math.cos(a)*56,24,Math.sin(a)*56);p.lookAt(0,24,0);g.add(p)}
  ANIM.push(dt=>{rt.offset.y-=dt*.35})
},
/* 5 Grammar Throne: ngai vàng, chữ khổng lồ, dấu câu bay */
(g,th,R)=>{
  skyline(g,th,R,34,95,135,24,70);
  ['A','B','C','?','!','"',',','.'].forEach((ch,i)=>{
    const a=i/8*6.28+.2,tex=textTex(ch,{w:256,h:256,font:"800 220px 'Baloo 2',Nunito,serif",glow:'#ffc83d',color:'#ffd878'});
    const m=mesh(new THREE.PlaneGeometry(16,16),bas(0xffffff,{map:tex,transparent:true,side:THREE.DoubleSide,depthWrite:false}),Math.cos(a)*52,12+R()*6,Math.sin(a)*52);m.lookAt(0,m.position.y,0);g.add(m);
    ANIM.push((dt,t)=>{m.position.y+=Math.sin(t*.9+i)*dt*.8;m.material.opacity=.7+.3*Math.sin(t*1.5+i)})});
  const gold=bas(th.trim),purple=lam(th.wall);
  for(let k=0;k<5;k++){const s=mesh(boxG,purple,0,k*1.6,-78-k*3);s.scale.set(34-k*5,3.2,10);g.add(s);const tr=mesh(boxG,gold,0,k*1.6+1.6,-78-k*3);tr.scale.set(34.2-k*5,.25,10.2);g.add(tr)}
  const back=mesh(boxG,purple,0,22,-94);back.scale.set(18,34,3);g.add(back);const crown=mesh(new THREE.ConeGeometry(4,8,5),gold,0,43,-94);g.add(crown);
  const gl=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(th.trim),blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));gl.scale.set(60,60,1);gl.position.set(0,26,-90);g.add(gl);
}
];

/* các từ vựng lơ lửng như hạt sáng – mọi ải */
function floatingWords(g,th){
  if(qLevel==='ultra'||!TR||!TR.voice)return;
  const ws=shuffle(TR.voice).slice(0,14);
  ws.forEach((w,i)=>{
    const tex=textTex(w[0],{w:384,h:96,font:"800 56px 'Baloo 2',Nunito,sans-serif",color:'#fff',glow:css(th.pal[i%5])});
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
    s.scale.set(11,2.8,1);const a=Math.random()*6.28,r=44+Math.random()*50;let y=6+Math.random()*26;s.position.set(Math.cos(a)*r,y,Math.sin(a)*r);g.add(s);
    ANIM.push((dt,t)=>{y+=dt*.8;if(y>36)y=5;s.position.y=y+Math.sin(t+i)*.6})})}
/* mặt trời / hành tinh phía chân trời */
function sunDisc(g,th){
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(th.pal[2]),blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));
  s.scale.set(110,110,1);s.position.set(-70,42,-175);g.add(s)}

const _ba=buildArena;
buildArena=function(stg,idx){
  _ba(stg,idx);
  ANIM.length=0;
  try{
    const th=stg.th,R=seeded((idx+3)*104729);
    sunDisc(arena,th);
    if(qLevel==='ultra'){skyline(arena,th,R,30,80,125,26,80)}
    else{(PROPS[idx]||PROPS[0])(arena,th,R);floatingWords(arena,th)}
  }catch(e){console.warn('[WS extras] props lỗi:',e)}};

/* vòng cập nhật phụ: bối cảnh + thời gian + rung */
let _lt=performance.now();
(function xloop(){
  requestAnimationFrame(xloop);
  const now=performance.now(),rdt=Math.min(.1,(now-_lt)/1000);_lt=now;const t=now/1000;
  if(TS.hold>0){TS.hold-=rdt;TS.v=TS.tgt}else{TS.v+=(1-TS.v)*Math.min(1,rdt*9);TS.tgt=1;if(Math.abs(1-TS.v)<.01)TS.v=1}
  sh.amp*=Math.exp(-rdt*8);
  for(let i=0;i<ANIM.length;i++)ANIM[i](rdt,t)
})();

/* hiệu ứng nghiêng 3D khi rê chuột vào thẻ */
document.addEventListener('mousemove',e=>{
  const el=e.target.closest&&e.target.closest('.pick,.xitem');if(!el)return;
  const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
  el.style.setProperty('--ry',((px-.5)*10).toFixed(1)+'deg');el.style.setProperty('--rx',((.5-py)*8).toFixed(1)+'deg');
  el.style.setProperty('--mx',(px*100)+'%');el.style.setProperty('--my',(py*100)+'%')},{passive:true});
document.addEventListener('mouseout',e=>{const el=e.target.closest&&e.target.closest('.pick,.xitem');if(el){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')}},{passive:true});

/* ===================== KHỞI TẠO ===================== */
applySkin();musicBtn();renderSlots();coinHud();
buildMenu();
buildArena(STAGES[0],0);           // dựng lại nền menu cùng bối cảnh mới
window.__WSX={X,get R(){return R},openShop,addCoins,CONS,MODS,MIS,shake,timeFx};
console.log('[WS extras] đã nạp: shop · túi đồ · nhiệm vụ · hiệu ứng · bối cảnh 3D');
})();
