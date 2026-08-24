'use client'
import { useActionState } from 'react'
import Link from 'next/link'
import { importStubs, type ImportState } from '@/app/cms/betegsegek/import/actions'
export function StubImportForm() {
  const [state, action, pending] = useActionState<ImportState, FormData>(importStubs, {})
  return (
    <form action={action}>
      <div className="as-lbl">Kórkép-lista (soronként egy)</div>
      <p className="sub" style={{ margin: '0 0 6px' }}>Formátum: <b>Név | Szakterület | BNO</b> — a szakterület és a BNO opcionális. A már létező (azonos slugú) tételeket kihagyja, nem írja felül.</p>
      <textarea className="as-ta" name="list" rows={12} placeholder={'Hypertonia | Kardiológia | I10\nCOPD | Pulmonológia | J44\nPneumonia | Pulmonológia | J18'} style={{ fontFamily: 'monospace', fontSize: 13 }} />
      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>{pending ? 'Importálás…' : 'Stubok létrehozása'}</button>
      {state.done && <p className="form-ok">Kész ✓ Létrehozva: {state.created}, kihagyva (már létezett): {state.skipped}, összesen feldolgozva: {state.total}. <Link href="/cms/betegsegek">Betegségtár kezelése ›</Link></p>}
      {state.error && <p className="form-err">Nem sikerült: {state.error}</p>}
    </form>
  )
}
