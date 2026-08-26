-- APN Hungary Platform — CPD modul kapcsolható flagje (alapból kikapcsolva, idempotens)
insert into public.feature_flags (key, enabled, label) values
  ('cpd', false, 'CPD – továbbképzés modul')
on conflict (key) do nothing;
