-- APN-MED — A csoportleírásokban említett antibiotikumok pótlása.
--
-- A csoportok rövid leírása több hatóanyagot nevez meg, mint amennyi ki volt
-- dolgozva. A felhasználó így olyan szereket lát felsorolva, amelyekre kattintva
-- nem talál semmit.
--
-- Nyolc antibiotikum: benzilpenicillin, piperacillin/tazobaktám,
-- imipenem/cilasztatin, klaritromicin, levofloxacin, gentamicin, amikacin,
-- teikoplanin.
--
-- Előfeltétel: a 0065, 0066 és 0070 lefutott.

-- ── Benzilpenicillin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'benzilpenicillin', 'Benzilpenicillin', 'Benzylpenicillin', 'J01CE01', g.id,
  'Az eredeti penicillin. A sejtfal felépítését gátolja. A béta-laktamáz enzimmel szemben védtelen, ezért a spektruma szűk — de ahol hat, ott a leghatékonyabb és a legkevesebb mellékhatással jár.', '{"Streptococcus okozta fertőzések","Neurosyphilis és syphilis","Meningococcus okozta agyhártyagyulladás","Gázgangréna, tetanusz"}', '{"Igazolt penicillin-allergia"}',
  '{"Csak injekcióban adható: gyomorsav bontja, ezért szájon át hatástalan","Rövid felezési idő miatt naponta többször, egyenletes időközönként adandó — az időköz betartása itt különösen fontos","Nagy adagnál a káliumtartalom számít: veseelégtelenségben magas káliumszintet okozhat","Az allergiacímke tisztázása a beadás előtt"}', '{"Allergiás reakció, ritkán anafilaxia","Magas káliumszint nagy adagnál","Görcsroham igen nagy adagnál vagy veseelégtelenségben"}', '{"Probenecid: lassítja az ürülést, ezzel emeli a szintet"}',
  'Vesén át ürül; veseelégtelenségben adagmódosítás szükséges, és a görcsroham kockázata nagyobb.', '{"Vesefunkció","Kálium nagy adagnál"}', 'Terhességben a penicillinek a biztonságosabb választások közé tartoznak; a döntés az alkalmazási előírás alapján.',
  '{"Szűk spektrum, de ahol hat, ott jobb a széles spektrumú szereknél — a Streptococcus okozta fertőzésben ez az elsődleges választás","A depó készítmények (benzatin) nem adhatók vénásan: csak izomba, és a téves vénás adás súlyos szövődményt okoz"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'penicillinek'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_antibiotics
  (substance_id, spectrum, spectrum_gaps, action, resistance, stewardship, narrower_option)
select s.id, '{"Streptococcus fajok","Neisseria meningitidis","Treponema pallidum","Clostridium fajok","Actinomyces"}', '{"Béta-laktamázt termelő Staphylococcus aureus","MRSA","Enterobacterales","Pseudomonas","Atípusos kórokozók"}', 'Baktériumölő',
  'A béta-laktamáz termelés miatt a staphylococcusok nagy része ellenálló. A pneumococcusok körében a csökkent érzékenység terjed.', '{"Ahol hatásos, ott elsőként választandó — a legszűkebb spektrumú béta-laktám"}', null
from public.drug_substances s where s.slug = 'benzilpenicillin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Piperacillin/tazobaktám ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'piperacillin-tazobaktam', 'Piperacillin/tazobaktám', 'Piperacillin/tazobactam', 'J01CR05', g.id,
  'A piperacillin széles spektrumú penicillin, a tazobaktám pedig béta-laktamáz-gátló, amely megvédi a lebontástól. Együtt a legszélesebb spektrumú penicillin-kombináció.', '{"Kórházi tüdőgyulladás","Súlyos hasi fertőzés","Lázas neutropenia","Bőr- és lágyrészfertőzés súlyos formája"}', '{"Igazolt penicillin- vagy béta-laktám-allergia"}',
  '{"Elhúzódó beadás javasolt lehet: a hatás idődependens, és a hosszabb infúzió javítja a hatékonyságot súlyos fertőzésben","Vankomicinnel együtt adva a vesekárosodás kockázata nagyobb, mint külön-külön — ez a kombináció gyakori, és a vesefunkció szoros követését igényli","Vesefunkció szerinti adagmódosítás szükséges","Széles spektrumú szer: a tenyésztés utáni szűkítés lehetőségének felvetése"}', '{"Hasmenés, Clostridioides difficile fertőzés","Vesekárosodás","Vérképzőrendszeri eltérés hosszabb kezelésnél","Bőrkiütés"}', '{"Vankomicin: a vesekárosodás kockázata összeadódik és meg is haladja a külön-külön mértéket","Metotrexát: a szintje emelkedhet","Aminoglikozidok: külön vonalon adandók, mert kicsapódhatnak"}',
  'Vesén át ürül; veseelégtelenségben adagmódosítás szükséges.', '{"Vesefunkció — gyakran, különösen vankomicin mellett","Vérkép"}', 'Terhességben mérlegelhető; a döntés az alkalmazási előírás alapján.',
  '{"A vankomicinnel való együttadás vesekárosító hatása jól dokumentált, mégis gyakran együtt adják anélkül, hogy a vesefunkciót sűrűbben ellenőriznék","Az Enterococcus faeciumra és a MRSA-ra nem hat, pedig a széles spektrum miatt sokan mindenre alkalmasnak gondolják"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'penicillinek'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_antibiotics
  (substance_id, spectrum, spectrum_gaps, action, resistance, stewardship, narrower_option)
select s.id, '{"Enterobacterales","Pseudomonas aeruginosa","Anaerobok","Enterococcus faecalis","Meticillin-érzékeny Staphylococcus aureus"}', '{"MRSA","Enterococcus faecium","Atípusos kórokozók","ESBL-termelő törzsek nagy része"}', 'Baktériumölő',
  'Az ESBL-termelő törzsek ellen a hatás bizonytalan; súlyos fertőzésben ilyenkor karbapenem javasolt.', '{"Empirikus kezelésként súlyos kórházi fertőzésben indokolt lehet","A tenyésztés után szűkíteni kell — ez a lépés gyakran elmarad"}', 'Harmadik generációs cefalosporin, ha a Pseudomonas nem jön szóba.'
from public.drug_substances s where s.slug = 'piperacillin-tazobaktam'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Imipenem/cilasztatin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'imipenem-cilasztatin', 'Imipenem/cilasztatin', 'Imipenem/cilastatin', 'J01DH51', g.id,
  'Az imipenem karbapenem, a cilasztatin pedig nem antibiotikum: azt az enzimet gátolja a vesében, amely az imipenemet lebontaná. Enélkül a hatóanyag a vesében elbomlana, mielőtt hatna.', '{"Súlyos, több kórokozó okozta fertőzés","Kórházi tüdőgyulladás","ESBL-termelő törzs okozta fertőzés","Lázas neutropenia"}', '{"Igazolt karbapenem-allergia"}',
  '{"Végső tartalék: a javallat felülvizsgálata minden alkalommal indokolt","A görcsroham kockázata nagyobb, mint a meropenemé — agyhártyagyulladásban ezért a meropenem az elsődleges","Vesefunkció szerinti adagmódosítás szükséges","A tenyésztés utáni szűkítés lehetőségének felvetése"}', '{"Görcsroham — gyakoribb, mint meropenemnél","Hányinger, hányás gyors beadásnál","Hasmenés, Clostridioides difficile fertőzés","Bőrkiütés"}', '{"Valproát: a szintjét jelentősen csökkenti, ami görcsrohamot válthat ki","Ganciklovir: fokozott görcsroham-kockázat"}',
  'Vesén át ürül; veseelégtelenségben adagmódosítás szükséges, és a görcsroham kockázata jelentősen nő.', '{"Vesefunkció","Idegrendszeri tünetek","Vérkép"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"Agyhártyagyulladásban nem elsődleges: a görcsroham kockázata miatt ott a meropenem a választandó","A valproáttal való kölcsönhatás ugyanúgy fennáll, mint a meropenemnél — a görcsroham elleni védelem megszűnhet"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'karbapenemek'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_antibiotics
  (substance_id, spectrum, spectrum_gaps, action, resistance, stewardship, narrower_option)
select s.id, '{"Enterobacterales, ESBL-termelő törzsek is","Pseudomonas aeruginosa","Anaerobok","Enterococcus faecalis","Streptococcus fajok"}', '{"MRSA","Enterococcus faecium","Stenotrophomonas maltophilia","Karbapenem-rezisztens törzsek"}', 'Baktériumölő',
  'A karbapenem-rezisztencia terjedése világszerte súlyos gond.', '{"Nem első választás: súlyos, más szerrel nem kezelhető fertőzésben indokolt","A tenyésztés után szűkíteni kell"}', 'Piperacillin/tazobaktám vagy cefalosporin, ha a kórokozó érzékeny.'
from public.drug_substances s where s.slug = 'imipenem-cilasztatin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Klaritromicin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'klaritromicin', 'Klaritromicin', 'Clarithromycin', 'J01FA09', g.id,
  'Makrolid: a baktérium fehérjeszintézisét gátolja a riboszómához kötődve. Az azitromicinnél erősebben gátol bizonyos májenzimeket, ezért több a kölcsönhatása.', '{"Atípusos kórokozó okozta tüdőgyulladás","Légúti fertőzések","Helicobacter pylori eradikáció, kombinációban","Béta-laktám-allergia esetén alternatíva"}', '{"Makrolid-allergia","Súlyos májelégtelenség","Együttadás egyes koleszterincsökkentőkkel és ritmusszabályozókkal"}',
  '{"A kölcsönhatások száma nagy: a teljes gyógyszerlista átnézése a beadás előtt kötelező — ez a szer legfontosabb sajátossága","QT-megnyúlás kockázata, különösen más QT-nyújtó szerrel együtt","Naponta kétszer adandó, ellentétben az azitromicinnel","Fémes szájíz gyakori panasz; nem veszélyes, de rontja az együttműködést"}', '{"Fémes szájíz","Hasmenés, hányinger","QT-megnyúlás","Májenzim-emelkedés","Ritkán májkárosodás"}', '{"Sztatinok — különösen a szimvasztatin és az atorvasztatin: izomkárosodás kockázata, együttadásuk kerülendő","Kumarin típusú véralvadásgátló: az INR jelentősen emelkedhet","Kalciumcsatorna-blokkolók: vérnyomásesés","Kolchicin: mérgezés veszélye","QT-nyújtó szerek"}',
  'Májon át bomlik le; súlyos májbetegségben kerülendő. Veseelégtelenségben adagmódosítás szükséges lehet.', '{"EKG QT-megnyúlás kockázatánál","INR, ha véralvadásgátlót is szed"}', 'Terhességben az azitromicin jellemzően a biztonságosabb választás; a döntés az alkalmazási előírás alapján.',
  '{"A sztatinnal való együttadás izomkárosodást okozhat — ez a leggyakoribb súlyos kölcsönhatás, és a beteg gyógyszerlistája alapján előre kivédhető","A pneumococcus-rezisztencia miatt súlyos tüdőgyulladásban önmagában nem elegendő"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'makrolidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_antibiotics
  (substance_id, spectrum, spectrum_gaps, action, resistance, stewardship, narrower_option)
select s.id, '{"Mycoplasma pneumoniae","Chlamydia fajok","Legionella","Helicobacter pylori","Streptococcus fajok"}', '{"Rezisztens Streptococcus pneumoniae","MRSA","Enterobacterales","Pseudomonas"}', 'Szaporodásgátló',
  'A makrolid-rezisztencia a pneumococcusok és a Helicobacter pylori körében egyaránt növekvő.', '{"Vírusos légúti fertőzésben nem indokolt","Súlyos tüdőgyulladásban béta-laktámmal együtt, nem helyette"}', null
from public.drug_substances s where s.slug = 'klaritromicin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Levofloxacin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'levofloxacin', 'Levofloxacin', 'Levofloxacin', 'J01MA12', g.id,
  'Fluorokinolon: a baktérium DNS-ének feltekeredéséért felelős enzimeket gátolja. A ciprofloxacinnál erősebb Gram-pozitív hatás, ezért légúti fertőzésekben inkább ez jön szóba.', '{"Közösségben szerzett tüdőgyulladás, ha más szer nem alkalmas","Szövődményes húgyúti fertőzés","Krónikus prosztatagyulladás","Tuberkulózis másodvonalbeli kezelése"}', '{"Kinolon-allergia","Korábbi kinolonhoz köthető ínsérülés","Epilepszia","Myasthenia gravis"}',
  '{"Ínfájdalom azonnali jelzése: a kinolonok ínszakadást okozhatnak, akár hetekkel a kezelés után is","Kalcium-, magnézium-, vas- és cinktartalmú készítménnyel legalább két óra különbséggel adható — együtt bevéve a felszívódás jelentősen romlik","Idegrendszeri tünetek figyelése: szédülés, zavartság, alvászavar","Vesefunkció szerinti adagmódosítás szükséges"}', '{"Ínszakadás, ínfájdalom","Perifériás idegkárosodás","Idegrendszeri tünetek, ritkán pszichiátriai tünetek","QT-megnyúlás","Aortatágulat fokozott kockázata","Vércukorszint-ingadozás"}', '{"Kétértékű fémionok: a felszívódást gátolják","Kortikoszteroidok: az ínsérülés kockázata többszörös","Vércukorcsökkentők: a vércukor kiszámíthatatlanul ingadozhat","QT-nyújtó szerek"}',
  'Vesén át ürül; veseelégtelenségben adagmódosítás szükséges.', '{"Vesefunkció","Vércukor cukorbetegnél","Ínpanasz célzott kérdezése"}', 'Terhességben kerülendő; a döntés az alkalmazási előírás alapján.',
  '{"Szteroidkezelés mellett az ínsérülés kockázata többszörös — ez a kombináció idős betegnél különösen veszélyes","Cukorbetegnél a vércukor mindkét irányban kiszámíthatatlanul mozoghat","A tüdőgyulladás első választása nem ez: csak akkor, ha más szer nem alkalmas"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'fluorokinolonok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_antibiotics
  (substance_id, spectrum, spectrum_gaps, action, resistance, stewardship, narrower_option)
select s.id, '{"Streptococcus pneumoniae","Haemophilus influenzae","Atípusos kórokozók","Enterobacterales","Mycobacterium tuberculosis"}', '{"MRSA","Anaerobok — gyenge hatás","Pseudomonas — a ciprofloxacinnál gyengébb"}', 'Baktériumölő',
  'A rezisztencia gyorsan terjed; a széles körű használat felgyorsítja.', '{"Enyhe fertőzésben kerülendő a mellékhatásprofil miatt","Tüdőgyulladásban béta-laktám és makrolid kombinációja gyakran jobb választás"}', 'Amoxicillin vagy cefuroxim légúti fertőzésben, ha a kórokozó érzékeny.'
from public.drug_substances s where s.slug = 'levofloxacin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Gentamicin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'gentamicin', 'Gentamicin', 'Gentamicin', 'J01GB03', g.id,
  'Aminoglikozid: a riboszómához kötődve hibás fehérjék készítésére kényszeríti a baktériumot, ami elpusztul. A hatás koncentrációfüggő: a magas csúcsérték a döntő, nem a folyamatos jelenlét.', '{"Súlyos Gram-negatív fertőzés","Szívbelhártya-gyulladás, kombinációban","Súlyos szepszis kiegészítő szereként"}', '{"Aminoglikozid-allergia","Myasthenia gravis","Súlyos veseelégtelenség — mérlegelés kérdése"}',
  '{"A szintmérés a kezelés része, nem választható: a csúcs- és a völgyszint időzítése meghatározza az eredmény értelmezhetőségét","A völgyszint közvetlenül a következő adag előtt veendő — a rossz időzítés értelmezhetetlen eredményt ad","Halláspanasz, fülzúgás, szédülés jelzésének kérése: a halláskárosodás visszafordíthatatlan lehet","Vesefunkció és vizeletmennyiség napi követése","Naponta egyszeri adagolás gyakran előnyösebb: a koncentrációfüggő hatás miatt hatékonyabb, és kevesebb vesekárosodással jár"}', '{"Vesekárosodás","Halláskárosodás és egyensúlyzavar — visszafordíthatatlan lehet","Izomgyengeség myasthenia gravisban"}', '{"Vankomicin: a vesekárosodás kockázata összeadódik","Kacsdiuretikumok: fokozott halláskárosodás","Béta-laktámok: külön vonalon adandók, mert kicsapódhatnak"}',
  'Vesén át ürül, és maga is vesekárosító. A vesefunkció ismerete és követése a kezelés feltétele.', '{"Gentamicin-szint — csúcs és völgy, pontos időzítéssel","Kreatinin és eGFR naponta","Vizeletmennyiség","Halláspanasz kérdezése"}', 'Terhességben kerülendő: magzati halláskárosodást okozhat. A döntés az alkalmazási előírás alapján.',
  '{"A szintmérés rossz időzítése a leggyakoribb hiba: a völgyszintet közvetlenül a következő adag előtt kell venni, nem bármikor","A halláskárosodás alattomos: gyakran csak a kezelés után derül ki, és visszafordíthatatlan","Béta-laktámmal egy vonalon adva kicsapódik — a két szer beadását el kell választani"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'aminoglikozidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_antibiotics
  (substance_id, spectrum, spectrum_gaps, action, resistance, stewardship, narrower_option)
select s.id, '{"Enterobacterales","Pseudomonas aeruginosa","Staphylococcus — kombinációban"}', '{"Anaerobok — teljesen hatástalan","Streptococcus fajok önmagában","Atípusos kórokozók"}', 'Baktériumölő',
  'Az enzimes lebontás a leggyakoribb mechanizmus; a rezisztencia törzsenként eltérő.', '{"Rövid kezelés javasolt: a mellékhatások az időtartammal nőnek","Anaerob fertőzésben hatástalan — kombinációra van szükség"}', null
from public.drug_substances s where s.slug = 'gentamicin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Amikacin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'amikacin', 'Amikacin', 'Amikacin', 'J01GB06', g.id,
  'Aminoglikozid, amely szerkezetéből adódóan ellenállóbb a baktériumok lebontó enzimeivel szemben, mint a gentamicin. Ezért hatásos olyan törzseknél is, amelyek a gentamicinre már nem.', '{"Gentamicin-rezisztens Gram-negatív fertőzés","Többszörösen rezisztens kórokozó okozta súlyos fertőzés","Atípusos mycobacteriumok, kombinációban"}', '{"Aminoglikozid-allergia","Myasthenia gravis"}',
  '{"Ugyanaz a szintmérési rend, mint a gentamicinnél — a célértékek viszont eltérők","Halláskárosodás kockázata: a magasabb frekvenciák sérülnek először, amit a beteg sokáig nem vesz észre","Vesefunkció napi követése","Tartalék szer: a javallat felülvizsgálata indokolt"}', '{"Vesekárosodás","Halláskárosodás — visszafordíthatatlan lehet","Egyensúlyzavar"}', '{"Vankomicin és más vesekárosító szerek: a kockázat összeadódik","Kacsdiuretikumok: fokozott halláskárosodás"}',
  'Vesén át ürül, és maga is vesekárosító. Veseelégtelenségben az adag és az adagolási időköz egyaránt módosítandó.', '{"Amikacin-szint","Kreatinin naponta","Halláspanasz kérdezése"}', 'Terhességben kerülendő: magzati halláskárosodást okozhat.',
  '{"A gentamicinnel nem cserélhető fel azonos adagban: az amikacin adagja jóval magasabb, és a szintcélok is eltérők","Tartalék szerként kezelendő: a széles körű használat elveszi a lehetőséget a gentamicin-rezisztens fertőzések kezelésére"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'aminoglikozidok'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_antibiotics
  (substance_id, spectrum, spectrum_gaps, action, resistance, stewardship, narrower_option)
select s.id, '{"Gentamicin-rezisztens Enterobacterales","Pseudomonas aeruginosa","Acinetobacter","Atípusos mycobacteriumok"}', '{"Anaerobok","Streptococcus fajok önmagában","Atípusos kórokozók"}', 'Baktériumölő',
  'Ellenállóbb a lebontó enzimekkel szemben, mint a gentamicin, de a rezisztencia itt is terjed.', '{"Tartalék szer: gentamicin-rezisztencia vagy annak erős gyanúja esetén","Rövid kezelés javasolt"}', 'Gentamicin, ha a kórokozó arra érzékeny.'
from public.drug_substances s where s.slug = 'amikacin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Teikoplanin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'teikoplanin', 'Teikoplanin', 'Teicoplanin', 'J01XA02', g.id,
  'Glikopeptid, a vankomicinhez hasonlóan a sejtfal felépítését gátolja. Hosszabb felezési idejű, ezért naponta egyszer adható, és a beadási reakció is ritkább.', '{"MRSA okozta fertőzés","Súlyos Gram-pozitív fertőzés béta-laktám-allergia esetén","Csont- és ízületi fertőzés","Peritonealis dialízishez társuló fertőzés"}', '{"Glikopeptid-allergia"}',
  '{"A vankomicinnél ritkábban okoz beadási reakciót és vesekárosodást — ez a választás egyik fő oka","A hatás beállásához telítő adag szükséges: enélkül napokig nem éri el a terápiás szintet","Szintmérés a telítés után javasolt","Izomba is adható, ami a vankomicinnél nem lehetséges"}', '{"Bőrkiütés","Vesekárosodás — ritkábban, mint vankomicinnél","Halláskárosodás hosszabb kezelésnél","Vérlemezkeszám-csökkenés"}', '{"Aminoglikozidok: fokozott vese- és halláskárosodás","Kacsdiuretikumok: fokozott halláskárosodás"}',
  'Vesén át ürül; veseelégtelenségben az adagolási időköz módosítása szükséges.', '{"Teikoplanin-szint a telítés után","Vesefunkció","Vérkép"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A telítő adag elhagyása a leggyakoribb hiba: enélkül a szer napokig hatástalan marad, miközben a beteg kezelést kap","A vankomicinnel nem cserélhető fel azonos adagban"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'glikopeptidek'
on conflict (slug) do update set
  name = excluded.name, group_id = excluded.group_id,
  mechanism = excluded.mechanism, indications = excluded.indications,
  contraindications = excluded.contraindications, apn_focus = excluded.apn_focus,
  adverse = excluded.adverse, interactions = excluded.interactions,
  organ_note = excluded.organ_note, monitoring = excluded.monitoring,
  pregnancy = excluded.pregnancy, pitfalls = excluded.pitfalls,
  spc_url = excluded.spc_url, source_note = excluded.source_note,
  last_verified = excluded.last_verified, publish_status = excluded.publish_status;

insert into public.drug_antibiotics
  (substance_id, spectrum, spectrum_gaps, action, resistance, stewardship, narrower_option)
select s.id, '{"MRSA","Meticillin-rezisztens koaguláz-negatív Staphylococcus","Streptococcus fajok","Enterococcus fajok"}', '{"Minden Gram-negatív kórokozó","Vankomicin- és teikoplanin-rezisztens Enterococcus"}', 'Baktériumölő',
  'Egyes Enterococcus-törzsek a vankomicinre rezisztensek, de a teikoplaninra érzékenyek maradhatnak — ez a rezisztencia típusától függ.', '{"Célzott szer: igazolt vagy erősen valószínű rezisztens Gram-pozitív kórokozónál","Meticillin-érzékeny törzsnél béta-laktám hatékonyabb"}', 'Béta-laktám meticillin-érzékeny törzsnél.'
from public.drug_substances s where s.slug = 'teikoplanin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- Az antibiotikum-csoport teljes tartalma alcsoportonként.
select g.name as alcsoport, count(s.id) as hatoanyag,
  string_agg(s.name, ', ' order by s.name) as hatoanyagok
from public.drug_groups g
left join public.drug_substances s
  on s.group_id = g.id and s.publish_status = 'published'
join public.drug_groups p on p.id = g.parent_id
where p.slug = 'antibiotikumok' and g.publish_status = 'published'
group by g.name, g.ord
order by g.ord;
