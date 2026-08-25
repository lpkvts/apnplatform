import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CONTEXTS } from '@/lib/context/data'
import { TESTS } from '@/lib/scores/data'
import { LAB } from '@/lib/labor/data'
import { ECG } from '@/lib/ekg/data'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function resolveContextId(contextId?: string | null, keywords?: string[]): string | null {
  if (contextId && CONTEXTS.some((c) => c.id === contextId)) return contextId
  const hay = norm((keywords ?? []).join(' '))
  if (hay.trim().length < 2) return null
  for (const c of CONTEXTS) {
    const terms = [c.id, ...norm(c.name).split(/\s+/), ...c.guidelineKw.map(norm)]
    if (terms.some((t) => t.length >= 3 && hay.includes(t))) return c.id
  }
  return null
}

function Row({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (
    <Link className="sh-row" href={href} style={{ marginBottom: 6 }}>
      <span className="sh-row-main"><span className="sh-row-name">{title}</span>{sub && <span className="sh-row-sub">{sub}</span>}</span>
      <span className="sh-chev">›</span>
    </Link>
  )
}

// Egységes, kontextusfüggő, opcionálisan lenyitható "kapcsolódó klinikai tartalmak" blokk.
export async function ClinicalContext({ contextId, keywords, defaultOpen = false }: {
  contextId?: string | null; keywords?: string[]; defaultOpen?: boolean
}) {
  const cid = resolveContextId(contextId, keywords)
  if (!cid) return null
  const ctx = CONTEXTS.find((c) => c.id === cid)!

  const scores = TESTS.filter((t) => ctx.scoreIds.includes(t.id)).slice(0, 6)
  const labs = LAB.filter((l) => ctx.labIds.includes(l.id)).slice(0, 6)
  const ekgs = ECG.filter((e) => ctx.ekgIds.includes(e.id)).slice(0, 6)

  const supabase = await createClient()
  const [gRes, dRes] = await Promise.all([
    supabase.from('guidelines').select('id, title, summary').eq('status', 'published').returns<{ id: string; title: string; summary: string | null }[]>(),
    supabase.from('diseases').select('id, name').eq('status', 'published').eq('context_id', ctx.id).returns<{ id: string; name: string }[]>(),
  ])
  const guides = (gRes.data ?? []).filter((g) => {
    const t = norm(`${g.title} ${g.summary ?? ''}`)
    return ctx.guidelineKw.some((k) => t.includes(norm(k)))
  }).slice(0, 5)
  const diseases = (dRes.data ?? []).slice(0, 6)

  const total = diseases.length + scores.length + labs.length + ekgs.length + guides.length
  if (total === 0) return null

  return (
    <details className="cc" {...(defaultOpen ? { open: true } : {})}>
      <summary>🔗 Kapcsolódó klinikai tartalmak — {ctx.name} ({total})</summary>
      <div className="cc-body">
        <p className="sub" style={{ margin: '0 0 8px' }}>Kontextusfüggő kapcsolódások — navigációs/oktatási segítség, nem diagnózis.</p>
        {diseases.length > 0 && <><div className="cc-h">🩺 Betegségek</div>{diseases.map((d) => <Row key={d.id} href={`/betegsegtar/${d.id}`} title={d.name} />)}</>}
        {scores.length > 0 && <><div className="cc-h">🧮 Score-ok</div>{scores.map((t) => <Row key={t.id} href={`/klinika/tesztek?open=${t.id}`} title={t.name} sub={t.abbr} />)}</>}
        {labs.length > 0 && <><div className="cc-h">🧪 Laborok</div>{labs.map((l) => <Row key={l.id} href={`/klinika/labor?open=${l.id}`} title={`${l.name} (${l.abbr})`} sub={`${l.ref}${l.unit ? ` ${l.unit}` : ''}`} />)}</>}
        {ekgs.length > 0 && <><div className="cc-h">📈 EKG</div>{ekgs.map((e) => <Row key={e.id} href={`/klinika/ekg?open=${e.id}`} title={e.name} sub={e.cat} />)}</>}
        {guides.length > 0 && <><div className="cc-h">📚 Irányelvek</div>{guides.map((g) => <Row key={g.id} href={`/klinika/tudastar/${g.id}`} title={g.title} />)}</>}
        <Link className="btn ghost sm" href={`/kontextus/${ctx.id}`} style={{ marginTop: 6 }}>Teljes klinikai kontextus →</Link>
      </div>
    </details>
  )
}
