-- APN Hungary Platform — Általános klinikai forrás-nyilvántartás (idempotens, inline RLS)
create table if not exists public.clinical_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,                         -- guideline / standard / textbook / study / local / other
  organization text,
  url text,
  version text,
  publication_date date,
  last_verified date,
  next_review date,
  status text not null default 'current' check (status in ('current','superseded','archived')),
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_clinsrc_status on public.clinical_sources(status);
create index if not exists idx_clinsrc_review on public.clinical_sources(next_review);
drop trigger if exists trg_clinsrc_updated on public.clinical_sources;
create trigger trg_clinsrc_updated before update on public.clinical_sources for each row execute function public.set_updated_at();

alter table public.clinical_sources enable row level security;
drop policy if exists "clinsrc: olvasás" on public.clinical_sources;
create policy "clinsrc: olvasás" on public.clinical_sources for select using (true);
drop policy if exists "clinsrc: staff" on public.clinical_sources;
create policy "clinsrc: staff" on public.clinical_sources for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('szerkeszto','lektor','admin')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('szerkeszto','lektor','admin')));
