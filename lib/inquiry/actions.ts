'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Képzőhelyi érdeklődés beküldése.
 *
 * Bejelentkezés nélkül is működik: az érdeklődő jellemzően még nem
 * felhasználó. Csak annyi adatot kérünk, amennyi a visszahíváshoz kell.
 */

export interface Res { ok: boolean; message: string }

const t = (v: FormDataEntryValue | null) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s === '' ? null : s
}

export async function sendInquiry(form: FormData): Promise<Res> {
  const institution = t(form.get('institution'))
  const contact_name = t(form.get('contact_name'))
  const email = t(form.get('email'))

  if (!institution) return { ok: false, message: 'Az intézmény neve kötelező.' }
  if (!contact_name) return { ok: false, message: 'A kapcsolattartó neve kötelező.' }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Adj meg egy érvényes e-mail címet.' }
  }

  // Egyszerű robotszűrő: a rejtett mezőt csak automata tölti ki. Sikert
  // jelzünk vissza, hogy ne derüljön ki, mi buktatta le.
  if (t(form.get('website'))) return { ok: true, message: 'Köszönjük a megkeresést.' }

  const supabase = await createClient()
  const { error } = await supabase.from('institution_inquiries').insert({
    institution,
    contact_name,
    email,
    phone: t(form.get('phone')),
    student_count: t(form.get('student_count')),
    message: t(form.get('message')),
    status: 'new',
  })

  if (error) return { ok: false, message: 'A beküldés nem sikerült. Próbáld újra később.' }
  return {
    ok: true,
    message: 'Néhány napon belül keresünk a megadott elérhetőségen.',
  }
}

/* ─────────── Adminisztrátori kezelés ─────────── */

export async function setInquiryStatus(
  id: string, status: 'new' | 'contacted' | 'closed', note?: string,
): Promise<Res> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('institution_inquiries')
    .update({ status, admin_note: note?.trim() || null })
    .eq('id', id)
  if (error) return { ok: false, message: error.message }
  revalidatePath('/cms/erdeklodesek')
  return { ok: true, message: 'Állapot frissítve.' }
}
