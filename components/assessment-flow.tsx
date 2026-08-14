'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ASSESS_STEPS, ASSESS_DOMAINS, ASSESS_VITALS, ASSESS_PROBLEMS,
} from '@/lib/assessment/data'
import { assessInit, vitalFlag, assessRisk, assessSummary, type AssessState } from '@/lib/assessment/logic'
import { TESTS } from '@/lib/scores/data'
import { saveAssessment } from '@/app/klinika/actions'
import { SafetyNote } from '@/components/safety'

export function AssessmentFlow() {
  const [as, setAs] = useState<AssessState>(assessInit())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  const set = (patch: Partial<AssessState>) => setAs((s) => ({ ...s, ...patch }))
  const setF = (k: keyof AssessState['f'], v: string) => setAs((s) => ({ ...s, f: { ...s.f, [k]: v } }))
  const setVit = (k: string, v: string) => setAs((s) => ({ ...s, vit: { ...s.vit, [k]: v } }))
  const last = as.step === ASSESS_STEPS.length - 1

  async function doSave() {
    setSaving(true)
    setSaved(null)
    const d = ASSESS_DOMAINS.find((x) => x.id === as.domain)
    const res = await saveAssessment({
      domain: d ? d.label : as.domain,
      complaint: as.complaint,
      consciousness: as.consc,
      problems: as.problems.map((i) => ASSESS_PROBLEMS[i]),
      vitals: as.vit as Record<string, string>,
      fields: as.f as unknown as Record<string, string>,
      summary: assessSummary(as),
    })
    setSaving(false)
    setSaved(res.ok ? 'Mentve az előzményekbe.' : (res.error ?? 'Mentési hiba.'))
  }

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <div className="as-head">
        <div>
          <div className="h1" style={{ margin: 0 }}>Új betegértékelés</div>
          <div className="as-t2">{as.step + 1}/12 · {ASSESS_STEPS[as.step]}</div>
        </div>
      </div>

      <div className="as-prog">
        {ASSESS_STEPS.map((s, i) => (
          <button
            key={i}
            className={`as-dot ${i === as.step ? 'on' : i < as.step ? 'done' : ''}`}
            title={s}
            onClick={() => set({ step: i })}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="as-body">{renderStep()}</div>

      <div className="as-foot">
        <button className="btn ghost" disabled={as.step === 0} onClick={() => set({ step: Math.max(0, as.step - 1) })}>
          Vissza
        </button>
        {last ? (
          <Link className="btn" href="/klinika">Befejezés</Link>
        ) : (
          <button className="btn" onClick={() => set({ step: Math.min(11, as.step + 1) })}>Következő ›</button>
        )}
      </div>
    </>
  )

  function renderStep() {
    const S = as.step
    if (S === 0) {
      return (
        <>
          <div className="as-step-t">Mi a fő panasz / probléma?</div>
          <div className="as-domain">
            {ASSESS_DOMAINS.map((d) => (
              <button key={d.id} className={`as-dom ${as.domain === d.id ? 'on' : ''}`} onClick={() => set({ domain: d.id })}>
                {d.label}
              </button>
            ))}
          </div>
          <div className="as-lbl">Rövid leírás (opcionális)</div>
          <textarea className="as-ta" rows={2} value={as.complaint}
            placeholder="pl. 3 napja fokozódó nehézlégzés, láz…" onChange={(e) => set({ complaint: e.target.value })} />
        </>
      )
    }
    if (S === 1) {
      return (
        <>
          <div className="as-step-t">Anamnézis</div>
          <div className="as-lbl">Kórelőzmény, a panasz kialakulása</div>
          <textarea className="as-ta" rows={4} value={as.f.anamnez} onChange={(e) => setF('anamnez', e.target.value)} />
          <div className="as-lbl">Állandó gyógyszerek</div>
          <textarea className="as-ta" rows={2} value={as.f.meds} onChange={(e) => setF('meds', e.target.value)} />
          <div className="as-lbl">Allergia</div>
          <textarea className="as-ta" rows={1} value={as.f.allergy} onChange={(e) => setF('allergy', e.target.value)} />
        </>
      )
    }
    if (S === 2) {
      return (
        <>
          <div className="as-step-t">Vitális paraméterek</div>
          {ASSESS_VITALS.map((v) => {
            const fl = vitalFlag(v.k, (as.vit as Record<string, string>)[v.k])
            const cls = fl === 'red' ? 'flag-red' : fl === 'amber' ? 'flag-amber' : ''
            return (
              <div className="as-vitrow" key={v.k}>
                <span className="as-vl">{v.label}</span>
                <input className={`as-vin ${cls}`} type="number" inputMode="decimal"
                  value={(as.vit as Record<string, string>)[v.k]} placeholder={v.ph}
                  onChange={(e) => setVit(v.k, e.target.value)} />
                <span className="as-vu">{v.unit}</span>
                {fl && <span className={`as-flag ${cls}`}>{fl === 'red' ? 'kritikus' : 'figyelendő'}</span>}
              </div>
            )
          })}
          <div className="as-lbl">Tudat (ACVPU)</div>
          <div className="as-pills">
            {['A', 'V', 'P', 'U'].map((x) => (
              <button key={x} className={`as-pill ${as.consc === x ? 'on' : ''}`} onClick={() => set({ consc: x })}>{x}</button>
            ))}
          </div>
        </>
      )
    }
    if (S === 3) return (<><div className="as-step-t">Fizikális vizsgálat</div>
      <textarea className="as-ta" rows={5} value={as.f.physical} onChange={(e) => setF('physical', e.target.value)}
        placeholder="Fizikális status régiónként…" /></>)
    if (S === 4) return (<><div className="as-step-t">Labor</div>
      <Link className="btn ghost sm" href="/klinika/labor">Labor Kisokos megnyitása</Link>
      <div className="as-lbl">Lényeges eredmények</div>
      <textarea className="as-ta" rows={3} value={as.f.lab} onChange={(e) => setF('lab', e.target.value)}
        placeholder="pl. CRP 84, Hb 118…" /></>)
    if (S === 5) return (<><div className="as-step-t">EKG</div>
      <Link className="btn ghost sm" href="/klinika/ekg">EKG Tudástár megnyitása</Link>
      <div className="as-lbl">EKG-lelet</div>
      <textarea className="as-ta" rows={3} value={as.f.ekg} onChange={(e) => setF('ekg', e.target.value)}
        placeholder="pl. sinus tachycardia 108/perc…" /></>)
    if (S === 6) {
      const r = assessRisk(as)
      const has = r.reds.length || r.ambers.length
      return (
        <>
          <div className="as-step-t">Rizikóbecslés</div>
          {r.reds.length > 0 && <div className="sh-urgent">⚠ Kritikus eltérés — sürgős értékelés és orvos értesítése indokolt: {r.reds.join('; ')}</div>}
          {r.ambers.length > 0 && <div className="as-amber">⚠ Figyelendő: {r.ambers.join('; ')}</div>}
          {!has && <p className="sub">Add meg a vitális paramétereket a 3. lépésben az automatikus rizikójelzéshez.</p>}
          <p className="sub">A jelzés a beírt vitális paraméterek tartományain alapul, tájékozódó jellegű.</p>
        </>
      )
    }
    if (S === 7) {
      const d = ASSESS_DOMAINS.find((x) => x.id === as.domain)
      if (!d) return (<><div className="as-step-t">Klinikai score-ok</div><p className="sub">Válaszd ki a fő panaszt az 1. lépésben — ide a helyzethez illő skálák kerülnek.</p></>)
      const recs = d.scores.map((id) => TESTS.find((t) => t.id === id)).filter(Boolean)
      return (
        <>
          <div className="as-step-t">Ajánlott klinikai score-ok</div>
          <p className="sub">A(z) „{d.label}" panaszhoz illő skálák — koppints a kitöltéshez.</p>
          {recs.map((t) => t && (
            <Link key={t.id} className="sh-row" href={`/klinika/tesztek?open=${t.id}`}>
              <span className="sh-row-main"><span className="sh-row-name">{t.name}</span>
                <span className="sh-row-sub">{t.abbr ?? ''}</span></span>
              <span className="sh-chev">›</span>
            </Link>
          ))}
        </>
      )
    }
    if (S === 8) return (
      <>
        <div className="as-step-t">APN problémák azonosítása</div>
        <p className="sub">Jelöld a releváns ápolási / APN problémákat.</p>
        <div className="as-chks">
          {ASSESS_PROBLEMS.map((p, i) => (
            <button key={i} className={`as-chk ${as.problems.includes(i) ? 'on' : ''}`}
              onClick={() => set({ problems: as.problems.includes(i) ? as.problems.filter((x) => x !== i) : [...as.problems, i] })}>
              {p}
            </button>
          ))}
        </div>
      </>
    )
    if (S === 9) {
      const r = assessRisk(as)
      return (
        <>
          <div className="as-step-t">Szakmai döntéstámogatás</div>
          <div className="card"><b>Összegzés</b><p style={{ margin: '6px 0 0' }}>Ez strukturált döntéstámogatás, <b>nem orvosi diagnózis</b>, és nem helyettesíti a klinikai megítélést.</p></div>
          {r.reds.length > 0 && <div className="sh-urgent">⚠ Sürgősségi jelzés: azonnali orvosi értékelés / segélyhívás mérlegelendő.</div>}
          <div className="card"><b>Orvosi konzultáció szükséges, ha</b>
            <ul><li>a vitális paraméterek romlanak vagy kritikus tartományban vannak,</li>
              <li>új vagy súlyosbodó tudatzavar, mellkasi fájdalom, fokális neurológiai tünet,</li>
              <li>a panasz a kompetencia- vagy protokollhatáron túlmutat.</li></ul></div>
          <SafetyNote />
        </>
      )
    }
    if (S === 10) return (<><div className="as-step-t">Javasolt következő lépések</div>
      <textarea className="as-ta" rows={5} value={as.f.next} onChange={(e) => setF('next', e.target.value)}
        placeholder="pl. NEWS2 ismétlése 1 óra múlva, orvosi konzílium…" /></>)
    // S === 11
    return (
      <>
        <div className="as-step-t">Dokumentáció</div>
        <p className="sub">SBAR-szerű összefoglaló — menthető az előzményekbe.</p>
        <textarea className="as-summary" rows={14} readOnly value={assessSummary(as)} />
        <div className="as-doc-actions">
          <button className="btn" onClick={doSave} disabled={saving}>{saving ? 'Mentés…' : 'Mentés az előzményekbe'}</button>
          <button className="btn ghost" onClick={() => { setAs(assessInit()); setSaved(null) }}>Új értékelés</button>
        </div>
        {saved && <p className="sub" style={{ marginTop: 8, color: 'var(--teal-700)' }}>{saved} <Link href="/klinika/elozmenyek">Előzmények →</Link></p>}
        <p className="sh-disc">Döntéstámogató összefoglaló, nem orvosi diagnózis.</p>
      </>
    )
  }
}
