/* =====================================================================
   WORD STRIKE 3D – 6 KHU CẢNG CONTAINER (Giai đoạn 4 của "Saltline Ops") – thầy/cô chỉnh ở đây, không cần sửa code
   Sai dữ liệu → game dùng giá trị mặc định (chủ đề cũ) và ghi cảnh báo (#dataWarn). Kiểm tra: node tools/check-data.js
   Mỗi khu (zones[i], i = 0..5 theo thứ tự ải):
     name / sub / vi : tên khu (hiện ở thẻ địa điểm, menu, Sổ tay) — name ≤ 18 ký tự
     th              : màu (floor/stud mặt sàn, sky 4 màu trời, fog sương mù, wall tường, trim viền sáng, pal 5 màu container)
     fog             : [gần, xa] mét của sương mù (nhỏ = dày). Đồ hoạ Thấp vẫn giữ sương nhưng bỏ đồ trang trí nặng.
     stacks          : container xếp chồng làm chỗ nấp: count số chồng · lv=[thấp,cao] số tầng (1 tầng cao 2,6 m) · long = số container nối dài (1–2)
                       minR/maxR = khoảng cách tới tâm (m; tâm 8 m đầu luôn trống để người chơi xuất phát) · gap = khe tối thiểu giữa 2 chồng
     lamps           : đèn đêm dọc tường (khoảng cách giữa 2 đèn, màu đèn) – chỉ mức Cao
     gantry          : khung cần cẩu trên cao (true/false) – chỉ mức Cao
     extra           : cảnh nền xa: 'ship' tàu hàng · 'lighthouse' ngọn hải đăng + chùm sáng quét · 'water' mặt nước tối · null
   Ghi chú: container là hộp cao 2,6 m, dài 6 m, rộng 2,4 m; chồng tối đa 3 tầng (7,8 m). Vật cản trùng đồ vật của bản đồ
   (sàn cao, dốc, trạm, băng chuyền…) được game tự gỡ.
   ===================================================================== */
window.WS_PORT={version:1,
zones:[
 {name:'Pier 4',sub:'CONTAINER YARD',vi:'Bến 4 · Bãi container',
  th:{floor:'#2b3440',stud:'#4a5868',sky:['#05070d','#0f1a2c','#2a3f5e','#ff9f43'],fog:0x0c1420,wall:0x1d2733,trim:0xffb347,pal:[0xc0392b,0x2c5f8a,0xd9a441,0x2f7d6d,0xe8e4da]},
  fog:[24,90],stacks:{count:12,lv:[1,3],long:[1,2],minR:10,maxR:25,gap:3},lamps:{every:14,color:0xffb347},gantry:false,extra:'water'},
 {name:'Container Yard',sub:'STACK ROW C',vi:'Bãi container · Dãy C',
  th:{floor:'#3a3a36',stud:'#5b5a52',sky:['#0a0c10','#1c2230','#47556b','#d98a4b'],fog:0x141821,wall:0x2a2e36,trim:0xffb347,pal:[0xb5472d,0xc0392b,0x2c5f8a,0xd9a441,0xe8e4da]},
  fog:[22,80],stacks:{count:14,lv:[1,3],long:[1,2],minR:10,maxR:26,gap:3},lamps:{every:12,color:0xffb347},gantry:false,extra:null},
 {name:'Crane Row',sub:'GANTRY LINE',vi:'Dãy cần cẩu · Tuyến giàn',
  th:{floor:'#31404f',stud:'#566a80',sky:['#0b1522','#1f3a58','#5d89b5','#cfe2f3'],fog:0x1a2b3d,wall:0x28384a,trim:0xffc977,pal:[0x3d6b9b,0xd9a441,0xe8e4da,0x8d9aa3,0xc0392b]},
  fog:[26,100],stacks:{count:12,lv:[1,2],long:[1,2],minR:10,maxR:25,gap:3},lamps:{every:14,color:0xffc977},gantry:true,extra:null},
 {name:'Cold Storage',sub:'FREEZER BLOCK',vi:'Kho lạnh · Khu đông lạnh',
  th:{floor:'#3d4f5c',stud:'#6a8596',sky:['#0a1620','#1c3b4f','#7fb2c9','#e3f3fa'],fog:0x2a4658,wall:0x34505f,trim:0xbff3ff,pal:[0xe8f3f8,0xa7d3e4,0x8d9aa3,0x4f8fa8,0xdfe8ee]},
  fog:[18,70],stacks:{count:12,lv:[1,2],long:[1,2],minR:10,maxR:25,gap:3},lamps:{every:13,color:0xbff3ff},gantry:false,extra:null},
 {name:'Cargo Ship',sub:'MAIN DECK',vi:'Tàu hàng · Boong chính',
  th:{floor:'#2c2a28',stud:'#4a4743',sky:['#04060a','#0e141f','#2b3a52','#ff6b4a'],fog:0x0d1118,wall:0x23262b,trim:0xff5a40,pal:[0xb5472d,0x2f7d6d,0x8d9aa3,0xd9a441,0x3d405b]},
  fog:[20,75],stacks:{count:14,lv:[1,3],long:[1,2],minR:10,maxR:26,gap:3},lamps:{every:12,color:0xff8a5c},gantry:false,extra:'ship'},
 {name:'Lighthouse',sub:'SIGNAL TOWER',vi:'Đèn hải đăng · Tháp tín hiệu',
  th:{floor:'#2e3340',stud:'#555d70',sky:['#06070f','#17163a','#4a3f7a','#ffcf6b'],fog:0x15132b,wall:0x242238,trim:0xffd27a,pal:[0xe8e4da,0xffcf6b,0x3d405b,0xc0392b,0x2c5f8a]},
  fog:[22,85],stacks:{count:12,lv:[1,2],long:[1,2],minR:11,maxR:25,gap:4},lamps:{every:14,color:0xffd27a},gantry:false,extra:'lighthouse'}
]};
