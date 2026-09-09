import Link from 'next/link'

export interface MorzsaElem {
  /** A megjelenő szöveg. */
  label: string
  /** Hova visz. Ha nincs, ez az aktuális oldal — nem kattintható. */
  href?: string
}

/**
 * Morzsasor: hol tartok, és hova léphetek vissza.
 *
 * A korábbi, egyszerű vissza-hivatkozás mindig a modul főoldalára vitt.
 * Egy hatóanyagnál ez azt jelentette, hogy a csoportig nem lehetett
 * visszalépni, csak a Gyógyszertár tetejére — pedig a felfedezés jellemzően
 * a csoporton belül folytatódik.
 *
 * Az utolsó elem az aktuális oldal, ezért nem kattintható. Mobilon a sor
 * vízszintesen görgethető, hogy a hosszabb útvonalak se törjenek meg.
 */
export function Morzsa({ elemek }: { elemek: MorzsaElem[] }) {
  if (elemek.length === 0) return null

  return (
    <nav className="morzsa" aria-label="Hol járok">
      {elemek.map((e, i) => {
        const utolso = i === elemek.length - 1
        return (
          <span key={`${e.label}-${i}`} className="morzsa-e">
            {e.href && !utolso ? (
              <Link href={e.href}>{e.label}</Link>
            ) : (
              <span aria-current={utolso ? 'page' : undefined}>{e.label}</span>
            )}
            {!utolso && <span className="morzsa-v" aria-hidden="true">›</span>}
          </span>
        )
      })}
    </nav>
  )
}
