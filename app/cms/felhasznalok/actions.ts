'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { currentRole, isAdmin } from '@/lib/roles'
import { siteUrl } from '@/lib/site-url'

export interface ActionResult { ok: boolean; message: string }

const MIN_PASSWORD = 12

/** Közös belépőpont: minden művelet előtt ellenőrizzük az admin jogot. */
async function requireAdmin(): Promise<{ ok: true; userId: string } | { ok: false; message: string }> {
  const { userId, role } = await currentRole()
  if (!userId) return { ok: false, message: 'Nincs bejelentkezve.' }
  if (!isAdmin(role)) return { ok: false, message: 'Ehhez admin jogosultság szükséges.' }
  return { ok: true, userId }
}

/** Audit bejegyzés. A jelszó értékét soha nem adjuk át. */
async function log(action: string, targetId: string, targetTitle: string, details: Record<string, unknown> = {}) {
  const supabase = await createClient()
  await supabase.rpc('admin_log', {
    p_action: action, p_entity: 'user', p_entity_id: targetId,
    p_entity_title: targetTitle, p_details: details,
  })
}

/* ─────────────── Profiladatok szerkesztése ─────────────── */

export async function adminUpdateProfile(targetId: string, form: FormData): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false, message: guard.message }

  const str = (k: string) => {
    const v = form.get(k)
    const s = typeof v === 'string' ? v.trim() : ''
    return s === '' ? null : s
  }
  const yearRaw = str('qual_year')
  const qual_year = yearRaw ? parseInt(yearRaw, 10) : null
  if (yearRaw && (isNaN(qual_year!) || qual_year! < 1900 || qual_year! > 2100)) {
    return { ok: false, message: 'A végzettség éve nem érvényes.' }
  }

  const patch = {
    full_name: str('full_name'),
    apn_type: str('apn_type'),
    title: str('title'),
    workplace: str('workplace'),
    specialty: str('specialty'),
    qualification: str('qualification'),
    qual_year,
    registration_no: str('registration_no'),
    phone: str('phone'),
    updated_at: new Date().toISOString(),
  }

  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update(patch).eq('id', targetId)
  if (error) return { ok: false, message: `Nem sikerült menteni: ${error.message}` }

  await log('profile_update', targetId, patch.full_name ?? '(névtelen)', { fields: Object.keys(patch) })
  revalidatePath(`/cms/felhasznalok/${targetId}`)
  revalidatePath('/cms/felhasznalok')
  return { ok: true, message: 'A profiladatok mentve.' }
}

/* ─────────────── Szerepkör ─────────────── */

export async function adminSetRole(targetId: string, role: string, name: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false, message: guard.message }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_set_role', { p_id: targetId, p_role: role })
  if (error) return { ok: false, message: `Nem sikerült: ${error.message}` }
  if (data !== 'ok') return { ok: false, message: String(data) }

  await log('role_change', targetId, name, { to: role })
  revalidatePath(`/cms/felhasznalok/${targetId}`)
  revalidatePath('/cms/felhasznalok')
  return { ok: true, message: `A szerepkör módosítva: ${role}.` }
}

/* ─────────────── Jelszó ─────────────── */

export async function adminSetPassword(targetId: string, form: FormData, name: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false, message: guard.message }

  const pw = String(form.get('password') ?? '')
  const pw2 = String(form.get('password2') ?? '')
  if (pw.length < MIN_PASSWORD) return { ok: false, message: `A jelszó legalább ${MIN_PASSWORD} karakter legyen.` }
  if (pw !== pw2) return { ok: false, message: 'A két jelszó nem egyezik.' }
  if (!/[0-9]/.test(pw) || !/[a-zA-Z]/.test(pw)) {
    return { ok: false, message: 'A jelszó tartalmazzon betűt és számot is.' }
  }

  const admin = createAdminClient()
  if (!admin) {
    return { ok: false, message: 'A jelszókezelés nincs beállítva: hiányzik a SUPABASE_SERVICE_ROLE_KEY környezeti változó.' }
  }

  const { error } = await admin.auth.admin.updateUserById(targetId, { password: pw })
  if (error) return { ok: false, message: `Nem sikerült: ${error.message}` }

  // A jelszó értéke SEHOL nem kerül naplózásra — csak a művelet ténye.
  await log('password_set', targetId, name, { by: 'admin' })
  revalidatePath(`/cms/felhasznalok/${targetId}`)
  return { ok: true, message: 'Az új jelszó beállítva. Add át a felhasználónak biztonságos csatornán, és kérd meg, hogy változtassa meg.' }
}

/** Alternatíva: a felhasználó maga állítsa be — az admin nem ismeri meg a jelszót. */
export async function adminSendRecovery(targetId: string, email: string, name: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false, message: guard.message }
  if (!email) return { ok: false, message: 'Ehhez a fiókhoz nincs e-mail cím.' }

  const admin = createAdminClient()
  if (!admin) {
    return { ok: false, message: 'Hiányzik a SUPABASE_SERVICE_ROLE_KEY környezeti változó.' }
  }

  // A visszatérési címet itt adjuk meg, nem a levélsablonban — a sablonok csak
  // saját SMTP mellett szerkeszthetők, ez viszont anélkül is működik.
  const base = await siteUrl()
  const { error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${base}/auth/confirm?next=/auth/uj-jelszo` },
  })
  if (error) return { ok: false, message: `Nem sikerült: ${error.message}` }

  await log('password_recovery_sent', targetId, name, { email })
  return { ok: true, message: 'Jelszó-visszaállító levél elküldve a felhasználónak.' }
}

/* ─────────────── E-mail cím ─────────────── */

export async function adminSetEmail(targetId: string, form: FormData, name: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false, message: guard.message }

  const email = String(form.get('email') ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: 'Az e-mail cím formátuma nem érvényes.' }

  const admin = createAdminClient()
  if (!admin) return { ok: false, message: 'Hiányzik a SUPABASE_SERVICE_ROLE_KEY környezeti változó.' }

  const { error } = await admin.auth.admin.updateUserById(targetId, { email, email_confirm: true })
  if (error) return { ok: false, message: `Nem sikerült: ${error.message}` }

  await log('email_change', targetId, name, { to: email })
  revalidatePath(`/cms/felhasznalok/${targetId}`)
  revalidatePath('/cms/felhasznalok')
  return { ok: true, message: 'Az e-mail cím módosítva.' }
}

/* ─────────────── Fiók letiltása / feloldása ─────────────── */

export async function adminSetBan(targetId: string, ban: boolean, name: string): Promise<ActionResult> {
  const guard = await requireAdmin()
  if (!guard.ok) return { ok: false, message: guard.message }
  if (targetId === guard.userId) return { ok: false, message: 'A saját fiókodat nem tilthatod le.' }

  const admin = createAdminClient()
  if (!admin) return { ok: false, message: 'Hiányzik a SUPABASE_SERVICE_ROLE_KEY környezeti változó.' }

  // A 'none' oldja fel a tiltást; a hosszú időtartam gyakorlatilag határozatlan letiltás.
  const { error } = await admin.auth.admin.updateUserById(targetId, {
    ban_duration: ban ? '876000h' : 'none',
  })
  if (error) return { ok: false, message: `Nem sikerült: ${error.message}` }

  await log(ban ? 'user_banned' : 'user_unbanned', targetId, name, {})
  revalidatePath(`/cms/felhasznalok/${targetId}`)
  revalidatePath('/cms/felhasznalok')
  return { ok: true, message: ban ? 'A fiók letiltva — a felhasználó nem tud belépni.' : 'A fiók letiltása feloldva.' }
}
