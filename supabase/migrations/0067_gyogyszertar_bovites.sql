-- APN-MED — Gyógyszertár: csoportmagyarázatok és új hatóanyagok.
--
-- Két dolgot ad hozzá.
--
-- Az első: minden csoportnál rövid magyarázat arról, mit takar a megnevezés.
-- A „béta-laktám” vagy a „fluorokinolon” a szakmai szövegekben magától
-- értetődőnek számít, pedig a név a molekula szerkezetére utal, és ebből
-- következik a hatásmód is.
--
-- A második: vízhajtók és szívgyógyszerek — a két leggyakrabban használt
-- csoport hatóanyagai.
--
-- Előfeltétel: a 0065 és a 0066 lefutott.

-- ══ Új mező a névmagyarázatnak ═══════════════════════════
alter table public.drug_groups
  add column if not exists name_meaning text;

-- ══ Csoportmagyarázatok ══════════════════════════════════
update public.drug_groups set name_meaning = 'A szó görög eredetű: „élet ellen”. Olyan szerek, amelyek baktériumokat ölnek meg vagy gátolják a szaporodásukat. Vírusokra nem hatnak — ez a leggyakoribb félreértés a betegek és néha az ellátók körében is.'
where slug = 'antibiotikumok';

update public.drug_groups set name_meaning = 'A név a molekula szerkezetére utal: mindegyikben van egy négytagú gyűrű, a béta-laktám gyűrű. Ez a gyűrű bénítja a baktérium sejtfalépítő enzimeit, ezért a sejtfal hiányossá válik, és a baktérium elpusztul. A baktériumok védekezése is ehhez a gyűrűhöz kötődik: a béta-laktamáz enzim felnyitja, és a szer hatástalanná válik. Ezért adnak hozzá enzimgátlót — például klavulánsavat.'
where slug = 'beta-laktamok';

update public.drug_groups set name_meaning = 'A név a szerkezetre utal: nagy méretű, gyűrűs molekulák („makro” = nagy, „lakton” = gyűrűs észter). A baktérium fehérjegyárát, a riboszómát bénítják, így az nem tud új fehérjéket készíteni. Mivel a sejtbe is bejutnak, hatásosak olyan kórokozókra, amelyek a sejten belül élnek — ilyen a Chlamydia és a Legionella.'
where slug = 'makrolidok';

update public.drug_groups set name_meaning = 'A név két részből áll: a „kinolon” az alapszerkezet, a „fluoro” pedig a hozzáadott fluoratomra utal, ami jelentősen javította a hatékonyságot és a felszívódást. A baktérium DNS-ének feltekeredéséért felelős enzimeket bénítják, így a sejt nem tud osztódni. Épp a jó szöveti eloszlásuk miatt fordulnak elő olyan mellékhatások, amelyek távoli szerveket érintenek: ínsérülés, idegkárosodás, aortatágulat.'
where slug = 'fluorokinolonok';

update public.drug_groups set name_meaning = 'A név a szerkezetből ered: aminocsoportot tartalmazó cukormolekulák. A riboszómát támadják, de a makrolidoktól eltérő ponton, és a baktériumot meg is ölik. Nem szívódnak fel a bélből, ezért csak injekcióban adhatók. A szűk terápiás tartomány miatt a vérszint mérése nem választható, hanem a kezelés része.'
where slug = 'aminoglikozidok';

update public.drug_groups set name_meaning = 'A név cukor- és fehérjerészt tartalmazó molekulákra utal. A sejtfalat támadják, de a béta-laktámoktól eltérő ponton — ezért hatnak olyan kórokozókra is, amelyek a béta-laktámokkal szemben ellenállók, például a MRSA-ra. Nagy molekulák, ezért a bélből nem szívódnak fel: szájon át adva csak a bélben fejtenek ki hatást.'
where slug = 'glikopeptidek';

update public.drug_groups set name_meaning = 'A fájdalomcsillapítás lépcsőzetes: a gyengébb szerekkel kezdünk, és csak szükség esetén lépünk feljebb. A csoport két nagy részre oszlik: a nem opioid szerek a gyulladás helyén vagy a központi idegrendszerben hatnak, az opioidok pedig a fájdalomérzet feldolgozását módosítják.'
where slug = 'fajdalomcsillapitok';

update public.drug_groups set name_meaning = 'A vese meghatározott szakaszain gátolják a nátrium visszaszívását. Ahol a nátrium marad, oda víz is áramlik, így nő a vizelet mennyisége. A csoportok aszerint különböznek, hogy a vesecsatorna melyik szakaszán hatnak — és ebből következik az erősségük és a káliumra gyakorolt hatásuk is.'
where slug = 'vizhajtok';

update public.drug_groups set name_meaning = 'Gyűjtőnév a szív és az erek betegségeire használt szerekre. Több, egymástól eltérő működésű csoportot foglal magába: van, amelyik a szívet lassítja, van, amelyik az ereket tágítja, és van, amelyik a szervezet víz- és sóháztartását befolyásolja.'
where slug = 'kardiovaszkularis';

update public.drug_groups set name_meaning = 'Két, gyakran összekevert csoportot foglal magába. Az antikoagulánsok a véralvadás fehérjeláncát gátolják, a vérlemezke-gátlók pedig azt akadályozzák meg, hogy a vérlemezkék összetapadjanak. Más a javallatuk, más a kockázatuk, és beavatkozás előtt más a szüneteltetésük rendje.'
where slug = 'veralvadas';

-- ══ Új alcsoportok ═══════════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'kacsdiuretikumok', 'Kacsdiuretikumok', 'C03C', p.id, 'Furoszemid — a legerősebb vízhajtó csoport',
  'A leggyorsabb és legerősebb hatású vízhajtók. Akut szívelégtelenségben és tüdőpangásban elsődlegesek.', 'A név a vese szerkezetére utal: a Henle-kacs nevű szakaszon hatnak, ahol a nátrium visszaszívásának nagy része történik. Mivel itt a legnagyobb a visszaszívott mennyiség, az itt ható szerek a legerősebbek.',
  '{"A hatás gyorsan, percek-órák alatt jelentkezik, és rövid ideig tart — ezért gyakran naponta többször kell adni.","Jelentős kálium- és magnéziumvesztést okoznak, ami ritmuszavarhoz vezethet.","Vesefunkció-romlás esetén nagyobb adag lehet szükséges a hatáshoz."}', '{"A testsúly napi mérése a hatás követésére — ez pontosabb, mint a folyadéklap","Kálium, nátrium és vesefunkció rendszeres ellenőrzése","A vizeletmennyiség és a pangás jeleinek követése","Este adott adag zavarja az alvást — a beadási idő tervezése számít"}', 1, 'published'
from public.drug_groups p where p.slug = 'vizhajtok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'tiazidok', 'Tiazid típusú vízhajtók', 'C03A', p.id, 'Hidroklorotiazid, indapamid',
  'Elsősorban magas vérnyomás kezelésére, nem vízhajtásra használt szerek. A vérnyomáscsökkentő hatás részben az erek tágításából ered.', 'A név a molekula kéntartalmú gyűrűs szerkezetére utal. A vesecsatorna távolabbi szakaszán hatnak, ahol kevesebb nátrium szívódik vissza — ezért gyengébbek a kacsdiuretikumoknál, viszont hatásuk egyenletesebb és tartósabb.',
  '{"Vesefunkció-romlásnál a hatásuk csökken, súlyos veseelégtelenségben már nem hatékonyak.","Alacsony nátriumszintet okozhatnak, különösen idős nőknél — ez zavartsághoz, eleséshez vezethet.","A húgysavszintet emelik, köszvényt válthatnak ki."}', '{"Nátriumszint ellenőrzése a kezelés kezdetén és adagemelés után","Zavartság, gyengeség, elesés jelzésének kérése — alacsony nátriumra utalhat","Reggeli adagolás javasolt"}', 2, 'published'
from public.drug_groups p where p.slug = 'vizhajtok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'kalium-megtakaritok', 'Kálium-megtakarító vízhajtók', 'C03D', p.id, 'Spironolakton, eplerenon',
  'Gyenge vízhajtó hatás, de szívelégtelenségben bizonyítottan javítják a túlélést — ez a fő javallatuk, nem a vízhajtás.', 'A név arra utal, hogy más vízhajtóktól eltérően nem ürítik, hanem visszatartják a káliumot. Az aldoszteron nevű hormon hatását gátolják, ami egyébként nátriumot tartana vissza és káliumot ürítene.',
  '{"A legfontosabb kockázat a magas káliumszint, ami életveszélyes ritmuszavart okozhat.","Vesefunkció-romlás és ACE-gátló együttes szedése mellett a kockázat többszörös.","A spironolakton hormonális mellékhatásokat okozhat: mellduzzanat férfiaknál, menstruációs zavar."}', '{"Káliumszint ellenőrzése a kezelés kezdetén, adagemelés után és rendszeresen","A kálium-kiegészítők és a kálium-tartalmú sópótlók kerülése","Izomgyengeség, szívdobogásérzés jelzésének kérése"}', 3, 'published'
from public.drug_groups p where p.slug = 'vizhajtok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'beta-blokkolok', 'Béta-blokkolók', 'C07', p.id, 'Bisoprolol, metoprolol, karvedilol',
  'Szívelégtelenségben, ritmuszavarban és szívinfarktus után bizonyítottan javítják a túlélést.', 'A név a hatás helyére utal: a szívben és az ereken lévő béta-receptorokat blokkolják. Ezek a receptorok fogják fel az adrenalin és a noradrenalin jelét — ha ezt gátoljuk, a szív lassabban és kisebb erővel dolgozik, ami csökkenti a szív oxigénigényét.',
  '{"A hirtelen elhagyás visszacsapó hatással jár: gyorsuló szívverés, mellkasi panasz, ritmuszavar — a leállítás mindig fokozatos.","Szívelégtelenségben lassan, kis adaggal kell kezdeni és fokozatosan emelni.","Elfedhetik a hypoglykaemia tüneteit cukorbetegnél: a szapora szívverés elmarad."}', '{"Pulzus és vérnyomás mérése beadás előtt — alacsony érték esetén jelzés","A hirtelen elhagyás veszélyének elmagyarázása a betegnek","Cukorbetegnél a hypoglykaemia szokatlan tüneteinek keresése: izzadás, zavartság","Fáradtság, szédülés, hideg végtag jelzésének kérése"}', 1, 'published'
from public.drug_groups p where p.slug = 'kardiovaszkularis'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'ace-gatlok', 'ACE-gátlók és szartánok', 'C09', p.id, 'Ramipril, perindopril, valzartán',
  'Magas vérnyomásban, szívelégtelenségben és vesevédelemre egyaránt használt alapszerek.', 'Az ACE az angiotenzin-konvertáló enzim rövidítése. Ez az enzim készíti azt a hormont, amely szűkíti az ereket és nátriumot tart vissza. A gátlásával az erek tágulnak, a vérnyomás csökken, és a szív terhelése mérséklődik. A szartánok ugyanezt a hormont blokkolják, de a hatás helyén — ezért nem okoznak köhögést.',
  '{"A száraz, ingerlő köhögés az ACE-gátlók jellegzetes mellékhatása; ilyenkor szartánra váltás jön szóba.","Angioödémát okozhatnak, akár évekkel a kezelés kezdete után is — ez bradikinin-eredetű, és nem reagál az adrenalinra.","A káliumszintet emelik, és a vesefunkciót átmenetileg ronthatják a kezelés kezdetén."}', '{"Kálium és kreatinin ellenőrzése a kezelés kezdetén és adagemelés után","Száraz köhögés jelzésének kérése — gyakran nem hozzák összefüggésbe a szerrel","Arcduzzanat esetén azonnali jelzés: angioödéma lehet","Az első adag után vérnyomásesés lehetséges, különösen vízhajtó mellett"}', 2, 'published'
from public.drug_groups p where p.slug = 'kardiovaszkularis'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

-- ══ Új hatóanyagok ═══════════════════════════════════════
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'furoszemid', 'Furoszemid', 'Furosemide', 'C03CA01', g.id,
  'A vese Henle-kacsában gátolja a nátrium, a klorid és a kálium együttes visszaszívását. A vesecsatornában maradt sók vizet vonzanak, így nő a vizelet mennyisége. A hatás gyors és erős.', '{"Akut szívelégtelenség, tüdőpangás","Krónikus szívelégtelenség folyadékterhelése","Vesebetegséghez társuló ödéma","Májbetegséghez társuló hasűri folyadék"}', '{"Kiszáradás, súlyos vérnyomásesés","Vizeletürítés hiánya","Súlyos alacsony kálium- vagy nátriumszint"}',
  '{"A testsúly napi mérése azonos időben, azonos ruhában — ez a leghitelesebb mérőszáma a hatásnak, pontosabb, mint a folyadéklap","Kálium ellenőrzése: a vesztés ritmuszavart okozhat, különösen digoxin mellett","A vénás beadás sebessége számít: a túl gyors adás halláskárosodást okozhat","Este adott adag miatt a beteg éjszaka többször kel — esésveszély, és rontja az alvást","Vérnyomás mérése álló helyzetben is: az ortosztatikus esés gyakori"}', '{"Alacsony kálium-, nátrium- és magnéziumszint","Kiszáradás, vérnyomásesés","Vesefunkció-romlás","Halláskárosodás gyors vénás beadásnál","Húgysavszint-emelkedés, köszvény"}', '{"Digoxin: az alacsony kálium fokozza a digoxin mérgező hatását","Aminoglikozidok: fokozott vese- és halláskárosodás","Nem szteroid gyulladáscsökkentők: csökkentik a vízhajtó hatását","ACE-gátlók: együtt adva erős vérnyomásesés lehet az első adagnál"}',
  'Veseelégtelenségben nagyobb adag lehet szükséges a hatáshoz. Májbetegségben óvatosan, mert az elektrolitzavar zavartságot válthat ki.', '{"Napi testsúly","Kálium, nátrium, magnézium","Kreatinin és eGFR","Vizeletmennyiség","Vérnyomás fekve és állva"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A folyadéklap gyakran pontatlan; a napi testsúly megbízhatóbb — egy kilogramm körülbelül egy liter folyadéknak felel meg","Az alacsony kálium és a digoxin együttese életveszélyes ritmuszavart okozhat; ez a kombináció gyakori idős, szívelégtelen betegnél","A hatás elmaradása nem mindig adaghiány: felszívódási zavar, rossz beteg-együttműködés vagy előrehaladott veseelégtelenség is állhat mögötte"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'kacsdiuretikumok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'indapamid', 'Indapamid', 'Indapamide', 'C03BA11', g.id,
  'A vesecsatorna távolabbi szakaszán gátolja a nátrium visszaszívását, emellett tágítja az ereket. A vérnyomáscsökkentő hatás nagyobb részt az értágításból ered, mint a vízhajtásból.', '{"Magas vérnyomás"}', '{"Súlyos veseelégtelenség","Súlyos májelégtelenség","Alacsony káliumszint","Szulfonamid-allergia"}',
  '{"A vérnyomáscsökkentő hatás hetek alatt épül fel — a gyors adagemelés ájulást okozhat","Nátriumszint ellenőrzése, különösen idős nőknél: az alacsony nátrium zavartságot és elesést okozhat","Reggeli bevétel javasolt, hogy ne zavarja az éjszakai alvást"}', '{"Alacsony nátrium- és káliumszint","Húgysavszint-emelkedés, köszvény","Vércukorszint-emelkedés","Fényérzékenység"}', '{"Digoxin: az alacsony kálium fokozza a mérgező hatást","Lítium: a szintje emelkedhet","Nem szteroid gyulladáscsökkentők: csökkentik a hatást és ronthatják a vesefunkciót"}',
  'Vesefunkció-romlásnál a hatás csökken; súlyos veseelégtelenségben már nem hatékony — ilyenkor kacsdiuretikum szükséges.', '{"Nátrium és kálium","Kreatinin","Húgysav","Vércukor"}', 'Terhességben nem javasolt; a döntés az alkalmazási előírás alapján.',
  '{"Nem vízhajtásra való: a fő javallat a magas vérnyomás, és a jelentős folyadékterhelés kezelésére nem alkalmas","Az alacsony nátrium tünetei — zavartság, gyengeség, elesés — könnyen összetéveszthetők az időskori állapotromlással"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'tiazidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'spironolakton', 'Spironolakton', 'Spironolactone', 'C03DA01', g.id,
  'Az aldoszteron hormon hatását gátolja a vesében. Az aldoszteron egyébként nátriumot tartana vissza és káliumot ürítene — a gátlásával fordítva történik. Szívelégtelenségben a szívizom átépülését is lassítja.', '{"Krónikus szívelégtelenség — a túlélést javítja","Májbetegséghez társuló hasűri folyadék","Nehezen kezelhető magas vérnyomás","Elsődleges aldoszterontúltermelés"}', '{"Magas káliumszint","Súlyos veseelégtelenség","Addison-kór"}',
  '{"A káliumszint a legfontosabb: a magas kálium életveszélyes ritmuszavart okozhat, és tünetmentesen alakulhat ki","Kálium-kiegészítő és kálium-tartalmú sópótló kerülése — a betegek gyakran nem tudják, hogy a diétás só káliumot tartalmaz","ACE-gátlóval együtt szedve a kockázat többszörös","Mellduzzanat vagy mellérzékenység férfiaknál: kellemetlen, de nem veszélyes — a beteg gyakran szégyelli szóba hozni, ezért érdemes rákérdezni"}', '{"Magas káliumszint","Vesefunkció-romlás","Mellduzzanat és -érzékenység férfiaknál","Menstruációs zavar","Hányinger, hasmenés"}', '{"ACE-gátlók és szartánok: együtt adva jelentősen nő a magas kálium kockázata","Kálium-kiegészítők: kerülendők","Nem szteroid gyulladáscsökkentők: rontják a vesefunkciót és emelik a káliumot","Digoxin: a szintje emelkedhet"}',
  'Veseelégtelenségben a magas kálium kockázata jelentősen nő; a vesefunkció ismerete a kezelés feltétele.', '{"Kálium a kezelés kezdetén, egy hét múlva, majd rendszeresen","Kreatinin és eGFR","Vérnyomás"}', 'Terhességben kerülendő; a döntés az alkalmazási előírás alapján.',
  '{"A magas kálium tünetmentesen alakulhat ki, és az első jel már a ritmuszavar lehet — ezért a rendszeres ellenőrzés nem elhagyható","A betegek gyakran nem tudják, hogy a diétás sópótlók káliumot tartalmaznak","Nem elsősorban vízhajtó: szívelégtelenségben a túlélési előny a fő javallat, nem a folyadékvesztés"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'kalium-megtakaritok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'bisoprolol', 'Bisoprolol', 'Bisoprolol', 'C07AB07', g.id,
  'A szív béta-receptorait blokkolja, ezért a szív lassabban és kisebb erővel dolgozik. Ez csökkenti a szív oxigénigényét és a vérnyomást. Elsősorban a szívre hat, a hörgőkre kevésbé.', '{"Krónikus szívelégtelenség — a túlélést javítja","Magas vérnyomás","Angina","Ritmuszavar, frekvenciakontroll"}', '{"Lassú szívverés, magasfokú ingervezetési zavar","Kezeletlen szívelégtelenség akut fellángolása","Súlyos vérnyomásesés","Súlyos asztma"}',
  '{"Pulzus és vérnyomás mérése beadás előtt: alacsony érték esetén jelzés az orvosnak, ne saját döntés alapján maradjon el","A hirtelen elhagyás veszélyes: visszacsapó szapora szívverés, mellkasi panasz és ritmuszavar léphet fel — a leállítás mindig fokozatos","Cukorbetegnél elfedheti a hypoglykaemia szapora szívverését; az izzadás és a zavartság marad meg jelzésként","Szívelégtelenségben az adagemelés lassú, és átmenetileg rosszabbodhat az állapot"}', '{"Lassú szívverés","Fáradtság, gyengeség","Hideg végtagok","Alvászavar, élénk álmok","Szédülés"}', '{"Verapamil és diltiazem: együtt adva súlyos szívlassulás lehet","Antiarritmiás szerek: fokozott ingervezetési zavar","Inzulin és vércukorcsökkentők: elfedett hypoglykaemia"}',
  'Vese- és májelégtelenségben adagmódosítás lehet szükséges.', '{"Pulzus","Vérnyomás","Szívelégtelenség tünetei adagemelés után"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A kihagyott adagok visszacsapó hatást okozhatnak — ez gyakori, ha a beteg kórházba kerül és a gyógyszerlista nem kerül át","Az alacsony pulzus miatti önkényes adagkihagyás veszélyesebb lehet, mint az adott dózis: a döntés orvosi","Szívelégtelenségben az átmeneti rosszabbodás nem a kezelés kudarca, hanem várható szakasz"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'ramipril', 'Ramipril', 'Ramipril', 'C09AA05', g.id,
  'Gátolja azt az enzimet, amely az érszűkítő hormont készíti. Az erek tágulnak, a vérnyomás csökken, a szív terhelése mérséklődik. A vesében a nyomásviszonyokat is javítja, ezért fehérjevizelésnél védőhatású.', '{"Magas vérnyomás","Szívelégtelenség — a túlélést javítja","Szívinfarktus után","Cukorbetegséghez társuló vesekárosodás"}', '{"Korábbi angioödéma ACE-gátló kapcsán","Terhesség","Kétoldali veseartéria-szűkület","Magas káliumszint"}',
  '{"Az első adag után vérnyomásesés lehetséges, különösen vízhajtó mellett vagy kiszáradt betegnél — fekve adás és utána mérés","Kálium és kreatinin ellenőrzése a kezelés kezdetén és minden adagemelés után","A száraz, ingerlő köhögés jellegzetes mellékhatás; a beteg gyakran nem hozza összefüggésbe a gyógyszerrel, ezért érdemes rákérdezni","Arcduzzanat esetén azonnali jelzés: az angioödéma bradikinin-eredetű, és nem reagál az adrenalinra"}', '{"Száraz köhögés","Vérnyomásesés, szédülés","Magas káliumszint","Vesefunkció-romlás a kezelés kezdetén","Angioödéma"}', '{"Kálium-megtakarító vízhajtók: jelentősen nő a magas kálium kockázata","Nem szteroid gyulladáscsökkentők: rontják a vesefunkciót és a hatást","Lítium: a szintje emelkedhet","Vízhajtók: az első adagnál erős vérnyomásesés lehet"}',
  'Veseelégtelenségben adagmódosítás szükséges. A kezelés kezdetén a kreatinin átmeneti, kismértékű emelkedése várható és elfogadható; a jelentős romlás viszont kivizsgálást igényel.', '{"Kálium és kreatinin a kezelés kezdetén, majd adagemelés után","Vérnyomás fekve és állva"}', 'Terhességben ellenjavallt: magzati károsodást okoz. Fogamzóképes korban a fogamzásgátlás kérdését meg kell beszélni.',
  '{"Az angioödéma évekkel a kezelés kezdete után is jelentkezhet, ezért a gyógyszer sokáig nem kerül gyanúba","A köhögés miatt a beteg gyakran köhögés elleni szert kap, ahelyett hogy a gyógyszert váltanák","A kreatinin kismértékű emelkedése a kezelés kezdetén nem ok a leállításra — a szer épp a vesét védi hosszú távon"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ══ Ellenőrzés ═══════════════════════════════════════════
select g.name as csoport, count(s.id) as hatoanyag,
  case when g.name_meaning is null then 'nincs' else 'van' end as magyarazat
from public.drug_groups g
left join public.drug_substances s on s.group_id = g.id
where g.publish_status = 'published'
group by g.name, g.name_meaning, g.ord
order by g.ord, g.name;
