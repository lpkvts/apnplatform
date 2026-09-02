/**
 * Vérgáz-számítások ellenőrzése.
 *
 * A sav-bázis logika klinikai jelentőségű, ezért ismert kimenetelű eseteken
 * mérjük: a zavar iránya, a kompenzáció megítélése, az anionrés és az
 * oxigenizáció. A gyakorló esetek is átfutnak, hogy a leírt megoldás és a
 * számított eredmény ne térhessen el egymástól.
 *
 * Futtatás:
 *   npx tsc --outDir .vgcheck --module commonjs --target es2020 \
 *     --moduleResolution node --skipLibCheck lib/vergaz/data.ts lib/vergaz/esetek.ts lib/vergaz/kerdesek.ts
 *   node scripts/vergaz-teszt.mjs
 */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const V = require('../.vgcheck/data.js')
const E = require('../.vgcheck/esetek.js')
const K = require('../.vgcheck/kerdesek.js')

let futott = 0, bukott = 0
const v = (x) => ({ ...V.EMPTY, ...x })

function ellenoriz(nev, ertekek, minta, varakozasok) {
  futott++
  const r = V.interpret(v(ertekek), minta)
  if (!r) { console.log('✗', nev, '— nincs elemzés'); bukott++; return }
  const szoveg = [
    r.summary,
    ...r.findings.map((f) => f.title + ' ' + f.detail),
    ...r.caveats,
  ].join(' ')
  const hiany = varakozasok.filter((w) => !szoveg.includes(w))
  if (hiany.length) {
    console.log('✗', nev)
    hiany.forEach((h) => console.log('    hiányzik:', h))
    bukott++
  } else {
    console.log('✓', nev)
  }
}

console.log('── Sav-bázis irány ──')
ellenoriz('Metabolikus acidózis', { ph: 7.2, pco2: 30, hco3: 12 }, 'arterias', ['Metabolikus acidózis'])
ellenoriz('Metabolikus alkalózis', { ph: 7.52, pco2: 47, hco3: 38 }, 'arterias', ['Metabolikus alkalózis'])
ellenoriz('Respiratorikus acidózis', { ph: 7.25, pco2: 60, hco3: 25 }, 'arterias', ['Respiratorikus acidózis'])
ellenoriz('Respiratorikus alkalózis', { ph: 7.52, pco2: 28, hco3: 22 }, 'arterias', ['Respiratorikus alkalózis'])
ellenoriz('Élettani', { ph: 7.4, pco2: 40, hco3: 24 }, 'arterias', ['nincs érdemi sav-bázis eltérés'])

console.log('\n── Kompenzáció ──')
// Winter: HCO3 12 → várt pCO2 24–28
ellenoriz('Winter, megfelelő', { ph: 7.24, pco2: 26, hco3: 12 }, 'arterias', ['kompenzáció megfelelő'])
ellenoriz('Winter, elégtelen', { ph: 7.18, pco2: 34, hco3: 12 }, 'arterias', ['Elégtelen légzési kompenzáció'])
ellenoriz('Krónikus légzési acidózis', { ph: 7.36, pco2: 60, hco3: 33 }, 'arterias', ['teljesen kompenzált', 'Krónikus'])
ellenoriz('Akut légzési acidózis', { ph: 7.22, pco2: 60, hco3: 24 }, 'arterias', ['Akut állapotra utal'])

console.log('\n── Anionrés ──')
ellenoriz('Emelkedett anionrés', { ph: 7.2, pco2: 26, hco3: 10, na: 140, cl: 100 }, 'arterias', ['Emelkedett anionrés'])
ellenoriz('Élettani anionrés', { ph: 7.28, pco2: 32, hco3: 15, na: 140, cl: 115 }, 'arterias', ['Élettani anionrés'])
ellenoriz('Albumin-korrekció', { ph: 7.2, pco2: 26, hco3: 12, na: 138, cl: 108, alb: 20 }, 'arterias', ['korrigálva'])
ellenoriz('Rejtett kevert zavar', { ph: 7.4, pco2: 38, hco3: 23, na: 140, cl: 88, alb: 40 }, 'arterias', ['rejtett'])

console.log('\n── Oxigenizáció ──')
ellenoriz('P/F súlyos', { ph: 7.4, pco2: 40, hco3: 24, po2: 60, fio2: 0.8 }, 'arterias', ['Súlyosan csökkent'])
ellenoriz('P/F megtartott', { ph: 7.4, pco2: 40, hco3: 24, po2: 95, fio2: 0.21 }, 'arterias', ['Megtartott'])
ellenoriz('A-a nem minősíthető', { ph: 7.4, pco2: 40, hco3: 24, po2: 90, fio2: 0.6 }, 'arterias', ['nem minősíthető'])
ellenoriz('A-a emelkedett levegőn', { ph: 7.47, pco2: 32, hco3: 23, po2: 60, fio2: 0.21 }, 'arterias', ['Emelkedett alveolo'])

console.log('\n── Vénás minta ──')
ellenoriz('Vénás jelzés', { ph: 7.33, pco2: 48, hco3: 25 }, 'venas', ['Vénás mintáról'])

console.log('\n── Laktát ──')
ellenoriz('Jelentősen emelkedett', { ph: 7.2, pco2: 26, hco3: 10, lact: 8 }, 'arterias', ['Jelentősen emelkedett laktát'])

console.log('\n── Gyakorló esetek ──')
for (const e of E.ESETEK) {
  futott++
  const r = V.interpret(e.values, e.sample)
  const qs = K.kerdesek(e.values, e.sample)
  if (!r) { console.log('✗', e.id, '— nem elemezhető'); bukott++; continue }
  if (qs.length < 3) { console.log('✗', e.id, `— csak ${qs.length} kérdés áll össze`); bukott++; continue }
  // Minden kérdésnek legyen érvényes helyes válasza az opciók között.
  const rossz = qs.filter((q) => !q.opciok.some((o) => o.id === q.helyes))
  if (rossz.length) { console.log('✗', e.id, '— érvénytelen helyes válasz'); bukott++; continue }
  console.log('✓', e.id.padEnd(15), `${qs.length} kérdés ·`, r.summary.slice(0, 52))
}

console.log('\n' + '─'.repeat(58))
console.log(bukott === 0
  ? `✓ mind a ${futott} ellenőrzés rendben`
  : `${bukott} / ${futott} ellenőrzés bukott`)
process.exit(bukott === 0 ? 0 : 1)
