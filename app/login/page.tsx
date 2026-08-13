import { signIn, signUp } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const sp = await searchParams
  return (
    <>
      <h1 className="h1">Belépés</h1>
      <p className="sub">APN Hungary Platform</p>

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

      <div className="card">
        <form>
          <input className="field" name="email" type="email" placeholder="E-mail" required />
          <input
            className="field"
            name="password"
            type="password"
            placeholder="Jelszó"
            required
          />
          <input className="field" name="full_name" placeholder="Teljes név (regisztrációhoz)" />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" formAction={signIn}>
              Belépés
            </button>
            <button className="btn ghost" formAction={signUp}>
              Regisztráció
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
