/**
 * Forrás korának megítélése.
 *
 * Az öt évnél régebbi szakmai forrás nem feltétlenül elavult — vannak
 * területek, ahol évtizedekig nem születik új ajánlás. Ha viszont van
 * frissebb, azt kell használni, ezért a kort láthatóvá tesszük.
 *
 * A jelölés tájékoztat, nem minősít: a „régebbi" nem azt jelenti, hogy
 * hibás, hanem azt, hogy érdemes ellenőrizni, megjelent-e azóta újabb.
 */

export type ForrasKor = 'friss' | 'regebbi' | 'ismeretlen'

export const KOR_LABEL: Record<ForrasKor, string> = {
  friss: 'Öt éven belüli',
  regebbi: 'Öt évnél régebbi',
  ismeretlen: 'Nincs évszám',
}

/** Ez alatt tekintjük frissnek a forrást. */
export const HATAR_EV = 5

/**
 * Évszám kinyerése a verzió- vagy címmezőből.
 *
 * A források évszáma több helyen szerepelhet: külön mezőben, a címben
 * („2021 ESC Guidelines…"), vagy zárójelben. Mindhármat megnézzük.
 */
export function evbol(...mezok: (string | null | undefined)[]): number | null {
  for (const m of mezok) {
    if (!m) continue
    // Négyjegyű évszám 1990 és a jelen között — a nagyobb számok
    // jellemzően oldalszámok vagy azonosítók.
    const talalat = [...m.matchAll(/\b(19[9]\d|20[0-4]\d)\b/g)]
      .map((x) => Number(x[1]))
      .filter((x) => x <= new Date().getFullYear())
    if (talalat.length) return Math.max(...talalat)
  }
  return null
}

export function forrasKor(ev: number | null): ForrasKor {
  if (ev === null) return 'ismeretlen'
  return new Date().getFullYear() - ev <= HATAR_EV ? 'friss' : 'regebbi'
}

/** Hány éves a forrás. */
export function evekSzama(ev: number | null): number | null {
  return ev === null ? null : new Date().getFullYear() - ev
}
