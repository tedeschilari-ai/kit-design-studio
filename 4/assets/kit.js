
document.documentElement.classList.add('js');

/* rolagem suave */
try{ if(window.Lenis && !matchMedia('(prefers-reduced-motion:reduce)').matches){
  var lenis=new Lenis({lerp:.1});document.documentElement.classList.add('lenis');
  (function raf(t){lenis.raf(t);requestAnimationFrame(raf)})(0);
  document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();lenis.scrollTo(el,{offset:-70})}})});
}}catch(e){}

/* nav fica sólida ao rolar */
(function(){var n=document.getElementById('nav');function f(){n.classList.toggle('solid',scrollY>40)}addEventListener('scroll',f,{passive:true});f()})();

/* título do hero: palavra por palavra */
(function(){
  var h=document.getElementById('h1'),k=0;
  [].slice.call(h.childNodes).forEach(function(node){
    var wrapIn=node.nodeType===1?node:null;
    if(wrapIn&&wrapIn.classList.contains('grad')){wrapIn.classList.add('gfade');k+=wrapIn.textContent.split(/\s+/).length;return}
    var text=node.textContent;var frag=document.createDocumentFragment();
    text.split(/(\s+)/).forEach(function(part){
      if(!part)return;
      if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return}
      var s=document.createElement('span');s.className='w';s.textContent=part;s.style.transitionDelay=(k++*55)+'ms';frag.appendChild(s);
    });
    if(wrapIn){wrapIn.textContent='';wrapIn.appendChild(frag)}else{h.replaceChild(frag,node)}
  });
  requestAnimationFrame(function(){setTimeout(function(){h.classList.add('go')},120)});
})();






/* carrosséis (módulos, IA × método): duplica os cards e anda via scroll (mais leve no iPhone) */
(function(){
  document.querySelectorAll('.car .ct').forEach(function(t){
    [].slice.call(t.children).forEach(function(f){var c=f.cloneNode(true);c.setAttribute('aria-hidden','true');t.appendChild(c)});
  });
  var items=[];
  function add(box,track,dur){
    var it={box:box,track:track,dur:dur,rev:box.classList.contains('rev'),pos:0,vis:true};items.push(it);
    if('IntersectionObserver' in window){new IntersectionObserver(function(e){it.vis=e[0].isIntersecting},{rootMargin:'300px 0px'}).observe(box)}
  }
  document.querySelectorAll('.crow').forEach(function(b){add(b,b.querySelector('.ctrack'),70)});
  document.querySelectorAll('.car').forEach(function(b){add(b,b.querySelector('.ct'),50)});
  var last=performance.now();
  function tick(now){
    var dt=Math.min(now-last,100)/1000;last=now;
    for(var k=0;k<items.length;k++){var it=items[k];if(!it.vis)continue;
      var half=it.track.scrollWidth/2;if(!half)continue;
      it.pos=(it.pos+half/it.dur*dt)%half;
      it.box.scrollLeft=it.rev?half-it.pos:it.pos;}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


/* entrada dos blocos */
(function(){
  var els=document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
  var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){
    var sib=[].slice.call(e.target.parentElement.children).filter(function(x){return x.classList.contains('rv')});
    e.target.style.transitionDelay=Math.min(sib.indexOf(e.target),6)*70+'ms';
    e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
  els.forEach(function(e){io.observe(e)});
})();

/* área de membros: começa inclinada e endireita ao rolar */
(function(){
  var f=document.querySelector('.tiltp');if(!f||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  function u(){var r=f.getBoundingClientRect(),p=Math.min(Math.max((innerHeight-r.top)/(innerHeight*.85),0),1);f.style.transform='perspective(1600px) rotateX('+(22*(1-p)).toFixed(2)+'deg) scale('+(.9+.1*p).toFixed(3)+')'}
  addEventListener('scroll',u,{passive:true});u();
})();

/* abertura: o Kit "se levanta" conforme a rolagem */
(function(){
  var st=document.querySelector('.stage-hero'),m=document.querySelector('.kitstage .mock');if(!m)return;
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  var cur=38,target=38;
  function calc(){var r=st.getBoundingClientRect(),p=(innerHeight*.98-r.top)/(innerHeight*.6);p=Math.min(Math.max(p,0),1);target=38*(1-p)}
  function loop(){cur+=(target-cur)*.1;m.style.transform='rotateX('+cur.toFixed(2)+'deg) scale('+(1-cur/38*.12).toFixed(3)+')';requestAnimationFrame(loop)}
  addEventListener('scroll',calc,{passive:true});addEventListener('resize',calc);calc();loop();
})();

/* números contando quando aparecem */
(function(){var els=document.querySelectorAll('[data-count]');if(!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);var el=e.target,to=+el.dataset.count,fr=+(el.dataset.from||0),t0=null,d=1500;
  function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/d),k=1-Math.pow(1-p,3);el.textContent=Math.round(fr+(to-fr)*k);if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)})},{threshold:.6});
  els.forEach(function(el){io.observe(el)});})();

/* checkout: leva as UTMs da página para a Kiwify e avisa o pixel */
(function(){
  var params=new URLSearchParams(location.search);
  document.querySelectorAll('a[href*="pay.kiwify.com.br"]').forEach(function(a){
    try{var url=new URL(a.href);params.forEach(function(v,key){if(/^(utm_|src|sck|fbclid)/.test(key)&&!url.searchParams.has(key))url.searchParams.set(key,v)});a.href=url.toString()}catch(e){}
    a.addEventListener('click',function(){try{if(window.fbq)fbq('track','InitiateCheckout',{content_name:'Kit Design Studio'})}catch(e){}});
  });
})();
