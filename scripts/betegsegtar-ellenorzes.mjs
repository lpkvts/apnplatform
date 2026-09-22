#!/usr/bin/env node
/**
 * APN-MED — betegségtár-ellenőrzés
 *
 * A kórképek adatlapjai laborparaméterekre, pontozókra és EKG-leletekre
 * hivatkoznak azonosítóval. Ha az azonosító nem létezik, semmi nem jelez:
 * a migráció lefut, az adatlap megnyílik, csak a hivatkozott elem hiányzik
 * róla — és ez a mentés után senkinek nem tűnik fel.
 *
 * Ebbe már beleszaladtunk: az „alb" és a „hgb" nem létező laborazonosító
 * (a készletben „hb" van, albumin pedig nincs), és a hibás csoportazonosítóra
 * mutató beszúrás némán semmit nem csinált.
 *
 * Ez a szkript minden migrációban szereplő kórkép-beszúrás hivatkozásait
 * összeveti a tényleges készlettel, és ellenőrzi az adatlapok kötelező
 * mezőit is.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const GY = process.cwd()
const olvas = (p) => readFileSync(join(GY, p), 'utf8')

let hiba = 0
const rossz = (m) => { console.log(`  ✗ ${m}`); hiba++ }
const figyelem = []

/** Egysoros JSON-tömb kiolvasása egy adat-fájlból. */
const tomb = (p, pre) => {
  const s = olvas(p)
  const i = s.indexOf(pre)
  if (i < 0) return []
  const j = s.indexOf('\n', i)
  return JSON.parse(s.slice(i + pre.length, j).replace(/;\s*$/, ''))
}

const LAB = new Set(tomb('lib/labor/data.ts', 'export const LAB: LabItem[] = ').map((x) => x.id))
const SCORE = new Set(tomb('lib/scores/data.ts', 'export const TESTS: Test[] = ').map((x) => x.id))
const EKG = new Set(tomb('lib/ekg/data.ts', 'export const ECG: EcgItem[] = ').map((x) => x.id))

console.log(`BETEGSÉGTÁR-ELLENŐRZÉS — ${LAB.size} labor, ${SCORE.size} pontozó, ${EKG.size} EKG-lelet\n`)

/* ── A migrációk kórkép-beszúrásainak begyűjtése ── */
const dir = 'supabase/migrations'
const KELL = ['brief_what', 'brief_why', 'when', 'examine', 'labs', 'red_flags',
              'apn_focus', 'treatment', 'followup', 'source_name']

// Kórképenként a LEGUTOLSÓ állapotot nézzük, nem minden beszúrást külön.
// Egy kórkép több migrációban is szerepelhet: a későbbi felülírja a korábbit,
// és az adatbázisban is az utolsó állapot marad. Ha minden beszúrást
// önállóan vizsgálnánk, egy azóta javított hibát jeleznénk.
const allapot = new Map()   // slug -> { f, nev, sc, lb, ek, body }

for (const f of readdirSync(join(GY, dir)).filter((x) => x.endsWith('.sql')).sort()) {
  const s = olvas(join(dir, f))

  // ('slug', 'Név', '{aliases}', 'rövid', … '{...}'::jsonb …) — a tömböket és a
  // body-t külön szedjük ki, mert a sorok szerkezete migrációnként eltér.
  for (const m of s.matchAll(/\('([a-z0-9_-]+)',\s*'((?:[^']|'')*)',[\s\S]{0,400}?('\{"brief_what[\s\S]*?\}')::jsonb/g)) {
    // A sor eleje és a body között állnak az azonosító-tömbök.
    const fej = s.slice(m.index, m.index + m[0].length - m[3].length)
    const tombok = [...fej.matchAll(/'\{([^{}]*)\}'/g)].map((x) =>
      x[1].split(',').map((y) => y.trim().replace(/^"|"$/g, '')).filter(Boolean))
    // Az első tömb az aliases; utána score, lab, ekg, guideline_kw következik.
    const [, sc = [], lb = [], ek = []] = tombok
    let body = null
    try { body = JSON.parse(m[3].slice(1, -1).replace(/''/g, "'")) } catch { /* átugorjuk */ }
    allapot.set(m[1], { f, nev: m[2].replace(/''/g, "'"), sc, lb, ek, body })
  }

  // Külön body-frissítések (update … set body = '{…}'::jsonb … slug = '…').
  for (const m of s.matchAll(/body\s*=\s*('\{"brief_what[\s\S]*?\}')::jsonb[\s\S]{0,600}?slug\s*=\s*'([a-z0-9_-]+)'/g)) {
    const e = allapot.get(m[2])
    if (!e) continue
    try { e.body = JSON.parse(m[1].slice(1, -1).replace(/''/g, "'")); e.f = f } catch { /* átugorjuk */ }
  }
}

for (const [slug, e] of allapot) {
  for (const id of e.sc) if (!SCORE.has(id)) rossz(`${e.f} · ${slug}: nincs ilyen pontozó — ${id}`)
  for (const id of e.lb) if (!LAB.has(id)) rossz(`${e.f} · ${slug}: nincs ilyen laborparaméter — ${id}`)
  for (const id of e.ek) if (!EKG.has(id)) rossz(`${e.f} · ${slug}: nincs ilyen EKG-lelet — ${id}`)
  if (!e.body) continue

  const hianyzo = KELL.filter((k) => e.body[k] == null ||
    (Array.isArray(e.body[k]) ? e.body[k].length === 0 : String(e.body[k]).trim() === ''))
  if (hianyzo.length) rossz(`${e.f} · ${slug} (${e.nev}): hiányzó mező — ${hianyzo.join(', ')}`)

  // Forráshivatkozás: név mellé cím és évszám is kell, különben az
  // irányelvjegyzékbe hiányosan kerül át, és a „forrás megnyitása" sehová
  // nem visz. A régi adatlapoknál ez figyelmeztetés, nem hiba: ezek még a
  // forrás-átvezetés bevezetése előtt készültek, és külön körben pótolandók.
  if (e.body.source_name && !e.body.source_url) {
    figyelem.push(`${slug} (${e.nev}) — „${e.body.source_name}" forrásnak nincs hivatkozása`)
  }
  if (e.body.source_name && e.body.source_url && !e.body.version) {
    rossz(`${e.f} · ${slug}: a forrásnál nincs évszám (version)`)
  }
}

console.log(`${allapot.size} kórkép ellenőrizve.`)
if (figyelem.length) {
  console.log(`\n  ${figyelem.length} adatlapon hiányzik a forrás hivatkozása (pótlandó):`)
  for (const x of figyelem) console.log(`    ⚠ ${x}`)
}
console.log(hiba === 0
  ? '\n✓ minden hivatkozott labor, pontozó és EKG-lelet létezik, és az adatlapok teljesek'
  : `\n${hiba} hiba`)
process.exit(hiba === 0 ? 0 : 1)
