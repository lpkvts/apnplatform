import Link from 'next/link'
import { RingLogo } from '@/components/icons'

export function Nav() {
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="brand-logo"><RingLogo /></span>
        <span className="brand-txt">
          <span className="brand-name">APN</span>
          <span className="brand-sub">Hungary Platform</span>
        </span>
      </Link>
    </header>
  )
}
