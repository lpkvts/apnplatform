import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CaseCoreForm } from '@/components/case-core-form'
import { CaseClinicalForm } from '@/components/case-clinical-form'
import { CaseLabAdd } from '@/components/case-lab-add'
import { TESTS } from '@/lib/scores/data'
import { ECG } from '@/lib/ekg/data'
import { CONTEXTS } from '@/lib/context/data'
import { buildSummary, buildSbar, type CaseDoc, type Sbar } from '@/lib/case/summary'
import { CaseSummaryForm } from '@/components/case-summary-form'
import { CaseSbarForm } from '@/components/case-sbar-form'
import { setCaseStatus, addCaseScore, addCaseEkg, removeCaseChild, addCaseFollowup, toggleCaseFollowup } from '../actions'
export const dynamic = 'force-dynamic'
const STATUS_LABEL: Record<string, string> = { draft: 'Folyamatban', active: 'Aktív', completed: 'Lezárt', followup: 'Follow-up', archived: 'Archivált' }
interface Vitals { rr?: string; spo2?: string; sbp?: string; hr?: string; temp?: string; avpu?: string }
interface CaseRow { id: string; case_no: number; title: string; status: string; complaint: string | null; background: string | null; created_at: string; vitals: Vitals | null; disease_id: string | null; context_id: string | null; summary: string | null; sbar: Sbar | null; problems: string[] | null; red_flags: string[] | null; decision: string | null }
function RemoveBtn({ table, id, caseId }: { table: string; id: string; caseId: string }) { return (<form action={removeCaseChild} style={{ display: 'inline' }}><input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} /><input type="hidden" name="case_id" value={caseId} /><button className="sh-back" type="submit" style={{ padding: 0 }}>✕</button></form>) }
function StatusBtn({ id, status, label }: { id: string; status: string; label: string }) { return (<form action={setCaseStatus} style={{ display: 'inline' }}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={status} /><button className="btn ghost sm" type="submit">{label}</button></form>) }
export default async function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient()
  const [caseRes, disRes, labsRes, scoresRes, ekgsRes, fupRes] = await Promise.all([
    supabase.from('clinical_cases').select('id, case_no, title, status, complaint, background, created_at, vitals, disease_id, context_id, summary, sbar, problems, red_flags, decision').eq('id', id).maybeSingle<CaseRow>(),
    supabase.from('diseases').select('id, name').eq('status', 'published').order('name').returns<{ id: string; name: string }[]>(),
    supabase.from('clinical_case_labs').select('id, name, value, unit, status').eq('case_id', id).order('created_at'),
    supabase.from('clinical_case_scores').select('id, score_name, value, band').eq('case_id', id).order('created_at'),
    supabase.from('clinical_case_ekgs').select('id, name, category, note, assessment').eq('case_id', id).order('created_at'),
    supabase.from('clinical_case_followups').select('id, horizon, due_on, checks, labs, symptoms, repeat_score, note, done').eq('case_id', id).order('due_on'),
  ])
  const c = caseRes.data; if (!c) notFound()
  const diseases = disRes.data ?? []; const labs = labsRes.data ?? []; const scores = scoresRes.data ?? []; const ekgs = ekgsRes.data ?? []; const followups = fupRes.data ?? []
  const disease = c.disease_id ? diseases.find((d) => d.id === c.disease_id) : null; const ctx = c.context_id ? CONTEXTS.find((x) => x.id === c.context_id) : null
  const today = new Date().toISOString().slice(0, 10)
  const doc: CaseDoc = { title: c.title, complaint: c.complaint, background: c.background, vitals: (c.vitals as Record<string, string> | null), diseaseName: disease?.name ?? null, contextName: ctx?.name ?? null, labs, scores, ekgs, decision: c.decision, problems: c.problems, red_flags: c.red_flags }
  const autoSummary = buildSummary(doc); const autoSbar = buildSbar(doc)
  return (
    <>
      <Link className="sh-back" href="/klinika/esetek">‹ Eseteim</Link>
      <div className="row" style={{ border: 'none' }}><h1 className="h1" style={{ margin: 0 }}>CASE #{String(c.case_no).padStart(6, '0')}</h1><span className={`cms-badge cs-${c.status}`}>{STATUS_LABEL[c.status]}</span></div>
      <p className="sub">Létrehozva: {new Date(c.created_at).toLocaleDateString('hu-HU')}</p>
      <div className="sec-h"><span className="sec-t">Alapadatok</span></div><CaseCoreForm c={c} />
      <div className="sec-h"><span className="sec-t">Klinikai adatok</span></div><CaseClinicalForm c={c} diseases={diseases} />
      {(disease || ctx) && (<><div className="sec-h"><span className="sec-t">Kapcsolódó modulok</span></div>{disease && <Link className="sh-row" href={`/betegsegtar/${disease.id}`}><span className="sh-row-main"><span className="sh-row-name">🩺 {disease.name}</span><span className="sh-row-sub">Betegségtár</span></span><span className="sh-chev">›</span></Link>}{ctx && <Link className="sh-row" href={`/kontextus/${ctx.id}`}><span className="sh-row-main"><span className="sh-row-name">🧠 {ctx.name}</span><span className="sh-row-sub">Klinikai kontextus</span></span><span className="sh-chev">›</span></Link>}</>)}
      <div className="sec-h"><span className="sec-t">🧪 Laborok az esethez</span></div>
      {labs.map((l) => (<div className="as-vitrow" key={l.id} style={{ marginBottom: 6 }}><span className="as-vl">{l.name}</span><b>{l.value}{l.unit ? ` ${l.unit}` : ''}</b>{l.status && <span className={`ekg-sev ${/kritik/i.test(l.status) ? 'sev-crit' : /normál/i.test(l.status) ? 'sev-low' : 'sev-mid'}`}>{l.status}</span>}<RemoveBtn table="clinical_case_labs" id={l.id} caseId={c.id} /></div>))}
      <CaseLabAdd caseId={c.id} />
      <div className="sec-h"><span className="sec-t">🧮 Score-ok az esethez</span></div>
      {scores.map((sc) => (<div className="as-vitrow" key={sc.id} style={{ marginBottom: 6 }}><span className="as-vl">{sc.score_name}</span><b>{sc.value ?? '—'}{sc.band ? ` · ${sc.band}` : ''}</b><RemoveBtn table="clinical_case_scores" id={sc.id} caseId={c.id} /></div>))}
      <form action={addCaseScore} className="as-vitrow" style={{ marginTop: 6 }}><input type="hidden" name="case_id" value={c.id} /><select className="as-vin" name="score_id" defaultValue="" style={{ minWidth: 130 }} required><option value="" disabled>Score…</option>{TESTS.map((t) => <option key={t.id} value={t.id}>{t.abbr || t.name}</option>)}</select><input className="as-vin" name="value" type="text" inputMode="decimal" placeholder="pont" style={{ maxWidth: 80 }} /><input className="as-vin" name="band" type="text" placeholder="sáv (opc.)" style={{ maxWidth: 100 }} /><button className="btn sm" type="submit">Hozzáad</button></form>
      <div className="sec-h"><span className="sec-t">📈 EKG az esethez</span></div>
      {ekgs.map((e) => (<div className="card" key={e.id} style={{ padding: '10px 12px' }}><div className="row" style={{ border: 'none', padding: 0 }}><b>{e.name}</b><RemoveBtn table="clinical_case_ekgs" id={e.id} caseId={c.id} /></div><div className="sub" style={{ margin: '2px 0 0' }}>{e.category}{e.note ? ` · ${e.note}` : ''}{e.assessment ? ` · ${e.assessment}` : ''}</div></div>))}
      <form action={addCaseEkg}><input type="hidden" name="case_id" value={c.id} /><div className="as-vitrow" style={{ marginTop: 6 }}><select className="as-vin" name="ekg_id" defaultValue="" style={{ minWidth: 150 }} required><option value="" disabled>EKG lelet…</option>{ECG.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select><input className="as-vin" name="note" type="text" placeholder="megjegyzés (opc.)" /><button className="btn sm" type="submit">Hozzáad</button></div></form>
      <div className="sec-h"><span className="sec-t">📝 Clinical Summary</span></div><CaseSummaryForm caseId={c.id} stored={c.summary} auto={autoSummary} />
      <div className="sec-h"><span className="sec-t">📋 SBAR</span></div><CaseSbarForm caseId={c.id} stored={c.sbar && (c.sbar.s || c.sbar.b || c.sbar.a || c.sbar.r) ? c.sbar : null} auto={autoSbar} />
      <div className="sec-h"><span className="sec-t">🔄 Follow-up (utánkövetés)</span></div>
      {followups.map((f) => { const overdue = f.due_on && f.due_on <= today && !f.done; return (<div className="card" key={f.id} style={{ padding: '10px 12px', borderColor: overdue ? '#fecaca' : undefined, background: overdue ? '#fff7f7' : undefined }}><div className="row" style={{ border: 'none', padding: 0 }}><b>{f.done ? '✓ ' : ''}{f.horizon ? `${f.horizon} · ` : ''}{f.due_on ? `esedékes: ${f.due_on}` : 'nincs dátum'}</b><RemoveBtn table="clinical_case_followups" id={f.id} caseId={c.id} /></div><div className="sub" style={{ margin: '4px 0 0' }}>{f.checks ? `Ellenőrizni: ${f.checks}. ` : ''}{f.symptoms ? `Tünetek: ${f.symptoms}. ` : ''}{f.labs ? `Labor: ${f.labs}. ` : ''}{f.repeat_score ? `Ismételt score: ${f.repeat_score}. ` : ''}{f.note ? `Megjegyzés: ${f.note}.` : ''}</div><form action={toggleCaseFollowup} style={{ marginTop: 8 }}><input type="hidden" name="id" value={f.id} /><input type="hidden" name="case_id" value={c.id} /><input type="hidden" name="done" value={String(f.done)} /><button className="btn ghost sm" type="submit">{f.done ? 'Visszanyit' : 'Kész'}</button></form></div>) })}
      <form action={addCaseFollowup}><input type="hidden" name="case_id" value={c.id} /><div className="as-lbl">Időtáv</div><select className="field" name="horizon" defaultValue="7d"><option value="24h">24 óra</option><option value="7d">7 nap</option><option value="30d">30 nap</option><option value="">egyedi dátum</option></select><div className="as-lbl">Egyedi dátum (opcionális)</div><input className="field" name="due_on" type="date" /><div className="as-lbl">Mit kell ellenőrizni?</div><input className="field" name="checks" /><div className="as-lbl">Milyen tünetet követni?</div><input className="field" name="symptoms" /><div className="as-lbl">Labor / ismételt score</div><input className="field" name="labs" placeholder="pl. CRP" /><input className="field" name="repeat_score" placeholder="pl. NEWS2" /><div className="as-lbl">Megjegyzés</div><input className="field" name="note" /><button className="btn" type="submit" style={{ width: '100%' }}>Utánkövetés hozzáadása</button></form>
      <div className="sec-h"><span className="sec-t">Állapot</span></div>
      <div className="cop-acts">{c.status !== 'active' && <StatusBtn id={c.id} status="active" label="Aktívra" />}{c.status !== 'completed' && <StatusBtn id={c.id} status="completed" label="Lezárás" />}{c.status !== 'followup' && <StatusBtn id={c.id} status="followup" label="Follow-up" />}{c.status !== 'archived' ? <StatusBtn id={c.id} status="archived" label="Archiválás" /> : <StatusBtn id={c.id} status="active" label="Visszaállítás" />}</div>
    </>
  )
}
