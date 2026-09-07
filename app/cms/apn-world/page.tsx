import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentRole, isStaff } from '@/lib/roles'
import { getCountries, getSources } from '@/lib/apnworld/data'
import { ApnWorldAdmin } from '@/components/apn-world-admin'

export const dynamic = 'force-dynamic'

export default async function CmsApnWorldPage() {
  const { role } = await currentRole()
  if (!isStaff(role)) redirect('/cms')

  const [countries, sources] = await Promise.all([getCountries(), getSources()])
  const piszkozat = countries.filter((c) => c.publish_status !== 'published').length

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">APN World</h1>
      <p className="sub">
        Országprofilok kezelése. {countries.length} profil,
        {piszkozat > 0 ? ` ebből ${piszkozat} még nincs közzétéve.` : ' mind közzétéve.'}
      </p>
      <ApnWorldAdmin countries={countries} sources={sources} />
    </>
  )
}
