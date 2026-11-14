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
   Lưu ý: TẤT CẢ bộ đồ là nhân vật TỰ SÁNG TÁC – không mô phỏng người thật hay nhân vật có bản quyền. Thêm bộ mới cũng giữ nguyên tắc này.
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
{id:'ninja_lang_la',name:'Ninja Bóng Đêm',rarity:'rare',icon:'🥷',
 hat:[['head',.52,.52,.52,0,.25,0,'#1b1f33'],['head',.44,.1,.04,0,.3,-.27,'#f5d06b'],['head',.08,.04,.02,-.1,.31,-.29,'#111111'],['head',.08,.04,.02,.1,.31,-.29,'#111111'],['head',.54,.08,.54,0,.4,0,'#7c5cff']],
 body:[['torso',.62,.72,.36,0,0,0,'#22263a'],['torso',.64,.1,.38,0,-.26,0,'#7c5cff'],['torso',.56,.14,.4,0,.32,0,'#d62839'],['armL',.22,.6,.24,0,-.29,0,'#22263a'],['armR',.22,.6,.24,0,-.29,0,'#22263a'],['legL',.28,.64,.3,0,-.31,0,'#1b1f33'],['legR',.28,.64,.3,0,-.31,0,'#1b1f33']],
 back:[['back',.16,.7,.04,.14,-.05,.24,'#d62839'],['back',.14,.5,.04,-.06,-.15,.27,'#d62839'],['back',.06,.8,.06,-.18,.05,.24,'#8a93b8']],
 trail:{color:'#b39dff',shape:'leaf',size:.14},killfx:{colors:['#7c5cff','#d62839'],kind:'burst'}},
{id:'donald_trump',name:'Doanh nhân Kim Cương',rarity:'rare',icon:'💼',
 hat:[['head',.5,.14,.5,0,.5,0,'#9aa3b5'],['head',.12,.12,.04,-.1,.28,-.25,'#d9f7ff'],['head',.12,.12,.04,.1,.28,-.25,'#d9f7ff'],['head',.28,.03,.03,0,.29,-.27,'#4a5063']],
 body:[['torso',.64,.74,.38,0,0,0,'#4a5063'],['torso',.2,.5,.02,0,.05,-.2,'#f2f4f8'],['torso',.08,.5,.02,0,-.02,-.21,'#00b8a9'],['torso',.1,.08,.03,-.2,.18,-.21,'#7df9ff'],['armL',.22,.6,.24,0,-.29,0,'#4a5063'],['armR',.22,.6,.24,0,-.29,0,'#4a5063'],['legL',.28,.62,.3,0,-.31,0,'#3b3f4a'],['legR',.28,.62,.3,0,-.31,0,'#3b3f4a']],
 back:[['back',.46,.34,.14,0,-.1,.27,'#6b4a2f'],['back',.16,.06,.06,0,.1,.27,'#f2b632']],
 trail:{color:'#7df9ff',shape:'star',size:.12},killfx:{colors:['#7df9ff','#ffffff','#00b8a9'],kind:'burst'}},
{id:'chu_tich_kim',name:'Thuyền trưởng Bão Tố',rarity:'rare',icon:'⚓',
 hat:[['head',.56,.16,.56,0,.52,0,'#1d2b5a'],['head',.6,.04,.62,0,.46,-.03,'#111827'],['head',.58,.05,.58,0,.6,0,'#f2b632'],['head',.12,.12,.03,0,.54,-.29,'#f2b632']],
 body:[['torso',.64,.76,.4,0,0,0,'#f2f4f8'],['torso',.08,.6,.02,-.1,0,-.21,'#f2b632'],['torso',.08,.6,.02,.1,0,-.21,'#f2b632'],['armL',.24,.2,.26,0,0,0,'#f2b632'],['armR',.24,.2,.26,0,0,0,'#f2b632'],['armL',.22,.6,.24,0,-.29,0,'#f2f4f8'],['armR',.22,.6,.24,0,-.29,0,'#f2f4f8'],['legL',.28,.62,.3,0,-.31,0,'#1d2b5a'],['legR',.28,.62,.3,0,-.31,0,'#1d2b5a']],
 back:[['back',.62,.9,.04,0,-.15,.22,'#1d2b5a']],
 trail:{color:'#7ec8ff',shape:'line',size:.1},killfx:{colors:['#7ec8ff','#ffffff'],kind:'rain'}},
/* ---------------- SỬ THI ---------------- */
{id:'nguoi_nhen',name:'Bóng Ma Tơ Neon',rarity:'epic',icon:'🕸️',
 hat:[['head',.54,.54,.54,0,.25,0,'#14161f'],['head',.4,.12,.04,0,.28,-.28,'#39ff88'],['head',.58,.2,.58,0,.5,.03,'#14161f'],['head',.04,.5,.04,0,.3,-.29,'#39ff88']],
 body:[['torso',.64,.74,.38,0,0,0,'#14161f'],['torso',.04,.7,.02,-.16,0,-.2,'#39ff88'],['torso',.04,.7,.02,.16,0,-.2,'#39ff88'],['torso',.5,.04,.02,0,.15,-.2,'#39ff88'],
       ['armL',.22,.6,.24,0,-.29,0,'#14161f'],['armR',.22,.6,.24,0,-.29,0,'#14161f'],['armL',.24,.06,.26,0,-.5,0,'#39ff88'],['armR',.24,.06,.26,0,-.5,0,'#39ff88'],['legL',.28,.64,.3,0,-.31,0,'#14161f'],['legR',.28,.64,.3,0,-.31,0,'#14161f']],
 back:[['back',.5,.5,.04,0,.05,.22,'#1e2333'],['back',.5,.03,.05,0,.05,.24,'#39ff88'],['back',.03,.5,.05,0,.05,.24,'#39ff88']],
 trail:{color:'#39ff88',shape:'line',size:.1},killfx:{colors:['#39ff88','#ffffff'],kind:'ring'}},
{id:'hai_tac_mu_rom',name:'Cướp biển Mỏ Neo',rarity:'epic',icon:'🏴‍☠️',
 hat:[['head',.66,.1,.6,0,.5,0,'#1b1f33'],['head',.46,.22,.42,0,.64,0,'#1b1f33'],['head',.66,.04,.04,0,.55,-.3,'#f2b632'],['head',.16,.12,.03,.1,.28,-.25,'#111111'],['head',.36,.02,.02,0,.34,-.25,'#111111']],
 body:[['torso',.64,.76,.4,0,0,0,'#2e7d5b'],['torso',.24,.6,.02,0,0,-.21,'#f2f4f8'],['torso',.66,.1,.42,0,-.25,0,'#6b4a2f'],['torso',.12,.1,.03,0,-.25,-.23,'#f2b632'],['armL',.22,.6,.24,0,-.29,0,'#2e7d5b'],['armR',.22,.6,.24,0,-.29,0,'#2e7d5b'],['legL',.28,.64,.3,0,-.31,0,'#3b2f2a'],['legR',.28,.64,.3,0,-.31,0,'#3b2f2a']],
 back:[['back',.06,.7,.06,0,0,.26,'#8a93b8'],['back',.4,.06,.06,0,-.32,.26,'#8a93b8'],['back',.06,.14,.06,-.18,-.26,.26,'#8a93b8'],['back',.06,.14,.06,.18,-.26,.26,'#8a93b8']],
 trail:{color:'#f2b632',shape:'box',size:.14},killfx:{colors:['#f2b632','#2e7d5b'],kind:'ring'}},
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
{id:'nguoi_sat',name:'Giáp Titan X',rarity:'legendary',icon:'🦾',
 hat:[['head',.56,.56,.56,0,.25,0,'#b8c2d6'],['head',.46,.12,.04,0,.3,-.29,'#ff8a3d'],['head',.06,.2,.3,-.3,.3,0,'#00b8a9'],['head',.06,.2,.3,.3,.3,0,'#00b8a9'],['head',.2,.06,.4,0,.56,0,'#00b8a9']],
 body:[['torso',.68,.78,.42,0,0,0,'#b8c2d6'],['torso',.5,.24,.02,0,.12,-.22,'#5d6a8a'],['torso',.18,.18,.03,0,.12,-.23,'#ff8a3d'],['torso',.7,.08,.44,0,-.3,0,'#00b8a9'],
       ['armL',.26,.6,.28,0,-.29,0,'#b8c2d6'],['armR',.26,.6,.28,0,-.29,0,'#b8c2d6'],['armL',.36,.16,.34,0,0,0,'#5d6a8a'],['armR',.36,.16,.34,0,0,0,'#5d6a8a'],['legL',.3,.64,.32,0,-.31,0,'#b8c2d6'],['legR',.3,.64,.32,0,-.31,0,'#b8c2d6']],
 back:[['back',.5,.5,.16,0,.05,.3,'#5d6a8a'],['back',.12,.24,.12,-.16,-.28,.32,'#ff8a3d'],['back',.12,.24,.12,.16,-.28,.32,'#ff8a3d']],
 trail:{color:'#ff8a3d',shape:'box',size:.16},killfx:{colors:['#ff8a3d','#b8c2d6','#00b8a9'],kind:'ring'}},
{id:'than_sam',name:'Chiến binh Bão Điện',rarity:'legendary',icon:'⚡',
 hat:[['head',.54,.12,.54,0,.5,0,'#1d2b5a'],['head',.08,.36,.08,-.2,.66,-.05,'#7df9ff'],['head',.08,.36,.08,.2,.66,-.05,'#7df9ff'],['head',.36,.08,.04,0,.3,-.27,'#7df9ff']],
 body:[['torso',.66,.76,.4,0,0,0,'#1d2b5a'],['torso',.06,.6,.02,0,0,-.21,'#7df9ff'],['torso',.4,.06,.02,0,.2,-.21,'#7df9ff'],['armL',.3,.18,.3,0,0,0,'#3d8bff'],['armR',.3,.18,.3,0,0,0,'#3d8bff'],['armL',.22,.6,.24,0,-.29,0,'#1d2b5a'],['armR',.22,.6,.24,0,-.29,0,'#1d2b5a'],
       ['armL',.08,1.1,.08,0,-.7,0,'#8a93b8'],['armL',.2,.2,.2,0,-1.25,0,'#7df9ff'],['legL',.28,.64,.3,0,-.31,0,'#1d2b5a'],['legR',.28,.64,.3,0,-.31,0,'#1d2b5a']],
 back:[['back',.64,1.1,.05,0,-.2,.22,'#5a2bd6'],['back',.04,.9,.06,0,-.2,.25,'#7df9ff']],
 trail:{color:'#7df9ff',shape:'line',size:.1},killfx:{colors:['#7df9ff','#ffffff','#5a2bd6'],kind:'bolt'}},
{id:'sieu_xayda',name:'Rồng Lửa Thức Tỉnh',rarity:'legendary',icon:'🐉',
 hat:[['head',.56,.56,.56,0,.25,0,'#b3261e'],['head',.44,.1,.04,0,.32,-.29,'#ffd34d'],['head',.08,.34,.08,-.2,.6,.05,'#2b2230'],['head',.08,.34,.08,.2,.6,.05,'#2b2230'],['head',.3,.14,.2,0,.12,-.32,'#b3261e']],
 body:[['torso',.66,.76,.4,0,0,0,'#2b2230'],['torso',.5,.5,.02,0,0,-.21,'#b3261e'],['torso',.3,.06,.03,0,.12,-.23,'#ffd34d'],['torso',.3,.06,.03,0,-.04,-.23,'#ffd34d'],['armL',.3,.16,.3,0,0,0,'#b3261e'],['armR',.3,.16,.3,0,0,0,'#b3261e'],['armL',.22,.6,.24,0,-.29,0,'#2b2230'],['armR',.22,.6,.24,0,-.29,0,'#2b2230'],['legL',.28,.64,.3,0,-.31,0,'#2b2230'],['legR',.28,.64,.3,0,-.31,0,'#2b2230']],
 back:[['back',.5,.8,.04,-.4,.2,.3,'#b3261e'],['back',.5,.8,.04,.4,.2,.3,'#b3261e'],['back',.3,.5,.04,-.75,.4,.32,'#ff8a3d'],['back',.3,.5,.04,.75,.4,.32,'#ff8a3d'],['back',.16,.5,.16,0,-.5,.35,'#b3261e']],
 trail:{color:'#ff8a3d',shape:'box',size:.16},killfx:{colors:['#ff8a3d','#ffd34d','#b3261e'],kind:'burst'}}
]};
