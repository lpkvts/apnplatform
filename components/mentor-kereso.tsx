'use client'

import Link from 'next/link'

import { useMemo, useState } from 'react'
import { filterMentors, SPECIALTIES, TOPICS, type Mentor } from '@/lib/mentor/types'

/**
 * Mentorkereső.
 *
 * A szűrés a betöltött listán fut, mert a mentorok száma belátható marad — így
 * a szűrők azonnal hatnak, adatbázis-kérés nélkül. Ha a lista megnő, a szűrést
 * érdemes átvinni a lekérdezésbe.
 */
export function MentorKereso({ mentors }: { mentors: Mentor[] }) {
  const [q, setQ] = useState('')
  const [spec, setSpec] = useState('')
  const [topic, setTopic] = useState('')
  const [years, setYears] = useState(0)

  const talalat = useMemo(
    () => filterMentors(mentors, { q, specialty: spec, topic, minYears: years }),
    [mentors, q, spec, topic, years],
  )

  // Csak azokat a szűrőértékeket kínáljuk, amelyekre van is mentor.
  const elerhetoSpec = useMemo(
    () => SPECIALTIES.filter((s) => mentors.some((m) => m.specialty === s)), [mentors])
  const elerhetoTopic = useMemo(
    () => TOPICS.filter((t) => mentors.some((m) => m.topics.includes(t))), [mentors])

  const szurve = q !== '' || spec !== '' || topic !== '' || years > 0

  if (mentors.length === 0) {
    return (
      <div className="card">
        <p style={{ margin: 0 }}>
          Még nincs jóváhagyott mentor. Ha te magad megosztanád a tapasztalatodat,
          a Mentorprogram kezdőoldalán jelentkezhetsz.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="search-box">
        <input
          className="search-input" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Név, szakterület vagy téma…" aria-label="Keresés a mentorok között"
        />
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <label className="sub" style={{ fontSize: 12, fontWeight: 700 }}>Szakterület</label>
        <div className="sh-chips" style={{ marginTop: 6 }}>
          <button className={`sh-chip ${spec === '' ? 'on' : ''}`} onClick={() => setSpec('')}>Mind</button>
          {elerhetoSpec.map((s) => (
            <button key={s} className={`sh-chip ${spec === s ? 'on' : ''}`}
              onClick={() => setSpec(spec === s ? '' : s)}>{s}</button>
          ))}
        </div>

        {elerhetoTopic.length > 0 && (
          <>
            <label className="sub" style={{ fontSize: 12, fontWeight: 700, marginTop: 12, display: 'block' }}>
              Mentorálási téma
            </label>
            <div className="sh-chips" style={{ marginTop: 6 }}>
              <button className={`sh-chip ${topic === '' ? 'on' : ''}`} onClick={() => setTopic('')}>Mind</button>
              {elerhetoTopic.map((t) => (
                <button key={t} className={`sh-chip ${topic === t ? 'on' : ''}`}
                  onClick={() => setTopic(topic === t ? '' : t)}>{t}</button>
              ))}
            </div>
          </>
        )}

        <label className="sub" style={{ fontSize: 12, fontWeight: 700, marginTop: 12, display: 'block' }}>
          Legalább ennyi év tapasztalat
        </label>
        <div className="sh-chips" style={{ marginTop: 6 }}>
          {[0, 3, 5, 10].map((y) => (
            <button key={y} className={`sh-chip ${years === y ? 'on' : ''}`} onClick={() => setYears(y)}>
              {y === 0 ? 'Mindegy' : `${y}+ év`}
            </button>
          ))}
        </div>

        {szurve && (
          <button className="btn ghost sm" style={{ marginTop: 12 }}
            onClick={() => { setQ(''); setSpec(''); setTopic(''); setYears(0) }}>
            Szűrők törlése
          </button>
        )}
      </div>

      <div className="sec-h">
        <span className="sec-t">
          {talalat.length === 0 ? 'Nincs találat' : `${talalat.length} mentor`}
        </span>
      </div>

      {talalat.length === 0 && (
        <p className="sub">Próbálj tágabb szűrést — például csak szakterületre vagy témára.</p>
      )}

      {talalat.map((m) => (
        <Link className="card mp-mentor" href={`/mentor/${m.id}`} key={m.id}>
          <div className="row" style={{ border: 'none', padding: 0, alignItems: 'flex-start' }}>
            <span style={{ flex: 1 }}>
              <b style={{ fontSize: 16 }}>{m.full_name || 'Mentor'}</b>
              {m.title && <span className="sub" style={{ display: 'block', margin: '2px 0 0', fontSize: 13 }}>{m.title}</span>}
            </span>
          </div>

          <div className="mp-meta">
            <span>{m.specialty}</span>
            {m.experience_years != null && <span>{m.experience_years} év tapasztalat</span>}
            {m.workplace && <span>{m.workplace}</span>}
          </div>

          {m.bio && <p className="mp-bio">{m.bio.slice(0, 180)}{m.bio.length > 180 ? '…' : ''}</p>}

          <div className="mp-tags">
            {m.topics.slice(0, 4).map((t) => <span className="mp-tag" key={t}>{t}</span>)}
            {m.topics.length > 4 && <span className="mp-tag plain">+{m.topics.length - 4}</span>}
          </div>
        </Link>
      ))}
    </>
  )
}
