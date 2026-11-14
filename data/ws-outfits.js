/* =====================================================================
   WORD STRIKE 3D – DỮ LIỆU TRANG PHỤC (thêm / sửa bộ đồ ở ĐÂY, không cần sửa code)
   Trang phục CHỈ đổi ngoại hình, không đổi sức mạnh. Game kiểm tra file này khi nạp:
   sai chỗ nào thì dùng bộ mặc định + hiện cảnh báo, không bao giờ làm hỏng game.

   MỖI BỘ (sets[]) gồm: id (chữ thường_gạch_dưới, duy nhất) · name · rarity · icon · và tối đa 5 "món":
     hat    – mũ / tóc (gắn vào đầu)           : danh sách hộp, on = 'head'
     body   – thân, tay, chân                    : danh sách hộp, on = 'torso' | 'armL' | 'armR' | 'legL' | 'legR'
     back   – áo choàng / cánh / phụ kiện lưng   : danh sách hộp, on = 'back'
     trail  – vệt sáng khi chạy                  : { color, shape: 'box'|'star'|'leaf'|'line', size 0.05–0.3 }
     killfx – hiệu ứng khi hạ quái               : { colors: [1–3 màu], kind: 'burst'|'ring'|'rain'|'bolt' }
   Món nào không có thì bỏ trống (null). Người chơi được MIX & MATCH từng món giữa các bộ đã sở hữu.

   MỖI HỘP: [on, rộng, cao, sâu, x, y, z, '#màu']  (đơn vị mét, toạ độ tính từ khớp xoay của bộ phận)
     head : khớp ở cổ. Đầu cao 0 → 0.46, rộng ±0.23; mặt nhìn về phía z âm. Mũ đặt từ y ≥ 0.5.
     torso: khớp ở giữa thân. Thân rộng ±0.30, cao ±0.35, dày ±0.17. Hộp phủ ngoài dùng 0.64 × 0.74 × 0.38.
     armL/armR: khớp ở vai, tay buông xuống (y âm, dài 0.74).  legL/legR: khớp ở hông, chân dài 0.78.
     back : cùng khớp với thân; phía sau lưng là z DƯƠNG (0.2 trở lên).
   GIỚI HẠN (game từ chối nếu vượt): ≤ 14 hộp mỗi món · mỗi cạnh hộp ≤ 1.2 m · cả bộ rộng ≤ ±1.2 m và cao ≤ 2.6 m
     · không được có khoá chỉ số (hp, speed, dmg, cd, range, armor…) – trang phục không tăng sức mạnh.

   rarity: common (Thường) · rare (Hiếm) · epic (Sử thi) · legendary (Huyền thoại).
     Màu + số chấm + hình dấu hiệu của từng độ hiếm ở mục rarity bên dưới (đọc được cả khi mù màu).
     price = giá MUA THẲNG bằng xu (≥ 1,5 × chi phí kỳ vọng khi quay, xem design/gdd/big-chance-gacha.md F5).
   Lưu ý bản quyền: nhiều mẫu lấy cảm hứng từ nhân vật có thật / có bản quyền, vẽ kiểu khối hài hước, không logo.
   ===================================================================== */
window.WS_OUTFITS={version:1,
rarity:{
  common:   {name:'Thường',      color:'#eef2ff',dots:0,shape:'square', price:400},
  rare:     {name:'Hiếm',        color:'#3d8bff',dots:1,shape:'square', price:850},
  epic:     {name:'Sử thi',      color:'#a56bff',dots:2,shape:'diamond',price:2350},
  legendary:{name:'Huyền thoại', color:'#ffa733',dots:3,shape:'star',   price:5150}
},
sets:[
/* ---------------- THƯỜNG ---------------- */
{id:'hoc_sinh',name:'Học sinh',rarity:'common',icon:'🎒',default:true,
 hat:null,body:null,
 back:[['back',.4,.5,.2,0,-.05,.28,'#3d8bff'],['back',.3,.12,.22,0,.12,.28,'#ffc83d']],
 trail:null,killfx:null},
{id:'khung_long_bong',name:'Khủng long bông',rarity:'common',icon:'🦖',
 hat:[['head',.52,.18,.52,0,.5,0,'#46c26b'],['head',.1,.1,.06,-.13,.52,-.27,'#ffffff'],['head',.1,.1,.06,.13,.52,-.27,'#ffffff'],
      ['head',.1,.14,.1,0,.68,0,'#2e9a52'],['head',.1,.12,.1,0,.68,.14,'#2e9a52'],['head',.1,.12,.1,0,.66,-.14,'#2e9a52']],
 body:[['torso',.62,.72,.36,0,0,0,'#46c26b'],['torso',.4,.5,.02,0,-.02,-.19,'#bff2c9'],['armL',.22,.6,.24,0,-.29,0,'#46c26b'],['armR',.22,.6,.24,0,-.29,0,'#46c26b']],
 back:[['back',.2,.2,.5,0,-.3,.4,'#46c26b'],['back',.14,.14,.3,0,-.3,.75,'#2e9a52'],['back',.12,.12,.12,0,.2,.2,'#2e9a52'],['back',.12,.12,.12,0,.0,.2,'#2e9a52']],
 trail:{color:'#8be3a0',shape:'box',size:.14},killfx:{colors:['#46c26b','#bff2c9'],kind:'burst'}},
{id:'dau_bep_nhi',name:'Đầu bếp nhí',rarity:'common',icon:'👨‍🍳',
 hat:[['head',.42,.34,.42,0,.72,0,'#ffffff'],['head',.58,.2,.58,0,.96,0,'#ffffff']],
 body:[['torso',.62,.72,.36,0,0,0,'#f4f4f4'],['torso',.64,.12,.38,0,.3,0,'#e5484d'],['armL',.22,.4,.24,0,-.2,0,'#f4f4f4'],['armR',.22,.4,.24,0,-.2,0,'#f4f4f4']],
 back:[['back',.06,.7,.06,.2,0,.25,'#c9a26a'],['back',.14,.14,.06,.2,.4,.25,'#c9a26a']],
 trail:{color:'#ffe9b0',shape:'box',size:.12},killfx:{colors:['#fff3c4','#e5484d'],kind:'burst'}},
{id:'phi_hanh_gia',name:'Phi hành gia',rarity:'common',icon:'🧑‍🚀',
 hat:[['head',.56,.56,.56,0,.23,0,'#ffffff'],['head',.4,.3,.04,0,.26,-.3,'#2a5bd7']],
 body:[['torso',.62,.72,.36,0,0,0,'#f2f4f8'],['torso',.3,.2,.02,0,.1,-.19,'#ff8a3d'],['armL',.22,.6,.24,0,-.29,0,'#f2f4f8'],['armR',.22,.6,.24,0,-.29,0,'#f2f4f8']],
 back:[['back',.4,.55,.22,0,0,.3,'#c7cbd6'],['back',.18,.1,.1,0,.32,.3,'#ff8a3d']],
 trail:{color:'#bcd7ff',shape:'box',size:.12},killfx:{colors:['#bcd7ff','#ffffff'],kind:'burst'}},
/* ---------------- HIẾM ---------------- */
{id:'hiep_si_anh_sang',name:'Hiệp sĩ Ánh Sáng',rarity:'rare',icon:'🛡️',
 hat:[['head',.52,.5,.52,0,.25,0,'#c9d3e6'],['head',.36,.06,.04,0,.26,-.27,'#1b1f33'],['head',.08,.3,.3,0,.66,.05,'#ffc83d']],
 body:[['torso',.64,.74,.38,0,0,0,'#c9d3e6'],['torso',.66,.1,.4,0,-.28,0,'#ffc83d'],['torso',.16,.16,.02,0,.05,-.2,'#fff7c2'],['armL',.3,.14,.3,0,0,0,'#ffc83d'],['armR',.3,.14,.3,0,0,0,'#ffc83d']],
 back:[['back',.6,1,.05,0,-.15,.22,'#3d8bff']],
 trail:{color:'#ffe27a',shape:'star',size:.12},killfx:{colors:['#fff7c2','#ffc83d'],kind:'ring'}},
{id:'ninja_lang_la',name:'Ninja Làng Lá',rarity:'rare',icon:'🥷',
 hat:[['head',.52,.1,.52,0,.34,0,'#2f56d6'],['head',.2,.1,.04,0,.34,-.28,'#c9d3e6'],['head',.5,.1,.5,0,.5,0,'#2b2230']],
 body:[['torso',.62,.72,.36,0,0,0,'#ff8a3d'],['torso',.62,.16,.36,0,.28,0,'#1b1f33'],['armL',.22,.6,.24,0,-.29,0,'#ff8a3d'],['armR',.22,.6,.24,0,-.29,0,'#ff8a3d'],['legL',.28,.64,.3,0,-.31,0,'#2f56d6'],['legR',.28,.64,.3,0,-.31,0,'#2f56d6']],
 back:[['back',.5,.12,.12,0,.2,.28,'#d9c28a'],['back',.14,.14,.14,.28,.2,.28,'#c0392b']],
 trail:{color:'#5dbb63',shape:'leaf',size:.14},killfx:{colors:['#5dbb63','#e8e8e8'],kind:'burst'}},
{id:'donald_trump',name:'Donald Trump',rarity:'rare',icon:'💼',
 hat:[['head',.58,.14,.58,0,.5,0,'#f2c230'],['head',.5,.12,.3,0,.6,-.2,'#f2c230'],['head',.12,.3,.3,-.3,.34,.02,'#f2c230'],['head',.12,.3,.3,.3,.34,.02,'#f2c230']],
 body:[['torso',.64,.74,.38,0,0,0,'#1d3a8a'],['torso',.2,.5,.02,0,.05,-.2,'#ffffff'],['torso',.1,.62,.02,0,-.02,-.21,'#d62839'],['armL',.22,.6,.24,0,-.29,0,'#1d3a8a'],['armR',.22,.6,.24,0,-.29,0,'#1d3a8a'],['legL',.28,.62,.3,0,-.31,0,'#1d3a8a'],['legR',.28,.62,.3,0,-.31,0,'#1d3a8a']],
 back:null,
 trail:{color:'#ffffff',shape:'star',size:.12},killfx:{colors:['#d62839','#ffffff','#1d3a8a'],kind:'burst'}},
{id:'chu_tich_kim',name:'Chủ tịch Kim',rarity:'rare',icon:'🎖️',
 hat:[['head',.52,.16,.52,0,.5,0,'#14141c'],['head',.04,.2,.4,-.25,.3,0,'#14141c'],['head',.04,.2,.4,.25,.3,0,'#14141c']],
 body:[['torso',.64,.74,.38,0,0,0,'#3b3f4a'],['torso',.3,.1,.4,0,.34,0,'#2a2d36'],['torso',.06,.5,.02,0,0,-.2,'#c9c9c9'],['armL',.22,.6,.24,0,-.29,0,'#3b3f4a'],['armR',.22,.6,.24,0,-.29,0,'#3b3f4a'],['legL',.28,.62,.3,0,-.31,0,'#3b3f4a'],['legR',.28,.62,.3,0,-.31,0,'#3b3f4a']],
 back:null,
 trail:{color:'#8a8f9c',shape:'box',size:.12},killfx:{colors:['#8a8f9c','#ffffff'],kind:'burst'}},
/* ---------------- SỬ THI ---------------- */
{id:'nguoi_nhen',name:'Người Nhện',rarity:'epic',icon:'🕷️',
 hat:[['head',.5,.5,.5,0,.25,0,'#d62839'],['head',.14,.12,.04,-.11,.28,-.26,'#ffffff'],['head',.14,.12,.04,.11,.28,-.26,'#ffffff'],['head',.5,.02,.5,0,.36,0,'#7a0f1a']],
 body:[['torso',.64,.74,.38,0,0,0,'#d62839'],['torso',.16,.74,.4,-.26,0,0,'#2f56d6'],['torso',.16,.74,.4,.26,0,0,'#2f56d6'],['torso',.5,.03,.02,0,.1,-.2,'#1b1f33'],['torso',.03,.5,.02,0,0,-.2,'#1b1f33'],
       ['armL',.22,.6,.24,0,-.29,0,'#d62839'],['armR',.22,.6,.24,0,-.29,0,'#d62839'],['legL',.28,.64,.3,0,-.31,0,'#2f56d6'],['legR',.28,.64,.3,0,-.31,0,'#2f56d6']],
 back:null,
 trail:{color:'#f1f1f1',shape:'line',size:.1},killfx:{colors:['#ffffff','#d62839'],kind:'ring'}},
{id:'hai_tac_mu_rom',name:'Vua Hải Tặc Luffy',rarity:'epic',icon:'🏴‍☠️',
 hat:[['head',.95,.05,.95,0,.5,0,'#f3d36b'],['head',.5,.2,.5,0,.62,0,'#f3d36b'],['head',.52,.06,.52,0,.54,0,'#d62839'],['head',.08,.02,.03,-.1,.14,-.235,'#7a2a2a']],
 body:[['torso',.64,.74,.38,0,0,0,'#d62839'],['torso',.2,.5,.02,0,.05,-.2,'#f5d06b'],['legL',.3,.3,.32,0,-.15,0,'#2f56d6'],['legR',.3,.3,.32,0,-.15,0,'#2f56d6']],
 back:null,
 trail:{color:'#f3d36b',shape:'box',size:.14},killfx:{colors:['#f3d36b','#d62839'],kind:'ring'}},
{id:'ro_bot_neon',name:'Rô-bốt Neon',rarity:'epic',icon:'🤖',
 hat:[['head',.52,.52,.52,0,.25,0,'#4a5063'],['head',.4,.1,.04,0,.28,-.27,'#00e5ff'],['head',.04,.3,.04,0,.7,0,'#8a93b8'],['head',.1,.1,.1,0,.88,0,'#00e5ff']],
 body:[['torso',.64,.74,.38,0,0,0,'#2a2f45'],['torso',.5,.03,.02,0,.15,-.2,'#00e5ff'],['torso',.5,.03,.02,0,-.05,-.2,'#00e5ff'],['torso',.03,.6,.02,0,0,-.2,'#00e5ff'],['armL',.22,.6,.24,0,-.29,0,'#2a2f45'],['armR',.22,.6,.24,0,-.29,0,'#2a2f45']],
 back:[['back',.06,.7,.5,-.5,.1,.25,'#00e5ff'],['back',.06,.7,.5,.5,.1,.25,'#00e5ff']],
 trail:{color:'#00e5ff',shape:'line',size:.1},killfx:{colors:['#00e5ff','#ff6bd6'],kind:'bolt'}},
{id:'samurai_anh_dao',name:'Samurai Anh Đào',rarity:'epic',icon:'🌸',
 hat:[['head',.54,.3,.54,0,.4,0,'#c0392b'],['head',.04,.3,.04,-.2,.7,-.08,'#ffc83d'],['head',.04,.3,.04,.2,.7,-.08,'#ffc83d'],['head',.5,.04,.04,0,.6,-.1,'#ffc83d']],
 body:[['torso',.64,.74,.38,0,0,0,'#c0392b'],['torso',.62,.1,.4,0,.1,0,'#1b1f33'],['torso',.62,.1,.4,0,-.1,0,'#1b1f33'],['armL',.3,.16,.3,0,0,0,'#1b1f33'],['armR',.3,.16,.3,0,0,0,'#1b1f33']],
 back:[['back',.04,1,.04,.15,.3,.25,'#6b4a2f'],['back',.4,.6,.03,.3,.5,.25,'#ff9ecf']],
 trail:{color:'#ff9ecf',shape:'leaf',size:.14},killfx:{colors:['#ff9ecf','#ffffff'],kind:'rain'}},
{id:'phu_thuy_sao_bang',name:'Phù thủy Sao Băng',rarity:'epic',icon:'🧙',
 hat:[['head',.7,.05,.7,0,.5,0,'#6a3dd6'],['head',.44,.25,.44,0,.65,0,'#6a3dd6'],['head',.3,.25,.3,0,.88,0,'#6a3dd6'],['head',.16,.2,.16,0,1.04,0,'#6a3dd6'],['head',.12,.12,.04,0,.72,-.24,'#ffd34d']],
 body:[['torso',.66,.8,.4,0,0,0,'#6a3dd6'],['torso',.8,.3,.5,0,-.4,0,'#4b2aa0'],['torso',.08,.08,.02,-.15,.1,-.21,'#ffd34d'],['torso',.08,.08,.02,.15,-.05,-.21,'#ffd34d'],['armL',.22,.6,.24,0,-.29,0,'#6a3dd6'],['armR',.22,.6,.24,0,-.29,0,'#6a3dd6']],
 back:[['back',.5,.9,.05,0,-.1,.22,'#4b2aa0']],
 trail:{color:'#ffd34d',shape:'star',size:.12},killfx:{colors:['#ffd34d','#b9a3ff'],kind:'rain'}},
/* ---------------- HUYỀN THOẠI ---------------- */
{id:'nguoi_sat',name:'Người Sắt',rarity:'legendary',icon:'🤖',
 hat:[['head',.54,.54,.54,0,.25,0,'#c1121f'],['head',.4,.36,.04,0,.24,-.29,'#f2b632'],['head',.12,.04,.02,-.09,.3,-.31,'#ffffff'],['head',.12,.04,.02,.09,.3,-.31,'#ffffff']],
 body:[['torso',.66,.76,.4,0,0,0,'#c1121f'],['torso',.5,.2,.02,0,-.2,-.21,'#f2b632'],['torso',.16,.16,.03,0,.1,-.22,'#7df9ff'],['armL',.24,.6,.26,0,-.29,0,'#c1121f'],['armR',.24,.6,.26,0,-.29,0,'#c1121f'],['armL',.24,.2,.26,0,-.62,0,'#f2b632'],['armR',.24,.2,.26,0,-.62,0,'#f2b632'],['legL',.3,.64,.32,0,-.31,0,'#c1121f'],['legR',.3,.64,.32,0,-.31,0,'#c1121f']],
 back:[['back',.14,.2,.1,-.15,-.1,.25,'#f2b632'],['back',.14,.2,.1,.15,-.1,.25,'#f2b632']],
 trail:{color:'#7df9ff',shape:'box',size:.16},killfx:{colors:['#f2b632','#c1121f','#7df9ff'],kind:'ring'}},
{id:'than_sam',name:'Thần Sấm',rarity:'legendary',icon:'⚡',
 hat:[['head',.54,.14,.54,0,.5,0,'#f2d36b'],['head',.1,.55,.1,-.27,-.05,.1,'#f2d36b'],['head',.1,.55,.1,.27,-.05,.1,'#f2d36b']],
 body:[['torso',.66,.76,.4,0,0,0,'#9aa3b5'],['torso',.14,.14,.02,-.14,.15,-.21,'#f2d36b'],['torso',.14,.14,.02,.14,.15,-.21,'#f2d36b'],['armL',.24,.2,.26,0,-.55,0,'#9aa3b5'],['armR',.24,.2,.26,0,-.55,0,'#9aa3b5'],
       ['armL',.12,.3,.12,0,-.8,0,'#6b4a2f'],['armL',.34,.2,.2,0,-.98,0,'#8a93b8']],
 back:[['back',.64,1.1,.05,0,-.2,.22,'#c1121f']],
 trail:{color:'#bfe3ff',shape:'line',size:.1},killfx:{colors:['#bfe3ff','#ffffff','#3d8bff'],kind:'bolt'}},
{id:'sieu_xayda',name:'Siêu Xayda',rarity:'legendary',icon:'🔥',
 hat:[['head',.52,.14,.52,0,.5,0,'#ffd34d'],['head',.16,.4,.16,0,.78,0,'#ffd34d'],['head',.14,.34,.14,-.2,.7,0,'#ffd34d'],['head',.14,.34,.14,.2,.7,0,'#ffd34d'],['head',.12,.3,.12,-.1,.7,-.18,'#ffd34d'],['head',.12,.3,.12,.1,.7,-.18,'#ffd34d']],
 body:[['torso',.64,.74,.38,0,0,0,'#ff8a3d'],['torso',.3,.1,.4,0,.34,0,'#2f56d6'],['torso',.66,.1,.4,0,-.3,0,'#2f56d6'],['armL',.22,.5,.24,0,-.25,0,'#2f56d6'],['armR',.22,.5,.24,0,-.25,0,'#2f56d6'],['legL',.28,.62,.3,0,-.31,0,'#ff8a3d'],['legR',.28,.62,.3,0,-.31,0,'#ff8a3d']],
 back:[['back',.9,1.2,.04,0,.1,.3,'#ffd34d']],
 trail:{color:'#ffd34d',shape:'box',size:.16},killfx:{colors:['#ffd34d','#fff3b0','#ff8a3d'],kind:'burst'}}
]};
