'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LAB, LAB_CATS, LAB_REF_EXTRA, type LabItem } from '@/lib/labor/data'
import { interpret, STATUS_LABEL, statusRisk } from '@/lib/labor/engine'

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const RISK_CLS: Record<string, string> = { low: 'r-low', mid: 'r-mid', high: 'r-high', crit: 'r-crit' }

export function Labor() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Összes')
  const [openId, setOpenId] = useState<string | null>(null)
  const [vals, setVals] = useState<Record<string, string>>({})

  const open = openId ? LAB.find((l) => l.id === openId) ?? null : null
  if (open) return <LabDetail l={open} val={vals[open.id] ?? ''} onBack={() => setOpenId(null)}
    onVal={(v) => setVals((s) => ({ ...s, [open.id]: v }))} />

  const nq = norm(q.trim())
  const list = LAB.filter((l) => {
    const inCat = cat === 'Összes' || l.cat === cat
    const inQ = !nq || norm(`${l.name} ${l.abbr} ${l.kw ?? ''} ${l.organ ?? ''}`).includes(nq)
    return nq ? inQ : inCat && inQ
  })
  const cats = ['Összes', ...LAB_CATS]

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Labor Kisokos</h1>
      <p className="sub">{LAB.length} laborérték · referencia, értelmezés, APN-teendők</p>
      <input className="field" placeholder="Keresés: név, rövidítés, szerv…" value={q} onChange={(e) => setQ(e.target.value)} />
      {!nq && (
        <div className="sh-chips">
          {cats.map((c) => <button key={c} className={c === cat ? 'sh-chip on' : 'sh-chip'} onClick={() => setCat(c)}>{c}</button>)}
        </div>
      )}
      <div>
        {list.map((l) => (
          <button key={l.id} className="sh-row" onClick={() => setOpenId(l.id)}>
            <span className="sh-row-main">
              <span className="sh-row-name">{l.name} <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>({l.abbr})</span></span>
              <span className="sh-row-sub">{l.ref}{l.unit ? ` ${l.unit}` : ''}</span>
            </span>
            <span className="sh-chev">›</span>
          </button>
        ))}
        {list.length === 0 && <p className="sub">Nincs találat.</p>}
      </div>
    </>
  )
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (
    <div style={{ marginTop: 8 }}>
      <b style={{ fontSize: 13 }}>{title}</b>
      <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
    </div>
  )
}

function LabDetail({ l, val, onBack, onVal }: { l: LabItem; val: string; onBack: () => void; onVal: (v: string) => void }) {
  const st = interpret(l, val)
  const risk = statusRisk(st)
  const showLow = st === 'low' || st === 'crit-low'
  const showHigh = st === 'high' || st === 'crit-high'
  const extra = LAB_REF_EXTRA[l.id]
  const numeric = l.lo != null || l.hi != null

  return (
    <>
      <button className="sh-back" onClick={onBack}>‹ Vissza a listához</button>
      <h1 className="h1">{l.name}</h1>
      <p className="sub">{l.abbr} · Referencia: {l.ref}{l.unit ? ` ${l.unit}` : ''}</p>

      {numeric && (
        <div className="card">
          <b>Érték értelmezése</b>
          <div className="sh-numwrap" style={{ marginTop: 8 }}>
            <input className="field" type="number" inputMode="decimal" style={{ maxWidth: 160, marginBottom: 0 }}
              value={val} placeholder="mért érték" onChange={(e) => onVal(e.target.value)} />
            {l.unit && <span className="sh-unit">{l.unit}</span>}
          </div>
          {st !== 'unknown' && (
            <div className={`sh-result ${RISK_CLS[risk] ?? ''}`} style={{ marginTop: 10 }}>
              <div className="sh-res-band">{STATUS_LABEL[st]}</div>
              {(st === 'crit-low' || st === 'crit-high') && l.crit && <div className="sh-urgent" style={{ marginTop: 6 }}>⚠ {l.crit}</div>}
            </div>
          )}
        </div>
      )}

      <div className="card">
        {l.what && <p style={{ margin: '0 0 6px' }}>{l.what}</p>}
        {l.why && <p className="sub" style={{ margin: 0 }}><b>Miért mérjük:</b> {l.why}</p>}
        {l.organ && <p className="sub" style={{ margin: '4px 0 0' }}><b>Szerv:</b> {l.organ}</p>}
      </div>

      {(showLow || (!showHigh && !showLow)) && (l.lowCauses || l.lowSx || l.lowApn) && (
        <div className="card">
          <b>⬇ Alacsony érték</b>
          <List title="Okok" items={l.lowCauses} />
          <List title="Ritkább okok" items={l.lowRare} />
          <List title="Tünetek" items={l.lowSx} />
          <List title="APN teendők" items={l.lowApn} />
        </div>
      )}
      {(showHigh || (!showHigh && !showLow)) && (l.highCauses || l.highSx || l.highApn) && (
        <div className="card">
          <b>⬆ Magas érték</b>
          <List title="Okok" items={l.highCauses} />
          <List title="Ritkább okok" items={l.highRare} />
          <List title="Tünetek" items={l.highSx} />
          <List title="APN teendők" items={l.highApn} />
        </div>
      )}

      {l.signif && l.signif.length > 0 && (
        <div className="card"><b>💡 Klinikai jelentőség</b><List title="" items={l.signif} /></div>
      )}

      <div className="card">
        <List title="Kapcsolódó betegségek" items={l.diseases} />
        <List title="Kapcsolódó laborok" items={l.relLabs} />
        <List title="Érintett gyógyszerek" items={l.drugs} />
      </div>

      {extra && (extra.ped || extra.preg) && (
        <div className="card">
          <b>Speciális referenciák</b>
          {extra.ped && <p className="sub" style={{ margin: '6px 0 0' }}><b>Gyermek:</b> {extra.ped}</p>}
          {extra.preg && <p className="sub" style={{ margin: '4px 0 0' }}><b>Terhesség:</b> {extra.preg}</p>}
        </div>
      )}
      <p className="sh-disc">Döntéstámogató referencia; a konkrét értékek klinikai kontextusban értékelendők.</p>
    </>
  )
}
