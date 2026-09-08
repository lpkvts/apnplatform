'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/icons'

/**
 * Az oktatói jelzés és a munkamód-váltó a fejlécben.
 *
 * Kliensoldalon dönti el, hogy az oktatói felületen vagyunk-e. A gyökér
 * elrendezés ugyanis csak egyszer fut le: oldalváltáskor nem renderelődik
 * újra, ezért a szerveren megállapított útvonal beragadna. Így a kezdőlapra
 * lépve is az oktatói fejléc maradt volna látható.
 */
export function NavEduBadge({ canSwitch }: { canSwitch: boolean }) {
  const path = usePathname()
  const education = path?.startsWith('/oktatas') ?? false

  return (
    <>
      {education && (
        <span className="brand-edu">
          <b>Education</b>
          <span>Oktatói felület</span>
        </span>
      )}

      <span className="spacer" />

      {canSwitch && (
        <Link
          href={education ? '/' : '/oktatas'}
          className="mode-switch"
          title={education ? 'Vissza a klinikai felületre' : 'Váltás az oktatói felületre'}
        >
          <Icon name={education ? 'stethoscope' : 'courses'} size={17} />
          <span>{education ? 'Klinikai' : 'Oktatói'}</span>
        </Link>
      )}
    </>
  )
}
