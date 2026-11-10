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
Eta UMi|อีตาหมีเล็ก|16.292|75.755|4.95|UMi
Al Tarf|อัลทาร์ฟ|8.275|9.186|3.52|Cnc
Asellus Australis|อะเซลลัสใต้|8.745|18.154|3.94|Cnc
Asellus Borealis|อะเซลลัสเหนือ|8.722|21.469|4.66|Cnc
Acubens|อาคูเบนส์|8.975|11.858|4.25|Cnc
Iota Cnc|ไอโอตาปู|8.778|28.760|4|Cnc
Alrescha|อัลเรชา|2.034|2.764|3.82|Psc
Eta Psc|อีตาปลา|1.525|15.346|3.62|Psc
Gamma Psc|แกมมาปลา|23.286|3.282|3.69|Psc
Iota Psc|ไอโอตาปลา|23.666|5.626|4.13|Psc
Theta Psc|ทีตาปลา|23.466|6.379|4.27|Psc
Omega Psc|โอเมกาปลา|23.988|6.863|4.01|Psc
Delta Psc|เดลตาปลา|.811|7.585|4.43|Psc
Eps Psc|เอปไซลอนปลา|1.049|7.890|4.27|Psc
Omicron Psc|โอไมครอนปลา|1.757|9.158|4.26|Psc
Phi Psc|ฟายปลา|1.229|24.583|4.65|Psc
Sadachbia|ซาดัคเบีย|22.361|-1.387|3.84|Aqr
Zeta Aqr|ซีตาคนแบกหม้อน้ำ|22.481|-.020|3.65|Aqr
Eta Aqr|อีตาคนแบกหม้อน้ำ|22.589|-.117|4.02|Aqr
Lambda Aqr|แลมบ์ดาคนแบกหม้อน้ำ|22.877|-7.580|3.74|Aqr
Skat|สแกต|22.911|-15.821|3.27|Aqr
Albali|อัลบาลี|20.795|-9.496|3.77|Aqr
Nashira|นาชิรา|21.668|-16.662|3.68|Cap
Zeta Cap|ซีตาแพะทะเล|21.444|-22.411|3.74|Cap
Theta Cap|ทีตาแพะทะเล|21.099|-17.233|4.07|Cap
Omega Cap|โอเมกาแพะทะเล|20.864|-26.919|4.11|Cap
Psi Cap|ไซแพะทะเล|20.768|-25.271|4.14|Cap
Brachium|บราเคียม|15.068|-25.282|3.29|Lib
Zubenelhakrabi|ซูเบนเอลฮาคราบี|15.592|-14.789|3.91|Lib
41 Ari|41 แกะ|2.833|27.260|3.63|Ari
Zeta Tau|ซีตาวัว|5.627|21.143|3|Tau`;
const CONS={
  Ori:['นายพราน','Meissa-Betelgeuse Meissa-Bellatrix Betelgeuse-Bellatrix Betelgeuse-Alnitak Bellatrix-Mintaka Mintaka-Alnilam Alnilam-Alnitak Alnitak-Saiph Mintaka-Rigel'],
  CMa:['สุนัขใหญ่','Mirzam-Sirius Sirius-Wezen Wezen-Adhara Wezen-Aludra'],
  CMi:['สุนัขเล็ก','Procyon-Gomeisa'],
  Gem:['คนคู่','Castor-Mebsuta Mebsuta-Tejat Pollux-Wasat Wasat-Mekbuda Mekbuda-Alhena Castor-Pollux'],
  Tau:['วัว','Elnath-Ain Ain-Delta Tau Delta Tau-Gamma Tau Gamma Tau-Aldebaran Aldebaran-Zeta Tau'],
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
  Ari:['แกะ','Hamal-Sheratan Sheratan-Mesarthim 41 Ari-Hamal'],
  Lib:['คันชั่ง','Zubeneschamali-Zubenelgenubi Zubenelgenubi-Brachium Zubeneschamali-Zubenelhakrabi Zubenelhakrabi-Brachium'],
  Aqr:['คนแบกหม้อน้ำ','Albali-Sadalsuud Sadalsuud-Sadalmelik Sadalmelik-Sadachbia Sadachbia-Zeta Aqr Zeta Aqr-Eta Aqr Sadachbia-Lambda Aqr Lambda Aqr-Skat'],
  Cap:['แพะทะเล','Algedi-Dabih Dabih-Psi Cap Psi Cap-Omega Cap Omega Cap-Zeta Cap Zeta Cap-Deneb Algedi Deneb Algedi-Nashira Nashira-Theta Cap Theta Cap-Dabih'],
  Cnc:['ปู','Iota Cnc-Asellus Borealis Asellus Borealis-Asellus Australis Asellus Australis-Acubens Asellus Australis-Al Tarf'],
  Psc:['ปลา','Phi Psc-Eta Psc Eta Psc-Omicron Psc Omicron Psc-Alrescha Alrescha-Eps Psc Eps Psc-Delta Psc Delta Psc-Omega Psc Omega Psc-Iota Psc Iota Psc-Theta Psc Theta Psc-Gamma Psc Gamma Psc-Iota Psc'],
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

/* zodiac figures (painted line art, assets/zodiac/*.webp): centre (RA h, Dec °) and height on the sky (°),
   in the order of SIGNS, so the sun's sign index is the figure's index. Each is drawn upright to celestial north. */
/* Each figure is pinned to its constellation: anchors pair a point on the painting (fractions of its width and
   height) with a star. Every frame the figure gets the similarity transform (scale, turn, shift) that best lays
   those points on the projected stars, mirrored if that fits better, so it sits on the real stars in the chart
   and in the dome alike. Order follows SIGNS. */
const ZOD=[
  ['aries','Ari',[[.7202,.4066,'Hamal'],[.9137,.6404,'Sheratan'],[.9341,.7760,'Mesarthim'],[.0898,.0350,'41 Ari']]],
  ['taurus','Tau',[[.4779,.5796,'Aldebaran'],[.1301,.0511,'Elnath'],[.8218,.2392,'Alcyone'],[.5306,.4673,'Ain'],[.5981,.6144,'Gamma Tau'],[.5732,.5348,'Delta Tau'],[.0282,.3597,'Zeta Tau']]],
  ['gemini','Gem',[[.1244,.2934,'Pollux'],[.2392,.0891,'Castor'],[.7955,.9529,'Alhena'],[.9342,.6055,'Tejat'],[.9265,.4610,'Mebsuta'],[.3599,.6455,'Wasat'],[.5206,.7268,'Mekbuda']]],
  ['cancer','Cnc',[[.7824,.9710,'Al Tarf'],[.4800,.5421,'Asellus Australis'],[.4944,.3836,'Asellus Borealis'],[.3326,.8424,'Acubens'],[.4628,.0290,'Iota Cnc']]],
  ['leo','Leo',[[.7842,.8281,'Regulus'],[.6995,.4408,'Algieba'],[.0765,.6614,'Denebola'],[.3404,.3932,'Zosma'],[.9208,.2268,'Eps Leo'],[.3308,.6471,'Chertan'],[.7190,.2639,'Adhafera'],[.7868,.5890,'Eta Leo'],[.8710,.1208,'Rasalas']]],
  ['virgo','Vir',[[.1944,.8592,'Spica'],[.5083,.4947,'Porrima'],[.3616,.0375,'Vindemiatrix'],[.1248,.4640,'Zeta Vir'],[.4084,.3179,'Delta Vir'],[.8824,.3753,'Beta Vir'],[.6650,.4664,'Eta Vir']]],
  ['libra','Lib',[[.4411,.1470,'Zubeneschamali'],[.8428,.4848,'Zubenelgenubi'],[.6347,.9476,'Brachium'],[.1572,.4225,'Zubenelhakrabi']]],
  ['scorpius','Sco',[[.5700,.3217,'Antares'],[.1152,.7297,'Shaula'],[.1126,.9538,'Sargas'],[.8126,.1932,'Dschubba'],[.4105,.6088,'Eps Sco'],[.0623,.8098,'Kappa Sco'],[.7822,.0793,'Graffias'],[.1352,.7346,'Lesath'],[.5181,.3863,'Tau Sco'],[.8089,.3285,'Pi Sco'],[.6355,.2937,'Sigma Sco'],[.3984,.7471,'Mu Sco'],[.0330,.8563,'Iota Sco'],[.2719,.9455,'Eta Sco'],[.3816,.9081,'Zeta Sco']]],
  ['sagittarius','Sgr',[[.7392,.8775,'Kaus Australis'],[.3552,.1808,'Nunki'],[.2705,.4954,'Ascella'],[.7870,.4861,'Kaus Media'],[.7064,.1025,'Kaus Borealis'],[.9740,.5534,'Alnasl'],[.4790,.2363,'Phi Sgr'],[.2091,.3094,'Tau Sgr']]],
  ['capricornus','Cap',[[.0434,.3776,'Deneb Algedi'],[.9083,.3029,'Dabih'],[.9452,.1840,'Algedi'],[.1156,.4016,'Nashira'],[.2590,.6993,'Zeta Cap'],[.4561,.4203,'Theta Cap'],[.5890,.9340,'Omega Cap'],[.6441,.8476,'Psi Cap']]],
  ['aquarius','Aqr',[[.6449,.3826,'Sadalsuud'],[.4303,.2428,'Sadalmelik'],[.3309,.2708,'Sadachbia'],[.2856,.2349,'Zeta Aqr'],[.2447,.2374,'Eta Aqr'],[.1374,.4359,'Lambda Aqr'],[.1279,.6584,'Skat'],[.9357,.5009,'Albali']]],
  ['pisces','Psc',[[.0469,.8868,'Alrescha'],[.2337,.5029,'Eta Psc'],[.9617,.8699,'Gamma Psc'],[.8258,.8001,'Iota Psc'],[.8937,.7735,'Theta Psc'],[.7181,.7656,'Omega Psc'],[.4565,.7470,'Delta Psc'],[.3814,.7370,'Eps Psc'],[.1514,.6889,'Omicron Psc'],[.3324,.2193,'Phi Psc']]]
].map(([n,c,anc],i)=>({n,c,anc,i,a:0,img:null,refl:null}));
const ZTH=['แกะ','วัว','คนคู่','ปู','สิงโต','หญิงสาว','คันชั่ง','แมงป่อง','คนยิงธนู','แพะทะเล','คนแบกหม้อน้ำ','ปลา'];
const ZBYC={};ZOD.forEach(z=>{if(z.c)ZBYC[z.c]=z});
let zodLoaded=false;
let typedT='';                               // birth time typed before "unknown time" was ticked
function loadZodiac(){
  if(zodLoaded||location.protocol==='file:')return;zodLoaded=true;
  ZOD.forEach(z=>{const im=new Image();im.onload=()=>{z.img=im;V.dirty=true};im.src=`assets/zodiac/${z.n}.webp?v=2`});
}
/* resting opacity: the birth sign a little stronger, the rest faint, all hidden when switched off */
function zodRest(z){return !Z.show?0:(R0&&z.i===R0.signIdx?.34:.15)}
const Z={show:true,hover:null};
function zodFade(z,to){gsap.to(z,{a:to,duration:.45,ease:EO,overwrite:'auto',onUpdate:()=>{V.dirty=true}})}
function zodHover(z){
  if(Z.hover===z)return;const was=Z.hover;Z.hover=z;
  if(was)zodFade(was,zodRest(was));if(z)zodFade(z,Z.show?.62:.5);
}
function zodAll(){ZOD.forEach(z=>zodFade(z,z===Z.hover?.62:zodRest(z)))}
/* least-squares similarity from painting points to screen points (complex form q = a·p + b, p mirrored
   when refl); returns the canvas transform, the residual and where the figure's centre lands */
function zodSolve(pts,refl,W,H){
  let px=0,py=0,qx=0,qy=0;const n=pts.length;pts.forEach(t=>{px+=t[0];py+=t[1];qx+=t[2];qy+=t[3]});px/=n;py/=n;qx/=n;qy/=n;
  let nr=0,ni=0,dd=0;
  for(const [x,y,X,Y] of pts){const ux=x-px,uy=(y-py)*(refl?-1:1),vx=X-qx,vy=Y-qy;nr+=vx*ux+vy*uy;ni+=vy*ux-vx*uy;dd+=ux*ux+uy*uy}
  const ar=nr/dd,ai=ni/dd,s=refl?-1:1;
  let err=0;for(const [x,y,X,Y] of pts){const ux=x-px,uy=(y-py)*s;err+=(ar*ux-ai*uy+qx-X)**2+(ai*ux+ar*uy+qy-Y)**2}
  // canvas transform: x' = ar·x − s·ai·y + e, y' = ai·x + s·ar·y + f
  const m=[ar,ai,-s*ai,s*ar,qx-ar*px+s*ai*py,qy-ai*px-s*ar*py];
  return{m,err,k:Math.hypot(ar,ai),cx:m[0]*W/2+m[2]*H/2+m[4],cy:m[1]*W/2+m[3]*H/2+m[5]};
}
function zodPlace(z,P){
  if(!z.img)return null;const W=z.img.width,H=z.img.height,pts=[];let alt=0;
  for(const [u,v,n] of z.anc){const s=BY[n];if(!s)continue;const q=P(s.ra,s.de);if(q.z!==undefined&&q.z<.05)return null;if(!(Math.abs(q.x)<1e5))return null;alt+=q.alt;pts.push([u*W,v*H,q.x,q.y])}
  if(pts.length<2)return null;
  if(z.refl===null){const a=zodSolve(pts,false,W,H),b=zodSolve(pts,true,W,H);z.refl=b.err<a.err}   // decided once
  const f=zodSolve(pts,z.refl,W,H),h=f.k*H;if(!(h>6)||h>5000)return null;
  return{x:f.cx,y:f.cy,h,alt:alt/pts.length,m:f.m};
}
function paintZodiac(x,P,alphaK=1){
  for(const z of ZOD){
    if(!z.img||z.a<.01)continue;const q=zodPlace(z,P);if(!q||q.alt<-12)continue;
    x.save();x.globalAlpha=z.a*alphaK;x.transform(...q.m);x.drawImage(z.img,0,0);x.restore();
  }
}
/* the figure under the pointer: a star of its constellation, or inside its outline circle */
function zodAt(x,y,starIdx){
  if(starIdx!=null){const s=V.vis[starIdx].s;if(s.c&&ZBYC[s.c])return ZBYC[s.c]}
  let best=null,bd=1e9;
  for(const z of ZOD){const q=z.qLive;if(!q)continue;const d=Math.hypot(q.x-x,q.y-y);if(d<q.h*.5&&d<bd){bd=d;best=z}}
  return best;
}

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
#skyForm{position:fixed;left:50%;top:50%;z-index:6;width:min(420px,calc(100vw - 32px));padding:58px 26px 16px;display:flex;flex-direction:column;gap:12px;opacity:0;visibility:hidden;
  border-color:rgba(220,194,140,.45);border-radius:18px;
  background:radial-gradient(1px 1px at 14% 22%,rgba(255,240,210,.55),transparent 2px),radial-gradient(1px 1px at 82% 14%,rgba(255,240,210,.45),transparent 2px),
    radial-gradient(1.5px 1.5px at 70% 38%,rgba(255,240,210,.35),transparent 2px),radial-gradient(1px 1px at 30% 64%,rgba(255,240,210,.3),transparent 2px),
    radial-gradient(1px 1px at 90% 72%,rgba(255,240,210,.35),transparent 2px),radial-gradient(1px 1px at 8% 86%,rgba(255,240,210,.3),transparent 2px),
    radial-gradient(130% 70% at 50% 0%,rgba(52,62,104,.5),transparent 62%),linear-gradient(180deg,rgba(14,15,24,.9),rgba(10,10,14,.94));
  box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 1px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,236,196,.08)}
#skyForm .sf-frame{position:absolute;inset:7px;border:1px solid rgba(184,149,90,.16);border-radius:12px;pointer-events:none;--c:rgba(220,194,140,.75);
  background:linear-gradient(var(--c),var(--c)) 0 0/22px 1px,linear-gradient(var(--c),var(--c)) 0 0/1px 22px,
    linear-gradient(var(--c),var(--c)) 100% 0/22px 1px,linear-gradient(var(--c),var(--c)) 100% 0/1px 22px,
    linear-gradient(var(--c),var(--c)) 0 100%/22px 1px,linear-gradient(var(--c),var(--c)) 0 100%/1px 22px,
    linear-gradient(var(--c),var(--c)) 100% 100%/22px 1px,linear-gradient(var(--c),var(--c)) 100% 100%/1px 22px;background-repeat:no-repeat}
#skyForm .sf-medal{position:absolute;left:50%;top:-46px;width:92px;height:92px;margin-left:-46px;pointer-events:none;filter:drop-shadow(0 8px 16px rgba(0,0,0,.7))}
#skyForm .sf-medal::before{content:"";position:absolute;inset:0;background:url(assets/medallion.webp) center/contain no-repeat;animation:sfSpin 90s linear infinite}
#skyForm .sf-medal::after{content:"";position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#fff6dc;
  box-shadow:0 0 8px 4px rgba(255,226,170,.85),0 0 24px 10px rgba(242,212,138,.35);animation:sfPulse 3.2s ease-in-out infinite}
@keyframes sfSpin{to{transform:rotate(360deg)}}
@keyframes sfPulse{50%{opacity:.7;transform:scale(.8)}}
@media (prefers-reduced-motion:reduce){#skyForm .sf-medal::before,#skyForm .sf-medal::after{animation:none}}
#skyForm .sf-kick{margin:0;text-align:center;font-family:'Cinzel',serif;font-size:11.5px;letter-spacing:.42em;padding-left:.42em;color:var(--gold)}
#skyForm h3,#skyInfo h3{margin:0;font-weight:600;color:var(--gold2);font-size:20px}
#skyForm h3{margin-top:-4px;text-align:center;font-size:23px;text-shadow:0 0 18px rgba(233,190,110,.25)}
#skyForm .sf-rule{position:relative;height:9px;margin:0 20%;background:linear-gradient(90deg,transparent,rgba(220,194,140,.6) 30%,rgba(220,194,140,.6) 70%,transparent) center/100% 1px no-repeat}
#skyForm .sf-rule::after{content:"";position:absolute;left:50%;top:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;background:var(--gold2);transform:rotate(45deg);box-shadow:0 0 8px rgba(242,212,138,.7)}
#skyForm .sub{text-wrap:balance;margin:0 0 6px;color:var(--muted);font-size:14px;line-height:1.65;text-align:center}
#skyForm .sf-row{display:grid;grid-template-columns:1.25fr 1fr;gap:10px}
@media (max-width:420px){#skyForm .sf-row{grid-template-columns:minmax(0,1fr);gap:12px}#skyForm{gap:10px;padding:54px 20px 12px}}
#skyForm label{display:flex;flex-direction:column;gap:6px;font-size:13px;color:var(--gold);letter-spacing:.02em;min-width:0}
#skyForm label.chk{flex-direction:row;align-items:center;gap:9px;color:var(--muted);cursor:pointer;margin-top:-2px}
#skyForm input,#skyForm select,#skyName{background:rgba(22,21,26,.75);border:1px solid var(--line);border-radius:10px;color:var(--ink);padding:10px 12px;font:inherit;font-size:16px;touch-action:auto;color-scheme:dark}
#skyForm input,#skyForm select{width:100%;box-sizing:border-box;min-width:0;background:linear-gradient(180deg,rgba(6,8,16,.75),rgba(16,16,24,.7));border-color:rgba(184,149,90,.3);
  box-shadow:inset 0 2px 6px rgba(0,0,0,.45);transition:border-color .2s,box-shadow .2s,opacity .2s}
#skyForm input:hover:not(:disabled),#skyForm select:hover{border-color:rgba(220,194,140,.55)}
#skyForm input:focus,#skyForm select:focus{outline:none;border-color:var(--gold2);box-shadow:inset 0 2px 6px rgba(0,0,0,.45),0 0 0 3px rgba(220,194,140,.14),0 0 22px rgba(220,194,140,.14)}
#skyForm input:disabled{opacity:.35;cursor:not-allowed}
#skyForm input[type=checkbox]{appearance:none;-webkit-appearance:none;flex:none;width:18px;height:18px;padding:0;border-radius:5px;border:1px solid rgba(220,194,140,.6);background:rgba(6,8,16,.7);box-shadow:none;display:grid;place-content:center;cursor:pointer}
#skyForm input[type=checkbox]::after{content:"";width:5px;height:9px;margin-top:-2px;border:solid #17130e;border-width:0 2px 2px 0;transform:rotate(45deg) scale(0);transition:transform .15s}
#skyForm input[type=checkbox]:checked{background:linear-gradient(180deg,#e6cf9c,#c4a066);border-color:#e6cf9c}
#skyForm input[type=checkbox]:checked::after{transform:rotate(45deg) scale(1)}
#skyForm input[type=checkbox]:focus-visible{outline:2px solid var(--gold2);outline-offset:2px}
#skyName:focus-visible{outline:2px solid var(--gold2);outline-offset:1px}
#skyForm .btn.primary{position:relative;overflow:hidden;margin-top:6px;padding:13px 28px;letter-spacing:.08em;border-radius:12px;
  background:linear-gradient(180deg,#ecd6a2,#c9a466 55%,#b48c50);box-shadow:0 8px 24px rgba(196,160,102,.25),inset 0 1px 0 rgba(255,250,230,.6)}
#skyForm .btn.primary::before,#skyForm .btn.primary::after{content:"✦";position:static;display:inline;width:auto;height:auto;margin:0 .7em;background:none;rotate:none;scale:1;font-size:.75em;opacity:.6}
#skyForm .btn.primary span{position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.45) 50%,transparent 70%);transform:translateX(-120%);transition:transform .8s;pointer-events:none}
#skyForm .btn.primary:hover span{transform:translateX(120%)}
#skyForm .err{margin:0;min-height:1.4em;color:#e0a49a;font-size:13px;text-align:center}
#skyForm .sf-field{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;box-sizing:border-box;min-width:0;padding:10px 12px;border-radius:10px;cursor:pointer;
  font:inherit;font-size:16px;color:var(--ink);text-align:left;border:1px solid rgba(184,149,90,.3);background:linear-gradient(180deg,rgba(6,8,16,.75),rgba(16,16,24,.7));
  box-shadow:inset 0 2px 6px rgba(0,0,0,.45);transition:border-color .2s,box-shadow .2s}
#skyForm .sf-field .v{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
#skyForm .sf-field .v.ph{color:var(--muted)}
#skyForm .sf-field .i{flex:none;width:17px;height:17px;color:var(--gold2)}
#skyForm .sf-field:hover{border-color:rgba(220,194,140,.55)}
#skyForm .sf-field:focus-visible,#skyForm .sf-field[aria-expanded=true]{outline:none;border-color:var(--gold2);box-shadow:inset 0 2px 6px rgba(0,0,0,.45),0 0 0 3px rgba(220,194,140,.14),0 0 22px rgba(220,194,140,.14)}
.sf-cal{position:absolute;z-index:3;left:14px;right:14px;padding:14px 14px 10px;border-radius:14px;border:1px solid rgba(220,194,140,.5);color:var(--ink);
  background:radial-gradient(120% 60% at 50% 0%,rgba(60,70,118,.55),transparent 65%),linear-gradient(180deg,#10111c,#09090e);
  box-shadow:0 24px 60px rgba(0,0,0,.75),0 0 0 1px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,236,196,.1)}
.sf-cal[hidden]{display:none}
.sf-cal::before{content:"";position:absolute;inset:5px;border:1px solid rgba(184,149,90,.14);border-radius:10px;pointer-events:none}
.cal-head{display:flex;align-items:center;gap:6px;margin-bottom:10px}
.cal-head button{font:inherit;color:var(--gold2);background:none;border:1px solid transparent;border-radius:9px;cursor:pointer}
.cal-nav{width:36px;height:36px;display:grid;place-content:center;font-size:22px;line-height:1}
.cal-nav:hover:not(:disabled),.cal-title:hover{border-color:rgba(220,194,140,.4);background:rgba(220,194,140,.06)}
.cal-nav:disabled{opacity:.25;cursor:default}
.cal-title{flex:1;height:36px;font-size:17px;font-weight:600;letter-spacing:.02em;text-shadow:0 0 14px rgba(233,190,110,.3)}
.cal-title small{margin-left:.45em;font-family:'Cinzel',serif;font-size:11px;font-weight:400;color:var(--gold);letter-spacing:.12em}
.cal-title::after{content:"";display:inline-block;width:6px;height:6px;margin:0 0 3px 8px;border:solid var(--gold);border-width:0 1.5px 1.5px 0;transform:rotate(45deg)}
.cal-grid{display:grid;gap:4px}
.cal-grid.d{grid-template-columns:repeat(7,1fr)}
.cal-grid.m{grid-template-columns:repeat(3,1fr);gap:8px}
.cal-grid.y{grid-template-columns:repeat(4,1fr);gap:6px}
.cal-wd{text-align:center;font-size:12px;color:var(--gold);padding:2px 0 6px;opacity:.85}
.cal-grid button{font:inherit;color:var(--ink);background:none;border:1px solid transparent;border-radius:9px;cursor:pointer;transition:background-color .15s,border-color .15s,color .15s}
.cal-grid.d button{height:36px;font-size:14.5px;display:grid;place-content:center}
.cal-grid.m button{padding:12px 0;font-size:15px}
.cal-grid.y button{padding:6px 0;font-size:15px;line-height:1.2}
.cal-grid.y button small{display:block;font-family:'Cinzel',serif;font-size:10.5px;color:var(--muted)}
.cal-grid button:hover:not(:disabled){border-color:rgba(220,194,140,.45);background:rgba(220,194,140,.08);color:var(--gold2)}
.cal-grid button:focus-visible{outline:none;border-color:var(--gold2);box-shadow:0 0 0 2px rgba(220,194,140,.25)}
.cal-grid button:disabled{opacity:.22;cursor:default}
.cal-grid button.now{border-color:rgba(220,194,140,.35)}
.cal-grid button.sun{color:#e3a99b}
.cal-grid button[aria-selected=true]{background:linear-gradient(180deg,#ecd6a2,#c4a066);color:#17130e;font-weight:600;border-color:#ecd6a2;box-shadow:0 0 14px rgba(236,214,162,.45)}
.cal-grid button[aria-selected=true] small{color:#3a2f1e}
.cal-foot{display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:8px;border-top:1px solid rgba(184,149,90,.18);font-size:12.5px;color:var(--muted)}
.cal-foot button{font:inherit;font-size:13px;color:var(--gold2);background:none;border:none;cursor:pointer;padding:4px 6px;border-radius:6px}
.cal-foot button:hover{background:rgba(220,194,140,.08)}
#skyInfo{position:fixed;z-index:6;overflow-y:auto;padding:16px 18px 18px;line-height:1.75;font-size:15px;scrollbar-width:thin;scrollbar-color:var(--gold) transparent;touch-action:pan-y;opacity:0;visibility:hidden;display:flex;flex-direction:column;gap:12px}
#skyInfo .sk-sec{border-top:1px solid rgba(184,149,90,.22);padding-top:10px}
#skyInfo .sk-sec b{color:var(--gold2);font-weight:600}
#skyInfo p{margin:0}
#skyInfo .rd-pos{margin-bottom:2px}
#skyInfo .row{display:flex;gap:8px;flex-wrap:wrap}
#skyInfo .row .btn{display:inline-flex;align-items:center;gap:6px}
#skyInfo .hint{color:var(--muted);font-size:13.5px}
#skZod[aria-pressed=false]{opacity:.6}
#skyInfo .medal{display:flex;align-items:center;gap:12px}
#skyInfo .medal i{flex:none;position:relative;width:58px;height:58px;background:url(assets/medallion.webp) center/contain no-repeat;filter:drop-shadow(0 3px 6px rgba(0,0,0,.6))}
#skyInfo .medal i::after{content:"";position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#fff6dc;box-shadow:0 0 6px 3px rgba(255,226,170,.85),0 0 16px 6px rgba(242,212,138,.35)}
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
#skDome{display:inline-flex;align-items:center;justify-content:center;gap:8px}
#bgObs{position:fixed;inset:-4%;z-index:0;pointer-events:none;background:url(assets/obs.webp) center/cover no-repeat;opacity:0;visibility:hidden}
@media (max-aspect-ratio:1/1){#bgObs{background-image:url(assets/obs_m.webp)}}
#astro{position:fixed;inset:0;z-index:4;pointer-events:none;perspective:1300px;opacity:0;visibility:hidden}
#astro .ar{position:absolute;display:block;transform-style:preserve-3d;will-change:transform;filter:drop-shadow(0 4px 6px rgba(0,0,0,.55))}
#astro .ar svg,#astro .ar img{display:block;width:100%;height:100%}`;
let built=false,cv,cx,cache,cc,tip;
function build(){
  if(built)return;built=true;
  const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  const stage=$('#stage');
  $('#bgimg').insertAdjacentHTML('afterend','<div id="bgObs" aria-hidden="true"></div>');
  stage.insertAdjacentHTML('beforeend',`<canvas id="sky" aria-label="แผนที่ท้องฟ้าในวันเกิด" role="img"></canvas>
<section id="skyForm" class="glass" aria-label="ข้อมูลวันเกิด">
  <div class="sf-frame" aria-hidden="true"></div><div class="sf-medal" aria-hidden="true"></div>
  <p class="sf-kick" aria-hidden="true">NATAL SKY</p>
  <h3>ท้องฟ้าคืนที่คุณเกิด</h3>
  <div class="sf-rule" aria-hidden="true"></div>
  <p class="sub">ใส่วัน เวลา และเมืองที่เกิด เพื่อเปิดท้องฟ้าเหนือหัวคุณในวินาทีนั้น</p>
  <div class="sf-row"><label>วันเกิด<button type="button" class="sf-field" id="bDateBtn" aria-haspopup="dialog" aria-expanded="false"><span class="v ph">เลือกวันเกิด</span><svg class="i" aria-hidden="true"><use href="#i-calendar"/></svg></button><input type="hidden" id="bDate"></label>
  <label>เวลาเกิด<input type="time" id="bTime"></label></div>
  <label class="chk"><input type="checkbox" id="bNoTime">ไม่ทราบเวลาเกิด (ใช้ 21:00 แทน)</label>
  <label>เมืองที่เกิด (เลือกเมืองที่ใกล้ที่สุด)<select id="bCity">${CITIES.map((c,i)=>`<option value="${i}">${c[0]}</option>`).join('')}</select></label>
  <button class="btn primary" id="bGo" type="button">เปิดท้องฟ้า<span aria-hidden="true"></span></button>
  <p class="err" id="bErr" aria-live="polite"></p>
  <div class="sf-cal" id="bCal" role="dialog" aria-label="เลือกวันเกิด" hidden>
    <div class="cal-head"><button type="button" class="cal-nav" data-step="-1" aria-label="ก่อนหน้า">‹</button><button type="button" class="cal-title" aria-live="polite"></button><button type="button" class="cal-nav" data-step="1" aria-label="ถัดไป">›</button></div>
    <div class="cal-body"></div>
    <div class="cal-foot"><span class="cal-tip"></span><button type="button" class="cal-close">ปิด</button></div>
  </div>
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
  calInit();
  /* unknown time: show the 21:00 stand-in in the greyed field, and give back what was typed when unticked */
  const noTime=()=>{const on=$('#bNoTime').checked,t=$('#bTime');if(on&&!t.disabled){typedT=t.value;t.value='21:00'}else if(!on&&t.disabled)t.value=typedT;t.disabled=on};
  $('#bNoTime').addEventListener('change',noTime);noTime();
  $('#bGo').addEventListener('click',()=>{if(S.state==='stars'&&!S.busy&&V.mode==='form')go(openSky)});
  $('#skyForm').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.target.closest('#bCal,#bDateBtn')){e.preventDefault();$('#bGo').click()}});
  cv.addEventListener('pointerdown',onDown);cv.addEventListener('pointermove',onMove);cv.addEventListener('pointerup',onUp);cv.addEventListener('pointercancel',()=>{V.drag=null;V.dirty=true});
  cv.addEventListener('pointerleave',()=>{V.hover=null;tip.style.opacity=0;zodHover(null);V.dirty=true});
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
  V.wide=wide;
  if(wide){const iw=Math.min(390,W*.32);V.R=Math.max(120,Math.min(((W-iw-80)/2-115)/1.186,(H/2-28-71)/1.186));V.cx=(W-iw-16)/2;V.cy=H/2+18;
    Object.assign(inf.style,{top:'68px',right:'16px',bottom:'16px',left:'auto',width:iw+'px',height:'auto',borderRadius:'16px'})}
  else{V.R=Math.max(90,Math.min((W/2-64)/1.186,H*.26));const ro=(V.R+2)*RING_OUT/RING_IN;V.cx=W/2;V.cy=62+ro+18;
    Object.assign(inf.style,{top:(V.cy+ro+30)+'px',left:'8px',right:'8px',bottom:'8px',width:'auto',height:'auto',borderRadius:'16px'})}
  if(A.els)astroLayout();else{const g=astroGeo(V.R,wide);V.labN=g.labN??null;V.labE=g.labE??null}
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
function paintBody(x,{k,ts=1,png=false,blob,ok,alpha=1,P=null}){
  const at=s=>V.vis[s.i];
  if(P){paintZodiac(x,P,alpha);ZOD.forEach(z=>{z.qLive=z.a>.01||Z.show?zodPlace(z,P):null})}
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
function paintSky(x,{cx:X,cy:Y,R,alpha=1,png=false,ts=1,ticks=true,labN=null,labE=null}){
  const k=clamp(R/300,.75,1.7);
  x.save();x.globalAlpha=alpha;
  // the dome seen from below, flattened: zenith in the middle, horizon on the rim
  let g=x.createRadialGradient(X,Y,R*.1,X,Y,R*1.02);g.addColorStop(0,'#141a2c');g.addColorStop(.7,'#0d1020');g.addColorStop(1,'#07080f');
  x.fillStyle=g;x.beginPath();x.arc(X,Y,R,0,TAU);x.fill();
  x.save();x.beginPath();x.arc(X,Y,R,0,TAU);x.clip();
  x.strokeStyle='rgba(184,149,90,.16)';x.lineWidth=1;x.setLineDash([2,6]);
  [30,60].forEach(a=>{x.beginPath();x.arc(X,Y,R*Math.tan((90-a)*D2R/2),0,TAU);x.stroke()});x.setLineDash([]);   // altitude 30° / 60°
  paintBody(x,{k,ts,png,blob:R*.075,ok:()=>true,alpha,P:V.P});
  x.restore();
  // horizon ring + compass
  x.strokeStyle='rgba(184,149,90,.75)';x.lineWidth=1.5;x.beginPath();x.arc(X,Y,R,0,TAU);x.stroke();
  if(ticks){x.strokeStyle='rgba(184,149,90,.3)';x.lineWidth=1;x.beginPath();x.arc(X,Y,R+7*k,0,TAU);x.stroke();
  for(let i=0;i<72;i++){const a=i*5*D2R+V.spin,l=i%18===0?10:i%2?3:5;x.beginPath();x.moveTo(X-Math.sin(a)*(R+7*k),Y-Math.cos(a)*(R+7*k));x.lineTo(X-Math.sin(a)*(R+7*k+l*k),Y-Math.cos(a)*(R+7*k+l*k));x.stroke()}}
  x.font=`600 ${Math.round(Math.max(11.5,12.5*Math.min(k,1.3))*ts)}px 'Noto Serif Thai',serif`;x.fillStyle='#dcc28c';x.textAlign='center';x.textBaseline='middle';
  ZH.forEach((t,i)=>{const a=i*Math.PI/2+V.spin,d=i%2?(labE??R+30*k+60*(ts-1)):(labN??R+26*k+8*(ts-1));x.fillText(t,X-Math.sin(a)*d,Y-Math.cos(a)*d)});
  x.restore();
}

/* ---- the astrolabe: brass rings around the chart, real DOM elements turned in 3D (CSS perspective).
   a1  azimuth ring on the horizon, turns with the sky's compass
   a2  hour ring (wide screens): turns so the hour of birth sits under the index; it winds back
       through the seven hours the sky wheels through as it opens
   a3  outer frame (wide screens) carrying the index; it only tilts
   They tumble in from edge-on and lie flat as the sky locks to the moment of birth. ---- */
const ROMAN24=['XXIV','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII'];
let ringN=0;
function brassDefs(id){return`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d79c"/><stop offset=".28" stop-color="#a77f42"/><stop offset=".5" stop-color="#e2c27e"/><stop offset=".74" stop-color="#7a5a2c"/><stop offset="1" stop-color="#c9a461"/></linearGradient></defs>`}
const band=(a,b)=>`M${-b} 0a${b} ${b} 0 1 0 ${2*b} 0a${b} ${b} 0 1 0 ${-2*b} 0ZM${-a} 0a${a} ${a} 0 1 1 ${2*a} 0a${a} ${a} 0 1 1 ${-2*a} 0Z`;
/* one ring as an SVG string; rIn/rOut in px, drawn in a box of side 2·(rOut+pad) */
function ringSVG(kind,rIn,rOut){
  const id='br'+(ringN++),pad=kind==='outer'?rOut*.0+16:4,S=rOut+pad,w=rOut-rIn,mid=(rIn+rOut)/2;
  let o=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-S} ${-S} ${2*S} ${2*S}" width="${2*S}" height="${2*S}">${brassDefs(id)}`;
  o+=`<path d="${band(rIn,rOut)}" fill="url(#${id})" fill-rule="evenodd" stroke="#3b2a12" stroke-width="1"/>`;
  o+=`<circle r="${rOut-1.2}" fill="none" stroke="rgba(255,240,200,.45)" stroke-width=".7"/><circle r="${rIn+1.2}" fill="none" stroke="rgba(40,26,10,.55)" stroke-width=".7"/>`;
  const tick=(a,r0,r1,sw,col)=>{const s=Math.sin(a*D2R),c=Math.cos(a*D2R);return`<line x1="${(s*r0).toFixed(2)}" y1="${(-c*r0).toFixed(2)}" x2="${(s*r1).toFixed(2)}" y2="${(-c*r1).toFixed(2)}" stroke="${col}" stroke-width="${sw}"/>`};
  if(kind==='az'){
    for(let i=0;i<72;i++){const big=i%18===0,mid6=i%6===0;o+=tick(i*5,rIn+1.5,big?rOut-1.5:mid6?rIn+w*.7:rIn+w*.42,big?1.4:.8,'#2e200d')}
    for(let i=0;i<4;i++){const a=i*90*D2R,s=Math.sin(a),c=Math.cos(a),d=w*.32;o+=`<path d="M${s*(mid+d)} ${-c*(mid+d)}L${s*mid+c*d*.8} ${-c*mid+s*d*.8}L${s*(mid-d)} ${-c*(mid-d)}L${s*mid-c*d*.8} ${-c*mid-s*d*.8}Z" fill="#fff0c8" opacity=".85"/>`}
  }else if(kind==='hours'){
    for(let i=0;i<96;i++){const h=i%4===0;o+=tick(i*3.75,rOut-1.5,h?rOut-w*.36:rOut-w*.18,h?1.1:.6,'#2e200d')}
    const fs=Math.max(10,w*.5);
    for(let h=0;h<24;h++){if(h%3)continue;o+=`<text transform="rotate(${h*15}) translate(0 ${-(rIn+w*.38)})" font-family="Cinzel,serif" font-size="${fs.toFixed(1)}" fill="#2a1c0b" text-anchor="middle" dominant-baseline="middle">${ROMAN24[h]}</text>`}
  }else{ // outer frame with studs and the index
    for(let i=0;i<12;i++){const a=i*30*D2R;o+=`<circle cx="${(Math.sin(a)*mid).toFixed(2)}" cy="${(-Math.cos(a)*mid).toFixed(2)}" r="${(w*.28).toFixed(2)}" fill="#fff0c8" opacity=".7" stroke="#3b2a12" stroke-width=".6"/>`}
    o+=`<path d="M0 ${-rIn+14}L-7 ${-rOut-12}L7 ${-rOut-12}Z" fill="url(#${id})" stroke="#3b2a12" stroke-width="1"/><circle cy="${-rOut-12}" r="3.2" fill="#fff0c8" stroke="#3b2a12" stroke-width=".8"/>`;
  }
  return o+'</svg>';
}
const A={on:false,els:null,geo:null};
const RING_IN=.779,RING_OUT=.924;          // assets/ring.webp: inner and outer edge of the band, as fractions of half its size
function astroBuild(){
  if(A.els)return;
  $('#stage').insertAdjacentHTML('beforeend','<div id="astro" aria-hidden="true"><i class="ar" data-k="outer"></i><i class="ar" data-k="hours"></i><i class="ar" data-k="az"></i></div>');
  A.els={outer:$('#astro .ar[data-k=outer]'),hours:$('#astro .ar[data-k=hours]'),az:$('#astro .ar[data-k=az]')};
  addEventListener('pointermove',e=>{
    if(!A.on||e.pointerType!=='mouse'||RM()||V.view!=='chart')return;
    const px=e.clientX/innerWidth-.5,py=e.clientY/innerHeight-.5;
    A.q.forEach(([rx,ry],i)=>{const f=[1,.7,.45][i];rx(-py*14*f);ry(px*18*f)});
  });
  A.q=['outer','hours','az'].map(k=>[gsap.quickTo(A.els[k],'rotationX',{duration:1.2,ease:EO}),gsap.quickTo(A.els[k],'rotationY',{duration:1.2,ease:EO})]);
}
/* ring radii for the current chart size; also where the compass words go */
function astroGeo(R,wide){
  const k=clamp(R/300,.75,1.7);
  const g={az:[R+2,(R+2)*RING_OUT/RING_IN]};
  if(wide){g.hours=[g.az[1]+4,g.az[1]+4+Math.max(22,20*k)];g.outer=[g.hours[1]+6,g.hours[1]+11];g.labN=g.outer[1]+32*k;g.labE=g.outer[1]+44*k}
  else{g.labN=g.az[1]+11;g.labE=g.az[1]+25}
  return g;
}
function astroLayout(){
  if(!A.els)return;const wide=V.wide,g=A.geo=astroGeo(V.R,wide);
  for(const k of ['az','hours','outer']){const el=A.els[k];
    if(!g[k]){el.style.display='none';el.innerHTML='';continue}
    el.style.display='';let sz;
    if(k==='az'){sz=Math.round(2*g.az[0]/RING_IN);el.innerHTML='<img src="assets/ring.webp" alt="" draggable="false">'}
    else{el.innerHTML=ringSVG(k,g[k][0],g[k][1]);sz=el.firstChild.getAttribute('width')}
    gsap.set(el,{width:sz,height:sz,left:V.cx,top:V.cy,xPercent:-50,yPercent:-50})}
  V.labN=g.labN??null;V.labE=g.labE??null;
}
/* in-plane turn of the azimuth and hour rings, kept in step with the sky every frame */
function astroSync(){
  if(!A.on||!A.els)return;
  gsap.set(A.els.az,{rotation:-V.spin/D2R*1});
  if(A.geo&&A.geo.hours&&R0){const h=R0.b.h+R0.b.m/60+V.off;gsap.set(A.els.hours,{rotation:-h*15})}
}
function astroIn(delay=0){
  astroBuild();astroLayout();A.on=true;const els=['outer','hours','az'].map(k=>A.els[k]);
  gsap.set('#astro',{autoAlpha:1});
  if(RM()){gsap.fromTo(els,{autoAlpha:0},{autoAlpha:1,duration:.5,delay});return}
  // each ring tumbles in from edge-on, on its own axis, and settles flat as the sky locks
  const from=[{rotationX:78,rotationY:-30,scale:1.35},{rotationX:-64,rotationY:52,scale:1.2},{rotationX:20,rotationY:82,scale:1.1}];
  els.forEach((el,i)=>gsap.fromTo(el,{...from[i],autoAlpha:0,z:180},{rotationX:0,rotationY:0,scale:1,z:0,autoAlpha:1,duration:2.6+i*.25,ease:'expo.out',delay:delay+i*.12,overwrite:'auto'}));
}
function astroOut(mode='fade'){
  if(!A.els||!A.on)return;A.on=mode==='lift'?'lift':false;const els=['outer','hours','az'].map(k=>A.els[k]);
  if(RM()||mode==='fade'){gsap.to(els,{autoAlpha:0,duration:.35,overwrite:'auto',onComplete:()=>{if(!A.on)gsap.set('#astro',{autoAlpha:0})}});return}
  // into the dome: the rings swing up past the viewer
  els.forEach((el,i)=>gsap.to(el,{rotationX:-70-i*8,scale:1.9+i*.25,z:300,autoAlpha:0,duration:1+i*.12,ease:'power3.in',overwrite:'auto'}));
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
  paintBody(x,{k,blob:F*.042,ok,P:(ra,de)=>{const h=altAz(ra,de,(gmst(V.JD+V.off/24)+V.lon)%360,V.lat);return{alt:h.alt,...sc(dirOf(h.alt,h.az))}}});
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
    if(dome){projectDome();paintDome(cc)}else{project();paintSky(cc,{cx:V.cx,cy:V.cy,R:V.R*V.scale,ticks:!A.on,labN:V.labN&&V.labN*V.scale,labE:V.labE&&V.labE*V.scale})}
    V.dirty=false}
  astroSync();
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
  if(e.pointerType!=='mouse')zodHover(zodAt(p.x,p.y,i));          // touch: a tap shows the figure under the finger
  if(i==null){V.sel=null;V.dirty=true;if(V.view==='dome'&&!V.gyro){V.pan={x:p.x,y:p.y,yaw:V.cam.yaw,pitch:V.cam.pitch};cv.classList.add('pan')}return}
  V.drag={i,x:p.x,y:p.y,moved:false};V.ptr=p;
}
function onMove(e){
  if(V.mode!=='sky')return;const p=pt(e);V.ptr=p;if(PTS.has(e.pointerId))PTS.set(e.pointerId,p);
  if(V.pinch&&PTS.size>=2){const [a,b]=[...PTS.values()];V.cam.fov=clamp(V.pinch.fov*V.pinch.d/Math.max(20,Math.hypot(a.x-b.x,a.y-b.y)),25,110);V.dirty=true;return}
  if(V.pan){const dp=V.cam.fov/innerHeight*1.1;V.cam.yaw=V.pan.yaw-(p.x-V.pan.x)*dp;V.cam.pitch=clamp(V.pan.pitch+(p.y-V.pan.y)*dp,-6,89);V.dirty=true;tip.style.opacity=0;return}
  if(V.drag){if(Math.hypot(p.x-V.drag.x,p.y-V.drag.y)>8)V.drag.moved=true}
  const i=nearest(p.x,p.y,e.pointerType==='mouse'?18:28);
  if(e.pointerType==='mouse'){const z=zodAt(p.x,p.y,i);zodHover(z);if((i==null||V.vis[i].s.faint)&&z){tip.innerHTML=`ราศี${SIGNS[z.i][0]}<small>กลุ่มดาว${ZTH[z.i]}</small>`;tip.style.opacity=1;tip.style.left=z.qLive.x+'px';tip.style.top=(z.qLive.y-z.qLive.h*.4)+'px';V.hover=null;return}}
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
  astroOut('lift');
  t1.add(pOut('#skyInfo',{y:40}),0).to(V,{alpha:0,duration:rm?.2:.45,ease:EI,onUpdate:()=>{V.dirty=true}},rm?0:.25);
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
  V.view='chart';V.anim=false;V.dirty=true;astroIn(.05);
  const t2=gsap.timeline();t2.to(V,{alpha:1,duration:.5,ease:EO},0).add(pIn('#skyInfo',{y:40}),0);
  await tlDone(t2);
  V.mode='sky';syncTools();
}

function syncTools(){syncBar();const u=$('#skUndo'),c=$('#skClear'),n=V.lines.length;if(u)u.disabled=!n;if(c)c.disabled=!n;const h=$('#skHint');if(h)h.textContent=n?`กลุ่มดาวของคุณมี ${n} เส้น`:'ลากจากดาวดวงหนึ่งไปอีกดวง (หรือแตะทีละดวง) เพื่อสร้างกลุ่มดาวของคุณเอง'}

/* ---- the reading ---- */
/* ---- birth-date picker: a themed calendar in Thai months and Buddhist-era years (the field keeps ISO yyyy-mm-dd) ---- */
const TMON=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const TMS=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const TWD=['อา','จ','อ','พ','พฤ','ศ','ส'];
const CAL={view:'d',y:2000,m:0,y0:1990,open:false};
const Y_MIN=1900,iso=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
function calToday(){const t=new Date(Date.now()+7*3600e3);return{y:t.getUTCFullYear(),m:t.getUTCMonth(),d:t.getUTCDate()}}
function calSel(){const v=$('#bDate').value;if(!v)return null;const [y,m,d]=v.split('-').map(Number);return{y,m:m-1,d}}
function calShow(){
  const s=calSel(),el=$('#bDateBtn .v');
  el.textContent=s?`${s.d} ${TMON[s.m]} ${s.y+543}`:'เลือกวันเกิด';el.classList.toggle('ph',!s);
  $('#bDateBtn').setAttribute('aria-label',s?`วันเกิด ${el.textContent} (กดเพื่อเปลี่ยน)`:'เลือกวันเกิด');
}
function calRender(focusSel){
  const T=calToday(),S=calSel(),body=$('#bCal .cal-body'),title=$('#bCal .cal-title'),[prev,next]=document.querySelectorAll('#bCal .cal-nav');
  let h='';
  if(CAL.view==='d'){
    title.innerHTML=`${TMON[CAL.m]} ${CAL.y+543}<small>${CAL.y}</small>`;
    const first=new Date(Date.UTC(CAL.y,CAL.m,1)).getUTCDay(),n=new Date(Date.UTC(CAL.y,CAL.m+1,0)).getUTCDate();
    h=`<div class="cal-grid d" role="grid">${TWD.map(w=>`<span class="cal-wd" aria-hidden="true">${w}</span>`).join('')}`+'<span></span>'.repeat(first);
    for(let d=1;d<=n;d++){
      const fut=CAL.y>T.y||(CAL.y===T.y&&(CAL.m>T.m||(CAL.m===T.m&&d>T.d))),sel=S&&S.y===CAL.y&&S.m===CAL.m&&S.d===d,now=T.y===CAL.y&&T.m===CAL.m&&T.d===d;
      h+=`<button type="button" data-d="${d}" class="${now?'now ':''}${(first+d-1)%7===0?'sun':''}" aria-selected="${!!sel}" aria-label="${d} ${TMON[CAL.m]} ${CAL.y+543}"${fut?' disabled':''}>${d}</button>`;
    }
    h+='</div>';
    prev.disabled=CAL.y===Y_MIN&&CAL.m===0;next.disabled=CAL.y>T.y||(CAL.y===T.y&&CAL.m>=T.m);
    $('#bCal .cal-tip').textContent='แตะชื่อเดือนเพื่อเลือกเดือนและปี';
  }else if(CAL.view==='m'){
    title.innerHTML=`พ.ศ. ${CAL.y+543}<small>${CAL.y}</small>`;
    h=`<div class="cal-grid m">${TMS.map((t,i)=>`<button type="button" data-m="${i}" aria-selected="${!!(S&&S.y===CAL.y&&S.m===i)}" aria-label="${TMON[i]} ${CAL.y+543}"${CAL.y===T.y&&i>T.m?' disabled':''}>${t}</button>`).join('')}</div>`;
    prev.disabled=CAL.y<=Y_MIN;next.disabled=CAL.y>=T.y;
    $('#bCal .cal-tip').textContent='เลือกเดือน';
  }else{
    title.innerHTML=`${CAL.y0+543} – ${CAL.y0+543+19}`;
    h='<div class="cal-grid y">';
    for(let y=CAL.y0;y<CAL.y0+20;y++)h+=`<button type="button" data-y="${y}" aria-selected="${!!(S&&S.y===y)}" aria-label="พ.ศ. ${y+543}"${y>T.y||y<Y_MIN?' disabled':''}>${y+543}<small>${y}</small></button>`;
    h+='</div>';
    prev.disabled=CAL.y0<=Y_MIN;next.disabled=CAL.y0+20>T.y;
    $('#bCal .cal-tip').textContent='เลือกปีเกิด (พ.ศ.)';
  }
  body.innerHTML=h;
  calPlace();
  if(focusSel){const b=body.querySelector('[aria-selected=true]:not(:disabled)')||body.querySelector('.now:not(:disabled)')||body.querySelector('button:not(:disabled)');b&&b.focus({preventScroll:true})}
}
function calOpen(){
  if(CAL.open)return;CAL.open=true;const S=calSel(),T=calToday();
  if(S){CAL.view='d';CAL.y=S.y;CAL.m=S.m}else{CAL.view='y';CAL.y=T.y-25;CAL.m=0}
  CAL.y0=Math.max(Y_MIN,CAL.y-10);
  const f=$('#bDateBtn'),cal=$('#bCal'),fr=f.getBoundingClientRect(),pr=$('#skyForm').getBoundingClientRect();
  cal.hidden=false;f.setAttribute('aria-expanded','true');calRender(true);
  calPlace();
  gsap.fromTo(cal,{autoAlpha:0,y:-8,scale:.97,transformOrigin:'50% 0'},{autoAlpha:1,y:0,scale:1,duration:RM()?.01:.28,ease:EO});
}
/* below the field, lifted to stay on screen (it may then cover the field: the title says what is being picked) */
function calPlace(){
  if(!CAL.open)return;const cal=$('#bCal'),fr=$('#bDateBtn').getBoundingClientRect(),pr=$('#skyForm').getBoundingClientRect();
  const top=Math.max(8,Math.min(fr.bottom+8,innerHeight-cal.offsetHeight-10));cal.style.top=(top-pr.top)+'px';
}
function calClose(back){
  if(!CAL.open)return;CAL.open=false;const cal=$('#bCal');$('#bDateBtn').setAttribute('aria-expanded','false');
  gsap.to(cal,{autoAlpha:0,y:-6,duration:RM()?.01:.18,ease:'power2.in',onComplete:()=>{cal.hidden=true}});
  if(back)$('#bDateBtn').focus({preventScroll:true});
}
function calStep(k){
  const T=calToday();
  if(CAL.view==='d'){CAL.m+=k;if(CAL.m<0){CAL.m=11;CAL.y--}if(CAL.m>11){CAL.m=0;CAL.y++}}
  else if(CAL.view==='m')CAL.y=Math.min(T.y,Math.max(Y_MIN,CAL.y+k));
  else CAL.y0=Math.min(T.y-19,Math.max(Y_MIN,CAL.y0+20*k));
}
function calInit(){
  calShow();
  const cal=$('#bCal');
  $('#bDateBtn').addEventListener('click',()=>CAL.open?calClose():calOpen());
  cal.querySelector('.cal-close').addEventListener('click',()=>calClose(true));
  cal.querySelector('.cal-title').addEventListener('click',()=>{
    if(CAL.view==='d')CAL.view='m';else if(CAL.view==='m'){CAL.view='y';CAL.y0=Math.max(Y_MIN,Math.min(calToday().y-19,CAL.y-10))}else CAL.view='d';
    calRender(true);
  });
  cal.querySelectorAll('.cal-nav').forEach(b=>b.addEventListener('click',()=>{calStep(+b.dataset.step);calRender()}));
  cal.querySelector('.cal-body').addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||b.disabled)return;
    if(b.dataset.y){CAL.y=+b.dataset.y;CAL.view='m';calRender(true)}
    else if(b.dataset.m){CAL.m=+b.dataset.m;CAL.view='d';calRender(true)}
    else if(b.dataset.d){$('#bDate').value=iso(CAL.y,CAL.m,+b.dataset.d);$('#bErr').textContent='';calShow();calRender();setTimeout(()=>calClose(true),140)}
  });
  cal.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();calClose(true);return}
    const b=document.activeElement;if(!b||!b.closest('.cal-body'))return;
    const all=[...cal.querySelectorAll('.cal-body button')],i=all.indexOf(b),cols=CAL.view==='d'?7:CAL.view==='m'?3:4;
    const mv={ArrowLeft:-1,ArrowRight:1,ArrowUp:-cols,ArrowDown:cols}[e.key];if(mv==null)return;e.preventDefault();
    const j=i+mv;
    if(j>=0&&j<all.length&&!all[j].disabled){all[j].focus();return}
    if(CAL.view!=='d')return;                                     // days: walk across into the next or previous month
    const d=+b.dataset.d+(mv),t=new Date(Date.UTC(CAL.y,CAL.m,d)),T=calToday();
    if(t.getUTCFullYear()<Y_MIN||t>Date.UTC(T.y,T.m,T.d))return;
    CAL.y=t.getUTCFullYear();CAL.m=t.getUTCMonth();calRender();cal.querySelector(`.cal-body [data-d="${t.getUTCDate()}"]`)?.focus();
  });
  document.addEventListener('pointerdown',e=>{if(CAL.open&&!e.target.closest('#bCal,#bDateBtn'))calClose()},true);
}
function birthFrom(){
  const d=$('#bDate').value,noT=$('#bNoTime').checked,t=noT?'21:00':($('#bTime').value||''),ci=+$('#bCity').value||0;
  if(!d)return{err:'ใส่วันเกิดก่อน'};
  const [Y,M,D]=d.split('-').map(Number);if(!Y||Y<1900)return{err:'ปีเกิดต้องตั้งแต่ ค.ศ. 1900'};
  if(!t)return{err:'ใส่เวลาเกิด หรือเลือก "ไม่ทราบเวลาเกิด"'};
  const [h,m]=t.split(':').map(Number),ms=Date.UTC(Y,M-1,D,h-7,m);       // Thailand is UTC+7 all year
  if(ms>Date.now())return{err:'วันเกิดต้องไม่อยู่ในอนาคต'};
  try{localStorage.setItem('arcana-birth',JSON.stringify({d,t:noT?typedT:$('#bTime').value,u:noT,c:ci}))}catch(e){}
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
  return{sign,signIdx:SIGNS.indexOf(sign),mi,ph,when,b,best,bsAlt,above:V.sun.alt>0};
}
function infoHTML(r){
  const s=r.best.s;
  return `<div><div class="rd-pos">${esc(r.when)} · ${esc(r.b.city[0])}${r.b.noT?' · เวลาโดยประมาณ':''}</div>
    <div class="medal"><i aria-hidden="true"></i><div><h3>ดาวประจำตัว: ${esc(s.th)}</h3><p class="hint">${esc(s.n)}${CONS[s.c]?' · กลุ่มดาว'+CONS[s.c][0]:''}${r.bsAlt>0?` · สูงจากขอบฟ้า ${Math.round(r.bsAlt)}°`:' · ใต้ขอบฟ้าในขณะนั้น'}</p></div></div></div>
  <p class="rd-text">${STAR_MSG[s.n]}</p>
  <div class="sk-sec"><b>ราศี${r.sign[0]}</b> · ธาตุ${r.sign[1]}<p>${r.sign[2]}</p></div>
  <div class="sk-sec"><b>ดวงจันทร์วันเกิด</b> · ${r.mi.label} ${moonSVG(r.mi,14)}<p>${r.ph}</p></div>
  ${r.above?'<p class="hint">คุณเกิดตอนกลางวัน ดาวเหล่านี้อยู่บนฟ้าจริงแต่ถูกแสงอาทิตย์กลบไว้</p>':''}
  <div class="sk-sec"><p class="hint" id="skHint"></p>
    <input id="skyName" type="text" maxlength="30" autocomplete="off" placeholder="ตั้งชื่อกลุ่มดาวของคุณ" aria-label="ชื่อกลุ่มดาวของคุณ">
    <div class="row" style="margin-top:10px">
      <button class="btn small" id="skUndo" type="button"><svg class="i" aria-hidden="true"><use href="#i-undo"/></svg>ย้อนเส้น</button>
      <button class="btn small" id="skClear" type="button"><svg class="i" aria-hidden="true"><use href="#i-x"/></svg>ล้าง</button>
      <button class="btn small" id="skZod" type="button" aria-pressed="true"><svg class="i" aria-hidden="true"><use href="#i-flame"/></svg>รูปจักรราศี</button>
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
  $('#skZod').onclick=()=>{Z.show=!Z.show;$('#skZod').setAttribute('aria-pressed',Z.show);zodAll()};$('#skZod').setAttribute('aria-pressed',Z.show);
  loadZodiac();ZOD.forEach(z=>{z.a=0});Z.hover=null;
  $('#skDome').onclick=()=>{if(!S.busy)go(toDome)};
  const tl=gsap.timeline();V.mode='anim';V.anim=true;
  tl.add(pOut('#skyForm',{y:40}),0);Sound.whoosh();
  if(RM()){Object.assign(V,{off:0,scale:1,alpha:0,spin:0});tl.to(V,{alpha:1,duration:.5},.2).set(cv,{autoAlpha:1},.2).add(()=>astroIn(0),.2).add(()=>zodAll(),.3)}
  else{
    // the camera falls through space, then the sky of that night wheels into place
    Object.assign(V,{off:-7,scale:.18,alpha:0,spin:-1.2});
    tl.set(cv,{autoAlpha:1},.1).to(STAR,{warp:1,duration:.8,ease:EIO},0).to(STAR,{warp:0,duration:1.4,ease:EO},1)
      .to('#bgObs',{autoAlpha:.5,duration:1.4,ease:EO},0)
      .to(V,{alpha:1,duration:.9,ease:EO},.7).to(V,{scale:1,duration:2.6,ease:'expo.out'},.7)
      .to(V,{off:0,spin:0,duration:3.4,ease:'expo.out'},.7).add(()=>astroIn(0),.75).add(()=>zodAll(),3.2)
      .add(()=>{Sound.chime();buzz([15,40,25])},2.6).to(STAR,{boost:.8,duration:.3,ease:EO},2.6).to(STAR,{boost:0,duration:1.4,ease:EI},2.9);
  }
  tl.add(()=>{V.anim=false;V.dirty=true;V.mode='sky';cv.classList.add('draw')},RM()?.7:3.9)
    .add(pIn(inf,{x:innerWidth>=900?60:0,y:innerWidth>=900?0:60}),RM()?.6:2.9)
    .add(()=>{const p=inf.querySelector('.rd-text');p&&typeIn(p,.1)},RM()?.6:3.1);
  await tlDone(tl);
}
async function backToForm(){
  if(V.gyro)gyroOff();V.view='chart';V.mode='anim';astroOut();cv.classList.remove('draw');tip.style.opacity=0;
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
    const [bg,tl,tr,bl,br,ring,medal]=await Promise.all([loadArt('assets/obs_m.webp'),loadArt('assets/corner-tl.webp'),loadArt('assets/corner-tr.webp'),loadArt('assets/corner-bl.webp'),loadArt('assets/corner-br.webp'),loadArt('assets/ring.webp'),loadArt('assets/medallion.webp')]);
    const W=1080,H=1820,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),TH="'Noto Serif Thai',serif",r=R0,name=($('#skyName')?.value||'').trim();
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
    const PY=300+400,PR=328;Object.assign(V,{cx:W/2,cy:PY,R:PR,scale:1,spin:0,off:0});project();   // the chart, whatever the screen shows
    const za=ZOD.map(z=>z.a);ZOD.forEach(z=>{z.a=zodRest(z)*1.1});   // print the figures at rest, not mid-hover
    paintSky(x,{cx:W/2,cy:PY,R:PR,png:true,ts:1.4,ticks:false,labN:(PR+2)*RING_OUT/RING_IN+30,labE:(PR+2)*RING_OUT/RING_IN+52});
    ZOD.forEach((z,i)=>{z.a=za[i]});
    if(ring){const sz=2*(PR+2)/RING_IN;x.save();x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=14;x.shadowOffsetY=5;x.drawImage(ring,W/2-sz/2,PY-sz/2,sz,sz);x.restore()}
    Object.assign(V,keep);project();V.dirty=true;
    let y=PY+(PR+2)*RING_OUT/RING_IN+70;
    // the birth star set in the medallion
    const MD=210;if(medal){x.save();x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=16;x.shadowOffsetY=6;x.drawImage(medal,W/2-MD/2,y,MD,MD);x.restore()}
    {const cx0=W/2,cy0=y+MD/2;let g2=x.createRadialGradient(cx0,cy0,0,cx0,cy0,56);g2.addColorStop(0,'rgba(255,240,200,.95)');g2.addColorStop(.12,'rgba(255,226,170,.75)');g2.addColorStop(1,'rgba(242,212,138,0)');
      x.fillStyle=g2;x.beginPath();x.arc(cx0,cy0,56,0,TAU);x.fill();x.strokeStyle='rgba(255,240,200,.8)';x.lineWidth=1.4;x.beginPath();x.moveTo(cx0-34,cy0);x.lineTo(cx0+34,cy0);x.moveTo(cx0,cy0-34);x.lineTo(cx0,cy0+34);x.stroke()}
    y+=MD+44;
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
  tl.to('#bgimg',{autoAlpha:0,duration:1.2,ease:EO},0).fromTo('#bgObs',{autoAlpha:0,scale:1.08},{autoAlpha:.85,scale:1,duration:1.6,ease:EO},0).add(pIn('#skyForm',{y:50}),.1);
  if(!RM())tl.to(STAR,{boost:.5,duration:.4,ease:EO},0).to(STAR,{boost:0,duration:1.2,ease:EI},.4);
  await tlUntil(tl,.5);
  setTimeout(()=>{if(V.mode==='form'&&S.lastPtr==='mouse')$('#bDateBtn').focus({preventScroll:true})},400);
}
async function leave(){
  setState('gather');V.mode='anim';cv.classList.remove('draw');tip.style.opacity=0;
  const tl=gsap.timeline();
  if(V.gyro)gyroOff();astroOut();
  tl.add(pOut('#skyForm',{y:40}),0).add(pOut('#skyInfo',{y:40}),0).add(pOut('#skyBar',{y:30}),0)
    .to(V,{alpha:0,duration:RM()?.3:.7,ease:EI,onUpdate:()=>{V.dirty=true}},0).set(cv,{autoAlpha:0})
    .to('#bgObs',{autoAlpha:0,duration:.8,ease:EI},0).to('#bgimg',{autoAlpha:1,duration:1,ease:EO},.2);
  await tlDone(tl);V.mode='off';V.view='chart';stopTick();
}
function resize(){if(!built||V.mode==='off')return;layout()}
return{enter,leave,resize,V,_render:render,_zod:ZOD};   // _render: lets a test drive frames by hand
})();
