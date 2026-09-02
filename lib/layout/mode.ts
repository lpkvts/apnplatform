/**
 * Megjelenítési módok.
 *
 * A platform egy alkalmazás, de több használati réteget szolgál ki. A különbség
 * nem a képernyőméretben van — az reszponzivitás —, hanem abban, hogy milyen
 * munkára készül a felület:
 *
 *   individual  · személyes klinikai használat: ágy mellett, telefonon, gyorsan
 *   teaching    · bemutatás csoportnak: nagy kijelző, kevés elem, nagy betű
 *   workspace   · adminisztratív és oktatói munka: széles felület, táblázatok
 *
 * A mód a szerepkörből és az adott oldal jellegéből adódik, nem a viewportból.
 * A viewport ettől függetlenül továbbra is számít: minden mód reszponzív marad.
 */

export type LayoutMode =
  | 'individual'    // személyes klinikai használat
  | 'workspace'     // adminisztratív munka (tartalomkezelés)
  | 'education'     // oktatói felület: oldalsó navigáció, desktop-first
  | 'teaching'      // kivetítés

/**
 * Széles elrendezést igénylő útvonalak.
 *
 * Ezek táblázatos, több paneles vagy listás munkafelületek, ahol a 720 képpontos
 * olvasási sáv szűk. A klinikai modulok szándékosan nem tartoznak ide: ott az
 * egyhasábos, olvasásra optimalizált szélesség a helyes, mert a felhasználó
 * jellemzően egyetlen dologra összpontosít.
 */
const WORKSPACE_PREFIXES = [
  '/cms',
  '/mentor/kereses',
]

/** Az oktatói felület saját móddal — oldalsó navigációval. */
const EDUCATION_PREFIX = '/oktatas'

/**
 * A megjelenítési mód.
 *
 * Az oktatói felület csak akkor kap oldalsó navigációt, ha a felhasználó
 * valóban oktató vagy intézményi adminisztrátor: a hallgató ugyanazt a
 * reszponzív, egyszerű felületet kapja, mint az egyéni használatnál. Ezt a
 * specifikáció külön kiemeli — a mobil felület ne a desktop kicsinyítése legyen.
 */
export function modeForPath(path: string, oktato = false): LayoutMode {
  if (path.startsWith(EDUCATION_PREFIX)) return oktato ? 'education' : 'individual'
  if (WORKSPACE_PREFIXES.some((p) => path.startsWith(p))) return 'workspace'
  return 'individual'
}

/** A törzsre kerülő osztály — ebből dolgozik a stíluslap. */
export const bodyClassFor = (mode: LayoutMode) =>
  mode === 'workspace' ? 'mode-workspace'
  : mode === 'education' ? 'mode-education'
  : mode === 'teaching' ? 'mode-teaching'
  : undefined
