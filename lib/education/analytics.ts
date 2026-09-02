import { createClient } from '@/lib/supabase/server'
import type {
  CompetencyStat, QuestionStat, StudentStat, CourseSummary,
} from './analytics-types'

/**
 * Csoportanalitika — szerveroldali lekérdezések.
 *
 * Mindegyik a hallgatónkénti legutolsó beadásból dolgozik: az ismételt beadás
 * célja a javítás, ezért az utolsó tükrözi a jelenlegi tudást.
 */

export * from './analytics-types'

export async function getCourseCompetencyStats(courseId: string): Promise<CompetencyStat[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_course_competencies', { p_course: courseId })
  return (data as CompetencyStat[] | null) ?? []
}

export async function getCourseQuestionStats(courseId: string): Promise<QuestionStat[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_course_questions', { p_course: courseId })
  return (data as QuestionStat[] | null) ?? []
}

export async function getCourseStudentStats(courseId: string): Promise<StudentStat[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_course_students', { p_course: courseId })
  return (data as StudentStat[] | null) ?? []
}

export async function getCourseSummary(courseId: string): Promise<CourseSummary | null> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_course_summary', { p_course: courseId })
  return (data as CourseSummary[] | null)?.[0] ?? null
}

