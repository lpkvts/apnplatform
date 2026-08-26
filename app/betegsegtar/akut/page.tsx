import Link from 'next/link'
import { ClinicalDisclaimer } from '@/components/clinical-disclaimer'
import { ACUTE } from '@/lib/clinical/acute'
import { topicForAcuteName } from '@/lib/topics/data'

export default function AkutPage() {
  return (
    <>
      <Link className="sh-back" href="/betegsegtar">‹ Betegségtár</Link>
      <h1 className="h1">Akut állapotok</h1>
      <p className="sub">Gyors klinikai orientáció: első felismerés, red flag jelek, elsődleges vizsgálatok, DDx, APN-teendők, eszkaláció.</p>
      <div className="sec-h"><span className="sec-t">Akut állapotok</span></div>
      {ACUTE.map((a) => {
        const t = topicForAcuteName(a)
        if (t) {
          return (
            <Link key={a} className="sh-row" href={`/betegsegtar/akut/${t.slug}`}>
              <span className="sh-row-main"><span className="sh-row-name">{t.icon} {a}</span><span className="sh-row-sub">Részletes akut adatlap</span></span>
              <span className="sh-chev">›</span>
            </Link>
          )
        }
        return (
          <div key={a} className="sh-row" style={{ cursor: 'default' }}>
            <span className="sh-row-main"><span className="sh-row-name">{a}</span><span className="sh-row-sub">Tartalom fejlesztés alatt</span></span>
            <span className="ekg-sev sev-mid">⚪</span>
          </div>
        )
      })}
      <ClinicalDisclaimer />
    </>
  )
}
