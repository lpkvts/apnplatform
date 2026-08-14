import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'
import { ProfileForm } from '@/components/profile-form'

export default async function ProfilSzerkesztes() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: p } = await supabase.from('profiles').select('*').eq('id', user?.id ?? '').single<Profile>()
  return (
    <>
      <Link className="sh-back" href="/profil">‹ Profil</Link>
      <h1 className="h1">Szakmai adatok szerkesztése</h1>
      <ProfileForm p={p} />
    </>
  )
}
