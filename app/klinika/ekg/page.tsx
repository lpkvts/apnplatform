import { Ekg } from '@/components/ekg'
import { getFlag } from '@/lib/flags'
import { createClient } from '@/lib/supabase/server'
import { getEkgProgress } from '@/lib/ekg/progress'
export const dynamic = 'force-dynamic'
export default async function EkgPage({ searchParams }: { searchParams: Promise<{ open?: string; vissza?: string; lepes?: string }> }) {
  const { open, vissza, lepes } = await searchParams
  const examEnabled = await getFlag('ekg_exam', false)
  const supabase = await createClient()
  const { data: dz } = await supabase.from('diseases').select('id, name, aliases, is_stub').eq('status', 'published')
  const progress = await getEkgProgress()
  return (
    <Ekg
      initialOpen={open} examEnabled={examEnabled} lookup={dz ?? []}
      backCase={vissza} backStep={lepes} progress={progress}
    />
  )
}
