'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  GYENGE,
  type CompetencyStat, type QuestionStat, type StudentStat, type CourseSummary,
} from '@/lib/education/analytics-types'

/**
 * Csoportelemzés.
 *
 * Nem összesített pontszámot mutat, hanem azt, hogy hol kell beavatkozni: mely
 * szakmai területen gyenge a csoport, melyik kérdésnél akadnak el, és ki maradt
 * le. A számok mellé mindig odakerül, mennyi adaton alapulnak — kevés beadásból
 * levont következtetés félrevezető.
 */

type Tab = 'kompetencia' | 'kerdesek' | 'hallgatok'

const savSzin = (pct: number) =>
  pct >= 80 ? 'var(--ok)' : pct >= GYENGE ? 'var(--warn)' : 'var(--alert)'

export function CourseAnalytics({
  comps, questions, students, summary,
}: {
  comps: CompetencyStat[]
  questions: QuestionStat[]
  students: StudentStat[]
  summary: CourseSummary | null
}) {
  const [tab, setTab] = useState<Tab>('kompetencia')

  if (!summary || summary.beadasok === 0) {
    return (
      <div className="card">
        <p style={{ margin: 0 }}>
          Még nincs beadás a kurzuson. Az elemzés akkor jelenik meg, ha a hallgatók
          megkezdték a feladatokat.
        </p>
      </div>
    )
  }

  const gyengeComps = comps.filter((c) => c.pct < GYENGE)
  const nemAdtakBe = students.filter((s) => s.beadott < s.osszes_feladat)

  return (
    <>
      {/* ── Áttekintés ── */}
      <div className="card">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-num">{summary.hallgatok}</div>
            <div className="stat-lbl">Hallgató</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{summary.feladatok}</div>
            <div className="stat-lbl">Megnyitott feladat</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{summary.beadasok}</div>
            <div className="stat-lbl">Beadás</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{summary.atlag}%</div>
            <div className="stat-lbl">Átlag</div>
          </div>
        </div>
      </div>

      {/* ── Amire érdemes figyelni ── */}
      {(gyengeComps.length > 0 || nemAdtakBe.length > 0) && (
        <div className="safety-note">
          <b>ⓘ Amire érdemes visszatérni.</b>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            {gyengeComps.slice(0, 3).map((c) => (
              <li key={c.competency_id} style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 3 }}>
                <b>{c.name}</b> — {c.pct}% ({c.valaszok} válasz alapján)
              </li>
            ))}
            {nemAdtakBe.length > 0 && (
              <li style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                {nemAdtakBe.length} hallgató nem adta be az összes feladatot
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="seg-row" style={{ marginTop: 14 }}>
        <button className={`seg ${tab === 'kompetencia' ? 'on' : ''}`} onClick={() => setTab('kompetencia')}>
          Kompetenciák
        </button>
        <button className={`seg ${tab === 'kerdesek' ? 'on' : ''}`} onClick={() => setTab('kerdesek')}>
          Kérdések
        </button>
        <button className={`seg ${tab === 'hallgatok' ? 'on' : ''}`} onClick={() => setTab('hallgatok')}>
          Hallgatók
        </button>
      </div>

      {/* ══ KOMPETENCIÁK ══ */}
      {tab === 'kompetencia' && (
        <>
          {comps.length === 0 ? (
            <div className="card" style={{ marginTop: 12 }}>
              <p style={{ margin: 0 }}>
                A kérdésekhez még nincs kompetencia rendelve, ezért a szakmai bontás üres.
                A kérdés szerkesztésénél választhatsz kompetenciát — utána itt megjelenik,
                mely területen áll gyengén a csoport.
              </p>
            </div>
          ) : (
            <>
              <p className="sub" style={{ marginTop: 14 }}>
                A leggyengébb terület elöl. A százalék a hallgatónkénti legutolsó beadásokból
                számolódik.
              </p>
              {comps.map((c) => (
                <div className="card" key={c.competency_id} style={{ marginBottom: 8 }}>
                  <div className="row" style={{ border: 'none', padding: 0 }}>
                    <span style={{ flex: 1 }}>
                      <b style={{ fontSize: 14.5 }}>{c.name}</b>
                      {c.domain && (
                        <span className="sub" style={{ display: 'block', margin: 0, fontSize: 12 }}>{c.domain}</span>
                      )}
                    </span>
                    <b style={{ fontSize: 17, color: savSzin(c.pct) }}>{c.pct}%</b>
                  </div>
                  <div className="ekg-prog-bar" style={{ marginTop: 8 }}>
                    <div style={{ width: `${c.pct}%`, background: savSzin(c.pct) }} />
                  </div>
                  <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>
                    {c.helyes} / {c.valaszok} helyes válasz · {c.hallgatok} hallgató
                  </div>
                </div>
              ))}
            </>
          )}

          {summary.besorolatlan_kerdes > 0 && (
            <p className="sub" style={{ fontSize: 12 }}>
              {summary.besorolatlan_kerdes} kérdéshez nincs kompetencia rendelve. Ezek a
              százalékos eredménybe beleszámítanak, a fenti szakmai bontásba nem.
            </p>
          )}
        </>
      )}

      {/* ══ KÉRDÉSEK ══ */}
      {tab === 'kerdesek' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            A legtöbb hibát hozó kérdések elöl. Az alacsony arány kétfélét jelenthet: vagy a
            téma nem ment át, vagy maga a kérdés félreérthető — ezt érdemes külön mérlegelni.
          </p>
          {questions.map((q) => (
            <div className="card" key={q.question_id} style={{ marginBottom: 8 }}>
              <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
                <b style={{ flex: 1, fontSize: 14 }}>{q.prompt}</b>
                <b style={{ fontSize: 16, color: savSzin(q.pct) }}>{q.pct}%</b>
              </div>
              <div className="mp-meta">
                <span>{q.assignment_title}</span>
                {q.competency_name && <span>{q.competency_name}</span>}
                <span>{q.helyes} / {q.valaszok} helyes</span>
              </div>
              <Link className="sec-l" href={`/oktatas/feladat/${q.assignment_id}`}
                style={{ display: 'inline-block', marginTop: 8, fontSize: 13 }}>
                Feladat megnyitása →
              </Link>
            </div>
          ))}
        </>
      )}

      {/* ══ HALLGATÓK ══ */}
      {tab === 'hallgatok' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            A leggyengébb átlag elöl. A hiányzó beadás gyakran fontosabb jelzés, mint a
            gyenge eredmény.
          </p>
          {students.map((s) => {
            const hianyzik = s.osszes_feladat - s.beadott
            return (
              <div className="card" key={s.user_id} style={{ marginBottom: 8 }}>
                <div className="row" style={{ border: 'none', padding: 0 }}>
                  <span style={{ flex: 1 }}>
                    <b>{s.full_name || '(nincs név)'}</b>
                    <span className="sub" style={{ display: 'block', margin: 0, fontSize: 12 }}>
                      {s.beadott} / {s.osszes_feladat} feladat beadva
                      {s.teljesitett > 0 && ` · ${s.teljesitett} teljesítve`}
                    </span>
                  </span>
                  <b style={{ fontSize: 17, color: s.beadott === 0 ? 'var(--faint)' : savSzin(s.atlag) }}>
                    {s.beadott === 0 ? '—' : `${s.atlag}%`}
                  </b>
                </div>
                {hianyzik > 0 && (
                  <p className="sub" style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--warn)' }}>
                    {hianyzik} feladatot nem adott be.
                  </p>
                )}
              </div>
            )
          })}
        </>
      )}
    </>
  )
}
