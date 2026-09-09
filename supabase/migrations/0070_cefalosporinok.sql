-- APN-MED — Cefalosporinok és a béta-laktám csoport átszervezése.
--
-- A 0066 migráció egyetlen „béta-laktámok” csoportba tette a penicillineket, a
-- cefalosporinokat és a karbapenemeket. Ez szerkezetileg helytálló, a
-- gyakorlatban viszont használhatatlan: a három család hatásspektruma,
-- javallata és helye a kezelési sorrendben gyökeresen eltér.
--
-- Külön gond, hogy a cefalosporinok generációkra oszlanak, és a generáció
-- határozza meg a hatásspektrumot. Egy gyűjtőcsoportban ez elveszik.
--
-- Ez a migráció három önálló csoportra bontja a családot, felveszi a hazai
-- gyakorlatban leggyakoribb cefalosporinokat generációnként, és átsorolja a
-- meglévő két hatóanyagot a helyére.
--
-- Előfeltétel: a 0065, 0066 és 0067 lefutott.

-- ══ 1. Az új csoportok ═══════════════════════════════════
insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'penicillinek', 'Penicillinek', 'J01C', p.id, 'Amoxicillin, penicillin, piperacillin',
  'A legrégebbi és legszűkebb spektrumú béta-laktámok. Ahol hatásosak, ott elsőként választandók: kevesebb mellékhatás, kevesebb rezisztencia.', 'A név a felfedezés forrására utal: a Penicillium nevű penészgomba termeli. Az első antibiotikumcsalád, és máig az egyik legfontosabb. A béta-laktám gyűrű bénítja a baktérium sejtfalépítő enzimeit, ezért a sejtfal hiányossá válik és a baktérium elpusztul.',
  '{"A baktériumok béta-laktamáz enzimmel védekeznek; ezt enzimgátló hozzáadásával lehet kivédeni — így születik az amoxicillin/klavulánsav kombináció.","Az idődependens hatás miatt a beadási időköz betartása fontosabb, mint az egyszeri adag nagysága.","A penicillin-allergia címkék nagy része téves; a felülvizsgálat gyakran visszaadja ezt a szercsoportot."}', '{"A beadási idők pontos betartása","Az allergiacímke tisztázása a választás előtt"}', 1, 'published'
from public.drug_groups p where p.slug = 'antibiotikumok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  ord = excluded.ord, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'cefalosporinok', 'Cefalosporinok', 'J01D', p.id, 'Generációkba sorolt béta-laktámok',
  'A leggyakrabban használt antibiotikumcsalád a kórházi ellátásban. A generáció ismerete nélkül a választás vaktában történik.', 'A név a felfedezés forrására utal: a Cephalosporium nevű gombából vonták ki először. A penicillinekhez hasonlóan a sejtfal felépítését gátolják, de a szerkezetük ellenállóbb a béta-laktamáz enzimekkel szemben.

A generációk nem korszakokat jelölnek, hanem hatásspektrumot. Az első generáció főleg Gram-pozitív kórokozókra hat; ahogy haladunk felfelé, a Gram-negatív hatás erősödik, a Gram-pozitív viszont jellemzően gyengül. A negyedik generáció mindkettőt lefedi, az ötödik pedig már a MRSA-ra is hat.',
  '{"A generáció határozza meg a hatásspektrumot — ez a legfontosabb, amit tudni kell róluk.","Egyik generáció sem hat a MRSA-ra, kivéve az ötödiket. Az Enterococcus ellen egyik sem hatásos.","A Pseudomonas ellen csak meghatározott szerek hatnak — nem az egész harmadik generáció.","A penicillin-allergia nem zárja ki automatikusan a cefalosporint: a keresztreakció kockázata jóval kisebb, mint azt korábban feltételezték.","Széles spektrumú használatuk elősegíti a Clostridioides difficile fertőzést és az ESBL-termelő törzsek terjedését."}', '{"A generáció ismerete: ebből következik, mire hat és mire nem","Az allergiacímke tisztázása — a penicillin-allergia gyakran nem zárja ki","A tenyésztés utáni szűkítés lehetőségének felvetése","Hasmenés jelzése: a széles spektrumú szerek gyakori szövődménye"}', 2, 'published'
from public.drug_groups p where p.slug = 'antibiotikumok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  ord = excluded.ord, publish_status = excluded.publish_status;

insert into public.drug_groups
  (slug, name, atc, parent_id, short, description, name_meaning,
   key_points, apn_notes, ord, publish_status)
select 'karbapenemek', 'Karbapenemek', 'J01DH', p.id, 'Meropenem, imipenem — végső tartalék',
  'A legszélesebb spektrumú antibiotikumok. Éppen ezért végső tartalékként kezelendők: ha ezek is hatástalanná válnak, kevés lehetőség marad.', 'A név a molekula szerkezetére utal: a béta-laktám gyűrűhöz egy szénatomot tartalmazó gyűrű kapcsolódik. Ez a szerkezet teszi őket ellenállóvá szinte minden béta-laktamáz enzimmel szemben — ezért a legszélesebb spektrumú béta-laktámok.',
  '{"Nem első választás: súlyos, más szerrel nem kezelhető fertőzésben, vagy igazolt többszörösen rezisztens kórokozónál indokoltak.","A karbapenem-rezisztens törzsek terjedése világszerte súlyos gond; minden indokolatlan használat ehhez járul hozzá.","A MRSA-ra és az Enterococcus faeciumra nem hatnak."}', '{"A javallat felülvizsgálatának felvetése: van-e szűkebb spektrumú lehetőség","A tenyésztés eredményének követése és a szűkítés kezdeményezése","Elkülönítési szabályok betartása többszörösen rezisztens kórokozónál"}', 3, 'published'
from public.drug_groups p where p.slug = 'antibiotikumok'
on conflict (slug) do update set
  name = excluded.name, parent_id = excluded.parent_id, short = excluded.short,
  description = excluded.description, name_meaning = excluded.name_meaning,
  key_points = excluded.key_points, apn_notes = excluded.apn_notes,
  ord = excluded.ord, publish_status = excluded.publish_status;

-- ══ 2. A meglévő hatóanyagok átsorolása ══════════════════
-- Az amoxicillin/klavulánsav a penicillinekhez, a ceftriaxon a
-- cefalosporinokhoz tartozik.
update public.drug_substances s set group_id = g.id
from public.drug_groups g where g.slug = 'penicillinek'
  and s.slug = 'amoxicillin-klavulansav';

update public.drug_substances s set group_id = g.id
from public.drug_groups g where g.slug = 'cefalosporinok'
  and s.slug = 'ceftriaxon';

-- A ceftriaxon leírásába bekerül a generáció, mert az határozza meg a
-- hatásspektrumot.
update public.drug_substances
set mechanism = 'Harmadik generációs cefalosporin: a sejtfal felépítését gátolja, és a béta-laktamázok jelentős részével szemben ellenálló. A harmadik generációra jellemzően erős Gram-negatív hatás mellett a Gram-pozitív hatás gyengébb, mint az első két generációé.'
where slug = 'ceftriaxon';

-- ══ 3. Az üres gyűjtőcsoport lezárása ════════════════════
-- A „béta-laktámok” csoport kiürült, ezért nem jelenik meg többé. Nem
-- töröljük: ha valamelyik hatóanyag mégis oda mutatna, az így kiderül.
update public.drug_groups set publish_status = 'draft'
where slug = 'beta-laktamok'
  and not exists (
    select 1 from public.drug_substances s
    join public.drug_groups g on g.id = s.group_id
    where g.slug = 'beta-laktamok'
  );

-- ══ 4. Az új hatóanyagok ═════════════════════════════════
-- ── Cefalexin ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'cefalexin', 'Cefalexin', 'Cefalexin', 'J01DB01', g.id,
  'Első generációs cefalosporin: a sejtfal felépítését gátolja. Elsősorban Gram-pozitív kórokozókra hat, szájon át jól felszívódik.', '{"Bőr- és lágyrészfertőzés","Szövődménymentes húgyúti fertőzés","Streptococcus okozta torokgyulladás penicillin-alternatívaként"}', '{"Igazolt cefalosporin-allergia"}',
  '{"Szájon át adható, jól felszívódik — ezért gyakran alkalmas a vénás kezelés folytatására otthon","Naponta többször adandó: az idődependens hatás miatt az időköz betartása fontosabb, mint az egyszeri adag","Vesefunkció szerinti adagmódosítás szükséges"}', '{"Hasmenés, hányinger","Bőrkiütés","Gombás felülfertőződés"}', '{"Metformin: a szintje emelkedhet","Kumarin típusú véralvadásgátló: az INR emelkedhet"}',
  'Vesén át ürül; veseelégtelenségben adagmódosítás szükséges.', '{"Vesefunkció hosszabb kezelésnél"}', 'Terhességben a cefalosporinok általában használhatók; a döntés az alkalmazási előírás alapján.',
  '{"Gram-negatív kórokozókra gyengén hat — húgyúti fertőzésben csak akkor megfelelő, ha a tenyésztés érzékenységet mutat","A MRSA-ra nem hat, pedig bőrfertőzésben gyakran ez a kórokozó"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'cefalosporinok'
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
select s.id, '{"Meticillin-érzékeny Staphylococcus aureus","Streptococcus fajok","Egyes Escherichia coli és Klebsiella törzsek"}', '{"MRSA","Enterococcus fajok","Pseudomonas aeruginosa","Anaerobok","Atípusos kórokozók","ESBL-termelő törzsek"}', 'Baktériumölő',
  'A béta-laktamáz termelő Gram-negatív törzsek ellenállók; a cefalexin nem tartalmaz enzimgátlót.', '{"Ahol hatásos, ott jó választás: szűk spektrumú, kevés mellékhatással","Bőrfertőzésben csak akkor, ha a MRSA nem valószínű"}', 'Penicillin, ha a kórokozó arra érzékeny.'
from public.drug_substances s where s.slug = 'cefalexin'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Cefuroxim ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'cefuroxim', 'Cefuroxim', 'Cefuroxime', 'J01DC02', g.id,
  'Második generációs cefalosporin: az első generációhoz képest erősebb Gram-negatív hatás, miközben a Gram-pozitív hatás nagyrészt megmarad. Ellenállóbb a béta-laktamáz enzimekkel szemben.', '{"Közösségben szerzett tüdőgyulladás","Arcüreg- és középfülgyulladás","Húgyúti fertőzés","Bőr- és lágyrészfertőzés","Műtéti fertőzés-megelőzés"}', '{"Igazolt cefalosporin-allergia"}',
  '{"A szájon át adott forma étkezés közben szívódik fel jobban — éhgyomorra a felszívódás jelentősen romlik","A vénás és a szájon át adott forma nem azonos adagban váltja egymást: az átállítás orvosi döntés","Vesefunkció szerinti adagmódosítás szükséges","Hasmenés jelzésének kérése"}', '{"Hasmenés, hányinger","Bőrkiütés","Májenzim-emelkedés","Gombás felülfertőződés"}', '{"Gyomorsavcsökkentők: a szájon át adott forma felszívódását rontják","Kumarin típusú véralvadásgátló: az INR emelkedhet","Aminoglikozidok: fokozott vesekárosodási kockázat"}',
  'Vesén át ürül; veseelégtelenségben adagmódosítás szükséges.', '{"Vesefunkció","Vérkép hosszabb kezelésnél"}', 'Terhességben általában használható; a döntés az alkalmazási előírás alapján.',
  '{"Az éhgyomri bevétel jelentősen csökkenti a felszívódást — ez a szájon át adott kezelés kudarcának gyakori, észrevétlen oka","A vénás és a szájon át adott forma biológiai hozzáférhetősége eltér, ezért nem cserélhetők fel azonos milligrammban","A Pseudomonasra nem hat"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'cefalosporinok'
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
select s.id, '{"Streptococcus pneumoniae","Haemophilus influenzae","Moraxella catarrhalis","Meticillin-érzékeny Staphylococcus aureus","Escherichia coli, Klebsiella"}', '{"MRSA","Pseudomonas aeruginosa","Enterococcus fajok","Atípusos kórokozók","ESBL-termelő törzsek"}', 'Baktériumölő',
  'Az ESBL- és AmpC-termelő törzsek ellenállók.', '{"Közösségben szerzett fertőzésben jó egyensúly a spektrum és a szűkösség között","Kórházi, rezisztens kórokozó gyanújánál nem elegendő"}', 'Amoxicillin vagy amoxicillin/klavulánsav, ha a kórokozó érzékeny.'
from public.drug_substances s where s.slug = 'cefuroxim'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Ceftazidim ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'ceftazidim', 'Ceftazidim', 'Ceftazidime', 'J01DD02', g.id,
  'Harmadik generációs cefalosporin, amely a csoporton belül különleges: hatásos a Pseudomonas aeruginosa ellen. Cserébe a Gram-pozitív hatása gyengébb, mint a ceftriaxoné.', '{"Pseudomonas okozta fertőzés","Kórházi tüdőgyulladás","Lázas neutropenia","Súlyos húgyúti és hasi fertőzés"}', '{"Igazolt cefalosporin-allergia"}',
  '{"A csoport egyetlen olyan tagja a hazai gyakorlatban, amely a Pseudomonasra hat — ez a választás fő oka","A Gram-pozitív hatása gyengébb: Staphylococcus gyanújánál más szer kell mellé","Vesefunkció szerinti adagmódosítás szükséges","Naponta többször adandó, az időköz betartása fontos"}', '{"Hasmenés","Bőrkiütés","Májenzim-emelkedés","Clostridioides difficile fertőzés"}', '{"Aminoglikozidok: fokozott vesekárosodási kockázat","Kacsdiuretikumok: fokozott vesekárosodás"}',
  'Vesén át ürül; veseelégtelenségben adagmódosítás szükséges.', '{"Vesefunkció","Vérkép"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A ceftriaxonnal nem cserélhető fel: a ceftazidim a Pseudomonasra hat, de a Gram-pozitív hatása gyengébb — a kettő más javallatra való","Széles spektrumú szer, ami elősegíti az ESBL-termelő törzsek szelekcióját; a tenyésztés utáni szűkítés fontos"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
  'A hatályos adagolást és a teljes alkalmazási előírást az OGYÉI gyógyszeradatbázisa tartalmazza.',
  current_date, 'published'
from public.drug_groups g where g.slug = 'cefalosporinok'
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
select s.id, '{"Pseudomonas aeruginosa","Enterobacterales nagy része","Haemophilus influenzae","Neisseria fajok"}', '{"MRSA","Enterococcus fajok","Anaerobok","Streptococcus pneumoniae — gyengébb hatás","ESBL-termelő törzsek"}', 'Baktériumölő',
  'Az ESBL- és AmpC-termelő törzsek ellenállók; a Pseudomonas körében a rezisztencia terjed.', '{"Csak akkor, ha a Pseudomonas valós lehetőség — máskülönben szűkebb spektrumú szer választandó","A tenyésztés után szűkíteni kell"}', 'Ceftriaxon, ha a Pseudomonas nem jön szóba.'
from public.drug_substances s where s.slug = 'ceftazidim'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ── Meropenem ──
insert into public.drug_substances
  (slug, name, name_intl, atc, group_id, mechanism, indications,
   contraindications, apn_focus, adverse, interactions, organ_note,
   monitoring, pregnancy, pitfalls, spc_url, source_note, last_verified,
   publish_status)
select 'meropenem', 'Meropenem', 'Meropenem', 'J01DH02', g.id,
  'Karbapenem: a sejtfal felépítését gátolja, és szinte minden béta-laktamáz enzimmel szemben ellenálló. Ezért a legszélesebb spektrumú béta-laktám.', '{"Súlyos, több kórokozó okozta hasi fertőzés","Kórházi tüdőgyulladás többszörösen rezisztens kórokozóval","ESBL-termelő törzs okozta fertőzés","Lázas neutropenia","Agyhártyagyulladás meghatározott esetekben"}', '{"Igazolt karbapenem-allergia"}',
  '{"Végső tartalék: a javallat felülvizsgálata minden alkalommal indokolt","A tenyésztés eredménye után a szűkítés lehetőségének felvetése — ez a lépés gyakran elmarad","Vesefunkció szerinti adagmódosítás szükséges","Elhúzódó beadás javasolt lehet: a hatás idődependens","Görcsroham kockázata, különösen veseelégtelenségben vagy nagy adagnál"}', '{"Hasmenés","Bőrkiütés","Görcsroham — ritka, de súlyos","Vérképzőrendszeri eltérés","Clostridioides difficile fertőzés"}', '{"Valproát: a meropenem jelentősen csökkenti a valproát szintjét, ami görcsrohamot válthat ki — ez a kombináció kerülendő","Probenecid: lassítja a meropenem ürülését"}',
  'Vesén át ürül; veseelégtelenségben adagmódosítás szükséges, és a görcsroham kockázata nagyobb.', '{"Vesefunkció","Vérkép","Idegrendszeri tünetek"}', 'Terhességben csak egyértelmű javallat esetén; a döntés az alkalmazási előírás alapján.',
  '{"A valproáttal együtt adva a görcsroham elleni védelem megszűnhet — ez a kölcsönhatás gyakran elkerüli a figyelmet, pedig súlyos","A tenyésztés utáni szűkítés elmaradása a leggyakoribb antibiotikum-gazdálkodási hiba ennél a szernél","A MRSA-ra és az Enterococcus faeciumra nem hat, pedig a széles spektrum miatt sokan mindenre alkalmasnak gondolják"}', 'https://ogyei.gov.hu/gyogyszeradatbazis',
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
select s.id, '{"Enterobacterales, ESBL-termelő törzsek is","Pseudomonas aeruginosa","Anaerobok","Streptococcus fajok","Meticillin-érzékeny Staphylococcus aureus"}', '{"MRSA","Enterococcus faecium","Stenotrophomonas maltophilia","Atípusos kórokozók","Karbapenem-rezisztens törzsek"}', 'Baktériumölő',
  'A karbapenem-rezisztens Enterobacterales és Acinetobacter terjedése világszerte súlyos gond. Minden indokolatlan használat ehhez járul hozzá.', '{"Nem első választás: súlyos, más szerrel nem kezelhető fertőzésben indokolt","A tenyésztés eredménye alapján szűkíteni kell — ez a legfontosabb lépés","ESBL-termelő törzsnél célzott javallat, de a szűkítés lehetőségét ott is vizsgálni kell"}', 'Harmadik generációs cefalosporin vagy piperacillin/tazobaktám, ha a kórokozó érzékeny.'
from public.drug_substances s where s.slug = 'meropenem'
on conflict (substance_id) do update set
  spectrum = excluded.spectrum, spectrum_gaps = excluded.spectrum_gaps,
  action = excluded.action, resistance = excluded.resistance,
  stewardship = excluded.stewardship, narrower_option = excluded.narrower_option;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- Az antibiotikum-csoport szerkezete. A penicillineknél 1, a
-- cefalosporinoknál 4, a karbapenemeknél 1 hatóanyagnak kell lennie.
select g.name as alcsoport, count(s.id) as hatoanyag,
  string_agg(s.name, ', ' order by s.atc) as hatoanyagok
from public.drug_groups g
left join public.drug_substances s
  on s.group_id = g.id and s.publish_status = 'published'
join public.drug_groups p on p.id = g.parent_id
where p.slug = 'antibiotikumok' and g.publish_status = 'published'
group by g.name, g.ord
order by g.ord;
