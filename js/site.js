(function(){
  var open=document.querySelector('[data-mm-open]');
  var closers=document.querySelectorAll('[data-mm-close]');
  function set(on){document.body.classList.toggle('mm-on',on);}
  if(open)open.addEventListener('click',function(){set(true);});
  closers.forEach(function(c){c.addEventListener('click',function(){set(false);});});
  document.querySelectorAll('.mobile-menu a').forEach(function(a){a.addEventListener('click',function(){set(false);});});

  var hd=document.querySelector('header.site');
  function onScroll(){ if(hd) hd.classList.toggle('scrolled', window.scrollY>10); }
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});

  var els=[].slice.call(document.querySelectorAll('[data-reveal]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e);});
  } else { els.forEach(function(e){e.classList.add('in');}); }

  var vid=document.querySelector('.hero-vid');
  if(vid){
    vid.addEventListener('error',function(){vid.style.display='none';});
    var tryPlay=function(){var p=vid.play&&vid.play(); if(p&&p.catch)p.catch(function(){});};
    tryPlay();
    document.addEventListener('visibilitychange',function(){if(!document.hidden)tryPlay();});
    window.addEventListener('pageshow',tryPlay);
    if('IntersectionObserver' in window){
      var vio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tryPlay();}else{try{vid.pause();}catch(_){}}});},{threshold:0.05});
      vio.observe(vid);
    }
  }

  /* animated thermostat dial (home hero) */
  var stage=document.querySelector('.thermo-stage');
  if(stage){
    var NS='http://www.w3.org/2000/svg';
    var svg=stage.querySelector('.dial-svg'),
        ticksG=stage.querySelector('.ticks'),
        arcFill=stage.querySelector('.arc-fill'),
        knob=stage.querySelector('.knob'),
        tval=stage.querySelector('.tval'),
        tstate=stage.querySelector('.tstate'),
        glow=stage.querySelector('.glow');
    var cx=120,cy=120,r=92,start=135,sweep=270;
    var toXY=function(ang,rad){var a=ang*Math.PI/180;return [cx+rad*Math.cos(a),cy+rad*Math.sin(a)];};
    var i,N=28;
    for(i=0;i<N;i++){var ang=start+(i/(N-1))*sweep,p1=toXY(ang,66),p2=toXY(ang,75),ln=document.createElementNS(NS,'line');
      ln.setAttribute('x1',p1[0].toFixed(1));ln.setAttribute('y1',p1[1].toFixed(1));ln.setAttribute('x2',p2[0].toFixed(1));ln.setAttribute('y2',p2[1].toFixed(1));ticksG.appendChild(ln);}
    var len=433.5; try{len=arcFill.getTotalLength();}catch(e){}
    arcFill.style.strokeDasharray=len;
    var lerp=function(a,b,t){return a+(b-a)*t;};
    function setF(f){
      arcFill.style.strokeDashoffset=(len*(1-f)).toFixed(1);
      var ang=start+f*sweep,k=toXY(ang,r);
      knob.setAttribute('cx',k[0].toFixed(1));knob.setAttribute('cy',k[1].toFixed(1));
      if(tval)tval.textContent=Math.round(lerp(16,24,f));
      if(tstate)tstate.textContent=f<0.42?'COOLING':(f>0.6?'HEATING':'COMFORT');
      if(glow){var cr=Math.round(lerp(47,216,f)),cg=Math.round(lerp(189,35,f)),cb=Math.round(lerp(246,42,f));
        glow.style.background='radial-gradient(closest-side,rgba('+cr+','+cg+','+cb+',.5),transparent 70%)';}
    }
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(reduce){setF(0.55);}
    else{
      var t0=null,dur=7200;
      (function loop(ts){if(!t0)t0=ts;var p=((ts-t0)%dur)/dur;var e=0.5-0.5*Math.cos(p*2*Math.PI);setF(0.16+e*0.76);requestAnimationFrame(loop);})(performance.now());
    }
  }

  /* service dock magnification (macOS-style) */
  var dock=document.querySelector('.dock');
  if(dock && window.matchMedia && window.matchMedia('(hover:hover)').matches){
    var ditems=[].slice.call(dock.querySelectorAll('.dock-item'));
    var dcap=document.querySelector('.dock-cap');
    var MX=1.75,RG=130,LFT=20;
    dock.addEventListener('mousemove',function(e){
      ditems.forEach(function(el){
        var r=el.getBoundingClientRect(),c=r.left+r.width/2,d=Math.abs(e.clientX-c);
        var f=Math.exp(-(d*d)/(2*(RG/2)*(RG/2))),s=1+(MX-1)*f;
        el.style.transform='translateY(-'+(LFT*(s-1)).toFixed(1)+'px) scale('+s.toFixed(3)+')';
        el.classList.toggle('on',f>0.6);
        if(f>0.6&&dcap){dcap.innerHTML=el.getAttribute('data-name')+' &nbsp;<span>'+el.getAttribute('data-desc')+'</span>';}
      });
    });
    dock.addEventListener('mouseleave',function(){
      ditems.forEach(function(el){el.style.transform='';el.classList.remove('on');});
      if(dcap)dcap.textContent='Hover a service to explore';
    });
  }
})();
