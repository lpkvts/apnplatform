import { type Values, type Sample } from './data'

/**
 * A vérgázlelet sorai — úgy csoportosítva, ahogy a készülék kinyomtatja.
 *
 * Élesben senki nem beviteli mezőket lát, hanem egy leletet: fejléc, mért
 * értékek, oximetria, elektrolitok, metabolitok, majd a számított értékek.
 * Ez a nézet azt a képet adja vissza, és a vezetett elemzés lépései ennek a
 * sorait emelik ki — ugyanúgy, ahogy az EKG-elemzés a görbe szakaszait.
 */

export type Csoport = 'vergaz' | 'oximetria' | 'elektrolit' | 'metabolit' | 'szamitott'

export const CSOPORT_LABEL: Record<Csoport, string> = {
  vergaz: 'Vérgáz',
  oximetria: 'Oximetria',
  elektrolit: 'Elektrolitok',
  metabolit: 'Metabolitok',
  szamitott: 'Számított értékek',
}

export interface Sor {
  /** A lelet szokásos jelölése. */
  jel: string
  /** Magyar megnevezés. */
  nev: string
  egyseg: string
  ertek: number | null
  low: number
  high: number
  /** Számított érték-e — a leleteken ezek külön blokkban állnak. */
  szamitott?: boolean
  /** A fogalomtár kulcsa, ha van hozzá magyarázat. */
  fogalom?: string
  /** Mely elemzési lépésnél emeljük ki. */
  lepes?: string[]
}

export interface Lelet {
  csoport: Csoport
  sorok: Sor[]
}

/** A leletsorok előállítása a megadott értékekből. */
export function leletSorok(v: Values, sample: Sample): Lelet[] {
  const ven = sample === 'venas'

  // Számított értékek — a készülék is ezeket adja meg külön blokkban.
  const ag = v.na != null && v.cl != null && v.hco3 != null
    ? v.na - (v.cl + v.hco3) : null
  const agKorr = ag != null && v.alb != null ? ag + 2.5 * ((40 - v.alb) / 10) : null
  const pf = v.po2 != null && v.fio2 ? v.po2 / v.fio2 : null

  return [
    {
      csoport: 'vergaz',
      sorok: [
        { jel: 'pH', nev: 'pH', egyseg: '', ertek: v.ph,
          low: ven ? 7.31 : 7.35, high: ven ? 7.41 : 7.45, fogalom: 'ph', lepes: ['ph'] },
        { jel: 'pCO₂', nev: 'Szén-dioxid parciális nyomás', egyseg: 'Hgmm', ertek: v.pco2,
          low: ven ? 41 : 35, high: ven ? 51 : 45, fogalom: 'pco2', lepes: ['ok', 'komp'] },
        { jel: 'pO₂', nev: 'Oxigén parciális nyomás', egyseg: 'Hgmm', ertek: v.po2,
          low: ven ? 35 : 80, high: ven ? 45 : 100, fogalom: 'po2', lepes: ['oxi'] },
      ],
    },
    {
      csoport: 'oximetria',
      sorok: [
        { jel: 'sO₂', nev: 'Oxigénszaturáció', egyseg: '%', ertek: v.sao2,
          low: ven ? 70 : 95, high: 100, fogalom: 'sao2', lepes: ['oxi'] },
        { jel: 'ctHb', nev: 'Hemoglobin', egyseg: 'g/l', ertek: v.hb, low: 120, high: 170 },
      ],
    },
    {
      csoport: 'elektrolit',
      sorok: [
        { jel: 'cNa⁺', nev: 'Nátrium', egyseg: 'mmol/l', ertek: v.na, low: 135, high: 145, lepes: ['ag'] },
        { jel: 'cK⁺', nev: 'Kálium', egyseg: 'mmol/l', ertek: v.k, low: 3.5, high: 5.1 },
        { jel: 'cCl⁻', nev: 'Klorid', egyseg: 'mmol/l', ertek: v.cl, low: 98, high: 107, lepes: ['ag'] },
        { jel: 'cCa²⁺', nev: 'Ionizált kalcium', egyseg: 'mmol/l', ertek: v.ca, low: 1.15, high: 1.32 },
      ],
    },
    {
      csoport: 'metabolit',
      sorok: [
        { jel: 'cLac', nev: 'Laktát', egyseg: 'mmol/l', ertek: v.lact, low: 0.5, high: 2, fogalom: 'lact' },
        { jel: 'cGlu', nev: 'Glükóz', egyseg: 'mmol/l', ertek: v.gluk, low: 3.9, high: 5.6 },
        { jel: 'cAlb', nev: 'Albumin', egyseg: 'g/l', ertek: v.alb, low: 35, high: 52, lepes: ['ag'] },
      ],
    },
    {
      csoport: 'szamitott',
      sorok: [
        { jel: 'cHCO₃⁻', nev: 'Bikarbonát', egyseg: 'mmol/l', ertek: v.hco3,
          low: 22, high: 26, szamitott: true, fogalom: 'hco3', lepes: ['ok', 'komp'] },
        { jel: 'cBase(Ecf)', nev: 'Bázistöbblet', egyseg: 'mmol/l', ertek: v.be,
          low: -2, high: 2, szamitott: true, fogalom: 'be' },
        { jel: 'AG', nev: 'Anionrés', egyseg: 'mmol/l', ertek: ag,
          low: 8, high: 12, szamitott: true, fogalom: 'ag', lepes: ['ag'] },
        { jel: 'AG(korr)', nev: 'Albuminra korrigált anionrés', egyseg: 'mmol/l', ertek: agKorr,
          low: 8, high: 12, szamitott: true, fogalom: 'ag', lepes: ['ag'] },
        { jel: 'pO₂/FiO₂', nev: 'P/F-hányados', egyseg: '', ertek: pf,
          low: 300, high: 500, szamitott: true, fogalom: 'pf', lepes: ['oxi'] },
      ],
    },
  ]
}

/** A lelet fejlécadatai. */
export function leletFejlec(v: Values, sample: Sample) {
  return [
    { cimke: 'Minta', ertek: sample === 'arterias' ? 'Artériás vér' : 'Vénás vér' },
    { cimke: 'FiO₂', ertek: v.fio2 != null ? `${Math.round(v.fio2 * 100)} %` : '—' },
    { cimke: 'Életkor', ertek: v.kor != null ? `${v.kor} év` : '—' },
    { cimke: 'Légzésszám', ertek: v.legzesszam != null ? `${v.legzesszam}/perc` : '—' },
  ]
}

/** Nyíljelölés a referenciatartományhoz képest, ahogy a leleteken szokás. */
export function nyil(s: Sor): '↑' | '↓' | '' {
  if (s.ertek == null) return ''
  if (s.ertek > s.high) return '↑'
  if (s.ertek < s.low) return '↓'
  return ''
}

/** Egy tizedesjegy-szabály értékenként — a leletek is így írják ki. */
export function formaz(s: Sor): string {
  if (s.ertek == null) return '—'
  if (s.jel === 'pH') return s.ertek.toFixed(2)
  if (s.jel === 'cCa²⁺') return s.ertek.toFixed(2)
  if (['cLac', 'cGlu', 'cK⁺', 'cBase(Ecf)', 'cHCO₃⁻', 'AG', 'AG(korr)'].includes(s.jel)) {
    return s.ertek.toFixed(1)
  }
  return String(Math.round(s.ertek))
}
