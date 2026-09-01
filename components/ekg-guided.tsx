'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EcgViewer } from '@/components/ecg-viewer'
import { ANALYSIS_STEPS, type AnalysisQuestion, type StepId } from '@/lib/ekg/analysis'
import { qtc } from '@/lib/ekg/render'
import { saveEkgAttempt } from '@/lib/ekg/progress'
import { AxisDiagram, LeadRegionsDiagram } from '@/components/ekg-abrak'
import { GUIDELINE_SOURCES, registryFor, checkQuery } from '@/lib/sources/data'
import type { EcgCase } from '@/lib/ekg/analysis'

/**
 * Vezetett EKG-elemzés: a 11 lépéses folyamat végigvezetése.
 *
 * A felhasználó nem olvassa, hanem válaszol. Hibás válasz vagy segítségkérés után
 * kontextuális magyarázat jelenik meg, és onnan a meglévő EKG tananyag pontos
 * részére lehet ugrani — visszatérve ugyanahhoz a lépéshez.
 */

export interface StepAnswer {
  step: StepId
  questionId: string
  picked: string
  correct: boolean
  usedHint: boolean
}

export function GuidedAnalysis({
  ecgCase, onFinish,
}: {
  ecgCase: EcgCase
  onFinish?: (answers: StepAnswer[]) => void
}) {
  const [idx, setIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [usedHint, setUsedHint] = useState(false)
  const [answers, setAnswers] = useState<StepAnswer[]>([])
  const [done, setDone] = useState(false)

  const step = ANALYSIS_STEPS[idx]
  const questions: AnalysisQuestion[] = ecgCase.questions[step.id] ?? []
  const q: AnalysisQuestion | undefined = questions[qIdx]
  const reference = ecgCase.reference[step.id]
  const isLast = idx === ANALYSIS_STEPS.length - 1

  const pick = (optId: string) => {
    if (picked || !q) return
    setPicked(optId)
    const correct = q.correct.includes(optId)
    setAnswers((a) => [...a, { step: step.id, questionId: q.id, picked: optId, correct, usedHint }])
  }

  const next = () => {
    if (q && qIdx < questions.length - 1) {
      setQIdx(qIdx + 1); setPicked(null); setShowHint(false); setUsedHint(false)
      return
    }
    if (isLast) {
      setDone(true)
      onFinish?.(answers)
      // A fejlődéskövetéshez lépésenként mentjük a válaszokat: a kompetencia
      // abból derül ki, melyik elemzési lépésnél tévedett a felhasználó.
      void saveEkgAttempt('guided', ecgCase.id, answers.map((a) => ({
        step: a.step,
        verdict: a.correct ? 'ok' : 'off',
        usedHint: a.usedHint,
      })))
      return
    }
    setIdx(idx + 1); setQIdx(0); setPicked(null); setShowHint(false); setUsedHint(false)
  }

  const back = () => {
    if (idx === 0) return
    setIdx(idx - 1); setQIdx(0); setPicked(null); setShowHint(false); setUsedHint(false)
  }

  if (done) {
    const total = answers.length
    const good = answers.filter((a) => a.correct).length
    const hints = answers.filter((a) => a.usedHint).length
    return (
      <>
        <div className="sec-h"><span className="sec-t">Elemzés kész</span></div>
        <div className="card">
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-num">{total ? Math.round((good / total) * 100) : 0}%</div><div className="stat-lbl">Helyes válasz</div></div>
            <div className="stat-card"><div className="stat-num">{good}/{total}</div><div className="stat-lbl">Kérdés</div></div>
            <div className="stat-card"><div className="stat-num">{hints}</div><div className="stat-lbl">Segítség</div></div>
          </div>
        </div>

        <div className="sec-h"><span className="sec-t">Referenciaelemzés</span></div>
        {ANALYSIS_STEPS.map((s) => ecgCase.reference[s.id] && (
          <div className="card" key={s.id} style={{ marginBottom: 8 }}>
            <b style={{ fontSize: 14 }}>{s.no} · {s.title}</b>
            <div className="sub" style={{ marginTop: 4 }}>{ecgCase.reference[s.id]}</div>
          </div>
        ))}

        <div className="sec-h"><span className="sec-t">Kiemelt eltérések</span></div>
        {ecgCase.findings.map((f, i) => (
          <details className="kt-acc" key={i}>
            <summary className="kt-sum"><span>{f.title}</span></summary>
            <div className="kt-body">
              <div className="card">
                <b style={{ fontSize: 13 }}>Mit látunk?</b><div className="sub" style={{ marginTop: 2 }}>{f.what}</div>
                <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Hol látjuk?</b><div className="sub" style={{ marginTop: 2 }}>{f.where}</div>
                <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Mit jelenthet?</b><div className="sub" style={{ marginTop: 2 }}>{f.meaning}</div>
                <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Differenciáldiagnosztika</b>
                <ul className="sub" style={{ marginTop: 2, paddingLeft: 18 }}>{f.ddx.map((d, j) => <li key={j}>{d}</li>)}</ul>
                <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Miért fontos?</b><div className="sub" style={{ marginTop: 2 }}>{f.why}</div>
              </div>
            </div>
          </details>
        ))}

        <div className="sec-h"><span className="sec-t">Szakmai háttér</span></div>
        {ecgCase.evidence.map((e, i) => {
          // A forrás adatai a központi regiszterből jönnek, nem az esetből —
          // így a frissítés és a visszavonás egy helyen látszik.
          const src = GUIDELINE_SOURCES.find((g) => g.id === e.sourceId)
          if (!src) {
            return (
              <div className="card" key={i} style={{ marginBottom: 8 }}>
                <p className="form-err" style={{ margin: 0 }}>
                  Hivatkozott forrás nem található a regiszterben: <code>{e.sourceId}</code>
                </p>
              </div>
            )
          }
          const today = new Date().toISOString().slice(0, 10)
          const due = src.reviewNext ? src.reviewNext <= today : false
          const reg = registryFor(src)
          return (
            <div className="card" key={i} style={{ marginBottom: 8 }}>
              <b style={{ fontSize: 14 }}>{src.title}</b>
              <div className="sub" style={{ marginTop: 4 }}>
                {[src.org, src.year, src.identifier ? `azonosító: ${src.identifier}` : null,
                  src.intl ? 'nemzetközi' : 'magyar', src.primary ? 'elsődleges' : 'kiegészítő',
                  e.level ? `bizonyíték: ${e.level}` : null, src.status].filter(Boolean).join(' · ')}
              </div>
              <div className="sub" style={{ marginTop: 2, fontSize: 12 }}>
                {src.lastChecked && <>Utolsó ellenőrzés: {src.lastChecked}</>}
                {src.reviewNext && <> · Következő felülvizsgálat: {src.reviewNext}</>}
              </div>
              {e.note && <div className="sub" style={{ marginTop: 6 }}>{e.note}</div>}
              {src.versionNote && <div className="sub" style={{ marginTop: 4, fontSize: 12 }}>{src.versionNote}</div>}
              {src.supersededBy && (
                <div className="safety-note" style={{ marginTop: 6 }}>
                  ⚠️ Újabb kiadás váltotta fel: <b>{src.supersededBy}</b>
                </div>
              )}
              {due && (
                <div className="safety-note" style={{ marginTop: 6, borderLeftColor: '#C0392B' }}>
                  🔴 Felülvizsgálat esedékes — a forrás aktualitása ellenőrizendő.
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                <Link className="btn ghost sm" href={`/klinika/tudastar?q=${encodeURIComponent(checkQuery(src))}`}>
                  Forrás a Tudástárban
                </Link>
                {reg && <a className="btn ghost sm" href={reg.url} target="_blank" rel="noopener">Verzió ellenőrzése</a>}
              </div>
            </div>
          )
        })}

        <div className="safety-note" style={{ marginTop: 10 }}>
          <b>ⓘ Oktatási eszköz.</b> A megjelenített görbék szintetizáltak, nem valódi betegfelvételek.
          A rendszer egyetlen EKG-jel alapján nem állít fel diagnózist — a klinikai döntés mindig a
          beteg állapotának és a teljes kontextusnak az ismeretében születik.
        </div>

        <Link className="btn ghost" href="/klinika/ekg" style={{ width: '100%', marginTop: 12 }}>Vissza az EKG modulhoz</Link>
      </>
    )
  }

  const correct = picked ? (q?.correct.includes(picked) ?? false) : null

  return (
    <>
      {/* Klinikai kontextus */}
      <div className="card">
        <b style={{ fontSize: 14 }}>{ecgCase.age} éves {ecgCase.sex}</b>
        <div className="sub" style={{ marginTop: 4 }}>{ecgCase.vignette}</div>
      </div>

      {/* Haladás */}
      <div className="ekg-an-head">
        <span className="ekg-an-step">{step.no} / 11 · {step.title}</span>
        <span className="sub" style={{ margin: 0, fontSize: 12 }}>{ANALYSIS_STEPS.length - idx - 1} lépés van hátra</span>
      </div>
      <div className="ekg-prog-bar"><div style={{ width: `${((idx + 1) / ANALYSIS_STEPS.length) * 100}%` }} /></div>

      {/* EKG */}
      <EcgViewer params={ecgCase.params} highlight={q?.highlight ?? step.highlight} />

      {/* Aktuális lépés */}
      <div className="card" style={{ marginTop: 10 }}>
        <b style={{ fontSize: 15 }}>{step.title}</b>
        <div className="sub" style={{ marginTop: 4 }}>{step.aim}</div>

        {step.id === 'qt' && (
          <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>
            Segítség az ellenőrzéshez: {ecgCase.params.rate}/perc mellett a mért {ecgCase.params.qtMs} ms QT
            Bazett szerint kb. {qtc(ecgCase.params.qtMs, ecgCase.params.rate)} ms QTc.
          </div>
        )}

        {q ? (
          <>
            <div className="eq-h" style={{ marginTop: 12 }}>{q.prompt}</div>
            <div className="eq-opts">
              {q.options.map((o) => {
                const state = picked
                  ? q.correct.includes(o.id) ? 'right' : (o.id === picked ? 'wrong' : '')
                  : ''
                return (
                  <button key={o.id} className={`eq-opt ${state}`} onClick={() => pick(o.id)} disabled={!!picked}>
                    {o.label}
                  </button>
                )
              })}
            </div>
            {picked && (
              <div className={`eq-fb ${correct ? 'ok' : 'no'}`}>
                <b>{correct ? '✓ Helyes.' : '✕ Nem ez a helyes válasz.'}</b>
                <div className="eq-expl" style={{ marginTop: 6 }}>{q.explain}</div>
              </div>
            )}
          </>
        ) : (
          <div className="sub" style={{ marginTop: 10 }}>
            {reference ?? 'Ehhez a lépéshez ennél az esetnél nincs külön kérdés — nézd meg az EKG-t a szempont szerint, majd lépj tovább.'}
          </div>
        )}

        {/* Segítség */}
        {!showHint ? (
          <button
            className="btn ghost sm" style={{ marginTop: 10 }}
            onClick={() => { setShowHint(true); setUsedHint(true) }}
          >
            💡 Segítség
          </button>
        ) : (
          <div className="ekg-hint">
            <b>💡 Segítség</b>
            <div className="sub" style={{ marginTop: 4 }}>{step.hint}</div>

            {/* Ahol az összefüggés térbeli, ott ábra is segít: a tengelyállásnál
                a két meghatározó elvezetés, az ST-T eltéréseknél a területek. */}
            {step.id === 'tengely' && <AxisDiagram />}
            {(step.id === 'st' || step.id === 't') && <LeadRegionsDiagram />}

            {step.teach && (
              <Link className="btn ghost sm" style={{ marginTop: 8 }}
                href={`/klinika/ekg?open=${step.teach}&vissza=${ecgCase.id}&lepes=${step.id}`}>
                📚 {step.teachLabel ?? 'Ismétlés'} →
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="row" style={{ border: 'none', gap: 8, marginTop: 12 }}>
        <button className="btn ghost" onClick={back} disabled={idx === 0} style={{ flex: 1 }}>‹ Előző</button>
        <button className="btn" onClick={next} disabled={!!q && !picked} style={{ flex: 2 }}>
          {isLast ? 'Elemzés lezárása' : 'Következő lépés ›'}
        </button>
      </div>
    </>
  )
}
