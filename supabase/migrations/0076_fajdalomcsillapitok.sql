-- APN-MED — Fájdalomcsillapítók.
--
-- Négy alcsoport, hat hatóanyag. A válogatásnál a hazai gyakorlat számított: a
-- metamizol nálunk alapszer, több országban viszont betiltották az agranulocitózis
-- kockázata miatt — ezt a magyar ápolónak tudnia kell, mert külföldi irányelvben
-- nem is szerepel.
--
-- A csoport másik súlypontja a CYP2D6-függés. A tramadol hatása egyénenként
-- gyökeresen eltér: az ultragyors lebontóknál életveszélyes légzésdepressziót
-- okozhat szokásos adagban is, a lassú lebontóknál viszont alig hat. A beteg vagy
-- nem kap fájdalomcsillapítást, vagy veszélybe kerül.
--
-- Adagolás itt sem szerepel: az az alkalmazási előírás dolga.
--
-- Előfeltétel: a 0065 és 0066 lefutott.

-- ══ Alcsoportok ══════════════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'nem-opioid', 'Nem opioid fájdalomcsillapítók', 'N02B', p.id, 'Paracetamol, metamizol',
  'A fájdalomcsillapítás kiindulópontja. Enyhe és közepes fájdalomban gyakran elegendők, és erősebb szer mellé adva csökkentik a szükséges opioidmennyiséget.', 'A név megkülönbözteti őket az opioidoktól: nem az agy opioid-receptorain hatnak, hanem másutt — a paracetamol elsősorban a központi idegrendszerben, a metamizol pedig több ponton egyszerre. Nem okoznak függőséget, és a légzést sem nyomják el.',
  '{"A paracetamol napi összmennyisége korlátos, és a kombinált készítményekben is benne van — a rejtett adag a leggyakoribb túladagolási ok.","A metamizol Magyarországon alapszer, több országban viszont betiltották az agranulocitózis kockázata miatt. Külföldi irányelvben ezért nem szerepel.","Idős betegnél a paracetamol napi mennyisége alacsonyabb, és ötven kilogramm alatti testsúlynál tovább csökken."}', '{"A kombinált készítményekben rejtett paracetamol számbavétele","A fájdalom rendszeres mérése és dokumentálása","Metamizol mellett a láz és a torokfájás jelzésének kérése — a fehérvérsejtszám csökkenésének első jele lehet"}', 1, 'published'
from public.drug_groups p where p.slug = 'fajdalomcsillapitok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'nsaid', 'Nem szteroid gyulladáscsökkentők', 'M01A', p.id, 'Ibuprofén, diklofenák, naproxén',
  'Gyulladásos eredetű fájdalomban hatékonyak, de a mellékhatásaik miatt idős betegnél és társbetegségek mellett óvatosan.', 'A név arra utal, hogy gyulladást csökkentenek, de nem szteroidok. Azt az enzimet gátolják, amely a gyulladásos és fájdalomközvetítő anyagokat készíti. Ugyanez az enzim védi a gyomornyálkahártyát és tartja fenn a vese átáramlását — ebből következik a mellékhatásprofiljuk.',
  '{"Három szervrendszert veszélyeztetnek egyszerre: gyomorvérzés, vesekárosodás és szívelégtelenség-romlás.","Az idős beteg, a vesebeteg és a szívelégtelen a legveszélyeztetettebb — náluk a lehető legrövidebb ideig, legkisebb adagban.","Alvadásgátló mellett a vérzési kockázat többszörös.","A helyi készítmény ugyanazt a hatóanyagot tartalmazza, de a rendszerhatás jóval kisebb — ízületi fájdalomban ez gyakran elegendő."}', '{"A vesefunkció ismerete a kezelés előtt","Gyomorvédelem szükségességének felvetése kockázatos betegnél","Vérzésjelek keresése: melaena, vérhányás, ismeretlen eredetű vérszegénység","A kezelés hosszának követése — a tartós szedés gyakran észrevétlenül alakul ki"}', 2, 'published'
from public.drug_groups p where p.slug = 'fajdalomcsillapitok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'gyenge-opioidok', 'Gyenge opioidok', 'N02AJ', p.id, 'Tramadol, kodein',
  'A fájdalomcsillapítási lépcső középső foka. A hatásuk a legkiszámíthatatlanabb az egész csoportban.', 'A „gyenge" jelző a hagyományos fájdalomcsillapítási lépcsőből ered, ahol a második fokot jelentik. A megnevezés félrevezető lehet: ezek a szerek előanyagok, amelyeket a szervezetnek kell hatóanyaggá alakítania — és ez a lépés egyénenként gyökeresen eltér.',
  '{"Mindkettő a CYP2D6 enzimen keresztül alakul hatóanyaggá. Az ultragyors lebontóknál szokásos adagban is életveszélyes légzésdepresszió léphet fel, a lassú lebontóknál viszont alig hatnak.","Ha a beteg nem kap enyhülést, az nem feltétlenül beteg-együttműködési kérdés: lehet, hogy a szer nála nem alakul hatóanyaggá.","A tramadol görcsküszöböt csökkent, és szerotoninerg szerekkel együtt szerotonin-szindrómát okozhat."}', '{"A hatástalanság jelzése: nem biztos, hogy több kell — lehet, hogy más kell","Szokatlan aluszékonyság, lassú légzés azonnali jelzése","A gyógyszerlista átnézése szerotoninerg szerekre","Idős betegnél a zavartság és az esésveszély figyelése"}', 3, 'published'
from public.drug_groups p where p.slug = 'fajdalomcsillapitok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'eros-opioidok', 'Erős opioidok', 'N02A', p.id, 'Morfin, oxikodon, fentanil',
  'Súlyos fájdalomban, daganatos betegségben és a palliatív ellátásban alapszerek.', 'Közvetlenül az opioid-receptorokon hatnak, előzetes átalakítás nélkül — ezért a hatásuk kiszámíthatóbb, mint a gyenge opioidoké. A „kábítószer" megnevezés a jogi besorolásra utal, nem a klinikai szerepre: súlyos fájdalomban ezek a leghatékonyabb szerek.',
  '{"A légzésdepresszió a legsúlyosabb kockázat, és megelőzhető: a fokozatos adagemelés és a megfigyelés adja a biztonságot.","A székrekedés szinte minden betegnél kialakul, és nem múlik el a kezelés alatt — ezért a hashajtást a kezelés kezdetétől adni kell.","Van célzott ellenszer, ami a hatást percek alatt felfüggeszti.","A fájdalomcsillapításra adott opioid nem okoz függőséget, ha a fájdalom valós — ez a tévhit gyakran vezet alulkezeléshez."}', '{"Légzésszám és tudatállapot rendszeres ellenőrzése, különösen az első napokban","Hashajtó a kezelés kezdetétől, nem csak akkor, ha már baj van","A fájdalom mérése és a hatás dokumentálása","Az ellenszer elérhetőségének ismerete"}', 4, 'published'
from public.drug_groups p where p.slug = 'fajdalomcsillapitok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

-- ══ Hatóanyagok ══════════════════════════════════════════
-- ── Paracetamol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'paracetamol', 'Paracetamol', 'Paracetamol', 'N02BE01', g.id,
  'A pontos hatásmód máig nem teljesen tisztázott. Elsősorban a központi idegrendszerben csökkenti a fájdalomérzetet és a lázat, a gyulladást viszont alig befolyásolja — ezért nem gyulladáscsökkentő.', '{"Enyhe és közepes fájdalom","Láz csillapítása","Erősebb szer kiegészítése — csökkenti a szükséges opioidmennyiséget"}', '{"Súlyos májelégtelenség","Paracetamol-allergia"}',
  '{"A napi összmennyiség korlátos, és a kombinált készítményekben is benne van: hidegrázás elleni porok, kombinált fájdalomcsillapítók, egyes köhögés elleni szerek mind tartalmazhatják — a rejtett adag a leggyakoribb túladagolási ok","Idős betegnél a napi mennyiség alacsonyabb; ötven kilogramm alatti testsúlynál tovább csökken","Alkoholfogyasztás, alultápláltság és májbetegség együtt jelentősen csökkenti a biztonságos mennyiséget","A hatás nem azonnali: szájon át bevéve harminc-negyvenöt perc, és ez nem jelenti, hogy nem hat"}', '{"Terápiás adagban jól tolerálható","Túladagolásban májkárosodás — a tünetek napokkal később jelentkeznek","Ritkán bőrkiütés"}', '{"Kumarin típusú véralvadásgátló: tartós szedés mellett az INR emelkedhet","Enzimserkentő szerek: növelik a májkárosodás kockázatát"}',
  'Májon át bomlik le. Májbetegségben, alkoholfogyasztás mellett és alultápláltságban a biztonságos mennyiség jelentősen alacsonyabb. Veseelégtelenségben az adagolási időköz nyújtása lehet szükséges.', '{"Májenzimek tartós szedésnél","A napi összmennyiség számbavétele"}', 'Terhességben a legbiztonságosabb fájdalomcsillapítónak tartják; a döntés az alkalmazási előírás alapján.',
  '{"A túladagolás alattomos: az első órákban a beteg tünetmentes lehet, a májkárosodás pedig csak napokkal később jelentkezik — ezért a gyanú önmagában sürgős értékelést indokol","A kombinált készítményekben rejtett paracetamol miatt a beteg észrevétlenül túllépheti a napi mennyiséget; a teljes gyógyszerlista átnézése ezért nem kihagyható","Az „elég erős-e\" kérdés helyett gyakran a rendszeres adagolás hiányzik: az igény szerinti bevétel gyengébb hatást ad, mint a beosztott"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'nem-opioid'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Metamizol (dipiron) ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'metamizol', 'Metamizol (dipiron)', 'Metamizole', 'N02BB02', g.id,
  'Több ponton hat egyszerre: központi idegrendszeri fájdalomcsillapítás, lázcsillapítás és görcsoldás. Ez utóbbi teszi különösen alkalmassá görcsös eredetű fájdalomban — vesekő, epekő, bélgörcs.', '{"Közepes és erős fájdalom","Görcsös eredetű fájdalom: vesekő, epegörcs","Magas láz, ha más szer nem elegendő","Műtét utáni fájdalom, kiegészítő szerként"}', '{"Korábbi agranulocitózis bármely pirazolon-származékra","Csontvelő-károsodás","Glükóz-6-foszfát-dehidrogenáz hiány","Terhesség utolsó harmada"}',
  '{"A láz, a torokfájás és a szájnyálkahártya-fekély a fehérvérsejtszám csökkenésének első jele lehet — a betegnek ezt tudnia kell, és azonnal jeleznie","A vénás beadás gyorsan adva vérnyomásesést okozhat: lassan, lehetőleg infúzióban","Magyarországon széles körben használt szer; több országban viszont betiltották, ezért külföldi irányelvben nem szerepel","A hatás görcsös fájdalomban gyakran jobb, mint a nem szteroid szereké"}', '{"Agranulocitózis — ritka, de életveszélyes","Vérnyomásesés gyors vénás beadásnál","Allergiás reakció, ritkán anafilaxia","Vörös vizelet — ártalmatlan elszíneződés a bomlástermékektől"}', '{"Ciklosporin: a szintje csökkenhet","Csontvelő-károsító szerek: az agranulocitózis kockázata összeadódik","Acetilszalicilsav: csökkentheti a vérlemezke-gátló hatását"}',
  'Máj- és veseelégtelenségben óvatosan; tartós szedés kerülendő.', '{"Vérkép hosszabb kezelésnél","Láz és torokfájás célzott kérdezése","Vérnyomás vénás beadás alatt"}', 'A terhesség utolsó harmadában ellenjavallt. Egyébként a döntés az alkalmazási előírás alapján.',
  '{"A vörös vizelet megijeszti a beteget, pedig ártalmatlan — az előzetes tájékoztatás megelőzi a fölösleges riadalmat","Az agranulocitózis ritka, de a felismerése a betegen múlik: ha nem tudja, mire figyeljen, csak akkor derül ki, amikor már súlyos fertőzése van","A gyors vénás beadás okozta vérnyomásesést gyakran allergiának minősítik, pedig a beadás lassítása megelőzi"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'nem-opioid'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Ibuprofén ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'ibuprofen', 'Ibuprofén', 'Ibuprofen', 'M01AE01', g.id,
  'Gátolja azt az enzimet, amely a gyulladásos és fájdalomközvetítő anyagokat készíti. Ugyanez az enzim védi a gyomornyálkahártyát és tartja fenn a vese átáramlását — innen erednek a mellékhatásai.', '{"Gyulladásos eredetű fájdalom","Mozgásszervi fájdalom","Menstruációs görcs","Láz csillapítása"}', '{"Aktív gyomor-bél vérzés vagy fekély","Súlyos szívelégtelenség","Súlyos veseelégtelenség","Terhesség utolsó harmada","Aszpirin okozta asztma"}',
  '{"A vesefunkció ismerete a kezelés előtt: kiszáradt, idős vagy vízhajtót szedő betegnél a vesekárosodás gyorsan kialakulhat","Étkezés közben bevéve kevesebb gyomorpanaszt okoz, de a vérzési kockázatot ez nem szünteti meg — a gyomorvédelem külön kérdés","Alvadásgátló mellett a vérzési kockázat többszörös: a kombináció felülvizsgálata","A helyi készítmény ugyanazt a hatóanyagot tartalmazza, jóval kisebb rendszerhatással — ízületi fájdalomban gyakran elegendő"}', '{"Gyomorpanasz, fekély, vérzés","Vesefunkció-romlás","Vérnyomás-emelkedés, szívelégtelenség romlása","Folyadékvisszatartás, ödéma"}', '{"Alvadásgátlók: jelentősen fokozott vérzési kockázat","ACE-gátlók és vízhajtók együtt: a vesekárosodás kockázata megsokszorozódik","Kis adagú acetilszalicilsav: az ibuprofén gátolhatja a vérlemezke-gátló hatását","Lítium és metotrexát: a szintjük emelkedhet"}',
  'Veseelégtelenségben kerülendő. Szívelégtelenségben és magas vérnyomásban rontja az állapotot.', '{"Vesefunkció","Vérnyomás","Vérkép — vérszegénység keresése"}', 'A terhesség utolsó harmadában ellenjavallt.',
  '{"Az ACE-gátló, a vízhajtó és a gyulladáscsökkentő együttes szedése a vesére nézve a legveszélyesebb hármas — külön-külön mindegyik elfogadható, együtt viszont akut vesekárosodást okozhat","A kis adagú acetilszalicilsavat szedő szívbetegnél az ibuprofén gátolhatja a védőhatást; ha mindkettő kell, az időzítés számít","A vény nélküli kapható szereket a betegek gyakran nem sorolják a gyógyszereik közé, ezért a gyógyszerlistán nem jelennek meg"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'nsaid'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Diklofenák ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'diklofenak', 'Diklofenák', 'Diclofenac', 'M01AB05', g.id,
  'Ugyanaz az enzimgátlás, mint az ibuprofénnél, de erősebb gyulladáscsökkentő hatással. Cserébe a szív- és érrendszeri kockázata is nagyobb a csoporton belül.', '{"Gyulladásos ízületi betegség","Erős mozgásszervi fájdalom","Műtét utáni fájdalom, kiegészítő szerként"}', '{"Igazolt szív- és érrendszeri betegség: infarktus, stroke, szívelégtelenség","Aktív gyomor-bél vérzés","Súlyos vese- vagy májelégtelenség","Terhesség utolsó harmada"}',
  '{"A csoporton belül a legnagyobb szív- és érrendszeri kockázatú szerek közé tartozik: igazolt szívbetegségnél kerülendő","A helyi készítmény jóval biztonságosabb, mert a rendszerbe kevés jut","A legrövidebb ideig, a legkisebb hatásos adagban","Vesefunkció és vérnyomás ellenőrzése tartós szedésnél"}', '{"Szívinfarktus és stroke fokozott kockázata","Gyomorvérzés, fekély","Vesefunkció-romlás","Májenzim-emelkedés"}', '{"Alvadásgátlók: fokozott vérzési kockázat","ACE-gátlók és vízhajtók: vesekárosodás","Egyéb gyulladáscsökkentők: a kockázat összeadódik, együtt nem adhatók"}',
  'Veseelégtelenségben és májbetegségben kerülendő.', '{"Vérnyomás","Vesefunkció","Májenzimek tartós szedésnél"}', 'A terhesség utolsó harmadában ellenjavallt.',
  '{"A szív- és érrendszeri kockázat miatt idős, szívbeteg betegnél ez a csoport legkevésbé alkalmas tagja — az ibuprofén vagy a naproxén biztonságosabb","A helyi és a szájon át adott forma kockázata gyökeresen eltér, mégis gyakran egyformán kezelik őket"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'nsaid'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Tramadol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'tramadol', 'Tramadol', 'Tramadol', 'N02AX02', g.id,
  'Kettős hatású: egyrészt gyenge opioid-hatást fejt ki, másrészt a szerotonin és a noradrenalin visszavételét gátolja. Az opioid-hatásért felelős vegyület viszont csak a szervezetben keletkezik, a CYP2D6 enzim közreműködésével — és ez a lépés egyénenként gyökeresen eltér.', '{"Közepes és erős fájdalom","Krónikus fájdalom, mérlegelés után","Ha a nem opioid szerek nem elegendők"}', '{"Epilepszia","MAO-gátló szedése","Súlyos légzési elégtelenség","Akut mérgezés alkohollal vagy nyugtatóval"}',
  '{"A hatás egyénenként eltér: a lassú lebontóknál alig hat, az ultragyorsaknál szokásos adagban is életveszélyes légzésdepressziót okozhat","Ha a beteg nem kap enyhülést, az nem feltétlenül a beteg hibája: lehet, hogy a szer nála nem alakul hatóanyaggá — ilyenkor más szer kell, nem több","Szokatlan aluszékonyság, lassú vagy felszínes légzés azonnali jelzése","Görcsküszöböt csökkent: epilepsziás vagy görcsre hajlamos betegnél óvatosan","A gyógyszerlista átnézése szerotoninerg szerekre — antidepresszáns mellett szerotonin-szindróma alakulhat ki"}', '{"Hányinger, hányás — a leggyakoribb ok, amiért abbahagyják","Szédülés, aluszékonyság","Székrekedés","Görcsroham","Szerotonin-szindróma","Légzésdepresszió ultragyors lebontóknál"}', '{"Szerotoninerg szerek — antidepresszánsok, triptánok: szerotonin-szindróma","MAO-gátlók: együttadásuk tilos","Görcsküszöböt csökkentő szerek: fokozott görcsroham-kockázat","Karbamazepin: csökkenti a tramadol hatását"}',
  'Vesén és májon át is ürül; mindkettő elégtelenségében adagmódosítás szükséges. Idős betegnél a lebontás lassabb.', '{"Légzésszám és tudatállapot az első napokban","Fájdalomcsillapító hatás dokumentálása","Vesefunkció idős betegnél"}', 'Terhességben és szoptatás alatt kerülendő; a döntés az alkalmazási előírás alapján.',
  '{"A hatástalanságot gyakran adaghiánynak vagy beteg-együttműködési kérdésnek tulajdonítják, pedig a lassú lebontóknál a szer egyszerűen nem alakul hatóanyaggá — több adag itt nem segít, más szer kell","Az antidepresszáns melletti szerotonin-szindróma alattomos: nyugtalanság, izomrángás, láz és zavartság együtt gyanús","Idős betegnél a zavartság és az esésveszély gyakran nem kerül összefüggésbe a szerrel, pedig ismert mellékhatás"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'gyenge-opioidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Morfin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'morfin', 'Morfin', 'Morphine', 'N02AA01', g.id,
  'Közvetlenül az opioid-receptorokon hat, előzetes átalakítás nélkül. Ezért a hatása kiszámíthatóbb, mint a tramadolé vagy a kodeiné — nem függ a CYP2D6 enzim működésétől.', '{"Súlyos fájdalom","Daganatos betegség fájdalma","Palliatív ellátás","Akut szívinfarktus fájdalma","Nehézlégzés csillapítása a palliatív ellátásban"}', '{"Súlyos légzési elégtelenség","Akut asztmás roham","Bélelzáródás","Akut mérgezés nyugtatóval vagy alkohollal"}',
  '{"Légzésszám és tudatállapot rendszeres ellenőrzése, különösen az első huszonnégy órában és minden adagemelés után","Hashajtó a kezelés kezdetétől: a székrekedés szinte minden betegnél kialakul, és nem múlik el a kezelés alatt","Az ellenszer elérhetőségének ismerete: a hatást percek alatt felfüggeszti","Veseelégtelenségben a bomlástermékek halmozódnak, ami elhúzódó hatást és zavartságot okoz — ilyenkor más szer lehet a jobb választás","A fájdalom mérése és a hatás dokumentálása minden adag után"}', '{"Légzésdepresszió","Székrekedés — szinte minden betegnél","Hányinger, hányás a kezelés kezdetén","Aluszékonyság, zavartság","Viszketés","Vizeletretenció"}', '{"Nyugtatók és altatók: a légzésdepresszió kockázata összeadódik","Alkohol: fokozott központi idegrendszeri gátlás","MAO-gátlók: súlyos reakció"}',
  'Vesén át ürülő bomlástermékei veseelégtelenségben halmozódnak, ami elhúzódó hatást és zavartságot okoz. Májelégtelenségben a lebontás lassul.', '{"Légzésszám","Tudatállapot","Fájdalomszint","Székletürítés","Vesefunkció"}', 'Terhességben csak egyértelmű javallat esetén; a szülés előtt adva a magzat légzését is elnyomhatja.',
  '{"A függőségtől való félelem gyakran vezet alulkezeléshez: a valós fájdalomra adott opioid nem okoz függőséget, a kezeletlen fájdalom viszont súlyos szenvedést és szövődményeket okoz","A székrekedés megelőzése elmarad, pedig szinte biztosan kialakul — utólag nehezebb kezelni, mint megelőzni","Veseelégtelenségben a bomlástermékek halmozódása napokkal a kezelés után okozhat zavartságot, amit gyakran más okra vezetnek vissza"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'eros-opioidok'
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
-- Négy alcsoportnak és hat hatóanyagnak kell megjelennie.
select g.name as alcsoport, count(s.id) as hatoanyag,
  string_agg(s.name, ', ' order by s.name) as hatoanyagok
from public.drug_groups g
left join public.drug_substances s on s.group_id = g.id and s.publish_status = 'published'
join public.drug_groups p on p.id = g.parent_id
where p.slug = 'fajdalomcsillapitok' and g.publish_status = 'published'
group by g.name, g.ord
order by g.ord;
