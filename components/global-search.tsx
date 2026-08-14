'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TESTS } from '@/lib/scores/data'
import { LAB } from '@/lib/labor/data'
import { ECG } from '@/lib/ekg/data'
import { CAT_LABEL } from '@/components/career'
import { CONTEXTS } from '@/lib/context/data'

interface Gl { id: string; title: string; summary: string | null; specialty: string[] | null }
interface CareerRow { id: string; title: string; category: string; tags: string[] | null; org: string | null }
interface Hit { id: string; title: string; sub?: string; href: string }
interface Group { key: string; label: string; hits: Hit[] }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const LIMIT = 8

export function GlobalSearch({ guidelines, career }: { guidelines: Gl[]; career: CareerRow[] }) {
  const [q, setQ] = useState('')
  const nq = norm(q.trim())
  const groups: Group[] = []

  if (nq.length >= 2) {
    // Klinikai kontextus
    const ctxHits = CONTEXTS
      .filter((c) => norm(`${c.name} ${c.guidelineKw.join(' ')}`).includes(nq))
      .slice(0, LIMIT).map((c) => ({ id: c.id, title: c.name, sub: 'Klinikai kontextus', href: `/kontextus/${c.id}` }))
    if (ctxHits.length) groups.push({ key: 'ctx', label: '🧠 Klinikai kontextus', hits: ctxHits })

    // Tudástár
    const kb = guidelines
      .filter((g) => norm(`${g.title} ${g.summary ?? ''} ${(g.specialty ?? []).join(' ')}`).includes(nq))
      .slice(0, LIMIT).map((g) => ({ id: g.id, title: g.title, sub: (g.specialty ?? []).join(' · '), href: `/klinika/tudastar/${g.id}` }))
    if (kb.length) groups.push({ key: 'kb', label: '📚 Tudástár', hits: kb })

    // Eszközök (Score Hub)
    const sc = TESTS
      .filter((t) => norm(`${t.name} ${t.abbr ?? ''} ${t.kw ?? ''} ${t.specialty ?? ''}`).includes(nq))
      .slice(0, LIMIT).map((t) => ({ id: t.id, title: t.name, sub: t.abbr, href: `/klinika/tesztek?open=${t.id}` }))
    if (sc.length) groups.push({ key: 'score', label: '🧮 Eszközök (Score)', hits: sc })

    // Labor
    const lb = LAB
      .filter((l) => norm(`${l.name} ${l.abbr} ${l.kw ?? ''} ${l.organ ?? ''}`).includes(nq))
      .slice(0, LIMIT).map((l) => ({ id: l.id, title: `${l.name} (${l.abbr})`, sub: `${l.ref}${l.unit ? ` ${l.unit}` : ''}`, href: `/klinika/labor?open=${l.id}` }))
    if (lb.length) groups.push({ key: 'labor', label: '🧪 Labor', hits: lb })

    // EKG
    const ek = ECG
      .filter((e) => norm(`${e.name} ${e.kw ?? ''} ${e.cat}`).includes(nq))
      .slice(0, LIMIT).map((e) => ({ id: e.id, title: e.name, sub: e.cat, href: `/klinika/ekg?open=${e.id}` }))
    if (ek.length) groups.push({ key: 'ekg', label: '📈 EKG', hits: ek })

    // Career
    const ca = career
      .filter((c) => norm(`${c.title} ${c.org ?? ''} ${(c.tags ?? []).join(' ')}`).includes(nq))
      .slice(0, LIMIT).map((c) => ({ id: c.id, title: c.title, sub: CAT_LABEL[c.category], href: `/career/${c.id}` }))
    if (ca.length) groups.push({ key: 'career', label: '💼 Career', hits: ca })
  }

  const total = groups.reduce((s, g) => s + g.hits.length, 0)

  return (
    <>
      <input className="field" autoFocus placeholder="Keress: COPD, NEWS2, kálium, pitvarfibrilláció…"
        value={q} onChange={(e) => setQ(e.target.value)} />

      {nq.length < 2 && (
        <p className="sub">Írj be legalább 2 karaktert. A kereső egyszerre néz a Tudástárban, az eszközökben (score-ok), a laborban, az EKG-ban és a Career-ben.</p>
      )}

      {nq.length >= 2 && total === 0 && (
        <div className="card"><p style={{ margin: 0 }}>Nincs találat a(z) „{q}" kifejezésre.</p></div>
      )}

      {groups.map((g) => (
        <div key={g.key}>
          <div className="sec-h"><span className="sec-t">{g.label}</span><span className="sub" style={{ margin: 0 }}>{g.hits.length} találat</span></div>
          {g.hits.map((h) => (
            <Link key={`${g.key}-${h.id}`} className="sh-row" href={h.href}>
              <span className="sh-row-main">
                <span className="sh-row-name">{h.title}</span>
                {h.sub && <span className="sh-row-sub">{h.sub}</span>}
              </span>
              <span className="sh-chev">›</span>
            </Link>
          ))}
        </div>
      ))}
    </>
  )
}
