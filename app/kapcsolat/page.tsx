import Link from 'next/link'
import { InquiryForm } from '@/components/inquiry-form'
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
  // A nyitóoldalról érkezve rögtön a képzőhelyi témán állunk.
  const kezdo: InquiryKind =
    tema === 'kepzohely' ? 'institution'
    : tema === 'hiba' ? 'bug'
    : tema === 'javaslat' ? 'suggestion'
    : 'general'

  return (
    <>
      <Link className="sh-back" href="/">‹ Vissza a nyitóoldalra</Link>

      <h1 className="h1">Kapcsolat</h1>
      <p className="sub" style={{ fontSize: 15 }}>
        Kérdés a platformról, hibajelzés, javaslat vagy képzőhelyi érdeklődés — írj bátran.
      </p>

      <InquiryForm initialKind={kezdo} />

      <div className="card" style={{ marginTop: 12 }}>
        <b style={{ fontSize: 'var(--t-h3)' }}>Egyetemeknek és képzőhelyeknek</b>
        <p className="sub" style={{ margin: '6px 0 0' }}>
          Az APN-MED Education a képzőhely saját oktatási terét adja a platformon belül:
          kurzusok, klinikai esetek, feladatok automatikus értékeléssel és csoportelemzés.
          A hallgató ugyanazt az alkalmazást használja a tanuláshoz, amit később az ágy
          mellett is. Válaszd a „Képzőhelyi érdeklődés" témát, és néhány napon belül keresünk.
        </p>
      </div>

      <div className="safety-note" style={{ marginTop: 12 }}>
        <b>ⓘ Sürgős betegellátási kérdésben ne itt keress minket.</b> A platform szakmai
        tájékozódást támogat, nem helyettesíti a konzultációt és az ügyeleti elérhetőségeket.
      </div>
    </>
  )
}
