-- APN-MED — Gyógyszertár bővítés, első kör: szív- és érrendszer, véralvadás.
--
-- Tizenöt új hatóanyag, négy új alcsoport. A meglévő tartalom változatlan marad.
--
-- A szerkezet a megbeszélt szerint: egy „Szív- és érrendszer" főcsoport,
-- hatásmód szerinti alcsoportokkal — nem külön „vérnyomáscsökkentő" és
-- „szívelégtelenség" főcsoport, mert a két lista erősen átfedne, és ugyanaz a
-- hatóanyag két helyen előbb-utóbb szétcsúszna.
--
-- Az adatlapok a kért APN-szemléletet követik: az ellenőrzési pontok mellett a
-- betegoktatási és adherencia-szempontok is az apn_focus mezőben szerepelnek,
-- a monitoring pedig konkrét laborértékeket sorol.
--
-- Adagolás továbbra sincs: az az alkalmazási előírás dolga.
--
-- Előfeltétel: a 0065, 0066, 0069 és 0072 lefutott.

-- ══ Új alcsoportok ═══════════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'kalciumcsatorna-blokkolok', 'Kalciumcsatorna-blokkolók', 'C08', p.id, 'Amlodipin',
  'Értágító hatású vérnyomáscsökkentők. Az ACE-gátlók és szartánok mellett az első vonal része, és jól kombinálhatók velük.', 'A név a hatásmódot írja le: a szer az érfal simaizomsejtjeibe belépő kalcium útját zárja el. Kalcium nélkül az izom nem tud összehúzódni, ezért az ér tágul, és a vérnyomás csökken. A szívre ható változat a szívizom összehúzódását és a szívfrekvenciát is befolyásolja — az itt szereplő szer nem ilyen.',
  '{"A bokaduzzanat a leggyakoribb ok, amiért abbahagyják — nem allergia és nem szívelégtelenség, hanem a szer értágító hatásának következménye.","Nem befolyásolják a vesefunkciót és a káliumszintet, ezért vesebetegnél is biztonságosak.","A grépfrútlé emeli a vérszintjüket, ami fokozott vérnyomáseséshez vezethet."}', '{"A bokaduzzanat okának elmagyarázása és a felpolcolás javaslata","A grépfrútlé kerülésének megbeszélése","Vérnyomás otthoni mérésének megtanítása"}', 4, 'published'
from public.drug_groups p where p.slug = 'kardiovaszkularis'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'sziv-celzott', 'Szívelégtelenség célzott kezelése', 'C09DX', p.id, 'Sacubitril/valzartán',
  'A csökkent ejekciós frakciójú szívelégtelenség alapkezelésének része, az ACE-gátló helyett.', 'Kettős hatású készítmény: az egyik összetevő a szívvédő természetes peptidek lebontását gátolja, a másik a szűkítő hatású rendszert blokkolja. A két hatás együtt csökkenti a szív terhelését.',
  '{"ACE-gátlóról váltva kötelező a szünet a két szer között, mert az együttadás életveszélyes arcduzzanatot okozhat.","A 2026-os irányelv szerint az ACE-gátlót szedő, tünetes betegnél a váltás javasolt.","A kezdeti vérnyomásesés gyakori, és nem ok a leállításra."}', '{"A váltás előtti szünet betartásának ellenőrzése","Vérnyomás, kálium és vesefunkció követése","Az arcduzzanat jeleinek ismertetése a beteggel"}', 5, 'published'
from public.drug_groups p where p.slug = 'kardiovaszkularis'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'sglt2-kardio', 'SGLT2-gátlók', 'A10BK', p.id, 'Dapagliflozin, empagliflozin',
  'Eredetileg cukorbetegség elleni szerek, de a szívelégtelenség és a krónikus vesebetegség kezelésében is alapszerré váltak, a vércukortól függetlenül.', 'A név a vesében lévő cukorszállítót jelöli, amit a szer gátol. A cukor így a vizelettel távozik. A szív- és vesevédő hatás viszont ettől részben független — ezért adják cukorbetegség nélkül is.',
  '{"A 2026-os irányelv szerint mindkét szívelégtelenség-fenotípus alapkezelésének része — a csökkent és a megtartott ejekciós frakciójúé is.","A kezelés kezdetén átmeneti kreatinin-emelkedés várható; ez nem vesekárosodás, és nem ok a leállításra.","Ritka, de súlyos szövődmény a normál vércukorral járó ketoacidózis — műtét, éhezés vagy súlyos betegség mellett a kockázat nő."}', '{"Vesefunkció és folyadékállapot követése","A genitális gombás fertőzés megelőzésének megbeszélése","Betegnapok rendje: akut betegségnél a szer szüneteltetése","A ketoacidózis tüneteinek ismertetése: hányinger, hasi fájdalom, szapora légzés — normál vércukor mellett is"}', 6, 'published'
from public.drug_groups p where p.slug = 'kardiovaszkularis'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'thrombocyta-gatlok', 'Thrombocytaaggregáció-gátlók', 'B01AC', p.id, 'Acetilszalicilsav, klopidogrél, prazugrél, tikagrelor',
  'Az artériás érelzáródás megelőzésére: szívinfarktus, stroke, érbeavatkozás után.', 'A vérlemezkék összecsapzódását gátolják. Nem alvadásgátlók: az alvadási fehérjékre nem hatnak, hanem a vérlemezkék működésére. Ezért a hatásukat az alvadási értékek nem mutatják.',
  '{"Nem azonosak az alvadásgátlókkal: az INR nem mutatja a hatásukat, és a két csoport javallata is eltér — az artériás elzáródásra ezek valók, a vénásra és a pitvarfibrillációra az alvadásgátlók.","A kettős gátlás időtartama meghatározott, és a lejárta után egy szerre kell váltani — a fölöslegesen folytatott kettős kezelés vérzést okoz.","Műtét előtti szüneteltetés kérdése minden betegnél felmerül, és a döntés a beavatkozás és a szív kockázatának mérlegelésén alapul."}', '{"A kettős gátlás lejárati idejének nyilvántartása","Vérzésjelek keresése: melaena, véres vizelet, bőrvérzések","A gyulladáscsökkentők együttes szedésének felmérése","Műtét vagy fogászati beavatkozás előtti egyeztetés"}', 4, 'published'
from public.drug_groups p where p.slug = 'veralvadas'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

-- ══ Hatóanyagok ══════════════════════════════════════════
-- ── Lizinopril ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'lisinopril', 'Lizinopril', 'Lisinopril', 'C09AA03', g.id,
  'Gátolja azt az enzimet, amely az érszűkítő hatású anyagot előállítja. Így az erek tágulnak, a vérnyomás csökken, és a szív terhelése mérséklődik. A vese kisereire gyakorolt hatása miatt a fehérjevizelést is csökkenti.', '{"Magas vérnyomás","Szívelégtelenség","Szívinfarktus utáni kezelés","Diabéteszes vesebetegség"}', '{"Korábbi ACE-gátló okozta arcduzzanat","Terhesség","Kétoldali vese-artéria szűkület","Súlyos veseelégtelenség — mérlegelendő"}',
  '{"Vesefunkció és kálium ellenőrzése a kezelés indítása után egy-két héttel, majd adagemelésenként","A kreatinin átmeneti, legfeljebb harminc százalékos emelkedése elfogadható — nem ok a leállításra","A száraz köhögés a leggyakoribb ok, amiért abbahagyják: gyakran csak hetekkel később jelentkezik, és a beteg nem hozza összefüggésbe a szerrel","Az arcduzzanat ismertetése: az ajak, a nyelv és a torok duzzanata azonnali ellátást igényel, és évekkel a kezelés kezdete után is jelentkezhet","Betegnapok rendje: hányás, hasmenés vagy láz esetén a szer átmeneti szüneteltetése megelőzi az akut vesekárosodást","Az első adag után vérnyomásesés lehet, ezért az első bevétel lefekvés előtt javasolt"}', '{"Száraz, ingerlő köhögés","Vérnyomásesés, szédülés","Magas káliumszint","Vesefunkció-romlás","Arcduzzanat — ritka"}', '{"Kálium-megtakarító vízhajtó, káliumpótlás: magas káliumszint kockázata","Gyulladáscsökkentők: vesekárosodás, a hatás csökkenése","Vízhajtó: fokozott vérnyomásesés az első adagnál","Lítium: a szintje emelkedhet"}',
  'Vesén át ürül; veseelégtelenségben az adag csökkentése szükséges. A kétoldali vese-artéria szűkület ellenjavallat.', '{"Kreatinin és eGFR","Szérumkálium","Vérnyomás"}', 'Terhességben ellenjavallt — magzati károsodást okoz. Fogamzóképes korban a fogamzásgátlás kérdése megbeszélendő.',
  '{"A száraz köhögést gyakran nem kötik a szerhez, mert hetekkel később kezdődik — ilyenkor szartánra váltás jön szóba, ami nem okoz köhögést","Az arcduzzanat évekkel a kezelés kezdete után is jelentkezhet, és nem allergiás eredetű: az antihisztamin és a szteroid hatástalan lehet rá","A gyulladáscsökkentővel és vízhajtóval alkotott hármas a vese számára a legveszélyesebb kombináció"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Lozartán ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'losartan', 'Lozartán', 'Losartan', 'C09CA01', g.id,
  'Az érszűkítő anyag receptorát blokkolja, nem az előállítását. A végeredmény hasonló az ACE-gátlóéhoz, de mivel az enzimet nem érinti, nem okoz száraz köhögést.', '{"Magas vérnyomás","Szívelégtelenség","Diabéteszes vesebetegség","Bal kamrai megnagyobbodás"}', '{"Terhesség","Kétoldali vese-artéria szűkület","Súlyos májelégtelenség"}',
  '{"Akkor a választandó szer, ha az ACE-gátlót köhögés miatt nem tolerálja a beteg","ACE-gátlóval együtt nem adható: a kettő kombinációja nem javítja a kimenetelt, viszont a vesekárosodás és a magas kálium kockázatát növeli","Vesefunkció és kálium ellenőrzése az indítás és az adagemelés után","Húgysavszintet is csökkenti — köszvényes betegnél ez előny lehet","Betegnapok rendje ugyanaz, mint az ACE-gátlónál"}', '{"Vérnyomásesés, szédülés","Magas káliumszint","Vesefunkció-romlás","Arcduzzanat — az ACE-gátlónál ritkábban"}', '{"Kálium-megtakarító vízhajtó, káliumpótlás: magas káliumszint","Gyulladáscsökkentők: vesekárosodás","ACE-gátló: együttadásuk nem javasolt","Lítium: a szintje emelkedhet"}',
  'Májon át bomlik le; súlyos májelégtelenségben ellenjavallt. Veseelégtelenségben óvatosan.', '{"Kreatinin és eGFR","Szérumkálium","Vérnyomás"}', 'Terhességben ellenjavallt.',
  '{"Az ACE-gátlóval való együttadás gyakori hiba: a kettős blokkolás nem javítja a kimenetelt, viszont árt","A köhögés hiánya miatt a beteg úgy érezheti, hogy ez „gyengébb\" szer — a hatékonyságuk viszont hasonló"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Valzartán (szartán) ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'valsartan', 'Valzartán (szartán)', 'Valsartan', 'C09CA03', g.id,
  'Az érszűkítő anyag receptorát blokkolja. Hatása és javallatai a többi szartánéhoz hasonlóak.', '{"Magas vérnyomás","Szívelégtelenség","Szívinfarktus utáni kezelés"}', '{"Terhesség","Súlyos májelégtelenség","Kétoldali vese-artéria szűkület"}',
  '{"A sacubitril/valzartán kombináció egyik összetevője — a kettő együtt nem adható, és a váltásnál ezt tisztázni kell","Vesefunkció és kálium követése","ACE-gátlóval együtt nem adható","Vérnyomás otthoni mérésének megtanítása"}', '{"Vérnyomásesés","Magas káliumszint","Vesefunkció-romlás","Szédülés"}', '{"Kálium-megtakarító vízhajtó: magas káliumszint","Gyulladáscsökkentők: vesekárosodás","ACE-gátló és sacubitril/valzartán: együttadásuk tilos"}',
  'Máj- és veseelégtelenségben adagmódosítás szükséges.', '{"Kreatinin és eGFR","Szérumkálium","Vérnyomás"}', 'Terhességben ellenjavallt.',
  '{"A sacubitril/valzartán készítményre váltásnál az önálló valzartánt el kell hagyni — a kettő ugyanazt a hatóanyagot tartalmazza"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Kandezartán ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'candesartan', 'Kandezartán', 'Candesartan', 'C09CA06', g.id,
  'Szartán, erős és tartós receptorkötődéssel — ezért napi egyszeri adagolás mellett is egyenletes hatást ad.', '{"Magas vérnyomás","Szívelégtelenség"}', '{"Terhesség","Súlyos májelégtelenség","Kétoldali vese-artéria szűkület"}',
  '{"Szívelégtelenségben az egyik legjobban vizsgált szartán","Vesefunkció és kálium követése az indítás és adagemelés után","A napi egyszeri adagolás segíti a beteg-együttműködést","Betegnapok rendje: akut betegségnél átmeneti szüneteltetés"}', '{"Vérnyomásesés","Magas káliumszint","Vesefunkció-romlás"}', '{"Kálium-megtakarító vízhajtó: magas káliumszint","Gyulladáscsökkentők: vesekárosodás","ACE-gátló: együttadásuk nem javasolt"}',
  'Máj- és veseelégtelenségben óvatosan.', '{"Kreatinin és eGFR","Szérumkálium","Vérnyomás"}', 'Terhességben ellenjavallt.',
  '{"A szartánok közötti váltásnál az adagok nem egyenértékűek — az átváltás orvosi döntés"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Karvedilol (béta-blokkoló) ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'carvedilol', 'Karvedilol (béta-blokkoló)', 'Carvedilol', 'C07AG02', g.id,
  'Béta-blokkoló, amely az érfal alfa-receptorait is blokkolja — ezért a szívfrekvencia csökkentése mellett értágító hatása is van.', '{"Szívelégtelenség","Magas vérnyomás","Szívinfarktus utáni kezelés"}', '{"Asztma","Súlyos ingervezetési zavar","Dekompenzált szívelégtelenség","Súlyos májelégtelenség"}',
  '{"Szívelégtelenségben az alapkezelés része — a 2026-os irányelv szerint mindkét fenotípusnál mérlegelendő","A kezelés kezdetén a tünetek átmenetileg romolhatnak: ez várható, és nem ok a leállításra — a betegnek ezt előre tudnia kell","Étkezés közben bevéve lassabban szívódik fel, ami csökkenti a vérnyomásesést","Vérnyomás és pulzus mérése otthon, a napló vezetésének megtanítása","Cukorbetegnél elfedheti a vércukoresés tüneteit — a remegést és a szapora szívverést, de az izzadást nem","A hirtelen elhagyás veszélyes: szívfrekvencia-emelkedést és mellkasi fájdalmat okozhat"}', '{"Szédülés, fáradtság, különösen a kezelés kezdetén","Lassú szívverés","Vérnyomásesés","Hörgőgörcs asztmásoknál","Testsúlygyarapodás a kezelés kezdetén — folyadékgyűlés"}', '{"Kalciumcsatorna-blokkolók egyes típusai: súlyos bradycardia","Inzulin és vércukorcsökkentők: a hypoglykaemia tünetei elfedődhetnek","Digoxin: a szintje emelkedhet"}',
  'Májon át bomlik le; súlyos májelégtelenségben ellenjavallt. A vese kevésbé érintett, ezért vesebetegnél előnyös lehet.', '{"Vérnyomás és pulzus","Testsúly","Vércukor cukorbetegnél"}', 'Terhességben csak egyértelmű javallat esetén.',
  '{"A kezdeti tünetromlást gyakran a szer hatástalanságának tulajdonítják, pedig ez a beállítás természetes szakasza — az abbahagyás viszont elveszi a hosszú távú előnyt","A hirtelen elhagyás veszélyesebb, mint a folytatás: a szervezet érzékenyebbé válik, és ez ritmuszavart vagy mellkasi fájdalmat válthat ki"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Amlodipin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'amlodipin', 'Amlodipin', 'Amlodipine', 'C08CA01', g.id,
  'Az érfal simaizomsejtjeibe belépő kalcium útját zárja el, ezért az erek tágulnak. A szívre gyakorolt hatása csekély, így a szívfrekvenciát nem lassítja.', '{"Magas vérnyomás","Stabil angina"}', '{"Súlyos vérnyomásesés","Dekompenzált szívelégtelenség","Szívinfarktus utáni első napok"}',
  '{"A bokaduzzanat a leggyakoribb ok, amiért abbahagyják — nem allergia és nem szívelégtelenség, hanem a szer értágító hatásának következménye; a felpolcolás és az adagcsökkentés segít","Nem befolyásolja a vesefunkciót és a káliumszintet, ezért vesebetegnél is biztonságos","A grépfrútlé emeli a vérszintjét: erős vérnyomásesést okozhat","Hosszú felezési ideje miatt a hatás fokozatosan alakul ki — a beteg ne várjon azonnali változást","Az ínyduzzanat ritka, de zavaró mellékhatás; a szájhigiénia javítása segít"}', '{"Bokaduzzanat","Fejfájás, kipirulás","Szédülés","Ínyduzzanat — ritka"}', '{"Grépfrútlé: emeli a vérszintjét","Simvastatin: a nagyobb adagok kockázata nő","Erős enzimgátlók: a szintje emelkedik"}',
  'Májon át bomlik le; májelégtelenségben óvatosan. Vesebetegnél adagmódosítás jellemzően nem szükséges.', '{"Vérnyomás","Bokaduzzanat mértéke"}', 'Terhességben csak egyértelmű javallat esetén; a magas vérnyomás kezelésére terhességben más szerek az elsődlegesek.',
  '{"A bokaduzzanatot gyakran vízhajtóval próbálják kezelni, ami hatástalan: a duzzanat nem folyadéktöbbletből ered, hanem az erek tágulásából","Simvastatinnal együtt a statin adagja korlátozott"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'kalciumcsatorna-blokkolok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Sacubitril/valzartán ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'sacubitril-valsartan', 'Sacubitril/valzartán', 'Sacubitril/valsartan', 'C09DX04', g.id,
  'Két hatóanyag együtt: az egyik a szívvédő természetes peptidek lebontását gátolja, ezért azok tovább fejtik ki értágító és vízhajtó hatásukat; a másik az érszűkítő rendszert blokkolja. A kettő együtt csökkenti a szív terhelését.', '{"Csökkent ejekciós frakciójú szívelégtelenség"}', '{"ACE-gátlóval együtt adva","Korábbi arcduzzanat ACE-gátlóra vagy szartánra","Terhesség","Súlyos májelégtelenség"}',
  '{"ACE-gátlóról váltva kötelező a szünet a két szer között — az együttadás életveszélyes arcduzzanatot okozhat; ennek betartása ellenőrizendő","Szartánról váltva nincs szükség szünetre, de az önálló szartánt el kell hagyni","A kezdeti vérnyomásesés gyakori, és nem ok a leállításra — a beteget erre fel kell készíteni","Vérnyomás, kálium és vesefunkció követése az indítás és minden adagemelés után","A 2026-os irányelv szerint az ACE-gátlót szedő tünetes betegnél a váltás javasolt — érdemes átnézni, kinél merül fel","Az arcduzzanat jeleinek ismertetése: ajak, nyelv, torok duzzanata azonnali ellátást igényel"}', '{"Vérnyomásesés","Magas káliumszint","Vesefunkció-romlás","Szédülés","Arcduzzanat — ritka, de súlyos"}', '{"ACE-gátló: együttadásuk tilos, és váltásnál szünet szükséges","Szartán: együttadásuk tilos","Kálium-megtakarító vízhajtó: magas káliumszint","Gyulladáscsökkentők: vesekárosodás"}',
  'Máj- és veseelégtelenségben adagmódosítás szükséges; súlyos májelégtelenségben ellenjavallt.', '{"Vérnyomás","Szérumkálium","Kreatinin és eGFR","Natriuretikus peptid — de a szer megemeli az egyik típusát, ezért a követéshez a másik típus alkalmas"}', 'Terhességben ellenjavallt.',
  '{"Az ACE-gátlóról váltásnál a szünet elmulasztása a legsúlyosabb hiba, amit ezzel a szerrel el lehet követni","A szer megemeli az egyik natriuretikus peptid szintjét, ezért az az érték a kezelés követésére nem alkalmas — a másik típust kell mérni"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'sziv-celzott'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Dapagliflozin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'dapagliflozin', 'Dapagliflozin', 'Dapagliflozin', 'A10BK01', g.id,
  'A vesében gátolja a cukor visszaszívását, ezért a cukor a vizelettel távozik. A szív- és vesevédő hatás ettől részben független: a vese sóérzékelő működésére és a szív anyagcseréjére gyakorolt hatásból ered — ezért cukorbetegség nélkül is hatékony.', '{"Szívelégtelenség — mindkét fenotípusnál","Krónikus vesebetegség","2-es típusú cukorbetegség"}', '{"1-es típusú cukorbetegség — mérlegelendő","Terhesség és szoptatás","Súlyos veseelégtelenség — a cukorcsökkentő hatás elmarad"}',
  '{"A kezelés kezdetén átmeneti kreatinin-emelkedés várható — ez nem vesekárosodás, hanem a vese nyomásviszonyainak rendeződése, és nem ok a leállításra","Folyadékállapot és vérnyomás követése: a szer enyhe vízhajtó hatású, ezért a vízhajtó adagja módosítást igényelhet","Genitális gombás fertőzés a leggyakoribb mellékhatás — a megelőzés és a higiénia megbeszélése a kezelés indításakor megelőzi az abbahagyást","Betegnapok rendje: akut betegség, hányás, hasmenés, éhezés vagy műtét előtt a szer szüneteltetendő","A ketoacidózis tüneteinek ismertetése: hányinger, hasi fájdalom, szapora légzés, szokatlan fáradtság — normál vércukor mellett is előfordulhat","Cukorbetegség nélkül is adható szívelégtelenségre: a beteg ezt gyakran nem érti, és fölöslegesnek gondolja"}', '{"Genitális gombás fertőzés","Húgyúti fertőzés","Folyadékvesztés, vérnyomásesés","Normál vércukorral járó ketoacidózis — ritka, de súlyos"}', '{"Vízhajtók: fokozott folyadékvesztés","Inzulin és szulfonilureák: vércukoresés kockázata nő"}',
  'Veseelégtelenségben a vércukorcsökkentő hatás csökken, de a szív- és vesevédő hatás alacsonyabb szűrési értéknél is megmarad.', '{"Kreatinin és eGFR","Folyadékállapot és testsúly","Vérnyomás","Vércukor cukorbetegnél"}', 'Terhességben és szoptatás alatt nem javasolt.',
  '{"A kezdeti kreatinin-emelkedést gyakran vesekárosodásnak veszik, és leállítják a szert — pedig ez várható jelenség, és a hosszú távú vesevédelem épp ezzel jár együtt","A normál vércukorral járó ketoacidózis megtévesztő: a vércukor nem emelkedett, ezért a diagnózis késhet","A genitális fertőzés a leggyakoribb ok az abbahagyásra, pedig megelőzhető és kezelhető"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'sglt2-kardio'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Empagliflozin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'empagliflozin', 'Empagliflozin', 'Empagliflozin', 'A10BK03', g.id,
  'Ugyanaz a hatásmód, mint a dapagliflozinnál: a vesében gátolja a cukor visszaszívását, és ettől részben független szív- és vesevédő hatása van.', '{"Szívelégtelenség — mindkét fenotípusnál","Krónikus vesebetegség","2-es típusú cukorbetegség"}', '{"Terhesség és szoptatás","1-es típusú cukorbetegség — mérlegelendő"}',
  '{"Az APN-teendők azonosak a dapagliflozinéval: folyadékállapot, vesefunkció, genitális fertőzés, betegnapok rendje","A kezdeti kreatinin-emelkedés itt is várható, és nem ok a leállításra","Szívelégtelenségben a beállítás korán megtörténhet, nem kell megvárni a többi szer maximális adagját"}', '{"Genitális gombás fertőzés","Húgyúti fertőzés","Folyadékvesztés","Ketoacidózis — ritka"}', '{"Vízhajtók: fokozott folyadékvesztés","Inzulin és szulfonilureák: vércukoresés kockázata nő"}',
  'Veseelégtelenségben a cukorcsökkentő hatás csökken, a szervvédő hatás megmarad.', '{"Kreatinin és eGFR","Folyadékállapot","Vérnyomás","Vércukor"}', 'Terhességben és szoptatás alatt nem javasolt.',
  '{"A két SGLT2-gátló nem cserélhető fel automatikusan: a javallatok és a vizsgálati adatok részben eltérnek"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'sglt2-kardio'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Acetilszalicilsav ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'acetilszalicilsav', 'Acetilszalicilsav', 'Acetylsalicylic acid', 'B01AC06', g.id,
  'Visszafordíthatatlanul gátolja a vérlemezkék egyik enzimét, ezért a hatás a vérlemezke teljes élettartamára szól — körülbelül egy hétre. Az új vérlemezkék képződésével áll helyre az alvadás.', '{"Szívinfarktus és stroke másodlagos megelőzése","Akut koronária szindróma","Érbeavatkozás utáni kezelés"}', '{"Aktív vérzés","Aszpirin okozta asztma","Súlyos májelégtelenség","Gyermekkori lázas betegség"}',
  '{"A vérlemezke-gátló hatás a szer élettartamánál tovább tart: a beadás megszüntetése után körülbelül egy hét, amíg az alvadás helyreáll","Az ibuprofén gátolhatja a védőhatást, ha közvetlenül előtte veszik be — az időzítés számít","Vérzésjelek keresése: melaena, véres hányás, szokatlan bőrvérzések","Gyomorvédelem szükségességének felvetése kockázatos betegnél","Az elsődleges megelőzésben a haszon és a vérzési kockázat aránya kedvezőtlen — ma már nem javasolt rutinszerűen egészséges embernek"}', '{"Gyomorpanasz, fekély, vérzés","Bőrvérzések","Hörgőgörcs érzékenyeknél"}', '{"Alvadásgátlók: fokozott vérzési kockázat","Ibuprofén: gátolhatja a vérlemezke-gátló hatást","Egyéb thrombocytagátlók: együtt csak meghatározott ideig"}',
  'Súlyos vese- és májelégtelenségben óvatosan.', '{"Vérkép — vérszegénység keresése","Vérzésjelek"}', 'A terhesség utolsó harmadában kerülendő; kis adagban meghatározott javallattal adható.',
  '{"Az elsődleges megelőzésben — szívbetegség nélkül — a vérzési kockázat meghaladja a hasznot; ez a szemlélet az elmúlt években változott meg, és sok beteg fölöslegesen szedi","A műtét előtti elhagyás nem minden esetben indokolt: érbeavatkozás után a folytatás gyakran fontosabb"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'thrombocyta-gatlok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Klopidogrél ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'clopidogrel', 'Klopidogrél', 'Clopidogrel', 'B01AC04', g.id,
  'A vérlemezkék egyik receptorát blokkolja visszafordíthatatlanul. Előanyag: a szervezetnek kell hatóanyaggá alakítania, és ezt részben ugyanaz az enzimrendszer végzi, amely egyes gyógyszerek lebontásáért felel.', '{"Érbeavatkozás utáni kettős gátlás","Szívinfarktus és stroke másodlagos megelőzése","Perifériás érbetegség"}', '{"Aktív vérzés","Súlyos májelégtelenség"}',
  '{"Előanyag: a hatás egyénenként eltér, mert az átalakítás enzimfüggő — a lassú átalakítóknál a védőhatás gyengébb lehet","A savcsökkentők egy része gátolja ezt az átalakítást; ha savcsökkentő kell, a kevésbé gátló szer választása javasolt","A kettős gátlás időtartamának nyilvántartása: a lejárta után egy szerre kell váltani","Vérzésjelek keresése és a gyulladáscsökkentők együttes szedésének felmérése","A hirtelen elhagyás érbeavatkozás után trombózist okozhat — a szüneteltetés mindig orvosi döntés"}', '{"Vérzés","Bőrvérzések","Hasi panasz","Ritkán vérképzavar"}', '{"Egyes savcsökkentők: gátolják a hatóanyaggá alakítást","Alvadásgátlók: fokozott vérzési kockázat","Gyulladáscsökkentők: fokozott vérzés"}',
  'Májon át alakul hatóanyaggá; súlyos májelégtelenségben ellenjavallt.', '{"Vérkép","Vérzésjelek"}', 'Terhességben csak egyértelmű javallat esetén.',
  '{"A savcsökkentővel való kölcsönhatás gyakori és könnyen elkerülhető: a gyógyszerlista átnézésével kiszűrhető","Az érbeavatkozás utáni hirtelen elhagyás trombózist okozhat a behelyezett eszközben — ez életveszélyes"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'thrombocyta-gatlok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Prazugrél ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'prasugrel', 'Prazugrél', 'Prasugrel', 'B01AC22', g.id,
  'Ugyanazt a receptort blokkolja, mint a klopidogrél, de gyorsabban és erősebben — az átalakítása kevésbé függ az enzimrendszertől.', '{"Akut koronária szindróma érbeavatkozással"}', '{"Korábbi stroke vagy átmeneti ischaemiás roham","Aktív vérzés","Súlyos májelégtelenség"}',
  '{"Korábbi stroke esetén ellenjavallt: náluk a koponyaűri vérzés kockázata meghaladja a hasznot","Idős és alacsony testsúlyú betegnél fokozott vérzési kockázat","Erősebb hatás, erősebb vérzési kockázat — a vérzésjelek keresése hangsúlyos","A kettős gátlás időtartamának nyilvántartása","Műtét előtti szüneteltetés hosszabb időt igényel, mint a klopidogrélnél"}', '{"Vérzés — a klopidogrélnél gyakoribb","Bőrvérzések","Vérszegénység"}', '{"Alvadásgátlók: jelentősen fokozott vérzési kockázat","Gyulladáscsökkentők: fokozott vérzés"}',
  'Súlyos májelégtelenségben ellenjavallt.', '{"Vérkép","Vérzésjelek"}', 'Terhességben nem javasolt.',
  '{"A korábbi stroke ellenjavallat, és ezt az anamnézisben kifejezetten meg kell kérdezni — a beteg nem feltétlenül említi magától"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'thrombocyta-gatlok'
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
select 'ticagrelor', 'Tikagrelor', 'Ticagrelor', 'B01AC24', g.id,
  'Ugyanazt a receptort blokkolja, de visszafordíthatóan — ezért a hatása gyorsabban szűnik meg az elhagyás után. Nem előanyag: közvetlenül hat.', '{"Akut koronária szindróma","Szívinfarktus utáni hosszabb távú kezelés"}', '{"Aktív vérzés","Korábbi koponyaűri vérzés","Súlyos májelégtelenség"}',
  '{"Naponta kétszer szedendő — ez a beteg-együttműködés szempontjából hátrány a napi egyszeri szerekhez képest, és a kihagyott adag gyorsan csökkenti a védettséget","A nehézlégzés gyakori mellékhatás, és nem szívelégtelenség jele: jellemzően a kezelés kezdetén jelentkezik, és magától enyhül — de a beteget fel kell rá készíteni, különben abbahagyja","Vérzésjelek keresése","A hatás gyorsabban szűnik, ezért a műtét előtti szüneteltetés rövidebb","A kettős gátlás időtartamának nyilvántartása"}', '{"Nehézlégzés — gyakori, jellemzően enyhe","Vérzés","Lassú szívverés a kezelés kezdetén","Húgysav-emelkedés"}', '{"Erős enzimgátlók és -serkentők: a szintjét jelentősen befolyásolják","Alvadásgátlók: fokozott vérzés","Nagy adagú acetilszalicilsav: csökkenti a hatékonyságát"}',
  'Májon át bomlik le; súlyos májelégtelenségben ellenjavallt.', '{"Vérkép","Vérzésjelek","Húgysav tartós kezelésnél"}', 'Terhességben nem javasolt.',
  '{"A nehézlégzést gyakran szívelégtelenségnek vagy tüdőbetegségnek tulajdonítják, és fölösleges kivizsgálás indul — pedig a szer ismert mellékhatása","A napi kétszeri adagolás miatt a kihagyott adag gyakoribb, mint a napi egyszeri szereknél"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'thrombocyta-gatlok'
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
-- A szív- és érrendszer, valamint a véralvadás csoportjai a bővítés után.
select p.name as focsoport, g.name as alcsoport,
  count(s.id) as hatoanyag,
  string_agg(s.name, ', ' order by s.name) as hatoanyagok
from public.drug_groups g
join public.drug_groups p on p.id = g.parent_id
left join public.drug_substances s on s.group_id = g.id and s.publish_status = 'published'
where p.slug in ('kardiovaszkularis', 'veralvadas')
  and g.publish_status = 'published'
group by p.name, p.ord, g.name, g.ord
order by p.ord, g.ord;

-- A gyógyszertár teljes állománya.
select count(*) as osszes_hatoanyag from public.drug_substances
where publish_status = 'published';
