import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import type { Assignment, Question, StudentQuestion, Submission, Result } from './assignments'

export * from './assignments'

/** A kurzus feladatai. Oktatónak a piszkozatok is látszanak. */
export async function getAssignments(courseId: string): Promise<Assignment[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_assignments')
    .select('id, course_id, title, description, due_at, max_attempts, pass_pct, show_answers, status, created_at')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })
    .returns<Assignment[]>()
  return data ?? []
}

export async function getAssignment(id: string): Promise<Assignment | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_assignments')
    .select('id, course_id, title, description, due_at, max_attempts, pass_pct, show_answers, status, created_at')
    .eq('id', id)
    .maybeSingle<Assignment>()
  return data
}

/** A kérdések a helyes válaszokkal — csak oktatónak adja vissza a szabály. */
export async function getQuestions(assignmentId: string): Promise<Question[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_questions')
    .select('id, ord, kind, prompt, options, accepted, points, explanation, competency_id')
    .eq('assignment_id', assignmentId)
    .order('ord')
    .returns<Question[]>()
  return data ?? []
}

/** A kérdések a hallgatónak: a megoldás nélkül. */
export async function getStudentQuestions(assignmentId: string): Promise<StudentQuestion[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_questions_for_student', { p_assignment: assignmentId })
  return (data as StudentQuestion[] | null) ?? []
}

/** A felhasználó beadásai egy feladatra, legutóbbi elöl. */
export async function getMySubmissions(assignmentId: string): Promise<Submission[]> {
  const user = await getCurrentUser()
  if (!user) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_submissions')
    .select('id, assignment_id, attempt, score, max_score, pct, passed, feedback, submitted_at')
    .eq('assignment_id', assignmentId)
    .eq('user_id', user.id)
    .order('attempt', { ascending: false })
    .returns<Submission[]>()
  return data ?? []
}

/** Egy feladat eredményei hallgatónként — oktatói nézet. */
export async function getResults(assignmentId: string): Promise<Result[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_assignment_results', { p_assignment: assignmentId })
  return (data as Result[] | null) ?? []
}
