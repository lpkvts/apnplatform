-- APN-MED — Vérgázelemzés modul kapcsolója.
--
-- A modul a megadott értékekből számol: sav-bázis irány, elsődleges ok,
-- kompenzáció, anionrés és oxigenizáció. Adatbázist nem igényel, a számítás
-- a kliensen fut — a beírt értékek nem tárolódnak.

insert into public.feature_flags (key, enabled, label) values
  ('vergaz', false, 'Vérgázelemzés')
on conflict (key) do nothing;

select key, enabled, label from public.feature_flags order by key;
