'use client'

import { useMemo, useState } from 'react'
import {
  COMPETENCIES, GROUPS, LEVELS, levelInfo, searchCompetencies, countByLevel,
  type Competency, type Level,
} from '@/lib/kompetencia/data'
import { PAIRS, DIVERGENCES, QUALIFICATIONS } from '@/lib/kompetencia/osszehasonlitas'
import { LevelFlow, RoleStrip } from '@/components/kompetencia-abrak'

/**
 * APN Kompetenciatérkép — interaktív böngésző.
 *
 * Háromféle belépés ugyanahhoz a tartalomhoz, mert más-más kérdéssel érkeznek
 * a felhasználók: „mit csinálhat egy APN?" (tevékenységi csoportok szerint),
 * „milyen szinten?" (kompetenciaszint szerint), illetve célzott keresés.
 */

type Tab = 'szintek' | 'csoportok' | 'osszehasonlitas' | 'kereses'

const TABS: { id: Tab; label: string }[] = [
  { id: 'szintek', label: 'Kompetenciaszintek' },
  { id: 'csoportok', label: 'Tevékenységek' },
  { id: 'osszehasonlitas', label: 'Összehasonlítás' },
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
          <div className="sec-h" style={{ marginTop: 14 }}>
            <span className="sec-t">Hol jelenik meg az APN tudása</span>
          </div>
          <RoleStrip />

          <p className="sub" style={{ marginTop: 16 }}>
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

                {/* Az együttműködés képlete ábrán: a szintek közötti különbség
                    így egy pillantással érthető. */}
                <LevelFlow level={l.level} color={l.accent} />

                <p className="kt-level-p">{l.plain}</p>

                <p className="kt-level-note" style={{ borderLeftColor: l.accent }}>{l.note}</p>

                {/* Néhány példa a rendelet tényleges tételeiből — nem kitalált
                    felsorolás, hanem az adott szinthez besorolt tevékenységek. */}
                <ul className="kt-ex">
                  {list.slice(0, 4).map((c) => <li key={c.id}>{c.text}</li>)}
                </ul>

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

      {/* ══ Összehasonlítás ══ */}
      {tab === 'osszehasonlitas' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            A rendelet egyetlen táblázat: minden sorban egy tevékenység áll, az
            oszlopokban a különböző képzettségű szakdolgozók szintbesorolása. Az alábbi
            párok ugyanabból a sorból származnak — nem hasonló, hanem azonos tevékenységről
            van szó.
          </p>

          <div className="card">
            <b style={{ fontSize: 14 }}>A keretrendszer képzettségi szintjei</b>
            <ol className="kt-qual">
              {QUALIFICATIONS.map((q) => (
                <li key={q.mkkr} className={q.mkkr === 7 ? 'on' : undefined}>
                  <span>MKKR {q.mkkr}</span>{q.name}
                </li>
              ))}
            </ol>
            <p className="sub" style={{ margin: '10px 0 0', fontSize: 12 }}>
              Az összevetés az általános ápoló (MKKR 5.) és a kiterjesztett hatáskörű ápoló
              (MKKR 7.) oszlopa között készült, mert ezekhez állt rendelkezésre hiteles kivonat.
              Az asszisztensi oszlop szintjeit nem szerepeltetjük, mert azt nem tudtuk ellenőrizni.
            </p>
          </div>

          <div className="sec-h"><span className="sec-t">Ahol nem a tevékenység, hanem a szint más</span></div>
          {PAIRS.map((p, i) => (
            <div className="card kt-pair" key={i}>
              <p className="kt-pair-t">{p.text}</p>
              <div className="kt-pair-row">
                <div>
                  <span className="kt-pair-l">Általános ápoló</span>
                  <LevelBadge level={p.nurse} />
                </div>
                <span className="kt-pair-arrow" aria-hidden="true">→</span>
                <div>
                  <span className="kt-pair-l">Kiterjesztett hatáskörű ápoló</span>
                  <LevelBadge level={p.apn} />
                </div>
              </div>
              {p.note && <p className="kt-pair-n">{p.note}</p>}
            </div>
          ))}

          <div className="sec-h"><span className="sec-t">Ahol maga a tevékenység más</span></div>
          <p className="sub" style={{ marginTop: 0 }}>
            Ez a lényegi különbség: nem ugyanazt csinálja alacsonyabb felügyelettel, hanem
            mást csinál. A rendelet ilyenkor eltérő szöveget ad a két oszlopban.
          </p>
          {DIVERGENCES.map((d, i) => (
            <div className="card" key={i} style={{ marginBottom: 8 }}>
              <b style={{ fontSize: 14 }}>{d.topic}</b>
              <div className="kt-div">
                <div><span>Általános ápoló</span><p>{d.nurse}</p></div>
                <div className="on"><span>Kiterjesztett hatáskörű ápoló</span><p>{d.apn}</p></div>
              </div>
            </div>
          ))}

          <div className="safety-note" style={{ marginTop: 10 }}>
            <b>ⓘ Nem rangsor.</b> A keretrendszer eltérő képzettségekhez eltérő
            kompetenciákat rendel. Az asszisztensi, ápolói és kiterjesztett hatáskörű ápolói
            munka más felkészültséget igényel és más feladatokra szól — a betegellátás
            mindegyikre épül.
          </div>
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
