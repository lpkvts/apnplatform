'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/icons'

const TABS = [
  { href: '/', label: 'Kezdőlap', icon: 'home' },
  { href: '/klinika', label: 'Klinikum', icon: 'clinic' },
  { href: '/tudastar', label: 'Tudástár', icon: 'book' },
  { href: '/fejlodes', label: 'Fejlődés', icon: 'grad' },
]

// Mely útvonalak tartoznak melyik kategóriához (aktív jelzéshez)
const KLINIKUM = ['/klinika']
const TUDASTAR = ['/tudastar', '/betegsegtar', '/kontextus', '/klinika/tudastar']
const FEJLODES = ['/fejlodes', '/kompetenciak', '/cpd', '/career', '/mentor']

export function BottomNav() {
  const path = usePathname()
  if (path.startsWith('/login')) return null
  const inAny = (list: string[]) => list.some((p) => path === p || path.startsWith(p + '/') || path === p)
  return (
    <nav className="bottomnav">
      {TABS.map((t) => {
        let active: boolean
        if (t.href === '/') active = path === '/'
        else if (t.href === '/tudastar') active = inAny(TUDASTAR)
        else if (t.href === '/fejlodes') active = inAny(FEJLODES)
        else if (t.href === '/klinika') active = inAny(KLINIKUM) && !inAny(TUDASTAR)
        else active = path.startsWith(t.href)
        return (
          <Link key={t.href} href={t.href} className={active ? 'bn active' : 'bn'}>
            <span className="bn-i"><Icon name={t.icon} size={23} /></span>
            <span>{t.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
