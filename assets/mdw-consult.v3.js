(function(){
  if(window.__mdwConsult)return;window.__mdwConsult=1;
  var WINES=[["md-cabernet-sauvignon-2022","Cabernet Sauvignon 2022"],["md-shiraz-2021","Shiraz 2021"],["md-cabernet-sauvignon-coonawarra-2021","MD 90 Cabernet Sauvignon Coonawarra 2021"],["md-the-quietude-04","The Quietude 04"],["md-77-shiraz-barossa-2020","MD 77 Shiraz Barossa Valley 2020"],["ghe-1575-return-2022","GHE 1575 Return 2022"]];
  var css='#mdwc{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(10,4,7,.78);backdrop-filter:blur(6px)}#mdwc.on{display:flex}#mdwc .bx{position:relative;width:100%;max-width:560px;max-height:calc(100vh - 32px);overflow:auto;background:#1a0a0f;border:1px solid rgba(201,162,75,.45);box-shadow:0 40px 100px rgba(0,0,0,.6);padding:34px 34px 28px;color:#f3ead8;font-family:inherit}#mdwc .x{position:absolute;top:10px;right:14px;background:none;border:0;color:#c9a24b;font-size:28px;line-height:1;cursor:pointer}#mdwc .ey{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#c9a24b}#mdwc h2{margin:8px 0 6px;font-size:28px;line-height:1.15;font-weight:500;color:#fff}#mdwc p.lead{margin:0 0 18px;font-size:14px;line-height:1.55;opacity:.8}#mdwc .g{display:grid;grid-template-columns:1fr 1fr;gap:10px}#mdwc .f{grid-column:1/-1}#mdwc input,#mdwc select,#mdwc textarea{width:100%;box-sizing:border-box;padding:12px 14px;font:inherit;font-size:14px;color:#f3ead8;background:rgba(255,255,255,.05);border:1px solid rgba(201,162,75,.28);border-radius:0;outline:0}#mdwc select option{background:#1a0a0f}#mdwc input:focus,#mdwc select:focus,#mdwc textarea:focus{border-color:#c9a24b}#mdwc textarea{min-height:84px;resize:vertical}#mdwc .go{margin-top:14px;width:100%;padding:14px;border:0;cursor:pointer;font:inherit;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:#1a0a0f;background:linear-gradient(135deg,#e8c66d,#b8893a)}#mdwc .go[disabled]{opacity:.6;cursor:wait}#mdwc .ct{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;padding-top:16px;border-top:1px solid rgba(201,162,75,.22);font-size:13px}#mdwc .ct a{color:#e8c66d;text-decoration:none;border:1px solid rgba(201,162,75,.4);padding:8px 14px}#mdwc .ct a:hover{background:rgba(201,162,75,.14)}#mdwc .msg{margin-top:12px;font-size:13px;line-height:1.5}#mdwc .msg.err{color:#ff9d8f}#mdwc .ok{text-align:center;padding:26px 6px}#mdwc .ok h2{font-size:24px}#mdwc .seal{margin:0 auto 14px;width:56px;height:56px}#mdwc .tick{stroke-dasharray:40;stroke-dashoffset:40;animation:mdwt .7s .25s ease forwards}@keyframes mdwt{to{stroke-dashoffset:0}}#mdwc .steps{list-style:none;margin:20px auto 14px;padding:0;max-width:340px;text-align:left}#mdwc .steps li{position:relative;padding:0 0 16px 30px;display:flex;flex-direction:column;font-size:15px}#mdwc .steps li:before{content:"";position:absolute;left:8px;top:18px;bottom:-2px;width:1px;background:#d4af5f66}#mdwc .steps li:last-child:before{display:none}#mdwc .steps i{position:absolute;left:0;top:3px;width:17px;height:17px;border-radius:50%;border:1px solid #d4af5f}#mdwc .steps .done i{background:#d4af5f}#mdwc .steps .wait i{animation:mdwp 1.6s ease-in-out infinite}@keyframes mdwp{50%{box-shadow:0 0 0 6px #d4af5f33}}#mdwc .steps span{font-size:12px;color:#b9a99b}#mdwc .sm{font-size:13px;color:#b9a99b;margin:4px 0 6px}#mdwc .ok .ct{justify-content:center}#mdwc-cf{position:fixed;inset:0;z-index:2147483600;pointer-events:none}@media(max-width:560px){#mdwc .g{grid-template-columns:1fr}#mdwc .bx{padding:28px 20px 22px}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var root=document.createElement('div');root.id='mdwc';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Yêu cầu tư vấn MD Wines');
  var opts='<option value="">Dòng vang bạn quan tâm</option>'+WINES.map(function(w){return '<option>'+w[1]+'</option>'}).join('')+'<option>Quà tặng / quà doanh nghiệp</option><option>Tìm điểm bán / Ưu đãi</option><option>Khác</option>';
  root.innerHTML='<div class="bx"><button class="x" type="button" aria-label="Đóng">&times;</button><div id="mdwc-form"><span class="ey">MD Wines Việt Nam</span><h2>Nhận tư vấn từ MD Wines</h2><p class="lead">Để lại thông tin, đội ngũ MD Wines sẽ liên hệ tư vấn dòng vang, quà tặng hoặc điểm bán phù hợp với bạn.</p><form novalidate><div class="g"><input name="name" placeholder="Họ và tên" autocomplete="name" required><input name="phone" placeholder="Số điện thoại" autocomplete="tel" inputmode="tel" required><input class="f" name="email" type="email" placeholder="Email (không bắt buộc)" autocomplete="email"><select class="f" name="wine">'+opts+'</select><textarea class="f" name="note" placeholder="Bạn cần tư vấn điều gì?"></textarea></div><button class="go" type="submit">Gửi yêu cầu</button><div class="msg" aria-live="polite"></div></form><div class="ct"><a href="tel:0913485279">Hotline 0913 485 279</a><a href="https://zalo.me/0913485279" target="_blank" rel="noopener">Zalo</a></div></div><div id="mdwc-ok" class="ok" style="display:none"><div class="seal"><svg viewBox="0 0 52 52" width="56" height="56" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" stroke="#d4af5f" stroke-width="1.5"/><path d="M15 27l8 8 15-17" fill="none" stroke="#d4af5f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="tick"/></svg></div><span class="ey">Đã nhận yêu cầu</span><h2>Cảm ơn bạn đã tin tưởng MD Wines</h2><p class="lead">Yêu cầu tư vấn của bạn đã được ghi nhận. Đội ngũ MD Wines sẽ liên hệ phản hồi trong thời gian sớm nhất.</p><ol class="steps"><li class="done"><i></i><b>Đã nhận thư</b><span id="mdwc-time"></span></li><li class="wait"><i></i><b>Đang chờ phản hồi</b><span>Giờ làm việc 6:00 – 20:00</span></li></ol><p class="sm" id="mdwc-sum"></p><div class="ct"><a href="tel:0913485279">Cần gấp: 0913 485 279</a><a href="#" id="mdwc-done">Đóng</a></div></div></div></div>';
  document.body.appendChild(root);
  var box=root.querySelector('.bx'),form=root.querySelector('form'),msg=root.querySelector('.msg'),okp=document.getElementById('mdwc-ok'),fp=document.getElementById('mdwc-form'),last=null,src='';
  function open(from,why){
    src=why||'';last=document.activeElement;
    var m=location.pathname.match(/\/ruou-vang\/([^\/]+)/);
    if(m){WINES.forEach(function(w){if(w[0]===m[1])form.wine.value=w[1]})}
    fp.style.display='';okp.style.display='none';msg.textContent='';msg.className='msg';
    root.classList.add('on');document.documentElement.style.overflow='hidden';
    setTimeout(function(){try{form.name.focus()}catch(e){}},50);
  }
  function close(){root.classList.remove('on');document.documentElement.style.overflow='';try{last&&last.focus()}catch(e){}}
  root.addEventListener('click',function(e){if(e.target===root||e.target.classList.contains('x'))close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('on'))close()});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var v={name:form.name.value.trim(),phone:form.phone.value.trim(),email:form.email.value.trim(),wine:form.wine.value,note:form.note.value.trim()};
    if(!v.name){msg.textContent='Vui lòng nhập họ và tên.';msg.className='msg err';return}
    if(!/^[0-9+\s().-]{8,16}$/.test(v.phone)&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)){msg.textContent='Vui lòng để lại số điện thoại hoặc email hợp lệ.';msg.className='msg err';return}
    var btn=form.querySelector('.go');btn.disabled=true;msg.textContent='Đang gửi...';msg.className='msg';
    var fields=[{label:'Họ và tên',value:v.name},{label:'Điện thoại',value:v.phone},{label:'Email',value:v.email},{label:'Quan tâm',value:v.wine},{label:'Nội dung',value:v.note},{label:'Nút bấm',value:src},{label:'Trang',value:location.pathname}].filter(function(f){return f.value});
    fetch('/consult.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:fields})}).then(function(r){return r.json().catch(function(){return{ok:false}})}).then(function(j){
      btn.disabled=false;
      if(j&&j.ok){var nm=v.name,wn=v.wine;form.reset();fp.style.display='none';okp.style.display='';var d=new Date(),p=function(n){return(n<10?'0':'')+n};document.getElementById('mdwc-time').textContent=p(d.getHours())+':'+p(d.getMinutes())+' · '+p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear();document.getElementById('mdwc-sum').textContent='Kính gửi '+nm+(wn?' · Quan tâm: '+wn:'');confetti();}
      else{msg.textContent=(j&&j.message)||'Chưa gửi được. Vui lòng gọi hotline 0913 485 279.';msg.className='msg err'}
    }).catch(function(){btn.disabled=false;msg.textContent='Chưa gửi được. Vui lòng gọi hotline 0913 485 279.';msg.className='msg err'});
  });

  function confetti(){
    try{
      if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
      var c=document.createElement('canvas');c.id='mdwc-cf';document.body.appendChild(c);
      var W=c.width=innerWidth,H=c.height=innerHeight,x=c.getContext('2d'),cols=['#d4af5f','#f3d27f','#e9ddd0','#9b2335','#c2455a','#8a5a12'],P=[],n=W<600?90:160;
      for(var i=0;i<n;i++){var side=i%2?1:-1;P.push({x:W/2+side*(Math.random()*W*.12),y:H*.55,vx:side*(Math.random()*9+2)+(Math.random()-.5)*4,vy:-(Math.random()*13+7),w:Math.random()*9+5,h:Math.random()*5+3,r:Math.random()*6.28,vr:(Math.random()-.5)*.35,c:cols[i%cols.length],petal:Math.random()<.45})}
      var t0=null;
      (function f(t){if(!t0)t0=t;var e=t-t0;x.clearRect(0,0,W,H);
        P.forEach(function(p){p.vy+=.28;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.globalAlpha=Math.max(0,1-e/3200);x.fillStyle=p.c;
          if(p.petal){x.beginPath();x.ellipse(0,0,p.w/2,p.h,0,0,6.283);x.fill()}else{x.fillRect(-p.w/2,-p.h/2,p.w,p.h)}x.restore()});
        if(e<3300)requestAnimationFrame(f);else c.remove()})(performance.now());
    }catch(er){}
  }
  document.getElementById('mdwc-done').addEventListener('click',function(e){e.preventDefault();close()});
  var TXT=/(tư vấn|liên hệ|hotline|zalo|messenger|tìm cửa hàng|ưu đãi|quà tặng doanh nghiệp|nhận báo giá)/i,SKIP=/(giỏ|thêm vào|đặt hàng|thanh toán|xem chi tiết|khám phá|đóng)/i;
  function match(el){
    if(!el||root.contains(el))return false;
    if(el.matches('button[type=submit],input[type=submit]'))return false;
    var h=el.getAttribute&&el.getAttribute('href')||'';
    if(h==='/tu-van-chon-vang'||h==='#lien-he')return true;
    if(el.closest&&el.closest('.contact-rail')){var t0=(el.textContent||'').trim();return /(hotline|zalo|messenger)/i.test(t0)}
    if(el.closest&&el.closest('form'))return false;
    var t=(el.textContent||'').replace(/\s+/g,' ').trim();
    return t.length>0&&t.length<48&&TXT.test(t)&&!SKIP.test(t)&&!/^(tel:|https?:)/i.test(h);
  }
  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest('a,button'):null;
    if(!match(el))return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    open(el,(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,60));
  },true);
  window.mdwOpenConsult=open;
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('.nav-dd>a'):null;
    var dd=a?a.parentElement:null;
    document.querySelectorAll('.nav-dd.open').forEach(function(n){if(n!==dd)n.classList.remove('open')});
    if(a&&window.matchMedia('(hover:none)').matches&&!dd.classList.contains('open')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();dd.classList.add('open')}
  },true);
})();
