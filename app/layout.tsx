import './globals.css'
import type { ReactNode } from 'react'
import { Nav } from '@/components/nav'

export const metadata = {
  title: 'APN Hungary Platform',
  description: 'Az APN digitális klinikai munkatársa',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="hu">
      <body>
        <Nav />
        <main className="container">{children}</main>
      </body>
    </html>
  )
}
