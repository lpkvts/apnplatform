'use server'

import { createClient } from '@/lib/supabase/server'
import { currentRole, STAFF, PUBLISHERS, type Role } from '@/lib/roles'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function parseSections(raw: string): [string, string][] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const idx = l.indexOf('|')
      return idx >= 0
        ? ([l.slice(0, idx).trim(), l.slice(idx + 1).trim()] as [string, string])
        : (['', l] as [string, string])
    })
}

export async function saveGuideline(formData: FormData) {
  const { userId, role } = await currentRole()
  if (!userId || !STAFF.includes(role as Role)) return
  const supabase = await createClient()

  const id = String(formData.get('id') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  if (!title) return
  const summary = String(formData.get('summary') ?? '').trim()
  const specialty = String(formData.get('specialty') ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean)
  const source_name = String(formData.get('source_name') ?? '').trim()
  const source_url = String(formData.get('source_url') ?? '').trim()
  const version = String(formData.get('version') ?? '').trim()
  const review_on = String(formData.get('review_on') ?? '') || null
  const expires_on = String(formData.get('expires_on') ?? '') || null
  const ai_generated = formData.get('ai_generated') === 'on'
  const sections = parseSections(String(formData.get('sections') ?? ''))

  // meglévő body megőrzése (refs), szerkesztéskor
  let prevRefs: string[] = []
  if (id) {
    const { data } = await supabase.from('guidelines').select('body').eq('id', id).maybeSingle<{ body: { refs?: string[] } }>()
    prevRefs = data?.body?.refs ?? []
  }

  const body = {
    sections,
    refs: prevRefs,
    source_name,
    source_url,
    updated: new Date().toISOString().slice(0, 10),
    validity: 'ervenyes',
    version,
    evidence: '',
  }

  if (id) {
    await supabase.from('guidelines').update({
      title, summary, specialty, body, version, review_on, expires_on, ai_generated,
    }).eq('id', id)
  } else {
    await supabase.from('guidelines').insert({
      title, summary, specialty, body, version, review_on, expires_on, ai_generated,
      status: 'draft', created_by: userId,
    })
  }
  revalidatePath('/cms')
  redirect('/cms')
}

export async function transitionGuideline(formData: FormData) {
  const { userId, role } = await currentRole()
  if (!userId || !STAFF.includes(role as Role)) return
  const supabase = await createClient()
  const id = String(formData.get('id') ?? '')
  const action = String(formData.get('action') ?? '')

  const { data: g } = await supabase.from('guidelines').select('status, ai_generated').eq('id', id).maybeSingle<{ status: string; ai_generated: boolean }>()
  if (!g) return

  const patch: Record<string, unknown> = {}
  if (action === 'submit' && g.status === 'draft') patch.status = 'review'
  else if (action === 'reject' && g.status === 'review') patch.status = 'draft'
  else if (action === 'publish' && g.status === 'review') {
    // AI-tartalom sem publikálható automatikusan: csak review után, publisher szereppel
    if (!PUBLISHERS.includes(role as Role)) return
    patch.status = 'published'
    patch.reviewed_by = userId
    patch.published_at = new Date().toISOString()
  } else if (action === 'expire' && g.status === 'published') {
    if (!PUBLISHERS.includes(role as Role)) return
    patch.status = 'expired'
  } else if (action === 'revoke') {
    if (!PUBLISHERS.includes(role as Role)) return
    patch.status = 'draft'
  } else return

  await supabase.from('guidelines').update(patch).eq('id', id)
  revalidatePath('/cms')
  revalidatePath('/klinika/tudastar')
}
