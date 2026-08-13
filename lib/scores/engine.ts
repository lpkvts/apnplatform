import type { Test, TestBand, TestItem } from './data'

// Válaszok egy teszthez: itemIndex -> érték (radio/slider/num) vagy értékek (check)
export type Answers = Record<number, number | number[]>

// Számított tesztek (a felhasználói válaszokból közvetlenül képzett pontszám)
const TEST_COMPUTE: Record<string, (t: Test, a: Answers) => number> = {
  bmi: (_t, a) => {
    const w = Number(a[0])
    const h = Number(a[1]) / 100
    if (!w || !h || h <= 0) return 0
    return Math.round((w / (h * h)) * 10) / 10
  },
  camicu: (_t, a) => {
    const g = (i: number) =>
      Array.isArray(a[i]) ? (a[i] as number[]).reduce((x, y) => x + Number(y), 0) : 0
    const f1 = g(0) > 0
    const f2 = g(1) > 0
    const f3 = g(2) > 0
    const f4 = g(3) > 0
    return f1 && f2 && (f3 || f4) ? 1 : 0
  },
}

export function testScore(t: Test, a: Answers): number {
  const comp = TEST_COMPUTE[t.id]
  if (comp) return comp(t, a)
  let s = 0
  ;(t.items ?? []).forEach((it: TestItem, i: number) => {
    const v = a[i]
    if (it.type === 'check') {
      if (Array.isArray(v)) v.forEach((x) => (s += Number(x)))
    } else if (v != null && v !== ('' as unknown)) {
      s += Number(v)
    }
  })
  return Math.round(s * 10) / 10
}

export function testComplete(t: Test, a: Answers): boolean {
  return (t.items ?? []).every((it: TestItem, i: number) =>
    it.type === 'check' ? true : a[i] != null && (a[i] as unknown) !== '',
  )
}

export function testBand(t: Test, s: number): TestBand | null {
  return (t.bands ?? []).find((b) => s >= b.min && s <= b.max) ?? null
}

export const RISK_LABEL: Record<TestBand['risk'], string> = {
  low: 'Alacsony',
  mid: 'Közepes',
  high: 'Magas',
  crit: 'Kritikus',
}
