import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getMentors, getMyMentorProfile, STATUS_LABEL } from '@/lib/mentor/data'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Mentorprogram — APN-MED',
  description: 'Szakmai tapasztalat, támogatás, közösség. Találd meg a hozzád illő szakmai kapcsolatot.',
}

export default async function MentorPage() {
  if (!(await getFlag('mentorprogram', false))) return <FeatureOff title="Mentorprogram" />

  const [mentors, sajat] = await Promise.all([getMentors(), getMyMentorProfile()])

  return (
    <>
      <h1 className="h1">Mentorprogram</h1>
      <p className="sub" style={{ fontSize: 15 }}>
        Szakmai tapasztalat. Támogatás. Közösség.
      </p>

      <div className="card">
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65 }}>
          A Mentorprogram célja, hogy összekösse azokat a szakembereket, akik szívesen
          megosztanák a tudásukat és a tapasztalatukat, azokkal, akik szakmai fejlődésükhöz
          támogatást keresnek.
        </p>
        <p className="sub" style={{ margin: '10px 0 0' }}>
          Legyen szó pályakezdésről, új szakterületről, továbbképzésről, szakmai döntésekről
          vagy egyszerűen tapasztalatcseréről — itt megtalálhatod a hozzád illő szakmai kapcsolatot.
        </p>
      </div>

      {/* ── A két belépési pont ── */}
      <div className="mp-cta">
        <Link className="mp-card" href="/mentor/kereses">
          <span className="mp-ic" aria-hidden="true">🔎</span>
          <b>Mentort keresek</b>
          <span>Szakmai segítséget és útmutatást keresek.</span>
          <span className="mp-arrow">
            {mentors.length > 0 ? `${mentors.length} elérhető mentor →` : 'Böngészés →'}
          </span>
        </Link>

        <Link className="mp-card alt" href="/mentor/jelentkezes">
          <span className="mp-ic" aria-hidden="true">🤝</span>
          <b>Mentor leszek</b>
          <span>Megosztanám a tudásomat és a tapasztalatomat.</span>
          <span className="mp-arrow">
            {sajat ? 'Profilom megnyitása →' : 'Jelentkezés →'}
          </span>
        </Link>
      </div>

      {/* ── A saját profil állapota ── */}
      {sajat && (
        <>
          <div className="sec-h"><span className="sec-t">A te mentorprofilod</span></div>
          <div className="card">
            <div className="row" style={{ border: 'none', padding: 0 }}>
              <b>{sajat.title || sajat.specialty}</b>
              <span className={`mp-badge ${sajat.status}`}>{STATUS_LABEL[sajat.status]}</span>
            </div>
            {sajat.status === 'pending' && (
              <p className="sub" style={{ margin: '8px 0 0' }}>
                A jelentkezésed elbírálásra vár. Jóváhagyás után megjelensz a mentorok között.
              </p>
            )}
            {sajat.status === 'rejected' && sajat.review_note && (
              <p className="sub" style={{ margin: '8px 0 0' }}>
                Indoklás: {sajat.review_note}
              </p>
            )}
            {sajat.status === 'inactive' && (
              <p className="sub" style={{ margin: '8px 0 0' }}>
                A profilod jelenleg nem jelenik meg a keresésben.
              </p>
            )}
            <Link className="btn ghost sm" href="/mentor/jelentkezes" style={{ marginTop: 10 }}>
              Profil szerkesztése
            </Link>
          </div>
        </>
      )}

      <div className="safety-note" style={{ marginTop: 14 }}>
        <b>ⓘ A mentorálás szakmai támogatás.</b> Nem helyettesíti a munkahelyi vezetést,
        a képzési követelményeket és a betegellátásban kötelező konzultációt. A konkrét
        betegre vonatkozó döntés minden esetben az ellátó team felelőssége.
      </div>
    </>
  )
}
