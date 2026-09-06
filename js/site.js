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
})();
