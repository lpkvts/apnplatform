/**
 * Feladatok — típusok és közös segédek.
 *
 * Külön a lekérdezésektől, mert a kliensoldali szerkesztő és kitöltő is
 * használja: ha egy fájlban lennének, a böngészőbe kerülő kód magával hozná
 * a szerveroldali adatbázis-hozzáférést.
 */

export type QKind = 'single' | 'multi' | 'truefalse' | 'short'

export const QKIND_LABEL: Record<QKind, string> = {
  single: 'Egy helyes válasz',
  multi: 'Több helyes válasz',
  truefalse: 'Igaz / hamis',
  short: 'Rövid szöveges válasz',
}

export const QKIND_HINT: Record<QKind, string> = {
  single: 'A hallgató egyet választ a felsoroltak közül.',
  multi: 'Több válasz is helyes. Pont csak akkor jár, ha pontosan a helyes halmazt jelöli meg — a hiányzó felismerés ugyanúgy hiba, mint a téves.',
  truefalse: 'Két lehetőség: igaz vagy hamis.',
  short: 'A hallgató beír egy szót vagy rövid kifejezést. Add meg az elfogadható alakokat; a kis- és nagybetű nem számít.',
}

export type Status = 'draft' | 'open' | 'closed'

export const STATUS_LABEL: Record<Status, string> = {
  draft: 'Piszkozat',
  open: 'Megnyitva',
  closed: 'Lezárva',
}

export interface Option {
  id: string
  label: string
  correct?: boolean
}

export interface Question {
  id: string
  ord: number
  kind: QKind
  prompt: string
  options: Option[]
  accepted: string[]
  points: number
  explanation: string | null
  competency_id: string | null
}

/** A hallgatónak kiadott alak: a helyes válasz nélkül. */
export interface StudentQuestion {
  id: string
  ord: number
  kind: QKind
  prompt: string
  options: { id: string; label: string }[]
  points: number
}

export interface Assignment {
  id: string
  course_id: string
  title: string
  description: string | null
  due_at: string | null
  max_attempts: number | null
  pass_pct: number
  show_answers: boolean
  status: Status
  created_at: string
}

export interface Submission {
  id: string
  assignment_id: string
  attempt: number
  score: number
  max_score: number
  pct: number
  passed: boolean
  feedback: string | null
  submitted_at: string
}

export interface Result {
  user_id: string
  full_name: string | null
  attempt: number
  score: number
  max_score: number
  pct: number
  passed: boolean
  submitted_at: string
  feedback: string | null
}

/** Lejárt-e a határidő. */
export const lejart = (a: Assignment) =>
  !!a.due_at && new Date(a.due_at).getTime() < Date.now()

/** A feladat teljes pontszáma a kérdésekből. */
export const osszPont = (qs: { points: number }[]) =>
  qs.reduce((n, q) => n + q.points, 0)
