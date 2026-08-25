import { createClient } from '@/lib/supabase/server'
import { Labor } from '@/components/labor'

interface Gl { id: string; title: string; summary: string | null }

export default async function LaborPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  const { open } = await searchParams
  const supabase = await createClient()
  const { data } = await supabase.from('guidelines').select('id, title, summary').eq('status', 'published').returns<Gl[]>()
  const { data: dz } = await supabase.from('diseases').select('id, name, aliases, is_stub').eq('status', 'published')
  return <Labor guidelines={data ?? []} initialOpen={open} lookup={dz ?? []} />
}
