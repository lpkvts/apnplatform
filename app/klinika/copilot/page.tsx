import Link from 'next/link'
import { Copilot } from '@/components/copilot'
import { getFlag } from '@/lib/flags'
export const dynamic = 'force-dynamic'
export default async function CopilotPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const enabled = await getFlag('apn_copilot', false)
  if (!enabled) {
    return (
      <>
        <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
        <h1 className="h1">APN Copilot</h1>
        <div className="card">
          <b>Jelenleg nem elérhető</b>
          <p style={{ margin: '6px 0 0' }}>Az APN Copilot fejlesztés alatt áll. Hamarosan AI-alapú, forrásmegjelölt döntéstámogatással tér vissza. Admin a Beállításokban kapcsolhatja be.</p>
        </div>
      </>
    )
  }
  return <Copilot initialQuery={q} />
}
