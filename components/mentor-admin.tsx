'use client'

import { useState, useTransition } from 'react'
import { setMentorStatus, deleteMentorProfile, type Result } from '@/lib/mentor/actions'
import { STATUS_LABEL, type AdminMentor, type Status } from '@/lib/mentor/types'

/**
 * Mentorprofilok elbírálása.
 *
 * A függőben lévők állnak elöl, mert azokkal kell foglalkozni. Az elutasításhoz
 * indoklás adható meg: a jelentkező ezt látja a saját profilján, így tudja,
 * mit módosítson.
 */
export function MentorAdmin({ mentors }: { mentors: AdminMentor[] }) {
  const [pending, start] = useTransition()
  const [res, setRes] = useState<Result | null>(null)
  const [nyitva, setNyitva] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [szuro, setSzuro] = useState<Status | 'mind'>('mind')

  const lista = szuro === 'mind' ? mentors : mentors.filter((m) => m.status === szuro)
  const db = (s: Status) => mentors.filter((m) => m.status === s).length

  const allit = (id: string, s: Status) =>
    start(async () => {
      setRes(await setMentorStatus(id, s, note))
      setNote('')
      setNyitva(null)
    })

  if (mentors.length === 0) {
    return <div className="card"><p style={{ margin: 0 }}>Még nincs mentorjelentkezés.</p></div>
  }

  return (
    <>
      <div className="sh-chips">
        <button className={`sh-chip ${szuro === 'mind' ? 'on' : ''}`} onClick={() => setSzuro('mind')}>
          Mind ({mentors.length})
        </button>
        {(['pending', 'approved', 'inactive', 'rejected'] as Status[]).map((s) => (
          db(s) > 0 && (
            <button key={s} className={`sh-chip ${szuro === s ? 'on' : ''}`} onClick={() => setSzuro(s)}>
              {STATUS_LABEL[s]} ({db(s)})
            </button>
          )
        ))}
      </div>

      {res && <div className={res.ok ? 'form-ok' : 'form-err'} style={{ marginTop: 10 }}>{res.message}</div>}

      {lista.map((m) => (
        <div className="card" key={m.id} style={{ marginTop: 10 }}>
          <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
            <span style={{ flex: 1 }}>
              <b style={{ fontSize: 15.5 }}>{m.full_name || '(nincs név)'}</b>
              {m.title && <span className="sub" style={{ display: 'block', margin: '2px 0 0', fontSize: 13 }}>{m.title}</span>}
            </span>
            <span className={`mp-badge ${m.status}`}>{STATUS_LABEL[m.status]}</span>
          </div>

          <div className="mp-meta">
            <span>{m.specialty}</span>
            {m.experience_years != null && <span>{m.experience_years} év</span>}
            <span>Beküldve: {m.created_at.slice(0, 10)}</span>
          </div>

          {m.bio && <p className="mp-bio">{m.bio}</p>}

          {m.topics.length > 0 && (
            <div className="mp-tags">
              {m.topics.map((t) => <span className="mp-tag" key={t}>{t}</span>)}
            </div>
          )}

          {m.contact_note && (
            <p className="sub" style={{ margin: '10px 0 0', fontSize: 12.5 }}>
              <b>Kapcsolatfelvételről:</b> {m.contact_note}
            </p>
          )}

          {m.review_note && (
            <p className="sub" style={{ margin: '8px 0 0', fontSize: 12.5 }}>
              <b>Korábbi megjegyzés:</b> {m.review_note}
            </p>
          )}

          {nyitva === m.id ? (
            <div style={{ marginTop: 12 }}>
              <label className="sub">Megjegyzés a döntéshez (a jelentkező látja)</label>
              <textarea className="field" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Elutasításnál érdemes megírni, mit érdemes pontosítani." />
              <div className="row" style={{ border: 'none', padding: 0, gap: 8, flexWrap: 'wrap' }}>
                {m.status !== 'approved' && (
                  <button className="btn sm" disabled={pending} onClick={() => allit(m.id, 'approved')}>
                    Jóváhagyás
                  </button>
                )}
                {m.status !== 'rejected' && (
                  <button className="btn ghost sm" disabled={pending} onClick={() => allit(m.id, 'rejected')}>
                    Elutasítás
                  </button>
                )}
                {m.status !== 'inactive' && (
                  <button className="btn ghost sm" disabled={pending} onClick={() => allit(m.id, 'inactive')}>
                    Inaktiválás
                  </button>
                )}
                <button className="btn ghost sm" onClick={() => { setNyitva(null); setNote('') }}>
                  Mégsem
                </button>
              </div>
              <p className="sub" style={{ margin: '10px 0 0', fontSize: 11.5 }}>
                Az inaktiválás elrejti a profilt a keresésből, de nem törli. Végleges törlésre
                csak akkor van szükség, ha a felhasználó ezt kifejezetten kéri.
              </p>
              <button
                className="sec-l" disabled={pending}
                style={{ background: 'none', border: 0, padding: '8px 0 0', font: 'inherit', fontSize: 12.5, color: '#B91C1C', cursor: 'pointer' }}
                onClick={() => start(async () => { setRes(await deleteMentorProfile(m.id)); setNyitva(null) })}
              >
                Végleges törlés
              </button>
            </div>
          ) : (
            <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={() => setNyitva(m.id)}>
              Elbírálás
            </button>
          )}
        </div>
      ))}
    </>
  )
}
