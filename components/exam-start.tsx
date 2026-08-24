'use client'
import { useState } from 'react'
import { createExamSession } from '@/app/klinika/vizsgalat/actions'
import { ACUTE_COMPLAINTS, SYSTEMS } from '@/lib/exam/data'

function Hidden({ mode, exam_type, focus }: { mode: string; exam_type?: string; focus?: string }) {
  return (<>
    <input type="hidden" name="mode" value={mode} />
    {exam_type && <input type="hidden" name="exam_type" value={exam_type} />}
    {focus && <input type="hidden" name="focus" value={focus} />}
  </>)
}

export function ExamStart() {
  const [open, setOpen] = useState<'acute' | 'system' | null>(null)
  return (
    <>
      <form action={createExamSession}>
        <Hidden mode="clinical" exam_type="full" />
        <button className="card klink" type="submit" style={{ width: '100%', textAlign: 'left', border: '1px solid var(--line)' }}>
          <div className="klink-t">🩺 Teljes betegvizsgálat</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Komplex általános vizsgálat</div>
        </button>
      </form>

      <button className="card klink" onClick={() => setOpen(open === 'acute' ? null : 'acute')} style={{ width: '100%', textAlign: 'left', border: '1px solid var(--line)' }}>
        <div className="klink-t">🚨 Akut panasz alapú vizsgálat</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Vezető panaszból kiinduló célzott vizsgálat</div>
      </button>
      {open === 'acute' && (
        <div className="card" style={{ marginTop: -6 }}>
          <div className="sh-chips">
            {ACUTE_COMPLAINTS.map((c) => (
              <form key={c} action={createExamSession} style={{ display: 'inline' }}>
                <Hidden mode="clinical" exam_type="acute" focus={c} />
                <button className="sh-chip" type="submit">{c}</button>
              </form>
            ))}
          </div>
        </div>
      )}

      <button className="card klink" onClick={() => setOpen(open === 'system' ? null : 'system')} style={{ width: '100%', textAlign: 'left', border: '1px solid var(--line)' }}>
        <div className="klink-t">❤️ Szervrendszer szerinti vizsgálat</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Cardiovascularis, pulmonológiai, neurológiai, abdominalis…</div>
      </button>
      {open === 'system' && (
        <div className="card" style={{ marginTop: -6 }}>
          <div className="sh-chips">
            {SYSTEMS.map((s) => (
              <form key={s.id} action={createExamSession} style={{ display: 'inline' }}>
                <Hidden mode="clinical" exam_type="system" focus={s.label} />
                <button className="sh-chip" type="submit">{s.icon} {s.label}</button>
              </form>
            ))}
          </div>
        </div>
      )}

      <form action={createExamSession}>
        <Hidden mode="education" />
        <button className="card klink" type="submit" style={{ width: '100%', textAlign: 'left', border: '1px solid #d8e6df', background: 'var(--brand-tint)' }}>
          <div className="klink-t">🎓 Oktatási / gyakorló mód</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Vezetett propedeutikai vizsgálat — valós betegadat nélkül</div>
        </button>
      </form>
    </>
  )
}
