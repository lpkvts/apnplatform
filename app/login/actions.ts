'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { siteUrl } from '@/lib/site-url'
import { authHiba } from '@/lib/auth-errors'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?error=' + encodeURIComponent(authHiba(error.message)))
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const full_name = String(formData.get('full_name') ?? '')
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  })
  if (error) redirect('/login?error=' + encodeURIComponent(authHiba(error.message)))
  redirect('/login?message=' + encodeURIComponent(
    'Sikeres regisztráció. Ha megerősítő levelet kaptál, kattints benne a hivatkozásra, '
    + 'majd jelentkezz be.',
  ))
}

/**
 * Elfelejtett jelszó: visszaállító levél kérése.
 *
 * Válaszunk szándékosan azonos akkor is, ha a cím nem szerepel a rendszerben —
 * különben a válaszból ki lehetne deríteni, kinek van fiókja.
 */
export async function requestReset(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const done = () => redirect('/login?message=' + encodeURIComponent(
    'Ha ezzel a címmel van fiók, elküldtük a visszaállító levelet. Nézd meg a levélszemetet is.',
  ))

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect('/login?error=' + encodeURIComponent('Adj meg egy érvényes e-mail címet.'))
  }

  const supabase = await createClient()
  const base = await siteUrl()
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${base}/auth/confirm?next=/auth/uj-jelszo`,
  })
  done()
}
