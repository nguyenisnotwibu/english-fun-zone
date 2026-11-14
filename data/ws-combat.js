/* =====================================================================
   WORD STRIKE 3D – QUÁI + BĂNG ĐẠN + NẠP NHANH (Giai đoạn 3 của "Saltline Ops") – thầy/cô chỉnh ở đây
   Sai dữ liệu → game dùng giá trị mặc định trong code và ghi cảnh báo (#dataWarn). Kiểm tra: node tools/check-data.js
   kinds    : 3 loại quái mới. s = cỡ · hp = máu · spd = tốc độ · dmg = sát thương · armor = có giáp
     gull   : drone BAY mang TỪ VỰNG. Giữ khoảng cách, ngắm bằng tia đỏ rồi bắn (tele giây báo trước, shotEvery = [nhanh, chậm] giây).
     hound  : quái CHẠY mang NGỮ PHÁP. Tới gần thì báo trước (vạch đỏ) rồi lao thẳng (lungeSpeed m/s trong lungeTime giây).
     heavy  : quái NẶNG mang CÂU KHÓ. Giáp, chậm; dậm đất báo trước slamTele giây, bán kính slamRange — NHẢY là tránh được.
   carrier  : quái nào mang đáp án cho dạng bài nào (trọng số). Chỉ dùng ở chế độ HOLDOUT.
   hostile  : trọng số loại quái của chế độ MISSION (nền + báo động + rút lui).
   mag      : [Blaster, Scatter, Railgun, Nova] số phát mỗi băng · reload = giây nạp CHẬM (bình thường)
   quick    : nạp NHANH bằng câu hỏi — sec = thời gian trả lời tối đa (không quá thời gian nạp chậm) · choices = số lựa chọn · types = dạng câu
              đúng → nạp đầy NGAY + cả băng đó là đạn XUYÊN GIÁP (bỏ qua giáp) · sai/bỏ qua → nạp chậm bình thường (sai vào Sổ tay lỗi sai, không trừ máu)
   ===================================================================== */
window.WS_COMBAT={version:1,
kinds:{
  gull:{s:.85,hp:1,spd:1,dmg:9,hover:3.2,bob:.45,keep:11,range:32,shotEvery:[3,4.2],tele:.9,bullet:13},
  hound:{s:.82,hp:1,spd:1.55,dmg:11,lungeRange:8.5,tele:1,lungeSpeed:15,lungeTime:.5,lungeCd:3.2},
  heavy:{s:1.28,hp:2,spd:.62,dmg:20,armor:true,slamRange:4.5,tele:1.3,slamCd:5}
},
carrier:{
  gap:{hound:.75,grunt:.25},error:{hound:.6,shooter:.4},order:{hound:.7,grunt:.3},
  vocab:{gull:.75,grunt:.25},spell:{gull:.75,grunt:.25},hard:{heavy:1}
},
hostile:{gull:.3,hound:.4,heavy:.15,grunt:.15},
mag:[30,8,3,2],reload:[3.2,3.6,4,4.5],
quick:{sec:5,choices:3,types:['vocab','spell']}
};
