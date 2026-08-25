import Link from 'next/link'
import { RingLogo, Icon } from '@/components/icons'
import { createClient } from '@/lib/supabase/server'
import { getNotifications } from '@/lib/notifications'

export async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let initial = ''
  let firstName = ''
  let notifCount = 0
  if (user) {
    const { data: p } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle<{ full_name: string | null }>()
    initial = (p?.full_name?.trim()?.[0] ?? user.email?.[0] ?? 'A').toUpperCase()
    const parts = (p?.full_name?.trim() ?? '').split(/\s+/).filter(Boolean)
    firstName = parts.length ? parts[parts.length - 1] : '' // magyar névsorrend: a keresztnév az utolsó tag
    const n = await getNotifications()
    notifCount = n.count
  }
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-logo"><RingLogo /></span>
        <span className="brand-txt">
          <span className="brand-name">APN</span>
          <span className="brand-sub">Hungary Platform</span>
        </span>
      </Link>
      <span className="spacer" />
      {user && (
        <>
          <Link href="/ertesitesek" className="icon-btn bell-wrap" aria-label="Értesítések">
            <Icon name="bell" size={20} />
            {notifCount > 0 && <span className="notif-dot">{notifCount > 9 ? '9+' : notifCount}</span>}
          </Link>
          {firstName && <span className="nav-greet">Üdvözlünk <b>{firstName}</b></span>}
          <Link href="/profil" className="avatar" aria-label="Profil">{initial}</Link>
        </>
      )}
    </header>
  )
}
