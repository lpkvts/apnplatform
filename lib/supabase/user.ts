import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * A bejelentkezett felhasználó, kérésenként egyszer lekérdezve.
 *
 * A getUser() minden hívása hálózati kérés a hitelesítési szolgáltatás felé.
 * Egy oldalbetöltés során korábban négy-öt helyről is meghívtuk (elrendezés,
 * fejléc, kedvencek, értesítések, oldal), ami érezhető késleltetést okozott.
 *
 * A React cache csak az adott kérésre él, tehát nem visz át állapotot
 * felhasználók vagy kérések között — ez itt biztonsági szempontból lényeges.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})
