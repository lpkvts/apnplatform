import Link from 'next/link'
import { ClinicalDisclaimer } from '@/components/clinical-disclaimer'

const SECTIONS = [
  { href: '/betegsegtar/betegsegek', icon: '🩺', title: 'Betegségtár', sub: 'Kórképek strukturált, APN-fókuszú adatlapjai' },
  { href: '/betegsegtar/panasz', icon: '🔍', title: 'Panasz alapján', sub: 'Tünetből a lehetséges kórképek felé' },
  { href: '/betegsegtar/akut', icon: '🚨', title: 'Akut állapotok', sub: 'Gyors klinikai orientáció, vörös zászlók' },
  { href: '/klinika/labor', icon: '🧪', title: 'Labor kapcsolatok', sub: 'Laborértékek és mintázatok' },
  { href: '/klinika/ekg', icon: '🫀', title: 'EKG kapcsolatok', sub: 'EKG-atlasz és gyakorlás' },
  { href: '/klinika/tudastar', icon: '📋', title: 'Protokollok', sub: 'Irányelvek és protokollok' },
  { href: '/klinika/tudastar', icon: '📚', title: 'Források és Evidence', sub: 'Forrás, verzió, evidenciaszint' },
]

export default function KlinikaiTudastarHub() {
  return (
    <>
      <Link className="sh-back" href="/klinika">‹ Klinikai mag</Link>
      <h1 className="h1">Klinikai Tudástár</h1>
      <p className="sub">Betegségek, klinikai állapotok, tünetek és evidence-alapú szakmai tartalmak egy helyen.</p>
      <ClinicalDisclaimer />
      {SECTIONS.map((s) => (
        <Link key={s.title} className="card klink" href={s.href}>
          <div className="klink-t">{s.icon} {s.title}</div>
          <div className="sub" style={{ margin: '4px 0 0' }}>{s.sub}</div>
        </Link>
      ))}
    </>
  )
}
