import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff, PUBLISHERS, type Role } from '@/lib/roles'
import { transitionGuideline } from './actions'

const STATUS_LABEL: Record<string, string> = {
  draft: 'Piszkozat', review: 'Lektorálásra vár', published: 'Publikált', expired: 'Lejárt',
}

interface Row {
  id: string; title: string; status: string; ai_generated: boolean
  review_on: string | null; expires_on: string | null
}

function TransBtn({ id, action, label }: { id: string; action: string; label: string }) {
  return (
    <form action={transitionGuideline} style={{ display: 'inline' }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="action" value={action} />
      <button className="btn ghost sm" type="submit">{label}</button>
    </form>
  )
}

export default async function CmsPage() {
  const { role } = await currentRole()
  if (!isStaff(role)) {
    return (
      <>
        <h1 className="h1">Tartalomkezelés (CMS)</h1>
        <div className="card">Ehhez szerkesztő/lektor/admin jogosultság szükséges.</div>
      </>
    )
  }
  const canPublish = PUBLISHERS.includes(role as Role)
  const today = new Date().toISOString().slice(0, 10)

  const supabase = await createClient()
  const { data } = await supabase
    .from('guidelines')
    .select('id, title, status, ai_generated, review_on, expires_on')
    .order('status')
    .order('title')
    .returns<Row[]>()
  const items = data ?? []

  return (
    <>
      <div className="row" style={{ border: 'none' }}>
        <h1 className="h1" style={{ margin: 0 }}>Tartalomkezelés</h1>
        <Link className="btn sm" href="/cms/uj">+ Új irányelv</Link>
      </div>
      <p className="sub">Munkafolyamat: piszkozat → lektorálás → publikálás.</p>

      {items.map((g) => {
        const due = (g.review_on && g.review_on <= today) || (g.expires_on && g.expires_on <= today)
        return (
          <div className="card" key={g.id}>
            <div className="row" style={{ border: 'none', paddingBottom: 6 }}>
              <b>{g.title}</b>
              <span className={`cms-badge s-${g.status}`}>{STATUS_LABEL[g.status] ?? g.status}</span>
            </div>
            {g.ai_generated && <div className="sub" style={{ margin: 0 }}>🤖 AI-generált</div>}
            {due && <div className="sub" style={{ margin: '4px 0 0', color: '#b45309' }}>⏰ Felülvizsgálat/lejárat esedékes</div>}
            <div className="cop-acts" style={{ marginTop: 10 }}>
              <Link className="btn ghost sm" href={`/cms/${g.id}`}>Szerkesztés</Link>
              {g.status === 'draft' && <TransBtn id={g.id} action="submit" label="Beküldés lektorálásra" />}
              {g.status === 'review' && canPublish && <TransBtn id={g.id} action="publish" label="Publikálás" />}
              {g.status === 'review' && <TransBtn id={g.id} action="reject" label="Vissza piszkozatba" />}
              {g.status === 'published' && canPublish && <TransBtn id={g.id} action="expire" label="Lejárttá" />}
              {(g.status === 'published' || g.status === 'expired') && canPublish && <TransBtn id={g.id} action="revoke" label="Piszkozatba" />}
            </div>
          </div>
        )
      })}
      {items.length === 0 && <p className="sub">Még nincs tartalom.</p>}

      <Link className="card klink" href="/cms/betegsegek">
        <div className="klink-t">🩺 Betegségtár kezelése</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Betegségoldalak létrehozása, szerkesztése, lektorálása</div>
      </Link>
      <Link className="card klink" href="/cms/audit">
        <div className="klink-t">🧾 Audit napló</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Ki, mit, mikor módosított</div>
      </Link>
    </>
  )
}
