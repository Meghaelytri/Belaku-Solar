
(function(){'use strict';
  var WA='917204406006';
  function rupee(n){return '\u20B9'+n.toLocaleString('en-IN');}
  function nearest(n,list){for(var i=0;i<list.length;i++){if(list[i]>=n)return list[i];}return list[list.length-1];}

  var COMPUTE={

  /* Solar water heater — 25 litres per person per day is the standard bathing
     allowance; evening use on top of morning adds roughly half again. */
  swh:function(s){
    var l=s.people*25; if(s.use==='both') l=Math.round(l*1.5);
    var lpd=nearest(l,[100,150,200,250,300,500]);
    return {v:lpd,unit:'litre system',
      why:'That is enough hot water for '+s.people+' '+(s.people===1?'person':'people')+
          (s.use==='both'?' bathing morning and evening.':' bathing in the morning.')+
          ' If you also want hot water on cloudy mornings, ask us about the hybrid model \u2014 it heats electrically only when the sun has not been enough.',
      rows:[['Enough for',s.people+(s.people===1?' person':' people')],
            ['Roof space needed','about '+(1.5+Math.floor((lpd-100)/100)*0.5).toFixed(1)+' \u00D7 2 metres']],
      msg:'Hi Belaku Solar, I need a '+lpd+' LPD solar water heater for '+s.people+' people. What would it cost?'};
  },

  /* Water purifier — source decides the stages, household size the storage. */
  wp:function(s){
    var stages,pre,why;
    if(s.src==='borewell'){stages='RO + UV';pre='Yes, sediment pre-filter';
      why='Borewell water here is salty, so you need an RO purifier \u2014 a UV-only one will not remove the salt. If your water also runs sandy, we fit a pre-filter so the RO part lasts much longer.';}
    else if(s.src==='tanker'){stages='RO + UV + Alkaline';pre='Yes, sediment pre-filter';
      why='Tanker water changes with every load, so we treat it as the hardest case. RO removes the salt, UV kills germs, and the alkaline stage brings the taste back.';}
    else{stages='RO + UV';pre='Not usually needed';
      why='Piped water is treated before it reaches you, but the salt level still changes area to area. RO plus UV is the safe choice \u2014 we confirm with a free water test at your house.';}
    return {v:stages,isText:true,why:why,
      rows:[['Pre-filter needed',pre],['Water test','Free, at your home']],
      msg:'Hi Belaku Solar, I need a '+stages+' purifier for '+s.src+' water. What would it cost?'};
  },

  /* Geyser — location decides instant vs storage; people and bath type decide litres. */
  geyser:function(s){
    if(s.where==='kitchen'){
      var lit=s.people<=2?3:5;
      return {v:lit,unit:'L instant',
        why:'A kitchen tap needs hot water immediately and only a little at a time. An instant geyser heats as it flows so it never runs out, but the stream is thin, which is why it does not suit a bathroom.',
        rows:[['Type','Instant'],['Fits','Under the sink or above the tap'],['Hard water','Descale once a year']],
        msg:'Hi Belaku Solar, I need a '+lit+' L instant geyser for my kitchen. What would it cost?'};
    }
    var base=s.people<=2?10:(s.people<=4?15:25);
    if(s.bath==='shower') base=base===10?15:25;
    return {v:base,unit:'L storage',
      why:(s.bath==='shower'
        ? 'A shower uses considerably more water than a bucket, so this is sized up a step to avoid running cold halfway through.'
        : 'Sized for '+s.people+' '+(s.people===1?'person':'people')+' bathing one after another without waiting for a reheat.')+
        ' In hard water choose a glass-lined tank \u2014 the lining decides how long a geyser lasts far more than the wattage does.',
      rows:[['Type','Storage'],['Suits',s.people+(s.people===1?' person':' people')+', '+(s.bath==='shower'?'shower':'bucket bath')],
            ['Hard water','Glass-lined tank advised']],
      msg:'Hi Belaku Solar, I need a '+base+' L storage geyser for my bathroom, '+s.people+
          ' people, '+(s.bath==='shower'?'shower':'bucket bath')+'. What would it cost?'};
  },

  /* Rooftop solar — about 120 units per kW per month here, and roughly
     100 sq ft of unshaded roof per kW. */
  solar:function(s){
    var units=Math.round(s.bill/8);
    var kw=nearest(Math.max(1,Math.ceil(units/120)),[1,2,3,5,8,10]);
    return {v:kw,unit:'kW system',
      why:'A '+kw+' kW system covers roughly the '+units+' units a month you are using now. '+
          'It needs about '+(kw*100)+' square feet of roof with no shade. We survey the roof free before quoting.',
      rows:[['Your usage','about '+units+' units a month'],
            ['Roof needed','about '+(kw*100)+' sq ft, no shade']],
      msg:'Hi Belaku Solar, my monthly bill is about '+rupee(s.bill)+'. I am looking at roughly a '+kw+
          ' kW rooftop system. What would it cost?'};
  },

  /* UPS — VA = watts / 0.8 power factor; battery Ah = (W x hours) / (12 V x 0.8). */
  ups:function(s){
    var L={fans:300,lights:80,tv:120,fridge:200,pump:750},w=0,names=[];
    var labels={fans:'fans',lights:'lights',tv:'TV',fridge:'fridge',pump:'water pump'};
    for(var k in L){ if(s.load[k]){ w+=L[k]; names.push(labels[k]); } }
    if(!w) return {v:'Pick at least one',isText:true,
      why:'Choose everything that has to keep running during a power cut, and the sizing appears here.',
      rows:[['Connected load','0 W'],['Battery','\u2014'],['Backup','\u2014']],
      msg:'Hi Belaku Solar, I need help sizing a home UPS.'};
    var va=nearest(Math.round(w/0.8),[600,800,1100,1500,2500,3500]);
    var ah=nearest(Math.round((w*s.hours)/(12*0.8)),[100,150,200,300]);
    return {v:va,unit:'VA',
      why: w>=750
        ? 'A fridge or a pump pulls a big surge when it starts, so this needs a sine-wave inverter. Ask us about lithium \u2014 it costs more but handles this much better.'
        : 'Fans, lights and a TV are a light load. A normal tubular battery is the cheaper choice here; lithium costs more but never needs water topped up.',
      rows:[['Running',names.join(', ')+' ('+w+' watts)'],
            ['Battery','about '+ah+' Ah'],
            ['Backup',s.hours+(s.hours===1?' hour':' hours')]],
      msg:'Hi Belaku Solar, I need about a '+va+' VA UPS with a '+ah+' Ah battery for '+w+' W ('+
          names.join(', ')+') over '+s.hours+' hours. What would it cost?'};
  }};

  /* generic wiring — each pane declares its fields in the markup */
  document.querySelectorAll('[data-calc]').forEach(function(pane){
    var key=pane.dataset.calc, state={load:{}};

    pane.querySelectorAll('.step').forEach(function(st){ state[st.dataset.field]=+st.dataset.value; });
    pane.querySelectorAll('[data-field][data-single]').forEach(function(g){
      var on=g.querySelector('[aria-pressed=true]'); state[g.dataset.field]=on?on.dataset.v:null;
    });
    pane.querySelectorAll('[data-field][data-multi] button').forEach(function(b){
      state.load[b.dataset.v]=b.getAttribute('aria-pressed')==='true';
    });

    function render(){
      var r=COMPUTE[key](state);
      var v=pane.querySelector('[data-out=v]');
      v.innerHTML=r.isText?r.v:(r.v+(r.unit?'<span>'+r.unit+'</span>':''));
      v.classList.toggle('is-text',!!r.isText);
      pane.querySelector('[data-out=why]').textContent=r.why;
      pane.querySelector('[data-out=rows]').innerHTML=
        r.rows.map(function(x){return '<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>';}).join('');
      pane.querySelector('[data-out=wa]').href='https://wa.me/'+WA+'?text='+encodeURIComponent(r.msg);
    }

    pane.querySelectorAll('.step').forEach(function(st){
      var f=st.dataset.field, min=+st.dataset.min, max=+st.dataset.max, stp=+st.dataset.step||1;
      var pre=st.dataset.prefix||'', suf=st.dataset.suffix||'';
      var out=st.querySelector('b'), minus=st.querySelector('[data-d="-1"]'), plus=st.querySelector('[data-d="1"]');
      var label=(suf||f).trim();
      minus.setAttribute('aria-label','Decrease '+label);
      plus.setAttribute('aria-label','Increase '+label);
      out.setAttribute('role','spinbutton');
      out.setAttribute('aria-label',label);
      out.setAttribute('aria-valuemin',min);
      out.setAttribute('aria-valuemax',max);
      function paint(){
        var n=state[f];
        out.innerHTML=pre+n.toLocaleString('en-IN')+(suf?'<small>'+suf+'</small>':'');
        out.setAttribute('aria-valuenow',n);
        out.setAttribute('aria-valuetext',pre+n.toLocaleString('en-IN')+suf);
        minus.disabled=n<=min; plus.disabled=n>=max;
      }
      st.addEventListener('click',function(ev){
        var b=ev.target.closest('button'); if(!b||b.disabled) return;
        state[f]=Math.min(max,Math.max(min,state[f]+(+b.dataset.d)*stp));
        paint(); render();
      });
      paint();
    });

    pane.querySelectorAll('[data-field][data-single]').forEach(function(g){
      g.addEventListener('click',function(ev){
        var b=ev.target.closest('button'); if(!b) return;
        g.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed','false')});
        b.setAttribute('aria-pressed','true'); state[g.dataset.field]=b.dataset.v; render();
      });
    });

    pane.querySelectorAll('[data-field][data-multi]').forEach(function(g){
      g.addEventListener('click',function(ev){
        var b=ev.target.closest('button'); if(!b) return;
        var on=b.getAttribute('aria-pressed')!=='true';
        b.setAttribute('aria-pressed',on?'true':'false'); state.load[b.dataset.v]=on; render();
      });
    });

    render();
  });

  document.querySelectorAll('[data-tabs]').forEach(function(box){
    var tabs=box.querySelectorAll('.calc__tabs button');
    function select(t){
      tabs.forEach(function(x){x.setAttribute('aria-selected','false');x.tabIndex=-1});
      t.setAttribute('aria-selected','true');t.tabIndex=0;t.focus();
      box.querySelectorAll('[data-calc]').forEach(function(p){p.hidden=p.dataset.calc!==t.dataset.tab});
    }
    tabs.forEach(function(t,i){
      t.tabIndex = t.getAttribute('aria-selected')==='true' ? 0 : -1;
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
    tabs.forEach(function(t){
      t.addEventListener('click',function(){ select(t); });
    });
  });
})();
