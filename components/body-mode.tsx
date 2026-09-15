'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { modeForPath, bodyClassFor } from '@/lib/layout/mode'

/**
 * A megjelenítési mód követése kliensoldali navigációnál.
 *
 * A body osztályát a szerver állítja be az útvonal alapján, de a gyökér
 * elrendezés nem renderelődik újra minden navigációnál — ez a keretrendszer
 * szándékolt működése, mert így gyorsabb a lapváltás.
 *
 * A következménye viszont az, hogy a széles, adminisztratív elrendezés
 * ottragad, amikor a felhasználó a szerkesztői felületről kilép: mentés,
 * navigáció vagy frissítés után a platform teljes képernyőre húzva marad.
 *
 * Ez a komponens az aktuális útvonal alapján tartja karban az osztályt, így
 * a mód minden lapváltásnál követi a tényleges helyet. A nyitóoldal saját
 * keretét nem érinti — azt a szerver kezeli, mert ott a bejelentkezés
 * állapota is számít.
 */
export function BodyMode() {
  const path = usePathname()

  useEffect(() => {
    const body = document.body
    // A nyitóoldal és a nyilvános kapcsolat oldal kerete a bejelentkezés
    // állapotától is függ, amit itt nem ismerünk — azt a szerver állítja be,
    // és nem nyúlunk hozzá.
    if (body.classList.contains('is-landing')) return

    const kell = bodyClassFor(modeForPath(path ?? '/'))
    const modok = ['mode-workspace', 'mode-education', 'mode-teaching']

    for (const m of modok) {
      if (m !== kell) body.classList.remove(m)
    }
    if (kell && !body.classList.contains(kell)) {
      body.classList.add(kell)
    }
  }, [path])

  return null
}
