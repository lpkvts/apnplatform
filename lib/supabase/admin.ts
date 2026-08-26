import { createClient } from '@supabase/supabase-js'

/**
 * Supabase kliens SERVICE ROLE kulccsal.
 *
 * ⚠️ FIGYELEM — ez a kulcs minden RLS-szabályt megkerül.
 *  - Kizárólag szerver oldalon (server action, route handler) használható.
 *  - A környezeti változó neve NEM kezdődhet NEXT_PUBLIC_-kal, különben
 *    a kulcs bekerülne a böngészőbe küldött kódba.
 *  - Minden hívás előtt ellenőrizni kell, hogy a kérő valóban admin.
 *
 * Beállítás a Vercelen: Settings → Environment Variables →
 *   SUPABASE_SERVICE_ROLE_KEY = (Supabase → Project Settings → API → service_role)
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/** A felületnek jelezzük, ha a kulcs nincs beállítva — hiba helyett érthető üzenettel. */
export function adminApiAvailable(): boolean {
  return !!process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.NEXT_PUBLIC_SUPABASE_URL
}
