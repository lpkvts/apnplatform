-- APN Hungary Platform — Felhasználói kedvencek (csillagozás)
create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null,   -- disease | lab | score | ekg | guideline | context
  item_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);
create index if not exists idx_fav_user on public.favorites(user_id, item_type);
alter table public.favorites enable row level security;
drop policy if exists "fav: saját" on public.favorites;
create policy "fav: saját" on public.favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
