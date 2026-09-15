import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentRole } from '@/lib/roles'
import { getAllContributors } from '@/lib/kozremukodok/data'
import { KozremukodoAdmin } from '@/components/kozremukodo-admin'
import { OldalFej } from '@/components/oldal-fej'

export const dynamic = 'force-dynamic'

export default async function CmsKozremukodokPage() {
  const { role } = await currentRole()
  if (role !== 'admin' && role !== 'szerkeszto') redirect('/cms')

  const lista = await getAllContributors()

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Szerkesztés</Link>
      <OldalFej cim="Közreműködők" meta={`${lista.length} fő`} />
      <p className="sub" style={{ marginTop: -6, marginBottom: 14 }}>
        Akik a platform szakmai tartalmát és fejlesztését segítették. A
        közzétett lista a nyilvános oldalon jelenik meg.
      </p>
      <KozremukodoAdmin lista={lista} />
    </>
  )
}
