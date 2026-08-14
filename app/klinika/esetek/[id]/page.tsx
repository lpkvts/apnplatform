import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CaseCoreForm } from '@/components/case-core-form'
import { setCaseStatus } from '../actions'

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = { draft: 'Folyamatban', active: 'Aktív', completed: 'Lezárt', followup: 'Follow-up', archived: 'Archivált' }
interface CaseRow { id: string; case_no: number; title: string; status: string; complaint: string | null; background: string | null; created_at: string }

function StatusBtn({ id, status, label }: { id: string; status: string; label: string }) {
  return (
    <form action={setCaseStatus} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={status} />
      <button className="btn ghost sm" type="submit">{label}</button>
    </form>
  )
}

export default async function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: c } = await supabase.from('clinical_cases')
    .select('id, case_no, title, status, complaint, background, created_at').eq('id', id).maybeSingle<CaseRow>()
  if (!c) notFound()

  return (
    <>
      <Link className="sh-back" href="/klinika/esetek">‹ Eseteim</Link>
      <div className="row" style={{ border: 'none' }}>
        <h1 className="h1" style={{ margin: 0 }}>CASE #{String(c.case_no).padStart(6, '0')}</h1>
        <span className={`cms-badge cs-${c.status}`}>{STATUS_LABEL[c.status]}</span>
      </div>
      <p className="sub">Létrehozva: {new Date(c.created_at).toLocaleDateString('hu-HU')}</p>

      <CaseCoreForm c={c} />

      <div className="sec-h"><span className="sec-t">Állapot</span></div>
      <div className="cop-acts">
        {c.status !== 'active' && <StatusBtn id={c.id} status="active" label="Aktívra" />}
        {c.status !== 'completed' && <StatusBtn id={c.id} status="completed" label="Lezárás" />}
        {c.status !== 'followup' && <StatusBtn id={c.id} status="followup" label="Follow-up" />}
        {c.status !== 'archived' ? <StatusBtn id={c.id} status="archived" label="Archiválás" /> : <StatusBtn id={c.id} status="active" label="Visszaállítás" />}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <p className="sub" style={{ margin: 0 }}>A további szakaszok (vitálisok, betegség/kontextus, Labor/EKG/Score az esethez, Clinical Summary, SBAR, Follow-up) a következő lépésekben épülnek be ide.</p>
      </div>
    </>
  )
}
