(function(){
var K='mdwines:order-cart',SPA=!!document.getElementById('root'),
P={'md-cabernet-sauvignon-2022':['MD Cabernet Sauvignon 2022',550000,'cab'],'md-shiraz-2021':['MD Shiraz 2021',550000,'shi'],'md-cabernet-sauvignon-coonawarra-2021':['MD 90 Cabernet Sauvignon',900000,'90'],'md-the-quietude-04':['The Quietude 04',950000,'qui'],'md-77-shiraz-barossa-2020':['MD 77 Shiraz',1300000,'77'],'ghe-1575-return-2022':['GHE 1575 Return',1500000,'ghe']};
function rd(){try{var a=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function wr(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}}
function cnt(){return rd().reduce(function(s,x){return s+(+x.quantity||0)},0)}
function fmt(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+' ₫'}
var css='#mdw-fab{position:fixed;right:16px;bottom:22px;z-index:2147481000;width:76px;height:76px;display:grid;place-items:center;align-content:center;gap:1px;background:linear-gradient(135deg,#f3d27f,#b8893a);color:#21090e;border:1px solid #ffe6addb;cursor:pointer;font:700 9px/1 Fraunces,Georgia,serif;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 14px 34px #00000057,0 0 0 4px #c49a611f;transition:transform .2s}'+
'#mdw-fab:hover{transform:translateY(-3px)}#mdw-fab svg{width:26px;height:26px}#mdw-fab b{position:absolute;top:-8px;right:-8px;min-width:22px;height:22px;padding:0 5px;border-radius:99px;background:#260a10;color:#f3d27f;border:1px solid #ffe2a4bf;font:700 11px/20px Fraunces,Georgia,serif;text-align:center;letter-spacing:0}'+
'.mbar~#mdw-fab{bottom:84px}'+
'.mdw-has{animation:mdwglow 2.4s ease-in-out infinite}@keyframes mdwglow{0%,100%{box-shadow:0 14px 34px #00000057,0 0 0 4px #c49a611f}50%{box-shadow:0 14px 34px #00000057,0 0 0 8px #e8c66d55,0 0 34px #e8c66d99}}'+
'.mdw-shake{animation:mdwshake .75s cubic-bezier(.36,.07,.19,.97) 1,mdwglow 2.4s ease-in-out infinite}@keyframes mdwshake{10%,90%{transform:translateX(-2px) rotate(-3deg)}20%,80%{transform:translateX(3px) rotate(4deg)}30%,50%,70%{transform:translateX(-5px) rotate(-6deg)}40%,60%{transform:translateX(5px) rotate(6deg)}}'+
'.mdw-pop b{animation:mdwpop .5s ease}@keyframes mdwpop{50%{transform:scale(1.5)}}'+
'@media(prefers-reduced-motion:reduce){.mdw-has,.mdw-shake,.mdw-pop b{animation:none!important}}'+
'.mo{position:fixed;inset:0;z-index:2147482500;background:#000a;display:none;align-items:flex-end;justify-content:center}.mo.on{display:flex}@media(min-width:700px){.mo{align-items:center}}'+
'.mo-c{width:100%;max-width:440px;background:#170709;border:1px solid #d4af5f66;padding:22px 20px 20px;box-shadow:0 20px 60px #000c;max-height:90vh;overflow:auto;font-family:Fraunces,Georgia,serif}'+
'.mo-h{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px;font:800 12px/1 Fraunces,Georgia,serif;letter-spacing:.16em;text-transform:uppercase;color:#e8c66d}.mo-x{background:none;border:0;color:#e9ddd0;font-size:26px;line-height:1;cursor:pointer;padding:0 4px}'+
'.mo-i{display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid #3a2328}.mo-i img{width:26px;flex:none}.mo-i b{flex:1;font:600 14px/1.35 Fraunces,Georgia,serif;color:#f5f0e7}.mo-i em{font-style:normal;color:#e8c66d;font-size:13px;display:block}'+
'.mo-q{display:flex;align-items:center;border:1px solid #d4af5f66}.mo-q button{background:none;border:0;color:#e8c66d;width:30px;height:30px;font-size:18px;cursor:pointer}.mo-q span{min-width:24px;text-align:center;font-size:14px;color:#f5f0e7}'+
'.mo-t{display:flex;justify-content:space-between;padding:14px 0 6px;border-top:1px solid #d4af5f55;font:700 15px/1 Fraunces,Georgia,serif;color:#f5f0e7}.mo-t span:last-child{color:#e8c66d}'+
'.mo-b{display:flex;gap:8px;margin-top:10px}.mo-b a,.mo-b button{flex:1;text-align:center;text-decoration:none;font:800 12px/1 Fraunces,Georgia,serif;letter-spacing:.12em;text-transform:uppercase;padding:14px 8px;cursor:pointer}.mo-b .go{background:linear-gradient(135deg,#e8c66d,#b8893a);color:#1a0a0f;border:0}.mo-b .more{background:none;color:#e8c66d;border:1px solid #d4af5f}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var fab=null,ov=null,box=null,last=-1;
function target(){return document.querySelector('.gold-cart-float')||fab}
function badge(n){var t=target();if(!t)return;var b=t.querySelector('b');if(b&&!SPA)b.textContent=n;if(b&&!SPA)b.style.display=n?'':'none'}
function upd(){var n=cnt(),t=target();if(!t)return;badge(n);t.classList.toggle('mdw-has',n>0);
 if(last>=0&&n>last){t.classList.remove('mdw-shake','mdw-pop');void t.offsetWidth;t.classList.add('mdw-shake','mdw-pop');setTimeout(function(){t.classList.remove('mdw-shake','mdw-pop')},900)}
 last=n}
function mk(){if(SPA||fab)return;fab=document.createElement('button');fab.id='mdw-fab';fab.type='button';fab.setAttribute('aria-label','Mở giỏ hàng');
 fab.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span>Giỏ hàng</span><b>0</b>';
 fab.addEventListener('click',openP);document.body.appendChild(fab);upd()}
function build(){if(ov)return;ov=document.createElement('div');ov.className='mo';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.innerHTML='<div class="mo-c"></div>';document.body.appendChild(ov);box=ov.firstChild;
 ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('.mo-x')||e.target.closest('.more'))closeP();var q=e.target.closest('[data-d]');if(q){var c=rd(),id=q.dataset.id,d=+q.dataset.d;c=c.map(function(x){if(x.productId===id)x.quantity+=d;return x}).filter(function(x){return x.quantity>0});wr(c);draw()}});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closeP()})}
function closeP(){ov.classList.remove('on');document.body.style.overflow=''}
function draw(){var c=rd().filter(function(x){return P[x.productId]}),t=0,h='<div class="mo-h"><span>Giỏ hàng của bạn</span><button class="mo-x" aria-label="Đóng">×</button></div>';
 c.forEach(function(x){var p=P[x.productId];t+=p[1]*x.quantity;h+='<div class="mo-i"><img src="/assets/media/bottle-'+p[2]+'.webp" alt=""><b>'+p[0]+'<em>'+fmt(p[1])+'</em></b><div class="mo-q"><button data-id="'+x.productId+'" data-d="-1" aria-label="Giảm">−</button><span>'+x.quantity+'</span><button data-id="'+x.productId+'" data-d="1" aria-label="Tăng">+</button></div></div>'});
 if(!c.length)h+='<p style="color:#cbbcae;margin:6px 0 14px">Giỏ hàng đang trống. Chọn một chai để bắt đầu.</p>';
 h+='<div class="mo-t"><span>Tạm tính</span><span>'+fmt(t)+'</span></div><div class="mo-b"><button class="more" type="button">Xem tiếp</button><a class="go" href="'+(c.length?'/checkout':'/ruou-vang')+'">'+(c.length?'Thanh toán':'Chọn rượu')+'</a></div>';box.innerHTML=h}
function openP(){build();draw();ov.classList.add('on');document.body.style.overflow='hidden'}
var sp=Storage.prototype.setItem;Storage.prototype.setItem=function(k){var r=sp.apply(this,arguments);if(k===K)setTimeout(upd,0);return r};
window.addEventListener('storage',function(e){if(e.key===K)upd()});
setInterval(upd,1500);
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-pid]');if(!a)return;e.preventDefault();var id=a.dataset.pid,c=rd(),f=c.filter(function(x){return x.productId===id})[0];if(f)f.quantity+=1;else c.push({productId:id,quantity:1});wr(c)});
function init(){mk();last=cnt();upd()}
if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();
