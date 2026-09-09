import { createClient } from '@/lib/supabase/server'
import type { DrugGroup, Substance, Antibiotic, DrugSummary } from './types'

export * from './types'

export async function getGroups(): Promise<DrugGroup[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('drug_groups').select('*').order('ord').returns<DrugGroup[]>()
  return data ?? []
}

export async function getSubstances(): Promise<Substance[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('drug_substances').select('*').order('name').returns<Substance[]>()
  return data ?? []
}

export async function getSubstance(slug: string): Promise<Substance | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('drug_substances').select('*').eq('slug', slug).maybeSingle<Substance>()
  return data
}

/** Az antibiotikum-adatok, hatóanyag szerint kulcsolva. */
export async function getAntibiotics(): Promise<Record<string, Antibiotic>> {
  const supabase = await createClient()
  const { data } = await supabase.from('drug_antibiotics').select('*').returns<Antibiotic[]>()
  const ki: Record<string, Antibiotic> = {}
  for (const a of data ?? []) ki[a.substance_id] = a
  return ki
}

export async function getDrugSummary(): Promise<DrugSummary | null> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('drug_summary')
  return (data as DrugSummary[] | null)?.[0] ?? null
}
