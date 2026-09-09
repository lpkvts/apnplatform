import Link from 'next/link'
import { MunkamenetLista } from '@/components/munkamenet-lista'
import { createClient } from '@/lib/supabase/server'
import { ExamStart } from '@/components/exam-start'
import { ClinicalDisclaimer } from '@/components/clinical-disclaimer'
export const dynamic = 'force-dynamic'

const MODE_BADGE: Record<string, string> = { clinical: '🩺 Klinikai', education: '🎓 Oktatási', practice: '🧠 Gyakorló' }
interface Row { id: string; title: string; mode: string; status: string; updated_at: string }

export default async function MunkamenetPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('exam_sessions').select('id, title, mode, status, updated_at').neq('status', 'archived').order('updated_at', { ascending: false }).limit(10).returns<Row[]>()
  const items = data ?? []
  return (
    <>
      <Link className="sh-back" href="/klinika/vizsgalat">‹ Betegvizsgálat</Link>
      <h1 className="h1">Vizsgálati munkamenet</h1>
      <p className="sub">Strukturált betegvizsgálat egy adott betegnél: anamnézis, fizikális vizsgálat, red flags, összegzés — klinikai és oktatási módban.</p>
      <ClinicalDisclaimer />

      <div className="sec-h"><span className="sec-t">Új munkamenet indítása</span></div>
      <ExamStart />

      <MunkamenetLista items={items} modeBadge={MODE_BADGE} />
    </>
  )
}
