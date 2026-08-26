-- APN Hungary Platform — Szóhasználat egységesítése: „vörös zászló” → „red flag jel”.
--
-- A kódban lévő szövegeket közvetlenül javítottuk. Az adatbázisban tárolt
-- betegségleírásokban viszont a 0019 migráció demo-tartalma is használta a régi
-- kifejezést. A lefutott migrációt nem módosítjuk visszamenőleg, ezért itt
-- frissítjük a már beírt adatot.
--
-- Csak a megjelenő SZÖVEGET cseréljük; a `red_flags` JSON-kulcs neve nem változik.
-- A művelet idempotens: többszöri futtatás nem okoz kárt.

update public.diseases
set body = replace(
             replace(
               replace(
                 replace(body::text, 'vörös zászlóinak', 'red flag jeleinek'),
                 'Vörös zászlók', 'Red flag jelek'),
               'vörös zászlók', 'red flag jelek'),
             'vörös zászló', 'red flag jel'
           )::jsonb
where body::text ~ '[Vv]örös zászló';

-- Ugyanez az irányelvekre, ha ott is előfordul.
update public.guidelines
set body = replace(
             replace(
               replace(
                 replace(body::text, 'vörös zászlóinak', 'red flag jeleinek'),
                 'Vörös zászlók', 'Red flag jelek'),
               'vörös zászlók', 'red flag jelek'),
             'vörös zászló', 'red flag jel'
           )::jsonb
where body is not null and body::text ~ '[Vv]örös zászló';

update public.guidelines
set summary = replace(
                replace(
                  replace(summary, 'Vörös zászlók', 'Red flag jelek'),
                  'vörös zászlók', 'red flag jelek'),
                'vörös zászló', 'red flag jel'
              )
where summary is not null and summary ~ '[Vv]örös zászló';

-- Ellenőrzés: sikeres futás után mindkét szám 0.
select
  (select count(*) from public.diseases where body::text ~ '[Vv]örös zászló') as maradt_betegseg,
  (select count(*) from public.guidelines
    where coalesce(body::text, '') ~ '[Vv]örös zászló' or coalesce(summary, '') ~ '[Vv]örös zászló') as maradt_iranyelv;
