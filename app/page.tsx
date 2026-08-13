import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Profile, CpdEntry } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id ?? '')
    .single<Profile>()

  const year = new Date().getFullYear()
  const { data: entries } = await supabase
    .from('cpd_entries')
    .select('points')
    .eq('activity_year', year)
    .returns<Pick<CpdEntry, 'points'>[]>()

  const { data: goal } = await supabase
    .from('cpd_goals')
    .select('target_points')
    .eq('year', year)
    .maybeSingle<{ target_points: number }>()

  const total = (entries ?? []).reduce((s, e) => s + Number(e.points), 0)
  const target = goal?.target_points ?? 50

  return (
    <>
      <h1 className="h1">Jó napot{profile?.full_name ? `, ${profile.full_name}` : ''}!</h1>
      <p className="sub">
        {profile?.specialty || 'APN'} · APN Hungary Platform
      </p>

      <div className="card">
        <div className="sub" style={{ margin: 0 }}>
          CPD {year}
        </div>
        <div className="stat">
          {total} / {target} pont
        </div>
        <p className="sub" style={{ marginTop: 8 }}>
          {total >= target
            ? 'Elérted az éves célodat.'
            : `Még ${Math.max(0, target - total)} pont hiányzik az éves célodhoz.`}
        </p>
        <Link className="btn" href="/cpd">
          CPD kezelése
        </Link>
      </div>

      <div className="card">
        <div className="sub" style={{ margin: 0 }}>
          Kompetencia-passzport
        </div>
        <p className="sub" style={{ marginTop: 8 }}>
          Kövesd a fejlődésed a klinikai és gondozási kompetenciákban.
        </p>
        <Link className="btn ghost" href="/kompetenciak">
          Megnyitás
        </Link>
      </div>
    </>
  )
}
