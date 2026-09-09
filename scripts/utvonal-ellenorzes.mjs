/**
 * Belső hivatkozások ellenőrzése.
 *
 * Minden `href="/..."` hivatkozásról megnézi, hogy létezik-e hozzá oldal.
 * A törött belső hivatkozás csak akkor derül ki, ha valaki rákattint — és
 * akkor is csak egy 404-es oldalt lát, ami nem mondja meg, honnan jött.
 *
 * Futtatás: node scripts/utvonal-ellenorzes.mjs
 */
import fs from 'fs'
import path from 'path'

/* ── A létező útvonalak összegyűjtése az app könyvtárból ── */
const utvonalak = new Set(['/'])
function bejar(dir, ut = '') {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('_') || e.name === 'api') continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      // A (csoport) nevű könyvtárak nem jelennek meg az útvonalban.
      const szakasz = e.name.startsWith('(') ? '' : `/${e.name}`
      bejar(p, ut + szakasz)
    } else if (e.name === 'page.tsx' || e.name === 'page.ts') {
      utvonalak.add(ut || '/')
    }
  }
}
bejar('app')

/** Illeszkedik-e a hivatkozás valamelyik útvonalra? A [param] bármire illik. */
function letezik(href) {
  const tiszta = href.split('?')[0].split('#')[0].replace(/\/$/, '') || '/'
  if (utvonalak.has(tiszta)) return true
  const resz = tiszta.split('/').filter(Boolean)
  for (const u of utvonalak) {
    const ur = u.split('/').filter(Boolean)
    if (ur.length !== resz.length) continue
    if (ur.every((r, i) => r.startsWith('[') || r === resz[i])) return true
  }
  return false
}

function* fajlok(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!['node_modules', '.next'].includes(e.name)) yield* fajlok(p)
    } else if (/\.tsx?$/.test(e.name)) yield p
  }
}

let hiba = 0, vizsgalt = 0
for (const f of [...fajlok('app'), ...fajlok('components'), ...fajlok('lib')]) {
  const kod = fs.readFileSync(f, 'utf8')
  // Csak a rögzített, belső hivatkozásokat nézzük — a sablonos kifejezéseket
  // (`/valami/${id}`) nem lehet előre feloldani.
  for (const m of kod.matchAll(/href="(\/[a-z0-9/-]*)"|href:\s*'(\/[a-z0-9/-]*)'/g)) {
    const href = m[1] ?? m[2]
    if (href.startsWith('/api/')) continue
    vizsgalt++
    if (!letezik(href)) {
      console.log(`  ✗ ${f}`)
      console.log(`      nincs ilyen oldal: ${href}`)
      hiba++
    }
  }
}

console.log()
console.log(`${vizsgalt} belső hivatkozás ellenőrizve, ${utvonalak.size} oldalon.`)
console.log(hiba === 0 ? '✓ minden hivatkozás célba talál' : `${hiba} törött hivatkozás`)
process.exit(hiba === 0 ? 0 : 1)
