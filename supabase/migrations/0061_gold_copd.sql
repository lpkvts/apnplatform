-- APN-MED — A GOLD ajánlás beépítése.
--
-- A GOLD (Global Initiative for Chronic Obstructive Lung Disease) a COPD
-- nemzetközi alapdokumentuma, amely évente frissül. A platformon eddig csak a
-- COPD kórkép forrásmezőjében szerepelt, önálló irányelvként nem — pedig a
-- Protokollok és irányelvek között a helye, mert a hazai irányelvek is erre
-- hivatkoznak.
--
-- Két dolgot végez el ez a migráció: felveszi a GOLD-ot az irányelvtárba, és a
-- COPD kórképet a 2026-os kiadáshoz igazítja.

-- ══ A GOLD az irányelvtárban ═════════════════════════════
insert into public.guidelines
  (external_id, title, specialty, summary, body, status, version, published_at)
values (
  'gold-2026',
  'GOLD 2026 — Globális stratégia a COPD kórismézéséhez, kezeléséhez és megelőzéséhez',
  '{"Tüdőgyógyászat","Alapellátás","Sürgősségi ellátás"}',
  'A COPD nemzetközi alapdokumentuma, évente frissülő kiadásban. A 2026-os változat a korai beavatkozásra és a betegség aktivitásának mérséklésére helyezi a hangsúlyt.',
  '{"sections": [["Mit ad hozzá a 2026-os kiadás", "A hangsúly a korai beavatkozáson és a betegség aktivitásának mérséklésén van, nem csupán a tünetek enyhítésén. A besorolás, a gyógyszeres lépcső és a nem gyógyszeres beavatkozások szerepe egyaránt módosult."], ["Besorolás", "Az ABE besorolásban az E csoport küszöbe csökkent: már egyetlen közepes súlyosságú exacerbáció is ide sorolja a beteget, mert megfigyeléses vizsgálatok szerint az is növeli a további események kockázatát."], ["Gyógyszeres kezelés", "A kiindulópont a kettős hörgtágítás — hosszú hatású béta-agonista és muszkarin-antagonista együtt. Az inhalációs szteroid csak erre ráépítve jön szóba, és az adását a vér eozinofilszáma irányítja. A béta-agonista és szteroid kettős kombinációja nem javasolt: ha szteroid szükséges, a hármas kombináció a helyes lépés."], ["Nem gyógyszeres beavatkozások", "A tüdőrehabilitáció, a védőoltások, a dohányzásleszokás, a strukturált önmenedzsment és az exacerbáció utáni gondozás a betegség lefolyását módosító alapstratégiák közé került — nem kiegészítők, hanem a kezelés része."], ["Biológiai terápia", "A dupilumab és a mepolizumab magas szintű bizonyítékkal csökkenti az exacerbációk gyakoriságát válogatott betegeknél. Elérhetőségük országonként eltér."], ["APN-fókusz", "Az inhalációs technika ellenőrzése minden találkozáskor — a hibás használat a terápiás kudarc leggyakoribb, legkönnyebben orvosolható oka. Az exacerbáció korai jeleinek megtanítása a küszöb csökkenése miatt fontosabb, mint valaha. Az oxigén célszaturációja jellemzően 88–92 százalék: a túlzott oxigén szén-dioxid-visszatartáshoz vezethet. Az exacerbáció utáni időszak kiemelt gondozási pont, mert ekkor a legmagasabb az újabb esemény és a halálozás kockázata."]], "refs": ["Global Initiative for Chronic Obstructive Lung Disease — GOLD Report", "GOLD 2026 Key Changes Summary"], "source_name": "Global Initiative for Chronic Obstructive Lung Disease (GOLD)", "source_url": "https://goldcopd.org/", "updated": "2025.11.10", "validity": "ervenyes", "version": "2026", "evidence": "A hörgtágító kezelés és a hármas kombináció hatékonysága magas szintű bizonyítékon alapul. A biológiai terápiák exacerbáció-csökkentő hatása szintén A szintű."}'::jsonb,
  'published', '2026', now()
)
on conflict (external_id) do update set
  title = excluded.title,
  summary = excluded.summary,
  body = excluded.body,
  version = excluded.version,
  status = excluded.status;

-- ══ A COPD kórkép frissítése ═════════════════════════════
-- A meglévő tartalom megmarad; a kezelési lépcső, a besorolás és a forrás
-- igazodik a 2026-os kiadáshoz.
update public.diseases
set body = body || jsonb_build_object(
  'treatment', jsonb_build_array(
    'A kiindulás kettős hörgtágítás: hosszú hatású béta-agonista és muszkarin-antagonista együtt',
    'Inhalációs szteroid csak a kettős hörgtágításra ráépítve, a vér eozinofilszáma alapján; a béta-agonista és szteroid kettős kombinációja nem javasolt',
    'Rövid hatású hörgtágító minden betegnél, tünet szerinti használatra',
    'Tüdőrehabilitáció, védőoltások és dohányzásleszokás — a lefolyást módosító alapbeavatkozások, nem kiegészítők',
    'Hármas kezelés mellett is exacerbáló, válogatott betegnél biológiai terápia mérlegelhető, szakellátásban'
  ),
  'scores', 'A CAT és az mMRC a tünetterhelés mérésére, a NEWS2 az akut súlyosság megítélésére. A GOLD ABE besorolásban az E csoport küszöbe csökkent: már egyetlen közepes súlyosságú exacerbáció is ide sorol.',
  'source_name', 'GOLD 2026 — Globális stratégia a COPD kórismézéséhez, kezeléséhez és megelőzéséhez',
  'source_url', 'https://goldcopd.org/',
  'version', '2026',
  'updated', to_char(current_date, 'YYYY-MM-DD'),
  'evidence', 'A hörgtágító kezelés és a hármas kombináció hatékonysága magas szintű bizonyítékon alapul. A biológiai terápiák exacerbáció-csökkentő hatása szintén A szintű, de elérhetőségük országonként eltér.'
)
where slug = 'copd';

-- Az exacerbáció utáni gondozás felvétele az APN-fókuszba.
update public.diseases
set body = jsonb_set(
  body, '{apn_focus}',
  (body -> 'apn_focus') || '["Az exacerbáció utáni időszak kiemelt gondozási pont: ekkor a legmagasabb az újabb esemény és a halálozás kockázata"]'::jsonb
)
where slug = 'copd'
  and not (body -> 'apn_focus' @> '["Az exacerbáció utáni időszak kiemelt gondozási pont: ekkor a legmagasabb az újabb esemény és a halálozás kockázata"]'::jsonb);

-- Ellenőrzés: az irányelv és a frissített kórkép.
select 'iranyelv' as tipus, title as nev, version
from public.guidelines where external_id = 'gold-2026'
union all
select 'korkep', name, body ->> 'version'
from public.diseases where slug = 'copd';
