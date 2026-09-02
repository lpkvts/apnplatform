import { createClient } from '@/lib/supabase/server'
import type { Material, StudentMaterial } from './materials'

export * from './materials'

/** A kurzus tananyagai. Oktatónak az előkészítés alatt lévők is látszanak. */
export async function getMaterials(courseId: string): Promise<Material[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('education_materials')
    .select('id, course_id, kind, title, ord, vignette, data, question, answer, module_href, module_label, visible')
    .eq('course_id', courseId)
    .order('ord')
    .returns<Material[]>()
  return data ?? []
}

/** A közzétett tananyagok a hallgatónak — megoldás nélkül. */
export async function getStudentMaterials(courseId: string): Promise<StudentMaterial[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_materials_for_student', { p_course: courseId })
  return (data as StudentMaterial[] | null) ?? []
}
