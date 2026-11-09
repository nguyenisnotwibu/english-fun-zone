// Kiem tra du lieu de thi: node tools/check-data.js   (exit 1 neu co loi nghiem trong)
const fs=require('fs'),path=require('path');
global.window={};
const dir=path.join(__dirname,'..','data');
let err=0,warn=0,tot=0;const seen=new Map();
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort()){
  try{new Function('window',fs.readFileSync(path.join(dir,f),'utf8'))(global.window)}catch(e){console.log('LOI cu phap',f,e.message);err++}
}
for(const [key,sets] of Object.entries(window.EFZ_DATA||{})){
  sets.forEach((s,si)=>(s.questions||[]).forEach((q,qi)=>{
    tot++;const at=`${key}[${si}].q${q.num||qi}`;
    if(!Array.isArray(q.opts)||q.opts.length<2){console.log('LOI thieu opts',at);err++;return}
    if(!Number.isInteger(q.ans)||q.ans<0||q.ans>=q.opts.length){console.log('LOI ans sai',at);err++}
    if(new Set(q.opts.map(o=>String(o).trim().toLowerCase())).size!==q.opts.length){console.log('LOI dap an trung nhau',at,JSON.stringify(q.opts));err++}
    if(!q.explain){console.log('CANH BAO thieu loi giai',at);warn++}
    const k=key+'|'+(q.text||'').replace(/\s+/g,' ').trim()+'|'+q.opts.join('|');
    if(q.text&&seen.has(k)){console.log('CANH BAO cau trung',at,'= '+seen.get(k));warn++}else seen.set(k,at);
  }));
}
console.log(`\n${tot} cau, ${err} loi, ${warn} canh bao`);process.exit(err?1:0);
