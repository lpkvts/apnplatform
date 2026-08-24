import './globals.css'
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Nav } from '@/components/nav'
import { BottomNav } from '@/components/bottom-nav'
import { PwaRegister } from '@/components/pwa-register'
import { FavoritesProvider } from '@/components/favorites-context'
import { getAllFavoriteKeys } from '@/lib/favorites'

export const metadata: Metadata = {
  title: 'APN Hungary Platform',
  description: 'Az APN digitális klinikai munkatársa',
  manifest: '/manifest.webmanifest',
  applicationName: 'APN Platform',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'APN Platform' },
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
  return (
    <html lang="hu">
      <body>
        <Nav />
        <FavoritesProvider initial={favKeys}>
          <main className="container">{children}</main>
        </FavoritesProvider>
        <BottomNav />
        <PwaRegister />
      </body>
    </html>
  )
}
