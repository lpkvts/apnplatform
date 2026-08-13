-- APN Hungary Platform — alapséma (PHASE 3–4)
-- Futtatás: SQL editor / supabase db push. A séma MINDIG a kód-deploy előtt fut.

create extension if not exists "pgcrypto";

-- updated_at automatikus karbantartás
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ============ PROFILOK ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  specialty text,
  role text not null default 'apn' check (role in ('apn','szerkeszto','lektor','admin')),
  registration_no text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Új auth.users → profil automatikus létrehozása
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, specialty)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.raw_user_meta_data->>'specialty',''))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Szerepkör-ellenőrző segédfüggvény (RLS-hez)
create or replace function public.has_role(roles text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = any(roles));
$$;

-- ============ KOMPETENCIÁK ============
create table public.competencies (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  domain text,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.competency_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  competency_id uuid not null references public.competencies(id) on delete cascade,
  level int not null default 0 check (level between 0 and 100),
  status text not null default 'not_started' check (status in ('not_started','in_progress','achieved')),
  updated_at timestamptz not null default now(),
  unique (user_id, competency_id)
);
create trigger trg_compprog_updated before update on public.competency_progress
  for each row execute function public.set_updated_at();
create index idx_compprog_user on public.competency_progress(user_id);

-- ============ TANÚSÍTVÁNYOK ============
create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  issuer text,
  issued_on date,
  expires_on date,
  file_url text,
  created_at timestamptz not null default now()
);
create index idx_cert_user on public.certifications(user_id);

-- ============ CPD ============
create table public.cpd_activity_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  default_points numeric(5,1) not null default 0
);

create table public.cpd_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_type_id uuid references public.cpd_activity_types(id) on delete set null,
  title text not null,
  points numeric(5,1) not null default 0,
  activity_date date not null default current_date,
  activity_year int generated always as (extract(year from activity_date)::int) stored,
  certificate_url text,
  created_at timestamptz not null default now()
);
create index idx_cpd_user_year on public.cpd_entries(user_id, activity_year);

create table public.cpd_goals (
  user_id uuid not null references public.profiles(id) on delete cascade,
  year int not null,
  target_points numeric(5,1) not null default 50,
  primary key (user_id, year)
);

-- ============ KURZUSOK ============
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  provider text,
  category text,
  cpd_points numeric(5,1) not null default 0,
  url text,
  starts_on date,
  created_at timestamptz not null default now()
);

-- ============ FORRÁSOK + IRÁNYELVEK (CMS) ============
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  publisher text,
  url text,
  version text,
  published_on date,
  effective_on date,
  review_on date,
  expires_on date,
  last_checked date,
  evidence_level text
);

create table public.guidelines (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  title text not null,
  specialty text[],
  summary text,
  body jsonb,
  source_id uuid references public.sources(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','review','published','expired')),
  ai_generated boolean not null default false,
  version text,
  created_by uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_guidelines_updated before update on public.guidelines
  for each row execute function public.set_updated_at();
create index idx_guidelines_status on public.guidelines(status);

-- ============ ÉRTESÍTÉSEK ============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_notif_user on public.notifications(user_id, read);
