-- APN-MED — Az ESC 2026-os irányelvei.
--
-- Az ESC 2026 augusztusi kongresszusán három új irányelv jelent meg, és az
-- egyikük érdemben átírja azt, amit a platform a szívelégtelenségről tanít.
--
-- A 0094 verziókezelés miatt ezek a bejegyzések automatikusan felváltják a
-- korábbi kiadásokat: a 2021-es szívelégtelenség-irányelv és a 2023-as
-- kiadások „Korábbi verziók" alá kerülnek, nem tűnnek el.
--
-- A legfontosabb változás, ami minden szívelégtelen beteget érint:
--
--   A közepesen csökkent ejekciós frakciójú forma (41–49%) MEGSZŰNT önálló
--   kategóriaként. Két fenotípus maradt, egyetlen határral: 50% alatt
--   csökkent, 50% felett megtartott. Aki eddig a köztes kategóriába
--   tartozott, most a csökkent csoportba kerül — és ez a kezelést is
--   megváltoztatja, mert rájuk a teljes alapkezelés vonatkozik.

insert into public.guidelines
  (external_id, family, title, specialty, summary, body, status, version,
   source_url, source_year, published_at)
values
  (
    'esc:szivelegtelenseg:2026',
    'esc:szivelegtelenseg',
    'ESC 2026 irányelv a szívelégtelenség kezeléséről',
    '{"Kardiológia"}',
    'A 2021-es irányelvet váltja fel. A közepesen csökkent forma megszűnt, két fenotípus maradt 50%-os határral. Új fogalom az alapkezelés és a kiegészítő kezelés.',
    '{"source_name": "Európai Kardiológiai Társaság (ESC)", "source_url": "https://www.escardio.org/Guidelines", "version": "2026", "updated": "2026-09-15", "evidence": "A közepesen csökkent forma megszüntetésének indoka, hogy kórélettanilag és kezelési válaszban közelebb áll a csökkent formához, mint a megtartotthoz — az elkülönítés eredetileg vizsgálati beválasztási okokból született, nem önálló betegségként.", "sections": [["Két fenotípus egyetlen határral", "A közepesen csökkent ejekciós frakciójú forma (41–49%) megszűnt. Csökkent ejekciós frakciójú szívelégtelenség: 50% alatt. Megtartott: 50% felett. Aki eddig a köztes kategóriába tartozott, most a csökkent csoportba kerül."], ["Miért számít ez a gyakorlatban", "A besorolás nem elméleti kérdés: a csökkent formára a teljes alapkezelés vonatkozik. Az a beteg, akinek 45% az ejekciós frakciója, eddig a köztes csoportban volt bizonytalanabb ajánlásokkal — most egyértelműen a négyes alapkezelés jár neki."], ["Alapkezelés és kiegészítő kezelés", "Új fogalmi rend. Az alapkezelés azokat a szereket foglalja magába, amelyeknek erős ajánlásuk van és bizonyítottan csökkentik a halálozást vagy a betegségterhet. Csökkent formánál négy szercsoport: béta-blokkoló, ACE-gátló vagy annak korszerűbb változata, mineralokortikoid-receptor-antagonista és SGLT2-gátló. Megtartott formánál kettő: mineralokortikoid-receptor-antagonista és SGLT2-gátló — az alapkezelés tehát már nem csak a csökkent formára vonatkozik."], ["A stádiumok bevezetése", "Négy stádium A-tól D-ig: A a kockázati tényezőkkel élő, még tünetmentes beteg; B a szerkezeti eltérés tünetek nélkül; C a tünetes szívelégtelenség; D az előrehaladott forma. A D stádium hangsúlyt kapott: a korai szakellátásba irányítás javítja a kimenetelt."], ["Dekompenzált szívelégtelenség", "Az „akut szívelégtelenség” megnevezés helyébe a „dekompenzált szívelégtelenség” lépett. Ennek oka, hogy a tünetek gyakran napok alatt alakulnak ki, nem hirtelen — az „akut” megnevezés ezt elfedte."], ["APN-szempont", "A vizeletnátrium alapján vezetett vízhajtó-kezelés bekerült a kezdeti napok ajánlásai közé. A besorolás változása miatt a gondozott betegek egy részénél kezelésmódosítás indokolt: aki 41–49% közötti értékkel a köztes csoportban volt, most teljes alapkezelést kap. A dokumentációban érdemes átnézni, kiket érint."]]}'::jsonb,
    'published', '2026',
    'https://www.escardio.org/Guidelines', '2026', now()
  ),
  (
    'esc:cvd-ckd:2026',
    'esc:cvd-ckd',
    'ESC 2026 irányelv a szív- és érrendszeri betegség és a krónikus vesebetegség kapcsolatáról',
    '{"Kardiológia","Nefrológia-urológia"}',
    'Az első önálló ESC-irányelv a témában, az Európai Nefrológiai Társasággal közösen. Minden szívbeteget vesebetegségre kell szűrni.',
    '{"source_name": "Európai Kardiológiai Társaság és Európai Nefrológiai Társaság", "source_url": "https://www.escardio.org/Guidelines", "version": "2026", "updated": "2026-09-15", "evidence": "Az első dedikált irányelv a két szervrendszer kapcsolatáról. A korai felismerés és a késedelem nélküli kezelés a fő hangsúly.", "sections": [["A fő ajánlás", "Minden szív- és érrendszeri betegnél el kell végezni a vesefunkció és a vizelet albumin vizsgálatát. Ez nem alkalmi kiegészítés, hanem a kivizsgálás része."], ["Miért", "A két szervrendszer betegsége együtt jár, és egymást rontja. A vesebetegség korai szakaszban tünetmentes, ezért csak szűréssel deríthető fel — és a felismerés után azonnal kezdhető olyan kezelés, amely mindkét szervet védi."], ["APN-szempont", "A szűrés két értéken alapul: a számított szűrési érték és a vizelet albumin/kreatinin arány. A betegek nagy része nem tudja, hogy ez jár neki, és panasz híján nem kéri. A gyógyszeradagok a vesefunkcióhoz igazítása szintén a gondozás része."]]}'::jsonb,
    'published', '2026',
    'https://www.escardio.org/Guidelines', '2026', now()
  ),
  (
    'esc:kardialis-rehabilitacio:2026',
    'esc:kardialis-rehabilitacio',
    'ESC 2026 irányelv a kardiális rehabilitációról és a fizikai aktivitásról',
    '{"Kardiológia","Prevenció"}',
    'A rehabilitáció és a mozgásterápia szerepe a szív- és érrendszeri betegek ellátásában.',
    '{"source_name": "Európai Kardiológiai Társaság (ESC)", "source_url": "https://www.escardio.org/Guidelines", "version": "2026", "updated": "2026-09-15", "sections": [["Mire vonatkozik", "A szív- és érrendszeri betegek rehabilitációjára és a fizikai aktivitás szerepére a megelőzésben és a kezelésben."], ["APN-szempont", "A rehabilitációs program szervezése és a beteg motiválása ápolói feladat is. A mozgás előírása egyénre szabott kockázatbecslést kíván."]]}'::jsonb,
    'published', '2026',
    'https://www.escardio.org/Guidelines', '2026', now()
  ),
  (
    'nemzetkozi:infarktus-definicio:2026',
    'nemzetkozi:infarktus-definicio',
    'A szívinfarktus ötödik egyetemes meghatározása',
    '{"Kardiológia","Akut állapotok"}',
    'Az ESC, az ACC, az AHA és a World Heart Federation közös dokumentuma. A negyedik meghatározást váltja fel.',
    '{"source_name": "ESC, ACC, AHA és World Heart Federation", "source_url": "https://www.escardio.org/Guidelines", "version": "2026", "updated": "2026-09-15", "sections": [["Mire vonatkozik", "A szívinfarktus kórisméjének egységes meghatározására — arra, hogy mikor nevezünk egy eseményt infarktusnak, és hogyan különítjük el a szívizom-károsodás egyéb formáitól."], ["Miért fontos", "A meghatározás nem elméleti kérdés: ezen múlik a betegút, a kezelés és a betegség nyilvántartása. A troponin-emelkedés önmagában nem infarktus — a klinikai kép és a kórélettani ok együtt dönt."], ["APN-szempont", "A megemelkedett troponin értelmezése a klinikai képpel együtt történik. A szívizom-károsodás és az infarktus elkülönítése a további ellátást határozza meg."]]}'::jsonb,
    'published', '2026',
    'https://www.escardio.org/Guidelines', '2026', now()
  )
on conflict (external_id) do update set
  family = excluded.family,
  title = excluded.title,
  specialty = excluded.specialty,
  summary = excluded.summary,
  body = excluded.body,
  status = excluded.status,
  version = excluded.version,
  source_url = excluded.source_url,
  source_year = excluded.source_year,
  updated_at = now();

-- ══ A korábbi ESC-kiadások családba sorolása ═════════════
-- A verziókezelés így ismeri fel, hogy ugyanannak az irányelvnek a korábbi
-- kiadásáról van szó, és a „Korábbi verziók" alá helyezi.
-- Csak a nem kórképből származó források kerülhetnek ide: a kórképforrás
-- családja mindig a saját kórképe.
update public.guidelines
set family = 'esc:szivelegtelenseg'
where from_disease_slug is null
  and family is distinct from 'esc:szivelegtelenseg'
  and title ilike '%ESC%'
  and (title ilike '%szívelégtelenség%' or title ilike '%heart failure%');

-- ══ A szívelégtelenség kórkép frissítése ═════════════════
-- A besorolás változása minden szívelégtelen beteget érint, ezért nem elég
-- a forrásmegjelölést átírni: a tartalomba is bekerül a két fenotípus.
update public.diseases
set body = body
  || jsonb_build_object(
    'source_name', 'ESC 2026 irányelv a szívelégtelenség kezeléséről',
    'source_url', 'https://www.escardio.org/Guidelines',
    'version', '2026',
    'updated', to_char(current_date, 'YYYY-MM-DD'),
    'evidence',
      'A 2026-os irányelv megszüntette a közepesen csökkent ejekciós frakciójú '
      || 'formát (41–49%). Két fenotípus maradt, egyetlen határral: 50% alatt '
      || 'csökkent, 50% felett megtartott. Aki eddig a köztes kategóriába '
      || 'tartozott, most a csökkent csoportba kerül, és rá a teljes alapkezelés '
      || 'vonatkozik. Az „akut szívelégtelenség” megnevezés helyébe a '
      || '„dekompenzált szívelégtelenség” lépett.'
  )
where slug = 'szivelegtelenseg';

-- ══ A vesekórképek kiegészítése a szív-vese kapcsolattal ═
update public.diseases
set body = jsonb_set(
  body,
  '{apn_focus}',
  coalesce(body -> 'apn_focus', '[]'::jsonb)
    || to_jsonb(array[
      'A 2026-os szív-vese irányelv szerint minden szív- és érrendszeri '
      || 'betegnél el kell végezni a vesefunkció és a vizelet albumin '
      || 'vizsgálatát — a vesebetegség korai szakaszban tünetmentes'
    ])
)
where slug in ('ckd', 'diabeteszes-vesebetegseg')
  and not (coalesce(body ->> 'apn_focus', '') ilike '%2026-os szív-vese%');

-- ══ A családok újrarendezése ═════════════════════════════
-- A 0094 eseménykezelője a beszúráskor lefut, de a családba sorolás utólag
-- történt, ezért az érintett családokat újrarendezzük.
do $$
declare
  r record;
begin
  for r in select distinct family from public.guidelines where family is not null loop
    perform public.rank_guideline_family(r.family);
  end loop;
end;
$$;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A szívelégtelenség-család kiadásai: a 2026-osnak kell hatályosnak lennie.
select title, source_year as ev, status,
  case when superseded_by is not null then 'felváltva' else 'hatályos' end as allapot
from public.guidelines
where family = 'esc:szivelegtelenseg'
order by source_year desc nulls last;

-- Az összes 2026-os forrás.
select title, array_to_string(specialty, ', ') as szakterulet
from public.guidelines
where source_year = '2026' and status = 'published'
order by title;
