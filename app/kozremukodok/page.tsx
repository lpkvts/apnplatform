import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getCurrentUser } from '@/lib/supabase/user'
import { getContributors } from '@/lib/kozremukodok/data'
import { Kozremukodok } from '@/components/kozremukodok'
import { LpFejlec, LpLablec } from '@/components/lp-keret'
import { OldalFej } from '@/components/oldal-fej'
import { Morzsa } from '@/components/morzsa'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Közreműködők — APN-MED',
  description: 'Akik a platform szakmai tartalmát és fejlesztését segítik.',
}

/**
 * Köszönetnyilvánítás.
 *
 * Az oldal nyilvános: a látogató is láthatja, kik állnak a tartalom mögött.
 * Ez nem udvariassági kérdés — a szakmai platform hitelességét az adja meg,
 * hogy kik ellenőrizték.
 */
export default async function KozremukodokPage() {
  if (!(await getFlag('kozremukodok', false))) {
    return <FeatureOff title="Közreműködők" />
  }

  const [user, lista] = await Promise.all([getCurrentUser(), getContributors()])

  const tartalom = (
    <>
      <p className="lp-lead" style={{ marginBottom: 26 }}>
        A platform szakmai tartalma nem egyetlen ember munkája. Az itt
        felsoroltak lektorálással, szakmai tanácsadással, tartalomfejlesztéssel
        vagy a rendszer építésével segítik, hogy az APN-MED használható legyen
        a betegágy mellett. A fejlesztés folyamatos, ezért a lista is bővül.
      </p>

      <Kozremukodok lista={lista} />

      <div className="safety-note" style={{ marginTop: 24 }}>
        <b>ⓘ A közreműködés nem jelent felelősségvállalást.</b> A lektorálás a
        tartalom szakmai pontosságát segíti, de a platform használatáért és a
        klinikai döntésekért az ellátó felel.
      </div>
    </>
  )

  // Belépett felhasználónál a platform kerete veszi körül az oldalt,
  // látogatóként a nyilvános fejléc és lábléc.
  if (user) {
    return (
      <>
        <Morzsa elemek={[{ label: 'Kezdőlap', href: '/' }, { label: 'Közreműködők' }]} />
        <OldalFej cim="Közreműködők" meta={`${lista.length} fő`} />
        {tartalom}
      </>
    )
  }

  return (
    <div className="lp">
      <LpFejlec />
      <main className="lp-sec">
        <div className="lp-wrap lp-kapcs">
          <h1 className="lp-h2" style={{ marginTop: 0 }}>Közreműködők</h1>
          {tartalom}
        </div>
      </main>
      <LpLablec />
    </div>
  )
}
