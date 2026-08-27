import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * E-mailes hitelesítő linkek fogadása.
 *
 * A Supabase által küldött levelek ide vezetnek: regisztráció megerősítése,
 * jelszó-visszaállítás, e-mail-cím módosítás és meghívó. A link egyszer
 * használható tokent hoz, amit itt váltunk munkamenetre.
 *
 * A levélsablonokban a `{{ .TokenHash }}` változót kell használni — a régi
 * `{{ .ConfirmationURL }}` a böngésző URL-töredékében adná vissza a tokent,
 * amit szerver oldalon nem lehet elolvasni.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  const fail = (msg: string) =>
    NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(msg)}`, origin))

  if (!tokenHash || !type) {
    return fail('Hiányzó vagy hibás hitelesítő link.')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })

  if (error) {
    // A leggyakoribb ok, hogy a link lejárt vagy már felhasználták.
    return fail('A link érvénytelen vagy lejárt. Kérj újat.')
  }

  // Jelszó-visszaállításnál a felhasználó most már be van jelentkezve,
  // de új jelszót kell megadnia, mielőtt továbbmegy.
  if (type === 'recovery') {
    return NextResponse.redirect(new URL('/auth/uj-jelszo', origin))
  }

  return NextResponse.redirect(new URL(next, origin))
}
