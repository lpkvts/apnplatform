'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface DiseaseRow {
  id: string; name: string; aliases: string[] | null; abbrev: string | null; specialty: string | null
}
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function DiseaseList({ items }: { items: DiseaseRow[] }) {
  const [q, setQ] = useState('')
  const nq = norm(q.trim())
  const list = items.filter((d) =>
    !nq || norm(`${d.name} ${(d.aliases ?? []).join(' ')} ${d.abbrev ?? ''} ${d.specialty ?? ''}`).includes(nq))

  const groups: Record<string, DiseaseRow[]> = {}
  for (const d of list) { const k = d.specialty || 'Egyéb'; (groups[k] ??= []).push(d) }

  return (
    <>
      <input className="field" placeholder="Keresés: betegség, szinonima, rövidítés, szakterület…" value={q} onChange={(e) => setQ(e.target.value)} />
      {list.length === 0 && <p className="sub">Nincs találat.</p>}
      {Object.keys(groups).map((spec) => (
        <div key={spec}>
          <div className="sec-h"><span className="sec-t">{spec}</span></div>
          {groups[spec].map((d) => (
            <Link key={d.id} className="sh-row" href={`/betegsegtar/${d.id}`}>
              <span className="sh-row-main">
                <span className="sh-row-name">{d.name}</span>
                {d.aliases && d.aliases.length > 0 && <span className="sh-row-sub">{d.aliases.slice(0, 3).join(' · ')}</span>}
              </span>
              <span className="sh-chev">›</span>
            </Link>
          ))}
        </div>
      ))}
    </>
  )
}
