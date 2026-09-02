'use client'

import { useState, useTransition } from 'react'
import { submitAssignment } from '@/lib/education/assignments-actions'
import {
  STATUS_LABEL, lejart, osszPont,
  type Assignment, type StudentQuestion,
} from '@/lib/education/assignments'

/**
 * Feladat kitöltése — hallgatói nézet.
 *
 * A helyes válasz nem kerül a böngészőbe: a kiértékelés az adatbázisban
 * történik, és a kliens csak a megjelölt válaszokat küldi el. Enélkül a
 * megoldás a hálózati válaszban látszana.
 */
export function AssignmentRunner({
  assignment, questions, submissions,
}: {
  assignment: Assignment
  questions: StudentQuestion[]
  submissions: { attempt: number; pct: number; passed: boolean; submitted_at: string; feedback: string | null }[]
}) {
  const [pending, start] = useTransition()
  const [valaszok, setValaszok] = useState<Record<string, { picked?: string[]; text?: string }>>({})
  const [eredmeny, setEredmeny] = useState<{ pct: number; passed: boolean } | null>(null)
  const [hiba, setHiba] = useState<string | null>(null)
  const [kitolt, setKitolt] = useState(false)

  const beadva = submissions.length
  const tobbet = assignment.max_attempts == null || beadva < assignment.max_attempts
  const zarva = assignment.status !== 'open' || lejart(assignment)
  const legjobb = submissions.reduce<number>((m, s) => Math.max(m, s.pct), 0)

  const valt = (qid: string, oid: string, tobb: boolean) => {
    setValaszok((v) => {
      const most = v[qid]?.picked ?? []
      const uj = tobb
        ? (most.includes(oid) ? most.filter((x) => x !== oid) : [...most, oid])
        : [oid]
      return { ...v, [qid]: { picked: uj } }
    })
  }

  const megvalaszolt = questions.filter((q) =>
    q.kind === 'short'
      ? (valaszok[q.id]?.text ?? '').trim().length > 0
      : (valaszok[q.id]?.picked ?? []).length > 0,
  ).length

  const bead = () =>
    start(async () => {
      setHiba(null)
      const r = await submitAssignment(assignment.id, valaszok)
      if (!r.ok) { setHiba(r.message); return }
      setEredmeny({ pct: r.pct ?? 0, passed: r.passed ?? false })
      setKitolt(false)
    })

  /* ── Eredmény a beadás után ── */
  if (eredmeny) {
    return (
      <>
        <div className={`card ${eredmeny.passed ? 'vg-find ok' : 'vg-find warn'}`}>
          <div className="row" style={{ border: 'none', padding: 0 }}>
            <b style={{ fontSize: 22 }}>{eredmeny.pct}%</b>
            <span className={`mp-badge ${eredmeny.passed ? 'approved' : 'pending'}`}>
              {eredmeny.passed ? 'Teljesítve' : 'Nem érte el a küszöböt'}
            </span>
          </div>
          <p className="sub" style={{ margin: '8px 0 0' }}>
            A teljesítéshez {assignment.pass_pct}% szükséges.
          </p>
        </div>
        <button className="btn ghost" style={{ width: '100%' }} onClick={() => setEredmeny(null)}>
          Vissza a feladathoz
        </button>
      </>
    )
  }

  /* ── Kitöltés ── */
  if (kitolt) {
    return (
      <>
        <div className="card">
          <div className="row" style={{ border: 'none', padding: 0 }}>
            <span className="sub" style={{ margin: 0 }}>
              {megvalaszolt} / {questions.length} kérdés megválaszolva
            </span>
            <b>{osszPont(questions)} pont</b>
          </div>
          <div className="ekg-prog-bar" style={{ marginTop: 8 }}>
            <div style={{ width: `${(megvalaszolt / Math.max(1, questions.length)) * 100}%` }} />
          </div>
        </div>

        {questions.map((q, i) => (
          <div className="card" key={q.id}>
            <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
              <b style={{ flex: 1, fontSize: 15 }}>{i + 1}. {q.prompt}</b>
              <span className="sub" style={{ margin: 0, fontSize: 12 }}>{q.points} pont</span>
            </div>

            {q.kind === 'short' ? (
              <input
                className="field" style={{ marginTop: 10 }}
                value={valaszok[q.id]?.text ?? ''}
                onChange={(e) => setValaszok((v) => ({ ...v, [q.id]: { text: e.target.value } }))}
                placeholder="Írd be a válaszod"
                aria-label={`Válasz a ${i + 1}. kérdésre`}
              />
            ) : (
              <div style={{ marginTop: 10 }}>
                {q.kind === 'multi' && (
                  <p className="sub" style={{ margin: '0 0 8px', fontSize: 12 }}>
                    Több válasz is helyes lehet.
                  </p>
                )}
                {q.options.map((o) => {
                  const be = (valaszok[q.id]?.picked ?? []).includes(o.id)
                  return (
                    <button
                      key={o.id} type="button"
                      className={`vg-opt ${be ? 'jo' : ''}`}
                      onClick={() => valt(q.id, o.id, q.kind === 'multi')}
                    >
                      {o.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {hiba && <div className="form-err">{hiba}</div>}

        <div className="row" style={{ border: 'none', gap: 8, marginTop: 10 }}>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => setKitolt(false)} disabled={pending}>
            Mégsem
          </button>
          <button className="btn" style={{ flex: 2 }} onClick={bead} disabled={pending || megvalaszolt === 0}>
            {pending ? 'Beadás…' : 'Beadás'}
          </button>
        </div>
        {megvalaszolt < questions.length && (
          <p className="sub" style={{ marginTop: 8, fontSize: 12 }}>
            A meg nem válaszolt kérdések nem érnek pontot.
          </p>
        )}
      </>
    )
  }

  /* ── Áttekintés ── */
  return (
    <>
      <div className="card">
        <div className="row" style={{ border: 'none', padding: 0 }}>
          <span className="sub" style={{ margin: 0 }}>Állapot</span>
          <span className={`mp-badge ${assignment.status === 'open' ? 'approved' : 'inactive'}`}>
            {lejart(assignment) ? 'Határidő lejárt' : STATUS_LABEL[assignment.status]}
          </span>
        </div>
        <div className="mp-meta">
          <span>{questions.length} kérdés</span>
          <span>{osszPont(questions)} pont</span>
          <span>Teljesítés: {assignment.pass_pct}%</span>
          {assignment.due_at && <span>Határidő: {assignment.due_at.slice(0, 16).replace('T', ' ')}</span>}
          {assignment.max_attempts != null && (
            <span>Beadható: {assignment.max_attempts} alkalommal</span>
          )}
        </div>
      </div>

      {submissions.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Beadásaid</span></div>
          {submissions.map((s) => (
            <div className="card" key={s.attempt}>
              <div className="row" style={{ border: 'none', padding: 0 }}>
                <span>
                  <b>{s.attempt}. beadás</b>
                  <span className="sub" style={{ display: 'block', margin: 0, fontSize: 12 }}>
                    {s.submitted_at.slice(0, 16).replace('T', ' ')}
                  </span>
                </span>
                <span style={{ fontWeight: 800, color: s.passed ? 'var(--ok)' : 'var(--warn)' }}>
                  {s.pct}%
                </span>
              </div>
              {s.feedback && (
                <p className="vg-tanulsag" style={{ marginTop: 10 }}>
                  <b>Oktatói visszajelzés.</b> {s.feedback}
                </p>
              )}
            </div>
          ))}
          {submissions.length > 1 && (
            <p className="sub" style={{ fontSize: 12 }}>Legjobb eredményed: {legjobb}%</p>
          )}
        </>
      )}

      {zarva ? (
        <div className="safety-note">
          {lejart(assignment)
            ? 'A beadási határidő lejárt.'
            : 'A feladat jelenleg nincs megnyitva.'}
        </div>
      ) : questions.length === 0 ? (
        <div className="safety-note">A feladathoz még nincs kérdés.</div>
      ) : tobbet ? (
        <button className="btn" style={{ width: '100%', marginTop: 12 }} onClick={() => setKitolt(true)}>
          {beadva > 0 ? 'Újabb beadás' : 'Feladat megkezdése'}
        </button>
      ) : (
        <div className="safety-note">
          Elhasználtad a megengedett {assignment.max_attempts} beadást.
        </div>
      )}
    </>
  )
}
