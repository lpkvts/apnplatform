'use client'

import Link from 'next/link'
import { ConfirmAction } from '@/components/confirm-action'
import { deleteExam, deleteCase } from '@/lib/actions/resume'

export interface ResumeItem {
  kind: 'exam' | 'case'
  id: string
  href: string
  title: string
  sub: string
}

/**
 * Folytasd, ahol abbahagytad.
 *
 * A félbehagyott munka gyűlik: ami már nem kell, innen közvetlenül
 * eltávolítható. A törlés megerősítést kér, mert az adat véglegesen elvész.
 */
export function ResumeList({ items }: { items: ResumeItem[] }) {
  if (items.length === 0) return null

  return (
    <>
      <div className="sec-h"><span className="sec-t">Folytasd, ahol abbahagytad</span></div>
      <div className="lst">
        {items.map((r) => (
          <div className="lst-sor" key={r.id} style={{ cursor: 'default' }}>
            <Link href={r.href} className="lst-fo" style={{ textDecoration: 'none', color: 'inherit' }}>
              <b>{r.title}</b>
              <span>{r.sub}</span>
            </Link>
            <span className="lst-veg">
              <ConfirmAction
                className="icon-btn-sm"
                ariaLabel={`${r.title} törlése`}
                title={r.kind === 'exam' ? 'Vizsgálat törlése' : 'Klinikai eset törlése'}
                message={
                  r.kind === 'exam'
                    ? `A(z) „${r.title}" vizsgálat és a hozzá rögzített adatok véglegesen törlődnek. Ez nem vonható vissza.`
                    : `A(z) „${r.title}" eset és a hozzá tartozó laborok, EKG-k, pontszámok és utánkövetések véglegesen törlődnek. Ez nem vonható vissza.`
                }
                onConfirm={() => (r.kind === 'exam' ? deleteExam(r.id) : deleteCase(r.id))}
              >
                ✕
              </ConfirmAction>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
