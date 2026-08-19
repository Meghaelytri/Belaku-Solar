
(function(){'use strict';
  var box=document.querySelector('.bfilter'); if(!box) return;
  var grid=document.querySelector('.pgrid-b');
  var cards=grid.querySelectorAll('.pcard');
  var tabs=box.querySelectorAll('button');
  var first=box.querySelector('button[aria-selected=true]');
  if(first) cards.forEach(function(c){ c.hidden = (c.dataset.b!==first.dataset.b); });
  function select(b){
    var key=b.dataset.b;
    tabs.forEach(function(x){x.setAttribute('aria-selected','false');x.tabIndex=-1;});
    b.setAttribute('aria-selected','true');b.tabIndex=0;b.focus();
    cards.forEach(function(c){ c.hidden = (c.dataset.b!==key); });
  }
  box.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b) return;
    select(b);
  });
  tabs.forEach(function(t,i){
    t.addEventListener('keydown',function(e){
      var n=tabs.length, dir=0;
      if(e.key==='ArrowRight') dir=1; else if(e.key==='ArrowLeft') dir=-1;
      else if(e.key==='Home'){select(tabs[0]);e.preventDefault();return;}
      else if(e.key==='End'){select(tabs[n-1]);e.preventDefault();return;}
      else return;
      e.preventDefault();
      select(tabs[(i+dir+n)%n]);
    });
  });
})();
