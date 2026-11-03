(function(){
var SL=[{s:'/assets/media/hero-md-0.webp',a:'Sáu chai vang đỏ MD Wines cùng túi quà trên nền bordeaux',mx:'60%'},
        {s:'/assets/media/hero-md-1.webp',a:'Sáu chai vang đỏ MD Wines cùng túi quà đỏ vàng',mx:'72%'},
        {s:'/assets/media/hero-md-2.webp',a:'Kệ trưng bày rượu vang Úc MD Wines và hộp quà Tết',mx:'68%'},
        {s:'/assets/media/hero-md-3.webp',a:'Logo MD Wines trên tường xanh cùng các tranh vườn nho',mx:'55%'},
        {logo:1,a:'MD Wines — Taste the exceptional'}];
var T=6000,timer=null,idx=0,root=null,sl=[],dots=[];
function show(n){
  idx=(n+SL.length)%SL.length;
  sl.forEach(function(el,i){el.classList.toggle('on',i===idx)});
  dots.forEach(function(d,i){d.classList.remove('on');if(i===idx){void d.offsetWidth;d.classList.add('on')}});
  clearTimeout(timer);timer=setTimeout(function(){show(idx+1)},T);
}
function build(bg){
  if(bg.getAttribute('data-hs'))return;bg.setAttribute('data-hs','1');
  root=bg;sl=[];dots=[];
  SL.forEach(function(o,i){
    var d=document.createElement('div');d.className='hs';
    if(o.logo){d.classList.add('lg');d.innerHTML='<div class="lgi"><img src="/assets/media/mdwines-gold-logo-new_03006611_hq.webp" alt="'+o.a+'" width="300" height="300"><span>MD WINES</span><em>Taste the exceptional</em></div>';bg.appendChild(d);sl.push(d);return}
    var im=new Image();im.src=o.s;im.alt=o.a;im.decoding='async';im.draggable=false;
    if(i>0)im.loading='lazy';else im.fetchPriority='high';
    im.style.setProperty('--mx',o.mx);d.style.setProperty('--mx',o.mx);d.appendChild(im);bg.appendChild(d);sl.push(d);
  });
  var hero=bg.parentNode,w=document.createElement('div');w.className='hero-dots';
  SL.forEach(function(o,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Ảnh '+(i+1));b.onclick=function(){show(i)};w.appendChild(b);dots.push(b)});
  hero.appendChild(w);
  var x0=null;
  hero.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  hero.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50)show(idx+(dx<0?1:-1))},{passive:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)clearTimeout(timer);else show(idx)});
  show(0);
}
function scan(){var bg=document.querySelector('.hero-bg');if(bg)build(bg);else{clearTimeout(timer)}}
new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
scan();
})();
// Spotlight theo chuột trên thẻ sản phẩm
document.addEventListener('mousemove',function(e){var c=e.target.closest&&e.target.closest('.shop-wine-card');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--sx',(e.clientX-r.left)+'px');c.style.setProperty('--sy',(e.clientY-r.top)+'px')},{passive:true});

// ===== Chuyển trang mượt: mờ nhẹ + logo loading =====
(function(){
  var ov=document.createElement('div');ov.id='mdwt';
  ov.innerHTML='<img src="/assets/media/mdwines-gold-logo-new_03006611_hq.webp" alt="" width="72" height="72">';
  var st=document.createElement('style');
  st.textContent='#mdwt{display:none!important;position:fixed;inset:0;z-index:2147482000;display:flex;align-items:center;justify-content:center;background:#120708;opacity:0;pointer-events:none;transition:opacity .28s ease}#mdwt.on{opacity:1;pointer-events:all}#mdwt img{width:72px;height:72px;object-fit:contain;opacity:0;transform:scale(.92);transition:opacity .3s .08s,transform .5s;filter:drop-shadow(0 0 18px #e1c69a66)}#mdwt.on img{opacity:1;transform:scale(1);animation:mdwp 1.3s ease-in-out infinite}@keyframes mdwp{50%{opacity:.55;transform:scale(.96)}}body{animation:mdwin .5s ease both}@keyframes mdwin{from{opacity:0}}@media(prefers-reduced-motion:reduce){#mdwt,#mdwt img{transition:none;animation:none!important}body{animation:none}}';
  function mount(){document.head.appendChild(st);document.body.appendChild(ov)}
  if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount);
  var bypass=false,timer=null;
  function cover(instant){clearTimeout(timer);if(instant){ov.style.transition='none';ov.classList.add('on');void ov.offsetWidth;ov.style.transition=''}else ov.classList.add('on')}
  function uncover(){clearTimeout(timer);timer=setTimeout(function(){ov.classList.remove('on')},420)}
  ['pushState','replaceState'].forEach(function(k){var o=history[k];history[k]=function(){
    if(!ov.classList.contains('on')&&k==='pushState'&&location.pathname!==(arguments[2]&&String(arguments[2]).split(/[?#]/)[0]))cover(true);
    var r=o.apply(this,arguments);if(ov.classList.contains('on'))uncover();return r}});
  window.addEventListener('popstate',function(){cover(true);uncover()});
  document.addEventListener('click',function(e){
    if(bypass||e.defaultPrevented||e.button||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
    var h=a.getAttribute('href');if(!h||h.charAt(0)==='#'||/^(mailto:|tel:|javascript:|https?:\/\/(?!mdwines\.vn))/i.test(h))return;
    if(a.closest('#mdwc,#mdwage,[data-pid]'))return;
    var u;try{u=new URL(h,location.href)}catch(x){return}
    if(u.origin!==location.origin)return;
    if(u.pathname===location.pathname&&u.search===location.search)return;
    if(h==='/tu-van-chon-vang'||a.matches('[href="/tu-van-chon-vang"]'))return;
    var full=/^\/(tin-tuc|cau-chuyen)/.test(u.pathname)||/\.html?$/.test(u.pathname)||/^\/(tin-tuc|cau-chuyen)/.test(location.pathname)||/\.html?$/.test(location.pathname);
    e.preventDefault();e.stopImmediatePropagation();
    cover(false);
    setTimeout(function(){
      if(full){location.href=u.href;return}
      bypass=true;a.click();bypass=false;uncover();
    },260);
  },true);
  window.addEventListener('pageshow',function(e){if(e.persisted){ov.classList.remove('on')}});
})();
