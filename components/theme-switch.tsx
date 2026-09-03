'use client'

import { useEffect, useState } from 'react'
import { THEME_KEY, THEME_LABEL, THEME_HINT, resolveTheme, type ThemeMode } from '@/lib/theme'

/**
 * Témaválasztó.
 *
 * A választás a készüléken marad, nem a fiókban: ugyanaz a felhasználó
 * másképp állítja be a telefonján és az osztályos gépen. Az éjszakai
 * műszakban használt telefon más beállítást kíván, mint a nappali gép.
 */
export function ThemeSwitch() {
  const [mode, setMode] = useState<ThemeMode>('system')
  const [betoltve, setBetoltve] = useState(false)

  useEffect(() => {
    const mentett = localStorage.getItem(THEME_KEY) as ThemeMode | null
    if (mentett) setMode(mentett)
    setBetoltve(true)
  }, [])

  const valt = (uj: ThemeMode) => {
    setMode(uj)
    localStorage.setItem(THEME_KEY, uj)
    const sotetRendszer = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.dataset.theme = resolveTheme(uj, sotetRendszer)
  }

  // A napszak szerinti mód óránként ellenőrzi, hogy váltani kell-e. Enélkül
  // a nyitva hagyott oldal este nyolckor nem váltana át magától.
  useEffect(() => {
    if (mode !== 'auto') return
    const id = setInterval(() => {
      document.documentElement.dataset.theme = resolveTheme('auto', false)
    }, 60_000)
    return () => clearInterval(id)
  }, [mode])

  // A rendszer szerinti módban követjük a készülék beállításának változását.
  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const kezel = (e: MediaQueryListEvent) => {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light'
    }
    mq.addEventListener('change', kezel)
    return () => mq.removeEventListener('change', kezel)
  }, [mode])

  if (!betoltve) return null

  return (
    <div className="card">
      <b style={{ fontSize: 'var(--t-h3)' }}>Megjelenés</b>
      <p className="sub" style={{ margin: '4px 0 12px' }}>
        A beállítás ezen a készüléken érvényes.
      </p>

      <div className="sh-chips">
        {(Object.keys(THEME_LABEL) as ThemeMode[]).map((m) => (
          <button key={m} className={`sh-chip ${mode === m ? 'on' : ''}`} onClick={() => valt(m)}>
            {THEME_LABEL[m]}
          </button>
        ))}
      </div>

      <p className="sub" style={{ margin: '10px 0 0', fontSize: 'var(--t-caption)' }}>
        {THEME_HINT[mode]}
      </p>
    </div>
  )
}
