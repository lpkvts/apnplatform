/**
 * APN World — típusok és címkék.
 *
 * Külön a lekérdezésektől, mert a kliensoldali nézetek is használják.
 */

export type Status = 'established' | 'developing' | 'emerging' | 'limited'
export type Confidence = 'high' | 'moderate' | 'limited'
export type Region = 'europe' | 'north_america' | 'south_america' | 'asia' | 'africa' | 'oceania'
export type Prescribing = 'none' | 'limited' | 'conditional' | 'broad' | 'independent' | 'unknown'
export type Autonomy = 'low' | 'moderate' | 'high' | 'unknown'
export type PrimaryCare = 'low' | 'moderate' | 'high' | 'very_high' | 'unknown'
export type ScopeValue = 'yes' | 'conditional' | 'no' | 'unknown'
export type ScopeLevel = 'national' | 'regional' | 'institutional' | 'conditional'

export const STATUS_LABEL: Record<Status, string> = {
  established: 'Kiépült rendszer',
  developing: 'Épülő rendszer',
  emerging: 'Induló szakasz',
  limited: 'Kevés adat',
}

export const STATUS_HINT: Record<Status, string> = {
  established: 'Önálló jogszabályi keret, védett cím, kiépült képzési út.',
  developing: 'Van jogi alap, de a hatáskör vagy a képzés még alakul.',
  emerging: 'A szerepkör létezik vagy készül, a szabályozás hiányos.',
  limited: 'Nem áll rendelkezésre elegendő megbízható adat.',
}

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: 'Megbízható adat',
  moderate: 'Részben megbízható',
  limited: 'Hiányos adat',
}

export const REGION_LABEL: Record<Region, string> = {
  europe: 'Európa',
  north_america: 'Észak-Amerika',
  south_america: 'Dél-Amerika',
  asia: 'Ázsia',
  africa: 'Afrika',
  oceania: 'Óceánia',
}

/**
 * Gyógyszerfelírás — öt fokozat.
 *
 * Az igen/nem megkülönböztetés félrevezető lenne: a jogosultság terjedelme
 * országonként gyökeresen eltér.
 */
export const PRESCRIBING_LABEL: Record<Prescribing, string> = {
  none: 'Nincs',
  limited: 'Korlátozott',
  conditional: 'Feltételes',
  broad: 'Széles körű',
  independent: 'Önálló',
  unknown: 'Nincs elég adat',
}

export const AUTONOMY_LABEL: Record<Autonomy, string> = {
  low: 'Alacsony', moderate: 'Közepes', high: 'Magas', unknown: 'Nincs elég adat',
}

export const PRIMARY_CARE_LABEL: Record<PrimaryCare, string> = {
  low: 'Alacsony', moderate: 'Közepes', high: 'Jelentős', very_high: 'Meghatározó',
  unknown: 'Nincs elég adat',
}

/** A tizennégy hatásköri dimenzió, a vizsgálat sorrendjében. */
export const SCOPE_DIMS = [
  { key: 'assessment', label: 'Állapotfelmérés' },
  { key: 'physical_exam', label: 'Fizikális vizsgálat' },
  { key: 'diagnosis', label: 'Diagnózis felállítása' },
  { key: 'differential', label: 'Elkülönítő kórisme' },
  { key: 'labs', label: 'Laborvizsgálat rendelése' },
  { key: 'imaging', label: 'Képalkotás rendelése' },
  { key: 'interpretation', label: 'Eredmények értelmezése' },
  { key: 'treatment_init', label: 'Kezelés megkezdése' },
  { key: 'treatment_mod', label: 'Kezelés módosítása' },
  { key: 'prescribing', label: 'Gyógyszerrendelés' },
  { key: 'referral', label: 'Beutalás' },
  { key: 'admission', label: 'Felvétel' },
  { key: 'discharge', label: 'Elbocsátás' },
  { key: 'independent', label: 'Önálló betegellátás' },
] as const

export const SCOPE_JEL: Record<ScopeValue, string> = {
  yes: '✓', conditional: '◐', no: '✕', unknown: '—',
}

export const SCOPE_LABEL: Record<ScopeValue, string> = {
  yes: 'Igen', conditional: 'Feltételesen', no: 'Nem', unknown: 'Nincs elég adat',
}

export const SCOPE_LEVEL_LABEL: Record<ScopeLevel, string> = {
  national: 'Országos szabályozás',
  regional: 'Területi vagy tagállami szabályozás',
  institutional: 'Intézményi hatáskör',
  conditional: 'Feltételhez kötött',
}

export interface ScopeItem {
  v: ScopeValue
  scope?: ScopeLevel
  note?: string
}

export interface Role { name: string; abbr?: string; note?: string }

export interface Country {
  id: string
  code: string
  name: string
  name_en: string | null
  flag: string | null
  region: Region
  status: Status
  data_confidence: Confidence
  roles: Role[]
  education: Record<string, unknown>
  regulation: Record<string, unknown>
  scope: Record<string, ScopeItem>
  prescribing: Prescribing
  prescribing_note: string | null
  autonomy: Autonomy
  autonomy_note: string | null
  primary_care: PrimaryCare
  primary_care_areas: string[]
  hospital_areas: string[]
  strengths: string[]
  challenges: string[]
  description: string | null
  why_interesting: string | null
  publish_status: string
  last_verified: string | null
}

export interface Source {
  id: string
  country_id: string | null
  model_id: string | null
  title: string
  org: string | null
  url: string | null
  accessed_on: string | null
}

export interface TimelineItem {
  id: string
  period: string
  title: string
  description: string | null
  ord: number
}

export interface Summary {
  orszagok: number
  modellek: number
  magas_bizonyossag: number
  onallo_feliras: number
  mesterfokozat: number
  forrasok: number
}

/** Ékezet-tűrő keresés. */
const fold = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function filterCountries(
  lista: Country[],
  f: { q?: string; region?: Region | ''; status?: Status | ''
       prescribing?: Prescribing | ''; autonomy?: Autonomy | '' },
): Country[] {
  return lista.filter((c) => {
    if (f.region && c.region !== f.region) return false
    if (f.status && c.status !== f.status) return false
    if (f.prescribing && c.prescribing !== f.prescribing) return false
    if (f.autonomy && c.autonomy !== f.autonomy) return false
    if (f.q && f.q.trim().length >= 2) {
      const hay = fold([
        c.name, c.name_en, c.description, c.why_interesting,
        ...c.roles.map((r) => `${r.name} ${r.abbr ?? ''}`),
        ...c.primary_care_areas, ...c.hospital_areas,
      ].filter(Boolean).join(' '))
      if (!hay.includes(fold(f.q.trim()))) return false
    }
    return true
  })
}
