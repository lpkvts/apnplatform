'use client'

import { leletSorok, leletFejlec, nyil, formaz, CSOPORT_LABEL, type Sor } from '@/lib/vergaz/lelet'
import type { Values, Sample } from '@/lib/vergaz/data'

/**
 * Vérgázlelet — úgy megjelenítve, ahogy a készülék kiadja.
 *
 * A vezetett elemzés során a `kiemelt` lépéshez tartozó sorok világítanak,
 * a többi elhalványul. Ez ugyanaz az elv, mint az EKG-elemzésben: az adott
 * kérdéshez tartozó rész kerül előtérbe, hogy a szem oda találjon.
 */
export function VergazLelet({
  values, sample, kiemelt, onSorClick,
}: {
  values: Values
  sample: Sample
  /** Az aktuális elemzési lépés azonosítója, vagy null. */
  kiemelt?: string | null
  onSorClick?: (fogalom: string) => void
}) {
  const csoportok = leletSorok(values, sample)
  const fejlec = leletFejlec(values, sample)
  const vanKiemeles = !!kiemelt

  return (
    <div className="lel">
      <div className="lel-fej">
        <b>Vérgáz vizsgálat</b>
        <div className="lel-meta">
          {fejlec.map((f) => (
            <span key={f.cimke}><i>{f.cimke}</i> {f.ertek}</span>
          ))}
        </div>
      </div>

      {csoportok.map((cs) => {
        const sorok = cs.sorok.filter((s) => s.ertek != null)
        if (sorok.length === 0) return null
        return (
          <div className="lel-cs" key={cs.csoport}>
            <div className="lel-cs-t">{CSOPORT_LABEL[cs.csoport]}</div>
            {sorok.map((s) => {
              const jel = nyil(s)
              const eltero = jel !== ''
              const most = vanKiemeles && (s.lepes ?? []).includes(kiemelt!)
              const halvany = vanKiemeles && !most
              return (
                <button
                  key={s.jel}
                  className={`lel-sor ${eltero ? 'el' : ''} ${most ? 'most' : ''} ${halvany ? 'halvany' : ''}`}
                  onClick={() => s.fogalom && onSorClick?.(s.fogalom)}
                  disabled={!s.fogalom || !onSorClick}
                  title={s.nev}
                >
                  <span className="lel-jel">{s.jel}</span>
                  <span className="lel-ert">
                    {formaz(s)}
                    {jel && <i className={jel === '↑' ? 'up' : 'down'}>{jel}</i>}
                  </span>
                  <span className="lel-egys">{s.egyseg}</span>
                  <span className="lel-ref">{s.low}–{s.high}</span>
                </button>
              )
            })}
          </div>
        )
      })}

      <p className="lel-lab">
        A számított értékeket a rendszer a megadott adatokból vezeti le. A tényleges
        készülékek eltérő tételeket is megadhatnak.
      </p>
    </div>
  )
}
