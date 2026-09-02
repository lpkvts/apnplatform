'use client'

import { useState, useTransition } from 'react'
import { createCourse } from '@/lib/education/actions'
import type { CompetencyOption } from '@/lib/education/types'

/**
 * Kurzus létrehozása.
 *
 * A célkompetenciák megadása itt, a létrehozásnál történik, nem utólag:
 * a kurzus attól lesz kompetenciaalapú, hogy előre kimondjuk, mit fejleszt.
 * A hallgatói eredmények ezekhez a területekhez rendelődnek majd.
 */
export function CourseForm({
  institutionId, competencies,
}: {
  institutionId: string
  competencies: CompetencyOption[]
}) {
  const [pending, start] = useTransition()
  const [err, setErr] = useState<string | null>(null)
  const [picked, setPicked] = useState<string[]>([])

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  // A kompetenciák területenként csoportosítva áttekinthetőbbek.
  const byDomain = competencies.reduce<Record<string, CompetencyOption[]>>((acc, c) => {
    const d = c.domain ?? 'Egyéb'
    ;(acc[d] ??= []).push(c)
    return acc
  }, {})

  return (
    <form
      className="card"
      action={(fd) => start(async () => {
        picked.forEach((id) => fd.append('competency', id))
        const r = await createCourse(institutionId, fd)
        if (r && !r.ok) setErr(r.message)
      })}
    >
      <label className="sub">Kurzus neve</label>
      <input className="field" name="title" required placeholder="pl. Akut betegellátás" />

      <label className="sub">Rövid leírás</label>
      <textarea className="field" name="description" rows={3}
        placeholder="Mit tanulnak a hallgatók ezen a kurzuson?" />

      <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="sub">Szakterület</label>
          <input className="field" name="specialty" placeholder="pl. Sürgősségi ellátás" />
        </div>
        <div style={{ flex: 1 }}>
          <label className="sub">Szint</label>
          <input className="field" name="level" placeholder="pl. APN MSc" />
        </div>
      </div>

      <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="sub">Kezdés</label>
          <input className="field" name="starts_on" type="date" />
        </div>
        <div style={{ flex: 1 }}>
          <label className="sub">Lezárás</label>
          <input className="field" name="ends_on" type="date" />
        </div>
      </div>

      <label className="sub">Jelkép</label>
      <input className="field" name="icon" maxLength={2} placeholder="📘" style={{ maxWidth: 90 }} />

      <div className="sec-h" style={{ marginTop: 8 }}>
        <span className="sec-t">Célkompetenciák</span>
        {picked.length > 0 && <span className="sec-l" style={{ marginLeft: 'auto' }}>{picked.length} kiválasztva</span>}
      </div>
      <p className="sub" style={{ marginTop: 0, fontSize: 12 }}>
        Ezekhez mérjük majd a hallgatók teljesítményét. Később módosítható.
      </p>

      {competencies.length === 0 && (
        <p className="sub">Nincs elérhető kompetencia-készlet.</p>
      )}

      {Object.entries(byDomain).map(([domain, list]) => (
        <details className="kt-acc" key={domain}>
          <summary className="kt-sum">
            <span>{domain}</span>
            <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13, marginLeft: 'auto', marginRight: 8 }}>
              {list.filter((c) => picked.includes(c.id)).length} / {list.length}
            </span>
          </summary>
          <div className="kt-body">
            <div className="sh-chips">
              {list.map((c) => (
                <button
                  key={c.id} type="button"
                  className={`sh-chip ${picked.includes(c.id) ? 'on' : ''}`}
                  onClick={() => toggle(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </details>
      ))}

      {err && <div className="form-err" style={{ marginTop: 10 }}>{err}</div>}

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%', marginTop: 14 }}>
        {pending ? 'Létrehozás…' : 'Kurzus létrehozása'}
      </button>
    </form>
  )
}
