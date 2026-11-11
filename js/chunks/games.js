'use strict';
/* English Fun Zone — Đua vàng, Cờ vua, 4 kỹ năng, Memory, Hangman, Speed, Scramble.
   File này được js/app.js tải KHI CẦN (xem EFZ_CHUNKS). Sửa nội dung ở đây, không cần đụng app.js. */
/* ================= 🏆 GOLD QUEST ================= */
function startGold(){GM={type:'gold',gold:0,bot:0,round:0,goal:400};sndClick();goldNext();}
function goldNext(){
  if(!GM||GM.type!=='gold')return;
  if(GM.gold>=GM.goal||GM.bot>=GM.goal||GM.round>=14)return goldEnd();
  GM.round++;const q=vGenQ(poolVocab());GM.cur=q;
  $('gamesCard').innerHTML=gameTop('🏆 Đua vàng','<span class="streak">Vòng '+GM.round+'</span>')+
    `<div class="goldbar"><div class="goldcol">🙂 Bạn<b id="gYou">${GM.gold}</b>💰</div><div class="goldcol bot">🤖 Máy<b id="gBot">${GM.bot}</b>💰</div></div>
     <div style="text-align:center;font-size:12px;color:var(--muted);font-weight:600;margin:2px 0 6px">Về đích ${GM.goal}💰 trước máy nhé! Trả lời đúng để mở rương.</div>
     ${q.prompt}
     ${optButtons(q.opts,'goldAnswer')}
     <div id="goldChests"></div>`;
}
function goldAnswer(k){
  if(!GM||GM.type!=='gold')return;
  document.querySelectorAll('#gamesCard .opt').forEach((b,j)=>{b.disabled=true;if(GM.cur.opts[j].ok)b.classList.add('right');else if(j===k)b.classList.add('wrong')});
  if(GM.cur.opts[k].ok){sndOK();P.correct++;persist();
    $('goldChests').innerHTML='<div style="text-align:center;font-weight:800;margin-top:8px;color:#d97706">Đúng rồi! Chọn 1 rương 👇</div><div class="chest-row">'+[0,1,2].map(i=>`<button class="chest" onclick="goldOpen(${i})">🎁</button>`).join('')+'</div>';}
  else{sndNo();toast('😅 Sai rồi, mất lượt mở rương!');setTimeout(goldBotTurn,800);}
}
function goldOpen(i){
  document.querySelectorAll('.chest').forEach(c=>c.classList.add('opened'));
  const roll=Math.random(),amt=rnd([30,50,70,90,110]);let msg;
  if(roll<.15){const steal=Math.min(GM.bot,60);GM.bot-=steal;GM.gold+=steal;msg='🦹 Cướp '+steal+'💰 từ máy!';}
  else if(roll<.27){const lose=Math.floor(GM.gold*.3);GM.gold-=lose;msg='💀 Rương rỗng! Mất '+lose+'💰';}
  else if(roll<.4){GM.gold+=amt*2;msg='✨ Rương ĐÔI! +'+(amt*2)+'💰';}
  else{GM.gold+=amt;msg='💰 +'+amt+' vàng!';}
  gainXP(3);const chest=document.querySelectorAll('.chest')[i];if(chest)chest.textContent='💰';toast(msg);
  setTimeout(goldBotTurn,950);
}
function goldBotTurn(){
  GM.bot+=20+Math.floor(Math.random()*45);
  const gy=$('gYou'),gb=$('gBot');if(gy)gy.textContent=Math.max(0,GM.gold);if(gb)gb.textContent=GM.bot;persist();
  setTimeout(goldNext,500);
}
function goldEnd(){
  const realWin=GM.gold>=GM.bot,xp=Math.floor(Math.max(0,GM.gold)/15)+(realWin?20:0);if(realWin){confetti(100);sndWin()}P.gameWins++;persist();checkBadges();
  $('gamesCard').innerHTML=gameTop('🏆 Đua vàng')+`<div class="result"><div class="face">${realWin?'🏆':'🤖'}</div><h3>${realWin?'Bạn thắng máy!':'Máy thắng rồi, thử lại nhé!'}</h3><div class="scoreline">Bạn: <b>${Math.max(0,GM.gold)}</b>💰 · Máy: <b>${GM.bot}</b>💰 · ⭐ +${xp} XP</div><div class="row" style="justify-content:center"><button class="btn" onclick="startGold()">🔄 Chơi lại</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`;
}
/* ==========================================================
   ♟️ CỜ VUA HỌC TIẾNG ANH — chơi cờ với máy, trả lời câu hỏi
   để ĐI LẠI khi bị ăn quân và để xem GỢI Ý nước tốt.
   ========================================================== */
const CH_LV=[
 {id:1,em:'🐣',nm:'Gà con',tag:'Rất dễ',col:'#16a34a',col2:'#4ade80',undo:99,hint:99,need:1,strict:false,desc:'Bot đi lung tung · đi lại & gợi ý không giới hạn'},
 {id:2,em:'🐰',nm:'Thỏ trắng',tag:'Dễ',col:'#65a30d',col2:'#a3e635',undo:8,hint:8,need:1,strict:false,desc:'Bot biết ăn quân · 8 lần đi lại · 8 gợi ý'},
 {id:3,em:'🦊',nm:'Cáo tinh ranh',tag:'Vừa',col:'#d97706',col2:'#fbbf24',undo:5,hint:4,need:1,strict:true,desc:'Bot nhìn trước 2 nước · trả lời sai là mất lượt'},
 {id:4,em:'🦁',nm:'Sư tử',tag:'Khó',col:'#dc2626',col2:'#fb7185',undo:3,hint:2,need:2,strict:true,desc:'Bot nhìn trước 3 nước · phải đúng 2 câu liên tiếp'},
 {id:5,em:'🐉',nm:'Rồng lửa',tag:'Siêu khó',col:'#7c3aed',col2:'#c084fc',undo:2,hint:1,need:2,strict:true,desc:'Bot rất mạnh · 2 câu, có câu phải gõ chữ'}
];
const CHN={p:'Pawn',n:'Knight',b:'Bishop',r:'Rook',q:'Queen',k:'King'};
const CHV={p:'Tốt',n:'Mã',b:'Tượng',r:'Xe',q:'Hậu',k:'Vua'};
const CHG={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
const CHHOW={p:'Đi thẳng 1 ô (nước đầu được đi 2 ô). Ăn quân theo đường chéo. Đi tới cuối bàn thì thành Hậu!',
 n:'Đi hình chữ L (2 ô + 1 ô rẽ ngang). Nhảy qua được quân khác.',
 b:'Đi chéo, bao nhiêu ô cũng được. Không nhảy qua quân khác.',
 r:'Đi thẳng ngang hoặc dọc, bao nhiêu ô cũng được.',
 q:'Đi mọi hướng: ngang, dọc, chéo. Quân mạnh nhất!',
 k:'Đi 1 ô theo mọi hướng. Vua bị chiếu hết là thua – hãy bảo vệ Vua!'};
const CH_VOCAB=[['king','quân vua'],['queen','quân hậu, nữ hoàng'],['rook','quân xe'],['bishop','quân tượng'],['knight','quân mã, hiệp sĩ'],['pawn','quân tốt'],
 ['checkmate','chiếu hết'],['board','bàn cờ'],['move','nước đi, di chuyển'],['capture','bắt, ăn (quân)'],['win','thắng'],['lose','thua'],['draw','hoà'],
 ['square','ô vuông'],['attack','tấn công'],['defend','phòng thủ, bảo vệ'],['player','người chơi'],['turn','lượt đi']];
/* --- engine cờ: bọc trong 1 hàm để chạy được cả ở luồng chính lẫn Web Worker (bot nghĩ không làm đơ trang) --- */
function chEngine(){
const CHVAL={p:100,n:320,b:330,r:500,q:900,k:0};
const CHPST={
 p:[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
 n:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
 b:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
 r:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
 q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
 k:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20],
 ke:[-50,-40,-30,-20,-20,-30,-40,-50,-30,-20,-10,0,0,-10,-20,-30,-30,-10,20,30,30,20,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,20,30,30,20,-10,-30,-30,-30,0,0,0,0,-30,-30,-50,-30,-30,-30,-30,-30,-30,-50]
};
const CH_NO=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
const CH_KO=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const CH_BD=[[-1,-1],[-1,1],[1,-1],[1,1]],CH_RD=[[-1,0],[1,0],[0,-1],[0,1]];
function chCol(p){return p?(p<'a'?'w':'b'):''}
function chSqName(s){return 'abcdefgh'[s&7]+(8-(s>>3))}
function chInit(){return{b:'rnbqkbnrpppppppp'.split('').concat(Array(32).fill(''),'PPPPPPPPRNBQKBNR'.split('')),t:'w',c:'KQkq',ep:-1}}
function chClone(S){return{b:S.b.slice(),t:S.t,c:S.c,ep:S.ep}}
function chAtt(B,sq,by){
  const r=sq>>3,f=sq&7,up=by==='w';
  const P=up?'P':'p',N=up?'N':'n',K=up?'K':'k',Bs=up?'B':'b',R=up?'R':'r',Q=up?'Q':'q';
  const pr=up?r+1:r-1;
  if(pr>=0&&pr<8){if(f>0&&B[pr*8+f-1]===P)return true;if(f<7&&B[pr*8+f+1]===P)return true}
  for(const[dr,df]of CH_NO){const r1=r+dr,f1=f+df;if(r1>=0&&r1<8&&f1>=0&&f1<8&&B[r1*8+f1]===N)return true}
  for(const[dr,df]of CH_KO){const r1=r+dr,f1=f+df;if(r1>=0&&r1<8&&f1>=0&&f1<8&&B[r1*8+f1]===K)return true}
  for(const[dr,df]of CH_BD){let r1=r+dr,f1=f+df;while(r1>=0&&r1<8&&f1>=0&&f1<8){const x=B[r1*8+f1];if(x){if(x===Bs||x===Q)return true;break}r1+=dr;f1+=df}}
  for(const[dr,df]of CH_RD){let r1=r+dr,f1=f+df;while(r1>=0&&r1<8&&f1>=0&&f1<8){const x=B[r1*8+f1];if(x){if(x===R||x===Q)return true;break}r1+=dr;f1+=df}}
  return false;
}
function chInCheck(S,col){const k=S.b.indexOf(col==='w'?'K':'k');return k<0?false:chAtt(S.b,k,col==='w'?'b':'w')}
function chGen(S,capsOnly){
  const mv=[],B=S.b,me=S.t,opp=me==='w'?'b':'w';
  for(let s=0;s<64;s++){
    const p=B[s];if(!p||chCol(p)!==me)continue;
    const r=s>>3,f=s&7,t=p.toLowerCase();
    if(t==='p'){
      const d=me==='w'?-1:1,r1=r+d,last=me==='w'?0:7,pq=me==='w'?'Q':'q';
      if(r1<0||r1>7)continue;
      const one=r1*8+f;
      if(!B[one]&&(!capsOnly||r1===last)){
        mv.push({f:s,t:one,p,c:'',fl:'',pr:r1===last?pq:''});
        const st=me==='w'?6:1;
        if(!capsOnly&&r===st&&!B[(r+2*d)*8+f])mv.push({f:s,t:(r+2*d)*8+f,p,c:'',fl:'dbl',pr:''});
      }
      for(const df of[-1,1]){const f1=f+df;if(f1<0||f1>7)continue;const to=r1*8+f1;
        if(B[to]&&chCol(B[to])===opp)mv.push({f:s,t:to,p,c:B[to],fl:'',pr:r1===last?pq:''});
        else if(to===S.ep)mv.push({f:s,t:to,p,c:me==='w'?'p':'P',fl:'ep',pr:''});}
    }else if(t==='n'||t==='k'){
      for(const[dr,df]of(t==='n'?CH_NO:CH_KO)){const r1=r+dr,f1=f+df;if(r1<0||r1>7||f1<0||f1>7)continue;const to=r1*8+f1,x=B[to];
        if(x&&chCol(x)===me)continue;if(capsOnly&&!x)continue;mv.push({f:s,t:to,p,c:x,fl:'',pr:''})}
      if(t==='k'&&!capsOnly){
        if(me==='w'&&s===60){
          if(S.c.includes('K')&&!B[61]&&!B[62]&&B[63]==='R'&&!chAtt(B,60,'b')&&!chAtt(B,61,'b')&&!chAtt(B,62,'b'))mv.push({f:60,t:62,p,c:'',fl:'ck',pr:''});
          if(S.c.includes('Q')&&!B[59]&&!B[58]&&!B[57]&&B[56]==='R'&&!chAtt(B,60,'b')&&!chAtt(B,59,'b')&&!chAtt(B,58,'b'))mv.push({f:60,t:58,p,c:'',fl:'cq',pr:''});
        }
        if(me==='b'&&s===4){
          if(S.c.includes('k')&&!B[5]&&!B[6]&&B[7]==='r'&&!chAtt(B,4,'w')&&!chAtt(B,5,'w')&&!chAtt(B,6,'w'))mv.push({f:4,t:6,p,c:'',fl:'ck',pr:''});
          if(S.c.includes('q')&&!B[3]&&!B[2]&&!B[1]&&B[0]==='r'&&!chAtt(B,4,'w')&&!chAtt(B,3,'w')&&!chAtt(B,2,'w'))mv.push({f:4,t:2,p,c:'',fl:'cq',pr:''});
        }
      }
    }else{
      const dirs=t==='b'?CH_BD:t==='r'?CH_RD:CH_BD.concat(CH_RD);
      for(const[dr,df]of dirs){let r1=r+dr,f1=f+df;
        while(r1>=0&&r1<8&&f1>=0&&f1<8){const to=r1*8+f1,x=B[to];
          if(x){if(chCol(x)!==me)mv.push({f:s,t:to,p,c:x,fl:'',pr:''});break}
          if(!capsOnly)mv.push({f:s,t:to,p,c:'',fl:'',pr:''});
          r1+=dr;f1+=df}}
    }
  }
  return mv;
}
function chMake(S,m){
  const B=S.b,u={m,c:S.c,ep:S.ep};
  B[m.t]=m.pr||m.p;B[m.f]='';
  if(m.fl==='ep')B[m.t+(S.t==='w'?8:-8)]='';
  else if(m.fl==='ck'){if(S.t==='w'){B[61]='R';B[63]=''}else{B[5]='r';B[7]=''}}
  else if(m.fl==='cq'){if(S.t==='w'){B[59]='R';B[56]=''}else{B[3]='r';B[0]=''}}
  S.ep=m.fl==='dbl'?(m.f+m.t)/2:-1;
  let c=S.c;
  if(c){
    if(m.p==='K')c=c.replace('K','').replace('Q','');
    if(m.p==='k')c=c.replace('k','').replace('q','');
    if(m.f===63||m.t===63)c=c.replace('K','');if(m.f===56||m.t===56)c=c.replace('Q','');
    if(m.f===7||m.t===7)c=c.replace('k','');if(m.f===0||m.t===0)c=c.replace('q','');
  }
  S.c=c;S.t=S.t==='w'?'b':'w';
  return u;
}
function chUnmake(S,u){
  const m=u.m,B=S.b;S.t=S.t==='w'?'b':'w';
  B[m.f]=m.p;
  if(m.fl==='ep'){B[m.t]='';B[m.t+(S.t==='w'?8:-8)]=m.c}else B[m.t]=m.c;
  if(m.fl==='ck'){if(S.t==='w'){B[63]='R';B[61]=''}else{B[7]='r';B[5]=''}}
  else if(m.fl==='cq'){if(S.t==='w'){B[56]='R';B[59]=''}else{B[0]='r';B[3]=''}}
  S.c=u.c;S.ep=u.ep;
}
function chLegal(S,capsOnly){
  const me=S.t,out=[];
  for(const m of chGen(S,capsOnly)){const u=chMake(S,m);if(!chInCheck(S,me))out.push(m);chUnmake(S,u)}
  return out;
}
function chEval(S){
  const B=S.b;let sc=0,nonPawn=0;
  for(let s=0;s<64;s++){const p=B[s];if(p&&p.toLowerCase()!=='p'&&p.toLowerCase()!=='k')nonPawn+=CHVAL[p.toLowerCase()]}
  const endg=nonPawn<=1600;
  for(let s=0;s<64;s++){const p=B[s];if(!p)continue;const t=p.toLowerCase(),w=p<'a';
    const tb=t==='k'&&endg?CHPST.ke:CHPST[t];
    const v=CHVAL[t]+tb[w?s:(s^56)];sc+=w?v:-v}
  return S.t==='w'?sc:-sc;
}
function chOrder(ms){
  for(const m of ms)m.o=(m.c?10*CHVAL[m.c.toLowerCase()]-CHVAL[m.p.toLowerCase()]/10+1000:0)+(m.pr?800:0);
  return ms.sort((a,b)=>b.o-a.o);
}
let CH_NODES=0,CH_DEAD=0;
function chQS(S,a,b,qd){
  if((++CH_NODES&2047)===0&&Date.now()>CH_DEAD)throw 'T';
  const st=chEval(S);if(st>=b)return b;if(st>a)a=st;if(qd>5)return a;
  for(const m of chOrder(chLegal(S,true))){const u=chMake(S,m);const v=-chQS(S,-b,-a,qd+1);chUnmake(S,u);
    if(v>=b)return b;if(v>a)a=v}
  return a;
}
function chAB(S,d,a,b,ply,q){
  if((++CH_NODES&2047)===0&&Date.now()>CH_DEAD)throw 'T';
  const ms=chLegal(S);
  if(!ms.length)return chInCheck(S,S.t)?-100000+ply:0;
  if(d<=0)return q?chQS(S,a,b,0):chEval(S);
  for(const m of chOrder(ms)){const u=chMake(S,m);const v=-chAB(S,d-1,-b,-a,ply+1,q);chUnmake(S,u);
    if(v>=b)return b;if(v>a)a=v}
  return a;
}
/* tìm nước tốt nhất: đào sâu dần, có giới hạn thời gian */
function chBest(S0,maxD,q,noise,ms){
  const S=chClone(S0);let moves=chOrder(chLegal(S));if(!moves.length)return null;
  CH_DEAD=Date.now()+(ms||1500);CH_NODES=0;
  let best=moves[0],scores=null;
  for(let d=1;d<=maxD;d++){
    const sc=new Map();let a=-1e9;
    try{
      for(const m of moves){const u=chMake(S,m);let v;try{v=-chAB(S,d-1,-1e9,-a+(noise||0)+1,1,q)}finally{chUnmake(S,u)}
        sc.set(m,v);if(v>a)a=v}
    }catch(e){if(e==='T')break;throw e}
    scores=sc;
    moves=moves.slice().sort((x,y)=>sc.get(y)-sc.get(x));best=moves[0];
    if(sc.get(best)>90000)break;
  }
  if(noise&&scores){
    let bv=-1e9;for(const m of moves){const v=(scores.get(m)??-1e9)+Math.random()*noise;if(v>bv){bv=v;best=m}}
  }
  return best;
}
function chBotMove(S,lv){
  const ms=chLegal(S);if(!ms.length)return null;
  if(lv===1){
    if(Math.random()<.6)return ms[Math.floor(Math.random()*ms.length)];
    return chBest(S,1,false,250,400);
  }
  if(lv===2)return chBest(S,1,false,120,500);
  if(lv===3)return chBest(S,2,true,40,1200);
  if(lv===4)return chBest(S,3,true,12,2000);
  return chBest(S,4,true,0,2600);
}


return{chCol,chSqName,chInit,chClone,chAtt,chInCheck,chGen,chMake,chUnmake,chLegal,chEval,chBest,chBotMove};
}
const {chCol,chSqName,chInit,chClone,chAtt,chInCheck,chGen,chMake,chUnmake,chLegal,chEval,chBest,chBotMove}=chEngine();
let CH_W=null,CH_WID=0;const CH_WQ={};
function chAISync(d){return d.kind==='hint'?chBest(d.S,3,true,0,1500):chBotMove(d.S,d.lv)}
/* gọi AI bất đồng bộ qua Worker; nếu trình duyệt không cho Worker thì chạy thường */
function chAI(d,cb){
  if(CH_W===null){
    try{
      const src='const E=('+chEngine.toString()+')();onmessage=function(e){var d=e.data,m=null;try{m=d.kind==="hint"?E.chBest(d.S,3,true,0,1500):E.chBotMove(d.S,d.lv)}catch(x){}postMessage({id:d.id,m:m})}';
      CH_W=new Worker(URL.createObjectURL(new Blob([src],{type:'text/javascript'})));
      CH_W.onmessage=ev=>{const q=CH_WQ[ev.data.id];if(!q)return;delete CH_WQ[ev.data.id];q.cb(ev.data.m)};
      CH_W.onerror=()=>{CH_W=false;for(const k of Object.keys(CH_WQ)){const q=CH_WQ[k];delete CH_WQ[k];setTimeout(()=>q.cb(chAISync(q.d)),20)}};
    }catch(x){CH_W=false}
  }
  if(!CH_W){setTimeout(()=>cb(chAISync(d)),30);return}
  const id=++CH_WID;d.id=id;CH_WQ[id]={d,cb};CH_W.postMessage(d);
}
/* ---------- trạng thái + lưu thành tích ---------- */
let CH=null,CH_RUN=0;
function chStatsKey(){return 'efz_chess_'+((P&&P.name)||'guest')}
function chStats(){try{return JSON.parse(localStorage.getItem(chStatsKey()))||{}}catch(e){return{}}}
function chSaveWin(lv){try{const d=chStats();d[lv]=(d[lv]||0)+1;localStorage.setItem(chStatsKey(),JSON.stringify(d))}catch(e){}}
let CH_COLOR='w';
const CH_GATE='auto'; // luôn tự động: 4 → 3 → 2 nước/câu theo số quân còn lại
function chSetGate(n){CH_GATE=n;try{localStorage.setItem('efz_chess_gate2',n)}catch(e){}startChess()}
/* Tự động: đầu ván (nhiều quân) 4 nước/câu → giữa ván 3 → tàn cuộc (ít quân) 2 */
function chGateN(){const C=CH;if(C.gate!=='auto')return C.gate;const n=C.S.b.filter(Boolean).length;return n>=24?4:n>=14?3:2}
function chPhase(){const n=CH.S.b.filter(Boolean).length;return n>=24?'khai cuộc':n>=14?'trung cuộc':'tàn cuộc'}
function chUse(k){if(CH[k]<99)CH[k]--}
function chMyMoves(){return CH.log.filter(x=>x.who==='me').length}
/* cứ mỗi N nước của em → phải trả lời đúng 1 câu mới được đi tiếp */
function chGateCheck(){
  const C=CH;if(!C||C.over||C.S.t!==C.me)return;
  if(C.since>=chGateN()){C.gatePending=true;C.quiz={kind:'gate',got:0,busy:false};chQuizNext()}
}
function chGlyph(p,extra){return `<span class="ch-pc ${p<'a'?'w':'b'} ${extra||''}">${CHG[p.toLowerCase()]}︎</span>`}
function chPName(p){const t=p.toLowerCase();return `<b>${CHN[t]}</b> (${CHV[t]})`}
function chInf(n){return n>=99?'∞':n}

/* ---------- màn hình chọn cấp độ ---------- */
function startChess(){
  sndClick();CH_RUN++;CH=null;chCloseModal();GM={type:'chess'};
  const st=chStats();
  $('gamesCard').innerHTML=gameTop('♟️ Cờ vua tiếng Anh','<span class="streak">Lớp '+grade+'</span>')+
  `<p class="sub" style="margin:0 0 10px">Chơi cờ với máy và học từ vựng cùng lúc! Cứ đi vài nước là phải <b>trả lời 1 câu tiếng Anh</b> mới được đi tiếp (đầu ván 4 nước/câu, giữa ván 3, gần cuối ván 2). Muốn <b>đi lại</b> một nước cũ? Bấm vào nước đó trong bảng <b>Các nước đã đi</b> rồi <b>trả lời đúng câu hỏi tiếng Anh</b>. Muốn biết nước hay? Trả lời đúng để xem <b>gợi ý</b> 💡</p>
  <div class="sect-title">① Em cầm quân màu gì?</div>
  <div class="row ch-colpick">
    ${[['w','⚪ Quân trắng (đi trước)'],['b','⚫ Quân đen'],['r','🎲 Ngẫu nhiên']].map(([k,l])=>`<button class="btn ${CH_COLOR===k?'':'ghost'} sm" onclick="CH_COLOR='${k}';startChess()">${l}</button>`).join('')}
  </div>
  <div class="sect-title">② Chọn đối thủ (từ dễ đến khó)</div>
  <div class="game-grid">`+
  CH_LV.map(L=>`<button class="gcard" style="background:linear-gradient(140deg,${L.col},${L.col2})" onclick="chNew(${L.id})">
    <span class="em">${L.em}</span><h3>${L.id}. ${L.nm}</h3>
    <p><b>${L.tag}</b> · ${L.desc}</p>
    <p style="margin-top:6px;font-size:12px;opacity:.95">↩️ Đi lại: ${chInf(L.undo)} · 💡 Gợi ý: ${chInf(L.hint)}${st[L.id]?' · 🏆 thắng '+st[L.id]+' ván':''}</p></button>`).join('')+
  `</div>
  <div class="sect-title">📘 Cách đi các quân cờ (Chess pieces)</div>
  <div class="ch-guide">`+
  ['k','q','r','b','n','p'].map(t=>`<div class="ch-gi"><div class="ch-gg">${chGlyph(t.toUpperCase())}</div><div><div class="ch-gn">${CHN[t]} <span>· ${CHV[t]}</span></div><div class="ch-gd">${CHHOW[t]}</div></div></div>`).join('')+
  `</div>
  <p class="sub" style="margin-top:10px;font-size:12.5px">🖱️ Mẹo: <b>nhấn giữ</b> một quân để hiện <b>mũi tên</b> tới mọi ô nó đi được, rồi <b>kéo thả</b> để đi quân. Câu hỏi lấy từ <b>chủ đề đang chọn</b> ở trang Games (${poolLabel()}) + từ vựng về cờ vua. Mỗi câu đúng ⭐ +5 XP, thắng bot được thưởng XP lớn!</p>`;
}

/* ---------- ván mới ---------- */
function chNew(lv){
  sndClick();chCloseModal();
  const L=CH_LV[lv-1];
  const me=CH_COLOR==='r'?(Math.random()<.5?'w':'b'):CH_COLOR;
  CH={L,S:chInit(),me,sel:-1,targets:[],last:null,snaps:[],log:[],undo:L.undo,hint:L.hint,
      lost:[],won:[],justCap:false,gate:CH_GATE,since:0,gatePending:false,uid:Date.now()+Math.random(),hintMv:null,over:null,run:++CH_RUN,think:false,info:'',view:-1,hold:null};
  chRender();
  if(me==='b')chBotTurn();
}
/* lưu ảnh chụp bàn cờ TRƯỚC mỗi nước đi → snaps[i] = thế cờ trước nước log[i] */
function chSnap(){CH.snaps.push({S:chClone(CH.S),lost:CH.lost.slice(),won:CH.won.slice()})}
function chDesc(m){
  const t=m.p.toLowerCase();
  let s=`${chGlyph(m.p,'sm')} ${CHN[t]} ${chSqName(m.f)}→${chSqName(m.t)}`;
  if(m.fl==='ck'||m.fl==='cq')s=`${chGlyph(m.p,'sm')} nhập thành (castling)`;
  if(m.c)s+=` ✖ ${chGlyph(m.c,'sm')}`;
  if(m.pr)s+=' 👑';
  return s;
}
function chMvNum(i){return (Math.floor(i/2)+1)+(i%2?'…':'.')}
function chLastMe(){for(let i=CH.log.length-1;i>=0;i--)if(CH.log[i].who==='me')return i;return -1}
function chCanRewind(){const C=CH;return !!C&&!C.think&&C.undo>0&&!(C.over&&C.over.res==='win')&&chLastMe()>=0}

/* ---------- vẽ mũi tên ---------- */
function chPos(s){const r=s>>3,f=s&7;return CH.me==='b'?[7-f+.5,7-r+.5]:[f+.5,r+.5]}
const CH_AC={g:'#16a34a',o:'#f97316',v:'#8b5cf6'};
function chArrow(f,t,c,w,op){
  const[a,b]=chPos(f),[x,y]=chPos(t);
  const len=Math.hypot(x-a,y-b),ux=(x-a)/len,uy=(y-b)/len,ex=x-ux*.3,ey=y-uy*.3;
  return `<line x1="${a+ux*.2}" y1="${b+uy*.2}" x2="${ex}" y2="${ey}" stroke="${CH_AC[c]}" stroke-width="${w}" stroke-linecap="round" marker-end="url(#chAh${c})" opacity="${op}"/>`;
}
function chDefs(){return '<defs>'+Object.keys(CH_AC).map(k=>`<marker id="chAh${k}" markerWidth="3" markerHeight="3" refX="1.4" refY="1.5" orient="auto"><path d="M0,0 L3,1.5 L0,3 z" fill="${CH_AC[k]}"/></marker>`).join('')+'</defs>'}

/* ---------- vẽ bàn cờ ---------- */
/* ===== Bàn cờ kiểu lichess: nền 1 lớp, quân là ảnh dựng sẵn, di chuyển bằng transform (GPU) ===== */
const CH_IMG={};
function chPieceImg(p){
  if(CH_IMG[p])return CH_IMG[p];
  const N=160,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
  const g=CHG[p.toLowerCase()]+'︎',w=p<'a';
  x.font=`${N*.86}px "Segoe UI Symbol","Noto Sans Symbols 2","DejaVu Sans","Arial Unicode MS",serif`;
  x.textAlign='center';x.textBaseline='middle';
  x.shadowColor='rgba(0,0,0,.35)';x.shadowBlur=N*.04;x.shadowOffsetY=N*.03;
  if(w){x.lineJoin='round';x.lineWidth=N*.045;x.strokeStyle='#222';x.strokeText(g,N/2,N*.53);x.shadowColor='transparent';x.fillStyle='#fff';x.fillText(g,N/2,N*.53)}
  else{x.fillStyle='#1c1917';x.fillText(g,N/2,N*.53)}
  return CH_IMG[p]=c.toDataURL();
}
function chXY(s){const r=s>>3,f=s&7;return CH.me==='b'?[7-f,7-r]:[f,r]}
function chTf(s){const[x,y]=chXY(s);return `translate(${x*100}%,${y*100}%)`}
function chBuild(){
  const C=CH,L=C.L,flip=C.me==='b',meName=(P&&P.name)?esc(P.name):'Em';
  let co='';
  for(let i=0;i<8;i++){
    co+=`<span class="ch-co rk ${i%2?'d':'l'}" style="top:${i*12.5}%">${flip?i+1:8-i}</span>`;
    co+=`<span class="ch-co fl ${i%2?'l':'d'}" style="left:${i*12.5}%">${'abcdefgh'[flip?7-i:i]}</span>`;
  }
  $('gamesCard').innerHTML=gameTop('♟️ Cờ vua tiếng Anh',`<span class="streak">${L.em} ${L.nm}</span>`)+
  `<div class="ch-wrap" data-uid="${C.uid}">
    <div>
      <div class="ch-bar"><span class="ch-ava" style="background:${L.col}">${L.em}</span><b>${L.nm}</b><span class="ch-caps" id="chLost"></span></div>
      <div class="ch-board" id="chBoard"><div class="ch-hl" id="chHL"></div>${co}<div class="ch-pcs" id="chPcs"></div><svg class="ch-arrow" id="chArr" viewBox="0 0 8 8"></svg><svg class="ch-arrow" id="chHold" viewBox="0 0 8 8"></svg><div class="ch-vtag">👀 Xem lại</div></div>
      <div class="ch-bar"><span class="ch-ava" style="background:#8b5cf6">🙂</span><b>${meName}</b> <small>(${C.me==='w'?'quân trắng':'quân đen'})</small><span class="ch-gchip" id="chGate"></span><span class="ch-caps" id="chWon"></span></div>
    </div>
    <div class="ch-side">
      <div class="ch-status" id="chStatus"></div>
      <div id="chSide" class="ch-side"></div>
      <div class="ch-card ch-log" id="chLogBox"><div class="ch-lt">📜 Các nước đã đi (Moves) <small>– bấm để xem lại</small></div><div id="chLogList"></div></div>
    </div>
  </div>`;
  $('chBoard').onpointerdown=chDown;
  C.pcs=[];C.cache={};C.bdKey='';
}
/* đặt quân: giữ lại phần tử cũ nếu quân không đổi, quân vừa đi thì trượt (transition) tới ô mới */
function chPaintPieces(S,lastM){
  const C=CH,box=$('chPcs');if(!box)return;
  const key=S.b.join(',')+'|'+C.me;if(C.bdKey===key)return;C.bdKey=key;
  const want=[];for(let s=0;s<64;s++)if(S.b[s])want.push({s,p:S.b[s]});
  const old=C.pcs.slice(),keep=[],next=[];
  // 1) cùng ô, cùng quân → giữ nguyên
  for(const w of want){const i=old.findIndex(o=>o&&o.s===w.s&&o.p===w.p);if(i>=0){next.push(old[i]);old[i]=null}else keep.push(w)}
  // 2) quân di chuyển → dùng lại phần tử cùng loại (ưu tiên ô xuất phát của nước vừa đi)
  for(const w of keep){
    let i=-1;
    if(lastM&&lastM.t===w.s)i=old.findIndex(o=>o&&o.s===lastM.f&&(o.p===w.p||o.p===lastM.p));
    if(i<0)i=old.findIndex(o=>o&&o.p===w.p);
    let o;
    if(i>=0){o=old[i];old[i]=null}
    else{const el=document.createElement('div');el.className='ch-p';el.style.transform=chTf(w.s);box.appendChild(el);o={el,s:w.s,p:''}}
    if(o.p!==w.p){o.p=w.p;o.el.style.backgroundImage=`url(${chPieceImg(w.p)})`}
    o.s=w.s;o.el.style.transform=chTf(w.s);
    next.push(o);
  }
  for(const o of old)if(o)o.el.remove();
  C.pcs=next;
}
function chPcAt(s){const o=CH.pcs.find(o=>o.s===s);return o?o.el:null}
function chSet(id,key,html){const C=CH;if(C.cache[key]===html)return false;C.cache[key]=html;const el=$(id);if(el)el.innerHTML=html;return true}
function chRender(){
  if(!CH)return;
  const C=CH,L=C.L,viewing=C.view>=0;
  const w=document.querySelector('.ch-wrap');
  if(!w||w.dataset.uid!=String(C.uid)||!$('chBoard'))chBuild();
  const S=viewing?C.snaps[C.view].S:C.S;
  const lastM=viewing?(C.view>0?C.log[C.view-1].m:null):C.last;
  const showMv=viewing&&C.view<C.log.length&&C.log[C.view].who==='me'?C.log[C.view].m:null;
  const chkSq=chInCheck(S,S.t)?S.b.indexOf(S.t==='w'?'K':'k'):-1;
  chPaintPieces(S,lastM);
  let hl='';
  const H=(s,c)=>{hl+=`<div class="ch-h ${c}" style="transform:${chTf(s)}"></div>`};
  if(lastM){H(lastM.f,'last');H(lastM.t,'last')}
  if(!viewing){
    if(C.sel>=0)H(C.sel,'sel');
    for(const t of C.targets)H(t,S.b[t]||(S.b[C.sel]&&S.b[C.sel].toLowerCase()==='p'&&(t&7)!==(C.sel&7))?'cap':'dot');
    if(C.hintMv){H(C.hintMv.f,'hint');H(C.hintMv.t,'hint')}
  }
  if(chkSq>=0)H(chkSq,'chk');
  chSet('chHL','hl',hl);
  $('chBoard').classList.toggle('viewing',viewing);
  let arr='';
  if(!viewing&&C.hintMv)arr+=chArrow(C.hintMv.f,C.hintMv.t,'g',.2,.85);
  if(showMv)arr+=chArrow(showMv.f,showMv.t,'o',.2,.85);
  chSet('chArr','arr',arr?chDefs()+arr:'');
  const myTurn=!viewing&&!C.over&&!C.think&&C.S.t===C.me;
  let status,stCls='';
  if(viewing){status=`👀 Đang xem lại nước ${chMvNum(C.viewI)}`;stCls='view'}
  else if(C.over){status=C.over.res==='win'?'🏆 Em thắng rồi! You win!':C.over.res==='lose'?'😢 Em thua ván này':'🤝 Hoà! Draw';stCls='over'}
  else if(C.think){status=`🤔 ${L.nm} đang nghĩ<span class="ch-dots"><i>.</i><i>.</i><i>.</i></span>`;stCls='think'}
  else if(chkSq>=0){status='⚠️ Vua của em bị chiếu! (Check!) Hãy cứu Vua';stCls='warn'}
  else status='👉 Đến lượt em! (Your turn)';
  if(chSet('chStatus','st',status))$('chStatus').className='ch-status '+stCls;
  const lost=viewing?C.snaps[C.view].lost:C.lost,won=viewing?C.snaps[C.view].won:C.won;
  chSet('chLost','lost',lost.map(p=>chGlyph(p,'sm')).join('')||'<i>chưa mất quân nào</i>');
  {const g=chGateN();chSet('chGate','gate',!C.over?`📝 Câu hỏi sau <b>${Math.max(1,g-C.since)}</b> nước${C.gate==='auto'?` · ${chPhase()}`:''}`:'')}
  chSet('chWon','won',won.map(p=>chGlyph(p,'sm')).join('')||'<i>chưa ăn quân nào</i>');
  const can=chCanRewind();
  let side;
  if(viewing){
    side=`<div class="ch-card ch-viewbox">
        <div>${showMv?`Bàn cờ đang hiện thế cờ <b>trước nước ${chMvNum(C.viewI)}</b> – mũi tên <b style="color:#f97316">cam</b> là nước em đã đi lúc đó (${chDesc(showMv)}).`:`Bàn cờ đang hiện thế cờ <b>sau nước ${chMvNum(C.viewI)}</b> của ${L.nm} – lúc đó đến lượt em đi.`}</div>
        <div style="margin-top:6px">Muốn chơi lại từ đây? Trả lời đúng ${L.need>1?L.need+' câu':'câu hỏi'} tiếng Anh nhé!</div></div>
      <button class="btn ch-act" style="background:#f97316" ${can?'':'disabled'} onclick="chAsk('undo',${C.view})">↩️ Trả lời để đi lại từ đây <small>(còn ${chInf(C.undo)})</small></button>
      <button class="btn ch-act" style="background:#8b5cf6" onclick="chView(-1)">▶️ Về ván cờ hiện tại</button>`;
  }else{
    side=`${C.over?chOverBox():''}
      <div class="ch-card ch-info">${C.info||'Chạm vào <b>một quân của em</b> để xem nó đi được những ô nào. <b>Nhấn giữ</b> quân để hiện mũi tên, kéo thả để đi.'}</div>
      <button class="btn ch-act ${C.justCap&&can?'pulse':''}" style="background:#ef4444" ${can?'':'disabled'} onclick="chAsk('undo',chLastMe())">↩️ Đi lại nước vừa rồi <small>(còn ${chInf(C.undo)})</small></button>
      <button class="btn ch-act" style="background:#16a34a" ${myTurn&&C.hint>0&&!C.hintBusy?'':'disabled'} onclick="chAsk('hint')">💡 Gợi ý nước tốt <small>(còn ${chInf(C.hint)})</small></button>
      <div class="ch-tip">📜 <b>Bấm vào một nước bất kỳ</b> trong bảng dưới để xem lại thế cờ đó và đi lại từ đấy. ${L.need>1?'Cấp này cần <b>đúng '+L.need+' câu liên tiếp</b>.':''}${L.strict?' Trả lời sai sẽ mất 1 lượt.':' Sai thì được thử câu khác.'}</div>
      <div class="row" style="gap:8px">
        <button class="btn ghost sm" onclick="chNew(${L.id})">🔄 Ván mới</button>
        ${C.over?'':`<button class="btn ghost sm" onclick="chResign()">🏳️ Đầu hàng</button>`}
        <button class="btn ghost sm" onclick="startChess()">⚙️ Đổi cấp độ</button>
      </div>`;
  }
  chSet('chSide','side',side);
  const logH=C.log.map((x,i)=>`<div class="ch-mv ${x.who} ${viewing&&C.viewI===i?'on':''}" onclick="chLogClick(${i})"><span class="ch-num">${chMvNum(i)}</span>${x.who==='me'?'🙂':L.em} ${x.html}</div>`).join('');
  if(chSet('chLogList','log',logH||'<i>Chưa có nước nào</i>')){
    const lg=$('chLogBox'),on=lg.querySelector('.ch-mv.on');
    if(on){const t=on.offsetTop-lg.offsetTop;if(t<lg.scrollTop||t>lg.scrollTop+lg.clientHeight-30)lg.scrollTop=t-lg.clientHeight/2}
    else if(!viewing)lg.scrollTop=lg.scrollHeight;
  }
}
function chOverBox(){
  const C=CH,L=C.L,nx=CH_LV[L.id];
  let h=`<div class="ch-card" style="text-align:center"><div style="font-size:40px">${C.over.res==='win'?'🏆':C.over.res==='lose'?'💪':'🤝'}</div><div style="font-weight:700">${C.over.why}</div><div class="row" style="justify-content:center;gap:8px;margin-top:8px">`;
  if(C.over.res==='lose'&&chCanRewind())h+=`<button class="btn sm" style="background:#ef4444" onclick="chAsk('undo',chLastMe())">↩️ Trả lời để đi lại</button>`;
  h+=`<button class="btn sm" onclick="chNew(${L.id})">🔄 Chơi lại</button>`;
  if(C.over.res==='win'&&nx)h+=`<button class="btn sm" style="background:${nx.col}" onclick="chNew(${nx.id})">${nx.em} Lên cấp ${nx.id}</button>`;
  return h+'</div></div>';
}

/* ---------- xem lại nước cũ (bấm vào bảng nước đi) ---------- */
function chLogClick(i){
  const C=CH;if(!C||C.think)return;
  const x=C.log[i];if(!x)return;
  // nước của em → hiện thế cờ TRƯỚC nước đó (mũi tên cam = nước em đã đi)
  // nước của bot → hiện thế cờ SAU nước đó (đến lượt em)
  let k=x.who==='me'?i:i+1;
  if(k>=C.log.length||C.viewI===i){chView(-1);return}
  C.viewI=i;chView(k);
}
function chView(k){
  const C=CH;if(!C)return;
  sndClick();C.view=k;if(k<0)C.viewI=-1;C.sel=-1;C.targets=[];chRender();
}

/* ---------- nhấn giữ / kéo thả quân (kiểu lichess: kéo chính quân đó bằng transform) ---------- */
function chSqAt(x,y){
  const C=CH;if(!C||!C.bdRect)return -1;
  const R=C.bdRect,col=Math.floor((x-R.l)/R.z),row=Math.floor((y-R.t)/R.z);
  if(col<0||col>7||row<0||row>7)return -1;
  const s=row*8+col;return C.me==='b'?63-s:s;
}
function chMeasure(){const bd=$('chBoard');if(!bd)return;const r=bd.getBoundingClientRect();CH.bdRect={l:r.left+bd.clientLeft,t:r.top+bd.clientTop,z:bd.clientWidth/8}}
function chSelect(s){
  const C=CH,p=C.S.b[s],t=p.toLowerCase();
  C.sel=s;C.targets=chLegal(C.S).filter(x=>x.f===s).map(x=>x.t);
  C.info=`<div class="ch-sel">${chGlyph(p)}<div><div class="ch-gn">${CHN[t]} <span>· ${CHV[t]}</span></div><div class="ch-gd">${CHHOW[t]}</div></div></div>`+
    (C.targets.length?`<div style="margin-top:6px">👉 Đi được <b>${C.targets.length}</b> ô (chấm tròn). Vòng đỏ = ăn được quân. Nhấn giữ để xem mũi tên.</div>`:`<div style="margin-top:6px;color:#dc2626">🚫 Quân này chưa đi được – thử quân khác nhé!</div>`);
}
function chDown(e){
  const C=CH;if(!C||C.gatePending||C.view>=0||C.over||C.think||C.S.t!==C.me)return;
  if(e.button!==undefined&&e.button!==0)return;
  chMeasure();
  const s=chSqAt(e.clientX,e.clientY);if(s<0)return;
  e.preventDefault();
  if(C.sel>=0&&C.sel!==s&&C.targets.includes(s)){chTryMove(C.sel,s);return}
  const p=C.S.b[s];
  if(p&&chCol(p)===C.me){
    const wasSel=C.sel===s;
    if(!wasSel){chSelect(s);chRender();sndClick()}
    C.hold={from:s,over:s,wasSel,moved:false,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,el:chPcAt(s)};
    clearTimeout(C.holdT);
    C.holdT=setTimeout(()=>{if(C.hold)chHoldDraw()},160);
    return;
  }
  C.sel=-1;C.targets=[];C.info='';chRender();
}
function chHoldMove(e){
  const C=CH;if(!C||!C.hold)return;
  const h=C.hold;h.x=e.clientX;h.y=e.clientY;
  if(!h.moved&&Math.abs(h.x-h.sx)+Math.abs(h.y-h.sy)>5){h.moved=true;h.over=-2;if(h.el)h.el.classList.add('drag')}
  if(h.moved&&!C.raf)C.raf=requestAnimationFrame(chHoldFrame);
}
function chHoldFrame(){
  const C=CH;if(!C)return;C.raf=0;const h=C.hold;if(!h)return;
  const R=C.bdRect;
  if(h.el)h.el.style.transform=`translate(${h.x-R.l-R.z/2}px,${h.y-R.t-R.z/2}px) scale(1.12)`;
  const s=chSqAt(h.x,h.y);
  if(s!==h.over){h.over=s;chHoldDraw()}
}
function chHoldUp(){
  const C=CH;if(!C||!C.hold)return;
  clearTimeout(C.holdT);const h=C.hold;C.hold=null;
  if(C.raf){cancelAnimationFrame(C.raf);C.raf=0}
  const svg=$('chHold');if(svg)svg.innerHTML='';
  const over=h.moved?chSqAt(h.x,h.y):h.from;
  if(h.el){h.el.classList.remove('drag');
    if(h.moved&&over!==h.from&&C.targets.includes(over)){h.el.classList.add('snap');h.el.style.transform=chTf(over);requestAnimationFrame(()=>h.el.classList.remove('snap'))}
    else h.el.style.transform=chTf(h.from)}
  if(over!==h.from&&C.targets.includes(over)){chTryMove(h.from,over);return}
  if(over===h.from&&h.wasSel&&!h.moved){C.sel=-1;C.targets=[];C.info='';chRender()}
}
function chHoldDraw(){
  const C=CH,h=C&&C.hold,svg=$('chHold');if(!h||!svg)return;
  let a=chDefs();
  for(const t of C.targets)if(t!==h.over)a+=chArrow(h.from,t,'v',.11,.55);
  if(C.targets.includes(h.over))a+=chArrow(h.from,h.over,'g',.22,.95);
  svg.innerHTML=a;
}
if(!window.__chEv){window.__chEv=1;
  document.addEventListener('pointermove',chHoldMove,{passive:true});
  document.addEventListener('pointerup',chHoldUp);
  document.addEventListener('pointercancel',chHoldUp);
}
function chTryMove(f,t){const m=chLegal(CH.S).find(x=>x.f===f&&x.t===t);if(m)chPlayerMove(m)}

/* ---------- đi quân ---------- */
function chPlayerMove(m){
  const C=CH;chSnap();C.since++;
  chMake(C.S,m);
  if(m.c)C.won.push(m.c);
  C.log.push({who:'me',m,html:chDesc(m)});
  C.last=m;C.sel=-1;C.targets=[];C.hintMv=null;C.justCap=false;
  C.info=m.c?`🎯 Giỏi lắm! Em ăn được ${chPName(m.c)}!`:m.pr?'👑 Tốt đã phong thành <b>Queen</b> (Hậu)!':'';
  m.c?sndOK():sndClick();
  if(chCheckEnd())return;
  chBotTurn();
}
function chBotTurn(){
  const C=CH,run=C.run,t0=Date.now();C.think=true;C.sel=-1;C.targets=[];chRender();
  chAI({kind:'bot',S:chClone(C.S),lv:C.L.id},m=>{
    const wait=Math.max(0,(C.L.id>=4?150:400)-(Date.now()-t0));
    setTimeout(()=>chBotDone(run,m),wait);
  });
}
function chBotDone(run,m){
    if(!CH||CH.run!==run||!$('chBoard'))return;
    CH.think=false;
    if(m)m=chLegal(CH.S).find(x=>x.f===m.f&&x.t===m.t)||null;
    if(!m){chCheckEnd();chRender();return}
    chSnap();chMake(CH.S,m);CH.last=m;
    CH.log.push({who:'bot',m,html:chDesc(m)});
    if(m.c){
      CH.lost.push(m.c);CH.justCap=true;
      CH.info=`😱 ${CH.L.nm} vừa ăn ${chPName(m.c)} của em!`+(chCanRewind()?' Bấm <b>↩️ Đi lại</b> hoặc chọn một nước cũ trong bảng để quay lại.':'');
      sndNo();
    }else CH.info=chInCheck(CH.S,CH.S.t)?'⚠️ Vua của em đang bị chiếu (Check)! Phải đi để cứu Vua.':'';
    if(chCheckEnd())return;
    chRender();
    chGateCheck();
}
function chCapturePrompt(m){
  chOpenModal(`<div style="font-size:46px">${chGlyph(m.c)}</div>
    <h3>Ối! Em bị ăn ${CHN[m.c.toLowerCase()]}!</h3>
    <p>${CH.L.em} ${CH.L.nm} vừa ăn quân <b>${CHN[m.c.toLowerCase()]} (${CHV[m.c.toLowerCase()]})</b> của em.<br>Trả lời đúng ${CH.L.need>1?CH.L.need+' câu':'câu hỏi'} tiếng Anh để <b>đi lại</b> nhé! (còn ${chInf(CH.undo)} lượt)<br><small>Hoặc bấm vào một nước cũ hơn trong bảng <b>Các nước đã đi</b>.</small></p>
    <div class="row" style="justify-content:center;gap:8px"><button class="btn" style="background:#ef4444" onclick="chAsk('undo',chLastMe())">↩️ Trả lời để đi lại</button><button class="btn ghost" onclick="chCloseModal()">▶️ Thôi, chơi tiếp</button></div>`);
}
function chCheckEnd(){
  const C=CH,S=C.S,ms=chLegal(S);let res=null,why='';
  if(!ms.length){
    if(chInCheck(S,S.t)){res=S.t===C.me?'lose':'win';why=res==='win'?'Checkmate! Em chiếu hết '+C.L.nm+' 🎉':'Checkmate! Vua của em bị chiếu hết.'}
    else{res='draw';why='Stalemate – hết nước đi, hoà cờ.'}
  }else{
    const rest=S.b.filter(p=>p&&p.toLowerCase()!=='k');
    if(!rest.length||(rest.length===1&&'nbNB'.includes(rest[0]))){res='draw';why='Không đủ quân để chiếu hết – hoà.'}
    else if(C.log.length>=300){res='draw';why='Ván cờ quá dài – hoà.'}
  }
  if(!res)return false;
  C.over={res,why};C.think=false;
  if(res==='lose')sndNo();
  if(res==='win'&&!C.paid){C.paid=true;const xp=20*C.L.id;P.gameWins++;chSaveWin(C.L.id);confetti(100);sndWin();gainXP(xp);toast('🏆 Thắng '+C.L.nm+'! +'+xp+' XP');}
  if(res==='draw'&&!C.paid){C.paid=true;gainXP(5*C.L.id)}
  persist();checkBadges();
  chRender();
  if(res==='lose'&&chCanRewind())chOpenModal(`<div style="font-size:46px">😵</div><h3>Checkmate!</h3><p>Vua của em bị chiếu hết rồi. Trả lời đúng để <b>đi lại</b> và cứu Vua nhé! (còn ${chInf(C.undo)} lượt)<br><small>Hoặc bấm vào một nước cũ hơn trong bảng <b>Các nước đã đi</b>.</small></p>
    <div class="row" style="justify-content:center;gap:8px"><button class="btn" style="background:#ef4444" onclick="chAsk('undo',chLastMe())">↩️ Trả lời để đi lại</button><button class="btn ghost" onclick="chCloseModal()">Thôi</button></div>`);
  return true;
}
function chResign(){
  if(!CH||CH.over)return;
  CH_RUN++;CH.run=CH_RUN;CH.think=false;
  CH.over={res:'lose',why:'Em đã đầu hàng. Thử lại nhé, em làm được mà!'};sndNo();chRender();
}

/* ---------- câu hỏi tiếng Anh ---------- */
function chMakeQ(typed){
  let pool=poolVocab().filter(v=>v&&v[0]&&v[1]);
  const chess=Math.random()<.15||pool.length<4;
  if(chess)pool=CH_VOCAB;
  if(typed){
    const tp=pool.filter(v=>/^[a-z][a-z ]{1,13}$/i.test(v[0]));
    const w=tp.length?tp[Math.floor(Math.random()*tp.length)]:CH_VOCAB[Math.floor(Math.random()*CH_VOCAB.length)];
    return{typed:true,right:w,ask:`Gõ từ tiếng Anh có nghĩa: <b>${esc(w[1])}</b>`,hint:w[0][0].toUpperCase()+' '+w[0].slice(1).replace(/[a-z]/gi,'_ ')};
  }
  const right=pool[Math.floor(Math.random()*pool.length)];
  const seen=new Set([right[0].toLowerCase(),right[1]]);
  const wr=[];for(const v of shuffle(pool)){if(wr.length>=3)break;if(seen.has(v[0].toLowerCase())||seen.has(v[1]))continue;seen.add(v[0].toLowerCase());seen.add(v[1]);wr.push(v)}
  const en=Math.random()<.6;
  return{typed:false,right,en,opts:shuffle([right,...wr]),ask:en?`<b>${esc(right[0])}</b> nghĩa là gì?`:`Từ tiếng Anh nào nghĩa là: <b>${esc(right[1])}</b>?`};
}
function chAsk(kind,target){
  const C=CH;if(!C)return;
  if(kind==='undo'){
    if(!chCanRewind()||target==null||target<0||target>=C.snaps.length)return;
    if(C.snaps[target].S.t!==C.me)return;
  }
  if(kind==='hint'&&!(C.hint>0&&!C.over&&C.view<0&&C.S.t===C.me))return;
  sndClick();
  C.quiz={kind,target,got:0,busy:false};
  chQuizNext();
}
function chQuizNext(){
  const C=CH,Q=C.quiz,L=C.L;
  const gate=Q.kind==='gate',need=gate?1:L.need;
  const typed=gate?(L.id>=4&&Math.random()<.4):(L.id===5&&Q.got===L.need-1);
  Q.q=chMakeQ(typed);Q.busy=false;
  const back=Q.kind==='undo'?C.log.length-Q.target:0;
  const head=gate?'📝 Trả lời để ĐI TIẾP':Q.kind==='undo'?'↩️ Trả lời để ĐI LẠI':'💡 Trả lời để xem GỢI Ý';
  const sub=Q.kind==='undo'?`<div class="ch-prog" style="color:var(--muted);font-weight:600">Quay lại ${back} nước</div>`:gate?`<div class="ch-prog" style="color:var(--muted);font-weight:600">Em đã đi ${C.since} nước – trả lời đúng để chơi tiếp nhé!</div>`:'';
  const prog=need>1?`<div class="ch-prog">Câu ${Q.got+1}/${L.need} ${'⭐'.repeat(Q.got)}</div>`:'';
  let body;
  if(Q.q.typed){
    body=`<div class="ch-typehint">${Q.q.hint}</div><input id="chType" class="ch-input" autocomplete="off" placeholder="Gõ từ tiếng Anh…" onkeydown="if(event.key==='Enter')chAnswerTyped()">
      <button class="btn" style="margin-top:10px" onclick="chAnswerTyped()">✅ Kiểm tra</button>`;
  }else{
    body=`<div class="opts ch-opts">`+Q.q.opts.map((o,i)=>`<button class="opt" onclick="chAnswer(${i},this)"><span class="ab">${'ABCD'[i]}</span>${esc(Q.q.en?o[1]:o[0])}</button>`).join('')+`</div>`;
  }
  chOpenModal(`<h3>${head}</h3>${sub}${prog}<p class="ch-q">${Q.q.ask}</p>${body}<div id="chFb" class="ch-fb"></div>
    ${gate?'':'<button class="btn ghost sm" style="margin-top:10px" onclick="chCloseModal()">Huỷ</button>'}`);
  if(Q.q.typed)setTimeout(()=>{const i=$('chType');if(i)i.focus()},50);
}
function chAnswer(i,el){
  const Q=CH&&CH.quiz;if(!Q||Q.busy)return;Q.busy=true;
  const o=Q.q.opts[i],ok=o[0]===Q.q.right[0];
  document.querySelectorAll('.ch-opts .opt').forEach((b,j)=>{b.disabled=true;if(Q.q.opts[j][0]===Q.q.right[0])b.classList.add('right')});
  if(!ok)el.classList.add('wrong');
  chJudge(ok);
}
function chAnswerTyped(){
  const Q=CH&&CH.quiz;if(!Q||Q.busy)return;
  const i=$('chType');if(!i||!i.value.trim())return;Q.busy=true;
  const ok=i.value.trim().toLowerCase().replace(/\s+/g,' ')===Q.q.right[0].toLowerCase();
  i.disabled=true;i.classList.add(ok?'ok':'no');
  chJudge(ok);
}
function chJudge(ok){
  const C=CH,Q=C.quiz,L=C.L,fb=$('chFb'),r=Q.q.right,need=Q.kind==='gate'?1:L.need;
  if(ok){
    Q.got++;P.correct++;sndOK();gainXP(5);
    if(Q.got>=need){fb.innerHTML=`✅ Chính xác! <b>${esc(r[0])}</b> = ${esc(r[1])}`;fb.className='ch-fb ok';setTimeout(chQuizDone,800)}
    else{fb.innerHTML=`✅ Đúng rồi! Thêm ${L.need-Q.got} câu nữa…`;fb.className='ch-fb ok';setTimeout(chQuizNext,900)}
    return;
  }
  sndNo();missStreak();
  fb.className='ch-fb no';
  if(!L.strict||Q.kind==='gate'){fb.innerHTML=`❌ Chưa đúng. <b>${esc(r[0])}</b> = ${esc(r[1])}<br>Thử câu khác nhé!`;setTimeout(()=>{Q.got=0;chQuizNext()},1700)}
  else{
    fb.innerHTML=`❌ Chưa đúng. <b>${esc(r[0])}</b> = ${esc(r[1])}<br>Em bị mất 1 lượt ${Q.kind==='undo'?'đi lại':'gợi ý'}.`;
    chUse(Q.kind==='undo'?'undo':'hint');
    setTimeout(()=>{chCloseModal();chRender()},2000);
  }
}
function chRewind(k){
  const C=CH,sn=C.snaps[k];
  C.S=chClone(sn.S);C.lost=sn.lost.slice();C.won=sn.won.slice();
  C.log=C.log.slice(0,k);C.snaps=C.snaps.slice(0,k);
  C.last=k>0?C.log[k-1].m:null;
  C.over=null;C.sel=-1;C.targets=[];C.hintMv=null;C.justCap=false;C.view=-1;C.run=++CH_RUN;C.think=false;
}
function chQuizDone(){
  const C=CH,Q=C.quiz;chCloseModal();C.quiz=null;
  if(Q.kind==='gate'){C.since=0;C.gatePending=false;toast('✅ Giỏi lắm! Đi tiếp nào');chRender();return}
  if(Q.kind==='undo'){
    const back=C.log.length-Q.target;
    chRewind(Q.target);chUse('undo');C.since=0;
    C.info=`↩️ Đã quay lại ${back} nước! Nghĩ kỹ rồi đi nước khác nhé. Mẹo: nhấn giữ quân để xem mũi tên các nước đi.`;
    toast('↩️ Đi lại thành công!');chRender();
  }else{
    chUse('hint');C.info='🔎 Đang tìm nước hay nhất…';chRender();
    C.hintBusy=true;const run=C.run;
    chAI({kind:'hint',S:chClone(C.S)},m0=>{
      C.hintBusy=false;
      if(!CH||CH!==C||C.run!==run)return;
      const m=m0&&chLegal(C.S).find(x=>x.f===m0.f&&x.t===m0.t);if(!m){chRender();return}
      C.hintMv=m;
      const u=chMake(C.S,m),chk=chInCheck(C.S,C.S.t);chUnmake(C.S,u);
      C.info=`💡 <b>Gợi ý:</b> đi ${chPName(m.p)} từ <b>${chSqName(m.f)}</b> đến <b>${chSqName(m.t)}</b> (mũi tên xanh).`+
        (m.c?`<br>🎯 Nước này ăn được ${chPName(m.c)}!`:'')+(chk?'<br>⚔️ Nước này chiếu Vua đối thủ (Check)!':'')+(m.fl==='ck'||m.fl==='cq'?'<br>🏰 Nhập thành (castling) để bảo vệ Vua.':'');
      chRender();
    });
  }
}
function chOpenModal(html){
  chCloseModal();
  const d=document.createElement('div');d.className='modal-bg show';d.id='chModal';
  d.innerHTML=`<div class="modal ch-modal">${html}</div>`;
  document.body.appendChild(d);
}
function chCloseModal(){const m=$('chModal');if(m)m.remove()}
/* ---------- chế độ đo độ mượt: mở web với ?perf (vd: .../english-fun-zone/?perf) ---------- */
if(/[?&#]perf\b/.test(location.href)&&!window.__chPerf){window.__chPerf=1;(function(){
  const box=document.createElement('div');
  box.style.cssText='position:fixed;right:8px;top:8px;z-index:9999;background:rgba(0,0,0,.82);color:#0f0;font:12px/1.5 monospace;padding:8px 10px;border-radius:8px;pointer-events:none;white-space:pre';
  document.body.appendChild(box);
  let frames=0,fps=0,last=performance.now(),lat='-',latMax=0,loaf=0,loafS='',scr=0;
  (function f(t){frames++;if(t-last>=1000){fps=Math.round(frames*1000/(t-last));frames=0;last=t;draw()}requestAnimationFrame(f)})(last);
  document.addEventListener('pointerdown',e=>{const t0=e.timeStamp;requestAnimationFrame(()=>setTimeout(()=>{const d=Math.round(performance.now()-t0);lat=d;latMax=Math.max(latMax,d);draw()},0))},true);
  try{new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(e.duration>loaf){loaf=Math.round(e.duration);const s=(e.scripts||[]).sort((a,b)=>b.duration-a.duration)[0];scr=s?Math.round(s.duration):0;loafS=s?(s.invoker||'').slice(0,28):'(vẽ hình)'}draw()})).observe({type:'long-animation-frame'})}catch(x){}
  function draw(){box.textContent=`FPS: ${fps}\nBấm → hiện: ${lat} ms (max ${latMax})\nKhung chậm nhất: ${loaf} ms\n  script: ${scr} ms ${loafS}\nGPU tab: ${document.visibilityState}`}
  draw();
})()}

/* --- memory --- */
/* ==========================================================
   🎯 LUYỆN 4 KỸ NĂNG (kiểu IELTS) — Nghe · Nói · Đọc · Viết
   Mỗi kỹ năng chia LEVEL, càng lên càng khó. Qua 4/5 câu mới mở level sau.
   ========================================================== */
const SK_DEF={
  listen:{em:'🎧',name:'Nghe',color:'#0891b2',desc:'Nghe từ · nghe câu · nghe đoạn hội thoại'},
  speak :{em:'🗣️',name:'Nói', color:'#db2777',desc:'Đọc vào micro — máy chấm phát âm từng từ'},
  read  :{em:'📖',name:'Đọc', color:'#059669',desc:'Đọc câu · đọc đoạn · tìm ý chính · True/False'},
  write :{em:'✍️',name:'Viết',color:'#d97706',desc:'Xếp câu · điền từ · viết lại câu theo gợi ý'}
};
const SK_MAXLV=10, SK_PER=5, SK_PASS=4;
function skKey(){return 'efz_sk_'+grade}
function skLoad(){try{return JSON.parse(localStorage.getItem(skKey()))||{}}catch(e){return{}}}
function skSave(o){try{localStorage.setItem(skKey(),JSON.stringify(o))}catch(e){}}
function skBest(sk){const d=skLoad();return Math.max(1,Math.min(SK_MAXLV,(d[sk]&&d[sk].best)||1))}
function skStars(sk,lv){const d=skLoad();return (d[sk]&&d[sk].stars&&d[sk].stars[lv])||0}
function skWin(sk,lv,score){
  const d=skLoad();d[sk]=d[sk]||{best:1,stars:{}};
  const st=score>=5?3:score>=4?2:1;
  d[sk].stars=d[sk].stars||{};
  if(st>(d[sk].stars[lv]||0))d[sk].stars[lv]=st;
  if(score>=SK_PASS&&lv>=(d[sk].best||1))d[sk].best=Math.min(SK_MAXLV,lv+1);
  skSave(d);
}
/* ---------- màn hình chính ---------- */
function startSkills(){
  sndClick();SK=null;
  $('gamesCard').innerHTML=gameTop('🎯 Luyện 4 Kỹ Năng','<span class="streak">Lớp '+grade+'</span>')+
   `<p class="sub" style="margin:0 0 10px">Bốn kỹ năng như thi IELTS. Mỗi kỹ năng có <b>${SK_MAXLV} cấp độ</b>, mỗi cấp <b>${SK_PER} câu</b> — đúng <b>${SK_PASS}/${SK_PER}</b> là mở cấp tiếp theo. Càng lên cấp câu càng dài và khó hơn.</p>
    <div class="ielts-topic-grid">`+
    Object.keys(SK_DEF).map(k=>{const S=SK_DEF[k],b=skBest(k);
      return `<div class="ielts-topic-card" style="border-color:${S.color}55;background:linear-gradient(135deg,#fff,${S.color}12)" onclick="skPick('${k}')">
        <span class="tc-em">${S.em}</span><div class="tc-nm" style="color:${S.color}">${S.name}</div>
        <div class="tc-cnt">Đang ở cấp ${b}/${SK_MAXLV}</div></div>`}).join('')+
    `</div><p class="sub" style="margin-top:10px;font-size:12px">💡 Kỹ năng <b>Nói</b> cần cho phép dùng <b>micro</b> và chạy tốt nhất trên Chrome/Edge. Máy nào không hỗ trợ sẽ tự chuyển sang chế độ <b>nghe rồi nhắc lại</b>.</p>`;
}
function skPick(sk){
  sndClick();const S=SK_DEF[sk],b=skBest(sk);
  $('gamesCard').innerHTML=gameTop(S.em+' '+S.name,'<span class="streak">Lớp '+grade+'</span>')+
   `<button class="btn ghost sm" onclick="startSkills()" style="margin-bottom:10px">← 4 kỹ năng</button>
    <p class="sub" style="margin:0 0 10px">${S.desc}</p>
    <div class="ielts-topic-grid">`+
    Array.from({length:SK_MAXLV},(_,i)=>i+1).map(lv=>{
      const lock=lv>b, st=skStars(sk,lv);
      return `<div class="ielts-topic-card" style="${lock?'opacity:.45;cursor:not-allowed':''}" ${lock?'':`onclick="skStart('${sk}',${lv})"`}>
        <span class="tc-em">${lock?'🔒':S.em}</span>
        <div class="tc-nm" style="color:${S.color}">Cấp ${lv}</div>
        <div class="tc-cnt">${lock?'Chưa mở':(st?'⭐'.repeat(st):'Chưa chơi')}</div></div>`}).join('')+
    `</div>`;
}
/* ---------- kho câu hỏi theo kỹ năng & cấp ---------- */
let SK=null, SKrec=null;
function skPool(){const v=poolVocab();return v.length>=6?v:DATA[grade].topics.flatMap(t=>t.vocab)}
function skSent(){ /* câu tiếng Anh có sẵn trong SGK để luyện nghe/nói/đọc */
  const out=[];
  for(const l of (DATA[grade].listenings||[]))for(let i=0;i<l.script.length;i++)
    out.push({en:l.script[i].text,vn:(l.trans&&l.trans[i])||''});
  for(const r of (DATA[grade].readings||[]))
    for(const sen of String(r.text||'').split(/(?<=[.!?])\s+/))
      if(sen.trim().length>18&&sen.trim().length<150)out.push({en:sen.trim(),vn:''});
  return out.length?out:[{en:'I like learning English.',vn:'Mình thích học tiếng Anh.'}];
}
function skMake(sk,lv,i){
  const pool=skPool(), S=skSent();
  const word=()=>rnd(pool);
  const wrongs=(right,n,idx)=>pickN(pool.filter(v=>v[idx]!==right[idx]),n).map(v=>v[idx]);
  if(sk==='listen'){
    if(lv<=2){const w=word();
      return {kind:'listen',say:w[0],prompt:'Nghe rồi chọn <b>nghĩa tiếng Việt</b> đúng',
        opts:shuffle([{t:w[1],ok:1},...wrongs(w,lv===1?2:3,1).map(t=>({t,ok:0}))]),note:w[0]+' = '+w[1]};}
    if(lv<=4){const w=word();
      return {kind:'listen',say:w[0],prompt:'Nghe rồi chọn <b>từ tiếng Anh</b> em vừa nghe',
        opts:shuffle([{t:w[0],ok:1},...wrongs(w,3,0).map(t=>({t,ok:0}))]),note:w[0]+' = '+w[1]};}
    if(lv<=6){const s=rnd(S);const w=word();
      return {kind:'listen',say:s.en,prompt:'Nghe cả câu rồi chọn câu em vừa nghe',
        opts:shuffle([{t:s.en,ok:1},...pickN(S.filter(x=>x.en!==s.en),3).map(x=>({t:x.en,ok:0}))]),note:s.vn||s.en};}
    /* cấp cao: nghe đoạn thật trong SGK rồi trả lời */
    const ls=(DATA[grade].listenings||[]).filter(l=>l.qs&&l.qs.length);
    if(ls.length){const l=rnd(ls),q=rnd(l.qs);
      return {kind:'listenLong',say:l.script.map(x=>x.text),title:l.title,
        prompt:'🎧 Nghe cả đoạn <b>'+esc(l.title)+'</b> rồi trả lời:<br><b>'+esc(q.q)+'</b>',
        opts:shuffle(q.o.map((t,k)=>({t,ok:k===q.a?1:0}))),note:'Đáp án: '+q.o[q.a]};}
    const s=rnd(S);
    return {kind:'listen',say:s.en,prompt:'Nghe rồi chọn câu đúng',
      opts:shuffle([{t:s.en,ok:1},...pickN(S.filter(x=>x.en!==s.en),3).map(x=>({t:x.en,ok:0}))]),note:s.vn||s.en};
  }
  if(sk==='speak'){
    if(lv<=2){const w=word();return {kind:'speak',target:w[0],hint:w[1],label:'Đọc to từ này'};}
    if(lv<=4){const w=word();
      const tmpl=['I like '+w[0]+'.','This is a '+w[0]+'.','I can see the '+w[0]+'.'];
      return {kind:'speak',target:rnd(tmpl),hint:w[1],label:'Đọc to cả cụm'};}
    const s=rnd(S.filter(x=>x.en.split(' ').length<=(lv<=6?10:18)))||rnd(S);
    return {kind:'speak',target:s.en,hint:s.vn,label:'Đọc to cả câu — rõ ràng, đúng nhịp'};
  }
  if(sk==='read'){
    if(lv<=2){const w=word();
      return {kind:'read',prompt:'Từ <b>'+esc(w[0])+'</b> nghĩa là gì?',
        opts:shuffle([{t:w[1],ok:1},...wrongs(w,lv===1?2:3,1).map(t=>({t,ok:0}))]),note:w[0]+' = '+w[1]};}
    if(lv<=4){const s=rnd(S);const ws=s.en.split(' ');
      const k=ws.findIndex(x=>x.length>3);const key=(ws[k]||ws[0]).replace(/[.,!?]/g,'');
      const blank=ws.map((x,j)=>j===k?'______':x).join(' ');
      return {kind:'read',prompt:'Đọc câu và điền từ còn thiếu:<br><b>'+esc(blank)+'</b>',
        opts:shuffle([{t:key,ok:1},...pickN(pool.filter(v=>v[0]!==key),3).map(v=>({t:v[0],ok:0}))]),note:s.en};}
    const rs=(DATA[grade].readings||[]).filter(r=>r.qs&&r.qs.length);
    if(rs.length){const r=rnd(rs),q=rnd(r.qs);
      const cut=lv<=6?Math.ceil(r.text.length*.6):r.text.length;
      return {kind:'readLong',passage:r.text.slice(0,cut),title:r.title,
        prompt:'<b>'+esc(q.q)+'</b>',opts:shuffle(q.o.map((t,k)=>({t,ok:k===q.a?1:0}))),note:'Đáp án: '+q.o[q.a]};}
    const w=word();
    return {kind:'read',prompt:'Từ <b>'+esc(w[0])+'</b> nghĩa là gì?',
      opts:shuffle([{t:w[1],ok:1},...wrongs(w,3,1).map(t=>({t,ok:0}))]),note:w[0]+' = '+w[1]};
  }
  /* ---- WRITE ---- */
  if(lv<=2){const w=word();
    return {kind:'type',target:w[0],prompt:'Viết <b>từ tiếng Anh</b> của: <b>'+esc(w[1])+'</b>',hint:w[0][0]+'…'};}
  if(lv<=4){const s=rnd(S.filter(x=>x.en.split(' ').length<=9))||rnd(S);
    const ws=s.en.replace(/[.]$/,'').split(' ');
    return {kind:'order',target:ws.join(' '),words:shuffle(ws),prompt:'Sắp xếp thành câu đúng:',hint:s.vn};}
  if(lv<=6){const s=rnd(S);const ws=s.en.split(' ');
    const k=ws.findIndex(x=>x.length>3);const key=(ws[k]||ws[0]).replace(/[.,!?]/g,'');
    return {kind:'type',target:key,prompt:'Điền từ còn thiếu:<br><b>'+esc(ws.map((x,j)=>j===k?'______':x).join(' '))+'</b>',hint:key[0]+'…'};}
  const s=rnd(S.filter(x=>x.en.split(' ').length>=5))||rnd(S);
  return {kind:'type',target:s.en.replace(/[.]$/,''),prompt:'Viết lại nguyên văn câu sau (chú ý chính tả &amp; dấu câu):<br><b>'+esc(s.en)+'</b>',hint:'Gõ đúng từng chữ'};
}
/* ---------- chạy một cấp ---------- */
function skStart(sk,lv){
  sndClick();
  SK={sk,lv,i:0,score:0,qs:[]};
  for(let i=0;i<SK_PER;i++)SK.qs.push(skMake(sk,lv,i));
  skRender();
}
function skHead(){
  const S=SK_DEF[SK.sk];
  return gameTop(S.em+' '+S.name+' — Cấp '+SK.lv,'<span class="streak">Lớp '+grade+'</span>')+
   `<div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--muted);margin-bottom:6px">
      <span>Câu ${SK.i+1}/${SK_PER}</span><span>✅ ${SK.score} · cần ${SK_PASS} để qua cấp</span></div>`;
}
function skRender(){
  if(SK.i>=SK_PER)return skEnd();
  const q=SK.qs[SK.i],el=$('gamesCard'),S=SK_DEF[SK.sk];
  if(q.kind==='speak')return skRenderSpeak(q);
  if(q.kind==='type')return skRenderType(q);
  if(q.kind==='order')return skRenderOrder(q);
  let head='';
  if(q.kind==='listenLong')head=`<div class="prompt-card"><div style="font-size:34px">🔊</div>
     <button type="button" class="btn sun sm" onclick="skSay()">▶️ Nghe lại cả đoạn</button></div>`;
  else if(q.kind==='listen')head=`<div class="prompt-card"><div style="font-size:34px">🔊</div>
     <button type="button" class="btn sun sm" onclick="skSay()">▶️ Nghe lại</button></div>`;
  else if(q.kind==='readLong')head=`<div class="prompt-card" style="text-align:left">
     <div style="font-size:11px;color:#059669;font-weight:800">📖 ${esc(q.title||'')}</div>
     <div style="max-height:190px;overflow:auto;font-size:12.5px;line-height:1.7;background:#fff;border:1px solid #e5e7eb;border-radius:9px;padding:8px 10px;margin:6px 0">${esc(q.passage).replace(/\n+/g,'<br>')}</div></div>`;
  el.innerHTML=skHead()+head+
    `<div class="q-box" style="margin:8px 0"><b>${q.prompt}</b></div>`+
    optButtons(q.opts,'skAns')+`<div class="feedback" id="skfb" style="margin-top:6px"></div>`;
  if(q.say)setTimeout(skSay,420);
}
function skSay(){const q=SK&&SK.qs[SK.i];if(!q||!q.say)return;
  try{speak(Array.isArray(q.say)?q.say.map(t=>({text:t,pause:420})):q.say,.9)}catch(e){}}
function skAns(k){
  const q=SK.qs[SK.i],ok=q.opts[k].ok;
  document.querySelectorAll('#gamesCard .opt').forEach((b,j)=>{b.disabled=true;
    if(q.opts[j].ok)b.classList.add('right');else if(j===k)b.classList.add('wrong')});
  skDone(!!ok,q.note||'');
}
function skDone(ok,note){
  const fb=$('skfb');
  if(ok){SK.score++;sndOK();gainXP(6);if(fb){fb.className='feedback ok';fb.innerHTML='🎉 Chính xác! '+esc(note)}}
  else{sndNo();if(fb){fb.className='feedback no';fb.innerHTML='😅 Chưa đúng. '+esc(note)}}
  persist();
  setTimeout(()=>{SK.i++;skRender()},ok?1800:2800);
}
/* ---------- VIẾT: gõ chữ ---------- */
function skRenderType(q){
  $('gamesCard').innerHTML=skHead()+
   `<div class="q-box" style="margin:8px 0"><b>${q.prompt}</b>
      <div style="font-size:12px;color:var(--muted);font-weight:600;margin-top:4px">💡 Gợi ý: ${esc(q.hint||'')}</div></div>
    <input id="skin" type="text" autocomplete="off" style="width:100%;font-size:16px;padding:11px 13px;border:2px solid #ddd6fe;border-radius:12px;font-family:inherit" placeholder="Gõ câu trả lời rồi bấm Enter...">
    <div class="row" style="gap:8px;margin-top:8px"><button class="btn" onclick="skCheckType()">✅ Kiểm tra</button></div>
    <div class="feedback" id="skfb" style="margin-top:8px"></div>`;
  const inp=$('skin');if(inp){inp.focus();inp.onkeydown=e=>{if(e.key==='Enter')skCheckType()}}
}
function skCheckType(){
  const q=SK.qs[SK.i],inp=$('skin');if(!inp||inp.disabled)return;
  const got=norm(inp.value),want=norm(q.target);
  inp.disabled=true;
  const ok=got===want;
  inp.style.borderColor=ok?'#16a34a':'#dc2626';
  skDone(ok,'Đáp án đúng: '+q.target);
}
/* ---------- VIẾT: xếp câu ---------- */
function skRenderOrder(q){
  SK.picked=[];SK.bank=q.words.slice();
  $('gamesCard').innerHTML=skHead()+
   `<div class="q-box" style="margin:8px 0"><b>${q.prompt}</b>${q.hint?`<div style="font-size:12px;color:var(--muted);font-weight:600;margin-top:4px">💡 ${esc(q.hint)}</div>`:''}</div>
    <div id="skline" style="min-height:46px;background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:9px;font-size:15px;font-weight:700;display:flex;flex-wrap:wrap;gap:6px"></div>
    <div id="skbank" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:9px"></div>
    <div class="row" style="gap:8px;margin-top:9px"><button class="btn" onclick="skCheckOrder()">✅ Kiểm tra</button><button class="btn ghost sm" onclick="skResetOrder()">↩️ Làm lại</button></div>
    <div class="feedback" id="skfb" style="margin-top:8px"></div>`;
  skDrawOrder();
}
function skDrawOrder(){
  const L=$('skline'),B=$('skbank');if(!L||!B)return;
  L.innerHTML=SK.picked.map((w,i)=>`<button class="btn ghost sm" style="padding:5px 11px" onclick="skUnpick(${i})">${esc(w)}</button>`).join('')||'<span style="color:#94a3b8;font-weight:600;font-size:13px">Bấm các từ bên dưới để xếp câu…</span>';
  B.innerHTML=SK.bank.map((w,i)=>`<button class="btn sun sm" style="padding:5px 11px" onclick="skPickW(${i})">${esc(w)}</button>`).join('');
}
function skPickW(i){SK.picked.push(SK.bank[i]);SK.bank.splice(i,1);sndClick();skDrawOrder()}
function skUnpick(i){SK.bank.push(SK.picked[i]);SK.picked.splice(i,1);sndClick();skDrawOrder()}
function skResetOrder(){SK.bank=SK.bank.concat(SK.picked);SK.picked=[];skDrawOrder()}
function skCheckOrder(){
  const q=SK.qs[SK.i];
  const ok=norm(SK.picked.join(' '))===norm(q.target);
  skDone(ok,'Câu đúng: '+q.target);
}
/* ---------- NÓI: chấm phát âm bằng micro ---------- */
function skSpeechOK(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}
function skRenderSpeak(q){
  const has=skSpeechOK();
  $('gamesCard').innerHTML=skHead()+
   `<div class="prompt-card"><div style="font-size:11px;color:#db2777;font-weight:800">🗣️ ${esc(q.label)}</div>
      <b style="font-size:19px;line-height:1.45;display:block;margin:7px 0">${esc(q.target)}</b>
      ${q.hint?`<div style="font-size:12.5px;color:var(--muted);font-weight:600">${esc(q.hint)}</div>`:''}
      <button type="button" class="btn sun sm" style="margin-top:7px" onclick="skSpeakModel()">🔊 Nghe mẫu</button></div>
    ${has?`<div class="row" style="gap:8px;justify-content:center;margin-top:10px">
        <button class="btn" id="skmic" onclick="skMic()">🎙️ Bấm rồi đọc</button></div>
      <div id="skheard" style="text-align:center;font-size:13px;font-weight:700;color:var(--muted);margin-top:8px;min-height:22px"></div>`
     :`<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:11px;padding:9px 11px;font-size:12.5px;font-weight:600;margin-top:10px">
        🎙️ Trình duyệt này không hỗ trợ chấm phát âm. Em hãy <b>nghe mẫu rồi nhắc lại</b>, sau đó tự đánh giá nhé (nên dùng Chrome hoặc Edge để được chấm điểm).</div>
      <div class="row" style="gap:8px;justify-content:center;margin-top:9px">
        <button class="btn" onclick="skSelfMark(true)">✅ Em đọc được</button>
        <button class="btn ghost" onclick="skSelfMark(false)">🔁 Chưa được</button></div>`}
    <div class="feedback" id="skfb" style="margin-top:9px"></div>`;
  setTimeout(skSpeakModel,400);
}
function skSpeakModel(){const q=SK&&SK.qs[SK.i];if(q)try{speak(q.target,.85)}catch(e){}}
function skSelfMark(ok){skDone(ok,ok?'Cố gắng đọc rõ từng âm cuối nhé!':'Nghe mẫu thêm vài lần rồi thử lại nha!')}
function skMic(){
  const q=SK.qs[SK.i],btn=$('skmic'),hd=$('skheard');
  const R=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!R)return skSelfMark(true);
  try{if(SKrec)SKrec.abort()}catch(e){}
  SKrec=new R();SKrec.lang='en-US';SKrec.interimResults=true;SKrec.maxAlternatives=3;
  let finalTxt='';
  if(btn){btn.disabled=true;btn.innerHTML='🔴 Đang nghe… đọc đi!'}
  SKrec.onresult=ev=>{
    let interim='';
    for(let i=ev.resultIndex;i<ev.results.length;i++){
      const r=ev.results[i];
      if(r.isFinal)finalTxt+=' '+r[0].transcript; else interim+=r[0].transcript;
    }
    if(hd)hd.textContent='👂 '+(finalTxt+' '+interim).trim();
  };
  SKrec.onerror=e=>{
    if(btn){btn.disabled=false;btn.innerHTML='🎙️ Bấm rồi đọc'}
    const fb=$('skfb');
    if(fb){fb.className='feedback no';
      fb.innerHTML=(e.error==='not-allowed'||e.error==='service-not-allowed')
        ? '🚫 Trình duyệt chưa được cấp quyền micro. Bấm vào ổ khoá 🔒 trên thanh địa chỉ → cho phép Micro, rồi thử lại nhé!'
        : '😵 Không nghe rõ ('+esc(e.error||'')+'). Thử lại giúp em nha!';}
  };
  SKrec.onend=()=>{
    if(btn){btn.disabled=false;btn.innerHTML='🎙️ Đọc lại'}
    if(!finalTxt.trim())return;
    skGrade(finalTxt.trim(),q.target);
  };
  try{SKrec.start()}catch(e){if(btn){btn.disabled=false;btn.innerHTML='🎙️ Bấm rồi đọc'}}
}
/* so khớp từng từ giữa câu mẫu và câu học sinh đọc */
function skGrade(heard,target){
  const A=norm(target).split(' ').filter(Boolean);
  const B=norm(heard).split(' ').filter(Boolean);
  const used=new Array(B.length).fill(false);
  const marks=A.map(w=>{
    let j=B.findIndex((x,k)=>!used[k]&&x===w);
    if(j<0)j=B.findIndex((x,k)=>!used[k]&&(x.startsWith(w.slice(0,Math.max(3,w.length-2)))||w.startsWith(x.slice(0,Math.max(3,x.length-2)))));
    if(j>=0){used[j]=true;return 1}
    return 0;
  });
  const hit=marks.reduce((a,b)=>a+b,0), pct=Math.round(hit/A.length*100);
  const need=SK.lv<=2?70:SK.lv<=5?65:60;
  const ok=pct>=need;
  const detail=A.map((w,i)=>`<span style="color:${marks[i]?'#16a34a':'#dc2626'};font-weight:800">${esc(w)}</span>`).join(' ');
  const fb=$('skfb');
  if(fb){fb.className='feedback '+(ok?'ok':'no');
    fb.innerHTML=`${ok?'🎉':'💪'} <b>${pct}% khớp</b> (cần ${need}%) — đúng ${hit}/${A.length} từ<br>
      <span style="font-size:13px">${detail}</span><br>
      <span style="font-size:12px;color:#475569">👂 Máy nghe được: “${esc(heard)}”</span>`;}
  if(ok){SK.score++;sndOK();gainXP(8)}else sndNo();
  persist();
  setTimeout(()=>{SK.i++;skRender()},ok?2200:3600);
}
/* ---------- kết thúc cấp ---------- */
function skEnd(){
  const sk=SK.sk,lv=SK.lv,sc=SK.score,pass=sc>=SK_PASS;
  skWin(sk,lv,sc);
  const S=SK_DEF[sk];
  if(pass){confetti(70);sndWin()}
  gainXP(sc*4+(pass?15:0));P.gameWins++;persist();checkBadges();
  $('gamesCard').innerHTML=gameTop(S.em+' '+S.name+' — Cấp '+lv,'')+
   `<div class="result"><div class="face">${sc>=5?'🏆':pass?'🎉':'💪'}</div>
      <h3>${sc}/${SK_PER} câu đúng</h3>
      <p>${pass?(lv>=SK_MAXLV?'Em đã chinh phục cấp cao nhất! 🌟':'Qua cấp! Mở khoá <b>Cấp '+(lv+1)+'</b> 🔓'):'Cần <b>'+SK_PASS+'/'+SK_PER+'</b> mới qua cấp. Thử lại nhé!'}</p>
      <div class="row" style="gap:8px;justify-content:center;margin-top:10px">
        ${pass&&lv<SK_MAXLV?`<button class="btn" onclick="skStart('${sk}',${lv+1})">➡️ Cấp ${lv+1}</button>`:''}
        <button class="btn ghost" onclick="skStart('${sk}',${lv})">🔄 Chơi lại cấp ${lv}</button>
        <button class="btn teal" onclick="skPick('${sk}')">📋 Chọn cấp</button></div></div>`;
}

/* --- memory --- */
function startMemory(){
  const pairs=pickN(poolVocab(),8);
  let cards=[];
  pairs.forEach((p,i)=>{cards.push({id:i,txt:p[0],en:1});cards.push({id:i,txt:p[1],en:0})});
  GM={type:'mem',cards:shuffle(cards),open:[],found:0,moves:0};
  sndClick();
  $('gamesCard').innerHTML=gameTop('🃏 Lật thẻ ghi nhớ','<span class="streak" id="movesC">0 lượt</span>')+
    `<p class="sub center mt">Lật 2 thẻ tìm cặp tiếng Anh — tiếng Việt cùng nghĩa!</p>
    <div class="memory-board">${GM.cards.map((c,k)=>`<button class="mcard" id="mc${k}" onclick="flipCard(${k})"><span class="qmark">?</span></button>`).join('')}</div>`;
}
function flipCard(k){
  if(!GM||GM.lock)return;
  const c=GM.cards[k],el=$('mc'+k);
  if(GM.open.find(o=>o.k===k)||el.classList.contains('done'))return;
  sndFlip();el.classList.add('flip');el.innerHTML=`<span>${esc(c.txt)}</span>`;
  GM.open.push({k,c});
  if(GM.open.length===2){
    GM.lock=true;GM.moves++;$('movesC').textContent=GM.moves+' lượt';
    const[a,b]=GM.open;
    setTimeout(()=>{
      if(a.c.id===b.c.id&&a.c.en!==b.c.en){
        $('mc'+a.k).classList.add('done');$('mc'+b.k).classList.add('done');
        GM.found++;sndOK();
        if(GM.found===8){
          P.gameWins++;P.correct+=4;gainXP(40);persist();checkBadges();
          confetti(100);sndWin();
          setTimeout(()=>{$('gamesCard').innerHTML=gameTop('🃏 Lật thẻ ghi nhớ')+
            `<div class="result"><div class="face">🏆</div><h3>Tuyệt vời! Xong trong ${GM.moves} lượt</h3>
            <div class="xpgain">⭐ +40 XP</div>
            <div class="row" style="justify-content:center"><button class="btn" onclick="startMemory()">🔄 Chơi lại</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`},700);
        }
      }else{
        sndNo();
        $('mc'+a.k).classList.remove('flip');$('mc'+a.k).innerHTML='<span class="qmark">?</span>';
        $('mc'+b.k).classList.remove('flip');$('mc'+b.k).innerHTML='<span class="qmark">?</span>';
      }
      GM.open=[];GM.lock=false;
    },650);
  }
}
/* --- hangman / balloon --- */
function startHangman(){
  const pick=pickN(poolVocab().filter(v=>/^[a-z ]+$/i.test(v[0])&&v[0].length<=14),1)[0];
  GM={type:'hang',word:pick[0].toUpperCase(),vn:pick[1],lives:6,got:new Set()};
  sndClick();renderHang();
}
function renderHang(){
  const w=GM.word;
  const disp=[...w].map(ch=>ch===' '?'<div style="width:20px"></div>':`<div class="hletter">${GM.got.has(ch)?ch:''}</div>`).join('');
  const kb='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(ch=>{
    let cls='';if(GM.got.has(ch))cls=w.includes(ch)?'used-ok':'used-no';
    return `<button class="${cls}" onclick="guess('${ch}')">${ch}</button>`}).join('');
  $('gamesCard').innerHTML=gameTop('🎈 Giải cứu bóng bay')+
    `<div class="lives mt">${'🎈'.repeat(GM.lives)}${'💥'.repeat(6-GM.lives)}</div>
    <p class="sub center">Gợi ý: <b>${esc(GM.vn)}</b> — đoán chữ cái để cứu bóng bay!</p>
    <div class="hang-word">${disp}</div>
    <div class="kb">${kb}</div>`;
}
function guess(ch){
  if(GM.got.has(ch))return;
  GM.got.add(ch);
  if(GM.word.includes(ch)){
    sndOK();
    const done=[...GM.word].every(c=>c===' '||GM.got.has(c));
    if(done){
      P.gameWins++;P.correct++;gainXP(30);persist();checkBadges();confetti(80);sndWin();
      $('gamesCard').innerHTML=gameTop('🎈 Giải cứu bóng bay')+
        `<div class="result"><div class="face">🎉</div><h3>Cứu được bóng bay rồi!</h3>
        <div class="scoreline">Từ cần tìm: <b>${esc(GM.word)}</b> = ${esc(GM.vn)}</div>
        <div class="xpgain">⭐ +30 XP</div>
        <div class="row" style="justify-content:center"><button class="btn" onclick="startHangman()">🔄 Từ mới</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`;
      return;
    }
  }else{
    GM.lives--;sndNo();
    if(GM.lives<=0){
      $('gamesCard').innerHTML=gameTop('🎈 Giải cứu bóng bay')+
        `<div class="result"><div class="face">💥</div><h3>Ôi không, hết bóng bay!</h3>
        <div class="scoreline">Từ cần tìm là: <b>${esc(GM.word)}</b> = ${esc(GM.vn)}</div>
        <div class="row" style="justify-content:center"><button class="btn" onclick="startHangman()">🔄 Thử lại</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`;
      return;
    }
  }
  renderHang();
}
/* --- speed quiz --- */
function startSpeed(){
  GM={type:'speed',t:45,score:0,q:null};
  sndClick();
  $('gamesCard').innerHTML=gameTop('⏱️ Đua tốc độ','<span class="streak">🏅 <span id="spScore">0</span></span>')+
    `<div class="timer-big mt" id="spTimer">45</div>
    <div class="qq center" id="spWord"></div>
    <div class="opts mt" id="spOpts"></div>`;
  GM.timer=setInterval(()=>{
    GM.t--;const el=$('spTimer');if(!el){clearInterval(GM.timer);return}
    el.textContent=GM.t;
    if(GM.t<=10)el.classList.add('danger');
    if(GM.t<=0)endSpeed();
  },1000);
  nextSpeedQ();
}
function nextSpeedQ(){
  const vocab=poolVocab();
  const right=vocab[Math.floor(Math.random()*vocab.length)];
  const wrongs=pickN(vocab.filter(v=>v[0]!==right[0]),3);
  const en=Math.random()>.5;
  GM.q={right,en};
  $('spWord').innerHTML='<b>'+esc(en?right[0]:right[1])+'</b> nghĩa là gì?';
  const opts=shuffle([right,...wrongs]);
  $('spOpts').innerHTML=opts.map(o=>`<button class="opt" onclick="answerSpeed('${esc(o[0]).replace(/'/g,"\\'")}')"><span class="ab">→</span>${esc(en?o[1]:o[0])}</button>`).join('');
}
function answerSpeed(key){
  if(!GM||GM.type!=='speed')return;
  if(key===GM.q.right[0]){GM.score++;P.correct++;sndOK();gainXP(5);$('spScore').textContent=GM.score}
  else{sndNo()}
  persist();nextSpeedQ();
}
function endSpeed(){
  clearInterval(GM.timer);
  if(GM.score>=6){P.gameWins++;confetti(80);sndWin()}
  persist();checkBadges();
  $('gamesCard').innerHTML=gameTop('⏱️ Đua tốc độ')+
    `<div class="result"><div class="face">${GM.score>=10?'🏆':GM.score>=6?'🤩':'💪'}</div>
    <h3>${GM.score>=10?'Tốc độ ánh sáng!':GM.score>=6?'Nhanh ghê!':'Tập thêm sẽ nhanh hơn!'}</h3>
    <div class="scoreline">Đúng <b>${GM.score}</b> từ trong 45 giây · ⭐ +${GM.score*5} XP</div>
    <div class="row" style="justify-content:center"><button class="btn" onclick="startSpeed()">🔄 Đua lại</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`;
}
/* --- scramble --- */
function startScramble(){
  const pick=pickN(poolVocab().filter(v=>/^[a-z]+$/i.test(v[0])&&v[0].length>=4&&v[0].length<=10),1)[0];
  GM={type:'scr',word:pick[0].toUpperCase(),vn:pick[1],built:[]};
  GM.pool=shuffle([...GM.word].map((c,i)=>({c,i})));
  sndClick();renderScramble();
}
function renderScramble(){
  $('gamesCard').innerHTML=gameTop('🔀 Xếp chữ thần tốc')+
    `<p class="sub center mt">Ghép các chữ cái thành từ tiếng Anh nghĩa là: <b style="color:var(--violet)">${esc(GM.vn)}</b></p>
    <div class="hang-word">${GM.built.map((b,k)=>`<button class="hletter" style="cursor:pointer;border:none" onclick="scrRemove(${k})">${b.c}</button>`).join('')||'<div style="color:#b9b6d0;font-weight:600;font-size:13px;padding:14px">Chạm chữ cái bên dưới nha 👇</div>'}</div>
    <div class="kb">${GM.pool.map((p,k)=>`<button onclick="scrAdd(${k})">${p.c}</button>`).join('')}</div>
    <div class="center mt"><button class="btn" onclick="checkScramble()" ${GM.built.length===GM.word.length?'':'disabled'}>✅ Kiểm tra</button></div>`;
}
function scrAdd(k){sndFlip();GM.built.push(GM.pool.splice(k,1)[0]);renderScramble()}
function scrRemove(k){sndFlip();GM.pool.push(GM.built.splice(k,1)[0]);renderScramble()}
function checkScramble(){
  const ans=GM.built.map(b=>b.c).join('');
  if(ans===GM.word){
    P.gameWins++;P.correct++;gainXP(25);persist();checkBadges();confetti(70);sndWin();
    $('gamesCard').innerHTML=gameTop('🔀 Xếp chữ thần tốc')+
      `<div class="result"><div class="face">🎉</div><h3>Chính xác: ${esc(GM.word)}!</h3>
      <div class="scoreline">${esc(GM.word.toLowerCase())} = ${esc(GM.vn)}</div>
      <div class="xpgain">⭐ +25 XP</div>
      <div class="row" style="justify-content:center"><button class="btn" onclick="startScramble()">🔄 Từ mới</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`;
  }else{
    sndNo();toast('😅 Chưa đúng, thử đổi vị trí các chữ cái xem!');
    GM.pool=GM.pool.concat(GM.built.splice(0));GM.pool=shuffle(GM.pool);renderScramble();
  }
}
/* để admin.html và tools/check-data.js đọc được */
try{window.SK_DEF=SK_DEF;}catch(e){}
window.EFZ_LOADED=window.EFZ_LOADED||{};window.EFZ_LOADED.games=1;
