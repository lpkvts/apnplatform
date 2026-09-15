-- APN-MED — Gyógyszertár bővítés, második kör: diabetes és lipidcsökkentők.
--
-- Két új főcsoport, kilenc alcsoport, tizenhat hatóanyag.
--
-- Két szerkezeti döntés:
--
--   · a dapagliflozin és az empagliflozin a kardiológiai főcsoportban maradt,
--     mert a szívelégtelenség alapkezelésének része. Itt nem duplikáljuk őket;
--     a kanagliflozin, amely nincs a kardiológiai listán, ide kerül.
--
--   · az inzulinokat a kérés szerint nem bontjuk készítményekre. Egy
--     összefoglaló alcsoport készült a típusokról és a legfontosabb ápolói
--     tudnivalókról — a részletes bontás az adagolás felé vinne, amit a modul
--     szándékosan kerül.
--
-- Előfeltétel: a 0065, 0066 és 0099 lefutott.

-- ══ Főcsoportok ══════════════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, icon, publish_status)
values (
  'diabetes', 'Diabetes és anyagcsere', 'A10', null, 'Vércukorcsökkentők, inzulinok',
  'A 2-es típusú cukorbetegség kezelésének szerei, a régi vércukorközpontú megközelítéstől a szervvédő szemléletig.', 'A cukorbetegség kezelésében használt szerek. A csoport az elmúlt években gyökeresen átalakult: a korábbi szemlélet a vércukor csökkentésére összpontosított, a mai viszont a szív- és vesevédelemre is — több szer ezért olyan betegnek is jár, akinek a vércukra egyébként rendben van.',
  '{"A szerválasztás ma nem csak a vércukron múlik: a szív- és vesebetegség jelenléte önmagában meghatározza, melyik csoport jön szóba.","A vércukoresés kockázata csoportonként eltér — a metformin, az SGLT2-gátlók és a GLP-1 analógok önmagukban ritkán okozzák, a szulfonilureák és az inzulin viszont igen.","Betegnapok rendje: akut betegség, hányás vagy éhezés több szernél szüneteltetést kíván."}', '{"A vércukoresés felismerésének és kezelésének megtanítása","A betegnapok rendjének előzetes megbeszélése","Vesefunkció követése — több szer adagja ettől függ","A vércukormérés technikájának ellenőrzése"}', 6, 'droplet', 'published'
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
  'lipidcsokkentok', 'Lipidcsökkentők', 'C10', null, 'Statinok, ezetimib, PCSK9-gátlók',
  'A koleszterinszint csökkentésére és az érelmeszesedés megelőzésére szolgáló szerek.', 'A vér zsírszintjét csökkentő szerek. A cél nem maga a koleszterinszám, hanem az érelmeszesedés lassítása — ezért a célértéket a beteg kockázata határozza meg, nem egy általános határ.',
  '{"A célérték a kockázattól függ: minél nagyobb a szív- és érrendszeri kockázat, annál alacsonyabb a cél — igazolt betegségnél a legszigorúbb.","Az izomfájdalom a leggyakoribb ok, amiért abbahagyják, de a valódi izomkárosodás ritka; a legtöbb panasz kezelhető adagmódosítással vagy szercserével.","A kezelés élethosszig tart: az abbahagyás után a koleszterin hetek alatt visszaáll, és a védelem megszűnik."}', '{"Az izompanasz felmérése és a szercsere lehetőségének felvetése","A célérték ismerete a beteg kockázata szerint","Az élethosszig tartó kezelés magyarázata","Májenzim és izomenzim ellenőrzése panasz esetén"}', 7, 'pulse', 'published'
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
select 'biguanidok', 'Biguanidok', 'A10BA', p.id, 'Metformin',
  'A 2-es típusú cukorbetegség alapszere.', 'A név a molekula szerkezetére utal. A csoport egyetlen ma is használt tagja a metformin, amely több mint hatvan éve a 2-es típusú cukorbetegség első választandó szere.',
  '{"Önmagában nem okoz vércukoresést, mert nem növeli az inzulinelválasztást.","A vesefunkció határozza meg az adhatóságát — a tejsavas acidózis ritka, de súlyos szövődmény, és a felhalmozódásból ered."}', '{"Vesefunkció követése","Emésztőrendszeri panaszok felmérése","B12-vitamin ellenőrzése tartós kezelésnél"}', 1, 'published'
from public.drug_groups p where p.slug = 'diabetes'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'sglt2-diabetes', 'SGLT2-gátlók', 'A10BK', p.id, 'Kanagliflozin — lásd még a kardiológiánál',
  'Cukorvesztést okozó szerek, jelentős szív- és vesevédő hatással.', 'A vesében lévő cukorszállítót gátolják. A dapagliflozin és az empagliflozin a szív- és érrendszeri főcsoportban szerepel, mert a szívelégtelenség alapkezelésének része.',
  '{"A csoport két leggyakrabban használt tagja a kardiológiai főcsoportban található, mert a szívelégtelenség kezelésében is alapszer.","A vércukortól függetlenül is védik a vesét és a szívet."}', '{"Genitális fertőzés megelőzése","Folyadékállapot követése","Betegnapok rendje akut betegségnél"}', 2, 'published'
from public.drug_groups p where p.slug = 'diabetes'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'glp1', 'GLP-1 analógok', 'A10BJ', p.id, 'Szemaglutid, dulaglutid, liraglutid, tirzepatid',
  'Injekcióban vagy tablettában adott szerek, jelentős testsúlycsökkentő és szívvédő hatással.', 'A bélből felszabaduló természetes hormon hatását utánozzák: az étkezés után fokozzák az inzulinelválasztást, lassítják a gyomorürülést, és csökkentik az étvágyat. Az utóbbi miatt testsúlycsökkenést is okoznak.',
  '{"A hányinger a leggyakoribb mellékhatás, és a kezelés elején a legerősebb — a fokozatos adagemelés ezt mérsékli.","Műtét és altatás előtt a lassult gyomorürülés miatt külön szempontok érvényesek: a gyomor tele lehet a szokásos éhezés ellenére.","A testsúlycsökkenés miatt sokan cukorbetegség nélkül is kérik — a javallaton kívüli használat orvosi mérlegelést kíván."}', '{"Az injekciós technika megtanítása és ellenőrzése","A hányinger kezelésének megbeszélése","Műtét előtti tájékoztatás a gyomorürülésről","Testsúly és étkezési szokások követése"}', 3, 'published'
from public.drug_groups p where p.slug = 'diabetes'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'dpp4', 'DPP-4-gátlók', 'A10BH', p.id, 'Szitagliptin',
  'Enyhe hatású, jól tolerálható tabletták.', 'Azt az enzimet gátolják, amely a bélhormont lebontja — így a szervezet saját hormonja tovább hat. A GLP-1 analógoknál gyengébb, de tablettában adható és jól tolerálható.',
  '{"Önmagukban nem okoznak vércukoresést és testsúlygyarapodást.","GLP-1 analóggal együtt nem adhatók — ugyanazon a rendszeren hatnak."}', '{"Vesefunkció szerinti adagmódosítás ellenőrzése","A GLP-1 analóggal való együttadás kizárása"}', 4, 'published'
from public.drug_groups p where p.slug = 'diabetes'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'szulfonilureak', 'Szulfonilureák', 'A10BB', p.id, 'Gliklazid, glimepirid',
  'Régi, hatékony és olcsó szerek, de vércukoresés kockázatával.', 'A hasnyálmirigy béta-sejtjeit serkentik inzulinelválasztásra. Ez a hatás független attól, hogy van-e éppen cukor a vérben — ezért okoznak vércukoresést.',
  '{"A vércukoresés a legfontosabb kockázat, és idős betegnél elhúzódó lehet.","A kihagyott étkezés vércukorcsökkenést okozhat — ez a leggyakoribb kiváltó."}', '{"A vércukoresés tüneteinek és kezelésének megtanítása","Az étkezés és a gyógyszerbevétel összehangolása","Idős betegnél fokozott figyelem"}', 5, 'published'
from public.drug_groups p where p.slug = 'diabetes'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'inzulinok', 'Inzulinok — áttekintés', 'A10A', p.id, 'Típusok és ápolói szempontok',
  'Áttekintő adatlap a típusokról és a legfontosabb ápolói tudnivalókról. A készítményenkénti bontás az adagolás felé vinne, amit a modul szándékosan kerül.', 'A hasnyálmirigy hormonjának mesterségesen előállított változatai. A típusok a hatás kezdetében és tartamában térnek el: a gyors hatásúak az étkezéshez, a hosszú hatásúak az alapszükséglethez igazodnak.',
  '{"A vércukoresés a legfontosabb kockázat, és minden inzulinnál fennáll.","A beadási hely váltogatása elengedhetetlen: az ismételt szúrás ugyanoda szövetcsomót okoz, ami kiszámíthatatlanná teszi a felszívódást.","A tű hossza és a beadás szöge számít: a túl mély beadás izomba visz, ami gyorsabb felszívódást és vércukoresést okoz."}', '{"A beadási technika és a helyváltogatás ellenőrzése","A szövetcsomók tapintása a szokásos beadási helyeken","A vércukoresés felismerésének és kezelésének megtanítása","A tárolás szabályainak megbeszélése"}', 6, 'published'
from public.drug_groups p where p.slug = 'diabetes'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'statinok', 'Statinok', 'C10AA', p.id, 'Atorvasztatin, rozuvasztatin, szimvasztatin',
  'A lipidcsökkentés alapszerei, igazolt halálozáscsökkentő hatással.', 'A májban gátolják a koleszterin előállításának kulcsenzimét. A máj emiatt több koleszterint von ki a vérből, és a vérszint csökken.',
  '{"Az izompanasz gyakori, a valódi izomkárosodás viszont ritka — a legtöbb esetben a kezelés folytatható más szerrel vagy kisebb adaggal.","Este bevéve a régebbi szerek hatékonyabbak, mert a koleszterin-előállítás éjszaka a legélénkebb; az újabbak hosszabb hatástartamúak, náluk ez nem számít."}', '{"Az izompanasz jellegének felmérése","A bevétel időzítésének megbeszélése","Az élethosszig tartó kezelés magyarázata"}', 1, 'published'
from public.drug_groups p where p.slug = 'lipidcsokkentok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'egyeb-lipid', 'Egyéb lipidcsökkentők', 'C10AX', p.id, 'Ezetimib, bempedoinsav',
  'Kiegészítő szerek, ha a statin önmagában nem elég vagy nem tolerálható.', 'Más ponton avatkoznak be, mint a statinok: az egyik a bélből való felszívódást gátolja, a másik a májbeli előállítást — de a statinétól eltérő enzimen.',
  '{"Statin mellé adva tovább csökkentik a koleszterint, anélkül hogy az izompanaszt fokoznák.","A bempedoinsav az izomban nem aktiválódik, ezért statin-intolerancia esetén jön szóba."}', '{"A kombinált kezelés magyarázata","Húgysavszint ellenőrzése bempedoinsav mellett"}', 2, 'published'
from public.drug_groups p where p.slug = 'lipidcsokkentok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'pcsk9', 'PCSK9-gátlók', 'C10AX13', p.id, 'Evolokumab, alirokumab',
  'Injekcióban adott, erős hatású szerek magas kockázatú betegeknek.', 'Azt a fehérjét blokkolják, amely a máj koleszterin-felvevő receptorait lebontja. Több receptor marad, ezért a máj több koleszterint von ki a vérből.',
  '{"Kéthetente vagy havonta adott injekció, amit a beteg maga is beadhat.","Nagyon magas kockázatú betegnél és örökletes koleszterin-anyagcserezavarnál jön szóba, ha a statin és az ezetimib nem elegendő."}', '{"Az injekciós technika megtanítása","A hűtve tárolás szabályainak megbeszélése","A beadási helyi reakciók felmérése"}', 3, 'published'
from public.drug_groups p where p.slug = 'lipidcsokkentok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id,
  short = excluded.short, description = excluded.description,
  name_meaning = excluded.name_meaning, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

-- ══ Hatóanyagok ══════════════════════════════════════════
-- ── Metformin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'metformin', 'Metformin', 'Metformin', 'A10BA02', g.id,
  'Csökkenti a máj cukortermelését, és javítja a szövetek inzulinérzékenységét. Az inzulinelválasztást nem fokozza, ezért önmagában nem okoz vércukoresést.', '{"2-es típusú cukorbetegség — első választandó szer","Inzulinrezisztencia","Policisztás ovárium szindróma"}', '{"Súlyos veseelégtelenség","Akut, súlyos betegség","Súlyos májelégtelenség","Akut szívelégtelenség"}',
  '{"Vesefunkció ellenőrzése a kezelés indítása előtt, majd évente — romló vesefunkciónál gyakrabban; az adhatóság a szűrési értéktől függ","Emésztőrendszeri panaszok: hasmenés, hasi görcs, hányinger — a kezelés elején gyakori, és a fokozatos adagemelés, illetve az étkezés közbeni bevétel mérsékli; a nyújtott hatóanyagleadású forma jobban tolerálható","B12-vitamin ellenőrzése tartós kezelésnél: a metformin csökkenti a felszívódását, és a hiány évek alatt alakul ki, zsibbadással és vérszegénységgel","Betegnapok rendje: hányás, hasmenés, láz vagy kiszáradás esetén a szert szüneteltetni kell — ilyenkor halmozódhat, és tejsavas acidózist okozhat","Kontrasztanyagos vizsgálat előtt szüneteltetés szükséges, és a visszaindítás a vesefunkció ellenőrzése után történik","Nem okoz vércukoresést és testsúlygyarapodást — ezt érdemes elmondani, mert sokan minden cukorbetegség elleni szertől ezt várják"}', '{"Hasmenés, hasi görcs, hányinger — a kezelés elején","Fémes szájíz","B12-vitamin-hiány tartós kezelésnél","Tejsavas acidózis — ritka, de életveszélyes"}', '{"Kontrasztanyag: a vesekárosodás miatt halmozódás","Alkohol: fokozza a tejsavas acidózis kockázatát","Vízhajtók, ACE-gátlók: kiszáradás esetén fokozott kockázat"}',
  'Vesén át változatlan formában ürül. Csökkent vesefunkciónál halmozódik, ezért az adagot a szűrési értékhez kell igazítani, és egy küszöb alatt ellenjavallt.', '{"Kreatinin és eGFR — évente, romló funkciónál gyakrabban","HbA1c","B12-vitamin tartós kezelésnél"}', 'Terhességben adható, de a döntés az alkalmazási előírás és a gondozó orvos alapján történik.',
  '{"A betegnapok rendjének elmulasztása a leggyakoribb elkerülhető hiba: a hasmenéssel vagy hányással járó betegség alatt szedett metformin kiszáradással együtt tejsavas acidózist okozhat","A B12-hiányt gyakran nem kötik a szerhez, mert évek alatt alakul ki, és a zsibbadást a cukorbetegség idegkárosodásának tulajdonítják","A kontrasztanyag utáni visszaindítás elmarad, vagy fordítva: a szüneteltetés elmarad a vizsgálat előtt"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'biguanidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Kanagliflozin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'canagliflozin', 'Kanagliflozin', 'Canagliflozin', 'A10BK02', g.id,
  'A vesében gátolja a cukor visszaszívását, ezért a cukor a vizelettel távozik. Vese- és szívvédő hatása is van.', '{"2-es típusú cukorbetegség","Diabéteszes vesebetegség"}', '{"Terhesség és szoptatás","Súlyos veseelégtelenség — a hatás elmarad"}',
  '{"A csoport ápolói szempontjai azonosak a dapagliflozinéval: genitális fertőzés, folyadékállapot, betegnapok rendje, ketoacidózis-tünetek","Az alsó végtagi seb és a lábápolás külön figyelmet érdemel ennél a szernél","A kezdeti kreatinin-emelkedés itt is várható, és nem ok a leállításra"}', '{"Genitális gombás fertőzés","Húgyúti fertőzés","Folyadékvesztés","Ketoacidózis — ritka"}', '{"Vízhajtók: fokozott folyadékvesztés","Inzulin és szulfonilureák: vércukoresés kockázata nő"}',
  'Veseelégtelenségben a cukorcsökkentő hatás csökken.', '{"Kreatinin és eGFR","HbA1c","Folyadékállapot","Lábvizsgálat"}', 'Terhességben és szoptatás alatt nem javasolt.',
  '{"A lábápolás fontossága ennél a szernél külön hangsúlyt kap — a diabéteszes lábszűrés rendszeressége nem hagyható el"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'sglt2-diabetes'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Szemaglutid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'semaglutid', 'Szemaglutid', 'Semaglutide', 'A10BJ06', g.id,
  'A bélből felszabaduló természetes hormon hatását utánozza: étkezés után fokozza az inzulinelválasztást, lassítja a gyomorürülést, és csökkenti az étvágyat.', '{"2-es típusú cukorbetegség","Elhízás kezelése — külön javallattal","Szív- és érrendszeri kockázat csökkentése"}', '{"Pajzsmirigy velőssejtes daganata a családban","Terhesség","Súlyos emésztőrendszeri betegség"}',
  '{"Az injekciós technika megtanítása és rendszeres ellenőrzése — a heti egyszeri adagolás miatt a kihagyott adag pótlásának szabályait is meg kell beszélni","A hányinger a kezelés elején a legerősebb, és általában hetek alatt enyhül — a fokozatos adagemelés és a kisebb adagok mérséklik; a beteg felkészítése megelőzi a korai abbahagyást","Műtét és altatás előtt jelezni kell a szer szedését: a lassult gyomorürülés miatt a gyomor tele lehet a szokásos éhezés ellenére, ami félrenyelést okozhat","Testsúly és étkezési szokások követése; a gyors fogyás mellett a tápláltsági állapot és az izomtömeg megőrzése is szempont","A hasnyálmirigy-gyulladás tüneteinek ismertetése: erős, hátba sugárzó hasi fájdalom hányással — azonnali orvosi ellátást igényel","Szulfonilureával vagy inzulinnal együtt adva a vércukoresés kockázata nő"}', '{"Hányinger, hányás, hasmenés","Étvágytalanság","Epeúti panaszok","Hasnyálmirigy-gyulladás — ritka","Beadási helyi reakció"}', '{"Szulfonilureák és inzulin: vércukoresés kockázata nő","Szájon át adott gyógyszerek: a lassult gyomorürülés befolyásolhatja a felszívódásukat"}',
  'Veseelégtelenségben adagmódosítás jellemzően nem szükséges, de a kiszáradás veszélye miatt a hányás és hasmenés fokozott figyelmet kíván.', '{"HbA1c","Testsúly","Vesefunkció hányás vagy hasmenés esetén"}', 'Terhességben nem javasolt; a tervezett terhesség előtt elhagyandó.',
  '{"A műtét előtti jelzés elmulasztása valós kockázat: a lassult gyomorürülés miatt az altatás alatt félrenyelés történhet, pedig a beteg betartotta az éhezési szabályt","A hányinger miatti korai abbahagyás elkerülhető a beteg előzetes felkészítésével","A javallaton kívüli, fogyás céljából történő használat terjed — ez orvosi mérlegelést kíván, és a mellékhatások ugyanúgy fennállnak"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'glp1'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Dulaglutid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'dulaglutid', 'Dulaglutid', 'Dulaglutide', 'A10BJ05', g.id,
  'GLP-1 analóg, heti egyszeri injekcióban. Hatásmódja a szemaglutidéval azonos.', '{"2-es típusú cukorbetegség","Szív- és érrendszeri kockázat csökkentése"}', '{"Pajzsmirigy velőssejtes daganata a családban","Terhesség"}',
  '{"Heti egyszeri injekció, előretöltött eszközben — az adagolás egyszerűsége segíti a beteg-együttműködést","A csoport ápolói szempontjai azonosak: hányinger, injekciós technika, műtét előtti jelzés","A kihagyott adag pótlásának szabálya: meghatározott időn belül pótolható"}', '{"Hányinger, hasmenés","Étvágytalanság","Beadási helyi reakció"}', '{"Szulfonilureák és inzulin: vércukoresés kockázata nő"}',
  'Veseelégtelenségben adagmódosítás jellemzően nem szükséges.', '{"HbA1c","Testsúly"}', 'Terhességben nem javasolt.',
  '{"A heti adagolás miatt a kihagyott adag pótlásának szabályait előre meg kell beszélni"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'glp1'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Liraglutid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'liraglutid', 'Liraglutid', 'Liraglutide', 'A10BJ02', g.id,
  'GLP-1 analóg, napi egyszeri injekcióban.', '{"2-es típusú cukorbetegség","Elhízás kezelése — külön javallattal"}', '{"Pajzsmirigy velőssejtes daganata a családban","Terhesség"}',
  '{"Napi egyszeri injekció — a gyakoribb adagolás miatt a beteg-együttműködés nagyobb figyelmet kíván","A csoport többi szempontja azonos: hányinger, technika, műtét előtti jelzés"}', '{"Hányinger, hányás","Hasmenés","Beadási helyi reakció"}', '{"Szulfonilureák és inzulin: vércukoresés kockázata nő"}',
  'Veseelégtelenségben óvatosan.', '{"HbA1c","Testsúly"}', 'Terhességben nem javasolt.',
  '{"A napi adagolás miatt a kihagyás gyakoribb, mint a heti szereknél"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'glp1'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Tirzepatid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'tirzepatid', 'Tirzepatid', 'Tirzepatide', 'A10BX16', g.id,
  'Két bélhormon hatását utánozza egyszerre, nem csak egyet. Ezért a vércukor- és testsúlycsökkentő hatása erősebb a GLP-1 analógokénál.', '{"2-es típusú cukorbetegség","Elhízás kezelése — külön javallattal"}', '{"Pajzsmirigy velőssejtes daganata a családban","Terhesség"}',
  '{"Erősebb hatás, erősebb mellékhatások: a hányinger és a hasmenés gyakoribb lehet, ezért a fokozatos adagemelés különösen fontos","A gyors testsúlycsökkenés mellett a tápláltsági állapot és az izomtömeg követése szempont","Műtét előtti jelzés: a lassult gyomorürülés itt is fennáll"}', '{"Hányinger, hányás, hasmenés — a csoporton belül gyakoribb","Étvágytalanság","Epeúti panaszok"}', '{"Szulfonilureák és inzulin: vércukoresés kockázata nő","Szájon át adott gyógyszerek felszívódása"}',
  'Veseelégtelenségben a kiszáradás veszélye miatt fokozott figyelem.', '{"HbA1c","Testsúly","Tápláltsági állapot"}', 'Terhességben nem javasolt.',
  '{"A gyors fogyás miatt a fogyasztószerként való használat terjed — a mellékhatások és a javallat mérlegelése orvosi feladat"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'glp1'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Szitagliptin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'sitagliptin', 'Szitagliptin', 'Sitagliptin', 'A10BH01', g.id,
  'Gátolja azt az enzimet, amely a bélhormont lebontja — így a szervezet saját hormonja tovább hat. Enyhe, de jól tolerálható hatás.', '{"2-es típusú cukorbetegség"}', '{"Korábbi hasnyálmirigy-gyulladás — mérlegelendő"}',
  '{"Jól tolerálható: önmagában nem okoz vércukoresést és testsúlygyarapodást","Vesefunkció szerinti adagmódosítás szükséges","GLP-1 analóggal együtt nem adható — ugyanazon a rendszeren hatnak","Idős betegnél az egyik legbiztonságosabb választás"}', '{"Ízületi fájdalom — ritka, de zavaró","Fejfájás","Hasnyálmirigy-gyulladás — ritka"}', '{"GLP-1 analógok: együttadásuk nem javasolt","Szulfonilureák: vércukoresés kockázata nő"}',
  'Vesén át ürül; csökkent vesefunkciónál adagcsökkentés szükséges.', '{"HbA1c","Kreatinin és eGFR"}', 'Terhességben nem javasolt.',
  '{"Az ízületi fájdalmat ritkán kötik a szerhez, pedig ismert mellékhatás, és a szer elhagyására megszűnik"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'dpp4'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Gliklazid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'gliclazid', 'Gliklazid', 'Gliclazide', 'A10BB09', g.id,
  'A hasnyálmirigy béta-sejtjeit serkenti inzulinelválasztásra, függetlenül attól, hogy van-e éppen cukor a vérben.', '{"2-es típusú cukorbetegség"}', '{"1-es típusú cukorbetegség","Súlyos vese- és májelégtelenség","Terhesség"}',
  '{"A vércukoresés a legfontosabb kockázat — a tünetek és a kezelés megtanítása a beteggel és a hozzátartozóval együtt","A kihagyott étkezés a leggyakoribb kiváltó: a gyógyszerbevétel és az étkezés összehangolása alapvető","Idős betegnél az elhúzódó vércukoresés veszélye nagyobb, és a tünetek is jellegtelenebbek lehetnek — zavartság, elesés","A vércukormérés technikájának ellenőrzése","Betegnapok rendje: csökkent étkezésnél a szer adagja módosítást igényelhet"}', '{"Vércukoresés","Testsúlygyarapodás","Emésztőrendszeri panasz"}', '{"Béta-blokkolók: elfedhetik a vércukoresés tüneteit","Alkohol: fokozza a vércukoresést","Egyes antibiotikumok és gombaellenes szerek: fokozzák a hatást"}',
  'Máj- és veseelégtelenségben a vércukoresés kockázata nő.', '{"HbA1c","Vércukor","Kreatinin és eGFR"}', 'Terhességben nem javasolt.',
  '{"Idős betegnél a vércukoresés zavartságként vagy eleséssel jelentkezhet, nem a tipikus izzadással és remegéssel — ezért gyakran nem ismerik fel","A béta-blokkoló elfedi a figyelmeztető tüneteket, kivéve az izzadást"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'szulfonilureak'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Glimepirid ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'glimepirid', 'Glimepirid', 'Glimepiride', 'A10BB12', g.id,
  'Szulfonilurea, napi egyszeri adagolással.', '{"2-es típusú cukorbetegség"}', '{"1-es típusú cukorbetegség","Súlyos vese- és májelégtelenség","Terhesség"}',
  '{"A csoport szempontjai azonosak: vércukoresés, étkezés összehangolása, idős betegnél fokozott figyelem","Napi egyszeri adagolás, jellemzően reggeli étkezéssel"}', '{"Vércukoresés","Testsúlygyarapodás"}', '{"Béta-blokkolók: elfedhetik a vércukoresés tüneteit","Alkohol: fokozza a hatást"}',
  'Vese- és májelégtelenségben fokozott vércukoresés-kockázat.', '{"HbA1c","Vércukor","Kreatinin és eGFR"}', 'Terhességben nem javasolt.',
  '{"A napi egyszeri adagolás elfedheti, hogy a hatás egész nap tart — a kihagyott ebéd is okozhat vércukoresést"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'szulfonilureak'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Atorvasztatin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'atorvastatin', 'Atorvasztatin', 'Atorvastatin', 'C10AA05', g.id,
  'A májban gátolja a koleszterin előállításának kulcsenzimét. A máj emiatt több koleszterint von ki a vérből.', '{"Magas koleszterinszint","Szív- és érrendszeri betegség másodlagos megelőzése","Magas kockázatú beteg elsődleges megelőzése"}', '{"Aktív májbetegség","Terhesség és szoptatás"}',
  '{"Az izompanasz felmérése: hol, mennyire erős, szimmetrikus-e, és mikor kezdődött — a valódi izomkárosodás ritka, és a legtöbb panasz kezelhető adagcsökkentéssel vagy szercserével","Az abbahagyás előtt érdemes szünetet és újrapróbálást javasolni: sokan tolerálják a második próbálkozást vagy a másik statint","Hosszú hatástartamú, ezért bármikor bevehető — nem kötelező este","Az élethosszig tartó kezelés magyarázata: az abbahagyás után a koleszterin hetek alatt visszaáll","A grépfrútlé emeli a vérszintjét","Cukorbetegség kialakulásának enyhén emelkedett kockázata — ez nem ok az elhagyásra, mert a szív- és érrendszeri haszon jóval nagyobb"}', '{"Izomfájdalom","Májenzim-emelkedés","Emésztőrendszeri panasz","Izomkárosodás — ritka","Cukorbetegség enyhén emelkedett kockázata"}', '{"Grépfrútlé: emeli a vérszintjét","Egyes antibiotikumok és gombaellenes szerek: izomkárosodás kockázata nő","Amlodipin: a nagyobb statin-adagok kockázata nő"}',
  'Májon át bomlik le; aktív májbetegségben ellenjavallt. Veseelégtelenségben adagmódosítás jellemzően nem szükséges.', '{"Lipidértékek","Májenzimek a kezelés kezdetén","Izomenzim panasz esetén"}', 'Terhességben és szoptatás alatt ellenjavallt.',
  '{"Az izompanasz miatti végleges abbahagyás gyakori, pedig a betegek nagy része másik statint vagy kisebb adagot tolerál — az újrapróbálás megéri","A célérték nem általános szám: a beteg kockázata határozza meg, és igazolt betegségnél a legszigorúbb"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'statinok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Rozuvasztatin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'rosuvastatin', 'Rozuvasztatin', 'Rosuvastatin', 'C10AA07', g.id,
  'Statin, a csoport legerősebb tagjai közé tartozik.', '{"Magas koleszterinszint","Szív- és érrendszeri betegség megelőzése"}', '{"Aktív májbetegség","Terhesség és szoptatás","Súlyos veseelégtelenség — nagy adagban"}',
  '{"Erősebb hatás kisebb adagban — statin-intolerancia esetén a kis adagú rozuvasztatin jó alternatíva lehet","Vesefunkció szerinti adagkorlát: súlyos veseelégtelenségben a nagy adagok ellenjavalltak","Az izompanasz felmérése azonos a csoport többi tagjáéval","Bármikor bevehető, nem kötelező este"}', '{"Izomfájdalom","Májenzim-emelkedés","Fehérjevizelés nagy adagban"}', '{"Egyes alvadásgátlók: az INR emelkedhet","Antacidok: csökkentik a felszívódását"}',
  'Részben vesén át ürül; súlyos veseelégtelenségben az adag korlátozott. Májbetegségben ellenjavallt.', '{"Lipidértékek","Májenzimek","Vesefunkció nagy adagnál"}', 'Terhességben és szoptatás alatt ellenjavallt.',
  '{"Ázsiai származású betegnél a vérszintje magasabb lehet, ezért az adagolás óvatosabb"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'statinok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Szimvasztatin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'simvastatin', 'Szimvasztatin', 'Simvastatin', 'C10AA01', g.id,
  'Statin, rövidebb hatástartammal — ezért este bevéve hatékonyabb, amikor a koleszterin-előállítás a legélénkebb.', '{"Magas koleszterinszint","Szív- és érrendszeri betegség megelőzése"}', '{"Aktív májbetegség","Terhesség és szoptatás"}',
  '{"Este bevéve hatékonyabb — ez a csoporton belül csak a rövidebb hatástartamú szerekre igaz","Az amlodipinnel együtt az adagja korlátozott: a kettő kölcsönhatása növeli az izomkárosodás kockázatát","A gyógyszerkölcsönhatásai gyakoribbak, mint az újabb statinoké","Az izompanasz felmérése"}', '{"Izomfájdalom","Májenzim-emelkedés","Izomkárosodás — a nagy adag mellett gyakoribb, mint más statinoknál"}', '{"Amlodipin: a statin adagja korlátozott","Grépfrútlé: jelentősen emeli a vérszintjét","Egyes antibiotikumok és gombaellenes szerek: együttadásuk kerülendő"}',
  'Májon át bomlik le; aktív májbetegségben ellenjavallt.', '{"Lipidértékek","Májenzimek","Izomenzim panasz esetén"}', 'Terhességben és szoptatás alatt ellenjavallt.',
  '{"Az amlodipinnel való kölcsönhatás gyakran elkerüli a figyelmet, pedig a két szer együtt gyakori — a statin adagját ilyenkor korlátozni kell","A grépfrútlé hatása ennél a statinnál a legerősebb"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'statinok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Ezetimib ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'ezetimib', 'Ezetimib', 'Ezetimibe', 'C10AX09', g.id,
  'A bélben gátolja a koleszterin felszívódását. Más ponton hat, mint a statin, ezért a kettő együtt adva összeadódik a hatásuk.', '{"Magas koleszterinszint — statin mellé vagy helyette"}', '{"Aktív májbetegség statinnal együtt adva","Terhesség és szoptatás"}',
  '{"Statin mellé adva tovább csökkenti a koleszterint, anélkül hogy az izompanaszt fokozná","Statin-intolerancia esetén önmagában is adható, bár gyengébb hatással","Jól tolerálható, kevés mellékhatással","A kombinált tabletta javítja a beteg-együttműködést"}', '{"Emésztőrendszeri panasz","Izomfájdalom — statinnal együtt","Májenzim-emelkedés — statinnal együtt"}', '{"Epesavkötők: csökkentik a felszívódását","Ciklosporin: kölcsönösen emelik egymás szintjét"}',
  'Májon át bomlik le; májbetegségben statinnal együtt ellenjavallt.', '{"Lipidértékek","Májenzimek statinnal együtt"}', 'Terhességben és szoptatás alatt nem javasolt.',
  '{"Önmagában gyengébb, mint a statin — a helyettesítés csak akkor indokolt, ha a statin nem tolerálható"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'egyeb-lipid'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Bempedoinsav ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'bempedoinsav', 'Bempedoinsav', 'Bempedoic acid', 'C10AX15', g.id,
  'A koleszterin előállítását gátolja, de a statinétól eltérő ponton, és csak a májban aktiválódik — az izomban nem. Ez magyarázza, hogy miért okoz ritkábban izompanaszt.', '{"Magas koleszterinszint statin-intolerancia esetén","Statin mellé, ha az nem elegendő"}', '{"Terhesség és szoptatás"}',
  '{"Statin-intolerancia esetén jön szóba: az izomban nem aktiválódik, ezért ritkábban okoz izompanaszt","A húgysavszint emelkedhet — köszvényes betegnél ez rohamot válthat ki","Az ínszakadás ritka, de ismert szövődmény: az ín körüli fájdalom jelzendő"}', '{"Húgysav-emelkedés, köszvényes roham","Ínpanasz, ritkán ínszakadás","Vérszegénység"}', '{"Szimvasztatin és pravasztatin: az adagjuk korlátozott"}',
  'Máj- és veseelégtelenségben óvatosan.', '{"Lipidértékek","Húgysav","Vérkép"}', 'Terhességben és szoptatás alatt ellenjavallt.',
  '{"A köszvényes roham kiváltása gyakori ok az abbahagyásra — a húgysavszint előzetes ismerete segít a döntésben"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'egyeb-lipid'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Evolokumab ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'evolocumab', 'Evolokumab', 'Evolocumab', 'C10AX13', g.id,
  'Ellenanyag, amely azt a fehérjét blokkolja, amely a máj koleszterin-felvevő receptorait lebontja. Több receptor marad, ezért a máj több koleszterint von ki a vérből.', '{"Nagyon magas kockázatú beteg, ha a statin és az ezetimib nem elegendő","Örökletes koleszterin-anyagcserezavar"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"Kéthetente vagy havonta adott injekció, amit a beteg maga is beadhat — a technika megtanítása és ellenőrzése ápolói feladat","Hűtve tárolandó; a beadás előtt szobahőmérsékletre kell hozni, mert a hideg oldat fájdalmasabb","A beadási helyi reakció gyakori, de enyhe","Nem okoz izompanaszt — statin-intolerancia esetén ez fontos érv"}', '{"Beadási helyi reakció","Felső légúti tünetek","Hátfájás"}', '{"Jelentős kölcsönhatás nem ismert"}',
  'Máj- és veseelégtelenségben adagmódosítás jellemzően nem szükséges.', '{"Lipidértékek"}', 'Terhességben az adatok korlátozottak; a döntés egyedi mérlegelés alapján.',
  '{"A hűtési lánc megszakadása rontja a hatékonyságot — a tárolás szabályainak megbeszélése a kezelés része"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'pcsk9'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

-- ── Alirokumab ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'alirocumab', 'Alirokumab', 'Alirocumab', 'C10AX14', g.id,
  'Ellenanyag, azonos hatásmóddal, mint az evolokumab.', '{"Nagyon magas kockázatú beteg, ha a statin és az ezetimib nem elegendő","Örökletes koleszterin-anyagcserezavar"}', '{"Túlérzékenység a hatóanyagra"}',
  '{"A csoport ápolói szempontjai azonosak: injekciós technika, hűtve tárolás, helyi reakciók","Kéthetente vagy havonta adott injekció"}', '{"Beadási helyi reakció","Felső légúti tünetek"}', '{"Jelentős kölcsönhatás nem ismert"}',
  'Adagmódosítás jellemzően nem szükséges.', '{"Lipidértékek"}', 'Terhességben az adatok korlátozottak.',
  '{"A két PCSK9-gátló nem cserélhető fel automatikusan: az adagolási rend eltér"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'pcsk9'
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
-- Az új főcsoportok tartalma.
select p.name as focsoport, g.name as alcsoport,
  count(s.id) as hatoanyag,
  string_agg(s.name, ', ' order by s.name) as hatoanyagok
from public.drug_groups g
join public.drug_groups p on p.id = g.parent_id
left join public.drug_substances s on s.group_id = g.id and s.publish_status = 'published'
where p.slug in ('diabetes', 'lipidcsokkentok')
  and g.publish_status = 'published'
group by p.name, p.ord, g.name, g.ord
order by p.ord, g.ord;

-- A gyógyszertár teljes állománya főcsoportonként.
select p.name as focsoport, count(s.id) as hatoanyag
from public.drug_groups p
left join public.drug_groups g on g.parent_id = p.id
left join public.drug_substances s on s.group_id = g.id and s.publish_status = 'published'
where p.parent_id is null and p.publish_status = 'published'
group by p.name, p.ord
order by p.ord;
