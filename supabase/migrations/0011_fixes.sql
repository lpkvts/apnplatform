-- APN Hungary Platform — biztonsági javítások
-- Garantálja a profil szakmai/végzettségi oszlopokat (idempotens; ha a 0007 már lefutott, nem tesz semmit).
alter table public.profiles add column if not exists apn_type text;
alter table public.profiles add column if not exists title text;
alter table public.profiles add column if not exists workplace text;
alter table public.profiles add column if not exists qualification text;
alter table public.profiles add column if not exists qual_year int;
alter table public.profiles add column if not exists phone text;
