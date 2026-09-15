import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentRole } from '@/lib/roles'
import { getFlag } from '@/lib/flags'
import { getAllContributors } from '@/lib/kozremukodok/data'
import { KozremukodoAdmin } from '@/components/kozremukodo-admin'
import { OldalFej } from '@/components/oldal-fej'

export const dynamic = 'force-dynamic'

export default async function CmsKozremukodokPage() {
  const { role } = await currentRole()
  if (role !== 'admin' && role !== 'szerkeszto') redirect('/cms')

  const [lista, bekapcsolva] = await Promise.all([
    getAllContributors(),
    getFlag('kozremukodok', false),
  ])
  const kozzetett = lista.filter((c) => c.publish_status === 'published').length
  const piszkozat = lista.length - kozzetett

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Szerkesztés</Link>
      <OldalFej cim="Közreműködők" meta={`${lista.length} fő`} />
      <p className="sub" style={{ marginTop: -6, marginBottom: 14 }}>
        Akik a platform szakmai tartalmát és fejlesztését segítették.
      </p>

      {/* A nyilvános megjelenésnek két feltétele van, és mindkettő könnyen
          elkerüli a figyelmet. Ezért az állapotot kimondjuk, ahelyett hogy
          a felhasználónak kellene kitalálnia, miért nem látszik a felvitt adat. */}
      <div className={bekapcsolva && kozzetett > 0 ? 'safety-note' : 'card'}
        style={{ marginBottom: 16, ...(bekapcsolva && kozzetett > 0 ? {} : { borderLeft: '3px solid var(--warn)' }) }}>
        <b>{bekapcsolva && kozzetett > 0
          ? 'A lista látható a nyilvános oldalon'
          : 'A lista jelenleg nem látszik a nyilvános oldalon'}</b>
        <div className="sub" style={{ margin: '8px 0 0' }}>
          <div>
            {bekapcsolva ? '✓' : '✗'} A modul{' '}
            {bekapcsolva ? 'be van kapcsolva' : (
              <>ki van kapcsolva — a{' '}
                <Link href="/cms/beallitasok" className="sec-l">Beállításoknál</Link>
                {' '}kapcsolható be
              </>
            )}
          </div>
          <div style={{ marginTop: 4 }}>
            {kozzetett > 0 ? '✓' : '✗'} {kozzetett} közzétett
            {piszkozat > 0 && `, ${piszkozat} piszkozat`}
            {kozzetett === 0 && lista.length > 0 &&
              ' — a felvett adat piszkozatként indul, az „Állapot” mezőben tehető közzé'}
          </div>
        </div>
        {bekapcsolva && kozzetett > 0 && (
          <Link className="btn ghost sm" href="/kozremukodok" style={{ marginTop: 10 }}>
            Nyilvános oldal megnyitása
          </Link>
        )}
      </div>
      <KozremukodoAdmin lista={lista} />
    </>
  )
}
