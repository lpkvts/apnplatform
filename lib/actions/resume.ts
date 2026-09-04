'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

/**
 * A „Folytasd, ahol abbahagytad" tételek eltávolítása.
 *
 * A jogosultságot az adatbázis szabálya érvényesíti — a felhasználó csak
 * a saját vizsgálatát és esetét törölheti. A tulajdonos ellenőrzése itt is
 * megtörténik, hogy a hibaüzenet érthető legyen.
 */

export interface Res { ok: boolean; message: string }

export async function deleteExam(id: string): Promise<Res> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Nincs bejelentkezve.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('exam_sessions').delete().eq('id', id).eq('user_id', user.id)

  if (error) return { ok: false, message: error.message }
  revalidatePath('/')
  revalidatePath('/klinika/vizsgalat')
  return { ok: true, message: 'A vizsgálat törölve.' }
}

export async function deleteCase(id: string): Promise<Res> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: 'Nincs bejelentkezve.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('clinical_cases').delete().eq('id', id).eq('owner_id', user.id)

  if (error) return { ok: false, message: error.message }
  revalidatePath('/')
  revalidatePath('/klinika/esetek')
  return { ok: true, message: 'Az eset törölve.' }
}
