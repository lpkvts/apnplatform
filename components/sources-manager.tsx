'use client'
import { useState } from 'react'
import { SourceForm, type SourceData } from '@/components/source-form'
import { deleteSource } from '@/app/cms/forrasok/actions'
const TYPE_HU: Record<string, string> = { guideline: 'Irányelv', standard: 'Standard', textbook: 'Tankönyv', study: 'Tanulmány', local: 'Helyi', other: 'Egyéb' }
const STATUS_HU: Record<string, string> = { current: 'Aktuális', superseded: 'Meghaladott', archived: 'Archivált' }
export function SourcesManager({ items, today }: { items: SourceData[]; today: string }) {
  const [openNew, setOpenNew] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const soon = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  return (
    <>
      <div className="row" style={{ border: 'none' }}>
        <b>{items.length} forrás</b>
        <button className="btn sm" onClick={() => { setOpenNew((v) => !v); setEditId(null) }}>{openNew ? '✕ Mégse' : '+ Új forrás'}</button>
      </div>
      {openNew && <SourceForm onDone={() => setOpenNew(false)} />}
      {items.map((s) => {
        const due = s.next_review && s.next_review <= soon
        const overdue = s.next_review && s.next_review < today
        if (editId === s.id) return <SourceForm key={s.id} d={s} onDone={() => setEditId(null)} />
        return (
          <div className="card" key={s.id} style={{ borderColor: overdue ? '#fecaca' : undefined }}>
            <div className="row" style={{ border: 'none', padding: 0 }}>
              <b>{s.name}</b>
              <span className={`cms-badge ${s.status === 'current' ? 's-published' : 's-expired'}`}>{STATUS_HU[s.status ?? ''] ?? s.status}</span>
            </div>
            <div className="sub" style={{ margin: '2px 0 0' }}>{[s.type ? TYPE_HU[s.type] ?? s.type : null, s.organization, s.version].filter(Boolean).join(' · ')}</div>
            {s.next_review && <div className="sub" style={{ margin: '4px 0 0', color: overdue ? '#b91c1c' : due ? '#c2410c' : undefined }}>📅 Felülvizsgálat: {s.next_review}{overdue ? ' — lejárt' : due ? ' — hamarosan' : ''}</div>}
            <div className="cop-acts" style={{ marginTop: 8 }}>
              {s.url && <a className="btn ghost sm" href={s.url} target="_blank" rel="noopener">Megnyitás</a>}
              <button className="btn ghost sm" onClick={() => { setEditId(s.id ?? null); setOpenNew(false) }}>Szerkesztés</button>
              <form action={deleteSource} style={{ display: 'inline' }}><input type="hidden" name="id" value={s.id} /><button className="btn ghost sm" type="submit">Törlés</button></form>
            </div>
          </div>
        )
      })}
      {items.length === 0 && !openNew && <p className="sub">Még nincs rögzített forrás.</p>}
    </>
  )
}
