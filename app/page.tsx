import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'
import { Icon } from '@/components/icons'
import { getNotifications } from '@/lib/notifications'

const TILES = [
  { href: '/klinika/ertekeles', label: 'Új betegértékelés', icon: 'assessment' },
  { href: '/klinika/tesztek', label: 'Score Hub', icon: 'score' },
  { href: '/klinika/labor', label: 'Labor', icon: 'flask' },
  { href: '/klinika/ekg', label: 'EKG', icon: 'ekg' },
  { href: '/klinika/copilot', label: 'APN Copilot', icon: 'copilot' },
  { href: '/klinika/tudastar', label: 'Tudástár', icon: 'book' },
  { href: '/betegsegtar', label: 'Betegségtár', icon: 'clinic' },
  { href: '/career', label: 'APN Career', icon: 'grad' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profileRes, latestRes, notif] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user?.id ?? '').single<Profile>(),
    supabase.from('guidelines').select('id, title, summary')
      .eq('status', 'published').order('published_at', { ascending: false }).limit(1)
      .maybeSingle<{ id: string; title: string; summary: string | null }>(),
    getNotifications(),
  ])
  const profile = profileRes.data
  const latest = latestRes.data
  const notifCount = notif.count
  const initial = (profile?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase()

  return (
    <>
      <div className="dash-top">
        <div className="dash-hi">
          Kezdőlap
          <span>{profile?.full_name || 'Üdvözöljük'} · {profile?.specialty || 'APN'}</span>
        </div>
        <div className="dash-actions">
          <Link href="/ertesitesek" className="icon-btn bell-wrap">
            <Icon name="bell" size={20} />
            {notifCount > 0 && <span className="notif-dot">{notifCount > 9 ? '9+' : notifCount}</span>}
          </Link>
          <Link href="/profil" className="avatar">{initial}</Link>
        </div>
      </div>

      <Link href="/kereses" className="search-box">
        <Icon name="search" size={18} />
        <span>Keresés a platformon…</span>
      </Link>

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

    </>
  )
}
