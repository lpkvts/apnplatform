/**
 * Tananyagok — típusok és a hivatkozható modulok.
 *
 * Külön a lekérdezésektől, mert a kliensoldali szerkesztő is használja.
 */

export type MaterialKind = 'case' | 'note' | 'module'

export const KIND_LABEL: Record<MaterialKind, string> = {
  case: 'Klinikai eset',
  note: 'Tananyag',
  module: 'Modulhivatkozás',
}

export const KIND_HINT: Record<MaterialKind, string> = {
  case: 'Klinikai helyzet betegadatokkal és kérdéssel. Kivetíthető, a megoldást te mutatod meg.',
  note: 'Szöveges összefoglaló vagy jegyzet a kurzushoz.',
  module: 'Hivatkozás a platform saját eszközére — a hallgató ugyanazt használja, mint a napi munkában.',
}

export interface DataRow {
  label: string
  value: string
  /** Eltérés jelölése: kivetítve így egy pillantással látszik, mi a kóros. */
  flag?: 'high' | 'low'
}

export interface Material {
  id: string
  course_id: string
  kind: MaterialKind
  title: string
  ord: number
  vignette: string | null
  data: DataRow[]
  question: string | null
  answer: string | null
  module_href: string | null
  module_label: string | null
  visible: boolean
}

/** A hallgatói alak: megoldás és láthatóság nélkül. */
export type StudentMaterial = Omit<Material, 'answer' | 'visible' | 'course_id'>

/**
 * A platform hivatkozható moduljai.
 *
 * Ezek a meglévő klinikai eszközök — az oktatási tartalom rájuk mutat, nem
 * másolja őket. Így az esethez tartozó pontozó ugyanaz, amit a hallgató a
 * napi munkában is használ.
 */
export const MODULES = [
  { href: '/klinika/tesztek', label: 'Klinikai skálák (Score Hub)' },
  { href: '/klinika/vergaz', label: 'Vérgázelemzés' },
  { href: '/klinika/ekg', label: 'EKG modul' },
  { href: '/klinika/ekg/elemzes', label: 'EKG elemzés — esetek' },
  { href: '/klinika/labor', label: 'Labor Kisokos' },
  { href: '/klinika/vizsgalat', label: 'Betegvizsgálat' },
  { href: '/betegsegtar', label: 'Betegségtár' },
  { href: '/kompetenciaterkep', label: 'APN Kompetenciatérkép' },
] as const
