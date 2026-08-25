import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TESTS } from '@/lib/scores/data'
import { LAB } from '@/lib/labor/data'
import { ECG } from '@/lib/ekg/data'
import { CONTEXTS } from '@/lib/context/data'
import { SafetyNote } from '@/components/safety'
import { ClinicalDisclaimer } from '@/components/clinical-disclaimer'
import { getFlag } from '@/lib/flags'
import { TopicBacklinksForDisease } from '@/components/topic-backlinks'

export const dynamic = 'force-dynamic'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

interface DiseaseBody {
  brief_what?: string; brief_why?: string; when?: string[]; examine?: string[]
  labs?: string; ekg?: string; imaging?: string; scores?: string
  red_flags?: string[]; apn_focus?: string[]; treatment?: string[]; followup?: string[]
  source_name?: string; source_url?: string; version?: string; updated?: string; evidence?: string
}
interface Ddx { name: string; slug?: string }
interface ApnApproach { anamnesis?: string; physical?: string; data?: string; thinking?: string; consultation?: string; escalation?: string }
interface Reviewer { name?: string; specialty?: string; role?: string; date?: string }
interface Disease {
  id: string; name: string; aliases: string[] | null; specialty: string | null; context_id: string | null
  score_ids: string[] | null; lab_ids: string[] | null; ekg_ids: string[] | null; guideline_kw: string[] | null
  body: DiseaseBody; version: string | null; review_on: string | null; status: string
  epidemiology: string | null; pathophysiology: string | null; ddx: Ddx[] | null; apn_approach: ApnApproach | null
  evidence_levels: string[] | null; validation_status: string | null; reviewers: Reviewer[] | null
  block_sources: Record<string, string> | null; is_stub: boolean; bno: string | null
}

const EVID: Record<string, string> = { guideline: '🟢 Guideline-based', evidence: '🔵 Evidence-based', expert: '🟣 Expert-reviewed' }
const VALID: Record<string, { label: string; cls: string }> = {
  draft: { label: '⚪ Draft', cls: 'cs-draft' },
  review_pending: { label: '🟡 Lektorálásra vár', cls: 'cs-followup' },
  under_review: { label: '🔵 Ellenőrzés alatt', cls: 'cs-active' },
  approved: { label: '🟢 Jóváhagyott', cls: 'cs-completed' },
  update_required: { label: '🟠 Frissítés szükséges', cls: 'cs-followup' },
  archived: { label: '🔴 Archivált', cls: 'cs-archived' },
}
const APN_LABELS: { k: keyof ApnApproach; label: string }[] = [
  { k: 'anamnesis', label: 'Anamnézis — mire kérdezzen rá' },
  { k: 'physical', label: 'Fizikális vizsgálat — mire figyeljen' },
  { k: 'data', label: 'Adatgyűjtés' },
  { k: 'thinking', label: 'Klinikai gondolkodás' },
  { k: 'consultation', label: 'Konzultáció' },
  { k: 'escalation', label: 'Eszkaláció' },
]

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (<div className="card"><b>{title}</b><div style={{ marginTop: 6 }}>{children}</div></div>)
}
function UL({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <p className="sub" style={{ margin: 0 }}>—</p>
  return <ul style={{ margin: 0, paddingLeft: 18 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
}
function RowLink({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (<Link className="sh-row" href={href}><span className="sh-row-main"><span className="sh-row-name">{title}</span>{sub && <span className="sh-row-sub">{sub}</span>}</span><span className="sh-chev">›</span></Link>)
}
function BlockSource({ src }: { src?: string }) {
  if (!src) return null
  return <p className="sub" style={{ margin: '6px 0 0', fontSize: 12 }}>ⓘ Forrás: {src}</p>
}

export default async function DiseasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('diseases').select('*').eq('id', id).eq('status', 'published').maybeSingle<Disease>()
  if (!data) notFound()
  const copilotEnabled = await getFlag('apn_copilot', false)
  if (data.is_stub) {
    return (
      <>
        <Link className="sh-back" href="/betegsegtar">‹ Betegségtár</Link>
        <h1 className="h1">{data.name}</h1>
        <p className="sub">{data.specialty}{data.bno ? ` · BNO ${data.bno}` : ''}</p>
        <ClinicalDisclaimer />
        <TopicBacklinksForDisease name={data.name} />
        <div className="card">
          <b>⚪ Tartalom fejlesztés alatt</b>
          <p style={{ margin: '6px 0 0' }}>Ez a kórkép még katalógus-tétel: a strukturált, forrásolt adatlap (epidemiológia, DDx, labor/EKG, kezelés, vörös zászlók, APN-megközelítés) lektorálással, fokozatosan készül el.</p>
        </div>
        {copilotEnabled && <Link className="sh-row" href={`/klinika/copilot?q=${encodeURIComponent(data.name)}`}><span className="sh-row-main"><span className="sh-row-name">🤖 Kérdezd az APN Copilotot</span><span className="sh-row-sub">Amíg az adatlap készül</span></span><span className="sh-chev">›</span></Link>}
      </>
    )
  }

  const b = data.body ?? {}
  const bs = data.block_sources ?? {}

  const scores = TESTS.filter((t) => (data.score_ids ?? []).includes(t.id))
  const labs = LAB.filter((l) => (data.lab_ids ?? []).includes(l.id))
  const ekgs = ECG.filter((e) => (data.ekg_ids ?? []).includes(e.id))
  const [guidesRes, disRes] = await Promise.all([
    supabase.from('guidelines').select('id, title, summary').eq('status', 'published'),
    supabase.from('diseases').select('id, slug').eq('status', 'published').returns<{ id: string; slug: string }[]>(),
  ])
  const gl = (guidesRes.data ?? []).filter((g) => (data.guideline_kw ?? []).some((k) => norm(`${g.title} ${g.summary ?? ''}`).includes(norm(k))))
  const bySlug = new Map((disRes.data ?? []).map((d) => [d.slug, d.id]))
  const ctx = data.context_id ? CONTEXTS.find((c) => c.id === data.context_id) : null

  const ddx = data.ddx ?? []
  const apn = data.apn_approach ?? {}
  const apnHas = APN_LABELS.some((x) => apn[x.k])
  const evid = data.evidence_levels ?? []
  const valid = data.validation_status ?? (data.status === 'published' ? 'approved' : undefined)
  const reviewers = (data.reviewers ?? []).filter((r) => r.name)

  return (
    <>
      <Link className="sh-back" href="/betegsegtar">‹ Betegségtár</Link>
      <h1 className="h1">{data.name}</h1>
      <p className="sub">{data.specialty}{data.aliases && data.aliases.length ? ` · ${data.aliases.slice(0, 3).join(', ')}` : ''}</p>

      {(evid.length > 0 || valid) && (
        <div className="sh-chips" style={{ marginTop: 2 }}>
          {evid.map((e) => <span key={e} className="sh-chip">{EVID[e] ?? e}</span>)}
          {valid && VALID[valid] && <span className={`cms-badge ${VALID[valid].cls}`}>{VALID[valid].label}</span>}
          {data.review_on && <span className="sh-chip">📅 Felülvizsgálat: {data.review_on}</span>}
        </div>
      )}

      <ClinicalDisclaimer />
      <TopicBacklinksForDisease name={data.name} />

      <Sec title="1. Röviden">
        {b.brief_what && <p style={{ margin: '0 0 6px' }}>{b.brief_what}</p>}
        {b.brief_why && <p className="sub" style={{ margin: 0 }}><b>APN szempont:</b> {b.brief_why}</p>}
      </Sec>

      {data.epidemiology && <Sec title="Epidemiológia és rizikófaktorok"><p style={{ margin: 0 }}>{data.epidemiology}</p></Sec>}
      {data.pathophysiology && <Sec title="Patofiziológia"><p style={{ margin: 0 }}>{data.pathophysiology}</p></Sec>}

      <Sec title="2. Mikor gondolj rá?"><UL items={b.when} /></Sec>
      <Sec title="3. Mit vizsgálj?"><UL items={b.examine} /></Sec>

      <Sec title="4. Releváns labor">
        {b.labs && <p style={{ margin: '0 0 8px' }}>{b.labs}</p>}
        {labs.map((l) => <RowLink key={l.id} href={`/klinika/labor?open=${l.id}`} title={`${l.name} (${l.abbr})`} sub={`${l.ref}${l.unit ? ` ${l.unit}` : ''}`} />)}
        <BlockSource src={bs.labor} />
      </Sec>

      <Sec title="5. EKG">
        {b.ekg && <p style={{ margin: '0 0 8px' }}>{b.ekg}</p>}
        {ekgs.map((e) => <RowLink key={e.id} href={`/klinika/ekg?open=${e.id}`} title={e.name} sub={e.cat} />)}
        {ekgs.length === 0 && !b.ekg && <p className="sub" style={{ margin: 0 }}>Nem rutinszerűen releváns.</p>}
        <BlockSource src={bs.ekg} />
      </Sec>

      <Sec title="6. Képalkotás / egyéb"><p style={{ margin: 0 }}>{b.imaging || '—'}</p></Sec>

      <Sec title="7. Klinikai score-ok">
        {b.scores && <p style={{ margin: '0 0 8px' }}>{b.scores}</p>}
        {scores.map((t) => <RowLink key={t.id} href={`/klinika/tesztek?open=${t.id}`} title={t.name} sub={t.abbr} />)}
        {scores.length === 0 && <p className="sub" style={{ margin: 0 }}>—</p>}
      </Sec>

      {ddx.length > 0 && (
        <Sec title="Differenciáldiagnózis">
          {ddx.map((d, i) => {
            const did = d.slug ? bySlug.get(d.slug) : undefined
            return did
              ? <RowLink key={i} href={`/betegsegtar/${did}`} title={d.name} sub="Betegségoldal megnyitása" />
              : <div key={i} className="sh-row" style={{ cursor: 'default' }}><span className="sh-row-main"><span className="sh-row-name">{d.name}</span><span className="sh-row-sub">Tartalom fejlesztés alatt</span></span><span className="ekg-sev sev-mid">⚪</span></div>
          })}
        </Sec>
      )}

      <div className="card" style={{ borderColor: '#fecaca', background: '#fff7f7' }}>
        <b style={{ color: '#b91c1c' }}>8. 🚨 Vörös zászlók</b>
        <div style={{ marginTop: 6 }}><UL items={b.red_flags} /></div>
        <p className="sub" style={{ margin: '8px 0 0' }}>Sürgős ellátás vagy magasabb szintű szakmai/orvosi konzultáció szükségességét jelzik.</p>
      </div>

      <div className="card" style={{ borderColor: '#d8e6df', background: 'var(--brand-tint)' }}>
        <b style={{ color: 'var(--brand)' }}>9. APN klinikai megközelítés</b>
        <div style={{ marginTop: 6 }}><UL items={b.apn_focus} /></div>
        {apnHas && (
          <div style={{ marginTop: 8 }}>
            {APN_LABELS.filter((x) => apn[x.k]).map((x) => (
              <div key={x.k} style={{ marginBottom: 6 }}>
                <b style={{ fontSize: 13 }}>{x.label}</b>
                <p style={{ margin: '2px 0 0' }}>{apn[x.k]}</p>
              </div>
            ))}
          </div>
        )}
        <p className="sub" style={{ margin: '8px 0 0', fontSize: 12 }}>Az APN konkrét jogosultságai a hatályos szabályozástól, végzettségtől, kompetenciáktól és a helyi intézményi szabályoktól függnek.</p>
      </div>

      <Sec title="10. Kezelés áttekintése (elvek)"><UL items={b.treatment} />
        <p className="sub" style={{ margin: '8px 0 0' }}>Szakmai összefoglaló; nem betegspecifikus gyógyszerelési utasítás.</p>
        <BlockSource src={bs.kezeles} />
      </Sec>
      <Sec title="11. Gondozás és utánkövetés"><UL items={b.followup} /></Sec>

      <Sec title="12. Kapcsolódó tartalmak">
        {ctx && <RowLink href={`/kontextus/${ctx.id}`} title={`🧠 Klinikai kontextus: ${ctx.name}`} />}
        {gl.map((g) => <RowLink key={g.id} href={`/klinika/tudastar/${g.id}`} title={`📚 ${g.title}`} />)}
        {copilotEnabled && <RowLink href={`/klinika/copilot?q=${encodeURIComponent(data.name)}`} title="🤖 Kérdezd az APN Copilotot" />}
      </Sec>

      <Sec title="13. Források, evidencia és felülvizsgálat">
        <div className="row"><span className="sub" style={{ margin: 0 }}>Forrás</span><b style={{ textAlign: 'right' }}>{b.source_name || '—'}</b></div>
        <div className="row"><span className="sub" style={{ margin: 0 }}>Verzió</span><b>{b.version || data.version || '—'}</b></div>
        <div className="row"><span className="sub" style={{ margin: 0 }}>Utolsó frissítés</span><b>{b.updated || '—'}</b></div>
        <div className="row"><span className="sub" style={{ margin: 0 }}>Következő felülvizsgálat</span><b>{data.review_on || '—'}</b></div>
        <div className="row" style={{ borderBottom: reviewers.length ? undefined : 'none' }}><span className="sub" style={{ margin: 0 }}>Bizonyíték</span><b style={{ textAlign: 'right' }}>{b.evidence || '—'}</b></div>
        {reviewers.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <b style={{ fontSize: 13 }}>Szakmai felülvizsgálat</b>
            {reviewers.map((r, i) => (
              <p key={i} className="sub" style={{ margin: '4px 0 0' }}>{r.name}{r.specialty ? ` – ${r.specialty}` : ''}{r.role ? ` (${r.role})` : ''}{r.date ? ` · ${r.date}` : ''}</p>
            ))}
          </div>
        )}
        {b.source_url && <a className="btn ghost sm" href={b.source_url} target="_blank" rel="noopener" style={{ marginTop: 8 }}>Forrás megnyitása</a>}
      </Sec>

      <SafetyNote />
    </>
  )
}
