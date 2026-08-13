import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Profile, CpdEntry } from '@/lib/types'
import { Icon, CpdRing } from '@/components/icons'

const TILES = [
  { href: '/klinika/ertekeles', label: 'Új betegértékelés', icon: 'assessment' },
  { href: '/klinika/tesztek', label: 'Score Hub', icon: 'score' },
  { href: '/klinika/labor', label: 'Labor', icon: 'flask' },
  { href: '/klinika/ekg', label: 'EKG', icon: 'ekg' },
  { href: '/klinika/copilot', label: 'APN Copilot', icon: 'copilot' },
  { href: '/klinika/tudastar', label: 'Tudástár', icon: 'book' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id ?? '').single<Profile>()

  const year = new Date().getFullYear()
  const { data: entries } = await supabase
    .from('cpd_entries').select('points').eq('activity_year', year).returns<Pick<CpdEntry, 'points'>[]>()
  const { data: goal } = await supabase
    .from('cpd_goals').select('target_points').eq('year', year).maybeSingle<{ target_points: number }>()
  const total = (entries ?? []).reduce((s, e) => s + Number(e.points), 0)
  const target = goal?.target_points ?? 50
  const remaining = Math.max(0, target - total)

  const { data: latest } = await supabase
    .from('guidelines').select('id, title, summary')
    .eq('status', 'published').order('published_at', { ascending: false }).limit(1)
    .maybeSingle<{ id: string; title: string; summary: string | null }>()

  const initial = (profile?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase()

  return (
    <>
      <div className="dash-top">
        <div className="dash-hi">
          Kezdőlap
          <span>{profile?.full_name || 'Üdvözöljük'} · {profile?.specialty || 'APN'}</span>
        </div>
        <div className="dash-actions">
          <Link href="/profil" className="avatar">{initial}</Link>
        </div>
      </div>

      {latest && (
        <Link className="update-card" href={`/klinika/tudastar/${latest.id}`}>
          <div className="update-k">Legfrissebb szakmai tartalom</div>
          <div className="update-t">{latest.title}</div>
          {latest.summary && <div className="update-s">{latest.summary}</div>}
          <span className="update-go">Megnyitás →</span>
        </Link>
      )}

      <div className="sec-h">
        <span className="sec-t">Gyors elérés</span>
        <Link className="sec-l" href="/klinika">Klinikai mag →</Link>
      </div>
      <div className="qgrid">
        {TILES.map((t) => (
          <Link key={t.href} className="qtile" href={t.href}>
            <span className="qtile-i"><Icon name={t.icon} size={24} /></span>
            <span className="qtile-l">{t.label}</span>
          </Link>
        ))}
      </div>

      <div className="sec-h">
        <span className="sec-t">Szakmai fejlődésem</span>
        <Link className="sec-l" href="/cpd">Részletek →</Link>
      </div>
      <div className="card cpd-card">
        <CpdRing total={total} target={target} />
        <div className="cpd-txt">
          <div className="big">{remaining > 0 ? `Már csak ${remaining} pont` : 'Éves cél teljesítve! 🎉'}</div>
          <p className="sub" style={{ margin: '4px 0 0' }}>
            {remaining > 0 ? `és eléred az éves célod (${target} pont).` : `Idén ${total} CPD-pontot gyűjtöttél.`}
          </p>
        </div>
      </div>
    </>
  )
}
