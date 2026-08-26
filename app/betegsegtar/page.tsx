import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DiseaseList, type DiseaseRow } from '@/components/disease-list'
import { ClinicalDisclaimer } from '@/components/clinical-disclaimer'
export const dynamic = 'force-dynamic'

export default async function BetegsegtarPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('diseases').select('id, name, aliases, abbrev, specialty, is_stub, bno').eq('status', 'published').order('name').returns<DiseaseRow[]>()
  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Betegségtár</h1>
      <p className="sub">Kórképek strukturált, APN-fókuszú adatlapjai — mire figyelj, mit vizsgálj, red flag jelek, APN-megközelítés.</p>

      <Link className="sh-row" href="/betegsegtar/panasz">
        <span className="sh-row-main"><span className="sh-row-name">🔍 Panasz alapján</span><span className="sh-row-sub">Tünetből a lehetséges kórképek felé</span></span>
        <span className="sh-chev">›</span>
      </Link>
      <Link className="sh-row" href="/betegsegtar/akut">
        <span className="sh-row-main"><span className="sh-row-name">🚨 Akut állapotok</span><span className="sh-row-sub">Gyors klinikai orientáció, red flag jelek</span></span>
        <span className="sh-chev">›</span>
      </Link>

      <div className="sec-h"><span className="sec-t">Összes kórkép</span></div>
      <DiseaseList items={data ?? []} />
      <ClinicalDisclaimer />
    </>
  )
}
