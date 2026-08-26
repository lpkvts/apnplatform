import Link from 'next/link'
import { EKG_CASES } from '@/lib/ekg/cases'

export const dynamic = 'force-dynamic'

const MODES = [
  {
    href: '/klinika/ekg/elemzes/vezetett', icon: '🔰', title: 'Vezetett elemzés',
    sub: 'Tanuld meg a strukturált EKG-elemzés folyamatát — a rendszer lépésről lépésre végigvezet.',
    cta: 'Kezdés →',
  },
  {
    href: '/klinika/ekg/elemzes/onallo', icon: '🧠', title: 'Önálló elemzés',
    sub: 'Elemezd az EKG-t segítség nélkül, majd hasonlítsd össze a válaszodat a referenciaelemzéssel.',
    cta: 'EKG elemzése →',
  },
  {
    href: '/klinika/ekg/elemzes/gyakorlas', icon: '🎯', title: 'Személyre szabott gyakorlás',
    sub: 'Gyakorold azokat a mintázatokat, amelyek a legnagyobb kihívást jelentik számodra.',
    cta: 'Gyakorlás indítása →',
  },
]

export default function ElemzesHub() {
  return (
    <>
      <Link className="sh-back" href="/klinika/ekg">‹ EKG</Link>
      <h1 className="h1">EKG elemzés</h1>
      <p className="sub">
        Tanuld meg lépésről lépésre értelmezni az EKG-t, majd gyakorold klinikai eseteken.
        Az elemzés a tananyaghoz kapcsolódik: ha elakadsz, egy koppintással ismételheted a hátteret.
      </p>

      {MODES.map((m) => (
        <Link key={m.href} className="card klink" href={m.href}>
          <div className="klink-t">{m.icon} {m.title}</div>
          <div className="sub" style={{ margin: '4px 0 8px' }}>{m.sub}</div>
          <span className="sec-l">{m.cta}</span>
        </Link>
      ))}

      <div className="sec-h"><span className="sec-t">Elérhető esetek</span><span className="sec-l" style={{ marginLeft: 'auto', fontWeight: 500 }}>{EKG_CASES.length}</span></div>
      {EKG_CASES.map((c) => (
        <Link key={c.id} className="sh-row" href={`/klinika/ekg/elemzes/${c.id}`}>
          <span className="sh-row-main">
            <span className="sh-row-name">{c.title}</span>
            <span className="sh-row-sub">{c.age} éves {c.sex} · {c.difficulty} · {c.tags.slice(0, 3).join(', ')}</span>
          </span>
          <span className="sh-chev">›</span>
        </Link>
      ))}

      <div className="safety-note" style={{ marginTop: 12 }}>
        <b>ⓘ Oktatási eszköz.</b> A megjelenített EKG-görbék szintetizáltak, nem valódi betegfelvételek.
        A rendszer egyetlen EKG-jel alapján nem állít fel diagnózist.
      </div>
    </>
  )
}
