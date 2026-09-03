import { createClient } from '@/lib/supabase/server'
import type { Inquiry } from './types'

export * from './types'

/** A megkeresések, az újak elöl. Csak adminisztrátornak ad eredményt. */
export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('inquiry_list')
  return (data as Inquiry[] | null) ?? []
}
