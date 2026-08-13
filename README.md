# APN Hungary Platform — B sáv (perzisztens platform)

Next.js (App Router) + Supabase (PostgreSQL) induló váz a PHASE 3–4-hez:
**Kompetencia-passzport, CPD, kurzusok, tartalom-/forráskezelés (CMS)**.

Ez a réteg azt tartalmazza, amihez perzisztencia és valódi auth kell — ez a
része NEM fér el az offline egyfájlos prototípusban. Az offline klinikai mag
(Score Hub, Új betegértékelés, Labor, EKG, Copilot) továbbra is külön él.

## Fontos: migráció ELŐBB, kód UTÁNA

A séma mindig a kód-deploy előtt fusson (QuestRun-konvenció).

## Beállítás

1. Supabase projekt létrehozása → `Project Settings → API`-ból másold ki az
   URL-t és az anon kulcsot.
2. `cp .env.example .env.local`, töltsd ki a `NEXT_PUBLIC_SUPABASE_*` értékeket.
3. Migrációk futtatása **sorrendben** (SQL editor vagy `supabase db push`):
   - `supabase/migrations/0001_init.sql` — séma, triggerek, `handle_new_user`
   - `supabase/migrations/0002_rls.sql`  — Row Level Security
   - `supabase/migrations/0003_seed.sql` — kezdő katalógusok (kompetenciák, CPD-típusok, kurzusok)
4. `npm install`
5. `npm run dev` → http://localhost:3000

Első belépéskor regisztrálj — a `handle_new_user` trigger automatikusan
létrehozza a profilodat. Admin/szerkesztő jogot a `profiles.role` átállításával
adhatsz (SQL editorból).

## Adatmodell (0001)

- `profiles` (auth.users-hez kötve, szerepkör: apn/szerkeszto/lektor/admin)
- `competencies`, `competency_progress`
- `certifications`
- `cpd_activity_types`, `cpd_entries` (év generált oszlop), `cpd_goals`
- `courses`
- `sources`, `guidelines` (státusz: draft → review → published → expired; `ai_generated` jelölés)
- `notifications`

## Biztonság (0002)

- Mindenki csak a SAJÁT rekordjait látja/írja (progress, cert, cpd, goal, notif).
- Katalógusok: bejelentkezett olvas; szerkesztő/admin ír.
- Irányelvek: csak **published** olvasható mindenkinek; piszkozat a szerzőnek/lektornak.
- Az AI-generált tartalom kötelezően `draft` → lektorálás → `published`
  (nem publikálható automatikusan).

## Konvenciók

- Kétértelmű beágyazott join elkerülése: ahol egy tábla KÉT idegen kulccsal
  mutat ugyanarra (pl. `guidelines.created_by` és `guidelines.reviewed_by` →
  `profiles`), ott explicit FK-hint kell:
  `.select('*, created_by:profiles!guidelines_created_by_fkey(*)')`.
  A jelen oldalak ezt elkerülik: egyszerű lekérdezés + JS-oldali összefésülés.
- Típusok: `lib/types.ts` (kézzel), vagy generálható: `supabase gen types typescript`.

## Következő lépések

- Tanúsítványok + fájlfeltöltés (Supabase Storage).
- Kurzus-ajánlás a kompetencia-profil alapján.
- CMS felület a `guidelines` lektorálási munkafolyamathoz.
- Az offline mag Tudástár-tartalmának import-migrációja a `guidelines`/`sources` táblákba.
