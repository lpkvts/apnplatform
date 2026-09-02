import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import type {
  Membership, Course, EnrolledCourse, CourseStudent, CompetencyOption, InstructorSummary,
} from './types'

/**
 * Oktatói mód — szerveroldali lekérdezések.
 *
 * A típusok és a címkék a types.ts fájlban vannak, hogy a kliensoldali
 * komponensek is elérjék őket.
 */

export * from './types'

/* ─────────── Tagságok ─────────── */

/** A felhasználó összes oktatási tagsága, intézményekkel együtt. */
export const getMemberships = cache(async (): Promise<Membership[]> => {
  const user = await getCurrentUser()
  if (!user) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_members')
    .select('institution_id, role, institution:education_institutions(id, name, short_name)')
    .eq('user_id', user.id)
    .returns<Membership[]>()
  return data ?? []
})

/** Az a tagság, ahol oktatóként vagy adminként léphet fel. Ha több van, az első. */
export const getTeachingMembership = cache(async (): Promise<Membership | null> => {
  const all = await getMemberships()
  return all.find((m) => m.role === 'instructor' || m.role === 'admin') ?? null
})

/* ─────────── Kurzusok ─────────── */

/** Az intézmény kurzusai — oktatói nézethez. */
export async function getCourses(institutionId: string): Promise<Course[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_courses')
    .select('id, institution_id, title, description, specialty, level, icon, starts_on, ends_on, status, created_at')
    .eq('institution_id', institutionId)
    .order('created_at', { ascending: false })
    .returns<Course[]>()
  return data ?? []
}


/** A hallgató saját kurzusai. */
export async function getMyCourses(): Promise<EnrolledCourse[]> {
  const user = await getCurrentUser()
  if (!user) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_enrollments')
    .select('progress_pct, status, course:education_courses(id, institution_id, title, description, specialty, level, icon, starts_on, ends_on, status, created_at)')
    .eq('user_id', user.id)
    .neq('status', 'dropped')
    .returns<{ progress_pct: number; status: string; course: Course }[]>()

  return (data ?? [])
    .filter((r) => r.course)
    .map((r) => ({ ...r.course, progress_pct: r.progress_pct, enrollment_status: r.status }))
}

export async function getCourse(id: string): Promise<Course | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_courses')
    .select('id, institution_id, title, description, specialty, level, icon, starts_on, ends_on, status, created_at')
    .eq('id', id)
    .maybeSingle<Course>()
  return data
}

/** Beiratkozottak egy kurzusra, névvel — oktatói nézethez. */

export async function getCourseStudents(courseId: string): Promise<CourseStudent[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_enrollments')
    .select('user_id, progress_pct, status, group_id, profile:profiles(full_name)')
    .eq('course_id', courseId)
    .returns<CourseStudent[]>()
  return data ?? []
}

/* ─────────── Áttekintés ─────────── */


export async function getInstructorSummary(institutionId: string): Promise<InstructorSummary | null> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_instructor_summary', { p_institution: institutionId })
  return (data as InstructorSummary[] | null)?.[0] ?? null
}

/* ─────────── Kompetenciák ─────────── */

export const getCompetencies = cache(async (): Promise<CompetencyOption[]> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('competencies').select('id, code, name, domain').order('sort_order')
    .returns<CompetencyOption[]>()
  return data ?? []
})

export async function getCourseCompetencies(courseId: string): Promise<CompetencyOption[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_course_competencies')
    .select('competency:competencies(id, code, name, domain)')
    .eq('course_id', courseId)
    .returns<{ competency: CompetencyOption }[]>()
  return (data ?? []).map((r) => r.competency).filter(Boolean)
}
