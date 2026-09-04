'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const KULCS = 'apnmed-beta-lathato'

/**
 * Béta tájékoztató sáv.
 *
 * A platform tesztelés alatt áll, és ezt jobb kimondani, mint elhallgatni:
 * aki tudja, hogy béta, másképp értékeli a hibát, és szívesebben jelzi.
 *
 * A sáv bezárható, és a döntés a készüléken marad — nem tér vissza minden
 * oldalbetöltésnél. Ez a lényeg: a tájékoztatás egyszeri, nem zaklatás.
 */
export function BetaBanner() {
  const [lathato, setLathato] = useState(false)

  useEffect(() => {
    setLathato(localStorage.getItem(KULCS) !== 'nem')
  }, [])

  if (!lathato) return null

  return (
    <div className="beta-sav" role="status">
      <span className="beta-jel">Béta</span>
      <p>
        A platform fejlesztés és tesztelés alatt áll. Minél több APN használja,
        annál gyorsabban derülnek ki a hibák — <Link href="/kapcsolat?tema=hiba">jelezd,
        ha valami nem stimmel</Link>.
      </p>
      <button
        onClick={() => { localStorage.setItem(KULCS, 'nem'); setLathato(false) }}
        aria-label="Tájékoztató bezárása"
      >
        ✕
      </button>
    </div>
  )
}
