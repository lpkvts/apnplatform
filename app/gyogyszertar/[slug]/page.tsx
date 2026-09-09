import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getSubstance, getAntibiotics, getGroups } from '@/lib/gyogyszer/data'
import { Morzsa } from '@/components/morzsa'

export const dynamic = 'force-dynamic'

/**
 * Egy hatóanyag adatlapja.
 *
 * A szakaszok sorrendje a klinikai gondolkodást követi: mi ez, mire való,
 * mire figyeljek, mit ronthatok el. A buktatók szakasz azért került a
 * végére kiemelten, mert azt érdemes utoljára elolvasni — az marad meg.
 */
export default async function HatoanyagPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await getFlag('gyogyszertar', false))) return <FeatureOff title="Gyógyszertár" />

  const { slug } = await params
  const s = await getSubstance(slug)
  if (!s) notFound()

  const [antibiotics, groups] = await Promise.all([getAntibiotics(), getGroups()])
  const ab = antibiotics[s.id]
  const csoport = groups.find((g) => g.id === s.group_id)
  const focsoport = csoport?.parent_id
    ? groups.find((g) => g.id === csoport.parent_id)
    : null

  // A csoportokra a modul főoldalán belüli horgonnyal mutatunk: a felület
  // ott nyitja meg a megfelelő csoportot.
  const morzsa = [
    { label: 'Tudástár', href: '/tudastar' },
    { label: 'Gyógyszertár', href: '/gyogyszertar' },
    ...(focsoport ? [{ label: focsoport.name, href: `/gyogyszertar?csoport=${focsoport.slug}` }] : []),
    ...(csoport ? [{ label: csoport.name, href: `/gyogyszertar?csoport=${csoport.slug}` }] : []),
    { label: s.name },
  ]

  return (
    <>
      <Morzsa elemek={morzsa} />

      <h1 className="h1">{s.name}</h1>
      <p className="sub">
        {s.name_intl && `${s.name_intl} · `}{s.atc}
        {csoport && ` · ${csoport.name}`}
      </p>

      {ab && (
        <div className="row" style={{ border: 'none', padding: '4px 0 0', gap: 8 }}>
          <span className="st st-progress">Antibiotikum</span>
          {ab.action && <span className="st st-none">{ab.action}</span>}
        </div>
      )}

      {s.mechanism && (
        <section className="adat-szakasz" style={{ marginTop: 14 }}>
          <h2 className="adat-cim">Hogyan hat</h2>
          <p>{s.mechanism}</p>
        </section>
      )}

      {/* ── Antibiotikum-specifikus: a hatásspektrum ── */}
      {ab && (
        <>
          <section className="adat-szakasz">
            <h2 className="adat-cim">Mire hat</h2>
            <div className="mp-tags" style={{ marginTop: 0 }}>
              {ab.spectrum.map((x) => <span className="mp-tag" key={x}>{x}</span>)}
            </div>
          </section>

          {ab.spectrum_gaps.length > 0 && (
            <>
              <section className="adat-szakasz figyelem">
                <h2 className="adat-cim">Mire nem hat</h2>
                <p className="sub" style={{ margin: '0 0 8px' }}>
                  Ezeket gyakran tévesen feltételezik a hatáskörébe tartozónak.
                </p>
                <div className="mp-tags" style={{ marginTop: 0 }}>
                  {ab.spectrum_gaps.map((x) => <span className="mp-tag plain" key={x}>{x}</span>)}
                </div>
              </section>
            </>
          )}
        </>
      )}

      <Lista cim="Javallatok" elemek={s.indications} />
      <Lista cim="Ellenjavallatok" elemek={s.contraindications} jelzes="veszely" />

      {s.apn_focus.length > 0 && (
        <>
          <section className="adat-szakasz apn">
            <h2 className="adat-cim">APN-fókusz</h2>
            <div className="adat-lista">
              {s.apn_focus.map((x) => <div className="adat-tetel" key={x}>{x}</div>)}
            </div>
          </section>
        </>
      )}

      <Lista cim="Mellékhatások" elemek={s.adverse} />
      <Lista cim="Kölcsönhatások" elemek={s.interactions} />
      <Lista cim="Amit követni kell" elemek={s.monitoring} />

      {(s.organ_note || s.pregnancy) && (
        <>
          <div className="sec-h"><span className="sec-t">Szervfunkció és terhesség</span></div>
          <div className="card">
            {s.organ_note && (
              <p style={{ margin: 0, fontSize: 'var(--t-body)', lineHeight: 1.6 }}>
                <b>Vese és máj.</b> {s.organ_note}
              </p>
            )}
            {s.pregnancy && (
              <p style={{ margin: s.organ_note ? '10px 0 0' : 0, fontSize: 'var(--t-body)', lineHeight: 1.6 }}>
                <b>Terhesség és szoptatás.</b> {s.pregnancy}
              </p>
            )}
          </div>
        </>
      )}

      {/* ── Antibiotikum-gazdálkodás ── */}
      {ab && ab.stewardship.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Mikor ne ezt válasszuk</span></div>
          <div className="card">
            <ul className="aw-ul">
              {ab.stewardship.map((x) => <li key={x}>{x}</li>)}
            </ul>
            {ab.narrower_option && (
              <p className="nk-tanulsag">
                <b>Szűkebb spektrumú lehetőség.</b> {ab.narrower_option}
              </p>
            )}
          </div>
        </>
      )}

      {ab?.resistance && (
        <>
          <div className="sec-h"><span className="sec-t">Rezisztencia</span></div>
          <div className="card">
            <p style={{ margin: 0, fontSize: 'var(--t-body)', lineHeight: 1.65 }}>
              {ab.resistance}
            </p>
          </div>
        </>
      )}

      {/* ── Buktatók: a modul legértékesebb része ── */}
      {s.pitfalls.length > 0 && (
        <>
          <section className="adat-szakasz figyelem">
            <h2 className="adat-cim">Amit gyakran elrontanak</h2>
            <div className="adat-lista">
              {s.pitfalls.map((x) => <div className="adat-tetel" key={x}>{x}</div>)}
            </div>
          </section>
        </>
      )}

      {/* ── Forrás ── */}
      <div className="sec-h"><span className="sec-t">Forrás</span></div>
      <div className="card">
        <p style={{ margin: 0, fontSize: 'var(--t-body)', lineHeight: 1.6 }}>
          {s.source_note}
        </p>
        {s.spc_url && (
          <a className="btn ghost sm" href={s.spc_url} target="_blank" rel="noopener"
            style={{ marginTop: 10 }}>
            OGYÉI gyógyszeradatbázis ↗
          </a>
        )}
        {s.last_verified && (
          <p className="sub" style={{ margin: '10px 0 0', fontSize: 'var(--t-caption)' }}>
            Ellenőrizve: {s.last_verified}
          </p>
        )}
      </div>

      <div className="safety-note" style={{ marginTop: 14 }}>
        <b>ⓘ Ez az adatlap nem tartalmaz adagolást.</b> Az adagolás a beteg állapotától,
        a javallattól és a vesefunkciótól függ. A hatályos adagolást a fenti hivatalos
        előírás tartalmazza.
      </div>
    </>
  )
}

function Lista({
  cim, elemek, jelzes,
}: {
  cim: string
  elemek: string[]
  /** A szakasz súlya: figyelmeztető vagy veszélyt jelző. */
  jelzes?: 'figyelem' | 'veszely'
}) {
  if (elemek.length === 0) return null
  return (
    <section className={`adat-szakasz${jelzes ? ` ${jelzes}` : ''}`}>
      <h2 className="adat-cim">{cim}</h2>
      <div className="adat-lista">
        {elemek.map((x) => <div className="adat-tetel" key={x}>{x}</div>)}
      </div>
    </section>
  )
}
