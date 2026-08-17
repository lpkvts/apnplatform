'use client'

import { useActionState, useState } from 'react'
import { saveSummary, type CaseState } from '@/app/klinika/esetek/actions'
import { SafetyNote } from '@/components/safety'

export function CaseSummaryForm({ caseId, stored, auto }: { caseId: string; stored: string | null; auto: string }) {
  const [state, action, pending] = useActionState<CaseState, FormData>(saveSummary, {})
  const [text, setText] = useState(stored ?? '')
  return (
    <form action={action}>
      <input type="hidden" name="id" value={caseId} />
      <button type="button" className="btn ghost sm" onClick={() => setText(auto)} style={{ marginBottom: 8 }}>
        Generálás a rögzített adatokból
      </button>
      <textarea className="as-ta" name="summary" rows={14} value={text} onChange={(e) => setText(e.target.value)}
        style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }} placeholder="Kattints a generálásra, majd szerkeszd…" />
      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>
        {pending ? 'Mentés…' : 'Összefoglaló mentése'}
      </button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
      <SafetyNote />
    </form>
  )
}
