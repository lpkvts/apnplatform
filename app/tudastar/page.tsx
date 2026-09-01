import Link from 'next/link'
import { getFlag } from '@/lib/flags'

export const dynamic = 'force-dynamic'

const CARDS = [
  { href: '/betegsegtar', icon: '🩺', title: 'Betegségtár', sub: 'Kórképek strukturált, APN-fókuszú adatlapjai' },
  { href: '/betegsegtar/panasz', icon: '🔍', title: 'Panasz alapján', sub: 'Tünetből a lehetséges kórképek felé' },
  { href: '/betegsegtar/akut', icon: '🚨', title: 'Akut állapotok', sub: 'Gyors klinikai orientáció, red flag jelek' },
  { href: '/klinika/tudastar', icon: '📋', title: 'Protokollok és irányelvek', sub: 'Evidence-alapú szakmai összefoglalók, források' },
  { href: '/kontextus', icon: '🧠', title: 'Klinikai kontextus', sub: 'Összekapcsolt klinikai témák és modulok' },
]

/** Kapcsolóhoz kötött kártya — csak bekapcsolt állapotban jelenik meg. */
const KOMPETENCIA_KARTYA = {
  href: '/kompetenciaterkep', icon: '🧭', title: 'APN Kompetenciatérkép',
  sub: 'Mit végezhet önállóan az APN, és mihez kell orvosi együttműködés',
}

export default async function TudastarHub() {
  const kompetenciaterkep = await getFlag('kompetenciaterkep', false)
  const cards = kompetenciaterkep ? [...CARDS, KOMPETENCIA_KARTYA] : CARDS

  return (
    <>
      <h1 className="h1">Tudástár</h1>
      <p className="sub">Szakmai tudás és klinikai referencia egy helyen — betegségek, panaszok, akut állapotok, protokollok és evidence.</p>
      {cards.map((c) => (
        <Link key={c.href} className="card klink" href={c.href}>
          <div className="klink-t">{c.icon} {c.title}</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>{c.sub}</div>
        </Link>
      ))}
    </>
  )
}
