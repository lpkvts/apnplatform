-- APN-MED — Gyógyszertár bővítés, harmadik kör: légzőszervi, gasztrointesztinális,
-- neurológiai és pszichiátriai szerek.
--
-- Három új főcsoport, tíz alcsoport, huszonnyolc hatóanyag. Ezzel a gyógyszertár
-- eléri a tervezett méretet.
--
-- Két szempont, amit ennél a körnél külön figyeltem:
--
--   · a légzőszervi szereknél az inhalációs technika a legfontosabb ápolói téma.
--     A betegek jelentős része rosszul használja az eszközt, és ettől a szer
--     hatástalan marad — ez gyakoribb ok a panaszok fennmaradására, mint az
--     elégtelen adag;
--
--   · a nyugtatóknál a függőség és az elhagyás kérdése kimondva szerepel. Ezek a
--     szerek rövid távra készültek, a gyakorlatban viszont évekig szedik őket, és
--     a hirtelen elhagyás veszélyes.
--
-- Előfeltétel: a 0065, 0066, 0099 és 0100 lefutott.

-- ══ Főcsoportok ══════════════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, icon, publish_status)
values (
  'legzoszervi', 'Légzőszervi szerek', 'R03', null, 'Hörgtágítók, inhalációs szteroidok',
  'Belélegzett szerek a hörgők tágítására és a gyulladás csökkentésére.', 'Az asztma és a COPD kezelésének szerei. A csoport sajátossága, hogy szinte mindegyik belélegezve jut a szervezetbe — így kis mennyiség is elegendő, és a rendszerhatás minimális. Cserébe a bejutás az eszköz helyes használatán múlik.',
  '{"Az inhalációs technika a kezelés leggyengébb láncszeme: a betegek jelentős része rosszul használja az eszközt, és ettől a szer hatástalan marad.","Az asztma alapkezelése ma már minden betegnél tartalmaz gyulladáscsökkentőt — a csak hörgtágítóval kezelt asztma rosszabb kimenetelű.","A COPD és az asztma kezelése eltér: a szteroid szerepe és a kombinációk sorrendje nem ugyanaz."}', '{"Az inhalációs technika megnézése és javítása minden találkozáskor","A toldalék használatának javaslata porlasztós eszköznél","Szájöblítés inhalációs szteroid után","A rohamoldó használatának gyakorisága — a kontroll mutatója"}', 8, 'lungs', 'published'
)
on conflict (slug) do update set
  name = excluded.name, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  ord = excluded.ord, icon = excluded.icon,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, icon, publish_status)
values (
  'gasztro', 'Gasztrointesztinális szerek', 'A02', null, 'Savcsökkentők, hányáscsillapítók, bélműködés',
  'A leggyakrabban használt emésztőrendszeri szerek.', 'Az emésztőrendszer gyakori panaszaira ható szerek: a gyomorsav csökkentésétől a hányinger csillapításán át a bélműködés befolyásolásáig.',
  '{"A savcsökkentők tartós szedése gyakori és sokszor indokolatlan — a felülvizsgálat és a leépítés önálló feladat.","A hányinger okától függ, melyik csillapító hatékony: a mozgásbetegségre, a kemoterápiára és a bélelzáródásra más-más szer való.","A hashajtók közül a bélben vizet megkötő szerek a legbiztonságosabbak tartós használatra."}', '{"A savcsökkentő szükségességének felülvizsgálata tartós szedésnél","A hányinger okának tisztázása a szerválasztás előtt","A székrekedés nem gyógyszeres kezelésének megbeszélése"}', 9, 'flask', 'published'
)
on conflict (slug) do update set
  name = excluded.name, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  ord = excluded.ord, icon = excluded.icon,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, icon, publish_status)
values (
  'neuro-pszichiatria', 'Neurológiai és pszichiátriai szerek', 'N', null, 'Idegi fájdalom, antidepresszánsok, nyugtatók',
  'Az APN gyakorlatában leggyakrabban előforduló idegrendszeri és pszichiátriai szerek.', 'A központi idegrendszerre ható szerek. A csoport közös vonása, hogy a hatás lassan alakul ki, és az elhagyás sem lehet hirtelen — mindkettő fontos a beteg tájékoztatásában.',
  '{"Az antidepresszánsok hatása hetek alatt alakul ki — a korai abbahagyás a leggyakoribb ok, amiért a kezelés nem sikerül.","A nyugtatók rövid távra készültek, a gyakorlatban viszont gyakran évekig szedik őket; a hirtelen elhagyás veszélyes.","Idős betegnél ezek a szerek eséshez és zavartsághoz vezetnek — a gyógyszerlista felülvizsgálata ezért rendszeres feladat."}', '{"A hatás kialakulásának idejéről szóló tájékoztatás","Az elhagyás fokozatosságának megbeszélése","Esési kockázat felmérése idős betegnél","A hangulat és az öngyilkossági gondolatok figyelése a kezelés elején"}', 10, 'brain', 'published'
)
on conflict (slug) do update set
  name = excluded.name, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  ord = excluded.ord, icon = excluded.icon,
  publish_status = excluded.publish_status;

-- ══ Alcsoportok ══════════════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'rovid-hatoanyagu-horgtagitok', 'Rövid hatású hörgtágítók', 'R03A', p.id, 'Szalbutamol, ipratropium',
  'Gyors hatású rohamoldók.', 'Perceken belül hatnak, és néhány óráig tartanak. A rohamoldó szerepét töltik be: akkor kell használni őket, amikor a panasz jelentkezik.',
  '{"A használat gyakorisága a betegségkontroll legjobb mutatója: a heti kétszeri használatnál gyakoribb igény az alapkezelés felülvizsgálatát jelzi.","Rohamoldóval önmagában asztmát kezelni ma már nem elfogadott."}', '{"A használat gyakoriságának kérdezése és rögzítése","Az inhalációs technika ellenőrzése","A rohamoldó elérhetőségének biztosítása"}', 1, 'published'
from public.drug_groups p where p.slug = 'legzoszervi'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'hosszu-hatoanyagu-horgtagitok', 'Hosszú hatású hörgtágítók', 'R03AC', p.id, 'Formoterol, szalmeterol, tiotropium',
  'Tartós hatású szerek az alapkezeléshez.', 'Tizenkét–huszonnégy órán át hatnak, ezért az alapkezelés részei. Nem rohamoldók — a kivétel a formoterol, amely gyorsan is hat.',
  '{"Asztmában hosszú hatású hörgtágító önmagában, szteroid nélkül nem adható — ez súlyos rohamok kockázatát növeli.","A formoterol gyorsan is hat, ezért szteroiddal kombinálva rohamoldóként is használható."}', '{"Az önálló használat kizárása asztmában","A napi rendszeres bevétel hangsúlyozása"}', 2, 'published'
from public.drug_groups p where p.slug = 'legzoszervi'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'inhalacios-szteroidok', 'Inhalációs szteroidok', 'R03BA', p.id, 'Budeszonid, beklometazon, flutikazon',
  'Az asztma alapkezelésének gerince.', 'Belélegezve a hörgők nyálkahártyáján fejtik ki gyulladáscsökkentő hatásukat. A kis mennyiség és a helyi hatás miatt a szteroidok rendszerhatásai jóval enyhébbek, mint tablettában.',
  '{"A hatás napok–hetek alatt alakul ki: nem rohamoldó, és a beteg gyakran hagyja abba, mert „nem érzi\".","A szájöblítés a szájpenész megelőzésének legegyszerűbb módja."}', '{"A szájöblítés megtanítása","A hatás késleltetett kialakulásának magyarázata","A száj átnézése penész irányában"}', 3, 'published'
from public.drug_groups p where p.slug = 'legzoszervi'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'inhalacios-kombinaciok', 'Inhalációs kombinációk', 'R03AK', p.id, 'Budeszonid/formoterol, flutikazon/szalmeterol',
  'Két hatóanyag egy eszközben.', 'Szteroid és hosszú hatású hörgtágító egy eszközben. A kombináció javítja a beteg-együttműködést, és kizárja, hogy a hörgtágítót szteroid nélkül használják.',
  '{"A budeszonid/formoterol kombináció rohamoldóként és alapkezelésként is használható — ez egyszerűsíti a kezelést.","A kombináció kizárja a hosszú hatású hörgtágító önálló használatát, ami asztmában veszélyes."}', '{"A kettős szerepű használat rendjének tisztázása","Az inhalációs technika ellenőrzése","Szájöblítés a szteroid miatt"}', 4, 'published'
from public.drug_groups p where p.slug = 'legzoszervi'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'savcsokkentok', 'Savcsökkentők', 'A02BC', p.id, 'Pantoprazol, omeprazol, ezomeprazol, famotidin',
  'A gyomorsavval összefüggő panaszok kezelése.', 'A gyomorsav termelését gátolják: a protonpumpa-gátlók a sejtszintű savtermelést állítják le, a hisztamin-receptor-blokkolók pedig a savtermelés egyik serkentő jelét fogják el.',
  '{"A tartós szedés gyakran indokolatlanul folytatódik: a felülvizsgálat és a fokozatos leépítés önálló feladat.","A hirtelen elhagyás visszacsapó savtermelést okoz, ami visszahozza a panaszokat — ez nem a betegség kiújulása."}', '{"A szedés indokának és időtartamának tisztázása","A fokozatos leépítés megbeszélése","Magnézium és B12 ellenőrzése tartós szedésnél"}', 1, 'published'
from public.drug_groups p where p.slug = 'gasztro'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'hanyascsillapitok', 'Hányáscsillapítók', 'A04', p.id, 'Metoklopramid, ondanszetron',
  'A hányinger és hányás csillapítása.', 'A hányást kiváltó idegi jelátvitel különböző pontjain hatnak. Ezért nem cserélhetők fel: az ok határozza meg, melyik hatékony.',
  '{"Az ok dönti el a szerválasztást: a kemoterápiára, a mozgásbetegségre és a bélelzáródásra más-más szer való.","A metoklopramid mozgászavart okozhat, különösen fiatalnál és tartós szedésnél."}', '{"A hányinger okának tisztázása","Mozgászavar keresése metoklopramid mellett","A folyadékpótlás biztosítása"}', 2, 'published'
from public.drug_groups p where p.slug = 'gasztro'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'belmukodes', 'Bélműködést befolyásolók', 'A06', p.id, 'Loperamid, makrogol, biszakodil',
  'Hasmenés és székrekedés kezelése.', 'A bél mozgását és a széklet víztartalmát befolyásolják — az egyik irányban a hasmenés ellen, a másikban a székrekedés ellen.',
  '{"A hasmenés csillapítása nem minden esetben helyes: fertőzéses eredetnél a kórokozó bennmarad, és az állapot romolhat.","A vizet megkötő hashajtók a legbiztonságosabbak tartós használatra."}', '{"A hasmenés okának tisztázása a csillapítás előtt","A folyadékpótlás hangsúlyozása","A székrekedés nem gyógyszeres kezelésének megbeszélése"}', 3, 'published'
from public.drug_groups p where p.slug = 'gasztro'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'idegi-fajdalom', 'Idegi fájdalomra ható szerek', 'N03AX', p.id, 'Pregabalin, gabapentin, amitriptilin',
  'Az idegi eredetű fájdalom kezelése.', 'Eredetileg más javallatra készültek — epilepszia, depresszió —, de az idegi eredetű fájdalom kezelésében is hatékonyak. A szokásos fájdalomcsillapítók erre a fájdalomtípusra alig hatnak.',
  '{"Az idegi fájdalomra a szokásos fájdalomcsillapítók alig hatnak — ez a felismerés önmagában megváltoztatja a kezelést.","A hatás hetek alatt alakul ki, és a fokozatos adagemelés csökkenti a szédülést és az aluszékonyságot."}', '{"A fájdalom jellegének tisztázása: égő, szúró, áramütésszerű","Az esési kockázat felmérése idős betegnél","A hatás késleltetett kialakulásának magyarázata"}', 1, 'published'
from public.drug_groups p where p.slug = 'neuro-pszichiatria'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'antidepresszansok', 'Antidepresszánsok', 'N06A', p.id, 'Szertralin, escitaloprám, venlafaxin, duloxetin',
  'Depresszió, szorongás és idegi fájdalom kezelése.', 'Az idegsejtek közötti jelátvitelben részt vevő anyagok visszavételét gátolják, ezért azok tovább fejtik ki hatásukat. A hangulatra gyakorolt hatás hetek alatt alakul ki.',
  '{"A hatás két–négy hét alatt alakul ki: a korai abbahagyás a leggyakoribb ok, amiért a kezelés nem sikerül.","A kezelés első heteiben a szorongás átmenetileg fokozódhat, és fiatalnál az öngyilkossági gondolatok kockázata nő — ez szoros követést kíván.","A hirtelen elhagyás megvonásos tüneteket okoz: szédülést, áramütésszerű érzést, ingerlékenységet."}', '{"A hatás idejéről szóló tájékoztatás a kezelés kezdetén","A hangulat és az öngyilkossági gondolatok figyelése","A fokozatos elhagyás megbeszélése","Nátriumszint ellenőrzése idős betegnél"}', 2, 'published'
from public.drug_groups p where p.slug = 'neuro-pszichiatria'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'nyugtatok', 'Nyugtatók', 'N05B', p.id, 'Diazepám, alprazolám',
  'Szorongásoldó és nyugtató szerek, rövid távú használatra.', 'A központi idegrendszer gátló jelátvitelét erősítik, ezért szorongásoldó, izomlazító és altató hatásuk van. A megnevezés enyhébb, mint a hatás: ezek erős szerek, függőségi kockázattal.',
  '{"Rövid távra készültek — néhány hétre —, a gyakorlatban viszont gyakran évekig szedik őket.","A hirtelen elhagyás veszélyes: görcsrohamot okozhat; a leépítés mindig fokozatos.","Idős betegnél eséshez, zavartsághoz és kognitív romláshoz vezetnek."}', '{"A szedés időtartamának tisztázása","Esési kockázat felmérése idős betegnél","A fokozatos leépítés lehetőségének felvetése","Az alkohol és az opioidok együttes szedésének felmérése"}', 3, 'published'
from public.drug_groups p where p.slug = 'neuro-pszichiatria'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

-- ══ Hatóanyagok ══════════════════════════════════════════
-- ── Szalbutamol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'salbutamol', 'Szalbutamol', 'Salbutamol', 'R03AC02', g.id,
  'A hörgők simaizmának béta-receptorait izgatja, ezért a hörgők perceken belül tágulnak. A hatás négy-hat óráig tart.', '{"Asztmás roham","COPD fellángolása","Terhelés kiváltotta hörgőgörcs megelőzése"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"A használat gyakorisága a betegségkontroll legjobb mutatója: a heti kétszeri használatnál gyakoribb igény az alapkezelés felülvizsgálatát jelzi — ezt minden találkozáskor érdemes megkérdezni","Az inhalációs technika megnézése: a porlasztós eszköznél a lassú, mély belégzés és a tíz másodperces visszatartás elengedhetetlen; a toldalék használata jelentősen javítja a bejutást","A remegés és a szapora szívverés várható mellékhatás, nem allergia — a beteg előzetes tájékoztatása megelőzi a fölösleges riadalmat","Gyakori használat mellett a káliumszint csökkenhet","Az eszköz töltöttségének ellenőrzése: az üres inhalátor rohamban végzetes lehet"}', '{"Kézremegés","Szapora szívverés","Fejfájás","Izomgörcs","Alacsony káliumszint gyakori használatnál"}', '{"Béta-blokkolók: csökkentik vagy megszüntetik a hatását","Vízhajtók: a káliumcsökkenés összeadódik"}',
  'Máj- és veseelégtelenségben adagmódosítás jellemzően nem szükséges.', '{"A használat gyakorisága","Kálium gyakori használatnál","Pulzus"}', 'Terhességben adható; a rosszul kezelt asztma nagyobb kockázat, mint a szer.',
  '{"A rohamoldó gyakori használatát a betegek a betegség súlyosságának tulajdonítják, pedig az alapkezelés elégtelenségét jelzi","A béta-blokkoló szedése megszüntetheti a hatást — ez asztmásnál veszélyes kombináció","A rossz inhalációs technika gyakoribb ok a hatástalanságra, mint az elégtelen adag"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'rovid-hatoanyagu-horgtagitok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Ipratropium ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'ipratropium', 'Ipratropium', 'Ipratropium', 'R03BB01', g.id,
  'A hörgőszűkítő idegi jelátvitelt blokkolja. Lassabban hat, mint a béta-izgatók, de a hatás tartósabb.', '{"COPD fellángolása","Asztmás roham — kiegészítésként"}', '{"Zárt zugú zöldhályog — óvatosan","Prosztata-megnagyobbodás vizeletretencióval"}',
  '{"A szemre kerülve zöldhályogos rohamot válthat ki — porlasztásnál a szem védelme, maszkos adásnál a jó illeszkedés fontos","Szájszárazság a leggyakoribb mellékhatás","Vizeletretencióra hajlamos betegnél a panasz fokozódhat","Szalbutamollal együtt adva a hatásuk összeadódik"}', '{"Szájszárazság","Fémes íz","Vizeletretenció — hajlamos betegnél","Szemtünetek, ha a szerbe kerül"}', '{"Egyéb hasonló hatású szerek: a mellékhatások összeadódnak"}',
  'Belélegezve alig szívódik fel, ezért a szervi működés kevéssé befolyásolja.', '{"Vizeletürítés hajlamos betegnél"}', 'Terhességben adható.',
  '{"A porlasztás során a szembe kerülő szer zöldhályogos rohamot válthat ki — ez elkerülhető a maszk helyes illeszkedésével"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'rovid-hatoanyagu-horgtagitok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Tiotropium ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'tiotropium', 'Tiotropium', 'Tiotropium', 'R03BB04', g.id,
  'Ugyanazt az idegi jelátvitelt blokkolja, mint az ipratropium, de huszonnégy órán át hat.', '{"COPD alapkezelése","Súlyos asztma — kiegészítésként"}', '{"Zárt zugú zöldhályog — óvatosan","Vizeletretenció"}',
  '{"Napi egyszeri adagolás — nem rohamoldó, ezt a betegnek egyértelműen tudnia kell","A kapszulás eszköznél a kapszulát nem szabad lenyelni: ez gyakori hiba","Szájszárazság és vizeletretenció figyelése","A szembe kerülés kerülése"}', '{"Szájszárazság","Székrekedés","Vizeletretenció","Torokirritáció"}', '{"Egyéb hasonló hatású szerek: a mellékhatások összeadódnak"}',
  'Vesén át ürül; súlyos veseelégtelenségben óvatosan.', '{"Vizeletürítés","Az eszköz helyes használata"}', 'Terhességben csak egyértelmű javallat esetén.',
  '{"A kapszula lenyelése gyakori hiba: az eszközbe kell helyezni, és belélegezni","Rohamoldóként való használata hatástalan, és késlelteti a valódi ellátást"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'hosszu-hatoanyagu-horgtagitok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Formoterol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'formoterol', 'Formoterol', 'Formoterol', 'R03AC13', g.id,
  'Hosszú hatású béta-izgató, amely gyorsan is hat — ezért szteroiddal kombinálva rohamoldóként is használható.', '{"Asztma alapkezelése — szteroiddal kombinálva","COPD alapkezelése"}', '{"Asztmában szteroid nélkül, önmagában"}',
  '{"Asztmában önmagában, szteroid nélkül nem adható — ez súlyos rohamok kockázatát növeli, és ma már nem elfogadott gyakorlat","A gyors hatás miatt a kombinált készítmény rohamoldóként is használható: ez a rend tisztázandó a beteggel, mert eltér a megszokottól","Remegés és szapora szívverés várható mellékhatás"}', '{"Kézremegés","Szapora szívverés","Fejfájás","Alacsony káliumszint"}', '{"Béta-blokkolók: csökkentik a hatását","Vízhajtók: a káliumcsökkenés összeadódik"}',
  'Adagmódosítás jellemzően nem szükséges.', '{"A rohamoldó használatának gyakorisága","Kálium","Pulzus"}', 'Terhességben adható, ha indokolt.',
  '{"Az önálló, szteroid nélküli használat asztmában veszélyes — a kombinált készítmény ezt kizárja"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'hosszu-hatoanyagu-horgtagitok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Szalmeterol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'salmeterol', 'Szalmeterol', 'Salmeterol', 'R03AC12', g.id,
  'Hosszú hatású béta-izgató, lassú hatáskezdettel — ezért nem alkalmas rohamoldónak.', '{"Asztma alapkezelése — szteroiddal kombinálva","COPD alapkezelése"}', '{"Asztmában szteroid nélkül, önmagában","Akut roham kezelése"}',
  '{"Lassan hat, ezért rohamban hatástalan — a betegnek tudnia kell, hogy roham esetén a rövid hatású szert kell használnia","Asztmában önmagában nem adható","Napi kétszeri rendszeres bevétel"}', '{"Kézremegés","Szapora szívverés","Fejfájás"}', '{"Béta-blokkolók: csökkentik a hatását","Erős enzimgátlók: a szintje emelkedik"}',
  'Májon át bomlik le; súlyos májelégtelenségben óvatosan.', '{"A rohamoldó használatának gyakorisága","Pulzus"}', 'Terhességben adható, ha indokolt.',
  '{"Rohamban való használata késlelteti a hatékony ellátást — ez életveszélyes lehet"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'hosszu-hatoanyagu-horgtagitok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Budeszonid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'budesonid', 'Budeszonid', 'Budesonide', 'R03BA02', g.id,
  'Belélegezve a hörgők nyálkahártyáján csökkenti a gyulladást. A lenyelt rész nagy részét a máj lebontja, ezért a rendszerhatás csekély.', '{"Asztma alapkezelése","COPD — meghatározott esetekben"}', '{"Aktív légúti gombás fertőzés — kezelendő"}',
  '{"A szájöblítés a szájpenész megelőzésének legegyszerűbb módja: a beteg gyakran nem tudja, hogy ez szükséges, és a penész miatt hagyja abba","A hatás napok–hetek alatt alakul ki: nem rohamoldó, és a beteg gyakran abbahagyja, mert „nem érzi\" — ennek előzetes magyarázata megelőzi ezt","Az inhalációs technika megnézése és javítása","A rekedtség gyakori, és a technika javításával mérsékelhető","Gyermeknél a növekedés követése indokolt"}', '{"Szájpenész","Rekedtség","Torokirritáció","Rendszerhatás nagy adagban"}', '{"Erős enzimgátlók: a rendszerhatás nő"}',
  'Májon át bomlik le; súlyos májelégtelenségben a rendszerhatás nő.', '{"A száj átnézése penész irányában","Tünetkontroll","Növekedés gyermeknél"}', 'Terhességben adható; a rosszul kezelt asztma nagyobb kockázat.',
  '{"A „nem érzem, hogy hatna\" miatti abbahagyás a leggyakoribb hiba: a szteroid nem rohamoldó, a hatása a gyulladás csökkentésében áll","A szájöblítés elmaradása miatti penész gyakori ok az abbahagyásra, pedig egyszerűen megelőzhető"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'inhalacios-szteroidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Beklometazon ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'beclometason', 'Beklometazon', 'Beclometasone', 'R03BA01', g.id,
  'Inhalációs szteroid; a finom részecskéjű változat a kisebb hörgőkbe is eljut.', '{"Asztma alapkezelése"}', '{"Aktív légúti gombás fertőzés"}',
  '{"A csoport szempontjai azonosak: szájöblítés, technika, a hatás késleltetett kialakulása","A különböző készítmények adagjai nem egyenértékűek — a váltás orvosi döntés"}', '{"Szájpenész","Rekedtség","Torokirritáció"}', '{"Erős enzimgátlók: a rendszerhatás nő"}',
  'Májon át bomlik le.', '{"A száj átnézése","Tünetkontroll"}', 'Terhességben adható.',
  '{"A finom és a hagyományos részecskéjű készítmények adagjai eltérnek — a csere nem egy az egyben történik"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'inhalacios-szteroidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Flutikazon ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'fluticason', 'Flutikazon', 'Fluticasone', 'R03BA05', g.id,
  'Erős hatású inhalációs szteroid, hosszú helyi hatástartammal.', '{"Asztma alapkezelése","COPD — kombinációban"}', '{"Aktív légúti gombás fertőzés"}',
  '{"Erősebb szteroid, ezért nagy adagban a rendszerhatás is jelentősebb lehet: a mellékvesekéreg működése és a csontsűrűség figyelendő tartós, nagy adagú kezelésnél","A csoport többi szempontja azonos: szájöblítés, technika","Az erős enzimgátlókkal való kölcsönhatás itt a legjelentősebb"}', '{"Szájpenész","Rekedtség","Rendszerhatás nagy adagban: mellékvesekéreg-elnyomás"}', '{"Erős enzimgátlók: a rendszerhatás jelentősen nő — együttadásuk kerülendő"}',
  'Májon át bomlik le; májelégtelenségben a rendszerhatás nő.', '{"A száj átnézése","Tünetkontroll","Csontsűrűség tartós, nagy adagú kezelésnél"}', 'Terhességben adható, ha indokolt.',
  '{"Egyes gombaellenes és vírusellenes szerekkel együtt a rendszerhatás olyan mértékben nő, hogy szteroid-túlsúly alakulhat ki"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'inhalacios-szteroidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Budeszonid/formoterol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'budesonid-formoterol', 'Budeszonid/formoterol', 'Budesonide/formoterol', 'R03AK07', g.id,
  'Inhalációs szteroid és gyors hatású, hosszú hatástartamú hörgtágító egy eszközben.', '{"Asztma alapkezelése és rohamoldása","COPD alapkezelése"}', '{"Túlérzékenység az összetevőkre"}',
  '{"A kettős szerepű használat: ugyanaz az eszköz szolgál alapkezelésre és rohamoldásra — ez eltér a megszokottól, ezért a rendet egyértelműen tisztázni kell a beteggel","A napi maximális befújásszám ismerete fontos: a túllépés az alapkezelés elégtelenségét jelzi, és orvosi értékelést kíván","Szájöblítés a szteroid miatt","A kombináció kizárja, hogy a hörgtágítót szteroid nélkül használják"}', '{"Szájpenész","Rekedtség","Kézremegés","Szapora szívverés"}', '{"Béta-blokkolók: csökkentik a hörgtágító hatást","Erős enzimgátlók: a szteroid rendszerhatása nő"}',
  'Májon át bomlik le.', '{"A napi befújásszám","A száj átnézése","Tünetkontroll"}', 'Terhességben adható, ha indokolt.',
  '{"A kettős szerepű használat rendjének félreértése gyakori: van, aki csak alapkezelésként, van, aki csak rohamra használja — mindkettő rossz"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'inhalacios-kombinaciok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Flutikazon/szalmeterol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'fluticason-salmeterol', 'Flutikazon/szalmeterol', 'Fluticasone/salmeterol', 'R03AK06', g.id,
  'Inhalációs szteroid és lassú hatáskezdetű, hosszú hatású hörgtágító egy eszközben.', '{"Asztma alapkezelése","COPD alapkezelése"}', '{"Akut roham kezelése"}',
  '{"Nem alkalmas rohamoldásra: a szalmeterol lassan hat — roham esetén külön rövid hatású szer kell, és ennek elérhetőségét ellenőrizni kell","Napi kétszeri rendszeres bevétel","Szájöblítés a szteroid miatt"}', '{"Szájpenész","Rekedtség","Kézremegés"}', '{"Erős enzimgátlók: a szteroid rendszerhatása nő","Béta-blokkolók: csökkentik a hörgtágító hatást"}',
  'Májon át bomlik le.', '{"A száj átnézése","Tünetkontroll","A rohamoldó használatának gyakorisága"}', 'Terhességben adható, ha indokolt.',
  '{"A rohamban való használat késlelteti a hatékony ellátást — a betegnek külön rohamoldóval kell rendelkeznie"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'inhalacios-kombinaciok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Pantoprazol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'pantoprazol', 'Pantoprazol', 'Pantoprazole', 'A02BC02', g.id,
  'A gyomor savtermelő sejtjeinek protonpumpáját gátolja visszafordíthatatlanul. A savtermelés az új pumpák képződésével áll helyre.', '{"Reflux","Gyomor- és nyombélfekély","Gyomorvédelem kockázatos betegnél","Felső emésztőrendszeri vérzés utáni kezelés"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"A tartós szedés gyakran indokolatlanul folytatódik: érdemes tisztázni, miért kezdték, és szükséges-e még — a felülvizsgálat önálló feladat","A hirtelen elhagyás visszacsapó savtermelést okoz, ami visszahozza a panaszokat; ez nem a betegség kiújulása, és fokozatos leépítéssel elkerülhető","Étkezés előtt fél órával bevéve hatékonyabb — a pumpák ilyenkor aktívak","Tartós szedésnél magnézium- és B12-hiány alakulhat ki","A klopidogrél hatását kevésbé befolyásolja, mint a csoport többi tagja — ez a választásnál szempont","Tartós szedés mellett a csonttörés és a bélfertőzés kockázata enyhén nő"}', '{"Fejfájás","Hasmenés","Magnéziumhiány tartós szedésnél","B12-hiány","Fokozott bélfertőzés-kockázat"}', '{"Klopidogrél: a csoport más tagjainál jelentősebb a hatás","Egyes gombaellenes szerek: csökken a felszívódásuk","Metotrexát: a szintje emelkedhet"}',
  'Májon át bomlik le; súlyos májelégtelenségben az adag csökkentendő.', '{"Magnézium tartós szedésnél","B12-vitamin","A szedés indokának éves felülvizsgálata"}', 'Terhességben adható, ha indokolt.',
  '{"A tartós szedés indokának elmulasztott felülvizsgálata a leggyakoribb hiba: sok beteg évekig szedi anélkül, hogy bárki megkérdezné, miért","A hirtelen elhagyás utáni panaszokat a betegség kiújulásának veszik, és újraindítják a szert — pedig ez a visszacsapó savtermelés"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'savcsokkentok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Omeprazol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'omeprazol', 'Omeprazol', 'Omeprazole', 'A02BC01', g.id,
  'Protonpumpa-gátló, azonos hatásmóddal.', '{"Reflux","Fekélybetegség","Gyomorvédelem"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"A klopidogrél hatóanyaggá alakítását gátolja — együttadásuk kerülendő, helyette pantoprazol javasolt","A csoport többi szempontja azonos: felülvizsgálat, fokozatos leépítés, étkezés előtti bevétel"}', '{"Fejfájás","Hasmenés","Magnéziumhiány","B12-hiány"}', '{"Klopidogrél: gátolja a hatóanyaggá alakítást","Diazepám, fenitoin: a szintjük emelkedhet"}',
  'Májon át bomlik le.', '{"Magnézium","B12-vitamin","A szedés indoka"}', 'Terhességben adható.',
  '{"A klopidogréllel való együttadás gyakori és elkerülhető hiba"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'savcsokkentok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Ezomeprazol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'esomeprazol', 'Ezomeprazol', 'Esomeprazole', 'A02BC05', g.id,
  'Protonpumpa-gátló, az omeprazol hatékonyabb tükörképi változata.', '{"Reflux","Fekélybetegség","Gyomorvédelem"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"A csoport szempontjai azonosak","A klopidogréllel való kölcsönhatás itt is fennáll"}', '{"Fejfájás","Hasmenés","Magnéziumhiány"}', '{"Klopidogrél: gátolja a hatóanyaggá alakítást","Egyes gombaellenes szerek: csökken a felszívódásuk"}',
  'Májon át bomlik le; májelégtelenségben az adag korlátozott.', '{"Magnézium","A szedés indoka"}', 'Terhességben adható.',
  '{"A vény nélkül kapható változat miatt sokan hosszú ideig szedik orvosi felügyelet nélkül"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'savcsokkentok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Famotidin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'famotidin', 'Famotidin', 'Famotidine', 'A02BA03', g.id,
  'A savtermelést serkentő hisztamin receptorát blokkolja. Gyengébb hatású, mint a protonpumpa-gátlók, de gyorsabban hat.', '{"Reflux enyhébb formája","Fekélybetegség","Protonpumpa-gátló kiegészítése éjszakai panaszra"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"Gyorsabban hat, mint a protonpumpa-gátló, ezért alkalmi panaszra alkalmas","Vesefunkció szerinti adagmódosítás szükséges","Idős betegnél zavartságot okozhat, különösen vesebetegség mellett","Nem befolyásolja a klopidogrél hatását"}', '{"Fejfájás","Szédülés","Zavartság idős betegnél"}', '{"Kevés kölcsönhatás — ez előny a protonpumpa-gátlókkal szemben"}',
  'Vesén át ürül; veseelégtelenségben az adag csökkentendő.', '{"Kreatinin és eGFR","Tudatállapot idős betegnél"}', 'Terhességben adható.',
  '{"Idős, vesebeteg betegnél a fel nem ismert adagtúllépés zavartságot okozhat"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'savcsokkentok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Metoklopramid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'metoclopramid', 'Metoklopramid', 'Metoclopramide', 'A03FA01', g.id,
  'A hányásközpont dopamin-receptorait blokkolja, és gyorsítja a gyomorürülést. A kettős hatás miatt a gyomor eredetű hányingerre különösen alkalmas.', '{"Hányinger és hányás","Lassult gyomorürülés","Migrénhez társuló hányinger"}', '{"Bélelzáródás","Emésztőrendszeri vérzés vagy átfúródás","Parkinson-kór","Korábbi mozgászavar a szerre"}',
  '{"Mozgászavart okozhat: izomgörcsök az arcon és a nyakon, nyugtalanság — fiatalnál és tartós szedésnél gyakoribb, és a beteget megrémíti; a szer elhagyására és célzott kezelésre megszűnik","A kezelés időtartama korlátozott: néhány napnál tovább nem javasolt","Bélelzáródásnál ellenjavallt, mert a bélmozgás fokozása árt — a hasi vizsgálat ezért a szer adása előtt indokolt","Parkinson-kórban tilos: rontja a tüneteket","Idős betegnél a mozgászavar tartós maradhat"}', '{"Mozgászavar: izomgörcs, nyugtalanság","Aluszékonyság","Hasmenés","Tartós mozgászavar — ritka"}', '{"Dopaminerg szerek: kölcsönösen rontják egymás hatását","Nyugtatók: fokozott aluszékonyság"}',
  'Vesén át ürül; veseelégtelenségben az adag csökkentendő.', '{"Mozgászavar keresése","A kezelés időtartama"}', 'Terhességben adható, ha indokolt.',
  '{"A mozgászavart gyakran allergiás reakciónak vagy szorongásnak nézik — pedig jellegzetes, és célzott kezeléssel perceken belül oldható","A bélelzáródás kizárása a szer adása előtt elmarad, pedig ott ellenjavallt"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'hanyascsillapitok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Ondanszetron ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'ondansetron', 'Ondanszetron', 'Ondansetron', 'A04AA01', g.id,
  'A hányást kiváltó szerotonin-receptorokat blokkolja a bélben és a központi idegrendszerben.', '{"Kemoterápia és sugárkezelés okozta hányinger","Műtét utáni hányinger"}', '{"Megnyúlt QT-szindróma","Apomorfin egyidejű szedése"}',
  '{"QT-megnyúlást okoz — más QT-nyújtó szerrel együtt adva ritmuszavar kockázata; a gyógyszerlista átnézése indokolt","A székrekedés gyakori mellékhatás, és a kemoterápiás betegnél amúgy is fennálló panaszt súlyosbítja","Mozgásbetegségre és bélelzáródásra nem hatékony — az ok tisztázása a szerválasztás előtt","A szájban oldódó forma nyelési nehézségnél előnyös"}', '{"Székrekedés","Fejfájás","QT-megnyúlás"}', '{"QT-nyújtó szerek: a hatás összeadódik","Apomorfin: együttadásuk tilos"}',
  'Májon át bomlik le; súlyos májelégtelenségben az adag korlátozott.', '{"EKG QT-nyújtó szerek együttadásánál","Székletürítés"}', 'Terhességben az adatok vegyesek; a döntés egyedi mérlegelés alapján.',
  '{"A székrekedés kemoterápiás betegnél jelentős panaszt okozhat, és a megelőzése elmarad"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'hanyascsillapitok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Loperamid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'loperamid', 'Loperamid', 'Loperamide', 'A07DA03', g.id,
  'A bél opioid-receptorain hat, lassítja a bélmozgást. A központi idegrendszerbe alig jut, ezért nem okoz kábító hatást.', '{"Akut, nem fertőzéses hasmenés","Krónikus hasmenés meghatározott esetekben"}', '{"Véres hasmenés","Magas láz hasmenéssel","Bélelzáródás","Gyulladásos bélbetegség fellángolása","Két év alatti életkor"}',
  '{"Fertőzéses hasmenésnél nem adható: a kórokozó bennmarad, és az állapot romolhat — a láz és a véres széklet kizárja a használatát","A folyadékpótlás a fontosabb: a hasmenés veszélye a kiszáradás, nem maga a székletürítés","Nagy adagban szívritmuszavart okozhat — ez visszaélésszerű használatnál fordul elő","A tünet kezelése nem helyettesíti az ok tisztázását"}', '{"Székrekedés","Hasi görcs","Szájszárazság","Ritmuszavar nagy adagban"}', '{"QT-nyújtó szerek: nagy adagban a kockázat nő","Erős enzimgátlók: a szintje emelkedik"}',
  'Májon át bomlik le; májelégtelenségben óvatosan.', '{"Folyadékállapot","Székletürítés"}', 'Terhességben csak egyértelmű javallat esetén.',
  '{"A lázas vagy véres hasmenésnél való használat késlelteti a kórokozó kiürülését, és súlyos szövődményhez vezethet","A folyadékpótlás elmarad, mert a széklet megszűnése biztonságérzetet ad"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'belmukodes'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Makrogol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'macrogol', 'Makrogol', 'Macrogol', 'A06AD15', g.id,
  'A bélben vizet köt meg, ezért a széklet lágyabb és terjedelmesebb lesz. Nem izgatja a bélfalat, és nem szívódik fel.', '{"Székrekedés","Bélelőkészítés vizsgálathoz"}', '{"Bélelzáródás","Bélátfúródás","Súlyos gyulladásos bélbetegség"}',
  '{"Tartós használatra a legbiztonságosabb hashajtó: nem szívódik fel, és nem okoz megszokást","Elegendő folyadékkal kell bevenni — enélkül a hatás elmarad","A hatás egy-két nap alatt alakul ki, nem azonnali","Opioid okozta székrekedésnél is használható, és ott a megelőzés a kezelés része"}', '{"Puffadás","Hasi görcs","Hasmenés túladagolásnál"}', '{"Más gyógyszerek felszívódását befolyásolhatja nagy mennyiségben"}',
  'Nem szívódik fel, ezért a szervi működés nem befolyásolja.', '{"Székletürítés","Folyadékbevitel"}', 'Terhességben adható.',
  '{"Az elégtelen folyadékkal bevett por hatástalan — ez a leggyakoribb ok, amiért nem működik"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'belmukodes'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Biszakodil ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'bisacodyl', 'Biszakodil', 'Bisacodyl', 'A06AB02', g.id,
  'A vastagbél nyálkahártyáját izgatja, ezért fokozza a bélmozgást és a vízkiválasztást.', '{"Székrekedés","Bélelőkészítés"}', '{"Bélelzáródás","Akut hasi betegség","Súlyos kiszáradás"}',
  '{"Izgató hatású: tartós használata megszokást és bélrenyheséget okozhat — alkalmi használatra való","A hatás hat–tizenkét óra alatt alakul ki, ezért este bevéve reggelre hat","Hasi görcsöt okozhat","Tartós székrekedésnél a vizet megkötő szerek előnyösebbek"}', '{"Hasi görcs","Hasmenés","Elektroliteltérés tartós használatnál"}', '{"Vízhajtók: az elektroliteltérés összeadódik","Savcsökkentők: a bevonat idő előtt feloldódhat"}',
  'Alig szívódik fel.', '{"Székletürítés","Ionok tartós használatnál"}', 'Terhességben csak indokolt esetben.',
  '{"A tartós használat bélrenyheséget okoz, ami újabb hashajtót igényel — ez az ördögi kör megelőzhető a vizet megkötő szerekkel"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'belmukodes'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Pregabalin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'pregabalin', 'Pregabalin', 'Pregabalin', 'N03AX16', g.id,
  'Az idegsejtek kalciumcsatornáinak egyik alegységéhez kötődik, ezért csökkenti a fájdalomjelet közvetítő anyagok felszabadulását.', '{"Idegi eredetű fájdalom","Epilepszia — kiegészítő kezelés","Általános szorongásos zavar"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"A szédülés és az aluszékonyság a kezelés elején gyakori — a fokozatos adagemelés mérsékli, és a beteg előzetes tájékoztatása megelőzi a korai abbahagyást","Esési kockázat idős betegnél: a szédülés és az egyensúlyzavar valós veszély","Vesefunkció szerinti adagmódosítás szükséges — ez a leggyakrabban kimaradó lépés","A hirtelen elhagyás megvonásos tüneteket okoz: a leépítés fokozatos","Visszaélési lehetőség: tartós szedésnél a szer iránti sóvárgás kialakulhat, és ez a gyakorlatban egyre gyakoribb","Testsúlygyarapodás és bokaduzzanat gyakori"}', '{"Szédülés, aluszékonyság","Testsúlygyarapodás","Bokaduzzanat","Homályos látás","Zavartság idős betegnél"}', '{"Opioidok és nyugtatók: fokozott központi gátlás és légzésdepresszió","Alkohol: fokozott aluszékonyság"}',
  'Vesén át változatlan formában ürül; a vesefunkció szerinti adagmódosítás elengedhetetlen.', '{"Kreatinin és eGFR","Testsúly","Esési kockázat","Aluszékonyság mértéke"}', 'Terhességben nem javasolt.',
  '{"A vesefunkció szerinti adagmódosítás elmaradása a leggyakoribb hiba: halmozódás esetén erős aluszékonyság és zavartság alakul ki","Az opioiddal együtt adott pregabalin fokozza a légzésdepresszió kockázatát — ez a kombináció gyakori, és a veszélye kevéssé ismert"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'idegi-fajdalom'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Gabapentin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'gabapentin', 'Gabapentin', 'Gabapentin', 'N03AX12', g.id,
  'A pregabalinéhoz hasonló hatásmód, de a felszívódása telíthető — ezért a nagyobb adagok aránytalanul kisebb vérszintet adnak.', '{"Idegi eredetű fájdalom","Epilepszia — kiegészítő kezelés"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"A csoport szempontjai azonosak: szédülés, esési kockázat, vesefunkció, fokozatos leépítés","A felszívódás telíthető, ezért a napi adagot több részre kell osztani","A savcsökkentők csökkentik a felszívódását — a bevétel időzítése számít"}', '{"Szédülés, aluszékonyság","Testsúlygyarapodás","Bokaduzzanat","Zavartság idős betegnél"}', '{"Opioidok és nyugtatók: fokozott gátlás","Savcsökkentők: csökkentik a felszívódását"}',
  'Vesén át ürül; a vesefunkció szerinti adagmódosítás szükséges.', '{"Kreatinin és eGFR","Aluszékonyság","Esési kockázat"}', 'Terhességben nem javasolt.',
  '{"A savcsökkentővel egy időben bevéve a felszívódás jelentősen csökken — legalább két óra különbség javasolt"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'idegi-fajdalom'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Amitriptilin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'amitriptylin', 'Amitriptilin', 'Amitriptyline', 'N06AA09', g.id,
  'Régi típusú antidepresszáns, amely több jelátvivő anyag visszavételét gátolja. Az idegi fájdalomra kis adagban is hatékony — jóval kisebben, mint a depresszió kezelésére.', '{"Idegi eredetű fájdalom","Migrén megelőzése","Depresszió — nagyobb adagban"}', '{"Friss szívinfarktus","Súlyos ingervezetési zavar","Zárt zugú zöldhályog","MAO-gátló szedése"}',
  '{"Fájdalomra kis adagban hatékony — a beteg gyakran megijed, ha meglátja, hogy antidepresszánst kapott; ennek elmagyarázása megelőzi a korai abbahagyást","Este bevéve az aluszékonyság előnnyé válik, és az alvást is javítja","Idős betegnél zavartság, vizeletretenció, székrekedés és esés kockázata — az egyik leggyakrabban leépítendő szer az idős gyógyszerlistákon","Szájszárazság a leggyakoribb mellékhatás","Ritmuszavarra hajlamos betegnél EKG indokolt a kezelés előtt"}', '{"Szájszárazság","Székrekedés","Vizeletretenció","Aluszékonyság","Zavartság idős betegnél","QT-megnyúlás"}', '{"MAO-gátlók: együttadásuk tilos","QT-nyújtó szerek: a hatás összeadódik","Nyugtatók és alkohol: fokozott gátlás"}',
  'Májon át bomlik le; máj- és veseelégtelenségben óvatosan.', '{"EKG kockázatos betegnél","Vizeletürítés","Tudatállapot idős betegnél"}', 'Terhességben csak egyértelmű javallat esetén.',
  '{"A beteg gyakran abbahagyja, amikor megtudja, hogy antidepresszánst kapott fájdalomra — pedig az adag jóval kisebb, és a hatásmód más","Idős betegnél a mellékhatások összeadódnak, és a szer a leggyakrabban leépítendők közé tartozik"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'idegi-fajdalom'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Szertralin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'sertralin', 'Szertralin', 'Sertraline', 'N06AB06', g.id,
  'A szerotonin visszavételét gátolja az idegsejtek között, ezért az anyag tovább fejti ki hatását. A hangulatra gyakorolt hatás hetek alatt alakul ki.', '{"Depresszió","Szorongásos zavarok","Pánikbetegség","Poszttraumás stressz"}', '{"MAO-gátló szedése","Pimozid egyidejű szedése"}',
  '{"A hatás két–négy hét alatt alakul ki: a korai abbahagyás a leggyakoribb ok, amiért a kezelés nem sikerül — ennek előzetes elmondása a legfontosabb ápolói lépés","Az első hetekben a szorongás átmenetileg fokozódhat, és fiatalnál az öngyilkossági gondolatok kockázata nő — szoros követés indokolt","A hirtelen elhagyás megvonásos tüneteket okoz: szédülést, áramütésszerű érzést, ingerlékenységet; a leépítés mindig fokozatos","Idős betegnél alacsony nátriumszintet okozhat — a zavartság hátterében ezt is keresni kell","Vérzési kockázatot növel, különösen gyulladáscsökkentővel vagy alvadásgátlóval együtt","A szexuális működés zavara gyakori, és a beteg ritkán hozza szóba — a kérdezés megelőzi a szó nélküli abbahagyást"}', '{"Hányinger a kezelés elején","Fejfájás","Alvászavar","Szexuális működészavar","Alacsony nátriumszint idős betegnél"}', '{"MAO-gátlók: együttadásuk tilos","Gyulladáscsökkentők és alvadásgátlók: fokozott vérzési kockázat","Triptánok és tramadol: szerotonin-szindróma"}',
  'Májon át bomlik le; májelégtelenségben az adag csökkentendő.', '{"Hangulat és öngyilkossági gondolatok a kezelés elején","Nátriumszint idős betegnél","Vérzésjelek"}', 'Terhességben mérlegelés után adható; a kezeletlen depresszió is kockázat.',
  '{"A korai abbahagyás — „nem hat\" — a kezelés kudarcának leggyakoribb oka; a hatás idejének elmondása ezt megelőzi","A szexuális mellékhatást a beteg gyakran nem említi, hanem szó nélkül abbahagyja a szert"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'antidepresszansok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Escitaloprám ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'escitalopram', 'Escitaloprám', 'Escitalopram', 'N06AB10', g.id,
  'Szerotonin-visszavétel-gátló, a citaloprám hatékonyabb tükörképi változata.', '{"Depresszió","Szorongásos zavarok","Pánikbetegség"}', '{"MAO-gátló szedése","Megnyúlt QT-szindróma"}',
  '{"QT-megnyúlást okozhat, ezért az adag korlátozott, különösen idős betegnél — ez megkülönbözteti a csoport többi tagjától","A csoport többi szempontja azonos: a hatás ideje, a korai szorongásfokozódás, a fokozatos leépítés","Alacsony nátriumszint idős betegnél"}', '{"Hányinger","Alvászavar","Szexuális működészavar","QT-megnyúlás","Alacsony nátriumszint"}', '{"MAO-gátlók: tilos","QT-nyújtó szerek: a hatás összeadódik","Gyulladáscsökkentők: fokozott vérzési kockázat"}',
  'Májon át bomlik le; májelégtelenségben az adag csökkentendő.', '{"EKG kockázatos betegnél","Nátriumszint","Hangulat"}', 'Terhességben mérlegelés után.',
  '{"Az idős betegnél előírt alacsonyabb adagkorlát gyakran elkerüli a figyelmet"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'antidepresszansok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Venlafaxin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'venlafaxin', 'Venlafaxin', 'Venlafaxine', 'N06AX16', g.id,
  'A szerotonin és a noradrenalin visszavételét is gátolja. A kettős hatás nagyobb adagban érvényesül.', '{"Depresszió","Általános szorongásos zavar","Pánikbetegség"}', '{"MAO-gátló szedése","Kezeletlen magas vérnyomás"}',
  '{"Vérnyomás-emelkedést okozhat, különösen nagyobb adagban — a vérnyomás rendszeres mérése a kezelés része","A megvonásos tünetek ennél a szernél a legkifejezettebbek: a leépítés különösen lassú és fokozatos legyen","A csoport többi szempontja azonos"}', '{"Hányinger","Vérnyomás-emelkedés","Izzadás","Alvászavar","Szexuális működészavar"}', '{"MAO-gátlók: tilos","Triptánok, tramadol: szerotonin-szindróma","Gyulladáscsökkentők: fokozott vérzés"}',
  'Máj- és veseelégtelenségben az adag csökkentendő.', '{"Vérnyomás","Hangulat","Nátriumszint idős betegnél"}', 'Terhességben mérlegelés után.',
  '{"A megvonásos tünetek itt a legerősebbek — a kihagyott adag is okozhat szédülést és áramütésszerű érzést","A vérnyomás-emelkedés elkerüli a figyelmet, ha nem mérik rendszeresen"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'antidepresszansok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Duloxetin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'duloxetin', 'Duloxetin', 'Duloxetine', 'N06AX21', g.id,
  'Szerotonin- és noradrenalin-visszavétel-gátló. Az idegi fájdalomra is hatékony, ezért cukorbetegség okozta idegkárosodásban is használják.', '{"Depresszió","Általános szorongásos zavar","Diabéteszes idegi fájdalom"}', '{"MAO-gátló szedése","Súlyos májelégtelenség","Súlyos veseelégtelenség"}',
  '{"Idegi fájdalomra is hatékony — cukorbetegnél kettős haszon, ha depresszió és idegkárosodás is fennáll","Májelégtelenségben és alkoholfogyasztás mellett kerülendő","Vérnyomás-emelkedést okozhat","A csoport többi szempontja azonos"}', '{"Hányinger","Szájszárazság","Álmatlanság","Vérnyomás-emelkedés","Májenzim-emelkedés"}', '{"MAO-gátlók: tilos","Alkohol: májkárosodás kockázata","Gyulladáscsökkentők: fokozott vérzés"}',
  'Máj- és veseelégtelenségben ellenjavallt vagy adagmódosítást igényel.', '{"Májenzimek","Vérnyomás","Hangulat"}', 'Terhességben mérlegelés után.',
  '{"Rendszeres alkoholfogyasztás mellett a májkárosodás kockázata nő — ezt a kérdést fel kell tenni a kezelés indításakor"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'antidepresszansok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Diazepám ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'diazepam', 'Diazepám', 'Diazepam', 'N05BA01', g.id,
  'A központi idegrendszer gátló jelátvitelét erősíti. Szorongásoldó, izomlazító, altató és görcsgátló hatású. Hosszú felezési idejű, és aktív bomlástermékei is vannak.', '{"Akut szorongás — rövid távon","Görcsroham","Izomgörcs","Alkoholmegvonás"}', '{"Súlyos légzési elégtelenség","Alvási apnoe","Súlyos májelégtelenség","Myasthenia gravis"}',
  '{"Rövid távra készült — néhány hétre —, a gyakorlatban viszont gyakran évekig szedik; a szedés időtartamának tisztázása ezért minden találkozáskor indokolt","A hirtelen elhagyás veszélyes: görcsrohamot okozhat, ezért a leépítés mindig fokozatos és orvosi felügyelet mellett történik","Idős betegnél eséshez, zavartsághoz és kognitív romláshoz vezet — a hosszú felezési idő és az aktív bomlástermékek miatt náluk halmozódik","Opioiddal együtt a légzésdepresszió kockázata jelentősen nő — ez a kombináció gyakori, és a veszélye kevéssé ismert","Az alkohollal való együttes fogyasztás kerülendő","Gépjárművezetés és gépkezelés befolyásolt"}', '{"Aluszékonyság","Egyensúlyzavar, esés","Zavartság idős betegnél","Emlékezetzavar","Függőség","Légzésdepresszió"}', '{"Opioidok: légzésdepresszió — az együttadás külön mérlegelést kíván","Alkohol: fokozott gátlás","Erős enzimgátlók: a szintje emelkedik"}',
  'Májon át bomlik le, aktív bomlástermékekkel. Máj- és veseelégtelenségben, valamint idős betegnél halmozódik.', '{"A szedés időtartama","Esési kockázat","Tudatállapot idős betegnél","Légzésszám opioiddal együtt"}', 'Terhességben kerülendő; a szülés előtt adva a magzat légzését is elnyomhatja.',
  '{"A hirtelen elhagyás görcsrohamot okozhat — a betegek gyakran maguktól hagyják abba, mert „függőségtől\" félnek, és ez veszélyesebb, mint a folytatás","Idős betegnél a hosszú felezési idő miatt halmozódik: a rövidebb hatású szerek náluk biztonságosabbak","Az opioiddal alkotott kombináció légzésdepressziós kockázata a gyakorlatban alulértékelt"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'nyugtatok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Alprazolám ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'alprazolam', 'Alprazolám', 'Alprazolam', 'N05BA12', g.id,
  'Rövidebb hatású nyugtató, gyors hatáskezdettel. Éppen ezért nagyobb a függőségi kockázata.', '{"Akut szorongás — rövid távon","Pánikbetegség — átmenetileg"}', '{"Súlyos légzési elégtelenség","Alvási apnoe","Súlyos májelégtelenség"}',
  '{"A gyors hatás és a rövid hatástartam miatt a függőségi kockázat nagyobb, mint a hosszabb hatású szereké — a szedés időtartamának tisztázása kiemelten fontos","A megvonásos tünetek gyorsabban és erősebben jelentkeznek","A leépítés hosszabb hatású szerre váltással történhet — ez orvosi döntés","A csoport többi szempontja azonos: esés, zavartság, opioid-kombináció"}', '{"Aluszékonyság","Egyensúlyzavar","Emlékezetzavar","Függőség","Megvonásos tünetek"}', '{"Opioidok: légzésdepresszió","Alkohol: fokozott gátlás","Erős enzimgátlók: a szintje jelentősen emelkedik"}',
  'Májon át bomlik le; májelégtelenségben és idős betegnél halmozódik.', '{"A szedés időtartama","Esési kockázat","Megvonásos tünetek"}', 'Terhességben kerülendő.',
  '{"A rövid hatástartam miatt a beteg naponta többször szedi, és a köztes időszakban megvonásos szorongást él át — ezt gyakran a betegség súlyosbodásának veszi, és emeli az adagot"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'nyugtatok'
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
-- A gyógyszertár teljes szerkezete a bővítés után.
select p.name as focsoport, count(distinct g.id) as alcsoport,
  count(s.id) as hatoanyag
from public.drug_groups p
left join public.drug_groups g on g.parent_id = p.id and g.publish_status = 'published'
left join public.drug_substances s on s.group_id = g.id and s.publish_status = 'published'
where p.parent_id is null and p.publish_status = 'published'
group by p.name, p.ord
order by p.ord;

-- Összesítés.
select
  (select count(*) from public.drug_groups where parent_id is null and publish_status = 'published') as focsoport,
  (select count(*) from public.drug_groups where parent_id is not null and publish_status = 'published') as alcsoport,
  (select count(*) from public.drug_substances where publish_status = 'published') as hatoanyag;
