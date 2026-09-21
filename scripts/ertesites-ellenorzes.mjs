#!/usr/bin/env node
/**
 * APN-MED — értesítés-ellenőrzés
 *
 * Miért kell:
 * A harang SZÁMA az adatbázis notification_items() függvényében dől el, a
 * LISTA viszont a lib/notifications.ts-ben. Ez a kettő némán elcsúszhat —
 * és pontosan ez történt: a szám a már lejárt tanúsítványt is vitte, a lista
 * nem; a szám hét napra előre nézte az utánkövetést, a lista egyre; a szám
 * a javítás-bejegyzéseket is számolta, a lista nem mutatta őket.
 *
 * Amit a harang számol, de a lista nem mutat, azt a felhasználó nem tudja
 * eltüntetni: beragad a jelzés. Ez a szkript ezt az elcsúszást fogja meg.
 *
 * Ellenőrzések:
 *  1. a tanúsítvány- és utánkövetés-ablak azonos a két oldalon,
 *  2. a számláló ág átadja a showAll szűrést (nem az alapértelmezettel megy),
 *  3. minden származtatott teendőnek van elnémítás-vizsgálata és törölhető jelölése,
 *  4. a törlési útvonalak (RPC-k) léteznek a migrációban és hívva vannak a kódból.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const GYOKER = process.cwd()
const olvas = (p) => readFileSync(join(GYOKER, p), 'utf8')

let hiba = 0
const rossz = (m) => { console.log(`  ✗ ${m}`); hiba++ }
const jo = (m) => console.log(`  ✓ ${m}`)

const ts = olvas('lib/notifications.ts')
const oldal = olvas('app/ertesitesek/page.tsx')
const akciok = olvas('app/ertesitesek/actions.ts')

// A legfrissebb olyan migráció, amelyik a notification_items()-et definiálja.
const migDir = join(GYOKER, 'supabase/migrations')
const migFajl = readdirSync(migDir).sort().reverse()
  .find((f) => readFileSync(join(migDir, f), 'utf8').includes('function public.notification_items'))
if (!migFajl) {
  console.log('✗ nincs notification_items() migráció')
  process.exit(1)
}
const sql = readFileSync(join(migDir, migFajl), 'utf8')

console.log(`Értesítés-ellenőrzés — ${migFajl}\n`)

/* ── 1. Azonos időablakok ── */
console.log('Időablakok:')
const tsSzam = (nev) => {
  const m = ts.match(new RegExp(`${nev}\\s*=\\s*(\\d+)`))
  return m ? Number(m[1]) : null
}
const sqlSzam = (minta) => {
  const m = sql.match(minta)
  return m ? Number(m[1]) : null
}

const certTs = tsSzam('CERT_NAPOK')
const certSql = sqlSzam(/c\.expires_on\s*<=\s*\(current_date\s*\+\s*(\d+)\)/)
if (certTs === null || certSql === null) rossz('a tanúsítvány-ablak nem olvasható ki mindkét oldalról')
else if (certTs !== certSql) rossz(`tanúsítvány-ablak eltér: TS ${certTs} nap, SQL ${certSql} nap`)
else jo(`tanúsítvány: ${certTs} nap mindkét oldalon`)

// Alsó határ: a listában sem lehet, mert az SQL-ben sincs.
if (/\.gte\('expires_on'/.test(ts)) {
  rossz('a lista alsó határt szab a tanúsítványnak, a számláló nem — a lejárt tanúsítvány beragad')
} else jo('a lejárt tanúsítvány mindkét oldalon benne van')

const fuTs = tsSzam('FOLLOWUP_NAPOK')
const fuSql = sqlSzam(/f\.due_on\s*<=\s*\(current_date\s*\+\s*(\d+)\)/)
if (fuTs === null || fuSql === null) rossz('az utánkövetés-ablak nem olvasható ki mindkét oldalról')
else if (fuTs !== fuSql) rossz(`utánkövetés-ablak eltér: TS ${fuTs} nap, SQL ${fuSql} nap`)
else jo(`utánkövetés: ${fuTs} nap mindkét oldalon`)

/* ── 2. A változásnapló szűrése egyezik ── */
console.log('\nVáltozásnapló-szűrés:')
// A számláló ágban egyik hívás sem mehet paraméter nélkül: az alapértelmezés
// „mindent mutat”, a lista viszont szűr.
const meztelen = [...ts.matchAll(/(releasesAfterVersion|changesSince)\(([^)]*)\)/g)]
  .filter((m) => !m[2].includes(','))
if (meztelen.length) {
  rossz(`${meztelen.length} hívás megy showAll nélkül: ${meztelen.map((m) => m[0]).join(', ')}`)
} else jo('minden hívás átadja a showAll szűrést')

/* ── 3. Elnémítás és törölhetőség ── */
console.log('\nSzármaztatott teendők:')
for (const [nev, elotag] of [['tanúsítvány', 'c-'], ['felülvizsgálat', 'x-'], ['utánkövetés', 'fu-']]) {
  const van = ts.includes(`nema.has(\`${elotag}`)
  van ? jo(`${nev}: elnémítás vizsgálva`) : rossz(`${nev}: nincs elnémítás-vizsgálat (${elotag}…)`)
}
const torolhetoDb = (ts.match(/torolheto: true/g) ?? []).length
if (torolhetoDb < 4) rossz(`csak ${torolhetoDb} tétel van törölhetőnek jelölve, legalább 4 kell`)
else jo(`${torolhetoDb} tétel törölhető`)

/* ── 4. Törlési útvonalak ── */
console.log('\nTörlési útvonalak:')
for (const fn of ['notification_dismiss', 'notification_clear_all']) {
  sql.includes(`function public.${fn}`) ? jo(`${fn}() létezik`) : rossz(`${fn}() hiányzik a migrációból`)
  akciok.includes(fn) ? jo(`${fn}() hívva van`) : rossz(`${fn}() nincs hívva a szerver-akciókból`)
}
oldal.includes('clearAllNotifs')
  ? jo('„Mind törlése” a felületen')
  : rossz('nincs mindent törlő gomb a felületen')
oldal.includes('deleteNotif')
  ? jo('egyedi törlés a felületen')
  : rossz('nincs egyedi törlés a felületen')

console.log(hiba === 0
  ? '\n✓ a harang száma és az értesítések listája azonos feltételekből dolgozik'
  : `\n${hiba} hiba`)
process.exit(hiba === 0 ? 0 : 1)
