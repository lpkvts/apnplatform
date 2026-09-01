import Link from 'next/link'
import { RingLogo } from '@/components/icons'
import { InstallPrompt } from '@/components/install-prompt'
import { LandingGraphic } from '@/components/landing-graphic'

/**
 * Nyitóoldal kijelentkezett látogatóknak.
 *
 * A platform saját design tokenjeire épül (app/globals.css :root), nem külön
 * palettára — így a nyitóoldal és a belépés utáni felület egy rendszernek
 * látszik. A modulkártyák a valódi modul-akcentusokat kapják: ugyanaz a szín
 * jelöli itt a Klinikumot, mint odabent a Labor csempéjét.
 */

const FEATURES = [
  {
    icon: '🩺', accent: 'var(--brand-3)', tint: 'var(--brand-tint)',
    title: 'Klinikum', href: '/klinika',
    text: 'Betegvizsgálat, labor, EKG, klinikai skálák és betegségtár a mindennapi döntésekhez.',
  },
  {
    icon: '📖', accent: 'var(--acc-vizsgalat)', tint: '#EFE9FB',
    title: 'Tudástár', href: '/klinika/tudastar',
    text: 'Szakmai irányelvek és protokollok egy keresőben, forrásjegyzékkel és verziókövetéssel.',
  },
  {
    icon: '📈', accent: 'var(--acc-ekg)', tint: '#FDEEDF',
    title: 'Fejlődés', href: '/fejlodes',
    text: 'Személyes fejlődési út, kompetenciák, továbbképzési pontok és szakmai célok.',
  },
  {
    icon: '👤', accent: 'var(--acc-betegsegtar)', tint: '#E4EEF9',
    title: 'Profil', href: '/profil',
    text: 'A szakmai identitásod és a fejlődési történeted egyetlen helyen.',
  },
]

const PATH = [
  { icon: '🔑', title: 'Belépés', text: 'Hozd létre a profilod és ismerd meg a lehetőségeket.' },
  { icon: '📚', title: 'Tanulás', text: 'Fedezz fel új tudást és fejleszd magad folyamatosan.' },
  { icon: '🩻', title: 'Gyakorlat', text: 'Alkalmazd a tudást a mindennapi munkádban.' },
  { icon: '📊', title: 'Fejlődés', text: 'Érj el mérföldköveket és kövesd az előrehaladásod.' },
  { icon: '🤝', title: 'Mentorálás', text: 'Kapj támogatást és támogass másokat.' },
  { icon: '🎯', title: 'Szakmai profil', text: 'Építs erős szakmai identitást és jövőképet.' },
]

const AUDIENCE = [
  { icon: '🌱', accent: 'var(--brand-3)', tint: 'var(--brand-tint)', title: 'Pályakezdőknek', text: 'Akik strukturáltan szeretnének elindulni és magabiztos alapokat építeni.' },
  { icon: '🚀', accent: 'var(--acc-vizsgalat)', tint: '#EFE9FB', title: 'Gyakorló APN-eknek', text: 'Akik tudatosan építik a szakmai útjukat és új szintre emelnék a tudásukat.' },
  { icon: '👥', accent: 'var(--acc-ekg)', tint: '#FDEEDF', title: 'Mentoroknak és oktatóknak', text: 'Akik támogatni szeretnének, megosztani a tapasztalatot és közösséget építeni.' },
]

/** Kicsinyített felületmakett — HTML-ből rajzolva, hogy minden méretben éles legyen. */
function DeskShot() {
  return (
    <div className="lp-shot lp-desk" aria-hidden="true">
      <div className="lp-side">
        <div className="lp-side-logo"><i />APN-MED</div>
        <span className="lp-si on"><i />Kezdőlap</span>
        <span className="lp-si"><i />Klinikai mag</span>
        <span className="lp-si"><i />Tudástár</span>
        <span className="lp-si"><i />Fejlődés</span>
      </div>
      <div className="lp-body">
        <div className="lp-top">
          <div><b>Üdvözlünk, Anna!</b><small>Örülünk, hogy itt vagy az APN-MED-ben.</small></div>
          <div className="lp-icons"><i /><i /><i className="av" /></div>
        </div>
        <p className="lp-lbl">Mai áttekintés</p>
        <div className="lp-row3">
          <div className="lp-mini"><span className="lp-dot lp-d1" /><b>Klinikai eszköz</b><small>3 új frissítés</small></div>
          <div className="lp-mini"><span className="lp-dot lp-d2" /><b>Tudástár</b><small>2 új tartalom</small></div>
          <div className="lp-mini"><span className="lp-dot lp-d3" /><b>Következő lépés</b><small>Mentor találkozó</small></div>
        </div>
        <div className="lp-mcard">
          <div className="lp-mcard-h"><b>Fejlődési út</b><span className="lp-pill">Részletek</span></div>
          <small>Haladásod ezen a héten</small>
          <div className="lp-bar"><span style={{ width: '72%' }} /></div>
          <span className="lp-pct">72%</span>
        </div>
        <div className="lp-mcard">
          <b>Legutóbbi tevékenységek</b>
          <div className="lp-act"><span className="lp-dot lp-d1" />Kompetencia értékelés kitöltve<em>Tegnap 14:32</em></div>
          <div className="lp-act"><span className="lp-dot lp-d2" />Új tartalom a Tudástárban<em>Tegnap 10:15</em></div>
          <div className="lp-act"><span className="lp-dot lp-d4" />Mentor üzenet érkezett<em>Aug. 19. 09:45</em></div>
        </div>
      </div>
    </div>
  )
}

export function Landing() {
  return (
    <div className="lp">
      {/* ── Fejléc ── */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <Link href="/" className="lp-brand">
            <RingLogo size={30} />
            <span className="lp-brand-txt"><b>APN-MED</b><span>SZAKMAI PLATFORM</span></span>
          </Link>
          <nav className="lp-nav-links">
            <a href="#funkciok">Funkciók</a>
            <a href="#ut">Szakmai út</a>
            <a href="#kompetencia">Kompetenciatérkép</a>
            <a href="#mentor">Mentorprogram</a>
            <a href="#kinek">Kinek készült</a>
          </nav>
          <Link className="lp-btn lp-btn-primary" href="/login">
            Belépés a platformra <span className="lp-arw">→</span>
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="lp-hero">
        <span className="lp-blob lp-blob-a" aria-hidden="true" />
        <span className="lp-blob lp-blob-b" aria-hidden="true" />
        <div className="lp-wrap lp-hero-in">
          <div>
            <p className="lp-eyebrow">APN-MED – Egészségügyi szakemberek szakmai platformja</p>
            <h1 className="lp-h1">
              A <span className="lp-accent">kiterjesztett</span><br />
              szakmai tudás<br />
              platformja.
            </h1>
            <p className="lp-lead">
              Digitális tér az egészségügyi szakemberek fejlődéséhez – klinikai tudással,
              szakmai irányelvekkel, mentorálással és személyes fejlődési úttal.
            </p>
            <div className="lp-hero-cta">
              <Link className="lp-btn lp-btn-primary" href="/login">
                Belépés a platformra <span className="lp-arw">→</span>
              </Link>
              <a className="lp-btn lp-btn-ghost" href="#funkciok">Ismerd meg az APN-MED-et</a>
            </div>
            <p className="lp-assure">✓ Ápolók fejlesztik, a klinikai gyakorlatból. Magyar fejlesztés.</p>
          </div>

          <LandingGraphic />
        </div>
      </section>

      {/* ── Funkciók ── */}
      <section className="lp-sec" id="funkciok">
        <div className="lp-wrap">
          <p className="lp-eyebrow c">Mit találsz az APN-MED-ben?</p>
          <div className="lp-g4">
            {FEATURES.map((f) => (
              <article className="lp-card" key={f.title}>
                <span className="lp-ic" style={{ background: f.tint, color: f.accent }}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <Link className="lp-more" href="/login">Tovább <span className="lp-arw">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Szakmai út ── */}
      <section className="lp-sec lp-sec-tint" id="ut">
        <div className="lp-wrap lp-path-in">
          <div>
            <p className="lp-eyebrow">A te szakmai utad</p>
            <p className="lp-path-txt">
              Az APN-MED végigkísér a szakmai utadon – a belépéstől a fejlődésen át a mentorálásig.
            </p>
          </div>
          <ol className="lp-path">
            {PATH.map((s) => (
              <li key={s.title}>
                <span className="lp-node">{s.icon}</span>
                <b>{s.title}</b>
                <small>{s.text}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Kompetenciatérkép ── */}
      <section className="lp-sec lp-sec-soft" id="kompetencia">
        <div className="lp-wrap">
          <p className="lp-eyebrow c">Mérföldkő a szakmában</p>
          <div className="lp-kt">
            <div className="lp-kt-txt">
              <h2 className="lp-h2">APN Kompetenciatérkép</h2>
              <p>
                2025 áprilisában hatályba lépett a szakdolgozói kompetenciák
                keretrendszere. Először van egységes, jogszabályi válasz arra, mit
                végezhet a kiterjesztett hatáskörű ápoló önállóan, és mihez kell
                orvosi együttműködés.
              </p>
              <p>
                A platformon mind a <b>274 tevékenység</b> megtalálható, a hozzá tartozó
                szinttel — kereshetően, tevékenységi csoportok szerint, és összevetve
                az általános ápolói szintekkel.
              </p>
              <Link className="lp-btn lp-btn-primary" href="/login">
                Megnézem a térképet <span className="lp-arw">→</span>
              </Link>
            </div>

            <ol className="lp-kt-levels">
              {[
                { n: 'I', t: 'Önállóan', d: 'Saját indikáció alapján', c: 174, col: '#22A878' },
                { n: 'II', t: 'Szupervízió mellett', d: 'Utólagos tájékoztatással', c: 74, col: '#0891B2' },
                { n: 'III', t: 'Orvosi indikáció után', d: 'Utána önálló végrehajtás', c: 19, col: '#B45309' },
                { n: 'IV', t: 'Orvosi irányítás mellett', d: 'Személyes jelenléttel', c: 7, col: '#B91C1C' },
              ].map((l) => (
                <li key={l.n} style={{ borderLeftColor: l.col }}>
                  <span className="lp-kt-n" style={{ background: l.col }}>{l.n}</span>
                  <span className="lp-kt-l">
                    <b>{l.t}</b>
                    <small>{l.d}</small>
                  </span>
                  <span className="lp-kt-c" style={{ color: l.col }}>{l.c}</span>
                </li>
              ))}
            </ol>
          </div>

          <p className="lp-kt-src">
            Forrás: 13/2025. (IV. 17.) BM rendelet az egészségügyi szakdolgozói kompetenciák
            keretrendszeréről. A tartalom edukációs célú összefoglaló, nem helyettesíti a
            hatályos jogszabályok ismeretét.
          </p>
        </div>
      </section>

      {/* ── Mentorprogram ── */}
      <section className="lp-sec" id="mentor">
        <div className="lp-wrap">
          <div className="lp-mentor">
            <div>
              <span className="lp-soon">Hamarosan</span>
              <p className="lp-eyebrow on-dark" style={{ marginTop: 10 }}>APN-MED Mentorprogram</p>
              <h2 className="lp-h2 lp-on-dark">Nem kell egyedül<br />végigmenni az úton.</h2>
              <p className="lp-mentor-lead">
                Mentorprogram fejlesztés alatt: mentorválasztás, közös célok és
                fejlődéskövetés. A platform többi része már most használható.
              </p>
            </div>

            <div className="lp-pair">
              <article className="lp-pcard">
                <p className="lp-role">Mentor</p>
                <div className="lp-phead">
                  <span className="lp-ava lp-ava-1" aria-hidden="true">👩‍⚕️</span>
                  <div><b>Gyakorlott APN</b><small>Intenzív terápia</small></div>
                </div>
                <p className="lp-plbl">Amiben támogat</p>
                <ul className="lp-plist">
                  <li>Klinikai döntéshozatal</li>
                  <li>Komplex esetek átbeszélése</li>
                </ul>
              </article>

              <span className="lp-link-i" aria-hidden="true">🤝</span>

              <article className="lp-pcard">
                <p className="lp-role">Mentorált</p>
                <div className="lp-phead">
                  <span className="lp-ava lp-ava-2" aria-hidden="true">🧑‍⚕️</span>
                  <div><b>Pályakezdő APN</b><small>Első önálló év</small></div>
                </div>
                <p className="lp-plbl">Fejlődési célok</p>
                <ul className="lp-plist">
                  <li>Kritikus állapotok felismerése</li>
                  <li>Strukturált betegvizsgálat</li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kinek készült ── */}
      <section className="lp-sec lp-sec-soft" id="kinek">
        <div className="lp-wrap">
          <p className="lp-eyebrow c">Kinek készült az APN-MED?</p>
          <div className="lp-aud">
            {AUDIENCE.map((a) => (
              <div className="lp-aud-i" key={a.title}>
                <span className="lp-ic sm" style={{ background: a.tint, color: a.accent }}>{a.icon}</span>
                <div>
                  <b>{a.title}</b>
                  <span>{a.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Telepítés — a komponens hozza a saját szakaszát, hogy telepített
             állapotban nyomtalanul el tudjon tűnni ── */}
      <InstallPrompt variant="inline" />

      {/* ── Záró ── */}
      <section className="lp-final">
        <span className="lp-dots" aria-hidden="true" />
        <div className="lp-wrap lp-final-in">
          <h2 className="lp-h2 lp-on-dark lp-final-h">
            A szakmai fejlődés nem egy dokumentum,<br />
            <span className="lp-accent">hanem egy folyamatos út.</span>
          </h2>
          <Link className="lp-btn lp-btn-white" href="/login">
            Belépés a platformra <span className="lp-arw">→</span>
          </Link>
          <nav className="lp-foot-nav">
            <a href="#funkciok">Klinikum</a><span aria-hidden="true">·</span>
            <a href="#funkciok">Tudástár</a><span aria-hidden="true">·</span>
            <a href="#ut">Fejlődés</a><span aria-hidden="true">·</span>
            <a href="#kinek">Közösség</a>
          </nav>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <p>© {new Date().getFullYear()} APN-MED</p>
          <p className="lp-footer-note">
            Szakmai és oktatási célú platform. Nem helyettesíti az orvosi döntést vagy az intézményi protokollt.
          </p>
        </div>
      </footer>
    </div>
  )
}
