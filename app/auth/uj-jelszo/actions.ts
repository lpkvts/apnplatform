'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const MIN = 12

export async function setNewPassword(formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const password2 = String(formData.get('password2') ?? '')

  const err = (m: string) => redirect('/auth/uj-jelszo?error=' + encodeURIComponent(m))

  if (password.length < MIN) err(`A jelszó legalább ${MIN} karakter legyen.`)
  if (password !== password2) err('A két jelszó nem egyezik.')
  if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
    err('A jelszó tartalmazzon betűt és számot is.')
  }

  const supabase = await createClient()
  // A visszaállító link már létrehozta a munkamenetet, ezért a régi jelszót
  // nem kell megadni — a link birtoklása igazolja a jogosultságot.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) err('Lejárt a munkamenet. Kérj új visszaállító levelet.')

  const { error } = await supabase.auth.updateUser({ password })
  if (error) err(error.message)

  redirect('/?jelszo=ok')
}
