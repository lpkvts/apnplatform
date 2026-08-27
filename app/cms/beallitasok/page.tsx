import Link from 'next/link'
import { currentRole, isAdmin } from '@/lib/roles'
import { getFlags } from '@/lib/flags'
import { toggleFlag, saveMaintenanceMessage } from './actions'
export const dynamic = 'force-dynamic'
export default async function BeallitasokPage() {
  const { role } = await currentRole()
  if (!isAdmin(role)) return <><h1 className="h1">Beállítások</h1><div className="card">Ehhez admin jogosultság szükséges.</div></>
  const flags = await getFlags()
  const maint = flags.find((f) => f.key === 'maintenance')
  const others = flags.filter((f) => f.key !== 'maintenance')

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Beállítások</h1>

      {/* A karbantartás minden felhasználót érint, ezért külön, kiemelt helyen áll. */}
      {maint && (
        <>
          <div className="sec-h"><span className="sec-t">Karbantartási mód</span></div>
          <div className="card" style={maint.enabled ? { borderColor: '#F0B429', borderWidth: 2 } : undefined}>
            <div className="row" style={{ border: 'none', padding: 0 }}>
              <div>
                <b>{maint.enabled ? '🔧 Karbantartás bekapcsolva' : 'Karbantartás kikapcsolva'}</b>
                <div className="sub" style={{ margin: '2px 0 0' }}>
                  {maint.enabled
                    ? 'A felhasználók a tájékoztató oldalt látják. Adminisztrátorként te továbbra is dolgozhatsz.'
                    : 'A platform mindenki számára elérhető.'}
                </div>
              </div>
              <form action={toggleFlag}>
                <input type="hidden" name="key" value="maintenance" />
                <input type="hidden" name="enabled" value={String(maint.enabled)} />
                <button className={`btn sm ${maint.enabled ? '' : 'ghost'}`} type="submit">
                  {maint.enabled ? 'Kikapcsolás' : 'Bekapcsolás'}
                </button>
              </form>
            </div>

            <form action={saveMaintenanceMessage} style={{ marginTop: 14 }}>
              <label className="sub">Üzenet a felhasználóknak</label>
              <textarea
                className="field" name="value" rows={3}
                defaultValue={maint.value ?? ''}
                placeholder="Üresen hagyva az alapértelmezett szöveg jelenik meg."
              />
              <button className="btn ghost sm" type="submit">Üzenet mentése</button>
            </form>

            {maint.enabled && (
              <div className="safety-note" style={{ marginTop: 12, borderLeftColor: '#B45309' }}>
                <b>ⓘ Mielőtt bezárod ezt az oldalt.</b> A karbantartás csak innen kapcsolható ki.
                A bejelentkezés és a jelszó-visszaállítás elérhető marad, hogy be tudj lépni.
              </div>
            )}
          </div>
        </>
      )}

      <div className="sec-h"><span className="sec-t">Modulrészek</span></div>
      <p className="sub" style={{ marginTop: 0 }}>A változás azonnal érvényes a felhasználói felületen.</p>
      {others.map((f) => (
        <div className="card" key={f.key}>
          <div className="row" style={{ border: 'none', padding: 0 }}>
            <div><b>{f.label ?? f.key}</b><div className="sub" style={{ margin: '2px 0 0' }}>{f.key}</div></div>
            <form action={toggleFlag}>
              <input type="hidden" name="key" value={f.key} />
              <input type="hidden" name="enabled" value={String(f.enabled)} />
              <button className={`btn sm ${f.enabled ? '' : 'ghost'}`} type="submit">{f.enabled ? 'Bekapcsolva ✓' : 'Kikapcsolva'}</button>
            </form>
          </div>
        </div>
      ))}
      {others.length === 0 && <p className="sub">Nincs további kapcsolható beállítás.</p>}
    </>
  )
}
