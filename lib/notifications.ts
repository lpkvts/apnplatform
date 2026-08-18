import { createClient } from '@/lib/supabase/server'
import { STAFF, type Role } from '@/lib/roles'

export interface Notif {
  id: string; icon: string; title: string; body?: string
  href?: string; when?: string; urgent?: boolean; stored?: boolean
}

function daysBetween(d: string): number {
  return Math.round((new Date(d).getTime() - Date.now()) / 86400000)
}

export async function getNotifications(): Promise<{ items: Notif[]; count: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { items: [], count: 0 }

  const today = new Date().toISOString().slice(0, 10)
  const in60 = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10)

  // Párhuzamos lekérdezések
  const [profRes, storedRes, certRes] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).maybeSingle<{ role: Role }>(),
    supabase.from('notifications').select('id, kind, title, body, link, created_at')
      .eq('read', false).order('created_at', { ascending: false })
      .returns<{ id: string; kind: string; title: string; body: string | null; link: string | null; created_at: string }[]>(),
    supabase.from('certifications').select('id, title, expires_on')
      .gte('expires_on', today).lte('expires_on', in60)
      .returns<{ id: string; title: string; expires_on: string }[]>(),
  ])

  const role = profRes.data?.role ?? null
  const isStaff = !!role && STAFF.includes(role)
  const items: Notif[] = []
  const KIND_ICON: Record<string, string> = { guideline: 'book', review: 'assessment', cert: 'bell' }

  for (const n of storedRes.data ?? []) {
    items.push({ id: n.id, icon: KIND_ICON[n.kind] ?? 'bell', title: n.title, body: n.body ?? undefined, href: n.link ?? undefined, stored: true })
  }
  for (const c of certRes.data ?? []) {
    const d = daysBetween(c.expires_on)
    items.push({ id: `c-${c.id}`, icon: 'bell', title: 'Lejáró tanúsítvány', body: `${c.title} — ${d} nap múlva jár le.`, href: '/profil', urgent: d <= 30 })
  }

  // Staff: dátumalapú felülvizsgálati jelzés
  if (isStaff) {
    const { data: review } = await supabase
      .from('guidelines').select('id, title, status, review_on, expires_on')
      .eq('status', 'published')
      .returns<{ id: string; title: string; status: string; review_on: string | null; expires_on: string | null }[]>()
    for (const g of review ?? []) {
      if ((g.review_on && g.review_on <= today) || (g.expires_on && g.expires_on <= today)) {
        items.push({ id: `x-${g.id}`, icon: 'assessment', title: 'Felülvizsgálat esedékes', body: g.title, href: '/cms', urgent: true })
      }
    }
  }

  // Esedékes utánkövetések (saját esetek)
  const soon = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const { data: fups } = await supabase.from('clinical_case_followups')
    .select('id, case_id, horizon, due_on, done').eq('done', false).lte('due_on', soon)
    .returns<{ id: string; case_id: string; horizon: string | null; due_on: string | null; done: boolean }[]>()
  if (fups && fups.length) {
    const ids = [...new Set(fups.map((x) => x.case_id))]
    const { data: cs } = await supabase.from('clinical_cases').select('id, title, case_no').in('id', ids)
      .returns<{ id: string; title: string; case_no: number }[]>()
    const byId = new Map((cs ?? []).map((x) => [x.id, x]))
    for (const fu of fups) {
      const cc = byId.get(fu.case_id)
      if (!cc) continue
      items.push({
        id: `fu-${fu.id}`, icon: 'assessment', title: 'Esedékes utánkövetés',
        body: `CASE #${String(cc.case_no).padStart(6, '0')} · ${cc.title}${fu.horizon ? ` (${fu.horizon})` : ''}`,
        href: `/klinika/esetek/${fu.case_id}`, urgent: !!(fu.due_on && fu.due_on <= today),
      })
    }
  }

  return { items, count: items.length }
}
