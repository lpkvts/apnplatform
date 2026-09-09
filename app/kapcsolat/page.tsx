import { InquiryForm } from '@/components/inquiry-form'
import { LpFejlec, LpLablec } from '@/components/lp-keret'
import { getCurrentUser } from '@/lib/supabase/user'
import { Morzsa } from '@/components/morzsa'
import type { InquiryKind } from '@/lib/inquiry/types'

export const metadata = {
  title: 'Kapcsolat — APN-MED',
  description: 'Kérdés a platformról, hibajelzés, javaslat vagy képzőhelyi érdeklődés.',
}

export default async function KapcsolatPage({
  searchParams,
}: {
  searchParams: Promise<{ tema?: string }>
}) {
  const { tema } = await searchParams
  const user = await getCurrentUser()
  // A nyitóoldalról érkezve rögtön a képzőhelyi témán állunk.
  const kezdo: InquiryKind =
    tema === 'kepzohely' ? 'institution'
    : tema === 'hiba' ? 'bug'
    : tema === 'javaslat' ? 'suggestion'
    : 'general'

  const tartalom = (
    <>
          <h1 className="lp-h2">Kapcsolat</h1>
          <p className="lp-lead">
            Kérdés a platformról, hibajelzés, javaslat vagy intézményi érdeklődés —
            írj bátran.
          </p>

          <InquiryForm initialKind={kezdo} />

          <section className="adat-szakasz" style={{ marginTop: 28 }}>
            <h2 className="adat-cim">Intézményeknek</h2>
            <p>
              Az APN-MED Education az intézmény saját oktatási terét adja a platformon
              belül: kurzusok, klinikai esetek, feladatok automatikus értékeléssel és
              csoportelemzés. A hallgató ugyanazt az alkalmazást használja a tanuláshoz,
              amit később az ágy mellett is. Válaszd az „Intézményi érdeklődés" témát,
              és néhány napon belül keresünk.
            </p>
          </section>

          <div className="safety-note" style={{ marginTop: 18 }}>
            <b>ⓘ Sürgős betegellátási kérdésben ne itt keress minket.</b> A platform
            szakmai tájékozódást támogat, nem helyettesíti a konzultációt és az ügyeleti
            elérhetőségeket.
          </div>
    </>
  )

  // Belépett felhasználónál a platform kerete veszi körül az oldalt, ezért
  // itt csak a tartalom kell. Látogatóként viszont a nyilvános keret jár
  // hozzá — enélkül a fejléc olyan menüt mutatna, ahonnan sehova nem lehet
  // menni.
  if (user) {
    return (
      <>
        <Morzsa elemek={[{ label: 'Kezdőlap', href: '/' }, { label: 'Kapcsolat' }]} />
        {tartalom}
      </>
    )
  }

  return (
    <div className="lp">
      <LpFejlec />
      <main className="lp-sec">
        <div className="lp-wrap lp-kapcs">{tartalom}</div>
      </main>
      <LpLablec />
    </div>
  )
}
