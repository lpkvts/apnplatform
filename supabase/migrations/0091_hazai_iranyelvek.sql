-- APN-MED — Hazai szakmai irányelvek felvétele az irányelvtárba.
--
-- A platform forráspolitikája szerint elsődlegesen hazai szakmai irányelvre
-- hivatkozunk, és csak annak hiányában nemzetközire. Az irányelvtárban eddig
-- viszont túlsúlyban voltak a nemzetközi források.
--
-- Ez a migráció felveszi azokat a hazai irányelveket, amelyekre a platform
-- tartalma ténylegesen támaszkodik. Mindegyik az Egészségügyi Szakmai
-- Kollégium kiadványa, és a teljes jegyzék a kollegium.okfo.gov.hu címen
-- érhető el — ezt adjuk meg forráshivatkozásként, mert az egyes dokumentumok
-- közvetlen hivatkozásai időről időre változnak.
--
-- Ami fontos: az irányelvek érvényessége lejár, és a felülvizsgálat évekig
-- elhúzódhat. A lejárt irányelv nem automatikusan érvénytelen szakmailag, de
-- a felhasználónak tudnia kell róla — ezért a megjelenés éve minden
-- bejegyzésnél szerepel.

insert into public.guidelines
  (external_id, title, specialty, summary, body, status, version,
   source_url, source_year, published_at)
values
  (
    'hazai:surgossegi-betegellatas',
    'Egészségügyi szakmai irányelv a sürgősségi betegellátásról',
    '{"Akut állapotok","Sürgősségi ellátás"}',
    'A sürgősségi ellátás szervezési és szakmai követelményei: triázs, ellátási szintek, tárgyi és személyi feltételek.',
    '{"source_name": "Egészségügyi Szakmai Kollégium — Sürgősségi Orvostan Tagozat", "source_url": "https://kollegium.okfo.gov.hu/Iranyelvek/Index", "sections": [["Mire vonatkozik", "Az alapellátási ügyeletre, a járóbeteg-szakellátásra, a mentésre, a sürgősségi fogadóhelyekre és a sürgősségi betegellátó osztályokra."], ["APN-szempont", "A triázs kompetenciahatárait és a sürgősségi ellátás tárgyi feltételeit rögzíti — ezek az ápolói munka kereteit is meghatározzák."]]}'::jsonb,
    'published', null,
    'https://kollegium.okfo.gov.hu/Iranyelvek/Index', null, now()
  ),
  (
    'hazai:perioperativ-fajdalomcsillapitas',
    'Egészségügyi szakmai irányelv a perioperatív fájdalomcsillapításról az egynapos sebészetben',
    '{"Akut állapotok","Fájdalomcsillapítás"}',
    'A műtét körüli fájdalomcsillapítás felmérése, dokumentálása és lépcsőzetes kezelése. Azonosító: 002047.',
    '{"source_name": "Egészségügyi Szakmai Kollégium — Aneszteziológia és Intenzív Terápia Tagozat", "source_url": "https://kollegium.okfo.gov.hu/Iranyelvek/Index", "version": "002047", "sections": [["Mire vonatkozik", "Az egynapos sebészeti ellátás fájdalomcsillapítására, de a felmérés, a dokumentálás és a lépcsőzetes kezelés elvei általánosan érvényesek."], ["APN-szempont", "Az irányelv kimondja, hogy a fájdalom észlelésére és kezelésére vonatkozó adatokat dokumentálni kell — ez ápolói feladat, és a kezelés hatásának követése ezen múlik."]]}'::jsonb,
    'published', '002047',
    'https://kollegium.okfo.gov.hu/Iranyelvek/Index', '2020', now()
  ),
  (
    'hazai:opioid-hasznalati-zavar',
    'Egészségügyi szakmai irányelv az opioid használati zavarról és kezeléséről',
    '{"Fájdalomcsillapítás","Addiktológia"}',
    'Az opioidhasználat zavarainak felismerése és kezelése, valamint az opioidmérgezés sürgősségi ellátása. Azonosító: 002289.',
    '{"source_name": "Belügyminisztérium — Egészségügyi Szakmai Kollégium", "source_url": "https://kollegium.okfo.gov.hu/Iranyelvek/Index", "version": "002289", "sections": [["Mire vonatkozik", "Az ártalmas opioidhasználat felismerésére, a függőség kezelésére és az opioidmérgezés sürgősségi ellátására."], ["APN-szempont", "Az opioidmérgezés felismerése és az ellátás algoritmusa ápolói szempontból is használható: a szűk pupilla, a lassú légzés és az aluszékonyság együttese a kulcs."]]}'::jsonb,
    'published', '002289',
    'https://kollegium.okfo.gov.hu/Iranyelvek/Index', '2024', now()
  ),
  (
    'hazai:akut-koronaria-szindroma',
    'Egészségügyi szakmai irányelv az akut koronária szindrómáról',
    '{"Kardiológia","Akut állapotok"}',
    'Az akut koronária szindróma felismerése, betegútja és kezelése. Megjelent az Egészségügyi Közlöny 2025. évi 20. számában.',
    '{"source_name": "Egészségügyi Szakmai Kollégium — Kardiológia Tagozat", "source_url": "https://kollegium.okfo.gov.hu/Iranyelvek/Index", "version": "2025", "sections": [["Mire vonatkozik", "Az akut koronária szindróma teljes ellátási láncára, a mentőhívástól a beavatkozásig."], ["APN-szempont", "Az irányelv kiemeli a betegutak rövidítését: heveny mellkasi fájdalomnál a mentőhívás előnyben részesítendő a háziorvosi vagy ügyeleti megkeresés helyett."]]}'::jsonb,
    'published', '2025',
    'https://kollegium.okfo.gov.hu/Iranyelvek/Index', '2025', now()
  ),
  (
    'hazai:iranyelvtar',
    'Egészségügyi Szakmai Kollégium — irányelvjegyzék',
    '{"Általános"}',
    'A hatályos hazai egészségügyi szakmai irányelvek teljes, kereshető jegyzéke.',
    '{"source_name": "Egészségügyi Szakmai Kollégium", "source_url": "https://kollegium.okfo.gov.hu/Iranyelvek/Index", "sections": [["Mire való", "A hazai irányelvek hivatalos jegyzéke, tagozatonként és azonosító szerint kereshetően."], ["Mire érdemes figyelni", "Az irányelvek érvényessége lejár, és a felülvizsgálat évekig elhúzódhat. A lejárt irányelv nem automatikusan érvénytelen szakmailag, de érdemes megnézni, van-e frissebb nemzetközi ajánlás."]]}'::jsonb,
    'published', null,
    'https://kollegium.okfo.gov.hu/Iranyelvek/Index', null, now()
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

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A hazai és a nemzetközi források aránya az irányelvtárban.
select
  case
    when external_id like 'hazai:%'  then 'hazai irányelv'
    when external_id like 'korkep:%' then 'kórképből átvezetve'
    else 'egyéb'
  end                                        as tipus,
  count(*)                                   as darab
from public.guidelines
where status = 'published'
group by 1
order by 2 desc;

-- A felvett hazai irányelvek.
select title, source_year as ev, array_to_string(specialty, ', ') as szakterulet
from public.guidelines
where external_id like 'hazai:%'
order by title;
