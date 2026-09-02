'use client'

import { useState, useTransition } from 'react'
import {
  setAssignmentStatus, saveQuestion, deleteQuestion, saveFeedback,
  type QuestionInput,
} from '@/lib/education/assignments-actions'
import {
  QKIND_LABEL, QKIND_HINT, STATUS_LABEL, osszPont,
  type Assignment, type Question, type QKind, type Option, type Result, type Status,
} from '@/lib/education/assignments'
import type { CompetencyOption } from '@/lib/education/types'

/**
 * Feladatszerkesztő és eredménynézet — oktatói felület.
 *
 * Három nézet: a kérdések, az állapot, és a hallgatói eredmények. A kérdés
 * kompetenciához rendelhető, így az eredmény nem csak százalék, hanem azt is
 * megmutatja, mely területen áll gyengén a csoport.
 */

type Tab = 'kerdesek' | 'beallitas' | 'eredmenyek'

const UJ_OPCIO = (): Option => ({ id: Math.random().toString(36).slice(2, 8), label: '', correct: false })

export function AssignmentEditor({
  assignment, questions, results, competencies,
}: {
  assignment: Assignment
  questions: Question[]
  results: Result[]
  competencies: CompetencyOption[]
}) {
  const [tab, setTab] = useState<Tab>('kerdesek')
  const [pending, start] = useTransition()
  const [uzenet, setUzenet] = useState<{ ok: boolean; message: string } | null>(null)
  const [szerkeszt, setSzerkeszt] = useState<QuestionInput | null>(null)

  const pont = osszPont(questions)
  const atlag = results.length
    ? Math.round(results.reduce((n, r) => n + r.pct, 0) / results.length) : 0
  const teljesitette = results.filter((r) => r.passed).length

  const ujKerdes = (): QuestionInput => ({
    kind: 'single', prompt: '', options: [UJ_OPCIO(), UJ_OPCIO()],
    accepted: [], points: 1, explanation: null, competency_id: null,
  })

  const ment = () => {
    if (!szerkeszt) return
    start(async () => {
      const r = await saveQuestion(assignment.id, szerkeszt)
      setUzenet(r)
      if (r.ok) setSzerkeszt(null)
    })
  }

  return (
    <>
      <div className="seg-row">
        <button className={`seg ${tab === 'kerdesek' ? 'on' : ''}`} onClick={() => setTab('kerdesek')}>
          Kérdések ({questions.length})
        </button>
        <button className={`seg ${tab === 'beallitas' ? 'on' : ''}`} onClick={() => setTab('beallitas')}>
          Állapot
        </button>
        <button className={`seg ${tab === 'eredmenyek' ? 'on' : ''}`} onClick={() => setTab('eredmenyek')}>
          Eredmények ({results.length})
        </button>
      </div>

      {uzenet && (
        <div className={uzenet.ok ? 'form-ok' : 'form-err'} style={{ marginTop: 10 }}>{uzenet.message}</div>
      )}

      {/* ══ KÉRDÉSEK ══ */}
      {tab === 'kerdesek' && (
        <>
          {szerkeszt ? (
            <QuestionForm
              q={szerkeszt} setQ={setSzerkeszt} competencies={competencies}
              onSave={ment} onCancel={() => setSzerkeszt(null)} pending={pending}
            />
          ) : (
            <>
              <div className="card" style={{ marginTop: 12 }}>
                <div className="row" style={{ border: 'none', padding: 0 }}>
                  <span className="sub" style={{ margin: 0 }}>Összesen</span>
                  <b>{questions.length} kérdés · {pont} pont</b>
                </div>
              </div>

              {questions.map((q, i) => (
                <div className="card" key={q.id}>
                  <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
                    <b style={{ flex: 1, fontSize: 14.5 }}>{i + 1}. {q.prompt}</b>
                    <span className="sub" style={{ margin: 0, fontSize: 12 }}>{q.points} pont</span>
                  </div>
                  <div className="mp-meta">
                    <span>{QKIND_LABEL[q.kind]}</span>
                    {q.competency_id && (
                      <span>{competencies.find((c) => c.id === q.competency_id)?.name ?? 'Kompetencia'}</span>
                    )}
                  </div>
                  <div className="row" style={{ border: 'none', padding: '10px 0 0', gap: 8 }}>
                    <button className="btn ghost sm" onClick={() => setSzerkeszt({ ...q })}>
                      Szerkesztés
                    </button>
                    <button
                      className="sec-l" disabled={pending}
                      style={{ background: 'none', border: 0, font: 'inherit', fontSize: 13, color: 'var(--alert)', cursor: 'pointer' }}
                      onClick={() => start(async () => setUzenet(await deleteQuestion(q.id, assignment.id)))}
                    >
                      Törlés
                    </button>
                  </div>
                </div>
              ))}

              <button className="btn" style={{ width: '100%', marginTop: 10 }}
                onClick={() => setSzerkeszt(ujKerdes())}>
                + Kérdés hozzáadása
              </button>
            </>
          )}
        </>
      )}

      {/* ══ ÁLLAPOT ══ */}
      {tab === 'beallitas' && (
        <>
          <div className="card" style={{ marginTop: 12 }}>
            <div className="row" style={{ border: 'none', padding: 0 }}>
              <b>Jelenlegi állapot</b>
              <span className={`mp-badge ${assignment.status === 'open' ? 'approved' : 'inactive'}`}>
                {STATUS_LABEL[assignment.status]}
              </span>
            </div>
            <div className="mp-meta">
              <span>Teljesítés: {assignment.pass_pct}%</span>
              {assignment.due_at && <span>Határidő: {assignment.due_at.slice(0, 16).replace('T', ' ')}</span>}
              <span>{assignment.max_attempts != null ? `${assignment.max_attempts} beadás` : 'Korlátlan beadás'}</span>
            </div>

            <div className="row" style={{ border: 'none', padding: '12px 0 0', gap: 8, flexWrap: 'wrap' }}>
              {(['draft', 'open', 'closed'] as Status[]).filter((s) => s !== assignment.status).map((s) => (
                <button key={s} className="btn ghost sm" disabled={pending}
                  onClick={() => start(async () => setUzenet(await setAssignmentStatus(assignment.id, s)))}>
                  {s === 'open' ? 'Megnyitás' : s === 'closed' ? 'Lezárás' : 'Piszkozatba'}
                </button>
              ))}
            </div>

            <p className="sub" style={{ margin: '12px 0 0', fontSize: 12 }}>
              A hallgatók csak a megnyitott feladatot látják. Lezárás után a beadás
              megszűnik, de az eredmények megmaradnak.
            </p>
          </div>
        </>
      )}

      {/* ══ EREDMÉNYEK ══ */}
      {tab === 'eredmenyek' && (
        <>
          {results.length === 0 ? (
            <div className="card" style={{ marginTop: 12 }}>
              <p style={{ margin: 0 }}>Még nincs beadás.</p>
            </div>
          ) : (
            <>
              <div className="card" style={{ marginTop: 12 }}>
                <div className="stat-grid">
                  <div className="stat-card">
                    <div className="stat-num">{results.length}</div>
                    <div className="stat-lbl">Beadás</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-num">{atlag}%</div>
                    <div className="stat-lbl">Átlag</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-num">{teljesitette}</div>
                    <div className="stat-lbl">Teljesítette</div>
                  </div>
                </div>
              </div>

              {results.map((r) => (
                <EredmenySor key={r.user_id} r={r} assignmentId={assignment.id} setUzenet={setUzenet} />
              ))}
            </>
          )}
        </>
      )}
    </>
  )
}

/* ─────────── Kérdés szerkesztése ─────────── */

function QuestionForm({
  q, setQ, competencies, onSave, onCancel, pending,
}: {
  q: QuestionInput
  setQ: (q: QuestionInput) => void
  competencies: CompetencyOption[]
  onSave: () => void
  onCancel: () => void
  pending: boolean
}) {
  const tipusValt = (kind: QKind) => {
    // Igaz/hamis esetén a két lehetőség adott — nem kell kézzel beírni.
    if (kind === 'truefalse') {
      setQ({ ...q, kind, options: [
        { id: 'igaz', label: 'Igaz', correct: false },
        { id: 'hamis', label: 'Hamis', correct: false },
      ] })
    } else if (kind === 'short') {
      setQ({ ...q, kind, options: [] })
    } else {
      setQ({ ...q, kind, options: q.options.length >= 2 ? q.options : [UJ_OPCIO(), UJ_OPCIO()] })
    }
  }

  const jelol = (id: string) => {
    setQ({
      ...q,
      options: q.options.map((o) =>
        o.id === id
          ? { ...o, correct: !o.correct }
          // Egy helyes válasznál a többi jelölés törlődik.
          : q.kind === 'multi' ? o : { ...o, correct: false },
      ),
    })
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <label className="sub">Kérdés típusa</label>
      <div className="sh-chips" style={{ marginBottom: 6 }}>
        {(Object.keys(QKIND_LABEL) as QKind[]).map((k) => (
          <button key={k} type="button" className={`sh-chip ${q.kind === k ? 'on' : ''}`}
            onClick={() => tipusValt(k)}>{QKIND_LABEL[k]}</button>
        ))}
      </div>
      <p className="sub" style={{ margin: '0 0 14px', fontSize: 12 }}>{QKIND_HINT[q.kind]}</p>

      <label className="sub">A kérdés szövege</label>
      <textarea className="field" rows={2} value={q.prompt}
        onChange={(e) => setQ({ ...q, prompt: e.target.value })}
        placeholder="Mit kérdezel?" />

      {q.kind === 'short' ? (
        <>
          <label className="sub">Elfogadható válaszok (soronként egy)</label>
          <textarea className="field" rows={3} value={q.accepted.join('\n')}
            onChange={(e) => setQ({ ...q, accepted: e.target.value.split('\n') })}
            placeholder={'pl.\nsepsis\nszepszis'} />
          <p className="sub" style={{ margin: '-8px 0 14px', fontSize: 11.5 }}>
            A kis- és nagybetű nem számít. Érdemes felsorolni a szokásos írásmódokat.
          </p>
        </>
      ) : (
        <>
          <label className="sub">Válaszlehetőségek — jelöld a helyeset</label>
          {q.options.map((o) => (
            <div className="row" key={o.id} style={{ border: 'none', padding: '0 0 8px', gap: 8 }}>
              <button type="button" className={`sh-chip ${o.correct ? 'on' : ''}`}
                onClick={() => jelol(o.id)} style={{ flex: 'none' }}
                aria-label={o.correct ? 'Helyes válasz' : 'Megjelölés helyesként'}>
                {o.correct ? '✓' : '○'}
              </button>
              <input className="field" style={{ margin: 0 }} value={o.label}
                disabled={q.kind === 'truefalse'}
                onChange={(e) => setQ({
                  ...q, options: q.options.map((x) => x.id === o.id ? { ...x, label: e.target.value } : x),
                })}
                placeholder="Válaszlehetőség" />
              {q.kind !== 'truefalse' && q.options.length > 2 && (
                <button type="button" className="sec-l"
                  style={{ background: 'none', border: 0, cursor: 'pointer', flex: 'none', color: 'var(--muted)' }}
                  onClick={() => setQ({ ...q, options: q.options.filter((x) => x.id !== o.id) })}
                  aria-label="Lehetőség törlése">✕</button>
              )}
            </div>
          ))}
          {q.kind !== 'truefalse' && q.options.length < 8 && (
            <button type="button" className="btn ghost sm" style={{ marginBottom: 14 }}
              onClick={() => setQ({ ...q, options: [...q.options, UJ_OPCIO()] })}>
              + Lehetőség
            </button>
          )}
        </>
      )}

      <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="sub">Pontérték</label>
          <input className="field" type="number" min={1} max={20} value={q.points}
            onChange={(e) => setQ({ ...q, points: Number(e.target.value) })} />
        </div>
        <div style={{ flex: 2 }}>
          <label className="sub">Kompetencia</label>
          <select className="field" value={q.competency_id ?? ''}
            onChange={(e) => setQ({ ...q, competency_id: e.target.value || null })}>
            <option value="">Nincs megadva</option>
            {competencies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <label className="sub">Magyarázat (a hallgató a beadás után látja)</label>
      <textarea className="field" rows={2} value={q.explanation ?? ''}
        onChange={(e) => setQ({ ...q, explanation: e.target.value })}
        placeholder="Miért ez a helyes válasz?" />

      <div className="row" style={{ border: 'none', padding: 0, gap: 8 }}>
        <button className="btn ghost" style={{ flex: 1 }} onClick={onCancel} disabled={pending}>Mégsem</button>
        <button className="btn" style={{ flex: 2 }} onClick={onSave} disabled={pending}>
          {pending ? 'Mentés…' : 'Kérdés mentése'}
        </button>
      </div>
    </div>
  )
}

/* ─────────── Egy eredménysor ─────────── */

function EredmenySor({
  r, assignmentId, setUzenet,
}: {
  r: Result
  assignmentId: string
  setUzenet: (u: { ok: boolean; message: string }) => void
}) {
  const [pending, start] = useTransition()
  const [nyitva, setNyitva] = useState(false)
  const [szoveg, setSzoveg] = useState(r.feedback ?? '')

  return (
    <div className="card">
      <div className="row" style={{ border: 'none', padding: 0 }}>
        <span style={{ flex: 1 }}>
          <b>{r.full_name || '(nincs név)'}</b>
          <span className="sub" style={{ display: 'block', margin: 0, fontSize: 12 }}>
            {r.attempt}. beadás · {r.submitted_at.slice(0, 16).replace('T', ' ')}
          </span>
        </span>
        <span style={{ fontWeight: 800, fontSize: 17, color: r.passed ? 'var(--ok)' : 'var(--warn)' }}>
          {r.pct}%
        </span>
      </div>

      {nyitva ? (
        <div style={{ marginTop: 10 }}>
          <label className="sub">Visszajelzés a hallgatónak</label>
          <textarea className="field" rows={2} value={szoveg} onChange={(e) => setSzoveg(e.target.value)}
            placeholder="Mit csinált jól, min érdemes dolgoznia?" />
          <div className="row" style={{ border: 'none', padding: 0, gap: 8 }}>
            <button className="btn sm" disabled={pending}
              onClick={() => start(async () => {
                setUzenet(await saveFeedback(r.user_id, assignmentId, szoveg))
                setNyitva(false)
              })}>
              Mentés
            </button>
            <button className="btn ghost sm" onClick={() => setNyitva(false)}>Mégsem</button>
          </div>
        </div>
      ) : (
        <>
          {r.feedback && (
            <p className="vg-tanulsag" style={{ marginTop: 10 }}>
              <b>Visszajelzés.</b> {r.feedback}
            </p>
          )}
          <button className="btn ghost sm" style={{ marginTop: 10 }} onClick={() => setNyitva(true)}>
            {r.feedback ? 'Visszajelzés szerkesztése' : 'Visszajelzés írása'}
          </button>
        </>
      )}
    </div>
  )
}
