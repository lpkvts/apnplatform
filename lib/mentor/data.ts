import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import type { Mentor, AdminMentor, Status } from './types'

/**
 * Mentorprogram — szerveroldali lekérdezések.
 *
 * A típusok és a választható készletek a types.ts fájlban vannak, hogy a
 * kliensoldali komponensek is elérjék őket.
 */

export * from './types'

/** A jóváhagyott, kereshető mentorok. */
export const getMentors = cache(async (): Promise<Mentor[]> => {
  const supabase = await createClient()
  const { data } = await supabase.rpc('mentor_list')
  return (data as Mentor[] | null) ?? []
})

/** A bejelentkezett felhasználó saját mentorprofilja, bármilyen állapotban. */
export const getMyMentorProfile = cache(async () => {
  const user = await getCurrentUser()
  if (!user) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('mentor_profiles')
    .select('id, title, workplace, specialty, experience_years, bio, topics, interests, formats, contact_note, status, review_note')
    .eq('user_id', user.id)
    .maybeSingle<{
      id: string; title: string | null; workplace: string | null; specialty: string
      experience_years: number | null; bio: string | null
      topics: string[]; interests: string[]; formats: string[]
      contact_note: string | null; status: Status; review_note: string | null
    }>()
  return data
})

/** Minden profil — adminisztrátori elbíráláshoz, függőben lévők elöl. */
export async function getAdminMentors(): Promise<AdminMentor[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('mentor_admin_list')
  return (data as AdminMentor[] | null) ?? []
}

/** Egy mentor a nyilvános listából. */
export async function getMentor(id: string): Promise<Mentor | null> {
  const list = await getMentors()
  return list.find((m) => m.id === id) ?? null
}
