-- APN Hungary Platform — Feature flags (adminból kapcsolható modulrészek)
create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  label text,
  updated_at timestamptz not null default now()
);
insert into public.feature_flags (key, enabled, label) values
  ('ekg_exam', false, 'EKG vizsga mód'),
  ('ekg_learning', false, 'EKG oktatóanyagok / videók')
on conflict (key) do nothing;

alter table public.feature_flags enable row level security;
drop policy if exists "flags: olvasás" on public.feature_flags;
create policy "flags: olvasás" on public.feature_flags for select using (true);
drop policy if exists "flags: admin" on public.feature_flags;
create policy "flags: admin" on public.feature_flags for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
