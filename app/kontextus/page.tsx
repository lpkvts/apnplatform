import Link from 'next/link'
import { OldalFej } from '@/components/oldal-fej'
import { CONTEXTS } from '@/lib/context/data'

export default function KontextusPage() {
  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <OldalFej cim="Klinikai kontextus" />
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
