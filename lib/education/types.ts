/**
 * Oktatói mód — típusok és címkék.
 *
 * Külön fájlban, mert a kliensoldali komponensek is importálják őket. Ha a
 * lekérdezésekkel egy helyen lennének, a böngészőbe kerülő kód magával hozná
 * a szerveroldali adatbázis-hozzáférést.
 */

export type EduRole = 'student' | 'instructor' | 'admin'

export const EDU_ROLE_LABEL: Record<EduRole, string> = {
  student: 'Hallgató',
  instructor: 'Oktató',
  admin: 'Intézményi adminisztrátor',
}

export interface Institution {
  id: string
  name: string
  short_name: string | null
}

export interface Membership {
  institution_id: string
  role: EduRole
  institution: Institution
}

export interface Course {
  id: string
  institution_id: string
  title: string
  description: string | null
  specialty: string | null
  level: string | null
  icon: string | null
  starts_on: string | null
  ends_on: string | null
  status: 'draft' | 'active' | 'archived'
  created_at: string
}

export const COURSE_STATUS_LABEL: Record<Course['status'], string> = {
  draft: 'Piszkozat',
  active: 'Aktív',
  archived: 'Lezárt',
}

export interface CompetencyOption {
  id: string
  code: string
  name: string
  domain: string | null
}

export interface EnrolledCourse extends Course {
  progress_pct: number
  enrollment_status: string
}

export interface InstructorSummary {
  students: number
  courses_active: number
  enrollments: number
  avg_progress: number
}

export interface CourseStudent {
  user_id: string
  progress_pct: number
  status: string
  group_id: string | null
  profile: { full_name: string | null } | null
}
