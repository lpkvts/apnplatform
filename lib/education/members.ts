'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { EduRole } from './types'

/**
 * Oktatási tagság kezelése.
 *
 * A platformon két, egymástól független szerepkör-rendszer működik. A
 * platform-szintű szerepkör (APN, szerkesztő, lektor, adminisztrátor) azt
 * szabályozza, ki mit szerkeszthet a tartalomban. Az oktatási szerepkör
 * viszont intézményhez kötött: ugyanaz a személy az egyik képzőhelyen
 * oktató, a másikon hallgató lehet.
 *
 * Ezt a tagságot eddig csak közvetlenül az adatbázisban lehetett beállítani.
 * Az itteni műveletek adják hozzá a felületet — intézményi adminisztrátori
 * jogosultsággal, amit az adatbázis szintjén is ellenőrzünk.
 */

export interface EduMemberRow {
  id: string
  user_id: string
  role: EduRole
  joined_at: string
  full_name: string | null
  email: string | null
}

/** Egy intézmény tagjai, névsorban. */
export async function getMembers(institutionId: string): Promise<EduMemberRow[]> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('edu_members', { p_institution: institutionId })
  return (data as EduMemberRow[] | null) ?? []
}

/**
 * Tag felvétele e-mail alapján.
 *
 * A megadott címhez tartozó felhasználónak már regisztrálnia kell — ez
 * szándékos: így nem lehet olyan címre jogosultságot adni, amit senki nem
 * birtokol. Ha nincs ilyen fiók, a művelet ezt mondja meg.
 */
export async function addMember(
  institutionId: string,
  email: string,
  role: EduRole,
): Promise<{ ok: boolean; hiba?: string }> {
  const supabase = await createClient()
  const tiszta = email.trim().toLowerCase()
  if (!tiszta) return { ok: false, hiba: 'Az e-mail-cím megadása kötelező.' }

  const { data: talalat } = await supabase.rpc('edu_find_user', {
    p_institution: institutionId,
    p_email: tiszta,
  })
  const profil = (talalat as { user_id: string }[] | null)?.[0]

  if (!profil) {
    return {
      ok: false,
      hiba: 'Nincs ilyen e-mail-címmel regisztrált felhasználó. '
        + 'Kérd meg, hogy előbb hozzon létre fiókot.',
    }
  }

  const { error } = await supabase.from('education_members').insert({
    institution_id: institutionId,
    user_id: profil.user_id,
    role,
  })

  if (error) {
    // A táblán egyedi megszorítás áll az intézmény és a felhasználó párján.
    if (error.code === '23505') {
      return { ok: false, hiba: 'Ez a felhasználó már tagja az intézménynek.' }
    }
    return { ok: false, hiba: 'A felvétel nem sikerült. Nincs jogosultságod hozzá?' }
  }

  revalidatePath('/oktatas/tagok')
  return { ok: true }
}

/** Szerepkör módosítása. */
export async function setMemberRole(
  memberId: string,
  role: EduRole,
): Promise<{ ok: boolean; hiba?: string }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('education_members').update({ role }).eq('id', memberId)

  if (error) return { ok: false, hiba: 'A módosítás nem sikerült.' }
  revalidatePath('/oktatas/tagok')
  return { ok: true }
}

/**
 * Tag eltávolítása.
 *
 * Az utolsó adminisztrátort nem engedjük eltávolítani: enélkül az
 * intézmény kezelhetetlenné válna, és csak adatbázis-hozzáféréssel lehetne
 * helyreállítani.
 */
export async function removeMember(
  institutionId: string,
  memberId: string,
): Promise<{ ok: boolean; hiba?: string }> {
  const supabase = await createClient()

  const { data: tag } = await supabase
    .from('education_members').select('role').eq('id', memberId).maybeSingle()

  if (tag?.role === 'admin') {
    const { count } = await supabase
      .from('education_members')
      .select('id', { count: 'exact', head: true })
      .eq('institution_id', institutionId)
      .eq('role', 'admin')

    if ((count ?? 0) <= 1) {
      return {
        ok: false,
        hiba: 'Ez az utolsó adminisztrátor. Előbb jelölj ki mást, '
          + 'különben az intézmény kezelhetetlenné válna.',
      }
    }
  }

  const { error } = await supabase.from('education_members').delete().eq('id', memberId)
  if (error) return { ok: false, hiba: 'Az eltávolítás nem sikerült.' }

  revalidatePath('/oktatas/tagok')
  return { ok: true }
}
