/**
 * Közreműködők — típusok és megnevezések.
 *
 * A szerepek megnevezését a kód oldalán tartjuk, hogy a fordítás és a
 * sorrend egy helyen legyen.
 */

export type ContributorRole =
  | 'lektor' | 'szakerto' | 'szerzo' | 'fejleszto' | 'tanacsado' | 'tesztelo'

export const ROLE_LABEL: Record<ContributorRole, string> = {
  lektor: 'Szakmai lektor',
  szakerto: 'Szakértő',
  szerzo: 'Szerző',
  fejleszto: 'Fejlesztő',
  tanacsado: 'Tanácsadó',
  tesztelo: 'Tesztelő',
}

/** A szerepek megjelenítési sorrendje a csoportosított nézetben. */
export const ROLE_ORDER: ContributorRole[] = [
  'lektor', 'szakerto', 'szerzo', 'tanacsado', 'fejleszto', 'tesztelo',
]

export const ROLE_HINT: Record<ContributorRole, string> = {
  lektor: 'Szakmai tartalom ellenőrzése, pontosítása.',
  szakerto: 'Konzultáció, szakmai kérdések tisztázása.',
  szerzo: 'Tartalom írása.',
  fejleszto: 'A platform fejlesztése.',
  tanacsado: 'Szakmai irány, koncepció.',
  tesztelo: 'Visszajelzések a fejlesztés során.',
}

export interface Contributor {
  id: string
  name: string
  title: string | null
  organization: string | null
  roles: ContributorRole[]
  specialties: string[]
  note: string | null
  ord: number
  featured: boolean
  publish_status: 'draft' | 'published'
}

/** A megjelenő teljes név: titulus és név együtt. */
export function teljesNev(c: Contributor): string {
  return c.title ? `${c.title} ${c.name}` : c.name
}
