import Link from 'next/link'
import { getFlag } from '@/lib/flags'
export const dynamic = 'force-dynamic'

export default async function KlinikaPage() {
  const copilotEnabled = await getFlag('apn_copilot', false)
  const cards = [
    { href: '/klinika/vizsgalat', icon: '🩺', title: 'Betegvizsgálat', sub: 'Strukturált propedeutikai vizsgálat — klinikai és oktatási mód' },
    { href: '/klinika/ertekeles', icon: '📝', title: 'Új betegértékelés', sub: 'Gyors, 12 lépéses klinikai értékelés' },
    { href: '/klinika/esetek', icon: '🗂️', title: 'Eseteim és előzmények', sub: 'Klinikai esetek és korábbi betegértékelések' },
    { href: '/klinika/tesztek', icon: '🧮', title: 'Score Hub', sub: '56 klinikai skála és pontozó' },
    { href: '/klinika/labor', icon: '🧪', title: 'Labor', sub: 'Laborértékek, referencia és értelmezés' },
    { href: '/klinika/ekg', icon: '📈', title: 'EKG', sub: 'EKG-atlasz és gyakorlás' },
  ]
  return (
    <>
      <h1 className="h1">Klinikum</h1>
      <p className="sub">A napi klinikai munka támogatása — vizsgálat, értékelés, labor, EKG, score-ok, esetek.</p>
      {cards.map((c) => (
        <Link key={c.href} className="card klink" href={c.href}>
          <div className="klink-t">{c.icon} {c.title}</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>{c.sub}</div>
        </Link>
      ))}
      {copilotEnabled && (
        <Link className="card klink" href="/klinika/copilot">
          <div className="klink-t">🤖 APN Copilot</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Célzott, forrásalapú döntéstámogatás</div>
        </Link>
      )}
    </>
  )
}
