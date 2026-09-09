-- APN-MED — A gyógyszertár ikonjainak javítása.
--
-- Két gond volt együtt.
--
-- Az egyik: a szív- és érrendszeri csoport az anatómiai szív emojit kapta,
-- ami az Emoji 13.0 készletből való (2020). Régebbi Windows- és
-- Android-verziókon ez üres négyzetként vagy semmiként jelenik meg. A
-- vércsepp emoji is újabb keletű, ezért ugyanez fenyegette.
--
-- A másik: a 0066 migráció „on conflict do update” szakasza nem frissítette
-- az ikon mezőt, ezért az újrafuttatás sem javította volna a hibát.
--
-- A megoldás nem újabb emoji, hanem a platform saját vonalas ikonkészlete.
-- Az ott lévő ikonok minden rendszeren egyformán jelennek meg, mert
-- rajzoltak, nem betűkészletből származnak — és illeszkednek a felület
-- többi részéhez, ahol már ezeket használjuk.

-- ══ Vonalas ikonok a főcsoportokhoz ══════════════════════
-- Az érték a components/icons.tsx készletéből származó ikonnév.
update public.drug_groups set icon = 'flask'      where slug = 'antibiotikumok';
update public.drug_groups set icon = 'assessment' where slug = 'fajdalomcsillapitok';
update public.drug_groups set icon = 'pulse'      where slug = 'kardiovaszkularis';
update public.drug_groups set icon = 'droplet'    where slug = 'veralvadas';
update public.drug_groups set icon = 'flask'      where slug = 'vizhajtok';

-- Az alcsoportok nem kapnak ikont: ott a név és a rövid leírás elég, és a
-- sok ikon vizuális zajt okozna.
update public.drug_groups set icon = null
where parent_id is not null;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- Minden főcsoportnak legyen ikonja.
select
  name,
  coalesce(icon, '— nincs') as ikon,
  case when parent_id is null then 'főcsoport' else 'alcsoport' end as szint
from public.drug_groups
where publish_status = 'published'
order by parent_id nulls first, ord;
