import Link from 'next/link'
import { ClinicalDisclaimer } from '@/components/clinical-disclaimer'

const ACUTE = [
  'Mellkasi fájdalom', 'Akut dyspnoe', 'Akut hasi fájdalom', 'Eszméletvesztés', 'Tudatzavar',
  'Akut gyengeség', 'Szédülés', 'Palpitáció', 'Láz', 'Hypotensio', 'Shock', 'Akut vérzés',
  'Gastrointestinalis vérzés', 'Haemoptoe', 'Akut oedema', 'Cyanosis', 'Akut fájdalom',
  'Hirtelen neurológiai tünet', 'Akut zavartság', 'Ismeretlen eredetű akut állapotromlás',
]

export default function AkutPage() {
  return (
    <>
      <Link className="sh-back" href="/betegsegtar">‹ Klinikai Tudástár</Link>
      <h1 className="h1">Akut állapotok</h1>
      <p className="sub">Gyors klinikai orientáció: első felismerés, vörös zászlók, elsődleges vizsgálatok, DDx, APN-teendők, eszkaláció.</p>
      <div className="card"><p style={{ margin: 0 }}>Az akut állapotok részletes, egységes adatlapjai (első felismerés · 🚨 vörös zászlók · elsődleges vizsgálatok · differenciáldiagnózis · kapcsolódó Labor/EKG/protokoll · APN-teendők · eszkaláció) a következő fejlesztési lépésben épülnek be.</p></div>
      <div className="sec-h"><span className="sec-t">Tervezett akut állapotok</span></div>
      {ACUTE.map((a) => (
        <div key={a} className="sh-row" style={{ cursor: 'default' }}>
          <span className="sh-row-main"><span className="sh-row-name">{a}</span><span className="sh-row-sub">Tartalom fejlesztés alatt</span></span>
          <span className="ekg-sev sev-mid">⚪</span>
        </div>
      ))}
      <ClinicalDisclaimer />
    </>
  )
}
