'use server'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isAdmin } from '@/lib/roles'
import { revalidatePath } from 'next/cache'
export async function toggleFlag(formData: FormData) {
  const { role } = await currentRole()
  if (!isAdmin(role)) return
  const key = String(formData.get('key') ?? '')
  const enabled = String(formData.get('enabled') ?? '') === 'true'
  const supabase = await createClient()
  await supabase.from('feature_flags').update({ enabled: !enabled, updated_at: new Date().toISOString() }).eq('key', key)
  revalidatePath('/cms/beallitasok'); revalidatePath('/klinika/ekg')
}
