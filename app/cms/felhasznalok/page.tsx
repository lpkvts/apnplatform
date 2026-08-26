import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isAdmin } from '@/lib/roles'
export const dynamic = 'force-dynamic'

const ROLE_LABEL: Record<string, string> = { apn: 'APN', szerkeszto: 'Szerkesztő', lektor: 'Lektor', admin: 'Admin' }
const ROLE_CLS: Record<string, string> = { apn: 's-draft', szerkeszto: 's-review', lektor: 's-review', admin: 's-published' }
interface UserRow { id: string; email: string | null; full_name: string | null; role: string; apn_type: string | null; workplace: string | null; specialty: string | null; title: string | null; created_at: string }

export default async function FelhasznalokPage() {
  const { role } = await currentRole()
  if (!isAdmin(role)) return <><h1 className="h1">Felhasználók</h1><div className="card">Ehhez admin jogosultság szükséges.</div></>
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_user_list')
  const users = (data as UserRow[] | null) ?? []
  const byRole = users.reduce<Record<string, number>>((acc, u) => { acc[u.role] = (acc[u.role] ?? 0) + 1; return acc }, {})

  return (
    <>
      <Link className="sh-back" href="/cms">‹ Tartalomkezelés</Link>
      <h1 className="h1">Felhasználók</h1>
      <p className="sub">Regisztrált felhasználók egy helyen · {users.length} fő</p>

      {error && <div className="card"><p style={{ margin: 0 }} className="form-err">Nem sikerült lekérni: {error.message}</p><p className="sub" style={{ marginBottom: 0 }}>Futtasd a <code>0025_admin_users.sql</code> migrációt.</p></div>}

      <div className="stat-grid">
        {(['apn', 'szerkeszto', 'lektor', 'admin'] as const).map((r) => (
          <div className="stat-card" key={r}><div className="stat-num">{byRole[r] ?? 0}</div><div className="stat-lbl">{ROLE_LABEL[r]}</div></div>
        ))}
      </div>

      {users.map((u) => (
        <Link className="card klink" key={u.id} href={`/cms/felhasznalok/${u.id}`} style={{ display: 'block' }}>
          <div className="row" style={{ border: 'none', padding: 0 }}>
            <b>{u.full_name || '(névtelen)'}</b>
            <span className={`cms-badge ${ROLE_CLS[u.role] ?? 's-draft'}`}>{ROLE_LABEL[u.role] ?? u.role}</span>
          </div>
          <div className="sub" style={{ margin: '4px 0 0' }}>{u.email ?? '—'}</div>
          <div className="sub" style={{ margin: '2px 0 0' }}>
            {[u.apn_type, u.title, u.workplace, u.specialty].filter(Boolean).join(' · ') || 'Nincs profiladat'}
          </div>
          <div className="sub" style={{ margin: '4px 0 0', fontSize: 12 }}>
            Regisztráció: {new Date(u.created_at).toLocaleDateString('hu-HU')} · Szerkesztés ›
          </div>
        </Link>
      ))}
      {users.length === 0 && !error && <p className="sub">Nincs felhasználó.</p>}
    </>
  )
}
