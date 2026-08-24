-- APN Hungary Platform — Clinical Case (V3)
create sequence if not exists public.clinical_case_seq start 100;
create table if not exists public.clinical_cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  case_no bigint not null default nextval('public.clinical_case_seq'),
  title text not null default 'Új klinikai eset',
  status text not null default 'draft' check (status in ('draft','active','completed','followup','archived')),
  context_id text, disease_id uuid references public.diseases(id) on delete set null,
  complaint text, background text,
  vitals jsonb not null default '{}'::jsonb, physical jsonb not null default '{}'::jsonb,
  problems text[] not null default '{}', red_flags text[] not null default '{}',
  decision text, summary text, sbar jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists idx_cases_owner on public.clinical_cases(owner_id, status, updated_at desc);
drop trigger if exists trg_cases_updated on public.clinical_cases;
create trigger trg_cases_updated before update on public.clinical_cases for each row execute function public.set_updated_at();

create table if not exists public.clinical_case_labs (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references public.clinical_cases(id) on delete cascade,
  lab_id text, name text, value text, unit text, ref text, status text, measured_on date, created_at timestamptz not null default now());
create index if not exists idx_case_labs on public.clinical_case_labs(case_id);
create table if not exists public.clinical_case_scores (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references public.clinical_cases(id) on delete cascade,
  score_id text, score_name text, value numeric, band text, created_at timestamptz not null default now());
create index if not exists idx_case_scores on public.clinical_case_scores(case_id);
create table if not exists public.clinical_case_ekgs (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references public.clinical_cases(id) on delete cascade,
  ekg_id text, name text, category text, note text, assessment text, created_at timestamptz not null default now());
create index if not exists idx_case_ekgs on public.clinical_case_ekgs(case_id);
create table if not exists public.clinical_case_followups (
  id uuid primary key default gen_random_uuid(), case_id uuid not null references public.clinical_cases(id) on delete cascade,
  horizon text, due_on date, checks text, labs text, symptoms text, repeat_score text, note text,
  done boolean not null default false, created_at timestamptz not null default now());
create index if not exists idx_case_followups on public.clinical_case_followups(case_id, due_on);

alter table public.clinical_cases enable row level security;
drop policy if exists "case: saját" on public.clinical_cases;
create policy "case: saját" on public.clinical_cases for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
do $$ declare t text; begin
  foreach t in array array['clinical_case_labs','clinical_case_scores','clinical_case_ekgs','clinical_case_followups'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "case_child: saját" on public.%I', t);
    execute format('create policy "case_child: saját" on public.%I for all using (exists (select 1 from public.clinical_cases c where c.id = case_id and c.owner_id = auth.uid())) with check (exists (select 1 from public.clinical_cases c where c.id = case_id and c.owner_id = auth.uid()))', t);
  end loop; end $$;
