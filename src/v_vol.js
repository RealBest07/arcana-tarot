
/* ======================================================================
   SECTION 13 · VOLUME — a rune dial instead of a slider
   The sound button opens a small panel with a gold dial: drag around the ring (or scroll / arrow keys)
   to turn the volume; the sigil in the middle turns with it and the ember glow grows with loudness.
   ====================================================================== */
(function volumeDial(){
  const R=62,A0=135,SW=270,P=a=>[R*Math.cos(a*D2R),R*Math.sin(a*D2R)].map(n=>n.toFixed(2)).join(',');
  const arc=`M${P(A0)}A${R},${R} 0 1 1 ${P(A0+SW)}`;
  const ticks=Array.from({length:25},(_,i)=>{const a=(A0+i*SW/24)*D2R,big=i%4===0,r1=big?68:70,r2=big?78:75;
    return `<line x1="${(r1*Math.cos(a)).toFixed(1)}" y1="${(r1*Math.sin(a)).toFixed(1)}" x2="${(r2*Math.cos(a)).toFixed(1)}" y2="${(r2*Math.sin(a)).toFixed(1)}" class="${big?'tb':''}"/>`}).join('');
  const pop=document.createElement('div');pop.id='volPop';pop.className='glass';pop.setAttribute('role','dialog');pop.setAttribute('aria-label','ระดับเสียง');pop.hidden=true;
  pop.innerHTML=`<div class="vtitle">ระดับเสียง</div>
    <div id="volDial" role="slider" tabindex="0" aria-label="ระดับเสียง" aria-valuemin="0" aria-valuemax="100">
      <div class="vflame"></div><img class="vsig" src="assets/sigil.webp" alt="" draggable="false">
      <svg viewBox="-82 -82 164 164" aria-hidden="true"><g class="ticks">${ticks}</g>
        <path class="track" d="${arc}"/><path class="fill" d="${arc}" pathLength="1"/>
        <g class="needle"><polygon points="56,0 70,-5 84,0 70,5"/><circle cx="70" cy="0" r="2.2"/></g></svg>
      <output class="vnum"></output></div>
    <button class="btn small" id="volMute" type="button">ดับเสียง</button>`;
  $('#stage').appendChild(pop);
  const dial=$('#volDial'),fill=pop.querySelector('.fill'),needle=pop.querySelector('.needle'),sig=pop.querySelector('.vsig'),fl=pop.querySelector('.vflame'),num=pop.querySelector('.vnum');
  let lastTick=Sound.v;
  function render(){
    const v=Sound.v;fill.style.strokeDasharray=`${v} 1`;needle.setAttribute('transform',`rotate(${A0+SW*v})`);
    gsap.to(sig,{rotation:v*540,opacity:.3+.6*v,duration:.4,ease:EO,overwrite:'auto'});
    gsap.to(fl,{scale:.45+v*.9,opacity:.25+v*.75,duration:.4,ease:EO,overwrite:'auto'});
    num.textContent=Math.round(v*100);dial.setAttribute('aria-valuenow',Math.round(v*100));dial.setAttribute('aria-valuetext',Math.round(v*100)+'%');
  }
  function set(v){
    if(!Sound.on&&v>0){Sound.toggle()}
    Sound.setVol(v);render();
    if(Math.abs(Sound.v-lastTick)>=.06){lastTick=Sound.v;Sound.click(0,.14,2600+Sound.v*2400,.03)}
  }
  function place(){const r=$('#btnSound').getBoundingClientRect(),w=pop.offsetWidth||210;pop.style.left=clamp(r.left,8,innerWidth-w-8)+'px';pop.style.top=(r.bottom+10)+'px'}
  function open(){
    if(!pop.hidden)return;pop.hidden=false;place();render();
    gsap.fromTo(pop,{autoAlpha:0,y:-10,scale:.9,transformOrigin:'20% 0%'},{autoAlpha:1,y:0,scale:1,duration:RM()?.01:.35,ease:'back.out(1.8)'});
    gsap.fromTo(sig,{rotation:Sound.v*540-120},{rotation:Sound.v*540,duration:RM()?.01:.9,ease:EO});
  }
  function close(){if(pop.hidden)return;gsap.to(pop,{autoAlpha:0,y:-8,duration:RM()?.01:.2,ease:EI,onComplete:()=>{pop.hidden=true}})}
  // drag around the ring
  let drag=false;
  const fromPoint=e=>{const r=dial.getBoundingClientRect(),a=Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))/D2R;
    let rel=((a-A0)%360+360)%360;if(rel>SW)rel=rel>SW+(360-SW)/2?0:SW;return rel/SW};
  dial.addEventListener('pointerdown',e=>{drag=true;dial.setPointerCapture(e.pointerId);set(fromPoint(e));e.preventDefault()});
  dial.addEventListener('pointermove',e=>{if(drag)set(fromPoint(e))});
  dial.addEventListener('pointerup',()=>{drag=false});dial.addEventListener('pointercancel',()=>{drag=false});
  dial.addEventListener('wheel',e=>{e.preventDefault();set(Sound.v-e.deltaY*.0009)},{passive:false});
  dial.addEventListener('keydown',e=>{const k=e.key,s=e.shiftKey?.1:.05;
    if(k==='ArrowUp'||k==='ArrowRight'){set(Sound.v+s);e.preventDefault()}else if(k==='ArrowDown'||k==='ArrowLeft'){set(Sound.v-s);e.preventDefault()}
    else if(k==='Home'){set(0);e.preventDefault()}else if(k==='End'){set(1);e.preventDefault()}else if(k==='Escape'){close();$('#btnSound').focus()}});
  $('#volMute').addEventListener('click',()=>{if(Sound.on)Sound.toggle();close()});
  // sound button: first press switches sound on and opens the dial, later presses open/close it
  $('#btnSound').onclick=()=>{if(!Sound.on){Sound.toggle();open()}else if(pop.hidden)open();else close()};
  document.addEventListener('pointerdown',e=>{if(!pop.hidden&&!pop.contains(e.target)&&!$('#btnSound').contains(e.target))close()},true);
  addEventListener('resize',()=>{if(!pop.hidden)place()});
  render();
})();
