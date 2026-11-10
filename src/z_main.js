/* ======================================================================
   SECTION 4 · UTILITIES, STATE, STAR FIELD, SOUND
   ====================================================================== */
gsap.registerPlugin(Flip);
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
/* Motion: follows the OS "reduce motion" setting unless the visitor chose otherwise (saved per browser).
   Windows with "Animation effects" off reports reduce → every effect was silently skipped, so the page
   offers a visible switch (intro notice + HUD button). ?motion=full forces full motion. */
const OS_RM=matchMedia('(prefers-reduced-motion: reduce)');
let MOTION=(()=>{if(/[?&]motion=full/.test(location.search))return'full';try{return localStorage.getItem('arcana-motion')}catch(e){return null}})();
const RM = ()=>MOTION==='full'?false:MOTION==='reduced'?true:OS_RM.matches;
function setMotion(m){MOTION=m;try{localStorage.setItem('arcana-motion',m)}catch(e){}document.documentElement.classList.toggle('mfull',!RM());syncMotionUI()}
function syncMotionUI(){const b=document.getElementById('btnMotion');if(!b)return;const on=!RM();
  b.querySelector('.tx').textContent='เอฟเฟกต์: '+(on?'เต็ม':'ลด');b.setAttribute('aria-pressed',on);b.setAttribute('aria-label','เอฟเฟกต์ภาพเคลื่อนไหว: '+(on?'เต็ม':'ลด'))}
document.documentElement.classList.toggle('mfull',!RM());
const rand = (a,b)=>a+Math.random()*(b-a);
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const wait = s => new Promise(r=>gsap.delayedCall(RM()?Math.min(s,.05):s,r));
const tlUntil = (tl,t) => new Promise(r=>tl.add(r,t));
const tlDone = tl => new Promise(r=>{ if(!tl||tl.duration()===0) r(); else tl.eventCallback('onComplete',r); });
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const EO='power3.out', EI='power3.in', EIO='power3.inOut', BIG='expo.inOut', BIGO='expo.out';   // one easing family
const POSE0={x:0,y:0,z:0,rotation:0,rotationX:0,rotationY:0,scale:1};
const pose = o => ({...POSE0,...o});
const readPose = el => { const g=k=>+gsap.getProperty(el,k); return {x:g('x'),y:g('y'),z:g('z'),rotation:g('rotation'),rotationX:g('rotationX'),rotationY:g('rotationY'),scale:g('scale')}; };

const S = {
  state:'intro', busy:false, spreadKey:'three', question:'', shuffles:4,
  deck:[], fan:[], picked:[], rest:[], pan:0, dock:'hidden', summary:false, lastPtr:'mouse', armed:null,
  L:null, pendingResize:false, rcards:[], padOn:[], dragging:false
};
const STAR = {boost:0, warp:0, px:0, py:0};
const PAR  = {amp:1};

/* ---- star field: twinkle, drift, pointer parallax, hyperspace warp ---- */
(function starField(){
  const c=$('#stars'),x=c.getContext('2d');let W,H,st=[];
  function size(){
    const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;x.setTransform(d,0,0,d,0,0);
    // ash and embers: grey flecks drifting up, a few glowing embers among them
    st=Array.from({length:Math.round(W*H/6500)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.35,vx:(Math.random()-.5)*.08,
      vy:-(Math.random()*.22+.05),p:Math.random()*6.28,s:Math.random()*1.6+.5,g:Math.random()<.16}));
    draw(performance.now());
  }
  function draw(t){
    x.clearRect(0,0,W,H);const cx=W/2,cy=H/2,wp=STAR.warp;
    for(const s of st){
      const tw=RM()?.55:(s.g?.35+.65*(.5+.5*Math.sin(t/260*s.s+s.p)):.25+.4*(.5+.5*Math.sin(t/1400*s.s+s.p)));
      x.globalAlpha=Math.min(1,tw*(s.g?.95:.6)+STAR.boost*.5+wp*.3);x.fillStyle=x.strokeStyle=s.g?'#e08a45':'#8f897e';
      if(s.g&&wp<=.02){const a=x.globalAlpha;x.globalAlpha=a*.18;x.beginPath();x.arc(s.x-STAR.px*28*s.r,s.y-STAR.py*18*s.r,s.r*4,0,6.283);x.fill();x.globalAlpha=a}
      const px=s.x-STAR.px*28*s.r,py=s.y-STAR.py*18*s.r;
      if(wp>.02){
        const dx=s.x-cx,dy=s.y-cy,k=wp*.045;
        s.x+=dx*k;s.y+=dy*k;
        x.lineWidth=s.r;x.beginPath();x.moveTo(px,py);x.lineTo(px-dx*k*3,py-dy*k*3);x.stroke();
        if(s.x<-20||s.x>W+20||s.y<-20||s.y>H+20){s.x=cx+rand(-80,80);s.y=cy+rand(-60,60)}
      }else{
        x.beginPath();x.arc(px,py,s.r*(1+STAR.boost*.9),0,6.283);x.fill();
        if(!RM()){s.x+=s.vx+Math.sin(t/2200+s.p)*.06;s.y+=s.vy;if(s.x>W+3)s.x=-3;if(s.x<-3)s.x=W+3;if(s.y<-3)s.y=H+3;if(s.y>H+3)s.y=-3;}
      }
    }
    meteors(t,wp);
  }
  /* shooting stars: one every 4–12 s, gold-white head with a fading tail */
  let ms=[],nextM=3500;
  function meteors(t,wp){
    if(RM()){ms=[];return}
    if(wp<.02&&t>nextM){nextM=t+rand(9000,20000);                 /* rare falling cinders */const a=Math.PI/2+rand(.65,1.05)*(Math.random()<.5?1:-1),sp=rand(9,14);
      ms.push({x:rand(W*.15,W*.85),y:rand(-20,H*.35),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,len:rand(120,230),life:0,max:rand(45,70)});}
    for(let i=ms.length-1;i>=0;i--){
      const m=ms[i];if(++m.life>m.max){ms.splice(i,1);continue}
      const al=Math.sin(Math.PI*m.life/m.max),vx=m.vx,vy=m.vy;m.x+=vx;m.y+=vy;
      const n=Math.hypot(vx,vy),tx=m.x-vx/n*m.len,ty=m.y-vy/n*m.len,g=x.createLinearGradient(m.x,m.y,tx,ty);
      g.addColorStop(0,`rgba(255,214,160,${al*.9})`);g.addColorStop(.25,`rgba(217,120,58,${al*.45})`);g.addColorStop(1,'rgba(217,120,58,0)');
      x.globalAlpha=1;x.strokeStyle=g;x.lineWidth=1.8;x.lineCap='round';x.beginPath();x.moveTo(m.x,m.y);x.lineTo(tx,ty);x.stroke();
      x.globalAlpha=al*.35;x.fillStyle='#ffd2a0';x.beginPath();x.arc(m.x,m.y,4,0,6.283);x.fill();x.globalAlpha=al;x.beginPath();x.arc(m.x,m.y,1.4,0,6.283);x.fill();
    }
    x.globalAlpha=1;
  }
  (function loop(t){if(!RM()||STAR.boost>0)draw(t);requestAnimationFrame(loop);})(0);
  addEventListener('resize',size);size();
})();

/* ---- synthesized sound (created only after the user presses the sound button) ---- */
const Sound = {
  ctx:null,on:false,buf:null,vol:null,
  v:(()=>{try{const s=parseFloat(localStorage.getItem('arcana-vol'));return isFinite(s)?clamp(s,0,1):.7}catch(e){return .7}})(),
  out(c){if(!this.vol){this.vol=c.createGain();this.vol.gain.value=this.v*this.v;this.vol.connect(c.destination)}return this.vol},   // master volume
  setVol(v){this.v=clamp(v,0,1);try{localStorage.setItem('arcana-vol',this.v.toFixed(2))}catch(e){}
    if(this.vol)this.vol.gain.setTargetAtTime(this.v*this.v,this.ctx.currentTime,.05)},
  toggle(){
    this.on=!this.on;
    if(this.on){
      if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){this.on=false;return}this.ctx=new AC();
        const n=this.ctx.sampleRate*.5,b=this.ctx.createBuffer(1,n,this.ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;this.buf=b;}
      this.ctx.resume();this.click(0,.25,2800);
    }
    $('#btnSound .tx').textContent='เสียง: '+(this.on?'เปิด':'ปิด');$('#btnSound').setAttribute('aria-label','เสียง: '+(this.on?'เปิด':'ปิด'));$('#btnSound').setAttribute('aria-pressed',this.on);
  },
  click(at,gain=.18,freq=3200,dur=.035){
    if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime+at;
    const s=c.createBufferSource();s.buffer=this.buf;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=freq*(.8+Math.random()*.4);f.Q.value=.9;
    const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    s.connect(f).connect(g).connect(Sound.out(c));s.start(t,Math.random()*.3);s.stop(t+dur+.02);
  },
  shuffle(kind){
    if(!this.on)return;
    if(kind==='riffle')for(let i=0;i<34;i++)this.click(.5+i*(.026-i*.0004),.12+Math.random()*.06,3400);
    else if(kind==='overhand')for(let p=0;p<6;p++)for(let i=0;i<4;i++)this.click(.05+p*.27+i*.03,.14,2600);
    else{this.click(.2,.3,900,.07);this.click(.8,.3,900,.07);this.click(1.15,.3,900,.07);this.click(.45,.12,3000)}
  },
  whoosh(){if(!this.on)return;for(let i=0;i<8;i++)this.click(i*.05,.05,900+i*300,.08)},
  flip(){if(!this.on)return;this.click(0,.2,1800,.12);this.click(.55,.14,3600,.09)},
  chime(){
    if(!this.on||!this.ctx)return;const c=this.ctx,t=c.currentTime;
    [1318,1760,2093,2637].forEach((fq,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=fq;
      g.gain.setValueAtTime(.0001,t+i*.07);g.gain.exponentialRampToValueAtTime(.05,t+i*.07+.02);g.gain.exponentialRampToValueAtTime(.0001,t+i*.07+.9);
      o.connect(g).connect(Sound.out(c));o.start(t+i*.07);o.stop(t+i*.07+1)});
  }
};

/* ======================================================================
   SECTION 5 · READING LOGIC (meaning lookup, text builders, spread summary)
   ====================================================================== */
function getMeaning(card){
  return MEANINGS[card.id] || {ku:['—'],kr:['—'],u:'ยังไม่มีคำทำนายสำหรับไพ่ใบนี้',r:'ยังไม่มีคำทำนายสำหรับไพ่ใบนี้',l:['—','—'],c:['—','—'],f:['—','—']};
}
const kwOf   = c => (c.reversed?getMeaning(c).kr:getMeaning(c).ku);
const noteOf = (c,k) => getMeaning(c)[k][c.reversed?1:0];
const oriTh  = c => c.reversed?'กลับหัว':'ตั้งตรง';

function readingHTML(card,idx){
  const m=getMeaning(card),pos=SPREADS[S.spreadKey].pos[idx];
  return `<div class="rd-pos">ตำแหน่งที่ ${idx+1} · ${pos.full}</div>
    <h3 class="rd-h">${card.name}<small>${card.th}</small></h3>
    <span class="ori ${card.reversed?'r':''}">${card.reversed?'ไพ่กลับหัว':'ไพ่ตั้งตรง'}</span>
    <ul class="kws">${kwOf(card).map(k=>`<li>${k}</li>`).join('')}</ul>
    <p class="rd-text">${pos.lead} ${card.reversed?m.r:m.u}</p>
    <dl class="notes">
      <div><dt>ความรัก</dt><dd>${noteOf(card,'l')}</dd></div>
      <div><dt>การงาน</dt><dd>${noteOf(card,'c')}</dd></div>
      <div><dt>การเงิน</dt><dd>${noteOf(card,'f')}</dd></div>
    </dl>`;
}
/* Spread summary: 3–4 coherent sentences from keywords + positions + suit/Major patterns */
function buildSummary(){
  const cs=S.picked,n=cs.length,key=S.spreadKey;
  const kw=(c,k=2)=>kwOf(c).slice(0,k);
  const list=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' และ '+a[a.length-1];
  const majors=cs.filter(c=>c.arcana==='major').length;
  const cnt={};cs.forEach(c=>{if(c.suit)cnt[c.suit]=(cnt[c.suit]||0)+1});
  const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0];
  const revN=cs.filter(c=>c.reversed).length,courts=cs.filter(c=>c.court).length;
  const dom=top&&top[1]>=2?{s:top[0],k:top[1]}:null,out=[];
  if(n===1){const c=cs[0];out.push(`ไพ่ ${c.name} (${c.th}) ในท่า${oriTh(c)} ชี้ไปที่เรื่อง${list(kw(c,3))}${c.arcana==='major'?' ซึ่งเป็นไพ่ใบใหญ่ที่สะท้อนบทเรียนสำคัญของชีวิต':''}`);}
  else if(majors>=Math.ceil(n/2)){out.push(`ไพ่ใบใหญ่ (Major Arcana) ปรากฏถึง ${majors} จาก ${n} ใบ แสดงว่าเรื่องนี้เกี่ยวพันกับจุดเปลี่ยนและบทเรียนใหญ่ของชีวิต ไม่ใช่เพียงเหตุการณ์ผ่านมาผ่านไป${dom?` และไพ่ชุด${SUITS[dom.s].th}ที่ซ้ำ ${dom.k} ใบก็เน้นเรื่อง${SUITS[dom.s].theme}`:''}`);}
  else if(dom){out.push(`ไพ่ชุด${SUITS[dom.s].th} (${SUITS[dom.s].en}) ปรากฏซ้ำ ${dom.k} ใบ น้ำหนักของเรื่องนี้จึงอยู่ที่${SUITS[dom.s].theme}${majors?` โดยมีไพ่ใบใหญ่ ${majors} ใบเป็นตัวเน้นจุดเปลี่ยน`:''}`);}
  else{out.push(`ไพ่กระจายอยู่หลายชุด${majors?` และมีไพ่ใบใหญ่ ${majors} ใบ`:''} สะท้อนว่าเรื่องนี้มีหลายมิติที่ต้องมองรอบด้านก่อนตัดสินใจ`);}
  if(key==='one'){const c=cs[0];out.push(`ด้านความรัก ${noteOf(c,'l')} ด้านการงาน ${noteOf(c,'c')} และด้านการเงิน ${noteOf(c,'f')}`);}
  else if(key==='three'){out.push(`เรื่องราวเดินทางจากอดีตที่เกี่ยวกับ${list(kw(cs[0]))} มาสู่ปัจจุบันที่เน้น${list(kw(cs[1]))} และกำลังมุ่งสู่${list(kw(cs[2]))}`);}
  else{out.push(`ตอนนี้แก่นของสถานการณ์คือ${list(kw(cs[0]))} โดยมีอุปสรรคเป็น${list(kw(cs[1]))} รากเหง้าของเรื่องมาจาก${list(kw(cs[2]))} และเป้าหมายในใจคือ${list(kw(cs[4]))}`);}
  if(key==='one')out.push(cs[0].reversed?'เพราะไพ่กลับหัว พลังนี้ยังติดขัดหรือถูกเก็บกดไว้ ควรทบทวนความรู้สึกและแผนของตัวเองก่อนก้าวต่อ':'เพราะไพ่ตั้งตรง พลังนี้ไหลได้เต็มที่ เป็นสัญญาณให้เชื่อสัญชาตญาณและลงมือตามทิศทางที่เห็น');
  else if(key==='three')out.push(cs[2].reversed?'ไพ่อนาคตมาในท่ากลับหัว จึงยังมีสิ่งติดขัดที่ต้องคลี่คลายก่อนจะถึงจุดหมาย':'ไพ่อนาคตมาในท่าตั้งตรง ทิศทางข้างหน้าจึงค่อนข้างชัดเจนและเปิดทางให้ก้าวไป');
  else out.push(`ผลลัพธ์ที่มีแนวโน้มคือ${list(kw(cs[9]))}${cs[9].reversed?' แต่เพราะไพ่กลับหัว ทิศทางยังปรับได้ถ้าจัดการสิ่งที่ค้างคาอยู่':' ซึ่งสอดคล้องกับทิศทางที่กำลังเดินอยู่'}`);
  let adv;
  if(n===1)adv=courts?'ไพ่ราชสำนักใบนี้ยังบอกด้วยว่ามีบุคคลหรือบทบาทสำคัญที่ส่งผลต่อเรื่องนี้':'ขอให้ใช้ข้อความของไพ่ใบนี้เป็นเข็มทิศ ไม่ใช่คำตัดสินตายตัว เพราะทางเลือกยังอยู่ในมือคุณ';
  else if(revN===0)adv='ไพ่ทุกใบตั้งตรง พลังจึงไหลได้ดี เชื่อมั่นในสัญชาตญาณแล้วลงมือตามที่ใจเห็นชอบได้';
  else if(revN>=Math.ceil(n/2))adv=`ไพ่กลับหัวมีถึง ${revN} จาก ${n} ใบ ควรชะลอและทบทวนสิ่งที่ติดขัดภายในก่อนตัดสินใจเรื่องใหญ่`;
  else adv=`มีไพ่กลับหัว ${revN} ใบ เป็นจุดที่ควรใส่ใจเป็นพิเศษ ส่วนไพ่ที่เหลือเป็นแรงหนุนให้ก้าวต่อไปได้`;
  if(n>1&&courts>=2)adv+=` นอกจากนี้ไพ่ราชสำนัก ${courts} ใบบ่งว่ามีผู้คนหรือบทบาทสำคัญหลายคนเข้ามาเกี่ยวข้อง`;
  out.push(adv);return out;
}
function summaryHTML(){
  const cs=S.picked,majors=cs.filter(c=>c.arcana==='major').length,revN=cs.filter(c=>c.reversed).length;
  const cnt={};cs.forEach(c=>{if(c.suit)cnt[c.suit]=(cnt[c.suit]||0)+1});
  return `<div class="rd-pos">สรุปคำทำนาย · ${SPREADS[S.spreadKey].name}</div><h3 class="rd-h">ภาพรวมของการเปิดไพ่</h3>
    ${S.question?`<p class="sum-q">“${esc(S.question)}”</p>`:''}<p class="rd-text">${buildSummary().join(' ')}</p>
    <div class="sum-chips"><span>ไพ่ใบใหญ่ ${majors}</span>${Object.entries(cnt).map(([s,k])=>`<span>${SUITS[s].th} ${k}</span>`).join('')}<span>กลับหัว ${revN}</span></div>`;
}

/* ======================================================================
   SECTION 6 · 3D LAYOUT ENGINE — every pose {x,y,z,rotation,rotationX,rotationY,scale}
   for every state comes from here (relative to the viewport centre, table plane z=0)
   ====================================================================== */
const TILT ={intro:0,gather:30,setup:30,shuffle:36,pick:0,reveal:0,reading:0,gallery:0};
const DOLLY={shuffle:90};
const PARAMP={pick:0,reveal:.45,reading:.45,gallery:.2};   // pick: camera holds still so the card under the pointer never drifts
const INFO_W=()=>Math.min(400,innerWidth*.36),INFO_H=()=>Math.min(innerHeight*.46,400);   // gallery info panel
function computeLayout(){
  const W=innerWidth,H=innerHeight,wide=W>=900&&W/H>=1.15;
  const cw=clamp(Math.min(H*.17,W*.26),58,118),ch=cw*12/7,row=W<720;
  const L={W,H,wide,row,cw,ch,hdr:56,corner:.4};
  L.px=Math.round(clamp(Math.min(H*.36,W*.42),cw,300));        // layout width of card art (largest size a card is shown at)
  L.dockW=Math.min(400,W*.36);L.dockH=Math.min(H*(S.spreadKey==='celtic'?.34:.4),340);
  // setup deck: centred in the space between the header and the deck hint above the setup panel,
  // shrunk when that space is short (phones with browser bars). The camera is tilted 30° here, so a
  // screen offset maps to world y / cos30.
  const sp=document.getElementById('setup'),pH=sp?sp.offsetHeight:380,y0=56+8,y1=H-pH-14-44,deckH=ch*.87+22;
  L.deckSetup={x:0,y:((y0+y1)/2-H/2)/.866,sc:clamp((y1-y0-8)/deckH,.5,1)};L.hintTop=y1-2;
  L.deckRoom=Math.max(0,((y1-y0)-deckH*L.deckSetup.sc)/2);          // free screen space above the deck
  L.deckShuffle={x:0,y:-H*.03};
  L.Hf=row?ch+80:Math.min(H*.42,420);L.step=clamp(cw*.36,24,40);
  return L;
}
const TH=.45;                                                   // deck thickness per card (px of z)
const stackPose=(i,b,sc=b.sc||1)=>pose({x:b.x,y:b.y,z:i*TH*sc,scale:sc});
function cornerPose(k){
  const L=S.L,sc=L.corner,ext=!L.wide?(S.dock==='open'?L.dockH:S.dock==='peek'?44:0):0;
  return pose({x:-L.W/2+16+L.cw*sc/2,y:L.H/2-ext-16-L.ch*sc/2,z:k*.3,scale:sc});
}
function offPose(c){const L=S.L,R=Math.hypot(L.W,L.H)*.7;return pose({x:Math.cos(c.a0)*R,y:Math.sin(c.a0)*R,z:c.zf,rotation:c.a0/D2R+90,rotationX:c.rx0,rotationY:c.ry0})}
function maxPan(n){const L=S.L;return Math.max(0,((n-1)*L.step)/2-(L.W/2-L.cw/2-14))}
function fanPose(i,n){
  const L=S.L,ch=L.ch;
  if(L.row){
    const half=L.W/2,x=(i-(n-1)/2)*L.step-S.pan,u=x/half,k=26,topY=L.H-L.Hf+50+ch/2;
    return pose({x,y:topY+k*u*u-L.H/2,z:i*1.2,rotation:Math.atan(2*k*u/half)/D2R});
  }
  const A=70,Hf=L.Hf,Ry=Math.max(50,(Hf-34-1.1*ch)/(1-Math.cos(A*D2R))),Rx=Math.max(160,Math.min(L.W*.5-ch*.55-10,720));
  const t=(i-(n-1)/2)*(2*A/77)*D2R,pivot=30+ch/2+Ry;
  return pose({x:Rx*Math.sin(t),y:(L.H-Hf+pivot-Ry*Math.cos(t))-L.H/2,z:i*1.2,rotation:Math.atan2(Ry*Math.sin(t),Rx*Math.cos(t))/D2R,rotationX:6});
}
function revealBox(){
  const L=S.L,open=S.dock==='open',peek=S.dock==='peek',extra=S.summary?52:0;
  let x1=L.W,y1=L.H-96+extra,y0=L.hdr+(S.summary?-6:4);
  if(L.wide&&open)x1=L.W-L.dockW-10;
  if(!L.wide){const ext=open?L.dockH:peek?44:0;y1=L.H-ext-90+extra*(open?.4:1)}
  return{x0:0,x1,y0,y1};
}
const pickBox=()=>({x0:0,x1:S.L.W,y0:S.L.hdr+48,y1:S.L.H-S.L.Hf-8});
const boxFor=st=>(st==='reveal'||st==='reading')?revealBox():pickBox();
function spreadPoses(box){
  const pos=SPREADS[S.spreadKey].pos,L=S.L,LBL=.42,pad=10;
  let X0=1e9,X1=-1e9,Y0=1e9,Y1=-1e9;
  pos.forEach(p=>{const hw=p.rot?6/7:.5,hh=p.rot?.5:6/7;X0=Math.min(X0,p.x-hw);X1=Math.max(X1,p.x+hw);Y0=Math.min(Y0,p.y-hh);Y1=Math.max(Y1,p.y+hh+(p.nolbl?0:LBL))});
  const bw=box.x1-box.x0,bh=box.y1-box.y0;
  const cw=Math.max(30,Math.min((bw-2*pad)/(X1-X0),(bh-2*pad)/(Y1-Y0),S.spreadKey==='one'?300:250)),sc=cw/L.cw;
  const ox=box.x0+(bw-cw*(X1-X0))/2-cw*X0,oy=box.y0+(bh-cw*(Y1-Y0))/2-cw*Y0;
  return pos.map((p,i)=>{const cx=ox+p.x*cw,cy=oy+p.y*cw;
    return {...pose({x:cx-L.W/2,y:cy-L.H/2,z:2+i*.6,scale:sc,rotation:p.rot||0}),lx:cx-L.W/2,ly:cy-L.H/2+cw*12/7/2+13}});
}
const slotPoses=st=>spreadPoses(boxFor(st));
function poseOf(c,st){
  if(st==='intro')return offPose(c);
  if(st==='gallery')return galleryPose(c);
  if(st==='setup'||st==='gather')return stackPose(c.idx,S.L.deckSetup);
  if(st==='shuffle')return stackPose(c.idx,S.L.deckShuffle);
  if(c.placed)return slotPoses(st)[S.picked.indexOf(c)];
  if(st==='pick'){const i=S.fan.indexOf(c);return i<0?stackPose(c.idx,S.L.deckShuffle):fanPose(i,S.fan.length)}
  return cornerPose(S.rest.indexOf(c));
}
function applyPoses(animate=false,dur=.9,st=S.state,only=null){
  const sp=(st==='pick'||st==='reveal'||st==='reading')?slotPoses(st):null;
  S.deck.forEach(c=>{
    if(only&&!only(c))return;
    const p=(c.placed&&sp)?sp[S.picked.indexOf(c)]:poseOf(c,st);if(!p)return;
    const {lx,ly,...q}=p;
    if(st!=='intro')gsap.set(c.el,{autoAlpha:1});
    if(animate&&!RM())gsap.to(c.el,{...q,duration:dur,ease:EIO,overwrite:'auto'});else gsap.set(c.el,q);
  });
}

/* ---- camera: tilt + dolly per state, pointer parallax, idle sway ---- */
/* altar: a velvet cloth with a slowly turning sigil lying on the 3D table plane, under wherever the cards are */
function altarSize(){
  const L=S.L,w=Math.max(L.W,L.H)*1.05,h=w*.64,sig=Math.min(L.W,L.H)*(L.wide?.62:.78);
  gsap.set('#altar',{width:w,height:h,xPercent:-50,yPercent:-50});ROOTSTYLE.setProperty('--sig',sig+'px');
}
function altarTo(st,dur=1.8){
  const L=S.L;if(!L)return;let x=0,y=0,a=1;
  if(st==='intro')a=0;
  else if(st==='setup'||st==='gather')y=L.deckSetup.y;
  else if(st==='shuffle'||st==='pick')y=L.deckShuffle.y;
  else if(st==='reveal'||st==='reading'){const b=revealBox();x=(b.x0+b.x1)/2-L.W/2;y=(b.y0+b.y1)/2-L.H/2}
  else if(st==='gallery')a=.4;
  return gsap.to('#altar',{x,y,z:-8,autoAlpha:a,duration:RM()?.01:dur,ease:BIG,overwrite:'auto'});
}
function camTo(st,dur=1.8){PAR.amp=PARAMP[st]??1;altarTo(st,dur);
  if(!PAR.amp){qRY(0);qRX(0)}
  if(S.sway){if(st==='pick'){S.sway.pause();gsap.to('#bob',{y:0,rotationY:0,rotationZ:0,duration:.8,ease:EO})}else if(S.sway.paused())S.sway.play()}
  return gsap.to('#cam',{rotationX:TILT[st]??0,z:DOLLY[st]||0,duration:RM()?.01:dur,ease:BIG,overwrite:'auto'})}
const qRY=gsap.quickTo('#world','rotationY',{duration:1.6,ease:EO}),qRX=gsap.quickTo('#world','rotationX',{duration:1.6,ease:EO});
const qBX=gsap.quickTo('#bgimg','x',{duration:2.2,ease:EO}),qBY=gsap.quickTo('#bgimg','y',{duration:2.2,ease:EO});   // backdrop drifts opposite the pointer
addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'||RM())return;
  const px=e.clientX/innerWidth-.5,py=e.clientY/innerHeight-.5;qRY(px*10*PAR.amp);qRX(-py*7*PAR.amp);STAR.px=px;STAR.py=py;
  qBX(-px*innerWidth*.03);qBY(-py*innerHeight*.025);
});

/* ---- landing pads (spread slots) — appear only once picking starts ---- */
function buildPads(){
  const w=$('#world');S.padEls=[];S.lblEls=[];
  for(let i=0;i<10;i++){
    const s=document.createElement('div');s.className='slot';
    s.innerHTML='<svg viewBox="0 0 70 120" preserveAspectRatio="none"><rect x="1" y="1" width="68" height="118" rx="6" pathLength="1"/></svg>';
    const l=document.createElement('div');l.className='slbl';w.insertBefore(l,w.firstChild);w.insertBefore(s,w.firstChild);
    S.padEls.push(s);S.lblEls.push(l);gsap.set([s,l],{autoAlpha:0});
  }
}
function padsTo(st,mode){            // mode: 'in' | 'move' | 'set'
  const def=SPREADS[S.spreadKey],poses=slotPoses(st),rm=RM();
  S.padEls.forEach((el,i)=>{
    const lbl=S.lblEls[i],rect=el.querySelector('rect');
    if(i>=def.count){if(S.padOn[i]){gsap.to([el,lbl],{autoAlpha:0,duration:.4});S.padOn[i]=false}return}
    const p=poses[i],pp={x:p.x,y:p.y,z:-1,scale:p.scale,rotation:p.rotation},lp={x:p.lx,y:p.ly,z:.5};
    lbl.textContent=`${i+1} · ${def.pos[i].label}`;
    if(mode==='in'){
      gsap.set(el,{...pp,autoAlpha:1});gsap.set(lbl,lp);
      gsap.fromTo(rect,{strokeDashoffset:1},{strokeDashoffset:0,duration:rm?.01:.8,ease:EIO,delay:rm?0:.2+i*.05});
      gsap.fromTo(el,{scale:p.scale*.86},{scale:p.scale,duration:rm?.01:.9,ease:EO,delay:rm?0:.2+i*.05});
      if(!def.pos[i].nolbl)gsap.fromTo(lbl,{autoAlpha:0,y:p.ly+10},{autoAlpha:.95,y:p.ly,duration:rm?.2:.7,ease:EO,delay:rm?0:.35+i*.05});
      S.padOn[i]=true;
    }else if(S.padOn[i]){
      if(mode==='move'&&!rm){gsap.to(el,{...pp,duration:1,ease:EIO,overwrite:'auto'});gsap.to(lbl,{...lp,duration:1,ease:EIO,overwrite:'auto'})}
      else{gsap.set(el,pp);gsap.set(lbl,lp)}
    }
  });
}
function padsOut(){
  S.padEls.forEach((el,i)=>{if(S.padOn[i]){gsap.to(el.querySelector('rect'),{strokeDashoffset:1,duration:.6,ease:EI});gsap.to([el,S.lblEls[i]],{autoAlpha:0,duration:.5,ease:EI,delay:.15})}
    S.padOn[i]=false;el.classList.remove('next','used')});
}
function markPads(){
  const n=SPREADS[S.spreadKey].count;
  S.padEls.forEach((el,i)=>{el.classList.toggle('used',i<S.picked.length);el.classList.toggle('next',i===S.picked.length&&S.picked.length<n)});
}

/* ---- UI panel helpers: slide + fade + blur in/out ---- */
function pIn(el,o={}){
  const rm=RM();
  return gsap.fromTo(el,{autoAlpha:0,x:rm?0:(o.x||0),y:rm?0:(o.y??60),filter:rm?'none':'blur(8px)'},
    {autoAlpha:1,x:0,y:0,filter:'blur(0px)',duration:rm?.3:(o.d||.9),ease:EO,delay:o.delay||0,onComplete:()=>gsap.set(el,{filter:'none'})});
}
function pOut(el,o={}){
  const rm=RM();
  return gsap.to(el,{autoAlpha:0,x:rm?0:(o.x||0),y:rm?0:(o.y??50),filter:rm?'none':'blur(6px)',duration:rm?.25:(o.d||.55),ease:EI,delay:o.delay||0,overwrite:'auto'});
}
const ROOTSTYLE=document.documentElement.style;
function placeUI(){
  const L=S.L;
  gsap.set(['#setup','#prompt','#hintPos','#shufUI','#galBar','#deckHint'],{xPercent:-50});
  gsap.set('#deckHint',{top:L.hintTop});
  const inf=$('#info');inf.className='glass '+(L.wide?'wide':'narrow');inf.style.setProperty('--infoW',INFO_W()+'px');inf.style.setProperty('--infoH',INFO_H()+'px');
  gsap.set('#shufUI',{top:L.H/2+L.deckShuffle.y+L.ch*.62+38});
  gsap.set('#hintPos',{y:revealBox().y1+(L.wide?6:10)});
  const d=$('#dock');d.className=L.wide?'wide':'narrow';d.classList.toggle('peek',S.dock==='peek');
  d.style.setProperty('--dockW',L.dockW+'px');d.style.setProperty('--dockH',L.dockH+'px');
  if(!S.busy)gsap.set(d,dockVars(S.dock));
  altarSize();
  ROOTSTYLE.setProperty('--cw',L.cw+'px');ROOTSTYLE.setProperty('--cwx',L.px+'px');ROOTSTYLE.setProperty('--ck',(L.cw/L.px).toFixed(5));
}
function dockVars(mode){
  const L=S.L,hid=mode==='hidden';
  return L.wide?{x:hid?L.dockW+40:mode==='peek'?L.dockW-46:0,y:0,autoAlpha:hid?0:1}:{y:hid?L.dockH+40:mode==='peek'?L.dockH-44:0,x:0,autoAlpha:hid?0:1};
}

/* ======================================================================
   SECTION 7 · CARDS (persistent DOM) + INPUT
   ====================================================================== */
function makeCard(def,i){
  const c={...def,idx:i,ord:CARDS.findIndex(x=>x.id===def.id),a0:(i/78)*Math.PI*4+rand(-.15,.15),zf:-rand(1800,3200),rx0:rand(-35,35),ry0:rand(-35,35),reversed:false,revealed:false,placed:false,faceDone:false};
  const el=document.createElement('div');el.className='card';el.tabIndex=-1;el.setAttribute('role','button');el.setAttribute('aria-label','ไพ่คว่ำหน้า');
  // .sz is laid out at a large fixed size (--cwx) and scaled down by CSS: the browser rasterises 3D cards at
  // their layout size, so a small card enlarged on the table looked blurry; a large card shrunk stays sharp.
  el.innerHTML=`<div class="hov"><div class="sz"><div class="rev"><div class="flip"><div class="back"><div class="mand"></div></div><div class="face"></div><div class="glare"><i></i></div><div class="holo"></div></div></div></div></div>`;
  c.el=el;c.hov=el.firstChild;c.revEl=c.hov.firstChild.firstChild;c.flipEl=c.revEl.firstChild;c.faceEl=c.flipEl.children[1];c.glare=c.flipEl.children[2].firstChild;
  el.addEventListener('focus',()=>{if(S.state==='pick')liftOn(c)});
  el.addEventListener('blur',()=>{if(S.state==='pick'&&S.armed!==c)liftOff(c)});
  el.addEventListener('click',()=>{if(S.dragging)return;activate(c,false)});
  el.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(c,true)}
    else if(S.state==='pick'&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){
      e.preventDefault();const i=S.fan.indexOf(c),j=clamp(i+(e.key==='ArrowRight'?1:-1),0,S.fan.length-1);
      S.fan.forEach(x=>x.el.tabIndex=-1);S.fan[j].el.tabIndex=0;
      if(S.L.row){const m=maxPan(S.fan.length);S.pan=clamp((j-(S.fan.length-1)/2)*S.L.step,-m,m);fanTo(true,.5)}
      S.fan[j].el.focus();
    }
  });
  return c;
}
document.addEventListener('pointerdown',e=>{S.lastPtr=e.pointerType},true);

/* Fan hit-testing is geometric, not DOM-based: in 3D the browser's hit-test follows depth
   sorting and the lifted card's raised box, so the card under the pointer was not always the
   one that reacted. Here every card's projected rect is tested and the top-most (highest index) wins. */
const PERSP=1700;
function hitFan(cx,cy){
  const L=S.L,n=S.fan.length,oy=L.H*(.46-.5),px=cx-L.W/2,py=cy-L.H/2;
  for(let i=n-1;i>=0;i--){
    const c=S.fan[i],p=fanPose(i,n),f=PERSP/(PERSP-p.z),X=p.x*f,Y=oy+(p.y-oy)*f,th=p.rotation*D2R;
    const dx=(px-X)/f,dy=(py-Y)/f,lx=dx*Math.cos(th)+dy*Math.sin(th),ly=-dx*Math.sin(th)+dy*Math.cos(th);
    const top=(c===S.hover||c===S.armed)?-L.ch/2-46:-L.ch/2;          // a lifted card keeps its raised top edge
    if(Math.abs(lx)<=L.cw/2&&ly>=top&&ly<=L.ch/2)return{c,u:lx/L.cw};
  }
  return null;
}
function setHover(h){
  const c=h?h.c:null;
  if(c!==S.hover){if(S.hover&&S.hover!==S.armed)liftOff(S.hover);S.hover=c;if(c)liftOn(c)}
  document.body.style.cursor=c?'pointer':'';
  if(c&&!RM())gsap.to(c.hov,{rotationY:h.u*18,duration:.4,ease:EO,overwrite:'auto'});
}
document.addEventListener('pointermove',e=>{
  S.lastXY=[e.clientX,e.clientY];
  if(S.state!=='pick'||S.busy||e.pointerType!=='mouse')return;
  setHover(hitFan(e.clientX,e.clientY));
});
document.addEventListener('pointerleave',()=>{if(S.state==='pick')setHover(null)});
document.addEventListener('click',e=>{
  if(S.state!=='pick'||S.busy||S.dragging||e.target.closest('button,input,#dock'))return;
  const h=hitFan(e.clientX,e.clientY);if(h)activate(h.c,false);
});

function liftOn(c){
  if(S.state!=='pick'||c.placed||S.busy||c.el.classList.contains('lift'))return;
  c.el.classList.add('lift');if(RM())return;
  gsap.to(c.hov,{y:-36,z:70,rotationX:-8,scale:1.05,duration:.35,ease:EO,overwrite:true});
}
function liftOff(c){
  c.el.classList.remove('lift');if(RM())return;
  gsap.to(c.hov,{y:0,z:0,rotationX:0,rotationY:0,scale:1,duration:.4,ease:EO,overwrite:true});
}
function activate(c,viaKey){
  if(S.busy)return;
  if(S.state==='pick'&&!c.placed){
    const touch=S.lastPtr!=='mouse'&&!viaKey;
    if(touch&&S.armed!==c){
      if(S.armed){S.armed.el.classList.remove('armed');liftOff(S.armed)}
      S.armed=c;c.el.classList.add('armed');liftOn(c);setPrompt(null,'แตะไพ่ใบเดิมอีกครั้งเพื่อยืนยันการเลือก');return;
    }
    S.armed=null;c.el.classList.remove('armed');go(()=>pickCard(c));
  }else if((S.state==='reveal'||S.state==='reading')&&c.placed){
    if(c.revealed){if(S.zoom!==c)focusReading(S.picked.indexOf(c));zoomCard(c)}else go(()=>revealCard(c));
  }else if(S.state==='gallery'&&!S.dragging){zoomCard(c);if(S.zoom===c)showInfo(c)}
}
/* mobile: horizontally scrollable 3D arc — drag to pan, with inertia */
(function panInput(){
  let down=null,vx=0,last=0;
  document.addEventListener('pointerdown',e=>{
    if(S.state!=='pick'||!S.L.row||S.busy||e.clientY<S.L.H-S.L.Hf-20)return;
    down={x:e.clientX,pan:S.pan,moved:false};vx=0;last=performance.now();gsap.killTweensOf(S);
  });
  document.addEventListener('pointermove',e=>{
    if(!down)return;const dx=e.clientX-down.x;
    if(!down.moved&&Math.abs(dx)>7){down.moved=true;S.dragging=true}
    if(down.moved){const m=maxPan(S.fan.length),np=clamp(down.pan-dx,-m,m),now=performance.now();vx=clamp((np-S.pan)/Math.max(8,now-last)*16,-40,40);last=now;S.pan=np;fanTo(false)}
  });
  const end=()=>{
    if(!down)return;const mv=down.moved;down=null;
    if(mv){const m=maxPan(S.fan.length);gsap.to(S,{pan:clamp(S.pan+vx*14,-m,m),duration:.9,ease:EO,onUpdate:()=>fanTo(false)});setTimeout(()=>S.dragging=false,60)}
  };
  document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
})();
function fanTo(animate,dur=.65){
  const n=S.fan.length;
  S.fan.forEach((c,i)=>{
    const p=fanPose(i,n);
    if(animate&&!RM())gsap.to(c.el,{...p,duration:dur,ease:EIO,overwrite:'auto'});else gsap.set(c.el,p);
  });
  if(n&&!S.fan.some(c=>c.el.tabIndex===0))S.fan[Math.floor(n/2)].el.tabIndex=0;
}

/* ======================================================================
   SECTION 8 · STATE MACHINE
   intro → gather → setup → shuffle → pick → reveal → reading → (gather → setup)
   `go()` ignores input while a transition runs. One function per phase transition;
   every next entrance is scheduled before the previous exit ends.
   ====================================================================== */
const setState=s=>{S.state=s;$('#stage').dataset.state=s};
async function go(fn){
  if(S.busy)return;S.busy=true;
  try{await fn()}finally{S.busy=false;if(S.pendingResize){S.pendingResize=false;onResize(true)}}
}
function fisherYates(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function setPrompt(main,sub){
  if(main!==null){const p=$('#promptMain');if(p.textContent!==main){if(RM())p.textContent=main;
    else gsap.timeline().to(p,{y:-8,autoAlpha:0,duration:.18,ease:EI}).add(()=>{p.textContent=main}).to(p,{y:0,autoAlpha:1,duration:.3,ease:EO});}}
  if(sub!==null&&sub!==undefined)$('#promptSub').textContent=sub;
}
/* 3D flight: quadratic bezier in x/y/z with spin, tilt and scale blend */
function flyTo(c,tp,{dur=1.05,lift=420,spin=26,side=1,rise=200,ease=EIO}={}){
  const fr=readPose(c.el),o={t:0},cx=(fr.x+tp.x)/2+side*90,cy=Math.min(fr.y,tp.y)-rise,cz=Math.max(fr.z,tp.z)+lift;
  return gsap.to(o,{t:1,duration:RM()?.01:dur,ease,onUpdate(){
    const t=o.t,u=1-t,s=Math.sin(Math.PI*t);
    gsap.set(c.el,{x:u*u*fr.x+2*u*t*cx+t*t*tp.x,y:u*u*fr.y+2*u*t*cy+t*t*tp.y,z:u*u*fr.z+2*u*t*cz+t*t*tp.z,
      rotation:fr.rotation+(tp.rotation-fr.rotation)*t+spin*side*s,rotationX:fr.rotationX+(tp.rotationX-fr.rotationX)*t-26*s,
      rotationY:fr.rotationY+(tp.rotationY-fr.rotationY)*t+14*side*s,scale:fr.scale+(tp.scale-fr.scale)*t});
  }});
}
/* tornado: polar angle + shrinking radius around the deck, with depth lift and tumble */
function vortexTL(cards,{target,dur=2.2,gap=.008,spin=1,lift=0}){
  const tl=gsap.timeline(),D=S.L.deckSetup,rm=RM();
  cards.forEach((c,i)=>{
    const tp=target(c,i);
    if(rm){tl.set(c.el,{autoAlpha:0},0).set(c.el,tp,0).to(c.el,{autoAlpha:1,duration:.4,ease:EO},.05+i*.002);return}
    const fr=readPose(c.el),dx=fr.x-D.x,dy=fr.y-D.y,a0=Math.atan2(dy,dx),r0=Math.hypot(dx,dy);
    const turn=(1.15+Math.random()*.55)*Math.PI*spin,o={t:0},swirl=rand(140,240)*spin,wob=rand(-35,35),wy=rand(-30,30);
    tl.set(c.el,{autoAlpha:1},i*gap).to(o,{t:1,duration:dur,ease:'back.out(1.05)',onUpdate(){
      const e=o.t,em=Math.min(e,1),s=Math.sin(Math.PI*em),r=r0*(1-e),a=a0+turn*e;
      gsap.set(c.el,{x:D.x+Math.cos(a)*r+(tp.x-D.x)*e,y:D.y+Math.sin(a)*r+(tp.y-D.y)*e,z:fr.z+(tp.z-fr.z)*e+lift*s,
        rotation:fr.rotation+(tp.rotation-fr.rotation)*e+swirl*s*.6,rotationX:fr.rotationX+(tp.rotationX-fr.rotationX)*em+wob*s,
        rotationY:fr.rotationY+(tp.rotationY-fr.rotationY)*em+wy*s,scale:fr.scale+(tp.scale-fr.scale)*em});
    }},i*gap);
  });
  return tl;
}
function ripple(){
  const L=S.L,D=L.deckSetup,tl=gsap.timeline();
  tl.set('#ripple',{x:D.x,y:D.y,z:-2},0).fromTo('#ripple',{scale:.2,autoAlpha:1},{scale:Math.max(L.W,L.H)/60,autoAlpha:0,duration:1.9,ease:EO,immediateRender:false},0)
    .to(STAR,{boost:1,duration:.3,ease:EO},0).to(STAR,{boost:0,duration:1.6,ease:EI},.3);
  return tl;
}
/* the whole table breathes slightly */
function startSway(){if(RM()||S.sway)return;S.sway=gsap.to('#bob',{y:-6,rotationY:1.4,rotationZ:.3,duration:4.5,ease:'sine.inOut',yoyo:true,repeat:-1})}

/* ---- PHASE 1 · intro: 3D letters, halo, tagline, begin ---- */
function buildTitle(){
  $('#title').innerHTML=[...'ARCANA'].map(ch=>`<span class="L"><b>${ch}</b><i class="hi" aria-hidden="true">${ch}</i></span>`).join('');
  const petals=Array.from({length:24},(_,i)=>`<ellipse cx="0" cy="-250" rx="26" ry="120" transform="rotate(${i*15})" fill="none" stroke="#d4af6a" stroke-opacity=".18"/>`).join('');
  const ticks=Array.from({length:72},(_,i)=>`<line x1="0" y1="-392" x2="0" y2="${i%6?-382:-370}" transform="rotate(${i*5})" stroke="#f2d48a" stroke-opacity=".35"/>`).join('');
  $('#halo').innerHTML=`<svg viewBox="-410 -410 820 820" aria-hidden="true"><circle r="400" fill="none" stroke="#d4af6a" stroke-opacity=".25"/><circle r="360" fill="none" stroke="#d4af6a" stroke-opacity=".15" stroke-dasharray="2 8"/>
    ${ticks}${petals}<polygon points="${starPts(0,0,300,120,8)}" fill="none" stroke="#f2d48a" stroke-opacity=".14"/><circle r="140" fill="none" stroke="#d4af6a" stroke-opacity=".2"/></svg>`;
  const sg=new Image();sg.alt='';sg.onload=()=>{const h=$('#halo');h.innerHTML='';h.appendChild(sg)};sg.src='assets/sigil.webp';   // painted sigil replaces the line halo
}
function playIntro(){
  const Ls=$$('#title .L'),tl=gsap.timeline(),sp=S.L.W*.035;
  gsap.set('#title',{xPercent:-50,yPercent:-50});
  gsap.set('#tagline',{xPercent:-50,yPercent:-50,y:S.L.H*.13});
  gsap.set('#beginBtn',{xPercent:-50,yPercent:-50,y:S.L.H*.24});
  if(RM()){tl.to([...Ls,'#tagline','#beginBtn','#halo','#bgimg'],{autoAlpha:1,duration:.6,stagger:.08});return tl}
  tl.fromTo('#bgimg',{autoAlpha:0,scale:1.16},{autoAlpha:1,scale:1.04,duration:6.5,ease:'power2.out'},0)   // the cathedral emerges from darkness
    .fromTo('#halo',{autoAlpha:0,scale:.55,rotation:-40},{autoAlpha:1,scale:1,rotation:0,duration:4,ease:BIGO},0)
    .fromTo(Ls,{autoAlpha:0,y:-40,z:-420,rotationX:-85,filter:'blur(18px)'},{autoAlpha:1,y:0,z:0,rotationX:0,filter:'blur(0px)',duration:1.7,ease:EO,stagger:.22},.4)
    .fromTo(Ls,{x:i=>(i-2.5)*sp},{x:0,duration:4.2,ease:'power2.out'},.4)
    .fromTo('#tagline',{autoAlpha:0,y:S.L.H*.13+22,filter:'blur(8px)'},{autoAlpha:1,y:S.L.H*.13,filter:'blur(0px)',duration:1.2,ease:EO},2.2)
    .fromTo('#beginBtn',{autoAlpha:0,y:S.L.H*.24+26,filter:'blur(8px)'},{autoAlpha:1,y:S.L.H*.24,filter:'blur(0px)',duration:1.1,ease:EO},2.9);
  S.shimmer=gsap.timeline({repeat:-1,repeatDelay:3.2,delay:4})
    .to('#title .hi',{opacity:.95,duration:.4,stagger:.13,ease:'power2.out'}).to('#title .hi',{opacity:0,duration:.7,stagger:.13,ease:'power2.in'},.4);
  return tl;
}

/* ---- PHASE 2 · gather: title → logo (GSAP Flip), hyperspace stars, 78-card 3D tornado ---- */
async function gather(){
  setState('gather');S.hideNote&&S.hideNote();
  const tl=gsap.timeline(),L=S.L;
  S.intro&&S.intro.kill();S.shimmer&&S.shimmer.kill();gsap.to('#title .hi',{opacity:0,duration:.3});
  gsap.to('#title .L',{autoAlpha:1,y:0,z:0,x:0,rotationX:0,filter:'blur(0px)',duration:.4,ease:EO});
  tl.add(pOut('#tagline',{y:-24}),0).add(pOut('#beginBtn',{y:24}),0)
    .to('#halo',{scale:2.6,autoAlpha:0,rotation:60,duration:RM()?.3:1.8,ease:BIG},0)
    .add(()=>{                                                          // ARCANA letters shrink into the header logo
      const t=$('#title'),st=Flip.getState(t);gsap.set(t,{clearProps:'transform'});$('#logoSlot').appendChild(t);
      Flip.from(st,{duration:RM()?.3:1.9,ease:BIG,scale:true});
    },.05);
  if(!RM())tl.to(STAR,{warp:1,duration:.9,ease:EIO},.1).to(STAR,{warp:0,duration:1.4,ease:EO},1.3);
  gsap.set('#cam',{rotationX:RM()?TILT.setup:64,z:RM()?0:-500});
  tl.add(camTo('setup',2.9),.2);Sound.whoosh();
  S.deck.forEach(c=>gsap.set(c.el,{...offPose(c),autoAlpha:0}));
  const vt=vortexTL(S.deck,{target:(c,i)=>stackPose(i,L.deckSetup),dur:2.3});
  tl.add(vt,.35);
  const end=.35+vt.duration();
  tl.add(ripple(),end-.2).add(pIn('#setup',{y:120}),end-.35).add(pIn('#deckHint',{y:20,d:.8}),end+.1).add(pIn('#hud',{y:-20,d:.8}),end-.1).add(()=>previewSpread(),end+.1);
  tl.add(()=>{S.deck.forEach((c,i)=>{c.idx=i;c.el.classList.toggle('top',i===77)})},end);
  await tlUntil(tl,end+.15);                       // interactive as soon as the deck lands; ripple keeps playing
  setState('setup');startSway();
}

/* ---- PHASE 3 · setup: choosing a spread lifts that many cards off the deck as a 3D preview ---- */
S.previews=[];
S.prevCards=[];
function killPreview(){S.previews.forEach(t=>t.kill());S.previews=[]}
function previewSpread(){
  if(S.state==='shuffle')return;
  const n=SPREADS[S.spreadKey].count,D=S.L.deckSetup,top=S.deck.slice(-n),cw=S.L.cw;
  killPreview();
  // cards lifted by the previous preview but not by this one must glide back onto the deck,
  // otherwise a spread switched mid-preview (10 → 1) leaves them hanging in the air
  S.prevCards.filter(c=>!top.includes(c)).forEach(c=>gsap.to(c.el,{...stackPose(c.idx,D),duration:RM()?.01:.5,ease:EIO,overwrite:'auto'}));
  S.prevCards=top;
  if(RM()){top.forEach(c=>gsap.set(c.el,stackPose(c.idx,D)));return}
  // drawn from the deck: the cards first rise off the top of the pile, then fan out; on the way back they
  // fold into a neat pile right above the deck and settle down onto it, so the motion always reads as one deck
  const topZ=(S.deck.length-1)*TH*(D.sc||1);
  // 1 card: lifted clear above the deck (as far as the free space allows) · 3 cards: side by side with gaps ·
  // 10 cards: an overlapping fan
  // lifts never go past the free space above the deck (minus a margin), so cards stay clear of the header
  const sc=D.sc||1,cwS=cw*sc,chS=cwS*12/7,room=Math.max(0,S.L.deckRoom-18)/.866,
    lift1=Math.min(chS*.6,room),lift3=Math.min(chS*.22,room),gap3=Math.min(cwS*1.14,(S.L.W-24)/3/.95),
    narrow=S.L.W<600,step10=Math.min(cw*.34,(S.L.W-36-cwS*1.4)/9/.95);   // the 10-card fan fits the screen width
  // a card tilted by rotationX dips its lower edge by (half height)·sin(tilt); lift it at least that much above the
  // deck top, or the edge sinks into the pile
  const clear=rx=>chS*.5*Math.sin(Math.abs(rx)*D2R)+10,rx10=narrow?-6:-12;
  top.forEach((c,k)=>{
    const off=(k-(n-1)/2),i=c.idx,pile={x:D.x,y:D.y-cw*.06,z:topZ+10+k*1.5,rotation:0,rotationX:0,rotationY:0};
    const fan=n===1?{x:D.x,y:D.y-lift1,z:topZ+clear(14),rotation:-3,rotationX:-14}
      :n<=3?{x:D.x+off*gap3,y:D.y-lift3+Math.abs(off)*chS*.04,z:topZ+clear(12)+k*12,rotation:off*4,rotationX:-12}
      :{x:D.x+off*step10,y:D.y-Math.min(cw*.18,room)+(narrow?off*off*cwS*.035:0),z:topZ+clear(rx10)+k*(narrow?9:16),rotation:off*(narrow?3:5),rotationX:rx10};
    S.previews.push(gsap.timeline({delay:k*.035})
      .to(c.el,{...pile,duration:.22,ease:'power2.out',overwrite:'auto'})
      .to(c.el,{...fan,duration:.55,ease:'power3.out'})
      .to(c.el,{...pile,duration:.45,ease:'power2.inOut'},'+=.55')
      .to(c.el,{...stackPose(i,D),duration:.3,ease:'power2.in'}));
  });
}
function chooseSpread(key){
  if(S.busy||S.state!=='setup')return;
  S.spreadKey=key;$$('.opt').forEach(o=>o.setAttribute('aria-pressed',String(o.dataset.spread===key)));
  S.L=computeLayout();placeUI();previewSpread();
}

/* ---- PHASE 4 · shuffle (all 3D: halves bend, packets arc, piles split in depth) ---- */
function shuffleOnce(kind){
  const D=S.L.deckShuffle,n=S.deck.length,els=S.deck.map(c=>c.el),tl=gsap.timeline(),next=fisherYates(S.deck),spread=S.L.cw*.95;
  const sz=k=>k*TH;
  const restack=()=>{next.forEach((c,i)=>{c.idx=i;gsap.set(c.el,stackPose(i,D));c.reversed=Math.random()<.3;c.el.classList.toggle('top',i===n-1)});S.deck=next};
  Sound.shuffle(kind);
  if(RM()){tl.to(els,{opacity:.25,duration:.25}).add(restack).to(els,{opacity:1,duration:.25});return tlDone(tl)}
  if(kind==='riffle'){
    const h=Math.floor(n/2),A=els.slice(0,h),B=els.slice(h),mix=[];
    for(let i=0;i<h;i++){mix.push(A[i]);if(B[i])mix.push(B[i])}
    tl.to(A,{x:D.x-spread*.62,z:i=>sz(i)+30,rotation:i=>-4-i/h*5,rotationY:28,duration:.5,ease:EO},0)
      .to(B,{x:D.x+spread*.62,z:i=>sz(i)+30,rotation:i=>4+i/h*5,rotationY:-28,duration:.5,ease:EO},0)
      .to(A,{rotationX:-14,duration:.25,ease:EO},.35).to(B,{rotationX:-14,duration:.25,ease:EO},.35);
    mix.forEach((el,k)=>tl.to(el,{x:D.x,z:sz(k)+8,rotation:0,rotationX:0,rotationY:0,duration:.24,ease:EI},.62+k*.009));
    tl.to(els,{z:i=>sz(i),duration:.2,ease:EO});
  }else if(kind==='overhand'){
    let t=0,from=0,left=n;const sizes=[];
    while(left>0){const s=Math.min(left,Math.round(rand(10,16)));sizes.push(s);left-=s}
    sizes.forEach((s,pi)=>{const pk=els.slice(from,from+s);from+=s;
      tl.to(pk,{x:D.x-spread*.95,y:D.y-30,z:i=>sz(n)+120+i*TH,rotation:-10,rotationX:-24,rotationY:12,duration:.2,ease:EO},t)
        .to(pk,{x:D.x,y:D.y,z:i=>sz(n+pi*s+i),rotation:0,rotationX:0,rotationY:0,duration:.2,ease:EI},t+.21);
      t+=.25});
  }else{
    const a=Math.floor(n/3),b=Math.floor(2*n/3),Pl=[els.slice(0,a),els.slice(a,b),els.slice(b)];
    const orders=[[2,0,1],[1,2,0],[2,1,0],[1,0,2]],ord=orders[Math.floor(Math.random()*orders.length)];
    tl.to(Pl[0],{x:D.x-spread*1.3,z:i=>sz(i),rotation:-5,rotationY:16,duration:.5,ease:EO},0)
      .to(Pl[1],{z:i=>sz(i)+140,rotationX:-18,duration:.5,ease:EO},0)
      .to(Pl[2],{x:D.x+spread*1.3,z:i=>sz(i),rotation:5,rotationY:-16,duration:.5,ease:EO},0);
    let base=0,t=.72;
    ord.forEach(pi=>{const p=Pl[pi],b0=base;
      tl.to(p,{x:D.x,z:i=>sz(b0+i)+90,duration:.2,ease:EO},t).to(p,{z:i=>sz(b0+i),rotation:0,rotationX:0,rotationY:0,duration:.18,ease:EI},t+.2);
      base+=p.length;t+=.3});
  }
  tl.add(restack);return tlDone(tl);
}
async function toShuffle(){
  S.question=$('#question').value.trim();S.shuffles=+$('#shuffleRange').value;
  const N=S.shuffles,kinds=['riffle','overhand','cut'],names=['แบบริฟเฟิล','แบบโอเวอร์แฮนด์','ตัดเป็นสามกอง'],D=S.L.deckShuffle;
  killPreview();S.prevCards=[];setState('shuffle');S.L=computeLayout();placeUI();
  const tl=gsap.timeline();
  $('#counter').textContent=`กำลังสับ 1/${N}`;$('#shufKind').textContent=`สับ${names[0]}`;
  tl.add(pOut('#setup',{y:120}),0).add(pOut('#deckHint',{y:20}),0).add(camTo('shuffle',1.4),0)
    .to(S.deck.map(c=>c.el),{x:D.x,y:D.y,z:i=>i*TH,rotation:0,rotationX:0,rotationY:0,scale:1,duration:RM()?.3:1,ease:BIG,stagger:{each:.002,from:'end'},overwrite:'auto'},0)
    .add(pIn('#shufUI',{y:30,d:.8}),.4);
  await wait(.75);                                       // shuffles start while the deck is still settling
  for(let k=0;k<N;k++){
    $('#counter').textContent=`กำลังสับ ${k+1}/${N}`;$('#shufKind').textContent=`สับ${names[k%3]}`;
    await shuffleOnce(kinds[k%3]);
  }
  await dealFan();
}

/* ---- PHASE 5 · pick: the last shuffle flows straight into a 3D fan ---- */
async function dealFan(){
  setState('pick');S.fan=[...S.deck];S.picked=[];S.pan=0;S.rest=[];S.L=computeLayout();
  const n=S.fan.length,els=S.fan.map(c=>c.el),tl=gsap.timeline();
  S.fan.forEach((c,i)=>{c.el.setAttribute('aria-label',`ไพ่คว่ำหน้าใบที่ ${i+1} จาก ${n} กด Enter เพื่อเลือก`)});
  setPrompt(`เลือกอีก ${SPREADS[S.spreadKey].count} ใบ`,matchMedia('(hover:none)').matches?'ลากเพื่อเลื่อนดูไพ่ แตะเพื่อยก แตะอีกครั้งเพื่อยืนยัน':'เลื่อนเมาส์บนไพ่แล้วคลิกใบที่ใช่ (หรือใช้ปุ่มลูกศร + Enter)');
  tl.add(camTo('pick',1.5),0).add(pOut('#shufUI',{y:30}),0)
    .add(pIn('#prompt',{y:-24,d:.8}),.25)
    .add(()=>{padsTo('pick','in');markPads()},.5)
    .add(()=>{$('#btnNew').style.display='';gsap.fromTo('#btnNew',{autoAlpha:0},{autoAlpha:1,duration:.6})},.6);
  if(RM())tl.add(()=>fanTo(false),0).fromTo(els,{opacity:0},{opacity:1,duration:.4},0);
  else{
    const P=S.fan.map((_,i)=>fanPose(i,n));
    tl.to(els,{duration:1.05,ease:EO,stagger:{each:.012,from:'end'},x:i=>P[i].x,y:i=>P[i].y,z:i=>P[i].z,rotation:i=>P[i].rotation,
        rotationX:i=>P[i].rotationX,rotationY:i=>P[i].rotationY,scale:1},.05)
      .fromTo(S.fan.map(c=>c.hov),{z:0},{keyframes:[{z:140,duration:.45,ease:EO},{z:0,duration:.6,ease:EIO}],stagger:{each:.012,from:'end'}},.05);
  }
  await tlDone(tl);
  S.fan.forEach(c=>{c.el.classList.add('infan');c.el.classList.remove('top')});fanTo(false);S.fan[Math.floor(n/2)].el.tabIndex=0;
}
async function pickCard(c){
  const idx=S.picked.length,count=SPREADS[S.spreadKey].count;
  buzz(12);S.hover=null;document.body.style.cursor='';S.fan.forEach(x=>{if(x!==c&&x.el.classList.contains('lift'))liftOff(x)});
  S.picked.push(c);S.fan=S.fan.filter(x=>x!==c);c.placed=true;c.el.classList.remove('infan','lift','armed');renderCardFace(c);c.el.classList.add('placed');
  const {lx,ly,...tp}=slotPoses('pick')[idx];
  if(RM()){gsap.set(c.el,tp);gsap.fromTo(c.el,{opacity:.2},{opacity:1,duration:.4});fanTo(false)}
  else{
    fanTo(true,.75);                                                             // the gap in the fan closes
    await new Promise(r=>gsap.to(c.hov,{y:-60,z:160,rotationX:-14,rotationY:0,scale:1.08,duration:.32,ease:EO,overwrite:true,onComplete:r}));
    Sound.whoosh();
    const side=tp.x<readPose(c.el).x?-1:1;
    gsap.to(c.hov,{y:0,z:0,rotationX:0,scale:1,duration:1.05,ease:EIO});
    await tlDone(gsap.timeline().add(flyTo(c,tp,{dur:1.05,side,lift:380,spin:24})));
    gsap.fromTo(S.padEls[idx],{scale:tp.scale*1.14},{scale:tp.scale,duration:.6,ease:EO});      // landing pulse
  }
  gsap.set(c.hov,{clearProps:'all'});
  c.el.setAttribute('aria-label',`ไพ่ตำแหน่ง ${SPREADS[S.spreadKey].pos[idx].full} คว่ำหน้า`);
  markPads();
  if(S.picked.length>=count)await toReveal();
  else{setPrompt(`เลือกอีก ${count-S.picked.length} ใบ`,null);
    if(S.lastXY&&S.lastPtr==='mouse')gsap.delayedCall(.05,()=>{if(!S.busy&&S.state==='pick')setHover(hitFan(...S.lastXY))});}
}

/* ---- PHASE 6 · reveal: leftovers sweep into a deck that glides to a corner ---- */
async function toReveal(){
  setHover(null);const rest=S.fan.slice();S.rest=rest;S.fan=[];rest.forEach(c=>c.el.classList.remove('infan','lift'));
  setState('reveal');S.L=computeLayout();placeUI();
  const tl=gsap.timeline(),L=S.L,els=rest.map(c=>c.el),mid={x:0,y:L.H/2-L.Hf*.55};
  tl.add(pOut('#prompt',{y:-24}),0).add(camTo('reveal',1.6),0);
  if(RM()){tl.to(els,{opacity:0,duration:.25}).add(()=>{rest.forEach((c,k)=>gsap.set(c.el,cornerPose(k)))}).to(els,{opacity:1,duration:.3});}
  else{
    tl.to(els,{x:mid.x,y:mid.y,z:i=>i*TH+40,rotation:0,rotationX:0,rotationY:0,duration:.85,ease:EIO,stagger:{each:.005,from:'center'}},.05)
      .to(els,{x:i=>cornerPose(i).x,y:i=>cornerPose(i).y,z:i=>cornerPose(i).z,scale:L.corner,duration:1.05,ease:BIG,stagger:{each:.002}},'>-.25');
  }
  tl.add(()=>{applyPoses(true,1.1,'reveal',c=>c.placed);padsTo('reveal','move')},.15)
    .add(pIn('#hintRow',{y:30,d:.9}),.9);
  S.picked.forEach((c,i)=>{c.el.tabIndex=0;c.el.setAttribute('aria-label',`ไพ่ตำแหน่ง ${SPREADS[S.spreadKey].pos[i].full} คว่ำหน้า กด Enter เพื่อเปิดไพ่`)});
  await tlUntil(tl,1.15);                          // flips allowed while the leftover deck is still gliding away
}
function sparkleBurst(el){
  if(RM())return;
  const r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,fx=$('#fx');
  const beam=document.createElement('div');beam.className='beam';fx.appendChild(beam);
  gsap.set(beam,{width:r.width*2.6,height:r.height*2.2,x:cx-r.width*1.3,y:cy-r.height*1.1});
  gsap.fromTo(beam,{scaleY:.2,scaleX:.6,opacity:.95},{scaleY:1.5,scaleX:1.1,opacity:0,duration:1.3,ease:EO,onComplete:()=>beam.remove()});
  for(let i=0;i<40;i++){
    const d=document.createElement('div');d.className='sp';fx.appendChild(d);
    const a=Math.random()*6.283,dist=rand(r.width*.45,r.width*1.5),s=rand(.4,1.6);
    gsap.fromTo(d,{x:cx+Math.cos(a)*r.width*.1,y:cy+Math.sin(a)*r.height*.1,scale:0,rotation:0,opacity:1},
      {x:cx+Math.cos(a)*dist,y:cy+Math.sin(a)*dist*1.15-rand(0,30),scale:s,rotation:rand(-200,200),duration:rand(.9,1.7),ease:EO,onComplete:()=>d.remove()});
    gsap.to(d,{opacity:0,duration:.6,delay:rand(.5,1),ease:EI});
  }
}
/* slow 3D flip: rotateY 1.4s, card rises toward the camera at the midpoint, beam + sparkles + glare */
function revealCard(c){
  if(c.revealed)return Promise.resolve();
  const idx=S.picked.indexOf(c);renderCardFace(c);hiResFace(c);Sound.flip();buzz([10,40,18]);
  return new Promise(res=>{
    const done=async()=>{
      c.revealed=true;c.el.classList.add('revealed');c.el.setAttribute('aria-label',`${c.name} ${oriTh(c)} ตำแหน่ง ${SPREADS[S.spreadKey].pos[idx].full}`);
      await addReading(idx);res();
    };
    if(RM()){gsap.fromTo(c.el,{opacity:.1},{opacity:1,duration:.5});gsap.set(c.flipEl,{rotationY:180});if(c.reversed)gsap.set(c.revEl,{rotation:180});Sound.chime();done();return}
    const tl=gsap.timeline({onComplete:done});
    tl.to(c.hov,{z:240,y:-24,rotationX:-12,scale:1.06,duration:.7,ease:'power2.out'},0)
      .to(c.flipEl,{rotationY:180,duration:1.4,ease:'power2.inOut'},0)
      .to(c.hov,{z:0,y:0,rotationX:0,scale:1,duration:.85,ease:EIO},.75)
      .add(()=>{sparkleBurst(c.el);elementBurst(c);Sound.chime()},.8)
      .fromTo(c.glare,{xPercent:-100,opacity:1},{xPercent:100,duration:1,ease:'power2.inOut',immediateRender:false,onComplete:()=>gsap.set(c.glare,{opacity:0})},.95);
    if(c.reversed)tl.add(()=>{curseFX(c);Sound.curse();buzz([25,35,25])},'>-0.1')     // reversed: the card shudders in smoke, then turns
      .to(c.hov,{x:5,duration:.045,repeat:9,yoyo:true,ease:'sine.inOut'},'<')
      .set(c.hov,{x:0})
      .to(c.revEl,{rotation:180,duration:.9,ease:'back.inOut(1.3)'},'>-0.05');
  });
}
async function revealAll(){for(const c of S.picked){if(!c.revealed){await revealCard(c);await wait(.15)}}}

/* ---- PHASE 7 · reading: dock slides in, reading cards slide in one by one, summary rises last ---- */
function dockTo(mode,relayout=true){
  S.dock=mode;placeUI();const d=$('#dock'),v=dockVars(mode),tl=gsap.timeline();
  d.classList.toggle('peek',mode==='peek');
  tl.to(d,{...v,duration:RM()?.25:.9,ease:EO},0);
  if(relayout){unzoom('drop');constelRefresh();altarTo(S.state,.95);applyPoses(true,.95,S.state);padsTo(S.state,'move');gsap.to('#hintPos',{y:revealBox().y1+(S.L.wide?6:10),duration:.95,ease:EIO})}
  return tl;
}
async function addReading(idx){
  const el=document.createElement('article'),L=S.L;el.className='rcard';el.innerHTML=readingHTML(S.picked[idx],idx);el.dataset.i=idx;
  $('#dockList').appendChild(el);S.rcards[idx]=el;
  const tl=gsap.timeline();
  if(S.dock!=='open')tl.add(dockTo('open'),0);
  tl.fromTo(el,{autoAlpha:0,x:RM()?0:(L.wide?60:0),y:RM()?0:(L.wide?0:50),filter:'blur(8px)'},{autoAlpha:1,x:0,y:0,filter:'blur(0px)',duration:RM()?.3:.9,ease:EO,delay:.1},0)
    .add(()=>{$('#dockList').scrollTo({top:el.offsetTop-8,behavior:RM()?'auto':'smooth'})},.2);
  inkReading(el,.45);
  if(S.picked.every(c=>c.revealed)){
    S.summary=true;setState('reading');PAR.amp=PARAMP.reading;
    const sum=document.createElement('article');sum.className='rcard sum';sum.innerHTML=summaryHTML();$('#dockList').appendChild(sum);
    inkReading(sum,1.2);tl.add(readingDone,1.95);
    tl.add(pOut('#hintRow',{y:30}),.25)
      .add(()=>{applyPoses(true,1.1,S.state);padsTo(S.state,'move');$('#dockList').scrollTo({top:sum.offsetTop-8,behavior:RM()?'auto':'smooth'})},.75)
      .fromTo(sum,{autoAlpha:0,y:RM()?0:80,filter:'blur(10px)'},{autoAlpha:1,y:0,filter:'blur(0px)',duration:RM()?.3:1,ease:EO},.85)
      .to(STAR,{boost:.7,duration:.4,ease:EO},.85).to(STAR,{boost:0,duration:1.6,ease:EI},1.25);
  }
  await tlUntil(tl,.6);                            // next card can be flipped while this reading is still sliding in
}
function focusReading(i){
  const el=S.rcards[i];if(!el)return;if(S.dock!=='open')go(async()=>{await tlDone(dockTo('open'))});
  $('#dockList').scrollTo({top:el.offsetTop-8,behavior:RM()?'auto':'smooth'});
  gsap.fromTo(el,{boxShadow:'0 0 0 2px #f2d48a'},{boxShadow:'0 0 0 0px rgba(242,212,138,0)',duration:1.2,ease:EO});
}

/* ---- PHASE 8 · new reading, staged so every step reads:
   (B) opened cards rise and slowly turn face-down, releasing gold motes →
   (C) camera tilts back; corner deck + spread gather into one floating stack →
   (D) the stack bursts into a turning ring of all 78 cards, which collapses into the deck → setup rises ---- */
function ringTL(cards,D){
  const L=S.L,R=Math.min(L.W*.4,L.H*.42,560),n=cards.length,g={r:0,spin:0,lift:140},tl=gsap.timeline();
  const base=cards.map((c,i)=>({a:i/n*Math.PI*2,tp:stackPose(c.idx,D),w:rand(-1,1)}));
  const upd=()=>{const k=g.r/R;cards.forEach((c,i)=>{const b=base[i],a=b.a+g.spin;
    gsap.set(c.el,{x:D.x+Math.cos(a)*g.r,y:D.y+Math.sin(a)*g.r,z:b.tp.z+g.lift+k*36*Math.sin(a*3+g.spin*3),
      rotation:(a/D2R+90)*k,rotationX:(-18+b.w*8)*k,rotationY:0,scale:1})})};
  tl.to(g,{r:R,duration:1.7,ease:'expo.out'},0)
    .to(g,{spin:Math.PI*1.4,duration:RING_DUR,ease:'sine.inOut',onUpdate:upd},0)
    .to(g,{r:0,lift:0,duration:1.8,ease:'power3.in'},RING_DUR-1.8)
    .add(()=>cards.forEach((c,i)=>gsap.set(c.el,base[i].tp)),RING_DUR)
    .add(()=>Sound.whoosh(),0).add(()=>Sound.whoosh(),RING_DUR-1.8)
    .to(STAR,{warp:.35,duration:1.1,ease:EIO},.2).to(STAR,{warp:0,duration:1.6,ease:EO},2.2);
  return tl;
}
const RING_DUR=4.8;
async function newReading(){
  const L=S.L=computeLayout(),tl=gsap.timeline(),picked=S.picked.slice(),shown=picked.filter(c=>c.revealed),D=L.deckSetup;
  unzoom('drop');fxReset();setState('gather');S.armed=null;
  tl.add(pOut('#prompt',{y:-24}),0).add(pOut('#hintRow',{y:30}),0).add(pOut('#shufUI',{y:30}),0).add(pOut('#hud',{y:-20}),0);
  S.dock='hidden';tl.to('#dock',{...dockVars('hidden'),duration:RM()?.25:.9,ease:EIO},0);
  tl.add(()=>padsOut(),0);
  S.deck.forEach(c=>{c.el.classList.remove('lift','armed');gsap.set(c.hov,{clearProps:'all'})});
  const order=fisherYates(S.deck);order.forEach((c,i)=>c.idx=i);S.deck=order;
  const reset=()=>{order.forEach(c=>{c.el.classList.remove('placed','revealed','infan','top');c.placed=false;c.revealed=false;c.reversed=false;c.el.tabIndex=-1;c.el.setAttribute('aria-label','ไพ่คว่ำหน้า')});
    order[77].el.classList.add('top')};
  let end;
  if(RM()){
    shown.forEach(c=>{gsap.set(c.flipEl,{rotationY:0});gsap.set(c.revEl,{rotation:0})});
    tl.add(camTo('setup',.3),0);
    const vt=vortexTL(order,{target:(c,i)=>stackPose(i,D)});tl.add(vt,.3);end=.3+vt.duration();tl.add(reset,end-.3);
  }else{
    const st=Math.min(.4,1.6/Math.max(1,shown.length));               // one card after another, each clearly visible
    shown.forEach((c,k)=>{const t0=.7+k*st;
      tl.to(c.hov,{z:220,y:-24,scale:1.08,duration:.8,ease:EO},t0)
        .add(()=>burnCard(c),t0+.3)                                   // the face burns away, the back re-forms
        .add(()=>releaseFX(c),t0+1.2)
        .to(c.hov,{z:0,y:0,scale:1,duration:.9,ease:EIO},t0+2);
    });
    const tC=(shown.length?.7+(shown.length-1)*st+2.6:.9)+.3;          // short pause once all are face-down
    tl.add(camTo('setup',3.2),tC-.4);
    order.forEach(c=>{const p=pose({x:D.x,y:D.y,z:c.idx*TH+140});
      if(c.placed)tl.to(c.el,{...p,duration:1.6,ease:EIO},tC+picked.indexOf(c)*.14);
      else tl.to(c.el,{...p,duration:1.5,ease:EIO},tC+.15)});
    const tD=tC+1.6+picked.length*.14+.35;
    tl.add(reset,tD).add(ringTL(order,D),tD);
    end=tD+RING_DUR;
  }
  tl.add(ripple(),end-.2).add(pIn('#setup',{y:120}),end-.35).add(pIn('#deckHint',{y:20,d:.8}),end+.1)
    .add(()=>{S.picked=[];S.rest=[];S.fan=[];S.summary=false;$('#dockList').innerHTML='';S.rcards=[];$('#btnNew').style.display='none';
      $('#shuffleRange').value=S.shuffles;$('#shuffleLabel').textContent=`สับไพ่ ${S.shuffles} ครั้ง`;},end-.1)
    .add(pIn('#hud',{y:-20,d:.8}),end).add(()=>previewSpread(),end+.2);
  await tlUntil(tl,end+.15);
  setState('setup');
}

/* ======================================================================
   SECTION 9 · INIT, RESIZE
   ====================================================================== */
function onResize(force){
  if(S.busy&&!force){S.pendingResize=true;return}
  S.L=computeLayout();placeUI();
  const st=S.state;
  if(st==='gather')return;
  unzoom('drop');altarTo(st,.01);
  if(st==='gallery'){S.G=galleryLayout();S.gpan=clamp(S.gpan||0,0,S.G.maxScroll)}
  if(st==='intro'){gsap.set('#tagline',{y:S.L.H*.13});gsap.set('#beginBtn',{y:S.L.H*.24});}
  applyPoses(false);constelRefresh();
  if(['pick','reveal','reading'].includes(st))padsTo(st,'set');
  if(st==='pick')fanTo(false);
}
function init(){
  S.L=computeLayout();buildTitle();buildPads();
  ROOTSTYLE.setProperty('--cw',S.L.cw+'px');
  S.deck=fisherYates(CARDS).map(makeCard);
  const w=$('#world');S.deck.forEach(c=>{w.appendChild(c.el);gsap.set(c.el,{...offPose(c),autoAlpha:0})});
  placeUI();gsap.set('#dock',dockVars('hidden'));
  gsap.set(['#setup','#shufUI','#prompt','#hintRow','#hud','#galBar','#deckHint','#zoomBg'],{autoAlpha:0});
  $$('.opt').forEach(b=>b.addEventListener('click',()=>chooseSpread(b.dataset.spread)));
  $('#shuffleRange').addEventListener('input',e=>{$('#shuffleLabel').textContent=`สับไพ่ ${e.target.value} ครั้ง`});
  $('#beginBtn').onclick=()=>{if(S.state==='intro')go(gather)};
  $('#btnShuffle').onclick=()=>{if(S.state==='setup')go(toShuffle)};
  $('#btnRevealAll').onclick=()=>{if(S.state==='reveal')go(revealAll)};
  $('#btnNew').onclick=()=>{if(['pick','reveal','reading'].includes(S.state))go(newReading)};
  $('#btnSound').onclick=()=>Sound.toggle();
  $('#btnMotion').onclick=()=>setMotion(RM()?'full':'reduced');syncMotionUI();
  const note=$('#motionNote'),hideNote=()=>{if(!note.hidden)gsap.to(note,{autoAlpha:0,duration:.4,onComplete:()=>{note.hidden=true}})};
  if(OS_RM.matches&&!MOTION){note.hidden=false;gsap.fromTo(note,{autoAlpha:0},{autoAlpha:1,duration:.6,delay:.6})}
  $('#motionOn').onclick=()=>{setMotion('full');hideNote();if(S.state==='intro'){S.intro&&S.intro.kill();S.intro=playIntro()}};
  $('#motionKeep').onclick=()=>{setMotion('reduced');hideNote()};
  S.hideNote=hideNote;
  $('#dockToggle').onclick=()=>{if(S.busy||S.dock==='hidden')return;go(async()=>{await tlDone(dockTo(S.dock==='open'?'peek':'open'))})};
  addEventListener('resize',()=>onResize(false));
  prepareBacks();S.intro=playIntro();
  // web fonts change the setup panel's height once loaded; re-measure so the deck and its hint sit above it
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(S.state!=='intro')onResize(false);else{S.L=computeLayout();placeUI()}});
}
init();
