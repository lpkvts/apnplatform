'use server'

import { createClient } from '@/lib/supabase/server'
import { currentRole, STAFF, type Role } from '@/lib/roles'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCareerItem(formData: FormData) {
  const { userId, role } = await currentRole()
  if (!userId || !STAFF.includes(role as Role)) return
  const supabase = await createClient()
  const str = (k: string) => { const v = String(formData.get(k) ?? '').trim(); return v === '' ? null : v }
  const arr = (k: string) => String(formData.get(k) ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  const title = str('title')
  const category = str('category')
  if (!title || !category) return
  await supabase.from('career_items').insert({
    category, title, org: str('org'), location: str('location'), url: str('url'),
    description: str('description'), tags: arr('tags'), specialty: arr('specialty'),
    deadline: str('deadline'), status: 'published', created_by: userId,
  })
  revalidatePath('/career')
  redirect('/career')
}

export async function deleteCareerItem(formData: FormData) {
  const { userId, role } = await currentRole()
  if (!userId || !STAFF.includes(role as Role)) return
  const supabase = await createClient()
  await supabase.from('career_items').delete().eq('id', String(formData.get('id') ?? ''))
  revalidatePath('/career')
  redirect('/career')
}
