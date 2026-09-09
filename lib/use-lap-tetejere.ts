'use client'

import { useEffect, useRef } from 'react'

/**
 * Görgetési pozíció kezelése lista és részletnézet között.
 *
 * A modulokban a részletnézet ugyanazon az oldalon nyílik meg, mint a
 * lista. A böngésző megőrzi a görgetési pozíciót, ezért a felhasználó a
 * részlet közepén találja magát — pont ott, ahol a listaelem volt, amire
 * kattintott.
 *
 * A megoldás két irányban eltér:
 *
 *   Részlet megnyitásakor a lap tetejére ugrunk, mert az új tartalom
 *   elejéről kell olvasni.
 *
 *   Visszalépéskor visszaállítjuk a lista korábbi pozícióját. Aki a
 *   hatvanadik laborparamétert nyitotta meg, ne a lista tetején találja
 *   magát, amikor visszalép.
 *
 * @param nyitott  a megnyitott elem azonosítója, vagy null a listában
 */
export function useLapTetejere(nyitott: unknown) {
  const listaPozicio = useRef(0)
  const elozo = useRef(nyitott)
  /**
   * Zárolás a visszaállítás idejére.
   *
   * Visszatéréskor a lap magassága megnő, ami görgetési eseményt vált ki.
   * Zárolás nélkül a figyelő ilyenkor nullára írná a mentett pozíciót,
   * mielőtt visszaállítanánk — pontosan azt veszítenénk el, amit meg
   * akarunk őrizni.
   */
  const zarolt = useRef(false)

  // A lista görgetését folyamatosan követjük: a váltás pillanatában már
  // késő lenne kiolvasni, mert a nézet cseréje után az érték nulla.
  useEffect(() => {
    if (nyitott) return
    const figyel = () => {
      if (!zarolt.current) listaPozicio.current = window.scrollY
    }
    window.addEventListener('scroll', figyel, { passive: true })
    return () => window.removeEventListener('scroll', figyel)
  }, [nyitott])

  useEffect(() => {
    const most = nyitott
    const volt = elozo.current
    elozo.current = most

    // Első megjelenítéskor nem nyúlunk a görgetéshez.
    if (volt === most) return

    if (most) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    // Vissza a listába. A böngészőnek két képkockányi időt hagyunk a lista
    // felépítésére: az elsőben a magasság áll be, a másodikban görgetünk.
    zarolt.current = true
    const cel = listaPozicio.current
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: cel, behavior: 'auto' })
        // A zárolást a görgetés utáni képkockában oldjuk fel, hogy az
        // általunk kiváltott esemény se írja felül a mentett értéket.
        requestAnimationFrame(() => { zarolt.current = false })
      })
    })
  }, [nyitott])
}
