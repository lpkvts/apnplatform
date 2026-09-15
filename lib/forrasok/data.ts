'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { currentRole } from '@/lib/roles'
import type { ReviewItem } from './types'

/**
 * A felülvizsgálati sor: mit érdemes megnézni, és milyen sorrendben.
 *
 * A sor nem keres az interneten — azt rendezi sorba, amit a platform már
 * tud: a forrás korát, az utolsó ellenőrzés idejét, és hogy hány kórkép
 * támaszkodik rá.
 */
export async function getReviewQueue(): Promise<ReviewItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guideline_review_queue')
    .select('*')
    .order('surgosseg', { ascending: false })
    .limit(100)
  return (data as ReviewItem[] | null) ?? []
}

/** Az ellenőrzés rögzítése — megjegyzéssel, ha nem volt újabb kiadás. */
export async function markChecked(
  id: string, megjegyzes: string,
): Promise<{ ok: boolean; hiba?: string }> {
  const { role } = await currentRole()
  if (!['admin', 'szerkeszto', 'lektor'].includes(role ?? '')) {
    return { ok: false, hiba: 'Nincs jogosultságod ehhez.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('mark_guideline_checked', {
    p_id: id,
    p_note: megjegyzes.trim() || null,
  })
  if (error) return { ok: false, hiba: 'A rögzítés nem sikerült.' }

  revalidatePath('/cms/forras-felderites')
  return { ok: true }
}
