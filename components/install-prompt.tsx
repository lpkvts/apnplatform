'use client'

import { useEffect, useState } from 'react'

/**
 * Telepítés felajánlása.
 *
 * A platform telepíthető alkalmazásként is működik: kikerül a kezdőképernyőre,
 * saját ablakban indul, és a korábban megnyitott tartalom hálózat nélkül is
 * elérhető marad.
 *
 * Két úton lehet telepíteni, és a kettő eltér:
 *
 *  - Androidon és asztali Chrome-ban a böngésző felkínálja a telepítést egy
 *    eseményen keresztül, amit elkapunk és saját gombhoz kötünk.
 *  - iPhone-on és iPaden ilyen esemény nincs; ott a felhasználónak a megosztás
 *    menüből kell hozzáadnia a kezdőképernyőhöz. Ezért ott lépésről lépésre
 *    leírjuk, mit tegyen.
 */

interface InstallEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const HIDE_KEY = 'apnmed-install-hide'

export function InstallPrompt({ variant = 'banner' }: { variant?: 'banner' | 'inline' }) {
  const [evt, setEvt] = useState<InstallEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [show, setShow] = useState(false)
  const [howTo, setHowTo] = useState(false)

  useEffect(() => {
    // Már telepítve fut? Akkor nincs mit felajánlani.
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true
    if (standalone) return

    // Korábban elutasította — egy hónapig nem kérdezünk újra.
    try {
      const until = Number(localStorage.getItem(HIDE_KEY) ?? 0)
      if (until && Date.now() < until) return
    } catch { /* a tárolás letiltható; ilyenkor egyszerűen megjelenik */ }

    const ua = window.navigator.userAgent
    const isIos = /iPad|iPhone|iPod/.test(ua) ||
      // iPadOS 13 óta asztali böngészőnek adja ki magát
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)

    if (isIos) {
      // Csak Safariból lehet a kezdőképernyőre tenni.
      if (isSafari) { setIos(true); setShow(true) }
      return
    }

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setEvt(e as InstallEvent)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', () => setShow(false))
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const hide = (months = 1) => {
    try { localStorage.setItem(HIDE_KEY, String(Date.now() + months * 30 * 864e5)) } catch { /* nem baj */ }
    setShow(false)
  }

  const install = async () => {
    if (!evt) return
    await evt.prompt()
    const { outcome } = await evt.userChoice
    if (outcome === 'accepted') setShow(false)
    else hide()
    setEvt(null)
  }

  if (!show) return null

  const steps = (
    <ol className="inst-steps">
      <li>Koppints a böngésző alján a <b>Megosztás</b> ikonra.</li>
      <li>Görgess le a <b>Hozzáadás a kezdőképernyőhöz</b> lehetőségig.</li>
      <li>Erősítsd meg a <b>Hozzáadás</b> gombbal.</li>
    </ol>
  )

  /* ── Beépített változat: a nyitóoldal egy szakaszaként ── */
  if (variant === 'inline') {
    return (
      <div className="inst-card">
        <span className="inst-ic" aria-hidden="true">📲</span>
        <div className="inst-body">
          <b>Tedd ki a telefonodra</b>
          <p>
            Telepítve saját ablakban indul, gyorsabban nyílik, és a korábban megnyitott
            tartalom hálózat nélkül is elérhető marad.
          </p>
          {ios ? (
            <>
              {howTo ? steps : (
                <button className="lp-btn lp-btn-primary" onClick={() => setHowTo(true)}>
                  Hogyan telepítsem? <span className="lp-arw">→</span>
                </button>
              )}
            </>
          ) : (
            <button className="lp-btn lp-btn-primary" onClick={install}>
              Telepítés <span className="lp-arw">→</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ── Lebegő sáv: a képernyő alján ── */
  return (
    <div className="inst-bar" role="dialog" aria-label="Alkalmazás telepítése">
      <span className="inst-ic" aria-hidden="true">📲</span>
      <div className="inst-bar-txt">
        <b>APN-MED telepítése</b>
        <span>{ios ? 'Add hozzá a kezdőképernyődhöz' : 'Gyorsabb indulás, offline elérés'}</span>
        {ios && howTo && steps}
      </div>
      {ios ? (
        !howTo && <button className="btn sm" onClick={() => setHowTo(true)}>Hogyan?</button>
      ) : (
        <button className="btn sm" onClick={install}>Telepítés</button>
      )}
      <button className="inst-x" onClick={() => hide()} aria-label="Bezárás">✕</button>
    </div>
  )
}
