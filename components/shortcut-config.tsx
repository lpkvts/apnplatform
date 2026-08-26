'use client'
import { useFavorites } from '@/components/favorites-context'
import { SHORTCUTS, accentStyle } from '@/lib/shortcuts'
import { Icon } from '@/components/icons'

export function ShortcutConfig() {
  const { has, toggle } = useFavorites()
  return (
    <>
      {SHORTCUTS.map((s) => {
        const on = has('menu', s.key)
        return (
          <div className="sh-row" key={s.key} style={{ cursor: 'default' }}>
            <span className="qtile-i" style={{ width: 38, height: 38, ...accentStyle(s.href) }}><Icon name={s.icon} size={20} /></span>
            <span className="sh-row-main"><span className="sh-row-name">{s.label}</span></span>
            <button type="button" className={`btn sm ${on ? '' : 'ghost'}`} onClick={() => toggle('menu', s.key)}>
              {on ? 'Kezdőlapon ✓' : '+ Kezdőlapra'}
            </button>
          </div>
        )
      })}
    </>
  )
}
