import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createCase } from './actions'
export const dynamic = 'force-dynamic'
const STATUS_LABEL: Record<string, string> = { draft: 'Folyamatban', active: 'Aktív', completed: 'Lezárt', followup: 'Follow-up', archived: 'Archivált' }
const FILTERS = ['draft', 'active', 'completed', 'followup', 'archived']
interface Row { id: string; case_no: number; title: string; status: string; complaint: string | null; updated_at: string }
export default async function CasesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams; const supabase = await createClient()
  let q = supabase.from('clinical_cases').select('id, case_no, title, status, complaint, updated_at').order('updated_at', { ascending: false })
  if (status && FILTERS.includes(status)) q = q.eq('status', status)
  const { data } = await q.returns<Row[]>(); const items = data ?? []
  const chip = (val: string, label: string) => (<Link href={val ? `/klinika/esetek?status=${val}` : '/klinika/esetek'} className={`sh-chip ${(status ?? '') === val ? 'on' : ''}`}>{label}</Link>)
  return (<><Link className="sh-back" href="/klinika">‹ Klinikai mag</Link><div className="row" style={{ border: 'none' }}><h1 className="h1" style={{ margin: 0 }}>Saját klinikai eseteim</h1><form action={createCase}><button className="btn sm" type="submit">+ Új eset</button></form></div><div className="sh-chips">{chip('', 'Összes')}{FILTERS.map((f) => chip(f, STATUS_LABEL[f]))}</div>{items.length === 0 ? (<div className="card"><p style={{ margin: 0 }}>Nincs eset ebben a nézetben.</p><p className="sub" style={{ marginBottom: 0 }}>Indíts egy új klinikai esetet a jobb felső gombbal.</p></div>) : (items.map((c) => (<Link key={c.id} className="sh-row" href={`/klinika/esetek/${c.id}`}><span className="sh-row-main"><span className="sh-row-name">CASE #{String(c.case_no).padStart(6, '0')} · {c.title}</span><span className="sh-row-sub">{STATUS_LABEL[c.status]} · {new Date(c.updated_at).toLocaleDateString('hu-HU')}{c.complaint ? ` · ${c.complaint}` : ''}</span></span><span className="sh-chev">›</span></Link>)))}</>)
}
