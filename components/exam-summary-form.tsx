'use client'
import { useActionState, useState } from 'react'
import { saveSummary, type ExamState } from '@/app/klinika/vizsgalat/actions'
import { buildExamSummary, relatedExamModules } from '@/lib/exam/summary'

interface SessionData {
  title?: string; anamnesis?: Record<string, unknown>; vitals?: unknown
  general_exam?: Record<string, unknown>; systems?: Record<string, Record<string, string | string[]>>
  red_flags?: string[]; summary?: string | null; focus?: string | null; exam_type?: string | null
}

export function ExamSummaryForm({ id, data }: { id: string; data: SessionData }) {
  const [state, action, pending] = useActionState<ExamState, FormData>(saveSummary, {})
  const generated = buildExamSummary(data)
  const [text, setText] = useState<string>(data.summary && data.summary.trim() ? data.summary : generated)
  const [copied, setCopied] = useState(false)
  const related = relatedExamModules(data)

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* ignore */ }
  }

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="summary" value={text} />

      <div className="row" style={{ border: 'none', padding: 0 }}>
        <span className="sec-t">Klinikai összegzés</span>
        <button type="button" className="btn ghost sm" onClick={() => setText(generated)}>Generálás újra</button>
      </div>
      <p className="sub" style={{ marginTop: 4 }}>Automatikusan a rögzített adatokból készült. Szabadon szerkesztheted, mentheted és másolhatod. Nem orvosi diagnózis.</p>
      <textarea className="as-ta" rows={16} value={text} onChange={(e) => setText(e.target.value)} style={{ fontFamily: 'inherit', lineHeight: 1.5 }} />

      <div className="cop-acts">
        <button className="btn sm" type="submit" disabled={pending}>{pending ? 'Mentés…' : 'Összegzés mentése'}</button>
        <button type="button" className="btn ghost sm" onClick={copy}>{copied ? 'Másolva ✓' : 'Másolás'}</button>
      </div>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}

      {related && (
        <div className="card" style={{ marginTop: 14 }}>
          <b>🔗 Kapcsolódó modulok</b>
          <p className="sub" style={{ margin: '4px 0 8px' }}>A panasz alapján releváns kapcsolódások — a rendszer nem rendel vizsgálatot.</p>
          {related.labs.length > 0 && <div className="sub" style={{ margin: '2px 0' }}><b>🧪 Labor:</b> {related.labs.join(', ')}</div>}
          {related.ekg && <div className="sub" style={{ margin: '2px 0' }}><b>❤️ EKG:</b> javasolt áttekinteni</div>}
          {related.diseases.length > 0 && <div className="sub" style={{ margin: '2px 0' }}><b>📚 Kórképek:</b> {related.diseases.join(', ')}</div>}
          <div className="cop-acts" style={{ marginTop: 8 }}>
            <a className="btn ghost sm" href="/klinika/labor">Labor</a>
            {related.ekg && <a className="btn ghost sm" href="/klinika/ekg">EKG</a>}
            <a className="btn ghost sm" href="/betegsegtar">Betegségtár</a>
            <a className="btn ghost sm" href="/klinika/tesztek">Score Hub</a>
          </div>
        </div>
      )}
    </form>
  )
}
