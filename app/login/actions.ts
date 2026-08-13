'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/login?error=' + encodeURIComponent(error.message))
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
  if (error) redirect('/login?error=' + encodeURIComponent(error.message))
  redirect('/login?message=' + encodeURIComponent('Sikeres regisztráció — most jelentkezz be.'))
}
