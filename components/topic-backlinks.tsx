'use client'
import Link from 'next/link'
import { topicsForContent, topicsForDisease, type Topic } from '@/lib/topics/data'

function render(topics: Topic[]) {
  if (topics.length === 0) return null
  return (
    <div className="card" style={{ borderLeft: '4px solid var(--brand)' }}>
      <b>🔗 Kapcsolódó klinikai témakör</b>
      <div style={{ marginTop: 6 }}>
        {topics.map((t) => (
          <Link key={t.slug} className="sh-row" href={`/betegsegtar/akut/${t.slug}`}>
            <span className="sh-row-main"><span className="sh-row-name">{t.icon} {t.title}</span><span className="sh-row-sub">Akut klinikai orientáció</span></span>
            <span className="sh-chev">›</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function TopicBacklinks({ kind, id }: { kind: 'ekg' | 'labor' | 'scores' | 'examSystems'; id: string }) {
  return render(topicsForContent(kind, id))
}
export function TopicBacklinksForDisease({ name }: { name: string }) {
  return render(topicsForDisease(name))
}
