import Link from 'next/link'
import { getEkgCompetences, getEkgProgress } from '@/lib/ekg/progress'
import { EKG_COMPETENCES } from '@/lib/ekg/analysis'

export const dynamic = 'force-dynamic'

/** A gyengébb területek előre. A nem gyakorolt területek a lista végére kerülnek. */
const GYENGE = 70

export default async function EkgFejlodesPage() {
  const [rows, prog] = await Promise.all([getEkgCompetences(), getEkgProgress()])
  const byId = new Map(rows.map((r) => [r.competence, r]))

  // Minden területet megmutatunk, a még nem gyakoroltakat is — így látszik,
  // hol van fehér folt, nem csak az, hol van hiba.
  const list = EKG_COMPETENCES.map((c) => {
    const r = byId.get(c.id)
    return { ...c, pct: r?.pct ?? null, total: r?.total ?? 0 }
  }).sort((a, b) => {
    if (a.pct === null && b.pct === null) return 0
    if (a.pct === null) return 1
    if (b.pct === null) return -1
    return a.pct - b.pct
  })

  const gyenge = list.filter((c) => c.pct !== null && c.pct < GYENGE)
  const kezdes = list.find((c) => c.pct === null)

  return (
    <>
      <Link className="sh-back" href="/klinika/ekg">‹ EKG</Link>
      <h1 className="h1">Saját fejlődés</h1>
      <p className="sub">
        A százalékok területenként az utolsó negyven válaszodból számolódnak, így a
        régebbi hibák nem rontják örökre az arányt.
      </p>

      {prog && prog.attempts > 0 ? (
        <div className="card">
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-num">{prog.attempts}</div><div className="stat-lbl">Elvégzett feladat</div></div>
            <div className="stat-card"><div className="stat-num">{prog.avg_pct}%</div><div className="stat-lbl">Átlagos eredmény</div></div>
            <div className="stat-card"><div className="stat-num">{prog.streak_days}</div><div className="stat-lbl">Aktív nap (30 napban)</div></div>
          </div>
        </div>
      ) : (
        <div className="card">
          <p style={{ margin: 0 }}>
            Még nincs rögzített eredményed. Kezdd egy vezetett elemzéssel vagy néhány
            gyakorló kérdéssel — a válaszaidból épül fel a fejlődési képed.
          </p>
          <Link className="btn" href="/klinika/ekg/elemzes/vezetett" style={{ width: '100%', marginTop: 12 }}>
            Vezetett elemzés indítása
          </Link>
        </div>
      )}

      <div className="sec-h"><span className="sec-t">EKG kompetenciák</span></div>
      {list.map((c) => (
        <div className="card" key={c.id} style={{ marginBottom: 8 }}>
          <div className="row" style={{ border: 'none', padding: 0 }}>
            <b style={{ fontSize: 15 }}>{c.label}</b>
            <span style={{ fontWeight: 800, color: c.pct === null ? 'var(--muted)' : c.pct < GYENGE ? '#B45309' : 'var(--brand)' }}>
              {c.pct === null ? '—' : `${c.pct}%`}
            </span>
          </div>
          <div className="ekg-prog-bar" style={{ marginTop: 8 }}>
            <div style={{ width: `${c.pct ?? 0}%`, background: c.pct !== null && c.pct < GYENGE ? '#F0B429' : undefined }} />
          </div>
          <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>
            {c.total === 0
              ? 'Még nem gyakoroltad ezt a területet.'
              : `${c.total} válasz alapján`}
          </div>
          {(c.pct === null || c.pct < GYENGE) && (
            <Link className="sec-l" href={`/klinika/ekg/elemzes/gyakorlas?terulet=${c.id}`} style={{ display: 'inline-block', marginTop: 8, fontSize: 13.5 }}>
              Gyakorlás ajánlott →
            </Link>
          )}
        </div>
      ))}

      {(gyenge.length > 0 || kezdes) && (
        <>
          <div className="sec-h"><span className="sec-t">Javasolt számodra</span></div>
          <div className="card">
            {gyenge.length > 0 ? (
              <>
                <b>{gyenge[0].label}</b>
                <div className="sub" style={{ marginTop: 4 }}>
                  Ezen a területen {gyenge[0].pct}%-os az eredményed. Néhány célzott
                  feladat sokat javíthat rajta.
                </div>
              </>
            ) : (
              <>
                <b>{kezdes!.label}</b>
                <div className="sub" style={{ marginTop: 4 }}>
                  Ezt a területet még nem gyakoroltad.
                </div>
              </>
            )}
            <Link className="btn" style={{ width: '100%', marginTop: 12 }}
              href={`/klinika/ekg/elemzes/gyakorlas?terulet=${(gyenge[0] ?? kezdes)!.id}`}>
              Gyakorlás indítása
            </Link>
          </div>
        </>
      )}

      <p className="sub" style={{ marginTop: 14, fontSize: 12 }}>
        Az eredmények csak a te fiókodhoz tartoznak, más nem látja őket.
      </p>
    </>
  )
}
