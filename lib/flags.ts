import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
export interface Flag { key: string; enabled: boolean; label: string | null; value?: string | null }
/**
 * Az összes kapcsoló egyszerre, kérésenként egyszer lekérdezve.
 *
 * Több oldal három-négy kapcsolót is megnéz. Külön lekérdezésekkel ez ugyanannyi
 * adatbázis-kör lenne, pedig a tábla néhány sorból áll — egyszerre beolvasva
 * egyetlen kör is elég.
 */
const allFlags = cache(async (): Promise<Map<string, boolean>> => {
  const supabase = await createClient()
  const { data } = await supabase.from('feature_flags').select('key, enabled')
    .returns<{ key: string; enabled: boolean }[]>()
  return new Map((data ?? []).map((f) => [f.key, f.enabled]))
})

export async function getFlag(key: string, def = false): Promise<boolean> {
  const flags = await allFlags()
  return flags.get(key) ?? def
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
export const getMaintenance = cache(async (): Promise<{ on: boolean; message: string }> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('feature_flags').select('enabled, value').eq('key', 'maintenance')
    .maybeSingle<{ enabled: boolean; value: string | null }>()
  return {
    on: data?.enabled ?? false,
    message: data?.value?.trim() ||
      'A platform karbantartás miatt átmenetileg nem érhető el. Kérjük, próbáld újra később.',
  }
})
