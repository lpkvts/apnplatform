import Link from 'next/link'
import { getFlag } from '@/lib/flags'

export const dynamic = 'force-dynamic'

export default async function KlinikaPage() {
  const copilotEnabled = await getFlag('apn_copilot', false)
  return (
    <>
      <h1 className="h1">Klinikai mag</h1>
      <p className="sub">Pontozók, betegértékelés és előzmények egy helyen.</p>

      <Link className="card klink" href="/kedvencek">
        <div className="klink-t">⭐ Kedvenceim</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Csillagozott betegségek, laborok, score-ok, EKG-k</div>
      </Link>

      <Link className="card klink" href="/klinika/esetek">
        <div className="klink-t">🗂️ Eseteim és előzmények</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Klinikai esetek és korábbi betegértékelések egy helyen</div>
      </Link>

      <Link className="card klink" href="/kontextus">
        <div className="klink-t">🧠 Klinikai kontextus</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Egy helyzet — minden kapcsolódó eszköz, labor, EKG, irányelv</div>
      </Link>

      <Link className="card klink" href="/betegsegtar">
        <div className="klink-t">🩺 Betegségtár</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>APN-fókuszú betegségoldalak, kereszt-linkekkel</div>
      </Link>

      <Link className="card klink" href="/klinika/tesztek">
        <div className="klink-t">🧮 Klinikai tesztek és skálák</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>56 skála — pontozás, rizikósáv, APN-teendők</div>
      </Link>

      <Link className="card klink" href="/klinika/ertekeles">
        <div className="klink-t">🩺 Új betegértékelés</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Vezetett 12 lépéses folyamat — menthető</div>
      </Link>

      {copilotEnabled && (
        <Link className="card klink" href="/klinika/copilot">
          <div className="klink-t">🤖 APN Copilot</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Célzott, forrásalapú döntéstámogatás</div>
        </Link>
      )}

      <Link className="card klink" href="/klinika/ekg">
        <div className="klink-t">📈 EKG Tudástár</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>30 EKG-kép — görbe, kritériumok, APN-teendők</div>
      </Link>

      <Link className="card klink" href="/klinika/labor">
        <div className="klink-t">🧪 Labor Kisokos</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>49 laborérték — referencia, értelmezés, APN-teendők</div>
      </Link>

      <Link className="card klink" href="/klinika/tudastar">
        <div className="klink-t">📚 Tudástár</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Irányelvek — 3 szinten, kereszt-linkekkel</div>
      </Link>
    </>
  )
}
