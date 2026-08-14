import { createClient } from '@/lib/supabase/server'
import { STAFF, type Role } from '@/lib/roles'

export interface Notif {
  id: string
  icon: string          // Icon név
  title: string
  body?: string
  href?: string
  when?: string
  urgent?: boolean
  stored?: boolean      // tárolt (olvasottá tehető) vagy származtatott
}

function daysBetween(d: string): number {
  return Math.round((new Date(d).getTime() - Date.now()) / 86400000)
}

export async function getNotifications(): Promise<{ items: Notif[]; count: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { items: [], count: 0 }

  const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle<{ role: Role }>()
  const role = prof?.role ?? null
  const isStaff = !!role && STAFF.includes(role)
  const today = new Date().toISOString().slice(0, 10)
  const in60 = new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10)
  const items: Notif[] = []

  // 1) Tárolt, olvasatlan értesítések
  const { data: stored } = await supabase
    .from('notifications').select('id, kind, title, body, created_at')
    .eq('read', false).order('created_at', { ascending: false })
    .returns<{ id: string; kind: string; title: string; body: string | null; created_at: string }[]>()
  for (const n of stored ?? []) {
    items.push({ id: n.id, icon: 'bell', title: n.title, body: n.body ?? undefined, stored: true })
  }

  // 3) Új irányelvek (utolsó 14 nap)
  const { data: guides } = await supabase
    .from('guidelines').select('id, title, published_at')
    .eq('status', 'published').order('published_at', { ascending: false }).limit(5)
    .returns<{ id: string; title: string; published_at: string | null }[]>()
  for (const g of guides ?? []) {
    if (g.published_at && daysBetween(g.published_at) >= -14) {
      items.push({ id: `g-${g.id}`, icon: 'book', title: 'Új irányelv', body: g.title, href: `/klinika/tudastar/${g.id}` })
    }
  }

  // 4) Lejáró tanúsítványok (következő 60 nap)
  const { data: certs } = await supabase
    .from('certifications').select('id, title, expires_on')
    .gte('expires_on', today).lte('expires_on', in60)
    .returns<{ id: string; title: string; expires_on: string }[]>()
  for (const c of certs ?? []) {
    const d = daysBetween(c.expires_on)
    items.push({ id: `c-${c.id}`, icon: 'bell', title: 'Lejáró tanúsítvány', body: `${c.title} — ${d} nap múlva jár le.`, href: '/profil', urgent: d <= 30 })
  }

  // 5) Staff: lektorálási / felülvizsgálati sor
  if (isStaff) {
    const { data: review } = await supabase
      .from('guidelines').select('id, title, status, review_on, expires_on')
      .returns<{ id: string; title: string; status: string; review_on: string | null; expires_on: string | null }[]>()
    for (const g of review ?? []) {
      if (g.status === 'review') {
        items.push({ id: `r-${g.id}`, icon: 'assessment', title: 'Lektorálásra vár', body: g.title, href: '/cms' })
      } else if (g.status === 'published' && ((g.review_on && g.review_on <= today) || (g.expires_on && g.expires_on <= today))) {
        items.push({ id: `x-${g.id}`, icon: 'assessment', title: 'Felülvizsgálat esedékes', body: g.title, href: '/cms', urgent: true })
      }
    }
  }

  return { items, count: items.length }
}
