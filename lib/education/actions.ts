'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

/**
 * Oktatói műveletek.
 *
 * A jogosultságot az adatbázis szabályai érvényesítik (edu_can_manage), ezért
 * itt nem duplikáljuk az ellenőrzést — egy helyen tartva nem csúszhat el.
 * A visszatérő üzenet a felületnek szól.
 */

export interface Result { ok: boolean; message: string }

export async function createCourse(institutionId: string, form: FormData): Promise<Result> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Nincs bejelentkezve.' }

  const s = (k: string) => {
    const v = form.get(k)
    const t = typeof v === 'string' ? v.trim() : ''
    return t === '' ? null : t
  }
  const title = s('title')
  if (!title) return { ok: false, message: 'A kurzus neve kötelező.' }

  const starts = s('starts_on')
  const ends = s('ends_on')
  if (starts && ends && ends < starts) {
    return { ok: false, message: 'A lezárás nem lehet korábbi a kezdésnél.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education_courses')
    .insert({
      institution_id: institutionId,
      title,
      description: s('description'),
      specialty: s('specialty'),
      level: s('level'),
      icon: s('icon') ?? '📘',
      starts_on: starts,
      ends_on: ends,
      status: 'draft',
      created_by: user.id,
    })
    .select('id')
    .single<{ id: string }>()

  if (error || !data) {
    return { ok: false, message: error?.message ?? 'A kurzus létrehozása nem sikerült.' }
  }

  // Célkompetenciák hozzárendelése
  const comps = form.getAll('competency').map(String).filter(Boolean)
  if (comps.length) {
    await supabase.from('education_course_competencies').insert(
      comps.map((c) => ({ course_id: data.id, competency_id: c })),
    )
  }

  revalidatePath('/oktatas')
  redirect(`/oktatas/kurzus/${data.id}`)
}

export async function setCourseStatus(courseId: string, status: string): Promise<Result> {
  if (!['draft', 'active', 'archived'].includes(status)) {
    return { ok: false, message: 'Ismeretlen állapot.' }
  }
  const supabase = await createClient()
  const { error } = await supabase
    .from('education_courses')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', courseId)
  if (error) return { ok: false, message: error.message }

  revalidatePath(`/oktatas/kurzus/${courseId}`)
  revalidatePath('/oktatas')
  return { ok: true, message: 'Az állapot módosítva.' }
}

/** Hallgató hozzáadása e-mail cím alapján. */
export async function enrollStudent(courseId: string, form: FormData): Promise<Result> {
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  if (!email) return { ok: false, message: 'Adj meg egy e-mail címet.' }

  const supabase = await createClient()

  // A hallgatónak már regisztrálnia kellett a platformon: az oktatás a meglévő
  // fiókra épül, nem hoz létre újat. Így nem keletkezik jelszó nélküli fiók,
  // és a hallgató saját maga dönt a regisztrációról.
  const { data: prof } = await supabase.rpc('edu_find_user_by_email', { p_email: email })
  const uid = (prof as { id: string }[] | null)?.[0]?.id
  if (!uid) {
    return {
      ok: false,
      message: 'Ezzel a címmel nincs regisztrált felhasználó. Kérd meg, hogy előbb hozzon létre fiókot.',
    }
  }

  const { error } = await supabase
    .from('education_enrollments')
    .insert({ course_id: courseId, user_id: uid })
  if (error) {
    if (error.code === '23505') return { ok: false, message: 'Ez a hallgató már beiratkozott.' }
    return { ok: false, message: error.message }
  }

  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: 'A hallgató hozzáadva a kurzushoz.' }
}

export async function removeStudent(courseId: string, userId: string): Promise<Result> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('education_enrollments')
    .delete().eq('course_id', courseId).eq('user_id', userId)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: 'A hallgató eltávolítva.' }
}

/* ─────────── Csoportok ─────────── */

/**
 * Csoport létrehozása a kurzuson.
 *
 * A csoport nagyobb évfolyamnál kell: a feladat egy csoportnak is kiadható,
 * és az eredmények is csoportonként nézhetők.
 */
export async function createGroup(courseId: string, name: string): Promise<Result> {
  const n = name.trim()
  if (!n) return { ok: false, message: 'A csoport neve kötelező.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('education_groups').insert({ course_id: courseId, name: n })
  if (error) return { ok: false, message: error.message }

  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: 'A csoport létrehozva.' }
}

export async function deleteGroup(id: string, courseId: string): Promise<Result> {
  const supabase = await createClient()
  // A beiratkozások megmaradnak, csak a csoport-hozzárendelés szűnik meg:
  // a hallgató nem eshet ki a kurzusról egy csoport törlése miatt.
  const { error } = await supabase.from('education_groups').delete().eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: 'A csoport törölve. A hallgatók a kurzuson maradtak.' }
}

/** Hallgató csoportba sorolása. */
export async function setStudentGroup(
  courseId: string, userId: string, groupId: string | null,
): Promise<Result> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('education_enrollments')
    .update({ group_id: groupId })
    .eq('course_id', courseId).eq('user_id', userId)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: groupId ? 'Csoportba sorolva.' : 'Kivéve a csoportból.' }
}
