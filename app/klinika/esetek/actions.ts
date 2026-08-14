'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface CaseState { saved?: boolean; error?: string }

export async function createCase() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data, error } = await supabase.from('clinical_cases')
    .insert({ owner_id: user.id, status: 'draft' }).select('id').single<{ id: string }>()
  if (error || !data) return
  revalidatePath('/klinika/esetek')
  redirect(`/klinika/esetek/${data.id}`)
}

export async function updateCaseCore(_prev: CaseState, formData: FormData): Promise<CaseState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nincs bejelentkezve.' }
  const id = String(formData.get('id') ?? '')
  const str = (k: string) => { const v = String(formData.get(k) ?? '').trim(); return v === '' ? null : v }
  const { data, error } = await supabase.from('clinical_cases').update({
    title: str('title') ?? 'Új klinikai eset',
    complaint: str('complaint'),
    background: str('background'),
  }).eq('id', id).eq('owner_id', user.id).select('id')
  if (error) return { error: `Adatbázis-hiba: ${error.message}` }
  if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' }
  revalidatePath(`/klinika/esetek/${id}`); revalidatePath('/klinika/esetek'); revalidatePath('/')
  return { saved: true }
}

export async function setCaseStatus(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!['draft', 'active', 'completed', 'followup', 'archived'].includes(status)) return
  await supabase.from('clinical_cases').update({ status }).eq('id', id).eq('owner_id', user.id)
  revalidatePath(`/klinika/esetek/${id}`); revalidatePath('/klinika/esetek')
}
