'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  filterCountries, STATUS_LABEL, STATUS_HINT, REGION_LABEL, PRESCRIBING_LABEL,
  AUTONOMY_LABEL, CONFIDENCE_LABEL, SCOPE_DIMS, SCOPE_JEL, SCOPE_LABEL,
  SCOPE_LEVEL_LABEL,
  type Country, type Region, type Status, type Prescribing, type Autonomy,
  type Summary, type TimelineItem,
} from '@/lib/apnworld/types'

/**
 * APN World.
 *
 * Három nézet: felfedezés országonként, összehasonlítás, és idővonal.
 *
 * Az összehasonlító a modul lényege: két–négy ország hatásköre egymás mellett,
 * négyfokú jelöléssel. A puszta igen/nem félrevezető lenne, mert a
 * jogosultságok jelentős része feltételhez kötött — ezt a „feltételesen"
 * jelölés és a mellé tartozó magyarázat mutatja meg.
 */

type Tab = 'felfedezes' | 'osszehasonlitas' | 'idovonal'

const STATUS_SAV: Record<Status, string> = {
  established: 'st-passed', developing: 'st-progress',
  emerging: 'st-none', limited: 'st-locked',
}

export function ApnWorld({
  countries, summary, timeline,
}: {
  countries: Country[]
  summary: Summary | null
  timeline: TimelineItem[]
}) {
  const [tab, setTab] = useState<Tab>('felfedezes')
  const [q, setQ] = useState('')
  const [region, setRegion] = useState<Region | ''>('')
  const [status, setStatus] = useState<Status | ''>('')
  const [presc, setPresc] = useState<Prescribing | ''>('')
  const [auto, setAuto] = useState<Autonomy | ''>('')
  const [valasztott, setValasztott] = useState<string[]>(['HU', 'US', 'NL'])

  const talalat = useMemo(
    () => filterCountries(countries, { q, region, status, prescribing: presc, autonomy: auto }),
    [countries, q, region, status, presc, auto],
  )

  const szurve = q !== '' || region !== '' || status !== '' || presc !== '' || auto !== ''
  const elerheto = (mezo: keyof Country) =>
    [...new Set(countries.map((c) => c[mezo] as string))]

  const valt = (code: string) => {
    setValasztott((v) =>
      v.includes(code) ? v.filter((x) => x !== code)
      : v.length >= 4 ? v   // négynél több oszlop már olvashatatlan
      : [...v, code],
    )
  }
  const osszehasonlitott = countries.filter((c) => valasztott.includes(c.code))

  return (
    <>
      {/* ── Áttekintő számok ── */}
      {summary && (
        <div className="card">
          <div className="stat-grid aw-stat">
            <div className="stat-card"><div className="stat-num">{summary.orszagok}</div><div className="stat-lbl">Ország</div></div>
            <div className="stat-card"><div className="stat-num">{summary.magas_bizonyossag}</div><div className="stat-lbl">Megbízható adat</div></div>
            <div className="stat-card"><div className="stat-num">{summary.onallo_feliras}</div><div className="stat-lbl">Széles felírási jog</div></div>
            <div className="stat-card"><div className="stat-num">{summary.mesterfokozat}</div><div className="stat-lbl">Mesterfokozat kötelező</div></div>
            <div className="stat-card"><div className="stat-num">{summary.forrasok}</div><div className="stat-lbl">Hivatkozott forrás</div></div>
          </div>
        </div>
      )}

      <div className="seg-row">
        <button className={`seg ${tab === 'felfedezes' ? 'on' : ''}`} onClick={() => setTab('felfedezes')}>
          Országok
        </button>
        <button className={`seg ${tab === 'osszehasonlitas' ? 'on' : ''}`} onClick={() => setTab('osszehasonlitas')}>
          Összehasonlítás
        </button>
        <button className={`seg ${tab === 'idovonal' ? 'on' : ''}`} onClick={() => setTab('idovonal')}>
          Idővonal
        </button>
      </div>

      {/* ══ FELFEDEZÉS ══ */}
      {tab === 'felfedezes' && (
        <>
          <div className="search-box" style={{ marginTop: 14 }}>
            <input className="search-input" value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Ország, szerepkör, terület…" aria-label="Keresés az országok között" />
          </div>

          <div className="card" style={{ marginTop: 10 }}>
            <Szuro cim="Régió" ertek={region} setErtek={setRegion}
              opciok={elerheto('region').map((r) => [r, REGION_LABEL[r as Region]])} />
            <Szuro cim="Rendszer állapota" ertek={status} setErtek={setStatus}
              opciok={elerheto('status').map((s) => [s, STATUS_LABEL[s as Status]])} />
            <Szuro cim="Gyógyszerfelírás" ertek={presc} setErtek={setPresc}
              opciok={elerheto('prescribing').map((p) => [p, PRESCRIBING_LABEL[p as Prescribing]])} />
            <Szuro cim="Önállóság" ertek={auto} setErtek={setAuto}
              opciok={elerheto('autonomy').map((a) => [a, AUTONOMY_LABEL[a as Autonomy]])} />
            {szurve && (
              <button className="btn ghost sm" style={{ marginTop: 12 }}
                onClick={() => { setQ(''); setRegion(''); setStatus(''); setPresc(''); setAuto('') }}>
                Szűrők törlése
              </button>
            )}
          </div>

          <div className="sec-h">
            <span className="sec-t">
              {talalat.length === 0 ? 'Nincs találat' : `${talalat.length} ország`}
            </span>
          </div>

          {talalat.length === 0 && (
            <p className="sub">Próbálj tágabb szűrést, vagy törölj néhány feltételt.</p>
          )}

          <div className="lst">
            {talalat.map((c) => (
              <Link className="lst-sor" href={`/apn-world/${c.code.toLowerCase()}`} key={c.code}>
                <span className="aw-flag" aria-hidden="true">{c.flag}</span>
                <span className="lst-fo">
                  <b>{c.name}</b>
                  <span>
                    {c.roles.map((r) => r.abbr ?? r.name).join(', ')}
                    {' · '}{PRESCRIBING_LABEL[c.prescribing]} felírás
                  </span>
                </span>
                <span className="lst-veg">
                  <span className={`st ${STATUS_SAV[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                  <span className="lst-nyil" aria-hidden="true">›</span>
                </span>
              </Link>
            ))}
          </div>

          <p className="sub" style={{ marginTop: 12, fontSize: 'var(--t-caption)' }}>
            {STATUS_HINT.established} {STATUS_HINT.developing}
          </p>
        </>
      )}

      {/* ══ ÖSSZEHASONLÍTÁS ══ */}
      {tab === 'osszehasonlitas' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            Válassz legfeljebb négy országot. A jelölés négyfokú, mert a jogosultságok
            jelentős része feltételhez kötött — a puszta igen vagy nem félrevezető lenne.
          </p>

          <div className="sh-chips">
            {countries.map((c) => (
              <button key={c.code}
                className={`sh-chip ${valasztott.includes(c.code) ? 'on' : ''}`}
                onClick={() => valt(c.code)}
                disabled={!valasztott.includes(c.code) && valasztott.length >= 4}>
                {c.flag} {c.name}
              </button>
            ))}
          </div>

          {osszehasonlitott.length < 2 ? (
            <div className="card empty" style={{ marginTop: 14 }}>
              <b>Válassz legalább két országot</b>
              <p>Az összehasonlítás akkor mond valamit, ha van mihez viszonyítani.</p>
            </div>
          ) : (
            <>
              <div className="tbl-wrap" style={{ marginTop: 14 }}>
                <table className="tbl aw-tbl">
                  <thead>
                    <tr>
                      <th>Hatáskör</th>
                      {osszehasonlitott.map((c) => (
                        <th key={c.code} className="num">{c.flag} {c.code}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SCOPE_DIMS.map((d) => (
                      <tr key={d.key}>
                        <td className="fo">{d.label}</td>
                        {osszehasonlitott.map((c) => {
                          const it = c.scope?.[d.key]
                          const v = it?.v ?? 'unknown'
                          const cim = [
                            SCOPE_LABEL[v],
                            it?.scope ? SCOPE_LEVEL_LABEL[it.scope] : null,
                            it?.note,
                          ].filter(Boolean).join(' — ')
                          return (
                            <td key={c.code} className={`num aw-jel aw-${v}`} title={cim}>
                              {SCOPE_JEL[v]}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td className="fo">Gyógyszerfelírás</td>
                      {osszehasonlitott.map((c) => (
                        <td key={c.code} className="num" title={c.prescribing_note ?? ''}>
                          {PRESCRIBING_LABEL[c.prescribing]}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fo">Önállóság</td>
                      {osszehasonlitott.map((c) => (
                        <td key={c.code} className="num" title={c.autonomy_note ?? ''}>
                          {AUTONOMY_LABEL[c.autonomy]}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="fo">Adat megbízhatósága</td>
                      {osszehasonlitott.map((c) => (
                        <td key={c.code} className="num">{CONFIDENCE_LABEL[c.data_confidence]}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="aw-jelmagy">
                <span><b className="aw-yes">✓</b> Igen</span>
                <span><b className="aw-conditional">◐</b> Feltételesen</span>
                <span><b className="aw-no">✕</b> Nem</span>
                <span><b className="aw-unknown">—</b> Nincs elég adat</span>
              </div>
              <p className="sub" style={{ fontSize: 'var(--t-caption)' }}>
                A jelölések fölé állva megjelenik a magyarázat és az is, hogy a szabályozás
                országos, területi vagy intézményi szintű-e.
              </p>
            </>
          )}
        </>
      )}

      {/* ══ IDŐVONAL ══ */}
      {tab === 'idovonal' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            Hogyan alakult ki a szerepkör a világban.
          </p>
          <div className="aw-ido">
            {timeline.map((t) => (
              <div className="aw-ido-e" key={t.id}>
                <span className="aw-ido-p">{t.period}</span>
                <div>
                  <b>{t.title}</b>
                  {t.description && <p>{t.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

/** Egy szűrősor. Csak azokat az értékeket kínálja, amelyekre van adat. */
function Szuro<T extends string>({
  cim, ertek, setErtek, opciok,
}: {
  cim: string
  ertek: T | ''
  setErtek: (v: T | '') => void
  opciok: [string, string][]
}) {
  if (opciok.length < 2) return null
  return (
    <>
      <label className="sub" style={{ fontSize: 'var(--t-caption)', fontWeight: 700 }}>{cim}</label>
      <div className="sh-chips" style={{ marginTop: 6, marginBottom: 12 }}>
        <button className={`sh-chip ${ertek === '' ? 'on' : ''}`} onClick={() => setErtek('')}>Mind</button>
        {opciok.map(([v, l]) => (
          <button key={v} className={`sh-chip ${ertek === v ? 'on' : ''}`}
            onClick={() => setErtek(ertek === v ? '' : (v as T))}>{l}</button>
        ))}
      </div>
    </>
  )
}
