-- APN-MED — Gyógyszertár: véralvadásra ható szerek.
--
-- A platform legmagasabb kockázatú gyógyszercsoportja: a hiba mindkét irányban
-- súlyos következménnyel jár — a túl kevés trombózist, a túl sok vérzést okoz.
--
-- Négy alcsoport, hat hatóanyag. A válogatásnál a hazai gyakorlat számított:
-- az acenokumarol a magyar ellátásban gyakoribb, mint a warfarin. A közvetlen
-- hatású szerek közül kettő szerepel, mert a vesefunkció szerinti viselkedésük
-- eltér — és ez a különbség klinikai döntést befolyásol.
--
-- Adagolás itt sem szerepel. Ennél a csoportnál ez különösen fontos: az adag a
-- javallattól, a testsúlytól, az életkortól és a vesefunkciótól együttesen függ.
--
-- Előfeltétel: a 0065 és 0066 lefutott.

-- ══ Alcsoportok ══════════════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'k-vitamin-antagonistak', 'K-vitamin-antagonisták', 'B01AA', p.id, 'Acenokumarol, warfarin',
  'Évtizedek óta használt szerek, olcsók és jól ismertek, de szoros ellenőrzést és sok korlátozást igényelnek.', 'A név a hatásmódra utal: a K-vitamin újrahasznosítását gátolják a májban. Több alvadási fehérje készítéséhez K-vitamin kell, ezért ezek termelése lelassul. A hatás nem azonnali: a már kész fehérjéknek előbb el kell fogyniuk, ami napokba telik.',
  '{"A hatás beálltához napok kellenek, és a leállítás után is napokig tart — ez a beavatkozások tervezésénél meghatározó.","Az INR rendszeres mérése nem választható: a terápiás tartomány szűk, és a hatást sok minden befolyásolja.","Az étrend K-vitamin-tartalma befolyásolja a hatást — nem tiltani kell a zöld zöldségeket, hanem egyenletesen fogyasztani.","Sok gyógyszerrel kölcsönhatásba lép; minden új szer indításakor gyakoribb INR-ellenőrzés indokolt."}', '{"Az INR-eredmény és a beállított adag pontos dokumentálása","A beteg oktatása: mit jelent az INR, mikor kell orvoshoz fordulni","Vérzésjelek célzott keresése minden találkozáskor","Új gyógyszer indításakor az INR-ellenőrzés sűrítésének felvetése"}', 1, 'published'
from public.drug_groups p where p.slug = 'veralvadas'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'doac', 'Közvetlen hatású alvadásgátlók', 'B01AF', p.id, 'Rivaroxaban, apixaban, dabigatran, edoxaban',
  'A K-vitamin-antagonisták helyét vették át a legtöbb javallatban: nem igényelnek rendszeres INR-mérést, és kevesebb az étrendi és gyógyszeres kölcsönhatásuk.', 'A név arra utal, hogy közvetlenül egyetlen alvadási enzimet gátolnak — nem közvetve, a K-vitamin útján. Emiatt a hatás órák alatt beáll, kiszámíthatóbb, és rendszeres véralvadási méréssel nem kell követni. A nemzetközi rövidítésük DOAC vagy NOAC.',
  '{"A rendszeres véralvadási mérés hiánya nem jelenti, hogy nincs teendő: a vesefunkciót és a testsúlyt évente legalább egyszer ellenőrizni kell.","A rövid hatástartam kétélű: a kihagyott adag hamar védtelenné teszi a beteget.","A vesefunkciótól való függés szerenként eltér — ez a választás egyik fő szempontja.","Beavatkozás előtt a szüneteltetés rendje a vesefunkciótól és a beavatkozás vérzési kockázatától függ."}', '{"A beteg-együttműködés hangsúlyozása: a kihagyott adag itt gyorsabban jelent kockázatot, mint K-vitamin-antagonistánál","Vesefunkció évenkénti ellenőrzésének követése","Vérzésjelek keresése és jelzése","A beavatkozás előtti szüneteltetés dokumentálása és a visszaindítás követése"}', 2, 'published'
from public.drug_groups p where p.slug = 'veralvadas'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'heparinok', 'Heparinok', 'B01AB', p.id, 'Enoxaparin, nadroparin, nem frakcionált heparin',
  'Injekciós alvadásgátlók: megelőzésre, kezelésre és átmeneti áthidalásra egyaránt.', 'A név a felfedezés helyére utal: a heparint először májból vonták ki. Az antitrombin nevű természetes gátlófehérje hatását sokszorozzák meg. A kis molekulatömegű változatok bőr alá adhatók, kiszámíthatóbb hatással.',
  '{"A kis molekulatömegű heparinok adagja megelőzésre és kezelésre eltérő — a kettő nem cserélhető fel.","Veseelégtelenségben halmozódnak, ezért a vesefunkció ismerete a kezelés feltétele.","A heparin okozta vérlemezkeszám-csökkenés ritka, de súlyos szövődmény, ami paradox módon trombózist okoz."}', '{"A beadás helyének váltogatása: a hasfal bőr alatti szövete a szokásos hely","A beadás után nem szabad masszírozni a helyet — véraláfutást okoz","Vérlemezkeszám ellenőrzése hosszabb kezelésnél","A megelőző és a kezelési adag megkülönböztetése a dokumentációban"}', 3, 'published'
from public.drug_groups p where p.slug = 'veralvadas'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'vérlemezke-gatlok', 'Vérlemezke-gátlók', 'B01AC', p.id, 'Acetilszalicilsav, klopidogrél, tikagrelor',
  'Az artériás események megelőzésének alapszerei. Gyakran tévesztik össze őket az alvadásgátlókkal, pedig más a szerepük.', 'Nem az alvadási fehérjeláncra hatnak, hanem a vérlemezkék összetapadását akadályozzák meg. Ezért más a javallatuk, mint az alvadásgátlóké: főként artériás érelzáródás — szívinfarktus, stroke — megelőzésére szolgálnak, míg az alvadásgátlók a vénás trombózis és a pitvarfibrilláció területén.',
  '{"Az alvadásgátlókkal együtt adva a vérzési kockázat jelentősen nő — a kettős vagy hármas kezelés időtartamát ezért szigorúan korlátozzák.","A kettős vérlemezke-gátlás időtartama a beavatkozástól és a beteg vérzési kockázatától függ.","A hatás a vérlemezke élettartamáig tart: a leállítás után napokba telik, míg a működés helyreáll."}', '{"A kettős kezelés befejezési idejének követése — a fölöslegesen hosszú kezelés vérzést okoz","Gyomorvédelem szükségességének felvetése","Vérzésjelek keresése, különösen emésztőrendszeri","A beavatkozás előtti szüneteltetés kérdése: nem minden esetben indokolt"}', 4, 'published'
from public.drug_groups p where p.slug = 'veralvadas'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  publish_status = excluded.publish_status;

-- ══ Hatóanyagok ══════════════════════════════════════════
-- ── Acenokumarol ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'acenokumarol', 'Acenokumarol', 'Acenocoumarol', 'B01AA07', g.id,
  'A K-vitamin újrahasznosítását gátolja a májban. Több alvadási fehérje készítéséhez K-vitamin szükséges, ezért ezek termelése lelassul. A hatás nem azonnali: a keringésben lévő, kész fehérjéknek előbb el kell fogyniuk.', '{"Pitvarfibrilláció — stroke megelőzése","Mélyvénás trombózis és tüdőembólia kezelése és megelőzése","Műbillentyű — itt a közvetlen hatású szerek nem alkalmazhatók"}', '{"Aktív vérzés","Terhesség","Súlyos májelégtelenség","Beteg-együttműködés hiánya, ha az INR nem követhető"}',
  '{"Az INR mérése és a beállított adag pontos dokumentálása — az adagolás gyakran napra bontott, és a félreértés súlyos következménnyel jár","A K-vitamin-tartalmú ételeket nem tiltani kell, hanem egyenletesen fogyasztani: a hirtelen változás billenti ki a beállítást","Minden új gyógyszer indításakor gyakoribb INR-ellenőrzés — a kölcsönhatások száma nagy, és sok közülük nem nyilvánvaló","Vérzésjelek célzott keresése: melaena, vizeletben vér, szokatlan véraláfutás, orrvérzés","A beteg tájékoztatása: mit tegyen kihagyott adag esetén, és mikor kell azonnal orvoshoz fordulni"}', '{"Vérzés — bármely szervrendszerből","Bőrelhalás a kezelés kezdetén, ritkán","Májenzim-emelkedés","Hajhullás hosszabb kezelésnél"}', '{"Antibiotikumok — különösen a makrolidok, kinolonok és a szulfonamidok: az INR jelentősen emelkedhet","Gombaellenes szerek: erős INR-emelkedés","Nem szteroid gyulladáscsökkentők: a vérzési kockázat többszörös","Amiodaron: az INR tartósan emelkedik","Orbáncfű: csökkenti a hatást"}',
  'Májbetegségben a hatás kiszámíthatatlan, mert az alvadási fehérjék termelése amúgy is csökkent. Veseelégtelenségben a vérzési kockázat nagyobb.', '{"INR — a gyakoriság a beállítottságtól függ","Vérkép","Vérzésjelek minden találkozáskor"}', 'Terhességben ellenjavallt: magzati károsodást okoz. Fogamzóképes korban a fogamzásgátlás kérdését meg kell beszélni.',
  '{"A hatás napokkal késik: a beállítás kezdetén a beteg még nem védett, ezért gyakran heparinnal hidalják át — ennek elmaradása súlyos hiba","Az antibiotikum-kezelés az INR-t gyakran jelentősen megemeli; ez a leggyakoribb ok, amiért a stabil beteg hirtelen kibillen","A leállítás után a hatás napokig fennáll — a beavatkozás előtti szüneteltetést ennek megfelelően kell időzíteni","A magyar gyakorlatban ez a jellemző K-vitamin-antagonista, nem a warfarin; a kettő nem cserélhető fel azonos adagban"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Apixaban ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'apixaban', 'Apixaban', 'Apixaban', 'B01AF02', g.id,
  'Közvetlenül gátolja az alvadási lánc egyik kulcsenzimét, a Xa-faktort. A hatás órák alatt beáll, és kiszámítható, ezért rendszeres véralvadási méréssel nem kell követni.', '{"Pitvarfibrilláció — stroke megelőzése","Mélyvénás trombózis és tüdőembólia kezelése és megelőzése","Trombózis megelőzése nagyízületi műtét után"}', '{"Aktív vérzés","Súlyos májelégtelenség alvadási zavarral","Műbillentyű","Terhesség"}',
  '{"Naponta kétszer adandó — ez eltér több más szertől, és a kihagyott adag gyorsabban jelent kockázatot","A vesefunkciótól kevésbé függ, mint a csoport többi tagja: veseelégtelenségben gyakran ez a választás","Testsúly, életkor és vesefunkció együtt határozza meg az adagot — az adagcsökkentés feltételei szigorúak, és a téves csökkentés véd meg kevésbé","Rendszeres véralvadási mérés nincs, de a vesefunkció évenkénti ellenőrzése szükséges","Vérzésjelek keresése minden találkozáskor"}', '{"Vérzés — kevesebb koponyaűri vérzés, mint K-vitamin-antagonistánál","Vérszegénység","Hányinger"}', '{"Erős enzimgátlók (egyes gombaellenes szerek, HIV-ellenes szerek): a szintje jelentősen emelkedik","Erős enzimserkentők (rifampicin, egyes epilepszia elleni szerek, orbáncfű): a hatás csökken","Vérlemezke-gátlók és gyulladáscsökkentők: a vérzési kockázat összeadódik"}',
  'A vesén át kisebb részben ürül, mint a csoport többi tagja, ezért közepes veseelégtelenségben is használható. Súlyos veseelégtelenségben és májelégtelenségben a döntés egyéni.', '{"Vesefunkció évente, romló állapotban gyakrabban","Vérkép","Testsúly — az adagolás egyik feltétele"}', 'Terhességben nem javasolt; a döntés az alkalmazási előírás alapján.',
  '{"A rendszeres mérés hiánya nem jelenti, hogy nincs teendő: a vesefunkció és a testsúly követése ugyanúgy szükséges","A napi kétszeri adagolás miatt a kihagyás gyakoribb; a rövid hatástartam pedig hamar védtelenné teszi a beteget","Műbillentyűnél nem alkalmazható — ott a K-vitamin-antagonista az egyetlen igazolt lehetőség","Az adagcsökkentés feltételeit gyakran tévesen alkalmazzák; az indokolatlanul csökkentett adag nem véd meg"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Rivaroxaban ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'rivaroxaban', 'Rivaroxaban', 'Rivaroxaban', 'B01AF01', g.id,
  'Ugyanazt a Xa-faktort gátolja, mint az apixaban, de a felszívódása és az ürülése eltér: nagyobb részben a vesén át távozik, és naponta egyszer adandó a legtöbb javallatban.', '{"Pitvarfibrilláció — stroke megelőzése","Mélyvénás trombózis és tüdőembólia kezelése és megelőzése","Trombózis megelőzése nagyízületi műtét után"}', '{"Aktív vérzés","Súlyos májelégtelenség alvadási zavarral","Műbillentyű","Terhesség","Súlyos veseelégtelenség"}',
  '{"Étkezés közben kell bevenni a nagyobb adagot: éhgyomorra a felszívódás jelentősen romlik — ez a leggyakoribb, észrevétlen hiba","Naponta egyszer adandó a legtöbb javallatban, ami könnyíti a beteg dolgát","A vesefunkciótól jobban függ, mint az apixaban — romló vesefunkciónál a választás felülvizsgálandó","Vérzésjelek keresése minden találkozáskor"}', '{"Vérzés","Vérszegénység","Szédülés, fejfájás"}', '{"Erős enzimgátlók: a szintje jelentősen emelkedik","Erős enzimserkentők: a hatás csökken","Vérlemezke-gátlók és gyulladáscsökkentők: a vérzési kockázat összeadódik"}',
  'Nagyobb részben a vesén át ürül, mint az apixaban. Romló vesefunkciónál az adag módosítása vagy szerváltás szükséges lehet.', '{"Vesefunkció évente, romló állapotban gyakrabban","Vérkép"}', 'Terhességben nem javasolt; a döntés az alkalmazási előírás alapján.',
  '{"Az éhgyomri bevétel a hatást jelentősen csökkenti — ezt a beteg és néha az ellátó sem tudja, pedig ez a szer egyik legfontosabb sajátossága","Veseelégtelenségben az apixaban gyakran a jobb választás; a szerek nem cserélhetők fel gondolkodás nélkül"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Enoxaparin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'enoxaparin', 'Enoxaparin', 'Enoxaparin', 'B01AB05', g.id,
  'Az antitrombin nevű természetes gátlófehérje hatását sokszorozza meg, elsősorban a Xa-faktor ellen. Kis molekulatömegű heparin, ezért a hatása kiszámíthatóbb, mint a nem frakcionált hepariné.', '{"Vénás trombózis megelőzése kórházi fekvő betegnél és műtét után","Mélyvénás trombózis és tüdőembólia kezelése","Áthidaló kezelés K-vitamin-antagonista beállításakor vagy beavatkozás körül","Akut koszorúér-szindróma"}', '{"Aktív vérzés","Korábbi heparin okozta vérlemezkeszám-csökkenés","Súlyos alvadási zavar"}',
  '{"A megelőző és a kezelési adag gyökeresen eltér — a dokumentációban egyértelműen meg kell különböztetni, mert az összekeverés súlyos következménnyel jár","A beadás a hasfal bőr alatti szövetébe történik, a köldök körüli területet kihagyva; a helyet váltogatni kell","A beadás után nem szabad masszírozni: véraláfutást okoz","A fecskendőben lévő légbuborékot nem kell kinyomni — az a beadás végén zárja le a járatot, csökkentve a visszaszivárgást","Vérlemezkeszám ellenőrzése hosszabb kezelésnél: a heparin okozta csökkenés paradox módon trombózist okoz","Vesefunkció ismerete a kezelés feltétele: veseelégtelenségben halmozódik"}', '{"Vérzés, véraláfutás a beadás helyén","Heparin okozta vérlemezkeszám-csökkenés — ritka, de súlyos","Magas káliumszint hosszabb kezelésnél","Májenzim-emelkedés"}', '{"Vérlemezke-gátlók és gyulladáscsökkentők: a vérzési kockázat összeadódik","Egyéb alvadásgátlók: együttes adásuk csak áthidaló kezelésben, tervezetten"}',
  'Vesén át ürül; veseelégtelenségben halmozódik, ezért az adag módosítása szükséges. Súlyos veseelégtelenségben a nem frakcionált heparin lehet a biztonságosabb választás.', '{"Vérlemezkeszám a kezelés kezdetén és hosszabb kezelésnél","Vesefunkció","Vérzésjelek","Kálium hosszabb kezelésnél"}', 'Terhességben a heparinok a választandó alvadásgátlók, mert nem jutnak át a méhlepényen; a döntés az alkalmazási előírás alapján.',
  '{"A megelőző és a kezelési adag összekeverése a leggyakoribb és legsúlyosabb hiba ennél a szernél","A légbuborék kinyomása a fecskendőből csökkenti a beadott mennyiséget és növeli a visszaszivárgást — a buborékot bent kell hagyni","Veseelégtelenségben a halmozódás miatt a vérzési kockázat jelentősen nő, és ez gyakran csak akkor derül ki, amikor a beteg már vérzik"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Acetilszalicilsav ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'acetilszalicilsav', 'Acetilszalicilsav', 'Acetylsalicylic acid', 'B01AC06', g.id,
  'Visszafordíthatatlanul gátolja a vérlemezkék egyik enzimét, ezért azok nem tudnak összetapadni. A hatás a vérlemezke teljes élettartamára szól: a működés csak új vérlemezkék képződésével áll helyre.', '{"Szívinfarktus és stroke másodlagos megelőzése","Akut koszorúér-szindróma","Érbeavatkozás után, kettős kezelés részeként"}', '{"Aktív gyomor-bél vérzés","Szalicilát-allergia","Aszpirin okozta asztma","Súlyos májelégtelenség"}',
  '{"Az alacsony adag vérlemezke-gátló, a magas adag fájdalomcsillapító — a kettő nem ugyanaz, és a betegek gyakran összekeverik","Gyomorvédelem szükségességének felvetése, különösen idős betegnél vagy gyulladáscsökkentő mellett","Vérzésjelek keresése, elsősorban emésztőrendszeri: melaena, vérhányás, ismeretlen eredetű vérszegénység","Beavatkozás előtt nem mindig kell elhagyni: a döntés a beavatkozás vérzési kockázatától és a szívesemény kockázatától függ"}', '{"Gyomor-bél vérzés, fekély","Vérzékenység","Hörgőgörcs érzékeny betegnél","Fülzúgás nagyobb adagnál"}', '{"Alvadásgátlók: a vérzési kockázat jelentősen nő","Nem szteroid gyulladáscsökkentők: fokozott gyomorvérzés, és egyesek gátolják a vérlemezke-gátló hatást","Metotrexát: a szintje emelkedhet"}',
  'Súlyos vese- és májelégtelenségben óvatosan. Veseelégtelenségben a vérzési kockázat nagyobb.', '{"Vérkép — vérszegénység keresése","Vérzésjelek","Vesefunkció"}', 'Terhesség harmadik harmadában kerülendő; kis adagban meghatározott javallattal adható. A döntés az alkalmazási előírás alapján.',
  '{"Nem alvadásgátló: a pitvarfibrilláció okozta stroke megelőzésére nem alkalmas, pedig sokan annak gondolják — ez régi, meghaladott gyakorlat","A hatás a leállítás után napokig fennáll, mert a vérlemezkék működése csak új sejtek képződésével áll helyre","A gyulladáscsökkentővel egyszerre bevett adag hatástalanná válhat: a kettő ugyanazért az enzimért verseng"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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

-- ── Klopidogrél ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'klopidogrel', 'Klopidogrél', 'Clopidogrel', 'B01AC04', g.id,
  'A vérlemezkék egy másik receptorát gátolja, mint az acetilszalicilsav — ezért adják őket gyakran együtt. Előanyag: a májban kell hatóanyaggá alakulnia, és ez a lépés egyénenként eltérően működik.', '{"Érbeavatkozás után, kettős vérlemezke-gátlás részeként","Akut koszorúér-szindróma","Stroke és perifériás érbetegség másodlagos megelőzése","Acetilszalicilsav-érzékenység esetén alternatíva"}', '{"Aktív vérzés","Súlyos májelégtelenség"}',
  '{"A kettős kezelés időtartamának követése: a fölöslegesen hosszú kezelés vérzést okoz, a túl rövid pedig érelzáródást","Az előanyag jellegből következik, hogy egyes betegeknél gyengébben hat — ha a kezelés mellett esemény történik, ez felmerülhet","Beavatkozás előtti szüneteltetés: jellemzően napokkal korábban, de a döntés a beavatkozás és a beteg kockázatától függ","Vérzésjelek keresése minden találkozáskor"}', '{"Vérzés","Véraláfutás","Hasmenés, hasi panasz","Ritkán vérképzőrendszeri eltérés"}', '{"Omeprazol és ezomeprazol: csökkenthetik a hatóanyaggá alakulást — más gyomorvédő javasolt","Alvadásgátlók: a vérzési kockázat jelentősen nő","Gyulladáscsökkentők: fokozott gyomorvérzés"}',
  'Májon át alakul hatóanyaggá; súlyos májelégtelenségben a hatás kiszámíthatatlan.', '{"Vérkép","Vérzésjelek"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A gyomorvédő megválasztása számít: két gyakori szer csökkentheti a klopidogrél hatását, ezért helyettük másikat érdemes választani","A kettős kezelés befejezési ideje gyakran nem kerül át a zárójelentésből a háziorvosi gondozásba, ezért a beteg évekig szedi feleslegesen","Előanyag: a hatás nem azonnali, és egyénenként eltérő lehet"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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
-- Négy alcsoportnak és hat hatóanyagnak kell megjelennie.
select g.name as alcsoport, count(s.id) as hatoanyag
from public.drug_groups g
left join public.drug_substances s
  on s.group_id = g.id and s.publish_status = 'published'
join public.drug_groups p on p.id = g.parent_id
where p.slug = 'veralvadas' and g.publish_status = 'published'
group by g.name, g.ord
order by g.ord;
