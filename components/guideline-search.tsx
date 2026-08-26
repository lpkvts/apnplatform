'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { checkQuery, registryFor, type GuidelineSource } from '@/lib/sources/data'

export interface GuideRow { id: string; title: string; specialty: string[] | null; summary: string | null }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

type Kind = 'source' | 'guide'
type SortKey = 'relevancia' | 'ev' | 'cim'

interface Item {
  key: string
  kind: Kind
  title: string
  category: string
  year: number | null
  yearLabel: string
  haystack: string
  source?: GuidelineSource
  guide?: GuideRow
}

function yearOf(raw: string): number | null {
  const m = raw.match(/\d{4}/)
  return m ? parseInt(m[0], 10) : null
}

function buildItems(sources: GuidelineSource[], guides: GuideRow[]): Item[] {
  const a: Item[] = sources.map((s) => ({
    key: `s:${s.id}`,
    kind: 'source' as const,
    title: s.title,
    category: s.category,
    year: yearOf(s.year),
    yearLabel: s.year,
    haystack: norm([s.title, s.org, s.identifier ?? '', s.category, (s.usedIn ?? []).join(' '), s.versionNote ?? ''].join(' ')),
    source: s,
  }))
  const b: Item[] = guides.map((g) => ({
    key: `g:${g.id}`,
    kind: 'guide' as const,
    title: g.title,
    category: (g.specialty && g.specialty[0]) || 'Egyéb',
    year: null,
    yearLabel: '',
    haystack: norm([g.title, g.summary ?? '', (g.specialty ?? []).join(' ')].join(' ')),
    guide: g,
  }))
  return [...a, ...b]
}

function score(it: Item, nq: string): number {
  if (!nq) return 0
  let sc = 0
  const s = it.source
  if (s?.identifier && norm(s.identifier).includes(nq)) sc += 50
  if (norm(it.title).startsWith(nq)) sc += 20
  if (norm(it.title).includes(nq)) sc += 12
  if (s && norm(s.org).includes(nq)) sc += 6
  if (s && (s.usedIn ?? []).some((u) => norm(u).includes(nq))) sc += 6
  if (norm(it.category).includes(nq)) sc += 4
  if (it.haystack.includes(nq)) sc += 2
  if (s?.primary) sc += 2
  if (it.year) sc += Math.max(0, it.year - 2015) * 0.3 // frissebb előrébb
  return sc
}

/* ---------- Verzió-ellenőrző panel ---------- */
function VersionCheck({ s }: { s: GuidelineSource }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const reg = registryFor(s)
  const q = checkQuery(s)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(q)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      <button className="btn ghost sm" onClick={() => setOpen((v) => !v)} style={{ marginTop: 8 }}>
        {open ? 'Verzió-ellenőrzés elrejtése' : '🔄 Verzió ellenőrzése'}
      </button>
      {open && (
        <div className="card" style={{ marginTop: 8, background: 'var(--bg-2, transparent)' }}>
          <div className="sub" style={{ margin: 0, fontSize: 12 }}>
            A platform nem tudja automatikusan megállapítani, mi a legfrissebb kiadás — ezt a hivatalos
            regiszterben kell ellenőrizni. Az alábbi kifejezéssel keress rá:
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
            <code style={{ fontSize: 13, padding: '4px 8px', borderRadius: 6, background: 'rgba(127,127,127,.14)', wordBreak: 'break-word' }}>{q}</code>
            <button className="btn ghost sm" onClick={copy}>{copied ? '✓ Másolva' : 'Másolás'}</button>
          </div>
          {reg ? (
            <div style={{ marginTop: 10 }}>
              <a className="btn ghost sm" href={reg.url} target="_blank" rel="noopener">{reg.label} megnyitása</a>
              <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>{reg.note}</div>
            </div>
          ) : (
            <div className="sub" style={{ marginTop: 10, fontSize: 12 }}>
              Ehhez a kiadóhoz nincs rögzített regiszter-hivatkozás. Ha megvan a kiadó hivatalos
              irányelv-gyűjtőoldala, vedd fel a forrás <code>registryUrl</code> mezőjébe.
            </div>
          )}
          <div className="sub" style={{ marginTop: 10, fontSize: 12 }}>
            Ellenőrzés után frissítsd a <code>lastChecked</code> és <code>reviewNext</code> dátumot a
            forrás-regiszterben. Ha újabb kiadás jelent meg, a régi tételnél töltsd ki a <code>supersededBy</code> mezőt.
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- Forrás kártya ---------- */
function SourceCard({ s, today }: { s: GuidelineSource; today: string }) {
  const due = s.reviewNext ? s.reviewNext <= today : false
  return (
    <div className="card" style={{ marginBottom: 8 }}>
      <b style={{ fontSize: 15 }}>{s.title}</b>
      <div className="sub" style={{ marginTop: 4 }}>
        {[s.org, s.year, s.identifier ? `azonosító: ${s.identifier}` : null, s.intl ? 'nemzetközi' : 'magyar', s.primary ? 'elsődleges' : 'kiegészítő', s.status].filter(Boolean).join(' · ')}
      </div>
      {s.versionNote && <div className="sub" style={{ marginTop: 4, fontSize: 12 }}>{s.versionNote}</div>}
      <div className="sub" style={{ marginTop: 4, fontSize: 12 }}>
        {s.lastChecked && <>Utolsó ellenőrzés: {s.lastChecked}</>}
        {s.reviewNext && <> · Következő felülvizsgálat: {s.reviewNext}</>}
      </div>
      {s.supersededBy && (
        <div className="safety-note" style={{ marginTop: 6 }}>
          ⚠️ Újabb kiadás váltotta fel: <b>{s.supersededBy}</b>
        </div>
      )}
      {due && <div className="safety-note" style={{ marginTop: 6, borderLeftColor: '#C0392B' }}>🔴 Felülvizsgálat esedékes.</div>}
      {s.usedIn && s.usedIn.length > 0 && <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>Hivatkozza: {s.usedIn.join(', ')}</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {s.url && <a className="btn ghost sm" href={s.url} target="_blank" rel="noopener" style={{ marginTop: 8 }}>Forrás megnyitása</a>}
        <VersionCheck s={s} />
      </div>
    </div>
  )
}

function GuideRowLink({ g }: { g: GuideRow }) {
  return (
    <Link className="sh-row" href={`/klinika/tudastar/${g.id}`}>
      <span className="sh-row-main">
        <span className="sh-row-name">{g.title}</span>
        {g.summary && <span className="sh-row-sub">{g.summary}</span>}
      </span>
      <span className="sh-chev">›</span>
    </Link>
  )
}

/* ---------- Fő komponens ---------- */
export function GuidelineSearch({ sources, guides, today, initialQuery = '' }: { sources: GuidelineSource[]; guides: GuideRow[]; today: string; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery)
  const [cat, setCat] = useState('')
  const [origin, setOrigin] = useState<'' | 'hu' | 'intl'>('')
  const [onlyPrimary, setOnlyPrimary] = useState(false)
  const [onlyDue, setOnlyDue] = useState(false)
  const [sort, setSort] = useState<SortKey>('relevancia')

  const items = useMemo(() => buildItems(sources, guides), [sources, guides])
  const cats = useMemo(() => [...new Set(items.map((i) => i.category))].sort((a, b) => a.localeCompare(b, 'hu')), [items])

  const nq = norm(q.trim())
  const filtersOn = !!(nq || cat || origin || onlyPrimary || onlyDue)

  const results = useMemo(() => {
    let out = items.filter((it) => {
      if (cat && it.category !== cat) return false
      if (origin === 'hu' && !(it.kind === 'source' && !it.source!.intl)) return false
      if (origin === 'intl' && !(it.kind === 'source' && it.source!.intl)) return false
      if (onlyPrimary && !(it.kind === 'source' && it.source!.primary)) return false
      if (onlyDue) {
        const rn = it.source?.reviewNext
        if (!rn || rn > today) return false
      }
      if (nq && !it.haystack.includes(nq)) return false
      return true
    })
    if (sort === 'cim') out = out.sort((a, b) => a.title.localeCompare(b.title, 'hu'))
    else if (sort === 'ev') out = out.sort((a, b) => (b.year ?? -1) - (a.year ?? -1) || a.title.localeCompare(b.title, 'hu'))
    else out = out.sort((a, b) => score(b, nq) - score(a, nq) || (b.year ?? -1) - (a.year ?? -1) || a.title.localeCompare(b.title, 'hu'))
    return out
  }, [items, nq, cat, origin, onlyPrimary, onlyDue, sort, today])

  const dueCount = items.filter((i) => i.source?.reviewNext && i.source.reviewNext <= today).length

  // Alapnézet: kategória-akkordeon (a korábbi elrendezés)
  const byCat = useMemo(() => {
    const m: Record<string, Item[]> = {}
    for (const it of items) (m[it.category] ??= []).push(it)
    return Object.entries(m).sort((a, b) => a[0].localeCompare(b[0], 'hu'))
  }, [items])

  const reset = () => { setQ(''); setCat(''); setOrigin(''); setOnlyPrimary(false); setOnlyDue(false) }

  return (
    <>
      <input
        className="field"
        placeholder="Keresés cím, kiadó, azonosító (pl. 002272-2025) vagy témakör szerint…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="sh-chips">
        <button className={`sh-chip ${origin === 'hu' ? 'on' : ''}`} onClick={() => setOrigin((v) => (v === 'hu' ? '' : 'hu'))}>Magyar</button>
        <button className={`sh-chip ${origin === 'intl' ? 'on' : ''}`} onClick={() => setOrigin((v) => (v === 'intl' ? '' : 'intl'))}>Nemzetközi</button>
        <button className={`sh-chip ${onlyPrimary ? 'on' : ''}`} onClick={() => setOnlyPrimary((v) => !v)}>Elsődleges</button>
        <button className={`sh-chip ${onlyDue ? 'on' : ''}`} onClick={() => setOnlyDue((v) => !v)}>
          Felülvizsgálat esedékes{dueCount > 0 ? ` (${dueCount})` : ''}
        </button>
        {filtersOn && <button className="sh-chip" onClick={reset}>✕ Szűrők törlése</button>}
      </div>

      <div className="sh-chips" style={{ marginTop: 0 }}>
        <select className="field" style={{ maxWidth: 220, marginBottom: 0 }} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Minden kategória</option>
          {cats.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="field" style={{ maxWidth: 200, marginBottom: 0 }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="relevancia">Relevancia szerint</option>
          <option value="ev">Legfrissebb elöl</option>
          <option value="cim">Cím szerint</option>
        </select>
      </div>

      {filtersOn ? (
        <>
          <div className="sub" style={{ marginTop: 12 }}>{results.length} találat.</div>
          {results.length === 0 && (
            <div className="card">
              <p style={{ margin: 0 }}>Nincs találat. Próbáld meg tágabb kifejezéssel, vagy töröld a szűrőket.</p>
            </div>
          )}
          {results.map((it) =>
            it.kind === 'source'
              ? <SourceCard key={it.key} s={it.source!} today={today} />
              : <GuideRowLink key={it.key} g={it.guide!} />,
          )}
        </>
      ) : (
        <>
          {byCat.length === 0 && <div className="card"><p style={{ margin: 0 }}>Nincs elérhető tartalom.</p></div>}
          {byCat.map(([c, list]) => (
            <details key={c} className="kt-acc">
              <summary className="kt-sum">
                <span>{c}</span>
                <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13, marginLeft: 'auto', marginRight: 8 }}>{list.length} tétel</span>
              </summary>
              <div className="kt-body">
                {list.filter((i) => i.kind === 'source').map((i) => <SourceCard key={i.key} s={i.source!} today={today} />)}
                {list.filter((i) => i.kind === 'guide').map((i) => <GuideRowLink key={i.key} g={i.guide!} />)}
              </div>
            </details>
          ))}
        </>
      )}
    </>
  )
}
