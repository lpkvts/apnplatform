-- APN-MED — A kezdőlapi „Legutóbbi tevékenységek" blokk kapcsolója.
--
-- Alapból bekapcsolva marad, hogy a jelenlegi működés ne változzon. A
-- kapcsoló azért kell, mert a blokk nem mindenkinek hasznos: aki nem
-- rögzít betegértékeléseket, annak csak helyet foglal a kezdőlapon.
--
-- A kikapcsolás nem töröl semmit: az értékelések a Klinikai esetek alatt
-- továbbra is elérhetők.

insert into public.feature_flags (key, enabled, label) values
  ('legutobbi_tevekenysegek', true, 'Kezdőlap: legutóbbi tevékenységek')
on conflict (key) do nothing;

select key, enabled, label from public.feature_flags
where key = 'legutobbi_tevekenysegek';
