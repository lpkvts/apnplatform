-- APN-MED — A bőrgyógyászati blokk csonkjainak rendezése.
--
-- A nyolc „tartalom fejlesztés alatt" jelzésű kórképből hat már ki van dolgozva,
-- csak más azonosítóval — ezek összevonásra kerülnek. Kettő viszont valóban
-- hiányzik, és mindkettő fontos:
--
--   · az allergiás bőrreakciók áttekintő lapja, amely összeköti a meglévő
--     urticaria, angioödéma és kontakt dermatitis adatlapokat;
--
--   · a krónikus seb általános elvei — ez az egész blokk hiányzó alapja. A
--     nyomási, a vénás és a diabéteszes fekély mind krónikus seb, és a gyógyulás
--     akadályai mindegyiknél ugyanazok.
--
-- Előfeltétel: a 0084 és a 0085 lefutott.

-- ══ 1. A két hiányzó kórkép ══════════════════════════════
insert into public.diseases
  (slug, name, aliases, abbrev, specialty, score_ids, lab_ids, ekg_ids,
   guideline_kw, body, status, version, is_stub)
values
  ('kronikus_seb', 'Krónikus seb — általános elvek', '{"nem gyógyuló seb","sebágy-előkészítés","sebkezelés"}', 'Krónikus seb', 'Bőrgyógyászat és sebellátás', '{}', '{"crp","wbc","hba1c","hb"}', '{}', '{"krónikus seb","sebkezelés","sebágy"}', '{"brief_what": "Az a seb, amely a várt idő — jellemzően négy-hat hét — alatt nem mutat érdemi gyógyulást a megfelelő kezelés ellenére. Nem külön kórkép, hanem állapot: a nyomási, a vénás, az artériás és a diabéteszes fekély mind ide tartozik.", "brief_why": "A gyógyulás akadályai mindegyik sebtípusnál ugyanazok, és a kötszer ezek közül egyet sem old meg. Aki csak a sebfedőt cseréli, a tüneteket kezeli — a kezelés a seb mögötti okkal kezdődik.", "when": ["Négy-hat hét alatt nem csökkenő méretű seb", "Ismétlődő fekély ugyanazon a helyen", "Romló seb megfelelő kezelés mellett", "Bűzös, váladékozó, fájdalmas seb"], "examine": ["A seb mérése: hossz, szélesség, mélység — a becslés nem elég, mert a gyógyulás üteme csak mérésből látszik", "A sebalap jellege: elhalt szövet, lepedék, sarjszövet, hámosodás aránya", "A váladék mennyisége, színe és szaga", "A seb széle: alávájt, körülírt, hámosodó vagy megvastagodott", "A környező bőr: bőrpír, keményedés, felpuhulás a túlzott nedvességtől", "Az alapok: keringés, nyomás, cukorbetegség, táplálás — ezek nélkül a sebvizsgálat önmagában keveset mond"], "labs": "Vérkép a vérszegénység kizárására, mert az rontja a szöveti oxigénellátást. Vércukor és HbA1c. Fertőzés gyanújánál CRP. Tenyésztés csak klinikai fertőzésjelek esetén: minden krónikus seb tartalmaz baktériumot, és a pozitív tenyésztés önmagában nem jelent kezelendő fertőzést — ez a leggyakrabban félreértett laboreredmény ezen a területen.", "ekg": "Nincs szerepe.", "imaging": "Érvizsgálat keringési zavar gyanújánál. Csontérintettség gyanújánál képalkotás. Nem gyógyuló seb esetén szövettani mintavétel — a hosszú ideje fennálló seb daganattá alakulhat.", "scores": "A gyógyulás ütemének követése méréssel történik. Négy hét alatt a terület érdemi csökkenése várható; ha ez elmarad, a kezelési tervet kell felülvizsgálni, nem a kötszert cserélni.", "red_flags": ["Terjedő bőrpír, láz, gennyes váladék — fertőzés", "Aránytalanul erős fájdalom — mélyebb fertőzés lehetősége", "Nem gyógyuló seb hónapok óta, megvastagodott, felhányt széllel — daganatos átalakulás, szövettani mintavétel indokolt", "Csontig szondázható seb", "Hirtelen romlás korábban javuló sebnél", "Nem tapintható pulzus a sérült végtagon"], "apn_focus": ["A seb mérése és fényképes dokumentálása: a gyógyulás üteme csak így követhető, és a leírás önmagában nem elég", "A négyhetes szabály: ha négy hét alatt nincs érdemi csökkenés, a kezelési tervet kell újragondolni — nem a kötszert cserélni", "Az alapok ellenőrzése minden sebnél: keringés, nyomás, cukorbetegség, táplálás — a kötszer ezek közül egyiket sem oldja meg", "A seb körüli bőr védelme: a túlzott váladék felpuhítja, és a seb terjed", "A fájdalom mérése és csillapítása kötözés előtt — a fájdalmas kötözés rontja a beteg-együttműködést", "A tenyésztés helyes értelmezése: a pozitív eredmény tünetek nélkül nem jelent kezelendő fertőzést", "A beteg és a hozzátartozó bevonása: a krónikus seb hónapokig tart, és a napi ellátás nagy része otthon történik"], "treatment": ["A seb mögötti ok rendezése — ez az első és legfontosabb lépés", "Sebágy-előkészítés: az elhalt szövet és a lepedék eltávolítása, ha a keringés engedi", "Nedvességegyensúly: a túl száraz és a túl nedves seb egyaránt rosszul gyógyul", "A seb széleinek gondozása", "Fertőzés kezelése, ha klinikai jelei vannak", "Táplálási támogatás: fehérje, energia, nyomelemek", "Fájdalomcsillapítás"], "followup": ["Heti mérés és dokumentálás", "A kezelési terv felülvizsgálata négy hét után, ha nincs javulás", "Szakellátásba irányítás nem gyógyuló seb esetén", "A kiújulás megelőzése: a gyógyult seb helyén az újraképződés kockázata magas"], "source_name": "Európai sebkezelési ajánlások a sebágy-előkészítésről és a krónikus sebek ellátásáról", "source_url": "https://ewma.org/", "version": "2023", "updated": "2026-09-15", "evidence": "A sebágy-előkészítés elveinek hatékonysága jól alátámasztott. A négyhetes felülvizsgálati szabály a nemzetközi ajánlások visszatérő eleme. A krónikus sebek rutinszerű tenyésztése és antibiotikumos kezelése nem javasolt."}'::jsonb, 'published', '1', false),
  ('allergias_borreakciok', 'Allergiás bőrreakciók — áttekintés', '{"bőrallergia","allergiás kiütés","gyógyszerkiütés"}', 'Bőrreakciók', 'Bőrgyógyászat és sebellátás', '{"news2"}', '{"crp","wbc"}', '{}', '{"allergia","bőrreakció","kiütés"}', '{"brief_what": "Gyűjtőfogalom: a bőr immunmechanizmusú reakciói. A formák megjelenésükben hasonlíthatnak, a mechanizmusuk, a lefolyásuk és a kezelésük viszont eltér.", "brief_why": "Az elkülönítés dönti el a teendőt. A csalánkiütés percek alatt jön és megy, a kontakt ekcéma napokig tart, a súlyos gyógyszerreakció pedig életveszélyes — és az utóbbi első jelei megtévesztően enyhék. Az adatlap célja, hogy a felismerés után a megfelelő kórképhez lehessen tovább lépni.", "when": ["Hirtelen megjelenő viszkető kiütés", "Gyógyszerszedés vagy új anyaggal való érintkezés után jelentkező bőrtünet", "Csalánkiütés, duzzanat", "Ismeretlen eredetű, terjedő kiütés"], "examine": ["Az elemi elváltozás jellege: csalánfolt, hólyag, pörk, hámlás — ez irányít a mechanizmus felé", "A viszketés vagy a fájdalom dönti el a súlyosságot: a közönséges reakció viszket, a súlyos fáj", "A nyálkahártyák vizsgálata: száj, szem, nemi szervek — ez emeli ki a súlyos formákat", "Az időbeli lefolyás: percek, órák vagy napok teltek el a kiváltó óta", "Az egyes foltok élettartama: a csalánfolt huszonnégy óránál rövidebb ideig áll fenn egy helyen — ha tovább marad, más kórkép", "Légúti vagy keringési tünetek keresése: ezek anafilaxiát jeleznek"], "labs": "A kórisme klinikai. Súlyos forma gyanújánál vérkép, májenzimek, vesefunkció. Az allergiavizsgálat az akut szakasz után, célzottan.", "ekg": "Anafilaxia esetén a monitorozás része.", "imaging": "Nincs szerepe.", "scores": "A NEWS2 az általános állapot követésére. A formák elkülönítésére pontozó nincs — a klinikai kép és az időbeli lefolyás dönt.", "red_flags": ["Légúti tünet, hangváltozás, vérnyomásesés — anafilaxia, azonnali ellátás", "Nyálkahártya-érintettség — súlyos gyógyszerreakció gyanúja", "Fájdalmas bőr, hámleválás", "Láz a kiütéssel együtt", "Arcduzzanat, nyirokcsomó-megnagyobbodás, szervi eltérés", "Adrenalinra, antihisztaminra nem reagáló duzzanat — bradikinin-eredetű angioödéma"], "apn_focus": ["A súlyos formák kiszűrése három kérdéssel: fáj-e a bőr, érintettek-e a nyálkahártyák, van-e láz — ha bármelyikre igen, sürgős orvosi értékelés", "A gyógyszerszedés kezdetének pontos rögzítése: az időbeli összefüggés a kórisme alapja", "Az egyes foltok élettartamának megfigyelése: a csalánfolt vándorol, a többi kiütés nem — ez egyszerű és megbízható elkülönítő jel", "Anafilaxia jeleinek keresése minden akut bőrreakciónál", "A kiváltó gyanúba vett szer rögzítése a dokumentációban", "A beteg tájékoztatása: mikor kell azonnal segítséget kérni"], "treatment": ["A kezelés a felismert forma szerint történik — az áttekintés célja a helyes irányba terelés", "Csalánkiütés: antihisztamin; a kiváltó kerülése", "Kontakt reakció: a kiváltó kiiktatása, helyi gyulladáscsökkentő", "Anafilaxia: izomba adott adrenalin azonnal", "Súlyos gyógyszerreakció: a kiváltó szer azonnali elhagyása és szakellátás", "Bradikinin-eredetű angioödéma: célzott szer, mert az adrenalin hatástalan"], "followup": ["A kiváltó tisztázása és dokumentálása", "Allergológiai kivizsgálás a forma szerint", "Írásos vészhelyzeti terv, ha anafilaxia zajlott le", "A gyógyszerallergia-címke pontosítása: a bőrkiütés nem minden esetben jelent valódi allergiát"], "source_name": "EAACI ajánlások az urticaria, az angioödéma és a gyógyszer-túlérzékenység ellátásáról", "source_url": "https://www.eaaci.org/guidelines/", "version": "2024", "updated": "2026-09-15", "evidence": "A formák elkülönítése a klinikai képen és az időbeli lefolyáson alapul. A nyálkahártya-érintettség és a fájdalmas bőr a súlyos formák leghasználhatóbb korai jelei."}'::jsonb, 'published', '1', false)
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
-- mutató korábbi hivatkozások nem szakadnak meg, de a betegségtárban már
-- nem jelennek meg. A név utal arra, melyik adatlap váltotta fel őket.

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Artériás lábszárfekély'
where slug = 'arterias_fekely'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'arterias-labszarfekely');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Nyomási fekély (decubitus)'
where slug = 'decubitus'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'nyomasi-fekely');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Diabéteszes láb'
where slug = 'diabetikus_labfekely'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'diabeteses-lab');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Súlyos gyógyszer okozta bőrreakció'
where slug = 'gyogyszer_okozta_borreakciok'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'sulyos-borreakcio');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Övsömör (herpes zoster)'
where slug = 'herpes_zoster'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'ovsomor');

update public.diseases set
  status = 'expired',
  name = name || ' — felváltotta: Vénás lábszárfekély'
where slug = 'venas_labszarfekely'
  and status <> 'expired'
  and exists (select 1 from public.diseases d2 where d2.slug = 'venas-labszarfekely');

-- ══ Ellenőrzés ═══════════════════════════════════════════
-- A blokk állapota a rendezés után: nem maradhat „fejlesztés alatt" jelzés.
select status, count(*) filter (where is_stub) as fejlesztes_alatt,
  count(*) filter (where not is_stub) as kidolgozott,
  count(*) as osszes
from public.diseases
where specialty = 'Bőrgyógyászat és sebellátás'
group by status
order by status;

-- A megmaradt kórképek tételesen.
select slug, name, body ->> 'version' as forras_ev
from public.diseases
where specialty = 'Bőrgyógyászat és sebellátás' and status = 'published'
order by name;
