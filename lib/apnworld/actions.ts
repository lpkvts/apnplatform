'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * APN World — adminisztrátori műveletek.
 *
 * A jogosultságot az adatbázis szabályai érvényesítik: csak adminisztrátor
 * és szerkesztő írhat. A közzététel külön lépés, hogy a félkész profil ne
 * jelenjen meg a felhasználóknál.
 */

export interface Res { ok: boolean; message: string }

const t = (form: FormData, k: string) => {
  const v = form.get(k)
  const s = typeof v === 'string' ? v.trim() : ''
  return s === '' ? null : s
}

/** Sorokra bontott mező tömbbé — a felületen így egyszerűbb szerkeszteni. */
const sorok = (form: FormData, k: string): string[] => {
  const v = form.get(k)
  if (typeof v !== 'string') return []
  return v.split('\n').map((x) => x.trim()).filter(Boolean)
}

export async function saveCountry(id: string | null, form: FormData): Promise<Res> {
  const code = t(form, 'code')?.toUpperCase()
  const name = t(form, 'name')
  if (!code || code.length !== 2) return { ok: false, message: 'Az országkód két betű legyen.' }
  if (!name) return { ok: false, message: 'Az ország neve kötelező.' }

  const adat = {
    code,
    name,
    name_en: t(form, 'name_en'),
    flag: t(form, 'flag'),
    region: t(form, 'region') ?? 'europe',
    status: t(form, 'status') ?? 'limited',
    data_confidence: t(form, 'data_confidence') ?? 'limited',
    prescribing: t(form, 'prescribing') ?? 'unknown',
    prescribing_note: t(form, 'prescribing_note'),
    autonomy: t(form, 'autonomy') ?? 'unknown',
    autonomy_note: t(form, 'autonomy_note'),
    primary_care: t(form, 'primary_care') ?? 'unknown',
    primary_care_areas: sorok(form, 'primary_care_areas'),
    hospital_areas: sorok(form, 'hospital_areas'),
    strengths: sorok(form, 'strengths'),
    challenges: sorok(form, 'challenges'),
    description: t(form, 'description'),
    why_interesting: t(form, 'why_interesting'),
    last_verified: t(form, 'last_verified'),
    updated_at: new Date().toISOString(),
  }

  const supabase = await createClient()
  const { error } = id
    ? await supabase.from('apn_countries').update(adat).eq('id', id)
    : await supabase.from('apn_countries').insert({ ...adat, publish_status: 'draft' })

  if (error) return { ok: false, message: error.message }

  revalidatePath('/cms/apn-world')
  revalidatePath('/apn-world')
  return { ok: true, message: id ? 'Az országprofil mentve.' : 'Az országprofil létrehozva, piszkozatként.' }
}

export async function setCountryStatus(
  id: string, publish_status: 'draft' | 'review' | 'published',
): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('apn_countries')
    .update({ publish_status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/cms/apn-world')
  revalidatePath('/apn-world')
  const L = { draft: 'piszkozatba téve', review: 'elbírálásra küldve', published: 'közzétéve' }
  return { ok: true, message: `Az országprofil ${L[publish_status]}.` }
}

export async function deleteCountry(id: string): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase.from('apn_countries').delete().eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/cms/apn-world')
  return { ok: true, message: 'Az országprofil törölve.' }
}

/* ─────────── Források ─────────── */

export async function addSource(countryId: string, form: FormData): Promise<Res> {
  const title = t(form, 'title')
  if (!title) return { ok: false, message: 'A forrás címe kötelező.' }

  const supabase = await createClient()
  const { error } = await supabase.from('apn_sources').insert({
    country_id: countryId,
    title,
    org: t(form, 'org'),
    url: t(form, 'url'),
    accessed_on: new Date().toISOString().slice(0, 10),
  })
  if (error) return { ok: false, message: error.message }
  revalidatePath('/cms/apn-world')
  return { ok: true, message: 'A forrás hozzáadva.' }
}

export async function deleteSource(id: string): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase.from('apn_sources').delete().eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/cms/apn-world')
  return { ok: true, message: 'A forrás törölve.' }
}
