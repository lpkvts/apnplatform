-- APN Hungary Platform — Career és Kompetencia Passport kapcsolók (alapból kikapcsolva; jegelve)
insert into public.feature_flags (key, enabled, label) values
  ('apn_career', false, 'APN Career'),
  ('kompetencia_passport', false, 'Kompetencia Passport')
on conflict (key) do nothing;
