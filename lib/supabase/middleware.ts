import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Session frissítése és útvonalvédelem.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  // A nyitóoldal publikus: kijelentkezett látogató a landinget kapja, belépett
  // felhasználó a kezdőlapot (app/page.tsx dönti el). Enélkül a landing soha nem
  // látszana, mert a middleware már itt átirányítana a bejelentkezésre.
  const isPublic = path === '/' || path.startsWith('/login') || path.startsWith('/auth')
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  // A layoutnak tudnia kell, melyik útvonalon vagyunk: a nyitóoldalon
  // kijelentkezett látogatónak saját fejlécű, teljes szélességű landing jár,
  // az alkalmazás fejléce nélkül. Szerver layoutban nincs pathname API,
  // ezért fejlécben adjuk tovább.
  response.headers.set('x-path', path)
  response.headers.set('x-auth', user ? '1' : '0')
  return response
}
