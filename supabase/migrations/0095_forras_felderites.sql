-- APN-MED — Forrásfelderítés: mit kell megnézni, és hol.
--
-- Ez a modul nem keres az interneten és nem hív modellt. Azt végzi el, ami
-- gépi segítség nélkül is elvégezhető, és a munka nagy részét kiteszi:
--
--   · összeszedi, mely források avultak el vagy régóta ellenőrizetlenek;
--   · sorba rendezi őket aszerint, mennyire sürgős megnézni;
--   · minden forráshoz megadja, hol kell keresni az újabb kiadást.
--
-- A tényleges ellenőrzést ember végzi. Ennek két haszna van: nem keletkezik
-- téves forrásmegjelölés, és a szerkesztő kezében marad a döntés arról, hogy
-- egy talált dokumentum valóban hatályos irányelv-e.
--
-- Az ellenőrzés tényét viszont rögzítjük — enélkül a következő átnézés
-- ugyanazokat a forrásokat hozná fel újra.

-- ══ 1. Az ellenőrzés nyilvántartása ══════════════════════
alter table public.guidelines
  add column if not exists last_checked_at timestamptz,
  add column if not exists last_checked_by uuid references auth.users(id) on delete set null,
  add column if not exists check_note text;

create index if not exists idx_guideline_checked
  on public.guidelines(last_checked_at nulls first);

-- ══ 2. Hol keresendő az újabb kiadás ═════════════════════
/**
 * A forrás kiadójához tartozó keresési hely.
 *
 * A cím és a forrás-hivatkozás alapján ismeri fel a kiadót. Ez nem
 * tudományos osztályozás, hanem gyakorlati segítség: a szerkesztőnek ne
 * kelljen minden alkalommal megkeresnie, hol van a hivatalos jegyzék.
 */
create or replace function public.guideline_lookup_hint(
  p_title text, p_url text
) returns jsonb
language sql immutable as $$
  select case
    when coalesce(p_url, '') ilike '%kollegium.okfo%'
      or coalesce(p_title, '') ilike '%egészségügyi szakmai%'
      or coalesce(p_title, '') ilike '%szakmai kollégium%'
      then jsonb_build_object(
        'kiado', 'Egészségügyi Szakmai Kollégium',
        'hol', 'https://kollegium.okfo.gov.hu/Iranyelvek/Index',
        'tipp', 'Azonosító szerint kereshető. Az érvényesség lejárhat anélkül, hogy új kiadás jönne.')

    when coalesce(p_url, '') ilike '%escardio%' or coalesce(p_title, '') ilike '%ESC%'
      then jsonb_build_object(
        'kiado', 'Európai Kardiológiai Társaság',
        'hol', 'https://www.escardio.org/Guidelines',
        'tipp', 'Évente augusztus végén, a kongresszuson jelennek meg az új irányelvek.')

    when coalesce(p_url, '') ilike '%kdigo%'
      then jsonb_build_object(
        'kiado', 'KDIGO',
        'hol', 'https://kdigo.org/guidelines/',
        'tipp', 'A tervezetek nyilvános véleményezésen vannak — a véleményezés alatti változat még nem hatályos.')

    when coalesce(p_url, '') ilike '%goldcopd%'
      then jsonb_build_object(
        'kiado', 'GOLD',
        'hol', 'https://goldcopd.org/',
        'tipp', 'Évente frissül, jellemzően év végén a következő évi kiadással.')

    when coalesce(p_url, '') ilike '%iwgdf%'
      then jsonb_build_object(
        'kiado', 'IWGDF',
        'hol', 'https://iwgdfguidelines.org/',
        'tipp', 'Négyévente teljes frissítés; a legutóbbi 2023-as.')

    when coalesce(p_url, '') ilike '%nice.org.uk%'
      then jsonb_build_object(
        'kiado', 'NICE',
        'hol', 'https://www.nice.org.uk/guidance',
        'tipp', 'Azonosító szerint kereshető; a lapon látszik a legutóbbi felülvizsgálat dátuma.')

    when coalesce(p_url, '') ilike '%uroweb%'
      then jsonb_build_object(
        'kiado', 'Európai Urológiai Társaság',
        'hol', 'https://uroweb.org/guidelines',
        'tipp', 'Évente frissül, a tavaszi kongresszusra.')

    when coalesce(p_url, '') ilike '%eaaci%'
      then jsonb_build_object(
        'kiado', 'EAACI',
        'hol', 'https://www.eaaci.org/guidelines/',
        'tipp', 'Témánként eltérő ütemben frissül.')

    when coalesce(p_url, '') ilike '%ewma%'
      then jsonb_build_object(
        'kiado', 'EWMA',
        'hol', 'https://ewma.org/',
        'tipp', 'Dokumentumonként eltérő ütem; a sebkezelési alapelvek ritkán változnak.')

    when coalesce(p_url, '') ilike '%eadv%'
      then jsonb_build_object(
        'kiado', 'EADV',
        'hol', 'https://www.eadv.org/guidelines',
        'tipp', 'Témánként eltérő ütemben frissül.')

    when coalesce(p_url, '') ilike '%idsociety%'
      then jsonb_build_object(
        'kiado', 'IDSA',
        'hol', 'https://www.idsociety.org/practice-guideline/',
        'tipp', 'A régebbi irányelvek is hatályosak maradhatnak, ha nincs új evidencia.')

    when coalesce(p_url, '') ilike '%nnk.gov.hu%'
      then jsonb_build_object(
        'kiado', 'Nemzeti Népegészségügyi Központ',
        'hol', 'https://www.nnk.gov.hu/',
        'tipp', 'Járványügyi és eljárásrendi dokumentumok; gyakran módszertani levél formájában.')

    else jsonb_build_object(
      'kiado', 'egyéb vagy meg nem határozott',
      'hol', coalesce(nullif(p_url, ''), ''),
      'tipp', 'A forrás saját oldalán ellenőrizhető; ha nincs hivatkozás, érdemes megadni.')
  end
$$;

-- ══ 3. A felderítő nézet ═════════════════════════════════
/**
 * Mit érdemes megnézni, és milyen sorrendben.
 *
 * A sürgősséget három tényező adja: a forrás kora, az utolsó ellenőrzés
 * ideje, és hogy hány kórkép támaszkodik rá. Az utolsó azért számít, mert
 * egy tíz kórképnél hivatkozott elavult forrás többet árt, mint egy olyan,
 * amire senki nem mutat.
 */
create or replace view public.guideline_review_queue as
with hasznalat as (
  select
    g.id,
    count(distinct d.slug) as korkep_db
  from public.guidelines g
  left join public.diseases d
    on d.slug = g.from_disease_slug and d.status = 'published'
  group by g.id
)
select
  g.id,
  g.title,
  g.source_year,
  g.source_url,
  g.family,
  g.last_checked_at,
  g.check_note,
  h.korkep_db,

  -- A forrás kora években. Évszám nélküli forrásnál nem számítható.
  case
    when g.source_year ~ '^[0-9]{4}$'
      then extract(year from current_date)::int - g.source_year::int
  end as kor_ev,

  -- Hány napja nem nézte meg senki.
  case
    when g.last_checked_at is not null
      then extract(day from now() - g.last_checked_at)::int
  end as ellenorzes_ota_nap,

  -- Sürgősség: minél nagyobb, annál előbb kell megnézni.
  (
    -- A kor évenként egy pont, öt év fölött duplán.
    coalesce(
      case
        when g.source_year ~ '^[0-9]{4}$' then
          greatest(0, extract(year from current_date)::int - g.source_year::int)
          + greatest(0, extract(year from current_date)::int - g.source_year::int - 5)
        else 3  -- évszám nélküli forrás: közepesen sürgős, mert nem követhető
      end, 0)
    -- Soha nem ellenőrzött: négy pont.
    + case when g.last_checked_at is null then 4
           when g.last_checked_at < now() - interval '6 months' then 2
           else 0 end
    -- Minden rá támaszkodó kórkép egy pont, legfeljebb öt.
    + least(coalesce(h.korkep_db, 0), 5)
  ) as surgosseg,

  public.guideline_lookup_hint(g.title, g.source_url) as kereses

from public.guidelines g
left join hasznalat h on h.id = g.id
where g.status = 'published';

-- ══ 4. Az ellenőrzés rögzítése ═══════════════════════════
/**
 * Egy forrás ellenőrzésének rögzítése.
 *
 * A megjegyzés akkor hasznos, ha nem történt frissítés: „megnéztem, nincs
 * újabb" épp olyan értékes információ, mint egy új kiadás — enélkül a
 * következő átnézés ugyanazt hozná fel.
 */
create or replace function public.mark_guideline_checked(
  p_id uuid, p_note text default null
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.has_role(array['admin', 'szerkeszto', 'lektor']) then
    raise exception 'Nincs jogosultság a forrás ellenőrzésének rögzítéséhez.';
  end if;

  update public.guidelines
  set last_checked_at = now(),
      last_checked_by = auth.uid(),
      check_note = nullif(trim(coalesce(p_note, '')), '')
  where id = p_id;
end;
$$;

revoke all on function public.mark_guideline_checked(uuid, text) from public, anon;
grant execute on function public.mark_guideline_checked(uuid, text) to authenticated;

grant select on public.guideline_review_queue to authenticated;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A tíz legsürgősebben megnézendő forrás.
select
  title,
  source_year as ev,
  kor_ev,
  korkep_db as korkepek,
  coalesce(ellenorzes_ota_nap::text, 'soha') as ellenorizve,
  surgosseg,
  kereses ->> 'kiado' as kiado
from public.guideline_review_queue
order by surgosseg desc, kor_ev desc nulls last
limit 10;

-- Kiadónkénti bontás: hány forrás tartozik hova.
select
  kereses ->> 'kiado' as kiado,
  count(*) as forras,
  round(avg(kor_ev), 1) as atlag_kor
from public.guideline_review_queue
group by 1
order by 2 desc;
