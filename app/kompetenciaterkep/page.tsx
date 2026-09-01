import Link from 'next/link'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { KompetenciaTerkep } from '@/components/kompetencia-terkep'
import { COMPETENCIES, LEVELS, SOURCE, countByLevel } from '@/lib/kompetencia/data'

export const metadata = {
  title: 'APN Kompetenciatérkép — APN-MED',
  description:
    'Mit végezhet önállóan a kiterjesztett hatáskörű ápoló, mihez kell szakorvosi szupervízió, '
    + 'orvosi indikáció vagy személyes orvosi irányítás? A 13/2025. (IV. 17.) BM rendelet alapján.',
}

export default async function KompetenciaterkepPage() {
  if (!(await getFlag('kompetenciaterkep', false))) {
    return <FeatureOff title="APN Kompetenciatérkép" />
  }

  const counts = countByLevel()

  return (
    <>
      {/* ── Bevezető ── */}
      <h1 className="h1">APN Kompetenciatérkép</h1>
      <p className="sub" style={{ fontSize: 15 }}>
        Mit csinálhat egy kiterjesztett hatáskörű ápoló? Fedezd fel a kompetenciákat az
        önálló munkavégzéstől az orvosi együttműködés különböző szintjeiig.
      </p>

      <div className="kt-hero">
        <div className="kt-hero-num">{COMPETENCIES.length}</div>
        <div>
          <b>tevékenység négy kompetenciaszinten</b>
          <span>
            {LEVELS.map((l) => `${counts[l.level]} × ${l.short.toLowerCase()}`).join(' · ')}
          </span>
        </div>
      </div>

      <KompetenciaTerkep />

      {/* ── Jogi tájékoztatás ── */}
      <div className="sec-h"><span className="sec-t">Forrás és értelmezés</span></div>
      <div className="card">
        <b style={{ fontSize: 14 }}>{SOURCE.id}</b>
        <div className="sub" style={{ marginTop: 4 }}>
          {SOURCE.title} · Hatályos: {SOURCE.inForce}
        </div>
        <div className="sub" style={{ marginTop: 6, fontSize: 12 }}>
          A tételek a 2. melléklet „{SOURCE.column}" oszlopából származnak.
        </div>
        <a className="btn ghost sm" href={SOURCE.url} target="_blank" rel="noopener" style={{ marginTop: 10 }}>
          Jogszabály megnyitása
        </a>
      </div>

      <div className="safety-note" style={{ marginTop: 10 }}>
        <b>ⓘ Edukációs összefoglaló.</b> Az APN kompetenciái a hatályos jogszabályok, a szakmai
        szabályozás, az adott szakterület és az intézményi működési rend alapján értelmezendők.
        Ez a tartalom nem helyettesíti a hatályos jogszabályok és szakmai dokumentumok ismeretét,
        és nem pótolja a munkaköri leírást.
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <b style={{ fontSize: 14 }}>Amit a rendelet nem tartalmaz</b>
        <p className="sub" style={{ margin: '6px 0 0' }}>
          A keretrendszer egységes, nem bontja szakterületre a kompetenciákat. A sürgősségi,
          intenzív, geriátriai, közösségi és perioperatív APN-re vonatkozó részletes
          kompetencialisták kidolgozása a rendelet megjelenésekor még folyamatban volt.
          A „Specializációjának megfelelően…" kezdetű tételek jelzik, hol függ a tevékenység
          a szakiránytól.
        </p>
      </div>

      <Link className="btn ghost" href="/kompetenciak" style={{ width: '100%', marginTop: 12 }}>
        Saját kompetenciáim megtekintése
      </Link>
    </>
  )
}
