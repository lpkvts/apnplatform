import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createCase } from './actions'
export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = { draft: 'Folyamatban', active: 'Aktív', completed: 'Lezárt', followup: 'Follow-up', archived: 'Archivált' }
const STATUS_FILTERS = ['draft', 'active', 'completed', 'followup', 'archived']

interface CaseRow { id: string; case_no: number; title: string; status: string; complaint: string | null; updated_at: string }
interface Assessment { id: string; domain: string | null; complaint: string | null; summary: string | null; created_at: string }

export default async function EseteimPage({ searchParams }: { searchParams: Promise<{ type?: string; status?: string }> }) {
  const { type = 'all', status } = await searchParams
  const supabase = await createClient()

  const showCases = type === 'all' || type === 'case'
  const showAssess = type === 'all' || type === 'assessment'

  const [casesRes, assessRes] = await Promise.all([
    showCases
      ? (status && STATUS_FILTERS.includes(status)
          ? supabase.from('clinical_cases').select('id, case_no, title, status, complaint, updated_at').eq('status', status).order('updated_at', { ascending: false })
          : supabase.from('clinical_cases').select('id, case_no, title, status, complaint, updated_at').order('updated_at', { ascending: false })
        ).returns<CaseRow[]>()
      : Promise.resolve({ data: [] as CaseRow[] }),
    showAssess
      ? supabase.from('assessments').select('id, domain, complaint, summary, created_at').order('created_at', { ascending: false }).returns<Assessment[]>()
      : Promise.resolve({ data: [] as Assessment[] }),
  ])
  const cases = casesRes.data ?? []
  const assessments = assessRes.data ?? []

  // Egységes, időrendi lista
  const items = [
    ...cases.map((c) => ({ kind: 'case' as const, date: c.updated_at, c })),
    ...assessments.map((a) => ({ kind: 'assess' as const, date: a.created_at, a })),
  ].sort((x, y) => (x.date < y.date ? 1 : -1))

  const typeChip = (val: string, label: string) => (
    <Link href={val === 'all' ? '/klinika/esetek' : `/klinika/esetek?type=${val}`} className={`sh-chip ${type === val ? 'on' : ''}`}>{label}</Link>
  )
  const statusChip = (val: string, label: string) => (
    <Link href={val ? `/klinika/esetek?type=case&status=${val}` : '/klinika/esetek?type=case'} className={`sh-chip ${(status ?? '') === val ? 'on' : ''}`}>{label}</Link>
  )

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <div className="row" style={{ border: 'none' }}>
        <h1 className="h1" style={{ margin: 0 }}>Eseteim és előzmények</h1>
        <form action={createCase}><button className="btn sm" type="submit">+ Új eset</button></form>
      </div>
      <p className="sub">Klinikai eseteid és korábbi betegértékeléseid egy helyen.</p>

      <div className="sh-chips">{typeChip('all', 'Összes')}{typeChip('case', 'Klinikai esetek')}{typeChip('assessment', 'Betegértékelések')}</div>
      {type === 'case' && (
        <div className="sh-chips" style={{ marginTop: 0 }}>{statusChip('', 'Mind')}{STATUS_FILTERS.map((f) => statusChip(f, STATUS_LABEL[f]))}</div>
      )}

      {items.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0 }}>Nincs tétel ebben a nézetben.</p>
          <p className="sub" style={{ marginBottom: 0 }}>Indíts új klinikai esetet fent, vagy készíts <Link href="/klinika/ertekeles">új betegértékelést</Link>.</p>
        </div>
      ) : (
        items.map((it) =>
          it.kind === 'case' ? (
            <Link key={`c-${it.c.id}`} className="sh-row" href={`/klinika/esetek/${it.c.id}`}>
              <span className="sh-row-main">
                <span className="sh-row-name">📋 CASE #{String(it.c.case_no).padStart(6, '0')} · {it.c.title}</span>
                <span className="sh-row-sub">{STATUS_LABEL[it.c.status]} · {new Date(it.c.updated_at).toLocaleDateString('hu-HU')}{it.c.complaint ? ` · ${it.c.complaint}` : ''}</span>
              </span>
              <span className={`cms-badge cs-${it.c.status}`} style={{ marginLeft: 8 }}>{STATUS_LABEL[it.c.status]}</span>
            </Link>
          ) : (
            <details className="card" key={`a-${it.a.id}`}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                📝 {it.a.domain || 'Betegértékelés'}
                <span className="sub" style={{ display: 'block', margin: '4px 0 0', fontWeight: 400 }}>
                  {new Date(it.a.created_at).toLocaleString('hu-HU')}{it.a.complaint ? ` · ${it.a.complaint}` : ''}
                </span>
              </summary>
              <pre className="as-summary" style={{ marginTop: 10, whiteSpace: 'pre-wrap' }}>{it.a.summary}</pre>
            </details>
          )
        )
      )}
    </>
  )
}
