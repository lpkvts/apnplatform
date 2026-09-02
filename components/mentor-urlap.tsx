'use client'

import { useState, useTransition } from 'react'
import { saveMentorProfile, type Result } from '@/lib/mentor/actions'
import { TOPICS, FORMATS, SPECIALTIES, STATUS_LABEL, type Status } from '@/lib/mentor/types'

interface Letezo {
  title: string | null; workplace: string | null; specialty: string
  experience_years: number | null; bio: string | null
  topics: string[]; interests: string[]; formats: string[]
  contact_note: string | null; status: Status; review_note: string | null
}

/**
 * Mentorjelentkezés.
 *
 * A témák és a formák előre meghatározott készletből választhatók: enélkül a
 * keresés használhatatlan lenne, mert mindenki másképp fogalmazná meg
 * ugyanazt. A bemutatkozás viszont szabad szöveg — az adja a személyességet.
 */
export function MentorUrlap({ letezo }: { letezo: Letezo | null }) {
  const [pending, start] = useTransition()
  const [res, setRes] = useState<Result | null>(null)
  const [topics, setTopics] = useState<string[]>(letezo?.topics ?? [])
  const [formats, setFormats] = useState<string[]>(letezo?.formats ?? [])
  const [spec, setSpec] = useState(letezo?.specialty ?? '')
  const [bio, setBio] = useState(letezo?.bio ?? '')

  const valt = (lista: string[], set: (v: string[]) => void, x: string) =>
    set(lista.includes(x) ? lista.filter((y) => y !== x) : [...lista, x])

  return (
    <form
      className="card"
      action={(fd) => start(async () => {
        topics.forEach((t) => fd.append('topics', t))
        formats.forEach((f) => fd.append('formats', f))
        fd.set('specialty', spec)
        setRes(await saveMentorProfile(fd))
      })}
    >
      {letezo && (
        <div className="row" style={{ border: 'none', padding: '0 0 12px' }}>
          <span className="sub" style={{ margin: 0 }}>A profil állapota</span>
          <span className={`mp-badge ${letezo.status}`}>{STATUS_LABEL[letezo.status]}</span>
        </div>
      )}

      <label className="sub">Szakmai megnevezés</label>
      <input className="field" name="title" defaultValue={letezo?.title ?? ''}
        placeholder="pl. Kiterjesztett hatáskörű ápoló, intenzív terápia" />

      <label className="sub">Munkahely vagy ellátási terület</label>
      <input className="field" name="workplace" defaultValue={letezo?.workplace ?? ''}
        placeholder="Nem kötelező" />

      <label className="sub">Szakterület</label>
      <div className="sh-chips" style={{ marginBottom: 14 }}>
        {SPECIALTIES.map((s) => (
          <button key={s} type="button" className={`sh-chip ${spec === s ? 'on' : ''}`}
            onClick={() => setSpec(s)}>{s}</button>
        ))}
      </div>

      <label className="sub">Szakmai tapasztalat (év)</label>
      <input className="field" name="experience_years" type="number" min={0} max={60}
        defaultValue={letezo?.experience_years ?? ''} style={{ maxWidth: 120 }} />

      <label className="sub">Bemutatkozás</label>
      <textarea
        className="field" name="bio" rows={5} value={bio} onChange={(e) => setBio(e.target.value)}
        placeholder="Mivel foglalkozol, milyen úton jutottál idáig, és miben tudsz segíteni? Ez alapján keresnek majd."
      />
      <p className="sub" style={{ margin: '-8px 0 14px', fontSize: 11.5 }}>
        {bio.trim().length} karakter — legalább 40 szükséges.
      </p>

      <div className="sec-h" style={{ marginTop: 4 }}>
        <span className="sec-t">Mentorálási témák</span>
        {topics.length > 0 && <span className="sub" style={{ margin: 0, fontSize: 12 }}>{topics.length} kiválasztva</span>}
      </div>
      <div className="sh-chips" style={{ marginBottom: 14 }}>
        {TOPICS.map((t) => (
          <button key={t} type="button" className={`sh-chip ${topics.includes(t) ? 'on' : ''}`}
            onClick={() => valt(topics, setTopics, t)}>{t}</button>
        ))}
      </div>

      <div className="sec-h">
        <span className="sec-t">Milyen formában vállalod?</span>
      </div>
      <div className="sh-chips" style={{ marginBottom: 14 }}>
        {FORMATS.map((f) => (
          <button key={f} type="button" className={`sh-chip ${formats.includes(f) ? 'on' : ''}`}
            onClick={() => valt(formats, setFormats, f)}>{f}</button>
        ))}
      </div>

      <label className="sub">Hogyan keressenek?</label>
      <textarea className="field" name="contact_note" rows={2}
        defaultValue={letezo?.contact_note ?? ''}
        placeholder="pl. Írj bátran, hétköznap esténként tudok válaszolni." />

      {res && <div className={res.ok ? 'form-ok' : 'form-err'} style={{ marginBottom: 10 }}>{res.message}</div>}

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>
        {pending ? 'Mentés…' : letezo ? 'Módosítások mentése' : 'Jelentkezés beküldése'}
      </button>

      <p className="sub" style={{ margin: '10px 0 0', fontSize: 11.5 }}>
        A profilodat a platform bejelentkezett felhasználói látják majd. E-mail címed
        nem jelenik meg.
      </p>
    </form>
  )
}
