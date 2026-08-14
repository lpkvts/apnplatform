import type { ReactNode } from 'react'

// Egységes biztonsági jelzés — döntéstámogatás, nem diagnózis.
export function SafetyNote() {
  return (
    <div className="safety-note">
      <b>🛡️ Biztonsági jelzés.</b> Ez döntéstámogatás, nem diagnózis. Segíti, de nem
      helyettesíti a klinikai megítélést; a döntés végső felelőssége a megfelelő
      szakemberé. Sürgős állapot gyanújánál azonnali szakmai/orvosi értékelés szükséges.
    </div>
  )
}

// Sürgősségi kiemelés
export function UrgencyBanner({ children }: { children?: ReactNode }) {
  return (
    <div className="urgency-flag">
      ⚠ Sürgősségi jelzés — {children ?? 'azonnali szakmai/orvosi értékelés mérlegelendő.'}
    </div>
  )
}

// Strukturált döntéstámogató szakaszok (Tény / Forrás / Értelmezés / Döntéstámogatás / Bizonytalanság)
const SECTION_META: { key: string; label: string; cls: string }[] = [
  { key: 'tony', label: 'Tény', cls: 'sl-fact' },
  { key: 'forras', label: 'Forrás', cls: 'sl-source' },
  { key: 'ertelmezes', label: 'Értelmezés', cls: 'sl-interp' },
  { key: 'dontes', label: 'Döntéstámogatás', cls: 'sl-decide' },
  { key: 'bizonytalansag', label: 'Bizonytalanság', cls: 'sl-uncertain' },
]

export function StructuredAnswer({ sections }: { sections: Record<string, string> }) {
  return (
    <div className="sl-wrap">
      {SECTION_META.filter((m) => sections[m.key]?.trim()).map((m) => (
        <div className={`sl-block ${m.cls}`} key={m.key}>
          <span className="sl-label">{m.label}</span>
          <div className="sl-body">{sections[m.key]}</div>
        </div>
      ))}
    </div>
  )
}

// Címkézett szakaszok kinyerése a modell szövegéből
export function parseSections(text: string): Record<string, string> | null {
  const defs: { k: string; re: RegExp }[] = [
    { k: 'tony', re: /T[ÉE]NY\s*:/i },
    { k: 'forras', re: /FORR[ÁA]S\s*:/i },
    { k: 'ertelmezes', re: /[ÉE]RTELMEZ[ÉE]S\s*:/i },
    { k: 'dontes', re: /D[ÖO]NT[ÉE]ST[ÁA]MOGAT[ÁA]S\s*:/i },
    { k: 'bizonytalansag', re: /BIZONYTALANS[ÁA]G\s*:/i },
  ]
  const found: { k: string; i: number; len: number }[] = []
  for (const d of defs) {
    const m = text.match(d.re)
    if (m && m.index != null) found.push({ k: d.k, i: m.index, len: m[0].length })
  }
  if (found.length === 0) return null
  found.sort((a, b) => a.i - b.i)
  const out: Record<string, string> = {}
  for (let j = 0; j < found.length; j++) {
    const start = found[j].i + found[j].len
    const end = j + 1 < found.length ? found[j + 1].i : text.length
    out[found[j].k] = text.slice(start, end).trim()
  }
  return out
}
