'use client'

import { useEffect } from 'react'

/**
 * Értesítésszám az alkalmazás ikonján.
 *
 * Telepített alkalmazásban a rendszer megjeleníti a számot az ikonon —
 * ugyanúgy, ahogy a levelező vagy az üzenetküldő alkalmazásoknál. Így a
 * felhasználó a kezdőképernyőn látja, hogy van újdonság, anélkül hogy
 * megnyitná a platformot.
 *
 * Böngészőben nem működik, csak telepített állapotban. A támogatás hiánya
 * nem hiba, ezért a sikertelen hívást elnyeljük.
 */
export function AppBadge({ count }: { count: number }) {
  useEffect(() => {
    const nav = navigator as Navigator & {
      setAppBadge?: (n?: number) => Promise<void>
      clearAppBadge?: () => Promise<void>
    }
    if (!nav.setAppBadge) return

    if (count > 0) {
      nav.setAppBadge(count).catch(() => {})
    } else {
      nav.clearAppBadge?.().catch(() => {})
    }
  }, [count])

  return null
}
