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
const allFlags = cache(async (): Promise<Map<string, { enabled: boolean; value: string | null }>> => {
  const supabase = await createClient()
  const { data } = await supabase.from('feature_flags').select('key, enabled, value')
    .returns<{ key: string; enabled: boolean; value: string | null }[]>()
  return new Map((data ?? []).map((f) => [f.key, { enabled: f.enabled, value: f.value }]))
})

export async function getFlag(key: string, def = false): Promise<boolean> {
  const flags = await allFlags()
  return flags.get(key)?.enabled ?? def
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
  // Ugyanabból a betöltött készletből dolgozik, mint a többi kapcsoló:
  // korábban ez külön adatbázis-kört jelentett minden oldalbetöltésnél.
  const data = (await allFlags()).get('maintenance') ?? null
  return {
    on: data?.enabled ?? false,
    message: data?.value?.trim() ||
      'A platform karbantartás miatt átmenetileg nem érhető el. Kérjük, próbáld újra később.',
  }
})
