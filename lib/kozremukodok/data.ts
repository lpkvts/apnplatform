import { createClient } from '@/lib/supabase/server'
import type { Contributor } from './types'

export * from './types'

/**
 * A közzétett közreműködők, megjelenési sorrendben.
 *
 * Az azonos sorszámúak névsorban követik egymást, hogy ne kelljen minden
 * új felvételnél átszámozni a listát.
 */
export async function getContributors(): Promise<Contributor[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contributors')
    .select('*')
    .eq('publish_status', 'published')
    .order('ord')
    .returns<Contributor[]>()

  return (data ?? []).sort((a, b) =>
    a.ord - b.ord || a.name.localeCompare(b.name, 'hu'))
}

/** Minden közreműködő, a piszkozatokkal együtt — a kezelőfelülethez. */
export async function getAllContributors(): Promise<Contributor[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('contributors').select('*').order('ord').returns<Contributor[]>()
  return (data ?? []).sort((a, b) =>
    a.ord - b.ord || a.name.localeCompare(b.name, 'hu'))
}
