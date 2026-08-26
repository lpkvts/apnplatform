import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EKG_CASES, caseById } from '@/lib/ekg/cases'
import { GuidedAnalysis } from '@/components/ekg-guided'

export const dynamic = 'force-dynamic'

export default async function EsetElemzesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // A módválasztó aloldalak külön útvonalak; itt az esetek nyílnak meg.
  if (id === 'vezetett') {
    const first = EKG_CASES[0]
    return (
      <>
        <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
        <h1 className="h1">Vezetett elemzés</h1>
        <p className="sub">Válassz esetet, és a rendszer lépésről lépésre végigvezet a strukturált elemzésen.</p>
        {EKG_CASES.map((c) => (
          <Link key={c.id} className="card klink" href={`/klinika/ekg/elemzes/${c.id}`}>
            <div className="klink-t">{c.title}</div>
            <div className="sub" style={{ margin: '4px 0 0' }}>{c.age} éves {c.sex} · {c.difficulty}</div>
          </Link>
        ))}
        <p className="sub" style={{ marginTop: 10 }}>Ajánlott kezdés: {first.title}.</p>
      </>
    )
  }

  if (id === 'onallo' || id === 'gyakorlas') {
    const title = id === 'onallo' ? 'Önálló elemzés' : 'Személyre szabott gyakorlás'
    const body = id === 'onallo'
      ? 'Ebben a módban segítség nélkül töltöd ki az elemzést, majd a referenciaelemzéssel veted össze. Előkészítés alatt — a vezetett elemzés már használható.'
      : 'A rendszer a korábbi válaszaid alapján ajánl EKG-ket. Ehhez előbb néhány elemzést el kell végezned. Előkészítés alatt.'
    return (
      <>
        <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
        <h1 className="h1">{title}</h1>
        <div className="card"><p style={{ margin: 0 }}>{body}</p></div>
        <Link className="btn" href="/klinika/ekg/elemzes/vezetett" style={{ width: '100%', marginTop: 12 }}>
          Vezetett elemzés indítása
        </Link>
      </>
    )
  }

  const ecgCase = caseById(id)
  if (!ecgCase) notFound()

  return (
    <>
      <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
      <h1 className="h1">{ecgCase.title}</h1>
      <GuidedAnalysis ecgCase={ecgCase} />
    </>
  )
}
