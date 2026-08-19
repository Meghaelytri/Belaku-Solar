
(function(){'use strict';
  var y=document.querySelector('.yr'); if(y) y.textContent=new Date().getFullYear();

  /* shrink the sticky header and logo once the page has scrolled a little */
  var hdr=document.querySelector('.hdr');
  if(hdr){
    var ticking=false;
    function syncCompact(){
      hdr.classList.toggle('is-compact', window.scrollY>40);
      ticking=false;
    }
    syncCompact();
    window.addEventListener('scroll',function(){
      if(!ticking){ requestAnimationFrame(syncCompact); ticking=true; }
    },{passive:true});
  }
  var burger=document.querySelector('.burger'), mnav=document.querySelector('.mnav');
  if(burger && mnav){
    function focusables(){
      return [].slice.call(mnav.querySelectorAll('a,button')).filter(function(el){
        return el.offsetParent!==null;
      });
    }
    function setOpen(open){
      mnav.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',open?'true':'false');
      document.body.classList.toggle('menu-open',open);
      if(open){
        var f=focusables(); if(f.length) f[0].focus();
        document.addEventListener('keydown',onKeydown);
        document.addEventListener('click',onClickOutside,true);
      } else {
        document.removeEventListener('keydown',onKeydown);
        document.removeEventListener('click',onClickOutside,true);
      }
    }
    function onKeydown(e){
      if(e.key==='Escape'){ setOpen(false); burger.focus(); return; }
      if(e.key!=='Tab') return;
      var f=focusables(); if(!f.length) return;
      var first=f[0], last=f[f.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
    function onClickOutside(e){
      if(!mnav.contains(e.target) && e.target!==burger && !burger.contains(e.target)) setOpen(false);
    }
    burger.addEventListener('click',function(){ setOpen(!mnav.classList.contains('open')); });
  }

  /* Contact form has no backend — build a pre-filled WhatsApp message from
     the fields instead, same pattern as the sizing calculators. */
  var cform=document.querySelector('#cform');
  if(cform){
    cform.addEventListener('submit',function(e){
      e.preventDefault();
      var name=cform.querySelector('#cf-name').value.trim();
      var phone=cform.querySelector('#cf-phone').value.trim();
      var msg=cform.querySelector('#cf-msg').value.trim();
      var text='Hi Belaku Solar, my name is '+name+' ('+phone+'). '+msg;
      window.open('https://wa.me/917204406006?text='+encodeURIComponent(text),'_blank','noopener');
    });
  }

  /* Language toggle — no Kannada site exists yet, so this only swaps which
     option looks active. Kept on href="#" until the Kannada pages ship. */
  document.querySelectorAll('.lang').forEach(function(group){
    group.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(e){
        e.preventDefault();
        group.querySelectorAll('a').forEach(function(x){x.removeAttribute('aria-current');});
        a.setAttribute('aria-current','true');
      });
    });
  });

  var hb=document.querySelector('.hb');
  if(hb && 'IntersectionObserver' in window){
    new IntersectionObserver(function(es,o){
      es.forEach(function(e){ if(e.isIntersecting){ hb.classList.add('drawn'); o.disconnect(); } });
    },{threshold:.25}).observe(hb);
  } else if(hb){ hb.classList.add('drawn'); }

  /* Contact-click tracking. No GA4 property is wired up yet — this only needs the
     gtag.js snippet with a Measurement ID added to <head> once one exists, and
     these events start flowing to GA4 with no further code changes. */
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="tel:"],a[href^="https://wa.me/"]'); if(!a) return;
    window.dataLayer.push({
      event:'contact_click',
      method: a.href.indexOf('tel:')===0 ? 'call' : 'whatsapp',
      link_text: a.textContent.trim(),
      page_path: location.pathname
    });
  });
})();
