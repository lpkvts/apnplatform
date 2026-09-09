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
  /** A szakaszhivatkozások csak a nyitóoldalon működnek. */
  szakaszok = false,
}: {
  szakaszok?: boolean
}) {
  return (
    <header className="lp-nav">
      <div className="lp-nav-inner">
        <Link href="/" className="lp-brand">
          <RingLogo size={30} />
          <span className="lp-brand-txt"><b>APN-MED</b><span>SZAKMAI PLATFORM</span></span>
        </Link>
        <nav className="lp-nav-links">
          {szakaszok ? (
            <>
              <a href="#funkciok">Funkciók</a>
              <a href="#ut">Szakmai út</a>
              <a href="#kompetencia">Kompetenciatérkép</a>
              <Link href="/kapcsolat">Kapcsolat</Link>
              <a href="#mentor">Mentorprogram</a>
              <a href="#kinek">Kinek készült</a>
            </>
          ) : (
            <>
              {/* Más oldalról a szakaszokra a nyitóoldalon keresztül jutunk. */}
              <Link href="/#funkciok">Funkciók</Link>
              <Link href="/#ut">Szakmai út</Link>
              <Link href="/#kinek">Kinek készült</Link>
              <Link href="/kapcsolat">Kapcsolat</Link>
            </>
          )}
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
      </div>
    </footer>
  )
}
