'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * Kijelentkezés.
 *
 * Közös művelet, hogy a fejléc és a profil oldal ugyanazt használja — két
 * párhuzamos megvalósításnál könnyen elcsúszna, melyik takarítja el rendesen
 * a munkamenetet.
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  // A fejléc és a navigáció a bejelentkezett állapotból dolgozik, ezért a
  // teljes elrendezést érvényteleníteni kell — enélkül a régi név és az
  // értesítésszám még ott maradna.
  revalidatePath('/', 'layout')
  redirect('/login')
}
