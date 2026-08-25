import Link from 'next/link'
import { EXAM_SYSTEMS, elementsBySystem } from '@/lib/vizsgalat/checklist'
import { ExamSearch } from '@/components/exam-search'
export const dynamic = 'force-dynamic'

export default function VizsgalatPage() {
  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Betegvizsgálat</h1>
      <p className="sub">Strukturált vizsgálati áttekintő szervrendszerenként. Tanulási és áttekintési segédlet — nem klinikai protokoll.</p>

      <ExamSearch />

      <Link className="btn" href="/klinika/vizsgalat/munkamenet" style={{ width: '100%', padding: 14, margin: '4px 0 8px' }}>
        🩺 Vizsgálati munkamenet indítása (adott betegnél)
      </Link>

      <div className="sec-h"><span className="sec-t">Szervrendszerek</span></div>
      {EXAM_SYSTEMS.map((s) => {
        const n = elementsBySystem(s.id).length
        return (
          <Link key={s.id} className="card klink" href={`/klinika/vizsgalat/rendszer/${s.id}`}>
            <div className="row" style={{ border: 'none', padding: 0 }}>
              <span className="klink-t">{s.icon} {s.name}</span>
              <span className="sh-chev">›</span>
            </div>
            <div className="sub" style={{ margin: '4px 0 0' }}>{n} vizsgálati elem</div>
          </Link>
        )
      })}
    </>
  )
}
