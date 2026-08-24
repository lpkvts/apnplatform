import { Ekg } from '@/components/ekg'
import { getFlag } from '@/lib/flags'
export const dynamic = 'force-dynamic'
export default async function EkgPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  const { open } = await searchParams
  const examEnabled = await getFlag('ekg_exam', false)
  return <Ekg initialOpen={open} examEnabled={examEnabled} />
}
