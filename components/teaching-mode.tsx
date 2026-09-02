'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Teaching Mode — bemutató teljes képernyőn.
 *
 * Oktatóteremben a kivetített kép más igényeket támaszt, mint az ágy melletti
 * használat: nagyobb betű, kevesebb kísérőelem, semmi navigáció. Ez a burkoló
 * bármely tartalmat képes így megjeleníteni, ezért nem kell külön „oktatói"
 * változatot írni a modulokhoz.
 *
 * A tényleges teljes képernyőt a böngésző adja. Ha a kérés elutasításra kerül —
 * például mert nem közvetlen felhasználói művelet indította —, a burkoló akkor
 * is működik: az oldalra kiterített nézet marad, csak a böngésző kerete látszik.
 */

export function TeachingMode({
  title, subtitle, children, label = 'Teljes képernyő',
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  label?: string
}) {
  const [aktiv, setAktiv] = useState(false)
  const [nagyitas, setNagyitas] = useState(1)
  // Csak akkor figyeljük a böngésző kilépését, ha valóban sikerült belépni.
  // Enélkül a sikertelen kérés utáni esemény azonnal bezárná a nézetet.
  const [bentVan, setBentVan] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aktiv) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setAktiv(false) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [aktiv])

  useEffect(() => {
    if (!bentVan) return
    const valtozas = () => {
      if (!document.fullscreenElement) { setBentVan(false); setAktiv(false) }
    }
    document.addEventListener('fullscreenchange', valtozas)
    return () => document.removeEventListener('fullscreenchange', valtozas)
  }, [bentVan])

  const indit = async () => {
    setAktiv(true)
    try {
      await ref.current?.requestFullscreen?.()
      // Csak sikeres belépés után kezdjük figyelni a kilépést.
      if (document.fullscreenElement) setBentVan(true)
    } catch {
      // A böngésző elutasíthatja — például beágyazott környezetben. A kiterített
      // nézet ettől még használható, csak a böngésző kerete marad látható.
    }
  }

  const kilep = async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen() } catch { /* nem baj */ }
    setBentVan(false)
    setAktiv(false)
  }

  return (
    <>
      <button className="btn ghost sm tm-btn" onClick={indit}>⛶ {label}</button>

      <div ref={ref} className={`tm ${aktiv ? 'on' : ''}`} style={{ fontSize: `${nagyitas}rem` }}>
        {aktiv && (
          <>
            <header className="tm-fej">
              <div>
                <b>{title}</b>
                {subtitle && <span>{subtitle}</span>}
              </div>
              <div className="tm-eszkoz">
                <button onClick={() => setNagyitas((z) => Math.max(0.8, z - 0.1))}
                  aria-label="Kisebb betű" title="Kisebb betű">A−</button>
                <button onClick={() => setNagyitas((z) => Math.min(1.8, z + 0.1))}
                  aria-label="Nagyobb betű" title="Nagyobb betű">A+</button>
                <button onClick={kilep} aria-label="Kilépés">✕ Kilépés</button>
              </div>
            </header>
            <div className="tm-tartalom">{children}</div>
            <p className="tm-lab">Kilépés: Escape billentyű</p>
          </>
        )}
      </div>
    </>
  )
}
