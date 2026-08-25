'use client'
import Link from 'next/link'
import { resolveDisease, type DzLite } from '@/lib/disease/resolve'

export function RelatedDiseases({ names, lookup, showAkut = false, title = 'Kapcsolódó kórképek' }: { names?: string[]; lookup?: DzLite[]; showAkut?: boolean; title?: string }) {
  if (!names || names.length === 0) return null
  const dz = lookup ?? []
  return (
    <div className="card">
      <b>🩺 {title}</b>
      <div style={{ marginTop: 8 }}>
        {names.map((name) => {
          const m = resolveDisease(name, dz)
          if (m) {
            return (
              <Link key={name} className="sh-row" href={`/betegsegtar/${m.id}`}>
                <span className="sh-row-main">
                  <span className="sh-row-name">🩺 {name}</span>
                  <span className="sh-row-sub">{m.is_stub ? '⚪ Tartalom feltöltés alatt' : 'Kidolgozott adatlap'}</span>
                </span>
                <span className="sh-chev">›</span>
              </Link>
            )
          }
          return (
            <Link key={name} className="sh-row" href="/betegsegtar">
              <span className="sh-row-main">
                <span className="sh-row-name">🩺 {name}</span>
                <span className="sh-row-sub">⏳ Hamarosan a Betegségtárban</span>
              </span>
              <span className="sh-chev">›</span>
            </Link>
          )
        })}
      </div>
      {showAkut && <a className="btn ghost sm" href="/betegsegtar/akut" style={{ marginTop: 8 }}>🚨 Akut állapotok</a>}
    </div>
  )
}
