-- APN-MED — Az ESC 2024-es vérnyomás-irányelve a tudásbázisba.
--
-- Ez az irányelv 2024 októberében váltotta fel a 2018-as ESC/ESH ajánlást, és
-- a platform több pontját érinti: a hypertonia kórképet, a SCORE2
-- kockázatbecslőt és a vérnyomáscsökkentő hatóanyagok adatlapjait.
--
-- A legfontosabb változás nem a magas vérnyomás határa — az maradt
-- 140/90 —, hanem két másik dolog:
--
--   · új kategória, az „emelkedett vérnyomás" 120–139/70–89 között. Ez
--     korábban normálisnak vagy magas-normálisnak számított, és a betegek
--     jelentős része átsorolódik;
--
--   · a kezelt beteg célértéke 120–129/70–79 Hgmm lett. Ez alacsonyabb a
--     korábbi 140/90-es célnál, és a gondozott betegek egy részénél
--     kezelésmódosítást jelent.
--
-- A kettő összeér a kockázatbecsléssel: emelkedett vérnyomásnál a
-- gyógyszeres kezelés akkor indokolt, ha a kockázat magas, és három hónap
-- életmódváltás után is 130/80 felett marad.

insert into public.guidelines
  (external_id, title, specialty, summary, body, status, version,
   source_url, source_year, published_at)
values
  (
    'esc:vernyomas-2024',
    'ESC 2024 irányelv az emelkedett vérnyomás és a hypertonia kezeléséről',
    '{"Kardiológia","Prevenció"}',
    'Új vérnyomás-kategória, alacsonyabb célérték és kockázatalapú kezelési döntés. A 2018-as ESC/ESH irányelvet váltja fel.',
    '{"source_name": "Európai Kardiológiai Társaság (ESC)", "source_url": "https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/", "version": "2024", "updated": "2026-09-15", "evidence": "A célérték szigorítása nagy vizsgálatok és metaanalízisek eredményén alapul. Az I. osztályú ajánlás 2024-től kimeneteli előnyt kíván, nem csak vérnyomáscsökkentést.", "sections": [["Új kategória: emelkedett vérnyomás", "A 120–139 Hgmm szisztolés vagy 70–89 Hgmm diasztolés tartomány külön kategóriát kapott. Ez korábban normális vagy magas-normális volt, ezért a betegek jelentős része átsorolódik. A magas vérnyomás határa változatlanul 140/90 Hgmm."], ["Új célérték", "Kezelt betegnél 120–129/70–79 Hgmm, ha a kezelés jól tolerálható. Ez alacsonyabb a korábbi általános 140/90-es célnál, és a gondozott betegek egy részénél kezelésmódosítást jelent. Törékeny betegnél megengedőbb cél is elfogadható."], ["Mikor kell gyógyszer", "Igazolt magas vérnyomásnál minden felnőttnél. Emelkedett vérnyomásnál akkor, ha a szív- és érrendszeri kockázat magas, és három hónap életmódváltás után is 130/80 felett marad — itt kap szerepet a SCORE2 kockázatbecslés."], ["Szűrés", "Negyven év alatt legalább háromévente, negyven felett legalább évente, panaszmentes embernél is. Emelkedett vérnyomásnál, ha gyógyszer még nem indokolt, egy éven belüli ismételt mérés és kockázatbecslés javasolt."], ["Gyógyszeres kezelés rendje", "Első vonalban ACE-gátló, szartán, dihidropiridin típusú kalciumcsatorna-blokkoló és vízhajtó. Kis adagú kétszeres kombináció kezdettől, lehetőleg egyetlen tablettában — ez gyorsabb célérték-elérést és kevesebb mellékhatást ad. A béta-blokkoló hátrébb sorolódott: akkor jön szóba, ha három szer sem elegendő, vagy külön javallat indokolja."], ["APN-szempont", "A rendelőn kívüli mérés hangsúlyt kapott: az otthoni és a huszonnégy órás vérnyomásmérés a kórisme és a beállítás része. A betegoktatás — helyes mérési technika, mérési napló, a só- és káliumbevitel — az irányelv szerint a kezelés egyenrangú eleme, nem kiegészítés."]]}'::jsonb,
    'published', '2024',
    'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/',
    '2024', now()
  ),
  (
    'esc:prevencio-2021',
    'ESC 2021 irányelv a szív- és érrendszeri betegségek megelőzéséről',
    '{"Kardiológia","Prevenció"}',
    'A SCORE2 és SCORE2-OP kockázatbecslés forrása. Életkorfüggő küszöbértékek, négy európai kockázati régió.',
    '{"source_name": "Európai Kardiológiai Társaság (ESC)", "source_url": "https://www.escardio.org/Guidelines", "version": "2021", "updated": "2026-09-15", "evidence": "A SCORE2 modellt tízmilliónál több ember adatain kalibrálták, négy európai kockázati régióra. 2024-ben nem jelent meg új prevenciós irányelv, ezért ez a hatályos.", "sections": [["Mit ad", "A következő tíz évben bekövetkező halálos és nem halálos szív- és érrendszeri esemény valószínűségét becsli látszólag egészséges embereknél. Negyven és hatvankilenc év között a SCORE2, hetven felett a SCORE2-OP."], ["Életkorfüggő küszöbök", "A 2021-es változás egyik lényege, hogy a besorolási határok az életkortól függnek — a korábbi SCORE-nál állandóak voltak. Negyven–negyvenkilenc év: kis-közepes 2,5% alatt, magas 2,5–7,5%, igen magas 7,5% felett. Ötven–hatvankilenc év: 5%, 5–10%, 10% felett. Hetven felett: 7,5%, 7,5–15%, 15% felett."], ["Magyarország besorolása", "Magyarország a magas kockázatú régióba tartozik, Csehországgal, Lengyelországgal, Szlovákiával és Horvátországgal együtt. A megfelelő régió táblázatának használata nélkül a becslés jelentősen alulbecsül."], ["Mikor nem alkalmazható", "Igazolt szív- és érrendszeri betegségnél, cukorbetegségnél, közepes vagy súlyos vesebetegségnél, örökletes koleszterin-anyagcserezavarnál és terhességben. Ezek a betegek eleve magas vagy igen magas kockázatúak, és külön szabályok szerint kezelendők."]]}'::jsonb,
    'published', '2021',
    'https://www.escardio.org/Guidelines', '2021', now()
  )
on conflict (external_id) do update set
  title = excluded.title,
  specialty = excluded.specialty,
  summary = excluded.summary,
  body = excluded.body,
  status = excluded.status,
  version = excluded.version,
  source_url = excluded.source_url,
  source_year = excluded.source_year,
  updated_at = now();

-- ══ A hypertonia kórkép forrásának frissítése ════════════
-- A kórkép a 2018-as szemléletet tükrözheti; a forrásmegjelölést
-- mindenképpen a 2024-es irányelvre állítjuk, és jelezzük a két
-- legfontosabb változást.
update public.diseases
set body = body
  || jsonb_build_object(
    'source_name', 'ESC 2024 irányelv az emelkedett vérnyomás és a hypertonia kezeléséről',
    'source_url', 'https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/',
    'version', '2024',
    'updated', to_char(current_date, 'YYYY-MM-DD'),
    'evidence', 'A 2024-es irányelv két ponton hozott érdemi változást: bevezette az „emelkedett vérnyomás” kategóriát 120–139/70–89 között, és a kezelt beteg célértékét 120–129/70–79 Hgmm-re szigorította. A magas vérnyomás határa változatlanul 140/90.'
  )
where slug = 'hypertonia';

-- ══ Ellenőrzés ═══════════════════════════════════════════
select title, source_year as ev, array_to_string(specialty, ', ') as szakterulet
from public.guidelines
where external_id like 'esc:%'
order by source_year desc;

select slug, name, body ->> 'version' as forras_ev, body ->> 'source_name' as forras
from public.diseases
where slug = 'hypertonia';
