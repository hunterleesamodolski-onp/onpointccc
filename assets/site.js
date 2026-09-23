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

// forms: success redirect + ?role= preselect
const nextUrl=document.getElementById('nextUrl');
if(nextUrl){
  nextUrl.value=location.origin+location.pathname.replace(/[^/]*$/,'')+'thanks.html';
  const role=new URLSearchParams(location.search).get('role'),sel=document.getElementById('role');
  if(role&&sel)sel.value=role;
}

// US map — where we've worked (short labels; the record cards carry the detail)
const OPS={
  fl:{n:'Florida',d:'Where it started — first campaign, 2015. Home base today. Nonprofit work incl. The Nature Conservancy.',c:'#14B8A6',h:'#5EEAD4'},
  ca:{n:'California',d:'20+ campaigns over a decade — and where On Point opened its doors as a business.'},
  az:{n:'Arizona',d:'2024 presidential doors — 10,000+ a week.'},
  wi:{n:'Wisconsin',d:'2024 presidential doors — 10,000+ a week.'},
  co:{n:'Colorado',d:'18+ petitions across four cycles.'},
  ar:{n:'Arkansas',d:'Issue 2, 2024 — cleared 90% of counties. Passed.'},
  mi:{n:'Michigan',d:'Six statewide campaigns, 2015–2020.'},
  oh:{n:'Ohio',d:'First management post.'},
  va:{n:'Virginia',d:'Candidate project, 2025 — done in two weeks.'},
  wv:{n:'West Virginia',d:'U.S. Senate ballot-access drive, 2018.'},
  ny:{n:'New York',d:'Statewide field operations.'},
  nh:{n:'New Hampshire',d:'Candidate work, 2022.'},
  ky:{n:'Kentucky',d:'RFK Jr. ballot access, 2024.'},
  mt:{n:'Montana',d:'Candidate petition program, 2026.'},
  me:{n:'Maine',d:'76,000 doors in nine weeks — double the contract, 2026.'},
  nc:{n:'North Carolina',d:'First media campaign — $168K generated for a client in two months.'}
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
    const o=OPS[s],base=o.c||'#17324F',hot=o.h||'#38BDF8',paths=svg.querySelectorAll('.'+s);
    paths.forEach(p=>{
      p.style.fill=base;p.style.cursor='pointer';p.style.stroke='#fff';p.style.strokeWidth='1.5';p.style.filter=lift;
      p.addEventListener('mouseenter',e=>{paths.forEach(q=>{q.style.fill=hot;q.style.filter=liftHot});tip.innerHTML='<b>'+o.n+'</b>'+o.d;tip.style.opacity=1;move(e)});
      p.addEventListener('mousemove',move);
      p.addEventListener('mouseleave',()=>{paths.forEach(q=>{q.style.fill=base;q.style.filter=lift});tip.style.opacity=0});
    });
    // label only the states with room for it — keeps the East Coast clean
    try{const bb=paths[0].getBBox();if(['ca','mt','az','co','ar','wi','mi','ny','fl','me','nc'].includes(s)){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',bb.x+bb.width/2);t.setAttribute('y',bb.y+bb.height/2+4);t.setAttribute('text-anchor','middle');t.setAttribute('style','fill:#fff;font-family:Montserrat,sans-serif;font-weight:800;font-size:14px;letter-spacing:1px;pointer-events:none;paint-order:stroke;stroke:rgba(15,36,56,.55);stroke-width:2.5px');t.textContent=s.toUpperCase();svg.appendChild(t)}}catch(err){}
  });
}).catch(()=>{});
