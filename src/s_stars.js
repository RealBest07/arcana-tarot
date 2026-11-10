/* ======================================================================
   RITE · ดาวเกิด (birth sky) — loaded on demand from the rite chooser (built to stars.js).
   The sky above a Thai city at the moment of birth: bright stars and constellation figures from
   real J2000 positions (no precession, good to about a degree), sun and moon from low-precision
   formulas, faint stars and the Milky Way as decoration laid along the galactic plane.
   The visitor joins stars into a constellation of their own and saves it as a PNG.
   Uses the page's globals: gsap, S, STAR, Sound, $, $$, RM, rand, clamp, esc, D2R, TAU, EO, EI, EIO,
   pIn, pOut, setState, moonInfo, typeIn, buzz, rr, diamond, wrapLines, loadArt, coverDraw, setLS, PNG.
   ====================================================================== */
window.StarRite=(function(){
/* ---- data: name | Thai name | RA (h) | Dec (°) | mag | constellation ---- */
const BRIGHT=`Sirius|ซิริอุส|6.752|-16.716|-1.46|CMa
Canopus|คาโนปัส|6.399|-52.696|-.74|Car
Rigil Kentaurus|ริจิลเคนทอรัส|14.660|-60.834|-.27|Cen
Arcturus|อาร์คทูรัส|14.261|19.182|-.05|Boo
Vega|เวกา|18.616|38.784|.03|Lyr
Capella|คาเพลลา|5.278|45.998|.08|Aur
Rigel|ไรเจล|5.242|-8.202|.13|Ori
Procyon|โปรซีออน|7.655|5.225|.34|CMi
Achernar|อาเคอร์นาร์|1.629|-57.237|.46|Eri
Betelgeuse|บีเทลจุส|5.919|7.407|.5|Ori
Hadar|ฮาดาร์|14.064|-60.373|.61|Cen
Altair|อัลแทร์|19.846|8.868|.76|Aql
Acrux|อาครักซ์|12.443|-63.099|.77|Cru
Aldebaran|อัลดีบาแรน|4.599|16.509|.85|Tau
Antares|แอนทาเรส|16.490|-26.432|1.06|Sco
Spica|สไปกา|13.420|-11.161|.97|Vir
Pollux|พอลลักซ์|7.755|28.026|1.14|Gem
Fomalhaut|โฟมัลฮอต|22.961|-29.622|1.16|PsA
Deneb|เดเนบ|20.690|45.280|1.25|Cyg
Mimosa|มิโมซา|12.795|-59.689|1.25|Cru
Regulus|เรกูลัส|10.140|11.967|1.35|Leo
Adhara|อาดารา|6.977|-28.972|1.5|CMa
Castor|แคสเตอร์|7.577|31.888|1.58|Gem
Gacrux|กาครักซ์|12.519|-57.113|1.59|Cru
Shaula|ชอลา|17.560|-37.104|1.62|Sco
Bellatrix|เบลลาทริกซ์|5.418|6.350|1.64|Ori
Elnath|เอลแนท|5.438|28.608|1.65|Tau
Miaplacidus|ไมอาพลาซิดัส|9.220|-69.717|1.67|Car
Alnilam|อัลนิแลม|5.604|-1.202|1.69|Ori
Alnair|อัลแนร์|22.137|-46.961|1.74|Gru
Alnitak|อัลนิแทก|5.679|-1.943|1.77|Ori
Alioth|อะลิออท|12.900|55.960|1.77|UMa
Dubhe|ดูเบ|11.062|61.751|1.79|UMa
Mirfak|เมียร์ฟัก|3.405|49.861|1.8|Per
Wezen|วีเซน|7.140|-26.393|1.83|CMa
Kaus Australis|เคาส์ออสตราลิส|18.403|-34.385|1.85|Sgr
Avior|เอเวียร์|8.375|-59.510|1.86|Car
Alkaid|อัลไคด์|13.792|49.313|1.86|UMa
Sargas|ซาร์กัส|17.622|-42.998|1.86|Sco
Menkalinan|เมนคาลินาน|5.992|44.948|1.9|Aur
Alhena|อัลฮีนา|6.629|16.399|1.93|Gem
Mirzam|เมียร์ซัม|6.378|-17.956|1.98|CMa
Alphard|อัลฟาร์ด|9.460|-8.659|1.98|Hya
Polaris|ดาวเหนือ|2.530|89.264|1.98|UMi
Hamal|ฮามัล|2.120|23.463|2|Ari
Algieba|อัลจีบา|10.333|19.842|2|Leo
Nunki|นุงกิ|18.921|-26.297|2.05|Sgr
Menkent|เมนเคนต์|14.111|-36.370|2.06|Cen
Alpheratz|อัลเฟอแรตซ์|.140|29.091|2.06|And
Saiph|ไซฟ์|5.796|-9.670|2.06|Ori
Mirach|มิราค|1.162|35.621|2.07|And
Kochab|โคแคบ|14.845|74.155|2.08|UMi
Rasalhague|ราสอัลเฮก|17.582|12.560|2.08|Oph
Algol|อัลกอล|3.136|40.956|2.1|Per
Almach|อัลมาค|2.065|42.330|2.1|And
Denebola|เดเนโบลา|11.818|14.572|2.14|Leo
Gamma Cas|แกมมาแคสซิโอเปีย|.945|60.717|2.15|Cas
Gamma Cen|แกมมาคนครึ่งม้า|12.692|-48.960|2.2|Cen
Aspidiske|แอสพิดิสกี|9.285|-59.275|2.2|Car
Sadr|ซาเดอร์|20.370|40.257|2.2|Cyg
Alphecca|อัลเฟกกา|15.578|26.715|2.2|CrB
Mintaka|มินทากา|5.533|-.299|2.23|Ori
Schedar|เชดาร์|.675|56.537|2.24|Cas
Caph|แคฟ|.153|59.150|2.27|Cas
Dschubba|ดชุบบา|16.006|-22.622|2.29|Sco
Eps Sco|เอปไซลอนแมงป่อง|16.836|-34.293|2.29|Sco
Eps Cen|เอปไซลอนคนครึ่งม้า|13.665|-53.466|2.3|Cen
Eta Cen|อีตาคนครึ่งม้า|14.592|-42.158|2.3|Cen
Merak|เมอแร็ก|11.031|56.382|2.37|UMa
Izar|อิซาร์|14.750|27.074|2.37|Boo
Enif|เอนิฟ|21.736|9.875|2.38|Peg
Kappa Sco|แคปปาแมงป่อง|17.708|-39.030|2.4|Sco
Scheat|ชีต|23.063|28.083|2.42|Peg
Sabik|ซาบิก|17.173|-15.725|2.43|Oph
Phecda|เฟกดา|11.897|53.695|2.44|UMa
Aludra|อลูดรา|7.402|-29.303|2.45|CMa
Markab|มาร์คาบ|23.079|15.205|2.48|Peg
Gienah Cyg|จีนาห์|20.770|33.970|2.48|Cyg
Zeta Cen|ซีตาคนครึ่งม้า|13.926|-47.288|2.55|Cen
Zosma|ซอสมา|11.235|20.524|2.56|Leo
Ascella|แอสเซลลา|19.044|-29.880|2.6|Sgr
Delta Cen|เดลตาคนครึ่งม้า|12.140|-50.723|2.6|Cen
Mahasim|มาฮาซิม|5.995|37.213|2.6|Aur
Zubeneschamali|ซูเบนเอสชามาลี|15.283|-9.383|2.6|Lib
Graffias|กราฟเฟียส|16.091|-19.805|2.62|Sco
Sheratan|เชราทาน|1.911|20.808|2.64|Ari
Ruchbah|รุคบาห์|1.430|60.235|2.68|Cas
Muphrid|มูเฟรด|13.911|18.398|2.68|Boo
Hassaleh|ฮัสซาเลห์|4.950|33.166|2.7|Aur
Kaus Media|เคาส์มีเดีย|18.350|-29.828|2.7|Sgr
Lesath|ลีแซท|17.513|-37.296|2.7|Sco
Tarazed|ทาราเซด|19.771|10.613|2.72|Aql
Porrima|พอร์ริมา|12.694|-1.449|2.74|Vir
Zubenelgenubi|ซูเบนเอลเจนูบี|14.848|-16.042|2.75|Lib
Delta Cru|เดลตากางเขนใต้|12.252|-58.749|2.79|Cru
Kaus Borealis|เคาส์บอเรียลิส|18.466|-25.422|2.8|Sgr
Tau Sco|เทาแมงป่อง|16.598|-28.216|2.8|Sco
Algenib|อัลจีนิบ|.220|15.184|2.83|Peg
Vindemiatrix|วินเดมิเอทริกซ์|13.036|10.959|2.85|Vir
Zeta Per|ซีตาเพอร์ซิอัส|3.902|31.884|2.85|Per
Deneb Algedi|เดเนบอัลเจดี|21.784|-16.127|2.85|Cap
Alcyone|อัลไซโอนี (กระจุกลูกไก่)|3.791|24.105|2.87|Tau
Tejat|เทแจต|6.383|22.514|2.87|Gem
Delta Cyg|เดลตาหงส์|19.750|45.131|2.87|Cyg
Pi Sco|พายแมงป่อง|15.981|-26.114|2.89|Sco
Gomeisa|โกเมซา|7.453|8.289|2.89|CMi
Sigma Sco|ซิกมาแมงป่อง|16.353|-25.593|2.9|Sco
Sadalsuud|ซาดัลซูด|21.526|-5.571|2.9|Aqr
Eps Per|เอปไซลอนเพอร์ซิอัส|3.964|40.010|2.9|Per
Gamma Per|แกมมาเพอร์ซิอัส|3.080|53.506|2.9|Per
Sadalmelik|ซาดัลเมลิก|22.096|-.320|2.95|Aqr
Eps Leo|เอปไซลอนสิงโต|9.764|23.774|2.98|Leo
Alnasl|อัลแนสล์|18.097|-30.424|3|Sgr
Seginus|ซีจินัส|14.535|38.308|3|Boo
Eps Aur|เอปไซลอนสารถี|5.033|43.823|3|Aur
Mu Sco|มิวแมงป่อง|16.865|-38.047|3|Sco
Iota Sco|ไอโอตาแมงป่อง|17.793|-40.127|3|Sco
Mebsuta|เมบสุตา|6.383|25.131|3|Gem
Pherkad|เฟอร์กาด|15.345|71.834|3|UMi
Delta Per|เดลตาเพอร์ซิอัส|3.715|47.788|3|Per
Albireo|อัลบิเรโอ|19.512|27.960|3.05|Cyg
Dabih|ดาบีห์|20.350|-14.781|3.05|Cap
Phi Sgr|ฟายคนยิงธนู|18.761|-26.991|3.2|Sgr
Eta Sco|อีตาแมงป่อง|17.203|-43.239|3.3|Sco
Megrez|เมกเรซ|12.257|57.033|3.31|UMa
Chertan|เชอร์ทาน|11.237|15.430|3.3|Leo
Tau Sgr|เทาคนยิงธนู|19.116|-27.671|3.3|Sgr
Sulafat|ซูลาฟัต|18.982|32.690|3.25|Lyr
Delta And|เดลตาแอนดรอมิดา|.656|30.861|3.27|And
Delta Aql|เดลตานกอินทรี|19.425|3.115|3.36|Aql
Zeta Vir|ซีตาหญิงสาว|13.578|-.596|3.37|Vir
Segin|ซีจิน|1.907|63.670|3.37|Cas
Meissa|ไมสซา|5.585|9.934|3.39|Ori
Homam|โฮมาม|22.691|10.831|3.4|Peg
Lambda Aql|แลมบ์ดานกอินทรี|19.104|-4.883|3.4|Aql
Delta Vir|เดลตาหญิงสาว|12.927|3.397|3.4|Vir
Adhafera|อัดฮาเฟรา|10.278|23.417|3.4|Leo
Nekkar|เน็กการ์|15.032|40.390|3.5|Boo
Delta Boo|เดลตาคนเลี้ยงสัตว์|15.258|33.315|3.47|Boo
Sheliak|เชเลียก|18.835|33.363|3.5|Lyr
Ain|ไอน์|4.477|19.180|3.5|Tau
Eta Leo|อีตาสิงโต|10.122|16.763|3.5|Leo
Wasat|วาสัต|7.335|21.982|3.5|Gem
Rho Boo|โรคนเลี้ยงสัตว์|14.530|30.371|3.6|Boo
Zeta Sco|ซีตาแมงป่อง|16.910|-42.362|3.6|Sco
Beta Vir|บีตาหญิงสาว|11.845|1.765|3.6|Vir
Algedi|อัลเจดี|20.300|-12.545|3.6|Cap
Gamma Tau|แกมมาวัว|4.330|15.628|3.65|Tau
Alshain|อัลชาอิน|19.922|6.407|3.7|Aql
Delta Tau|เดลตาวัว|4.382|17.543|3.8|Tau
Mekbuda|เมกบูดา|7.068|20.570|3.8|Gem
Rasalas|ราสอาลัส|9.880|26.007|3.9|Leo
Eta Vir|อีตาหญิงสาว|12.332|-.667|3.9|Vir
Mesarthim|เมซาร์ทิม|1.892|19.294|3.9|Ari
Zeta Lyr|ซีตาพิณ|18.746|37.605|4.3|Lyr
Delta Lyr|เดลตาพิณ|18.908|36.899|4.3|Lyr
Eps UMi|เอปไซลอนหมีเล็ก|16.766|82.037|4.2|UMi
Zeta UMi|ซีตาหมีเล็ก|15.734|77.794|4.3|UMi
Yildun|ยิลดุน|17.537|86.586|4.35|UMi
Eta UMi|อีตาหมีเล็ก|16.292|75.755|4.95|UMi`;
const CONS={
  Ori:['นายพราน','Meissa-Betelgeuse Meissa-Bellatrix Betelgeuse-Bellatrix Betelgeuse-Alnitak Bellatrix-Mintaka Mintaka-Alnilam Alnilam-Alnitak Alnitak-Saiph Mintaka-Rigel'],
  CMa:['สุนัขใหญ่','Mirzam-Sirius Sirius-Wezen Wezen-Adhara Wezen-Aludra'],
  CMi:['สุนัขเล็ก','Procyon-Gomeisa'],
  Gem:['คนคู่','Castor-Mebsuta Mebsuta-Tejat Pollux-Wasat Wasat-Mekbuda Mekbuda-Alhena Castor-Pollux'],
  Tau:['วัว','Elnath-Ain Ain-Delta Tau Delta Tau-Gamma Tau Gamma Tau-Aldebaran'],
  Aur:['สารถี','Capella-Menkalinan Menkalinan-Mahasim Mahasim-Elnath Elnath-Hassaleh Hassaleh-Eps Aur Eps Aur-Capella'],
  UMa:['หมีใหญ่ (กระบวยใหญ่)','Dubhe-Merak Merak-Phecda Phecda-Megrez Megrez-Dubhe Megrez-Alioth Alioth-Alkaid'],
  UMi:['หมีเล็ก','Polaris-Yildun Yildun-Eps UMi Eps UMi-Zeta UMi Zeta UMi-Kochab Kochab-Pherkad Pherkad-Eta UMi Eta UMi-Zeta UMi'],
  Cas:['แคสซิโอเปีย','Caph-Schedar Schedar-Gamma Cas Gamma Cas-Ruchbah Ruchbah-Segin'],
  Cyg:['หงส์','Deneb-Sadr Sadr-Albireo Gienah Cyg-Sadr Sadr-Delta Cyg'],
  Lyr:['พิณ','Vega-Zeta Lyr Zeta Lyr-Sheliak Sheliak-Sulafat Sulafat-Delta Lyr Delta Lyr-Zeta Lyr'],
  Aql:['นกอินทรี','Tarazed-Altair Altair-Alshain Altair-Delta Aql Delta Aql-Lambda Aql'],
  Sco:['แมงป่อง','Graffias-Dschubba Dschubba-Pi Sco Dschubba-Sigma Sco Sigma Sco-Antares Antares-Tau Sco Tau Sco-Eps Sco Eps Sco-Mu Sco Mu Sco-Zeta Sco Zeta Sco-Eta Sco Eta Sco-Sargas Sargas-Iota Sco Iota Sco-Kappa Sco Kappa Sco-Shaula Shaula-Lesath'],
  Sgr:['คนยิงธนู','Alnasl-Kaus Media Kaus Media-Kaus Australis Kaus Australis-Alnasl Kaus Media-Kaus Borealis Kaus Borealis-Phi Sgr Phi Sgr-Kaus Media Phi Sgr-Nunki Nunki-Tau Sgr Tau Sgr-Ascella Ascella-Phi Sgr Ascella-Kaus Australis'],
  Leo:['สิงโต','Regulus-Eta Leo Eta Leo-Algieba Algieba-Adhafera Adhafera-Rasalas Rasalas-Eps Leo Algieba-Zosma Zosma-Denebola Denebola-Chertan Chertan-Regulus Zosma-Chertan'],
  Vir:['หญิงสาว','Spica-Zeta Vir Zeta Vir-Delta Vir Delta Vir-Vindemiatrix Delta Vir-Porrima Porrima-Eta Vir Eta Vir-Beta Vir Porrima-Spica'],
  Boo:['คนเลี้ยงสัตว์','Arcturus-Izar Izar-Delta Boo Delta Boo-Nekkar Nekkar-Seginus Seginus-Rho Boo Rho Boo-Arcturus Arcturus-Muphrid'],
  Cru:['กางเขนใต้','Acrux-Gacrux Mimosa-Delta Cru'],
  Cen:['คนครึ่งม้า','Rigil Kentaurus-Hadar Hadar-Eps Cen Eps Cen-Gamma Cen Gamma Cen-Delta Cen Eps Cen-Zeta Cen Zeta Cen-Eta Cen Eta Cen-Menkent'],
  Car:['กระดูกงูเรือ','Canopus-Avior Avior-Aspidiske Aspidiske-Miaplacidus'],
  Peg:['ม้าบิน','Markab-Scheat Scheat-Alpheratz Alpheratz-Algenib Algenib-Markab Markab-Homam Homam-Enif'],
  And:['แอนดรอมิดา','Alpheratz-Delta And Delta And-Mirach Mirach-Almach'],
  Per:['เพอร์ซิอัส','Gamma Per-Mirfak Mirfak-Delta Per Delta Per-Eps Per Eps Per-Zeta Per Mirfak-Algol'],
  Ari:['แกะ','Hamal-Sheratan Sheratan-Mesarthim'],
  Lib:['คันชั่ง','Zubeneschamali-Zubenelgenubi'],
  Aqr:['คนแบกหม้อน้ำ','Sadalsuud-Sadalmelik'],
  Cap:['แพะทะเล','Algedi-Dabih Dabih-Deneb Algedi'],
  Oph:['คนแบกงู','Rasalhague-Sabik'],
  Hya:['งูไฮดรา',''],PsA:['ปลาใต้',''],Eri:['แม่น้ำอีริดานัส',''],Gru:['นกกระเรียน',''],CrB:['มงกุฎเหนือ','']
};
/* the "birth star": the brightest of these standing highest above the horizon at birth */
const STAR_MSG={
  Sirius:'ดาวที่สว่างที่สุดบนฟ้ายามค่ำ คนที่เกิดใต้ดาวดวงนี้มักโดดเด่นโดยไม่ต้องพยายาม และเป็นแสงนำทางให้คนรอบตัว',
  Canopus:'ดาวนำทางของนักเดินเรือทางใต้ สะท้อนคนที่หาทิศทางของตัวเองได้แม้ในคืนที่มืดที่สุด',
  'Rigil Kentaurus':'ระบบดาวที่อยู่ใกล้โลกที่สุดที่ตาเปล่ามองเห็น บ่งถึงคนที่ใกล้ชิดและซื่อตรงต่อคนที่รัก',
  Arcturus:'ผู้พิทักษ์แห่งหมีใหญ่ แสงส้มอุ่นของมันคือความมั่นคงและความกล้าที่จะยืนหยัดเพื่อคนอื่น',
  Vega:'ดาวแห่งพิณ ผู้ที่เกิดใต้ดาวดวงนี้มีหัวใจของศิลปิน ละเอียดอ่อนและมีพรสวรรค์ด้านความงาม',
  Capella:'แพะน้อยในอ้อมแขนสารถี สื่อถึงความอบอุ่น การดูแล และโชคที่มาจากความเอื้อเฟื้อ',
  Rigel:'เท้าของนายพราน ดาวสีฟ้าที่ร้อนแรง บอกถึงพลังที่จะก้าวไปข้างหน้าแม้ทางจะยาก',
  Procyon:'ดาวที่ขึ้นก่อนสุนัขใหญ่ บ่งถึงคนที่มองเห็นสิ่งที่กำลังจะมาก่อนใคร และพร้อมเสมอ',
  Achernar:'ปลายแม่น้ำแห่งดวงดาว สื่อถึงการเดินทางที่ยาวไกลและบทจบที่งดงาม',
  Betelgeuse:'บ่าของนายพราน ดาวยักษ์สีแดงที่ใกล้วาระสุดท้าย บอกถึงพลังแห่งการเปลี่ยนแปลงครั้งใหญ่ในชีวิต',
  Hadar:'หนึ่งในดาวชี้ทางสู่กางเขนใต้ บ่งถึงคนที่ชี้ทางให้คนอื่นได้อย่างแม่นยำ',
  Altair:'นกอินทรีที่บินข้ามทางช้างเผือก สื่อถึงความรักที่ข้ามอุปสรรคและความเร็วในการตัดสินใจ',
  Acrux:'ยอดของกางเขนใต้ ดาวแห่งศรัทธาและการยึดมั่นในสิ่งที่เชื่อ',
  Aldebaran:'ดวงตาของวัว ผู้ติดตามกระจุกดาวลูกไก่ บ่งถึงความมุ่งมั่นที่ไม่ละสายตาจากเป้าหมาย',
  Antares:'หัวใจของแมงป่อง คู่แข่งของดาวอังคาร คนที่เกิดใต้ดาวดวงนี้มีไฟในใจที่ร้อนแรงและซื่อตรงต่อความรู้สึก',
  Spica:'รวงข้าวในมือหญิงสาว ดาวแห่งความอุดมสมบูรณ์ ผลของการลงมือทำจะงอกงามเสมอ',
  Pollux:'ฝาแฝดผู้เป็นอมตะ สื่อถึงความผูกพันและการเสียสละเพื่อคนที่รัก',
  Fomalhaut:'ปากของปลาใต้ ดาวผู้เฝ้ามองอย่างโดดเดี่ยว บ่งถึงคนที่มีโลกภายในลึกซึ้งและมีวิสัยทัศน์',
  Deneb:'หางของหงส์ ดาวยักษ์ที่อยู่ไกลแต่ยังส่องถึง สื่อถึงความทะเยอทะยานที่ไม่มีขีดจำกัด',
  Mimosa:'ดาวสีฟ้าแห่งกางเขนใต้ บ่งถึงความสงบและความเข้มแข็งที่อ่อนโยน',
  Regulus:'หัวใจของสิงโต ดาวแห่งราชา บ่งถึงความเป็นผู้นำและความเมตตาของผู้มีอำนาจ',
  Castor:'ฝาแฝดผู้เป็นมนุษย์ สื่อถึงความสามารถหลายด้านและมิตรภาพที่ยืนยาว',
  Polaris:'ดาวเหนือ ดาวที่ไม่เคยเคลื่อนจากที่ บ่งถึงความแน่วแน่และการเป็นหลักให้คนอื่นยึด',
  Alphard:'ดาวผู้โดดเดี่ยวในหัวใจงูไฮดรา บอกถึงคนที่เดินทางของตัวเองได้โดยไม่ต้องตามใคร',
  Shaula:'เหล็กในของแมงป่อง บ่งถึงคำพูดที่คมและการตัดสินใจที่เด็ดขาด',
  Bellatrix:'ดาวนักรบหญิง บ่าซ้ายของนายพราน สื่อถึงความกล้าและการต่อสู้เพื่อสิ่งที่ถูกต้อง',
  Elnath:'ปลายเขาของวัว บ่งถึงพลังผลักดันและความดื้อดึงที่พาไปถึงเป้าหมาย',
  Alnilam:'ดวงกลางของเข็มขัดนายพราน (ดาวไถ) สื่อถึงการเป็นศูนย์กลางที่ยึดทุกอย่างไว้ด้วยกัน',
  Dubhe:'ดาวชี้ของกระบวยใหญ่ บ่งถึงคนที่ชี้ทางไปสู่สิ่งที่สำคัญจริง',
  Mirfak:'ดาวที่สว่างที่สุดของเพอร์ซิอัส ผู้ปราบเมดูซ่า สื่อถึงความกล้าเผชิญสิ่งที่คนอื่นกลัว'
};
/* Thai sidereal signs (ราศีเกิดแบบไทย), from the sun's longitude less the Lahiri ayanamsa */
const SIGNS=[
  ['เมษ','ไฟ','ใจร้อน กล้าเริ่มก่อนใคร พลังของคุณคือการเปิดทางใหม่'],
  ['พฤษภ','ดิน','หนักแน่น รักความมั่นคงและความงาม สิ่งที่คุณสร้างจะอยู่ได้นาน'],
  ['เมถุน','ลม','ช่างคิดช่างพูด ปรับตัวเก่ง ความอยากรู้คือเข็มทิศของคุณ'],
  ['กรกฎ','น้ำ','อ่อนโยน รักบ้านและคนใกล้ตัว ความรู้สึกของคุณลึกกว่าที่ใครเห็น'],
  ['สิงห์','ไฟ','สง่า ใจกว้าง เกิดมาเพื่อยืนอยู่กลางแสง และส่องสว่างให้คนรอบข้าง'],
  ['กันย์','ดิน','ละเอียด รอบคอบ เห็นสิ่งที่คนอื่นมองข้าม และทำให้ทุกอย่างดีขึ้น'],
  ['ตุลย์','ลม','รักความยุติธรรมและความกลมกลืน เป็นผู้ประสานที่ทุกฝ่ายไว้ใจ'],
  ['พิจิก','น้ำ','ลึกลับ ทุ่มเท ความรู้สึกของคุณแรงและจริงจังเสมอ'],
  ['ธนู','ไฟ','รักอิสระ มองไกล ชีวิตของคุณคือการเดินทางเพื่อหาความหมาย'],
  ['มังกร','ดิน','อดทน มีวินัย ค่อย ๆ ปีนขึ้นสู่ยอดเขาโดยไม่หันหลังกลับ'],
  ['กุมภ์','ลม','คิดต่าง ไม่เหมือนใคร ความคิดของคุณมาก่อนยุคเสมอ'],
  ['มีน','น้ำ','ช่างฝัน เห็นอกเห็นใจ สัมผัสสิ่งที่มองไม่เห็นได้ดีกว่าใคร']
];
const CITIES=[['กรุงเทพมหานคร',13.75,100.50],['เชียงใหม่',18.79,98.98],['เชียงราย',19.91,99.83],['พิษณุโลก',16.82,100.26],['นครสวรรค์',15.70,100.14],
  ['นครราชสีมา',14.97,102.10],['ขอนแก่น',16.43,102.83],['อุดรธานี',17.41,102.79],['อุบลราชธานี',15.24,104.85],['ชลบุรี',13.36,100.98],
  ['ราชบุรี',13.54,99.81],['สุราษฎร์ธานี',9.14,99.33],['นครศรีธรรมราช',8.43,99.96],['ภูเก็ต',7.88,98.39],['สงขลา / หาดใหญ่',7.01,100.47]];
const ZH=['เหนือ','ตะวันออก','ใต้','ตะวันตก'];

/* ---- catalog ---- */
const ALL=[],BY={};
BRIGHT.split('\n').forEach(l=>{const [n,th,ra,de,m,c]=l.split('|');const s={n,th,ra:+ra*15,de:+de,m:+m,c,i:ALL.length};BY[n]=s;ALL.push(s)});
const LINES=[];
Object.entries(CONS).forEach(([c,[th,ls]])=>{if(!ls)return;
  // pairs are "A-B" separated by spaces; names may contain one space ("Kaus Media"), so split on the known names
  const names=Object.keys(BY).sort((a,b)=>b.length-a.length);let rest=ls;
  while(rest.trim()){rest=rest.trim();const a=names.find(n=>rest.startsWith(n+'-'));if(!a)break;rest=rest.slice(a.length+1);
    const b=names.find(n=>rest.startsWith(n)&&(rest.length===n.length||rest[n.length]===' '));if(!b)break;rest=rest.slice(b.length);LINES.push([BY[a],BY[b]])}});
// decoration: faint stars, denser toward the galactic plane, from a fixed seed so the sky is the same every visit
let seed=20240611;const rnd=()=>{seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const AG=192.85948*D2R,DG=27.12825*D2R,LN=122.93192*D2R;
function gal2eq(l,b){const sd=Math.sin(b)*Math.sin(DG)+Math.cos(b)*Math.cos(DG)*Math.cos(LN-l),d=Math.asin(sd);
  const a=AG+Math.atan2(Math.cos(b)*Math.sin(LN-l),Math.sin(b)*Math.cos(DG)-Math.cos(b)*Math.sin(DG)*Math.cos(LN-l));return{ra:((a/D2R)%360+360)%360,de:d/D2R}}
const gauss=()=>{let u=0,v=0;while(!u)u=rnd();while(!v)v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v)};
for(let i=0;i<1300;i++){
  let ra,de;
  if(rnd()<.55){const p=gal2eq(rnd()*TAU,gauss()*9*D2R);ra=p.ra;de=p.de}
  else{ra=rnd()*360;de=Math.asin(rnd()*2-1)/D2R}
  ALL.push({n:'',ra,de,m:3.9+2.3*Math.pow(rnd(),.55),faint:1,i:ALL.length});
}
const MILKY=[];for(let i=0;i<520;i++){const p=gal2eq(rnd()*TAU,gauss()*6*D2R);MILKY.push({...p,w:.6+rnd()*.8})}

/* ---- astronomy (low precision) ---- */
const jdOf=ms=>ms/864e5+2440587.5;
const gmst=JD=>((280.46061837+360.98564736629*(JD-2451545))%360+360)%360;
const OBL=23.439*D2R;
function eclToEq(lon,lat){const l=lon*D2R,b=lat*D2R;
  return{ra:((Math.atan2(Math.sin(l)*Math.cos(OBL)-Math.tan(b)*Math.sin(OBL),Math.cos(l))/D2R)%360+360)%360,de:Math.asin(Math.sin(b)*Math.cos(OBL)+Math.cos(b)*Math.sin(OBL)*Math.sin(l))/D2R}}
function sunPos(JD){const d=JD-2451545,g=(357.529+.98560028*d)*D2R,q=280.459+.98564736*d,lon=((q+1.915*Math.sin(g)+.02*Math.sin(2*g))%360+360)%360;return{...eclToEq(lon,0),lon}}
function moonPos(JD){const d=JD-2451545,M=(134.963+13.064993*d)*D2R,F=(93.272+13.22935*d)*D2R,lon=218.316+13.176396*d+6.289*Math.sin(M),lat=5.128*Math.sin(F);return eclToEq(lon,lat)}
function altAz(ra,de,lst,lat){
  const H=(lst-ra)*D2R,d=de*D2R,p=lat*D2R,sa=Math.sin(d)*Math.sin(p)+Math.cos(d)*Math.cos(p)*Math.cos(H),alt=Math.asin(sa);
  const az=Math.atan2(-Math.sin(H)*Math.cos(d),Math.cos(p)*Math.sin(d)-Math.sin(p)*Math.cos(d)*Math.cos(H));return{alt:alt/D2R,az}}
function signOf(JD,y){const ay=23.85+(y-2000)*.01397;return Math.floor(((sunPos(JD).lon-ay)%360+360)%360/30)}

/* ---- DOM + styles (injected; the main page stays lean) ---- */
const css=`#sky{position:fixed;inset:0;width:100%;height:100%;z-index:3;opacity:0;visibility:hidden;touch-action:none}
#sky.draw{cursor:crosshair}
#skyForm{position:fixed;left:50%;top:50%;z-index:6;width:min(400px,calc(100vw - 32px));padding:22px 22px 20px;display:flex;flex-direction:column;gap:12px;opacity:0;visibility:hidden}
#skyForm h3,#skyInfo h3{margin:0;font-weight:600;color:var(--gold2);font-size:20px}
#skyForm .sub{margin:0 0 4px;color:var(--muted);font-size:14px;line-height:1.6}
#skyForm label{display:flex;flex-direction:column;gap:5px;font-size:13.5px;color:var(--gold)}
#skyForm label.chk{flex-direction:row;align-items:center;gap:8px;color:var(--muted)}
#skyForm input,#skyForm select,#skyName{background:rgba(22,21,26,.75);border:1px solid var(--line);border-radius:10px;color:var(--ink);padding:10px 12px;font:inherit;font-size:16px;touch-action:auto;color-scheme:dark}
#skyForm input[type=checkbox]{width:18px;height:18px;padding:0;accent-color:var(--gold)}
#skyForm input:focus-visible,#skyForm select:focus-visible,#skyName:focus-visible{outline:2px solid var(--gold2);outline-offset:1px}
#skyForm .btn.primary{margin-top:4px}
#skyForm .err{margin:0;min-height:1.4em;color:#e0a49a;font-size:13px}
#skyInfo{position:fixed;z-index:6;overflow-y:auto;padding:16px 18px 18px;line-height:1.75;font-size:15px;scrollbar-width:thin;scrollbar-color:var(--gold) transparent;touch-action:pan-y;opacity:0;visibility:hidden;display:flex;flex-direction:column;gap:12px}
#skyInfo .sk-sec{border-top:1px solid rgba(184,149,90,.22);padding-top:10px}
#skyInfo .sk-sec b{color:var(--gold2);font-weight:600}
#skyInfo p{margin:0}
#skyInfo .rd-pos{margin-bottom:2px}
#skyInfo .row{display:flex;gap:8px;flex-wrap:wrap}
#skyInfo .row .btn{display:inline-flex;align-items:center;gap:6px}
#skyInfo .hint{color:var(--muted);font-size:13.5px}
#skyName{width:100%;font-size:15px;padding:9px 12px}
#skyTip{position:fixed;z-index:7;pointer-events:none;padding:5px 10px;border-radius:6px;background:rgba(14,13,17,.92);border:1px solid var(--line);color:var(--gold2);font-size:13px;white-space:nowrap;opacity:0;translate:-50% calc(-100% - 12px)}
#skyTip small{color:var(--muted);margin-left:6px}
#sky.pan{cursor:grabbing}
#skyBar{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));z-index:6;padding:10px 12px;width:max-content;display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;visibility:hidden;max-width:calc(100vw - 16px)}
#skyBar p{margin:0;font-size:13px;color:var(--muted);text-align:center}
#skyBar .row{display:flex;gap:8px;flex-wrap:nowrap;justify-content:center}
@media (max-width:480px){#skyBar{padding:8px}#skyBar p{font-size:12px}#skyBar .row{gap:6px}#skyBar .btn{padding:6px 10px;font-size:12.5px;white-space:nowrap}}
#skyBar .btn{display:inline-flex;align-items:center;gap:6px}
#skyBar .btn[hidden]{display:none}
#sbGyro[aria-pressed=true]{border-color:var(--gold2);background:rgba(184,149,90,.18)}
#skDome{display:inline-flex;align-items:center;justify-content:center;gap:8px}`;
let built=false,cv,cx,cache,cc,tip;
function build(){
  if(built)return;built=true;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  const stage=$('#stage');
  stage.insertAdjacentHTML('beforeend',`<canvas id="sky" aria-label="แผนที่ท้องฟ้าในวันเกิด" role="img"></canvas>
<section id="skyForm" class="glass" aria-label="ข้อมูลวันเกิด">
  <h3>ท้องฟ้าคืนที่คุณเกิด</h3>
  <p class="sub">ใส่วัน เวลา และเมืองที่เกิด เพื่อเปิดท้องฟ้าเหนือหัวคุณในวินาทีนั้น</p>
  <label>วันเกิด<input type="date" id="bDate" min="1900-01-01" required></label>
  <label>เวลาเกิด<input type="time" id="bTime"></label>
  <label class="chk"><input type="checkbox" id="bNoTime">ไม่ทราบเวลาเกิด (ใช้ 21:00 แทน)</label>
  <label>เมืองที่เกิด (เลือกเมืองที่ใกล้ที่สุด)<select id="bCity">${CITIES.map((c,i)=>`<option value="${i}">${c[0]}</option>`).join('')}</select></label>
  <button class="btn primary" id="bGo" type="button">เปิดท้องฟ้า</button>
  <p class="err" id="bErr" aria-live="polite"></p>
</section>
<aside id="skyInfo" class="glass" aria-label="ดาวเกิดของคุณ" aria-live="polite"></aside>
<div id="skyTip" aria-hidden="true"></div>
<div id="skyBar" class="glass" role="toolbar" aria-label="มองท้องฟ้ารอบตัว">
  <p id="skyBarMsg" aria-live="polite"></p>
  <div class="row">
    <button class="btn small" id="sbChart" type="button"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg><span class="tx">แผนที่</span></button>
    <button class="btn small" id="sbGyro" type="button" aria-pressed="false" hidden><svg class="i" aria-hidden="true"><use href="#i-compass"/></svg><span class="tx">ชี้มือถือขึ้นฟ้า</span></button>
    <button class="btn small" id="sbUndo" type="button"><svg class="i" aria-hidden="true"><use href="#i-undo"/></svg><span class="tx">ย้อนเส้น</span></button>
  </div>
</div>`);
  cv=$('#sky');cx=cv.getContext('2d');cache=document.createElement('canvas');cc=cache.getContext('2d');tip=$('#skyTip');
  gsap.set('#skyForm',{xPercent:-50,yPercent:-50});
  try{const v=JSON.parse(localStorage.getItem('arcana-birth')||'null');if(v){$('#bDate').value=v.d||'';$('#bTime').value=v.t||'';$('#bNoTime').checked=!!v.u;$('#bCity').value=v.c||0}}catch(e){}
  $('#bDate').max=new Date().toISOString().slice(0,10);
  $('#bNoTime').addEventListener('change',e=>{$('#bTime').disabled=e.target.checked});$('#bTime').disabled=$('#bNoTime').checked;
  $('#bGo').addEventListener('click',()=>{if(S.state==='stars'&&!S.busy&&V.mode==='form')go(openSky)});
  $('#skyForm').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#bGo').click()}});
  cv.addEventListener('pointerdown',onDown);cv.addEventListener('pointermove',onMove);cv.addEventListener('pointerup',onUp);cv.addEventListener('pointercancel',()=>{V.drag=null;V.dirty=true});
  cv.addEventListener('pointerleave',()=>{V.hover=null;tip.style.opacity=0;V.dirty=true});
  cv.addEventListener('wheel',onWheel,{passive:false});
  gsap.set('#skyBar',{xPercent:-50});
  $('#sbChart').addEventListener('click',()=>{if(!S.busy)go(toChart)});
  $('#sbUndo').addEventListener('click',()=>{V.lines.pop();V.dirty=true;syncTools()});
  $('#sbGyro').addEventListener('click',()=>{V.gyro?gyroOff():gyroOn()});
  // the sensor button only where there is a sensor and a touch screen
  if('DeviceOrientationEvent' in window&&matchMedia('(pointer:coarse)').matches)$('#sbGyro').hidden=false;
}

/* ---- view state ---- */
const V={mode:'off',birth:null,JD:0,lat:13.75,lon:100.5,off:0,scale:1,alpha:1,spin:0,cx:0,cy:0,R:200,vis:[],lines:[],sel:null,hover:null,drag:null,ptr:null,dirty:true,anim:false,birthStar:null,view:'chart',cam:{yaw:180,pitch:40,fov:78},gyro:false,gb:null,pan:null,pinch:null,F:600};
function layout(){
  const W=innerWidth,H=innerHeight,wide=W>=900&&W/H>=1.15,d=Math.min(devicePixelRatio||1,2);
  cv.width=cache.width=W*d;cv.height=cache.height=H*d;cx.setTransform(d,0,0,d,0,0);cc.setTransform(d,0,0,d,0,0);
  const inf=$('#skyInfo');
  if(wide){const iw=Math.min(390,W*.32);V.R=Math.max(120,Math.min((W-iw-80)/2,(H-150)/2));V.cx=(W-iw-16)/2;V.cy=H/2+18;
    Object.assign(inf.style,{top:'68px',right:'16px',bottom:'16px',left:'auto',width:iw+'px',height:'auto',borderRadius:'16px'})}
  else{V.R=Math.max(110,Math.min(W/2-54,H*.3));V.cx=W/2;V.cy=70+V.R+24;
    Object.assign(inf.style,{top:(V.cy+V.R+30)+'px',left:'8px',right:'8px',bottom:'8px',width:'auto',height:'auto',borderRadius:'16px'})}
  V.dirty=true;
}
/* project every object for the current time offset */
function project(){
  const JD=V.JD+V.off/24,lst=(gmst(JD)+V.lon)%360,R=V.R*V.scale,sp=V.spin;
  const P=(ra,de)=>{const h=altAz(ra,de,lst,V.lat),z=(90-h.alt)*D2R,r=R*Math.tan(z/2),a=h.az+sp;return{alt:h.alt,az:h.az,x:V.cx-r*Math.sin(a),y:V.cy-r*Math.cos(a)}};
  V.vis=ALL.map(s=>({s,...P(s.ra,s.de)}));
  V.milky=MILKY.map(m=>({m,...P(m.ra,m.de)}));
  const su=sunPos(JD),mo=moonPos(JD);V.sun=P(su.ra,su.de);V.moon=P(mo.ra,mo.de);
  V.P=P;
}
const starR=(m,k)=>Math.max(.45,(2.7-.5*m))*k;
/* everything inside the sky, shared by the flat chart and the dome view. o.ok(v) says whether a projected
   point may be drawn; o.blob is the Milky Way puff radius */
function paintBody(x,{k,ts=1,png=false,blob,ok,alpha=1}){
  const at=s=>V.vis[s.i];
  // Milky Way
  x.globalCompositeOperation='lighter';
  for(const p of V.milky){if(p.alt<-8||!ok(p,true))continue;const rr2=blob*p.m.w;const gg=x.createRadialGradient(p.x,p.y,0,p.x,p.y,rr2);gg.addColorStop(0,'rgba(150,160,190,.055)');gg.addColorStop(1,'rgba(150,160,190,0)');x.fillStyle=gg;x.fillRect(p.x-rr2,p.y-rr2,rr2*2,rr2*2)}
  x.globalCompositeOperation='source-over';
  // constellation figures
  x.strokeStyle='rgba(184,149,90,.34)';x.lineWidth=Math.max(.8,k*.9);x.beginPath();
  for(const [a,b] of LINES){const p=at(a),q=at(b);if((p.alt<-3&&q.alt<-3)||!ok(p,true)||!ok(q,true))continue;x.moveTo(p.x,p.y);x.lineTo(q.x,q.y)}x.stroke();
  // stars
  for(const v of V.vis){if(v.alt<0||!ok(v))continue;const r=starR(v.s.m,k);
    x.globalAlpha=alpha*(v.s.faint?clamp(1.15-(v.s.m-3.9)/3,.25,.85):1);
    if(!v.s.faint&&v.s.m<1.6){const gl=x.createRadialGradient(v.x,v.y,0,v.x,v.y,r*5);gl.addColorStop(0,'rgba(255,236,200,.35)');gl.addColorStop(1,'rgba(255,236,200,0)');x.fillStyle=gl;x.fillRect(v.x-r*5,v.y-r*5,r*10,r*10)}
    x.fillStyle=v.s.faint?'#c9cbd6':'#fff4dc';x.beginPath();x.arc(v.x,v.y,r,0,TAU);x.fill()}
  x.globalAlpha=alpha;
  // sun and moon when above the horizon
  if(V.sun.alt>0&&ok(V.sun)){const r=9*k;let gs=x.createRadialGradient(V.sun.x,V.sun.y,0,V.sun.x,V.sun.y,r*4);gs.addColorStop(0,'rgba(255,190,110,.6)');gs.addColorStop(1,'rgba(255,190,110,0)');x.fillStyle=gs;x.fillRect(V.sun.x-r*4,V.sun.y-r*4,r*8,r*8);x.fillStyle='#ffcf8a';x.beginPath();x.arc(V.sun.x,V.sun.y,r,0,TAU);x.fill()}
  if(V.moon.alt>0&&ok(V.moon)){const r=7.5*k,mi=V.moonInfo;x.fillStyle='#2a2d3c';x.beginPath();x.arc(V.moon.x,V.moon.y,r,0,TAU);x.fill();
    x.save();x.translate(V.moon.x,V.moon.y);x.scale(r/8,r/8);x.fillStyle='#f2e6c4';x.fill(new Path2D(mi.path));x.restore()}
  // labels: brightest named stars, sun, moon
  x.font=`400 ${Math.round(Math.max(11,11.5*Math.min(k,1.25))*ts)}px 'Noto Serif Thai',serif`;x.textAlign='left';x.textBaseline='middle';
  for(const v of V.vis){if(v.alt<4||v.s.faint||v.s.m>.9||!ok(v))continue;x.fillStyle='rgba(220,194,140,.72)';x.fillText(v.s.th,v.x+starR(v.s.m,k)+5,v.y)}
  x.fillStyle='rgba(255,207,138,.85)';if(V.sun.alt>0&&ok(V.sun))x.fillText('ดวงอาทิตย์',V.sun.x+12*k,V.sun.y);
  x.fillStyle='rgba(242,230,196,.85)';if(V.moon.alt>0&&ok(V.moon))x.fillText('ดวงจันทร์',V.moon.x+11*k,V.moon.y);
  // the birth star
  if(V.birthStar){const v=at(V.birthStar);if(v.alt>0&&ok(v)){const b=starR(v.s.m,k);x.strokeStyle='rgba(242,212,138,.85)';x.lineWidth=1.2;x.beginPath();x.arc(v.x,v.y,b+7*k,0,TAU);x.stroke();
    x.beginPath();for(let i=0;i<4;i++){const a=i*Math.PI/2;x.moveTo(v.x+Math.cos(a)*(b+9*k),v.y+Math.sin(a)*(b+9*k));x.lineTo(v.x+Math.cos(a)*(b+15*k),v.y+Math.sin(a)*(b+15*k))}x.stroke()}}
  // the visitor's own constellation
  if(V.lines.length){x.strokeStyle='#f2d48a';x.lineWidth=Math.max(1.6,2*k);x.shadowColor='rgba(242,212,138,.8)';x.shadowBlur=png?18:10;x.lineCap='round';x.beginPath();
    for(const [a,b] of V.lines){const p=V.vis[a],q=V.vis[b];if(!ok(p,true)||!ok(q,true))continue;x.moveTo(p.x,p.y);x.lineTo(q.x,q.y)}x.stroke();x.shadowBlur=0;
    const used=new Set(V.lines.flat());x.fillStyle='#fff6dc';for(const i of used){const v=V.vis[i];if(!ok(v))continue;x.beginPath();x.arc(v.x,v.y,starR(Math.min(v.s.m,2),k)+1.2,0,TAU);x.fill()}}
}
function paintSky(x,{cx:X,cy:Y,R,alpha=1,png=false,ts=1}){
  const k=clamp(R/300,.75,1.7);
  x.save();x.globalAlpha=alpha;
  // the dome seen from below, flattened: zenith in the middle, horizon on the rim
  let g=x.createRadialGradient(X,Y,R*.1,X,Y,R*1.02);g.addColorStop(0,'#141a2c');g.addColorStop(.7,'#0d1020');g.addColorStop(1,'#07080f');
  x.fillStyle=g;x.beginPath();x.arc(X,Y,R,0,TAU);x.fill();
  x.save();x.beginPath();x.arc(X,Y,R,0,TAU);x.clip();
  x.strokeStyle='rgba(184,149,90,.16)';x.lineWidth=1;x.setLineDash([2,6]);
  [30,60].forEach(a=>{x.beginPath();x.arc(X,Y,R*Math.tan((90-a)*D2R/2),0,TAU);x.stroke()});x.setLineDash([]);   // altitude 30° / 60°
  paintBody(x,{k,ts,png,blob:R*.075,ok:()=>true,alpha});
  x.restore();
  // horizon ring + compass
  x.strokeStyle='rgba(184,149,90,.75)';x.lineWidth=1.5;x.beginPath();x.arc(X,Y,R,0,TAU);x.stroke();
  x.strokeStyle='rgba(184,149,90,.3)';x.lineWidth=1;x.beginPath();x.arc(X,Y,R+7*k,0,TAU);x.stroke();
  for(let i=0;i<72;i++){const a=i*5*D2R+V.spin,l=i%18===0?10:i%2?3:5;x.beginPath();x.moveTo(X-Math.sin(a)*(R+7*k),Y-Math.cos(a)*(R+7*k));x.lineTo(X-Math.sin(a)*(R+7*k+l*k),Y-Math.cos(a)*(R+7*k+l*k));x.stroke()}
  x.font=`600 ${Math.round(Math.max(11.5,12.5*Math.min(k,1.3))*ts)}px 'Noto Serif Thai',serif`;x.fillStyle='#dcc28c';x.textAlign='center';x.textBaseline='middle';
  ZH.forEach((t,i)=>{const a=i*Math.PI/2+V.spin,d=R+(i%2?30*k+60*(ts-1):26*k+8*(ts-1));x.fillText(t,X-Math.sin(a)*d,Y-Math.cos(a)*d)});
  x.restore();
}

/* ---- dome view: standing under the sky. A pinhole camera with yaw (azimuth looked at), pitch (altitude)
   and field of view, or, with the phone's motion sensor, the phone's own orientation. Directions are in
   the local frame x east, y north, z up. ---- */
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const nrm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]};
const crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dirOf=(alt,az)=>{const a=alt*D2R;return[Math.cos(a)*Math.sin(az),Math.cos(a)*Math.cos(az),Math.sin(a)]};
function camBasis(){
  if(V.gyro&&V.gb)return V.gb;
  const Y=V.cam.yaw*D2R,P=V.cam.pitch*D2R;
  return{f:[Math.cos(P)*Math.sin(Y),Math.cos(P)*Math.cos(Y),Math.sin(P)],r:[Math.cos(Y),-Math.sin(Y),0],u:[-Math.sin(P)*Math.sin(Y),-Math.sin(P)*Math.cos(Y),Math.cos(P)]};
}
function projectDome(){
  const JD=V.JD+V.off/24,lst=(gmst(JD)+V.lon)%360,W=innerWidth,H=innerHeight,B=camBasis(),F=V.F=(Math.min(W,H)*.5+Math.max(0,H-W)*.25)/Math.tan(V.cam.fov*D2R/2);
  const sc=d=>{const z=dot(d,B.f);if(z<.03)return{x:-1e5,y:-1e5,z};return{x:W/2+F*dot(d,B.r)/z,y:H/2-F*dot(d,B.u)/z,z}};
  const P=(ra,de)=>{const h=altAz(ra,de,lst,V.lat);return{alt:h.alt,az:h.az,...sc(dirOf(h.alt,h.az))}};
  V.vis=ALL.map(s=>({s,...P(s.ra,s.de)}));V.milky=MILKY.map(m=>({m,...P(m.ra,m.de)}));
  const su=sunPos(JD),mo=moonPos(JD);V.sun=P(su.ra,su.de);V.moon=P(mo.ra,mo.de);
  V.sc=sc;V.B=B;
}
const hill=az=>.9+.8*Math.sin(3*az+.4)+.55*Math.sin(7*az+1.3)+.35*Math.sin(13*az+2.1)+.25*Math.sin(29*az);   // distant ridge, degrees
function paintDome(x){
  const W=innerWidth,H=innerHeight,F=V.F,k=clamp(F/420,1,2.4),B=V.B,sc=V.sc;
  x.save();
  x.fillStyle='#080a13';x.fillRect(0,0,W,H);
  // screen direction of "up" in the world, for the sky glow and for closing the ground shape
  const zen=[0,0,1],ux=dot(zen,B.r),uy=-dot(zen,B.u),ul=Math.hypot(ux,uy)||1,upx=ux/ul,upy=uy/ul;
  // horizon ridge: sample the visible part, then close the shape downward
  const pts=[];for(let a=0;a<=360;a+=1.5){const az=a*D2R,q=sc(dirOf(hill(az),az));if(q.z>.03&&Math.abs(q.x-W/2)<W*3&&Math.abs(q.y-H/2)<H*3)pts.push(q)}
  const ok=(v,line)=>v.z>(line?.05:.03)&&v.x>-60&&v.x<W+60&&v.y>-60&&v.y<H+60||(line&&v.z>.05);
  // airglow above the horizon
  const h0=sc(dirOf(0,V.cam.yaw*D2R));
  if(h0.z>.03){const g=x.createLinearGradient(h0.x,h0.y,h0.x+upx*H*.6,h0.y+upy*H*.6);g.addColorStop(0,'rgba(70,52,40,.55)');g.addColorStop(.25,'rgba(30,30,48,.35)');g.addColorStop(1,'rgba(8,10,19,0)');x.fillStyle=g;x.fillRect(0,0,W,H)}
  paintBody(x,{k,blob:F*.042,ok});
  if(pts.length>1){
    // pts run west-to-east around the horizon; keep the run that is on screen in order
    pts.sort((a,b)=>(a.x-b.x)*upy-(a.y-b.y)*upx||0);
    const far=Math.max(W,H)*4;x.beginPath();x.moveTo(pts[0].x,pts[0].y);pts.forEach(q=>x.lineTo(q.x,q.y));
    const L=pts[pts.length-1],f0=pts[0];x.lineTo(L.x-upx*far,L.y-upy*far);x.lineTo(f0.x-upx*far,f0.y-upy*far);x.closePath();
    const g=x.createLinearGradient(h0.x,h0.y,h0.x-upx*H*.5,h0.y-upy*H*.5);g.addColorStop(0,'#14110f');g.addColorStop(1,'#050506');x.fillStyle=g;x.fill();
    x.strokeStyle='rgba(184,149,90,.35)';x.lineWidth=1;x.beginPath();x.moveTo(pts[0].x,pts[0].y);pts.forEach(q=>x.lineTo(q.x,q.y));x.stroke();
  }
  // compass points sit on the ground just below the ridge
  x.font=`600 ${Math.round(13*Math.min(k,1.4))}px 'Noto Serif Thai',serif`;x.textAlign='center';x.textBaseline='middle';
  ['เหนือ','ตะวันออกเฉียงเหนือ','ตะวันออก','ตะวันออกเฉียงใต้','ใต้','ตะวันตกเฉียงใต้','ตะวันตก','ตะวันตกเฉียงเหนือ'].forEach((t,i)=>{
    const q=sc(dirOf(-2.2,i*45*D2R));if(q.z<.1)return;x.fillStyle=i%2?'rgba(184,149,90,.6)':'#dcc28c';x.font=`${i%2?400:600} ${Math.round((i%2?11:13)*Math.min(k,1.4))}px 'Noto Serif Thai',serif`;x.fillText(t,q.x,q.y)});
  // constellation names float at the middle of their figures
  x.font=`400 ${Math.round(12*Math.min(k,1.3))}px 'Noto Serif Thai',serif`;x.fillStyle='rgba(184,149,90,.5)';
  for(const [c,[th,ls]] of Object.entries(CONS)){if(!ls)continue;const m=CMID[c],h=altAz(m.ra,m.de,(gmst(V.JD+V.off/24)+V.lon)%360,V.lat);if(h.alt<6)continue;const q=sc(dirOf(h.alt,h.az));if(q.z<.2)continue;x.fillText(th,q.x,q.y+18*k)}
  x.restore();
}
// mean direction of each figure's stars, for its name
const CMID={};Object.keys(CONS).forEach(c=>{const ss=ALL.filter(s=>s.c===c&&!s.faint);if(!ss.length)return;let v=[0,0,0];ss.forEach(s=>{const r=s.ra*D2R,d=s.de*D2R;v[0]+=Math.cos(d)*Math.cos(r);v[1]+=Math.cos(d)*Math.sin(r);v[2]+=Math.sin(d)});v=nrm(v);CMID[c]={ra:((Math.atan2(v[1],v[0])/D2R)+360)%360,de:Math.asin(v[2])/D2R}});
function render(){
  if(V.mode==='off'||V.mode==='form')return;
  const W=innerWidth,H=innerHeight,dome=V.view==='dome';
  if(V.anim||V.dirty){cc.clearRect(0,0,W,H);
    if(dome){projectDome();paintDome(cc)}else{project();paintSky(cc,{cx:V.cx,cy:V.cy,R:V.R*V.scale})}
    V.dirty=false}
  cx.clearRect(0,0,W,H);cx.globalAlpha=V.alpha;cx.drawImage(cache,0,0,W,H);
  // live overlay: rubber-band line, selected / hovered star
  const k=dome?clamp(V.F/420,1,2.4):clamp(V.R/300,.75,1.7);
  if(V.drag&&V.ptr){const p=V.vis[V.drag.i];cx.strokeStyle='rgba(242,212,138,.7)';cx.lineWidth=1.5;cx.setLineDash([4,5]);cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(V.ptr.x,V.ptr.y);cx.stroke();cx.setLineDash([])}
  const t=performance.now()/1000;
  if(V.sel!=null){const v=V.vis[V.sel];cx.strokeStyle=`rgba(242,212,138,${.55+.35*Math.sin(t*4)})`;cx.lineWidth=1.5;cx.beginPath();cx.arc(v.x,v.y,starR(Math.min(v.s.m,3),k)+8,0,TAU);cx.stroke()}
  if(V.hover!=null&&V.hover!==V.sel){const v=V.vis[V.hover];cx.strokeStyle='rgba(242,212,138,.5)';cx.lineWidth=1;cx.beginPath();cx.arc(v.x,v.y,starR(Math.min(v.s.m,3),k)+6,0,TAU);cx.stroke()}
  cx.globalAlpha=1;
}

/* ---- drawing your own constellation ---- */
function nearest(x,y,max=22){
  const dome=V.view==='dome';
  if(!dome&&Math.hypot(x-V.cx,y-V.cy)>V.R+8)return null;
  let best=null,bd=max;
  V.vis.forEach((v,i)=>{if(v.alt<1||(dome&&!(v.z>.05)))return;const d=Math.hypot(v.x-x,v.y-y)-(v.s.faint?0:Math.max(0,4-v.s.m)*2);if(d<bd){bd=d;best=i}});
  return best;
}
const pt=e=>({x:e.clientX,y:e.clientY});
const PTS=new Map();
function onDown(e){
  if(V.mode!=='sky'||e.button>0)return;const p=pt(e);PTS.set(e.pointerId,p);cv.setPointerCapture(e.pointerId);
  if(V.view==='dome'&&PTS.size===2){const [a,b]=[...PTS.values()];V.drag=null;V.pan=null;V.pinch={d:Math.hypot(a.x-b.x,a.y-b.y),fov:V.cam.fov};return}
  const i=nearest(p.x,p.y,e.pointerType==='mouse'?18:28);
  if(i==null){V.sel=null;V.dirty=true;if(V.view==='dome'&&!V.gyro){V.pan={x:p.x,y:p.y,yaw:V.cam.yaw,pitch:V.cam.pitch};cv.classList.add('pan')}return}
  V.drag={i,x:p.x,y:p.y,moved:false};V.ptr=p;
}
function onMove(e){
  if(V.mode!=='sky')return;const p=pt(e);V.ptr=p;if(PTS.has(e.pointerId))PTS.set(e.pointerId,p);
  if(V.pinch&&PTS.size>=2){const [a,b]=[...PTS.values()];V.cam.fov=clamp(V.pinch.fov*V.pinch.d/Math.max(20,Math.hypot(a.x-b.x,a.y-b.y)),25,110);V.dirty=true;return}
  if(V.pan){const dp=V.cam.fov/innerHeight*1.1;V.cam.yaw=V.pan.yaw-(p.x-V.pan.x)*dp;V.cam.pitch=clamp(V.pan.pitch+(p.y-V.pan.y)*dp,-6,89);V.dirty=true;tip.style.opacity=0;return}
  if(V.drag){if(Math.hypot(p.x-V.drag.x,p.y-V.drag.y)>8)V.drag.moved=true}
  const i=nearest(p.x,p.y,e.pointerType==='mouse'?18:28);
  if(i!==V.hover){V.hover=i;if(i!=null&&e.pointerType==='mouse'){const s=V.vis[i].s;tip.innerHTML=s.faint?'ดาวจาง ๆ':`${esc(s.th)}<small>${esc(s.n)}${CONS[s.c]?' · กลุ่มดาว'+CONS[s.c][0]:''}</small>`;tip.style.opacity=1}else tip.style.opacity=0}
  if(V.hover!=null){const v=V.vis[V.hover];tip.style.left=v.x+'px';tip.style.top=v.y+'px'}
}
function addLine(a,b){
  if(a===b||V.lines.length>=30||V.lines.some(([p,q])=>(p===a&&q===b)||(p===b&&q===a)))return false;
  V.lines.push([a,b]);V.dirty=true;Sound.click(0,.16,2400,.05);buzz(10);syncTools();return true;
}
function onUp(e){
  PTS.delete(e.pointerId);
  if(V.pinch){if(PTS.size<2)V.pinch=null;return}
  if(V.pan){V.pan=null;cv.classList.remove('pan');return}
  if(V.mode!=='sky'||!V.drag)return;const p=pt(e),d=V.drag;V.drag=null;
  const j=nearest(p.x,p.y,e.pointerType==='mouse'?18:28);
  if(d.moved){if(j!=null&&j!==d.i){addLine(d.i,j);V.sel=j}}
  else{ // tap: chain from the selected star
    if(V.sel!=null&&V.sel!==d.i){addLine(V.sel,d.i);V.sel=d.i}else V.sel=V.sel===d.i?null:d.i}
  V.dirty=true;
}
function onWheel(e){if(V.mode!=='sky'||V.view!=='dome')return;e.preventDefault();V.cam.fov=clamp(V.cam.fov*Math.exp(e.deltaY*.0012),25,110);V.dirty=true}

/* ---- phone pointed at the sky: device orientation → camera basis ---- */
async function gyroOn(){
  const DOE=window.DeviceOrientationEvent;if(!DOE)return barMsg('อุปกรณ์นี้ไม่มีเซนเซอร์ทิศทาง');
  if(typeof DOE.requestPermission==='function'){try{if(await DOE.requestPermission()!=='granted')return barMsg('ต้องอนุญาตให้ใช้เซนเซอร์ก่อน')}catch(e){return barMsg('ต้องอนุญาตให้ใช้เซนเซอร์ก่อน')}}
  V.gyroEv='ondeviceorientationabsolute' in window?'deviceorientationabsolute':'deviceorientation';
  V.gotOri=false;V.gb=null;addEventListener(V.gyroEv,onOri);V.gyro=true;V.cam.fov=Math.min(V.cam.fov,75);syncBar();
  barMsg('ยกมือถือชี้ขึ้นฟ้า แล้วหมุนตัวดูรอบ ๆ');
  setTimeout(()=>{if(V.gyro&&!V.gotOri){gyroOff();barMsg('อ่านเซนเซอร์ทิศทางไม่ได้ ใช้การลากแทน')}},1600);
}
function gyroOff(){if(V.gyroEv)removeEventListener(V.gyroEv,onOri);V.gyro=false;V.gb=null;
  // carry on from where the phone was pointing
  if(V.lastB){const f=V.lastB.f;V.cam.yaw=Math.atan2(f[0],f[1])/D2R;V.cam.pitch=clamp(Math.asin(clamp(f[2],-1,1))/D2R,-6,89)}
  syncBar();V.dirty=true}
function onOri(e){
  if(e.alpha==null||e.beta==null)return;V.gotOri=true;
  const al=(e.webkitCompassHeading!=null?360-e.webkitCompassHeading:e.alpha)*D2R,be=e.beta*D2R,ga=e.gamma*D2R;
  const cA=Math.cos(al),sA=Math.sin(al),cB=Math.cos(be),sB=Math.sin(be),cG=Math.cos(ga),sG=Math.sin(ga);
  // device axes in the east-north-up frame (columns of Rz(α)·Rx(β)·Ry(γ))
  const dx=[cA*cG-sA*sB*sG,cG*sA+cA*sB*sG,-cB*sG],dy=[-cB*sA,cA*cB,sB],dz=[cA*sG+cG*sA*sB,sA*sG-cA*cG*sB,cB*cG];
  const th=((screen.orientation&&screen.orientation.angle)||window.orientation||0)*D2R,c=Math.cos(th),s2=Math.sin(th);
  const r=[c*dx[0]-s2*dy[0],c*dx[1]-s2*dy[1],c*dx[2]-s2*dy[2]],f=[-dz[0],-dz[1],-dz[2]];
  const o=V.gb,t=o?.22:1,mix=(a,b)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
  let F=nrm(o?mix(o.f,f):f),R=o?mix(o.r,r):r;R=nrm([R[0]-dot(R,F)*F[0],R[1]-dot(R,F)*F[1],R[2]-dot(R,F)*F[2]]);
  V.gb=V.lastB={f:F,r:R,u:crs(R,F)};V.dirty=true;
}

/* ---- switching between the flat chart and the dome ---- */
function barMsg(t){const m=$('#skyBarMsg');if(!m)return;m.textContent=t;gsap.fromTo(m,{autoAlpha:0},{autoAlpha:1,duration:.3,overwrite:true});gsap.to(m,{autoAlpha:.8,delay:3.5,duration:.6})}
function syncBar(){const g=$('#sbGyro');if(g){g.setAttribute('aria-pressed',V.gyro);g.querySelector('.tx').textContent=V.gyro?'หยุดใช้เซนเซอร์':'ชี้มือถือขึ้นฟ้า'}const u=$('#sbUndo');if(u)u.disabled=!V.lines.length}
async function toDome(){
  if(V.mode!=='sky')return;V.mode='anim';tip.style.opacity=0;V.sel=null;V.hover=null;
  const rm=RM(),b=V.birthStar?V.vis[V.birthStar.i]:null;
  // face the birth star; start looking straight up, which is what the chart shows, then lower the gaze
  const yaw=b&&b.alt>0?b.az/D2R:180,pitch=clamp(((b&&b.alt)||40)-20,20,32);   // low enough that the ridge shows
  const t1=gsap.timeline();
  t1.add(pOut('#skyInfo',{y:40}),0).to(V,{alpha:0,duration:rm?.2:.45,ease:EI,onUpdate:()=>{V.dirty=true}},0);
  await tlDone(t1);
  V.view='dome';V.anim=true;Object.assign(V.cam,rm?{yaw,pitch,fov:78}:{yaw:yaw-40,pitch:88,fov:115});
  const t2=gsap.timeline();
  t2.to(V,{alpha:1,duration:rm?.3:.6,ease:EO},0).add(pIn('#skyBar',{y:30}),0);
  if(!rm)t2.to(V.cam,{yaw,pitch,fov:78,duration:2.2,ease:'expo.inOut'},0);
  await tlDone(t2);
  V.anim=false;V.dirty=true;V.mode='sky';syncBar();
  barMsg(innerWidth<700?'ลากฟ้าเพื่อหมุน · สองนิ้วเพื่อซูม · ลากจากดาวไปดาวเพื่อวาดเส้น':'ลากฟ้าเพื่อหมุนมอง · ล้อเมาส์เพื่อซูม · ลากจากดาวไปดาวเพื่อวาดเส้น');
}
async function toChart(){
  if(V.mode!=='sky')return;V.mode='anim';if(V.gyro)gyroOff();tip.style.opacity=0;V.sel=null;V.hover=null;
  const rm=RM(),t1=gsap.timeline();V.anim=true;
  t1.add(pOut('#skyBar',{y:30}),0);
  if(!rm)t1.to(V.cam,{pitch:88,fov:115,duration:1.1,ease:'expo.in'},0);
  t1.to(V,{alpha:0,duration:.35,ease:EI},rm?0:.8);
  await tlDone(t1);
  V.view='chart';V.anim=false;V.dirty=true;
  const t2=gsap.timeline();t2.to(V,{alpha:1,duration:.5,ease:EO},0).add(pIn('#skyInfo',{y:40}),0);
  await tlDone(t2);
  V.mode='sky';syncTools();
}

function syncTools(){syncBar();const u=$('#skUndo'),c=$('#skClear'),n=V.lines.length;if(u)u.disabled=!n;if(c)c.disabled=!n;const h=$('#skHint');if(h)h.textContent=n?`กลุ่มดาวของคุณมี ${n} เส้น`:'ลากจากดาวดวงหนึ่งไปอีกดวง (หรือแตะทีละดวง) เพื่อสร้างกลุ่มดาวของคุณเอง'}

/* ---- the reading ---- */
function birthFrom(){
  const d=$('#bDate').value,noT=$('#bNoTime').checked,t=noT?'21:00':($('#bTime').value||''),ci=+$('#bCity').value||0;
  if(!d)return{err:'ใส่วันเกิดก่อน'};
  const [Y,M,D]=d.split('-').map(Number);if(!Y||Y<1900)return{err:'ปีเกิดต้องตั้งแต่ ค.ศ. 1900'};
  if(!t)return{err:'ใส่เวลาเกิด หรือเลือก "ไม่ทราบเวลาเกิด"'};
  const [h,m]=t.split(':').map(Number),ms=Date.UTC(Y,M-1,D,h-7,m);       // Thailand is UTC+7 all year
  if(ms>Date.now())return{err:'วันเกิดต้องไม่อยู่ในอนาคต'};
  try{localStorage.setItem('arcana-birth',JSON.stringify({d,t:$('#bTime').value,u:noT,c:ci}))}catch(e){}
  return{Y,M,D,h,m,ms,noT,city:CITIES[ci]};
}
function readingFor(b){
  V.JD=jdOf(b.ms);V.lat=b.city[1];V.lon=b.city[2];V.off=0;V.spin=0;V.scale=1;project();
  const sign=SIGNS[signOf(V.JD,b.Y)],mi=moonInfo(new Date(b.ms));V.moonInfo=mi;
  const cands=Object.keys(STAR_MSG).map(n=>({s:BY[n],v:V.vis[BY[n].i]})).sort((a,c)=>c.v.alt-a.v.alt);
  // brightness and height together: a bright star high overhead beats a brighter one low on the horizon
  const score=c=>c.v.alt>5?(Math.sin(c.v.alt*D2R)*2.2-c.s.m):-99+c.v.alt,best=cands.sort((a,c)=>score(c)-score(a))[0];
  V.birthStar=best.s;
  const age=mi.age,ph=age<1.8||age>27.7?'คืนเดือนมืด จันทร์ซ่อนตัว คุณเกิดมาพร้อมพลังของการเริ่มต้นใหม่และความลึกที่ไม่มีใครมองเห็น':age<7.4?'จันทร์เสี้ยวข้างขึ้น พลังของคุณคือการเติบโตทีละน้อยแต่ไม่หยุด':age<9.2?'จันทร์ครึ่งดวงข้างขึ้น คุณกล้าตัดสินใจและผ่านทางแยกได้เสมอ':age<13.8?'จันทร์ข้างขึ้นใกล้เต็มดวง คุณมีใจที่อยากทำทุกอย่างให้สมบูรณ์':age<15.8?'คืนจันทร์เพ็ญ อารมณ์ของคุณชัดเจนและสว่างไสว ผู้คนมองเห็นตัวตนของคุณได้ง่าย':age<21.5?'จันทร์ข้างแรมยังสว่าง คุณเป็นผู้ให้และส่งต่อสิ่งที่รู้แก่คนอื่น':age<23.3?'จันทร์ครึ่งดวงข้างแรม คุณรู้จักปล่อยวางสิ่งที่ไม่ใช่':'จันทร์เสี้ยวข้างแรม คุณมีปัญญาแบบคนที่ผ่านมามาก และรู้ใจตัวเองดี';
  const when=new Date(b.ms).toLocaleDateString('th-TH',{dateStyle:'long',timeZone:'Asia/Bangkok'})+` · ${String(b.h).padStart(2,'0')}:${String(b.m).padStart(2,'0')} น.`;
  const bsAlt=V.vis[best.s.i].alt;
  return{sign,mi,ph,when,b,best,bsAlt,above:V.sun.alt>0};
}
function infoHTML(r){
  const s=r.best.s;
  return `<div><div class="rd-pos">${esc(r.when)} · ${esc(r.b.city[0])}${r.b.noT?' · เวลาโดยประมาณ':''}</div>
    <h3>ดาวประจำตัว: ${esc(s.th)}</h3><p class="hint">${esc(s.n)}${CONS[s.c]?' · กลุ่มดาว'+CONS[s.c][0]:''}${r.bsAlt>0?` · สูงจากขอบฟ้า ${Math.round(r.bsAlt)}°`:' · ใต้ขอบฟ้าในขณะนั้น'}</p></div>
  <p class="rd-text">${STAR_MSG[s.n]}</p>
  <div class="sk-sec"><b>ราศี${r.sign[0]}</b> · ธาตุ${r.sign[1]}<p>${r.sign[2]}</p></div>
  <div class="sk-sec"><b>ดวงจันทร์วันเกิด</b> · ${r.mi.label} ${moonSVG(r.mi,14)}<p>${r.ph}</p></div>
  ${r.above?'<p class="hint">คุณเกิดตอนกลางวัน ดาวเหล่านี้อยู่บนฟ้าจริงแต่ถูกแสงอาทิตย์กลบไว้</p>':''}
  <div class="sk-sec"><p class="hint" id="skHint"></p>
    <input id="skyName" type="text" maxlength="30" autocomplete="off" placeholder="ตั้งชื่อกลุ่มดาวของคุณ" aria-label="ชื่อกลุ่มดาวของคุณ">
    <div class="row" style="margin-top:10px">
      <button class="btn small" id="skUndo" type="button"><svg class="i" aria-hidden="true"><use href="#i-undo"/></svg>ย้อนเส้น</button>
      <button class="btn small" id="skClear" type="button"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg>ล้าง</button>
      <button class="btn small" id="skAgain" type="button"><svg class="i" aria-hidden="true"><use href="#i-calendar"/></svg>เปลี่ยนวันเกิด</button>
    </div></div>
  <button class="btn" id="skDome" type="button"><svg class="i" aria-hidden="true"><use href="#i-compass"/></svg>มองท้องฟ้ารอบตัว</button>
  <button class="btn primary" id="skSave" type="button"><svg class="i" aria-hidden="true"><use href="#i-save"/></svg> บันทึกรูป</button>`;
}
let R0=null;
async function openSky(){
  const b=birthFrom();if(b.err){$('#bErr').textContent=b.err;return}
  $('#bErr').textContent='';V.lines=[];V.sel=null;V.hover=null;V.view='chart';if(V.gyro)gyroOff();
  const r=R0=readingFor(b);layout();
  const inf=$('#skyInfo');inf.innerHTML=infoHTML(r);syncTools();
  $('#skUndo').onclick=()=>{V.lines.pop();V.dirty=true;syncTools()};
  $('#skClear').onclick=()=>{V.lines=[];V.sel=null;V.dirty=true;syncTools()};
  $('#skAgain').onclick=()=>{if(V.mode==='sky'&&!S.busy)go(backToForm)};
  $('#skSave').onclick=saveSky;
  $('#skDome').onclick=()=>{if(!S.busy)go(toDome)};
  const tl=gsap.timeline();V.mode='anim';V.anim=true;
  tl.add(pOut('#skyForm',{y:40}),0);Sound.whoosh();
  if(RM()){Object.assign(V,{off:0,scale:1,alpha:0,spin:0});tl.to(V,{alpha:1,duration:.5},.2).set(cv,{autoAlpha:1},.2)}
  else{
    // the camera falls through space, then the sky of that night wheels into place
    Object.assign(V,{off:-7,scale:.18,alpha:0,spin:-1.2});
    tl.set(cv,{autoAlpha:1},.1).to(STAR,{warp:1,duration:.8,ease:EIO},0).to(STAR,{warp:0,duration:1.4,ease:EO},1)
      .to('#bgimg',{autoAlpha:.18,duration:1.4,ease:EO},0)
      .to(V,{alpha:1,duration:.9,ease:EO},.7).to(V,{scale:1,duration:2.6,ease:'expo.out'},.7)
      .to(V,{off:0,spin:0,duration:3.4,ease:'expo.out'},.7)
      .add(()=>{Sound.chime();buzz([15,40,25])},2.6).to(STAR,{boost:.8,duration:.3,ease:EO},2.6).to(STAR,{boost:0,duration:1.4,ease:EI},2.9);
  }
  tl.add(()=>{V.anim=false;V.dirty=true;V.mode='sky';cv.classList.add('draw')},RM()?.7:3.9)
    .add(pIn(inf,{x:innerWidth>=900?60:0,y:innerWidth>=900?0:60}),RM()?.6:2.9)
    .add(()=>{const p=inf.querySelector('.rd-text');p&&typeIn(p,.1)},RM()?.6:3.1);
  await tlDone(tl);
}
async function backToForm(){
  if(V.gyro)gyroOff();V.view='chart';V.mode='anim';cv.classList.remove('draw');tip.style.opacity=0;
  const tl=gsap.timeline();
  tl.add(pOut('#skyInfo',{y:40}),0).to(V,{alpha:0,scale:RM()?1:.7,duration:RM()?.3:.8,ease:EI,onUpdate:()=>{V.dirty=true;V.anim=true}},0).set(cv,{autoAlpha:0})
    .add(()=>{V.anim=false;V.mode='form'}).add(pIn('#skyForm',{y:40}));
  await tlDone(tl);
}

/* ---- export ---- */
async function saveSky(){
  const btn=$('#skSave');if(!btn||btn.disabled||!R0)return;btn.disabled=true;const old=btn.innerHTML;btn.textContent='กำลังสร้าง…';
  try{
    await Promise.all([document.fonts.load("600 64px Cinzel"),document.fonts.load("400 26px 'Noto Serif Thai'",'ก'),document.fonts.load("600 30px 'Noto Serif Thai'",'ก')]).catch(()=>{});
    const [bg,tl,tr,bl,br]=await Promise.all([loadArt('assets/bg_m.webp'),loadArt('assets/corner-tl.webp'),loadArt('assets/corner-tr.webp'),loadArt('assets/corner-bl.webp'),loadArt('assets/corner-br.webp')]);
    const W=1080,H=1640,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),TH="'Noto Serif Thai',serif",r=R0,name=($('#skyName')?.value||'').trim();
    x.fillStyle='#0a0a0d';x.fillRect(0,0,W,H);
    if(bg){x.globalAlpha=.4;coverDraw(x,bg,W,H);x.globalAlpha=1}
    let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(8,8,11,.7)');g.addColorStop(1,'rgba(8,8,11,.85)');x.fillStyle=g;x.fillRect(0,0,W,H);
    x.strokeStyle=PNG.line+'.8)';x.lineWidth=2;rr(x,22,22,W-44,H-44,18);x.stroke();x.strokeStyle=PNG.line+'.35)';x.lineWidth=1;rr(x,34,34,W-68,H-68,12);x.stroke();
    if(tl&&tr&&bl&&br){const o=92;x.drawImage(tl,10,10,o,o);x.drawImage(tr,W-10-o,10,o,o);x.drawImage(bl,10,H-10-o,o,o);x.drawImage(br,W-10-o,H-10-o,o,o)}
    x.textAlign='center';x.textBaseline='alphabetic';
    x.font="600 58px Cinzel";setLS(x,'12px');const tg=x.createLinearGradient(0,60,0,120);tg.addColorStop(0,'#f3dfa8');tg.addColorStop(1,'#a87d3e');x.fillStyle=tg;x.fillText('ARCANA',W/2+6,122);setLS(x,'0px');
    x.font=`600 36px ${TH}`;x.fillStyle=PNG.gold2;x.fillText(name?`กลุ่มดาว${name}`:'ท้องฟ้าคืนที่ฉันเกิด',W/2,184);
    x.font=`400 22px ${TH}`;x.fillStyle=PNG.muted;x.fillText(`${r.when} · ${r.b.city[0]}`,W/2,222);
    // the sky, redrawn at print size
    const keep={cx:V.cx,cy:V.cy,R:V.R,scale:V.scale,spin:V.spin,off:V.off};
    const PY=300+410,PR=390;Object.assign(V,{cx:W/2,cy:PY,R:PR,scale:1,spin:0,off:0});project();   // the chart, whatever the screen shows
    paintSky(x,{cx:W/2,cy:PY,R:PR,png:true,ts:1.4});
    Object.assign(V,keep);project();V.dirty=true;
    let y=PY+PR+118;
    x.strokeStyle=PNG.line+'.5)';x.lineWidth=1;x.beginPath();x.moveTo(W/2-220,y-34);x.lineTo(W/2+220,y-34);x.stroke();x.fillStyle=PNG.gold2;diamond(x,W/2,y-34,5);
    x.font=`600 30px ${TH}`;x.fillStyle=PNG.gold2;x.fillText(`ดาวประจำตัว: ${r.best.s.th}`,W/2,y+8);
    x.font=`400 22px ${TH}`;x.fillStyle=PNG.muted;x.fillText(`ราศี${r.sign[0]} · ธาตุ${r.sign[1]} · ดวงจันทร์${r.mi.label}`,W/2,y+46);
    x.font=`400 26px ${TH}`;x.fillStyle=PNG.ink;y+=104;for(const l of wrapLines(x,STAR_MSG[r.best.s.n],W-200).slice(0,3)){x.fillText(l,W/2,y);y+=40}
    y=H-74;x.strokeStyle=PNG.line+'.5)';x.beginPath();x.moveTo(W/2-200,y);x.lineTo(W/2-16,y);x.moveTo(W/2+16,y);x.lineTo(W/2+200,y);x.stroke();x.fillStyle=PNG.gold2;diamond(x,W/2,y,6);
    x.font="400 18px Cinzel";setLS(x,'5px');x.fillStyle='#7f7a70';x.fillText('ARCANA · BIRTH SKY',W/2+2,y+38);setLS(x,'0px');
    const blob=await new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('toBlob failed')),'image/png'));
    const fn=`arcana-sky-${r.b.Y}-${String(r.b.M).padStart(2,'0')}-${String(r.b.D).padStart(2,'0')}.png`,file=new File([blob],fn,{type:'image/png'});
    let shared=false;
    if(S.lastPtr!=='mouse'&&navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'ARCANA · ดาวเกิด'});shared=true}catch(e){shared=e&&e.name==='AbortError'}}
    if(!shared){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000)}
    btn.innerHTML='<svg class="i" aria-hidden="true"><use href="#i-check"/></svg> บันทึกแล้ว';
  }catch(e){console.error(e);btn.textContent='บันทึกไม่สำเร็จ'}
  setTimeout(()=>{btn.innerHTML=old;btn.disabled=false},1800);
}

/* ---- enter / leave ---- */
let ticking=false;
function startTick(){if(!ticking){ticking=true;gsap.ticker.add(render)}}
function stopTick(){if(ticking){ticking=false;gsap.ticker.remove(render)}}
async function enter(){
  build();setState('stars');layout();V.mode='form';startTick();
  const tl=gsap.timeline();
  tl.to('#bgimg',{autoAlpha:.45,duration:1,ease:EO},0).add(pIn('#skyForm',{y:50}),.1);
  if(!RM())tl.to(STAR,{boost:.5,duration:.4,ease:EO},0).to(STAR,{boost:0,duration:1.2,ease:EI},.4);
  await tlUntil(tl,.5);
  setTimeout(()=>{if(V.mode==='form'&&S.lastPtr==='mouse')$('#bDate').focus({preventScroll:true})},400);
}
async function leave(){
  setState('gather');V.mode='anim';cv.classList.remove('draw');tip.style.opacity=0;
  const tl=gsap.timeline();
  if(V.gyro)gyroOff();
  tl.add(pOut('#skyForm',{y:40}),0).add(pOut('#skyInfo',{y:40}),0).add(pOut('#skyBar',{y:30}),0)
    .to(V,{alpha:0,duration:RM()?.3:.7,ease:EI,onUpdate:()=>{V.dirty=true}},0).set(cv,{autoAlpha:0})
    .to('#bgimg',{autoAlpha:1,duration:1,ease:EO},.2);
  await tlDone(tl);V.mode='off';V.view='chart';stopTick();
}
function resize(){if(!built||V.mode==='off')return;layout()}
return{enter,leave,resize,V,_render:render};   // _render: lets a test drive frames by hand
})();
