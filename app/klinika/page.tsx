import Link from 'next/link'
import { OldalFej } from '@/components/oldal-fej'
import { getFlag } from '@/lib/flags'
import { Icon } from '@/components/icons'
export const dynamic = 'force-dynamic'

export default async function KlinikaPage() {
  const [copilotEnabled, ertekelesEnabled] = await Promise.all([
    getFlag('apn_copilot', false),
    getFlag('ertekeles', false),
  ])
  const cards = [
    { href: '/klinika/vizsgalat', icon: 'stethoscope', title: 'Betegvizsgálat', sub: 'Propedeutika, tíz szervrendszer', meta: '71 elem' },
    { href: '/klinika/ertekeles', icon: 'clipboard', title: 'Új betegértékelés', sub: 'Gyors klinikai értékelés', meta: '12 lépés' },
    { href: '/klinika/tesztek', icon: 'calculator', title: 'Skálák és score-ok', sub: 'Pontozók, rizikóbecslés', meta: '58 skála' },
    { href: '/klinika/labor', icon: 'flask', title: 'Labor', sub: 'Referencia, kritikus küszöb', meta: '61 érték' },
    { href: '/klinika/vergaz', icon: 'droplet', title: 'Vérgáz', sub: 'Sav-bázis, lépésenként', meta: '10 eset' },
    { href: '/klinika/ekg', icon: 'pulse', title: 'EKG', sub: 'Atlasz, gyakorlás, vizsga', meta: '30 tétel' },
  ]
  return (
    <>
      <OldalFej cim="Klinikum" meta={`${cards.length} eszköz`} />
      <div className="lst">
        {cards.filter((c) => c.href !== '/klinika/ertekeles' || ertekelesEnabled).map((c) => (
          <Link key={c.href} className="lst-sor" href={c.href}>
            <span className="lst-ik"><Icon name={c.icon} size={18} /></span>
            <span className="lst-fo">
              <b>{c.title}</b>
              <span>{c.sub}</span>
            </span>
            {c.meta && <span className="lst-meta">{c.meta}</span>}
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
