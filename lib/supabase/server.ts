import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Szerveroldali Supabase kliens (RSC, route handler, server action).
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // RSC-ből hívva a set no-op — a middleware frissíti a sütiket.
          }
        },
      },
    },
  )
}
