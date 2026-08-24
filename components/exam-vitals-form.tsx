'use client'
import { useActionState, useState } from 'react'
import { saveVitals, type ExamState } from '@/app/klinika/vizsgalat/actions'
import { VITAL_FIELDS, VITAL_TREND, vitalZone, computeBmi, ZONE_DOT } from '@/lib/exam/data'

type Measurement = Record<string, string> & { at?: string; bmi?: string }
const ZONE_CLS: Record<string, string> = { ok: 'sev-low', warn: 'sev-mid', alert: 'sev-crit', '': '' }
const labelOf = (k: string) => VITAL_FIELDS.find((f) => f.k === k)?.label ?? k

function fmtBP(m: Measurement) {
  return m.bp_sys || m.bp_dia ? `${m.bp_sys ?? '–'}/${m.bp_dia ?? '–'}` : ''
}

export function ExamVitalsForm({ id, initial }: { id: string; initial: Measurement[] }) {
  const [state, action, pending] = useActionState<ExamState, FormData>(saveVitals, {})
  const [rows, setRows] = useState<Measurement[]>(Array.isArray(initial) ? initial : [])
  const [cur, setCur] = useState<Measurement>({})
  const setC = (k: string, v: string) => setCur((s) => ({ ...s, [k]: v }))

  const addRow = () => {
    const hasAny = VITAL_FIELDS.some((f) => (cur[f.k] ?? '') !== '')
    if (!hasAny) return
    const bmi = computeBmi(cur.weight, cur.height)
    const at = new Date().toLocaleString('hu-HU', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    setRows((r) => [...r, { ...cur, bmi, at }])
    setCur({})
  }
  const rmRow = (i: number) => setRows((r) => r.filter((_, j) => j !== i))

  const curBmi = computeBmi(cur.weight, cur.height)

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="vitals" value={JSON.stringify(rows)} />

      <div className="safety-note">A színezés (🟢/🟡/🔴) nem diagnózis — csak jelzi, hogy az érték a referencia körül van (🟢), eltér (🟡), vagy jelentősen eltér és sürgős klinikai figyelmet igényelhet (🔴).</div>

      <div className="sec-h"><span className="sec-t">Új mérés rögzítése</span></div>
      {VITAL_FIELDS.map((f) => {
        const z = vitalZone(f.k, cur[f.k])
        return (
          <div className="as-vitrow" key={f.k} style={{ marginBottom: 8 }}>
            <span className="as-vl">{f.label}</span>
            <input className="as-vin" type="text" inputMode="decimal" placeholder={f.ph} value={cur[f.k] ?? ''} onChange={(e) => setC(f.k, e.target.value)} />
            <span className="as-vu">{f.unit}</span>
            {z && <span className={`ekg-sev ${ZONE_CLS[z]}`}>{ZONE_DOT[z]}</span>}
          </div>
        )
      })}
      {curBmi && <div className="as-vitrow" style={{ marginBottom: 8 }}><span className="as-vl">BMI (számított)</span><b>{curBmi}</b>{vitalZone('bmi', curBmi) && <span className={`ekg-sev ${ZONE_CLS[vitalZone('bmi', curBmi)]}`}>{ZONE_DOT[vitalZone('bmi', curBmi)]}</span>}</div>}
      <button type="button" className="btn ghost sm" onClick={addRow}>+ Mérés hozzáadása</button>

      {rows.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Rögzített mérések</span></div>
          {rows.map((m, i) => (
            <div className="card" key={i} style={{ padding: '10px 12px' }}>
              <div className="row" style={{ border: 'none', padding: 0 }}><b style={{ fontSize: 13 }}>{m.at ?? `#${i + 1}`}</b><button type="button" className="sh-back" style={{ padding: 0 }} onClick={() => rmRow(i)}>✕</button></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                {fmtBP(m) && <span>RR {fmtBP(m)} {ZONE_DOT[vitalZone('bp_sys', m.bp_sys)]}</span>}
                {VITAL_FIELDS.filter((f) => f.k !== 'bp_sys' && f.k !== 'bp_dia' && f.k !== 'weight' && f.k !== 'height').map((f) => (m[f.k] ? <span key={f.k}>{f.label.split(' ')[0]} {m[f.k]}{f.k === 'spo2' ? '%' : ''} {ZONE_DOT[vitalZone(f.k, m[f.k])]}</span> : null))}
                {m.bmi && <span>BMI {m.bmi} {ZONE_DOT[vitalZone('bmi', m.bmi)]}</span>}
              </div>
            </div>
          ))}

          {rows.length >= 2 && (
            <>
              <div className="sec-h"><span className="sec-t">Trend</span></div>
              <div className="card" style={{ padding: '10px 12px' }}>
                {VITAL_TREND.map((k) => {
                  const seq = rows.map((m) => (k === 'bp_sys' ? fmtBP(m) : m[k])).filter((x) => x)
                  if (seq.length < 2) return null
                  return <div key={k} style={{ marginBottom: 4 }}><b style={{ fontSize: 13 }}>{k === 'bp_sys' ? 'Vérnyomás' : labelOf(k)}:</b> {seq.join('  →  ')}</div>
                })}
              </div>
            </>
          )}
        </>
      )}

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%', marginTop: 12 }}>{pending ? 'Mentés…' : 'Vitálisok mentése'}</button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
