
(function(){'use strict';
  var box=document.querySelector('.bfilter'); if(!box) return;
  var grid=document.querySelector('.pgrid-b');
  var cards=grid.querySelectorAll('.pcard');
  var first=box.querySelector('button[aria-pressed=true]');
  if(first) cards.forEach(function(c){ c.hidden = (c.dataset.b!==first.dataset.b); });
  box.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b) return;
    var key=b.dataset.b;
    box.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed','false');});
    b.setAttribute('aria-pressed','true');
    cards.forEach(function(c){ c.hidden = (c.dataset.b!==key); });
  });
})();
