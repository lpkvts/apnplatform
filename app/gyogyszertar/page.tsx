import Link from 'next/link'
import { Morzsa } from '@/components/morzsa'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getGroups, getSubstances, getAntibiotics, getDrugSummary } from '@/lib/gyogyszer/data'
import { Gyogyszertar } from '@/components/gyogyszertar'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Gyógyszertár — APN-MED',
  description: 'Hatóanyag-központú gyógyszertudásbázis, antibiotikum-súllyal.',
}

export default async function GyogyszertarPage({
  searchParams,
}: {
  searchParams: Promise<{ csoport?: string }>
}) {
  const { csoport } = await searchParams
  if (!(await getFlag('gyogyszertar', false))) return <FeatureOff title="Gyógyszertár" />

  const [groups, substances, antibiotics, summary] = await Promise.all([
    getGroups(), getSubstances(), getAntibiotics(), getDrugSummary(),
  ])

  return (
    <>
      <Morzsa elemek={[{ label: 'Tudástár', href: '/tudastar' }, { label: 'Gyógyszertár' }]} />
      <h1 className="h1">Gyógyszertár</h1>
      <p className="sub" style={{ fontSize: 15 }}>
        Hatóanyag-központú áttekintés: mire való, hogyan hat, mire figyeljen az ápoló.
        A készítménynevek változnak, a hatóanyag állandó.
      </p>

      <Gyogyszertar
        groups={groups} substances={substances}
        antibiotics={antibiotics} summary={summary} nyitottCsoport={csoport}
      />
    </>
  )
}
