/* Tai du lieu de thi theo yeu cau (lazy). Du lieu nam o data/*.js, moi file gan vao window.EFZ_DATA[key]. */
window.EFZ_DATA=window.EFZ_DATA||{};
(function(){
  var pending={};
  function url(key){return key.indexOf('eng')===0?'data/hsa_'+key.slice(3)+'.js':'data/thpt_'+key.slice(4)+'.js'}
  window.efzData=function(key){return window.EFZ_DATA[key]||[]};
  window.efzLoad=function(key){
    if(window.EFZ_DATA[key])return Promise.resolve();
    if(pending[key])return pending[key];
    pending[key]=new Promise(function(ok,no){
      var s=document.createElement('script');s.src=url(key);
      s.onload=function(){ok()};
      s.onerror=function(){delete pending[key];no(new Error('Khong tai duoc '+key))};
      document.head.appendChild(s);
    }).catch(function(e){
      if(typeof toast==='function')toast('😢 Không tải được bộ đề. Kiểm tra mạng rồi thử lại.');
      throw e;
    });
    return pending[key];
  };
})();
