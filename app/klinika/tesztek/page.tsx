import { Suspense } from 'react'
import Link from 'next/link'
import { ScoreHub } from '@/components/score-hub'

export default function TesztekPage() {
  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <Suspense fallback={<p className="sub">Betöltés…</p>}>
        <ScoreHub />
      </Suspense>
    </>
  )
}
