'use client'

import { useState, useTransition } from 'react'
import {
  setCourseStatus, enrollStudent, removeStudent, createGroup, deleteGroup, setStudentGroup,
  type Result,
} from '@/lib/education/actions'
import type { Course, CourseStudent } from '@/lib/education/types'
import type { Group } from '@/lib/education/student'

const STATUSES: { id: Course['status']; label: string; note: string }[] = [
  { id: 'draft', label: 'Piszkozat', note: 'A hallgatók még nem látják.' },
  { id: 'active', label: 'Aktív', note: 'A beiratkozott hallgatók elérik.' },
  { id: 'archived', label: 'Lezárt', note: 'Csak megtekinthető, új beiratkozás nincs.' },
]

export function CourseAdmin({
  course, students, groups,
}: {
  course: Course
  students: CourseStudent[]
  groups: Group[]
}) {
  const [ujCsoport, setUjCsoport] = useState('')
  const [pending, start] = useTransition()
  const [res, setRes] = useState<Result | null>(null)
  const [status, setStatus] = useState(course.status)

  const átlag = students.length
    ? Math.round(students.reduce((s, x) => s + x.progress_pct, 0) / students.length)
    : 0

  return (
    <>
      {/* ── Állapot ── */}
      <div className="sec-h"><span className="sec-t">Állapot</span></div>
      <div className="card">
        {STATUSES.map((s) => (
          <label key={s.id} className="row" style={{ cursor: 'pointer' }}>
            <span>
              <input type="radio" name="status" value={s.id} checked={status === s.id}
                onChange={() => setStatus(s.id)} style={{ marginRight: 8 }} />
              <b>{s.label}</b>
              <span className="sub" style={{ display: 'block', margin: '2px 0 0 24px' }}>{s.note}</span>
            </span>
          </label>
        ))}
        <button
          className="btn sm" disabled={pending || status === course.status}
          style={{ marginTop: 10 }}
          onClick={() => start(async () => setRes(await setCourseStatus(course.id, status)))}
        >
          Állapot mentése
        </button>
      </div>

      {/* ── Csoportok ── */}
      <div className="sec-h">
        <span className="sec-t">Csoportok</span>
        {groups.length > 0 && (
          <span className="sub" style={{ margin: 0, fontSize: 13 }}>{groups.length}</span>
        )}
      </div>
      <div className="card">
        {groups.length === 0 && (
          <p className="sub" style={{ margin: '0 0 10px' }}>
            Nincs csoport. Nagyobb évfolyamnál érdemes csoportokat létrehozni — a feladat
            egy csoportnak is kiadható.
          </p>
        )}
        {groups.map((g) => (
          <div className="row" key={g.id}>
            <span>
              <b>{g.name}</b>
              <span className="sub" style={{ display: 'block', margin: 0, fontSize: 12 }}>
                {g.letszam} hallgató
              </span>
            </span>
            <button className="sec-l" disabled={pending}
              style={{ background: 'none', border: 0, font: 'inherit', fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}
              onClick={() => start(async () => setRes(await deleteGroup(g.id, course.id)))}>
              Törlés
            </button>
          </div>
        ))}
        <div className="row" style={{ border: 'none', padding: '10px 0 0', gap: 8 }}>
          <input className="field" style={{ margin: 0, flex: 1 }} value={ujCsoport}
            onChange={(e) => setUjCsoport(e.target.value)}
            placeholder="pl. A csoport" aria-label="Új csoport neve" />
          <button className="btn sm" disabled={pending || !ujCsoport.trim()}
            onClick={() => start(async () => {
              setRes(await createGroup(course.id, ujCsoport))
              setUjCsoport('')
            })}>
            Hozzáadás
          </button>
        </div>
      </div>

      {/* ── Hallgatók ── */}
      <div className="sec-h">
        <span className="sec-t">Hallgatók</span>
        <span className="sec-l" style={{ marginLeft: 'auto', fontWeight: 500 }}>
          {students.length}{students.length > 0 && ` · átlag ${átlag}%`}
        </span>
      </div>

      <form
        className="card"
        action={(fd) => start(async () => setRes(await enrollStudent(course.id, fd)))}
      >
        <label className="sub">Hallgató hozzáadása e-mail cím alapján</label>
        <input className="field" name="email" type="email" required placeholder="hallgato@pelda.hu" />
        <button className="btn sm" type="submit" disabled={pending}>Hozzáadás</button>
        <p className="sub" style={{ margin: '8px 0 0', fontSize: 12 }}>
          A hallgatónak előbb regisztrálnia kell a platformon. Így ő dönt a fiókjáról,
          és nem keletkezik jelszó nélküli felhasználó.
        </p>
      </form>

      {res && (
        <div className={res.ok ? 'form-ok' : 'form-err'} style={{ marginTop: 8 }}>{res.message}</div>
      )}

      {students.length === 0 ? (
        <p className="sub">Még nincs beiratkozott hallgató.</p>
      ) : (
        students.map((s) => (
          <div className="card" key={s.user_id} style={{ marginBottom: 8 }}>
            <div className="row" style={{ border: 'none', padding: 0 }}>
              <b>{s.profile?.full_name || '(névtelen)'}</b>
              <span style={{ fontWeight: 700, color: 'var(--brand)' }}>{s.progress_pct}%</span>
            </div>
            <div className="ekg-prog-bar" style={{ marginTop: 8 }}>
              <div style={{ width: `${s.progress_pct}%` }} />
            </div>
            <div className="row" style={{ border: 'none', padding: '10px 0 0', gap: 8 }}>
              {groups.length > 0 && (
                <select className="field" style={{ margin: 0, flex: 1, fontSize: 13 }}
                  value={s.group_id ?? ''} disabled={pending}
                  onChange={(e) => start(async () =>
                    setRes(await setStudentGroup(course.id, s.user_id, e.target.value || null)))}
                  aria-label="Csoport">
                  <option value="">Nincs csoport</option>
                  {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              )}
              <button
                className="sec-l" disabled={pending}
                style={{ background: 'none', border: 0, font: 'inherit', fontSize: 13, cursor: 'pointer', flex: 'none' }}
                onClick={() => start(async () => setRes(await removeStudent(course.id, s.user_id)))}
              >
                Eltávolítás
              </button>
            </div>
          </div>
        ))
      )}

      <div className="safety-note" style={{ marginTop: 12 }}>
        <b>ⓘ Következő lépés.</b> A feladatok, a klinikai esetek és a csoportelemzés
        a következő fejlesztési szakaszban kerül a kurzusokhoz.
      </div>
    </>
  )
}
