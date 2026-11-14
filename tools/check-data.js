// Kiem tra TOAN BO du lieu truoc khi deploy:   node tools/check-data.js     (exit 1 neu co LOI)
//   1) data/*.js            - de HSA / THPT
//   2) js/chunks/grades.js  - du lieu lop 4-12 (quiz, bai doc, bai nghe, bai viet, tu vung) + bo sinh de ngau nhien
//   3) js/chunks/ielts.js   - tu vung & paraphrase IELTS
//   4) js/chunks/grammar.js - chuyen de On Ngu Phap
//   5) grammar.html         - Ngu Phap Master (GP_DATA)
//   6) data/ws-questions.js - ngan hang cau hoi + sat thuong khi sai cua Word Strike 3D (WS_DATA)
//   7) data/ws-view.js      - tham so goc nhin thu 3 cua Word Strike 3D (WS_VIEW)
//   8) data/ws-outfits.js   - trang phuc Word Strike 3D (WS_OUTFITS): gioi han hop/khung, khong co chi so suc manh
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..');
let err=0,warn=0,tot=0;
const E=(...a)=>{console.log('LOI     ',...a);err++};
const W=(...a)=>{console.log('CANH BAO',...a);warn++};
const txt=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');

/* cau trac nghiem dang {q|text, o|opts, a|ans} */
function mcq(at,q,o,a,{needExplain,e}={}){
  tot++;
  if(!txt(q))E('thieu noi dung cau hoi',at);
  if(!Array.isArray(o)||o.length<2){E('thieu lua chon',at);return}
  if(!Number.isInteger(a)||a<0||a>=o.length)E('dap an (a) nam ngoai danh sach lua chon',at);
  if(o.some(x=>!txt(x)))E('co lua chon rong',at);
  if(new Set(o.map(x=>txt(x).toLowerCase())).size!==o.length)E('lua chon trung nhau',at,JSON.stringify(o));
  if(needExplain&&!txt(e))W('thieu loi giai',at);
}

/* ---------- 1) data/*.js ---------- */
(function(){
  const win={};const seen=new Map();
  for(const f of fs.readdirSync(path.join(ROOT,'data')).filter(f=>f.endsWith('.js')).sort()){
    try{new Function('window',read('data/'+f))(win)}catch(e){E('cu phap',f,e.message)}
  }
  for(const [key,sets] of Object.entries(win.EFZ_DATA||{})){
    sets.forEach((s,si)=>(s.questions||[]).forEach((q,qi)=>{
      const at=`data ${key}[${si}].q${q.num||qi}`;
      mcq(at,q.text||'(cloze)',q.opts,q.ans,{needExplain:true,e:q.explain});
      const k=key+'|'+txt(q.text)+'|'+(q.opts||[]).join('|');
      if(q.text&&seen.has(k))W('cau trung',at,'= '+seen.get(k));else seen.set(k,at);
    }));
  }
})();

/* ---------- moi truong gia lap de nap cac file chunk ---------- */
function sandbox(){
  const el=()=>new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':el(),apply:()=>el(),set:()=>true});
  const w={EFZ_LOADED:{},console,localStorage:{getItem:()=>null,setItem(){}},sessionStorage:{getItem:()=>null},
    location:{search:'',hash:'',href:''},addEventListener(){},setTimeout:()=>0,clearTimeout(){},navigator:{}};
  w.window=w;w.document={getElementById:()=>el(),querySelectorAll:()=>[],addEventListener(){},createElement:()=>el(),head:el(),body:el()};
  const ctx=vm.createContext(w);
  /* ban sao gon cua cac ham loi trong app.js ma du lieu can luc nap */
  vm.runInContext(`function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
    function pickN(arr,n){return shuffle(arr).slice(0,n)}
    const rnd=a=>a[Math.floor(Math.random()*a.length)];
    function mkQ(q,correct,distract,e){const d=[...new Set(distract.filter(x=>x!==correct))];const o=shuffle([correct,...pickN(d,3)]);return{q,o,a:o.indexOf(correct),e,_d:d.length,_raw:distract.length}}
    function esc(s){return String(s)}function norm(s){return String(s).toLowerCase().replace(/[.,!?;:'"]/g,'').replace(/\\s+/g,' ').trim()}
    const $=()=>({});let grade=5,P=null,GM=null;function toast(){}function hasOwn(){}`,ctx);
  return ctx;
}
function load(ctx,f){try{vm.runInContext(read(f).replace(/^﻿?'use strict';/,''),ctx,{filename:f});return true}catch(e){E('cu phap / loi khi nap',f,e.message);return false}}
const get=(ctx,name)=>{try{return vm.runInContext('typeof '+name+'==="undefined"?undefined:'+name,ctx)}catch(e){return undefined}};

/* ---------- 2) lop 4-12 ---------- */
(function(){
  const ctx=sandbox();if(!load(ctx,'js/chunks/grades.js'))return;
  const DATA=get(ctx,'DATA');if(!DATA){E('khong thay DATA trong js/chunks/grades.js');return}
  const norm=s=>String(s).toLowerCase().replace(/[.,!?;:'"]/g,'').replace(/\s+/g,' ').trim();
  for(const [g,d] of Object.entries(DATA)){
    for(const k of ['theory','quiz','readings','listenings','writing','topics'])
      if(!Array.isArray(d[k])||!d[k].length)E(`Lop ${g}: thieu muc "${k}" (mo muc nay tren web se loi)`);
    (d.quiz||[]).forEach((q,i)=>mcq(`Lop ${g} quiz[${i}]`,q.q,q.o,q.a,{needExplain:true,e:q.e}));
    (d.readings||[]).forEach((r,i)=>{const at=`Lop ${g} bai doc[${i}] "${r.title}"`;
      if(!txt(r.text))E('thieu noi dung bai doc',at);if(!(r.qs||[]).length)E('bai doc khong co cau hoi',at);
      (r.qs||[]).forEach((q,j)=>mcq(at+` cau ${j+1}`,q.q,q.o,q.a))});
    (d.listenings||[]).forEach((l,i)=>{const at=`Lop ${g} bai nghe[${i}] "${l.title}"`;
      if(!(l.script||[]).length)E('thieu script',at);if(!(l.trans||[]).length)E('thieu loi thoai (trans)',at);
      if(!(l.qs||[]).length)E('bai nghe khong co cau hoi',at);
      if(l.audio&&!fs.existsSync(path.join(ROOT,l.audio)))E('khong thay file audio',at,l.audio);
      (l.qs||[]).forEach((q,j)=>mcq(at+` cau ${j+1}`,q.q,q.o,q.a))});
    (d.writing||[]).forEach((w,i)=>{const at=`Lop ${g} bai viet[${i}]`;tot++;
      if(w.type==='order'){if(!Array.isArray(w.words)||w.words.length<3)E('order: thieu words',at)}
      else if(w.type==='gap'){if(!/_{2,}/.test(w.sent||''))E('gap: cau khong co cho trong ___',at);if(!txt(w.a))E('gap: thieu dap an',at)}
      else if(w.type==='write'){if(!Array.isArray(w.check)||!w.check.length)E('write: thieu check',at);
        else if(w.sample&&!w.check.some(c=>norm(w.sample).includes(norm(c))))E('write: cau mau khong qua duoc phan kiem tra (check)',at,w.sample)}
      else E('loai bai viet la: '+w.type,at)});
    (d.topics||[]).forEach(t=>{const at=`Lop ${g} chu de ${t.id}`;
      if(!Array.isArray(t.vocab)||t.vocab.length<4)E('chu de co duoi 4 tu (game can it nhat 4)',at);
      const s=new Set();(t.vocab||[]).forEach(v=>{tot++;if(!Array.isArray(v)||!txt(v[0])||!txt(v[1]))E('tu vung thieu nghia',at,JSON.stringify(v));
        const k=txt(v&&v[0]).toLowerCase();if(s.has(k))W('tu lap lai trong cung chu de',at,k);s.add(k)})});
  }
  /* bo sinh de ngau nhien: chay thu nhieu lan */
  const GENQ=get(ctx,'GENQ')||{};
  for(const [g,fns] of Object.entries(GENQ))fns.forEach((f,i)=>{for(let n=0;n<25;n++){let q;
    try{q=f(+g)}catch(e){E(`bo sinh quiz lop ${g} #${i} bi loi`,e.message);break}
    if(!q)continue;mcq(`bo sinh quiz lop ${g} #${i}`,q.q,q.o,q.a)}});
  const RBANK=get(ctx,'RBANK')||{};
  for(const [g,items] of Object.entries(RBANK))(items||[]).forEach((it,i)=>{const at=`kho bai doc/nghe ngau nhien lop ${g}[${i}] "${it.title}"`;
    if(!txt(it.text))E('thieu noi dung',at);if((it.qs||[]).length<3)E('can it nhat 3 cau hoi',at);
    (it.qs||[]).forEach((q,j)=>mcq(at+` cau ${j+1}`,q.q,q.o,q.a))});
  for(const g of Object.keys(DATA))for(let n=0;n<10;n++){
    try{const w=vm.runInContext(`genGap(${g})`,ctx);if(!w||!/_{2,}/.test(w.sent||'')||!txt(w.a))E('genGap lop '+g+' tra ve cau hong',JSON.stringify(w))}
    catch(e){E('genGap lop '+g+' bi loi',e.message);break}}
})();

/* ---------- 3) IELTS ---------- */
(function(){
  const ctx=sandbox();if(!load(ctx,'js/chunks/ielts.js'))return;
  const T=get(ctx,'IELTS_TOPICS')||[],PA=get(ctx,'IELTS_PARA')||[];
  if(!T.length)E('IELTS_TOPICS rong');
  T.forEach(t=>{const s=new Set();(t.words||[]).forEach(w=>{tot++;const at=`IELTS ${t.id}`;
    if(!Array.isArray(w)||!txt(w[0])||!txt(w[1]))E('tu IELTS thieu nghia',at,JSON.stringify(w));
    if(w[3]&&!/^(A1|A2|B1|B2|C1|C2)$/.test(w[3]))E('cap do CEFR la',at,w[0],w[3]);
    const k=txt(w[0]).toLowerCase();if(s.has(k))W('tu lap lai',at,k);s.add(k)})});
  PA.forEach(p=>{tot++;if(!txt(p.word)||!Array.isArray(p.syns)||p.syns.length<3)E('paraphrase can it nhat 3 tu dong nghia',p.word)});
})();

/* ---------- 4) On Ngu Phap ---------- */
(function(){
  const ctx=sandbox();if(!load(ctx,'js/chunks/grammar.js'))return;
  const T=get(ctx,'GRAMMAR_TOPICS')||[];if(!T.length)E('GRAMMAR_TOPICS rong');
  const ids=new Set();
  T.forEach(t=>{
    if(ids.has(t.id))E('trung id chuyen de',t.id);ids.add(t.id);
    if(!(t.qs||[]).length)E('chuyen de khong co cau hoi',t.id);
    (t.qs||[]).forEach((f,i)=>{const at=`ngu phap ${t.id} qs[${i}]`;let q;
      try{q=typeof f==='function'?f():f}catch(e){E('cau hoi bi loi khi tao',at,e.message);return}
      mcq(at,q.q,q.o,q.a);
      if(q._d!==undefined&&q._d<3)W('chi co '+q._d+' dap an nhieu (nen co 3)',at,JSON.stringify(q.q));
      if(q._raw!==undefined&&q._raw!==q._d)E('dap an nhieu trung nhau hoac trung dap an dung',at,JSON.stringify(q.q))});
    (t.more||[]).forEach((f,i)=>{const at=`ngu phap ${t.id} more[${i}]`;let q;tot++;
      try{q=typeof f==='function'?f():f}catch(e){E('cau hoi bi loi khi tao',at,e.message);return}
      if(q.t==='fill'){if(!txt(q.q)||!Array.isArray(q.ans)||!q.ans.length)E('fill: thieu q/ans',at)}
      else if(q.t==='order'){if(txt(q.sent).split(' ').length<3)E('order: cau qua ngan',at)}
      else if(q.t==='error'){if(!txt(q.sent)||!txt(q.wrong)||!txt(q.right))E('error: thieu sent/wrong/right',at);
        else if(!q.sent.includes(q.wrong))E('error: phan sai khong nam trong cau',at,q.wrong)}
      else if(q.t==='trans'){/* dich cau */}
      else if(q.o){mcq(at,q.q,q.o,q.a)}
      else E('loai cau hoi la: '+q.t,at)});
  });
})();

/* ---------- 5) Ngu Phap Master (grammar.html) ---------- */
(function(){
  let h;try{h=read('grammar.html')}catch(e){return}
  const a=h.indexOf('const GP_DATA=[]'),b=h.indexOf('let CUR=null');
  if(a<0||b<0){W('khong tach duoc GP_DATA trong grammar.html (bo qua)');return}
  let D;try{D=new Function(h.slice(a,b)+';return GP_DATA')()}catch(e){E('grammar.html: GP_DATA loi cu phap',e.message);return}
  const ids=new Set();
  D.forEach(t=>{if(ids.has(t.id))E('grammar.html: trung id',t.id);ids.add(t.id);
    const walk=(x,at)=>{if(Array.isArray(x))x.forEach((y,i)=>walk(y,at+'['+i+']'));
      else if(x&&typeof x==='object'){if(x.q!==undefined&&Array.isArray(x.o))mcq(at,x.q,x.o,x.a);else for(const [k,v] of Object.entries(x))walk(v,at+'.'+k)}};
    walk(t.qs,'Ngu Phap Master '+t.id)});
})();

/* ---------- 6) Word Strike 3D: data/ws-questions.js (WS_DATA) ---------- */
(function(){
  let src;try{src=read('data/ws-questions.js')}catch(e){E('khong doc duoc data/ws-questions.js');return}
  const win={};try{new Function('window',src)(win)}catch(e){E('cu phap data/ws-questions.js',e.message);return}
  const D=win.WS_DATA;if(!D||typeof D!=='object'){E('ws-questions.js: thieu window.WS_DATA');return}
  const dmg=(D.balance||{}).wrongDmg||{};
  for(const k of ['kids','toeic','ielts','order'])if(!(typeof dmg[k]==='number'&&dmg[k]>0))E('ws-questions.js: balance.wrongDmg.'+k+' phai la so duong',dmg[k]);
  const arr=(x,n)=>Array.isArray(x)&&x.length>=n;
  const noDupe=(at,o)=>{if(new Set(o.map(x=>txt(x).toLowerCase())).size!==o.length)E('lua chon trung nhau',at,JSON.stringify(o))};
  for(const lv of ['kids','toeic','ielts']){
    const T=(D.tracks||{})[lv];if(!T){E('ws-questions.js: thieu cap do',lv);continue}
    for(const ty of ['gap','vocab','spell','order','error','hard','voice']){
      const L=T[ty];if(!arr(L,3)){E('ws-questions.js: '+lv+'.'+ty+' can it nhat 3 cau');continue}
      const seen=new Set();
      L.forEach((q,i)=>{const at='ws '+lv+'.'+ty+'['+i+']';tot++;const key=JSON.stringify(q);if(seen.has(key))W('cau trung',at);seen.add(key);
        if(ty==='gap'||ty==='hard'){if(!(typeof q[0]==='string'&&q[0].includes('___')))E('thieu cho trong ___',at);
          if(!arr(q[2],3))E('can 3 dap an nhieu',at);else{if(q[2].includes(q[1]))E('dap an dung nam trong dap an nhieu',at);noDupe(at,[q[1],...q[2]])}
          if(!txt(q[3]))E('thieu loi giai (bat buoc voi gap/hard)',at)}
        else if(ty==='vocab'){if(!txt(q[0])||!txt(q[1]))E('thieu nghia/tu',at);if(!arr(q[2],3))E('can 3 dap an nhieu',at);else{if(q[2].includes(q[1]))E('dap an dung nam trong dap an nhieu',at);noDupe(at,[q[1],...q[2]])}}
        else if(ty==='spell'){if(!txt(q[0]))E('thieu tu',at);if(!arr(q[1],3))E('can 3 cach viet sai',at);else{if(q[1].includes(q[0]))E('cach viet sai trung tu dung',at);noDupe(at,[q[0],...q[1]])}}
        else if(ty==='order'){if(!arr(q[0],3)||q[0].some(w=>!txt(w)))E('cau xep qua ngan hoac co o rong',at);if(!txt(q[1]))E('thieu ban dich',at)}
        else if(ty==='error'){if(!arr(q[0],2)){E('thieu cac phan cua cau',at);return}
          if(!Number.isInteger(q[1])||q[1]<0||q[1]>=q[0].length)E('chi so phan sai nam ngoai cau',at);
          if(!txt(q[2]))E('thieu phan sua dung',at);else if(txt(q[2])===txt(q[0][q[1]]))E('phan sua giong phan sai',at);
          if(!txt(q[3]))E('thieu loi giai (bat buoc voi error)',at)}
        else if(ty==='voice'){if(!txt(q[0])||!txt(q[1]))E('thieu tu / nghia',at)}});
    }
    /* ban do (js/ws-maps.js) lay tu ghep chu tu day: can du 6 tu chi gom chu cai, dai tu 4 */
    const ok=(T.voice||[]).filter(w=>/^[a-z]{4,}$/i.test(w[0])).length;
    if(ok<6)E('ws-questions.js: '+lv+'.voice can it nhat 6 tu chi gom chu cai (>=4 ky tu) de ban do 6 ai co tu rieng',ok+' tu hop le');
  }
})();

/* ---------- 7) Word Strike 3D: data/ws-view.js (WS_VIEW, góc nhìn thứ 3) ---------- */
(function(){
  let src;try{src=read('data/ws-view.js')}catch(e){E('khong doc duoc data/ws-view.js');return}
  const win={};try{new Function('window',src)(win)}catch(e){E('cu phap data/ws-view.js',e.message);return}
  const V=win.WS_VIEW;if(!V||typeof V!=='object'){E('ws-view.js: thieu window.WS_VIEW');return}
  const R={distance:[2.2,4.5],shoulder:[0,1],height:[0,.8],blend:[.05,.4],minDist:[.5,1.5],fadeDist:[.8,2],recoil:[.05,.2]};
  for(const [k,[lo,hi]] of Object.entries(R)){tot++;
    if(typeof V[k]!=='number'||!isFinite(V[k]))E('ws-view.js: '+k+' phai la so',V[k]);
    else if(V[k]<lo||V[k]>hi)E('ws-view.js: '+k+' = '+V[k]+' ngoai khoang cho phep '+lo+' - '+hi)}
  if(typeof V.minDist==='number'&&typeof V.fadeDist==='number'&&V.fadeDist<=V.minDist)E('ws-view.js: fadeDist phai lon hon minDist');
})();

/* ---------- 8) Word Strike 3D: data/ws-outfits.js (WS_OUTFITS, trang phuc) ---------- */
(function(){
  let src;try{src=read('data/ws-outfits.js')}catch(e){E('khong doc duoc data/ws-outfits.js');return}
  const win={};try{new Function('window',src)(win)}catch(e){E('cu phap data/ws-outfits.js',e.message);return}
  const D=win.WS_OUTFITS;if(!D||typeof D!=='object'){E('ws-outfits.js: thieu window.WS_OUTFITS');return}
  const PIV={head:[0,1.45,0],torso:[0,1.1,0],armL:[-.4,1.42,0],armR:[.4,1.42,0],legL:[-.15,.78,0],legR:[.15,.78,0],back:[0,1.1,0]};   /* giong js/ws-avatar.js */
  const ATT={hat:['head'],body:['torso','armL','armR','legL','legR'],back:['back']},RARS=['common','rare','epic','legendary'];
  const HEX=/^#[0-9a-f]{6}$/i,FORBID=/^(hp|maxhp|speed|spd|dmg|damage|cd|cooldown|range|armor|energy|power|stat|stats|boost|bonus)$/i;
  const walk=(o,at)=>{if(o&&typeof o==='object')for(const k of Object.keys(o)){if(FORBID.test(k))E('ws-outfits.js: khoa chi so bi cam "'+k+'" (trang phuc chi doi ngoai hinh)',at);walk(o[k],at+'.'+k)}};walk(D,'WS_OUTFITS');
  for(const r of RARS){tot++;const o=(D.rarity||{})[r];if(!o){E('ws-outfits.js: thieu rarity.'+r);continue}
    if(!HEX.test(o.color||''))E('ws-outfits.js: rarity.'+r+'.color phai la #rrggbb');
    if(!Number.isInteger(o.price)||o.price<0)E('ws-outfits.js: rarity.'+r+'.price phai la so nguyen >= 0')}
  const sets=Array.isArray(D.sets)?D.sets:[];if(!sets.length){E('ws-outfits.js: sets rong');return}
  const ids=new Set();let defaults=0;const count={};
  sets.forEach((s,i)=>{tot++;const at='ws-outfits '+(s.id||'#'+i);
    if(!/^[a-z0-9_]+$/.test(s.id||''))E('id khong hop le',at);else if(ids.has(s.id))E('trung id',at);else ids.add(s.id);
    if(!RARS.includes(s.rarity))E('rarity la',at);else count[s.rarity]=(count[s.rarity]||0)+1;
    if(!txt(s.name))E('thieu name',at);if(!txt(s.icon))E('thieu icon',at);
    if(s.default){defaults++;if(s.rarity!=='common')E('bo mac dinh phai la common',at)}
    for(const sl of ['hat','body','back']){const L=s[sl];if(L==null)continue;
      if(!Array.isArray(L)||!L.length||L.length>14){E(sl+': can 1-14 hop',at);continue}
      L.forEach((b,j)=>{const bt=at+'.'+sl+'['+j+']';
        if(!Array.isArray(b)||b.length!==8){E('hop phai co 8 phan tu',bt);return}
        const [on,w,h,d,x,y,z,c]=b;if(!ATT[sl].includes(on)){E('on="'+on+'" khong hop le cho '+sl,bt);return}
        if(![w,h,d].every(v=>typeof v==='number'&&v>0&&v<=1.2))E('w,h,d phai trong (0,1.2]',bt);
        if(![x,y,z].every(v=>typeof v==='number'&&isFinite(v)))E('x,y,z phai la so',bt);
        if(!HEX.test(c||''))E('mau phai la #rrggbb',bt);
        const p=PIV[on];if([w,h,d,x,y,z].every(v=>typeof v==='number'&&isFinite(v))){
          if(Math.abs(p[0]+x)+w/2>1.2+1e-6||Math.abs(p[2]+z)+d/2>1.2+1e-6)E('vuot khung ngang +-1.2 m',bt);
          if(p[1]+y+h/2>2.6+1e-6)E('vuot chieu cao 2.6 m',bt);
          if(p[1]+y-h/2<-.05)E('chim duoi mat dat',bt)}})}
    if(s.trail!=null){const t=s.trail;if(!t||!HEX.test(t.color||'')||!['box','star','leaf','line'].includes(t.shape)||!(t.size>=.05&&t.size<=.3))E('trail: can {color,shape box|star|leaf|line,size 0.05-0.3}',at)}
    if(s.killfx!=null){const k=s.killfx;if(!k||!Array.isArray(k.colors)||k.colors.length<1||k.colors.length>3||!k.colors.every(c=>HEX.test(c))||!['burst','ring','rain','bolt'].includes(k.kind))E('killfx: can {colors 1-3 mau,kind burst|ring|rain|bolt}',at)}});
  if(defaults!==1)E('ws-outfits.js: can dung 1 bo mac dinh, dang co '+defaults);
  /* spec: 16 bo khoi dau = 4 Thuong, 4 Hiem, 5 Su thi, 3 Huyen thoai (them bo moi thi sua con so nay) */
  const want={common:4,rare:4,epic:5,legendary:3};for(const r of RARS)if((count[r]||0)<want[r])W('ws-outfits.js: do hiem '+r+' co '+(count[r]||0)+' bo, it hon bo khoi dau ('+want[r]+')');
})();

/* ---------- 9) Word Strike 3D: data/ws-gacha.js (WS_GACHA, vong quay Big Chance) + gia mua thang trong ws-outfits.js ---------- */
(function(){
  let src,osrc;try{src=read('data/ws-gacha.js');osrc=read('data/ws-outfits.js')}catch(e){E('khong doc duoc data/ws-gacha.js hoac ws-outfits.js');return}
  const win={},ow={};try{new Function('window',src)(win);new Function('window',osrc)(ow)}catch(e){E('cu phap data/ws-gacha.js',e.message);return}
  const D=win.WS_GACHA;if(!D||typeof D!=='object'){E('ws-gacha.js: thieu window.WS_GACHA');return}
  const R=['common','rare','epic','legendary'];tot++;
  const num=(k,lo,hi,int)=>{const v=D[k];if(typeof v!=='number'||!isFinite(v)||v<lo||v>hi||(int&&!Number.isInteger(v)))E('ws-gacha.js: '+k+' phai '+(int?'nguyen ':'')+'trong '+lo+' - '+hi+' (dang la '+v+')')};
  num('price',50,500,true);num('comboCount',5,10,true);num('comboDiscount',0,.3);num('dailyCap',5,50,true);num('pityAt',10,100,true);num('refundRate',0,.6);
  num('freeSpinPerDay',0,3,true);num('restNudgeAfter',5,20,true);num('freeQuestionMinReadSec',1,10);num('directMultiplier',1.5,3);
  if(typeof D.refundFreeSpin!=='boolean')E('ws-gacha.js: refundFreeSpin phai la true/false');
  const rt=D.rates||{};let sum=0;for(const r of R){if(typeof rt[r]!=='number'||rt[r]<0||rt[r]>1)E('ws-gacha.js: rates.'+r+' phai trong 0-1');else sum+=rt[r]}
  if(Math.abs(sum-1)>1e-6)E('ws-gacha.js: rates phai cong dung 1 (dang la '+sum+')');
  if(!(rt.legendary>0))E('ws-gacha.js: rates.legendary phai > 0');
  if(Math.round(D.refundRate*D.price)>=D.price)E('ws-gacha.js: tien hoan phai nho hon gia 1 luot (chong tao xu)');
  if(err)return;
  /* gia mua thang >= directMultiplier x ky vong chi de quay ra 1 bo (price / ti le hieu dung) – GDD F5 */
  const pL=rt.legendary,pe=pL/(1-Math.pow(1-pL,D.pityAt)),sh=(1-pe)/(1-pL),eff={common:rt.common*sh,rare:rt.rare*sh,epic:rt.epic*sh,legendary:pe};
  const O=ow.WS_OUTFITS;if(!O||!O.rarity)return;
  for(const r of R){tot++;const need=D.directMultiplier*D.price/eff[r],pr=O.rarity[r]&&O.rarity[r].price;
    if(pr<need-1e-9)E('ws-outfits.js: gia mua thang '+r+' = '+pr+' < '+need.toFixed(0)+' (= '+D.directMultiplier+' x ky vong quay) – vi pham quyet dinh "mua thang dat hon quay"')}
  const cnt={};(O.sets||[]).forEach(s=>{if(!s.default)cnt[s.rarity]=(cnt[s.rarity]||0)+1});
  for(const r of R)if(rt[r]>0&&!cnt[r])E('ws-gacha.js: do hiem '+r+' co ti le > 0 nhung khong co bo nao trong ws-outfits.js');
})();

/* ---------- 10) Word Strike 3D: data/ws-relay.js (WS_RELAY, che do MISSION + bo dam) ---------- */
(function(){
  let src;try{src=read('data/ws-relay.js')}catch(e){E('khong doc duoc data/ws-relay.js');return}
  const win={};try{new Function('window',src)(win)}catch(e){E('cu phap data/ws-relay.js',e.message);return}
  const D=win.WS_RELAY;if(!D||typeof D!=='object'){E('ws-relay.js: thieu window.WS_RELAY');return}
  tot++;const isN=v=>typeof v==='number'&&isFinite(v),rng=(o,k,lo,hi,int)=>{const v=o&&o[k];if(!isN(v)||v<lo||v>hi||(int&&!Number.isInteger(v)))E('ws-relay.js: '+k+' phai '+(int?'nguyen ':'')+'trong '+lo+'-'+hi+' (dang la '+v+')')};
  if(D.defaultMode!=='mission'&&D.defaultMode!=='holdout')E('ws-relay.js: defaultMode phai la mission hoac holdout');
  const r=D.relay||{};rng(r,'range',1.5,6);rng(r,'holdSec',.5,10);rng(r,'lockSec',3,60);rng(r,'coins',0,200,true);rng(r,'score',0,1000,true);rng(r,'hp',0,100,true);rng(r,'revealDist',8,60);
  if(!Array.isArray(r.counts)||r.counts.length!==6||!r.counts.every(n=>Number.isInteger(n)&&n>=2&&n<=5))E('ws-relay.js: relay.counts can 6 so nguyen 2-5');
  const pt=p=>p&&isN(p.x)&&isN(p.z)&&Math.abs(p.x)<=29&&Math.abs(p.z)<=29;
  if(!Array.isArray(D.spots)||D.spots.length!==6)E('ws-relay.js: spots can 6 ai');else D.spots.forEach((L,i)=>{tot++;if(!Array.isArray(L)||!L.every(pt))E('ws-relay.js: spots['+i+'] can cac diem {x,z} trong +-29');else if(Array.isArray(r.counts)&&L.length<r.counts[i])E('ws-relay.js: spots['+i+'] co '+L.length+' diem, can >= '+r.counts[i])});
  const x=D.extract||{};rng(x,'radius',3,12);rng(x,'holdSec',5,120);rng(x,'spawnEvery',.5,20);rng(x,'maxHostile',1,12,true);rng(x,'coins',0,300,true);
  if(!Array.isArray(x.points)||x.points.length!==6||!x.points.every(pt))E('ws-relay.js: extract.points can 6 diem trong +-29');
  if(Array.isArray(D.spots)&&Array.isArray(x.points)&&Array.isArray(r.counts))D.spots.forEach((L,i)=>{const e=x.points[i];if(!e||!Array.isArray(L))return;L.slice(0,r.counts[i]||0).forEach((p,k)=>{if(Math.hypot(p.x-e.x,p.z-e.z)<15)E('ws-relay.js: ai '+(i+1)+': diem rut lui cach Relay '+(k+1)+' chi '+Math.round(Math.hypot(p.x-e.x,p.z-e.z))+' m (can >= 15 m)')})});
  if(!D.alarm||!Array.isArray(D.alarm.hostiles)||D.alarm.hostiles.length!==6||!D.alarm.hostiles.every(n=>Number.isInteger(n)&&n>=1&&n<=8))E('ws-relay.js: alarm.hostiles can 6 so nguyen 1-8');
  if(!Array.isArray(D.locations)||D.locations.length!==6||!D.locations.every(l=>l&&l.en&&l.sub&&l.vi))E('ws-relay.js: locations can 6 muc {en,sub,vi}');
  const rd=D.radio;if(!rd){E('ws-relay.js: thieu radio');return}
  const OKPH=new Set(['n','dir','rel','dist','near','loc','sec','lock']),ROLES=['intro','relay','hold','ok','alarm','extract','extracting','done'],avg={};
  for(const k of ['N','NE','E','SE','S','SW','W','NW'])if(!rd.dirs||!rd.dirs[k]||!rd.dirs[k].en||!rd.dirs[k].vi)E('ws-relay.js: radio.dirs.'+k+' can en+vi');
  for(const k of ['ahead','right','behind','left'])if(!rd.rels||!rd.rels[k]||!rd.rels[k].en||!rd.rels[k].vi)E('ws-relay.js: radio.rels.'+k+' can en+vi');
  for(const l of ['kids','toeic','ielts'])for(const role of ROLES){tot++;const L=rd[l]&&rd[l][role];
    if(!Array.isArray(L)||!L.length||!L.every(m=>m&&typeof m.en==='string'&&m.en&&typeof m.vi==='string'&&m.vi)){E('ws-relay.js: radio.'+l+'.'+role+' can >= 1 muc {en,vi}');continue}
    for(const m of L)for(const t of [m.en,m.vi])for(const ph of t.matchAll(/\{(\w+)\}/g))if(!OKPH.has(ph[1]))E('ws-relay.js: radio.'+l+'.'+role+' co cho trong la {'+ph[1]+'}');
    if(role==='relay'){for(const m of L)if(!m.en.includes('{dir}')||!m.vi.includes('{dir}'))E('ws-relay.js: radio.'+l+'.relay phai co {dir} (cau lenh phai noi huong di)');
      avg[l]=L.reduce((a,m)=>a+m.en.length,0)/L.length}}
  if(avg.kids&&avg.toeic&&avg.ielts&&!(avg.kids<avg.toeic&&avg.toeic<avg.ielts))E('ws-relay.js: cau lenh Relay phai dai dan KIDS < TOEIC < IELTS (dang la '+Math.round(avg.kids)+' / '+Math.round(avg.toeic)+' / '+Math.round(avg.ielts)+' ky tu)');
})();


/* ---------- 11) Word Strike 3D: data/ws-combat.js (WS_COMBAT, quai GULL/HOUND/HEAVY + bang dan + nap nhanh) ---------- */
(function(){
  let src;try{src=read('data/ws-combat.js')}catch(e){E('khong doc duoc data/ws-combat.js');return}
  const win={};try{new Function('window',src)(win)}catch(e){E('cu phap data/ws-combat.js',e.message);return}
  const D=win.WS_COMBAT;if(!D||typeof D!=='object'){E('ws-combat.js: thieu window.WS_COMBAT');return}
  tot++;const isN=v=>typeof v==='number'&&isFinite(v),rng=(o,k,lo,hi,at)=>{const v=o&&o[k];if(!isN(v)||v<lo||v>hi)E('ws-combat.js: '+(at||'')+k+' phai trong '+lo+'-'+hi+' (dang la '+v+')')};
  const K=D.kinds||{};
  for(const k of ['gull','hound','heavy']){tot++;const o=K[k];if(!o){E('ws-combat.js: thieu kinds.'+k);continue}const at='kinds.'+k+'.';rng(o,'s',.5,2,at);rng(o,'hp',1,6,at);rng(o,'spd',.3,3,at);rng(o,'dmg',1,40,at);rng(o,'tele',.5,2.5,at)}
  if(K.gull){rng(K.gull,'hover',1.5,6,'kinds.gull.');rng(K.gull,'range',12,50,'kinds.gull.');rng(K.gull,'bullet',6,30,'kinds.gull.');if(!Array.isArray(K.gull.shotEvery)||K.gull.shotEvery.length!==2||!(K.gull.shotEvery[0]>=1.5)||!(K.gull.shotEvery[1]>=K.gull.shotEvery[0]))E('ws-combat.js: kinds.gull.shotEvery = [nhanh, cham], nhanh >= 1.5 giay')}
  if(K.hound){rng(K.hound,'lungeRange',4,16,'kinds.hound.');rng(K.hound,'lungeSpeed',6,24,'kinds.hound.');rng(K.hound,'lungeTime',.2,1,'kinds.hound.')}
  if(K.heavy){rng(K.heavy,'slamRange',2.5,8,'kinds.heavy.');rng(K.heavy,'slamCd',2,15,'kinds.heavy.')}
  /* moi ky nang quai PHAI co bao truoc >= 0.8 giay (quy tac Saltline Ops) */
  for(const k of ['gull','hound','heavy'])if(K[k]&&isN(K[k].tele)&&K[k].tele<.8)E('ws-combat.js: kinds.'+k+'.tele = '+K[k].tele+' < 0.8 giay (ky nang quai phai co bao truoc >= 0.8 giay)');
  const KNOWN=['grunt','runner','tank','shooter','gull','hound','heavy'];
  const wts=(o,at)=>{tot++;if(!o||typeof o!=='object'){E('ws-combat.js: '+at+' phai la bang trong so');return}let s=0;for(const k in o){if(!KNOWN.includes(k))E('ws-combat.js: '+at+': loai quai la "'+k+'"');if(!isN(o[k])||o[k]<0)E('ws-combat.js: '+at+'.'+k+' phai >= 0');else s+=o[k]}if(!(s>0))E('ws-combat.js: '+at+' phai co it nhat 1 trong so > 0')};
  for(const t of ['gap','vocab','spell','order','error','hard'])wts(D.carrier&&D.carrier[t],'carrier.'+t);
  wts(D.hostile,'hostile');
  if(!Array.isArray(D.mag)||D.mag.length!==4||!D.mag.every(n=>Number.isInteger(n)&&n>=1&&n<=100))E('ws-combat.js: mag can 4 so nguyen 1-100');
  if(!Array.isArray(D.reload)||D.reload.length!==4||!D.reload.every(n=>isN(n)&&n>=.8&&n<=12))E('ws-combat.js: reload can 4 so 0,8-12 giay');
  const q=D.quick||{};rng(q,'sec',2,10,'quick.');rng(q,'choices',2,4,'quick.');
  if(!Array.isArray(q.types)||!q.types.length||!q.types.every(t=>['vocab','spell','gap','error'].includes(t)))E('ws-combat.js: quick.types chi gom vocab/spell/gap/error');
})();

/* ---------- 12) Word Strike 3D: data/ws-port.js (WS_PORT, 6 khu cang) – khop voi thanh dia diem cua ws-relay.js ---------- */
(function(){
  let src,rsrc;try{src=read('data/ws-port.js');rsrc=read('data/ws-relay.js')}catch(e){E('khong doc duoc data/ws-port.js hoac ws-relay.js');return}
  const win={},rw={};try{new Function('window',src)(win);new Function('window',rsrc)(rw)}catch(e){E('cu phap data/ws-port.js',e.message);return}
  const D=win.WS_PORT;if(!D||!Array.isArray(D.zones)||D.zones.length!==6){E('ws-port.js: zones can dung 6 khu');return}
  const HEXS=/^#[0-9a-f]{6}$/i,isN=v=>typeof v==='number'&&isFinite(v),LOC=(rw.WS_RELAY&&rw.WS_RELAY.locations)||[];
  D.zones.forEach((z,i)=>{tot++;const at='ws-port.js zones['+i+'] ';
    if(typeof z.name!=='string'||!z.name||z.name.length>18)E(at+'name la chu 1-18 ky tu');
    if(!z.sub||!z.vi)E(at+'thieu sub / vi');
    const th=z.th||{};if(!HEXS.test(th.floor||'')||!HEXS.test(th.stud||''))E(at+'th.floor / th.stud phai la #rrggbb');
    if(!Array.isArray(th.sky)||th.sky.length!==4||!th.sky.every(c=>HEXS.test(c)))E(at+'th.sky can 4 mau #rrggbb');
    for(const k of ['fog','wall','trim'])if(!Number.isInteger(th[k])||th[k]<0||th[k]>0xffffff)E(at+'th.'+k+' phai la so mau');
    if(!Array.isArray(th.pal)||th.pal.length!==5)E(at+'th.pal can 5 mau');
    if(!Array.isArray(z.fog)||z.fog.length!==2||!(z.fog[0]>=5)||!(z.fog[1]>z.fog[0])||z.fog[1]>300)E(at+'fog = [gan >= 5, xa > gan, <= 300]');
    const s=z.stacks||{};if(!Number.isInteger(s.count)||s.count<3||s.count>16)E(at+'stacks.count nguyen 3-16');
    if(!Array.isArray(s.lv)||!s.lv.every(n=>Number.isInteger(n)&&n>=1&&n<=3)||s.lv[0]>s.lv[1])E(at+'stacks.lv = [thap, cao] trong 1-3');
    if(!Array.isArray(s.long)||!s.long.every(n=>Number.isInteger(n)&&n>=1&&n<=2)||s.long[0]>s.long[1])E(at+'stacks.long = [it, nhieu] trong 1-2');
    if(!isN(s.minR)||s.minR<8||!isN(s.maxR)||s.maxR>27||s.minR>=s.maxR)E(at+'stacks.minR >= 8 (tam 8 m dau phai trong), maxR <= 27');
    const l=z.lamps||{};if(!isN(l.every)||l.every<6||l.every>40)E(at+'lamps.every 6-40');
    if(typeof z.gantry!=='boolean')E(at+'gantry phai la true/false');
    if(![null,'water','ship','lighthouse'].includes(z.extra===undefined?undefined:z.extra))E(at+'extra phai la water/ship/lighthouse/null');
    const L=LOC[i];if(!L||L.en!==String(z.name).toUpperCase()||L.sub!==z.sub)E(at+'ten/dia diem phai khop ws-relay.js locations['+i+'] (dang la '+(L&&L.en)+' / '+(L&&L.sub)+')')});
})();

console.log(`\n${tot} muc da kiem tra — ${err} loi, ${warn} canh bao`);process.exit(err?1:0);
