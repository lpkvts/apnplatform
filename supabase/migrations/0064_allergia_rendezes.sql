-- APN-MED — Az allergológiai szakterület rendezése.
--
-- A tizenhárom adatlapból hét téma van: hat csonk ugyanazokat a kórképeket fedi,
-- mint a kidolgozottak. A csonkok korábban, aláhúzásos azonosítóval kerültek be.
--
-- Öt csonk egyértelműen összevonható. Az angioödéma viszont nem: az tágabb fogalom,
-- mint a herediter forma, ezért önálló adatlapot kap — a klinikai kérdés éppen az
-- elkülönítés, mert a hisztamin- és a bradikinin-eredetű forma kezelése gyökeresen
-- eltér, és a tévesztés életveszélyes lehet.
--
-- Előfeltétel: a 0060 és a 0063 lefutott.

-- ══ 1. Az angioödéma kidolgozása ═════════════════════════
insert into public.diseases
  (slug, name, aliases, abbrev, specialty, score_ids, lab_ids, ekg_ids,
   guideline_kw, body, status, version, is_stub)
values
  ('angiooedema', 'Angioödéma — a formák elkülönítése', '{"angioödéma","Quincke-ödéma","mélyhámi duzzanat"}', 'Angioödéma', 'Allergológia és klinikai immunológia', '{"news2","avpu"}', '{"eos"}', '{}', '{"angioödéma","duzzanat","bradikinin"}', '{"brief_what": "A bőr és a nyálkahártya mélyebb rétegeinek körülírt duzzanata. Két, egymástól gyökeresen eltérő mechanizmus okozhatja: hisztamin vagy bradikinin.", "brief_why": "Az elkülönítés életmentő lehet. A hisztamin-eredetű forma adrenalinra, antihisztaminra és szteroidra reagál; a bradikinin-eredetű ezekre nem, és ha annak kezelik, a légút záródhat, miközben a beteg hatástalan szereket kap.", "when": ["Körülírt, nem viszkető duzzanat: ajak, szemhéj, nyelv, gége, végtag, nemi szervek", "Görcsös hasi fájdalom duzzanat nélkül — bradikinin-eredetű forma bélfali duzzanattal", "Hangváltozás, rekedtség, nyelési nehézség — fenyegető légúti érintettség", "Ismételt epizódok, különösen ha családi halmozódás áll fenn"], "examine": ["Légút mindenekelőtt: hangváltozás, rekedtség, stridor, nyelvduzzanat, nyáladzás", "Csalánkiütés keresése — jelenléte hisztamin-eredet mellett szól, hiánya bradikinin-eredet felé terel", "Viszketés: a hisztamin-eredetű forma viszket, a bradikinin-eredetű jellemzően nem", "A duzzanat kialakulásának üteme: percek (hisztamin) vagy órák (bradikinin)", "Gyógyszerlista: ACE-gátló, angiotenzin-receptor-blokkoló, gliptin, gyulladáscsökkentő", "Családi kórelőzmény és a korábbi epizódok lefolyása"], "labs": "Az akut ellátásban a kórisme klinikai. Az elkülönítéshez a C4-komplement, a C1-inhibitor mennyisége és működése szükséges — ezek eredménye nem várható meg az ellátás előtt. A triptáz anafilaxia gyanújánál segít utólag.", "ekg": "Nem a diagnózis eszköze; anafilaxiás reakciónál a monitorozás része.", "imaging": "Hasi rohamnál a képalkotás bélfalduzzanatot mutathat, ami elkerülhetővé teszi a fölösleges műtétet.", "scores": "NEWS2 az állapotromlás követésére, AVPU a tudatállapotra. Elkülönítő pontozó nincs: a kórelőzmény és a kezelésre adott válasz dönt.", "red_flags": ["Hangváltozás, rekedtség, nyelési nehézség, nyáladzás — a légút biztosítása korán mérlegelendő", "Nyelv- vagy garatduzzanat", "Adrenalinra, antihisztaminra és szteroidra nem reagáló duzzanat — ez maga is diagnosztikus jel a bradikinin-eredet irányába", "ACE-gátlót szedő beteg arcduzzanata — akár évekkel a kezelés kezdete után is jelentkezhet", "Erős hasi fájdalom hányással, duzzanat nélkül", "Vérnyomásesés, légúti tünet — anafilaxia, azonnali ellátás"], "apn_focus": ["A légút folyamatos figyelése minden angioödémás betegnél — ez az első és legfontosabb feladat", "A két forma elkülönítésének segítése: van-e csalánkiütés, viszket-e, milyen gyorsan alakult ki, mit szed a beteg", "A gyógyszerlista célzott átnézése ACE-gátlóra és rokon szerekre", "Ismert bradikinin-eredetű betegnél a saját gyógyszer azonnali elérése — a legtöbben maguknál hordják", "A kezelésre adott válasz megfigyelése és jelzése: a hatástalanság önmagában információ", "Az anafilaxia felismerése, ha keringési vagy légzési érintettség társul", "A dokumentációban jól láthatóan rögzíteni, ha a szokásos kezelés hatástalan volt"], "treatment": ["Hisztamin-eredetű forma: az anafilaxia ellátása szerint — izomba adott adrenalin a súlyos esetben, antihisztamin és szteroid kiegészítésként", "Bradikinin-eredetű forma: célzott szer — C1-inhibitor koncentrátum vagy bradikinin-receptor gátló; az adrenalin, az antihisztamin és a szteroid hatástalan", "ACE-gátló okozta forma: a szer azonnali és végleges elhagyása, tüneti ellátás; a rokon szerek is kerülendők", "Bizonytalan esetben az anafilaxia szerinti ellátás megkezdése indokolt, de a hatástalanság esetén gyorsan mérlegelendő a bradikinin-eredet", "Progresszív felső légúti duzzanatnál a légútbiztosítás korai mérlegelése"], "followup": ["A kiváltó tisztázása: gyógyszer, étel, rovarcsípés, vagy örökletes forma", "Komplement-vizsgálat, ha a bradikinin-eredet felmerül", "Az érintett gyógyszer rögzítése a dokumentációban, jól láthatóan", "Ismételt epizódoknál allergológiai vagy immunológiai gondozás", "Írásos vészhelyzeti terv, ha a forma ismert"], "source_name": "WAO/EAACI nemzetközi irányelv a herediter angioödéma kezeléséről, valamint az EAACI urticaria- és angioödéma-ajánlása", "source_url": "https://onlinelibrary.wiley.com/doi/10.1111/all.15214", "version": "2021", "updated": "2026-09-08", "evidence": "A bradikinin-eredetű forma célzott kezelése erős ajánlás. A két forma elkülönítésére nincs gyors laboratóriumi teszt: az akut helyzetben a kórelőzmény, a klinikai kép és a kezelésre adott válasz dönt."}'::jsonb, 'published', '1', false)
on conflict (slug) do update set
  name = excluded.name,
  aliases = excluded.aliases,
  abbrev = excluded.abbrev,
  specialty = excluded.specialty,
  score_ids = excluded.score_ids,
  lab_ids = excluded.lab_ids,
  guideline_kw = excluded.guideline_kw,
  body = excluded.body,
  status = excluded.status,
  is_stub = false;

-- ══ 2. A duplikátumok archiválása ════════════════════════
-- A csonkok nem törlődnek, hanem lejárt állapotba kerülnek: így a rájuk
-- mutató korábbi hivatkozások nem szakadnak meg, de a betegségtárban
-- már nem jelennek meg. A név utal arra, melyik adatlap váltotta fel őket.

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Allergiás rhinitis'
where slug = 'allergias_rhinitis'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'allergias-rhinitis');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Anafilaxia'
where slug = 'anaphylaxia'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'anafilaxia');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Gyógyszerallergia és a téves allergiacímke'
where slug = 'gyogyszerallergias_reakcio'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'gyogyszerallergia');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Krónikus spontán urticaria'
where slug = 'urticaria'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'kronikus-urticaria');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Anafilaxia'
where slug = 'sulyos_allergias_reakcio_felismerese'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'anafilaxia');

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A szakterület tartalma a rendezés után: hét kidolgozott adatlap
-- és öt archivált duplikátum.
select status, count(*) as db, string_agg(slug, ', ' order by slug) as adatlapok
from public.diseases
where specialty = 'Allergológia és klinikai immunológia'
group by status
order by status;
