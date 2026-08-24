import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EXAM_SECTIONS } from '@/lib/exam/data'
import { ExamAnamnesisForm } from '@/components/exam-anamnesis-form'
import { ExamVitalsForm } from '@/components/exam-vitals-form'
import { ExamGeneralForm } from '@/components/exam-general-form'
import { setExamStatus } from '../actions'
export const dynamic = 'force-dynamic'

const MODE_BADGE: Record<string, string> = { clinical: '🩺 Klinikai', education: '🎓 Oktatási', practice: '🧠 Gyakorló' }
const TYPE_BADGE: Record<string, string> = { full: 'Teljes', acute: 'Akut panasz', system: 'Szervrendszer' }
interface Session { id: string; title: string; mode: string; exam_type: string | null; focus: string | null; status: string; anamnesis: Record<string, unknown>; vitals: Record<string, string>[]; general_exam: Record<string, unknown> }

export default async function VizsgalatDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ sec?: string }> }) {
  const { id } = await params
  const { sec = 'anamnezis' } = await searchParams
  const supabase = await createClient()
  const { data } = await supabase.from('exam_sessions').select('id, title, mode, exam_type, focus, status, anamnesis, vitals, general_exam').eq('id', id).maybeSingle<Session>()
  if (!data) notFound()

  return (
    <>
      <Link className="sh-back" href="/klinika/vizsgalat">‹ Betegvizsgálat</Link>
      <h1 className="h1">{data.title}</h1>
      <div className="sh-chips" style={{ marginTop: 2 }}>
        <span className="sh-chip">{MODE_BADGE[data.mode] ?? data.mode}</span>
        {data.exam_type && <span className="sh-chip">{TYPE_BADGE[data.exam_type] ?? data.exam_type}</span>}
        {data.status === 'completed' && <span className="cms-badge cs-completed">Lezárt</span>}
      </div>

      <div className="sh-chips" style={{ marginTop: 10 }}>
        {EXAM_SECTIONS.map((s) => (
          s.ready
            ? <Link key={s.id} href={`/klinika/vizsgalat/${id}?sec=${s.id}`} className={`sh-chip ${sec === s.id ? 'on' : ''}`}>{s.icon} {s.label}</Link>
            : <span key={s.id} className="sh-chip" style={{ opacity: 0.5 }}>{s.icon} {s.label}</span>
        ))}
      </div>

      {sec === 'anamnezis' && (
        <ExamAnamnesisForm id={id} initial={data.anamnesis ?? {}} education={data.mode !== 'clinical'} />
      )}
      {sec === 'vitalis' && (
        <ExamVitalsForm id={id} initial={data.vitals ?? []} />
      )}
      {sec === 'altalanos' && (
        <ExamGeneralForm id={id} initial={data.general_exam ?? {}} />
      )}

      <div className="sec-h"><span className="sec-t">Állapot</span></div>
      <div className="cop-acts">
        {data.status !== 'completed' && <form action={setExamStatus} style={{ display: 'inline' }}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value="completed" /><button className="btn ghost sm" type="submit">Lezárás</button></form>}
        {data.status === 'completed' && <form action={setExamStatus} style={{ display: 'inline' }}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value="active" /><button className="btn ghost sm" type="submit">Újranyitás</button></form>}
        <form action={setExamStatus} style={{ display: 'inline' }}><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value="archived" /><button className="btn ghost sm" type="submit">Archiválás</button></form>
      </div>
      <p className="sub" style={{ marginTop: 10, fontSize: 12 }}>A további szekciók (vitálisok, fizikális vizsgálat, red flags, összegzés, dokumentáció) a következő fejlesztési fázisokban épülnek be.</p>
    </>
  )
}
