import { saveGuideline } from '@/app/cms/actions'

interface GData {
  id: string
  title: string
  summary: string | null
  specialty: string[] | null
  version: string | null
  review_on: string | null
  expires_on: string | null
  ai_generated: boolean
  body: { sections?: [string, string][] } | null
}

export function GuidelineForm({ g }: { g?: GData }) {
  const sections = (g?.body?.sections ?? []).map((s) => `${s[0]} | ${s[1]}`).join('\n')
  return (
    <form action={saveGuideline}>
      {g?.id && <input type="hidden" name="id" value={g.id} />}
      <div className="as-lbl">Cím *</div>
      <input className="field" name="title" defaultValue={g?.title ?? ''} required />

      <div className="as-lbl">Összefoglaló (Gyors válasz)</div>
      <textarea className="as-ta" name="summary" rows={3} defaultValue={g?.summary ?? ''} />

      <div className="as-lbl">Szakterületek (vesszővel elválasztva)</div>
      <input className="field" name="specialty" defaultValue={(g?.specialty ?? []).join(', ')} />

      <div className="as-lbl">Szakaszok (APN-összefoglaló) — soronként: „Cím | szöveg”</div>
      <textarea className="as-ta" name="sections" rows={6} defaultValue={sections}
        placeholder="Diagnosztika | A diagnózis alapja…&#10;Kezelés | A terápia lépcsői…" />

      <div className="as-lbl">Forrás neve</div>
      <input className="field" name="source_name" defaultValue={''} placeholder="pl. NEAK / EMMI" />
      <div className="as-lbl">Forrás URL</div>
      <input className="field" name="source_url" type="url" defaultValue={''} placeholder="https://…" />

      <div className="as-lbl">Verzió</div>
      <input className="field" name="version" defaultValue={g?.version ?? ''} placeholder="2026" />

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div className="as-lbl">Felülvizsgálat</div>
          <input className="field" name="review_on" type="date" defaultValue={g?.review_on ?? ''} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="as-lbl">Lejárat</div>
          <input className="field" name="expires_on" type="date" defaultValue={g?.expires_on ?? ''} />
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
        <input type="checkbox" name="ai_generated" defaultChecked={g?.ai_generated ?? false} />
        AI-generált tartalom (nem publikálható lektorálás nélkül)
      </label>

      <button className="btn" type="submit">Mentés</button>
    </form>
  )
}
