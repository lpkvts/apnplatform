'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/', label: 'Kezdőlap', icon: '🏠' },
  { href: '/klinika', label: 'Klinika', icon: '🩺' },
  { href: '/kompetenciak', label: 'Kompetenciák', icon: '📈' },
  { href: '/cpd', label: 'CPD', icon: '🎓' },
]

export function BottomNav() {
  const path = usePathname()
  if (path.startsWith('/login')) return null
  return (
    <nav className="bottomnav">
      {TABS.map((t) => {
        const active = t.href === '/' ? path === '/' : path.startsWith(t.href)
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
