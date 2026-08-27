import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Nav } from '@/components/nav'
import { BottomNav } from '@/components/bottom-nav'
import { PwaRegister } from '@/components/pwa-register'
import { FavoritesProvider } from '@/components/favorites-context'
import { getAllFavoriteKeys } from '@/lib/favorites'
import { headers } from 'next/headers'

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
  const isLanding = h.get('x-path') === '/' && h.get('x-auth') === '0'

  return (
    <html lang="hu">
      <body className={isLanding ? 'is-landing' : undefined}>
        {!isLanding && <Nav />}
        <FavoritesProvider initial={favKeys}>
          {isLanding ? children : <main className="container">{children}</main>}
        </FavoritesProvider>
        {!isLanding && <BottomNav />}
        <PwaRegister />
      </body>
    </html>
  )
}
