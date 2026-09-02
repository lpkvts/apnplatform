/**
 * Hallgatói nézet — típusok.
 *
 * A haladást nem tároljuk: a tárolt érték elavulna, ha az oktató új feladatot
 * nyit meg. A számított érték mindig a pillanatnyi állapotot tükrözi.
 */

export interface MyCourse {
  id: string
  institution_id: string
  institution_name: string
  title: string
  description: string | null
  specialty: string | null
  level: string | null
  icon: string | null
  starts_on: string | null
  ends_on: string | null
  status: string
  feladatok: number
  beadott: number
  teljesitett: number
  /** Null, ha a kurzuson még nincs feladat — nincs mihez mérni. */
  haladas: number | null
  atlag: number
}

export interface Todo {
  assignment_id: string
  course_id: string
  course_title: string
  title: string
  due_at: string | null
  lejart: boolean
}

export interface Group {
  id: string
  name: string
  letszam: number
}

/** Hány nap múlva esedékes — a sürgősség jelzéséhez. */
export function napokMulva(iso: string | null): number | null {
  if (!iso) return null
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 864e5)
}
