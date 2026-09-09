-- APN-MED — Az allergológiai és immunológiai kórképek egyesítése.
--
-- A betegségtár a szakterület neve szerint csoportosít, ezért két eltérő
-- elnevezés két külön blokkot ad ugyanarra a területre. A 0060 migráció
-- „Allergológia és klinikai immunológia” néven vitte fel a négy új kórképet,
-- miközben a korábbi tartalom más néven szerepel.
--
-- Ez a migráció három lépésben dolgozik. Előbb megmutatja, mi van ott, aztán
-- egységesíti a megnevezést, végül jelzi, ha azonos kórkép két adatlapon
-- szerepel. Az utolsót nem oldja meg magától: két adatlap összevonása
-- tartalmi döntés, amit nem szabad gépiesen elvégezni.

-- ══ 1. Mi van most? ═══════════════════════════════════════
-- Az allergológiához és immunológiához köthető szakterületek, kórképszámmal.
select
  coalesce(specialty, '(nincs megadva)') as szakterulet,
  count(*) as korkep,
  string_agg(name, ', ' order by name) as korkepek
from public.diseases
where status = 'published'
  and (
    specialty ilike '%allerg%'
    or specialty ilike '%immun%'
    or slug in (
      'anafilaxia', 'kronikus-urticaria', 'allergias-rhinitis', 'herediter-angioodema',
      'urticaria', 'angiooedema', 'asthma', 'gyogyszerallergia', 'etelallergia',
      'atopias-dermatitis', 'allergia'
    )
  )
group by 1
order by 2 desc;

-- ══ 2. Egységesítés ═══════════════════════════════════════
-- Minden allergológiai és immunológiai megnevezés egy névre kerül. A választott
-- alak a hazai szakmai besorolást követi: az allergológia és a klinikai
-- immunológia egy szakterület, nem kettő.
update public.diseases
set specialty = 'Allergológia és klinikai immunológia'
where specialty is not null
  and specialty <> 'Allergológia és klinikai immunológia'
  and (
    specialty ilike '%allerg%'
    or specialty ilike 'immunológia'
    or specialty ilike 'klinikai immunológia'
  );

-- ══ 3. Átfedés keresése ═══════════════════════════════════
-- Azonos vagy hasonló nevű kórképek, amelyek külön adatlapon szerepelnek.
-- Ez jellemzően akkor fordul elő, ha ugyanazt a kórképet kétszer vitték fel,
-- eltérő azonosítóval.
--
-- Az összevonás tartalmi döntés: melyik adatlap a részletesebb, melyik forrás
-- frissebb, mely hivatkozásokat kell megőrizni. Ezért itt csak jelezzük.
select
  lower(regexp_replace(name, '[^a-zA-Zíáéóöőúüű]', '', 'g')) as osszevont_nev,
  count(*) as adatlap,
  string_agg(slug || ' (' || status || ')', ' | ' order by slug) as adatlapok
from public.diseases
where specialty = 'Allergológia és klinikai immunológia'
group by 1
having count(*) > 1
order by 2 desc;

-- ══ 4. Végeredmény ════════════════════════════════════════
select slug, name, specialty, status, is_stub
from public.diseases
where specialty = 'Allergológia és klinikai immunológia'
order by name;
