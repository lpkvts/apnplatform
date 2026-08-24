import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'
export const dynamic = 'force-dynamic'

interface Dis { id: string; name: string; specialty: string | null; status: string; validation_status: string | null; version: string | null; review_on: string | null; expires_on: string | null }
interface Src { id: string; name: string; status: string; next_review: string | null }

function DiseaseRow({ d, tag }: { d: Dis; tag?: { text: string; color: string } }) {
  return (<Link className="sh-row" href={`/cms/betegsegek/${d.id}`}><span className="sh-row-main"><span className="sh-row-name">{d.name}</span><span className="sh-row-sub">{[d.specialty, d.version ? `v${d.version}` : null, d.review_on ? `felülvizsgálat: ${d.review_on}` : null].filter(Boolean).join(' · ')}</span></span>{tag ? <span className="ekg-sev" style={{ background: tag.color, color: '#fff' }}>{tag.text}</span> : <span className="sh-chev">›</span>}</Link>)
}

export default async function TartalomFigyelo() {
  const { role } = await currentRole()
  if (!isStaff(role)) return <><h1 className="h1">Tartalomfigyelő</h1><div className="card">Ehhez szerkesztő/lektor/admin jog szükséges.</div></>
  const supabase = await createClient()
  const today = new Date().toISOString().slice(0, 10)
  const soon = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  const [disRes, srcRes] = await Promise.all([
    supabase.from('diseases').select('id, name, specialty, status, validation_status, version, review_on, expires_on').order('name').returns<Dis[]>(),
    supabase.from('clinical_sources').select('id, name, status, next_review').returns<Src[]>(),
  ])
  const diseases = disRes.data ?? []; const sources = srcRes.data ?? []

  const expired = diseases.filter((d) => d.status === 'expired' || (d.expires_on && d.expires_on < today) || d.validation_status === 'update_required')
  const dueSoon = diseases.filter((d) => !expired.includes(d) && d.review_on && d.review_on <= soon)
  const noReview = diseases.filter((d) => !expired.includes(d) && !dueSoon.includes(d) && !d.review_on && d.status === 'published')
  const ok = diseases.filter((d) => !expired.includes(d) && !dueSoon.includes(d) && !noReview.includes(d))
  const srcDue = sources.filter((s) => s.status !== 'archived' && s.next_review && s.next_review <= soon)

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Tartalomfigyelő</h1>
      <p className="sub">A klinikai tartalmak felülvizsgálati állapota egy helyen — mi jár le, mi esedékes, mi rendben.</p>

      <div className="stat-grid">
        <div className="stat-card" style={{ borderColor: '#fecaca' }}><div className="stat-num" style={{ color: '#b91c1c' }}>{expired.length}</div><div className="stat-lbl">Lejárt / frissítendő</div></div>
        <div className="stat-card" style={{ borderColor: '#fed7aa' }}><div className="stat-num" style={{ color: '#c2410c' }}>{dueSoon.length}</div><div className="stat-lbl">Hamarosan esedékes</div></div>
        <div className="stat-card"><div className="stat-num">{noReview.length}</div><div className="stat-lbl">Nincs felülvizsgálati dátum</div></div>
        <div className="stat-card"><div className="stat-num" style={{ color: '#15803d' }}>{ok.length}</div><div className="stat-lbl">Rendben</div></div>
      </div>

      {expired.length > 0 && (<><div className="sec-h"><span className="sec-t">🔴 Lejárt / frissítendő</span></div>{expired.map((d) => <DiseaseRow key={d.id} d={d} tag={{ text: 'lejárt', color: '#b91c1c' }} />)}</>)}
      {dueSoon.length > 0 && (<><div className="sec-h"><span className="sec-t">🟠 Hamarosan esedékes (30 nap)</span></div>{dueSoon.map((d) => <DiseaseRow key={d.id} d={d} tag={{ text: 'esedékes', color: '#c2410c' }} />)}</>)}
      {noReview.length > 0 && (<><div className="sec-h"><span className="sec-t">⚪ Nincs felülvizsgálati dátum</span></div>{noReview.map((d) => <DiseaseRow key={d.id} d={d} />)}</>)}

      <div className="sec-h"><span className="sec-t">📚 Források felülvizsgálata</span></div>
      {srcDue.length === 0 ? <p className="sub">Nincs hamarosan esedékes forrás. <Link href="/cms/forrasok">Források kezelése ›</Link></p> : srcDue.map((s) => (<Link key={s.id} className="sh-row" href="/cms/forrasok"><span className="sh-row-main"><span className="sh-row-name">{s.name}</span><span className="sh-row-sub">Felülvizsgálat: {s.next_review}</span></span><span className="ekg-sev" style={{ background: (s.next_review && s.next_review < today) ? '#b91c1c' : '#c2410c', color: '#fff' }}>{(s.next_review && s.next_review < today) ? 'lejárt' : 'esedékes'}</span></Link>))}
    </>
  )
}
