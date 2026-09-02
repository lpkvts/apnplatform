'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { TOPICS, FORMATS, SPECIALTIES, type Status } from './types'

/**
 * Mentorprogram — műveletek.
 *
 * A jogosultságot az adatbázis szabályai és a trigger érvényesítik: a
 * felhasználó nem állíthatja saját magát jóváhagyottra, és a jóváhagyott
 * profil tartalmi módosítása után visszakerül elbírálásra.
 */

export interface Result { ok: boolean; message: string }

const tisztit = (v: FormDataEntryValue | null) => {
  const t = typeof v === 'string' ? v.trim() : ''
  return t === '' ? null : t
}

/** Csak az előre meghatározott készletből fogadunk el értékeket. */
const szur = (be: string[], keszlet: readonly string[]) => be.filter((x) => keszlet.includes(x))

export async function saveMentorProfile(form: FormData): Promise<Result> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Nincs bejelentkezve.' }

  const specialty = tisztit(form.get('specialty'))
  if (!specialty || !SPECIALTIES.includes(specialty as typeof SPECIALTIES[number])) {
    return { ok: false, message: 'Válassz szakterületet.' }
  }

  const topics = szur(form.getAll('topics').map(String), TOPICS)
  if (topics.length === 0) {
    return { ok: false, message: 'Adj meg legalább egy mentorálási témát.' }
  }

  const formats = szur(form.getAll('formats').map(String), FORMATS)
  if (formats.length === 0) {
    return { ok: false, message: 'Jelöld meg, milyen formában vállalsz mentorálást.' }
  }

  const bio = tisztit(form.get('bio'))
  if (!bio || bio.length < 40) {
    return { ok: false, message: 'A bemutatkozás legalább 40 karakter legyen — ez alapján keresnek majd.' }
  }

  const evekRaw = tisztit(form.get('experience_years'))
  const evek = evekRaw ? Number(evekRaw) : null
  if (evek !== null && (!Number.isFinite(evek) || evek < 0 || evek > 60)) {
    return { ok: false, message: 'A szakmai tapasztalat 0 és 60 év között adható meg.' }
  }

  const adat = {
    user_id: user.id,
    title: tisztit(form.get('title')),
    workplace: tisztit(form.get('workplace')),
    specialty,
    experience_years: evek,
    bio,
    topics,
    formats,
    interests: form.getAll('interests').map(String).filter(Boolean).slice(0, 8),
    contact_note: tisztit(form.get('contact_note')),
  }

  const supabase = await createClient()
  const { data: letezik } = await supabase
    .from('mentor_profiles').select('id').eq('user_id', user.id).maybeSingle<{ id: string }>()

  const { error } = letezik
    ? await supabase.from('mentor_profiles').update(adat).eq('user_id', user.id)
    : await supabase.from('mentor_profiles').insert({ ...adat, status: 'pending' })

  if (error) return { ok: false, message: error.message }

  revalidatePath('/mentor')
  revalidatePath('/mentor/jelentkezes')
  return {
    ok: true,
    message: letezik
      ? 'A profil mentve. Tartalmi módosítás után újra elbírálásra kerül.'
      : 'A jelentkezésed beérkezett. Jóváhagyás után megjelensz a mentorok között.',
  }
}

/* ─────────── Adminisztrátori műveletek ─────────── */

export async function setMentorStatus(
  id: string, status: Status, note?: string,
): Promise<Result> {
  if (!['pending', 'approved', 'rejected', 'inactive'].includes(status)) {
    return { ok: false, message: 'Ismeretlen állapot.' }
  }
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Nincs bejelentkezve.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('mentor_profiles')
    .update({
      status,
      review_note: note?.trim() || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) return { ok: false, message: error.message }

  revalidatePath('/cms/mentorok')
  revalidatePath('/mentor')
  const LABEL: Record<Status, string> = {
    approved: 'jóváhagyva', rejected: 'elutasítva',
    inactive: 'inaktiválva', pending: 'visszatéve elbírálásra',
  }
  return { ok: true, message: `A profil ${LABEL[status]}.` }
}

/** Végleges törlés — csak adminisztrátor, és csak szándékos kérésre. */
export async function deleteMentorProfile(id: string): Promise<Result> {
  const supabase = await createClient()
  const { error } = await supabase.from('mentor_profiles').delete().eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/cms/mentorok')
  return { ok: true, message: 'A profil törölve.' }
}
