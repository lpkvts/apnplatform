-- APN-MED — A kórképek forrásai automatikusan az irányelvtárba.
--
-- Eddig két helyen éltek a források: a kórképek adatlapján beágyazva, és az
-- irányelvtárban külön felvéve. A kettő kézzel került szinkronba, ezért
-- rendszeresen szétcsúszott: a betegségtárban hivatkozott irányelv nem
-- szerepelt a Tudástárban, és fordítva.
--
-- Ez a migráció egy irányba köti össze őket. A kórkép adatlapja marad a
-- forrás elsődleges helye — ott keletkezik, ott frissül —, és onnan kerül át
-- az irányelvtárba. Az átvezetés indításkor egyszer lefut a meglévő
-- tartalomra, utána pedig minden mentésnél magától.
--
-- Azért ebbe az irányba, mert a kórképet dolgozzuk ki: aki új adatlapot ír,
-- a forrást ott adja meg. Ha külön kellene felvennie az irányelvtárba is,
-- az a lépés elmaradna — ahogy eddig is elmaradt.

-- ══ 1. Az irányelvtár kiegészítése ═══════════════════════
-- Jelöljük, mely bejegyzés származik kórképből: ezeket a szinkron kezeli,
-- a kézzel felvetteket nem érinti.
alter table public.guidelines
  add column if not exists from_disease_slug text,
  add column if not exists source_url text,
  add column if not exists source_year text;

create index if not exists idx_guideline_from_disease
  on public.guidelines(from_disease_slug);

-- ══ 2. Az átvezető függvény ══════════════════════════════
/**
 * Egy kórkép forrásának átvezetése az irányelvtárba.
 *
 * A kórkép adatlapjának source_name, source_url és version mezőiből
 * készít vagy frissít egy irányelvtári bejegyzést. Az azonosító a kórkép
 * slugjából képződik, így az ismételt futás nem hoz létre másolatot.
 *
 * Ha a kórképnek nincs megnevezett forrása, a korábban belőle származó
 * bejegyzés lejárt állapotba kerül — nem törlődik, mert a rá mutató
 * hivatkozások megmaradnak.
 */
create or replace function public.sync_disease_source(p_slug text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  d record;
  v_forras text;
  v_url text;
  v_ev text;
  v_kulcs text;
begin
  select slug, name, specialty, status, body into d
  from public.diseases where slug = p_slug;

  if not found then
    return;
  end if;

  v_forras := nullif(trim(d.body ->> 'source_name'), '');
  v_url    := nullif(trim(d.body ->> 'source_url'), '');
  v_ev     := nullif(trim(d.body ->> 'version'), '');
  v_kulcs  := 'korkep:' || d.slug;

  -- Nincs megnevezett forrás: a korábbi bejegyzést lejártnak jelöljük.
  if v_forras is null then
    update public.guidelines
    set status = 'expired'
    where external_id = v_kulcs;
    return;
  end if;

  insert into public.guidelines
    (external_id, title, specialty, summary, status, version,
     from_disease_slug, source_url, source_year, published_at)
  values (
    v_kulcs,
    v_forras,
    case when d.specialty is null then '{}'::text[] else array[d.specialty] end,
    -- Az összefoglaló megmondja, honnan származik: így az irányelvtárban is
    -- látszik, melyik kórkép hivatkozik rá.
    'Forrás a(z) „' || d.name || '” kórkép adatlapjáról.',
    case when d.status = 'published' then 'published' else 'draft' end,
    v_ev,
    d.slug,
    v_url,
    v_ev,
    now()
  )
  on conflict (external_id) do update set
    title = excluded.title,
    specialty = excluded.specialty,
    summary = excluded.summary,
    status = excluded.status,
    version = excluded.version,
    source_url = excluded.source_url,
    source_year = excluded.source_year,
    updated_at = now();
end;
$$;

revoke all on function public.sync_disease_source(text) from public, anon;

-- ══ 3. Eseményvezérelt átvezetés ═════════════════════════
/**
 * A kórkép mentésekor magától lefut.
 *
 * Így az adatlap és az irányelvtár nem tud szétcsúszni: aki a kórképet
 * szerkeszti, nem kell külön gondolnia az irányelvtárra.
 */
create or replace function public.trg_sync_disease_source()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.sync_disease_source(new.slug);
  return new;
end;
$$;

drop trigger if exists trg_diseases_source_sync on public.diseases;
create trigger trg_diseases_source_sync
  after insert or update of body, status, name, specialty
  on public.diseases
  for each row execute function public.trg_sync_disease_source();

-- ══ 4. A meglévő tartalom átvezetése ═════════════════════
-- Egyszeri lefutás minden kórképre. Innentől az eseményvezérelt átvezetés
-- tartja karban.
do $$
declare
  r record;
begin
  for r in select slug from public.diseases loop
    perform public.sync_disease_source(r.slug);
  end loop;
end;
$$;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- Mely források kerültek át, és melyik kórképből. A „forrás éve” oszlopból
-- látszik, hol van elavult hivatkozás.
select
  g.title                                  as forras,
  g.source_year                            as ev,
  array_to_string(g.specialty, ', ')       as szakterulet,
  g.from_disease_slug                      as korkep,
  g.status,
  case when g.source_year ~ '^[0-9]{4}$'
         and g.source_year::int < extract(year from current_date) - 5
       then 'ELAVULT' else 'rendben' end   as allapot
from public.guidelines g
where g.from_disease_slug is not null
order by g.source_year nulls last, g.title;
