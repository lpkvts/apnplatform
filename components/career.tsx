'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface CareerItem {
  id: string; category: string; title: string; org: string | null
  location: string | null; deadline: string | null; tags: string[] | null; specialty: string[] | null
}

export const CAT_LABEL: Record<string, string> = {
  allas: 'Állások', kepzes: 'Képzések', konferencia: 'Konferenciák', palyazat: 'Pályázatok',
  publikacio: 'Publikációk', kutatas: 'Kutatás', mentor: 'Mentorprogram',
}
const CATS = ['allas', 'kepzes', 'konferencia', 'palyazat', 'publikacio', 'kutatas', 'mentor']
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

function Row({ i }: { i: CareerItem }) {
  return (
    <Link className="sh-row" href={`/career/${i.id}`}>
      <span className="sh-row-main">
        <span className="sh-row-name">{i.title}</span>
        <span className="sh-row-sub">
          {CAT_LABEL[i.category]}{i.org ? ` · ${i.org}` : ''}{i.deadline ? ` · határidő: ${i.deadline}` : ''}
        </span>
      </span>
      <span className="sh-chev">›</span>
    </Link>
  )
}

export function Career({ items, profileKw }: { items: CareerItem[]; profileKw: string[] }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('mind')

  const kw = profileKw.map(norm).filter(Boolean)
  const recommended = kw.length
    ? items.filter((i) => {
        const hay = norm([...(i.specialty ?? []), ...(i.tags ?? []), i.title].join(' '))
        return kw.some((k) => k.length > 2 && hay.includes(k))
      }).slice(0, 4)
    : []

  const nq = norm(q.trim())
  const list = items.filter((i) => {
    const inCat = cat === 'mind' || i.category === cat
    const inQ = !nq || norm(`${i.title} ${i.org ?? ''} ${(i.tags ?? []).join(' ')}`).includes(nq)
    return nq ? inQ : inCat && inQ
  })

  return (
    <>
      <input className="field" placeholder="Keresés: cím, szervezet, kulcsszó…" value={q} onChange={(e) => setQ(e.target.value)} />

      {!nq && (
        <div className="sh-chips">
          <button className={cat === 'mind' ? 'sh-chip on' : 'sh-chip'} onClick={() => setCat('mind')}>Összes</button>
          {CATS.map((c) => <button key={c} className={cat === c ? 'sh-chip on' : 'sh-chip'} onClick={() => setCat(c)}>{CAT_LABEL[c]}</button>)}
        </div>
      )}

      {!nq && cat === 'mind' && recommended.length > 0 && (
        <>
          <div className="sec-h"><span className="sec-t">✨ Neked ajánlott</span></div>
          <p className="sub" style={{ marginTop: -4 }}>A szakmai profilodhoz illő lehetőségek.</p>
          {recommended.map((i) => <Row key={`rec-${i.id}`} i={i} />)}
          <div className="sec-h"><span className="sec-t">Összes lehetőség</span></div>
        </>
      )}

      {list.map((i) => <Row key={i.id} i={i} />)}
      {list.length === 0 && <p className="sub">Nincs találat ebben a kategóriában.</p>}
    </>
  )
}
