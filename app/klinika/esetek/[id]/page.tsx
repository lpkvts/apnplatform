import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CaseCoreForm } from '@/components/case-core-form'
import { CaseClinicalForm } from '@/components/case-clinical-form'
import { CONTEXTS } from '@/lib/context/data'
import { setCaseStatus } from '../actions'

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = { draft: 'Folyamatban', active: 'Aktív', completed: 'Lezárt', followup: 'Follow-up', archived: 'Archivált' }
interface Vitals { rr?: string; spo2?: string; sbp?: string; hr?: string; temp?: string; avpu?: string }
interface CaseRow {
  id: string; case_no: number; title: string; status: string; complaint: string | null; background: string | null
  created_at: string; vitals: Vitals | null; disease_id: string | null; context_id: string | null
}

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
  const [caseRes, disRes] = await Promise.all([
    supabase.from('clinical_cases')
      .select('id, case_no, title, status, complaint, background, created_at, vitals, disease_id, context_id')
      .eq('id', id).maybeSingle<CaseRow>(),
    supabase.from('diseases').select('id, name').eq('status', 'published').order('name').returns<{ id: string; name: string }[]>(),
  ])
  const c = caseRes.data
  if (!c) notFound()
  const diseases = disRes.data ?? []
  const disease = c.disease_id ? diseases.find((d) => d.id === c.disease_id) : null
  const ctx = c.context_id ? CONTEXTS.find((x) => x.id === c.context_id) : null

  return (
    <>
      <Link className="sh-back" href="/klinika/esetek">‹ Eseteim</Link>
      <div className="row" style={{ border: 'none' }}>
        <h1 className="h1" style={{ margin: 0 }}>CASE #{String(c.case_no).padStart(6, '0')}</h1>
        <span className={`cms-badge cs-${c.status}`}>{STATUS_LABEL[c.status]}</span>
      </div>
      <p className="sub">Létrehozva: {new Date(c.created_at).toLocaleDateString('hu-HU')}</p>

      <div className="sec-h"><span className="sec-t">Alapadatok</span></div>
      <CaseCoreForm c={c} />

      <div className="sec-h"><span className="sec-t">Klinikai adatok</span></div>
      <CaseClinicalForm c={c} diseases={diseases} />

      {(disease || ctx) && (
        <>
          <div className="sec-h"><span className="sec-t">Kapcsolódó modulok</span></div>
          {disease && <Link className="sh-row" href={`/betegsegtar/${disease.id}`}>
            <span className="sh-row-main"><span className="sh-row-name">🩺 {disease.name}</span><span className="sh-row-sub">Betegségtár</span></span><span className="sh-chev">›</span></Link>}
          {ctx && <Link className="sh-row" href={`/kontextus/${ctx.id}`}>
            <span className="sh-row-main"><span className="sh-row-name">🧠 {ctx.name}</span><span className="sh-row-sub">Klinikai kontextus — ajánlott eszközök</span></span><span className="sh-chev">›</span></Link>}
        </>
      )}

      <div className="sec-h"><span className="sec-t">Állapot</span></div>
      <div className="cop-acts">
        {c.status !== 'active' && <StatusBtn id={c.id} status="active" label="Aktívra" />}
        {c.status !== 'completed' && <StatusBtn id={c.id} status="completed" label="Lezárás" />}
        {c.status !== 'followup' && <StatusBtn id={c.id} status="followup" label="Follow-up" />}
        {c.status !== 'archived' ? <StatusBtn id={c.id} status="archived" label="Archiválás" /> : <StatusBtn id={c.id} status="active" label="Visszaállítás" />}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <p className="sub" style={{ margin: 0 }}>Következő lépések ide épülnek: Labor/EKG/Score az esethez, Clinical Summary, SBAR, Follow-up.</p>
      </div>
    </>
  )
}
