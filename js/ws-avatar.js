/* =====================================================================
   WORD STRIKE 3D – NHÂN VẬT KHỐI + GÓC NHÌN THỨ 3
   · Phím C (và nút 👁 trên điện thoại) đổi góc nhìn 1 ↔ 3, nhớ lựa chọn (ws_x1 → X.view).
   · Camera sau vai, kéo vào khi gặp tường/khối che/sàn/container (không xuyên vật thể).
   · Tâm ngắm vẫn bắn đúng: tia vẫn đi qua tâm màn hình, nhưng bỏ qua mọi thứ nằm giữa camera và đầu nhân vật (ray.near).
   · Nhân vật = 6 mesh (đầu, thân, 2 tay, 2 chân) dùng chung 1 vật liệu vertex-color → ≈ 7 draw call (kèm bóng tròn).
     Hoạt ảnh theo trạng thái thật: đứng, đi/chạy, nhảy/rơi, bắn, lướt, bị thương.
   · CHỈ ngoại hình: không đổi hitbox, tốc độ, va chạm của người chơi.
   · Tham số: data/ws-view.js (window.WS_VIEW). Trang phục (spec sau) cắm vào qua WSAvatar.build(extra).
   Nạp SAU ws-maps.js. File lỗi thì game vẫn chơi như cũ (góc nhìn 1).
   ===================================================================== */
'use strict';
(function(){
if(typeof S==='undefined'||typeof THREE==='undefined'||!window.WSX_API||typeof movePlayer!=='function'||typeof muzzleFrom!=='function'||typeof fire!=='function'){
  console.warn('[WS avatar] game chưa sẵn sàng – bỏ qua');return}
const API=window.WSX_API,X=API.X;

/* ===================== THAM SỐ (data/ws-view.js, có kiểm định) ===================== */
const RANGE={distance:[2.2,4.5],shoulder:[0,1],height:[0,.8],blend:[.05,.4],minDist:[.5,1.5],fadeDist:[.8,2],recoil:[.05,.2]};
const DEF={distance:3.2,shoulder:.6,height:.3,blend:.15,minDist:.8,fadeDist:1.2,recoil:.1};
const V=Object.assign({},DEF);
(function(){
  const src=window.WS_VIEW;
  if(!src||typeof src!=='object'){console.warn('[WS avatar] thiếu data/ws-view.js – dùng giá trị mặc định');return}
  for(const k in DEF){const v=src[k];
    if(typeof v==='number'&&isFinite(v)&&v>=RANGE[k][0]&&v<=RANGE[k][1])V[k]=v;
    else if(v!==undefined)console.warn('[WS avatar] ws-view.js: '+k+' = '+v+' ngoài khoảng '+RANGE[k].join('–')+' – dùng '+DEF[k])}
})();
if(V.fadeDist<=V.minDist)V.fadeDist=V.minDist+.2;
X.view=X.view==='tp'?'tp':'fp';

/* ===================== HÌNH HỌC NHÂN VẬT ===================== */
const SKIN=0xf5d06b,HAIR=0x2b2230,PANTS=0x23283d,SHOE=0x151826,EYE=0x151826,GUNC=0x2f3542;
/* điểm xoay (pivot) của từng bộ phận, trong toạ độ nhân vật (chân chạm đất tại y=0, mắt ở y=1.7) */
const PIV={head:[0,1.45,0],torso:[0,1.1,0],armL:[-.4,1.42,0],armR:[.4,1.42,0],legL:[-.15,.78,0],legR:[.15,.78,0],back:[0,1.1,0]};
const GUN_TIP=[0,-1.16,-.02];                      /* họng súng, trong toạ độ tay phải */
function baseBoxes(shirt){return{
  head:[{s:[.46,.46,.46],p:[0,.23,0],c:SKIN},{s:[.5,.12,.5],p:[0,.46,0],c:HAIR},{s:[.07,.07,.02],p:[-.1,.26,-.235],c:EYE},{s:[.07,.07,.02],p:[.1,.26,-.235],c:EYE}],
  torso:[{s:[.6,.7,.34],p:[0,0,0],c:shirt}],
  armL:[{s:[.2,.58,.22],p:[0,-.29,0],c:shirt},{s:[.2,.16,.22],p:[0,-.66,0],c:SKIN}],
  armR:[{s:[.2,.58,.22],p:[0,-.29,0],c:shirt},{s:[.2,.16,.22],p:[0,-.66,0],c:SKIN},{s:[.11,.5,.15],p:[0,-.9,-.02],c:GUNC}],
  legL:[{s:[.26,.62,.28],p:[0,-.31,0],c:PANTS},{s:[.26,.16,.32],p:[0,-.7,-.02],c:SHOE}],
  legR:[{s:[.26,.62,.28],p:[0,-.31,0],c:PANTS},{s:[.26,.16,.32],p:[0,-.7,-.02],c:SHOE}]}}
const _col=new THREE.Color();
/* gộp danh sách hộp {s:[w,h,d],p:[x,y,z],c:màu} thành 1 geometry có vertex color */
function mergeBoxes(list){
  const pos=[],nor=[],col=[],idx=[];let off=0;
  for(const b of list){const g=new THREE.BoxGeometry(b.s[0],b.s[1],b.s[2]);g.translate(b.p[0],b.p[1],b.p[2]);
    const P=g.attributes.position.array,N=g.attributes.normal.array,I=g.index.array;_col.set(b.c);
    for(let i=0;i<P.length;i++){pos.push(P[i]);nor.push(N[i])}
    for(let i=0;i<P.length/3;i++)col.push(_col.r,_col.g,_col.b);
    for(let i=0;i<I.length;i++)idx.push(I[i]+off);off+=P.length/3;g.dispose()}
  const o=new THREE.BufferGeometry();o.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));o.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  o.setAttribute('color',new THREE.Float32BufferAttribute(col,3));o.setIndex(idx);return o}

const mat=new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,depthWrite:true});
const avatar=new THREE.Group();avatar.visible=false;avatar.name='wsAvatar';scene.add(avatar);
const parts={};                                   /* tên → Mesh (đầu, thân, tay, chân, lưng) */
let blob=null;
function build(extra){
  extra=extra||{};
  for(const k in parts){avatar.remove(parts[k]);parts[k].geometry.dispose();delete parts[k]}
  const base=baseBoxes(_col.set((typeof HERO!=='undefined'&&HERO&&HERO.col)||'#00d2ff').getHex());
  const names=['head','torso','armL','armR','legL','legR'];
  if(extra.back&&extra.back.length)names.push('back');
  for(const n of names){
    const m=new THREE.Mesh(mergeBoxes((base[n]||[]).concat(extra[n]||[])),mat);
    m.position.set(PIV[n][0],PIV[n][1],PIV[n][2]);m.frustumCulled=false;m.castShadow=false;
    avatar.add(m);parts[n]=m}
  if(!blob){const g=new THREE.CircleGeometry(.55,16);g.rotateX(-Math.PI/2);
    blob=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.38,depthWrite:false}));blob.frustumCulled=false;scene.add(blob);blob.visible=false}
}
build();

/* ===================== VA CHẠM CAMERA ===================== */
const R=.25,STEP=.12;
/* điểm (x,y,z) có nằm trong khối đặc nào không: khối che, sàn cao/dốc, container/kệ sách, mặt đất */
function envFree(x,y,z){
  if(y<.3)return false;
  for(let i=0;i<COVERS.length;i++){const b=COVERS[i].box;
    if(x>b.min.x-R&&x<b.max.x+R&&z>b.min.z-R&&z<b.max.z+R&&y<b.max.y+.05&&y>b.min.y-.05)return false}
  if(window.wsFloorY&&y<window.wsFloorY(x,z,y)+.3)return false;
  const M=window.WSMAP;
  if(M&&M.on()){
    for(const d of M.MAP.decks)if(x>d.x0-R&&x<d.x1+R&&z>d.z0-R&&z<d.z1+R&&y<d.h)return false;
    for(const d of M.dyn)if(d.on&&Math.abs(x-d.cx)<d.hx+R&&Math.abs(z-d.cz)<d.hz+R&&y<d.h)return false}
  return true}

/* ===================== TRẠNG THÁI GÓC NHÌN ===================== */
const _vq=new THREE.Quaternion(),_vo=new THREE.Vector3(),_vd=new THREE.Vector3();
let vb=0,curK=1,dCam=0,lastX=0,lastZ=0,lastHp=0,phase=0,speed=0,hurtT=0,kick=0,t0=0,hasPos=false;
const wantTP=()=>X.view==='tp'&&S.running&&!S.ended&&!(S.zoom&&S.wep===2);   /* ngắm Railgun: tạm về góc 1 */
const tpActive=()=>vb>.5;

function updateView(dt){
  const p=yawObj.position;
  vb=Math.min(1,Math.max(0,vb+(wantTP()?1:-1)*dt/V.blend));
  if(vb<=0){camera.position.set(0,0,0);avatar.visible=false;blob.visible=false;ray.near=0;curK=1;dCam=0;hasPos=false;return}
  /* camera: lệch (vai, cao, sau) trong hệ toạ độ của pitchObj, xoay về thế giới để dò va chạm */
  _vq.copy(yawObj.quaternion).multiply(pitchObj.quaternion);
  _vo.set(V.shoulder,V.height,V.distance).applyQuaternion(_vq);
  const len=_vo.length();_vd.copy(_vo).divideScalar(len);
  let free=len;
  for(let d=STEP;d<=len+.001;d+=STEP){if(!envFree(p.x+_vd.x*d,p.y+_vd.y*d,p.z+_vd.z*d)){free=Math.max(0,d-STEP-.05);break}}
  const target=free/len;
  curK=target<curK?target:curK+(target-curK)*Math.min(1,dt/V.blend*2);   /* vào gần: tức thì · ra xa: mượt */
  const k=Math.min(vb,curK);
  camera.position.set(V.shoulder*k,V.height*k,V.distance*k);
  ray.near=V.distance*k;                          /* tia bắn bỏ qua mọi thứ giữa camera và đầu nhân vật */
  dCam=len*k;
  /* nhân vật: đặt tại chân, quay theo hướng nhìn, mờ dần khi camera sát */
  const op=Math.min(1,Math.max(0,(dCam-V.minDist)/(V.fadeDist-V.minDist)))*vb;
  mat.opacity=op;avatar.visible=op>.03;
  avatar.position.set(p.x,p.y-1.7,p.z);avatar.rotation.y=yawObj.rotation.y;
  blob.visible=avatar.visible&&qLevel!=='ultra';blob.material.opacity=.38*op;blob.position.set(p.x,p.y-1.7+.03,p.z);
  /* ---- hoạt ảnh theo trạng thái thật ---- */
  const t=performance.now()/1000;
  if(!hasPos){lastX=p.x;lastZ=p.z;lastHp=S.hp;hasPos=true}
  const sp=dt>0?Math.min(14,Math.hypot(p.x-lastX,p.z-lastZ)/dt):0;lastX=p.x;lastZ=p.z;
  speed+=(sp-speed)*Math.min(1,dt*10);
  phase+=dt*speed*1.7;
  if(S.hp<lastHp-.01)hurtT=.12;lastHp=S.hp;
  hurtT=Math.max(0,hurtT-dt);
  const kickAmt=kick>0?.45*kick/V.recoil:0;kick=Math.max(0,kick-dt);   /* biên độ giật lấy TRƯỚC khi trừ thời gian: khung hình chậm vẫn thấy đủ cú giật */
  mat.emissive.setRGB(hurtT>0?.55*hurtT/.12:0,hurtT>0?.55*hurtT/.12:0,hurtT>0?.55*hurtT/.12:0);
  const air=S.vy>0.3||(S.vy<-.5);                 /* đang nhảy hoặc rơi */
  const swing=Math.sin(phase),la=Math.min(.85,speed*.11),aa=Math.min(.7,speed*.1);
  const breath=Math.sin(t*2)*.015;
  let legL=swing*la,legR=-swing*la,armL=-swing*aa;
  let armLz=0;
  if(air){legL=-.5;legR=.35;armL=S.vy>0?-2.3:-.3;armLz=S.vy>0?0:.7}
  parts.legL.rotation.x=legL;parts.legR.rotation.x=legR;
  parts.armL.rotation.x=armL+breath;parts.armL.rotation.z=armLz;
  const aim=Math.PI/2+pitchObj.rotation.x;        /* tay phải cầm súng, theo hướng nhìn lên/xuống */
  parts.armR.rotation.x=aim+kickAmt+breath*.5;
  parts.torso.scale.y=1+Math.sin(t*2)*.012;
  avatar.rotation.x=S.dashT>0?-.35:0;
  if(parts.back){parts.back.rotation.x=Math.min(.6,speed*.04)+Math.sin(t*3)*.03}
  /* súng góc nhìn 1 và tia sáng đầu nòng gắn với camera: ẩn khi ở góc 3 (game tự bật lại khi về góc 1) */
  if(tpActive()){for(const g of GUNS)g.visible=false;muzzle.visible=false}
}

/* ===================== MÓC VÀO GAME ===================== */
const _mp=movePlayer;
movePlayer=function(dt){_mp(dt);updateView(dt)};

const _mz=muzzleFrom;
muzzleFrom=function(out){
  if(!tpActive())return _mz(out);
  avatar.updateMatrixWorld(true);                  /* họng súng = đầu nòng trên tay avatar */
  return parts.armR.localToWorld(out.set(GUN_TIP[0],GUN_TIP[1],GUN_TIP[2]))};

const _fire=fire;
fire=function(){const c=S.fireCd;_fire();if(S.fireCd>c)kick=V.recoil};

const _ss=startStage;
startStage=function(i){vb=0;curK=1;camera.position.set(0,0,0);ray.near=0;hasPos=false;const r=_ss(i);build(window.__WSOutfit||null);return r};
const _tm=toMenu;
toMenu=function(){vb=0;curK=1;camera.position.set(0,0,0);avatar.visible=false;blob.visible=false;ray.near=0;return _tm()};

/* ===================== ĐỔI GÓC NHÌN: PHÍM C + NÚT 👁 ===================== */
function setView(v){
  v=v==='tp'?'tp':'fp';if(X.view===v)return;X.view=v;API.save();
  if(S.running)toast(v==='tp'?'👁 Góc nhìn thứ 3 · bấm C để quay lại':'👁 Góc nhìn thứ nhất · bấm C để đổi','info',1500)}
const toggle=()=>setView(X.view==='tp'?'fp':'tp');
addEventListener('keydown',e=>{
  if(e.code!=='KeyC'||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.target&&e.target.tagName==='INPUT')return;
  if(!S.running||S.paused||S.modal||S.ended)return;
  toggle()});
const css=document.createElement('style');
css.textContent='#viewB{position:absolute;pointer-events:auto;right:98px;bottom:132px;width:50px;height:50px;border-radius:50%;border:2px solid #fff;color:#fff;font:800 20px Nunito;background:rgba(0,190,140,.55)}';
document.head.appendChild(css);
const touchBox=document.getElementById('touch');
if(touchBox){
  const b=document.createElement('button');b.id='viewB';b.textContent='👁';b.setAttribute('aria-label','Đổi góc nhìn');touchBox.appendChild(b);
  b.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(S.running&&!S.paused&&!S.modal&&!S.ended)toggle()},{passive:false});
  b.addEventListener('click',e=>{e.stopPropagation();if(S.running&&!S.paused&&!S.modal&&!S.ended)toggle()})}

/* ===================== DÙNG CHO TEST VÀ CHO TRANG PHỤC ===================== */
window.WSAvatar={V,parts,avatar,build,setView,toggle,envFree,
  get view(){return X.view},get blend(){return vb},get distance(){return dCam},get active(){return tpActive()},get near(){return ray.near}};
console.log('[WS avatar] đã nạp: nhân vật khối + góc nhìn thứ 3 (phím C)');
})();
