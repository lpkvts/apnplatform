/**
 * Importok ellenőrzése.
 *
 * Minden `@/...` hivatkozásról megnézi, hogy a hivatkozott fájl létezik-e.
 * A hiányzó import csak fordításkor derül ki — ha egy csomagból kimarad egy
 * új fájl, a telepítés elbukik, és a hibaüzenet a szolgáltatónál jelenik meg,
 * nem a fejlesztésnél.
 *
 * Futtatás: node scripts/import-ellenorzes.mjs
 */
import fs from 'fs'
import path from 'path'

function* fajlok(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(e.name)) yield* fajlok(p)
    } else if (/\.(ts|tsx)$/.test(e.name)) yield p
  }
}

/** A hivatkozott útvonalhoz tartozó tényleges fájl megkeresése. */
function letezik(hivatkozas) {
  const alap = hivatkozas.replace(/^@\//, '')
  const jeloltek = [
    alap, `${alap}.ts`, `${alap}.tsx`,
    path.join(alap, 'index.ts'), path.join(alap, 'index.tsx'),
  ]
  return jeloltek.some((j) => fs.existsSync(j))
}

let hiba = 0, vizsgalt = 0
for (const f of [...fajlok('app'), ...fajlok('components'), ...fajlok('lib')]) {
  const kod = fs.readFileSync(f, 'utf8')
  // import ... from '@/...' és import('@/...') alakok
  for (const m of kod.matchAll(/from\s+'(@\/[^']+)'|import\('(@\/[^']+)'\)/g)) {
    const hiv = m[1] ?? m[2]
    vizsgalt++
    if (!letezik(hiv)) {
      console.log(`  ✗ ${f}`)
      console.log(`      hiányzik: ${hiv}`)
      hiba++
    }
  }
}

console.log()
console.log(`${vizsgalt} import ellenőrizve.`)
console.log(hiba === 0 ? '✓ minden hivatkozott fájl megvan' : `${hiba} hiányzó fájl`)
process.exit(hiba === 0 ? 0 : 1)
