/* Accessibility + PWA: chạy sau khi app.js đã dựng giao diện. */
(function(){
  /* 1) Đăng ký service worker (chỉ trên https/localhost) */
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
    window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
  }
  /* 2) Phần tử có onclick nhưng không phải button/link -> dùng được bằng bàn phím, screen reader đọc được */
  var NATIVE=/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|LABEL)$/;
  function enhance(root){
    var els=root.querySelectorAll('[onclick]');
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(NATIVE.test(el.tagName))continue;
      if(!el.hasAttribute('role'))el.setAttribute('role','button');
      if(!el.hasAttribute('tabindex'))el.setAttribute('tabindex','0');
    }
    var btns=root.querySelectorAll('button:not([aria-label])');
    for(var j=0;j<btns.length;j++){
      var b=btns[j];
      if(!b.textContent.replace(/[\s​]/g,'')&&b.title)b.setAttribute('aria-label',b.title);
    }
    var imgs=root.querySelectorAll('img:not([alt])');
    for(var k=0;k<imgs.length;k++)imgs[k].setAttribute('alt','');
  }
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    var t=e.target;
    if(!t||!t.getAttribute||t.getAttribute('role')!=='button'||NATIVE.test(t.tagName))return;
    e.preventDefault();t.click();
  });
  /* 3) Toast đọc được bởi screen reader; gắn nhãn cho menu và các khu vực */
  var LABELS={home:'Trang chủ',grammar:'Ngữ pháp',theory:'Lý thuyết',quiz:'Trắc nghiệm',reading:'Đọc hiểu',listening:'Nghe',writing:'Viết',games:'Trò chơi',board:'Bảng xếp hạng',ielts:'IELTS',hsa:'HSA',thpt:'THPT',vocab:'Từ vựng'};
  function live(){
    var t=document.getElementById('toast');
    if(t){t.setAttribute('role','status');t.setAttribute('aria-live','polite')}
    var nav=document.getElementById('nav');
    if(nav&&!nav.getAttribute('aria-label'))nav.setAttribute('aria-label','Menu chính');
    document.querySelectorAll('section[id^="sec-"]').forEach(function(s){var k=s.id.slice(4);s.setAttribute('aria-label',LABELS[k]||k)});
  }
  /* 4) Giảm chuyển động: tắt confetti/hiệu ứng bay nếu người dùng bật tùy chọn hệ thống */
  var mq=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)');
  if(mq&&mq.matches){
    document.documentElement.classList.add('reduce-motion');
    ['confetti','xpFly'].forEach(function(n){try{window[n]=function(){}}catch(e){}});
  }
  var pending=false;
  function schedule(){if(pending)return;pending=true;(window.requestAnimationFrame||setTimeout)(function(){pending=false;enhance(document)})}
  function start(){
    enhance(document);live();
    new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
