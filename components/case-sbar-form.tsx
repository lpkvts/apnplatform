'use client'

import { useActionState, useState } from 'react'
import { saveSbar, type CaseState } from '@/app/klinika/esetek/actions'
import { SafetyNote } from '@/components/safety'
import type { Sbar } from '@/lib/case/summary'

const F: { k: keyof Sbar; label: string }[] = [
  { k: 's', label: 'S – Situation (mi történik most)' },
  { k: 'b', label: 'B – Background (előzmények)' },
  { k: 'a', label: 'A – Assessment (állapot, eredmények)' },
  { k: 'r', label: 'R – Recommendation (javasolt lépések)' },
]

export function CaseSbarForm({ caseId, stored, auto }: { caseId: string; stored: Sbar | null; auto: Sbar }) {
  const [state, action, pending] = useActionState<CaseState, FormData>(saveSbar, {})
  const [v, setV] = useState<Sbar>(stored ?? { s: '', b: '', a: '', r: '' })
  return (
    <form action={action}>
      <input type="hidden" name="id" value={caseId} />
      <button type="button" className="btn ghost sm" onClick={() => setV(auto)} style={{ marginBottom: 8 }}>
        Generálás a rögzített adatokból
      </button>
      {F.map((f) => (
        <div key={f.k}>
          <div className="as-lbl">{f.label}</div>
          <textarea className="as-ta" name={f.k} rows={3} value={v[f.k]} onChange={(e) => setV((s) => ({ ...s, [f.k]: e.target.value }))} />
        </div>
      ))}
      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>
        {pending ? 'Mentés…' : 'SBAR mentése'}
      </button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
      <SafetyNote />
    </form>
  )
}
