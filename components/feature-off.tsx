import Link from 'next/link'
export function FeatureOff({ title, back = '/', backLabel = '‹ Vissza' }: { title: string; back?: string; backLabel?: string }) {
  return (
    <>
      <Link className="sh-back" href={back}>{backLabel}</Link>
      <h1 className="h1">{title}</h1>
      <div className="card">
        <b>Jelenleg nem elérhető</b>
        <p style={{ margin: '6px 0 0' }}>Ez a funkció átmenetileg szünetel. Admin a Beállításokban kapcsolhatja be.</p>
      </div>
    </>
  )
}
