
/* ======================================================================
   SECTION 12 · SOULSLIKE ATMOSPHERE
   lantern light · altar candles · shuffle ritual · reversed-card cracks · burning cards ·
   "FATE REVEALED" banner · ambient wind/fire/drone + bell toll
   Hooks wrap earlier functions (function bindings are looked up at call time).
   ====================================================================== */

/* ---- lantern: warm light pool that follows the pointer, darkness around it ---- */
(function lantern(){
  const el=document.createElement('div');el.id='lantern';el.setAttribute('aria-hidden','true');el.innerHTML='<i></i>';
  $('#stage').insertBefore(el,$('#zoomBg'));
  gsap.set(el,{x:innerWidth/2,y:innerHeight*.46});
  const qx=gsap.quickTo(el,'x',{duration:.9,ease:'power3.out'}),qy=gsap.quickTo(el,'y',{duration:.9,ease:'power3.out'});
  addEventListener('pointermove',e=>{if(RM())return;qx(e.clientX);qy(e.clientY)},{passive:true});
  addEventListener('resize',()=>{if(RM())gsap.set(el,{x:innerWidth/2,y:innerHeight*.46})});
})();

/* ---- candles standing around the sigil on the altar (seen from above, like the cloth) ---- */
(function candles(){
  const spots=[[-1.18,-.52],[1.18,-.52],[-1.32,.22],[1.32,.22],[-.86,.78],[.86,.78]];
  $('#altar').insertAdjacentHTML('beforeend',spots.map(([x,y],i)=>
    `<b class="cdl" style="--x:${x};--y:${y};--d:${(i*.37)%1.3}s"><i class="pool"></i><i class="wax"></i><i class="flm"></i></b>`).join(''));
})();

/* ---- shuffle ritual: the sigil kindles, the deck glows like a coal, embers spit with every shuffle ---- */
function emberSpit(n=14){
  if(RM())return;const top=S.deck[S.deck.length-1];if(!top)return;const {cx,cy,w,h}=fxRect(top);
  for(let i=0;i<n;i++){
    const d=fxDot('ember'),x0=cx+rand(-w*.5,w*.5),y0=cy+rand(-h*.2,h*.4),dur=rand(.9,1.8);
    gsap.set(d,{x:x0,y:y0,scale:rand(.4,1.1),opacity:0});
    gsap.timeline({onComplete:fxKill(d)}).to(d,{opacity:1,duration:.12})
      .to(d,{x:x0+rand(-90,90),y:y0-rand(60,220),duration:dur,ease:'power2.out'},0).to(d,{opacity:0,duration:.5,ease:EI},dur-.5);
  }
}
let SIGR=0;
function ritual(on){
  const sig=$('#altar>i');
  if(RM()){gsap.set(sig,{opacity:on?.55:.3});return}
  gsap.to(sig,{opacity:on?.8:.3,duration:on?1.2:1.6,ease:EIO,overwrite:'auto'});
  SIGR+=on?720:90;gsap.to(sig,{'--sr':SIGR+'deg',duration:on?12:3,ease:on?'power1.in':'power2.out'});
  gsap.to('#altar .pool',{scale:on?1.35:1,duration:1.2,ease:EIO});
  document.documentElement.classList.toggle('kindled',on);
}
{
  const _toShuffle=toShuffle,_shuffleOnce=shuffleOnce,_dealFan=dealFan;
  toShuffle=async function(){ritual(true);ambBoost(true);return _toShuffle.apply(this,arguments)};
  shuffleOnce=function(kind){emberSpit();Sound.crackle(6);return _shuffleOnce.apply(this,arguments)};
  dealFan=async function(){ritual(false);ambBoost(false);return _dealFan.apply(this,arguments)};
}

/* ---- reversed cards crack: dark-red fissures spread over the face ---- */
function crackSVG(){
  let seed=Math.random()*1e4;const r=()=>(seed=(seed*9301+49297)%233280)/233280;
  const paths=[];
  const branch=(x,y,a,len,depth)=>{
    let d=`M${x.toFixed(1)},${y.toFixed(1)}`;
    for(let s=0;s<len;s++){a+=(r()-.5)*.9;x=Math.min(276,Math.max(4,x+Math.cos(a)*14));y=Math.min(476,Math.max(4,y+Math.sin(a)*14));d+=`L${x.toFixed(1)},${y.toFixed(1)}`;
      if(depth<2&&r()<.18)branch(x,y,a+(r()<.5?-1:1)*(.6+r()*.6),Math.floor(len*.5),depth+1)}
    const sw=2.2-depth*.6;paths.push(`<path class="cg" d="${d}" pathLength="1" style="stroke-width:${(sw*3.2).toFixed(1)}"/><path d="${d}" pathLength="1" style="stroke-width:${sw.toFixed(1)}"/>`);
  };
  const starts=[[r()*280,0,Math.PI/2],[0,140+r()*200,0],[280,140+r()*200,Math.PI],[r()*280,480,-Math.PI/2]];
  starts.sort(()=>r()-.5).slice(0,3).forEach(([x,y,a])=>branch(x,y,a+(r()-.5)*.6,9+Math.floor(r()*8),0));
  return `<svg class="crk" viewBox="0 0 280 480" preserveAspectRatio="none" aria-hidden="true">${paths.join('')}</svg>`;
}
function addCrack(c){
  if(!c.reversed||c.faceEl.querySelector('.crk'))return;
  c.faceEl.insertAdjacentHTML('beforeend',crackSVG());
  const ps=c.faceEl.querySelectorAll('.crk path');
  if(RM())gsap.set(ps,{strokeDashoffset:0});
  else gsap.fromTo(ps,{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:.9,ease:'power2.out',stagger:.05,delay:.35});
}
{
  const _curse=curseFX,_reveal=revealCard;
  curseFX=function(c){_curse(c);addCrack(c)};
  revealCard=function(c){const p=_reveal(c);p.then(()=>addCrack(c));return p};
}

{ // the zoomed copy of a reversed card shows the same cracks
  const _zc=zoomCard;
  zoomCard=function(c){_zc(c);const k=S.zoom===c&&c.faceEl.querySelector('.crk'),z=$('#zoomView .zin');if(k&&z)z.insertBefore(k.cloneNode(true),z.querySelector('.zsheen'))};
}

/* ---- new reading: an opened card burns away from one corner, then its back re-forms ---- */
function burnCard(c){
  const face=c.faceEl,fl=c.flipEl,back=fl.querySelector('.back'),cx=rand(10,90),cy=rand(55,95);
  if(RM()){gsap.set(fl,{rotationY:0});gsap.set(c.revEl,{rotation:0});face.querySelectorAll('.crk').forEach(e=>e.remove());return}
  c.el.style.setProperty('--bx',cx+'%');c.el.style.setProperty('--by',cy+'%');c.el.classList.add('burning');
  const o={b:0};Sound.crackle(14);
  gsap.timeline()
    .to(o,{b:135,duration:1.35,ease:'power1.in',onUpdate:()=>c.el.style.setProperty('--burn',o.b.toFixed(1))})
    .add(()=>{const {cx:X,cy:Y,w,h}=fxRect(c);
      for(let i=0;i<10;i++){const d=fxDot('smoke'),x0=X+rand(-w*.4,w*.4),y0=Y+rand(-h*.3,h*.4);
        gsap.set(d,{x:x0,y:y0,scale:.4,opacity:0,backgroundImage:'radial-gradient(circle,rgba(90,85,80,.55),rgba(40,38,36,.25) 45%,transparent 70%)'});
        gsap.timeline({delay:rand(0,.6),onComplete:fxKill(d)}).to(d,{opacity:.6,duration:.3}).to(d,{y:y0-rand(80,180),x:x0+rand(-40,40),scale:rand(1.4,2.2),duration:2,ease:'power1.out'},0).to(d,{opacity:0,duration:1},1)}
      for(let i=0;i<16;i++){const d=fxDot('ember'),x0=X+rand(-w*.45,w*.45),y0=Y+rand(-h*.45,h*.45),dur=rand(1,1.8);
        gsap.set(d,{x:x0,y:y0,scale:rand(.4,1),opacity:0});
        gsap.timeline({delay:rand(0,.9),onComplete:fxKill(d)}).to(d,{opacity:1,duration:.1}).to(d,{y:y0-rand(60,160),x:x0+rand(-30,30),duration:dur,ease:'power1.out'},0).to(d,{opacity:0,duration:.5},dur-.5)}
    },.15)
    .add(()=>{gsap.set(back,{opacity:0});gsap.set(fl,{rotationY:0});gsap.set(c.revEl,{rotation:0});
      c.el.classList.remove('burning');c.el.style.removeProperty('--burn');face.querySelectorAll('.crk').forEach(e=>e.remove())})
    .to(back,{opacity:1,duration:.5,ease:EO,onComplete:()=>gsap.set(back,{clearProps:'opacity'})});
}

/* ---- the souls banner: a wide dark band with a glowing title when the spread is complete ---- */
const MAJOR_MSG={m00:['A NEW JOURNEY','การเดินทางครั้งใหม่เริ่มขึ้น'],m10:['FATE TURNS','กงล้อแห่งโชคชะตาหมุนแล้ว'],m13:['REBIRTH AWAITS','จุดจบคือการเริ่มต้นใหม่'],
  m15:['CHAINS OF DESIRE','พันธนาการแห่งความปรารถนา'],m16:['THE TOWER FALLS','หอคอยพังทลาย'],m17:['HOPE REMAINS','ความหวังยังคงอยู่'],
  m18:['ILLUSION LURKS','ภาพลวงซ่อนอยู่ในเงา'],m19:['THE SUN RISES','ดวงอาทิตย์ส่องทาง'],m20:['THE CALL HAS COME','เสียงเรียกได้มาถึงแล้ว'],m21:['THE CYCLE IS COMPLETE','วัฏจักรได้สมบูรณ์']};
function soulBanner(){
  const cs=S.picked;if(!cs.length)return;
  let msg=null;for(let i=cs.length-1;i>=0;i--){const m=MAJOR_MSG[cs[i].id];if(m&&!cs[i].reversed){msg=m;break}}
  if(!msg)msg=cs.filter(c=>c.reversed).length>cs.length/2?['FATE IS CLOUDED','โชคชะตายังพร่ามัว']:['FATE REVEALED','โชคชะตาได้เผยแล้ว'];
  const b=$('#soulMsg');b.querySelector('b').textContent=msg[0];b.querySelector('small').textContent=msg[1];
  Sound.boom();
  if(RM()){gsap.timeline().set(b,{autoAlpha:1}).to(b,{autoAlpha:0,duration:.6},2.6);return}
  const t=b.querySelector('b'),sm=b.querySelector('small');
  gsap.timeline()
    .fromTo(b,{autoAlpha:0},{autoAlpha:1,duration:.8,ease:'power2.out'})
    .fromTo(t,{scale:1.12,filter:'blur(10px)',opacity:0},{scale:1,filter:'blur(0px)',opacity:1,duration:1.6,ease:'power2.out'},.15)
    .fromTo(sm,{opacity:0,y:8},{opacity:1,y:0,duration:1,ease:EO},.9)
    .to(t,{scale:1.03,duration:2.4,ease:'none'},1.75)
    .to(b,{autoAlpha:0,duration:1.1,ease:'power2.in'},3.6);
}
(function(){const b=document.createElement('div');b.id='soulMsg';b.setAttribute('aria-hidden','true');b.innerHTML='<b></b><small></small>';$('#stage').appendChild(b)})();
{const _rd=readingDone;readingDone=function(){_rd();soulBanner()}}

/* ---- sound: ambient wind + fire crackle + low drone while sound is on; bell toll on reveal ---- */
const Amb={nodes:null,boost:null,timer:null};
function ambStart(){
  const c=Sound.ctx;if(!c||Amb.nodes)return;
  const master=c.createGain();master.gain.value=0;master.connect(Sound.out(c));
  master.gain.linearRampToValueAtTime(1,c.currentTime+2.5);
  const len=c.sampleRate*4,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);let last=0;
  for(let i=0;i<len;i++){last=(last+.02*(Math.random()*2-1))/1.02;d[i]=last*3.5}               // brown-ish noise
  const wind=c.createBufferSource();wind.buffer=buf;wind.loop=true;
  const wf=c.createBiquadFilter();wf.type='bandpass';wf.frequency.value=380;wf.Q.value=.7;
  const wg=c.createGain();wg.gain.value=.05;
  const lfo=c.createOscillator(),lg=c.createGain();lfo.frequency.value=.07;lg.gain.value=180;lfo.connect(lg).connect(wf.frequency);
  const lfo2=c.createOscillator(),lg2=c.createGain();lfo2.frequency.value=.11;lg2.gain.value=.025;lfo2.connect(lg2).connect(wg.gain);
  wind.connect(wf).connect(wg).connect(master);wind.start();lfo.start();lfo2.start();
  const drone=c.createGain();drone.gain.value=.018;const dl=c.createBiquadFilter();dl.type='lowpass';dl.frequency.value=220;drone.connect(dl).connect(master);
  const os=[55,82.4,110.3].map(f=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=rand(-6,6);o.connect(drone);o.start();return o});
  Amb.nodes={master,wind,lfo,lfo2,os,drone};Amb.boost=drone.gain;
  const crack=()=>{if(!Amb.nodes)return;Sound.crackle(1+Math.floor(Math.random()*3),.03);Amb.timer=setTimeout(crack,rand(120,900))};crack();
}
function ambStop(){
  const n=Amb.nodes,c=Sound.ctx;if(!n||!c)return;Amb.nodes=null;clearTimeout(Amb.timer);
  n.master.gain.cancelScheduledValues(c.currentTime);n.master.gain.setTargetAtTime(0,c.currentTime,.4);
  setTimeout(()=>{try{n.wind.stop();n.lfo.stop();n.lfo2.stop();n.os.forEach(o=>o.stop());n.master.disconnect()}catch(e){}},2000);
}
function ambBoost(on){const c=Sound.ctx;if(!Amb.boost||!c)return;Amb.boost.setTargetAtTime(on?.04:.018,c.currentTime,.8)}
Sound.crackle=function(n=8,g=.07){
  if(!this.on||!this.ctx)return;for(let i=0;i<n;i++)this.click(Math.random()*.6,g*(.4+Math.random()),rand(1800,5200),rand(.008,.03));
};
Sound.bell=function(){
  if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime;
  [[196,.07,5],[392*1.19,.04,3.2],[196*2.76,.03,2.4],[196*5.4,.015,1.4],[98,.05,6]].forEach(([f,g,d])=>{
    const o=c.createOscillator(),v=c.createGain();o.type='sine';o.frequency.value=f;
    v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(g,t+.01);v.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(v).connect(Sound.out(c));o.start(t);o.stop(t+d+.1)});
};
Sound.boom=function(){
  if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime,o=c.createOscillator(),g=c.createGain();
  o.type='sine';o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(32,t+1.6);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.22,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+2.2);
  o.connect(g).connect(Sound.out(c));o.start(t);o.stop(t+2.3);this.bell();
};
{
  const _toggle=Sound.toggle;Sound.toggle=function(){_toggle.call(this);this.on?ambStart():ambStop()};
  const _chime=Sound.chime;Sound.chime=function(){_chime.call(this);this.bell()};
}

document.head.insertAdjacentHTML('beforeend',`<style>#shufUI p,#prompt p,#prompt small{text-shadow:0 0 6px #050507,0 0 14px #050507,0 0 26px #050507}
#swipeHint{position:fixed;left:50%;translate:-50% 0;z-index:6;pointer-events:none;text-align:center;opacity:0;visibility:hidden}
#swipeHint svg{width:200px;height:36px;display:block;margin:0 auto;overflow:visible}
#swipeHint .sh{fill:none;stroke:#e0b45c;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 6px rgba(255,170,70,.75))}
#swipeHint .sd{fill:#fff1c8;filter:drop-shadow(0 0 6px #ffb050)}
#swipeHint span{display:inline-block;margin-top:2px;font-size:13px;color:var(--gold2);text-shadow:0 0 6px #050507,0 0 14px #050507;white-space:nowrap}
#swipeHint b{font-weight:400}
.fanEdge{position:fixed;z-index:6;pointer-events:none;font-family:'Cinzel',serif;font-size:44px;line-height:1;color:var(--gold2);translate:0 -50%;
  text-shadow:0 0 12px rgba(255,160,70,.85),0 0 2px #000;opacity:0;visibility:hidden}
.fanEdge.l{left:4px;animation:edgeL 1.3s ease-in-out infinite}.fanEdge.r{right:4px;animation:edgeR 1.3s ease-in-out infinite}
@keyframes edgeL{50%{transform:translateX(-5px)}}@keyframes edgeR{50%{transform:translateX(5px)}}
</style>`);

/* ---- phones: swipe guide over the card row + edge chevrons while more cards lie off-screen ---- */
(function swipeGuide(){
  const st=$('#stage');
  st.insertAdjacentHTML('beforeend',`<div id="swipeHint" aria-hidden="true">
      <svg viewBox="0 0 220 40"><path class="sh" d="M28,20 H192"/><path class="sh" d="M40,9 L26,20 L40,31 M180,9 L194,20 L180,31"/><circle class="sd" cx="110" cy="20" r="4"/></svg>
      <span>ปัดซ้าย–ขวา เพื่อเลื่อนดูไพ่</span></div>
    <div class="fanEdge l" aria-hidden="true">‹</div><div class="fanEdge r" aria-hidden="true">›</div>`);
  const hint=$('#swipeHint'),dot=hint.querySelector('.sd'),eL=st.querySelector('.fanEdge.l'),eR=st.querySelector('.fanEdge.r');
  let loop=null,shown=false,panned=false;
  const fanTop=()=>S.L.H-S.L.Hf+50;
  function show(){
    if(!S.L.row||panned||shown)return;shown=true;
    gsap.set(hint,{top:fanTop()-54});
    gsap.fromTo(hint,{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:RM()?.01:.6,ease:EO});
    if(!RM())loop=gsap.timeline({repeat:-1,repeatDelay:.3})
      .fromTo(dot,{attr:{cx:110}},{attr:{cx:182},duration:.7,ease:'power2.inOut'})
      .to(dot,{attr:{cx:38},duration:1.2,ease:'power2.inOut'})
      .to(dot,{attr:{cx:110},duration:.7,ease:'power2.inOut'})
      .to(hint.querySelector('svg'),{x:-10,duration:.9,ease:'sine.inOut',yoyo:true,repeat:1},0);
  }
  function hide(){if(!shown)return;shown=false;loop&&loop.kill();loop=null;gsap.to(hint,{autoAlpha:0,y:-6,duration:.35,ease:EI})}
  // edge chevrons follow the pan position
  gsap.ticker.add(()=>{
    const on=S.state==='pick'&&S.L&&S.L.row&&!S.busy;
    let l=0,r=0;if(on){const m=maxPan(S.fan.length);if(m>4){l=S.pan>-m+6?1:0;r=S.pan<m-6?1:0}}
    if(eL._v!==l){eL._v=l;gsap.to(eL,{autoAlpha:l*.9,duration:.3})}
    if(eR._v!==r){eR._v=r;gsap.to(eR,{autoAlpha:r*.9,duration:.3})}
    if(on&&(l||r)){const t=fanTop()+S.L.ch*.42;if(eL._t!==t){eL._t=t;gsap.set([eL,eR],{top:t})}}
  });
  document.addEventListener('pointermove',()=>{if(shown&&S.dragging){panned=true;hide()}},{passive:true});
  const _deal=dealFan,_toReveal=toReveal,_new=newReading,_pick=pickCard;
  pickCard=async function(){hide();return _pick.apply(this,arguments)};
  dealFan=async function(){const r=await _deal.apply(this,arguments);show();return r};
  toReveal=async function(){hide();return _toReveal.apply(this,arguments)};
  newReading=async function(){hide();return _new.apply(this,arguments)};
})();

/* ---- game-menu feel: a soft tick when the pointer moves onto a button ---- */
document.addEventListener('pointerover',e=>{
  const b=e.target.closest?.('.btn,.opt,#beginBtn');if(!b||e.pointerType!=='mouse'||b.contains(e.relatedTarget))return;
  Sound.click(0,.05,4200,.02);
});
