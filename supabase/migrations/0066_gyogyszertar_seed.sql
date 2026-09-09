-- APN-MED — Gyógyszertár: kezdő adatkészlet.
--
-- Négy főcsoport, öt antibiotikum-alcsoport és öt hatóanyag. A súlypont az
-- antibiotikumokon van: ezek a leggyakrabban használt és leggyakrabban
-- félrehasznált szerek.
--
-- Minden hatóanyagnál szerepel egy „buktatók” szakasz. Ez a modul
-- legértékesebb része: azt gyűjti össze, amit a gyakorlatban gyakran
-- elrontanak, és amit a gyógyszerkönyvben nem találni meg.
--
-- Adagolás szándékosan nincs: az az alkalmazási előírás dolga.
--
-- Előfeltétel: a 0065 lefutott.

-- ══ Főcsoportok ══════════════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, short, description, key_points, apn_notes, icon, ord, publish_status)
values ('antibiotikumok', 'Antibiotikumok', 'J01', 'Bakteriális fertőzések kezelése',
  'A leggyakrabban használt és leggyakrabban félrehasznált gyógyszercsoport. A helyes választás nem csak a beteg gyógyulását dönti el, hanem a rezisztencia alakulását is.', '{"A szűk spektrumú szer, ha hatásos, mindig jobb a széles spektrumúnál: kevesebb mellékhatás, kevesebb rezisztencia, kevesebb bélflóra-károsodás.","A mintavétel a kezelés megkezdése előtt történjen, ha az állapot engedi — utána a tenyésztés eredménye bizonytalanabb.","Az empirikus kezelést a tenyésztés eredménye alapján szűkíteni kell; ez a lépés gyakran elmarad.","A kezelés hossza a javallattól függ, és a legtöbb fertőzésnél rövidebb, mint régen gondoltuk.","A penicillin-allergia címkék nagy része téves, és a téves címke szélesebb spektrumú, kockázatosabb szerhez vezet."}', '{"A mintavétel biztosítása a kezelés megkezdése előtt","Az allergiacímke tisztázása: mi történt pontosan, mikor, kellett-e kezelés","A beadási idők betartása — a rövid felezési idejű szereknél ez a hatékonyság feltétele","A vesefunkció ismerete: sok antibiotikum adagja ettől függ","A kezelés hosszának követése és a szűkítés lehetőségének felvetése","A hasmenés jelzése: a Clostridioides difficile fertőzés antibiotikum-kezelés szövődménye"}',
  '🦠', 1, 'published')
on conflict (slug) do update set
  name = excluded.name, short = excluded.short, description = excluded.description,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, short, description, key_points, apn_notes, icon, ord, publish_status)
values ('fajdalomcsillapitok', 'Fájdalomcsillapítók', 'N02', 'Nem opioid és opioid szerek',
  'A fájdalomcsillapítás lépcsőzetes: a gyengébb szerekkel kezdünk, és szükség szerint lépünk feljebb.', '{"A paracetamol a legbiztonságosabb kiindulópont, de a napi összmennyiség korlátos — a kombinált készítményekben is benne van.","A nem szteroid gyulladáscsökkentők vesekárosodást, gyomorvérzést és szívelégtelenség-romlást okozhatnak; idős betegnél különösen óvatosan."}', '{"A fájdalom rendszeres mérése és dokumentálása","A kombinált készítményekben rejtett paracetamol számbavétele"}',
  '💊', 2, 'published')
on conflict (slug) do update set
  name = excluded.name, short = excluded.short, description = excluded.description,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, short, description, key_points, apn_notes, icon, ord, publish_status)
values ('kardiovaszkularis', 'Szív- és érrendszeri szerek', 'C', 'Vérnyomás, szívelégtelenség, ritmuszavar',
  'A leggyakrabban szedett gyógyszercsoport, sok kölcsönhatással.', '{"A vérnyomáscsökkentők hatása napok-hetek alatt épül fel; a gyors adagemelés ájulást okozhat."}', '{"Fekvő és álló vérnyomás mérése adagváltoztatás után"}',
  '🫀', 3, 'published')
on conflict (slug) do update set
  name = excluded.name, short = excluded.short, description = excluded.description,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, short, description, key_points, apn_notes, icon, ord, publish_status)
values ('veralvadas', 'Véralvadásra ható szerek', 'B01', 'Antikoagulánsok és vérlemezke-gátlók',
  'Magas kockázatú gyógyszercsoport: a hiba mindkét irányban súlyos következménnyel jár.', '{"A vérzés és a trombózis között kell egyensúlyozni; a döntés mindig egyéni.","A beavatkozások előtti szüneteltetés rendje szerenként eltér."}', '{"Vérzésjelek célzott keresése: melaena, haematuria, bőrvérzés","A beavatkozások előtti szüneteltetés dokumentálása"}',
  '🩸', 4, 'published')
on conflict (slug) do update set
  name = excluded.name, short = excluded.short, description = excluded.description,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

-- ══ Antibiotikum-alcsoportok ═════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, key_points, apn_notes, ord, publish_status)
select 'beta-laktamok', 'Béta-laktámok', 'J01C', p.id, 'Penicillinek, cefalosporinok, karbapenemek',
  'A legszélesebb körben használt antibiotikumcsalád. Közös bennük a béta-laktám gyűrű, amely a baktérium sejtfalának felépítését gátolja.', '{"A csoporton belüli keresztreakció kockázata kisebb, mint azt korábban feltételezték: a penicillin-allergia nem zárja ki automatikusan a cefalosporint.","Az idődependens hatás miatt a beadási időköz betartása fontosabb, mint az egyszeri adag nagysága.","A karbapenemek végső tartalékként kezelendők."}', '{"A beadási idők pontos betartása","Az allergiacímke tisztázása a választás előtt"}', 1, 'published'
from public.drug_groups p where p.slug = 'antibiotikumok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, key_points, apn_notes, ord, publish_status)
select 'makrolidok', 'Makrolidok', 'J01FA', p.id, 'Azitromicin, klaritromicin',
  'Atípusos kórokozókra és béta-laktám-allergia esetén használt csoport.', '{"Jelentős kölcsönhatások: a klaritromicin sok gyógyszer szintjét emeli.","QT-megnyúlást okozhatnak — más QT-nyújtó szerrel együtt fokozott kockázat."}', '{"A gyógyszerlista átnézése kölcsönhatásra","QT-megnyúlás figyelése"}', 2, 'published'
from public.drug_groups p where p.slug = 'antibiotikumok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, key_points, apn_notes, ord, publish_status)
select 'fluorokinolonok', 'Fluorokinolonok', 'J01M', p.id, 'Ciprofloxacin, levofloxacin',
  'Széles spektrumú, jól felszívódó szerek — de a mellékhatásprofiljuk miatt az alkalmazásuk korlátozott.', '{"Ínszakadás, idegkárosodás és aortatágulat kockázata miatt csak akkor választandók, ha más szer nem alkalmas.","Enyhe fertőzésekben — például szövődménymentes húgyúti fertőzésben — kerülendők.","Idős betegnél és szteroidkezelés mellett az ínsérülés kockázata nagyobb."}', '{"Ínfájdalom jelzésének kérése a betegtől","A javallat felülvizsgálata: van-e szűkebb spektrumú alternatíva"}', 3, 'published'
from public.drug_groups p where p.slug = 'antibiotikumok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, key_points, apn_notes, ord, publish_status)
select 'aminoglikozidok', 'Aminoglikozidok', 'J01G', p.id, 'Gentamicin, amikacin',
  'Erős, Gram-negatív hatású szerek, szűk terápiás tartománnyal.', '{"Vese- és halláskárosodást okozhatnak; a szintmérés nem választható, hanem a kezelés része.","A csúcs- és völgyszint mérésének időzítése meghatározza az eredmény értelmezhetőségét."}', '{"A szintmérés időzítésének pontos betartása és dokumentálása","Vesefunkció és vizeletmennyiség követése","Halláspanasz, fülzúgás, szédülés jelzésének kérése"}', 4, 'published'
from public.drug_groups p where p.slug = 'antibiotikumok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, key_points, apn_notes, ord, publish_status)
select 'glikopeptidek', 'Glikopeptidek', 'J01XA', p.id, 'Vankomicin, teikoplanin',
  'Gram-pozitív, jellemzően rezisztens kórokozók elleni szerek.', '{"A vankomicin gyors beadása szövetszerte kipirulást okozhat — ez nem allergia, hanem beadási sebességgel összefüggő reakció.","Szintmérés szükséges, és a vesefunkció szoros követése."}', '{"A beadás lassítása kipirulás esetén — a leállítás jellemzően nem szükséges","Szintmérés a következő adag előtt"}', 5, 'published'
from public.drug_groups p where p.slug = 'antibiotikumok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, key_points = excluded.key_points,
  apn_notes = excluded.apn_notes, publish_status = excluded.publish_status;

-- ══ Hatóanyagok ══════════════════════════════════════════
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'amoxicillin-klavulansav', 'Amoxicillin/klavulánsav', 'Amoxicillin/clavulanic acid', 'J01CR02', g.id,
  'Az amoxicillin a baktérium sejtfalának felépítését gátolja. A klavulánsav önmagában alig hat, de megköti a béta-laktamáz enzimet, így megvédi az amoxicillint a lebontástól.', '{"Középfülgyulladás, arcüreggyulladás","Közösségben szerzett tüdőgyulladás","Bőr- és lágyrészfertőzés","Harapási sérülés","Húgyúti fertőzés"}', '{"Igazolt penicillin- vagy béta-laktám-allergia","Korábbi, e szerhez köthető májkárosodás"}',
  '{"Étkezés közben adva jobban tolerálható és kevesebb hasmenést okoz","A hasmenés a leggyakoribb mellékhatás; ha vizes, gyakori és lázzal jár, Clostridioides difficile fertőzésre kell gondolni","Az allergiacímke tisztázása a beadás előtt","Vesefunkció-romlásnál az adag módosítása szükséges — az orvos jelzése"}', '{"Hasmenés, hányinger","Bőrkiütés","Ritkán májenzim-emelkedés, epepangás","Gombás felülfertőződés hosszabb kezelésnél"}', '{"Metotrexát: a szintje emelkedhet","Allopurinol: gyakoribb bőrkiütés","Kumarin típusú véralvadásgátló: az INR emelkedhet"}',
  'Vesefunkció szerint adagmódosítás szükséges. Májbetegségben óvatosan.', '{"Vesefunkció hosszabb kezelésnél","Májenzimek elhúzódó kezelésnél"}', 'Terhességben a béta-laktámok általában a biztonságosabb választások közé tartoznak; a döntés az alkalmazási előírás és az orvosi mérlegelés alapján.',
  '{"A vírusos felső légúti fertőzésre adott antibiotikum nem gyorsítja a gyógyulást, viszont mellékhatást és rezisztenciát okoz","A klavulánsav miatt gyakoribb a hasmenés, mint a tiszta amoxicillinnél — ha a kórokozó nem termel béta-laktamázt, a tiszta amoxicillin a jobb választás"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'beta-laktamok'
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
select s.id, '{"Streptococcus fajok","Haemophilus influenzae","Moraxella catarrhalis","Béta-laktamázt termelő Staphylococcus aureus (nem MRSA)","Anaerobok","Egyes Enterobacterales törzsek"}', '{"MRSA","Pseudomonas aeruginosa","Atípusos kórokozók: Mycoplasma, Chlamydia, Legionella","ESBL-termelő Gram-negatív törzsek"}', 'Baktériumölő',
  'A béta-laktamáz termelés a leggyakoribb mechanizmus, amit a klavulánsav kivéd. Az ESBL- és AmpC-termelés ellen viszont nem hatásos.', '{"Vírusos felső légúti fertőzésben nem indokolt","Ha a kórokozó tiszta amoxicillinre érzékeny, arra kell szűkíteni","Szövődménymentes húgyúti fertőzésben szűkebb spektrumú szer az elsődleges"}', 'Amoxicillin önmagában, ha a kórokozó nem termel béta-laktamázt.'
from public.drug_substances s where s.slug = 'amoxicillin-klavulansav'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'ceftriaxon', 'Ceftriaxon', 'Ceftriaxone', 'J01DD04', g.id,
  'Harmadik generációs cefalosporin: a sejtfal felépítését gátolja, és a béta-laktamázok jelentős részével szemben ellenálló.', '{"Súlyos közösségben szerzett tüdőgyulladás","Agyhártyagyulladás","Súlyos húgyúti fertőzés","Hasi fertőzés, kiegészítő szerrel","Gonorrhoea"}', '{"Igazolt cefalosporin-allergia","Újszülöttkorban kalciumtartalmú infúzióval együtt — kicsapódás veszélye","Súlyos sárgaságos újszülött"}',
  '{"Naponta egyszeri adagolás jellemző — a hosszú felezési idő miatt","Kalciumtartalmú oldattal nem adható egy vonalon: kicsapódhat","Vesefunkció szerinti módosítás jellemzően nem szükséges, ami előny veseelégtelenségben","Epepangás jeleinek figyelése hosszabb kezelésnél: sárgaság, jobb bordaív alatti fájdalom"}', '{"Hasmenés","Bőrkiütés","Epeüledék, epekő-szerű képlet hosszabb kezelésnél","Ritkán vérképzőrendszeri eltérés"}', '{"Kalciumtartalmú infúzió: kicsapódás, közös vonalon tilos","Kumarin típusú véralvadásgátló: az INR emelkedhet"}',
  'Az epével is ürül, ezért veseelégtelenségben jellemzően nem igényel adagmódosítást. Súlyos máj- és veseelégtelenség együttes fennállásakor óvatosság szükséges.', '{"Májfunkció elhúzódó kezelésnél","Vérkép hosszabb kezelésnél"}', 'A cefalosporinok terhességben általában használhatók; a döntés az alkalmazási előírás alapján.',
  '{"Széles spektrumú szer: az empirikus kezelést a tenyésztés eredménye alapján szűkíteni kell — ez a lépés gyakran elmarad","Nem hat Pseudomonasra, pedig sokan széles spektrumúként mindenre alkalmasnak gondolják"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'beta-laktamok'
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
select s.id, '{"Streptococcus pneumoniae","Haemophilus influenzae","Neisseria fajok","Enterobacterales nagy része","Borrelia"}', '{"Pseudomonas aeruginosa","MRSA","Enterococcus fajok","Atípusos kórokozók","ESBL-termelő törzsek"}', 'Baktériumölő',
  'Az ESBL- és AmpC-termelő Gram-negatív törzsek ellenállók.', '{"Empirikus kezelésként indokolt lehet, de a tenyésztés után szűkíteni kell","Szövődménymentes fertőzésben szűkebb spektrumú szer az elsődleges","Az Enterococcus elleni hatás hiánya miatt hasi fertőzésben kiegészítő szer szükséges lehet"}', 'Amoxicillin vagy első generációs cefalosporin, ha a kórokozó érzékeny.'
from public.drug_substances s where s.slug = 'ceftriaxon'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'azitromicin', 'Azitromicin', 'Azithromycin', 'J01FA10', g.id,
  'A baktérium fehérjeszintézisét gátolja a riboszóma nagy alegységéhez kötődve. Jellemzően szaporodásgátló, magas koncentrációban baktériumölő.', '{"Atípusos kórokozó okozta tüdőgyulladás","Chlamydia okozta fertőzések","Béta-laktám-allergia esetén alternatíva légúti fertőzésben"}', '{"Makrolid-allergia","Korábbi, e szerhez köthető májkárosodás"}',
  '{"A szöveti koncentráció a vérszintnél jóval magasabb, és a hatás a kezelés után napokig tart — ezért rövidebb kúra is elegendő lehet","QT-megnyúlás kockázata: a gyógyszerlista átnézése más QT-nyújtó szerre","Ismert QT-megnyúlásnál vagy alacsony kálium- és magnéziumszintnél fokozott figyelem"}', '{"Hasmenés, hasi görcs","Hányinger","QT-megnyúlás","Ritkán májkárosodás, halláscsökkenés"}', '{"QT-nyújtó szerek: együttes adásuk fokozza a ritmuszavar kockázatát","Kumarin típusú véralvadásgátló: az INR emelkedhet"}',
  'Májon át ürül. Súlyos májbetegségben kerülendő. Vesefunkció szerint jellemzően nem igényel módosítást.', '{"EKG, ha QT-megnyúlás kockázata áll fenn","Kálium és magnézium"}', 'Terhességben mérlegelhető; a döntés az alkalmazási előírás alapján.',
  '{"A rezisztencia a Streptococcus pneumoniae körében jelentős — súlyos tüdőgyulladásban önmagában nem elegendő","A QT-megnyúlás kockázata alábecsült, különösen idős, több gyógyszert szedő betegnél"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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
select s.id, '{"Mycoplasma pneumoniae","Chlamydia fajok","Legionella pneumophila","Bordetella pertussis","Haemophilus influenzae"}', '{"Rezisztens Streptococcus pneumoniae törzsek","MRSA","Enterobacterales nagy része","Pseudomonas aeruginosa"}', 'Szaporodásgátló, magas koncentrációban baktériumölő',
  'A pneumococcusok körében a makrolid-rezisztencia magas és növekvő; ez korlátozza az egyedüli alkalmazást.', '{"Vírusos légúti fertőzésben nem indokolt","Súlyos tüdőgyulladásban béta-laktámmal együtt, nem helyette"}', null
from public.drug_substances s where s.slug = 'azitromicin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'ciprofloxacin', 'Ciprofloxacin', 'Ciprofloxacin', 'J01MA02', g.id,
  'A baktérium DNS-ének felcsavarodásáért felelős enzimeket gátolja, ezzel megakadályozza a szaporodást.', '{"Szövődményes húgyúti fertőzés","Egyes hasi fertőzések, kiegészítő szerrel","Pseudomonas okozta fertőzés","Csont- és ízületi fertőzés, célzottan"}', '{"Kinolon-allergia","Korábbi kinolonhoz köthető ínsérülés","Gyermekkorban és serdülőkorban jellemzően kerülendő"}',
  '{"Ínfájdalom, különösen az Achilles-ínban: azonnal jelzendő, a szer leállítását igényelheti","Kalcium-, magnézium-, vas- és cinktartalmú készítménnyel együtt nem adható szájon át: a felszívódás jelentősen csökken — legalább két óra különbség kell","Idegrendszeri tünetek: szédülés, zavartság, alvászavar, különösen időseknél","QT-megnyúlás lehetősége"}', '{"Ínszakadás, ínfájdalom","Perifériás idegkárosodás","Idegrendszeri tünetek: szédülés, zavartság","QT-megnyúlás","Aortatágulat és -szakadás fokozott kockázata","Clostridioides difficile fertőzés"}', '{"Kétértékű fémionok (kalcium, magnézium, vas, cink): a felszívódást gátolják","Teofillin: szintje emelkedhet","Kumarin típusú véralvadásgátló: az INR emelkedhet","QT-nyújtó szerek"}',
  'Vesefunkció szerint adagmódosítás szükséges.', '{"Vesefunkció","Ínpanasz célzott kérdezése"}', 'Terhességben jellemzően kerülendő; a döntés az alkalmazási előírás alapján.',
  '{"Szövődménymentes húgyúti fertőzésben nem elsővonalbeli: a mellékhatásprofil nem áll arányban a haszonnal","A tejtermékkel vagy ásványi anyagot tartalmazó készítménnyel egyszerre bevett adag hatástalan lehet — ez gyakori, észrevétlen hiba","Az ínsérülés hetekkel a kezelés után is jelentkezhet"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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
select s.id, '{"Enterobacterales","Pseudomonas aeruginosa","Haemophilus influenzae","Neisseria fajok","Egyes atípusos kórokozók"}', '{"MRSA","Streptococcus pneumoniae — gyenge hatás","Anaerobok","Enterococcus fajok"}', 'Baktériumölő',
  'A rezisztencia gyorsan terjed, különösen az Escherichia coli körében; ez a húgyúti fertőzésekben korlátozza az empirikus használatát.', '{"Szövődménymentes húgyúti fertőzésben kerülendő","Enyhe fertőzésben csak akkor, ha más szer nem alkalmas","A helyi rezisztenciaadatok ismerete nélkül az empirikus használat kockázatos"}', 'Nitrofurantoin vagy fosfomycin szövődménymentes húgyúti fertőzésben.'
from public.drug_substances s where s.slug = 'ciprofloxacin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'vankomicin', 'Vankomicin', 'Vancomycin', 'J01XA01', g.id,
  'A sejtfal felépítését gátolja, a béta-laktámoktól eltérő ponton. Ezért hatásos a béta-laktámokra rezisztens Gram-pozitív kórokozókra is.', '{"MRSA okozta fertőzés","Súlyos Gram-pozitív fertőzés béta-laktám-allergia esetén","Clostridioides difficile fertőzés — szájon át, helyi hatásra"}', '{"Glikopeptid-allergia"}',
  '{"A gyors beadás kipirulást, viszketést és vérnyomásesést okozhat a felsőtesten — ez nem allergia, hanem a beadási sebességgel függ össze; a beadás lassítása jellemzően megoldja","A szintmérés időzítése kritikus: a völgyszint közvetlenül a következő adag előtt veendő","Vesefunkció és vizeletmennyiség szoros követése","Szájon át adva nem szívódik fel — ez a Clostridioides difficile kezelésénél előny, de rendszerhatásra alkalmatlan"}', '{"Vesekárosodás, különösen más vesekárosító szerrel együtt","Halláskárosodás hosszabb kezelésnél","Beadási sebességgel összefüggő kipirulás","Vérképzőrendszeri eltérés"}', '{"Aminoglikozidok: a vesekárosodás kockázata összeadódik","Kacsdiuretikumok: fokozott halláskárosodási kockázat","Piperacillin/tazobaktám: együtt adva nagyobb vesekárosodási kockázat"}',
  'Vesén át ürül; az adagot a vesefunkció és a mért szint alapján kell beállítani. A szintmérés nem választható, hanem a kezelés része.', '{"Vankomicin-szint a következő adag előtt","Kreatinin és eGFR","Vizeletmennyiség","Halláspanasz kérdezése hosszabb kezelésnél"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A beadási reakciót gyakran allergiának minősítik, és a szert feleslegesen lecserélik — pedig a beadás lassítása elég","A szájon át adott forma nem alkalmas rendszerhatásra, a vénás forma pedig nem alkalmas a Clostridioides difficile kezelésére — a kettő nem cserélhető fel","A szintmérés rossz időzítése értelmezhetetlen eredményt ad"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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
select s.id, '{"MRSA","Meticillin-rezisztens koaguláz-negatív Staphylococcus","Streptococcus fajok","Enterococcus fajok (vankomicin-érzékeny törzsek)","Clostridioides difficile — szájon át"}', '{"Minden Gram-negatív kórokozó","Vankomicin-rezisztens Enterococcus","Atípusos kórokozók"}', 'Baktériumölő',
  'A vankomicin-rezisztens Enterococcus terjedése komoly probléma; a Staphylococcus aureus körében a csökkent érzékenység ritkább.', '{"Nem empirikus szer: célzottan, igazolt vagy erősen valószínű Gram-pozitív rezisztens kórokozónál","Ha a tenyésztés meticillin-érzékeny Staphylococcus aureust mutat, a béta-laktám hatékonyabb — arra kell váltani"}', 'Meticillin-érzékeny törzsnél béta-laktám, ami hatékonyabb.'
from public.drug_substances s where s.slug = 'vankomicin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ══ Ellenőrzés ═══════════════════════════════════════════
select 'csoport' as tipus, count(*)::text as db from public.drug_groups
where publish_status = 'published'
union all
select 'hatóanyag', count(*)::text from public.drug_substances
where publish_status = 'published'
union all
select 'antibiotikum', count(*)::text from public.drug_antibiotics;
