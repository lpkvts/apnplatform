'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { currentRole } from '@/lib/roles'
import type { ContributorRole } from './types'

/**
 * Közreműködők kezelése.
 *
 * Szerkesztői vagy adminisztrátori jogosultságot igényel; ezt az adatbázis
 * szabálya is érvényesíti, a műveletek csak korán jelzik a hiányt.
 */

function jogosult(role: string | null): boolean {
  return role === 'admin' || role === 'szerkeszto'
}

export interface MentesEredmeny { ok: boolean; hiba?: string }

export async function saveContributor(fd: FormData): Promise<MentesEredmeny> {
  const { role } = await currentRole()
  if (!jogosult(role)) return { ok: false, hiba: 'Nincs jogosultságod ehhez.' }

  const nev = String(fd.get('name') ?? '').trim()
  if (!nev) return { ok: false, hiba: 'A név megadása kötelező.' }

  const szerepek = fd.getAll('roles').map(String) as ContributorRole[]
  const teruletek = String(fd.get('specialties') ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean)

  const adat = {
    name: nev,
    title: String(fd.get('title') ?? '').trim() || null,
    organization: String(fd.get('organization') ?? '').trim() || null,
    roles: szerepek,
    specialties: teruletek,
    note: String(fd.get('note') ?? '').trim() || null,
    ord: Number(fd.get('ord') ?? 100) || 100,
    featured: fd.get('featured') === 'on',
    publish_status: (fd.get('publish_status') === 'published'
      ? 'published' : 'draft') as 'published' | 'draft',
    updated_at: new Date().toISOString(),
  }

  const supabase = await createClient()
  const id = String(fd.get('id') ?? '')

  const { error } = id
    ? await supabase.from('contributors').update(adat).eq('id', id)
    : await supabase.from('contributors').insert(adat)

  if (error) return { ok: false, hiba: 'A mentés nem sikerült.' }

  revalidatePath('/kozremukodok')
  revalidatePath('/cms/kozremukodok')
  return { ok: true }
}

export async function deleteContributor(id: string): Promise<MentesEredmeny> {
  const { role } = await currentRole()
  if (!jogosult(role)) return { ok: false, hiba: 'Nincs jogosultságod ehhez.' }

  const supabase = await createClient()
  const { error } = await supabase.from('contributors').delete().eq('id', id)
  if (error) return { ok: false, hiba: 'A törlés nem sikerült.' }

  revalidatePath('/kozremukodok')
  revalidatePath('/cms/kozremukodok')
  return { ok: true }
}
