-- APN-MED — Nemzetközi kitekintés modul kapcsolója.
--
-- Kilenc ország APN-gyakorlatának összehasonlítása: hatáskör, képzés,
-- felírási jog, önállóság. A tartalom a kódban van, adatbázist nem igényel.

insert into public.feature_flags (key, enabled, label) values
  ('nemzetkozi', false, 'Nemzetközi kitekintés')
on conflict (key) do nothing;

select key, enabled, label from public.feature_flags where key = 'nemzetkozi';
