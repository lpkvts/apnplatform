import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CONTEXTS } from '@/lib/context/data'
import { TESTS } from '@/lib/scores/data'
import { LAB } from '@/lib/labor/data'
import { ECG } from '@/lib/ekg/data'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

interface Gl { id: string; title: string; summary: string | null }
interface Car { id: string; title: string; category: string; tags: string[] | null; specialty: string[] | null }

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (<><div className="sec-h"><span className="sec-t">{label}</span></div>{children}</>)
}
function RowLink({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (
    <Link className="sh-row" href={href}>
      <span className="sh-row-main"><span className="sh-row-name">{title}</span>{sub && <span className="sh-row-sub">{sub}</span>}</span>
      <span className="sh-chev">›</span>
    </Link>
  )
}

export default async function ContextDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ctx = CONTEXTS.find((c) => c.id === id)
  if (!ctx) notFound()

  const supabase = await createClient()
  const [gRes, cRes, dRes] = await Promise.all([
    supabase.from('guidelines').select('id, title, summary').eq('status', 'published').returns<Gl[]>(),
    supabase.from('career_items').select('id, title, category, tags, specialty').eq('status', 'published').returns<Car[]>(),
    supabase.from('diseases').select('id, name').eq('status', 'published').eq('context_id', ctx.id).returns<{ id: string; name: string }[]>(),
  ])
  const diseases = dRes.data ?? []

  const scores = TESTS.filter((t) => ctx.scoreIds.includes(t.id))
  const labs = LAB.filter((l) => ctx.labIds.includes(l.id))
  const ekgs = ECG.filter((e) => ctx.ekgIds.includes(e.id))
  const guides = (gRes.data ?? []).filter((g) => {
    const t = norm(`${g.title} ${g.summary ?? ''}`)
    return ctx.guidelineKw.some((k) => t.includes(norm(k)))
  })
  const careerKw = ctx.careerKw ?? []
  const careers = (cRes.data ?? []).filter((c) => {
    const hay = norm(`${c.title} ${(c.tags ?? []).join(' ')} ${(c.specialty ?? []).join(' ')}`)
    return careerKw.some((k) => hay.includes(norm(k)))
  })

  return (
    <>
      <Link className="sh-back" href="/kontextus">‹ Klinikai kontextus</Link>
      <h1 className="h1">{ctx.name}</h1>
      <div className="kb-relnote">🩺 APN fókusz: {ctx.apnFocus}</div>

      <a className="btn" href={`/klinika/copilot?q=${encodeURIComponent(ctx.name)}`} style={{ width: '100%', marginBottom: 8 }}>
        🤖 Kérdezd az APN Copilotot erről
      </a>

      {diseases.length > 0 && <Group label="🩺 Betegségek">{diseases.map((d) => <RowLink key={d.id} href={`/betegsegtar/${d.id}`} title={d.name} />)}</Group>}
      {scores.length > 0 && <Group label="🧮 Klinikai score-ok">{scores.map((t) => <RowLink key={t.id} href={`/klinika/tesztek?open=${t.id}`} title={t.name} sub={t.abbr} />)}</Group>}
      {labs.length > 0 && <Group label="🧪 Laborok">{labs.map((l) => <RowLink key={l.id} href={`/klinika/labor?open=${l.id}`} title={`${l.name} (${l.abbr})`} sub={`${l.ref}${l.unit ? ` ${l.unit}` : ''}`} />)}</Group>}
      {ekgs.length > 0 && <Group label="📈 EKG">{ekgs.map((e) => <RowLink key={e.id} href={`/klinika/ekg?open=${e.id}`} title={e.name} sub={e.cat} />)}</Group>}
      {guides.length > 0 && <Group label="📚 Irányelvek">{guides.map((g) => <RowLink key={g.id} href={`/klinika/tudastar/${g.id}`} title={g.title} sub={g.summary ?? undefined} />)}</Group>}
      {careers.length > 0 && <Group label="💼 Kapcsolódó képzések">{careers.map((c) => <RowLink key={c.id} href={`/career/${c.id}`} title={c.title} />)}</Group>}

      {diseases.length + scores.length + labs.length + ekgs.length + guides.length + careers.length === 0 && (
        <div className="card"><p style={{ margin: 0 }}>Ehhez a kontextushoz még nincs társított tartalom.</p></div>
      )}
      <p className="sh-disc">Döntéstámogató kapcsolatok; a klinikai döntés a szakember felelőssége.</p>
    </>
  )
}
