import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Profile, CpdEntry } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user?.id ?? '').single<Profile>()

  const year = new Date().getFullYear()
  const { data: entries } = await supabase
    .from('cpd_entries').select('points').eq('activity_year', year).returns<Pick<CpdEntry, 'points'>[]>()
  const { data: goal } = await supabase
    .from('cpd_goals').select('target_points').eq('year', year).maybeSingle<{ target_points: number }>()

  const total = (entries ?? []).reduce((s, e) => s + Number(e.points), 0)
  const target = goal?.target_points ?? 50

  return (
    <>
      <h1 className="h1">Jó napot{profile?.full_name ? `, ${profile.full_name}` : ''}!</h1>
      <p className="sub">{profile?.specialty || 'APN'} · APN Hungary Platform</p>

      <Link className="card klink" href="/klinika">
        <div className="klink-t">🩺 Klinikai mag</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Score Hub · betegértékelés · Copilot · Tudástár</div>
      </Link>

      <div className="card">
        <div className="sub" style={{ margin: 0 }}>CPD {year}</div>
        <div className="stat">{total} / {target} pont</div>
        <p className="sub" style={{ marginTop: 8 }}>
          {total >= target ? 'Elérted az éves célodat.' : `Még ${Math.max(0, target - total)} pont az éves célodig.`}
        </p>
        <Link className="btn ghost sm" href="/cpd">CPD kezelése</Link>
      </div>

      <Link className="card klink" href="/profil">
        <div className="klink-t">👤 Profil</div>
        <div className="sub" style={{ margin: '4px 0 0' }}>Kompetenciák, CPD és beállítások</div>
      </Link>
    </>
  )
}
