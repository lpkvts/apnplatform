'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Az oktatói felület kerete.
 *
 * A törzs osztályát kliensoldalon állítja, mert a gyökér elrendezés
 * oldalváltáskor nem fut le újra. A takarítás a kilépéskor is megtörténik,
 * így a klinikai oldalakon nem marad ott az oktatói elrendezés.
 */
export function EduShell({
  sidebar, children,
}: {
  sidebar: React.ReactNode
  children: React.ReactNode
}) {
  const path = usePathname()

  useEffect(() => {
    document.body.classList.add('mode-education')
    return () => document.body.classList.remove('mode-education')
  }, [])

  // Az aktuális kurzus kiemelése az oldalsávban. A CSS nem tud dinamikus
  // azonosítóra illeszkedni, ezért az osztályt itt tesszük a helyére.
  useEffect(() => {
    const id = path?.startsWith('/oktatas/kurzus/') ? path.split('/')[3] : null
    document.querySelectorAll('.edu-side-l').forEach((el) => {
      const sajat = el.getAttribute('data-course')
      const aktiv = id ? sajat === id : el.getAttribute('href') === '/oktatas'
      el.classList.toggle('on', aktiv)
    })
  }, [path])

  return (
    <div className="edu-shell">
      {sidebar}
      <main className="edu-main">{children}</main>
    </div>
  )
}
