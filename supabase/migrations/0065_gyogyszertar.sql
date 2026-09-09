-- APN-MED — Gyógyszertár: hatóanyag-központú tudásbázis.
--
-- A modul a hatóanyagra épül, nem a készítményre. Ennek oka gyakorlati: a
-- készítménynevek országonként és gyártónként eltérnek, és gyakran változnak,
-- a hatóanyag viszont állandó. Aki a hatóanyagot ismeri, felismeri a
-- készítményt is.
--
-- Amit a modul NEM tartalmaz: adagolást. Az az alkalmazási előírás dolga,
-- ami betegenként és javallatonként eltér, és rendszeresen frissül. Egy
-- másolt dózistáblázat elavulna, és a téves adag a legsúlyosabb ártalom,
-- amit egy ilyen modul okozhatna. Minden hatóanyagnál a hivatalos előírásra
-- hivatkozunk.
--
-- Amit tartalmaz: mire való, hogyan hat, mire figyeljen az ápoló, mi a
-- gyakori buktató, és mikor kell jelezni.

-- ══ Hatóanyagcsoportok ═══════════════════════════════════
create table if not exists public.drug_groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  /** ATC-főcsoport betűjele, ahol értelmezhető. */
  atc text,
  /** Szülőcsoport — így épül fel a fa: antibiotikumok → béta-laktámok. */
  parent_id uuid references public.drug_groups(id) on delete set null,
  short text,
  description text,
  /** Amit a csoport egészéről tudni kell — ez gyakran fontosabb, mint az
      egyes hatóanyagok részletei. */
  key_points text[] not null default '{}',
  apn_notes text[] not null default '{}',
  icon text,
  ord int not null default 0,
  publish_status text not null default 'draft'
    check (publish_status in ('draft', 'review', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_drug_group_parent
  on public.drug_groups(parent_id, ord);

-- ══ Hatóanyagok ══════════════════════════════════════════
create table if not exists public.drug_substances (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  /** Nemzetközi szabadnév, magyaros írásmóddal. */
  name text not null,
  name_intl text,
  atc text,
  group_id uuid references public.drug_groups(id) on delete set null,

  /** Hogyan hat — röviden, a megértéshez szükséges mélységben. */
  mechanism text,
  /** Mire való. */
  indications text[] not null default '{}',
  /** Mikor nem adható. */
  contraindications text[] not null default '{}',

  /**
   * Amire az ápolónak figyelnie kell.
   *
   * Ez a modul lényege: nem a gyógyszerkönyv másolata, hanem az, ami a
   * beadás és a követés során számít.
   */
  apn_focus text[] not null default '{}',
  /** Gyakori vagy súlyos mellékhatások, a felismerés szempontjából. */
  adverse text[] not null default '{}',
  /** Klinikailag jelentős kölcsönhatások. */
  interactions text[] not null default '{}',
  /** Vese- vagy májfunkció szerinti adagmódosítás szükségessége. */
  organ_note text,
  /** Követendő laborérték vagy paraméter. */
  monitoring text[] not null default '{}',
  /** Terhesség és szoptatás — csak jelzés, nem döntés. */
  pregnancy text,

  /** Amit a gyakorlatban gyakran elrontanak. */
  pitfalls text[] not null default '{}',

  /** Hivatalos alkalmazási előírás elérhetősége. */
  spc_url text,
  source_note text,
  last_verified date,

  publish_status text not null default 'draft'
    check (publish_status in ('draft', 'review', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_drug_subst_group
  on public.drug_substances(group_id, name);
create index if not exists idx_drug_subst_pub
  on public.drug_substances(publish_status, name);

-- ══ Antibiotikum-specifikus adatok ═══════════════════════
-- Külön táblában, mert csak az antibiotikumokra vonatkozik, és a többi
-- hatóanyagnál üresen állna.
create table if not exists public.drug_antibiotics (
  substance_id uuid primary key
    references public.drug_substances(id) on delete cascade,
  /** Milyen kórokozókra hat — a klinikai gondolkodás alapja. */
  spectrum text[] not null default '{}',
  /** Amire jellemzően nem hat, pedig sokan azt hiszik. */
  spectrum_gaps text[] not null default '{}',
  /** Baktériumölő vagy szaporodásgátló. */
  action text,
  /** Rezisztencia-mechanizmus, ha klinikailag jelentős. */
  resistance text,
  /** Antibiotikum-gazdálkodási megjegyzés: mikor NE használjuk. */
  stewardship text[] not null default '{}',
  /** Szűkebb hatásspektrumú alternatíva, ha van. */
  narrower_option text
);

-- ══ Jogosultságok ════════════════════════════════════════
alter table public.drug_groups enable row level security;
alter table public.drug_substances enable row level security;
alter table public.drug_antibiotics enable row level security;

drop policy if exists "gyogyszer csoport: olvasas" on public.drug_groups;
create policy "gyogyszer csoport: olvasas" on public.drug_groups for select
  using (publish_status = 'published' or public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "gyogyszer csoport: kezeles" on public.drug_groups;
create policy "gyogyszer csoport: kezeles" on public.drug_groups for all
  using (public.has_role(array['admin', 'szerkeszto']))
  with check (public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "hatoanyag: olvasas" on public.drug_substances;
create policy "hatoanyag: olvasas" on public.drug_substances for select
  using (publish_status = 'published' or public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "hatoanyag: kezeles" on public.drug_substances;
create policy "hatoanyag: kezeles" on public.drug_substances for all
  using (public.has_role(array['admin', 'szerkeszto']))
  with check (public.has_role(array['admin', 'szerkeszto']));

drop policy if exists "antibiotikum: olvasas" on public.drug_antibiotics;
create policy "antibiotikum: olvasas" on public.drug_antibiotics for select using (true);

drop policy if exists "antibiotikum: kezeles" on public.drug_antibiotics;
create policy "antibiotikum: kezeles" on public.drug_antibiotics for all
  using (public.has_role(array['admin', 'szerkeszto']))
  with check (public.has_role(array['admin', 'szerkeszto']));

-- ══ Áttekintő számok ═════════════════════════════════════
create or replace function public.drug_summary()
returns table (csoportok int, hatoanyagok int, antibiotikumok int, ellenorzott int)
language sql stable security definer set search_path = public as $$
  select
    (select count(*)::int from public.drug_groups where publish_status = 'published'),
    (select count(*)::int from public.drug_substances where publish_status = 'published'),
    (select count(*)::int from public.drug_antibiotics a
       join public.drug_substances s on s.id = a.substance_id
       where s.publish_status = 'published'),
    (select count(*)::int from public.drug_substances
       where publish_status = 'published' and last_verified is not null)
$$;

revoke all on function public.drug_summary() from public, anon;
grant execute on function public.drug_summary() to authenticated;

-- ══ Kapcsoló ═════════════════════════════════════════════
insert into public.feature_flags (key, enabled, label) values
  ('gyogyszertar', false, 'Gyógyszertár (hatóanyagok)')
on conflict (key) do nothing;

-- Ellenőrzés.
select 'tabla' as tipus, table_name as nev from information_schema.tables
  where table_schema = 'public' and table_name like 'drug\_%'
union all
select 'kapcsolo', key from public.feature_flags where key = 'gyogyszertar'
order by 1, 2;
