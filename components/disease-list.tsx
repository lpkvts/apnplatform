'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FavStar } from '@/components/favorites-context'

export interface DiseaseRow {
  id: string; name: string; aliases: string[] | null; abbrev: string | null; specialty: string | null
  is_stub?: boolean; bno?: string | null
}
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function DiseaseList({ items }: { items: DiseaseRow[] }) {
  const [q, setQ] = useState('')
  const [onlyFull, setOnlyFull] = useState(false)
  const nq = norm(q.trim())
  const list = items.filter((d) =>
    (!onlyFull || !d.is_stub) &&
    (!nq || norm(`${d.name} ${(d.aliases ?? []).join(' ')} ${d.abbrev ?? ''} ${d.specialty ?? ''} ${d.bno ?? ''}`).includes(nq)))

  const fullCount = items.filter((d) => !d.is_stub).length
  const stubCount = items.length - fullCount

  // Szakterületenkénti teljes darabszám (a fel nem töltötteket is beleértve) — a teljes listából
  const specTotals: Record<string, { total: number; full: number }> = {}
  for (const d of items) { const k = d.specialty || 'Egyéb'; const t = (specTotals[k] ??= { total: 0, full: 0 }); t.total++; if (!d.is_stub) t.full++ }

  const groups: Record<string, DiseaseRow[]> = {}
  for (const d of list) { const k = d.specialty || 'Egyéb'; (groups[k] ??= []).push(d) }
  const specs = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'hu'))

  return (
    <>
      <input className="field" placeholder="Keresés: betegség, szinonima, rövidítés, BNO, szakterület…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="sh-chips" style={{ marginBottom: 4 }}>
        <button className={`sh-chip ${!onlyFull ? 'on' : ''}`} onClick={() => setOnlyFull(false)}>Összes ({items.length})</button>
        <button className={`sh-chip ${onlyFull ? 'on' : ''}`} onClick={() => setOnlyFull(true)}>Kidolgozott ({fullCount})</button>
        {stubCount > 0 && <span className="sh-chip" style={{ pointerEvents: 'none', opacity: 0.7 }}>⚪ Fejlesztés alatt: {stubCount}</span>}
      </div>
      {list.length === 0 && <p className="sub">Nincs találat.</p>}
      {specs.map((spec) => (
        <div key={spec}>
          <div className="sec-h">
            <span className="sec-t">{spec}</span>
            <span className="sec-l" style={{ pointerEvents: 'none', color: 'var(--muted)', fontWeight: 600 }}>
              {specTotals[spec].total} kórkép{specTotals[spec].full < specTotals[spec].total ? ` · ${specTotals[spec].full} kidolgozott` : ''}
            </span>
          </div>
          {groups[spec].map((d) => (
            <Link key={d.id} className="sh-row" href={`/betegsegtar/${d.id}`}>
              <span className="sh-row-main">
                <span className="sh-row-name">{d.name}{d.abbrev ? ` (${d.abbrev})` : ''}</span>
                <span className="sh-row-sub">{d.is_stub ? '⚪ Tartalom fejlesztés alatt' : (d.aliases && d.aliases.length > 0 ? d.aliases.slice(0, 3).join(' · ') : 'Kidolgozott adatlap')}{d.bno ? ` · BNO ${d.bno}` : ''}</span>
              </span>
              <FavStar type="disease" id={d.id} />
              <span className="sh-chev">›</span>
            </Link>
          ))}
        </div>
      ))}
    </>
  )
}
