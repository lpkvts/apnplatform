'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { EXAM_SYSTEMS, EXAM_ELEMENTS } from '@/lib/vizsgalat/checklist'

export function ExamSearch() {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (query.length < 2) return []
    return EXAM_ELEMENTS.filter((e) => {
      const hay = `${e.title} ${e.short} ${e.kw ?? ''}`.toLowerCase()
      return hay.includes(query)
    }).slice(0, 20)
  }, [query])

  const sysName = (id: string) => EXAM_SYSTEMS.find((s) => s.id === id)?.name ?? ''
  const sysIcon = (id: string) => EXAM_SYSTEMS.find((s) => s.id === id)?.icon ?? ''

  return (
    <div style={{ marginBottom: 12 }}>
      <input
        className="field"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Keresés vizsgálati elemre (pl. pupilla, ödéma, pulzus, reflex, ascites)…"
        aria-label="Keresés a vizsgálatok között"
      />
      {query.length >= 2 && (
        <div style={{ marginTop: 6 }}>
          {results.length === 0 ? (
            <div className="sub" style={{ padding: '6px 2px' }}>Nincs találat erre: „{q}"</div>
          ) : (
            results.map((e) => (
              <Link key={e.id} className="sh-row" href={`/klinika/vizsgalat/elem/${e.id}`}>
                <span className="sh-row-main">
                  <span className="sh-row-name">{e.title}</span>
                  <span className="sh-row-sub">{sysIcon(e.sys)} {sysName(e.sys)}</span>
                </span>
                <span className="sh-chev">›</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
