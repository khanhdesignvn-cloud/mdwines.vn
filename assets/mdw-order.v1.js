(function(){var K='mdwines:order-cart',P={},ov,box;
function rd(){try{var a=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function wr(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}}
function fmt(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')+' ₫'}
function load(){document.querySelectorAll('.sl a[data-pid]').forEach(function(a){P[a.dataset.pid]={n:a.dataset.name,p:+a.dataset.price,i:a.querySelector('img').getAttribute('src')}})}
function build(){ov=document.createElement('div');ov.className='mo';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.innerHTML='<div class="mo-c"></div>';document.body.appendChild(ov);box=ov.firstChild;
ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('.mo-x')||e.target.closest('.more'))close();var q=e.target.closest('[data-d]');if(q){var c=rd(),id=q.dataset.id,d=+q.dataset.d;c=c.map(function(x){if(x.productId===id)x.quantity+=d;return x}).filter(function(x){return x.quantity>0});wr(c);draw()}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()})}
function close(){ov.classList.remove('on');document.body.style.overflow=''}
function draw(){var c=rd().filter(function(x){return P[x.productId]}),t=0,h='<div class="mo-h"><span>✓ Đã thêm vào giỏ</span><button class="mo-x" aria-label="Đóng">×</button></div>';
c.forEach(function(x){var p=P[x.productId];t+=p.p*x.quantity;h+='<div class="mo-i"><img src="'+p.i+'" alt=""><b>'+p.n+'<em>'+fmt(p.p)+'</em></b><div class="mo-q"><button data-id="'+x.productId+'" data-d="-1" aria-label="Giảm">−</button><span>'+x.quantity+'</span><button data-id="'+x.productId+'" data-d="1" aria-label="Tăng">+</button></div></div>'});
if(!c.length)h+='<p style="color:#cbbcae">Giỏ hàng trống.</p>';
h+='<div class="mo-t"><span>Tạm tính</span><span>'+fmt(t)+'</span></div><div class="mo-b"><button class="more" type="button">Xem tiếp bài viết</button><a class="go" href="/checkout">Thanh toán</a></div>';box.innerHTML=h}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.sl a[data-pid]');if(!a)return;e.preventDefault();if(!ov){load();build()}
var id=a.dataset.pid,c=rd(),f=c.filter(function(x){return x.productId===id})[0];if(f)f.quantity+=1;else c.push({productId:id,quantity:1});wr(c);draw();ov.classList.add('on');document.body.style.overflow='hidden'});
})();
