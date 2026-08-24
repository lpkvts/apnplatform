'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAllFavoriteKeys(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase.from('favorites').select('item_type, item_id').eq('user_id', user.id).returns<{ item_type: string; item_id: string }[]>()
  return (data ?? []).map((f) => `${f.item_type}:${f.item_id}`)
}

export async function getFavoritesByType(type: string): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase.from('favorites').select('item_id').eq('user_id', user.id).eq('item_type', type).returns<{ item_id: string }[]>()
  return (data ?? []).map((f) => f.item_id)
}

export async function toggleFavorite(type: string, id: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data: existing } = await supabase.from('favorites').select('item_id').eq('user_id', user.id).eq('item_type', type).eq('item_id', id).maybeSingle()
  if (existing) {
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_type', type).eq('item_id', id)
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, item_type: type, item_id: id })
  }
  revalidatePath('/kedvencek'); revalidatePath('/')
  return true
}
