'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/icons'

const TABS = [
  { href: '/', label: 'Kezdőlap', icon: 'home' },
  { href: '/klinika', label: 'Klinika', icon: 'clinic' },
  { href: '/klinika/labor', label: 'Labor', icon: 'flask' },
  { href: '/klinika/ekg', label: 'EKG', icon: 'ekg' },
  { href: '/profil', label: 'Profil', icon: 'user' },
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
            <span className="bn-i"><Icon name={t.icon} size={23} /></span>
            <span>{t.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
