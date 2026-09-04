import Link from 'next/link'
import { RingLogo, Icon } from '@/components/icons'
import { getFlag } from '@/lib/flags'
import { getTeachingMembership } from '@/lib/education/data'
import { currentRole, isAdmin } from '@/lib/roles'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getNotificationCount } from '@/lib/notifications'
import { signOut } from '@/lib/actions/auth'

export async function Nav({ education = false }: { education?: boolean } = {}) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  let initial = ''
  let firstName = ''
  let notifCount = 0
  if (user) {
    const { data: p } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle<{ full_name: string | null }>()
    initial = (p?.full_name?.trim()?.[0] ?? user.email?.[0] ?? 'A').toUpperCase()
    const parts = (p?.full_name?.trim() ?? '').split(/\s+/).filter(Boolean)
    firstName = parts.length ? parts[parts.length - 1] : '' // magyar névsorrend: a keresztnév az utolsó tag
    notifCount = await getNotificationCount()
  }

  // Az oktatói felületre váltás csak azoknak jelenik meg, akik ténylegesen
  // oktatnak — vagyis oktatói vagy intézményi adminisztrátori tagságuk van —,
  // illetve a platform adminisztrátorának. Hallgatónak és a többi
  // felhasználónak nincs értelme: náluk üres felületre vinne.
  let valthat = false
  if (user) {
    const eduOn = await getFlag('education', false)
    if (eduOn) {
      const [tagsag, szerep] = await Promise.all([getTeachingMembership(), currentRole()])
      valthat = !!tagsag || isAdmin(szerep.role)
    }
  }
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-logo"><RingLogo /></span>
        <span className="brand-txt">
          <span className="brand-name">APN-MED</span>
          <span className="brand-sub">Szakmai platform</span>
        </span>
      </Link>

      {/* Oktatói felületen jelezzük, hogy más munkamódban vagyunk. A jelkép
          és a márkanév változatlan: egy platform, két réteg. */}
      {education && (
        <span className="brand-edu">
          <b>Education</b>
          <span>Oktatói felület</span>
        </span>
      )}

      <span className="spacer" />

      {/* Váltás a két munkamód között. A gomb mindig arra a felületre mutat,
          ahol éppen nem vagyunk. */}
      {valthat && (
        <Link
          href={education ? '/' : '/oktatas'}
          className="mode-switch"
          title={education ? 'Vissza a klinikai felületre' : 'Váltás az oktatói felületre'}
        >
          <Icon name={education ? 'stethoscope' : 'courses'} size={17} />
          <span>{education ? 'Klinikai' : 'Oktatói'}</span>
        </Link>
      )}
      {user && (
        <>
          <Link href="/ertesitesek" className="icon-btn bell-wrap" aria-label="Értesítések">
            <Icon name="bell" size={20} />
            {notifCount > 0 && <span className="notif-dot">{notifCount > 9 ? '9+' : notifCount}</span>}
          </Link>
          {firstName && <span className="nav-greet">Üdvözlünk <b>{firstName}</b></span>}
          <Link href="/profil" className="avatar" aria-label="Profil">{initial}</Link>
          {/* Kijelentkezés egy gombnyomásra, a profil megnyitása nélkül. */}
          <form action={signOut}>
            <button type="submit" className="icon-btn" aria-label="Kijelentkezés" title="Kijelentkezés">
              <Icon name="logout" size={20} />
            </button>
          </form>
        </>
      )}
    </header>
  )
}
