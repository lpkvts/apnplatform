-- APN-MED — Kompetenciatérkép modul kapcsolója.
--
-- A modul a 13/2025. (IV. 17.) BM rendelet alapján mutatja be a kiterjesztett
-- hatáskörű ápoló kompetenciáit. A tartalom a kódban van, adatbázist nem
-- igényel — csak a megjelenítést kapcsoljuk.

insert into public.feature_flags (key, enabled, label) values
  ('kompetenciaterkep', false, 'APN Kompetenciatérkép')
on conflict (key) do nothing;

select key, enabled, label from public.feature_flags order by key;
