-- APN-MED — A verziókezelés két hibájának javítása.
--
-- A 0096 futtatása megállt, két okból. Mindkettő az előző körökben
-- keletkezett.
--
-- ELSŐ HIBA — a státusz megszorítása
--
-- A 0094 bevezette a „superseded” állapotot a felváltott kiadásoknak, de a
-- tábla eredeti megszorítása csak négy értéket enged: draft, review,
-- published, expired. Az új érték beírása ezért elutasításra került.
--
-- MÁSODIK HIBA — a családba sorolás túl tág mintája
--
-- A 0096 így sorolta be a korábbi ESC-kiadásokat:
--
--   where (title ilike '%szívelégtelenség%' or title ilike '%heart failure%')
--     and (title ilike '%ESC%' or source_url ilike '%escardio%')
--
-- Ebbe beleesett a hypervolaemia kórkép forrása is — „Nemzetközi
-- szívelégtelenségi és folyadékkezelési ajánlások”, escardio hivatkozással.
-- Egy kórképforrás viszont nem tartozik az ESC szívelégtelenség-irányelv
-- családjába: annak a családja a saját kórképe.
--
-- A hibaüzenet ezt jól mutatta: a hypervolaemia sorát próbálta felváltottnak
-- jelölni. A javítás után a kórképből származó források családja mindig a
-- saját kórképük marad.

-- ══ 1. A státusz megszorítás bővítése ════════════════════
alter table public.guidelines
  drop constraint if exists guidelines_status_check;

alter table public.guidelines
  add constraint guidelines_status_check
  check (status in ('draft', 'review', 'published', 'expired', 'superseded'));

-- ══ 2. A téves családba sorolás visszavonása ═════════════
-- A kórképből származó források családja mindig a saját kórképük.
update public.guidelines
set family = 'korkep:' || from_disease_slug,
    status = case when status = 'superseded' then 'published' else status end,
    superseded_by = null
where from_disease_slug is not null
  and family is distinct from 'korkep:' || from_disease_slug;

-- ══ 3. A korábbi ESC-kiadások helyes besorolása ══════════
-- Csak azokat soroljuk a szívelégtelenség-családba, amelyek NEM kórképből
-- származnak, és a címük az ESC irányelvére utal.
update public.guidelines
set family = 'esc:szivelegtelenseg'
where from_disease_slug is null
  and family is distinct from 'esc:szivelegtelenseg'
  and title ilike '%ESC%'
  and (title ilike '%szívelégtelenség%' or title ilike '%heart failure%');

-- ══ 4. Minden család újrarendezése ═══════════════════════
do $$
declare
  r record;
begin
  for r in select distinct family from public.guidelines where family is not null loop
    perform public.rank_guideline_family(r.family);
  end loop;
end;
$$;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- Egyetlen kórképforrásnak sem lehet idegen családja.
select
  count(*) filter (
    where from_disease_slug is not null
      and family <> 'korkep:' || from_disease_slug)  as teves_besorolas,
  count(*) filter (where status = 'superseded')      as felvaltott,
  count(*) filter (where status = 'published')       as hatalyos
from public.guidelines;

-- A több kiadású családok: melyik a hatályos.
select
  family                                             as csalad,
  count(*)                                           as kiadasok,
  max(source_year) filter (where status = 'published') as hatalyos_ev,
  string_agg(source_year || ' (' || status || ')', ', '
    order by source_year desc)                       as kiadasok_reszletesen
from public.guidelines
where family is not null
group by family
having count(*) > 1
order by count(*) desc;
