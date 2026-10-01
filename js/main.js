/* ==========================================================
   GHID website script
   Menu, language switch (EN/FR), flying doves, forms,
   gallery, counters and team social links.
   ========================================================== */
(function(){
  const root=document.documentElement;
  const nav=document.getElementById('nav'), menuBtn=document.getElementById('menu-btn');
  menuBtn.addEventListener('click',()=>{const o=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(o))});

  // show the ☰ menu only when the links don't fit (French labels are longer)
  const header=document.querySelector('.site-header'), bar=header&&header.querySelector('.bar');
  function fitNav(){
    if(!bar) return;
    // 1) everything on one line  2) drop the long subtitle  3) switch to the ☰ menu
    const over=()=>bar.scrollWidth>bar.clientWidth+1;
    header.classList.remove('compact','no-sub');
    if(over()) header.classList.add('no-sub');
    if(over()) header.classList.add('compact');
    else{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}
  }
  addEventListener('resize',fitNav);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fitNav);


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
    document.querySelectorAll('option[data-fr]').forEach(o=>o.textContent=l==='fr'?o.dataset.fr:o.dataset.en);
    fitNav();
  }
  let saved='en'; try{saved=localStorage.getItem('ghid-lang')||'en'}catch(e){}
  setLang(saved);
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  const t=(en,fr)=>root.getAttribute('data-lang')==='fr'?fr:en;

  // forms: compose the message and open it in WhatsApp (email as a fallback)
  const WA='243995781106', MAIL='manararogerisrael@gmail.com';
  const lbl=el=>{const l=el.closest('label'); if(!l) return el.name||''; const s=l.querySelector(':scope > span'); const v=s&&(s.querySelector(root.getAttribute('data-lang')==='fr'?'.fr':'.en')||s); return (v?v.textContent:'').replace('*','').trim()};
  document.querySelectorAll('.send-form').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault();
    if(!f.checkValidity()){f.reportValidity();return}
    const fr=root.getAttribute('data-lang')==='fr';
    const lines=[fr?f.dataset.titleFr:f.dataset.titleEn,''];
    f.querySelectorAll('input,select,textarea').forEach(el=>{
      const v=el.tagName==='SELECT'?el.options[el.selectedIndex].textContent:el.value.trim();
      if(v) lines.push(lbl(el)+' : '+v);
    });
    const text=lines.join('\n');
    const mail=f.querySelector('[data-mail-link]');
    if(mail) mail.href='mailto:'+MAIL+'?subject='+encodeURIComponent(lines[0])+'&body='+encodeURIComponent(text);
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(text),'_blank','noopener');
    const n=f.querySelector('.form-note');
    if(n){n.textContent=t('Your message is ready in WhatsApp: just press send. If WhatsApp did not open, use the email link above.','Votre message est prêt dans WhatsApp : il suffit d’appuyer sur Envoyer. Si WhatsApp ne s’est pas ouvert, utilisez le lien e-mail ci-dessus.');n.hidden=false}
  }));
  // newsletter (footer): subscribe by email
  document.querySelectorAll('.demo-form').forEach(f=>f.addEventListener('submit',e=>{
    e.preventDefault(); const n=f.querySelector('.form-note'); const em=f.querySelector('input[type=email]');
    const sub=t('Newsletter subscription','Inscription à la newsletter');
    location.href='mailto:'+MAIL+'?subject='+encodeURIComponent(sub)+'&body='+encodeURIComponent(sub+' : '+(em?em.value:''));
    if(n){n.textContent=t('Thank you! Your email app opens so you can confirm your subscription.','Merci ! Votre messagerie s’ouvre pour confirmer votre inscription.');n.hidden=false}
  }));
  // buttons that open WhatsApp with a ready-made sentence
  document.querySelectorAll('[data-wa-text-en]').forEach(a=>a.addEventListener('click',()=>{
    a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(root.getAttribute('data-lang')==='fr'?a.dataset.waTextFr:a.dataset.waTextEn);
  }));
  // contact form: sent by the server to info@ghidcongo.org (see api/contact.js)
  const cf=document.getElementById('contact-form');
  if(cf) cf.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!cf.checkValidity()){cf.reportValidity();return}
    const btn=cf.querySelector('.btn-send'), note=cf.querySelector('.form-note');
    const data=Object.fromEntries(new FormData(cf)); data.lang=root.getAttribute('data-lang')||'en';
    data.topicLabel=cf.querySelector('#c-subject').selectedOptions[0].textContent;
    btn.disabled=true; note.hidden=true; note.className='form-note';
    try{
      const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(!r.ok) throw new Error(r.status);
      cf.reset(); note.classList.add('ok');
      note.textContent=t('Thank you! Your message has been sent. We usually reply within a few working days.','Merci ! Votre message a bien été envoyé. Nous répondons généralement sous quelques jours ouvrables.');
    }catch(err){
      note.classList.add('err');
      const body=encodeURIComponent(data.topicLabel+'\n\n'+data.message+'\n\n— '+data.name+' ('+data.email+')');
      note.innerHTML=t('Sorry, the message could not be sent right now. Please ','Désolé, le message n’a pas pu être envoyé pour le moment. Merci de ')+'<a href="mailto:info@ghidcongo.org?subject='+encodeURIComponent('[GHID] '+data.topicLabel)+'&body='+body+'">'+t('email us directly','nous écrire directement')+'</a>.';
    }
    note.hidden=false; btn.disabled=false;
  });

  // contact: choose the subject from the cards above the form, or from ?subject= in the link
  const subj=document.getElementById('c-subject');
  if(subj){
    document.querySelectorAll('[data-subject]').forEach(a=>a.addEventListener('click',()=>{subj.value=a.dataset.subject}));
    const alias={partnership:'funding',support:'funding',implementation:'funding',volunteer:'general',training:'general'};
    let q=new URLSearchParams(location.search).get('subject'); if(q){q=alias[q]||q; if(subj.querySelector('option[value="'+q+'"]')) subj.value=q}
  }
  document.querySelectorAll('[data-goto-subject]').forEach(a=>a.href='contact.html?subject='+a.dataset.gotoSubject+'#contact-form');

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

  // partner logos: endless scrolling strip, stops on hover or touch
  (function(){
    const m=document.getElementById('partners'); if(!m) return;
    const group=m.querySelector('.partners-group');
    const track=document.createElement('div'); track.className='partners-track';
    group.parentNode.insertBefore(track,group); track.appendChild(group);
    const base=[...group.children];
    function build(){
      // repeat the logos until one set is wider than the strip, then copy the set once more
      m.classList.add('ready');
      [...track.querySelectorAll('.partners-group[aria-hidden]')].forEach(g=>g.remove());
      [...group.children].slice(base.length).forEach(li=>li.remove());
      let guard=0;
      while(group.scrollWidth<m.clientWidth+40 && guard++<20) base.forEach(li=>{const c=li.cloneNode(true);c.setAttribute('aria-hidden','true');group.appendChild(c)});
      const copy=group.cloneNode(true); copy.setAttribute('aria-hidden','true'); track.appendChild(copy);
      m.style.setProperty('--dur',Math.max(18,group.scrollWidth/55)+'s');
    }
    build();
    let w=m.clientWidth; addEventListener('resize',()=>{if(Math.abs(m.clientWidth-w)>40){w=m.clientWidth;build()}});
    track.addEventListener('load',build,true); // logos change the width once they load
    // touch: tap the strip to stop it, tap again (or anywhere else) to start it
    m.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')m.classList.toggle('paused')});
    document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'&&!m.contains(e.target))m.classList.remove('paused')});
  })();

  // zoom on hover for every photo (not the logo, hero background, partner logos or the lightbox)
  document.querySelectorAll('main img').forEach(img=>{
    if(img.closest('.logo-badge,.partners-marquee,.lightbox,.zoom')||img.classList.contains('hero-bg')) return;
    const cs=getComputedStyle(img), z=document.createElement('span'); z.className='zoom';
    z.style.borderRadius=cs.borderRadius;
    if(img.parentNode.classList.contains('ph')) z.style.height='100%';
    img.parentNode.insertBefore(z,img); z.appendChild(img);
  });

  // programs page: highlight the tab of the program on screen + reading progress
  (function(){
    const tabs=[...document.querySelectorAll('.prog-tabs a')]; if(!tabs.length) return;
    const secs=tabs.map(a=>document.querySelector(a.getAttribute('href')));
    const bar=document.querySelector('.prog-tabs .bar-progress');
    function update(){
      const y=innerHeight*0.35; let cur=0;
      secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<y)cur=i});
      tabs.forEach((t,i)=>t.classList.toggle('active',i===cur));
      const a=secs[0].getBoundingClientRect().top+scrollY, z=secs[secs.length-1].getBoundingClientRect().bottom+scrollY-innerHeight;
      if(bar) bar.style.setProperty('--p',Math.min(1,Math.max(0,(scrollY-a+200)/(z-a+200))));
      const act=tabs[cur]; if(act&&act.parentNode.scrollWidth>act.parentNode.clientWidth){const p=act.parentNode;p.scrollLeft=act.offsetLeft-p.clientWidth/2+act.offsetWidth/2}
    }
    addEventListener('scroll',update,{passive:true}); addEventListener('resize',update); update();
  })();

  // reveal blocks as they scroll into view, and count up program results
  (function(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
    const els=document.querySelectorAll('.program-head,.program .block,.program .results,.program img,.value-card,.prog-card');
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach((el,i)=>{
      if(el.getBoundingClientRect().top<innerHeight) return; // already on screen: leave as is
      el.classList.add('reveal'); el.style.transitionDelay=(el.matches('.value-card,.prog-card')?(i%3)*90:0)+'ms'; io.observe(el);
    });
    const nums=[...document.querySelectorAll('.program .res b:not(.todo)')];
    const cio=new IntersectionObserver(es=>es.forEach(en=>{
      if(!en.isIntersecting) return; cio.unobserve(en.target);
      const el=en.target, txt=el.dataset.final||el.textContent, end=parseInt(txt.replace(/[^0-9]/g,''),10), plus=txt.trim().endsWith('+')?'+':'';
      el.dataset.final=txt; if(!end) return; const t0=performance.now();
      (function step(n){const p=Math.min(1,(n-t0)/1400),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-US')+(p===1?plus:'');if(p<1)requestAnimationFrame(step)})(t0);
    }),{threshold:.6});
    nums.forEach(n=>cio.observe(n));
  })();

  // count-up numbers on portfolio and other pages
  (function(){
    const els=[...document.querySelectorAll('main [data-count]:not(.num)')];
    if(!els.length||matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)) return;
    const io=new IntersectionObserver(es=>es.forEach(en=>{
      if(!en.isIntersecting) return; io.unobserve(en.target);
      const el=en.target,end=+el.dataset.count,plus=('plus' in el.dataset)||el.textContent.trim().endsWith('+')?'+':'',t0=performance.now();
      (function step(n){const p=Math.min(1,(n-t0)/1400),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-US')+(p===1?plus:'');if(p<1)requestAnimationFrame(step)})(t0);
    }),{threshold:.6});
    els.forEach(e=>io.observe(e));
  })();

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
