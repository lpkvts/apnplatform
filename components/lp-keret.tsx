import Link from 'next/link'
import { RingLogo } from '@/components/icons'

/**
 * A nyilvános oldalak kerete: fejléc és lábléc.
 *
 * A nyitóoldal és a kapcsolat oldal is látogatóknak szól, ezért ugyanazt a
 * keretet viselik. Korábban a kapcsolat oldal a platform belső keretét
 * kapta — fejléccel és alsó navigációval —, ami félrevezető volt: aki még
 * nincs belépve, olyan menüt látott, ahonnan sehova nem tudott menni.
 */

export function LpFejlec({
  /** A nyitóoldalon a szakaszokra horgonnyal ugrunk, máshonnan oda navigálunk. */
  szakaszok = false,
}: {
  szakaszok?: boolean
}) {
  // A menü mindenhol ugyanazokat a pontokat tartalmazza: aki a kapcsolat
  // oldalra lép, ne találkozzon megfogyatkozott menüvel. Csak a hivatkozás
  // alakja tér el — a nyitóoldalon horgony, máshonnan teljes útvonal.
  const szakasz = (id: string) => (szakaszok ? `#${id}` : `/#${id}`)

  return (
    <header className="lp-nav">
      <div className="lp-nav-inner">
        <Link href="/" className="lp-brand">
          <RingLogo size={30} />
          <span className="lp-brand-txt"><b>APN-MED</b><span>SZAKMAI PLATFORM</span></span>
        </Link>
        <nav className="lp-nav-links">
          <Link href={szakasz('funkciok')}>Funkciók</Link>
          <Link href={szakasz('ut')}>Szakmai út</Link>
          <Link href={szakasz('kompetencia')}>Kompetenciatérkép</Link>
          <Link href="/kapcsolat">Kapcsolat</Link>
          <Link href={szakasz('mentor')}>Mentorprogram</Link>
          <Link href={szakasz('kinek')}>Kinek készült</Link>
        </nav>
        <Link className="lp-btn lp-btn-primary" href="/login">
          Belépés a platformra <span className="lp-arw">→</span>
        </Link>
      </div>
    </header>
  )
}

export function LpLablec() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <p>© {new Date().getFullYear()} APN-MED</p>
        <p className="lp-footer-note">
          Szakmai és oktatási célú platform. Nem helyettesíti az orvosi döntést
          vagy az intézményi protokollt.
        </p>
        <p>
          <Link href="/kozremukodok" className="lp-footer-l">Közreműködők</Link>
        </p>
      </div>
    </footer>
  )
}
