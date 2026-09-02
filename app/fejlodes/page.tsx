import Link from 'next/link'
import { getFlag } from '@/lib/flags'
export const dynamic = 'force-dynamic'
export default async function FejlodesHub() {
  const mentorEnabled = await getFlag('mentorprogram', false)

  const [passportEnabled, careerEnabled, cpdEnabled] = await Promise.all([getFlag('kompetencia_passport', false), getFlag('apn_career', false), getFlag('cpd', false)])
  return (
    <>
      <h1 className="h1">Fejlődés</h1>
      <p className="sub">Szakmai fejlődés és mentorálás: hol tartasz, miben fejlődsz, mi a következő lépésed.</p>

      {/* Az eseteim a saját munka visszatekintése, ezért a fejlődéshez tartozik:
          a klinikumban az aktuális munkát támogató eszközök vannak. */}
      <Link className="card klink" href="/klinika/esetek">
        <div className="klink-t">🗂️ Eseteim és előzmények</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>
          Klinikai esetek és korábbi betegértékelések
        </div>
      </Link>

      {mentorEnabled && (
        <Link className="card klink" href="/mentor">
          <div className="klink-t">🤝 Mentorprogram</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>
            Mentort keresel, vagy megosztanád a tapasztalatod?
          </div>
        </Link>
      )}

      {passportEnabled && (
        <Link className="card klink" href="/kompetenciak">
          <div className="klink-t">📈 Kompetenciák</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Kompetenciaszintek és fejlődési terv</div>
        </Link>
      )}

      {cpdEnabled && (
        <Link className="card klink" href="/cpd">
          <div className="klink-t">🎓 CPD – továbbképzés</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Folyamatos szakmai fejlődés követése</div>
        </Link>
      )}

      {careerEnabled && (
        <Link className="card klink" href="/career">
          <div className="klink-t">💼 APN Career</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Állások, képzések, konferenciák, pályázatok</div>
        </Link>
      )}

      {!passportEnabled && !careerEnabled && (
        <p className="sub" style={{ marginTop: 4 }}>További fejlődési modulok az adminban kapcsolhatók be (Kompetenciák, Career).</p>
      )}
    </>
  )
}
