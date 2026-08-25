import Link from 'next/link'
import { RingLogo } from '@/components/icons'

const FEATURES = [
  { icon: '🩺', title: 'Klinikai támogatás', text: 'Betegvizsgálat, labordiagnosztika, EKG, score-ok és betegségtár a mindennapi döntésekhez.' },
  { icon: '📖', title: 'Tudásbázis', text: 'Bizonyítékokon alapuló szakmai tartalmak, irányelvek és protokollok.' },
  { icon: '📈', title: 'Folyamatos fejlődés', text: 'Kompetenciák, CPD, tanulási útvonalak és személyre szabott célok.' },
  { icon: '🤝', title: 'Mentorprogram', text: 'Személyes mentorálás, esetmegbeszélések és fejlődési napló.' },
  { icon: '🎓', title: 'Egyetemeknek', text: 'Oktatási felület, tananyagok, hallgatói csoportok és előrehaladás követése.' },
  { icon: '🛡️', title: 'Biztonság', text: 'Adatvédelem és szakmai hitelesség az első helyen, magyar fejlesztés.' },
]

const AUDIENCE = [
  { icon: '🧑\u200d🎓', title: 'APN hallgatóknak', text: 'Tanulj hatékonyabban strukturált tananyagokkal és klinikai esetekkel.' },
  { icon: '👩\u200d⚕️', title: 'Gyakorló APN-eknek', text: 'Támogasd a mindennapi munkád bizonyítékokon alapuló eszközökkel és gyors eléréssel.' },
  { icon: '👥', title: 'Mentoroknak', text: 'Kísérd végig mentoráltjaidat strukturált folyamatokkal és digitális eszközökkel.' },
  { icon: '🏛️', title: 'Egyetemeknek', text: 'Modern oktatási környezet hallgatóid számára, saját tartalmakkal és nyomon követéssel.' },
]

const MODULES = [
  { title: 'Score Hub', items: ['CURB-65 – pneumonia súlyosság', 'Wells score – thrombosis', 'NEWS2 – korai figyelmeztetés'], link: 'Összes score', href: '/klinika/tesztek' },
  { title: 'Betegségtár', items: ['COPD – krónikus légúti betegség', 'Diabetes mellitus', 'Szívelégtelenség'], link: 'Összes betegség', href: '/betegsegtar' },
  { title: 'Betegvizsgálat', items: ['Strukturált, vezetett vizsgálat', 'Általános állapotfelmérés', 'Szervrendszeri vizsgálatok'], link: 'Összes vizsgálat', href: '/klinika/vizsgalat' },
  { title: 'Fejlődés', items: ['Kompetenciák és CPD', 'Tanulási útvonalak', 'Szakmai portfólió'], link: 'Megnyitás', href: '/fejlodes' },
  { title: 'Tudástár', items: ['Dyspnoe kivizsgálása', 'Akut állapotok', 'Sürgősségi algoritmusok'], link: 'Összes tartalom', href: '/tudastar' },
]

export function Landing() {
  return (
    <div className="lp">
      {/* Fejléc */}
      <header className="lp-nav">
        <div className="lp-wrap lp-nav-inner">
          <Link href="/" className="lp-brand">
            <RingLogo size={30} />
            <span className="lp-brand-txt"><b>APN</b><span>HUNGARY PLATFORM</span></span>
          </Link>
          <nav className="lp-nav-links">
            <a href="#top">Főoldal</a>
            <a href="#funkciok">Funkciók</a>
            <a href="#kinek">Kinek szól</a>
            <a href="#modulok">Modulok</a>
          </nav>
          <div className="lp-nav-cta">
            <Link href="/login" className="lp-btn ghost">Bejelentkezés</Link>
            <Link href="/login" className="lp-btn">Regisztráció</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="lp-hero lp-wrap" id="top">
        <div className="lp-hero-text">
          <h1>Az APN szakemberek <span>digitális szakmai</span> otthona.</h1>
          <p className="lp-lead">Klinikai tudás, folyamatos fejlődés és kapcsolódás – egy platformon.</p>
          <div className="lp-hero-cta">
            <Link href="/login" className="lp-btn lg">Regisztrálok ingyen →</Link>
            <a href="#modulok" className="lp-btn ghost lg">Megnézem a bemutatót</a>
          </div>
          <div className="lp-stats">
            <div><b>1000+</b><span>APN szakember</span></div>
            <div><b>10+</b><span>Egyetemi partner</span></div>
            <div><b>Országos</b><span>mentorhálózat</span></div>
          </div>
        </div>
        <div className="lp-hero-visual">
          <div className="lp-mock">
            <div className="lp-mock-top">Betegvizsgálat</div>
            <div className="lp-mock-row">Általános állapot felmérése ›</div>
            <div className="lp-mock-row">Vitális paraméterek ›</div>
            <div className="lp-mock-row">Kardiovaszkuláris vizsgálat ›</div>
            <div className="lp-mock-row">Neurológiai vizsgálat ›</div>
            <div className="lp-mock-grid"><span>🩺</span><span>🧪</span><span>📈</span><span>🧮</span></div>
          </div>
          <div className="lp-badge">Egy platform.<br /><b>Végtelen szakmai lehetőség.</b></div>
        </div>
      </section>

      {/* Funkció-sáv */}
      <section className="lp-features" id="funkciok">
        <div className="lp-wrap lp-feat-grid">
          {FEATURES.map((f) => (
            <div className="lp-feat" key={f.title}>
              <div className="lp-feat-i">{f.icon}</div>
              <b>{f.title}</b>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kinek szól */}
      <section className="lp-wrap lp-section" id="kinek">
        <h2 className="lp-h2">Kinek szól az APN Hungary Platform?</h2>
        <div className="lp-aud-grid">
          {AUDIENCE.map((a) => (
            <div className="lp-card" key={a.title}>
              <div className="lp-aud-i">{a.icon}</div>
              <b>{a.title}</b>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Főbb modulok */}
      <section className="lp-wrap lp-section" id="modulok">
        <h2 className="lp-h2">Főbb modulok</h2>
        <div className="lp-mod-grid">
          {MODULES.map((m) => (
            <div className="lp-card lp-mod" key={m.title}>
              <b className="lp-mod-t">{m.title}</b>
              <ul>{m.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
              <Link href={m.href} className="lp-mod-link">{m.link} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Vélemény (szerkeszthető minta) */}
      <section className="lp-wrap">
        <div className="lp-quote">
          <div className="lp-quote-mark">”</div>
          <p>Az APN Hungary Platform nélkülözhetetlen része a mindennapi munkánknak és a szakmai fejlődésünknek.</p>
          <div className="lp-quote-author"><b>APN szakápoló</b><span>gyakorló Advanced Practice Nurse</span></div>
        </div>
      </section>

      {/* Záró CTA */}
      <section className="lp-final">
        <div className="lp-wrap lp-final-inner">
          <div className="lp-final-head">
            <h2>Csatlakozz az ország legnagyobb APN szakmai közösségéhez!</h2>
            <p>Kezdd el még ma a szakmai fejlődésedet.</p>
          </div>
          <div className="lp-final-bullets">
            <div>✅ Egyszerű regisztráció<span>2 perc alatt elindíthatod</span></div>
            <div>📱 Bármikor, bárhol elérhető<span>Mobilon és weben</span></div>
            <div>📚 Folyamatosan bővülő tartalom<span>Szakértői támogatással</span></div>
          </div>
          <div className="lp-final-cta">
            <Link href="/login" className="lp-btn light lg">Regisztráció ingyen →</Link>
            <a href="#funkciok" className="lp-btn outline-light lg">További információ</a>
          </div>
        </div>
      </section>

      {/* Lábléc */}
      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-inner">
          <span>© {new Date().getFullYear()} APN Hungary Platform</span>
          <Link href="/login">Belépés</Link>
        </div>
      </footer>
    </div>
  )
}
