'use client'
import { useActionState, useMemo, useState } from 'react'
import { saveSystems, type ExamState } from '@/app/klinika/vizsgalat/actions'
import { SYSTEM_EXAMS, RED_FLAG_FINDINGS, FINDING_HINTS, type ExamGroup } from '@/lib/exam/data'

type SysData = Record<string, Record<string, string | string[]>>

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" className={`sh-chip ${on ? 'on' : ''}`} onClick={onClick}>{children}</button>
}

export function ExamSystemsForm({ id, initial, focusSystem }: { id: string; initial: SysData; focusSystem?: string }) {
  const [state, action, pending] = useActionState<ExamState, FormData>(saveSystems, {})
  const [data, setData] = useState<SysData>(initial && typeof initial === 'object' ? initial : {})
  const firstSys = focusSystem && SYSTEM_EXAMS.some((x) => x.label === focusSystem || x.id === focusSystem)
    ? (SYSTEM_EXAMS.find((x) => x.label === focusSystem || x.id === focusSystem)!.id)
    : SYSTEM_EXAMS[0].id
  const [active, setActive] = useState<string>(firstSys)
  const sys = SYSTEM_EXAMS.find((x) => x.id === active)!

  const get = (g: ExamGroup): string | string[] => data[active]?.[g.id] ?? (g.type === 'multi' ? [] : '')
  const setSingle = (gid: string, v: string) => setData((d) => ({ ...d, [active]: { ...(d[active] ?? {}), [gid]: v } }))
  const setText = setSingle
  const toggleMulti = (gid: string, v: string) => setData((d) => {
    const cur = new Set((d[active]?.[gid] as string[]) ?? [])
    cur.has(v) ? cur.delete(v) : cur.add(v)
    return { ...d, [active]: { ...(d[active] ?? {}), [gid]: [...cur] } }
  })

  // Red flag-ek + lelet-utalások az összes rendszer összes választásából
  const { redFlags, hints } = useMemo(() => {
    const chosen: string[] = []
    for (const sid of Object.keys(data)) for (const gid of Object.keys(data[sid] ?? {})) {
      const val = data[sid][gid]
      if (Array.isArray(val)) chosen.push(...val); else if (val) chosen.push(val)
    }
    const rf = [...new Set(chosen.filter((c) => RED_FLAG_FINDINGS.includes(c)))]
    const hs: { finding: string; diseases: string[] }[] = []
    for (const c of new Set(chosen)) if (FINDING_HINTS[c]) hs.push({ finding: c, diseases: FINDING_HINTS[c] })
    return { redFlags: rf, hints: hs }
  }, [data])

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="systems" value={JSON.stringify(data)} />
      <input type="hidden" name="red_flags" value={JSON.stringify(redFlags)} />

      <div className="sh-chips">
        {SYSTEM_EXAMS.map((sd) => <Chip key={sd.id} on={active === sd.id} onClick={() => setActive(sd.id)}>{sd.icon} {sd.label}</Chip>)}
      </div>

      {sys.order && <div className="safety-note">Vizsgálati sorrend: {sys.order}</div>}

      {sys.groups.map((g) => (
        <div key={g.id}>
          <div className="sec-h"><span className="sec-t">{g.label}</span></div>
          {g.type === 'text' ? (
            <input className="field" placeholder={g.ph ?? ''} value={(get(g) as string) || ''} onChange={(e) => setText(g.id, e.target.value)} />
          ) : g.type === 'single' ? (
            <div className="sh-chips">{g.items!.map((it) => <Chip key={it} on={get(g) === it} onClick={() => setSingle(g.id, get(g) === it ? '' : it)}>{it}</Chip>)}</div>
          ) : (
            <div className="sh-chips">{g.items!.map((it) => <Chip key={it} on={(get(g) as string[]).includes(it)} onClick={() => toggleMulti(g.id, it)}>{it}</Chip>)}</div>
          )}
        </div>
      ))}

      {hints.length > 0 && (
        <div className="card" style={{ marginTop: 12 }}>
          <b>🔗 Kapcsolódó klinikai tartalmak</b>
          <p className="sub" style={{ margin: '4px 0 8px' }}>Navigációs/oktatási utalás — nem diagnózis.</p>
          {hints.map((h) => (
            <div key={h.finding} className="sub" style={{ margin: '2px 0' }}><b>{h.finding}:</b> {h.diseases.join(', ')}</div>
          ))}
          <a className="btn ghost sm" href="/betegsegtar" style={{ marginTop: 8 }}>Betegségtár megnyitása</a>
        </div>
      )}

      {redFlags.length > 0 && (
        <div className="sh-urgent" style={{ marginTop: 12 }}>
          🚨 Figyelem: a rögzített leletek ({redFlags.join(', ')}) sürgős klinikai értékelést tehetnek szükségessé.
          <div style={{ marginTop: 8 }}><a className="btn ghost sm" href="/betegsegtar/akut">Akut állapotok</a></div>
        </div>
      )}

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%', marginTop: 12 }}>{pending ? 'Mentés…' : 'Szervrendszeri vizsgálat mentése'}</button>
      {state.saved && <p className="form-ok">Mentve ✓</p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
