'use client'

import { useState, useTransition } from 'react'
import { sendInquiry, type Res } from '@/lib/inquiry/actions'
import { KIND_LABEL, KIND_HINT, type InquiryKind } from '@/lib/inquiry/types'

/**
 * Kapcsolatfelvételi űrlap.
 *
 * Egyetlen űrlap többféle megkereséshez: a téma kiválasztása után csak az
 * ahhoz tartozó mezők jelennek meg. Ez rövidebb, mint négy külön űrlap,
 * és a beküldőnek sem kell eldöntenie, melyiket keresse.
 */
export function InquiryForm({ initialKind = 'general' }: { initialKind?: InquiryKind }) {
  const [pending, start] = useTransition()
  const [res, setRes] = useState<Res | null>(null)
  const [kind, setKind] = useState<InquiryKind>(initialKind)

  if (res?.ok) {
    return (
      <div className="card" style={{ borderLeft: '4px solid var(--ok)' }}>
        <b style={{ fontSize: 'var(--t-h3)' }}>Köszönjük a megkeresést</b>
        <p className="sub" style={{ margin: '8px 0 0' }}>{res.message}</p>
      </div>
    )
  }

  return (
    <form className="card" action={(fd) => start(async () => setRes(await sendInquiry(fd)))}>
      <input type="hidden" name="kind" value={kind} />

      <label className="sub">Miről van szó?</label>
      <div className="sh-chips" style={{ marginBottom: 6 }}>
        {(Object.keys(KIND_LABEL) as InquiryKind[]).map((k) => (
          <button key={k} type="button" className={`sh-chip ${kind === k ? 'on' : ''}`}
            onClick={() => setKind(k)}>
            {KIND_LABEL[k]}
          </button>
        ))}
      </div>
      <p className="sub" style={{ margin: '0 0 14px', fontSize: 'var(--t-caption)' }}>
        {KIND_HINT[kind]}
      </p>

      {/* Az intézmény neve csak képzőhelyi érdeklődésnél kell — másnál
          fölösleges mező lenne, ami lassítja a beküldést. */}
      {kind === 'institution' && (
        <>
          <label className="sub lbl-req" htmlFor="inq-inst">Intézmény neve</label>
          <input className="field" id="inq-inst" name="institution" required
            placeholder="pl. Pécsi Tudományegyetem" autoComplete="organization" />

          <label className="sub" htmlFor="inq-letszam">Hány hallgatót érintene?</label>
          <select className="field" id="inq-letszam" name="student_count" defaultValue="">
            <option value="">Nem tudom még</option>
            <option value="1-20">1–20</option>
            <option value="21-50">21–50</option>
            <option value="51-150">51–150</option>
            <option value="150+">150 felett</option>
          </select>
        </>
      )}

      <label className="sub lbl-req" htmlFor="inq-nev">Neved</label>
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

      <label className="sub lbl-req" htmlFor="inq-uzenet">Üzenet</label>
      <textarea className="field" id="inq-uzenet" name="message" rows={4} required
        placeholder={
          kind === 'institution' ? 'Milyen képzésről van szó, mikorra tervezitek?'
          : kind === 'bug' ? 'Mi történt, melyik oldalon, milyen készüléken?'
          : kind === 'suggestion' ? 'Mit hiányolsz, mi könnyítené meg a munkádat?'
          : 'Miben segíthetünk?'
        } />

      {/* Robotszűrő: valódi felhasználó nem látja, nem is tölti ki. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off"
        aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />

      {res && !res.ok && <div className="form-err" style={{ marginBottom: 10 }}>{res.message}</div>}

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>
        {pending ? 'Küldés…' : 'Üzenet elküldése'}
      </button>

      <p className="sub" style={{ margin: '10px 0 0', fontSize: 'var(--t-caption)' }}>
        A megadott adatokat kizárólag a megkeresés megválaszolására használjuk.
      </p>
    </form>
  )
}
