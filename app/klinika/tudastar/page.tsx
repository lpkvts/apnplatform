import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { GUIDELINE_SOURCES, sourcesByCategory, type GuidelineSource } from '@/lib/sources/data'

interface Row { id: string; title: string; specialty: string[] | null; summary: string | null }

export default async function TudastarPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guidelines')
    .select('id, title, specialty, summary')
    .eq('status', 'published')
    .order('title')
    .returns<Row[]>()
  const dbItems = data ?? []

  // Kategóriák egyesítése: forrás-regiszter + DB-irányelvek
  const cats: Record<string, { sources: GuidelineSource[]; guides: Row[] }> = {}
  for (const [cat, list] of sourcesByCategory()) (cats[cat] ??= { sources: [], guides: [] }).sources = list
  for (const g of dbItems) {
    const cat = (g.specialty && g.specialty[0]) || 'Egyéb'
    ;(cats[cat] ??= { sources: [], guides: [] }).guides.push(g)
  }
  const catNames = Object.keys(cats).sort((a, b) => a.localeCompare(b, 'hu'))
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Protokollok és irányelvek</h1>
      <p className="sub">Szakmai irányelvek, protokollok és a platformon hivatkozott források — kategóriánként. {GUIDELINE_SOURCES.length + dbItems.length} tétel.</p>

      {catNames.length === 0 && <div className="card"><p style={{ margin: 0 }}>Nincs elérhető tartalom.</p></div>}

      {catNames.map((cat) => {
        const { sources, guides } = cats[cat]
        const n = sources.length + guides.length
        return (
          <details key={cat} className="kt-acc">
            <summary className="kt-sum">
              <span>{cat}</span>
              <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 13, marginLeft: 'auto', marginRight: 8 }}>{n} tétel</span>
            </summary>
            <div className="kt-body">
              {sources.map((s) => {
                const due = s.reviewNext ? s.reviewNext <= today : false
                return (
                  <div key={s.id} className="card" style={{ marginBottom: 8 }}>
                    <b style={{ fontSize: 15 }}>{s.title}</b>
                    <div className="sub" style={{ marginTop: 4 }}>
                      {[s.org, s.year, s.identifier ? `azonosító: ${s.identifier}` : null, s.intl ? 'nemzetközi' : 'magyar', s.primary ? 'elsődleges' : 'kiegészítő', s.status].filter(Boolean).join(' · ')}
                    </div>
                    <div className="sub" style={{ marginTop: 4, fontSize: 12 }}>
                      {s.lastChecked && <>Utolsó ellenőrzés: {s.lastChecked}</>}
                      {s.reviewNext && <> · Következő felülvizsgálat: {s.reviewNext}</>}
                    </div>
                    {due && <div className="safety-note" style={{ marginTop: 6, borderLeftColor: '#C0392B' }}>🔴 Felülvizsgálat esedékes.</div>}
                    {s.usedIn && s.usedIn.length > 0 && <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>Hivatkozza: {s.usedIn.join(', ')}</div>}
                    {s.url && <a className="btn ghost sm" href={s.url} target="_blank" rel="noopener" style={{ marginTop: 8 }}>Forrás megnyitása</a>}
                  </div>
                )
              })}
              {guides.map((g) => (
                <Link key={g.id} className="sh-row" href={`/klinika/tudastar/${g.id}`}>
                  <span className="sh-row-main">
                    <span className="sh-row-name">{g.title}</span>
                    {g.summary && <span className="sh-row-sub">{g.summary}</span>}
                  </span>
                  <span className="sh-chev">›</span>
                </Link>
              ))}
            </div>
          </details>
        )
      })}
    </>
  )
}
