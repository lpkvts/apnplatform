import Link from 'next/link'
import { RingLogo, Icon } from '@/components/icons'
import { getFlag } from '@/lib/flags'
import { getTeachingMembership } from '@/lib/education/data'
import { currentRole, isAdmin } from '@/lib/roles'
import { NavEduBadge } from '@/components/nav-edu-badge'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getNotificationCount } from '@/lib/notifications'
import { AppBadge } from '@/components/app-badge'
import { LogoutButton } from '@/components/logout-button'

export async function Nav() {
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

      <NavEduBadge canSwitch={valthat} />
      {user && (
        <>
          {/* Visszajelzés menet közben. A béta sáv bezárása után eddig nem
              volt más elérés a jelzéshez. */}
          <Link href="/kapcsolat?tema=hiba" className="icon-btn"
            aria-label="Hiba vagy javaslat jelzése" title="Jelzés a fejlesztőknek">
            <Icon name="copilot" size={20} />
          </Link>
          <Link href="/ertesitesek" className="icon-btn bell-wrap" aria-label="Értesítések">
            <Icon name="bell" size={20} />
            {notifCount > 0 && <span className="notif-dot">{notifCount > 9 ? '9+' : notifCount}</span>}
            <AppBadge count={notifCount} />
          </Link>
          {firstName && <span className="nav-greet">Üdvözlünk <b>{firstName}</b></span>}
          <Link href="/profil" className="avatar" aria-label="Profil">{initial}</Link>
          {/* Kijelentkezés egy gombnyomásra, a profil megnyitása nélkül.
              Teljes oldalbetöltéssel, hogy a keret tárolt állapota is
              eldobódjon — enélkül a fejléc a régi adatokkal ott maradt. */}
          <LogoutButton />
        </>
      )}
    </header>
  )
}
