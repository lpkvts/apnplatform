'use client'

import { useState, useTransition } from 'react'
import { setInquiryStatus, type Res } from '@/lib/inquiry/actions'
import { INQ_STATUS_LABEL, type Inquiry } from '@/lib/inquiry/types'

/**
 * Képzőhelyi megkeresések kezelése.
 *
 * Az újak állnak elöl, mert azokkal kell foglalkozni. A kapcsolattartói
 * adatok kattintható hivatkozásként jelennek meg: a válasz jellemzően
 * e-mailben vagy telefonon indul, és a másolgatás fölösleges lépés.
 */

const ALLAPOT_OSZTALY: Record<Inquiry['status'], string> = {
  new: 'st-progress',
  contacted: 'st-done',
  closed: 'st-none',
}

export function InquiryAdmin({ list }: { list: Inquiry[] }) {
  const [pending, start] = useTransition()
  const [res, setRes] = useState<Res | null>(null)
  const [nyitva, setNyitva] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [szuro, setSzuro] = useState<Inquiry['status'] | 'mind'>('mind')

  const szurt = szuro === 'mind' ? list : list.filter((i) => i.status === szuro)
  const db = (s: Inquiry['status']) => list.filter((i) => i.status === s).length

  const allit = (id: string, status: Inquiry['status']) =>
    start(async () => {
      setRes(await setInquiryStatus(id, status, note))
      setNote('')
      setNyitva(null)
    })

  if (list.length === 0) {
    return (
      <div className="card empty">
        <b>Még nincs megkeresés</b>
        <p>
          A képzőhelyeknek szóló oldalról érkező érdeklődések itt jelennek meg.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="sh-chips">
        <button className={`sh-chip ${szuro === 'mind' ? 'on' : ''}`} onClick={() => setSzuro('mind')}>
          Mind ({list.length})
        </button>
        {(['new', 'contacted', 'closed'] as Inquiry['status'][]).map((s) => (
          db(s) > 0 && (
            <button key={s} className={`sh-chip ${szuro === s ? 'on' : ''}`} onClick={() => setSzuro(s)}>
              {INQ_STATUS_LABEL[s]} ({db(s)})
            </button>
          )
        ))}
      </div>

      {res && <div className={res.ok ? 'form-ok' : 'form-err'} style={{ marginTop: 10 }}>{res.message}</div>}

      {szurt.map((i) => (
        <div className="card" key={i.id} style={{ marginTop: 10 }}>
          <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
            <span style={{ flex: 1 }}>
              <b style={{ fontSize: 'var(--t-h3)' }}>{i.institution}</b>
              <span className="sub" style={{ display: 'block', margin: '2px 0 0', fontSize: 'var(--t-caption)' }}>
                {i.created_at.slice(0, 10)}
                {i.student_count && ` · ${i.student_count} hallgató`}
              </span>
            </span>
            <span className={`st ${ALLAPOT_OSZTALY[i.status]}`}>{INQ_STATUS_LABEL[i.status]}</span>
          </div>

          {/* A kapcsolat közvetlenül indítható: a válasz e-mailben vagy
              telefonon kezdődik, a másolgatás fölösleges lépés. */}
          <div className="mp-meta" style={{ marginTop: 8 }}>
            <span><b>{i.contact_name}</b></span>
            <a href={`mailto:${i.email}`} className="sec-l">{i.email}</a>
            {i.phone && <a href={`tel:${i.phone.replace(/\s/g, '')}`} className="sec-l">{i.phone}</a>}
          </div>

          {i.message && (
            <p style={{ margin: '10px 0 0', fontSize: 'var(--t-small)', lineHeight: 1.6 }}>
              {i.message}
            </p>
          )}

          {i.admin_note && (
            <p className="vg-tanulsag" style={{ marginTop: 10 }}>
              <b>Megjegyzés.</b> {i.admin_note}
            </p>
          )}

          {nyitva === i.id ? (
            <div style={{ marginTop: 12 }}>
              <label className="sub">Megjegyzés — csak adminisztrátorok látják</label>
              <textarea className="field" rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Mikor és hogyan kerestük meg, mi lett a megállapodás?" />
              <div className="row" style={{ border: 'none', padding: 0, gap: 8, flexWrap: 'wrap' }}>
                {i.status !== 'contacted' && (
                  <button className="btn sm" disabled={pending} onClick={() => allit(i.id, 'contacted')}>
                    Megkerestem
                  </button>
                )}
                {i.status !== 'closed' && (
                  <button className="btn ghost sm" disabled={pending} onClick={() => allit(i.id, 'closed')}>
                    Lezárás
                  </button>
                )}
                {i.status !== 'new' && (
                  <button className="btn ghost sm" disabled={pending} onClick={() => allit(i.id, 'new')}>
                    Visszatétel újként
                  </button>
                )}
                <button className="btn ghost sm" onClick={() => { setNyitva(null); setNote('') }}>
                  Mégsem
                </button>
              </div>
            </div>
          ) : (
            <button className="btn ghost sm" style={{ marginTop: 12 }}
              onClick={() => { setNyitva(i.id); setNote(i.admin_note ?? '') }}>
              Kezelés
            </button>
          )}
        </div>
      ))}
    </>
  )
}
