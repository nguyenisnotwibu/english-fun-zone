/* =====================================================================
   WORD STRIKE 3D — NGÂN HÀNG CÂU HỎI VÀ CÂN BẰNG
   Dành cho GIÁO VIÊN: chỉ cần sửa file này, không cần đụng vào game.

   CÁCH THÊM CÂU: mở đúng cấp độ (kids / toeic / ielts) và đúng dạng bài, chép một dòng
   mẫu rồi sửa nội dung. Mỗi câu là MỘT dòng, nằm trong dấu [ ], kết thúc bằng dấu phẩy.
   Chữ nằm trong "dấu nháy kép". Nếu câu có dấu nháy kép bên trong, viết \" (gạch chéo + nháy).

   LƯU Ý:
   • Mỗi dạng bài nên có ít nhất 8 câu để ít bị lặp.
   • Nếu file này lỗi (thiếu dấu phẩy, thiếu ngoặc...) game tự dùng BỘ CÂU DỰ PHÒNG nhỏ
     và hiện cảnh báo ở menu — bạn sửa lỗi rồi tải lại trang là xong.
   • Kiểm tra trước khi đăng web:  node tools/check-data.js
   ===================================================================== */
window.WS_DATA={
  version:1,

  /* ---- CÂN BẰNG (hằng số game, đổi ở đây, không cần sửa code) ---- */
  balance:{
    /* Máu bị trừ khi bắn nhầm đáp án. Dạng "Xếp câu" luôn dùng mức "order" (hay phải thử nhiều lần). */
    wrongDmg:{kids:5,toeic:8,ielts:10,order:4}
  },

  tracks:{

    /* ======== KIDS — Cambridge 4–6 · Family & Friends · A1–A2 ======== */
    kids:{

      /* ĐIỀN TỪ (Ải 1)  —  [câu có ___ , đáp án đúng, [3 đáp án nhiễu], giải thích bằng tiếng Việt]
         Ví dụ: ["She ___ to school every day.","goes",["go","going","went"],"Chủ ngữ số ít → goes."] */
      gap:[
        ["She ___ to school every day.","goes",["go","going","went"],"Chủ ngữ số ít (she) + hiện tại đơn → goes."],
        ["There ___ two cats under the table.","are",["is","am","be"],"“two cats” số nhiều → are."],
        ["I have ___ apple in my bag.","an",["a","two","many"],"apple bắt đầu bằng nguyên âm → an."],
        ["He is ___ than his brother.","taller",["tall","tallest","more tall"],"Có “than” → so sánh hơn: taller."],
        ["We ___ football yesterday.","played",["play","plays","playing"],"“yesterday” → quá khứ đơn."],
        ["Look! The baby ___ .","is sleeping",["sleeps","sleep","slept"],"“Look!” → đang xảy ra → hiện tại tiếp diễn."],
        ["My birthday is ___ May.","in",["on","at","to"],"Trước tháng dùng in."],
        ["Can you ___ a bike?","ride",["rides","riding","rode"],"Sau can là động từ nguyên mẫu."],
        ["This is ___ book.","my",["I","me","mine"],"Trước danh từ dùng tính từ sở hữu: my."],
        ["How ___ apples do you have?","many",["much","old","long"],"apples đếm được số nhiều → many."],
        ["I get up ___ 6 o'clock.","at",["in","on","for"],"Trước giờ cụ thể dùng at."],
        ["They ___ in the park now.","are playing",["play","plays","played"],"“now” → hiện tại tiếp diễn."],
        ["My sister ___ like spiders.","doesn't",["don't","isn't","aren't"],"Chủ ngữ số ít + V thường → doesn't."],
        ["Would you like ___ ice cream?","some",["any","many","a"],"Câu mời dùng some."],
        ["There isn't ___ milk.","any",["some","many","a"],"Câu phủ định → any."],
        ["She sings very ___ .","well",["good","nice","beautiful"],"Bổ nghĩa động từ → trạng từ well."],
        ["If it rains, I ___ stay at home.","will",["am","did","was"],"Điều kiện loại 1: will + V."],
        ["It is cold, ___ I wear a coat.","so",["but","because","or"],"so = vì vậy."],
        ["Tom is ___ boy in our class.","the tallest",["taller","tall","most tall"],"So sánh nhất: the + -est."],
        ["What ___ you do last weekend?","did",["do","does","are"],"Quá khứ → did."],
        ["Mary ___ a shower every morning.","takes",["take","taking","took"],"Chủ ngữ số ít + hiện tại đơn → takes."],
        ["Where ___ you yesterday?","were",["was","are","did"],"you + quá khứ của be → were."],
        ["I'm afraid ___ dogs.","of",["about","with","from"],"be afraid of."],
        ["There are ___ books on the shelf.","some",["any","much","a"],"Câu khẳng định, danh từ số nhiều → some."],
        ["Let's ___ to the zoo!","go",["goes","going","to go"],"Let's + V nguyên mẫu."],
        ["It's raining. Take ___ umbrella.","an",["a","two","some"],"umbrella bắt đầu bằng nguyên âm → an."],
        ["My dad is ___ engineer.","an",["a","one","any"],"engineer bắt đầu bằng nguyên âm → an."],
        ["___ is your teacher? – Mr. Brown.","Who",["What","Where","When"],"Hỏi người → Who."],
      ],

      /* NGHĨA TỪ (Ải 2)  —  [nghĩa tiếng Việt, từ tiếng Anh đúng, [3 từ nhiễu]]
         Ví dụ: ["thư viện","library",["kitchen","garden","hospital"]] */
      vocab:[
        ["thư viện","library",["kitchen","garden","hospital"]],
        ["con voi","elephant",["giraffe","monkey","tiger"]],
        ["bữa sáng","breakfast",["lunch","dinner","snack"]],
        ["cái ô","umbrella",["raincoat","boots","hat"]],
        ["con bướm","butterfly",["bee","spider","ladybird"]],
        ["thứ Tư","Wednesday",["Tuesday","Thursday","Monday"]],
        ["rau củ","vegetables",["fruit","meat","bread"]],
        ["bác sĩ","doctor",["nurse","teacher","farmer"]],
        ["bãi biển","beach",["mountain","river","forest"]],
        ["mùa đông","winter",["summer","spring","autumn"]],
        ["cầu vồng","rainbow",["cloud","thunder","snow"]],
        ["đói bụng","hungry",["thirsty","tired","sleepy"]],
        ["bàn chải đánh răng","toothbrush",["toothpaste","comb","towel"]],
        ["leo trèo","climb",["swim","jump","run"]],
      ],

      /* CHÍNH TẢ (Ải 3)  —  [từ viết ĐÚNG, [3 cách viết SAI]]
         Ví dụ: ["beautiful",["beatiful","beautifull","butiful"]] */
      spell:[
        ["beautiful",["beatiful","beautifull","butiful"]],
        ["friend",["freind","frend","friand"]],
        ["because",["becuase","becos","beacause"]],
        ["Wednesday",["Wensday","Wednesdey","Wendsday"]],
        ["February",["Febuary","Februery","Febrary"]],
        ["chocolate",["chocolat","choclate","chokolate"]],
        ["different",["diffrent","diferent","differant"]],
        ["library",["libary","liberary","librery"]],
        ["tomorrow",["tommorow","tomorow","tommorrow"]],
        ["family",["famliy","familly","femily"]],
        ["school",["shcool","scool","skool"]],
        ["favourite",["favourit","favorit","favrite"]],
      ],

      /* XẾP CÂU (Ải 4)  —  [[các từ theo ĐÚNG thứ tự], nghĩa tiếng Việt của câu]
         Ví dụ: [["I","like","to","play","football"],"Tôi thích chơi bóng đá."] */
      order:[
        [["I","like","to","play","football"],"Tôi thích chơi bóng đá."],
        [["She","is","my","best","friend"],"Cô ấy là bạn thân nhất của tôi."],
        [["We","go","to","school","by bus"],"Chúng tôi đi học bằng xe buýt."],
        [["The","cat","is","very","cute"],"Con mèo rất dễ thương."],
        [["What","time","is","it","now?"],"Bây giờ là mấy giờ?"],
        [["Can","you","ride","a","bike?"],"Bạn có biết đi xe đạp không?"],
        [["My","mum","is","a","doctor"],"Mẹ tôi là bác sĩ."],
        [["He","doesn't","like","milk"],"Cậu ấy không thích sữa."],
      ],

      /* TÌM LỖI SAI (Ải 5)  —  [[4 phần của câu], số thứ tự phần SAI (đếm từ 0), phần sửa lại, giải thích]
         Ví dụ: [["She","go","to school","every day"],1,"goes","Chủ ngữ she → goes."] */
      error:[
        [["She","go","to school","every day"],1,"goes","Chủ ngữ she → goes."],
        [["There","is","two","apples"],1,"are","two apples số nhiều → are."],
        [["I","have","a","apple"],2,"an","apple → an."],
        [["He","can","swims","very well"],2,"swim","can + V nguyên mẫu."],
        [["We","play","football","yesterday"],1,"played","yesterday → quá khứ."],
        [["My","birthday","is","on May"],3,"in May","Tháng → in."],
        [["They","is","in","the park"],1,"are","They → are."],
        [["This","is","mine","book"],2,"my","Trước danh từ → my."],
        [["How","much","apples","do you have?"],1,"many","apples đếm được → many."],
        [["She","don't","like","spiders"],1,"doesn't","She → doesn't."],
      ],

      /* CÂU KHÓ / CÂU VÀNG / THỬ THÁCH  —  cùng dạng với "gap": [câu có ___ , đáp án, [3 nhiễu], giải thích]
         Dùng cho câu vàng (x3 điểm) và thử thách 20 giây sau mỗi đợt. */
      hard:[
        ["I've lived here ___ 2020.","since",["for","from","at"],"Mốc thời gian + hiện tại hoàn thành → since."],
        ["She is very good ___ drawing.","at",["in","on","with"],"good at + V-ing."],
        ["There are ___ people in the park than yesterday.","more",["much","many","most"],"than → so sánh hơn của many là more."],
        ["He ___ TV when the phone rang.","was watching",["watched","watches","is watching"],"Hành động đang diễn ra thì bị xen ngang → quá khứ tiếp diễn."],
        ["The film was so ___ that I fell asleep.","boring",["bored","bore","bores"],"Tính từ -ing tả thứ gây ra cảm xúc."],
        ["I don't have ___ money left.","much",["many","a few","some"],"money không đếm được, câu phủ định → much."],
        ["Have you ever ___ to London?","been",["go","went","going"],"Have you ever been to…? = đã từng đến…"],
        ["This is the boy ___ won the race.","who",["which","where","what"],"Thay cho người → who."],
        ["We'll go out if it ___ rain.","doesn't",["won't","didn't","isn't"],"If + hiện tại đơn (không dùng will)."],
        ["My brother is ___ than me at maths.","better",["gooder","best","more good"],"good → better (bất quy tắc)."],
        ["Neither Tom ___ Anna likes fish.","nor",["or","and","but"],"neither … nor."],
        ["You ___ run in the corridor. It's dangerous!","mustn't",["don't have to","needn't","can"],"mustn't = cấm; don't have to = không cần."],
      ],

      /* VOICE BLAST  —  [từ tiếng Anh để đọc to, nghĩa tiếng Việt]
         Ví dụ: ["elephant","con voi"] */
      voice:[
        ["elephant","con voi"],
        ["beautiful","xinh đẹp"],
        ["library","thư viện"],
        ["birthday","sinh nhật"],
        ["vegetables","rau củ"],
        ["Wednesday","thứ Tư"],
        ["chocolate","sô-cô-la"],
        ["breakfast","bữa sáng"],
        ["crocodile","cá sấu"],
        ["umbrella","cái ô"],
        ["butterfly","con bướm"],
        ["computer","máy tính"],
      ]
    },

    /* ======== TOEIC — Part 5–6 · Công sở · 450–750+ ======== */
    toeic:{

      /* ĐIỀN TỪ (Ải 1)  —  [câu có ___ , đáp án đúng, [3 đáp án nhiễu], giải thích bằng tiếng Việt] */
      gap:[
        ["The report must be submitted ___ Friday.","by",["until","since","during"],"by + mốc = hạn chót."],
        ["Ms. Tran is responsible ___ training new staff.","for",["to","of","with"],"be responsible for."],
        ["All employees are required to ___ the guidelines.","follow",["following","followed","follows"],"be required to + V."],
        ["The meeting has been ___ until Monday.","postponed",["postpone","postponing","postpones"],"Bị động: has been + V3."],
        ["Please send the invoice ___ possible.","as soon as",["as long as","so that","even if"],"as soon as possible."],
        ["The new software is ___ easier to use.","much",["very","more","many"],"Nhấn mạnh so sánh hơn: much."],
        ["Applicants should have ___ experience.","extensive",["extend","extensively","extension"],"Trước danh từ cần tính từ."],
        ["___ the heavy rain, the event went ahead.","Despite",["Although","Because","However"],"Despite + cụm danh từ."],
        ["Please keep this document ___ .","confidential",["confide","confidence","confidentially"],"keep + O + tính từ."],
        ["Sales increased ___ 20 percent.","by",["at","on","with"],"Tăng một lượng → by."],
        ["Mr. Lee, ___ joined us in 2019, was promoted.","who",["which","whom","whose"],"Người, làm chủ ngữ → who."],
        ["The package will arrive ___ three days.","within",["among","between","along"],"within = trong vòng."],
        ["The conference room is ___ this afternoon.","available",["avail","availability","availably"],"Sau to be cần tính từ."],
        ["Neither the manager ___ the assistant was in.","nor",["or","and","but"],"neither … nor."],
        ["We look forward to ___ from you.","hearing",["hear","heard","be heard"],"look forward to + V-ing."],
        ["The proposal was ___ approved.","unanimously",["unanimous","unanimity","unanimousness"],"Bổ nghĩa động từ → trạng từ."],
        ["Ms. Kim handles complaints ___ .","herself",["her","hers","she"],"Phản thân nhấn mạnh → herself."],
        ["The item is currently out of ___ .","stock",["store","shelf","supply"],"out of stock = hết hàng."],
        ["The CEO will ___ a speech tonight.","deliver",["say","tell","speak"],"deliver a speech."],
        ["The shipment arrived later ___ expected.","than",["then","as","that"],"so sánh hơn … than."],
        ["The seminar is scheduled ___ 9 a.m. Monday.","for",["on","in","of"],"be scheduled for + thời điểm."],
        ["Employees must ___ their ID badges at all times.","wear",["wearing","worn","wears"],"must + V nguyên mẫu."],
        ["Please ___ the attached form.","complete",["completion","completely","completed"],"Please + V nguyên mẫu."],
        ["Our office is located ___ the third floor.","on",["in","at","to"],"Tầng → on the … floor."],
        ["Mr. Diaz ___ here since 2015.","has worked",["works","is working","working"],"since → hiện tại hoàn thành."],
        ["Sales were ___ than expected.","higher",["high","highest","highly"],"than → so sánh hơn."],
        ["Please call us if you have ___ questions.","any",["much","every","a"],"Câu điều kiện/hỏi → any."],
        ["The hotel offers a free shuttle ___ the airport.","to",["at","on","by"],"đi tới → to."],
      ],

      /* NGHĨA TỪ (Ải 2)  —  [nghĩa tiếng Việt, từ tiếng Anh đúng, [3 từ nhiễu]] */
      vocab:[
        ["hoá đơn","invoice",["contract","refund","estimate"]],
        ["đồng nghiệp","colleague",["client","supervisor","applicant"]],
        ["hạn chót","deadline",["agenda","survey","branch"]],
        ["nhà kho","warehouse",["headquarters","branch","lobby"]],
        ["đàm phán","negotiate",["postpone","recruit","inspect"]],
        ["tuyển dụng","recruit",["resign","promote","retire"]],
        ["hoàn tiền","refund",["discount","deposit","invoice"]],
        ["chi nhánh","branch",["headquarters","warehouse","lobby"]],
        ["ứng viên","applicant",["employer","supervisor","client"]],
        ["hợp đồng","contract",["proposal","receipt","invoice"]],
        ["thăng chức","promote",["resign","hire","transfer"]],
        ["chương trình họp","agenda",["minutes","memo","brochure"]],
        ["giảm giá","discount",["refund","tax","fee"]],
        ["trì hoãn","postpone",["confirm","attend","approve"]],
      ],

      /* CHÍNH TẢ (Ải 3)  —  [từ viết ĐÚNG, [3 cách viết SAI]] */
      spell:[
        ["receive",["recieve","receeve","resieve"]],
        ["schedule",["schedual","shedule","skedule"]],
        ["colleague",["collegue","coleague","colleage"]],
        ["necessary",["neccessary","necesary","neccesary"]],
        ["business",["buisness","busness","bussiness"]],
        ["separate",["seperate","separete","seperete"]],
        ["guarantee",["garantee","guarentee","gaurantee"]],
        ["accommodation",["accomodation","acommodation","accommadation"]],
        ["occurred",["occured","ocurred","occurrd"]],
        ["maintenance",["maintainance","maintenence","maintanance"]],
        ["questionnaire",["questionaire","questionnair","questionnare"]],
        ["committee",["commitee","comittee","committe"]],
      ],

      /* XẾP CÂU (Ải 4)  —  [[các từ theo ĐÚNG thứ tự], nghĩa tiếng Việt của câu] */
      order:[
        [["The","meeting","has been","postponed"],"Cuộc họp đã bị hoãn."],
        [["Please","submit","the report","by","Friday"],"Vui lòng nộp báo cáo trước thứ Sáu."],
        [["We","look forward","to","hearing","from you"],"Chúng tôi mong nhận phản hồi từ bạn."],
        [["All","staff","must","attend","the training"],"Tất cả nhân viên phải dự buổi đào tạo."],
        [["The package","will","arrive","within","three days"],"Gói hàng sẽ đến trong vòng ba ngày."],
        [["Could","you","send","me","the invoice?"],"Bạn có thể gửi tôi hoá đơn không?"],
        [["Our","sales","increased","by","20 percent"],"Doanh số tăng 20%."],
        [["The","position","requires","extensive","experience"],"Vị trí này yêu cầu nhiều kinh nghiệm."],
      ],

      /* TÌM LỖI SAI (Ải 5)  —  [[4 phần của câu], số thứ tự phần SAI (đếm từ 0), phần sửa lại, giải thích] */
      error:[
        [["The report","must be submitted","until","Friday"],2,"by","Hạn chót → by."],
        [["Ms. Tran","is responsible","to","training staff"],2,"for","responsible for."],
        [["We look forward","to","hear","from you"],2,"hearing","look forward to + V-ing."],
        [["The meeting","has been","postpone","until Monday"],2,"postponed","has been + V3."],
        [["Neither the manager","or","the assistant","was present"],1,"nor","neither … nor."],
        [["The new system","is","very","easier to use"],2,"much","so sánh hơn → much."],
        [["Despite","it rained,","the event","was held"],0,"Although","Although + mệnh đề."],
        [["The shipment","arrived","later","then expected"],3,"than expected","so sánh → than."],
        [["Mr. Lee,","which","joined us,","was promoted"],1,"who","người → who."],
        [["Please keep","this document","confidentially","at all times"],2,"confidential","keep + O + tính từ."],
      ],

      /* CÂU KHÓ / CÂU VÀNG / THỬ THÁCH  —  cùng dạng với "gap": [câu có ___ , đáp án, [3 nhiễu], giải thích] */
      hard:[
        ["___ the contract been signed earlier, we could have started.","Had",["If","Has","Should"],"Đảo ngữ điều kiện loại 3: Had + S + V3."],
        ["The manager insisted that the report ___ revised.","be",["is","was","will be"],"Thể giả định: insist that + S + (be) V nguyên mẫu."],
        ["No sooner had she arrived ___ the meeting began.","than",["when","then","as"],"No sooner … than."],
        ["The applicant ___ résumé impressed us was hired.","whose",["who","whom","which"],"Sở hữu → whose."],
        ["Please refrain ___ using mobile phones.","from",["to","of","for"],"refrain from + V-ing."],
        ["All prices are subject ___ change.","to",["for","with","of"],"be subject to = có thể bị."],
        ["Only after the audit ___ the errors.","did they find",["they found","they did find","found they"],"Only after … → đảo ngữ trợ động từ."],
        ["The new policy takes effect ___ January 1.","as of",["as for","in case","by means of"],"as of + ngày = kể từ."],
        ["Ms. Park is ___ qualified for the position.","highly",["high","height","heighten"],"highly qualified (collocation)."],
        ["Extra funds have been ___ to marketing.","allocated",["allocating","allocate","allocation"],"Bị động have been + V3."],
        ["___ you need assistance, contact the front desk.","Should",["Would","Had","Unless"],"Đảo ngữ loại 1: Should + S + V."],
        ["The committee consists ___ five members.","of",["in","with","on"],"consist of."],
      ],

      /* VOICE BLAST  —  [từ tiếng Anh để đọc to, nghĩa tiếng Việt] */
      voice:[
        ["schedule","lịch trình"],
        ["invoice","hoá đơn"],
        ["colleague","đồng nghiệp"],
        ["deadline","hạn chót"],
        ["purchase","mua hàng"],
        ["receipt","biên lai"],
        ["conference","hội nghị"],
        ["budget","ngân sách"],
        ["negotiate","đàm phán"],
        ["warehouse","nhà kho"],
        ["available","có sẵn"],
        ["appointment","cuộc hẹn"],
      ]
    },

    /* ======== IELTS — Writing Task 1 & 2 · Band 5.5–7+ ======== */
    ielts:{

      /* ĐIỀN TỪ (Ải 1)  —  [câu có ___ , đáp án đúng, [3 đáp án nhiễu], giải thích bằng tiếng Việt] */
      gap:[
        ["The government should ___ measures to cut pollution.","take",["make","do","give"],"take measures."],
        ["There has been a ___ increase in online shopping.","significant",["significance","signify","significantly"],"Trước danh từ cần tính từ."],
        ["The graph ___ the number of tourists.","illustrates",["illustrate","illustrating","illustration"],"Chủ ngữ số ít → -s."],
        ["Technology has a profound impact ___ education.","on",["in","to","for"],"impact on."],
        ["The figure rose ___ 15% to 30%.","from",["by","at","since"],"rise from X to Y."],
        ["Not only ___ exercise improve health, but …","does",["is","has","do"],"Đảo ngữ Not only + trợ động từ."],
        ["If we had acted earlier, the problem ___ smaller now.","would be",["will be","would have been","is"],"Điều kiện hỗn hợp: kết quả ở hiện tại."],
        ["Students who ___ part-time jobs gain skills.","take on",["take off","take after","take over"],"take on = nhận làm."],
        ["The elderly population is expected to ___ sharply.","rise",["raise","arise","rose"],"rise là nội động từ."],
        ["___ the fact that cars are convenient, they pollute.","Despite",["Although","Even though","In spite"],"Despite the fact that…"],
        ["In conclusion, the advantages ___ the drawbacks.","outweigh",["overlook","overtake","overcome"],"outweigh = lớn hơn."],
        ["Fast food is closely ___ to obesity.","linked",["link","linking","links"],"be linked to."],
        ["The number of cars ___ steadily since 2000.","has increased",["increased","increases","was increasing"],"since → hiện tại hoàn thành."],
        ["Renewable energy is ___ for development.","essential",["essence","essentially","essentials"],"Sau to be cần tính từ."],
        ["Children are ___ to advertising than adults.","more vulnerable",["vulnerable","most vulnerable","vulnerably"],"than → so sánh hơn."],
        ["It is widely ___ that education is key.","believed",["believe","believing","belief"],"It is widely believed that…"],
        ["Crime rates have ___ in many cities.","declined",["declining","decline","declines"],"have + V3."],
        ["Governments must ___ a balance between growth and nature.","strike",["hit","beat","make"],"strike a balance."],
        ["The pie chart ___ spending into five categories.","breaks down",["puts down","takes down","cuts down"],"break down into."],
        ["Had I known, I ___ applied.","would have",["will have","would","had"],"Đảo ngữ điều kiện loại 3."],
        ["Air pollution poses a serious threat ___ public health.","to",["for","on","with"],"pose a threat to."],
        ["The figures for 2010 and 2020 were ___ similar.","remarkably",["remarkable","remark","remarked"],"Bổ nghĩa cho tính từ → trạng từ."],
        ["Many people ___ that tourism damages local culture.","argue",["argument","arguing","argues"],"Many people (số nhiều) + V nguyên mẫu."],
        ["___, the chart shows a steady upward trend.","Overall",["Overly","Over","Overtime"],"Overall = nhìn chung (mở đầu đoạn tổng quan Task 1)."],
        ["Unemployment ___ by half between 2000 and 2010.","fell",["felt","fall","falled"],"fall – fell – fallen."],
        ["Online learning offers greater ___ to students.","flexibility",["flexible","flexibly","flex"],"Sau tính từ greater cần danh từ."],
        ["Governments should ___ greater emphasis on vocational training.","place",["make","do","set"],"place emphasis on."],
        ["Violent media may ___ to aggressive behaviour.","contribute",["attribute","distribute","constitute"],"contribute to = góp phần gây ra."],
      ],

      /* NGHĨA TỪ (Ải 2)  —  [nghĩa tiếng Việt, từ tiếng Anh đúng, [3 từ nhiễu]] */
      vocab:[
        ["cơ sở hạ tầng","infrastructure",["architecture","institution","framework"]],
        ["hiện tượng","phenomenon",["hypothesis","principle","tendency"]],
        ["tính bền vững","sustainability",["stability","durability","availability"]],
        ["ô nhiễm","pollution",["population","poverty","pressure"]],
        ["đô thị hoá","urbanisation",["modernisation","globalisation","industrialisation"]],
        ["xấp xỉ","approximately",["accurately","apparently","absolutely"]],
        ["giảm bớt (vấn đề)","alleviate",["aggravate","accelerate","allocate"]],
        ["đáng kể","considerable",["considerate","consistent","conservative"]],
        ["thất nghiệp","unemployment",["employment","retirement","recruitment"]],
        ["khí thải","emissions",["admissions","omissions","missions"]],
        ["nhược điểm","drawback",["benefit","outcome","feature"]],
        ["dao động","fluctuate",["stabilise","plummet","soar"]],
        ["tuổi thọ","life expectancy",["birth rate","workforce","living standard"]],
        ["ưu tiên","prioritise",["criticise","minimise","summarise"]],
      ],

      /* CHÍNH TẢ (Ải 3)  —  [từ viết ĐÚNG, [3 cách viết SAI]] */
      spell:[
        ["environment",["enviroment","environmant","enviornment"]],
        ["government",["goverment","governmant","govenment"]],
        ["definitely",["definately","definitly","defenitely"]],
        ["argument",["arguement","argumant","arguemant"]],
        ["phenomenon",["phenomenom","phenomenun","phenomonon"]],
        ["occasionally",["occasionaly","ocasionally","occassionally"]],
        ["independent",["independant","indipendent","independint"]],
        ["disappear",["dissapear","disapear","dissappear"]],
        ["recommend",["reccomend","recomend","reccommend"]],
        ["privilege",["priviledge","privelege","privilige"]],
        ["existence",["existance","existense","exsistence"]],
        ["achievement",["acheivement","achievment","achievemant"]],
      ],

      /* XẾP CÂU (Ải 4)  —  [[các từ theo ĐÚNG thứ tự], nghĩa tiếng Việt của câu] */
      order:[
        [["The graph","illustrates","changes","in","spending"],"Biểu đồ thể hiện sự thay đổi trong chi tiêu."],
        [["Technology","has","transformed","the way","we live"],"Công nghệ đã thay đổi cách chúng ta sống."],
        [["Governments","should","invest","in","public transport"],"Chính phủ nên đầu tư vào giao thông công cộng."],
        [["The figure","rose","sharply","after","2010"],"Số liệu tăng mạnh sau năm 2010."],
        [["Not only","does","exercise","improve","health"],"Tập thể dục không chỉ cải thiện sức khoẻ…"],
        [["This essay","will","discuss","both","views"],"Bài luận này sẽ bàn về cả hai quan điểm."],
        [["Unemployment","remained","stable","throughout","the period"],"Thất nghiệp ổn định suốt giai đoạn."],
        [["It","is","widely","believed","that…"],"Người ta tin rằng…"],
      ],

      /* TÌM LỖI SAI (Ải 5)  —  [[4 phần của câu], số thứ tự phần SAI (đếm từ 0), phần sửa lại, giải thích] */
      error:[
        [["The number","of cars","have increased","since 2000"],2,"has increased","The number of → số ít."],
        [["Technology","has","an impact","in education"],3,"on education","impact on."],
        [["The graph","illustrate","the changes","over time"],1,"illustrates","Chủ ngữ số ít."],
        [["People","is","becoming","more aware"],1,"are","People số nhiều."],
        [["The proportion","is expected","to raise","sharply"],2,"to rise","rise nội động từ."],
        [["In spite","the fact","that cars","are convenient"],0,"Despite / In spite of","In spite cần of."],
        [["The government","should","make","measures"],2,"take","take measures."],
        [["Children","are more vulnerable","then","adults"],2,"than","so sánh → than."],
        [["We","collected","many informations","last year"],2,"much information","information không đếm được."],
        [["If I had known,","I","would apply","for it"],2,"would have applied","Điều kiện loại 3."],
      ],

      /* CÂU KHÓ / CÂU VÀNG / THỬ THÁCH  —  cùng dạng với "gap": [câu có ___ , đáp án, [3 nhiễu], giải thích] */
      hard:[
        ["Scarcely had the policy been introduced ___ protests began.","when",["than","then","that"],"Scarcely/Hardly … when."],
        ["It is high time governments ___ action on climate change.","took",["take","will take","have taken"],"It's high time + S + quá khứ đơn."],
        ["The data, ___ was collected in 2019, is outdated.","which",["that","what","who"],"Mệnh đề có dấu phẩy không dùng that."],
        ["___ its benefits, nuclear power remains controversial.","Notwithstanding",["Nevertheless","Although","Whereas"],"Notwithstanding + cụm danh từ = mặc dù."],
        ["Were the government ___ taxes, consumption would fall.","to raise",["raise","raising","raised"],"Đảo ngữ loại 2: Were + S + to V."],
        ["Applications rose sharply, ___ a record high in 2021.","reaching",["reached","reach","to reaching"],"V-ing diễn tả kết quả đi kèm."],
        ["Rarely ___ such a dramatic shift in public opinion.","has there been",["there has been","there was","was it"],"Rarely đầu câu → đảo ngữ."],
        ["The rise in obesity can be attributed ___ poor diets.","to",["for","by","with"],"attribute A to B."],
        ["Not until the 1990s ___ widely available.","did the internet become",["the internet became","became the internet","the internet did become"],"Not until … → đảo ngữ."],
        ["So severe ___ the drought that crops failed.","was",["is","did","had"],"So + adj + be + S + that…"],
        ["Renewables ___ to 40% of supply by 2030.","are projected to rise",["project rising","are projecting to rise","projected rising"],"Dự báo trong Task 1: be projected to + V."],
        ["Urban sprawl has a detrimental effect ___ wildlife.","on",["to","for","at"],"have an effect on."],
      ],

      /* VOICE BLAST  —  [từ tiếng Anh để đọc to, nghĩa tiếng Việt] */
      voice:[
        ["environment","môi trường"],
        ["significant","đáng kể"],
        ["development","sự phát triển"],
        ["statistics","số liệu"],
        ["phenomenon","hiện tượng"],
        ["particularly","đặc biệt là"],
        ["sustainability","tính bền vững"],
        ["consequently","do đó"],
        ["infrastructure","cơ sở hạ tầng"],
        ["approximately","xấp xỉ"],
        ["comfortable","thoải mái"],
        ["technology","công nghệ"],
      ]
    }
  }
};
