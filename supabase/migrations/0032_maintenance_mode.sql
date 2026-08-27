-- APN-MED — Karbantartási mód.
--
-- Bekapcsolva a felhasználók egy tájékoztató oldalt látnak a platform helyett.
-- Az adminisztrátorok továbbra is beléphetnek és dolgozhatnak — enélkül a
-- karbantartás alatt maga a javítás sem lenne elvégezhető.
--
-- A kapcsoló a meglévő feature_flags táblába kerül, hogy ne legyen két külön
-- rendszer ugyanarra. Az üzenet szövegéhez viszont kell egy szöveges mező.

alter table public.feature_flags
  add column if not exists value text;

comment on column public.feature_flags.value is
  'Opcionális szöveges érték a kapcsolóhoz (például a karbantartási üzenet).';

insert into public.feature_flags (key, enabled, label, value) values
  ('maintenance', false, 'Karbantartási mód',
   'A platform karbantartás miatt átmenetileg nem érhető el. Kérjük, próbáld újra később.')
on conflict (key) do nothing;

-- Ellenőrzés: a kapcsolónak szerepelnie kell a listában.
select key, enabled, label from public.feature_flags order by key;
