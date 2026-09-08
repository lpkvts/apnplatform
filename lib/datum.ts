/**
 * Dátumkezelés — naptári napok.
 *
 * A gyakori hiba, hogy a napok különbségét eltelt ezredmásodpercekből
 * számoljuk. Az így kapott szám nem naptári napokat ad, hanem huszonnégy
 * órás időszakokat: aki tegnap este tizenegykor regisztrált, ma reggel
 * tízkor még „ma” lenne, mert csak tizenegy óra telt el.
 *
 * Az itt lévő függvények a naptári napot nézik, a helyi időzóna szerint.
 */

/** Egy időpont naptári napjának kezdete, helyi idő szerint. */
function napKezdete(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/**
 * Hány naptári nappal ezelőtt volt.
 *
 * A mai nap 0, a tegnapi 1 — függetlenül attól, hány óra telt el.
 */
export function napokEzelott(iso: string | Date): number {
  const akkor = typeof iso === 'string' ? new Date(iso) : iso
  return Math.round((napKezdete(new Date()) - napKezdete(akkor)) / 864e5)
}

/**
 * Olvasható megnevezés múltbeli időpontra.
 *
 * Egy hétnél régebbi eseménynél a dátum többet mond, mint a napok száma:
 * a „tizenhét napja” nehezebben helyezhető el, mint egy konkrét nap.
 */
export function mikorVolt(iso: string | Date): string {
  const n = napokEzelott(iso)
  if (n <= 0) return 'ma'
  if (n === 1) return 'tegnap'
  if (n < 7) return `${n} napja`
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Hány naptári nap múlva esedékes.
 *
 * A mai határidő 0, a holnapi 1. A múltbeli negatív számot ad.
 */
export function napokMulva(iso: string | Date): number {
  const akkor = typeof iso === 'string' ? new Date(iso) : iso
  return Math.round((napKezdete(akkor) - napKezdete(new Date())) / 864e5)
}
