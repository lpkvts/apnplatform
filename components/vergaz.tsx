'use client'

import { useMemo, useState } from 'react'
import {
  EMPTY, REFS, refOf, interpret, validate, O2_MODES, SOURCE_NOTE,
  type Values, type Sample, type Severity,
} from '@/lib/vergaz/data'
import { FOGALMAK, fogalom } from '@/lib/vergaz/fogalmak'
import { ESETEK, SZINT_LABEL, type Eset, type Szint } from '@/lib/vergaz/esetek'
import { kerdesek, type Kerdes } from '@/lib/vergaz/kerdesek'
import { VergazLelet } from '@/components/vergaz-lelet'

/**
 * Vérgáz modul.
 *
 * Négy nézet: az elemzés, a lépésenkénti gondolkodás, a gyakorló esetek és a
 * fogalmak. A számítási logika a lib rétegben van, ez a komponens csak
 * megjelenít — így a szakmai rész önállóan tesztelhető marad.
 */

type Tab = 'elemzes' | 'gondolkodj' | 'esetek' | 'fogalmak'

const TABS: { id: Tab; label: string }[] = [
  { id: 'elemzes', label: 'Elemzés' },
  { id: 'gondolkodj', label: 'Gondolkodj végig' },
  { id: 'esetek', label: 'Gyakorló esetek' },
  { id: 'fogalmak', label: 'Fogalmak' },
]

const SEV_LABEL: Record<Severity, string> = { ok: 'Rendben', warn: 'Figyelendő', alert: 'Sürgős' }

const state = (v: number | null, lo: number, hi: number) =>
  v == null ? '' : v < lo ? 'low' : v > hi ? 'high' : 'in'

/** Fogalommagyarázat lenyitóban — minden érték mellett elérhető. */
function FogalomBox({ k }: { k: string }) {
  const f = fogalom(k)
  if (!f) return null
  return (
    <details className="vg-fog">
      <summary>Mit jelent: {f.cim}?</summary>
      <div className="vg-fog-b">
        <p><b>Mit mér?</b> {f.mit}</p>
        <p><b>Miért fontos?</b> {f.miert}</p>
        {f.fel && (
          <>
            <p className="vg-fog-h">{f.fel.cim}</p>
            <ul>{f.fel.okok.map((o) => <li key={o}>{o}</li>)}</ul>
          </>
        )}
        {f.le && (
          <>
            <p className="vg-fog-h">{f.le.cim}</p>
            <ul>{f.le.okok.map((o) => <li key={o}>{o}</li>)}</ul>
          </>
        )}
        {f.megjegyzes && <p className="vg-fog-m">{f.megjegyzes}</p>}
      </div>
    </details>
  )
}

export function VergazElemzo() {
  const [tab, setTab] = useState<Tab>('elemzes')
  const [sample, setSample] = useState<Sample>('arterias')
  const [vals, setVals] = useState<Values>(EMPTY)
  const [o2mode, setO2mode] = useState<string>('levego')

  // Gondolkodj végig mód
  const [qi, setQi] = useState(0)
  const [picks, setPicks] = useState<Record<string, string>>({})

  // Gyakorló esetek
  const [szint, setSzint] = useState<Szint>('kezdo')
  const [openEset, setOpenEset] = useState<string | null>(null)
  const [megoldas, setMegoldas] = useState<Record<string, boolean>>({})

  const set = (k: keyof Values, raw: string) => {
    const t = raw.replace(',', '.').trim()
    setVals((s) => ({ ...s, [k]: t === '' ? null : Number(t) }))
  }

  const result = useMemo(() => interpret(vals, sample), [vals, sample])
  const qs = useMemo(() => kerdesek(vals, sample), [vals, sample])
  const kesz = vals.ph != null && vals.pco2 != null && vals.hco3 != null

  /** Eset betöltése az elemzőbe. */
  const betolt = (e: Eset) => {
    setVals(e.values)
    setSample(e.sample)
    setO2mode(e.values.fio2 === 0.21 ? 'levego' : 'egyeb')
    setQi(0); setPicks({})
    setTab('elemzes')
  }

  return (
    <>
      <div className="seg-row">
        {TABS.map((t) => (
          <button key={t.id} className={`seg ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ ELEMZÉS ══ */}
      {tab === 'elemzes' && (
        <>
          <div className="seg-row" style={{ marginTop: 12 }}>
            <button className={`seg ${sample === 'arterias' ? 'on' : ''}`} onClick={() => setSample('arterias')}>
              Artériás
            </button>
            <button className={`seg ${sample === 'venas' ? 'on' : ''}`} onClick={() => setSample('venas')}>
              Vénás
            </button>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <div className="vg-grid">
              {REFS.map((r) => {
                const ref = refOf(r.key, sample)
                const v = vals[r.key] as number | null
                const st = state(v, ref.low, ref.high)
                const err = validate(r.key, v)
                const tiltott = r.key === 'po2' && sample === 'venas'
                return (
                  <label className={`vg-field ${err ? 'bad' : st}`} key={r.key}>
                    <span className="vg-lbl">
                      {r.label}
                      <small>{ref.low}–{ref.high} {r.unit}</small>
                    </span>
                    <input
                      type="number" inputMode="decimal" step={r.step ?? 1}
                      value={v === null ? '' : String(v)}
                      onChange={(e) => set(r.key, e.target.value)}
                      aria-label={`${r.label} (${r.unit || 'érték'})`}
                      disabled={tiltott} placeholder={tiltott ? '—' : ''}
                    />
                    {err && <span className="vg-err">{err}</span>}
                  </label>
                )
              })}

              <label className="vg-field">
                <span className="vg-lbl">FiO₂<small>21–100 %</small></span>
                <input
                  type="number" inputMode="decimal" step={1} min={21} max={100}
                  value={vals.fio2 === null ? '' : String(Math.round(vals.fio2 * 100))}
                  onChange={(e) => {
                    const t = e.target.value.trim()
                    setVals((s) => ({ ...s, fio2: t === '' ? null : Number(t) / 100 }))
                  }}
                  aria-label="Belélegzett oxigén aránya" disabled={sample === 'venas'}
                />
              </label>

              <label className="vg-field">
                <span className="vg-lbl">Életkor<small>év</small></span>
                <input type="number" inputMode="numeric"
                  value={vals.kor === null ? '' : String(vals.kor)}
                  onChange={(e) => set('kor', e.target.value)} aria-label="Életkor" />
              </label>

              <label className="vg-field">
                <span className="vg-lbl">Légzésszám<small>/perc</small></span>
                <input type="number" inputMode="numeric"
                  value={vals.legzesszam === null ? '' : String(vals.legzesszam)}
                  onChange={(e) => set('legzesszam', e.target.value)} aria-label="Légzésszám" />
              </label>
            </div>

            {/* Oxigénbeviteli mód — a FiO₂ becsléséhez */}
            {sample === 'arterias' && (
              <div style={{ marginTop: 12 }}>
                <label className="sub" style={{ fontSize: 12, fontWeight: 700 }}>Oxigénbevitel módja</label>
                <div className="sh-chips" style={{ marginTop: 6 }}>
                  {O2_MODES.map((m) => (
                    <button key={m.id} type="button"
                      className={`sh-chip ${o2mode === m.id ? 'on' : ''}`}
                      onClick={() => {
                        setO2mode(m.id)
                        if (m.fio2 != null) setVals((s) => ({ ...s, fio2: m.fio2 }))
                      }}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <p className="sub" style={{ margin: '6px 0 0', fontSize: 11.5 }}>
                  Orrszonda és egyszerű maszk mellett a tényleges arány csak becsülhető: függ a beteg
                  légzési mintázatától. Gépi lélegeztetésnél a beállított értéket add meg.
                </p>
              </div>
            )}

            <div className="row" style={{ border: 'none', padding: '12px 0 0', gap: 8 }}>
              <button className="btn ghost sm" onClick={() => { setVals(EMPTY); setQi(0); setPicks({}) }}>
                Mezők ürítése
              </button>
              <span className="sub" style={{ margin: 0, fontSize: 12 }}>
                {kesz ? 'Az elemzés az értékek alapján frissül.' : 'A pH, a pCO₂ és a HCO₃⁻ megadása szükséges.'}
              </span>
            </div>
          </div>

          {result && (
            <>
              <div className="sec-h"><span className="sec-t">Lelet</span></div>
              <VergazLelet values={vals} sample={sample} />

              <div className="sec-h"><span className="sec-t">Összefoglalás</span></div>
              <div className="card vg-sum"><b>{result.summary}</b></div>

              {result.findings.map((f) => (
                <div className={`card vg-find ${f.severity}`} key={f.id}>
                  <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
                    <b style={{ fontSize: 14.5, flex: 1 }}>{f.title}</b>
                    <span className={`vg-badge ${f.severity}`}>{SEV_LABEL[f.severity]}</span>
                  </div>
                  <p className="vg-detail">{f.detail}</p>
                  <FogalomBox k={f.id === 'iranyt' ? 'ph' : f.id === 'komp' ? 'pco2' : f.id} />
                </div>
              ))}

              {result.caveats.length > 0 && (
                <div className="safety-note" style={{ marginTop: 10 }}>
                  <b>ⓘ Amit a számítás nem dönt el.</b>
                  <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                    {result.caveats.map((c, i) => (
                      <li key={i} style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 4 }}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ══ GONDOLKODJ VÉGIG ══ */}
      {tab === 'gondolkodj' && (
        <>
          {qs.length === 0 ? (
            <div className="card" style={{ marginTop: 12 }}>
              <p style={{ margin: 0 }}>
                Előbb add meg az értékeket az Elemzés fülön, vagy tölts be egy gyakorló esetet.
                A kérdések a megadott értékekből állnak össze.
              </p>
            </div>
          ) : (
            <>
              {/* A lelet végig látható, és az aktuális kérdéshez tartozó sorai
                  kiemelve — így a válasz a leleten keresendő, nem fejből. */}
              <div style={{ marginTop: 12 }}>
                <VergazLelet values={vals} sample={sample} kiemelt={qs[qi]?.id ?? null} />
              </div>
              <Gondolkodj qs={qs} qi={qi} setQi={setQi} picks={picks} setPicks={setPicks} />
            </>
          )}
        </>
      )}

      {/* ══ GYAKORLÓ ESETEK ══ */}
      {tab === 'esetek' && (
        <>
          <div className="sh-chips" style={{ marginTop: 14 }}>
            {(['kezdo', 'halado', 'expert'] as Szint[]).map((sz) => (
              <button key={sz} className={`sh-chip ${szint === sz ? 'on' : ''}`} onClick={() => setSzint(sz)}>
                {SZINT_LABEL[sz]}
              </button>
            ))}
          </div>

          <p className="sub" style={{ marginTop: 10 }}>
            Először csak a helyzetet és az értékeket látod. Elemezd magad, és utána nyisd meg a megoldást.
          </p>

          {ESETEK.filter((e) => e.szint === szint).map((e) => {
            const nyitva = openEset === e.id
            return (
              <div className="card" key={e.id} style={{ marginBottom: 10 }}>
                <b style={{ fontSize: 15 }}>{e.cim}</b>
                <p className="vg-vign">{e.vignetta}</p>

                <VergazLelet values={e.values} sample={e.sample} />

                <div className="row" style={{ border: 'none', padding: '10px 0 0', gap: 8 }}>
                  <button className="btn sm" onClick={() => betolt(e)}>Betöltöm az elemzőbe</button>
                  <button className="btn ghost sm"
                    onClick={() => { setOpenEset(nyitva ? null : e.id); setMegoldas((m) => ({ ...m, [e.id]: true })) }}>
                    {nyitva ? 'Megoldás elrejtése' : 'Megoldás'}
                  </button>
                </div>

                {nyitva && (
                  <div className="vg-megold">
                    <ol>{e.megoldas.map((m, i) => <li key={i}>{m}</li>)}</ol>
                    <p className="vg-tanulsag"><b>Tanulság.</b> {e.tanulsag}</p>
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}

      {/* ══ FOGALMAK ══ */}
      {tab === 'fogalmak' && (
        <>
          <p className="sub" style={{ marginTop: 14 }}>
            Mit mér az adott érték, miért fontos, és mi állhat az eltérés hátterében.
            A felsorolások lehetőségeket mutatnak, nem diagnózist.
          </p>
          {FOGALMAK.map((f) => (
            <details className="kt-acc" key={f.key}>
              <summary className="kt-sum"><span>{f.cim}</span></summary>
              <div className="kt-body vg-fog-b">
                <p><b>Mit mér?</b> {f.mit}</p>
                <p><b>Miért fontos?</b> {f.miert}</p>
                {f.fel && (
                  <>
                    <p className="vg-fog-h">{f.fel.cim}</p>
                    <ul>{f.fel.okok.map((o) => <li key={o}>{o}</li>)}</ul>
                  </>
                )}
                {f.le && (
                  <>
                    <p className="vg-fog-h">{f.le.cim}</p>
                    <ul>{f.le.okok.map((o) => <li key={o}>{o}</li>)}</ul>
                  </>
                )}
                {f.megjegyzes && <p className="vg-fog-m">{f.megjegyzes}</p>}
              </div>
            </details>
          ))}
        </>
      )}

      <p className="sub" style={{ marginTop: 14, fontSize: 12 }}>{SOURCE_NOTE}</p>
    </>
  )
}

/* ─────────── Gondolkodj végig ─────────── */

function Gondolkodj({
  qs, qi, setQi, picks, setPicks,
}: {
  qs: Kerdes[]
  qi: number
  setQi: (n: number) => void
  picks: Record<string, string>
  setPicks: (f: (p: Record<string, string>) => Record<string, string>) => void
}) {
  const vege = qi >= qs.length
  const q = qs[qi]
  const valasz = q ? picks[q.id] : undefined

  if (vege) {
    const jo = qs.filter((x) => picks[x.id] === x.helyes).length
    return (
      <>
        <div className="sec-h"><span className="sec-t">Eredmény</span></div>
        <div className="card vg-sum">
          <b>{jo} / {qs.length} helyes válasz</b>
          <p className="sub" style={{ margin: '6px 0 0' }}>
            {jo === qs.length
              ? 'Végig helyesen követted a gondolatmenetet.'
              : 'Nézd át az eltéréseket — a magyarázatok mutatják, hol tért el a következtetés.'}
          </p>
        </div>

        {qs.map((x) => {
          const p = picks[x.id]
          const ok = p === x.helyes
          return (
            <div className={`card vg-find ${ok ? 'ok' : 'warn'}`} key={x.id}>
              <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
                <b style={{ fontSize: 14, flex: 1 }}>{x.kerdes}</b>
                <span className={`vg-badge ${ok ? 'ok' : 'warn'}`}>{ok ? 'Helyes' : 'Eltért'}</span>
              </div>
              <p className="vg-detail">
                {!ok && p && (
                  <>A válaszod: <b>{x.opciok.find((o) => o.id === p)?.label}</b>. </>
                )}
                Helyes: <b>{x.opciok.find((o) => o.id === x.helyes)?.label}</b>. {x.magyarazat}
              </p>
            </div>
          )
        })}

        <button className="btn ghost" style={{ width: '100%', marginTop: 10 }}
          onClick={() => { setQi(0); setPicks(() => ({})) }}>
          Újrakezdés
        </button>
      </>
    )
  }

  return (
    <>
      <div className="vg-prog" style={{ marginTop: 14 }}>
        <div style={{ width: `${(qi / qs.length) * 100}%` }} />
      </div>
      <p className="sub" style={{ marginTop: 6, fontSize: 12 }}>{qi + 1}. kérdés a {qs.length}-ből</p>

      <div className="card" style={{ marginTop: 8 }}>
        <b style={{ fontSize: 15.5 }}>{q.kerdes}</b>
        <div style={{ marginTop: 12 }}>
          {q.opciok.map((o) => {
            const kivalasztott = valasz === o.id
            const helyes = o.id === q.helyes
            const mutat = valasz !== undefined
            return (
              <button key={o.id}
                className={`vg-opt ${mutat && helyes ? 'jo' : ''} ${mutat && kivalasztott && !helyes ? 'rossz' : ''}`}
                disabled={mutat}
                onClick={() => setPicks((p) => ({ ...p, [q.id]: o.id }))}>
                {o.label}
              </button>
            )
          })}
        </div>

        {valasz !== undefined && (
          <>
            <p className="vg-detail" style={{ marginTop: 12 }}>{q.magyarazat}</p>
            <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={() => setQi(qi + 1)}>
              {qi + 1 === qs.length ? 'Eredmény' : 'Következő kérdés'}
            </button>
          </>
        )}
      </div>
    </>
  )
}
