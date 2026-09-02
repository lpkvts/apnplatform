import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Nav } from '@/components/nav'
import { BottomNav } from '@/components/bottom-nav'
import { modeForPath, bodyClassFor } from '@/lib/layout/mode'
import { getTeachingMembership, getCourses } from '@/lib/education/data'
import { EduSidebar } from '@/components/edu-sidebar'
import { EDU_ROLE_LABEL } from '@/lib/education/types'
import { PwaRegister } from '@/components/pwa-register'
import { InstallPrompt } from '@/components/install-prompt'
import { FavoritesProvider } from '@/components/favorites-context'
import { getAllFavoriteKeys } from '@/lib/favorites'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getMaintenance } from '@/lib/flags'
import { currentRole, isAdmin } from '@/lib/roles'

export const metadata: Metadata = {
  title: 'APN-MED',
  description: 'Az APN-MED digitális klinikai munkatársa',
  manifest: '/manifest.webmanifest',
  applicationName: 'APN-MED',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'APN-MED' },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1E5B46',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const favKeys = await getAllFavoriteKeys()

  // Nyitóoldal kijelentkezett látogatónak: a landing saját fejlécet hoz és teljes
  // szélességet igényel, ezért ilyenkor az alkalmazás navigációja kimarad.
  const h = await headers()
  const path = h.get('x-path') ?? '/'
  const isLanding = path === '/' && h.get('x-auth') === '0'

  // Az oktatói felület saját elrendezést kap, de csak annak, aki tényleg oktató:
  // a hallgató ugyanazt a reszponzív felületet látja, mint az egyéni használatnál.
  // A tagságot csak akkor kérdezzük le, ha az útvonal az oktatásra mutat.
  const oktatoTagsag = path.startsWith('/oktatas') ? await getTeachingMembership() : null
  const mode = modeForPath(path, !!oktatoTagsag)

  // Az oldalsávhoz a kurzuslista kell — ugyanabból a lekérdezésből, amit
  // az oktatói kezdőlap is használ, tehát nem jelent külön kört.
  const sideCourses = mode === 'education' && oktatoTagsag
    ? await getCourses(oktatoTagsag.institution_id)
    : []

  // ── Karbantartási mód ──
  // Bekapcsolva mindenki a tájékoztató oldalt kapja, kivéve az adminisztrátorokat
  // — nekik dolgozniuk kell tudni a karbantartás alatt is.
  // A bejelentkezés és a hitelesítő linkek elérhetők maradnak, különben az admin
  // sem tudna belépni, hogy kikapcsolja.
  const exempt =
    path.startsWith('/karbantartas') ||
    path.startsWith('/login') ||
    path.startsWith('/auth') ||
    path.startsWith('/manifest') ||
    path.startsWith('/icon')

  if (!exempt) {
    const { on } = await getMaintenance()
    if (on) {
      const { role } = await currentRole()
      if (!isAdmin(role)) redirect('/karbantartas')
    }
  }

  return (
    <html lang="hu">
      <body className={isLanding ? 'is-landing' : bodyClassFor(mode)}>
        {!isLanding && <Nav />}
        <FavoritesProvider initial={favKeys}>
          {isLanding ? children : mode === 'education' && oktatoTagsag ? (
          <div className="edu-shell">
            <EduSidebar
              institution={oktatoTagsag.institution?.name ?? 'Intézmény'}
              role={EDU_ROLE_LABEL[oktatoTagsag.role]}
              courses={sideCourses.map((c) => ({
                id: c.id, title: c.title, icon: c.icon, status: c.status,
              }))}
              active={path.startsWith('/oktatas/kurzus/') ? path.split('/')[3] : undefined}
            />
            <main className="edu-main">{children}</main>
          </div>
        ) : <main className="container">{children}</main>}
        </FavoritesProvider>
        {!isLanding && <BottomNav />}
        <PwaRegister />
        {/* Telepítés felajánlása. Csak akkor jelenik meg, ha a platform még nincs
            telepítve, és a felhasználó nem utasította el korábban. */}
        <InstallPrompt />
      </body>
    </html>
  )
}
