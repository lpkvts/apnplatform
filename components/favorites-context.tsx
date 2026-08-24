'use client'
import { createContext, useCallback, useContext, useState, useTransition, type ReactNode } from 'react'
import { toggleFavorite } from '@/lib/favorites'

interface FavCtx { has: (type: string, id: string) => boolean; toggle: (type: string, id: string) => void }
const Ctx = createContext<FavCtx | null>(null)

export function FavoritesProvider({ initial, children }: { initial: string[]; children: ReactNode }) {
  const [keys, setKeys] = useState<Set<string>>(() => new Set(initial))
  const [, start] = useTransition()
  const toggle = useCallback((type: string, id: string) => {
    const k = `${type}:${id}`
    setKeys((prev) => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n })
    start(() => { toggleFavorite(type, id) })
  }, [])
  const has = useCallback((type: string, id: string) => keys.has(`${type}:${id}`), [keys])
  return <Ctx.Provider value={{ has, toggle }}>{children}</Ctx.Provider>
}

export function useFavorites(): FavCtx {
  const c = useContext(Ctx)
  return c ?? { has: () => false, toggle: () => {} }
}

export function FavStar({ type, id }: { type: string; id: string }) {
  const { has, toggle } = useFavorites()
  const on = has(type, id)
  return (
    <span
      role="button"
      tabIndex={0}
      className={`fav-star ${on ? 'on' : ''}`}
      aria-label={on ? 'Kedvenc eltávolítása' : 'Kedvencekhez adás'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(type, id) }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggle(type, id) } }}
    >{on ? '★' : '☆'}</span>
  )
}
