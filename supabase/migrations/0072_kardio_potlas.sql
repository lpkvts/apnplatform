-- APN-MED — A csoportleírásokban említett kardiovaszkuláris és véralvadási
-- szerek pótlása.
--
-- Tíz hatóanyag, amelyeket a csoportok rövid leírása megnevez, de eddig nem
-- voltak kidolgozva.
--
-- Előfeltétel: a 0065, 0066, 0067 és 0069 lefutott.

-- ── Metoprolol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'metoprolol', 'Metoprolol', 'Metoprolol', 'C07AB02', g.id,
  'A szív béta-receptorait blokkolja, akárcsak a bisoprolol. A nyújtott hatóanyagleadású forma alkalmas szívelégtelenség kezelésére; a rövid hatású forma nem.', '{"Magas vérnyomás","Angina","Ritmuszavar, frekvenciakontroll","Krónikus szívelégtelenség — csak a nyújtott formában","Szívinfarktus után"}', '{"Lassú szívverés, magasfokú ingervezetési zavar","Kezeletlen szívelégtelenség akut fellángolása","Súlyos asztma"}',
  '{"A rövid és a nyújtott hatóanyagleadású forma nem cserélhető fel: szívelégtelenségben csak a nyújtott igazolt, és a napi adagolás is eltér","Pulzus és vérnyomás mérése beadás előtt","A hirtelen elhagyás visszacsapó hatással jár — a leállítás fokozatos","Cukorbetegnél elfedheti a hypoglykaemia szapora szívverését"}', '{"Lassú szívverés","Fáradtság","Hideg végtagok","Alvászavar, élénk álmok"}', '{"Verapamil és diltiazem: súlyos szívlassulás lehet","Egyes antidepresszánsok: a metoprolol szintjét emelhetik","Inzulin és vércukorcsökkentők: elfedett hypoglykaemia"}',
  'Májon át bomlik le; a lebontás sebessége egyénenként jelentősen eltér, ami magyarázhatja a hatás különbségeit.', '{"Pulzus","Vérnyomás","Szívelégtelenség tünetei adagemelés után"}', 'Terhességben csak egyértelmű javallat esetén.',
  '{"A két gyógyszerforma összekeverése a leggyakoribb hiba: a rövid hatású forma szívelégtelenségben nem igazolt, és a napi adagolás sem azonos","A lebontás egyéni eltérése miatt egyes betegeknél a szokásos adag túl erős vagy túl gyenge — ez nem beteg-együttműködési kérdés"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'beta-blokkolok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Karvedilol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'karvedilol', 'Karvedilol', 'Carvedilol', 'C07AG02', g.id,
  'A béta-receptorok mellett az alfa-receptorokat is blokkolja, ezért az ereket is tágítja. Ez a kettős hatás magyarázza, hogy a vérnyomást erősebben csökkenti, mint a tisztán béta-blokkoló szerek.', '{"Krónikus szívelégtelenség — a túlélést javítja","Magas vérnyomás","Angina"}', '{"Lassú szívverés","Kezeletlen szívelégtelenség akut fellángolása","Súlyos asztma","Súlyos májelégtelenség"}',
  '{"Az értágító hatás miatt az első adagok után vérnyomásesés és szédülés gyakoribb, mint más béta-blokkolóknál — fekve adás és utána mérés","Étkezés közben bevéve lassabban szívódik fel, ami csökkenti a vérnyomásesést","Naponta kétszer adandó","Szívelégtelenségben lassú adagemelés, az állapot átmeneti rosszabbodásával"}', '{"Szédülés, vérnyomásesés","Fáradtság","Lassú szívverés","Vércukorszint-emelkedés"}', '{"Verapamil és diltiazem: súlyos szívlassulás","Inzulin: elfedett hypoglykaemia","Ciklosporin: a szintje emelkedhet"}',
  'Májon át bomlik le; súlyos májelégtelenségben ellenjavallt.', '{"Pulzus és vérnyomás, fekve és állva","Testsúly szívelégtelenségben"}', 'Terhességben csak egyértelmű javallat esetén.',
  '{"Az étkezés közbeni bevétel nem mellékes: éhgyomorra a gyorsabb felszívódás erősebb vérnyomásesést okoz","Az első adagok utáni szédülés miatt a beteg gyakran abbahagyja — az előzetes tájékoztatás sokat segít"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'beta-blokkolok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Perindopril ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'perindopril', 'Perindopril', 'Perindopril', 'C09AA04', g.id,
  'ACE-gátló: az érszűkítő hormon képződését gátolja. A ramiprilhez képest hosszabb hatástartamú, ezért naponta egyszer adható.', '{"Magas vérnyomás","Stabil koszorúér-betegség","Szívelégtelenség","Stroke másodlagos megelőzése"}', '{"Korábbi angioödéma ACE-gátló kapcsán","Terhesség","Kétoldali veseartéria-szűkület","Magas káliumszint"}',
  '{"Reggel, étkezés előtt veendő be: étkezés közben a felszívódás romlik","Kálium és kreatinin ellenőrzése a kezelés kezdetén és adagemelés után","Száraz köhögés jelzésének kérése","Arcduzzanat esetén azonnali jelzés: angioödéma lehet"}', '{"Száraz köhögés","Vérnyomásesés","Magas káliumszint","Vesefunkció-romlás a kezelés kezdetén","Angioödéma"}', '{"Kálium-megtakarító vízhajtók: magas kálium kockázata","Nem szteroid gyulladáscsökkentők: rontják a vesefunkciót","Lítium: a szintje emelkedhet"}',
  'Veseelégtelenségben adagmódosítás szükséges.', '{"Kálium és kreatinin","Vérnyomás"}', 'Terhességben ellenjavallt: magzati károsodást okoz.',
  '{"Az étkezés előtti bevétel követelménye eltér a ramipriltől — a betegek gyakran egyformán kezelik a két szert","Az angioödéma évekkel a kezelés kezdete után is jelentkezhet"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'ace-gatlok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Valzartán ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'valzartan', 'Valzartán', 'Valsartan', 'C09CA03', g.id,
  'Szartán: nem a hormon képződését gátolja, hanem a hatását blokkolja a receptoron. Ezért nem okoz száraz köhögést — az ugyanis a hormon lebontásának gátlásából ered, ami itt elmarad.', '{"Magas vérnyomás","Szívelégtelenség","Szívinfarktus után","ACE-gátló okozta köhögés esetén alternatíva"}', '{"Terhesség","Kétoldali veseartéria-szűkület","Magas káliumszint","Együttadás ACE-gátlóval"}',
  '{"ACE-gátlóval együtt nem adható: a kettős gátlás nem javítja a kimenetelt, viszont növeli a vesekárosodás és a magas kálium kockázatát","Kálium és kreatinin ellenőrzése ugyanúgy, mint ACE-gátlónál","Köhögést nem okoz — ez a váltás fő oka","Angioödémát ritkábban okoz, de nem kizárt"}', '{"Vérnyomásesés, szédülés","Magas káliumszint","Vesefunkció-romlás","Angioödéma — ritkábban, mint ACE-gátlónál"}', '{"ACE-gátlók: együttadásuk kerülendő","Kálium-megtakarító vízhajtók: magas kálium kockázata","Nem szteroid gyulladáscsökkentők: rontják a vesefunkciót"}',
  'Veseelégtelenségben adagmódosítás szükséges.', '{"Kálium és kreatinin","Vérnyomás"}', 'Terhességben ellenjavallt: magzati károsodást okoz.',
  '{"Az ACE-gátlóval való együttadás régebben elterjedt volt, ma viszont kerülendő: a vizsgálatok szerint nem javítja a kimenetelt, csak a kockázatot növeli","A köhögés hiánya nem jelenti, hogy a többi mellékhatás is elmarad: a kálium és a vesefunkció ugyanúgy követendő"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'ace-gatlok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Warfarin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'warfarin', 'Warfarin', 'Warfarin', 'B01AA03', g.id,
  'K-vitamin-antagonista, akárcsak az acenokumarol, de hosszabb hatástartamú. Emiatt a beállítás lassabb, viszont a hatás egyenletesebb.', '{"Pitvarfibrilláció — stroke megelőzése","Mélyvénás trombózis és tüdőembólia","Műbillentyű"}', '{"Aktív vérzés","Terhesség","Súlyos májelégtelenség"}',
  '{"A hazai gyakorlatban ritkábban használt, mint az acenokumarol — a kettő nem cserélhető fel azonos adagban, mert a hatástartam eltér","Az INR mérése és a beállított adag pontos dokumentálása","A K-vitamin-tartalmú ételek egyenletes fogyasztása","Vérzésjelek célzott keresése"}', '{"Vérzés","Bőrelhalás a kezelés kezdetén, ritkán","Hajhullás"}', '{"Antibiotikumok: az INR jelentősen emelkedhet","Gombaellenes szerek: erős INR-emelkedés","Nem szteroid gyulladáscsökkentők: fokozott vérzési kockázat","Amiodaron: tartós INR-emelkedés"}',
  'Májon át bomlik le; májbetegségben a hatás kiszámíthatatlan.', '{"INR","Vérkép","Vérzésjelek"}', 'Terhességben ellenjavallt: magzati károsodást okoz.',
  '{"Az acenokumarollal nem cserélhető fel azonos adagban: a warfarin hosszabb hatású, és az átállítás orvosi döntés","A hatás napokkal késik, ezért a beállítás kezdetén heparinos áthidalás lehet szükséges"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'k-vitamin-antagonistak'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Dabigatrán ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'dabigatran', 'Dabigatrán', 'Dabigatran', 'B01AE07', g.id,
  'Közvetlenül a trombint gátolja — eltérően a többi közvetlen hatású szertől, amelyek a Xa-faktort. Van hozzá célzott visszafordító szer, ami sürgős vérzésnél előnyt jelent.', '{"Pitvarfibrilláció — stroke megelőzése","Mélyvénás trombózis és tüdőembólia","Trombózis megelőzése ízületi műtét után"}', '{"Aktív vérzés","Súlyos veseelégtelenség","Műbillentyű","Terhesség"}',
  '{"A vesefunkciótól erősen függ: a csoport tagjai közül ez ürül a legnagyobb részben a vesén át, ezért romló vesefunkciónál gyakran szerváltás kell","A kapszulát nem szabad felnyitni: a hatóanyag felszívódása többszörösére nőne","Emésztőrendszeri panaszt gyakrabban okoz, mint a többi szer — ez az elhagyás gyakori oka","Naponta kétszer adandó"}', '{"Vérzés","Emésztőrendszeri panasz, gyomorégés","Vérszegénység"}', '{"Erős P-glikoprotein-gátlók: a szintje jelentősen emelkedik","Rifampicin: a hatás csökken","Vérlemezke-gátlók: a vérzési kockázat összeadódik"}',
  'Nagyrészt a vesén át ürül; közepes veseelégtelenségben adagmódosítás, súlyosban ellenjavallat.', '{"Vesefunkció évente, romló állapotban gyakrabban","Vérkép"}', 'Terhességben nem javasolt.',
  '{"A kapszula felnyitása a felszívódást többszörösére növeli — ez súlyos vérzést okozhat, és a nyelési nehézséggel küzdő betegnél valós kockázat","A vesefunkciótól való erős függés miatt idős betegnél gyakrabban kell ellenőrizni, mint a többi szernél"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'doac'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Edoxabán ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'edoxaban', 'Edoxabán', 'Edoxaban', 'B01AF03', g.id,
  'Xa-faktor gátló, naponta egyszeri adagolással. A vesefunkció szerinti viselkedése a rivaroxaban és az apixaban közé esik.', '{"Pitvarfibrilláció — stroke megelőzése","Mélyvénás trombózis és tüdőembólia"}', '{"Aktív vérzés","Súlyos veseelégtelenség","Műbillentyű","Terhesség"}',
  '{"Naponta egyszer adandó, ami könnyíti a beteg dolgát","Jó vesefunkció mellett a hatékonyság csökkenhet — ez ellentmondásosnak tűnik, de a gyorsabb ürülés magyarázza; az alkalmazási előírás erre külön kitér","Vesefunkció évenkénti ellenőrzése","Vérzésjelek keresése"}', '{"Vérzés","Vérszegénység","Bőrkiütés"}', '{"Erős P-glikoprotein-gátlók: a szintje emelkedik","Rifampicin: a hatás csökken","Vérlemezke-gátlók: a vérzési kockázat összeadódik"}',
  'Vesén át részben ürül; a nagyon jó és a rossz vesefunkció egyaránt befolyásolja a hatást.', '{"Vesefunkció évente","Vérkép","Testsúly"}', 'Terhességben nem javasolt.',
  '{"A jó vesefunkció melletti csökkent hatékonyság ellentmondásos, és könnyen elkerüli a figyelmet — pitvarfibrillációban ez a szerválasztás egyik szempontja"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'doac'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Nadroparin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'nadroparin', 'Nadroparin', 'Nadroparin', 'B01AB06', g.id,
  'Kis molekulatömegű heparin, az enoxaparinhoz hasonló hatásmóddal. Az adagolás egysége eltér, ezért a két szer adagja nem hasonlítható össze közvetlenül.', '{"Vénás trombózis megelőzése és kezelése","Áthidaló kezelés","Hemodialízis alvadásgátlása"}', '{"Aktív vérzés","Korábbi heparin okozta vérlemezkeszám-csökkenés"}',
  '{"Az adagolás nemzetközi egységben történik, nem milligrammban — az enoxaparinnal való összekeverés súlyos hiba","A megelőző és a kezelési adag megkülönböztetése a dokumentációban","A beadás a hasfal bőr alatti szövetébe, a helyet váltogatva","Vérlemezkeszám ellenőrzése hosszabb kezelésnél"}', '{"Vérzés, véraláfutás a beadás helyén","Heparin okozta vérlemezkeszám-csökkenés","Magas káliumszint"}', '{"Vérlemezke-gátlók és gyulladáscsökkentők: fokozott vérzési kockázat"}',
  'Vesén át ürül; veseelégtelenségben halmozódik.', '{"Vérlemezkeszám","Vesefunkció","Vérzésjelek"}', 'Terhességben a heparinok a választandó alvadásgátlók.',
  '{"Az egységben megadott adag és az enoxaparin milligrammos adagja nem váltható át fejben — a két szer felcserélése súlyos hiba","Testsúly szerinti adagolásnál a pontos testsúly ismerete elengedhetetlen"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'heparinok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Nem frakcionált heparin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'heparin-nem-frakcionalt', 'Nem frakcionált heparin', 'Unfractionated heparin', 'B01AB01', g.id,
  'Az eredeti heparin, változó molekulaméretű keverék. Hatása kiszámíthatatlanabb, mint a kis molekulatömegű változatoké, ezért laboratóriumi követést igényel — cserébe rövid hatású és jól visszafordítható.', '{"Súlyos vagy instabil beteg alvadásgátlása","Súlyos veseelégtelenség, ahol a kis molekulatömegű heparin halmozódna","Szívsebészeti és érsebészeti beavatkozás","Akut koszorúér-szindróma"}', '{"Aktív vérzés","Korábbi heparin okozta vérlemezkeszám-csökkenés"}',
  '{"Folyamatos infúzióban adva az aPTI rendszeres mérése és az adag ennek megfelelő módosítása a kezelés része","A vérminta nem az infúzióval azonos végtagból veendő — ez hamis eredményt ad","Rövid hatástartam: az infúzió leállítása után a hatás órák alatt megszűnik, ami sürgős beavatkozásnál előny","Vérlemezkeszám ellenőrzése: a heparin okozta csökkenés itt gyakoribb, mint a kis molekulatömegű változatoknál","Van célzott visszafordító szere, ami vérzésnél előny"}', '{"Vérzés","Heparin okozta vérlemezkeszám-csökkenés — gyakoribb","Csontritkulás hosszú kezelésnél","Magas káliumszint"}', '{"Vérlemezke-gátlók és gyulladáscsökkentők: fokozott vérzési kockázat","Nitroglicerin infúzió: csökkentheti a heparin hatását"}',
  'Nem a vesén át ürül, ezért súlyos veseelégtelenségben ez a biztonságosabb választás a kis molekulatömegű heparinokkal szemben.', '{"aPTI a beállítás szerint","Vérlemezkeszám","Vérzésjelek"}', 'Terhességben használható; nem jut át a méhlepényen.',
  '{"A vérvétel helye számít: az infúzióval azonos végtagból vett minta hamisan magas értéket ad, és az adag téves csökkentéséhez vezet","A hatás kiszámíthatatlansága miatt a mérés nem elhagyható — ez a fő különbség a kis molekulatömegű heparinokhoz képest"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'heparinok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Tikagrelor ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'tikagrelor', 'Tikagrelor', 'Ticagrelor', 'B01AC24', g.id,
  'A vérlemezkék receptorát gátolja, akárcsak a klopidogrél — de közvetlenül, nem előanyagként, és a kötődés visszafordítható. Ezért gyorsabban hat, és a leállítás után hamarabb áll helyre a működés.', '{"Akut koszorúér-szindróma, kettős kezelés részeként","Szívinfarktus után"}', '{"Aktív vérzés","Korábbi koponyaűri vérzés","Súlyos májelégtelenség"}',
  '{"Naponta kétszer adandó — ez eltér a klopidogréltől, és a kihagyás gyakoribb","Nehézlégzés gyakori mellékhatás, ami nem szívelégtelenségből ered: a beteg gyakran megijed tőle, és emiatt hagyja abba","A hatás gyorsabban beáll és hamarabb megszűnik, mint a klopidogrélé — ez a beavatkozás előtti szüneteltetésnél számít","Vérzésjelek keresése"}', '{"Vérzés","Nehézlégzés — jellegzetes, nem szívelégtelenségből ered","Lassú szívverés","Húgysavszint-emelkedés"}', '{"Erős enzimgátlók: a szintje jelentősen emelkedik","Nagy adagú acetilszalicilsav: csökkenti a hatékonyságát","Digoxin: a szintje emelkedhet"}',
  'Májon át bomlik le; súlyos májelégtelenségben ellenjavallt.', '{"Vérkép","Vérzésjelek","Húgysav"}', 'Terhességben nem javasolt.',
  '{"A nehézlégzés a szer ismert mellékhatása, mégis gyakran szívelégtelenségnek tulajdonítják — a felesleges kivizsgálás elkerülhető, ha erre gondolunk","Nagy adagú acetilszalicilsavval együtt a hatékonysága csökken: a kettős kezelésben csak kis adagú acetilszalicilsav javasolt"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'vérlemezke-gatlok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A teljes gyógyszertár alcsoportonként.
select p.name as focsoport, g.name as alcsoport, count(s.id) as hatoanyag
from public.drug_groups g
left join public.drug_substances s on s.group_id = g.id and s.publish_status = 'published'
join public.drug_groups p on p.id = g.parent_id
where g.publish_status = 'published'
group by p.name, p.ord, g.name, g.ord
order by p.ord, g.ord;
