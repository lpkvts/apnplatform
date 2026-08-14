'use client'

import { useActionState } from 'react'
import { updateCaseCore, type CaseState } from '@/app/klinika/esetek/actions'

export function CaseCoreForm({ c }: { c: { id: string; title: string; complaint: string | null; background: string | null } }) {
  const [state, action, pending] = useActionState<CaseState, FormData>(updateCaseCore, {})
  return (
    <form action={action}>
      <input type="hidden" name="id" value={c.id} />
      <div className="as-lbl">Eset megnevezése</div>
      <input className="field" name="title" defaultValue={c.title} placeholder="pl. COPD exacerbáció" />
      <div className="as-lbl">Fő panasz</div>
      <input className="field" name="complaint" defaultValue={c.complaint ?? ''} placeholder="pl. nehézlégzés" />
      <div className="as-lbl">Releváns anamnézis</div>
      <textarea className="as-ta" name="background" rows={4} defaultValue={c.background ?? ''} />
      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>
        {pending ? 'Mentés…' : 'Mentés'}
      </button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
