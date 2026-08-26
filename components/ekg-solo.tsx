'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EcgViewer } from '@/components/ecg-viewer'
import type { EcgCase } from '@/lib/ekg/analysis'
import { ANALYSIS_STEPS } from '@/lib/ekg/analysis'
import { GUIDELINE_SOURCES, registryFor } from '@/lib/sources/data'
import {
  EMPTY_ANSWER, RHYTHM_OPTIONS, AXIS_OPTIONS, PR_OPTIONS, QRS_OPTIONS, QTC_OPTIONS,
  ST_DIR_OPTIONS, T_OPTIONS, REGIONS, compareSolo, soloScore,
  VERDICT_LABEL, type Region, type SoloAnswer, type Verdict,
} from '@/lib/ekg/solo'

/**
 * Önálló EKG-elemzés.
 *
 * A felhasználó segítség nélkül tölti ki az elemzést — nincs hint, nincs
 * lépésenkénti visszajelzés. Az ellenőrzés után kétoldalas összehasonlítás
 * következik, elemenként ✓ / ~ / ✕ minősítéssel.
 */

const VERDICT_CLS: Record<Verdict, string> = {
  ok: 'sv-ok', partial: 'sv-partial', off: 'sv-off', skipped: 'sv-skip',
}

function Choice({
  label, value, options, onChange, hint,
}: {
  label: string
  value: string
  options: { id: string; label: string }[]
  onChange: (v: string) => void
  hint?: string
}) {
  return (
    <div className="solo-field">
      <div className="solo-lbl">{label}</div>
      {hint && <div className="sub" style={{ margin: '2px 0 6px', fontSize: 12 }}>{hint}</div>}
      <div className="eq-opts">
        {options.map((o) => (
          <button
            key={o.id} type="button"
            className={`eq-opt ${value === o.id ? 'picked' : ''}`}
            onClick={() => onChange(value === o.id ? '' : o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function RegionPicker({
  label, value, onChange, only,
}: {
  label: string
  value: Region[]
  onChange: (v: Region[]) => void
  only?: Region[]
}) {
  const list = only ? REGIONS.filter((r) => only.includes(r.id)) : REGIONS
  const toggle = (id: Region) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id])
  return (
    <div className="solo-field">
      <div className="solo-lbl">{label}</div>
      <div className="sh-chips">
        {list.map((r) => (
          <button
            key={r.id} type="button"
            className={`sh-chip ${value.includes(r.id) ? 'on' : ''}`}
            onClick={() => toggle(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SoloAnalysis({ ecgCase }: { ecgCase: EcgCase }) {
  const [a, setA] = useState<SoloAnswer>(EMPTY_ANSWER)
  const [checked, setChecked] = useState(false)
  const set = <K extends keyof SoloAnswer>(k: K, v: SoloAnswer[K]) => setA((s) => ({ ...s, [k]: v }))

  if (checked) {
    const rows = compareSolo(a, ecgCase.params)
    const score = soloScore(rows)
    const summaryRef = ecgCase.reference.osszegzes

    return (
      <>
        <div className="card">
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-num">{score.pct}%</div><div className="stat-lbl">Egyezés</div></div>
            <div className="stat-card"><div className="stat-num">{score.ok}</div><div className="stat-lbl">Helyes</div></div>
            <div className="stat-card"><div className="stat-num">{score.partial}</div><div className="stat-lbl">Részben</div></div>
            <div className="stat-card"><div className="stat-num">{score.off}</div><div className="stat-lbl">Eltérő</div></div>
          </div>
          <div className="sub" style={{ marginTop: 8, fontSize: 12 }}>
            A részben helyes válasz fél értéket ér. A kitöltetlen mezők nem számítanak bele.
          </div>
        </div>

        <div className="sec-h"><span className="sec-t">A te elemzésed és a referencia</span></div>
        {rows.map((r) => (
          <div className={`solo-cmp ${VERDICT_CLS[r.verdict]}`} key={r.key}>
            <div className="solo-cmp-h">
              <b>{r.label}</b>
              <span className="solo-verdict">{VERDICT_LABEL[r.verdict]}</span>
            </div>
            <div className="solo-cmp-body">
              <div>
                <div className="solo-cmp-k">A te elemzésed</div>
                <div className="solo-cmp-v">{r.mine}</div>
              </div>
              <div>
                <div className="solo-cmp-k">Referenciaelemzés</div>
                <div className="solo-cmp-v">{r.reference}</div>
              </div>
            </div>
            {r.note && <div className="sub" style={{ margin: '6px 0 0', fontSize: 12 }}>{r.note}</div>}
          </div>
        ))}

        <div className="sec-h"><span className="sec-t">Összegzés</span></div>
        <div className="card">
          <div className="solo-cmp-k">A te összegzésed</div>
          <div className="sub" style={{ marginTop: 4 }}>{a.summary.trim() || 'Nem írtál összegzést.'}</div>
          <div className="solo-cmp-k" style={{ marginTop: 12 }}>Referencia</div>
          <div className="sub" style={{ marginTop: 4 }}>{summaryRef}</div>
          <div className="sub" style={{ marginTop: 8, fontSize: 12 }}>
            A szöveges összegzést a rendszer nem pontozza — vesd össze magad a referenciával.
          </div>
        </div>

        {/* Teljes referencia lépésenként */}
        <details className="kt-acc">
          <summary className="kt-sum"><span>Teljes referenciaelemzés lépésenként</span></summary>
          <div className="kt-body">
            {ANALYSIS_STEPS.map((s) => ecgCase.reference[s.id] && (
              <div className="card" key={s.id} style={{ marginBottom: 8 }}>
                <b style={{ fontSize: 14 }}>{s.no} · {s.title}</b>
                <div className="sub" style={{ marginTop: 4 }}>{ecgCase.reference[s.id]}</div>
              </div>
            ))}
          </div>
        </details>

        <div className="sec-h"><span className="sec-t">Kiemelt eltérések</span></div>
        {ecgCase.findings.map((f, i) => (
          <details className="kt-acc" key={i}>
            <summary className="kt-sum"><span>{f.title}</span></summary>
            <div className="kt-body">
              <div className="card">
                <b style={{ fontSize: 13 }}>Mit látunk?</b><div className="sub" style={{ marginTop: 2 }}>{f.what}</div>
                <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Hol látjuk?</b><div className="sub" style={{ marginTop: 2 }}>{f.where}</div>
                <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Mit jelenthet?</b><div className="sub" style={{ marginTop: 2 }}>{f.meaning}</div>
                <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Differenciáldiagnosztika</b>
                <ul className="sub" style={{ marginTop: 2, paddingLeft: 18 }}>{f.ddx.map((d, j) => <li key={j}>{d}</li>)}</ul>
                <b style={{ fontSize: 13, display: 'block', marginTop: 8 }}>Miért fontos?</b><div className="sub" style={{ marginTop: 2 }}>{f.why}</div>
              </div>
              {f.leads && f.leads.length > 0 && (
                <EcgViewer params={ecgCase.params} highlightLeads={f.leads} caption={`Kiemelve: ${f.leads.join(', ')}`} />
              )}
            </div>
          </details>
        ))}

        <div className="sec-h"><span className="sec-t">Szakmai háttér</span></div>
        {ecgCase.evidence.map((e, i) => {
          const src = GUIDELINE_SOURCES.find((g) => g.id === e.sourceId)
          if (!src) {
            return <div className="card" key={i}><p className="form-err" style={{ margin: 0 }}>Hivatkozott forrás nem található: <code>{e.sourceId}</code></p></div>
          }
          const reg = registryFor(src)
          return (
            <div className="card" key={i} style={{ marginBottom: 8 }}>
              <b style={{ fontSize: 14 }}>{src.title}</b>
              <div className="sub" style={{ marginTop: 4 }}>
                {[src.org, src.year, src.identifier ? `azonosító: ${src.identifier}` : null,
                  src.intl ? 'nemzetközi' : 'magyar', src.primary ? 'elsődleges' : 'kiegészítő'].filter(Boolean).join(' · ')}
              </div>
              {e.note && <div className="sub" style={{ marginTop: 4 }}>{e.note}</div>}
              {reg && <a className="btn ghost sm" href={reg.url} target="_blank" rel="noopener" style={{ marginTop: 8 }}>Verzió ellenőrzése</a>}
            </div>
          )
        })}

        <div className="safety-note" style={{ marginTop: 10 }}>
          <b>ⓘ Oktatási eszköz.</b> A görbék szintetizáltak, nem valódi betegfelvételek. A rendszer
          egyetlen EKG-jel alapján nem állít fel diagnózist.
        </div>

        <div className="row" style={{ border: 'none', gap: 8, marginTop: 12 }}>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => { setA(EMPTY_ANSWER); setChecked(false) }}>
            Újrakezdés
          </button>
          <Link className="btn" href="/klinika/ekg/elemzes" style={{ flex: 1 }}>További esetek</Link>
        </div>
      </>
    )
  }

  const filled = [a.rhythm, a.rate, a.axis, a.pr, a.qrs, a.qtc, a.stDir, a.tShape].filter(Boolean).length

  return (
    <>
      <div className="card">
        <b style={{ fontSize: 14 }}>{ecgCase.age} éves {ecgCase.sex}</b>
        <div className="sub" style={{ marginTop: 4 }}>{ecgCase.vignette}</div>
      </div>

      <EcgViewer params={ecgCase.params} />

      <div className="safety-note" style={{ marginTop: 10 }}>
        <b>ⓘ Önálló mód.</b> Ebben a módban nincs segítség és nincs lépésenkénti visszajelzés.
        Töltsd ki az elemzést, amennyire tudod — a kihagyott mezők nem rontják az eredményt.
      </div>

      <div className="sec-h"><span className="sec-t">A te elemzésed</span><span className="sec-l" style={{ marginLeft: 'auto', fontWeight: 500 }}>{filled} / 8</span></div>

      <div className="card">
        <Choice label="Ritmus" value={a.rhythm} options={RHYTHM_OPTIONS} onChange={(v) => set('rhythm', v)} />

        <div className="solo-field">
          <div className="solo-lbl">Frekvencia</div>
          <div className="sub" style={{ margin: '2px 0 6px', fontSize: 12 }}>
            Kamrai frekvencia percenként. Szabálytalan ritmusnál a 10 másodperces csíkon számolt átlag.
          </div>
          <input
            className="field" type="number" inputMode="numeric" placeholder="pl. 72"
            value={a.rate} onChange={(e) => set('rate', e.target.value)} style={{ marginBottom: 0 }}
          />
        </div>

        <Choice label="Elektromos tengely" value={a.axis} options={AXIS_OPTIONS} onChange={(v) => set('axis', v)} />
        <Choice label="PR-intervallum" value={a.pr} options={PR_OPTIONS} onChange={(v) => set('pr', v)} />
        <Choice label="QRS-szélesség" value={a.qrs} options={QRS_OPTIONS} onChange={(v) => set('qrs', v)} />
        <Choice
          label="QT / QTc" value={a.qtc} options={QTC_OPTIONS} onChange={(v) => set('qtc', v)}
          hint="A mért QT-t korrigáld a frekvenciára, és a korrigált érték alapján válassz."
        />

        <Choice label="ST-szakasz" value={a.stDir} options={ST_DIR_OPTIONS} onChange={(v) => set('stDir', v)} />
        {a.stDir && a.stDir !== 'none' && (
          <RegionPicker label="Mely területen?" value={a.stRegions} onChange={(v) => set('stRegions', v)} />
        )}

        <Choice label="T-hullám" value={a.tShape} options={T_OPTIONS} onChange={(v) => set('tShape', v)} />
        {a.tShape && a.tShape !== 'none' && (
          <RegionPicker label="Mely területen?" value={a.tRegions} onChange={(v) => set('tRegions', v)} />
        )}

        <div className="solo-field" style={{ borderBottom: 'none' }}>
          <div className="solo-lbl">Saját összegzés</div>
          <div className="sub" style={{ margin: '2px 0 6px', fontSize: 12 }}>
            Foglald össze a leletet, és fogalmazd meg, mit jelent a klinikai kép tükrében.
          </div>
          <textarea
            className="field" rows={5} placeholder="Ritmus, frekvencia, tengely, intervallumok, eltérések és azok lokalizációja…"
            value={a.summary} onChange={(e) => set('summary', e.target.value)} style={{ marginBottom: 0 }}
          />
        </div>
      </div>

      <button className="btn" style={{ width: '100%', marginTop: 12 }} onClick={() => setChecked(true)} disabled={filled === 0}>
        Elemzésem ellenőrzése →
      </button>
      {filled === 0 && <p className="sub" style={{ marginTop: 6, fontSize: 12 }}>Tölts ki legalább egy mezőt az ellenőrzéshez.</p>}
    </>
  )
}
