'use client'

import { useState, useTransition } from 'react'
import { ConfirmAction } from '@/components/confirm-action'
import { addMember, setMemberRole, removeMember, type EduMemberRow } from '@/lib/education/members'
import { EDU_ROLE_LABEL, type EduRole } from '@/lib/education/types'

const SZEREPEK: EduRole[] = ['student', 'instructor', 'admin']

/**
 * Az intézmény tagjainak kezelése.
 *
 * A szerepkör intézményhez kötött: ugyanaz a személy az egyik képzőhelyen
 * oktató, a másikon hallgató lehet. Ezért a tagságot itt, az intézményen
 * belül kezeljük, nem a platform-szintű felhasználókezelőben.
 */
export function EduTagok({
  institutionId, intezmenyNev, tagok, sajatId,
}: {
  institutionId: string
  intezmenyNev: string
  tagok: EduMemberRow[]
  /** A bejelentkezett felhasználó — a saját sorát nem távolíthatja el. */
  sajatId: string
}) {
  const [email, setEmail] = useState('')
  const [szerep, setSzerep] = useState<EduRole>('student')
  const [hiba, setHiba] = useState<string | null>(null)
  const [kesz, setKesz] = useState<string | null>(null)
  const [fut, start] = useTransition()

  const felvesz = () =>
    start(async () => {
      setHiba(null); setKesz(null)
      const r = await addMember(institutionId, email, szerep)
      if (r.ok) { setKesz(`${email} felvéve.`); setEmail('') }
      else setHiba(r.hiba ?? 'A felvétel nem sikerült.')
    })

  const szerepValt = (id: string, uj: EduRole) =>
    start(async () => {
      setHiba(null)
      const r = await setMemberRole(id, uj)
      if (!r.ok) setHiba(r.hiba ?? 'A módosítás nem sikerült.')
    })

  const oktatok = tagok.filter((t) => t.role !== 'student').length

  return (
    <>
      <section className="adat-szakasz">
        <h2 className="adat-cim">Új tag felvétele</h2>
        <p className="sub" style={{ margin: '0 0 12px' }}>
          A felhasználónak már regisztrálnia kell a platformon. Enélkül nem lehet
          jogosultságot adni neki — így nem kerülhet hozzáférés olyan címre, amit
          senki nem birtokol.
        </p>

        <div className="tag-urlap">
          <input
            className="field" type="email" value={email} placeholder="E-mail-cím"
            onChange={(e) => setEmail(e.target.value)}
            aria-label="A felvenni kívánt felhasználó e-mail-címe"
          />
          <select className="field" value={szerep}
            onChange={(e) => setSzerep(e.target.value as EduRole)}
            aria-label="Szerepkör">
            {SZEREPEK.map((r) => (
              <option key={r} value={r}>{EDU_ROLE_LABEL[r]}</option>
            ))}
          </select>
          <button className="btn" onClick={felvesz} disabled={fut || !email.trim()}>
            {fut ? 'Felvétel…' : 'Felvétel'}
          </button>
        </div>

        {hiba && <p className="urlap-hiba" role="alert">{hiba}</p>}
        {kesz && <p className="urlap-kesz" role="status">{kesz}</p>}
      </section>

      <section className="adat-szakasz">
        <h2 className="adat-cim">
          {intezmenyNev} — {tagok.length} tag
          {oktatok > 0 && `, ebből ${oktatok} oktatói jogosultsággal`}
        </h2>

        {tagok.length === 0 ? (
          <p className="sub" style={{ margin: 0 }}>
            Még nincs tag. Vedd fel az első oktatót a fenti űrlappal.
          </p>
        ) : (
          <div className="lst">
            {tagok.map((t) => (
              <div className="lst-sor" key={t.id} style={{ cursor: 'default' }}>
                <span className="lst-fo">
                  <b>{t.full_name ?? t.email ?? 'Névtelen'}</b>
                  <span>{t.email}</span>
                </span>
                <span className="lst-veg">
                  <select
                    className="tag-szerep" value={t.role}
                    onChange={(e) => szerepValt(t.id, e.target.value as EduRole)}
                    disabled={fut}
                    aria-label={`${t.full_name ?? t.email} szerepköre`}
                  >
                    {SZEREPEK.map((r) => (
                      <option key={r} value={r}>{EDU_ROLE_LABEL[r]}</option>
                    ))}
                  </select>
                  {t.user_id !== sajatId && (
                    <ConfirmAction
                      className="icon-btn-sm"
                      ariaLabel={`${t.full_name ?? t.email} eltávolítása`}
                      title="Eltávolítás az intézményből"
                      message={`${t.full_name ?? t.email} elveszíti a hozzáférését ehhez az intézményhez. A fiókja megmarad.`}
                      onConfirm={async () => {
                        const r = await removeMember(institutionId, t.id)
                        if (!r.ok) setHiba(r.hiba ?? 'Az eltávolítás nem sikerült.')
                      }}
                    >
                      ✕
                    </ConfirmAction>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
