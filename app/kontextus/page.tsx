import Link from 'next/link'
import { CONTEXTS } from '@/lib/context/data'

export default function KontextusPage() {
  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Klinikai kontextus</h1>
      <p className="sub">Válassz egy klinikai helyzetet — a rendszer minden kapcsolódó eszközt, labort, EKG-t és irányelvet egy helyre gyűjt.</p>
      {CONTEXTS.map((c) => (
        <Link key={c.id} className="sh-row" href={`/kontextus/${c.id}`}>
          <span className="sh-row-main">
            <span className="sh-row-name">{c.name}</span>
            <span className="sh-row-sub">{c.apnFocus}</span>
          </span>
          <span className="sh-chev">›</span>
        </Link>
      ))}
    </>
  )
}
