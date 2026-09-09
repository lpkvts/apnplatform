-- APN-MED — Gyógyszertár: a vízhajtó csoport kiegészítése.
--
-- A 0067 migráció csoportonként egy hatóanyagot vitt fel. Ez a bővítés
-- azokat teszi hozzá, amelyekkel a gyakorlatban még rendszeresen
-- találkozni, és amelyeknél a választás oka klinikai kérdés:
--
--   · torasemid — kiszámíthatóbb felszívódás, mint a furoszemidé;
--   · hidroklorotiazid — a leggyakoribb tiazid, jellemzően kombinációban;
--   · eplerenon — kevesebb hormonális mellékhatás, mint a spironolaktoné.
--
-- Előfeltétel: a 0065, 0066 és 0067 lefutott.

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
-- A vízhajtó csoport teljes tartalma, alcsoportonként.
select g.name as alcsoport, s.name as hatoanyag, s.atc
from public.drug_substances s
join public.drug_groups g on g.id = s.group_id
join public.drug_groups p on p.id = g.parent_id
where p.slug = 'vizhajtok' and s.publish_status = 'published'
order by g.ord, s.name;
