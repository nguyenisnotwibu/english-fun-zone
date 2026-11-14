/* =====================================================================
   WORD STRIKE 3D – THAM SỐ VÒNG QUAY BIG CHANCE (cho thầy/cô chỉnh, không cần sửa code)
   100% miễn phí: chỉ dùng Xu kiếm được khi chơi, không có tiền thật. Tỉ lệ được công bố ngay trong game.
   Sai dữ liệu (tỉ lệ không cộng thành 1, giá âm...) thì game dùng mặc định bên dưới và ghi cảnh báo – KHÔNG bao giờ quay với tỉ lệ sai.
     price           : giá 1 lượt (xu)                         (mặc định 150 ; khoảng 50 – 500)
     comboCount      : số lượt trong gói combo                 (mặc định 10  ; khoảng 5 – 10)
     comboDiscount   : giảm giá combo                          (mặc định 0.10; khoảng 0 – 0.3)
     dailyCap        : tối đa lượt TRẢ XU mỗi ngày             (mặc định 20  ; khoảng 5 – 50)
     rates           : tỉ lệ cơ bản, PHẢI cộng đúng 1          (60 / 28 / 10 / 2 %)
     pityAt          : lượt thứ N chắc chắn Huyền thoại        (mặc định 30  ; khoảng 10 – 100)
     refundRate      : hoàn lại bao nhiêu % giá khi trùng đồ   (mặc định 0.40; khoảng 0 – 0.6, phải < 1)
     refundFreeSpin  : lượt miễn phí trùng đồ có hoàn xu không (mặc định true)
     freeSpinPerDay  : số lượt miễn phí mỗi ngày               (mặc định 1   ; khoảng 0 – 3)
     restNudgeAfter  : sau bao nhiêu lượt trong ngày thì nhắc nghỉ (mặc định 10; khoảng 5 – 20)
     freeQuestionMinReadSec : giây tối thiểu đọc lời giải khi trả lời sai (mặc định 3; khoảng 1 – 10)
     directMultiplier: mua thẳng đắt hơn kỳ vọng quay ít nhất bao nhiêu lần (mặc định 1.5; chỉ dùng để kiểm tra giá ở tools/check-data.js)
   ===================================================================== */
window.WS_GACHA={price:150,comboCount:10,comboDiscount:.10,dailyCap:20,
  rates:{common:.60,rare:.28,epic:.10,legendary:.02},
  pityAt:30,refundRate:.40,refundFreeSpin:true,freeSpinPerDay:1,restNudgeAfter:10,freeQuestionMinReadSec:3,directMultiplier:1.5};
