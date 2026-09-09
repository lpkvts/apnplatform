'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Icon } from '@/components/icons'
import { filterSubstances, type DrugGroup, type Substance, type Antibiotic, type DrugSummary } from '@/lib/gyogyszer/types'

/**
 * Gyógyszertár — hatóanyag-központú áttekintés.
 *
 * A csoportfa két szinten épül: főcsoportok, alattuk az antibiotikum-családok.
 * A kereső a hatóanyagnévre, az ATC-kódra és a javallatra egyaránt talál, mert
 * a gyakorlatban mindhárom irányból keresünk.
 */
export function Gyogyszertar({
  groups, substances, antibiotics, summary, nyitottCsoport,
}: {
  groups: DrugGroup[]
  substances: Substance[]
  antibiotics: Record<string, Antibiotic>
  summary: DrugSummary | null
  /** A morzsasorból érkezve ez a csoport nyíljon meg. */
  nyitottCsoport?: string
}) {
  const [q, setQ] = useState('')
  // A morzsasorból érkezve a megadott csoport nyílik meg. Ha alcsoport
  // érkezik, a szülőjét is meg kell nyitni, különben nem látszana.
  const kezdo = groups.find((g) => g.slug === nyitottCsoport)
  const kezdoFo = kezdo?.parent_id
    ? groups.find((g) => g.id === kezdo.parent_id)?.slug
    : kezdo?.slug

  const [nyitva, setNyitva] = useState<string | null>(kezdoFo ?? null)
  // Az alcsoportok külön nyithatók: egy főcsoport megnyitása így nem
  // önti ki egyszerre az összes hatóanyagot.
  const [nyitottAlcsoport, setNyitottAlcsoport] = useState<string | null>(
    kezdo?.parent_id ? (kezdo.slug ?? null) : null,
  )

  const focsoportok = groups.filter((g) => !g.parent_id)
  const alcsoport = (parentId: string) => groups.filter((g) => g.parent_id === parentId)
  const csoportHatoanyagai = (groupId: string) =>
    substances.filter((s) => s.group_id === groupId)

  const talalat = useMemo(() => filterSubstances(substances, q), [substances, q])
  const keres = q.trim().length >= 2

  return (
    <>
      {summary && (
        <div className="card">
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-num">{summary.hatoanyagok}</div>
              <div className="stat-lbl">Hatóanyag</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{summary.antibiotikumok}</div>
              <div className="stat-lbl">Antibiotikum</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{summary.csoportok}</div>
              <div className="stat-lbl">Csoport</div>
            </div>
          </div>
        </div>
      )}

      <div className="search-box">
        <Icon name="search" size={18} />
        <input className="search-input" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Hatóanyag, ATC-kód vagy javallat…" aria-label="Keresés a hatóanyagok között" />
      </div>

      {/* ── Keresés eredménye ── */}
      {keres ? (
        <>
          <div className="sec-h">
            <span className="sec-t">
              {talalat.length === 0 ? 'Nincs találat' : `${talalat.length} hatóanyag`}
            </span>
          </div>
          {talalat.length === 0 ? (
            <div className="card empty">
              <b>Nincs találat</b>
              <p>
                A modul jelenleg a leggyakoribb hatóanyagokat tartalmazza, a súlypont az
                antibiotikumokon van. A készlet folyamatosan bővül.
              </p>
            </div>
          ) : (
            <div className="lst">
              {talalat.map((s) => (
                <SorLink key={s.slug} s={s} antibiotikum={!!antibiotics[s.id]} />
              ))}
            </div>
          )}
        </>
      ) : (
        /* ── Csoportfa ── */
        focsoportok.map((fo) => {
          const alcs = alcsoport(fo.id)
          const sajat = csoportHatoanyagai(fo.id)
          const ny = nyitva === fo.slug
          const db = alcs.reduce((a, x) => a + csoportHatoanyagai(x.id).length, 0) + sajat.length

          return (
            <div key={fo.slug} style={{ marginTop: 12 }}>
              <button className="gy-fej" data-nyitva={ny ? 'igen' : 'nem'}
                onClick={() => setNyitva(ny ? null : fo.slug)}>
                <span className="gy-ik" aria-hidden="true">
                  <Icon name={fo.icon ?? 'flask'} size={22} />
                </span>
                <span className="lst-fo">
                  <b>{fo.name}</b>
                  <span>{fo.short}{db > 0 && ` · ${db} hatóanyag`}</span>
                </span>
                <span className="lst-nyil" aria-hidden="true">{ny ? '⌃' : '⌄'}</span>
              </button>

              {ny && (
                <div className="gy-tartalom">
                  {fo.name_meaning && (
                    <div className="gy-nev">
                      <b>Mit takar a név?</b>
                      <p>{fo.name_meaning}</p>
                    </div>
                  )}
                  {fo.description && <p className="gy-leiras">{fo.description}</p>}

                  {/* A csoport egészére vonatkozó tudnivalók gyakran fontosabbak,
                      mint az egyes hatóanyagok részletei. */}
                  {fo.key_points.length > 0 && (
                    <div className="card" style={{ marginBottom: 10 }}>
                      <b style={{ fontSize: 'var(--t-small)' }}>Amit a csoportról tudni kell</b>
                      <ul className="aw-ul">
                        {fo.key_points.map((k) => <li key={k}>{k}</li>)}
                      </ul>
                    </div>
                  )}

                  {fo.apn_notes.length > 0 && (
                    <div className="card" style={{ marginBottom: 10, borderLeft: '4px solid var(--brand-3)' }}>
                      <b style={{ fontSize: 'var(--t-small)' }}>APN-fókusz</b>
                      <ul className="aw-ul">
                        {fo.apn_notes.map((k) => <li key={k}>{k}</li>)}
                      </ul>
                    </div>
                  )}

                  {alcs.map((al) => {
                    const h = csoportHatoanyagai(al.id)
                    const alNyitva = nyitottAlcsoport === al.slug
                    return (
                      <div key={al.slug} style={{ marginBottom: 8 }}>
                        <button className="gy-alfej" data-nyitva={alNyitva ? 'igen' : 'nem'}
                          onClick={() => setNyitottAlcsoport(alNyitva ? null : al.slug)}>
                          <span className="lst-fo">
                            <b>{al.name}</b>
                            <span>
                              {al.short}
                              {h.length > 0 && ` · ${h.length} hatóanyag`}
                            </span>
                          </span>
                          <span className="lst-veg">
                            {al.atc && (
                              <span className="sub" style={{ margin: 0, fontSize: 'var(--t-caption)' }}>
                                {al.atc}
                              </span>
                            )}
                            <span className="lst-nyil" aria-hidden="true">{alNyitva ? '⌃' : '⌄'}</span>
                          </span>
                        </button>

                        {alNyitva && (
                          <div className="gy-altartalom">
                            {al.name_meaning && (
                              <div className="gy-nev">
                                <b>Mit takar a név?</b>
                                <p>{al.name_meaning}</p>
                              </div>
                            )}
                            {al.description && <p className="gy-leiras">{al.description}</p>}

                            {al.key_points.length > 0 && (
                              <div className="card" style={{ marginBottom: 10 }}>
                                <b style={{ fontSize: 'var(--t-small)' }}>Amit a csoportról tudni kell</b>
                                <ul className="aw-ul">
                                  {al.key_points.map((k) => <li key={k}>{k}</li>)}
                                </ul>
                              </div>
                            )}

                            {al.apn_notes.length > 0 && (
                              <div className="card" style={{ marginBottom: 10, borderLeft: '4px solid var(--brand-3)' }}>
                                <b style={{ fontSize: 'var(--t-small)' }}>APN-fókusz</b>
                                <ul className="aw-ul">
                                  {al.apn_notes.map((k) => <li key={k}>{k}</li>)}
                                </ul>
                              </div>
                            )}

                            {h.length > 0 ? (
                              <div className="lst">
                                {h.map((s) => (
                                  <SorLink key={s.slug} s={s} antibiotikum={!!antibiotics[s.id]} />
                                ))}
                              </div>
                            ) : (
                              <p className="sub" style={{ fontSize: 'var(--t-caption)' }}>
                                Ehhez a csoporthoz még nincs feldolgozott hatóanyag.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {sajat.length > 0 && (
                    <div className="lst">
                      {sajat.map((s) => (
                        <SorLink key={s.slug} s={s} antibiotikum={!!antibiotics[s.id]} />
                      ))}
                    </div>
                  )}

                  {alcs.length === 0 && sajat.length === 0 && (
                    <div className="card empty">
                      <b>Feldolgozás alatt</b>
                      <p>Ehhez a csoporthoz még nincs feldolgozott hatóanyag.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })
      )}

      <div className="safety-note" style={{ marginTop: 16 }}>
        <b>ⓘ A modul nem tartalmaz adagolást.</b> Az adagolás a beteg állapotától, a
        javallattól és a vesefunkciótól függ, és az alkalmazási előírás rendszeresen
        frissül. A hatályos adagolást és a teljes előírást az OGYÉI gyógyszeradatbázisa
        tartalmazza — minden hatóanyagnál szerepel a hivatkozás.
      </div>
    </>
  )
}

function SorLink({ s, antibiotikum }: { s: Substance; antibiotikum: boolean }) {
  return (
    <Link className="lst-sor" href={`/gyogyszertar/${s.slug}`}>
      <span className="lst-fo">
        <b>{s.name}</b>
        <span>{s.indications[0] ?? '—'}</span>
      </span>
      <span className="lst-veg">
        {antibiotikum && <span className="st st-progress">Antibiotikum</span>}
        {s.atc && <span className="lst-meta">{s.atc}</span>}
      </span>
    </Link>
  )
}
