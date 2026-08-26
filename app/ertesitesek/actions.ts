'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { APP_VERSION } from '@/lib/changelog/data'

export async function markAllRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
  revalidatePath('/', 'layout')
  revalidatePath('/ertesitesek')
}

/**
 * Az újdonságok megjelölése megtekintettként.
 * Ettől kezdve csak az ennél frissebb szakmai tartalom számít újnak.
 */
export async function markUpdatesSeen() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('profiles')
    .update({ updates_seen_at: new Date().toISOString(), updates_seen_version: APP_VERSION })
    .eq('id', user.id)
  // A harang a layoutban ül, ezért a layout szintjét is érvényteleníteni kell —
  // különben a jelzés a régi számmal marad, amíg a felhasználó újra nem tölti az oldalt.
  revalidatePath('/', 'layout')
  revalidatePath('/ertesitesek')
  revalidatePath('/ujdonsagok')
}
