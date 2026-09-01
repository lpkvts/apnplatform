-- APN-MED — Verziókövetés: mennyit lássanak a felhasználók.
--
-- A változásnaplóban minden apró javítás megjelenítése elnyomja a lényeges
-- változásokat, és fölöslegesen jelez a harangon. Ez a kapcsoló szabályozza,
-- hogy a felhasználók a teljes naplót lássák-e, vagy csak a lényeges
-- változásokat: az új funkciókat és a szakmai tartalmat.
--
-- Az adminisztrátorok mindig a teljes naplót látják, a kapcsoló állásától
-- függetlenül — nekik a hibajavítások nyomon követése is munkaeszköz.
--
-- Alapból kikapcsolva: a felhasználók a szűkített nézetet kapják.

insert into public.feature_flags (key, enabled, label) values
  ('changelog_full', false, 'Verziókövetés: minden apró frissítés megjelenítése')
on conflict (key) do nothing;

select key, enabled, label from public.feature_flags order by key;
