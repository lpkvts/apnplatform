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
  const isPublic = path === '/'
    || path.startsWith('/login')
    || path.startsWith('/auth')
    || path.startsWith('/kapcsolat')
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // A layoutnak tudnia kell, melyik útvonalon vagyunk és be van-e jelentkezve
  // a látogató: a nyitóoldalon saját fejlécű, teljes szélességű landing jár.
  //
  // FONTOS: ezt a KÉRÉS fejlécébe kell tenni, nem a válaszéba. A szerver
  // komponensek a headers() hívással a kérés fejléceit olvassák; a válaszfejléc
  // csak a böngészőhöz jut el, oda nem. Ezért a kérést újra kell építeni a
  // kiegészített fejlécekkel, és a választ abból származtatni.
  const headers = new Headers(request.headers)
  headers.set('x-path', path)
  headers.set('x-auth', user ? '1' : '0')

  const forwarded = NextResponse.next({ request: { headers } })
  // A sütiket át kell vinni az új válaszra, különben a frissített munkamenet
  // elveszne, és a felhasználó minden kérésnél kijelentkezne.
  response.cookies.getAll().forEach((c) => forwarded.cookies.set(c))
  return forwarded
}
