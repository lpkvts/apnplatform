import { createClient } from '@/lib/supabase/server'
import type { Country, Source, TimelineItem, Summary } from './types'

export * from './types'

/** A közzétett országprofilok. Szerkesztőnek a piszkozatok is látszanak. */
export async function getCountries(): Promise<Country[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('apn_countries')
    .select('*')
    .order('name')
    .returns<Country[]>()
  return data ?? []
}

export async function getCountry(code: string): Promise<Country | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('apn_countries').select('*').eq('code', code.toUpperCase())
    .maybeSingle<Country>()
  return data
}

export async function getSources(countryId?: string): Promise<Source[]> {
  const supabase = await createClient()
  let q = supabase.from('apn_sources').select('*')
  if (countryId) q = q.eq('country_id', countryId)
  const { data } = await q.returns<Source[]>()
  return data ?? []
}

export async function getTimeline(): Promise<TimelineItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('apn_timeline').select('id, period, title, description, ord')
    .order('ord').returns<TimelineItem[]>()
  return data ?? []
}

export async function getSummary(): Promise<Summary | null> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('apn_world_summary')
  return (data as Summary[] | null)?.[0] ?? null
}
