'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'

/**
 * Bejelentkezési űrlap folyamatjelzővel.
 *
 * A hitelesítés hálózati kérés, ami több másodpercig is eltarthat. Visszajelzés
 * nélkül a felhasználó azt hiszi, nem történt semmi, és újra megnyomja a gombot
 * — ezért a küldés alatt a gombok tiltottak, és az éppen futó művelet jelzi,
 * hogy dolgozik.
 */

/** Egy gomb, ami küldés közben jelzi a saját állapotát. */
function Gomb({
  action, children, kozben, className = 'btn', style,
}: {
  action: (fd: FormData) => void | Promise<void>
  children: React.ReactNode
  kozben: string
  className?: string
  style?: React.CSSProperties
}) {
  const { pending, action: futo } = useFormStatus()
  // A useFormStatus az egész űrlapra vonatkozik, ezért meg kell nézni, hogy
  // éppen ez a gomb indította-e a küldést — különben mindegyik pörögne.
  const ez = pending && futo === action
  return (
    <button className={className} formAction={action} disabled={pending} style={style}>
      {ez ? (
        <>
          <span className="spin" aria-hidden="true" />
          {kozben}
        </>
      ) : children}
    </button>
  )
}

export function LoginForm({
  signIn, signUp, requestReset, maintenance,
}: {
  signIn: (fd: FormData) => Promise<void>
  signUp: (fd: FormData) => Promise<void>
  requestReset: (fd: FormData) => Promise<void>
  maintenance: boolean
}) {
  // Két mód egy űrlapon. Belépéskor csak e-mail és jelszó kell — a névmező
  // ott fölösleges, és azt sugallja, hogy ki kell tölteni.
  const [regisztral, setRegisztral] = useState(false)

  return (
    <div className="card">
      {!maintenance && (
        <div className="seg-row" style={{ marginBottom: 14 }}>
          <button className={`seg ${!regisztral ? 'on' : ''}`} onClick={() => setRegisztral(false)}>
            Belépés
          </button>
          <button className={`seg ${regisztral ? 'on' : ''}`} onClick={() => setRegisztral(true)}>
            Új fiók
          </button>
        </div>
      )}

      <form>
        <input className="field" name="email" type="email" placeholder="E-mail" required
          autoComplete="email" />
        <input className="field" name="password" type="password" placeholder="Jelszó" required
          autoComplete={regisztral ? 'new-password' : 'current-password'} />

        {regisztral && !maintenance && (
          <>
            <input className="field" name="full_name" placeholder="Teljes neved" autoComplete="name" />
            <p className="sub" style={{ margin: '-8px 0 14px', fontSize: 'var(--t-caption)' }}>
              A szakterületet és a többi adatot később, a profilodban adhatod meg.
            </p>
          </>
        )}

        {regisztral && !maintenance ? (
          <Gomb action={signUp} kozben="Létrehozás…" style={{ width: '100%' }}>
            Fiók létrehozása
          </Gomb>
        ) : (
          <Gomb action={signIn} kozben="Belépés…" style={{ width: '100%' }}>Belépés</Gomb>
        )}

        {!regisztral && (
          <Gomb
            action={requestReset} kozben="Küldés…" className="sec-l"
            style={{ background: 'none', border: 0, padding: '12px 0 0', font: 'inherit', fontSize: 13.5, cursor: 'pointer' }}
          >
            Elfelejtettem a jelszavam
          </Gomb>
        )}
      </form>

      <p className="sub" style={{ margin: '10px 0 0', fontSize: 'var(--t-caption)' }}>
        {regisztral
          ? 'A regisztráció után megerősítő levelet küldhetünk — nézd meg a levélszemetet is.'
          : 'A jelszó visszaállításához elég az e-mail címet kitölteni.'}
      </p>
    </div>
  )
}
