'use client'

import { useTransition } from 'react'
import { toggleFlag } from '@/app/cms/beallitasok/actions'

/**
 * Kapcsoló a Beállítások oldalon.
 *
 * A kapcsolás után teljes oldalbetöltéssel térünk vissza, nem a szokásos
 * kliensoldali navigációval. Ennek oka, hogy a kapcsolók a gyökér
 * elrendezést is befolyásolhatják — a keret, a megjelenítési mód és a
 * menük onnan származnak —, a böngésző pedig a gyökér elrendezést rövid
 * ideig megőrzi.
 *
 * Enélkül a felület a kapcsolás után a Beállítások oldal széles
 * elrendezésében ragadt, és a kikapcsolás sem állította vissza.
 */
export function FlagToggle({
  flagKey, enabled, label,
}: {
  flagKey: string
  enabled: boolean
  label?: string
}) {
  const [fut, start] = useTransition()

  const kapcsol = () =>
    start(async () => {
      const fd = new FormData()
      fd.set('key', flagKey)
      fd.set('enabled', enabled ? 'false' : 'true')
      try {
        await toggleFlag(fd)
      } catch {
        // A szerveroldali átirányítás kivételt dob — ez a várt működés.
      }
      // Teljes betöltés: ez üríti a keret tárolt állapotát is.
      window.location.reload()
    })

  return (
    <button
      type="button"
      className={`btn sm ${enabled ? '' : 'ghost'}`}
      onClick={kapcsol}
      disabled={fut}
      aria-pressed={enabled}
      aria-label={label ? `${label} ${enabled ? 'kikapcsolása' : 'bekapcsolása'}` : undefined}
    >
      {fut ? '…' : enabled ? 'Bekapcsolva ✓' : 'Kikapcsolva'}
    </button>
  )
}
