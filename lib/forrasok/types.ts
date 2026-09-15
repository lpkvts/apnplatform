/** Egy forrás a felülvizsgálati sorban. */
export interface ReviewItem {
  id: string
  title: string
  source_year: string | null
  source_url: string | null
  family: string | null
  last_checked_at: string | null
  check_note: string | null
  korkep_db: number
  kor_ev: number | null
  ellenorzes_ota_nap: number | null
  surgosseg: number
  kereses: {
    kiado: string
    hol: string
    tipp: string
  }
}

/**
 * A sürgősség szöveges besorolása.
 *
 * A pontszám önmagában nem mond semmit a szerkesztőnek; a besorolás viszont
 * megmondja, mivel kezdje.
 */
export function surgossegSav(pont: number): {
  cimke: string
  szin: 'ok' | 'fig' | 'krit'
} {
  if (pont >= 12) return { cimke: 'Sürgős', szin: 'krit' }
  if (pont >= 6) return { cimke: 'Esedékes', szin: 'fig' }
  return { cimke: 'Ráér', szin: 'ok' }
}
