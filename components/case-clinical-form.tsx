'use client'

import { useActionState, useState } from 'react'
import { saveCaseClinical, type CaseState } from '@/app/klinika/esetek/actions'
import { ASSESS_VITALS } from '@/lib/assessment/data'
import { vitalFlag } from '@/lib/assessment/logic'
import { CONTEXTS } from '@/lib/context/data'

interface Vitals { rr?: string; spo2?: string; sbp?: string; hr?: string; temp?: string; avpu?: string }
export interface CaseClinical {
  id: string; vitals: Vitals | null; disease_id: string | null; context_id: string | null
}

const FLAG_LABEL: Record<string, string> = { amber: 'eltérés', red: 'kritikus' }

export function CaseClinicalForm({ c, diseases }: { c: CaseClinical; diseases: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState<CaseState, FormData>(saveCaseClinical, {})
  const [vit, setVit] = useState<Vitals>(c.vitals ?? {})
  const set = (k: string, v: string) => setVit((s) => ({ ...s, [k]: v }))

  return (
    <form action={action}>
      <input type="hidden" name="id" value={c.id} />

      <div className="as-lbl">Vitális paraméterek</div>
      {ASSESS_VITALS.map((v) => {
        const cur = (vit as Record<string, string>)[v.k] ?? ''
        const fl = vitalFlag(v.k, cur)
        return (
          <div className="as-vitrow" key={v.k} style={{ marginBottom: 8 }}>
            <span className="as-vl">{v.label}</span>
            <input className="as-vin" name={v.k} type="text" inputMode="decimal" placeholder={v.ph}
              defaultValue={cur} onChange={(e) => set(v.k, e.target.value)} />
            <span className="as-vu">{v.unit}</span>
            {fl && <span className={`ekg-sev ${fl === 'red' ? 'sev-crit' : 'sev-mid'}`}>{FLAG_LABEL[fl]}</span>}
          </div>
        )
      })}
      <div className="as-vitrow" style={{ marginBottom: 8 }}>
        <span className="as-vl">Tudat (AVPU)</span>
        <select className="as-vin" name="avpu" defaultValue={vit.avpu ?? ''} style={{ minWidth: 120 }}>
          <option value="">—</option>
          <option value="A">A – éber</option>
          <option value="V">V – hangra</option>
          <option value="P">P – fájdalomra</option>
          <option value="U">U – nem reagál</option>
        </select>
      </div>

      <div className="as-lbl">Kapcsolódó betegség (Betegségtár)</div>
      <select className="field" name="disease_id" defaultValue={c.disease_id ?? ''}>
        <option value="">— nincs —</option>
        {diseases.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <div className="as-lbl">Klinikai kontextus (Context Engine)</div>
      <select className="field" name="context_id" defaultValue={c.context_id ?? ''}>
        <option value="">— nincs —</option>
        {CONTEXTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
      </select>

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>
        {pending ? 'Mentés…' : 'Klinikai adatok mentése'}
      </button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
