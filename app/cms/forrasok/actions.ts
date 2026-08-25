'use server'
import { createClient } from '@/lib/supabase/server'
import { currentRole, STAFF, type Role } from '@/lib/roles'
import { revalidatePath } from 'next/cache'
export interface SourceState { saved?: boolean; error?: string }
const str = (v: FormDataEntryValue | null) => { const s = String(v ?? '').trim(); return s === '' ? null : s }
export async function saveSource(_prev: SourceState, formData: FormData): Promise<SourceState> {
  const { userId, role } = await currentRole()
  if (!userId || !STAFF.includes(role as Role)) return { error: 'Nincs jogosultság.' }
  const supabase = await createClient()
  const name = str(formData.get('name')); if (!name) return { error: 'A név kötelező.' }
  const id = str(formData.get('id'))
  const row = { name, type: str(formData.get('type')), organization: str(formData.get('organization')), url: str(formData.get('url')), version: str(formData.get('version')), publication_date: str(formData.get('publication_date')), last_verified: str(formData.get('last_verified')), next_review: str(formData.get('next_review')), status: str(formData.get('status')) ?? 'current', notes: str(formData.get('notes')) }
  if (id) { const { data, error } = await supabase.from('clinical_sources').update(row).eq('id', id).select('id'); if (error) return { error: `Adatbázis-hiba: ${error.message}` }; if (!data || data.length === 0) return { error: 'A mentés 0 sort érintett (jogosultság?).' } }
  else { const { error } = await supabase.from('clinical_sources').insert({ ...row, created_by: userId }).select('id'); if (error) return { error: `Adatbázis-hiba: ${error.message}` } }
  revalidatePath('/cms/forrasok'); revalidatePath('/cms/tartalomfigyelo'); return { saved: true }
}
export async function deleteSource(formData: FormData) {
  const { userId, role } = await currentRole(); if (!userId || !STAFF.includes(role as Role)) return
  const supabase = await createClient(); await supabase.from('clinical_sources').delete().eq('id', String(formData.get('id') ?? '')); revalidatePath('/cms/forrasok')
}
