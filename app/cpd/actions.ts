'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { revalidatePath } from 'next/cache'

export async function addCpdEntry(formData: FormData) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return

  const title = String(formData.get('title') ?? '').trim()
  const points = Number(formData.get('points') ?? 0)
  const activity_date =
    String(formData.get('activity_date') ?? '') || new Date().toISOString().slice(0, 10)

  if (!title) return

  await supabase.from('cpd_entries').insert({
    user_id: user.id,
    title,
    points: isFinite(points) ? points : 0,
    activity_date,
  })

  revalidatePath('/cpd')
  revalidatePath('/')
}
