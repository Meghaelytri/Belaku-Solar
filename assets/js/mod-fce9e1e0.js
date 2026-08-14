
(function(){'use strict';
  var grid=document.querySelector('.pgrid-b'); if(!grid) return;
  var m=document.createElement('div'); m.className='pmodal'; m.setAttribute('role','dialog');
  m.setAttribute('aria-modal','true'); m.innerHTML=
    '<div class="pmodal__bd"></div><div class="pmodal__in">'+
    '<button class="pmodal__x" aria-label="Close">&times;</button>'+
    '<div class="pmodal__img"></div><div class="pmodal__b"></div></div>';
  document.body.appendChild(m);
  var img=m.querySelector('.pmodal__img'), body=m.querySelector('.pmodal__b'), last=null;
  function open(card){
    last=card;
    img.innerHTML = card.dataset.img ? '<img src="'+card.dataset.img+'" alt="'+card.dataset.name+'">' : '';
    body.innerHTML='<span class="pmodal__brand">'+card.dataset.brand+'</span>'+
      '<h3>'+card.dataset.name+'</h3><p>'+card.dataset.desc+'</p>'+
      (card.dataset.spec?'<ul class="pmodal__spec">'+card.dataset.spec+'</ul>':'')+
      (card.dataset.cols?'<ul class="pmodal__cols"><li class="lbl">Colours available</li>'+card.dataset.cols+'</ul>':'')+
      '<div class="pmodal__why"><b>What we include</b><span>Free site visit and sizing, delivery, '+
      'installation by our own team, and the manufacturer warranty registered in your name.</span></div>'+
      '<p class="pmodal__note">Prices change with the model and the size of the job, so we quote after '+
      'the site visit &mdash; and tell you then what is extra, not afterwards.</p>'+
      '<a class="btn btn--gold btn--sm" target="_blank" rel="noopener" href="'+card.dataset.wa+'">Enquire about this model &rarr;</a>';
    m.classList.add('show'); document.body.classList.add('pmodal-open');
    m.querySelector('.pmodal__x').focus();
  }
  function close(){ m.classList.remove('show'); document.body.classList.remove('pmodal-open'); if(last) last.focus(); }
  grid.addEventListener('click',function(e){
    if(e.target.closest('a')) return;
    var c=e.target.closest('.pcard'); if(c) open(c);
  });
  grid.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ') return;
    var c=e.target.closest('.pcard'); if(c){ e.preventDefault(); open(c); }
  });
  m.addEventListener('click',function(e){
    if(e.target.closest('.pmodal__x')||e.target.classList.contains('pmodal__bd')) close();
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&m.classList.contains('show')) close(); });
})();
