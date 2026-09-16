/**
 * Gyógyszertár-ellenőrzés.
 *
 * Három olyan hibát keres, amelyek a bővítések során ténylegesen előfordultak:
 *
 *   1. Nem létező csoportra hivatkozó hatóanyag. Ez a legveszélyesebb, mert a
 *      beszúrás nem hibázik — csak csendben nem szúr be semmit. A vízhajtók
 *      így vesztek el egyszer.
 *
 *   2. Ékezetes vagy szóközös slug. A slug célja, hogy hivatkozható és
 *      gépelhető legyen; az ékezet emellett a keresést is elrontja, ami egy
 *      duplikált csoporthoz vezetett.
 *
 *   3. Gyanúsan hasonló csoportnevek. A „vérlemezke-gátlók" és a
 *      „thrombocytaaggregáció-gátlók" ugyanaz — a szkript az ilyen párokat
 *      jelzi, a döntés emberi.
 */
import fs from 'node:fs'
import path from 'node:path'

const DIR = 'supabase/migrations'
const sql = fs.readdirSync(DIR)
  .filter((f) => f.endsWith('.sql')).sort()
  .map((f) => ({ f, s: fs.readFileSync(path.join(DIR, f), 'utf8') }))

const csoportok = new Map()
const hatoanyagok = []

for (const { f, s } of sql) {
  // Csoportok: select-es és values-os beszúrás egyaránt
  for (const m of s.matchAll(/select '([a-zéáíóöőúüű0-9-]+)', '([^']+)', '[A-Z0-9]*', p\.id/g)) {
    csoportok.set(m[1], { nev: m[2], fajl: f })
  }
  for (const m of s.matchAll(/values \(\s*\n?\s*'([a-zéáíóöőúüű0-9-]+)', '([^']+)'/g)) {
    csoportok.set(m[1], { nev: m[2], fajl: f })
  }
  for (const m of s.matchAll(/\('([a-zéáíóöőúüű0-9-]+)', '([^']+)', '[A-Z0-9]*', null/g)) {
    csoportok.set(m[1], { nev: m[2], fajl: f })
  }
  // Hatóanyagok és a csoportjuk
  for (const m of s.matchAll(
    /insert into public\.drug_substances[\s\S]{0,600}?select '([a-z0-9-]+)'[\s\S]*?where g\.slug = '([a-zéáíóöőúüű0-9-]+)'/g)) {
    hatoanyagok.push({ slug: m[1], csoport: m[2], fajl: f })
  }
}

let hiba = 0

// 1. Nem létező csoportra hivatkozás
for (const h of hatoanyagok) {
  if (!csoportok.has(h.csoport)) {
    console.log(`  ✗ ${h.slug} → nem létező csoport: ${h.csoport}  (${h.fajl})`)
    hiba++
  }
}

// 2. Ékezetes vagy szóközös slug
//
// A „vérlemezke-gatlok" kivétel: a 0069-ben keletkezett, és a 0102 lezárta.
// Visszamenőleg nem írjuk át, mert az adatbázisban már létezik, és a
// hivatkozások megszakadnának — de új ilyen nem keletkezhet.
const LEZART = new Set(['vérlemezke-gatlok'])

for (const [slug, v] of csoportok) {
  if (LEZART.has(slug)) continue
  if (/[éáíóöőúüűÉÁÍÓÖŐÚÜŰ\s]/.test(slug)) {
    console.log(`  ✗ ékezetes vagy szóközös slug: ${slug}  (${v.fajl})`)
    hiba++
  }
}

// 3. Gyanúsan hasonló csoportnevek
const norm = (s) => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z]/g, '')
const KULCSOK = [
  // A vérlemezke–thrombocyta pár összevonva; a többi figyelendő marad.
  ['alvadasgatlo', 'antikoagulans'],
  ['vernyomas', 'antihipertenziv'],
]
const nevek = [...csoportok].map(([s, v]) => [s, norm(v.nev)])
for (const [a, b] of KULCSOK) {
  const ea = nevek.filter(([, n]) => n.includes(a))
  const eb = nevek.filter(([, n]) => n.includes(b))
  if (ea.length && eb.length) {
    console.log(`  ⚠ hasonló csoportok: ${ea.map(([s]) => s).join(', ')} ` +
                `és ${eb.map(([s]) => s).join(', ')} — összevonandó?`)
  }
}

console.log(`\n${csoportok.size} csoport, ${hatoanyagok.length} hatóanyag-beszúrás ellenőrizve.`)
console.log(hiba === 0
  ? '✓ minden hatóanyag létező csoportra mutat, és a slugok szabályosak'
  : `${hiba} hiba`)
process.exit(hiba === 0 ? 0 : 1)
