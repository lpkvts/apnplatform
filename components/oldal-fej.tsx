/**
 * Oldalfejléc: cím és metaadat egy sorban.
 *
 * A korábbi minta nagy címet és alatta kétsoros magyarázatot használt, ami
 * a képernyő harmadát elvitte, mielőtt bármi használható jött volna. Az
 * alcím a legtöbb oldalon amúgy is azt ismételte, ami a listából kiderül.
 *
 * A metaadat a jobb oldalon áll — a klinikai dokumentum logikája szerint,
 * ahol a bal oldal a megnevezés, a jobb az érték.
 */
export function OldalFej({
  cim, meta, leiras,
}: {
  cim: string
  /** Rövid mennyiség vagy állapot a cím mellé. */
  meta?: string
  /** Csak akkor, ha valóban mond valamit, amit a tartalom nem. */
  leiras?: string
}) {
  return (
    <div className="oldal-fej">
      <div className="oldal-fej-sor">
        <h1>{cim}</h1>
        {meta && <span className="oldal-fej-meta">{meta}</span>}
      </div>
      {leiras && <p className="oldal-fej-leiras">{leiras}</p>}
    </div>
  )
}
