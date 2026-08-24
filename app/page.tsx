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
  { href: '/betegsegtar', label: 'Klinikai Tudástár', icon: 'clinic' },
  { href: '/career', label: 'APN Career', icon: 'grad' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [profileRes, recentRes, notif] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user?.id ?? '').single<Profile>(),
    supabase.from('assessments').select('id, domain, complaint, created_at')
      .order('created_at', { ascending: false }).limit(5)
      .returns<{ id: string; domain: string | null; complaint: string | null; created_at: string }[]>(),
    getNotifications(),
  ])
  const profile = profileRes.data
  const recent = recentRes.data ?? []
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
        <span className="sec-t">Legutóbbi tevékenységek</span>
        <Link className="sec-l" href="/klinika/elozmenyek">Összes →</Link>
      </div>
      {recent.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0 }}>Még nincs mentett tevékenységed.</p>
          <p className="sub" style={{ marginBottom: 0 }}>
            Kezdj egy <Link href="/klinika/ertekeles">Új betegértékelést</Link>.
          </p>
        </div>
      ) : (
        recent.map((a) => (
          <Link key={a.id} className="sh-row" href="/klinika/elozmenyek">
            <span className="qtile-i" style={{ width: 38, height: 38, marginRight: 4 }}><Icon name="assessment" size={20} /></span>
            <span className="sh-row-main">
              <span className="sh-row-name">{a.domain || 'Betegértékelés'}</span>
              <span className="sh-row-sub">{new Date(a.created_at).toLocaleDateString('hu-HU')}{a.complaint ? ` · ${a.complaint}` : ''}</span>
            </span>
            <span className="sh-chev">›</span>
          </Link>
        ))
      )}
    </>
  )
}
