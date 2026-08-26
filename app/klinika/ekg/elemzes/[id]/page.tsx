import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EKG_CASES, caseById } from '@/lib/ekg/cases'
import { GuidedAnalysis } from '@/components/ekg-guided'
import { SoloAnalysis } from '@/components/ekg-solo'

export const dynamic = 'force-dynamic'

function CaseList({ mode, title, lead }: { mode: string; title: string; lead: string }) {
  return (
    <>
      <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
      <h1 className="h1">{title}</h1>
      <p className="sub">{lead}</p>
      {EKG_CASES.map((c) => (
        <Link key={c.id} className="card klink" href={`/klinika/ekg/elemzes/${c.id}?mod=${mode}`}>
          <div className="klink-t">{c.title}</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>
            {c.age} éves {c.sex} · {c.difficulty} · {c.tags.slice(0, 3).join(', ')}
          </div>
        </Link>
      ))}
    </>
  )
}

export default async function EsetElemzesPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mod?: string }>
}) {
  const { id } = await params
  const { mod } = await searchParams

  if (id === 'vezetett') {
    return <CaseList mode="vezetett" title="Vezetett elemzés"
      lead="Válassz esetet, és a rendszer lépésről lépésre végigvezet a strukturált elemzésen." />
  }

  if (id === 'onallo') {
    return <CaseList mode="onallo" title="Önálló elemzés"
      lead="Segítség nélkül elemzed az EKG-t, majd összeveted a válaszodat a referenciaelemzéssel." />
  }

  if (id === 'gyakorlas') {
    return (
      <>
        <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
        <h1 className="h1">Személyre szabott gyakorlás</h1>
        <div className="card">
          <p style={{ margin: 0 }}>
            A rendszer a korábbi válaszaid alapján ajánl EKG-ket. Ehhez a válaszok mentése szükséges,
            ami előkészítés alatt áll. Addig a vezetett és az önálló elemzés szabadon használható.
          </p>
        </div>
        <Link className="btn" href="/klinika/ekg/elemzes/vezetett" style={{ width: '100%', marginTop: 12 }}>
          Vezetett elemzés indítása
        </Link>
      </>
    )
  }

  const ecgCase = caseById(id)
  if (!ecgCase) notFound()

  const solo = mod === 'onallo'

  return (
    <>
      <Link className="sh-back" href="/klinika/ekg/elemzes">‹ EKG elemzés</Link>
      <h1 className="h1">{ecgCase.title}</h1>

      {/* Módváltó — ugyanaz az eset mindkét módban elvégezhető */}
      <div className="ekg-modebar">
        <Link className={`seg ${!solo ? 'on' : ''}`} href={`/klinika/ekg/elemzes/${ecgCase.id}`}>🔰 Vezetett</Link>
        <Link className={`seg ${solo ? 'on' : ''}`} href={`/klinika/ekg/elemzes/${ecgCase.id}?mod=onallo`}>🧠 Önálló</Link>
      </div>

      {solo ? <SoloAnalysis ecgCase={ecgCase} /> : <GuidedAnalysis ecgCase={ecgCase} />}
    </>
  )
}
