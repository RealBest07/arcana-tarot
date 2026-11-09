
/* ======================================================================
   SECTION 10 · FX GIMMICKS
   element particles · reversed curse · holo foil · constellation · gold-dust trail ·
   moon phase + greeting · typewriter readings · haptics · save reading as PNG
   (meteors live in the star field, SECTION 4)
   ====================================================================== */

/* ---- haptics (touch devices only) ---- */
function buzz(p){if(S.lastPtr==='mouse'||!navigator.vibrate)return;try{navigator.vibrate(p)}catch(e){}}

/* ---- DOM particle helpers (in #fx, transform/opacity only) ---- */
function fxRect(c){const r=c.el.getBoundingClientRect();return{cx:r.left+r.width/2,cy:r.top+r.height/2,w:r.width,h:r.height}}
function fxDot(cls){const d=document.createElement('div');d.className='fxp '+cls;$('#fx').appendChild(d);return d}
const fxKill=d=>()=>d.remove();

/* ---- element burst on reveal: Wands embers, Cups droplets, Swords wind, Pentacles coins, Major aura ---- */
function elementBurst(c){
  if(RM())return;
  const {cx,cy,w,h}=fxRect(c),kind=c.arcana==='major'?'major':c.suit;
  if(kind==='wands'){
    for(let i=0;i<36;i++){
      const d=fxDot('ember'),s=rand(.5,1.4),x0=cx+rand(-w*.45,w*.45),y0=cy+rand(-h*.1,h*.45),dur=rand(1.3,2.4);
      gsap.set(d,{x:x0,y:y0,scale:s,opacity:0});
      gsap.timeline({delay:rand(0,.5),onComplete:fxKill(d)})
        .to(d,{opacity:1,duration:.15})
        .to(d,{y:y0-rand(h*.5,h*1.25),duration:dur,ease:'power1.out'},0)
        .to(d,{x:x0+rand(-46,46),duration:dur,ease:'sine.inOut'},0)
        .to(d,{opacity:0,scale:s*.3,duration:dur*.5,ease:EI},dur*.5);
    }
  }else if(kind==='cups'){
    for(let i=0;i<30;i++){
      const d=fxDot('drop'),x0=cx+rand(-w*.25,w*.25),y0=cy-h*.1,dx=rand(-1,1)*w*1.1,up=rand(h*.25,h*.75),dur=rand(1.1,1.7);
      gsap.set(d,{x:x0,y:y0,scale:rand(.6,1.3),opacity:0,rotation:dx>0?-18:18});
      gsap.timeline({delay:rand(0,.25),onComplete:fxKill(d)})
        .to(d,{opacity:1,duration:.1})
        .to(d,{x:x0+dx,duration:dur,ease:'none'},0)
        .to(d,{y:y0-up,duration:dur*.4,ease:'power2.out'},0)
        .to(d,{y:cy+h*rand(.55,.95),duration:dur*.6,ease:'power2.in'},dur*.4)
        .to(d,{opacity:0,duration:.25},dur-.25);
    }
    for(let i=0;i<3;i++){
      const d=fxDot('wring');gsap.set(d,{x:cx+rand(-w*.3,w*.3),y:cy+h*rand(.6,.85),scale:.2,opacity:.9});
      gsap.to(d,{scale:rand(1.6,2.4),opacity:0,duration:1.4,delay:.9+i*.22,ease:EO,onComplete:fxKill(d)});
    }
  }else if(kind==='swords'){
    for(let i=0;i<18;i++){
      const d=fxDot('wind'),yy=cy+rand(-h*.55,h*.55),rot=rand(-14,-4);
      gsap.set(d,{x:cx-w*1.3,y:yy+w*.25,rotation:rot,scaleX:.3,opacity:0});
      gsap.timeline({delay:i*.035+rand(0,.15),onComplete:fxKill(d)})
        .to(d,{x:cx+w*1.3,y:yy-w*.25,duration:rand(.55,.85),ease:'power2.inOut'})
        .to(d,{scaleX:rand(1.1,1.8),opacity:.95,duration:.3,ease:EO},0)
        .to(d,{opacity:0,scaleX:.4,duration:.3,ease:EI},'>-.3');
    }
    for(let i=0;i<10;i++){
      const d=fxDot('sp');gsap.set(d,{x:cx+rand(-w*.6,w*.6),y:cy+rand(-h*.5,h*.5),scale:0,backgroundColor:'#e8eeff'});
      gsap.timeline({delay:.25+rand(0,.5),onComplete:fxKill(d)}).to(d,{scale:rand(.5,1),rotation:90,duration:.25,ease:EO}).to(d,{scale:0,rotation:180,duration:.35,ease:EI});
    }
  }else if(kind==='pentacles'){
    for(let i=0;i<24;i++){
      const d=fxDot('coin'),x0=cx+rand(-w*.2,w*.2),y0=cy,dx=rand(-1,1)*w*1.2,up=rand(h*.3,h*.85),dur=rand(1.3,2);
      gsap.set(d,{x:x0,y:y0,scale:rand(.7,1.3),opacity:0,transformPerspective:400});
      gsap.timeline({delay:rand(0,.3),onComplete:fxKill(d)})
        .to(d,{opacity:1,duration:.1})
        .to(d,{x:x0+dx,rotationY:rand(540,1080)*(dx>0?1:-1),duration:dur,ease:'none'},0)
        .to(d,{y:y0-up,duration:dur*.42,ease:'power2.out'},0)
        .to(d,{y:cy+h*rand(.6,1),duration:dur*.58,ease:'power2.in'},dur*.42)
        .to(d,{opacity:0,duration:.3},dur-.3);
    }
  }else{                                                    // Major Arcana: rotating ray aura + shock rings + rising motes
    const R=Math.max(w,h)*2.2,a=fxDot('aura');gsap.set(a,{x:cx,y:cy,width:R,height:R,marginLeft:-R/2,marginTop:-R/2,scale:.3,opacity:0,rotation:0});
    gsap.timeline({onComplete:fxKill(a)}).to(a,{opacity:.9,scale:1,duration:.7,ease:EO}).to(a,{rotation:70,duration:2.6,ease:'none'},0).to(a,{opacity:0,scale:1.25,duration:1.2,ease:EI},1.4);
    for(let i=0;i<3;i++){
      const r=fxDot('aring'),S0=w*1.1;gsap.set(r,{x:cx,y:cy,width:S0,height:S0,marginLeft:-S0/2,marginTop:-S0/2,scale:.4,opacity:.95});
      gsap.to(r,{scale:2.6,opacity:0,duration:1.5,delay:i*.25,ease:EO,onComplete:fxKill(r)});
    }
    for(let i=0;i<22;i++){
      const d=fxDot('ember mote'),x0=cx+rand(-w*.6,w*.6),y0=cy+rand(0,h*.5),dur=rand(1.6,2.6);
      gsap.set(d,{x:x0,y:y0,scale:rand(.5,1.2),opacity:0});
      gsap.timeline({delay:.2+rand(0,.6),onComplete:fxKill(d)}).to(d,{opacity:1,duration:.2}).to(d,{y:y0-rand(h*.6,h*1.3),x:x0+rand(-30,30),duration:dur,ease:'power1.out'},0).to(d,{opacity:0,duration:.8,ease:EI},dur-.8);
    }
  }
}

/* ---- reversed card: violet-crimson smoke + low growl (the card shudders before it turns) ---- */
function curseFX(c){
  if(RM())return;const {cx,cy,w,h}=fxRect(c);
  for(let i=0;i<18;i++){
    const d=fxDot('smoke'),s=rand(.6,1.5),x0=cx+rand(-w*.45,w*.45),y0=cy+rand(-h*.1,h*.5),dur=rand(1.6,2.5);
    gsap.set(d,{x:x0,y:y0,scale:s*.4,opacity:0,rotation:rand(0,360)});
    gsap.timeline({delay:rand(0,.35),onComplete:fxKill(d)})
      .to(d,{opacity:rand(.4,.7),duration:.35})
      .to(d,{y:y0-rand(h*.4,h*.95),x:x0+rand(-60,60),scale:s*1.7,rotation:'+='+rand(-120,120),duration:dur,ease:'power1.out'},0)
      .to(d,{opacity:0,duration:1.1,ease:EI},dur-1.1);
  }
}
/* ---- new reading: gold motes drift off a card as it turns face-down ---- */
function releaseFX(c){
  if(RM())return;const {cx,cy,w,h}=fxRect(c);
  for(let i=0;i<20;i++){
    const d=fxDot('ember mote'),a=rand(0,6.283),x0=cx+Math.cos(a)*w*.38,y0=cy+Math.sin(a)*h*.38,dur=rand(1.1,1.9),dist=rand(30,100);
    gsap.set(d,{x:x0,y:y0,scale:rand(.5,1.1),opacity:0});
    gsap.timeline({onComplete:fxKill(d)}).to(d,{opacity:1,duration:.2})
      .to(d,{x:x0+Math.cos(a)*dist,y:y0+Math.sin(a)*dist-rand(20,70),duration:dur,ease:EO},0).to(d,{opacity:0,duration:.6,ease:EI},dur-.6);
  }
}
Sound.curse=function(){
  if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();
  o.type='sawtooth';o.frequency.setValueAtTime(170,t);o.frequency.exponentialRampToValueAtTime(52,t+.75);f.type='lowpass';f.frequency.value=520;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.09,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.85);
  o.connect(f).connect(g).connect(Sound.out(c));o.start(t);o.stop(t+.9);
};

/* ---- holo foil: rainbow sheen + glitter follow the pointer (or device tilt); hovered card tilts in 3D ---- */
function holoAt(px,py,tilt){
  const list=S.state==='gallery'?(S.zoom?[S.zoom]:[]):S.picked;
  for(const c of list){
    if(!c.revealed&&S.state!=='gallery')continue;
    const r=c.el.getBoundingClientRect(),u=(px-r.left)/r.width,v=(py-r.top)/r.height;
    c.el.style.setProperty('--hx',(clamp(.5-u,-1.5,1.5)*30).toFixed(1)+'%');
    c.el.style.setProperty('--hy',(clamp(.5-v,-1.5,1.5)*22).toFixed(1)+'%');
    if(!c.qx){c.qx=gsap.quickTo(c.hov,'rotationY',{duration:.6,ease:EO});c.qy=gsap.quickTo(c.hov,'rotationX',{duration:.6,ease:EO})}
    const inside=tilt&&!RM()&&u>=0&&u<=1&&v>=0&&v<=1;
    if(inside){c.qx((u-.5)*20);c.qy((.5-v)*16);c.tilted=true;c.el.classList.add('hot')}
    else if(c.tilted){c.qx(0);c.qy(0);c.tilted=false;c.el.classList.remove('hot')}
  }
}
document.addEventListener('pointermove',e=>{if(S.state==='reveal'||S.state==='reading'||S.state==='gallery')holoAt(e.clientX,e.clientY,e.pointerType==='mouse')},{passive:true});
addEventListener('deviceorientation',e=>{
  if(S.lastPtr==='mouse'||e.gamma==null||(S.state!=='reveal'&&S.state!=='reading'))return;
  const u=clamp(e.gamma/50,-.7,.7),v=clamp((e.beta-45)/50,-.7,.7);
  for(const c of S.picked)if(c.revealed){c.el.style.setProperty('--hx',(-u*40).toFixed(1)+'%');c.el.style.setProperty('--hy',(-v*30).toFixed(1)+'%')}
},{passive:true});
function resetCardFx(c){gsap.killTweensOf(c.hov);c.qx=c.qy=null;c.tilted=false;c.el.classList.remove('hot');c.el.style.removeProperty('--hx');c.el.style.removeProperty('--hy')}

/* ---- constellation: gold star-lines join the spread once every card is open ---- */
let constelT=null;
function drawConstellation(fast){
  const svg=$('#constel');svg.innerHTML='';if(S.state!=='reading'||!S.picked.length)return;
  let pts=S.picked.map(c=>{const r=c.el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]}),loop=false,nodes=false;
  if(pts.length===1){                                       // single card: a ring of stars around it
    const r=S.picked[0].el.getBoundingClientRect(),[x,y]=pts[0],rx=r.width*1.05,ry=r.height*.72;
    pts=Array.from({length:7},(_,i)=>{const a=-Math.PI/2+i/7*6.283+rand(-.15,.15),k=rand(.9,1.12);return[x+Math.cos(a)*rx*k,y+Math.sin(a)*ry*k]});loop=nodes=true;
  }
  const segs=[];for(let i=0;i<pts.length-1;i++)segs.push([pts[i],pts[i+1]]);if(loop)segs.push([pts[pts.length-1],pts[0]]);
  const ns='http://www.w3.org/2000/svg',mk=(t,a)=>{const e=document.createElementNS(ns,t);for(const k in a)e.setAttribute(k,a[k]);svg.appendChild(e);return e};
  const lines=[],stars=[];
  segs.forEach(([a,b])=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]);lines.push(mk('line',{class:'cl',x1:a[0],y1:a[1],x2:b[0],y2:b[1],'stroke-dasharray':L,'stroke-dashoffset':fast?0:L}))});
  const starAt=(x,y,R)=>stars.push(mk('polygon',{class:'cs',points:starPts(x,y,R,R*.28,4)}));
  if(nodes)pts.forEach(([x,y])=>starAt(x,y,rand(5,8)));
  segs.forEach(([a,b])=>{
    const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;starAt(mx,my,rand(4,6.5));
    const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;
    for(let k=0;k<3;k++){const t=rand(.15,.85),o=rand(-16,16);
      const e=mk('circle',{class:'cd tw2',cx:a[0]+dx*t-dy/L*o,cy:a[1]+dy*t+dx/L*o,r:rand(.8,1.7)});e.style.animationDelay=rand(0,2)+'s';stars.push(e)}
  });
  if(fast||RM()){lines.forEach(l=>l.setAttribute('stroke-dashoffset',0));return}
  gsap.set(svg,{opacity:1});
  lines.forEach((l,i)=>gsap.to(l,{attr:{'stroke-dashoffset':0},duration:.65,delay:i*.16,ease:'power2.inOut'}));
  stars.forEach((s,i)=>gsap.fromTo(s,{scale:0,opacity:0,transformOrigin:'50% 50%'},{scale:1,opacity:1,duration:.5,delay:.2+i*.04,ease:'back.out(3)'}));
}
function constelRefresh(){
  const svg=$('#constel');if(!svg.childElementCount)return;
  gsap.to(svg,{opacity:0,duration:.2,overwrite:true});constelT&&constelT.kill();
  constelT=gsap.delayedCall(1.15,()=>{if(S.state==='reading'){drawConstellation(true);gsap.to(svg,{opacity:1,duration:.6,overwrite:true})}});
}
function fxReset(){
  constelT&&constelT.kill();gsap.to('#constel',{opacity:0,duration:.4,overwrite:true,onComplete:()=>{$('#constel').innerHTML=''}});
  showSave(false);S.picked.forEach(resetCardFx);
}
function readingDone(){drawConstellation(false);buzz([20,60,40]);showSave(true)}

/* ---- gold-dust trail behind the pointer / finger (canvas, runs only while dust is alive) ---- */
(function goldDust(){
  const cv=document.createElement('canvas');cv.id='dust';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
  const x=cv.getContext('2d');let W,H,ps=[],run=false,lx=null,ly=null;
  function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;x.setTransform(d,0,0,d,0,0)}
  size();addEventListener('resize',size);
  addEventListener('pointermove',e=>{
    if(RM())return;const X=e.clientX,Y=e.clientY;if(lx===null){lx=X;ly=Y;return}
    const dist=Math.hypot(X-lx,Y-ly);if(dist<4)return;const n=Math.min(4,Math.ceil(dist/14));
    for(let i=0;i<n;i++){const t=i/n;ps.push({x:lx+(X-lx)*t+rand(-3,3),y:ly+(Y-ly)*t+rand(-3,3),vx:rand(-.4,.4)+(X-lx)*.015,vy:rand(-.7,.1),
      r:rand(.6,2),life:0,max:rand(40,85),star:Math.random()<.14,c:Math.random()})}
    lx=X;ly=Y;if(ps.length>280)ps.splice(0,ps.length-280);if(!run){run=true;requestAnimationFrame(loop)}
  },{passive:true});
  addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')lx=null});
  document.addEventListener('pointerleave',()=>{lx=null});
  function loop(){
    x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter';
    for(let i=ps.length-1;i>=0;i--){
      const p=ps[i];if(++p.life>p.max){ps.splice(i,1);continue}
      p.x+=p.vx;p.y+=p.vy;p.vy+=.014;p.vx*=.97;const k=1-p.life/p.max;
      x.fillStyle=p.c<.5?'#e0914f':p.c<.85?'#d8c39a':'#ffe0b8';          // embers + ash
      x.globalAlpha=k*k*.18;x.beginPath();x.arc(p.x,p.y,p.r*3.2,0,6.283);x.fill();
      x.globalAlpha=k*k;
      if(p.star){const s=p.r*3.4*(.55+.45*Math.sin(p.life*.35));x.beginPath();x.moveTo(p.x,p.y-s);x.lineTo(p.x+s*.22,p.y-s*.22);x.lineTo(p.x+s,p.y);x.lineTo(p.x+s*.22,p.y+s*.22);
        x.lineTo(p.x,p.y+s);x.lineTo(p.x-s*.22,p.y+s*.22);x.lineTo(p.x-s,p.y);x.lineTo(p.x-s*.22,p.y-s*.22);x.closePath();x.fill()}
      else{x.beginPath();x.arc(p.x,p.y,p.r*(.4+k*.6),0,6.283);x.fill()}
    }
    x.globalAlpha=1;x.globalCompositeOperation='source-over';
    if(ps.length)requestAnimationFrame(loop);else{run=false;x.clearRect(0,0,W,H)}
  }
})();

/* ---- moon phase (Thai lunar wording, approximate) + time-of-day greeting ---- */
function moonInfo(d=new Date()){
  const SYN=29.530588853,ref=Date.UTC(2000,0,6,18,14)/864e5,age=((d.getTime()/864e5-ref)%SYN+SYN)%SYN,p=age/SYN,wax=age<SYN/2;
  const n=wax?clamp(Math.ceil(age),1,15):clamp(Math.ceil(age-SYN/2),1,15);
  const label=wax?(n>=15?'ขึ้น 15 ค่ำ · วันเพ็ญ':`ข้างขึ้น ${n} ค่ำ`):`ข้างแรม ${n} ค่ำ`;
  const r=8,c=Math.cos(2*Math.PI*p),rx=(Math.abs(c)*r).toFixed(2);
  const path=wax?`M0,${-r}A${r},${r} 0 0 1 0,${r}A${rx},${r} 0 0 ${c>0?0:1} 0,${-r}Z`:`M0,${-r}A${r},${r} 0 0 0 0,${r}A${rx},${r} 0 0 ${c<0?0:1} 0,${-r}Z`;
  return{age,p,label,path,illum:Math.round((1-c)/2*100)};
}
const moonSVG=(m,sz=16)=>`<svg class="mi" viewBox="-10 -10 20 20" width="${sz}" height="${sz}" aria-hidden="true"><circle r="8" fill="#1a2148" stroke="#d4af6a" stroke-width=".8"/><path d="${m.path}" fill="#f2d48a"/></svg>`;
function greeting(d=new Date()){const h=d.getHours();return h>=5&&h<11?'อรุณสวัสดิ์':h>=11&&h<16?'สวัสดียามบ่าย':h>=16&&h<19?'สวัสดียามเย็น':'ราตรีสวัสดิ์'}
(function moonUI(){
  const m=moonInfo(),h=new Date().getHours(),when=(h>=19||h<5)?'คืนนี้':'วันนี้';
  const pill=document.createElement('span');pill.className='btn small moonp';pill.id='moonPill';pill.setAttribute('role','img');
  pill.setAttribute('aria-label',`${when}${m.label} (ดวงจันทร์สว่าง ${m.illum}%)`);pill.title=`${when}${m.label} · สว่าง ${m.illum}% (โดยประมาณ)`;
  pill.innerHTML=`${moonSVG(m)}<span class="tx">${m.label}</span>`;$('#hud').prepend(pill);
  const tg=$('#tagline');tg.insertAdjacentHTML('afterbegin',`<small class="greet">${greeting()} · ${when}${m.label} ${moonSVG(m,14)}</small>`);
})();

/* ---- typewriter: reading text appears grapheme by grapheme like gold ink (Thai-safe) ---- */
const GSEG=(typeof Intl!=='undefined'&&Intl.Segmenter)?new Intl.Segmenter('th',{granularity:'grapheme'}):null;
function typeIn(p,delay=0){
  if(!p||RM()||!GSEG||!p.textContent)return null;
  const txt=p.textContent,gs=[...GSEG.segment(txt)].map(s=>s.segment);
  p.innerHTML=gs.map(g=>`<span class="ink">${esc(g)}</span>`).join('');
  const dt=clamp(2.6/gs.length,.006,.022);
  const tw=gsap.to(p.children,{opacity:1,duration:.35,ease:'none',stagger:dt,delay,onComplete:()=>{p.textContent=txt}});
  p.closest('.rcard')?.addEventListener('click',()=>tw.progress(1),{once:true});
  return tw;
}
function inkReading(el,delay){
  if(RM())return;
  const tw=typeIn(el.querySelector('.rd-text'),delay),kws=el.querySelectorAll('.kws li');
  if(kws.length)gsap.fromTo(kws,{opacity:0,scale:.6},{opacity:1,scale:1,duration:.45,stagger:.07,delay:delay-.1,ease:'back.out(2.4)'});
  const notes=el.querySelectorAll('.notes>div,.sum-chips span');
  if(notes.length)gsap.fromTo(notes,{opacity:0,y:8},{opacity:1,y:0,duration:.5,stagger:.12,ease:EO,delay:tw?delay+tw.duration()*.55:delay});
}

/* ---- save the reading as a PNG (share sheet on phones, download on desktop) ---- */
function showSave(on){const b=$('#btnSave');if(!b)return;b.hidden=!on;if(on&&!RM())gsap.fromTo(b,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.5,ease:'back.out(2)'})}
let FACE_CSS=null;
function faceCSS(){
  if(FACE_CSS!==null)return FACE_CSS;let out='';
  for(const ss of document.styleSheets){let rs;try{rs=ss.cssRules}catch(e){continue}for(const r of rs)if(r.selectorText&&r.selectorText.includes('.cardsvg'))out+=r.cssText}
  return FACE_CSS=out;
}
async function cardImage(c){
  if(location.protocol!=='file:'&&await CardImages.probe(c.id)){try{const im=new Image();im.src=`cards/${c.id}.webp`;await im.decode();return{im,svg:false}}catch(e){}}
  const s=cardFaceSVG(c).replace(/<text[^>]*class="(?:num|en|th)"[^>]*>[\s\S]*?<\/text>/g,'')
    .replace('<svg class="cardsvg"','<svg width="560" height="960" class="cardsvg"').replace(/(<svg[^>]*>)/,`$1<style>${faceCSS()}</style>`);
  const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);await im.decode();return{im,svg:true};
}
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
function diamond(x,X,Y,s){x.beginPath();x.moveTo(X,Y-s);x.lineTo(X+s,Y);x.lineTo(X,Y+s);x.lineTo(X-s,Y);x.closePath();x.fill()}
const setLS=(x,v)=>{if('letterSpacing' in x)x.letterSpacing=v};
const WSEG=(typeof Intl!=='undefined'&&Intl.Segmenter)?new Intl.Segmenter('th',{granularity:'word'}):null;
function wrapLines(x,text,maxW){
  const parts=WSEG?[...WSEG.segment(text)].map(s=>s.segment):[...text],out=[];let cur='';
  for(const p of parts){const t=cur+p;if(x.measureText(t).width>maxW&&cur){out.push(cur.trimEnd());cur=p.trimStart()}else cur=t}
  if(cur)out.push(cur);return out;
}
function drawCardPNG(x,c,img,X,Y,w,h){
  x.save();x.translate(X+w/2,Y+h/2);if(c.reversed)x.rotate(Math.PI);
  x.shadowColor='rgba(242,212,138,.55)';x.shadowBlur=30;x.fillStyle='#0f1733';rr(x,-w/2,-h/2,w,h,w*.05);x.fill();x.shadowBlur=0;
  x.save();rr(x,-w/2,-h/2,w,h,w*.05);x.clip();x.drawImage(img.im,-w/2,-h/2,w,h);
  if(img.svg){                                            // card-face labels drawn with the page's web fonts
    const k=w/280,t=(s,yy,sz,fam,col,maxW)=>{x.font=`400 ${sz*k}px ${fam}`;const m=x.measureText(s).width;if(maxW&&m>maxW*k)x.font=`400 ${sz*k*maxW*k/m}px ${fam}`;
      x.fillStyle=col;x.textAlign='center';x.textBaseline='alphabetic';x.fillText(s,0,-h/2+yy*k)};
    t(c.numeral,52,c.numeral.length>5?15:22,'Cinzel,serif','#f2d48a');
    t(c.name,413,16.5,'Cinzel,serif','#f2d48a',250);
    t(c.th,440,15,"'Noto Serif Thai',serif",'#d4af6a',250);
  }else{                                                  // painted art: same frame + banner as cardOverlaySVG
    const k=w/280,L=-w/2,T=-h/2,Y=v=>T+v*k;
    let g=x.createLinearGradient(0,Y(350),0,Y(480));g.addColorStop(0,'rgba(5,7,15,0)');g.addColorStop(.38,'rgba(5,7,15,.86)');g.addColorStop(1,'rgba(5,7,15,.96)');x.fillStyle=g;x.fillRect(L,Y(350),w,130*k);
    g=x.createLinearGradient(0,Y(0),0,Y(80));g.addColorStop(0,'rgba(5,7,15,.7)');g.addColorStop(1,'rgba(5,7,15,0)');x.fillStyle=g;x.fillRect(L,T,w,80*k);
    x.strokeStyle='#d4af6a';x.lineWidth=3*k;rr(x,L+7*k,T+7*k,266*k,466*k,13*k);x.stroke();
    x.globalAlpha=.6;x.lineWidth=k;rr(x,L+16*k,T+16*k,248*k,448*k,8*k);x.stroke();x.globalAlpha=1;
    x.fillStyle='#f2d48a';[[16,16],[264,16],[16,464],[264,464]].forEach(([a,b])=>diamond(x,L+a*k,T+b*k,6*k));
    const num=c.numeral,pw=Math.max(46,num.length*11+22);
    x.fillStyle='rgba(11,16,40,.82)';rr(x,L+(140-pw/2)*k,T+22*k,pw*k,27*k,4*k);x.fill();x.strokeStyle='rgba(212,175,106,.8)';x.lineWidth=k;x.stroke();
    const t=(s,yy,sz,fam,col,maxW)=>{x.font=`400 ${sz*k}px ${fam}`;const m=x.measureText(s).width;if(maxW&&m>maxW*k)x.font=`400 ${sz*k*maxW*k/m}px ${fam}`;
      x.fillStyle=col;x.textAlign='center';x.textBaseline='alphabetic';x.fillText(s,0,Y(yy))};
    t(num,41-(num.length>4?2:0),num.length>4?13:17,'Cinzel,serif','#f2d48a');
    x.strokeStyle='rgba(212,175,106,.65)';x.lineWidth=k;x.beginPath();x.moveTo(L+52*k,Y(408));x.lineTo(L+128*k,Y(408));x.moveTo(L+152*k,Y(408));x.lineTo(L+228*k,Y(408));x.stroke();
    x.fillStyle='#f2d48a';diamond(x,0,Y(408),5*k);
    t(c.name,434,c.name.length>17?13.5:c.name.length>13?15:16.5,'Cinzel,serif','#f2d48a',250);
    t(c.th,456,15,"'Noto Serif Thai',serif",'#d4af6a',250);
  }
  x.restore();x.restore();
}
function paintReading(x,W,H,cs,imgs,dry){
  const sp=SPREADS[S.spreadKey],pad=64,inner=W-pad*2,mi=moonInfo(),n=cs.length,TH="'Noto Serif Thai',serif",CZ='Cinzel,serif',F=(w,s,f)=>`${w} ${s}px ${f}`;
  x.textAlign='center';x.textBaseline='alphabetic';
  if(!dry){
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a245a');g.addColorStop(.5,'#0f1638');g.addColorStop(1,'#0a0e24');x.fillStyle=g;x.fillRect(0,0,W,H);
    const rg=x.createRadialGradient(W/2,380,0,W/2,380,W*.85);rg.addColorStop(0,'rgba(242,212,138,.12)');rg.addColorStop(1,'rgba(242,212,138,0)');x.fillStyle=rg;x.fillRect(0,0,W,H);
    for(let i=0,N=Math.round(W*H/3600);i<N;i++){x.globalAlpha=rand(.2,.9);x.fillStyle=Math.random()<.25?'#f2d48a':'#cfd8ff';x.beginPath();x.arc(rand(0,W),rand(0,H),rand(.3,1.5),0,6.283);x.fill()}
    x.globalAlpha=1;x.strokeStyle='rgba(212,175,106,.85)';x.lineWidth=2;rr(x,22,22,W-44,H-44,18);x.stroke();
    x.strokeStyle='rgba(212,175,106,.4)';x.lineWidth=1;rr(x,34,34,W-68,H-68,12);x.stroke();
    x.fillStyle='#f2d48a';[[22,H/2],[W-22,H/2],[W/2,22],[W/2,H-22]].forEach(([a,b])=>diamond(x,a,b,8));
  }
  let y=128;
  if(!dry){x.font=F(600,76,CZ);setLS(x,'14px');const tg=x.createLinearGradient(0,y-70,0,y);tg.addColorStop(0,'#fff1c4');tg.addColorStop(1,'#c9a05a');
    x.fillStyle=tg;x.shadowColor='rgba(242,212,138,.55)';x.shadowBlur=24;x.fillText('ARCANA',W/2+7,y);x.shadowBlur=0;setLS(x,'0px')}
  y+=50;if(!dry){x.font=F(400,23,TH);x.fillStyle='#b3aea0';x.fillText(`${sp.name} · ${new Date().toLocaleDateString('th-TH',{dateStyle:'long'})} · ${mi.label}`,W/2,y)}
  if(S.question){x.font=F(400,28,TH);y+=14;for(const l of wrapLines(x,`“${S.question}”`,inner-80)){y+=44;if(!dry){x.fillStyle='#f2d48a';x.fillText(l,W/2,y)}}}
  y+=34;if(!dry){x.strokeStyle='rgba(212,175,106,.45)';x.lineWidth=1;x.beginPath();x.moveTo(W/2-220,y);x.lineTo(W/2+220,y);x.stroke();x.fillStyle='#f2d48a';diamond(x,W/2,y,5)}
  y+=46;
  const cfg=n===1?{cols:1,cw:330,gap:0,fs:1.05}:n<=3?{cols:3,cw:272,gap:46,fs:1}:{cols:5,cw:172,gap:24,fs:.8},ch=cfg.cw*12/7,rows=Math.ceil(n/cfg.cols);
  for(let r=0;r<rows;r++){
    const row=cs.slice(r*cfg.cols,(r+1)*cfg.cols),rw=row.length*cfg.cw+(row.length-1)*cfg.gap,x0=(W-rw)/2;let lab=0;
    row.forEach((c,k)=>{
      const i=r*cfg.cols+k,cx=x0+k*(cfg.cw+cfg.gap),mid=cx+cfg.cw/2,colW=cfg.cw+cfg.gap-10,P=sp.pos[i];
      if(!dry)drawCardPNG(x,c,imgs[i],cx,y,cfg.cw,ch);
      let ly=y+ch+34*cfg.fs;x.textAlign='center';
      x.font=F(400,Math.round(19*cfg.fs),TH);wrapLines(x,`${i+1} · ${P.full}`,colW).slice(0,2).forEach(l=>{if(!dry){x.fillStyle='#d4af6a';x.fillText(l,mid,ly)}ly+=27*cfg.fs});
      ly+=6*cfg.fs;x.font=F(600,Math.round(23*cfg.fs),TH);wrapLines(x,c.th,colW).slice(0,2).forEach(l=>{if(!dry){x.fillStyle='#efe8d4';x.fillText(l,mid,ly)}ly+=31*cfg.fs});
      x.font=F(400,Math.round(17*cfg.fs),TH);if(!dry){x.fillStyle=c.reversed?'#f0b9b9':'#b3aea0';x.fillText(c.reversed?'▼ กลับหัว':'▲ ตั้งตรง',mid,ly)}
      lab=Math.max(lab,ly+12-(y+ch));
    });
    y+=ch+lab+(r<rows-1?34:24);
  }
  y+=26;const bx=pad+8,bw=inner-16;x.font=F(400,26,TH);const sl=wrapLines(x,buildSummary().join('. ')+'.',bw-68),bh=104+sl.length*46+64;
  if(!dry){
    x.fillStyle='rgba(212,175,106,.09)';rr(x,bx,y,bw,bh,22);x.fill();x.strokeStyle='rgba(242,212,138,.6)';x.lineWidth=1.5;x.stroke();
    x.font=F(600,30,TH);x.fillStyle='#f2d48a';x.textAlign='center';x.fillText('ภาพรวมของการเปิดไพ่',W/2,y+58);
    x.font=F(400,26,TH);x.fillStyle='#efe8d4';x.textAlign='left';sl.forEach((l,i)=>x.fillText(l,bx+34,y+112+i*46));x.textAlign='center';
    const majors=cs.filter(c=>c.arcana==='major').length,cnt={};cs.forEach(c=>{if(c.suit)cnt[c.suit]=(cnt[c.suit]||0)+1});
    x.font=F(400,20,TH);x.fillStyle='#d4af6a';x.fillText([`ไพ่ใบใหญ่ ${majors}`,...Object.entries(cnt).map(([s,k])=>`${SUITS[s].th} ${k}`),`กลับหัว ${cs.filter(c=>c.reversed).length}`].join('  ·  '),W/2,y+bh-30);
  }
  y+=bh+54;
  if(!dry){x.strokeStyle='rgba(212,175,106,.5)';x.lineWidth=1;x.beginPath();x.moveTo(W/2-200,y);x.lineTo(W/2-16,y);x.moveTo(W/2+16,y);x.lineTo(W/2+200,y);x.stroke();
    x.fillStyle='#f2d48a';diamond(x,W/2,y,6);x.font=F(400,18,CZ);setLS(x,'5px');x.fillStyle='#8f8b7d';x.fillText('ARCANA · TAROT',W/2+2,y+38);setLS(x,'0px')}
  return Math.ceil(y+86);
}
async function saveReading(){
  const btn=$('#btnSave');if(btn.disabled||!S.picked.length)return;btn.disabled=true;const old=btn.innerHTML;btn.textContent='กำลังสร้าง…';
  try{
    await Promise.all([document.fonts.load("600 76px Cinzel"),document.fonts.load("400 20px Cinzel"),document.fonts.load("400 26px 'Noto Serif Thai'",'ก'),document.fonts.load("600 26px 'Noto Serif Thai'",'ก')]).catch(()=>{});
    const cs=S.picked.slice(),imgs=await Promise.all(cs.map(cardImage)),W=1080;
    const H=paintReading(document.createElement('canvas').getContext('2d'),W,0,cs,imgs,true);
    const cv=document.createElement('canvas');cv.width=W;cv.height=H;paintReading(cv.getContext('2d'),W,H,cs,imgs,false);
    const blob=await new Promise((res,rej)=>cv.toBlob(b=>b?res(b):rej(new Error('toBlob failed')),'image/png'));
    const name=`arcana-${new Date().toISOString().slice(0,10)}.png`,file=new File([blob],name,{type:'image/png'});
    let shared=false;
    if(S.lastPtr!=='mouse'&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'ARCANA · ไพ่ทาโรต์'});shared=true}catch(e){shared=e&&e.name==='AbortError'}}
    if(!shared){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}
    btn.textContent='บันทึกแล้ว ✓';
  }catch(e){console.error(e);btn.textContent='บันทึกไม่สำเร็จ'}
  setTimeout(()=>{btn.innerHTML=old;btn.disabled=false},1800);
}
$('#btnSave').addEventListener('click',saveReading);
