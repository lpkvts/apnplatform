'use client'

import { useState, useTransition } from 'react'
import { ConfirmAction } from '@/components/confirm-action'
import { saveContributor, deleteContributor } from '@/lib/kozremukodok/actions'
import { KozremukodoKereso } from '@/components/kozremukodo-kereso'
import { ROLE_LABEL, ROLE_ORDER, teljesNev, type Contributor, type ContributorCandidate } from '@/lib/kozremukodok/types'

/**
 * Közreműködők kezelése.
 *
 * A szerkesztés helyben, a listában nyílik meg: így látszik a szövegkörnyezet,
 * és nem kell külön oldalra navigálni egy néhány mezős űrlapért.
 */
export function KozremukodoAdmin({ lista }: { lista: Contributor[] }) {
  const [szerkesztett, setSzerkesztett] = useState<string | null>(null)
  const [ujNyitva, setUjNyitva] = useState(false)
  const [hiba, setHiba] = useState<string | null>(null)
  const [fut, start] = useTransition()

  const ment = (fd: FormData) =>
    start(async () => {
      setHiba(null)
      const r = await saveContributor(fd)
      if (r.ok) { setSzerkesztett(null); setUjNyitva(false) }
      else setHiba(r.hiba ?? 'A mentés nem sikerült.')
    })

  return (
    <>
      <div className="safety-note" style={{ marginBottom: 16 }}>
        <b>ⓘ A nevek személyes adatok.</b> A felvétel a közreműködő
        hozzájárulásával történik — a platformon való regisztráció önmagában
        nem az. Érdemes egyeztetni azt is, hogy a nevén kívül mi jelenjen meg:
        az intézmény és a titulus feltüntetése nem mindenkinek természetes.
      </div>

      {!ujNyitva && (
        <button className="btn" onClick={() => { setUjNyitva(true); setSzerkesztett(null) }}>
          Új közreműködő
        </button>
      )}

      {ujNyitva && (
        <Urlap
          onSubmit={ment} onCancel={() => setUjNyitva(false)}
          fut={fut} hiba={hiba}
        />
      )}

      <div className="sec-h" style={{ marginTop: 18 }}>
        <span className="sec-t">{lista.length} közreműködő</span>
      </div>

      {lista.length === 0 ? (
        <p className="sub">Még nincs felvett közreműködő.</p>
      ) : (
        <div className="lst">
          {lista.map((c) => (
            <div key={c.id}>
              <div className="lst-sor" style={{ cursor: 'default' }}>
                <span className="lst-fo">
                  <b>{teljesNev(c)}</b>
                  <span>
                    {c.roles.map((r) => ROLE_LABEL[r]).join(', ') || 'nincs szerep'}
                    {c.organization && ` · ${c.organization}`}
                  </span>
                </span>
                <span className="lst-veg">
                  {c.featured && <span className="st st-progress">Kiemelt</span>}
                  <span className={c.publish_status === 'published' ? 'st st-done' : 'st st-none'}>
                    {c.publish_status === 'published' ? 'Közzétéve' : 'Piszkozat'}
                  </span>
                  <button className="btn ghost sm"
                    onClick={() => { setSzerkesztett(szerkesztett === c.id ? null : c.id); setUjNyitva(false) }}>
                    {szerkesztett === c.id ? 'Mégsem' : 'Szerkesztés'}
                  </button>
                  <ConfirmAction
                    className="icon-btn-sm"
                    ariaLabel={`${c.name} törlése`}
                    title="Közreműködő törlése"
                    message={`${teljesNev(c)} törlődik a listából. Ez nem vonható vissza.`}
                    onConfirm={async () => {
                      const r = await deleteContributor(c.id)
                      if (!r.ok) setHiba(r.hiba ?? 'A törlés nem sikerült.')
                    }}
                  >
                    ✕
                  </ConfirmAction>
                </span>
              </div>
              {szerkesztett === c.id && (
                <Urlap
                  c={c} onSubmit={ment} onCancel={() => setSzerkesztett(null)}
                  fut={fut} hiba={hiba}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function Urlap({
  c, onSubmit, onCancel, fut, hiba,
}: {
  c?: Contributor
  onSubmit: (fd: FormData) => void
  onCancel: () => void
  fut: boolean
  hiba: string | null
}) {
  // A kiválasztott felhasználó adatai előtöltik a mezőket, de minden
  // szerkeszthető marad: a megjelenített név nem feltétlenül azonos a
  // profilban szereplővel.
  const [valasztott, setValasztott] = useState<ContributorCandidate | null>(null)
  const ertek = (mezo: 'name' | 'title' | 'organization' | 'specialties') => {
    if (valasztott) {
      if (mezo === 'name') return valasztott.full_name ?? ''
      if (mezo === 'title') return valasztott.title ?? ''
      if (mezo === 'organization') return valasztott.workplace ?? ''
      if (mezo === 'specialties') return valasztott.specialty ?? ''
    }
    if (!c) return ''
    if (mezo === 'specialties') return c.specialties.join(', ')
    return (c[mezo] ?? '') as string
  }

  return (
    <form
      className="card" style={{ marginTop: 10 }}
      action={(fd) => onSubmit(fd)}
      key={valasztott?.user_id ?? c?.id ?? 'uj'}
    >
      {c && <input type="hidden" name="id" value={c.id} />}
      <input type="hidden" name="user_id"
        value={valasztott?.user_id ?? c?.user_id ?? ''} />

      {/* Új felvételnél felkínáljuk a regisztrált felhasználók közüli
          jelölést — így nem kell begépelni a nevet és az intézményt. */}
      {!c && (
        <>
          <KozremukodoKereso onValaszt={setValasztott} />
          {valasztott && (
            <p className="urlap-kesz" role="status">
              {valasztott.full_name ?? valasztott.email} adatai betöltve — a mezők
              szerkeszthetők.
            </p>
          )}
          <div className="sec-h" style={{ marginTop: 14 }}>
            <span className="sec-t">Adatok</span>
          </div>
        </>
      )}

      <div className="kozr-urlap">
        <div>
          <label className="sub lbl-req" htmlFor="kozr-nev">Név</label>
          <input className="field" id="kozr-nev" name="name" required
            defaultValue={ertek('name')} placeholder="Kovács Anna" />
        </div>
        <div>
          <label className="sub" htmlFor="kozr-titulus">Titulus</label>
          <input className="field" id="kozr-titulus" name="title"
            defaultValue={ertek('title')} placeholder="dr., APN, szakápoló" />
        </div>
      </div>

      <label className="sub" htmlFor="kozr-hely">Intézmény</label>
      <input className="field" id="kozr-hely" name="organization"
        defaultValue={ertek('organization')} />

      <label className="sub" style={{ marginTop: 10 }}>Szerepek</label>
      <div className="kozr-szerepek">
        {ROLE_ORDER.map((r) => (
          <label className="kozr-jelolo" key={r}>
            <input type="checkbox" name="roles" value={r}
              defaultChecked={c?.roles.includes(r)} />
            <span>{ROLE_LABEL[r]}</span>
          </label>
        ))}
      </div>

      <label className="sub" htmlFor="kozr-terulet">
        Szakterületek — vesszővel elválasztva
      </label>
      <input className="field" id="kozr-terulet" name="specialties"
        defaultValue={ertek('specialties')}
        placeholder="Nefrológia, Sebellátás" />

      <label className="sub" htmlFor="kozr-jegyzet">Miben segített</label>
      <input className="field" id="kozr-jegyzet" name="note"
        defaultValue={c?.note ?? ''}
        placeholder="Egy mondat — ez jelenik meg a neve alatt." />

      <div className="kozr-urlap" style={{ marginTop: 10 }}>
        <div>
          <label className="sub" htmlFor="kozr-sorrend">Sorrend</label>
          <input className="field" id="kozr-sorrend" name="ord" type="number"
            defaultValue={c?.ord ?? 100} />
        </div>
        <div>
          <label className="sub" htmlFor="kozr-allapot">Állapot</label>
          <select className="field" id="kozr-allapot" name="publish_status"
            defaultValue={c?.publish_status ?? 'draft'}>
            <option value="draft">Piszkozat</option>
            <option value="published">Közzétéve</option>
          </select>
        </div>
      </div>

      <label className="kozr-jelolo" style={{ marginTop: 10 }}>
        <input type="checkbox" name="featured" defaultChecked={c?.featured} />
        <span>Kiemelt — a lista elején, külön szakaszban jelenik meg</span>
      </label>

      {hiba && <p className="urlap-hiba" role="alert">{hiba}</p>}

      <div className="row" style={{ border: 'none', padding: '12px 0 0', gap: 8 }}>
        <button className="btn" type="submit" disabled={fut}>
          {fut ? 'Mentés…' : 'Mentés'}
        </button>
        <button className="btn ghost" type="button" onClick={onCancel}>
          Mégsem
        </button>
      </div>
    </form>
  )
}
