'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EcgViewer } from '@/components/ecg-viewer'
import { paramsFor, ECG_FOCUS } from '@/lib/ekg/params'
import type { Lead } from '@/lib/ekg/render'

/**
 * EKG-előnézet a klinikai tartalmakon belül.
 *
 * A betegségtárban és az akut témáknál eddig csak hivatkozás mutatott az
 * EKG-atlaszra. Aki felismerést tanul, annak viszont a görbét kell látnia —
 * a kórkép neve önmagában nem tanít meg felismerni semmit.
 *
 * A „Hol nézzem?" gomb a kiemelést kapcsolja, nem a görbét. Ez tanítási
 * szempontból hasznosabb: előbb magad keresed meg az eltérést, aztán
 * ellenőrzöd, jó helyen kerested-e. Ha a kiemelés alapból látszana, a
 * felismerés gyakorlása maradna el.
 */
export function EkgElonezet({
  id, name, sub,
}: {
  /** Az EKG-atlasz tételének azonosítója. */
  id: string
  name: string
  sub?: string
}) {
  const [kiemel, setKiemel] = useState(false)
  const params = paramsFor(id)

  // Ha az adott tételhez nincs görbeparaméter, marad a hivatkozás az
  // atlaszra. Üres keretet nem jelenítünk meg.
  if (!params) {
    return (
      <Link className="btn ghost sm" href={`/klinika/ekg?open=${id}`}>
        {name} →
      </Link>
    )
  }

  const focus = (ECG_FOCUS as Record<string, string[]>)[id] as Lead[] | undefined

  return (
    <div className="ekg-elo">
      <div className="ekg-elo-fej">
        <span className="lst-fo">
          <b>{name}</b>
          {sub && <span>{sub}</span>}
        </span>
        {focus?.length ? (
          <button className="btn ghost sm" onClick={() => setKiemel(!kiemel)}>
            {kiemel ? 'Kiemelés elrejtése' : 'Hol nézzem?'}
          </button>
        ) : null}
      </div>

      <div className="ekg-elo-abra">
        <EcgViewer
          params={params}
          highlight="none"
          highlightLeads={kiemel ? focus : undefined}
          caption={kiemel && focus?.length ? `Kiemelve: ${focus.join(', ')}` : undefined}
        />
      </div>

      <div className="ekg-elo-lab">
        <Link className="sec-l" href={`/klinika/ekg?open=${id}`}>
          Megnyitás az atlaszban →
        </Link>
      </div>
    </div>
  )
}
