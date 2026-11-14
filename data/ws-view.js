/* =====================================================================
   WORD STRIKE 3D – THAM SỐ GÓC NHÌN THỨ 3 (cho thầy/cô chỉnh, không cần sửa code)
   Phím C (hoặc nút 👁 trên điện thoại) đổi góc nhìn thứ nhất ↔ thứ ba.
   Mỗi số phải nằm trong khoảng cho phép; sai thì game dùng giá trị mặc định và ghi cảnh báo ở Console.
     distance : camera cách lưng nhân vật bao nhiêu mét        (mặc định 3.2 ; khoảng 2.2 – 4.5)
     shoulder : lệch sang vai phải (mét)                       (mặc định 0.6 ; khoảng 0 – 1)
                → số lớn thì nhìn lệch ra sau góc tường nhiều hơn, nên giữ nhỏ
     height   : cao hơn đầu nhân vật (mét)                      (mặc định 0.3 ; khoảng 0 – 0.8)
     blend    : thời gian chuyển mượt giữa hai góc nhìn (giây)  (mặc định 0.15 ; khoảng 0.05 – 0.4)
     minDist  : gần hơn mức này thì nhân vật ẩn hẳn (mét)       (mặc định 0.8 ; khoảng 0.5 – 1.5)
     fadeDist : gần hơn mức này thì nhân vật mờ dần (mét)       (mặc định 1.2 ; khoảng 0.8 – 2) — phải lớn hơn minDist
     recoil   : thời gian tay giật khi bắn (giây)               (mặc định 0.1 ; khoảng 0.05 – 0.2)
   ===================================================================== */
window.WS_VIEW={distance:3.2,shoulder:.6,height:.3,blend:.15,minDist:.8,fadeDist:1.2,recoil:.1};
