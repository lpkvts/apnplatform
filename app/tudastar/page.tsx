import Link from 'next/link'
import { OldalFej } from '@/components/oldal-fej'
import { getFlag } from '@/lib/flags'
import { Icon } from '@/components/icons'

export const dynamic = 'force-dynamic'

const CARDS: { href: string; icon: string; title: string; sub: string; meta?: string }[] = [
  { href: '/betegsegtar', icon: 'book', title: 'Betegségtár', sub: 'Kórképek APN-fókuszú adatlapjai', meta: 'kórképek' },
  { href: '/betegsegtar/panasz', icon: 'search2', title: 'Panasz alapján', sub: 'Tünetből a kórképek felé', meta: 'kereső' },
  { href: '/betegsegtar/akut', icon: 'alert', title: 'Akut állapotok', sub: 'Red flag jelek, gyors orientáció', meta: '6 téma' },
  { href: '/klinika/tudastar', icon: 'clipboard', title: 'Protokollok és irányelvek', sub: 'Szakmai összefoglalók, források', meta: 'irányelvek' },
  { href: '/kontextus', icon: 'brain', title: 'Klinikai kontextus', sub: 'Összekapcsolt témák és modulok', meta: 'kapcsolatok' },
]

// A nemzetközi kitekintés kapcsolóhoz kötött, ezért a többi kártyához
// hasonlóan külön kezeljük.
const GYOGYSZERTAR_KARTYA = {
  href: '/gyogyszertar', icon: 'droplet', title: 'Gyógyszertár',
  sub: 'Hatóanyagok, antibiotikumok', meta: 'gyógyszerek',
}

const APN_WORLD_KARTYA = {
  href: '/apn-world', icon: 'compass', title: 'APN World',
  sub: 'Az APN-szerepkör a világban', meta: '9 ország',
}

/** Kapcsolóhoz kötött kártya — csak bekapcsolt állapotban jelenik meg. */
const KOMPETENCIA_KARTYA = {
  href: '/kompetenciaterkep', icon: 'compass', title: 'APN Kompetenciatérkép',
  sub: 'Mit végezhet önállóan az APN, és mihez kell orvosi együttműködés', meta: '274 tétel',
}

export default async function TudastarHub() {
  const kompetenciaterkep = await getFlag('kompetenciaterkep', false)
  const apnWorld = await getFlag('apn_world', false)
  const gyogyszertar = await getFlag('gyogyszertar', false)
  const cards = [
    ...CARDS,
    ...(kompetenciaterkep ? [KOMPETENCIA_KARTYA] : []),
    ...(gyogyszertar ? [GYOGYSZERTAR_KARTYA] : []),
    ...(apnWorld ? [APN_WORLD_KARTYA] : []),
  ]

  return (
    <>
      <OldalFej cim="Tudástár" meta={`${cards.length} terület`} />
      <div className="lst">
        {cards.map((c) => (
          <Link key={c.href} className="lst-sor" href={c.href}>
            <span className="lst-ik"><Icon name={c.icon} size={18} /></span>
            <span className="lst-fo">
              <b>{c.title}</b>
              <span>{c.sub}</span>
            </span>
            {c.meta && <span className="lst-meta">{c.meta}</span>}
          </Link>
        ))}
      </div>
    </>
  )
}
