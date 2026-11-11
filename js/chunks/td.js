'use strict';
/* English Fun Zone — Game Thủ thành (Tower Defense).
   File này được js/app.js tải KHI CẦN (xem EFZ_CHUNKS). Sửa nội dung ở đây, không cần đụng app.js. */
/* ================= 🏰 TOWER DEFENSE (canvas, Blooket-style) ================= */
const TT={
 frog:{em:'🐸',name:'Ếch',cost:50,range:95,dmg:10,rate:.55,color:'#22c55e',atk:'tongue',skill:'👅 Lè lưỡi tóm mồi',
  perks:{3:'👅 Lưỡi quét — sát thương lan 28',5:'🐊 Tiến hoá Cá Sấu — lan 42',7:'🐉 Tiến hoá Rồng Nước — lan 58',10:'🌊 Sóng thần — lan 75, quét cả đàn'}},
 bee:{em:'🐝',name:'Ong',cost:70,range:90,dmg:8,rate:.3,color:'#eab308',atk:'sting',skill:'⚡ Chích nọc — MÀI MÒN GIÁP cho cả đội',
  perks:{3:'🗡️ Nọc xuyên 40% giáp · mài mòn tới -5 giáp',5:'🗡️ Nọc xuyên 70% giáp · mài mòn tới -7 giáp',7:'🗡️ Xuyên giáp HOÀN TOÀN · mài mòn tới -9 giáp',10:'🐝 Ong Nữ Hoàng — chích 2 mục tiêu · mài mòn tới -12 giáp'}},
 cat:{em:'🐱',name:'Mèo',cost:80,range:92,dmg:18,rate:.8,color:'#f59e0b',atk:'claw',skill:'🐾 Vồ cào sắc lẹm',
  perks:{3:'💥 Chí mạng 20% ×2',5:'🐯 Tiến hoá Hổ — chí mạng 30% ×2',7:'🦁 Tiến hoá Sư Tử — chí mạng 40% ×2.2',10:'👑 Sư Tử Vương — chí mạng 50% ×2.5'}},
 snake:{em:'🐍',name:'Rắn',cost:100,range:92,dmg:15,rate:.75,color:'#16a34a',atk:'venom',slow:true,skill:'☠️ Phun độc làm chậm',
  perks:{3:'☠️ Độc ăn mòn — mất máu liên tục',5:'❄️ Làm chậm mạnh hơn (50%)',7:'☠️ Độc cực mạnh',10:'🐉 Rồng Rắn — chậm 60% + độc huỷ diệt'}},
 owl:{em:'🦉',name:'Cú',cost:120,range:145,dmg:25,rate:1.0,color:'#8b5cf6',atk:'dart',skill:'🪶 Phi lông tầm xa',
  perks:{3:'🎯 Bắn 2 mục tiêu cùng lúc',5:'🔭 Tầm bắn xa hơn',7:'🎯 Bắn 3 mục tiêu',10:'🎯 Bắn 4 mục tiêu + tầm xa nhất bản đồ'}},
 dragon:{em:'🐲',name:'Rồng',cost:180,range:88,dmg:48,rate:1.3,color:'#ef4444',atk:'fire',splash:44,skill:'🔥 Phun lửa diện rộng',
  perks:{3:'🔥 Thiêu đốt — quái cháy mất máu',5:'💨 Nổ lửa rộng hơn',7:'🌋 Cháy nặng — thiêu rụi cả đàn',10:'☄️ Rồng Cổ Đại — bão lửa huỷ diệt'}},
 hero:{em:'🦸',name:'Siêu Anh Hùng',cost:6000,range:150,dmg:480,rate:.25,color:'#0ea5e9',atk:'beam',splash:72,unlock:55,unlockS:55,
  skill:'💥 Siêu tia năng lượng — bắn cực nhanh, nổ cực rộng, xuyên giáp · gọi đệ tử 🥷',
  perks:{3:'🗡️ Xuyên giáp HOÀN TOÀN',5:'💥 Chí mạng 35% ×2.4 · 🥷 gọi đệ tử ra chặn đường',7:'🎯 Bắn 4 mục tiêu cùng lúc',10:'🌟 Tối Thượng — 5 mục tiêu · chí mạng 50% ×2.8 · nổ huỷ diệt'}},
 mage:{em:'🧙',name:'Pháp Sư Băng',cost:1100,range:150,dmg:250,rate:.55,color:'#6366f1',atk:'frost',splash:52,slow:true,unlock:20,unlockS:20,
  skill:'🔮 Bão băng — đóng băng cả cụm quái, xuyên giáp',
  perks:{3:'❄️ Băng giá sâu — làm chậm 55%',5:'🎯 Bắn 2 mục tiêu · xuyên 60% giáp',7:'🧊 Làm chậm 35% · nổ băng rộng hơn · 3 mục tiêu · chí mạng 25% ×2.2',10:'🔮 Đại Pháp Sư — 4 mục tiêu · xuyên giáp hoàn toàn · chí mạng 40% ×2.4'}},
 robot:{em:'🤖',name:'Chiến Binh Máy',cost:2600,range:140,dmg:150,rate:.16,color:'#0891b2',atk:'laser',unlock:35,unlockS:35,
  skill:'🔫 Đại liên laser — bắn cực nhanh, gọi drone 🛸 hỗ trợ',
  perks:{3:'🗡️ Xuyên giáp hoàn toàn',5:'🛸 Gọi drone chiến đấu',7:'🎯 Bắn 3 mục tiêu',10:'⚙️ Cỗ Máy Tối Thượng — 5 mục tiêu · chí mạng 40% ×2.5'}},
 titan:{em:'🐉',name:'Thần Long',cost:700,range:125,dmg:132,rate:.5,color:'#f59e0b',atk:'fire',splash:58,unlock:10,unlockS:10,
  skill:'🌋 Long Diễm — thiêu cả cụm quái · gọi ĐÀN RỒNG CON 🐲 bay tán loạn cắn quái',
  perks:{3:'🔥 Thiêu đốt nặng',5:'🐲 Gọi đàn rồng con bay tấn công',7:'🎯 Bắn 3 mục tiêu · nổ rộng hơn',10:'👑 Long Thần — 4 mục tiêu · chí mạng 45% ×2.6 · đàn rồng đông gấp đôi'}}
};
const TD_MAXLV=20;
/* Tiến hoá theo mốc cấp: [cấp, emoji, tên mới] — đổi hình thì đổi luôn tên cho khớp */
const TD_EVO={
 frog  :[[1,'🐸','Ếch'],       [3,'🐊','Cá Sấu'],   [5,'🐊','Cá Sấu Chúa'],[7,'🐊','Thuỷ Quái'],    [10,'🐊','Thuỷ Quái Thần']],
 bee   :[[1,'🐝','Ong'],       [3,'🐝','Ong Thợ'],  [5,'🐝','Ong Chúa'],   [7,'🐝','Ong Chúa Vàng'],[10,'🐝','Ong Nữ Hoàng']],
 cat   :[[1,'🐱','Mèo'],       [3,'🐯','Hổ Con'],   [5,'🐯','Hổ'],         [7,'🦁','Sư Tử'],        [10,'🦁','Sư Tử Vương']],
 snake :[[1,'🐍','Rắn'],       [3,'🐍','Rắn Lục'],  [5,'🐍','Mãng Xà'],    [7,'🐍','Rắn Thần'],     [10,'🐍','Mãng Xà Thần']],
 owl   :[[1,'🦉','Cú'],        [3,'🦅','Đại Bàng'], [5,'🦅','Đại Bàng Lớn'],[7,'🦅','Đại Bàng Vàng'],[10,'🦅','Đại Bàng Chúa']],
 dragon:[[1,'🐲','Rồng'],      [3,'🐲','Rồng Lửa'], [5,'🐲','Rồng Bão Lửa'],[7,'🐲','Rồng Bạo Chúa'],[10,'🐲','Rồng Cổ Đại']],
 hero  :[[1,'🦸','Siêu Anh Hùng'],[3,'🦸','Siêu Anh Hùng Thép'],[5,'🦸','Siêu Anh Hùng Sấm Sét'],[7,'🦸','Siêu Anh Hùng Vũ Trụ'],[10,'🦸','Siêu Anh Hùng Tối Thượng']],
 mage  :[[1,'🧙','Pháp Sư Băng'],[3,'🧙','Pháp Sư Sương Giá'],[5,'🧙','Pháp Sư Băng Hà'],[7,'🧙','Đại Pháp Sư'],[10,'🧙','Chúa Tể Băng Giá']],
 robot :[[1,'🤖','Chiến Binh Máy'],[3,'🤖','Máy Chiến Hạng Nặng'],[5,'🤖','Cỗ Máy Laser'],[7,'🤖','Siêu Máy Chiến'],[10,'🤖','Cỗ Máy Tối Thượng']],
 titan :[[1,'🐉','Thần Long'],[3,'🐉','Thần Long Lửa'],[5,'🐉','Thần Long Bão Diễm'],[7,'🐉','Cổ Thần Long'],[10,'🐉','Long Thần Vô Cực']]
};
/* Cấp 13 · 16 · 20 là các bậc THĂNG HOA chung cho mọi trụ */
const TD_ASCEND={13:'⭐ Tinh Thông — sát thương +25%',16:'🌟 Siêu Việt — tầm bắn +20%, bắn nhanh hơn 15%',20:'👑 HUYỀN THOẠI — sát thương ×1.6, kỹ năng riêng mạnh gấp đôi'};
function td2Rank(lv){return lv>=20?' · Huyền Thoại':lv>=16?' · Siêu Việt':lv>=13?' · Tinh Thông':''}
function td2Evo(type,lv){const a=TD_EVO[type]||[[1,TT[type].em,TT[type].name]];let r=a[0];for(const e of a)if(lv>=e[0])r=e;return r}
function td2TowerName(t){return td2Evo(t.type,t.level)[2]+td2Rank(t.level)+((t.star||0)?' '+'★'.repeat(t.star):'')}
/* Các loại quái — hệ số nhân trên máu chuẩn của đợt */
const TD_KIND={
 grunt :{em:['👾','🐛','🐀','🕷️'],hp:1,   sp:1,   armor:0,name:'Quái thường',from:1},
 runner:{em:['🦗','🐇'],          hp:.55, sp:1.8, armor:0,name:'Chạy nhanh',from:2},
 tank  :{em:['🐢','🦏'],          hp:2.4, sp:.62, armor:1,name:'Giáp dày',from:6},
 swarm :{em:['🐜','🦟'],          hp:.32, sp:1.28,armor:0,name:'Bầy đàn',from:8},
 ghost :{em:['👻','💀'],          hp:.85, sp:1.15,armor:0,noSlow:true,name:'Ma trơi (miễn làm chậm)',from:10},
 stealth:{em:['🥷','🕶️'],        hp:1,   sp:1.15,armor:0,hide:true,   name:'Tàng hình (ẩn 3s · hồi máu khi ẩn)',from:20},
 breaker:{em:['🪨','🗿'],         hp:1.6, sp:.72, armor:2,wreck:true, name:'Ném Đá (đập vỡ máu trụ)',from:12},
 sapper :{em:['🔧','🧨'],         hp:1.4, sp:.9,  armor:1,zap:true,    name:'Phá trụ (tê liệt + phá máu trụ)',from:25},
 medic  :{em:['💉','🧪'],         hp:1.2, sp:.95, armor:0,heal:true,   name:'Y tá (hồi máu đồng bọn · giải thiêu đốt)',from:30},
 mirror :{em:['🪞','🛡️'],         hp:1.6, sp:.85, armor:2,noSplash:true,name:'Phản đòn (miễn lan · PHẢN SÁT THƯƠNG lên trụ)',from:35},
 splitter:{em:['🧫','🦠'],        hp:1.5, sp:.9,  armor:1,split:true,  name:'Phân thân (chết thì tách làm 2)',from:45},
 flyer  :{em:['🦅','🦇'],         hp:.95, sp:1.35,armor:0,fly:true,noSlow:true,name:'Biết bay (lính không chặn được)',from:55}
};
/* Boss theo tầng — mỗi 5 đợt, có giáp + kỹ năng riêng, miễn làm chậm */
const TD_BOSS=[
 {em:'👹',name:'Quỷ Đất',      hpM:3.5,spM:.85,armor:1, ab:['rage','zap'],                          tip:'Nổi giận khi yếu máu · ⚡ ĐẬP TRỤ làm trụ tê liệt vài giây!'},
 {em:'🧟',name:'Xác Sống Chúa',hpM:3.5,spM:.78,armor:2, ab:['regen','heal','aura'],                         tip:'Tự hồi · 💉 hồi máu cả đàn · 👑 HÀO QUANG giảm 35% sát thương cho quái quanh nó!'},
 {em:'🐲',name:'Rồng Lửa',     hpM:4,spM:.92,armor:2, ab:['summon','rage','hide','aura'],                 tip:'Gọi lính · nổi giận · 💨 TÀNG HÌNH khiến trụ mất mục tiêu!'},
 {em:'👾',name:'Quái Vũ Trụ',  hpM:4.5,spM:.86,armor:3, ab:['shield','summon','noSplash','zap','aura'],               tip:'KHIÊN chắn · 🪞 miễn sát thương lan · ⚡ đập trụ · 👑 hào quang bảo vệ cả đàn!'},
 {em:'🦖',name:'Bạo Chúa',     hpM:5,spM:.95,armor:3,ab:['shield','regen','summon','rage','zap','hide','noSplash','aura','heal'],tip:'Hội tụ MỌI kỹ năng: khiên · hồi máu · gọi lính · nổi giận · đập trụ · tàng hình · miễn lan!'}
];
function td2BossOf(r){return TD_BOSS[Math.min(Math.max(0,Math.floor(r/5)-1),TD_BOSS.length-1)]}
/* 🗺️ Bản đồ & địa hình — đường đi khác nhau + hiệu ứng riêng (chế độ Sinh Tồn bốc ngẫu nhiên) */
const TD_MAPS=[
 {id:'grass',name:'Đồng Cỏ',em:'🌿',a:'#86efac',b:'#a7f3c0',road:'#a07854',road2:'#c8a27a',
  W:[[-30,80],[200,80],[200,200],[90,200],[90,320],[330,320],[330,200],[455,200],[520,200]],castle:{x:455,y:200},
  mod:{},tip:'Cân bằng — không có hiệu ứng đặc biệt, hợp để tập chơi.'},
 {id:'desert',name:'Sa Mạc',em:'🏜️',a:'#fde68a',b:'#fcd34d',road:'#d6a663',road2:'#eaca94',
  W:[[-30,60],[400,60],[400,160],[80,160],[80,280],[420,280],[520,280]],castle:{x:420,y:280},
  mod:{espd:1.2,trange:1.12},tip:'☀️ Cát nóng — quái chạy nhanh +20%, bù lại trời quang nên trụ nhìn xa +12%.'},
 {id:'ice',name:'Băng Giá',em:'🧊',a:'#bae6fd',b:'#e0f2fe',road:'#93c5fd',road2:'#dbeafe',
  W:[[-30,340],[120,340],[120,120],[260,120],[260,300],[380,300],[380,140],[450,140],[520,140]],castle:{x:450,y:140},
  mod:{espd:.8,ehp:1.25},tip:'❄️ Băng trơn — quái đi chậm -20% nhưng lông dày, máu +25%.'},
 {id:'jungle',name:'Rừng Rậm',em:'🌴',a:'#4ade80',b:'#34d399',road:'#8b5a2b',road2:'#a97c50',
  W:[[-30,60],[160,60],[160,180],[40,180],[40,300],[220,300],[220,160],[340,160],[340,320],[440,320],[520,320]],castle:{x:440,y:320},
  mod:{trange:.88},tip:'🌳 Cây rậm che khuất — tầm bắn trụ -12%, bù lại đường đi dài nhất bản đồ.'},
 {id:'volcano',name:'Núi Lửa',em:'🌋',a:'#57534e',b:'#44403c',road:'#991b1b',road2:'#dc2626',
  W:[[-30,200],[140,200],[140,80],[300,80],[300,320],[420,320],[520,320]],castle:{x:420,y:320},
  mod:{ehp:1.12,trate:.9},tip:'🔥 Đường NGẮN NHẤT nên rất khó — quái +12% máu, nhưng hơi nóng giúp trụ bắn nhanh +10%.'}
];
/* ⚡ Phép chiến đấu — mua bằng vàng, có hồi chiêu */
const TD_SPELLS={
 freeze:{em:'❄️',name:'Đóng băng',at:1, desc:'Làm chậm <b>70%</b> tất cả quái trong 6 giây',cd:16,mult:1.8, min:130},
 bomb  :{em:'☄️',name:'Thiên thạch',at:5, desc:'Nổ khắp bản đồ, <b>bỏ qua giáp</b>, sát thương rất lớn',cd:22,mult:3.0, min:260},
 wall  :{em:'🛡️',name:'Tường lính',at:12,desc:'Gọi <b>5 lính 💂</b> chặn ngang đường — quái phải đánh mới qua',cd:26,mult:3.6, min:340},
 rage  :{em:'⚡',name:'Cuồng nộ',at:25,desc:'<b>Mọi trụ bắn nhanh gấp đôi</b> trong 10 giây',cd:32,mult:5.0, min:560},
 heal  :{em:'💚',name:'Hồi sinh',at:30,desc:'Hồi <b>+5 ❤️</b> cho thành (tối đa 40)',cd:65,mult:7.5, min:900},
 storm :{em:'🌀',name:'Lốc xoáy',at:40,desc:'<b>Đẩy lùi</b> toàn bộ quái về sau 250 bước',cd:38,mult:8.5, min:1100},
 apoc  :{em:'☢️',name:'Huỷ diệt',at:60,desc:'Sát thương <b>cực lớn</b> toàn bản đồ — bỏ qua giáp lẫn khiên',cd:75,mult:15, min:2200}
};
/* 💸 Giá phép bám theo thu nhập của đợt, và MỖI LẦN DÙNG TRONG CÙNG MỘT ĐỢT thì đắt lên ~2 lần
   → không thể spam phép để "cày" qua màn; hết đợt giá tự trở về mức gốc. */
const TD_SPELL_ESC=2.0;
function td2SpellAt(k){return TD_SPELLS[k].at||1}
function td2SpellLocked(k){return GM.round<td2SpellAt(k)}
function td2SpellUses(k){return (GM&&GM.spellUse&&GM.spellUse[k])||0}
function td2SpellBaseCost(k,r){const S=TD_SPELLS[k];return Math.max(S.min,Math.round(S.mult*td2AnsGoldAt(r)));}
function td2SpellCost(k){
  const r=(GM&&GM.round)||1;
  return Math.round(td2SpellBaseCost(k,r)*Math.pow(TD_SPELL_ESC,td2SpellUses(k)));
}
function td2Spell(k){
  if(!GM||GM.type!=='tower2')return;
  const S=TD_SPELLS[k],cd=(GM.spellCd&&GM.spellCd[k])||0;
  if(td2SpellLocked(k)){toast('🔒 '+S.em+' '+S.name+' mở ở đợt '+S.at+'!');return}
  if(cd>0){toast('⏳ '+S.name+' đang hồi chiêu — còn '+Math.ceil(cd)+'s');return}
  const cost=td2SpellCost(k);
  if(GM.gold<cost){toast('Chưa đủ vàng! '+S.name+' cần '+cost+'🪙');return}
  if(!GM.enemies.length&&k!=='wall'&&k!=='heal'&&k!=='rage'){toast('Chưa có quái nào để dùng '+S.name+'!');return}
  GM.gold-=cost;GM.spellCd=GM.spellCd||{};GM.spellCd[k]=S.cd;
  GM.spellUse=GM.spellUse||{};GM.spellUse[k]=(GM.spellUse[k]||0)+1;
  if(GM.spellUse[k]>=2)toast('💸 '+S.em+' '+S.name+' lần sau trong đợt này sẽ tốn '+td2SpellCost(k).toLocaleString('vi')+'🪙 — hết đợt mới về giá gốc!');
  const base=td2BaseHP(GM.round)*td2Mod('ehp',1);
  if(k==='freeze'){
    for(const e of GM.enemies){if(e.dead)continue;e.slowT=6;e.slowP=e.boss?.6:.3}
    toast('❄️ Đóng băng! Toàn bộ quái chậm hẳn trong 6 giây');
  }else if(k==='bomb'){
    const d=base*3;
    for(const e of GM.enemies){if(e.dead)continue;
      if(e.shield>0){const ab=Math.min(e.shield,d);e.shield-=ab;e.hp-=(d-ab)}else e.hp-=d;
      td2FxAdd({x1:e.x,y1:e.y,x2:e.x,y2:e.y,c:'#f97316',kind:'boom',lv:3,t:0,dur:.5});
      if(e.hp<=0){e.dead=true;e.killed=true}}
    toast('☄️ Thiên thạch rơi! −'+Math.round(d)+' máu mỗi con');
  }else if(k==='wall'){
    if(!GM.minions)GM.minions=[];
    const hp=Math.round(base*2.6),dmg=Math.round(base*.3);
    for(let i=0;i<5;i++){const d0=Math.max(20,GM.total*.55-i*34),pp=td2Pos(d0);
      GM.minions.push({owner:null,d:d0,minD:d0,x:pp.x,y:pp.y,hp,max:hp,dmg,rate:.5,cd:0,em:'💂',dead:false,fight:0})}
    toast('🛡️ Tường lính dựng lên! 5 lính 💂 chặn ngang đường');
  }else if(k==='rage'){
    GM.rageT=10;toast('⚡ CUỒNG NỘ! Mọi trụ bắn nhanh gấp đôi trong 10 giây');
  }else if(k==='heal'){
    GM.lives=Math.min(40,GM.lives+5);toast('💚 Hồi sinh! Thành được +5 ❤️ (còn '+GM.lives+')');
  }else if(k==='storm'){
    let n=0;for(const e of GM.enemies){if(e.dead)continue;e.d=Math.max(0,e.d-250);const q=td2Pos(e.d);e.x=q.x;e.y=q.y;n++;
      td2FxAdd({x1:e.x,y1:e.y,x2:e.x,y2:e.y,c:'#38bdf8',kind:'boom',lv:1,t:0,dur:.4})}
    toast('🌀 Lốc xoáy! Đẩy lùi '+n+' quái về sau');
  }else if(k==='apoc'){
    const d=base*12;let n=0;
    for(const e of GM.enemies){if(e.dead)continue;e.shield=0;e.hp-=d;n++;
      td2FxAdd({x1:e.x,y1:e.y,x2:e.x,y2:e.y,c:'#a3e635',kind:'boom',lv:5,t:0,dur:.7});
      if(e.hp<=0){e.dead=true;e.killed=true}}
    toast('☢️ HUỶ DIỆT! −'+Math.round(d)+' máu lên '+n+' quái, phá tan mọi khiên');
  }
  confetti(40);sndWin();td2HUD();td2Side();
}
function td2SpellBar(){
  return Object.keys(TD_SPELLS).map(k=>{
    const S=TD_SPELLS[k],lock=td2SpellLocked(k),cd=(GM.spellCd&&GM.spellCd[k])||0,cost=td2SpellCost(k),u=td2SpellUses(k);
    const ok=!lock&&cd<=0&&GM.gold>=cost;
    return `<button class="btn ${ok?'sun':'ghost'} sm" style="width:calc(25% - 3px);min-width:0;padding:5px 1px;font-size:10px;line-height:1.2;${ok?'':'opacity:.45'}" onclick="td2Spell('${k}')" title="${S.desc.replace(/<[^>]+>/g,'')} — giá gấp đôi sau mỗi lần dùng trong cùng một đợt">
      <div style="font-size:15px">${lock?'🔒':S.em}</div>${S.name}${u?`<span style="color:#dc2626">×${u+1}</span>`:''}<br><b>${lock?'Đợt '+S.at:(cd>0?'⏳'+Math.ceil(cd)+'s':cost.toLocaleString('vi')+'🪙')}</b></button>`}).join('');
}
/* 🔓 Lộ trình mở khoá — cho học sinh thấy phần thưởng phía trước */
function td2NextUnlock(){
  const items=[];
  for(const k in TT)if(TT[k].unlock)items.push({at:td2UnlockAt(k),t:TT[k].em+' '+TT[k].name,kind:'trụ'});
  for(const k in TD_SPELLS)items.push({at:td2SpellAt(k),t:TD_SPELLS[k].em+' '+TD_SPELLS[k].name,kind:'phép'});
  const nx=items.filter(i=>i.at>GM.round).sort((a,b)=>a.at-b.at)[0];
  return nx?`🔓 Sắp mở: <b>${nx.t}</b> (${nx.kind}) ở <b>đợt ${nx.at}</b> — còn ${nx.at-GM.round} đợt!`
           :'🏆 Đã mở khoá toàn bộ trụ &amp; phép — cố lên tới đợt 100!';
}
function td2MapBanner(){
  const M=td2Map(),n=3-((GM.round-1)%3);
  return `${M.em} Địa hình: <b>${M.name}</b> — ${M.tip}<br><span style="color:var(--violet)">🔄 Đổi địa hình sau <b>${n}</b> đợt nữa</span>`;
}
/* 🔄 Cứ 3 đợt đổi sang địa hình mới — trụ được DỜI TỰ ĐỘNG sang chỗ hợp lệ, giữ nguyên cấp */
function td2ChangeMap(){
  const old=GM.map;
  const M=rnd(TD_MAPS.filter(m=>m.id!==old.id));GM.map=M;
  GM.path=[];GM.total=0;
  const W=M.W;
  for(let i=0;i<W.length-1;i++){const x1=W[i][0],y1=W[i][1],x2=W[i+1][0],y2=W[i+1][1];const len=Math.hypot(x2-x1,y2-y1);GM.path.push({x1,y1,x2,y2,len});GM.total+=len}
  GM.castle={x:M.castle.x,y:M.castle.y};
  GM.enemies=[];GM.minions=[];GM.queue=[];GM.fx=[];
  const spots=[];
  for(let gx=20;gx<=460;gx+=40)for(let gy=20;gy<=380;gy+=40){
    if(td2NearPath(gx,gy)<24)continue;
    if(Math.hypot(gx-GM.castle.x,gy-GM.castle.y)<40)continue;
    let c=0;for(let d=0;d<GM.total;d+=12){const q=td2Pos(d);if(Math.hypot(q.x-gx,q.y-gy)<=100)c++}
    spots.push({x:gx,y:gy,c});
  }
  spots.sort((a,b)=>b.c-a.c);
  const used=[];
  GM.towers.slice().sort((a,b)=>b.level-a.level).forEach(t=>{
    const sp=spots.find(q=>!used.some(u=>Math.hypot(u.x-q.x,u.y-q.y)<34));
    if(sp){t.x=sp.x;t.y=sp.y;used.push(sp)}
    td2Stats(t);
  });
  GM.sel=null;GM.place=null;
  const el=$('td2map');if(el)el.innerHTML=td2MapBanner();
  confetti(60);sndWin();
  toast('🔄 ĐỔI ĐỊA HÌNH! '+old.em+' '+old.name+' → '+M.em+' '+M.name+' — trụ đã dời sang chỗ hợp lệ, giữ nguyên cấp!');
}
function td2Map(){return (typeof GM==='object'&&GM&&GM.map)||TD_MAPS[0]}
function td2Mod(k,d){const m=td2Map().mod||{};return m[k]===undefined?d:m[k]}
/* 🌤️ 20 đợt đầu là "giai đoạn làm quen": mọi chỉ số của quái được hạ xuống rồi
   tăng dần lên 100% đúng ở đợt 20. Từ đợt 21 trở đi mới vào đường cong khó thật. */
const TD_WARM_TO=20, TD_WARM_MIN=.34;
function td2Warm(r){
  if(r>=TD_WARM_TO)return 1;
  return TD_WARM_MIN+(1-TD_WARM_MIN)*Math.pow((r-1)/(TD_WARM_TO-1),1.85);
}
function td2BaseHP(r){
  /* tăng nhanh 30 đợt đầu rồi chậm lại để chơi được tới đợt 100 */
  const a=Math.min(r-1,30),b=Math.max(0,r-31);
  /* từ đợt 21 quái dày máu thêm dần (bù lại việc trụ bậc cao gọi quân & hút máu) */
  const late=r>TD_WARM_TO?(1+Math.min(1.1,(r-TD_WARM_TO)*.035)):1;
  return Math.round((32*Math.pow(1.145,a)*Math.pow(1.082,b)+r*14)*td2Warm(r)*late);
}
/* 💰 Kinh tế bám theo độ khó: vàng mỗi mạng quái, thưởng qua đợt và vàng trả lời
   đều tính từ máu quái của đợt đó, nên càng lên cao càng đủ tiền mua & nâng cấp */
/* mốc quy đổi vàng: sau đợt 60 chỉ tăng tuyến tính, không bám máu quái nữa */
function td2GoldRef(r){return r<=60?td2BaseHP(r):Math.round(td2BaseHP(60)*(1+(r-60)*.06))}
function td2Reward(r){return Math.max(2+Math.floor(r/4),Math.round(td2GoldRef(r)*.005))}
function td2RoundBonus(r){return Math.max(25+r*4,Math.round(td2GoldRef(r)*.05))}
function td2AnsGoldAt(r){return Math.max(40+r*14,Math.round(td2GoldRef(r)*.62))}
function td2AnsGold(){return td2AnsGoldAt((GM&&GM.round)||1)}
function td2BaseSpeed(r){const f=56+Math.min(r,30)*1.8+Math.max(0,r-30)*.45;return 38+(f-38)*td2Warm(r)}
/* ⭐ Cấp sao của quái: từ đợt 50, cứ 12 đợt quái lên 1 sao (tối đa 6) — mạnh & dày giáp hơn */
function td2Star(r){return Math.max(0,Math.min(6,Math.floor((r-50)/12)+ (r>=50?1:0)))}
function td2StarHp(r){return Math.pow(1.32,td2Star(r))}
function td2Armor(r,base){return base?Math.round(base*(1+Math.floor(r/8))):0}
/* lưu rồi thoát ra danh sách game */
function td2SaveExit(){
  if(GM&&GM.running){toast('⏳ Đang đánh — hết đợt này mới lưu & thoát được nhé!');return}
  if(td2Save(true)){td2StopLoop();setTimeout(()=>{GM=null;gamesHome()},450)}
}
function td2Snapshot(){
  if(!GM||GM.type!=='tower2')return null;
  return {v:3,ts:Date.now(),
    who:(typeof P==='object'&&P&&P.name)||'',
    mode:GM.mode||'normal', mapId:(GM.map&&GM.map.id)||'grass',
    gold:Math.round(GM.gold), lives:GM.lives, round:GM.round,
    kills:GM.kills||0, bossKills:GM.bossKills||0,
    roster:GM.roster||null, speed:GM.speed||1,
    towers:(GM.towers||[]).map(t=>({type:t.type,x:t.x,y:t.y,level:t.level,star:t.star||0,
      hp:Math.max(1,Math.round(t.hp||0)),broken:!!t.broken}))};
}
function td2Save(manual){
  const snap=td2Snapshot();
  if(!snap){if(manual)toast('Chưa có ván nào đang chơi để lưu!');return false}
  if(GM.running){if(manual)toast('⏳ Đang đánh nhau — hết đợt này sẽ lưu được nhé!');return false}
  try{localStorage.setItem(TD_SAVE_KEY,JSON.stringify(snap))}catch(e){
    if(manual)toast('😢 Trình duyệt không cho lưu (chế độ ẩn danh?)');return false}
  if(manual){sndOK();toast('💾 Đã lưu: đợt '+snap.round+' · ❤️'+snap.lives+' · 🪙'+snap.gold.toLocaleString('vi'))}
  efzCloudPush();
  return true;
}
function td2ClearSave(){try{localStorage.removeItem(TD_SAVE_KEY)}catch(e){}}
/* ===== 🔄 MỐC ĐẦU ĐỢT — để thua rồi đánh lại chính đợt đó, không phải làm lại từ đợt 1 =====
   Chụp đúng lúc bấm "Bắt đầu đợt": vàng, máu thành, và toàn bộ trụ với cấp/sao/máu lúc đó. */
const TD_CKPT_KEY='efz_td_ckpt';
let TD_CK=null;
function td2Ckpt(){
  const s=td2Snapshot(); if(!s)return;
  TD_CK=s;
  try{localStorage.setItem(TD_CKPT_KEY,JSON.stringify(s))}catch(e){}
}
function td2CkptGet(){
  if(TD_CK&&TD_CK.round)return TD_CK;
  try{const d=JSON.parse(localStorage.getItem(TD_CKPT_KEY));return (d&&d.round)?d:null}catch(e){return null}
}
function td2CkptClear(){TD_CK=null;try{localStorage.removeItem(TD_CKPT_KEY)}catch(e){}}
function td2Replay(){
  const d=td2CkptGet();
  if(!d){sndNo();toast('Không còn mốc đợt nào để đánh lại — bắt đầu ván mới nhé!');startTower('normal');return}
  td2Restore(d);
  td2Shell(d.mode==='survival');
  sndOK();confetti(40);
  toast('🔄 Đánh lại đợt '+d.round+' — đã trả lại '+(d.towers||[]).length+' trụ và 🪙'+(d.gold||0).toLocaleString('vi'));
}
function td2TimeAgo(ts){
  const m=Math.round((Date.now()-ts)/60000);
  if(m<1)return 'vừa xong';
  if(m<60)return m+' phút trước';
  const h=Math.round(m/60); if(h<24)return h+' giờ trước';
  return Math.round(h/24)+' ngày trước';
}
/* ---- khôi phục ván đã lưu ---- */
function td2Restore(d){
  const M=TD_MAPS.find(m=>m.id===d.mapId)||TD_MAPS[0];
  GM={type:'tower2',mode:d.mode||'normal',map:M,gold:d.gold,lives:d.lives,round:d.round,
      kills:d.kills||0,bossKills:d.bossKills||0,towers:[],enemies:[],minions:[],fx:[],queue:[],
      running:false,place:null,sel:null,spawnT:0,spawnGap:.7,last:0,qLocked:false,
      speed:d.speed||1,spellCd:{},spellUse:{},rageT:0,pop:[],bergs:[],roster:d.roster||null};
  const W=M.W;GM.path=[];GM.total=0;
  for(let i=0;i<W.length-1;i++){const x1=W[i][0],y1=W[i][1],x2=W[i+1][0],y2=W[i+1][1];
    const len=Math.hypot(x2-x1,y2-y1);GM.path.push({x1,y1,x2,y2,len});GM.total+=len}
  GM.castle={x:M.castle.x,y:M.castle.y};
  for(const o of (d.towers||[])){
    if(!TT[o.type])continue;
    const T=TT[o.type],t={type:o.type,x:o.x,y:o.y,level:Math.max(1,o.level||1),star:o.star||0,
                          cd:0,color:T.color,atk:T.atk};
    td2Stats(t);t.hp=Math.min(t.maxHp,Math.max(1,o.hp||t.maxHp));t.broken=!!o.broken;
    GM.towers.push(t);
  }
  return GM;
}
/* ---- mã sao lưu (chuyển máy) ---- */
function td2ExportCode(){
  const d=td2Snapshot()||td2SaveMeta();
  if(!d){toast('Chưa có tiến độ nào để xuất!');return}
  let code='';
  try{code='EFZ1'+btoa(unescape(encodeURIComponent(JSON.stringify(d))))}catch(e){toast('Không tạo được mã');return}
  const el=$('td2code');
  if(el){el.value=code;el.select();
    try{document.execCommand('copy');toast('📋 Đã sao chép mã sao lưu vào bộ nhớ tạm!')}catch(e){toast('Hãy bôi đen rồi Ctrl+C để chép mã nhé!')}}
}
function td2ImportCode(){
  const el=$('td2code');if(!el)return;
  const code=(el.value||'').trim();
  if(!code){toast('Hãy dán mã sao lưu vào ô rồi bấm Nhập!');return}
  let d=null;
  try{d=JSON.parse(decodeURIComponent(escape(atob(code.replace(/^EFZ1/,'')))))}catch(e){}
  if(!d||!d.round){sndNo();toast('😵 Mã sao lưu không hợp lệ!');return}
  try{localStorage.setItem(TD_SAVE_KEY,JSON.stringify(d))}catch(e){}
  sndOK();confetti(40);toast('✅ Đã nhập tiến độ: đợt '+d.round+' · ❤️'+d.lives);
  td2Enter(d.mode==='survival'?'survival':'normal');
}
/* ---- màn hình vào game: Chơi tiếp / Chơi mới ---- */
function td2CardBox(ico,tit,body,btns,note){
  return `<div style="background:linear-gradient(135deg,#eef2ff,#fdf4ff);border:2px solid #ddd6fe;border-radius:16px;padding:16px;text-align:center;margin-bottom:12px">
      <div style="font-size:34px;line-height:1">${ico}</div>
      <h3 style="margin:6px 0 2px">${tit}</h3>
      <p class="sub" style="margin:0 0 10px">${body}</p>
      <div class="row" style="gap:8px;justify-content:center;flex-wrap:wrap">${btns}</div>
      ${note?`<p style="font-size:11.5px;color:var(--muted);font-weight:600;margin:10px 0 0">${note}</p>`:''}
    </div>`;
}
function td2Enter(mode){
  const d=td2SaveMeta(), ck=td2CkptGet();
  sndClick();
  /* Không còn gì để tiếp tục -> vào thẳng ván mới */
  if(!d&&!ck){startTower(mode);return}
  const surv=((d&&d.mode)||(ck&&ck.mode))==='survival';
  const nm=surv?'survival':'normal';
  let boxes='';
  if(d){
    boxes+=td2CardBox('💾','Có một ván đang chơi dở',
      `${d.mode==='survival'?'🔥 Sinh Tồn':'🏰 Thường'} · <b>Đợt ${d.round}</b> · ❤️ ${d.lives} · 🪙 ${(d.gold||0).toLocaleString('vi')} ·
       <b>${(d.towers||[]).length} trụ</b><br>
       <span style="font-size:12px">Lưu ${td2TimeAgo(d.ts)}${d.who?' · người chơi <b>'+esc(d.who)+'</b>':''}</span>`,
      `<button class="btn" onclick="td2Continue()">▶️ Chơi tiếp đợt ${d.round}</button>
       <button class="btn ghost" onclick="td2NewGame('${d.mode==='survival'?'survival':'normal'}')">🆕 Chơi ván mới</button>`,
      '⚠️ Bấm "Chơi ván mới" sẽ <b>xoá</b> ván đang lưu.');
  }
  /* 🔄 Mốc đầu đợt — tự ghi mỗi lần bấm "Bắt đầu đợt", KHÔNG cần bấm Lưu.
     Chỉ hiện khi nó khác với bản lưu, kẻo hai thẻ giống hệt nhau gây rối. */
  if(ck&&(!d||ck.round!==d.round||ck.ts>(d.ts||0)+1000)){
    boxes+=td2CardBox('🔄','Đợt gần nhất em vừa đánh',
      `${ck.mode==='survival'?'🔥 Sinh Tồn':'🏰 Thường'} · <b>Đợt ${ck.round}</b> · ❤️ ${ck.lives} · 🪙 ${(ck.gold||0).toLocaleString('vi')} ·
       <b>${(ck.towers||[]).length} trụ</b><br>
       <span style="font-size:12px">Ghi lúc vào đợt · ${td2TimeAgo(ck.ts)}</span>`,
      `<button class="btn teal" onclick="td2Replay()">🔄 Đánh lại đợt ${ck.round}</button>`,
      'Mốc này <b>tự ghi</b> mỗi lần bấm "Bắt đầu đợt" — quên bấm Lưu vẫn đánh lại được.');
  }
  if(!d&&!boxes){startTower(mode);return}
  $('gamesCard').innerHTML=gameTop('🏰 Thủ thành','<span class="streak">'+poolLabel()+'</span>')+
   `<div style="max-width:560px;margin:0 auto">
      ${boxes}
      <div id="td2qmode" style="margin-top:12px">${td2QModeBar()}</div>
      <div style="margin-top:12px;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:12px">
        <div style="font-weight:800;font-size:13px;margin-bottom:6px">📋 Mã sao lưu — dùng để chuyển sang máy/trình duyệt khác</div>
        <textarea id="td2code" rows="2" style="width:100%;font-size:10px;font-family:monospace;border:1px solid #e5e7eb;border-radius:9px;padding:7px;resize:vertical" placeholder="Bấm 'Xuất mã' để lấy mã, hoặc dán mã từ máy khác vào đây rồi bấm 'Nhập mã'"></textarea>
        <div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap">
          <button class="btn sun sm" onclick="td2ExportCode()">⬆️ Xuất mã &amp; sao chép</button>
          <button class="btn teal sm" onclick="td2ImportCode()">⬇️ Nhập mã</button>
        </div>
        <div id="efzCloudBox" style="margin-top:10px">${efzCloudBox()}</div>
      </div>
    </div>`;
}
function td2Continue(){
  const d=td2SaveMeta();
  if(!d){toast('Không tìm thấy bản lưu — bắt đầu ván mới nhé!');startTower('normal');return}
  td2Restore(d);
  td2Shell(d.mode==='survival');
  sndOK();confetti(40);
  toast('▶️ Chơi tiếp từ đợt '+d.round+' — '+(d.towers||[]).length+' trụ đã được dựng lại!');
}
function td2NewGame(mode){
  if(!confirm('Xoá ván đang lưu và bắt đầu ván mới?'))return;
  td2ClearSave();startTower(mode);
}
function startTower(mode){
  td2CkptClear();   /* ván mới: bỏ mốc của ván trước */
  const surv=(mode==='survival');
  const M=rnd(TD_MAPS);
  GM={type:'tower2',mode:surv?'survival':'normal',map:M,gold:180,lives:25,round:1,kills:0,bossKills:0,
      towers:[],enemies:[],minions:[],fx:[],queue:[],running:false,place:null,sel:null,spawnT:0,spawnGap:.7,last:0,qLocked:false,speed:1,spellCd:{},spellUse:{},rageT:0,pop:[],bergs:[]};
  const W=M.W;
  GM.path=[];GM.total=0;
  for(let i=0;i<W.length-1;i++){const x1=W[i][0],y1=W[i][1],x2=W[i+1][0],y2=W[i+1][1];const len=Math.hypot(x2-x1,y2-y1);GM.path.push({x1,y1,x2,y2,len});GM.total+=len;}
  GM.castle={x:M.castle.x,y:M.castle.y};
  sndClick();
  td2Shell(surv);
}
function td2Shell(surv){
  const intro=surv
    ? `<p class="sub" style="margin:0 0 6px">🔥 <b>Sinh Tồn</b>: đánh <b>không giới hạn đợt</b> — sống càng lâu điểm càng cao! Cứ <b>3 đợt lại đổi sang địa hình mới</b> — trụ tự dời chỗ, giữ nguyên cấp! 🐉 <b>Thần Long</b> mở từ <b>đợt 10</b> và biết <b>gọi đàn rồng con 🐲</b> bay tán loạn cắn quái. Từ đợt 10 câu hỏi cũng <b>trộn tất cả chủ đề</b> 🎲!</p>`
    : `<p class="sub" style="margin:0 0 6px"><b>Trả lời đúng là cách kiếm vàng chính</b> (giết quái &amp; qua đợt chỉ được chút ít) — chọn <b>🔤 Từ vựng</b>, <b>📚 Ngữ pháp</b> hay <b>🎲 Cả hai</b> ở thanh ngay dưới đây — có vàng thì mua <b>trụ thú</b> đặt lên bản đồ — trụ tự bắn quái chạy theo đường. Nâng cấp tới <b>Lv.20</b> — kỹ năng &amp; tiến hoá ở Lv.3·5·7·10, thăng hoa ở Lv.13·16·20. Cứ <b>5 đợt có 1 BOSS</b> 👹 có giáp &amp; chiêu riêng. Cứ <b>3 đợt đổi 1 địa hình</b> 🔄. Trụ &amp; phép <b>mở dần theo đợt</b> (🐉 đợt 10 · 🧙 đợt 20 · 🤖 đợt 35 · 🦸 đợt 55). Từ <b>đợt 10</b> mở 🐉 <b>Thần Long</b> (gọi đàn rồng con 🐲) và <b>đề trộn tất cả chủ đề</b> 🎲. Qua <b>đợt 15</b> phải <b>chốt đội hình tối đa 6 trụ</b> 🎖️. Trụ có <b>máu</b> và bị quái đánh sập được — trụ <b>Lv.13+ tự hồi máu</b> 💚. Bí quá thì dùng <b>⚡ phép chiến đấu</b>! 🏰</p>`;
  $('gamesCard').innerHTML=gameTop(surv?'🔥 Thủ thành Sinh Tồn':'🏰 Thủ thành','<span class="streak">'+poolLabel()+'</span>')+intro+
    `<div id="td2map" style="font-size:12px;font-weight:700;line-height:1.5;background:linear-gradient(90deg,#eef2ff,#fdf4ff);border:1px solid #ddd6fe;border-radius:11px;padding:7px 10px;margin:0 0 7px">
       ${td2MapBanner()}
     </div>
     <div class="td2-hud">
       <span class="td2-pill">🪙 <b id="td2gold">180</b></span>
       <span class="td2-pill">❤️ <b id="td2life">25</b></span>
       <span class="td2-pill">🌊 Đợt <b id="td2round">1</b></span>
       <span class="td2-pill">💀 <b id="td2kills">0</b></span>
       <span class="td2-pill">👹 <b id="td2boss">0</b></span>
     </div>
     <div id="td2qmode">${td2QModeBar()}</div>
     <div class="td2-q" id="td2q"></div>
     <div class="td2-wrap">
       <div class="td2-left">
         <canvas id="td2cv" width="480" height="400" class="td2-canvas"></canvas>
         <div id="td2board" class="td2board"></div>
       </div>
       <div class="td2-side" id="td2side"></div>
     </div>`;
  $('td2cv').onclick=td2Click;
  td2Side();td2Q();td2HUD();
  GM.last=0;td2StartLoop();
}
function startTowerSurvival(){td2Enter('survival')}
/* khoảng cách dọc đường gần 1 điểm nhất — dùng để thả đệ tử ra đường */
function td2NearestD(px,py){
  let best=0,bd=1e9,acc=0;
  for(const s of GM.path){const dx=s.x2-s.x1,dy=s.y2-s.y1,l2=dx*dx+dy*dy;
    let t=l2?((px-s.x1)*dx+(py-s.y1)*dy)/l2:0;t=Math.max(0,Math.min(1,t));
    const d=Math.hypot(px-(s.x1+t*dx),py-(s.y1+t*dy));
    if(d<bd){bd=d;best=acc+t*s.len}acc+=s.len}
  return best;
}
function td2Pos(d){let r=d;for(const s of GM.path){if(r<=s.len){const t=s.len?r/s.len:0;return{x:s.x1+(s.x2-s.x1)*t,y:s.y1+(s.y2-s.y1)*t}}r-=s.len}const L=GM.path[GM.path.length-1];return{x:L.x2,y:L.y2}}
function td2DistSeg(px,py,s){const dx=s.x2-s.x1,dy=s.y2-s.y1,l2=dx*dx+dy*dy;let t=l2?((px-s.x1)*dx+(py-s.y1)*dy)/l2:0;t=Math.max(0,Math.min(1,t));return Math.hypot(px-(s.x1+t*dx),py-(s.y1+t*dy))}
function td2NearPath(px,py){let m=1e9;for(const s of GM.path)m=Math.min(m,td2DistSeg(px,py,s));return m}
function td2Click(ev){
  if(!GM||GM.type!=='tower2')return;
  const cv=$('td2cv'),r=cv.getBoundingClientRect();
  const rs=GM._rs||1;
  const x=(ev.clientX-r.left)*(cv.width/r.width)/rs,y=(ev.clientY-r.top)*(cv.height/r.height)/rs;
  const hit=GM.towers.find(t=>Math.hypot(t.x-x,t.y-y)<18);
  if(GM.place&&!hit){td2Place(x,y);return}
  GM.sel=hit||null;if(hit)GM.place=null;td2Side();
}
function td2UnlockAt(k){const T=TT[k];if(!T.unlock)return 0;return (GM&&GM.mode==='survival'&&T.unlockS)?T.unlockS:T.unlock}
function td2Locked(k){if(GM.roster&&GM.roster.indexOf(k)<0)return true;const u=td2UnlockAt(k);return !!(u&&GM.round<u)}
function td2Pick(t){
  if(td2Locked(t)){toast('🔒 '+TT[t].name+' chỉ mở sau khi qua đợt '+(td2UnlockAt(t)-1)+'!');return}
  if(GM.gold<TT[t].cost){toast('Chưa đủ vàng mua '+TT[t].name+'!');return}
  GM.place=t;GM.sel=null;sndClick();td2Side()}
function td2Place(px,py){
  const t=GM.place;if(!t)return;const T=TT[t];
  if(td2Locked(t)){toast('🔒 Chưa mở khoá trụ này!');GM.place=null;td2Side();return}
  const gx=Math.floor(px/40)*40+20,gy=Math.floor(py/40)*40+20;
  if(GM.gold<T.cost){toast('Chưa đủ vàng!');return}
  if(gx<16||gx>464||gy<16||gy>384){toast('Ngoài bản đồ!');return}
  if(td2NearPath(gx,gy)<24){toast('Không đặt trên đường đi nhé!');return}
  if(Math.hypot(gx-GM.castle.x,gy-GM.castle.y)<40){toast('Quá gần thành!');return}
  if(GM.towers.some(o=>Math.hypot(o.x-gx,o.y-gy)<34)){toast('Đã có trụ ở đó!');return}
  GM.gold-=T.cost;
  const nt={type:t,x:gx,y:gy,level:1,cd:0,color:T.color,atk:T.atk};
  td2Stats(nt);nt.hp=nt.maxHp;GM.towers.push(nt);
  sndOK();GM.sel=nt;GM.place=null;td2Side()
}
/* Sức mạnh hero: ×1.35 sát thương, ×0.93 hồi chiêu mỗi cấp + mốc kỹ năng Lv.3 và Lv.5 */
function td2Stats(t){
  const T=TT[t.type],L=t.level-1,lv=t.level;
  const A16=lv>=16;
  t.dmg=Math.round(T.dmg*Math.pow(1.22,L)*(lv>=13?1.25:1)*(lv>=20?1.6:1));
  t.range=Math.round((T.range+L*3)*(A16?1.2:1)*td2Mod('trange',1));
  t.rate=+(T.rate*Math.pow(.965,L)*(A16?.85:1)*td2Mod('trate',1)).toFixed(3);
  t.splash=T.splash?Math.round(T.splash*(1+L*.045)*(lv>=20?1.5:1)):0;
  t.slow=!!T.slow;t.slowP=T.slow?.65:1;
  t.pierce=0;t.crit=0;t.critX=2;t.burn=0;t.multi=1;t.shred=0;t.shredMax=0;
  if(t.type==='frog') t.splash= lv>=10?75: lv>=7?58: lv>=5?42: lv>=3?28:0;
  if(t.type==='bee'){ t.pierce= lv>=7?1: lv>=5?.7: lv>=3?.4:0; t.shred=1; t.shredMax=2+lv; if(lv>=10)t.multi=2 }
  if(t.type==='cat'){ if(lv>=10){t.crit=.5;t.critX=2.5} else if(lv>=7){t.crit=.4;t.critX=2.2} else if(lv>=5){t.crit=.3} else if(lv>=3){t.crit=.2} }
  if(t.type==='snake'){ t.burn= lv>=10?.26: lv>=7?.18: lv>=3?.1:0; t.slowP= lv>=10?.4: lv>=5?.5:.65 }
  if(t.type==='owl'){ t.multi= lv>=10?4: lv>=7?3: lv>=3?2:1; if(lv>=5)t.range+=25; if(lv>=10)t.range+=25 }
  if(t.type==='dragon'){ t.burn= lv>=10?.3: lv>=7?.22: lv>=3?.12:0; if(lv>=5)t.splash+=8; if(lv>=10)t.splash+=16 }
  if(t.type==='mage'){ t.pierce= lv>=10?1: lv>=5?.6:.3; t.multi= lv>=10?4: lv>=7?3: lv>=5?2:1;
    if(lv>=10){t.crit=.4;t.critX=2.4} else if(lv>=7){t.crit=.25;t.critX=2.2}
    t.slowP= lv>=7?.35: lv>=3?.45:.55; if(lv>=7)t.splash+=14;
    /* 🧊 TẢNG BĂNG: từ Lv.3 pháp sư dựng băng chặn ngang đường ~1 giây */
    if(lv>=3){ t.berg=1; t.bergHold= lv>=10?1.8: lv>=7?1.5: lv>=5?1.2:1;
      t.bergRate=Math.max(3,9-lv*.5); if(t.bergCd===undefined)t.bergCd=2 } }
  if(t.type==='robot'){ t.pierce= lv>=3?1:.5; t.multi= lv>=13?6: lv>=10?5: lv>=7?3:1;
    if(lv>=10){t.crit=.4;t.critX=2.5}
    /* 🛸 Drone: gọi sớm hơn (Lv.3), đông hơn và nhanh hơn nhiều */
    if(lv>=3){ t.mCount=2+Math.floor(lv/3); t.mHpK=1+.5*lv; t.mDmg=Math.round(t.dmg*.55);
      t.mRate=Math.max(1.2,4.2-lv*.28); t.mEm='🛸'; if(t.mCd===undefined)t.mCd=1.5 } }
  if(t.type==='titan'){ t.burn= lv>=3?.35:.2; t.multi= lv>=10?4: lv>=7?3:1;
    if(lv>=10){t.crit=.45;t.critX=2.6} else if(lv>=5){t.crit=.3;t.critX=2.2}
    /* 🐲 ĐÀN RỒNG CON: bay tán loạn, cắn quái — vai trò như đệ tử của anh hùng */
    if(lv>=5){ t.mCount=(lv>=10?2:1)+Math.floor(lv/3); t.mHpK=.8+.42*lv;
      t.mDmg=Math.round(t.dmg*.42); t.mRate=Math.max(2,6.5-lv*.42); t.mEm='🐲'; t.mFly=1;
      if(t.mCd===undefined)t.mCd=2 } }
  if(t.type==='dragon'&&lv>=10){ /* 🐲 Rồng thường Lv.10 cũng gọi được 1-2 rồng con */
    t.mCount=1+Math.floor((lv-10)/6); t.mHpK=.6+.3*lv; t.mDmg=Math.round(t.dmg*.4);
    t.mRate=Math.max(3.5,9-lv*.3); t.mEm='🐲'; t.mFly=1; if(t.mCd===undefined)t.mCd=3 }
  if(t.type==='hero'){ t.pierce= lv>=3?1:.5;
    if(lv>=10){t.crit=.5;t.critX=2.8;t.multi=5;t.splash+=34}
    else if(lv>=7){t.crit=.35;t.critX=2.4;t.multi=4;t.splash+=16}
    else if(lv>=5){t.crit=.35;t.critX=2.4}
    /* 🥷 Đệ tử: số lượng, máu, sát thương, nhịp gọi — đều theo cấp anh hùng */
    if(lv>=5){ t.mCount=1+Math.floor(lv/3);
      t.mHpK=.9+.45*lv;
      t.mDmg=Math.round(t.dmg*.55);
      t.mRate=Math.max(2.2,6.5-lv*.42);
      if(t.mCd===undefined)t.mCd=2 } }
  if(lv>=20){ t.crit=Math.min(.75,t.crit*1.6); t.burn*=2; t.multi=t.multi+1; t.shredMax=t.shredMax?t.shredMax*2:0; if(t.slow)t.slowP=Math.max(.25,t.slowP*.7) }
  /* 🛡️ MÁU TRỤ — quái và boss có thể đánh sập trụ */
  const stv=t.star||0;
  const ratio=(t.maxHp&&t.hp!==undefined)?Math.max(0,Math.min(1,t.hp/t.maxHp)):1;
  t.maxHp=Math.round((60+T.cost*.25+(t.level-1)*22)*(1+stv*.25));
  t.hp=Math.round(t.maxHp*ratio);
  /* 💚 Bậc cao biết TỰ HỒI MÁU, Lv.20 còn hồi cho trụ xung quanh */
  t.regen = (lv>=20?.08: lv>=16?.05: lv>=13?.03: 0) + stv*.015;
  t.auraHeal = lv>=20?.02:0;
  /* 🩸 HÚT MÁU — trụ bậc cao hồi máu cho chính nó mỗi đòn đánh trúng */
  t.lifesteal = (lv>=20?.022: lv>=16?.014: lv>=13?.008: 0) + stv*.004;
  /* ⭐ Đại cường hoá sau Lv20: mỗi sao +35% sát thương, +6% tầm, +4% nhịp bắn */
  const st=t.star||0;
  if(st){ t.dmg=Math.round(t.dmg*Math.pow(1.35,st)); t.range=Math.round(t.range*(1+st*.06));
    t.rate=+(t.rate*Math.pow(.96,st)).toFixed(3); if(t.splash)t.splash=Math.round(t.splash*(1+st*.1)); }
  t.em=td2Evo(t.type,t.level)[1];
  return t;
}
const TD_MAXSTAR=5;
function td2StarCost(t){return Math.round(TT[t.type].cost*45*Math.pow(2.1,t.star||0))}
function td2UpCost(t){return Math.round(TT[t.type].cost*.9*Math.pow(1.26,t.level-1))}
function td2Paid(t){let p=TT[t.type].cost;for(let l=1;l<t.level;l++)p+=Math.round(TT[t.type].cost*.9*Math.pow(1.26,l-1));return p}
function td2Upgrade(){
  const t=GM.sel;if(!t)return;const TU=TT[t.type];
  if(t.level>=TD_MAXLV){
    if((t.star||0)>=TD_MAXSTAR){toast('👑 '+td2TowerName(t)+' đã đạt ĐỈNH CAO: Lv.20 ★★★★★!');return}
    const sc=td2StarCost(t);
    if(GM.gold<sc){toast('⭐ Đại cường hoá cần '+sc.toLocaleString('vi')+'🪙');return}
    GM.gold-=sc;t.star=(t.star||0)+1;td2Stats(t);sndOK();confetti(50);sndWin();
    toast('⭐ ĐẠI CƯỜNG HOÁ! '+td2TowerName(t)+' → '+'★'.repeat(t.star)+' (+35% sát thương)');
    td2Side();return;
  }
  const cost=td2UpCost(t);
  if(GM.gold<cost){toast('Chưa đủ vàng! Cần '+cost+'🪙 để nâng '+td2TowerName(t));return}
  const oldName=td2TowerName(t);
  GM.gold-=cost;t.level++;td2Stats(t);sndOK();
  const newName=td2TowerName(t),perk=(TU.perks&&TU.perks[t.level])||TD_ASCEND[t.level];
  toast((newName!==oldName?'✨ '+oldName+' tiến hoá → ':'⬆️ ')+t.em+' '+newName+' Lv.'+t.level+(perk?' · '+perk:''));
  if(perk){confetti(30);sndWin()}
  td2Side()
}
function td2Sell(){const t=GM.sel;if(!t)return;const rf=Math.round(td2Paid(t)*.6);GM.gold+=rf;GM.towers=GM.towers.filter(x=>x!==t);GM.sel=null;sndClick();toast('Đã bán +'+rf+'🪙');td2Side()}
function td2Preview(r){
  const ks=Object.keys(TD_KIND).filter(k=>r>=TD_KIND[k].from);
  const B=(r%5===0)?td2BossOf(r):null;
  const st=td2Star(r);
  const W=td2Warm(r);
  const rush=r>=6?` · <b style="color:#dc2626">⚡ ĐỢT DỒN cuối đợt: ${Math.max(1,Math.round(Math.min(7,2+Math.floor(r/7))*W))} 🏃 trinh sát</b>${r>=12?` + <b style="color:#dc2626">🏇 Sứ giả</b> (dai · miễn làm chậm)`:''}`
    :(r<6?` · <span style="color:#16a34a;font-weight:800">🌤️ Giai đoạn làm quen (tới đợt ${TD_WARM_TO})</span>`:'');
  return `🔭 <b>Đợt ${r}</b> — máu quái ~<b>${Math.round(td2BaseHP(r)*td2StarHp(r)).toLocaleString('vi')}</b>${st?` · quái <b style="color:#d97706">${'★'.repeat(st)} tinh nhuệ</b> (+${st*2} giáp)`:''} · ${ks.map(k=>TD_KIND[k].em[0]+' '+TD_KIND[k].name).join(' · ')}${rush}`
    +(B?`<br><span style="color:#dc2626">⚠️ ${B.em} <b>BOSS ${B.name}</b> · 🛡️giáp ${B.armor} · ❤️−3 nếu lọt thành — ${B.tip}<br>💡 Trụ luôn <b>ưu tiên bắn Boss</b>, nhớ đủ trụ để chặn quái thường!</span>`:'');
}
function td2Side(){
  const shop=Object.keys(TT).filter(k=>!GM.roster||GM.roster.indexOf(k)>=0).map(k=>{const T=TT[k],lock=td2Locked(k),aff=!lock&&GM.gold>=T.cost;
    return `<button class="td2-tower ${GM.place===k?'sel':''}" style="${aff?'':'opacity:.45'}${lock?';border-color:#cbd5e1':''}" onclick="td2Pick('${k}')"><span class="ic">${lock?'🔒':T.em}</span>${T.name}<span class="pr">${lock?'Đợt '+td2UnlockAt(k):T.cost+'🪙'}</span></button>`}).join('');
  let info;
  if(GM.sel){const t=GM.sel,T=TT[t.type],max=t.level>=TD_MAXLV,uc=td2UpCost(t),rf=Math.round(td2Paid(t)*.6);
    const ALL=Object.assign({},T.perks||{},TD_ASCEND);
    const owned=Object.keys(ALL).filter(l=>t.level>=+l).map(l=>ALL[l]);
    const nl=Object.keys(ALL).map(Number).sort((a,b)=>a-b).find(l=>l>t.level);
    const next=nl?ALL[nl]:null;
    const maxed=max&&(t.star||0)>=TD_MAXSTAR, sc=td2StarCost(t);
    const hpr=t.maxHp?Math.round(100*t.hp/t.maxHp):100;
    const rcost=Math.max(30,Math.round(td2Paid(t)*.18*(t.broken?1:(1-(t.hp||0)/(t.maxHp||1)))));
    info=`<b>${t.em||T.em} ${td2TowerName(t)} · Lv.${t.level}/${TD_MAXLV}${maxed?' 👑ĐỈNH CAO':''}</b>`
      +`<br><span style="font-size:11px;font-weight:700;color:${t.broken?'#ef4444':hpr<50?'#f59e0b':'#059669'}">${t.broken?'💥 TRỤ ĐÃ SẬP — ngừng bắn!':'🛡️ Máu trụ '+Math.round(t.hp)+'/'+t.maxHp+' ('+hpr+'%)'}${t.regen?' · 💚 tự hồi '+Math.round(t.regen*100)+'%/s':''}${t.auraHeal?' · hồi cho trụ quanh nó':''}</span>`
      +(t.broken||hpr<100?`<div style="margin-top:4px"><button class="btn teal sm" style="width:100%" onclick="td2Repair()">🔧 Sửa trụ ${rcost.toLocaleString('vi')}🪙</button></div>`:'')+`<br><span style="color:var(--violet);font-weight:700;font-size:11px">${T.skill||''}</span><br>⚔️ ${t.dmg} · 🎯 ${Math.round(t.range)} · ⏱️ ${t.rate.toFixed(2)}s${t.shred?` · 💥 mài mòn tối đa -${t.shredMax} giáp`:''}${t.pierce?` · 🗡️ xuyên ${Math.round(t.pierce*100)}% giáp`:''}${t.lifesteal?` · 🩸 hút máu ${(t.lifesteal*100).toFixed(1)}%/đòn`:''}${t.berg?` · 🧊 dựng băng chặn ${t.bergHold}s mỗi ${t.bergRate.toFixed(1)}s`:''}${t.mCount?`<br>${t.mEm||'🥷'} Gọi <b>${t.mCount}</b> ${t.mEm==='🐲'?'rồng con':t.mEm==='🛸'?'drone':'đệ tử'} · ⚔️ ${t.mDmg}/đòn · 🛡️ máu ${Math.round(td2BaseHP(GM.round)*td2Mod('ehp',1)*t.mHpK)} · ⏳ ${t.mRate.toFixed(1)}s/lượt`:''}`
      +(owned.length?`<br><span style="color:#059669;font-weight:700;font-size:11px">✅ ${owned.join('<br>✅ ')}</span>`:'')
      +(next?`<br><span style="color:#d97706;font-weight:700;font-size:11px">🔒 Lv.${nl}: ${next}</span>`:'')
      +(max?`<br><span style="color:#f59e0b;font-weight:800;font-size:11px">⭐ Đại cường hoá: ${t.star||0}/${TD_MAXSTAR} sao · mỗi sao +35% sát thương</span>`:'')
      +`<div class="row" style="margin-top:5px">${maxed?'<button class="btn ghost sm" disabled>👑 Đỉnh cao</button>':max?`<button class="btn sun sm" onclick="td2Upgrade()">⭐ Cường hoá ${sc.toLocaleString('vi')}🪙</button>`:`<button class="btn sun sm" onclick="td2Upgrade()">⬆️ Nâng ${uc}🪙</button>`}<button class="btn ghost sm" onclick="td2Sell()">💲 Bán +${rf}</button></div>`;}
  else if(GM.place)info=`Đang chọn <b>${TT[GM.place].em} ${TT[GM.place].name}</b> — chạm chỗ trống trên bản đồ để đặt.`;
  else info='Chạm 1 trụ ở cửa hàng rồi chạm bản đồ để đặt. Chạm trụ đã đặt để nâng cấp / bán. Trụ lên tối đa <b>Lv.20</b>: kỹ năng &amp; tiến hoá ở <b>Lv.3·5·7·10</b>, thăng hoa ⭐🌟👑 ở <b>Lv.13·16·20</b>. 🐝 Ong <b>mài mòn giáp</b> quái cho MỌI trụ cùng bắn. 🐉 <b>Thần Long</b> (đợt 10) gọi <b>đàn rồng con 🐲</b>, 🧙 <b>Pháp Sư Băng</b> (đợt 20) dựng <b>tảng băng 🧊 chặn đường</b>, 🤖 <b>Chiến Binh Máy</b> (đợt 35) thả <b>drone 🛸</b> liên tục, 🦸 <b>Siêu Anh Hùng</b> (đợt 55) mạnh nhất game. Trụ <b>Lv.13+ hút máu 🩸</b> mỗi đòn đánh trúng.';
  const sd=$('td2side');if(!sd)return;
  sd.innerHTML=`<div style="font-weight:800;font-size:13px;margin-bottom:4px">🏪 Cửa hàng trụ</div><div class="td2-shop">${shop}</div>`+
    (GM.running
      ?`<button class="btn ghost" style="width:100%" disabled>⚔️ Đang đánh đợt ${GM.round}...</button>`
      :GM.pickPhase?'<button class="btn ghost" style="width:100%" disabled>🎖️ Đang chọn đội hình...</button>':`<div style="font-size:11px;font-weight:600;line-height:1.55;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:6px 8px;margin:6px 0">${td2Preview(GM.round)}</div><button class="btn teal" style="width:100%" onclick="td2StartRound()">▶️ Bắt đầu đợt ${GM.round}</button>`)+
    `<div class="row" style="gap:6px;margin-top:6px;align-items:center"><span style="font-weight:800;font-size:12px;color:var(--muted)">⚡ Tốc độ</span>${[1,2,4].map(s=>`<button class="btn ${GM.speed===s?'teal':'ghost'} sm" style="flex:1;padding:6px 0" onclick="td2Speed(${s})">${s}×</button>`).join('')}</div>
     <div style="font-weight:800;font-size:12px;margin:8px 0 3px">⚡ Phép chiến đấu <span style="color:var(--muted);font-weight:600">— dùng vàng để cứu nguy</span></div>
     <div id="td2spells" style="display:flex;flex-wrap:wrap;gap:4px;align-items:stretch">${td2SpellBar()}</div>
     <div class="row" style="gap:4px;margin-top:6px">
       <button class="btn ghost sm" style="flex:1;padding:6px 4px;font-size:11.5px" onclick="td2Save(true)" title="Lưu tiến độ (chỉ lưu được khi chưa vào đợt)">💾 Lưu</button>
       <button class="btn ghost sm" style="flex:1;padding:6px 4px;font-size:11.5px" onclick="td2SaveExit()" title="Lưu rồi thoát ra ngoài">🚪 Lưu &amp; thoát</button>
       <button class="btn ghost sm" style="padding:6px 8px;font-size:11.5px" onclick="td2ToggleFps()" title="Hiện số khung hình/giây">📊</button>
     </div>
     <div class="row" style="gap:4px;margin-top:4px">
       ${['auto','hi','lo'].map(q=>`<button class="btn ${TD_QUAL===q?'teal':'ghost'} sm" style="flex:1;padding:5px 2px;font-size:10.5px" onclick="td2SetQual('${q}')" title="Mức đồ hoạ">${TD_QNAME[q]}</button>`).join('')}
     </div>
     <div style="font-size:11px;font-weight:700;color:var(--violet);background:#f5f3ff;border-radius:9px;padding:5px 8px;margin-top:6px">${td2NextUnlock()}</div>
     <button class="btn ghost sm" style="width:100%;margin-top:6px" onclick="td2GameOver(1)">🏁 Kết thúc &amp; nhận XP</button>
     <div id="td2info" style="font-size:11.5px;color:var(--muted);margin-top:7px;min-height:36px">${info}</div>`;
}
/* ===== ❓ Câu hỏi cho Thủ thành: KHÔNG LẶP + KHÓ DẦN theo đợt ===== */
const TD_TIERS=[null,
 {n:1,lab:'🟢 Dễ',    upto:8,  note:'từ vựng · có tranh gợi ý'},
 {n:2,lab:'🟡 Vừa',   upto:20, note:'thêm 🎧 nghe · 📝 điền từ'},
 {n:3,lab:'🟠 Khó',   upto:40, note:'thêm 🔤 điền chữ · 📚 ngữ pháp · nhiễu cùng chủ đề'},
 {n:4,lab:'🔴 Rất khó',upto:70,note:'thêm 📖 đọc hiểu · ngữ pháp khó hơn'},
 {n:5,lab:'🟣 Siêu khó',upto:999,note:'6 đáp án · ngữ pháp nâng cao · đọc hiểu'}];
function td2QTier(){const r=(GM&&GM.round)||1;for(let i=1;i<=5;i++)if(r<=TD_TIERS[i].upto)return i;return 5}
/* bản đồ từ → chủ đề, để lấy đáp án nhiễu cùng chủ đề cho khó hơn */
function td2WordTopic(w){
  if(!GM._wt){GM._wt={};for(const t of DATA[grade].topics||[])for(const v of (t.vocab||[]))GM._wt[v[0]]=t.id}
  return GM._wt[w];
}
/* túi từ: rút hết mới xáo lại → không bao giờ lặp từ trong 1 vòng
   (tên phải khác td2Draw() vốn là hàm vẽ bản đồ) */
function td2DrawWord(){
  const pool=td2Pool(),key=(GM.round>10?'all':'sel')+'|'+pool.length;
  if(!GM.qBag||!GM.qBag.length||GM.qBagKey!==key){GM.qBagKey=key;GM.qBag=shuffle(pool.slice())}
  const w=GM.qBag.pop();
  return (w&&w[0])?w:rnd(pool);
}
function td2MaskWord(w){
  const a=w.split('');let idx=[];
  for(let i=0;i<a.length;i++)if(/[a-zA-Z]/.test(a[i]))idx.push(i);
  const hide=Math.max(1,Math.round(idx.length*.4));
  shuffle(idx).slice(0,hide).forEach(i=>a[i]='_');
  return a.join('');
}
/* ===== 🎒 Kho dạng câu hỏi: từ vựng · nghe · điền · ngữ pháp · đọc hiểu ===== */
let tdAutoSay=localStorage.getItem('efz_tdsay')!=='0';
function td2Say(){const w=GM&&GM.cur&&(GM.cur.sayNow||GM.cur.say||GM.cur.sayWord);if(w)try{speak(w,.85)}catch(e){}}
function td2SayWord(){const w=GM&&GM.cur&&(GM.cur.sayWord||GM.cur.sayNow);if(w)try{speak(w,.85)}catch(e){}}
function td2AutoSay(txt,delay){if(!tdAutoSay||!txt)return;setTimeout(()=>{try{speak(txt,.85)}catch(e){}},delay||420)}
function td2SayBtns(q,after){
  if(!q||!q.sayWord)return '';
  const tog=`<button type="button" class="btn ghost sm" id="td2sayb" onclick="td2ToggleSay()">${tdAutoSay?'🔊 Tự phát: BẬT':'🔇 Tự phát: TẮT'}</button>`;
  if(after||q.sayNow)return `<div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;margin:5px 0"><button type="button" class="btn sun sm" onclick="td2SayWord()">🔊 Nghe phát âm</button>${tog}</div>`;
  return `<div style="display:flex;gap:6px;align-items:center;justify-content:center;flex-wrap:wrap;margin:5px 0"><span style="font-size:11.5px;color:var(--muted);font-weight:700">🤫 Trả lời xong sẽ nghe phát âm</span>${tog}</div>`;
}
function td2ToggleSay(){
  tdAutoSay=!tdAutoSay;try{localStorage.setItem('efz_tdsay',tdAutoSay?'1':'0')}catch(e){}
  const b=$('td2sayb');if(b)b.innerHTML=tdAutoSay?'🔊 Tự phát: BẬT':'🔇 Tự phát: TẮT';
  toast(tdAutoSay?'🔊 Đã BẬT tự động phát âm từ khi chơi':'🔇 Đã TẮT tự động phát âm');
  if(tdAutoSay&&GM&&GM.cur&&GM.cur.sayNow)td2Say();
  if(!tdAutoSay)try{speechSynthesis.cancel()}catch(e){}
}
/* tìm 1 câu trong bài đọc có chứa từ, để làm dạng điền vào chỗ trống */
function td2Cloze(word){
  const D=DATA[grade]||{};
  const esc2=word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const re=new RegExp('\\b'+esc2+'\\b','i');
  /* nguồn câu: bài đọc + lời thoại bài nghe */
  const bank=[];
  for(const r of (D.readings||[]))for(const sen of String(r.text||'').split(/(?<=[.!?])\s+/))bank.push(sen);
  for(const l of (D.listenings||[]))for(const ln of (l.script||[]))bank.push(String(ln.text||''));
  for(const sen of shuffle(bank)){
    const t=sen.trim();
    if(t.length>14&&t.length<170&&re.test(t))return t.replace(re,'______');
  }
  return null;
}
/* 🎧 nghe từ → chọn nghĩa */
function td2QListen(right,others){
  return {say:right[0],
    prompt:`<div class="prompt-card"><div style="font-size:11px;color:#0891b2;font-weight:800">🎧 LUYỆN NGHE</div>
      <div style="font-size:32px;line-height:1.1">🔊</div>
      <div style="font-size:12px;color:var(--muted);font-weight:600;margin-top:4px">Nghe từ tiếng Anh rồi chọn <b>nghĩa tiếng Việt</b> đúng</div></div>`,
    opts:[{t:right[1],ok:1},...others.map(o=>({t:o[1],ok:0}))],
    note:right[0]+' = '+right[1]};
}
/* 📝 điền từ vào chỗ trống trong câu thật */
function td2QFill(right,others){
  const sen=td2Cloze(right[0]);
  if(!sen)return null;
  return {prompt:`<div class="prompt-card" style="text-align:left"><div style="font-size:11px;color:#d97706;font-weight:800">📝 ĐIỀN TỪ VÀO CÂU</div>
      <b style="font-size:13.5px;line-height:1.6;display:block;margin:4px 0">${esc(sen)}</b>
      <div style="font-size:12px;color:var(--muted);font-weight:600">Chọn từ đúng để điền vào chỗ trống</div></div>`,
    opts:[{t:right[0],ok:1},...others.map(o=>({t:o[0],ok:0}))],
    note:right[0]+' = '+right[1]};
}
/* ===== 🎛️ KIỂU CÂU HỎI TRONG THỦ THÀNH: từ vựng · ngữ pháp · cả hai ===== */
let TDQM=(function(){try{return JSON.parse(localStorage.getItem('efz_tdqm'))||{}}catch(e){return{}}})();
if(TDQM.mode!=='gram'&&TDQM.mode!=='both')TDQM.mode='vocab';
if(!TDQM.gr)TDQM.gr='all';
function td2QMSave(){try{localStorage.setItem('efz_tdqm',JSON.stringify(TDQM))}catch(e){}}
/* danh sách chuyên đề ngữ pháp, bỏ trùng id (vài chuyên đề bị khai báo 2 lần) */
function td2GrList(){
  if(typeof GRAMMAR_TOPICS==='undefined'||!GRAMMAR_TOPICS)return [];
  const seen={},out=[];
  for(const t of GRAMMAR_TOPICS){
    if(!t||!t.id||!t.qs||!t.qs.length||seen[t.id])continue;
    seen[t.id]=1;out.push(t);
  }
  return out;
}
function td2GrName(){
  if(TDQM.gr==='all')return 'tất cả chuyên đề';
  const t=td2GrList().find(x=>x.id===TDQM.gr);
  return t?t.name:'tất cả chuyên đề';
}
/* ===== 🎒 KHO CÂU HỎI NGỮ PHÁP CHO GAME =====
   Mỗi chuyên đề vốn chỉ có ~10 câu trắc nghiệm nên chơi một lúc là gặp lại.
   Mục "Ôn Ngữ Pháp" còn 20 câu nữa mỗi chuyên đề (chia từ · tìm lỗi sai ·
   sắp xếp · dịch). Hai dạng ĐẦU chuyển được sang trắc nghiệm mà vẫn đúng
   tuyệt đối, nên gộp thêm vào — số câu mỗi chuyên đề tăng gần gấp đôi.
   (Sắp xếp và dịch thì không gộp: muốn thành trắc nghiệm phải bịa câu sai,
   dễ dạy nhầm cho học sinh.) */
const TD_GRQ={};
function td2GrQs(tp){
  if(TD_GRQ[tp.id])return TD_GRQ[tp.id];
  const out=[];
  for(const fn of (tp.qs||[])) out.push(fn);
  let raw=[];
  for(const fn of (tp.more||[])){try{const q=fn();if(q)raw.push(q)}catch(e){}}
  /* ✏️ "chia đúng dạng từ" -> trắc nghiệm. Mồi nhử lấy từ đáp án các câu khác
     CÙNG chuyên đề nên luôn sai rõ ràng (đề đã ghi sẵn từ gốc trong ngoặc). */
  const fills=raw.filter(q=>q.t==='fill'&&q.ans&&q.ans[0]&&q.q);
  /* gộp theo CHỮ THƯỜNG: "could" và "Could" là một đáp án, không được
     biến thành hai lựa chọn cùng đúng trong một câu */
  const uniq={};
  for(const x of fills){const a=String(x.ans[0]).trim();if(a&&!uniq[a.toLowerCase()])uniq[a.toLowerCase()]=a}
  const ansAll=Object.values(uniq);
  for(const q0 of fills){
    const right=String(q0.ans[0]).trim();
    const mồi=ansAll.filter(a=>a.toLowerCase()!==right.toLowerCase());
    if(mồi.length<3)continue;
    out.push((function(q0,right,mồi){return function(){
      const o=shuffle([right,...pickN(mồi,3)]);
      return {q:'✏️ Chia đúng dạng từ — '+q0.q, o:o, a:o.indexOf(right), e:q0.e||''};
    }})(q0,right,mồi));
  }
  /* ❗ "tìm lỗi sai" -> trắc nghiệm chọn đúng từ bị sai trong câu */
  for(const q0 of raw){
    if(q0.t!=='error'||!q0.sent||!q0.wrong)continue;
    const toks=String(q0.sent).split(/\s+/).map(w=>w.replace(/^["'(]+|[.,!?;:"')]+$/g,'')).filter(Boolean);
    const w=String(q0.wrong).trim();
    if(toks.indexOf(w)<0)continue;
    /* gộp theo CHỮ THƯỜNG: câu "He said he was busy" có cả He và he —
       nếu để cả hai làm lựa chọn thì hoá ra hai đáp án cùng đúng */
    const u={};
    for(const t of toks){
      const k=t.toLowerCase();
      if(t.length<2||k===w.toLowerCase()||u[k])continue;
      u[k]=t;
    }
    const khac=Object.values(u);
    if(khac.length<3)continue;
    out.push((function(q0,w,khac){return function(){
      const o=shuffle([w,...pickN(khac,3)]);
      return {q:'❗ Câu sau SAI ở từ nào? — "'+q0.sent+'"', o:o, a:o.indexOf(w),
              e:(q0.right?('Sửa: '+q0.right+'. '):'')+(q0.e||'')};
    }})(q0,w,khac));
  }
  TD_GRQ[tp.id]=out;
  return out;
}
/* 🎲 Bốc thăm KHÔNG LẶP: phải đi hết mọi câu trong kho rồi mới quay vòng,
   và câu đầu vòng mới không được trùng câu vừa ra. */
let TD_GRBAG=[], TD_GRBAGKEY='', TD_GRLAST='';
function td2GrDraw(pool){
  const key=pool.map(t=>t.id).join(',');
  if(!TD_GRBAG.length||TD_GRBAGKEY!==key){
    TD_GRBAGKEY=key;
    const all=[];
    for(const tp of pool){const qs=td2GrQs(tp);for(let i=0;i<qs.length;i++)all.push([tp,i])}
    if(!all.length)return null;
    TD_GRBAG=shuffle(all);
    if(TD_GRBAG.length>1){
      const cuoi=TD_GRBAG[TD_GRBAG.length-1];
      if(cuoi[0].id+'#'+cuoi[1]===TD_GRLAST)TD_GRBAG.unshift(TD_GRBAG.pop());
    }
  }
  const pick=TD_GRBAG.pop();
  if(!pick)return null;
  TD_GRLAST=pick[0].id+'#'+pick[1];
  const fns=td2GrQs(pick[0]);
  return [pick[0], fns[pick[1]]];
}
/* 📚 ngữ pháp — theo chuyên đề đã chọn, hoặc khó dần theo đợt nếu chọn "tất cả" */
function td2QGrammar(){
  const L=td2GrList(); if(!L.length)return null;
  let pool=null;
  if(TDQM.mode!=='vocab'&&TDQM.gr!=='all'){
    pool=L.filter(x=>x.id===TDQM.gr);
    if(!pool.length)pool=null;
  }
  if(!pool){
    const t=td2QTier();
    const want=t>=5?['hard','advanced']:t>=4?['medium','hard']:['easy','medium'];
    pool=L.filter(x=>want.indexOf(x.diff)>=0);
    if(!pool.length)pool=L;
  }
  if(!pool.length)return null;
  const drawn=td2GrDraw(pool);
  if(!drawn||!drawn[1])return null;
  const tp=drawn[0];let q;
  try{q=drawn[1]()}catch(e){return null}
  if(!q||!q.o)return null;
  /* chốt chặn: không bao giờ để lọt hai lựa chọn giống nhau (dù khác hoa/thường) */
  {const th={};for(const o of q.o){const k=String(o).trim().toLowerCase();if(th[k])return null;th[k]=1}}
  return {prompt:`<div class="prompt-card"><div style="font-size:11px;color:var(--violet);font-weight:800">📚 NGỮ PHÁP · ${esc(tp.name)}</div>
      <b style="font-size:14px;line-height:1.5;display:block;margin:4px 0">${esc(q.q)}</b>
      <div style="font-size:12px;color:var(--muted);font-weight:600">Chọn đáp án đúng</div></div>`,
    opts:q.o.map((t2,i)=>({t:t2,ok:i===q.a?1:0})),grOnly:1,
    note:(q.e||'')||('Đáp án: '+q.o[q.a])};
}
/* 📖 đọc hiểu — đoạn văn ngắn cuộn được + câu hỏi */
function td2QReading(){
  const rs=((DATA[grade]&&DATA[grade].readings)||[]).filter(r=>r.qs&&r.qs.length);
  if(!rs.length)return null;
  const r=rnd(rs),q=rnd(r.qs);
  if(!q||!q.o)return null;
  return {prompt:`<div class="prompt-card" style="text-align:left"><div style="font-size:11px;color:#059669;font-weight:800">📖 ĐỌC HIỂU · ${esc(r.title||'')}</div>
      <div style="max-height:110px;overflow:auto;font-size:11.5px;font-weight:500;line-height:1.65;background:#fff;border:1px solid #e5e7eb;border-radius:9px;padding:7px 9px;margin:5px 0">${esc(String(r.text||'')).replace(/\n+/g,'<br>')}</div>
      <b style="font-size:13px;line-height:1.5">${esc(q.q)}</b></div>`,
    opts:q.o.map((t2,i)=>({t:t2,ok:i===q.a?1:0})),grOnly:1,
    note:'Đáp án đúng: '+q.o[q.a]};
}
/* dạng câu hỏi mở khoá dần: mức 1 chỉ từ vựng → mức 5 có đủ 6 dạng */
function td2QMenu(){
  /* 📚 chế độ chỉ ngữ pháp: mọi câu đều là ngữ pháp */
  if(TDQM.mode==='gram')return ['grammar'];
  const t=td2QTier(),m=['vocab','vocab'];
  if(t<=2)m.push('pic');
  if(t>=2)m.push('listen','fill');
  if(t>=3)m.push('spell','grammar');
  if(t>=4)m.push('reading','grammar');
  if(t>=5)m.push('grammar','reading','fill');
  /* 🎲 chế độ cả hai: ngữ pháp xuất hiện ngay từ đợt 1, khoảng một nửa số câu.
     Phải chốt độ dài TRƯỚC khi thêm, nếu không mảng cứ dài ra mãi -> treo máy. */
  if(TDQM.mode==='both'){const n=m.length;for(let i=0;i<n;i++)m.push('grammar');}
  return m;
}
/* ---------- thanh chọn kiểu câu hỏi (hiện ngay trên câu hỏi) ---------- */
function td2QModeBar(){
  const L=td2GrList();
  const btn=(k,lab)=>`<button class="lvlchip ${TDQM.mode===k?'on':''}" onclick="td2SetQMode('${k}')">${lab}</button>`;
  let h=`<div class="selbar" style="margin:0 0 8px">
    <span class="lbl">Kiểu câu hỏi để kiếm vàng</span>
    <div>${btn('vocab','🔤 Từ vựng')}${btn('gram','📚 Ngữ pháp')}${btn('both','🎲 Cả hai')}</div>`;
  if(TDQM.mode!=='vocab'){
    if(L.length){
      h+=`<span class="lbl" style="margin-top:10px">Chuyên đề ngữ pháp <small style="text-transform:none;color:var(--violet);font-weight:700">(${L.length} chuyên đề)</small></span>
        <div><select onchange="td2SetGr(this.value)" style="width:100%;max-width:420px;font-family:inherit;font-weight:700;font-size:13px;padding:8px 10px;border:2px solid #ddd6fe;border-radius:11px;background:#fff;color:var(--ink)">
          <option value="all"${TDQM.gr==='all'?' selected':''}>🎲 Tất cả chuyên đề — khó dần theo đợt</option>
          ${L.map(t=>`<option value="${t.id}"${TDQM.gr===t.id?' selected':''}>${t.em} ${esc(t.name)} · ${esc(t.sub||'')}</option>`).join('')}
        </select></div>`;
    }else{
      h+=`<span class="lbl" style="margin-top:10px">Chưa nạp được chuyên đề ngữ pháp — tạm dùng từ vựng</span>`;
    }
  }
  return h+`</div>`;
}
function td2QModeRefresh(){
  const b=$('td2qmode'); if(b)b.innerHTML=td2QModeBar();
  if(GM&&GM.type==='tower2'&&!GM.qLocked)td2Q();
}
function td2SetQMode(m){
  TDQM.mode=m;td2QMSave();sndClick();
  toast(m==='gram'?('📚 Chỉ luyện ngữ pháp — '+td2GrName()):m==='both'?'🎲 Trộn từ vựng và ngữ pháp':'🔤 Chỉ luyện từ vựng');
  td2QModeRefresh();
}
function td2SetGr(id){ TDQM.gr=id;td2QMSave();sndClick();toast('📚 Chuyên đề: '+td2GrName());td2QModeRefresh(); }
function td2GenQ(){
  const tier=td2QTier(),pool=td2Pool();
  let right=td2DrawWord();
  if(!right||!right[0])right=rnd(pool);
  let cands=pool.filter(v=>v[0]!==right[0]);
  if(tier>=3){
    const tp=td2WordTopic(right[0]);
    const same=cands.filter(v=>td2WordTopic(v[0])===tp);
    if(same.length>=(tier>=5?5:3))cands=same;
  }
  const nOpt=tier>=5?6:4;
  const others=pickN(cands,nOpt-1);
  const kind=rnd(td2QMenu());
  let q=null;
  if(kind==='grammar')q=td2QGrammar();
  else if(kind==='reading')q=td2QReading();
  else if(kind==='listen')q=td2QListen(right,others);
  else if(kind==='fill')q=td2QFill(right,others);
  else if(kind==='pic'&&hasPic(right[0]))
    q={prompt:picBox(right[0],true),opts:[{t:right[0],ok:1},...others.map(o=>({t:o[0],ok:0}))],note:right[0]+' = '+right[1]};
  else if(kind==='spell')
    q={prompt:`<div class="prompt-card"><div style="font-size:11px;color:#be185d;font-weight:800">🔤 ĐIỀN CHỮ THIẾU</div><b style="letter-spacing:4px;font-size:19px">${esc(td2MaskWord(right[0]))}</b><div style="font-size:12px;color:var(--muted);font-weight:600">Chọn từ viết đúng!</div></div>`,
       opts:[{t:right[0],ok:1},...others.map(o=>({t:o[0],ok:0}))],note:right[0]+' = '+right[1]};
  if(!q){ /* mặc định: từ vựng 2 chiều */
    if(Math.random()<.5)
      q={prompt:`<div class="prompt-card"><b>${esc(right[1])}</b><div style="font-size:12px;color:var(--muted);font-weight:600">Chọn từ tiếng Anh đúng</div></div>`,
         opts:[{t:right[0],ok:1},...others.map(o=>({t:o[0],ok:0}))],note:right[0]+' = '+right[1]};
    else
      q={prompt:`<div class="prompt-card"><b>${esc(right[0])}</b><div style="font-size:12px;color:var(--muted);font-weight:600">Chọn nghĩa tiếng Việt đúng</div></div>`,
         opts:[{t:right[1],ok:1},...others.map(o=>({t:o[1],ok:0}))],note:right[0]+' = '+right[1],enShown:1};
  }
  /* 🔊 phát âm: sayWord = từ tiếng Anh của câu (mọi dạng từ vựng),
     sayNow  = chỉ tự phát NGAY khi không lộ đáp án (dạng nghe, hoặc từ Anh đã hiện sẵn) */
  const isVocab=!(q.grOnly),
        sayWord=isVocab&&right&&right[0]?right[0]:null,
        sayNow=sayWord&&(q.say||q.enShown)?sayWord:null;
  return{prompt:q.prompt,opts:shuffle(q.opts),right,note:q.note,say:q.say,sayNow,sayWord,kind};
}
function td2Pool(){
  /* Sau đợt 10: trộn TOÀN BỘ từ vựng của lớp — mọi chủ đề, mọi mức độ, xáo ngẫu nhiên */
  if(GM&&GM.round>10){
    const all=DATA[grade].topics.flatMap(t=>t.vocab||[]).concat(DATA[grade].vocab||[]);
    const seen={},out=[];
    for(const v of all){if(!v||!v[0]||seen[v[0]])continue;seen[v[0]]=1;out.push(v)}
    if(out.length>=8)return shuffle(out);
  }
  return poolVocab();
}
/* ===== 📊 BẢNG CHỈ SỐ TỪNG TRỤ (kiểu bảng điểm trong game MOBA) =====
   Ghi lại suốt cả ván: sát thương, hạ quái, hồi máu, khống chế, phá khiên.
   Hiện ngay dưới bản đồ — chỗ trước đây bị trống. */
function td2St(t){
  if(!t)return {dmg:0,kill:0,heal:0,cc:0,shield:0,minion:0};
  if(!t.st)t.st={dmg:0,kill:0,heal:0,cc:0,shield:0,minion:0};
  return t.st;
}
const TD_BOARD_COLS=[
  {k:'dmg',   em:'⚔️', lab:'Sát thương', col:'#ef4444', fmt:v=>td2Num(v)},
  {k:'kill',  em:'💀', lab:'Hạ quái',    col:'#8b5cf6', fmt:v=>Math.round(v).toLocaleString('vi')},
  {k:'heal',  em:'💚', lab:'Hồi máu',    col:'#22c55e', fmt:v=>td2Num(v)},
  {k:'cc',    em:'🧊', lab:'Khống chế',  col:'#0ea5e9', fmt:v=>v>=10?Math.round(v)+'s':v.toFixed(1)+'s'},
  {k:'shield',em:'🛡️', lab:'Phá khiên',  col:'#3b82f6', fmt:v=>td2Num(v)},
];
let TD_BOARD_K=(function(){try{return localStorage.getItem('efz_bk')||'dmg'}catch(e){return 'dmg'}})();
let TD_BOARD_ON=(function(){try{return localStorage.getItem('efz_bon')!=='0'}catch(e){return true}})();
function td2BoardSet(k){TD_BOARD_K=k;try{localStorage.setItem('efz_bk',k)}catch(e){}sndClick();td2Board(true)}
function td2BoardToggle(){TD_BOARD_ON=!TD_BOARD_ON;try{localStorage.setItem('efz_bon',TD_BOARD_ON?'1':'0')}catch(e){}sndClick();td2Board(true)}
function td2BoardVal(t,k){
  const st=td2St(t);
  return k==='dmg' ? (st.dmg||0)+(st.minion||0) : (st[k]||0);
}
function td2Board(force){
  const el=$('td2board'); if(!el||!GM||GM.type!=='tower2')return;
  if(!force){
    GM._bT=(GM._bT||0)+1;
    if(GM._bT%20)return;            /* ~3 lần/giây là đủ mượt mắt */
  }
  const C=TD_BOARD_COLS.find(c=>c.k===TD_BOARD_K)||TD_BOARD_COLS[0];
  const tabs=TD_BOARD_COLS.map(c=>
    `<button class="td2bt${c.k===TD_BOARD_K?' on':''}" title="${c.lab}" onclick="td2BoardSet('${c.k}')">${c.em}</button>`).join('');
  if(!TD_BOARD_ON){
    el.innerHTML=`<div class="td2board-head"><b>📊 Bảng chỉ số trụ</b>
      <button class="td2bt" onclick="td2BoardToggle()">👁️ Hiện</button></div>`;
    return;
  }
  const rows=(GM.towers||[]).map(t=>({t,v:td2BoardVal(t,C.k)}));
  rows.sort((a,b)=>b.v-a.v);
  const max=Math.max(1,rows.length?rows[0].v:1);
  const tong=rows.reduce((a,r)=>a+r.v,0);
  const body=rows.length? rows.map((r,i)=>{
    const t=r.t,T=TT[t.type]||{},st=td2St(t);
    const pct=Math.max(2,Math.round(r.v/max*100));
    const phu=C.k==='dmg'&&st.minion?` <span class="td2b-sub">(lính ${td2Num(st.minion)})</span>`:'';
    return `<div class="td2b-row${t.broken?' dead':''}">
      <span class="td2b-no">${i+1}</span>
      <span class="td2b-em">${t.em||T.em||'🏰'}</span>
      <span class="td2b-nm">${esc(T.name||t.type)} <small>Lv.${t.level}${t.star?' ⭐'+t.star:''}</small></span>
      <span class="td2b-v" style="color:${C.col}">${C.fmt(r.v)}${phu}</span>
      <span class="td2b-bar"><i style="width:${pct}%;background:${C.col}"></i></span>
    </div>`;
  }).join('') : `<div class="td2b-empty">Chưa đặt trụ nào — mua trụ ở cửa hàng bên phải rồi chạm lên bản đồ nhé!</div>`;
  el.innerHTML=`<div class="td2board-head">
      <b>📊 ${C.em} ${C.lab}</b>
      <span class="td2b-tong">Tổng ${C.fmt(tong)}</span>
      <span class="td2b-tabs">${tabs}</span>
      <button class="td2bt" title="Ẩn bảng" onclick="td2BoardToggle()">✖️</button>
    </div>${body}`;
}

/* ===== 🎖️ CHỌN ĐỘI HÌNH: qua đợt 15 thì chọn tối đa 6 trụ, các trụ khác bị loại khỏi game ===== */
const TD_PICK_AT=15, TD_PICK_MAX=6;
function td2PickOpen(){
  GM.pickPhase=true;
  GM.pickSel=GM.towers.map(t=>t.type).filter((v,i,a)=>a.indexOf(v)===i).slice(0,TD_PICK_MAX);
  sndWin();confetti(80);
  td2PickRender();td2Side();
}
function td2PickToggle(k){
  const i=GM.pickSel.indexOf(k);
  if(i>=0)GM.pickSel.splice(i,1);
  else{
    if(GM.pickSel.length>=TD_PICK_MAX){toast('Chỉ được chọn tối đa '+TD_PICK_MAX+' trụ — bỏ bớt 1 con rồi chọn lại nhé!');return}
    GM.pickSel.push(k);
  }
  sndClick();td2PickRender();
}
function td2PickRender(){
  const el=$('td2q');if(!el)return;
  const cards=Object.keys(TT).map(k=>{
    const T=TT[k],on=GM.pickSel.indexOf(k)>=0,at=td2UnlockAt(k);
    return `<button onclick="td2PickToggle('${k}')" style="border:2.5px solid ${on?'var(--violet)':'#e5e7eb'};background:${on?'#f5f3ff':'#fff'};border-radius:13px;padding:8px 6px;text-align:center;cursor:pointer;font-family:inherit">
      <div style="font-size:26px;line-height:1.1">${T.em}</div>
      <div style="font-weight:800;font-size:11.5px;margin-top:2px">${T.name}</div>
      <div style="font-size:10.5px;color:var(--muted);font-weight:700">${T.cost}🪙${at>1?' · mở đợt '+at:''}</div>
      <div style="font-size:11px;font-weight:800;color:${on?'var(--violet)':'#cbd5e1'};margin-top:3px">${on?'✅ ĐÃ CHỌN':'○ chọn'}</div>
    </button>`}).join('');
  const n=GM.pickSel.length;
  el.innerHTML=`<div style="font-weight:800;font-size:14px;margin-bottom:3px">🎖️ Chọn đội hình chính thức — tối đa <b style="color:var(--violet)">${TD_PICK_MAX}</b> trụ</div>
    <div style="font-size:11.5px;color:var(--muted);font-weight:600;line-height:1.5;margin-bottom:7px">Từ đợt ${TD_PICK_AT+1} trở đi em chỉ được dùng những trụ đã chọn — các trụ còn lại sẽ <b>biến mất khỏi cửa hàng</b>. Trụ <b>đã đặt trên bản đồ vẫn giữ nguyên</b>, chỉ là sau này không mua thêm loại đó được nữa. Chọn cả trụ chưa mở khoá để dành cho sau nhé!</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px">${cards}</div>
    <div style="display:flex;align-items:center;gap:8px;margin-top:9px">
      <b style="font-size:13px">Đã chọn ${n}/${TD_PICK_MAX}</b>
      <button class="btn ${n?'teal':'ghost'} sm" style="flex:1" ${n?'':'disabled'} onclick="td2PickConfirm()">✅ Xong — vào đợt ${GM.round}</button>
    </div>`;
}
function td2PickConfirm(){
  if(!GM.pickSel.length){toast('Chọn ít nhất 1 trụ nhé!');return}
  GM.roster=GM.pickSel.slice();
  /* Trụ đã đặt trên bản đồ được GIỮ NGUYÊN — chỉ cửa hàng mới bỏ các loại không chọn */
  const keep=GM.towers.filter(t=>GM.roster.indexOf(t.type)<0).length;
  GM.sel=null;GM.place=null;GM.pickPhase=false;
  sndOK();confetti(60);
  toast('🎖️ Đội hình đã chốt: '+GM.roster.map(k=>TT[k].em).join(' ')+(keep?` — ${keep} trụ ngoài đội hình vẫn ở lại bản đồ nhé!`:''));
  td2Q();td2Side();
}
/* mô tả loại câu đang ra — phải khớp chế độ đang chọn, không thì ghi "từ vựng" trong lúc hỏi ngữ pháp */
function td2QTierNote(){
  if(TDQM.mode==='gram')return '📚 chỉ ngữ pháp · '+td2GrName();
  if(TDQM.mode==='both')return '🎲 từ vựng + ngữ pháp ('+td2GrName()+')';
  return TD_TIERS[td2QTier()].note;
}
function td2Q(){if(GM&&GM.qLocked)return td2QLocked();const q=td2GenQ();GM.cur=q;const el=$('td2q');td2AutoSay(q.sayNow,420);if(el)el.innerHTML=`<div style="font-weight:800;font-size:13px;margin-bottom:4px">❓ <b style="color:var(--violet)">Trả lời đúng = nguồn vàng chính!</b> Mỗi câu <b style="color:#d97706">+${td2AnsGold()}🪙</b> <span style="color:var(--violet);font-weight:700">${TD_TIERS[td2QTier()].lab} · ${td2QTierNote()}</span>${(TDQM.mode==='vocab'&&GM.round>10)?' <span style="color:#0891b2;font-weight:700">🎲 trộn mọi chủ đề</span>':''}</div>${q.prompt}${td2SayBtns(q,false)}${optButtons(q.opts,'td2Ans')}<div class="feedback" id="td2qfb" style="margin-top:6px"></div>`}
function td2QLocked(){const el=$('td2q');if(el)el.innerHTML=`<div style="font-weight:800;font-size:13px;margin-bottom:4px">❓ Khu trả lời <span style="color:var(--red)">— đang khoá 🔒</span></div><div style="text-align:center;padding:16px 10px;color:var(--muted);font-weight:700;line-height:1.55">😵 Trả lời sai nên tạm khoá câu hỏi!<br>⬇️ Hãy <b>mua trụ</b> &amp; bấm <b>"Bắt đầu đợt"</b>. Đánh xong đợt này sẽ <b style="color:var(--violet)">mở lại câu hỏi</b> để kiếm vàng tiếp! 💪</div>`}
function td2Ans(k){
  if(!GM||!GM.cur)return;const o=GM.cur.opts[k];
  document.querySelectorAll('#td2q .opt').forEach((b,j)=>{b.disabled=true;if(GM.cur.opts[j].ok)b.classList.add('right');else if(j===k)b.classList.add('wrong')});
  const fb=$('td2qfb');
  const sw=GM.cur.sayWord,ab=td2SayBtns(GM.cur,true);
  if(o.ok){GM.gold+=td2AnsGold();P.correct++;gainXP(2);sndOK();sndCoin();if(fb){fb.className='feedback ok';fb.innerHTML='🎉 +'+td2AnsGold()+'🪙 — '+esc(GM.cur.note||(GM.cur.right?GM.cur.right[0]+' = '+GM.cur.right[1]:''))+ab}persist();td2HUD();td2Side();
    if(sw&&tdAutoSay){setTimeout(()=>{try{speak(sw,.85)}catch(e){}},260);setTimeout(td2Q,3000)}else setTimeout(td2Q,2600);}
  else{sndNo();GM.qLocked=true;if(fb){fb.className='feedback no';fb.innerHTML='😵 Sai rồi! Đáp án: <b>'+esc(GM.cur.opts.find(x=>x.ok).t)+'</b>'+(GM.cur.note?' — '+esc(GM.cur.note):'')+'<br>Khoá trả lời tới khi hết đợt này!'+ab}persist();td2HUD();td2Side();
    if(sw&&tdAutoSay)setTimeout(()=>{try{speak(sw,.85)}catch(e){}},260);
    setTimeout(td2QLocked,sw&&tdAutoSay?4000:3400);}
}
function td2StartRound(){
  if(!GM||GM.running)return;
  if(GM.pickPhase){toast('🎖️ Hãy chọn đội hình trước khi đánh tiếp!');return}
  td2Ckpt();   /* 🔄 ghi mốc để thua còn đánh lại đúng đợt này */
  const r=GM.round,star=td2Star(r),base=Math.round(td2BaseHP(r)*td2Mod('ehp',1)*td2StarHp(r)),sp=td2BaseSpeed(r)*td2Mod('espd',1),rew=td2Reward(r);
  const ks=Object.keys(TD_KIND).filter(k=>r>=TD_KIND[k].from);
  const n=Math.min(60,Math.round((6+r*2.1)*(.55+.45*td2Warm(r))));
  GM.queue=[];
  for(let i=0;i<n;i++){
    let k='grunt';
    if(ks.length>1&&Math.random()>=.4)k=ks[1+Math.floor(Math.random()*(ks.length-1))];
    const K=TD_KIND[k];
    GM.queue.push({kind:k,hp:Math.max(6,Math.round(base*K.hp)),speed:sp*K.sp,em:rnd(K.em),
      armor:td2Armor(r,K.armor)+star*2,star:star,noSlow:!!K.noSlow,hide:!!K.hide,zap:!!K.zap,wreck:!!K.wreck,heal:!!K.heal,noSplash:!!K.noSplash,split:!!K.split,fly:!!K.fly,
      reward:Math.max(1,Math.round(rew*(K.hp>1?1.7:K.hp<.5?.5:1))),boss:false});
  }
  /* ⚡ ĐỢT DỒN: cuối mỗi đợt (từ đợt 2) có một tốp trinh sát chạy rất nhanh, nối đuôi nhau */
  if(r>=6){
    const W=td2Warm(r);
    const rn=Math.max(1,Math.round(Math.min(7,2+Math.floor(r/7))*W)),
          rhp=Math.max(8,Math.round(base*.45)),rsp=sp*(1.9+.5*W);
    for(let i=0;i<rn;i++)GM.queue.push({kind:'rush',hp:rhp,speed:rsp,em:rnd(['🏃','💨','🐆']),gap:.11,
      armor:Math.round(td2Armor(r,0)+star*1),star:star,noSlow:false,
      reward:Math.max(1,Math.round(rew*.8)),boss:false,rush:true});
    /* 🏇 Sứ giả — con dẫn đầu tốp dồn: rất nhanh, dai, miễn làm chậm.
       Chỉ xuất hiện từ đợt 12 và mạnh dần, để 20 đợt đầu vẫn dễ thở. */
    if(r>=12)GM.queue.push({kind:'herald',hp:Math.round(base*(1.6+1.8*W)),speed:sp*(2.1+.4*W),em:'🏇',gap:.11,
      armor:Math.round(td2Armor(r,1)+star*2),star:star,noSlow:true,
      reward:Math.max(2,Math.round(rew*2)),boss:false,rush:true});
  }
  if(r%5===0){
    const B=td2BossOf(r),bhp=Math.round(base*B.hpM);
    GM.queue.unshift({kind:'boss',hp:bhp,speed:sp*B.spM,em:B.em,bossName:B.name,armor:B.armor+star*3,noSlow:true,
      star:star,ab:B.ab.slice(),hide:B.ab.indexOf('hide')>=0,zap:B.ab.indexOf('zap')>=0,heal:B.ab.indexOf('heal')>=0,noSplash:B.ab.indexOf('noSplash')>=0,aura:B.ab.indexOf('aura')>=0,shield:B.ab.indexOf('shield')>=0?Math.round(bhp*.1):0,
      summonAt:B.ab.indexOf('summon')>=0?[.66,.33]:[],raged:false,reward:rew*10,boss:true});
    toast('⚠️ ĐỢT BOSS! '+B.em+' '+B.name+' — '+B.tip);
  }
  GM.running=true;{const gf=Math.max(.2,.6-r*.014),w=td2Warm(r);GM.spawnGap=gf+(.82-gf)*(1-w)}GM.spawnT=0;sndClick();td2Side()
}
function td2RoundDone(){
  const bonus=td2RoundBonus(GM.round);GM.gold+=bonus;GM.round++;GM.spellUse={};gainXP(6);persist();sndWin();sndCoin();
  setTimeout(()=>{try{td2Save(false)}catch(e){}},60);   /* 💾 tự lưu sau mỗi đợt */
  const wasLocked=GM.qLocked;GM.qLocked=false;GM.minions=[];GM.bergs=[];GM.towers.forEach(t=>{t.stun=0;t.heat=0;
    if(t.broken||t.hp<t.maxHp){t.broken=false;t.hp=t.maxHp;}
    if(t.type==='hero')t.mCd=1});
  if((GM.round-1)%3===0)td2ChangeMap(); else {const el=$('td2map');if(el)el.innerHTML=td2MapBanner()}
  if(GM.round===TD_PICK_AT+1&&!GM.roster){td2PickOpen();return}
  toast('🎉 Qua đợt! +'+bonus+' 🪙'+(wasLocked?' — mở lại câu hỏi! 🔓':''));
  for(const k in TT)if(td2UnlockAt(k)===GM.round){confetti(80);sndWin();toast('🦸 MỞ KHOÁ TRỤ MỚI: '+TT[k].em+' '+TT[k].name+' — '+TT[k].cost+'🪙, mạnh nhất game!')}
  td2Q();td2Side()
}
function td2HUD(){td2Board();const g=$('td2gold');if(!g)return;
  const gv=Math.floor(GM.gold), lv=Math.max(0,GM.lives), bk=GM.bossKills||0;
  if(GM._hG!==gv){GM._hG=gv;g.textContent=gv}
  if(GM._hL!==lv){GM._hL=lv;const e=$('td2life');if(e)e.textContent=lv}
  if(GM._hR!==GM.round){GM._hR=GM.round;const e=$('td2round');if(e)e.textContent=GM.round}
  if(GM._hK!==GM.kills){GM._hK=GM.kills;const e=$('td2kills');if(e)e.textContent=GM.kills}
  if(GM._hB!==bk){GM._hB=bk;const b=$('td2boss');if(b)b.textContent=bk}
  const sb=$('td2spells');if(sb){const sig=GM.round+'|'+Object.keys(TD_SPELLS).map(k=>Math.ceil((GM.spellCd&&GM.spellCd[k])||0)+'.'+td2SpellUses(k)+(GM.gold>=td2SpellCost(k)?'y':'n')).join('');
    if(sig!==GM._sbSig){GM._sbSig=sig;sb.innerHTML=td2SpellBar()}}}
function td2Speed(s){if(!GM||GM.type!=='tower2')return;GM.speed=s;sndClick();td2Side()}
function td2Fire(t,tg){
  td2Hit(t,tg,t.dmg,true);
  if(t.multi>1){let ex=0;for(const e of GM.enemies){if(e===tg||e.dead||e.hidden||ex>=t.multi-1)continue;const dx=e.x-t.x,dy=e.y-t.y;if(dx*dx+dy*dy<=t.range*t.range){td2Hit(t,e,t.dmg,false);td2FxAdd(td2MakeFx(t,e));ex++}}}
  if(t.splash){for(const e of GM.enemies){if(e===tg||e.dead)continue;
    if(Math.hypot(e.x-tg.x,e.y-tg.y)>t.splash)continue;
    if(e.noSplash){if(Math.random()<.14)td2Pop(e.x,e.y,'🪞 MIỄN LAN','#a78bfa',11,-20);continue}
    td2Hit(t,e,t.dmg*.55,false)}}
  td2FxAdd(td2MakeFx(t,tg),1);
}
/* Sát thương: chí mạng → trừ giáp (tối thiểu vẫn lọt 25%) → phá khiên → trừ máu */
/* 💬 Chữ bay báo chiến đấu: sát thương, chí mạng, chặn, giáp, hồi máu... */
function td2Pop(x,y,txt,col,size,vy){
  if(!GM.pop)GM.pop=[];
  const sz=size||12, M=GM._lo>1?7:GM._lo?11:20;
  if(GM.pop.length>=M){
    if(sz<14)return;                         /* số sát thương lẻ: bỏ luôn khi màn hình đã đầy chữ */
    GM.pop.splice(0,GM.pop.length-M+1);      /* chữ quan trọng: đẩy chữ cũ nhất ra */
  }
  GM.pop.push({x:x+(Math.random()*14-7),y:y-6,txt:txt,c:col||'#fff',s:sz,vy:vy||-26,t:0,dur:sz>=15?1.15:.85});
}
/* 🎛️ NGÂN SÁCH HIỆU ỨNG BẮN — trần số hiệu ứng sống cùng lúc.
   Trụ Lv cao bắn 5 mục tiêu mỗi 0.1s: nếu không chặn thì có tới vài trăm hiệu ứng
   cùng vẽ một khung hình → đây chính là thủ phạm làm tụt xuống 6 FPS. */
function td2FxMax(){return GM._lo>1?34:GM._lo?55:120}
function td2FxAdd(o,keep){
  if(!GM.fx)GM.fx=[];
  const M=td2FxMax();
  if(GM.fx.length>=M){
    if(!keep)return;                          /* hiệu ứng phụ (đòn lan, đòn phụ): bỏ qua */
    GM.fx.splice(0,GM.fx.length-M+1);         /* hiệu ứng chính: thay chỗ hiệu ứng cũ nhất */
  }
  GM.fx.push(o);
}
function td2Num(n){n=Math.round(n);return n>=1e6?(n/1e6).toFixed(1)+'M':n>=1000?(n/1000).toFixed(1)+'K':String(n)}
/* 💥 Quái/boss đánh trụ — sát thương tính theo % máu tối đa nên cân ở mọi cấp */
function td2Hurt(t,pct,label){
  if(!t||t.broken)return;
  if(t.maxHp===undefined)td2Stats(t);
  if(t.hp===undefined)t.hp=t.maxHp;
  const d=Math.max(1,Math.round(t.maxHp*pct));
  t.hp-=d;
  td2Pop(t.x,t.y-16,(label||'💥')+' −'+td2Num(d),'#fb7185',12,-24);
  if(t.hp<=0){
    t.hp=0;t.broken=true;t.cd=t.rate;
    td2FxAdd({x1:t.x,y1:t.y,x2:t.x,y2:t.y,c:'#ef4444',kind:'boom',lv:4,t:0,dur:.6});
    td2Pop(t.x,t.y,'💥 TRỤ SẬP!','#ef4444',17,-34);sndNo();
    toast('💥 '+td2TowerName(t)+' bị đánh sập! Sửa ngay hoặc chờ hết đợt trụ tự hồi phục.');
  }
}
function td2Repair(){
  const t=GM.sel;if(!t)return;
  if(!t.broken&&t.hp>=t.maxHp){toast('Trụ đang khoẻ mạnh mà!');return}
  const cost=Math.max(30,Math.round(td2Paid(t)*.18*(t.broken?1:(1-t.hp/t.maxHp))));
  if(GM.gold<cost){toast('Sửa trụ cần '+cost.toLocaleString('vi')+'🪙');return}
  GM.gold-=cost;t.hp=t.maxHp;t.broken=false;sndOK();confetti(20);
  td2Pop(t.x,t.y-16,'🔧 SỬA XONG','#22c55e',14,-26);
  toast('🔧 Đã sửa '+td2TowerName(t)+' về đầy máu!');td2Side();
}
function td2Hit(t,e,raw,primary){
  if(!e||e.dead)return;
  let d=raw,crit=false;
  if(primary&&t.crit&&Math.random()<t.crit){d*=t.critX;crit=true;td2FxAdd({x1:e.x,y1:e.y-16,x2:e.x,y2:e.y-16,c:'#f59e0b',kind:'crit',lv:1,t:0,dur:.5})}
  const before=d;
  const armor=Math.max(0,(e.armor||0)-(e.shredV||0))*(1-(t.pierce||0));
  d=Math.max(d*.25,d-armor);
  /* 👑 hào quang boss: quái đứng gần boss chịu ít sát thương hơn hẳn */
  if(GM.auraB&&GM.auraB.length){
    let aura=false;
    for(const B of GM.auraB){if(B===e)continue;if(Math.hypot(B.x-e.x,B.y-e.y)<80){aura=true;break}}
    if(aura){d*=.65;if(primary&&Math.random()<.2)td2Pop(e.x,e.y-10,'👑 HÀO QUANG −35%','#c084fc',11,-20)}
  }
  /* 🪞 phản đòn: trụ vừa bắn bị NUNG NÓNG, bắn chậm 40% trong 2s */
  if(e.noSplash&&primary&&t){t.heat=1.6;td2Hurt(t,e.boss?.012:.022,'🪞 PHẢN ĐÒN')}
  const blocked=before-d;
  if(t.shred&&e.armor>0){
    const old=e.shredV||0;
    e.shredV=Math.min(t.shredMax,old+t.shred);e.shredT=3.5;
    if(e.shredV>old&&Math.random()<.4)td2Pop(e.x,e.y-16,'🛡️−'+Math.round(e.shredV)+' giáp','#f472b6',11,-20);
  }
  if(e.shield>0){const ab=Math.min(e.shield,d);e.shield-=ab;d-=ab;td2St(t).shield+=ab;
    if(Math.random()<.4)td2Pop(e.x,e.y-22,'🔵 KHIÊN −'+td2Num(ab),'#60a5fa',11,-22);
    if(e.shield<=0&&e.boss){toast('💥 Khiên của '+e.bossName+' đã vỡ!');sndOK();td2Pop(e.x,e.y-26,'💥 VỠ KHIÊN!','#3b82f6',16,-30)}}
  if(d>0){e.hp-=d;td2St(t).dmg+=d}
  if(primary){
    const big=d>=e.max*.08;                       /* đòn nặng thì luôn hiện */
    if(crit)td2Pop(e.x,e.y,'💥 '+td2Num(d)+' CHÍ MẠNG!','#f59e0b',16,-34);
    else if(big||Math.random()<(GM._lo?.10:.22))td2Pop(e.x,e.y,td2Num(d),blocked>before*.35?'#cbd5e1':'#fff',blocked>before*.35?11:13,-26);
    if(blocked>before*.35&&Math.random()<.35)td2Pop(e.x,e.y+7,'🛡️ chặn '+td2Num(blocked),'#94a3b8',10,-16);
  }
  /* 🩸 hút máu: mỗi đòn trúng, trụ tự hồi một phần máu tối đa */
  if(t.lifesteal&&d>0&&t.maxHp&&t.hp<t.maxHp&&!t.broken){
    const heal=Math.min(t.maxHp-t.hp,t.maxHp*t.lifesteal);
    t.hp=Math.min(t.maxHp,t.hp+heal);td2St(t).heal+=heal;
    if(primary&&Math.random()<.14)td2Pop(t.x,t.y-20,'🩸 +'+td2Num(Math.round(heal)),'#f87171',11,-20);
  }
  if(t.slow&&!e.noSlow){if(!(e.slowT>0))td2St(t).cc+=1.5;e.slowT=1.5;e.slowP=Math.min(e.slowP||1,t.slowP)}
  if(t.burn){e.burn=Math.max(e.burn||0,t.burn*t.dmg);e.burnBy=t}
  if(e.hp<=0&&!e.dead){e.dead=true;e.killed=true;td2St(t).kill++}
}
function td2MakeFx(t,tg){
  t.aimA=Math.atan2(tg.y-t.y,tg.x-t.x);   /* để trụ xoay/nghiêng về phía mục tiêu */
  const f={x1:t.x,y1:t.y-4,x2:tg.x,y2:tg.y,c:t.color,kind:t.atk,lv:t.level,t:0,
           arc:(Math.abs(tg.x-t.x)+Math.abs(tg.y-t.y))*.10};   /* độ cong quỹ đạo */
  f.dur=t.atk==='fire'?.4:t.atk==='beam'?.18:t.atk==='laser'?.1:t.atk==='frost'?.22:t.atk==='dart'?.24:t.atk==='venom'?.3:t.atk==='tongue'?.18:t.atk==='claw'?.22:t.atk==='sting'?.12:.14;
  return f;
}
function td2DrawFx(x){
  for(const f of GM.fx){
    const p=Math.min(1,f.t/f.dur),a=Math.max(0,1-p);x.globalAlpha=a;x.lineCap='round';
    /* 🎯 quỹ đạo cong: viên đạn được nhấc lên ở giữa đường bay cho có chiều sâu */
    const arc=f.arc||0;
    const at=q=>({x:f.x1+(f.x2-f.x1)*q, y:f.y1+(f.y2-f.y1)*q-arc*4*q*(1-q)});
    const _P=at(p), px=_P.x, py=_P.y;
    /* bóng viên đạn in xuống đất — thứ làm nó "bay trên không" */
    if(arc>2&&p<1){x.globalAlpha=a*.22;x.fillStyle='#000';
      x.beginPath();x.ellipse(f.x1+(f.x2-f.x1)*p,f.y1+(f.y2-f.y1)*p+7,4.5,1.8,0,0,7);x.fill();x.globalAlpha=a}
    /* ✨ vệt sáng thon dần — chỉ 3 đoạn, không save/restore (đây từng là chỗ tốn CPU nhất) */
    /* ⚡ mức siêu nhẹ: chỉ một vạch + một chấm, bỏ hết vệt sáng & chớp nòng */
    if(GM._lo>1&&f.kind!=='boom'&&f.kind!=='heal'&&f.kind!=='crit'&&f.kind!=='poof'){
      x.strokeStyle=f.c||'#fff';x.lineWidth=2.6;
      x.beginPath();x.moveTo(f.x1,f.y1);x.lineTo(px,py);x.stroke();
      x.fillStyle=f.c||'#fff';x.beginPath();x.arc(px,py,3,0,7);x.fill();
      continue;
    }
    const NT=GM._lo?2:3;
    const trail=(c,w,len)=>{
      for(let i=0;i<NT;i++){const q2=p-len*i/NT,q1=p-len*(i+1)/NT;
        if(q2<=0)break;
        const A=at(q1>0?q1:0),B=at(q2);
        x.globalAlpha=a*(1-i/NT)*.92;x.strokeStyle=c;x.lineWidth=w*(1-i/NT*.7);
        x.beginPath();x.moveTo(A.x,A.y);x.lineTo(B.x,B.y);x.stroke()}
      x.globalAlpha=a};
    /* 💥 chớp sáng ở nòng — hai vòng tròn mờ, rẻ hơn gradient nhiều */
    if(p<.22&&!GM._lo&&f.kind!=='boom'&&f.kind!=='crit'&&f.kind!=='heal'&&f.kind!=='poof'){
      const k=1-p/.22;
      x.globalAlpha=a*k*.30;x.fillStyle='#fff';
      x.beginPath();x.arc(f.x1,f.y1,10*k+3,0,7);x.fill();
      x.globalAlpha=a*k*.75;
      x.beginPath();x.arc(f.x1,f.y1,4.5*k+1.5,0,7);x.fill();
      x.globalAlpha=a}
    if(f.kind==='tongue'){const ext=p<.45?p/.45:1-(p-.45)/.55,ex=f.x1+(f.x2-f.x1)*ext,ey=f.y1+(f.y2-f.y1)*ext;
      x.strokeStyle='#be123c';x.lineWidth=5+f.lv*.3;x.beginPath();x.moveTo(f.x1,f.y1);x.lineTo(ex,ey);x.stroke();
      x.strokeStyle='#fb7185';x.lineWidth=2;x.stroke();
      x.fillStyle='#e11d48';x.beginPath();x.arc(ex,ey,4.5,0,7);x.fill();}
    else if(f.kind==='claw'){x.strokeStyle='#fff';x.lineWidth=3;
      for(let i=-1;i<=1;i++){x.beginPath();x.arc(f.x2,f.y2,13+i*4,-.9+p*1.2,.5+p*1.2);x.stroke()}}
    else if(f.kind==='sting'){trail('rgba(250,204,21,.55)',5,.4);trail('#fde047',2,.18);
      x.fillStyle='#facc15';x.beginPath();x.arc(px,py,3.4,0,7);x.fill();}
    else if(f.kind==='fire'){
      if(p<.6){const k=p/.6,fx2=f.x1+(f.x2-f.x1)*k,fy2=f.y1+(f.y2-f.y1)*k;
        x.fillStyle='rgba(249,115,22,.45)';x.beginPath();x.arc(fx2,fy2,9+f.lv*.6,0,7);x.fill();
        x.fillStyle='#f97316';x.beginPath();x.arc(fx2,fy2,5.5+f.lv*.35,0,7);x.fill();
        x.fillStyle='#fde047';x.beginPath();x.arc(fx2,fy2,2.6,0,7);x.fill();}
      else{const r=(13+f.lv*4)*(1-(p-.6)/.4);
        x.strokeStyle='rgba(249,115,22,.8)';x.lineWidth=3;x.beginPath();x.arc(f.x2,f.y2,Math.max(0,r*1.25),0,7);x.stroke();
        x.fillStyle='rgba(249,115,22,.6)';x.beginPath();x.arc(f.x2,f.y2,Math.max(0,r),0,7);x.fill();
        x.fillStyle='rgba(253,224,71,.75)';x.beginPath();x.arc(f.x2,f.y2,Math.max(0,r*.5),0,7);x.fill();}}
    else if(f.kind==='dart'){trail('rgba(167,139,250,.5)',4,.35);
      x.fillStyle='#ede9fe';x.beginPath();x.arc(px,py,4,0,7);x.fill();
      x.fillStyle=f.c;x.beginPath();x.arc(px,py,2.4,0,7);x.fill();}
    else if(f.kind==='venom'){trail('rgba(22,163,74,.45)',6,.45);
      x.fillStyle='#16a34a';x.beginPath();x.arc(px,py,5,0,7);x.fill();
      x.fillStyle='#bbf7d0';x.beginPath();x.arc(px-1,py-1,2.2,0,7);x.fill();}
    else if(f.kind==='frost'){trail('rgba(165,180,252,.55)',7,.4);
      x.fillStyle='#c7d2fe';x.beginPath();x.arc(px,py,5.5,0,7);x.fill();
      x.strokeStyle='#eef2ff';x.lineWidth=1.6;
      for(let i=0;i<3;i++){const an=p*6+i*2.09;x.beginPath();x.moveTo(px-Math.cos(an)*7,py-Math.sin(an)*7);x.lineTo(px+Math.cos(an)*7,py+Math.sin(an)*7);x.stroke()}
      if(p>.75){const r=16*(p-.75)/.25;x.strokeStyle='rgba(199,210,254,.8)';x.lineWidth=2.5;x.beginPath();x.arc(f.x2,f.y2,r,0,7);x.stroke()}}
    else if(f.kind==='laser'){x.strokeStyle='rgba(34,211,238,.45)';x.lineWidth=6;x.beginPath();x.moveTo(f.x1,f.y1);x.lineTo(f.x2,f.y2);x.stroke();
      x.strokeStyle='#22d3ee';x.lineWidth=2.6;x.stroke();x.strokeStyle='#ecfeff';x.lineWidth=1;x.stroke();
      x.fillStyle='#ecfeff';x.beginPath();x.arc(f.x2,f.y2,4*(1-p)+1.5,0,7);x.fill();}
    else if(f.kind==='beam'){x.strokeStyle='rgba(56,189,248,.35)';x.lineWidth=11+f.lv*.5;x.beginPath();x.moveTo(f.x1,f.y1);x.lineTo(f.x2,f.y2);x.stroke();
      x.strokeStyle='#7dd3fc';x.lineWidth=5.5+f.lv*.35;x.stroke();
      x.strokeStyle='#fff';x.lineWidth=2.2;x.stroke();
      const rr=(10+f.lv)*(1-p);x.fillStyle='rgba(56,189,248,.85)';x.beginPath();x.arc(f.x2,f.y2,Math.max(0,rr),0,7);x.fill();}
    else if(f.kind==='zap'){
      const dx=f.x2-f.x1,dy=f.y2-f.y1,nx=-dy,ny=dx,L=Math.hypot(dx,dy)||1;
      const bolt=(seed,amp)=>{x.beginPath();x.moveTo(f.x1,f.y1);
        for(let i=1;i<6;i++){const q=i/6,j=Math.sin(seed+i*2.3+f.t*40)*amp;
          x.lineTo(f.x1+dx*q+nx/L*j, f.y1+dy*q+ny/L*j)}
        x.lineTo(f.x2,f.y2);x.stroke()};
      x.save();
      x.strokeStyle='rgba(250,204,21,.35)';x.lineWidth=9;bolt(1,9);
      x.strokeStyle='rgba(250,204,21,.6)';x.lineWidth=6;bolt(1,9);
      x.strokeStyle='#facc15';x.lineWidth=2.8;bolt(1,9);
      x.strokeStyle='#fffbeb';x.lineWidth=1.2;bolt(1,9);
      x.globalAlpha=a*.45;x.strokeStyle='#fde047';x.lineWidth=1.4;bolt(4.2,15);
      x.restore();}
    else if(f.kind==='heal'){
      x.save();
      x.strokeStyle='rgba(74,222,128,.28)';x.lineWidth=11;x.beginPath();x.arc(f.x2,f.y2,70*p,0,7);x.stroke();
      x.strokeStyle='rgba(74,222,128,.45)';x.lineWidth=7;x.beginPath();x.arc(f.x2,f.y2,70*p,0,7);x.stroke();
      x.strokeStyle='#86efac';x.lineWidth=2.5;x.beginPath();x.arc(f.x2,f.y2,70*p,0,7);x.stroke();x.restore();
      for(let i=0;i<6;i++){const an=i*1.047+p*2;
        x.fillStyle='rgba(134,239,172,'+(a*.9).toFixed(2)+')';
        x.beginPath();x.arc(f.x2+Math.cos(an)*70*p,f.y2+Math.sin(an)*70*p,2.2,0,7);x.fill()}}
    else if(f.kind==='boom'){const rr=(16+f.lv*6)*p;
      /* sóng xung kích lan ra */
      x.save();x.globalAlpha=a*.8;x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=2.2*(1-p);
      x.beginPath();x.arc(f.x2,f.y2,rr*1.7,0,7);x.stroke();x.restore();
      x.fillStyle='rgba(120,30,10,.28)';x.beginPath();x.arc(f.x2,f.y2,rr*1.2,0,7);x.fill();
      x.fillStyle='rgba(249,115,22,.62)';x.beginPath();x.arc(f.x2,f.y2,rr*.78,0,7);x.fill();
      x.fillStyle='rgba(255,248,200,.9)';x.beginPath();x.arc(f.x2,f.y2,rr*.36,0,7);x.fill();
      x.strokeStyle='rgba(249,115,22,.85)';x.lineWidth=3.5;x.beginPath();x.arc(f.x2,f.y2,rr*1.15,0,7);x.stroke();
      /* mảnh văng */
      for(let i=0;i<7;i++){const an=i*.897+f.lv,dd=rr*1.5*p;
        x.fillStyle='rgba(253,186,116,'+(a*.85).toFixed(2)+')';
        x.beginPath();x.arc(f.x2+Math.cos(an)*dd,f.y2+Math.sin(an)*dd,2.4*(1-p)+.6,0,7);x.fill()}}
    else if(f.kind==='poof'){x.strokeStyle='rgba(148,163,184,.9)';x.lineWidth=2;x.beginPath();x.arc(f.x2,f.y2,15*p,0,7);x.stroke();}
    else if(f.kind==='crit'){x.fillStyle='#f59e0b';x.strokeStyle='rgba(15,23,42,.8)';x.lineWidth=3;
      for(let i=0;i<6;i++){const an=i*1.047+p*1.5,rr=10+p*16;
        x.beginPath();x.arc(f.x1+Math.cos(an)*rr,f.y1+Math.sin(an)*rr,2.4,0,7);x.fill()}}
    else{x.strokeStyle=f.c;x.lineWidth=3;x.beginPath();x.moveTo(f.x1,f.y1);x.lineTo(f.x2,f.y2);x.stroke();}
  }
  x.globalAlpha=1;
}
function td2Loop(ts){
  if(!GM||GM.type!=='tower2')return;
  if(!GM.last)GM.last=ts;let dt=(ts-GM.last)/1000;GM.last=ts;
  /* 📊 đo FPS thật + tự hạ hiệu ứng nếu máy không theo kịp 60 khung/giây */
  GM._fpsN=(GM._fpsN||0)+1;GM._fpsA=(GM._fpsA||0)+dt;
  if(GM._fpsA>=.5){
    GM._fps=Math.round(GM._fpsN/GM._fpsA);GM._fpsN=0;GM._fpsA=0;
    const q=TD_QUAL;
    if(q==='hi')GM._lo=0;
    else if(q==='lo')GM._lo=2;
    else{
      /* Tự động 3 bậc: 0 = đẹp · 1 = nhẹ · 2 = siêu nhẹ.
         HẠ thì nhanh, NÂNG lại thì chậm (phải mượt liên tục 4 giây) — nếu nâng vội
         thì chất lượng cứ nhảy lên nhảy xuống, và chính cái đó mới là thứ gây giật. */
      const f=GM._fps; GM._lo=GM._lo||0;
      if(f<26){GM._loU=0;if((GM._loD=(GM._loD||0)+1)>=1&&GM._lo<2){GM._lo++;GM._loD=0}}
      else if(f<42){GM._loU=0;if((GM._loD=(GM._loD||0)+1)>=3&&GM._lo<2){GM._lo++;GM._loD=0}}
      else if(f>=54){GM._loD=0;if((GM._loU=(GM._loU||0)+1)>=4&&GM._lo>0){GM._lo--;GM._loU=0}}
      else {GM._loD=0;GM._loU=0}
    }
  }
  if(dt>.05)dt=.05;dt*=(GM.speed||1);
  if(GM.running){GM.spawnT-=dt;if(GM.queue.length&&GM.spawnT<=0){const s=GM.queue.shift(),p=td2Pos(0);GM.spawnT=(s.gap||GM.spawnGap);
    GM.enemies.push(Object.assign({d:0,x:p.x,y:p.y,max:s.hp,maxShield:s.shield||0,slowT:0,slowP:1,burn:0},s))}}
  const born=[];
  GM.auraB=GM.enemies.filter(e=>!e.dead&&e.boss&&e.aura);
  for(const e of GM.enemies){
    if(e.dead)continue;
    if(e.slowT>0){e.slowT-=dt;if(e.slowT<=0)e.slowP=1}
    if(e.shredT>0){e.shredT-=dt;if(e.shredT<=0)e.shredV=0}
    if(e.burn>0){const bd=Math.min(Math.max(0,e.hp),e.burn*dt);e.hp-=e.burn*dt;
      if(e.burnBy)td2St(e.burnBy).dmg+=bd;
      if(e.hp<=0){e.dead=true;e.killed=true;if(e.burnBy)td2St(e.burnBy).kill++;continue}}
    if(e.boss&&e.ab){
      if(e.ab.indexOf('regen')>=0&&e.hp<e.max){e.hp=Math.min(e.max,e.hp+e.max*.004*dt);if(Math.random()<dt*.5)td2Pop(e.x,e.y-18,'💚 hồi máu','#22c55e',11,-18)}
      if(e.ab.indexOf('rage')>=0&&!e.raged&&e.hp<e.max*.4){e.raged=true;e.speed*=1.35;sndNo();toast('😤 '+e.bossName+' NỔI GIẬN — tăng tốc!')}
      if(e.summonAt&&e.summonAt.length&&e.hp<e.max*e.summonAt[0]){
        e.summonAt.shift();
        const mh=Math.round(td2BaseHP(GM.round)*.6),ms=td2BaseSpeed(GM.round)*1.45;
        for(let i=0;i<4;i++){const dd=Math.max(0,e.d-16*i),p=td2Pos(dd);
          born.push({kind:'runner',d:dd,x:p.x,y:p.y,hp:mh,max:mh,speed:ms,em:'🦗',armor:0,noSlow:false,reward:2,boss:false,slowT:0,slowP:1,burn:0,shield:0,maxShield:0})}
        sndNo();toast('👺 '+e.bossName+' GỌI LÍNH — 4 quái chạy nhanh!');
      }
    }
    /* 🧊 tảng băng của Pháp Sư chắn ngang — quái phải đứng lại */
    if(GM.bergs&&GM.bergs.length&&!e.fly){
      for(const b of GM.bergs){
        if(e.d<=b.d&&b.d-e.d<26){e.blocked=true;
          if(Math.random()<.05)td2Pop(e.x,e.y-14,'🧊 KẸT BĂNG','#7dd3fc',11,-18);
          break}
      }
    }
    if(!e.blocked)e.d+=e.speed*(e.slowT>0?e.slowP:1)*dt;
    e.blocked=false;
    if(e.d>=GM.total){e.dead=true;e.escaped=true}else{const p=td2Pos(e.d);e.x=p.x;e.y=p.y}
  }
  if(born.length)GM.enemies=GM.enemies.concat(born);
  /* 👾 Kỹ năng của quái đối đầu với trụ: tàng hình · đập trụ · hồi máu bầy */
  for(const e of GM.enemies){
    if(e.dead)continue;
    /* 💨 tàng hình: ẩn lâu hơn hiện, và HỒI MÁU khi đang ẩn */
    if(e.hide){ e.hideT=(e.hideT===undefined?1.2:e.hideT)-dt;
      if(e.hideT<=0){e.hidden=!e.hidden;e.hideT=e.hidden?3:1.5;if(e.hidden)td2Pop(e.x,e.y-12,'💨 TÀNG HÌNH','#94a3b8',12,-18)}
      if(e.hidden&&e.hp<e.max){e.hp=Math.min(e.max,e.hp+e.max*.02*dt)} }
    /* 🪨 NÉM ĐÁ: vừa đi vừa ném đá vào trụ gần nhất, chỉ làm mất MÁU TRỤ */
    if(e.wreck){ e.wrCd=(e.wrCd===undefined?2.5:e.wrCd)-dt;
      if(e.wrCd<=0){
        const R=GM.round;
        e.wrCd=R>=60?2.6:R>=30?3.2:4;
        const tg=GM.towers.filter(t=>!t.broken&&Math.hypot(t.x-e.x,t.y-e.y)<125)
          .sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];
        if(tg){
          td2FxAdd({x1:e.x,y1:e.y,x2:tg.x,y2:tg.y,c:'#a8a29e',kind:'dart',lv:2,t:0,dur:.3,arc:16});
          td2Hurt(tg,R>=60?.10:R>=30?.08:.06,'🪨 TRÚNG ĐÁ');
        }else e.wrCd=1;
      } }
    /* ⚡ phá trụ: tê liệt LÂU hơn, tầm xa hơn, đánh NHIỀU trụ một lúc */
    if(e.zap){ e.zapCd=(e.zapCd===undefined?3:e.zapCd)-dt;
      if(e.zapCd<=0){
        const R=GM.round;
        e.zapCd=e.boss?5:(R>=70?6:R>=45?7.5:9);
        const nT=e.boss?(R>=70?3:2):(R>=70?2:1), dur=e.boss?(R>=70?6:4.5):(R>=70?4:R>=45?3:2.2);
        e.zapCd=e.zapCd;
        const near=GM.towers.filter(t=>!(t.stun>0)&&Math.hypot(t.x-e.x,t.y-e.y)<140)
          .sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y)).slice(0,nT);
        if(near.length){sndNo();
          near.forEach(t=>{t.stun=dur;td2FxAdd({x1:e.x,y1:e.y,x2:t.x,y2:t.y,c:'#facc15',kind:'zap',lv:2,t:0,dur:.35});
            td2Pop(t.x,t.y-14,'⚡ TÊ LIỆT '+dur+'s','#facc15',14,-28);td2Hurt(t,e.boss?.16:.07,'⚡ PHÁ TRỤ')});
          if(near.length>1)td2Pop(e.x,e.y-20,'🔧 PHÁ '+near.length+' TRỤ!','#f59e0b',14,-26);}
      } }
    /* 💉 y tá: hồi mạnh hơn, tầm rộng hơn, GIẢI luôn hiệu ứng thiêu đốt */
    /* 🐲 Boss vừa đi vừa TẤN CÔNG TRỤ gần nhất */
    if(e.boss){ e.atkCd=(e.atkCd===undefined?3:e.atkCd)-dt;
      if(e.atkCd<=0){e.atkCd=3.5;
        let bt=null,bd=1e9;
        for(const t of GM.towers){if(t.broken)continue;const d=Math.hypot(t.x-e.x,t.y-e.y);if(d<105&&d<bd){bd=d;bt=t}}
        if(bt){td2FxAdd({x1:e.x,y1:e.y,x2:bt.x,y2:bt.y,c:'#ef4444',kind:'zap',lv:3,t:0,dur:.3});
          td2Hurt(bt,.22,e.em+' BOSS ĐÁNH');}
      } }
    if(e.heal){ e.healCd=(e.healCd===undefined?1:e.healCd)-dt;
      if(e.healCd<=0){e.healCd=1;const amt=(e.boss?.06:(GM.round>=60?.05:.035));let n=0;
        for(const o of GM.enemies){if(o===e||o.dead)continue;
          if(Math.hypot(o.x-e.x,o.y-e.y)<92){if(o.burn>0){o.burn=0;} if(o.hp<o.max){o.hp=Math.min(o.max,o.hp+o.max*amt);n++}}}
        if(n){td2FxAdd({x1:e.x,y1:e.y,x2:e.x,y2:e.y,c:'#4ade80',kind:'heal',lv:1,t:0,dur:.4});if(Math.random()<.45)td2Pop(e.x,e.y-14,'💚 hồi '+Math.round(amt*100)+'% cho '+n+' quái','#22c55e',11,-20)}
      } }
  }
  /* 🦸🐉🤖 Trụ biết GỌI QUÂN: đệ tử 🥷 · đàn rồng con 🐲 · drone 🛸 */
  if(!GM.minions)GM.minions=[];
  for(const t of GM.towers){
    if(!t.mCount||t.broken||t.stun>0)continue;
    if(t.mCd===undefined)t.mCd=2;
    t.mCd-=dt;
    if(GM.running&&t.mCd<=0){
      const alive=GM.minions.filter(m=>m.owner===t&&!m.dead).length;
      if(alive<t.mCount){
        t.mCd=t.mRate;
        const hp=Math.round(td2BaseHP(GM.round)*td2Mod('ehp',1)*t.mHpK);
        const d0=Math.min(GM.total-6,td2NearestD(t.x,t.y)+30),pp=td2Pos(d0);
        GM.minions.push({owner:t,d:d0,minD:Math.max(0,d0-210),x:pp.x,y:pp.y,hp,max:hp,dmg:t.mDmg,
          rate:t.mFly?.35:.5,cd:0,dead:false,fight:0,em:t.mEm||'🥷',fly:!!t.mFly,ph:Math.random()*6.28});
      }else t.mCd=.5;
    }
  }
  /* 🧊 PHÁP SƯ BĂNG dựng tảng băng chặn ngang đường — quái phải đứng lại ~1 giây */
  if(!GM.bergs)GM.bergs=[];
  for(const t of GM.towers){
    if(!t.berg||t.broken||t.stun>0)continue;
    if(t.bergCd===undefined)t.bergCd=2;
    t.bergCd-=dt;
    if(GM.running&&t.bergCd<=0){
      t.bergCd=t.bergRate;
      /* dựng ngay trước mặt con quái xa nhất trong tầm */
      let best=null,bd=-1;
      for(const e of GM.enemies){if(e.dead||e.hidden)continue;
        if(Math.hypot(e.x-t.x,e.y-t.y)>t.range)continue;
        if(e.d>bd){bd=e.d;best=e}}
      if(best){
        const bdd=Math.min(GM.total-4,best.d+26),pp=td2Pos(bdd);
        GM.bergs.push({d:bdd,x:pp.x,y:pp.y,t:t.bergHold,max:t.bergHold});td2St(t).cc+=t.bergHold;
        td2Pop(pp.x,pp.y-16,'🧊 CHẶN ĐƯỜNG!','#7dd3fc',13,-24);
        td2FxAdd({x1:t.x,y1:t.y-4,x2:pp.x,y2:pp.y,c:'#7dd3fc',kind:'frost',lv:t.level,t:0,dur:.22,arc:10});
      }else t.bergCd=1;
    }
  }
  for(const b of GM.bergs)b.t-=dt;
  GM.bergs=GM.bergs.filter(b=>b.t>0);
  const eDps=td2BaseHP(GM.round)*td2Mod('ehp',1)*.5;
  for(const m of GM.minions){
    if(m.dead)continue;
    let foe=null;
    for(const e of GM.enemies){if(e.dead||e.fly)continue;if(e.d<=m.d+13&&e.d>m.d-45){if(!foe||e.d>foe.d)foe=e}}
    if(foe){
      if(!foe.blocked)td2Pop(foe.x,foe.y-14,'🛑 BỊ CHẶN','#f97316',11,-18);
      foe.blocked=true;m.fight=.18;
      m.cd-=dt;if(m.cd<=0){m.cd=m.rate;
        const md=Math.min(Math.max(0,foe.hp),m.dmg);foe.hp-=m.dmg;
        if(m.owner)td2St(m.owner).minion+=md;
        if(foe.hp<=0&&!foe.dead){foe.dead=true;foe.killed=true;if(m.owner)td2St(m.owner).kill++}}
      if(m.owner)td2St(m.owner).cc+=dt;
      m.hp-=eDps*(foe.boss?2.4:1)*dt;
      if(m.hp<=0){m.dead=true;td2FxAdd({x1:m.x,y1:m.y,x2:m.x,y2:m.y,c:'#94a3b8',kind:'poof',lv:1,t:0,dur:.4})}
    }else{
      if(m.fight>0)m.fight-=dt;
      m.d=Math.max(m.minD||0,m.d-58*dt);
    }
    const pm=td2Pos(m.d);m.x=pm.x;m.y=pm.y;
  }
  GM.minions=GM.minions.filter(m=>!m.dead);
  for(const t of GM.towers){
    if(t.heat>0)t.heat-=dt;
    if(t.maxHp===undefined)td2Stats(t);
    if(t.hp===undefined)t.hp=t.maxHp;
    /* 💚 tự hồi máu (bậc cao & có sao) */
    if(!t.broken&&t.regen&&t.hp<t.maxHp){const h=Math.min(t.maxHp-t.hp,t.maxHp*t.regen*dt);
      t.hp+=h;td2St(t).heal+=h}
    /* 💚 Lv.20 hồi máu cho các trụ xung quanh */
    if(!t.broken&&t.auraHeal){for(const o of GM.towers){if(o===t||o.broken||o.hp>=o.maxHp)continue;
      if(Math.hypot(o.x-t.x,o.y-t.y)<110){const h=Math.min(o.maxHp-o.hp,o.maxHp*t.auraHeal*dt);
        o.hp+=h;td2St(t).heal+=h}}}
    if(t.broken)continue;
    if(t.stun>0){t.stun-=dt;continue}
    t.cd-=dt;if(t.cd<=0){let tg=null,best=-1,bt=null,bb=-1;
    for(const e of GM.enemies){if(e.dead||e.hidden)continue;const dx=e.x-t.x,dy=e.y-t.y;if(dx*dx+dy*dy<=t.range*t.range){if(e.boss){if(e.d>bb){bb=e.d;bt=e}}else if(e.d>best){best=e.d;tg=e}}}
    const aim=bt||tg;if(aim){t.cd=t.rate*(GM.rageT>0?.5:1)*((t.heat>0)?1.3:1);td2Fire(t,aim)}}}
  /* 🧫 phân thân: quái chết thì tách thành 2 con nhỏ */
  const kids=[];
  for(const e of GM.enemies){
    if(!e.dead||!e.killed||!e.split||e.child)continue;
    const hp=Math.max(8,Math.round(e.max*.35));
    for(let i=0;i<2;i++){const dd=Math.max(0,e.d-8-i*14),pp=td2Pos(dd);
      kids.push({kind:'splitter',child:true,d:dd,x:pp.x,y:pp.y,hp:hp,max:hp,speed:e.speed*1.15,em:'🦠',
        armor:Math.round((e.armor||0)*.5),star:e.star,reward:Math.max(1,Math.round((e.reward||2)*.4)),
        boss:false,slowT:0,slowP:1,burn:0,shield:0,maxShield:0});}
    td2Pop(e.x,e.y,'🧫 PHÂN THÂN!','#a3e635',14,-26);
  }
  if(kids.length)GM.enemies=GM.enemies.concat(kids);
  let esc=0;GM.enemies=GM.enemies.filter(e=>{if(!e.dead)return true;if(e.escaped)esc+=e.boss?3:1;if(e.killed){GM.gold+=e.reward;GM.kills++;if(e.boss){GM.bossKills=(GM.bossKills||0)+1;confetti(60);sndWin();toast('🏆 Hạ gục BOSS '+e.bossName+'! +'+e.reward+'🪙')}}return false});
  if(esc){GM.lives-=esc;sndNo();td2Pop(GM.castle.x,GM.castle.y-16,'💔 −'+esc+' ❤️','#ef4444',17,-32)}
  if(GM.rageT>0)GM.rageT-=dt;
  if(GM.pop){for(const q of GM.pop){q.t+=dt;q.y+=q.vy*dt;q.vy*=(1-1.6*dt)}GM.pop=GM.pop.filter(q=>q.t<q.dur)}
  if(GM.spellCd)for(const k in GM.spellCd)if(GM.spellCd[k]>0)GM.spellCd[k]=Math.max(0,GM.spellCd[k]-dt);
  for(const f of GM.fx)f.t+=dt;GM.fx=GM.fx.filter(f=>f.t<f.dur);
  if(GM.running&&!GM.queue.length&&!GM.enemies.length){GM.running=false;td2RoundDone()}
  td2Draw();td2HUD();
  if(GM.lives<=0){td2GameOver();return}
}
/* 🔁 Chỉ cho phép ĐÚNG MỘT vòng lặp vẽ chạy tại một thời điểm.
   Trước đây mỗi lần bấm vào Thủ thành lại tạo thêm một vòng lặp mà vòng cũ
   không hề dừng, nên máy phải vẽ 2-3-4 lần cho mỗi khung hình → giật nặng. */
let TD_RUN=0;
function td2StopLoop(){TD_RUN++;if(typeof GM==='object'&&GM&&GM.raf){cancelAnimationFrame(GM.raf);GM.raf=0}}
function td2StartLoop(){
  td2StopLoop();
  const my=TD_RUN;
  const step=ts=>{
    if(my!==TD_RUN||!GM||GM.type!=='tower2')return;
    td2Loop(ts);
    if(my===TD_RUN&&GM&&GM.type==='tower2')GM.raf=requestAnimationFrame(step);
  };
  if(GM)GM.raf=requestAnimationFrame(step);
}
/* 🌳 Cảnh vật riêng cho từng địa hình (cố định theo map, không nhấp nháy) */
const TD_DECOR={grass:['🌳','🌲','🌿','🌼','🪨','🍄'],desert:['🌵','🪨','🦴','🏺','🌾'],
 ice:['🧊','⛄','🗻','❄️','🪨'],jungle:['🌴','🌿','🍌','🦜','🌺','🪨'],volcano:['🌋','🪨','🔥','💀','⛰️']};
function td2Decor(){
  const M=td2Map();
  if(GM._decorId===M.id&&GM._decor)return GM._decor;
  let sd=7;for(let i=0;i<M.id.length;i++)sd=(sd*31+M.id.charCodeAt(i))>>>0;
  const rr=()=>{sd=(sd*1664525+1013904223)>>>0;return sd/4294967296};
  const set=TD_DECOR[M.id]||['🌿'],out=[];
  for(let i=0;i<220&&out.length<24;i++){
    const x=14+rr()*452,y=14+rr()*372;
    if(td2NearPath(x,y)<32)continue;
    if(Math.hypot(x-GM.castle.x,y-GM.castle.y)<52)continue;
    if(out.some(o=>Math.hypot(o.x-x,o.y-y)<34))continue;
    out.push({x,y,em:set[Math.floor(rr()*set.length)],s:12+Math.floor(rr()*10)});
  }
  GM._decorId=M.id;GM._decor=out;return out;
}
/* ============================================================
   🎨 BỘ VẼ "GIẢ 3D" — bóng đổ, khối trụ, ánh sáng, hạt bay
   Canvas 2D nên chiều sâu được tạo bằng: bóng elip dưới chân,
   mặt bên của khối, gradient ánh sáng từ trên-trái, và vệt sáng.
   ============================================================ */
function td2Sh(x,cx,cy,rx,ry,a){const a0=x.globalAlpha;x.globalAlpha=a;x.fillStyle='#000';
  x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,7);x.fill();x.globalAlpha=a0}
/* khối trụ tròn: mặt bên + mặt trên bắt sáng */
function td2Cyl(x,cx,cy,R,H,topA,topB,sideA,sideB,cache){
  const ry=R*.42;
  let sg,tg;
  if(cache&&cache._cylK===cx+'|'+cy+'|'+R){sg=cache._cylS;tg=cache._cylT}
  else{
    sg=x.createLinearGradient(cx-R,0,cx+R,0);
    sg.addColorStop(0,sideA);sg.addColorStop(.42,sideB);sg.addColorStop(1,sideA);
    tg=x.createRadialGradient(cx-R*.38,cy-ry*.55,1,cx,cy,R*1.15);
    tg.addColorStop(0,topA);tg.addColorStop(1,topB);
    if(cache){cache._cylK=cx+'|'+cy+'|'+R;cache._cylS=sg;cache._cylT=tg}
  }
  x.fillStyle=sg;x.beginPath();
  x.moveTo(cx+R,cy);x.lineTo(cx+R,cy+H);
  x.ellipse(cx,cy+H,R,ry,0,0,Math.PI);
  x.lineTo(cx-R,cy);x.closePath();x.fill();
  x.fillStyle=tg;x.beginPath();x.ellipse(cx,cy,R,ry,0,0,7);x.fill();
}
/* emoji — chiều sâu đã do bóng elip dưới chân lo, nên KHÔNG dùng shadowBlur
   (shadowBlur là thứ tốn CPU nhất trong canvas 2D).
   Ngoài ra, gán ctx.font là thao tác đắt vì trình duyệt phải phân tích lại chuỗi font:
   ở đây cỡ chữ được làm tròn rồi CHỈ gán khi khác cỡ cũ — bớt được rất nhiều lần gán. */
/* 🖼️ KHO ẢNH EMOJI
   Vẽ emoji bằng fillText là phải dựng lại cả glyph màu mỗi lần — với hơn 120 emoji
   động mỗi khung hình, đó là phần nặng nhất của cả bản vẽ.
   Giờ mỗi cặp (emoji · cỡ) chỉ dựng MỘT LẦN vào một ảnh nhỏ, sau đó chỉ còn dán ảnh.
   Nhìn ra y hệt như cũ — chỉ khác là không phải dựng lại mỗi khung. */
const TD_ESPR={}; let TD_ESPRN=0;
function td2Spr(em,S){
  const k=em+'|'+S; let c=TD_ESPR[k]; if(c)return c;
  if(TD_ESPRN>2200){for(const kk in TD_ESPR)delete TD_ESPR[kk];TD_ESPRN=0}
  const W=(S*1.8|0)+6;
  const tmp=document.createElement('canvas');tmp.width=W;tmp.height=W;
  const g=tmp.getContext('2d');
  g.textAlign='center';g.textBaseline='middle';g.font=S+'px serif';
  g.fillText(em,W/2,W/2);
  /* ✂️ Cắt sát viền: ảnh thừa toàn khoảng trong suốt vẫn phải dán và trộn màu.
     Cắt bỏ đi thì mỗi khung hình đỡ được khoảng một nửa số điểm ảnh. */
  let x0=W,y0=W,x1=-1,y1=-1;
  try{
    const d=g.getImageData(0,0,W,W).data;
    for(let y=0;y<W;y++){const ro=y*W;
      for(let x=0;x<W;x++){ if(d[(ro+x)*4+3]>6){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y } }}
  }catch(e){ x1=-1 }
  if(x1<0){x0=0;y0=0;x1=W-1;y1=W-1}
  const cw=x1-x0+1, ch=y1-y0+1;
  c=document.createElement('canvas');c.width=cw;c.height=ch;
  c.getContext('2d').drawImage(tmp,x0,y0,cw,ch,0,0,cw,ch);
  c._ox=W/2-x0; c._oy=W/2-y0;
  TD_ESPR[k]=c; TD_ESPRN++; return c;
}
function td2Emo(x,em,cx,cy,size,rot,squash){
  const lo=(typeof GM==='object'&&GM)?(GM._lo||0):0;
  let S=size<8?8:size|0; if(lo)S=S&~1;
  const sp=td2Spr(em,S);
  if(lo>1||(!rot&&!squash)){x.drawImage(sp,cx-sp._ox,cy-sp._oy);return}
  x.save();x.translate(cx,cy);
  if(rot)x.rotate(rot);
  if(squash)x.scale(squash[0],squash[1]);
  x.drawImage(sp,-sp._ox,-sp._oy);
  x.restore();
}
/* 🧱 Kho ảnh BỆ TRỤ dựng sẵn theo (bậc · số sao) — dán ảnh nhanh hơn tô elip dày rất nhiều */
const TD_PLATE={}, TD_PLW=64, TD_PLH=52, TD_PLW2=32, TD_PLH2=26;
function td2Plate(tier,star,RING,col){
  const k=tier+'|'+star+'|'+col;
  let c=TD_PLATE[k];
  if(c)return c;
  c=document.createElement('canvas');c.width=TD_PLW;c.height=TD_PLH;
  const g=c.getContext('2d');
  const cx=TD_PLW2, cy=TD_PLH2;
  td2Sh(g,cx,cy+9,17,6.5,.34);
  /* mặt bệ pha màu riêng của trụ để phân biệt các loại trụ với nhau */
  td2Cyl(g,cx,cy,16.5,7,'#ffffff',col||'#c9d4e3','#475569',col||'#aab6c6');
  g.globalAlpha=.30;g.fillStyle=col||'#c9d4e3';
  g.beginPath();g.ellipse(cx,cy,16.5,6.9,0,0,7);g.fill();g.globalAlpha=1;
  if(tier>=3){g.strokeStyle=RING;g.globalAlpha=.30;g.lineWidth=6.5+tier;
    g.beginPath();g.ellipse(cx,cy,16.8,7.1,0,0,7);g.stroke();g.globalAlpha=1}
  g.strokeStyle=RING;g.lineWidth=tier?2.2+tier*.45:1.6;
  g.beginPath();g.ellipse(cx,cy,16.8,7.1,0,0,7);g.stroke();
  if(star){g.strokeStyle='rgba(251,191,36,.62)';g.lineWidth=1.8;
    g.beginPath();g.ellipse(cx,cy,20,8.4,0,0,7);g.stroke()}
  TD_PLATE[k]=c;return c;
}
/* hướng di chuyển của quái trên đường đi (để nghiêng người) */
function td2Head(d){const a=td2Pos(Math.max(0,d-7)),b=td2Pos(d+7);return Math.atan2(b.y-a.y,b.x-a.x)}
/* ---------- nền địa hình: phần TĨNH được vẽ 1 lần rồi lưu lại ----------
   (vẽ lại 150 túm cỏ + gradient mỗi khung hình sẽ rất tốn, nên nền tĩnh
    được "nướng" sẵn vào một canvas ẩn và chỉ dán lại mỗi khung.) */
function td2GroundBase(x,MP){
  const bg=x.createLinearGradient(0,0,120,400);
  bg.addColorStop(0,MP.b);bg.addColorStop(1,MP.a);
  x.fillStyle=bg;x.fillRect(0,0,480,400);
  x.save();
  if(MP.id==='grass'||MP.id==='jungle'){
    x.strokeStyle=MP.id==='jungle'?'rgba(6,78,59,.30)':'rgba(21,128,61,.22)';
    x.lineWidth=1.6;x.lineCap='round';
    for(let i=0;i<170;i++){
      const gx=(i*79.3)%484,gy=(i*137.7)%404,sw=Math.sin(i*.7)*2.6;
      x.beginPath();x.moveTo(gx,gy);x.quadraticCurveTo(gx+sw*.5,gy-4,gx+sw,gy-8);x.stroke();
    }
  }else if(MP.id==='desert'){
    for(let b=0;b<9;b++){const yy=b*46+18;
      x.fillStyle='rgba(180,120,40,'+(.05+(b%2)*.045)+')';
      x.beginPath();x.moveTo(0,yy);
      for(let px=0;px<=480;px+=24)x.lineTo(px,yy+Math.sin(px*.021+b)*7);
      x.lineTo(480,yy+22);x.lineTo(0,yy+22);x.closePath();x.fill()}
  }else if(MP.id==='ice'){
    x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=1.3;
    for(let i=0;i<18;i++){const sx=(i*163)%470,sy=(i*211)%390;
      x.beginPath();x.moveTo(sx,sy);x.lineTo(sx+18+(i%4)*9,sy+11);x.lineTo(sx+9,sy+27);x.stroke()}
  }else if(MP.id==='volcano'){
    x.fillStyle='rgba(0,0,0,.16)';
    for(let i=0;i<24;i++){const sx=(i*97)%474,sy=(i*151)%394;
      x.beginPath();x.ellipse(sx,sy,6+(i%3)*3,3,i*.6,0,7);x.fill()}
  }
  x.restore();
  const vg=x.createRadialGradient(240,200,120,240,200,330);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.28)');
  x.fillStyle=vg;x.fillRect(0,0,480,400);
}
/* lớp sống động vẽ mỗi khung — cố tình giữ thật nhẹ */
function td2GroundLive(x,MP,T){
  x.save();
  if(MP.id==='volcano'){
    for(let i=0;i<7;i++){
      const cx=(i*127+35)%470,cy=(i*89+25)%385,pu=.5+.5*Math.sin(T*1.9+i*1.1);
      x.fillStyle='rgba(220,38,38,'+(.10+pu*.14)+')';
      x.beginPath();x.arc(cx,cy,17+pu*9,0,7);x.fill();
      x.fillStyle='rgba(251,146,60,'+(.22+pu*.28)+')';
      x.beginPath();x.arc(cx,cy,9+pu*4,0,7);x.fill();
      x.fillStyle='rgba(254,215,170,'+(.42+pu*.4)+')';
      x.beginPath();x.ellipse(cx,cy,6+pu*2.5,2.2,i*.7,0,7);x.fill()}
  }else if(MP.id==='ice'){
    for(let i=0;i<26;i++){const sx=(i*97+13)%474,sy=(i*57+29)%394,tw=.5+.5*Math.sin(T*3+i*1.3);
      x.fillStyle='rgba(255,255,255,'+(.16+tw*.6)+')';
      x.beginPath();x.arc(sx,sy,1+tw*1.7,0,7);x.fill()}
  }else if(MP.id==='jungle'){
    for(let i=0;i<8;i++){const cx=(i*151+40)%470,cy=(i*97+30)%390,r=30+((i*13)%20);
      x.fillStyle='rgba(254,240,138,'+(.05+.045*Math.sin(T*.7+i)).toFixed(3)+')';
      x.beginPath();x.arc(cx+Math.sin(T*.3+i)*8,cy,r,0,7);x.fill()}
  }else if(MP.id==='desert'){
    x.globalAlpha=.10;x.fillStyle='#fff';
    for(let i=0;i<7;i++){const hx=(i*131+25)%470,hy=380-((T*26+i*57)%400);
      x.beginPath();x.ellipse(hx,hy,17,5,0,0,7);x.fill()}
  }else{
    x.strokeStyle='rgba(21,128,61,.16)';x.lineWidth=1.5;x.lineCap='round';
    for(let i=0;i<34;i++){const gx=(i*173)%478,gy=(i*211+40)%398,sw=Math.sin(T*1.7+i*.8)*3.4;
      x.beginPath();x.moveTo(gx,gy);x.quadraticCurveTo(gx+sw*.5,gy-5,gx+sw,gy-9);x.stroke()}
  }
  x.restore();
}
/* ---------- hạt bay trong không khí (tro / tuyết / lá / cát) ---------- */
function td2AmbFx(x,MP,T){
  const cfg={volcano:{n:24,c:'rgba(251,146,60,',up:-1,sz:2.2},
             ice    :{n:30,c:'rgba(255,255,255,',up:1, sz:2.0},
             jungle :{n:16,c:'rgba(134,239,172,',up:1, sz:2.6},
             desert :{n:20,c:'rgba(253,230,138,',up:1, sz:1.8},
             grass  :{n:14,c:'rgba(253,224,71,', up:-1,sz:2.2}}[MP.id]||{n:12,c:'rgba(255,255,255,',up:1,sz:2};
  x.save();
  for(let i=0;i<cfg.n;i++){
    const sp=18+((i*37)%26), ph=(T*sp+i*211)%440;
    const py=cfg.up>0?ph-20:420-ph;
    const px=((i*163+29)%480)+Math.sin(T*1.1+i)*11;
    const a=.30+.45*Math.sin(T*2+i*.9);
    x.fillStyle=cfg.c+Math.max(.06,a).toFixed(2)+')';
    x.beginPath();x.arc(px,py,cfg.sz*(.6+.5*Math.sin(T+i)),0,7);x.fill();
  }
  x.restore();
}
/* ---------- đường đi nổi khối + mũi tên chỉ hướng chạy ---------- */
function td2Road(x,MP,T,arrowsOnly){
  const P=GM.path;x.save();x.lineJoin='round';x.lineCap='round';
  if(arrowsOnly){x.restore();td2RoadArrows(x,T);return}
  const line=(w,c,dy)=>{x.strokeStyle=c;x.lineWidth=w;x.beginPath();
    x.moveTo(P[0].x1,P[0].y1+(dy||0));for(const s of P)x.lineTo(s.x2,s.y2+(dy||0));x.stroke()};
  const dk=(c,k)=>{const m=/^#(..)(..)(..)$/.exec(c);if(!m)return c;
    return 'rgb('+[1,2,3].map(i=>Math.max(0,Math.round(parseInt(m[i],16)*k))).join(',')+')'};
  line(38,'rgba(0,0,0,.26)',6);          /* bóng đổ xuống đất */
  line(34,dk(MP.road,.62),3.5);          /* thành đường (mặt bên) */
  line(33,MP.road,0);                    /* mặt đường */
  line(23,MP.road2,-.6);                 /* lòng đường sáng hơn */
  x.globalAlpha=.30;line(30,'rgba(255,255,255,.9)',-4.5);x.globalAlpha=1;  /* gờ bắt sáng */
  x.globalAlpha=.34;x.setLineDash([10,12]);line(2.6,'#fff8e7',0);x.setLineDash([]);x.globalAlpha=1;
  x.restore();
}
/* mũi tên chảy dọc đường — toạ độ đã xoay sẵn được TÍNH MỘT LẦN cho mỗi bản đồ,
   mỗi khung hình chỉ còn việc đổi độ sáng thành một đợt sáng chạy dọc đường. */
function td2ArrowPts(){
  const id=Math.round(GM.total)+'|'+GM.path.length;
  if(GM._arrId===id&&GM._arr)return GM._arr;
  const out=[],step=54;
  for(let d=18;d<GM.total-10;d+=step){
    const q=td2Pos(d),an=td2Head(d),c=Math.cos(an),si=Math.sin(an);
    out.push({d:d,
      ax:q.x+(-5*c+5*si), ay:q.y+(-5*si-5*c),
      bx:q.x+4*c,         by:q.y+4*si,
      cx:q.x+(-5*c-5*si), cy:q.y+(-5*si+5*c)});
  }
  GM._arr=out;GM._arrId=id;return out;
}
/* 16 mức độ trong suốt dựng sẵn — gán chuỗi màu mới mỗi khung khiến trình duyệt
   phải phân tích lại mã màu, rất tốn khi có nhiều nét vẽ. */
const TD_AW=[];for(let i=0;i<16;i++)TD_AW.push('rgba(255,255,255,'+(.10+.20*i/15).toFixed(3)+')');
function td2RoadArrows(x,T){
  const arr=td2ArrowPts();
  x.lineCap='round';x.lineWidth=2.6;
  for(let i=0;i<arr.length;i++){
    const A=arr[i], k=(7.5+7.5*Math.sin(T*2.6-A.d*.045))|0;
    x.strokeStyle=TD_AW[k];
    x.beginPath();x.moveTo(A.ax,A.ay);x.lineTo(A.bx,A.by);x.lineTo(A.cx,A.cy);x.stroke();
  }
}
/* nền tĩnh (địa hình + đường) được nướng sẵn 1 lần */
function td2BG(MP){
  const id=MP.id+'|'+Math.round(GM.total)+'|'+GM.path.length;
  if(GM._bgId===id&&GM._bg)return GM._bg;
  const c=document.createElement('canvas');c.width=480;c.height=400;
  const g=c.getContext('2d');
  td2GroundBase(g,MP);
  td2Road(g,MP,0);
  /* cây cối, đá... đứng yên nên vẽ thẳng vào nền — tiết kiệm ~24 lượt vẽ mỗi khung */
  g.textAlign='center';g.textBaseline='middle';g.__fs=0;
  for(const d of td2Decor()){
    td2Sh(g,d.x,d.y+d.s*.42,d.s*.36,d.s*.15,.26);
    td2Emo(g,d.em,d.x,d.y,d.s,0);
  }
  GM._bg=c;GM._bgId=id;
  return c;
}
function td2Draw(){
  const cv=$('td2cv');if(!cv)return;
  /* 🪶 Máy đuối thì VẼ NHỎ LẠI rồi để trình duyệt phóng to cho vừa khung.
     Số điểm ảnh phải tô giảm gần một nửa — đây là cách giảm tải mạnh nhất
     mà không phải bỏ bớt quái hay hiệu ứng nào của trò chơi. */
  const rs = GM._lo>1?.72 : 1;
  if(GM._rs!==rs){GM._rs=rs;cv.width=Math.round(480*rs);cv.height=Math.round(400*rs)}
  const x=cv.getContext('2d',{alpha:false});
  x.setTransform(rs,0,0,rs,0,0);
  x.__fs=0;x.__pf=0;
  const MP=td2Map(),T=(GM.last||0)/1000;
  const pul=.5+.5*Math.sin(T*1.6);
  x.textAlign='center';x.textBaseline='middle';
  x.drawImage(td2BG(MP),0,0);
  if(!GM._lo)td2GroundLive(x,MP,T);
  td2RoadArrows(x,T);
  /* ----- thành trì ----- */
  td2Sh(x,GM.castle.x,GM.castle.y+16,21,8,.30);
  td2Cyl(x,GM.castle.x,GM.castle.y+12,22,6,'#e2e8f0','#94a3b8','#475569','#94a3b8',GM.castle);
  x.strokeStyle='rgba(139,92,246,'+(.12+pul*.16)+')';x.lineWidth=7;
  x.beginPath();x.arc(GM.castle.x,GM.castle.y,25+pul*3,0,7);x.stroke();
  x.strokeStyle='rgba(139,92,246,'+(.30+pul*.38)+')';x.lineWidth=2.5;
  x.beginPath();x.arc(GM.castle.x,GM.castle.y,25+pul*3,0,7);x.stroke();
  td2Emo(x,'🏰',GM.castle.x,GM.castle.y-4+Math.sin(T*1.3)*1.2,34);
  /* ----- TRỤ: bệ khối tròn + nhân vật thở, xoay về mục tiêu ----- */
  for(const t of GM.towers){
    const tier=t.level>=20?5:t.level>=16?4:t.level>=13?3:t.level>=7?2:t.level>=3?1:0;
    const RING=['#e5e7eb','#a78bfa','#38bdf8','#fb923c','#f59e0b','#fbbf24'][tier];
    const rec=Math.max(0,1-(t.rate-t.cd)/.16);          /* độ "giật" ngay sau khi bắn */
    const bob=Math.sin(T*2.3+t.x*.11)*1.5;              /* nhịp thở */
    const py=t.y+7;                                     /* tâm mặt bệ */
    /* 🧱 Bệ trụ (bóng + khối trụ + vòng cấp + vòng sao) không đổi theo thời gian
       → vẽ sẵn một lần cho mỗi (loại trụ · bậc · sao) rồi dán ảnh.
       Trước đây mỗi khung phải tô 2 vòng elip dày + 2 gradient cho TỪNG trụ,
       đó là phần tốn nhất của cả bản vẽ. */
    x.drawImage(td2Plate(tier,t.star||0,RING,T.color), t.x-TD_PLW2, py-TD_PLH2);
    /* hạt sáng quay quanh bệ — phần duy nhất còn động */
    if(t.star){
      x.fillStyle='rgba(253,224,71,'+(.55+pul*.4)+')';
      for(let i=0;i<t.star;i++){const an=T*1.5+i*(6.283/t.star);
        x.beginPath();x.arc(t.x+Math.cos(an)*20,py+Math.sin(an)*8.4,1.9,0,7);x.fill()}
    }
    if(t.broken)x.globalAlpha=.32; else if(t.stun>0)x.globalAlpha=.45;
    /* nhân vật: nghiêng về phía mục tiêu + nhún khi bắn */
    const lean=t.aimA!=null?Math.max(-.28,Math.min(.28,Math.cos(t.aimA)*.3)):0;
    const sq=[1+rec*.10,1-rec*.13];
    td2Emo(x,t.em||TT[t.type].em,t.x,t.y-9+bob-rec*2.5,23+Math.min(tier,4)*1.3+rec*3,lean,sq);
    x.globalAlpha=1;
    if(t.broken)td2Emo(x,'💥',t.x,t.y-2,19);
    if(t.maxHp&&t.hp<t.maxHp){
      const hw=26,hr=Math.max(0,t.hp/t.maxHp);
      x.fillStyle='rgba(15,23,42,.62)';x.fillRect(t.x-hw/2,py+11,hw,4.5);
      x.fillStyle=hr>.5?'#22c55e':hr>.25?'#f59e0b':'#ef4444';
      x.fillRect(t.x-hw/2,py+11,hw*hr,4.5);
    }
    if(t.regen&&!t.broken){x.save();x.globalAlpha=.55+pul*.35;x.font='10px serif';x.__fs=0;x.fillText('💚',t.x-14,t.y+9);x.restore();x.__fs=0}
    if(t.stun>0)td2Emo(x,'⚡',t.x-13,t.y-14,15);
    if(t.heat>0)td2Emo(x,'🥵',t.x+13,t.y-14,12);
    if(GM.rageT>0)td2Emo(x,'🔥',t.x+14,t.y+8,12);
    if(t.level>1){
      x.fillStyle=['#8b5cf6','#8b5cf6','#0ea5e9','#f97316','#f59e0b','#eab308'][tier];
      x.beginPath();x.arc(t.x+12,t.y-14,t.level>9?9:7.8,0,7);x.fill();
      x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=1;x.stroke();
      x.fillStyle='#fff';x.font='bold '+(t.level>9?9:10)+'px system-ui,sans-serif';x.__fs=0;x.fillText(String(t.level),t.x+12,t.y-13.5);
    }
    if(t.star){x.fillStyle='#f59e0b';x.font='bold 9px system-ui,sans-serif';x.__fs=0;x.fillText('★'+t.star,t.x-12,t.y+9)}
  }
  if(GM.sel){
    x.save();x.strokeStyle='rgba(139,92,246,.55)';x.lineWidth=2;x.setLineDash([7,7]);
    x.lineDashOffset=-T*14;
    x.beginPath();x.arc(GM.sel.x,GM.sel.y,GM.sel.range,0,7);x.stroke();x.restore();
    x.fillStyle='rgba(139,92,246,.08)';x.beginPath();x.arc(GM.sel.x,GM.sel.y,GM.sel.range,0,7);x.fill();
  }
  /* ----- 🧊 tảng băng chắn đường ----- */
  for(const b of (GM.bergs||[])){
    const k=Math.max(0,b.t/b.max);
    td2Sh(x,b.x,b.y+10,13,5,.30*k);
    x.save();x.globalAlpha=.35+k*.45;
    x.fillStyle='#bae6fd';x.strokeStyle='#0ea5e9';x.lineWidth=2;
    x.beginPath();x.moveTo(b.x-12,b.y+8);x.lineTo(b.x-7,b.y-11);x.lineTo(b.x+2,b.y-15);
    x.lineTo(b.x+11,b.y-6);x.lineTo(b.x+12,b.y+8);x.closePath();x.fill();x.stroke();
    x.restore();
    td2Emo(x,'🧊',b.x,b.y-2,17);
  }
  /* ----- lính & đệ tử ----- */
  for(const m of (GM.minions||[])){
    if(m.fly){m.wx=Math.sin(T*4.5+m.ph)*9;m.wy=Math.cos(T*6.2+m.ph)*7-9}else{m.wx=0;m.wy=0}
    td2Sh(x,m.x,m.y+11,10,4.2,.30);
    x.fillStyle='rgba(15,23,42,.55)';x.fillRect(m.x-11,m.y-16,22,4.5);
    x.fillStyle='#38bdf8';x.fillRect(m.x-11,m.y-16,22*Math.max(0,m.hp/m.max),4.5);
    td2Emo(x,m.em,m.x+(m.wx||0),m.y+(m.wy||0)+Math.sin(T*5+m.x)*1.1,m.fly?17:19,
           m.fight>0?Math.sin(T*18)*.22:(m.fly?Math.sin(T*7+m.ph)*.25:0));
    if(m.fight>0)td2Emo(x,'⚔️',m.x+12+(m.wx||0),m.y-9+(m.wy||0),14);
  }
  /* ----- QUÁI ----- */
  /* Gom hết bóng dưới chân vào MỘT đường dẫn rồi tô một lần:
     77 lần đặt màu + 77 lần fill() rút xuống còn 1. */
  if(GM.enemies.length){
    if(GM._lo<2){
      x.globalAlpha=.32;x.fillStyle='#000';x.beginPath();
      for(const e of GM.enemies){
        const big=!!e.boss, g2=Math.sin(T*(big?5:9)+e.d*.09);
        x.ellipse(e.x,e.y+(big?15:11),(big?16:9)*(1-(g2<0?-g2:g2)*.10),big?6.2:4,0,0,7);
      }
      x.fill();x.globalAlpha=1;
    }
    /* 🩸 Thanh máu: gom theo màu. 80 quái từ ~400 lượt vẽ rút còn ~6. */
    const BG=[],SH=[],C={};
    for(const e of GM.enemies){
      const bb=!!e.boss,w=bb?38:24,top=e.y-(bb?26:18);
      BG.push(e.x-w/2,top,w);
      const hpp=Math.max(0,e.hp/e.max);
      const col=e.slowT>0?'#38bdf8':hpp>.5?'#22c55e':hpp>.22?'#f59e0b':'#ef4444';
      (C[col]||(C[col]=[])).push(e.x-w/2,top,w*hpp);
      if(e.shield>0)SH.push(e.x-w/2,top-5,w,Math.max(0,e.shield/(e.maxShield||1)));
    }
    x.fillStyle='rgba(15,23,42,.60)';for(let i=0;i<BG.length;i+=3)x.fillRect(BG[i],BG[i+1],BG[i+2],5.2);
    for(const col in C){x.fillStyle=col;const A=C[col];for(let i=0;i<A.length;i+=3)x.fillRect(A[i],A[i+1],A[i+2],5.2)}
    if(SH.length){
      x.fillStyle='rgba(15,23,42,.5)';for(let i=0;i<SH.length;i+=4)x.fillRect(SH[i],SH[i+1],SH[i+2],3.5);
      x.fillStyle='#60a5fa';for(let i=0;i<SH.length;i+=4)x.fillRect(SH[i],SH[i+1],SH[i+2]*SH[i+3],3.5);
    }
  }
  for(const e of GM.enemies){
    if(e._ph==null)e._ph=e.hp;
    if(e.hp<e._ph-.5){e.hitT=.20}
    e._ph=e.hp;
    if(e.hitT>0)e.hitT=Math.max(0,e.hitT-.016);
    const big=!!e.boss, sz=big?33:23, w=big?38:24, top=e.y-(big?26:18);
    const gait=Math.sin(T*(big?5:9)+e.d*.09);          /* bước chân */
    const head=td2Head(e.d||0);
    const lean=Math.max(-.3,Math.min(.3,Math.cos(head)*.26));
    const hit=e.hitT>0?e.hitT/.20:0;
    if(big&&e.aura){
      x.save();x.strokeStyle='rgba(192,132,252,'+(.30+pul*.35)+')';x.lineWidth=2.5;
      x.setLineDash([12,9]);x.lineDashOffset=-T*22;
      x.beginPath();x.arc(e.x,e.y,80,0,7);x.stroke();x.restore();
      x.fillStyle='rgba(192,132,252,.09)';x.beginPath();x.arc(e.x,e.y,80,0,7);x.fill();
    }
    if(big&&e.raged){
      x.fillStyle='rgba(248,113,113,'+(.13+pul*.12)+')';x.beginPath();x.arc(e.x,e.y,26,0,7);x.fill();
      x.fillStyle='rgba(248,113,113,'+(.17+pul*.14)+')';x.beginPath();x.arc(e.x,e.y,15,0,7);x.fill();
      for(let i=0;i<5;i++){const an=T*2.4+i*1.25;
        x.fillStyle='rgba(251,146,60,'+(.4+pul*.4)+')';
        x.beginPath();x.arc(e.x+Math.cos(an)*22,e.y+Math.sin(an)*22-2,2.1,0,7);x.fill()}
    }
    if(e.slowT>0){
      x.strokeStyle='rgba(56,189,248,.9)';x.lineWidth=2;
      x.beginPath();x.arc(e.x,e.y,big?19:13,0,7);x.stroke();
    }
    if(e.burn>0&&!GM._lo){for(let i=0;i<3;i++){const an=T*6+i*2.1;
      x.fillStyle='rgba(249,115,22,'+(.35+.35*Math.sin(T*9+i))+')';
      x.beginPath();x.arc(e.x+Math.cos(an)*7,e.y-6-((T*22+i*9)%14),2.2,0,7);x.fill()}}
    /* (thanh máu + khiên đã gom vẽ một lượt ở trên) */
    /* thân quái */
    if(e.hidden)x.globalAlpha=.26;
    td2Emo(x,e.em,e.x,e.y-Math.abs(gait)*(big?2.2:2.6)-hit*2,
           sz*(1+hit*.16),lean+gait*(big?.05:.09),hit>0?[1+hit*.14,1-hit*.16]:null);
    if(e.hidden)x.globalAlpha=1;
    if(hit>0){x.globalAlpha=hit*.55;x.fillStyle='#fff';
      x.beginPath();x.arc(e.x,e.y-3,sz*.42,0,7);x.fill();x.globalAlpha=1}
    const ic=[];
    if(GM._lo>1){continue}                      /* mức siêu nhẹ: bỏ dãy biểu tượng trạng thái */
    if(e.armor>0)ic.push(e.shredV>0?'💥':'🛡️');
    if(e.burn>0)ic.push('🔥');
    if(e.noSplash)ic.push('🪞');
    if(e.heal)ic.push('💉');
    if(e.zap)ic.push('⚡');
    if(e.wreck)ic.push('🪨');
    if(e.split)ic.push('🧫');
    if(e.fly)ic.push('🪽');
    if(e.aura)ic.push('👑');
    if(e.hidden)ic.push('💨');
    if(e.kind==='herald')ic.push('🏇');
    if(ic.length){x.font='9px serif';x.__fs=0;x.fillStyle='#fff';
      x.fillText(ic.length>3?ic.slice(0,3).join('')+'…':ic.join(''),e.x,top-(e.shield>0?11:7))}
    if(e.star&&!big){x.fillStyle='#fbbf24';x.font='bold 8px system-ui,sans-serif';x.__fs=0;x.fillText('★'+e.star,e.x+w/2+7,e.y-3)}
  }
  /* ----- thanh máu BOSS ----- */
  const bs=GM.enemies.find(e=>e.boss&&!e.dead);
  if(bs){
    x.fillStyle='rgba(15,23,42,.88)';x.fillRect(48,4,384,28);
    x.strokeStyle='rgba(248,113,113,.7)';x.lineWidth=1.5;x.strokeRect(48,4,384,28);
    x.fillStyle='#450a0a';x.fillRect(54,19,372,9);
    const bg=x.createLinearGradient(54,0,426,0);bg.addColorStop(0,'#fca5a5');bg.addColorStop(.5,'#f87171');bg.addColorStop(1,'#dc2626');
    x.fillStyle=bg;x.fillRect(54,19,372*Math.max(0,bs.hp/bs.max),9);
    x.fillStyle='rgba(255,255,255,.28)';x.fillRect(54,19,372*Math.max(0,bs.hp/bs.max),3);
    if(bs.shield>0){x.fillStyle='rgba(96,165,250,.95)';x.fillRect(54,14.5,372*Math.max(0,bs.shield/bs.maxShield),4)}
    const ea=Math.max(0,bs.armor-(bs.shredV||0));
    x.fillStyle='#fff';x.font='bold 10px system-ui,sans-serif';x.__fs=0;x.textAlign='left';
    x.fillText(bs.em+' '+bs.bossName+(bs.star?' ★'+bs.star:'')+'  '+(bs.shredV>0?'💥giáp '+ea+'/'+bs.armor:'🛡️'+bs.armor)+(bs.raged?'  😤NỔI GIẬN':'')+(bs.hidden?'  💨TÀNG HÌNH':'')+'  '+td2Num(Math.max(0,bs.hp))+'/'+td2Num(bs.max),54,11);
    x.textAlign='center';
  }
  td2DrawFx(x);
  if(!GM._lo)td2AmbFx(x,MP,T);
  /* ----- chữ bay báo chiến đấu ----- */
  x.textAlign='center';x.textBaseline='middle';
  x.lineWidth=3.4;x.strokeStyle='rgba(15,23,42,.92)';
  for(const q of (GM.pop||[])){
    const k=q.t/q.dur,a=k<.15?k/.15:1-Math.pow((k-.15)/.85,2);
    if(a<=.02)continue;
    /* chữ nhỏ giữ nguyên cỡ -> ctx.font gần như không đổi -> đỡ tốn CPU;
       chỉ chữ lớn mới nảy và mới có viền (strokeText rất nặng) */
    const big=q.s>=14;
    const fs=big?Math.round(q.s*(k<.18?1+(1-k/.18)*.35:1)):q.s;
    if(x.__pf!==fs){x.font='800 '+fs+'px system-ui,sans-serif';x.__pf=fs;x.__fs=0}
    x.globalAlpha=a;
    if(big&&!GM._lo)x.strokeText(q.txt,q.x,q.y);
    x.fillStyle=q.c;x.fillText(q.txt,q.x,q.y);
  }
  x.globalAlpha=1;
  /* 📊 đồng hồ FPS ở góc — bấm nút 📊 trong bảng bên để bật/tắt */
  if(GM.showFps){
    const f=GM._fps||0;
    let txt=f+' FPS'+(GM._lo>1?' · siêu nhẹ 🪶🪶':GM._lo?' · nhẹ hoá 🪶':'');
    let inFrame=false;try{inFrame=window.top!==window.self}catch(e){inFrame=true}
    if(inFrame)txt+=' · ⚠️ đang trong khung xem trước';
    x.font='bold 11px system-ui,sans-serif';x.__fs=0;x.textAlign='left';
    const w=x.measureText(txt).width+10;
    x.globalAlpha=.82;x.fillStyle='#0f172a';x.fillRect(4,382,w,15);
    x.globalAlpha=1;
    x.fillStyle=f>=55?'#4ade80':f>=40?'#fbbf24':'#f87171';
    x.fillText(txt,8,392);
    x.textAlign='center';
  }
  x.globalAlpha=1;
}
function td2ToggleFps(){if(!GM)return;GM.showFps=!GM.showFps;sndClick();
  toast(GM.showFps?'📊 Đã bật đồng hồ FPS ở góc bản đồ':'📊 Đã tắt đồng hồ FPS');td2Side()}
/* 🎚️ Mức đồ hoạ: auto (tự chỉnh) · hi (đẹp nhất) · lo (nhẹ nhất, ưu tiên mượt) */
let TD_QUAL=(function(){try{return localStorage.getItem('efz_qual')||'auto'}catch(e){return 'auto'}})();
const TD_QNAME={auto:'⚙️ Tự động',hi:'✨ Đẹp nhất',lo:'🪶 Nhẹ nhất'};
function td2SetQual(q){
  TD_QUAL=q;try{localStorage.setItem('efz_qual',q)}catch(e){}
  if(GM){GM._loN=0;GM._loD=0;GM._loU=0;GM._lo=(q==='lo')?2:0}
  sndClick();toast('🎚️ Mức đồ hoạ: '+TD_QNAME[q]+(q==='auto'?' — game tự giảm hiệu ứng khi máy chậm':''));
  td2Side();
}
function td2GameOver(){
  td2StopLoop();
  const surv=GM.mode==='survival',M=GM.map||TD_MAPS[0];
  const rounds=GM.round-1,xp=GM.kills+rounds*6+(GM.bossKills||0)*25;
  if(rounds>=3){confetti(80);sndWin()}
  P.gameWins++;
  let rec='';
  if(surv){
    const best=P.tdSurvBest||0;
    if(rounds>best){P.tdSurvBest=rounds;rec=`<div style="font-weight:800;color:#d97706;margin-top:4px">🏅 KỶ LỤC MỚI! Trước đó: ${best} đợt</div>`;confetti(120)}
    else rec=`<div style="color:var(--muted);font-weight:700;margin-top:4px">🏅 Kỷ lục của em: <b>${best}</b> đợt</div>`;
  }
  persist();checkBadges();
  const again=surv?'startTowerSurvival()':'startTower()';
  /* 🔄 cho đánh lại ĐÚNG đợt vừa thua, giữ nguyên trụ và vàng lúc vào đợt */
  const ck=td2CkptGet();
  const lost=GM.lives<=0;
  const replay=(ck&&lost)
    ? `<button class="btn teal" onclick="td2Replay()">🔄 Đánh lại đợt ${ck.round}</button>`
    : '';
  const replayNote=(ck&&lost)
    ? `<div style="font-size:12px;color:var(--muted);font-weight:600;margin:8px 0 2px">
         Đánh lại đợt ${ck.round} sẽ trả em về đúng lúc vừa bấm "Bắt đầu đợt ${ck.round}":
         <b>${(ck.towers||[]).length} trụ</b> · <b>🪙 ${(ck.gold||0).toLocaleString('vi')}</b> · <b>❤️ ${ck.lives}</b>.
         Lần này thử đặt trụ khác xem sao!
       </div>` : '';
  $('gamesCard').innerHTML=gameTop(surv?'🔥 Thủ thành Sinh Tồn':'🏰 Thủ thành')+
    `<div class="result"><div class="face">${GM.lives<=0?'💥':'🏆'}</div>
     <h3>${GM.lives<=0?'Thành đã thất thủ!':'Đã hoàn thành!'}</h3>
     <div class="scoreline">${M.em} ${M.name} · Qua <b>${rounds}</b> đợt · hạ <b>${GM.kills}</b> quái · 👹 <b>${GM.bossKills||0}</b> boss · ⭐ +${xp} XP</div>${rec}
     ${replayNote}
     <div class="row" style="justify-content:center">${replay}<button class="btn" onclick="${again}">🆕 Ván mới${surv?' (địa hình mới)':''}</button><button class="btn ghost" onclick="gamesHome()">← Games</button></div></div>`;
}
/* để admin.html và tools/check-data.js đọc được */
try{window.TT=TT;window.TD_MAPS=TD_MAPS;window.TD_SPELLS=TD_SPELLS;window.TD_KIND=TD_KIND;}catch(e){}
window.EFZ_LOADED=window.EFZ_LOADED||{};window.EFZ_LOADED.td=1;
