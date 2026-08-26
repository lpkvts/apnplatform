-- APN Hungary Platform — Az újdonságjelzés minden profilon működjön.
--
-- Előzmény: a 0027 migráció csak az updates_seen_at időbélyeget töltötte ki, a
-- updates_seen_version mezőt nem. Mivel az újdonság eldöntése azóta verziószám
-- alapján történik (a dátum-összehasonlítás megbízhatatlan volt), a verzió nélküli
-- fiókoknál a jelzés nem tudott mit összehasonlítani.
--
-- 1) A meglévő fiókok az 1.0.0 alapkiadást tekintsék látottnak. Így megkapják az
--    azóta megjelent kiadásokat (1.1.0-tól), de nem árasztja el őket az alapkiadás
--    huszonkét tétele.
--    Akinél már van rögzített verzió, azt nem érintjük — ő ténylegesen megtekintette.
update public.profiles
set updates_seen_version = '1.0.0'
where updates_seen_version is null;

-- 2) Új regisztrációnál a fiók létrejöttének pillanata legyen a kiindulópont,
--    hogy senki ne kapja meg visszamenőleg a korábbi kiadásokat.
alter table public.profiles
  alter column updates_seen_at set default now();

-- Megjegyzés: az updates_seen_version új fióknál szándékosan marad üres. A kód
-- ilyenkor az updates_seen_at időbélyegre esik vissza, és az első „Megtekintettem”
-- gombnyomáskor rögzül a verzió is — onnantól a jelzés teljesen verzió-alapú.
