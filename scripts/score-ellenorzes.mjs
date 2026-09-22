#!/usr/bin/env node
/**
 * APN-MED — pontozó-ellenőrzés
 *
 * Miért kell:
 * A skálák adatai egyetlen nagy JSON-tömbben állnak. Egy elgépelt határérték
 * — 219 helyett 211 — nem okoz fordítási hibát, a felület működik, a pontszám
 * kijön: csak rossz. Klinikai pontozónál ez a legrosszabb fajta hiba, mert
 * hihetőnek látszik.
 *
 * Ezért a NEWS2 minden sávja a Royal College of Physicians 2017-es
 * táblázatához van kötve, tételről tételre. Ha valaki hozzányúl, ez kiderül.
 *
 * Forrás: NEWS2 Chart 1 — The NEWS scoring system, RCP 2017.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const GY = process.cwd()
const olvas = (p) => readFileSync(join(GY, p), 'utf8')

let hiba = 0
const rossz = (m) => { console.log(`  ✗ ${m}`); hiba++ }
const jo = (m) => console.log(`  ✓ ${m}`)

/* ── Adatok beolvasása ── */
const forras = olvas('lib/scores/data.ts')
const PRE = 'export const TESTS: Test[] = '
const i = forras.indexOf(PRE)
const j = forras.indexOf('\n', i)
const TESTS = JSON.parse(forras.slice(i + PRE.length, j).replace(/;\s*$/, ''))

console.log(`PONTOZÓ-ELLENŐRZÉS — ${TESTS.length} skála\n`)

/* ── NEWS2 a hivatalos táblázat szerint ── */
// Minden sor: [a kérdés kezdete, [[címke, pont], …]]
const NEWS2_RCP = [
  ['Légzésszám', [['≤8', 3], ['9–11', 1], ['12–20', 0], ['21–24', 2], ['≥25', 3]]],
  ['SpO₂ — 1-es skála', [['≥96', 0], ['94–95', 1], ['92–93', 2], ['≤91', 3]]],
  ['SpO₂ — 2-es skála', [
    ['≤83', 3], ['84–85', 2], ['86–87', 1],
    ['88–92, vagy ≥93 levegőn', 0],
    ['93–94 oxigénen', 1], ['95–96 oxigénen', 2], ['≥97 oxigénen', 3],
  ]],
  ['Kiegészítő oxigén', [['Nem', 0], ['Igen', 2]]],
  ['Szisztolés vérnyomás', [['≤90', 3], ['91–100', 2], ['101–110', 1], ['111–219', 0], ['≥220', 3]]],
  ['Pulzus', [['≤40', 3], ['41–50', 1], ['51–90', 0], ['91–110', 1], ['111–130', 2], ['≥131', 3]]],
  ['Tudatállapot', [['Éber (A)', 0], ['Új zavartság / V / P / U', 3]]],
  ['Testhőmérséklet', [['≤35,0', 3], ['35,1–36,0', 1], ['36,1–38,0', 0], ['38,1–39,0', 1], ['≥39,1', 2]]],
]

const news2 = TESTS.find((t) => t.id === 'news2')
console.log('NEWS2 — sávok az RCP 2017 táblázata szerint:')
if (!news2) {
  rossz('nincs news2 pontozó')
} else {
  for (const [kezd, vart] of NEWS2_RCP) {
    const it = (news2.items ?? []).find((x) => x.q.startsWith(kezd))
    if (!it) { rossz(`hiányzó tétel: ${kezd}`); continue }
    const kapott = (it.opts ?? []).map((o) => [o.l, o.v])
    const a = JSON.stringify(kapott)
    const b = JSON.stringify(vart)
    if (a !== b) rossz(`${kezd}: ${a}\n       elvárt: ${b}`)
    else jo(`${kezd} — ${vart.length} sáv`)
  }

  // A 0 pontos szisztolés sáv felső határa a leggyakrabban megkérdőjelezett
  // érték. Szándékos: a NEWS2 akut romlást jelez, nem krónikus hipertóniát.
  const rr = (news2.items ?? []).find((x) => x.q.startsWith('Szisztolés'))
  const nulla = (rr?.opts ?? []).find((o) => o.v === 0)
  nulla?.l === '111–219'
    ? jo('a 0 pontos szisztolés sáv 111–219 (nem 111–211)')
    : rossz(`a 0 pontos szisztolés sáv: ${nulla?.l} — az RCP szerint 111–219`)

  // Egyetlen 3 pontos paraméter önmagában sürgős.
  news2.itemFlag?.points === 3
    ? jo('az egyetlen 3 pontos paraméter külön figyelmeztetést ad')
    : rossz('hiányzik az egyetlen 3 pontos paraméter szabálya (itemFlag)')

  // A két SpO₂-skála kizárja egymást.
  const sk = (news2.items ?? []).map((x, n) => ({ n, q: x.q, showIf: x.showIf }))
  const s1 = sk.find((x) => x.q.startsWith('SpO₂ — 1-es'))
  const s2 = sk.find((x) => x.q.startsWith('SpO₂ — 2-es'))
  if (!s1?.showIf || !s2?.showIf) rossz('a két SpO₂-skála nem feltételes')
  else if (s1.showIf.item !== s2.showIf.item || s1.showIf.checked === s2.showIf.checked)
    rossz('a két SpO₂-skála nem zárja ki egymást')
  else jo('a két SpO₂-skála kizárja egymást')

  // Aggregált sávok.
  const VART_SAV = [[0, 4], [5, 6], [7, 20]]
  const sav = (news2.bands ?? []).map((b) => [b.min, b.max])
  JSON.stringify(sav) === JSON.stringify(VART_SAV)
    ? jo('aggregált sávok: 0–4 / 5–6 / ≥7')
    : rossz(`aggregált sávok: ${JSON.stringify(sav)} — elvárt ${JSON.stringify(VART_SAV)}`)
}

/* ── Eseti számolás a dokumentált összegzési szabállyal ── */
console.log('\nEsetek:')
const valasz = (t, parok) => {
  // parok: [kérdés-kezdet, címke][]
  const a = {}
  for (const [kezd, cimke] of parok) {
    const n = (t.items ?? []).findIndex((x) => x.q.startsWith(kezd))
    const o = (t.items?.[n]?.opts ?? []).find((x) => x.l === cimke)
    if (n < 0 || !o) throw new Error(`nincs ilyen válasz: ${kezd} / ${cimke}`)
    a[n] = t.items[n].type === 'check' ? [o.v] : o.v
  }
  return a
}
const lathato = (t, a, n) => {
  const c = t.items?.[n]?.showIf
  if (!c) return true
  const v = a[c.item]
  return (Array.isArray(v) ? v.length > 0 : v != null) === c.checked
}
const pont = (t, a) => (t.items ?? []).reduce((s, _it, n) => {
  if (!lathato(t, a, n)) return s
  const v = a[n]
  if (Array.isArray(v)) return s + v.reduce((x, y) => x + Number(y), 0)
  return v != null ? s + Number(v) : s
}, 0)

const ESETEK = [
  {
    nev: 'minden élettani paraméter normális',
    v: [['Légzésszám', '12–20'], ['SpO₂ — 1-es', '≥96'], ['Kiegészítő oxigén', 'Nem'],
        ['Szisztolés', '111–219'], ['Pulzus', '51–90'], ['Tudatállapot', 'Éber (A)'],
        ['Testhőmérséklet', '36,1–38,0']],
    pont: 0, flag: 0,
  },
  {
    nev: 'szisztolés 225 Hgmm, minden más rendben',
    v: [['Légzésszám', '12–20'], ['SpO₂ — 1-es', '≥96'], ['Kiegészítő oxigén', 'Nem'],
        ['Szisztolés', '≥220'], ['Pulzus', '51–90'], ['Tudatállapot', 'Éber (A)'],
        ['Testhőmérséklet', '36,1–38,0']],
    pont: 3, flag: 1,   // alacsony sáv, de egyetlen 3 pontos paraméter
  },
  {
    nev: 'súlyos szepszis-gyanú',
    v: [['Légzésszám', '≥25'], ['SpO₂ — 1-es', '≤91'], ['Kiegészítő oxigén', 'Igen'],
        ['Szisztolés', '91–100'], ['Pulzus', '111–130'], ['Tudatállapot', 'Új zavartság / V / P / U'],
        ['Testhőmérséklet', '≥39,1']],
    // 3+3+2+2+2+3+2 = 17; a 3 pontos tételek: légzésszám, SpO₂, tudatállapot
    pont: 17, flag: 3,
  },
  {
    nev: 'COPD, 2-es skála, 90% levegőn',
    v: [['Krónikus hipoxiás', 'Igen, 2-es skála'], ['Légzésszám', '12–20'],
        ['SpO₂ — 2-es', '88–92, vagy ≥93 levegőn'], ['Kiegészítő oxigén', 'Nem'],
        ['Szisztolés', '111–219'], ['Pulzus', '51–90'], ['Tudatállapot', 'Éber (A)'],
        ['Testhőmérséklet', '36,1–38,0']],
    pont: 0, flag: 0,   // 1-es skálával ugyanez 3 pont lenne
  },
]

if (news2) {
  for (const e of ESETEK) {
    try {
      const a = valasz(news2, e.v)
      const p = pont(news2, a)
      const f = (news2.items ?? []).filter((_x, n) =>
        lathato(news2, a, n) && !Array.isArray(a[n]) && Number(a[n]) >= (news2.itemFlag?.points ?? 99)).length
      if (p !== e.pont) rossz(`${e.nev}: ${p} pont, elvárt ${e.pont}`)
      else if (f !== e.flag) rossz(`${e.nev}: ${f} külön jelzett paraméter, elvárt ${e.flag}`)
      else jo(`${e.nev} — ${p} pont${e.flag ? `, ${e.flag} önmagában sürgős paraméter` : ''}`)
    } catch (err) {
      rossz(`${e.nev}: ${err.message}`)
    }
  }
}

/* ── A motor figyelembe veszi-e a rejtett tételeket ── */
console.log('\nMotor:')
const motor = olvas('lib/scores/engine.ts')
for (const fn of ['testScore', 'testItemScores', 'testComplete']) {
  const blokk = motor.slice(motor.indexOf(`export function ${fn}`), motor.indexOf(`export function ${fn}`) + 700)
  blokk.includes('itemVisible')
    ? jo(`${fn}() kihagyja a rejtett tételeket`)
    : rossz(`${fn}() nem veszi figyelembe a feltételes tételeket`)
}

console.log(hiba === 0
  ? '\n✓ a NEWS2 sávjai megegyeznek az RCP 2017 táblázatával'
  : `\n${hiba} hiba`)
process.exit(hiba === 0 ? 0 : 1)
