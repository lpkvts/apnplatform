import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function Nav() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-logo">APN</span>
        <span className="brand-txt">Hungary Platform</span>
      </Link>
      <span className="spacer" />
      {user ? (
        <form action={signOut}>
          <button className="btn ghost sm" type="submit">
            Kilépés
          </button>
        </form>
      ) : (
        <Link href="/login" className="btn ghost sm">
          Belépés
        </Link>
      )}
    </header>
  )
}
