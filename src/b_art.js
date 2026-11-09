/* ======================================================================
   SECTION 3 · CARD RENDERER  (SVG art + optional cards/{id}.webp)
   ====================================================================== */
const D2R = Math.PI/180;
const f1 = n => Math.round(n*10)/10;
function starPts(cx,cy,R,r,n,rot=-90){
  let p=[]; for(let i=0;i<n*2;i++){const a=(rot+i*180/n)*D2R,rr=i%2?r:R;p.push(f1(cx+rr*Math.cos(a))+','+f1(cy+rr*Math.sin(a)));}
  return p.join(' ');
}
function pentagram(cx,cy,r,rot=-90){
  const v=[0,1,2,3,4].map(i=>[cx+r*Math.cos((rot+i*72)*D2R),cy+r*Math.sin((rot+i*72)*D2R)]);
  return [0,2,4,1,3].map((k,i)=>(i?'L':'M')+f1(v[k][0])+','+f1(v[k][1])).join('')+'Z';
}
const rays=(cx,cy,r1,r2,n,cls='s')=>Array.from({length:n},(_,i)=>{const a=i*360/n*D2R;
  return `<line class="${cls}" x1="${f1(cx+r1*Math.cos(a))}" y1="${f1(cy+r1*Math.sin(a))}" x2="${f1(cx+r2*Math.cos(a))}" y2="${f1(cy+r2*Math.sin(a))}"/>`}).join('');
const tw = (x,y,r=3,d=0)=>`<circle class="f2 tw" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${d}s"/>`;
const stp = (x,y,R,d=0)=>`<polygon class="f2 tw" points="${starPts(x,y,R,R*.42,4)}" style="animation-delay:${d}s"/>`;
const waves=(y,n=3,col='w',gap=14)=>Array.from({length:n},(_,i)=>`<path class="${col}" d="M-100,${y+i*gap}q12.5,-8 25,0t25,0t25,0t25,0t25,0t25,0t25,0t25,0"/>`).join('');
const head=(x,y,r=11)=>`<circle class="n" cx="${x}" cy="${y}" r="${r}"/>`;

/* --- suit glyphs (centered, ~40x56) --- */
const GL = {
  cups:`<path class="f" d="M-17,-22H17C17,0 9,10 0,10C-9,10 -17,0 -17,-22Z"/><path class="s t" style="stroke:#0f1733" d="M-17,-15H17"/><path class="f" d="M-3,10H3V21H-3Z"/><path class="f" d="M-12,21H12V27H-12Z"/>`,
  wands:`<path class="f" d="M-3.5,-28L3.5,-28L5,28L-5,28Z"/><path class="f2" d="M0,-10C-13,-14 -17,-26 -15,-32C-6,-30 0,-22 0,-10Z M0,6C13,2 17,-8 15,-14C6,-12 0,-6 0,6Z"/>`,
  swords:`<path class="f" d="M0,-32L6,-24V8H-6V-24Z"/><path class="f" d="M-16,8H16V14H-16Z"/><path class="f" d="M-3,14H3V26H-3Z"/><circle class="f" cy="29" r="3.6"/>`,
  pentacles:`<circle class="f" r="20" style="opacity:.22"/><circle class="s" r="20"/><circle class="s t" r="16"/><path class="s" d="${pentagram(0,0,13)}"/>`
};
const G=(suit,x,y,s=1,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${GL[suit]}</g>`;

/* --- MAJOR ARCANA illustrations: local box x ±105, y ±145 --- */
const MAJOR_ART = {
fool:()=>`
  <circle class="f2" cx="58" cy="-96" r="20"/>${rays(58,-96,25,36,12)}
  <path class="n" d="M-105,50L-60,-30L-18,50Z"/><path class="n" d="M-40,50L8,-40L60,50Z"/>
  <path class="n" d="M-105,64H-12V145H-105Z"/><path class="s t" d="M-12,64Q20,90 60,64" style="stroke-dasharray:3 5"/>
  <path class="s t" d="M-30,64L40,56" style="stroke-dasharray:4 5"/>
  ${head(-52,-34,10)}<path class="n" d="M-64,-22L-40,-22L-44,28L-60,28Z"/><path class="s" d="M-50,28L-42,62M-56,28L-64,60"/>
  <path class="s k" d="M-36,-28L-12,60"/><path class="s" d="M-46,-24L-20,-62"/><circle class="f2" cx="-16" cy="-66" r="9"/>
  <path class="f" d="M-70,-44L-52,-58L-34,-44Z"/><ellipse class="f2" cx="-86" cy="52" rx="11" ry="7"/><circle class="f2" cx="-96" cy="46" r="5"/>
  ${tw(-85,-110,2,0)}${tw(-60,-125,2.5,.8)}${tw(10,-120,2,1.4)}`,
magician:()=>`
  <path class="s k" d="M0,-108C-16,-130 -48,-130 -48,-108C-48,-86 -16,-86 0,-108C16,-130 48,-130 48,-108C48,-86 16,-86 0,-108Z" style="stroke-width:3.2"/>
  <path class="s k" d="M22,-52L56,-100" style="stroke:#f2d48a"/><circle class="f2" cx="58" cy="-103" r="4"/>
  ${head(0,-62,13)}<path class="f" d="M-14,-70H14L0,-84Z" style="opacity:.0"/>
  <path class="n" d="M-24,-46L24,-46L36,48L-36,48Z"/><path class="s" d="M-24,-40L-52,-4"/><path class="s" d="M0,-46V48" style="stroke-width:1.2"/>
  <rect class="f" x="-86" y="58" width="172" height="12" rx="2"/><path class="s" d="M-70,70V140M70,70V140"/>
  ${G('cups',-60,42,.55)}${G('wands',-20,42,.55)}${G('swords',20,42,.55)}${G('pentacles',60,42,.55)}
  ${tw(-80,-70,2,.2)}${tw(80,-40,2.5,1)}`,
priestess:()=>`
  <rect class="d" x="-100" y="-120" width="30" height="240"/><rect class="f2" x="72" y="-120" width="30" height="240" style="opacity:.9"/>
  <rect class="f" x="-104" y="-128" width="38" height="9"/><rect class="f" x="68" y="-128" width="38" height="9"/>
  <text x="-85" y="-60" text-anchor="middle" class="num" style="font-size:20px">B</text><text x="87" y="-60" text-anchor="middle" class="num" style="font-size:20px;fill:#0b1028">J</text>
  <path class="n" d="M-70,-30C-30,-40 30,-40 70,-30V120H-70Z" style="opacity:.55"/>
  <circle class="f2" cx="0" cy="-102" r="11"/><path class="d" d="M-6,-112A12,12 0 1 0 -6,-92A9,9 0 1 1 -6,-112Z" style="stroke:none;fill:#0f1733"/>
  <path class="s" d="M-32,-100A14,14 0 0 0 -32,-76M32,-100A14,14 0 0 1 32,-76"/>
  ${head(0,-64,13)}<path class="n" d="M-28,-48L28,-48L48,118L-48,118Z"/><path class="s" d="M0,-46V-14M-9,-32H9"/>
  <rect class="f2" x="-18" y="30" width="36" height="22" rx="2"/><text x="0" y="46" text-anchor="middle" class="d" style="font-size:12px;fill:#0b1028;stroke:none;font-family:Cinzel">TORA</text>
  <path class="f2" d="M-30,128A22,22 0 1 0 -30,106A16,16 0 1 1 -30,128Z"/>`,
empress:()=>`
  <circle class="s k" cx="0" cy="-40" r="38"/><circle cx="0" cy="-40" r="30" class="s t"/>
  <path class="s k" d="M0,-2V92M-30,54H30"/>
  ${Array.from({length:11},(_,i)=>{const a=(-160+i*14)*D2R;return tw(f1(Math.cos(a)*68),f1(-40+Math.sin(a)*68),3.4,i*.2)}).join('')}
  ${[-1,1].map(s=>`<path class="s" d="M${s*78},130C${s*84},60 ${s*84},0 ${s*78},-50"/>`+Array.from({length:6},(_,i)=>`<ellipse class="f" cx="${s*(78+(i%2?9:-9))}" cy="${110-i*28}" rx="4" ry="10" transform="rotate(${s*(i%2?30:-30)} ${s*(78+(i%2?9:-9))} ${110-i*28})"/>`).join('')).join('')}
  <path class="f2" d="M0,-40c-8,-10 -22,0 0,16c22,-16 8,-26 0,-16Z" style="opacity:.9"/>`,
emperor:()=>`
  <path class="n" d="M-72,-10H72V120H-72Z"/><path class="n" d="M-62,-96H62V-10H-62Z"/>
  <path class="s k" d="M-62,-96C-90,-100 -92,-132 -70,-136C-58,-136 -56,-124 -64,-122M62,-96C90,-100 92,-132 70,-136C58,-136 56,-124 64,-122"/>
  ${head(0,-52,15)}<path class="f" d="M-18,-66L-18,-86L-9,-76L0,-92L9,-76L18,-86L18,-66Z"/>
  <path class="d" d="M-30,-34H30L38,40H-38Z"/><path class="s" d="M-44,-4L-70,32" /><path class="s k" d="M46,-90V96" style="stroke:#f2d48a"/>
  <ellipse class="s k" cx="46" cy="-98" rx="8" ry="11" style="stroke:#f2d48a"/><path class="s k" d="M34,-76H58" style="stroke:#f2d48a"/>
  <circle class="f2" cx="-66" cy="38" r="9"/><path class="s t" d="M-75,38H-57M-66,29V47"/><path class="s" d="M-72,120V140M72,120V140"/>`,
hierophant:()=>`
  <path class="s k" d="M0,-125V118M-20,-98H20M-30,-72H30M-40,-44H40"/>
  <circle class="f2" cx="0" cy="-125" r="4"/>
  <g transform="translate(-52 90) rotate(-38)"><circle class="s k" cx="0" cy="-34" r="11"/><path class="s k" d="M0,-23V38M0,24H12M0,34H9"/></g>
  <g transform="translate(52 90) rotate(38)"><circle class="s k" cx="0" cy="-34" r="11" style="stroke:#f2d48a"/><path class="s k" d="M0,-23V38M0,24H-12M0,34H-9" style="stroke:#f2d48a"/></g>
  <path class="s" d="M-96,-110V30M96,-110V30M-104,-110H-88M88,-110H104"/>
  ${head(-62,34,8)}${head(62,34,8)}<path class="n" d="M-74,44L-50,44L-54,66L-70,66Z"/><path class="n" d="M74,44L50,44L54,66L70,66Z"/>`,
lovers:()=>`
  <circle class="f2" cx="0" cy="-96" r="22"/>${rays(0,-96,28,40,14)}
  <path class="n" d="M-24,-98C-60,-120 -88,-100 -96,-70C-70,-82 -46,-82 -24,-80Z"/><path class="n" d="M24,-98C60,-120 88,-100 96,-70C70,-82 46,-82 24,-80Z"/>
  ${head(-46,-24,12)}<path class="n" d="M-66,-10L-26,-10L-22,92L-70,92Z"/>
  ${head(46,-24,12)}<path class="d" d="M66,-10L26,-10L22,92L70,92Z"/>
  <path class="f2 tw" d="M0,6C-14,-10 -28,6 0,28C28,6 14,-10 0,6Z"/>
  <path class="s" d="M-46,10L-2,-2M46,10L2,-2"/><path class="s k" d="M-96,92V10" /><circle class="n" cx="-96" cy="0" r="14"/><path class="s k" d="M96,92V10"/><circle class="d" cx="96" cy="0" r="14"/>
  <path class="s" d="M-105,104Q0,92 105,104" /> ${waves(120,1,'w')}`,
chariot:()=>`
  <rect class="n" x="-70" y="-110" width="140" height="14" rx="3"/>${[-52,-26,0,26,52].map((x,i)=>tw(x,-103,2.4,i*.3)).join('')}
  <path class="s" d="M-62,-96V-28M62,-96V-28"/>
  ${head(0,-60,13)}<path class="f" d="M-14,-72L-14,-88L-7,-80L0,-92L7,-80L14,-88L14,-72Z"/><path class="n" d="M-24,-46H24L30,-28H-30Z"/>
  <rect class="d" x="-70" y="-28" width="140" height="70" rx="5"/><circle class="f2" cx="0" cy="8" r="13"/>
  <path class="f2" d="M-13,8L-40,-2L-34,18ZM13,8L40,-2L34,18Z"/>
  ${[-48,48].map(x=>`<circle class="n" cx="${x}" cy="62" r="24"/><circle class="s t" cx="${x}" cy="62" r="6"/>${rays(x,62,6,24,8,'s t')}`).join('')}
  <circle class="d" cx="-50" cy="120" r="12"/><path class="d" d="M-70,144L-62,124H-36L-30,144Z"/>
  <circle class="f2" cx="50" cy="120" r="12"/><path class="f2" d="M70,144L62,124H36L30,144Z"/>`,
strength:()=>`
  <path class="s k" d="M0,-122C-16,-140 -42,-140 -42,-122C-42,-104 -16,-104 0,-122C16,-140 42,-140 42,-122C42,-104 16,-104 0,-122Z" style="stroke-width:3"/>
  ${head(0,-68,13)}${tw(-12,-84,2,0)}${tw(0,-90,2,.4)}${tw(12,-84,2,.8)}
  <path class="n" d="M-30,-52C-10,-60 10,-60 30,-52L36,-24H-36Z"/>
  <polygon class="f" points="${starPts(0,40,66,52,18)}"/><circle class="n" cx="0" cy="40" r="42"/>
  <path class="d" d="M-30,24L-12,18M30,24L12,18"/><circle class="f2" cx="-17" cy="28" r="4"/><circle class="f2" cx="17" cy="28" r="4"/>
  <path class="f2" d="M-7,44H7L0,54Z"/><path class="s" d="M0,54V62M-16,66Q0,78 16,66"/>
  <ellipse class="n" cx="-50" cy="-8" rx="9" ry="22" transform="rotate(34 -50 -8)"/><ellipse class="n" cx="50" cy="-8" rx="9" ry="22" transform="rotate(-34 50 -8)"/>
  <path class="s" d="M-105,130Q0,116 105,130"/>`,
hermit:()=>`
  <path class="n" d="M-110,145L-34,-40L4,40L46,-70L110,145Z" style="opacity:.7"/>
  <path class="f2" d="M-34,-40L-46,-16L-34,-24L-24,-12Z" style="opacity:.7"/><path class="f2" d="M46,-70L34,-40L46,-48L56,-38Z" style="opacity:.7"/>
  <path class="d" d="M0,-96C-26,-76 -34,-24 -40,86H40C34,-24 26,-76 0,-96Z"/><path class="s" d="M0,-96C-14,-82 -14,-52 0,-44C14,-52 14,-82 0,-96Z"/>
  <path class="s k" d="M52,-100V118" style="stroke:#f2d48a"/><circle class="s" cx="52" cy="-104" r="5"/>
  <circle class="f2" cx="-50" cy="-4" r="40" style="opacity:.16"/><circle class="f2 tw" cx="-50" cy="-4" r="24" style="opacity:.25"/>
  <path class="s" d="M-62,-30H-38V22H-62ZM-56,-30V-38H-44V-30"/><polygon class="s t" points="${starPts(-50,-4,13,6,6)}" style="fill:#f2d48a"/>
  <path class="s" d="M-38,-4L-20,-6"/>`,
wheel:()=>`
  <circle class="s t" cx="0" cy="0" r="104" style="opacity:.5"/>
  <g class="spin"><circle class="s k" r="86"/><circle class="s" r="62"/><circle class="s t" r="74" style="stroke-dasharray:2 7"/>
    ${rays(0,0,16,62,8,'s')}${Array.from({length:8},(_,i)=>{const a=i*45*D2R;return `<circle class="f2" cx="${f1(Math.cos(a)*74)}" cy="${f1(Math.sin(a)*74)}" r="4"/>`}).join('')}
    ${['T','A','R','O'].map((l,i)=>{const a=(i*90-90)*D2R;return `<text x="${f1(Math.cos(a)*74)}" y="${f1(Math.sin(a)*74+5)}" text-anchor="middle" class="num" style="font-size:15px" transform="rotate(${i*90} ${f1(Math.cos(a)*74)} ${f1(Math.sin(a)*74)})">${l}</text>`}).join('')}
    <circle class="n" r="16"/><circle class="f2" r="5"/></g>
  <path class="n" d="M-18,-130A8,8 0 1 1 18,-130L18,-112H-18Z" style="opacity:.0"/>
  ${G('cups',-92,-118,.45)}${G('wands',92,-118,.45)}${G('swords',-92,118,.45)}${G('pentacles',92,118,.45)}
  ${stp(0,-128,10,.3)}${stp(0,128,8,1)}`,
justice:()=>`
  <path class="s" d="M-100,-124V126M100,-124V126"/><rect class="f" x="-106" y="-132" width="12" height="8"/><rect class="f" x="94" y="-132" width="12" height="8"/>
  ${head(0,-76,13)}<path class="f" d="M-15,-88L-15,-106L-7,-98L0,-110L7,-98L15,-106L15,-88Z"/>
  <path class="n" d="M-30,-60H30L40,84H-40Z"/><path class="s" d="M0,-60V84" style="stroke-width:1.2"/>
  <path class="f2" d="M52,-140L58,-130V30H46V-130Z"/><rect class="f" x="36" y="30" width="32" height="7"/><rect class="f" x="49" y="37" width="6" height="18"/>
  <path class="s k" d="M-62,-52V30"/><path class="s k" d="M-92,-40H-32" style="stroke:#f2d48a"/>
  <path class="s" d="M-92,-40L-100,-4M-92,-40L-84,-4M-32,-40L-40,-4M-32,-40L-24,-4"/>
  <path class="f2" d="M-102,-4H-82A10,8 0 0 1 -102,-4ZM-42,-4H-22A10,8 0 0 1 -42,-4Z"/>`,
hanged:()=>`
  <path class="s k" d="M-76,140V-118H76V140" style="stroke-width:5"/><path class="s" d="M-86,-118H86" />
  <path class="s" d="M0,-118V-98"/><path class="s k" d="M0,-98V-52"/><path class="s k" d="M0,-98L-24,-66L0,-52"/>
  <path class="n" d="M-20,-52H20L14,32H-14Z"/><path class="s" d="M-14,26L-34,2L-8,0M14,26L34,2L8,0"/>
  <circle class="f2" cx="0" cy="62" r="26" style="opacity:.28"/>${head(0,56,13)}<circle class="s t" cx="0" cy="56" r="25" style="stroke:#f2d48a"/>
  ${rays(0,56,28,38,12,'s t')}`,
death:()=>`
  <path class="s k" d="M-64,142L56,-112" style="stroke-width:5"/>
  <path class="f" d="M56,-112C6,-140 -54,-118 -84,-66C-42,-98 8,-100 52,-94Z"/>
  <circle class="d" cx="-10" cy="-10" r="26"/><rect class="d" x="-20" y="12" width="20" height="14" rx="2"/>
  <circle class="f" cx="-20" cy="-12" r="6" style="fill:#0b1028"/><circle class="f" cx="2" cy="-12" r="6" style="fill:#0b1028"/><path class="s t" d="M-9,-2L-12,6H-6ZM-14,26V12M-6,26V12"/>
  <path class="s" d="M-105,106H105"/><path class="f2" d="M-34,106A34,34 0 0 1 34,106Z" style="opacity:.9"/>${rays(0,106,40,56,9,'s t').replace(/y1="(\d+\.?\d*)"/g,'y1="$1"')}
  <path class="n" d="M-100,106V60H-80V106M80,106V60H100V106"/>`,
temperance:()=>`
  <path class="n" d="M-18,-60C-60,-100 -92,-84 -98,-46C-72,-62 -44,-52 -18,-30Z"/><path class="n" d="M18,-60C60,-100 92,-84 98,-46C72,-62 44,-52 18,-30Z"/>
  <circle class="s t" cx="0" cy="-98" r="18" style="stroke:#f2d48a"/>${head(0,-82,12)}
  <path class="n" d="M-26,-62H26L36,38H-36Z"/><rect class="s t" x="-9" y="-40" width="18" height="18"/><path class="s t" d="M0,-40L-9,-22H9Z"/>
  <path class="f" d="M-76,20H-52L-56,50A10,6 0 0 1 -72,50Z" transform="rotate(-24 -64 36)"/>
  <path class="f" d="M52,64H76L72,94A10,6 0 0 1 56,94Z"/>
  <path class="w flow" d="M-78,42C-60,70 -20,24 20,56S52,70 62,66"/>
  ${waves(110,2,'w',16)}`,
devil:()=>`
  <path class="s k" d="M-30,-98C-62,-134 -86,-116 -74,-88M30,-98C62,-134 86,-116 74,-88"/>
  <path class="d" d="M-34,-96H34L24,-58H-24Z"/><circle class="f2" cx="-12" cy="-80" r="4"/><circle class="f2" cx="12" cy="-80" r="4"/><path class="s t" d="M-10,-66Q0,-60 10,-66"/>
  <circle class="s k" cx="0" cy="-8" r="46"/><path class="s k" d="${pentagram(0,-8,42,90)}" style="fill:rgba(212,175,106,.15)"/>
  <path class="s" d="M-20,30L-56,78M20,30L56,78" style="stroke-dasharray:5 3"/>
  ${[-56,56].map(x=>`${head(x,92,10)}<path class="s t" d="M${x-9},84L${x-14},72M${x+9},84L${x+14},72"/><path class="n" d="M${x-14},102H${x+14}L${x+10},132H${x-10}Z"/>`).join('')}
  ${tw(-90,-30,2,0)}${tw(90,-10,2,.6)}`,
tower:()=>`
  <path class="n" d="M-34,-20H34L40,130H-40Z"/><path class="n" d="M-46,-20H46V-50H34V-38H20V-50H8V-38H-8V-50H-20V-38H-34V-50H-46Z" transform="translate(30 -52) rotate(16)"/>
  <rect class="d" x="-8" y="10" width="16" height="22" rx="8"/><rect class="d" x="-8" y="64" width="16" height="22" rx="8"/>
  <path class="s" d="M-34,40H36M-37,86H38" style="stroke-width:1"/>
  <path class="f2" d="M-80,-142L-44,-96L-62,-94L-26,-40L-38,-44L-10,4L-22,-34L-8,-36Z"/>
  <path class="f tw" d="M40,40C30,24 40,12 44,0C56,16 60,30 52,44Z"/><path class="f tw" d="M-40,60C-50,44 -40,32 -36,22C-24,38 -20,50 -28,64Z" style="animation-delay:.7s"/>
  ${head(70,-8,7)}<path class="s t" d="M70,0L62,26L72,40M70,0L82,22"/>${head(-72,34,7)}<path class="s t" d="M-72,42L-80,70L-66,84M-72,42L-60,60"/>
  <path class="s" d="M-105,138Q0,122 105,138"/>${tw(-88,-130,2,.2)}${tw(88,-120,2,.9)}`,
star:()=>`
  <circle class="f2" cx="0" cy="-62" r="70" style="opacity:.08"/>
  <polygon class="f2 tw" points="${starPts(0,-62,66,24,8)}" style="animation-duration:3.4s"/><polygon class="s t" points="${starPts(0,-62,66,24,8)}"/>
  ${[[-84,-114],[84,-114],[-96,-52],[96,-52],[-72,6],[72,6],[0,-132]].map(([x,y],i)=>`<polygon class="f tw" points="${starPts(x,y,10,4,5)}" style="animation-delay:${i*.35}s"/>`).join('')}
  ${waves(40,5,'w',18)}<path class="s t" d="M-100,126Q0,110 100,126"/>`,
moon:()=>`
  ${rays(0,-78,52,70,16,'s t')}
  <path class="f2" d="M14,-122A44,44 0 1 0 14,-34A33,33 0 1 1 14,-122Z"/>
  <path class="n" d="M-100,120V16H-72V4H-62V16H-50V4H-40V16H-34V120Z"/><path class="n" d="M100,120V16H72V4H62V16H50V4H40V16H34V120Z"/>
  <rect class="d" x="-78" y="46" width="10" height="18" rx="5"/><rect class="d" x="68" y="46" width="10" height="18" rx="5"/>
  <path class="s k" d="M-12,142C-30,108 22,92 2,62C-8,46 12,36 6,22" style="stroke-dasharray:8 7"/>
  <path class="d" d="M-28,92L-22,76L-14,90Z"/><path class="d" d="M28,92L22,76L14,90Z"/>
  ${waves(120,2,'w',12)}${tw(-52,-132,2,.2)}${tw(60,-130,2,1)}`,
sun:()=>`
  <polygon class="f" points="${starPts(0,-46,80,56,16)}"/><circle class="f2" cx="0" cy="-46" r="46"/>
  <circle class="d" cx="-16" cy="-56" r="4" style="fill:#0b1028"/><circle class="d" cx="16" cy="-56" r="4" style="fill:#0b1028"/><path class="s t" d="M-18,-34Q0,-20 18,-34" style="stroke:#0b1028"/>
  <rect class="n" x="-105" y="76" width="210" height="14"/>${[-76,-26,26,76].map((x,i)=>`<polygon class="f2 tw" points="${starPts(x,62,17,8,12)}" style="animation-delay:${i*.4}s"/><circle class="d" cx="${x}" cy="62" r="6"/><path class="s t" d="M${x},78V76"/>`).join('')}
  ${head(0,108,10)}<path class="s k" d="M-10,128L-26,104M10,128L26,104"/><path class="n" d="M-12,118H12L10,142H-10Z"/>`,
judgement:()=>`
  <path class="n" d="M-100,50L-56,-10L-20,40L30,-30L100,50Z" style="opacity:.55"/>
  ${head(0,-98,12)}<circle class="s t" cx="0" cy="-98" r="20" style="stroke:#f2d48a"/>
  <path class="n" d="M-12,-86C-56,-100 -92,-80 -102,-44C-74,-60 -44,-54 -18,-42Z"/><path class="n" d="M12,-86C56,-100 92,-80 102,-44C74,-60 44,-54 18,-42Z"/>
  <path class="n" d="M-18,-82H18L22,-30H-22Z"/>
  <path class="f2" d="M18,-76L84,-110L90,-92L28,-60Z"/><path class="f2" d="M84,-114L98,-122V-92L90,-88Z"/>
  <rect class="d" x="52" y="-80" width="28" height="22" transform="rotate(-8 66 -70)"/><path class="s t" d="M66,-80V-58M55,-69H77" transform="rotate(-8 66 -70)" style="stroke:#f2d48a"/>
  <path class="s" d="M-100,-14Q-70,-26 -40,-14T20,-14T100,-14" style="opacity:.6"/>
  ${[-62,0,62].map(x=>`<rect class="d" x="${x-22}" y="96" width="44" height="22" rx="2"/>${head(x,76,9)}<path class="n" d="M${x-10},86H${x+10}L${x+8},98H${x-8}Z"/><path class="s k" d="M${x-8},88L${x-22},62M${x+8},88L${x+22},62"/>`).join('')}`,
world:()=>`
  <ellipse class="s t" rx="76" ry="112" style="opacity:.5"/>
  ${Array.from({length:22},(_,i)=>{const a=i*360/22*D2R,x=f1(Math.cos(a)*76),y=f1(Math.sin(a)*112),r=f1(a*180/Math.PI+90);return `<ellipse class="f${i%2?'2':''}" cx="${x}" cy="${y}" rx="5" ry="12" transform="rotate(${r} ${x} ${y})"/>`}).join('')}
  <path class="s k" d="M-16,-116L16,116M16,-116L-16,116" style="stroke:#f2d48a;opacity:.0"/>
  <path class="f2" d="M-20,-110L20,-110L8,-102L20,-94L-20,-94L-8,-102Z"/><path class="f2" d="M-20,110L20,110L8,102L20,94L-20,94L-8,102Z"/>
  ${head(0,-52,12)}<path class="s k" d="M-6,-40C-22,-16 22,0 4,28C-4,44 10,60 18,76M-6,-40L-34,-10M-6,-40L30,-26"/><path class="n" d="M-8,-40C14,-34 20,0 4,28Z" style="opacity:.8"/>
  <path class="s k" d="M-40,-22L-26,-4" /><path class="s k" d="M24,-44L40,-70" style="stroke:#f2d48a"/><path class="s k" d="M-46,-10L-30,6" style="stroke:#f2d48a"/>
  ${[[-90,-124,'<path class="f2" d="M-10,-4L0,-12L10,-4L0,8Z"/>'],[90,-124,'<path class="f2" d="M-10,4L0,-10L10,4L0,-2Z"/>'],
     [-90,124,'<path class="f2" d="M-9,-6A9,9 0 0 0 9,-6A9,9 0 0 1 -9,-6ZM-4,0A4,4 0 1 0 4,0A4,4 0 1 0 -4,0Z"/>'],[90,124,'<polygon class="f2" points="'+starPts(0,0,10,5,8)+'"/>']]
     .map(([x,y,g])=>`<circle class="n" cx="${x}" cy="${y}" r="16"/><g transform="translate(${x} ${y})">${g}</g>`).join('')}`
};

/* --- MINOR ARCANA --- */
const PIPS = {
  2:[[0,-74],[0,74]],
  3:[[0,-94],[0,0],[0,94]],
  4:[[-44,-72],[44,-72],[-44,72],[44,72]],
  5:[[-44,-82],[44,-82],[0,0],[-44,82],[44,82]],
  6:[[-44,-94],[44,-94],[-44,0],[44,0],[-44,94],[44,94]],
  7:[[-44,-94],[44,-94],[0,-47],[-44,0],[44,0],[-44,94],[44,94]],
  8:[[-44,-106],[44,-106],[-44,-36],[44,-36],[-44,36],[44,36],[-44,106],[44,106]],
  9:[[-44,-106],[44,-106],[-44,-36],[44,-36],[-44,36],[44,36],[-44,106],[44,106],[0,0]],
  10:[[-44,-106],[44,-106],[-44,-36],[44,-36],[-44,36],[44,36],[-44,106],[44,106],[0,-71],[0,71]]
};
function pipArt(suit,n){
  const s = n<=3?1.7: n<=7?1.35:1.02;
  return PIPS[n].map(([x,y],i)=>G(suit,x,y,s,(suit==='wands'&&x!==0)?(x<0?-14:14):0)
    ).join('') + (n>=4?`<path class="s t" d="M-70,-130V130M70,-130V130" style="opacity:.0"/>`:'');
}
function aceArt(suit){
  return `<circle class="f2" r="96" style="opacity:.07"/>${rays(0,0,84,106,24,'s t')}<circle class="s t" r="78"/>
    ${G(suit,0,4,3.3)}${stp(-70,-96,9,0)}${stp(70,-96,9,.6)}${stp(-70,100,9,1.2)}${stp(70,100,9,1.8)}`;
}
function courtArt(suit,n){
  const crown = {
    11:`<path class="f" d="M-26,-76C-26,-104 26,-108 30,-88C14,-98 -2,-92 -26,-76Z"/><path class="s" d="M24,-96C40,-124 56,-120 60,-112C46,-112 40,-104 28,-92"/>`,
    12:`<path class="f" d="M-28,-74A28,28 0 0 1 28,-74V-62H-28Z"/><path class="s t" d="M-20,-70H20" style="stroke:#0f1733"/><path class="s" d="M0,-102C14,-124 40,-122 46,-104C34,-112 22,-108 8,-98"/>`,
    13:`<path class="f" d="M-34,-68L-36,-98L-18,-82L0,-104L18,-82L36,-98L34,-68Z"/><circle class="f2" cx="0" cy="-86" r="3.4"/>`,
    14:`<path class="f" d="M-38,-68L-40,-104L-20,-86L0,-110L20,-86L40,-104L38,-68Z"/><path class="f2" d="M-3,-130H3V-114H-3Z M-9,-124H9V-120H-9Z"/>`
  }[n];
  return `<circle class="s t" cx="0" cy="70" r="52" style="opacity:.7"/>
    ${crown}<circle class="n" cx="0" cy="-48" r="21"/><path class="n" d="M-52,-14C-30,-28 30,-28 52,-14L58,18H-58Z"/><path class="s t" d="M0,-24V18"/>
    ${G(suit,0,70,2.0)}${stp(-80,-100,8,0)}${stp(80,-100,8,.7)}`;
}

/* --- Face composer --- */
function artFor(card){
  if(card.arcana==='major') return MAJOR_ART[card.art]();
  if(card.num===1) return aceArt(card.suit);
  if(card.num<=10) return pipArt(card.suit,card.num);
  return courtArt(card.suit,card.num);
}
function cardFaceSVG(card){
  const small = card.numeral.length>5;
  return `<svg class="cardsvg" viewBox="0 0 280 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${card.name}">
    <rect width="280" height="480" fill="#0f1733"/>
    <rect x="7" y="7" width="266" height="466" rx="13" fill="none" stroke="#d4af6a" stroke-width="3"/>
    <rect x="16" y="16" width="248" height="448" rx="8" fill="none" stroke="#d4af6a" stroke-opacity=".7" stroke-width="1"/>
    ${[[16,16],[264,16],[16,464],[264,464]].map(([x,y])=>`<polygon points="${x},${y-6} ${x+6},${y} ${x},${y+6} ${x-6},${y}" fill="#f2d48a"/>`).join('')}
    <text x="140" y="52" text-anchor="middle" class="num" ${small?'style="font-size:15px"':''}>${card.numeral}</text>
    <g transform="translate(140 218)">${artFor(card)}</g>
    <path d="M52,384H228" stroke="#d4af6a" stroke-opacity=".6"/><polygon points="140,380 144,384 140,388 136,384" fill="#f2d48a"/>
    <text x="140" y="413" text-anchor="middle" class="en">${card.name}</text>
    <text x="140" y="440" text-anchor="middle" class="th">${card.th}</text>
  </svg>`;
}

/* --- Card back: frame + separate mandala layer (rasterised once, shared by all 78 cards) --- */
const BACK_FRAME_SVG = `<svg viewBox="0 0 280 480" xmlns="http://www.w3.org/2000/svg">
    <rect width="280" height="480" rx="14" fill="#1a1440"/>
    <rect x="7" y="7" width="266" height="466" rx="13" fill="none" stroke="#d4af6a" stroke-width="3"/>
    <rect x="16" y="16" width="248" height="448" rx="8" fill="none" stroke="#d4af6a" stroke-opacity=".7" stroke-width="1"/>
    <rect x="28" y="28" width="224" height="424" rx="6" fill="none" stroke="#d4af6a" stroke-opacity=".25" stroke-width="1"/>
    <circle cx="140" cy="240" r="118" fill="rgba(242,212,138,.06)"/>
    <circle cx="140" cy="240" r="92" fill="none" stroke="#d4af6a" stroke-opacity=".5"/>
    ${[[40,40],[240,40],[40,440],[240,440]].map(([x,y])=>`<polygon points="${starPts(x,y,9,4,4)}" fill="#f2d48a"/>`).join('')}
    <polygon points="140,38 146,46 140,54 134,46" fill="#f2d48a"/><polygon points="140,426 146,434 140,442 134,434" fill="#f2d48a"/>
  </svg>`;
const MANDALA_SVG = (()=>{
  const petals = Array.from({length:12},(_,i)=>`<ellipse cx="0" cy="-62" rx="13" ry="40" transform="rotate(${i*30})" fill="rgba(212,175,106,.12)" stroke="#d4af6a" stroke-width="1.4"/>`).join('');
  const petals2 = Array.from({length:8},(_,i)=>`<path d="M0,-30Q12,-52 0,-76Q-12,-52 0,-30Z" transform="rotate(${i*45+22.5})" fill="rgba(242,212,138,.35)" stroke="#f2d48a" stroke-width="1"/>`).join('');
  const dots = Array.from({length:36},(_,i)=>{const a=i*10*D2R;return `<circle cx="${f1(Math.cos(a)*104)}" cy="${f1(Math.sin(a)*104)}" r="${i%3?1.4:2.4}" fill="#f2d48a"/>`}).join('');
  return `<svg viewBox="-140 -140 280 280" xmlns="http://www.w3.org/2000/svg"><circle r="112" fill="none" stroke="#d4af6a" stroke-width="1.2"/>${dots}${petals}${petals2}
    <polygon points="${starPts(0,0,30,14,8)}" fill="rgba(242,212,138,.9)"/><circle r="9" fill="#1a1440" stroke="#f2d48a" stroke-width="1.5"/></svg>`;
})();
const svgURL = s => 'url("data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)+'")';
async function rasterize(svg,w,h){
  const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await img.decode();
  const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);return 'url("'+c.toDataURL('image/png')+'")';
}
async function prepareBacks(){
  const R=document.documentElement.style;
  R.setProperty('--backImg',svgURL(BACK_FRAME_SVG));R.setProperty('--mandImg',svgURL(MANDALA_SVG));
  try{R.setProperty('--backImg',await rasterize(BACK_FRAME_SVG,420,720));R.setProperty('--mandImg',await rasterize(MANDALA_SVG,420,420));}catch(e){}
  // painted card back (cards/back.webp) replaces the SVG frame + spinning mandala when present
  if(await CardImages.probe('back','cards/back.webp')){R.setProperty('--backImg','url("cards/back.webp")');document.documentElement.classList.add('imgback')}
}

/* --- Image-or-SVG renderer ---
   cards/sm/{id}.webp (350x600) is the everyday face; cards/{id}.webp (840x1440) is swapped in when zoomed.
   Images are full-bleed art with no text: the gold frame, numeral and names are drawn on top by
   cardOverlaySVG so all 78 cards share identical framing and crisp Thai text. tools/make_cards.py builds them. */
const CardImages = {
  cache:new Map(),
  probe(id,src=`cards/sm/${id}.webp`){
    if(!this.cache.has(src)) this.cache.set(src,new Promise(res=>{
      const im=new Image(); im.onload=()=>res(true); im.onerror=()=>res(false); im.src=src;
    }));
    return this.cache.get(src);
  }
};
(function overlayDefs(){                                      // gradients shared by every overlay (defined once)
  const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('width','0');s.setAttribute('height','0');s.setAttribute('aria-hidden','true');
  s.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
  s.innerHTML=`<defs><linearGradient id="ovBan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f" stop-opacity="0"/><stop offset=".38" stop-color="#05070f" stop-opacity=".86"/><stop offset="1" stop-color="#05070f" stop-opacity=".96"/></linearGradient>
    <linearGradient id="ovTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f" stop-opacity=".7"/><stop offset="1" stop-color="#05070f" stop-opacity="0"/></linearGradient>
    <radialGradient id="ovVig" cx=".5" cy=".45" r=".78"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient></defs>`;
  document.body.appendChild(s);
})();
function cardOverlaySVG(card){
  const en=card.name,enSz=en.length>17?13.5:en.length>13?15:16.5,num=card.numeral,nSz=num.length>4?13:17,pw=Math.max(46,num.length*11+22);
  return `<svg class="cardsvg ov" viewBox="0 0 280 480" preserveAspectRatio="none" aria-hidden="true">
    <rect width="280" height="480" fill="url(#ovVig)"/>
    <rect width="280" height="80" fill="url(#ovTop)"/>
    <rect y="350" width="280" height="130" fill="url(#ovBan)"/>
    <rect x="7" y="7" width="266" height="466" rx="13" fill="none" stroke="#d4af6a" stroke-width="3"/>
    <rect x="16" y="16" width="248" height="448" rx="8" fill="none" stroke="#d4af6a" stroke-opacity=".6" stroke-width="1"/>
    ${[[16,16],[264,16],[16,464],[264,464]].map(([x,y])=>`<polygon points="${x},${y-6} ${x+6},${y} ${x},${y+6} ${x-6},${y}" fill="#f2d48a"/>`).join('')}
    <rect x="${140-pw/2}" y="22" width="${pw}" height="27" rx="4" fill="#0b1028" fill-opacity=".82" stroke="#d4af6a" stroke-opacity=".8"/>
    <text x="140" y="${41-(17-nSz)/2}" text-anchor="middle" class="num" style="font-size:${nSz}px">${num}</text>
    <path d="M52,408H128M152,408H228" stroke="#d4af6a" stroke-opacity=".65"/><polygon points="140,403 145,408 140,413 135,408" fill="#f2d48a"/>
    <text x="140" y="434" text-anchor="middle" class="en" style="font-size:${enSz}px">${en}</text>
    <text x="140" y="456" text-anchor="middle" class="th">${card.th}</text>
  </svg>`;
}
function renderCardFace(card){
  const host = card.faceEl;
  if(card.faceDone) return; card.faceDone = true;
  host.innerHTML = cardFaceSVG(card);                         // SVG fallback first (cards are face-down when this runs)
  CardImages.probe(card.id).then(ok=>{
    if(ok){host.innerHTML = `<img src="cards/sm/${card.id}.webp" alt="${card.name} (${card.th})" draggable="false" decoding="async">${cardOverlaySVG(card)}`;card.hasImg=true;card.el&&card.el.classList.add('art');if(card.placed)hiResFace(card)}
  });
}
/* zoomed card: swap the 350px face for the 840px one once it has loaded */
function hiResFace(card){
  if(typeof S!=='undefined'&&S.L&&S.L.px*(devicePixelRatio||1)<=380)return;   // the 350px file is already enough here
  const im=card.hasImg&&card.faceEl.querySelector('img');if(!im||im.dataset.hi)return;im.dataset.hi='1';
  const big=new Image();big.src=`cards/${card.id}.webp`;big.decode().then(()=>{im.src=big.src}).catch(()=>{});
}
