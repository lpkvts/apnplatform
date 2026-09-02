import { createClient } from '@/lib/supabase/server'
import type { MyCourse, Todo, Group } from './student'

export * from './student'

export async function getMyCoursesWithProgress(): Promise<MyCourse[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_my_courses')
  return (data as MyCourse[] | null) ?? []
}

export async function getMyTodo(): Promise<Todo[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_my_todo')
  return (data as Todo[] | null) ?? []
}

export async function getCourseGroups(courseId: string): Promise<Group[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_course_groups', { p_course: courseId })
  return (data as Group[] | null) ?? []
}
