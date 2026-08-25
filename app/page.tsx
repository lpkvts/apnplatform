import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'
import { Icon } from '@/components/icons'
import { getNotifications } from '@/lib/notifications'
import { getFlag } from '@/lib/flags'
import { getFavoritesByType } from '@/lib/favorites'
import { SHORTCUTS } from '@/lib/shortcuts'

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
  const [copilotEnabled, careerEnabled] = await Promise.all([getFlag('apn_copilot', false), getFlag('apn_career', false)])
  const menuKeys = await getFavoritesByType('menu')
  const myShortcuts = SHORTCUTS.filter((sc) => menuKeys.includes(sc.key))
  const tiles = TILES.filter((t) => (t.href !== '/klinika/copilot' || copilotEnabled) && (t.href !== '/career' || careerEnabled))
  const initial = (profile?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase()

  return (
    <>
      <div className="dash-top">
        <div className="dash-hi">
          Kezdőlap
          <span>{profile?.full_name || 'Üdvözöljük'} · {profile?.specialty || 'APN'}</span>
        </div>
        </div>

      <Link href="/kereses" className="search-box">
        <Icon name="search" size={18} />
        <span>Keresés a platformon…</span>
      </Link>


      <div className="sec-h">
        <span className="sec-t">Gyorsindítóim</span>
        <Link className="sec-l" href="/testreszabas">Testreszabás →</Link>
      </div>
      {myShortcuts.length > 0 ? (
        <div className="qgrid">
          {myShortcuts.map((sc) => (
            <Link key={sc.key} className="qtile" href={sc.href}>
              <span className="qtile-i"><Icon name={sc.icon} size={24} /></span>
              <span className="qtile-l">{sc.label}</span>
            </Link>
          ))}
        </div>
      ) : (
        <Link className="card klink" href="/testreszabas">
          <div className="klink-t">➕ Tegyél ki gyorsindítókat</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>Válaszd ki a leggyakrabban használt menüket a kezdőlapra</div>
        </Link>
      )}

      <div className="sec-h">
        <span className="sec-t">Gyors elérés</span>
        <Link className="sec-l" href="/klinika">Klinikai mag →</Link>
      </div>
      <div className="qgrid">
        {tiles.map((t) => (
          <Link key={t.href} className="qtile" href={t.href}>
            <span className="qtile-i"><Icon name={t.icon} size={24} /></span>
            <span className="qtile-l">{t.label}</span>
          </Link>
        ))}
      </div>

      <div className="sec-h">
        <span className="sec-t">Legutóbbi tevékenységek</span>
        <Link className="sec-l" href="/klinika/esetek?type=assessment">Összes →</Link>
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
          <Link key={a.id} className="sh-row" href="/klinika/esetek?type=assessment">
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
