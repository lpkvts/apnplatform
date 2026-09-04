import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { EkgLelet } from '@/components/ekg-lelet'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'EKG-lelet átnézése — APN-MED',
  description: 'Feltöltött EKG-lelet strukturált átnézése. Nem diagnózis.',
}

export default async function EkgLeletPage() {
  if (!(await getFlag('ekg_lelet', false))) return <FeatureOff title="EKG-lelet átnézése" />

  return (
    <>
      <Link className="sh-back" href="/klinika/ekg">‹ EKG</Link>
      <div className="row" style={{ border: 'none', padding: 0, alignItems: 'center', gap: 10 }}>
        <h1 className="h1" style={{ margin: 0 }}>EKG-lelet átnézése</h1>
        <span className="st st-progress">Béta</span>
      </div>
      <p className="sub" style={{ marginTop: 6 }}>
        Fotózz le egy EKG-leletet, és a rendszer végigmegy rajta a szokásos elemzési
        lépések szerint. Megfigyeléseket sorol és kérdéseket vet fel — nem diagnózist ad.
      </p>

      <EkgLelet />
    </>
  )
}
