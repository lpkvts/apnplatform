import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TESTS } from '@/lib/scores/data'
import { LAB } from '@/lib/labor/data'
import { ECG } from '@/lib/ekg/data'
import { CONTEXTS } from '@/lib/context/data'
import { SafetyNote } from '@/components/safety'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

interface DiseaseBody {
  brief_what?: string; brief_why?: string; when?: string[]; examine?: string[]
  labs?: string; ekg?: string; imaging?: string; scores?: string
  red_flags?: string[]; apn_focus?: string[]; treatment?: string[]; followup?: string[]
  source_name?: string; source_url?: string; version?: string; updated?: string; evidence?: string
}
interface Disease {
  id: string; name: string; aliases: string[] | null; specialty: string | null; context_id: string | null
  score_ids: string[] | null; lab_ids: string[] | null; ekg_ids: string[] | null; guideline_kw: string[] | null
  body: DiseaseBody; version: string | null; review_on: string | null
}

function Sec({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (<div className="card"><b>{n}. {title}</b><div style={{ marginTop: 6 }}>{children}</div></div>)
}
function UL({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <p className="sub" style={{ margin: 0 }}>—</p>
  return <ul style={{ margin: 0, paddingLeft: 18 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
}
function RowLink({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (<Link className="sh-row" href={href}><span className="sh-row-main"><span className="sh-row-name">{title}</span>{sub && <span className="sh-row-sub">{sub}</span>}</span><span className="sh-chev">›</span></Link>)
}

export default async function DiseasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('diseases').select('*').eq('id', id).eq('status', 'published').maybeSingle<Disease>()
  if (!data) notFound()
  const b = data.body ?? {}

  const scores = TESTS.filter((t) => (data.score_ids ?? []).includes(t.id))
  const labs = LAB.filter((l) => (data.lab_ids ?? []).includes(l.id))
  const ekgs = ECG.filter((e) => (data.ekg_ids ?? []).includes(e.id))
  const { data: guides } = await supabase.from('guidelines').select('id, title, summary').eq('status', 'published')
  const gl = (guides ?? []).filter((g) => (data.guideline_kw ?? []).some((k) => norm(`${g.title} ${g.summary ?? ''}`).includes(norm(k))))
  const ctx = data.context_id ? CONTEXTS.find((c) => c.id === data.context_id) : null

  return (
    <>
      <Link className="sh-back" href="/betegsegtar">‹ Betegségtár</Link>
      <h1 className="h1">{data.name}</h1>
      <p className="sub">{data.specialty}{data.aliases && data.aliases.length ? ` · ${data.aliases.slice(0, 3).join(', ')}` : ''}</p>

      <Sec n={1} title="Röviden">
        {b.brief_what && <p style={{ margin: '0 0 6px' }}>{b.brief_what}</p>}
        {b.brief_why && <p className="sub" style={{ margin: 0 }}><b>APN szempont:</b> {b.brief_why}</p>}
      </Sec>
      <Sec n={2} title="Mikor gondolj rá?"><UL items={b.when} /></Sec>
      <Sec n={3} title="Mit vizsgálj?"><UL items={b.examine} /></Sec>

      <Sec n={4} title="Releváns labor">
        {b.labs && <p style={{ margin: '0 0 8px' }}>{b.labs}</p>}
        {labs.map((l) => <RowLink key={l.id} href={`/klinika/labor?open=${l.id}`} title={`${l.name} (${l.abbr})`} sub={`${l.ref}${l.unit ? ` ${l.unit}` : ''}`} />)}
      </Sec>

      <Sec n={5} title="EKG">
        {b.ekg && <p style={{ margin: '0 0 8px' }}>{b.ekg}</p>}
        {ekgs.map((e) => <RowLink key={e.id} href={`/klinika/ekg?open=${e.id}`} title={e.name} sub={e.cat} />)}
        {ekgs.length === 0 && !b.ekg && <p className="sub" style={{ margin: 0 }}>Nem rutinszerűen releváns.</p>}
      </Sec>

      <Sec n={6} title="Képalkotás / egyéb"><p style={{ margin: 0 }}>{b.imaging || '—'}</p></Sec>

      <Sec n={7} title="Klinikai score-ok">
        {b.scores && <p style={{ margin: '0 0 8px' }}>{b.scores}</p>}
        {scores.map((t) => <RowLink key={t.id} href={`/klinika/tesztek?open=${t.id}`} title={t.name} sub={t.abbr} />)}
        {scores.length === 0 && <p className="sub" style={{ margin: 0 }}>—</p>}
      </Sec>

      <div className="card" style={{ borderColor: '#fecaca', background: '#fff7f7' }}>
        <b style={{ color: '#b91c1c' }}>8. 🚨 Vörös zászlók</b>
        <div style={{ marginTop: 6 }}><UL items={b.red_flags} /></div>
        <p className="sub" style={{ margin: '8px 0 0' }}>Sürgős ellátás vagy magasabb szintű szakmai/orvosi konzultáció szükségességét jelzik.</p>
      </div>

      <div className="card" style={{ borderColor: '#d8e6df', background: 'var(--brand-tint)' }}>
        <b style={{ color: 'var(--brand)' }}>9. APN fókuszpontok</b>
        <div style={{ marginTop: 6 }}><UL items={b.apn_focus} /></div>
      </div>

      <Sec n={10} title="Kezelés áttekintése (elvek)"><UL items={b.treatment} />
        <p className="sub" style={{ margin: '8px 0 0' }}>Szakmai összefoglaló; nem betegspecifikus gyógyszerelési utasítás.</p></Sec>
      <Sec n={11} title="Gondozás és utánkövetés"><UL items={b.followup} /></Sec>

      <Sec n={12} title="Kapcsolódó tartalmak">
        {ctx && <RowLink href={`/kontextus/${ctx.id}`} title={`🧠 Klinikai kontextus: ${ctx.name}`} />}
        {gl.map((g) => <RowLink key={g.id} href={`/klinika/tudastar/${g.id}`} title={`📚 ${g.title}`} />)}
        <RowLink href={`/klinika/copilot?q=${encodeURIComponent(data.name)}`} title="🤖 Kérdezd az APN Copilotot" />
      </Sec>

      <Sec n={13} title="Források">
        <div className="row"><span className="sub" style={{ margin: 0 }}>Forrás</span><b style={{ textAlign: 'right' }}>{b.source_name || '—'}</b></div>
        <div className="row"><span className="sub" style={{ margin: 0 }}>Verzió</span><b>{b.version || data.version || '—'}</b></div>
        <div className="row"><span className="sub" style={{ margin: 0 }}>Utolsó frissítés</span><b>{b.updated || '—'}</b></div>
        <div className="row" style={{ borderBottom: 'none' }}><span className="sub" style={{ margin: 0 }}>Bizonyíték</span><b style={{ textAlign: 'right' }}>{b.evidence || '—'}</b></div>
        {b.source_url && <a className="btn ghost sm" href={b.source_url} target="_blank" rel="noopener" style={{ marginTop: 8 }}>Forrás megnyitása</a>}
      </Sec>

      <SafetyNote />
    </>
  )
}
