'use client'

import { useState, useTransition } from 'react'
import { sendInquiry, type Res } from '@/lib/inquiry/actions'

/**
 * Képzőhelyi érdeklődés űrlapja.
 *
 * Rövid, mert a hosszú űrlap elriaszt: intézmény, név, e-mail kötelező, a
 * többi önkéntes. A hallgatói létszám azért szerepel, mert a válasz attól
 * függ, hány embert érintene a bevezetés.
 */
export function InquiryForm() {
  const [pending, start] = useTransition()
  const [res, setRes] = useState<Res | null>(null)

  if (res?.ok) {
    return (
      <div className="card" style={{ borderLeft: '4px solid var(--ok)' }}>
        <b style={{ fontSize: 'var(--t-h3)' }}>Köszönjük a megkeresést</b>
        <p className="sub" style={{ margin: '8px 0 0' }}>{res.message}</p>
      </div>
    )
  }

  return (
    <form
      className="card"
      action={(fd) => start(async () => setRes(await sendInquiry(fd)))}
    >
      <label className="sub lbl-req" htmlFor="inq-inst">Intézmény neve</label>
      <input className="field" id="inq-inst" name="institution" required
        placeholder="pl. Pécsi Tudományegyetem" autoComplete="organization" />

      <label className="sub lbl-req" htmlFor="inq-nev">Kapcsolattartó neve</label>
      <input className="field" id="inq-nev" name="contact_name" required autoComplete="name" />

      <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="sub lbl-req" htmlFor="inq-email">E-mail</label>
          <input className="field" id="inq-email" name="email" type="email" required
            autoComplete="email" />
        </div>
        <div style={{ flex: 1 }}>
          <label className="sub" htmlFor="inq-tel">Telefon</label>
          <input className="field" id="inq-tel" name="phone" type="tel" autoComplete="tel" />
        </div>
      </div>

      <label className="sub" htmlFor="inq-letszam">Hány hallgatót érintene?</label>
      <select className="field" id="inq-letszam" name="student_count" defaultValue="">
        <option value="">Nem tudom még</option>
        <option value="1-20">1–20</option>
        <option value="21-50">21–50</option>
        <option value="51-150">51–150</option>
        <option value="150+">150 felett</option>
      </select>

      <label className="sub" htmlFor="inq-uzenet">Miben segíthetünk?</label>
      <textarea className="field" id="inq-uzenet" name="message" rows={3}
        placeholder="Milyen képzésről van szó, mikorra tervezitek?" />

      {/* Robotszűrő: valódi felhasználó nem látja, nem is tölti ki. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />

      {res && !res.ok && <div className="form-err" style={{ marginBottom: 10 }}>{res.message}</div>}

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>
        {pending ? 'Küldés…' : 'Megkeresés elküldése'}
      </button>

      <p className="sub" style={{ margin: '10px 0 0', fontSize: 'var(--t-caption)' }}>
        A megadott adatokat kizárólag a megkeresés megválaszolására használjuk.
      </p>
    </form>
  )
}
