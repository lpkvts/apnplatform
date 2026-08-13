-- APN Hungary Platform — mentett betegértékelések és score-eredmények

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  domain text,
  complaint text,
  consciousness text,
  problems text[] not null default '{}',
  vitals jsonb not null default '{}'::jsonb,
  fields jsonb not null default '{}'::jsonb,
  summary text,
  created_at timestamptz not null default now()
);
create index idx_assess_user on public.assessments(user_id, created_at desc);

create table public.score_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete set null,
  test_id text not null,
  test_name text,
  score numeric,
  band_label text,
  risk text,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_score_user on public.score_results(user_id, created_at desc);

alter table public.assessments   enable row level security;
alter table public.score_results enable row level security;

create policy "értékelés: saját" on public.assessments
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "score eredmény: saját" on public.score_results
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
