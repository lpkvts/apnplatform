import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { STAFF, isAdmin, type Role } from '@/lib/roles'
import { APP_VERSION, CHANGE_KIND_META, changesSince, releasesAfterVersion, type ChangeKind } from '@/lib/changelog/data'
import { getFlag } from '@/lib/flags'

export interface Notif {
  id: string; icon: string; title: string; body?: string
  href?: string; when?: string; urgent?: boolean; stored?: boolean
  update?: boolean   // új szakmai tartalom / platform-frissítés (nem teendő)
}

function daysBetween(d: string): number {
  return Math.round((new Date(d).getTime() - Date.now()) / 86400000)
}

/**
 * Új szakmai tartalom a felhasználó legutóbbi megtekintése óta.
 *
 * Két forrásból dolgozik:
 *  1. adatbázis — betegségleírás, irányelv, labor paraméter (created_at / published_at),
 *  2. kódban tárolt tartalom — a lib/changelog/data.ts bejegyzései (Labor Kisokos,
 *     forrás-regiszter, témakörök, platform-verzió).
 *
 * Több azonos típusú tételt összevon, hogy egy nagyobb szállítás ne árassza el a listát.
 */
export async function getContentUpdates(): Promise<{ items: Notif[]; seenAt: string | null; seenVersion: string | null; version: string }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { items: [], seenAt: null, seenVersion: null, version: APP_VERSION }

  const { data: prof } = await supabase
    .from('profiles').select('updates_seen_at, updates_seen_version, created_at, role').eq('id', user.id)
    .maybeSingle<{ updates_seen_at: string | null; updates_seen_version: string | null; created_at: string; role: Role }>()

  // Ha még sosem nézte meg, a fiók létrejötte a kiindulópont — így nem kapja meg
  // visszamenőleg a regisztráció előtti teljes tartalmat.
  const since = prof?.updates_seen_at ?? prof?.created_at ?? null
  if (!since) return { items: [], seenAt: null, seenVersion: null, version: APP_VERSION }

  const items: Notif[] = []

  const [dzRes, glRes, labRes] = await Promise.all([
    supabase.from('diseases').select('id, name, slug, created_at')
      .eq('status', 'published').gt('created_at', since)
      .order('created_at', { ascending: false }).limit(20)
      .returns<{ id: string; name: string; slug: string; created_at: string }[]>(),
    supabase.from('guidelines').select('id, title, published_at')
      .eq('status', 'published').gt('published_at', since)
      .order('published_at', { ascending: false }).limit(20)
      .returns<{ id: string; title: string; published_at: string }[]>(),
    supabase.from('lab_parameters').select('id, name_hu, slug, created_at')
      .eq('status', 'active').gt('created_at', since)
      .order('created_at', { ascending: false }).limit(20)
      .returns<{ id: string; name_hu: string; slug: string; created_at: string }[]>(),
  ])

  // Kevés tételt nevesítünk, sokat összevonunk.
  const pushGroup = (
    kind: ChangeKind, prefix: string, list: { key: string; label: string; href: string }[],
    manyTitle: (n: number) => string, manyHref: string,
  ) => {
    if (list.length === 0) return
    const meta = CHANGE_KIND_META[kind]
    if (list.length <= 3) {
      for (const x of list) {
        items.push({ id: `${prefix}-${x.key}`, icon: meta.icon, title: `${meta.label}: ${x.label}`, body: 'Új tartalom került fel a platformra.', href: x.href, update: true })
      }
    } else {
      items.push({ id: `${prefix}-group`, icon: meta.icon, title: manyTitle(list.length), body: list.slice(0, 4).map((x) => x.label).join(', ') + (list.length > 4 ? ` és további ${list.length - 4}` : ''), href: manyHref, update: true })
    }
  }

  pushGroup('betegseg', 'dz',
    (dzRes.data ?? []).map((d) => ({ key: d.id, label: d.name, href: `/betegsegtar/${d.slug || d.id}` })),
    (n) => `${n} új betegségleírás`, '/betegsegtar')

  pushGroup('forras', 'gl',
    (glRes.data ?? []).map((g) => ({ key: g.id, label: g.title, href: `/klinika/tudastar/${g.id}` })),
    (n) => `${n} új klinikai irányelv`, '/klinika/tudastar')

  pushGroup('labor', 'lp',
    (labRes.data ?? []).map((l) => ({ key: l.id, label: l.name_hu, href: '/klinika/labor' })),
    (n) => `${n} új labor paraméter`, '/klinika/labor')

  // Kódban szállított tartalom (Labor Kisokos, forrás-regiszter, eszközök, verzió).
  // Elsődlegesen VERZIÓ szerint döntünk, mert a kiadás dátuma és a szerver napja
  // eltérhet; a dátum-összehasonlítás csak akkor jön szóba, ha a felhasználónak
  // még nincs rögzített verziója (a 0027 migráció előtti fiókok).
  // A felhasználók alapból csak a lényeges változásokról kapnak jelzést; a
  // teljes naplót külön kapcsoló engedi. Az adminisztrátorok mindig mindent
  // látnak, mert nekik a javítások követése is munkaeszköz.
  const showAll = (await getFlag('changelog_full', false)) || isAdmin(prof?.role as Role ?? null)
  const seenVersion = prof?.updates_seen_version ?? null
  const codeChanges = seenVersion
    ? releasesAfterVersion(seenVersion, showAll).flatMap((r) =>
        r.entries.map((e) => ({ ...e, date: r.date, version: r.version })),
      )
    : changesSince(since, showAll)

  for (const c of codeChanges) {
    const meta = CHANGE_KIND_META[c.kind]
    items.push({
      id: `ch-${c.id}`,
      icon: meta.icon,
      title: `${c.title} — v${c.version}`,
      body: c.body,
      href: c.href ?? '/ujdonsagok',
      when: c.date,
      update: true,
    })
  }

  return { items, seenAt: since, seenVersion: prof?.updates_seen_version ?? null, version: APP_VERSION }
}

export async function getNotifications(): Promise<{ items: Notif[]; count: number }> {
  const supabase = await createClient()
  const user = await getCurrentUser()
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

  const soon = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const { data: fups } = await supabase.from('clinical_case_followups').select('id, case_id, horizon, due_on, done').eq('done', false).lte('due_on', soon).returns<{ id: string; case_id: string; horizon: string | null; due_on: string | null; done: boolean }[]>()
  if (fups && fups.length) {
    const ids = [...new Set(fups.map((x) => x.case_id))]
    const { data: cs } = await supabase.from('clinical_cases').select('id, title, case_no').in('id', ids).returns<{ id: string; title: string; case_no: number }[]>()
    const byId = new Map((cs ?? []).map((x) => [x.id, x]))
    for (const fu of fups) { const cc = byId.get(fu.case_id); if (!cc) continue; items.push({ id: `fu-${fu.id}`, icon: 'assessment', title: 'Esedékes utánkövetés', body: `CASE #${String(cc.case_no).padStart(6, '0')} · ${cc.title}${fu.horizon ? ` (${fu.horizon})` : ''}`, href: `/klinika/esetek/${fu.case_id}`, urgent: !!(fu.due_on && fu.due_on <= today) }) }
  }

  // Új szakmai tartalom — a teendők után, saját jelöléssel
  const { items: updates } = await getContentUpdates()
  items.push(...updates)

  return { items, count: items.length }
}

/**
 * Csak az értesítések SZÁMA, egyetlen adatbázis-körben.
 *
 * A fejléc harangjához elég a szám. A teljes lista összeállítása több mint tíz
 * lekérdezés, amit korábban minden oldalbetöltésnél elvégeztünk — ez volt a
 * navigáció legnagyobb lassítója. A részletes listát a /ertesitesek oldal
 * továbbra is a getNotifications() függvénnyel állítja össze.
 */
export const getNotificationCount = cache(async (): Promise<number> => {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return 0

  const c = await rawCounts()
  if (!c) return 0

  // A több azonos típusú tételt a lista összevonja egy sorrá, ezért a számnál is
  // így teszünk — különben hét új betegségleírás hetet mutatna, a listában
  // viszont egy sor állna.
  const grouped = (n: number) => (n === 0 ? 0 : n <= 3 ? n : 1)

  const dbCount =
    c.stored + c.certs + c.reviews + c.followups +
    grouped(c.new_dz) + grouped(c.new_gl) + grouped(c.new_lab)

  // A kódban szállított újdonságok nem igényelnek adatbázis-hívást.
  const code = c.seen_version
    ? releasesAfterVersion(c.seen_version).reduce((n, r) => n + r.entries.length, 0)
    : changesSince(c.seen_at).length

  // Az adminisztrátori tételek ugyanabból a körből jönnek — külön lekérdezés
  // nélkül. Nem adminisztrátornál ezek nullák.
  const g = (n: number) => (n === 0 ? 0 : 1)
  const admin = c.is_admin
    ? g(c.adm_signup) + g(c.adm_role) + g(c.adm_content) + g(c.adm_flags)
    : 0

  return dbCount + code + admin
})

/* ─────────── Adminisztrátori értesítések ─────────── */

export interface RawCounts {
  stored: number; certs: number; reviews: number; followups: number
  new_dz: number; new_gl: number; new_lab: number
  seen_at: string | null; seen_version: string | null
  is_admin: boolean
  adm_signup: number; adm_role: number; adm_content: number; adm_flags: number
}

/**
 * Az összesítő lekérdezés — kérésenként egyszer.
 *
 * A felhasználói és az adminisztrátori számok egy körben érkeznek. Korábban két
 * külön hívás futott minden oldalbetöltésnél, a második olyanoknál is, akiknek
 * amúgy sem adott eredményt.
 */
const rawCounts = cache(async (): Promise<RawCounts | null> => {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return null
  const { data } = await supabase.rpc('notification_counts')
  return (data as RawCounts[] | null)?.[0] ?? null
})

export interface AdminCounts {
  uj_regisztracio: number
  uj_szerepkor: number
  uj_tartalom: number
  karbantartas_valtas: number
  seen_at: string | null
}

export interface Signup {
  id: string
  full_name: string | null
  specialty: string | null
  created_at: string
}

export interface AuditEvent {
  id: string
  action: string
  entity: string
  entity_title: string | null
  actor_email: string | null
  created_at: string
}

/**
 * Adminisztrátori összesítés — mi történt a legutóbbi megtekintés óta.
 *
 * Nem adminisztrátornak üres eredményt ad: a jogosultságot az adatbázis
 * függvénye érvényesíti, nem a felület.
 */
export const getAdminCounts = cache(async (): Promise<AdminCounts | null> => {
  const c = await rawCounts()
  if (!c || !c.is_admin) return null
  return {
    uj_regisztracio: c.adm_signup,
    uj_szerepkor: c.adm_role,
    uj_tartalom: c.adm_content,
    karbantartas_valtas: c.adm_flags,
    seen_at: c.seen_at,
  }
})

export async function getRecentSignups(limit = 10): Promise<Signup[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('admin_recent_signups', { p_limit: limit })
  return (data as Signup[] | null) ?? []
}

export async function getRecentEvents(limit = 15): Promise<AuditEvent[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('admin_recent_events', { p_limit: limit })
  return (data as AuditEvent[] | null) ?? []
}

/** Magyar megnevezés a naplóesemény típusához. */
export function eventLabel(e: AuditEvent): string {
  const ENTITY: Record<string, string> = {
    profiles: 'Felhasználó', diseases: 'Betegségleírás', guidelines: 'Irányelv',
    lab_parameters: 'Laborparaméter', feature_flags: 'Beállítás',
    clinical_cases: 'Klinikai eset', competencies: 'Kompetencia',
  }
  const ACTION: Record<string, string> = {
    insert: 'létrehozva', update: 'módosítva', delete: 'törölve', role_change: 'szerepkör módosítva',
  }
  return `${ENTITY[e.entity] ?? e.entity} ${ACTION[e.action] ?? e.action}`
}

/* ─────────── Kezdőlapi áttekintés ─────────── */

export interface DashCounts {
  /** Esedékes teendők a saját klinikai eseteken. */
  followups: number
  /** Hatvan napon belül lejáró tanúsítványok. */
  certs: number
  /** Olvasatlan értesítések. */
  stored: number
  /** Új szakmai tartalom a legutóbbi megtekintés óta. */
  ujTartalom: number
  /** Felülvizsgálatra váró irányelvek — szerkesztőnek, lektornak, adminnak. */
  reviews: number
}

/**
 * A kezdőlap áttekintő sávjának adatai.
 *
 * Ugyanabból a lekérdezésből dolgozik, mint az értesítésszám — nem jelent
 * külön adatbázis-kört.
 */
export const getDashCounts = cache(async (): Promise<DashCounts | null> => {
  const c = await rawCounts()
  if (!c) return null
  return {
    followups: c.followups,
    certs: c.certs,
    stored: c.stored,
    ujTartalom: c.new_dz + c.new_gl + c.new_lab,
    reviews: c.reviews,
  }
})
