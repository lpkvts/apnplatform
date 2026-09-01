-- APN-MED — Hiányzó funkciókapcsolók pótlása.
--
-- Az `apn_copilot` kapcsolót öt helyen kérdezi a kód (kezdőlap, Klinikai mag,
-- betegségtár, klinikai kontextus, Copilot oldal), de a feature_flags táblába
-- soha nem került be. Mivel a hiányzó kapcsoló alapértéke „kikapcsolva”, a
-- Copilot mindenhol rejtve maradt, és a Beállítások oldalon sem lehetett
-- bekapcsolni — nem volt mit kapcsolni.
--
-- Alapból kikapcsolva hozzuk létre: a Copilot ANTHROPIC_API_KEY nélkül nem
-- működik, ezért csak akkor érdemes bekapcsolni, ha a kulcs be van állítva.

insert into public.feature_flags (key, enabled, label) values
  ('apn_copilot', false, 'APN Copilot (AI döntéstámogatás)')
on conflict (key) do nothing;

-- Az `ekg_learning` kapcsolót a kód sehol nem kérdezi, tehát a Beállítások
-- oldalon egy hatástalan kapcsoló látszik. Elrejtjük a listából a címke
-- kiürítésével — törölni nem törlünk, hogy egy esetleges korábbi beállítás
-- ne vesszen el.
update public.feature_flags
set label = null
where key = 'ekg_learning';

-- Ellenőrzés: a lista tartalmazza az apn_copilot sort.
select key, enabled, label from public.feature_flags order by key;
