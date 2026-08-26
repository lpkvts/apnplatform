'use client'

import { useMemo, useState } from 'react'
import { LEADS, leadPath, type EcgParams, type Lead } from '@/lib/ekg/render'
import type { HighlightKind } from '@/lib/ekg/analysis'

/**
 * 12 elvezetéses EKG megjelenítő.
 *
 * Elrendezés: 4 oszlop × 3 sor + hosszú ritmuscsík (II. elvezetés), ahogy a
 * klinikai gyakorlatban megszokott. A rács 1 mm-es és 5 mm-es osztású, hogy a
 * mérési feladatok elvégezhetők legyenek.
 *
 * Az `unitsPerMm = 4`, tehát 25 mm/s mellett 1 másodperc = 100 SVG-egység.
 */

const U = 4                       // SVG-egység / mm
const CELL_W = 62.5 * U           // 2,5 s = 62,5 mm
const CELL_H = 26 * U             // 26 mm magas cella
const PAD = 6 * U
const GRID_W = CELL_W * 4
const RHYTHM_H = 30 * U
const TOTAL_W = GRID_W + PAD * 2
const TOTAL_H = CELL_H * 3 + RHYTHM_H + PAD * 3

const ROWS: Lead[][] = [
  ['I', 'aVR', 'V1', 'V4'],
  ['II', 'aVL', 'V2', 'V5'],
  ['III', 'aVF', 'V3', 'V6'],
]

/** Melyik elvezetéseket emeljük ki az adott elemzési lépéshez. */
function focusLeads(kind: HighlightKind, extra?: Lead[]): Lead[] {
  if (extra && extra.length) return extra
  switch (kind) {
    case 'rr': case 'p': case 'pr': case 'qt': return ['II']
    case 'qrs': return ['I', 'aVF', 'V1', 'V6']
    case 'st': case 't': return [...LEADS]
    default: return []
  }
}

export function EcgViewer({
  params, highlight = 'none', highlightLeads, caption,
}: {
  params: EcgParams
  highlight?: HighlightKind
  highlightLeads?: Lead[]
  caption?: string
}) {
  const [zoom, setZoom] = useState(1)
  const [solo, setSolo] = useState<Lead | null>(null)

  const focus = useMemo(() => focusLeads(highlight, highlightLeads), [highlight, highlightLeads])
  const paths = useMemo(() => {
    const m = {} as Record<Lead, string>
    for (const l of LEADS) m[l] = leadPath(l, params, CELL_W, CELL_H, { unitsPerMm: U })
    return m
  }, [params])
  const rhythmPath = useMemo(
    () => leadPath('II', params, GRID_W, RHYTHM_H, { unitsPerMm: U }),
    [params],
  )

  const isFocused = (l: Lead) => focus.length === 0 || focus.includes(l)

  return (
    <div className="ecg12">
      <div className="ecg12-bar">
        <span className="ecg12-cal">25 mm/s · 10 mm/mV</span>
        <span style={{ flex: 1 }} />
        <button className="btn ghost sm" onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))} aria-label="Kicsinyítés">−</button>
        <span className="ecg12-zoom">{Math.round(zoom * 100)}%</span>
        <button className="btn ghost sm" onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} aria-label="Nagyítás">+</button>
      </div>

      {solo && (
        <div className="ecg12-solo">
          <span>Kiemelt elvezetés: <b>{solo}</b></span>
          <button className="btn ghost sm" onClick={() => setSolo(null)}>Vissza a 12 elvezetéshez</button>
        </div>
      )}

      <div className="ecg12-scroll">
        <svg
          viewBox={solo ? `0 0 ${GRID_W + PAD * 2} ${RHYTHM_H + PAD * 2}` : `0 0 ${TOTAL_W} ${TOTAL_H}`}
          style={{ width: `${zoom * 100}%`, minWidth: '100%', height: 'auto', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="ecgSmall" width={U} height={U} patternUnits="userSpaceOnUse">
              <path d={`M ${U} 0 L 0 0 0 ${U}`} fill="none" stroke="var(--ecg-grid-1, #F3D9D9)" strokeWidth="0.5" />
            </pattern>
            <pattern id="ecgBig" width={U * 5} height={U * 5} patternUnits="userSpaceOnUse">
              <rect width={U * 5} height={U * 5} fill="url(#ecgSmall)" />
              <path d={`M ${U * 5} 0 L 0 0 0 ${U * 5}`} fill="none" stroke="var(--ecg-grid-2, #E8B4B4)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#ecgBig)" />

          {solo ? (
            <g transform={`translate(${PAD}, ${PAD})`}>
              <text x="2" y="12" className="ecg12-lbl">{solo}</text>
              <polyline points={leadPath(solo, params, GRID_W, RHYTHM_H, { unitsPerMm: U })}
                fill="none" stroke="var(--ecg-line, #111)" strokeWidth="1.6" strokeLinejoin="round" />
            </g>
          ) : (
            <>
              {ROWS.map((row, r) =>
                row.map((lead, c) => (
                  <g key={lead} transform={`translate(${PAD + c * CELL_W}, ${PAD + r * CELL_H})`}
                    onClick={() => setSolo(lead)} style={{ cursor: 'pointer' }}>
                    {isFocused(lead) && focus.length > 0 && focus.length < 12 && (
                      <rect width={CELL_W} height={CELL_H} fill="var(--brand-3)" opacity="0.07" rx="4" />
                    )}
                    <text x="3" y="12" className="ecg12-lbl">{lead}</text>
                    <polyline
                      points={paths[lead]} fill="none"
                      stroke={isFocused(lead) ? 'var(--ecg-line, #111)' : 'var(--ecg-dim, #9AA0A6)'}
                      strokeWidth={isFocused(lead) ? 1.5 : 1.1}
                      strokeLinejoin="round"
                    />
                    {c > 0 && <line x1="0" y1="4" x2="0" y2={CELL_H - 4} stroke="var(--line)" strokeWidth="0.8" />}
                  </g>
                )),
              )}
              <g transform={`translate(${PAD}, ${PAD + CELL_H * 3 + PAD})`}>
                <text x="3" y="12" className="ecg12-lbl">II — ritmuscsík</text>
                <polyline points={rhythmPath} fill="none" stroke="var(--ecg-line, #111)" strokeWidth="1.5" strokeLinejoin="round" />
              </g>
            </>
          )}
        </svg>
      </div>

      <div className="ecg12-foot">
        {caption ?? 'Oktatási célú, szintetizált görbe — nem valódi betegfelvétel. Koppints egy elvezetésre a nagyításhoz.'}
      </div>
    </div>
  )
}
