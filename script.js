/* =====================================================================
   PERSONALISE HERE
   Or add to the link:  ?name=Priya&from=Arjun
   ===================================================================== */
const CONFIG = {
  name: "My Love",          // her name
  from: "Yours",            // your name
  candles: 5,               // 1 to 9
  letter:
`Happy birthday, my favourite person.

My dear Ms. Darling ❤️,
This might be just a normal birthday for you… but for me, your birthday is very special. 🥺❤️ I’ll do everything I can to make your birthday as special and memorable as possible for you. ❤️
So, today is your birthday — just enjoy it. ❤️ But not only today… I want you to enjoy every single day of your life, every moment and every minute. 🤗
It’s almost 721 days of our relationship… I’ve been there for you all these days, and I’ll continue to be there for you for all the days to come. ❤️
Not just on your birthday… for as long as I’m here, every single day, every minute, and every little moment, I just want to see you happy, smiling, and enjoying your life. 🥺❤️
You deserve all the happiness in this world, my dear. And as long as I’m here, I’ll always try my best to make your days a little more special. ❤️
Love you so much. ❤️
Happy Birthday, Ms. Darling! 🎂❤️
Miss you… 🥺🤗

I love you. Today, and every day after.`,
  reasons: [
    "The way your laugh fills an entire room.",
    "You notice the little things nobody else does.",
    "You make my bad days shorter and my good days better.",
    "Your kindness, even when no one is watching.",
    "The way you look at me when you think I'm not paying attention.",
    "You're my favourite person to do absolutely nothing with.",
    "You believe in me more than I believe in myself.",
    "Every plan I make for the future has you in it."
  ]
};

const qs = new URLSearchParams(location.search);
const NAME = (qs.get("name") || CONFIG.name).trim();
const FROM = (qs.get("from") || CONFIG.from).trim();
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = s => document.querySelector(s);
const rand = (a=1,b) => b===undefined ? Math.random()*a : a + Math.random()*(b-a);
document.title = `Happy Birthday, ${NAME}`;
document.querySelectorAll("[data-name]").forEach(el => el.textContent = NAME + ",");

/* ================= AUDIO (synthesized, no files) ================= */
let actx=null, master=null, muted=false;
function initAudio(){
  if(actx){ if(actx.state==="suspended") actx.resume(); return; }
  try{
    actx = new (window.AudioContext||window.webkitAudioContext)();
    master = actx.createGain(); master.gain.value = .55;
    const comp = actx.createDynamicsCompressor(); master.connect(comp); comp.connect(actx.destination);
  }catch(e){ actx=null; }
}
function tone(freq,t,dur,vol=.2,type="triangle"){
  if(!actx) return;
  const o=actx.createOscillator(), g=actx.createGain();
  o.type=type; o.frequency.value=freq;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.012); g.gain.exponentialRampToValueAtTime(.0008,t+dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+.05);
}
function chime(){
  if(!actx) return; const t=actx.currentTime;
  [1046.5,1318.5,1568,2093].forEach((f,i)=>{ tone(f,t+i*.09,1.6,.09,"sine"); tone(f*2,t+i*.09,.6,.02,"sine"); });
}
function noise(len,shape){
  const buf=actx.createBuffer(1,Math.floor(actx.sampleRate*len),actx.sampleRate), d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,shape);
  const s=actx.createBufferSource(); s.buffer=buf; return s;
}
function brown(len){ // soft, deep "breath" noise
  const buf=actx.createBuffer(1,Math.floor(actx.sampleRate*len),actx.sampleRate), d=buf.getChannelData(0); let l=0;
  for(let i=0;i<d.length;i++){ l=(l+.02*(Math.random()*2-1))/1.02; d[i]=l*3.5; }
  const s=actx.createBufferSource(); s.buffer=buf; return s;
}
let candleNote=0;
function puff(){
  if(!actx) return; const t=actx.currentTime+.01;
  // 1. a gentle human "whooo" breath
  const b=brown(.9), lp=actx.createBiquadFilter(), bg=actx.createGain();
  lp.type="lowpass"; lp.frequency.setValueAtTime(700,t); lp.frequency.linearRampToValueAtTime(1100,t+.12); lp.frequency.exponentialRampToValueAtTime(380,t+.7);
  bg.gain.setValueAtTime(0,t); bg.gain.linearRampToValueAtTime(.55,t+.1); bg.gain.setValueAtTime(.55,t+.22); bg.gain.exponentialRampToValueAtTime(.001,t+.75);
  b.connect(lp); lp.connect(bg); bg.connect(master); b.start(t);
  // 2. the flame fluttering and dying: low noise shaken by a fast tremolo
  const f=brown(.3), flp=actx.createBiquadFilter(), fg=actx.createGain(), trem=actx.createGain(), lfo=actx.createOscillator(), lfoAmt=actx.createGain();
  flp.type="lowpass"; flp.frequency.value=420;
  lfo.frequency.setValueAtTime(34,t+.12); lfo.frequency.linearRampToValueAtTime(14,t+.38); lfoAmt.gain.value=.5; trem.gain.value=.5;
  lfo.connect(lfoAmt); lfoAmt.connect(trem.gain);
  fg.gain.setValueAtTime(0,t+.12); fg.gain.linearRampToValueAtTime(.45,t+.15); fg.gain.exponentialRampToValueAtTime(.001,t+.42);
  f.connect(flp); flp.connect(trem); trem.connect(fg); fg.connect(master); f.start(t+.12); lfo.start(t+.12); lfo.stop(t+.45);
  // 3. a soft magical twinkle, one note higher for each candle
  const scale=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5,1568];
  const n=scale[candleNote++%scale.length], tt=t+.28;
  tone(n,tt,1.4,.09,"sine"); tone(n*2,tt,.7,.03,"sine"); tone(n*3,tt+.02,.35,.012,"sine");
}
let lastBoom=0;
function boom(){
  if(!actx) return; const t=actx.currentTime; if(t-lastBoom<.12) return; lastBoom=t;
  const s=noise(1.1,3), f=actx.createBiquadFilter(), g=actx.createGain();
  f.type="lowpass"; f.frequency.setValueAtTime(1800,t); f.frequency.exponentialRampToValueAtTime(120,t+.8);
  g.gain.value=.16; s.connect(f); f.connect(g); g.connect(master); s.start(t);
  for(let i=0;i<6;i++) tone(rand(2500,5000),t+.15+rand(.5),.12,.015,"sine");
}
function playSong(){
  initAudio(); if(!actx) return;
  const N={G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,F5:698.46,G5:783.99,C4:261.63,G3:196,F4:349.23};
  const song=[["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],
              ["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],
              ["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",2],
              ["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",3]];
  const bass=[["C4",3],["G3",3],["G3",3],["C4",3],["C4",3],["F4",3],["C4",1.5],["G3",1.5],["C4",3]];
  const beat=.44; let t=actx.currentTime+.15, bt=t+beat;
  song.forEach(([n,b])=>{ tone(N[n],t,b*beat*1.7+.35,.2,"triangle"); tone(N[n]*2,t,b*beat*.9+.2,.045,"sine"); t+=b*beat; });
  bass.forEach(([n,b])=>{ tone(N[n]/2,bt,b*beat+.2,.1,"sine"); tone(N[n],bt+beat,b*beat*.6,.03,"sine"); bt+=b*beat; });
}
$("#mute").addEventListener("click",()=>{
  muted=!muted; $("#mute").setAttribute("aria-pressed",muted); $("#mute").setAttribute("aria-label",muted?"Turn sound on":"Mute sound");
  if(master) master.gain.value = muted ? 0 : .55;
});

/* ================= CANVASES ================= */
const sky=$("#sky"), sctx=sky.getContext("2d");
const fx=$("#fx"), fctx=fx.getContext("2d");
const cf=$("#confetti"), cctx=cf.getContext("2d");
let W=0,H=0,DPR=1, stars=[], shooters=[], px=0, py=0, current="intro";
const rockets=[], sparks=[], confetti=[]; let formers=[];
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
  [sky,fx,cf].forEach(c=>{ c.width=W*DPR; c.height=H*DPR; c.style.width=W+"px"; c.style.height=H+"px"; });
  [sctx,fctx,cctx].forEach(c=>c.setTransform(DPR,0,0,DPR,0,0));
  stars=[]; const n=Math.round(W*H/2300);
  for(let i=0;i<n;i++) stars.push({x:rand(W),y:rand(H*.92),r:Math.pow(Math.random(),3)*1.6+.25,p:rand(6.28),s:rand(.6,2.4),d:rand(.2,1),
    c:Math.random()<.15?"255,210,225":Math.random()<.1?"255,230,180":"250,245,255"});
  if(current==="sky-scene" && formers.length && formers[0].mode==="form") buildText(false);
}
addEventListener("resize",()=>{ clearTimeout(resize.t); resize.t=setTimeout(resize,150); });
addEventListener("pointermove",e=>{
  px=(e.clientX/W-.5); py=(e.clientY/H-.5);
  if(e.pointerType==="mouse" && !REDUCE && Math.random()<.7) sparks.push(mkSpark(e.clientX,e.clientY,rand(-.6,.6),rand(-.8,.2),rand(320,400)%360,40,.02,.96,1.4));
});

function drawSky(t){
  sctx.clearRect(0,0,W,H);
  for(const s of stars){
    const a=.35+.65*Math.abs(Math.sin(t*s.s+s.p)), x=s.x-px*18*s.d, y=s.y-py*12*s.d;
    sctx.fillStyle=`rgba(${s.c},${a})`; sctx.beginPath(); sctx.arc(x,y,s.r,0,6.283); sctx.fill();
    if(s.r>1.3){ sctx.fillStyle=`rgba(${s.c},${a*.12})`; sctx.beginPath(); sctx.arc(x,y,s.r*4,0,6.283); sctx.fill(); }
  }
  if(!REDUCE && Math.random()<.004) shooters.push({x:rand(W*.2,W),y:rand(H*.4),vx:-rand(7,11),vy:rand(2.5,4.5),life:1});
  for(let i=shooters.length-1;i>=0;i--){
    const s=shooters[i]; s.x+=s.vx; s.y+=s.vy; s.life-=.018;
    const g=sctx.createLinearGradient(s.x,s.y,s.x-s.vx*12,s.y-s.vy*12);
    g.addColorStop(0,`rgba(255,245,255,${Math.max(0,s.life)})`); g.addColorStop(1,"rgba(255,200,230,0)");
    sctx.strokeStyle=g; sctx.lineWidth=1.6; sctx.beginPath(); sctx.moveTo(s.x,s.y); sctx.lineTo(s.x-s.vx*12,s.y-s.vy*12); sctx.stroke();
    if(s.life<=0) shooters.splice(i,1);
  }
}

/* ================= FIREWORKS & PARTICLES ================= */
const G=.07;
function mkSpark(x,y,vx,vy,hue,max,g=.045,fr=.975,size=1.9,l=66){ return {x,y,vx,vy,hue,life:0,max,g,fr,size,l,tw:Math.random()<.35}; }
function launch(x=rand(W*.15,W*.85), ty=rand(H*.12,H*.42), hue=rand(360), kind){
  const dist=Math.max(60,H-ty);
  rockets.push({x,y:H+10,vx:rand(-.4,.4),vy:-Math.sqrt(2*G*dist),hue,kind:kind||["peony","ring","heart","peony","willow"][Math.floor(rand(5))]});
}
function explode(x,y,hue,kind){
  boom();
  const n = REDUCE ? 50 : (W<600?80:120);
  if(kind==="heart"){
    for(let i=0;i<n;i++){ const t=i/n*6.283, hx=16*Math.pow(Math.sin(t),3), hy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
      sparks.push(mkSpark(x,y,hx*.28,hy*.28,(340+rand(-10,15))%360,90,.02,.965,2.1,70)); }
  } else if(kind==="ring"){
    for(let i=0;i<n;i++){ const a=i/n*6.283, sp=4.2; sparks.push(mkSpark(x,y,Math.cos(a)*sp,Math.sin(a)*sp,hue+rand(-10,10),80)); }
    for(let i=0;i<n/2;i++){ const a=rand(6.283), sp=rand(1.5); sparks.push(mkSpark(x,y,Math.cos(a)*sp,Math.sin(a)*sp,50,60,.03,.97,1.4,85)); }
  } else if(kind==="willow"){
    for(let i=0;i<n;i++){ const a=rand(6.283), sp=rand(1,4); sparks.push(mkSpark(x,y,Math.cos(a)*sp,Math.sin(a)*sp,40+rand(10),140,.035,.985,1.6,70)); }
  } else {
    for(let i=0;i<n;i++){ const a=rand(6.283), sp=rand(.5,5); sparks.push(mkSpark(x,y,Math.cos(a)*sp,Math.sin(a)*sp,(hue+rand(-25,25)+360)%360,rand(60,100))); }
  }
  sparks.push(mkSpark(x,y,0,0,hue,12,0,1,26,90));
}
function confettiBurst(){
  const cols=["#FF9DB5","#FFD98A","#9ED8EA","#FFFFFF","#E0485F","#C7B2FF"];
  const n = REDUCE?60:(W<600?160:260);
  for(let i=0;i<n;i++){
    const L=i%2===0;
    confetti.push({x:L?-10:W+10,y:H*rand(.55,.85),vx:(L?1:-1)*rand(4,12),vy:-rand(6,15),w:rand(6,11),h:rand(3,6),r:rand(6.28),vr:rand(-.25,.25),c:cols[i%cols.length],flip:rand(6.28)});
  }
}

function textPoints(){
  const oc=document.createElement("canvas"); oc.width=W; oc.height=H; const o=oc.getContext("2d",{willReadFrequently:true});
  o.fillStyle="#fff"; o.textAlign="center"; o.textBaseline="middle";
  const fit=(txt,max,wt)=>{ o.font=`italic ${wt} ${max}px "Cormorant Garamond", Georgia, serif`; const w=o.measureText(txt).width; return w>W*.86 ? max*W*.86/w : max; };
  const s1=fit("Happy Birthday",Math.min(W/6.2,120),500), s2=fit(NAME,Math.min(W/3.6,190),600);
  const top=H*.42-(s1+s2)*.45;
  o.font=`italic 500 ${s1}px "Cormorant Garamond", Georgia, serif`; o.fillText("Happy Birthday",W/2,top);
  o.font=`italic 600 ${s2}px "Cormorant Garamond", Georgia, serif`; o.fillText(NAME,W/2,top+s1*.62+s2*.62);
  const d=o.getImageData(0,0,W,H).data; let gap=W<600?3:4, pts;
  do{ pts=[]; for(let y=0;y<H;y+=gap) for(let x=0;x<W;x+=gap) if(d[(y*W+x)*4+3]>130) pts.push({x,y}); gap++; }while(pts.length>(W<600?1800:3000));
  return pts;
}
function buildText(fromBursts=true){
  const pts=textPoints(), centers=[];
  for(let i=0;i<5;i++) centers.push({x:W*(.15+i*.175),y:H*rand(.2,.45)});
  formers=pts.map((p,i)=>{ const c=centers[i%5];
    return {x:fromBursts?c.x+rand(-30,30):p.x, y:fromBursts?c.y+rand(-30,30):p.y, tx:p.x, ty:p.y,
      hue:(330+(p.x/W)*70)%360, l:rand(68,82), size:rand(1.3,2.2), delay:fromBursts?rand(0,35):0, mode:"form", a:1, ph:rand(6.28)}; });
  if(REDUCE) formers.forEach(f=>{f.x=f.tx;f.y=f.ty;f.delay=0;});
}
function buildHeart(){
  const n=Math.round(Math.min(W<600?1100:1900, W*H/420));
  formers=[];
  for(let i=0;i<n;i++){
    const t=rand(6.283), r=Math.random()<.55?1:Math.sqrt(Math.random())*.95;
    const hx=16*Math.pow(Math.sin(t),3)*r, hy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*r;
    formers.push({x:W/2+rand(-4,4),y:H*.34+rand(-4,4),hx,hy,tx:0,ty:0,hue:Math.random()<.18?42:rand(335,365)%360,l:rand(62,78),size:rand(1.2,2.3),delay:REDUCE?0:rand(0,50),mode:"heart",a:1,ph:rand(6.28)});
  }
}
function scatterFormers(){ formers.forEach(f=>{ f.mode="scatter"; f.delay=0; f.vx=rand(-.8,.8); f.vy=-rand(.3,1.8); }); }

let last=performance.now();
function frame(now){
  const dt=Math.min((now-last)/16.67,3); last=now; const t=now/1000;
  drawSky(t);
  fctx.globalCompositeOperation="destination-out"; fctx.fillStyle="rgba(0,0,0,.24)"; fctx.fillRect(0,0,W,H);
  fctx.globalCompositeOperation="lighter";

  for(let i=rockets.length-1;i>=0;i--){
    const r=rockets[i]; r.x+=r.vx*dt; r.y+=r.vy*dt; r.vy+=G*dt;
    fctx.fillStyle=`hsla(${r.hue},100%,80%,1)`; fctx.fillRect(r.x-1.5,r.y-1.5,3,3);
    if(Math.random()<.8) sparks.push(mkSpark(r.x,r.y,rand(-.3,.3),rand(.5,1.5),40,26,.02,.95,1.3,70));
    if(r.vy>=-.4){ explode(r.x,r.y,r.hue,r.kind); rockets.splice(i,1); }
  }
  for(let i=sparks.length-1;i>=0;i--){
    const s=sparks[i]; s.life+=dt; s.vx*=Math.pow(s.fr,dt); s.vy=s.vy*Math.pow(s.fr,dt)+s.g*dt; s.x+=s.vx*dt; s.y+=s.vy*dt;
    const a=1-s.life/s.max; if(a<=0){ sparks[i]=sparks[sparks.length-1]; sparks.pop(); continue; }
    if(s.tw && Math.random()<.35) continue;
    fctx.fillStyle=`hsla(${s.hue},100%,${s.l}%,${a})`;
    const z=s.size>10?s.size*a:s.size; fctx.fillRect(s.x-z/2,s.y-z/2,z,z);
  }
  if(formers.length){
    const cx=W/2, cy=H*.34, sc=Math.min(W*.9,H*.72)/38;
    const ph=(t%1.05)/1.05, beat=1+.075*Math.exp(-ph*14)+.05*(ph>.22?Math.exp(-(ph-.22)*14):0);
    for(let i=formers.length-1;i>=0;i--){
      const f=formers[i];
      if(f.delay>0){ f.delay-=dt; continue; }
      if(f.mode==="heart"){ f.tx=cx+f.hx*sc*beat; f.ty=cy+f.hy*sc*beat; }
      if(f.mode==="scatter"){ f.x+=f.vx*dt; f.y+=f.vy*dt; f.vy-=.015*dt; f.a-=.009*dt; if(f.a<=0){ formers[i]=formers[formers.length-1]; formers.pop(); continue; } }
      else { const k=f.mode==="heart"?.09:.055; f.x+=(f.tx-f.x)*k*dt; f.y+=(f.ty-f.y)*k*dt; }
      fctx.fillStyle=`hsla(${f.hue},95%,${f.l}%,${f.a*(.65+.35*Math.sin(t*4+f.ph))})`;
      fctx.fillRect(f.x+Math.sin(t*3+f.ph)*.7-f.size/2,f.y-f.size/2,f.size,f.size);
    }
  }
  cctx.clearRect(0,0,W,H);
  for(let i=confetti.length-1;i>=0;i--){
    const c=confetti[i]; c.vx*=Math.pow(.985,dt); c.vy=Math.min(c.vy+.28*dt,3.2); c.x+=(c.vx+Math.sin(c.flip)*.8)*dt; c.y+=c.vy*dt; c.r+=c.vr*dt; c.flip+=.12*dt;
    if(c.y>H+20){ confetti[i]=confetti[confetti.length-1]; confetti.pop(); continue; }
    cctx.save(); cctx.translate(c.x,c.y); cctx.rotate(c.r); cctx.scale(1,Math.cos(c.flip)); cctx.fillStyle=c.c; cctx.fillRect(-c.w/2,-c.h/2,c.w,c.h); cctx.restore();
  }
  requestAnimationFrame(frame);
}

/* ================= SCENES ================= */
let fwTimer=null;
const later=(fn,ms)=>setTimeout(fn,ms);
const enter={}, leave={};
function go(id){
  (leave[current]||(()=>{}))();
  $("#"+current).classList.remove("active");
  current=id; $("#"+id).classList.add("active");
  updateProgress(id);
  (enter[id]||(()=>{}))();
}

/* ---------- progress dots ---------- */
const ORDER=["intro","cake","sky-scene","letter","lantern-scene","finale"];
const progEl=$("#progress");
ORDER.forEach(()=>{ const i=document.createElement("i"); progEl.appendChild(i); });
function updateProgress(id){
  const idx=ORDER.indexOf(id); if(idx<0) return;
  progEl.classList.add("show");
  [...progEl.children].forEach((d,i)=>{
    d.className = i<idx ? "done" : i===idx ? "now" : "";
  });
}

/* ---------- float hearts (letter) ---------- */
let heartTimer=null;
function spawnHeart(){
  const h=document.createElement("span"); h.className="float-heart";
  h.textContent=Math.random()<.2?"💖":"❤️";
  h.style.left=rand(8,92)+"vw";
  h.style.setProperty("--s",rand(.8,1.7).toFixed(2)+"rem");
  h.style.setProperty("--d",rand(6,10).toFixed(1)+"s");
  h.style.setProperty("--delay","0s");
  $("#letter").appendChild(h);
  setTimeout(()=>h.remove(),10500);
}

/* ---------- sparkle cursor trail ---------- */
if(!REDUCE) addEventListener("pointermove",e=>{
  if(Math.random()>.5) return;
  const s=document.createElement("span"); s.className="trail-spark";
  s.style.left=e.clientX+"px"; s.style.top=e.clientY+"px";
  s.style.setProperty("--tc",["#FFD9A0","#FF9DB5","#FFF1D6"][Math.floor(rand(3))]);
  document.body.appendChild(s);
  setTimeout(()=>s.remove(),850);
},{passive:true});

/* ---------- release your own lantern ---------- */
function buildMyLantern(text){
  const field=$("#field");
  const b=document.createElement("button"); b.className="lantern mine"; b.setAttribute("aria-label","Your wish lantern");
  const x=rand(8,88), dur=rand(20,26);
  b.style.cssText=`--x:${x}%;--s:1.05;--dur:${dur.toFixed(1)}s;--delay:0s;--row:0`;
  b.innerHTML=`<span class="body"><i class="core"></i><span>${text.replace(/</g,"&lt;").slice(0,40)||"♥"}</span></span>`;
  b.addEventListener("click",()=>{ initAudio(); chime(); b.classList.add("opened"); });
  field.appendChild(b);
  const r=b.getBoundingClientRect();
  for(let k=0;k<34;k++){ const a=rand(6.28); sparks.push(mkSpark(r.left+r.width/2,r.top+r.height/2,Math.cos(a)*rand(.5,3),Math.sin(a)*rand(.5,3)-1,rand(265,300)%360,70,.02,.96,1.8,74)); }
}
function sendWish(){
  const inp=$("#wishInput"), v=inp.value.trim();
  if(!v){ inp.focus(); return; }
  initAudio(); chime(); buildMyLantern(v); inp.value="";
  $("#wishNote").textContent="Your wish is floating up to the stars ✨";
}

/* 1 — envelope */
$("#seal").addEventListener("click",()=>{
  initAudio(); chime();
  $("#envelope").classList.add("open");
  later(()=>{ const r=$("#envelope").getBoundingClientRect();
    for(let i=0;i<40;i++){ const a=rand(6.28); sparks.push(mkSpark(r.left+r.width/2,r.top+r.height*.3,Math.cos(a)*rand(1,4),Math.sin(a)*rand(1,4)-1,rand(330,400)%360,70,.03,.96,1.8,75)); } },650);
  later(()=>go("cake"),3000);
});

/* 2 — cake */
const candlesEl=$("#candles");
let wished=false, micStream=null;
function buildCandles(){
  candlesEl.innerHTML="";
  for(let i=0;i<Math.max(1,Math.min(9,CONFIG.candles));i++){
    const b=document.createElement("button"); b.className="candle"; b.setAttribute("aria-label",`Blow out candle ${i+1}`);
    b.innerHTML=`<span class="flame" style="--f:${rand(.12,.22).toFixed(2)}s"></span><span class="smoke"></span>`;
    b.addEventListener("click",()=>blowOut(b));
    candlesEl.appendChild(b);
  }
  $("#cakeWrap").style.setProperty("--lit",1);
}
const lit=()=>[...candlesEl.querySelectorAll(".candle:not(.out)")];
function blowOut(c){
  if(c.classList.contains("out")) return;
  initAudio(); puff(); chime(); c.classList.add("out"); c.setAttribute("aria-label","Candle blown out");
  const left=lit().length; $("#cakeWrap").style.setProperty("--lit",left/candlesEl.children.length);
  if(left===0) allOut();
}
function allOut(){
  if(wished) return; wished=true; stopMic();
  $("#cakeTitle").textContent="Your wish is on its way.";
  $("#cakeHint").textContent="Now look up.";
  $("#micBtn").style.visibility="hidden";
  later(()=>{ confettiBurst(); playSong(); },400);
  later(()=>go("sky-scene"),2800);
}
$("#micBtn").addEventListener("click",async()=>{
  initAudio();
  try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false}});
    const src=actx.createMediaStreamSource(micStream), an=actx.createAnalyser(); an.fftSize=1024; src.connect(an);
    const data=new Uint8Array(an.fftSize); let lastBlow=0, streak=0;
    $("#micBtn").textContent="Listening… blow gently"; $("#cakeNote").textContent="";
    const loop=()=>{
      if(!micStream) return;
      an.getByteTimeDomainData(data); let sum=0; for(const v of data){ const d=(v-128)/128; sum+=d*d; }
      const rms=Math.sqrt(sum/data.length), now=performance.now();
      if(rms>.09){ streak++; candlesEl.classList.add("wind"); } else { streak=0; candlesEl.classList.remove("wind"); }
      if(streak>4 && now-lastBlow>160){ lastBlow=now; const l=lit(); if(l.length) blowOut(l[Math.floor(rand(l.length))]); }
      requestAnimationFrame(loop);
    };
    loop();
  }catch(e){
    $("#cakeNote").textContent="The microphone isn't available here, so tap each flame instead.";
  }
});
function stopMic(){ if(micStream){ micStream.getTracks().forEach(t=>t.stop()); micStream=null; } candlesEl.classList.remove("wind"); }

/* 3 — fireworks spelling her name */
enter["sky-scene"]=async()=>{
  try{ await document.fonts.load('italic 600 80px "Cormorant Garamond"'); await document.fonts.load('italic 500 80px "Cormorant Garamond"'); }catch(e){}
  const n=REDUCE?2:6;
  for(let i=0;i<n;i++) later(()=>launch(W*(.15+i*(.7/Math.max(1,n-1))),rand(H*.15,H*.4)),i*260);
  later(()=>launch(W/2,H*.2,345,"heart"),1200);
  later(()=>buildText(true),1500);
  fwTimer=setInterval(()=>{ if(!REDUCE) launch(); },1700);
  later(()=>$("#tapHint").classList.add("show"),3500);
  later(()=>$("#toLetter").classList.add("show"),5500);
};
$("#sky-scene").addEventListener("pointerdown",e=>{ if(e.target.id==="sky-scene"||e.target.id==="tapHint"){ initAudio(); launch(e.clientX,Math.max(40,e.clientY),rand(360)); }});
$("#toLetter").addEventListener("click",()=>{ clearInterval(fwTimer); scatterFormers(); go("letter"); });

/* 4 — letter */
let typeT=null, typedAll=false;
enter.letter=()=>{
  $("#letterHello").textContent=`Dear ${NAME},`;
  $("#sign").textContent=`Forever yours, ${FROM}`;
  const el=$("#letterBody"), txt=CONFIG.letter; let i=0; el.textContent=""; el.classList.add("typing"); typedAll=false;
  const step=()=>{
    if(i>=txt.length){ finishLetter(); return; }
    i++; el.textContent=txt.slice(0,i);
    const ch=txt[i-1], p=$("#paper"); p.scrollTop=p.scrollHeight;
    typeT=setTimeout(step, ch==="\n"?300 : /[.!?]/.test(ch)?340 : ch===","?160 : REDUCE?4:rand(22,44));
  };
  typeT=setTimeout(step,900);
};
function finishLetter(){
  if(typedAll) return; typedAll=true; clearTimeout(typeT);
  const el=$("#letterBody"); el.textContent=CONFIG.letter; el.classList.remove("typing");
  $("#sign").classList.add("show"); chime();
  later(()=>$("#toLanterns").classList.add("show"),900);
}$("#paper").addEventListener("click",finishLetter);
$("#toLanterns").addEventListener("click",()=>go("lantern-scene"));

/* 5 — lanterns */
const opened=new Set();
function updateCount(){
  const n=CONFIG.reasons.length;
  $("#lanternCount").textContent = opened.size===n ? "Every one of them is true." : `Tap them as they float by. ${opened.size} of ${n} opened.`;
}
enter["lantern-scene"]=()=>{
  const field=$("#field"); if(field.children.length){ updateCount(); $("#wishZone").classList.add("show"); return; }
  const n=CONFIG.reasons.length;
  CONFIG.reasons.forEach((r,i)=>{
    const b=document.createElement("button"); b.className="lantern"; b.setAttribute("aria-label",`Open lantern ${i+1}`);
    const x=6+(i/(n-1||1))*82+rand(-3,3), s=rand(.8,1.25), dur=rand(17,25);
    b.style.cssText=`--x:${x}%;--s:${s.toFixed(2)};--dur:${dur.toFixed(1)}s;--delay:-${rand(dur).toFixed(1)}s;--row:${i%3}`;
    b.innerHTML=`<span class="body"><i class="core"></i><span>♥</span></span>`;
    b.addEventListener("click",()=>openReason(i,b));
    field.appendChild(b);
  });
  updateCount();
  $("#wishZone").classList.add("show");
};
function openReason(i,b){
  initAudio(); chime(); opened.add(i); b.classList.add("opened");
  const r=b.getBoundingClientRect();
  for(let k=0;k<30;k++){ const a=rand(6.28); sparks.push(mkSpark(r.left+r.width/2,r.top+r.height/2,Math.cos(a)*rand(.5,3),Math.sin(a)*rand(.5,3),rand(25,50),60,.02,.96,1.7,72)); }
  $("#reasonText").textContent=CONFIG.reasons[i];
  $("#reason").classList.add("show");
  updateCount();
}
$("#reason").addEventListener("click",()=>{
  $("#reason").classList.remove("show");
  if(opened.size===CONFIG.reasons.length) $("#toFinale").classList.add("show");
});
addEventListener("keydown",e=>{ if(e.key==="Escape" && $("#reason").classList.contains("show")) $("#reason").click(); });
$("#toFinale").addEventListener("click",()=>go("finale"));

/* 6 — finale */
enter.finale=()=>{
  $("#finaleTitle").textContent=`Happy birthday, ${NAME}.`;
  buildHeart(); confettiBurst(); playSong();
  fwTimer=setInterval(()=>{ if(!REDUCE) launch(rand(W*.1,W*.9),rand(H*.06,H*.2)); },2600);
};
leave.finale=()=>{ clearInterval(fwTimer); };
$("#finale").addEventListener("pointerdown",e=>{ if(e.target.id==="finale"){ initAudio(); launch(e.clientX,Math.max(40,e.clientY),rand(360)); }});
$("#replaySong").addEventListener("click",()=>{ playSong(); confettiBurst(); launch(W/2,H*.12,345,"heart"); });
$("#restart").addEventListener("click",()=>{
  clearInterval(fwTimer); scatterFormers();
  wished=false; candleNote=0; buildCandles(); opened.clear(); $("#field").innerHTML="";
  $("#wishNote").textContent="…or tap a floating lantern as it passes by.";
  $("#cakeTitle").textContent="Make a wish first.";
  $("#cakeHint").textContent="Then blow out the candles. Tap each flame, or blow into your microphone.";
  $("#micBtn").textContent="Blow with my breath"; $("#micBtn").style.visibility="";
  $("#envelope").classList.remove("open");
  document.querySelectorAll(".reveal").forEach(r=>r.classList.remove("show"));
  $("#sign").classList.remove("show");
  go("intro");
});

resize(); buildCandles(); requestAnimationFrame(frame);
$("#sendWish").addEventListener("click",sendWish);
$("#wishInput").addEventListener("keydown",e=>{ if(e.key==="Enter") sendWish(); });

/* letter: gentle floating hearts while reading (wrapped after enter.letter is defined) */
const _enterLetter=enter.letter;
enter.letter=()=>{ _enterLetter(); if(!REDUCE){ for(let i=0;i<4;i++) setTimeout(spawnHeart,i*900); heartTimer=setInterval(spawnHeart,1400); } };
leave.letter=()=>{ clearInterval(heartTimer); document.querySelectorAll("#letter .float-heart").forEach(h=>h.remove()); };
