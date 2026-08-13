import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
    <nav className="nav">
      <Link href="/">Kezdőlap</Link>
      <Link href="/kompetenciak">Kompetenciák</Link>
      <Link href="/cpd">CPD</Link>
      <span className="spacer" />
      {user ? (
        <form action={signOut}>
          <button className="btn ghost" type="submit">
            Kijelentkezés
          </button>
        </form>
      ) : (
        <Link href="/login">Belépés</Link>
      )}
    </nav>
  )
}
