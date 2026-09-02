import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { VergazElemzo } from '@/components/vergaz'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Vérgázelemzés — APN-MED',
  description: 'Sav-bázis elemzés lépésenként: a zavar iránya, az elsődleges ok, a kompenzáció, '
    + 'az anionrés és az oxigenizáció.',
}

export default async function VergazPage() {
  if (!(await getFlag('vergaz', false))) return <FeatureOff title="Vérgázelemzés" />

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">🩸 Vérgáz</h1>
      <p className="sub">
        Vérgáz elemzés és klinikai értelmezés. Add meg az értékeket, gondold végig lépésenként,
        vagy gyakorolj kész eseteken.
      </p>

      <VergazElemzo />

      <div className="safety-note" style={{ marginTop: 14 }}>
        <b>ⓘ Oktatási és döntéstámogató eszköz.</b> A számítás a megadott értékeken alapul,
        és önmagában nem helyettesíti a szakmai megítélést. A klinikai kép, az anamnézis,
        a mintavétel körülményei és a korábbi leletek együtt értelmezendők. A terápiás
        döntés minden esetben orvosi kompetencia.
      </div>

      <div className="row" style={{ border: 'none', gap: 8, marginTop: 12 }}>
        <Link className="btn ghost" href="/klinika/labor" style={{ flex: 1 }}>Labor Kisokos</Link>
        <Link className="btn ghost" href="/klinika/score" style={{ flex: 1 }}>Klinikai skálák</Link>
      </div>
    </>
  )
}
