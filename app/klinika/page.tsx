import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { Icon } from '@/components/icons'
export const dynamic = 'force-dynamic'

export default async function KlinikaPage() {
  const copilotEnabled = await getFlag('apn_copilot', false)
  const cards = [
    { href: '/klinika/vizsgalat', icon: 'stethoscope', title: 'Betegvizsgálat', sub: 'Strukturált propedeutikai vizsgálat — klinikai és oktatási mód' },
    { href: '/klinika/ertekeles', icon: 'clipboard', title: 'Új betegértékelés', sub: 'Gyors, 12 lépéses klinikai értékelés' },
    { href: '/klinika/tesztek', icon: 'calculator', title: 'Score Hub', sub: '56 klinikai skála és pontozó' },
    { href: '/klinika/labor', icon: 'flask', title: 'Labor', sub: 'Laborértékek, referencia és értelmezés' },
    { href: '/klinika/vergaz', icon: 'droplet', title: 'Vérgáz', sub: 'Vérgáz elemzés és klinikai értelmezés' },
    { href: '/klinika/ekg', icon: 'pulse', title: 'EKG', sub: 'EKG-atlasz és gyakorlás' },
  ]
  return (
    <>
      <h1 className="h1">Klinikum</h1>
      <p className="sub">A napi klinikai munka támogatása — vizsgálat, értékelés, labor, vérgáz, EKG és klinikai skálák.</p>
      <div className="lst">
        {cards.map((c) => (
          <Link key={c.href} className="lst-sor" href={c.href}>
            <span className="lst-ik"><Icon name={c.icon} size={18} /></span>
            <span className="lst-fo">
              <b>{c.title}</b>
              <span>{c.sub}</span>
            </span>
            <span className="lst-nyil" aria-hidden="true">›</span>
          </Link>
        ))}
        {copilotEnabled && (
          <Link className="lst-sor" href="/klinika/copilot">
            <span className="lst-ik"><Icon name="copilot" size={18} /></span>
            <span className="lst-fo">
              <b>APN Copilot</b>
              <span>Célzott, forrásalapú döntéstámogatás</span>
            </span>
            <span className="lst-nyil" aria-hidden="true">›</span>
          </Link>
        )}
      </div>
    </>
  )
}
