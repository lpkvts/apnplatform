'use client'
import { useActionState, useState } from 'react'
import { saveAnamnesis, type ExamState } from '@/app/klinika/vizsgalat/actions'
import { COMPLAINT_CATS, OPQRST, PAST_CONDITIONS, MED_FLAGS, FAMILY_CONDITIONS, ALLERGY_STATUS } from '@/lib/exam/data'

interface Med { name: string; dose: string; freq: string; indication: string }
interface Anamnesis {
  complaint?: string; complaint_cat?: string
  opqrst?: Record<string, string>
  past?: string[]; past_other?: string
  surgeries?: string
  meds?: Med[]; med_flags?: string[]; med_note?: string
  allergy_status?: string; allergy_agent?: string; allergy_reaction?: string; allergy_severity?: string
  social?: Record<string, string>
  family?: string[]; family_note?: string
}

const SOCIAL_FIELDS: { k: string; label: string }[] = [
  { k: 'smoking', label: 'Dohányzás' }, { k: 'alcohol', label: 'Alkohol' }, { k: 'substance', label: 'Egyéb szerhasználat' },
  { k: 'occupation', label: 'Foglalkozás' }, { k: 'activity', label: 'Fizikai aktivitás' }, { k: 'diet', label: 'Táplálkozás' },
  { k: 'living', label: 'Lakókörnyezet' }, { k: 'selfcare', label: 'Önellátási képesség' }, { k: 'support', label: 'Támogatói háttér' },
]

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={`sh-chip ${on ? 'on' : ''}`} onClick={onClick}>{children}</button>
}

export function ExamAnamnesisForm({ id, initial, education }: { id: string; initial: Anamnesis; education?: boolean }) {
  const [state, action, pending] = useActionState<ExamState, FormData>(saveAnamnesis, {})
  const [a, setA] = useState<Anamnesis>({ meds: [], past: [], med_flags: [], family: [], opqrst: {}, social: {}, allergy_status: 'none', ...initial })
  const set = (patch: Partial<Anamnesis>) => setA((s) => ({ ...s, ...patch }))
  const toggle = (key: 'past' | 'med_flags' | 'family', v: string) => setA((s) => { const arr = new Set(s[key] ?? []); arr.has(v) ? arr.delete(v) : arr.add(v); return { ...s, [key]: [...arr] } })
  const setOpq = (k: string, v: string) => setA((s) => ({ ...s, opqrst: { ...(s.opqrst ?? {}), [k]: v } }))
  const setSoc = (k: string, v: string) => setA((s) => ({ ...s, social: { ...(s.social ?? {}), [k]: v } }))
  const meds = a.meds ?? []
  const setMed = (i: number, patch: Partial<Med>) => setA((s) => { const m = [...(s.meds ?? [])]; m[i] = { ...m[i], ...patch }; return { ...s, meds: m } })
  const addMed = () => setA((s) => ({ ...s, meds: [...(s.meds ?? []), { name: '', dose: '', freq: '', indication: '' }] }))
  const rmMed = (i: number) => setA((s) => ({ ...s, meds: (s.meds ?? []).filter((_, j) => j !== i) }))

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="anamnesis" value={JSON.stringify(a)} />

      {education && <div className="safety-note">🎓 Oktatási munkamenet — valós betegazonosító adatot ne rögzíts.</div>}

      <div className="sec-h"><span className="sec-t">Vezető panasz</span></div>
      <input className="field" placeholder="pl. mellkasi fájdalom 2 órája" value={a.complaint ?? ''} onChange={(e) => set({ complaint: e.target.value })} />
      <div className="sh-chips">{COMPLAINT_CATS.map((c) => <Chip key={c} on={a.complaint_cat === c} onClick={() => set({ complaint_cat: a.complaint_cat === c ? '' : c })}>{c}</Chip>)}</div>

      <div className="sec-h"><span className="sec-t">A panasz jellemzése (OPQRST)</span></div>
      {OPQRST.map((f) => (
        <div key={f.k}><div className="as-lbl">{f.label} — {f.q}</div>
          <input className="field" value={a.opqrst?.[f.k] ?? ''} onChange={(e) => setOpq(f.k, e.target.value)} /></div>
      ))}

      <div className="sec-h"><span className="sec-t">Korábbi betegségek</span></div>
      <div className="sh-chips">{PAST_CONDITIONS.map((c) => <Chip key={c} on={(a.past ?? []).includes(c)} onClick={() => toggle('past', c)}>{c}</Chip>)}</div>
      <input className="field" placeholder="Egyéb korábbi betegség…" value={a.past_other ?? ''} onChange={(e) => set({ past_other: e.target.value })} />

      <div className="sec-h"><span className="sec-t">Műtétek / kórházi előzmények</span></div>
      <textarea className="as-ta" rows={2} placeholder="Korábbi műtétek, hospitalizációk, intenzív kezelés, súlyos akut események…" value={a.surgeries ?? ''} onChange={(e) => set({ surgeries: e.target.value })} />

      <div className="sec-h"><span className="sec-t">Gyógyszerelés</span></div>
      {meds.map((m, i) => (
        <div className="card" key={i} style={{ padding: '10px 12px' }}>
          <div className="row" style={{ border: 'none', padding: 0 }}><b style={{ fontSize: 13 }}>Gyógyszer #{i + 1}</b><button type="button" className="sh-back" style={{ padding: 0 }} onClick={() => rmMed(i)}>✕</button></div>
          <input className="field" placeholder="Név" value={m.name} onChange={(e) => setMed(i, { name: e.target.value })} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="field" placeholder="Dózis" value={m.dose} onChange={(e) => setMed(i, { dose: e.target.value })} />
            <input className="field" placeholder="Gyakoriság" value={m.freq} onChange={(e) => setMed(i, { freq: e.target.value })} />
          </div>
          <input className="field" placeholder="Indikáció" value={m.indication} onChange={(e) => setMed(i, { indication: e.target.value })} />
        </div>
      ))}
      <button type="button" className="btn ghost sm" onClick={addMed}>+ Gyógyszer hozzáadása</button>
      <div className="as-lbl" style={{ marginTop: 10 }}>Kiemelt gyógyszercsoportok</div>
      <div className="sh-chips">{MED_FLAGS.map((c) => <Chip key={c} on={(a.med_flags ?? []).includes(c)} onClick={() => toggle('med_flags', c)}>{c}</Chip>)}</div>
      <input className="field" placeholder="Gyógyszerelési megjegyzés (pl. újonnan indított, probléma)…" value={a.med_note ?? ''} onChange={(e) => set({ med_note: e.target.value })} />

      <div className="card" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
        <b>⚠️ Allergia</b>
        <div className="sh-chips" style={{ marginTop: 6 }}>{ALLERGY_STATUS.map((s) => <Chip key={s.v} on={a.allergy_status === s.v} onClick={() => set({ allergy_status: s.v })}>{s.l}</Chip>)}</div>
        {a.allergy_status === 'yes' && (
          <div style={{ marginTop: 8 }}>
            <input className="field" placeholder="Szer" value={a.allergy_agent ?? ''} onChange={(e) => set({ allergy_agent: e.target.value })} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="field" placeholder="Reakció" value={a.allergy_reaction ?? ''} onChange={(e) => set({ allergy_reaction: e.target.value })} />
              <input className="field" placeholder="Súlyosság" value={a.allergy_severity ?? ''} onChange={(e) => set({ allergy_severity: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      <div className="sec-h"><span className="sec-t">Szociális anamnézis</span></div>
      {SOCIAL_FIELDS.map((f) => (
        <div key={f.k}><div className="as-lbl">{f.label}</div><input className="field" value={a.social?.[f.k] ?? ''} onChange={(e) => setSoc(f.k, e.target.value)} /></div>
      ))}

      <div className="sec-h"><span className="sec-t">Családi anamnézis</span></div>
      <div className="sh-chips">{FAMILY_CONDITIONS.map((c) => <Chip key={c} on={(a.family ?? []).includes(c)} onClick={() => toggle('family', c)}>{c}</Chip>)}</div>
      <input className="field" placeholder="Megjegyzés…" value={a.family_note ?? ''} onChange={(e) => set({ family_note: e.target.value })} />

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%', marginTop: 12 }}>{pending ? 'Mentés…' : 'Anamnézis mentése'}</button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
