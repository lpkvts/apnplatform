import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getCountries, getSummary, getTimeline } from '@/lib/apnworld/data'
import { ApnWorld } from '@/components/apn-world'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'APN World — APN-MED',
  description: 'Hogyan működik a kiterjesztett hatáskörű ápolás a világ egészségügyi rendszereiben.',
}

export default async function ApnWorldPage() {
  if (!(await getFlag('apn_world', false))) return <FeatureOff title="APN World" />

  const [countries, summary, timeline] = await Promise.all([
    getCountries(), getSummary(), getTimeline(),
  ])

  return (
    <>
      <Link className="sh-back" href="/tudastar">‹ Tudástár</Link>
      <h1 className="h1">APN World</h1>
      <p className="sub" style={{ fontSize: 15 }}>
        Hogyan működik a kiterjesztett hatáskörű ápolás a világ egészségügyi
        rendszereiben — az oktatástól és a szabályozástól a klinikai hatáskörig
        és az önálló betegellátásig.
      </p>

      <ApnWorld countries={countries} summary={summary} timeline={timeline} />

      <div className="safety-note" style={{ marginTop: 16 }}>
        <b>ⓘ Nem rangsor.</b> Az APN-rendszerek eltérő egészségügyi, jogi és oktatási
        környezetben működnek, ezért nem hasonlíthatók össze jobb–rosszabb tengelyen.
        Az összeállítás célja a rendszerek megértése, nem a minősítésük. A szabályozás
        gyorsan változik: minden országprofilnál szerepel, mikor ellenőriztük utoljára.
      </div>
    </>
  )
}
