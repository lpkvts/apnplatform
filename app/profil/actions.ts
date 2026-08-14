'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ProfileState { saved?: boolean; error?: string }

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nincs bejelentkezve.' }
  const str = (k: string) => { const v = String(formData.get(k) ?? '').trim(); return v === '' ? null : v }
  const year = str('qual_year')
  const { error } = await supabase.from('profiles').update({
    full_name: str('full_name'),
    apn_type: str('apn_type'),
    specialty: str('specialty'),
    title: str('title'),
    workplace: str('workplace'),
    qualification: str('qualification'),
    qual_year: year ? Number(year) : null,
    registration_no: str('registration_no'),
    phone: str('phone'),
  }).eq('id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/profil')
  revalidatePath('/')
  return { saved: true }
}
