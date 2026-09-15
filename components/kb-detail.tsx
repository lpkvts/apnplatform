'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Guideline, RelatedScore, GuidelineVersion } from '@/lib/kb/types'

type Level = 'gyors' | 'apn' | 'forras'

export function KbDetail({
  g, related, korabbiak = [],
}: {
  g: Guideline
  related: RelatedScore[]
  /** Az azonos irányelv korábbi kiadásai, a legfrissebbtől visszafelé. */
  korabbiak?: GuidelineVersion[]
}) {
  const [lv, setLv] = useState<Level>('gyors')
  // A body üres is lehet: a kórképekből átvezetett források nem hoznak
  // szakaszokat, csak címet és forrásadatokat. Üres objektumra cseréljük,
  // különben a mezőhivatkozások hibát dobnak.
  const b = g.body ?? {}

  const RelatedBox = () =>
    related.length ? (
      <div className="card">
        <b>🔗 Kapcsolódó eszközök</b>
        {related.map((t) => (
          <Link key={t.id} className="sh-row" href={`/klinika/tesztek?open=${t.id}`} style={{ marginTop: 8 }}>
            <span className="sh-row-main">
              <span className="sh-row-name">{t.name}</span>
              <span className="sh-row-sub">{t.abbr ?? ''} · Skálák és score-ok</span>
            </span>
            <span className="sh-chev">›</span>
          </Link>
        ))}
      </div>
    ) : null

  return (
    <>
      <Link className="sh-back" href="/klinika/tudastar">‹ Tudástár</Link>
      <h1 className="h1">{g.title}</h1>
      {/* A kórképből átvezetett forrásnál a kórkép adja a szövegkörnyezetet:
          onnan derül ki, mire vonatkozik az irányelv. */}
      {g.from_disease_slug && (
        <p className="sub" style={{ marginTop: -4 }}>
          Forrás a{' '}
          <Link href={`/betegsegtar/${g.from_disease_slug}`} className="sec-l">
            kórkép adatlapjáról
          </Link>
          {g.source_year && ` · ${g.source_year}`}
        </p>
      )}

      <div className="kb-levels">
        <button className={lv === 'gyors' ? 'kb-lv on' : 'kb-lv'} onClick={() => setLv('gyors')}>Gyors válasz</button>
        <button className={lv === 'apn' ? 'kb-lv on' : 'kb-lv'} onClick={() => setLv('apn')}>APN-összefoglaló</button>
        <button className={lv === 'forras' ? 'kb-lv on' : 'kb-lv'} onClick={() => setLv('forras')}>Eredeti forrás</button>
      </div>

      {lv === 'gyors' && (
        <>
          <div className="kb-qh">ℹ️ Mit kell tudnom most?</div>
          <p className="lead">{g.summary}</p>
          {g.specialty && g.specialty.length > 0 && (
            <div className="kb-relnote">🛡️ APN-relevancia: {g.specialty.join(' · ')}</div>
          )}
          <RelatedBox />
          <p className="sub">Részletekért válts az „APN-összefoglaló" nézetre; a teljes szövegért az „Eredeti forrás"-ra.</p>
        </>
      )}

      {lv === 'apn' && (
        <>
          <div className="kb-qh">📋 Mit kell tudnom APN-ként?</div>
          {(b.sections ?? []).length > 0 ? (
            (b.sections ?? []).map((s, i) => (
              <div className="card" key={i}>
                <b>{s[0]}</b>
                <p style={{ margin: '6px 0 0' }}>{s[1]}</p>
              </div>
            ))
          ) : g.from_disease_slug ? (
            /* A kórképből átvezetett forrásnál a részletek a kórkép
               adatlapján vannak — oda irányítunk, üres lap helyett. */
            <div className="card">
              <b>A részletek a kórkép adatlapján</b>
              <p style={{ margin: '6px 0 0' }}>
                Ez a bejegyzés egy kórkép forrásaként került a jegyzékbe. Az
                APN-teendők, a figyelmeztető jelek és a kezelés ott olvashatók.
              </p>
              <Link className="btn ghost sm" href={`/betegsegtar/${g.from_disease_slug}`}
                style={{ marginTop: 10 }}>
                Kórkép megnyitása
              </Link>
            </div>
          ) : (
            <p className="sub">Ehhez a forráshoz még nincs APN-összefoglaló.</p>
          )}
          <RelatedBox />
        </>
      )}

      {/* Ha ezt a kiadást felváltotta egy újabb, azt a lap tetején kell
          kimondani — nem a végén, amikor a felhasználó már elolvasta. */}
      {g.superseded_by && (
        <div className="kb-felvaltva" role="status">
          <b>Ez a kiadás már nem hatályos.</b>
          <Link href={`/klinika/tudastar/${g.superseded_by}`}>
            Ugrás a hatályos kiadásra
          </Link>
        </div>
      )}

      {lv === 'forras' && (
        <>
          <div className="kb-qh">📄 Eredeti, hivatalos forrás</div>
          <div className="card">
            <div className="row"><span className="sub" style={{ margin: 0 }}>Azonosító</span><b>{g.external_id}</b></div>
            <div className="row"><span className="sub" style={{ margin: 0 }}>Verzió</span><b>{b.version || g.version || g.source_year || '—'}</b></div>
            {b.updated && <div className="row"><span className="sub" style={{ margin: 0 }}>Frissítve</span><b>{b.updated}</b></div>}
            <div className="row" style={{ borderBottom: 'none' }}><span className="sub" style={{ margin: 0 }}>Kiadó / forrás</span><b style={{ textAlign: 'right' }}>{b.source_name || g.title}</b></div>
          </div>
          {(b.source_url || g.source_url) && (
            <a className="btn" href={b.source_url || g.source_url || '#'} target="_blank" rel="noopener" style={{ justifyContent: 'center', width: '100%' }}>
              Hivatalos forrás megnyitása
            </a>
          )}
          {korabbiak.length > 0 && (
            <details className="kb-korabbi">
              <summary>
                Korábbi verziók
                <span>{korabbiak.length} kiadás</span>
              </summary>
              <div className="lst">
                {korabbiak.map((k) => (
                  <Link key={k.id} className="lst-sor"
                    href={`/klinika/tudastar/${k.id}`}>
                    <span className="lst-fo">
                      <b>{k.title}</b>
                      <span>
                        {k.source_year ?? 'évszám nélkül'}
                        {k.status === 'superseded' && ' · felváltva'}
                      </span>
                    </span>
                    <span className="lst-meta">{k.source_year ?? '—'}</span>
                  </Link>
                ))}
              </div>
              <p className="sub" style={{ margin: '10px 0 0' }}>
                A korábbi kiadások azért maradnak elérhetők, mert egy
                dokumentált klinikai döntés annak az irányelvnek az alapján
                született, ami akkor hatályos volt.
              </p>
            </details>
          )}

          {b.refs && b.refs.length > 0 && (
            <div className="card" style={{ marginTop: 12 }}>
              <b>Hivatkozott források</b>
              <ul>{b.refs.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          )}
        </>
      )}
    </>
  )
}
