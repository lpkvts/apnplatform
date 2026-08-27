'use client'

import { useEffect, useState } from 'react'

/**
 * Telepítés felajánlása.
 *
 * A platform telepíthető alkalmazásként is működik: kikerül a kezdőképernyőre,
 * saját ablakban indul, és a korábban megnyitott tartalom hálózat nélkül is
 * elérhető marad.
 *
 * A telepítés módja böngészőnként eltér, ezért három esetet kezelünk:
 *
 *  1. A böngésző felkínálja a telepítést egy eseményen keresztül (Android,
 *     asztali Chrome és Edge) — ilyenkor saját gombhoz kötjük.
 *  2. iPhone és iPad: ott ilyen esemény nincs, a megosztás menüből kell
 *     hozzáadni a kezdőképernyőhöz. Leírjuk a lépéseket.
 *  3. Minden más eset: az esemény nem érkezik meg (például mert a böngésző nem
 *     támogatja, vagy már korábban elutasították). Ilyenkor sem hagyjuk üresen
 *     a felületet, hanem elmondjuk, hol keresse a menüben.
 */

interface InstallEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Mode = 'loading' | 'native' | 'ios' | 'manual' | 'installed'

const HIDE_KEY = 'apnmed-install-hide'

export function InstallPrompt({ variant = 'banner' }: { variant?: 'banner' | 'inline' }) {
  const [mode, setMode] = useState<Mode>('loading')
  const [evt, setEvt] = useState<InstallEvent | null>(null)
  const [barHidden, setBarHidden] = useState(false)
  const [howTo, setHowTo] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true
    if (standalone) { setMode('installed'); return }

    const ua = window.navigator.userAgent
    const isIos = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    if (isIos) { setMode('ios'); return }

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvt(e as InstallEvent)
      setMode('native')
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', () => setMode('installed'))

    // Az esemény a betöltés után rövid késéssel érkezik. Ha nem jön meg,
    // kézi útmutatót adunk — üres felületet nem hagyunk.
    const t = setTimeout(() => setMode((m) => (m === 'loading' ? 'manual' : m)), 2500)

    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); clearTimeout(t) }
  }, [])

  // A lebegő sávnál figyelembe vesszük a korábbi elutasítást is.
  useEffect(() => {
    if (variant !== 'banner') return
    try {
      const until = Number(localStorage.getItem(HIDE_KEY) ?? 0)
      if (until && Date.now() < until) setBarHidden(true)
    } catch { /* a tárolás letiltható; ilyenkor egyszerűen megjelenik */ }
  }, [variant])

  const hide = () => {
    try { localStorage.setItem(HIDE_KEY, String(Date.now() + 30 * 864e5)) } catch { /* nem baj */ }
    setBarHidden(true)
  }

  const install = async () => {
    // Ha az esemény időközben érvénytelenné vált — egyes böngészők eldobják, ha
    // sok idő telt el a megjelenése óta —, ne maradjon néma a gomb: ilyenkor a
    // kézi útmutatóra váltunk, hogy a telepítés így is elvégezhető legyen.
    if (!evt) { setMode('manual'); setHowTo(true); return }
    try {
      await evt.prompt()
      const { outcome } = await evt.userChoice
      if (outcome === 'accepted') setMode('installed')
      else hide()
      setEvt(null)
    } catch {
      setEvt(null)
      setMode('manual')
      setHowTo(true)
    }
  }

  if (mode === 'installed' || mode === 'loading') return null

  const iosSteps = (
    <ol className="inst-steps">
      <li>Koppints a böngésző alján a <b>Megosztás</b> ikonra.</li>
      <li>Görgess le a <b>Hozzáadás a kezdőképernyőhöz</b> lehetőségig.</li>
      <li>Erősítsd meg a <b>Hozzáadás</b> gombbal.</li>
    </ol>
  )

  const manualSteps = (
    <ol className="inst-steps">
      <li>Nyisd meg a böngésző menüjét (a három pont vagy a címsor ikonja).</li>
      <li>Válaszd az <b>Alkalmazás telepítése</b> vagy <b>Hozzáadás a kezdőképernyőhöz</b> pontot.</li>
      <li>Erősítsd meg a telepítést.</li>
    </ol>
  )

  /* ── Beépített változat: teljes szakasz a nyitóoldalon ── */
  if (variant === 'inline') {
    return (
      <section className="lp-sec" id="telepites">
        <div className="lp-wrap">
          <p className="lp-eyebrow c">Vidd magaddal</p>
          <div className="inst-card">
            <span className="inst-ic" aria-hidden="true">📲</span>
            <div className="inst-body">
              <b>Tedd ki a telefonodra</b>
              <p>
                Telepítve saját ablakban indul, gyorsabban nyílik, és a korábban megnyitott
                tartalom hálózat nélkül is elérhető marad.
              </p>

              {mode === 'native' && (
                <button className="lp-btn lp-btn-primary" onClick={install}>
                  Telepítés <span className="lp-arw">→</span>
                </button>
              )}

              {mode === 'ios' && (
                howTo ? iosSteps : (
                  <button className="lp-btn lp-btn-primary" onClick={() => setHowTo(true)}>
                    Hogyan telepítsem? <span className="lp-arw">→</span>
                  </button>
                )
              )}

              {mode === 'manual' && (
                howTo ? manualSteps : (
                  <button className="lp-btn lp-btn-primary" onClick={() => setHowTo(true)}>
                    Hogyan telepítsem? <span className="lp-arw">→</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── Lebegő sáv a bejelentkezett felületen ── */
  if (barHidden) return null

  return (
    <div className="inst-bar" role="dialog" aria-label="Alkalmazás telepítése">
      <span className="inst-ic" aria-hidden="true">📲</span>
      <div className="inst-bar-txt">
        <b>APN-MED telepítése</b>
        <span>{mode === 'native' ? 'Gyorsabb indulás, offline elérés' : 'Add hozzá a kezdőképernyődhöz'}</span>
        {howTo && (mode === 'ios' ? iosSteps : manualSteps)}
      </div>
      {mode === 'native'
        ? <button className="btn sm" onClick={install}>Telepítés</button>
        : !howTo && <button className="btn sm" onClick={() => setHowTo(true)}>Hogyan?</button>}
      <button className="inst-x" onClick={hide} aria-label="Bezárás">✕</button>
    </div>
  )
}
