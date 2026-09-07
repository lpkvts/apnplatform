-- APN-MED — APN World adatmodell.
--
-- Az országadatok adatbázisba kerülnek, nem a kódba: így adminisztrátorból
-- bővíthetők, és a szerkezet elbír száznál több országot is.
--
-- Két elv határozza meg a felépítést.
--
-- Az első: az adathiány önálló állapot. Minden hatásköri dimenzió négy
-- értéket vehet fel — igen, feltételes, nem, nincs elég adat —, és az
-- utolsó nem hiba, hanem tájékoztatás. Az országprofil egésze is kap egy
-- megbízhatósági jelölést.
--
-- A második: minden állítás mögött forrás áll. A források külön táblában,
-- ellenőrzési dátummal, hogy látszódjon, mikor néztük meg utoljára.

-- ══ Országok ═════════════════════════════════════════════
create table if not exists public.apn_countries (
  id uuid primary key default gen_random_uuid(),
  /** Kétbetűs országkód — a térképhez és a rendezéshez. */
  code text not null unique,
  name text not null,
  name_en text,
  flag text,
  region text not null check (region in
    ('europe', 'north_america', 'south_america', 'asia', 'africa', 'oceania')),

  /** Az APN-rendszer általános állapota. Nem rangsor: a rendszerek eltérő
      egészségügyi és jogi környezetben működnek. */
  status text not null default 'limited' check (status in
    ('established', 'developing', 'emerging', 'limited')),

  /** Mennyire megbízható az, amit erről az országról tudunk. */
  data_confidence text not null default 'limited' check (data_confidence in
    ('high', 'moderate', 'limited')),

  /** A szerepkörök helyi megnevezései: [{ name, abbr, note }] */
  roles jsonb not null default '[]'::jsonb,

  /** Oktatás: { level, master_required, doctoral_pathway, clinical_hours,
      certification, registration, recertification, note } */
  education jsonb not null default '{}'::jsonb,

  /** Szabályozás: { level, protected_title, registration, scope_regulated,
      prescribing_regulated, since, note } */
  regulation jsonb not null default '{}'::jsonb,

  /**
   * Hatáskör, tizennégy dimenzióban. Kulcsonként:
   *   { v: 'yes' | 'conditional' | 'no' | 'unknown',
   *     scope: 'national' | 'regional' | 'institutional' | 'conditional',
   *     note: '…' }
   */
  scope jsonb not null default '{}'::jsonb,

  /** Gyógyszerfelírás — ötfokú, mert az igen/nem félrevezető lenne. */
  prescribing text not null default 'unknown' check (prescribing in
    ('none', 'limited', 'conditional', 'broad', 'independent', 'unknown')),
  prescribing_note text,

  autonomy text not null default 'unknown' check (autonomy in
    ('low', 'moderate', 'high', 'unknown')),
  autonomy_note text,

  primary_care text not null default 'unknown' check (primary_care in
    ('low', 'moderate', 'high', 'very_high', 'unknown')),
  primary_care_areas text[] not null default '{}',

  hospital_areas text[] not null default '{}',

  strengths text[] not null default '{}',
  challenges text[] not null default '{}',

  description text,
  /** Objektív szakmai értelmezés: miért tanulságos ez a modell. */
  why_interesting text,

  /** Piszkozat → elbírálás → közzétéve. Csak a közzétett látszik. */
  publish_status text not null default 'draft' check (publish_status in
    ('draft', 'review', 'published')),
  last_verified date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_apn_country_pub
  on public.apn_countries(publish_status, region, name);

-- ══ APN-modellek ═════════════════════════════════════════
create table if not exists public.apn_models (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  flag text,
  /** Egymondatos jellemzés. */
  tagline text,
  definition text,
  education text,
  regulation text,
  scope_of_practice text,
  prescribing text,
  autonomy text,
  primary_care_role text,
  hospital_role text,
  strengths text[] not null default '{}',
  challenges text[] not null default '{}',
  /** Mely országokra jellemző — kódokkal. */
  country_codes text[] not null default '{}',
  ord int not null default 0,
  publish_status text not null default 'draft' check (publish_status in
    ('draft', 'review', 'published')),
  last_verified date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ══ Források ═════════════════════════════════════════════
create table if not exists public.apn_sources (
  id uuid primary key default gen_random_uuid(),
  /** Melyik országhoz vagy modellhez tartozik. Üresen általános forrás. */
  country_id uuid references public.apn_countries(id) on delete cascade,
  model_id uuid references public.apn_models(id) on delete cascade,
  title text not null,
  org text,
  url text,
  published_on date,
  accessed_on date,
  created_at timestamptz not null default now()
);

create index if not exists idx_apn_src_country on public.apn_sources(country_id);
create index if not exists idx_apn_src_model on public.apn_sources(model_id);

-- ══ Idővonal ═════════════════════════════════════════════
create table if not exists public.apn_timeline (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  title text not null,
  description text,
  ord int not null default 0,
  publish_status text not null default 'published' check (publish_status in
    ('draft', 'review', 'published')),
  created_at timestamptz not null default now()
);

-- ══ Jogosultságok ════════════════════════════════════════
alter table public.apn_countries enable row level security;
alter table public.apn_models enable row level security;
alter table public.apn_sources enable row level security;
alter table public.apn_timeline enable row level security;

-- Olvasás: a közzétett tartalom minden bejelentkezett felhasználónak,
-- a piszkozat csak a szerkesztőknek.
drop policy if exists "apn world: olvasas" on public.apn_countries;
create policy "apn world: olvasas" on public.apn_countries for select
  using (publish_status = 'published' or public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "apn world: kezeles" on public.apn_countries;
create policy "apn world: kezeles" on public.apn_countries for all
  using (public.has_role(array['admin', 'szerkeszto']))
  with check (public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "apn modell: olvasas" on public.apn_models;
create policy "apn modell: olvasas" on public.apn_models for select
  using (publish_status = 'published' or public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "apn modell: kezeles" on public.apn_models;
create policy "apn modell: kezeles" on public.apn_models for all
  using (public.has_role(array['admin', 'szerkeszto']))
  with check (public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "apn forras: olvasas" on public.apn_sources;
create policy "apn forras: olvasas" on public.apn_sources for select using (true);

drop policy if exists "apn forras: kezeles" on public.apn_sources;
create policy "apn forras: kezeles" on public.apn_sources for all
  using (public.has_role(array['admin', 'szerkeszto']))
  with check (public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "apn idovonal: olvasas" on public.apn_timeline;
create policy "apn idovonal: olvasas" on public.apn_timeline for select
  using (publish_status = 'published' or public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "apn idovonal: kezeles" on public.apn_timeline;
create policy "apn idovonal: kezeles" on public.apn_timeline for all
  using (public.has_role(array['admin', 'szerkeszto']))
  with check (public.has_role(array['admin', 'szerkeszto']));

-- ══ Összesítés a nyitóoldalhoz ═══════════════════════════
/**
 * Az APN World áttekintő számai.
 *
 * Csak a közzétett tartalmat számolja, és külön jelzi, hány országnál
 * hiányos az adat — ez utóbbi ugyanolyan fontos információ, mint a többi.
 */
create or replace function public.apn_world_summary()
returns table (
  orszagok int, modellek int, magas_bizonyossag int,
  onallo_feliras int, mesterfokozat int, forrasok int
)
language sql stable security definer set search_path = public as $$
  select
    (select count(*)::int from public.apn_countries where publish_status = 'published'),
    (select count(*)::int from public.apn_models where publish_status = 'published'),
    (select count(*)::int from public.apn_countries
      where publish_status = 'published' and data_confidence = 'high'),
    (select count(*)::int from public.apn_countries
      where publish_status = 'published' and prescribing in ('broad', 'independent')),
    (select count(*)::int from public.apn_countries
      where publish_status = 'published'
        and (education ->> 'master_required')::boolean is true),
    (select count(*)::int from public.apn_sources)
$$;

revoke all on function public.apn_world_summary() from public, anon;
grant execute on function public.apn_world_summary() to authenticated;

-- ══ Kapcsoló ═════════════════════════════════════════════
insert into public.feature_flags (key, enabled, label) values
  ('apn_world', false, 'APN World (nemzetközi kitekintés)')
on conflict (key) do nothing;

-- A korábbi kapcsoló megszűnik: a modul átvette a helyét.
update public.feature_flags set label = null where key = 'nemzetkozi';

-- Ellenőrzés: a négy tábla és a kapcsoló.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema = 'public' and table_name like 'apn\_%'
union all
select 'kapcsolo', key from public.feature_flags where key = 'apn_world'
order by 1, 2;
