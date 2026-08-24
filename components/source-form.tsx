'use client'
import { useActionState, useState } from 'react'
import { saveSource, type SourceState } from '@/app/cms/forrasok/actions'
export interface SourceData { id?: string; name?: string; type?: string | null; organization?: string | null; url?: string | null; version?: string | null; publication_date?: string | null; last_verified?: string | null; next_review?: string | null; status?: string | null; notes?: string | null }
const TYPES = ['guideline', 'standard', 'textbook', 'study', 'local', 'other']
const STATUS = [['current', 'Aktuális'], ['superseded', 'Meghaladott'], ['archived', 'Archivált']]
export function SourceForm({ d, onDone }: { d?: SourceData; onDone?: () => void }) {
  const [state, action, pending] = useActionState<SourceState, FormData>(saveSource, {})
  const [done, setDone] = useState(false)
  if (state.saved && !done) { setDone(true); onDone?.() }
  return (
    <form action={action} className="card">
      {d?.id && <input type="hidden" name="id" value={d.id} />}
      <div className="as-lbl">Forrás neve *</div>
      <input className="field" name="name" defaultValue={d?.name ?? ''} required placeholder="pl. ESC Guidelines for AF" />
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}><div className="as-lbl">Típus</div><select className="field" name="type" defaultValue={d?.type ?? ''}><option value="">—</option>{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
        <div style={{ flex: 1 }}><div className="as-lbl">Állapot</div><select className="field" name="status" defaultValue={d?.status ?? 'current'}>{STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      </div>
      <div className="as-lbl">Kibocsátó szervezet</div>
      <input className="field" name="organization" defaultValue={d?.organization ?? ''} placeholder="pl. ESC, NICE, EFLM" />
      <div className="as-lbl">URL</div>
      <input className="field" name="url" type="url" defaultValue={d?.url ?? ''} />
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}><div className="as-lbl">Verzió</div><input className="field" name="version" defaultValue={d?.version ?? ''} /></div>
        <div style={{ flex: 1 }}><div className="as-lbl">Megjelenés</div><input className="field" name="publication_date" type="date" defaultValue={d?.publication_date ?? ''} /></div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}><div className="as-lbl">Utolsó ellenőrzés</div><input className="field" name="last_verified" type="date" defaultValue={d?.last_verified ?? ''} /></div>
        <div style={{ flex: 1 }}><div className="as-lbl">Következő felülvizsgálat</div><input className="field" name="next_review" type="date" defaultValue={d?.next_review ?? ''} /></div>
      </div>
      <div className="as-lbl">Megjegyzés</div>
      <textarea className="as-ta" name="notes" rows={2} defaultValue={d?.notes ?? ''} />
      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>{pending ? 'Mentés…' : 'Mentés'}</button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
