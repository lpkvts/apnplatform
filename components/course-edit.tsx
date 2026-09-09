'use client'

import { useState, useTransition } from 'react'
import { updateCourse, type Res } from '@/lib/education/files-actions'
import type { Course } from '@/lib/education/types'

/**
 * A kurzus alapadatainak szerkesztése.
 *
 * Menet közben is módosítható: a cím, a leírás és a besorolás változhat,
 * miközben a kurzus fut. A hallgatók, a feladatok és az eredmények
 * érintetlenek maradnak — csak a leíró adatok frissülnek.
 */
export function CourseEdit({ course }: { course: Course }) {
  const [pending, start] = useTransition()
  const [nyitva, setNyitva] = useState(false)
  const [res, setRes] = useState<Res | null>(null)

  if (!nyitva) {
    return (
      <button className="btn ghost sm" onClick={() => setNyitva(true)}>
        Kurzus szerkesztése
      </button>
    )
  }

  return (
    <form
      className="card"
      style={{ marginTop: 10 }}
      action={(fd) => start(async () => {
        const r = await updateCourse(course.id, fd)
        setRes(r)
        if (r.ok) setNyitva(false)
      })}
    >
      <label className="sub lbl-req" htmlFor="ce-title">A kurzus címe</label>
      <input className="field" id="ce-title" name="title" required defaultValue={course.title} />

      <label className="sub" htmlFor="ce-desc">Leírás</label>
      <textarea className="field" id="ce-desc" name="description" rows={3}
        defaultValue={course.description ?? ''}
        placeholder="Miről szól a kurzus, kinek ajánlott?" />

      <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="sub" htmlFor="ce-level">Képzési szint</label>
          <input className="field" id="ce-level" name="level" defaultValue={course.level ?? ''}
            placeholder="pl. APN MSc" />
        </div>
        <div style={{ flex: 1 }}>
          <label className="sub" htmlFor="ce-spec">Szakterület</label>
          <input className="field" id="ce-spec" name="specialty" defaultValue={course.specialty ?? ''}
            placeholder="pl. Sürgősségi ellátás" />
        </div>
      </div>

      <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="sub" htmlFor="ce-start">Kezdés</label>
          <input className="field" id="ce-start" name="starts_on" type="date"
            defaultValue={course.starts_on ?? ''} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="sub" htmlFor="ce-end">Befejezés</label>
          <input className="field" id="ce-end" name="ends_on" type="date"
            defaultValue={course.ends_on ?? ''} />
        </div>
      </div>

      <label className="sub" htmlFor="ce-icon">Jelölő</label>
      <input className="field" id="ce-icon" name="icon" defaultValue={course.icon ?? ''}
        placeholder="Egyetlen jel, ami a listában megjelenik" style={{ maxWidth: 140 }} />

      {res && !res.ok && <div className="form-err" style={{ marginBottom: 10 }}>{res.message}</div>}

      <div className="row" style={{ border: 'none', padding: 0, gap: 8 }}>
        <button className="btn ghost" type="button" style={{ flex: 1 }}
          onClick={() => setNyitva(false)} disabled={pending}>
          Mégsem
        </button>
        <button className="btn" type="submit" style={{ flex: 2 }} disabled={pending}>
          {pending ? 'Mentés…' : 'Módosítások mentése'}
        </button>
      </div>

      <p className="sub" style={{ margin: '10px 0 0', fontSize: 'var(--t-caption)' }}>
        A hallgatók, a feladatok és az eredmények nem változnak — csak a kurzus leíró adatai.
      </p>
    </form>
  )
}
