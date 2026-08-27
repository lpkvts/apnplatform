import { signIn, signUp, requestReset } from './actions'
import { getMaintenance } from '@/lib/flags'
import { RingLogo } from '@/components/icons'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const sp = await searchParams
  const maint = await getMaintenance()

  const messages = (
    <>
      {sp.error ? (
        <div className="card" style={{ borderColor: '#fca5a5', color: '#b91c1c' }}>
          {sp.error}
        </div>
      ) : null}
      {sp.message ? (
        <div className="card" style={{ borderColor: '#6ee7b7', color: '#047857' }}>
          {sp.message}
        </div>
      ) : null}
    </>
  )

  const form = (
    <div className="card">
      <form>
        <input className="field" name="email" type="email" placeholder="E-mail" required />
        <input className="field" name="password" type="password" placeholder="Jelszó" required />
        {!maint.on && (
          <input className="field" name="full_name" placeholder="Teljes név (regisztrációhoz)" />
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" formAction={signIn}>Belépés</button>
          {/* Karbantartás alatt nincs értelme új fiókot nyitni. */}
          {!maint.on && (
            <button className="btn ghost" formAction={signUp}>Regisztráció</button>
          )}
        </div>
        <button
          className="sec-l"
          formAction={requestReset}
          style={{ background: 'none', border: 0, padding: '10px 0 0', font: 'inherit', fontSize: 13.5, cursor: 'pointer' }}
        >
          Elfelejtettem a jelszavam
        </button>
      </form>
      <p className="sub" style={{ margin: '4px 0 0', fontSize: 12 }}>
        A visszaállításhoz elég az e-mail címet kitölteni.
      </p>
    </div>
  )

  /* ── Karbantartás alatt: csak a tájékoztató ──
     A bejelentkezés nem tűnhet el nyomtalanul, mert kijelentkezett állapotban
     az adminisztrátor sem tudná feloldani a karbantartást. Ezért az űrlap
     rejtve van, de egy visszafogott lenyitóval elérhető marad. */
  if (maint.on) {
    return (
      <div className="maint">
        <span className="maint-logo"><RingLogo size={44} /></span>
        <h1 className="maint-t">Karbantartás</h1>
        <p className="maint-m">{maint.message}</p>

        <div style={{ width: '100%', maxWidth: 420, marginTop: 26 }}>
          {messages}
          <details className="maint-login">
            <summary>Adminisztrátori belépés</summary>
            <div style={{ marginTop: 10 }}>{form}</div>
          </details>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <h1 className="h1">Belépés</h1>
      <p className="sub">APN-MED</p>
      {messages}
      {form}
    </div>
  )
}
