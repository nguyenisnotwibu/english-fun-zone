// Kiem tra TOAN BO du lieu truoc khi deploy:   node tools/check-data.js     (exit 1 neu co LOI)
//   1) data/*.js            - de HSA / THPT
//   2) js/chunks/grades.js  - du lieu lop 4-12 (quiz, bai doc, bai nghe, bai viet, tu vung) + bo sinh de ngau nhien
//   3) js/chunks/ielts.js   - tu vung & paraphrase IELTS
//   4) js/chunks/grammar.js - chuyen de On Ngu Phap
//   5) grammar.html         - Ngu Phap Master (GP_DATA)
//   6) data/ws-questions.js - ngan hang cau hoi + sat thuong khi sai cua Word Strike 3D (WS_DATA)
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

console.log(`\n${tot} muc da kiem tra — ${err} loi, ${warn} canh bao`);process.exit(err?1:0);
