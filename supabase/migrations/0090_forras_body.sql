-- APN-MED — A kórképből átvezetett források tartalmának pótlása.
--
-- A 0082 migráció átvezeti a kórképek forrásait az irányelvtárba, de a
-- bejegyzés `body` mezőjét üresen hagyta. A felület viszont onnan olvassa a
-- forrás adatait és a szakaszokat, ezért az „APN-összefoglaló" és az
-- „Eredeti forrás" nézet hibára futott.
--
-- Két javítás:
--
--   · a szinkron mostantól kitölti a body mezőt a kórkép forrásadataival,
--     és összefoglaló szakaszokat is átemel — így a jegyzékben álló forrás
--     önmagában is használható;
--
--   · a meglévő bejegyzések újragenerálódnak.
--
-- Előfeltétel: a 0082 lefutott.

create or replace function public.sync_disease_source(p_slug text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  d record;
  v_forras text;
  v_url text;
  v_ev text;
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
  v_kulcs  := 'korkep:' || d.slug;

  if v_forras is null then
    update public.guidelines set status = 'expired' where external_id = v_kulcs;
    return;
  end if;

  -- A body a forrás metaadatait tartalmazza, és két szakaszt a kórkép
  -- adatlapjáról: mire vonatkozik, és mit kell tudni róla. Ennyi elég ahhoz,
  -- hogy a jegyzékben álló bejegyzés önmagában is értelmes legyen, de nem
  -- másolja le a teljes adatlapot — az a kórképnél marad.
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
      jsonb_build_array(
        'Miért fontos',
        coalesce(d.body ->> 'brief_why', '')
      )
    )
  );

  insert into public.guidelines
    (external_id, title, specialty, summary, body, status, version,
     from_disease_slug, source_url, source_year, published_at)
  values (
    v_kulcs,
    v_forras,
    case when d.specialty is null then '{}'::text[] else array[d.specialty] end,
    'Forrás a(z) „' || d.name || '” kórkép adatlapjáról.',
    v_body,
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
    body = excluded.body,
    status = excluded.status,
    version = excluded.version,
    source_url = excluded.source_url,
    source_year = excluded.source_year,
    updated_at = now();
end;
$$;

revoke all on function public.sync_disease_source(text) from public, anon;

-- ══ A meglévő bejegyzések újragenerálása ═════════════════
do $$
declare
  r record;
begin
  for r in select slug from public.diseases loop
    perform public.sync_disease_source(r.slug);
  end loop;
end;
$$;

-- ══ A többi irányelv üres body mezőjének pótlása ═════════
-- A kézzel felvett irányelveknél is előfordulhat üres body. Üres objektumot
-- adunk helyette, hogy a felület ne null értékkel dolgozzon.
update public.guidelines
set body = '{}'::jsonb
where body is null;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- Egyetlen irányelvnek sem lehet üres a body mezője.
select
  count(*)                                        as osszes,
  count(*) filter (where body is null)            as ures_body,
  count(*) filter (where from_disease_slug is not null) as korkepbol
from public.guidelines;
