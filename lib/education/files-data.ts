import { createClient } from '@/lib/supabase/server'
import type { CourseFile } from './files'

export * from './files'

/** A kurzus fájljai. Oktatónak a rejtettek is látszanak. */
export async function getCourseFiles(courseId: string): Promise<CourseFile[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_files')
    .select('id, course_id, path, name, mime, size_bytes, description, visible, created_at')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false })
    .returns<CourseFile[]>()
  return data ?? []
}

/**
 * Letöltési hivatkozás.
 *
 * Rövid élettartamú, aláírt cím: a tároló nem nyilvános, ezért a fájl csak
 * ezen keresztül érhető el. A jogosultságot a tároló szabálya érvényesíti.
 */
export async function fileUrl(path: string): Promise<string | null> {
  const supabase = await createClient()
  const { data } = await supabase.storage
    .from('kurzus-fajlok')
    .createSignedUrl(path, 60 * 10)
  return data?.signedUrl ?? null
}
