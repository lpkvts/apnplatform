-- APN Hungary Platform — profil bővítése szakmai/végzettségi adatokkal
alter table public.profiles add column if not exists apn_type text;       -- APN szakirány
alter table public.profiles add column if not exists title text;          -- beosztás
alter table public.profiles add column if not exists workplace text;      -- munkahely
alter table public.profiles add column if not exists qualification text;  -- végzettség megnevezése
alter table public.profiles add column if not exists qual_year int;       -- végzettség éve
alter table public.profiles add column if not exists phone text;          -- telefon
