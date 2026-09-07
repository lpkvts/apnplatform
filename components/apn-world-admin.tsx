'use client'

import { useState, useTransition } from 'react'
import { ConfirmAction } from '@/components/confirm-action'
import {
  saveCountry, setCountryStatus, deleteCountry, addSource, deleteSource, type Res,
} from '@/lib/apnworld/actions'
import {
  STATUS_LABEL, CONFIDENCE_LABEL, REGION_LABEL, PRESCRIBING_LABEL,
  AUTONOMY_LABEL, PRIMARY_CARE_LABEL,
  type Country, type Source,
} from '@/lib/apnworld/types'

/**
 * APN World — országprofilok kezelése.
 *
 * A közzététel külön lépés: az új profil piszkozatként jön létre, és csak
 * akkor jelenik meg a felhasználóknál, ha valaki közzéteszi. Ez azért fontos,
 * mert a hiányosan kitöltött profil félrevezetőbb, mint a semmi.
 */

const PUB_LABEL: Record<string, string> = {
  draft: 'Piszkozat', review: 'Elbírálásra vár', published: 'Közzétéve',
}
const PUB_SAV: Record<string, string> = {
  draft: 'st-none', review: 'st-progress', published: 'st-passed',
}

export function ApnWorldAdmin({
  countries, sources,
}: {
  countries: Country[]
  sources: Source[]
}) {
  const [pending, start] = useTransition()
  const [res, setRes] = useState<Res | null>(null)
  const [szerkeszt, setSzerkeszt] = useState<Country | 'uj' | null>(null)
  const [forrasNyit, setForrasNyit] = useState<string | null>(null)

  if (szerkeszt) {
    const c = szerkeszt === 'uj' ? null : szerkeszt
    return (
      <form
        className="card"
        action={(fd) => start(async () => {
          const r = await saveCountry(c?.id ?? null, fd)
          setRes(r)
          if (r.ok) setSzerkeszt(null)
        })}
      >
        <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
          <div style={{ flex: '0 0 90px' }}>
            <label className="sub lbl-req">Kód</label>
            <input className="field" name="code" required maxLength={2}
              defaultValue={c?.code ?? ''} placeholder="HU" style={{ textTransform: 'uppercase' }} />
          </div>
          <div style={{ flex: '0 0 80px' }}>
            <label className="sub">Zászló</label>
            <input className="field" name="flag" defaultValue={c?.flag ?? ''} placeholder="🇭🇺" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="sub lbl-req">Név</label>
            <input className="field" name="name" required defaultValue={c?.name ?? ''} />
          </div>
        </div>

        <label className="sub">Angol név</label>
        <input className="field" name="name_en" defaultValue={c?.name_en ?? ''} />

        <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
          <Valaszto cim="Régió" nev="region" ertek={c?.region} opciok={REGION_LABEL} />
          <Valaszto cim="Rendszer állapota" nev="status" ertek={c?.status} opciok={STATUS_LABEL} />
        </div>

        <Valaszto cim="Adat megbízhatósága" nev="data_confidence"
          ertek={c?.data_confidence} opciok={CONFIDENCE_LABEL} />
        <p className="sub" style={{ margin: '-8px 0 14px', fontSize: 'var(--t-caption)' }}>
          Ha nincs elegendő megbízható forrás, jelöld hiányosnak — ez őszintébb, mint a feltételezés.
        </p>

        <div className="row" style={{ border: 'none', padding: 0, gap: 10 }}>
          <Valaszto cim="Gyógyszerfelírás" nev="prescribing"
            ertek={c?.prescribing} opciok={PRESCRIBING_LABEL} />
          <Valaszto cim="Önállóság" nev="autonomy" ertek={c?.autonomy} opciok={AUTONOMY_LABEL} />
        </div>

        <label className="sub">Megjegyzés a felírási joghoz</label>
        <textarea className="field" name="prescribing_note" rows={2}
          defaultValue={c?.prescribing_note ?? ''} />

        <label className="sub">Megjegyzés az önállósághoz</label>
        <textarea className="field" name="autonomy_note" rows={2}
          defaultValue={c?.autonomy_note ?? ''} />

        <Valaszto cim="Alapellátási szerep" nev="primary_care"
          ertek={c?.primary_care} opciok={PRIMARY_CARE_LABEL} />

        <label className="sub">Alapellátási területek (soronként egy)</label>
        <textarea className="field" name="primary_care_areas" rows={3}
          defaultValue={c?.primary_care_areas.join('\n') ?? ''} />

        <label className="sub">Kórházi területek (soronként egy)</label>
        <textarea className="field" name="hospital_areas" rows={3}
          defaultValue={c?.hospital_areas.join('\n') ?? ''} />

        <label className="sub">Erősségek (soronként egy)</label>
        <textarea className="field" name="strengths" rows={3}
          defaultValue={c?.strengths.join('\n') ?? ''} />

        <label className="sub">Nehézségek (soronként egy)</label>
        <textarea className="field" name="challenges" rows={3}
          defaultValue={c?.challenges.join('\n') ?? ''} />

        <label className="sub">Leírás</label>
        <textarea className="field" name="description" rows={3} defaultValue={c?.description ?? ''} />

        <label className="sub">Miért tanulságos ez a modell?</label>
        <textarea className="field" name="why_interesting" rows={3}
          defaultValue={c?.why_interesting ?? ''}
          placeholder="Objektív szakmai értelmezés, nem méltatás." />

        <label className="sub">Utolsó ellenőrzés</label>
        <input className="field" name="last_verified" type="date"
          defaultValue={c?.last_verified ?? ''} style={{ maxWidth: 200 }} />

        {res && !res.ok && <div className="form-err" style={{ marginBottom: 10 }}>{res.message}</div>}

        <div className="row" style={{ border: 'none', padding: 0, gap: 8 }}>
          <button className="btn ghost" type="button" style={{ flex: 1 }}
            onClick={() => setSzerkeszt(null)} disabled={pending}>Mégsem</button>
          <button className="btn" type="submit" style={{ flex: 2 }} disabled={pending}>
            {pending ? 'Mentés…' : 'Mentés'}
          </button>
        </div>

        <p className="sub" style={{ margin: '10px 0 0', fontSize: 'var(--t-caption)' }}>
          A hatásköri dimenziók szerkesztése egyelőre adatbázisból történik. Az itt megadott
          adatok a profil többi részét fedik le.
        </p>
      </form>
    )
  }

  return (
    <>
      {res && <div className={res.ok ? 'form-ok' : 'form-err'}>{res.message}</div>}

      <button className="btn" style={{ width: '100%', marginBottom: 12 }}
        onClick={() => setSzerkeszt('uj')}>
        + Új országprofil
      </button>

      {countries.map((c) => {
        const sajat = sources.filter((s) => s.country_id === c.id)
        return (
          <div className="card" key={c.id}>
            <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
              <span style={{ flex: 1 }}>
                <b style={{ fontSize: 'var(--t-h3)' }}>{c.flag} {c.name}</b>
                <span className="sub" style={{ display: 'block', margin: '2px 0 0', fontSize: 'var(--t-caption)' }}>
                  {REGION_LABEL[c.region]} · {CONFIDENCE_LABEL[c.data_confidence]}
                  {c.last_verified && ` · ellenőrizve: ${c.last_verified}`}
                  {` · ${sajat.length} forrás`}
                </span>
              </span>
              <span className={`st ${PUB_SAV[c.publish_status]}`}>{PUB_LABEL[c.publish_status]}</span>
            </div>

            <div className="row" style={{ border: 'none', padding: '10px 0 0', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn ghost sm" onClick={() => setSzerkeszt(c)}>Szerkesztés</button>
              {c.publish_status !== 'published' && (
                <button className="btn sm" disabled={pending}
                  onClick={() => start(async () => setRes(await setCountryStatus(c.id, 'published')))}>
                  Közzététel
                </button>
              )}
              {c.publish_status === 'published' && (
                <button className="btn ghost sm" disabled={pending}
                  onClick={() => start(async () => setRes(await setCountryStatus(c.id, 'draft')))}>
                  Visszavonás
                </button>
              )}
              <button className="btn ghost sm" onClick={() => setForrasNyit(forrasNyit === c.id ? null : c.id)}>
                Források ({sajat.length})
              </button>
              <ConfirmAction
                className="sec-l"
                title="Országprofil törlése"
                message={`A(z) „${c.name}" teljes profilja és a hozzá tartozó ${sajat.length} forrás véglegesen törlődik. Ez nem vonható vissza.`}
                onConfirm={() => deleteCountry(c.id)}
              >
                Törlés
              </ConfirmAction>
            </div>

            {forrasNyit === c.id && (
              <div style={{ marginTop: 12, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                {sajat.map((s) => (
                  <div className="row" key={s.id}>
                    <span>
                      <b style={{ fontSize: 'var(--t-small)' }}>{s.title}</b>
                      <span className="sub" style={{ display: 'block', margin: 0, fontSize: 'var(--t-caption)' }}>
                        {s.org}{s.url && ' · hivatkozással'}
                      </span>
                    </span>
                    <button className="sec-l" disabled={pending}
                      style={{ background: 'none', border: 0, font: 'inherit', fontSize: 'var(--t-small)', color: 'var(--alert)', cursor: 'pointer' }}
                      onClick={() => start(async () => setRes(await deleteSource(s.id)))}>
                      Törlés
                    </button>
                  </div>
                ))}

                <form action={(fd) => start(async () => {
                  setRes(await addSource(c.id, fd))
                })} style={{ marginTop: 10 }}>
                  <input className="field" name="title" placeholder="A forrás címe" required />
                  <div className="row" style={{ border: 'none', padding: 0, gap: 8 }}>
                    <input className="field" name="org" placeholder="Kiadó szervezet" style={{ margin: 0 }} />
                    <input className="field" name="url" placeholder="Hivatkozás" type="url" style={{ margin: 0 }} />
                  </div>
                  <button className="btn ghost sm" type="submit" disabled={pending} style={{ marginTop: 8 }}>
                    Forrás hozzáadása
                  </button>
                </form>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

function Valaszto<T extends string>({
  cim, nev, ertek, opciok,
}: {
  cim: string; nev: string; ertek?: T; opciok: Record<string, string>
}) {
  return (
    <div style={{ flex: 1 }}>
      <label className="sub">{cim}</label>
      <select className="field" name={nev} defaultValue={ertek ?? ''}>
        {Object.entries(opciok).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  )
}
