/**
 * Színkontraszt-ellenőrzés a design tokenekre.
 *
 * Két dolgot mér. Az első a szokásos: elég kontrasztos-e a szöveg a háttérhez
 * képest. A második ritkábban vizsgált, pedig ez okozta a platformon a
 * „összefolyó szöveg" érzetét: a fő és a másodlagos szöveg TÚL közel volt
 * egymáshoz (1,7:1), ezért nem alakult ki látható rangsor.
 *
 * Futtatás: node scripts/kontraszt-ellenorzes.mjs
 */
const lum = (h) => {
  const v = h.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255)
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const kontr = (a, b) => {
  const [x, y] = [lum(a), lum(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
/** Áttetsző szín fehérre keverve — a halvány hátterekhez. */
const keverd = (hex, alpha, bg = '#FFFFFF') => {
  const n = parseInt(hex.slice(1), 16), m = parseInt(bg.slice(1), 16)
  const f = (s) => Math.round((((n >> s) & 255) * alpha) + (((m >> s) & 255) * (1 - alpha)))
  return '#' + [16, 8, 0].map((s) => f(s).toString(16).padStart(2, '0')).join('')
}
/** A felületen használt sötétítés — a lib/shortcuts.ts másolata. */
const sotetit = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  const vil = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const a = Math.min(0.62, Math.max(0.28, vil * 0.72))
  const f = (c) => Math.round(c * (1 - a)).toString(16).padStart(2, '0')
  return '#' + f(r) + f(g) + f(b)
}

const T = {
  ink: '#0F172A', muted: '#5A6A7D', faint: '#64748B',
  brand: '#0F5B46', brandDark: '#0B4635', brand2: '#147A5A', brand3: '#22A878',
  card: '#FFFFFF', bg: '#F6F8F8', brandTint: '#E7F1EC',
  ok: '#15803D', warn: '#B45309', alert: '#B91C1C',
}
const ACC = {
  akut: '#EF4444', vizsgalat: '#885CF6', betegsegtar: '#3B82F6',
  labor: '#22C55E', ekg: '#F97316', score: '#FACC15',
  vergaz: '#0EA5E9', kompterkep: '#0891B2',
}

let bukott = 0
const mer = (nev, fg, bg, min) => {
  const k = kontr(fg, bg)
  const jo = k >= min
  if (!jo) bukott++
  console.log(`  ${jo ? '✓' : '✗'} ${nev.padEnd(38)} ${k.toFixed(2).padStart(5)}:1  (min ${min})`)
}

console.log('── Szöveg a kártyán ──')
mer('fő szöveg', T.ink, T.card, 4.5)
mer('kisegítő szöveg', T.muted, T.card, 4.5)
mer('felirat, egység, referencia', T.faint, T.card, 4.5)
mer('szakaszcím', T.brandDark, T.card, 4.5)
mer('hivatkozás', T.brand, T.card, 4.5)

console.log('\n── Szöveg az oldal hátterén ──')
mer('fő szöveg', T.ink, T.bg, 4.5)
mer('kisegítő szöveg', T.muted, T.bg, 4.5)

console.log('\n── Állapotszínek ──')
mer('rendben', T.ok, T.card, 4.5)
mer('figyelendő', T.warn, T.card, 4.5)
mer('sürgős', T.alert, T.card, 4.5)

console.log('\n── Szövegszintek elválása ──')
console.log('  A fő és a másodlagos szövegnek látszania kell, hogy más rangú.')
const h1 = kontr(T.ink, T.muted), h2 = kontr(T.muted, T.faint)
console.log(`  ${h1 >= 2.5 ? '✓' : '✗'} ${'fő ↔ kisegítő'.padEnd(38)} ${h1.toFixed(2).padStart(5)}:1  (min 2.5)`)
if (h1 < 2.5) bukott++

console.log('\n── Modul-akcentusok a saját halvány hátterükön ──')
for (const [nev, c] of Object.entries(ACC)) {
  mer(nev, sotetit(c), keverd(c, 0.12), 4.5)
}

/* ── Sötét téma ── */
const D = {
  ink: '#F2F6F9', muted: '#8D9CAB', faint: '#84939F',
  card: '#1E2935', bg: '#151E28',
  brand: '#7FD3B4', brandDark: '#96DFC4',
  ok: '#4ADE80', warn: '#FBBF24', alert: '#F87171', info: '#60A5FA',
}

console.log('\n── Sötét téma: szöveg a kártyán ──')
mer('fő szöveg', D.ink, D.card, 4.5)
mer('kisegítő szöveg', D.muted, D.card, 4.5)
mer('felirat', D.faint, D.card, 4.5)
mer('márkaszín', D.brand, D.card, 4.5)
mer('szakaszcím', D.brandDark, D.card, 4.5)

console.log('\n── Sötét téma: állapotok ──')
mer('rendben', D.ok, D.card, 4.5)
mer('figyelendő', D.warn, D.card, 4.5)
mer('sürgős', D.alert, D.card, 4.5)
mer('információ', D.info, D.card, 4.5)

console.log('\n── Sötét téma: szövegszintek elválása ──')
const dh = kontr(D.ink, D.muted)
console.log(`  ${dh >= 2.5 ? '✓' : '✗'} ${'fő ↔ kisegítő'.padEnd(38)} ${dh.toFixed(2).padStart(5)}:1  (min 2.5)`)
if (dh < 2.5) bukott++

console.log('\n' + '─'.repeat(58))
console.log(bukott === 0 ? '✓ minden színpár megfelel' : `${bukott} színpár nem éri el a küszöböt`)
process.exit(bukott === 0 ? 0 : 1)
