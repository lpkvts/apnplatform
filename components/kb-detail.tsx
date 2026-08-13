'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Guideline, RelatedScore } from '@/lib/kb/types'

type Level = 'gyors' | 'apn' | 'forras'

export function KbDetail({ g, related }: { g: Guideline; related: RelatedScore[] }) {
  const [lv, setLv] = useState<Level>('gyors')
  const b = g.body

  const RelatedBox = () =>
    related.length ? (
      <div className="card">
        <b>🔗 Kapcsolódó eszközök</b>
        {related.map((t) => (
          <Link key={t.id} className="sh-row" href={`/klinika/tesztek?open=${t.id}`} style={{ marginTop: 8 }}>
            <span className="sh-row-main">
              <span className="sh-row-name">{t.name}</span>
              <span className="sh-row-sub">{t.abbr ?? ''} · Score Hub</span>
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
          {(b.sections ?? []).map((s, i) => (
            <div className="card" key={i}>
              <b>{s[0]}</b>
              <p style={{ margin: '6px 0 0' }}>{s[1]}</p>
            </div>
          ))}
          <RelatedBox />
        </>
      )}

      {lv === 'forras' && (
        <>
          <div className="kb-qh">📄 Eredeti, hivatalos forrás</div>
          <div className="card">
            <div className="row"><span className="sub" style={{ margin: 0 }}>Azonosító</span><b>{g.external_id}</b></div>
            <div className="row"><span className="sub" style={{ margin: 0 }}>Verzió</span><b>{b.version || g.version}</b></div>
            {b.updated && <div className="row"><span className="sub" style={{ margin: 0 }}>Frissítve</span><b>{b.updated}</b></div>}
            <div className="row" style={{ borderBottom: 'none' }}><span className="sub" style={{ margin: 0 }}>Kiadó / forrás</span><b style={{ textAlign: 'right' }}>{b.source_name}</b></div>
          </div>
          {b.source_url && (
            <a className="btn" href={b.source_url} target="_blank" rel="noopener" style={{ justifyContent: 'center', width: '100%' }}>
              Hivatalos forrás megnyitása
            </a>
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
