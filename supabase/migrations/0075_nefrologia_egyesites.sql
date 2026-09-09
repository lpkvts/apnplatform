-- APN-MED — A nefrológiai kórképek egy szakterület alá.
--
-- A betegségtár a szakterület neve szerint csoportosít, ezért két eltérő
-- elnevezés két külön blokkot ad. A krónikus vesebetegség „Nefrológia”
-- alatt szerepel, az akut vesekárosodás viszont „Nefrológia-urológia”
-- alatt — pedig ugyanahhoz a területhez tartoznak, és a felhasználó
-- ugyanott keresi őket.
--
-- Az egyesített megnevezés a „Nefrológia-urológia”, mert a szakterület a
-- hazai besorolásban a húgyúti kórképeket is magába foglalja, és a
-- betegségtár később ilyeneket is tartalmazhat.

-- ══ 1. Mi van most? ══════════════════════════════════════
select
  coalesce(specialty, '(nincs megadva)') as szakterulet,
  count(*) as korkep,
  string_agg(name, ', ' order by name) as korkepek
from public.diseases
where status = 'published'
  and (
    specialty in ('Nefrológia', 'Urológia', 'Nefrológia és urológia',
                  'Nefrológia-urológia')
    or slug in ('ckd', 'vesekarosodas', 'aki')
  )
group by 1
order by 2 desc;

-- ══ 2. Egyesítés ═════════════════════════════════════════
update public.diseases
set specialty = 'Nefrológia-urológia'
where specialty in ('Nefrológia', 'Urológia', 'Nefrológia és urológia');

-- A CKD besorolása külön is, mert a rövidített megnevezés miatt a fenti
-- mintára esetleg nem illeszkedik.
update public.diseases
set specialty = 'Nefrológia-urológia'
where slug in ('ckd', 'vesekarosodas')
  and specialty is distinct from 'Nefrológia-urológia';

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- Egy blokkban kell megjelennie minden vesekórképnek.
select slug, name, specialty, status
from public.diseases
where specialty = 'Nefrológia-urológia'
order by name;
