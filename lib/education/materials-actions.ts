'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import type { MaterialKind, DataRow } from './materials'

export interface Res { ok: boolean; message: string }

export interface MaterialInput {
  id?: string
  kind: MaterialKind
  title: string
  vignette: string | null
  data: DataRow[]
  question: string | null
  answer: string | null
  module_href: string | null
  module_label: string | null
  visible: boolean
}

export async function saveMaterial(courseId: string, m: MaterialInput): Promise<Res> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Nincs bejelentkezve.' }
  if (!m.title.trim()) return { ok: false, message: 'A cím kötelező.' }

  if (m.kind === 'case' && !m.vignette?.trim()) {
    return { ok: false, message: 'Klinikai esetnél a helyzet leírása kötelező.' }
  }
  if (m.kind === 'module' && !m.module_href) {
    return { ok: false, message: 'Válaszd ki, melyik modulra mutasson.' }
  }
  if (m.kind === 'note' && !m.vignette?.trim()) {
    return { ok: false, message: 'A tananyag szövege kötelező.' }
  }

  const supabase = await createClient()
  const adat = {
    course_id: courseId,
    kind: m.kind,
    title: m.title.trim(),
    vignette: m.vignette?.trim() || null,
    // Az üres sorok kiszűrése: a szerkesztőben maradhatnak félbehagyott mezők.
    data: m.data.filter((r) => r.label.trim() && r.value.trim()),
    question: m.question?.trim() || null,
    answer: m.answer?.trim() || null,
    module_href: m.module_href,
    module_label: m.module_label,
    visible: m.visible,
    updated_at: new Date().toISOString(),
  }

  if (m.id) {
    const { error } = await supabase.from('education_materials').update(adat).eq('id', m.id)
    if (error) return { ok: false, message: error.message }
  } else {
    const { count } = await supabase
      .from('education_materials').select('id', { count: 'exact', head: true })
      .eq('course_id', courseId)
    const { error } = await supabase
      .from('education_materials').insert({ ...adat, ord: count ?? 0, created_by: user.id })
    if (error) return { ok: false, message: error.message }
  }

  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: m.id ? 'A tananyag mentve.' : 'A tananyag hozzáadva.' }
}

export async function setMaterialVisible(id: string, courseId: string, visible: boolean): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('education_materials')
    .update({ visible, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: visible ? 'Közzétéve a hallgatóknak.' : 'Elrejtve a hallgatók elől.' }
}

export async function deleteMaterial(id: string, courseId: string): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase.from('education_materials').delete().eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: 'A tananyag törölve.' }
}
