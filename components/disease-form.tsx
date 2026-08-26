'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { saveDisease, type DiseaseSaveState } from '@/app/cms/betegsegek/actions'
import { CONTEXTS } from '@/lib/context/data'

interface DBody {
  brief_what?: string; brief_why?: string; when?: string[]; examine?: string[]
  labs?: string; ekg?: string; imaging?: string; scores?: string
  red_flags?: string[]; apn_focus?: string[]; treatment?: string[]; followup?: string[]
  source_name?: string; source_url?: string; version?: string; evidence?: string
}
interface Ddx { name: string; slug?: string }
interface ApnApproach { anamnesis?: string | null; physical?: string | null; data?: string | null; thinking?: string | null; consultation?: string | null; escalation?: string | null }
interface Reviewer { name?: string; specialty?: string | null; role?: string | null; date?: string | null }
export interface DiseaseData {
  id?: string; name?: string; slug?: string; aliases?: string[]; abbrev?: string | null
  specialty?: string | null; context_id?: string | null
  score_ids?: string[]; lab_ids?: string[]; ekg_ids?: string[]; guideline_kw?: string[]
  version?: string | null; review_on?: string | null; expires_on?: string | null
  ai_generated?: boolean; body?: DBody
  epidemiology?: string | null; pathophysiology?: string | null; ddx?: Ddx[] | null; apn_approach?: ApnApproach | null
  evidence_levels?: string[] | null; validation_status?: string | null; reviewers?: Reviewer[] | null; bno?: string | null; is_stub?: boolean
  block_sources?: Record<string, string> | null
}

const j = (a?: string[]) => (a ?? []).join(', ')
const nl = (a?: string[]) => (a ?? []).join('\n')
const ddxToText = (a?: Ddx[] | null) => (a ?? []).map((d) => (d.slug ? `${d.name} | ${d.slug}` : d.name)).join('\n')
const revToText = (a?: Reviewer[] | null) => (a ?? []).map((r) => [r.name, r.specialty, r.role, r.date].filter(Boolean).join(' | ')).join('\n')

const EVID = [{ v: 'guideline', l: '🟢 Guideline-based' }, { v: 'evidence', l: '🔵 Evidence-based' }, { v: 'expert', l: '🟣 Expert-reviewed' }]
const VALID = ['', 'draft', 'review_pending', 'under_review', 'approved', 'update_required', 'archived']

export function DiseaseForm({ d }: { d?: DiseaseData }) {
  const [state, action, pending] = useActionState<DiseaseSaveState, FormData>(saveDisease, {})
  const b = d?.body ?? {}
  const ap = d?.apn_approach ?? {}
  const bs = d?.block_sources ?? {}
  const evs = d?.evidence_levels ?? []
  return (
    <form action={action}>
      {d?.id && <input type="hidden" name="id" value={d.id} />}

      <div className="as-lbl">Név *</div>
      <input className="field" name="name" defaultValue={d?.name ?? ''} required />
      <div className="as-lbl">Szinonimák (vesszővel)</div>
      <input className="field" name="aliases" defaultValue={j(d?.aliases)} />
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}><div className="as-lbl">Rövidítés</div><input className="field" name="abbrev" defaultValue={d?.abbrev ?? ''} /></div>
        <div style={{ flex: 2 }}><div className="as-lbl">Szakterület</div><input className="field" name="specialty" defaultValue={d?.specialty ?? ''} placeholder="pl. Kardiológia" /></div>
      </div>
      <div className="as-lbl">BNO kód</div>
      <input className="field" name="bno" defaultValue={d?.bno ?? ''} placeholder="pl. I10" />
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
        <input type="checkbox" name="is_stub" defaultChecked={d?.is_stub ?? false} />
        Katalógus-tétel (stub) — „fejlesztés alatt". Vedd ki a pipát, ha az adatlap kidolgozott.
      </label>
      <div className="as-lbl">Klinikai kontextus</div>
      <select className="field" name="context_id" defaultValue={d?.context_id ?? ''}>
        <option value="">— nincs —</option>
        {CONTEXTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <div className="as-lbl">1. Röviden — mi ez?</div>
      <textarea className="as-ta" name="brief_what" rows={2} defaultValue={b.brief_what ?? ''} />
      <div className="as-lbl">1. Röviden — APN szempont</div>
      <textarea className="as-ta" name="brief_why" rows={2} defaultValue={b.brief_why ?? ''} />

      <div className="as-lbl">Epidemiológia és rizikófaktorok</div>
      <textarea className="as-ta" name="epidemiology" rows={2} defaultValue={d?.epidemiology ?? ''} />
      <div className="as-lbl">Patofiziológia</div>
      <textarea className="as-ta" name="pathophysiology" rows={2} defaultValue={d?.pathophysiology ?? ''} />

      <div className="as-lbl">2. Mikor gondolj rá? (soronként egy)</div>
      <textarea className="as-ta" name="when" rows={3} defaultValue={nl(b.when)} />
      <div className="as-lbl">3. Mit vizsgálj? (soronként egy)</div>
      <textarea className="as-ta" name="examine" rows={3} defaultValue={nl(b.examine)} />

      <div className="as-lbl">4. Releváns labor (szöveg)</div>
      <textarea className="as-ta" name="labs" rows={2} defaultValue={b.labs ?? ''} />
      <div className="as-lbl">Labor-azonosítók (vesszővel, pl. crp, hb)</div>
      <input className="field" name="lab_ids" defaultValue={j(d?.lab_ids)} />
      <div className="as-lbl">Labor blokk forrása</div>
      <input className="field" name="bs_labor" defaultValue={bs.labor ?? ''} placeholder="pl. helyi labor referencia" />

      <div className="as-lbl">5. EKG (szöveg)</div>
      <textarea className="as-ta" name="ekg" rows={2} defaultValue={b.ekg ?? ''} />
      <div className="as-lbl">EKG-azonosítók (vesszővel, pl. afib, stemi)</div>
      <input className="field" name="ekg_ids" defaultValue={j(d?.ekg_ids)} />
      <div className="as-lbl">EKG blokk forrása</div>
      <input className="field" name="bs_ekg" defaultValue={bs.ekg ?? ''} />

      <div className="as-lbl">6. Képalkotás / egyéb</div>
      <textarea className="as-ta" name="imaging" rows={2} defaultValue={b.imaging ?? ''} />

      <div className="as-lbl">7. Klinikai score-ok (szöveg)</div>
      <textarea className="as-ta" name="scores" rows={2} defaultValue={b.scores ?? ''} />
      <div className="as-lbl">Score-azonosítók (vesszővel, pl. curb65, news2)</div>
      <input className="field" name="score_ids" defaultValue={j(d?.score_ids)} />

      <div className="as-lbl">Differenciáldiagnózis (soronként „Név" vagy „Név | slug")</div>
      <textarea className="as-ta" name="ddx" rows={3} defaultValue={ddxToText(d?.ddx)} />

      <div className="as-lbl">8. 🚨 Red flag jelek (soronként egy)</div>
      <textarea className="as-ta" name="red_flags" rows={3} defaultValue={nl(b.red_flags)} />

      <div className="as-lbl">9. APN fókuszpontok (soronként egy)</div>
      <textarea className="as-ta" name="apn_focus" rows={3} defaultValue={nl(b.apn_focus)} />
      <div className="as-lbl">APN — anamnézis</div>
      <textarea className="as-ta" name="apn_anamnesis" rows={2} defaultValue={ap.anamnesis ?? ''} />
      <div className="as-lbl">APN — fizikális</div>
      <textarea className="as-ta" name="apn_physical" rows={2} defaultValue={ap.physical ?? ''} />
      <div className="as-lbl">APN — adatgyűjtés</div>
      <textarea className="as-ta" name="apn_data" rows={2} defaultValue={ap.data ?? ''} />
      <div className="as-lbl">APN — klinikai gondolkodás</div>
      <textarea className="as-ta" name="apn_thinking" rows={2} defaultValue={ap.thinking ?? ''} />
      <div className="as-lbl">APN — konzultáció</div>
      <textarea className="as-ta" name="apn_consultation" rows={2} defaultValue={ap.consultation ?? ''} />
      <div className="as-lbl">APN — eszkaláció</div>
      <textarea className="as-ta" name="apn_escalation" rows={2} defaultValue={ap.escalation ?? ''} />

      <div className="as-lbl">10. Kezelés elvei (soronként egy; ne betegspecifikus dózis)</div>
      <textarea className="as-ta" name="treatment" rows={3} defaultValue={nl(b.treatment)} />
      <div className="as-lbl">Kezelés blokk forrása</div>
      <input className="field" name="bs_kezeles" defaultValue={bs.kezeles ?? ''} />
      <div className="as-lbl">11. Gondozás / utánkövetés (soronként egy)</div>
      <textarea className="as-ta" name="followup" rows={3} defaultValue={nl(b.followup)} />

      <div className="as-lbl">Irányelv-kulcsszavak (vesszővel)</div>
      <input className="field" name="guideline_kw" defaultValue={j(d?.guideline_kw)} />

      <div className="as-lbl">Evidencia-szint</div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', margin: '4px 0 6px' }}>
        {EVID.map((e) => (
          <label key={e.v} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <input type="checkbox" name="evidence_levels" value={e.v} defaultChecked={evs.includes(e.v)} /> {e.l}
          </label>
        ))}
      </div>
      <div className="as-lbl">Validációs státusz</div>
      <select className="field" name="validation_status" defaultValue={d?.validation_status ?? ''}>
        {VALID.map((v) => <option key={v} value={v}>{v || '— (alapból a munkafolyamat szerint) —'}</option>)}
      </select>

      <div className="as-lbl">Szakmai felülvizsgálat (soronként „Név | szakterület | szerep | dátum")</div>
      <textarea className="as-ta" name="reviewers" rows={2} defaultValue={revToText(d?.reviewers)} />

      <div className="as-lbl">13. Forrás neve</div>
      <input className="field" name="source_name" defaultValue={b.source_name ?? ''} />
      <div className="as-lbl">Forrás URL</div>
      <input className="field" name="source_url" type="url" defaultValue={b.source_url ?? ''} />
      <div className="as-lbl">Bizonyíték / evidenciaszint (szöveg)</div>
      <input className="field" name="evidence" defaultValue={b.evidence ?? ''} />

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}><div className="as-lbl">Verzió</div><input className="field" name="version" defaultValue={d?.version ?? ''} /></div>
        <div style={{ flex: 1 }}><div className="as-lbl">Felülvizsgálat</div><input className="field" name="review_on" type="date" defaultValue={d?.review_on ?? ''} /></div>
        <div style={{ flex: 1 }}><div className="as-lbl">Lejárat</div><input className="field" name="expires_on" type="date" defaultValue={d?.expires_on ?? ''} /></div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
        <input type="checkbox" name="ai_generated" defaultChecked={d?.ai_generated ?? false} />
        AI-generált tartalom (nem publikálható lektorálás nélkül)
      </label>

      <button className="btn" type="submit" disabled={pending} style={{ width: '100%' }}>{pending ? 'Mentés…' : 'Mentés'}</button>
      {state.saved && <p className="form-ok">Mentve ✓ <Link href="/cms/betegsegek">Vissza a kezeléshez</Link></p>}
      {state.error && <p className="form-err">Nem sikerült menteni: {state.error}</p>}
    </form>
  )
}
