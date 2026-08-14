
(function(){'use strict';
  var y=document.querySelector('.yr'); if(y) y.textContent=new Date().getFullYear();
  var burger=document.querySelector('.burger'), mnav=document.querySelector('.mnav');
  if(burger){burger.addEventListener('click',function(){
    var open=mnav.classList.toggle('open');
    burger.setAttribute('aria-expanded',open?'true':'false');
  });}

  var hb=document.querySelector('.hb');
  if(hb && 'IntersectionObserver' in window){
    new IntersectionObserver(function(es,o){
      es.forEach(function(e){ if(e.isIntersecting){ hb.classList.add('drawn'); o.disconnect(); } });
    },{threshold:.25}).observe(hb);
  } else if(hb){ hb.classList.add('drawn'); }
})();
