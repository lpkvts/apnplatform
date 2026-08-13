import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-logo">APN</span>
        <span className="brand-txt">Hungary Platform</span>
      </Link>
      <span className="spacer" />
      {!user && <Link href="/login" className="btn ghost sm">Belépés</Link>}
    </header>
  )
}
