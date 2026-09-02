'use client'

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
  return (
    <div className="card">
      <form>
        <input className="field" name="email" type="email" placeholder="E-mail" required
          autoComplete="email" />
        <input className="field" name="password" type="password" placeholder="Jelszó" required
          autoComplete="current-password" />
        {!maintenance && (
          <input className="field" name="full_name" placeholder="Teljes név (regisztrációhoz)"
            autoComplete="name" />
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <Gomb action={signIn} kozben="Belépés…">Belépés</Gomb>
          {/* Karbantartás alatt nincs értelme új fiókot nyitni. */}
          {!maintenance && (
            <Gomb action={signUp} kozben="Létrehozás…" className="btn ghost">Regisztráció</Gomb>
          )}
        </div>

        <Gomb
          action={requestReset} kozben="Küldés…" className="sec-l"
          style={{ background: 'none', border: 0, padding: '10px 0 0', font: 'inherit', fontSize: 13.5, cursor: 'pointer' }}
        >
          Elfelejtettem a jelszavam
        </Gomb>
      </form>
      <p className="sub" style={{ margin: '4px 0 0', fontSize: 12 }}>
        A visszaállításhoz elég az e-mail címet kitölteni.
      </p>
    </div>
  )
}
