'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Kezdőlap', icon: '🏠' },
  { href: '/klinika', label: 'Klinika', icon: '🩺' },
  { href: '/klinika/labor', label: 'Labor', icon: '🧪' },
  { href: '/klinika/ekg', label: 'EKG', icon: '📈' },
  { href: '/profil', label: 'Profil', icon: '👤' },
]

const PROFILE_PATHS = ['/profil', '/kompetenciak', '/cpd', '/cms']

export function BottomNav() {
  const path = usePathname()
  if (path.startsWith('/login')) return null
  return (
    <nav className="bottomnav">
      {TABS.map((t) => {
        let active: boolean
        if (t.href === '/') active = path === '/'
        else if (t.href === '/klinika/labor') active = path.startsWith('/klinika/labor')
        else if (t.href === '/klinika/ekg') active = path.startsWith('/klinika/ekg')
        else if (t.href === '/klinika') active = path.startsWith('/klinika') && !path.startsWith('/klinika/labor') && !path.startsWith('/klinika/ekg')
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
