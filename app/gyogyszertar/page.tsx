import Link from 'next/link'
import { OldalFej } from '@/components/oldal-fej'
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
      <OldalFej
        cim="Gyógyszertár"
        meta={`${substances.length} hatóanyag`}
        leiras="A készítménynevek változnak, a hatóanyag állandó."
      />

      <Gyogyszertar
        groups={groups} substances={substances}
        antibiotics={antibiotics} summary={summary} nyitottCsoport={csoport}
      />
    </>
  )
}
