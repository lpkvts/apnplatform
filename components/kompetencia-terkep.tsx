'use client'

import { useMemo, useState } from 'react'
import {
  COMPETENCIES, GROUPS, LEVELS, levelInfo, searchCompetencies, countByLevel,
  type Competency, type Level,
} from '@/lib/kompetencia/data'

/**
 * APN Kompetenciatérkép — interaktív böngésző.
 *
 * Háromféle belépés ugyanahhoz a tartalomhoz, mert más-más kérdéssel érkeznek
 * a felhasználók: „mit csinálhat egy APN?" (tevékenységi csoportok szerint),
 * „milyen szinten?" (kompetenciaszint szerint), illetve célzott keresés.
 */

type Tab = 'szintek' | 'csoportok' | 'kereses'

const TABS: { id: Tab; label: string }[] = [
  { id: 'szintek', label: 'Kompetenciaszintek' },
  { id: 'csoportok', label: 'Tevékenységek' },
  { id: 'kereses', label: 'Keresés' },
]

/** Szintjelölő címke — mindenhol azonos formában. */
function LevelBadge({ level }: { level: Level }) {
  const i = levelInfo(level)
  return (
    <span className="kt-badge" style={{ background: i.accent }}>
      {level === 1 ? 'I' : level === 2 ? 'II' : level === 3 ? 'III' : 'IV'} · {i.short}
    </span>
  )
}

function Item({ c, showGroup = false }: { c: Competency; showGroup?: boolean }) {
  return (
    <div className="kt-item">
      <p className="kt-item-t">{c.text}</p>
      <div className="kt-item-m">
        <LevelBadge level={c.level} />
        {showGroup && <span className="kt-item-g">{c.group}{c.sub ? ` · ${c.sub}` : ''}</span>}
        {!showGroup && c.sub && <span className="kt-item-g">{c.sub}</span>}
      </div>
    </div>
  )
}

export function KompetenciaTerkep() {
  const [tab, setTab] = useState<Tab>('szintek')
  const [openLevel, setOpenLevel] = useState<Level | null>(null)
  const [q, setQ] = useState('')

  const counts = useMemo(() => countByLevel(), [])
  const results = useMemo(() => searchCompetencies(q), [q])

  const byGroup = useMemo(() => {
    const m = new Map<string, Competency[]>()
    for (const c of COMPETENCIES) {
      const arr = m.get(c.group) ?? []
      arr.push(c)
      m.set(c.group, arr)
    }
    return m
  }, [])

  return (
    <>
      {/* ── Nézetválasztó ── */}
      <div className="seg-row" style={{ marginTop: 14 }}>
        {TABS.map((t) => (
          <button key={t.id} className={`seg ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ Kompetenciaszintek ══ */}
      {tab === 'szintek' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            A rendelet négy tevékenységvégzési szintet határoz meg. A különbség nem a
            tevékenység nehézsége, hanem az, hogy ki indikálja és milyen orvosi
            együttműködés mellett történik.
          </p>

          {LEVELS.map((l) => {
            const open = openLevel === l.level
            const list = COMPETENCIES.filter((c) => c.level === l.level)
            return (
              <div className="kt-level" key={l.level} style={{ borderLeftColor: l.accent }}>
                <div className="kt-level-h">
                  <span className="kt-level-n" style={{ background: l.accent }}>
                    {l.level === 1 ? 'I' : l.level === 2 ? 'II' : l.level === 3 ? 'III' : 'IV'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <b>{l.title}</b>
                    <span className="kt-level-flow">{l.flow}</span>
                  </div>
                  <span className="kt-level-c">{counts[l.level]}</span>
                </div>

                <p className="kt-level-p">{l.plain}</p>

                <details className="kt-legal">
                  <summary>A rendelet szövege</summary>
                  <p>{l.legal}</p>
                </details>

                <button
                  className="sec-l kt-more"
                  onClick={() => setOpenLevel(open ? null : l.level)}
                >
                  {open ? 'Tevékenységek elrejtése' : `${counts[l.level]} tevékenység megtekintése →`}
                </button>

                {open && (
                  <div className="kt-list">
                    {list.map((c) => <Item key={c.id} c={c} showGroup />)}
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}

      {/* ══ Tevékenységi csoportok ══ */}
      {tab === 'csoportok' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            A rendelet tevékenységi főcsoportok szerint rendezi a kompetenciákat.
            Nyisd le a csoportot a részletekért.
          </p>
          {GROUPS.map((g) => {
            const list = byGroup.get(g) ?? []
            const c = countByLevel(list)
            return (
              <details className="kt-acc" key={g}>
                <summary className="kt-sum">
                  <span>{g}</span>
                  <span className="kt-sum-n">{list.length}</span>
                </summary>
                <div className="kt-body">
                  <div className="kt-mini">
                    {LEVELS.map((l) => c[l.level] > 0 && (
                      <span key={l.level} style={{ borderColor: l.accent, color: l.accent }}>
                        {c[l.level]} × {l.short.toLowerCase()}
                      </span>
                    ))}
                  </div>
                  {list.map((x) => <Item key={x.id} c={x} />)}
                </div>
              </details>
            )
          })}
        </>
      )}

      {/* ══ Keresés ══ */}
      {tab === 'kereses' && (
        <>
          <div className="search-box" style={{ marginTop: 14 }}>
            <input
              className="search-input" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Mit keresel? Például: EKG, katéter, gyógyszer, sebkezelés…"
              aria-label="Keresés a kompetenciák között" autoFocus
            />
          </div>

          <div className="sh-chips" style={{ marginTop: 10 }}>
            {['betegvizsgálat', 'EKG', 'gyógyszer', 'katéter', 'sebkezelés', 'lélegeztetés', 'edukáció', 'prevenció'].map((s) => (
              <button key={s} className="sh-chip" onClick={() => setQ(s)}>{s}</button>
            ))}
          </div>

          {q.trim().length >= 2 && (
            <>
              <div className="sec-h" style={{ marginTop: 16 }}>
                <span className="sec-t">
                  {results.length === 0 ? 'Nincs találat' : `${results.length} találat`}
                </span>
              </div>
              {results.length === 0 && (
                <p className="sub">
                  Próbálj más kifejezést. A keresés a tevékenységek szövegében és a
                  csoportnevekben keres.
                </p>
              )}
              {results.map((c) => <Item key={c.id} c={c} showGroup />)}
            </>
          )}
        </>
      )}
    </>
  )
}
