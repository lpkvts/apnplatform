import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DiseaseList, type DiseaseRow } from '@/components/disease-list'

export default async function BetegsegtarPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('diseases').select('id, name, aliases, abbrev, specialty')
    .eq('status', 'published').order('specialty').order('name')
    .returns<DiseaseRow[]>()
  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Betegségtár</h1>
      <p className="sub">Strukturált, APN-fókuszú betegségoldalak — mire figyelj, mit vizsgálj, milyen eszközök segítenek.</p>
      <DiseaseList items={data ?? []} />
    </>
  )
}
