import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { COMPLAINTS } from '@/lib/clinical/complaints'
import { ClinicalDisclaimer } from '@/components/clinical-disclaimer'

export const dynamic = 'force-dynamic'

export default async function PanaszPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { p } = await searchParams
  const supabase = await createClient()
  const { data: diseases } = await supabase.from('diseases').select('id, slug').eq('status', 'published')
    .returns<{ id: string; slug: string }[]>()
  const bySlug = new Map((diseases ?? []).map((d) => [d.slug, d.id]))

  const active = p ? COMPLAINTS.find((c) => c.id === p) : null

  if (active) {
    return (
      <>
        <Link className="sh-back" href="/betegsegtar/panasz">‹ Panaszok</Link>
        <h1 className="h1">{active.name}</h1>
        <p className="sub">Lehetséges kórképek — döntéstámogató orientáció, nem diagnózis.</p>
        {active.conditions.map((c, i) => {
          const id = c.slug ? bySlug.get(c.slug) : undefined
          return id ? (
            <Link key={i} className="sh-row" href={`/betegsegtar/${id}`}>
              <span className="sh-row-main"><span className="sh-row-name">{c.name}</span><span className="sh-row-sub">Betegségoldal megnyitása</span></span>
              <span className="sh-chev">›</span>
            </Link>
          ) : (
            <div key={i} className="sh-row" style={{ cursor: 'default' }}>
              <span className="sh-row-main"><span className="sh-row-name">{c.name}</span><span className="sh-row-sub">Tartalom fejlesztés alatt</span></span>
              <span className="ekg-sev sev-mid">⚪</span>
            </div>
          )
        })}
        <ClinicalDisclaimer />
      </>
    )
  }

  return (
    <>
      <Link className="sh-back" href="/betegsegtar">‹ Klinikai Tudástár</Link>
      <h1 className="h1">Panasz alapján</h1>
      <p className="sub">Válaszd ki a vezető panaszt — a rendszer a lehetséges kórképeket ajánlja.</p>
      {COMPLAINTS.map((c) => (
        <Link key={c.id} className="sh-row" href={`/betegsegtar/panasz?p=${c.id}`}>
          <span className="sh-row-main"><span className="sh-row-name">{c.name}</span><span className="sh-row-sub">{c.conditions.length} lehetséges kórkép</span></span>
          <span className="sh-chev">›</span>
        </Link>
      ))}
      <ClinicalDisclaimer />
    </>
  )
}
