/* =====================================================================
   WORD STRIKE 3D – VÒNG QUAY BIG CHANCE (gacha, 100% miễn phí: chỉ dùng Xu kiếm được)
   · Tham số ở data/ws-gacha.js (window.WS_GACHA); sai dữ liệu thì dùng mặc định + cảnh báo, không bao giờ quay với tỉ lệ sai.
   · Thiết kế: design/gdd/big-chance-gacha.md. Kết quả được TÍNH và LƯU (ws_x1) trước khi chạy hiệu ứng; đóng tab giữa chừng thì lần sau phát lại từ X.gacha.pending.
   · Chỉ cho ra trang phục (chỉ đổi ngoại hình). Bộ trùng hoàn xu bằng addCoins(n,pos,raw=true) (không nhân nam châm/thử thách ngày).
   · Lượt miễn phí mỗi ngày: trả lời đúng 1 câu KHÓ (makeQ('hard')); sai thì xem lời giải rồi thử câu khác.
   Nạp SAU ws-outfits.js. Hiệu ứng là lớp DOM/canvas 2D phủ trên menu, không thêm draw call vào cảnh 3D.
   ===================================================================== */
'use strict';
(function(){
if(typeof S==='undefined'||typeof makeQ!=='function'||!window.WSX_API||!window.WSOutfits){console.warn('[WS gacha] game chưa sẵn sàng – bỏ qua');return}
const API=window.WSX_API,X=API.X,O=window.WSOutfits;
const RARS=['common','rare','epic','legendary'];
const DEF={price:150,comboCount:10,comboDiscount:.10,dailyCap:20,rates:{common:.60,rare:.28,epic:.10,legendary:.02},
  pityAt:30,refundRate:.40,refundFreeSpin:true,freeSpinPerDay:1,restNudgeAfter:10,freeQuestionMinReadSec:3,directMultiplier:1.5};

/* ===================== KIỂM ĐỊNH DỮ LIỆU ===================== */
function validate(d){
  const errs=[],E=m=>errs.push(m),num=(k,lo,hi,int)=>{const v=d[k];if(typeof v!=='number'||!isFinite(v)||v<lo||v>hi||(int&&!Number.isInteger(v)))E(k+' phải '+(int?'là số nguyên ':'là số ')+'trong '+lo+' – '+hi+' (đang là '+v+')')};
  if(!d||typeof d!=='object'){E('thiếu window.WS_GACHA');return errs}
  num('price',50,500,true);num('comboCount',5,10,true);num('comboDiscount',0,.3);num('dailyCap',5,50,true);num('pityAt',10,100,true);
  num('refundRate',0,.6);num('freeSpinPerDay',0,3,true);num('restNudgeAfter',5,20,true);num('freeQuestionMinReadSec',1,10);num('directMultiplier',1.5,3);
  if(typeof d.refundFreeSpin!=='boolean')E('refundFreeSpin phải là true/false');
  if(!d.rates||typeof d.rates!=='object')E('thiếu rates');
  else{let s=0;for(const r of RARS){const v=d.rates[r];if(typeof v!=='number'||!isFinite(v)||v<0||v>1)E('rates.'+r+' phải trong 0–1');else s+=v}
    if(Math.abs(s-1)>1e-6)E('rates phải cộng đúng 1 (đang là '+s+')');
    if(typeof d.rates.legendary==='number'&&d.rates.legendary<=0)E('rates.legendary phải > 0 (bảo hiểm cần bộ Huyền thoại)')}
  if(typeof d.price==='number'&&typeof d.refundRate==='number'&&Math.round(d.refundRate*d.price)>=d.price)E('tiền hoàn phải nhỏ hơn giá một lượt (chống tạo xu)');
  return errs}
let D=window.WS_GACHA,errs=validate(D);
if(errs.length){console.warn('[WS gacha] data/ws-gacha.js lỗi – dùng giá trị mặc định:\n - '+errs.slice(0,8).join('\n - '));
  const w=document.getElementById('dataWarn');if(w){w.textContent='⚠️ Dữ liệu vòng quay (data/ws-gacha.js) có lỗi ('+errs.length+') – đang dùng giá trị mặc định. Chi tiết ở Console.';w.classList.remove('hide')}
  D=DEF}

/* ===================== KHO THƯỞNG + TỈ LỆ ===================== */
const POOL={};for(const r of RARS)POOL[r]=O.sets.filter(s=>!s.default&&s.rarity===r).map(s=>s.id);
const ALL_IDS=RARS.flatMap(r=>POOL[r]);
const BYID={};O.sets.forEach(s=>{BYID[s.id]=s});
const usable=RARS.every(r=>D.rates[r]<=0||POOL[r].length>0)&&POOL.legendary.length>0;
if(!usable){console.warn('[WS gacha] hệ trang phục thiếu bộ cho một độ hiếm – tab Big Chance bị ẩn');return}
/* tỉ lệ hiệu dụng khi có bảo hiểm (GDD F3): p_L,eff = p_L / (1 − (1−p_L)^N) */
const pL=D.rates.legendary,pLe=pL/(1-Math.pow(1-pL,D.pityAt)),shrink=(1-pLe)/(1-pL);
const EFF={common:D.rates.common*shrink,rare:D.rates.rare*shrink,epic:D.rates.epic*shrink,legendary:pLe};
const REFUND=Math.round(D.refundRate*D.price),COMBO_PRICE=Math.round(D.comboCount*D.price*(1-D.comboDiscount));
const RAR=O.rarity,NAMES={common:RAR.common.name,rare:RAR.rare.name,epic:RAR.epic.name,legendary:RAR.legendary.name};
const STARS={common:'★',rare:'★★',epic:'★★★',legendary:'★★★★'};
const pct=v=>(v*100).toFixed(1).replace('.',',')+'%';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ===================== TRẠNG THÁI (X.gacha) ===================== */
const p2=n=>String(n).padStart(2,'0');
const dayStr=()=>{const d=new Date();return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};   /* ngày lịch theo giờ máy */
let todayFn=dayStr,rng=Math.random;
const clampI=(v,lo,hi)=>Math.min(hi,Math.max(lo,v|0));
function sanitizePending(p){
  if(!p||typeof p!=='object'||!Array.isArray(p.res))return null;
  const res=p.res.filter(x=>x&&ALL_IDS.includes(x.id)&&RARS.includes(x.r)).map(x=>({id:x.id,r:x.r,dup:!!x.dup,refund:x.refund|0}));
  return res.length?{res,free:!!p.free,n:res.length,refundTotal:res.reduce((a,x)=>a+x.refund,0)}:null}
(function init(){
  const g=(X.gacha&&typeof X.gacha==='object')?X.gacha:{};
  X.gacha={day:typeof g.day==='string'?g.day:'',used:clampI(g.used,0,D.dailyCap),freeReady:!!g.freeReady,freeUsed:typeof g.freeUsed==='boolean'?(g.freeUsed?1:0):clampI(g.freeUsed,0,3),
    pity:clampI(g.pity,0,D.pityAt-1),pending:sanitizePending(g.pending),seenQ:Array.isArray(g.seenQ)?g.seenQ.slice(-60):[],hist:Array.isArray(g.hist)?g.hist.filter(id=>ALL_IDS.includes(id)).slice(0,10):[]};
})();
function rollDay(){
  const g=X.gacha,t=todayFn();
  if(g.day!==t){g.day=t;g.used=0;g.freeReady=false;g.freeUsed=0;g.seenQ=[];API.save()}   /* pity giữ qua ngày */
  return g}
const ownedAll=()=>ALL_IDS.every(id=>O.owned(id));
const priceFor=n=>n===D.comboCount&&n>1?COMBO_PRICE:n*D.price;

/* ===================== LÕI QUAY (kiểm thử được: rng tiêm được) ===================== */
function canSpin(n,free){
  const g=rollDay();
  if(g.pending)return{ok:false,why:'pending',msg:'Còn phần mở quà chưa xem xong'};
  if(free){if(!g.freeReady)return{ok:false,why:'locked',msg:'Hãy trả lời đúng một câu khó để mở lượt miễn phí'};return{ok:true}}
  if(ownedAll())return{ok:false,why:'complete',msg:'Bạn đã sưu tập đủ!'};
  if(g.used+n>D.dailyCap)return{ok:false,why:'cap',msg:g.used>=D.dailyCap?'Hôm nay đã đủ '+D.dailyCap+' lượt – mai quay tiếp nhé':'Chỉ còn '+(D.dailyCap-g.used)+' lượt hôm nay'};
  const cost=priceFor(n);if(X.coins<cost)return{ok:false,why:'coins',msg:'Thiếu '+(cost-X.coins)+' xu'};
  return{ok:true}}
function rollOne(g){
  let r;
  if(g.pity>=D.pityAt-1)r='legendary';           /* bảo hiểm: lượt thứ N chắc chắn Huyền thoại */
  else{const u=rng();let a=0;r=RARS.find(k=>(a+=D.rates[k])>u)||'legendary'}
  g.pity=r==='legendary'?0:g.pity+1;
  const L=POOL[r];return{id:L[Math.min(L.length-1,Math.floor(rng()*L.length))],r}}
/* Thứ tự: kiểm tra → tung từng lượt → trừ xu/thêm đồ/hoàn xu → ghi pending → SAVE → (gọi nơi khác) hiệu ứng */
function spin(n,free){
  const chk=canSpin(n,free);if(!chk.ok)return chk;
  const g=X.gacha,res=[];
  if(free){g.freeReady=false;g.freeUsed++}else{X.coins-=priceFor(n);g.used+=n}
  let refundTotal=0;
  for(let i=0;i<n;i++){
    const x=rollOne(g),dup=O.owned(x.id);
    if(!dup)X.mods['o_'+x.id]=1;
    const rf=dup&&(!free||D.refundFreeSpin)?REFUND:0;refundTotal+=rf;
    res.push({id:x.id,r:x.r,dup,refund:rf});g.hist.unshift(x.id)}
  g.hist=g.hist.slice(0,10);
  API.addCoins(refundTotal,null,true);              /* raw: không nhân ×1,25 / ×2 – bất biến chống lạm phát */
  g.pending={res,free:!!free,n,refundTotal};
  API.save();
  return{ok:true,res,refundTotal,pending:g.pending}}

/* ===================== ÂM THANH ===================== */
const snd=f=>{try{ac();f()}catch(e){}};
SFX.fanfare=()=>snd(()=>{[523,659,784,1047,784,1047,1319].forEach((f,i)=>setTimeout(()=>tone(f,.3,'triangle',.07),i*170));
  setTimeout(()=>{tone(1047,1.1,'triangle',.06);tone(1319,1.1,'triangle',.05);tone(1568,1.1,'sine',.05)},1250)});
SFX.chime=r=>snd(()=>{if(r==='epic'){tone(880,.25,'sine',.06,1320);setTimeout(()=>tone(1320,.35,'sine',.05,1760),130)}else tone(1100,.22,'sine',.05,1500)});
const tick=k=>snd(()=>tone(260+k*700,.05,'square',.025));

/* ===================== GIAO DIỆN ===================== */
const el=id=>document.getElementById(id);
const css=document.createElement('style');
css.textContent=`#xgacha{z-index:24}#gcReveal{z-index:27;background:rgba(5,8,22,.97);flex-direction:column;align-items:center;justify-content:center;gap:6px}#gcReveal.hide{display:none}
.gcodds{width:100%;border-collapse:collapse;margin:6px 0;font-size:14px}.gcodds td,.gcodds th{padding:5px 8px;border-bottom:1px solid var(--line);text-align:left}.gcodds th{color:var(--mut);font-size:12px}
.gcb{font:800 13px Nunito;border:1.5px solid;border-radius:20px;padding:1px 9px;white-space:nowrap}
.gcpity{height:12px;border-radius:8px;background:#1d2656;overflow:hidden;margin:4px 0}.gcpity i{display:block;height:100%;background:linear-gradient(90deg,#ffa733,#ffd34d)}
.gcbtns{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.gcbtns .btn{min-height:44px}.gcbtns .btn[disabled]{opacity:.45}
.gcnote{min-height:20px;color:#ffd34d;font-weight:800;margin:4px 0}
.gccol{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:6px;margin:6px 0}
.gct{border:1px solid var(--line);border-radius:12px;padding:6px;text-align:center;background:rgba(255,255,255,.05);font-size:12px}
.gct .ic{font-size:26px;line-height:1.1}.gct.no{opacity:.45}.gct.no .ic{filter:grayscale(1) brightness(.6)}
.gcq{border:1.5px solid var(--acc);border-radius:14px;padding:10px;margin:8px 0;background:rgba(124,92,255,.12)}
.gcq .ch{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0}.gcq .ch .btn{min-height:44px}
.gcstage{position:relative;width:min(92vw,420px);height:min(60vh,380px);display:flex;align-items:center;justify-content:center}
.gcstage,.gcray,.gcbox,.gccard{pointer-events:none}#gcReveal .row{position:relative;z-index:31}.gcray{position:absolute;inset:-10%;border-radius:50%;-webkit-mask-image:radial-gradient(circle,#000 25%,transparent 70%);mask-image:radial-gradient(circle,#000 25%,transparent 70%);opacity:0;transform:scale(.3);transition:opacity .3s,transform .3s}.gcray.go{opacity:.9;transform:scale(1.1) rotate(25deg);transition:opacity .3s,transform .6s}
.gcbox{font-size:92px;line-height:1;position:relative;will-change:transform}
.gccard{position:absolute;display:none;flex-direction:column;align-items:center;gap:6px;padding:18px 26px;border:3px solid;border-radius:20px;background:#10173a;text-align:center;max-width:90%}
.gccard.show{display:flex;animation:gcflip .5s ease-out}.gccard .ic{font-size:64px;line-height:1}.gccard .nm{font:800 22px 'Baloo 2',Nunito}
@keyframes gcflip{from{transform:rotateY(90deg) scale(.6);opacity:0}to{transform:none;opacity:1}}
.gcflash{position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:29}.gcflash.go{animation:gcfl .15s}@keyframes gcfl{0%{opacity:.85}100%{opacity:0}}
#gcConf{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:28}
.gcfly{position:fixed;font-size:22px;z-index:30;pointer-events:none;transition:transform .8s cubic-bezier(.3,.1,.3,1),opacity .8s}
.gcsum{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:6px;margin:8px 0;max-height:46vh;overflow:auto}
@media (prefers-reduced-motion:reduce){.gccard.show{animation:none}}`;
document.head.appendChild(css);
const gc=document.createElement('div');gc.id='xgacha';gc.className='ov hide';gc.setAttribute('role','dialog');gc.setAttribute('aria-label','Vòng quay Big Chance');
gc.innerHTML=`<div class="card" style="max-width:760px"><div class="xhead"><h3 style="margin:0">🎁 Big Chance</h3><span class="xcoin" id="gcCoin"></span></div>
<div class="sub" style="margin:4px 0 0">Miễn phí 100%: chỉ dùng xu kiếm được khi chơi. Chỉ đổi <b>ngoại hình</b>, không tăng sức mạnh. Tỉ lệ công khai bên dưới.</div>
<div id="gcInfo" style="margin-top:8px"></div>
<div id="gcQ"></div>
<div class="gcnote" id="gcNote" role="status" aria-live="polite"></div>
<h3 style="margin:10px 0 2px">Bộ sưu tập <span id="gcCount"></span></h3><div id="gcCol"></div>
<div id="gcHist" style="font-size:13px;color:var(--mut);margin:4px 0"></div>
<div class="row" style="justify-content:center"><button class="btn sec" id="gcClose">Đóng</button></div></div>`;
document.body.appendChild(gc);
const rv=document.createElement('div');rv.id='gcReveal';rv.className='ov hide';rv.setAttribute('role','dialog');rv.setAttribute('aria-label','Mở quà');
rv.innerHTML=`<div style="position:absolute;right:16px;top:12px;font:800 16px Nunito;color:#ffd34d" id="gcRevCoin"></div>
<div class="gcstage"><div class="gcray" id="gcRay"></div><div class="gcbox" id="gcBox">🎁</div><div class="gccard" id="gcCardBox"></div></div>
<div id="gcSum" class="hide" style="max-width:min(92vw,640px);text-align:center"></div>
<div class="row" style="justify-content:center;margin-top:10px"><button class="btn sec" id="gcSkip">Bỏ qua ⏭</button><button class="btn hide" id="gcSumClose">Đóng</button></div>
<div id="gcLive" class="sr" aria-live="assertive" style="position:absolute;left:-9999px"></div>`;
document.body.appendChild(rv);
const fl=document.createElement('div');fl.className='gcflash';fl.id='gcFlash';document.body.appendChild(fl);
const cv=document.createElement('canvas');cv.id='gcConf';cv.style.display='none';document.body.appendChild(cv);

const badge=r=>`<span class="gcb" style="color:${RAR[r].color};border-color:${RAR[r].color}">${STARS[r]} ${NAMES[r]}</span>`;
function sayNote(m){el('gcNote').textContent=m||''}
function render(){
  const g=rollDay(),free=D.freeSpinPerDay,done=ownedAll(),left=D.dailyCap-g.used;
  el('gcCoin').textContent=X.coins+' 🪙';
  const need=D.pityAt-g.pity;
  const rows=RARS.map(r=>`<tr><td>${badge(r)}</td><td>${pct(D.rates[r])}</td><td>${pct(EFF[r])}</td><td>${POOL[r].length} bộ</td></tr>`).join('');
  const b1=canSpin(1,false),b10=canSpin(D.comboCount,false),bf=free>0?canSpin(1,true):{ok:false,msg:''};
  const freeState=free<=0?'':g.freeReady?'ready':g.freeUsed>=free?'used':'locked';
  el('gcInfo').innerHTML=`<div>Hôm nay: <b id="gcUsed">${g.used}/${D.dailyCap}</b> lượt trả xu · còn ${left}</div>
  <table class="gcodds"><tr><th>Độ hiếm</th><th>Tỉ lệ cơ bản</th><th>Trung bình thực tế nhờ bảo hiểm</th><th>Kho</th></tr>${rows}</table>
  <div id="gcPityTxt">Còn <b>${need}</b> lượt chắc chắn nhận Huyền thoại</div><div class="gcpity"><i style="width:${(g.pity/D.pityAt*100).toFixed(1)}%"></i></div>
  <div style="font-size:12px;color:var(--mut)">Bảo hiểm: nếu ${D.pityAt-1} lượt liên tiếp chưa ra Huyền thoại thì lượt thứ ${D.pityAt} chắc chắn ra. Trùng đồ được hoàn ${REFUND} xu.</div>
  <div class="gcbtns"><button class="btn" id="gcS1" ${b1.ok?'':'disabled'}>Quay 1 — ${D.price} 🪙</button>
  <button class="btn" id="gcS10" ${b10.ok?'':'disabled'}>Quay ${D.comboCount} — ${COMBO_PRICE} 🪙 <small>(−${Math.round(D.comboDiscount*100)}%)</small></button>
  ${free>0?`<button class="btn sec" id="gcFree" ${freeState==='used'?'disabled':''}>${freeState==='ready'?'🎁 Quay miễn phí hôm nay':freeState==='used'?'Miễn phí: mai nhé':'🔓 Mở lượt miễn phí (trả lời 1 câu khó)'}</button>`:''}</div>
  <div id="gcWhy" style="font-size:13px;color:var(--mut)">${[b1.ok?'':'Quay 1: '+b1.msg,b10.ok?'':'Quay '+D.comboCount+': '+b10.msg].filter(Boolean).join(' · ')}</div>
  ${g.used>=D.restNudgeAfter?'<div id="gcRest" style="color:#ffd34d;font-weight:800">Nghỉ ngơi một chút nhé 🌿</div>':''}`;
  const cols=RARS.map(r=>POOL[r].map(id=>{const s=BYID[id],o=O.owned(id);return`<div class="gct ${o?'':'no'}" style="border-color:${o?RAR[r].color:'var(--line)'}"><div class="ic">${esc(s.icon)}</div><div>${esc(s.name)}</div>${badge(r)}<div>${o?'✔':'chưa có'}</div></div>`}).join('')).join('');
  el('gcCol').innerHTML=`<div class="gccol">${cols}</div>`;
  el('gcHist').innerHTML=g.hist.length?'Lịch sử 10 lượt gần nhất: '+g.hist.map(id=>{const s=BYID[id];return s?esc(s.icon)+' '+esc(s.name):''}).join(' · '):'';
  el('gcCount').textContent='('+ALL_IDS.filter(id=>O.owned(id)).length+'/'+ALL_IDS.length+')'+(done?' – Bạn đã sưu tập đủ!':'')}

/* ----- lượt miễn phí: câu KHÓ ----- */
let fq=null,fqTimer=0;
const qKey=q=>JSON.stringify(q.raw.item);
function pickQ(){const g=X.gacha;let q,t=0;if(!S.decks)S.decks={};   /* ở menu chưa có bộ bài câu hỏi (resetState chưa chạy) */do{q=makeQ('hard');t++}while(g.seenQ.includes(qKey(q))&&t<14);g.seenQ.push(qKey(q));g.seenQ=g.seenQ.slice(-60);return q}
function openQuestion(){
  const g=rollDay();if(g.freeReady||g.freeUsed>=D.freeSpinPerDay||g.pending)return null;
  fq={q:pickQ(),wrong:false,canNext:false};renderQuestion();return fq.q}
function renderQuestion(){
  const box=el('gcQ');
  if(!fq){box.innerHTML='';return}
  const q=fq.q;
  box.innerHTML=`<div class="gcq" id="gcQBox"><div style="font:800 13px Nunito;color:var(--mut)">Câu KHÓ – trả lời đúng để mở lượt miễn phí (sai thì xem lời giải rồi thử câu khác)</div>
  <div style="font-size:18px;margin:6px 0" id="gcQText">${q.html(false)}</div>
  <div class="ch" id="gcQCh">${q.choices.map((c,i)=>`<button class="btn sec" data-i="${i}" ${fq.wrong?'disabled':''}>${esc(c)}</button>`).join('')}</div>
  <div id="gcQMsg" style="min-height:20px;font-weight:700">${fq.wrong?'✖ Chưa đúng. '+esc(q.explain):''}</div>
  ${fq.wrong?`<button class="btn" id="gcQNext" ${fq.canNext?'':'disabled'}>Câu khác ▶</button>`:''}
  <button class="btn sec" id="gcQCancel" style="margin-left:6px">Để sau</button></div>`}
function answer(i){
  if(!fq||fq.wrong)return null;
  const q=fq.q,w=q.choices[i];
  if(q.isOk(w)){X.gacha.freeReady=true;API.save();fq=null;clearTimeout(fqTimer);renderQuestion();sayNote('✔ Đúng! Lượt miễn phí đã mở.');render();return true}
  fq.wrong=true;fq.canNext=false;if(API.addReview)API.addReview(q);   /* câu sai vào sổ ôn ngắt quãng */
  renderQuestion();clearTimeout(fqTimer);
  fqTimer=setTimeout(()=>{if(fq){fq.canNext=true;const b=el('gcQNext');if(b)b.disabled=false}},D.freeQuestionMinReadSec*1000);
  return false}
function nextQuestion(){if(!fq||!fq.wrong||!fq.canNext)return false;fq={q:pickQ(),wrong:false,canNext:false};renderQuestion();return true}

/* ----- hiệu ứng mở hộp ----- */
let run=null,confRaf=0;
const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}};
const wait=ms=>new Promise(res=>{if(!run||run.skipped)return res();const t=setTimeout(()=>{run.wake=null;res()},ms);run.wake=()=>{clearTimeout(t);res()}});
function shakeBox(ms,rarity){
  return new Promise(res=>{const b=el('gcBox'),t0=performance.now();let ph=0,last=t0;
    const loop=()=>{if(!run||run.skipped){b.style.transform='';return res()}
      const now=performance.now(),k=Math.min(1,(now-t0)/ms);ph+=2*Math.PI*(4+10*k)*(now-last)/1000;last=now;
      b.style.transform=`rotate(${Math.sin(ph)*(3+14*k)}deg) scale(${1+.12*k})`;tick(k);
      if(k>=1){b.style.transform='';return res()}requestAnimationFrame(loop)};
    loop()})}
function confetti(){
  const c=el('gcConf'),x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;c.style.display='block';
  const cols=['#ffa733','#ffd34d','#ff6bd6','#3d8bff','#2ed573','#fff'],P=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight*.45,vx:(Math.random()-.5)*14,vy:-Math.random()*13-3,r:Math.random()*6+3,c:cols[(Math.random()*cols.length)|0],a:Math.random()*6}));
  const t0=performance.now();cancelAnimationFrame(confRaf);
  const f=()=>{const t=(performance.now()-t0)/1000;x.clearRect(0,0,c.width,c.height);
    if(t>3||!run){c.style.display='none';return}
    for(const p of P){p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.a+=.2;x.fillStyle=p.c;x.globalAlpha=Math.max(0,1-t/3);x.fillRect(p.x,p.y,p.r,p.r*.6)}
    confRaf=requestAnimationFrame(f)};f()}
function flyCoins(from){
  const to=el('gcRevCoin').getBoundingClientRect(),r=from.getBoundingClientRect(),n=8;
  for(let i=0;i<n;i++){const s=document.createElement('span');s.className='gcfly';s.textContent='🪙';
    s.style.left=(r.left+r.width/2+(Math.random()-.5)*60)+'px';s.style.top=(r.top+r.height/2)+'px';document.body.appendChild(s);
    setTimeout(()=>{s.style.transform=`translate(${to.left-parseFloat(s.style.left)}px,${to.top-parseFloat(s.style.top)}px) scale(.6)`;s.style.opacity='.2'},40+i*60);
    setTimeout(()=>s.remove(),1100+i*60)}}
async function showOne(x,idx,total){
  const rd=reduced(),col=RAR[x.r].color,ray=el('gcRay'),card=el('gcCardBox'),box=el('gcBox');
  ray.classList.remove('go');card.classList.remove('show');box.style.display='';box.style.transform='';
  ray.style.background=`conic-gradient(from 0deg,${col},transparent 12%,${col} 25%,transparent 37%,${col} 50%,transparent 62%,${col} 75%,transparent 87%,${col})`;
  el('gcRevCoin').textContent='🪙 '+X.coins;
  await shakeBox(rd?350:(total>1?(x.r==='legendary'||x.r==='epic'?900:500):1200),x.r);
  if(run.skipped)return;
  ray.classList.add('go');box.style.display='none';
  if(x.r==='legendary'){fl.classList.remove('go');void fl.offsetWidth;fl.classList.add('go');SFX.fanfare();if(!rd)confetti()}else SFX.chime(x.r);
  const s=BYID[x.id];
  card.style.borderColor=col;card.style.boxShadow=`0 0 40px ${col}88`;
  card.innerHTML=`<div class="ic">${esc(s.icon)}</div><div class="nm">${esc(s.name)}</div>${badge(x.r)}<div id="gcCardTag" style="font-weight:800;color:${x.dup?'#ffd34d':'#2ed573'}">${x.dup?(x.refund?'Đã có – hoàn '+x.refund+' 🪙':'Đã có'):'✨ MỚI!'}</div>${total>1?`<div style="font-size:12px;color:var(--mut)">${idx+1}/${total}</div>`:''}`;
  card.style.opacity=x.dup?'.88':'1';card.classList.add('show');
  el('gcLive').textContent=NAMES[x.r]+': '+s.name+(x.dup?', đã có':', bộ mới');
  if(x.dup&&x.refund&&!rd)flyCoins(card);
  await wait(rd?250:(total>1?(x.r==='legendary'?1300:700):1100))}
function showSummary(p){
  const sm=el('gcSum');el('gcBox').style.display='none';el('gcCardBox').classList.remove('show');el('gcRay').classList.remove('go');
  document.querySelector('#gcReveal .gcstage').style.display='none';
  const nw=p.res.filter(x=>!x.dup).length,dp=p.res.length-nw;
  sm.innerHTML=`<h3 style="margin:0 0 6px">Kết quả</h3><div>Bộ mới: <b>${nw}</b> · Trùng: <b>${dp}</b>${p.refundTotal?` · Hoàn <b>${p.refundTotal}</b> 🪙`:''}</div>
  <div class="gcsum">${p.res.map(x=>{const s=BYID[x.id];return`<div class="gct" style="border-color:${RAR[x.r].color}"><div class="ic">${esc(s.icon)}</div><div>${esc(s.name)}</div>${badge(x.r)}<div>${x.dup?'đã có (+'+x.refund+')':'✨ mới'}</div></div>`}).join('')}</div><div>Số dư: <b>${X.coins}</b> 🪙</div>`;
  sm.classList.remove('hide');el('gcSkip').classList.add('hide');el('gcSumClose').classList.remove('hide');el('gcSumClose').focus();
  el('gcLive').textContent='Tổng kết: '+nw+' bộ mới, '+dp+' trùng'}
async function play(p){
  if(!p||run)return;
  run={skipped:false,wake:null};
  document.querySelector('#gcReveal .gcstage').style.display='';el('gcSum').classList.add('hide');el('gcSumClose').classList.add('hide');el('gcSkip').classList.remove('hide');
  rv.classList.remove('hide');el('gcSkip').focus();
  for(let i=0;i<p.res.length&&!run.skipped;i++)await showOne(p.res[i],i,p.res.length);
  if(run)showSummary(p)}
function skip(){if(!run)return;run.skipped=true;if(run.wake)run.wake();el('gcBox').style.transform=''}
function closeSummary(){
  const g=X.gacha;g.pending=null;API.save();cancelAnimationFrame(confRaf);el('gcConf').style.display='none';
  rv.classList.add('hide');run=null;sayNote('');render()}
rv.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='gcSkip')skip();if(b.id==='gcSumClose')closeSummary()});

/* ----- mở/đóng + nối vào menu, Shop ----- */
function openGacha(){
  if(S.running&&!S.ended&&!S.paused)return;
  fq=null;gc.classList.remove('hide');sayNote('');render();renderQuestion();
  const p=X.gacha.pending;if(p){sayNote('Phát lại phần mở quà chưa xem xong (xu và bộ đồ đã được tính, không trừ lần nữa).');play(p)}}
function closeGacha(){
  if(run)return;gc.classList.add('hide');clearTimeout(fqTimer);fq=null;
  const b=el('xbal');if(b)b.textContent=X.coins;try{buildMenu()}catch(e){}}
function doSpin(n,free){
  try{ac()}catch(e){}
  const r=spin(n,free);if(!r.ok){sayNote(r.msg);render();return r}
  render();play(r.pending);return r}
gc.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='gcS1')doSpin(1,false);
  else if(b.id==='gcS10')doSpin(D.comboCount,false);
  else if(b.id==='gcFree'){const g=rollDay();if(g.freeReady)doSpin(1,true);else if(g.freeUsed<D.freeSpinPerDay){openQuestion()}}
  else if(b.dataset&&b.dataset.i!==undefined&&b.closest('#gcQCh'))answer(+b.dataset.i);
  else if(b.id==='gcQNext')nextQuestion();
  else if(b.id==='gcQCancel'){fq=null;clearTimeout(fqTimer);renderQuestion()}
  else if(b.id==='gcClose')closeGacha()});
document.addEventListener('keydown',e=>{if(e.code!=='Escape')return;if(run){skip();return}if(!gc.classList.contains('hide'))closeGacha()});
(function(){const w=el('xmenuWard')||el('xmenuShop');if(w){const b=document.createElement('button');b.id='xmenuGacha';b.className='btn sec';b.textContent='🎁 Big Chance';w.after(b);b.onclick=openGacha}
  const tabs=document.querySelector('#xshop .xtabs')||document.querySelector('.xtabs');
  if(tabs){const t=document.createElement('button');t.id='xtabGacha';t.textContent='🎁 Big Chance';t.addEventListener('click',e=>{e.stopPropagation();openGacha()});tabs.appendChild(t)}})();

window.WSGacha={D,eff:EFF,pool:POOL,refund:REFUND,comboPrice:COMBO_PRICE,validate,canSpin,spin,play,skip,open:openGacha,close:closeGacha,render,
  openQuestion,answer,nextQuestion,closeSummary,setRng:f=>{rng=f||Math.random},setToday:f=>{todayFn=f||dayStr},
  get state(){return X.gacha},get running(){return !!run},get question(){return fq},get usingFallback(){return errs.length>0},get errors(){return errs},get allOwned(){return ownedAll()}};
console.log('[WS gacha] đã nạp: '+ALL_IDS.length+' bộ trong kho, giá '+D.price+' xu/lượt'+(errs.length?' (dùng mặc định do lỗi dữ liệu)':''));
})();
