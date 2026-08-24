'use client'
import { useState } from 'react'
import { LAB, type LabItem } from '@/lib/labor/data'
import { addCaseLab } from '@/app/klinika/esetek/actions'
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
export function CaseLabAdd({ caseId }: { caseId: string }) {
  const [q, setQ] = useState(''); const [sel, setSel] = useState<LabItem | null>(null)
  const nq = norm(q.trim()); const list = nq ? LAB.filter((l) => norm(`${l.name} ${l.abbr} ${l.kw ?? ''}`).includes(nq)).slice(0, 6) : []
  if (sel) return (<form action={addCaseLab} onSubmit={() => setTimeout(() => { setSel(null); setQ('') }, 0)}><input type="hidden" name="case_id" value={caseId} /><input type="hidden" name="lab_id" value={sel.id} /><div className="as-vitrow"><span className="as-vl">{sel.name} <span style={{ color: 'var(--brand-3)', fontSize: 12 }}>{sel.ref}</span></span><input className="as-vin" name="value" type="text" inputMode="decimal" placeholder="érték" autoFocus /><span className="as-vu">{sel.unit}</span><button className="btn sm" type="submit">Hozzáad</button><button className="sh-back" type="button" style={{ padding: 0 }} onClick={() => setSel(null)}>✕</button></div></form>)
  return (<><input className="field" placeholder="Labor keresése az esethez…" value={q} onChange={(e) => setQ(e.target.value)} />{list.map((l) => (<button key={l.id} className="sh-row" onClick={() => { setSel(l); setQ('') }}><span className="sh-row-main"><span className="sh-row-name">{l.name} ({l.abbr})</span><span className="sh-row-sub">{l.ref}{l.unit ? ` ${l.unit}` : ''}</span></span><span className="sh-chev">+</span></button>))}</>)
}
