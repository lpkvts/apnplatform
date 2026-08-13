import { createClient } from '@/lib/supabase/server'

export type Role = 'apn' | 'szerkeszto' | 'lektor' | 'admin'
export const STAFF: Role[] = ['szerkeszto', 'lektor', 'admin']
export const PUBLISHERS: Role[] = ['szerkeszto', 'admin']

export async function currentRole(): Promise<{ userId: string | null; role: Role | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { userId: null, role: null }
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle<{ role: Role }>()
  return { userId: user.id, role: data?.role ?? null }
}

export function isStaff(role: Role | null): boolean {
  return !!role && STAFF.includes(role)
}
