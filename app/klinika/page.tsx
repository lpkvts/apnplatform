import Link from 'next/link'

export default function KlinikaPage() {
  return (
    <>
      <h1 className="h1">Klinikai mag</h1>
      <p className="sub">Pontozók, betegértékelés és előzmények egy helyen.</p>

      <Link className="card klink" href="/klinika/tesztek">
        <div className="klink-t">🧮 Klinikai tesztek és skálák</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>56 skála — pontozás, rizikósáv, APN-teendők</div>
      </Link>

      <Link className="card klink" href="/klinika/ertekeles">
        <div className="klink-t">🩺 Új betegértékelés</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Vezetett 12 lépéses folyamat — menthető</div>
      </Link>

      <Link className="card klink" href="/klinika/elozmenyek">
        <div className="klink-t">🗂️ Előzmények</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Korábbi mentett értékelések</div>
      </Link>
    </>
  )
}
