/**
 * Csoportanalitika — típusok és küszöbök.
 *
 * Külön fájlban, mert a kliensoldali nézet is importálja őket. Ha a
 * lekérdezésekkel egy helyen lennének, a böngészőbe kerülő kód magával hozná
 * a szerveroldali adatbázis-hozzáférést.
 */

export interface CompetencyStat {
  competency_id: string
  code: string
  name: string
  domain: string | null
  valaszok: number
  helyes: number
  pct: number
  hallgatok: number
}

export interface QuestionStat {
  question_id: string
  assignment_id: string
  assignment_title: string
  prompt: string
  kind: string
  points: number
  valaszok: number
  helyes: number
  pct: number
  competency_name: string | null
}

export interface StudentStat {
  user_id: string
  full_name: string | null
  beadott: number
  osszes_feladat: number
  atlag: number
  teljesitett: number
  utolso_beadas: string | null
}

export interface CourseSummary {
  hallgatok: number
  feladatok: number
  beadasok: number
  atlag: number
  besorolatlan_kerdes: number
}

/** A gyenge teljesítés küszöbe — ez alatt érdemes visszatérni a témára. */
export const GYENGE = 60
