-- APN-MED — Gyógyszertár: a vízhajtó csoport pótlása és kiegészítése.
--
-- HIBAJAVÍTÁS. A 0067 migráció magyarázatot adott a vízhajtók főcsoporthoz,
-- és felvette alá a három alcsoportot — a főcsoportot magát viszont nem
-- hozta létre, mert az a 0066-ból kimaradt. Emiatt a három alcsoport
-- beszúrása üresen futott (nem talált szülőt), és velük együtt a hozzájuk
-- tartozó hatóanyagok sem kerültek be.
--
-- Ez a migráció pótolja a főcsoportot, újra felveszi az alcsoportokat, és
-- beszúrja mind a hat vízhajtót: a 0067-ből kimaradt hármat és az újakat.
--
-- Előfeltétel: a 0065, 0066 és 0067 lefutott.

-- ══ 1. A hiányzó főcsoport ═══════════════════════════════
insert into public.drug_groups
  (slug, name, atc, short, description, name_meaning, key_points, apn_notes, icon, ord, publish_status)
values (
  'vizhajtok', 'Vízhajtók', 'C03',
  'Kacs-, tiazid- és kálium-megtakarító szerek',
  'A folyadékterhelés és a magas vérnyomás kezelésének alapszerei. A csoportok aszerint különböznek, hogy a vesecsatorna melyik szakaszán hatnak.',
  'A vese meghatározott szakaszain gátolják a nátrium visszaszívását. Ahol a nátrium marad, oda víz is áramlik, így nő a vizelet mennyisége. A csoportok aszerint különböznek, hogy a vesecsatorna melyik szakaszán hatnak — és ebből következik az erősségük és a káliumra gyakorolt hatásuk is.',
  '{"A hatás erőssége attól függ, a vesecsatorna melyik szakaszán hat a szer: minél korábban, annál több nátriumot érint, annál erősebb a hatás.","Az elektrolitzavar a leggyakoribb és legveszélyesebb mellékhatás — különösen digoxin mellett.","A napi testsúly megbízhatóbb mérőszáma a hatásnak, mint a folyadéklap."}',
  '{"Napi testsúlymérés azonos időben, azonos ruhában","Kálium, nátrium és vesefunkció rendszeres ellenőrzése","A beadási idő tervezése: az esti adag zavarja az alvást és esésveszélyt jelent","Vérnyomás mérése fekve és állva"}',
  '💧', 5, 'published'
)
on conflict (slug) do update set
  name = excluded.name, short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, icon = excluded.icon,
  publish_status = excluded.publish_status;

-- ══ 2. Az alcsoportok pótlása ════════════════════════════
-- A 0067 ezeket már megpróbálta felvenni, de szülő híján üresen futott.
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning, key_points, apn_notes, ord, publish_status)
select 'kacsdiuretikumok', 'Kacsdiuretikumok', 'C03C', p.id,
  'Furoszemid, torasemid — a legerősebb vízhajtó csoport',
  'A leggyorsabb és legerősebb hatású vízhajtók. Akut szívelégtelenségben és tüdőpangásban elsődlegesek.',
  'A név a vese szerkezetére utal: a Henle-kacs nevű szakaszon hatnak, ahol a nátrium visszaszívásának nagy része történik. Mivel itt a legnagyobb a visszaszívott mennyiség, az itt ható szerek a legerősebbek.',
  '{"A hatás gyorsan, percek-órák alatt jelentkezik, és rövid ideig tart — ezért gyakran naponta többször kell adni.","Jelentős kálium- és magnéziumvesztést okoznak, ami ritmuszavarhoz vezethet.","Vesefunkció-romlás esetén nagyobb adag lehet szükséges a hatáshoz."}',
  '{"A testsúly napi mérése a hatás követésére — ez pontosabb, mint a folyadéklap","Kálium, nátrium és vesefunkció rendszeres ellenőrzése","A vizeletmennyiség és a pangás jeleinek követése","Este adott adag zavarja az alvást — a beadási idő tervezése számít"}',
  1, 'published'
from public.drug_groups p where p.slug = 'vizhajtok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning, key_points, apn_notes, ord, publish_status)
select 'tiazidok', 'Tiazid típusú vízhajtók', 'C03A', p.id,
  'Hidroklorotiazid, indapamid',
  'Elsősorban magas vérnyomás kezelésére, nem vízhajtásra használt szerek. A vérnyomáscsökkentő hatás részben az erek tágításából ered.',
  'A név a molekula kéntartalmú gyűrűs szerkezetére utal. A vesecsatorna távolabbi szakaszán hatnak, ahol kevesebb nátrium szívódik vissza — ezért gyengébbek a kacsdiuretikumoknál, viszont hatásuk egyenletesebb és tartósabb.',
  '{"Vesefunkció-romlásnál a hatásuk csökken, súlyos veseelégtelenségben már nem hatékonyak.","Alacsony nátriumszintet okozhatnak, különösen idős nőknél — ez zavartsághoz, eleséshez vezethet.","A húgysavszintet emelik, köszvényt válthatnak ki."}',
  '{"Nátriumszint ellenőrzése a kezelés kezdetén és adagemelés után","Zavartság, gyengeség, elesés jelzésének kérése — alacsony nátriumra utalhat","Reggeli adagolás javasolt"}',
  2, 'published'
from public.drug_groups p where p.slug = 'vizhajtok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning, key_points, apn_notes, ord, publish_status)
select 'kalium-megtakaritok', 'Kálium-megtakarító vízhajtók', 'C03D', p.id,
  'Spironolakton, eplerenon',
  'Gyenge vízhajtó hatás, de szívelégtelenségben bizonyítottan javítják a túlélést — ez a fő javallatuk, nem a vízhajtás.',
  'A név arra utal, hogy más vízhajtóktól eltérően nem ürítik, hanem visszatartják a káliumot. Az aldoszteron nevű hormon hatását gátolják, ami egyébként nátriumot tartana vissza és káliumot ürítene.',
  '{"A legfontosabb kockázat a magas káliumszint, ami életveszélyes ritmuszavart okozhat.","Vesefunkció-romlás és ACE-gátló együttes szedése mellett a kockázat többszörös.","A spironolakton hormonális mellékhatásokat okozhat: mellduzzanat férfiaknál, menstruációs zavar."}',
  '{"Káliumszint ellenőrzése a kezelés kezdetén, adagemelés után és rendszeresen","A kálium-kiegészítők és a kálium-tartalmú sópótlók kerülése","Izomgyengeség, szívdobogásérzés jelzésének kérése"}',
  3, 'published'
from public.drug_groups p where p.slug = 'vizhajtok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

-- ══ 3. A hatóanyagok ═════════════════════════════════════
-- Hat vízhajtó: a 0067-ből kimaradt három és az új három.

-- ── Furoszemid ──
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

-- ── Torasemid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'torasemid', 'Torasemid', 'Torasemide', 'C03CA04', g.id,
  'Ugyanott hat, mint a furoszemid: a Henle-kacsban gátolja a nátrium, a klorid és a kálium együttes visszaszívását. A különbség a felszívódásban van — a torasemid szájon át kiszámíthatóbban szívódik fel, és tovább hat.', '{"Krónikus szívelégtelenség folyadékterhelése","Magas vérnyomás","Vese- és májbetegséghez társuló ödéma"}', '{"Kiszáradás, súlyos vérnyomásesés","Vizeletürítés hiánya","Súlyos alacsony kálium- vagy nátriumszint"}',
  '{"A hatás hosszabb és egyenletesebb, mint a furoszemidé — kevésbé zavarja a napi ritmust, de a napi testsúlymérés ugyanúgy szükséges","Kálium ellenőrzése: a vesztés kisebb, mint furoszemidnél, de nem elhanyagolható","Szívelégtelenségben a szájon át adott forma megbízhatóbb, mert a bélfal duzzanata kevésbé befolyásolja a felszívódását"}', '{"Alacsony kálium- és nátriumszint","Kiszáradás, vérnyomásesés","Húgysavszint-emelkedés","Vesefunkció-romlás"}', '{"Digoxin: az alacsony kálium fokozza a mérgező hatást","Nem szteroid gyulladáscsökkentők: csökkentik a vízhajtó hatást","ACE-gátlók: együtt adva erős vérnyomásesés lehet"}',
  'Májon át bomlik le, ezért veseelégtelenségben kevésbé halmozódik, mint a furoszemid. Súlyos májbetegségben óvatosan.', '{"Napi testsúly","Kálium és nátrium","Kreatinin","Vérnyomás"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A furoszemiddel nem cserélhető fel azonos milligrammban: a torasemid erősebb, ezért az átállítás orvosi döntés","Szívelégtelenségben a bélfal duzzanata rontja a furoszemid felszívódását — ez az egyik oka annak, ha a szájon át adott kezelés hatástalan marad"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Indapamid ──
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

-- ── Hidroklorotiazid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'hidroklorotiazid', 'Hidroklorotiazid', 'Hydrochlorothiazide', 'C03AA03', g.id,
  'A vesecsatorna távolabbi szakaszán gátolja a nátrium és a klorid visszaszívását. A vérnyomáscsökkentő hatás kezdetben a folyadékvesztésből, később inkább az erek ellazulásából ered.', '{"Magas vérnyomás — jellemzően kombinációban","Enyhe ödéma","Vesekő megelőzése kalciumvesztés esetén"}', '{"Súlyos veseelégtelenség","Alacsony kálium- vagy nátriumszint","Köszvény","Szulfonamid-allergia"}',
  '{"Ritkán adják önmagában: jellemzően ACE-gátlóval vagy szartánnal kombinált készítményben szerepel — a beteg gyakran nem tudja, hogy vízhajtót is szed","A kombinált készítmények miatt könnyen előfordul, hogy a beteg kétszer kapja ugyanazt a hatóanyagot; a teljes gyógyszerlista átnézése ezért fontos","Nátriumszint ellenőrzése, különösen idős nőknél","Fényvédelem javasolt: fényérzékenységet okozhat"}', '{"Alacsony nátrium- és káliumszint","Húgysavszint-emelkedés, köszvény","Vércukorszint-emelkedés","Fényérzékenység","Merevedési zavar"}', '{"Digoxin: az alacsony kálium fokozza a mérgező hatást","Lítium: a szintje emelkedhet","Nem szteroid gyulladáscsökkentők: csökkentik a hatást","Kortikoszteroidok: fokozott káliumvesztés"}',
  'Vesefunkció-romlásnál a hatás csökken; 30 ml/perc alatti szűrési érték mellett már nem hatékony — ilyenkor kacsdiuretikum szükséges.', '{"Nátrium és kálium","Kreatinin","Húgysav","Vércukor"}', 'Terhességben nem javasolt; a döntés az alkalmazási előírás alapján.',
  '{"A kombinált készítményekben rejtve marad: a beteg és néha az ellátó sem tudja, hogy vízhajtót is szed — ez elektrolitzavarnál fontos nyom","Veseelégtelenségben hatástalan, mégis gyakran marad a gyógyszerlistán","A köszvényes roham és a magas vércukor gyakran nem kerül összefüggésbe a szerrel, pedig mindkettő ismert mellékhatás"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Spironolakton ──
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

-- ── Eplerenon ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'eplerenon', 'Eplerenon', 'Eplerenone', 'C03DA04', g.id,
  'Az aldoszteron hatását gátolja a vesében, akárcsak a spironolakton, de célzottabban: a nemi hormonok receptoraihoz jóval kevésbé kötődik. Ezért okoz ritkábban hormonális mellékhatást.', '{"Szívelégtelenség szívinfarktus után — a túlélést javítja","Krónikus szívelégtelenség","Nehezen kezelhető magas vérnyomás"}', '{"Magas káliumszint","Súlyos veseelégtelenség","Erős enzimgátló szerek együttes szedése"}',
  '{"A káliumszint ugyanúgy a legfontosabb, mint spironolakton mellett: a magas kálium tünetmentesen alakulhat ki, és az első jel a ritmuszavar lehet","A hormonális mellékhatások ritkábbak — ha a beteg spironolakton mellett mellduzzanat miatt hagyta abba a kezelést, ez lehet az alternatíva","Kálium-kiegészítő és kálium-tartalmú sópótló kerülése"}', '{"Magas káliumszint","Szédülés","Vesefunkció-romlás","Hormonális mellékhatás — ritkábban, mint spironolakton mellett"}', '{"ACE-gátlók és szartánok: jelentősen nő a magas kálium kockázata","Kálium-kiegészítők: kerülendők","Erős enzimgátlók (például egyes gombaellenes szerek): a szintje jelentősen emelkedik"}',
  'Veseelégtelenségben a magas kálium kockázata nő; a vesefunkció ismerete a kezelés feltétele.', '{"Kálium a kezelés kezdetén, egy hét múlva, majd rendszeresen","Kreatinin és eGFR"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A hormonális mellékhatás ritkasága nem jelenti, hogy a káliumkockázat is kisebb — az ugyanakkora, és ugyanúgy ellenőrizni kell","Drágább a spironolaktonnál, ezért jellemzően akkor választják, ha az utóbbi hormonális mellékhatás miatt nem folytatható"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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
-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A vízhajtó csoport teljes tartalma. Hat hatóanyagnak kell megjelennie,
-- három alcsoportban.
select g.name as alcsoport, s.name as hatoanyag, s.atc
from public.drug_substances s
join public.drug_groups g on g.id = s.group_id
join public.drug_groups p on p.id = g.parent_id
where p.slug = 'vizhajtok' and s.publish_status = 'published'
order by g.ord, s.name;
