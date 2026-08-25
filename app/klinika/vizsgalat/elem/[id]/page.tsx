import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findElement, findSystem } from '@/lib/vizsgalat/checklist'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="card"><b>{title}</b><div style={{ marginTop: 6 }}>{children}</div></div>
}
function UL({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null
  return <ul style={{ margin: 0, paddingLeft: 18 }}>{items.map((x, i) => <li key={i} style={{ margin: '2px 0' }}>{x}</li>)}</ul>
}

export default async function ElemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const e = findElement(id)
  if (!e) notFound()
  const system = findSystem(e.sys)
  const hasDeep = e.purpose || e.prep || e.equip || e.steps || e.observe || e.findings || e.detail

  return (
    <>
      <Link className="sh-back" href={`/klinika/vizsgalat/rendszer/${e.sys}`}>‹ {system?.name}</Link>
      <h1 className="h1">{e.title}</h1>
      <p className="sub">{e.short}</p>
      {system?.ippa && <div className="safety-note">Vizsgálati sorrend: Megtekintés → Tapintás → Kopogtatás → Hallgatózás.</div>}

      {e.purpose && <Block title="🎯 Mit vizsgálunk?"><p style={{ margin: 0 }}>{e.purpose}</p></Block>}
      {e.prep && <Block title="🧰 Előkészítés"><UL items={e.prep} /></Block>}
      {e.equip && <Block title="🔧 Szükséges eszközök"><UL items={e.equip} /></Block>}
      {e.steps && <Block title="📋 Vizsgálat menete"><ol style={{ margin: 0, paddingLeft: 18 }}>{e.steps.map((x, i) => <li key={i} style={{ margin: '3px 0' }}>{x}</li>)}</ol></Block>}
      {e.observe && <Block title="👀 Mire figyeljek?"><UL items={e.observe} /></Block>}
      {e.findings && <Block title="⚠️ Gyakori eltérések"><UL items={e.findings} /></Block>}

      {(e.conditions || e.scoreIds || e.labIds || e.ekgIds) && (
        <div className="card">
          <b>🔗 Kapcsolódó tartalmak</b>
          <div className="cop-acts" style={{ marginTop: 8 }}>
            {e.conditions && e.conditions.length > 0 && <a className="btn ghost sm" href="/betegsegtar">🩺 Betegségtár</a>}
            {e.scoreIds && e.scoreIds.map((s) => <a key={s} className="btn ghost sm" href={`/klinika/tesztek?open=${s}`}>🧮 {s.toUpperCase()}</a>)}
            {e.labIds && e.labIds.map((l) => <a key={l} className="btn ghost sm" href={`/klinika/labor?open=${l}`}>🧪 {l}</a>)}
            {e.ekgIds && e.ekgIds.map((k) => <a key={k} className="btn ghost sm" href={`/klinika/ekg?open=${k}`}>📈 EKG</a>)}
          </div>
          {e.conditions && e.conditions.length > 0 && <p className="sub" style={{ margin: '8px 0 0' }}>Kórképek: {e.conditions.join(', ')}</p>}
        </div>
      )}

      {e.competency && (
        <Link className="card klink" href="/kompetenciak">
          <div className="klink-t">📈 Kapcsolódó kompetencia</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>{e.competency}</div>
        </Link>
      )}

      {e.detail && <Block title="📚 Részletes propedeutikai útmutató"><p style={{ margin: 0 }}>{e.detail}</p></Block>}
      {!hasDeep && <div className="card"><p className="sub" style={{ margin: 0 }}>A részletes vizsgálati útmutató ehhez az elemhez fejlesztés alatt áll.</p></div>}

      <div className="safety-note">Az „áttekintés" tanulási/áttekintési célú — nem jelenti, hogy a klinikai vizsgálat ténylegesen megtörtént, és nem helyettesíti a klinikai megítélést.</div>
    </>
  )
}
