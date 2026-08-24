import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff, PUBLISHERS, type Role } from '@/lib/roles'
import { transitionDisease } from './actions'
const STATUS_LABEL: Record<string, string> = { draft: 'Piszkozat', review: 'Lektorálásra vár', published: 'Publikált', expired: 'Lejárt' }
interface Row { id: string; name: string; specialty: string | null; status: string; ai_generated: boolean }
function TransBtn({ id, action, label }: { id: string; action: string; label: string }) {
  return (<form action={transitionDisease} style={{ display: 'inline' }}><input type="hidden" name="id" value={id} /><input type="hidden" name="action" value={action} /><button className="btn ghost sm" type="submit">{label}</button></form>)
}
export default async function DiseaseCmsPage() {
  const { role } = await currentRole()
  if (!isStaff(role)) return <><h1 className="h1">Betegségtár kezelése</h1><div className="card">Ehhez szerkesztő/lektor/admin jog szükséges.</div></>
  const canPublish = PUBLISHERS.includes(role as Role)
  const supabase = await createClient()
  const { data } = await supabase.from('diseases').select('id, name, specialty, status, ai_generated').order('status').order('name').returns<Row[]>()
  const items = data ?? []
  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <div className="row" style={{ border: 'none' }}><h1 className="h1" style={{ margin: 0 }}>Betegségtár</h1><Link className="btn sm" href="/cms/betegsegek/uj">+ Új betegség</Link></div>
      <p className="sub">Munkafolyamat: piszkozat → lektorálás → publikálás.</p>
      {items.map((g) => (
        <div className="card" key={g.id}>
          <div className="row" style={{ border: 'none', paddingBottom: 6 }}><b>{g.name}</b><span className={`cms-badge s-${g.status}`}>{STATUS_LABEL[g.status] ?? g.status}</span></div>
          <div className="sub" style={{ margin: 0 }}>{g.specialty}{g.ai_generated ? ' · 🤖 AI' : ''}</div>
          <div className="cop-acts" style={{ marginTop: 10 }}>
            <Link className="btn ghost sm" href={`/cms/betegsegek/${g.id}`}>Szerkesztés</Link>
            {g.status === 'draft' && <TransBtn id={g.id} action="submit" label="Beküldés lektorálásra" />}
            {g.status === 'review' && canPublish && <TransBtn id={g.id} action="publish" label="Publikálás" />}
            {g.status === 'review' && <TransBtn id={g.id} action="reject" label="Vissza piszkozatba" />}
            {g.status === 'published' && canPublish && <TransBtn id={g.id} action="expire" label="Lejárttá" />}
            {(g.status === 'published' || g.status === 'expired') && canPublish && <TransBtn id={g.id} action="revoke" label="Piszkozatba" />}
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="sub">Még nincs betegség.</p>}
    </>
  )
}
