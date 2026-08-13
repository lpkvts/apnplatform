'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ECG, EKG_CATS, type EcgItem } from '@/lib/ekg/data'
import { ECG_WAVES } from '@/lib/ekg/waves'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const SEV_CLS: Record<string, string> = {
  'Enyhe': 'sev-low', 'Közepes': 'sev-mid', 'Súlyos': 'sev-high', 'Életveszélyes': 'sev-crit',
}

function Trace({ wave }: { wave?: string }) {
  const w = wave ? ECG_WAVES[wave] : undefined
  if (!w) return null
  return (
    <svg className="ecg-svg" viewBox={`0 0 ${w.w} 150`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="eg" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M8 0H0V8" fill="none" stroke="#f2ccd2" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#fffdfd" />
      <rect width="100%" height="100%" fill="url(#eg)" />
      <polyline points={w.pts} fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

function UL({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div style={{ marginTop: 8 }}>
      <b style={{ fontSize: 13 }}>{title}</b>
      <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  )
}

export function Ekg() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Összes')
  const [openId, setOpenId] = useState<string | null>(null)

  const open = openId ? ECG.find((e) => e.id === openId) ?? null : null
  if (open) return <EcgDetail e={open} onBack={() => setOpenId(null)} />

  const nq = norm(q.trim())
  const list = ECG.filter((e) => {
    const inCat = cat === 'Összes' || e.cat === cat
    const inQ = !nq || norm(`${e.name} ${e.kw ?? ''} ${e.cat}`).includes(nq)
    return nq ? inQ : inCat && inQ
  })
  const cats = ['Összes', ...EKG_CATS]

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">EKG Tudástár</h1>
      <p className="sub">{ECG.length} EKG-kép · felismerés, kritériumok, APN-teendők</p>
      <input className="field" placeholder="Keresés: név, tünet, kategória…" value={q} onChange={(e) => setQ(e.target.value)} />
      {!nq && (
        <div className="sh-chips">
          {cats.map((c) => <button key={c} className={c === cat ? 'sh-chip on' : 'sh-chip'} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      )}
      <div>
        {list.map((e) => (
          <button key={e.id} className="sh-row" onClick={() => setOpenId(e.id)}>
            <span className="sh-row-main">
              <span className="sh-row-name">{e.name}</span>
              <span className="sh-row-sub">{e.cat}</span>
            </span>
            {e.sev && <span className={`ekg-sev ${SEV_CLS[e.sev] ?? ''}`}>{e.sev}</span>}
            <span className="sh-chev">›</span>
          </button>
        ))}
        {list.length === 0 && <p className="sub">Nincs találat.</p>}
      </div>
    </>
  )
}

function EcgDetail({ e, onBack }: { e: EcgItem; onBack: () => void }) {
  const urgent = e.urgent && e.urgent.trim() && e.urgent.trim() !== '—'
  return (
    <>
      <button className="sh-back" onClick={onBack}>‹ Vissza a listához</button>
      <h1 className="h1">{e.name}</h1>
      <p className="sub">{e.cat}{e.freq ? ` · ${e.freq}` : ''}{e.sev ? ` · ${e.sev}` : ''}</p>

      {e.wave && <div className="card" style={{ padding: 8 }}><Trace wave={e.wave} /></div>}

      <div className="card">
        <p style={{ margin: 0 }}>{e.desc}</p>
        {e.apnRel && <p className="sub" style={{ margin: '8px 0 0' }}><b>APN-relevancia:</b> {e.apnRel}</p>}
      </div>

      {urgent && <div className="sh-urgent">⚠ {e.urgent}</div>}

      {e.features && e.features.length > 0 && (
        <div className="card"><b>🔍 Felismerés — jellemzők</b><UL title="" items={e.features} /></div>
      )}
      {e.algo && e.algo.length > 0 && (
        <div className="card"><b>🧭 Diagnosztikus lépések</b>
          <ol style={{ margin: '6px 0 0', paddingLeft: 18 }}>{e.algo.map((x, i) => <li key={i}>{x}</li>)}</ol>
        </div>
      )}
      {e.apn && e.apn.length > 0 && (
        <div className="sh-apn"><b>APN teendők</b><ul>{e.apn.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
      )}
      {e.signif && e.signif.trim() && (
        <div className="card"><b>💡 Klinikai jelentőség</b><p style={{ margin: '6px 0 0' }}>{e.signif}</p></div>
      )}
      {e.mistakes && e.mistakes.length > 0 && (
        <div className="card"><b>⚠ Gyakori hibák</b><UL title="" items={e.mistakes} /></div>
      )}
      {e.memory && (
        <div className="kb-relnote">🧠 Memóriakampó: {e.memory}</div>
      )}
      {e.diseases && e.diseases.length > 0 && (
        <div className="card"><UL title="Kapcsolódó kórképek" items={e.diseases} /></div>
      )}
      <p className="sh-disc">Oktató-döntéstámogató referencia; a valós EKG mindig klinikai kontextusban, orvosi megerősítéssel értékelendő.</p>
    </>
  )
}
