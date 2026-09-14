-- APN-MED — A béta-laktám család helyreállítása gyűjtőcsoportként.
--
-- A 0070 migráció három testvércsoportra bontotta a penicillineket, a
-- cefalosporinokat és a karbapenemeket, mert a felület akkor csak két
-- szintet tudott megjeleníteni. Ez szakmailag félrevezető: a három család
-- ugyanahhoz a szerkezeti csoporthoz tartozik — mindegyikben ott a
-- béta-laktám gyűrű —, és a menüben egymás mellett állva úgy tűntek, mintha
-- egymástól független családok lennének.
--
-- A felület mostantól három szintet kezel, ezért a szerkezet visszatérhet
-- ahhoz, ami szakmailag helyes:
--
--   Antibiotikumok
--     └─ Béta-laktámok
--          ├─ Penicillinek
--          ├─ Cefalosporinok
--          └─ Karbapenemek
--
-- Előfeltétel: a 0065, 0066 és 0070 lefutott.

-- ══ 1. A gyűjtőcsoport visszaállítása ════════════════════
-- A 0070 lejárt állapotba tette, mert kiürült. Most újra betöltjük, és a
-- leírása is a gyűjtő szerepéhez igazodik.
update public.drug_groups set
  name = 'Béta-laktámok',
  short = 'Penicillinek, cefalosporinok, karbapenemek',
  description = 'A legszélesebb körben használt antibiotikumcsalád. Közös bennük a béta-laktám gyűrű, amely a baktérium sejtfalának felépítését gátolja — a három alcsoport ebben a szerkezetben osztozik, a hatásspektrumuk viszont eltér.',
  name_meaning = 'A név a molekula szerkezetére utal: mindegyikben van egy négytagú gyűrű, a béta-laktám gyűrű. Ez bénítja a baktérium sejtfalépítő enzimeit, ezért a sejtfal hiányossá válik, és a baktérium elpusztul. A baktériumok védekezése is ehhez a gyűrűhöz kötődik: a béta-laktamáz enzim felnyitja, és a szer hatástalanná válik. Ezért adnak hozzá enzimgátlót — például klavulánsavat.',
  key_points = '{"A csoporton belüli keresztreakció kockázata kisebb, mint azt korábban feltételezték: a penicillin-allergia nem zárja ki automatikusan a cefalosporint.","Az idődependens hatás miatt a beadási időköz betartása fontosabb, mint az egyszeri adag nagysága.","A három alcsoport a hatásspektrumban tér el: a penicillinek a legszűkebbek, a karbapenemek a legszélesebbek."}',
  apn_notes = '{"A beadási idők pontos betartása","Az allergiacímke tisztázása a választás előtt","A tenyésztés utáni szűkítés lehetőségének felvetése"}',
  ord = 1,
  publish_status = 'published'
where slug = 'beta-laktamok';

-- ══ 2. A három család a béta-laktámok alá ════════════════
update public.drug_groups g set parent_id = b.id, ord = 1
from public.drug_groups b
where b.slug = 'beta-laktamok' and g.slug = 'penicillinek';

update public.drug_groups g set parent_id = b.id, ord = 2
from public.drug_groups b
where b.slug = 'beta-laktamok' and g.slug = 'cefalosporinok';

update public.drug_groups g set parent_id = b.id, ord = 3
from public.drug_groups b
where b.slug = 'beta-laktamok' and g.slug = 'karbapenemek';

-- ══ 3. A többi antibiotikum-család sorrendje ═════════════
-- A béta-laktámok az első helyre kerülnek, a többi utána.
update public.drug_groups set ord = 2 where slug = 'makrolidok';
update public.drug_groups set ord = 3 where slug = 'fluorokinolonok';
update public.drug_groups set ord = 4 where slug = 'aminoglikozidok';
update public.drug_groups set ord = 5 where slug = 'glikopeptidek';

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A fa három szintje. A béta-laktámok alatt három családnak kell lennie.
select
  coalesce(nagyszulo.name, szulo.name, g.name) as szint1,
  case when nagyszulo.id is not null then szulo.name end as szint2,
  case when nagyszulo.id is not null then g.name
       when szulo.id is not null then g.name end as szint3,
  count(s.id) as hatoanyag
from public.drug_groups g
left join public.drug_groups szulo on szulo.id = g.parent_id
left join public.drug_groups nagyszulo on nagyszulo.id = szulo.parent_id
left join public.drug_substances s
  on s.group_id = g.id and s.publish_status = 'published'
where g.publish_status = 'published'
  and coalesce(nagyszulo.slug, szulo.slug, g.slug) = 'antibiotikumok'
group by 1, 2, 3, g.ord, szulo.ord
order by szulo.ord nulls first, g.ord;
