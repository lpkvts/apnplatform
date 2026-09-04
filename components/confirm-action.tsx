'use client'

import { useEffect, useRef, useState, useTransition } from 'react'

/**
 * Megerősítést kérő művelet.
 *
 * Minden visszafordíthatatlan lépés — törlés, eltávolítás, lezárás — ezen
 * keresztül fut. Egységes megjelenés és egységes viselkedés: a párbeszéd
 * megnevezi, mi fog történni, és a megerősítő gomb nem az alapértelmezett,
 * hogy a véletlen dupla koppintás ne hajtsa végre.
 *
 * A böngésző beépített megerősítője helyett saját párbeszéd, mert az
 * telepített alkalmazásban idegenül hat, és nem mondható benne el, mi
 * pontosan a következmény.
 */
export function ConfirmAction({
  onConfirm, title, message, confirmLabel = 'Törlés', children, className = 'btn ghost sm',
  ariaLabel,
}: {
  onConfirm: () => Promise<{ ok: boolean; message?: string } | void>
  /** Mit törlünk — a párbeszéd címe. */
  title: string
  /** Mi lesz a következmény. Konkrétan, nem általánosan. */
  message: string
  confirmLabel?: string
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}) {
  const [nyitva, setNyitva] = useState(false)
  const [pending, start] = useTransition()
  const [hiba, setHiba] = useState<string | null>(null)
  const megseRef = useRef<HTMLButtonElement>(null)

  // Megnyitáskor a Mégsem gombra kerül a fókusz: így az Enter nem hajtja
  // végre a műveletet, és billentyűzettel is a biztonságos út a kézenfekvő.
  useEffect(() => {
    if (nyitva) megseRef.current?.focus()
  }, [nyitva])

  useEffect(() => {
    if (!nyitva) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setNyitva(false) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [nyitva])

  const vegrehajt = () =>
    start(async () => {
      const r = await onConfirm()
      if (r && !r.ok) { setHiba(r.message ?? 'A művelet nem sikerült.'); return }
      setNyitva(false)
    })

  return (
    <>
      <button className={className} onClick={() => setNyitva(true)} aria-label={ariaLabel}>
        {children}
      </button>

      {nyitva && (
        <div className="conf-hatter" onClick={() => !pending && setNyitva(false)}>
          <div
            className="conf" role="alertdialog" aria-modal="true"
            aria-labelledby="conf-cim" aria-describedby="conf-uzenet"
            onClick={(e) => e.stopPropagation()}
          >
            <b id="conf-cim">{title}</b>
            <p id="conf-uzenet">{message}</p>

            {hiba && <div className="form-err" style={{ marginBottom: 10 }}>{hiba}</div>}

            <div className="conf-gombok">
              <button className="btn ghost" ref={megseRef} disabled={pending}
                onClick={() => setNyitva(false)}>
                Mégsem
              </button>
              <button className="btn btn-danger" disabled={pending} onClick={vegrehajt}>
                {pending ? 'Folyamatban…' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
