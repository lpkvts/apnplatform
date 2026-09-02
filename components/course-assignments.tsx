'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { saveAssignment } from '@/lib/education/assignments-actions'
import { STATUS_LABEL, lejart, type Assignment } from '@/lib/education/assignments'

/**
 * A kurzus feladatai.
 *
 * Oktatóként a piszkozatok is látszanak, hallgatóként csak a megnyitottak —
 * a szűrés az adatbázis szabályában történik, nem itt.
 */
export function CourseAssignments({
  courseId, assignments, canManage,
}: {
  courseId: string
  assignments: Assignment[]
  canManage: boolean
}) {
  const [pending, start] = useTransition()
  const [uj, setUj] = useState(false)
  const [hiba, setHiba] = useState<string | null>(null)

  return (
    <>
      <div className="sec-h">
        <span className="sec-t">Feladatok</span>
        {assignments.length > 0 && (
          <span className="sub" style={{ margin: 0, fontSize: 13 }}>{assignments.length}</span>
        )}
      </div>

      {assignments.length === 0 && !uj && (
        <div className="card">
          <p style={{ margin: 0 }}>
            {canManage
              ? 'Még nincs feladat. Az első létrehozása után kérdéseket vehetsz fel hozzá, majd megnyithatod a hallgatóknak.'
              : 'A kurzushoz még nincs megnyitott feladat.'}
          </p>
        </div>
      )}

      {assignments.map((a) => (
        <Link className="card klink" href={`/oktatas/feladat/${a.id}`} key={a.id}>
          <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
            <span className="klink-t" style={{ flex: 1 }}>{a.title}</span>
            <span className={`mp-badge ${a.status === 'open' ? 'approved' : a.status === 'draft' ? 'pending' : 'inactive'}`}>
              {lejart(a) && a.status === 'open' ? 'Határidő lejárt' : STATUS_LABEL[a.status]}
            </span>
          </div>
          {a.description && (
            <p className="sub" style={{ margin: '6px 0 0' }}>{a.description}</p>
          )}
          <div className="mp-meta">
            <span>Teljesítés: {a.pass_pct}%</span>
            {a.due_at && <span>Határidő: {a.due_at.slice(0, 16).replace('T', ' ')}</span>}
          </div>
        </Link>
      ))}

      {canManage && (
        uj ? (
          <form
            className="card"
            action={(fd) => start(async () => {
              const r = await saveAssignment(courseId, fd)
              if (r.ok) setUj(false)
              else setHiba(r.message)
            })}
          >
            <label className="sub">A feladat címe</label>
            <input className="field" name="title" required placeholder="pl. Sav-bázis alapok" />

            <label className="sub">Rövid leírás</label>
            <textarea className="field" name="description" rows={2}
              placeholder="Mit gyakorolnak a hallgatók?" />

            <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label className="sub">Határidő</label>
                <input className="field" name="due_at" type="datetime-local" />
              </div>
              <div style={{ flex: 1 }}>
                <label className="sub">Teljesítés (%)</label>
                <input className="field" name="pass_pct" type="number" min={0} max={100} defaultValue={60} />
              </div>
            </div>

            <label className="sub">Hányszor adható be?</label>
            <input className="field" name="max_attempts" type="number" min={1} max={20}
              placeholder="Üresen hagyva korlátlan" style={{ maxWidth: 200 }} />

            <label className="row" style={{ border: 'none', padding: '4px 0 12px', cursor: 'pointer' }}>
              <span>
                <input type="checkbox" name="show_answers" defaultChecked style={{ marginRight: 8 }} />
                A hallgató a beadás után látja a helyes válaszokat
              </span>
            </label>

            {hiba && <div className="form-err" style={{ marginBottom: 10 }}>{hiba}</div>}

            <div className="row" style={{ border: 'none', padding: 0, gap: 8 }}>
              <button className="btn ghost" type="button" style={{ flex: 1 }}
                onClick={() => { setUj(false); setHiba(null) }} disabled={pending}>
                Mégsem
              </button>
              <button className="btn" type="submit" style={{ flex: 2 }} disabled={pending}>
                {pending ? 'Létrehozás…' : 'Feladat létrehozása'}
              </button>
            </div>
            <p className="sub" style={{ margin: '10px 0 0', fontSize: 12 }}>
              A feladat piszkozatként jön létre. A kérdések felvétele után nyithatod meg
              a hallgatóknak.
            </p>
          </form>
        ) : (
          <button className="btn ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setUj(true)}>
            + Új feladat
          </button>
        )
      )}
    </>
  )
}
