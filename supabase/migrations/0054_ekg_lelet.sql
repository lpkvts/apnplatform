-- APN-MED — Az EKG-lelet átnézése funkció kapcsolója.
--
-- Béta funkció: feltöltött EKG-fotó strukturált átnézése. A kép nem kerül
-- tárolásra, a feldolgozás után eldobódik.
--
-- A kapcsoló alapból kikapcsolt. Bekapcsolás előtt érdemes mérlegelni:
--   · a leleten szereplő betegadatok kitakarását a felület kéri, de nem
--     tudja kikényszeríteni — ezt a használati rendben kell rögzíteni;
--   · a funkció nem diagnosztikai eszköz, és a felület ezt több helyen
--     kimondja, de az intézményi szabályozásnak is illeszkednie kell hozzá.

insert into public.feature_flags (key, enabled, label) values
  ('ekg_lelet', false, 'EKG-lelet átnézése (béta)')
on conflict (key) do nothing;

select key, enabled, label from public.feature_flags where key = 'ekg_lelet';
