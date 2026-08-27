import { createClient } from '@/lib/supabase/server'
export interface Flag { key: string; enabled: boolean; label: string | null; value?: string | null }
export async function getFlag(key: string, def = false): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.from('feature_flags').select('enabled').eq('key', key).maybeSingle<{ enabled: boolean }>()
  return data?.enabled ?? def
}
export async function getFlags(): Promise<Flag[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('feature_flags').select('key, enabled, label, value').order('key').returns<Flag[]>()
  return data ?? []
}

/**
 * Karbantartási mód állapota és üzenete.
 *
 * A kapcsoló és a szöveg egy lekérdezésben jön, mert ez minden oldalbetöltésnél
 * lefut — két külön kérés fölösleges terhelés lenne.
 */
export async function getMaintenance(): Promise<{ on: boolean; message: string }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('feature_flags').select('enabled, value').eq('key', 'maintenance')
    .maybeSingle<{ enabled: boolean; value: string | null }>()
  return {
    on: data?.enabled ?? false,
    message: data?.value?.trim() ||
      'A platform karbantartás miatt átmenetileg nem érhető el. Kérjük, próbáld újra később.',
  }
}
