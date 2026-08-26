'use client'

import { useState, useTransition } from 'react'
import {
  adminUpdateProfile, adminSetRole, adminSetPassword,
  adminSendRecovery, adminSetEmail, adminSetBan, type ActionResult,
} from '@/app/cms/felhasznalok/actions'

export interface AdminUser {
  id: string
  email: string | null
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  full_name: string | null
  role: string
  apn_type: string | null
  title: string | null
  workplace: string | null
  specialty: string | null
  qualification: string | null
  qual_year: number | null
  registration_no: string | null
  phone: string | null
  created_at: string
  banned: boolean
}

const ROLES: { value: string; label: string; note: string }[] = [
  { value: 'apn', label: 'APN', note: 'Klinikai tartalmak használata' },
  { value: 'szerkeszto', label: 'Szerkesztő', note: 'Tartalom írása és publikálása' },
  { value: 'lektor', label: 'Lektor', note: 'Tartalom szakmai ellenőrzése' },
  { value: 'admin', label: 'Admin', note: 'Teljes hozzáférés, felhasználókezelés' },
]

function Msg({ r }: { r: ActionResult | null }) {
  if (!r) return null
  return <div className={r.ok ? 'form-ok' : 'form-err'} style={{ marginTop: 8 }}>{r.message}</div>
}

export function UserEditor({ user, adminApiReady, isSelf }: { user: AdminUser; adminApiReady: boolean; isSelf: boolean }) {
  const name = user.full_name || user.email || '(névtelen)'
  const [pending, start] = useTransition()

  const [profRes, setProfRes] = useState<ActionResult | null>(null)
  const [roleRes, setRoleRes] = useState<ActionResult | null>(null)
  const [pwRes, setPwRes] = useState<ActionResult | null>(null)
  const [mailRes, setMailRes] = useState<ActionResult | null>(null)
  const [banRes, setBanRes] = useState<ActionResult | null>(null)
  const [role, setRole] = useState(user.role)

  return (
    <>
      {!adminApiReady && (
        <div className="safety-note" style={{ borderLeftColor: '#C0392B' }}>
          <b>ⓘ A jelszó- és e-mail-kezelés nincs beállítva.</b> Ehhez a <code>SUPABASE_SERVICE_ROLE_KEY</code>{' '}
          környezeti változót fel kell venni a Vercelen (Supabase → Project Settings → API → service_role).
          A profiladatok és a szerepkör enélkül is szerkeszthető.
        </div>
      )}

      {/* ── Profiladatok ── */}
      <div className="sec-h"><span className="sec-t">Szakmai adatok</span></div>
      <form
        className="card"
        action={(fd) => start(async () => setProfRes(await adminUpdateProfile(user.id, fd)))}
      >
        <label className="sub">Teljes név</label>
        <input className="field" name="full_name" defaultValue={user.full_name ?? ''} />
        <label className="sub">APN szakirány</label>
        <input className="field" name="apn_type" defaultValue={user.apn_type ?? ''} />
        <label className="sub">Beosztás</label>
        <input className="field" name="title" defaultValue={user.title ?? ''} />
        <label className="sub">Munkahely</label>
        <input className="field" name="workplace" defaultValue={user.workplace ?? ''} />
        <label className="sub">Szakterület</label>
        <input className="field" name="specialty" defaultValue={user.specialty ?? ''} />
        <label className="sub">Végzettség</label>
        <input className="field" name="qualification" defaultValue={user.qualification ?? ''} />
        <label className="sub">Végzettség éve</label>
        <input className="field" name="qual_year" type="number" defaultValue={user.qual_year ?? ''} />
        <label className="sub">Nyilvántartási szám</label>
        <input className="field" name="registration_no" defaultValue={user.registration_no ?? ''} />
        <label className="sub">Telefon</label>
        <input className="field" name="phone" defaultValue={user.phone ?? ''} />
        <button className="btn" type="submit" disabled={pending}>Adatok mentése</button>
        <Msg r={profRes} />
      </form>

      {/* ── Szerepkör ── */}
      <div className="sec-h"><span className="sec-t">Szerepkör</span></div>
      <div className="card">
        {ROLES.map((r) => (
          <label key={r.value} className="row" style={{ cursor: 'pointer' }}>
            <span>
              <input
                type="radio" name="role" value={r.value} checked={role === r.value}
                onChange={() => setRole(r.value)} style={{ marginRight: 8 }}
              />
              <b>{r.label}</b>
              <span className="sub" style={{ display: 'block', margin: '2px 0 0 24px' }}>{r.note}</span>
            </span>
          </label>
        ))}
        <button
          className="btn" disabled={pending || role === user.role}
          onClick={() => start(async () => setRoleRes(await adminSetRole(user.id, role, name)))}
          style={{ marginTop: 8 }}
        >
          Szerepkör mentése
        </button>
        {isSelf && (
          <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>
            Ez a saját fiókod. Ha elveszed magadtól az admin jogot, nem tudod visszaadni.
          </div>
        )}
        <Msg r={roleRes} />
      </div>

      {/* ── Jelszó ── */}
      <div className="sec-h"><span className="sec-t">Jelszó</span></div>
      <div className="card">
        <p className="sub" style={{ marginTop: 0 }}>
          Két lehetőség van. Biztonságosabb, ha a felhasználó maga állítja be a jelszavát — így rajta kívül
          senki nem ismeri. Ideiglenes jelszó akkor indokolt, ha a felhasználó nem fér hozzá a postafiókjához.
        </p>

        <form
          action={(fd) => start(async () => setPwRes(await adminSetPassword(user.id, fd, name)))}
        >
          <label className="sub">Új jelszó (legalább 12 karakter, betű és szám)</label>
          <input className="field" name="password" type="password" autoComplete="new-password" required minLength={12} />
          <label className="sub">Új jelszó ismét</label>
          <input className="field" name="password2" type="password" autoComplete="new-password" required minLength={12} />
          <button className="btn" type="submit" disabled={pending || !adminApiReady}>Jelszó beállítása</button>
        </form>

        <button
          className="btn ghost" disabled={pending || !adminApiReady || !user.email}
          onClick={() => start(async () => setPwRes(await adminSendRecovery(user.id, user.email ?? '', name)))}
          style={{ marginTop: 8, width: '100%' }}
        >
          Jelszó-visszaállító levél küldése
        </button>
        <Msg r={pwRes} />
      </div>

      {/* ── E-mail ── */}
      <div className="sec-h"><span className="sec-t">Belépési e-mail cím</span></div>
      <form
        className="card"
        action={(fd) => start(async () => setMailRes(await adminSetEmail(user.id, fd, name)))}
      >
        <label className="sub">E-mail cím</label>
        <input className="field" name="email" type="email" defaultValue={user.email ?? ''} required />
        <div className="sub" style={{ fontSize: 12, marginBottom: 8 }}>
          A módosítás után a felhasználó ezzel a címmel lép be. A cím megerősítettként kerül rögzítésre.
        </div>
        <button className="btn" type="submit" disabled={pending || !adminApiReady}>E-mail módosítása</button>
        <Msg r={mailRes} />
      </form>

      {/* ── Hozzáférés ── */}
      <div className="sec-h"><span className="sec-t">Hozzáférés</span></div>
      <div className="card">
        <p className="sub" style={{ marginTop: 0 }}>
          A letiltott fiók adatai megmaradnak, de a felhasználó nem tud belépni. Kilépő munkatársnál ez a
          javasolt lépés a törlés helyett.
        </p>
        <button
          className="btn ghost" disabled={pending || !adminApiReady || isSelf}
          onClick={() => start(async () => setBanRes(await adminSetBan(user.id, !user.banned, name)))}
          style={{ width: '100%' }}
        >
          {user.banned ? 'Letiltás feloldása' : 'Fiók letiltása'}
        </button>
        {isSelf && <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>A saját fiókodat nem tilthatod le.</div>}
        <Msg r={banRes} />
      </div>
    </>
  )
}
