/**
 * SCORE2 küszöbérték-táblázat.
 *
 * A hivatalos SCORE2 rács — életkor, nem, dohányzás, vérnyomás és koleszterin
 * szerint — nem jeleníthető meg pontosan a platformon, mert a cellaértékek az
 * eredeti közlemény kalibrációjából származnak.
 *
 * Amit ez a táblázat mutat, az viszont épp az, amit a gyakorlatban rosszul
 * tudnak: hogy a besorolási határok az életkortól függenek. A régi SCORE-nál
 * ezek állandóak voltak, és a váltás máig nem ment át — ugyanaz a 6% negyven
 * évesen igen magas kockázat, hatvanévesen viszont magas.
 */
const SAVOK = [
  {
    korcsoport: '40–49 év',
    kicsi: '2,5% alatt',
    magas: '2,5 – 7,5%',
    igenMagas: '7,5% felett',
  },
  {
    korcsoport: '50–69 év',
    kicsi: '5% alatt',
    magas: '5 – 10%',
    igenMagas: '10% felett',
  },
  {
    korcsoport: '70 év felett',
    kicsi: '7,5% alatt',
    magas: '7,5 – 15%',
    igenMagas: '15% felett',
    megjegyzes: 'SCORE2-OP',
  },
]

export function Score2Tabla() {
  return (
    <section className="adat-szakasz">
      <h2 className="adat-cim">Besorolás korcsoport szerint</h2>
      <p className="sub" style={{ margin: '0 0 12px' }}>
        A határok az életkortól függenek — ugyanaz a százalék más besorolást
        jelent negyven és hatvan évesen.
      </p>

      <div className="sc2-fejlec">
        <span />
        <span className="sc2-cimke sc2-ok">Kis-közepes</span>
        <span className="sc2-cimke sc2-fig">Magas</span>
        <span className="sc2-cimke sc2-krit">Igen magas</span>
      </div>

      {SAVOK.map((s) => (
        <div className="sc2-sor" key={s.korcsoport}>
          <span className="sc2-kor">
            {s.korcsoport}
            {s.megjegyzes && <small>{s.megjegyzes}</small>}
          </span>
          <span className="sc2-ertek sc2-ok">{s.kicsi}</span>
          <span className="sc2-ertek sc2-fig">{s.magas}</span>
          <span className="sc2-ertek sc2-krit">{s.igenMagas}</span>
        </div>
      ))}

      <p className="sub" style={{ margin: '12px 0 0' }}>
        A becsült érték a következő tíz évben bekövetkező halálos vagy nem
        halálos szív- és érrendszeri esemény valószínűsége. Magyarország a
        magas kockázatú régióba tartozik, ezért a magas régió táblázata
        használandó.
      </p>
    </section>
  )
}
