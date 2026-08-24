import { createClient } from '@/lib/supabase/server'
export interface Flag { key: string; enabled: boolean; label: string | null }
export async function getFlag(key: string, def = false): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.from('feature_flags').select('enabled').eq('key', key).maybeSingle<{ enabled: boolean }>()
  return data?.enabled ?? def
}
export async function getFlags(): Promise<Flag[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('feature_flags').select('key, enabled, label').order('key').returns<Flag[]>()
  return data ?? []
}
