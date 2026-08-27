import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMaintenance } from '@/lib/flags'
import { currentRole, isAdmin } from '@/lib/roles'
import { RingLogo } from '@/components/icons'

export const dynamic = 'force-dynamic'

/**
 * Karbantartási tájékoztató.
 *
 * Ha a karbantartás nincs bekapcsolva, itt nincs mit mutatni — ilyenkor
 * visszairányítunk a kezdőlapra, hogy az oldal ne maradjon elérhető
 * félrevezető üzenettel.
 */
export default async function KarbantartasPage() {
  const { on, message } = await getMaintenance()
  if (!on) redirect('/')

  const { role } = await currentRole()

  return (
    <div className="maint">
      <span className="maint-logo"><RingLogo size={44} /></span>
      <h1 className="maint-t">Karbantartás</h1>
      <p className="maint-m">{message}</p>

      {isAdmin(role) ? (
        <>
          <div className="maint-admin">
            <b>Adminisztrátorként be vagy jelentkezve.</b>
            <span>A platform számodra elérhető marad, a többi felhasználó ezt az oldalt látja.</span>
          </div>
          <Link className="btn" href="/cms/beallitasok">Karbantartás kikapcsolása</Link>
        </>
      ) : (
        <>
          <p className="maint-sub">
            Ha sürgős kérdésed van, keresd az intézményi kapcsolattartót.
          </p>
          {/* Kijelentkezett adminisztrátornak is el kell jutnia a belépéshez,
              különben nem tudná kikapcsolni a karbantartást. */}
          <Link className="sec-l" href="/login" style={{ marginTop: 18, fontSize: 13.5 }}>
            Bejelentkezés
          </Link>
        </>
      )}
    </div>
  )
}
