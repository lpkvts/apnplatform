/**
 * Állapotjelölés ellenőrzése.
 *
 * A platformon négy osztálycsalád jelöl állapotot — oktatási haladás,
 * EKG-súlyosság, kockázati sáv, klinikai érték. Mind ugyanazt a három
 * jelentést hordozza: rendben, figyelem, kritikus.
 *
 * Ez az ellenőrző azt nézi, hogy mindegyik a közös tokeneket használja-e.
 * A rögzített szín két bajt okoz: nem követi a sötét témát, és a
 * kontrasztellenőrzés sem terjed ki rá. Ennél súlyosabb, hogy ha ugyanaz
 * az állapot máshogy néz ki a laborban, mint a skáláknál, az
 * félreolvasáshoz vezet.
 *
 * Futtatás: node scripts/allapot-ellenorzes.mjs
 */
import fs from 'fs'

const css = fs.readFileSync('app/globals.css', 'utf8')

/** Az állapotjelölő osztálycsaládok. */
const CSALADOK = [
  { nev: 'st-*   oktatási haladás', minta: /\.st-(none|progress|done|passed|overdue|failed|locked)\b[^{]*\{([^}]*)\}/g },
  { nev: 'sev-*  EKG-súlyosság', minta: /\.sev-(low|mid|crit)\b[^{]*\{([^}]*)\}/g },
  { nev: 'r-*    kockázati sáv', minta: /\.r-(low|mid|high|crit)\b[^{]*\{([^}]*)\}/g },
  { nev: 'all-*  klinikai érték', minta: /\.all-(ok|fig|krit)\b[^{]*\{([^}]*)\}/g },
]

let hiba = 0
console.log('ÁLLAPOTJELÖLÉS — a közös tokenek használata\n')

for (const cs of CSALADOK) {
  const talalatok = [...css.matchAll(cs.minta)]
  const rogzitett = []
  for (const m of talalatok) {
    // Rögzített hexadecimális szín a szabályon belül
    for (const szin of m[2].matchAll(/#[0-9A-Fa-f]{3,8}\b/g)) {
      rogzitett.push(`.${m[1]} → ${szin[0]}`)
    }
  }
  if (rogzitett.length) {
    console.log(`  ✗ ${cs.nev}`)
    rogzitett.forEach((r) => console.log(`      rögzített szín: ${r}`))
    hiba += rogzitett.length
  } else {
    console.log(`  ✓ ${cs.nev.padEnd(24)} ${talalatok.length} szabály, mind tokenből`)
  }
}

/* A kockázati szintek elkülönülése: a közepes és a magas nem lehet
   azonos, mert akkor a felhasználó nem látja a különbséget. */
const szintek = {}
for (const m of css.matchAll(/\.sh-result\.r-(low|mid|high|crit)\s*\{([^}]*)\}/g)) {
  const szin = m[2].match(/var\(--[a-z-]+\)/)
  if (szin) szintek[m[1]] = szin[0]
}
console.log()
const parok = [['low', 'mid'], ['mid', 'high'], ['high', 'crit']]
for (const [a, b] of parok) {
  if (szintek[a] && szintek[a] === szintek[b]) {
    // A kritikus a magastól erősebb jelöléssel is elválhat, nem csak színnel.
    const critEros = b === 'crit' && /background/.test(css.match(/\.sh-result\.r-crit\s*\{([^}]*)\}/)?.[1] ?? '')
    if (!critEros) {
      console.log(`  ✗ a(z) ${a} és a(z) ${b} kockázati szint azonos színt kap: ${szintek[a]}`)
      hiba++
    }
  }
}

console.log()
console.log(hiba === 0
  ? '✓ minden állapotjelölés a közös tokeneket használja'
  : `${hiba} eltérés`)
process.exit(hiba === 0 ? 0 : 1)
