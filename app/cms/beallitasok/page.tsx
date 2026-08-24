import Link from 'next/link'
import { currentRole, isAdmin } from '@/lib/roles'
import { getFlags } from '@/lib/flags'
import { toggleFlag } from './actions'
export const dynamic = 'force-dynamic'
export default async function BeallitasokPage() {
  const { role } = await currentRole()
  if (!isAdmin(role)) return <><h1 className="h1">Beállítások</h1><div className="card">Ehhez admin jogosultság szükséges.</div></>
  const flags = await getFlags()
  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Beállítások</h1>
      <p className="sub">Modulrészek ki-/bekapcsolása. A változás azonnal érvényes a felhasználói felületen.</p>
      {flags.map((f) => (
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
      {flags.length === 0 && <p className="sub">Nincs kapcsolható beállítás.</p>}
    </>
  )
}
