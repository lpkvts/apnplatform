'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { revalidatePath } from 'next/cache'
import { APP_VERSION } from '@/lib/changelog/data'

/** A harang a fejlécben ül, ezért a layout szintjét is érvényteleníteni kell. */
function frissit() {
  revalidatePath('/', 'layout')
  revalidatePath('/ertesitesek')
}

/**
 * Egyetlen értesítés törlése.
 *
 * A tárolt értesítést valóban törli. A származtatott teendőt — lejáró
 * tanúsítvány, esedékes felülvizsgálat, utánkövetés — elnémítja: a mögöttes
 * adat érintetlen marad, csak a jelzés tűnik el. Korábban ezekre semmilyen
 * törlési lehetőség nem volt, ezért amíg az állapot fennállt, a harangon
 * ragadt a szám.
 */
export async function deleteNotif(formData: FormData) {
  const key = String(formData.get('key') ?? '')
  const rowId = String(formData.get('rowId') ?? '')
  if (!key) return
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return

  if (rowId) {
    await supabase.from('notifications').delete().eq('id', rowId).eq('user_id', user.id)
  } else {
    await supabase.rpc('notification_dismiss', { p_key: key })
  }
  frissit()
}

/**
 * Mindent töröl — a biztonsági szelep.
 *
 * Bármi ragadt is be, ez nullázza: törli a tárolt értesítéseket, elnémítja a
 * származtatott teendőket, és megtekintettre állítja az újdonságokat. Egyetlen
 * adatbázis-körben fut (0103 migráció), hogy ne maradhasson félbeszakadt
 * állapot, amiből újra beragadás lesz.
 */
export async function clearAllNotifs() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return
  await supabase.rpc('notification_clear_all', { p_version: APP_VERSION })
  frissit()
  revalidatePath('/ujdonsagok')
}

export async function markAllRead() {
  const supabase = await createClient()
  const user = await getCurrentUser()
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
  const user = await getCurrentUser()
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
