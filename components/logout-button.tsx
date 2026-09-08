'use client'

import { useTransition } from 'react'
import { signOut } from '@/lib/actions/auth'
import { Icon } from '@/components/icons'

/**
 * Kijelentkezés.
 *
 * A kijelentkezés után teljes oldalbetöltéssel megyünk a nyitóoldalra, nem
 * a szokásos, kliensoldali navigációval. Ennek oka, hogy a keret — fejléc,
 * értesítésszám, alsó sáv — a gyökér elrendezésben készül, azt pedig a
 * böngésző rövid ideig megőrzi. Telepített alkalmazásban a háttérben futó
 * szolgáltatásfájl is tárolhatja.
 *
 * Emiatt a régi fejléc a kijelentkezés után is látszott, benne a
 * felhasználó nevével és az értesítésszámmal. A teljes betöltés minden
 * tárolt állapotot eldob.
 */
export function LogoutButton({
  className = 'icon-btn', children, ariaLabel = 'Kijelentkezés',
}: {
  className?: string
  children?: React.ReactNode
  ariaLabel?: string
}) {
  const [pending, start] = useTransition()

  const kilep = () =>
    start(async () => {
      try {
        await signOut()
      } catch {
        // A szerveroldali átirányítás kivételt dob — ez a várt működés,
        // a kijelentkezés ettől még megtörtént.
      }
      // Teljes betöltés: ez üríti a keret tárolt állapotát is.
      window.location.assign('/')
    })

  return (
    <button
      type="button"
      className={className}
      onClick={kilep}
      disabled={pending}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {children ?? <Icon name="logout" size={20} />}
    </button>
  )
}
