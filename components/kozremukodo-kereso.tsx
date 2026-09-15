'use client'

import { useState, useTransition } from 'react'
import { searchCandidates } from '@/lib/kozremukodok/actions'
import type { ContributorCandidate } from '@/lib/kozremukodok/types'

/**
 * Közreműködő jelölése a regisztrált felhasználók közül.
 *
 * A találatra kattintva az űrlap kitöltődik a profil adataival, de minden
 * mező szerkeszthető marad: a megjelenített név nem feltétlenül azonos a
 * profilban szereplővel, és az intézmény feltüntetése sem mindenkinek
 * természetes.
 */
export function KozremukodoKereso({
  onValaszt,
}: {
  onValaszt: (c: ContributorCandidate) => void
}) {
  const [q, setQ] = useState('')
  const [talalatok, setTalalatok] = useState<ContributorCandidate[] | null>(null)
  const [fut, start] = useTransition()

  const keres = () =>
    start(async () => {
      setTalalatok(await searchCandidates(q))
    })

  return (
    <div className="kozr-kereso">
      <label className="sub" htmlFor="kozr-keres">
        Jelölés a regisztrált felhasználók közül
      </label>
      <div className="kozr-kereso-sor">
        <input
          className="field" id="kozr-keres" value={q}
          placeholder="Név vagy e-mail-cím"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); keres() } }}
        />
        <button className="btn ghost" type="button" onClick={keres} disabled={fut}>
          {fut ? 'Keresés…' : 'Keresés'}
        </button>
      </div>

      {talalatok !== null && (
        talalatok.length === 0 ? (
          <p className="sub" style={{ margin: '8px 0 0' }}>
            Nincs találat. Aki már szerepel a listán, nem jelenik meg itt.
          </p>
        ) : (
          <div className="lst" style={{ marginTop: 8 }}>
            {talalatok.map((c) => (
              <button
                key={c.user_id} type="button" className="lst-sor"
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 0 }}
                onClick={() => { onValaszt(c); setTalalatok(null); setQ('') }}
              >
                <span className="lst-fo">
                  <b>{c.title ? `${c.title} ${c.full_name ?? ''}` : (c.full_name ?? c.email)}</b>
                  <span>
                    {c.email}
                    {c.workplace && ` · ${c.workplace}`}
                  </span>
                </span>
                <span className="lst-meta">kiválaszt</span>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  )
}
