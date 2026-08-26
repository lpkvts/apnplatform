import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient, adminApiAvailable } from '@/lib/supabase/admin'
import { currentRole, isAdmin } from '@/lib/roles'
import { UserEditor, type AdminUser } from '@/components/user-editor'

export const dynamic = 'force-dynamic'

const ROLE_LABEL: Record<string, string> = { apn: 'APN', szerkeszto: 'Szerkesztő', lektor: 'Lektor', admin: 'Admin' }

export default async function FelhasznaloPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId, role } = await currentRole()
  if (!isAdmin(role)) {
    return <><h1 className="h1">Felhasználó</h1><div className="card">Ehhez admin jogosultság szükséges.</div></>
  }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_user_get', { p_id: id })
  const row = (data as AdminUser[] | null)?.[0]

  if (error || !row) {
    return (
      <>
        <Link className="sh-back" href="/cms/felhasznalok">‹ Felhasználók</Link>
        <h1 className="h1">Felhasználó</h1>
        <div className="card">
          <p style={{ margin: 0 }} className="form-err">A felhasználó nem található.</p>
          {error && <p className="sub" style={{ marginBottom: 0 }}>Futtasd a <code>0029_admin_user_management.sql</code> migrációt.</p>}
        </div>
      </>
    )
  }

  // A letiltás állapota csak az Admin API-n keresztül olvasható.
  let banned = false
  const admin = createAdminClient()
  if (admin) {
    const { data: au } = await admin.auth.admin.getUserById(id)
    const until = (au?.user as { banned_until?: string } | undefined)?.banned_until
    banned = !!until && new Date(until).getTime() > Date.now()
  }

  const user: AdminUser = { ...row, banned }
  const fmt = (d: string | null) => (d ? new Date(d).toLocaleString('hu-HU') : '—')

  return (
    <>
      <Link className="sh-back" href="/cms/felhasznalok">‹ Felhasználók</Link>
      <h1 className="h1">{user.full_name || '(névtelen)'}</h1>
      <p className="sub">
        {user.email ?? '—'} · {ROLE_LABEL[user.role] ?? user.role}
        {banned && <> · <b style={{ color: '#C0392B' }}>letiltva</b></>}
      </p>

      <div className="card">
        <div className="row"><span className="sub" style={{ margin: 0 }}>Regisztráció</span><b>{fmt(user.created_at)}</b></div>
        <div className="row"><span className="sub" style={{ margin: 0 }}>Utolsó belépés</span><b>{fmt(user.last_sign_in_at)}</b></div>
        <div className="row" style={{ borderBottom: 'none' }}>
          <span className="sub" style={{ margin: 0 }}>E-mail megerősítve</span>
          <b>{user.email_confirmed_at ? 'Igen' : 'Nem'}</b>
        </div>
      </div>

      <UserEditor user={user} adminApiReady={adminApiAvailable()} isSelf={userId === user.id} />
    </>
  )
}
