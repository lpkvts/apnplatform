'use client'

import { useEffect, useState } from 'react'

/**
 * Visszaugrás a lap tetejére.
 *
 * Csak akkor jelenik meg, ha van hova visszagörgetni — jellemzően másfél
 * képernyőnyi görgetés után. Enélkül a rövid oldalakon fölöslegesen
 * takarna el tartalmat.
 *
 * A gomb az alsó navigáció fölött helyezkedik el, a jobb szélen: ott nem
 * ütközik a hüvelykujj szokásos útjával, de elérhető marad.
 */
export function LapTetejere() {
  const [lathato, setLathato] = useState(false)

  useEffect(() => {
    // A görgetésfigyelés passzív: nem blokkolja a görgetést, ezért nem
    // okoz akadozást.
    const figyel = () => setLathato(window.scrollY > window.innerHeight * 1.5)
    figyel()
    window.addEventListener('scroll', figyel, { passive: true })
    return () => window.removeEventListener('scroll', figyel)
  }, [])

  if (!lathato) return null

  return (
    <button
      className="lap-fel"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Vissza a lap tetejére"
      title="Vissza a lap tetejére"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}
