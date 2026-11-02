(function(){
var SL=[{s:'/assets/media/hero-slide-1.webp',a:'Bộ sưu tập rượu vang MD Wines giữa đồi nho South Australia',mx:'100%'},
        {s:'/assets/media/hero-slide-2.webp',a:'Sáu chai vang đỏ MD Wines trên bệ đá giữa vườn nho',mx:'50%'}];
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
// Điều hướng đầy đủ sang trang tĩnh /tin-tuc/
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="/tin-tuc"]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;e.preventDefault();e.stopImmediatePropagation();location.href=a.getAttribute('href')},true);
