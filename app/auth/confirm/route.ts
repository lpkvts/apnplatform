import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * E-mailes hitelesítő linkek fogadása.
 *
 * Kétféle linket kell kezelnünk, mert a Supabase levélsablonjai csak saját SMTP
 * mellett szerkeszthetők:
 *
 *  1. `?code=…`  — az ALAPÉRTELMEZETT sablon ezt küldi. A link előbb a Supabase
 *     verify végpontjára megy, onnan ide irányít át egy egyszer használható
 *     kóddal, amit munkamenetre váltunk.
 *  2. `?token_hash=…&type=…` — ezt akkor kapjuk, ha a sablonokat átírtuk a
 *     `{{ .TokenHash }}` változóra (saját SMTP esetén ez a javasolt).
 *
 * Így a beállítás mindkét állapotában működik a jelszó-visszaállítás.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const fail = (msg: string) =>
    NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(msg)}`, origin))

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return fail('A link érvénytelen vagy lejárt. Kérj újat.')
    return NextResponse.redirect(new URL(next, origin))
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (error) return fail('A link érvénytelen vagy lejárt. Kérj újat.')
    return NextResponse.redirect(
      new URL(type === 'recovery' ? '/auth/uj-jelszo' : next, origin),
    )
  }

  return fail('Hiányzó vagy hibás hitelesítő link.')
}
