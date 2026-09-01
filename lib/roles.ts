import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export type Role = 'apn' | 'szerkeszto' | 'lektor' | 'admin'
export const STAFF: Role[] = ['szerkeszto', 'lektor', 'admin']
export const PUBLISHERS: Role[] = ['szerkeszto', 'admin']

/**
 * A bejelentkezett felhasználó szerepköre.
 *
 * Egy oldalbetöltés során többször is szükség van rá (elrendezés, oldal,
 * műveletek), ezért kérésenként egyszer kérdezzük le. A React cache csak az
 * adott kérésre él, tehát nem visz át állapotot felhasználók között.
 */
export const currentRole = cache(async (): Promise<{ userId: string | null; role: Role | null }> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { userId: null, role: null }
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle<{ role: Role }>()
  return { userId: user.id, role: data?.role ?? null }
})

export function isStaff(role: Role | null): boolean {
  return !!role && STAFF.includes(role)
}

export function isAdmin(role: Role | null): boolean {
  return role === 'admin'
}
