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
  // A karbantartási kapcsoló minden oldalt érint, ezért a teljes elrendezést
  // érvényteleníteni kell — enélkül a felhasználók a gyorsítótárból még
  // a régi állapotot kapnák.
  revalidatePath('/', 'layout')
  revalidatePath('/cms/beallitasok')
}

/** A karbantartási üzenet szövege. Üresen hagyva az alapértelmezett jelenik meg. */
export async function saveMaintenanceMessage(formData: FormData) {
  const { role } = await currentRole()
  if (!isAdmin(role)) return
  const value = String(formData.get('value') ?? '').trim()
  const supabase = await createClient()
  await supabase
    .from('feature_flags')
    .update({ value: value || null, updated_at: new Date().toISOString() })
    .eq('key', 'maintenance')
  revalidatePath('/', 'layout')
  revalidatePath('/cms/beallitasok')
}
