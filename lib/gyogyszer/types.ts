/**
 * Gyógyszertár — típusok.
 *
 * A modul hatóanyag-központú: a készítménynevek országonként és gyártónként
 * eltérnek, a hatóanyag viszont állandó.
 */

export interface DrugGroup {
  id: string
  slug: string
  name: string
  atc: string | null
  parent_id: string | null
  short: string | null
  description: string | null
  /** Mit takar a megnevezés — a név jellemzően a szerkezetre vagy a hatás
      helyére utal, és ebből következik a hatásmód is. */
  name_meaning: string | null
  key_points: string[]
  apn_notes: string[]
  icon: string | null
  ord: number
}

export interface Antibiotic {
  substance_id: string
  spectrum: string[]
  spectrum_gaps: string[]
  action: string | null
  resistance: string | null
  stewardship: string[]
  narrower_option: string | null
}

export interface Substance {
  id: string
  slug: string
  name: string
  name_intl: string | null
  atc: string | null
  group_id: string | null
  mechanism: string | null
  indications: string[]
  contraindications: string[]
  apn_focus: string[]
  adverse: string[]
  interactions: string[]
  organ_note: string | null
  monitoring: string[]
  pregnancy: string | null
  pitfalls: string[]
  spc_url: string | null
  source_note: string | null
  last_verified: string | null
}

export interface DrugSummary {
  csoportok: number
  hatoanyagok: number
  antibiotikumok: number
  ellenorzott: number
}

/** Ékezet-tűrő keresés hatóanyagnévre, ATC-kódra és javallatra. */
const fold = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function filterSubstances(lista: Substance[], q: string): Substance[] {
  if (q.trim().length < 2) return lista
  const k = fold(q.trim())
  return lista.filter((s) =>
    fold([
      s.name, s.name_intl, s.atc, s.mechanism,
      ...s.indications, ...s.apn_focus,
    ].filter(Boolean).join(' ')).includes(k))
}
