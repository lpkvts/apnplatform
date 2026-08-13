import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { currentRole, isStaff } from '@/lib/roles'

const ROLE_LABEL: Record<string, string> = {
  apn: 'APN', szerkeszto: 'Szerkesztő', lektor: 'Lektor', admin: 'Adminisztrátor',
}

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function ProfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { role } = await currentRole()

  const { data: profile } = await supabase
    .from('profiles').select('full_name, specialty').eq('id', user?.id ?? '').maybeSingle<{ full_name: string | null; specialty: string | null }>()

  const year = new Date().getFullYear()
  const { data: entries } = await supabase
    .from('cpd_entries').select('points').eq('activity_year', year).returns<{ points: number }[]>()
  const { data: goal } = await supabase
    .from('cpd_goals').select('target_points').eq('year', year).maybeSingle<{ target_points: number }>()
  const cpdTotal = (entries ?? []).reduce((s, e) => s + Number(e.points), 0)
  const cpdTarget = goal?.target_points ?? 50

  const { data: progress } = await supabase
    .from('competency_progress').select('status').returns<{ status: string }[]>()
  const achieved = (progress ?? []).filter((p) => p.status === 'achieved').length

  const initial = (profile?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase()

  return (
    <>
      <h1 className="h1">Profil</h1>

      <div className="card prof-head">
        <div className="prof-av">{initial}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="prof-name">{profile?.full_name || 'Felhasználó'}</div>
          <div className="sub" style={{ margin: '2px 0 0' }}>{profile?.specialty || 'APN'}</div>
          <div className="sub" style={{ margin: '2px 0 0', fontSize: 12 }}>{user?.email}</div>
        </div>
        <span className="cms-badge s-published">{ROLE_LABEL[role ?? 'apn'] ?? role}</span>
      </div>

      <Link className="card klink" href="/kompetenciak">
        <div className="klink-t">📈 Kompetencia-passzport</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>{achieved} teljesített kompetencia</div>
      </Link>

      <Link className="card klink" href="/cpd">
        <div className="klink-t">🎓 Szakmai fejlődés (CPD)</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>{year}: {cpdTotal} / {cpdTarget} pont</div>
      </Link>

      {isStaff(role) && (
        <Link className="card klink" href="/cms">
          <div className="klink-t">🛠️ Tartalomkezelés (CMS)</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Irányelvek — lektorálás, publikálás</div>
        </Link>
      )}

      <form action={signOut} style={{ marginTop: 8 }}>
        <button className="btn ghost" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
          Kijelentkezés
        </button>
      </form>
    </>
  )
}
