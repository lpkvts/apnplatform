-- APN Hungary Platform — Betegség-katalógus: stub + BNO (additív, idempotens)
alter table public.diseases add column if not exists is_stub boolean not null default false;
alter table public.diseases add column if not exists bno text;
create index if not exists idx_diseases_stub on public.diseases(is_stub, status);
