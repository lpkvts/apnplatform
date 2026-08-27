import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { setNewPassword } from './actions'

export const dynamic = 'force-dynamic'

export default async function UjJelszoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Ide csak érvényes visszaállító linkről lehet eljutni — az hozza létre
  // a munkamenetet. Enélkül nincs mit módosítani.
  if (!user) {
    return (
      <>
        <h1 className="h1">Új jelszó</h1>
        <div className="card">
          <p className="form-err" style={{ margin: 0 }}>
            Ez az oldal csak a jelszó-visszaállító levélben lévő linkről érhető el.
            A link egyszer használható, és rövid ideig érvényes.
          </p>
        </div>
        <Link className="btn" href="/login" style={{ width: '100%', marginTop: 12 }}>
          Vissza a bejelentkezéshez
        </Link>
      </>
    )
  }

  return (
    <>
      <h1 className="h1">Új jelszó megadása</h1>
      <p className="sub">{user.email}</p>

      <form className="card" action={setNewPassword}>
        <label className="sub">Új jelszó (legalább 12 karakter, betű és szám)</label>
        <input className="field" name="password" type="password" autoComplete="new-password" required minLength={12} />
        <label className="sub">Új jelszó ismét</label>
        <input className="field" name="password2" type="password" autoComplete="new-password" required minLength={12} />
        {error && <div className="form-err" style={{ marginBottom: 10 }}>{error}</div>}
        <button className="btn" type="submit" style={{ width: '100%' }}>Jelszó mentése</button>
      </form>

      <p className="sub" style={{ marginTop: 10, fontSize: 12 }}>
        Mentés után be leszel jelentkezve az új jelszóval.
      </p>
    </>
  )
}
