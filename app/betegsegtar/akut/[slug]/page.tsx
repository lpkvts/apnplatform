import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { findTopic } from '@/lib/topics/data'
import { ECG } from '@/lib/ekg/data'
import { LAB } from '@/lib/labor/data'
import { TESTS } from '@/lib/scores/data'
import { EXAM_SYSTEMS } from '@/lib/vizsgalat/checklist'
import { RelatedDiseases } from '@/components/related-diseases'
import { ClinicalDisclaimer } from '@/components/clinical-disclaimer'
import type { DzLite } from '@/lib/disease/resolve'
export const dynamic = 'force-dynamic'

const ecgName = (id: string) => (ECG as { id: string; name: string }[]).find((e) => e.id === id)?.name ?? id
const labName = (id: string) => (LAB as { id: string; name: string }[]).find((l) => l.id === id)?.name ?? id
const testName = (id: string) => (TESTS as { id: string; name: string }[]).find((t) => t.id === id)?.name ?? id
const sysName = (id: string) => EXAM_SYSTEMS.find((s) => s.id === id)?.name ?? id

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return <div className="card">{title && <b>{title}</b>}<div style={{ marginTop: title ? 6 : 0 }}>{children}</div></div>
}
function Checklist({ items }: { items: string[] }) {
  return <div>{items.map((x, i) => <div key={i} style={{ padding: '5px 0', borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none' }}>☐ {x}</div>)}</div>
}

export default async function AkutTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = findTopic(slug)
  if (!t) notFound()

  const supabase = await createClient()
  const { data } = await supabase.from('diseases').select('id, name, aliases, is_stub').eq('status', 'published').returns<DzLite[]>()
  const lookup = data ?? []

  const danger: React.CSSProperties = { background: '#FBEAEA', border: '1px solid #E4B9B9', borderLeft: '5px solid #C0392B', borderRadius: 14, padding: 16, margin: '10px 0' }
  const apnPremium: React.CSSProperties = { background: 'var(--brand-tint)', border: '1px solid var(--line)', borderLeft: '5px solid var(--brand)', borderRadius: 14, padding: 16, margin: '10px 0' }

  return (
    <>
      <Link className="sh-back" href="/betegsegtar/akut">‹ Akut állapotok</Link>
      <h1 className="h1">{t.icon} {t.title}</h1>
      <p className="sub">{t.subtitle}</p>
      {t.contentStatus && <div className="sub" style={{ fontSize: 12 }}>{t.contentStatus}</div>}

      {/* 1. Rövid klinikai orientáció */}
      <Card title="🧭 Rövid klinikai orientáció">
        {t.orientation.map((p, i) => <p key={i} style={{ margin: i === 0 ? 0 : '8px 0 0' }}>{p}</p>)}
      </Card>

      {/* 2. Vörös zászlók */}
      <div style={danger}>
        <b style={{ color: '#9B2C2C' }}>🚨 Vörös zászlók</b>
        <div style={{ marginTop: 8 }}>
          {t.redFlags.map((r, i) => <div key={i} style={{ padding: '4px 0' }}>🚩 {r}</div>)}
        </div>
      </div>

      {/* 3. Elsődleges értékelés */}
      <div className="sec-h"><span className="sec-t">Elsődleges értékelés</span></div>
      <Card title="Klinikai stabilitás">
        <Checklist items={t.stability} />
        <div className="cop-acts" style={{ marginTop: 10 }}>
          <a className="btn ghost sm" href="/klinika/vizsgalat/rendszer/eletjelek">📊 Vitális paraméterek</a>
          <a className="btn ghost sm" href="/klinika/vizsgalat">🩺 Betegvizsgálat</a>
        </div>
      </Card>
      <Card title="Célzott anamnézis">
        <div className="sub" style={{ marginBottom: 4 }}>A panasz jellemzői</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{t.historyFeatures.map((x) => <span key={x} className="chip">{x}</span>)}</div>
        <div className="sub" style={{ margin: '10px 0 4px' }}>Fontos kísérő tünetek</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{t.historySymptoms.map((x) => <span key={x} className="chip">{x}</span>)}</div>
        {t.historyNote && <div className="safety-note" style={{ marginTop: 10 }}>{t.historyNote}</div>}
        <div className="cop-acts" style={{ marginTop: 10 }}>
          <a className="btn ghost sm" href="/klinika/vizsgalat/munkamenet">🩺 Célzott anamnézis</a>
        </div>
      </Card>

      {/* 4. EKG */}
      <Card title="📈 EKG">
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t.ekgHeadline}</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>{t.ekgNote.map((x, i) => <li key={i} style={{ margin: '2px 0' }}>{x}</li>)}</ul>
        <div className="cop-acts" style={{ marginTop: 10 }}>
          {(t.related.ekg ?? []).map((id) => <a key={id} className="btn ghost sm" href={`/klinika/ekg?open=${id}`}>📈 {ecgName(id)}</a>)}
        </div>
      </Card>

      {/* 5. Kapcsolódó labor */}
      <Card title="🧪 Kapcsolódó labor">
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{t.laborHeadline}</div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>{t.laborKeyNote.map((x, i) => <li key={i} style={{ margin: '2px 0' }}>{x}</li>)}</ul>
        <div className="sub" style={{ margin: '10px 0 2px' }}>További releváns vizsgálatok állapotfüggően:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{t.laborMore.map((x) => <span key={x} className="chip">{x}</span>)}</div>
        <div className="cop-acts" style={{ marginTop: 10 }}>
          {(t.related.labor ?? []).map((id) => <a key={id} className="btn ghost sm" href={`/klinika/labor?open=${id}`}>🧪 {labName(id)}</a>)}
        </div>
      </Card>

      {/* 6. Kapcsolódó score-ok */}
      <Card title="🧮 Kapcsolódó score-ok">
        <p style={{ margin: 0 }}>{t.scoreNote}</p>
        <div className="cop-acts" style={{ marginTop: 10 }}>
          {(t.related.scores ?? []).map((id) => <a key={id} className="btn ghost sm" href={`/klinika/tesztek?open=${id}`}>🧮 {testName(id)}</a>)}
        </div>
      </Card>

      {/* 7. Fontos differenciáldiagnózisok — összecsukható */}
      <details className="kt-acc">
        <summary className="kt-sum">🧩 Fontos differenciáldiagnózisok</summary>
        <div className="kt-body">
          <div className="safety-note" style={{ borderLeftColor: '#C0392B' }}>Elsőként mérlegelendő, potenciálisan életveszélyes okok:</div>
          <RelatedDiseases names={t.ddx.critical} lookup={lookup} title="Életveszélyes okok" />
          <RelatedDiseases names={t.ddx.cardiac} lookup={lookup} title="Fontos kardiális okok" />
          <RelatedDiseases names={t.ddx.other} lookup={lookup} title="Egyéb lehetséges okok" />
        </div>
      </details>

      {/* 8. APN klinikai fókusz */}
      <div style={apnPremium}>
        <b style={{ color: 'var(--brand-dark)' }}>⭐ APN klinikai fókusz</b>
        <div style={{ marginTop: 8 }}><Checklist items={t.apnFocus} /></div>
        {t.apnWarning && <div className="safety-note" style={{ marginTop: 10 }}>{t.apnWarning}</div>}
      </div>

      {/* 9. Eszkaláció */}
      <div style={danger}>
        <b style={{ color: '#9B2C2C' }}>⚡ Eszkaláció — azonnali eszkaláció indokolt különösen:</b>
        <div style={{ marginTop: 8 }}>{t.escalation.map((x, i) => <div key={i} style={{ padding: '4px 0' }}>• {x}</div>)}</div>
        {t.escalationNote && <div className="safety-note" style={{ marginTop: 10 }}>{t.escalationNote}</div>}
      </div>

      {/* 10. Oxigén — gyakori hiba */}
      <Card title="💨 Oxigén — gyakori hiba">
        <p style={{ margin: 0, fontWeight: 600 }}>Az oxigén nem rutinszerűen szükséges minden akut mellkasi fájdalmas betegnél.</p>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>{t.oxygen.map((x, i) => <li key={i} style={{ margin: '2px 0' }}>{x}</li>)}</ul>
      </Card>

      {/* 11. Kapcsolódó tudás — összecsukható */}
      <details className="kt-acc">
        <summary className="kt-sum">🔗 Kapcsolódó tudás</summary>
        <div className="kt-body">
      <Card title="🩺 Betegvizsgálat">
        {(t.related.examSystems ?? []).map((id) => (
          <Link key={id} className="sh-row" href={`/klinika/vizsgalat/rendszer/${id}`}>
            <span className="sh-row-main"><span className="sh-row-name">{sysName(id)}</span></span><span className="sh-chev">›</span>
          </Link>
        ))}
        {(t.related.examLinks ?? []).map((l) => (
          <Link key={l.href} className="sh-row" href={l.href}>
            <span className="sh-row-main"><span className="sh-row-name">{l.label}</span></span><span className="sh-chev">›</span>
          </Link>
        ))}
      </Card>
      {t.related.ekg && t.related.ekg.length > 0 && (
        <Card title="📈 EKG">
          {t.related.ekg.map((id) => (
            <a key={id} className="sh-row" href={`/klinika/ekg?open=${id}`}>
              <span className="sh-row-main"><span className="sh-row-name">{ecgName(id)}</span></span><span className="sh-chev">›</span>
            </a>
          ))}
        </Card>
      )}
      {t.related.labor && t.related.labor.length > 0 && (
        <Card title="🧪 Labor">
          {t.related.labor.map((id) => (
            <a key={id} className="sh-row" href={`/klinika/labor?open=${id}`}>
              <span className="sh-row-main"><span className="sh-row-name">{labName(id)}</span></span><span className="sh-chev">›</span>
            </a>
          ))}
        </Card>
      )}
      {t.related.scores && t.related.scores.length > 0 && (
        <Card title="🧮 Score Hub">
          {t.related.scores.map((id) => (
            <a key={id} className="sh-row" href={`/klinika/tesztek?open=${id}`}>
              <span className="sh-row-main"><span className="sh-row-name">{testName(id)}</span></span><span className="sh-chev">›</span>
            </a>
          ))}
        </Card>
      )}
      <RelatedDiseases names={t.related.diseases} lookup={lookup} title="Betegségtár" />
        </div>
      </details>

      {/* 13. Források */}
      <div className="sec-h"><span className="sec-t">Szakmai források</span></div>
      {t.sources.map((src, i) => {
        const today = new Date().toISOString().slice(0, 10)
        const due = src.reviewNext ? src.reviewNext <= today : false
        const soon = src.reviewNext && !due ? (new Date(src.reviewNext).getTime() - Date.now()) / 86400000 <= 90 : false
        return (
          <div key={i} className="card">
            <b>{src.name}</b>
            <div className="sub" style={{ marginTop: 4 }}>
              {[src.org, src.year, src.identifier ? `azonosító: ${src.identifier}` : null, src.intl ? 'nemzetközi' : 'magyar', src.primary ? 'elsődleges' : 'kiegészítő', src.status].filter(Boolean).join(' · ')}
            </div>
            <div className="sub" style={{ marginTop: 4, fontSize: 12 }}>
              {src.lastChecked && <>Utolsó ellenőrzés: {src.lastChecked}</>}
              {src.reviewNext && <> · Következő felülvizsgálat: {src.reviewNext}</>}
            </div>
            {due && <div className="safety-note" style={{ marginTop: 6, borderLeftColor: '#C0392B' }}>🔴 Felülvizsgálat esedékes — a forrás aktualitása ellenőrizendő.</div>}
            {soon && <div className="sub" style={{ marginTop: 6, color: '#B7791F' }}>🟠 A felülvizsgálat hamarosan esedékes.</div>}
          </div>
        )
      })}

      <ClinicalDisclaimer />
    </>
  )
}
