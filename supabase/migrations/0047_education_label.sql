-- APN-MED — Az oktatói mód kapcsolójának helyreállítása.
--
-- A Beállítások oldal a címke nélküli kapcsolókat elrejti — így tüntettük el
-- annak idején a már nem használt ekg_learning kapcsolót. Ha ugyanez az
-- oktatói módra is lefutott, a kapcsoló eltűnt a felületről, pedig a modul
-- azóta elkészült.
--
-- Ez a szkript visszaadja a címkét, hogy a kapcsoló újra megjelenjen.

update public.feature_flags
set label = 'Oktatói mód (Education)'
where key = 'education' and label is null;

update public.feature_flags
set label = 'Mentorprogram'
where key = 'mentorprogram' and label is null;

-- Ellenőrzés: a láthatóvá tett kapcsolók.
select key, enabled, label,
       case when label is null then 'REJTVE a Beállításokban' else 'látható' end as allapot
from public.feature_flags
order by key;
