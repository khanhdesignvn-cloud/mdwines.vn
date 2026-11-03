(function(){
try{
var LOGO='/assets/media/mdwines-gold-logo-new_03006611.webp';
var css='#mdw-tr{position:fixed;inset:0;z-index:2147483000;background:#120708;display:flex;align-items:center;justify-content:center;opacity:1;pointer-events:none;transition:opacity .55s ease}'+
'#mdw-tr img{width:min(34vw,150px);height:auto;transform:scale(1);opacity:1;transition:transform .75s cubic-bezier(.22,1,.36,1),opacity .55s ease}'+
'#mdw-tr.out{opacity:0}#mdw-tr.out img{transform:scale(2.4);opacity:0}'+
'#mdw-tr.in{transition:opacity .22s ease;pointer-events:all}#mdw-tr.in img{transform:scale(.8);opacity:1;transition:none}'+
'@media (prefers-reduced-motion:reduce){#mdw-tr,#mdw-tr img{transition:none!important}}';
var st=document.createElement('style');st.textContent=css;
var el=document.createElement('div');el.id='mdw-tr';el.setAttribute('aria-hidden','true');
el.innerHTML='<img src="'+LOGO+'" alt="" width="150" height="150">';
(document.head||document.documentElement).appendChild(st);
document.documentElement.appendChild(el);
var t0=Date.now(),done=false;
function hide(){el.className='out'}
function start(){if(done)return;done=true;var w=Math.max(0,350-(Date.now()-t0));setTimeout(hide,w)}
if(document.readyState==='complete')start();else window.addEventListener('load',start);
setTimeout(start,2500);
window.addEventListener('pageshow',function(e){if(e.persisted)hide()});
document.addEventListener('click',function(e){
 if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.hasAttribute('data-pid'))return;
 if(a.target&&a.target!=='_self')return;if(a.hasAttribute('download'))return;
 var u;try{u=new URL(a.href,location.href)}catch(x){return}
 if(u.origin!==location.origin)return;
 if(u.pathname===location.pathname&&u.search===location.search)return;
 if(/\.(pdf|jpg|png|webp|zip)$/i.test(u.pathname))return;
 el.className='in';
 clearTimeout(window.__mdwTrT);
 window.__mdwTrT=setTimeout(function(){hide()},700);
},true);
}catch(x){}
})();
