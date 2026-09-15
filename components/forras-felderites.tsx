'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { markChecked } from '@/lib/forrasok/data'
import { surgossegSav, type ReviewItem } from '@/lib/forrasok/types'

/**
 * Forrásfelderítés — mit kell megnézni, és hol.
 *
 * A felület nem keres és nem frissít: sorba rendezi a forrásokat aszerint,
 * mennyire sürgős átnézni őket, és megadja, hol található az újabb kiadás.
 * Az ellenőrzés tényét rögzíteni lehet — a „megnéztem, nincs újabb" épp
 * olyan értékes, mint egy frissítés, mert enélkül a következő átnézés
 * ugyanazt hozná fel.
 */
export function ForrasFelderites({ sor }: { sor: ReviewItem[] }) {
  const [nyitott, setNyitott] = useState<string | null>(null)
  const [hiba, setHiba] = useState<string | null>(null)
  const [fut, start] = useTransition()

  const rogzit = (id: string, megjegyzes: string) =>
    start(async () => {
      setHiba(null)
      const r = await markChecked(id, megjegyzes)
      if (r.ok) setNyitott(null)
      else setHiba(r.hiba ?? 'A rögzítés nem sikerült.')
    })

  const surgos = sor.filter((s) => s.surgosseg >= 12).length
  const esedekes = sor.filter((s) => s.surgosseg >= 6 && s.surgosseg < 12).length

  return (
    <>
      <div className="fd-osszegzes">
        <div className="fd-szam fd-krit">
          <b>{surgos}</b><span>sürgős</span>
        </div>
        <div className="fd-szam fd-fig">
          <b>{esedekes}</b><span>esedékes</span>
        </div>
        <div className="fd-szam fd-ok">
          <b>{sor.length - surgos - esedekes}</b><span>ráér</span>
        </div>
      </div>

      <p className="sub" style={{ margin: '0 0 16px' }}>
        A sorrendet három tényező adja: a forrás kora, az utolsó ellenőrzés
        ideje, és hogy hány kórkép támaszkodik rá. Az utolsó azért számít, mert
        egy tíz kórképnél hivatkozott elavult forrás többet árt, mint egy olyan,
        amire senki nem mutat.
      </p>

      {hiba && <p className="urlap-hiba" role="alert">{hiba}</p>}

      {sor.length === 0 ? (
        <div className="card empty">
          <b>Nincs átnézendő forrás</b>
          <p>Minden forrás friss, vagy nemrég ellenőrizve lett.</p>
        </div>
      ) : (
        <div className="lst">
          {sor.map((s) => {
            const sav = surgossegSav(s.surgosseg)
            const nyitva = nyitott === s.id
            return (
              <div key={s.id}>
                <div className="lst-sor" style={{ cursor: 'default' }}>
                  <span className={`all-pont all-${sav.szin}`} />
                  <span className="lst-fo">
                    <b>{s.title}</b>
                    <span>
                      {s.source_year ?? 'évszám nélkül'}
                      {s.kor_ev !== null && ` · ${s.kor_ev} éves`}
                      {s.korkep_db > 0 && ` · ${s.korkep_db} kórkép hivatkozik rá`}
                      {s.ellenorzes_ota_nap === null
                        ? ' · még nem ellenőrizték'
                        : ` · ${s.ellenorzes_ota_nap} napja ellenőrizve`}
                    </span>
                  </span>
                  <span className="lst-veg">
                    <span className={`st ${sav.szin === 'krit' ? 'st-overdue'
                      : sav.szin === 'fig' ? 'st-progress' : 'st-done'}`}>
                      {sav.cimke}
                    </span>
                    <button className="btn ghost sm"
                      onClick={() => setNyitott(nyitva ? null : s.id)}>
                      {nyitva ? 'Bezár' : 'Megnézem'}
                    </button>
                  </span>
                </div>

                {nyitva && (
                  <div className="card" style={{ marginTop: 8 }}>
                    <section className="adat-szakasz">
                      <h2 className="adat-cim">Hol keresd az újabb kiadást</h2>
                      <p style={{ margin: '0 0 6px' }}>
                        <b>{s.kereses.kiado}</b>
                      </p>
                      {s.kereses.hol && (
                        <a className="btn ghost sm" href={s.kereses.hol}
                          target="_blank" rel="noopener">
                          Jegyzék megnyitása
                        </a>
                      )}
                      <p className="sub" style={{ margin: '8px 0 0' }}>
                        {s.kereses.tipp}
                      </p>
                    </section>

                    {s.check_note && (
                      <section className="adat-szakasz">
                        <h2 className="adat-cim">Korábbi ellenőrzés</h2>
                        <p>{s.check_note}</p>
                      </section>
                    )}

                    <EllenorzesUrlap
                      onRogzit={(m) => rogzit(s.id, m)}
                      fut={fut}
                      forrasId={s.id}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

function EllenorzesUrlap({
  onRogzit, fut, forrasId,
}: {
  onRogzit: (megjegyzes: string) => void
  fut: boolean
  forrasId: string
}) {
  const [megjegyzes, setMegjegyzes] = useState('')

  return (
    <section className="adat-szakasz" style={{ marginBottom: 0 }}>
      <h2 className="adat-cim">Ellenőrzés rögzítése</h2>
      <p className="sub" style={{ margin: '0 0 8px' }}>
        Ha nincs újabb kiadás, azt is érdemes rögzíteni — enélkül a következő
        átnézés ugyanezt hozná fel.
      </p>
      <input
        className="field" value={megjegyzes}
        placeholder="pl. megnéztem, 2024 a legfrissebb"
        onChange={(e) => setMegjegyzes(e.target.value)}
      />
      <div className="row" style={{ border: 'none', padding: '10px 0 0', gap: 8 }}>
        <button className="btn sm" onClick={() => onRogzit(megjegyzes)} disabled={fut}>
          {fut ? 'Rögzítés…' : 'Ellenőriztem'}
        </button>
        <Link className="btn ghost sm" href={`/klinika/tudastar/${forrasId}`}>
          Forrás megnyitása
        </Link>
      </div>
    </section>
  )
}
