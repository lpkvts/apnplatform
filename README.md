# APN Hungary Platform

Mobil-first klinikai szakmai munkakörnyezet Advanced Practice Nurse (APN) szakembereknek.
Cél: **egy összekapcsolt, gyors, intuitív** felület, amely a napi klinikai munkát, a szakmai tájékozódást és a fejlődést egyben támogatja.

> **Fontos elv:** a platform **nem ad orvosi diagnózist**. Minden funkció döntéstámogató, oktatási és dokumentációs célú; a klinikai megítélést nem helyettesíti.

*Utoljára frissítve: a Betegvizsgálat 2.0 (1–6. fázis) és a V2 UX-audit (Phase 1–7 + 9) állapotában. Ezt a fájlt minden fejlesztésnél frissítjük.*

---

## Tartalom
1. [Információs architektúra](#információs-architektúra)
2. [Mit lehet csinálni – funkciók](#mit-lehet-csinálni--funkciók)
3. [Admin / Tartalomkezelés](#admin--tartalomkezelés)
4. [Jogosultságok](#jogosultságok)
5. [Kapcsolható modulok (feature flag-ek)](#kapcsolható-modulok-feature-flagek)
6. [Technológia](#technológia)
7. [Adatmodell és migrációk](#adatmodell-és-migrációk)
8. [Telepítés és élesítés](#telepítés-és-élesítés)
9. [Fejlesztési elvek](#fejlesztési-elvek)
10. [Fejlesztési státusz és roadmap](#fejlesztési-státusz-és-roadmap)
11. [Változásnapló](#változásnapló)

---

## Információs architektúra

A navigáció egyetlen, tiszta mentális modellre épül:

**🩺 Klinikum → 📚 Tudástár → 🎓 Fejlődés → 👤 Profil**

- **Alsó menü (mobil + desktop):** Kezdőlap · Klinikum · Tudástár · Fejlődés
- **Felső sáv (jobb felül):** értesítések + Profil (avatar) — minden oldalon elérhető

A kikapcsolt vagy rejtett modulok automatikusan eltűnnek a navigációból, a kezdőlapról, a gyorselérésből és a keresésből.

---

## Mit lehet csinálni – funkciók

### 🏠 Kezdőlap (munkaasztal)
- **Fő művelet:** „Új betegvizsgálat indítása" kiemelt gomb
- **Folytasd, ahol abbahagytad:** a folyamatban lévő betegvizsgálat és nyitott klinikai eset gyors folytatása
- **Gyors elérés:** testreszabható gyorsindító csempék — a felhasználó a Testreszabás oldalon (vagy a „＋ Hozzáadás” csempével) veszi fel a leggyakrabban használt menüket
- **Legutóbbi tevékenységek** és **központi keresés**

### 🩺 Klinikum
- **Betegvizsgálat 2.0** – strukturált propedeutikai vizsgálat, klinikai és oktatási módban:
  - Anamnézis (vezető panasz, OPQRST, korábbi betegségek, gyógyszerlista, allergia, szociális/családi)
  - Vitális paraméterek (10 érték + BMI, ismételt mérés, **trend**, 🟢🟡🔴 zónák)
  - Általános fizikális vizsgálat (állapot, tudat/AVPU, bőr, hydratatio, oedema)
  - Szervrendszeri vizsgálatok (légző · cardiovascularis · neurológiai + FAST · hasi) IPPA/IAPP-logikával
  - **Red flag jelzések** egy helyen, kapcsolódó akut/protokoll/mentor linkekkel
  - **Klinikai összegzés** – automatikus, szerkeszthető, másolható státusz + kapcsolódó Labor/EKG/Betegségtár
- **Új betegértékelés** – gyors, 12 lépéses klinikai értékelés
- **Eseteim és előzmények** – klinikai esetek és korábbi betegértékelések egy listában (típus- és státuszszűrővel)
- **Score Hub** – 56 klinikai skála és pontozó, kategóriákkal, kedvencezéssel
- **Labor** – laborértékek referenciával és klinikai értelmezéssel; **nem-specifikus (férfi/nő) referenciák** külön értékeléssel
- **EKG** – atlasz és gyakorlás (a vizsga mód admin-kapcsolóval)
- **APN Copilot** – döntéstámogató (admin-kapcsolóval; AI-integráció előkészítve)

### 📚 Tudástár
- **Betegségtár** – kórképek strukturált, APN-fókuszú adatlapjai (evidence-badge-ekkel, DDx-szel, red flag-ekkel)
- **Panasz alapján** – tünetből a lehetséges kórképek felé
- **Akut állapotok** – gyors klinikai orientáció, vörös zászlók
- **Protokollok és irányelvek** – evidence-alapú összefoglalók, források
- **Klinikai kontextus** – összekapcsolt témák és modulok

### 🎓 Fejlődés
- **Mentorprogram** (hamarosan)
- **Kompetenciák** (admin-kapcsolóval)
- **CPD** – továbbképzés követése
- **APN Career** (admin-kapcsolóval) – állások, képzések, konferenciák, pályázatok

### 👤 Profil
- Szakmai adatok, **APN szakirány** (6, itthon elérhető szakirány)
- **Kedvenceim** – csillagozott betegségek, laborok, score-ok, EKG-k
- **Előzmények**, profil szerkesztése, kijelentkezés
- **Értesítések** (felső sávban is)

### ⭐ Kedvencek és személyre szabás
- Bárhol a **☆ csillaggal** kedvencnek jelölhető betegség, labor, score, EKG
- **Kedvenceim** összesítő nézet, felhasználónként mentve
- **Kezdőlap testreszabása** – gyorsindító gombok kiválasztása

### 🔍 Központi keresés
Egyetlen keresés, több tartalomtípus, csoportosítva: **panasz · kórkép · labor · score · EKG · akut állapot · protokoll/evidence · klinikai kontextus** (és Career, ha be van kapcsolva).

---

## Admin / Tartalomkezelés

A **Tartalomkezelés (CMS)** szerkesztő/lektor/admin szerepkörrel érhető el:
- **Irányelvek kezelése** – piszkozat → lektorálás → publikálás munkafolyamat
- **Betegségtár kezelése** – kórképek létrehozása, szerkesztése, lektorálása, **stub-import**
- **Tartalomfigyelő** – felülvizsgálatra esedékes és lejárt tartalmak
- **Klinikai források** – evidenciaforrások nyilvántartása és verziói
- **Audit napló** – ki, mit, mikor módosított
- **Beállítások** – modulrészek ki-/bekapcsolása (feature flag-ek)
- **Felhasználók** – regisztrált felhasználók egy helyen (név, e-mail, szerep, szakirány), csak adminnak

---

## Jogosultságok

| Szerep | Jogosultság |
|---|---|
| **apn** | Klinikai és tudástár funkciók használata, saját adatok |
| **szerkeszto** | + tartalom létrehozása/szerkesztése |
| **lektor** | + tartalom lektorálása, publikálása |
| **admin** | + beállítások, feature flag-ek, felhasználó-lista |

A hozzáférést Supabase **Row Level Security (RLS)** védi; a saját munkamenetek (vizsgálatok, esetek, kedvencek) csak a tulajdonos számára láthatók.

---

## Kapcsolható modulok (feature flag-ek)

Admin → Beállítások alatt:
- `ekg_exam` – EKG vizsga mód
- `ekg_learning` – EKG oktatóanyagok
- `apn_copilot` – APN Copilot
- `apn_career` – APN Career
- `kompetencia_passport` – Kompetencia Passport

Alapértelmezetten kikapcsolva; bekapcsoláskor automatikusan megjelennek a megfelelő belépési pontokon.

---

## Technológia

- **Next.js 15** (App Router, TypeScript, Server Components)
- **Supabase** (Postgres, Auth, RLS) – szerveroldali SSR kliens
- **Vercel** (hosting, PWA – telepíthető mobilra)
- Egyedi design rendszer (zöld/bézs paletta, kártyák, ikonrendszer), mobil-first, kontrasztos nézet

---

## Adatmodell és migrációk

A séma verziózott SQL migrációkban (`supabase/migrations/`). Főbb táblák: `profiles`, `guidelines`, `assessments`, `clinical_cases`, `diseases`, `disease_evidence`, `clinical_sources`, `feature_flags`, `favorites`, `exam_sessions`, `career_items`, `competencies`, `cpd_entries`, `audit_log`, `notifications`.

Migrációk (aktuális): **0001–0025**
- 0001–0011: init, RLS, seed, assessments, guidelines, CMS, profil, értesítések, career, betegségek, javítások
- 0012 audit · 0013 clinical_cases · 0014 labor tudásbázis · 0015 disease_evidence · 0016 clinical_sources · 0017–0019 betegség-katalógus + seed + demó kórképek
- 0020 feature_flags · 0021 copilot flag · 0022 career/passport flag · 0023 kedvencek · 0024 exam_sessions (Betegvizsgálat 2.0) · 0025 admin felhasználó-lista

---

## Telepítés és élesítés

A fejlesztés **GitHub → Vercel** pipeline-nal élesedik, a séma a **Supabase SQL Editorban** fut.

1. **Séma:** az új migráció(k) lefuttatása a Supabase SQL Editorban (a helyes projektben), sorrendben. A migrációk idempotensek.
2. **Kód:** a módosított fájlok a GitHub repóba (a Vercel automatikusan buildel).
3. **Sorrend:** mindig **séma előbb**, kód utána.

Helyi build-ellenőrzés: `npm install` → `npx tsc --noEmit` → `npm run build`.

---

## Fejlesztési elvek

- **Nem-diagnózis:** a rendszer soha nem állítja, hogy „a betegnek biztosan X betegsége van".
- **Meglévő funkciók megtartása:** finomhangolás és összekötés, nem újraírás.
- **RLS:** új policy-kben inline `exists (select 1 from profiles where id = auth.uid() and role in (...))`; profiles-önhivatkozásnál security-definer függvény.
- **Migráció-kezelés:** alkalmazott migrációt sosem módosítunk, mindig új fájlban javítunk.
- **Build-validáció:** minden lépés végén `tsc` + `next build` zöld.
- **Betegadat-védelem:** valós betegazonosító nem tárolódik; az oktatási munkamenet elkülönül a klinikai dokumentációtól.

---

## Fejlesztési státusz és roadmap

### Betegvizsgálat 2.0 modul
- ✅ 1. Anamnézis · ✅ 2. Vitálisok · ✅ 3. Általános vizsgálat · ✅ 4. Szervrendszerek · ✅ 5. Red flags · ✅ 6. Összegzés
- ⏳ 7. Oktatási/gyakorló mód · ⏳ 8. Mentor-átadás + kompetencia

### V2 UX-audit és modulintegráció
- ✅ 1. Audit · ✅ 2. Navigáció/IA · ✅ 3. Dashboard · ✅ 4. Betegvizsgálat workflow · ✅ 5. Keresés + Tudástár
- ✅ 6. Clinical Context egységes, újrahasználható komponens · ✅ 7. Labor/EKG/Score finomhangolás (teljes strukturált detail-nézetek, kapcsolódások) · ⏳ 8. Fejlődés (Mentorprogram MVP) · ✅ 9. Mobil UX + üres állapotok + loading/feedback
- ⏳ Opcionális: adatvezérelt navigáció (flag-státuszok: active/beta/coming_soon/hidden/disabled)

---

## Változásnapló

- **Betegvizsgálat 2.0** – propedeutikai modul (anamnézis → összegzés), red flag-ekkel és kapcsolódó modulokkal
- **V2 UX** – 4-kategóriás navigáció, Profil a felső sávba, munkaasztal-dashboard, multi-típusú keresés, **egységes Clinical Context** komponens
- **Kedvencek rendszer** (★) + testreszabható Gyors elérés a kezdőlapon
- **Labor** – nem-specifikus (férfi/nő) referenciaérték-értelmezés
- **CMS** – irányelvek külön oldalon, felhasználó-lista, tartalomfigyelő, források
- **Design** – kontrasztosabb paletta
- **Admin-kapcsolók** – Copilot, Career, Kompetencia Passport, EKG vizsga/oktatás

## Betegvizsgálat — szervrendszer-alapú checklist (1. fázis)

A Betegvizsgálat modul átalakítása gyors, mobil-first **vizsgálati és tanulási segédletté** (nem klinikai protokoll):
- **`/klinika/vizsgalat`** — referencia-kezdőoldal: kereső (vizsgálati elemre is, pl. „pupilla") + szervrendszer-kártyák (11 rendszer) + belépő a vizsgálati munkamenethez.
- **`/klinika/vizsgalat/rendszer/[sys]`** — szervrendszer-oldal: tabok (Vizsgálati checklist [alap] · Áttekintés · Részletes tudás); a checklist elemei a részletes útmutatóra visznek.
- **`/klinika/vizsgalat/elem/[id]`** — vizsgálati elem részletes oldala: Mit vizsgálunk? · Előkészítés · Eszközök · Vizsgálat menete · Mire figyeljek? · Gyakori eltérések · Kapcsolódó tartalmak (Betegségtár/Score/Labor/EKG) · kompetencia-hivatkozás · Részletes propedeutikai útmutató.
- **`/klinika/vizsgalat/munkamenet`** — a korábbi, beteg-szintű vizsgálati munkamenet (anamnézis→összegzés) ide került; a `/klinika/vizsgalat/[id]` munkamenet-oldalak változatlanok.
- Adat: `lib/vizsgalat/checklist.ts` (EXAM_SYSTEMS + EXAM_ELEMENTS, §7 sablon).

*Következő fázisok: perzisztens tanulási haladás (checklist-státusz per felhasználó), kompetencia-integráció, mentorprogram-hivatkozás, University Space.*

## Klinikai témakör-rendszer — Mellkasi fájdalom (1. teljes témakör)

Újrahasznosítható topic/relatedContent rendszer (`lib/topics/data.ts`), amely a meglévő modulokat **kétirányúan** kapcsolja össze — új főmenü/„Knowledge Graph" modul nélkül:
- **`/betegsegtar/akut/[slug]`** — részletes akut adatlap (mobil-first, kártyás): rövid orientáció · 🚨 vörös zászlók · elsődleges értékelés (stabilitás checklist + célzott anamnézis) · EKG · Labor (hs-cTn) · Score (GRACE) · differenciáldiagnózisok (3 szint, kattintható Betegségtár) · ⭐ APN klinikai fókusz · ⚡ eszkaláció · oxigén-kártya · automatikus „Kapcsolódó tudás" · szakmai források.
- **Kétirányú kapcsolat**: az EKG (STEMI/NSTEMI/ischaemia/PE/pericarditis), Labor (troponin/kreatinin/kálium/vércukor/lipid), Score (GRACE/HEART/TIMI) és a Betegségtár érintett kórképeinek oldalain megjelenik a „🔗 Kapcsolódó klinikai témakör → Mellkasi fájdalom" visszalink (`components/topic-backlinks.tsx`). A Betegvizsgálat szervrendszer-oldalak (életjelek/cardio/légző) is visszalinkelnek.
- **Akut lista** (`/betegsegtar/akut`): a topickal rendelkező elem (Mellkasi fájdalom) kattintható a részletes adatlapra.
- **Kereső**: a „mellkasi fájdalom" keresés a topic részletes adatlapjára visz (Akut állapot kategória).
- Bővíthető: akut dyspnoe, akut hasi fájdalom, eszméletvesztés, tudatzavar stb. ugyanezzel a rendszerrel.
