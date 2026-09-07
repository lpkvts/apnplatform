'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { ForrasTetel, ForrasOsszegzes } from '@/lib/forrasok/attekintes'

/**
 * A platform forrásállományának áttekintése.
 *
 * A modulonkénti bontás megmutatja, hol vékony a lefedettség — ez legalább
 * olyan fontos, mint maga a lista. A kódban tárolt források külön jelölést
 * kapnak: azok a tartalommal együtt változnak, nem a felületről.
 */

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export function ForrasAttekintes({
  tetelek, osszegzes,
}: {
  tetelek: ForrasTetel[]
  osszegzes: ForrasOsszegzes
}) {
  const [q, setQ] = useState('')
  const [modul, setModul] = useState('')
  const [csakHivatkozas, setCsakHivatkozas] = useState(false)

  const talalat = useMemo(() => tetelek.filter((t) => {
    if (modul && t.modul !== modul) return false
    if (csakHivatkozas && !t.url) return false
    if (q.trim().length >= 2) {
      const hay = fold([t.cim, t.szervezet, t.hovatartozas, t.modul].filter(Boolean).join(' '))
      if (!hay.includes(fold(q.trim()))) return false
    }
    return true
  }), [tetelek, q, modul, csakHivatkozas])

  return (
    <>
      <div className="card">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-num">{osszegzes.ossz}</div>
            <div className="stat-lbl">Forrás összesen</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{osszegzes.adatbazisbol}</div>
            <div className="stat-lbl">Szerkeszthető</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{osszegzes.kodbol}</div>
            <div className="stat-lbl">Tartalommal együtt</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{osszegzes.hivatkozassal}</div>
            <div className="stat-lbl">Hivatkozással</div>
          </div>
        </div>
      </div>

      {/* Modulonkénti bontás: ebből látszik, hol hiányos a lefedettség. */}
      <div className="sec-h"><span className="sec-t">Modulonként</span></div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr><th>Modul</th><th className="num">Forrás</th><th>Tárolás</th></tr>
          </thead>
          <tbody>
            {osszegzes.modulok.map((m) => (
              <tr key={m.nev}>
                <td className="fo">{m.nev}</td>
                <td className="num">{m.db}</td>
                <td>
                  <span className={`st ${m.eredet === 'adatbazis' ? 'st-done' : 'st-none'}`}>
                    {m.eredet === 'adatbazis' ? 'Szerkeszthető' : 'Kódban'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sec-h"><span className="sec-t">Minden forrás</span></div>

      <div className="search-box">
        <input className="search-input" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Cím, szervezet, kapcsolódó tartalom…" aria-label="Keresés a források között" />
      </div>

      <div className="sh-chips" style={{ marginTop: 10 }}>
        <button className={`sh-chip ${modul === '' ? 'on' : ''}`} onClick={() => setModul('')}>
          Mind ({tetelek.length})
        </button>
        {osszegzes.modulok.map((m) => (
          <button key={m.nev} className={`sh-chip ${modul === m.nev ? 'on' : ''}`}
            onClick={() => setModul(modul === m.nev ? '' : m.nev)}>
            {m.nev} ({m.db})
          </button>
        ))}
        <button className={`sh-chip ${csakHivatkozas ? 'on' : ''}`}
          onClick={() => setCsakHivatkozas(!csakHivatkozas)}>
          Csak hivatkozással
        </button>
      </div>

      <p className="sub" style={{ marginTop: 10, fontSize: 'var(--t-caption)' }}>
        {talalat.length} találat
      </p>

      {talalat.length === 0 ? (
        <div className="card empty">
          <b>Nincs találat</b>
          <p>Próbálj tágabb szűrést, vagy törölj néhány feltételt.</p>
        </div>
      ) : (
        <div className="lst">
          {talalat.map((t, i) => (
            <div className="lst-sor" key={`${t.cim}-${i}`} style={{ cursor: 'default' }}>
              <span className="lst-fo">
                <b>{t.cim}</b>
                <span>
                  {[t.szervezet, t.ev, t.hovatartozas && `→ ${t.hovatartozas}`]
                    .filter(Boolean).join(' · ')}
                </span>
              </span>
              <span className="lst-veg">
                <span className="sub" style={{ margin: 0, fontSize: 'var(--t-caption)' }}>
                  {t.modul}
                </span>
                {t.url && (
                  <a href={t.url} target="_blank" rel="noopener" className="btn ghost sm">
                    Megnyitás ↗
                  </a>
                )}
                {t.szerkesztes && (
                  <Link href={t.szerkesztes} className="btn ghost sm">Szerkesztés</Link>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="safety-note" style={{ marginTop: 14 }}>
        <b>ⓘ Kétféle tárolás.</b> A szerkeszthető források az adatbázisban vannak, és a
        megfelelő kezelőfelületről módosíthatók. A kódban tárolt források a klinikai
        tartalommal egy helyen állnak — azok fejlesztéssel változnak, mert a tartalommal
        együtt kell módosulniuk.
      </div>
    </>
  )
}
