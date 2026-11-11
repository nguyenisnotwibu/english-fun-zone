'use strict';
/* English Fun Zone — Ôn ngữ pháp: chuyên đề + giao diện luyện tập.
   File này được js/app.js tải KHI CẦN (xem EFZ_CHUNKS). Sửa nội dung ở đây, không cần đụng app.js. */
/* ================= GRAMMAR REVIEW ================= */
let GR=null,_grDiff='all';

const GRAMMAR_TOPICS=[
/* -------- TỪ SÁCH TỔNG ÔN (mới) -------- */
{id:'gr_compare',em:'⚖️',name:'So Sánh Hơn & Nhất',sub:'Comparatives & Superlatives',diff:'medium',qs:[
  ()=>mkQ('My brother is ___ than me.','taller',['tall','more tall','the tallest'],'Adj ngắn + er + than'),
  ()=>mkQ('This book is ___ interesting than that one.','more',['most','much','many'],'Adj dài → more + adj + than'),
  ()=>mkQ('She is ___ student in my class.','the best',['better','the goodest','best'],'So sánh nhất: the best (good → better → the best)'),
  ()=>mkQ('Today is ___ than yesterday.','hotter',['hoter','more hot','hottest'],'hot → nhân đôi t: hotter'),
  ()=>mkQ('My bag is as ___ as yours.','heavy',['heavier','heaviest','more heavy'],'as + adj NGUYÊN MẪU + as'),
  ()=>mkQ('Her English is much ___ than mine.','better',['gooder','more good','best'],'good → better; much nhấn mạnh so sánh hơn'),
  ()=>mkQ('The Nile is one of ___ rivers in the world.','the longest',['the longer','longest','long'],'one of the + so sánh nhất + N số nhiều'),
  ()=>mkQ('The weather is getting ___ and ___ .','colder ... colder',['cold ... cold','more ... cold','coldest ... coldest'],'Càng ngày càng: adj-er and adj-er'),
  ()=>mkQ('___ you study, the better your results will be.','The harder',['Harder','The hard','More hard'],'So sánh kép: The + comparative, the + comparative'),
  ()=>mkQ('This car is twice ___ expensive ___ mine.','as ... as',['more ... than','as ... than','so ... as'],'Gấp bội: twice + as + adj + as'),
]},
{id:'gr_conditional',em:'🌦️',name:'Câu Điều Kiện 1 & 2',sub:'If-clauses Type 1 & 2',diff:'hard',qs:[
  ()=>mkQ('If it rains, we ___ at home.','will stay',['stay','stayed','would stay'],'Loại 1: If + HT đơn, will + V'),
  ()=>mkQ('If I ___ you, I would study harder.','were',['am','was being','be'],'Loại 2: were cho mọi ngôi'),
  ()=>mkQ('If she studies hard, she ___ the exam.','will pass',['passes','passed','would pass'],'Loại 1 → will + V'),
  ()=>mkQ('If I had a lot of money, I ___ around the world.','would travel',['will travel','traveled','travel'],'Loại 2: If + QK đơn → would + V'),
  ()=>mkQ('___ you hurry, you will miss the bus.','Unless',['If','When','Because'],'Unless = If...not'),
  ()=>mkQ('If he ___ the truth, he would tell us.','knew',['knows','known','would know'],'Vế chính would → If + QK đơn (loại 2)'),
  ()=>mkQ('What ___ if you won the lottery?','would you do',['will you do','do you do','did you do'],'won → loại 2 → would you do'),
  ()=>mkQ('If you heat ice, it ___ .','melts',['will melt','melted','would melt'],'Chân lý → loại 0: HT đơn + HT đơn'),
  ()=>mkQ('Unless you water the plants, they ___ .','will die',['die','died','would die'],'Unless + HT đơn, will + V'),
  ()=>mkQ('If we don\'t protect the environment, our children ___ .','will suffer',['suffer','suffered','would suffer'],'Loại 1 — cảnh báo có thể xảy ra'),
]},
{id:'gr_passive',em:'🔄',name:'Câu Bị Động',sub:'Passive Voice — be + V3',diff:'hard',qs:[
  ()=>mkQ('Rice ___ in tropical countries.','is grown',['grows','is growing','grew'],'Bị động HT đơn: is/are + V3'),
  ()=>mkQ('This house ___ in 1990.','was built',['built','is built','has built'],'Mốc quá khứ → was/were + V3'),
  ()=>mkQ('English ___ all over the world.','is spoken',['speaks','is speaking','spoke'],'Tiếng Anh ĐƯỢC nói → bị động'),
  ()=>mkQ('A new bridge ___ in this area at the moment.','is being built',['is built','is building','builds'],'at the moment → is being + V3'),
  ()=>mkQ('The letter ___ tomorrow morning.','will be sent',['will send','is sent','will be sending'],'Tương lai bị động: will be + V3'),
  ()=>mkQ('Helmets must ___ when riding a motorbike.','be worn',['wear','be wearing','worn'],'Modal bị động: must + be + V3'),
  ()=>mkQ('The report ___ yet.','hasn\'t been finished',['hasn\'t finished','isn\'t finished','didn\'t finish'],'yet → HTHT bị động: has been + V3'),
  ()=>mkQ('My phone ___ last night.','was stolen',['stole','is stolen','has stolen'],'last night → QK đơn bị động'),
  ()=>mkQ('She had her hair ___ at the new salon.','cut',['to cut','cutting','cuts'],'have + O + V3: nhờ ai làm gì'),
  ()=>mkQ('The children were made ___ their vegetables.','to eat',['eat','eating','eaten'],'make sb do → bị động: be made TO do'),
]},
{id:'gr_relative',em:'🧩',name:'Mệnh Đề Quan Hệ',sub:'who / which / whose / where / that',diff:'advanced',qs:[
  ()=>mkQ('The man ___ is talking to my dad is our teacher.','who',['which','whose','where'],'Người, làm chủ ngữ → who'),
  ()=>mkQ('The book ___ is on the table belongs to Nam.','which',['who','whom','whose'],'Vật → which'),
  ()=>mkQ('The boy ___ father is a doctor studies very well.','whose',['who','whom','which'],'Sở hữu → whose + N'),
  ()=>mkQ('This is the school ___ my mother used to study.','where',['which','who','whom'],'Nơi chốn → where'),
  ()=>mkQ('Sunday is the day ___ we usually go to the park.','when',['where','which','who'],'Thời gian → when'),
  ()=>mkQ('The girl ___ you met yesterday is my sister.','whom',['which','whose','what'],'Người, tân ngữ → whom'),
  ()=>mkQ('Everything ___ he said was true.','that',['which','who','whose'],'Sau everything → that'),
  ()=>mkQ('My mother, ___ is a nurse, works very hard.','who',['that','whom','which'],'Có dấu phẩy → KHÔNG dùng that; người → who'),
  ()=>mkQ('He failed the exam, ___ made his parents sad.','which',['that','what','it'],'which thay cả mệnh đề trước'),
  ()=>mkQ('The man ___ over there is a famous singer.','standing',['who standing','stands','stood'],'Rút gọn: who is standing → standing'),
]},
/* -------- DỄ -------- */
{id:'gr_present',em:'🟢',name:'Hiện Tại Đơn',sub:'Simple Present Tense',diff:'easy',qs:[
  ()=>mkQ('She ___ to school every day. (go)','goes',['go','going','went'],'Ngôi 3 số ít → thêm s/es: go → goes'),
  ()=>mkQ('They ___ football on weekends.','play',['plays','playing','played'],'They = ngôi số nhiều → giữ nguyên: play'),
  ()=>mkQ('My father ___ very early. (wake up)','wakes up',['wake up','waking up','woke up'],'Ngôi 3 số ít → wake up → wakes up'),
  ()=>mkQ('___ she like music?','Does',['Do','Is','Are'],'Ngôi 3 số ít → Does + V nguyên thể'),
  ()=>mkQ('He doesn\'t ___ coffee.','drink',['drinks','drinking','drank'],'Sau doesn\'t → động từ nguyên thể'),
  ()=>mkQ('Nam and Mai ___ in Hanoi.','live',['lives','lived','living'],'Chủ ngữ số nhiều → giữ nguyên: live'),
  ()=>mkQ('She ___ (study) hard every night.','studies',['studys','studying','studied'],'study + s/es → studies (y→ies)'),
  ()=>mkQ('___ your parents work in Hanoi?','Do',['Does','Are','Is'],'Chủ ngữ số nhiều → Do'),
  ()=>mkQ('He always ___ (watch) TV after dinner.','watches',['watch','watching','watched'],'watch + es = watches (ngôi 3)'),
  ()=>mkQ('I ___ not like spicy food.','do',['does','am','is'],'I → do not like'),
]},
{id:'gr_pronouns',em:'🔵',name:'Đại Từ & Tính Từ Sở Hữu',sub:'Pronouns & Possessives',diff:'easy',qs:[
  ()=>mkQ('That is ___ book. (của tôi)','my',['me','I','mine'],'Trước danh từ → tính từ sở hữu: my'),
  ()=>mkQ('___ is my best friend. (cô ấy)','She',['Her','Hers','He'],'Chủ ngữ → She'),
  ()=>mkQ('Is this pencil ___? (của em)','yours',['your','you','mine'],'Sau động từ, không có danh từ → đại từ sở hữu: yours'),
  ()=>mkQ('We love ___ school. (của chúng tôi)','our',['ours','us','we'],'Trước danh từ → our'),
  ()=>mkQ('The dog wags ___ tail.','its',['it\'s','their','his'],'Con vật trung tính → its'),
  ()=>mkQ('They finished ___ homework.','their',['they','them','theirs'],'Trước danh từ → their'),
  ()=>mkQ('Give ___ the book, please. (cho tôi)','me',['I','my','mine'],'Sau động từ → tân ngữ: me'),
  ()=>mkQ('___ name is Minh. (Anh ấy)','His',['He','Him','Himself'],'Trước danh từ → tính từ sở hữu: his'),
  ()=>mkQ('That bag is ___. (của họ)','theirs',['their','them','they'],'Sau động từ, không có danh từ → theirs'),
  ()=>mkQ('___ are good students. (Chúng tôi)','We',['Us','Our','Ours'],'Chủ ngữ → We'),
]},
{id:'gr_can',em:'🌟',name:'Can / Can\'t / Could',sub:'Khả năng & Xin phép',diff:'easy',qs:[
  ()=>mkQ('She ___ swim very fast.','can',['cans','could','is able'],'can + V nguyên thể (không chia)'),
  ()=>mkQ('___ I use your pen, please?','Can',['Do','Am','Does'],'Xin phép lịch sự → Can I...?'),
  ()=>mkQ('He ___ play the piano when he was 5.','could',['can','was able','cans'],'Khả năng trong quá khứ → could'),
  ()=>mkQ('They ___ speak French. (không thể)','can\'t',['don\'t','aren\'t','couldn\'t'],'can + not = can\'t (không thể hiện tại)'),
  ()=>mkQ('___ you help me with this box?','Can',['Do','Will','Are'],'Nhờ giúp đỡ → Can you...?'),
  ()=>mkQ('My sister ___ draw beautiful pictures.','can',['is','does','cans'],'can + động từ nguyên thể'),
  ()=>mkQ('We ___ stay up late last night.','couldn\'t',['can\'t','don\'t','weren\'t'],'Không thể trong quá khứ → couldn\'t'),
  ()=>mkQ('___ birds fly?','Can',['Do','Are','Is'],'Hỏi khả năng → Can + S + V?'),
  ()=>mkQ('He can\'t ___ a bicycle.','ride',['rides','riding','rode'],'Sau can/can\'t → V nguyên thể'),
  ()=>mkQ('She could ___ very well at age 3. (đọc)','read',['reads','reading','to read'],'Sau could → V nguyên thể'),
]},
{id:'gr_articles',em:'🅰️',name:'Mạo Từ A / An / The',sub:'Articles',diff:'easy',qs:[
  ()=>mkQ('I have ___ orange.','an',['a','the','—'],'Nguyên âm (o-) → an'),
  ()=>mkQ('___ sun rises in the east.','The',['A','An','—'],'Duy nhất, ai cũng biết → The'),
  ()=>mkQ('She is ___ doctor.','a',['an','the','—'],'Phụ âm (d-), lần đầu nhắc → a'),
  ()=>mkQ('He ate ___ apple for breakfast.','an',['a','the','—'],'Nguyên âm (a-) → an'),
  ()=>mkQ('___ book on the table is mine.','The',['A','An','—'],'Đã xác định (on the table) → The'),
  ()=>mkQ('I want to be ___ engineer.','an',['a','the','—'],'Nguyên âm (e-) → an'),
  ()=>mkQ('___ Nile is the longest river.','The',['A','An','—'],'Tên sông → The'),
  ()=>mkQ('Can I have ___ glass of water?','a',['an','the','—'],'Phụ âm (g-), chưa xác định → a'),
  ()=>mkQ('She plays ___ piano every evening.','the',['a','an','—'],'Nhạc cụ → the piano/guitar...'),
  ()=>mkQ('My father is ___ honest man.','an',['a','the','—'],'Phát âm bắt đầu bằng nguyên âm (honest = /ɒnɪst/) → an'),
]},
/* -------- VỪA -------- */
{id:'gr_pcon_basic',em:'🏃',name:'Hiện Tại Tiếp Diễn (Cơ Bản)',sub:'Present Continuous — am/is/are + V-ing',diff:'easy',qs:[
  ()=>mkQ('Look! The baby ___ now. (sleep)','is sleeping',['sleeps','sleep','slept'],'Hành động đang xảy ra → is/am/are + V-ing'),
  ()=>mkQ('I ___ my homework at the moment.','am doing',['do','does','did'],'I + am + V-ing'),
  ()=>mkQ('They ___ football in the yard now.','are playing',['is playing','plays','play'],'They → are + V-ing'),
  ()=>mkQ('She is ___ a letter to her friend.','writing',['write','writes','wrote'],'write bỏ e + ing → writing'),
  ()=>mkQ('___ you listening to me?','Are',['Do','Is','Am'],'You → Are + you + V-ing?'),
  ()=>mkQ('He is ___ in the river. (swim)','swimming',['swiming','swims','swam'],'swim nhân đôi m → swimming'),
  ()=>mkQ('We ___ TV right now.','are watching',['watch','watches','watched'],'We → are + V-ing; dấu hiệu: right now'),
  ()=>mkQ('The birds ___ in the sky.','are flying',['is flying','flies','flew'],'The birds (số nhiều) → are flying'),
  ()=>mkQ('My mother ___ dinner in the kitchen now.','is cooking',['cooks','cooking','cooked'],'Ngôi 3 số ít → is + cooking'),
  ()=>mkQ('Listen! Someone ___ at the door.','is knocking',['knocks','knock','knocked'],'Dấu hiệu "Listen!" → hiện tại tiếp diễn'),
]},
{id:'gr_pastsimple',em:'🕰️',name:'Quá Khứ Đơn (Cơ Bản)',sub:'Past Simple — V-ed & was/were',diff:'medium',qs:[
  ()=>mkQ('Yesterday, I ___ my grandparents. (visit)','visited',['visit','visits','visiting'],'Quá khứ đơn có quy tắc → thêm -ed: visited'),
  ()=>mkQ('She ___ at home last night.','was',['were','is','be'],'She → was; dấu hiệu: last night'),
  ()=>mkQ('They ___ very happy at the party.','were',['was','are','is'],'They → were'),
  ()=>mkQ('We ___ football two days ago. (play)','played',['play','plays','playing'],'ago → quá khứ đơn: played'),
  ()=>mkQ('___ you at school yesterday?','Were',['Was','Did','Are'],'You → Were you...?'),
  ()=>mkQ('He ___ his room last Sunday. (clean)','cleaned',['cleans','clean','cleaning'],'last Sunday → cleaned'),
  ()=>mkQ('She didn\'t ___ TV last night.','watch',['watched','watches','watching'],'Sau didn\'t → động từ nguyên thể'),
  ()=>mkQ('___ they visit Ha Long Bay last summer?','Did',['Do','Were','Does'],'Câu hỏi quá khứ đơn → Did + S + V?'),
  ()=>mkQ('The weather ___ nice last weekend.','was',['were','is','been'],'The weather (số ít) → was'),
  ()=>mkQ('I ___ (study) English two hours yesterday.','studied',['studyed','studys','studying'],'study → studied (y → ied)'),
]},
{id:'gr_future',em:'🔮',name:'Tương Lai Đơn & Be Going To',sub:'Will / Be going to',diff:'medium',qs:[
  ()=>mkQ('I think it ___ rain tomorrow.','will',['is','does','did'],'Dự đoán → will + V nguyên thể'),
  ()=>mkQ('She ___ visit her grandma next week.','is going to',['will going to','goes to','went to'],'Kế hoạch đã định → be going to + V'),
  ()=>mkQ('We ___ to the zoo next Sunday. (go)','will go',['will goes','will going','went'],'will + V nguyên thể: will go'),
  ()=>mkQ('Look at those black clouds! It ___ rain.','is going to',['will','is','does'],'Dấu hiệu rõ ràng trước mắt → be going to'),
  ()=>mkQ('___ you help me with this exercise, please?','Will',['Are','Do','Did'],'Lời đề nghị → Will you...?'),
  ()=>mkQ('They ___ going to build a new school here.','are',['is','will','was'],'They → are going to'),
  ()=>mkQ('I promise I ___ tell anyone.','won\'t',['don\'t','didn\'t','am not'],'Lời hứa phủ định → won\'t = will not'),
  ()=>mkQ('He ___ be 11 years old next month.','will',['is going','was','has'],'Sự thật tương lai → will be'),
  ()=>mkQ('What ___ you do this weekend?','are ... going to',['will ... going to','do ... going to','did ... going to'],'What are you going to do...?'),
  ()=>mkQ('Tomorrow is Sunday, so I ___ get up early.','won\'t',['don\'t','didn\'t','wasn\'t'],'Tương lai phủ định → won\'t'),
]},
{id:'gr_pastcon',em:'⏳',name:'Quá Khứ Tiếp Diễn',sub:'Past Continuous — was/were + V-ing',diff:'hard',qs:[
  ()=>mkQ('I ___ TV when the phone rang.','was watching',['watched','am watching','watch'],'Hành động đang diễn ra thì bị xen vào → was + V-ing'),
  ()=>mkQ('They ___ football at 5 p.m. yesterday.','were playing',['was playing','played','are playing'],'They → were + V-ing; mốc giờ trong quá khứ'),
  ()=>mkQ('While she ___, her brother was reading.','was cooking',['cooked','cooks','is cooking'],'While + 2 hành động song song → was/were + V-ing'),
  ()=>mkQ('What ___ you doing at 8 o\'clock last night?','were',['was','did','are'],'You → were + V-ing'),
  ()=>mkQ('The sun ___ when we left home.','was shining',['shone','is shining','shines'],'Hành động nền đang diễn ra → was shining'),
  ()=>mkQ('He fell while he ___ his bike.','was riding',['rode','rides','is riding'],'Đang đi xe thì ngã → was riding'),
  ()=>mkQ('We ___ dinner when the lights went out.','were having',['had','have','are having'],'Đang ăn thì mất điện → were having'),
  ()=>mkQ('She ___ sleeping, so I didn\'t call her.','was',['were','is','has been'],'She → was sleeping'),
  ()=>mkQ('While I ___ to music, my mother came in.','was listening',['listened','listen','am listening'],'While + quá khứ tiếp diễn'),
  ()=>mkQ('At this time yesterday, they ___ on the beach.','were walking',['walked','are walking','was walking'],'"At this time yesterday" → were + V-ing'),
]},
{id:'gr_pcon',em:'🟡',name:'Hiện Tại Tiếp Diễn',sub:'Present Continuous',diff:'medium',qs:[
  ()=>mkQ('Look! She ___ (dance) in the garden.','is dancing',['dances','dance','was dancing'],'Look! → hiện tại tiếp diễn: is + dancing'),
  ()=>mkQ('They ___ (play) football now.','are playing',['play','is playing','played'],'They + now → are playing'),
  ()=>mkQ('___ he ___ (study) at the moment?','Is ... studying',['Does ... study','Do ... study','Was ... studying'],'Câu hỏi HTTD ngôi 3: Is + S + V-ing?'),
  ()=>mkQ('I ___ (not / watch) TV right now.','am not watching',['don\'t watch','isn\'t watching','not watching'],'I → am not watching'),
  ()=>mkQ('Listen! The baby ___ (cry).','is crying',['cries','cry','was crying'],'Listen! → HTTD: is crying'),
  ()=>mkQ('We ___ (have) dinner at 7 pm tonight.','are having',['have','had','will have'],'Kế hoạch tương lai gần → are having'),
  ()=>mkQ('She can\'t talk. She ___ (sleep).','is sleeping',['sleeps','sleep','was sleeping'],'Đang xảy ra → is sleeping'),
  ()=>mkQ('What ___ you ___ (do) now?','are ... doing',['do ... do','does ... do','did ... do'],'What + are + S + doing? → HTTD'),
  ()=>mkQ('He ___ (sit) next to the window.','is sitting',['sits','sat','is sit'],'is + sitting (sit → sitting, nhân đôi t)'),
  ()=>mkQ('___ they ___ (make) a cake?','Are ... making',['Do ... make','Is ... making','Did ... make'],'They → Are they making...?'),
]},
{id:'gr_compare',em:'🏅',name:'So Sánh Hơn & Nhất',sub:'Comparatives & Superlatives',diff:'medium',qs:[
  ()=>mkQ('Ha Noi is ___ than Hue. (big)','bigger',['more big','biggest','big'],'1 âm tiết → thêm -er: bigger'),
  ()=>mkQ('This is ___ film I\'ve ever seen. (bad)','the worst',['the baddest','the most bad','worse'],'Bất quy tắc: bad → worse → the worst'),
  ()=>mkQ('She is ___ student in class. (intelligent)','the most intelligent',['the intelligentst','most intelligent','more intelligent'],'Nhiều âm tiết → the most + adj'),
  ()=>mkQ('My bag is ___ than yours. (heavy)','heavier',['more heavy','heaviest','heavy'],'heavy → heavier (y → ier)'),
  ()=>mkQ('This cake is ___ than that one. (good)','better',['more good','gooder','best'],'Bất quy tắc: good → better → the best'),
  ()=>mkQ('Fansipan is ___ mountain in Vietnam. (high)','the highest',['the higher','more high','highest'],'So sánh nhất → the highest'),
  ()=>mkQ('He runs ___ than his brother. (fast)','faster',['more fast','fastest','fastly'],'1 âm tiết → faster'),
  ()=>mkQ('English is ___ than Maths for me. (easy)','easier',['more easy','easiest','easy'],'easy → easier (y→ier)'),
  ()=>mkQ('Summer is ___ season of the year. (hot)','the hottest',['the most hot','the hotter','hottest'],'1 âm tiết, kết thúc VCC → double: hottest'),
  ()=>mkQ('She speaks ___ English in the class. (fluent)','the most fluently',['the most fluent','fluenter','most fluently'],'Trạng từ nhiều âm tiết → the most fluently'),
]},
{id:'gr_modal',em:'⚠️',name:'Must / Should / Have to',sub:'Modal Verbs',diff:'medium',qs:[
  ()=>mkQ('You ___ wear a helmet. It\'s the law.','must',['should','can','mustn\'t'],'Quy định/luật pháp → must'),
  ()=>mkQ('You ___ eat junk food. It\'s unhealthy.','shouldn\'t',['mustn\'t','don\'t have to','can\'t'],'Lời khuyên không nên → shouldn\'t'),
  ()=>mkQ('She ___ to go to school on Sunday.','doesn\'t have to',['mustn\'t','shouldn\'t','can\'t'],'Không bắt buộc → don\'t/doesn\'t have to'),
  ()=>mkQ('You ___ talk in the library. It\'s forbidden.','mustn\'t',['don\'t have to','shouldn\'t','can\'t'],'Cấm hoàn toàn → mustn\'t'),
  ()=>mkQ('You look tired. You ___ take a rest.','should',['must','have to','mustn\'t'],'Lời khuyên nên → should'),
  ()=>mkQ('All students ___ wear uniform at school.','must',['should','can','don\'t have to'],'Quy định bắt buộc → must'),
  ()=>mkQ('I ___ finish this report by Friday.','have to',['must','should','might'],'Bắt buộc từ bên ngoài → have to'),
  ()=>mkQ('You ___ brush your teeth twice a day.','should',['must','have to','can'],'Lời khuyên sức khỏe → should'),
  ()=>mkQ('You ___ smoke here. It\'s a hospital.','mustn\'t',['don\'t have to','shouldn\'t','can\'t'],'Cấm nghiêm ngặt → mustn\'t'),
  ()=>mkQ('It\'s a holiday. We ___ go to school.','don\'t have to',['mustn\'t','shouldn\'t','can\'t'],'Không bắt buộc (tự chọn) → don\'t have to'),
]},
{id:'gr_quant',em:'🔢',name:'Some / Any / Much / Many',sub:'Quantifiers',diff:'medium',qs:[
  ()=>mkQ('Is there ___ milk in the fridge?','any',['some','much','many'],'Câu hỏi với danh từ không đếm → any'),
  ()=>mkQ('I have ___ good friends in my class.','some',['any','much','a few'],'Câu khẳng định → some'),
  ()=>mkQ('How ___ apples did you buy?','many',['much','some','any'],'Đếm được (apples) → many'),
  ()=>mkQ('How ___ sugar do you need?','much',['many','some','any'],'Không đếm được (sugar) → much'),
  ()=>mkQ('There aren\'t ___ chairs in the room.','any',['some','many','much'],'Câu phủ định → any'),
  ()=>mkQ('Would you like ___ tea?','some',['any','much','many'],'Mời mọc → some (dù là câu hỏi)'),
  ()=>mkQ('She doesn\'t have ___ time to rest.','much',['many','some','any'],'Không đếm được (time) + phủ định → much'),
  ()=>mkQ('There are ___ students absent today.','some',['any','much','many'],'Câu khẳng định đếm được → some'),
  ()=>mkQ('He didn\'t drink ___ water.','much',['many','some','any'],'Không đếm được + phủ định → much'),
  ()=>mkQ('Do you have ___ brothers or sisters?','any',['some','much','many'],'Câu hỏi thông thường → any'),
]},
/* -------- KHÓ -------- */
{id:'gr_past',em:'🔴',name:'Quá Khứ Đơn Bất Quy Tắc',sub:'Irregular Past Simple',diff:'hard',qs:[
  ()=>mkQ('She ___ a great film last night. (see)','saw',['seed','seen','sees'],'see → saw (bất quy tắc)'),
  ()=>mkQ('We ___ to the beach last summer. (go)','went',['goed','gone','goes'],'go → went (bất quy tắc)'),
  ()=>mkQ('He ___ a sandwich for lunch. (make)','made',['maked','makes','making'],'make → made (bất quy tắc)'),
  ()=>mkQ('They ___ a test yesterday. (take)','took',['taked','taken','takes'],'take → took (bất quy tắc)'),
  ()=>mkQ('She ___ all her money on clothes. (spend)','spent',['spended','spends','spending'],'spend → spent (bất quy tắc)'),
  ()=>mkQ('I ___ a great idea this morning. (have)','had',['haved','has','having'],'have → had (bất quy tắc)'),
  ()=>mkQ('He ___ a bike to school yesterday. (ride)','rode',['rided','ridden','rides'],'ride → rode (bất quy tắc)'),
  ()=>mkQ('We ___ a lot of fun at the party. (have)','had',['have','haved','having'],'have → had'),
  ()=>mkQ('She ___ first place in the race. (win)','won',['winned','wons','wins'],'win → won (bất quy tắc)'),
  ()=>mkQ('The cat ___ under the bed. (hide)','hid',['hided','hidden','hides'],'hide → hid (bất quy tắc)'),
]},
{id:'gr_passive',em:'🔵',name:'Câu Bị Động',sub:'Passive Voice',diff:'hard',qs:[
  ()=>mkQ('Rice ___ in the Mekong Delta. (grow)','is grown',['is growing','grows','was grown'],'Hiện tại đơn bị động: is/are + V3'),
  ()=>mkQ('This novel ___ by Nam Cao. (write)','was written',['is written','wrote','is wrote'],'Quá khứ đơn bị động: was/were + V3'),
  ()=>mkQ('English ___ all over the world. (speak)','is spoken',['is speaking','speaks','spoken'],'Hiện tại đơn bị động: is spoken'),
  ()=>mkQ('The windows ___ last week. (clean)','were cleaned',['are cleaned','was cleaned','cleaned'],'Chủ ngữ số nhiều + quá khứ → were cleaned'),
  ()=>mkQ('A new school ___ next year. (build)','will be built',['will build','is built','is building'],'Tương lai bị động: will be + V3'),
  ()=>mkQ('The letter ___ by the secretary. (type)','was typed',['typed','is typed','was typing'],'Quá khứ bị động: was typed'),
  ()=>mkQ('These flowers ___ every day. (water)','are watered',['water','is watered','watered'],'Chủ ngữ số nhiều, hiện tại → are watered'),
  ()=>mkQ('The book ___ into 10 languages. (translate)','has been translated',['is translated','was translated','translated'],'Hiện tại hoàn thành bị động: has been + V3'),
  ()=>mkQ('Dinner ___ at 7 pm. (serve)','is served',['serves','is serving','served'],'Thói quen bị động → is served'),
  ()=>mkQ('The criminals ___ by the police. (catch)','were caught',['are caught','caught','have caught'],'Quá khứ số nhiều bị động: were caught'),
]},
{id:'gr_gerund',em:'🔶',name:'Gerund & Infinitive',sub:'V-ing / To V',diff:'hard',qs:[
  ()=>mkQ('She enjoys ___ in the rain. (walk)','walking',['to walk','walk','walked'],'enjoy + V-ing'),
  ()=>mkQ('I want ___ a new phone. (buy)','to buy',['buying','buy','bought'],'want + to V'),
  ()=>mkQ('He finished ___ the report. (write)','writing',['to write','write','wrote'],'finish + V-ing'),
  ()=>mkQ('They decided ___ a new house. (buy)','to buy',['buying','buy','bought'],'decide + to V'),
  ()=>mkQ('She is good at ___ English. (speak)','speaking',['to speak','speak','spoken'],'be good at + V-ing'),
  ()=>mkQ('We hope ___ you soon. (see)','to see',['seeing','see','saw'],'hope + to V'),
  ()=>mkQ('He avoided ___ his teacher. (meet)','meeting',['to meet','meet','met'],'avoid + V-ing'),
  ()=>mkQ('I prefer ___ at home to going out.','staying',['to stay','stay','stayed'],'prefer + V-ing + to + V-ing'),
  ()=>mkQ('She promised ___ on time. (come)','to come',['coming','come','came'],'promise + to V'),
  ()=>mkQ('He kept ___ although he was tired. (run)','running',['to run','run','ran'],'keep + V-ing (keep→ double n)'),
]},
{id:'gr_perfect',em:'🟣',name:'Hiện Tại Hoàn Thành',sub:'Present Perfect',diff:'hard',qs:[
  ()=>mkQ('She ___ (just / finish) her homework.','has just finished',['just finished','is finishing','finishes'],'just → HTHT: has + just + V3'),
  ()=>mkQ('Have you ever ___ pho? (eat)','eaten',['ate','eating','eats'],'ever → HTHT, sau have → V3: eaten'),
  ()=>mkQ('I ___ (not / see) that film yet.','haven\'t seen',['didn\'t see','don\'t see','haven\'t saw'],'yet (phủ định) → haven\'t + V3: seen'),
  ()=>mkQ('He ___ in Hanoi for 5 years. (live)','has lived',['lived','has been living','lives'],'for + khoảng thời gian → has lived'),
  ()=>mkQ('They ___ (already / eat) dinner.','have already eaten',['already ate','are eating','eat'],'already → HTHT: have already + V3'),
  ()=>mkQ('___ she ever ___ to Paris? (be)','Has ... been',['Did ... go','Is ... been','Has ... went'],'ever → Has + S + V3?'),
  ()=>mkQ('We ___ (not / meet) since 2020.','haven\'t met',['didn\'t meet','don\'t meet','haven\'t meet'],'since → HTHT: haven\'t + V3: met'),
  ()=>mkQ('It\'s the best cake I ___ (ever/eat).','have ever eaten',['ever ate','had ever eaten','ate'],'Cấu trúc: the best ... I have ever + V3'),
  ()=>mkQ('She ___ (lose) her keys. She can\'t find them.','has lost',['lost','is losing','loses'],'Kết quả hiện tại → has lost'),
  ()=>mkQ('I ___ (already / read) that book.','have already read',['already read','read','has already read'],'already + HTHT: have already read'),
]},
/* -------- NÂNG CAO -------- */
{id:'gr_cond1',em:'🔷',name:'Câu Điều Kiện Loại 1',sub:'Conditional Type 1',diff:'advanced',qs:[
  ()=>mkQ('If it ___ tomorrow, we won\'t go out. (rain)','rains',['will rain','rained','is raining'],'If + hiện tại đơn, ... will + V'),
  ()=>mkQ('If she studies hard, she ___ the exam. (pass)','will pass',['passes','would pass','passed'],'Mệnh đề chính: will + V'),
  ()=>mkQ('Unless you hurry, you ___ the bus.','will miss',['miss','would miss','missed'],'Unless = If not; mệnh đề chính will + V'),
  ()=>mkQ('If I ___ more time, I\'ll help you. (have)','have',['will have','had','am having'],'Mệnh đề If: hiện tại đơn'),
  ()=>mkQ('She\'ll be late if she ___ (not / leave) now.','doesn\'t leave',['won\'t leave','didn\'t leave','isn\'t leaving'],'Mệnh đề If: hiện tại đơn phủ định'),
  ()=>mkQ('If they don\'t book early, they ___ a seat.','won\'t get',['don\'t get','wouldn\'t get','didn\'t get'],'Mệnh đề chính: will/won\'t + V'),
  ()=>mkQ('What will you do if you ___ (fail) the test?','fail',['will fail','failed','are failing'],'Mệnh đề If: hiện tại đơn'),
  ()=>mkQ('If it\'s sunny, we ___ a picnic. (have)','will have',['have','would have','had'],'Tương lai → will have'),
  ()=>mkQ('I\'ll call you if I ___ (arrive) early.','arrive',['will arrive','arrived','am arriving'],'If clause: hiện tại đơn'),
  ()=>mkQ('If you mix red and blue, you ___ purple.','get',['will get','got','are getting'],'Sự thật hiển nhiên → If + hiện tại, hiện tại'),
]},
{id:'gr_cond2',em:'🟠',name:'Câu Điều Kiện Loại 2',sub:'Conditional Type 2',diff:'advanced',qs:[
  ()=>mkQ('If I ___ rich, I would travel the world. (be)','were',['am','was','would be'],'Loại 2: If + were/V-ed (giả định không thật)'),
  ()=>mkQ('She would help you if she ___ time. (have)','had',['has','would have','will have'],'If clause loại 2: had (quá khứ giả định)'),
  ()=>mkQ('If I knew the answer, I ___ you. (tell)','would tell',['will tell','told','would told'],'Mệnh đề chính: would + V nguyên thể'),
  ()=>mkQ('What would you do if you ___ a million dollars? (win)','won',['win','would win','will win'],'If clause loại 2: won'),
  ()=>mkQ('If he ___ (study) more, he would pass.','studied',['studies','will study','would study'],'Giả định không thật → studied'),
  ()=>mkQ('She ___ happier if she had more friends. (be)','would be',['will be','was','were'],'Mệnh đề chính: would be'),
  ()=>mkQ('If I were you, I ___ (not / do) that.','wouldn\'t do',['won\'t do','didn\'t do','wouldn\'t did'],'would not + V nguyên thể'),
  ()=>mkQ('If we had a car, we ___ (drive) there.','would drive',['will drive','drove','would drove'],'would + V nguyên thể'),
  ()=>mkQ('He ___ (come) if you invited him.','would come',['will come','came','would came'],'would + V'),
  ()=>mkQ('If I ___ (be) the teacher, I\'d give less homework.','were',['am','was','would be'],'If I were (NOT was) – ngữ pháp trang trọng'),
]},
{id:'gr_relative',em:'🔺',name:'Mệnh Đề Quan Hệ',sub:'Relative Clauses',diff:'advanced',qs:[
  ()=>mkQ('The boy ___ sits next to me is very smart.','who',['which','whom','whose'],'Người + chủ ngữ → who'),
  ()=>mkQ('This is the book ___ I told you about.','that / which',['who','whom','whose'],'"that" hoặc "which" cho vật/sự việc'),
  ()=>mkQ('The woman ___ bag was stolen called the police.','whose',['who','which','whom'],'Sở hữu → whose'),
  ()=>mkQ('The city ___ I was born is very beautiful.','where',['which','who','that'],'Nơi chốn → where'),
  ()=>mkQ('Do you know the reason ___ she left?','why',['when','where','which'],'Lý do → why'),
  ()=>mkQ('The man ___ you met yesterday is my uncle.','whom',['who','which','whose'],'Người + tân ngữ → whom (trang trọng)'),
  ()=>mkQ('2020 was the year ___ everything changed.','when',['where','which','who'],'Thời gian → when'),
  ()=>mkQ('The film ___ we watched last night was fantastic.','which / that',['who','whom','whose'],'"which/that" cho vật'),
  ()=>mkQ('She has a friend ___ can speak 5 languages.','who',['which','whom','whose'],'Người + chủ ngữ → who'),
  ()=>mkQ('That\'s the house ___ Shakespeare was born.','where',['which','when','who'],'Nơi chốn → where'),
]},
{id:'gr_reported',em:'💬',name:'Câu Tường Thuật',sub:'Reported Speech',diff:'advanced',qs:[
  ()=>mkQ('"I am tired." → She said she ___ tired.','was',['is','were','has been'],'am/is → was (lùi thì)'),
  ()=>mkQ('"I will call you." → He said he ___ call me.','would',['will','should','could'],'will → would'),
  ()=>mkQ('"I have finished." → She said she ___ finished.','had',['has','was','did'],'have → had (hiện tại hoàn thành → QTHT)'),
  ()=>mkQ('"Don\'t touch that!" → She told him ___ touch that.','not to',['to not','don\'t','not'],'"Don\'t + V" → told + O + not to + V'),
  ()=>mkQ('"I went to Paris." → He said he ___ to Paris.','had gone',['went','has gone','goes'],'Quá khứ đơn → QTHT: had gone'),
  ()=>mkQ('"Can you help me?" → She asked if I ___ help her.','could',['can','would','should'],'"can" → could trong tường thuật'),
  ()=>mkQ('"I live here." → He said he ___ there.','lived',['lives','is living','has lived'],'Hiện tại đơn → quá khứ đơn; here→there'),
  ()=>mkQ('"Where do you work?" → She asked where I ___.','worked',['work','am working','had worked'],'Câu hỏi Wh- → S + V (trật tự khẳng định)'),
  ()=>mkQ('"I am studying." → He said he ___ studying.','was',['is','were','has been'],'am/is/are + V-ing → was/were + V-ing'),
  ()=>mkQ('"Close the window." → He asked her ___ the window.','to close',['close','closing','not to close'],'Câu mệnh lệnh → asked + O + to V'),
]},
{id:"gr_nouns",em:"📦",name:"Danh Từ",sub:"Đếm được · không đếm được · số nhiều",diff:"easy",
 qs:[
  ()=>mkQ("There are five ___ in my family.","people",["peoples", "person", "persons"],"people là dạng số nhiều của person, không thêm s."),
  ()=>mkQ("She bought three ___ at the market.","tomatoes",["tomatos", "tomatoies", "tomato"],"Danh từ tận cùng phụ âm + o → thêm es."),
  ()=>mkQ("I brush my ___ twice a day.","teeth",["tooths", "tooth", "teeths"],"tooth → teeth, số nhiều bất quy tắc."),
  ()=>mkQ("Can you give me some ___, please?","water",["waters", "a water", "waters of"],"water không đếm được → không thêm s."),
  ()=>mkQ("There are many ___ on the tree.","leaves",["leafs", "leafes", "leave"],"Danh từ tận cùng f → đổi thành ves."),
  ()=>mkQ("My father has two ___.","watches",["watchs", "watchies", "watch"],"Tận cùng ch → thêm es."),
  ()=>mkQ("How many ___ are there in your class?","students",["student", "studentes", "studentss"],"Danh từ đếm được số nhiều → thêm s."),
  ()=>mkQ("We saw three ___ in the field.","sheep",["sheeps", "sheepes", "sheepies"],"sheep giữ nguyên ở dạng số nhiều."),
  ()=>mkQ("He gave me a useful piece of ___.","advice",["advices", "an advice", "advice's"],"advice không đếm được → mượn \"a piece of\"."),
  ()=>mkQ("There is too much ___ in this room.","furniture",["furnitures", "a furniture", "furnitury"],"furniture không đếm được."),
  ()=>mkQ("The ___ about the earthquake was shocking.","news",["new", "newses", "news'"],"news là một danh từ không đếm được, luôn có s."),
  ()=>mkQ("She has a lot of ___ to finish tonight.","homework",["homeworks", "a homework", "homeworkes"],"homework không đếm được."),
  ()=>mkQ("I packed my ___ before the flight.","luggage",["luggages", "a luggage", "luggagies"],"luggage không đếm được."),
  ()=>mkQ("There are two ___ standing at the gate.","women",["womans", "womens", "woman"],"woman → women."),
  ()=>mkQ("He walked ten ___ to school every day.","kilometres",["kilometre", "kilometres'", "kilometreses"],"Danh từ đếm được chỉ đơn vị đo → số nhiều bình thường."),
  ()=>mkQ("We need three ___ of paper for the test.","sheets",["sheet", "sheetes", "sheeties"],"paper không đếm được → mượn đơn vị sheet, ở đây số nhiều."),
  ()=>mkQ("The police ___ looking for the thief at the moment.","are",["is", "was", "has been"],"police luôn được coi là danh từ số nhiều → are."),
  ()=>mkQ("Mathematics ___ my favourite subject.","is",["are", "were", "have been"],"Tên môn học tận cùng -ics chia động từ số ít."),
  ()=>mkQ("The number of tourists ___ increased sharply.","has",["have", "are", "were"],"\"The number of\" → chủ ngữ là number (số ít) → has."),
  ()=>mkQ("A number of students ___ absent today.","are",["is", "has", "was"],"\"A number of + N số nhiều\" → động từ số nhiều."),
  ()=>mkQ("I would like two ___ of coffee, please.","cups",["cup", "coffees", "cupes"],"coffee ở đây là chất lỏng → mượn đơn vị cup, số nhiều cups."),
  ()=>mkQ("There is little ___ left in the jar.","sugar",["sugars", "a sugar", "sugares"],"little + danh từ không đếm được; sugar không thêm s."),
  ()=>mkQ("My ___ are too small for these shoes.","feet",["foots", "foot", "feets"],"foot → feet."),
  ()=>mkQ("All the ___ in the laboratory was damaged.","equipment",["equipments", "equipmentes", "an equipment"],"equipment không đếm được → động từ cũng chia số ít (was)."),
  ()=>mkQ("The scissors ___ on the table.","are",["is", "was", "has been"],"Vật gồm hai phần (scissors, trousers, glasses) luôn chia số nhiều."),
  ()=>mkQ("Ten thousand dollars ___ a large sum for them.","is",["are", "were", "have been"],"Số tiền/khoảng cách/thời gian coi là một khối → động từ số ít."),
  ()=>mkQ("Neither of the two reports ___ accurate.","is",["are", "were", "have been"],"Neither of + N số nhiều → động từ chia số ít trong văn viết trang trọng."),
  ()=>mkQ("The committee ___ divided on the issue.","are",["is", "was", "has"],"Khi nhấn mạnh các thành viên bất đồng với nhau, danh từ tập hợp chia số nhiều."),
  ()=>mkQ("He gave us several ___ of valuable information.","pieces",["piece", "informations", "peices"],"information không đếm được → đếm bằng pieces (số nhiều sau several)."),
  ()=>mkQ("Physics ___ considered a difficult subject by many students.","is",["are", "were", "have been"],"Physics là tên môn học → động từ số ít."),
  ()=>mkQ("The Vietnamese ___ famous for their hospitality.","are",["is", "was", "has been"],"\"The + tính từ chỉ dân tộc\" chỉ toàn bộ dân tộc → động từ số nhiều."),
  ()=>mkQ("Two-thirds of the land ___ been flooded.","has",["have", "are", "were"],"Phân số + danh từ không đếm được (land) → động từ số ít.")
 ]},
{id:"gr_adjadv",em:"🎨",name:"Tính Từ & Trạng Từ",sub:"Vị trí · trật tự · cách tạo trạng từ",diff:"medium",
 qs:[
  ()=>mkQ("She sings very ___.","beautifully",["beautiful", "beauty", "beautify"],"Bổ nghĩa cho động từ sings → trạng từ."),
  ()=>mkQ("He is a ___ student.","good",["well", "goodly", "best"],"Trước danh từ student → tính từ good."),
  ()=>mkQ("The children played ___ in the garden.","happily",["happy", "happyly", "happiness"],"Bổ nghĩa cho động từ played → trạng từ; happy → happily."),
  ()=>mkQ("This cake smells ___.","nice",["nicely", "nicer", "nicest"],"Sau động từ giác quan smell → tính từ."),
  ()=>mkQ("Please drive ___ on this road.","carefully",["careful", "care", "careless"],"Bổ nghĩa cho động từ drive → trạng từ."),
  ()=>mkQ("My brother runs very ___.","fast",["fastly", "faster", "fastest"],"fast là trạng từ bất quy tắc, không thêm -ly."),
  ()=>mkQ("She looks ___ today.","tired",["tiredly", "tiring", "tire"],"Sau look mang nghĩa \"trông có vẻ\" → tính từ."),
  ()=>mkQ("He speaks English ___.","well",["good", "goodly", "best"],"Bổ nghĩa cho động từ speaks → trạng từ của good là well."),
  ()=>mkQ("She is a ___ driver; she has never had an accident.","careful",["carefully", "care", "carefulness"],"Trước danh từ driver → tính từ."),
  ()=>mkQ("They arrived ___ for the meeting.","late",["lately", "later", "latest"],"late = muộn; lately = gần đây, sai nghĩa ở đây."),
  ()=>mkQ("I have ___ seen him these days.","hardly",["hard", "harder", "hardest"],"hardly = hầu như không, hợp với nghĩa câu."),
  ()=>mkQ("It was a ___ long journey.","terribly",["terrible", "terror", "terrify"],"Bổ nghĩa cho tính từ long → dùng trạng từ terribly."),
  ()=>mkQ("He gave me a ___ answer.","polite",["politely", "politeness", "impolitely"],"Trước danh từ answer → tính từ."),
  ()=>mkQ("She dances as ___ as a professional.","gracefully",["graceful", "grace", "gracefulness"],"as + trạng từ + as vì bổ nghĩa cho động từ dances."),
  ()=>mkQ("The test was ___ difficult for us.","too",["so", "such", "very much"],"too + tính từ = quá đến mức không làm được."),
  ()=>mkQ("This is an ___ old Vietnamese painting.","interesting",["interestingly", "interest", "interested"],"Đứng trong chuỗi tính từ bổ nghĩa cho painting → tính từ opinion đứng đầu."),
  ()=>mkQ("She bought a ___ handbag.","small black leather",["leather black small", "black leather small", "small leather black"],"Trật tự OSASCOMP: Size - Colour - Material."),
  ()=>mkQ("He was ___ to answer all the questions.","clever enough",["enough clever", "too clever", "clever too"],"enough đứng SAU tính từ: adj + enough + to V."),
  ()=>mkQ("The film was so ___ that I fell asleep.","boring",["bored", "bore", "boredom"],"Mô tả tính chất của bộ phim → đuôi -ing."),
  ()=>mkQ("I was ___ with the result of the exam.","disappointed",["disappointing", "disappoint", "disappointment"],"Cảm xúc của người → đuôi -ed."),
  ()=>mkQ("___ had he left when the phone rang.","Hardly",["Hard", "Hardly ever", "Almost"],"Cấu trúc đảo ngữ: Hardly + had + S + V3 ... when + QK đơn."),
  ()=>mkQ("The higher we climbed, the ___ it became.","colder",["cold", "coldest", "more cold"],"So sánh kép: The + comparative, the + comparative."),
  ()=>mkQ("He is ___ the best student in this class.","easily",["easy", "ease", "easiness"],"easily ở đây nghĩa \"rõ ràng, chắc chắn\", bổ nghĩa cho cụm the best."),
  ()=>mkQ("She works ___ than her colleagues.","harder",["hardlier", "more hard", "hardest"],"hard → harder, không dùng more hard."),
  ()=>mkQ("Seldom ___ such a beautiful sunset.","have I seen",["I have seen", "did I saw", "I saw"],"Trạng từ phủ định Seldom đầu câu → đảo trợ động từ lên trước chủ ngữ."),
  ()=>mkQ("The project proved ___ more complex than expected.","far",["very", "too", "so"],"far/much/a lot dùng để nhấn mạnh so sánh hơn; very không dùng được."),
  ()=>mkQ("He spoke ___ enough for everyone to hear.","loudly",["loud", "louder", "loudest"],"Bổ nghĩa cho động từ spoke → trạng từ, rồi mới tới enough."),
  ()=>mkQ("It is ___ a difficult problem that nobody can solve it.","such",["so", "too", "very"],"such + a/an + adj + N + that; so chỉ đi trực tiếp với tính từ."),
  ()=>mkQ("Only after the meeting ___ the truth.","did we learn",["we learned", "we did learn", "learned we"],"\"Only + cụm trạng ngữ\" đầu câu → đảo ngữ với trợ động từ did."),
  ()=>mkQ("The more carefully you read, the ___ mistakes you will make.","fewer",["less", "fewest", "least"],"mistakes đếm được → dùng fewer, không dùng less."),
  ()=>mkQ("She is by far ___ candidate for the job.","the most suitable",["more suitable", "most suitable", "the more suitable"],"by far + so sánh nhất, bắt buộc có \"the\"."),
  ()=>mkQ("Not until he apologised ___ to speak to him again.","did she agree",["she agreed", "she did agree", "agreed she"],"\"Not until ...\" đứng đầu câu → mệnh đề chính đảo ngữ.")
 ]},
{id:"gr_questions",em:"❓",name:"Câu Hỏi",sub:"Yes-No · Wh- · hỏi chủ ngữ · gián tiếp",diff:"easy",
 qs:[
  ()=>mkQ("___ do you go to school? — By bike.","How",["What", "Where", "Who"],"Hỏi phương tiện → How."),
  ()=>mkQ("___ is your birthday? — On the fifth of May.","When",["Where", "What", "Which"],"Hỏi thời gian → When."),
  ()=>mkQ("___ are you from? — I am from Hue.","Where",["When", "What", "Who"],"Hỏi nơi chốn → Where."),
  ()=>mkQ("___ you like coffee?","Do",["Are", "Is", "Does"],"Chủ ngữ you, động từ thường → trợ động từ Do."),
  ()=>mkQ("___ books do you have? — About twenty.","How many",["How much", "How long", "How often"],"books đếm được → How many."),
  ()=>mkQ("___ is that girl? — She is my cousin.","Who",["What", "Whose", "Which"],"Hỏi người là ai → Who."),
  ()=>mkQ("___ does your mother work? — In a hospital.","Where",["When", "Why", "How"],"Hỏi nơi làm việc → Where."),
  ()=>mkQ("___ old are you?","How",["What", "Which", "Who"],"Hỏi tuổi → How old."),
  ()=>mkQ("___ broke the window yesterday?","Who",["Who did", "Whom did", "Who does"],"Hỏi chủ ngữ → không dùng trợ động từ, không đảo."),
  ()=>mkQ("___ did you meet at the party?","Who",["Who was", "Whose", "Which"],"Hỏi tân ngữ → có did, chủ ngữ you đứng sau."),
  ()=>mkQ("___ water do you drink every day?","How much",["How many", "How long", "How often"],"water không đếm được → How much."),
  ()=>mkQ("___ do you go swimming? — Twice a week.","How often",["How long", "How much", "How far"],"Hỏi mức độ thường xuyên → How often."),
  ()=>mkQ("___ is it from here to the beach?","How far",["How long", "How much", "How many"],"Hỏi khoảng cách → How far."),
  ()=>mkQ("Where ___ he go last Sunday?","did",["does", "was", "has"],"last Sunday → quá khứ, động từ thường → did."),
  ()=>mkQ("___ T-shirt do you prefer, the red one or the blue one?","Which",["What", "Who", "Whose"],"Lựa chọn có giới hạn (hai cái) → Which."),
  ()=>mkQ("___ were you late for class?","Why",["What", "When", "How"],"Hỏi lý do → Why."),
  ()=>mkQ("Can you tell me where ___?","the post office is",["is the post office", "does the post office", "is the post office located at"],"Câu hỏi gián tiếp → giữ trật tự chủ ngữ + động từ."),
  ()=>mkQ("I wonder if ___ the meeting tomorrow.","she will attend",["will she attend", "does she attend", "will attend she"],"Sau I wonder if → trật tự câu kể, không đảo."),
  ()=>mkQ("___ happened to your car?","What",["What did", "What was", "Which did"],"What làm chủ ngữ → không dùng trợ động từ."),
  ()=>mkQ("Do you know ___ he arrived yesterday?","what time",["what time did", "when did", "at what time did"],"Câu hỏi gián tiếp → bỏ trợ động từ did."),
  ()=>mkQ("___ of these two books is more interesting?","Which",["What", "Who", "Whose"],"Chọn giữa hai → Which + of."),
  ()=>mkQ("___ does it take you to get to school?","How long",["How far", "How much", "How often"],"Hỏi thời gian cần để làm gì → How long does it take."),
  ()=>mkQ("To ___ should I address this letter?","whom",["who", "whose", "which"],"Sau giới từ To → dùng whom trong văn trang trọng."),
  ()=>mkQ("___ was the film like? — It was fantastic.","What",["How", "Which", "Why"],"Hỏi đặc điểm, cảm nhận → What ... like."),
  ()=>mkQ("You have met him before, ___?","haven't you",["have you", "didn't you", "don't you"],"Câu hỏi đuôi: mệnh đề khẳng định với have (HTHT) → đuôi phủ định haven't you."),
  ()=>mkQ("___ do you think will win the match?","Who",["Whom", "Who do", "Whose"],"\"do you think\" xen vào giữa, Who vẫn làm chủ ngữ của will win."),
  ()=>mkQ("I would like to know ___ the project by Friday.","whether they can finish",["can they finish", "whether can they finish", "if can they finish"],"Câu hỏi gián tiếp sau know → whether + S + V."),
  ()=>mkQ("Never before ___ such a beautiful city.","have I visited",["I have visited", "did I visited", "I visited"],"\"Never before\" đầu câu → đảo trợ động từ lên trước chủ ngữ."),
  ()=>mkQ("___ is it that you are looking for?","What",["Which", "Who", "Whose"],"Cấu trúc nhấn mạnh câu hỏi: What is it that + S + V."),
  ()=>mkQ("He asked me ___ I had finished the report.","if",["that", "what", "whether or no"],"Tường thuật câu hỏi Yes/No → dùng if hoặc whether."),
  ()=>mkQ("___ of the applicants has the best qualifications?","Which",["What", "Who", "Whom"],"Chọn trong một nhóm xác định (the applicants) → Which."),
  ()=>mkQ("Hardly ever ___ to the cinema these days.","do we go",["we go", "go we", "we do go"],"\"Hardly ever\" đầu câu → đảo ngữ với trợ động từ do.")
 ]},
{id:"gr_there",em:"🏠",name:"There Is - There Are & It",sub:"Cấu trúc tồn tại · it giả chủ ngữ",diff:"easy",
 qs:[
  ()=>mkQ("___ a book on the table.","There is",["There are", "It is", "They are"],"a book số ít → There is."),
  ()=>mkQ("___ four seasons in a year.","There are",["There is", "It is", "It has"],"four seasons số nhiều → There are."),
  ()=>mkQ("___ is cold today.","It",["There", "They", "That"],"Nói về thời tiết → It."),
  ()=>mkQ("___ any milk in the fridge?","Is there",["Are there", "Is it", "Has there"],"milk không đếm được → Is there."),
  ()=>mkQ("___ is half past six now.","It",["There", "This", "They"],"Nói về giờ giấc → It."),
  ()=>mkQ("There ___ two cats in the garden.","are",["is", "was", "has"],"two cats số nhiều, hiện tại → are."),
  ()=>mkQ("___ five kilometres from my house to the market.","It is",["There is", "There are", "It has"],"Nói về khoảng cách → It is."),
  ()=>mkQ("There ___ not any sugar left.","is",["are", "were", "have"],"sugar không đếm được → is."),
  ()=>mkQ("There ___ a lot of people at the concert last night.","were",["was", "are", "is"],"people số nhiều + last night → were."),
  ()=>mkQ("___ takes me an hour to finish my homework.","It",["There", "This", "That"],"Cấu trúc It takes + thời gian + to V."),
  ()=>mkQ("There ___ a heavy rain yesterday afternoon.","was",["were", "is", "are"],"a heavy rain số ít + yesterday → was."),
  ()=>mkQ("There ___ a meeting tomorrow morning.","will be",["will have", "is going", "will been"],"Tương lai sau There → will be."),
  ()=>mkQ("___ is dangerous to swim in this river.","It",["There", "That", "This"],"It giả chủ ngữ thay cho \"to swim in this river\"."),
  ()=>mkQ("There ___ a pen and two notebooks in my bag.","is",["are", "were", "have"],"Khi liệt kê, động từ chia theo danh từ đầu tiên (a pen)."),
  ()=>mkQ("How many chairs ___ in the room?","are there",["there are", "is there", "there is"],"Câu hỏi → đảo: are there."),
  ()=>mkQ("___ seems that he has forgotten our appointment.","It",["There", "This", "He"],"It seems that + mệnh đề."),
  ()=>mkQ("There ___ been several accidents on this road.","have",["has", "was", "is"],"several accidents số nhiều + hoàn thành → have been."),
  ()=>mkQ("There ___ to be a bookshop on this corner.","used",["use", "using", "uses"],"There used to be = trước đây từng có."),
  ()=>mkQ("___ is no use crying over spilt milk.","It",["There", "That", "This"],"Thành ngữ: It is no use + V-ing."),
  ()=>mkQ("There ___ to be a solution to this problem.","seems",["seem", "is seeming", "seemed to"],"a solution số ít → seems."),
  ()=>mkQ("___ was not until midnight that he came home.","It",["There", "That", "This"],"Cấu trúc nhấn mạnh: It was not until ... that ..."),
  ()=>mkQ("There ___ little hope of finding the missing boy.","is",["are", "were", "have"],"hope không đếm được → is."),
  ()=>mkQ("___ is said that he is the richest man in town.","It",["There", "They", "People"],"It is said that + mệnh đề (bị động với động từ tường thuật)."),
  ()=>mkQ("There ___ hardly any water left in the tank.","is",["are", "were", "have been"],"water không đếm được → is."),
  ()=>mkQ("There ___ no point in arguing with him.","is",["are", "was being", "has"],"Thành ngữ: There is no point in + V-ing."),
  ()=>mkQ("___ appears to have been a misunderstanding.","There",["It", "That", "This"],"There + appear/seem + to have been = dường như đã có."),
  ()=>mkQ("___ is high time we left for the airport.","It",["There", "That", "This"],"Thành ngữ: It is high time + S + V quá khứ."),
  ()=>mkQ("There being no bus, ___ to walk home.","we had",["we have", "there had", "it had"],"Mệnh đề phân từ \"There being no bus\" làm trạng ngữ lý do, mệnh đề chính có chủ ngữ riêng."),
  ()=>mkQ("___ was reported that the typhoon had caused heavy damage.","It",["There", "They", "That"],"It was reported that + mệnh đề."),
  ()=>mkQ("There ___ to be no way out of this situation.","appears",["appear", "is appearing", "appeared to"],"no way số ít → appears."),
  ()=>mkQ("___ takes a great deal of patience to teach young children.","It",["There", "This", "That"],"It takes + danh từ chỉ phẩm chất + to V."),
  ()=>mkQ("Were there ___ problems during the installation?","any",["some", "much", "a"],"Câu hỏi với danh từ đếm được số nhiều → any.")
 ]},
{id:"gr_advclause",em:"🔗",name:"Mệnh Đề Trạng Ngữ",sub:"Thời gian · lý do · mục đích · nhượng bộ",diff:"medium",
 qs:[
  ()=>mkQ("___ it was late, we went home.","Because",["Despite", "Because of", "In spite of"],"Theo sau là mệnh đề it was late → dùng Because."),
  ()=>mkQ("We stayed inside ___ the heavy rain.","because of",["because", "although", "though"],"Theo sau là cụm danh từ the heavy rain → because of."),
  ()=>mkQ("___ he is young, he is very responsible.","Although",["Despite", "Because of", "So"],"Hai vế trái nghĩa, theo sau là mệnh đề → Although."),
  ()=>mkQ("I will wait here ___ you come back.","until",["while", "because", "so that"],"Chờ cho tới khi ai đó quay lại → until."),
  ()=>mkQ("___ I was cooking, the phone rang.","While",["Because", "Although", "So that"],"Hai hành động, một cái xen ngang → While."),
  ()=>mkQ("He went to bed early ___ he was tired.","because",["so that", "although", "despite"],"Chỉ lý do, theo sau là mệnh đề → because."),
  ()=>mkQ("Turn off the lights ___ you leave the room.","when",["so that", "because of", "although"],"Chỉ thời điểm → when."),
  ()=>mkQ("She was ___ tired that she fell asleep immediately.","so",["such", "such a", "very"],"so + tính từ + that."),
  ()=>mkQ("___ his illness, he still came to class.","In spite of",["Although", "Because", "Even though"],"Theo sau là cụm danh từ his illness → In spite of."),
  ()=>mkQ("It was ___ an interesting book that I read it twice.","such",["so", "very", "too"],"such + a/an + adj + N + that."),
  ()=>mkQ("He saved money ___ he could buy a new laptop.","so that",["so", "such that", "because"],"Chỉ mục đích, có could → so that."),
  ()=>mkQ("___ we had finished dinner, we watched a film.","After",["Until", "While", "Because of"],"Hành động xảy ra trước → After."),
  ()=>mkQ("I have known her ___ we were children.","since",["for", "when", "until"],"since + mốc thời gian/mệnh đề quá khứ."),
  ()=>mkQ("___ the bad weather, the flight was cancelled.","Owing to",["Although", "Because", "Even though"],"Theo sau là cụm danh từ → Owing to."),
  ()=>mkQ("She kept working ___ she was exhausted.","even though",["despite", "in spite of", "because of"],"Theo sau là mệnh đề she was exhausted → even though."),
  ()=>mkQ("Wait here ___ I get back.","until",["during", "so that", "because of"],"until + mệnh đề chỉ thời điểm kết thúc."),
  ()=>mkQ("___ that you have finished school, what will you do?","Now",["Although", "Despite", "So"],"Now that = bởi vì bây giờ, chỉ lý do."),
  ()=>mkQ("He speaks English well ___ he has never been abroad.","although",["despite", "because of", "so that"],"Ý trái ngược, theo sau là mệnh đề → although."),
  ()=>mkQ("___ being very tired, she finished the report.","Despite",["Although", "Because", "Even though"],"Despite + V-ing (coi như cụm danh từ)."),
  ()=>mkQ("My sister likes pop music ___ I prefer classical music.","whereas",["because", "so that", "unless"],"whereas dùng để đối chiếu hai vế trái nhau."),
  ()=>mkQ("The test was ___ difficult that few students passed.","so",["such", "such a", "too"],"so + adj + that."),
  ()=>mkQ("He left early ___ to catch the first train.","in order",["so that", "because", "despite"],"in order + to V chỉ mục đích."),
  ()=>mkQ("___ hard he tried, he could not solve the puzzle.","However",["Although", "Despite", "Because"],"However + adj/adv + S + V = dù ... đến đâu."),
  ()=>mkQ("They moved to the countryside ___ the air is fresher.","because",["because of", "despite", "so that"],"Theo sau là mệnh đề the air is fresher → because."),
  ()=>mkQ("___ he may be rich, he is not happy.","Though",["Despite", "Because of", "Owing to"],"Though + mệnh đề; \"may be\" cho thấy đây là mệnh đề đầy đủ."),
  ()=>mkQ("No sooner had he sat down ___ the bell rang.","than",["when", "that", "then"],"Cấu trúc cố định: No sooner ... than ..."),
  ()=>mkQ("___ as he was, he refused to give up.","Tired",["Although tired", "Despite tired", "Because tired"],"Cấu trúc nhượng bộ đảo: Adj + as + S + V."),
  ()=>mkQ("She worked overtime ___ finish the project on time.","so as to",["so that", "in order that", "because of"],"so as to + V nguyên mẫu chỉ mục đích."),
  ()=>mkQ("___ the heavy traffic, we arrived on time.","Notwithstanding",["Although", "Even though", "Because"],"Notwithstanding + cụm danh từ = mặc dù, văn trang trọng."),
  ()=>mkQ("He had scarcely entered the room ___ the lights went out.","when",["than", "that", "then"],"Cấu trúc: had scarcely ... when ..."),
  ()=>mkQ("___ much he earns, he never saves any money.","No matter how",["However that", "Although how", "Despite how"],"No matter how + adv + S + V."),
  ()=>mkQ("The instructions were ___ complicated that nobody could follow them.","so",["such", "such a", "too"],"so + adj + that, dù có \"the instructions\" vì complicated là tính từ đứng một mình.")
 ]},
{id:"gr_nounclause",em:"💬",name:"Mệnh Đề Danh Ngữ",sub:"That · Wh- · if-whether",diff:"hard",
 qs:[
  ()=>mkQ("I think ___ he is a good teacher.","that",["what", "which", "whether"],"Mệnh đề đầy đủ làm tân ngữ của think → that."),
  ()=>mkQ("I do not know ___ she lives.","where",["that", "which", "whether"],"Hỏi nơi chốn → where."),
  ()=>mkQ("___ he said was not true.","What",["That", "Which", "Whether"],"Làm chủ ngữ, nghĩa \"điều mà\" → What."),
  ()=>mkQ("She asked me ___ I liked coffee.","if",["that", "what", "which"],"Tường thuật câu hỏi Yes/No → if."),
  ()=>mkQ("Nobody knows ___ the meeting will start.","when",["that", "what", "which"],"Hỏi thời gian → when."),
  ()=>mkQ("I hope ___ you will come to my party.","that",["what", "whether", "which"],"Mệnh đề đầy đủ sau hope → that."),
  ()=>mkQ("Can you tell me ___ this word means?","what",["that", "which", "whether"],"Hỏi nghĩa → what."),
  ()=>mkQ("I am sure ___ he will pass the exam.","that",["what", "whether", "which"],"be sure + that-clause."),
  ()=>mkQ("Do you know ___?","where he works",["where does he work", "where he does work", "where work he"],"Câu hỏi gián tiếp → trật tự câu kể."),
  ()=>mkQ("___ they need most is money.","What",["That", "Which", "Whether"],"Làm chủ ngữ, nghĩa \"cái mà\" → What."),
  ()=>mkQ("I am not sure about ___ he is coming.","whether",["if", "that", "what"],"Sau giới từ about chỉ dùng whether."),
  ()=>mkQ("He told me ___ he had finished the report.","that",["what", "which", "whether"],"Mệnh đề đầy đủ sau tell sb → that."),
  ()=>mkQ("I wonder ___ the train has left yet.","whether",["that", "what", "which"],"Hỏi liệu có hay không → whether/if; ở đây whether."),
  ()=>mkQ("___ worries me is his health.","What",["That", "Which", "It"],"Làm chủ ngữ, nghĩa \"điều làm tôi lo\" → What."),
  ()=>mkQ("She explained ___ the machine worked.","how",["what", "that", "which"],"Hỏi cách thức → how."),
  ()=>mkQ("Please tell me ___ you prefer, tea or coffee.","which",["what", "that", "whether"],"Chọn giữa hai thứ xác định → which."),
  ()=>mkQ("___ he will accept the job remains unclear.","Whether",["If", "That what", "What if"],"Mệnh đề làm chủ ngữ đầu câu → dùng Whether, không dùng If."),
  ()=>mkQ("What they decided ___ a surprise to us all.","was",["were", "are", "have been"],"Mệnh đề danh ngữ làm chủ ngữ → động từ chia số ít."),
  ()=>mkQ("It is surprising ___ he passed the test so easily.","that",["what", "whether", "which"],"It giả chủ ngữ + that-clause thật."),
  ()=>mkQ("I have no idea ___ she is so angry.","why",["that", "what", "which"],"Hỏi lý do → why."),
  ()=>mkQ("The question is ___ we can afford it.","whether",["that", "what", "which"],"Bổ ngữ sau be, nghĩa \"liệu có\" → whether."),
  ()=>mkQ("He insisted ___ the report be submitted by Friday.","that",["what", "whether", "which"],"insist that + S + V nguyên mẫu (thức giả định)."),
  ()=>mkQ("___ the money came from is still a mystery.","Where",["That", "What", "Whether"],"Làm chủ ngữ, hỏi nguồn gốc → Where."),
  ()=>mkQ("She was worried about ___ her son had arrived safely.","whether",["if", "that", "what"],"Sau giới từ about → whether."),
  ()=>mkQ("___ causes the disease is not yet known.","What",["That", "Which", "Whether"],"Làm chủ ngữ và đồng thời là chủ ngữ của causes → What."),
  ()=>mkQ("The fact ___ he lied shocked everyone.","that",["what", "which", "whether"],"the fact + that-clause đồng vị ngữ, không dùng which."),
  ()=>mkQ("It was suggested ___ the meeting be postponed.","that",["what", "whether", "which"],"Thức giả định bị động: It was suggested that + S + be + V3."),
  ()=>mkQ("___ he comes or not makes no difference.","Whether",["If", "That", "What"],"Cấu trúc whether ... or not làm chủ ngữ."),
  ()=>mkQ("I do not doubt ___ he is capable of doing it.","that",["what", "whether", "which"],"Câu khẳng định với doubt phủ định → dùng that."),
  ()=>mkQ("___ matters most is how you treat other people.","What",["That", "Which", "Whether"],"What + V làm chủ ngữ, theo sau là is."),
  ()=>mkQ("He gave no explanation as to ___ he had been absent.","why",["that", "what", "whether"],"as to + từ để hỏi, ở đây hỏi lý do → why."),
  ()=>mkQ("That he survived the crash ___ a miracle.","is",["are", "were", "have been"],"That-clause làm chủ ngữ → động từ chia số ít.")
 ]},
{id:"gr_inversion",em:"🔄",name:"Đảo Ngữ",sub:"Never · Not until · No sooner · bỏ If",diff:"advanced",
 qs:[
  ()=>mkQ("Never ___ such a delicious meal.","have I eaten",["I have eaten", "did I ate", "I ate"],"Never đầu câu → đảo have lên trước I."),
  ()=>mkQ("Seldom ___ to the cinema.","does he go",["he goes", "he does go", "goes he"],"Seldom + does + S + V nguyên mẫu."),
  ()=>mkQ("Rarely ___ late for school.","is she",["she is", "does she is", "she does be"],"Có động từ be → đưa be lên trước chủ ngữ."),
  ()=>mkQ("Hardly ever ___ television.","do they watch",["they watch", "they do watch", "watch they"],"Hardly ever + do + S + V."),
  ()=>mkQ("Never ___ him before.","had I met",["I had met", "did I met", "I met"],"Never + had + S + V3."),
  ()=>mkQ("Little ___ that he was lying.","did I know",["I knew", "I did know", "knew I"],"Little mang nghĩa phủ định → đảo với did."),
  ()=>mkQ("Not only ___ English but she also speaks French.","does she speak",["she speaks", "she does speak", "speaks she"],"Not only đầu câu → đảo với does."),
  ()=>mkQ("Seldom ___ such kindness.","have we seen",["we have seen", "did we saw", "we saw"],"Seldom + have + S + V3."),
  ()=>mkQ("Not until midnight ___ home.","did he come",["he came", "he did come", "came he"],"Not until + mốc thời gian → mệnh đề chính đảo với did."),
  ()=>mkQ("Only when it rained ___ the match.","did they cancel",["they cancelled", "they did cancel", "cancelled they"],"Mệnh đề \"it rained\" giữ nguyên, mệnh đề chính đảo."),
  ()=>mkQ("No sooner had the bell rung ___ the students ran out.","than",["when", "that", "then"],"Cấu trúc cố định No sooner ... than."),
  ()=>mkQ("Hardly had she sat down ___ the doorbell rang.","when",["than", "that", "then"],"Cấu trúc Hardly ... when."),
  ()=>mkQ("So tired ___ that he fell asleep at once.","was he",["he was", "did he", "he did be"],"So + adj + be + S + that."),
  ()=>mkQ("Only after the exam ___ relaxed.","did we feel",["we felt", "we did feel", "felt we"],"Only after + cụm danh từ → mệnh đề chính đảo."),
  ()=>mkQ("Were I rich, ___ around the world.","I would travel",["I will travel", "would I travel", "I travelled"],"Mệnh đề chính của câu điều kiện loại 2 giữ trật tự bình thường."),
  ()=>mkQ("Not a single word ___ during the meeting.","did he say",["he said", "he did say", "said he"],"Cụm phủ định \"Not a single word\" đầu câu → đảo."),
  ()=>mkQ("Had I known about the traffic, ___ earlier.","I would have left",["I would leave", "would I have left", "I had left"],"Câu điều kiện loại 3 bỏ If → Had + S + V3; mệnh đề chính không đảo."),
  ()=>mkQ("Should you need any help, ___ me.","call",["you call", "do you call", "will you call"],"Should + S + V = If + S + should V; mệnh đề chính là câu mệnh lệnh."),
  ()=>mkQ("Such ___ his anger that he slammed the door.","was",["is", "did", "had"],"Such + be + S + that."),
  ()=>mkQ("In no circumstances ___ to leave the room.","are you allowed",["you are allowed", "do you allowed", "you do allow"],"Cụm phủ định + be → đưa be lên trước chủ ngữ."),
  ()=>mkQ("Only by working hard ___ succeed.","can you",["you can", "do you can", "you do"],"Only by + V-ing → đảo động từ khuyết thiếu can."),
  ()=>mkQ("Scarcely ___ the house when it began to rain.","had we left",["we had left", "did we leave", "we left"],"Scarcely + had + S + V3 ... when."),
  ()=>mkQ("At no time ___ aware of the danger.","was he",["he was", "did he", "he did be"],"At no time mang nghĩa phủ định → đảo be."),
  ()=>mkQ("Not only did he win the race, ___ he broke the record.","but",["and", "so", "or"],"Cấu trúc Not only ... but also."),
  ()=>mkQ("Under no circumstances ___ this document to anyone.","should you show",["you should show", "do you show", "you do show"],"Cụm phủ định + động từ khuyết thiếu should → đảo should lên trước."),
  ()=>mkQ("So rapidly ___ that few people can keep up.","is technology advancing",["technology is advancing", "does technology advance", "technology does advance"],"So + trạng từ + trợ động từ is + S + V-ing."),
  ()=>mkQ("Only after he had left ___ what he really meant.","did I realise",["I realised", "I did realise", "realised I"],"Mệnh đề \"he had left\" giữ nguyên; mệnh đề chính đảo với did."),
  ()=>mkQ("Were it not for your help, ___ this project.","I could not have finished",["could I not have finished", "I can not finish", "I had not finished"],"Were it not for = If it were not for; mệnh đề chính không đảo."),
  ()=>mkQ("Nowhere in the world ___ such a strange custom.","will you find",["you will find", "do you will find", "find you will"],"Cụm trạng ngữ phủ định Nowhere → đảo will."),
  ()=>mkQ("On no account ___ the machine unattended.","must you leave",["you must leave", "do you must leave", "must leave you"],"On no account + must + S + V."),
  ()=>mkQ("Not until she read the letter ___ the truth.","did she learn",["she learned", "she did learn", "learned she"],"Not until + mệnh đề → mệnh đề chính đảo."),
  ()=>mkQ("Had it not been for the rain, ___ the match.","we would have won",["would we have won", "we had won", "we would win"],"Điều kiện loại 3 đảo; mệnh đề chính giữ trật tự thường.")
 ]},
{id:"gr_usedto",em:"⏳",name:"Used To & Be Used To",sub:"Thói quen quá khứ · quen với việc gì",diff:"medium",
 qs:[
  ()=>mkQ("I ___ go swimming every weekend when I was young.","used to",["am used to", "get used to", "use to"],"Thói quen quá khứ → used to + V."),
  ()=>mkQ("She is used to ___ up early.","getting",["get", "got", "gets"],"be used to + V-ing."),
  ()=>mkQ("There ___ be a cinema here.","used to",["use to", "is used to", "gets used to"],"There used to be = trước đây từng có."),
  ()=>mkQ("He ___ smoke, but he quit last year.","used to",["is used to", "uses to", "was used to"],"Thói quen đã chấm dứt → used to."),
  ()=>mkQ("I am used to ___ in a big city.","living",["live", "lived", "lives"],"be used to + V-ing."),
  ()=>mkQ("Did you ___ have long hair?","use to",["used to", "using to", "uses to"],"Sau Did → use to, bỏ d."),
  ()=>mkQ("My father ___ to drink coffee every morning.","used",["use", "using", "uses"],"Thói quen quá khứ → used to."),
  ()=>mkQ("She is not used to ___ spicy food.","eating",["eat", "ate", "eats"],"be used to + V-ing."),
  ()=>mkQ("I did not ___ to like classical music.","use",["used", "using", "uses"],"Sau did not → use to."),
  ()=>mkQ("After a month, he got used to ___ in the dormitory.","living",["live", "lived", "lives"],"get used to + V-ing."),
  ()=>mkQ("They ___ to the noise of the traffic now.","are used",["used", "use", "were using"],"Hiện tại đã quen → are used to."),
  ()=>mkQ("When I was a child, I ___ climb trees.","would",["am used to", "was used to", "get used to"],"Hành động lặp lại trong quá khứ → would thay được used to."),
  ()=>mkQ("It took her a while to get used to ___ on the left.","driving",["drive", "drove", "drives"],"get used to + V-ing."),
  ()=>mkQ("This house ___ belong to my grandparents.","used to",["is used to", "was used to", "uses to"],"Trạng thái sở hữu trong quá khứ → used to."),
  ()=>mkQ("Are you used to ___ the new software yet?","using",["use", "used", "uses"],"be used to + V-ing."),
  ()=>mkQ("He ___ be very shy, but now he is confident.","used to",["is used to", "gets used to", "was used to"],"Trạng thái quá khứ nay đã thay đổi → used to."),
  ()=>mkQ("I am slowly ___ used to the cold weather here.","getting",["being", "used", "having"],"Đang dần quen → getting used to."),
  ()=>mkQ("She ___ used to working night shifts, so she never complains.","is",["used", "did", "was used"],"Hiện tại đã quen → is used to."),
  ()=>mkQ("My grandmother ___ tell us stories every evening.","would",["is used to", "gets used to", "would be used to"],"Hành động lặp lại trong quá khứ → would."),
  ()=>mkQ("He could not get used to ___ so far from home.","being",["be", "been", "is"],"get used to + V-ing, ở đây là being."),
  ()=>mkQ("We ___ have a big garden when we lived in the village.","used to",["would", "are used to", "were used to"],"Sở hữu là trạng thái → chỉ dùng used to, không dùng would."),
  ()=>mkQ("It did not take him long to ___ used to the new routine.","get",["be", "being", "used"],"Sau to trong \"take long to\" → động từ nguyên mẫu get."),
  ()=>mkQ("I am not used to ___ treated like that.","being",["be", "been", "am"],"be used to + being + V3 (bị động)."),
  ()=>mkQ("___ you use to walk to school?","Did",["Do", "Were", "Have"],"Nghi vấn của used to → Did + S + use to."),
  ()=>mkQ("By the end of the year, she will ___ used to the climate.","have got",["get", "be getting", "have been"],"Tương lai hoàn thành: will have got used to."),
  ()=>mkQ("He is no longer used to ___ long hours.","working",["work", "worked", "works"],"be used to + V-ing dù có \"no longer\"."),
  ()=>mkQ("Living abroad, I had to get used to ___ by strangers.","being greeted",["greeted", "greet", "be greeted"],"get used to + being + V3 (dạng bị động)."),
  ()=>mkQ("There ___ to be far fewer cars on this street.","used",["use", "is used", "was used"],"There used to be; sau There chỉ dùng used to."),
  ()=>mkQ("She said she ___ used to such rude behaviour.","was not",["did not", "has not", "used not"],"Tường thuật \"I am not used to\" → was not used to."),
  ()=>mkQ("I would rather you ___ used to doing things on your own.","got",["get", "getting", "had got"],"would rather + S + V quá khứ → got."),
  ()=>mkQ("Not until he moved to Hanoi ___ used to the traffic.","did he get",["he got", "he did get", "got he"],"Not until đầu câu → mệnh đề chính đảo ngữ."),
  ()=>mkQ("He used to be a teacher, ___ he?","didn't",["usedn't", "wasn't", "doesn't"],"Câu hỏi đuôi của used to dùng didn't.")
 ]},
{id:"gr_imperative",em:"📣",name:"Câu Mệnh Lệnh & Đề Nghị",sub:"Let's · Why don't we · How about",diff:"easy",
 qs:[
  ()=>mkQ("___ the window, please.","Open",["Opening", "To open", "Opens"],"Câu mệnh lệnh → động từ nguyên mẫu đứng đầu."),
  ()=>mkQ("___ be late for school.","Don't",["Not", "No", "Doesn't"],"Mệnh lệnh phủ định → Don't + V."),
  ()=>mkQ("Let's ___ a cup of tea.","have",["having", "to have", "had"],"Let's + V nguyên mẫu."),
  ()=>mkQ("How about ___ to the beach this weekend?","going",["go", "to go", "went"],"How about + V-ing."),
  ()=>mkQ("Why don't we ___ a film tonight?","watch",["watching", "to watch", "watched"],"Why don't we + V nguyên mẫu."),
  ()=>mkQ("Shall we ___ now?","begin",["beginning", "to begin", "began"],"Shall we + V nguyên mẫu."),
  ()=>mkQ("___ quiet in the library.","Be",["Being", "To be", "Are"],"Mệnh lệnh với động từ be → Be."),
  ()=>mkQ("Would you like ___ with us?","to come",["coming", "come", "came"],"Would you like + to V."),
  ()=>mkQ("What about ___ the museum tomorrow?","visiting",["visit", "to visit", "visited"],"What about + V-ing."),
  ()=>mkQ("Would you mind ___ me a hand?","giving",["give", "to give", "gave"],"Would you mind + V-ing."),
  ()=>mkQ("Let's not ___ about it anymore.","talk",["talking", "to talk", "talked"],"Phủ định của Let's → Let's not + V."),
  ()=>mkQ("I suggest ___ an early train.","taking",["to take", "take", "took"],"suggest + V-ing, không dùng to V."),
  ()=>mkQ("Let's go out tonight, ___?","shall we",["will we", "do we", "don't we"],"Câu hỏi đuôi của Let's là shall we."),
  ()=>mkQ("Open the door, ___?","will you",["shall we", "do you", "don't you"],"Câu hỏi đuôi của câu mệnh lệnh là will you."),
  ()=>mkQ("Why not ___ her the truth?","tell",["telling", "to tell", "told"],"Why not + V nguyên mẫu."),
  ()=>mkQ("___ forget to lock the door.","Don't",["Not", "No", "Doesn't"],"Mệnh lệnh phủ định."),
  ()=>mkQ("He suggested that we ___ the meeting until Monday.","postpone",["postponed", "to postpone", "postponing"],"suggest that + S + V nguyên mẫu (thức giả định)."),
  ()=>mkQ("Would you mind if I ___ the window?","opened",["open", "opening", "to open"],"Would you mind if + S + V quá khứ."),
  ()=>mkQ("\"Would you mind waiting?\" — \"___\"","No, not at all.",["Yes, of course not.", "Yes, I would like.", "No, I would mind."],"Trả lời \"No, not at all\" nghĩa là đồng ý, không phiền."),
  ()=>mkQ("I would rather you ___ smoke in here.","didn't",["don't", "not", "wouldn't"],"would rather + S + didn't + V."),
  ()=>mkQ("It is time we ___ home.","went",["go", "going", "to go"],"It is time + S + V quá khứ."),
  ()=>mkQ("___ we discuss this after lunch?","Shall",["Will", "Do", "Would"],"Đề nghị cùng làm → Shall we."),
  ()=>mkQ("How about we ___ the party on Saturday?","hold",["holding", "to hold", "held"],"Khi How about theo sau là mệnh đề thì dùng động từ chia bình thường."),
  ()=>mkQ("Do you mind ___ me the salt?","passing",["to pass", "pass", "passed"],"Do you mind + V-ing."),
  ()=>mkQ("The doctor recommended that he ___ more exercise.","take",["takes", "took", "taking"],"recommend that + S + V nguyên mẫu (thức giả định)."),
  ()=>mkQ("It was suggested that the rule ___ changed.","be",["was", "is", "were"],"Thức giả định bị động: that + S + be + V3."),
  ()=>mkQ("I insist that she ___ present at the ceremony.","be",["is", "was", "will be"],"insist that + S + be (thức giả định)."),
  ()=>mkQ("Let us not ___ hasty conclusions.","draw",["drawing", "to draw", "drew"],"Let us not + V nguyên mẫu."),
  ()=>mkQ("Would you be so kind as ___ me the document?","to send",["sending", "send", "sent"],"so kind as + to V."),
  ()=>mkQ("He proposed ___ the budget before the deadline.","reviewing",["to review", "review", "reviewed"],"propose + V-ing khi không dùng mệnh đề that."),
  ()=>mkQ("Supposing you ___ the lottery, what would you do?","won",["win", "will win", "have won"],"Supposing + S + V quá khứ, giả định không có thật."),
  ()=>mkQ("You had better ___ late again.","not be",["not to be", "to not be", "be not"],"had better + not + V nguyên mẫu.")
 ]},
{id:"gr_cleft",em:"💡",name:"Câu Chẻ (Nhấn Mạnh)",sub:"It is ... that · What ... is",diff:"advanced",
 qs:[
  ()=>mkQ("___ was Nam who won the first prize.","It",["That", "There", "He"],"Câu chẻ bắt đầu bằng It."),
  ()=>mkQ("It was my sister ___ cooked this meal.","who",["which", "what", "whose"],"Nhấn mạnh người → who."),
  ()=>mkQ("It is this song ___ I like best.","that",["who", "whose", "whom"],"Nhấn mạnh vật → that."),
  ()=>mkQ("___ I want is a cup of coffee.","What",["That", "Which", "It"],"What-cleft làm chủ ngữ."),
  ()=>mkQ("It was in Hue ___ we first met.","that",["who", "what", "whose"],"Nhấn mạnh nơi chốn → that (hoặc where)."),
  ()=>mkQ("All I need ___ your support.","is",["are", "were", "have"],"All-cleft chia động từ số ít."),
  ()=>mkQ("It was last year ___ they moved here.","that",["who", "which one", "what"],"Nhấn mạnh thời gian → that."),
  ()=>mkQ("What she bought ___ a new laptop.","was",["were", "are", "have been"],"What-cleft → động từ số ít was."),
  ()=>mkQ("___ was the heavy rain that caused the flood.","It",["There", "That", "What"],"Câu chẻ nhấn mạnh nguyên nhân."),
  ()=>mkQ("It is my parents ___ always support me.","who",["which", "what", "whose"],"Nhấn mạnh người số nhiều → who."),
  ()=>mkQ("What I dislike ___ his rudeness.","is",["are", "were", "have been"],"What-cleft → động từ số ít."),
  ()=>mkQ("It was the noise ___ woke me up.","that",["who", "what", "whose"],"Nhấn mạnh vật làm chủ ngữ → that."),
  ()=>mkQ("All he did ___ apologise.","was",["were", "is to", "did"],"All ... was + V nguyên mẫu không to."),
  ()=>mkQ("It was because of the storm ___ the flight was delayed.","that",["which", "what", "when"],"Nhấn mạnh cụm lý do → that."),
  ()=>mkQ("What they need most ___ more time.","is",["are", "were", "have"],"What-cleft → is."),
  ()=>mkQ("It is not the money ___ matters, but the gesture.","that",["which it", "what", "who"],"Nhấn mạnh chủ ngữ là vật → that."),
  ()=>mkQ("It was not until he left ___ I realised the truth.","that",["when", "then", "which"],"Cấu trúc It was not until ... that ..."),
  ()=>mkQ("What he said ___ everyone in the room.","shocked",["shock", "were shocking", "have shocked"],"What-clause làm chủ ngữ → động từ số ít, quá khứ shocked."),
  ()=>mkQ("It is the students ___ suffer most from this policy.","who",["whom", "which", "what"],"Nhấn mạnh người làm chủ ngữ → who."),
  ()=>mkQ("All that is needed ___ a little patience.","is",["are", "were", "have been"],"All that ... → động từ số ít."),
  ()=>mkQ("It was to his mother ___ he told the secret.","that",["who", "whom", "which"],"Nhấn mạnh cụm giới từ → that."),
  ()=>mkQ("What surprised me ___ how calm she remained.","was",["were", "are", "have been"],"What-cleft → was."),
  ()=>mkQ("It was only after the exam ___ he relaxed.","that",["when", "then", "which"],"It was only after ... that ..."),
  ()=>mkQ("The thing ___ worries me is the deadline.","that",["what", "who", "whose"],"Sau danh từ the thing → mệnh đề quan hệ với that."),
  ()=>mkQ("It is the quality of teaching, not the facilities, ___ makes a good school.","that",["which it", "what", "who"],"Nhấn mạnh chủ ngữ, dù có cụm xen giữa vẫn dùng that."),
  ()=>mkQ("What the committee decided ___ never announced publicly.","was",["were", "are", "have been"],"What-clause làm chủ ngữ → động từ số ít, bị động was announced."),
  ()=>mkQ("It was not I ___ started the argument.","who",["whom", "which", "that it"],"Nhấn mạnh chủ ngữ là người → who; sau be dùng đại từ chủ ngữ I."),
  ()=>mkQ("All you have to do ___ sign here.","is",["is to signing", "are", "were"],"All ... is + V nguyên mẫu không to."),
  ()=>mkQ("It is precisely this attitude ___ I find unacceptable.","that",["which it", "what", "who"],"Nhấn mạnh tân ngữ → that."),
  ()=>mkQ("What matters in the end ___ the results.","is",["are", "were", "have been"],"What-clause làm chủ ngữ → động từ số ít, dù bổ ngữ số nhiều."),
  ()=>mkQ("It was with great reluctance ___ she accepted the offer.","that",["which", "when", "who"],"Nhấn mạnh cụm trạng ngữ cách thức → that."),
  ()=>mkQ("Rarely is it the teacher ___ is to blame.","who",["whom", "which", "what"],"Câu chẻ lồng trong đảo ngữ; nhấn mạnh người → who.")
 ]},
{id:"gr_sosuch",em:"⚖️",name:"So · Such · Too · Enough",sub:"Bốn cấu trúc chỉ mức độ",diff:"medium",
 qs:[
  ()=>mkQ("The film was ___ boring that I left early.","so",["such", "too", "very"],"so + tính từ đứng một mình + that."),
  ()=>mkQ("It was ___ a hot day that we stayed inside.","such",["so", "too", "very"],"such + a + adj + danh từ + that."),
  ()=>mkQ("He is ___ tired to continue working.","too",["so", "such", "enough"],"too + adj + to V, nghĩa không thể làm được."),
  ()=>mkQ("She is tall ___ to reach the shelf.","enough",["too", "so", "such"],"adj + enough + to V."),
  ()=>mkQ("We have ___ time to finish the test.","enough",["too", "so", "such"],"enough đứng trước danh từ time."),
  ()=>mkQ("The coffee is ___ hot to drink.","too",["so", "such", "enough"],"too + adj + to V."),
  ()=>mkQ("There were ___ many students in the hall.","so",["such", "too much", "enough"],"so many + danh từ đếm được số nhiều."),
  ()=>mkQ("He speaks ___ quickly that I cannot follow.","so",["such", "too", "enough"],"so + trạng từ + that."),
  ()=>mkQ("It was ___ an interesting lecture that nobody left.","such",["so", "too", "very much"],"such + a/an + adj + N + that."),
  ()=>mkQ("The test was not easy ___ for us to pass.","enough",["too", "so", "such"],"adj + enough + for sb + to V."),
  ()=>mkQ("She had ___ little money that she could not buy food.","so",["such", "too", "enough"],"so + little (từ chỉ lượng) + that."),
  ()=>mkQ("He was ___ weak to carry the suitcase.","too",["so", "such", "enough"],"too + adj + to V."),
  ()=>mkQ("There is not ___ sugar in my tea.","enough",["too", "so", "such"],"enough + danh từ không đếm được."),
  ()=>mkQ("They were ___ good players that they won easily.","such",["so", "too", "very"],"such + adj + danh từ số nhiều (không có a) + that."),
  ()=>mkQ("The room was ___ small for ten people.","too",["so", "such", "enough"],"too + adj + for sb, nghĩa quá nhỏ."),
  ()=>mkQ("He did not run fast ___ to catch the bus.","enough",["too", "so", "such"],"trạng từ + enough + to V."),
  ()=>mkQ("It was ___ bad weather that the match was cancelled.","such",["so", "too", "very"],"weather không đếm được → such + adj + N, không có a."),
  ()=>mkQ("She was ___ exhausted that she fell asleep at her desk.","so",["such", "too", "enough"],"so + tính từ đứng một mình + that."),
  ()=>mkQ("He is too stubborn ___ to anyone.","to listen",["listening", "listen", "for listening"],"too + adj + to V nguyên mẫu."),
  ()=>mkQ("There was ___ much noise that we had to leave.","so",["such", "too", "enough"],"so much + danh từ không đếm được + that."),
  ()=>mkQ("The problem is ___ complicated for a beginner to solve.","too",["so", "such", "enough"],"too + adj + for sb + to V."),
  ()=>mkQ("He is not experienced ___ for this position.","enough",["too", "so", "such"],"adj + enough + for + danh từ."),
  ()=>mkQ("It was ___ a long walk that we were all exhausted.","such",["so", "too", "very"],"such + a + adj + N + that."),
  ()=>mkQ("She spoke ___ softly that nobody could hear her.","so",["such", "too", "enough"],"so + trạng từ + that."),
  ()=>mkQ("So heavy ___ the rain that the roads were flooded.","was",["it was", "did it", "had"],"So + adj đầu câu → đảo ngữ: So + adj + be + S + that."),
  ()=>mkQ("Such ___ his determination that he never gave up.","was",["it was", "did", "had been it"],"Such + be + S + that, dạng đảo ngữ."),
  ()=>mkQ("The lecture was so dull ___ half the audience left.","that",["so that", "such that", "in order that"],"so + adj + that chỉ kết quả."),
  ()=>mkQ("He had ___ few friends that he often felt lonely.","so",["such", "too", "enough"],"so few + danh từ đếm được + that."),
  ()=>mkQ("The instructions were not clear ___ for us to follow.","enough",["too", "so", "such"],"adj + enough + for sb + to V."),
  ()=>mkQ("It is ___ an honour to be invited here tonight.","such",["so", "too", "very much"],"such + a/an + danh từ (có thể không cần tính từ) để nhấn mạnh."),
  ()=>mkQ("She is far ___ sensible to believe such a rumour.","too",["so", "such", "enough"],"far too + adj + to V, far nhấn mạnh too."),
  ()=>mkQ("There was hardly ___ evidence to convict him.","enough",["too", "so", "such"],"enough + danh từ không đếm được evidence.")
 ]},
{id:"gr_reduced",em:"✂️",name:"Rút Gọn Mệnh Đề",sub:"V-ing · V3 · Having + V3",diff:"advanced",
 qs:[
  ()=>mkQ("The boy ___ football is my brother.","playing",["played", "plays", "to play"],"who is playing → playing (chủ động)."),
  ()=>mkQ("The book ___ by my father is interesting.","written",["writing", "wrote", "to write"],"which was written → written (bị động)."),
  ()=>mkQ("The girl ___ in the corner looks sad.","sitting",["sat", "sits", "to sit"],"who is sitting → sitting."),
  ()=>mkQ("The car ___ last week was expensive.","bought",["buying", "buys", "to buy"],"which was bought → bought."),
  ()=>mkQ("She was the only person ___ the answer.","to know",["knowing", "known", "knew"],"Sau the only → to V."),
  ()=>mkQ("The students ___ in the library are very quiet.","studying",["studied", "study", "to study"],"who are studying → studying."),
  ()=>mkQ("___ tired, he went to bed early.","Feeling",["Felt", "Feel", "To feel"],"Chủ ngữ he tự cảm thấy → V-ing."),
  ()=>mkQ("The window ___ by the storm has been repaired.","broken",["breaking", "broke", "to break"],"which was broken → broken."),
  ()=>mkQ("___ the news, she burst into tears.","Hearing",["Heard", "Hear", "To hear"],"Chủ ngữ she tự nghe → V-ing."),
  ()=>mkQ("___ in 1990, the factory still works well.","Built",["Building", "Build", "To build"],"Nhà máy được xây → V3."),
  ()=>mkQ("___ his work, he went home.","Having finished",["Finishing", "Finished", "To finish"],"Hành động xảy ra trước hành động chính → Having + V3."),
  ()=>mkQ("___ what to do, he asked his teacher.","Not knowing",["Not know", "Knowing not", "Not to know"],"Phủ định của phân từ → Not + V-ing."),
  ()=>mkQ("The man ___ to the police is my neighbour.","talking",["talked", "talks", "to talk"],"who is talking → talking."),
  ()=>mkQ("The questions ___ in the exam were quite easy.","asked",["asking", "ask", "to ask"],"which were asked → asked."),
  ()=>mkQ("He was the last person ___ the building.","to leave",["leaving", "left", "leave"],"Sau the last → to V."),
  ()=>mkQ("___ by the noise, the baby started crying.","Disturbed",["Disturbing", "Disturb", "To disturb"],"Em bé bị quấy rầy → V3."),
  ()=>mkQ("___ for three hours, we finally reached the top.","Having walked",["Walking", "Walked", "To walk"],"Nhấn mạnh hành động kéo dài và hoàn tất trước → Having + V3."),
  ()=>mkQ("The road ___ the two cities is under repair.","connecting",["connected", "connects", "to connect"],"Con đường tự nối hai thành phố → V-ing (chủ động)."),
  ()=>mkQ("___ twice, he did not want to try again.","Having failed",["Failing", "Failed", "To fail"],"Thất bại hai lần trước đó → Having + V3."),
  ()=>mkQ("The information ___ on the website is not accurate.","posted",["posting", "posts", "to post"],"Thông tin được đăng → V3."),
  ()=>mkQ("___ no money, he had to walk home.","Having",["Had", "To have", "Being had"],"Chủ động, cùng thời điểm → V-ing (Having ở đây là V-ing của have)."),
  ()=>mkQ("There are many students ___ to join the club.","wanting",["wanted", "want", "to wanting"],"who want → wanting."),
  ()=>mkQ("___ the exam, she felt very relieved.","Having passed",["Passing", "Passed", "To pass"],"Thi đỗ rồi mới nhẹ nhõm → Having + V3."),
  ()=>mkQ("The man ___ the award is a famous scientist.","receiving",["received", "receives", "to receive"],"who is receiving → receiving."),
  ()=>mkQ("___ carefully, the instructions are easy to follow.","Read",["Reading", "Having read", "To read"],"Chủ ngữ là the instructions, chúng được đọc → V3."),
  ()=>mkQ("___ by his failure, he decided to try once more.","Not discouraged",["Not discouraging", "Discouraging not", "Not to discourage"],"Anh ấy không bị nản → Not + V3."),
  ()=>mkQ("___ all the evidence, the jury reached a verdict.","Having considered",["Considering", "Considered", "To consider"],"Xem xét xong rồi mới đưa ra phán quyết → Having + V3."),
  ()=>mkQ("The proposal ___ at yesterday meeting will be revised.","discussed",["discussing", "discusses", "to discuss"],"Đề xuất được thảo luận → V3."),
  ()=>mkQ("___ that he was innocent, the judge released him.","Convinced",["Convincing", "Having convinced", "To convince"],"Quan toà được thuyết phục → V3 (be convinced that)."),
  ()=>mkQ("___ for hours, the children were fast asleep.","Having played",["Playing", "Played", "To play"],"Chơi suốt nhiều giờ trước đó → Having + V3."),
  ()=>mkQ("Weather ___, we will go camping this weekend.","permitting",["permitted", "permits", "to permit"],"Mệnh đề phân từ độc lập có chủ ngữ riêng: Weather permitting."),
  ()=>mkQ("___ in simple language, the book appeals to young readers.","Written",["Writing", "Having written", "To write"],"Cuốn sách được viết → V3.")
 ]},
];

/* ========== BỘ SINH CÂU HỎI NHIỀU DẠNG CHO ÔN NGỮ PHÁP ========== */
function mkF(q,ans,e,hint){return{t:'fill',q,ans:[].concat(ans),e:e||'',hint:hint||''}}
function mkO(sent,e,vn){return{t:'order',sent,e:e||'',vn:vn||''}}
function mkE(sent,wrong,right,e){return{t:'error',sent,wrong,right,e:e||''}}
function mkT(q,ans,e,hint){return{t:'trans',q,ans:[].concat(ans),e:e||'',hint:hint||''}}

/* ========== LÝ THUYẾT + BÀI TẬP BỔ SUNG THEO CHUYÊN ĐỀ ========== */
const GR_META={

gr_present:{gr:[4,5,6,7],
theory:{
use:['Thói quen, việc lặp đi lặp lại hằng ngày','Sự thật hiển nhiên, chân lí','Lịch trình cố định (tàu, xe, giờ học)','Sở thích, tính cách, cảm nghĩ'],
form:[['(+)','S + V / V(s-es)','She <b>goes</b> to school every day.'],
['(−)','S + don’t / doesn’t + V','She <b>doesn’t go</b> to school on Sunday.'],
['(?)','Do / Does + S + V?','<b>Does</b> she <b>go</b> to school?']],
sign:'every day / week / month, always, usually, often, sometimes, never, on Mondays, twice a week',
tips:['He / She / It → thêm <b>-s</b>: <i>plays, reads</i>','Tận cùng <b>-o, -s, -x, -ch, -sh</b> → thêm <b>-es</b>: <i>goes, watches, washes</i>','Phụ âm + <b>y</b> → đổi thành <b>-ies</b>: <i>study → studies</i> (nguyên âm + y giữ nguyên: <i>plays</i>)','Sau <b>don’t / doesn’t / Do / Does</b> luôn dùng động từ NGUYÊN THỂ: <i>She doesn’t <s>goes</s> go.</i>'],
ex:[['My father works in a hospital.','Bố tôi làm việc ở bệnh viện.'],
['The sun rises in the east.','Mặt trời mọc ở hướng đông.'],
['We don’t have school on Sunday.','Chúng tôi không có tiết học vào Chủ nhật.'],
['Does your sister like ice cream?','Chị gái bạn có thích kem không?'],
['The train leaves at 6 a.m. every morning.','Tàu khởi hành lúc 6 giờ sáng mỗi ngày.'],
['She never eats fast food.','Cô ấy không bao giờ ăn đồ ăn nhanh.']]},
more:[
()=>mkF('My brother ___ (watch) TV every evening.','watches','watch + es → watches (tận cùng -ch).','Chia động từ watch'),
()=>mkF('They ___ (not / live) in Ha Noi.',["don't live","do not live"],'They → don’t + V nguyên thể.','Dạng phủ định'),
()=>mkF('___ your mother ___ (work) at a school?',['does work','Does work'],'Ngôi 3 số ít → Does + S + V nguyên thể. (Viết: does / work)','Viết 2 từ, cách nhau dấu cách'),
()=>mkO('Nam plays football every Sunday','Trật tự: S + V + O + trạng ngữ thời gian.','Nam chơi bóng đá vào mỗi Chủ nhật.'),
()=>mkO('My sister does not like coffee','Phủ định: S + does not + V nguyên thể + O.','Chị tôi không thích cà phê.'),
()=>mkE('She go to school by bus every day.','go','goes','She là ngôi 3 số ít → goes.'),
()=>mkE('He doesn’t likes vegetables.','likes','like','Sau doesn’t dùng động từ nguyên thể.'),
()=>mkT('Viết lại ở dạng phủ định: "Lan studies English."',["Lan doesn't study English.","Lan does not study English."],'studies → doesn’t study (V về nguyên thể).','Bắt đầu bằng Lan'),
()=>mkT('Chuyển thành câu hỏi: "They go to the park."',['Do they go to the park?'],'They → Do + S + V?','Nhớ dấu ?')]},

gr_pronouns:{gr:[4,5,6],
theory:{
use:['Thay thế cho danh từ đã nhắc tới, tránh lặp từ','Nói về sở hữu: của tôi, của bạn, của anh ấy...'],
form:[['Chủ ngữ','I · you · he · she · it · we · they','<b>She</b> is my friend.'],
['Tân ngữ','me · you · him · her · it · us · them','I know <b>her</b>.'],
['Tính từ sở hữu + N','my · your · his · her · its · our · their','This is <b>my</b> book.'],
['Đại từ sở hữu','mine · yours · his · hers · ours · theirs','This book is <b>mine</b>.']],
sign:'Đứng trước động từ → chủ ngữ · Đứng sau động từ / giới từ → tân ngữ · Đứng trước danh từ → tính từ sở hữu',
tips:['<b>Tính từ sở hữu</b> LUÔN đi kèm danh từ: <i>her bag</i>. <b>Đại từ sở hữu</b> đứng MỘT MÌNH: <i>The bag is hers.</i>','<b>its</b> = của nó (không dấu nháy) ≠ <b>it’s</b> = it is','Sau giới từ (with, for, to, at) dùng <b>tân ngữ</b>: <i>Come with <s>I</s> me.</i>'],
ex:[['She is my sister. I love her.','Cô ấy là chị tôi. Tôi yêu chị ấy.'],
['This is our classroom.','Đây là lớp học của chúng tôi.'],
['That pen isn’t yours, it’s mine.','Cây bút đó không phải của bạn, nó là của tôi.'],
['The dog wagged its tail.','Con chó vẫy đuôi của nó.'],
['Can you help them, please?','Bạn giúp họ được không?'],
['Their house is bigger than ours.','Nhà của họ to hơn nhà của chúng tôi.']]},
more:[
()=>mkF('This is Lan. ___ is my best friend.','she','Thay cho Lan, làm chủ ngữ → She.','Điền 1 từ'),
()=>mkF('I can’t find my keys. Have you seen ___ ?','them','Thay cho "my keys" (số nhiều), làm tân ngữ → them.','Điền 1 từ'),
()=>mkF('That bag is not mine. It is ___ . (của cô ấy)','hers','Đại từ sở hữu đứng một mình → hers.','Điền 1 từ'),
()=>mkO('This is my new English teacher','Tính từ sở hữu đứng trước danh từ.','Đây là cô giáo tiếng Anh mới của tôi.'),
()=>mkO('Those books are not theirs','Đại từ sở hữu đứng cuối, không có danh từ theo sau.','Những cuốn sách đó không phải của họ.'),
()=>mkE('Me and my brother go to the same school.','Me','My brother and I','Làm chủ ngữ phải dùng I, và người khác đặt trước.'),
()=>mkE('This is she bag.','she','her','Trước danh từ dùng tính từ sở hữu: her bag.'),
()=>mkT('Viết lại dùng đại từ sở hữu: "This is my pen."',['This pen is mine.'],'my + N → N + is mine.','Bắt đầu: This pen...'),
()=>mkT('Thay từ gạch chân bằng đại từ: "I met Nam and Hoa yesterday." (Nam and Hoa → ?)',['I met them yesterday.'],'Nam and Hoa = tân ngữ số nhiều → them.','Viết cả câu')]},

gr_can:{gr:[4,5,6],
theory:{
use:['Nói về khả năng: biết làm / không biết làm','Xin phép và cho phép','Đề nghị giúp đỡ · <b>could</b> = lịch sự hơn, hoặc khả năng trong quá khứ'],
form:[['(+)','S + can + V','I <b>can swim</b>.'],
['(−)','S + can’t (cannot) + V','He <b>can’t drive</b>.'],
['(?)','Can + S + V?','<b>Can</b> you <b>help</b> me?']],
sign:'Không chia theo ngôi · Không dùng to · Không dùng do/does',
tips:['Sau <b>can</b> luôn là động từ NGUYÊN THỂ, không thêm -s, không có to: <i>She can <s>sings</s> sing.</i>','Phủ định viết liền: <b>cannot</b> hoặc <b>can’t</b> (không viết "can not" trong bài kiểm tra).','Trả lời ngắn: <i>Yes, I can. / No, I can’t.</i>','<b>Could</b> dùng khi xin phép lịch sự: <i>Could I borrow your pen?</i>'],
ex:[['I can play the guitar.','Tôi biết chơi ghi-ta.'],
['She can’t come to the party tonight.','Tối nay cô ấy không đến dự tiệc được.'],
['Can you speak Chinese? — Yes, a little.','Bạn nói được tiếng Trung không? — Được một chút.'],
['Could you open the window, please?','Bạn mở giúp cửa sổ được không?'],
['When he was five, he could already read.','Khi năm tuổi, cậu ấy đã biết đọc.'],
['Can I go out with my friends?','Con đi chơi với bạn được không ạ?']]},
more:[
()=>mkF('My little sister ___ (not / ride) a bike yet.',["can't ride",'cannot ride'],'Phủ định của can → can’t + V nguyên thể.','Viết 2 từ'),
()=>mkF('___ you help me with this exercise?','can','Câu hỏi đề nghị giúp đỡ → Can + S + V?','Điền 1 từ'),
()=>mkF('When my father was young, he ___ run very fast.','could','Khả năng trong quá khứ → could.','Điền 1 từ'),
()=>mkO('Nam can play the piano very well','S + can + V + O + trạng từ.','Nam chơi đàn piano rất giỏi.'),
()=>mkO('Could you pass me the salt please','Câu xin lịch sự: Could + you + V + O.','Bạn đưa giúp tôi lọ muối được không?'),
()=>mkE('She can sings a lot of English songs.','sings','sing','Sau can dùng động từ nguyên thể.'),
()=>mkE('Can you to swim?','to','(bỏ to)','Sau can KHÔNG dùng to.'),
()=>mkT('Viết lại ở dạng phủ định: "He can cook."',["He can't cook.",'He cannot cook.'],'can → can’t.','Bắt đầu bằng He'),
()=>mkT('Chuyển thành câu hỏi: "They can swim."',['Can they swim?'],'Đảo can lên trước chủ ngữ.','Nhớ dấu ?')]},

gr_articles:{gr:[4,5,6,7],
theory:{
use:['<b>a / an</b>: danh từ đếm được SỐ ÍT, nhắc tới lần đầu','<b>the</b>: vật đã xác định, cả người nói và người nghe đều biết','Không mạo từ (∅): danh từ số nhiều / không đếm được nói chung'],
form:[['a + phụ âm','a book, a car, a university (/juː/)','I have <b>a</b> new bike.'],
['an + nguyên âm','an apple, an hour (h câm), an egg','She ate <b>an</b> orange.'],
['the','đã nhắc tới / duy nhất / có of','<b>The</b> sun is bright.'],
['∅','danh từ chung, tên riêng','I like ∅ <b>music</b>.']],
sign:'Nghe ÂM đầu chứ không nhìn chữ cái: an hour, a university, an MP3 player',
tips:['<b>the</b> dùng với vật duy nhất: <i>the sun, the moon, the Earth</i>','Nhắc lần đầu dùng <b>a/an</b>, nhắc lại dùng <b>the</b>: <i>I saw a cat. The cat was black.</i>','Không dùng mạo từ trước bữa ăn, môn học, môn thể thao: <i>have ∅ breakfast, play ∅ football</i>','Dùng <b>the</b> với sông, biển, dãy núi, tên nước số nhiều: <i>the Mekong, the Philippines</i>'],
ex:[['I have an umbrella in my bag.','Tôi có một cái ô trong cặp.'],
['She is a nurse at the city hospital.','Cô ấy là y tá ở bệnh viện thành phố.'],
['The moon goes around the Earth.','Mặt trăng quay quanh Trái Đất.'],
['We had breakfast at seven.','Chúng tôi ăn sáng lúc bảy giờ.'],
['He waited for an hour.','Anh ấy đợi một tiếng đồng hồ.'],
['The book on the table is mine.','Cuốn sách trên bàn là của tôi.']]},
more:[
()=>mkF('My father is ___ engineer.','an','engineer bắt đầu bằng âm nguyên âm /e/ → an.','Điền a / an / the'),
()=>mkF('I bought a shirt. ___ shirt is blue.','the','Nhắc lại lần hai → the.','Điền a / an / the'),
()=>mkF('She plays ___ piano beautifully.','the','Nhạc cụ dùng the: play the piano.','Điền a / an / the'),
()=>mkO('There is a big tree in the garden','There is + a + N + giới từ.','Có một cái cây to trong vườn.'),
()=>mkO('The sun rises in the east','Vật duy nhất và phương hướng dùng the.','Mặt trời mọc ở hướng đông.'),
()=>mkE('I waited for a hour at the station.','a','an','hour có h câm, đọc /aʊə/ → an hour.'),
()=>mkE('We play the football after school.','the','(bỏ the)','Môn thể thao không dùng mạo từ: play football.'),
()=>mkT('Điền mạo từ rồi viết lại: "She is ___ honest girl."',['She is an honest girl.'],'honest có h câm → an.','Viết cả câu'),
()=>mkT('Điền mạo từ rồi viết lại: "___ Mekong flows through Viet Nam."',['The Mekong flows through Viet Nam.'],'Tên sông dùng the.','Viết cả câu')]},

gr_pcon_basic:{gr:[4,5,6],
theory:{
use:['Hành động ĐANG xảy ra ngay lúc nói','Hành động đang diễn ra trong giai đoạn này','Mô tả tranh ảnh'],
form:[['(+)','S + am / is / are + V-ing','She <b>is reading</b> a book.'],
['(−)','S + am / is / are + not + V-ing','They <b>aren’t playing</b> now.'],
['(?)','Am / Is / Are + S + V-ing?','<b>Is</b> he <b>sleeping</b>?']],
sign:'now, right now, at the moment, at present, Look!, Listen!',
tips:['I → <b>am</b> · He/She/It → <b>is</b> · You/We/They → <b>are</b>','Quy tắc thêm -ing: bỏ <b>e</b> (write → writing) · nhân đôi phụ âm cuối khi 1 nguyên âm + 1 phụ âm (run → running, sit → sitting) · ie → y (lie → lying)','Động từ chỉ trạng thái KHÔNG dùng tiếp diễn: <i>like, love, want, know, have (sở hữu)</i>'],
ex:[['Look! The baby is crying.','Nhìn kìa! Em bé đang khóc.'],
['We are doing our homework now.','Chúng tôi đang làm bài tập bây giờ.'],
['She isn’t watching TV at the moment.','Lúc này cô ấy không xem TV.'],
['Are they swimming in the pool?','Họ đang bơi trong bể à?'],
['Listen! Someone is singing.','Nghe kìa! Có ai đó đang hát.'],
['My mother is cooking dinner.','Mẹ tôi đang nấu bữa tối.']]},
more:[
()=>mkF('Look! It ___ (rain).','is raining','Look! → hiện tại tiếp diễn: is + V-ing.','Viết 2 từ'),
()=>mkF('They ___ (not / play) football now.',["aren't playing",'are not playing'],'They → are not + V-ing.','Viết 2-3 từ'),
()=>mkF('What ___ you ___ (do) at the moment?',['are doing','are do'],'Are + S + V-ing? (Viết: are / doing)','Viết 2 từ cách nhau dấu cách'),
()=>mkO('The children are playing in the yard','S + are + V-ing + trạng ngữ nơi chốn.','Bọn trẻ đang chơi ngoài sân.'),
()=>mkO('My mother is not cooking now','Phủ định: S + is + not + V-ing.','Mẹ tôi không nấu ăn lúc này.'),
()=>mkE('She are reading a book now.','are','is','She là ngôi 3 số ít → is.'),
()=>mkE('I am runing to school.','runing','running','run: nhân đôi n trước -ing → running.'),
()=>mkT('Chuyển sang HTTD: "He plays football." (now)',['He is playing football now.','He is playing football.'],'plays → is playing.','Bắt đầu bằng He'),
()=>mkT('Viết lại ở dạng phủ định: "They are watching TV."',["They aren't watching TV.",'They are not watching TV.'],'Thêm not sau are.','Bắt đầu bằng They')]},

gr_pastsimple:{gr:[5,6,7],
theory:{
use:['Hành động đã KẾT THÚC trong quá khứ, có mốc thời gian rõ','Kể chuỗi sự việc trong quá khứ','Thói quen trong quá khứ nay không còn'],
form:[['(+)','S + V-ed / V2','She <b>visited</b> Hue last year.'],
['(−)','S + didn’t + V nguyên thể','She <b>didn’t visit</b> Hue.'],
['(?)','Did + S + V nguyên thể?','<b>Did</b> she <b>visit</b> Hue?'],
['to be','was (I/he/she/it) · were (you/we/they)','They <b>were</b> tired.']],
sign:'yesterday, last night / week / year, ago, in 2019, when I was young',
tips:['Sau <b>didn’t / Did</b> luôn là động từ NGUYÊN THỂ: <i>She didn’t <s>went</s> go.</i>','Quy tắc -ed: thêm <b>-d</b> nếu đã có e (live → lived) · phụ âm + y → <b>-ied</b> (study → studied) · nhân đôi phụ âm cuối (stop → stopped)','Động từ bất quy tắc phải học thuộc: <i>go → went, see → saw, eat → ate, buy → bought</i>','Câu với <b>was/were</b> KHÔNG dùng did: <i>She <s>didn’t was</s> wasn’t happy.</i>'],
ex:[['I watched a film last night.','Tối qua tôi xem một bộ phim.'],
['We went to Da Lat two years ago.','Hai năm trước chúng tôi đi Đà Lạt.'],
['She didn’t finish her homework.','Cô ấy đã không làm xong bài tập.'],
['Did you see Nam yesterday?','Hôm qua bạn có gặp Nam không?'],
['The weather was very cold in January.','Thời tiết tháng Một rất lạnh.'],
['They were at the library this morning.','Sáng nay họ ở thư viện.']]},
more:[
()=>mkF('Yesterday I ___ (go) to the zoo with my class.','went','go là động từ bất quy tắc: go → went.','Chia động từ'),
()=>mkF('She ___ (not / come) to school last Monday.',["didn't come",'did not come'],'Phủ định: didn’t + V nguyên thể.','Viết 2-3 từ'),
()=>mkF('___ you ___ (watch) the match last night?',['did watch','Did watch'],'Did + S + V nguyên thể? (Viết: did / watch)','Viết 2 từ'),
()=>mkO('We visited our grandparents last weekend','S + V2 + O + trạng ngữ thời gian quá khứ.','Cuối tuần trước chúng tôi về thăm ông bà.'),
()=>mkO('She did not buy a new dress','Phủ định quá khứ: S + did not + V nguyên thể.','Cô ấy đã không mua váy mới.'),
()=>mkE('He didn’t went to the party.','went','go','Sau didn’t dùng động từ nguyên thể.'),
()=>mkE('They was very happy yesterday.','was','were','They đi với were.'),
()=>mkT('Viết lại ở dạng phủ định: "Lan studied English last night."',["Lan didn't study English last night.",'Lan did not study English last night.'],'studied → didn’t study.','Giữ nguyên trạng ngữ'),
()=>mkT('Chuyển thành câu hỏi: "They played football yesterday."',['Did they play football yesterday?'],'Did + S + V nguyên thể?','Nhớ dấu ?')]},

gr_future:{gr:[6,7,8],
theory:{
use:['<b>will</b>: quyết định ngay lúc nói, dự đoán, lời hứa','<b>be going to</b>: kế hoạch đã định trước, dự đoán CÓ căn cứ nhìn thấy'],
form:[['(+) will','S + will + V','I <b>will call</b> you tonight.'],
['(−) will','S + won’t + V','She <b>won’t come</b>.'],
['(+) going to','S + am/is/are going to + V','We <b>are going to visit</b> Hue.'],
['(?)','Will + S + V? / Is + S + going to + V?','<b>Will</b> it <b>rain</b>?']],
sign:'tomorrow, next week / month / year, soon, in 2030, tonight',
tips:['Nhìn thấy dấu hiệu rõ ràng → dùng <b>be going to</b>: <i>Look at those clouds! It’s going to rain.</i>','Quyết định ngay lúc nói → dùng <b>will</b>: <i>The phone is ringing. — I’ll answer it.</i>','Sau <b>will</b> luôn là động từ nguyên thể, không thêm to, không chia: <i>He will <s>goes</s> go.</i>','<b>won’t</b> = will not'],
ex:[['I think it will be sunny tomorrow.','Tôi nghĩ mai trời sẽ nắng.'],
['We are going to move house next month.','Tháng sau chúng tôi sẽ chuyển nhà.'],
['She won’t be at home tonight.','Tối nay cô ấy sẽ không ở nhà.'],
['Look at the sky! It’s going to rain.','Nhìn bầu trời kìa! Trời sắp mưa.'],
['Will you help me with this box?','Bạn giúp tôi bê cái hộp này nhé?'],
['They are going to build a new bridge here.','Họ sẽ xây một cây cầu mới ở đây.']]},
more:[
()=>mkF('Look at those black clouds! It ___ (rain).','is going to rain','Có dấu hiệu nhìn thấy → be going to.','Viết 3-4 từ'),
()=>mkF('I promise I ___ (help) you tomorrow.','will help','Lời hứa → will + V.','Viết 2 từ'),
()=>mkF('She ___ (not / come) to the meeting.',["won't come",'will not come'],'Phủ định của will → won’t + V.','Viết 2-3 từ'),
()=>mkO('We are going to visit Ha Long Bay','Kế hoạch: S + be going to + V + O.','Chúng tôi sẽ đi thăm vịnh Hạ Long.'),
()=>mkO('I will send you an email tonight','S + will + V + tân ngữ kép + trạng ngữ.','Tối nay tôi sẽ gửi email cho bạn.'),
()=>mkE('She will goes to Da Nang next week.','goes','go','Sau will dùng động từ nguyên thể.'),
()=>mkE('They are going to visiting their uncle.','visiting','visit','Sau going to dùng động từ nguyên thể.'),
()=>mkT('Viết lại dùng "be going to": "I will buy a new bike next month." (đã lên kế hoạch)',['I am going to buy a new bike next month.',"I'm going to buy a new bike next month."],'will buy → am going to buy.','Bắt đầu bằng I'),
()=>mkT('Chuyển thành câu hỏi: "He will come tomorrow."',['Will he come tomorrow?'],'Đảo will lên trước chủ ngữ.','Nhớ dấu ?')]},

gr_pcon:{gr:[5,6,7],
theory:{
use:['Hành động đang xảy ra lúc nói','Hành động tạm thời trong giai đoạn này (this week, these days)','Kế hoạch chắc chắn ở tương lai gần','Phàn nàn với <b>always</b>'],
form:[['(+)','S + am / is / are + V-ing','I <b>am studying</b> now.'],
['(−)','S + am / is / are + not + V-ing','He <b>isn’t working</b> today.'],
['(?)','Am / Is / Are + S + V-ing?','<b>Are</b> you <b>coming</b>?']],
sign:'now, at the moment, at present, today, this week, Look!, Listen!',
tips:['So sánh: <i>She <b>plays</b> tennis every Sunday</i> (thói quen) ≠ <i>She <b>is playing</b> tennis now</i> (đang diễn ra).','Động từ trạng thái không chia tiếp diễn: <i>know, like, want, need, believe, belong</i>.','Dùng cho kế hoạch chắc chắn: <i>I’m meeting Nam at 5 p.m. tomorrow.</i>'],
ex:[['I’m reading an interesting book these days.','Dạo này tôi đang đọc một cuốn sách hay.'],
['She is not listening to me.','Cô ấy không nghe tôi nói.'],
['What are you doing this weekend?','Cuối tuần này bạn làm gì?'],
['They are having dinner at the moment.','Lúc này họ đang ăn tối.'],
['He is always coming late!','Cậu ta lúc nào cũng đến muộn!'],
['We are flying to Da Nang tomorrow morning.','Sáng mai chúng tôi bay đi Đà Nẵng.']]},
more:[
()=>mkF('Be quiet! The baby ___ (sleep).','is sleeping','Đang diễn ra → is + V-ing.','Viết 2 từ'),
()=>mkF('These days my sister ___ (learn) Japanese.','is learning','these days → giai đoạn hiện tại → tiếp diễn.','Viết 2 từ'),
()=>mkF('We ___ (not / work) today. It is a holiday.',["aren't working",'are not working'],'We → are not + V-ing.','Viết 2-3 từ'),
()=>mkO('She is writing a letter to her friend','S + is + V-ing + O + giới từ.','Cô ấy đang viết thư cho bạn.'),
()=>mkO('What are you doing at the moment','Câu hỏi Wh-: Wh + are + S + V-ing?','Bạn đang làm gì lúc này?'),
()=>mkE('I am knowing the answer.','knowing','know (bỏ luôn "am")','know là động từ chỉ trạng thái, không chia tiếp diễn → I know the answer.'),
()=>mkE('He is study in his room now.','study','studying','Sau is phải là V-ing.'),
()=>mkT('Chuyển sang HTTD: "They watch TV." (now)',['They are watching TV now.','They are watching TV.'],'watch → are watching.','Bắt đầu bằng They'),
()=>mkT('Chuyển thành câu hỏi: "She is cooking dinner."',['Is she cooking dinner?'],'Đảo is lên trước chủ ngữ.','Nhớ dấu ?')]},

gr_compare:{gr:[6,7,8],
theory:{
use:['So sánh HƠN giữa hai đối tượng','So sánh NHẤT trong nhóm từ ba đối tượng trở lên','So sánh BẰNG / không bằng'],
form:[['Ngắn – hơn','S + adj-er + than','He is <b>taller than</b> me.'],
['Dài – hơn','S + more + adj + than','This is <b>more interesting than</b> that.'],
['Ngắn – nhất','S + the + adj-est','She is <b>the tallest</b> girl.'],
['Dài – nhất','S + the most + adj','It is <b>the most expensive</b> car.'],
['Bằng','as + adj nguyên mẫu + as','She is <b>as tall as</b> me.']],
sign:'than · the … est · the most · as … as · not as … as',
tips:['Tính từ ngắn 1 âm tiết kết thúc bằng 1 nguyên âm + 1 phụ âm → <b>nhân đôi</b>: <i>big → bigger, hot → hottest</i>','Kết thúc bằng phụ âm + y → <b>-ier / -iest</b>: <i>happy → happier → the happiest</i>','Bất quy tắc: <i>good → better → the best · bad → worse → the worst · far → farther/further</i>','Giữa <b>as … as</b> dùng tính từ NGUYÊN MẪU: <i>as <s>bigger</s> big as</i>'],
ex:[['My bag is heavier than yours.','Cặp của tôi nặng hơn của bạn.'],
['This film is the most exciting of all.','Bộ phim này hấp dẫn nhất trong tất cả.'],
['Ha Noi is not as hot as Ho Chi Minh City.','Hà Nội không nóng bằng TP. Hồ Chí Minh.'],
['She sings better than her sister.','Cô ấy hát hay hơn chị mình.'],
['Fansipan is the highest mountain in Viet Nam.','Fansipan là ngọn núi cao nhất Việt Nam.'],
['The more you practise, the better you become.','Càng luyện tập, bạn càng giỏi hơn.']]},
more:[
()=>mkF('This box is ___ (heavy) than that one.','heavier','heavy → phụ âm + y → heavier.','Chia tính từ'),
()=>mkF('Mount Everest is ___ (high) mountain in the world.','the highest','So sánh nhất tính từ ngắn: the + adj-est.','Viết 2 từ'),
()=>mkF('This book is ___ (interesting) than the film.','more interesting','Tính từ dài → more + adj.','Viết 2 từ'),
()=>mkO('My sister is taller than me','S + be + adj-er + than + tân ngữ.','Chị tôi cao hơn tôi.'),
()=>mkO('This is the most beautiful beach in Viet Nam','So sánh nhất tính từ dài: the most + adj.','Đây là bãi biển đẹp nhất Việt Nam.'),
()=>mkE('She is more taller than her brother.','more','bỏ "more" → taller','tall là tính từ ngắn, chỉ thêm -er, không dùng thêm more.'),
()=>mkE('My bike is as faster as yours.','faster','fast','Giữa as … as dùng tính từ nguyên mẫu.'),
()=>mkT('Viết lại dùng so sánh hơn: "Nam is 1m70. Minh is 1m65." (Nam / tall)',['Nam is taller than Minh.'],'tall → taller than.','Bắt đầu bằng Nam'),
()=>mkT('Viết lại dùng "not as … as": "My house is smaller than yours."',['My house is not as big as yours.',"My house isn't as big as yours."],'smaller than → not as big as.','Bắt đầu: My house')]},

gr_modal:{gr:[6,7,8],
theory:{
use:['<b>must</b>: bắt buộc do người nói thấy cần thiết','<b>have to</b>: bắt buộc do quy định bên ngoài','<b>should</b>: lời khuyên','<b>mustn’t</b>: cấm · <b>don’t have to</b>: không cần'],
form:[['must','S + must + V','You <b>must wear</b> a helmet.'],
['have to','S + have/has to + V','She <b>has to work</b> on Saturday.'],
['should','S + should + V','You <b>should see</b> a doctor.'],
['(−)','mustn’t / don’t have to / shouldn’t','You <b>mustn’t smoke</b> here.']],
sign:'Nội quy, biển báo → must / mustn’t · Lời khuyên → should',
tips:['<b>mustn’t</b> = CẤM ≠ <b>don’t have to</b> = KHÔNG CẦN. Khác hẳn nhau!','Sau <b>must / should</b> dùng động từ nguyên thể, không có to.','<b>have to</b> chia theo ngôi và thì: <i>has to, had to, will have to</i>; <b>must</b> không chia.','Quá khứ của must là <b>had to</b>.'],
ex:[['Students must wear uniforms on Monday.','Học sinh phải mặc đồng phục vào thứ Hai.'],
['You mustn’t use your phone in class.','Bạn không được dùng điện thoại trong lớp.'],
['She has to get up early every day.','Cô ấy phải dậy sớm mỗi ngày.'],
['You should drink more water.','Bạn nên uống nhiều nước hơn.'],
['We don’t have to go to school on Sunday.','Chúng tôi không phải đi học Chủ nhật.'],
['You shouldn’t eat too much sugar.','Bạn không nên ăn quá nhiều đường.']]},
more:[
()=>mkF('You look tired. You ___ go to bed early.','should','Lời khuyên → should + V.','Điền 1 từ'),
()=>mkF('It is a rule: we ___ wear a helmet when riding a motorbike.','must','Quy định bắt buộc → must.','Điền 1 từ'),
()=>mkF('Today is Sunday, so she ___ (not / have to) work.',["doesn't have to",'does not have to'],'Không cần thiết → doesn’t have to.','Viết 3 từ'),
()=>mkO('You must not talk loudly in the library','Cấm: S + must not + V + trạng ngữ.','Bạn không được nói to trong thư viện.'),
()=>mkO('She has to finish her homework tonight','have to chia theo ngôi: has to + V.','Tối nay cô ấy phải làm xong bài tập.'),
()=>mkE('You should to see a doctor.','to','(bỏ to)','Sau should dùng động từ nguyên thể, không có to.'),
()=>mkE('He must to wear a uniform.','to','(bỏ to)','Sau must KHÔNG có to.'),
()=>mkT('Viết lại dùng "should": "It is a good idea for you to study harder."',['You should study harder.'],'Lời khuyên → You should + V.','Bắt đầu bằng You'),
()=>mkT('Viết lại dùng "have to": "It is necessary for Lan to get up at 5."',['Lan has to get up at 5.'],'Bắt buộc → has to + V.','Bắt đầu bằng Lan')]},

gr_quant:{gr:[5,6,7],
theory:{
use:['Nói về số lượng của danh từ đếm được và không đếm được'],
form:[['some','câu khẳng định (cả 2 loại)','I have <b>some</b> books / water.'],
['any','câu phủ định & nghi vấn','I don’t have <b>any</b> money.'],
['many + N số nhiều','đếm được','<b>many</b> students'],
['much + N không đếm','không đếm được','<b>much</b> water'],
['a lot of / lots of','cả 2 loại, mọi câu','<b>a lot of</b> friends / rice']],
sign:'Đếm được: books, apples, students · Không đếm được: water, rice, money, time, information',
tips:['<b>some</b> vẫn dùng trong câu hỏi khi MỜI hoặc ĐỀ NGHỊ: <i>Would you like some tea?</i>','<b>How many</b> + N số nhiều? · <b>How much</b> + N không đếm được?','<b>a few</b> + đếm được (một vài) · <b>a little</b> + không đếm được (một chút)','money, information, advice, furniture, news là danh từ KHÔNG đếm được.'],
ex:[['There are some apples on the table.','Có vài quả táo trên bàn.'],
['I don’t have any brothers or sisters.','Tôi không có anh chị em nào.'],
['How much water do you drink a day?','Bạn uống bao nhiêu nước mỗi ngày?'],
['There aren’t many students in the room.','Không có nhiều học sinh trong phòng.'],
['She has a lot of homework tonight.','Tối nay cô ấy có rất nhiều bài tập.'],
['We only have a little time left.','Chúng ta chỉ còn một chút thời gian.']]},
more:[
()=>mkF('There isn’t ___ milk in the fridge.','any','Câu phủ định → any.','Điền 1 từ'),
()=>mkF('How ___ books do you have?','many','books đếm được số nhiều → How many.','Điền 1 từ'),
()=>mkF('I don’t have ___ time to finish this.','much','time không đếm được, câu phủ định → much.','Điền 1 từ'),
()=>mkO('There are a lot of trees in the park','There are + a lot of + N số nhiều.','Có rất nhiều cây trong công viên.'),
()=>mkO('How much sugar do you want','How much + N không đếm + do + S + V?','Bạn muốn bao nhiêu đường?'),
()=>mkE('There are many water in the bottle.','many','much','water không đếm được → much (và "is", không phải "are").'),
()=>mkE('I have some informations about the trip.','informations','information','information là danh từ không đếm được, không thêm s.'),
()=>mkT('Viết lại ở dạng phủ định: "There are some eggs in the box."',["There aren't any eggs in the box.",'There are not any eggs in the box.'],'some → any trong câu phủ định.','Bắt đầu: There'),
()=>mkT('Đặt câu hỏi cho phần gạch chân: "She drinks TWO LITRES of water a day."',['How much water does she drink a day?'],'Hỏi lượng nước (không đếm được) → How much.','Nhớ dấu ?')]}

};
Object.assign(GR_META,{

gr_pastcon:{gr:[7,8,9],
theory:{
use:['Hành động ĐANG diễn ra tại một thời điểm trong quá khứ','Hành động đang diễn ra thì bị hành động khác cắt ngang','Hai hành động song song trong quá khứ'],
form:[['(+)','S + was / were + V-ing','I <b>was watching</b> TV at 8 p.m.'],
['(−)','S + wasn’t / weren’t + V-ing','They <b>weren’t sleeping</b>.'],
['(?)','Was / Were + S + V-ing?','<b>Were</b> you <b>working</b>?'],
['Kết hợp','When + QK đơn, QKTD / While + QKTD, QK đơn','<b>While</b> I <b>was cooking</b>, the phone <b>rang</b>.']],
sign:'at 8 o’clock last night, at this time yesterday, while, when, all morning yesterday',
tips:['<b>While</b> thường đi với QUÁ KHỨ TIẾP DIỄN (hành động dài); <b>When</b> thường đi với QUÁ KHỨ ĐƠN (hành động ngắn cắt ngang).','Hành động dài dùng QKTD, hành động ngắn xen vào dùng QK đơn.','Hai hành động cùng kéo dài song song → cả hai đều QKTD, nối bằng <b>while</b>.'],
ex:[['At 7 p.m. yesterday, I was doing my homework.','7 giờ tối qua tôi đang làm bài tập.'],
['While she was cooking, her phone rang.','Khi cô ấy đang nấu ăn thì điện thoại reo.'],
['They weren’t watching TV when I came.','Lúc tôi đến họ không xem TV.'],
['What were you doing at this time last night?','Giờ này tối qua bạn đang làm gì?'],
['He fell down while he was running.','Cậu ấy ngã khi đang chạy.'],
['I was reading while my brother was playing games.','Tôi đọc sách trong khi em tôi chơi game.']]},
more:[
()=>mkF('At 8 p.m. last night, I ___ (have) dinner with my family.','was having','Thời điểm cụ thể trong QK → was + V-ing.','Viết 2 từ'),
()=>mkF('While she ___ (walk) home, it started to rain.','was walking','While + QKTD.','Viết 2 từ'),
()=>mkF('They ___ (not / sleep) when the storm came.',["weren't sleeping",'were not sleeping'],'They → were not + V-ing.','Viết 2-3 từ'),
()=>mkO('I was watching TV when the lights went out','QKTD + when + QK đơn.','Tôi đang xem TV thì mất điện.'),
()=>mkO('While my mother was cooking I was studying','Hai hành động song song, cả hai đều QKTD.','Trong khi mẹ tôi nấu ăn thì tôi học bài.'),
()=>mkE('While she was cook, the phone rang.','cook','cooking','Sau was/were phải là V-ing → was cooking.'),
()=>mkE('They was playing football at 5 p.m.','was','were','They đi với were.'),
()=>mkT('Nối 2 câu bằng "when": "I was doing homework. My friend called."',['I was doing homework when my friend called.'],'Hành động dài + when + hành động ngắn.','Viết cả câu'),
()=>mkT('Nối 2 câu bằng "while": "She was reading. Her brother was playing."',['While she was reading, her brother was playing.','She was reading while her brother was playing.'],'Hai hành động song song → while + cả hai QKTD.','Viết cả câu')]},

gr_past:{gr:[6,7,8],
theory:{
use:['Dùng quá khứ đơn nhưng động từ KHÔNG thêm -ed, phải nhớ dạng V2 riêng'],
form:[['Nhóm giữ nguyên','cut → cut · put → put · let → let · cost → cost','I <b>put</b> it there yesterday.'],
['Đổi nguyên âm','sing → sang · drink → drank · swim → swam','She <b>sang</b> beautifully.'],
['Đổi hẳn','go → went · buy → bought · teach → taught','We <b>went</b> to Hue.'],
['-ought / -aught','think → thought · catch → caught · bring → brought','He <b>thought</b> about it.']],
sign:'Vẫn là các dấu hiệu của quá khứ đơn: yesterday, last…, ago, in 2020',
tips:['Bảng động từ bất quy tắc cần học mỗi ngày 5 từ, ôn lại hằng tuần.','Sau <b>didn’t / Did</b> động từ trở về NGUYÊN THỂ, không dùng V2: <i>Did you <s>went</s> go?</i>','Cẩn thận cặp dễ nhầm: <i>lie (nằm) → lay</i> nhưng <i>lay (đặt) → laid</i>; <i>read → read</i> (đọc khác nhau).'],
ex:[['She bought a new phone last week.','Tuần trước cô ấy mua điện thoại mới.'],
['We ate pho for breakfast.','Chúng tôi ăn phở bữa sáng.'],
['He taught me how to swim.','Anh ấy dạy tôi bơi.'],
['They left the house at six.','Họ rời nhà lúc sáu giờ.'],
['I saw an interesting film yesterday.','Hôm qua tôi xem một bộ phim hay.'],
['The children drank all the milk.','Bọn trẻ uống hết sữa rồi.']]},
more:[
()=>mkF('She ___ (write) a letter to her friend last night.','wrote','write → wrote (bất quy tắc).','Chia động từ'),
()=>mkF('We ___ (take) a lot of photos in Da Lat.','took','take → took.','Chia động từ'),
()=>mkF('He ___ (not / bring) his umbrella yesterday.',["didn't bring",'did not bring'],'Phủ định → didn’t + V nguyên thể (bring, không phải brought).','Viết 2-3 từ'),
()=>mkO('My father taught me how to ride a bike','S + V2 + O + how to + V.','Bố dạy tôi cách đi xe đạp.'),
()=>mkO('They left the party very early last night','S + V2 + O + trạng ngữ.','Tối qua họ rời bữa tiệc rất sớm.'),
()=>mkE('Did you saw the new film?','saw','see','Sau Did dùng động từ nguyên thể.'),
()=>mkE('She buyed a beautiful dress.','buyed','bought','buy là động từ bất quy tắc → bought.'),
()=>mkT('Chia động từ rồi viết lại: "Last year we (go) to Sa Pa."',['Last year we went to Sa Pa.'],'go → went.','Viết cả câu'),
()=>mkT('Chuyển thành câu hỏi: "He drank coffee this morning."',['Did he drink coffee this morning?'],'Did + S + V nguyên thể (drink).','Nhớ dấu ?')]},

gr_passive:{gr:[7,8,9,10],
theory:{
use:['Nhấn mạnh HÀNH ĐỘNG và ĐỐI TƯỢNG chịu tác động, không phải người làm','Khi không biết hoặc không cần nói ai làm','Văn phong khoa học, báo chí, thông báo'],
form:[['HT đơn','am / is / are + V3','Rice <b>is grown</b> here.'],
['QK đơn','was / were + V3','It <b>was built</b> in 1990.'],
['HT tiếp diễn','is / are being + V3','A bridge <b>is being built</b>.'],
['HT hoàn thành','has / have been + V3','It <b>has been finished</b>.'],
['Tương lai / modal','will be / must be / can be + V3','It <b>will be sent</b> tomorrow.']],
sign:'by + tác nhân (chỉ giữ khi cần) · Chủ ngữ chịu tác động chứ không thực hiện',
tips:['Công thức chuyển: tân ngữ câu chủ động → chủ ngữ câu bị động; chia <b>be</b> đúng thì; động từ chính → <b>V3</b>.','Giữ nguyên thì của câu chủ động: <i>made → was made</i>, <i>has made → has been made</i>.','Bỏ <b>by + người</b> khi là people, someone, they (không xác định).','Câu 2 tân ngữ có 2 cách bị động: <i>She gave me a book → I was given a book / A book was given to me.</i>','Đặc biệt: <i>make sb do → be made TO do</i>; <i>have + O + V3</i> = nhờ ai làm gì.'],
ex:[['This bridge was built in 1985.','Cây cầu này được xây năm 1985.'],
['English is spoken all over the world.','Tiếng Anh được nói khắp thế giới.'],
['The report hasn’t been finished yet.','Bản báo cáo vẫn chưa được hoàn thành.'],
['Helmets must be worn on a motorbike.','Phải đội mũ bảo hiểm khi đi xe máy.'],
['A new school is being built in our village.','Một ngôi trường mới đang được xây ở làng tôi.'],
['She had her hair cut yesterday.','Hôm qua cô ấy đi cắt tóc.']]},
more:[
()=>mkF('Coffee ___ (grow) in the Central Highlands.','is grown','HT đơn bị động: is/are + V3.','Viết 2 từ'),
()=>mkF('The letters ___ (send) last Monday.','were sent','QK đơn bị động, chủ ngữ số nhiều → were + V3.','Viết 2 từ'),
()=>mkF('The homework ___ (not / finish) yet.',["hasn't been finished",'has not been finished'],'yet → HTHT bị động: has not been + V3.','Viết 3-4 từ'),
()=>mkO('This song was written by a young musician','S + was + V3 + by + tác nhân.','Bài hát này do một nhạc sĩ trẻ sáng tác.'),
()=>mkO('Plastic bags must not be used in this shop','Modal bị động phủ định: must not be + V3.','Không được dùng túi ni lông trong cửa hàng này.'),
()=>mkE('The house was build in 1990.','build','built','Bị động dùng V3: built.'),
()=>mkE('English is speak in many countries.','speak','spoken','be + V3 → is spoken.'),
()=>mkT('Chuyển sang bị động: "They clean the classroom every day."',['The classroom is cleaned every day.'],'HT đơn bị động: is + V3.','Bắt đầu: The classroom'),
()=>mkT('Chuyển sang bị động: "Someone stole my bike last night."',['My bike was stolen last night.'],'Someone không xác định → bỏ by; QK đơn bị động.','Bắt đầu: My bike')]},

gr_gerund:{gr:[7,8,9,10],
theory:{
use:['Chọn V-ing hay to V tuỳ theo động từ đứng trước','Sau giới từ luôn dùng V-ing','V-ing/to V làm chủ ngữ của câu'],
form:[['+ V-ing','enjoy, like, love, hate, mind, avoid, finish, practise, suggest, keep, give up','I <b>enjoy reading</b>.'],
['+ to V','want, decide, hope, promise, agree, plan, need, learn, offer, refuse','She <b>decided to leave</b>.'],
['Sau giới từ','in / on / at / of / about / for + V-ing','He is good <b>at singing</b>.'],
['V + O + to V','ask / tell / want / advise / encourage sb to V','They <b>asked me to help</b>.']],
sign:'Nhìn ĐỘNG TỪ hoặc GIỚI TỪ đứng ngay trước chỗ trống để quyết định',
tips:['Sau <b>look forward to / be used to / object to</b> thì <b>to</b> là giới từ → dùng <b>V-ing</b>: <i>I look forward to <s>see</s> seeing you.</i>','<b>stop + V-ing</b> = dừng hẳn việc đó ≠ <b>stop + to V</b> = dừng lại ĐỂ làm việc khác.','<b>remember/forget + V-ing</b> = nhớ/quên việc ĐÃ làm ≠ <b>+ to V</b> = nhớ/quên việc PHẢI làm.','Sau <b>make / let sb</b> dùng động từ nguyên thể không to: <i>She made me <s>to cry</s> cry.</i>'],
ex:[['I enjoy listening to music.','Tôi thích nghe nhạc.'],
['She decided to study abroad.','Cô ấy quyết định đi du học.'],
['Thank you for helping me.','Cảm ơn bạn đã giúp tôi.'],
['He stopped smoking last year.','Năm ngoái anh ấy bỏ hút thuốc.'],
['Remember to lock the door.','Nhớ khoá cửa nhé.'],
['My parents want me to become a doctor.','Bố mẹ muốn tôi trở thành bác sĩ.']]},
more:[
()=>mkF('She is interested in ___ (learn) new languages.','learning','Sau giới từ in → V-ing.','Chia động từ'),
()=>mkF('They agreed ___ (help) us with the project.','to help','agree + to V.','Viết 2 từ'),
()=>mkF('Would you mind ___ (close) the window?','closing','mind + V-ing.','Chia động từ'),
()=>mkO('I look forward to hearing from you','look forward to + V-ing (to là giới từ).','Tôi mong sớm nhận được hồi âm từ bạn.'),
()=>mkO('My teacher encouraged me to join the club','V + O + to V.','Cô giáo khuyến khích tôi tham gia câu lạc bộ.'),
()=>mkE('I enjoy play badminton.','play','playing','enjoy + V-ing.'),
()=>mkE('He is good at draw pictures.','draw','drawing','Sau giới từ at dùng V-ing.'),
()=>mkT('Viết lại: "I am looking forward to ___ (meet) you."',['I am looking forward to meeting you.',"I'm looking forward to meeting you."],'look forward to + V-ing.','Viết cả câu'),
()=>mkT('Nối thành một câu: "She wants. She becomes a teacher."',['She wants to become a teacher.'],'want + to V.','Bắt đầu bằng She')]},

gr_perfect:{gr:[7,8,9,10],
theory:{
use:['Việc xảy ra trong quá khứ nhưng CÒN liên quan tới hiện tại','Kinh nghiệm, trải nghiệm (đã từng)','Việc bắt đầu trong quá khứ và KÉO DÀI tới hiện tại','Việc vừa mới xảy ra'],
form:[['(+)','S + have / has + V3','I <b>have finished</b> my homework.'],
['(−)','S + haven’t / hasn’t + V3','She <b>hasn’t called</b> me.'],
['(?)','Have / Has + S + V3?','<b>Have</b> you <b>eaten</b> yet?']],
sign:'since, for, already, yet, never, ever, just, recently, so far, up to now, this week',
tips:['<b>since</b> + MỐC thời gian (since 2020, since Monday) · <b>for</b> + KHOẢNG thời gian (for 3 years).','KHÔNG dùng HTHT với mốc quá khứ xác định (yesterday, last year, ago) — phải dùng quá khứ đơn.','<b>already</b> đứng giữa have và V3 (câu khẳng định); <b>yet</b> đứng cuối câu phủ định/nghi vấn.','<b>gone to</b> = đã đi và CHƯA về ≠ <b>been to</b> = đã từng đến và đã về.'],
ex:[['I have lived here for ten years.','Tôi đã sống ở đây mười năm rồi.'],
['She has just finished her report.','Cô ấy vừa hoàn thành báo cáo.'],
['Have you ever been to Da Nang?','Bạn đã từng đến Đà Nẵng chưa?'],
['They haven’t arrived yet.','Họ vẫn chưa đến.'],
['We have known each other since 2019.','Chúng tôi quen nhau từ năm 2019.'],
['He has already read that book.','Anh ấy đã đọc cuốn sách đó rồi.']]},
more:[
()=>mkF('I ___ (live) in this city since 2018.','have lived','since → HTHT: have + V3.','Viết 2 từ'),
()=>mkF('She ___ (not / finish) her homework yet.',["hasn't finished",'has not finished'],'yet → HTHT phủ định.','Viết 2-3 từ'),
()=>mkF('___ you ever ___ (be) to Ha Long Bay?',['have been','Have been'],'Have + S + ever + been? (Viết: have / been)','Viết 2 từ'),
()=>mkO('We have known each other for five years','S + have + V3 + tân ngữ + for + khoảng thời gian.','Chúng tôi quen nhau được năm năm rồi.'),
()=>mkO('She has already sent the email','already đứng giữa has và V3.','Cô ấy đã gửi email rồi.'),
()=>mkE('I have seen that film yesterday.','have','bỏ "have" → I saw','yesterday là mốc quá khứ xác định nên phải dùng quá khứ đơn: I saw that film yesterday.'),
()=>mkE('She has lived here since five years.','since','for','five years là khoảng thời gian → dùng for.'),
()=>mkT('Viết lại dùng "for": "I started learning English in 2020." (nay là 2026)',['I have learnt English for six years.','I have learned English for six years.'],'Bắt đầu QK, kéo dài tới nay → have + V3 + for.','Bắt đầu bằng I have'),
()=>mkT('Chuyển thành câu hỏi: "They have visited the museum."',['Have they visited the museum?'],'Đảo have lên trước chủ ngữ.','Nhớ dấu ?')]},

gr_conditional:{gr:[8,9,10],
theory:{
use:['<b>Loại 0</b>: chân lí, sự thật luôn đúng','<b>Loại 1</b>: điều CÓ THỂ xảy ra ở hiện tại/tương lai','<b>Loại 2</b>: giả định TRÁI với hiện tại, khó xảy ra','<b>Loại 3</b>: giả định TRÁI với quá khứ, không thể thay đổi'],
form:[['Loại 0','If + HT đơn, HT đơn','If you heat ice, it <b>melts</b>.'],
['Loại 1','If + HT đơn, will + V','If it <b>rains</b>, we <b>will stay</b> home.'],
['Loại 2','If + QK đơn, would + V','If I <b>were</b> you, I <b>would study</b> harder.'],
['Loại 3','If + had + V3, would have + V3','If I <b>had known</b>, I <b>would have come</b>.']],
sign:'If · Unless (= if … not) · As long as · Provided that',
tips:['Loại 2 dùng <b>were</b> cho MỌI ngôi: <i>If I were you…</i>','<b>Unless</b> = If … not, nên sau Unless KHÔNG dùng phủ định nữa: <i>Unless you hurry (= If you don’t hurry)…</i>','Mệnh đề If đứng trước thì có dấu phẩy; đứng sau thì không cần.','KHÔNG dùng <b>will</b> trong mệnh đề If của loại 1: <i>If it <s>will rain</s> rains…</i>'],
ex:[['If you mix red and blue, you get purple.','Nếu trộn đỏ với xanh, bạn được màu tím.'],
['If she studies hard, she will pass the exam.','Nếu chăm học, cô ấy sẽ đỗ kì thi.'],
['If I had more money, I would travel the world.','Nếu có nhiều tiền hơn, tôi sẽ đi khắp thế giới.'],
['If we had left earlier, we wouldn’t have missed the bus.','Nếu đi sớm hơn, chúng tôi đã không lỡ xe buýt.'],
['Unless you water the plants, they will die.','Nếu bạn không tưới cây, chúng sẽ chết.'],
['If I were you, I would apologise.','Nếu tôi là bạn, tôi sẽ xin lỗi.']]},
more:[
()=>mkF('If it ___ (rain) tomorrow, we will cancel the trip.','rains','Loại 1: If + HT đơn (không dùng will).','Chia động từ'),
()=>mkF('If I ___ (be) you, I would take that job.','were','Loại 2 dùng were cho mọi ngôi.','Điền 1 từ'),
()=>mkF('If she had studied, she ___ (pass) the exam.','would have passed','Loại 3: would have + V3.','Viết 3 từ'),
()=>mkO('If you practise every day you will improve quickly','Loại 1: If + HT đơn, S + will + V.','Nếu luyện tập mỗi ngày, bạn sẽ tiến bộ nhanh.'),
()=>mkO('Unless we protect the forest many animals will disappear','Unless + HT đơn (không phủ định), will + V.','Nếu không bảo vệ rừng, nhiều loài vật sẽ biến mất.'),
()=>mkE('If it will rain, we will stay at home.','will','bỏ "will" → If it rains','Mệnh đề If loại 1 dùng hiện tại đơn, không dùng will.'),
()=>mkE('Unless you don’t hurry, you will be late.','don’t','bỏ "don’t" → Unless you hurry','Unless đã mang nghĩa phủ định rồi, không dùng thêm don’t.'),
()=>mkT('Viết lại dùng "Unless": "If you don’t study, you will fail."',['Unless you study, you will fail.'],'If … not = Unless.','Bắt đầu: Unless'),
()=>mkT('Viết câu điều kiện loại 2: "I am not rich, so I don’t buy a car."',['If I were rich, I would buy a car.'],'Trái hiện tại → loại 2: If + were, would + V.','Bắt đầu: If I')]},

gr_cond1:{gr:[7,8,9],
theory:{
use:['Điều kiện CÓ THẬT, có khả năng xảy ra ở hiện tại hoặc tương lai','Lời cảnh báo, lời hứa, lời đe doạ','Đưa ra đề nghị hoặc điều kiện trao đổi'],
form:[['(+)','If + S + V(s/es), S + will + V','If it <b>rains</b>, I <b>will stay</b> home.'],
['Đảo vế','S + will + V + if + S + V(s/es)','I <b>will stay</b> home <b>if it rains</b>.'],
['Biến thể','can / may / should / imperative thay cho will','If you see Nam, <b>tell</b> him to call me.']],
sign:'if, unless, as long as, provided that, in case',
tips:['Mệnh đề If dùng HIỆN TẠI ĐƠN, KHÔNG dùng will: <i>If she <s>will come</s> comes…</i>','Có thể thay <b>will</b> bằng <b>can / may / must / should</b> tuỳ ý nghĩa.','Mệnh đề If đứng đầu → có dấu phẩy; đứng sau → không dấu phẩy.','<b>Unless</b> = If … not.'],
ex:[['If you hurry, you will catch the bus.','Nếu nhanh lên, bạn sẽ bắt kịp xe buýt.'],
['If it is sunny tomorrow, we will go swimming.','Nếu mai trời nắng, chúng ta sẽ đi bơi.'],
['She won’t pass if she doesn’t revise.','Cô ấy sẽ không đỗ nếu không ôn bài.'],
['If you need help, just call me.','Nếu cần giúp, cứ gọi tôi.'],
['Unless it stops raining, the match will be cancelled.','Nếu trời không tạnh mưa, trận đấu sẽ bị huỷ.'],
['If you finish early, you can go home.','Nếu xong sớm, bạn có thể về.']]},
more:[
()=>mkF('If you ___ (not / hurry), you will miss the train.',["don't hurry",'do not hurry'],'Mệnh đề If dùng hiện tại đơn.','Viết 2-3 từ'),
()=>mkF('If he calls me, I ___ (tell) him the news.','will tell','Vế chính loại 1 dùng will + V.','Viết 2 từ'),
()=>mkF('___ you study hard, you will get good marks.','if','Điều kiện có thật → If.','Điền 1 từ'),
()=>mkO('If it is cold we will wear warm clothes','If + HT đơn, S + will + V.','Nếu trời lạnh, chúng ta sẽ mặc áo ấm.'),
()=>mkO('You will be tired if you sleep late','Vế chính trước, mệnh đề if sau, không dấu phẩy.','Bạn sẽ mệt nếu ngủ muộn.'),
()=>mkE('If she will come, we will start the meeting.','will','bỏ "will" → If she comes','Mệnh đề If loại 1 dùng hiện tại đơn.'),
()=>mkE('If you don’t hurry, you miss the bus.','miss','will miss','Vế chính loại 1 dùng will + V.'),
()=>mkT('Nối thành câu điều kiện loại 1: "You practise a lot. You will speak English well."',['If you practise a lot, you will speak English well.'],'If + HT đơn, will + V.','Bắt đầu: If'),
()=>mkT('Viết lại dùng "Unless": "If you don’t wear a coat, you will catch a cold."',['Unless you wear a coat, you will catch a cold.'],'If … not = Unless.','Bắt đầu: Unless')]},

gr_cond2:{gr:[8,9,10],
theory:{
use:['Giả định TRÁI NGƯỢC với thực tế ở hiện tại','Điều khó hoặc không thể xảy ra','Đưa lời khuyên lịch sự với "If I were you…"'],
form:[['(+)','If + S + V2 / were, S + would + V','If I <b>had</b> money, I <b>would travel</b>.'],
['Lời khuyên','If I were you, I would + V','<b>If I were you, I would</b> see a doctor.'],
['Biến thể','could / might thay cho would','If she tried, she <b>might succeed</b>.']],
sign:'If + quá khứ đơn · were (mọi ngôi) · would / could / might',
tips:['Dùng <b>were</b> cho TẤT CẢ các ngôi trong văn viết chuẩn: <i>If he <b>were</b> here…</i>','Mệnh đề If dùng QUÁ KHỨ ĐƠN nhưng mang nghĩa HIỆN TẠI, không phải chuyện đã xảy ra.','KHÔNG dùng <b>would</b> trong mệnh đề If: <i>If I <s>would have</s> had…</i>','So sánh: loại 1 = có thể xảy ra · loại 2 = trái thực tế hiện tại.'],
ex:[['If I were rich, I would buy a big house.','Nếu tôi giàu, tôi sẽ mua ngôi nhà lớn.'],
['If she spoke English, she would get the job.','Nếu cô ấy nói được tiếng Anh, cô ấy sẽ nhận được việc.'],
['If I were you, I wouldn’t do that.','Nếu tôi là bạn, tôi sẽ không làm vậy.'],
['What would you do if you won the lottery?','Bạn sẽ làm gì nếu trúng số?'],
['If we lived near the sea, we could swim every day.','Nếu sống gần biển, chúng tôi có thể bơi mỗi ngày.'],
['If he had more time, he would learn the guitar.','Nếu có nhiều thời gian hơn, anh ấy sẽ học ghi-ta.']]},
more:[
()=>mkF('If I ___ (have) a car, I would drive to work.','had','Loại 2: If + quá khứ đơn.','Điền 1 từ'),
()=>mkF('If she were here, she ___ (help) us.','would help','Vế chính loại 2: would + V.','Viết 2 từ'),
()=>mkF('If I ___ you, I would apologise.','were','Lời khuyên: If I were you.','Điền 1 từ'),
()=>mkO('If I had more free time I would learn Japanese','If + QK đơn, S + would + V.','Nếu có nhiều thời gian rảnh hơn, tôi sẽ học tiếng Nhật.'),
()=>mkO('What would you do if you were the president','Câu hỏi loại 2: What would + S + V + if + QK đơn?','Bạn sẽ làm gì nếu là tổng thống?'),
()=>mkE('If I would have money, I would buy a house.','would','bỏ "would" → If I had money','Mệnh đề If loại 2 dùng quá khứ đơn, không dùng would.'),
()=>mkE('If he was you, he would accept the offer.','was','were','Loại 2 dùng were cho mọi ngôi.'),
()=>mkT('Viết câu điều kiện loại 2: "I don’t have a bike, so I walk to school."',['If I had a bike, I would not walk to school.',"If I had a bike, I wouldn't walk to school."],'Trái hiện tại → If + QK đơn, would + V.','Bắt đầu: If I had'),
()=>mkT('Viết lại thành lời khuyên: "You should see a doctor." (dùng If I were you)',['If I were you, I would see a doctor.'],'Lời khuyên lịch sự → If I were you, I would + V.','Bắt đầu: If I were you')]},

gr_relative:{gr:[8,9,10],
theory:{
use:['Nối hai câu, bổ nghĩa cho danh từ đứng trước','Tránh lặp lại danh từ','Cung cấp thêm thông tin về người, vật, nơi chốn, thời gian'],
form:[['who','người – chủ ngữ hoặc tân ngữ','The man <b>who</b> called is my uncle.'],
['whom','người – tân ngữ (trang trọng)','The girl <b>whom</b> you met is Lan.'],
['which','vật, sự việc','The book <b>which</b> I read was great.'],
['that','người hoặc vật (chỉ MĐQH xác định)','The car <b>that</b> he bought is red.'],
['whose','sở hữu, luôn + danh từ','The boy <b>whose</b> father is a doctor…'],
['where / when','nơi chốn / thời gian','This is the town <b>where</b> I grew up.']],
sign:'Ngay sau danh từ cần bổ nghĩa · Có dấu phẩy = mệnh đề không xác định',
tips:['Sau dấu PHẨY KHÔNG được dùng <b>that</b>: <i>My mother, <s>that</s> who is a nurse, …</i>','Dùng <b>that</b> bắt buộc sau: <i>all, everything, something, nothing, the only, so sánh nhất</i>.','Có thể LƯỢC BỎ đại từ quan hệ khi nó làm TÂN NGỮ: <i>The book (which) I read…</i>','<b>which</b> có thể thay cho cả mệnh đề đứng trước: <i>He failed, which surprised us.</i>','Rút gọn: <i>who is standing → standing</i> (chủ động) · <i>which was built → built</i> (bị động).'],
ex:[['The woman who lives next door is a teacher.','Người phụ nữ sống cạnh nhà là giáo viên.'],
['This is the phone which I bought yesterday.','Đây là chiếc điện thoại tôi mua hôm qua.'],
['I know a boy whose mother is a singer.','Tôi biết một cậu bé có mẹ là ca sĩ.'],
['Hue, which is an ancient capital, attracts many tourists.','Huế, vốn là cố đô, thu hút nhiều du khách.'],
['That is the school where my father studied.','Đó là ngôi trường bố tôi từng học.'],
['I will never forget the day when we first met.','Tôi sẽ không bao giờ quên ngày chúng ta gặp nhau.']]},
more:[
()=>mkF('The man ___ is wearing a blue shirt is my teacher.','who','Người, làm chủ ngữ → who.','Điền 1 từ'),
()=>mkF('This is the village ___ my grandparents live.','where','Nơi chốn → where.','Điền 1 từ'),
()=>mkF('I met a girl ___ brother plays for the school team.','whose','Sở hữu → whose + N.','Điền 1 từ'),
()=>mkO('The book which I borrowed was very interesting','N + which + S + V + be + adj.','Cuốn sách tôi mượn rất thú vị.'),
()=>mkO('Da Nang which is a coastal city has beautiful beaches','MĐQH không xác định nằm giữa hai dấu phẩy.','Đà Nẵng, một thành phố ven biển, có những bãi biển đẹp.'),
()=>mkE('My mother, that is a nurse, works very hard.','that','who','Sau dấu phẩy không dùng that; người → who.'),
()=>mkE('The boy who father is a doctor studies well.','who','whose','Sở hữu (cha của cậu bé) → whose.'),
()=>mkT('Nối 2 câu bằng đại từ quan hệ: "The girl is my sister. She is singing."',['The girl who is singing is my sister.'],'Người, làm chủ ngữ → who.','Bắt đầu: The girl'),
()=>mkT('Nối 2 câu: "This is the house. My family lived there."',['This is the house where my family lived.'],'Nơi chốn → where.','Bắt đầu: This is the house')]},

gr_reported:{gr:[8,9,10],
theory:{
use:['Thuật lại lời người khác nói mà không dùng nguyên văn','Thuật lại câu hỏi, câu mệnh lệnh, lời khuyên'],
form:[['Câu kể','S + said (that) + S + V (lùi thì)','She said (that) she <b>was</b> tired.'],
['Câu hỏi Yes/No','S + asked + if / whether + S + V','He asked <b>if</b> I <b>could</b> help.'],
['Câu hỏi Wh-','S + asked + Wh- + S + V','She asked <b>where I lived</b>.'],
['Mệnh lệnh','S + told / asked + O + (not) to V','He told me <b>not to be</b> late.']],
sign:'said, told, asked, wanted to know, wondered',
tips:['Lùi một thì: <i>am/is → was · are → were · V(s) → V-ed · will → would · can → could · have → had · V-ed → had V3</i>','Đổi đại từ và trạng ngữ: <i>I → he/she · here → there · now → then · today → that day · tomorrow → the next day · yesterday → the day before · this → that</i>','Câu hỏi khi tường thuật trở về TRẬT TỰ KHẲNG ĐỊNH (S + V), bỏ do/does/did và dấu ?','<b>say to sb</b> = <b>tell sb</b>. Sau <b>tell</b> bắt buộc có tân ngữ: <i>He told <b>me</b> that…</i>'],
ex:[['"I am busy." → She said she was busy.','"Tôi bận." → Cô ấy nói cô ấy bận.'],
['"I will come." → He said he would come.','"Tôi sẽ đến." → Anh ấy nói anh ấy sẽ đến.'],
['"Where do you live?" → She asked where I lived.','"Bạn sống ở đâu?" → Cô ấy hỏi tôi sống ở đâu.'],
['"Don’t touch it!" → He told me not to touch it.','"Đừng chạm vào!" → Anh ấy bảo tôi đừng chạm vào.'],
['"Can you swim?" → She asked if I could swim.','"Bạn biết bơi không?" → Cô ấy hỏi tôi có biết bơi không.'],
['"I saw him yesterday." → She said she had seen him the day before.','"Tôi gặp anh ấy hôm qua." → Cô ấy nói đã gặp anh ấy hôm trước.']]},
more:[
()=>mkF('"I am hungry," she said. → She said she ___ hungry.','was','am → was (lùi thì).','Điền 1 từ'),
()=>mkF('"I will call you," he said. → He said he ___ call me.','would','will → would.','Điền 1 từ'),
()=>mkF('"Where do you work?" she asked. → She asked where I ___ .','worked','Câu hỏi Wh- về trật tự khẳng định, lùi thì: worked.','Điền 1 từ'),
()=>mkO('She said that she was very tired that day','S + said that + S + V lùi thì + trạng ngữ đã đổi.','Cô ấy nói hôm đó cô ấy rất mệt.'),
()=>mkO('He told me not to open the door','told + O + not to + V.','Anh ấy bảo tôi đừng mở cửa.'),
()=>mkE('She asked me where did I live.','did','bỏ "did" → where I lived','Câu hỏi khi tường thuật trở về trật tự khẳng định, bỏ do/does/did.'),
()=>mkE('He said me that he was busy.','said','told','said to me hoặc told me; "said me" là sai.'),
()=>mkT('Chuyển sang câu tường thuật: "I like this song," Lan said.',['Lan said that she liked that song.','Lan said she liked that song.'],'like → liked; this → that; I → she.','Bắt đầu: Lan said'),
()=>mkT('Chuyển sang câu tường thuật: "Close the window," the teacher said to us.',['The teacher told us to close the window.'],'Mệnh lệnh → told + O + to V.','Bắt đầu: The teacher told us')]}

});


/* ===== BÀI TẬP BỔ SUNG ĐỢT 2 — đủ 5 câu cho mỗi dạng ===== */
const GR_MORE2={

gr_present:[
()=>mkF('My parents ___ (go) to work by motorbike.','go','Chủ ngữ số nhiều → giữ nguyên: go.','Chia động từ'),
()=>mkF('Water ___ (boil) at 100 degrees.','boils','Chân lí, chủ ngữ số ít → boils.','Chia động từ'),
()=>mkO('We often visit our grandparents at weekends','Trạng từ tần suất often đứng trước động từ thường.','Chúng tôi thường về thăm ông bà vào cuối tuần.'),
()=>mkO('My teacher always comes to class early','always + V(s) với ngôi 3 số ít.','Cô giáo tôi luôn đến lớp sớm.'),
()=>mkO('Do your friends like playing football','Do + S + V nguyên thể + O?','Bạn của bạn có thích chơi bóng đá không?'),
()=>mkE('My sister wash the dishes every evening.','wash','washes','My sister là ngôi 3 số ít → washes.'),
()=>mkE('Do she live in Hue?','Do','Does','Ngôi 3 số ít dùng Does.'),
()=>mkE('He studys English every day.','studys','studies','Phụ âm + y → đổi y thành ies: studies.'),
()=>mkT('Viết lại ở dạng phủ định: "They watch TV every night."',["They don't watch TV every night.",'They do not watch TV every night.'],'They → don’t + V nguyên thể.','Giữ nguyên trạng ngữ'),
()=>mkT('Chuyển thành câu hỏi: "She plays the piano."',['Does she play the piano?'],'Ngôi 3 số ít → Does + S + V nguyên thể?','Nhớ dấu ?'),
()=>mkT('Chia động từ rồi viết lại: "Nam (not / like) coffee."',["Nam doesn't like coffee.",'Nam does not like coffee.'],'Ngôi 3 số ít phủ định → doesn’t like.','Viết cả câu')],

gr_pronouns:[
()=>mkF('My parents love me and I love ___ too.','them','Thay "my parents", làm tân ngữ → them.','Điền 1 từ'),
()=>mkF('This is ___ classroom. (của chúng tôi)','our','Trước danh từ dùng tính từ sở hữu → our.','Điền 1 từ'),
()=>mkO('Her brother is taller than mine','mine đứng một mình, không có danh từ theo sau.','Anh trai cô ấy cao hơn anh trai tôi.'),
()=>mkO('Can you give me your phone number','give + tân ngữ gián tiếp + tính từ sở hữu + N.','Bạn cho mình số điện thoại của bạn được không?'),
()=>mkO('We always help each other in class','each other = lẫn nhau.','Chúng tôi luôn giúp đỡ nhau trong lớp.'),
()=>mkE('The cat licked it’s paw.','it’s','its','its = của nó (không có dấu nháy); it’s = it is.'),
()=>mkE('Please come with we.','we','us','Sau giới từ with dùng tân ngữ: us.'),
()=>mkE('This book is my.','my','mine','Đứng một mình phải dùng đại từ sở hữu: mine.'),
()=>mkT('Thay bằng đại từ: "Lan and I are going to the park."',['We are going to the park.',"We're going to the park."],'Lan and I = chủ ngữ số nhiều → We.','Viết cả câu'),
()=>mkT('Viết lại dùng đại từ sở hữu: "These are our books."',['These books are ours.'],'our + N → N + are ours.','Bắt đầu: These books'),
()=>mkT('Thay bằng đại từ: "I gave the letter to Nam."',['I gave it to him.'],'the letter → it; Nam → him.','Viết cả câu')],

gr_can:[
()=>mkF('___ I borrow your pen, please?','Could','Xin phép lịch sự → Could (hoặc Can).','Điền 1 từ'),
()=>mkF('My grandmother ___ (not / see) very well without glasses.',["can't see",'cannot see'],'Phủ định: can’t + V nguyên thể.','Viết 2 từ'),
()=>mkO('I can speak English and a little Chinese','S + can + V + O.','Tôi nói được tiếng Anh và một chút tiếng Trung.'),
()=>mkO('She could not swim when she was five','Quá khứ: could not + V nguyên thể.','Cô ấy chưa biết bơi khi lên năm.'),
()=>mkO('Can your brother play the guitar','Can + S + V nguyên thể + O?','Anh trai bạn biết chơi ghi-ta không?'),
()=>mkE('He cans ride a bike.','cans','can','can không bao giờ thêm s.'),
()=>mkE('They can not to come tonight.','to','(bỏ to)','Sau can không dùng to.'),
()=>mkE('Could you helping me, please?','helping','help','Sau could dùng động từ nguyên thể.'),
()=>mkT('Viết lại dùng "can": "She knows how to swim."',['She can swim.'],'know how to V → can + V.','Bắt đầu bằng She'),
()=>mkT('Viết lại ở dạng phủ định: "I can play chess."',["I can't play chess.",'I cannot play chess.'],'can → can’t.','Bắt đầu bằng I'),
()=>mkT('Chuyển thành câu hỏi: "He could read at four."',['Could he read at four?'],'Đảo could lên trước chủ ngữ.','Nhớ dấu ?')],

gr_articles:[
()=>mkF('I had ___ egg and ___ glass of milk for breakfast.',['an a','an / a'],'egg → an (âm nguyên âm); glass → a. (Viết: an a)','Viết 2 mạo từ, cách nhau dấu cách'),
()=>mkF('She is ___ best student in our class.','the','So sánh nhất luôn có the.','Điền a / an / the'),
()=>mkO('There is an old tree in front of my house','There is + an + adj + N + giới từ.','Có một cây cổ thụ trước nhà tôi.'),
()=>mkO('The book on the table is very interesting','the vì đã xác định rõ cuốn nào.','Cuốn sách trên bàn rất thú vị.'),
()=>mkO('My mother is a nurse at a big hospital','Nghề nghiệp dùng a/an.','Mẹ tôi là y tá ở một bệnh viện lớn.'),
()=>mkE('She is an teacher.','an','a','teacher bắt đầu bằng âm phụ âm /t/ → a.'),
()=>mkE('I have breakfast at the seven o’clock.','the','(bỏ the)','Giờ giấc không dùng mạo từ.'),
()=>mkE('The Earth goes around a sun.','a','the','Vật duy nhất → the sun.'),
()=>mkT('Điền mạo từ rồi viết lại: "He is ___ engineer."',['He is an engineer.'],'engineer bắt đầu bằng âm nguyên âm → an.','Viết cả câu'),
()=>mkT('Điền mạo từ rồi viết lại: "I saw ___ cat. ___ cat was white."',['I saw a cat. The cat was white.'],'Lần đầu a, nhắc lại the.','Viết cả 2 câu'),
()=>mkT('Điền mạo từ rồi viết lại: "She plays ___ violin every day."',['She plays the violin every day.'],'Nhạc cụ dùng the.','Viết cả câu')],

gr_pcon_basic:[
()=>mkF('Listen! Someone ___ (sing) in the next room.','is singing','Listen! → đang diễn ra → is + V-ing.','Viết 2 từ'),
()=>mkF('The children ___ (swim) in the pool now.','are swimming','swim nhân đôi m → are swimming.','Viết 2 từ'),
()=>mkO('My father is washing the car now','S + is + V-ing + O + now.','Bố tôi đang rửa xe.'),
()=>mkO('Are you doing your homework at the moment','Are + S + V-ing + O?','Bạn đang làm bài tập à?'),
()=>mkO('They are not playing football today','Phủ định: are not + V-ing.','Hôm nay họ không chơi bóng đá.'),
()=>mkE('She is write a letter.','write','writing','Sau is phải là V-ing.'),
()=>mkE('We is watching TV.','is','are','We đi với are.'),
()=>mkE('He is siting on the chair.','siting','sitting','sit nhân đôi t trước -ing.'),
()=>mkT('Chuyển sang HTTD: "I read a book." (now)',['I am reading a book now.',"I'm reading a book now.",'I am reading a book.'],'read → am reading.','Bắt đầu bằng I'),
()=>mkT('Chuyển thành câu hỏi: "She is cooking."',['Is she cooking?'],'Đảo is lên trước chủ ngữ.','Nhớ dấu ?'),
()=>mkT('Viết lại ở dạng phủ định: "The baby is sleeping."',["The baby isn't sleeping.",'The baby is not sleeping.'],'Thêm not sau is.','Bắt đầu: The baby')],

gr_pastsimple:[
()=>mkF('Last summer we ___ (visit) our grandparents in Hue.','visited','Động từ có quy tắc → thêm -ed.','Chia động từ'),
()=>mkF('The film ___ (be) very boring last night.','was','Chủ ngữ số ít trong quá khứ → was.','Điền 1 từ'),
()=>mkO('She studied very hard for the last exam','S + V-ed + trạng ngữ.','Cô ấy đã học rất chăm cho kỳ thi vừa rồi.'),
()=>mkO('Did you go to the cinema yesterday','Did + S + V nguyên thể + O?','Hôm qua bạn có đi xem phim không?'),
()=>mkO('They were at home last Sunday evening','were + trạng ngữ nơi chốn + thời gian.','Tối Chủ nhật tuần trước họ ở nhà.'),
()=>mkE('I goed to school late yesterday.','goed','went','go là động từ bất quy tắc → went.'),
()=>mkE('She wasn’t go to the party.','wasn’t','didn’t','Động từ thường ở phủ định quá khứ dùng didn’t + V, không dùng wasn’t.'),
()=>mkE('We studyed English last year.','studyed','studied','Phụ âm + y → đổi thành -ied.'),
()=>mkT('Chia động từ rồi viết lại: "He (buy) a new bike last week."',['He bought a new bike last week.'],'buy → bought.','Viết cả câu'),
()=>mkT('Chuyển thành câu hỏi: "She was at school yesterday."',['Was she at school yesterday?'],'Đảo was lên trước chủ ngữ.','Nhớ dấu ?'),
()=>mkT('Viết lại ở dạng phủ định: "They visited the museum."',["They didn't visit the museum.",'They did not visit the museum.'],'visited → didn’t visit.','Bắt đầu bằng They')],

gr_future:[
()=>mkF('Don’t worry, I ___ (help) you with your bags.','will help','Quyết định ngay lúc nói → will + V.','Viết 2 từ'),
()=>mkF('They ___ (visit) Ha Noi next month. They booked the tickets already.','are going to visit','Đã lên kế hoạch → be going to.','Viết 4 từ'),
()=>mkO('I will call you as soon as I arrive','will + V, mệnh đề thời gian dùng hiện tại đơn.','Tôi sẽ gọi cho bạn ngay khi tôi đến.'),
()=>mkO('She is going to study abroad next year','be going to + V nguyên thể.','Năm sau cô ấy sẽ đi du học.'),
()=>mkO('Will it be sunny tomorrow morning','Will + S + V nguyên thể?','Sáng mai trời có nắng không?'),
()=>mkE('She will to come tomorrow.','to','(bỏ to)','Sau will không dùng to.'),
()=>mkE('We are going to visited the zoo.','visited','visit','Sau going to dùng động từ nguyên thể.'),
()=>mkE('He will not comes to the party.','comes','come','Sau will not dùng động từ nguyên thể.'),
()=>mkT('Viết lại ở dạng phủ định: "It will rain tomorrow."',["It won't rain tomorrow.",'It will not rain tomorrow.'],'will → won’t.','Bắt đầu bằng It'),
()=>mkT('Chuyển thành câu hỏi: "They are going to move house."',['Are they going to move house?'],'Đảo are lên trước chủ ngữ.','Nhớ dấu ?'),
()=>mkT('Viết lại dùng "will": "I am going to send you an email." (quyết định ngay)',['I will send you an email.',"I'll send you an email."],'am going to send → will send.','Bắt đầu bằng I')],

gr_pcon:[
()=>mkF('Where is Nam? He ___ (have) lunch in the canteen.','is having','Đang diễn ra → is + V-ing.','Viết 2 từ'),
()=>mkF('This week my class ___ (prepare) for the school festival.','is preparing','this week → giai đoạn hiện tại → tiếp diễn.','Viết 2 từ'),
()=>mkO('My brother is playing games in his room','S + is + V-ing + O + nơi chốn.','Em trai tôi đang chơi game trong phòng.'),
()=>mkO('We are meeting our teacher tomorrow afternoon','Kế hoạch chắc chắn dùng hiện tại tiếp diễn.','Chiều mai chúng tôi sẽ gặp cô giáo.'),
()=>mkO('Why are you laughing so loudly','Wh- + are + S + V-ing?','Sao bạn lại cười to thế?'),
()=>mkE('I am wanting a new phone.','wanting','I want (bỏ am)','want là động từ trạng thái, không chia tiếp diễn.'),
()=>mkE('She are reading a novel.','are','is','She đi với is.'),
()=>mkE('They are studing for the test.','studing','studying','study giữ nguyên y, thêm -ing → studying.'),
()=>mkT('Chuyển sang HTTD: "He writes an email." (at the moment)',['He is writing an email at the moment.','He is writing an email.'],'writes → is writing.','Bắt đầu bằng He'),
()=>mkT('Viết lại ở dạng phủ định: "We are waiting for the bus."',["We aren't waiting for the bus.",'We are not waiting for the bus.'],'Thêm not sau are.','Bắt đầu bằng We'),
()=>mkT('Chuyển thành câu hỏi: "They are having dinner."',['Are they having dinner?'],'Đảo are lên trước chủ ngữ.','Nhớ dấu ?')],

gr_compare:[
()=>mkF('My house is ___ (big) than yours.','bigger','big nhân đôi g → bigger.','Chia tính từ'),
()=>mkF('Lan is ___ (intelligent) student in her class.','the most intelligent','Tính từ dài, so sánh nhất → the most + adj.','Viết 3 từ'),
()=>mkO('This exercise is easier than the last one','adj-er + than.','Bài tập này dễ hơn bài trước.'),
()=>mkO('She is the youngest girl in the group','the + adj-est + N + in + nhóm.','Cô ấy là bạn nữ nhỏ tuổi nhất nhóm.'),
()=>mkO('My phone is as expensive as his','as + adj nguyên mẫu + as.','Điện thoại của tôi đắt bằng của anh ấy.'),
()=>mkE('This is the most tallest building in the city.','most','(bỏ most)','tall là tính từ ngắn, chỉ dùng the tallest.'),
()=>mkE('He is more clever than his brother.','more','(bỏ more) → cleverer','clever là tính từ ngắn 2 âm tiết → cleverer.'),
()=>mkE('She sings more good than me.','good','well (→ better)','Bổ nghĩa cho động từ phải dùng trạng từ: sings better.'),
()=>mkT('Viết lại dùng so sánh nhất: "No mountain in Viet Nam is higher than Fansipan."',['Fansipan is the highest mountain in Viet Nam.'],'Chuyển sang the highest.','Bắt đầu: Fansipan'),
()=>mkT('Viết lại dùng "as … as": "My bag and your bag are the same weight."',['My bag is as heavy as yours.','My bag is as heavy as your bag.'],'Bằng nhau → as + adj + as.','Bắt đầu: My bag'),
()=>mkT('Viết lại dùng so sánh hơn: "This film is boring. That film is more boring." (that film)',['That film is more boring than this film.','That film is more boring than this one.'],'Tính từ dài → more + adj + than.','Bắt đầu: That film')],

gr_modal:[
()=>mkF('You ___ (not / should) stay up late before an exam.','shouldn’t','Lời khuyên phủ định → shouldn’t.','Viết 1 từ'),
()=>mkF('In the library we ___ keep quiet. It is a rule.','must','Nội quy → must.','Điền 1 từ'),
()=>mkO('Students must wear uniforms on Monday','Nội quy: S + must + V + O + thời gian.','Học sinh phải mặc đồng phục vào thứ Hai.'),
()=>mkO('You should drink more water every day','Lời khuyên: S + should + V + O.','Bạn nên uống nhiều nước hơn mỗi ngày.'),
()=>mkO('We do not have to go to school tomorrow','Không cần thiết: do not have to + V.','Ngày mai chúng tôi không phải đi học.'),
()=>mkE('She musts finish her homework.','musts','must','must không bao giờ thêm s.'),
()=>mkE('He have to wake up early.','have','has','He là ngôi 3 số ít → has to.'),
()=>mkE('You mustn’t to be late.','to','(bỏ to)','Sau mustn’t dùng động từ nguyên thể.'),
()=>mkT('Viết lại dùng "must": "It is necessary for you to wear a helmet."',['You must wear a helmet.'],'Bắt buộc → must + V.','Bắt đầu bằng You'),
()=>mkT('Viết lại dùng "shouldn’t": "It is not a good idea to eat too much sugar."',["You shouldn't eat too much sugar."],'Khuyên không nên → shouldn’t + V.','Bắt đầu bằng You'),
()=>mkT('Viết lại dùng "doesn’t have to": "It is not necessary for Lan to come early."',["Lan doesn't have to come early."],'Không cần → doesn’t have to + V.','Bắt đầu bằng Lan')],

gr_quant:[
()=>mkF('Would you like ___ tea?','some','Câu mời dùng some dù là câu hỏi.','Điền 1 từ'),
()=>mkF('There are only ___ (a few / a little) eggs left.','a few','eggs đếm được → a few.','Viết 2 từ'),
()=>mkO('There is a lot of rice in the kitchen','There is + a lot of + N không đếm được.','Có rất nhiều gạo trong bếp.'),
()=>mkO('How many students are there in your class','How many + N số nhiều + are there?','Lớp bạn có bao nhiêu học sinh?'),
()=>mkO('We do not have any milk today','Phủ định dùng any.','Hôm nay chúng tôi không có sữa.'),
()=>mkE('How much apples do you want?','much','many','apples đếm được → How many.'),
()=>mkE('There are a little chairs in the room.','little','few','chairs đếm được → a few.'),
()=>mkE('I have some moneys in my pocket.','moneys','money','money là danh từ không đếm được, không thêm s.'),
()=>mkT('Viết lại ở dạng phủ định: "There is some sugar in the cup."',["There isn't any sugar in the cup.",'There is not any sugar in the cup.'],'some → any trong câu phủ định.','Bắt đầu: There'),
()=>mkT('Đặt câu hỏi cho phần gạch chân: "There are TWENTY students in my class."',['How many students are there in your class?','How many students are there in my class?'],'Hỏi số lượng đếm được → How many.','Nhớ dấu ?'),
()=>mkT('Viết lại dùng "a lot of": "There is much rain in this season."',['There is a lot of rain in this season.'],'Câu khẳng định nên dùng a lot of thay much.','Viết cả câu')]

};
Object.assign(GR_MORE2,{

gr_pastcon:[
()=>mkF('This time yesterday I ___ (travel) to Da Nang.',['was travelling','was traveling'],'Thời điểm cụ thể trong QK → was + V-ing.','Viết 2 từ'),
()=>mkF('While the teacher ___ (explain) the lesson, some students were talking.','was explaining','While + QKTD.','Viết 2 từ'),
()=>mkO('The children were sleeping when their mother came home','QKTD + when + QK đơn.','Bọn trẻ đang ngủ khi mẹ về nhà.'),
()=>mkO('What were you doing at nine last night','Wh- + were + S + V-ing?','Chín giờ tối qua bạn đang làm gì?'),
()=>mkO('It was raining heavily all afternoon yesterday','all afternoon → hành động kéo dài → QKTD.','Chiều qua trời mưa to suốt.'),
()=>mkE('I was cook dinner when he called.','cook','cooking','Sau was phải là V-ing.'),
()=>mkE('While she was walking, she was seeing an accident.','was','saw','Hành động ngắn xen vào dùng quá khứ đơn: saw.'),
()=>mkE('We were watch TV at eight o’clock.','watch','watching','were + V-ing.'),
()=>mkT('Nối 2 câu bằng "when": "She was cooking. The phone rang."',['She was cooking when the phone rang.'],'Hành động dài + when + hành động ngắn.','Viết cả câu'),
()=>mkT('Chia động từ rồi viết lại: "At 7 p.m. yesterday, they (play) football."',['At 7 p.m. yesterday, they were playing football.'],'Mốc thời gian QK → were playing.','Viết cả câu'),
()=>mkT('Chuyển thành câu hỏi: "He was reading a book."',['Was he reading a book?'],'Đảo was lên trước chủ ngữ.','Nhớ dấu ?')],

gr_past:[
()=>mkF('She ___ (leave) the house at six this morning.','left','leave → left.','Chia động từ'),
()=>mkF('They ___ (drink) all the juice yesterday.','drank','drink → drank.','Chia động từ'),
()=>mkO('He caught the last bus home last night','S + V2 + O + trạng ngữ.','Tối qua anh ấy bắt kịp chuyến xe buýt cuối.'),
()=>mkO('We saw a beautiful rainbow after the rain','see → saw.','Chúng tôi thấy một cầu vồng đẹp sau cơn mưa.'),
()=>mkO('She put the keys on the table yesterday','put giữ nguyên ở quá khứ.','Hôm qua cô ấy để chìa khoá trên bàn.'),
()=>mkE('I teached my brother to swim.','teached','taught','teach → taught.'),
()=>mkE('He bringed his umbrella to school.','bringed','brought','bring → brought.'),
()=>mkE('Did she wrote the letter?','wrote','write','Sau Did dùng động từ nguyên thể.'),
()=>mkT('Chia động từ rồi viết lại: "They (eat) pho for breakfast yesterday."',['They ate pho for breakfast yesterday.'],'eat → ate.','Viết cả câu'),
()=>mkT('Viết lại ở dạng phủ định: "She found her wallet."',["She didn't find her wallet.",'She did not find her wallet.'],'found → didn’t find (về nguyên thể).','Bắt đầu bằng She'),
()=>mkT('Chuyển thành câu hỏi: "He took a lot of photos."',['Did he take a lot of photos?'],'Did + S + V nguyên thể (take).','Nhớ dấu ?')],

gr_passive:[
()=>mkF('The windows ___ (clean) every week.','are cleaned','HT đơn bị động số nhiều → are + V3.','Viết 2 từ'),
()=>mkF('This song ___ (write) by Trinh Cong Son.','was written','QK đơn bị động: was + V3.','Viết 2 từ'),
()=>mkO('The classroom is cleaned by the students every day','S + is + V3 + by + tác nhân + thời gian.','Lớp học được học sinh dọn mỗi ngày.'),
()=>mkO('A lot of trees have been planted in our school','HTHT bị động: have been + V3.','Rất nhiều cây đã được trồng trong trường tôi.'),
()=>mkO('These shoes must be washed by hand','Modal bị động: must be + V3.','Đôi giày này phải giặt bằng tay.'),
()=>mkE('The letter was write yesterday.','write','written','Bị động dùng V3: written.'),
()=>mkE('The room is being clean now.','clean','cleaned','is being + V3 → is being cleaned.'),
()=>mkE('My bike were stolen last night.','were','was','My bike là số ít → was.'),
()=>mkT('Chuyển sang bị động: "People speak English in many countries."',['English is spoken in many countries.'],'People không xác định → bỏ by; HT đơn bị động.','Bắt đầu: English'),
()=>mkT('Chuyển sang bị động: "They will finish the project next week."',['The project will be finished next week.'],'Tương lai bị động: will be + V3.','Bắt đầu: The project'),
()=>mkT('Chuyển sang bị động: "My mother is cooking dinner."',['Dinner is being cooked by my mother.'],'HTTD bị động: is being + V3.','Bắt đầu: Dinner')],

gr_gerund:[
()=>mkF('He avoided ___ (answer) my question.','answering','avoid + V-ing.','Chia động từ'),
()=>mkF('We hope ___ (see) you again soon.','to see','hope + to V.','Viết 2 từ'),
()=>mkO('She is good at solving difficult problems','Sau giới từ at dùng V-ing.','Cô ấy giỏi giải những bài khó.'),
()=>mkO('They decided to move to a new city','decide + to V.','Họ quyết định chuyển tới thành phố mới.'),
()=>mkO('I am used to getting up early now','be used to + V-ing.','Giờ tôi đã quen dậy sớm.'),
()=>mkE('I look forward to meet you.','meet','meeting','look forward to + V-ing (to là giới từ).'),
()=>mkE('She practises to play the piano every day.','to','(bỏ to) → playing','practise + V-ing.'),
()=>mkE('My mother made me to clean my room.','to','(bỏ to)','make sb + V nguyên thể, không có to.'),
()=>mkT('Nối thành một câu: "She enjoys. She reads novels."',['She enjoys reading novels.'],'enjoy + V-ing.','Bắt đầu bằng She'),
()=>mkT('Nối thành một câu: "They promised. They will come early."',['They promised to come early.'],'promise + to V.','Bắt đầu bằng They'),
()=>mkT('Viết lại: "He is interested in ___ (learn) about history."',['He is interested in learning about history.'],'Sau giới từ in dùng V-ing.','Viết cả câu')],

gr_perfect:[
()=>mkF('They ___ (know) each other since childhood.','have known','since → HTHT: have + V3.','Viết 2 từ'),
()=>mkF('My brother ___ just ___ (arrive) home.',['has arrived','has just arrived'],'just → has + V3. (Viết: has / arrived)','Viết 2 từ cách nhau dấu cách'),
()=>mkO('I have never been to Japan before','have never been to + nơi chốn.','Tôi chưa từng đến Nhật Bản.'),
()=>mkO('She has worked here for three years','have/has + V3 + for + khoảng thời gian.','Cô ấy làm việc ở đây được ba năm rồi.'),
()=>mkO('Have you finished your homework yet','Have + S + V3 + yet?','Bạn làm xong bài tập chưa?'),
()=>mkE('He has went to school already.','went','gone','HTHT dùng V3: has gone.'),
()=>mkE('They have lived here since ten years.','since','for','ten years là khoảng thời gian → for.'),
()=>mkE('She have finished her report.','have','has','She là ngôi 3 số ít → has.'),
()=>mkT('Viết lại dùng "since": "She started working here in 2020."',['She has worked here since 2020.','She has been working here since 2020.'],'Bắt đầu QK, kéo dài tới nay → has worked since.','Bắt đầu bằng She has'),
()=>mkT('Viết lại ở dạng phủ định: "I have seen that film."',["I haven't seen that film.",'I have not seen that film.'],'Thêm not sau have.','Bắt đầu bằng I'),
()=>mkT('Chuyển thành câu hỏi: "She has visited Ha Long Bay."',['Has she visited Ha Long Bay?'],'Đảo has lên trước chủ ngữ.','Nhớ dấu ?')],

gr_conditional:[
()=>mkF('If you ___ (not / hurry), you will be late for school.',["don't hurry",'do not hurry'],'Loại 1: mệnh đề If dùng hiện tại đơn.','Viết 2-3 từ'),
()=>mkF('If we ___ (live) near the sea, we would swim every day.','lived','Loại 2: If + quá khứ đơn.','Chia động từ'),
()=>mkO('If you mix blue and yellow you get green','Loại 0: chân lí, cả hai vế hiện tại đơn.','Nếu trộn xanh dương với vàng, bạn được màu xanh lá.'),
()=>mkO('If I were a bird I would fly everywhere','Loại 2: If + were, would + V.','Nếu tôi là chim, tôi sẽ bay khắp nơi.'),
()=>mkO('She would have passed if she had studied harder','Loại 3 đảo vế: would have V3 + if + had V3.','Cô ấy đã đỗ nếu học chăm hơn.'),
()=>mkE('If it rains tomorrow, we cancel the trip.','cancel','will cancel','Vế chính loại 1 dùng will + V.'),
()=>mkE('If I was you, I would tell the truth.','was','were','Loại 2 dùng were cho mọi ngôi.'),
()=>mkE('If he had studied, he would passed the exam.','would','would have','Loại 3: would have + V3.'),
()=>mkT('Nối thành câu điều kiện loại 1: "You leave now. You will catch the bus."',['If you leave now, you will catch the bus.'],'If + HT đơn, will + V.','Bắt đầu: If'),
()=>mkT('Viết câu điều kiện loại 2: "I don’t know his address, so I don’t write to him."',["If I knew his address, I would write to him."],'Trái hiện tại → If + QK đơn, would + V.','Bắt đầu: If I knew'),
()=>mkT('Viết lại dùng "Unless": "If it doesn’t rain, we will go camping."',['Unless it rains, we will go camping.'],'If … not = Unless (bỏ phủ định).','Bắt đầu: Unless')],

gr_cond1:[
()=>mkF('If the weather ___ (be) nice tomorrow, we will have a picnic.','is','Mệnh đề If loại 1 dùng hiện tại đơn.','Điền 1 từ'),
()=>mkF('If you finish early, you ___ (can) go home.','can','Có thể thay will bằng can.','Điền 1 từ'),
()=>mkO('If you eat too much you will feel sick','If + HT đơn, will + V.','Nếu ăn quá nhiều, bạn sẽ thấy khó chịu.'),
()=>mkO('We will stay at home if it rains','Vế chính trước, mệnh đề if sau.','Chúng tôi sẽ ở nhà nếu trời mưa.'),
()=>mkO('If you see Nam tell him to call me','Vế chính có thể là câu mệnh lệnh.','Nếu gặp Nam, bảo bạn ấy gọi cho mình nhé.'),
()=>mkE('If she will study hard, she will pass.','will','(bỏ will) → studies','Mệnh đề If loại 1 dùng hiện tại đơn.'),
()=>mkE('If it is cold, we wear warm clothes tomorrow.','wear','will wear','Vế chính loại 1 dùng will + V.'),
()=>mkE('Unless you don’t practise, you will not improve.','don’t','(bỏ don’t)','Unless đã mang nghĩa phủ định.'),
()=>mkT('Nối thành câu điều kiện loại 1: "It is sunny. We will go swimming."',['If it is sunny, we will go swimming.'],'If + HT đơn, will + V.','Bắt đầu: If'),
()=>mkT('Viết lại dùng "Unless": "If you don’t study, you won’t pass the exam."',["Unless you study, you won't pass the exam.",'Unless you study, you will not pass the exam.'],'If … not = Unless.','Bắt đầu: Unless'),
()=>mkT('Nối thành câu điều kiện loại 1: "You get up late. You will miss the bus."',['If you get up late, you will miss the bus.'],'If + HT đơn, will + V.','Bắt đầu: If')],

gr_cond2:[
()=>mkF('If she ___ (not / be) so busy, she would join us.',["weren't",'were not'],'Loại 2 dùng were cho mọi ngôi.','Viết 1-2 từ'),
()=>mkF('If they lived closer, we ___ (meet) more often.','would meet','Vế chính loại 2: would + V.','Viết 2 từ'),
()=>mkO('If I spoke Japanese I would work in Tokyo','If + QK đơn, would + V.','Nếu tôi nói được tiếng Nhật, tôi sẽ làm việc ở Tokyo.'),
()=>mkO('She would buy that house if she had enough money','Vế chính trước, mệnh đề if sau.','Cô ấy sẽ mua căn nhà đó nếu có đủ tiền.'),
()=>mkO('If I were you I would not say that','Lời khuyên: If I were you, I would not + V.','Nếu tôi là bạn, tôi sẽ không nói vậy.'),
()=>mkE('If I was rich, I would travel the world.','was','were','Loại 2 dùng were cho mọi ngôi.'),
()=>mkE('If he had more time, he will learn the guitar.','will','would','Vế chính loại 2 dùng would + V.'),
()=>mkE('If she would know the answer, she would tell us.','would','(bỏ would) → knew','Mệnh đề If loại 2 dùng quá khứ đơn.'),
()=>mkT('Viết câu điều kiện loại 2: "I am not tall, so I don’t play basketball."',['If I were tall, I would play basketball.'],'Trái hiện tại → If + were, would + V.','Bắt đầu: If I were'),
()=>mkT('Viết lại thành lời khuyên: "You should apologise to her." (dùng If I were you)',['If I were you, I would apologise to her.'],'If I were you, I would + V.','Bắt đầu: If I were you'),
()=>mkT('Viết câu điều kiện loại 2: "She doesn’t have a car, so she takes the bus."',['If she had a car, she would not take the bus.',"If she had a car, she wouldn't take the bus."],'Trái hiện tại → If + QK đơn, would + V.','Bắt đầu: If she had')],

gr_relative:[
()=>mkF('The film ___ we watched last night was excellent.',['which','that'],'Vật, làm tân ngữ → which / that.','Điền 1 từ'),
()=>mkF('I still remember the summer ___ we first met.','when','Thời gian → when.','Điền 1 từ'),
()=>mkO('The woman who is standing there is my aunt','N + who + V + be + tân ngữ.','Người phụ nữ đang đứng đằng kia là cô tôi.'),
()=>mkO('This is the restaurant where we had dinner','Nơi chốn → where.','Đây là nhà hàng chúng tôi đã ăn tối.'),
()=>mkO('I have a friend whose mother is a famous singer','whose + N (sở hữu).','Tôi có một người bạn có mẹ là ca sĩ nổi tiếng.'),
()=>mkE('Ha Noi, that is the capital, is very old.','that','which','Sau dấu phẩy không dùng that; vật → which.'),
()=>mkE('The man which lives next door is a doctor.','which','who','Người → who.'),
()=>mkE('This is the house where I bought last year.','where','which','Ở đây house là tân ngữ của bought → dùng which/that, không phải where.'),
()=>mkT('Nối 2 câu: "The book is interesting. I borrowed it from the library."',['The book which I borrowed from the library is interesting.','The book that I borrowed from the library is interesting.'],'Vật, làm tân ngữ → which/that.','Bắt đầu: The book'),
()=>mkT('Nối 2 câu: "I know a girl. Her father is a pilot."',['I know a girl whose father is a pilot.'],'Sở hữu → whose.','Bắt đầu: I know a girl'),
()=>mkT('Nối 2 câu: "That is the park. We played there when we were children."',['That is the park where we played when we were children.'],'Nơi chốn → where.','Bắt đầu: That is the park')],

gr_reported:[
()=>mkF('"We are busy," they said. → They said they ___ busy.','were','are → were.','Điền 1 từ'),
()=>mkF('"I have finished," she said. → She said she ___ finished.','had','have → had.','Điền 1 từ'),
()=>mkO('He said that he would come the next day','will → would; tomorrow → the next day.','Anh ấy nói hôm sau sẽ đến.'),
()=>mkO('She asked me if I liked Vietnamese food','Câu hỏi Yes/No → asked + if + S + V.','Cô ấy hỏi tôi có thích món Việt không.'),
()=>mkO('The teacher told us to open our books','told + O + to V.','Cô giáo bảo chúng tôi mở sách ra.'),
()=>mkE('She said me that she was tired.','said','told','said to me hoặc told me.'),
()=>mkE('He asked me what did I want.','did','(bỏ did) → what I wanted','Câu hỏi tường thuật về trật tự khẳng định.'),
()=>mkE('She told me don’t be late.','don’t','not to','Mệnh lệnh phủ định → told me not to be late.'),
()=>mkT('Chuyển sang câu tường thuật: "I am watching TV," he said.',['He said that he was watching TV.','He said he was watching TV.'],'am watching → was watching; I → he.','Bắt đầu: He said'),
()=>mkT('Chuyển sang câu tường thuật: "Do you like coffee?" she asked me.',['She asked me if I liked coffee.','She asked me whether I liked coffee.'],'Câu hỏi Yes/No → asked + if/whether + S + V lùi thì.','Bắt đầu: She asked me'),
()=>mkT('Chuyển sang câu tường thuật: "Don’t open the window," he told me.',['He told me not to open the window.'],'Mệnh lệnh phủ định → told + O + not to V.','Bắt đầu: He told me')]

});

/* ===== Lý thuyết · nhãn lớp · bài tập bổ sung cho 12 chuyên đề mới ===== */
Object.assign(GR_META,{
gr_nouns:{gr:[4, 5, 6, 7],
 theory:{use:["Phân biệt danh từ đếm được và không đếm được để chọn đúng từ chỉ lượng", "Chia đúng số nhiều và chia đúng động từ theo danh từ"],form:[["Đếm được", "a book → two books", "I have <b>two books</b>."], ["Không đếm được", "water, music, advice (không có số nhiều)", "I need <b>some water</b>."], ["+ es", "s, ss, sh, ch, x, o + es", "box → <b>boxes</b>, potato → <b>potatoes</b>"], ["phụ âm + y → ies", "city → cities", "There are many <b>cities</b>."], ["f / fe → ves", "leaf → leaves, knife → knives", "The <b>leaves</b> are falling."], ["Bất quy tắc", "man→men · child→children · foot→feet · tooth→teeth · person→people", "Three <b>children</b> are playing."]],sign:"Đếm được dùng many/few/a few · Không đếm được dùng much/little/a little · Cả hai dùng some/any/a lot of",tips:["Các từ sau KHÔNG đếm được dù tiếng Việt nghe như đếm được: <b>advice, information, news, furniture, luggage, equipment, homework, money</b>", "<b>news</b> có đuôi s nhưng chia động từ <b>số ít</b>: The news <b>is</b> good.", "<b>people</b> và <b>police</b> luôn chia <b>số nhiều</b>: People <b>are</b>... / The police <b>are</b>...", "Muốn đếm danh từ không đếm được thì mượn đơn vị: <b>a piece of advice</b>, <b>two glasses of water</b>"],ex:[["I need some information about the course.", "Tôi cần một ít thông tin về khoá học."], ["She gave me two useful pieces of advice.", "Cô ấy cho tôi hai lời khuyên hữu ích."], ["There are three children in the garden.", "Có ba đứa trẻ trong vườn."], ["The news was very surprising.", "Tin tức đó rất đáng ngạc nhiên."], ["How many loaves of bread do you want?", "Bạn muốn mấy ổ bánh mì?"]]},
 more:[
  ()=>({t:'fill',q:"I would like two ___ of coffee, please.",ans:["cups"],e:"coffee ở đây là chất lỏng → mượn đơn vị cup, số nhiều cups.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The Vietnamese ___ famous for their hospitality.",ans:["are"],e:"\"The + tính từ chỉ dân tộc\" chỉ toàn bộ dân tộc → động từ số nhiều.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"Ten thousand dollars ___ a large sum for them.",ans:["is"],e:"Số tiền/khoảng cách/thời gian coi là một khối → động từ số ít.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"Two-thirds of the land ___ been flooded.",ans:["has"],e:"Phân số + danh từ không đếm được (land) → động từ số ít.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"There is little ___ left in the jar.",ans:["sugar"],e:"little + danh từ không đếm được; sugar không thêm s.",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"I would like two cup of coffee, please.",wrong:"cup",right:"cups",e:"coffee ở đây là chất lỏng → mượn đơn vị cup, số nhiều cups."}),
  ()=>({t:'error',sent:"The Vietnamese is famous for their hospitality.",wrong:"is",right:"are",e:"\"The + tính từ chỉ dân tộc\" chỉ toàn bộ dân tộc → động từ số nhiều."}),
  ()=>({t:'error',sent:"Ten thousand dollars are a large sum for them.",wrong:"are",right:"is",e:"Số tiền/khoảng cách/thời gian coi là một khối → động từ số ít."}),
  ()=>({t:'error',sent:"Two-thirds of the land have been flooded.",wrong:"have",right:"has",e:"Phân số + danh từ không đếm được (land) → động từ số ít."}),
  ()=>({t:'error',sent:"There is little sugars left in the jar.",wrong:"sugars",right:"sugar",e:"little + danh từ không đếm được; sugar không thêm s."}),
  ()=>({t:'order',sent:"The Vietnamese are famous for their hospitality",e:"\"The + tính từ chỉ dân tộc\" chỉ toàn bộ dân tộc → động từ số nhiều.",vn:""}),
  ()=>({t:'order',sent:"Ten thousand dollars is a large sum for them",e:"Số tiền/khoảng cách/thời gian coi là một khối → động từ số ít.",vn:""}),
  ()=>({t:'order',sent:"Two-thirds of the land has been flooded",e:"Phân số + danh từ không đếm được (land) → động từ số ít.",vn:""}),
  ()=>({t:'order',sent:"There is little sugar left in the jar",e:"little + danh từ không đếm được; sugar không thêm s.",vn:""}),
  ()=>({t:'order',sent:"She bought three tomatoes at the market",e:"Danh từ tận cùng phụ âm + o → thêm es.",vn:""})
 ]},
gr_adjadv:{gr:[6, 7, 8, 9],
 theory:{use:["Tính từ bổ nghĩa cho danh từ; trạng từ bổ nghĩa cho động từ, tính từ, cả câu", "Sắp xếp nhiều tính từ đứng trước một danh từ cho đúng trật tự"],form:[["Tính từ", "đứng trước N; đứng sau be/seem/look", "a <b>careful</b> driver · She is <b>careful</b>."], ["Trạng từ", "đứng sau động từ thường", "He drives <b>carefully</b>."], ["+ ly", "quick → quickly", "Please come <b>quickly</b>."], ["phụ âm + y → ily", "happy → happily", "They played <b>happily</b>."], ["ic → ically", "automatic → automatically", "The door opens <b>automatically</b>."], ["Bất quy tắc", "good → <b>well</b> · fast → fast · hard → hard", "He speaks English <b>well</b>."]],sign:"Trật tự tính từ OSASCOMP: Opinion → Size → Age → Shape → Colour → Origin → Material → Purpose",tips:["Sau <b>be, seem, look, feel, taste, smell, sound, become, get</b> dùng <b>TÍNH TỪ</b>: It tastes <b>good</b> (không phải well)", "<b>hard</b> = chăm chỉ ≠ <b>hardly</b> = hầu như không", "<b>late</b> = muộn ≠ <b>lately</b> = gần đây · <b>near</b> = gần ≠ <b>nearly</b> = gần như", "Từ tận cùng -ly chưa chắc là trạng từ: <b>friendly, lovely, lonely, silly</b> là TÍNH TỪ"],ex:[["He speaks English very fluently.", "Anh ấy nói tiếng Anh rất trôi chảy."], ["This soup tastes delicious.", "Món súp này ngon."], ["She bought a beautiful small round wooden table.", "Cô ấy mua một cái bàn gỗ tròn nhỏ xinh."], ["He works hard but earns little.", "Anh ấy làm việc chăm chỉ mà kiếm được ít."], ["I hardly know him.", "Tôi hầu như không quen anh ta."]]},
 more:[
  ()=>({t:'fill',q:"This is an ___ old Vietnamese painting.",ans:["interesting"],e:"Đứng trong chuỗi tính từ bổ nghĩa cho painting → tính từ opinion đứng đầu.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"Not until he apologised ___ to speak to him again.",ans:["did she agree"],e:"\"Not until ...\" đứng đầu câu → mệnh đề chính đảo ngữ.",hint:"Điền 3 từ"}),
  ()=>({t:'fill',q:"It is ___ a difficult problem that nobody can solve it.",ans:["such"],e:"such + a/an + adj + N + that; so chỉ đi trực tiếp với tính từ.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The children played ___ in the garden.",ans:["happily"],e:"Bổ nghĩa cho động từ played → trạng từ; happy → happily.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The higher we climbed, the ___ it became.",ans:["colder"],e:"So sánh kép: The + comparative, the + comparative.",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"This is an interestingly old Vietnamese painting.",wrong:"interestingly",right:"interesting",e:"Đứng trong chuỗi tính từ bổ nghĩa cho painting → tính từ opinion đứng đầu."}),
  ()=>({t:'error',sent:"It is too a difficult problem that nobody can solve it.",wrong:"too",right:"such",e:"such + a/an + adj + N + that; so chỉ đi trực tiếp với tính từ."}),
  ()=>({t:'error',sent:"The children played happy in the garden.",wrong:"happy",right:"happily",e:"Bổ nghĩa cho động từ played → trạng từ; happy → happily."}),
  ()=>({t:'error',sent:"The higher we climbed, the cold it became.",wrong:"cold",right:"colder",e:"So sánh kép: The + comparative, the + comparative."}),
  ()=>({t:'error',sent:"She looks tiredly today.",wrong:"tiredly",right:"tired",e:"Sau look mang nghĩa \"trông có vẻ\" → tính từ."}),
  ()=>({t:'order',sent:"This is an interesting old Vietnamese painting",e:"Đứng trong chuỗi tính từ bổ nghĩa cho painting → tính từ opinion đứng đầu.",vn:""}),
  ()=>({t:'order',sent:"She works harder than her colleagues",e:"hard → harder, không dùng more hard.",vn:""}),
  ()=>({t:'order',sent:"The test was too difficult for us",e:"too + tính từ = quá đến mức không làm được.",vn:""}),
  ()=>({t:'order',sent:"He gave me a polite answer",e:"Trước danh từ answer → tính từ.",vn:""}),
  ()=>({t:'order',sent:"She bought a small black leather handbag",e:"Trật tự OSASCOMP: Size - Colour - Material.",vn:""})
 ]},
gr_questions:{gr:[4, 5, 6, 7],
 theory:{use:["Đặt câu hỏi Yes/No và câu hỏi Wh- đúng trật tự", "Phân biệt hỏi chủ ngữ với hỏi tân ngữ, và dùng câu hỏi gián tiếp cho lịch sự"],form:[["Yes/No", "Trợ ĐT + S + V?", "<b>Do you</b> like tea?"], ["Wh- hỏi tân ngữ", "Wh- + trợ ĐT + S + V?", "What <b>did you</b> buy?"], ["Wh- hỏi chủ ngữ", "Wh- + V? (KHÔNG đảo)", "Who <b>broke</b> the window?"], ["Câu hỏi gián tiếp", "... + Wh-/if + S + V", "Can you tell me where <b>he lives</b>?"]],sign:"What/Who/Which/Whose/When/Where/Why · How long (thời gian) · How often (tần suất) · How far (khoảng cách) · How much/many (số lượng)",tips:["Thử trả lời: nếu câu trả lời đứng ĐẦU câu thì là hỏi chủ ngữ → <b>không đảo</b>, không dùng do/does/did", "Câu hỏi gián tiếp <b>KHÔNG đảo ngữ</b>: Do you know where <b>the station is</b>?", "Đã có <b>did</b> thì động từ chính giữ nguyên mẫu: Where <b>did</b> he <b>go</b>?", "<b>What ... like?</b> hỏi về tính chất, đặc điểm: What is your teacher <b>like</b>?"],ex:[["Who teaches you English?", "Ai dạy em tiếng Anh?"], ["Who do you admire most?", "Em ngưỡng mộ ai nhất?"], ["How long have you lived here?", "Em sống ở đây bao lâu rồi?"], ["Could you tell me where the museum is?", "Bạn chỉ giúp bảo tàng ở đâu được không?"], ["Whose bag is this?", "Cái cặp này của ai?"]]},
 more:[
  ()=>({t:'fill',q:"Hardly ever ___ to the cinema these days.",ans:["do we go"],e:"\"Hardly ever\" đầu câu → đảo ngữ với trợ động từ do.",hint:"Điền 3 từ"}),
  ()=>({t:'fill',q:"___ do you go swimming? — Twice a week.",ans:["How often"],e:"Hỏi mức độ thường xuyên → How often.",hint:"Điền 2 từ"}),
  ()=>({t:'fill',q:"___ is it from here to the beach?",ans:["How far"],e:"Hỏi khoảng cách → How far.",hint:"Điền 2 từ"}),
  ()=>({t:'fill',q:"___ were you late for class?",ans:["Why"],e:"Hỏi lý do → Why.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ did you meet at the party?",ans:["Who"],e:"Hỏi tân ngữ → có did, chủ ngữ you đứng sau.",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"What were you late for class?",wrong:"What",right:"Why",e:"Hỏi lý do → Why."}),
  ()=>({t:'error',sent:"Whose did you meet at the party?",wrong:"Whose",right:"Who",e:"Hỏi tân ngữ → có did, chủ ngữ you đứng sau."}),
  ()=>({t:'error',sent:"Are you like coffee?",wrong:"Are",right:"Do",e:"Chủ ngữ you, động từ thường → trợ động từ Do."}),
  ()=>({t:'error',sent:"Where does he go last Sunday?",wrong:"does",right:"did",e:"last Sunday → quá khứ, động từ thường → did."}),
  ()=>({t:'error',sent:"What T-shirt do you prefer, the red one or the blue one?",wrong:"What",right:"Which",e:"Lựa chọn có giới hạn (hai cái) → Which."}),
  ()=>({t:'order',sent:"Never before have I visited such a beautiful city",e:"\"Never before\" đầu câu → đảo trợ động từ lên trước chủ ngữ.",vn:""}),
  ()=>({t:'order',sent:"I wonder if she will attend the meeting tomorrow",e:"Sau I wonder if → trật tự câu kể, không đảo.",vn:""}),
  ()=>({t:'order',sent:"He asked me if I had finished the report",e:"Tường thuật câu hỏi Yes/No → dùng if hoặc whether.",vn:""})
 ]},
gr_there:{gr:[4, 5, 6],
 theory:{use:["Nói về sự tồn tại: có cái gì đó ở đâu đó", "Dùng It cho thời tiết, thời gian, khoảng cách và thay cho mệnh đề dài"],form:[["Số ít / không đếm được", "There <b>is</b> + N", "<b>There is</b> a book on the desk."], ["Số nhiều", "There <b>are</b> + N", "<b>There are</b> two books."], ["Quá khứ", "There was / There were", "<b>There were</b> many guests."], ["Tương lai / hoàn thành", "There will be · There has been · There used to be", "<b>There used to be</b> a cinema here."], ["It giả chủ ngữ", "It is + adj + to V / that + mệnh đề", "<b>It is</b> important <b>to protect</b> nature."], ["It takes", "It takes + (sb) + thời gian + to V", "<b>It takes</b> me 20 minutes to walk."]],sign:"There = giới thiệu sự tồn tại · It = thời tiết, giờ giấc, khoảng cách, hoặc thay cho mệnh đề",tips:["Động từ sau There chia theo <b>danh từ đứng sau</b>, không chia theo there", "Khi liệt kê, chia theo <b>danh từ đầu tiên</b>: There <b>is</b> a pen and two books.", "Đừng lẫn <b>It takes 2 hours</b> (mất 2 tiếng) với <b>There are 2 hours</b> (có 2 tiếng)", "Thành ngữ hay gặp: <b>There is no point in + V-ing</b> · <b>It is no use + V-ing</b>"],ex:[["There is a big tree in front of my house.", "Có một cái cây to trước nhà tôi."], ["There are thirty students in my class.", "Lớp tôi có ba mươi học sinh."], ["It is very hot in summer.", "Mùa hè trời rất nóng."], ["It takes me twenty minutes to walk to school.", "Tôi mất hai mươi phút đi bộ đến trường."], ["There used to be a cinema here.", "Trước đây ở đây từng có một rạp chiếu phim."]]},
 more:[
  ()=>({t:'fill',q:"___ is dangerous to swim in this river.",ans:["It"],e:"It giả chủ ngữ thay cho \"to swim in this river\".",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"There ___ to be no way out of this situation.",ans:["appears"],e:"no way số ít → appears.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ is high time we left for the airport.",ans:["It"],e:"Thành ngữ: It is high time + S + V quá khứ.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ four seasons in a year.",ans:["There are"],e:"four seasons số nhiều → There are.",hint:"Điền 2 từ"}),
  ()=>({t:'fill',q:"___ takes a great deal of patience to teach young children.",ans:["It"],e:"It takes + danh từ chỉ phẩm chất + to V.",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"There is dangerous to swim in this river.",wrong:"There",right:"It",e:"It giả chủ ngữ thay cho \"to swim in this river\"."}),
  ()=>({t:'error',sent:"There appear to be no way out of this situation.",wrong:"appear",right:"appears",e:"no way số ít → appears."}),
  ()=>({t:'error',sent:"There is high time we left for the airport.",wrong:"There",right:"It",e:"Thành ngữ: It is high time + S + V quá khứ."}),
  ()=>({t:'error',sent:"There takes a great deal of patience to teach young children.",wrong:"There",right:"It",e:"It takes + danh từ chỉ phẩm chất + to V."}),
  ()=>({t:'error',sent:"There are little hope of finding the missing boy.",wrong:"are",right:"is",e:"hope không đếm được → is."}),
  ()=>({t:'order',sent:"It is dangerous to swim in this river",e:"It giả chủ ngữ thay cho \"to swim in this river\".",vn:""}),
  ()=>({t:'order',sent:"It is high time we left for the airport",e:"Thành ngữ: It is high time + S + V quá khứ.",vn:""}),
  ()=>({t:'order',sent:"There are four seasons in a year",e:"four seasons số nhiều → There are.",vn:""}),
  ()=>({t:'order',sent:"There is little hope of finding the missing boy",e:"hope không đếm được → is.",vn:""}),
  ()=>({t:'order',sent:"There will be a meeting tomorrow morning",e:"Tương lai sau There → will be.",vn:""})
 ]},
gr_advclause:{gr:[8, 9, 10, 11],
 theory:{use:["Nối hai mệnh đề để chỉ thời gian, lý do, mục đích, kết quả hoặc sự tương phản"],form:[["Thời gian", "when, while, as, before, after, until, as soon as, since", "<b>As soon as</b> he arrives, call me."], ["Lý do", "because, since, as, now that", "She stayed home <b>because</b> it rained."], ["Mục đích", "so that, in order that + mệnh đề", "He studies hard <b>so that</b> he can pass."], ["Kết quả", "so + adj + that · such + a + adj + N + that", "It was <b>so</b> cold <b>that</b> we stayed in."], ["Nhượng bộ", "although, though, even though, while, whereas", "<b>Although</b> he is poor, he is happy."]],sign:"Theo sau là MỆNH ĐỀ (S+V): although, because · Theo sau là CỤM DANH TỪ: despite, in spite of, because of, due to",tips:["Nhìn ngay sau chỗ trống: thấy <b>S + V</b> chọn although/because; thấy <b>danh từ hoặc V-ing</b> chọn despite/because of", "Tiếng Việt nói \"Tuy... nhưng...\" nhưng tiếng Anh CHỈ dùng một: Although he is poor, he is happy.", "Sau <b>when / as soon as / until</b> chỉ tương lai thì dùng <b>hiện tại đơn</b>, không dùng will", "<b>so</b> đi với tính từ đứng một mình; <b>such</b> đi với cụm có danh từ"],ex:[["Although it was raining, we went out.", "Mặc dù trời mưa, chúng tôi vẫn ra ngoài."], ["Despite the rain, we went out.", "Dù trời mưa, chúng tôi vẫn ra ngoài."], ["He failed because of his carelessness.", "Anh ấy trượt vì sự bất cẩn của mình."], ["I will call you as soon as I arrive.", "Tôi sẽ gọi bạn ngay khi tôi đến."], ["It was such a boring film that I fell asleep.", "Bộ phim chán đến mức tôi ngủ gật."]]},
 more:[
  ()=>({t:'fill',q:"___ much he earns, he never saves any money.",ans:["No matter how"],e:"No matter how + adv + S + V.",hint:"Điền 3 từ"}),
  ()=>({t:'fill',q:"___ he is young, he is very responsible.",ans:["Although"],e:"Hai vế trái nghĩa, theo sau là mệnh đề → Although.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"It was ___ an interesting book that I read it twice.",ans:["such"],e:"such + a/an + adj + N + that.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ being very tired, she finished the report.",ans:["Despite"],e:"Despite + V-ing (coi như cụm danh từ).",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ he may be rich, he is not happy.",ans:["Though"],e:"Though + mệnh đề; \"may be\" cho thấy đây là mệnh đề đầy đủ.",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"Despite he is young, he is very responsible.",wrong:"Despite",right:"Although",e:"Hai vế trái nghĩa, theo sau là mệnh đề → Although."}),
  ()=>({t:'error',sent:"It was so an interesting book that I read it twice.",wrong:"so",right:"such",e:"such + a/an + adj + N + that."}),
  ()=>({t:'error',sent:"Although being very tired, she finished the report.",wrong:"Although",right:"Despite",e:"Despite + V-ing (coi như cụm danh từ)."}),
  ()=>({t:'error',sent:"Despite he may be rich, he is not happy.",wrong:"Despite",right:"Though",e:"Though + mệnh đề; \"may be\" cho thấy đây là mệnh đề đầy đủ."}),
  ()=>({t:'error',sent:"Although that you have finished school, what will you do?",wrong:"Although",right:"Now",e:"Now that = bởi vì bây giờ, chỉ lý do."}),
  ()=>({t:'order',sent:"I have known her since we were children",e:"since + mốc thời gian/mệnh đề quá khứ.",vn:""}),
  ()=>({t:'order',sent:"I will wait here until you come back",e:"Chờ cho tới khi ai đó quay lại → until.",vn:""}),
  ()=>({t:'order',sent:"Wait here until I get back",e:"until + mệnh đề chỉ thời điểm kết thúc.",vn:""}),
  ()=>({t:'order',sent:"We stayed inside because of the heavy rain",e:"Theo sau là cụm danh từ the heavy rain → because of.",vn:""}),
  ()=>({t:'order',sent:"The test was so difficult that few students passed",e:"so + adj + that.",vn:""})
 ]},
gr_nounclause:{gr:[10, 11, 12],
 theory:{use:["Dùng cả một mệnh đề làm chủ ngữ, tân ngữ hoặc bổ ngữ trong câu"],form:[["That-clause", "that + S + V", "I know <b>that he is honest</b>."], ["Wh-clause", "what, who, where, when, why, how + S + V", "I do not know <b>where he lives</b>."], ["If/Whether", "if / whether + S + V", "I wonder <b>whether she will come</b>."], ["Làm chủ ngữ", "Mệnh đề + động từ SỐ ÍT", "<b>What he said</b> surprised everyone."], ["Sau giới từ", "chỉ dùng whether", "I am not sure about <b>whether</b> he will come."]],sign:"Trật tự bên trong mệnh đề danh ngữ luôn là CÂU KỂ (S + V), không bao giờ đảo ngữ",tips:["Sau <b>giới từ</b> chỉ dùng <b>whether</b>, không dùng if", "Mệnh đề danh ngữ làm chủ ngữ luôn chia động từ <b>số ít</b>: What they need <b>is</b> money.", "Phân biệt <b>what</b> (không có danh từ đi trước) với <b>that</b> (nối sau danh từ là mệnh đề quan hệ)", "Mệnh đề làm chủ ngữ đầu câu dùng <b>Whether</b>, không dùng If"],ex:[["I know that he is telling the truth.", "Tôi biết rằng anh ấy đang nói thật."], ["What she said made everyone laugh.", "Điều cô ấy nói làm mọi người bật cười."], ["I wonder whether he will agree.", "Tôi tự hỏi liệu anh ấy có đồng ý không."], ["The problem is that we have no time.", "Vấn đề là chúng ta không có thời gian."], ["Can you tell me where the bank is?", "Bạn chỉ giúp ngân hàng ở đâu không?"]]},
 more:[
  ()=>({t:'fill',q:"He insisted ___ the report be submitted by Friday.",ans:["that"],e:"insist that + S + V nguyên mẫu (thức giả định).",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"She explained ___ the machine worked.",ans:["how"],e:"Hỏi cách thức → how.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ he will accept the job remains unclear.",ans:["Whether"],e:"Mệnh đề làm chủ ngữ đầu câu → dùng Whether, không dùng If.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ worries me is his health.",ans:["What"],e:"Làm chủ ngữ, nghĩa \"điều làm tôi lo\" → What.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"I think ___ he is a good teacher.",ans:["that"],e:"Mệnh đề đầy đủ làm tân ngữ của think → that.",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"He insisted what the report be submitted by Friday.",wrong:"what",right:"that",e:"insist that + S + V nguyên mẫu (thức giả định)."}),
  ()=>({t:'error',sent:"She explained what the machine worked.",wrong:"what",right:"how",e:"Hỏi cách thức → how."}),
  ()=>({t:'error',sent:"If he will accept the job remains unclear.",wrong:"If",right:"Whether",e:"Mệnh đề làm chủ ngữ đầu câu → dùng Whether, không dùng If."}),
  ()=>({t:'error',sent:"That worries me is his health.",wrong:"That",right:"What",e:"Làm chủ ngữ, nghĩa \"điều làm tôi lo\" → What."}),
  ()=>({t:'error',sent:"I think what he is a good teacher.",wrong:"what",right:"that",e:"Mệnh đề đầy đủ làm tân ngữ của think → that."}),
  ()=>({t:'order',sent:"He insisted that the report be submitted by Friday",e:"insist that + S + V nguyên mẫu (thức giả định).",vn:""}),
  ()=>({t:'order',sent:"She explained how the machine worked",e:"Hỏi cách thức → how.",vn:""}),
  ()=>({t:'order',sent:"Whether he will accept the job remains unclear",e:"Mệnh đề làm chủ ngữ đầu câu → dùng Whether, không dùng If.",vn:""}),
  ()=>({t:'order',sent:"What worries me is his health",e:"Làm chủ ngữ, nghĩa \"điều làm tôi lo\" → What.",vn:""}),
  ()=>({t:'order',sent:"I think that he is a good teacher",e:"Mệnh đề đầy đủ làm tân ngữ của think → that.",vn:""})
 ]},
gr_inversion:{gr:[11, 12],
 theory:{use:["Đảo trợ động từ lên trước chủ ngữ để nhấn mạnh, hay gặp trong đề thi học sinh giỏi"],form:[["Có trợ động từ sẵn", "Never + <b>have + S + V3</b>", "<b>Never have I</b> seen that."], ["Không có trợ động từ", "mượn do/does/did", "<b>Rarely does he</b> complain."], ["Có động từ be", "đưa be lên trước S", "<b>Seldom is she</b> late."], ["Not until", "Not until + mốc + <b>trợ ĐT + S</b>", "Not until midnight <b>did he</b> come home."], ["No sooner ... than", "No sooner + had + S + V3 + than", "<b>No sooner had</b> he left <b>than</b> it rained."], ["Điều kiện bỏ If", "Were I / Had I known / Should you", "<b>Had I known</b>, I would have helped."]],sign:"Các cụm gây đảo ngữ: Never, Rarely, Seldom, Hardly, Little, Not only, Not until, No sooner, Only when, Under no circumstances",tips:["Đã đảo thì <b>không chia lại động từ chính</b>: Never <b>did I see</b>, không phải did I saw", "Với <b>Only when he came did I leave</b>: mệnh đề \"he came\" KHÔNG đảo, chỉ mệnh đề chính đảo", "Cặp cố định: <b>No sooner ... than</b> · <b>Hardly/Scarcely ... when</b>", "<b>So + adj + be + S + that</b>: So difficult <b>was</b> the test that nobody passed."],ex:[["Never have I seen such a beautiful sunset.", "Chưa bao giờ tôi thấy hoàng hôn đẹp như vậy."], ["Rarely does he go out at night.", "Anh ấy hiếm khi ra ngoài buổi tối."], ["Not until he apologised did she forgive him.", "Mãi đến khi anh xin lỗi cô mới tha thứ."], ["No sooner had we sat down than the film started.", "Chúng tôi vừa ngồi xuống thì phim bắt đầu."], ["Were I you, I would accept the offer.", "Nếu tôi là bạn, tôi sẽ nhận lời."]]},
 more:[
  ()=>({t:'fill',q:"In no circumstances ___ to leave the room.",ans:["are you allowed"],e:"Cụm phủ định + be → đưa be lên trước chủ ngữ.",hint:"Điền 3 từ"}),
  ()=>({t:'fill',q:"Rarely ___ late for school.",ans:["is she"],e:"Có động từ be → đưa be lên trước chủ ngữ.",hint:"Điền 2 từ"}),
  ()=>({t:'fill',q:"On no account ___ the machine unattended.",ans:["must you leave"],e:"On no account + must + S + V.",hint:"Điền 3 từ"}),
  ()=>({t:'fill',q:"Not a single word ___ during the meeting.",ans:["did he say"],e:"Cụm phủ định \"Not a single word\" đầu câu → đảo.",hint:"Điền 3 từ"}),
  ()=>({t:'fill',q:"Little ___ that he was lying.",ans:["did I know"],e:"Little mang nghĩa phủ định → đảo với did.",hint:"Điền 3 từ"}),
  ()=>({t:'error',sent:"Such did his anger that he slammed the door.",wrong:"did",right:"was",e:"Such + be + S + that."}),
  ()=>({t:'error',sent:"No sooner had the bell rung when the students ran out.",wrong:"when",right:"than",e:"Cấu trúc cố định No sooner ... than."}),
  ()=>({t:'error',sent:"Hardly had she sat down than the doorbell rang.",wrong:"than",right:"when",e:"Cấu trúc Hardly ... when."}),
  ()=>({t:'error',sent:"Not only did he win the race, and he broke the record.",wrong:"and",right:"but",e:"Cấu trúc Not only ... but also."}),
  ()=>({t:'order',sent:"Rarely is she late for school",e:"Có động từ be → đưa be lên trước chủ ngữ.",vn:""}),
  ()=>({t:'order',sent:"On no account must you leave the machine unattended",e:"On no account + must + S + V.",vn:""}),
  ()=>({t:'order',sent:"Little did I know that he was lying",e:"Little mang nghĩa phủ định → đảo với did.",vn:""}),
  ()=>({t:'order',sent:"Hardly ever do they watch television",e:"Hardly ever + do + S + V.",vn:""}),
  ()=>({t:'order',sent:"Never had I met him before",e:"Never + had + S + V3.",vn:""})
 ]},
gr_usedto:{gr:[8, 9, 10, 11],
 theory:{use:["Nói về thói quen trong quá khứ nay không còn, và nói về việc đã quen với điều gì"],form:[["used to + V", "thói quen quá khứ, nay không còn", "I <b>used to play</b> football."], ["be used to + V-ing / N", "đã quen với việc gì", "I <b>am used to getting</b> up early."], ["get used to + V-ing / N", "đang dần quen", "He <b>is getting used to</b> the weather."], ["Phủ định", "did not <b>use to</b> + V (bỏ chữ d)", "I <b>didn't use to</b> like coffee."], ["Nghi vấn", "<b>Did</b> + S + <b>use to</b> + V?", "<b>Did</b> you <b>use to</b> swim?"]],sign:"Sau to là ĐỘNG TỪ NGUYÊN MẪU → used to (đã từng) · Sau to là V-ing hoặc DANH TỪ → be/get used to (quen với)",tips:["Sau <b>did</b> phải dùng <b>use to</b>, bỏ chữ d", "<b>would</b> thay được used to với hành động lặp lại, nhưng KHÔNG thay được với trạng thái: không nói \"I would have a bike\"", "Câu hỏi đuôi của used to dùng <b>didn't</b>: He used to be a teacher, <b>didn't he</b>?", "Dạng bị động: be used to <b>being</b> + V3 — I am not used to <b>being treated</b> like that."],ex:[["I used to live in the countryside.", "Tôi từng sống ở quê."], ["She is used to working at night.", "Cô ấy đã quen làm việc ban đêm."], ["He is getting used to the new school.", "Cậu ấy đang dần quen với trường mới."], ["I did not use to like vegetables.", "Trước đây tôi không thích rau."], ["Did you use to play the piano?", "Bạn từng chơi piano à?"]]},
 more:[
  ()=>({t:'fill',q:"It took her a while to get used to ___ on the left.",ans:["driving"],e:"get used to + V-ing.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"It did not take him long to ___ used to the new routine.",ans:["get"],e:"Sau to trong \"take long to\" → động từ nguyên mẫu get.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"Living abroad, I had to get used to ___ by strangers.",ans:["being greeted"],e:"get used to + being + V3 (dạng bị động).",hint:"Điền 2 từ"}),
  ()=>({t:'fill',q:"I ___ go swimming every weekend when I was young.",ans:["used to"],e:"Thói quen quá khứ → used to + V.",hint:"Điền 2 từ"}),
  ()=>({t:'fill',q:"Not until he moved to Hanoi ___ used to the traffic.",ans:["did he get"],e:"Not until đầu câu → mệnh đề chính đảo ngữ.",hint:"Điền 3 từ"}),
  ()=>({t:'error',sent:"It took her a while to get used to drive on the left.",wrong:"drive",right:"driving",e:"get used to + V-ing."}),
  ()=>({t:'error',sent:"It did not take him long to be used to the new routine.",wrong:"be",right:"get",e:"Sau to trong \"take long to\" → động từ nguyên mẫu get."}),
  ()=>({t:'error',sent:"Living abroad, I had to get used to greeted by strangers.",wrong:"greeted",right:"being greeted",e:"get used to + being + V3 (dạng bị động)."}),
  ()=>({t:'error',sent:"I did not used to like classical music.",wrong:"used",right:"use",e:"Sau did not → use to."}),
  ()=>({t:'error',sent:"She did used to working night shifts, so she never complains.",wrong:"did",right:"is",e:"Hiện tại đã quen → is used to."}),
  ()=>({t:'order',sent:"I did not use to like classical music",e:"Sau did not → use to.",vn:""}),
  ()=>({t:'order',sent:"She is not used to eating spicy food",e:"be used to + V-ing.",vn:""}),
  ()=>({t:'order',sent:"I am used to living in a big city",e:"be used to + V-ing.",vn:""}),
  ()=>({t:'order',sent:"I am not used to being treated like that",e:"be used to + being + V3 (bị động).",vn:""}),
  ()=>({t:'order',sent:"She is used to getting up early",e:"be used to + V-ing.",vn:""})
 ]},
gr_imperative:{gr:[4, 5, 6, 7],
 theory:{use:["Ra lệnh, nhắc nhở, rủ rê và đưa ra lời đề nghị"],form:[["Mệnh lệnh", "V nguyên mẫu + ...", "<b>Open</b> the door."], ["Phủ định", "Do not / Don't + V", "<b>Don't be</b> late."], ["Rủ cùng làm", "Let's + V", "<b>Let's go</b> out tonight."], ["Why don't we / Shall we", "+ V nguyên mẫu", "<b>Why don't we go</b> swimming?"], ["How about / What about", "+ V-ing", "<b>How about going</b> out?"], ["Would you mind", "+ V-ing", "<b>Would you mind opening</b> the window?"], ["suggest", "+ V-ing hoặc that + S + V", "I suggest <b>taking</b> a taxi."]],sign:"Let's / Why don't we / Shall we → V nguyên mẫu · How about / What about / mind / suggest → V-ing",tips:["Câu hỏi đuôi của <b>Let's</b> là <b>shall we?</b>, của câu mệnh lệnh là <b>will you?</b>", "Trả lời \"Would you mind...?\" bằng <b>No, not at all</b> nghĩa là ĐỒNG Ý", "Sau <b>suggest</b> KHÔNG dùng to V: I suggest <b>going</b>, không phải suggest to go", "Phủ định của Let's: <b>Let's not</b> + V"],ex:[["Don't touch that wire!", "Đừng chạm vào sợi dây đó!"], ["Let's go to the cinema tonight.", "Tối nay đi xem phim đi."], ["How about having dinner at that new restaurant?", "Hay là ăn tối ở nhà hàng mới đó?"], ["Would you mind closing the door?", "Bạn đóng giúp cửa được không?"], ["Let's start now, shall we?", "Bắt đầu luôn nhé?"]]},
 more:[
  ()=>({t:'fill',q:"Why not ___ her the truth?",ans:["tell"],e:"Why not + V nguyên mẫu.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The doctor recommended that he ___ more exercise.",ans:["take"],e:"recommend that + S + V nguyên mẫu (thức giả định).",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ we discuss this after lunch?",ans:["Shall"],e:"Đề nghị cùng làm → Shall we.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"Let's ___ a cup of tea.",ans:["have"],e:"Let's + V nguyên mẫu.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"Supposing you ___ the lottery, what would you do?",ans:["won"],e:"Supposing + S + V quá khứ, giả định không có thật.",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"Why not telling her the truth?",wrong:"telling",right:"tell",e:"Why not + V nguyên mẫu."}),
  ()=>({t:'error',sent:"The doctor recommended that he takes more exercise.",wrong:"takes",right:"take",e:"recommend that + S + V nguyên mẫu (thức giả định)."}),
  ()=>({t:'error',sent:"Will we discuss this after lunch?",wrong:"Will",right:"Shall",e:"Đề nghị cùng làm → Shall we."}),
  ()=>({t:'error',sent:"Let's having a cup of tea.",wrong:"having",right:"have",e:"Let's + V nguyên mẫu."}),
  ()=>({t:'error',sent:"Supposing you win the lottery, what would you do?",wrong:"win",right:"won",e:"Supposing + S + V quá khứ, giả định không có thật."}),
  ()=>({t:'order',sent:"The doctor recommended that he take more exercise",e:"recommend that + S + V nguyên mẫu (thức giả định).",vn:""}),
  ()=>({t:'order',sent:"Let's have a cup of tea",e:"Let's + V nguyên mẫu.",vn:""}),
  ()=>({t:'order',sent:"I insist that she be present at the ceremony",e:"insist that + S + be (thức giả định).",vn:""}),
  ()=>({t:'order',sent:"Let's not talk about it anymore",e:"Phủ định của Let's → Let's not + V.",vn:""}),
  ()=>({t:'order',sent:"I would rather you didn't smoke in here",e:"would rather + S + didn't + V.",vn:""})
 ]},
gr_cleft:{gr:[11, 12],
 theory:{use:["Nhấn mạnh một thành phần của câu: chủ ngữ, tân ngữ hoặc trạng ngữ"],form:[["It-cleft", "It is/was + phần nhấn mạnh + that/who + phần còn lại", "<b>It was Nam who</b> bought this book."], ["Nhấn tân ngữ", "It is/was + tân ngữ + that", "<b>It was this book that</b> Nam bought."], ["Nhấn trạng ngữ", "It is/was + trạng ngữ + that", "<b>It was yesterday that</b> Nam bought it."], ["What-cleft", "What + S + V + is/was + ...", "<b>What I need is</b> a holiday."], ["All-cleft", "All + S + V + is/was + V nguyên mẫu", "<b>All he did was</b> apologise."]],sign:"Người → who/that · Vật → that/which · Thời gian, nơi chốn → that. Dùng that luôn an toàn",tips:["Động từ sau It is/was chia theo <b>thì của câu gốc</b>, không chia theo phần nhấn mạnh", "Trong <b>What I need is...</b>, động từ chính luôn chia <b>SỐ ÍT</b> dù phần sau là số nhiều", "Sau <b>All I did was</b> dùng động từ nguyên mẫu KHÔNG có to", "Kết hợp được với not until: <b>It was not until midnight that</b> he came home."],ex:[["It was Lan who broke the vase.", "Chính Lan là người làm vỡ bình hoa."], ["It is this book that I want to buy.", "Chính cuốn sách này là cuốn tôi muốn mua."], ["It was in 2010 that they got married.", "Chính vào năm 2010 họ đã kết hôn."], ["What I need is a good rest.", "Cái tôi cần là một giấc nghỉ ngơi tử tế."], ["All he wants is to be left alone.", "Tất cả những gì anh ấy muốn là được ở một mình."]]},
 more:[
  ()=>({t:'fill',q:"It is this song ___ I like best.",ans:["that"],e:"Nhấn mạnh vật → that.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"It was last year ___ they moved here.",ans:["that"],e:"Nhấn mạnh thời gian → that.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"What matters in the end ___ the results.",ans:["is"],e:"What-clause làm chủ ngữ → động từ số ít, dù bổ ngữ số nhiều.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The thing ___ worries me is the deadline.",ans:["that"],e:"Sau danh từ the thing → mệnh đề quan hệ với that.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"It was in Hue ___ we first met.",ans:["that"],e:"Nhấn mạnh nơi chốn → that (hoặc where).",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"It is this song who I like best.",wrong:"who",right:"that",e:"Nhấn mạnh vật → that."}),
  ()=>({t:'error',sent:"It was last year who they moved here.",wrong:"who",right:"that",e:"Nhấn mạnh thời gian → that."}),
  ()=>({t:'error',sent:"What matters in the end are the results.",wrong:"are",right:"is",e:"What-clause làm chủ ngữ → động từ số ít, dù bổ ngữ số nhiều."}),
  ()=>({t:'error',sent:"The thing what worries me is the deadline.",wrong:"what",right:"that",e:"Sau danh từ the thing → mệnh đề quan hệ với that."}),
  ()=>({t:'error',sent:"It was in Hue who we first met.",wrong:"who",right:"that",e:"Nhấn mạnh nơi chốn → that (hoặc where)."}),
  ()=>({t:'order',sent:"It is this song that I like best",e:"Nhấn mạnh vật → that.",vn:""}),
  ()=>({t:'order',sent:"It was last year that they moved here",e:"Nhấn mạnh thời gian → that.",vn:""}),
  ()=>({t:'order',sent:"It was in Hue that we first met",e:"Nhấn mạnh nơi chốn → that (hoặc where).",vn:""}),
  ()=>({t:'order',sent:"What the committee decided was never announced publicly",e:"What-clause làm chủ ngữ → động từ số ít, bị động was announced.",vn:""}),
  ()=>({t:'order',sent:"What surprised me was how calm she remained",e:"What-cleft → was.",vn:""})
 ]},
gr_sosuch:{gr:[7, 8, 9, 10],
 theory:{use:["Diễn tả mức độ và kết quả: quá đến mức nào đó, đủ để làm gì"],form:[["so", "so + adj/adv + that", "It was <b>so cold that</b> we stayed in."], ["such", "such + (a/an) + adj + N + that", "It was <b>such a cold day that</b>..."], ["too", "too + adj/adv + (for sb) + to V", "He is <b>too young to drive</b>."], ["enough (adj)", "adj/adv + enough + to V", "He is <b>old enough to drive</b>."], ["enough (N)", "enough + danh từ", "I have <b>enough money</b>."]],sign:"Có danh từ theo sau → such · Chỉ có tính từ đứng một mình → so · enough đứng SAU tính từ nhưng TRƯỚC danh từ",tips:["<b>too</b> luôn mang nghĩa tiêu cực (quá đến mức không làm được), <b>very</b> thì trung tính", "Danh từ không đếm được dùng <b>so much / so little</b>, đếm được dùng <b>so many / so few</b>", "Chuyển đổi: He is <b>too weak to</b> lift it = He is <b>not strong enough to</b> lift it", "Đảo ngữ: <b>So heavy was</b> the rain that the roads flooded."],ex:[["The box was so heavy that I could not lift it.", "Cái hộp nặng đến mức tôi không nhấc nổi."], ["It was such a heavy box that I could not lift it.", "Đó là cái hộp nặng đến mức tôi không nhấc nổi."], ["He is too young to watch this film.", "Cậu bé quá nhỏ để xem phim này."], ["She is old enough to make her own decisions.", "Cô ấy đủ lớn để tự quyết định."], ["We do not have enough chairs for everyone.", "Chúng tôi không đủ ghế cho mọi người."]]},
 more:[
  ()=>({t:'fill',q:"He had ___ few friends that he often felt lonely.",ans:["so"],e:"so few + danh từ đếm được + that.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"She spoke ___ softly that nobody could hear her.",ans:["so"],e:"so + trạng từ + that.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The coffee is ___ hot to drink.",ans:["too"],e:"too + adj + to V.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"Such ___ his determination that he never gave up.",ans:["was"],e:"Such + be + S + that, dạng đảo ngữ.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The film was ___ boring that I left early.",ans:["so"],e:"so + tính từ đứng một mình + that.",hint:"Điền 1 từ"}),
  ()=>({t:'error',sent:"He had such few friends that he often felt lonely.",wrong:"such",right:"so",e:"so few + danh từ đếm được + that."}),
  ()=>({t:'error',sent:"She spoke such softly that nobody could hear her.",wrong:"such",right:"so",e:"so + trạng từ + that."}),
  ()=>({t:'error',sent:"The coffee is so hot to drink.",wrong:"so",right:"too",e:"too + adj + to V."}),
  ()=>({t:'error',sent:"Such did his determination that he never gave up.",wrong:"did",right:"was",e:"Such + be + S + that, dạng đảo ngữ."}),
  ()=>({t:'error',sent:"The film was such boring that I left early.",wrong:"such",right:"so",e:"so + tính từ đứng một mình + that."}),
  ()=>({t:'order',sent:"She spoke so softly that nobody could hear her",e:"so + trạng từ + that.",vn:""}),
  ()=>({t:'order',sent:"The coffee is too hot to drink",e:"too + adj + to V.",vn:""}),
  ()=>({t:'order',sent:"Such was his determination that he never gave up",e:"Such + be + S + that, dạng đảo ngữ.",vn:""}),
  ()=>({t:'order',sent:"The film was so boring that I left early",e:"so + tính từ đứng một mình + that.",vn:""}),
  ()=>({t:'order',sent:"He is too tired to continue working",e:"too + adj + to V, nghĩa không thể làm được.",vn:""})
 ]},
gr_reduced:{gr:[11, 12],
 theory:{use:["Rút ngắn mệnh đề quan hệ và mệnh đề trạng ngữ cho câu gọn và trang trọng hơn"],form:[["Chủ động → V-ing", "who/which + V → V-ing", "The man <b>standing</b> there is my uncle."], ["Bị động → V3", "who/which + be + V3 → V3", "The letter <b>written</b> by Lan arrived."], ["Sau the first/only", "who + V → to V", "He was the first <b>to finish</b>."], ["Trạng ngữ chủ động", "V-ing + , + mệnh đề chính", "<b>Seeing</b> the dog, she ran away."], ["Trạng ngữ hoàn thành", "Having + V3", "<b>Having finished</b> work, he went home."], ["Phủ định", "Not + V-ing", "<b>Not knowing</b> the way, he got lost."]],sign:"Danh từ đứng trước TỰ làm hành động → V-ing · BỊ tác động → V3",tips:["Chỉ rút gọn mệnh đề trạng ngữ khi <b>hai mệnh đề cùng chủ ngữ</b>", "Sau khi rút gọn, chủ ngữ của mệnh đề chính phải là người/vật thực hiện hành động trong phần phân từ", "<b>Having + V3</b> dùng khi hành động xảy ra TRƯỚC hành động chính", "Mệnh đề phân từ độc lập có chủ ngữ riêng: <b>Weather permitting</b>, we will go camping."],ex:[["The man standing over there is my uncle.", "Người đàn ông đang đứng đằng kia là chú tôi."], ["The letter written by Lan arrived today.", "Lá thư do Lan viết đã đến hôm nay."], ["He was the first student to finish the test.", "Cậu ấy là học sinh đầu tiên làm xong bài."], ["Having finished his homework, he went out.", "Làm xong bài tập, cậu ấy ra ngoài."], ["Not knowing what to say, she kept silent.", "Không biết nói gì, cô ấy im lặng."]]},
 more:[
  ()=>({t:'fill',q:"___ in simple language, the book appeals to young readers.",ans:["Written"],e:"Cuốn sách được viết → V3.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The girl ___ in the corner looks sad.",ans:["sitting"],e:"who is sitting → sitting.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"The window ___ by the storm has been repaired.",ans:["broken"],e:"which was broken → broken.",hint:"Điền 1 từ"}),
  ()=>({t:'fill',q:"___ twice, he did not want to try again.",ans:["Having failed"],e:"Thất bại hai lần trước đó → Having + V3.",hint:"Điền 2 từ"}),
  ()=>({t:'fill',q:"___ by his failure, he decided to try once more.",ans:["Not discouraged"],e:"Anh ấy không bị nản → Not + V3.",hint:"Điền 2 từ"}),
  ()=>({t:'error',sent:"Writing in simple language, the book appeals to young readers.",wrong:"Writing",right:"Written",e:"Cuốn sách được viết → V3."}),
  ()=>({t:'error',sent:"The girl sat in the corner looks sad.",wrong:"sat",right:"sitting",e:"who is sitting → sitting."}),
  ()=>({t:'error',sent:"The window breaking by the storm has been repaired.",wrong:"breaking",right:"broken",e:"which was broken → broken."}),
  ()=>({t:'error',sent:"Failing twice, he did not want to try again.",wrong:"Failing",right:"Having failed",e:"Thất bại hai lần trước đó → Having + V3."}),
  ()=>({t:'error',sent:"The book writing by my father is interesting.",wrong:"writing",right:"written",e:"which was written → written (bị động)."}),
  ()=>({t:'order',sent:"The book written by my father is interesting",e:"which was written → written (bị động).",vn:""}),
  ()=>({t:'order',sent:"The boy playing football is my brother",e:"who is playing → playing (chủ động).",vn:""}),
  ()=>({t:'order',sent:"The car bought last week was expensive",e:"which was bought → bought.",vn:""}),
  ()=>({t:'order',sent:"There are many students wanting to join the club",e:"who want → wanting.",vn:""}),
  ()=>({t:'order',sent:"The proposal discussed at yesterday meeting will be revised",e:"Đề xuất được thảo luận → V3.",vn:""})
 ]}
});

/* ===== Gộp chuyên đề trùng id + gắn lý thuyết, nhãn lớp, bài tập bổ sung ===== */
(function mergeGrammar(){
  const seen={},out=[];
  GRAMMAR_TOPICS.forEach(t=>{
    if(seen[t.id]){seen[t.id].qs=seen[t.id].qs.concat(t.qs);}
    else{seen[t.id]=t;out.push(t);}
  });
  GRAMMAR_TOPICS.length=0;out.forEach(t=>GRAMMAR_TOPICS.push(t));
  GRAMMAR_TOPICS.forEach(t=>{
    const m=GR_META[t.id];
    if(m){t.gr=m.gr;t.theory=m.theory;t.more=(m.more||[]).concat(GR_MORE2[t.id]||[]);}
    else{t.gr=[6,7,8];t.theory=null;t.more=[];}
  });
})();

const DIFF_LABELS={easy:'🟢 Dễ',medium:'🟡 Vừa',hard:'🔴 Khó',advanced:'🟠 Nâng cao'};
const DIFF_SHORT={easy:'Dễ',medium:'Vừa',hard:'Khó',advanced:'Nâng cao'};
const DIFF_ORDER=['easy','medium','hard','advanced'];
const GR_GRADES=[4,5,6,7,8,9,10,11,12];
let _grGrade='all';
const GR_TYPES=['mcq','fill','order','error','trans'];
const TYPE_LABEL={mcq:'🔘 Trắc nghiệm',fill:'✍️ Điền từ',order:'🔤 Sắp xếp câu',error:'🔍 Tìm lỗi sai',trans:'🔁 Viết lại câu'};

function grNorm(s){
  return String(s||'').toLowerCase()
    .replace(/[‘’ʼ]/g,"'").replace(/[“”]/g,'"')
    .replace(/[.,!?;:]+$/,'').replace(/\s+/g,' ').trim();
}
function grMatch(input,answers){
  const n=grNorm(input);
  return answers.some(a=>grNorm(a)===n);
}

/* ================= MÀN HÌNH CHỦ ĐỀ ================= */
function grammarHome(){
  $('grammarCard').innerHTML=`
    <h2>📝 Ôn Tập Ngữ Pháp</h2>
    <a href="grammar.html" style="display:flex;align-items:center;gap:14px;text-decoration:none;background:linear-gradient(135deg,#312e81,#6d28d9 60%,#a21caf);border-radius:18px;padding:14px 18px;margin-bottom:14px;border:3px solid rgba(255,255,255,.25);box-shadow:0 6px 0 rgba(0,0,0,.18)">
      <span style="font-size:40px">🧠</span>
      <span style="flex:1">
        <b style="font-family:'Baloo 2';color:#fff;font-size:17px">Ngữ Pháp Master — 33 chuyên đề chuyên sâu 🏔️</b>
        <span style="display:block;color:#ddd6fe;font-size:12.5px;margin-top:2px">Hơn 800 câu hỏi theo sách Tổng ôn Ngữ pháp · Thi lấy huy chương 🥇</span>
      </span>
      <span style="background:#ffd23f;color:#5b3500;font-family:'Baloo 2';font-weight:800;border-radius:30px;padding:8px 16px;font-size:14px;white-space:nowrap">Vào học ➜</span>
    </a>
    <p class="sub"><b>Mỗi chuyên đề có: 📖 Lý thuyết → 💡 Ví dụ có dịch → 🎯 Luyện tập 25 câu (5 dạng × 5 câu).</b> Mỗi câu đúng +12 XP.</p>
    <div class="gr-filter-lb">🎒 Chọn lớp:</div>
    <div class="gr-grade-bar">
      <button class="gr-grade-btn${_grGrade==='all'?' on':''}" data-g="all" onclick="grSetGrade('all')">📚 Tất cả</button>
      ${GR_GRADES.map(g=>`<button class="gr-grade-btn${_grGrade===g?' on':''}" data-g="${g}" onclick="grSetGrade(${g})">Lớp ${g}</button>`).join('')}
    </div>
    <div class="gr-filter-lb">🎚️ Mức độ:</div>
    <div class="gr-diff-bar">
      <button class="gr-diff-btn${_grDiff==='all'?' on':''}" data-d="all" onclick="grSetDiff('all')">🌈 Tất cả</button>
      ${DIFF_ORDER.map(d=>`<button class="gr-diff-btn${d===_grDiff?' on':''}" data-d="${d}" onclick="grSetDiff('${d}')">${DIFF_LABELS[d]}</button>`).join('')}
    </div>
    <div class="gr-topic-grid" id="grTopicGrid"></div>`;
  grRenderTopics();
}
function grSetGrade(g){_grGrade=g;sndClick();
  document.querySelectorAll('.gr-grade-btn').forEach(b=>b.classList.toggle('on',String(b.dataset.g)===String(g)));
  grRenderTopics();}
function grSetDiff(d){_grDiff=d;sndClick();
  document.querySelectorAll('.gr-diff-btn').forEach(b=>b.classList.toggle('on',b.dataset.d===d));
  grRenderTopics();}

function grTopicList(){
  return GRAMMAR_TOPICS.filter(t=>
    (_grDiff==='all'||t.diff===_grDiff) &&
    (_grGrade==='all'||(t.gr||[]).indexOf(+_grGrade)>=0));
}
function grRenderTopics(){
  const topics=grTopicList();
  if(!topics.length){
    $('grTopicGrid').innerHTML='<p class="sub">😅 Không có chuyên đề nào khớp bộ lọc này. Thử chọn <b>Tất cả</b> ở mức độ xem sao nhé!</p>';
    return;
  }
  $('grTopicGrid').innerHTML=topics.map(t=>`
    <button class="gr-topic-card diff-${t.diff}" onclick="openGrTopic('${t.id}')">
      <span class="gr-diff-badge">${DIFF_LABELS[t.diff].split(' ')[0]} ${DIFF_SHORT[t.diff]}</span>
      <span class="gt-em">${t.em}</span>
      <div class="gt-name">${esc(t.name)}</div>
      <div class="gt-sub">${esc(t.sub)}</div>
      <div class="gt-grades">${(t.gr||[]).map(g=>`<span class="gt-gchip">Lớp ${g}</span>`).join('')}</div>
      <span class="gt-cnt">📖 Lý thuyết · 🎯 25 câu · 5 dạng × 5 câu</span>
    </button>`).join('');
}

/* ================= TRANG LÝ THUYẾT + VÍ DỤ ================= */
function openGrTopic(id){
  const t=GRAMMAR_TOPICS.find(x=>x.id===id);
  if(!t)return;
  sndClick();
  const th=t.theory;
  let body='';
  if(th){
    body=`
    <div class="gr-theory">
      <div class="th-sec"><h4>🎯 Khi nào dùng?</h4><ul>${th.use.map(u=>`<li>${u}</li>`).join('')}</ul></div>
      <div class="th-sec"><h4>🧱 Công thức</h4>
        <div class="th-tablewrap"><table class="th-table">
          <tr><th>Dạng</th><th>Cấu trúc</th><th>Ví dụ</th></tr>
          ${th.form.map(f=>`<tr><td class="th-k">${f[0]}</td><td class="th-f">${f[1]}</td><td class="th-e">${f[2]}</td></tr>`).join('')}
        </table></div>
      </div>
      <div class="th-sec"><h4>🔎 Dấu hiệu nhận biết</h4><div class="th-sign">${th.sign}</div></div>
      <div class="th-sec"><h4>⚠️ Lưu ý &amp; lỗi hay gặp</h4><ul class="th-tips">${th.tips.map(u=>`<li>${u}</li>`).join('')}</ul></div>
      <div class="th-sec"><h4>💡 Ví dụ có dịch</h4>
        ${th.ex.map(e=>`<div class="th-exrow"><b>${esc(e[0])}</b><span>${esc(e[1])}</span></div>`).join('')}
      </div>
    </div>`;
  }else{
    body='<p class="sub">Chuyên đề này chưa có phần lý thuyết chi tiết — em vào luyện tập luôn nhé!</p>';
  }
  $('grammarCard').innerHTML=`
    <div class="row" style="justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <button class="btn ghost sm" onclick="grammarHome()">← Chủ đề</button>
      <span style="font-family:'Baloo 2';font-weight:800;color:var(--violet);font-size:16px">${t.em} ${esc(t.name)}</span>
      <span class="gr-diff-badge diff-${t.diff}" style="position:static">${DIFF_LABELS[t.diff]}</span>
    </div>
    <div class="gr-subtitle">${esc(t.sub)} · ${(t.gr||[]).map(g=>'Lớp '+g).join(' · ')}</div>
    ${body}
    <div class="center mt">
      <button class="btn teal" onclick="startGrammarReview('${t.id}')">🎯 Luyện tập ngay (25 câu · 5 dạng × 5)</button>
      <button class="btn ghost" onclick="speakTheory('${t.id}')">🔊 Nghe ví dụ</button>
    </div>`;
}
function speakTheory(id){
  const t=GRAMMAR_TOPICS.find(x=>x.id===id);
  if(!t||!t.theory)return;
  try{speak(t.theory.ex.map(e=>e[0]).join(' '),1)}catch(e){}
}

/* ================= LUYỆN TẬP 5 DẠNG ================= */
function startGrammarReview(topicId){
  const topic=GRAMMAR_TOPICS.find(t=>t.id===topicId);
  if(!topic)return;
  sndClick();
  const PER=5;
  const byType={mcq:[],fill:[],order:[],error:[],trans:[]};
  shuffle(topic.qs.map(fn=>fn())).forEach(q=>byType.mcq.push(Object.assign({t:'mcq'},q)));
  shuffle((topic.more||[]).map(fn=>fn())).forEach(q=>{if(byType[q.t])byType[q.t].push(q)});
  let qs=[];
  GR_TYPES.forEach(ty=>{qs=qs.concat(byType[ty].slice(0,PER))});
  qs=shuffle(qs);
  if(!qs.length)qs=shuffle(topic.qs.map(fn=>fn())).slice(0,10).map(q=>Object.assign({t:'mcq'},q));
  GR={topic,qs,i:0,right:0};
  streak=0;
  renderGRQ();
}

function grHead(){
  const q=GR.qs[GR.i];
  return `
    <div class="row" style="justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <button class="btn ghost sm" onclick="openGrTopic('${GR.topic.id}')">← Lý thuyết</button>
      <span style="font-family:'Baloo 2';font-weight:800;color:var(--violet)">${GR.topic.em} ${esc(GR.topic.name)}</span>
      <span class="gr-type-badge">${TYPE_LABEL[q.t]||''}</span>
    </div>
    <div class="qbar">
      <span class="qcount">Câu ${GR.i+1}/${GR.qs.length}</span>
      <div class="qprog"><i style="width:${GR.i/GR.qs.length*100}%"></i></div>
      <span class="streak">🔥 ${streak}</span>
    </div>`;
}
function grTail(){
  return `<div class="feedback" id="grfb"></div>
    <div class="center mt hidden" id="grnextRow"><button class="btn teal" onclick="nextGRQ()">Câu tiếp theo ➜</button></div>`;
}

function renderGRQ(){
  const q=GR.qs[GR.i];
  if(q.t==='fill'||q.t==='trans')return renderGRText(q);
  if(q.t==='order')return renderGROrder(q);
  if(q.t==='error')return renderGRError(q);
  return renderGRMcq(q);
}

/* --- 1. Trắc nghiệm --- */
function renderGRMcq(q){
  const order=shuffle(q.o.map((t,idx)=>({t,idx})));
  $('grammarCard').innerHTML=grHead()+
    `<div class="qq">${esc(q.q)}</div>
     <div class="opts">${order.map((o,k)=>`<button class="opt" id="grop${k}" onclick="answerGR(${o.idx},${k})"><span class="ab">${'ABCDEFGH'[k]||(k+1)}</span>${esc(o.t)}</button>`).join('')}</div>`+grTail();
  window._grOrder=order;
}
function answerGR(realIdx,btnK){
  const q=GR.qs[GR.i];
  document.querySelectorAll('#grammarCard .opt').forEach(b=>b.disabled=true);
  window._grOrder.forEach((o,k)=>{
    const b=$('grop'+k);
    if(o.idx===q.a)b.classList.add('right');
    else if(k===btnK)b.classList.add('wrong');
    else b.classList.add('dim');
  });
  grJudge(realIdx===q.a,esc(q.o[q.a]),q.e);
}

/* --- 2 & 5. Điền từ / Viết lại câu --- */
function renderGRText(q){
  const isT=q.t==='trans';
  $('grammarCard').innerHTML=grHead()+
    `<div class="qq">${esc(q.q)}</div>
     ${q.hint?`<div class="gr-hint">💡 Gợi ý: ${esc(q.hint)}</div>`:''}
     <div class="gr-inputrow">
       <input class="gr-input" id="grInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
         placeholder="${isT?'Viết lại cả câu tiếng Anh…':'Gõ đáp án…'}">
       <button class="btn teal" id="grChk" onclick="answerGRText()">✔️ Kiểm tra</button>
     </div>`+grTail();
  const el=$('grInput');
  el.addEventListener('keydown',e=>{if(e.key==='Enter')answerGRText()});
  setTimeout(()=>el.focus(),80);
}
function answerGRText(){
  const q=GR.qs[GR.i],el=$('grInput');
  if(!el||el.disabled)return;
  const val=el.value.trim();
  if(!val){toast('✏️ Em gõ đáp án đã nha!');return}
  const ok=grMatch(val,q.ans);
  el.disabled=true;$('grChk').disabled=true;
  el.classList.add(ok?'right':'wrong');
  grJudge(ok,esc(q.ans[0]),q.e);
}

/* --- 3. Sắp xếp câu --- */
function renderGROrder(q){
  const words=q.sent.split(' ');
  window._grOrd={pool:shuffle(words.map((w,i)=>({w,i}))),built:[],done:false};
  $('grammarCard').innerHTML=grHead()+
    `<div class="qq">🔤 Sắp xếp các từ thành câu đúng:</div>
     ${q.vn?`<div class="gr-hint">💡 Nghĩa: ${esc(q.vn)}</div>`:''}
     <div class="gr-built" id="grBuilt"></div>
     <div class="gr-pool" id="grPool"></div>
     <div class="center" style="margin-top:10px">
       <button class="btn sun sm" onclick="grOrdReset()">↩️ Làm lại</button>
       <button class="btn teal sm" id="grChk" onclick="answerGROrder()">✔️ Kiểm tra</button>
     </div>`+grTail();
  grOrdPaint();
}
function grOrdPaint(){
  const S=window._grOrd;
  $('grBuilt').innerHTML=S.built.length
    ? S.built.map((t,k)=>`<button class="gr-tile built" ${S.done?'disabled':''} onclick="grOrdBack(${k})">${esc(t.w)}</button>`).join('')
    : '<span class="gr-built-ph">Bấm các từ bên dưới để xếp câu…</span>';
  $('grPool').innerHTML=S.pool.map((t,k)=>`<button class="gr-tile" ${S.done?'disabled':''} onclick="grOrdPick(${k})">${esc(t.w)}</button>`).join('');
}
function grOrdPick(k){const S=window._grOrd;if(S.done)return;S.built.push(S.pool.splice(k,1)[0]);sndClick();grOrdPaint()}
function grOrdBack(k){const S=window._grOrd;if(S.done)return;S.pool.push(S.built.splice(k,1)[0]);sndClick();grOrdPaint()}
function grOrdReset(){const S=window._grOrd;if(S.done)return;S.pool=shuffle(S.pool.concat(S.built));S.built=[];sndClick();grOrdPaint()}
function answerGROrder(){
  const q=GR.qs[GR.i],S=window._grOrd;
  if(S.done)return;
  if(!S.built.length){toast('🔤 Em xếp câu đã nha!');return}
  S.done=true;grOrdPaint();
  $('grChk').disabled=true;
  const ok=grNorm(S.built.map(t=>t.w).join(' '))===grNorm(q.sent);
  grJudge(ok,esc(q.sent+'.'),q.e);
}

/* --- 4. Tìm lỗi sai --- */
function renderGRError(q){
  const words=q.sent.split(' ');
  window._grErr={done:false,words};
  $('grammarCard').innerHTML=grHead()+
    `<div class="qq">🔍 Bấm vào TỪ bị sai trong câu:</div>
     <div class="gr-words" id="grWords">${words.map((w,k)=>`<button class="gr-word" id="grw${k}" onclick="answerGRError(${k})">${esc(w)}</button>`).join('')}</div>`+grTail();
}
function answerGRError(k){
  const q=GR.qs[GR.i],S=window._grErr;
  if(S.done)return;
  S.done=true;
  const strip=s=>grNorm(s).replace(/[.,!?;:]/g,'');
  let target=S.words.findIndex(w=>strip(w)===strip(q.wrong));
  if(target<0)target=S.words.findIndex(w=>strip(w).indexOf(strip(q.wrong))>=0);
  document.querySelectorAll('#grWords .gr-word').forEach(b=>b.disabled=true);
  if(target>=0)$('grw'+target).classList.add('right');
  if(k!==target)$('grw'+k).classList.add('wrong');
  grJudge(k===target,esc(q.wrong)+' ➜ <b>'+esc(q.right)+'</b>',q.e);
}

/* --- Chấm điểm chung --- */
function grJudge(ok,answerHtml,explain){
  const fb=$('grfb');
  if(ok){
    GR.right++;P.correct++;hitStreak();
    gainXP(12+streakBonus());sndOK();
    fb.className='feedback ok';
    fb.innerHTML='🎉 <b>Chính xác!</b> '+(explain?esc(explain):'');
  }else{
    missStreak();sndNo();
    fb.className='feedback no';
    fb.innerHTML='😅 <b>Chưa đúng.</b> Đáp án: <b>'+answerHtml+'</b>. '+(explain?esc(explain):'');
  }
  persist();
  $('grnextRow').classList.remove('hidden');
}

function nextGRQ(){
  GR.i++;sndClick();
  if(GR.i<GR.qs.length)renderGRQ();
  else{
    P.quizDone++;persist();checkBadges();
    const pct=GR.right/GR.qs.length;
    if(pct===1){confetti(120);sndWin()}
    else if(pct>=.6){confetti(50);sndWin()}
    const face=pct===1?'🏆':pct>=.75?'🤩':pct>=.5?'😊':'💪';
    const msg=pct===1?'HOÀN HẢO! Nắm ngữ pháp đỉnh rồi!':pct>=.75?'Tuyệt vời!':pct>=.5?'Khá lắm, luyện thêm chút!':'Ôn lại lý thuyết rồi thử lại nha!';
    $('grammarCard').innerHTML=`
      <div class="result">
        <div class="face">${face}</div>
        <h3>${msg}</h3>
        <div class="scoreline">Bạn đúng <b>${GR.right}/${GR.qs.length}</b> câu</div>
        <div class="xpgain">⭐ +${GR.right*12} XP</div>
        <div class="row" style="justify-content:center;flex-wrap:wrap">
          <button class="btn" onclick="startGrammarReview('${GR.topic.id}')">🔄 Luyện lại</button>
          <button class="btn ghost" onclick="openGrTopic('${GR.topic.id}')">📖 Xem lại lý thuyết</button>
          <button class="btn sun" onclick="grammarHome()">📋 Đổi chủ đề</button>
        </div>
      </div>`;
  }
}
/* để admin.html và tools/check-data.js đọc được */
try{window.GRAMMAR_TOPICS=GRAMMAR_TOPICS;}catch(e){}
window.EFZ_LOADED=window.EFZ_LOADED||{};window.EFZ_LOADED.grammar=1;
