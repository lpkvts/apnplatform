'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { MAX_BYTES, ALLOWED, tisztitNev } from './files'

export interface Res { ok: boolean; message: string }

/**
 * Fájl feltöltése a kurzushoz.
 *
 * A tárolóban a kurzus azonosítója az első könyvtárszint — ebből derül ki,
 * melyik kurzushoz tartozik a fájl, és erre épül a jogosultság-ellenőrzés is.
 */
export async function uploadCourseFile(courseId: string, form: FormData): Promise<Res> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Nincs bejelentkezve.' }

  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: 'Válassz ki egy fájlt.' }
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: 'A fájl túl nagy: legfeljebb 20 MB tölthető fel.' }
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return { ok: false, message: 'Ez a fájltípus nem tölthető fel.' }
  }

  const supabase = await createClient()

  // Az időbélyeg megakadályozza, hogy az azonos nevű fájlok felülírják egymást.
  const path = `${courseId}/${Date.now()}-${tisztitNev(file.name)}`
  const { error: feltoltes } = await supabase.storage
    .from('kurzus-fajlok')
    .upload(path, file, { contentType: file.type || undefined, upsert: false })

  if (feltoltes) return { ok: false, message: `A feltöltés nem sikerült: ${feltoltes.message}` }

  const { error } = await supabase.from('education_files').insert({
    course_id: courseId,
    path,
    name: file.name,
    mime: file.type || null,
    size_bytes: file.size,
    description: (form.get('description') as string | null)?.trim() || null,
    visible: form.get('visible') !== 'off',
    uploaded_by: user.id,
  })

  if (error) {
    // A nyilvántartás nélküli fájl árva maradna a tárolóban.
    await supabase.storage.from('kurzus-fajlok').remove([path])
    return { ok: false, message: error.message }
  }

  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: 'A fájl feltöltve.' }
}

export async function setFileVisible(
  id: string, courseId: string, visible: boolean,
): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase.from('education_files').update({ visible }).eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: visible ? 'Látható a hallgatóknak.' : 'Elrejtve.' }
}

export async function deleteCourseFile(
  id: string, courseId: string, path: string,
): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase.from('education_files').delete().eq('id', id)
  if (error) return { ok: false, message: error.message }
  // A tárolóból is töröljük, különben helyet foglalna feleslegesen.
  await supabase.storage.from('kurzus-fajlok').remove([path])
  revalidatePath(`/oktatas/kurzus/${courseId}`)
  return { ok: true, message: 'A fájl törölve.' }
}

/* ─────────── Kurzus szerkesztése ─────────── */

/**
 * A kurzus alapadatainak módosítása.
 *
 * Menet közben is szerkeszthető: a cím, a leírás és a besorolás változhat,
 * miközben a kurzus fut. A hallgatók és a feladatok érintetlenek maradnak.
 */
export async function updateCourse(courseId: string, form: FormData): Promise<Res> {
  const t = (k: string) => {
    const v = form.get(k)
    const s = typeof v === 'string' ? v.trim() : ''
    return s === '' ? null : s
  }

  const title = t('title')
  if (!title) return { ok: false, message: 'A kurzus címe kötelező.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('education_courses')
    .update({
      title,
      description: t('description'),
      specialty: t('specialty'),
      level: t('level'),
      icon: t('icon'),
      starts_on: t('starts_on'),
      ends_on: t('ends_on'),
      updated_at: new Date().toISOString(),
    })
    .eq('id', courseId)

  if (error) return { ok: false, message: error.message }

  revalidatePath(`/oktatas/kurzus/${courseId}`)
  revalidatePath('/oktatas')
  return { ok: true, message: 'A kurzus adatai mentve.' }
}
