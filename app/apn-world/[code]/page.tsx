import Link from 'next/link'
import { Morzsa } from '@/components/morzsa'
import { notFound } from 'next/navigation'
import { getFlag } from '@/lib/flags'
import { FeatureOff } from '@/components/feature-off'
import { getCountry, getSources } from '@/lib/apnworld/data'
import {
  STATUS_LABEL, CONFIDENCE_LABEL, REGION_LABEL, PRESCRIBING_LABEL,
  AUTONOMY_LABEL, PRIMARY_CARE_LABEL, SCOPE_DIMS, SCOPE_JEL, SCOPE_LABEL,
  SCOPE_LEVEL_LABEL, type ScopeValue,
} from '@/lib/apnworld/types'

export const dynamic = 'force-dynamic'

/**
 * Egy ország APN-profilja.
 *
 * A tizennégy hatásköri dimenzió külön blokkban, mindegyiknél látszik, hogy a
 * jogosultság országos, területi vagy intézményi szinten áll fenn. Ahol nincs
 * megbízható adat, ott ezt kimondjuk — nem feltételezünk.
 */
export default async function OrszagPage({ params }: { params: Promise<{ code: string }> }) {
  if (!(await getFlag('apn_world', false))) return <FeatureOff title="APN World" />

  const { code } = await params
  const c = await getCountry(code)
  if (!c) notFound()

  const sources = await getSources(c.id)
  const edu = c.education as Record<string, string | boolean>
  const reg = c.regulation as Record<string, string | boolean>

  return (
    <>
      <Morzsa elemek={[{ label: 'Tudástár', href: '/tudastar' }, { label: 'APN World', href: '/apn-world' }, { label: c.name }]} />

      <div className="aw-fej">
        <span className="aw-fej-flag" aria-hidden="true">{c.flag}</span>
        <div>
          <h1 className="h1" style={{ margin: 0 }}>{c.name}</h1>
          <p className="sub" style={{ margin: '2px 0 0' }}>
            {c.name_en} · {REGION_LABEL[c.region]}
          </p>
        </div>
      </div>

      <div className="row" style={{ border: 'none', padding: '10px 0 0', gap: 8, flexWrap: 'wrap' }}>
        <span className="st st-passed">{STATUS_LABEL[c.status]}</span>
        <span className={`st ${c.data_confidence === 'high' ? 'st-done' : c.data_confidence === 'moderate' ? 'st-progress' : 'st-failed'}`}>
          {CONFIDENCE_LABEL[c.data_confidence]}
        </span>
        {c.last_verified && (
          <span className="sub" style={{ margin: 0, fontSize: 'var(--t-caption)' }}>
            Ellenőrizve: {c.last_verified}
          </span>
        )}
      </div>

      {c.description && (
        <div className="card" style={{ marginTop: 14 }}>
          <p style={{ margin: 0, fontSize: 'var(--t-body)', lineHeight: 1.65 }}>{c.description}</p>
        </div>
      )}

      {/* ── Szerepkörök ── */}
      <div className="sec-h"><span className="sec-t">Szerepkörök</span></div>
      <div className="card">
        <div className="mp-tags" style={{ marginTop: 0 }}>
          {c.roles.map((r) => (
            <span className="mp-tag" key={r.name}>
              {r.name}{r.abbr ? ` (${r.abbr})` : ''}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hatáskör ── */}
      <div className="sec-h"><span className="sec-t">Hatáskör</span></div>
      <div className="lst">
        {SCOPE_DIMS.map((d) => {
          const it = c.scope?.[d.key]
          const v: ScopeValue = it?.v ?? 'unknown'
          return (
            <div className="lst-sor" key={d.key} style={{ cursor: 'default' }}>
              <span className={`aw-jel-box aw-${v}`} aria-hidden="true">{SCOPE_JEL[v]}</span>
              <span className="lst-fo">
                <b>{d.label}</b>
                <span>
                  {SCOPE_LABEL[v]}
                  {it?.scope && ` · ${SCOPE_LEVEL_LABEL[it.scope]}`}
                  {it?.note && ` — ${it.note}`}
                </span>
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Gyógyszerfelírás ── */}
      <div className="sec-h"><span className="sec-t">Gyógyszerfelírás</span></div>
      <div className="card">
        <b style={{ fontSize: 'var(--t-h2)' }}>{PRESCRIBING_LABEL[c.prescribing]}</b>
        {c.prescribing_note && (
          <p style={{ margin: '8px 0 0', fontSize: 'var(--t-body)', lineHeight: 1.6, color: 'var(--muted)' }}>
            {c.prescribing_note}
          </p>
        )}
      </div>

      {/* ── Oktatás és szabályozás ── */}
      <div className="sec-h"><span className="sec-t">Oktatás</span></div>
      <div className="card">
        <dl className="aw-dl">
          {edu.level && <><dt>Szint</dt><dd>{String(edu.level)}</dd></>}
          <dt>Mesterfokozat</dt><dd>{edu.master_required ? 'Kötelező' : 'Nem kötelező'}</dd>
          {edu.doctoral_pathway !== undefined && (
            <><dt>Doktori út</dt><dd>{edu.doctoral_pathway ? 'Létezik' : 'Nincs'}</dd></>
          )}
          {edu.certification && <><dt>Képesítés</dt><dd>{String(edu.certification)}</dd></>}
          {edu.registration && <><dt>Nyilvántartás</dt><dd>{String(edu.registration)}</dd></>}
          {edu.recertification && <><dt>Megújítás</dt><dd>{String(edu.recertification)}</dd></>}
        </dl>
        {edu.note && <p className="nk-tanulsag">{String(edu.note)}</p>}
      </div>

      <div className="sec-h"><span className="sec-t">Szabályozás</span></div>
      <div className="card">
        <dl className="aw-dl">
          {reg.level && <><dt>Szint</dt><dd>{String(reg.level)}</dd></>}
          <dt>Védett cím</dt><dd>{reg.protected_title ? 'Igen' : 'Nem'}</dd>
          <dt>Kötelező nyilvántartás</dt><dd>{reg.registration ? 'Igen' : 'Nem'}</dd>
          <dt>Hatáskör szabályozva</dt><dd>{reg.scope_regulated ? 'Igen' : 'Nem'}</dd>
          {reg.since && <><dt>Mióta</dt><dd>{String(reg.since)}</dd></>}
        </dl>
        {reg.note && <p className="nk-tanulsag">{String(reg.note)}</p>}
      </div>

      {/* ── Ellátási területek ── */}
      <div className="sec-h"><span className="sec-t">Alapellátás</span></div>
      <div className="card">
        <b>{PRIMARY_CARE_LABEL[c.primary_care]} szerep</b>
        {c.primary_care_areas.length > 0 && (
          <div className="mp-tags">
            {c.primary_care_areas.map((a) => <span className="mp-tag plain" key={a}>{a}</span>)}
          </div>
        )}
      </div>

      {c.hospital_areas.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Kórházi és szakellátás</span></div>
          <div className="card">
            <div className="mp-tags" style={{ marginTop: 0 }}>
              {c.hospital_areas.map((a) => <span className="mp-tag plain" key={a}>{a}</span>)}
            </div>
          </div>
        </>
      )}

      {/* ── Erősségek és nehézségek ── */}
      {(c.strengths.length > 0 || c.challenges.length > 0) && (
        <div className="aw-2col">
          {c.strengths.length > 0 && (
            <div className="card">
              <b>Erősségek</b>
              <ul className="aw-ul">{c.strengths.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}
          {c.challenges.length > 0 && (
            <div className="card">
              <b>Nehézségek</b>
              <ul className="aw-ul">{c.challenges.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      {/* ── Szakmai értelmezés ── */}
      {c.why_interesting && (
        <>
          <div className="sec-h"><span className="sec-t">Miért tanulságos ez a modell?</span></div>
          <div className="card" style={{ borderLeft: '4px solid var(--brand-3)' }}>
            <p style={{ margin: 0, fontSize: 'var(--t-body)', lineHeight: 1.65 }}>
              {c.why_interesting}
            </p>
          </div>
        </>
      )}

      {/* ── Források ── */}
      {sources.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">Források</span></div>
          <div className="lst">
            {sources.map((s) => (
              s.url ? (
                <a className="lst-sor" href={s.url} target="_blank" rel="noopener" key={s.id}>
                  <span className="lst-fo">
                    <b>{s.title}</b>
                    <span>{s.org}{s.accessed_on && ` · megtekintve: ${s.accessed_on}`}</span>
                  </span>
                  <span className="lst-nyil" aria-hidden="true">↗</span>
                </a>
              ) : (
                <div className="lst-sor" key={s.id} style={{ cursor: 'default' }}>
                  <span className="lst-fo">
                    <b>{s.title}</b>
                    <span>{s.org}</span>
                  </span>
                </div>
              )
            ))}
          </div>
        </>
      )}
    </>
  )
}
