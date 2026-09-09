'use client'

import Link from 'next/link'
import { ConfirmAction } from '@/components/confirm-action'
import { deleteExam } from '@/lib/actions/resume'

export interface MunkamenetSor {
  id: string
  title: string
  mode: string
  status: string
  updated_at: string
}

/**
 * Vizsgálati munkamenetek listája, törlési lehetőséggel.
 *
 * A félbehagyott munkamenetek gyűlnek: aki napi több beteget vizsgál, hamar
 * eljut oda, hogy a lista áttekinthetetlen. A törlés ugyanazon a megerősítő
 * párbeszéden fut, mint a platform többi visszafordíthatatlan művelete.
 */
export function MunkamenetLista({
  items, modeBadge,
}: {
  items: MunkamenetSor[]
  modeBadge: Record<string, string>
}) {
  if (items.length === 0) return null

  return (
    <>
      <div className="sec-h"><span className="sec-t">Folyamatban lévő munkameneteim</span></div>
      <div className="lst">
        {items.map((r) => (
          <div className="lst-sor" key={r.id} style={{ cursor: 'default' }}>
            <Link href={`/klinika/vizsgalat/${r.id}`} className="lst-fo"
              style={{ textDecoration: 'none', color: 'inherit' }}>
              <b>{r.title}</b>
              <span>
                {modeBadge[r.mode] ?? r.mode}
                {' · '}{new Date(r.updated_at).toLocaleDateString('hu-HU')}
                {r.status === 'completed' && ' · lezárt'}
              </span>
            </Link>
            <span className="lst-veg">
              <ConfirmAction
                className="icon-btn-sm"
                ariaLabel={`${r.title} törlése`}
                title="Vizsgálat törlése"
                message={`A(z) „${r.title}" vizsgálat és a hozzá rögzített adatok véglegesen törlődnek. Ez nem vonható vissza.`}
                onConfirm={() => deleteExam(r.id)}
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
