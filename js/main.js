/* ==========================================================
   GHID website script
   Menu, language switch (EN/FR), flying doves, forms,
   gallery, counters and team social links.
   ========================================================== */
(function(){
  const root=document.documentElement;
  const nav=document.getElementById('nav'), menuBtn=document.getElementById('menu-btn');
  menuBtn.addEventListener('click',()=>{const o=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(o))});


  // team social links (edit js/team-links.js)
  const TEAM_LINKS=window.TEAM_LINKS||{};
  document.querySelectorAll('[data-member]').forEach(m=>{
    const links=TEAM_LINKS[m.dataset.member]||{}; const name=m.querySelector('h3').textContent.trim();
    m.querySelectorAll('.soc').forEach(a=>{
      const url=links[a.dataset.net];
      if(url){a.href=url;a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',a.title+' — '+name)}
      else{a.title=a.title+' — link to add'}
    });
  });


  // doves flying across the hero
  (function(){
    const box=document.getElementById('doves'); if(!box) return;
    const wing='M48 47 C43 32 45 16 56 3 C58 11 62 15 66 17 C66 9 70 3 77 1 C76 9 78 15 82 19 C84 11 89 7 96 7 C92 17 89 28 85 36 C83 40 81 42 78 44 Z';
    const body='M100 41 L107 43 L99 45.5 C97 50 91 54 83 57 C70 62 52 63 38 61 L22 66 L9 73 L14 62 L5 58 L20 55 C30 50 44 46 58 45 C66 44 74 42 80 38 C84 33 92 32 96 35 C98 37 99 39 100 41 Z';
    const leaf='<g fill="#34B45E"><ellipse cx="114" cy="38" rx="7.5" ry="3.2" transform="rotate(-35 114 38)"/><ellipse cx="116" cy="47" rx="7.5" ry="3.2" transform="rotate(25 116 47)"/><path d="M105 43.5 L121 43" stroke="#1E8A43" stroke-width="1.2"/></g>';
    const flock=[
      {y:'12%',w:120,o:1,dur:24,delay:-7,flap:1.0,sx:'62vw',leaf:true},
      {y:'20%',w:80,o:.95,dur:27,delay:-16,flap:.85,sx:'74vw'},
      {y:'7%',w:62,o:.9,dur:30,delay:-2,flap:.75,sx:'55vw'},
      {y:'27%',w:48,o:.8,dur:33,delay:-22,flap:.65,sx:'86vw'},
      {y:'4%',w:92,o:.92,dur:26,delay:-19,flap:.92,sx:'80vw'},
      {y:'34%',w:38,o:.7,dur:36,delay:-11,flap:.58,sx:'92vw'}
    ];
    box.innerHTML=flock.map(d=>`<div class="dove" style="--y:${d.y};--w:${d.w}px;--o:${d.o};--dur:${d.dur}s;--delay:${d.delay}s;--flap:${d.flap}s;--sx:${d.sx}"><div class="bob"><svg viewBox="0 -4 126 80"><path class="wing far" d="${wing}" transform="translate(-6 -3) scale(.9)"/><path d="${body}" fill="currentColor"/><circle cx="94.5" cy="38.5" r="1.7" fill="#0A4A22"/><path class="wing" d="${wing}" fill="currentColor"/>${d.leaf?leaf:''}</svg></div></div>`).join('');
  })();

  // language
  function setLang(l){
    root.setAttribute('data-lang',l);
    document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===l)));
    try{localStorage.setItem('ghid-lang',l)}catch(e){}
  }
  let saved='en'; try{saved=localStorage.getItem('ghid-lang')||'en'}catch(e){}
  setLang(saved);
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  const t=(en,fr)=>root.getAttribute('data-lang')==='fr'?fr:en;

  // forms (preview: not connected)
  document.querySelectorAll('.demo-form').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault(); const n=f.querySelector('.form-note');
    n.textContent=t('Thank you! This form is not yet connected to an inbox, so nothing was sent. Please reach us on WhatsApp: +243 995 781 106.','Merci ! Ce formulaire n\'est pas encore relié à une boîte de réception : rien n\'a été envoyé. Contactez-nous sur WhatsApp : +243 995 781 106.');
    n.hidden=false;
  }));

  // copy
  document.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
    const v=b.dataset.copy;
    const done=()=>{b.textContent=t('Copied','Copié');setTimeout(()=>b.textContent='Copy',1500)};
    try{navigator.clipboard.writeText(v).then(done,()=>{})}catch(e){}
  }));

  // gallery filter + lightbox
  const figs=[...document.querySelectorAll('#gallery figure')];
  document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    figs.forEach(f=>f.hidden=!(b.dataset.filter==='all'||f.dataset.cat===b.dataset.filter));
  }));
  const lb=document.getElementById('lightbox');
  if(lb){
  figs.forEach(f=>f.addEventListener('click',()=>{
    document.getElementById('lb-img').src=f.querySelector('img').src;
    const cap=f.querySelector('figcaption').querySelector(root.getAttribute('data-lang')==='fr'?'.fr':'.en');
    document.getElementById('lb-cap').textContent=cap?cap.textContent:'';
    lb.hidden=false; document.getElementById('lb-close').focus();
  }));
  const close=()=>lb.hidden=true;
  document.getElementById('lb-close').addEventListener('click',close);
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }

  // counters
  const nums=[...document.querySelectorAll('.hero-stats .num')];
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(en=>{
      if(!en.isIntersecting)return; io.unobserve(en.target);
      const el=en.target,end=+el.dataset.count,plus=el.querySelector('em')?'<em>+</em>':'';const t0=performance.now();
      (function step(n){const p=Math.min(1,(n-t0)/1200),v=Math.round(end*(1-Math.pow(1-p,3)));el.innerHTML=v.toLocaleString('en-US')+plus;if(p<1)requestAnimationFrame(step)})(t0);
    }),{threshold:.5});
    nums.forEach(n=>io.observe(n));
  }
})();
