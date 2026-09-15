import { ROLE_LABEL, ROLE_ORDER, teljesNev, type Contributor, type ContributorRole } from '@/lib/kozremukodok/types'

/**
 * A közreműködők listája, szerep szerint csoportosítva.
 *
 * A csoportosítás a szerep, nem a név szerint történik: az olvasó azt keresi,
 * ki lektorálta a tartalmat, nem azt, hogy ki van a listán. Aki több
 * szerepben közreműködött, mindegyiknél szerepel — a munkája így nem vész el
 * egyetlen besorolás mögött.
 */
export function Kozremukodok({ lista }: { lista: Contributor[] }) {
  const kiemelt = lista.filter((c) => c.featured)
  const tobbi = lista.filter((c) => !c.featured)

  // Szerep szerinti csoportosítás. Aki több szerepben van, több csoportban
  // is megjelenik.
  const csoportok = ROLE_ORDER
    .map((r) => ({
      szerep: r,
      tagok: tobbi.filter((c) => c.roles.includes(r)),
    }))
    .filter((cs) => cs.tagok.length > 0)

  // Akinek nincs megadott szerepe, ne maradjon ki a listából.
  const besorolatlan = tobbi.filter((c) => c.roles.length === 0)

  if (lista.length === 0) {
    return (
      <div className="card empty">
        <b>Még nincs közzétett közreműködő</b>
        <p>A lista a szerkesztői felületen bővíthető.</p>
      </div>
    )
  }

  return (
    <>
      {kiemelt.length > 0 && (
        <section className="adat-szakasz">
          <div className="kozr-racs">
            {kiemelt.map((c) => <Kartya key={c.id} c={c} kiemelt />)}
          </div>
        </section>
      )}

      {csoportok.map(({ szerep, tagok }) => (
        <section className="adat-szakasz" key={szerep}>
          <h2 className="adat-cim">{ROLE_LABEL[szerep as ContributorRole]}</h2>
          <div className="kozr-racs">
            {tagok.map((c) => <Kartya key={`${szerep}-${c.id}`} c={c} />)}
          </div>
        </section>
      ))}

      {besorolatlan.length > 0 && (
        <section className="adat-szakasz">
          <h2 className="adat-cim">További közreműködők</h2>
          <div className="kozr-racs">
            {besorolatlan.map((c) => <Kartya key={c.id} c={c} />)}
          </div>
        </section>
      )}
    </>
  )
}

function Kartya({ c, kiemelt = false }: { c: Contributor; kiemelt?: boolean }) {
  return (
    <div className={kiemelt ? 'kozr kozr-kiemelt' : 'kozr'}>
      <b className="kozr-nev">{teljesNev(c)}</b>
      {c.organization && <span className="kozr-hely">{c.organization}</span>}
      {c.specialties.length > 0 && (
        <span className="kozr-terulet">{c.specialties.join(' · ')}</span>
      )}
      {c.note && <p className="kozr-jegyzet">{c.note}</p>}
    </div>
  )
}
