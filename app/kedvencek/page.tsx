import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getFavoritesByType } from '@/lib/favorites'
import { LAB } from '@/lib/labor/data'
import { TESTS } from '@/lib/scores/data'
import { ECG } from '@/lib/ekg/data'
export const dynamic = 'force-dynamic'

function Row({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (<Link className="sh-row" href={href}><span className="sh-row-main"><span className="sh-row-name">★ {title}</span>{sub && <span className="sh-row-sub">{sub}</span>}</span><span className="sh-chev">›</span></Link>)
}

export default async function KedvencekPage() {
  const supabase = await createClient()
  const [{ data: { user } }, labIds, scoreIds, ekgIds, diseaseIds] = await Promise.all([
    supabase.auth.getUser(),
    getFavoritesByType('lab'), getFavoritesByType('score'), getFavoritesByType('ekg'), getFavoritesByType('disease'),
  ])
  if (!user) return (<><Link className="sh-back" href="/klinika">‹ Klinikai mag</Link><h1 className="h1">Kedvenceim</h1><div className="card">Jelentkezz be a kedvenceid megtekintéséhez.</div></>)

  let diseases: { id: string; name: string; specialty: string | null; is_stub: boolean }[] = []
  if (diseaseIds.length) {
    const { data } = await supabase.from('diseases').select('id, name, specialty, is_stub').in('id', diseaseIds).returns<typeof diseases>()
    diseases = data ?? []
  }
  const labs = LAB.filter((l) => labIds.includes(l.id))
  const scores = TESTS.filter((t) => scoreIds.includes(t.id))
  const ekgs = ECG.filter((e) => ekgIds.includes(e.id))
  const total = diseases.length + labs.length + scores.length + ekgs.length

  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Kedvenceim</h1>
      <p className="sub">A csillaggal megjelölt tartalmaid gyors elérése. Bárhol a ☆-ra koppintva jelölhetsz kedvencet.</p>

      {total === 0 && (
        <div className="card"><p style={{ margin: 0 }}>Még nincs kedvenced.</p><p className="sub" style={{ marginBottom: 0 }}>A betegségeknél, laboroknál, score-oknál és EKG-knál a ☆ ikonra koppintva adhatsz hozzá.</p></div>
      )}

      {diseases.length > 0 && (<><div className="sec-h"><span className="sec-t">🩺 Betegségek</span></div>{diseases.map((d) => <Row key={d.id} href={`/betegsegtar/${d.id}`} title={d.name} sub={`${d.specialty ?? ''}${d.is_stub ? ' · fejlesztés alatt' : ''}`} />)}</>)}
      {labs.length > 0 && (<><div className="sec-h"><span className="sec-t">🧪 Laborok</span></div>{labs.map((l) => <Row key={l.id} href={`/klinika/labor?open=${l.id}`} title={`${l.name} (${l.abbr})`} sub={`${l.ref}${l.unit ? ` ${l.unit}` : ''}`} />)}</>)}
      {scores.length > 0 && (<><div className="sec-h"><span className="sec-t">🧮 Score-ok</span></div>{scores.map((t) => <Row key={t.id} href={`/klinika/tesztek?open=${t.id}`} title={t.name} sub={t.abbr ?? ''} />)}</>)}
      {ekgs.length > 0 && (<><div className="sec-h"><span className="sec-t">📈 EKG</span></div>{ekgs.map((e) => <Row key={e.id} href={`/klinika/ekg?open=${e.id}`} title={e.name} sub={e.cat} />)}</>)}
    </>
  )
}
