
/* ======================================================================
   SECTION 11 · DECK GALLERY + CARD ZOOM
   setup: drag (or tap) the deck → all 78 cards fly out into a grid, the setup panel sinks,
   the cards flip in a diagonal wave; tap any card to zoom it and read both meanings.
   reveal/reading: tap an opened card to zoom it to full height.
   ====================================================================== */

function galleryLayout(){
  const L=S.L,gap=L.wide?10:8,x0=16,x1=L.W-16,y0=L.hdr+10,y1=L.H-76,bw=x1-x0,bh=y1-y0;
  let best=null;
  for(let cols=6;cols<=20;cols++){const rows=Math.ceil(78/cols),cw=Math.min((bw-(cols-1)*gap)/cols,((bh-(rows-1)*gap)/rows)*7/12);if(!best||cw>best.cw)best={cols,rows,cw}}
  if(best.cw<52){                                         // phones: wider cards, scroll vertically
    const cols=Math.max(4,Math.floor((bw+gap)/(60+gap)));best={cols,rows:Math.ceil(78/cols),cw:(bw-(cols-1)*gap)/cols};
  }
  const cw=best.cw,ch=cw*12/7,gw=best.cols*cw+(best.cols-1)*gap,gh=best.rows*ch+(best.rows-1)*gap;
  return{...best,ch,gap,ox:x0+(bw-gw)/2,oy:y0+Math.max(0,(bh-gh)/2),maxScroll:Math.max(0,gh-bh+8)};
}
function galleryPose(c){
  const G=S.G||(S.G=galleryLayout()),L=S.L,k=c.ord,col=k%G.cols,row=Math.floor(k/G.cols);
  const cx=G.ox+col*(G.cw+G.gap)+G.cw/2,cy=G.oy+row*(G.ch+G.gap)+G.ch/2-(S.gpan||0);
  return pose({x:cx-L.W/2,y:cy-L.H/2,z:.2,scale:G.cw/L.cw});
}
function galScroll(v,anim){
  const G=S.G;if(!G||!G.maxScroll)return;S.gpan=clamp(v,0,G.maxScroll);
  S.deck.forEach(c=>{if(c===S.zoom)return;const p=galleryPose(c);
    if(anim&&!RM())gsap.to(c.el,{x:p.x,y:p.y,duration:.35,ease:EO,overwrite:'auto'});else gsap.set(c.el,{x:p.x,y:p.y})});
}
addEventListener('wheel',e=>{if(S.state==='gallery'&&!S.busy&&!S.zoom)galScroll((S.gpan||0)+e.deltaY,true)},{passive:true});
(function galPan(){
  let d=null;
  document.addEventListener('pointerdown',e=>{
    if(S.state!=='gallery'||S.busy||S.zoom||!S.G||!S.G.maxScroll||e.target.closest?.('button,#info,#galBar'))return;
    d={y:e.clientY,p:S.gpan||0,m:false};
  });
  document.addEventListener('pointermove',e=>{if(!d)return;const dy=e.clientY-d.y;if(!d.m&&Math.abs(dy)>8){d.m=true;S.dragging=true}if(d.m)galScroll(d.p-dy,false)});
  const end=()=>{if(!d)return;const m=d.m;d=null;if(m)setTimeout(()=>{S.dragging=false},60)};
  document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
})();

/* ---- setup: press on the deck and pull → the top cards follow the finger, past 90px the gallery opens; a tap opens it too ---- */
function overDeck(x,y){const r=S.deck[77]&&S.deck[77].el.getBoundingClientRect();return r&&x>r.left-24&&x<r.right+24&&y>r.top-24&&y<r.bottom+24}
(function deckDrag(){
  let d=null;
  const snap=()=>{const D=S.L.deckSetup;d.top.forEach(c=>gsap.to(c.el,{...stackPose(c.idx,D),duration:.45,ease:EO,overwrite:'auto'}));d=null;document.body.style.cursor=''};
  document.addEventListener('pointerdown',e=>{
    if(S.state!=='setup'||S.busy||e.button>0||e.target.closest?.('#setup,#hud,button,input,#dock'))return;
    if(!overDeck(e.clientX,e.clientY))return;
    killPreview();d={x:e.clientX,y:e.clientY,top:S.deck.slice(-6).reverse()};document.body.style.cursor='grabbing';
  });
  document.addEventListener('pointermove',e=>{
    if(!d){if(S.state==='setup'&&!S.busy&&e.pointerType==='mouse')document.body.style.cursor=overDeck(e.clientX,e.clientY)?'grab':'';return}
    const dx=e.clientX-d.x,dy=e.clientY-d.y,D=S.L.deckSetup;
    d.top.forEach((c,k)=>{const f=1-k*.15;gsap.set(c.el,{x:D.x+dx*f,y:D.y+dy*f*1.15,z:c.idx*TH+18+(6-k)*4,rotation:dx*.07*f,rotationX:0,rotationY:0})});
    if(Math.hypot(dx,dy)>90){d=null;document.body.style.cursor='';go(toGallery)}
  });
  document.addEventListener('pointerup',e=>{if(!d)return;const mv=Math.hypot(e.clientX-d.x,e.clientY-d.y);snap();if(mv<8)go(toGallery)});
  document.addEventListener('pointercancel',()=>{if(d)snap()});
})();

async function toGallery(){
  if(S.state!=='setup')return;
  killPreview();S.prevCards=[];S.gpan=0;setState('gallery');S.L=computeLayout();S.G=galleryLayout();placeUI();
  document.body.style.cursor='';
  const tl=gsap.timeline(),rm=RM(),G=S.G,order=S.deck.slice().sort((a,b)=>a.ord-b.ord);
  S.deck.forEach(c=>{renderCardFace(c);c.el.classList.remove('top');c.el.classList.add('gal');gsap.set(c.revEl,{rotation:0});gsap.set(c.hov,{clearProps:'all'})});
  tl.add(pOut('#setup',{y:260,d:1}),0).add(pOut('#deckHint',{y:30}),0).add(camTo('gallery',1.6),0);
  if(!rm)tl.to(STAR,{boost:.6,duration:.5,ease:EO},.2).to(STAR,{boost:0,duration:1.6,ease:EI},.7);
  Sound.whoosh();buzz(15);
  S.deck.forEach(c=>{const p=galleryPose(c);
    if(rm)tl.set(c.el,p,.1);
    else tl.add(flyTo(c,p,{dur:1.2,lift:260,spin:14,side:p.x<0?-1:1,rise:120,ease:'power3.inOut'}),.25+(77-c.idx)*.012)});
  const tF=rm?.3:.25+77*.012+1.2+.2;
  order.forEach((c,k)=>{
    const dl=rm?0:((k%G.cols)+Math.floor(k/G.cols))*.05;
    if(rm)tl.set(c.flipEl,{rotationY:180},tF);else tl.to(c.flipEl,{rotationY:180,duration:.9,ease:'power2.inOut'},tF+dl);
    c.el.tabIndex=0;c.el.setAttribute('aria-label',`${c.name} ${c.th} — กดเพื่อดูความหมาย`);
  });
  tl.add(()=>{Sound.chime();Sound.flip()},tF+.2).add(pIn('#galBar',{y:40}),tF);
  await tlUntil(tl,tF+.2);                                 // cards can be tapped while the flip wave is still rolling
}
async function fromGallery(){
  if(S.state!=='gallery')return;
  unzoom('drop');hideInfo();setState('gather');
  const tl=gsap.timeline(),D=S.L.deckSetup,rm=RM(),G=S.G,order=S.deck.slice().sort((a,b)=>a.ord-b.ord);
  tl.add(pOut('#galBar',{y:40}),0).add(camTo('setup',2.2),.7);
  order.forEach((c,k)=>{const dl=rm?0:((k%G.cols)+Math.floor(k/G.cols))*.03;
    if(rm)tl.set(c.flipEl,{rotationY:0},0);else tl.to(c.flipEl,{rotationY:0,duration:.7,ease:'power2.inOut'},dl)});
  const deck=fisherYates(S.deck);deck.forEach((c,i)=>c.idx=i);S.deck=deck;
  const tB=rm?.1:1.25;
  if(!rm)tl.add(()=>Sound.whoosh(),tB);
  deck.forEach(c=>{
    c.el.classList.remove('gal','gshine');c.el.tabIndex=-1;c.el.setAttribute('aria-label','ไพ่คว่ำหน้า');
    const p=stackPose(c.idx,D);
    if(rm)tl.set(c.el,p,tB);else tl.add(flyTo(c,p,{dur:1.05,lift:240,spin:-12,side:readPose(c.el).x<0?1:-1,rise:140}),tB+c.idx*.011);
  });
  const end=rm?.4:tB+77*.011+1.05;
  tl.add(()=>{deck[77].el.classList.add('top')},end-.1).add(ripple(),end-.15).add(pIn('#setup',{y:120}),end-.35).add(pIn('#deckHint',{y:20,d:.8}),end)
    .add(()=>previewSpread(),end+.2);
  await tlUntil(tl,end+.1);
  S.gpan=0;setState('setup');
}

/* ---- zoom: the tapped card flies to the front at full height over a dimmed table ---- */
function zoomArea(){
  const L=S.L;let x0=16,x1=L.W-16,y0=L.hdr+8,y1=L.H-16;
  if(S.state==='gallery'){if(L.wide)x1=L.W-INFO_W()-30;else y1=L.H-INFO_H()-14}
  else{const b=revealBox();x0=b.x0+12;x1=b.x1-12;y0=Math.max(L.hdr+4,b.y0);y1=Math.max(y0+120,b.y1+30)}
  const h=Math.min(y1-y0,(x1-x0)*12/7)*.95;
  return{cx:(x0+x1)/2-L.W/2,cy:(y0+y1)/2-L.H/2,h};
}
/* The zoomed card is a flat 2D copy (#zoomView) laid out at its real on-screen pixel size, not the 3D
   card scaled up: a 3D card is rasterised at its small table size, so enlarging it looked pixelated.
   The copy starts exactly over the real card (which hides) and grows to full height. */
function zoomFrom(c){                                     // where the real card sits on screen, relative to the zoom target
  const v=$('#zoomView'),r=c.el.getBoundingClientRect(),p=readPose(c.el),vw=parseFloat(v.style.width),vh=parseFloat(v.style.height);
  return{x:r.left+r.width/2-(parseFloat(v.style.left)+vw/2),y:r.top+r.height/2-(parseFloat(v.style.top)+vh/2),scale:S.L.ch*p.scale/vh,rotation:p.rotation||0};
}
function zoomCard(c){
  if(S.zoom===c){unzoom();return}
  if(S.zoom)unzoom('drop');
  S.zoom=c;const L=S.L,A=zoomArea(),h=A.h,w=h*7/12,v=$('#zoomView'),rev=c.reversed&&S.state!=='gallery';
  gsap.killTweensOf(v);
  Object.assign(v.style,{width:w+'px',height:h+'px',left:(L.W/2+A.cx-w/2)+'px',top:(L.H/2+A.cy-h/2)+'px'});
  v.innerHTML=`<div class="zin${rev?' rev':''}">${c.hasImg?`<img src="cards/sm/${c.id}.webp" alt="${c.name} (${c.th})">${cardOverlaySVG(c)}`:cardFaceSVG(c)}<div class="zsheen"></div></div>`;
  if(c.hasImg){const big=new Image();big.src=`cards/${c.id}.webp`;big.decode().then(()=>{const im=v.querySelector('img');if(S.zoom===c&&im)im.src=big.src}).catch(()=>{})}
  const from=zoomFrom(c);
  gsap.set(c.el,{autoAlpha:0});
  if(S.state==='gallery')gsap.to('#galBar',{autoAlpha:0,duration:.3,overwrite:'auto'});
  else gsap.to('#hintPos',{autoAlpha:0,duration:.3,overwrite:'auto'});
  gsap.to('#zoomBg',{autoAlpha:1,duration:RM()?.01:.45,ease:EO,overwrite:true});
  if(RM())gsap.set(v,{x:0,y:0,scale:1,rotation:0,rotationY:0,autoAlpha:1});
  else gsap.fromTo(v,{...from,rotationY:-18,autoAlpha:1},{x:0,y:0,scale:1,rotation:0,rotationY:0,duration:.75,ease:'power3.out',transformPerspective:1400});
  Sound.click(0,.12,2400);buzz(10);
}
/* mode: undefined = shrink back onto the card · 'drop' = close at once (layout is about to change) */
function unzoom(mode){
  const c=S.zoom;if(!c)return;S.zoom=null;const v=$('#zoomView');
  gsap.to('#zoomBg',{autoAlpha:0,duration:RM()||mode==='drop'?.01:.4,overwrite:true});
  if(S.state==='gallery'){hideInfo();gsap.to('#galBar',{autoAlpha:1,duration:.4,delay:.2,overwrite:'auto'})}
  else gsap.to('#hintPos',{autoAlpha:1,duration:.4,delay:.2,overwrite:'auto'});
  const done=()=>{gsap.set(c.el,{autoAlpha:1});gsap.set(v,{autoAlpha:0});v.innerHTML=''};
  gsap.killTweensOf(v);
  if(mode==='drop'||RM()){done();return}
  gsap.to(v,{...zoomFrom(c),rotationY:0,duration:.55,ease:'power3.inOut',onComplete:done});
}
/* zoomed card tilts toward the pointer; the sheen follows it */
(function zoomTilt(){
  document.addEventListener('pointermove',e=>{
    if(!S.zoom||RM())return;const v=$('#zoomView'),z=v.firstElementChild;if(!z)return;
    const r=v.getBoundingClientRect(),u=(e.clientX-r.left)/r.width-.5,w=(e.clientY-r.top)/r.height-.5;
    z.style.setProperty('--sx',(50+u*80)+'%');z.style.setProperty('--sy',(50+w*80)+'%');
    if(e.pointerType==='mouse'&&Math.abs(u)<.7&&Math.abs(w)<.7){gsap.to(z,{rotationY:u*14,rotationX:-w*10,duration:.6,ease:EO,overwrite:'auto',transformPerspective:1200})}
  },{passive:true});
})();
$('#zoomView').addEventListener('click',()=>unzoom());

/* ---- gallery info panel: both orientations of the tapped card ---- */
function showInfo(c){
  const m=getMeaning(c),b=$('#info'),li=a=>a.map(k=>`<li>${k}</li>`).join(''),nt=i=>`<dl class="notes"><div><dt>ความรัก</dt><dd>${m.l[i]}</dd></div><div><dt>การงาน</dt><dd>${m.c[i]}</dd></div><div><dt>การเงิน</dt><dd>${m.f[i]}</dd></div></dl>`;
  $('#infoBody').innerHTML=`<div class="rd-pos">${c.arcana==='major'?`ไพ่ใบใหญ่ (Major Arcana) · ${c.numeral}`:`ไพ่ชุด${SUITS[c.suit].th} (${SUITS[c.suit].en})${c.court?' · ไพ่ราชสำนัก':''}`}</div>
    <h3 class="rd-h">${c.name}<small>${c.th}</small></h3>
    <section class="info-sec"><span class="ori">ไพ่ตั้งตรง</span><ul class="kws">${li(m.ku)}</ul><p class="rd-text">${m.u}</p>${nt(0)}</section>
    <section class="info-sec"><span class="ori r">ไพ่กลับหัว</span><ul class="kws">${li(m.kr)}</ul><p class="rd-text">${m.r}</p>${nt(1)}</section>`;
  b.scrollTop=0;gsap.killTweensOf(b);
  if(b.hidden||+getComputedStyle(b).opacity<.99){b.hidden=false;pIn(b,S.L.wide?{x:70,y:0,d:.6}:{y:90,d:.6})}
  else if(!RM())gsap.fromTo('#infoBody',{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.35,ease:EO});
}
function hideInfo(){const b=$('#info');if(b.hidden)return;gsap.to(b,{autoAlpha:0,duration:RM()?.01:.3,overwrite:true,onComplete:()=>{b.hidden=true}})}

$('#zoomBg').addEventListener('click',()=>unzoom());
$('#infoClose').addEventListener('click',()=>unzoom());
$('#btnGalBack').addEventListener('click',()=>go(fromGallery));
$('#deckHint').addEventListener('click',()=>{if(S.state==='setup')go(toGallery)});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(S.zoom)unzoom();else if(S.state==='gallery'&&!S.busy)go(fromGallery)});
