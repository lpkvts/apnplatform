-- APN-MED — Hatástalan kapcsoló elrejtése és a húgyúti fertőzés átsorolása.
--
-- Két, egymástól független rendezés.

-- ══ 1. Az EKG oktatóanyag-kapcsoló elrejtése ═════════════
-- A kapcsolót a kód sehol nem kérdezi, tehát a Beállítások oldalon egy
-- hatástalan kapcsoló látszik. A 0033 migráció ezt már elrejtette a címke
-- kiürítésével, de ha az nem futott le, a kapcsoló továbbra is megjelenik.
--
-- Nem töröljük, hogy egy esetleges korábbi beállítás ne vesszen el — csak
-- kivesszük a listából. Ha a modul egyszer elkészül, a címke visszaadható.
update public.feature_flags
set label = null, enabled = false
where key = 'ekg_learning';

-- ══ 2. A húgyúti fertőzés a nefrológiai blokkba ══════════
-- A kórkép „Infektológia-urológia” szakterület alatt szerepelt, ami külön
-- blokkot adott a betegségtárban. A húgyúti fertőzés viszont ugyanoda
-- tartozik, mint a többi vesekórkép: a felhasználó ott keresi, és a
-- szövegkörnyezete is ott teljes — a vesefunkció, a kőbetegség és a
-- katéteres forma egymás mellett érthető meg.
update public.diseases
set specialty = 'Nefrológia-urológia'
where specialty in (
  'Infektológia-urológia',
  'Infektológia / urológia',
  'Urológia-infektológia'
);

-- A meglévő húgyúti kórképek besorolása azonosító alapján is, mert a
-- szakterület megnevezése változhatott.
update public.diseases
set specialty = 'Nefrológia-urológia'
where slug in (
  'hugyuti-fertozes',
  'uti',
  'cystitis',
  'pyelonephritis',
  'kateteres-hugyuti-fertozes'
)
and specialty is distinct from 'Nefrológia-urológia';

-- ══ 3. Kiürült szakterületek keresése ════════════════════
-- Ha az átsorolás után maradt üres megnevezés, az itt látszik. Nem
-- törlünk automatikusan: a szakterület nem önálló tábla, hanem a kórképek
-- mezője — ami nem szerepel egyetlen kórképnél sem, az magától eltűnik.
select
  specialty as szakterulet,
  count(*) as korkep,
  string_agg(name, ', ' order by name) as korkepek
from public.diseases
where status = 'published'
group by specialty
order by count(*), specialty;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A nefrológiai blokk teljes tartalma az átsorolás után.
select slug, name,
  case when body ->> 'brief_what' is null then 'csonk' else 'kidolgozott' end as allapot,
  body ->> 'version' as forras_ev
from public.diseases
where specialty = 'Nefrológia-urológia' and status = 'published'
order by name;
