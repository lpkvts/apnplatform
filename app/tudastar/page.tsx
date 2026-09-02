import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { Icon } from '@/components/icons'

export const dynamic = 'force-dynamic'

const CARDS = [
  { href: '/betegsegtar', icon: 'book', title: 'Betegségtár', sub: 'Kórképek strukturált, APN-fókuszú adatlapjai' },
  { href: '/betegsegtar/panasz', icon: 'search2', title: 'Panasz alapján', sub: 'Tünetből a lehetséges kórképek felé' },
  { href: '/betegsegtar/akut', icon: 'alert', title: 'Akut állapotok', sub: 'Gyors klinikai orientáció, red flag jelek' },
  { href: '/klinika/tudastar', icon: 'clipboard', title: 'Protokollok és irányelvek', sub: 'Evidence-alapú szakmai összefoglalók, források' },
  { href: '/kontextus', icon: 'brain', title: 'Klinikai kontextus', sub: 'Összekapcsolt klinikai témák és modulok' },
]

/** Kapcsolóhoz kötött kártya — csak bekapcsolt állapotban jelenik meg. */
const KOMPETENCIA_KARTYA = {
  href: '/kompetenciaterkep', icon: 'compass', title: 'APN Kompetenciatérkép',
  sub: 'Mit végezhet önállóan az APN, és mihez kell orvosi együttműködés',
}

export default async function TudastarHub() {
  const kompetenciaterkep = await getFlag('kompetenciaterkep', false)
  const cards = kompetenciaterkep ? [...CARDS, KOMPETENCIA_KARTYA] : CARDS

  return (
    <>
      <h1 className="h1">Tudástár</h1>
      <p className="sub">Szakmai tudás és klinikai referencia egy helyen — betegségek, panaszok, akut állapotok, protokollok és evidence.</p>
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
      </div>
    </>
  )
}
