import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findSystem, elementsBySystem } from '@/lib/vizsgalat/checklist'
import { TopicBacklinks } from '@/components/topic-backlinks'

const TABS = [
  { id: 'checklist', label: 'Vizsgálati checklist' },
  { id: 'attekintes', label: 'Áttekintés' },
  { id: 'reszletes', label: 'Részletes tudás' },
]

export default async function RendszerPage({ params, searchParams }: { params: Promise<{ sys: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { sys } = await params
  const { tab = 'checklist' } = await searchParams
  const system = findSystem(sys)
  if (!system) notFound()
  const elements = elementsBySystem(sys)

  return (
    <>
      <Link className="sh-back" href="/klinika/vizsgalat">‹ Betegvizsgálat</Link>
      <h1 className="h1">{system.icon} {system.name}</h1>
      <p className="sub">{elements.length} vizsgálati elem · áttekintési és tanulási segédlet</p>

      <div className="sh-chips" style={{ marginBottom: 6 }}>
        {TABS.map((t) => (
          <Link key={t.id} href={`/klinika/vizsgalat/rendszer/${sys}?tab=${t.id}`} className={`sh-chip ${tab === t.id ? 'on' : ''}`}>{t.label}</Link>
        ))}
      </div>

      <TopicBacklinks kind="examSystems" id={sys} />

      {tab === 'attekintes' && (
        <>
          {system.overview && <div className="card"><b>A vizsgálat célja</b><p className="sub" style={{ margin: '4px 0 0' }}>{system.overview}</p></div>}
          {system.ippa && <div className="safety-note">Általános vizsgálati sorrend: Megtekintés → Tapintás → Kopogtatás → Hallgatózás.</div>}
          <div className="sub" style={{ marginTop: 8 }}>A részletes elemek a „Vizsgálati checklist" fülön érhetők el.</div>
        </>
      )}

      {(tab === 'checklist' || tab === 'reszletes') && (
        <>
          {tab === 'checklist' && <p className="sub">Mit érdemes ezen a rendszeren belül strukturáltan átnézni? Koppints egy elemre a részletes útmutatóhoz.</p>}
          {elements.map((e) => (
            <Link key={e.id} className="sh-row" href={`/klinika/vizsgalat/elem/${e.id}`}>
              <span className="ck-box">☐</span>
              <span className="sh-row-main">
                <span className="sh-row-name">{e.title}</span>
                <span className="sh-row-sub">{e.short}</span>
              </span>
              <span className="sh-chev">›</span>
            </Link>
          ))}
        </>
      )}
    </>
  )
}
