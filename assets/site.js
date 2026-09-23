// On Point Consulting — shared site behavior (all pages)

// mobile nav
const burger=document.getElementById('burger'),links=document.getElementById('navLinks');
if(burger&&links){
  burger.addEventListener('click',()=>links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
}

// reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// animated counters
const fmt=n=>n>=1000?n.toLocaleString('en-US'):String(n);
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,target=+el.dataset.count,suf=el.dataset.suffix||'',t0=performance.now(),dur=1400;
  const tick=t=>{const p=Math.min((t-t0)/dur,1),v=Math.round(target*(1-Math.pow(1-p,3)));el.textContent=fmt(v)+suf;if(p<1)requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
}),{threshold:.5});
document.querySelectorAll('.num[data-count]').forEach(el=>cio.observe(el));

// contact form: success redirect + ?role= preselect
const nextUrl=document.getElementById('nextUrl');
if(nextUrl){
  nextUrl.value=location.origin+location.pathname.replace(/[^/]*$/,'')+'thanks.html';
  const role=new URLSearchParams(location.search).get('role'),sel=document.getElementById('role');
  if(role&&sel)sel.value=role;
}

// US map — interactive states (track record page)
const OPS={
  fl:{n:'Florida — Est. 2015',d:'First clipboard: the Amendment 4 voting-rights-restoration petition (passed 2018) and the greyhound-racing ban. Amendment 2 medical marijuana (2016) — first coordination role, running teams. Seminole gaming-compact defense (2021–22). Smart & Safe marijuana campaigns (2024–26). HQ: Fort Lauderdale.',c:'#C8102E',h:'#E01A37'},
  ca:{n:'California',d:'San Diego short-term-rental referendum — 62K signatures in 30 days. 2020: crew lead on the statewide flavored-tobacco referendum (became Prop 31). 2022: 6–8 statewide petitions. 2024: coordinated crews & office — seven statewides plus San Francisco, Alameda County & Vallejo petitions, all qualified. 2026: 16 statewides and four San Francisco citywides — multiple crews, multiple locations — the campaign On Point opened its doors on. 10–20K signatures/week, two cycles running.'},
  az:{n:'Arizona',d:'2024 presidential — coordinated swing-state door programs at 10,000+ per week. Owned the rural turf, staffed it with local hires.'},
  wi:{n:'Wisconsin',d:'2024 presidential — coordinated 10,000+ doors/week with a crew of 10–20. Conquered the rural areas others wouldn\'t touch.'},
  co:{n:'Colorado',d:'Four cycles, 18+ statewide petitions. Ran crews since 2024 — seven concurrent measures in the 2026 cycle with 40+ state-certified circulators. Completed: turn-ins in, most expected to make the ballot.'},
  ar:{n:'Arkansas',d:'2024 field coordinator — Issue 2, the countywide casino-approval amendment: tactically cleared 90% of counties on a 50-county distribution requirement before deadline. Passed 55.8%. Also delivered RFK Jr. ballot access — 13K signatures on a 5K requirement.'},
  mi:{n:'Michigan',d:'2015–2020: six statewide petition drives — One Fair Wage minimum-wage increase, earned paid sick time (MI Time to Care), clean-water protections, and Proposal 1 marijuana legalization (2018) — plus multiple candidate campaigns.'},
  oh:{n:'Ohio',d:'First management post — a van and a crew of 4–6. The kidney-dialysis pricing amendment, the Drug Price Relief Act (Issue 2, 2017), and the Stop Puppy Mills campaign.'},
  va:{n:'Virginia',d:'2025 — candidate ballot-access project: finished in under two weeks with a six-person crew.'},
  wv:{n:'West Virginia',d:'2018 — statewide ballot-access petition, U.S. Senate campaign.'},
  ny:{n:'New York',d:'Statewide petition & field operations.'},
  nh:{n:'New Hampshire',d:'2022 — candidate ballot-access work.'},
  ky:{n:'Kentucky',d:'2024 — RFK Jr. independent presidential ballot access.'},
  mt:{n:'Montana',d:'2026 — statewide candidate petition program.'},
  me:{n:'Maine',d:'2026 — statewide rural door program: 51,593 doors in nine weeks with a nine-person crew — double the contracted target. Completed.'}
};
const mapBox=document.getElementById('usmap');
if(mapBox)fetch('assets/us-map.svg').then(r=>r.text()).then(txt=>{
  mapBox.innerHTML=txt;
  const svg=mapBox.querySelector('svg');
  if(!svg.getAttribute('viewBox'))svg.setAttribute('viewBox','0 0 '+svg.getAttribute('width')+' '+svg.getAttribute('height'));
  svg.removeAttribute('width');svg.removeAttribute('height');
  svg.querySelectorAll('path').forEach(p=>{p.style.fill='#EBEFF4';p.style.stroke='#fff';p.style.strokeWidth='1.2';p.style.transition='fill .18s,filter .18s'});
  const tip=document.createElement('div');tip.className='map-tip';mapBox.appendChild(tip);
  const move=e=>{const r=mapBox.getBoundingClientRect();let x=e.clientX-r.left+16,y=e.clientY-r.top-14;if(x>r.width-330)x-=350;tip.style.left=x+'px';tip.style.top=y+'px'};
  const lift='drop-shadow(0 3px 4px rgba(15,36,56,.38))',liftHot='drop-shadow(0 7px 11px rgba(15,36,56,.5))';
  Object.keys(OPS).forEach(s=>{
    const o=OPS[s],base=o.c||'#17324F',hot=o.h||'#C8102E',paths=svg.querySelectorAll('.'+s);
    paths.forEach(p=>{
      p.style.fill=base;p.style.cursor='pointer';p.style.stroke='#fff';p.style.strokeWidth='1.5';p.style.filter=lift;
      p.addEventListener('mouseenter',e=>{paths.forEach(q=>{q.style.fill=hot;q.style.filter=liftHot});tip.innerHTML='<b>'+o.n+'</b>'+o.d;tip.style.opacity=1;move(e)});
      p.addEventListener('mousemove',move);
      p.addEventListener('mouseleave',()=>{paths.forEach(q=>{q.style.fill=base;q.style.filter=lift});tip.style.opacity=0});
    });
    // label only the states with room for it — keeps the East Coast clean
    try{const bb=paths[0].getBBox();if(['ca','mt','az','co','ar','wi','mi','ny','fl','me'].includes(s)){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',bb.x+bb.width/2);t.setAttribute('y',bb.y+bb.height/2+4);t.setAttribute('text-anchor','middle');t.setAttribute('style','fill:#fff;font-family:Montserrat,sans-serif;font-weight:800;font-size:14px;letter-spacing:1px;pointer-events:none;paint-order:stroke;stroke:rgba(15,36,56,.55);stroke-width:2.5px');t.textContent=s.toUpperCase();svg.appendChild(t)}}catch(err){}
  });
}).catch(()=>{});
