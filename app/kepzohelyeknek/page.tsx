import Link from 'next/link'
import { InquiryForm } from '@/components/inquiry-form'

export const metadata = {
  title: 'Képzőhelyeknek — APN-MED',
  description: 'Az APN-képzés teljes oktatási folyamata egy platformon: kurzusok, '
    + 'klinikai esetek, feladatok, csoportelemzés és oktatótermi használat.',
}

const MIT = [
  {
    cim: 'Kurzusok és csoportok',
    szoveg: 'Saját kurzusstruktúra célkompetenciákkal, csoportbeosztással és '
      + 'beiratkozás-kezeléssel. Az intézmény adatai elkülönülnek a többi képzőhelyétől.',
  },
  {
    cim: 'Klinikai esetek és tananyagok',
    szoveg: 'Esetek betegadatokkal, leletekkel és kérdéssel. Minden tananyag összeköthető '
      + 'a platform klinikai eszközeivel — a hallgató ugyanazt használja, mint a napi munkában.',
  },
  {
    cim: 'Feladatok és automatikus értékelés',
    szoveg: 'Feladatlapok négyféle kérdéstípussal, határidővel és teljesítési küszöbbel. '
      + 'A pontozás automatikus, az oktató szöveges visszajelzést írhat mellé.',
  },
  {
    cim: 'Csoportelemzés',
    szoveg: 'Kompetenciánkénti, kérdésenkénti és hallgatónkénti bontás. Megmutatja, mely '
      + 'szakmai területen áll gyengén a csoport, és ki maradt le.',
  },
  {
    cim: 'Oktatótermi használat',
    szoveg: 'Klinikai eset kivetíthető teljes képernyőn, nagyobb betűvel, és onnan egy '
      + 'kattintással megnyitható a hozzá tartozó pontozó.',
  },
  {
    cim: 'Ugyanaz a platform',
    szoveg: 'A hallgató ugyanazt az alkalmazást használja a tanuláshoz, amit később az '
      + 'ágy mellett is — nem kell külön rendszert megtanulnia.',
  },
]

export default function KepzohelyeknekPage() {
  return (
    <>
      <Link className="sh-back" href="/">‹ Vissza a nyitóoldalra</Link>

      <h1 className="h1">APN-MED Education</h1>
      <p className="sub" style={{ fontSize: 15 }}>
        Az APN-képzés teljes oktatási folyamata egyetlen platformon.
      </p>

      <div className="card">
        <p style={{ margin: 0, fontSize: 'var(--t-body)', lineHeight: 1.65 }}>
          A képzőhely saját oktatási teret kap az APN-MED-en belül: kurzusokat hoz létre,
          hallgatókat irat be, klinikai eseteket és feladatokat oszt ki, és követi az
          eredményeket. A klinikai modulok — pontozók, vérgáz, EKG, betegségtár — ugyanazok,
          amelyeket a hallgató a gyakorlaton is használ.
        </p>
      </div>

      <div className="sec-h"><span className="sec-t">Mit tartalmaz</span></div>
      <div className="lst">
        {MIT.map((m) => (
          <div className="lst-sor" key={m.cim} style={{ cursor: 'default', alignItems: 'flex-start' }}>
            <span className="lst-fo">
              <b>{m.cim}</b>
              <span style={{ fontSize: 'var(--t-small)', lineHeight: 1.55, marginTop: 4 }}>
                {m.szoveg}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="sec-h"><span className="sec-t">Érdeklődés</span></div>
      <p className="sub">
        Írd meg, milyen képzésről van szó, és néhány napon belül keresünk.
      </p>
      <InquiryForm />

      <div className="safety-note" style={{ marginTop: 14 }}>
        <b>ⓘ Az APN-MED szakmai platform.</b> Az oktatási réteg a meglévő klinikai
        tartalomra épül, nem helyettesíti a képzési követelményeket és a gyakorlati
        oktatást.
      </div>
    </>
  )
}
