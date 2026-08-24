-- APN Hungary Platform — Betegvizsgálat 2.0 (propedeutikai vizsgálati modul)
create table if not exists public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null default 'clinical' check (mode in ('clinical','education','practice')),
  exam_type text,                       -- full | acute | system
  focus text,                           -- vezető panasz vagy szervrendszer
  title text not null default 'Betegvizsgálat',
  status text not null default 'active' check (status in ('active','completed','archived')),
  anamnesis jsonb not null default '{}'::jsonb,
  vitals jsonb not null default '[]'::jsonb,       -- mérések tömbje (trend)
  general_exam jsonb not null default '{}'::jsonb,
  systems jsonb not null default '{}'::jsonb,       -- resp/cardio/neuro/abdo/uro/msk/skin
  red_flags text[] not null default '{}',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_exam_owner on public.exam_sessions(owner_id, status, updated_at desc);
drop trigger if exists trg_exam_updated on public.exam_sessions;
create trigger trg_exam_updated before update on public.exam_sessions for each row execute function public.set_updated_at();

alter table public.exam_sessions enable row level security;
drop policy if exists "exam: saját" on public.exam_sessions;
create policy "exam: saját" on public.exam_sessions for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
