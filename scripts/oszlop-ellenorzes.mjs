/**
 * Oszlopnevek ellenőrzése a kód és a migrációk között.
 *
 * A kódban hivatkozott oszlopneveket összeveti azzal, amit a migrációk
 * ténylegesen létrehoznak. Elgépelt vagy rosszul feltételezett oszlopnév
 * csak futásidőben derülne ki — jellemzően a felhasználónál, hibaüzenettel.
 *
 * Futtatás: node scripts/oszlop-ellenorzes.mjs
 */
import fs from 'fs'
import path from 'path'

/* ── A táblák oszlopainak kiolvasása a migrációkból ── */
const MIG = 'supabase/migrations'
let sql = ''
for (const f of fs.readdirSync(MIG).sort()) {
  sql += fs.readFileSync(path.join(MIG, f), 'utf8') + '\n'
}

const tablak = new Map()

// create table blokkok
for (const m of sql.matchAll(/create table(?: if not exists)? public\.(\w+)\s*\(([\s\S]*?)\n\);/g)) {
  const [, nev, torzs] = m
  const oszlopok = new Set(tablak.get(nev) ?? [])
  // Az oszlopdefiníciók vesszővel válnak el, de a zárójeles részekben
  // (például `check (... in ('a','b'))`) is van vessző — azokat átugorjuk.
  const darabok = []
  let szint = 0, aktualis = ''
  for (const ch of torzs) {
    if (ch === '(') szint++
    else if (ch === ')') szint--
    if (ch === ',' && szint === 0) { darabok.push(aktualis); aktualis = '' }
    else aktualis += ch
  }
  darabok.push(aktualis)

  for (const d of darabok) {
    const t = d.split('\n')
      .map((sor) => sor.split('--')[0])
      .join(' ')
      .trim()
    if (!t || /^(primary|foreign|unique|check|constraint)\b/i.test(t)) continue
    const o = t.match(/^(\w+)\s+/)
    if (o) oszlopok.add(o[1])
  }
  tablak.set(nev, [...oszlopok])
}

// utólag hozzáadott oszlopok
for (const m of sql.matchAll(/alter table public\.(\w+)\s+add column(?: if not exists)? (\w+)/g)) {
  const [, tabla, oszlop] = m
  tablak.set(tabla, [...(tablak.get(tabla) ?? []), oszlop])
}

/* ── A kódban hivatkozott oszlopok ── */
function* fajlok(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { if (!['node_modules', '.next'].includes(e.name)) yield* fajlok(p) }
    else if (/\.(ts|tsx)$/.test(e.name)) yield p
  }
}

let hiba = 0, vizsgalt = 0
for (const f of [...fajlok('lib'), ...fajlok('app'), ...fajlok('components')]) {
  const kod = fs.readFileSync(f, 'utf8')
  // .from('tabla') ... .eq('oszlop', ...) mintázat egy láncban
  for (const m of kod.matchAll(/\.from\('(\w+)'\)([\s\S]{0,400}?)(?=\.from\('|\n\n|$)/g)) {
    const [, tabla, lanc] = m
    const ismert = tablak.get(tabla)
    if (!ismert) continue
    for (const e of lanc.matchAll(/\.(?:eq|neq|gt|gte|lt|lte|is|order)\('(\w+)'/g)) {
      const oszlop = e[1]
      vizsgalt++
      if (!ismert.includes(oszlop)) {
        console.log(`  ✗ ${f}`)
        console.log(`      ${tabla}.${oszlop} — ilyen oszlop nincs`)
        console.log(`      létező oszlopok: ${ismert.slice(0, 8).join(', ')}…`)
        hiba++
      }
    }
  }
}

console.log()
console.log(`${vizsgalt} oszlop-hivatkozás ellenőrizve ${tablak.size} táblán.`)
console.log(hiba === 0 ? '✓ minden oszlopnév létezik' : `${hiba} hibás hivatkozás`)
process.exit(hiba === 0 ? 0 : 1)
