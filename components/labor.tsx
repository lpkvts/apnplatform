'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LAB, LAB_CATS, LAB_REF_EXTRA, type LabItem } from '@/lib/labor/data'
import { interpret, STATUS_LABEL, statusRisk } from '@/lib/labor/engine'
import { PANELS, PATTERNS, evaluatePanel, type Pattern } from '@/lib/labor/patterns'

interface Gl { id: string; title: string; summary: string | null }
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const RISK_CLS: Record<string, string> = { low: 'r-low', mid: 'r-mid', high: 'r-high', crit: 'r-crit' }
const SEV_CLS: Record<string, string> = { info: 'sev-low', 'figyelendő': 'sev-mid', 'sürgős': 'sev-crit' }

export function Labor({ guidelines = [], initialOpen }: { guidelines?: Gl[]; initialOpen?: string }) {
  const [mode, setMode] = useState<'kisokos' | 'panel'>('kisokos')
  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Labor</h1>
      <div className="ekg-modebar">
        <button className={`seg ${mode === 'kisokos' ? 'on' : ''}`} onClick={() => setMode('kisokos')}>Kisokos</button>
        <button className={`seg ${mode === 'panel' ? 'on' : ''}`} onClick={() => setMode('panel')}>Panel értékelés</button>
      </div>
      {mode === 'kisokos' ? <Kisokos initialOpen={initialOpen} /> : <Panel guidelines={guidelines} />}
    </>
  )
}

/* ---------- Panel értékelés ---------- */
function Panel({ guidelines }: { guidelines: Gl[] }) {
  const [ids, setIds] = useState<string[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [addQ, setAddQ] = useState('')

  const addLab = (id: string) => { if (!ids.includes(id)) setIds((s) => [...s, id]); setAddQ('') }
  const removeLab = (id: string) => { setIds((s) => s.filter((x) => x !== id)); setValues((v) => { const n = { ...v }; delete n[id]; return n }) }
  const usePanel = (pids: string[]) => setIds((s) => [...new Set([...s, ...pids.filter((p) => LAB.some((l) => l.id === p))])])

  const nq = norm(addQ.trim())
  const addResults = nq
    ? LAB.filter((l) => !ids.includes(l.id) && norm(`${l.name} ${l.abbr} ${l.kw ?? ''}`).includes(nq)).slice(0, 6)
    : []

  const res = evaluatePanel(values)
  const entered = ids.map((id) => LAB.find((l) => l.id === id)).filter((l): l is LabItem => !!l)
  const deviations = Object.values(res.dirs).filter((d) => d === 'low' || d === 'high').length

  const findGl = (kws?: string[]) => {
    if (!kws) return null
    return guidelines.find((g) => { const t = norm(`${g.title} ${g.summary ?? ''}`); return kws.some((k) => t.includes(norm(k))) }) ?? null
  }

  return (
    <>
      <p className="sub">Írj be több laborértéket — a rendszer felismeri a lehetséges mintázatokat. Döntéstámogatás, nem diagnózis.</p>

      <div className="sec-h" style={{ marginTop: 4 }}><span className="sec-t">Gyors panel</span></div>
      <div className="sh-chips">
        {PANELS.map((p) => <button key={p.name} className="sh-chip" onClick={() => usePanel(p.ids)}>+ {p.name}</button>)}
      </div>

      <input className="field" placeholder="Labor hozzáadása név szerint…" value={addQ} onChange={(e) => setAddQ(e.target.value)} />
      {addResults.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {addResults.map((l) => (
            <button key={l.id} className="sh-row" onClick={() => addLab(l.id)}>
              <span className="sh-row-main"><span className="sh-row-name">{l.name} <span style={{ color: 'var(--brand-3)', fontWeight: 400 }}>({l.abbr})</span></span>
                <span className="sh-row-sub">{l.ref}{l.unit ? ` ${l.unit}` : ''}</span></span>
              <span className="sh-chev">+</span>
            </button>
          ))}
        </div>
      )}

      {entered.length === 0 ? (
        <div className="card"><p style={{ margin: 0 }}>Válassz egy gyors panelt, vagy adj hozzá laborokat, majd írd be az értékeket.</p></div>
      ) : (
        <div className="card">
          <b>Beírt értékek</b>
          {entered.map((l) => {
            const st = interpret(l, values[l.id] ?? '')
            const risk = statusRisk(st)
            return (
              <div className="as-vitrow" key={l.id} style={{ marginTop: 10 }}>
                <span className="as-vl">{l.abbr} <span style={{ color: 'var(--brand-3)', fontSize: 12 }}>{l.ref}</span></span>
                <input className="as-vin" type="number" inputMode="decimal" placeholder="érték"
                  value={values[l.id] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [l.id]: e.target.value }))} />
                <span className="as-vu">{l.unit}</span>
                {st !== 'unknown' && <span className={`ekg-sev ${risk === 'low' ? 'sev-low' : risk === 'crit' ? 'sev-crit' : 'sev-mid'}`}>{STATUS_LABEL[st]}</span>}
                <button className="sh-back" style={{ padding: 0, marginLeft: 4 }} onClick={() => removeLab(l.id)}>✕</button>
              </div>
            )
          })}
        </div>
      )}

      {deviations + res.crit.length > 0 && (
        <>
          <div className="card">
            <b>Összkép</b>
            <p style={{ margin: '6px 0 0' }}>{deviations} eltérés{res.crit.length > 0 ? ` · ebből ${res.crit.length} kritikus` : ''} a beírt értékek között.</p>
          </div>

          {res.crit.length > 0 && (
            <div className="sh-urgent">⚠ Kritikus érték: {res.crit.map((c) => c.name).join(', ')} — sürgős orvosi értékelés indokolt.</div>
          )}

          {res.patterns.length > 0 ? (
            res.patterns.map((p) => {
              const gl = findGl(p.guidelineKw)
              return (
                <div className="card" key={p.id}>
                  <div className="row" style={{ border: 'none', paddingBottom: 6 }}>
                    <b>{p.name}</b>
                    <span className={`ekg-sev ${SEV_CLS[p.sev] ?? ''}`}>{p.sev}</span>
                  </div>
                  <p style={{ margin: '0 0 8px' }}>{p.summary}</p>
                  <b style={{ fontSize: 13 }}>APN fókuszpontok</b>
                  <ul style={{ margin: '4px 0 8px', paddingLeft: 18 }}>{p.apnFocus.map((x, i) => <li key={i}>{x}</li>)}</ul>
                  <b style={{ fontSize: 13 }}>További megfontolható vizsgálatok</b>
                  <ul style={{ margin: '4px 0 8px', paddingLeft: 18 }}>{p.further.map((x, i) => <li key={i}>{x}</li>)}</ul>
                  <div className="kb-relnote" style={{ margin: '8px 0' }}>🩺 Mikor orvos: {p.consult}</div>
                  {(gl || (p.scoreIds && p.scoreIds.length > 0)) && (
                    <div className="cop-acts">
                      {gl && <Link className="btn ghost sm" href={`/klinika/tudastar/${gl.id}`}>📄 {gl.title}</Link>}
                      {(p.scoreIds ?? []).map((sid) => <Link key={sid} className="btn ghost sm" href={`/klinika/tesztek?open=${sid}`}>🧮 Score</Link>)}
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="card"><p style={{ margin: 0 }}>Az eltérésekhez nem társult ismert együttes mintázat. Értékeld az egyes eltéréseket a Kisokosban.</p></div>
          )}
        </>
      )}
      <p className="sh-disc">Döntéstámogató mintázat-értelmezés, nem automatikus diagnózis; a konkrét értékek a teljes klinikai kép alapján értékelendők.</p>
    </>
  )
}

/* ---------- Kisokos (egyértékes referencia) ---------- */
function Kisokos({ initialOpen }: { initialOpen?: string }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Összes')
  const [openId, setOpenId] = useState<string | null>(initialOpen ?? null)
  const [vals, setVals] = useState<Record<string, string>>({})

  const open = openId ? LAB.find((l) => l.id === openId) ?? null : null
  if (open) return <LabDetail l={open} val={vals[open.id] ?? ''} onBack={() => setOpenId(null)} onVal={(v) => setVals((s) => ({ ...s, [open.id]: v }))} />

  const nq = norm(q.trim())
  const list = LAB.filter((l) => {
    const inCat = cat === 'Összes' || l.cat === cat
    const inQ = !nq || norm(`${l.name} ${l.abbr} ${l.kw ?? ''} ${l.organ ?? ''}`).includes(nq)
    return nq ? inQ : inCat && inQ
  })
  const cats = ['Összes', ...LAB_CATS]
  return (
    <>
      <p className="sub">{LAB.length} laborérték · referencia, értelmezés, APN-teendők</p>
      <input className="field" placeholder="Keresés: név, rövidítés, szerv…" value={q} onChange={(e) => setQ(e.target.value)} />
      {!nq && <div className="sh-chips">{cats.map((c) => <button key={c} className={c === cat ? 'sh-chip on' : 'sh-chip'} onClick={() => setCat(c)}>{c}</button>)}</div>}
      <div>
        {list.map((l) => (
          <button key={l.id} className="sh-row" onClick={() => setOpenId(l.id)}>
            <span className="sh-row-main"><span className="sh-row-name">{l.name} <span style={{ color: 'var(--brand-3)', fontWeight: 400 }}>({l.abbr})</span></span>
              <span className="sh-row-sub">{l.ref}{l.unit ? ` ${l.unit}` : ''}</span></span>
            <span className="sh-chev">›</span>
          </button>
        ))}
        {list.length === 0 && <p className="sub">Nincs találat.</p>}
      </div>
    </>
  )
}

function LList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null
  return (<div style={{ marginTop: 8 }}><b style={{ fontSize: 13 }}>{title}</b><ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>)
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
      <h2 className="h1" style={{ fontSize: 20 }}>{l.name}</h2>
      <p className="sub">{l.abbr} · Referencia: {l.ref}{l.unit ? ` ${l.unit}` : ''}</p>
      {numeric && (
        <div className="card">
          <b>Érték értelmezése</b>
          <div className="sh-numwrap" style={{ marginTop: 8 }}>
            <input className="field" type="number" inputMode="decimal" style={{ maxWidth: 160, marginBottom: 0 }} value={val} placeholder="mért érték" onChange={(e) => onVal(e.target.value)} />
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
        <div className="card"><b>⬇ Alacsony érték</b><LList title="Okok" items={l.lowCauses} /><LList title="Ritkább okok" items={l.lowRare} /><LList title="Tünetek" items={l.lowSx} /><LList title="APN teendők" items={l.lowApn} /></div>
      )}
      {(showHigh || (!showHigh && !showLow)) && (l.highCauses || l.highSx || l.highApn) && (
        <div className="card"><b>⬆ Magas érték</b><LList title="Okok" items={l.highCauses} /><LList title="Ritkább okok" items={l.highRare} /><LList title="Tünetek" items={l.highSx} /><LList title="APN teendők" items={l.highApn} /></div>
      )}
      {l.signif && l.signif.length > 0 && <div className="card"><b>💡 Klinikai jelentőség</b><LList title="" items={l.signif} /></div>}
      <div className="card"><LList title="Kapcsolódó betegségek" items={l.diseases} /><LList title="Kapcsolódó laborok" items={l.relLabs} /><LList title="Érintett gyógyszerek" items={l.drugs} /></div>
      {extra && (extra.ped || extra.preg) && (
        <div className="card"><b>Speciális referenciák</b>{extra.ped && <p className="sub" style={{ margin: '6px 0 0' }}><b>Gyermek:</b> {extra.ped}</p>}{extra.preg && <p className="sub" style={{ margin: '4px 0 0' }}><b>Terhesség:</b> {extra.preg}</p>}</div>
      )}
      <p className="sh-disc">Döntéstámogató referencia; a konkrét értékek klinikai kontextusban értékelendők.</p>
    </>
  )
}
