'use client'

import { useState } from 'react'
import {
  ORSZAGOK, MINTAZATOK, ERETTSEG_LABEL, ERETTSEG_HINT, FIGYELMEZTETES,
  type Erettseg,
} from '@/lib/nemzetkozi/data'

/**
 * Nemzetközi kitekintés.
 *
 * Két nézet: országonként és mintázatok szerint. Az országkártyák
 * lenyithatók, mert a teljes tartalom egyszerre áttekinthetetlen lenne —
 * a lista viszont így ad gyors képet arról, hol mi a helyzet.
 */

const SAV: Record<Erettseg, string> = {
  kiforrott: 'st-passed',
  fejlodo: 'st-progress',
  kezdeti: 'st-none',
}

export function Nemzetkozi() {
  const [tab, setTab] = useState<'orszagok' | 'mintazatok'>('orszagok')
  const [nyitva, setNyitva] = useState<string | null>(null)
  const [szuro, setSzuro] = useState<Erettseg | 'mind'>('mind')

  const lista = szuro === 'mind' ? ORSZAGOK : ORSZAGOK.filter((o) => o.erettseg === szuro)
  const db = (e: Erettseg) => ORSZAGOK.filter((o) => o.erettseg === e).length

  return (
    <>
      <div className="seg-row">
        <button className={`seg ${tab === 'orszagok' ? 'on' : ''}`} onClick={() => setTab('orszagok')}>
          Országok
        </button>
        <button className={`seg ${tab === 'mintazatok' ? 'on' : ''}`} onClick={() => setTab('mintazatok')}>
          Mintázatok
        </button>
      </div>

      {tab === 'orszagok' && (
        <>
          <div className="sh-chips" style={{ marginTop: 14 }}>
            <button className={`sh-chip ${szuro === 'mind' ? 'on' : ''}`} onClick={() => setSzuro('mind')}>
              Mind ({ORSZAGOK.length})
            </button>
            {(['kiforrott', 'fejlodo', 'kezdeti'] as Erettseg[]).map((e) => (
              db(e) > 0 && (
                <button key={e} className={`sh-chip ${szuro === e ? 'on' : ''}`} onClick={() => setSzuro(e)}>
                  {ERETTSEG_LABEL[e]} ({db(e)})
                </button>
              )
            ))}
          </div>

          {szuro !== 'mind' && (
            <p className="sub" style={{ marginTop: 10, fontSize: 'var(--t-caption)' }}>
              {ERETTSEG_HINT[szuro]}
            </p>
          )}

          <div className="lst" style={{ marginTop: 14 }}>
            {lista.map((o) => {
              const ny = nyitva === o.id
              return (
                <div key={o.id}>
                  <button className="lst-sor" onClick={() => setNyitva(ny ? null : o.id)}>
                    <span className="nk-zaszlo" aria-hidden="true">{o.zaszlo}</span>
                    <span className="lst-fo">
                      <b>{o.nev}</b>
                      <span>{o.cim}</span>
                    </span>
                    <span className="lst-veg">
                      <span className={`st ${SAV[o.erettseg]}`}>{ERETTSEG_LABEL[o.erettseg]}</span>
                      <span className="lst-nyil" aria-hidden="true">{ny ? '⌄' : '›'}</span>
                    </span>
                  </button>

                  {ny && (
                    <div className="nk-reszlet">
                      <dl>
                        <dt>Mióta</dt><dd>{o.mikortol}</dd>
                        <dt>Képzés</dt><dd>{o.kepzes}</dd>
                        <dt>Önállóság</dt><dd>{o.onallosag}</dd>
                        <dt>Gyógyszerfelírás</dt><dd>{o.feliras}</dd>
                        <dt>Hol dolgozik</dt><dd>{o.hol}</dd>
                      </dl>
                      <p className="nk-tanulsag"><b>Amit érdemes megjegyezni.</b> {o.tanulsag}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {tab === 'mintazatok' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            Amit az országok összevetéséből le lehet szűrni — a különbségek mögött
            visszatérő szabályszerűségek állnak.
          </p>
          {MINTAZATOK.map((m) => (
            <div className="card" key={m.cim}>
              <b style={{ fontSize: 'var(--t-h3)' }}>{m.cim}</b>
              <p style={{ margin: '6px 0 0', fontSize: 'var(--t-body)', lineHeight: 1.65, color: 'var(--muted)' }}>
                {m.szoveg}
              </p>
            </div>
          ))}
        </>
      )}

      <div className="safety-note" style={{ marginTop: 16 }}>
        <b>ⓘ Tájékoztató összeállítás.</b> {FIGYELMEZTETES}
      </div>
    </>
  )
}
