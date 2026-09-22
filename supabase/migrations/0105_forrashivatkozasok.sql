-- APN-MED — A hiányzó forráshivatkozások pótlása.
--
-- Tíz korai adatlapon szerepelt forrásnév, de nem tartozott hozzá hivatkozás.
-- Ez két dolgot okozott:
--
--   · a 0082 óta működő átvezetés hivatkozás nélkül vitte át a forrást a
--     Tudástárba, így az „eredeti forrás" gomb sehová nem vezetett;
--
--   · a verziómező mindegyiknél „MVP 2026" volt — ez a platform belső
--     jelölése, a Tudástárban viszont úgy látszott, mintha 2026-os kiadású
--     irányelvről lenne szó. Ez félrevezető, mert a hivatkozott irányelvek
--     egy része régebbi.
--
-- A migráció mindegyikhez a jelenleg hatályos kiadást rendeli, tényleges
-- hivatkozással és valódi évszámmal. Ahol az irányelv időközben frissült, az
-- új kiadás kerül be; a 0094 verziókezelése a korábbi bejegyzést ilyenkor
-- „korábbi verzió" alá sorolja.
--
-- ══ Amit NEM ír felül ════════════════════════════════════
-- A frissítés jsonb-összefűzés: csak a felsorolt kulcsokat cseréli, az adatlap
-- minden más mezője érintetlen marad. A feltétel emellett az üres source_url,
-- ezért ha valaki időközben megadta a hivatkozást, azt a migráció nem bántja,
-- és az ismételt futtatás sem okoz változást.

-- ── COPD ──
update public.diseases set
  body = body || '{"source_name":"GOLD 2026 jelentés a krónikus obstruktív tüdőbetegség kezeléséről","source_url":"https://goldcopd.org/2026-gold-report-and-pocket-guide/","version":"2026","updated":"2026-09-22","evidence":"A GOLD-jelentés évente frissül. A besorolás a tünetterhelés és a fellángolás-kockázat együttesén alapul, a kezelés pedig ehhez igazodik. A hazai tüdőgyógyászati irányelv az Egészségügyi Szakmai Kollégium jegyzékében érhető el."}'::jsonb
where slug = 'copd'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Asthma bronchiale ──
update public.diseases set
  body = body || '{"source_name":"GINA 2026 stratégiai jelentés az asztma kezeléséről és megelőzéséről","source_url":"https://ginasthma.org/2026-gina-strategy-report/","version":"2026","updated":"2026-09-22","evidence":"A GINA-jelentés évente frissül. A legfontosabb elvi változás, hogy a rohamoldó önmagában — gyulladáscsökkentő nélkül — felnőttnél és serdülőnél már nem ajánlott kezelés."}'::jsonb
where slug = 'asthma'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Hypertonia ──
update public.diseases set
  body = body || '{"source_name":"ESC 2024 irányelv az emelkedett vérnyomás és a hypertonia kezeléséről","source_url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/elevated-blood-pressure-and-hypertension/","version":"2024","updated":"2026-09-22","evidence":"Az irányelv bevezette az „emelkedett vérnyomás\" köztes kategóriát, és a mérés körülményeire — nyugalmi helyzet, megfelelő mandzsetta, ismételt mérés — külön hangsúlyt fektet. Ez ápolói feladat, és a besorolás ezen múlik."}'::jsonb
where slug = 'hypertonia'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Diabetes mellitus 2-es típus ──
update public.diseases set
  body = body || '{"source_name":"ADA Standards of Care in Diabetes — 2026","source_url":"https://professional.diabetes.org/standards-of-care","version":"2026","updated":"2026-09-22","evidence":"Az ajánlás évente frissül. A kezelés választását a kísérő szív-, vese- és anyagcsere-betegség határozza meg, nem önmagában a vércukorszint. A hazai diabetológiai irányelv az Egészségügyi Szakmai Kollégium jegyzékében érhető el."}'::jsonb
where slug = 'dm2'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Pitvarfibrilláció ──
update public.diseases set
  body = body || '{"source_name":"ESC 2024 irányelv a pitvarfibrilláció kezeléséről","source_url":"https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/atrial-fibrillation/","version":"2024","updated":"2026-09-22","evidence":"Az irányelv a beteg bevonására épülő ellátási utat helyezi előtérbe, és a kísérő betegségek — magas vérnyomás, elhízás, alvási légzészavar — kezelését a ritmuskezeléssel egyenrangú elemként kezeli."}'::jsonb
where slug = 'pitvarfibrillacio'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Stroke / TIA ──
update public.diseases set
  body = body || '{"source_name":"Európai Stroke Szervezet (ESO) irányelvtára","source_url":"https://eso-stroke.org/guidelines/eso-guideline-directory/","version":"2025","updated":"2026-09-22","evidence":"Az ESO nem egyetlen összefoglaló irányelvet ad ki, hanem témánként külön dokumentumokat; ezért a jegyzékre hivatkozunk. A vérnyomáskezelésről szóló rész 2025-ben frissült. A hazai neurológiai irányelv az Egészségügyi Szakmai Kollégium jegyzékében érhető el."}'::jsonb
where slug = 'stroke'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Pneumonia ──
update public.diseases set
  body = body || '{"source_name":"ERS/ESICM/ESCMID/ALAT irányelv a súlyos, közösségben szerzett tüdőgyulladás ellátásáról","source_url":"https://publications.ersnet.org/content/erj/61/4/2200735","version":"2023","updated":"2026-09-22","evidence":"Az európai irányelv a súlyos formára összpontosít. Az Amerikai Tüdőgyógyász Társaság 2025-ben adott ki új, a teljes kórképet lefedő ajánlást, amelynek egyes pontjai vitatottak. A súlyosság megítélésére a CURB-65 marad a legelterjedtebb eszköz."}'::jsonb
where slug = 'pneumonia'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Sepsis ──
update public.diseases set
  body = body || '{"source_name":"Surviving Sepsis Campaign nemzetközi irányelv a szepszis és a szeptikus sokk ellátásáról","source_url":"https://www.sccm.org/clinical-resources/guidelines/guidelines/surviving-sepsis-campaign-international-guidelines-for-management-of-sepsis-and-septic-shock-2026","version":"2026","updated":"2026-09-22","evidence":"A 2026-os kiadás 129 állítást tartalmaz, ebből 46 új. A szűrésnél a korai figyelmeztető pontozó — NEWS2, MEWS — váltotta a qSOFA-t. Az antibiotikum szeptikus sokknál azonnal, lehetőleg egy órán belül adandó; sokk nélküli, valószínű szepszisnél három órán belül. A noradrenalin perifériás vénán is indítható, nem kell megvárni a centrális kanült.","scores":"A 2026-os irányelv a szűrésre a NEWS2-t vagy hasonló korai figyelmeztető pontozót ajánlja, a qSOFA önmagában NEM elegendő szűrőeszköz. A SOFA a szervi működészavar megítélésére szolgál, nem szűrésre."}'::jsonb
where slug = 'sepsis'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Diabéteszes láb ──
update public.diseases set
  body = body || '{"source_name":"IWGDF irányelv a diabéteszes lábbetegség megelőzéséről és kezeléséről","source_url":"https://iwgdfguidelines.org/guidelines-2023/","version":"2023","updated":"2026-09-22","evidence":"Az IWGDF négyévente frissít. A megelőzés — rendszeres lábvizsgálat, a kockázat szerinti besorolás és a megfelelő lábbeli — bizonyítottan csökkenti a fekély és az amputáció gyakoriságát; ez nagyrészt ápolói feladat."}'::jsonb
where slug = 'diabeteses_lab'
  and coalesce(body ->> 'source_url', '') = '';

-- ── Dementia / delirium ──
update public.diseases set
  body = body || '{"source_name":"NICE irányelvek a deliriumról (CG103) és a demenciáról (NG97)","source_url":"https://www.nice.org.uk/guidance/cg103","version":"2023","updated":"2026-09-22","evidence":"A delirium megelőzése többelemű, nem gyógyszeres beavatkozással a leghatékonyabb: tájékozódás segítése, alvásrend, mozgatás, szemüveg és hallókészülék biztosítása, kiszáradás és székrekedés kezelése. A hazai geriátriai ajánlás az Egészségügyi Szakmai Kollégium jegyzékében érhető el."}'::jsonb
where slug = 'dementia_delirium'
  and coalesce(body ->> 'source_url', '') = '';

-- ══ A szepszis pontozó-mezője ════════════════════════════
-- A 2026-os Surviving Sepsis Campaign irányelv a szűrésre a NEWS2-t vagy
-- hasonló korai figyelmeztető pontozót ajánlja, és kimondja, hogy a qSOFA
-- önmagában nem elegendő szűrőeszköz. A régi szöveg a kettőt egyenrangúként
-- említette, ezért a fenti frissítés a scores mezőt is cseréli.

-- ══ A források átvezetése ════════════════════════════════
do $$
declare s text;
begin
  for s in select unnest(array['copd', 'asthma', 'hypertonia', 'dm2', 'pitvarfibrillacio', 'stroke', 'pneumonia', 'sepsis', 'diabeteses_lab', 'dementia_delirium']) loop
    begin
      perform public.sync_disease_source(s);
    exception when others then
      raise notice 'forrás-átvezetés kihagyva: %', s;
    end;
  end loop;
end $$;

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- 1) A tíz adatlap forrása a pótlás után.
select
  slug, name,
  body ->> 'source_name' as forras,
  body ->> 'version'     as ev,
  case when coalesce(body ->> 'source_url', '') = '' then '✗ hiányzik' else '✓ van' end as hivatkozas
from public.diseases
where slug in ('copd', 'asthma', 'hypertonia', 'dm2', 'pitvarfibrillacio', 'stroke', 'pneumonia', 'sepsis', 'diabeteses_lab', 'dementia_delirium')
order by name;

-- 2) Maradt-e bárhol forrásnév hivatkozás nélkül.
select slug, name, body ->> 'source_name' as forras
from public.diseases
where status = 'published'
  and coalesce(body ->> 'source_name', '') <> ''
  and coalesce(body ->> 'source_url', '') = ''
order by name;

-- 3) A „MVP 2026" jelölés eltűnt-e a verziómezőkből.
select count(*) as mvp_jeloles_maradt
from public.diseases
where body ->> 'version' like 'MVP%';

-- 4) Az érintett bejegyzések az irányelvjegyzékben.
select external_id, title, source_year, source_url, status
from public.guidelines
where from_disease_slug in ('copd', 'asthma', 'hypertonia', 'dm2', 'pitvarfibrillacio', 'stroke', 'pneumonia', 'sepsis', 'diabeteses_lab', 'dementia_delirium')
order by title;
