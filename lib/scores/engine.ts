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

/**
 * Látszik-e a tétel a jelenlegi válaszok mellett.
 *
 * A feltételes tétel egy jelölőnégyzetre hivatkozik. A NEWS2 két SpO₂-skálája
 * közül mindig csak az egyik érvényes; a másik nem pontozhat, és a
 * kiértékelést sem akadályozhatja azzal, hogy megválaszolatlan marad.
 */
export function itemVisible(t: Test, a: Answers, i: number): boolean {
  const c = (t.items ?? [])[i]?.showIf
  if (!c) return true
  const v = a[c.item]
  const be = Array.isArray(v) ? v.length > 0 : v != null
  return be === c.checked
}

export function testScore(t: Test, a: Answers): number {
  const comp = TEST_COMPUTE[t.id]
  if (comp) return comp(t, a)
  let s = 0
  ;(t.items ?? []).forEach((it: TestItem, i: number) => {
    if (!itemVisible(t, a, i)) return
    const v = a[i]
    if (it.type === 'check') {
      if (Array.isArray(v)) v.forEach((x) => (s += Number(x)))
    } else if (v != null && v !== ('' as unknown)) {
      s += Number(v)
    }
  })
  return Math.round(s * 10) / 10
}

/** Egy tétel hozzájárulása a pontszámhoz. */
export interface ItemScore {
  /** A kérdés rövidített szövege — a bontásban ez azonosítja a tételt. */
  label: string
  /** Hány pontot adott ez a tétel. */
  points: number
  /** Megválaszolt-e egyáltalán. */
  answered: boolean
}

/**
 * Tételenkénti pontbontás.
 *
 * Eddig csak az összpontszám látszott, ami nem mutatta meg, melyik tétel
 * mennyit adott hozzá. Ez a bontás egyben ellenőrzés is: a felhasználó látja,
 * hogy a rendszer úgy értette-e a válaszait, ahogy gondolta.
 *
 * A saját számítású pontozóknál — ahol a képlet nem tételek összege, például
 * a testtömegindexnél — nincs értelmezhető bontás, ilyenkor üres a lista.
 */
export function testItemScores(t: Test, a: Answers): ItemScore[] {
  if (TEST_COMPUTE[t.id]) return []
  return (t.items ?? []).flatMap((it: TestItem, i: number) => {
    // A rejtett tétel a bontásban sem jelenik meg — nem adott pontot.
    if (!itemVisible(t, a, i)) return []
    const v = a[i]
    let points = 0
    let answered = false
    if (it.type === 'check') {
      if (Array.isArray(v) && v.length > 0) {
        v.forEach((x) => (points += Number(x)))
        answered = true
      }
    } else if (v != null && v !== ('' as unknown)) {
      points = Number(v)
      answered = true
    }
    return [{
      // A hosszú kérdéseket rövidítjük: a bontásban a felismerhetőség számít.
      label: it.q.length > 46 ? it.q.slice(0, 44).trimEnd() + '…' : it.q,
      points: Math.round(points * 10) / 10,
      answered,
    }]
  })
}

/**
 * Azok a tételek, amelyek önmagukban elérik a sürgősségi küszöböt.
 *
 * A NEWS2-nél bármely EGY paraméter 3 pontja sürgős felülvizsgálatot indokol,
 * akkor is, ha az összpontszám alacsony sávba esik. Ez a szabály eddig csak a
 * sáv tanácsszövegében szerepelt — vagyis épp annál a betegnél volt apróbetűs,
 * akinél számít.
 */
export function testItemFlags(t: Test, a: Answers): ItemScore[] {
  const f = t.itemFlag
  if (!f) return []
  return testItemScores(t, a).filter((x) => x.answered && x.points >= f.points)
}

export function testComplete(t: Test, a: Answers): boolean {
  return (t.items ?? []).every((it: TestItem, i: number) =>
    it.type === 'check' || !itemVisible(t, a, i)
      ? true
      : a[i] != null && (a[i] as unknown) !== '',
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
