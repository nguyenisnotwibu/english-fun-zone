/* =====================================================================
   WORD STRIKE 3D – CHẾ ĐỘ MISSION (Relay + Rút lui) và BỘ ĐÀM (thầy/cô chỉnh ở đây, không cần sửa code)
   Sai dữ liệu → game dùng giá trị mặc định trong code và ghi cảnh báo ở Console (#dataWarn). Kiểm tra: node tools/check-data.js

   relay      : counts = số Relay mỗi ải (6 số, mỗi số 2–5) · range = đứng gần bao nhiêu mét để sửa · holdSec = giữ E bao lâu
                lockSec = khoá bao lâu sau khi trả lời sai · coins/score = thưởng · hp = hồi máu · revealDist = tới gần bao nhiêu mét thì kim cương hiện
   spots      : vị trí Relay mỗi ải (x, z; sân rộng ±30). Trúng vật cản/hố thì game tự dời tới chỗ trống gần nhất. Mỗi ải cần ≥ counts[ải] điểm.
   extract    : điểm Rút lui mỗi ải (x, z) · radius = vòng giữ vị trí · holdSec = thời gian giữ · spawnEvery/maxHostile = quái tràn vào · coins = thưởng
   alarm      : số quái kéo tới khi trả lời sai, mỗi ải (6 số, 1–8)
   ambient    : quái nền khi đang đi sửa Relay (startAfter, every = giây, max = tối đa cùng lúc)
   locations  : thẻ địa điểm khi vào ải (6 mục: en, sub, vi)
   radio      : câu lệnh theo cấp độ kids / toeic / ielts; mỗi mục có en + vi. Chỗ trống: {n} số Relay · {dir} hướng · {rel} bên (trái/phải/trước/sau)
                {dist} mét · {near} gần/xa · {loc} địa điểm · {sec} giây · {lock} giây khoá
   ===================================================================== */
window.WS_RELAY={version:1,defaultMode:'mission',
relay:{counts:[3,3,3,4,4,4],range:3,holdSec:2,lockSec:15,coins:15,score:100,hp:10,revealDist:24},
spots:[
  [{x:-4,z:-26},{x:25,z:5},{x:-23,z:14},{x:12,z:24}],
  [{x:22,z:-18},{x:-25,z:-6},{x:6,z:25},{x:-16,z:22}],
  [{x:-24,z:-16},{x:3,z:-27},{x:26,z:12},{x:-10,z:24}],
  [{x:26,z:-8},{x:-5,z:-26},{x:-26,z:8},{x:10,z:24}],
  [{x:-20,z:-22},{x:24,z:-14},{x:2,z:26},{x:-26,z:6}],
  [{x:0,z:-27},{x:27,z:2},{x:-27,z:-3},{x:-8,z:25}]
],
extract:{points:[{x:22,z:-22},{x:20,z:18},{x:20,z:-20},{x:-20,z:-18},{x:22,z:20},{x:-24,z:24}],radius:6,holdSec:30,spawnEvery:2.6,maxHostile:8,coins:40},
alarm:{hostiles:[3,3,4,4,5,5]},
ambient:{startAfter:8,every:14,max:3},
locations:[
  {en:'PIER 4',sub:'CONTAINER YARD',vi:'Bến 4 · Bãi container'},
  {en:'CONTAINER YARD',sub:'STACK ROW C',vi:'Bãi container · Dãy C'},
  {en:'COLD STORAGE',sub:'FREEZER BLOCK',vi:'Kho lạnh · Khu đông lạnh'},
  {en:'CRANE ROW',sub:'GANTRY LINE',vi:'Dãy cần cẩu · Tuyến giàn'},
  {en:'CARGO SHIP',sub:'MAIN DECK',vi:'Tàu hàng · Boong chính'},
  {en:'LIGHTHOUSE',sub:'SIGNAL TOWER',vi:'Đèn hải đăng · Tháp tín hiệu'}
],
radio:{
 callsign:'SALT CONTROL',
 dirs:{N:{en:'north',vi:'phía bắc'},NE:{en:'north-east',vi:'đông bắc'},E:{en:'east',vi:'phía đông'},SE:{en:'south-east',vi:'đông nam'},S:{en:'south',vi:'phía nam'},SW:{en:'south-west',vi:'tây nam'},W:{en:'west',vi:'phía tây'},NW:{en:'north-west',vi:'tây bắc'}},
 rels:{ahead:{en:'ahead of you',vi:'ngay phía trước bạn'},right:{en:'on your right',vi:'bên phải bạn'},behind:{en:'behind you',vi:'phía sau bạn'},left:{en:'on your left',vi:'bên trái bạn'}},
 near:{near:{en:'near',vi:'gần'},far:{en:'far',vi:'xa'},nearDist:18},
 kids:{
  intro:[{en:'Welcome to {loc}. Turn on all the relays.',vi:'Chào mừng đến {loc}. Hãy bật tất cả trạm.'}],
  relay:[{en:'Go {dir}. Find relay {n}.',vi:'Đi về {dir}. Tìm trạm số {n}.'},{en:'Relay {n} is {dir}. It is {near}.',vi:'Trạm số {n} ở {dir}. Nó {near}.'}],
  hold:[{en:'Hold E. Do not move.',vi:'Giữ phím E. Đừng di chuyển.'}],
  ok:[{en:'Good! Relay {n} is on.',vi:'Giỏi lắm! Trạm số {n} đã bật.'}],
  alarm:[{en:'Oh no! Wrong! They are coming!',vi:'Ôi không! Sai rồi! Chúng đang tới!'}],
  extract:[{en:'All relays are on! Go {dir}. Stay there.',vi:'Tất cả trạm đã bật! Đi về {dir}. Ở yên đó.'}],
  extracting:[{en:'Stay here! {sec} seconds!',vi:'Ở yên đây! {sec} giây!'}],
  done:[{en:'We did it! Well done!',vi:'Làm được rồi! Giỏi lắm!'}]
 },
 toeic:{
  intro:[{en:'Command to team. You are at {loc}. Restore every relay, then wait for extraction.',vi:'Chỉ huy gọi đội. Bạn đang ở {loc}. Khôi phục mọi trạm rồi chờ rút lui.'}],
  relay:[{en:'Relay {n} is to the {dir}, {rel}. About {dist} meters.',vi:'Trạm số {n} ở {dir}, {rel}. Khoảng {dist} mét.'},{en:'Head {dir}. You will find relay {n} {rel}, about {dist} meters away.',vi:'Đi về {dir}. Bạn sẽ thấy trạm số {n} {rel}, cách khoảng {dist} mét.'}],
  hold:[{en:'Stand close and hold E until the bar is full.',vi:'Đứng gần và giữ E cho tới khi thanh đầy.'}],
  ok:[{en:'Relay {n} is back online. Good work.',vi:'Trạm số {n} đã hoạt động lại. Làm tốt lắm.'}],
  alarm:[{en:'Wrong answer. The alarm is on and the relay is locked for {lock} seconds. Hostiles are coming.',vi:'Sai rồi. Báo động đã bật, trạm bị khoá {lock} giây. Quái đang kéo tới.'}],
  extract:[{en:'All relays are online. Extraction is to the {dir}, {rel}, {dist} meters. Hold position for {sec} seconds.',vi:'Tất cả trạm đã hoạt động. Điểm rút lui ở {dir}, {rel}, {dist} mét. Giữ vị trí {sec} giây.'}],
  extracting:[{en:'Hold position. {sec} seconds left.',vi:'Giữ vị trí. Còn {sec} giây.'}],
  done:[{en:'Extraction complete. Mission accomplished.',vi:'Rút lui hoàn tất. Nhiệm vụ thành công.'}]
 },
 ielts:{
  intro:[{en:'This is Salt Control. You are on station at {loc}. Every relay must be restored before the extraction window opens.',vi:'Salt Control đây. Bạn đang ở {loc}. Mọi trạm phải được khôi phục trước khi cửa sổ rút lui mở.'}],
  relay:[{en:'The next relay, number {n}, is located roughly {dist} metres to the {dir}, {rel}. Reconnect it before the signal fades.',vi:'Trạm kế tiếp, số {n}, nằm cách khoảng {dist} mét về {dir}, {rel}. Hãy nối lại trước khi tín hiệu tắt.'},{en:'Proceed to the {dir}. Relay {n} lies about {dist} metres out, {rel}, and it will not reconnect on its own.',vi:'Tiến về {dir}. Trạm số {n} cách khoảng {dist} mét, {rel}, và nó sẽ không tự nối lại.'}],
  hold:[{en:'Stay within range and keep holding E while the link is established.',vi:'Ở trong tầm và giữ E trong khi liên kết được thiết lập.'}],
  ok:[{en:'Relay {n} has been reconnected. The signal is stronger already.',vi:'Trạm số {n} đã được nối lại. Tín hiệu đã mạnh hơn.'}],
  alarm:[{en:'Incorrect. The alarm has been triggered, the relay is locked for {lock} seconds and hostiles are converging on your position.',vi:'Sai. Báo động đã được kích hoạt, trạm bị khoá {lock} giây và quái đang bao vây vị trí của bạn.'}],
  extract:[{en:'Every relay is online. The extraction point lies {dist} metres to the {dir}, {rel}. Hold your position there for {sec} seconds while the enemy converges.',vi:'Mọi trạm đã hoạt động. Điểm rút lui cách {dist} mét về {dir}, {rel}. Hãy giữ vị trí {sec} giây trong khi kẻ địch kéo tới.'}],
  extracting:[{en:'Do not abandon the zone. {sec} seconds remain.',vi:'Đừng rời khỏi vùng. Còn {sec} giây.'}],
  done:[{en:'Extraction successful. You have restored the whole network.',vi:'Rút lui thành công. Bạn đã khôi phục cả mạng lưới.'}]
 }
}};
