import { createClient } from '@/lib/supabase/server'
import { Copilot } from '@/components/copilot'

interface Gl { id: string; title: string; summary: string | null }

export default async function CopilotPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guidelines')
    .select('id, title, summary')
    .eq('status', 'published')
    .returns<Gl[]>()
  return <Copilot guidelines={data ?? []} />
}
