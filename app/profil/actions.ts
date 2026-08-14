'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const str = (k: string) => {
    const v = String(formData.get(k) ?? '').trim()
    return v === '' ? null : v
  }
  const year = str('qual_year')
  await supabase.from('profiles').update({
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
  revalidatePath('/profil')
  revalidatePath('/')
  redirect('/profil')
}
