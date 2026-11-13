'use strict';
/* ================= CORE / STATE ================= */
const $=id=>document.getElementById(id);
const AVAS=['🐣','🦊','🐼','🦄','🐸','🐯','🐰','🦁','🐙','🤖','👾','🐬'];
let grade=5, curSec='home';
let P=null; // current player
const LS_PLAYERS='efz_players', LS_CUR='efz_current';

function loadPlayers(){try{return JSON.parse(localStorage.getItem(LS_PLAYERS))||{}}catch(e){return{}}}
function savePlayers(ps){localStorage.setItem(LS_PLAYERS,JSON.stringify(ps))}
function persist(){const ps=loadPlayers();ps[P.name]=P;savePlayers(ps);renderPlayer();efzCloudSoon()}
function newPlayer(name,ava){return{name,ava,xp:0,correct:0,maxStreak:0,badges:[],quizDone:0,readDone:0,listenDone:0,writeDone:0,gameWins:0,perfect:0}}

function lvlOf(xp){return Math.floor(Math.sqrt(xp/25))+1}
function renderPlayer(){
  if(!P)return;
  $('pName').textContent=P.name;$('pAva').textContent=P.ava;
  $('pXP').textContent=P.xp;$('pLvl').textContent='Lv.'+lvlOf(P.xp);
  $('stXP').textContent=P.xp;$('stDone').textContent=P.correct;
  $('stStreak').textContent=P.maxStreak;$('stBadge').textContent=P.badges.length;
}

/* ===== sounds (WebAudio, no files) ===== */
let AC=null,soundOn=localStorage.getItem('efz_snd')!=='0';
function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}
function tone(f,t,dur,type='sine',vol=.18){if(!soundOn)return;try{
  const a=ac(),o=a.createOscillator(),g=a.createGain();
  o.type=type;o.frequency.value=f;o.connect(g);g.connect(a.destination);
  g.gain.setValueAtTime(vol,a.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+t+dur);
  o.start(a.currentTime+t);o.stop(a.currentTime+t+dur+.02);
}catch(e){}}
/* --- sound palette --- */
// Correct / OK — bright ascending arpeggio
const sndOK=()=>{tone(523,0,.1,'sine',.2);tone(659,.09,.1,'sine',.2);tone(784,.18,.22,'sine',.22)};
// Wrong — short descending buzz
const sndNo=()=>{tone(300,0,.07,'sawtooth',.14);tone(200,.07,.22,'sawtooth',.1)};
// Win / level complete — 5-note fanfare
const sndWin=()=>{[523,659,784,988,1319].forEach((f,i)=>tone(f,i*.1,.22,'sine',.2))};
// UI click — light pop
const sndClick=()=>tone(880,0,.045,'triangle',.09);
// Flip card
const sndFlip=()=>{tone(660,0,.04,'triangle',.12);tone(880,.04,.06,'triangle',.08)};
// Coin / gold
const sndCoin=()=>{tone(1047,0,.05,'triangle',.14);tone(1319,.05,.1,'triangle',.13)};
// Shoot / fire
const sndShoot=()=>tone(440,0,.06,'square',.07);
// Hit / impact
const sndHit=()=>tone(180,0,.1,'square',.13);
// Game over / lose
const sndLose=()=>{[392,330,262].forEach((f,i)=>tone(f,i*.12,.2,'sawtooth',.1))};
// Streak / combo
const sndCombo=()=>{[523,659,784,1047].forEach((f,i)=>tone(f,i*.07,.15,'sine',.16))};
// Nav / tab switch
const sndNav=()=>tone(523,0,.08,'sine',.1);
// Power up / level up (distinct from win)
const sndLevelUp=()=>{[392,523,659,784,1047,1319].forEach((f,i)=>tone(f,i*.09,.18,'sine',.18))};
/* toggle */
function toggleSound(){
  soundOn=!soundOn;
  localStorage.setItem('efz_snd',soundOn?'1':'0');
  const btn=document.getElementById('sndToggleBtn');
  if(btn){btn.textContent=soundOn?'🔊':'🔇';btn.title=soundOn?'Tắt âm thanh':'Bật âm thanh'}
  if(soundOn)sndClick();
}

/* ===== confetti & fx ===== */
function confetti(n=60){
  const cols=['#ffd23f','#ff5d8f','#8b5cf6','#22d3aa','#38bdf8','#ff7a48'];
  for(let i=0;i<n;i++){
    const d=document.createElement('div');d.className='confetti';
    const s=6+Math.random()*8;
    d.style.cssText=`left:${Math.random()*100}vw;width:${s}px;height:${s*(Math.random()>.5?1:.4)}px;background:${cols[i%6]};border-radius:${Math.random()>.5?'50%':'3px'};animation-duration:${2+Math.random()*2.5}s;animation-delay:${Math.random()*.6}s`;
    document.body.appendChild(d);setTimeout(()=>d.remove(),5500);
  }
}
function xpFly(amount,x,y){
  const d=document.createElement('div');d.className='xp-fly';d.textContent='+'+amount+' XP ⭐';
  d.style.left=(x||innerWidth/2)+'px';d.style.top=(y||innerHeight/2)+'px';
  document.body.appendChild(d);setTimeout(()=>d.remove(),1000);
}
let toastT=null;
function toast(msg,ms=2600){const t=$('toast');t.innerHTML=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),ms)}

/* ===== XP / badges ===== */
function gainXP(n,ev){
  P.xp+=n;
  if(ev)xpFly(n,ev.clientX,ev.clientY);else xpFly(n);
  const before=lvlOf(P.xp-n),after=lvlOf(P.xp);
  if(after>before){confetti(80);sndLevelUp();toast('🎉 <b>LEVEL UP!</b> Bạn đã lên cấp '+after+'!')}
  persist();checkBadges();
}
const BADGES=[
 {id:'first', em:'🐤', nm:'Khởi động', ds:'Trả lời đúng câu đầu tiên', test:p=>p.correct>=1},
 {id:'xp100', em:'⭐', nm:'100 XP', ds:'Đạt 100 XP', test:p=>p.xp>=100},
 {id:'xp500', em:'🌟', nm:'500 XP', ds:'Đạt 500 XP', test:p=>p.xp>=500},
 {id:'xp1k', em:'💫', nm:'1000 XP', ds:'Đạt 1000 XP', test:p=>p.xp>=1000},
 {id:'streak5', em:'🔥', nm:'Chuỗi 5', ds:'Đúng 5 câu liên tiếp', test:p=>p.maxStreak>=5},
 {id:'streak10', em:'🌋', nm:'Chuỗi 10', ds:'Đúng 10 câu liên tiếp', test:p=>p.maxStreak>=10},
 {id:'quiz3', em:'⚡', nm:'Quiz thủ', ds:'Hoàn thành 3 lượt quiz', test:p=>p.quizDone>=3},
 {id:'reader', em:'📚', nm:'Mọt sách', ds:'Xong 3 bài đọc', test:p=>p.readDone>=3},
 {id:'listener', em:'🎧', nm:'Thính tai', ds:'Xong 3 bài nghe', test:p=>p.listenDone>=3},
 {id:'writer', em:'✍️', nm:'Cây bút', ds:'Xong 3 bài viết', test:p=>p.writeDone>=3},
 {id:'gamer', em:'🎮', nm:'Game thủ', ds:'Thắng 5 ván game', test:p=>p.gameWins>=5},
 {id:'perfect', em:'💯', nm:'Perfect!', ds:'Một lượt quiz đúng 100%', test:p=>p.perfect>=1},
];
function checkBadges(){
  let got=false;
  BADGES.forEach(b=>{if(!P.badges.includes(b.id)&&b.test(P)){P.badges.push(b.id);got=true;
    toast('🎖️ Huy hiệu mới: <b>'+b.em+' '+b.nm+'</b>!');confetti(40);sndCombo();}});
  if(got)persist();
}

/* ===== streak ===== */
let streak=0;
function hitStreak(){streak++;if(streak>P.maxStreak){P.maxStreak=streak}if(streak>=3){toast('🔥 Chuỗi '+streak+' câu đúng! +'+streakBonus()+' XP thưởng chuỗi');if(streak%3===0)sndCombo();}persist()}
function streakBonus(){return streak>=10?10:streak>=5?5:streak>=3?2:0}
function missStreak(){streak=0}

/* ===== TTS ===== */
let voices=[];
function loadVoices(){voices=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('en'))}
if('speechSynthesis' in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}
function pickVoice(pref){
  if(!voices.length)loadVoices();
  const tryList=[v=>/Google US English/i.test(v.name),v=>/en[-_]US/i.test(v.lang)&&/female|samantha|zira|aria|jenny/i.test(v.name),v=>/en[-_]US/i.test(v.lang),v=>/en[-_]GB/i.test(v.lang),v=>true];
  for(const f of tryList){const v=voices.find(f);if(v)return v}
  return null;
}
function speak(text,rate=1,onend){
  if(!('speechSynthesis' in window)){toast('😢 Trình duyệt không hỗ trợ đọc. Hãy dùng Chrome/Edge nhé!');if(onend)onend();return}
  speechSynthesis.cancel();
  const parts=Array.isArray(text)?text:[text];
  let i=0;
  function next(){
    if(i>=parts.length){if(onend)onend();return}
    const u=new SpeechSynthesisUtterance(parts[i].text||parts[i]);
    const v=pickVoice();if(v)u.voice=v;
    u.lang='en-US';u.rate=rate;u.pitch=parts[i].pitch||1;
    u.onend=()=>{i++;setTimeout(next,parts[i-1].pause||350)};
    u.onerror=()=>{i++;next()};
    speechSynthesis.speak(u);
  }
  next();
}
function stopSpeak(){try{if(LS_AUDIO){LS_AUDIO.onerror=null;LS_AUDIO.pause();LS_AUDIO=null}}catch(e){}if('speechSynthesis' in window)speechSynthesis.cancel()}

/* ===== nav ===== */
function go(s){
  curSec=s;stopSpeak();
  if(typeof GM!=='undefined'&&GM){if(GM.timer){clearInterval(GM.timer);clearTimeout(GM.timer)}if(GM.raf)cancelAnimationFrame(GM.raf)}
  try{TD_RUN++}catch(e){}
  document.querySelectorAll('section').forEach(x=>x.classList.remove('show'));
  $('sec-'+s).classList.add('show');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.s===s));
  sndNav();
  if(s==='grammar')grammarHome();
  if(s==='theory')renderTheory();
  if(s==='quiz')quizHome();
  if(s==='reading')readingHome();
  if(s==='listening')listeningHome();
  if(s==='writing')writingHome();
  if(s==='games')gamesHome();
  if(s==='board'){renderBoard();renderBadges()}
  if(s!=='ielts'&&s!=='hsa'){try{_iqStop()}catch(e){}}
  if(s==='ielts'){showIELTSTab(_ieltsTab||'vocab')}
  if(s==='hsa'){showHSATab(_hsaTab||'eng1');setTimeout(addSearchBarToPassages,200)}
  if(s==='vocab'){renderVocabPanel()}
  window.scrollTo({top:0,behavior:'smooth'});
}
function setGrade(g){
  grade=g;sndClick();
  document.querySelectorAll('.gpill').forEach(p=>p.classList.toggle('on',+p.dataset.g===g));
  // Hide IELTS tab when switching to a normal grade
  const ti=$('tabIELTS');if(ti)ti.style.display='none';const th=$('tabHSA');if(th)th.style.display='none';const tv=$('tabVocab');if(tv)tv.style.display='none';
  toast('📚 Đã chuyển sang <b>Lớp '+g+'</b>!');
  go(curSec==='ielts'||curSec==='hsa'?'home':curSec==='home'?'home':curSec);
}

/* ===== helpers ===== */
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function norm(s){return s.toLowerCase().replace(/[.,!?;:'"]/g,'').replace(/\s+/g,' ').trim()}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function pickN(arr,n){return shuffle(arr).slice(0,n)}
/* ================= TẢI THEO YÊU CẦU (lazy chunks) =================
   app.js chỉ chứa phần lõi. Dữ liệu lớp, ngữ pháp, IELTS và các game nằm ở js/chunks/*.js,
   chỉ tải khi học sinh mở đúng mục đó → trang chủ mở nhanh hơn nhiều.
   Thêm mục mới: khai báo file ở EFZ_CHUNKS rồi "gác cổng" hàm mở mục ở cuối file (efzGate). */
const EFZ_CHUNKS={
  grades:{src:'js/chunks/grades.js'},
  ielts:{src:'js/chunks/ielts.js'},
  grammar:{src:'js/chunks/grammar.js'},
  games:{src:'js/chunks/games.js',deps:['grades']},
  td:{src:'js/chunks/td.js',deps:['grades','grammar','games']}
};
const _efzChunkP={};
function efzHas(names){const L=window.EFZ_LOADED||{};return names.every(n=>L[n]&&(EFZ_CHUNKS[n].deps||[]).every(d=>L[d]))}
function efzChunk(name){
  if(_efzChunkP[name])return _efzChunkP[name];
  const c=EFZ_CHUNKS[name];
  const own=new Promise((ok,no)=>{
    if((window.EFZ_LOADED||{})[name])return ok();
    const el=document.createElement('script');el.src=c.src;el.async=false;
    el.onload=()=>((window.EFZ_LOADED||{})[name]?ok():no(new Error('chunk '+name)));
    el.onerror=()=>no(new Error('chunk '+name));
    document.head.appendChild(el);
  });
  const p=Promise.all([own].concat((c.deps||[]).map(efzChunk))).catch(e=>{delete _efzChunkP[name];throw e});
  return _efzChunkP[name]=p;
}
function efzNeed(names){return Promise.all(names.map(efzChunk))}
let _efzBusyN=0;
function efzBusy(on){
  _efzBusyN=Math.max(0,_efzBusyN+(on?1:-1));
  let b=document.getElementById('efzBusy');
  if(!b){b=document.createElement('div');b.id='efzBusy';b.setAttribute('role','status');b.textContent='⏳ Đang tải nội dung…';document.body.appendChild(b)}
  b.classList.toggle('show',_efzBusyN>0);
}
/* bọc 1 hàm toàn cục: thiếu dữ liệu thì tải xong mới chạy (gọi lại đúng tham số cũ) */
function efzGate(fn,need){
  const orig=window[fn];
  window[fn]=function(...a){
    if(efzHas(need))return orig.apply(this,a);
    efzBusy(true);
    efzNeed(need).then(()=>{efzBusy(false);window[fn](...a)},()=>{efzBusy(false);toast('😢 Không tải được nội dung. Kiểm tra mạng rồi bấm lại nhé.')});
  };
}
/* Thủ thành nằm ở file riêng: 2 hàm mở game này là "giữ chỗ", file td.js tải xong sẽ thay bằng hàm thật */
function td2Enter(mode){_efzTD('td2Enter',[mode])}
function startTowerSurvival(){_efzTD('startTowerSurvival',[])}
function _efzTD(fn,args){
  const stub=window[fn];efzBusy(true);
  efzNeed(['td']).then(()=>{efzBusy(false);if(window[fn]!==stub)window[fn](...args)},()=>{efzBusy(false);toast('😢 Không tải được game. Kiểm tra mạng rồi bấm lại nhé.')});
}


/* ================= RANDOM QUESTION GENERATORS ================= */
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function mkQ(q,correct,distract,e){
  const o=shuffle([correct,...pickN([...new Set(distract.filter(d=>d!==correct))],3)]);
  return{q,o,a:o.indexOf(correct),e};
}
/*__GENSTORY__*/
/* ================= VOCAB HUB: level/topic selector + shared pool ================= */
let GSEL={lvl:'all',topic:'all'};
function topicsForLvl(){let ts=DATA[grade].topics;if(GSEL.lvl!=='all')ts=ts.filter(t=>t.lvl===GSEL.lvl);return ts.length?ts:DATA[grade].topics}
function poolVocab(){
  if(GSEL.topic!=='all'){const t=DATA[grade].topics.find(x=>x.id===GSEL.topic);if(t&&t.vocab.length>=4)return t.vocab}
  let v=topicsForLvl().flatMap(t=>t.vocab);
  if(v.length<8)v=DATA[grade].vocab;
  return v;
}
function poolPicVocab(){const p=poolVocab().filter(v=>hasPic(v[0]));return p.length>=4?p:DATA[grade].vocab.filter(v=>hasPic(v[0]))}
function poolLabel(){if(GSEL.topic!=='all'){const t=DATA[grade].topics.find(x=>x.id===GSEL.topic);if(t)return t.em+' '+esc(t.name)}return GSEL.lvl==='all'?'Tất cả chủ đề':'Mức '+GSEL.lvl}
function setLvl(l){GSEL.lvl=l;if(l!=='all'){const t=DATA[grade].topics.find(x=>x.id===GSEL.topic);if(t&&t.lvl!==l)GSEL.topic='all'}sndClick();gamesHome()}
function setTopic(id){GSEL.topic=id;sndClick();gamesHome()}
function lvlAbbr(l){return l==='Dễ'?'de':l==='Vừa'?'vua':'kho'}
function selBar(){
  const lvls=[['all','🎯 Tất cả',''],['Dễ','🟢 Dễ','l-de'],['Vừa','🟡 Vừa','l-vua'],['Khó','🔴 Khó','l-kho']];
  const ts=topicsForLvl();
  return `<div class="selbar">
    <span class="lbl">① Chọn cấp độ</span>
    <div>${lvls.map(l=>`<button class="lvlchip ${l[2]} ${GSEL.lvl===l[0]?'on':''}" onclick="setLvl('${l[0]}')">${l[1]}</button>`).join('')}</div>
    <span class="lbl" style="margin-top:11px">② Chọn chủ đề <small style="text-transform:none;color:var(--violet);font-weight:700">(${poolVocab().length} từ)</small></span>
    <div><button class="lvlchip ${GSEL.topic==='all'?'on':''}" onclick="setTopic('all')">🎲 Tất cả</button>
    ${ts.map(t=>`<button class="lvlchip ${GSEL.topic===t.id?'on':''}" onclick="setTopic('${t.id}')">${t.em} ${esc(t.name)} <span class="lvltag lt-${lvlAbbr(t.lvl||'Vừa')}">${t.cefr||''}</span></button>`).join('')}</div>
  </div>`;
}
/* one vocab question (picture / VN→EN / EN→VN) for arcade games */
function vGenQ(pool){
  pool=(pool&&pool.length>=4)?pool:DATA[grade].vocab;
  const right=rnd(pool),others=pickN(pool.filter(v=>v[0]!==right[0]),3);
  const r=Math.random(),canPic=hasPic(right[0]);let prompt,opts;
  if(canPic&&r<.42){prompt=picBox(right[0],true);opts=[{t:right[0],ok:1},...others.map(o=>({t:o[0],ok:0}))];}
  else if(r<.71){prompt=`<div class="prompt-card"><b>${esc(right[1])}</b><div style="font-size:12px;color:var(--muted);font-weight:600">Chọn từ tiếng Anh đúng</div></div>`;opts=[{t:right[0],ok:1},...others.map(o=>({t:o[0],ok:0}))];}
  else{prompt=`<div class="prompt-card"><b>${esc(right[0])}</b><div style="font-size:12px;color:var(--muted);font-weight:600">Chọn nghĩa tiếng Việt đúng</div></div>`;opts=[{t:right[1],ok:1},...others.map(o=>({t:o[1],ok:0}))];}
  return{prompt,opts:shuffle(opts),right};
}
function optButtons(opts,handler){return `<div class="opts mt">${opts.map((o,k)=>`<button type="button" class="opt pic-opt" onclick="${handler}(${k})"><span class="ab">${'ABCDEFGH'[k]||(k+1)}</span>${esc(o.t)}</button>`).join('')}</div>`}

/* ================= FLASHCARDS ================= */
function startFlash(){const pool=poolVocab();GM={type:'flash',cards:shuffle(pool),i:0,flip:false};sndClick();renderFlash();}
function renderFlash(){
  const c=GM.cards[GM.i],pic=picBox(c[0]);
  $('gamesCard').innerHTML=gameTop('🃏 Thẻ từ vựng','<span class="streak">'+poolLabel()+'</span>')+
    `<div class="flash ${GM.flip?'flipped':''}" onclick="flashFlip()">
      <div class="flash-inner">
        <div class="flash-face flash-front">${pic||'<div class="em">🔤</div>'}<div class="w">${esc(c[0])}</div></div>
        <div class="flash-face flash-back"><div class="vn">${esc(c[1])}</div><div class="ex">Chạm để lật lại 🔁</div></div>
      </div></div>
    <p class="flash-tip">Chạm vào thẻ để xem nghĩa</p>
    <div class="flash-nav">
      <button class="btn ghost sm" onclick="event.stopPropagation();flashNav(-1)">⬅️</button>
      <button class="btn sun sm" onclick="event.stopPropagation();flashSpeak()">🔊 Đọc</button>
      <span class="flash-count">${GM.i+1} / ${GM.cards.length}</span>
      <button class="btn teal sm" onclick="event.stopPropagation();flashNav(1)">➡️</button>
    </div>
    <div class="center mt"><button class="btn ghost sm" onclick="gamesHome()">← Games</button></div>`;
}
function flashFlip(){GM.flip=!GM.flip;sndFlip();const f=document.querySelector('.flash');if(f)f.classList.toggle('flipped',GM.flip)}
function flashNav(d){GM.i=(GM.i+d+GM.cards.length)%GM.cards.length;GM.flip=false;sndClick();renderFlash()}
function flashSpeak(){speak(GM.cards[GM.i][0])}

/* ================= PICTURE QUIZ ================= */
function startPicQuiz(){GM={type:'pq',i:0,score:0,total:10};sndClick();pqNext();}
function pqNext(){
  if(GM.i>=GM.total)return pqEnd();
  const pool=poolPicVocab();const right=rnd(pool),others=pickN(DATA[grade].vocab.filter(v=>v[0]!==right[0]),3);
  const askEn=Math.random()<.5;
  const opts=shuffle(askEn?[{t:right[0],ok:1},...others.map(o=>({t:o[0],ok:0}))]:[{t:right[1],ok:1},...others.map(o=>({t:o[1],ok:0}))]);
  GM.cur={right,opts};
  $('gamesCard').innerHTML=gameTop('🖼️ Đố vui qua tranh','<span class="streak">🏅 '+GM.score+'</span>')+
    `<div class="qbar"><span class="qcount">Câu ${GM.i+1}/${GM.total}</span><div class="qprog"><i style="width:${GM.i/GM.total*100}%"></i></div></div>
    ${picBox(right[0])}
    <div class="qq center" style="font-size:16px">${askEn?'Bức tranh này là từ nào?':'Bức tranh này nghĩa là gì?'}</div>
    ${optButtons(opts,'pqAnswer')}
    <div class="feedback" id="pqfb"></div>
    <div class="center mt hidden" id="pqnext"><button class="btn teal" onclick="pqGo()">Câu tiếp ➜</button></div>`;
}
function pqAnswer(k){
  const o=GM.cur.opts[k];
  document.querySelectorAll('#gamesCard .opt').forEach((b,j)=>{b.disabled=true;if(GM.cur.opts[j].ok)b.classList.add('right');else if(j===k)b.classList.add('wrong');else b.classList.add('dim')});
  const fb=$('pqfb');
  if(o.ok){GM.score++;P.correct++;hitStreak();gainXP(5);sndOK();fb.className='feedback ok';fb.innerHTML='🎉 Chính xác! <b>'+esc(GM.cur.right[0]+' = '+GM.cur.right[1])+'</b>';}
  else{missStreak();sndNo();fb.className='feedback no';fb.innerHTML='😅 Đáp án: <b>'+esc(GM.cur.opts.find(x=>x.ok).t)+'</b> ('+esc(GM.cur.right[0]+' = '+GM.cur.right[1])+')';}
  persist();$('pqnext').classList.remove('hidden');
}
function pqGo(){GM.i++;sndClick();pqNext();}
function pqEnd(){
  const pct=GM.score/GM.total;if(pct>=.6){confetti(70);sndWin()}P.gameWins++;persist();checkBadges();
  $('gamesCard').innerHTML=gameTop('🖼️ Đố vui qua tranh')+`<div class="result"><div class="face">${pct>=.9?'🏆':pct>=.6?'🤩':'💪'}</div><h3>${pct>=.9?'Xuất sắc!':pct>=.6?'Giỏi lắm!':'Cố thêm nhé!'}</h3><div class="scoreline">Đúng <b>${GM.score}/${GM.total}</b> · ⭐ +${GM.score*5} XP</div><div class="row" style="justify-content:center"><button class="btn" onclick="startPicQuiz()">🔄 Chơi lại</button><button class="btn sun" onclick="startFlash()">🃏 Ôn thẻ từ</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`;
}

/* ================= 🚀 SPACE SHOOTER ================= */
function shootStars(){let s='';for(let i=0;i<26;i++)s+=`<span class="shoot-star" style="left:${Math.random()*100}%;top:${Math.random()*100}%"></span>`;return s;}
function startShoot(){GM={type:'shoot',score:0,lives:3,round:0,roundId:0,locked:false};sndClick();shootRound();}
function shootRound(){
  if(!GM||GM.type!=='shoot')return;
  if(GM.lives<=0)return shootEnd();
  if(GM.round>=12)return shootEnd(true);
  GM.round++;GM.locked=false;const id=++GM.roundId;
  const q=vGenQ(poolVocab());GM.cur=q;
  const lanes=shuffle([7,30,53,75]);
  const ufos=q.opts.map((o,k)=>`<button class="ufo" style="left:${lanes[k]}%;animation-duration:5s" onclick="shootUfo(${k})">${esc(o.t)}</button>`).join('');
  $('gamesCard').innerHTML=gameTop('🚀 Bắn súng vũ trụ')+
    `<div class="shoot-hud"><span>🏅 <b id="shScore">${GM.score}</b></span><span>Đợt ${GM.round}/12</span><span id="shLives">${'❤️'.repeat(GM.lives)}${'🤍'.repeat(3-GM.lives)}</span></div>
    ${q.prompt}
    <div class="shoot-stage" id="shStage">${shootStars()}${ufos}<div class="ship">🚀</div></div>`;
  GM.timer=setTimeout(()=>shootMiss(id),5200);
}
function shootHearts(){const lv=$('shLives');if(lv)lv.textContent='❤️'.repeat(Math.max(0,GM.lives))+'🤍'.repeat(3-Math.max(0,GM.lives));}
function shootUfo(k){
  if(!GM||GM.type!=='shoot'||GM.locked)return;
  const ufos=document.querySelectorAll('#shStage .ufo'),btn=ufos[k];if(!btn||btn.classList.contains('miss')||btn.classList.contains('boom'))return;
  if(GM.cur.opts[k].ok){
    GM.locked=true;clearTimeout(GM.timer);sndShoot();setTimeout(sndOK,80);btn.classList.add('boom');GM.score++;P.correct++;gainXP(5);persist();const sc=$('shScore');if(sc)sc.textContent=GM.score;
    setTimeout(shootRound,430);
  }else{
    sndHit();btn.classList.add('miss');btn.style.animationPlayState='paused';GM.lives--;shootHearts();
    if(GM.lives<=0){GM.locked=true;clearTimeout(GM.timer);setTimeout(()=>{sndLose();shootEnd()},250);}
  }
}
function shootMiss(id){
  if(!GM||GM.type!=='shoot'||id!==GM.roundId||GM.locked)return;
  GM.locked=true;GM.lives--;sndHit();shootHearts();
  const ufos=document.querySelectorAll('#shStage .ufo');GM.cur.opts.forEach((o,k)=>{if(o.ok&&ufos[k])ufos[k].classList.add('boom')});
  setTimeout(()=>{if(GM.lives<=0){sndLose();shootEnd();}else shootRound();},750);
}
function shootEnd(win){
  if(GM&&GM.timer)clearTimeout(GM.timer);const xp=GM.score*5+(win?20:0);if(GM.score>=6){confetti(80);sndWin()}P.gameWins++;persist();checkBadges();
  $('gamesCard').innerHTML=gameTop('🚀 Bắn súng vũ trụ')+`<div class="result"><div class="face">${win?'🏆':GM.score>=6?'🤩':'💪'}</div><h3>${win?'Hạ gục cả hạm đội!':GM.score>=6?'Xạ thủ cừ khôi!':'Luyện thêm nhé!'}</h3><div class="scoreline">Bắn trúng <b>${GM.score}</b> đáp án · ⭐ +${xp} XP</div><div class="row" style="justify-content:center"><button class="btn" onclick="startShoot()">🔄 Chơi lại</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`;
}

/* ================= ❤️ SURVIVAL (v2 — battle animations + map system) ================= */
const SURV_MAPS=[
  {id:1,name:'Rừng Xanh',em:'🌲',boss:'👺',bossName:'Quỷ Goblin',color:'#dcfce7',atk:'🪓',timer:10,dmgBase:14},
  {id:2,name:'Hang Tối',em:'🌋',boss:'🧟',bossName:'Xác Sống',color:'#fce7f3',atk:'🦴',timer:9,dmgBase:18},
  {id:3,name:'Biển Sâu',em:'🌊',boss:'🐙',bossName:'Quỷ Biển',color:'#dbeafe',atk:'💧',timer:8,dmgBase:22},
  {id:4,name:'Lâu Đài Ma',em:'🏰',boss:'🧛',bossName:'Ma Cà Rồng',color:'#ede9fe',atk:'🦇',timer:7,dmgBase:26},
  {id:5,name:'Thiên Hà',em:'🚀',boss:'👽',bossName:'Người Ngoài Hành Tinh',color:'#e0e7ff',atk:'⚡',timer:6,dmgBase:30},
];
const SURV_Q_PER_MAP=20;
const SURV_BOSSES=[
  {boss:'👺',bossName:'Quỷ Goblin',atk:'🪓'},
  {boss:'🧟',bossName:'Xác Sống',atk:'🦴'},
  {boss:'🐺',bossName:'Sói Hoang',atk:'⚡'},
  {boss:'🧙',bossName:'Phù Thủy',atk:'🔮'},
  {boss:'🐙',bossName:'Quỷ Biển',atk:'💧'},
  {boss:'🦇',bossName:'Dơi Ma',atk:'🌙'},
  {boss:'🧛',bossName:'Ma Cà Rồng',atk:'🔥'},
  {boss:'🐲',bossName:'Rồng Lửa',atk:'🔥'},
  {boss:'🦑',bossName:'Quái Biển',atk:'🫧'},
  {boss:'🤖',bossName:'Siêu Robot',atk:'💥'},
  {boss:'👾',bossName:'Quái Vũ Trụ',atk:'☄️'},
  {boss:'👽',bossName:'Ngoài Hành Tinh',atk:'🌟'},
];
function _survBoss(){return SURV_BOSSES[Math.floor(GM.totalQ/5)%SURV_BOSSES.length];}

/* ================= HSA ĐGNL ================= */
let _hsaTab='eng1';
const HSA_EXAMS={eng1:null,eng2:null,eng3:null,eng4:null,eng5:null,eng6:null,eng7:null};
function goHSA(){
  document.querySelectorAll('.gpill').forEach(p=>p.classList.remove('on'));
  document.getElementById('gpillHSA').classList.add('on');
  document.getElementById('tabHSA').style.display='';
  const ti=$('tabIELTS');if(ti)ti.style.display='none';
  const tt=$('tabTHPT');if(tt)tt.style.display='none';
  const tv=$('tabVocab');if(tv)tv.style.display='none';
  go('hsa');
}
function showHSATab(tab){
  _hsaTab=tab;
  document.querySelectorAll('#hsaSubtab button').forEach(b=>b.classList.remove('on'));
  const idx={eng1:0,eng2:1,eng3:2,eng4:3,eng5:4,eng6:5,eng7:6}[tab]||0;
  document.querySelectorAll('#hsaSubtab button')[idx].classList.add('on');
  const dataMap={get eng1(){return efzData('eng1')},get eng2(){return efzData('eng2')},get eng3(){return efzData('eng3')},get eng4(){return efzData('eng4')},get eng5(){return efzData('eng5')},get eng6(){return efzData('eng6')},get eng7(){return efzData('eng7')}};
  efzLoad(tab).then(()=>renderHSAQuiz(dataMap[tab]||efzData('eng1'),tab));
}

let _hsaState={};
function renderHSAQuiz(data,prefix){
  const el=$('hsaContent');
  _hsaState={answered:0,correct:0,total:data.reduce((s,cat)=>s+cat.questions.length,0),wrongs:[],catStats:{}};
  if(window._hsaTimer)clearInterval(window._hsaTimer);
  window._hsaStartTime=Date.now();
  window._hsaElapsed=0;
  let h=`<div class="hsa-score-bar" id="hsa-score-${prefix}">
    <div class="sc-item">📊 Đã làm: <b><span id="hsa-done-${prefix}">0</span>/${_hsaState.total}</b></div>
    <div class="sc-item">✅ Đúng: <b><span id="hsa-right-${prefix}">0</span></b></div>
    <div class="sc-item">📈 Tỉ lệ: <b><span id="hsa-pct-${prefix}">0</span>%</b></div>
    <div class="hsa-timer" id="hsa-timer-${prefix}"><span class="t-icon">⏱️</span> <span id="hsa-time-${prefix}">00:00</span></div>
    <button class="score-submit-btn" id="hsa-submit-top-${prefix}" onclick="hsaSubmit('${prefix}')">📩 Nộp bài (≥5 câu)</button>
  </div>`;
  // Start timer
  window._hsaTimer=setInterval(()=>{
    window._hsaElapsed=Math.floor((Date.now()-window._hsaStartTime)/1000);
    const m=Math.floor(window._hsaElapsed/60).toString().padStart(2,'0');
    const s=(window._hsaElapsed%60).toString().padStart(2,'0');
    const te=document.getElementById('hsa-time-'+prefix);
    if(te)te.textContent=m+':'+s;
  },1000);
  data.forEach(cat=>{
    h+=`<div class="hsa-cat-header">${cat.icon} ${cat.title}</div>`;
    if(cat.passage) h+=`<div class="hsa-q-card"><div class="q-passage">${cat.passage}</div></div>`;
    cat.questions.forEach(q=>{
      const qid=prefix+'-'+q.num;
      h+=`<div class="hsa-q-card" id="hq-${qid}">`;
      h+=`<div class="q-num">Câu ${q.num} ${q.level?'('+q.level+')':''}</div>`;
      h+=`<div class="q-text">${fmtExamText(q.text)}</div>`;
      h+=`<div class="hsa-opts">`;
      q.opts.forEach((opt,i)=>{
        const letter='ABCD'[i];
        h+=`<button class="hsa-opt" data-qid="${qid}" data-idx="${i}" onclick="hsaAnswer('${qid}',${i},'${prefix}',event)"><span class="opt-text-wrap">${letter}. ${opt}</span><span class="opt-hl-btn" onclick="event.stopPropagation();highlightOptBtn(this,'HSA ĐGNL',event)" title="Tô màu & dịch đáp án này">🖍️</span></button>`;
      });
      h+=`</div>`;
      h+=`<div class="hsa-explain" id="hexp-${qid}">`;
      h+=`<div class="exp-title">💡 Giải chi tiết</div>`;
      h+=`<div class="exp-body">${formatExplainHTML(q)}</div>`;
      h+=`</div></div>`;
    });
  });
  h+=`<div style="text-align:center;margin:24px 0"><button class="hsa-submit-btn" id="hsa-submit-${prefix}" onclick="hsaSubmit('${prefix}')">📩 Nộp Bài</button></div>`;
  h+=`<div class="hsa-summary" id="hsa-summary-${prefix}"></div>`;
  el.innerHTML=h;
}

function hsaAnswer(qid,idx,prefix,ev){
  const _sel=window.getSelection?window.getSelection().toString().trim():"";
  if(_sel.length>=2||window._justSelectedOptText)return;
  const card=document.getElementById('hq-'+qid);
  if(card.dataset.done) return;
  card.dataset.done='1';
  const btns=card.querySelectorAll('.hsa-opt');
  let correctIdx=-1;
  const dataMap={get eng1(){return efzData('eng1')},get eng2(){return efzData('eng2')},get eng3(){return efzData('eng3')},get eng4(){return efzData('eng4')},get eng5(){return efzData('eng5')},get eng6(){return efzData('eng6')},get eng7(){return efzData('eng7')}};
  const allData=dataMap[prefix]||efzData('eng1');
  for(const cat of allData){
    for(const q of cat.questions){
      if(prefix+'-'+q.num===qid){correctIdx=q.ans;break}
    }
    if(correctIdx>=0) break;
  }
  btns.forEach((b,i)=>{
    b.style.cursor='default';
    if(i===correctIdx) b.classList.add('correct');
    if(i===idx && i!==correctIdx) b.classList.add('wrong');
    if(i!==idx && i!==correctIdx) b.style.opacity='0.4';
  });
  const exp=document.getElementById('hexp-'+qid);
  exp.classList.add('show');
  _hsaState.answered++;
  if(idx===correctIdx) _hsaState.correct++;
  const de=$('hsa-done-'+prefix); if(de) de.textContent=_hsaState.answered;
  const re=$('hsa-right-'+prefix); if(re) re.textContent=_hsaState.correct;
  const pe=$('hsa-pct-'+prefix); if(pe) pe.textContent=_hsaState.answered?Math.round(_hsaState.correct/_hsaState.answered*100):0;
  const topBtn=$('hsa-submit-top-'+prefix); if(topBtn&&_hsaState.answered>=5){topBtn.classList.add('ready');topBtn.textContent='📩 Nộp Bài ('+_hsaState.answered+'/'+_hsaState.total+')';}
  // Track category and grammar topic for wrong answers
  let qCat='',qTopic='',qObj=null;
  for(const cat of allData){
    for(const q of cat.questions){
      if(prefix+'-'+q.num===qid){
        qCat=cat.title;qObj=q;
        const tm=q.explain.match(/<b>Phương pháp:<\/b>\s*([^<]+)/);
        qTopic=tm?tm[1].trim():'Khác';
        break;
      }
    }
    if(qObj)break;
  }
  if(!_hsaState.catStats[qCat])_hsaState.catStats[qCat]={total:0,correct:0};
  _hsaState.catStats[qCat].total++;
  try{efzTrack('HSA',qCat,idx===correctIdx,qObj,correctIdx)}catch(e){}
  if(idx===correctIdx){
    _hsaState.catStats[qCat].correct++;
  }else{
    _hsaState.wrongs.push({num:qObj.num,text:qObj.text,cat:qCat,topic:qTopic,chose:'ABCD'[idx],correct:'ABCD'[correctIdx],correctText:qObj.opts[correctIdx],level:qObj.level});
  }
  try{sndClick()}catch(e){}
  if(idx===correctIdx){try{addXP(5);toast('🎯 Chính xác! +5 XP')}catch(e){}}
  else{try{toast('❌ Sai rồi! Đáp án đúng: '+'ABCD'[correctIdx])}catch(e){}}
  // Show summary when all questions answered
  if(_hsaState.answered>=_hsaState.total){
    if(window._hsaTimer){clearInterval(window._hsaTimer);window._hsaTimer=null;}
    setTimeout(()=>showHSASummary(prefix),600);
  }
}

function hsaSubmit(prefix){
  const minRequired=5;
  if(_hsaState.answered<minRequired){
    toast('⚠️ Bạn cần làm ít nhất '+minRequired+' câu trước khi nộp bài!');
    return;
  }
  if(!confirm('Bạn đã làm '+_hsaState.answered+'/'+_hsaState.total+' câu. Bạn có chắc muốn nộp bài?'))return;
  // Auto-answer remaining unanswered questions as wrong
  const dataMap={get eng1(){return efzData('eng1')},get eng2(){return efzData('eng2')},get eng3(){return efzData('eng3')},get eng4(){return efzData('eng4')},get eng5(){return efzData('eng5')},get eng6(){return efzData('eng6')},get eng7(){return efzData('eng7')}};
  const allData=dataMap[prefix]||efzData('eng1');
  allData.forEach(cat=>{
    cat.questions.forEach(q=>{
      const qid=prefix+'-'+q.num;
      const card=document.getElementById('hq-'+qid);
      if(card && !card.dataset.done){
        card.dataset.done='1';
        const btns=card.querySelectorAll('.hsa-opt');
        btns.forEach((b,i)=>{
          b.style.cursor='default';
          if(i===q.ans) b.classList.add('correct');
          b.style.opacity=i===q.ans?'1':'0.4';
        });
        const exp=document.getElementById('hexp-'+qid);
        if(exp)exp.classList.add('show');
        _hsaState.answered++;
        // Count as wrong (unanswered)
        const qCat=cat.title;
        const tm=q.explain.match(/<b>Phương pháp:<\/b>\s*([^<]+)/);
        const qTopic=tm?tm[1].trim():'Khác';
        if(!_hsaState.catStats[qCat])_hsaState.catStats[qCat]={total:0,correct:0};
        _hsaState.catStats[qCat].total++;
        _hsaState.wrongs.push({num:q.num,text:q.text,cat:qCat,topic:qTopic,chose:'—',correct:'ABCD'[q.ans],correctText:q.opts[q.ans],level:q.level});
      }
    });
  });
  const de=$('hsa-done-'+prefix);if(de)de.textContent=_hsaState.answered;
  const pe=$('hsa-pct-'+prefix);if(pe)pe.textContent=_hsaState.answered?Math.round(_hsaState.correct/_hsaState.answered*100):0;
  // Hide submit button
  const btn=document.getElementById('hsa-submit-'+prefix);
  if(btn)btn.style.display='none';
  const topBtn=document.getElementById('hsa-submit-top-'+prefix);
  if(topBtn)topBtn.style.display='none';
  // Stop timer and show summary
  if(window._hsaTimer){clearInterval(window._hsaTimer);window._hsaTimer=null;}
  setTimeout(()=>showHSASummary(prefix),400);
}

function showHSASummary(prefix){
  const el=document.getElementById('hsa-summary-'+prefix);
  if(!el)return;
  const st=_hsaState;
  const actualWrongs=st.wrongs.filter(w=>w.chose!=='—');
  const skippedItems=st.wrongs.filter(w=>w.chose==='—');
  const attempted=st.correct+actualWrongs.length;
  const pctTotal=Math.round(st.correct/st.total*100);
  const pctAttempted=attempted>0?Math.round(st.correct/attempted*100):0;

  const evalPct=skippedItems.length>0?pctAttempted:pctTotal;
  let grade='',gradeColor='';
  if(evalPct>=85){grade='Xuất sắc 🏆';gradeColor='green';}
  else if(evalPct>=70){grade='Khá tốt 👍';gradeColor='blue';}
  else if(evalPct>=50){grade='Trung bình ⚡';gradeColor='blue';}
  else{grade='Cần củng cố 📚';gradeColor='red';}

  const elapsed=window._hsaElapsed||0;
  const mins=Math.floor(elapsed/60);
  const secs=elapsed%60;
  const timeStr=mins>0?mins+' phút '+secs+' giây':secs+' giây';

  let h=`<h3>📊 Kết Quả Chấm Điểm & Đánh Giá Lộ Trình Học Tập (HSA ĐGNL)</h3>`;
  h+=`<div class="hsa-sum-grid">
    <div class="hsa-sum-card"><div class="big blue">${st.correct}/${st.total}</div><div class="lbl">Điểm toàn đề</div></div>
    <div class="hsa-sum-card"><div class="big green">${st.correct}/${attempted}</div><div class="lbl">Đúng / Số câu đã làm (${pctAttempted}%)</div></div>
    <div class="hsa-sum-card"><div class="big red">${actualWrongs.length}</div><div class="lbl">Câu làm sai${skippedItems.length>0?` (+${skippedItems.length} bỏ trống)`:''}</div></div>
    <div class="hsa-sum-card"><div class="big ${gradeColor}">${evalPct}%</div><div class="lbl">Độ chính xác · ${grade}</div></div>
    <div class="hsa-sum-card"><div class="big blue">⏱️</div><div class="lbl">${timeStr}</div></div>
  </div>`;

  const dataMap={get eng1(){return efzData('eng1')},get eng2(){return efzData('eng2')},get eng3(){return efzData('eng3')},get eng4(){return efzData('eng4')},get eng5(){return efzData('eng5')},get eng6(){return efzData('eng6')},get eng7(){return efzData('eng7')}};
  const allData=dataMap[prefix]||efzData('eng1');
  const qMap={};
  allData.forEach(cat=>{
    cat.questions.forEach(q=>{qMap[q.num]={q,catTitle:cat.title};});
  });

  // Visual progress bars per section
  h+=`<div class="hsa-weak-section"><div class="hsa-weak-title">📋 Đánh giá năng lực theo từng phần thi</div>`;
  for(const[cat,s] of Object.entries(st.catStats)){
    const p=Math.round(s.correct/s.total*100);
    const color=p>=80?'#16a34a':p>=50?'#f59e0b':'#dc2626';
    const statusTxt=p>=80?'🌟 Vững vàng':p>=50?'⚡ Cần củng cố':'🔴 Điểm yếu cần ôn kỹ';
    h+=`<div class="diag-prog-row">
      <div class="diag-prog-head"><span>${cat}</span><span style="color:${color}">${s.correct}/${s.total} câu đúng (${p}%) · ${statusTxt}</span></div>
      <div class="diag-prog-track"><div class="diag-prog-fill" style="width:${p}%;background:${color}"></div></div>
    </div>`;
  }
  h+=`</div>`;

  const targetDiagnosticList=actualWrongs.length>0?actualWrongs:skippedItems;
  const isDiagnosingSkipped=(actualWrongs.length===0&&skippedItems.length>0);

  if(targetDiagnosticList.length>0){
    const topicMap={};
    targetDiagnosticList.forEach(w=>{
      const info=qMap[w.num];
      const skill=(w.topic&&w.topic!=='Khác')?w.topic:(info?classifyQuestionSkill(info.q,info.catTitle):w.cat.replace(/ \(.+/,''));
      w.skill=skill;
      if(!topicMap[skill])topicMap[skill]=[];
      topicMap[skill].push(w);
    });
    const sorted=Object.entries(topicMap).sort((a,b)=>b[1].length-a[1].length);

    h+=`<div class="hsa-weak-section"><div class="hsa-weak-title">${isDiagnosingSkipped?'📌 Các dạng bài bạn chưa làm trong đề này':'🔴 Chẩn đoán cụ thể các chủ điểm & dạng câu hỏi bạn đang yếu'}</div><div class="hsa-weak-list">`;
    sorted.forEach(([topic,items])=>{
      h+=`<span class="hsa-weak-tag">${topic} (${items.length} câu)</span>`;
    });
    h+=`</div></div>`;

    h+=`<div class="hsa-roadmap"><h4>🗺️ Lộ Trình Ôn Tập & Đề Xuất Học Tập Cụ Thể</h4>`;
    let pri=1;
    sorted.forEach(([topic,items])=>{
      const pClass=pri===1?'p1':pri<=3?'p2':'p3';
      const pLabel=pri===1?'🔥 Ưu tiên số 1 — Cần khắc phục ngay':pri<=3?'⚡ Ưu tiên số '+pri+' — Cần ôn luyện thêm':'✅ Ưu tiên số '+pri+' — Ôn củng cố';
      const adv=getSkillStudyAdvice(topic);
      const qLinks=items.map(w=>`<a class="diag-q-jump${w.chose==='—'?' skip':''}" onclick="jumpToQuestion('hq-${prefix}-${w.num}')" title="Bấm để cuộn tới xem giải thích Câu ${w.num}">Câu ${w.num} (${w.chose==='—'?'Chưa làm':'Chọn '+w.chose+' → Đúng: '+w.correct})</a>`).join('');

      h+=`<div class="diag-road-card ${pClass}">
        <div class="diag-road-top">
          <div class="diag-road-title">${pri}. ${topic}</div>
          <span class="diag-pri-badge ${pClass}">${pLabel} (${items.length} câu)</span>
        </div>
        <div style="margin-bottom:6px"><small style="font-weight:700;color:#64748b">📍 Các câu cần xem lại (bấm vào để cuộn tới lời giải):</small><br>${qLinks}</div>
        <div class="diag-road-grid">
          <div class="diag-road-box">📚 <b>Kiến thức cần học:</b> ${adv.what}</div>
          <div class="diag-road-box">💡 <b>Phương pháp & Mẹo xử lý:</b> ${adv.how}</div>
        </div>
        <div class="diag-action-links">
          ${adv.grammarTopic?`<a class="diag-act-btn" href="grammar.html" target="_blank">📖 Học chuyên đề Ngữ pháp này</a>`:''}
          <button class="diag-act-btn" onclick="goVocab()">📌 Ôn từ vựng đã lưu (${_getVocab().length} từ)</button>
        </div>
      </div>`;
      pri++;
    });
    h+=`</div>`;

    if(actualWrongs.length>0){
      h+=`<div class="hsa-weak-section"><div class="hsa-weak-title">📝 Bảng đối chiếu chi tiết các câu làm sai (${actualWrongs.length} câu)</div>`;
      h+=`<table class="hsa-wrong-table"><tr><th>Câu</th><th>Dạng bài</th><th>Chủ điểm</th><th>Bạn chọn</th><th>Đáp án đúng</th><th>Xem lại</th></tr>`;
      actualWrongs.forEach(w=>{
        h+=`<tr><td><b>Câu ${w.num}</b></td><td>${w.cat.replace(/ \(.+/,'')}</td><td>${w.skill||w.topic}</td><td style="color:#dc2626;font-weight:700">${w.chose}</td><td style="color:#16a34a;font-weight:700">${w.correct}. ${w.correctText}</td><td><button class="diag-q-jump" onclick="jumpToQuestion('hq-${prefix}-${w.num}')">🔍 Xem lời giải</button></td></tr>`;
      });
      h+=`</table></div>`;
    }
  }else{
    h+=`<div class="hsa-roadmap" style="text-align:center;padding:24px"><h4>🎉 Xuất sắc! Bạn trả lời đúng 100% các câu đã làm!</h4><p>Hãy tiếp tục luyện các đề HSA tiếp theo để giữ vững phong độ.</p></div>`;
  }

  el.innerHTML=h;
  el.classList.add('show');
  el.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ===== ENGLISH DATA (Q601-650) ===== */
let _ieltsTab='vocab';
function goIELTS(){
  document.querySelectorAll('.gpill').forEach(p=>p.classList.remove('on'));
  document.getElementById('gpillIELTS').classList.add('on');
  document.getElementById('tabIELTS').style.display='';
  const tt2=$('tabTHPT');if(tt2)tt2.style.display='none';
  go('ielts');
  showIELTSTab('vocab');
}
function showIELTSTab(tab){
  _ieltsTab=tab;try{_iqStop()}catch(e){}
  const tabs=['vocab','para','quiz','game'];
  document.querySelectorAll('#ieltsSubtab button').forEach((b,i)=>b.classList.toggle('on',tabs[i]===tab));
  if(tab==='vocab')_ieltsVocab();
  else if(tab==='para')_ieltsParaList();
  else if(tab==='quiz')_ieltsQuiz();
  else _ieltsFlash();
}
const CEFR_ORDER=['B1','B2','C1','C2'];
const CEFR_INFO={B1:'nền tảng',B2:'band 6.0-6.5',C1:'band 7.0-7.5',C2:'band 8.0+'};
let _ieltsLv='all';
function _ieltsAll(lv){const a=IELTS_TOPICS.flatMap(t=>t.words);return (lv&&lv!=='all')?a.filter(w=>w[3]===lv):a}
function _ieltsSetLv(lv){_ieltsLv=lv;_ieltsVocab(_ieltsTopic);}
let _ieltsTopic=null;
function _lvBar(cur,fn){
  return `<div class="lvfilter"><button class="${cur==='all'?'on':''}" onclick="${fn}('all')">🎯 Tất cả</button>`+
    CEFR_ORDER.map(b=>`<button class="${cur===b?'on':''}" onclick="${fn}('${b}')">${b} · ${CEFR_INFO[b]}</button>`).join('')+`</div>`;
}
function _ieltsVocab(topicId){
  const el=$('ieltsContent');_ieltsTopic=topicId||null;
  if(!topicId){
    const cnt=t=>_ieltsLv==='all'?t.words.length:t.words.filter(w=>w[3]===_ieltsLv).length;
    el.innerHTML=_lvBar(_ieltsLv,'_ieltsSetLv')+
      `<div class="ielts-topic-grid">`+
      IELTS_TOPICS.map(t=>`<div class="ielts-topic-card" onclick="_ieltsVocab('${t.id}')"><span class="tc-em">${t.em}</span><div class="tc-nm">${t.name}</div><div class="tc-cnt">${cnt(t)} từ</div></div>`).join('')+
      `</div><p class="sub" style="margin-top:10px">Tổng cộng <b>${_ieltsAll('all').length} từ</b> — ${CEFR_ORDER.map(b=>`<b style="color:#0f766e">${_ieltsAll(b).length}</b> từ ${b}`).join(' · ')}</p>`;
    return;
  }
  const t=IELTS_TOPICS.find(x=>x.id===topicId);
  if(!t)return;
  let ws=t.words.slice().sort((a,b)=>CEFR_ORDER.indexOf(a[3])-CEFR_ORDER.indexOf(b[3]));
  if(_ieltsLv!=='all')ws=ws.filter(w=>w[3]===_ieltsLv);
  el.innerHTML=`<button class="btn ghost sm" onclick="_ieltsVocab()" style="margin-bottom:10px">← Chủ đề</button>
    <h3 style="margin:0 0 10px">${t.em} ${t.name} <small style="color:#64748b;font-weight:600">(${ws.length} từ)</small></h3>`+
    _lvBar(_ieltsLv,'_ieltsSetLv')+
    `<div class="ielts-word-list">`+
    (ws.length?ws.map(([en,vn,ex,lv])=>`<div class="ielts-word-row"><div><span class="cefr ${lv||'B2'}">${lv||'B2'}</span><span class="iw-en">${en}</span><span class="iw-ex">"${ex}"</span></div><span class="iw-vn">${vn}</span></div>`).join(''):'<p class="sub">Chủ đề này chưa có từ ở mức đã chọn.</p>')+
    `</div>`;
}
function _ieltsParaList(){
  const el=$('ieltsContent');
  el.innerHTML=`<p class="sub" style="margin-bottom:10px">Dùng từ đồng nghĩa để paraphrase trong IELTS Writing & Speaking — tránh lặp từ!</p>`+
    IELTS_PARA.map(p=>`<div class="para-group"><div class="pg-head">${p.word} <span style="font-size:12px;color:#64748b;font-weight:400">= ${p.vn}</span></div><div class="para-chips"><span class="para-chip main">${p.word}</span>${p.syns.map(s=>`<span class="para-chip">${s}</span>`).join('')}</div></div>`).join('');
}
/* ===== ⚡ IELTS QUIZ — chia MÀN, khó dần, đồng hồ 4 giây ===== */
let _iqStage=+(localStorage.getItem('efz_iqstage')||1)||1, _iqBest=+(localStorage.getItem('efz_iqbest')||1)||1, _iqTimer=null;
const IQ_PER_STAGE=10;
function _iqPlan(st){
  /* mức từ, số đáp án, dạng câu, giây suy nghĩ — càng lên màn càng ngặt */
  const P=[
    {bands:['B1','B2'],       n:4,kinds:['meaning','word','meaning','colloc'],                        t:5},
    {bands:['B2'],            n:4,kinds:['meaning','word','cloze','colloc','para'],                   t:5},
    {bands:['B2','C1'],       n:4,kinds:['meaning','word','cloze','colloc','para'],                   t:4},
    {bands:['C1'],            n:5,kinds:['meaning','word','cloze','colloc','para','notsyn'],          t:4},
    {bands:['C1'],            n:5,kinds:['word','cloze','colloc','para','notsyn','meaning'],          t:4},
    {bands:['C1','C2'],       n:5,kinds:['word','cloze','colloc','notsyn','para'],                    t:4},
    {bands:['C2'],            n:6,kinds:['word','cloze','colloc','notsyn','para'],                    t:4},
    {bands:['C2'],            n:6,kinds:['word','cloze','colloc','notsyn'],                           t:3},
  ];
  const q=P[Math.min(st-1,P.length-1)];
  /* từ màn 9 trở đi: toàn C2, 6 đáp án, 3 giây */
  return st<=P.length?q:{bands:['C2','C1'],n:6,kinds:['word','cloze','colloc','notsyn'],t:3};
}
function _iqStop(){if(_iqTimer){clearInterval(_iqTimer);_iqTimer=null}}
function _iqSetStage(st){_iqStage=Math.max(1,Math.min(_iqBest,st));localStorage.setItem('efz_iqstage',_iqStage);_ieltsQuiz();}
function _iqPickBand(bands){
  let pool=IELTS_TOPICS.flatMap(t=>t.words.map(w=>[w,t]));
  let f=pool.filter(([w])=>bands.indexOf(w[3])>=0);
  return f.length>=8?f:pool;
}
function _iqMake(plan){
  const pool=_iqPickBand(plan.bands),n=plan.n;
  const kind=plan.kinds[Math.floor(Math.random()*plan.kinds.length)];
  const [w,tp]=pool[Math.floor(Math.random()*pool.length)];
  const others=(arr,k,key)=>shuffle(arr.filter(key)).slice(0,k);
  if(kind==='para'||kind==='notsyn'){
    const pr=IELTS_PARA[Math.floor(Math.random()*IELTS_PARA.length)];
    if(kind==='para'){
      const right=pr.syns[Math.floor(Math.random()*pr.syns.length)];
      const wr=shuffle(IELTS_PARA.filter(x=>x.word!==pr.word).flatMap(x=>x.syns)).slice(0,n-1);
      return{q:`🔄 Từ nào <b>paraphrase</b> đúng cho "<b>${pr.word}</b>" (${pr.vn})?`,opts:shuffle([right,...wr]),ans:right,exp:`${pr.word} → ${right}`,t:plan.t};
    }
    const keep=shuffle(pr.syns).slice(0,n-1);
    const other=IELTS_PARA.filter(x=>x.word!==pr.word);
    const o2=other[Math.floor(Math.random()*other.length)];
    const wrong=o2.syns[Math.floor(Math.random()*o2.syns.length)];
    return{q:`❌ Từ nào <b>KHÔNG</b> cùng nghĩa với "<b>${pr.word}</b>" (${pr.vn})?`,opts:shuffle([wrong,...keep]),ans:wrong,exp:`"${wrong}" thuộc nhóm "${o2.word}" (${o2.vn}), không phải "${pr.word}"`,t:plan.t+1};
  }
  if(kind==='cloze'){
    const ex=w[2],re=new RegExp('\\b'+w[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');
    if(re.test(ex)){
      const wr=shuffle(pool.filter(([x])=>x[0]!==w[0])).slice(0,n-1).map(([x])=>x[0]);
      return{q:`📝 Điền từ vào chỗ trống:<br><b style="font-size:16px">"${ex.replace(re,'______')}"</b>`,opts:shuffle([w[0],...wr]),ans:w[0],exp:`${w[0]} = ${w[1]} — "${ex}"`,t:plan.t+2};
    }
  }
  if(kind==='colloc'){
    const wr=shuffle(pool.filter(([x])=>x[0]!==w[0]&&x[2]!==w[2])).slice(0,n-1).map(([x])=>x[2]);
    return{q:`🔗 Cụm từ nào đi <b>đúng</b> với "<b>${w[0]}</b>" (${w[1]})?`,opts:shuffle([w[2],...wr]),ans:w[2],exp:`✔️ "${w[2]}" — ${w[0]} = ${w[1]}`,t:plan.t+2};
  }
  if(kind==='word'){
    const wr=shuffle(pool.filter(([x])=>x[1]!==w[1])).slice(0,n-1).map(([x])=>x[0]);
    return{q:`✍️ "<b>${w[1]}</b>" — từ tiếng Anh (${w[3]}) là?`,opts:shuffle([w[0],...wr]),ans:w[0],exp:`${w[0]} = ${w[1]} — "${w[2]}"`,t:plan.t};
  }
  const wr=shuffle(pool.filter(([x])=>x[1]!==w[1])).slice(0,n-1).map(([x])=>x[1]);
  return{q:`📖 "<b>${w[0]}</b>" (${w[3]}) có nghĩa là gì?`,opts:shuffle([w[1],...wr]),ans:w[1],exp:`${w[0]} = ${w[1]} — "${w[2]}"`,t:plan.t};
}
function _ieltsQuiz(){
  _iqStop();
  const el=$('ieltsContent'),plan=_iqPlan(_iqStage);
  const qs=[];let guard=0;
  while(qs.length<IQ_PER_STAGE&&guard++<400){
    const q=_iqMake(plan);
    if(q&&q.opts.length===plan.n&&new Set(q.opts).size===plan.n&&!qs.some(x=>x.q===q.q))qs.push(q);
  }
  let cur=0,score=0;
  const stageBtns=Array.from({length:Math.max(_iqBest,1)},(_,i)=>i+1)
    .map(i=>`<button class="${i===_iqStage?'on':''}" onclick="_iqSetStage(${i})">Màn ${i}</button>`).join('');
  function head(){
    return `<div class="lvfilter">${stageBtns}${_iqBest>=9?'<button style="border-color:#9333ea;color:#9333ea">♾️ C2</button>':''}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted);font-weight:700;margin-bottom:4px">
        <span>🎯 Màn ${_iqStage} · mức ${plan.bands.join('/')} · ${plan.n} đáp án</span><span>Câu ${cur+1}/${IQ_PER_STAGE} · ✅ ${score}</span></div>`;
  }
  function render(){
    _iqStop();
    if(cur>=qs.length){
      const pass=score>=8;
      if(pass&&_iqStage>=_iqBest){_iqBest=_iqStage+1;localStorage.setItem('efz_iqbest',_iqBest)}
      el.innerHTML=`<div class="result"><div class="face">${score>=9?'🏆':pass?'🎉':score>=5?'💪':'📚'}</div>
        <h3>Màn ${_iqStage}: ${score}/${IQ_PER_STAGE} câu đúng</h3>
        <p>${pass?'Qua màn! Mở khoá <b>Màn '+(_iqStage+1)+'</b> khó hơn 🔥':'Cần <b>8/10</b> mới qua màn. Ôn lại rồi thử lại nhé!'}</p>
        <div class="row" style="gap:8px;justify-content:center;margin-top:10px">
          ${pass?`<button class="btn" onclick="_iqSetStage(${_iqStage+1})">➡️ Màn ${_iqStage+1}</button>`:''}
          <button class="btn ghost" onclick="_ieltsQuiz()">🔄 Làm lại màn ${_iqStage}</button></div></div>`;
      gainXP(score*3+(pass?10:0));if(pass)sndWin();return;
    }
    const q=qs[cur];let left=q.t*10;
    el.innerHTML=head()+
      `<div class="qtimer" id="iqbar"><i style="width:100%"></i></div>
       <div class="q-box" style="margin-bottom:10px"><b>${q.q}</b></div>`+
      q.opts.map(o=>`<button class="opt" onclick="_ieltsAns(this,${JSON.stringify(o).replace(/"/g,'&quot;')})">${o}</button>`).join('');
    _iqTimer=setInterval(()=>{
      left--;
      const bar=$('iqbar');if(!bar){_iqStop();return}
      bar.firstChild.style.width=Math.max(0,left/(q.t*10)*100)+'%';
      bar.classList.toggle('warn',left<=q.t*10*.35);
      if(left<=0){_iqStop();_ieltsAns(null,null)}
    },100);
  }
  window._ieltsAns=function(btn,chosen){
    _iqStop();
    const q=qs[cur];if(!q)return;
    document.querySelectorAll('#ieltsContent .opt').forEach(b=>b.disabled=true);
    const ok=chosen===q.ans;
    if(btn){btn.style.background=ok?'#dcfce7':'#fee2e2';btn.style.borderColor=ok?'#16a34a':'#dc2626';}
    if(!ok)document.querySelectorAll('#ieltsContent .opt').forEach(b=>{if(b.textContent.trim()===String(q.ans).trim()){b.style.background='#dcfce7';b.style.borderColor='#16a34a';}});
    if(ok){score++;sndOK();}else sndNo();
    const d=document.createElement('div');
    d.style.cssText='margin-top:8px;padding:8px 12px;border-radius:10px;font-size:13px;font-weight:600;'+(ok?'background:#f0fdf4;color:#166534':'background:#fef2f2;color:#991b1b');
    d.innerHTML=(chosen===null?'⏰ <b>Hết giờ — tính SAI!</b><br>':(ok?'✅ ':'❌ '))+'💡 '+esc(q.exp);
    el.appendChild(d);
    /* giữ phần giải thích lâu hơn để học sinh kịp đọc */
    setTimeout(()=>{cur++;render();},chosen===null?3600:2800);
  };
  render();
}
function _ieltsFlash(){
  const el=$('ieltsContent');
  const all=IELTS_TOPICS.flatMap(t=>t.words).sort(()=>Math.random()-.5);
  let idx=0,flip=false,score=0;
  function draw(){
    if(idx>=Math.min(20,all.length)){
      el.innerHTML=`<div class="result"><div class="face">🎴</div><h3>Xong ${idx} thẻ từ!</h3><p>Nhớ được <b>${score}</b> từ ⭐</p><button class="btn" onclick="_ieltsFlash()">🔄 Lần nữa</button></div>`;
      gainXP(score*2);return;
    }
    const[en,vn,ex]=all[idx];
    el.innerHTML=`<div style="text-align:right;font-size:12px;color:var(--muted);margin-bottom:6px">${idx+1}/20 thẻ · ✅ Nhớ: ${score}</div>
      <div class="ielts-flash${flip?' flip':''}" onclick="_ifFlip()">
        ${flip?`<div class="if-word">${vn}</div><div class="if-hint">💡 ${ex}</div>`:
               `<div class="if-word">${en}</div><div class="if-hint">👆 Bấm để xem nghĩa</div>`}
      </div>
      ${flip?`<div class="row" style="gap:8px;justify-content:center"><button class="btn" style="background:#dcfce7;color:#166534;border:2px solid #16a34a" onclick="_ifNext(true)">✅ Nhớ rồi</button><button class="btn ghost" onclick="_ifNext(false)">❌ Chưa nhớ</button></div>`:''}`;
    window._ifFlip=()=>{flip=true;draw();};
    window._ifNext=(ok)=>{if(ok)score++;idx++;flip=false;draw();};
  }
  draw();
}

function startSurvival(){
  GM={type:'surv',hp:100,wave:0,mapQ:0,score:0,map:0,totalQ:0};
  sndClick();survNext();
}

function _survMapData(){return SURV_MAPS[Math.min(GM.map,SURV_MAPS.length-1)];}

function _survRender(){
  const md=_survMapData(),cls=GM.hp>60?'':GM.hp>30?'mid':'low';
  const pct=Math.round((GM.mapQ/SURV_Q_PER_MAP)*100);
  $('gamesCard').innerHTML=gameTop('❤️ Sinh tồn vượt ải',
    `<span class="streak">${md.em} Màn ${GM.map+1}: ${md.name}</span>`)+
    `<div class="row" style="justify-content:space-between;margin-bottom:2px">
       <b>❤️ HP ${GM.hp}</b>
       <span>⏱️ <b id="survTimer" style="color:var(--orange)">${md.timer}</b>s</span>
     </div>
     <div class="hpbar"><div class="hp-fill ${cls}" id="survHp" style="width:${GM.hp}%"></div></div>
     <div class="map-prog-wrap">
       <div style="font-size:11px;color:var(--muted);margin-bottom:2px">Tiến độ màn: ${GM.mapQ}/${SURV_Q_PER_MAP} câu</div>
       <div class="map-prog-bar"><div class="map-prog-fill" id="survMapProg" style="width:${pct}%"></div></div>
     </div>
     <div class="surv-boss-area" id="survBossArea">
       <span class="wave-monster" id="survMon">${_survBoss().boss}</span>
     </div>
     <div class="surv-boss-name">${_survBoss().bossName} ${_survBoss().boss}</div>
     ${GM.cur.prompt}
     ${optButtons(GM.cur.opts,'survAnswer')}`;
}

function survNext(){
  if(!GM||GM.type!=='surv')return;
  if(GM.hp<=0)return survEnd();
  if(GM.mapQ>=SURV_Q_PER_MAP)return survMapClear();
  GM.wave++;GM.mapQ++;GM.totalQ++;
  clearInterval(GM.timer);
  GM.cur=vGenQ(poolVocab());
  _survRender();
  const md=_survMapData();
  GM.t=md.timer;
  GM.timer=setInterval(()=>{
    GM.t--;const el=$('survTimer');if(el)el.textContent=GM.t;
    if(GM.t<=0){clearInterval(GM.timer);survHurt(true);}
  },1000);
}

function survAnswer(k){
  if(!GM||GM.type!=='surv')return;clearInterval(GM.timer);
  const md=_survMapData();
  document.querySelectorAll('#gamesCard .opt').forEach((b,j)=>{
    b.disabled=true;
    if(GM.cur.opts[j].ok)b.classList.add('right');
    else if(j===k)b.classList.add('wrong');
  });
  if(GM.cur.opts[k].ok){
    /* ✅ CORRECT — player attacks boss */
    GM.score++;P.correct++;gainXP(4);sndOK();
    GM.hp=Math.min(100,GM.hp+5);
    const hp=$('survHp');if(hp){hp.style.width=GM.hp+'%';hp.className='hp-fill '+(GM.hp>60?'':GM.hp>30?'mid':'low')}
    const area=$('survBossArea');
    if(area){
      const proj=document.createElement('span');
      proj.className='surv-proj';proj.textContent=_survBoss().atk;
      area.appendChild(proj);
      setTimeout(()=>{if(proj.parentNode)proj.remove();},420);
    }
    const mon=$('survMon');
    if(mon){mon.classList.remove('boss-attack','boss-recoil');void mon.offsetWidth;mon.classList.add('boss-recoil');}
    persist();setTimeout(survNext,750);
  } else survHurt(false);
}

function survHurt(timeout){
  sndNo();
  const md=_survMapData();
  const dmg=md.dmgBase+Math.floor(GM.wave/2);
  GM.hp=Math.max(0,GM.hp-dmg);
  const hp=$('survHp');
  if(hp){hp.style.width=GM.hp+'%';hp.className='hp-fill '+(GM.hp>60?'':GM.hp>30?'mid':'low')}
  /* ❌ WRONG — boss attacks player */
  const mon=$('survMon');
  if(mon){mon.classList.remove('boss-attack','boss-recoil');void mon.offsetWidth;mon.classList.add('boss-attack');}
  const card=$('gamesCard');
  if(card){
    card.classList.remove('surv-card-shake');void card.offsetWidth;card.classList.add('surv-card-shake');
    const flash=document.createElement('div');flash.className='surv-red-flash';
    card.appendChild(flash);setTimeout(()=>{if(flash.parentNode)flash.remove();},420);
  }
  document.querySelectorAll('#gamesCard .opt').forEach((b,j)=>{b.disabled=true;if(GM.cur.opts[j].ok)b.classList.add('right')});
  toast((timeout?'⏰ Hết giờ! ':'😵 Sai rồi! ')+'-'+dmg+' HP');persist();
  setTimeout(()=>{if(GM.hp<=0)survEnd();else survNext();},1050);
}

function survMapClear(){
  clearInterval(GM.timer);
  const md=_survMapData();
  const nextIdx=GM.map+1,isLast=nextIdx>=SURV_MAPS.length;
  const xpBonus=GM.map*20+50;gainXP(xpBonus);
  sndWin();confetti(70);P.gameWins++;persist();checkBadges();
  const nextHtml=isLast
    ? `<p style="color:var(--violet);font-weight:800;margin:10px 0">🎉 Bạn đã chinh phục tất cả ${SURV_MAPS.length} bản đồ! Huyền thoại!</p>`
    : `<div class="surv-next-map" style="background:${SURV_MAPS[nextIdx].color}">
         <p style="margin:0 0 4px;font-weight:700">Bản đồ tiếp: ${SURV_MAPS[nextIdx].em} <b>${SURV_MAPS[nextIdx].name}</b></p>
         <p style="margin:0;font-size:13px;color:var(--muted)">Boss: ${SURV_MAPS[nextIdx].boss} ${SURV_MAPS[nextIdx].bossName} · ⏱️ ${SURV_MAPS[nextIdx].timer}s/câu</p>
       </div>`;
  $('gamesCard').innerHTML=gameTop('❤️ Sinh tồn vượt ải')+
    `<div class="map-clear-card">
       <div style="font-size:64px;margin-bottom:6px">🏆</div>
       <h2 style="color:#92400e;margin:0 0 4px">Màn ${GM.map+1} hoàn thành!</h2>
       <p style="color:#78350f;margin:4px 0">${md.em} <b>${md.name}</b> — đã đánh bại ${md.bossName} ${md.boss}!</p>
       <div style="font-size:13px;color:#a16207">✅ ${GM.score} câu đúng · ❤️ HP còn ${GM.hp} · ⭐ +${xpBonus} XP</div>
     </div>
     ${nextHtml}
     <div class="row" style="justify-content:center;margin-top:10px">
       ${isLast
         ? `<button class="btn" onclick="startSurvival()">🔄 Chơi lại từ đầu</button>`
         : `<button class="btn" onclick="survAdvanceMap()">⚔️ Tiến vào màn ${nextIdx+1} →</button>`}
       <button class="btn ghost" onclick="gamesHome()">← Games</button>
     </div>`;
}

function survAdvanceMap(){
  GM.map++;GM.mapQ=0;
  sndClick();survNext();
}

function survEnd(){
  clearInterval(GM.timer);
  const xp=GM.totalQ*4;P.gameWins++;persist();checkBadges();
  if(GM.totalQ>=10){confetti(80);sndWin();}else{sndLose();}
  $('gamesCard').innerHTML=gameTop('❤️ Sinh tồn vượt ải')+
    `<div class="result">
       <div class="face">${GM.map>=3?'🏆':GM.map>=1?'🤩':'💪'}</div>
       <h3>Game Over!</h3>
       <p>Vượt qua <b>${GM.map+1}</b> bản đồ · Trả lời <b>${GM.totalQ}</b> câu</p>
       <div class="scoreline">Đúng <b>${GM.score}</b> câu · ⭐ +${xp} XP</div>
       <div class="row" style="justify-content:center;margin-top:10px">
         <button class="btn" onclick="startSurvival()">🔄 Chơi lại</button>
         <button class="btn ghost" onclick="gamesHome()">← Games</button>
       </div>
     </div>`;
}
/* ==========================================================
   ☁️ ĐĂNG NHẬP GOOGLE + ĐỒNG BỘ TIẾN ĐỘ (Firebase)
   ----------------------------------------------------------
   👉 CÁCH BẬT (làm 1 lần, miễn phí, ~5 phút):
   1) Vào https://console.firebase.google.com → "Add project" → đặt tên tuỳ ý.
   2) Trong project: Build → Authentication → Get started → tab "Sign-in method"
      → bật "Google" → Save.
   3) Build → Firestore Database → Create database → chọn "Start in production mode"
      → chọn vùng (asia-southeast1) → Enable.
      Vào tab "Rules", dán đúng đoạn này rồi Publish:
         rules_version = '2';
         service cloud.firestore {
           match /databases/{db}/documents {
             match /saves/{uid} {
               allow read, write: if request.auth != null && request.auth.uid == uid;
               // thầy (trang admin) được XEM tiến độ của mọi học sinh, không sửa được
               allow read: if request.auth != null && request.auth.token.email_verified == true
                           && request.auth.token.email == '<email của thầy>';
             }
             // bảng vàng chung: ai đã đăng nhập cũng XEM được, mỗi bạn chỉ ghi được dòng của mình
             match /leaderboard/{uid} {
               allow read: if request.auth != null;
               allow write: if request.auth != null && request.auth.uid == uid
                            && request.resource.data.xp is int && request.resource.data.xp >= 0
                            && request.resource.data.name is string && request.resource.data.name.size() <= 20;
             }
           }
         }
      (Đăng nhập bằng tên + mật khẩu: Authentication → Sign-in method → bật thêm "Email/Password".)
      ✅ ĐÃ LÀM XONG ngày 11/11/2026: project "english-fun-zone", Firestore ở asia-southeast1 (Singapore).
   4) Authentication → Settings → "Authorized domains" → Add domain
      → nhập:  nguyenisnotwibu.github.io
   5) Project settings (bánh răng) → mục "Your apps" → bấm biểu tượng </> (Web)
      → đặt tên → Register app → copy 6 dòng trong firebaseConfig
      → dán đè vào EFZ_FIREBASE bên dưới rồi deploy lại.
   (Thông tin này công khai được — Firebase thiết kế như vậy, bảo mật nằm ở Rules.)
   ========================================================== */
const EFZ_FIREBASE={
  apiKey:            "AIzaSyDyStvNh-7tQ6KJ1CnPmUFZTivqXcHZ5qs",
  authDomain:        "english-fun-zone.firebaseapp.com",
  projectId:         "english-fun-zone",
  storageBucket:     "english-fun-zone.firebasestorage.app",
  messagingSenderId: "698265081745",
  appId:             "1:698265081745:web:190e2b20b7059835dbec30"
};
let efzFB=null, efzUser=null, efzCloudBusy=false;
function efzCloudOn(){return !!(EFZ_FIREBASE.apiKey&&EFZ_FIREBASE.projectId)}
function _efzScript(src){return new Promise((ok,no)=>{
  const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('load '+src));
  document.head.appendChild(s)})}
let _efzInitP=null;
function efzCloudInit(){
  if(efzFB)return Promise.resolve(efzFB);
  if(!_efzInitP)_efzInitP=_efzCloudInit0().then(r=>{if(!r)_efzInitP=null;return r},()=>{_efzInitP=null;return null});
  return _efzInitP;
}
async function _efzCloudInit0(){
  if(!efzCloudOn()||efzFB)return efzFB;
  const V='10.12.2', H=['https://www.gstatic.com/firebasejs/'+V+'/','https://cdnjs.cloudflare.com/ajax/libs/firebase/'+V+'/'];
  let ok=false;
  for(const h of H){
    try{
      await _efzScript(h+'firebase-app-compat.js');
      await _efzScript(h+'firebase-auth-compat.js');
      await _efzScript(h+'firebase-firestore-compat.js');
      ok=true;break;
    }catch(e){}
  }
  if(!ok||typeof firebase==='undefined'){toast('😢 Không tải được Firebase — kiểm tra mạng nhé!');return null}
  firebase.initializeApp(EFZ_FIREBASE);
  efzFB={auth:firebase.auth(),db:firebase.firestore()};
  efzFB.auth.onAuthStateChanged(u=>{
    efzUser=u||null;
    try{if(u)localStorage.setItem('efz_cloud','1')}catch(e){}
    efzRenderCloud();
    efzOnAuth(u);
  });
  return efzFB;
}
function efzRenderCloud(){const h=efzCloudBox();const b=$('efzCloudBox');if(b)b.innerHTML=h;const b2=$('efzCloudBoard');if(b2)b2.innerHTML=h}
/* chỉ thầy (trang admin hoặc khung xem trước của admin) mới thấy hướng dẫn kỹ thuật */
function efzIsAdminView(){
  try{if(sessionStorage.getItem('efz_admin')==='1')return true}catch(e){}
  try{return window.top!==window.self}catch(e){return true}
}
function efzCloudBox(){
  if(!efzCloudOn())
    return !efzIsAdminView() ? '' : `<div style="font-size:11.5px;color:var(--muted);font-weight:600;line-height:1.55;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:10px;padding:8px 10px">
      ☁️ <b>Đồng bộ bằng tài khoản Google</b> — đã viết sẵn, chỉ cần bật.<br>
      Thầy tạo 1 dự án Firebase miễn phí rồi dán 6 dòng cấu hình vào biến <code>EFZ_FIREBASE</code> ở đầu phần script
      (hướng dẫn 5 bước ghi ngay trên biến đó trong file <code>js/app.js</code>). Trong lúc chờ, tiến độ vẫn được
      <b>lưu trên máy này</b> và chuyển máy được bằng <b>mã sao lưu</b> ở trên.</div>`;
  if(!efzUser)
    return `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <button class="btn ghost sm" onclick="efzLogin()">🔐 Đăng nhập Google để đồng bộ</button>
      <span style="font-size:11.5px;color:var(--muted);font-weight:600">Chơi ở máy nào cũng thấy đúng tiến độ.</span></div>`;
  return `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <span style="font-size:12px;font-weight:700;color:#0f766e">✅ ${esc(efzAccName())}</span>
      <button class="btn teal sm" onclick="efzCloudPush(true)">☁️ Lưu lên đám mây</button>
      <button class="btn sun sm" onclick="efzCloudPull()">⬇️ Tải từ đám mây</button>
      <button class="btn ghost sm" onclick="efzLogout()">Đăng xuất</button></div>`;
}
async function efzLogin(){
  const fb=await efzCloudInit();if(!fb){efzGateMsg('😢 Không tải được — kiểm tra mạng rồi thử lại nhé!');return}
  try{await fb.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());sndOK()}
  catch(e){const c=e&&e.code||'';
    const m=c==='auth/popup-blocked'?'Trình duyệt đang chặn cửa sổ đăng nhập — cho phép pop-up rồi bấm lại nhé.'
      :c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request'?'Em chưa chọn tài khoản Google. Bấm lại nhé!'
      :c==='auth/network-request-failed'?'Mất mạng — kiểm tra kết nối rồi thử lại.'
      :'Đăng nhập Google không thành công ('+c+'). Nếu đang mở trong Zalo/Facebook, hãy mở bằng Chrome hoặc Safari.';
    efzGateMsg('😢 '+m);toast('😢 '+m)}
}
/* tài khoản riêng: tên đăng nhập + mật khẩu (cho bạn chưa có Gmail). Firebase cần dạng email nên ghép tên với 1 tên miền nội bộ. */
async function efzPwAuth(isNew){
  const u=($('lgUser').value||'').trim().toLowerCase(), p=$('lgPass').value||'';
  if(!/^[a-z0-9._-]{3,20}$/.test(u)){efzGateMsg('✏️ Tên đăng nhập dài 3–20 ký tự, viết liền không dấu (chữ, số, dấu . _ -). Ví dụ: <b>minhanh2015</b>');return}
  if(p.length<6){efzGateMsg('🔑 Mật khẩu cần ít nhất 6 ký tự.');return}
  efzGateMsg('⏳ Đang xử lý…');
  const fb=await efzCloudInit();if(!fb){efzGateMsg('😢 Không tải được — kiểm tra mạng rồi thử lại nhé!');return}
  const mail=u+'@'+EFZ_ACC_DOMAIN;
  try{
    if(isNew){const r=await fb.auth.createUserWithEmailAndPassword(mail,p);try{await r.user.updateProfile({displayName:u})}catch(e){}}
    else await fb.auth.signInWithEmailAndPassword(mail,p);
    sndOK();$('lgPass').value='';
  }catch(e){const c=e&&e.code||'';
    efzGateMsg('😢 '+(c==='auth/email-already-in-use'?'Tên đăng nhập này đã có người dùng. Chọn tên khác, hoặc bấm <b>Đăng nhập</b> nếu đó là tài khoản của em.'
      :/wrong-password|user-not-found|invalid-credential|invalid-login-credentials/.test(c)?(isNew?'Không tạo được tài khoản.':'Sai tên đăng nhập hoặc mật khẩu. Chưa có tài khoản thì bấm <b>Tạo tài khoản mới</b>.')
      :c==='auth/operation-not-allowed'?'Thầy chưa bật đăng nhập bằng mật khẩu. Em dùng nút Google nhé.'
      :c==='auth/too-many-requests'?'Thử sai nhiều lần quá — đợi vài phút rồi thử lại.'
      :c==='auth/network-request-failed'?'Mất mạng — kiểm tra kết nối rồi thử lại.'
      :'Không thành công ('+c+').'));
  }
}
async function efzLogout(){
  if(!efzFB)return;
  clearTimeout(_efzSoonT);
  try{await efzCloudPush()}catch(e){}
  await efzFB.auth.signOut();
  try{localStorage.removeItem('efz_cloud')}catch(e){}
  try{$('nameModal').classList.remove('show')}catch(e){}
  toast('👋 Đã đăng xuất');
}

/* ==========================================================
   🔐 BẮT BUỘC ĐĂNG NHẬP + GẮN HỒ SƠ VỚI TÀI KHOẢN + 🏆 BẢNG VÀNG CHUNG
   - Vào trang là phải đăng nhập (Google hoặc tên đăng nhập + mật khẩu).
   - Mỗi tài khoản gắn với 1 hồ sơ (tên + avatar + XP). Đổi máy vẫn đúng hồ sơ.
   - Điểm được chép sang Firestore: leaderboard/{uid} → bảng vàng của TẤT CẢ học sinh.
   - Máy đã đăng nhập rồi thì lần sau mất mạng vẫn vào học được.
   ========================================================== */
const LS_UID='efz_uid', LS_UIDMAP='efz_uidmap', EFZ_ACC_DOMAIN='hs.english-fun-zone.app';
let _efzLb=null,_efzLbTs=0,_efzLbBusy=false,_efzLbErr=false;
function efzUidMap(){try{return JSON.parse(localStorage.getItem(LS_UIDMAP))||{}}catch(e){return{}}}
function efzUidMapSet(uid,name){try{const m=efzUidMap();m[uid]=name;localStorage.setItem(LS_UIDMAP,JSON.stringify(m))}catch(e){}}
/* tên hồ sơ này trên máy đang thuộc tài khoản KHÁC? (máy dùng chung) */
function efzNameOwner(n){const m=efzUidMap(),me=efzUser?efzUser.uid:'';for(const k in m)if(m[k]===n&&k!==me)return k;return null}
function efzAccName(){
  if(!efzUser)return '';
  const em=efzUser.email||'';
  if(em.endsWith('@'+EFZ_ACC_DOMAIN))return em.split('@')[0];
  return efzUser.displayName||em||'Đã đăng nhập';
}
function efzLoginGate(show){const g=$('loginGate');if(g)g.classList.toggle('show',!!show)}
function efzGateMsg(t){const m=$('lgMsg');if(m)m.innerHTML=t||''}
function efzOnAuth(u){
  if(u){try{localStorage.setItem(LS_UID,u.uid)}catch(e){}efzLoginGate(false);efzGateMsg('');efzBind(u)}
  else{try{localStorage.removeItem(LS_UID)}catch(e){}_efzLb=null;_efzLbTs=0;if(!efzIsAdminView())efzLoginGate(true)}
}
/* vừa đăng nhập xong: chọn đúng hồ sơ cho tài khoản này */
async function efzBind(u){
  let c=null,online=true;
  try{const sn=await efzFB.db.collection('saves').doc(u.uid).get();c=sn.exists?sn.data():null}catch(e){online=false}
  if(!efzUser||efzUser.uid!==u.uid)return;
  try{
    const map=efzUidMap(),ps=loadPlayers();
    const cp=(c&&c.player&&c.player.name)?c.player:null;
    let pl=null;
    if(cp){const loc=ps[cp.name];pl=(loc&&!efzNameOwner(cp.name)&&(loc.xp||0)>(cp.xp||0))?loc:cp}   /* XP chỉ tăng → giữ bên nhiều hơn */
    else if(map[u.uid]&&ps[map[u.uid]])pl=ps[map[u.uid]];
    else if(P&&P.name&&!efzNameOwner(P.name))pl=P;          /* học sinh cũ: nhận luôn hồ sơ đang có trên máy */
    if(pl){
      pl=Object.assign(newPlayer(pl.name,pl.ava||AVAS[0]),pl);if(!Array.isArray(pl.badges))pl.badges=[];
      ps[pl.name]=pl;savePlayers(ps);P=pl;pickedAva=P.ava;
      localStorage.setItem(LS_CUR,P.name);efzUidMapSet(u.uid,P.name);
      $('nameModal').classList.remove('show');renderPlayer();
    }else if(online){
      /* tài khoản mới, chưa có hồ sơ → hỏi tên + avatar */
      P=null;try{localStorage.removeItem(LS_CUR)}catch(e){}
      $('pName').textContent='Bạn mới';$('pAva').textContent='🐣';$('pXP').textContent='0';$('pLvl').textContent='Lv.1';
      showNameModal();
    }
    if(c&&c.td){const local=td2SaveMeta();if(!(local&&local.ts>=(c.td.ts||0)))localStorage.setItem(TD_SAVE_KEY,JSON.stringify(c.td))}
  }catch(e){}
  efzRenderCloud();
  try{if(curSec==='board'){renderBoard();renderBadges()}}catch(e){}
  if(online&&P)efzCloudPush();
}
/* chép điểm sang bảng vàng chung */
async function efzLbPush(pl){
  if(!efzFB||!efzUser||!pl||!pl.name)return;
  try{await efzFB.db.collection('leaderboard').doc(efzUser.uid).set({
    name:String(pl.name).slice(0,20), ava:String(pl.ava||'🐣').slice(0,8), gname:String(efzAccName()).slice(0,40),
    xp:Math.max(0,Math.floor(pl.xp||0)), correct:Math.max(0,Math.floor(pl.correct||0)),
    badges:(pl.badges||[]).length, ts:Date.now()});
  }catch(e){}
}
async function efzLbFetch(force){
  if(!efzFB||!efzUser||_efzLbBusy)return;
  if(!force&&_efzLb&&Date.now()-_efzLbTs<20000)return;
  _efzLbBusy=true;
  try{
    if(P)await efzLbPush(P);
    const sn=await efzFB.db.collection('leaderboard').orderBy('xp','desc').limit(50).get();
    const rows=[];sn.forEach(d=>{const x=d.data()||{};rows.push({uid:d.id,name:String(x.name||'?'),ava:String(x.ava||'🐣'),gname:String(x.gname||''),xp:+x.xp||0,correct:+x.correct||0,badges:+x.badges||0})});
    _efzLb=rows;_efzLbTs=Date.now();_efzLbErr=false;
  }catch(e){_efzLbErr=true}
  _efzLbBusy=false;
  try{if(curSec==='board')efzLbDraw()}catch(e){}
}
function efzLbDraw(){
  const box=$('lbList');if(!box)return;
  const medals=['🥇','🥈','🥉'],me=efzUser?efzUser.uid:'';
  let rows,global=!!_efzLb,extra=null;
  if(global){
    rows=_efzLb.map(r=>Object.assign({},r));
    const mine=P?{uid:me,name:P.name,ava:P.ava,gname:efzAccName(),xp:P.xp||0,correct:P.correct||0,badges:(P.badges||[]).length}:null;
    if(mine){
      const i=rows.findIndex(r=>r.uid===me);
      if(i>=0)rows[i]=mine;
      else if(rows.length<50||mine.xp>rows[rows.length-1].xp)rows.push(mine);
      else extra=mine;
      rows.sort((a,b)=>b.xp-a.xp);
    }
  }else{
    rows=Object.values(loadPlayers()).sort((a,b)=>b.xp-a.xp).slice(0,10).map(p=>({uid:(P&&p.name===P.name)?me||'me':'',name:p.name,ava:p.ava,gname:'',xp:p.xp||0,correct:p.correct||0,badges:(p.badges||[]).length}));
  }
  const row=(r,rank)=>`
    <div class="lb-row ${r.uid&&(r.uid===me||r.uid==='me')?'me':''}">
      <span class="lb-rank">${rank}</span>
      <span class="lb-ava">${esc(String(r.ava))}</span>
      <span class="lb-name">${esc(String(r.name))}<small>${r.gname&&r.gname!==r.name?'👤 '+esc(r.gname)+' · ':''}Lv.${lvlOf(r.xp)} · ${r.correct} câu đúng · ${r.badges} huy hiệu</small></span>
      <span class="lb-xp">⭐ ${r.xp}</span>
    </div>`;
  const note=global?'':(_efzLbErr
    ?'<p class="sub">⚠️ Chưa tải được bảng vàng chung (kiểm tra mạng) — đang hiện điểm lưu trên máy này.</p>'
    :(efzUser?'<p class="sub">⏳ Đang tải bảng vàng chung…</p>':''));
  box.innerHTML=note+(rows.length?rows.map((r,i)=>row(r,medals[i]||(i+1))).join(''):'<p class="sub">Chưa có ai. Hãy là người đầu tiên!</p>')
    +(extra?'<p class="sub" style="margin:8px 0 4px">… vị trí của em (ngoài top 50):</p>'+row(extra,'⋯'):'');
  const sub=$('lbSub');if(sub)sub.textContent=global?'Top 50 bạn học chăm nhất — xếp hạng chung của tất cả học sinh. Cố lên top 1 nha!':'Top bạn học chăm nhất. Cố lên top 1 nha!';
}
/* đẩy tiến độ lên đám mây: hồ sơ người chơi (XP, huy hiệu…) + ván Thủ thành đang lưu (nếu có) */
async function efzCloudPush(manual){
  if(!efzCloudOn()||!efzFB||!efzUser||efzCloudBusy)return;
  const d=td2SaveMeta();
  const pl=(typeof P==='object'&&P&&P.name)?P:null;
  if(!d&&!pl)return;
  efzCloudBusy=true;
  try{
    const doc={player:pl, who:efzUser.displayName||'', ts:Date.now()};
    if(d)doc.td=d;
    await efzFB.db.collection('saves').doc(efzUser.uid).set(doc,{merge:true});
    if(pl)efzLbPush(pl);
    if(manual){sndOK();toast('☁️ Đã lưu tiến độ lên tài khoản Google!')}
  }catch(e){if(manual)toast('😢 Không lưu lên đám mây được: '+(e&&e.code||''))}
  efzCloudBusy=false;
}
/* tự đẩy sau mỗi lần lưu, gom lại 8 giây/lần để không gửi dồn dập */
let _efzSoonT=null;
function efzCloudSoon(){
  if(!efzUser||!efzFB)return;
  clearTimeout(_efzSoonT);_efzSoonT=setTimeout(()=>{efzCloudPush()},8000);
}
/* lấy tiến độ từ đám mây.
   - Hồ sơ người chơi: bên nào NHIỀU XP hơn thì giữ (XP chỉ tăng) → không bao giờ làm mất tiến độ.
   - Ván Thủ thành: auto thì chỉ lấy khi bản mây MỚI HƠN bản máy. */
async function efzCloudPull(auto){
  if(!efzCloudOn()||!efzFB||!efzUser)return;
  try{
    const snap=await efzFB.db.collection('saves').doc(efzUser.uid).get();
    const c=snap.exists?snap.data():null;
    if(!c||(!c.td&&!c.player)){if(!auto)toast('Trên đám mây chưa có bản lưu nào.');else efzCloudPush();return}
    let gotP=false,gotTD=false;
    if(c.player&&c.player.name){
      try{
        const ps=loadPlayers(),loc=ps[c.player.name];
        if(!loc||(c.player.xp||0)>(loc.xp||0)){
          ps[c.player.name]=c.player;savePlayers(ps);gotP=true;
          /* đang chơi đúng hồ sơ này, hoặc máy mới tinh (0 XP) → dùng luôn hồ sơ trên mây */
          if(P&&(P.name===c.player.name||!(P.xp>0))){P=c.player;localStorage.setItem(LS_CUR,P.name);renderPlayer();
            try{if(curSec==='board'){renderBoard();renderBadges()}}catch(e){}}
        }
      }catch(e){}
    }
    if(c.td){
      const local=td2SaveMeta();
      if(!(auto&&local&&local.ts>=(c.td.ts||0))){localStorage.setItem(TD_SAVE_KEY,JSON.stringify(c.td));gotTD=true}
    }
    if(gotP||gotTD){sndOK();toast('⬇️ Đã lấy tiến độ từ đám mây'+(gotP?': ⭐ '+(c.player.xp||0)+' XP':'')+(gotTD?' · Thủ thành đợt '+c.td.round:''))}
    else if(!auto)toast('✅ Tiến độ trên máy này đã là mới nhất.');
    if(!auto&&gotTD)td2Enter(c.td.mode==='survival'?'survival':'normal'); else efzRenderCloud();
    if(auto&&!gotP)efzCloudPush();      /* máy này mới hơn → cập nhật lại bản trên mây */
  }catch(e){if(!auto)toast('😢 Không tải được: '+(e&&e.code||''))}
}
/* Mở trang là kiểm tra đăng nhập. Máy đã từng đăng nhập thì cho vào ngay (kể cả lúc mất mạng), sau đó Firebase xác nhận lại.
   Khung xem trước trong trang admin của thầy thì không chặn. */
if(typeof window!=='undefined')window.addEventListener('load',()=>{
  if(!efzCloudOn())return;
  let was=false,uid='';try{was=localStorage.getItem('efz_cloud')==='1';uid=localStorage.getItem(LS_UID)||''}catch(e){}
  if(efzIsAdminView()){if(was)setTimeout(()=>{efzCloudInit()},1500);return}
  if(!uid)efzLoginGate(true);
  efzCloudInit().then(fb=>{if(!fb&&!uid)efzGateMsg('😢 Cần có mạng để đăng nhập lần đầu. Kiểm tra kết nối rồi tải lại trang nhé!')});
});
/* ==========================================================
   💾 LƯU TIẾN ĐỘ THỦ THÀNH
   - Tự lưu sau mỗi đợt (không lưu giữa lúc đang đánh cho khỏi lỗi)
   - Vào game có "Chơi tiếp" / "Chơi mới"
   - Mã sao lưu để chuyển sang máy khác
   - Nếu đã cấu hình Firebase thì đồng bộ lên tài khoản Google
   ========================================================== */
const TD_SAVE_KEY='efz_td_save';
function td2SaveMeta(){
  try{const raw=localStorage.getItem(TD_SAVE_KEY);if(!raw)return null;
    const d=JSON.parse(raw);return (d&&d.round)?d:null}catch(e){return null}
}
/* ================= THEORY ================= */
function renderTheory(){
  $('theoryGrade').textContent='Lớp '+grade;
  $('theoryList').innerHTML=DATA[grade].theory.map((t,i)=>`
    <div class="acc" id="acc${i}">
      <button class="acc-head" onclick="toggleAcc(${i})"><span class="em">${t.em}</span>${t.t}<span class="arrow">▼</span></button>
      <div class="acc-body"><div class="acc-inner">${t.h}</div></div>
    </div>`).join('');
}
function toggleAcc(i){sndFlip();$('acc'+i).classList.toggle('open')}

/* ================= QUIZ ================= */
let QZ=null;
function quizHome(){
  const t=DATA[grade].topics;
  $('quizCard').innerHTML=`
    <h2>⚡ Quiz vui — Lớp ${grade}</h2>
    <p class="sub"><b>✨ Mỗi lượt là một ĐỀ MỚI!</b> Chọn chủ đề bám unit SGK, hoặc chơi đề tổng hợp. Đúng +10 XP, có thưởng chuỗi 🔥</p>
    <div class="tchips">
      <button class="tchip gold" onclick="startQuiz('all')">🎲 Đề tổng hợp (ngẫu nhiên tất cả)</button>
    </div>
    <p class="sub" style="margin:4px 0 6px">…hoặc luyện theo chủ đề / unit:</p>
    <div class="tchips">
      ${t.map(x=>`<button class="tchip" onclick="startQuiz('${x.id}')">${x.em} ${esc(x.name)}</button>`).join('')}
    </div>`;
}
function startQuiz(topicSel){
  QZ={qs:buildQuizSet(grade,topicSel||'all'),i:0,right:0,topic:topicSel||'all'};streak=0;
  renderQuizQ();
}
function renderQuizQ(){
  const q=QZ.qs[QZ.i];
  const order=shuffle(q.o.map((t,idx)=>({t,idx})));
  $('quizCard').innerHTML=`
    <div class="qbar">
      <span class="qcount">Câu ${QZ.i+1}/${QZ.qs.length}</span>
      <div class="qprog"><i style="width:${QZ.i/QZ.qs.length*100}%"></i></div>
      <span class="streak">🔥 ${streak}</span>
    </div>
    ${q.pic||''}
    <div class="qq">${esc(q.q)}</div>
    <div class="opts">${order.map((o,k)=>`<button class="opt${q.pic?' pic-opt':''}" id="op${k}" onclick="answerQuiz(${o.idx},${k},event)"><span class="ab">${'ABCDEFGH'[k]||(k+1)}</span>${esc(o.t)}</button>`).join('')}</div>
    <div class="feedback" id="qfb"></div>
    <div class="center mt hidden" id="qnextRow"><button class="btn teal" onclick="nextQuizQ()">Câu tiếp theo ➜</button></div>`;
  window._qOrder=order;
}
function answerQuiz(realIdx,btnK,ev){
  const q=QZ.qs[QZ.i];
  document.querySelectorAll('.opt').forEach(b=>b.disabled=true);
  const correct=realIdx===q.a;
  window._qOrder.forEach((o,k)=>{
    const b=$('op'+k);
    if(o.idx===q.a)b.classList.add('right');
    else if(k===btnK)b.classList.add('wrong');
    else b.classList.add('dim');
  });
  const fb=$('qfb');
  if(correct){
    QZ.right++;P.correct++;hitStreak();
    const bonus=streakBonus();
    gainXP(10+bonus,ev);sndOK();
    fb.className='feedback ok';fb.innerHTML='🎉 <b>Chính xác!</b> '+esc(q.e||'');
  }else{
    missStreak();sndNo();
    fb.className='feedback no';fb.innerHTML='😅 <b>Chưa đúng!</b> Đáp án: <b>'+esc(q.o[q.a])+'</b>. '+esc(q.e||'');
  }
  persist();
  $('qnextRow').classList.remove('hidden');
}
function nextQuizQ(){
  QZ.i++;sndClick();
  if(QZ.i<QZ.qs.length)renderQuizQ();
  else{
    P.quizDone++;
    const pct=QZ.right/QZ.qs.length;
    if(pct===1){P.perfect++;confetti(120);sndWin()}
    else if(pct>=.6){confetti(50);sndWin()}
    persist();checkBadges();
    const face=pct===1?'🏆':pct>=.75?'🤩':pct>=.5?'😊':'💪';
    const msg=pct===1?'PERFECT! Siêu đỉnh!':pct>=.75?'Tuyệt vời!':pct>=.5?'Khá lắm, cố thêm chút nữa!':'Đừng nản, ôn lý thuyết rồi thử lại nha!';
    $('quizCard').innerHTML=`
      <div class="result">
        <div class="face">${face}</div>
        <h3>${msg}</h3>
        <div class="scoreline">Bạn đúng <b>${QZ.right}/${QZ.qs.length}</b> câu</div>
        <div class="xpgain">⭐ +${QZ.right*10} XP</div>
        <div class="row" style="justify-content:center">
          <button class="btn" onclick="startQuiz('${QZ.topic}')">🎲 Đề mới (câu khác)!</button>
          <button class="btn sun" onclick="quizHome()">📚 Đổi chủ đề</button>
          <button class="btn ghost" onclick="go('theory')">📖 Ôn lý thuyết</button>
        </div>
      </div>`;
  }
}

/* ================= READING ================= */
let RD=null;
function readingHome(){
  $('readingCard').innerHTML=`
    <h2>📚 Bài đọc — Lớp ${grade}</h2>
    <p class="sub">Chọn một bài. Đọc kỹ rồi trả lời câu hỏi, mỗi câu đúng +15 XP. Có thể bật bản dịch tiếng Việt để kiểm tra.</p>
    <div class="rgrid">
      <button class="pick-card gen" onclick="openReading('gen')">
        <span class="em">✨</span>
        <h4>Bài đọc ngẫu nhiên</h4>
        <p>Mỗi lần mở là một bài MỚI — tên, số liệu, đáp án đều đổi!</p>
        <div class="tagrow"><span class="tagg">🎲 Random</span><span class="tagg">Vô hạn đề</span></div>
      </button>
    ${DATA[grade].readings.map((r,i)=>`
      <button class="pick-card" onclick="openReading(${i})">
        <span class="em">${r.em}</span>
        <h4>${esc(r.title)}</h4>
        <p>${r.qs.length} câu hỏi đọc hiểu</p>
        <div class="tagrow">${r.tags.map(t=>`<span class="tagg">${esc(t)}</span>`).join('')}</div>
      </button>`).join('')}
    </div>`;
}
function openReading(i){
  RD={r:i==='gen'?genReadData(grade):DATA[grade].readings[i],i:0,right:0};sndClick();
  const r=RD.r;
  $('readingCard').innerHTML=`
    <button class="btn ghost sm" onclick="readingHome()">← Chọn bài khác</button>
    <div class="passage mt" id="passageBox">
      <h3>${r.em} ${esc(r.title)}</h3>
      ${r.text.split('\n').map(p=>'<p>'+esc(p)+'</p>').join('')}
      <div class="vn">📖 ${esc(r.vn)}</div>
    </div>
    <div class="row" style="margin-bottom:14px">
      <button class="btn sun sm" onclick="$('passageBox').classList.toggle('showvn');sndClick()">📖 Bật / tắt bản dịch</button>
      <button class="btn teal sm" onclick="speak(${JSON.stringify(r.text).replace(/"/g,'&quot;')},1)">🔊 Nghe đọc bài</button>
      <button class="btn ghost sm" onclick="stopSpeak()">⏹ Dừng</button>
    </div>
    <div id="rdQuiz"></div>`;
  renderReadingQ();
}
function renderReadingQ(){
  const q=RD.r.qs[RD.i];
  $('rdQuiz').innerHTML=`
    <div class="qbar"><span class="qcount">Câu ${RD.i+1}/${RD.r.qs.length}</span>
    <div class="qprog"><i style="width:${RD.i/RD.r.qs.length*100}%"></i></div></div>
    <div class="qq">${esc(q.q)}</div>
    <div class="opts">${q.o.map((t,k)=>`<button class="opt" id="rop${k}" onclick="answerReading(${k},event)"><span class="ab">${'ABCDEFGH'[k]||(k+1)}</span>${esc(t)}</button>`).join('')}</div>
    <div class="feedback" id="rfb"></div>
    <div class="center mt hidden" id="rnextRow"><button class="btn teal" onclick="nextReadingQ()">Tiếp ➜</button></div>`;
  $('rdQuiz').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function answerReading(k,ev){
  const q=RD.r.qs[RD.i];
  document.querySelectorAll('#rdQuiz .opt').forEach(b=>b.disabled=true);
  q.o.forEach((_,j)=>{const b=$('rop'+j);
    if(j===q.a)b.classList.add('right');else if(j===k)b.classList.add('wrong');else b.classList.add('dim')});
  const fb=$('rfb');
  if(k===q.a){RD.right++;P.correct++;hitStreak();gainXP(15+streakBonus(),ev);sndOK();
    fb.className='feedback ok';fb.innerHTML='🎉 <b>Đúng rồi!</b> Tìm thấy thông tin trong bài chứ?';}
  else{missStreak();sndNo();fb.className='feedback no';
    fb.innerHTML='😅 <b>Chưa đúng.</b> Đáp án: <b>'+esc(q.o[q.a])+'</b> — đọc lại đoạn văn xem sao nha!';}
  persist();$('rnextRow').classList.remove('hidden');
}
function nextReadingQ(){
  RD.i++;sndClick();
  if(RD.i<RD.r.qs.length)renderReadingQ();
  else{
    P.readDone++;persist();checkBadges();
    const pct=RD.right/RD.r.qs.length;
    if(pct>=.75){confetti(60);sndWin()}
    $('rdQuiz').innerHTML=`<div class="result">
      <div class="face">${pct===1?'🏆':pct>=.5?'🤩':'💪'}</div>
      <h3>${pct===1?'Đọc hiểu tuyệt đỉnh!':pct>=.5?'Làm tốt lắm!':'Đọc lại bài rồi thử lần nữa nhé!'}</h3>
      <div class="scoreline">Đúng <b>${RD.right}/${RD.r.qs.length}</b> · ⭐ +${RD.right*15} XP</div>
      <div class="row" style="justify-content:center"><button class="btn" onclick="readingHome()">📚 Bài đọc khác</button></div>
    </div>`;
  }
}

/* ================= LISTENING ================= */
let LS=null,curRate=1;
function listeningHome(){
  $('listeningCard').innerHTML=`
    <h2>🎧 Bài nghe — Lớp ${grade}</h2>
    <p class="sub">Mở bài là audio tự phát, nghe lại bao nhiêu lần cũng được. Nghe xong tự trả lời trước, rồi mới hiện các lựa chọn. Mỗi câu đúng +15 XP. Dùng Chrome/Edge để nghe hay nhất nhé!</p>
    <div class="rgrid">
      <button class="pick-card gen" onclick="openListening('gen')">
        <span class="em">✨</span>
        <h4>Đề nghe ngẫu nhiên</h4>
        <p>Mỗi lần mở là một bài nghe MỚI — nội dung và đáp án đổi liên tục!</p>
        <div class="tagrow"><span class="tagg">🎲 Random</span><span class="tagg">Vô hạn đề</span></div>
      </button>
    ${DATA[grade].listenings.map((l,i)=>`
      <button class="pick-card" onclick="openListening(${i})">
        <span class="em">${l.em}</span>
        <h4>${esc(l.title)}</h4>
        <p>${esc(l.hint)}</p>
        <div class="tagrow"><span class="tagg">🎧 ${l.qs.length} câu hỏi</span></div>
      </button>`).join('')}
    </div>`;
}
function openListening(i){
  LS={l:i==='gen'?genListenData(grade):DATA[grade].listenings[i],i:0,right:0};sndClick();
  const l=LS.l;
  $('listeningCard').innerHTML=`
    <button class="btn ghost sm" onclick="stopSpeak();listeningHome()">← Chọn bài khác</button>
    <div class="audio-box mt" id="audioBox">
      <span class="speaker">🔊</span>
      <h3 style="margin:6px 0">${l.em} ${esc(l.title)}</h3>
      <p style="color:var(--muted);font-size:13px">${esc(l.hint)} — nghe xong trả lời bên dưới nha!</p>
      <div class="audio-controls">
        <button class="btn" id="playBtn" onclick="playListening()">▶️ Nghe</button>
        <button class="btn ghost" onclick="stopListening()">⏹ Dừng</button>
        <button class="btn sun" onclick="toggleTrans()">📜 Lời thoại</button>
      </div>
      <div class="rate-row">Tốc độ đọc:
        <select id="rateSel" onchange="curRate=+this.value;if(LS_AUDIO)LS_AUDIO.playbackRate=curRate">
          <option value="0.75">🐢 Chậm</option>
          <option value="1" selected>🙂 Vừa</option>
          <option value="1.2">🐇 Nhanh</option>
        </select>
      </div>
      <div class="transcript" id="transBox">${l.trans.map(t=>`<div class="line">${esc(t).replace(/^([^:]+):/,'<b>$1:</b>')}</div>`).join('')}</div>
    </div>
    <div id="lsQuiz"></div>`;
  LS.idx=i;
  renderListeningQ();
  playListening(true);   /* tự phát ngay khi câu hỏi hiện ra */
}
/* 🎧 Âm thanh bài nghe: ưu tiên file mp3 thật, không có thì mới dùng giọng đọc của trình duyệt.
   Cách thêm mp3: (1) ghi thẳng vào bài nghe  audio:'audio/listening/ten-file.mp3'
                  (2) hoặc chỉ cần đặt file đúng tên  audio/listening/lop<LỚP>-<SỐ THỨ TỰ BÀI>.mp3  (vd: lop5-1.mp3) */
let LS_AUDIO=null;
function lsAudioSrc(){
  const l=LS&&LS.l;if(!l)return '';
  if(l.audio)return l.audio;
  return (typeof LS.idx==='number')?('audio/listening/lop'+grade+'-'+(LS.idx+1)+'.mp3'):'';
}
function lsTTS(){const box=$('audioBox');speak(LS.l.script,curRate,()=>{if(box)box.classList.remove('playing')})}
function playListening(auto){
  const box=$('audioBox');if(!box||!LS)return;
  stopListening();box.classList.add('playing');
  if(!auto)$('playBtn').textContent='🔁 Nghe lại';
  const src=LS.noMp3?'':lsAudioSrc();
  if(!src){lsTTS();return}
  const a=new Audio(src);LS_AUDIO=a;a.playbackRate=curRate;
  const fallback=()=>{if(LS_AUDIO!==a)return;LS_AUDIO=null;LS.noMp3=true;lsTTS()};   /* không có mp3 → giọng trình duyệt */
  a.onended=()=>{box.classList.remove('playing')};
  a.onerror=fallback;
  const p=a.play();if(p&&p.catch)p.catch(e=>{if(e&&e.name==='NotAllowedError'){box.classList.remove('playing')}else fallback()});
}
function stopListening(){
  if(LS_AUDIO){try{LS_AUDIO.onerror=null;LS_AUDIO.pause()}catch(e){}LS_AUDIO=null}
  stopSpeak();const b=$('audioBox');if(b)b.classList.remove('playing');
}
function toggleTrans(){sndClick();$('transBox').classList.toggle('show')}
/* Câu hỏi nghe: ẨN các lựa chọn cho tới khi học sinh tự trả lời → rồi mới hiện lựa chọn, đáp án đúng và giải thích */
function renderListeningQ(){
  const q=LS.l.qs[LS.i];
  $('lsQuiz').innerHTML=`
    <div class="qbar"><span class="qcount">Câu ${LS.i+1}/${LS.l.qs.length}</span>
    <div class="qprog"><i style="width:${LS.i/LS.l.qs.length*100}%"></i></div></div>
    <div class="qq">${esc(q.q)}</div>
    <div id="lsAsk">
      <input class="winput" id="lsMine" autocomplete="off" placeholder="Nghe rồi gõ câu trả lời của em (tiếng Anh)…" onkeydown="if(event.key==='Enter')revealListening()">
      <div class="row mt" style="justify-content:center;gap:8px">
        <button class="btn" onclick="revealListening()">✅ Trả lời</button>
        <button class="btn ghost" onclick="playListening()">🔁 Nghe lại</button>
      </div>
      <p class="sub" style="text-align:center;margin-top:8px">Trả lời xong mới hiện các lựa chọn A, B, C… nhé!</p>
    </div>
    <div class="opts hidden" id="lsOpts">${q.o.map((t,k)=>`<button class="opt" id="lop${k}" onclick="answerListening(${k},event)"><span class="ab">${'ABCDEFGH'[k]||(k+1)}</span>${esc(t)}</button>`).join('')}</div>
    <div class="feedback" id="lfb"></div>
    <div class="center mt hidden" id="lnextRow"><button class="btn teal" onclick="nextListeningQ()">Tiếp ➜</button></div>`;
  const tb=$('transBox');if(tb)tb.classList.remove('show');
}
function revealListening(){
  const inp=$('lsMine');if(!inp)return;
  const mine=inp.value.trim();
  if(!mine){inp.classList.add('no');setTimeout(()=>inp.classList.remove('no'),450);toast('✍️ Gõ câu trả lời của em trước đã nhé (chưa chắc cũng cứ thử)!');inp.focus();return}
  sndClick();LS.mine=mine;
  $('lsAsk').innerHTML='<p class="sub" style="text-align:center">Em trả lời: <b>'+esc(mine)+'</b> — giờ chọn đáp án khớp nhất 👇</p>';
  $('lsOpts').classList.remove('hidden');
}
function lsEvidence(q){
  /* câu trong lời thoại chứa đáp án → dùng làm giải thích */
  const key=norm(String(q.o[q.a]));if(!key)return '';
  const line=(LS.l.trans||[]).find(t=>norm(t).includes(key));
  return line?'📜 Trong bài: <i>“'+esc(line)+'”</i>':'';
}
function answerListening(k,ev){
  const q=LS.l.qs[LS.i];
  document.querySelectorAll('#lsQuiz .opt').forEach(b=>b.disabled=true);
  q.o.forEach((_,j)=>{const b=$('lop'+j);
    if(j===q.a)b.classList.add('right');else if(j===k)b.classList.add('wrong');else b.classList.add('dim')});
  const fb=$('lfb');
  const why=[q.e?esc(q.e):'',lsEvidence(q)].filter(Boolean).join('<br>');
  if(k===q.a){LS.right++;P.correct++;hitStreak();gainXP(15+streakBonus(),ev);sndOK();
    fb.className='feedback ok';fb.innerHTML='🎉 <b>Nghe chuẩn luôn!</b> Đáp án: <b>'+esc(q.o[q.a])+'</b>'+(why?'<br>'+why:'');}
  else{missStreak();sndNo();fb.className='feedback no';
    fb.innerHTML='😅 Đáp án đúng: <b>'+esc(q.o[q.a])+'</b>'+(why?'<br>'+why:'')+'<br>Bấm 🔁 nghe lại hoặc xem 📜 lời thoại nhé!';}
  persist();$('lnextRow').classList.remove('hidden');
}
function nextListeningQ(){
  LS.i++;sndClick();
  if(LS.i<LS.l.qs.length)renderListeningQ();
  else{
    P.listenDone++;persist();checkBadges();stopListening();
    const pct=LS.right/LS.l.qs.length;
    if(pct>=.66){confetti(60);sndWin()}
    $('lsQuiz').innerHTML=`<div class="result">
      <div class="face">${pct===1?'🏆':pct>=.5?'🤩':'💪'}</div>
      <h3>${pct===1?'Đôi tai vàng!':pct>=.5?'Nghe tốt lắm!':'Nghe lại lần nữa là được ngay!'}</h3>
      <div class="scoreline">Đúng <b>${LS.right}/${LS.l.qs.length}</b> · ⭐ +${LS.right*15} XP</div>
      <div class="row" style="justify-content:center"><button class="btn" onclick="listeningHome()">🎧 Bài nghe khác</button></div>
    </div>`;
  }
}
/* ================= WRITING ================= */
let WR=null;
function writingHome(){
  $('writingCard').innerHTML=`
    <h2>✍️ Bài viết — Lớp ${grade}</h2>
    <p class="sub">3 dạng bài: xếp từ thành câu, chia động từ, và tự viết câu. Mỗi câu đúng +20 XP! <b>✨ Dạng chia động từ trộn thêm câu ngẫu nhiên mới mỗi lượt.</b></p>
    <div class="rgrid">
      <button class="pick-card" onclick="startWriting('order')"><span class="em">🧩</span><h4>Xếp từ thành câu</h4><p>Chạm vào từ để ghép thành câu đúng</p><div class="tagrow"><span class="tagg">Dễ thở</span></div></button>
      <button class="pick-card" onclick="startWriting('gap')"><span class="em">🔤</span><h4>Chia động từ / điền từ</h4><p>Gõ dạng đúng của từ trong ngoặc</p><div class="tagrow"><span class="tagg">Vừa sức</span></div></button>
      <button class="pick-card" onclick="startWriting('write')"><span class="em">🖊️</span><h4>Tự viết câu</h4><p>Viết câu của riêng em theo gợi ý</p><div class="tagrow"><span class="tagg">Thử thách</span></div></button>
    </div>`;
}
function startWriting(type){
  let items=(DATA[grade].writing||[]).filter(w=>w.type===type);
  if(!items.length&&type!=='gap'){toast('🛠️ Lớp '+grade+' chưa có dạng bài này — thử dạng khác nhé!');return}
  if(type==='gap')items=shuffle(items.concat([genGap(grade),genGap(grade),genGap(grade)])).slice(0,6);
  else items=shuffle(items).slice(0,6);
  WR={items,i:0,right:0,type};sndClick();
  renderWritingQ();
}
function renderWritingQ(){
  const w=WR.items[WR.i];
  let body='';
  if(w.type==='order'){
    WR.placed=[];WR.pool=shuffle(w.words.map((t,i)=>({t,i})));
    body=`<div class="wprompt">🧩 Xếp các từ thành câu đúng:</div>
      <div class="wsub">💡 Nghĩa: ${esc(w.vn)}</div>
      <div class="chips answer" id="ansChips"></div>
      <div class="chips" id="poolChips"></div>
      <div class="row mt"><button class="btn" onclick="checkOrder(event)">✅ Kiểm tra</button>
      <button class="btn ghost" onclick="resetOrder()">🔄 Xếp lại</button></div>`;
  }else if(w.type==='gap'){
    body=`<div class="wprompt">🔤 Điền dạng đúng của từ trong ngoặc:</div>
      <div class="wsub">💡 ${esc(w.hintvn)}</div>
      <div class="gapline">${esc(w.sent).replace('___','<input id="gapIn" autocomplete="off" onkeydown="if(event.key===\'Enter\')checkGap(event)">')}</div>
      <div class="row mt"><button class="btn" onclick="checkGap(event)">✅ Kiểm tra</button></div>`;
  }else{
    body=`<div class="wprompt">🖊️ ${esc(w.prompt)}</div>
      <div class="wsub">💡 ${esc(w.vn)}</div>
      <input class="winput" id="freeIn" autocomplete="off" placeholder="Viết câu tiếng Anh của em vào đây..." onkeydown="if(event.key==='Enter')checkFree(event)">
      <div class="row mt"><button class="btn" onclick="checkFree(event)">✅ Kiểm tra</button></div>`;
  }
  $('writingCard').innerHTML=`
    <button class="btn ghost sm" onclick="writingHome()">← Đổi dạng bài</button>
    <div class="qbar mt"><span class="qcount">Câu ${WR.i+1}/${WR.items.length}</span>
    <div class="qprog"><i style="width:${WR.i/WR.items.length*100}%"></i></div><span class="streak">🔥 ${streak}</span></div>
    ${body}
    <div class="feedback" id="wfb"></div>
    <div class="center mt hidden" id="wnextRow"><button class="btn teal" onclick="nextWritingQ()">Tiếp ➜</button></div>`;
  if(w.type==='order')drawChips();
  const inp=$('gapIn')||$('freeIn');if(inp)inp.focus();
}
function drawChips(){
  $('ansChips').innerHTML=WR.placed.map((c,k)=>`<button class="chip" onclick="unplace(${k})">${esc(c.t)}</button>`).join('');
  $('poolChips').innerHTML=WR.pool.map((c,k)=>`<button class="chip" onclick="place(${k})">${esc(c.t)}</button>`).join('');
}
function place(k){sndFlip();WR.placed.push(WR.pool.splice(k,1)[0]);drawChips()}
function unplace(k){sndFlip();WR.pool.push(WR.placed.splice(k,1)[0]);drawChips()}
function resetOrder(){sndClick();WR.pool=WR.pool.concat(WR.placed.splice(0));WR.pool=shuffle(WR.pool);drawChips();$('wfb').className='feedback'}
function wrCorrect(ev,extra){
  WR.right++;P.correct++;hitStreak();gainXP(20+streakBonus(),ev);sndOK();
  const fb=$('wfb');fb.className='feedback ok';fb.innerHTML='🎉 <b>Chuẩn không cần chỉnh!</b> '+(extra||'');
  persist();$('wnextRow').classList.remove('hidden');
}
function wrWrong(msg){
  missStreak();sndNo();const fb=$('wfb');fb.className='feedback no';fb.innerHTML=msg;persist();
}
function checkOrder(ev){
  const w=WR.items[WR.i];
  if(WR.placed.length<w.words.length){wrWrong('🤔 Em còn từ chưa dùng kìa!');return}
  const ans=WR.placed.map(c=>c.t).join(' ');
  if(norm(ans)===norm(w.words.join(' '))){
    document.querySelectorAll('#ansChips .chip').forEach(c=>{c.style.borderColor='var(--green)';c.style.background='#e9fbef'});
    wrCorrect(ev,'Câu đúng: <b>'+esc(w.words.join(' ').replace(/ ([.,!?])/g,'$1'))+'</b>');
  }else wrWrong('😅 Chưa đúng thứ tự. Đọc lại nghĩa tiếng Việt rồi thử xếp lại nha!');
}
function checkGap(ev){
  const w=WR.items[WR.i],inp=$('gapIn'),v=norm(inp.value);
  if(!v){wrWrong('✏️ Em chưa điền gì nè!');return}
  if(v===norm(w.a)){inp.classList.remove('no');inp.classList.add('ok');inp.disabled=true;
    wrCorrect(ev,'Đáp án: <b>'+esc(w.a)+'</b>');}
  else{inp.classList.add('no');setTimeout(()=>inp.classList.remove('no'),500);
    wrWrong('😅 Chưa đúng. Gợi ý: '+esc(w.hintvn)+'. Thử lại nào!');}
}
function checkFree(ev){
  const w=WR.items[WR.i],inp=$('freeIn'),v=norm(inp.value);
  if(!v||v.split(' ').length<3){wrWrong('✏️ Viết một câu đầy đủ (ít nhất 3 từ) nha!');return}
  const pass=w.check.some(c=>v.includes(norm(c)));
  if(pass){inp.classList.remove('no');inp.classList.add('ok');inp.disabled=true;
    wrCorrect(ev,'Câu mẫu tham khảo: <b>'+esc(w.sample)+'</b>');}
  else{inp.classList.add('no');setTimeout(()=>inp.classList.remove('no'),500);
    wrWrong('🤔 Câu của em chưa dùng đúng cấu trúc yêu cầu. Câu mẫu: <b>'+esc(w.sample)+'</b> — viết lại theo mẫu nhé!');}
}
function nextWritingQ(){
  WR.i++;sndClick();
  if(WR.i<WR.items.length)renderWritingQ();
  else{
    P.writeDone++;persist();checkBadges();
    const pct=WR.right/WR.items.length;
    if(pct>=.6){confetti(60);sndWin()}
    $('writingCard').innerHTML=`<div class="result">
      <div class="face">${pct===1?'🏆':pct>=.5?'🤩':'💪'}</div>
      <h3>${pct===1?'Cây bút vàng!':pct>=.5?'Viết tốt lắm!':'Luyện thêm chút nữa nha!'}</h3>
      <div class="scoreline">Đúng <b>${WR.right}/${WR.items.length}</b> · ⭐ +${WR.right*20} XP</div>
      <div class="row" style="justify-content:center"><button class="btn" onclick="writingHome()">✍️ Dạng bài khác</button></div>
    </div>`;
  }
}

/* ================= GAMES ================= */
let GM=null;
function gamesHome(){
  if(GM){if(GM.timer){clearInterval(GM.timer);clearTimeout(GM.timer)}if(GM.raf)cancelAnimationFrame(GM.raf)}try{TD_RUN++}catch(e){}GM=null;
  $('gamesCard').innerHTML=`
    <h2>🎮 Góc Games & Từ vựng — Lớp ${grade}</h2>
    <p class="sub">Chọn <b>cấp độ + chủ đề</b>, rồi học thẻ từ và chơi game. Thắng được thưởng XP to 💰</p>
    ${selBar()}
    <div class="sect-title">📚 Học &amp; ôn từ vựng</div>
    <div class="game-grid">
      <button class="gcard gcP" style="background:linear-gradient(135deg,#0891b2,#db2777)" onclick="startSkills()"><span class="em">🎯</span><h3>Luyện 4 Kỹ Năng</h3><p>Nghe · Nói · Đọc · Viết — 10 cấp độ</p></button>
      <button class="gcard gcV" onclick="startFlash()"><span class="em">🃏</span><h3>Thẻ từ vựng</h3><p>Lật thẻ học từ + nghe đọc</p></button>
      <button class="gcard gcP" onclick="startPicQuiz()"><span class="em">🖼️</span><h3>Đố vui qua tranh</h3><p>Nhìn tranh chọn từ · +5 XP/câu</p></button>
    </div>
    <div class="sect-title">🕹️ Trò chơi từ vựng</div>
    <div class="game-grid">
      <button class="gcard gc1" onclick="startMemory()"><span class="em">🃏</span><h3>Lật thẻ ghi nhớ</h3><p>Tìm cặp Anh – Việt · +40 XP</p></button>
      <button class="gcard gc2" onclick="startHangman()"><span class="em">🎈</span><h3>Giải cứu bóng bay</h3><p>Đoán chữ cái · +30 XP</p></button>
      <button class="gcard gc3" onclick="startSpeed()"><span class="em">⏱️</span><h3>Đua tốc độ 45s</h3><p>Dịch nhanh hết cỡ · +5 XP/câu</p></button>
      <button class="gcard gc4" onclick="startScramble()"><span class="em">🔀</span><h3>Xếp chữ thần tốc</h3><p>Ghép chữ thành từ · +25 XP</p></button>
    </div>
    <div class="sect-title">⚔️ Đấu trường</div>
    <div class="game-grid">
      <button class="gcard gc5" onclick="startShoot()"><span class="em">🚀</span><h3>Bắn súng vũ trụ</h3><p>Bắn đáp án đúng đang bay</p></button>
      <button class="gcard gc6" onclick="startSurvival()"><span class="em">❤️</span><h3>Sinh tồn vượt ải</h3><p>Giữ máu, qua nhiều đợt</p></button>
      <button class="gcard gc7" onclick="td2Enter('normal')"><span class="em">🏰</span><h3>Thủ thành</h3><p>Đặt trụ thú, thủ thành thật sự</p></button>
      <button class="gcard gc5" onclick="startTowerSurvival()"><span class="em">🔥</span><h3>Thủ thành Sinh Tồn</h3><p>5 địa hình · vô hạn đợt · 🦸 gọi đệ tử</p></button>
      <button class="gcard gc8" onclick="startGold()"><span class="em">🏆</span><h3>Đua vàng</h3><p>Gom vàng thắng máy</p></button>
    </div>
    <div class="sect-title">♟️ Cờ vua học tiếng Anh</div>
    <div class="game-grid">
      <button class="gcard" style="background:linear-gradient(140deg,#7c5a3a,#b58863)" onclick="startChess()"><span class="em">♟️</span><h3>Cờ vua tiếng Anh</h3><p>Đấu với máy 5 cấp độ · đi lại nước bất kỳ &amp; xem gợi ý bằng câu hỏi</p></button>
    </div>`;
}
function gameTop(title,extra){
  return `<div class="row" style="justify-content:space-between"><button class="btn ghost sm" onclick="gamesHome()">← Games</button><h2 style="font-size:19px">${title}</h2><span>${extra||''}</span></div>`;
}

/* ================= TIEN DO & CAU HAY SAI ================= */
function efzProgKey(){return 'efz_prog_'+((P&&P.name)||'guest')}
function efzProgLoad(){try{return JSON.parse(localStorage.getItem(efzProgKey()))||{cats:{},wrongs:[]}}catch(e){return{cats:{},wrongs:[]}}}
function efzTrack(kind,cat,ok,q,correctIdx){
  const d=efzProgLoad(),ck=kind+' · '+cat;
  const c=d.cats[ck]||(d.cats[ck]={t:0,c:0});c.t++;if(ok)c.c++;
  const id=kind+'|'+cat+'|'+q.num+'|'+String(q.text||'').slice(0,40);
  d.wrongs=d.wrongs.filter(w=>w.id!==id);
  if(!ok)d.wrongs.unshift({id,kind,cat,num:q.num,text:String(q.text||'').replace(/<[^>]*>/g,' ').slice(0,160),ans:String(q.opts[correctIdx]||'').slice(0,80),ts:Date.now()});
  d.wrongs=d.wrongs.slice(0,60);
  try{localStorage.setItem(efzProgKey(),JSON.stringify(d))}catch(e){}
}
function efzClearWrongs(){const d=efzProgLoad();d.wrongs=[];try{localStorage.setItem(efzProgKey(),JSON.stringify(d))}catch(e){}renderProgress()}
function renderProgress(){
  const box=$('progBox');if(!box)return;
  const d=efzProgLoad(),cats=Object.entries(d.cats).filter(([,v])=>v.t>0).sort((a,b)=>(a[1].c/a[1].t)-(b[1].c/b[1].t));
  if(!cats.length){box.innerHTML='<p class="sub">Chưa có dữ liệu. Làm vài câu trong mục HSA / THPT để xem em mạnh yếu ở dạng bài nào nhé!</p>';return}
  let h='<p class="sub">Dạng bài em làm yếu nhất đứng đầu — ôn lại trước nhé 💪</p>';
  h+=cats.slice(0,8).map(([k,v])=>{const p=Math.round(v.c/v.t*100);const col=p>=80?'#2dd573':p>=50?'#ffb020':'#ff4d6d';
    return '<div style="margin:8px 0"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600"><span>'+esc(k)+'</span><span>'+p+'% ('+v.c+'/'+v.t+')</span></div><div style="height:8px;border-radius:8px;background:#e5e3f5;overflow:hidden"><div style="height:100%;width:'+p+'%;background:'+col+'"></div></div></div>'}).join('');
  if(d.wrongs.length){
    h+='<h3 style="margin:14px 0 6px;font-size:15px">❌ Câu hay sai gần đây ('+d.wrongs.length+')</h3>';
    h+=d.wrongs.slice(0,8).map(w=>'<div style="font-size:13px;margin:6px 0;padding:8px 10px;border-radius:10px;background:#f6f5ff"><b>'+esc(w.kind)+' · câu '+esc(String(w.num))+'</b> — '+esc(w.text)+'<br><span style="color:#16a34a">Đáp án đúng: '+esc(w.ans)+'</span></div>').join('');
    h+='<button class="btn" style="margin-top:8px" onclick="efzClearWrongs()">🧹 Xoá danh sách câu sai</button>';
  }
  box.innerHTML=h;
}

/* ================= LEADERBOARD & BADGES ================= */
function renderBoard(){
  try{renderProgress()}catch(e){}
  try{efzRenderCloud()}catch(e){}
  efzLbDraw();efzLbFetch();
}
function renderBadges(){
  $('badgeRow').innerHTML=BADGES.map(b=>`
    <div class="badge ${P&&P.badges.includes(b.id)?'got':''}">
      <div class="em">${b.em}</div><div class="nm">${b.nm}</div><div class="ds">${b.ds}</div>
    </div>`).join('');
}

/* ================= NAME MODAL & INIT ================= */
let pickedAva=AVAS[0];
function showNameModal(){
  $('avaPick').innerHTML=AVAS.map(a=>`<button class="${a===pickedAva?'on':''}" onclick="pickAva('${a}',this)">${a}</button>`).join('');
  $('nameModal').classList.add('show');
  const known=P?P.name:'';$('nameInput').value=known;
  const na=$('nameAcc');if(na)na.innerHTML=efzUser?'Tài khoản: <b>'+esc(efzAccName())+'</b> · <a href="#" onclick="efzLogout();return false">Đăng xuất</a>':'';
  setTimeout(()=>$('nameInput').focus(),100);
}
function pickAva(a,el){pickedAva=a;sndClick();document.querySelectorAll('#avaPick button').forEach(b=>b.classList.toggle('on',b===el))}
function saveName(){
  const n=$('nameInput').value.trim();
  if(!n){toast('✏️ Nhập tên của em đã nha!');return}
  if(efzNameOwner(n)){toast('😅 Tên này đã có bạn khác dùng trên máy này — em chọn tên khác nha!');return}
  const ps=loadPlayers();
  if(ps[n]){P=ps[n];P.ava=pickedAva}
  else if(efzUser&&P&&P.name&&!efzNameOwner(P.name)){
    /* đã đăng nhập: đổi tên vẫn giữ nguyên điểm + tiến độ */
    const old=P.name;
    try{['efz_prog_','efz_chess_'].forEach(k=>{const v=localStorage.getItem(k+old);if(v!=null){localStorage.setItem(k+n,v);localStorage.removeItem(k+old)}})}catch(e){}
    delete ps[old];savePlayers(ps);P.name=n;P.ava=pickedAva;
  }
  else P=newPlayer(n,pickedAva);
  localStorage.setItem(LS_CUR,n);
  if(efzUser)efzUidMapSet(efzUser.uid,n);
  persist();$('nameModal').classList.remove('show');
  confetti(50);sndWin();toast('🎉 Chào mừng <b>'+esc(n)+'</b>! Cùng học thôi!');
}
$('playerChip').onclick=showNameModal;
$('nameInput').addEventListener('keydown',e=>{if(e.key==='Enter')saveName()});

(function init(){
  const ds=['⭐','✏️','📘','🎈','🔤','🎧','🍀','💜','✨','📚','🎮','🌈'];
  $('doodles').innerHTML=ds.map((d,i)=>`<span class="doodle" style="left:${(i*8.3+3)%96}%;top:${(i*17+5)%92}%;animation-delay:${i*.7}s;font-size:${22+i%3*10}px">${d}</span>`).join('');
  const cur=localStorage.getItem(LS_CUR),ps=loadPlayers();
  if(cur&&ps[cur]){P=ps[cur];pickedAva=P.ava;renderPlayer()}
  else showNameModal();
  renderPlayer();
  const sb=document.getElementById('sndToggleBtn');
  if(sb){sb.textContent=soundOn?'🔊':'🔇';sb.title=soundOn?'Tắt âm thanh':'Bật âm thanh'}
})();



/* ================= THPT QG ================= */
let _thptTab='thpt1';
function goTHPT(){
  document.querySelectorAll('.gpill').forEach(p=>p.classList.remove('on'));
  document.getElementById('gpillTHPT').classList.add('on');
  document.getElementById('tabTHPT').style.display='';
  const ti=$('tabIELTS');if(ti)ti.style.display='none';
  const th=$('tabHSA');if(th)th.style.display='none';
  const tv=$('tabVocab');if(tv)tv.style.display='none';
  go('thpt');
}
function showTHPTTab(tab){
  _thptTab=tab;
  document.querySelectorAll('#thptSubtab button').forEach(b=>b.classList.remove('on'));
  const idx=parseInt(tab.replace('thpt',''))-1;
  document.querySelectorAll('#thptSubtab button')[idx].classList.add('on');
  const dataMap=new Proxy({},{get:(_,k)=>efzData(k)});
  efzLoad(tab).then(()=>renderTHPTQuiz(dataMap[tab]||efzData('thpt1'),tab));
}

let _thptState={};
function fmtExamText(s){
  if(!s)return '';
  let out=String(s).replace(/\\!/g,'!').replace(/\\#/g,'#').replace(/\\\[/g,'[').replace(/\\\]/g,']');
  if(/(?:^|\s|<br>)a\.\s+.+\s+b\.\s+/i.test(out)){
    out=out.replace(/(?<=\S)\s+(?=[a-f]\.\s+[A-Z“"'‘(\[])/g,'<br>');
    out=out.replace(/(?<=[.?!,”"'])\s+(?=[a-f]\.\s+)/g,'<br>');
    out=out.replace(/(?<=[.?!"”])\s+((?:Best regards|Kind regards|Warm regards|Regards|Best wishes|Warm wishes|With love|Lots of love|Write back soon|Yours sincerely|Yours faithfully|Your friend|Take care|Sincerely|Cheers|Love|Best|All the best|Talk soon|See you soon|Warmly|Yours),\s+[A-Z][a-zA-Z\s]{1,25})$/,'<br>$1');
  }
  return out;
}

function formatExplainHTML(q){
  if(!q || !q.explain) return '';
  const ansIdx = typeof q.ans === 'number' ? q.ans : 0;
  const ansLetter = 'ABCD'[ansIdx] || 'A';
  const ansText = (q.opts && q.opts[ansIdx]) ? q.opts[ansIdx] : '';
  let out = `<div class="exp-ans-banner"><span class="exp-ans-pill">✅ Đáp án đúng: ${ansLetter}</span><span class="exp-ans-val">${ansText}</span></div>`;

  let raw = String(q.explain)
    .replace(/^\s*<b>\s*Đáp\s*án\s*:\s*[A-D]\s*<\/b>\s*(?:<br\s*\/?>)?/i, '')
    .replace(/\\--\\>/g, '→')
    .replace(/--\\>/g, '→')
    .replace(/-\\>/g, '→')
    .replace(/\\\+1/g, '')
    .replace(/\\-/g, '-')
    .trim();

  // Check if Arrangement Question (a-b-c / a-b-c-d-e)
  const isArr = q.opts && q.opts.some(o => /^[a-f]\s*[-–]\s*[a-f]/i.test(String(o).trim()));
  if(isArr){
    const seq = ansText.toLowerCase().match(/[a-f]/g) || [];
    // Parse English sentences from q.text
    const sentMap = {};
    if(q.text){
      const lines = String(q.text).split(/<br\s*\/?>|\n/);
      lines.forEach(line => {
        const m = line.trim().match(/^([a-f])\.\s*(.+)$/i);
        if(m) sentMap[m[1].toLowerCase()] = m[2].trim();
      });
    }
    // Extract trailing general translation if any
    let genTrans = '';
    const starTrans = raw.match(/(?:<br\s*\/?>|\n|•)*\s*(?:⭐\s*Dịch|<b>\s*Tạm\s*dịch\s*:?\s*<\/b>)\s*:?\s*([\s\S]+)$/i);
    let body = raw;
    if(starTrans){
      genTrans = starTrans[1].trim();
      body = raw.slice(0, starTrans.index).trim();
    }
    // Strip echoed question stem and A. ... B. ... C. ... D. ... up to Giải thích or 1️⃣
    const gtSplit = body.split(/(?:<br\s*\/?>|\s)*Giải\s*thích\s*:?\s*/i);
    if(gtSplit.length > 1){
      body = gtSplit.slice(1).join(' — ').trim();
    } else {
      body = body.replace(/^[\s\S]*?\bD\.\s*[a-f]\s*[-–]\s*[a-f](?:\s*[-–]\s*[a-f])*\s*(?:<br\s*\/?>)?/i, '').trim();
    }

    // Parse per-step notes
    const stepNotes = {};
    const stepTrans = {};
    // Pattern 1: 1️⃣ b. ... or 1⃣ b. ...
    if(/[1-6][⃣️⃣]/.test(body)){
      const parts = body.split(/(?:<br\s*\/?>|\s|•)*[1-6][⃣️⃣]\s*/);
      parts.forEach(p => {
        const pm = p.trim().match(/^([a-f])\.\s*([\s\S]+)$/i);
        if(pm){
          const ltr = pm[1].toLowerCase();
          let content = pm[2].trim();
          const sentEn = sentMap[ltr] || '';
          if(sentEn && content.toLowerCase().startsWith(sentEn.toLowerCase().slice(0, 25))){
            content = content.slice(sentEn.length).replace(/^[\s•<br\/—\-:]+/i, '').trim();
          }
          // Extract Dịch câu / Dịch / 🗣 Dịch inside step
          const dm = content.match(/(?:<br\s*\/?>|\s|•)*(?:🗣\s*Dịch|Dịch\s*câu|Dịch)\s*:\s*([\s\S]+)$/i);
          if(dm){
            stepTrans[ltr] = dm[1].replace(/<br\s*\/?>\s*•?\s*$/i, '').trim();
            content = content.slice(0, dm.index).trim();
          }
          content = content.replace(/^(?:•\s*|<br\s*\/?>\s*)*(?:Giải\s*thích\s*:\s*|—\s*)?/i, '').replace(/(?:<br\s*\/?>|\s|•)+$/g, '').trim();
          stepNotes[ltr] = content;
        }
      });
    } else if(seq.length >= 2) {
      // Split sequentially along seq letters: e.g. b. ... c. ... e. ... a. ... d. ...
      let rem = body;
      for(let i = 0; i < seq.length; i++){
        const curL = seq[i];
        const nextL = seq[i+1];
        const curRe = new RegExp(`(?:^|<br\\s*\\/?>|\\s|•)+${curL}\\.\\s*`, 'i');
        const mCur = rem.match(curRe);
        if(mCur){
          let afterCur = rem.slice(mCur.index + mCur[0].length);
          let chunk = afterCur;
          if(nextL){
            const nextRe = new RegExp(`(?:<br\\s*\\/?>|\\s|•)+${nextL}\\.\\s+`, 'i');
            const mNext = afterCur.match(nextRe);
            if(mNext){
              chunk = afterCur.slice(0, mNext.index);
              rem = afterCur.slice(mNext.index);
            } else {
              rem = '';
            }
          } else {
            rem = '';
          }
          const sentEn = sentMap[curL] || '';
          if(sentEn && chunk.toLowerCase().startsWith(sentEn.toLowerCase().slice(0, 25))){
            chunk = chunk.slice(sentEn.length).replace(/^[\s•<br\/—\-:]+/i, '').trim();
          }
          chunk = chunk.replace(/^“[^”]{10,120}”\s*/, '');
          const dm = chunk.match(/(?:<br\s*\/?>|\s|•)*(?:🗣\s*Dịch|Dịch\s*câu|Dịch)\s*:\s*([\s\S]+)$/i);
          if(dm){
            stepTrans[curL] = dm[1].replace(/<br\s*\/?>\s*•?\s*$/i, '').trim();
            chunk = chunk.slice(0, dm.index).trim();
          }
          chunk = chunk.replace(/^(?:•\s*|<br\s*\/?>\s*)*(?:Giải\s*thích\s*:\s*|—\s*)?/i, '').replace(/(?:<br\s*\/?>|\s|•)+$/g, '').trim();
          stepNotes[curL] = chunk;
        }
      }
    }

    if(seq.length >= 2){
      out += `<div class="exp-step-list">`;
      seq.forEach((ltr, idx) => {
        const en = sentMap[ltr] || '';
        const note = stepNotes[ltr] || '';
        const tr = stepTrans[ltr] || '';
        out += `<div class="exp-step-card">`;
        out += `<div class="exp-step-head"><span class="exp-step-num">Bước ${idx+1} · Câu ${ltr.toUpperCase()}</span></div>`;
        if(en) out += `<div class="exp-step-en">“${en}”</div>`;
        if(note) out += `<div class="exp-step-vi">💡 ${note}</div>`;
        if(tr) out += `<div class="exp-step-trans">💬 <i>Dịch:</i> ${tr}</div>`;
        out += `</div>`;
      });
      out += `</div>`;
      if(genTrans){
        out += `<div class="exp-trans-box">💬 <b>Tạm dịch:</b> ${genTrans}</div>`;
      }
      return out;
    }
  }

  // Case 2: Classic HSA / THPT Method + Giải + Tạm dịch
  if(/<b>\s*Phương\s*pháp\s*:\s*<\/b>/i.test(raw) || /<b>\s*Giải\s*:\s*<\/b>/i.test(raw)){
    const pm = raw.match(/<b>\s*Phương\s*pháp\s*:\s*<\/b>\s*([\s\S]*?)(?=<br\s*\/?>\s*<b>|$)/i);
    const gm = raw.match(/<b>\s*Giải\s*:\s*<\/b>\s*([\s\S]*?)(?=<br\s*\/?>\s*<b>|$)/i);
    const tm = raw.match(/<b>\s*Tạm\s*dịch\s*:\s*<\/b>\s*([\s\S]*?)$/i);
    if(pm && pm[1].trim()) out += `<div class="exp-method-chip">📌 <b>Kiến thức:</b> ${pm[1].trim()}</div>`;
    if(gm && gm[1].trim()) out += `<div class="exp-opt-card is-correct"><div class="exp-opt-desc">💡 <b>Giải thích:</b> ${gm[1].trim()}</div></div>`;
    if(tm && tm[1].trim()) out += `<div class="exp-trans-box">💬 <b>Tạm dịch:</b> ${tm[1].trim()}</div>`;
    if(!pm && !gm && !tm) out += `<div class="exp-opt-card">${raw}</div>`;
    return out;
  }

  // Case 3: Standard Multiple-Choice Option Breakdown (ĐÚNG / SAI)
  let passageTrans = '';
  let sentTrans = '';

  // Check for Tạm Dịch Bài Đọc
  const ptMatch = raw.match(/(?:<br\s*\/?>|\n)*<b>\s*Tạm\s*Dịch\s*Bài\s*Đọc\s*:?\s*<\/b>\s*([\s\S]+)$/i);
  if(ptMatch){
    passageTrans = ptMatch[1].trim();
    raw = raw.slice(0, ptMatch.index).trim();
  }

  // Check for Tạm dịch: or Dịch: at the end
  const stMatch = raw.match(/(?:<br\s*\/?>|\n)*<b>\s*Tạm\s*dịch\s*:?\s*<\/b>\s*([\s\S]+)$/i) || raw.match(/(?:<br\s*\/?>|\n|\s)+Dịch\s*:\s*([\s\S]{30,})$/i);
  if(stMatch){
    const candidate = stMatch[1].trim();
    if(candidate.length > 420){
      passageTrans = candidate;
    } else {
      sentTrans = candidate;
    }
    raw = raw.slice(0, stMatch.index).trim();
  }

  // Extract Vietnamese question translation in parentheses before Giải thích
  let qVi = '';
  let evidence = '';
  let body = raw;

  const gtIdx = body.search(/(?:^|<br\s*\/?>|\n)\s*Giải\s*thích\s*:?|(?:<br\s*\/?>|\n|\s)+Giải\s*thích\s*:/i);
  if(gtIdx !== -1){
    const pre = body.slice(0, gtIdx).trim();
    body = body.slice(gtIdx).replace(/^(?:<br\s*\/?>|\n|\s)*Giải\s*thích\s*:?\s*(?:<br\s*\/?>)?/i, '').trim();
    // Look for Thông tin: in pre
    const infM = pre.match(/-\s*Thông\s*tin\s*:\s*([\s\S]+)$/i);
    let preClean = pre;
    if(infM){
      evidence = infM[1].trim();
      preClean = pre.slice(0, infM.index).trim();
    }
    // Look for parenthesized Vietnamese question translation (...) at end of preClean
    const parenM = preClean.match(/\(([^()]{15,})\)\s*$/);
    if(parenM && /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(parenM[1])){
      qVi = parenM[1].replace(/\s*A\.\s*[\s\S]+$/, '').trim();
    } else if(/^[A-ZÀ-Ỹ][^<]{10,}\?$/.test(preClean) && /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(preClean)){
      qVi = preClean;
    }
  } else {
    // No explicit "Giải thích:" label — strip leading echoed "A. optA B. optB C. optC D. optD"
    if(q.opts && q.opts.length === 4){
      const dOpt = String(q.opts[3]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const echoRe = new RegExp(`^[\\s\\S]*?D\\.\\s*${dOpt}\\s*(?:<br\\s*\\/?>)?`, 'i');
      if(echoRe.test(body)){
        body = body.replace(echoRe, '').trim();
      }
    }
  }

  if(qVi) out += `<div class="exp-q-vi">🌐 <b>Yêu cầu câu hỏi:</b> ${qVi}</div>`;
  if(evidence) out += `<div class="exp-evidence">📖 <b>Dẫn chứng:</b> ${evidence}</div>`;

  // Now split body into option items: e.g. "• A. xxx - SAI: ..." or "A. xxx – ĐÚNG – ..." or "A, B, D - SAI: ..."
  const optRegex = /(?:^|<br\s*\/?>|\n|•|\s)+([A-D](?:\s*,\s*[A-D])*)\s*(?:\.\s*([^<\n]{1,220}?))?\s*[-–:]\s*(ĐÚNG|SAI)\b\s*[-–:]?\s*/gi;
  const matches = [];
  let m;
  while((m = optRegex.exec(body)) !== null){
    matches.push({
      index: m.index,
      end: optRegex.lastIndex,
      letters: m[1].trim(),
      optLabel: (m[2] || '').trim(),
      status: m[3].toUpperCase()
    });
  }

  if(matches.length > 0){
    const intro = body.slice(0, matches[0].index).replace(/^(?:<br\s*\/?>|\s|•|-)+|(?:<br\s*\/?>|\s|•|-)+$/g, '').trim();
    if(intro && intro.length > 3){
      out += `<div class="exp-intro-note">🎯 ${intro}</div>`;
    }
    const cards = [];
    for(let i = 0; i < matches.length; i++){
      const cur = matches[i];
      const nextIdx = (i + 1 < matches.length) ? matches[i+1].index : body.length;
      let desc = body.slice(cur.end, nextIdx)
        .replace(/^(?:<br\s*\/?>|\s|•|-|:|–)+|(?:<br\s*\/?>|\s|•)+$/g, '')
        .replace(/\s+o\s+/g, '<br>• ')
        .trim();
      const isRight = cur.status === 'ĐÚNG' || cur.letters === ansLetter;
      let headLabel = cur.letters;
      if(cur.optLabel){
        headLabel = `${cur.letters}. ${cur.optLabel}`;
      } else if(cur.letters.length === 1 && q.opts){
        const oIdx = 'ABCD'.indexOf(cur.letters);
        if(oIdx >= 0 && q.opts[oIdx]) headLabel = `${cur.letters}. ${q.opts[oIdx]}`;
      }
      cards.push({
        isRight,
        html: `<div class="exp-opt-card ${isRight ? 'is-correct' : 'is-wrong'}">` +
              `<div class="exp-opt-head"><span class="${isRight ? 'exp-badge-ok' : 'exp-badge-no'}">${isRight ? '✔ ĐÚNG' : '✖ SAI'}</span> <span>${headLabel}</span></div>` +
              (desc ? `<div class="exp-opt-desc">${desc}</div>` : '') +
              `</div>`
      });
    }
    // Sort so ĐÚNG card appears first
    cards.sort((a, b) => (b.isRight ? 1 : 0) - (a.isRight ? 1 : 0));
    out += `<div class="exp-opt-list">${cards.map(c => c.html).join('')}</div>`;
  } else if(body){
    const cleanBody = body.replace(/^(?:<br\s*\/?>|\s|•)+/g, '').trim();
    if(cleanBody) out += `<div class="exp-opt-card is-correct"><div class="exp-opt-desc">💡 ${cleanBody}</div></div>`;
  }

  if(sentTrans){
    out += `<div class="exp-trans-box">💬 <b>Tạm dịch:</b> ${sentTrans}</div>`;
  }
  if(passageTrans){
    out += `<details class="exp-passage-details"><summary>📖 Xem bản dịch đoạn văn</summary><div class="exp-passage-body">${passageTrans}</div></details>`;
  }
  return out;
}

function renderTHPTQuiz(data,prefix){
  const el=$('thptContent');
  _thptState={answered:0,correct:0,total:data.reduce((s,cat)=>s+cat.questions.length,0),wrongs:[],catStats:{}};
  if(window._thptTimer)clearInterval(window._thptTimer);
  window._thptStartTime=Date.now();
  window._thptElapsed=0;
  let h=`<div class="thpt-exam-info">📋 <b>Đề thi Tốt nghiệp THPT Quốc Gia</b> · Môn: Tiếng Anh · Thời gian: <b>50 phút</b> · Số câu: <b>40 câu trắc nghiệm</b></div>`;
  h+=`<div class="thpt-score-bar" id="thpt-score-${prefix}">
    <div class="sc-item">📊 Đã làm: <b><span id="thpt-done-${prefix}">0</span>/${_thptState.total}</b></div>
    <div class="sc-item">✅ Đúng: <b><span id="thpt-right-${prefix}">0</span></b></div>
    <div class="sc-item">📈 Tỉ lệ: <b><span id="thpt-pct-${prefix}">0</span>%</b></div>
    <div class="thpt-timer" id="thpt-timer-${prefix}"><span class="t-icon">⏱️</span> <span id="thpt-time-${prefix}">00:00</span></div>
    <button class="score-submit-btn" id="thpt-submit-top-${prefix}" onclick="thptSubmit('${prefix}')">📩 Nộp bài (≥5 câu)</button>
  </div>`;
  window._thptTimer=setInterval(()=>{
    window._thptElapsed=Math.floor((Date.now()-window._thptStartTime)/1000);
    const m=Math.floor(window._thptElapsed/60).toString().padStart(2,'0');
    const s=(window._thptElapsed%60).toString().padStart(2,'0');
    const te=document.getElementById('thpt-time-'+prefix);
    if(te)te.textContent=m+':'+s;
    // Warning at 50 minutes
    if(window._thptElapsed===3000){try{toast('⚠️ Còn 0 phút! Hết giờ thi!')}catch(e){}}
  },1000);
  data.forEach(cat=>{
    h+=`<div class="thpt-cat-header">${cat.icon} ${cat.title}</div>`;
    if(cat.passage){
      const pid=prefix+'-passage-'+cat.title.replace(/[^a-zA-Z0-9]/g,'');
      h+=`<button class="thpt-passage-toggle" onclick="const p=document.getElementById('${pid}');p.style.display=p.style.display==='none'?'block':'none';this.textContent=p.style.display==='none'?'📖 Hiện đoạn văn':'📖 Ẩn đoạn văn'">📖 Ẩn đoạn văn</button>`;
      h+=`<div class="thpt-passage" id="${pid}" style="display:block">${cat.passage}</div>`;
    }
    cat.questions.forEach(q=>{
      const qid=prefix+'-'+q.num;
      h+=`<div class="thpt-q-card" id="tq-${qid}">`;
      h+=`<div class="q-num">Câu ${q.num} <span style="font-weight:400;color:#64748b">(${q.level==='NB'?'Nhận biết':q.level==='TB'?'Thông hiểu':'Vận dụng'})</span></div>`;
      if(q.text) h+=`<div class="q-text">${fmtExamText(q.text)}</div>`;
      h+=`<div class="thpt-opts">`;
      q.opts.forEach((opt,i)=>{
        const letter='ABCD'[i];
        h+=`<button class="thpt-opt" data-qid="${qid}" data-idx="${i}" onclick="thptAnswer('${qid}',${i},'${prefix}',event)"><span class="opt-text-wrap">${letter}. ${opt}</span><span class="opt-hl-btn" onclick="event.stopPropagation();highlightOptBtn(this,'THPT QG',event)" title="Tô màu & dịch đáp án này">🖍️</span></button>`;
      });
      h+=`</div>`;
      h+=`<div class="thpt-explain" id="texp-${qid}">`;
      h+=`<div class="exp-title">💡 Giải chi tiết</div>`;
      h+=`<div class="exp-body">${formatExplainHTML(q)}</div>`;
      h+=`</div></div>`;
    });
  });
  h+=`<div style="text-align:center;margin:24px 0"><button class="thpt-submit-btn" id="thpt-submit-${prefix}" onclick="thptSubmit('${prefix}')">📩 Nộp Bài</button></div>`;
  h+=`<div class="thpt-summary" id="thpt-summary-${prefix}"></div>`;
  el.innerHTML=h;
  el.scrollIntoView({behavior:'smooth',block:'start'});
}

function thptAnswer(qid,idx,prefix,ev){
  const _sel=window.getSelection?window.getSelection().toString().trim():"";
  if(_sel.length>=2||window._justSelectedOptText)return;
  const card=document.getElementById('tq-'+qid);
  if(card.dataset.done) return;
  card.dataset.done='1';
  const btns=card.querySelectorAll('.thpt-opt');
  let correctIdx=-1;
  const dataMap=new Proxy({},{get:(_,k)=>efzData(k)});
  const allData=dataMap[prefix]||efzData('thpt1');
  for(const cat of allData){
    for(const q of cat.questions){
      if(prefix+'-'+q.num===qid){correctIdx=q.ans;break}
    }
    if(correctIdx>=0) break;
  }
  btns.forEach((b,i)=>{
    b.style.cursor='default';
    if(i===correctIdx) b.classList.add('correct');
    if(i===idx && i!==correctIdx) b.classList.add('wrong');
    if(i!==idx && i!==correctIdx) b.style.opacity='0.4';
  });
  const exp=document.getElementById('texp-'+qid);
  exp.classList.add('show');
  _thptState.answered++;
  if(idx===correctIdx) _thptState.correct++;
  const de=$('thpt-done-'+prefix); if(de) de.textContent=_thptState.answered;
  const re=$('thpt-right-'+prefix); if(re) re.textContent=_thptState.correct;
  const pe=$('thpt-pct-'+prefix); if(pe) pe.textContent=_thptState.answered?Math.round(_thptState.correct/_thptState.answered*100):0;
  const topBtn=$('thpt-submit-top-'+prefix); if(topBtn&&_thptState.answered>=5){topBtn.classList.add('ready');topBtn.textContent='📩 Nộp Bài ('+_thptState.answered+'/'+_thptState.total+')';}
  let qCat='',qObj=null;
  for(const cat of allData){
    for(const q of cat.questions){
      if(prefix+'-'+q.num===qid){qCat=cat.title;qObj=q;break}
    }
    if(qObj)break;
  }
  if(!_thptState.catStats[qCat])_thptState.catStats[qCat]={total:0,correct:0};
  _thptState.catStats[qCat].total++;
  try{efzTrack('THPT',qCat,idx===correctIdx,qObj,correctIdx)}catch(e){}
  if(idx===correctIdx){
    _thptState.catStats[qCat].correct++;
  }else{
    _thptState.wrongs.push({num:qObj.num,text:qObj.text||'',cat:qCat,chose:'ABCD'[idx],correct:'ABCD'[correctIdx],correctText:qObj.opts[correctIdx],level:qObj.level});
  }
  try{sndClick()}catch(e){}
  if(idx===correctIdx){try{addXP(5);toast('🎯 Chính xác! +5 XP')}catch(e){}}
  else{try{toast('❌ Sai rồi! Đáp án đúng: '+'ABCD'[correctIdx])}catch(e){}}
  if(_thptState.answered>=_thptState.total){
    if(window._thptTimer){clearInterval(window._thptTimer);window._thptTimer=null;}
    setTimeout(()=>showTHPTSummary(prefix),600);
  }
}


function thptSubmit(prefix){
  const minRequired=5;
  if(_thptState.answered<minRequired){
    toast('⚠️ Bạn cần làm ít nhất '+minRequired+' câu trước khi nộp bài! (Hiện tại: '+_thptState.answered+'/'+minRequired+' câu)');
    return;
  }
  if(!confirm('Bạn đã làm '+_thptState.answered+'/'+_thptState.total+' câu. Bạn có chắc muốn nộp bài?'))return;
  const dataMap=new Proxy({},{get:(_,k)=>efzData(k)});
  const allData=dataMap[prefix]||efzData('thpt1');
  allData.forEach(cat=>{
    cat.questions.forEach(q=>{
      const qid=prefix+'-'+q.num;
      const card=document.getElementById('tq-'+qid);
      if(card && !card.dataset.done){
        card.dataset.done='1';
        const btns=card.querySelectorAll('.thpt-opt');
        btns.forEach((b,i)=>{
          b.style.cursor='default';
          if(i===q.ans) b.classList.add('correct');
          b.style.opacity=i===q.ans?'1':'0.4';
        });
        const exp=document.getElementById('texp-'+qid);
        if(exp)exp.classList.add('show');
        _thptState.answered++;
        const qCat=cat.title;
        if(!_thptState.catStats[qCat])_thptState.catStats[qCat]={total:0,correct:0};
        _thptState.catStats[qCat].total++;
        _thptState.wrongs.push({num:q.num,text:q.text||'',cat:qCat,chose:'—',correct:'ABCD'[q.ans],correctText:q.opts[q.ans],level:q.level});
      }
    });
  });
  const de=$('thpt-done-'+prefix);if(de)de.textContent=_thptState.answered;
  const pe=$('thpt-pct-'+prefix);if(pe)pe.textContent=_thptState.answered?Math.round(_thptState.correct/_thptState.answered*100):0;
  const btn=document.getElementById('thpt-submit-'+prefix);
  if(btn)btn.style.display='none';
  const topBtn=document.getElementById('thpt-submit-top-'+prefix);
  if(topBtn)topBtn.style.display='none';
  if(window._thptTimer){clearInterval(window._thptTimer);window._thptTimer=null;}
  setTimeout(()=>showTHPTSummary(prefix),400);
}


function jumpToQuestion(cardId){
  const el=document.getElementById(cardId);
  if(el){
    el.scrollIntoView({behavior:'smooth',block:'center'});
    el.style.transition='box-shadow .3s';
    el.style.boxShadow='0 0 0 4px #3b82f6';
    setTimeout(()=>{el.style.boxShadow='';},1800);
  }
}

function classifyQuestionSkill(q, catTitle){
  const t = String(q.text || '').toLowerCase();
  const exp = String(q.explain || '').toLowerCase();
  const c = String(catTitle || '').toLowerCase();
  const opts = (q.opts || []).map(o => String(o));

  // 1) Check explicit Phương pháp tag if present (HSA)
  const pm = String(q.explain || '').match(/<b>\s*Phương\s*pháp\s*:\s*<\/b>\s*([^<]+)/i);
  if(pm && pm[1].trim()){
    const pText = pm[1].trim();
    if(pText.length < 45) return pText;
  }

  // 2) Arrangement questions
  if(opts.some(o => /^[a-f]\s*[-–]\s*[a-f]/i.test(o.trim()))){
    if(t.includes('dear ') || t.includes('yours') || t.includes('with love') || t.includes('regards'))
      return 'Sắp xếp Thư từ / Email (Letter Arrangement)';
    const seqLen = (opts[0].match(/[a-f]/gi) || []).length;
    if(seqLen <= 3 || /[a-z]+:\s/i.test(q.text || ''))
      return 'Sắp xếp Hội thoại giao tiếp (Dialogue Arrangement)';
    return 'Sắp xếp Đoạn văn nghị luận (Paragraph Arrangement)';
  }

  // 3) Reading Comprehension specific question types
  if(t.includes('opposite in meaning'))
    return 'Từ vựng Trái nghĩa trong bài đọc (OPPOSITE in meaning)';
  if(t.includes('closest in meaning') || t.includes('best replaced by') || t.includes('mostly mean'))
    return 'Từ vựng Đồng nghĩa trong ngữ cảnh (CLOSEST / Replaced by)';
  if(t.includes('refer to') || t.includes('refers to'))
    return 'Quy chiếu đại từ trong bài đọc (Reference: it/they/this...)';
  if(t.includes('best paraphrases') || t.includes('best restates'))
    return 'Diễn đạt lại câu gạch chân (Paraphrasing)';
  if(t.includes('best fit') || opts.some(o => /^\[I/.test(o.trim())))
    return 'Chèn câu vào vị trí hợp lý trong đoạn ([I]–[IV] Sentence Insertion)';
  if(t.includes('best summarises') || t.includes('best summarizes') || t.includes('main idea'))
    return 'Tóm tắt ý chính đoạn văn / toàn bài (Summarising / Main Idea)';
  if(t.includes('inferred from') || t.includes('infer from'))
    return 'Suy luận từ thông tin bài đọc (Inference Questions)';
  if(t.includes('which paragraph'))
    return 'Định vị thông tin theo đoạn văn (Paragraph Matching)';
  if(t.includes('not mentioned') || t.includes('true according to') || t.includes('not true') || t.includes('false'))
    return 'Đọc tìm thông tin chi tiết & Loại trừ (Detail / TRUE – NOT Mentioned)';

  // 4) Reading Cloze (sentence/clause completion 18-22)
  if(c.includes('reading cloze') || opts.some(o => o.split(/\s+/).length >= 6)){
    if(exp.includes('mệnh đề quan hệ') || exp.includes('relative') || opts.some(o => /^(which|who|whose|that|in which|of which)\b/i.test(o.trim())))
      return 'Hoàn thành câu: Mệnh đề quan hệ & Rút gọn mệnh đề';
    return 'Hoàn thành câu & Mạch liên kết đoạn văn (Sentence / Clause Completion)';
  }

  // 5) Cloze Text / Grammar & Vocabulary micro-skills
  if(opts.every(o => /^(who|whom|whose|which|that|where|when|why)$/i.test(o.trim())) || exp.includes('đại từ quan hệ') || exp.includes('rút gọn mệnh đề'))
    return 'Đại từ quan hệ & Rút gọn mệnh đề (Relative Clauses / Participles)';
  if(opts.every(o => /^(in|on|at|for|with|about|to|of|from|by|into|over|through|during|under)$/i.test(o.trim())) || exp.includes('giới từ'))
    return 'Giới từ & Cụm tính từ/động từ đi kèm giới từ (Prepositions)';
  if(opts.some(o => /\b(up|out|off|down|over|away|back|on|in|into|after|for)\b$/i.test(o.trim()) && o.trim().split(/\s+/).length === 2) || exp.includes('cụm động từ') || exp.includes('phrasal verb'))
    return 'Cụm động từ (Phrasal Verbs)';
  if(opts.some(o => /^(many|much|few|little|other|others|another|the other|each|every|some|any|amount|number|range|variety|deal|plenty)\b/i.test(o.trim())) || exp.includes('lượng từ') || exp.includes('đếm được'))
    return 'Lượng từ & Đại từ bất định (Quantifiers: number/amount/other...)';
  if(opts.length === 4 && new Set(opts.map(o => o.trim().split(/\s+/).sort().join(' ').toLowerCase())).size === 1 && opts[0].trim().includes(' '))
    return 'Trật tự từ & Cụm danh từ (Word Order: OPSACOMP / Adj + N)';
  if(opts.length === 4 && opts[0].trim().length >= 4 && !opts[0].trim().includes(' ') && opts.filter(o => o.trim().toLowerCase().slice(0, 4) === opts[0].trim().toLowerCase().slice(0, 4)).length >= 3)
    return 'Từ loại & Cấu tạo từ (Word Form: N / V / Adj / Adv)';
  if(exp.includes('collocation') || exp.includes('cụm từ cố định') || exp.includes('kết hợp từ'))
    return 'Cụm từ cố định (Collocations)';
  if(exp.includes('liên từ') || opts.some(o => /^(although|despite|because|however|therefore|meanwhile|moreover|whereas|instead of|in spite of|due to|thanks to)$/i.test(o.trim())))
    return 'Liên từ & Từ nối (Conjunctions / Linking Words)';

  return 'Từ vựng & Ngữ cảnh đọc điền (Contextual Vocabulary)';
}

function getSkillStudyAdvice(skillName){
  const s = skillName.toLowerCase();
  if(s.includes('trật tự từ') || s.includes('word order'))
    return {
      what: 'Quy tắc trật tự tính từ (<b>OSASCOMP</b>: Opinion → Size → Age → Shape → Color → Origin → Material → Purpose) và cấu trúc <b>Trạng từ + Tính từ + Danh từ phụ + Danh từ chính</b>.',
      how: 'Luôn xác định <b>Danh từ chính (Head Noun)</b> đứng cuối cụm trước, sau đó đặt tính từ bổ nghĩa đứng trước danh từ ghép.',
      grammarTopic: true
    };
  if(s.includes('từ loại') || s.includes('word form'))
    return {
      what: 'Nhận diện hậu tố Danh từ (<i>-tion, -ment, -ity, -ness, -ance</i>), Tính từ (<i>-ive, -ous, -ful, -able, -ic, -al</i>), Trạng từ (<i>-ly</i>) và vị trí từ loại trong câu.',
      how: 'Sau mạo từ (<i>a/an/the</i>), tính từ sở hữu, giới từ → điền <b>Danh từ</b>; trước danh từ hoặc sau <i>be/become/remain/seem</i> → điền <b>Tính từ</b>; bổ nghĩa cho động từ thường/tính từ → điền <b>Trạng từ</b>.',
      grammarTopic: true
    };
  if(s.includes('đại từ quan hệ') || s.includes('rút gọn mệnh đề') || s.includes('mệnh đề quan hệ'))
    return {
      what: 'Cách dùng <b>who, whom, whose (+ N), which, that</b> và rút gọn mệnh đề quan hệ bằng <b>V-ing</b> (chủ động), <b>V3/ed</b> (bị động), <b>to V</b> (sau the first/last/only/so sánh nhất).',
      how: 'Kiểm tra câu đã có động từ chính chưa: nếu đã có động từ chính và không có đại từ quan hệ thì phải chọn dạng rút gọn (<i>V-ing</i> hoặc <i>V-ed</i>); sau dấu phẩy không dùng <i>that</i>.',
      grammarTopic: true
    };
  if(s.includes('lượng từ') || s.includes('quantifiers'))
    return {
      what: 'Phân biệt <b>a number of / a wide range of / many / few + N số nhiều</b> với <b>an amount of / a great deal of / much / little + N không đếm được</b>; phân biệt <b>another + N số ít</b>, <b>other + N số nhiều/không đếm được</b>, <b>others</b> (đứng độc lập).',
      how: 'Nhìn ngay danh từ đứng ngay sau chỗ trống là số ít, số nhiều (có -s) hay không đếm được để loại trừ ngay 2–3 phương án sai ngữ pháp.',
      grammarTopic: true
    };
  if(s.includes('cụm động từ') || s.includes('phrasal verb'))
    return {
      what: 'Các nhóm Phrasal Verbs trọng tâm thi THPT & HSA (<i>take up/over/off, put off/up with, bring about/up, make up for, get over, turn down, look up to, cut down on, end up, pass down</i>).',
      how: 'Đừng dịch từng từ riêng lẻ; hãy dựa vào tân ngữ phía sau và ngữ cảnh tích cực/tiêu cực của câu, đồng thời lưu ngay cụm động từ vừa sai vào tab <b>📖 Từ Vựng</b>.',
      grammarTopic: false
    };
  if(s.includes('collocation') || s.includes('cụm từ cố định') || s.includes('giới từ'))
    return {
      what: 'Các cụm động từ – danh từ cố định (<i>make an effort/impact/contribution, raise awareness, pose a threat, play a role, meet the demand</i>) và tính từ đi kèm giới từ (<i>curious about, capable of, responsible for, exposed to</i>).',
      how: 'Nhìn danh từ hoặc tính từ sát chỗ trống để ghép cặp cố định; bôi đen cả cụm trong bài đọc để lưu vào <b>📖 Từ Vựng</b> ôn tập trên Quizlet.',
      grammarTopic: true
    };
  if(s.includes('liên từ') || s.includes('linking'))
    return {
      what: 'Phân biệt liên từ đi với mệnh đề (<i>although, because, while, whereas, so that</i>), giới từ nối đi với N/V-ing (<i>despite, in spite of, due to, owing to, instead of, regardless of</i>) và trạng từ liên kết (<i>however, therefore, meanwhile, moreover</i>).',
      how: 'Xác định quan hệ logic giữa 2 vế (Nguyên nhân – Kết quả hay Tương phản – Nhượng bộ) và kiểm tra sau chỗ trống là <b>Mệnh đề (S + V)</b> hay <b>Cụm danh từ/V-ing</b>.',
      grammarTopic: true
    };
  if(s.includes('hoàn thành câu') || s.includes('clause completion'))
    return {
      what: 'Cấu trúc ngữ pháp câu hoàn chỉnh (Chủ ngữ + Động từ chia thì), mệnh đề phân từ (<i>Having + V3/ed, V-ing...</i>) và sự hòa hợp chủ ngữ khi rút gọn mệnh đề.',
      how: 'Phân tích khung câu xung quanh chỗ trống: nếu câu chưa có động từ chính (Main Verb) thì bắt buộc chọn đáp án bắt đầu bằng động từ chia thì; nếu câu đã đủ S + V thì chọn mệnh đề phụ hoặc cụm phân từ bổ nghĩa.',
      grammarTopic: true
    };
  if(s.includes('sắp xếp'))
    return {
      what: 'Kỹ năng nhận diện câu mở đầu (Topic sentence / lời chào), các từ nối chuyển ý (<i>Firstly, Moreover, However, In addition, Finally, Overall</i>) và đại từ chỉ định (<i>this, these, such, they, he/she</i>).',
      how: '1) Tìm câu mở đầu khái quát (không bắt đầu bằng <i>However, Therefore, Also, This/They</i>). 2) Ghép các cặp câu hỏi – trả lời hoặc nguyên nhân – kết quả. 3) Tìm câu kết tổng hợp ý (<i>In conclusion, Overall, Thank you...</i>).',
      grammarTopic: false
    };
  if(s.includes('trái nghĩa') || s.includes('đồng nghĩa') || s.includes('opposite') || s.includes('closest'))
    return {
      what: 'Kỹ năng đoán nghĩa từ vựng qua ngữ cảnh (Context Clues) và tránh bẫy chọn nhầm từ đồng nghĩa khi đề hỏi <b>OPPOSITE (Trái nghĩa)</b>.',
      how: 'Thay thử từng đáp án vào câu gốc trong đoạn văn xem sắc thái nghĩa là tích cực (+) hay tiêu cực (–). Với câu <b>OPPOSITE</b>, nếu từ gốc mang nghĩa tiêu cực thì đáp án đúng phải mang nghĩa tích cực.',
      grammarTopic: false
    };
  if(s.includes('quy chiếu') || s.includes('reference'))
    return {
      what: 'Xác định danh từ được thay thế bởi các đại từ <b>it, they, them, their, this, these, those, which, one</b>.',
      how: 'Đọc câu ngay trước đại từ: kiểm tra <b>số ít / số nhiều</b> (<i>it/this</i> thay cho danh từ số ít; <i>they/them/these</i> thay cho danh từ số nhiều) và lắp danh từ đó vào vị trí đại từ xem câu có hợp nghĩa không.',
      grammarTopic: false
    };
  if(s.includes('paraphras') || s.includes('diễn đạt lại'))
    return {
      what: 'Kỹ năng nhận diện cấu trúc tương đương và từ đồng nghĩa (Synonym swapping) mà không làm thay đổi mức độ khẳng định của câu gốc.',
      how: 'Chia câu gốc thành các vế ý chính (Nguyên nhân / Điều kiện / Kết quả). Loại ngay các đáp án chứa từ tuyệt đối hóa sai lệch (<i>only, never, completely, all</i>) hoặc đảo ngược quan hệ nhân quả.',
      grammarTopic: false
    };
  if(s.includes('chèn câu') || s.includes('insertion'))
    return {
      what: 'Kỹ năng tìm móc nối (Anchor words) giữa câu cần chèn với câu đứng trước và câu đứng sau các vị trí <b>[I], [II], [III], [IV]</b>.',
      how: 'Chú ý các từ nối đầu câu cần chèn (<i>However, Moreover, As a result, For example</i>) và các đại từ chỉ định (<i>This challenge, These measures, Such...</i>) — câu đứng ngay trước vị trí chèn phải vừa nhắc đến đối tượng đó.',
      grammarTopic: false
    };
  if(s.includes('tóm tắt') || s.includes('summaris') || s.includes('suy luận') || s.includes('infer'))
    return {
      what: 'Kỹ năng tổng hợp luận điểm chính của đoạn/bài (Main Idea) và suy luận logic dựa trên bằng chứng trong bài (Inference).',
      how: 'Đáp án tóm tắt đúng phải bao quát đủ các luận điểm chính mà không sa vào 1 chi tiết phụ (quá hẹp) hoặc thêm thông tin không có trong bài (quá rộng/cực đoan).',
      grammarTopic: false
    };
  return {
    what: 'Kỹ năng đọc quét từ khóa (Scanning keywords) và đối chiếu thông tin đồng nghĩa trong bài đọc.',
    how: 'Dùng thanh công cụ <b>🔍 Tìm & highlight trong bài đọc</b> hoặc bôi đen từ khóa trong câu hỏi để định vị chính xác câu chứa thông tin trong đoạn văn trước khi chọn.',
    grammarTopic: false
  };
}

function showTHPTSummary(prefix){
  const el=document.getElementById('thpt-summary-'+prefix);
  if(!el)return;
  const st=_thptState;
  const actualWrongs=st.wrongs.filter(w=>w.chose!=='—');
  const skippedItems=st.wrongs.filter(w=>w.chose==='—');
  const attempted=st.correct+actualWrongs.length;
  const pctTotal=Math.round(st.correct/st.total*100);
  const pctAttempted=attempted>0?Math.round(st.correct/attempted*100):0;
  const score=(st.correct*0.25).toFixed(2);

  let grade='',gradeColor='';
  const evalPct=skippedItems.length>0?pctAttempted:pctTotal;
  if(evalPct>=85){grade='Xuất sắc 🏆';gradeColor='green';}
  else if(evalPct>=70){grade='Khá tốt 👍';gradeColor='blue';}
  else if(evalPct>=50){grade='Trung bình ⚡';gradeColor='blue';}
  else{grade='Cần củng cố 📚';gradeColor='red';}

  const elapsed=window._thptElapsed||0;
  const mins=Math.floor(elapsed/60);
  const secs=elapsed%60;
  const timeStr=mins>0?mins+' phút '+secs+' giây':secs+' giây';
  const overTime=elapsed>3000;

  let h=`<h3>📊 Kết Quả Chấm Điểm & Đánh Giá Lộ Trình Học Tập (THPT QG)</h3>`;
  h+=`<div class="thpt-sum-grid">
    <div class="thpt-sum-card"><div class="big blue">${score}</div><div class="lbl">Điểm toàn đề / 10</div></div>
    <div class="thpt-sum-card"><div class="big green">${st.correct}/${attempted}</div><div class="lbl">Đúng / Số câu đã làm (${pctAttempted}%)</div></div>
    <div class="thpt-sum-card"><div class="big red">${actualWrongs.length}</div><div class="lbl">Câu làm sai${skippedItems.length>0?` (+${skippedItems.length} bỏ trống)`:''}</div></div>
    <div class="thpt-sum-card"><div class="big ${gradeColor}">${evalPct}%</div><div class="lbl">Độ chính xác · ${grade}</div></div>
    <div class="thpt-sum-card"><div class="big blue">⏱️</div><div class="lbl">${timeStr}${overTime?' (quá giờ!)':''}</div></div>
  </div>`;

  // Lookup full question objects to classify micro-skills accurately
  const dataMap=new Proxy({},{get:(_,k)=>efzData(k)});
  const allData=dataMap[prefix]||efzData('thpt1');
  const qMap={};
  allData.forEach(cat=>{
    cat.questions.forEach(q=>{qMap[q.num]={q,catTitle:cat.title};});
  });

  // 1) Visual progress breakdown by exam section
  h+=`<div class="thpt-weak-section"><div class="thpt-weak-title">📋 Đánh giá năng lực theo từng phần thi</div>`;
  for(const[cat,s] of Object.entries(st.catStats)){
    const p=Math.round(s.correct/s.total*100);
    const color=p>=80?'#16a34a':p>=50?'#f59e0b':'#dc2626';
    const statusTxt=p>=80?'🌟 Vững vàng':p>=50?'⚡ Cần củng cố':'🔴 Điểm yếu cần ôn kỹ';
    h+=`<div class="diag-prog-row">
      <div class="diag-prog-head"><span>${cat}</span><span style="color:${color}">${s.correct}/${s.total} câu đúng (${p}%) · ${statusTxt}</span></div>
      <div class="diag-prog-track"><div class="diag-prog-fill" style="width:${p}%;background:${color}"></div></div>
    </div>`;
  }
  h+=`</div>`;

  // 2) Diagnose specific micro-skills on wrong answers (prioritize actualWrongs; if user got 100% on attempted but skipped some, show skipped skills)
  const targetDiagnosticList=actualWrongs.length>0?actualWrongs:skippedItems;
  const isDiagnosingSkipped=(actualWrongs.length===0&&skippedItems.length>0);

  if(targetDiagnosticList.length>0){
    const skillMap={};
    targetDiagnosticList.forEach(w=>{
      const info=qMap[w.num];
      const skill=info?classifyQuestionSkill(info.q,info.catTitle):w.cat.replace(/ \(.+/,'');
      w.skill=skill;
      if(!skillMap[skill])skillMap[skill]=[];
      skillMap[skill].push(w);
    });
    const sortedSkills=Object.entries(skillMap).sort((a,b)=>b[1].length-a[1].length);

    h+=`<div class="thpt-weak-section"><div class="thpt-weak-title">${isDiagnosingSkipped?'📌 Các dạng bài bạn chưa làm trong đề này':'🔴 Chẩn đoán cụ thể các dạng câu hỏi & mảng kiến thức bạn đang yếu'}</div><div class="thpt-weak-list">`;
    sortedSkills.forEach(([skill,items])=>{
      h+=`<span class="thpt-weak-tag">${skill} (${items.length} câu)</span>`;
    });
    h+=`</div></div>`;

    // 3) Personalized Study Roadmap with concrete advice, clickable question jumps, and direct learning links
    h+=`<div class="thpt-roadmap"><h4>🗺️ Lộ Trình Ôn Tập & Đề Xuất Học Tập Cụ Thể</h4>`;
    let pri=1;
    sortedSkills.forEach(([skill,items])=>{
      const pClass=pri===1?'p1':pri<=3?'p2':'p3';
      const pLabel=pri===1?'🔥 Ưu tiên số 1 — Cần khắc phục ngay':pri<=3?'⚡ Ưu tiên số '+pri+' — Cần ôn luyện thêm':'✅ Ưu tiên số '+pri+' — Ôn củng cố';
      const adv=getSkillStudyAdvice(skill);
      const qLinks=items.map(w=>`<a class="diag-q-jump${w.chose==='—'?' skip':''}" onclick="jumpToQuestion('tq-${prefix}-${w.num}')" title="Bấm để cuộn tới xem giải thích Câu ${w.num}">Câu ${w.num} (${w.chose==='—'?'Chưa làm':'Chọn '+w.chose+' → Đúng: '+w.correct})</a>`).join('');

      h+=`<div class="diag-road-card ${pClass}">
        <div class="diag-road-top">
          <div class="diag-road-title">${pri}. ${skill}</div>
          <span class="diag-pri-badge ${pClass}">${pLabel} (${items.length} câu)</span>
        </div>
        <div style="margin-bottom:6px"><small style="font-weight:700;color:#64748b">📍 Các câu cần xem lại (bấm vào để cuộn tới lời giải):</small><br>${qLinks}</div>
        <div class="diag-road-grid">
          <div class="diag-road-box">📚 <b>Kiến thức cần học:</b> ${adv.what}</div>
          <div class="diag-road-box">💡 <b>Phương pháp & Mẹo xử lý:</b> ${adv.how}</div>
        </div>
        <div class="diag-action-links">
          ${adv.grammarTopic?`<a class="diag-act-btn" href="grammar.html" target="_blank">📖 Học chuyên đề Ngữ pháp này</a>`:''}
          <button class="diag-act-btn" onclick="goVocab()">📌 Ôn từ vựng đã lưu (${_getVocab().length} từ)</button>
        </div>
      </div>`;
      pri++;
    });
    h+=`</div>`;

    // 4) Detailed table of wrong answers (with clickable row/button to jump to question)
    if(actualWrongs.length>0){
      h+=`<div class="thpt-weak-section"><div class="thpt-weak-title">📝 Bảng đối chiếu chi tiết các câu làm sai (${actualWrongs.length} câu)</div>`;
      h+=`<table class="thpt-wrong-table"><tr><th>Câu</th><th>Dạng bài / Kiến thức</th><th>Cấp độ</th><th>Bạn chọn</th><th>Đáp án đúng</th><th>Xem lại</th></tr>`;
      actualWrongs.forEach(w=>{
        const lvl=w.level==='NB'?'Nhận biết':w.level==='TB'?'Thông hiểu':'Vận dụng';
        const info=qMap[w.num];
        const skill=w.skill||(info?classifyQuestionSkill(info.q,info.catTitle):w.cat.replace(/ \(.+/,''));
        h+=`<tr><td><b>Câu ${w.num}</b></td><td>${skill}</td><td>${lvl}</td><td style="color:#dc2626;font-weight:700">${w.chose}</td><td style="color:#16a34a;font-weight:700">${w.correct}. ${w.correctText}</td><td><button class="diag-q-jump" onclick="jumpToQuestion('tq-${prefix}-${w.num}')">🔍 Xem lời giải</button></td></tr>`;
      });
      h+=`</table></div>`;
    }
  }else{
    h+=`<div class="thpt-roadmap" style="text-align:center;padding:24px"><h4>🎉 Tuyệt vời! Bạn trả lời đúng 100% các câu đã làm!</h4><p>Hãy tiếp tục thử sức với các đề tiếp theo để duy trì phong độ 10/10.</p></div>`;
  }

  el.innerHTML=h;
  el.classList.add('show');
  el.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ================= TỪ VỰNG: Highlight + Tra từ + Lưu + Xuất Quizlet ================= */

/* --- Navigation --- */
function goVocab(){
  document.querySelectorAll('.gpill').forEach(p=>p.classList.remove('on'));
  document.getElementById('gpillVocab').classList.add('on');
  document.getElementById('tabVocab').style.display='';
  const ti=$('tabIELTS');if(ti)ti.style.display='none';
  const th=$('tabHSA');if(th)th.style.display='none';
  const tt=$('tabTHPT');if(tt)tt.style.display='none';
  const sv=$('sec-vocab');if(sv)sv.style.display='';
  go('vocab');
  renderVocabPanel();
  if(sv)sv.scrollIntoView({behavior:'smooth',block:'start'});
}

/* --- Saved vocab store --- */
function _getVocab(){try{return JSON.parse(localStorage.getItem('efz_vocab')||'[]')}catch(e){return[]}}
function _setVocab(arr){try{localStorage.setItem('efz_vocab',JSON.stringify(arr))}catch(e){}}

/* --- Render vocab panel --- */
function renderVocabPanel(){
  const words=_getVocab();
  const countEl=$('vocabCount');
  if(countEl)countEl.textContent=words.length+' từ';
  const el=$('vocabList');
  if(!el)return;
  if(!words.length){
    el.innerHTML='<div class="vocab-empty">📭 Chưa có từ nào được lưu.<br><small>Click trái để highlight từ, click phải để tra từ trong đề HSA / THPT</small></div>';
    return;
  }
  let h='<table class="vocab-table"><thead><tr><th>Từ</th><th>Nghĩa</th><th>Nguồn</th><th></th></tr></thead><tbody>';
  words.forEach((w,i)=>{
    h+=`<tr><td class="v-word">${w.word}</td><td class="v-meaning">${w.meaning||''}</td><td><small>${w.source||''}</small></td><td><button class="v-del" onclick="deleteVocab(${i})" title="Xóa">✕</button></td></tr>`;
  });
  h+='</tbody></table>';
  el.innerHTML=h;
}

function deleteVocab(idx){
  const words=_getVocab();
  words.splice(idx,1);
  _setVocab(words);
  renderVocabPanel();
  toast('🗑️ Đã xóa từ');
}

function clearAllVocab(){
  if(!confirm('Xóa tất cả '+_getVocab().length+' từ đã lưu?'))return;
  _setVocab([]);
  renderVocabPanel();
  toast('🗑️ Đã xóa tất cả từ vựng');
}

function saveWordToVocab(word,meaning,source){
  const words=_getVocab();
  const exists=words.find(w=>w.word.toLowerCase()===word.toLowerCase());
  if(exists){toast('📌 Từ "'+word+'" đã có trong danh sách');return false}
  words.push({word:word,meaning:meaning||'',source:source||'',addedAt:new Date().toISOString()});
  _setVocab(words);
  toast('✅ Đã lưu "'+word+'" vào bộ từ vựng');
  return true;
}

/* --- Export Quizlet --- */
function exportVocab(fmt){
  const words=_getVocab();
  if(!words.length){toast('📭 Chưa có từ nào để xuất');return}
  let content,filename,mime;
  if(fmt==='csv'){
    content='word,meaning,source\n';
    words.forEach(w=>{
      const esc=s=>('"'+String(s||'').replace(/"/g,'""')+'"');
      content+=esc(w.word)+','+esc(w.meaning)+','+esc(w.source)+'\n';
    });
    filename='vocabulary_quizlet.csv';
    mime='text/csv;charset=utf-8';
  }else{
    content='';
    words.forEach(w=>{content+=w.word+'\t'+(w.meaning||'')+'\n'});
    filename='vocabulary_quizlet.txt';
    mime='text/plain;charset=utf-8';
  }
  const blob=new Blob(['\uFEFF'+content],{type:mime});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('📥 Đã tải '+filename);
}

/* --- Dictionary popup (Single Word + Multi-Word Phrase Translation) --- */
let _dictPopup=null;
let _dictOverlay=null;
let _activeHighlightEl=null;

function closeDictPopup(){
  if(_dictPopup){_dictPopup.remove();_dictPopup=null}
  if(_dictOverlay){_dictOverlay.remove();_dictOverlay=null}
  _activeHighlightEl=null;
}

function speakEnglishText(text,lang){
  try{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang=lang||'en-US';
    u.rate=0.95;
    window.speechSynthesis.speak(u);
  }catch(e){}
}

function removeHighlightSpan(spanEl){
  if(!spanEl||!spanEl.parentNode)return;
  const parent=spanEl.parentNode;
  while(spanEl.firstChild)parent.insertBefore(spanEl.firstChild,spanEl);
  parent.removeChild(spanEl);
  parent.normalize();
}

function unhighlightActive(){
  if(_activeHighlightEl){
    removeHighlightSpan(_activeHighlightEl);
    _activeHighlightEl=null;
    closeDictPopup();
    toast('🧹 Đã bỏ tô màu');
  }
}

/* Dịch Anh → Việt: thử Google trước (đường không chính thức, có thể bị chặn bất cứ lúc nào),
   hỏng thì chuyển sang MyMemory (API miễn phí, công khai). Cả hai hỏng → trả '' để dùng kho từ có sẵn. */
async function efzTranslate(text){
  const q=encodeURIComponent(text);
  try{
    const r=await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q='+q);
    if(r.ok){const d=await r.json();
      if(d&&Array.isArray(d[0])){const t=d[0].map(seg=>seg&&seg[0]?seg[0]:'').join('').trim();if(t)return t}}
  }catch(e){}
  try{
    const r=await fetch('https://api.mymemory.translated.net/get?langpair=en|vi&q='+q);
    if(r.ok){const d=await r.json();const t=d&&d.responseData&&d.responseData.translatedText;
      if(t&&d.responseStatus==200&&!/MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(t))return String(t).trim()}
  }catch(e){}
  return '';
}

async function showDictPopup(rawWord,x,y,source,hlEl){
  closeDictPopup();
  _activeHighlightEl=hlEl||null;
  // Clean leading/trailing option letters like "A. " and punctuation while preserving spaces for phrases
  let clean=String(rawWord||'')
    .replace(/^[A-D]\.\s+/i,'')
    .replace(/🖍️/g,'')
    .replace(/\s+/g,' ')
    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9?!.,'-]+$/g,'')
    .trim();
  if(!clean||clean.length<2)return;

  const words=clean.split(/\s+/).filter(Boolean);
  const isPhrase=words.length>1;
  const displayWord=isPhrase?clean:clean.toLowerCase();

  // Create overlay
  _dictOverlay=document.createElement('div');
  _dictOverlay.className='dict-overlay';
  _dictOverlay.onclick=closeDictPopup;
  document.body.appendChild(_dictOverlay);

  // Create popup
  _dictPopup=document.createElement('div');
  _dictPopup.className='dict-popup';
  _dictPopup.innerHTML=`<button class="dict-close" onclick="closeDictPopup()">✕</button><div class="dict-word">${esc(displayWord)}${isPhrase?`<span class="dict-phrase-badge">📝 Cụm ${words.length} từ</span>`:''}</div><div class="dict-loading">⏳ Đang dịch ${isPhrase?'cụm từ':'từ'}...</div>`;

  // Position
  const px=Math.min(x,window.innerWidth-360);
  const py=Math.min(y+10,window.innerHeight-300);
  _dictPopup.style.left=Math.max(10,px)+'px';
  _dictPopup.style.top=Math.max(10,py)+'px';
  document.body.appendChild(_dictPopup);

  // Fetch data
  let viMeaning='',enDef='',example='',exampleVi='',audioUK='',audioUS='',phonetic='';

  // 1) Free Dictionary API (for single words or short 2-3 word idioms/phrasal verbs)
  if(words.length<=3){
    try{
      const res=await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(clean.toLowerCase()));
      if(res.ok){
        const data=await res.json();
        const entry=data[0];
        if(entry.phonetics){
          for(const ph of entry.phonetics){
            if(ph.audio&&ph.audio.includes('-uk'))audioUK=ph.audio;
            if(ph.audio&&ph.audio.includes('-us'))audioUS=ph.audio;
            if(ph.audio&&!audioUK)audioUK=ph.audio;
            if(ph.text&&!phonetic)phonetic=ph.text;
          }
        }
        if(entry.meanings&&entry.meanings[0]){
          const m=entry.meanings[0];
          if(m.definitions&&m.definitions[0]){
            enDef=m.definitions[0].definition||'';
            example=m.definitions[0].example||'';
          }
        }
      }
    }catch(e){}
  }

  // 2) Google Translate for Vietnamese meaning (supports both single words and full multi-word phrases/sentences)
  try{
    viMeaning=await efzTranslate(clean);
  }catch(e){}

  // 3) Translate example to Vietnamese
  if(example){
    try{
      exampleVi=await efzTranslate(example);
    }catch(e){}
  }

  if(!viMeaning){
    // Du phong offline: tra trong kho tu vung co san (moi lop/chu de)
    try{
      const key=clean.toLowerCase().trim();
      outer:for(const g of Object.keys(DATA)){
        const lists=[DATA[g].vocab||[]].concat((DATA[g].topics||[]).map(x=>x.vocab||[]));
        for(const l of lists)for(const v of l){if(v&&v[0]&&String(v[0]).toLowerCase()===key){viMeaning=v[1];break outer}}
      }
    }catch(e){}
  }
  // Auto-save to vocab as soon as meaning is found (even if user closes popup quickly)
  let saved=_getVocab().find(w=>w.word.toLowerCase()===displayWord.toLowerCase());
  if(!saved && (viMeaning || enDef)){
    const wordsArr=_getVocab();
    wordsArr.unshift({word:displayWord,meaning:viMeaning||enDef,source:source||'',addedAt:new Date().toISOString()});
    _setVocab(wordsArr);
    saved=wordsArr[0];
    const countEl=$('vocabCount');
    if(countEl)countEl.textContent=wordsArr.length+' từ';
  }

  if(!_dictPopup)return; // closed while loading
  const escWord=displayWord.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  const escMeaning=(viMeaning||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  const escSource=(source||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");

  let html=`<button class="dict-close" onclick="closeDictPopup()">✕</button>`;
  html+=`<div class="dict-word">${displayWord}${phonetic?' <span style="font-size:14px;color:#94a3b8;font-weight:400">'+phonetic+'</span>':''}${isPhrase?`<span class="dict-phrase-badge">📝 Cụm ${words.length} từ</span>`:''}</div>`;

  // Audio buttons (MP3 or Web Speech API fallback so phrases also have UK/US pronunciation)
  html+=`<div class="dict-audio-row">`;
  if(audioUK){
    html+=`<button class="dict-audio-btn" onclick="new Audio('${audioUK}').play()">🇬🇧 UK 🔊</button>`;
  }else{
    html+=`<button class="dict-audio-btn" onclick="speakEnglishText('${escWord}','en-GB')">🇬🇧 UK 🔊</button>`;
  }
  if(audioUS){
    html+=`<button class="dict-audio-btn" onclick="new Audio('${audioUS}').play()">🇺🇸 US 🔊</button>`;
  }else{
    html+=`<button class="dict-audio-btn" onclick="speakEnglishText('${escWord}','en-US')">🇺🇸 US 🔊</button>`;
  }
  html+=`</div>`;

  // Vietnamese meaning
  if(viMeaning)html+=`<div class="dict-vi">${viMeaning}</div>`;

  // English definition
  if(enDef)html+=`<div class="dict-en-def">${enDef}</div>`;

  // Example
  if(example){
    html+=`<div class="dict-example">${example}`;
    if(exampleVi)html+=`<div class="dict-example-vi">${exampleVi}</div>`;
    html+=`</div>`;
  }

  if(!viMeaning&&!enDef)html+=`<div style="color:#ef4444;font-size:13px;margin-bottom:12px">❌ Không tìm thấy nghĩa cho cụm này</div>`;

  // Save + Unhighlight buttons
  html+=`<div class="dict-action-row">`;
  html+=`<button class="dict-save-btn${saved?' saved':''}" id="dict-save-btn" onclick="dictSaveWord('${escWord}','${escMeaning}','${escSource}')">`;
  html+=saved?'✅ Đã tự động lưu (Bấm để bỏ lưu)':(isPhrase?'📌 Lưu cụm từ':'📌 Lưu từ');
  html+=`</button>`;
  if(_activeHighlightEl){
    html+=`<button class="dict-unhl-btn" onclick="unhighlightActive()" title="Bỏ tô màu">🧹 Bỏ tô</button>`;
  }
  html+=`</div>`;

  _dictPopup.innerHTML=html;
}

function dictSaveWord(word,meaning,source){
  const words=_getVocab();
  const idx=words.findIndex(w=>w.word.toLowerCase()===word.toLowerCase());
  const btn=document.getElementById('dict-save-btn');
  if(idx>=0){
    words.splice(idx,1);
    _setVocab(words);
    if(btn){btn.textContent='📌 Lưu lại từ này';btn.classList.remove('saved');}
    toast('🗑️ Đã bỏ lưu "'+word+'"');
  }else{
    words.unshift({word:word,meaning:meaning||'',source:source||'',addedAt:new Date().toISOString()});
    _setVocab(words);
    if(btn){btn.textContent='✅ Đã tự động lưu (Bấm để bỏ lưu)';btn.classList.add('saved');}
    toast('✅ Đã lưu "'+word+'" vào Từ Vựng');
  }
  const countEl=$('vocabCount');
  if(countEl)countEl.textContent=words.length+' từ';
}

/* --- Helpers for Word/Phrase Highlighting & Option Highlighting --- */
function expandRangeToWords(range){
  try{
    if(range.startContainer.nodeType===3){
      const t=range.startContainer.textContent;
      let s=range.startOffset;
      while(s>0&&/[a-zA-Z0-9'-]/.test(t[s-1]))s--;
      range.setStart(range.startContainer,s);
    }
    if(range.endContainer.nodeType===3){
      const t=range.endContainer.textContent;
      let e=range.endOffset;
      while(e<t.length&&/[a-zA-Z0-9'-]/.test(t[e]))e++;
      range.setEnd(range.endContainer,e);
    }
  }catch(e){}
}

function mergeAdjacentHighlights(root){
  if(!root)return null;
  // 1) Flatten nested .word-highlight inside .word-highlight
  root.querySelectorAll('.word-highlight .word-highlight').forEach(inner=>{
    removeHighlightSpan(inner);
  });
  // 2) Merge adjacent .word-highlight siblings separated only by spaces
  let lastMerged=null;
  const spans=Array.from(root.querySelectorAll('.word-highlight'));
  for(let i=0;i<spans.length;i++){
    const cur=spans[i];
    if(!cur.parentNode)continue;
    let next=cur.nextSibling;
    while(next){
      if(next.nodeType===3&&/^[ \t]*$/.test(next.textContent)){
        const afterSpace=next.nextSibling;
        if(afterSpace&&afterSpace.nodeType===1&&afterSpace.classList.contains('word-highlight')){
          cur.appendChild(document.createTextNode(next.textContent||' '));
          while(afterSpace.firstChild)cur.appendChild(afterSpace.firstChild);
          next.parentNode.removeChild(next);
          afterSpace.parentNode.removeChild(afterSpace);
          cur.normalize();
          lastMerged=cur;
          next=cur.nextSibling;
          continue;
        }
      }else if(next.nodeType===1&&next.classList.contains('word-highlight')){
        while(next.firstChild)cur.appendChild(next.firstChild);
        next.parentNode.removeChild(next);
        cur.normalize();
        lastMerged=cur;
        next=cur.nextSibling;
        continue;
      }
      break;
    }
  }
  return lastMerged;
}

function highlightOptBtn(btnEl,source,ev){
  const optBtn=btnEl.closest('.hsa-opt,.thpt-opt');
  if(!optBtn)return;
  const wrap=optBtn.querySelector('.opt-text-wrap')||optBtn;
  const existing=wrap.querySelector('.word-highlight');
  if(existing){
    showDictPopup(wrap.textContent,ev.clientX,ev.clientY,source,existing);
    return;
  }
  // Highlight the option text (after "A. ")
  const fullText=wrap.textContent;
  const m=fullText.match(/^([A-D]\.\s+)([\s\S]+)$/);
  if(m){
    wrap.innerHTML=`${m[1]}<span class="word-highlight">${m[2]}</span>`;
    const hl=wrap.querySelector('.word-highlight');
    showDictPopup(m[2],ev.clientX,ev.clientY,source,hl);
  }else{
    wrap.innerHTML=`<span class="word-highlight">${fullText}</span>`;
    const hl=wrap.querySelector('.word-highlight');
    showDictPopup(fullText,ev.clientX,ev.clientY,source,hl);
  }
}

function getWordAtClick(e){
  const sel=window.getSelection();
  if(sel.rangeCount===0)return null;
  const range=sel.getRangeAt(0);
  const node=range.startContainer;
  if(node.nodeType!==3)return null;
  const text=node.textContent;
  const offset=range.startOffset;
  let start=offset,end=offset;
  while(start>0&&/[a-zA-Z'-]/.test(text[start-1]))start--;
  while(end<text.length&&/[a-zA-Z'-]/.test(text[end]))end++;
  const word=text.substring(start,end).replace(/^['-]+|['-]+$/g,'');
  if(word.length<2)return null;
  return{word,node,start,end};
}

function initQuizWordLookup(){
  const areas=['sec-hsa','sec-thpt'];
  areas.forEach(areaId=>{
    const area=$(areaId);
    if(!area)return;
    const source=areaId==='sec-hsa'?'HSA ĐGNL':'THPT QG';

    // Left click / drag selection: highlight word OR selected phrase (including inside options!)
    area.addEventListener('click',function(e){
      if(e.target.closest('.hsa-subtab,.thpt-subtab,.ans-hl-btn,.thpt-passage-toggle,.hsa-submit-btn,.opt-hl-btn'))return;
      const inOpt=e.target.closest('.hsa-opt,.thpt-opt');
      const qCard=e.target.closest('.hsa-q-card,.thpt-q-card');
      const isAnswered=qCard&&qCard.dataset.done==='1';

      const sel=window.getSelection();
      const selText=sel.toString().trim();

      // 1) If user dragged to select text (phrase or word inside passage, question, or option button!)
      if(selText.length>=2&&sel.rangeCount>0){
        const range=sel.getRangeAt(0);
        if(!area.contains(range.commonAncestorContainer))return;
        if(inOpt){
          window._justSelectedOptText=true;
          setTimeout(()=>{window._justSelectedOptText=false},250);
        }
        expandRangeToWords(range);
        const phraseText=range.toString().trim();
        const span=document.createElement('span');
        span.className='word-highlight';
        try{range.surroundContents(span)}catch(ex){
          const frag=range.extractContents();
          span.appendChild(frag);
          range.insertNode(span);
        }
        sel.removeAllRanges();
        const merged=mergeAdjacentHighlights(inOpt||qCard||area)||span;
        const finalText=(merged.textContent||phraseText).trim();
        // If multi-word phrase (2+ words) or inside an option, automatically show translation popup!
        if(finalText.split(/\s+/).filter(Boolean).length>=2||inOpt){
          showDictPopup(finalText,e.clientX,e.clientY,source,merged);
        }
        return;
      }

      // 2) If single-clicking inside an unanswered option button (without Alt/Ctrl), let thptAnswer/hsaAnswer handle answer choice
      if(inOpt&&!isAnswered&&!e.altKey&&!e.ctrlKey&&!e.metaKey)return;

      // 3) If clicking an already-highlighted single word, toggle it off (or if merged phrase, translate it)
      const clickedHl=e.target.closest('.word-highlight');
      if(clickedHl){
        const hlWords=clickedHl.textContent.trim().split(/\s+/).filter(Boolean);
        if(hlWords.length>=2){
          showDictPopup(clickedHl.textContent.trim(),e.clientX,e.clientY,source,clickedHl);
        }else{
          removeHighlightSpan(clickedHl);
        }
        return;
      }

      // 4) Single click: highlight single word & auto-merge with adjacent highlighted words!
      const info=getWordAtClick(e);
      if(!info)return;
      const range=document.createRange();
      range.setStart(info.node,info.start);
      range.setEnd(info.node,info.end);
      const span=document.createElement('span');
      span.className='word-highlight';
      range.surroundContents(span);
      const merged=mergeAdjacentHighlights(inOpt||qCard||area)||span;
      const mergedWords=(merged.textContent||'').trim().split(/\s+/).filter(Boolean);
      // If user clicked 2+ adjacent words to form a highlighted phrase, show phrase translation popup!
      if(mergedWords.length>=2){
        showDictPopup(merged.textContent.trim(),e.clientX,e.clientY,source,merged);
      }
    });

    // Right click: dictionary/phrase translation popup (works everywhere, including inside options!)
    area.addEventListener('contextmenu',function(e){
      if(e.target.closest('.hsa-subtab,.thpt-subtab,.ans-hl-btn'))return;
      const sel=window.getSelection();
      const selText=sel.toString().trim();
      let word=selText;
      let hlEl=e.target.closest('.word-highlight');

      if(!word||word.length<2){
        if(hlEl){
          // Right-clicked on an existing highlighted word or multi-word phrase!
          word=hlEl.textContent.trim();
        }else{
          const info=getWordAtClick(e);
          if(info){
            word=info.word;
            // Also highlight the right-clicked word (especially convenient on options!)
            try{
              const r=document.createRange();
              r.setStart(info.node,info.start);
              r.setEnd(info.node,info.end);
              const sp=document.createElement('span');
              sp.className='word-highlight';
              r.surroundContents(sp);
              hlEl=mergeAdjacentHighlights(e.target.closest('.hsa-opt,.thpt-opt,.hsa-q-card,.thpt-q-card')||area)||sp;
              word=hlEl.textContent.trim();
            }catch(ex){}
          }else{
            const optBtn=e.target.closest('.hsa-opt,.thpt-opt');
            if(optBtn){
              const wrap=optBtn.querySelector('.opt-text-wrap')||optBtn;
              word=wrap.textContent.replace(/^[A-D]\.\s+/,'').trim();
            }
          }
        }
      }
      if(!word||word.length<2)return;
      e.preventDefault();
      showDictPopup(word,e.clientX,e.clientY,source,hlEl);
    });
  });
}

/* ===== Dark Mode Toggle ===== */
function toggleDarkMode(){
  const html=document.documentElement;
  const cur=html.getAttribute('data-theme');
  if(cur==='dark'){
    html.setAttribute('data-theme','light');
    localStorage.setItem('efz_theme','light');
    document.getElementById('themeToggleBtn').textContent='🌙';
  }else{
    html.setAttribute('data-theme','dark');
    localStorage.setItem('efz_theme','dark');
    document.getElementById('themeToggleBtn').textContent='☀️';
  }
}
function loadTheme(){
  try{
    const t=localStorage.getItem('efz_theme');
    if(t==='dark'){
      document.documentElement.setAttribute('data-theme','dark');
      document.getElementById('themeToggleBtn').textContent='☀️';
    }else{
      document.documentElement.setAttribute('data-theme','light');
    }
  }catch(e){
    document.documentElement.setAttribute('data-theme','light');
  }
}

/* --- Search & Highlight Answer in Passage --- */
function addSearchBarToPassages(){
  document.querySelectorAll('.q-passage').forEach(passage=>{
    if(passage.previousElementSibling&&passage.previousElementSibling.classList.contains('ans-hl-bar'))return;
    const bar=document.createElement('div');
    bar.className='ans-hl-bar';
    bar.innerHTML=`<input type="text" placeholder="Tìm & highlight trong bài đọc..." class="ans-search-input"><button class="ans-hl-btn" onclick="searchInPassage(this)">🔍 Tìm</button><button class="ans-hl-btn clear" onclick="clearPassageHL(this)">✕ Xóa HL</button>`;
    passage.parentNode.insertBefore(bar,passage);
    // Enter key
    bar.querySelector('input').addEventListener('keydown',function(ev){
      if(ev.key==='Enter')searchInPassage(bar.querySelector('.ans-hl-btn'));
    });
  });
}

function searchInPassage(btn){
  const bar=btn.closest('.ans-hl-bar');
  const input=bar.querySelector('input');
  const query=input.value.trim();
  if(!query)return;
  const passage=bar.nextElementSibling;
  if(!passage)return;
  // Clear previous answer highlights
  passage.querySelectorAll('.ans-highlight').forEach(h=>{
    const t=document.createTextNode(h.textContent);
    h.parentNode.replaceChild(t,h);
  });
  passage.normalize();
  // Highlight all occurrences (case-insensitive)
  highlightTextInNode(passage,query);
  // Scroll first match into view
  const first=passage.querySelector('.ans-highlight');
  if(first){first.scrollIntoView({behavior:'smooth',block:'center'});toast('🔍 Tìm thấy "'+query+'"')}
  else{toast('❌ Không tìm thấy "'+query+'" trong bài đọc')}
}

function highlightTextInNode(node,query){
  if(node.nodeType===3){
    const text=node.textContent;
    const lower=text.toLowerCase();
    const qLower=query.toLowerCase();
    const idx=lower.indexOf(qLower);
    if(idx===-1)return;
    const before=text.substring(0,idx);
    const match=text.substring(idx,idx+query.length);
    const after=text.substring(idx+query.length);
    const frag=document.createDocumentFragment();
    if(before)frag.appendChild(document.createTextNode(before));
    const span=document.createElement('span');
    span.className='ans-highlight';
    span.textContent=match;
    frag.appendChild(span);
    if(after){
      const afterNode=document.createTextNode(after);
      frag.appendChild(afterNode);
      node.parentNode.replaceChild(frag,node);
      // Continue searching in the remaining text
      highlightTextInNode(afterNode,query);
    }else{
      node.parentNode.replaceChild(frag,node);
    }
  }else if(node.nodeType===1&&!node.classList.contains('ans-highlight')){
    const children=Array.from(node.childNodes);
    children.forEach(c=>highlightTextInNode(c,query));
  }
}

function clearPassageHL(btn){
  const bar=btn.closest('.ans-hl-bar');
  const passage=bar.nextElementSibling;
  if(!passage)return;
  // Clear answer highlights
  passage.querySelectorAll('.ans-highlight').forEach(h=>{
    const t=document.createTextNode(h.textContent);
    h.parentNode.replaceChild(t,h);
  });
  // Also clear word highlights
  passage.querySelectorAll('.word-highlight').forEach(h=>{
    const t=document.createTextNode(h.textContent);
    h.parentNode.replaceChild(t,h);
  });
  passage.normalize();
  bar.querySelector('input').value='';
  toast('🧹 Đã xóa tất cả highlight');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded',function(){
  initQuizWordLookup();
  loadTheme();
  // Render vocab panel if it's showing
  if(curSec==='vocab')renderVocabPanel();
});

// Hook into go() for vocab section
const _origGo=go;
go=function(s){
  _origGo(s);
  if(s==='vocab')renderVocabPanel();
};

/* ================= GÁC CỔNG CÁC MỤC CẦN TẢI THÊM ================= */
['renderTheory','quizHome','readingHome','listeningHome','writingHome'].forEach(f=>efzGate(f,['grades']));
efzGate('gamesHome',['grades','games']);
efzGate('grammarHome',['grammar']);
efzGate('showIELTSTab',['ielts']);
/* trang admin đọc số liệu nội dung qua khung xem trước → tải sẵn tất cả */
if(/[?&]admin=/.test(location.search)){efzNeed(Object.keys(EFZ_CHUNKS)).catch(()=>{})}
/* mở thẳng 1 mục bằng địa chỉ: index.html#grammar, #quiz, #games… */
(function(){const h=(location.hash||'').slice(1);if(h&&h!=='home'&&document.getElementById('sec-'+h)&&!/^(ielts|hsa|thpt|vocab)$/.test(h)){try{go(h)}catch(e){}}})();
