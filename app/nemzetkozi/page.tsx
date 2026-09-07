import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { Nemzetkozi } from '@/components/nemzetkozi'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Nemzetközi kitekintés — APN-MED',
  description: 'Az APN-szerepkör a világ országaiban: hatáskör, képzés, felírási jog.',
}

export default async function NemzetkoziPage() {
  if (!(await getFlag('nemzetkozi', false))) return <FeatureOff title="Nemzetközi kitekintés" />

  return (
    <>
      <Link className="sh-back" href="/tudastar">‹ Tudástár</Link>
      <h1 className="h1">Nemzetközi kitekintés</h1>
      <p className="sub">
        Hol tart a kiterjesztett hatáskörű ápolói szerepkör a világban? Kilenc ország
        gyakorlata: mit csinálhat, mit tanul, és mennyire önálló.
      </p>
      <Nemzetkozi />
    </>
  )
}
