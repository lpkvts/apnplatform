-- APN Hungary Platform — kezdő katalógus-adatok (felhasználó-független)

insert into public.competencies (code, name, domain, sort_order) values
  ('assess',   'Betegvizsgálat / állapotfelmérés', 'Klinikai', 10),
  ('ekg',      'EKG-értelmezés',                    'Klinikai', 20),
  ('lab',      'Laborértékelés',                    'Klinikai', 30),
  ('resp',     'Krónikus légúti betegek gondozása', 'Gondozás', 40),
  ('emerg',    'Sürgősségi állapotfelismerés',      'Sürgősségi', 50),
  ('wound',    'Sebkezelés',                        'Ápolás', 60),
  ('edu',      'Betegoktatás',                      'Kommunikáció', 70)
on conflict (code) do nothing;

insert into public.cpd_activity_types (code, name, default_points) values
  ('course',     'Akkreditált képzés',        10),
  ('conference', 'Konferencia / kongresszus', 8),
  ('elearning',  'E-learning modul',          5),
  ('journal',    'Szakcikk / publikáció',     6),
  ('inhouse',    'Intézményi továbbképzés',   3)
on conflict (code) do nothing;

insert into public.courses (title, provider, category, cpd_points, url) values
  ('EKG alapok APN-eknek',            'APN Akadémia',      'Kardiológia', 10, null),
  ('COPD-gondozás a közösségben',     'Tüdőgyógyász Társ.', 'Pulmonológia', 8, null),
  ('Sürgősségi állapotfelismerés',    'APN Akadémia',      'Sürgősségi', 12, null),
  ('Sebkezelés korszerű alapelvei',   'Sebkezelő Egyesület','Ápolás', 6, null);
