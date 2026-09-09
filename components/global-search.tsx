'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TESTS } from '@/lib/scores/data'
import { LAB } from '@/lib/labor/data'
import { ECG } from '@/lib/ekg/data'
import { COMPETENCIES } from '@/lib/kompetencia/data'
import { CAT_LABEL } from '@/components/career'
import { CONTEXTS } from '@/lib/context/data'
import { COMPLAINTS } from '@/lib/clinical/complaints'
import { ACUTE } from '@/lib/clinical/acute'
import { topicForAcuteName } from '@/lib/topics/data'

interface Gl { id: string; title: string; summary: string | null; specialty: string[] | null }
interface CareerRow { id: string; title: string; category: string; tags: string[] | null; org: string | null }
interface Hit { id: string; title: string; sub?: string; href: string }
interface Group { key: string; label: string; hits: Hit[] }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const LIMIT = 8

interface DiseaseRow { id: string; name: string; aliases: string[] | null; abbrev: string | null; specialty: string | null }
export interface DrugRow {
  slug: string; name: string; name_intl: string | null
  atc: string | null; indications: string[] | null
}
export interface CountryRow {
  code: string; name: string; name_en: string | null
  flag: string | null; region: string
}

export function GlobalSearch({
  guidelines, career, diseases, drugs = [], countries = [], initialQuery = '',
}: {
  guidelines: Gl[]; career: CareerRow[]; diseases: DiseaseRow[]
  drugs?: DrugRow[]; countries?: CountryRow[]
  initialQuery?: string
}) {
  const [q, setQ] = useState(initialQuery)
  const nq = norm(q.trim())
  const groups: Group[] = []

  if (nq.length >= 2) {
    // Klinikai kontextus
    const ctxHits = CONTEXTS
      .filter((c) => norm(`${c.name} ${c.guidelineKw.join(' ')}`).includes(nq))
      .slice(0, LIMIT).map((c) => ({ id: c.id, title: c.name, sub: 'Klinikai kontextus', href: `/kontextus/${c.id}` }))
    if (ctxHits.length) groups.push({ key: 'ctx', label: '🧠 Klinikai kontextus', hits: ctxHits })

    // Panasz alapján
    const pa = COMPLAINTS
      .filter((c) => norm(`${c.name} ${c.conditions.map((x) => x.name).join(' ')}`).includes(nq))
      .slice(0, LIMIT).map((c) => ({ id: c.id, title: c.name, sub: `${c.conditions.length} lehetséges kórkép`, href: `/betegsegtar/panasz?p=${c.id}` }))
    if (pa.length) groups.push({ key: 'panasz', label: '🔍 Panasz alapján', hits: pa })

    // Betegségtár
    const dis = diseases
      .filter((d) => norm(`${d.name} ${(d.aliases ?? []).join(' ')} ${d.abbrev ?? ''} ${d.specialty ?? ''}`).includes(nq))
      .slice(0, LIMIT).map((d) => ({ id: d.id, title: d.name, sub: d.specialty ?? undefined, href: `/betegsegtar/${d.id}` }))
    if (dis.length) groups.push({ key: 'dis', label: '🩺 Betegségtár', hits: dis })

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

    // Akut állapotok
    const ac = ACUTE
      .filter((a) => norm(a).includes(nq))
      .slice(0, LIMIT).map((a) => { const tp = topicForAcuteName(a); return { id: a, title: a, sub: tp ? 'Részletes akut adatlap' : 'Akut állapotok', href: tp ? `/betegsegtar/akut/${tp.slug}` : '/betegsegtar/akut' } })
    if (ac.length) groups.push({ key: 'akut', label: '🚨 Akut állapotok', hits: ac })

    // Gyógyszertár — hatóanyagnévre, nemzetközi névre, ATC-kódra és
    // javallatra egyaránt keresünk, mert a gyakorlatban mindhárom irányból
    // indulunk el.
    const gy = drugs
      .filter((x) => norm(`${x.name} ${x.name_intl ?? ''} ${x.atc ?? ''} ${(x.indications ?? []).join(' ')}`).includes(nq))
      .slice(0, LIMIT).map((x) => ({
        id: x.slug, title: x.name,
        sub: [x.atc, (x.indications ?? [])[0]].filter(Boolean).join(' · '),
        href: `/gyogyszertar/${x.slug}`,
      }))
    if (gy.length) groups.push({ key: 'gyogyszer', label: '💊 Gyógyszertár', hits: gy })

    // Kompetenciatérkép
    const ko = COMPETENCIES
      .filter((k) => norm(`${k.text} ${k.group} ${k.sub ?? ''}`).includes(nq))
      .slice(0, LIMIT).map((k) => ({
        id: k.id,
        title: k.text.length > 76 ? `${k.text.slice(0, 74).trimEnd()}…` : k.text,
        sub: [k.group, k.sub].filter(Boolean).join(' · '),
        href: `/kompetenciaterkep?q=${encodeURIComponent(k.text.slice(0, 40))}`,
      }))
    if (ko.length) groups.push({ key: 'komp', label: '🎓 Kompetenciák', hits: ko })

    // APN World
    const aw = countries
      .filter((x) => norm(`${x.name} ${x.name_en ?? ''}`).includes(nq))
      .slice(0, LIMIT).map((x) => ({
        id: x.code, title: `${x.flag ?? ''} ${x.name}`.trim(), sub: 'APN World',
        href: `/apn-world/${x.code.toLowerCase()}`,
      }))
    if (aw.length) groups.push({ key: 'apnworld', label: '🌍 APN World', hits: aw })

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
        <p className="sub">Írj be legalább 2 karaktert. Egy keresés — több tartalomtípus: panasz, kórkép, labor, score, EKG, akut állapot, protokoll/evidence és klinikai kontextus.</p>
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
