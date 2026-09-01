import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import type { Profile } from '@/lib/types'
import { Icon } from '@/components/icons'
import { getFlag } from '@/lib/flags'
import { getFavoritesByType } from '@/lib/favorites'
import { SHORTCUTS } from '@/lib/shortcuts'
import { Landing } from '@/components/landing'
import { accentStyle } from '@/lib/shortcuts'


// Az alapértelmezett csempék. A színt a központi paletta adja (lib/shortcuts.ts),
// hogy a kezdőlap és a testreszabás nézet ne térhessen el egymástól.
const TILES = [
  { href: '/klinika/vizsgalat', label: 'Betegvizsgálat', icon: 'assessment' },
  { href: '/klinika/tesztek', label: 'Score Hub', icon: 'score' },
  { href: '/klinika/labor', label: 'Labor', icon: 'flask' },
  { href: '/klinika/ekg', label: 'EKG', icon: 'ekg' },
  { href: '/betegsegtar', label: 'Betegségtár', icon: 'clinic' },
  { href: '/klinika/tudastar', label: 'Tudástár', icon: 'book' },
]

const MODE_BADGE: Record<string, string> = { clinical: 'Klinikai', education: 'Oktatási', practice: 'Gyakorló' }
const CASE_STATUS: Record<string, string> = { active: 'Aktív', draft: 'Folyamatban', followup: 'Follow-up' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return <Landing />

  const [profileRes, recentRes, examRes, caseRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user?.id ?? '').single<Profile>(),
    supabase.from('assessments').select('id, domain, complaint, created_at')
      .order('created_at', { ascending: false }).limit(5)
      .returns<{ id: string; domain: string | null; complaint: string | null; created_at: string }[]>(),
    supabase.from('exam_sessions').select('id, title, mode, updated_at').eq('status', 'active')
      .order('updated_at', { ascending: false }).limit(1)
      .returns<{ id: string; title: string; mode: string; updated_at: string }[]>(),
    supabase.from('clinical_cases').select('id, case_no, title, status, updated_at').in('status', ['active', 'draft', 'followup'])
      .order('updated_at', { ascending: false }).limit(1)
      .returns<{ id: string; case_no: number; title: string; status: string; updated_at: string }[]>(),
  ])
  const profile = profileRes.data
  const recent = recentRes.data ?? []

  const [copilotEnabled, careerEnabled] = await Promise.all([getFlag('apn_copilot', false), getFlag('apn_career', false)])

  const menuKeys = await getFavoritesByType('menu')
  const myShortcuts = SHORTCUTS.filter((sc) => menuKeys.includes(sc.key))
  const tiles = TILES.filter((t) => (t.href !== '/klinika/copilot' || copilotEnabled) && (t.href !== '/career' || careerEnabled))

  // Folytasd, ahol abbahagytad
  type Resume = { kind: 'exam' | 'case'; href: string; title: string; sub: string; at: string }
  const resume: Resume[] = []
  const ex = examRes.data?.[0]
  if (ex) resume.push({ kind: 'exam', href: `/klinika/vizsgalat/${ex.id}`, title: ex.title, sub: `Betegvizsgálat · ${MODE_BADGE[ex.mode] ?? ex.mode}`, at: ex.updated_at })
  const cc = caseRes.data?.[0]
  if (cc) resume.push({ kind: 'case', href: `/klinika/esetek/${cc.id}`, title: `CASE #${String(cc.case_no).padStart(6, '0')} · ${cc.title}`, sub: `Klinikai eset · ${CASE_STATUS[cc.status] ?? cc.status}`, at: cc.updated_at })
  resume.sort((a, b) => (a.at < b.at ? 1 : -1))

  return (
    <>
      <div className="dash-top">
        <div className="dash-hi">
          Kezdőlap
          <span>{profile?.full_name || 'Üdvözöljük'} · {profile?.specialty || 'APN'}</span>
        </div>
      </div>

      <form action="/kereses" className="search-box">
        <Icon name="search" size={18} />
        <input name="q" className="search-input" placeholder="Keresés a platformon…" autoComplete="off" aria-label="Keresés" />
      </form>

      <div className="sec-h">
        <span className="sec-t">Gyors elérés</span>
        <Link className="sec-l" href="/testreszabas">Testreszabás →</Link>
      </div>
      <div className="qgrid">
        {(myShortcuts.length > 0 ? myShortcuts : tiles).map((t) => (
          // A betegvizsgálat a leggyakoribb belépési pont, ezért a rácson belül
          // kiemelt csempét kap — a korábbi külön gomb helyett.
          <Link
            key={t.href}
            className={`qtile${t.href === '/klinika/vizsgalat' ? ' qtile-main' : ''}`}
            href={t.href}
          >
            <span className="qtile-i" style={accentStyle(t.href)}><Icon name={t.icon} size={24} /></span>
            <span className="qtile-l">{t.label}</span>
          </Link>
        ))}
        <Link className="qtile qtile-add" href="/testreszabas">
          <span className="qtile-i">＋</span>
          <span className="qtile-l">Hozzáadás</span>
        </Link>
      </div>

      {resume.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Folytasd, ahol abbahagytad</span></div>
          {resume.map((r) => (
            <Link key={r.href} className="sh-row" href={r.href}>
              <span className="qtile-i" style={{ width: 38, height: 38, marginRight: 4 }}><Icon name={r.kind === 'exam' ? 'assessment' : 'clinic'} size={20} /></span>
              <span className="sh-row-main">
                <span className="sh-row-name">{r.title}</span>
                <span className="sh-row-sub">{r.sub} · {new Date(r.at).toLocaleDateString('hu-HU')}</span>
              </span>
              <span className="sh-chev">›</span>
            </Link>
          ))}
        </>
      )}

      <div className="sec-h">
        <span className="sec-t">Legutóbbi tevékenységek</span>
        <Link className="sec-l" href="/klinika/esetek?type=assessment">Összes →</Link>
      </div>
      {recent.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0 }}>Még nincs mentett tevékenységed.</p>
          <p className="sub" style={{ marginBottom: 0 }}>
            Kezdj egy <Link href="/klinika/vizsgalat">betegvizsgálattal</Link> vagy <Link href="/klinika/ertekeles">betegértékeléssel</Link>.
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
