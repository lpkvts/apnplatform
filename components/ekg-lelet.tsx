'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

/**
 * EKG-lelet fotójának átnézése — béta.
 *
 * A feltöltés előtt két dolgot tudatosítunk: a betegazonosítót ki kell
 * takarni, és az eredmény nem lelet. Ezt nem apró betűs megjegyzésként,
 * hanem megerősítendő lépésként, mert a felhasználó a gyakorlatban
 * átfutja a figyelmeztetéseket.
 */

const SZAKASZOK = [
  'KÉPMINŐSÉG', 'MIT LÁTOK', 'AMI FIGYELMET ÉRDEMEL',
  'MILYEN IRÁNYBA VEZET', 'MI HIÁNYZIK A MEGÍTÉLÉSHEZ', 'SÜRGŐSSÉG',
]

/** A válasz felbontása a címkék mentén — így olvashatóbb, mint egy tömb szöveg. */
function bont(szoveg: string) {
  const reszek: { cim: string; tartalom: string }[] = []
  let maradek = szoveg
  for (let i = 0; i < SZAKASZOK.length; i++) {
    const cim = SZAKASZOK[i]
    const kezd = maradek.indexOf(cim + ':')
    if (kezd === -1) continue
    const kovetkezo = SZAKASZOK.slice(i + 1)
      .map((c) => maradek.indexOf(c + ':', kezd + 1))
      .filter((x) => x > -1)
    const veg = kovetkezo.length ? Math.min(...kovetkezo) : maradek.length
    reszek.push({
      cim,
      tartalom: maradek.slice(kezd + cim.length + 1, veg).trim(),
    })
  }
  // Ami a címkék után maradt — jellemzően a záró megjegyzés.
  const utolso = reszek.length
    ? szoveg.slice(szoveg.lastIndexOf(reszek[reszek.length - 1].tartalom) + reszek[reszek.length - 1].tartalom.length).trim()
    : ''
  return { reszek, zaro: utolso }
}

export function EkgLelet() {
  const [elfogadva, setElfogadva] = useState(false)
  const [kep, setKep] = useState<string | null>(null)
  const [fut, setFut] = useState(false)
  const [eredmeny, setEredmeny] = useState<string | null>(null)
  const [hiba, setHiba] = useState<string | null>(null)
  const fajlRef = useRef<HTMLInputElement>(null)

  const elemez = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setFut(true); setHiba(null); setEredmeny(null)
    try {
      const r = await fetch('/api/ekg-lelet', { method: 'POST', body: fd })
      const d = await r.json()
      if (!r.ok) setHiba(d.error ?? 'Az átnézés nem sikerült.')
      else setEredmeny(d.text)
    } catch {
      setHiba('Az átnézés nem sikerült. Ellenőrizd a kapcsolatot.')
    } finally {
      setFut(false)
    }
  }

  /* ── Első lépés: a korlátok tudomásulvétele ── */
  if (!elfogadva) {
    return (
      <>
        <div className="card" style={{ borderLeft: '4px solid var(--warn)' }}>
          <b style={{ fontSize: 'var(--t-h3)' }}>Mielőtt feltöltesz egy leletet</b>

          <p style={{ margin: '10px 0 0', fontSize: 'var(--t-body)', lineHeight: 1.65 }}>
            <b>Takard ki a beteg adatait.</b> Az EKG-leleten jellemzően szerepel a név,
            a születési dátum és az azonosító. Ezeket a fotózás előtt takard le, vagy
            vágd le a képet úgy, hogy csak a görbe látszódjon.
          </p>

          <p style={{ margin: '10px 0 0', fontSize: 'var(--t-body)', lineHeight: 1.65 }}>
            <b>Az eredmény nem lelet.</b> Az átnézés megfigyeléseket sorol és kérdéseket
            vet fel — nem állít fel diagnózist, és nem helyettesíti az EKG szakorvosi
            értékelését. A fotóból készült átnézés ráadásul technikailag is korlátozott:
            az elmosódás, a ferde szög és a hiányzó kalibráció mind torzít.
          </p>

          <p style={{ margin: '10px 0 0', fontSize: 'var(--t-body)', lineHeight: 1.65 }}>
            <b>Sürgős állapotban ne ezzel kezdd.</b> Ha a beteg állapota azonnali
            beavatkozást kíván, az orvos értesítése az első lépés.
          </p>

          <div className="row" style={{ border: 'none', padding: '16px 0 0', gap: 8 }}>
            <Link className="btn ghost" href="/klinika/ekg" style={{ flex: 1 }}>Mégsem</Link>
            <button className="btn" style={{ flex: 2 }} onClick={() => setElfogadva(true)}>
              Megértettem, folytatom
            </button>
          </div>
        </div>

        <div className="safety-note">
          <b>ⓘ Béta funkció.</b> Fejlesztés alatt áll, és a működése változhat. Ha
          pontatlanságot tapasztalsz, jelezd a Kapcsolat oldalon — ez segít a
          továbbfejlesztésben.
        </div>
      </>
    )
  }

  /* ── Eredmény ── */
  if (eredmeny) {
    const { reszek, zaro } = bont(eredmeny)
    return (
      <>
        <div className="safety-note" style={{ borderLeft: '4px solid var(--warn)' }}>
          <b>ⓘ Ez nem lelet és nem diagnózis.</b> Megfigyelések és kérdések, amelyeket
          a klinikai képpel együtt kell értelmezni. A döntés a szakorvosi értékelésen múlik.
        </div>

        {kep && (
          <div className="card" style={{ padding: 8 }}>
            {/* A feltöltött kép a válasz mellett marad, hogy a megállapítások
                ellenőrizhetők legyenek az eredetin. */}
            <img src={kep} alt="A feltöltött EKG-lelet" className="ekg-lelet-kep" />
          </div>
        )}

        {reszek.length > 0 ? reszek.map((r) => (
          <div className={`card ${r.cim === 'SÜRGŐSSÉG' ? 'vg-find warn' : ''}`} key={r.cim}>
            <b style={{ fontSize: 'var(--t-caption)', letterSpacing: '.06em', color: 'var(--muted)' }}>
              {r.cim}
            </b>
            <p style={{ margin: '6px 0 0', fontSize: 'var(--t-body)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
              {r.tartalom}
            </p>
          </div>
        )) : (
          <div className="card">
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>{eredmeny}</p>
          </div>
        )}

        {zaro && <p className="sub" style={{ fontSize: 'var(--t-caption)' }}>{zaro}</p>}

        <div className="row" style={{ border: 'none', gap: 8, marginTop: 12 }}>
          <button className="btn ghost" style={{ flex: 1 }}
            onClick={() => { setEredmeny(null); setKep(null) }}>
            Másik lelet
          </button>
          <Link className="btn ghost" href="/klinika/ekg" style={{ flex: 1 }}>
            EKG-atlasz
          </Link>
        </div>
      </>
    )
  }

  /* ── Feltöltés ── */
  return (
    <form className="card" onSubmit={elemez}>
      <label className="sub lbl-req" htmlFor="ekg-kep">A lelet fotója</label>
      <input
        className="field" id="ekg-kep" name="image" type="file" required ref={fajlRef}
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const f = e.target.files?.[0]
          setKep(f ? URL.createObjectURL(f) : null)
        }}
      />
      <p className="sub" style={{ margin: '-8px 0 14px', fontSize: 'var(--t-caption)' }}>
        JPEG, PNG vagy WEBP, legfeljebb 8 MB. A kép nem kerül tárolásra.
        Ügyelj rá, hogy a betegazonosító ne látszódjon.
      </p>

      {kep && (
        <div style={{ marginBottom: 14 }}>
          <img src={kep} alt="Előnézet" className="ekg-lelet-kep" />
        </div>
      )}

      <label className="sub" htmlFor="ekg-kontext">Klinikai összefüggés</label>
      <textarea className="field" id="ekg-kontext" name="context" rows={2}
        placeholder="Életkor, panasz, mióta tart, vitális paraméterek — betegazonosító nélkül" />
      <p className="sub" style={{ margin: '-8px 0 14px', fontSize: 'var(--t-caption)' }}>
        Nem kötelező, de sokat segít: a görbe önmagában kevesebbet mond.
      </p>

      {hiba && <div className="form-err" style={{ marginBottom: 10 }}>{hiba}</div>}

      <button className="btn" type="submit" disabled={fut || !kep} style={{ width: '100%' }}>
        {fut ? (<><span className="spin" aria-hidden="true" />Átnézés…</>) : 'Átnézés indítása'}
      </button>
    </form>
  )
}
