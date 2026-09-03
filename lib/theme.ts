/**
 * Megjelenési téma.
 *
 * Négy beállítás, de a felület mindig konkrét értéket kap: a döntést a
 * böngészőben futó kód hozza meg, és a `data-theme` attribútumba írja.
 * Így a stíluslapnak nem kell a rendszerbeállítást és a napszakot külön
 * kezelnie — elég egyetlen szelektor.
 */

export type ThemeMode = 'light' | 'dark' | 'system' | 'auto'

export const THEME_LABEL: Record<ThemeMode, string> = {
  light: 'Világos',
  dark: 'Sötét',
  system: 'Rendszer szerint',
  auto: 'Napszak szerint',
}

export const THEME_HINT: Record<ThemeMode, string> = {
  light: 'Mindig világos felület.',
  dark: 'Mindig sötét felület.',
  system: 'A készülék beállítását követi.',
  auto: 'Este nyolc és reggel hat között sötét — éjszakai műszakban kíméletesebb.',
}

export const THEME_KEY = 'apnmed-theme'

/** Este nyolc és reggel hat között sötét. */
export function ejszaka(most = new Date()): boolean {
  const ora = most.getHours()
  return ora >= 20 || ora < 6
}

/** A beállításból a tényleges téma. */
export function resolveTheme(mode: ThemeMode, sotetRendszer: boolean): 'light' | 'dark' {
  if (mode === 'light' || mode === 'dark') return mode
  if (mode === 'auto') return ejszaka() ? 'dark' : 'light'
  return sotetRendszer ? 'dark' : 'light'
}
