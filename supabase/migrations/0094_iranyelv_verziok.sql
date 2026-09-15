-- APN-MED — Irányelvek verziókezelése: egy főszabály.
--
-- A szabály: ugyanannak az irányelvnek az újabb kiadása automatikusan
-- felváltja a korábbit. A friss verzió látszik a jegyzékben, a korábbiak
-- pedig alatta, „Korábbi verziók" néven maradnak elérhetők.
--
-- Miért van erre szükség. Eddig kétféle módon veszett el a történet:
--
--   · a kórképek forrásfrissítésekor a rekord felülíródott — amikor az akut
--     vesekárosodás KDIGO 2012-ről 2026-ra váltott, a régi hivatkozás
--     nyomtalanul eltűnt;
--
--   · a kézzel felvett irányelveknél az új kiadás új sorként került be, és a
--     régi ottmaradt a jegyzékben — a felhasználó két verziót látott
--     egymás mellett, jelzés nélkül.
--
-- A történet megőrzése nem formaság. Egy dokumentált klinikai döntés annak az
-- irányelvnek az alapján született, ami akkor hatályos volt; utólag tudni
-- kell, mi volt az.

-- ══ 0. A státusz megszorítás bővítése ════════════════════
-- A felváltott kiadás új állapotot kap, amit az eredeti megszorítás nem
-- engedett meg.
alter table public.guidelines
  drop constraint if exists guidelines_status_check;

alter table public.guidelines
  add constraint guidelines_status_check
  check (status in ('draft', 'review', 'published', 'expired', 'superseded'));

-- ══ 1. Az irányelv-család azonosítója ════════════════════
-- A család a verzió nélküli azonosító: minden kiadás ugyanahhoz tartozik.
alter table public.guidelines
  add column if not exists family text,
  add column if not exists superseded_by uuid references public.guidelines(id) on delete set null;

create index if not exists idx_guideline_family
  on public.guidelines(family, source_year desc);

-- A meglévő bejegyzések családba sorolása.
--
-- A kórképekből átvezetett források családja maga a kórkép: azok kiadása
-- attól függ, mikor frissítettük a kórkép forrásmegjelölését.
update public.guidelines
set family = 'korkep:' || from_disease_slug
where from_disease_slug is not null and family is null;

-- A kézzel felvett irányelveknél az évszámot levágjuk az azonosítóról, ha
-- annak a végén áll — így az „esc:vernyomas-2024" családja „esc:vernyomas".
update public.guidelines
set family = regexp_replace(external_id, '[-:]?(19|20)[0-9]{2}$', '')
where family is null and external_id is not null;

-- Ami így sem kapott családot, magában áll.
update public.guidelines set family = external_id where family is null;

-- ══ 2. A felváltás automatikája ══════════════════════════
/**
 * Egy irányelv-család rendezése: a legfrissebb marad közzétéve.
 *
 * A sorrendet a forrás éve adja meg, azonos évnél a felvétel ideje. A
 * korábbiak `superseded` állapotba kerülnek, és a `superseded_by` mezőjük a
 * legfrissebbre mutat — így a felület fel tudja őket sorolni alatta.
 *
 * Nem törlünk: a rájuk mutató hivatkozások megmaradnak, és a korábbi
 * döntések visszakereshetők.
 */
create or replace function public.rank_guideline_family(p_family text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_legfrissebb uuid;
begin
  if p_family is null then
    return;
  end if;

  -- A legfrissebb kiadás: a legnagyobb évszám, azonos évnél a később felvett.
  select id into v_legfrissebb
  from public.guidelines
  where family = p_family
    and status <> 'draft'
  order by
    nullif(regexp_replace(coalesce(source_year, ''), '[^0-9]', '', 'g'), '')::int
      desc nulls last,
    coalesce(updated_at, published_at) desc
  limit 1;

  if v_legfrissebb is null then
    return;
  end if;

  -- A legfrissebb közzétéve, és nem mutat senkire.
  update public.guidelines
  set status = 'published', superseded_by = null
  where id = v_legfrissebb;

  -- A többi felváltva, a legfrissebbre mutatva.
  update public.guidelines
  set status = 'superseded', superseded_by = v_legfrissebb
  where family = p_family
    and id <> v_legfrissebb
    and status <> 'draft';
end;
$$;

revoke all on function public.rank_guideline_family(text) from public, anon;

-- ══ 3. Eseménykezelő: mentéskor magától rendez ═══════════
create or replace function public.trg_rank_guideline()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- A rendezés maga is módosítja a táblát, ezért csak akkor futtatjuk, ha a
  -- változás nem a rendezésből származik — ezt a státusz vizsgálatával
  -- kerüljük el, mert a rendezés csak azt és a superseded_by mezőt írja.
  if tg_op = 'INSERT'
     or new.family is distinct from old.family
     or new.source_year is distinct from old.source_year then
    perform public.rank_guideline_family(new.family);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_guidelines_rank on public.guidelines;
create trigger trg_guidelines_rank
  after insert or update of family, source_year
  on public.guidelines
  for each row execute function public.trg_rank_guideline();

-- ══ 4. A kórképforrás-átvezetés verziózzon ═══════════════
/**
 * A kórkép forrásának átvezetése, verziótörténettel.
 *
 * A korábbi működés felülírta a rekordot, ezért a régi forrás eltűnt. Most
 * a kiadás éve is része az azonosítónak: ha a kórkép forrása új évszámot
 * kap, új sor jön létre, és a korábbi felváltottá válik.
 *
 * Évszám nélküli forrásnál marad az egyszerű, felülíró működés — ott nincs
 * mit verziózni.
 */
create or replace function public.sync_disease_source(p_slug text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  d record;
  v_forras text;
  v_url text;
  v_ev text;
  v_csalad text;
  v_kulcs text;
  v_body jsonb;
begin
  select slug, name, specialty, status, body into d
  from public.diseases where slug = p_slug;

  if not found then
    return;
  end if;

  v_forras := nullif(trim(d.body ->> 'source_name'), '');
  v_url    := nullif(trim(d.body ->> 'source_url'), '');
  v_ev     := nullif(trim(d.body ->> 'version'), '');
  v_csalad := 'korkep:' || d.slug;

  -- Az azonosító tartalmazza az évet, ha van: így az új kiadás új sor lesz,
  -- és a korábbi megmarad a történetben.
  v_kulcs := v_csalad || coalesce(':' || v_ev, '');

  if v_forras is null then
    update public.guidelines set status = 'expired' where family = v_csalad;
    return;
  end if;

  v_body := jsonb_build_object(
    'source_name', v_forras,
    'source_url',  coalesce(v_url, ''),
    'version',     coalesce(v_ev, ''),
    'updated',     coalesce(d.body ->> 'updated', ''),
    'evidence',    coalesce(d.body ->> 'evidence', ''),
    'sections',    jsonb_build_array(
      jsonb_build_array(
        'Mire vonatkozik',
        coalesce(d.body ->> 'brief_what',
                 'Ez a forrás a(z) „' || d.name || '” kórkép adatlapján szerepel.')
      ),
      jsonb_build_array('Miért fontos', coalesce(d.body ->> 'brief_why', ''))
    )
  );

  insert into public.guidelines
    (external_id, family, title, specialty, summary, body, status, version,
     from_disease_slug, source_url, source_year, published_at)
  values (
    v_kulcs, v_csalad, v_forras,
    case when d.specialty is null then '{}'::text[] else array[d.specialty] end,
    'Forrás a(z) „' || d.name || '” kórkép adatlapjáról.',
    v_body,
    case when d.status = 'published' then 'published' else 'draft' end,
    v_ev, d.slug, v_url, v_ev, now()
  )
  on conflict (external_id) do update set
    family = excluded.family,
    title = excluded.title,
    specialty = excluded.specialty,
    summary = excluded.summary,
    body = excluded.body,
    status = excluded.status,
    version = excluded.version,
    source_url = excluded.source_url,
    source_year = excluded.source_year,
    updated_at = now();

  -- A család rendezése: a legfrissebb marad közzétéve.
  perform public.rank_guideline_family(v_csalad);
end;
$$;

revoke all on function public.sync_disease_source(text) from public, anon;

-- ══ 5. Az összes meglévő család rendezése ════════════════
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
-- Mely családokban van több kiadás, és melyik a hatályos.
select
  g.family                                    as csalad,
  count(*)                                    as kiadasok,
  max(g.source_year) filter (
    where g.status = 'published')             as hatalyos_ev,
  string_agg(g.source_year, ', '
    order by g.source_year desc)              as osszes_ev
from public.guidelines g
where g.family is not null
group by g.family
having count(*) > 1
order by count(*) desc, g.family;

-- Az állapotok megoszlása.
select status, count(*) from public.guidelines group by status order by 2 desc;
