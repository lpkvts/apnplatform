import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { RingLogo } from '@/components/icons'

export async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
      {!user && <Link href="/login" className="btn ghost sm">Belépés</Link>}
    </header>
  )
}
