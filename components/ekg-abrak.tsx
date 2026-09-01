import { leadPath, type EcgParams, type Lead } from '@/lib/ekg/render'

/**
 * Magyarázó ábrák az EKG elemzéshez.
 *
 * A szöveges segítség önmagában nehezen megfogható: a „pozitív I. és negatív
 * aVF" mondatot könnyebb megjegyezni, ha látja is az ember, hova mutat. Ezek az
 * ábrák szándékosan a lehető legegyszerűbbek — nem az EKG-t rajzolják le,
 * hanem az összefüggést mutatják meg.
 */

/** A frontális tengelyállás meghatározása az I. és az aVF elvezetésből. */
export function AxisDiagram() {
  // A négy negyed: az I. (vízszintes) és az aVF (függőleges) iránya dönt.
  const Q = [
    { x: 0, y: 0, i: '+', avf: '−', label: 'Bal tengely', short: 'BAL', color: '#0891B2' },
    { x: 1, y: 0, i: '−', avf: '−', label: 'Extrém', short: 'EXTRÉM', color: '#B91C1C' },
    { x: 0, y: 1, i: '+', avf: '+', label: 'Normál', short: 'NORMÁL', color: '#22A878' },
    { x: 1, y: 1, i: '−', avf: '+', label: 'Jobb tengely', short: 'JOBB', color: '#B45309' },
  ]
  return (
    <figure className="ekg-fig">
      <svg viewBox="0 0 260 200" className="ekg-fig-svg" role="img"
        aria-label="A tengelyállás meghatározása az I. és aVF elvezetés iránya alapján">
        {/* Tengelyfeliratok */}
        <text x="130" y="12" className="ef-ax" textAnchor="middle">aVF negatív ↑</text>
        <text x="130" y="196" className="ef-ax" textAnchor="middle">aVF pozitív ↓</text>
        <text x="6" y="104" className="ef-ax">I. pozitív</text>
        <text x="254" y="104" className="ef-ax" textAnchor="end">I. negatív</text>

        {Q.map((q, n) => {
          const x = 62 + q.x * 68
          const y = 24 + q.y * 74
          return (
            <g key={n}>
              <rect x={x} y={y} width="66" height="72" rx="9"
                fill={q.color} fillOpacity="0.12" stroke={q.color} strokeWidth="1.4" />
              <text x={x + 33} y={y + 26} className="ef-sign" textAnchor="middle" fill={q.color}>
                I {q.i}
              </text>
              <text x={x + 33} y={y + 44} className="ef-sign" textAnchor="middle" fill={q.color}>
                aVF {q.avf}
              </text>
              <text x={x + 33} y={y + 62} className="ef-lbl" textAnchor="middle" fill={q.color}>
                {q.short}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>
        Nézd meg az <b>I.</b> és az <b>aVF</b> elvezetés nettó irányát — a QRS felfelé vagy
        lefelé néz-e összességében. A két előjel együtt adja ki a tengelyállást.
      </figcaption>
    </figure>
  )
}

/** Melyik elvezetés melyik szívfalat képezi le. */
const REGIONS = [
  {
    name: 'Inferior', leads: ['II', 'III', 'aVF'], color: '#B45309',
    note: 'Alsó fal — jellemzően a jobb koszorúér ellátási területe.',
  },
  {
    name: 'Anteroseptalis', leads: ['V1', 'V2', 'V3', 'V4'], color: '#0891B2',
    note: 'Elülső fal és sövény — a bal elülső leszálló ág területe.',
  },
  {
    name: 'Lateralis', leads: ['I', 'aVL', 'V5', 'V6'], color: '#22A878',
    note: 'Oldalfal — a körbefutó ág területe.',
  },
  {
    name: 'aVR', leads: ['aVR'], color: '#94A3B8',
    note: 'Nem képez le önálló falat; az iránya ellentétes a többivel.',
  },
]

export function LeadRegionsDiagram() {
  // A 12 elvezetés a szabványos 3×4 elrendezésben, hogy a felület képével egyezzen.
  const ROWS = [['I', 'aVR', 'V1', 'V4'], ['II', 'aVL', 'V2', 'V5'], ['III', 'aVF', 'V3', 'V6']]
  const colorOf = (l: string) => REGIONS.find((r) => r.leads.includes(l))!.color

  return (
    <figure className="ekg-fig">
      <div className="ef-grid" role="img" aria-label="A tizenkét elvezetés területek szerint színezve">
        {ROWS.map((row, i) => (
          <div className="ef-row" key={i}>
            {row.map((l) => (
              <span key={l} className="ef-cell"
                style={{ borderColor: colorOf(l), color: colorOf(l), background: `${colorOf(l)}14` }}>
                {l}
              </span>
            ))}
          </div>
        ))}
      </div>
      <ul className="ef-legend">
        {REGIONS.map((r) => (
          <li key={r.name}>
            <span className="ef-dot" style={{ background: r.color }} />
            <b style={{ color: r.color }}>{r.name}</b>
            <span className="ef-leads">{r.leads.join(', ')}</span>
            <span className="ef-note">{r.note}</span>
          </li>
        ))}
      </ul>
      <figcaption>
        Két szomszédos elvezetésben egyszerre látható eltérés utal területi
        érintettségre. Az egyetlen elvezetésben megjelenő változás önmagában ritkán elég.
      </figcaption>
    </figure>
  )
}

/**
 * A beosztás és a görbe együtt: a dobozos ábra a beosztást tanítja, a görbe azt,
 * hogyan néz ki mindez élesben, és mit jelent, ha egy terület együtt mozdul.
 */
export function LeadRegionsFull() {
  return (
    <>
      <LeadRegionsDiagram />
      <details className="ekg-figtoggle" style={{ marginTop: 10 }}>
        <summary>Hogyan néz ki ez a valódi görbén?</summary>
        <LeadRegionsEcg />
        <div className="sec-h" style={{ marginTop: 6 }}>
          <span className="sec-t" style={{ fontSize: 12 }}>Amikor egy terület érintett</span>
        </div>
        <LeadRegionsEcg demo="inferior" />
      </details>
    </>
  )
}


/* ─────────── Területek valódi görbén ─────────── */

const ROWS_12: Lead[][] = [
  ['I', 'aVR', 'V1', 'V4'],
  ['II', 'aVL', 'V2', 'V5'],
  ['III', 'aVF', 'V3', 'V6'],
]

/** Élettani görbe — a területek tanulásához nem zavar bele semmilyen eltérés. */
const NORMAL: EcgParams = {
  rate: 68, rhythm: 'sinus', p: 'normal', prMs: 160, qrsMs: 90,
  axis: 'normal', qtMs: 390, noise: 0.15,
}

/** Inferior ST-eleváció — itt látszik, mit jelent, hogy egy terület együtt mozdul. */
const INFERIOR: EcgParams = {
  rate: 62, rhythm: 'sinus', p: 'normal', prMs: 165, qrsMs: 92,
  axis: 'normal', qtMs: 390,
  st: { II: 3.4, III: 4.0, aVF: 3.6, I: -1.4, aVL: -1.8 },
  t: { II: 'peaked', III: 'peaked', aVF: 'peaked' },
  noise: 0.2,
}

/**
 * A tizenkét elvezetés valódi görbével, területek szerint színezett háttérrel.
 *
 * A színes dobozos ábra megtanítja a beosztást, de a felismerés a görbén
 * történik — ezért itt ugyanaz a beosztás a tényleges EKG-képen látszik.
 * Az `demo="inferior"` változat megmutatja, hogyan mozdul együtt egy terület
 * három elvezetése, miközben a szemközti kettő ellentétes irányba tér el.
 */
export function LeadRegionsEcg({ demo = 'normal' }: { demo?: 'normal' | 'inferior' }) {
  const params = demo === 'inferior' ? INFERIOR : NORMAL
  const U = 3.2                    // egy milliméter képpontban
  const W = 44 * U                 // egy cella szélessége
  const H = 27 * U                 // egy cella magassága
  const colorOf = (l: Lead) => REGIONS.find((r) => r.leads.includes(l))!.color

  return (
    <figure className="ekg-fig">
      <svg
        viewBox={`0 0 ${W * 4 + 8} ${H * 3 + 8}`} className="ekg-fig-svg ef-wide"
        role="img"
        aria-label={demo === 'inferior'
          ? 'Tizenkét elvezetéses EKG, amelyen az inferior terület három elvezetése együtt tér el'
          : 'Tizenkét elvezetéses EKG, területek szerint színezve'}
      >
        {ROWS_12.map((row, r) =>
          row.map((lead, c) => {
            const x = 4 + c * W
            const y = 4 + r * H
            const col = colorOf(lead)
            return (
              <g key={lead} transform={`translate(${x},${y})`}>
                <rect width={W - 2} height={H - 2} rx="5" fill={col} fillOpacity="0.09" />
                <text x="5" y="12" className="ef-cell-l" fill={col}>{lead}</text>
                <polyline
                  points={leadPath(lead, params, W - 2, H - 2, { unitsPerMm: U })}
                  fill="none" stroke="var(--ink)" strokeWidth="1.1" strokeLinejoin="round"
                />
              </g>
            )
          }),
        )}
      </svg>

      <ul className="ef-legend">
        {REGIONS.filter((r) => r.name !== 'aVR').map((r) => (
          <li key={r.name}>
            <span className="ef-dot" style={{ background: r.color }} />
            <b style={{ color: r.color }}>{r.name}</b>
            <span className="ef-leads">{r.leads.join(', ')}</span>
          </li>
        ))}
      </ul>

      <figcaption>
        {demo === 'inferior' ? (
          <>
            Az <b>inferior</b> terület mindhárom elvezetése együtt emelkedik, miközben az
            I. és az aVL ellentétes irányba tér el. Ez a kettősség — együtt mozduló terület
            és szemközti reciprok eltérés — erősíti meg, hogy valódi területi érintettségről
            van szó, nem mérési hibáról.
          </>
        ) : (
          <>Ugyanaz a beosztás a valódi görbén: a szín azt mutatja, melyik elvezetés melyik falat képezi le.</>
        )}
      </figcaption>
    </figure>
  )
}
