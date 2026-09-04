-- APN-MED — Az „Új betegértékelés" modul kapcsolója.
--
-- A modul a következő fejlesztésig kikapcsolt állapotban marad. A kapcsoló
-- létrehozása lehetővé teszi, hogy adminisztrátorként bármikor visszakapcsold,
-- kódmódosítás nélkül.
--
-- A már rögzített értékelések nem vesznek el: a kapcsoló csak a belépési
-- pontokat rejti el, az adatok a helyükön maradnak.

insert into public.feature_flags (key, enabled, label) values
  ('ertekeles', false, 'Új betegértékelés')
on conflict (key) do nothing;

select key, enabled, label from public.feature_flags where key = 'ertekeles';
