/**
 * EKG-görbék ellenőrzése: egyezik-e a megrajzolt görbe a megadott paraméterekkel.
 *
 * Ezt az ellenőrzést az hívta életre, hogy egy esetnél a kérdés P-hullámokról
 * szólt, a görbén viszont egyetlen P sem volt — a beállítás hiányzott. Az ilyen
 * eltérés rossz reflexet tanít, ezért gépi ellenőrzést kapott.
 *
 * Amit megnéz: frekvencia, QRS-szélesség, PR, tengelyállás, ST-eltérés a J+60 ms
 * pontban, T-hullám alakja, kóros Q, és hogy a görbe kifér-e a cellába.
 *
 * Futtatás:
 *   npx tsc --outDir .ekgcheck --module commonjs --target es2020 \
 *     --moduleResolution node --skipLibCheck \
 *     lib/ekg/render.ts lib/ekg/cases.ts lib/ekg/params.ts lib/ekg/analysis.ts
 *   node scripts/ekg-ellenorzes.mjs
 */

import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const R = require('../.ekgcheck/render.js')
const { EKG_CASES } = require('../.ekgcheck/cases.js')
const { ECG_PARAMS } = require('../.ekgcheck/params.js')

const LEADS = ['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6']
const gondok = []
const jelez = (hol, mit) => gondok.push(`${hol}: ${mit}`)

/** Egy elvezetés mm-ben mért csúcsai. */
function mm(lead, p, sec = 2.5) {
  const s = R.leadSamples(lead, p, { seconds: sec })
  return { s, max: Math.max(...s) * 10, min: Math.min(...s) * 10 }
}

function ellenoriz(nev, p) {
  const t = R.timing(p, 2.5)

  // 1) Frekvencia: a megrajzolt ütések száma egyezik-e a megadottal
  if (p.rhythm !== 'vfib') {
    const rr = t.beats.length > 1 ? (t.beats[t.beats.length-1].t - t.beats[0].t) / (t.beats.length-1) : 0
    const mert = rr ? Math.round(60 / rr) : 0
    const vart = p.avBlock === '3' ? p.rate : p.rate
    if (mert && Math.abs(mert - vart) > Math.max(6, vart * 0.15)) {
      jelez(nev, `frekvencia ${mert}/perc a megadott ${vart} helyett`)
    }
  }

  // 2) QRS-szélesség: a névleges és a landmark egyezése
  const L = t.beats.length ? R.landmarks(p, t.beats[0].t) : null
  if (L && p.qrsMs) {
    const w = Math.round((L.qrsEnd - L.qrsStart) * 1000)
    if (Math.abs(w - p.qrsMs) > 5) jelez(nev, `QRS ${w} ms a megadott ${p.qrsMs} helyett`)
  }

  // 3) PR: csak ahol értelmezhető
  if (L && p.prMs > 0 && !p.avBlock) {
    const pr = Math.round((L.qrsStart - L.pStart) * 1000)
    if (Math.abs(pr - p.prMs) > 5) jelez(nev, `PR ${pr} ms a megadott ${p.prMs} helyett`)
  }

  // 4) Tengely: az I. és aVF nettó iránya egyezik-e a megadott tengellyel
  if (t.beats.length && p.rhythm !== 'vfib') {
    const net = (lead) => {
      const s2 = R.leadSamples(lead, p, { seconds: 2.5 })
      let hi = 0, lo = 0
      for (const bt of t.beats) {
        if (bt.early) continue   // az extrasystole iránya szándékosan ellentétes
        const k = Math.round(bt.t * 200)
        for (let j = k - 12; j <= k + 12; j++) {
          if (s2[j] > hi) hi = s2[j]
          if (s2[j] < lo) lo = s2[j]
        }
      }
      return Math.abs(hi) >= Math.abs(lo) ? 1 : -1
    }
    const i = net('I'), avf = net('aVF')
    const vart = { normal: [1,1], left: [1,-1], right: [-1,1], extreme: [-1,-1] }[p.axis]
    if (vart && (i !== vart[0] || avf !== vart[1])) {
      jelez(nev, `tengely: I=${i>0?'+':'−'} aVF=${avf>0?'+':'−'}, a megadott „${p.axis}” szerint I=${vart[0]>0?'+':'−'} aVF=${vart[1]>0?'+':'−'} lenne`)
    }
  }

  // 5) ST-eltérés: ahol megadtak, ott mérhető-e
  if (p.st) {
    for (const [lead, mmVal] of Object.entries(p.st)) {
      if (Math.abs(mmVal) < 1) continue
      const { s } = mm(lead, p)
      const b = t.beats[1] ?? t.beats[0]
      if (!b) continue
      const lm = R.landmarks(p, b.t)
      const k = Math.round((lm.jPoint + 0.06) * 200)
      const st = s[k] * 10
      if (Math.sign(st) !== Math.sign(mmVal) || Math.abs(st - mmVal) > 2.5) {
        jelez(nev, `ST ${lead}: mért ${st.toFixed(1)} mm, megadva ${mmVal} mm`)
      }
    }
  }

  // 6) T-hullám: az invertált T tényleg negatív-e
  if (p.t) {
    for (const [lead, shape] of Object.entries(p.t)) {
      const { s } = mm(lead, p)
      const b = t.beats[1] ?? t.beats[0]
      if (!b) continue
      const lm = R.landmarks(p, b.t)
      const a = Math.round(lm.tStart * 200), z = Math.round(lm.tEnd * 200)
      let hi = -99, lo = 99
      for (let k = a; k < z; k++) { if (s[k]*10 > hi) hi = s[k]*10; if (s[k]*10 < lo) lo = s[k]*10 }
      if (shape === 'inverted' && hi > Math.abs(lo)) jelez(nev, `T ${lead}: invertáltnak jelölve, de pozitív`)
      if (shape === 'peaked' && hi < 2) jelez(nev, `T ${lead}: csúcsosnak jelölve, de csak ${hi.toFixed(1)} mm`)
      if (shape === 'flat' && Math.abs(hi) > 2.5) jelez(nev, `T ${lead}: laposnak jelölve, de ${hi.toFixed(1)} mm`)
    }
  }

  // 7) Kóros Q
  if (p.q) for (const lead of p.q) {
    const { s } = mm(lead, p)
    const b = t.beats[1] ?? t.beats[0]
    if (!b) continue
    const lm = R.landmarks(p, b.t)
    let lo = 99
    for (let k = Math.round(lm.qrsStart*200); k < Math.round(b.t*200); k++) if (s[k]*10 < lo) lo = s[k]*10
    if (lo > -1) jelez(nev, `Q ${lead}: kóros Q-nak jelölve, de csak ${lo.toFixed(1)} mm`)
  }

  // 8) Levágás: kilóg-e a görbe a cellából (±13 mm a 26 mm-es cellában)
  for (const lead of LEADS) {
    const m = mm(lead, p)
    if (m.max > 13 || m.min < -13) jelez(nev, `${lead}: kilóg a cellából (${m.min.toFixed(1)} … ${m.max.toFixed(1)} mm)`)
  }
}

console.log('=== ELEMZÉSI ESETEK ===')
EKG_CASES.forEach(c => ellenoriz(c.id, c.params))
console.log('=== GYAKORLÓ ELEMEK ===')
Object.entries(ECG_PARAMS).forEach(([id, p]) => ellenoriz(id, p))
console.log()
if (gondok.length) { console.log(`${gondok.length} eltérés:`); gondok.forEach(g => console.log('  •', g)) }
else console.log('✓ minden görbe egyezik a megadott paraméterekkel')

/* ── Kiemelés és magyarázat egyezése ──────────────────────
   A gyakorló elemeknél a magyarázat gyakran megnevezi az elvezetéseket
   („a V2–V5 elvezetésben"). Ha a görbén más elvezetések világítanak, a
   tanuló mást lát, mint amit olvas — ez rontja a felismerés gyakorlását. */
function kiemelesEllenorzes(ECG_FOCUS, PRACTICE_META) {
  const kibont = (szoveg) => {
    const k = new Set()
    // Tartományok kibontása: a „V2–V5" négy elvezetést jelent.
    szoveg.replace(/V(\d)\s*[\u2013-]\s*V(\d)/g, (m, a, b) => {
      for (let i = +a; i <= +b; i++) k.add('V' + i)
      return m
    })
    szoveg.replace(/\bV([1-6])\b/g, (m) => { k.add(m); return m })
    return [...k]
  }

  let hiba = 0
  for (const [id, elem] of Object.entries(PRACTICE_META)) {
    const loc = elem.localize
    if (!loc?.explain) continue
    const kiemelt = ECG_FOCUS[id]
    if (!kiemelt) continue
    const emlitett = kibont(loc.explain)
    if (emlitett.length === 0) continue
    const nincs = emlitett.filter((x) => !kiemelt.includes(x))
    if (nincs.length) {
      console.log(`  ✗ ${id}: a magyarázat említi (${nincs.join(', ')}), de a görbén nincs kiemelve`)
      hiba++
    }
  }
  return hiba
}
