'use client'
import { useActionState, useState } from 'react'
import { saveGeneralExam, type ExamState } from '@/app/klinika/vizsgalat/actions'
import {
  GENERAL_STATE, CONSCIOUSNESS, AVPU_OPTS, NUTRITION_FLAGS,
  SKIN_COLOR, SKIN_TEMP, SKIN_MOIST, SKIN_TURGOR, SKIN_FINDINGS,
  HYDRATION, OEDEMA_LOC, OEDEMA_SEV,
} from '@/lib/exam/data'

interface GEx {
  general_state?: string; consciousness?: string; avpu?: string
  build?: string; nutrition_flags?: string[]
  skin_color?: string; skin_temp?: string; skin_moist?: string; skin_turgor?: string; skin_findings?: string[]; skin_note?: string
  hydration?: string; oedema?: string[]; oedema_severity?: string; note?: string
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={`sh-chip ${on ? 'on' : ''}`} onClick={onClick}>{children}</button>
}
function Single({ label, opts, value, onSet }: { label: string; opts: string[]; value?: string; onSet: (v: string) => void }) {
  return (<><div className="as-lbl">{label}</div><div className="sh-chips">{opts.map((o) => <Chip key={o} on={value === o} onClick={() => onSet(value === o ? '' : o)}>{o}</Chip>)}</div></>)
}

export function ExamGeneralForm({ id, initial }: { id: string; initial: GEx }) {
  const [state, action, pending] = useActionState<ExamState, FormData>(saveGeneralExam, {})
  const [g, setG] = useState<GEx>({ nutrition_flags: [], skin_findings: [], oedema: [], ...initial })
  const set = (patch: Partial<GEx>) => setG((s) => ({ ...s, ...patch }))
  const toggle = (key: 'nutrition_flags' | 'skin_findings' | 'oedema', v: string) =>
    setG((s) => { const a = new Set(s[key] ?? []); a.has(v) ? a.delete(v) : a.add(v); return { ...s, [key]: [...a] } })

  // Nem-diagnosztikus figyelemfelhívás kritikus választásokra
  const hints: string[] = []
  if (g.general_state === 'kritikus') hints.push('kritikus általános állapot')
  if (g.consciousness === 'sopor' || g.consciousness === 'coma') hints.push(`tudatállapot: ${g.consciousness}`)
  if (g.avpu === 'P' || g.avpu === 'U') hints.push('AVPU: csökkent reaktivitás')
  if (g.skin_color === 'cyanotikus') hints.push('cyanosis')

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="general_exam" value={JSON.stringify(g)} />

      <Single label="Általános állapot" opts={GENERAL_STATE} value={g.general_state} onSet={(v) => set({ general_state: v })} />

      <div className="sec-h"><span className="sec-t">Tudatállapot</span></div>
      <div className="sh-chips">{CONSCIOUSNESS.map((c) => <Chip key={c} on={g.consciousness === c} onClick={() => set({ consciousness: g.consciousness === c ? '' : c })}>{c}</Chip>)}</div>
      <div className="as-lbl">AVPU (opcionális)</div>
      <div className="sh-chips">{AVPU_OPTS.map((o) => <Chip key={o.v} on={g.avpu === o.v} onClick={() => set({ avpu: g.avpu === o.v ? '' : o.v })}>{o.l}</Chip>)}</div>

      <div className="sec-h"><span className="sec-t">Testalkat és tápláltság</span></div>
      <input className="field" placeholder="Testalkat (pl. normostheniás, astheniás, obes)…" value={g.build ?? ''} onChange={(e) => set({ build: e.target.value })} />
      <div className="sh-chips">{NUTRITION_FLAGS.map((c) => <Chip key={c} on={(g.nutrition_flags ?? []).includes(c)} onClick={() => toggle('nutrition_flags', c)}>{c}</Chip>)}</div>

      <div className="sec-h"><span className="sec-t">Bőr</span></div>
      <Single label="Szín" opts={SKIN_COLOR} value={g.skin_color} onSet={(v) => set({ skin_color: v })} />
      <Single label="Hőmérséklet" opts={SKIN_TEMP} value={g.skin_temp} onSet={(v) => set({ skin_temp: v })} />
      <Single label="Nedvesség" opts={SKIN_MOIST} value={g.skin_moist} onSet={(v) => set({ skin_moist: v })} />
      <Single label="Turgor" opts={SKIN_TURGOR} value={g.skin_turgor} onSet={(v) => set({ skin_turgor: v })} />
      <div className="as-lbl">Eltérések</div>
      <div className="sh-chips">{SKIN_FINDINGS.map((c) => <Chip key={c} on={(g.skin_findings ?? []).includes(c)} onClick={() => toggle('skin_findings', c)}>{c}</Chip>)}</div>
      <input className="field" placeholder="Bőr – megjegyzés (lokáció, jelleg)…" value={g.skin_note ?? ''} onChange={(e) => set({ skin_note: e.target.value })} />

      <Single label="Hydratatio" opts={HYDRATION} value={g.hydration} onSet={(v) => set({ hydration: v })} />

      <div className="sec-h"><span className="sec-t">Oedema</span></div>
      <div className="sh-chips">{OEDEMA_LOC.map((c) => <Chip key={c} on={(g.oedema ?? []).includes(c)} onClick={() => toggle('oedema', c)}>{c}</Chip>)}</div>
      {(g.oedema ?? []).some((x) => x !== 'nincs') && (g.oedema ?? []).length > 0 && (
        <Single label="Súlyosság" opts={OEDEMA_SEV} value={g.oedema_severity} onSet={(v) => set({ oedema_severity: v })} />
      )}

      <div className="as-lbl" style={{ marginTop: 10 }}>Megjegyzés</div>
      <textarea className="as-ta" rows={2} value={g.note ?? ''} onChange={(e) => set({ note: e.target.value })} />

      {hints.length > 0 && (
        <div className="sh-urgent" style={{ marginTop: 10 }}>🚨 Figyelem: a rögzített adatok ({hints.join(', ')}) sürgős klinikai értékelést tehetnek szükségessé. A részletes red flag-kezelés a következő fázisban épül be.</div>
      )}

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%', marginTop: 12 }}>{pending ? 'Mentés…' : 'Általános vizsgálat mentése'}</button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
