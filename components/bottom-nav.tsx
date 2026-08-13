'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Kezdőlap', icon: '🏠' },
  { href: '/klinika', label: 'Klinika', icon: '🩺' },
  { href: '/profil', label: 'Profil', icon: '👤' },
]

// A Profil fül alá tartozó útvonalak (aktív állapothoz)
const PROFILE_PATHS = ['/profil', '/kompetenciak', '/cpd', '/cms']

export function BottomNav() {
  const path = usePathname()
  if (path.startsWith('/login')) return null
  return (
    <nav className="bottomnav">
      {TABS.map((t) => {
        let active: boolean
        if (t.href === '/') active = path === '/'
        else if (t.href === '/profil') active = PROFILE_PATHS.some((p) => path.startsWith(p))
        else active = path.startsWith(t.href)
        return (
          <Link key={t.href} href={t.href} className={active ? 'bn active' : 'bn'}>
            <span className="bn-i">{t.icon}</span>
            <span className="bn-l">{t.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
