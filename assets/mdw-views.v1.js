(function(){
var p=location.pathname.match(/^\/tin-tuc\/([a-z0-9-]+)\/?$/),eye='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:4px" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>';
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
function chip(n){var s=document.createElement('span');s.className='vw';s.innerHTML=' · '+eye+fmt(n)+' lượt xem';return s}
function get(u,o){return fetch(u,o).then(function(r){return r.json()}).catch(function(){return null})}
if(p){
 var s=p[1],m=document.querySelector('.art .meta'),k='mdwv_'+s,seen=false;
 try{seen=sessionStorage.getItem(k)}catch(e){}
 var req=seen?get('/views.php?s='+s):get('/views.php',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({s:s})});
 req.then(function(j){if(j&&j.ok&&m){m.appendChild(chip(j.n||0));try{sessionStorage.setItem(k,'1')}catch(e){}}});
}else if(/^\/tin-tuc\/?$/.test(location.pathname)){
 get('/views.php?all=1').then(function(j){if(!j||!j.ok)return;document.querySelectorAll('.card').forEach(function(c){var m=c.querySelector('.meta'),h=(c.getAttribute('href')||'').match(/tin-tuc\/([a-z0-9-]+)/);if(m&&h)m.appendChild(chip((j.v&&j.v[h[1]])||0))})});
}
})();
